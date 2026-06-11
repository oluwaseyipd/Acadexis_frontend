# Acadexis

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand_5.x-orange)](https://github.com/pmndrs/zustand)
[![Proprietary](https://img.shields.io/badge/License-Proprietary-red)](#license)

Acadexis is a premium, institutional AI-knowledge grounding platform designed for universities. It bridges the gap between official course materials, lecturers, students, and AI-grounded learning tools. 

By using official course materials (PDF, DOCX, PPTX) as the direct source of truth, Acadexis provides students with an AI tutor that answers questions with **precise page-level citations**, preventing hallucinations. Simultaneously, it provides lecturers with analytics and **student struggle heatmaps** to identify topics that require further explanation.

---

## Key Modules & Features

### 🔐 Authentication & Single Sign-On (SSO)
- **University Google Sign-In:** Fully integrated Google OAuth2 SSO flow.
- **Academic Email Verification:** Automated domain validation (restricting sign-ups to `.edu`, `.edu.ng`, `.ac.uk` domains) to ensure only verified students and staff can access the portal.
- **Dynamic Registration Completion:** If a Google user log in for the first time, they are prompted to complete their profile (selecting University, Faculty, Department, Level, and Matric Number) before access is granted.

### 🎓 Student Workspace
- **Dashboard Overview:** Personal stats, active study sessions, notifications, and quick action shortcuts.
- **Study Lab (AI Tutor):** Engage in dynamic study sessions with course material-grounded AI that answers queries citing specific page numbers.
- **Digital Library:** Download course files (PDFs, PPTX, DOCX) uploaded directly by lecturers.
- **Quiz Engine:** Timed assessments generated for courses, complete with score summaries and history.
- **Bookmarks:** Save code blocks, text snippets, and verified answers from the AI tutor for revision.

### 👨‍🏫 Lecturer Workspace
- **Knowledge Hub:** Easily upload, manage, and delete course syllabi and lecture slides.
- **Student Analytics & Struggle Heatmaps:** Visual insights derived from students' questions to AI, helping lecturers identify exactly which course modules or concepts students struggle to grasp.
- **Course & Student Management:** Edit details, view enrolled class lists, and post announcements.

---

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org) 16.2 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.x
- **UI & Iconography:** [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Styling:** Vanilla CSS & [Tailwind CSS](https://tailwindcss.com)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) 5.x
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **HTTP Client:** [Axios](https://axios-http.com/) (configured with interceptors for auto-jwt refreshment and key conversion)

---

## Project Directory Structure

```
acadexis_frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router (Layouts and Pages)
│   │   ├── auth/           # Login, Register, Google Callback, complete signup
│   │   ├── dashboard/      # Role-based protected portals (student, lecturer)
│   │   ├── support/        # Help and issue reporting center
│   │   └── page.tsx        # Base landing page
│   ├── components/         # React Components
│   │   ├── ui/             # Core UI Design System primitives
│   │   └── dashboard/      # Layout structures (Sidebar, Topbar, AI Tutor panels)
│   ├── hooks/              # Custom React hooks (e.g. useCurrentUser, useNotifications)
│   ├── lib/                # Shared utilities and Tailwind overrides
│   ├── services/           # Axios HTTP Clients and API services
│   ├── store/              # Zustand global state (e.g. useAppStore)
│   └── types/              # Domain-specific TypeScript declarations
```

---

## Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm (or yarn / pnpm)

### 1. Installation
Clone the repository and install all node packages:
```bash
git clone https://github.com/oluwaseyipd/Acadexis_frontend.git
cd acadexis_frontend
npm install
```

### 2. Configuration
Create a `.env.local` file in the root directory and configure the variables:
```env
NEXT_PUBLIC_APP_NAME=Acadexis
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 3. Development
Start the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To build a highly optimized production bundle and run the server:
```bash
npm run build
npm run start
```

---

## Authentication Flow

> [!NOTE]
> All incoming and outgoing requests utilize Axios request/response interceptors to automatically append JWT Bearer tokens and gracefully refresh expired access keys.

1. **Email/Password:** Register and log in directly using credential fields.
2. **Google OAuth2 SSO:** 
   - Click "Continue with Google".
   - The frontend requests the redirection URL from the backend `/api/auth/google/university/?role=student`.
   - On consent, Google redirects the browser back to `/auth/google/callback?code=xyz`.
   - The callback page posts the code to the backend. If registered, it saves cookies/tokens and redirects to the dashboard. If not registered, it redirects to `/auth/register/complete` to gather academic profile information.

---

## Code Guidelines

- **TypeScript:** Write type-safe properties. Do not use `any` unless absolutely necessary.
- **Design Tokens:** Always utilize the theme tokens from `tailwind.config.ts` and `src/app/globals.css` rather than hardcoding colors.
- **Linting:** Ensure ESLint checks pass before committing:
  ```bash
  npm run lint
  ```

---

## License

This software is **proprietary** and all copyrights belong to the development team. Unauthorized distribution, modification, or copy of this codebase is strictly prohibited.