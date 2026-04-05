# NextFlow — Visual LLM Workflow Builder
 
<div align="center">
 
![NextFlow Banner](https://img.shields.io/badge/NextFlow-LLM%20Workflow%20Builder-7c6aff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWxpbmUgcG9pbnRzPSIyMiAxMiAxOCAxMiAxNSAyMSA5IDMgNiAxMiAyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+)
 
**A pixel-perfect Krea.ai-inspired visual workflow builder for LLM pipelines.**
 
Build, connect, and execute AI workflows with a drag-and-drop canvas — powered by Google Gemini.
 
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![React Flow](https://img.shields.io/badge/React%20Flow-11.11-ff4d00?style=flat-square)](https://reactflow.dev)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff?style=flat-square&logo=clerk)](https://clerk.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.7-2d3748?style=flat-square&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-008bb9?style=flat-square&logo=postgresql)](https://neon.tech)
 
[Live Demo](https://next-flow-gamma-one.vercel.app/) 



 
</div>
 
---
 
## Table of Contents
 
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Node Types](#node-types)
- [API Routes](#api-routes)
- [Workflow Engine](#workflow-engine)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [License](#license)
 
---
 
## Overview
 
NextFlow is a full-stack visual AI workflow builder inspired by [Krea.ai](https://krea.ai). It lets you drag-and-drop nodes onto a canvas, connect them with animated edges, and execute multi-step LLM pipelines — all in a clean, dark interface.
 
Think of it as a visual programming environment where each node is a unit of computation: a text prompt, an image upload, a Gemini AI call, or a media processing step. Nodes pass data to each other through connections, and the execution engine runs independent branches in parallel.
 
**Built as a technical assignment demonstrating:**
- Full-stack Next.js with App Router and TypeScript
- Visual graph programming with React Flow
- Real Gemini AI integration (text + vision)
- PostgreSQL persistence with Prisma ORM
- Clerk authentication with protected routes
- Parallel DAG execution engine
- Production-ready API design with Zod validation
 
---
 
## Features
 
### Core Canvas
- 🎨 **Dark Krea-inspired UI** — dot-grid canvas, dark theme, smooth animations
- 🖱️ **Drag & Drop** — drag nodes from sidebar directly onto canvas
- 🔗 **Animated Connections** — connect nodes with animated purple edges
- 🗺️ **MiniMap** — canvas overview for large workflows
- 🔍 **Pan & Zoom** — smooth navigation with keyboard/mouse
- 🗑️ **Node Deletion** — delete key or button
- ✨ **Pulsating Glow** — nodes visually animate while executing
 
### Node System (6 Node Types)
- 📝 **Text Node** — static text input that feeds into other nodes
- 🖼️ **Image Upload Node** — upload images with live preview
- 🎬 **Video Upload Node** — upload videos with inline player
- 🤖 **LLM Node** — Gemini AI with model selector, system prompt, user message, image inputs, and inline response
- ✂️ **Crop Image Node** — configurable x/y/width/height crop parameters
- 🎞️ **Extract Frame Node** — pull a frame from video at a given timestamp
 
### Execution Engine
- ⚡ **Parallel Execution** — independent branches run simultaneously
- 🔄 **DAG Validation** — detects and rejects circular dependencies
- 📊 **Node-Level Status** — idle → running → success/error per node
- 🏃 **Streaming Status** — real-time visual feedback during runs
 
### Authentication
- 🔐 **Clerk Auth** — email + Google sign-in
- 🛡️ **Protected Routes** — all canvas routes require authentication
- 👤 **User Scoping** — workflows and history are per-user
- 🖼️ **User Avatar** — Clerk UserButton in topbar
 
### Data & Persistence
- 💾 **Save Workflows** — save canvas state to PostgreSQL
- 📂 **Load Workflows** — restore saved workflows
- 📤 **JSON Export** — download workflow as `.json` file
- 📥 **JSON Import** — restore any exported workflow
- 📜 **Run History** — full execution history in right sidebar with node-level results
 
---
 
## Tech Stack
 
| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 15.1.6 | App Router framework |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety throughout |
| [React Flow](https://reactflow.dev) | 11.11 | Visual workflow canvas |
| [Zustand](https://zustand-demo.pmnd.rs) | 5.0 | Client state management |
| [Clerk](https://clerk.com) | 6.x | Authentication |
| [Prisma](https://prisma.io) | 6.7 | Database ORM |
| [PostgreSQL](https://neon.tech) | via Neon | Persistent storage |
| [Zod](https://zod.dev) | 3.x | API schema validation |
| [TailwindCSS](https://tailwindcss.com) | 4.x | Utility-first styling |
| [Google Gemini API](https://aistudio.google.com) | v1beta | LLM inference |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | — | UI typography |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | — | Code/output typography |
 
---
 
## Getting Started
 
### Prerequisites
 
- **Node.js** 18 or higher
- **npm** 9 or higher
- A **Neon** PostgreSQL database (free tier) — [neon.tech](https://neon.tech)
- A **Gemini API key** (free tier with limits) — [aistudio.google.com](https://aistudio.google.com/app/apikey)
- A **Clerk** account (free tier) — [clerk.com](https://clerk.com)
 
### Installation
 
**1. Clone the repository**
 
```bash
git clone https://github.com/YOUR_USERNAME/nextflow.git
cd nextflow
```
 
**2. Install dependencies**
 
```bash
npm install
```
 
**3. Set up environment variables**
 
```bash
cp .env.example .env
```
 
Fill in your `.env` file (see [Environment Variables](#environment-variables) section below).
 
**4. Push database schema**
 
```bash
npx prisma generate
npx prisma db push
```
 
**5. Start the development server**
 
```bash
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000) — you will be redirected to the sign-in page.
 
---
 
## Environment Variables
 
Create a `.env` file in the project root with the following variables:
 
```env
# ─────────────────────────────────────────────
# Database — PostgreSQL via Neon (free tier)
# Get your connection string at: https://neon.tech
# ─────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
 
# ─────────────────────────────────────────────
# Google Gemini API
# Get your free key at: https://aistudio.google.com/app/apikey
#
# ⚠️  IMPORTANT — API USAGE LIMITS:
# The Gemini API free tier has rate limits:
#   - 15 requests per minute (RPM)
#   - 1 million tokens per minute (TPM)
#   - 1,500 requests per day (RPD)
#
# If you see errors like "RESOURCE_EXHAUSTED" or
# "quota exceeded", you have hit the free tier limit.
# Wait 1 minute and try again, or upgrade at:
# https://ai.google.dev/pricing
# ─────────────────────────────────────────────
GEMINI_API_KEY="AIzaSy..."
 
# ─────────────────────────────────────────────
# Clerk Authentication
# 1. Create a free account at: https://clerk.com
# 2. Create a new application named "NextFlow"
# 3. Enable Email and Google sign-in methods
# 4. Go to Dashboard > API Keys and copy both keys
# ─────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
 
# Clerk redirect URLs — keep exactly as shown
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```
 
### Getting Each Key
 
| Key | Where to get it | Time |
|---|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) → New Project → Connection String | 2 min |
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) → Create API Key | 2 min |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [clerk.com](https://clerk.com) → Dashboard → API Keys | 5 min |
| `CLERK_SECRET_KEY` | Same Clerk dashboard page | — |
 
---
 
## Project Structure
 
```
nextflow/
├── prisma/
│   └── schema.prisma          # Database models (Workflow, WorkflowRun)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── workflows/
│   │   │   │   └── route.ts   # GET/POST workflows (auth-protected)
│   │   │   ├── workflow-runs/
│   │   │   │   └── route.ts   # GET/POST run history (auth-protected)
│   │   │   └── nodes/
│   │   │       ├── run-llm/
│   │   │       │   └── route.ts   # Gemini API call with model fallback
│   │   │       ├── crop-image/
│   │   │       │   └── route.ts   # Image crop (Zod validated)
│   │   │       └── extract-frame/
│   │   │           └── route.ts   # Video frame extraction
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx       # Clerk sign-in page
│   │   ├── sign-up/[[...sign-up]]/
│   │   │   └── page.tsx       # Clerk sign-up page
│   │   ├── globals.css        # Dark theme + all custom CSS classes
│   │   ├── layout.tsx         # Root layout with ClerkProvider
│   │   └── page.tsx           # Main canvas page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar.tsx     # Top navigation with run/save/export buttons + Clerk UserButton
│   │   │   ├── LeftSidebar.tsx  # Searchable node palette
│   │   │   └── RightSidebar.tsx # Run history with node-level details
│   │   ├── nodes/
│   │   │   ├── TextNode.tsx
│   │   │   ├── ImageUploadNode.tsx
│   │   │   ├── VideoUploadNode.tsx
│   │   │   ├── LLMNode.tsx
│   │   │   ├── CropImageNode.tsx
│   │   │   └── ExtractFrameNode.tsx
│   │   └── workflow/
│   │       └── FlowCanvas.tsx # Main React Flow canvas + execution logic
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── utils.ts           # Helper utilities
│   │   └── workflowExecuter.ts  # DAG engine — topological sort + parallel execution
│   │
│   ├── store/
│   │   └── workflowStore.ts   # Zustand store — nodes, edges, history, UI state
│   │
│   ├── types/
│   │   └── workflow.ts        # TypeScript types for nodes, runs, status
│   │
│   └── middleware.ts          # Clerk route protection
│
├── .env.example               # Environment variable template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```
 
---
 
## Node Types
 
### Text Node
Provides static text content to downstream nodes. Connect its output to an LLM node's **System Prompt** or **User Message** handle.
 
```
[Text Input] ──output──▶ [LLM Node: system_prompt]
                    └──▶ [LLM Node: user_message]
```
 
### Image Upload Node
Upload a local image (JPG, PNG, WEBP, GIF). Shows a preview after upload. Outputs a base64 data URL that can be passed to an LLM node for vision analysis.
 
### Video Upload Node
Upload a local video (MP4, MOV, WEBM, M4V). Shows an inline video player. Connect to an Extract Frame node to pull frames.
 
### LLM Node (Gemini AI)
The core AI node. Accepts up to 3 types of input:
- **System Prompt** (optional) — sets the AI's behavior/persona
- **User Message** (required) — the main prompt
- **Images** (optional, multiple) — for vision/multimodal tasks
 
Displays the AI response **inline on the node** after execution. Supports all Gemini models with automatic fallback if a model is unavailable on your API key.
 
> ⚠️ **Note on Gemini API limits:** The free tier allows 15 requests/minute and 1,500 requests/day. If the LLM node shows a "quota exceeded" error, wait 60 seconds and try again.
 
### Crop Image Node
Takes an image URL input and crops it using percentage-based parameters:
- **X %** — horizontal offset from left
- **Y %** — vertical offset from top  
- **Width %** — crop width as percentage of original
- **Height %** — crop height as percentage of original
 
### Extract Frame Node
Extracts a single frame from a video at a specified timestamp.
- Input: **50%** (halfway through) or **12.5** (12.5 seconds in)
- Output: an image URL of the extracted frame
 
---
 
## API Routes
 
All routes are protected by Clerk authentication. Requests without a valid session return `401 Unauthorized`.
 
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/workflows` | Save a workflow (nodes + edges) to DB |
| `GET` | `/api/workflows` | List all workflows for the logged-in user |
| `POST` | `/api/workflow-runs` | Persist an execution run to DB |
| `GET` | `/api/workflow-runs` | Get run history for logged-in user |
| `POST` | `/api/nodes/run-llm` | Execute a Gemini API call |
| `POST` | `/api/nodes/crop-image` | Validate and process a crop request |
| `POST` | `/api/nodes/extract-frame` | Validate and process a frame extraction |
 
All `POST` routes use **Zod** for request body validation and return structured error messages on invalid input.
 
---
 
## Workflow Engine
 
The execution engine in `src/lib/workflowExecuter.ts` implements a **topological sort with parallel batch execution**:
 
```
1. Build dependency graph from edges
2. Detect cycles (throws error if found — DAG only)
3. Find all nodes with no dependencies → Batch 1
4. Execute Batch 1 in parallel (Promise.all)
5. For each completed node, unlock downstream nodes
6. Repeat until all nodes executed
```
 
**Example — Parallel branches:**
```
[Image Upload] ──▶ [Crop Image] ──▶ [LLM Node #1] ──▶ [LLM Node #2]
                                                              ▲
[Video Upload] ──▶ [Extract Frame] ──────────────────────────┘
```
 
Batch 1: `Image Upload` + `Video Upload` (parallel)
Batch 2: `Crop Image` + `Extract Frame` (parallel)
Batch 3: `LLM Node #1`
Batch 4: `LLM Node #2` (waits for both branches)
 
---
 
## Deployment
 
### Deploy to Vercel
 
**1. Push to GitHub**
 
```bash
git add .
git commit -m "feat: complete NextFlow workflow builder"
git push origin main
```
 
**2. Import on Vercel**
 
- Go to [vercel.com](https://vercel.com)
- Click **Add New Project**
- Import your GitHub repository
- Vercel auto-detects Next.js — no config needed
 
**3. Add Environment Variables**
 
In the Vercel dashboard under **Settings → Environment Variables**, add all variables from your `.env` file:
 
```
DATABASE_URL
GEMINI_API_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
```
 
**4. Add Vercel URL to Clerk**
 
After deployment, copy your Vercel URL (e.g. `https://nextflow.vercel.app`) and add it to Clerk:
- Clerk Dashboard → **Domains** → Add your Vercel URL
 
**5. Run DB Migration**
 
```bash
npx prisma migrate deploy
```
 
---
 
## Available Scripts
 
```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database (dev)
npm run db:generate  # Regenerate Prisma client
npm run db:migrate   # Create and apply a new migration
```
 
---
 
## Known Limitations
 
### Gemini API Free Tier Limits
> ⚠️ The Gemini API is **not fully free**. The free tier has the following limits:
> - **15 requests per minute (RPM)**
> - **1,500 requests per day (RPD)**
> - **1 million tokens per minute (TPM)**
>
> If you run many workflows quickly, you may hit the rate limit and see a `RESOURCE_EXHAUSTED` error on the LLM node. This is a quota issue, not a code bug.
>
> **Solutions:**
> - Wait 60 seconds between runs
> - Upgrade to Gemini API paid tier at [ai.google.dev/pricing](https://ai.google.dev/pricing)
> - Use a different Gemini model (Flash models have higher free quotas than Pro)
 
### File Uploads (Local Only)
Image and video uploads currently use browser-local `FileReader` and `URL.createObjectURL`. Files are stored as base64 data URLs in memory. This means:
- Uploads don't persist after page refresh
- Large files (>5MB) may slow the app
- For production, replace with a cloud storage provider (Transloadit, Cloudinary, S3)
 
### FFmpeg (Simulated)
The Crop Image and Extract Frame nodes are architecturally wired up but use simulated execution in the current version (returning the input URL as output). Full FFmpeg processing via Trigger.dev requires a paid Trigger.dev account.
 
### No Undo/Redo
React Flow's built-in undo/redo is not yet wired up. Planned for a future release.
 
---
 
## Database Schema
 
```prisma
model Workflow {
  id        String        @id @default(cuid())
  userId    String                              // Clerk user ID
  name      String
  nodes     Json                               // React Flow node array
  edges     Json                               // React Flow edge array
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  runs      WorkflowRun[]
}
 
model WorkflowRun {
  id         String   @id @default(cuid())
  workflowId String
  userId     String                            // Clerk user ID
  status     String   @default("running")     // success | error | running
  result     Json?                             // node-level execution results
  createdAt  DateTime @default(now())
  workflow   Workflow @relation(...)
}
```
 
---
 
## Contributing
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to branch: `git push origin feat/your-feature`
5. Open a Pull Request
 
---
 
##Owner
Gurmeet Singh Rathor
 
---
 
<div align="center">
 
Built with ❤️ using Next.js, React Flow, and Gemini AI API
 
</div>
