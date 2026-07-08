# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and MySQL, for the Reno Platforms web development assignment.

## Tech stack

- **Framework:** Next.js 14, Pages Router
- **Database access:** Prisma ORM
- **Database:** MySQL-compatible, hosted on [TiDB Cloud](https://tidbcloud.com) (free tier)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free/Hobby tier)

## Features

- List all notices as responsive cards (phone and desktop), Urgent notices always sorted above Normal ones (via Prisma's `orderBy`, not client-side sorting), with a red "Urgent" badge.
- One shared form for both creating and editing a notice; the edit form loads pre-filled with the notice's current values.
- Delete requires an inline confirmation step before it fires.
- All writes (create, update, delete) go through API routes under `pages/api/notices/`, using the correct HTTP method and status codes.
- All server-side validation happens inside the API route (`lib/validateNotice.js`) regardless of what the browser already checked — required fields can't be empty, and the publish date must parse as a valid date.
- Optional image field: paste an image URL and it renders on the card and in the form preview.

## Running locally

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo-url>
   cd notice-board
   npm install
   ```

2. **Set up a database**

   Create a free MySQL-compatible database (TiDB Cloud Serverless is recommended — no credit card required). Copy `.env.example` to `.env` and fill in your connection string:

   ```bash
   cp .env.example .env
   ```

   ```
   DATABASE_URL="mysql://<user>:<password>@<host>:4000/notice_board?sslaccept=strict"
   ```

3. **Push the schema to your database**

   ```bash
   npx prisma migrate dev --name init
   ```

   (This also runs `prisma generate` for you. If you ever change `prisma/schema.prisma`, rerun this command.)

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Deploying

1. Push this repo to a **public** GitHub repository.
2. Import the repo into Vercel (free Hobby tier).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings (same value as your local `.env`).
4. Deploy. `postinstall` runs `prisma generate` automatically on Vercel's build.

## One thing I'd improve with more time

Real image uploads (e.g. to a free object-storage tier like Cloudinary or Vercel Blob) instead of a plain image-URL field, plus pagination/search over notices once the list grows large, and optimistic UI updates on create/edit instead of a full redirect-and-refetch.

## Where and how AI was used

AI (Claude) was used to scaffold and write the application: the Prisma schema, the API routes and their server-side validation, the React components and pages, and Tailwind styling. The overall structure (Pages Router API routes for CRUD, DB-level ordering for the Urgent rule, server-side validation independent of the client) was directed based on the assignment brief; the AI generated the implementation from that direction. All code was reviewed and adjusted by hand — for example, pinning Prisma to a stable release and correcting `.gitignore` so real database credentials in `.env` are never committed.
