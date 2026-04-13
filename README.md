# Campus Event Management System (CEMS)

A premium, intelligent platform to manage and discover campus events.

## Features
- **Frontend**: React (Vite) with Framer Motion animations and Glassmorphism UI.
- **Backend**: Node.js/Express with JWT Auth and RBAC (Admin/Student).
- **Database**: PostgreSQL (Schema included).
- **AI Integration**: Event recommendations based on interests and AI description generator for admins.
- **Real-time**: Live event alerts via Socket.io.
- **Participation**: Event registration with QR code generation.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### 1. Database Setup
1. Ensure PostgreSQL is running.
2. Run the initialization script (updates password/port and creates tables):
   ```bash
   cd server
   npm run init-db
   ```

### 2. Run the Application
You can now run both the backend and frontend from the root directory:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000


## Folder Structure
- `client/`: React source code.
- `server/`: Express API source code.
- `server/schema.sql`: Database definition.
