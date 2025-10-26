# SkillSwap - AI-Powered Skill Exchange Platform

SkillSwap is a modern web application designed to connect individuals for peer-to-peer skill sharing. Leveraging a sophisticated AI-powered matching system, real-time chat, and a gamified reputation system, it provides a dynamic and engaging environment for learning and teaching.



## Features

-   **Modular User Profiles**: Showcase your skills to teach and your desired skills to learn using a clean, tag-based system.
-   **AI-Powered Matching**: Our intelligent algorithm, powered by Google's Gemini, connects you with the perfect partner for a mutually beneficial skill exchange.
-   **Real-time Chat**: Seamlessly communicate, plan sessions, and share 'Skill Snippets' with our integrated chat.
-   **Skill Snippet Sharing**: Share project links or code snippets in chat, complete with rich, AI-generated previews.
-   **Job & Skill Recommendations**: Discover job opportunities based on your skillset and get AI-driven recommendations for new skills to learn.
-   **Gamified Reputation**: Earn Skill Points, climb the leaderboard, and unlock badges to certify your mastery (future feature).
-   **Dynamic UI**: A visually stunning interface with a matrix-style animated background and smooth parallax scrolling effects.

##  Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Lenis](https://lenis.studiofreight.com/) for smooth scrolling

##  Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project with Authentication (Google Sign-In) and Firestore enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillswap.git
cd skillswap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Now, open `.env.local` and add your Firebase project credentials. You can find these in your Firebase project settings.

```dotenv
# Firebase Project Credentials
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# Genkit/Gemini API Key
GEMINI_API_KEY="your-google-ai-studio-api-key"
```

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## ☁️ Deployment

This application is configured for easy deployment with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting). Simply connect your GitHub repository in the Firebase console to set up automatic builds and deployments.

---
