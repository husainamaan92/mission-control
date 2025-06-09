import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MissionLog } from "@/types/mission";
import { Info, AlertTriangle, XCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorLogProps {
  logs: MissionLog[];
  maxHeight?: string;
  showTitle?: boolean;
}

const getLogIcon = (level: MissionLog["level"]) => {
  switch (level) {
    case "info":
      return <Info className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "error":
      return <XCircle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getLogConfig = (level: MissionLog["level"]) => {
  switch (level) {
    case "info":
      return {
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200",
        border: "border-l-blue-500",
        icon: "text-blue-500",
      };
    case "warning":
      return {
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200",
        border: "border-l-yellow-500",
        icon: "text-yellow-500",
      };
    case "error":
      return {
        badge:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
        border: "border-l-red-500",
        icon: "text-red-500",
      };
    case "success":
      return {
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
        border: "border-l-green-500",
        icon: "text-green-500",
      };
    default:
      return {
        badge:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200",
        border: "border-l-gray-500",
        icon: "text-gray-500",
      };
  }
};

export const ErrorLog: React.FC<ErrorLogProps> = ({
  logs,
  maxHeight = "300px",
  showTitle = true,
}) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Mission Logs
            <Badge variant="outline" className="ml-auto">
              {logs.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No logs recorded yet</p>
              <p className="text-sm">
                Logs will appear here as the mission progresses
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map((log) => {
                const config = getLogConfig(log.level);

                return (
                  <div
                    key={log.id}
                    className={cn(
                      "border-l-4 bg-muted/30 p-3 rounded-r-md",
                      config.border,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5", config.icon)}>
                        {getLogIcon(log.level)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", config.badge)}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm font-medium mb-1">
                          {log.message}
                        </p>

                        {log.details && (
                          <p className="text-xs text-muted-foreground">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
