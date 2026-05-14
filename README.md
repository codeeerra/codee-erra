# codee.erra — Full Stack Website

A premium futuristic portfolio and product showcase website for the technology startup **codee.erra**.

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + Custom CSS (Glassmorphism, Neon effects)
- **Animations**: Framer Motion
- **Backend/DB**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Hosting**: Vercel (Frontend) + Firebase (Backend)

---

## Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database** (start in production mode)
4. Enable **Firebase Authentication** → Email/Password provider
5. Enable **Firebase Storage**
6. Go to Project Settings → Your Apps → Add Web App
7. Copy your config values

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Create Admin User

In Firebase Console → Authentication → Users → Add User:
- Email: `admin@codee.erra` (or any email)
- Password: (your choice)

### 5. Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads for content
    match /products/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /news/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /upcomingProjects/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /about/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /settings/{doc} { allow read: if true; allow write: if request.auth != null; }
    // Inquiries: anyone can write, only admin reads
    match /inquiries/{doc} { allow create: if true; allow read, update, delete: if request.auth != null; }
  }
}
```

### 6. Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/) → New Project → Import from GitHub
3. Add all environment variables from `.env.local`
4. Deploy!

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with Hero, News, Products, Upcoming |
| `/about` | Company about page |
| `/admin/login` | Secure admin login |
| `/admin/dashboard` | Dashboard overview |
| `/admin/dashboard/logo` | Logo management |
| `/admin/dashboard/home` | Home content overview |
| `/admin/dashboard/products` | Products CRUD |
| `/admin/dashboard/news` | News CRUD |
| `/admin/dashboard/upcoming` | Upcoming projects CRUD |
| `/admin/dashboard/about` | About page editor |
| `/admin/dashboard/inquiries` | View & manage inquiries |
| `/admin/dashboard/settings` | Site settings & password |

---

## Folder Structure

```
/app                    # Next.js App Router pages
  /about               # About page
  /admin
    /login             # Admin login
    /dashboard         # Protected admin area
      /logo
      /home
      /products
      /news
      /upcoming
      /about
      /inquiries
      /settings
/components
  /admin               # Admin-specific components
  /public              # Public-facing components
/firebase              # Firebase config & service functions
/hooks                 # React hooks (auth context)
/styles                # Global CSS
/types                 # TypeScript interfaces
/public                # Static assets (logo, etc.)
```

---

## Brand Colors

| Color | Hex |
|-------|-----|
| Background Primary | `#020617` |
| Background Secondary | `#0F172A` |
| Accent Cyan | `#00D9FF` |
| Cyan Glow | `#00F0FF` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#94A3B8` |

---

Built with precision and vision by **codee.erra** 🚀
