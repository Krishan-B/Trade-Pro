import { Order } from '../types/orders';
import tradingService from './tradingService';

class OrderService {
  private pendingOrders: Order[] = [];

  placeOrder(order: Order) {
    if (order.type === 'Market') {
      // Assuming a fixed account balance and market price for simplicity
      tradingService.executeOrder(order, 100000, 1.2); 
    } else {
      this.pendingOrders.push(order);
    }
  }

  checkPendingOrders(marketPrice: number) {
    this.pendingOrders.forEach((order, index) => {
      let shouldExecute = false;
      if (order.type === 'Limit' && ((order.side === 'Buy' && marketPrice <= order.price!) || (order.side === 'Sell' && marketPrice >= order.price!))) {
        shouldExecute = true;
      } else if (order.type === 'Stop' && ((order.side === 'Buy' && marketPrice >= order.stopPrice!) || (order.side === 'Sell' && marketPrice <= order.stopPrice!))) {
        shouldExecute = true;
      } else if (order.type === 'Trailing Stop') {
        if (order.side === 'Buy') {
          if (!order.stopPrice || marketPrice - order.trailingDistance! > order.stopPrice) {
            order.stopPrice = marketPrice - order.trailingDistance!;
          }
          if (marketPrice <= order.stopPrice) {
            shouldExecute = true;
          }
        } else { // Sell
          if (!order.stopPrice || marketPrice + order.trailingDistance! < order.stopPrice) {
            order.stopPrice = marketPrice + order.trailingDistance!;
          }
          if (marketPrice >= order.stopPrice) {
            shouldExecute = true;
          }
        }
      }

      if (shouldExecute) {
        // Assuming a fixed account balance for simplicity
        tradingService.executeOrder(order, 100000, marketPrice);
        this.pendingOrders.splice(index, 1);
      }
    });
  }
}

export default new OrderService();
