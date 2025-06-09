import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Mission, MissionLog } from "@/types/mission";
import {
  getMissions,
  storeMission,
  deleteMission,
  storeMissions,
} from "@/lib/storage";
import { initialMissions } from "@/lib/mock-data";

interface MissionContextType {
  missions: Mission[];
  loading: boolean;
  createMission: (
    mission: Omit<Mission, "id" | "createdAt" | "updatedAt" | "logs">,
  ) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  deleteMission: (missionId: string) => void;
  addMissionLog: (
    missionId: string,
    log: Omit<MissionLog, "id" | "timestamp">,
  ) => void;
  getMissionById: (id: string) => Mission | undefined;
  refreshMissions: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMissions = () => {
    setLoading(true);
    let storedMissions = getMissions();

    // If no missions in storage, initialize with mock data
    if (storedMissions.length === 0) {
      storedMissions = initialMissions;
      storeMissions(storedMissions);
    } else {
      // Migrate old data format to new format
      storedMissions = storedMissions.map((mission) => ({
        ...mission,
        // Convert string assignedTo to array for backward compatibility
        assignedTo: Array.isArray(mission.assignedTo)
          ? mission.assignedTo
          : typeof mission.assignedTo === "string"
            ? [mission.assignedTo]
            : [],
        // Add default department if missing
        department: mission.department || "Operations",
        // Ensure logs have author field
        logs:
          mission.logs?.map((log) => ({
            ...log,
            author: log.author || "System",
          })) || [],
      }));
      // Save the migrated data
      storeMissions(storedMissions);
    }

    setMissions(storedMissions);
    setLoading(false);
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const createMission = (
    missionData: Omit<Mission, "id" | "createdAt" | "updatedAt" | "logs">,
  ) => {
    const newMission: Mission = {
      ...missionData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: [],
    };

    storeMission(newMission);
    setMissions((prev) => [...prev, newMission]);
  };

  const updateMission = (missionId: string, updates: Partial<Mission>) => {
    setMissions((prev) => {
      const updated = prev.map((mission) => {
        if (mission.id === missionId) {
          const updatedMission = {
            ...mission,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          storeMission(updatedMission);
          return updatedMission;
        }
        return mission;
      });
      return updated;
    });
  };

  const handleDeleteMission = (missionId: string) => {
    deleteMission(missionId);
    setMissions((prev) => prev.filter((mission) => mission.id !== missionId));
  };

  const addMissionLog = (
    missionId: string,
    logData: Omit<MissionLog, "id" | "timestamp">,
  ) => {
    const newLog: MissionLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    updateMission(missionId, {
      logs: missions.find((m) => m.id === missionId)?.logs
        ? [...missions.find((m) => m.id === missionId)!.logs, newLog]
        : [newLog],
    });
  };

  const getMissionById = (id: string): Mission | undefined => {
    return missions.find((mission) => mission.id === id);
  };

  const refreshMissions = () => {
    loadMissions();
  };

  const value: MissionContextType = {
    missions,
    loading,
    createMission,
    updateMission,
    deleteMission: handleDeleteMission,
    addMissionLog,
    getMissionById,
    refreshMissions,
  };

  return (
    <MissionContext.Provider value={value}>{children}</MissionContext.Provider>
  );
};

export const useMissions = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMissions must be used within a MissionProvider");
  }
  return context;
};
