import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Sprout } from 'lucide-react';
import FileUpload from './FileUpload';
import StorageConnections from './StorageConnections';
import KeyManager from './Keymanager';
import { decryptFile, setupLocalRSAKeys } from '../utils/encryption';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import api from '../api';

const Dashboard = ({ token, user, logout }) => {
  const [files, setFiles] = useState([]);
  const [isGDriveConnected, setIsGDriveConnected] = useState(false);
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);

  useEffect(() => {
    setupLocalRSAKeys().catch(err => console.error("Key Setup Failed:", err));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const filesRes = await api.get('/myfiles', { headers: { Authorization: `Bearer ${token}` } });
      setFiles(filesRes.data);
      
      const driveRes = await api.get('/user/connections', { headers: { Authorization: `Bearer ${token}` } });
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
      await api.delete(`/delete/${fileId}`, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(current => current.filter(f => f._id !== fileId));
    } catch (err) { alert("Delete failed"); }
  };

  const handleDownload = async (fileId, fileName) => {
     try {
      const fileRes = await api.get(`/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
      });
      const metaRes = await api.get(`/request-file-metadata/${fileId}`, {
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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-10%] w-[100vw] md:w-[50vw] max-w-[500px] h-[500px] bg-secondary/10 rounded-blob-1 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[100vw] md:w-[60vw] max-w-[600px] h-[600px] bg-primary/10 rounded-blob-2 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-8 md:pt-40 md:pb-24 relative z-10">
        
        {/* Welcome Header: Scaled text-4xl for mobile */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl text-foreground font-serif tracking-tight">
              Welcome, <br className="block sm:hidden" /><span className="text-primary italic">{user}</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-sans mt-2 md:mt-3 leading-relaxed">
              Your sanctuary of secure files.
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="w-full md:w-auto !border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">
            Depart
          </Button>
        </header>

        <div className="space-y-6 md:space-y-8 mb-10 md:mb-16">
          <KeyManager onKeysRestored={fetchData} />
          <StorageConnections token={token} isConnected={isGDriveConnected} isLoading={isCheckingDrive} />
        </div>

        <FileUpload token={token} refreshFiles={fetchData} isConnected={isGDriveConnected} />
        
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <h3 className="text-2xl md:text-4xl font-serif text-foreground tracking-tight">Your Library</h3>
            <div className="h-px bg-border/50 flex-1 mt-1 md:mt-2"></div>
          </div>
          
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 border-2 border-dashed border-border/50 rounded-[2rem] md:rounded-[3rem] bg-white/30 backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm">
                <Sprout className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h4 className="text-xl md:text-2xl font-serif text-foreground mb-2 md:mb-3">The soil is ready.</h4>
              <p className="text-sm md:text-base text-muted-foreground font-sans text-center max-w-md leading-relaxed">
                Your library is currently empty. Plant a new file in the sanctuary above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {files.map((file, index) => (
                <Card key={file._id} asymmetric={index % 2 === 0} className="flex flex-col justify-between group p-6 md:p-8">
                  <div className="mb-6 md:mb-8 flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-xl md:rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500 shrink-0">
                      <FileText className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-serif font-semibold text-lg md:text-xl text-foreground truncate" title={file.originalName}>
                        {file.originalName}
                      </h4>
                      <p className="text-xs md:text-sm font-sans text-muted-foreground mt-1 uppercase tracking-wider font-bold">
                        Encrypted Memory
                      </p>
                    </div>
                  </div>
                  
                  {/* Buttons stack vertically on tiny screens, horizontally on anything larger */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-auto">
                    <Button size="sm" onClick={() => handleDownload(file._id, file.originalName)} className="w-full sm:flex-1 shadow-sm">
                      Retrieve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(file._id)} className="w-full sm:w-auto !border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10 px-6">
                      Burn
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;