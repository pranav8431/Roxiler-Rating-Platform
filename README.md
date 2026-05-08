# Roxiler Rating Platform

Role-based store rating platform built with Next.js, Prisma, and PostgreSQL.

## Stack

- Next.js App Router + TypeScript
- Prisma ORM
- PostgreSQL via Docker Compose
- Tailwind CSS for the UI

## Local setup

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Install dependencies:

```bash
npm install
```

3. Apply the Prisma schema and seed the database:

```bash
npm run db:push
npm run prisma:seed
```

4. Run the app:

```bash
npm run dev
```

## Demo accounts

- Admin: `admin@roxiler.com` / `Password@123`
- Store owner: `owner@roxiler.com` / `Password@123`
- Normal user: `user@roxiler.com` / `Password@123`

## Included flows

- Single login with role-based redirects
- Admin dashboard with counts, user creation, and store creation
- Normal user registration, store search, password update, and ratings
- Store owner dashboard with average rating and raters list
- Search, filter, and sort across the main listings
