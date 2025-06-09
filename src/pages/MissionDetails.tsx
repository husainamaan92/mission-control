import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { MissionTimer } from "@/components/MissionTimer";
import { ErrorLog } from "@/components/ErrorLog";
import { useMissions } from "@/contexts/MissionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mission, MissionLog } from "@/types/mission";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MapPin,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Play,
  Pause,
  Square,
  Edit,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MissionDetails: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const { getMissionById, updateMission, addMissionLog, deleteMission } =
    useMissions();
  const { user } = useAuth();
  const [newLogMessage, setNewLogMessage] = useState("");
  const [newLogLevel, setNewLogLevel] = useState<MissionLog["level"]>("info");
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [editingProgress, setEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  const mission = missionId ? getMissionById(missionId) : undefined;

  if (!mission) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <Alert className="border-red-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Mission not found. It may have been deleted or you don't have
              permission to view it.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === "admin";
  const isOverdue =
    mission.deadline &&
    new Date(mission.deadline) < new Date() &&
    mission.status !== "completed";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (newStatus: Mission["status"]) => {
    updateMission(mission.id, { status: newStatus });

    // Auto-add log entry for status changes
    const statusMessages = {
      active: "Mission activated and started",
      completed: "Mission completed successfully",
      failed: "Mission marked as failed",
      pending: "Mission status reset to pending",
    };

    addMissionLog(mission.id, {
      level:
        newStatus === "completed"
          ? "success"
          : newStatus === "failed"
            ? "error"
            : "info",
      message: statusMessages[newStatus],
      details: `Status changed by ${user?.username}`,
    });
  };

  const handleProgressUpdate = () => {
    if (newProgress >= 0 && newProgress <= 100) {
      updateMission(mission.id, { progress: newProgress });
      addMissionLog(mission.id, {
        level: "info",
        message: `Progress updated to ${newProgress}%`,
        details: `Updated by ${user?.username}`,
      });
      setEditingProgress(false);
    }
  };

  const handleAddLog = () => {
    if (newLogMessage.trim()) {
      addMissionLog(mission.id, {
        level: newLogLevel,
        message: newLogMessage.trim(),
      });
      setNewLogMessage("");
      setNewLogLevel("info");
      setIsAddingLog(false);
    }
  };

  const handleDeleteMission = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this mission? This action cannot be undone.",
      )
    ) {
      deleteMission(mission.id);
      navigate("/dashboard");
    }
  };

  const getPriorityColor = (priority: Mission["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMission}
              >
                Delete Mission
              </Button>
            </div>
          )}
        </div>

        {/* Mission Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card
              className={cn(
                "border-l-4",
                mission.priority === "critical" && "border-l-red-500",
                mission.priority === "high" && "border-l-orange-500",
                mission.priority === "medium" && "border-l-yellow-500",
                mission.priority === "low" && "border-l-green-500",
                isOverdue && "bg-red-50/50 dark:bg-red-950/20",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      {mission.title}
                      {isOverdue && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={mission.status} />
                      <Badge
                        className={cn(
                          "text-xs",
                          getPriorityColor(mission.priority),
                        )}
                      >
                        {mission.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardDescription className="text-base mt-4">
                  {mission.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Status Controls */}
          <div className="space-y-4">
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mission Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleStatusChange("active")}
                      disabled={mission.status === "active"}
                      variant={
                        mission.status === "active" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Start
                    </Button>

                    <Button
                      onClick={() => handleStatusChange("completed")}
                      disabled={mission.status === "completed"}
                      variant={
                        mission.status === "completed" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Complete
                    </Button>

                    <Button
                      onClick={() => handleStatusChange("pending")}
                      disabled={mission.status === "pending"}
                      variant={
                        mission.status === "pending" ? "default" : "outline"
                      }
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Pause className="h-3 w-3" />
                      Pause
                    </Button>

                    <Button
                      onClick={() => handleStatusChange("failed")}
                      disabled={mission.status === "failed"}
                      variant={
                        mission.status === "failed" ? "destructive" : "outline"
                      }
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Fail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Progress
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{mission.progress}%</span>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProgress(!editingProgress);
                          setNewProgress(mission.progress);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingProgress ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newProgress}
                      onChange={(e) => setNewProgress(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{newProgress}%</span>
                    <Button size="sm" onClick={handleProgressUpdate}>
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingProgress(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Progress value={mission.progress} className="h-2" />
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{mission.assignedTo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created {formatDate(mission.createdAt)}</span>
                  </div>

                  {mission.deadline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={cn(
                          isOverdue ? "text-red-500 font-medium" : "",
                        )}
                      >
                        Due {formatDate(mission.deadline)}
                      </span>
                    </div>
                  )}

                  {mission.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{mission.location.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timer for Active Missions */}
        {mission.status === "active" && (
          <Card>
            <CardContent className="py-4">
              <MissionTimer
                startTime={mission.createdAt}
                estimatedDuration={mission.estimatedDuration}
              />
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Logs & History
            </TabsTrigger>
            <TabsTrigger value="details">
              <Target className="h-4 w-4 mr-2" />
              Mission Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            {/* Add Log Section */}
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Mission Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isAddingLog ? (
                    <Button
                      onClick={() => setIsAddingLog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Log Entry
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <Select
                            value={newLogLevel}
                            onValueChange={(value) =>
                              setNewLogLevel(value as MissionLog["level"])
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-3">
                          <Textarea
                            placeholder="Enter log message..."
                            value={newLogMessage}
                            onChange={(e) => setNewLogMessage(e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddLog}
                          disabled={!newLogMessage.trim()}
                        >
                          Add Log
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingLog(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mission Logs */}
            <ErrorLog logs={mission.logs} maxHeight="500px" />
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Estimated Duration
                    </h4>
                    <p className="text-lg">
                      {mission.estimatedDuration} minutes
                    </p>
                  </div>

                  {mission.actualDuration && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Actual Duration
                      </h4>
                      <p className="text-lg">
                        {mission.actualDuration} minutes
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Priority Level
                    </h4>
                    <Badge
                      className={cn("mt-1", getPriorityColor(mission.priority))}
                    >
                      {mission.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </h4>
                    <p className="text-sm">{formatDate(mission.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {mission.location && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Location Name
                      </h4>
                      <p className="text-lg">{mission.location.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Latitude
                        </h4>
                        <p className="text-sm font-mono">
                          {mission.location.lat}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Longitude
                        </h4>
                        <p className="text-sm font-mono">
                          {mission.location.lng}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MissionDetails;
