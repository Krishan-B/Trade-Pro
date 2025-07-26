import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Info,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedQuickTradePanelProps {
  asset?: {
    name: string;
    symbol: string;
    price: number;
    change_percentage: number;
    market_type: string;
    buy_price?: number;
    sell_price?: number;
  };
}

const EnhancedQuickTradePanel: React.FC<EnhancedQuickTradePanelProps> = ({ asset }) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const { toast } = useToast();

  const selectedAsset = asset || {
    name: 'Bitcoin',
    symbol: 'BTCUSD',
    price: 67543.21,
    change_percentage: 2.4,
    market_type: 'Crypto',
    buy_price: 67543.21,
    sell_price: 67540.18,
  };

  const currentPrice = tradeType === 'buy' ? selectedAsset.buy_price || selectedAsset.price : selectedAsset.sell_price || selectedAsset.price;
  const spread = Math.abs((selectedAsset.buy_price || selectedAsset.price) - (selectedAsset.sell_price || selectedAsset.price));
  const calculatedValue = parseFloat(amount) * currentPrice || 0;
  const leverageMultiplier = parseFloat(leverage);
  const marginRequired = calculatedValue / leverageMultiplier;

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to trade",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `${tradeType.toUpperCase()} Order Placed`,
      description: `${amount} ${selectedAsset.symbol} at $${currentPrice.toFixed(2)}`,
    });

    // Reset form
    setAmount('');
    setStopLoss('');
    setTakeProfit('');
  };

  const quickAmounts = [0.01, 0.1, 0.5, 1.0];

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Quick Trade</h2>
        <Badge variant="secondary" className="text-xs">
          {selectedAsset.market_type}
        </Badge>
      </div>

      {/* Asset Info */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{selectedAsset.symbol}</h3>
          <div className={`flex items-center space-x-1 ${selectedAsset.change_percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
            {selectedAsset.change_percentage >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="text-sm font-medium">
              {selectedAsset.change_percentage >= 0 ? '+' : ''}{selectedAsset.change_percentage.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-muted-foreground">Buy: </span>
              <span className="font-medium text-success">
                ${(selectedAsset.buy_price || selectedAsset.price).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Sell: </span>
              <span className="font-medium text-destructive">
                ${(selectedAsset.sell_price || selectedAsset.price).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Spread: {spread.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Trade Direction Tabs */}
      <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'buy' | 'sell')} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="text-success data-[state=active]:bg-success/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-destructive data-[state=active]:bg-destructive/20">
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Order Form */}
      <div className="space-y-4">
        {/* Order Type */}
        <div className="space-y-2">
          <Label htmlFor="orderType" className="text-sm font-medium">Order Type</Label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger id="orderType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market Order</SelectItem>
              <SelectItem value="limit">Limit Order</SelectItem>
              <SelectItem value="stop">Stop Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
          <div className="space-y-2">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-right"
            />
            <div className="flex space-x-1">
              {quickAmounts.map((qty) => (
                <Button
                  key={qty}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(qty.toString())}
                  className="flex-1 text-xs"
                >
                  {qty}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Leverage */}
        <div className="space-y-2">
          <Label htmlFor="leverage" className="text-sm font-medium flex items-center space-x-1">
            <span>Leverage</span>
            <Calculator className="w-3 h-3" />
          </Label>
          <Select value={leverage} onValueChange={setLeverage}>
            <SelectTrigger id="leverage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1:1 (No Leverage)</SelectItem>
              <SelectItem value="2">1:2</SelectItem>
              <SelectItem value="5">1:5</SelectItem>
              <SelectItem value="10">1:10</SelectItem>
              <SelectItem value="20">1:20</SelectItem>
              <SelectItem value="50">1:50</SelectItem>
              <SelectItem value="100">1:100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stopLoss" className="text-sm font-medium">Stop Loss</Label>
            <Input
              id="stopLoss"
              type="number"
              placeholder="Optional"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="takeProfit" className="text-sm font-medium">Take Profit</Label>
            <Input
              id="takeProfit"
              type="number"
              placeholder="Optional"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
            />
          </div>
        </div>

        {/* Trade Summary */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Trade Value:</span>
            <span className="font-medium">${calculatedValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Margin Required:</span>
            <span className="font-medium">${marginRequired.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Leverage:</span>
            <span className="font-medium">1:{leverage}</span>
          </div>
          {leverageMultiplier > 1 && (
            <div className="flex items-center space-x-2 text-xs text-orange-400 mt-2">
              <AlertTriangle className="w-3 h-3" />
              <span>High leverage increases both potential profits and losses</span>
            </div>
          )}
        </div>

        {/* Trade Button */}
        <Button
          onClick={handleTrade}
          className={`w-full py-3 font-semibold ${
            tradeType === 'buy' 
              ? 'bg-success hover:bg-success/90 text-white' 
              : 'bg-destructive hover:bg-destructive/90 text-white'
          }`}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
        </Button>

        {/* Risk Warning */}
        <div className="flex items-start space-x-2 p-3 bg-orange-900/10 border border-orange-500/20 rounded-lg">
          <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 
            Make sure you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuickTradePanel;