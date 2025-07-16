import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, StarIcon } from "lucide-react";
import { TradeButton } from "@/components/trade";
import { Card, CardContent } from "@/components/ui/card";

interface Asset {
  id?: string;
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  volume: string;
  market_type: string;
  market_cap?: string;
}

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

const AssetCard = ({ asset, onSelect }: AssetCardProps) => {
  return (
    <Card className="mb-2" onClick={() => onSelect(asset)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="font-bold">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.symbol}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{asset.market_type}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-lg">${typeof asset.price === 'number' ? asset.price.toLocaleString() : asset.price}</p>
            <span
              className={`flex items-center gap-1 justify-end text-sm ${
                asset.change_percentage >= 0 ? "text-success" : "text-warning"
              }`}
            >
              {asset.change_percentage >= 0 ? (
                <ArrowUpIcon className="w-4 h-4" />
              ) : (
                <ArrowDownIcon className="w-4 h-4" />
              )}
              {Math.abs(asset.change_percentage).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            <p>Vol: {asset.volume}</p>
          </div>
          <TradeButton size="sm" variant="outline" className="h-8 px-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;