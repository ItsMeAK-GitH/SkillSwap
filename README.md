# devswap v1 - AI-Powered Skill Exchange Platform for Developers

DevSwap is a modern web application designed to connect developers for peer-to-peer skill sharing. Leveraging a sophisticated AI-powered matching system, real-time chat, and a gamified reputation system, it provides a dynamic and engaging environment for learning and teaching.
<img width="1275" height="605" alt="Screenshot 2025-11-05 at 9 09 22 PM" src="https://github.com/user-attachments/assets/0847e3de-7b16-43c2-b6c9-ed965efb5982" />
<img width="1245" height="587" alt="Screenshot 2025-11-05 at 9 11 35 PM" src="https://github.com/user-attachments/assets/9d59bbd3-733f-43d1-b1fc-af95bf879ef2" />
<img width="1257" height="600" alt="Screenshot 2025-11-05 at 9 12 01 PM" src="https://github.com/user-attachments/assets/811d6289-5089-443b-b44a-37a808eb85d9" />
<img width="1257" height="600" alt="Screenshot 2025-11-05 at 9 10 47 PM" src="https://github.com/user-attachments/assets/d1ff7052-55d1-4839-8d63-d3d228258857" />



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

## Folder Structure

The project follows a feature-centric structure within the Next.js App Router paradigm. Key directories are organized to separate concerns and improve maintainability.


/ ├── public/ # Static assets (images, fonts) ├── src/ │ ├── app/ # Next.js App Router (pages, layouts, API routes) │ ├── ai/ # Genkit flows and AI-related logic │ │ └── flows/ # Specific AI agent flows (e.g., matching, verification) │ ├── components/ # Reusable React components │ │ ├── layout/ # Layout components (Header, Footer) │ │ ├── sections/ # Large, page-specific sections │ │ └── ui/ # ShadCN UI components │ ├── firebase/ # Firebase configuration, hooks, and providers │ │ └── auth/ # Authentication-related hooks (e.g., useUser) │ ├── hooks/ # Custom React hooks (e.g., useToast) │ ├── lib/ # Utility functions, auth logic, constants │ └── ... ├── docs/ # Project documentation (e.g., backend schema) ├── next.config.ts # Next.js configuration ├── tailwind.config.ts # Tailwind CSS configuration └── tsconfig.json # TypeScript configuration

##  Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project with Authentication (Google Sign-In) and Firestore enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devswap.git
cd devswap
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
