
import { Case, Subtask, Log, CollaborationNote, User, DivisionConfig } from '../types';
import { SEED_CASES, SEED_SUBTASKS, SEED_LOGS, MOCK_USERS, SEED_DIVISIONS } from '../mock/seed';

const STORAGE_KEY = 'emds_state_v1';

export interface AppStateData {
  cases: Case[];
  subtasks: Subtask[];
  logs: Log[];
  collaborationNotes: CollaborationNote[];
  users: User[];
  divisions: DivisionConfig[]; // Added divisions
}

export const loadState = (): AppStateData => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      // Init seed
      const initialState: AppStateData = {
        cases: SEED_CASES,
        subtasks: SEED_SUBTASKS,
        logs: SEED_LOGS,
        collaborationNotes: [],
        users: MOCK_USERS,
        divisions: SEED_DIVISIONS // Init seed divisions
      };
      saveState(initialState);
      return initialState;
    }
    const parsed = JSON.parse(serialized);
    
    // Backward compatibility checks
    if (!parsed.collaborationNotes) parsed.collaborationNotes = [];
    if (!parsed.users) parsed.users = MOCK_USERS;
    if (!parsed.divisions) parsed.divisions = SEED_DIVISIONS;

    return parsed;
  } catch (err) {
    console.error("Failed to load state", err);
    return { cases: [], subtasks: [], logs: [], collaborationNotes: [], users: [], divisions: [] };
  }
};

export const saveState = (state: AppStateData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state", err);
  }
};