# Google Forms Timer (Chrome Extension)

This repository contains the Chrome Extension for **TapOpen Forms**, a platform that adds customizable countdown timers and anti-cheat proctoring to Google Forms.

You can use this extension locally to configure timers on your Google Forms and sync them to the live hosted dashboard at [https://forms.tapopen.online](https://forms.tapopen.online).

---

## Features
* **Custom Timers**: Set custom durations and expiration dates for any Google Form.
* **Frictionless for Students**: Students do not need to install anything! They just open the secure link.
* **Anti-Cheat Proctoring**: Detects when a student switches tabs or minimizes the window, automatically locking the exam.
* **Auto-Submit & Force Submission**: Auto-fills empty required fields with "Not filled" and automatically submits when the timer runs out.

---

## How to Install the Extension Locally

Follow these steps to build the extension and load it into your Chrome browser:

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
This will compile the extension assets into the `/chrome-extension/dist` directory.

### Step 3: Load into Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `/chrome-extension/dist` folder from this project directory.
5. The extension is now active in your browser!

---

## How to Create Timed Forms
1. Open any Google Form view page in your browser (e.g. `docs.google.com/forms/d/e/.../viewform`).
2. Click the **Google Forms Timer** extension icon in your Chrome toolbar.
3. Configure the timer duration (e.g., 30 minutes) and optionally set an expiration date.
4. Click **Save Settings** or **Generate Link**.
5. Log into the hosted dashboard at [https://forms.tapopen.online](https://forms.tapopen.online). Your configured forms will automatically sync, allowing you to copy the secure student exam link.
6. Share the link with your students—the platform will manage the timer and proctoring natively.