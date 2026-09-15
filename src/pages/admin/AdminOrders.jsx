import { TRACKING_STEPS, useOrders } from '../../context/OrderContext';
import { formatMoney } from '../../utils/currency';

export default function AdminOrders() {
  const { orders, setStatus } = useOrders();
  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-background/80">
            <tr>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td className="px-4 py-8 text-muted" colSpan={5}>No orders yet.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3 font-semibold">{order.number}</td>
                  <td className="px-4 py-3">{order.customer?.name}</td>
                  <td className="px-4 py-3 capitalize">{order.orderType}</td>
                  <td className="px-4 py-3">{formatMoney(order.totals?.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(event) => setStatus(order.id, event.target.value)}
                      className="rounded-full border px-2 py-1"
                    >
                      {TRACKING_STEPS.map((step) => (
                        <option key={step.id} value={step.id}>{step.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
