import { Mission, User } from "@/types/mission";

const STORAGE_KEYS = {
  MISSIONS: "missionControl_missions",
  USER: "missionControl_user",
  THEME: "missionControl_theme",
} as const;

// Mission storage functions
export const storeMissions = (missions: Mission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  } catch (error) {
    console.error("Error storing missions:", error);
  }
};

export const getMissions = (): Mission[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving missions:", error);
    return [];
  }
};

export const storeMission = (mission: Mission): void => {
  const missions = getMissions();
  const existingIndex = missions.findIndex((m) => m.id === mission.id);

  if (existingIndex >= 0) {
    missions[existingIndex] = mission;
  } else {
    missions.push(mission);
  }

  storeMissions(missions);
};

export const deleteMission = (missionId: string): void => {
  const missions = getMissions().filter((m) => m.id !== missionId);
  storeMissions(missions);
};

// User storage functions
export const storeUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

export const getUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

// Theme storage
export const storeTheme = (theme: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error("Error storing theme:", error);
  }
};

export const getTheme = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  } catch (error) {
    console.error("Error retrieving theme:", error);
    return "dark";
  }
};

// Clear all data
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
