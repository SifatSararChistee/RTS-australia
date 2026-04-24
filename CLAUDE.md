# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Run development server: `npm run dev`
- Build project: `npm run build`
- Lint code: `npm run lint`
- Start production server: `npm run start`

## Architecture & Structure
- **Framework**: Next.js 16 (App Router) with TypeScript.
- **Styling**: Tailwind CSS 4.
- **Database & Backend**:
    - **Prisma**: Primary ORM for database schema and queries.
    - **Supabase**: Used for backend infrastructure and database services.
- **Directory Layout**:
    - `src/app/`: Application routes and pages.
        - `(public)`: Pages like `/apply`, `/check-visa`.
        - `admin/`: Admin portal routes (`/admin/login`, `/admin/dashboard`).
        - `applicants/`: Applicant management views.
    - `src/components/`: Reusable UI components.
    - `src/lib/`: Core utilities (auth, database clients, email handlers).
- **Important Note**: This project uses a version of Next.js with breaking changes relative to standard training data. Refer to `node_modules/next/dist/docs/` for API specifics and heed all deprecation notices.

## Project Context
- **Purpose**: Visa application and tracking system for RTS Australia.
- **Key Flows**: User application $\rightarrow$ Admin review/tracking $\rightarrow$ Status updates $\rightarrow$ User status check.
