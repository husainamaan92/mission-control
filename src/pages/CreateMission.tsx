import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import { useMissions } from "@/contexts/MissionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mission } from "@/types/mission";
import { availableAgents } from "@/lib/mock-data";
import {
  Plus,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Building2,
  X,
  Shield,
  Target,
  Zap,
} from "lucide-react";

const CreateMission: React.FC = () => {
  const navigate = useNavigate();
  const { createMission } = useMissions();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Mission["priority"],
    assignedTo: [] as string[],
    deadline: "",
    estimatedDuration: 240,
    locationName: "",
    locationLat: "",
    locationLng: "",
    department: "Operations",
    budget: "",
    clientName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background matrix-bg">
        <Navigation />
        <div className="container-spy py-6">
          <Card className="card-spy border-red-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
                <h2 className="text-xl font-bold text-red-400 font-mono">
                  ACCESS DENIED
                </h2>
                <p className="text-zinc-400 font-mono">
                  INSUFFICIENT SECURITY CLEARANCE
                </p>
                <p className="text-sm text-zinc-500 font-mono">
                  Only administrators can deploy new operations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Mission title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mission description is required";
    }

    if (formData.assignedTo.length === 0) {
      newErrors.assignedTo = "At least one operative must be assigned";
    }

    if (formData.estimatedDuration <= 0) {
      newErrors.estimatedDuration = "Duration must be greater than 0";
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Budget must be a valid number";
    }

    // Validate location coordinates if provided
    if (
      formData.locationLat &&
      (isNaN(Number(formData.locationLat)) ||
        Number(formData.locationLat) < -90 ||
        Number(formData.locationLat) > 90)
    ) {
      newErrors.locationLat = "Latitude must be between -90 and 90";
    }

    if (
      formData.locationLng &&
      (isNaN(Number(formData.locationLng)) ||
        Number(formData.locationLng) < -180 ||
        Number(formData.locationLng) > 180)
    ) {
      newErrors.locationLng = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const missionData: Omit<
        Mission,
        "id" | "createdAt" | "updatedAt" | "logs"
      > = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: "pending",
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        deadline: formData.deadline || undefined,
        progress: 0,
        estimatedDuration: formData.estimatedDuration,
        department: formData.department,
        budget: formData.budget ? Number(formData.budget) : undefined,
        clientName: formData.clientName.trim() || undefined,
        location:
          formData.locationName && formData.locationLat && formData.locationLng
            ? {
                name: formData.locationName.trim(),
                lat: Number(formData.locationLat),
                lng: Number(formData.locationLng),
              }
            : undefined,
      };

      createMission(missionData);
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Failed to create mission. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAgentToggle = (agentName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: checked
        ? [...prev.assignedTo, agentName]
        : prev.assignedTo.filter((name) => name !== agentName),
    }));

    if (errors.assignedTo) {
      setErrors((prev) => ({
        ...prev,
        assignedTo: "",
      }));
    }
  };

  const removeAgent = (agentName: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((name) => name !== agentName),
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background matrix-bg">
        <Navigation />
        <div className="container-spy py-6">
          <Card className="card-spy max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                  OPERATION DEPLOYED SUCCESSFULLY!
                </h2>
                <p className="text-zinc-400 mb-4 font-mono">
                  Operation "{formData.title}" has been deployed and assigned to{" "}
                  {formData.assignedTo.length} operative
                  {formData.assignedTo.length !== 1 ? "s" : ""}.
                </p>
                <p className="text-sm text-zinc-500 font-mono">
                  Redirecting to command center...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background matrix-bg">
      <Navigation />

      <div className="container-spy py-8 space-y-8">
        {/* Header */}
        <Card className="card-spy">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="btn-spy-ghost"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETURN TO COMMAND CENTER
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-green-400 font-mono flex items-center gap-2">
              <Shield className="h-6 w-6" />
              DEPLOY NEW OPERATION
            </CardTitle>
            <CardDescription className="text-zinc-400 font-mono">
              Configure mission parameters and assign operatives to new
              classified operation
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    MISSION PARAMETERS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="label-spy">
                      OPERATION CODENAME *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter operation codename"
                      className={`input-spy font-mono ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-400 mt-1 font-mono">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="label-spy">
                      MISSION BRIEFING *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed mission objectives and requirements"
                      rows={4}
                      className={`input-spy font-mono ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400 mt-1 font-mono">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="label-spy">THREAT LEVEL</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          handleSelectChange("priority", value)
                        }
                      >
                        <SelectTrigger className="input-spy font-mono">
                          <SelectValue placeholder="Select threat level" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-green-500/30 select-spy">
                          <SelectItem
                            value="low"
                            className="font-mono hover:bg-green-500/10"
                          >
                            LOW THREAT
                          </SelectItem>
                          <SelectItem
                            value="medium"
                            className="font-mono hover:bg-green-500/10"
                          >
                            MEDIUM THREAT
                          </SelectItem>
                          <SelectItem
                            value="high"
                            className="font-mono hover:bg-green-500/10"
                          >
                            HIGH THREAT
                          </SelectItem>
                          <SelectItem
                            value="critical"
                            className="font-mono hover:bg-green-500/10"
                          >
                            CRITICAL THREAT
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="label-spy">DEPARTMENT</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                      >
                        <SelectTrigger className="input-spy font-mono">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-green-500/30">
                          <SelectItem
                            value="Operations"
                            className="font-mono hover:bg-green-500/10"
                          >
                            OPERATIONS
                          </SelectItem>
                          <SelectItem
                            value="Security"
                            className="font-mono hover:bg-green-500/10"
                          >
                            SECURITY
                          </SelectItem>
                          <SelectItem
                            value="Intelligence"
                            className="font-mono hover:bg-green-500/10"
                          >
                            INTELLIGENCE
                          </SelectItem>
                          <SelectItem
                            value="Logistics"
                            className="font-mono hover:bg-green-500/10"
                          >
                            LOGISTICS
                          </SelectItem>
                          <SelectItem
                            value="Technology"
                            className="font-mono hover:bg-green-500/10"
                          >
                            TECHNOLOGY
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName" className="label-spy">
                        CLIENT DESIGNATION
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                        <Input
                          id="clientName"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="Client or requesting entity"
                          className="input-spy font-mono pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="label-spy">
                        OPERATION BUDGET
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="0"
                          className={`input-spy font-mono pl-10 ${errors.budget ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.budget && (
                        <p className="text-sm text-red-400 mt-1 font-mono">
                          {errors.budget}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Assignment */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    OPERATIVE ASSIGNMENT *
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Agents */}
                  {formData.assignedTo.length > 0 && (
                    <div>
                      <Label className="label-spy mb-2 block">
                        ASSIGNED OPERATIVES
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.assignedTo.map((agent) => (
                          <Badge
                            key={agent}
                            variant="outline"
                            className="flex items-center gap-2 status-active-spy font-mono"
                          >
                            {agent}
                            <button
                              type="button"
                              onClick={() => removeAgent(agent)}
                              className="text-green-300 hover:text-red-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Agents */}
                  <div className="space-y-3">
                    <Label className="label-spy">AVAILABLE OPERATIVES</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-green-500/20 rounded-lg p-3 bg-zinc-800/30 custom-scrollbar">
                      {availableAgents.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center space-x-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <Checkbox
                            id={agent.id}
                            checked={formData.assignedTo.includes(agent.name)}
                            onCheckedChange={(checked) =>
                              handleAgentToggle(agent.name, checked as boolean)
                            }
                            className="border-green-500/50"
                          />
                          <label
                            htmlFor={agent.id}
                            className="flex-1 text-sm cursor-pointer"
                          >
                            <div className="font-semibold text-green-300 font-mono">
                              {agent.name}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono">
                              {agent.department} • {agent.role}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {errors.assignedTo && (
                    <p className="text-sm text-red-400 mt-1 font-mono">
                      {errors.assignedTo}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Timeline & Duration */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    MISSION TIMELINE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline" className="label-spy">
                        MISSION DEADLINE
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                        <Input
                          id="deadline"
                          name="deadline"
                          type="datetime-local"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className={`input-spy font-mono pl-10 ${errors.deadline ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.deadline && (
                        <p className="text-sm text-red-400 mt-1 font-mono">
                          {errors.deadline}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="estimatedDuration" className="label-spy">
                        ESTIMATED DURATION (MINUTES) *
                      </Label>
                      <Input
                        id="estimatedDuration"
                        name="estimatedDuration"
                        type="number"
                        min="1"
                        value={formData.estimatedDuration}
                        onChange={handleInputChange}
                        placeholder="240"
                        className={`input-spy font-mono ${errors.estimatedDuration ? "border-red-500" : ""}`}
                      />
                      {errors.estimatedDuration && (
                        <p className="text-sm text-red-400 mt-1 font-mono">
                          {errors.estimatedDuration}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    OPERATION COORDINATES
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="locationName" className="label-spy">
                      LOCATION DESIGNATION
                    </Label>
                    <Input
                      id="locationName"
                      name="locationName"
                      value={formData.locationName}
                      onChange={handleInputChange}
                      placeholder="e.g., Safe House Alpha, Field Station Bravo"
                      className="input-spy font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="locationLat" className="label-spy">
                        LATITUDE
                      </Label>
                      <Input
                        id="locationLat"
                        name="locationLat"
                        type="number"
                        step="any"
                        value={formData.locationLat}
                        onChange={handleInputChange}
                        placeholder="40.7128"
                        className={`input-spy font-mono ${errors.locationLat ? "border-red-500" : ""}`}
                      />
                      {errors.locationLat && (
                        <p className="text-sm text-red-400 mt-1 font-mono">
                          {errors.locationLat}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="locationLng" className="label-spy">
                        LONGITUDE
                      </Label>
                      <Input
                        id="locationLng"
                        name="locationLng"
                        type="number"
                        step="any"
                        value={formData.locationLng}
                        onChange={handleInputChange}
                        placeholder="-74.0060"
                        className={`input-spy font-mono ${errors.locationLng ? "border-red-500" : ""}`}
                      />
                      {errors.locationLng && (
                        <p className="text-sm text-red-400 mt-1 font-mono">
                          {errors.locationLng}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    DEPLOYMENT CONTROL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full btn-spy-primary font-mono btn-default-override"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Plus className="mr-2 h-4 w-4 animate-spin" />
                        DEPLOYING OPERATION...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        DEPLOY OPERATION
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full btn-spy-secondary font-mono"
                    onClick={() => navigate("/dashboard")}
                  >
                    ABORT DEPLOYMENT
                  </Button>

                  {errors.submit && (
                    <Alert className="border-red-500/50 bg-red-900/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-red-400 font-mono text-sm">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Mission Summary */}
              <Card className="card-spy">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 font-mono">
                    MISSION SUMMARY
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">OPERATIVES:</span>
                    <span className="font-semibold text-green-300">
                      {formData.assignedTo.length} AGENT
                      {formData.assignedTo.length !== 1 ? "S" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">DURATION:</span>
                    <span className="font-semibold text-green-300">
                      {Math.round(formData.estimatedDuration / 60)}H{" "}
                      {formData.estimatedDuration % 60}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">THREAT LEVEL:</span>
                    <Badge
                      className={`text-xs font-mono ${
                        formData.priority === "critical"
                          ? "priority-critical-spy"
                          : formData.priority === "high"
                            ? "priority-high-spy"
                            : formData.priority === "medium"
                              ? "priority-medium-spy"
                              : "priority-low-spy"
                      }`}
                    >
                      {formData.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">DEPARTMENT:</span>
                    <span className="font-semibold text-green-300">
                      {formData.department.toUpperCase()}
                    </span>
                  </div>
                  {formData.budget && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">BUDGET:</span>
                      <span className="font-semibold text-green-300">
                        ${Number(formData.budget).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMission;
