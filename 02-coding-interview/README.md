# Online Coding Interview Platform

A real-time collaborative coding interview platform that allows interviewers and candidates to share code, collaborate in real-time, and execute code safely in the browser.

## Features

✅ **Shareable Interview Links** - Create and share unique links with candidates  
✅ **Real-time Collaborative Editing** - Multiple users can edit code simultaneously  
✅ **Live Updates** - All connected users see changes in real-time via WebSocket  
✅ **Syntax Highlighting** - Support for multiple programming languages using Monaco Editor (VS Code's editor)  
✅ **In-Browser Code Execution** - Execute code safely in the browser without server-side execution

## Technology Stack

- **Frontend**: React + Vite
- **Backend**: Express.js + Socket.IO
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Real-time Communication**: WebSocket via Socket.IO

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd 02-coding-interview
   ```

2. **Install dependencies**:
   
   The project uses a monorepo structure with separate client and server directories. Install all dependencies with:
   
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   
   # Return to root
   cd ..
   ```

## Running the Application

### Development Mode

From the root directory, run:

```bash
npm run dev
```

This will start both the client and server concurrently:
- **Client (Frontend)**: http://localhost:5173
- **Server (Backend)**: http://localhost:3001

The application will automatically reload when you make changes to the code.

### Running Client and Server Separately

If you prefer to run them separately:

**Terminal 1 - Start the server**:
```bash
npm run server
```

**Terminal 2 - Start the client**:
```bash
npm run client
```

## Configuration

### Environment Variables

The frontend uses environment variables to configure the backend URL. This allows you to deploy to different environments without changing the code.

**Location**: `client/.env.development` or `client/.env.production`

**Available variables**:
- `VITE_BACKEND_URL` - The URL of the backend server (default: `http://localhost:3001`)

### Setting Up for Production

1. **Update the production environment file**:
   
   Edit `client/.env.production`:
   ```env
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

2. **Or set environment variables during build**:
   ```bash
   cd client
   VITE_BACKEND_URL=https://your-backend-domain.com npm run build
   ```

The application will automatically use:
- `.env.development` when running `npm run dev`
- `.env.production` when running `npm run build`

> **Note**: Environment variables must be prefixed with `VITE_` to be exposed to the client-side code in Vite applications.

### Production Build

To build the client for production:

```bash
cd client
npm run build
```

The production-ready files will be in `client/dist/`.

## How to Use

1. **Start the application** using `npm run dev`

2. **Open your browser** and navigate to http://localhost:5173

3. **Create or join a session**:
   - Enter a session ID or use the default one
   - Share the session ID with other participants

4. **Start coding**:
   - All connected users with the same session ID will see real-time updates
   - Select your preferred programming language from the dropdown
   - Write code in the Monaco Editor
   - Use the "Run Code" button to execute code in the browser

5. **Collaborate**:
   - Multiple users can edit simultaneously
   - Changes are synchronized in real-time across all connected clients

## Project Structure

```
02-coding-interview/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── ...
│   ├── package.json
│   └── vite.config.js     # Vite configuration
│
├── server/                 # Backend Express server
│   ├── index.js           # Server entry point with Socket.IO
│   └── package.json
│
├── package.json            # Root package.json for running both
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

## Testing

The server includes comprehensive integration tests that verify Socket.IO functionality and real-time communication.

### Running Tests

To run the integration tests:

```bash
cd server
npm test
```

further details are in the Testing.md file.

## Troubleshooting

### Port Already in Use

If you get an error that port 3001 or 5173 is already in use:

```bash
# Kill process on port 3001 (server)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (client)
lsof -ti:5173 | xargs kill -9
```

### WebSocket Connection Issues

If the client cannot connect to the server:
- Ensure both client and server are running
- Check that the server is running on port 3001
- Verify the WebSocket URL in the client code matches your server configuration

## Development Notes

- The server uses **nodemon** for automatic restarts during development
- The client uses **Vite's hot module replacement** for instant updates
- Code execution happens entirely in the browser using JavaScript's `eval()` or `Function()` constructor
- Real-time communication is handled by **Socket.IO** with room-based sessions

## Security Considerations

⚠️ **Important**: This is a development/educational project. For production use, consider:
- Implementing authentication and authorization
- Adding rate limiting
- Sandboxing code execution more securely
- Using HTTPS and secure WebSocket connections
- Adding input validation and sanitization
- Implementing session expiration and cleanup

## License

This project was created for educational purposes as part of the AI Dev Tools Zoomcamp.
