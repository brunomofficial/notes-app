# Notes App

A full-stack notes application for creating, editing, and deleting notes. Authenticated users can access their notes from the cloud, while guest users can work with notes stored locally in their browser.

## Features

- Email/password authentication with email verification
- Session-based authentication backed by MongoDB
- Create, edit, and delete notes
- Guest mode with browser-local persistence
- Light and dark themes
- Rate limiting for API requests and authentication endpoints
- Responsive React user interface

## Live application

[notes-app-brunomofficial.vercel.app](https://notes-app-brunomofficial.vercel.app)

##  Stack

- **Frontend:** React, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript, Passport, `express-session`
- **Database:** MongoDB with Mongoose
- **Email delivery:** Brevo SMTP API
- **Package manager:** pnpm
- **Deployment:** Vercel for the client; the server can be run directly or with Docker

## Repository structure

```text
.
├── client/       # React/Vite frontend
└── server/       # Express API and MongoDB integration
```

## Prerequisites

- Node.js 22 or newer
- pnpm 12.11.2 or a compatible pnpm 12 release
- A MongoDB database, local or hosted
- A Brevo API key and verified sender email for account verification emails


### Starting the applications

Run the API and frontend in separate terminals:

```bash
# Terminal 1
cd server
pnpm dev
```

```bash
# Terminal 2
cd client
pnpm dev
```

The frontend is served at <http://localhost:5173> and the API at <http://localhost:3000>. Vite proxies `/api` requests to the local API server. The API health endpoint is available at <http://localhost:3000/health>.

## Scripts

### Client

Run these commands from `client/`:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Type-check and build the production frontend |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production frontend build locally |

### Server

Run these commands from `server/`:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the API with TypeScript watch mode |
| `pnpm build` | Compile the server to `dist/` |
| `pnpm start` | Start the compiled production server |
| `pnpm typecheck` | Type-check without emitting files |

## API overview

The frontend communicates with the backend under the `/api` prefix. Authenticated note routes use the session cookie issued by the server.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check whether the API is running |
| `GET` | `/api/auth/status` | Get the current authentication status |
| `POST` | `/api/auth/signup` | Start account registration and send a verification code |
| `POST` | `/api/auth/verify-code` | Verify an account using the emailed code |
| `POST` | `/api/auth/login` | Log in with email and password |
| `POST` | `/api/auth/logout` | End the current session |
| `GET` | `/api/notes` | List the authenticated user’s notes |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:noteId` | Update a note |
| `DELETE` | `/api/notes/:noteId` | Delete a note |

## License

This project is licensed under the [MIT License](LICENSE).
