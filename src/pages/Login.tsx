import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  Terminal,
  Zap,
} from "lucide-react";

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: "admin",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear error when user starts typing
    if (error && (formData.username || formData.password)) {
      setError("");
    }
  }, [formData, error]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);
    setError("");
    setIsSubmitting(true);

    try {
      console.log("Attempting login...");
      const success = await login(formData.username, formData.password);
      console.log("Login result:", success);
      if (!success) {
        setError("ACCESS DENIED - INVALID CREDENTIALS");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("AUTHENTICATION FAILED - TRY AGAIN");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuickLogin = (username: string, password: string) => {
    setFormData({ username, password });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background matrix-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400/50 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.15s" }}
            ></div>
          </div>
          <p className="text-green-400 font-mono">
            INITIALIZING SECURE CONNECTION...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background matrix-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 fade-in-spy">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-green-500 to-green-600 relative">
              <Shield className="h-12 w-12 text-black" />
              <div className="absolute inset-0 bg-green-500/50 rounded-2xl blur-xl animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-spy font-mono">
            CLASSIFIED
          </h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">
            SECURE ACCESS TERMINAL
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs text-green-400 font-mono">
              SECURE CONNECTION ESTABLISHED
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="card-elevated border-green-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-green-300 flex items-center justify-center gap-2 font-mono">
              <Lock className="h-5 w-5" />
              BIOMETRIC AUTHENTICATION
            </CardTitle>
            <CardDescription className="text-zinc-400 font-mono text-sm">
              ENTER SECURITY CREDENTIALS TO ACCESS CLASSIFIED SYSTEMS
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-500/50 bg-red-900/20 text-red-300">
                  <Terminal className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="label-spy">
                    AGENT ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="ENTER AGENT IDENTIFICATION"
                      className="pl-10 input-spy font-mono text-green-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="label-spy">
                    SECURITY KEY
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="ENTER SECURITY PASSPHRASE"
                      className="pl-10 pr-10 input-spy font-mono text-green-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-spy-primary hover-lift-spy font-mono font-bold btn-default-override"
                disabled={
                  isSubmitting || !formData.username || !formData.password
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    INITIATE ACCESS
                  </>
                )}
              </Button>
            </form>

            {/* Quick Access */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-green-500/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-green-400 font-mono">
                    QUICK ACCESS PROTOCOLS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickLogin("admin", "admin123")}
                  className="btn-spy-secondary text-xs p-3 h-auto flex flex-col gap-1 font-mono"
                >
                  <Shield className="h-4 w-4" />
                  <span>COMMANDER</span>
                  <Badge
                    variant="outline"
                    className="text-xs status-active-spy"
                  >
                    LEVEL 5
                  </Badge>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickLogin("operator", "operator123")}
                  className="btn-spy-secondary text-xs p-3 h-auto flex flex-col gap-1 font-mono"
                >
                  <User className="h-4 w-4" />
                  <span>OPERATIVE</span>
                  <Badge
                    variant="outline"
                    className="text-xs status-pending-spy"
                  >
                    LEVEL 2
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-green-500/20">
              <h4 className="text-sm font-bold text-green-300 mb-2 font-mono">
                SECURITY CLEARANCE LEVELS
              </h4>
              <div className="text-xs text-zinc-400 space-y-1 font-mono">
                <div>
                  COMMANDER:{" "}
                  <code className="bg-green-500/20 text-green-300 px-1 rounded">
                    admin / admin123
                  </code>
                </div>
                <div>
                  OPERATIVE:{" "}
                  <code className="bg-amber-500/20 text-amber-300 px-1 rounded">
                    operator / operator123
                  </code>
                </div>
              </div>
              <div className="mt-3 text-xs text-red-400 font-mono">
                ⚠️ UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-zinc-500 font-mono">
            CLASSIFIED INTELLIGENCE SYSTEM v3.0 • SECURE TERMINAL ACTIVE
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-500 font-mono">
              ENCRYPTION: AES-256
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
