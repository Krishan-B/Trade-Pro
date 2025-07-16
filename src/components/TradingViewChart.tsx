
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol = "BINANCE:BTCUSDT" }) => {
  const chartIframe = (
    <iframe
      title="Trading Chart"
      src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${symbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=exchange&withdateranges=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart`}
      style={{ width: '100%', height: '100%' }}
    />
  );

  return (
    <div className="h-[500px] w-full relative z-10">
      <div className="hidden md:block h-full w-full">
        {chartIframe}
      </div>
      <div className="md:hidden h-full w-full">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <Button variant="secondary" className="gap-2">
                  <Expand className="h-4 w-4" />
                  Tap to Enlarge
                </Button>
              </div>
              <div className="absolute inset-0 blur-sm">
                {chartIframe}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 border-0">
            <div className="h-screen w-screen">
              {chartIframe}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TradingViewChart;
