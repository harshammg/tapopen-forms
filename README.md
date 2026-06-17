# Google Forms Timer (Chrome Extension)

This repository contains the Chrome Extension for **TapOpen Forms**, a platform that adds customizable countdown timers and anti-cheat proctoring to Google Forms.

You can use this extension to configure timers on your Google Forms and sync them to the live hosted dashboard at [https://forms.tapopen.online](https://forms.tapopen.online).

---

## Features
* **Custom Timers**: Set custom durations and expiration dates for any Google Form.
* **Frictionless for Students**: Students do not need to install anything! They just open the secure link.
* **Anti-Cheat Proctoring**: Detects when a student switches tabs or minimizes the window, automatically locking the exam.
* **Auto-Submit & Force Submission**: Auto-fills empty required fields with "Not filled" and automatically submits when the timer runs out.

---

## How to Install the Extension (No Coding Required)

### Step 1: Download the Extension
1. Download the pre-compiled extension ZIP file directly from the live website:
   **[Download Extension ZIP](https://forms.tapopen.online/extension.zip)**
2. Unzip the downloaded file on your computer.

### Step 2: Load it into your Browser
1. Open Google Chrome (or any Chromium browser like Brave, Edge, Opera) and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the unzipped folder containing the extension files.
5. The extension icon will now appear in your browser's toolbar!

---

## How to Create Timed Forms
1. Open any Google Form view page in your browser (e.g. `docs.google.com/forms/d/e/.../viewform`).
2. Click the **Google Forms Timer** extension icon in your toolbar.
3. Configure the timer duration (e.g., 30 minutes) and optionally set an expiration date.
4. Click **Save Settings** or **Generate Link**.
5. Log into the hosted dashboard at [https://forms.tapopen.online](https://forms.tapopen.online). Your configured forms will automatically sync, allowing you to copy the secure student exam link.
6. Share the link with your students—the platform will manage the timer and proctoring natively.

---

## For Developers (Building from Source)

If you are a developer and want to contribute to the extension or modify its functionality, follow these steps to build it from source:

### Step 1: Install Dependencies
Open your terminal, navigate to the extension directory, and install the required npm packages:
```bash
cd chrome-extension
npm install
```

### Step 2: Build the Extension
Compile the TypeScript and TSX files into the final distribution folder:
```bash
npm run build
```
This will compile the extension assets into the `/chrome-extension/dist` directory. You can then load this `/dist` directory into your browser using the "Load unpacked" button in `chrome://extensions/`.

---

## Open for Contributors

We welcome contributions from developers of all skill levels. Whether you want to fix a bug, add a new feature, or improve the documentation — we'd love your help.

### How to Contribute

1. **Fork** this repository.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/tapopen-forms.git
   ```
3. Create a new **branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and **commit** them with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push** your branch and open a **Pull Request** against `main`.

### Project Structure

```
├── chrome-extension/        # Chrome Extension (Vite + TypeScript)
│   ├── src/
│   │   ├── content/         # Content scripts (timer injection, dashboard sync)
│   │   ├── popup/           # Extension popup UI
│   │   ├── background/      # Service worker
│   │   └── manifest.json    # Extension manifest
│   └── public/              # Static assets (icons)
│
├── saas-website/            # SaaS Dashboard (React + Vite + Supabase)
│   ├── src/
│   │   ├── pages/           # Landing, Auth, Dashboard, ExamPage
│   │   ├── components/      # Shared UI components
│   │   ├── contexts/        # Auth context provider
│   │   └── lib/             # Supabase client config
│   └── supabase_schema.sql  # Database schema & RLS policies
```

### Ideas for Contributions

- **UI/UX Improvements** — Better responsive design, animations, dark/light themes
- **Advanced Proctoring** — Webcam monitoring, full-screen enforcement
- **Analytics Dashboard** — Charts for form submissions, time taken, etc.
- **Internationalization** — Multi-language support
- **Testing** — Unit tests, integration tests, E2E tests
- **Documentation** — Tutorials, API docs, video walkthroughs
- **Bug Fixes** — Check the [Issues](https://github.com/harshammg/tapopen-forms/issues) tab

### Guidelines

- Follow existing code style and conventions.
- Write clear commit messages using [Conventional Commits](https://www.conventionalcommits.org/).
- Test your changes before submitting a PR.
- Be respectful and constructive in discussions.

---

## License

This project is open source. Feel free to use, modify, and distribute it.

---

<p align="center">
  Built by <a href="https://github.com/harshammg">tapOpen</a>
</p>