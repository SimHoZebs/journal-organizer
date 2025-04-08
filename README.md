# Journal Organizer

A monorepo workspace for the Journal Organizer application.

## Project Structure

This project is organized as a pnpm workspace monorepo with the following
structure:

- `/frontend` - React + TypeScript frontend built with Vite
- `/backend` - Deno-powered Fastify API server with LibSQL/Drizzle ORM

## Changes Since Fork

This project has undergone significant changes from the original repository:

- Migrated from Node.js to Deno runtime environment
- Switched from Express.js to Fastify for improved performance
- Completely redesigned database architecture:
  - Replaced containerized MongoDB with LibSQL (SQLite-compatible database)
  - Implemented Drizzle ORM for database interactions
  - Eliminated Docker dependency for database operations
- Updated to pnpm workspace management from npm workspaces

## Setup Instructions

1. Install required tools:

- Deno (latest version)
- pnpm

2. Clone the Repository

```bash
git clone git@github.com:SimHoZebs/journal-organizer.git
cd journal-organizer
```

3. Setup Environment and Install Dependencies

```bash
pnpm install
```

Create a `.env` file in the root directory with the following variables:

```
LIBSQL_URL=your_libsql_url_or_local_file_path
LIBSQL_AUTH_TOKEN=your_libsql_token_if_using_remote_db
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start the Application

```bash
pnpm dev      # Start both backend and frontend
```

Or run services separately:

```bash
pnpm dev:frontend  # Start frontend only
pnpm dev:backend   # Start backend only (using Deno)
```

## Available Commands

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start both backend and frontend
- `pnpm dev:backend` - Start Deno backend server
- `pnpm dev:frontend` - Start frontend dev server
- `pnpm build` - Build frontend for production
- `pnpm test` - Run frontend tests
- `pnpm format` - Format code using Biome

## Mobile Development Setup

The mobile application is currently under development. More information will be
added as it becomes available.

## Managing Dependencies

### Installing Dependencies

#### Workspace-specific Dependencies

To add dependencies to a specific workspace:

```bash
# For backend dependencies
pnpm add package-name --filter backend

# For frontend dependencies
pnpm add package-name --filter frontend

# For dev dependencies
pnpm add -D package-name --filter frontend
```

#### Root-level Dependencies

To add dependencies to the root package.json:

```bash
pnpm add -w package-name
```

### Removing Dependencies

```bash
# Remove from specific workspace
pnpm remove package-name --filter backend

# Remove from root
pnpm remove -w package-name
```

### Running Scripts in Specific Workspaces

```bash
# Run a script in a specific workspace
pnpm --filter frontend run script-name

# Example: Run tests in frontend
pnpm --filter frontend test
```

## Technology Stack

- **Runtime Environment**: Deno
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Fastify, Drizzle ORM, LibSQL
- **Database**: LibSQL (SQLite-compatible, can be used locally or with remote
  Turso)
- **Authentication**: JWT, bcrypt, email verification
- **Email Services**: SendGrid
- **AI Integration**: OpenAI API
- **Code Quality**: Biome for formatting and linting
- **Testing**: Vitest
