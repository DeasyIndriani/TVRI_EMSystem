
export type Role = 'admin' | 'requester' | 'reviewer' | 'executive';

// Changed from union type to string to allow dynamic divisions from Admin Panel
export type Division = string; 

export interface DivisionConfig {
  id: string;
  code: string; // e.g., 'TEK'
  name: string; // e.g., 'Teknik & Transmisi'
  description?: string;
}

export enum CaseStatus {
  NEW = 'NEW', // Initial state
  IN_ASSESSMENT = 'IN_ASSESSMENT', // Reviewers working
  REVISION = 'REVISION', // Reviewer requested changes
  WAITING_EXEC_DECISION = 'WAITING_EXEC_DECISION', // Ready for Exec
  IN_EXECUTION = 'IN_EXECUTION', // Approved, Divs working
  APPROVED = 'APPROVED', // Legacy/Intermediate
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED' // All execution done
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  OK = 'OK', // Solution accepted/proposed
  NO = 'NO', // Cannot fulfill
  REVISION = 'REVISION', // Requester needs to fix input
  DONE = 'DONE' // Legacy
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  division?: Division; // Optional, mainly for 'reviewer'
  avatar?: string;
}

export interface CaseTemplate {
  id: string;
  name: string;
  description: string;
  requiredDivisions: Division[];
  optionalDivisions: Division[];
}

export interface SolutionProgressLog {
  id: string;
  solutionId: string;
  progressPercent: number;
  note: string;
  evidenceUrl?: string;
  timestamp: string;
  createdBy: string; // User ID
}

export interface Solution {
  id: string;
  subtaskId: string;
  title: string;
  description: string;
  isFeasible: boolean; // OK or NO
  attachmentUrl?: string;
  currentProgress: number; // 0-100
  progressLogs: SolutionProgressLog[];
  createdAt: string;
  createdBy: string; // User ID
}

export interface Subtask {
  id: string;
  caseId: string;
  division: Division;
  status: TaskStatus;
  description: string; // What needs to be done (Derived from Case Description)
  solutions: Solution[];
  revisionNote?: string; // If status is REVISION
  updatedAt: string;
}

export interface CollaborationNote {
  id: string;
  caseId: string;
  senderDivision: Division;
  targetDivision: Division | 'ALL';
  content: string;
  timestamp: string;
  senderName: string;
}

export interface Case {
  id: string;
  // Block A Data
  title: string;
  description: string;
  location: string;
  urgency: Urgency;
  targetDate: string;
  justification: string;
  attachmentUrl?: string;
  
  // Executive Decision Data
  executiveDecision?: 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT' | 'REVISION';
  executiveNote?: string;
  
  // Metadata
  templateId: string; // 'custom' if from wizard
  requesterId: string;
  requesterName: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  caseId: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  timestamp: string;
}