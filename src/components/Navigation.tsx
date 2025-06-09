import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMissions } from "@/contexts/MissionContext";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import {
  Shield,
  LayoutDashboard,
  Plus,
  LogOut,
  User,
  Activity,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { missions } = useMissions();
  const location = useLocation();

  const activeMissionsCount = missions.filter((m) => {
    const assignedToArray = Array.isArray(m.assignedTo)
      ? m.assignedTo
      : [m.assignedTo].filter(Boolean);
    return m.status === "active";
  }).length;

  const urgentMissionsCount = missions.filter(
    (m) =>
      (m.priority === "critical" || m.priority === "high") &&
      m.status === "active",
  ).length;

  const navItems = [
    {
      href: "/dashboard",
      label: "Command Center",
      icon: LayoutDashboard,
      badge: activeMissionsCount > 0 ? activeMissionsCount : undefined,
    },
    {
      href: "/create-mission",
      label: "Deploy Mission",
      icon: Plus,
      adminOnly: true,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="main-nav sticky top-0 z-50">
      <div className="main-container">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-3 mr-8 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-green-500 to-green-600">
                  <Shield className="h-6 w-6 text-black" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-green-400 font-mono">
                  CLASSIFIED
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  INTELLIGENCE • OPERATIONS
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                if (item.adminOnly && user?.role !== "admin") return null;

                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={cn(
                        "flex items-center gap-2 relative group font-mono",
                        isActive(item.href)
                          ? "primary-button shadow-lg"
                          : "ghost-button",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-1 status-active animate-pulse font-mono">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Dropdown */}
            <NotificationDropdown />
            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2 content-card">
              <div className="user-avatar w-8 h-8">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-green-300 font-mono">
                  {user?.fullName || user?.username?.toUpperCase()}
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                  <Activity className="h-3 w-3" />
                  {user?.department?.toUpperCase()} •{" "}
                  {user?.role?.toUpperCase()}
                </div>
              </div>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="danger-button font-mono"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-green-500/20 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex justify-around py-3">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== "admin") return null;

              return (
                <Link key={item.href} to={item.href} className="flex-1">
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={cn(
                      "w-full flex flex-col items-center gap-1 h-auto py-2 font-mono",
                      isActive(item.href)
                        ? "primary-button text-black"
                        : "text-zinc-400",
                    )}
                    size="sm"
                  >
                    <div className="relative">
                      <item.icon className="h-5 w-5" />
                      {item.badge && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs status-active">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mission Status Bar */}
        {activeMissionsCount > 0 && (
          <div className="hidden md:block border-t border-green-500/20 bg-zinc-900/30">
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-green-400 animate-pulse" />
                  <span className="text-green-400">ACTIVE OPERATIONS:</span>
                  <span className="text-green-300 font-bold">
                    {activeMissionsCount}
                  </span>
                </div>
                {urgentMissionsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400">HIGH PRIORITY:</span>
                    <span className="text-red-300 font-bold">
                      {urgentMissionsCount}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-blue-400">CLEARANCE:</span>
                  <span className="text-blue-300 font-bold">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
