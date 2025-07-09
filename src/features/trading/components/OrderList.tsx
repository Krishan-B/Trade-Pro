import React from "react";
import Spinner from "./Spinner";

interface Order {
  id: string;
  // Order classification
  order_type?: string;
  status?: "open" | "closed" | "pending" | "cancelled";
  side?: "buy" | "sell";

  // Price info
  price?: number;
  orderRate?: number;
  openRate?: number;
  closeRate?: number;
  stopLoss?: number;
  takeProfit?: number;

  // Size info
  quantity?: number;
  units?: number;
  amount?: number;
  leverage?: number;

  // Timestamps
  created_at?: string;
  date?: string;
  orderDate?: string;
  openDate?: string;
  closeDate?: string;
  expiryDate?: string;

  // Additional metadata
  symbol?: string;
  pair?: string;
  exchange?: string;
  position_id?: string;
  client_order_id?: string;
}

function getOrderType(o: Order): string {
  if (o.order_type) return o.order_type;
  if (o.orderRate) return "entry";
  if (o.openRate) return "market";
  return "-";
}

function getQuantity(o: Order): number | string {
  if (o.quantity) return o.quantity;
  if (o.units) return o.units;
  if (o.amount) return o.amount;
  return "-";
}

function getPrice(o: Order): number | string {
  if (o.price != null) return o.price;
  if (o.orderRate != null) return o.orderRate;
  if (o.openRate != null) return o.openRate;
  return "-";
}

function getCreatedAt(o: Order): string {
  if (o.created_at) return new Date(o.created_at).toLocaleString();
  if (o.date) return new Date(o.date).toLocaleString();
  if (o.orderDate) return new Date(o.orderDate).toLocaleString();
  if (o.openDate) return new Date(o.openDate).toLocaleString();
  return "-";
}

export default function OrderList() {
  const [orders] = React.useState<Order[]>([]);
  const [loading] = React.useState(false);
  const [filter] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const pageSize = 20;

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((o) => {
        if (!filter) return true;
        const searchStr = filter.toLowerCase();
        return (
          getOrderType(o).toLowerCase().includes(searchStr) ||
          String(getQuantity(o)).toLowerCase().includes(searchStr) ||
          String(getPrice(o)).toLowerCase().includes(searchStr)
        );
      })
      .slice(0, pageSize);
  }, [orders, filter]);

  if (loading) return <Spinner />;

  return (
    <div>
      {filteredOrders.map((order) => (
        <div key={order.id} className="order-item">
          <div className="order-details">
            <span>Type: {getOrderType(order)}</span>
            <span>Quantity: {getQuantity(order)}</span>
            <span>Price: {getPrice(order)}</span>
            <span>Created: {getCreatedAt(order)}</span>
          </div>
          <button
            onClick={() =>
              setExpandedId(order.id === expandedId ? null : order.id)
            }
          >
            {order.id === expandedId ? "Less" : "More"}
          </button>
          {order.id === expandedId && (
            <div className="expanded-details">
              {order.status && <span>Status: {order.status}</span>}
              {order.side && <span>Side: {order.side}</span>}
              {order.symbol && <span>Symbol: {order.symbol}</span>}
              {order.leverage && <span>Leverage: {order.leverage}x</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
