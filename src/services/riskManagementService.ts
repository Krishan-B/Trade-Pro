import { Position } from '../types/orders';
import tradingService from './tradingService';

class RiskManagementService {
  checkPositions(positions: Position[], marketPrices: { [asset: string]: number }) {
    positions.forEach(position => {
      const marketPrice = marketPrices[position.asset];
      if (!marketPrice) return;

      let shouldClose = false;
      if (position.takeProfit) {
        if ((position.side === 'Long' && marketPrice >= position.takeProfit) || (position.side === 'Short' && marketPrice <= position.takeProfit)) {
          shouldClose = true;
        }
      }

      if (position.stopLoss) {
        if ((position.side === 'Long' && marketPrice <= position.stopLoss) || (position.side === 'Short' && marketPrice >= position.stopLoss)) {
          shouldClose = true;
        }
      }

      if (shouldClose) {
        // This is a simplified closing logic. In a real scenario, you would create a market order to close the position.
        console.log(`Closing position ${position.id} due to TP/SL.`);
        // tradingService.closePosition(position.id);
      }
    });
  }
}

export default new RiskManagementService();
