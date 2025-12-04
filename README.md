# 🚀 SkillSync - Smart Competency Diagnostic & Profile Score Calculator

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)

**An AI-Powered Technical Assessment and Career Development Platform**

[Demo](#demo) • [Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📋 Overview

SkillSync is a comprehensive web-based platform designed to assess technical competencies, provide personalized career guidance, and recommend targeted upskilling paths. The system leverages artificial intelligence, real-time code execution, and adaptive assessment methodologies to deliver an integrated solution for technical skill evaluation and professional development.

## ✨ Features

### 🎯 Assessment System
- **Multiple Choice Questions (MCQ)**: Operating Systems, Database Management, Computer Networks, Aptitude
- **Coding Assessments**: Python, Java, C++, JavaScript with real-time code execution
- **Timed Assessments**: Auto-submission with progress tracking
- **Results Visualization**: Charts and historical performance tracking

### 🤖 AI-Powered Features
- **AI Mentor**: Conversational career guidance using Gemini/GPT models
- **Career Path Recommendations**: Skills-based job suggestions with live links
- **Course Recommendations**: AI-generated course suggestions based on skill gaps

### 👤 User Management
- **Profile System**: Skills tracking, education history, work experience
- **Authentication**: Secure email/password authentication with password reset
- **Protected Routes**: Authentication-based access control

### 📊 Dashboard & Analytics
- Assessment completion statistics
- Performance visualization with interactive charts
- Personalized assessment recommendations

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.3.1 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| TanStack Query | Server State Management |
| Monaco Editor | Code Editor |
| Recharts | Data Visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Deno Edge Functions | Serverless Functions |
| Row-Level Security | Data Access Control |

### External Services
| Service | Purpose |
|---------|---------|
| Judge0 | Secure Code Execution |
| Lovable AI Gateway | AI Model Access |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or bun package manager
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FauzanJavid/Smart-Competency-Diagnostic-and-Profile-Score-Calculator.git
   cd Smart-Competency-Diagnostic-and-Profile-Score-Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   # Get these from your Supabase project settings
   ```

4. **Configure environment variables**
   Create a `.env` file with the following:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── AIMentor.tsx    # AI chat interface
│   │   ├── AppSidebar.tsx  # Main navigation
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── pages/              # Route-level components
│   │   ├── Dashboard.tsx
│   │   ├── Assessment.tsx
│   │   ├── CodingAssessment.tsx
│   │   ├── Results.tsx
│   │   ├── Profile.tsx
│   │   ├── CareerPath.tsx
│   │   └── Upskilling.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript definitions
│   ├── data/               # Static question data
│   └── integrations/       # External service clients
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
└── tailwind.config.ts      # Tailwind configuration
```

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🏗️ Architecture

An SVG architecture diagram is available at `public/architecture.svg`. When running the dev server, you can view it at: http://localhost:5173/architecture.svg

### Data Flow
```
User Interface → React Components → TanStack Query
       ↓
Supabase Client → Edge Functions → External APIs (AI, Code Execution)
       ↓
PostgreSQL Database (RLS Enabled) → Real-time Subscriptions
       ↓
Data Updates → React Query Cache → UI Re-render
```

## 🔐 Security Features

- **Authentication**: JWT-based with auto-refresh tokens
- **Authorization**: Role-Based Access Control (RBAC)
- **Data Protection**: Row-Level Security (RLS) policies
- **Input Validation**: Zod schemas for all user inputs
- **Secure Code Execution**: Sandboxed via Judge0

## 📚 Documentation

For detailed documentation, see:
- [Research Documentation](./RESEARCH_DOCUMENTATION.md) - Comprehensive technical documentation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Fauzan Javid** - *Initial work*

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Judge0](https://judge0.com/) for code execution capabilities
- [Lovable](https://lovable.dev/) for AI integration

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Supabase**

</div>
