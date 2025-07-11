import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorHandler } from "@/services/errorHandling";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  AlertTriangle,
  Bell,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface MarketAlert {
  id: string;
  type: string;
  symbol: string;
  name: string;
  message: string;
  importance: string;
  created_at: string;
}

interface MarketAlertsResponse {
  data: MarketAlert[];
}

const AlertsWidget = () => {
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);

      // Define the expected response type for the Supabase function

      const {
        data,
        error,
      }: { data: MarketAlertsResponse | null; error: Error | null } =
        await supabase.functions.invoke<MarketAlertsResponse>("market-alerts", {
          method: "POST",
          body: {},
        });

      if (error) throw error;

      // Now `data` is typed, and `data.data` is known to be MarketAlert[] or undefined
      if (data?.data) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error("Error fetching market alerts:", error);
      ErrorHandler.handleError(
        ErrorHandler.createError({
          code: "data_fetch_error",
          message: "Failed to load market alerts.",
        }),
        {
          retryFn: fetchAlerts,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_movement":
        return <Activity className="h-4 w-4" />;
      case "technical":
        return <TrendingUp className="h-4 w-4" />;
      case "news":
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Market Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Market Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No alerts at this time
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.map((alert) => (
                <li key={alert.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-full p-1.5 ${
                        alert.importance === "high"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium flex items-center gap-2">
                          {alert.name} ({alert.symbol})
                          {alert.importance === "high" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] h-5"
                            >
                              Important
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsWidget;
