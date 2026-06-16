import { storage } from '../storage';
import { TimerState, TimerMessage } from '../types';

let timerInterval: number | null = null;

// Function to broadcast the timer state to the active tab (content script)
async function broadcastState(state: TimerState) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0 && tabs[0].id) {
    try {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE', payload: state }).catch(() => {});
    } catch (e) {
      // Content script might not be injected
    }
  }
}

// Tick function that runs every second
async function tick() {
  const state = await storage.get();
  
  if (state.status === 'running' && state.remainingSeconds > 0) {
    const newState = await storage.update({ remainingSeconds: state.remainingSeconds - 1 });
    broadcastState(newState);
    
    if (newState.remainingSeconds <= 0) {
      // Timer finished
      stopTimer();
      await storage.update({ status: 'idle', remainingSeconds: 0 });
      broadcastState(await storage.get());
    }
  } else if (state.remainingSeconds <= 0) {
    stopTimer();
  }
}

function startTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
  // @ts-ignore
  timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: TimerMessage, _sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case 'START':
        await storage.update({ status: 'running' });
        startTimer();
        sendResponse({ success: true });
        break;
      case 'PAUSE':
        await storage.update({ status: 'paused' });
        stopTimer();
        sendResponse({ success: true });
        break;
      case 'STOP':
        await storage.update({ status: 'idle', remainingSeconds: (await storage.get()).durationSeconds });
        stopTimer();
        sendResponse({ success: true });
        break;
      case 'SET_CONFIG':
        if (message.payload) {
          await storage.update(message.payload);
          const state = await storage.get();
          broadcastState(state);
        }
        sendResponse({ success: true });
        break;
      case 'GET_STATE':
        const state = await storage.get();
        sendResponse(state);
        break;
    }
  })();
  return true; // Keep the message channel open for async response
});

// Resume timer if it was running before the background script went to sleep
storage.get().then((state) => {
  if (state.status === 'running') {
    startTimer();
  }
});
