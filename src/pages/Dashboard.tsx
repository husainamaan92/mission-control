import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { MissionCard } from "@/components/MissionCard";
import { useMissions } from "@/contexts/MissionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mission } from "@/types/mission";
import {
  Search,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  RefreshCw,
  Zap,
  Target,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { missions, updateMission, loading, refreshMissions } = useMissions();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Filter missions based on search and filters
  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      // Handle both string and array formats for assignedTo
      const assignedToArray = Array.isArray(mission.assignedTo)
        ? mission.assignedTo
        : typeof mission.assignedTo === "string"
          ? [mission.assignedTo]
          : [];

      const matchesSearch =
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignedToArray.some((person) =>
          person.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        mission.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || mission.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || mission.priority === priorityFilter;
      const matchesDepartment =
        departmentFilter === "all" ||
        (mission.department || "Operations") === departmentFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDepartment
      );
    });
  }, [missions, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  // Group missions by status
  const missionsByStatus = useMemo(() => {
    return {
      active: filteredMissions.filter((m) => m.status === "active"),
      pending: filteredMissions.filter((m) => m.status === "pending"),
      completed: filteredMissions.filter((m) => m.status === "completed"),
      failed: filteredMissions.filter((m) => m.status === "failed"),
    };
  }, [filteredMissions]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [
      ...new Set(
        missions.map((m) => m.department || "Operations").filter(Boolean),
      ),
    ];
    return depts.sort();
  }, [missions]);

  // Calculate threat metrics
  const threatMetrics = useMemo(() => {
    const critical = missions.filter(
      (m) => m.priority === "critical" && m.status === "active",
    ).length;
    const high = missions.filter(
      (m) => m.priority === "high" && m.status === "active",
    ).length;
    const overdue = missions.filter(
      (m) =>
        m.deadline &&
        new Date(m.deadline) < new Date() &&
        m.status !== "completed",
    ).length;

    return { critical, high, overdue };
  }, [missions]);

  const handleViewMissionDetails = (missionId: string) => {
    navigate(`/mission/${missionId}`);
  };

  const handleUpdateMissionStatus = (
    missionId: string,
    status: Mission["status"],
  ) => {
    updateMission(missionId, { status });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDepartmentFilter("all");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    departmentFilter !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-background animated-background">
        <Navigation />
        <div className="main-container py-20">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400/50 rounded-full animate-spin mx-auto"
                  style={{ animationDelay: "0.15s" }}
                ></div>
              </div>
              <p className="text-green-400 font-mono">
                ACCESSING CLASSIFIED DATABASE...
              </p>
              <div className="flex justify-center gap-1">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animated-background">
      <Navigation />

      <div className="main-container py-8 space-y-8 fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="page-title font-mono">
                CLASSIFIED OPERATIONS CENTER
              </h1>
              <p className="page-subtitle font-mono">
                WELCOME BACK,{" "}
                <span className="font-bold text-green-400">
                  {user?.fullName?.toUpperCase() ||
                    user?.username?.toUpperCase()}
                </span>
                . SECURITY CLEARANCE:{" "}
                <span className="text-green-400 font-bold">
                  {user?.role?.toUpperCase()}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={refreshMissions}
                variant="outline"
                size="sm"
                className="secondary-button font-mono"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                SYNC DATA
              </Button>

              {user?.role === "admin" && (
                <Button
                  onClick={() => navigate("/create-mission")}
                  className="primary-button hover-lift font-mono button-override"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  DEPLOY MISSION
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Threat Level Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="content-card border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-xs text-zinc-400 font-mono">
                    CRITICAL THREATS
                  </p>
                  <p className="text-2xl font-bold text-red-400 font-mono">
                    {threatMetrics.critical}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="content-card border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-amber-400" />
                <div>
                  <p className="text-xs text-zinc-400 font-mono">
                    HIGH PRIORITY
                  </p>
                  <p className="text-2xl font-bold text-amber-400 font-mono">
                    {threatMetrics.high}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="content-card border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-400 animate-pulse" />
                <div>
                  <p className="text-xs text-zinc-400 font-mono">ACTIVE OPS</p>
                  <p className="text-2xl font-bold text-green-400 font-mono">
                    {missionsByStatus.active.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="content-card border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-xs text-zinc-400 font-mono">COMPLETED</p>
                  <p className="text-2xl font-bold text-blue-400 font-mono">
                    {missionsByStatus.completed.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="content-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-mono text-green-400">
              <Filter className="h-5 w-5 text-green-400" />
              INTELLIGENCE FILTERS
              <Badge
                variant="outline"
                className="ml-auto status-active font-mono"
              >
                {filteredMissions.length} / {missions.length} RECORDS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  placeholder="SEARCH OPERATIONS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 form-input font-mono"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="form-input font-mono">
                  <SelectValue placeholder="STATUS FILTER" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-green-500/30 dropdown-container">
                  <SelectItem
                    value="all"
                    className="font-mono hover:bg-green-500/10"
                  >
                    ALL STATUS
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🟢 ACTIVE
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🟡 PENDING
                  </SelectItem>
                  <SelectItem
                    value="completed"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🔵 COMPLETED
                  </SelectItem>
                  <SelectItem
                    value="failed"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🔴 FAILED
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="form-input font-mono">
                  <SelectValue placeholder="THREAT LEVEL" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-green-500/30 dropdown-container">
                  <SelectItem
                    value="all"
                    className="font-mono hover:bg-green-500/10"
                  >
                    ALL LEVELS
                  </SelectItem>
                  <SelectItem
                    value="critical"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🔴 CRITICAL
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🟠 HIGH
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🟡 MEDIUM
                  </SelectItem>
                  <SelectItem
                    value="low"
                    className="font-mono hover:bg-green-500/10"
                  >
                    🟢 LOW
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="form-input font-mono">
                  <SelectValue placeholder="DEPARTMENT" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-green-500/30 dropdown-container">
                  <SelectItem
                    value="all"
                    className="font-mono hover:bg-green-500/10"
                  >
                    ALL DEPTS
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem
                      key={dept}
                      value={dept}
                      className="font-mono hover:bg-green-500/10"
                    >
                      {dept.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                <p className="text-sm text-zinc-400 font-mono">
                  DISPLAYING {filteredMissions.length} OF {missions.length}{" "}
                  OPERATIONS
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="secondary-button font-mono"
                >
                  CLEAR FILTERS
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mission Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="tab-container grid w-full grid-cols-4">
            <TabsTrigger
              value="active"
              className="tab-trigger flex items-center gap-2 font-mono"
            >
              <Activity className="h-4 w-4" />
              ACTIVE
              {missionsByStatus.active.length > 0 && (
                <Badge className="status-active text-xs font-mono">
                  {missionsByStatus.active.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="tab-trigger flex items-center gap-2 font-mono"
            >
              <Clock className="h-4 w-4" />
              PENDING
              {missionsByStatus.pending.length > 0 && (
                <Badge className="status-pending text-xs font-mono">
                  {missionsByStatus.pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="tab-trigger flex items-center gap-2 font-mono"
            >
              <CheckCircle className="h-4 w-4" />
              COMPLETED
              {missionsByStatus.completed.length > 0 && (
                <Badge className="status-completed text-xs font-mono">
                  {missionsByStatus.completed.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className="tab-trigger flex items-center gap-2 font-mono"
            >
              <XCircle className="h-4 w-4" />
              FAILED
              {missionsByStatus.failed.length > 0 && (
                <Badge className="status-failed text-xs font-mono">
                  {missionsByStatus.failed.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {Object.entries(missionsByStatus).map(([status, statusMissions]) => (
            <TabsContent key={status} value={status} className="slide-up">
              {statusMissions.length === 0 ? (
                <Card className="content-card">
                  <CardContent className="py-16">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                        <Shield className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h3 className="text-xl font-bold text-green-400 font-mono">
                        NO {status.toUpperCase()} OPERATIONS
                      </h3>
                      <p className="text-zinc-400 max-w-md mx-auto font-mono text-sm">
                        {status === "active" &&
                          "ALL SYSTEMS SECURE. NO ACTIVE OPERATIONS DETECTED."}
                        {status === "pending" &&
                          "NO OPERATIONS WAITING FOR DEPLOYMENT."}
                        {status === "completed" &&
                          "NO COMPLETED MISSIONS IN CURRENT DATABASE."}
                        {status === "failed" &&
                          "OPERATIONAL SUCCESS RATE: 100%. NO FAILURES RECORDED."}
                      </p>
                      {user?.role === "admin" && (
                        <Button
                          onClick={() => navigate("/create-mission")}
                          className="primary-button hover-lift font-mono button-override"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          DEPLOY MISSION
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
                  {statusMissions.map((mission, index) => (
                    <div
                      key={mission.id}
                      className="fade-in h-full"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <MissionCard
                        mission={mission}
                        onViewDetails={handleViewMissionDetails}
                        onUpdateStatus={
                          user?.role === "admin"
                            ? handleUpdateMissionStatus
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
