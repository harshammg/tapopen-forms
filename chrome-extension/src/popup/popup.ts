import './index.css';

// UI Elements
const durationInput = document.getElementById('duration-minutes') as HTMLInputElement;
const expirationInput = document.getElementById('expiration-date') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const resultContainer = document.getElementById('result-container') as HTMLDivElement;
const linkOutput = document.getElementById('link-output') as HTMLInputElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
const previewBtn = document.getElementById('preview-btn') as HTMLButtonElement;
const copySuccess = document.getElementById('copy-success') as HTMLDivElement;
const errorMsg = document.getElementById('error-msg') as HTMLDivElement;
const saveSuccess = document.getElementById('save-success') as HTMLDivElement;
const manageBtn = document.getElementById('manage-btn') as HTMLButtonElement;

function getFormId(url: string): string | null {
  const match = url.match(/\/forms\/(?:u\/[0-9]+\/)?d\/((?:e\/)?[a-zA-Z0-9_-]+)/);
  if (!match) return null;
  // Replace 'e/' with 'e-' so it doesn't break the URL path routing
  return match[1].replace('e/', 'e-');
}

async function saveSettingsLocally(): Promise<string | null> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (!activeTab || !activeTab.url) {
    errorMsg.classList.remove('hidden');
    return null;
  }

  const formId = getFormId(activeTab.url);
  if (!formId) {
    errorMsg.classList.remove('hidden');
    return null;
  }

  const minutes = parseInt(durationInput.value, 10);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid duration.");
    return null;
  }

  const durationSeconds = minutes * 60;
  let expiresTs: number | null = null;

  if (expirationInput.value) {
    expiresTs = new Date(expirationInput.value).getTime();
  }

  let formTitle = activeTab.title || 'Untitled Form';
  formTitle = formTitle.replace(/\s*-\s*Google\s+Forms/gi, '').trim();

  return new Promise((resolve) => {
    chrome.storage.local.get('creatorLinks', (result) => {
      const links = result.creatorLinks || {};
      
      // Keep existing link if present, or we will regenerate it
      const currentLink = links[formId]?.link || '';
      
      links[formId] = { 
        link: currentLink, 
        durationSeconds,
        expiresTs,
        title: formTitle
      };
      chrome.storage.local.set({ creatorLinks: links }, () => {
        resolve(formId);
      });
    });
  });
}

saveBtn.addEventListener('click', async () => {
  errorMsg.classList.add('hidden');
  saveSuccess.classList.add('hidden');
  
  const formId = await saveSettingsLocally();
  if (formId) {
    saveSuccess.classList.remove('hidden');
    setTimeout(() => {
      saveSuccess.classList.add('hidden');
    }, 2000);
  }
});

generateBtn.addEventListener('click', async () => {
  errorMsg.classList.add('hidden');
  resultContainer.classList.add('hidden');
  copySuccess.classList.add('hidden');

  // Ensure settings are saved before generating
  const formId = await saveSettingsLocally();
  if (!formId) return;

  const minutes = parseInt(durationInput.value, 10);
  const durationSeconds = minutes * 60;
  
  let expiresParam = '';
  if (expirationInput.value) {
    const expiresTs = new Date(expirationInput.value).getTime();
    expiresParam = `&expires=${expiresTs}`;
  }

  const WEBSITE_BASE = 'https://forms.tapopen.online';
  let link = `${WEBSITE_BASE}/take/${formId}?timer=${durationSeconds}${expiresParam}`;

  // Update persistence with the new generated link
  chrome.storage.local.get('creatorLinks', (result) => {
    const links = result.creatorLinks || {};
    if (links[formId]) {
      links[formId].link = link;
      chrome.storage.local.set({ creatorLinks: links });
    }
  });

  linkOutput.value = link;
  resultContainer.classList.remove('hidden');
  
  // Automatically redirect to dashboard
  chrome.tabs.create({ url: `${WEBSITE_BASE}/dashboard` });
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(linkOutput.value);
    copySuccess.innerText = 'Copied to clipboard!';
    copySuccess.classList.remove('hidden');
    setTimeout(() => {
      copySuccess.classList.add('hidden');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
});

previewBtn.addEventListener('click', () => {
  if (!linkOutput.value) return;
  // For shortened URLs, open directly. For website URLs, open in new tab.
  chrome.tabs.create({ url: linkOutput.value });
});

manageBtn.addEventListener('click', () => {
  const WEBSITE_BASE = 'https://forms.tapopen.online';
  chrome.tabs.create({ url: `${WEBSITE_BASE}/dashboard` });
});

async function init() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  if (!activeTab || !activeTab.url) return;
  
  const formId = getFormId(activeTab.url);
  if (!formId) return;

  chrome.storage.local.get('creatorLinks', (result) => {
    const links = result.creatorLinks || {};
    if (links[formId]) {
      const { link, durationSeconds, expiresTs } = links[formId];
      durationInput.value = Math.floor(durationSeconds / 60).toString();
      
      if (expiresTs) {
        // Format for datetime-local input (YYYY-MM-DDThh:mm)
        const date = new Date(expiresTs);
        // adjust for local timezone offset
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
        expirationInput.value = localISOTime;
      }

      if (link) {
        linkOutput.value = link;
        resultContainer.classList.remove('hidden');
      }
    }
  });
}

init();
