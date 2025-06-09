export interface Mission {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "failed" | "pending";
  priority: "low" | "medium" | "high" | "critical";
  assignedTo: string[] | string; // Support both array and string for backward compatibility
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  progress: number; // 0-100
  logs: MissionLog[];
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  department?: string; // Added department field
  budget?: number; // Added budget field
  clientName?: string; // Added client field
}

export interface MissionLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
  author?: string; // Added author field
}

export interface User {
  id: string;
  username: string;
  role: "admin" | "operator";
  lastLogin: string;
  department?: string; // Added department field
  fullName?: string; // Added full name field
}

export type MissionStatus = Mission["status"];
export type MissionPriority = Mission["priority"];
export type LogLevel = MissionLog["level"];
