export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: Date;
  path: string;
  extension?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface DirectoryPath {
  name: string;
  path: string;
}