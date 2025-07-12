import React from 'react';
import { useTradingContext } from '../hooks/useTradingContext';
import { Order } from '../types/orders';

const TradingComponent: React.FC = () => {
  const { positions, orders, placeOrder, updateMarketData } = useTradingContext();

  const handlePlaceOrder = (type: Order['type']) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      asset: 'EUR/USD',
      type,
      side: 'Buy',
      quantity: 1000,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      price: type === 'Limit' ? 1.20 : undefined,
      stopPrice: type === 'Stop' ? 1.22 : undefined,
      trailingDistance: type === 'Trailing Stop' ? 0.01 : undefined,
    };
    placeOrder(newOrder);
  };

  const handleUpdateMarket = () => {
    updateMarketData({ 'EUR/USD': 1.21 });
  };

  return (
    <div>
      <h1>Trading Component</h1>
      <button onClick={() => handlePlaceOrder('Market')}>Place Market Order</button>
      <button onClick={() => handlePlaceOrder('Limit')}>Place Limit Order</button>
      <button onClick={() => handlePlaceOrder('Stop')}>Place Stop Order</button>
      <button onClick={() => handlePlaceOrder('Trailing Stop')}>Place Trailing Stop Order</button>
      <button onClick={handleUpdateMarket}>Update Market Price</button>
      <h2>Positions</h2>
      <pre>{JSON.stringify(positions, null, 2)}</pre>
      <h2>Orders</h2>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
};

export default TradingComponent;
