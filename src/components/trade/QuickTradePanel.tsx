// TEMP STUB: Replace with real implementation
type AssetType = {
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  market_type: string;
};
const QuickTradePanel = ({ asset }: { asset: AssetType }) => (
  <div>QuickTradePanel (stub) - Asset: {asset.name}</div>
);
export default QuickTradePanel;
