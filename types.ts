
export interface Project {
  id: string;
  name: string;
  number: string;
  address?: string;
  locationUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  jobTitle?: string;
  accountNumber: string;
  mobileNumber: string;
  address: string;
  projectId?: string; // Optional link to a project
}

export interface Report {
  id: string;
  projectId: string;
  fileName: string;
  fileType: 'excel' | 'word' | 'pdf' | 'image' | 'other';
  date: string;
  notes?: string;
  size?: string;
}

export interface GeneratedData {
  projects?: Project[];
  employees?: Employee[];
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  role: UserRole;
  name: string;
}

export type ViewState = 'projects' | 'employees' | 'users' | 'project-reports';
