import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-900/20 border-green-500/30";
      case "warning":
        return "bg-amber-900/20 border-amber-500/30";
      case "error":
        return "bg-red-900/20 border-red-500/30";
      default:
        return "bg-blue-900/20 border-blue-500/30";
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative btn-spy-ghost">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0 bg-zinc-800 border-green-500/30"
        sideOffset={5}
      >
        <Card className="card-spy border-0 bg-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-green-400 font-mono">
                INTEL ALERTS
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge className="status-active-spy font-mono text-xs">
                    {unreadCount} NEW
                  </Badge>
                )}
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="btn-spy-secondary text-xs font-mono"
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  MARK ALL READ
                </Button>
                <Button
                  onClick={clearNotifications}
                  variant="outline"
                  size="sm"
                  className="btn-spy-secondary text-xs font-mono text-red-400 border-red-500/30"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  CLEAR ALL
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-zinc-400 font-mono text-sm">
                  NO ACTIVE ALERTS
                </p>
                <p className="text-zinc-500 font-mono text-xs">
                  All systems operational
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] custom-scrollbar">
                <div className="space-y-2 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                        getNotificationBg(notification.type),
                        !notification.read && "ring-1 ring-green-500/50",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-green-300 font-mono truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                          </div>

                          <p className="text-xs text-zinc-300 font-mono leading-relaxed mb-2">
                            {notification.message}
                          </p>

                          <p className="text-xs text-zinc-500 font-mono">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
