

import { create } from 'zustand';
import { User, Case, Subtask, Log, CaseTemplate, CaseStatus, TaskStatus, Division, Solution, Urgency, SolutionProgressLog, CollaborationNote, DivisionConfig } from '../types';
import { loadState, saveState } from './storage';

interface StoreState {
  currentUser: User | null;
  users: User[]; // Managed list of users
  divisions: DivisionConfig[]; // Managed list of divisions
  cases: Case[];
  subtasks: Subtask[];
  logs: Log[];
  collaborationNotes: CollaborationNote[];
  
  // Actions
  login: (role: string, division?: Division) => void;
  logout: () => void;
  
  // Admin User Management Actions
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Admin Division Management Actions
  addDivision: (division: DivisionConfig) => void;
  updateDivision: (id: string, data: Partial<DivisionConfig>) => void;
  deleteDivision: (id: string) => void;

  // Requester Actions
  addCase: (caseData: Partial<Case>, requiredDivisions: Division[], optionalDivisions: Division[]) => void;
  updateCaseBlockA: (caseId: string, data: Partial<Case>) => void;
  
  // Reviewer Actions
  addSolution: (subtaskId: string, solution: Omit<Solution, 'id' | 'subtaskId' | 'createdAt' | 'createdBy' | 'currentProgress' | 'progressLogs'>) => void;
  updateSolution: (subtaskId: string, solutionId: string, data: Partial<Omit<Solution, 'id' | 'subtaskId' | 'createdAt' | 'createdBy' | 'progressLogs'>>) => void;
  deleteSolution: (subtaskId: string, solutionId: string) => void;
  requestRevision: (subtaskId: string, note: string) => void;
  markSubtaskStatus: (subtaskId: string, status: TaskStatus) => void;
  addSolutionProgress: (solutionId: string, progress: number, note: string, evidenceUrl?: string) => void;
  addCollaborationNote: (caseId: string, targetDivision: Division | 'ALL', content: string) => void;

