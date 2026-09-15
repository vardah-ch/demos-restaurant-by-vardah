import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/States';
import { Seo } from '../components/common/Seo';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useToast } from '../context/ToastContext';
import { formatMoney } from '../utils/currency';
import { getOpeningStatus } from '../utils/hours';
import { lineTotal } from '../utils/pricing';

const STEPS = ['Details', 'Fulfillment', 'Summary', 'Payment'];

export default function Checkout() {
  const { restaurant } = useRestaurant();
  const { items, totals, fulfillment, selectedArea, belowMinimum, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { push } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: '',
    payment: fulfillment.orderType === 'pickup' ? 'cop' : 'cod',
  });

  const status = getOpeningStatus(restaurant.hours);
  const payments = restaurant.payments.filter((method) => method.orderTypes.includes(fulfillment.orderType));

  const canNext = useMemo(() => {
    if (step === 0) return form.name.trim() && form.phone.trim() && form.email.includes('@');
    if (step === 1) {
      if (fulfillment.orderType === 'delivery') {
        return Boolean(form.address.trim() && selectedArea?.available);
      }
      return true;
    }
    return true;
  }, [form, fulfillment.orderType, selectedArea, step]);

  const submit = async () => {
    if (!items.length) return;
    if (belowMinimum) {
      setError(`Minimum delivery order is ${formatMoney(restaurant.delivery.minimumOrder)}.`);
      return;
    }
    if (!form.payment) {
      setError('Choose a payment method.');
      return;
    }
    setPending(true);
    setError('');
    try {
      const order = await placeOrder({
        customer: { name: form.name, phone: form.phone, email: form.email },
        orderType: fulfillment.orderType,
        area: selectedArea,
        address: fulfillment.orderType === 'delivery' ? form.address : restaurant.pickup.address,
        instructions: form.instructions,
        payment: form.payment,
        items,
        totals,
        eta: fulfillment.orderType === 'delivery' ? selectedArea?.eta || restaurant.delivery.estimatedTime : restaurant.pickup.estimatedTime,
      });
      clearCart();
      navigate(`/order-confirmation/${order.number}`);
    } catch {
      setError('Checkout failed. Please try again.');
      push('Could not place order', 'error');
    } finally {
      setPending(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Nothing to check out" description="Your cart is empty." action={<Button to="/menu">Browse menu</Button>} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Seo title={`Checkout | ${restaurant.name}`} />
      <h1 className="font-display text-4xl">Checkout</h1>
      {!status.isOpen ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {restaurant.name} looks closed right now. You can still place a demo order.
        </p>
      ) : null}
      <ol className="mt-6 flex gap-2 text-sm">
        {STEPS.map((label, index) => (
          <li key={label} className={`rounded-full px-3 py-1 ${index === step ? 'bg-primary text-white' : 'bg-white'}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mt-6 rounded-3xl bg-white p-6 shadow-soft">
          {step === 0 ? (
            <div className="space-y-3">
              <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            </div>
          ) : null}
          {step === 1 ? (
            <div className="space-y-3">
              <p className="font-semibold capitalize">{fulfillment.orderType}</p>
              {fulfillment.orderType === 'delivery' ? (
                <>
                  <p className="text-sm text-muted">Area: {selectedArea?.name || 'Select an area from the header'}</p>
                  {!selectedArea?.available ? <p className="text-sm text-red-700">This delivery area is unavailable.</p> : null}
                  <Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
                </>
              ) : (
                <p className="text-sm text-muted">Pickup at {restaurant.pickup.address}</p>
              )}
              <Field
                label="Instructions"
                value={form.instructions}
                onChange={(value) => setForm({ ...form, instructions: value })}
              />
            </div>
          ) : null}
          {step === 2 ? (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span>
                    {item.quantity}× {item.product.name}
                    {item.variant ? ` · ${item.variant.name}` : ''}
                    {item.addOns?.length ? ` · ${item.addOns.map((extra) => extra.name).join(', ')}` : ''}
                  </span>
                  <span>{formatMoney(lineTotal(item))}</span>
                </li>
              ))}
              <li className="flex justify-between border-t pt-3"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></li>
              <li className="flex justify-between"><span>Delivery</span><span>{formatMoney(totals.deliveryFee)}</span></li>
              <li className="flex justify-between"><span>Discount</span><span>-{formatMoney(totals.discount)}</span></li>
              <li className="flex justify-between font-semibold"><span>Total</span><span>{formatMoney(totals.total)}</span></li>
            </ul>
          ) : null}
          {step === 3 ? (
            <fieldset className="space-y-2">
              <legend className="font-semibold">Payment method</legend>
              {payments.map((method) => (
                <label key={method.id} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-background p-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.payment === method.id}
                    onChange={() => setForm({ ...form, payment: method.id })}
                  />
                  <span>
                    <span className="block font-semibold">{method.label}</span>
                    <span className="text-sm text-muted">{method.description}</span>
                  </span>
                </label>
              ))}
              <p className="text-xs text-muted">This demo does not process payments.</p>
            </fieldset>
          ) : null}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setStep((n) => Math.max(0, n - 1))} disabled={step === 0}>
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => canNext && setStep((n) => n + 1)} disabled={!canNext}>
            Continue
          </Button>
        ) : (
          <Button onClick={submit} disabled={pending}>
            {pending ? 'Placing order…' : 'Place order'}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  const id = label.toLowerCase();
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-2xl border border-primary/15 px-3 py-2 font-normal"
      />
    </label>
  );
}
