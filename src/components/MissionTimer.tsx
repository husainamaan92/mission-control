import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionTimerProps {
  startTime: string;
  estimatedDuration: number; // in minutes
  compact?: boolean;
  className?: string;
}

export const MissionTimer: React.FC<MissionTimerProps> = ({
  startTime,
  estimatedDuration,
  compact = false,
  className,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000); // in seconds
      const elapsedMinutes = elapsed / 60;

      setElapsedTime(elapsed);
      setIsOvertime(elapsedMinutes > estimatedDuration);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, estimatedDuration]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getProgress = (): number => {
    const elapsedMinutes = elapsedTime / 60;
    const progress = (elapsedMinutes / estimatedDuration) * 100;
    return Math.min(progress, 100);
  };

  const getRemainingTime = (): string => {
    const elapsedMinutes = elapsedTime / 60;
    const remainingMinutes = Math.max(0, estimatedDuration - elapsedMinutes);

    if (remainingMinutes === 0) {
      const overtimeMinutes = elapsedMinutes - estimatedDuration;
      return `+${Math.floor(overtimeMinutes)}m overtime`;
    }

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.floor(remainingMinutes % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Timer className="h-4 w-4" />
        <span
          className={cn(
            "font-mono",
            isOvertime ? "text-red-500" : "text-muted-foreground",
          )}
        >
          {formatTime(elapsedTime)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Mission Timer</span>
        </div>
        <span
          className={cn(
            "font-mono font-medium",
            isOvertime ? "text-red-500" : "text-foreground",
          )}
        >
          {formatTime(elapsedTime)}
        </span>
      </div>

      <Progress
        value={getProgress()}
        className={cn("h-2", isOvertime && "bg-red-100 dark:bg-red-950")}
      />

      <div className="text-xs text-muted-foreground text-center">
        {getRemainingTime()}
      </div>
    </div>
  );
};
