import { useState } from 'react';
import { Order, Position } from '../types/orders';
import orderService from '../services/orderService';
import tradingService from '../services/tradingService';
import riskManagementService from '../services/riskManagementService';

export function useTrading() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = (order: Order) => {
    orderService.placeOrder(order);
    setOrders(prev => [...prev, order]);
  };

  const updateMarketData = (marketPrices: { [asset: string]: number }) => {
    // Check pending orders
    Object.values(marketPrices).forEach(price => orderService.checkPendingOrders(price));

    // Update positions
    const updatedPositions = positions.map(p => tradingService.updatePosition(p, marketPrices[p.asset]));
    setPositions(updatedPositions);

    // Check TP/SL
    riskManagementService.checkPositions(updatedPositions, marketPrices);
  };

  return { positions, orders, placeOrder, updateMarketData };
}
