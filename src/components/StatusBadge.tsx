import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mission } from "@/types/mission";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Mission["status"];
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const getStatusConfig = (status: Mission["status"]) => {
  switch (status) {
    case "active":
      return {
        label: "ACTIVE",
        className: "status-active",
        dotClass: "status-indicator-active",
        emoji: "🟢",
      };
    case "completed":
      return {
        label: "COMPLETED",
        className: "status-completed",
        dotClass: "status-indicator-completed",
        emoji: "✅",
      };
    case "failed":
      return {
        label: "FAILED",
        className: "status-failed",
        dotClass: "status-indicator-failed",
        emoji: "❌",
      };
    case "pending":
      return {
        label: "PENDING",
        className: "status-pending",
        dotClass: "status-indicator-pending",
        emoji: "⏳",
      };
    default:
      return {
        label: "UNKNOWN",
        className: "bg-zinc-800 text-zinc-400 border-zinc-600",
        dotClass: "w-3 h-3 rounded-full bg-zinc-400",
        emoji: "❓",
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "md",
  showIcon = true,
}) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "relative flex items-center font-bold border transition-all duration-200 hover:scale-105 font-mono",
        config.className,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <div className={cn("rounded-full", config.dotClass)} />}
      <span>{config.label}</span>
    </Badge>
  );
};
