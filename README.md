# Acadexis Frontend

A modern educational platform for universities that bridges the gap between lecturers, students, and AI-powered learning tools. Built with Next.js, React, and TypeScript.

## Overview

Acadexis is an institutional AI knowledge grounding platform that empowers universities to deliver AI-enhanced education. The platform enables lecturers to upload and manage course materials, while students benefit from AI-powered study sessions backed by verified course content with precise citations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16.2.4 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **UI Library**: [React](https://react.dev) 19.2.4
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 3.4.x
- **Component Primitives**: [Radix UI](https://www.radix-ui.com) (headless, accessible components)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) 5.x
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## Features

### Student Features

- **Dashboard**: Personalized overview with study statistics, recent activity, and course progress
- **Course Management**: Browse, enroll in, and manage enrolled courses
- **Study Lab**: AI-powered chat interface that answers questions using uploaded course materials with precise page citations
- **Quiz System**: Take course quizzes with timed assessments and detailed results
- **Library**: Access and download course materials (PDFs, documents)
- **Bookmarks**: Save and organize favorite study materials
- **Profile Management**: Update personal information and preferences

### Lecturer Features

- **Dashboard**: Overview of teaching courses and student analytics
- **Course Management**: Create, update, and manage courses
- **Knowledge Hub**: Upload and organize course materials that become the AI's source of truth
- **Struggle Heatmaps**: View real-time analytics showing where students struggle based on AI interaction data
- **Student Management**: Track and manage enrolled students
- **Quiz Creation**: Create and manage course quizzes

### Platform Features

- **AI-Grounded Learning**: Chat with AI that references uploaded course PDFs with precise page citations
- **Real-time Notifications**: Stay updated with course announcements, material uploads, and system alerts
- **Dark/Light Theme**: System-aware theming support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Role-based Access**: Distinct dashboards and features for students and lecturers

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/acadexis_frontend.git

# Navigate to the project directory
cd acadexis_frontend

# Install dependencies
npm install

# or with yarn
yarn install
```

### Development

```bash
# Start development server
npm run dev

# The application will be available at http://localhost:3000
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login, register, password reset)
│   ├── dashboard/        # Protected dashboard routes
│   │   ├── student/      # Student dashboard and sub-routes
│   │   └── lecturer/     # Lecturer dashboard and sub-routes
│   └── page.tsx          # Landing/home page
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui style)
│   └── dashboard/        # Dashboard-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
├── services/             # API and external services
├── store/                # Zustand state stores
└── types/                # TypeScript type definitions
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app` | Next.js App Router pages and layouts |
| `src/components/ui` | Reusable, design-system components |
| `src/components/dashboard` | Dashboard-specific layouts and features |
| `src/hooks` | Custom React hooks for data fetching and state |
| `src/store` | Global state management with Zustand |
| `src/types` | TypeScript interfaces and types |
| `src/services` | API client and mock data services |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_NAME=Acadexis
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Authentication

The application supports two user roles:

- **Student**: Access to courses, study lab, quizzes, and library
- **Lecturer**: Access to course management, knowledge hub, and analytics

Authentication flow:
1. User registers with email, role, university, faculty, and department
2. User logs in with email and password
3. Session is managed via Zustand store and persisted to localStorage

## API Integration

The project includes a mock API layer (`src/services/api.ts`) for development and testing. To connect to a real backend:

1. Replace mock implementations with actual API calls using Axios
2. Update environment variables with your backend URL
3. Implement proper authentication (JWT, session, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns in `src/components/ui/`
- Run `npm run lint` before committing
- Write meaningful commit messages

## License

This project is proprietary software. All rights reserved.

## Support

For issues and feature requests, please open a GitHub issue or contact the development team.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components built with Radix UI and Tailwind CSS