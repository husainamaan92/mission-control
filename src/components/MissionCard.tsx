import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types/mission";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Clock,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Eye,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Shield,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  onViewDetails: (missionId: string) => void;
  onUpdateStatus?: (missionId: string, status: Mission["status"]) => void;
  compact?: boolean;
}

const getPriorityConfig = (priority: Mission["priority"]) => {
  switch (priority) {
    case "critical":
      return { className: "priority-critical", label: "CRITICAL" };
    case "high":
      return { className: "priority-high", label: "HIGH" };
    case "medium":
      return { className: "priority-medium", label: "MEDIUM" };
    case "low":
      return { className: "priority-low", label: "LOW" };
  }
};

const getDepartmentConfig = (department?: string) => {
  const configs: Record<string, string> = {
    Operations: "dept-operations",
    Security: "dept-security",
    Intelligence: "dept-intelligence",
    Logistics: "dept-logistics",
    Technology: "dept-technology",
  };
  return configs[department || "Operations"] || "dept-operations";
};

const getStatusCardClass = (status: Mission["status"]) => {
  switch (status) {
    case "active":
      return "mission-card-active";
    case "completed":
      return "mission-card-completed";
    case "failed":
      return "mission-card-failed";
    case "pending":
      return "mission-card-pending";
    default:
      return "";
  }
};

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onViewDetails,
  onUpdateStatus,
  compact = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isOverdue =
    mission.deadline &&
    new Date(mission.deadline) < new Date() &&
    mission.status !== "completed";
  const priorityConfig = getPriorityConfig(mission.priority);

  // Generate initials for team members
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle both string and array formats for assignedTo
  const assignedToArray = React.useMemo(() => {
    return Array.isArray(mission.assignedTo)
      ? mission.assignedTo
      : typeof mission.assignedTo === "string"
        ? [mission.assignedTo]
        : [];
  }, [mission.assignedTo]);

  return (
    <Card
      className={cn(
        "mission-card hover-lift h-full flex flex-col min-h-[500px]",
        getStatusCardClass(mission.status),
        compact ? "p-3" : "p-4",
        isOverdue && "hover-glow",
      )}
    >
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <CardTitle
              className={cn(
                "font-bold leading-tight flex items-center gap-2 font-mono",
                compact ? "text-base" : "text-lg text-green-300",
              )}
            >
              <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="truncate">{mission.title}</span>
              {isOverdue && (
                <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse flex-shrink-0" />
              )}
            </CardTitle>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={mission.status} size="sm" />
              <Badge
                className={cn(
                  "text-xs font-bold font-mono",
                  priorityConfig.className,
                )}
              >
                {priorityConfig.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-mono",
                  getDepartmentConfig(mission.department),
                )}
              >
                {(mission.department || "Operations").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Main Content Area - takes up available space */}
        <div className="flex-1 space-y-4">
          {/* Description */}
          {!compact && (
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-green-500/20">
              <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed font-mono">
                {mission.description}
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400 font-mono">
                  PROGRESS
                </span>
              </div>
              <span className="text-lg font-bold text-green-300 font-mono">
                {mission.progress}%
              </span>
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>

          {/* Team Avatars */}
          {assignedToArray.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400 font-mono">
                  OPERATIVES
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="avatar-group">
                  {assignedToArray.slice(0, 3).map((person, index) => (
                    <div key={index} className="user-avatar" title={person}>
                      {getInitials(person)}
                    </div>
                  ))}
                  {assignedToArray.length > 3 && (
                    <div className="user-avatar bg-zinc-700 text-zinc-400 border-zinc-600">
                      +{assignedToArray.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {assignedToArray.length} AGENT
                  {assignedToArray.length !== 1 ? "S" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Mission Details - Flexible space */}
          <div className="flex-1 space-y-3 text-sm">
            {mission.clientName && (
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-blue-500/20">
                <Building2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <div className="font-mono">
                  <span className="text-zinc-400">CLIENT: </span>
                  <span className="font-semibold text-blue-300">
                    {mission.clientName}
                  </span>
                </div>
              </div>
            )}

            {mission.budget && (
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-amber-500/20">
                <DollarSign className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <div className="font-mono">
                  <span className="text-zinc-400">BUDGET: </span>
                  <span className="font-semibold text-amber-300">
                    {formatCurrency(mission.budget)}
                  </span>
                </div>
              </div>
            )}

            {mission.location && (
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-purple-500/20">
                <MapPin className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-purple-300 font-mono truncate">
                  {mission.location.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-green-500/20">
              <Calendar className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-green-300 font-mono">
                CREATED {formatDate(mission.createdAt)}
              </span>
            </div>

            {mission.deadline && (
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border",
                  isOverdue
                    ? "bg-red-900/30 border-red-500/50 animate-pulse"
                    : "bg-zinc-800/50 border-zinc-500/20",
                )}
              >
                <Clock
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isOverdue ? "text-red-400" : "text-zinc-400",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-mono",
                    isOverdue ? "text-red-300 font-bold" : "text-zinc-300",
                  )}
                >
                  DEADLINE {formatDate(mission.deadline)}
                  {isOverdue && " - OVERDUE"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Always at bottom */}
        <div className="mt-auto space-y-4 pt-4">
          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-green-500/20">
            <Button
              onClick={() => onViewDetails(mission.id)}
              className="flex-1 primary-button hover-lift font-mono button-override"
              size={compact ? "sm" : "default"}
            >
              <Eye className="h-4 w-4 mr-2" />
              ACCESS INTEL
            </Button>

            {onUpdateStatus && mission.status === "active" && (
              <Button
                onClick={() => onUpdateStatus(mission.id, "completed")}
                variant="outline"
                size={compact ? "sm" : "default"}
                className="status-completed border-blue-500/30 text-blue-300 hover:bg-blue-900/20 font-mono"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Classification Level */}
          <div className="flex items-center justify-between pt-3 border-t border-green-500/20">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-zinc-400 font-mono">
                CLASSIFICATION:
              </span>
              <Badge className="status-classified text-xs font-mono">
                {mission.priority === "critical"
                  ? "TOP SECRET"
                  : mission.priority === "high"
                    ? "SECRET"
                    : mission.priority === "medium"
                      ? "CONFIDENTIAL"
                      : "RESTRICTED"}
              </Badge>
            </div>

            {mission.logs && mission.logs.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs font-mono border-green-500/30 text-green-400"
              >
                {mission.logs.length} LOG{mission.logs.length === 1 ? "" : "S"}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
