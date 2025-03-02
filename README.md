# Journal Organizer

A monorepo workspace for the Journal Organizer application.

## Project Structure

This project is organized as an npm workspace monorepo with the following structure:

- `/frontend` - React + TypeScript frontend built with Vite
- `/backend` - Express.js API server with MongoDB
- `docker-compose.yml` - MongoDB container configuration

## Setup Instructions

1. Install:
- Node.js
- npm
- Docker Desktop

2. Clone the Repository
```bash
git clone git@github.com:SimHoZebs/journal-organizer.git
cd journal-organizer
```

3. Setup Environment and Install Dependencies
```bash
npm run setup
```
This will create a `.env` file from the template and install all dependencies. Update the `.env` file with your MongoDB credentials.

4. Start the Application
```bash
npm run mongodb  # Start MongoDB container
npm run dev      # Start both backend and frontend
```

Or run services separately:
```bash
npm run dev:frontend  # Start frontend only
npm run dev:backend   # Start backend only
```

5. Stop Services
```bash
npm run mongodb:stop  # Stop MongoDB container
```

## Available Commands

- `npm run setup` - Setup environment and install all dependencies
- `npm install` - Install all dependencies
- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start backend server only
- `npm run dev:frontend` - Start frontend dev server only
- `npm run build` - Build frontend for production
- `npm run mongodb` - Start MongoDB container
- `npm run mongodb:stop` - Stop MongoDB container

## Managing Dependencies

### Installing Dependencies

#### Workspace-specific Dependencies

To add dependencies to a specific workspace:

```bash
# For backend dependencies
npm install package-name --workspace=backend

# For frontend dependencies
npm install package-name --workspace=frontend

# For dev dependencies
npm install package-name --workspace=frontend --save-dev
```

#### Root-level Dependencies

To add dependencies to the root package.json:

```bash
npm install package-name -W
```

### Removing Dependencies

```bash
# Remove from specific workspace
npm uninstall package-name --workspace=backend

# Remove from root
npm uninstall package-name -W
```

### Running Scripts in Specific Workspaces

```bash
# Run a script in a specific workspace
npm run script-name --workspace=frontend

# Example: Run tests in backend
npm run test --workspace=backend
```
