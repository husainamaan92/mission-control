import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Activity,
  Users,
  Clock,
  Target,
  MapPin,
  TrendingUp,
  ChevronRight,
  Zap,
  Lock,
  CheckCircle,
  Globe,
  Database,
  BarChart3,
  Eye,
  Crosshair,
  Radar,
} from "lucide-react";

const Index: React.FC = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-time Intel Tracking",
      description:
        "Monitor classified operations with encrypted status updates and live intelligence feeds",
      color: "text-green-400",
    },
    {
      icon: Users,
      title: "Agent Deployment System",
      description:
        "Deploy multiple operatives to missions with secure communication protocols",
      color: "text-blue-400",
    },
    {
      icon: Clock,
      title: "Mission Chronometer",
      description:
        "Precision timing systems with deadline enforcement and operational duration tracking",
      color: "text-amber-400",
    },
    {
      icon: Shield,
      title: "Quantum Encryption",
      description:
        "Military-grade security with biometric authentication for classified operations",
      color: "text-red-400",
    },
    {
      icon: MapPin,
      title: "Global Positioning Intel",
      description:
        "Satellite tracking and geographic intelligence for worldwide operations",
      color: "text-purple-400",
    },
    {
      icon: TrendingUp,
      title: "Threat Analysis Engine",
      description:
        "Advanced analytics for mission success prediction and risk assessment",
      color: "text-cyan-400",
    },
  ];

  const stats = [
    {
      label: "Active Operations",
      value: "24/7",
      icon: Activity,
      color: "text-green-400",
    },
    { label: "Global Agents", value: "∞", icon: Users, color: "text-blue-400" },
    {
      label: "Mission Success",
      value: "99.9%",
      icon: Target,
      color: "text-purple-400",
    },
    { label: "Countries", value: "195+", icon: Globe, color: "text-cyan-400" },
    {
      label: "Security Level",
      value: "COSMIC",
      icon: Database,
      color: "text-red-400",
    },
    {
      label: "Network Uptime",
      value: "100%",
      icon: BarChart3,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background matrix-bg">
      {/* Navigation */}
      <nav className="nav-spy">
        <div className="container-spy">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <div className="text-xl font-bold text-gradient-spy font-mono">
                  CLASSIFIED
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  INTELLIGENCE • OPERATIONS
                </div>
              </div>
            </div>

            <Link to="/login">
              <Button className="btn-spy-primary flex items-center gap-2 font-mono">
                <Lock className="h-4 w-4" />
                SECURE ACCESS
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container-spy">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 fade-in-spy">
                <Badge className="mb-6 status-classified-spy font-mono">
                  CLASSIFIED INTELLIGENCE SYSTEM v3.0
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 leading-tight font-mono">
                  SHADOW
                  <span className="text-gradient-spy block">OPERATIONS</span>
                  <span className="text-zinc-300">NETWORK</span>
                </h1>
                <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed font-mono">
                  Ultra-classified mission command platform for coordinating
                  black operations with real-time intelligence, encrypted
                  communications, and quantum-secure protocols.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 slide-up-spy">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="btn-spy-primary px-8 py-6 text-lg hover-lift-spy font-mono"
                  >
                    BREACH SECURITY PERIMETER
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-spy-secondary px-8 py-6 text-lg font-mono"
                  onClick={() =>
                    document
                      .getElementById("intel")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  DECLASSIFIED INTEL
                </Button>
              </div>

              {/* Classified Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="card-spy hover-lift-spy border-green-500/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <stat.icon
                        className={`h-6 w-6 ${stat.color} mx-auto mb-2`}
                      />
                      <div className="text-lg font-bold text-green-300 font-mono">
                        {stat.value}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix Background Effects */}
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/2 -left-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </section>

        {/* Intelligence Features Section */}
        <section id="intel" className="py-24 bg-zinc-900/30">
          <div className="container-spy">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-green-300 mb-4 font-mono">
                CLASSIFIED CAPABILITIES
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-mono">
                Advanced operational systems for executing covert missions with
                military precision and absolute security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="card-spy hover-lift-spy fade-in-spy border-green-500/20"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardHeader>
                    <feature.icon
                      className={`h-12 w-12 ${feature.color} mb-4`}
                    />
                    <CardTitle className="text-green-300 text-xl font-mono">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-400 text-base leading-relaxed font-mono">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Access Terminal Section */}
        <section className="py-24">
          <div className="container-spy">
            <div className="max-w-4xl mx-auto">
              <Card className="card-elevated border-green-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-green-300 text-3xl mb-2 flex items-center justify-center gap-2 font-mono">
                    <Radar className="h-8 w-8 text-green-400" />
                    SECURE ACCESS TERMINAL
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-lg font-mono">
                    High-security clearance required for classified operations
                    access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="card-spy border-red-500/30">
                      <CardContent className="p-6">
                        <h4 className="text-green-300 font-bold mb-4 flex items-center gap-2 font-mono">
                          <Shield className="h-5 w-5 text-red-400" />
                          COMMANDER ACCESS
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-mono">
                              AGENT ID:
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono status-failed-spy"
                            >
                              admin
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-mono">
                              SECURITY KEY:
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono status-failed-spy"
                            >
                              admin123
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                          <p className="text-xs text-red-300 font-mono">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            CLEARANCE LEVEL 5 • ALL OPERATIONS ACCESS
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-spy border-amber-500/30">
                      <CardContent className="p-6">
                        <h4 className="text-green-300 font-bold mb-4 flex items-center gap-2 font-mono">
                          <Eye className="h-5 w-5 text-amber-400" />
                          OPERATIVE ACCESS
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-mono">
                              AGENT ID:
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono status-pending-spy"
                            >
                              operator
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-mono">
                              SECURITY KEY:
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono status-pending-spy"
                            >
                              operator123
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                          <p className="text-xs text-amber-300 font-mono">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            CLEARANCE LEVEL 2 • READ-ONLY ACCESS
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Link to="/login">
                      <Button
                        size="lg"
                        className="btn-spy-primary px-12 py-6 text-lg hover-lift-spy font-mono"
                      >
                        INITIATE SECURE LOGIN
                        <Crosshair className="ml-2 h-6 w-6" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-green-500/20 bg-zinc-900/50">
          <div className="container-spy text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold text-green-300 font-mono">
                CLASSIFIED INTELLIGENCE
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-2 font-mono">
              Ultra-classified mission management system for black operations
            </p>
            <p className="text-zinc-500 text-xs font-mono">
              Built with quantum encryption and neural network architecture
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-500 font-mono">
                SECURE CONNECTION ACTIVE
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
