import { useState } from 'react';
import { FileItem } from '@/types';
import { FileIcon } from './FileIcon';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Trash2, 
  MoreHorizontal,
  Eye 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { formatFileSize, formatDate } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface FileListProps {
  items: FileItem[];
  onNavigate: (path: string) => void;
  onDelete?: (item: FileItem) => void;
}

export function FileList({ items, onNavigate, onDelete }: FileListProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      onNavigate(item.path);
    }
  };

  const handleDownload = (item: FileItem) => {
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`,
    });
  };

  const handleDelete = (item: FileItem) => {
    if (onDelete) {
      onDelete(item);
      toast({
        title: "File Deleted",
        description: `${item.name} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const canDelete = user?.role === 'ADMIN';

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileIcon 
          item={{ id: '', name: '', type: 'folder', lastModified: new Date(), path: '' }} 
          className="h-12 w-12 mb-4 text-muted-foreground opacity-50" 
        />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No files found</h3>
        <p className="text-sm text-muted-foreground">This directory is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-file-hover group ${
            selectedItem === item.id ? 'bg-accent' : ''
          }`}
          onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
        >
          <div 
            className="flex items-center space-x-3 flex-1 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <FileIcon item={item} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{formatDate(item.lastModified)}</span>
                {item.size && <span>{formatFileSize(item.size)}</span>}
                <span className="capitalize">{item.type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.type === 'file' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item);
                }}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleItemClick(item)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {item.type === 'folder' ? 'Open' : 'View'}
                </DropdownMenuItem>
                {item.type === 'file' && (
                  <DropdownMenuItem onClick={() => handleDownload(item)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem 
                    onClick={() => handleDelete(item)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}