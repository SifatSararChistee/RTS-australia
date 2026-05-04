# RTS Australia - Visa Application & Tracking System

A modern visa application and tracking system designed for RTS Australia, enabling applicants to apply for visas and check their status, while providing administrators with a comprehensive portal to manage applications.

## 🚀 Features

### For Applicants
- **Visa Application**: A streamlined process for users to submit their visa applications.
- **Status Tracking**: Real-time tracking of visa application status via a dedicated check page.
- **Biometrics Status**: Specialized tracking for biometrics appointment and verification.
- **Document Check**: Interface for users to verify and manage required documentation.

### For Administrators
- **Admin Dashboard**: A centralized hub for managing all incoming visa applications.
- **Applicant Management**: Detailed views and management tools for individual applicant records.
- **Secure Authentication**: Protected admin access to ensure data privacy and security.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth & Database)
- **UI Components**: [Lucide React](https://lucide.dev/) (Icons), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## 📁 Project Structure

```text
src/
├── app/
│   ├── (public)/         # Publicly accessible pages (Apply, Check Visa, etc.)
│   │   ├── apply/        # Visa application form
│   │   ├── check-visa/   # Application status lookup
│   │   └── ...
│   ├── admin/            # Admin portal (Protected)
│   │   ├── login/        # Admin authentication
│   │   └── dashboard/     # Application management
│   └── applicants/       # Applicant detailed views
├── components/           # Reusable UI components (Navbar, Footer, etc.)
└── lib/                  # Core utilities (Supabase clients, Auth helpers)
```

## ⚙️ Getting Started

### Prerequisites
- Node.js 20+
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <<repositoryrepository-url>
   cd "RTS Australia"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

Build the project for production:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

## 🛡️ Security
- Admin routes are protected via Supabase Auth.
- API interactions are handled through secure client-side and server-side utilities in `src/lib`.

---
© 2026 RTS Australia
