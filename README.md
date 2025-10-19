# Plinko v2

## Overview
Plinko v2 is a modern browser-based Plinko game built with React, Tailwind CSS, and Supabase. It features physics-based ball drops, user authentication, credits management, and persistent game history. The project is designed for both desktop and mobile, with a responsive and visually appealing interface.

## Features
- **Physics-based Plinko gameplay**: Realistic ball movement and peg collisions using canvas animation.
- **User authentication**: Sign up, login, and profile management powered by Supabase Auth.
- **Credits system**: Each user has credits tracked in the database, used for betting and winnings.
- **Session stats**: Track session wins and losses before cashing out.
- **Game history**: Each ball drop is recorded in the database for persistent history.
- **Responsive UI**: Optimized for both desktop and mobile devices.
- **Modern stack**: Built with React 19, Tailwind CSS 4, and Supabase JS 2.

## Project Structure
- `src/` — React frontend code
  - `components/` — UI components (Navbar, PlinkoCanvas, etc.)
  - `pages/` — Main pages (Game, Login, etc.)
  - `hooks/` — Custom React hooks (useAuth)
  - `supabaseClient.ts` — Supabase client setup
- `volumes/db/init/data.sql` — Database schema and triggers
- `docker-compose.yml` — Supabase and supporting services

## Getting Started
1. **Install dependencies**:
	```bash
	npm install
	```
2. **Start Supabase and frontend**:
	```bash
	docker compose up -d
	npm run dev
	```
3. **Access the app**:
	Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization
- Update environment variables in `.env` for Supabase keys and database settings.
- Modify `volumes/db/init/data.sql` for custom game logic or user profile fields.

## Technologies Used
- React
- Tailwind CSS
- Supabase (Auth, Database)
- Vite
- Docker Compose

## License
MIT

---
For more details, see the source code and comments throughout the project.
