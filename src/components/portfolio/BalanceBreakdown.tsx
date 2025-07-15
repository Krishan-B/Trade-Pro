
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceBreakdownProps {
  cashBalance: number;
  lockedFunds: number;
  totalValue: number;
  marginLevel: number;
}

const BalanceBreakdown = ({
  cashBalance,
  lockedFunds,
  totalValue,
  marginLevel
}: BalanceBreakdownProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Balance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cash:</span>
            <span className="font-medium">${cashBalance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Locked Funds:</span>
            <span className="font-medium">${lockedFunds.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Investments:</span>
            <span className="font-medium">${totalValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin Level:</span>
            <span className="font-medium">{marginLevel.toFixed(2)}%</span>
          </div>
          <div className="pt-2 border-t flex justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold">${(cashBalance + lockedFunds + totalValue).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceBreakdown;
