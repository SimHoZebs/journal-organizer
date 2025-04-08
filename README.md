# Journal Organizer

A monorepo workspace for the Journal Organizer application.

## Project Structure

This project is organized as an npm workspace monorepo with the following structure:

- `/frontend` - React + TypeScript frontend built with Vite
- `/backend` - Express.js API server with MongoDB
- `/flutter` - Flutter mobile application
- `docker-compose.yml` - MongoDB container configuration

## Setup Instructions

1. Install:
- Node.js
- npm
- Docker Desktop
- Flutter

2. Clone the Repository
```bash
git clone git@github.com:SimHoZebs/note-organizer.git
cd note-organizer
```

3. Setup Environment and Install Dependencies
```bash
npm run setup
```
This will create a `.env` file from the template and install all dependencies. Update the `.env` file with your MongoDB credentials.

> **Note for Windows Users**: The `npm run setup` command does not work properly in PowerShell. Please use Git Bash when working with this project on Windows.

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

## Flutter Development Setup

1. Install Flutter:
   - Follow the official [Flutter installation guide](https://docs.flutter.dev/get-started/install) for your operating system
   - Verify installation with `flutter doctor` and resolve any issues indicated

2. Setup Flutter Project:
   ```bash
   cd flutter
   flutter pub get
   ```

3. Run the Flutter App:
   ```bash
   cd flutter
   flutter run
   ```

4. Flutter Development Tools:
   - Use VS Code with Flutter extension for best development experience
   - Enable hot reload during development by pressing `r` in the terminal after running the app

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