  // Executive Actions
  submitExecutiveDecision: (caseId: string, decision: 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT' | 'REVISION', note: string) => void;

  // Helpers
  getCaseProgress: (caseId: string) => number;
}

export const useStore = create<StoreState>((set, get) => {
  // Load initial data
  const persisted = loadState();

  const addLogInternal = (state: any, caseId: string, action: string, details?: string) => {
    const newLog: Log = {
      id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      caseId,
      userId: state.currentUser?.id || 'sys',
      userName: state.currentUser?.name || 'System',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    return [newLog, ...state.logs];
  };

  const checkCaseReadiness = (caseId: string, allSubtasks: Subtask[], allCases: Case[]) => {
    const caseTasks = allSubtasks.filter(t => t.caseId === caseId);
    if (caseTasks.length === 0) return CaseStatus.IN_ASSESSMENT;

    // Check if ALL tasks for this case are finalized (OK or NO)
    // We treat 'DONE' (legacy) as finalized too.
    const allHandled = caseTasks.every(t => 
      t.status === TaskStatus.OK || 
      t.status === TaskStatus.NO || 
      t.status === TaskStatus.DONE
    );
    
    const hasRevision = caseTasks.some(t => t.status === TaskStatus.REVISION);
    
    if (hasRevision) return CaseStatus.REVISION;
    if (allHandled) return CaseStatus.WAITING_EXEC_DECISION;
    
    return CaseStatus.IN_ASSESSMENT;
  };

  const checkCaseCompletion = (caseId: string, allSubtasks: Subtask[]) => {
     const tasks = allSubtasks.filter(t => t.caseId === caseId);
     
     // Filter only OK tasks. NO tasks are considered "handled/done" in terms of execution.
     const okTasks = tasks.filter(t => t.status === TaskStatus.OK);

     if (okTasks.length === 0) return false;

     // Check if ALL feasible solutions in OK tasks are 100%
     // A task is done if it has solutions and all feasible solutions are 100%
     const allSolutionsDone = okTasks.every(t => {
         if (t.solutions.length === 0) return false; // Should have solutions if OK
         return t.solutions.filter(s => s.isFeasible).every(s => s.currentProgress === 100);
     });

     return allSolutionsDone;
  };

  return {
    currentUser: null,
    users: persisted.users,
    divisions: persisted.divisions,
    cases: persisted.cases,
    subtasks: persisted.subtasks,
    logs: persisted.logs,
    collaborationNotes: persisted.collaborationNotes,

    login: (roleStr, division) => {
      const state = get();
      // Look up in the state.users list instead of static constant
      const user = state.users.find(u => u.role === roleStr && (division ? u.division === division : true)) 
        || { id: 'temp', name: `User ${roleStr}`, role: roleStr as any, division };
      set({ currentUser: user });
    },

    logout: () => set({ currentUser: null }),

    // --- User Management Actions ---
    addUser: (user) => {
      set(state => {
        const newUsers = [...state.users, user];
        saveState({ ...state, users: newUsers });
        return { users: newUsers };
      });
    },

    updateUser: (id, data) => {
      set(state => {
        const newUsers = state.users.map(u => u.id === id ? { ...u, ...data } : u);
        
        // If updating current user, update session too
        let newCurrentUser = state.currentUser;
        if (state.currentUser && state.currentUser.id === id) {
          newCurrentUser = { ...state.currentUser, ...data };
        }

        saveState({ ...state, users: newUsers });
        return { users: newUsers, currentUser: newCurrentUser };
      });
    },

    deleteUser: (id) => {
      set(state => {
        const newUsers = state.users.filter(u => u.id !== id);
        saveState({ ...state, users: newUsers });
        return { users: newUsers };
      });
    },

    // --- Division Management Actions ---
    addDivision: (division) => {
      set(state => {
        const newDivisions = [...state.divisions, division];
        saveState({ ...state, divisions: newDivisions });
        return { divisions: newDivisions };
      });
    },

    updateDivision: (id, data) => {
      set(state => {
        const newDivisions = state.divisions.map(d => d.id === id ? { ...d, ...data } : d);
        saveState({ ...state, divisions: newDivisions });
        return { divisions: newDivisions };
      });
    },

    deleteDivision: (id) => {
      set(state => {
        const newDivisions = state.divisions.filter(d => d.id !== id);
        saveState({ ...state, divisions: newDivisions });
        return { divisions: newDivisions };
      });
    },

    addCase: (caseData, requiredDivisions, optionalDivisions) => {
      const newId = `c-${Date.now()}`;
      const now = new Date().toISOString();
      const currentUser = get().currentUser;

      const newCase: Case = {
        id: newId,
        title: caseData.title || 'Untitled',
        description: caseData.description || '',
        location: caseData.location || '',
        urgency: caseData.urgency || Urgency.MEDIUM,
        targetDate: caseData.targetDate || '',
        justification: caseData.justification || '',
        attachmentUrl: caseData.attachmentUrl,
        templateId: caseData.templateId || 'custom',
        requesterId: currentUser?.id || 'unknown',
        requesterName: currentUser?.name || 'Unknown',
        status: CaseStatus.IN_ASSESSMENT,
        createdAt: now,
        updatedAt: now,
      };

      const allDivisions = Array.from(new Set([...requiredDivisions, ...optionalDivisions]));

      const newSubtasks: Subtask[] = allDivisions.map(div => ({
        id: `t-${Date.now()}-${div}`,
        caseId: newId,
        division: div,
        status: TaskStatus.PENDING,
        description: '', // Empty description per request
        solutions: [],
        updatedAt: now
      }));

      set(state => {
        const nextLogs = addLogInternal(state, newId, 'Case Created', `Template: ${newCase.templateId}`);
        const nextState = {
          ...state,
          cases: [newCase, ...state.cases],
          subtasks: [...state.subtasks, ...newSubtasks],
          logs: nextLogs,
        };
        saveState(nextState);
        return nextState;
      });
    },

    updateCaseBlockA: (caseId, data) => {
      set(state => {
        const updatedCases = state.cases.map(c => 
          c.id === caseId 
          ? { ...c, ...data, status: CaseStatus.IN_ASSESSMENT, updatedAt: new Date().toISOString() } 
          : c
        );
        
        const updatedSubtasks = state.subtasks.map(t => 
          (t.caseId === caseId && t.status === TaskStatus.REVISION)
            ? { ...t, status: TaskStatus.IN_PROGRESS, updatedAt: new Date().toISOString() }
            : t
        );

        const nextLogs = addLogInternal(state, caseId, 'Case Updated', 'Requester updated details (Revision response)');
        
        saveState({ ...state, cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs });
        return { cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs };
      });
    },

    addSolution: (subtaskId, solutionData) => {
      set(state => {
        const newSolution: Solution = {
          id: `sol-${Date.now()}`,
          subtaskId,
          ...solutionData,
          currentProgress: 0,
          progressLogs: [],
          createdAt: new Date().toISOString(),
          createdBy: state.currentUser?.id || 'sys'
        };

        const updatedSubtasks = state.subtasks.map(t => {
          if (t.id === subtaskId) {
            // When adding a solution, set status to IN_PROGRESS so it can be re-finalized if needed.
            const newStatus = TaskStatus.IN_PROGRESS;
            return { 
              ...t, 
              solutions: [...t.solutions, newSolution],
              status: newStatus,
              updatedAt: new Date().toISOString() 
            };
          }
          return t;
        });

        const subtask = state.subtasks.find(t => t.id === subtaskId);
        let updatedCases = state.cases;
        if (subtask) {
           const newCaseStatus = checkCaseReadiness(subtask.caseId, updatedSubtasks, state.cases);
           updatedCases = state.cases.map(c => c.id === subtask.caseId ? { ...c, status: newCaseStatus, updatedAt: new Date().toISOString() } : c);
        }

        const nextLogs = addLogInternal(state, subtask?.caseId || '', 'Solution Added', `By ${state.currentUser?.division}`);
        
        saveState({ ...state, cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs });
        return { cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs };
      });
    },

    updateSolution: (subtaskId, solutionId, data) => {
        set(state => {
            const updatedSubtasks = state.subtasks.map(t => {
                if (t.id === subtaskId) {
                    const updatedSolutions = t.solutions.map(s => 
                        s.id === solutionId ? { ...s, ...data } : s
                    );
                    return { ...t, solutions: updatedSolutions, updatedAt: new Date().toISOString() };
                }
                return t;
            });

            saveState({ ...state, subtasks: updatedSubtasks });
            return { subtasks: updatedSubtasks };
        });
    },

    deleteSolution: (subtaskId, solutionId) => {
      set(state => {
        const updatedSubtasks = state.subtasks.map(t => 
          t.id === subtaskId 
          ? { ...t, solutions: t.solutions.filter(s => s.id !== solutionId), updatedAt: new Date().toISOString() } 
          : t
        );
        saveState({ ...state, subtasks: updatedSubtasks });
        return { subtasks: updatedSubtasks };
      });
    },

    requestRevision: (subtaskId, note) => {
      set(state => {
        const updatedSubtasks = state.subtasks.map(t => 
          t.id === subtaskId 
          ? { ...t, status: TaskStatus.REVISION, revisionNote: note, updatedAt: new Date().toISOString() } 
          : t
        );

        const subtask = state.subtasks.find(t => t.id === subtaskId);
        let updatedCases = state.cases;
        if (subtask) {
          updatedCases = state.cases.map(c => 
            c.id === subtask.caseId 
            ? { ...c, status: CaseStatus.REVISION, updatedAt: new Date().toISOString() } 
            : c
          );
        }

        const nextLogs = addLogInternal(state, subtask?.caseId || '', 'Revision Requested', note);
        saveState({ ...state, cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs });
        return { cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs };
      });
    },

    markSubtaskStatus: (subtaskId, status) => {
        set(state => {
            // 1. Update Subtask Status
            const updatedSubtasks = state.subtasks.map(t => 
                t.id === subtaskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
            );
            
            // 2. Find associated Case
            const subtask = state.subtasks.find(t => t.id === subtaskId);
            let updatedCases = state.cases;
            let logMsg = `Task Status: ${status}`;
            
            if (subtask) {
                // 3. Check Case Readiness using the UPDATED subtasks array
                const newCaseStatus = checkCaseReadiness(subtask.caseId, updatedSubtasks, state.cases);
                logMsg += ` -> Case Status: ${newCaseStatus}`;
                
                updatedCases = state.cases.map(c => 
                  c.id === subtask.caseId 
                  ? { ...c, status: newCaseStatus, updatedAt: new Date().toISOString() } 
                  : c
                );
            }

            const nextLogs = addLogInternal(state, subtask?.caseId || '', 'Task Finalized', logMsg);

            saveState({ ...state, cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs });
            return { cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs };
        });
    },

    submitExecutiveDecision: (caseId, decision, note) => {
        set(state => {
            let newStatus = CaseStatus.IN_ASSESSMENT; // default fallback
            
            if (decision === 'APPROVE' || decision === 'APPROVE_WITH_CONDITIONS') newStatus = CaseStatus.IN_EXECUTION;
            else if (decision === 'REJECT') newStatus = CaseStatus.REJECTED;
            else if (decision === 'REVISION') newStatus = CaseStatus.REVISION;

            const updatedCases = state.cases.map(c => 
                c.id === caseId 
                ? { 
                    ...c, 
                    status: newStatus, 
                    executiveDecision: decision, 
                    executiveNote: note,
                    updatedAt: new Date().toISOString() 
                  } 
                : c
            );

            const nextLogs = addLogInternal(state, caseId, 'Executive Decision', `${decision}: ${note}`);
            saveState({ ...state, cases: updatedCases, logs: nextLogs });
            return { cases: updatedCases, logs: nextLogs };
        });
    },

    addSolutionProgress: (solutionId, progress, note, evidenceUrl) => {
        set(state => {
            const currentUser = state.currentUser;
            let caseId = '';
            
            const updatedSubtasks = state.subtasks.map(t => {
                const solIndex = t.solutions.findIndex(s => s.id === solutionId);
                if (solIndex > -1) {
                    caseId = t.caseId;
                    const oldSol = t.solutions[solIndex];
                    if (progress < oldSol.currentProgress) return t; // Prevent regress

                    const newLog: SolutionProgressLog = {
                        id: `prog-${Date.now()}`,
                        solutionId,
                        progressPercent: progress,
                        note,
                        evidenceUrl,
                        timestamp: new Date().toISOString(),
                        createdBy: currentUser?.id || 'sys'
                    };

                    const updatedSol: Solution = {
                        ...oldSol,
                        currentProgress: progress,
                        progressLogs: [newLog, ...oldSol.progressLogs]
                    };

                    const newSolutions = [...t.solutions];
                    newSolutions[solIndex] = updatedSol;
                    
                    return { ...t, solutions: newSolutions, updatedAt: new Date().toISOString() };
                }
                return t;
            });

            // Check auto completion
            let updatedCases = state.cases;
            if (caseId && checkCaseCompletion(caseId, updatedSubtasks)) {
                updatedCases = state.cases.map(c => 
                    c.id === caseId 
                    ? { ...c, status: CaseStatus.COMPLETED, updatedAt: new Date().toISOString() }
                    : c
                );
            }

            const nextLogs = addLogInternal(state, caseId, 'Execution Progress', `Solution ${solutionId}: ${progress}%`);
            saveState({ ...state, cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs });
            return { cases: updatedCases, subtasks: updatedSubtasks, logs: nextLogs };
        });
    },

    addCollaborationNote: (caseId, targetDivision, content) => {
        set(state => {
            const currentUser = state.currentUser;
            if (!currentUser || !currentUser.division) return {};

            const newNote: CollaborationNote = {
                id: `note-${Date.now()}`,
                caseId,
                senderDivision: currentUser.division,
                targetDivision,
                content,
                timestamp: new Date().toISOString(),
                senderName: currentUser.name
            };

            const updatedNotes = [...state.collaborationNotes, newNote];
            saveState({ ...state, collaborationNotes: updatedNotes });
            return { collaborationNotes: updatedNotes };
        });
    },

    getCaseProgress: (caseId) => {
      const state = get();
      const tasks = state.subtasks.filter(t => t.caseId === caseId);
      if (tasks.length === 0) return 0;
      
      let totalProgress = 0;
      let totalFeasibleSolutions = 0;

      tasks.forEach(t => {
          t.solutions.forEach(s => {
              if (s.isFeasible) {
                  totalProgress += s.currentProgress;
                  totalFeasibleSolutions++;
              }
          });
      });

      if (totalFeasibleSolutions === 0) {
          const doneTasks = tasks.filter(t => t.status === TaskStatus.OK || t.status === TaskStatus.DONE).length;
          return Math.round((doneTasks / tasks.length) * 100);
      }

      return Math.round(totalProgress / totalFeasibleSolutions);
    }
  };
});
