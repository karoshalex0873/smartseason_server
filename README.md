# SmartSeason Backend

Backend API for the SmartSeason Field Monitoring System.

## Overview

This backend supports:

- authentication for `Admin` and `Agent` users
- field creation, assignment, update, read, and deletion
- field stage tracking with notes
- automatic field status computation
- role-based access control for all protected routes

The project uses:

- `Node.js`
- `Express`
- `TypeScript`
- `Prisma`
- `PostgreSQL`

## Environment Variables

Create a `.env` file in the `server` folder. Example:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/smartseason
CORS_ORIGINS=http://localhost:5173,https://smartseason-client.vercel.app
```

Notes:
- Use a comma-separated list in `CORS_ORIGINS` to allow multiple frontend origins.
- `CORS_ORIGIN` is also supported for single-origin setups.

## Business Logic

### 1. Users and Roles

The system supports two roles:

- `Admin`
- `Agent`

Role records are seeded into the database and each user belongs to one role.

Authentication is cookie-based:

- on sign in, the backend generates an `accessToken` and `refreshToken`
- tokens are stored in `httpOnly` cookies
- protected routes use the `protect` middleware to verify the token and attach the authenticated user to `req.user`

### 2. Access Control

Authorization is handled in two layers:

- `protect` middleware verifies the logged-in user
- `roleGuard` middleware checks allowed roles  `admin`, `agent`, or `adminOrAgent`

For data ownership, some checks are enforced inside controllers:

- `Admin` can access all fields
- `Agent` can only access fields assigned to them
- `Agent` can only track stage progress for fields assigned to them

This keeps role checks and ownership checks separate.

### 3. Field Management

The `Field` model stores the current state of a field:

- `name`
- `cropType`
- `plantingDate`
- `currentStage`
- `status`
- `agentId`

Field management is separated from progress tracking:

- field CRUD handles metadata like name, crop type, planting date, and assigned agent
- stage tracking handles crop progress updates and notes

This separation keeps responsibilities clear and avoids mixing business concerns.

### 4. Field Assignment

Each field is assigned to exactly one agent:

- one `User` can have many assigned fields
- one `Field` belongs to one assigned agent

When creating or updating a field, the backend validates that the selected user is actually an `Agent`.

### 5. Stage Tracking

Field progress is tracked through the `FieldUpdate` model.

Each update stores:

- the field being updated
- the user who made the update
- the new stage
- optional notes
- timestamp

This means:

- `Field` stores the latest snapshot
- `FieldUpdate` stores the history of progress changes

That design helps admins monitor updates across agents and keeps the system auditable.

### 6. Field Stages

The field lifecycle is represented with the `Stage` enum:

- `planted`
- `growing`
- `ready`
- `harvested`

These stages are used both in the current field snapshot and in update history.


### 7. Automatic Status Computation

Field status is not updated manually. It is computed automatically in the status service found in `src/services/statusCompute.ts`.

The system uses three field status values:

- `active`
- `atRisk`
- `completed`

#### What the system is monitoring

The system is monitoring whether a field is progressing through its crop lifecycle within a reasonable amount of time.

In this project, the main signs being monitored are:

- the field's current stage
- the field's planting date
- the amount of time that has passed since planting

This means the backend is not just checking what stage the field is in, but also checking whether the field may be taking too long to remain in that stage.

The goal is to identify delays in crop progress early enough so the field can be flagged for attention.

#### How the system determines status

The status is computed by comparing the field's current stage with the number of days that have passed since the planting date.

The logic works in this order:

1. If the field stage is `harvested`, the system marks the field as `completed`.
2. If the field is not harvested, the system calculates how many days have passed since planting.
3. The system then checks whether that number of days is still reasonable for the current stage.
4. If the field has taken too long in that stage, it is marked as `atRisk`.
5. If the timing is still within the expected range, it is marked as `active`.

#### Why this approach was used

This approach was chosen because the assessment requires a computed status, and the data already available in the system is enough to make a reasonable first decision.

The system already stores:
- planting date
- current stage

Using these two values makes it possible to monitor delay in field progress without needing additional complex data such as weather patterns, pest reports, or soil analysis.

In simple terms:

- `active` means the field is progressing normally
- `atRisk` means the field appears delayed and may need human attention
- `completed` means the crop lifecycle has reached harvest

This gives a simple and practical business rule that is easy to explain, easy to maintain, and easy to improve later.

### 8. Monitoring Logic

Admins can monitor updates across agents by reading fields together with their update history.

The field read endpoints include:

- assigned agent details
- ordered update history
- update author information

This supports visibility into:

- who updated a field
- when it was updated
- what stage was reported
- any notes attached to the update

## API Structure

### Auth Routes

Mounted at `/auth`

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/logout`

### Field Routes

Mounted at `/field`

- `GET /field`
- `GET /field/:id`
- `POST /field/add`
- `PATCH /field/update/:id`

### Stage Routes

Mounted at `/stage`

- `POST /stage/track/:id`

## Database Design

Main models:

- `Role`
- `User`
- `Field`
- `FieldUpdate`

Relationship summary:

- one role has many users
- one user has many fields
- one user has many field updates
- one field has many updates

This gives a clean structure for both operational data and update history.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file with values such as:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartseason
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
```

### 3. Run migrations

```bash
node ./node_modules/prisma/build/index.js migrate dev
```

### 4. Seed roles

```bash
npm run seed
```

### 5. Start the development server

```bash
npm run dev
```

## Assumptions

- a field is assigned to one agent at a time
- admins can view all fields and all updates
- agents can only access their assigned fields
- field metadata updates are separate from progress tracking
- status is computed from stage and timing rules, not entered manually

## Future Improvements

- dashboard summary endpoints for totals and status breakdowns
- pagination and filtering for fields and updates
- validation layer with a schema library
- refresh token rotation
- tests for business logic and route authorization
- configurable crop-specific timing thresholds
