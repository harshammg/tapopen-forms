import { TimerState, EnforcedTimer, PendingTimer } from '../types';

const STORAGE_KEY = 'google_forms_timer_state';
const ENFORCED_TIMERS_KEY = 'google_forms_enforced_timers';
const PENDING_TIMER_KEY = 'google_forms_pending_timer';

const DEFAULT_STATE: TimerState = {
  remainingSeconds: 0,
  durationSeconds: 1800,
  status: 'idle',
  autoSubmit: false,
  soundEnabled: true,
};

export const storage = {
  get: async (): Promise<TimerState> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve(result[STORAGE_KEY] || DEFAULT_STATE);
      });
    });
  },
  set: async (state: TimerState): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: state }, () => {
        resolve();
      });
    });
  },
  update: async (partialState: Partial<TimerState>): Promise<TimerState> => {
    const currentState = await storage.get();
    const newState = { ...currentState, ...partialState };
    await storage.set(newState);
    return newState;
  },

  getEnforcedTimers: async (): Promise<Record<string, EnforcedTimer>> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(ENFORCED_TIMERS_KEY, (result) => {
        resolve(result[ENFORCED_TIMERS_KEY] || {});
      });
    });
  },
  setEnforcedTimers: async (timers: Record<string, EnforcedTimer>): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [ENFORCED_TIMERS_KEY]: timers }, () => {
        resolve();
      });
    });
  },
  getEnforcedTimer: async (formId: string): Promise<EnforcedTimer | null> => {
    const timers = await storage.getEnforcedTimers();
    return timers[formId] || null;
  },

  getPendingTimer: async (): Promise<PendingTimer | null> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(PENDING_TIMER_KEY, (result) => {
        resolve(result[PENDING_TIMER_KEY] || null);
      });
    });
  },
  setPendingTimer: async (timer: PendingTimer): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [PENDING_TIMER_KEY]: timer }, () => {
        resolve();
      });
    });
  },
  clearPendingTimer: async (): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(PENDING_TIMER_KEY, () => {
        resolve();
      });
    });
  }
};
