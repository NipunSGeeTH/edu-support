<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EduShare - Educational Resource Sharing Platform

This is a Next.js 14+ project with TypeScript and Tailwind CSS, using Supabase for authentication and database.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable React components
- `/src/lib/supabase` - Supabase client configuration
- `/src/types` - TypeScript type definitions
- `/supabase` - Database schema and migrations

## Key Technologies

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for authentication (Google OAuth) and PostgreSQL database
- **Lucide React** for icons

## Authentication Flow

- Users can browse all content without logging in
- Contributors must login with Google to add/manage resources
- Protected routes: `/dashboard`, `/dashboard/add`, `/dashboard/manage`

## Database Schema

The main tables are:
- `resources` - Educational resources (materials and sessions)
- `contributors` - User profiles linked to Supabase Auth

## Coding Guidelines

1. Use TypeScript strict mode
2. Follow React best practices with hooks
3. Use Tailwind CSS for all styling
4. Implement proper loading and error states
5. Use Supabase RLS (Row Level Security) for data protection
6. Keep components modular and reusable
