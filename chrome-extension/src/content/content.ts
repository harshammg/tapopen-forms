import './index.css';
import { storage } from '../storage';

let timerContainer: HTMLDivElement | null = null;
let timeDisplay: HTMLSpanElement | null = null;
let countdownInterval: number | null = null;
let isSubmitting = false;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function injectTimerUI() {
  if (document.getElementById('gf-timer-container')) return;

  timerContainer = document.createElement('div');
  timerContainer.id = 'gf-timer-container';
  timerContainer.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-[#0A0A0B] shadow-2xl rounded-2xl px-6 py-3 border border-gray-700 transition-all duration-300 font-sans flex items-center justify-between gap-4 w-64';
  
  const iconSpan = document.createElement('span');
  iconSpan.innerHTML = '⏳';
  iconSpan.className = 'text-3xl animate-pulse';
  
  timeDisplay = document.createElement('span');
  timeDisplay.className = 'text-3xl font-extrabold tracking-widest text-gray-100 font-mono';
  timeDisplay.innerText = '00:00';

  timerContainer.appendChild(iconSpan);
  timerContainer.appendChild(timeDisplay);
  document.body.appendChild(timerContainer);
}

function updateTimerUI(remainingSeconds: number) {
  if (!timeDisplay || !timerContainer) return;
  
  timeDisplay.innerText = formatTime(remainingSeconds);
  
  if (remainingSeconds <= 60 && remainingSeconds > 0) {
    timeDisplay.classList.add('text-red-500');
    timeDisplay.classList.remove('text-gray-100');
    timerContainer.classList.add('border-red-500', 'bg-red-900/30');
    timerContainer.classList.remove('border-gray-700', 'bg-[#0A0A0B]');
  }
}

function fillRequiredFields() {
  const textInputs = document.querySelectorAll('input[type="text"], textarea, input[type="email"], input[type="url"], input[type="number"]');
  textInputs.forEach(el => {
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    if (!input.value || input.value.trim() === '') {
      input.value = "Not filled (Time Expired / Tab Switched)";
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  const listItems = document.querySelectorAll('div[role="listitem"]');
  listItems.forEach(item => {
    const checkedRadios = item.querySelectorAll('div[role="radio"][aria-checked="true"]');
    const checkedBoxes = item.querySelectorAll('div[role="checkbox"][aria-checked="true"]');
    
    if (checkedRadios.length === 0 && checkedBoxes.length === 0) {
      const firstRadio = item.querySelector('div[role="radio"]');
      if (firstRadio) {
        (firstRadio as HTMLElement).click();
      } else {
        const firstCheckbox = item.querySelector('div[role="checkbox"]');
        if (firstCheckbox) {
          (firstCheckbox as HTMLElement).click();
        }
      }
    }
  });
}

function autoSubmitForm(reason: 'timeout' | 'tab_switch' = 'timeout') {
  if (isSubmitting) return;
  isSubmitting = true;

  if (countdownInterval !== null) {
    clearInterval(countdownInterval);
  }

  fillRequiredFields();

  setTimeout(() => {
    const buttons = document.querySelectorAll('div[role="button"]');
    let submitButton: HTMLElement | null = null;
    
    for (const btn of Array.from(buttons)) {
      const text = btn.textContent?.toLowerCase() || '';
      if (text.includes('submit')) {
        submitButton = btn as HTMLElement;
        break;
      }
    }

    if (!submitButton && buttons.length > 0) {
      submitButton = buttons[buttons.length - 1] as HTMLElement;
    }

    const title = reason === 'tab_switch' ? "Violation Detected!" : "Time's Up!";
    const msg = reason === 'tab_switch' ? "You exited the page. Your form has been auto-submitted." : "The time limit for this form has expired.";

    if (submitButton) {
      submitButton.click();
      console.log(`Timer expired or violation (${reason}): Form auto-filled and auto-submitted.`);
    } else {
      document.body.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(10,10,11,0.95); z-index: 99999; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Space Grotesk', sans-serif;">
          <div style="text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #ef4444; font-weight: 900;">${title}</h1>
            <p style="font-size: 1.5rem; color: #9ca3af;">${msg}</p>
          </div>
        </div>
      `;
    }
  }, 300);
}

function getFormIdFromUrl(url: string): string | null {
  const match = url.match(/\/forms\/(?:u\/[0-9]+\/)?d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

async function init() {
  const currentUrl = window.location.href;
  
  if (currentUrl.includes('/edit')) {
    return;
  }

  const formId = getFormIdFromUrl(currentUrl);
  if (!formId) return;

  const pendingTimer = await storage.getPendingTimer();
  if (pendingTimer) {
    const ageMs = Date.now() - pendingTimer.createdAt;
    if (ageMs < 15000) {
      const timers = await storage.getEnforcedTimers();
      timers[formId] = {
        formId: formId,
        deadline: pendingTimer.deadline,
        durationSeconds: Math.floor((pendingTimer.deadline - pendingTimer.createdAt) / 1000)
      };
      await storage.setEnforcedTimers(timers);
      await storage.clearPendingTimer();
    }
  }

  const timerConfig = await storage.getEnforcedTimer(formId);
  
  if (!timerConfig) {
    return;
  }

  // Set up proctoring (auto-submit on tab switch)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden' && !isSubmitting) {
      // User switched tabs or minimized! Auto-submit immediately.
      autoSubmitForm('tab_switch');
    }
  });

  const checkTimer = () => {
    if (isSubmitting) return;

    const now = Date.now();
    const remainingMs = timerConfig.deadline - now;
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    updateTimerUI(remainingSeconds);

    if (remainingSeconds <= 0) {
      timeDisplay!.innerText = "00:00";
      autoSubmitForm('timeout');
    }
  };

  injectTimerUI();
  checkTimer();

  countdownInterval = window.setInterval(checkTimer, 1000);
}

const observer = new MutationObserver(() => {
  if (!document.getElementById('gf-timer-container') && !isSubmitting) {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/edit')) return;
    
    const formId = getFormIdFromUrl(currentUrl);
    if (formId) {
       storage.getEnforcedTimer(formId).then(timerConfig => {
         if (timerConfig) {
           injectTimerUI();
         }
       });
    }
  }
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

init();
