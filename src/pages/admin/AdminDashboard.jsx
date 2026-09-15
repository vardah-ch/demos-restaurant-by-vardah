import { useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatMoney } from '../../utils/currency';

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { reviews } = useRestaurant();
  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
    const pending = orders.filter((order) => !['delivered'].includes(order.status)).length;
    const customers = new Set(orders.map((order) => order.customer?.email)).size;
    return { revenue, pending, customers, count: orders.length };
  }, [orders]);

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Orders" value={stats.count} />
        <Card label="Revenue" value={formatMoney(stats.revenue)} />
        <Card label="Customers" value={stats.customers} />
        <Card label="Pending orders" value={stats.pending} />
      </div>
      <p className="mt-6 text-sm text-muted">{reviews.filter((r) => r.status === 'pending').length} reviews awaiting moderation.</p>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
