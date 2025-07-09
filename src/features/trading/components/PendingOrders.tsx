import React from "react";
import Spinner from "./Spinner";

interface PendingOrder {
  id: string;
  price: number;
  units: number;
  createdAt: string;
}

export default function PendingOrders() {
  const [orders] = React.useState<PendingOrder[]>([]);
  const [loading] = React.useState(false);

  const filteredOrders = React.useMemo(() => {
    return orders;
  }, [orders]);

  if (loading) return <Spinner />;

  return (
    <div>
      {filteredOrders.map((order) => (
        <div key={order.id}>{/* Order display implementation */}</div>
      ))}
    </div>
  );
}
