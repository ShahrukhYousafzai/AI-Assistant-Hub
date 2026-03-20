# AI Assistant Hub

AI Assistant Hub is a powerful, self-service platform designed to let users create, train, and deploy custom AI chatbots in minutes. By leveraging Google's Gemini models via Genkit, the platform allows for sophisticated personality engineering, multi-source knowledge retrieval, and seamless deployment across various channels.

## 🚀 Overview

The goal of this project is to provide a "No-Code" interface for building RAG (Retrieval-Augmented Generation) capable AI assistants. Users can upload their own knowledge bases (PDFs, URLs, or raw text) and instantly "attach" them to specific chatbot instances with unique personas.

## 🛠 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescript.org/)
- **AI Orchestration:** [Genkit](https://firebase.google.com/docs/genkit)
- **Generative Models:** [Google Gemini 2.5 Flash & 1.5 Pro](https://ai.google.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## ✨ Features & Progress

### Core Functionality
- [x] **Multi-Chatbot Management:** Create and manage multiple distinct AI assistants from a single dashboard.
- [x] **Data Source Library:** Centralized repository for knowledge sources (Documents, Websites, and Raw Text).
- [x] **Persona Builder:** Define custom instructions, rules, and personality traits for each bot.
- [x] **Custom Greetings:** Set unique welcome messages for different user contexts.

### AI Capabilities (Genkit Powered)
- [x] **Multilingual Support:** Auto-detection and response translation using Gemini's linguistic prowess.
- [x] **Suggestion Bubbles:** AI-generated follow-up questions to guide user conversations.
- [x] **Automated Data Processing:** AI-driven tagging and summarization of uploaded knowledge sources.

### Deployment & Analytics
- [x] **Deployment Suite:** One-click access to Hosted Links, Embed Scripts, and Iframe codes.
- [x] **Analytics Dashboard:** Visualization of conversation volume and most active bots.
- [x] **Knowledge Gap Analysis:** Tracking of questions the AI couldn't answer to improve training.

### 📝 Roadmap / Remaining Tasks
- [ ] **Full Firestore Persistence:** Transition from mock data to real-time Firebase storage.
- [ ] **Vector Database Integration:** Implement true RAG using vector embeddings for large-scale knowledge retrieval.
- [ ] **User Authentication:** Secure access to the dashboard using Firebase Auth.
- [ ] **Advanced Analytics:** Real-time event tracking for user feedback (thumbs up/down).
- [ ] **Live File Processing:** Integration with Cloud Storage for actual PDF/Docx ingestion.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/ai/`: Genkit flow definitions, prompts, and AI configuration.
- `src/components/`: Reusable UI components (Dashboard, Chat Views, Dialogs).
- `src/lib/`: Type definitions, mock data, and utility functions.
- `src/hooks/`: Custom React hooks for UI logic and toasts.

## 🚦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file with your `GOOGLE_GENAI_API_KEY`.

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Explore Genkit (Optional):**
   ```bash
   npm run genkit:dev
   ```

---
Built with ❤️ using Firebase Studio and Google AI.