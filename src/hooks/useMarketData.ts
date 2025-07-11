import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorHandler } from "@/services/errorHandling";

export interface Asset {
  id?: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change_percentage: number;
  volume: string;
  market_cap?: string;
  market_type: string;
}

interface UseMarketDataOptions {
  refetchInterval?: number;
  initialData?: Asset;
  enableRefresh?: boolean;
}

export const useMarketData = (
  marketType: string | string[],
  options: UseMarketDataOptions = {}
) => {
  const {
    refetchInterval = 1000 * 60 * 5, // 5 minutes default
    initialData = [],
    enableRefresh = true,
  } = options;

  // Function to fetch market data from Supabase
  const fetchMarketData = async (
    marketTypes: string | string[]
  ): Promise<Asset[]> => {
    try {
      // Convert single market type to array for consistent handling
      const marketTypeArray = Array.isArray(marketTypes)
        ? marketTypes
        : [marketTypes];

      // First check if we already have recent data in our database
      const { data: existingData, error: fetchError } = await supabase
        .from("market_data")
        .select("*")
        .in("market_type", marketTypeArray)
        .gt("last_updated", new Date(Date.now() - 60000 * 15).toISOString()); // Data not older than 15 minutes

      if (fetchError) {
        throw ErrorHandler.createError({
          code: "data_fetch_error",
          message: `Database error: ${fetchError.message}`,
          details: fetchError,
        });
      }

      // If we have enough recent data (at least 3 items per market type), use it
      const minExpectedItems = marketTypeArray.length * 3;
      if (existingData && existingData.length >= minExpectedItems) {
        console.log(
          `Using cached data for ${marketTypeArray.join(", ")}`,
          existingData
        );
        return existingData;
      }

      console.log(`Fetching fresh data for ${marketTypeArray.join(", ")}`);

      // Otherwise, call our edge functions to get fresh data for each market type
      const dataPromises = marketTypeArray.map(async (type) => {
        const { data, error } = await supabase.functions.invoke(
          "fetch-market-data",
          {
            body: { market: type },
          }
        );

        if (error) {
          throw ErrorHandler.createError({
            code: "market_data_fetch_error",
            message: `Failed to fetch ${type} market data: ${error.message}`,
            details: error,
            retryable: true,
          });
        }

        return data?.data || [];
      });

      try {
        // Wait for all edge function calls to complete
        const results = await Promise.all(dataPromises);

        // Flatten the array of arrays into a single array
        const combinedData = results.flat();
        console.log(
          `Fetched ${combinedData.length} total assets for ${marketTypeArray.join(", ")}`
        );

        return combinedData;
      } catch (error) {
        throw ErrorHandler.createError({
          code: "market_data_aggregation_error",
          message: "Failed to fetch data from one or more markets",
          details: error,
          retryable: true,
        });
      }
    } catch (error) {
      ErrorHandler.handleError(error, {
        description: "Some market data may be delayed or unavailable",
        retryFn: () => {
          return fetchMarketData(marketTypes).then(() => {});
        },
        actionLabel: "Retry",
      });
      return initialData;
    }
  };

  // Use ReactQuery to manage data fetching
  const {
    data = initialData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["market-data", marketType],
    queryFn: () => fetchMarketData(marketType),
    refetchOnWindowFocus: false,
    staleTime: refetchInterval,
    enabled: enableRefresh,
  });

  return {
    data,
    isLoading,
    error: error,
    refetch,
    isFetching,
  };
};
