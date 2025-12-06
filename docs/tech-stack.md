# Tech Stack

## Project Structure

This is a monorepo managed by **pnpm** and built with **Turbo**.

## Frontend (`frontend/`)

- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **Testing**: Vitest (unit tests)

## Backend (`backend/`)

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Prisma
- **Testing**: Vitest (unit tests)

## Shared (`shared/`)

- **Purpose**: Common logic and dependencies shared between frontend and backend
- **Validation**: Zod

## Root Configuration

### Dev Dependencies

- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Pre-commit hooks (GitHub commit pre-hook)

## Infrastructure

### Database

- **Type**: PostgreSQL
- **Deployment**: Docker (local development)

## Build & Package Management

- **Monorepo Tool**: Turborepo
- **Package Manager**: pnpm
