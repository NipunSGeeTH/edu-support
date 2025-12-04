# EduSupport - Educational Resource Sharing Platform

A free educational resource sharing platform for Sri Lankan students built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📚 **Learning Materials**: Browse past papers, notes, and textbooks
- 🎥 **Learning Sessions**: Access live classes and recorded video lessons
- 🔍 **Smart Filtering**: Filter by Level (AL/OL), Stream, Subject, and Language
- 🌐 **Multi-language Support**: Resources in Sinhala, Tamil, and English
- 👥 **Contributor Portal**: Teachers can login and share resources
- ✏️ **Edit Resources**: Contributors can edit and update their shared resources
- 🔐 **Google Authentication**: Secure login with Google via Supabase Auth
- ⚠️ **Error Handling**: Custom 404 and error pages for better user experience

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
cd edu
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your project URL and anon key
3. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project's **SQL Editor**
2. Copy and run the contents of `supabase/schema.sql`

### 4. Configure Google OAuth

1. In Supabase Dashboard, go to **Authentication > Providers**
2. Enable **Google** provider
3. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
4. Add your credentials to Supabase
5. Add redirect URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── about/           # About page
│   ├── auth/callback/   # OAuth callback handler
│   ├── dashboard/       # Contributor dashboard (protected)
│   │   ├── add/         # Add new resource
│   │   └── manage/      # Manage resources
│   ├── login/           # Login page
│   ├── materials/       # Browse materials
│   ├── sessions/        # Browse sessions
│   ├── error.tsx        # Global error page handler
│   ├── not-found.tsx    # 404 not found page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── FilterSidebar.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ResourceCard.tsx # Includes edit modal
├── lib/
│   └── supabase/
│       ├── client.ts    # Browser client
│       ├── middleware.ts
│       └── server.ts    # Server client
├── types/
│   └── database.ts      # TypeScript types
└── middleware.ts        # Auth middleware
```

## User Flows

### Students (Public)
1. Browse materials or sessions from homepage
2. Filter by Level → Stream → Subject → Language
3. View and access resources without logging in
4. See custom 404 page if accessing non-existent routes

### Contributors (Authenticated)
1. Login with Google
2. Access dashboard to view stats
3. Add new resources (materials or sessions)
4. Manage (edit/delete) existing resources
5. Edit resource details via inline modal on resource cards

## Database Schema

### Resources Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| type | TEXT | 'Material' or 'Session' |
| category | TEXT | 'Past Paper', 'Note', 'Textbook', 'Live', 'Recording' |
| level | TEXT | 'AL' or 'OL' |
| stream | TEXT | 'Science', 'Arts', 'Commerce', 'Technology' |
| subject | TEXT | Subject name |
| language | TEXT | 'Sinhala', 'Tamil', 'English' |
| title | TEXT | Resource title |
| description | TEXT | Resource description |
| url | TEXT | Link to resource |
| contributor_id | UUID | Reference to auth.users |
| created_at | TIMESTAMP | Creation timestamp |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for educational purposes.

---

Made with ❤️ for Sri Lankan students
