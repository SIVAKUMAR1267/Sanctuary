require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { google } = require('googleapis'); // Essential for the Cloud setup

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FOLDER SETUP ---
const uploadDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'uploads/temp');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Stores the user's connection to Google Drive
    gdrive: {
        refreshToken: String,
        connected: { type: Boolean, default: false }
    }
});
const UserModel = mongoose.model('User', UserSchema);

const FileSchema = new mongoose.Schema({
    originalName: String,
    cloudId: String, // Google Drive File ID replaces the local path
    totalChunks: Number,
    size: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    encryptedKey: String, 
    iv: String,           
    uploadDate: { type: Date, default: Date.now }
});
const FileModel = mongoose.model('File', FileSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

const upload = multer({ dest: 'uploads/temp/' });

// ==========================================
// GOOGLE OAUTH & CONNECTION ROUTES
// ==========================================
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5000/auth/google/callback'
);

// 1. Get Google Login URL
app.get('/auth/google/url', authenticateToken, (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/drive.file'],
        state: req.user.id
    });
    res.json({ url });
});

// 2. Google Callback (Handles the tokens)
app.get('/auth/google/callback', async (req, res) => {
    const { code, state: userId } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        const updateData = { 'gdrive.connected': true };
        
        // Only update the refresh token if Google gives us a new one
        if (tokens.refresh_token) {
            updateData['gdrive.refreshToken'] = tokens.refresh_token;
            console.log("✅ Received new Google Refresh Token");
        }

        await UserModel.findByIdAndUpdate(userId, { $set: updateData });
        res.redirect('http://localhost:3000/dashboard?gdrive=success');
    } catch (error) {
        console.error("OAuth Error:", error);
        res.redirect('http://localhost:3000/dashboard?gdrive=error');
    }
});

// 3. Check Connection Status for Dashboard
app.get('/user/connections', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        res.json({ gdriveConnected: user?.gdrive?.connected || false });
    } catch (err) {
        res.status(500).json({ error: "Failed to check connection" });
    }
});

// ==========================================
// FILE ROUTES
// ==========================================

// 1. VIRUS SCAN PROXY
app.post('/scan-file', authenticateToken, async (req, res) => {
    const { fileHash } = req.body;
    try {
        const existingScan = await FileModel.findOne({ fileHash: fileHash }); 
        if (existingScan) return res.json({ data: { attributes: { last_analysis_stats: { malicious: 0 } } } });
        
        const response = await axios.get(`https://www.virustotal.com/api/v3/files/${fileHash}`, {
            headers: { 'x-apikey': process.env.VT_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) return res.json({ message: "File unknown to VT" });
        res.status(500).json({ error: "Scan failed" });
    }
});

// 2. AUTHENTICATION
// 2. AUTHENTICATION
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // --- 1. Password Validation ---
        // Regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        
        if (!password) {
            return res.status(400).json({ error: "Password is required." });
        }
        
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number." 
            });
        }

        // --- 2. Unique User Validation ---
        // Proactively check if the username is already claimed
        const existingUser = await UserModel.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, 'i') } // Case-insensitive check!
        });

        if (existingUser) {
            return res.status(400).json({ error: "This username is already taken. Please choose another." });
        }

        // --- 3. Secure and Save ---
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();
        
        res.json({ message: "Welcome to your sanctuary! Registration complete." });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "An internal server error occurred during registration." });
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username });
});

// 3. GET DASHBOARD FILES
app.get('/myfiles', authenticateToken, async (req, res) => {
    try {
        const files = await FileModel.find({ owner: req.user.id });
        res.json(files);
    } catch (err) { 
        res.status(500).json({ error: "Error fetching files" }); 
    }
});

// 4. UPLOAD (Strict Google Drive Enforcement)
app.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user.gdrive || !user.gdrive.refreshToken) {
            return res.status(403).json({ error: "Google Drive connection is required to upload." });
        }

        if (!req.file) throw new Error("No file received");

        const { chunkIndex, totalChunks, originalName, passwordHash, salt } = req.body;
        
        const chunkPath = req.file.path;
        const targetPath = path.join(tempDir, `${originalName}-${chunkIndex}-${req.user.id}`);
        fs.renameSync(chunkPath, targetPath);

        if (Number(chunkIndex) === Number(totalChunks) - 1) {
            console.log(`✅ Last chunk for ${originalName}. Merging & Uploading to Drive...`);
            
            // Wait for it to upload to Google Drive before telling the frontend we are done
            await mergeChunks(
                originalName, 
                Number(totalChunks), 
                req.user.id, 
                passwordHash, 
                salt,
                user.gdrive.refreshToken 
            );
            
            res.json({ message: "Upload complete! Planted in personal cloud..." });
        } else {
            res.json({ message: `Chunk ${chunkIndex} stored` });
        }
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 5. DOWNLOAD (Streams directly from Google Drive)
app.get('/download/:id', authenticateToken, async (req, res) => {
    try {
        const fileMeta = await FileModel.findById(req.params.id);
        const user = await UserModel.findById(req.user.id);
        
        if (!fileMeta || fileMeta.owner.toString() !== req.user.id) return res.status(403).send("Access Denied");

        res.setHeader('Content-Disposition', `attachment; filename="${fileMeta.originalName}"`);

        // Use the user's specific Google token to grab the file and pipe it back
        if (user.gdrive && user.gdrive.refreshToken && fileMeta.cloudId) {
            const userOAuthClient = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            userOAuthClient.setCredentials({ refresh_token: user.gdrive.refreshToken });
            const drive = google.drive({ version: 'v3', auth: userOAuthClient });

            const driveRes = await drive.files.get({ fileId: fileMeta.cloudId, alt: 'media' }, { responseType: 'stream' });
            driveRes.data.pipe(res);
        } else {
            res.status(404).send("File not found in cloud storage.");
        }
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).send("Error downloading file");
    }
});

