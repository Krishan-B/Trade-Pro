import React from 'react';
import { useParams } from 'react-router-dom';
import { useRealtimeMarketData } from '@/hooks/useRealtimeMarketData';
import TradingChart from '../components/markets/TradingChart';
import TechnicalIndicators from '../components/markets/TechnicalIndicators';
import OrderForm from '../components/markets/OrderForm';
import OrderBook from '../components/markets/OrderBook';

const TradingPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const marketData = useRealtimeMarketData(symbol);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2">
          <TradingChart data={marketData} />
          <TechnicalIndicators />
        </div>
        <div>
          <OrderForm />
          <OrderBook data={marketData} />
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
