import { Order, Position } from '../types/orders';

export class TradingService {
  executeOrder(order: Order, accountBalance: number, marketPrice: number): Position | null {
    const { quantity, side, type, price, stopPrice } = order;

    // Basic validation
    if (quantity <= 0) {
      console.error('Order quantity must be positive.');
      return null;
    }

    // Slippage simulation (e.g., 0.05% of market price)
    const slippage = marketPrice * 0.0005 * (Math.random() - 0.5);
    const executionPrice = marketPrice + slippage;

    // Margin calculation (e.g., 5% margin requirement)
    const marginRequired = executionPrice * quantity * 0.05;

    if (accountBalance < marginRequired) {
      console.error('Insufficient margin.');
      return null;
    }

    // Risk checks (e.g., max exposure)
    const maxExposure = 10000; // Example max exposure
    if (executionPrice * quantity > maxExposure) {
      console.error('Order exceeds maximum exposure limit.');
      return null;
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      asset: order.asset,
      side: side === 'Buy' ? 'Long' : 'Short',
      quantity,
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      unrealizedPnl: 0,
      leverage: 20, // Example leverage
      margin: marginRequired,
    };

    console.log('Order executed, new position:', newPosition);
    return newPosition;
  }

  updatePosition(position: Position, marketPrice: number): Position {
    const { entryPrice, quantity, side } = position;
    const pnl = (marketPrice - entryPrice) * quantity * (side === 'Long' ? 1 : -1);

    const updatedPosition = { ...position, currentPrice: marketPrice, unrealizedPnl: pnl };

    // Margin call check (e.g., if margin level drops below 20%)
    const marginLevel = (position.margin + pnl) / position.margin;
    if (marginLevel < 0.2) {
      console.warn(`Margin call for position ${position.id}! Margin level is at ${marginLevel * 100}%`);
    }

    return updatedPosition;
  }
}

export default new TradingService();
