# Instituto Casa Biblica

Portal de cursos biblicos da 2a Igreja Presbiteriana Independente de Maringa (2IPI).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth & DB | Firebase (Authentication + Firestore) |
| Hosting | Firebase Hosting |
| Testing | Jest 30 + Testing Library |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- A Firebase project with Authentication and Firestore enabled

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables and fill in your Firebase config
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Get these from Firebase Console > Project Settings > Your apps > Web app:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Available Scripts

```bash
npm run dev            # Development server
npm run build          # Static export to /out
npm run lint           # ESLint
npm test               # Run tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Coverage report (80% threshold)
```

## Architecture

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page (public)
│   ├── layout.tsx                # Root layout (Header + Footer)
│   ├── globals.css               # Tailwind v4 theme + global styles
│   ├── loading.tsx               # Global loading skeleton
│   │
│   ├── login/                    # Login (email/password + Google OAuth)
│   ├── register/                 # Registration form + success page
│   ├── dashboard/                # User dashboard (enrolled courses, progress)
│   │
│   ├── course/[id]/              # Course pages (dynamic routing)
│   │   ├── page.tsx              # Course overview (public)
│   │   ├── CoursePageClient.tsx   # Client component for course details
│   │   ├── content/              # Lesson viewer (requires purchase)
│   │   └── enrollment/           # Enrollment + payment form
│   │
│   └── admin/                    # Admin panel (admin role required)
│       ├── page.tsx              # Dashboard (stats, enrollments overview)
│       ├── layout.tsx            # Sidebar navigation + auth guard
│       ├── courses/              # CRUD courses, modules, lessons, history
│       ├── enrollments/          # Student enrollments + CSV export
│       └── settings/             # Admin email whitelist
│
├── components/                   # Shared React components
│   ├── Header.tsx                # Sticky navbar with auth menu
│   ├── Footer.tsx                # Footer with contact info
│   ├── HeroSection.tsx           # Landing page hero
│   ├── CoursesSection.tsx        # Course card grid
│   ├── AboutSection.tsx          # About section
│   ├── CTASection.tsx            # Call-to-action
│   ├── VideoSection.tsx          # Responsive video embed
│   ├── Skeleton.tsx              # Skeleton loaders
│   └── ClientProviders.tsx       # React context wrapper
│
├── contexts/
│   └── AuthContext.tsx           # Auth state (user, profile, isAdmin)
│
└── lib/                          # Business logic
    ├── firebase.ts               # Firebase initialization
    ├── courses.ts                # Course CRUD, modules, lessons, history
    ├── admin.ts                  # Admin operations, enrollment reports
    ├── storage.ts                # User profiles, purchases, progress
    ├── csv-export.ts             # CSV export for enrollments
    └── seed-courses.ts           # Seed default course data
```

### Authentication Flow

```
Login/Register
  └─> Firebase Auth (Email/Password or Google)
        └─> AuthContext: onAuthStateChanged()
              ├─> Fetch user profile from Firestore (users/{uid})
              ├─> Check email against admin whitelist (config/admin)
              └─> Redirect: admin -> /admin, user -> /dashboard
```

**Protected routes:**

| Route | Requirement |
|-------|-------------|
| `/dashboard` | Authenticated |
| `/course/[id]/enrollment` | Authenticated |
| `/course/[id]/content` | Purchased course |
| `/admin/**` | Admin role |

### Firestore Data Model

```
users/{uid}
├── fullName, email, phone, birthDate, role, ...
├── purchases/{purchaseId}         # Course enrollments
│   └── courseId, paymentMethod, amount, status, purchaseDate
└── progress/{courseId}            # Lesson completion
    └── completedLessons[], lastAccessed

courses/{courseId}
├── title, description, instructor, level, status, published, ...
├── pricePix, priceCard, installments, order
├── objectives[], syllabus[], requirements[]
├── modules/{moduleId}             # Course structure
│   ├── title, order
│   └── lessons/{lessonId}
│       └── title, duration, type (video|pdf|text), url, order
└── history/{historyId}            # Edit versioning (snapshots)
    └── snapshot, editedBy, editedByEmail, changeDescription

config/admin
└── adminEmails[]                  # Admin email whitelist
```

### Styling

Tailwind CSS v4 with custom theme defined in `src/app/globals.css` using `@theme inline`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#D96A3B` | Buttons, links, accents |
| `--color-navy` | `#2B3044` | Header, footer, text |
| `--color-cream` | `#F0E0D0` | Background |
| `--font-sans` | Montserrat | All text |

### State Management

- **AuthContext** (React Context): global auth state (user, profile, isAdmin)
- **Firebase Firestore**: server-side data (courses, enrollments, progress)
- **localStorage**: offline cache for purchases and lesson progress, synced with Firestore on load

### Build & Deployment

The app builds as a static export (`output: "export"` in `next.config.ts`) and deploys to Firebase Hosting.

**CI/CD pipelines** (`.github/workflows/`):

| Workflow | Trigger | Target |
|----------|---------|--------|
| `deploy-production.yml` | Push to `main` | Production |
| `deploy-staging.yml` | Push to `staging` | Staging |
| `pr-preview.yml` | Pull request | Staging (preview URL commented on PR) |

All pipelines run: `npm ci` > `lint` > `test --coverage` > `build` > deploy.

## Testing

Tests live in `__tests__/` directories alongside the code they test. Coverage threshold is 80% for statements, branches, functions, and lines.

```bash
npm test               # Run all tests
npm run test:coverage  # Run with coverage report
```

## License

Private project for 2a Igreja Presbiteriana Independente de Maringa.
