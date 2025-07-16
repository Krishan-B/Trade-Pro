import React from 'react';
import { TradeForm } from '@/components/trade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TradingViewChart from '@/components/TradingViewChart';
import OrderBook from '@/components/trade/OrderBook';

const TradingPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Trading</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingViewChart />
        </div>
        <div className="lg:col-span-1">
          <TradeForm />
        </div>
        <div className="lg:col-span-3">
          <OrderBook />
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
