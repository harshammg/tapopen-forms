// dashboard-sync.ts
// This script runs on the SaaS dashboard and syncs extension data to the web app

function syncDataToWebsite() {
  chrome.storage.local.get('creatorLinks', (result) => {
    const links = result.creatorLinks || {};
    
    // Transform the data into an array for the dashboard
    const formsArray = Object.values(links);
    
    // Post message to the webpage
    window.postMessage({
      type: 'EXT_FORMS_SYNC',
      forms: formsArray
    }, '*');
    console.log('Forms by tapOpen: Synced data to dashboard', formsArray);
  });
}

// Wait for the Dashboard to announce it is ready before syncing
window.addEventListener('message', (event) => {
  // We only care about messages from our own window
  if (event.source !== window) return;

  if (event.data && event.data.type === 'DASHBOARD_READY') {
    console.log('Forms by tapOpen: Dashboard is ready, initiating sync...');
    syncDataToWebsite();
  }
});

// Also try syncing immediately just in case the dashboard is already listening
syncDataToWebsite();

// Listen for any changes in the extension's storage and push updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.creatorLinks) {
    syncDataToWebsite();
  }
});
