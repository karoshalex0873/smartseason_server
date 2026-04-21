# SmartSeason Field Monitoring System

Live App: https://smartseason-client.vercel.app/  
API: https://smartseason-server.onrender.com/

Frontend Repository: https://github.com/karoshalex0873/smartseason_client  
Backend Repository: https://github.com/karoshalex0873/smartseason_server  .

## Overview
SmartSeason is a field monitoring system designed to help agricultural teams track crop progress, manage field assignments, and monitor risk levels in real time.

The system enables:
- Admin to mange fields, users and asiign agents to fields.
- Agent to update progress and observation on assigned fields.
- Automatic status update (Active ,At Risk, Completed) based on the data 

## System Architecture

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express, TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** HTTP-only cookies with JWT

The frontend communicates with the backend via REST APIs.  
The backend handles business logic, authentication, and database operations.


## Demo Credentials
-Note: the first login may take a moment due to slow sever for free tier hosting. Please be patient when testing the demo.

- Admin: `
Email:admin@smartseason.com
Password: StrongPass1`
- Agent 1: `
Email:agent001@smartseason.com
Password: password123 `

- Agent 2: `
Email:jamal@smartseason.com
Password: password123`


## User Flow
### Admin
- Logs in and is redirected to the admin dashboard.
- Create fields and assign them to agents.
- Create agent users and assign them to fields.
- Monitor field summaries and risk levels.

### Agent
- Logs in and is redirected to the agent dashboard.
- Views assigned fields and their current status.
- Updates field progress and adds notes.
- Views field details and update history.


## Field Status Logic

Field status is automatically computed based on stage and time:

- harvested → completed  
- planted > 14 days → atRisk  
- growing > 90 days → atRisk  
- ready > 120 days → atRisk  
- otherwise → active 


## Design Decisions
- Authentication uses HTTP-only cookies to enhance security by preventing client-side access to tokens.
- Authorization is handled through a combination of authentication checks and role-based guards to ensure proper access control.
- The `Field` model captures the current state of a field, while `FieldUpdate` records historical progress, allowing for a clear separation of concerns.
- Field status is determined by backend business rules based on stage and time, ensuring consistent and accurate monitoring without relying on client-side calculations.
- Admin and Agent Roles are seede and enfored by the backend
- Separion of concerns approach
## Setup

### 1. Clone the repository

```bash
git clone https://github.com/karoshalex0873/smartseason_server.git
cd SmartSeason/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create `server/.env` with values like:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/smartseason
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
```

### 4. Generate the Prisma client


```bash
npx prisma generate
```

### 5. Run migrations in development

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npm run seed
```

### 7. Start the development server

```bash
npm run dev
```

## Running Scripts

- `npm run dev`: starts the backend in development mode with auto-reload
- `npm run build`: compiles TypeScript to `dist`
- `npm start`: runs the compiled production build
- `npm run seed`: runs the Prisma seed script

## Design Decisions

- Authentication is cookie-based using HTTP-only tokens so the client does not manage raw auth tokens directly.
- Authorization is split into authentication and role checks:
  `protect` verifies the signed-in user, then role guards handle `Admin`, `Agent`, or shared access.
- `Field` stores the current snapshot of a field, while `FieldUpdate` stores historical progress entries.
- Field metadata management and progress tracking are separate concerns:
  admins manage field records, while agents mainly record stage updates and notes.
- Field status is computed automatically instead of being entered manually.
  The application uses the current stage and the number of days since planting to decide the status.
  If the stage is `harvested`, the field is marked `completed`.
  Otherwise the system compares the days since planting against the allowed threshold for the current stage:
  `planted` = 14 days, `growing` = 90 days, `ready` = 120 days.
  If the field stays longer than the threshold for its current stage, it is marked `atRisk`.
  If it is still within the allowed time, it remains `active`.
- Roles are treated as reference data and are seeded into the database.

## Assumptions

- The application has two roles only: `Admin` and `Agent`.
- A field is assigned to at most one agent at a time.
- Admins can view and manage all fields and users.
- Agents can access only the fields assigned to them.
- Agents can record field progress for their assigned fields.
- Stage flow follows the defined lifecycle:
  `planted`, `growing`, `ready`, `harvested`.
- Status is determined by the business rules already defined in the application:
  `harvested` always becomes `completed`, stages that exceed their allowed age become `atRisk`, and all other fields remain `active`.
-  `harvested -> completed`
-  `planted over 14 days -> atRisk`
- `growing over 90 days -> atRisk`
- `ready over 120 days -> atRisk`
- `otherwise -> active`

- The current stage and planting date are enough input for the first version of status monitoring.
  The system does not use weather, soil, pest, or crop-specific external data yet.
- The database used in development is available before running Prisma commands.
