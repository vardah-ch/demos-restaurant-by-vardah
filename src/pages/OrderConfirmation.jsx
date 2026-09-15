import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { EmptyState, LoadingState } from '../components/common/States';
import { Seo } from '../components/common/Seo';
import { useOrders } from '../context/OrderContext';
import { useRestaurant } from '../context/RestaurantContext';
import { formatMoney } from '../utils/currency';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { findOrder } = useOrders();
  const { restaurant } = useRestaurant();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findOrder(orderId).then((result) => {
      setOrder(result);
      setLoading(false);
    });
  }, [findOrder, orderId]);

  if (loading) return <LoadingState label="Finding your order" />;
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Order not found" description="Check the order number and try tracking again." action={<Button to="/">Home</Button>} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <Seo title={`Order ${order.number} | ${restaurant.name}`} />
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Thank you</p>
      <h1 className="mt-2 font-display text-4xl">Order confirmed</h1>
      <p className="mt-3 text-muted">Order {order.number} is in. Estimated time: {order.eta}.</p>
      <p className="mt-1 text-sm">Status: {order.status.replaceAll('_', ' ')}</p>
      <ul className="mt-8 space-y-2 rounded-3xl bg-white p-6 text-left text-sm shadow-soft">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.quantity}× {item.product.name}</span>
            <span>{formatMoney((item.product.price || 0) * item.quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t pt-3 font-semibold">
          <span>Total</span>
          <span>{formatMoney(order.totals.total)}</span>
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to={`/track/${order.number}`}>Track order</Button>
        <Button to="/" variant="outline">Return home</Button>
      </div>
    </div>
  );
}
