# ZØR-ATÉ JOSEPH — SYSTEMS PORTFOLIO

A full-stack, production-quality portfolio platform built to showcase engineering systems, data, and design.

## Architecture
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Media Storage:** MongoDB GridFS (No local file storage reliance)
- **Frontend:** Vanilla CSS/JS + EJS server-side rendering
- **Admin CMS:** Single Page Application (SPA) using vanilla JS interacting with secure REST APIs.

## Setup

1. Make sure MongoDB is running locally on default port 27017, or configure `.env` with a remote URI.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill out your secrets.
4. Seed the database with the initial admin and project data:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Access
- The CMS is located at `/zorate`
- Default login uses the credentials provided in `.env` (or those set during `npm run seed`)

## Features
- **Dynamic Projects:** Fully manageable systems catalog.
- **The Lab (Blog):** Markdown-supported engineering articles with syntax highlighting.
- **Media Assets:** Global GridFS media library that can be reused across projects and posts.
- **Rate Limiting & Security:** Built-in rate limits for authentication and APIs.
- **Command Palette:** Quick navigation via `Ctrl+K`.