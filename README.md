# File Index Service - Self-Hosted Backend API

This document describes the API endpoints needed to make the File Index Service fully functional with your own backend server.

## Overview

The frontend expects a REST API server running on your home computer that can:
- Serve files from a specified directory
- Handle user authentication with role-based access
- Manage file operations (browse, upload, download, delete)

## Base URL
```
http://localhost:3001/api
```
*Adjust port as needed for your setup*

## Authentication

### POST /auth/login
Login with username and password.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "string",
    "username": "string",
    "role": "USER" | "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### POST /auth/logout
Logout current user (invalidate token).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/me
Get current user info from token.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "role": "USER" | "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## File Operations

### GET /files?path=/path/to/directory
Browse files and folders in a directory.

**Query Parameters:**
- `path` (string): Directory path to browse (default: "/")

**Headers (Optional):**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "currentPath": "/Documents",
  "items": [
    {
      "id": "unique_id",
      "name": "folder_name",
      "type": "folder",
      "lastModified": "2024-01-01T00:00:00.000Z",
      "path": "/Documents/folder_name"
    },
    {
      "id": "unique_id", 
      "name": "file.txt",
      "type": "file",
      "size": 1024,
      "lastModified": "2024-01-01T00:00:00.000Z",
      "path": "/Documents/file.txt",
      "extension": "txt"
    }
  ]
}
```

### GET /files/download?path=/path/to/file
Download a file.

**Query Parameters:**
- `path` (string): Full path to file

**Response:**
- File stream with appropriate headers:
  - `Content-Type`: Based on file extension
  - `Content-Disposition`: attachment; filename="filename.ext"
  - `Content-Length`: File size

### POST /files/upload
Upload files to a directory. **Requires authentication.**

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Body:**
- `files`: File(s) to upload
- `path`: Target directory path

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "uploadedFiles": [
    {
      "name": "uploaded_file.txt",
      "size": 1024,
      "path": "/target/directory/uploaded_file.txt"
    }
  ]
}
```

### DELETE /files?path=/path/to/file
Delete a file or folder. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `path` (string): Full path to file/folder to delete

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## User Management (ADMIN only)

### GET /admin/users
Get all users. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "username": "string", 
      "role": "USER" | "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /admin/users
Create a new user. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "role": "USER" | "ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "role": "USER" | "ADMIN", 
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /admin/users/:userId
Update a user. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request:**
```json
{
  "username": "string",
  "role": "USER" | "ADMIN",
  "password": "string" // Optional - only if changing password
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "role": "USER" | "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /admin/users/:userId
Delete a user. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "File/Directory not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Implementation Notes

### File System
- Configure a root directory that your server will serve files from
- Use proper path sanitization to prevent directory traversal attacks
- Support common file types and extensions

### Security
- Use JWT tokens for authentication
- Implement proper CORS headers for web browser access
- Validate and sanitize all file paths
- Implement rate limiting to prevent abuse

### User Storage
Store users in a local JSON file (users.json):
```json
{
  "users": [
    {
      "id": "1",
      "username": "admin", 
      "passwordHash": "bcrypt_hash_here",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Example Backend Technologies
- **Node.js**: Express + multer for file uploads
- **Python**: FastAPI + python-multipart
- **Go**: Gin + file handling
- **Rust**: Actix-web + multipart

### Frontend Configuration
Update the frontend to use your backend URL by modifying the API base URL in the code.

## Quick Start Command
Once your backend is running:
```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:8080` and will connect to your backend API.