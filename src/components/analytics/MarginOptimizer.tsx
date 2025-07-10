import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { useLeverage } from "@/hooks/useLeverage";
import { AlertTriangle, Settings, Target, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface OptimizationSuggestion {
  id: string;
  assetClass: string;
  currentLeverage: number;
  suggestedLeverage: number;
  potentialSavings: number;
  riskReduction: number;
  confidence: number;
  reasoning: string;
}

interface OptimizerSettings {
  riskTolerance: number;
  marginEfficiencyTarget: number;
  diversificationEnabled: boolean;
  correlationAdjustment: boolean;
}

interface AssetGroupData {
  totalMargin: number;
  avgLeverage: number;
  positions: number;
  maxLeverage: number;
}

type AssetGroups = Record<string, AssetGroupData>;

const MarginOptimizer: React.FC = () => {
  const { marginCalculations } = useLeverage();
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [settings, setSettings] = useState<OptimizerSettings>({
    riskTolerance: 50,
    marginEfficiencyTarget: 80,
    diversificationEnabled: true,
    correlationAdjustment: false,
  });
  const [loading, setLoading] = useState(false);
  const [appliedOptimizations, setAppliedOptimizations] = useState<Set<string>>(
    new Set(),
  );

  const generateOptimizationSuggestions = useCallback(() => {
    const newSuggestions: OptimizationSuggestion[] = [];

    // Generate suggestions based on current positions and settings
    const assetGroups = marginCalculations.reduce<AssetGroups>((acc, calc) => {
      const assetClass = "crypto"; // This would come from position data
      if (!acc[assetClass]) {
        acc[assetClass] = {
          totalMargin: 0,
          avgLeverage: 0,
          positions: 0,
          maxLeverage: 10,
        };
      }
      acc[assetClass].totalMargin += calc.used_margin;
      acc[assetClass].avgLeverage += calc.leverage_used;
      acc[assetClass].positions += 1;
      return acc;
    }, {});

    // Process each asset group to generate optimization suggestions
    Object.entries(assetGroups).forEach(([assetClass, group]) => {
      const avgLeverage = group.avgLeverage / group.positions;

      // Calculate optimal leverage based on risk tolerance
      const optimalLeverage = Math.min(
        group.maxLeverage,
        (avgLeverage * settings.riskTolerance) / 100,
      );

      if (Math.abs(avgLeverage - optimalLeverage) > 0.5) {
        const potentialSavings =
          group.totalMargin * (Math.abs(avgLeverage - optimalLeverage) / 100);
        const riskReduction =
          ((avgLeverage - optimalLeverage) / avgLeverage) * 100;

        newSuggestions.push({
          id: `${assetClass}-${Date.now()}`,
          assetClass,
          currentLeverage: avgLeverage,
          suggestedLeverage: optimalLeverage,
          potentialSavings,
          riskReduction: Math.max(0, riskReduction),
          confidence: Math.min(100, settings.riskTolerance),
          reasoning: `Adjusting leverage from ${avgLeverage.toFixed(
            1,
          )}x to ${optimalLeverage.toFixed(
            1,
          )}x based on risk tolerance and market conditions`,
        });
      }
    });

    setSuggestions(newSuggestions);
  }, [marginCalculations, settings]);

  useEffect(() => {
    generateOptimizationSuggestions();
  }, [generateOptimizationSuggestions]);

  const handleApplyOptimization = (suggestionId: string) => {
    setAppliedOptimizations((prev) => {
      const next = new Set(prev);
      next.add(suggestionId);
      return next;
    });
  };

  const renderSuggestion = (suggestion: OptimizationSuggestion) => (
    <Card key={suggestion.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{suggestion.assetClass} Position Optimization</span>
          <Badge
            variant={suggestion.riskReduction > 20 ? "destructive" : "default"}
          >
            {suggestion.riskReduction.toFixed(1)}% Risk Reduction
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Leverage:</span>
            <Badge variant="outline">
              {suggestion.currentLeverage.toFixed(1)}x
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Suggested Leverage:</span>
            <Badge variant="outline">
              {suggestion.suggestedLeverage.toFixed(1)}x
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Potential Margin Savings:</span>
            <Badge variant="outline">
              ${suggestion.potentialSavings.toFixed(2)}
            </Badge>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{suggestion.reasoning}</AlertDescription>
          </Alert>
          <Button
            className="w-full"
            onClick={() => {
              handleApplyOptimization(suggestion.id);
            }}
            disabled={appliedOptimizations.has(suggestion.id)}
          >
            {appliedOptimizations.has(suggestion.id)
              ? "Optimization Applied"
              : "Apply Optimization"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Margin Optimizer</h2>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : suggestions.length > 0 ? (
        <div>{suggestions.map(renderSuggestion)}</div>
      ) : (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>No optimization suggestions available</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarginOptimizer;
