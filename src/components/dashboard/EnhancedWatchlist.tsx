import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Star, TrendingUp, X } from 'lucide-react';
import { useWatchlistData } from '@/hooks/useWatchlistData';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface WatchlistAsset {
  id?: string;
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  volume: string;
  market_type: string;
  market_cap?: string;
}

interface EnhancedWatchlistProps {
  onAssetSelect?: (asset: any) => void;
}

const EmptyWatchlistState: React.FC<{ onAddAsset: () => void }> = ({ onAddAsset }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-slate-800 rounded-full p-6 mb-4">
      <Star className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No assets in watchlist</h3>
    <p className="text-muted-foreground mb-6 max-w-sm">
      Add assets to track their performance and get quick access to trading
    </p>
    <Button onClick={onAddAsset} className="gap-2">
      <Plus className="w-4 h-4" />
      Add Asset
    </Button>
  </div>
);

const WatchlistAssetRow: React.FC<{
  asset: WatchlistAsset;
  onSelect: (asset: any) => void;
  onRemove: (symbol: string) => void;
}> = ({ asset, onSelect, onRemove }) => {
  const isPositive = asset.change_percentage >= 0;
  
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer border border-transparent hover:border-slate-700 transition-all duration-200 group"
      onClick={() => onSelect(asset)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">
            {asset.symbol.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">{asset.symbol}</h4>
              <p className="text-xs text-muted-foreground">{asset.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                ${asset.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
              <p className={`text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? '+' : ''}{asset.change_percentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(asset.symbol);
        }}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const AddAssetDialog: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onAddAsset: (asset: WatchlistAsset) => void;
}> = ({ isOpen, onClose, onAddAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock popular assets for demonstration
  const popularAssets: WatchlistAsset[] = [
    { name: 'Bitcoin', symbol: 'BTCUSD', price: 67543, change_percentage: 2.4, volume: '1.2B', market_type: 'Crypto' },
    { name: 'Ethereum', symbol: 'ETHUSD', price: 3211, change_percentage: -1.2, volume: '800M', market_type: 'Crypto' },
    { name: 'Apple Inc', symbol: 'AAPL', price: 178.32, change_percentage: 0.8, volume: '45M', market_type: 'Stock' },
    { name: 'Tesla Inc', symbol: 'TSLA', price: 248.50, change_percentage: -2.1, volume: '98M', market_type: 'Stock' },
  ];

  const filteredAssets = popularAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Asset to Watchlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer border border-transparent hover:border-slate-700"
                onClick={() => {
                  onAddAsset(asset);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {asset.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{asset.symbol}</h4>
                    <p className="text-xs text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EnhancedWatchlist: React.FC<EnhancedWatchlistProps> = ({ onAssetSelect }) => {
  const { watchlist, isLoading } = useWatchlistData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAssetSelect = (asset: WatchlistAsset) => {
    if (onAssetSelect) {
      onAssetSelect({
        name: asset.name,
        symbol: asset.symbol,
        price: asset.price,
        change_percentage: asset.change_percentage,
        change: asset.change_percentage,
        market_type: asset.market_type,
        live_price: asset.price,
        buy_price: asset.price,
        sell_price: asset.price,
        change_percent_24h: asset.change_percentage,
        volume: parseFloat(asset.volume.replace(/[^\d.]/g, '')) || 1000000,
      });
    }
  };

  const handleRemoveAsset = (symbol: string) => {
    // This would typically call a remove function from the watchlist hook
    console.log('Remove asset:', symbol);
  };

  const handleAddAsset = (asset: WatchlistAsset) => {
    // This would typically call an add function from the watchlist hook
    console.log('Add asset:', asset);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Watchlist</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
        </div>

        {watchlist.length === 0 ? (
          <EmptyWatchlistState onAddAsset={() => setIsAddDialogOpen(true)} />
        ) : (
          <div className="space-y-2">
            {watchlist.map((asset) => (
              <WatchlistAssetRow
                key={asset.symbol}
                asset={asset}
                onSelect={handleAssetSelect}
                onRemove={handleRemoveAsset}
              />
            ))}
          </div>
        )}
      </div>

      <AddAssetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddAsset={handleAddAsset}
      />
    </>
  );
};

export default EnhancedWatchlist;