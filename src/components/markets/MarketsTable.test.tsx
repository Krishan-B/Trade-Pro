import { render, screen } from '@testing-library/react';
import MarketsTable from './MarketsTable';
import { MarketData } from '../../../supabase/functions/get-market-data-new/types';

const mockAssets: MarketData[] = [
  {
    symbol: 'TEST1',
    name: 'Test Asset 1',
    live_price: 100,
    buy_price: 100.025,
    sell_price: 99.975,
    change_percent_24h: 2.5,
    volume: 123456,
    market_type: 'Crypto',
  },
  {
    symbol: 'TEST2',
    name: 'Test Asset 2',
    live_price: 200,
    buy_price: 200.025,
    sell_price: 199.975,
    change_percent_24h: -1.5,
    volume: 654321,
    market_type: 'Crypto',
  },
];

describe('MarketsTable', () => {
  it('renders a table with the correct headers', () => {
    render(<MarketsTable assets={[]} />);
    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
    expect(screen.getByText('24h Change')).toBeInTheDocument();
  });

  it('renders a row for each asset', () => {
    render(<MarketsTable assets={mockAssets} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it('displays the correct data for each asset', () => {
    render(<MarketsTable assets={mockAssets} />);
    expect(screen.getByText('Test Asset 1')).toBeInTheDocument();
    expect(screen.getByText('Test Asset 2')).toBeInTheDocument();
  });
});