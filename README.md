# AdCreator AI

AdCreator AI is a modern Next.js React application designed to help growth marketers, founders, and agencies scale their winning ad patterns. Users can input their top-performing ad scripts and the AI will generate high-converting creative variants (scripts, hooks, CTAs, and storyboards) across multiple angles.

## Features

- **Project Library:** Manage and track all your ad generation projects from a central dashboard.
- **Winning Ad Extractor:** Input up to 5 successful ad scripts to extract core patterns (hooks, structure, proof type).
- **Variant Generation Wizard:** Receive an "Angle Board" with fully generated scripts and CTAs tailored to different psychological angles (e.g., Contrarian, Founder Story).
- **Modern UI:** Built with Next.js, Tailwind CSS v4, Framer Motion, and Radix UI primitives for a sleek, dark-themed glassmorphism aesthetic.
- **Authentication:** Secure Google and Email/Password login powered by Firebase Authentication.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Authentication:** [Firebase Auth](https://firebase.google.com/)
*   **Language:** TypeScript

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js 18+ installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/adcreator-ai.git
   cd adcreator-ai
   npm install
   ```

3. **Firebase Setup:**
   The project is pre-configured with a Firebase project in `src/lib/firebase.ts`. If you fork this project for production, you should replace the `firebaseConfig` object with your own Firebase project credentials and enable **Email/Password** and **Google Sign-In** in the Firebase Authentication console.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Deploying to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. **Push your code to GitHub using GitHub Desktop:**
   - Open **GitHub Desktop** and log into your account.
   - Go to **File > Add Local Repository...**
   - Click **Choose...** and select the `/Users/aryangarg/Documents/Kraken/Ad creator` folder (the root folder containing this README).
   - If prompted that it's "not a Git repository", click the **create a repository** link.
     - Name: `adcreator-ai`
     - Local path: Make sure it points to `/Users/aryangarg/Documents/Kraken/Ad creator`.
     - Click **Create Repository**.
   - Your files are now tracked. Give your commit a Summary name like "Initial commit" at the bottom left, and click the blue **Commit to main** button.
   - Click the **Publish repository** button at the very top right of the app window.
   - Keep "Keep this code private" checked if you prefer, and click **Publish repository**.

2. **Import to Vercel:**
   - Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
   - Import your newly created `adcreator-ai` GitHub repository.
   - Vercel will automatically detect that it's a Next.js project.
   - Click **Deploy**.

3. **Configure Firebase Authorized Domains:**
   Once Vercel gives you a production URL (e.g., `https://adcreator-ai.vercel.app`), go to your Firebase Console:
   - Go to **Authentication > Settings > Authorized domains**
   - Click **Add domain** and paste your Vercel URL. This ensures Google Sign-In works in production!

## Architecture per PRD

This MVP scaffolding establishes the foundation (Phases 1-4) outlined in the primary Product Requirements Document (PRD).

The next technical phases involve:
- Orchestrating the Variant Generation Engine using the OpenAI API.
- Setting up a database (e.g., Firebase Firestore) to persist User Projects and generated Angle Boards.
