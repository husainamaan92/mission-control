import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMissions } from "@/contexts/MissionContext";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { missions } = useMissions();
  const { user } = useAuth();

  // Generate notification ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Check for mission status changes and overdue missions
  useEffect(() => {
    if (!user || missions.length === 0) return;

    // Check for overdue missions
    const overdueMissions = missions.filter(
      (m) =>
        m.deadline &&
        new Date(m.deadline) < new Date() &&
        m.status !== "completed" &&
        m.status !== "failed",
    );

    // Check for critical missions
    const criticalMissions = missions.filter(
      (m) => m.priority === "critical" && m.status === "active",
    );

    // Check for completed missions
    const recentCompletedMissions = missions.filter((m) => {
      if (m.status !== "completed") return false;
      const updatedTime = new Date(m.updatedAt).getTime();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return updatedTime > oneHourAgo;
    });

    // Add overdue notifications
    overdueMissions.forEach((mission) => {
      const existingNotification = notifications.find(
        (n) => n.title.includes(mission.title) && n.type === "error",
      );

      if (!existingNotification) {
        addNotification({
          type: "error",
          title: "MISSION OVERDUE",
          message: `Operation "${mission.title}" has exceeded deadline and requires immediate attention.`,
        });
      }
    });

    // Add critical mission notifications
    criticalMissions.forEach((mission) => {
      const existingNotification = notifications.find(
        (n) => n.title.includes(mission.title) && n.type === "warning",
      );

      if (!existingNotification) {
        addNotification({
          type: "warning",
          title: "CRITICAL OPERATION ACTIVE",
          message: `High-priority operation "${mission.title}" is currently in progress.`,
        });
      }
    });

    // Add completion notifications
    recentCompletedMissions.forEach((mission) => {
      const existingNotification = notifications.find(
        (n) => n.title.includes(mission.title) && n.type === "success",
      );

      if (!existingNotification) {
        addNotification({
          type: "success",
          title: "MISSION COMPLETED",
          message: `Operation "${mission.title}" has been successfully completed.`,
        });
      }
    });
  }, [missions, user]);

  const addNotification = (
    notificationData: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]); // Keep only last 50 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