// 6. GET FILE METADATA
app.get('/request-file-metadata/:id', authenticateToken, async (req, res) => {
    try {
        const fileMeta = await FileModel.findById(req.params.id);
        if (!fileMeta) return res.status(404).json({ error: "File not found" });
        if (fileMeta.owner.toString() !== req.user.id) return res.status(403).json({ error: "Access Denied" });

        res.json({
            encryptedKey: fileMeta.encryptedKey, 
            iv: fileMeta.iv,
            totalChunks: fileMeta.totalChunks
        });

    } catch (err) {
        console.error("Metadata Error:", err);
        res.status(500).json({ error: "Failed to retrieve file metadata" });
    }
});

// 7. DELETE FILE (Removes from Google Drive & MongoDB)
app.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const fileMeta = await FileModel.findById(req.params.id);
        const user = await UserModel.findById(req.user.id);

        if (!fileMeta) return res.status(404).json({ message: "File not found" });
        if (fileMeta.owner.toString() !== req.user.id) return res.status(403).json({ message: "Access Denied" });

        // First, delete from Google Drive
        if (user.gdrive && user.gdrive.refreshToken && fileMeta.cloudId) {
            try {
                const userOAuthClient = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                );
                userOAuthClient.setCredentials({ refresh_token: user.gdrive.refreshToken });
                const drive = google.drive({ version: 'v3', auth: userOAuthClient });
                
                await drive.files.delete({ fileId: fileMeta.cloudId });
                console.log(`☁️ File deleted from Google Drive`);
            } catch (driveErr) {
                console.warn("⚠️ File already missing from Drive or Drive Error:", driveErr.message);
            }
        }

        // Second, delete from MongoDB
        await FileModel.findByIdAndDelete(req.params.id);
        console.log("✅ Database record deleted");
        res.json({ message: "File deleted successfully" });

    } catch (err) {
        console.error("❌ Delete Error:", err);
        res.status(500).json({ message: "Server error during delete" });
    }
});

// --- HELPER: MERGE CHUNKS & UPLOAD TO GDRIVE ---
const mergeChunks = async (fileName, totalChunks, userId, encryptedKey, iv, refreshToken) => {
    const finalFilename = `${Date.now()}-${fileName}`;
    const localFilePath = path.join(uploadDir, finalFilename);

    try {
        // 1. Merge locally first
        fs.writeFileSync(localFilePath, ''); 
        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(tempDir, `${fileName}-${i}-${userId}`);
            if (fs.existsSync(chunkPath)) {
                fs.appendFileSync(localFilePath, fs.readFileSync(chunkPath));
                fs.unlinkSync(chunkPath);
            } else throw new Error(`Chunk ${i} missing`);
        }

        console.log(`☁️ Uploading exclusively to User's Google Drive...`);
        
        // 2. Upload to Google Drive using the specific user's token
        const userOAuthClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        userOAuthClient.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({ version: 'v3', auth: userOAuthClient });

        const driveRes = await drive.files.create({
            requestBody: { name: finalFilename },
            media: { body: fs.createReadStream(localFilePath) }
        });
        
        const cloudId = driveRes.data.id;

        // 3. Save to MongoDB
        const newFile = new FileModel({
            originalName: fileName,
            cloudId: cloudId, 
            totalChunks: totalChunks,
            size: fs.statSync(localFilePath).size,
            owner: userId,
            encryptedKey: encryptedKey,
            iv: iv
        });

        await newFile.save();
        
        // 4. Wipe the local server clean
        fs.unlinkSync(localFilePath);
        console.log(`🧹 Local temp file destroyed. Only exists in user's Drive now.`);

    } catch (err) {
        console.error("Merge/Upload failed:", err);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        throw err; // Pass error up to be caught by the upload route
    }
};

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));