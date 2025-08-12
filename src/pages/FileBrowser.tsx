import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Breadcrumb } from '@/components/FileSystem/Breadcrumb';
import { FileList } from '@/components/FileSystem/FileList';
import { UploadZone } from '@/components/FileSystem/UploadZone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getFilesByPath, getPathSegments, mockFileSystem } from '@/data/mock-files';
import { FileItem } from '@/types';
import { generateFileId, getFileExtension } from '@/lib/file-utils';

export default function FileBrowser() {
  const [currentPath, setCurrentPath] = useState('/');
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState(mockFileSystem);
  const { user, isAuthenticated } = useAuth();

  const currentFiles = getFilesByPath(currentPath);
  const pathSegments = getPathSegments(currentPath);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setShowUpload(false);
  };

  const handleUpload = (uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map(file => ({
      id: generateFileId(),
      name: file.name,
      type: 'file' as const,
      size: file.size,
      lastModified: new Date(),
      path: currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`,
      extension: getFileExtension(file.name),
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setShowUpload(false);
  };

  const handleDelete = (item: FileItem) => {
    setFiles(prev => prev.filter(file => file.id !== item.id));
  };

  const handleRefresh = () => {
    // In a real app, this would refetch data from the server
    setFiles([...mockFileSystem]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Breadcrumb path={pathSegments} onNavigate={handleNavigate} />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-xs"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              
              {isAuthenticated && (
                <Button
                  variant={showUpload ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setShowUpload(!showUpload)}
                  className="text-xs"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {showUpload ? 'Cancel Upload' : 'Upload Files'}
                </Button>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          {showUpload && isAuthenticated && (
            <UploadZone
              currentPath={currentPath}
              onUpload={handleUpload}
            />
          )}

          {/* File List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {currentPath === '/' ? 'Root Directory' : pathSegments[pathSegments.length - 1]?.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {currentFiles.length} item{currentFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <FileList
              items={currentFiles}
              onNavigate={handleNavigate}
              onDelete={user?.role === 'ADMIN' ? handleDelete : undefined}
            />
          </Card>

          {/* Access Info */}
          <Card className="p-4 bg-muted/50">
            <div className="text-sm text-muted-foreground">
              {!isAuthenticated && (
                <p>You are browsing as a guest. You can download files but cannot upload or delete them.</p>
              )}
              {isAuthenticated && user?.role === 'USER' && (
                <p>Logged in as <strong>{user.username}</strong> (USER). You can browse, download, and upload files.</p>
              )}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <p>Logged in as <strong>{user.username}</strong> (ADMIN). You have full access to all operations.</p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}