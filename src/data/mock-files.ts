import { FileItem } from '@/types';
import { generateFileId, getFileExtension } from '@/lib/file-utils';

// Mock file system data
export const mockFileSystem: FileItem[] = [
  // Root level folders
  {
    id: generateFileId(),
    name: 'Documents',
    type: 'folder',
    lastModified: new Date('2024-01-15'),
    path: '/Documents',
  },
  {
    id: generateFileId(),
    name: 'Images',
    type: 'folder',
    lastModified: new Date('2024-01-10'),
    path: '/Images',
  },
  {
    id: generateFileId(),
    name: 'Projects',
    type: 'folder',
    lastModified: new Date('2024-01-20'),
    path: '/Projects',
  },
  
  // Root level files
  {
    id: generateFileId(),
    name: 'README.md',
    type: 'file',
    size: 2048,
    lastModified: new Date('2024-01-22'),
    path: '/README.md',
    extension: getFileExtension('README.md'),
  },
  {
    id: generateFileId(),
    name: 'config.json',
    type: 'file',
    size: 512,
    lastModified: new Date('2024-01-18'),
    path: '/config.json',
    extension: getFileExtension('config.json'),
  },
  
  // Documents folder contents
  {
    id: generateFileId(),
    name: 'report.pdf',
    type: 'file',
    size: 1024000,
    lastModified: new Date('2024-01-15'),
    path: '/Documents/report.pdf',
    extension: getFileExtension('report.pdf'),
  },
  {
    id: generateFileId(),
    name: 'notes.txt',
    type: 'file',
    size: 4096,
    lastModified: new Date('2024-01-14'),
    path: '/Documents/notes.txt',
    extension: getFileExtension('notes.txt'),
  },
  {
    id: generateFileId(),
    name: 'presentation.pptx',
    type: 'file',
    size: 5120000,
    lastModified: new Date('2024-01-12'),
    path: '/Documents/presentation.pptx',
    extension: getFileExtension('presentation.pptx'),
  },
  
  // Images folder contents
  {
    id: generateFileId(),
    name: 'photo1.jpg',
    type: 'file',
    size: 2048000,
    lastModified: new Date('2024-01-10'),
    path: '/Images/photo1.jpg',
    extension: getFileExtension('photo1.jpg'),
  },
  {
    id: generateFileId(),
    name: 'screenshot.png',
    type: 'file',
    size: 1536000,
    lastModified: new Date('2024-01-08'),
    path: '/Images/screenshot.png',
    extension: getFileExtension('screenshot.png'),
  },
  {
    id: generateFileId(),
    name: 'logo.svg',
    type: 'file',
    size: 8192,
    lastModified: new Date('2024-01-05'),
    path: '/Images/logo.svg',
    extension: getFileExtension('logo.svg'),
  },
  
  // Projects folder contents
  {
    id: generateFileId(),
    name: 'webapp',
    type: 'folder',
    lastModified: new Date('2024-01-20'),
    path: '/Projects/webapp',
  },
  {
    id: generateFileId(),
    name: 'mobile-app',
    type: 'folder',
    lastModified: new Date('2024-01-18'),
    path: '/Projects/mobile-app',
  },
  
  // Projects/webapp contents
  {
    id: generateFileId(),
    name: 'index.html',
    type: 'file',
    size: 4096,
    lastModified: new Date('2024-01-20'),
    path: '/Projects/webapp/index.html',
    extension: getFileExtension('index.html'),
  },
  {
    id: generateFileId(),
    name: 'app.js',
    type: 'file',
    size: 8192,
    lastModified: new Date('2024-01-19'),
    path: '/Projects/webapp/app.js',
    extension: getFileExtension('app.js'),
  },
  {
    id: generateFileId(),
    name: 'style.css',
    type: 'file',
    size: 2048,
    lastModified: new Date('2024-01-19'),
    path: '/Projects/webapp/style.css',
    extension: getFileExtension('style.css'),
  },
];

export function getFilesByPath(path: string): FileItem[] {
  const normalizedPath = path === '/' ? '' : path;
  
  return mockFileSystem.filter(item => {
    if (normalizedPath === '') {
      // Root directory - show items that don't have additional path segments
      return !item.path.substring(1).includes('/');
    }
    
    // For subdirectories, show direct children
    const itemParentPath = item.path.substring(0, item.path.lastIndexOf('/')) || '/';
    return itemParentPath === normalizedPath;
  });
}

export function getPathSegments(path: string): Array<{ name: string; path: string }> {
  if (path === '/' || path === '') return [];
  
  const segments = path.split('/').filter(Boolean);
  const result = [];
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += '/' + segment;
    result.push({
      name: segment,
      path: currentPath,
    });
  }
  
  return result;
}