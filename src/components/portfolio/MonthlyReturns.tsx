// ...existing code...
// Update the path below to the correct location of your card components
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { ChartContainer, ChartTooltipContent } from "../../shared/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyData {
  date: string;
  value: number;
}

interface MonthlyReturnsProps {
  data: MonthlyData[];
}

const MonthlyReturns = ({ data }: MonthlyReturnsProps) => {
  const renderTooltipContent = (props: Record<string, unknown>) => {
    if (!("active" in props) || !("payload" in props)) return null;
    const { active, payload } = props as {
      active?: boolean;
      payload?: { name: string; value: number }[];
    };
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <ChartTooltipContent
        {...props}
        indicator="dot"
        formatter={(value, name) => (
          <div className="flex items-center justify-between gap-2">
            <span>{name}</span>
            <span className="font-medium">${value?.toLocaleString()}</span>
          </div>
        )}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Monthly Returns</CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        <ChartContainer config={{ series: {} }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(-6)}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#333"
              />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar
                dataKey="value"
                name="Monthly Value"
                fill="#75C6C3"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyReturns;
