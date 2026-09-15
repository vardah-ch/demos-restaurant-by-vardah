import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { restaurant, persist } = useRestaurant();
  const { push } = useToast();
  const [form, setForm] = useState(restaurant);

  const save = (event) => {
    event.preventDefault();
    persist({
      ...restaurant,
      ...form,
      colors: { ...restaurant.colors, ...form.colors },
      contact: { ...restaurant.contact, ...form.contact },
      delivery: {
        ...restaurant.delivery,
        ...form.delivery,
        fee: Number(form.delivery.fee),
        minimumOrder: Number(form.delivery.minimumOrder),
      },
      pickup: { ...restaurant.pickup, ...form.pickup },
      social: { ...restaurant.social, ...form.social },
    });
    push('Settings saved');
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <h1 className="font-display text-3xl">Settings</h1>
      <Field label="Restaurant name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
      <Field label="Tagline" value={form.tagline} onChange={(tagline) => setForm({ ...form, tagline })} />
      <Field label="Phone" value={form.contact.phone} onChange={(phone) => setForm({ ...form, contact: { ...form.contact, phone } })} />
      <Field label="Email" value={form.contact.email} onChange={(email) => setForm({ ...form, contact: { ...form.contact, email } })} />
      <Field label="Address" value={form.contact.address} onChange={(address) => setForm({ ...form, contact: { ...form.contact, address } })} />
      <Field label="Primary color" value={form.colors.primary} onChange={(primary) => setForm({ ...form, colors: { ...form.colors, primary } })} />
      <Field label="Secondary color" value={form.colors.secondary} onChange={(secondary) => setForm({ ...form, colors: { ...form.colors, secondary } })} />
      <Field label="Delivery fee" type="number" value={form.delivery.fee} onChange={(fee) => setForm({ ...form, delivery: { ...form.delivery, fee } })} />
      <Field label="Minimum order" type="number" value={form.delivery.minimumOrder} onChange={(minimumOrder) => setForm({ ...form, delivery: { ...form.delivery, minimumOrder } })} />
      <Field label="Pickup address" value={form.pickup.address} onChange={(address) => setForm({ ...form, pickup: { ...form.pickup, address } })} />
      <Field label="Instagram" value={form.social.instagram} onChange={(instagram) => setForm({ ...form, social: { ...form.social, instagram } })} />
      <Field label="Facebook" value={form.social.facebook} onChange={(facebook) => setForm({ ...form, social: { ...form.social, facebook } })} />
      <p className="text-sm text-muted">Delivery areas and hours stay in src/config/restaurant.js or can be extended here later.</p>
      <Button type="submit">Save settings</Button>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input type={type} className="mt-1 w-full rounded-2xl border px-3 py-2 font-normal" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
