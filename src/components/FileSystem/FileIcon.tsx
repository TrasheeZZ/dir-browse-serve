import { 
  File, 
  Folder, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio,
  FileCode,
  Archive,
  FileSpreadsheet
} from 'lucide-react';
import { FileItem } from '@/types';

interface FileIconProps {
  item: FileItem;
  className?: string;
}

export function FileIcon({ item, className = "h-5 w-5" }: FileIconProps) {
  if (item.type === 'folder') {
    return <Folder className={`${className} text-amber-600`} />;
  }

  const extension = item.extension?.toLowerCase();
  
  if (!extension) {
    return <File className={`${className} text-muted-foreground`} />;
  }

  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(extension)) {
    return <FileImage className={`${className} text-green-600`} />;
  }

  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
    return <FileVideo className={`${className} text-purple-600`} />;
  }

  // Audio files
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(extension)) {
    return <FileAudio className={`${className} text-pink-600`} />;
  }

  // Code files
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'].includes(extension)) {
    return <FileCode className={`${className} text-blue-600`} />;
  }

  // Text/Document files
  if (['txt', 'md', 'doc', 'docx', 'pdf', 'rtf'].includes(extension)) {
    return <FileText className={`${className} text-gray-600`} />;
  }

  // Spreadsheet files
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FileSpreadsheet className={`${className} text-emerald-600`} />;
  }

  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
    return <Archive className={`${className} text-orange-600`} />;
  }

  return <File className={`${className} text-muted-foreground`} />;
}