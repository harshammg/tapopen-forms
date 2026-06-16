export interface EnforcedTimer {
  formId: string;
  durationSeconds: number;
  deadline: number; // timestamp in ms
}

export interface PendingTimer {
  formId: string;
  deadline: number;
  createdAt: number;
}

export interface TimerState {
  remainingSeconds: number;
  durationSeconds: number;
  status: 'idle' | 'running' | 'paused';
  autoSubmit: boolean;
  soundEnabled: boolean;
}

export interface TimerMessage {
  type: 'START' | 'PAUSE' | 'STOP' | 'UPDATE' | 'GET_STATE' | 'SET_CONFIG';
  payload?: any;
}
