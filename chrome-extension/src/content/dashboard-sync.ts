// dashboard-sync.ts
// This script runs on the SaaS dashboard and syncs extension data to the web app

function syncDataToWebsite(userId: string) {
  chrome.storage.local.get('creatorLinks', (result) => {
    let links = result.creatorLinks || {};
    let updated = false;

    // 1. Claim any unclaimed forms for the current userId
    for (const formId in links) {
      if (!links[formId].userId) {
        links[formId].userId = userId;
        updated = true;
      }
    }

    if (updated) {
      // Save the claimed links back to local storage
      chrome.storage.local.set({ creatorLinks: links });
    }

    // 2. Filter forms to only include those belonging to the current userId
    const formsArray = Object.values(links).filter((form: any) => form.userId === userId);
    
    // Post message to the webpage
    window.postMessage({
      type: 'EXT_FORMS_SYNC',
      forms: formsArray
    }, '*');
    console.log('Forms by tapOpen: Synced data to dashboard for user:', userId, formsArray);
  });
}

let currentUserId: string | null = null;

// Wait for the Dashboard to announce it is ready before syncing
window.addEventListener('message', (event) => {
  // We only care about messages from our own window
  if (event.source !== window) return;

  if (event.data) {
    if (event.data.type === 'DASHBOARD_READY') {
      console.log('Forms by tapOpen: Dashboard is ready, initiating sync...');
      if (event.data.userId) {
        currentUserId = event.data.userId;
        syncDataToWebsite(currentUserId as string);
      }
    } else if (event.data.type === 'WEBSITE_FORM_DELETE') {
      const googleFormId = event.data.googleFormId;
      chrome.storage.local.get('creatorLinks', (result) => {
        const links = result.creatorLinks || {};
        if (links[googleFormId]) {
          delete links[googleFormId];
          chrome.storage.local.set({ creatorLinks: links }, () => {
            console.log('Forms by tapOpen: Deleted form from extension storage:', googleFormId);
          });
        }
      });
    }
  }
});

// Listen for any changes in the extension's storage and push updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.creatorLinks && currentUserId) {
    syncDataToWebsite(currentUserId as string);
  }
});
