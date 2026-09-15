import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { EmptyState, LoadingState } from '../components/common/States';
import { Seo } from '../components/common/Seo';
import { PICKUP_STEPS, TRACKING_STEPS, useOrders } from '../context/OrderContext';
import { useRestaurant } from '../context/RestaurantContext';

const DEMO_FLOW = ['received', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { findOrder, setStatus } = useOrders();
  const { restaurant } = useRestaurant();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findOrder(orderId).then((result) => {
      setOrder(result);
      setLoading(false);
    });
  }, [findOrder, orderId]);

  useEffect(() => {
    if (!order || order.status === 'delivered') return undefined;
    const timer = window.setInterval(() => {
      setOrder((current) => {
        if (!current) return current;
        const flow = current.orderType === 'pickup'
          ? ['received', 'confirmed', 'preparing', 'ready', 'delivered']
          : DEMO_FLOW;
        const idx = flow.indexOf(current.status);
        if (idx === -1 || idx >= flow.length - 1) return current;
        const nextStatus = flow[idx + 1];
        setStatus(current.id, nextStatus);
        return { ...current, status: nextStatus };
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [order, setStatus]);

  const steps = order?.orderType === 'pickup' ? PICKUP_STEPS : TRACKING_STEPS;
  const currentIndex = useMemo(
    () => steps.findIndex((step) => step.id === order?.status),
    [order?.status, steps],
  );

  if (loading) return <LoadingState label="Loading tracking" />;
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="We could not find that order" action={<Button to="/">Home</Button>} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Seo title={`Track ${order.number} | ${restaurant.name}`} />
      <h1 className="font-display text-4xl">Track order {order.number}</h1>
      <p className="mt-2 text-muted">ETA {order.eta}. Status updates here are simulated for the demo and ready for live API patches later.</p>
      <ol className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <li key={step.id} className="flex gap-3">
            <span
              className={`mt-1 h-3 w-3 rounded-full ${index <= currentIndex ? 'bg-primary' : 'bg-primary/20'}`}
            />
            <div>
              <p className="font-semibold">{step.label}</p>
              {index < steps.length - 1 ? <div className="ml-1 mt-2 h-6 w-px bg-primary/20" /> : null}
            </div>
          </li>
        ))}
      </ol>
      <Button to="/" className="mt-8" variant="outline">Home</Button>
    </div>
  );
}
