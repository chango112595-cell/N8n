# Aurora Changeset Manager

## Overview

Aurora Changeset Manager is a developer-focused web application that automatically commits changesets from Aurora to GitHub repositories. The application receives webhook notifications containing file changes and commits them directly to specified GitHub repositories and branches. It provides a clean, GitHub-inspired interface for monitoring commit history and manually submitting changesets when needed.

The application serves as a bridge between Aurora (an external system that generates changesets) and GitHub, automating the commit workflow while providing visibility into the process through a web dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and caching

**UI Framework:**
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Dark-mode-first design approach following GitHub's visual language
- Inter font family for primary text, JetBrains Mono for code display

**Design Philosophy:**
The interface adopts a hybrid approach combining GitHub's developer-friendly patterns with Linear's minimalist aesthetics. The color palette uses a dark mode base (`220 13% 9%`) with semantic colors for status communication (green for success, red for errors, amber for pending states). All spacing follows Tailwind's unit system (2, 4, 6, 8, 12, 16) for consistency.

**State Management:**
- React Query handles all API communication with automatic caching and refetching
- Query keys follow REST-like patterns (`/api/commits`, `/api/webhook/aurora/changeset`)
- No external state management library - component state and React Query suffice for this application's scope

**Component Structure:**
- Functional components with TypeScript interfaces for props
- Shared UI components in `client/src/components/ui/` (button, card, badge, toast, etc.)
- Feature components in `client/src/components/` (Header, CommitHistory, WebhookInfo, ManualCommit)
- Single page application with Home as the main view

### Backend Architecture

**Technology Stack:**
- Express.js for HTTP server and API routing
- Node.js with ES modules (not CommonJS)
- TypeScript for type safety across the codebase

**API Design:**
The backend exposes a minimal REST-like API:
- `POST /api/webhook/aurora/changeset` - Webhook endpoint for receiving Aurora changesets
- `GET /api/commits` - Retrieves commit history for display in the UI
- `POST /api/commits` - Manual commit submission endpoint

**Request Processing Flow:**
1. Webhook receives payload with repository details, branch, commit message, files, and optional signature
2. Payload validated against Zod schema (`changesetSchema`)
3. HMAC signature verification if `AURORA_SECRET` environment variable is set
4. Commit record created in storage with "pending" status
5. Files committed to GitHub via Octokit
6. Commit record updated with success/failure status and commit SHA

**Error Handling:**
- Validation errors return 400 with Zod error details
- Signature mismatches return 401
- GitHub API errors are caught and stored in the commit record's `errorMessage` field
- All errors logged and surfaced in the UI via commit status

### Data Storage

**Storage Abstraction:**
The application uses an in-memory storage implementation (`MemStorage`) that implements the `IStorage` interface. This abstraction allows for easy migration to persistent storage (PostgreSQL, as indicated by Drizzle configuration) without changing business logic.

**Data Models:**

*User Model:*
- `id` (UUID primary key)
- `username` (unique)
- `password` (hashed - though authentication not currently implemented)

*Commit Model:*
- `id` (UUID primary key)
- `commitMessage` - The commit message text
- `branch` - Target branch name
- `filesChanged` - Array of file paths modified
- `status` - One of "pending", "success", or "error"
- `errorMessage` - Error details if commit failed
- `commitSha` - GitHub commit SHA if successful
- `createdAt` - Timestamp of commit creation

**Migration Path:**
The codebase includes Drizzle ORM configuration (`drizzle.config.ts`) and schema definitions (`shared/schema.ts`) for PostgreSQL. The schema uses `pg-core` types and the database expects a `DATABASE_URL` environment variable. The current in-memory implementation can be swapped with a Drizzle-based implementation without modifying route handlers.

### Authentication & Authorization

**GitHub Integration:**
The application uses Replit's connector system to obtain GitHub access tokens:
1. Fetches connection settings from Replit's connector API using `REPL_IDENTITY` or `WEB_REPL_RENEWAL` tokens
2. Extracts OAuth access token from connection settings
3. Tokens cached in-memory with automatic refresh on expiration
4. Creates Octokit client instances with fresh tokens for each operation

**Security Mechanism:**
Webhook requests can be secured with HMAC-SHA256 signatures:
- Aurora signs payloads with a shared secret
- Backend validates signatures by computing HMAC of raw request body
- Signature format: `sha256=<hex_digest>`
- Development mode: Set `AURORA_SECRET=dev-skip` to bypass validation
- Production: Use strong random secret shared between Aurora and this application

**Current Limitations:**
- No user authentication system implemented
- GitHub access relies entirely on Replit connector
- Single GitHub account per deployment (multi-tenant support not implemented)

## External Dependencies

### Third-Party Services

**GitHub API:**
- Primary integration point via `@octokit/rest` (v22.0.0)
- Used for creating/updating files and committing to repositories
- Requires GitHub OAuth token with repo write permissions
- Operations: Create or update file contents, commit changes

**Replit Platform:**
- Connector system for GitHub OAuth credential management
- Environment variables: `REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`, `WEB_REPL_RENEWAL`
- Provides token refresh and credential storage

**Aurora (External System):**
- Webhook source system (external, not part of this codebase)
- Sends changesets via POST requests to `/api/webhook/aurora/changeset`
- Expected payload format defined in `changesetSchema`

### Key NPM Packages

**Core Framework:**
- `express` - HTTP server framework
- `react` & `react-dom` - UI rendering
- `vite` - Development server and build tool
- `typescript` - Type checking and compilation

**Database & ORM:**
- `drizzle-orm` - SQL query builder and ORM
- `drizzle-zod` - Zod schema generation from Drizzle schemas
- `@neondatabase/serverless` - PostgreSQL driver for serverless environments
- `connect-pg-simple` - PostgreSQL session store (not actively used)

**UI Components:**
- `@radix-ui/*` - Primitive component library (accordion, dialog, dropdown, etc.)
- `tailwindcss` - Utility CSS framework
- `class-variance-authority` - Component variant management
- `cmdk` - Command palette component

**Data Fetching & Forms:**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation resolver
- `zod` - Runtime type validation and schema definition

**Utilities:**
- `date-fns` - Date formatting and manipulation
- `nanoid` - UUID generation
- `clsx` & `tailwind-merge` - Conditional class name utilities
- `wouter` - Lightweight routing library

### Environment Variables

**Required:**
- None in development mode with `AURORA_SECRET=dev-skip`

**Optional:**
- `DATABASE_URL` - PostgreSQL connection string (required for Drizzle ORM when migrating from in-memory storage)
- `AURORA_SECRET` - Shared secret for webhook signature validation
- `REPLIT_CONNECTORS_HOSTNAME` - Automatically set by Replit platform
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL` - Automatically set by Replit for authentication
- `NODE_ENV` - Set to "production" or "development"