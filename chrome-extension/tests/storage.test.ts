import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../src/storage';

const mockStorage: Record<string, any> = {};

global.chrome = {
  // @ts-ignore
  storage: {
    local: {
      // @ts-expect-error: mocking chrome storage
      get: vi.fn((key: string | string[], callback: (result: any) => void) => {
        if (typeof key === 'string') {
          callback({ [key]: mockStorage[key] });
        } else {
          callback(mockStorage);
        }
      }),
      // @ts-expect-error: mocking chrome storage
      set: vi.fn((items: Record<string, any>, callback: () => void) => {
        Object.assign(mockStorage, items);
        callback();
      }),
    },
  },
};

describe('Storage Utility', () => {
  beforeEach(() => {
    for (const key in mockStorage) {
      delete mockStorage[key];
    }
    vi.clearAllMocks();
  });

  describe('Legacy TimerState', () => {
    it('should return default state when storage is empty', async () => {
      const state = await storage.get();
      expect(state.status).toBe('idle');
      expect(state.durationSeconds).toBe(1800);
      expect(state.remainingSeconds).toBe(0);
    });

    it('should save and retrieve state correctly', async () => {
      const newState = {
        remainingSeconds: 600,
        durationSeconds: 1200,
        status: 'running' as const,
        autoSubmit: true,
        soundEnabled: false,
      };

      await storage.set(newState);
      expect(chrome.storage.local.set).toHaveBeenCalled();

      const retrievedState = await storage.get();
      expect(retrievedState).toEqual(newState);
    });
  });

  describe('Enforced Timers', () => {
    it('should return empty object if no enforced timers', async () => {
      const timers = await storage.getEnforcedTimers();
      expect(timers).toEqual({});
    });

    it('should save and retrieve enforced timers', async () => {
      const mockTimer = {
        formId: 'abc1234',
        durationSeconds: 300,
        deadline: 1234567890,
      };

      await storage.setEnforcedTimers({
        [mockTimer.formId]: mockTimer
      });

      const timers = await storage.getEnforcedTimers();
      expect(timers['abc1234']).toEqual(mockTimer);

      const specificTimer = await storage.getEnforcedTimer('abc1234');
      expect(specificTimer).toEqual(mockTimer);
    });

    it('should return null for non-existent enforced timer', async () => {
      const timer = await storage.getEnforcedTimer('doesnotexist');
      expect(timer).toBeNull();
    });
  });
});
