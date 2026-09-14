
export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed and stored server-side
  name: string;
  role: UserRole;
  jobTitle?: string;
  mobileNumber?: string;
  biometricEnabled?: boolean;
}

export type AttendanceType = 'check-in' | 'check-out';

export interface AttendanceLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  type: AttendanceType;
  timestamp: string; // ISO string
  location: AttendanceLocation | null;
  verifiedByBiometric: boolean;
  note?: string;
}

export type ViewState = 'attendance' | 'users' | 'reports' | 'profile';
