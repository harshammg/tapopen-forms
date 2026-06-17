# TapOpen Forms (Secure & Timed Google Forms)

TapOpen Forms is an open-source, production-grade SaaS platform and Chrome Extension combination that adds customizable, secure countdown timers and anti-cheat proctoring to Google Forms.

This repository is split into two components:
1. **`/chrome-extension`**: The browser extension used by teachers/form creators to configure timers directly on Google Forms and sync links to the dashboard.
2. **`/saas-website`**: The React + Vite dashboard web app where teachers manage their links and students take the exams in a secure, timed viewport.

---

## Features
* **Custom Timers**: Set custom durations and expiration dates for any Google Form.
* **Frictionless for Students**: Students do not need to install anything! They just open the secure link.
* **Anti-Cheat Proctoring**: Detects when a student switches tabs or minimizes the window, automatically locking the exam.
* **Auto-Submit & Force Submission**: Auto-fills empty required fields with "Not filled" and automatically submits when the timer runs out (requires the student to have the Chrome Extension installed).
* **Supabase Integration**: Secure user authentication and Row-Level Security (RLS) database schemas.

---

## Tech Stack
* **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide Icons
* **Extension**: Manifest V3, Vite, CRXJS, TypeScript
* **Backend**: Supabase (Database, Auth, and Row-Level Security)
* **Hosting/CI/CD**: Cloudflare Pages / Workers Assets

---

## Prerequisites
Before you start, make sure you have:
* [Node.js](https://nodejs.org/) (v18 or higher)
* A free [Supabase](https://supabase.com/) account
* A free [Cloudflare](https://cloudflare.com/) account

---

## Setup Guide

### Step 1: Database Setup (Supabase)
1. Log in to [Supabase](https://supabase.com/) and create a new project.
2. Navigate to the **SQL Editor** in the left sidebar.
3. Open `saas-website/supabase_schema.sql` from this repository, copy the SQL, paste it into the editor, and click **Run**. This will create the `profiles` and `forms` tables, sync triggers, and enable Row-Level Security (RLS).
4. Go to **Project Settings** > **API** and copy your `Project URL` and `anon public key`.

### Step 2: Website Setup (`/saas-website`)
Navigate to the `/saas-website` folder, install the dependencies (`npm install`), configure your `.env` file with Supabase credentials, and run `npm run dev` to start the website locally.

### Step 3: Chrome Extension Setup (`/chrome-extension`)
1. Open your terminal and navigate to the extension directory:
   ```bash
   cd chrome-extension
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
   This will output the compiled extension files to `/chrome-extension/dist`.
4. Load the extension in Chrome:
   * Open Google Chrome and navigate to `chrome://extensions/`.
   * Enable **Developer mode** (toggle in the top-right corner).
   * Click **Load unpacked** in the top-left corner.
   * Select the `/chrome-extension/dist` directory from this project.
   * The extension is now loaded and active!

---

## Deployment to Cloudflare

This project is optimized for deployment via Cloudflare Workers Git Integration:

1. Push your repository to GitHub.
2. In the Cloudflare Dashboard, go to **Workers & Pages** > **Create** > **Pages** (or Workers Builds).
3. Connect your GitHub repository and select the main branch.
4. Fill in the build settings exactly as follows:
   * **Path (Root Directory)**: `saas-website`
   * **Build command**: `npm run build`
   * **Deploy Commands**: `npx wrangler deploy`
   * **non-production branch deploy commands**: `npx wrangler versions upload`
5. Go to **Settings > Build > Variables and secrets** in the Cloudflare dashboard and add your environment variables so Vite can access them during compilation:
   * `VITE_SUPABASE_URL`: `your-supabase-project-url`
   * `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
6. Click **Save and Deploy**.

---

## How to Test Locally
1. Run the SaaS Website (`npm run dev` in `/saas-website`).
2. Load the Chrome extension unpacked in Chrome.
3. Open any Google Form view page in your browser (e.g. `docs.google.com/forms/d/e/.../viewform`).
4. Click your Chrome Extension icon, enter a duration (e.g. 5 minutes), and click **Save Settings** or **Generate Link**.
5. Go to your local dashboard (`http://localhost:5173/dashboard`). The form you configured will sync automatically, and you can copy the secure link.
6. Open the secure link to take the timed exam!