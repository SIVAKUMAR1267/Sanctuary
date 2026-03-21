import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import StorageConnections from './StorageConnections';
import KeyManager from './Keymanager';
import { decryptFile, setupLocalRSAKeys } from '../utils/encryption';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const Dashboard = ({ token, user, logout }) => {
  const [files, setFiles] = useState([]);
  const [isGDriveConnected, setIsGDriveConnected] = useState(false); // NEW STATE
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);

  useEffect(() => {
    setupLocalRSAKeys().catch(err => console.error("Key Setup Failed:", err));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Fetch files
      const filesRes = await axios.get('http://localhost:5000/myfiles', { headers: { Authorization: `Bearer ${token}` } });
      setFiles(filesRes.data);
      
      // Fetch Drive Connection Status
      const driveRes = await axios.get('http://localhost:5000/user/connections', { headers: { Authorization: `Bearer ${token}` } });
      setIsGDriveConnected(driveRes.data.gdriveConnected);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally {
      setIsCheckingDrive(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData])

  const handleDelete = async (fileId) => {
    if (!window.confirm("Let this memory return to the earth? (Permanently delete)")) return;
    try {
      await axios.delete(`http://localhost:5000/delete/${fileId}`, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(current => current.filter(f => f._id !== fileId));
    } catch (err) { alert("Delete failed"); }
  };

  const handleDownload = async (fileId, fileName) => {
     /* ... existing download/decrypt logic remains untouched ... */
     try {
      const fileRes = await axios.get(`http://localhost:5000/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
      });
      const metaRes = await axios.get(`http://localhost:5000/request-file-metadata/${fileId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      const { encryptedKey, iv, totalChunks } = metaRes.data;
      const decryptedBlob = await decryptFile(fileRes.data, encryptedKey, iv, totalChunks);

      const url = window.URL.createObjectURL(decryptedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Decryption Failed! Are you missing your local Private Key?");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-24">
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div>
          <h2 className="text-5xl text-foreground font-serif tracking-tight">Welcome, {user}</h2>
          <p className="text-muted-foreground font-sans mt-2">Your sanctuary of secure files.</p>
        </div>
        <Button variant="outline" onClick={logout}>Depart</Button>
      </header>

      <KeyManager onKeysRestored={fetchData} />
      
      {/* Pass the state to StorageConnections */}
      <StorageConnections 
        token={token} 
        isConnected={isGDriveConnected} 
        isLoading={isCheckingDrive} 
      />

      {/* Pass the state to FileUpload so it can lock itself! */}
      <FileUpload 
        token={token} 
        refreshFiles={fetchData} 
        isConnected={isGDriveConnected} 
      />
      
      <div className="mt-16">
        <h3 className="text-3xl font-serif text-foreground mb-8">Your Library</h3>
        
        {files.length === 0 ? (
          <p className="text-muted-foreground italic text-lg">Your library is currently empty. Plant a new file above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {files.map((file, index) => (
              <Card key={file._id} asymmetric={index % 2 === 0} className="flex flex-col justify-between !p-6">
                <div className="mb-6">
                  <span className="font-sans font-bold text-lg text-foreground block truncate" title={file.originalName}>
                    {file.originalName}
                  </span>
                </div>
                
                <div className="flex gap-3 mt-auto">
                  <Button size="sm" onClick={() => handleDownload(file._id, file.originalName)} className="flex-1">
                    Retrieve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(file._id)} className="!border-destructive !text-destructive hover:!bg-destructive/10">
                    Burn
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;