import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { ErrorHandler } from "@/services/errorHandling";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, ChevronDown, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image_url?: string;
  published_at: string;
  market_type: string;
  related_symbols: string[];
  sentiment?: string;
}

interface FetchMarketNewsResponse {
  data: NewsItem[];
}

interface EnhancedNewsWidgetProps {
  marketType?: string;
  className?: string;
}

const EnhancedNewsWidget = ({
  marketType,
  className,
}: EnhancedNewsWidgetProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);

      // Define the expected response type for the Supabase function

      const response = await supabase.functions.invoke<FetchMarketNewsResponse>(
        "fetch-market-news",
        {
          body: { market_type: marketType },
        }
      );

      if (response.error) throw response.error;

      // Now `data` is typed, and `data.data` is known to be NewsItem[] or undefined
      if (response.data?.data) {
        setNews(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching market news:", error);
      ErrorHandler.handleError(
        ErrorHandler.createError({
          code: "news_fetch_error",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred while fetching news.",
          details: error,
          retryable: true,
        }),
        {
          description: "Could not load market news. You can try again.",
          retryFn: fetchNews,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [marketType]);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const pubDate = new Date(timestamp);
    const diffMinutes = Math.floor(
      (now.getTime() - pubDate.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 60) {
      return `${String(diffMinutes)}m ago`;
    } else if (diffMinutes < 24 * 60) {
      return `${String(Math.floor(diffMinutes / 60))}h ago`;
    } else {
      return `${String(Math.floor(diffMinutes / (60 * 24)))}d ago`;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      case "mixed":
      default:
        return "text-amber-500";
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Market News</h3>
          <Button variant="outline" size="sm" className="gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Latest</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {news.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No news available
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {news.map((item) => (
                <li key={item.id} className="p-4 hover:bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">
                        {item.market_type}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{" "}
                        {formatTime(item.published_at)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.source}
                        </span>
                        {item.sentiment && (
                          <span
                            className={`text-xs ${getSentimentColor(
                              item.sentiment
                            )}`}
                          >
                            •{" "}
                            {item.sentiment.charAt(0).toUpperCase() +
                              item.sentiment.slice(1)}
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
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

export default EnhancedNewsWidget;
