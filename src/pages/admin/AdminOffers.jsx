import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { createId } from '../../utils/ids';

export default function AdminOffers() {
  const { restaurant, upsertOffer, removeOffer } = useRestaurant();
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Offers</h1>
        <Button onClick={() => setEditing({
          id: createId('o'), title: '', description: '', discount: '', discountType: 'percent', discountValue: 10,
          minSubtotal: 0, code: '', validUntil: '', image: '', productIds: [], active: true, featured: false, cta: 'Order now',
        })}>Create offer</Button>
      </div>
      <ul className="mt-6 space-y-3">
        {restaurant.offers.map((offer) => (
          <li key={offer.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-soft">
            <div>
              <p className="font-semibold">{offer.title}</p>
              <p className="text-xs text-muted">{offer.code} · {offer.active ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(offer)}>Edit</Button>
              <Button variant="ghost" onClick={() => upsertOffer({ ...offer, active: !offer.active })}>
                {offer.active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button variant="ghost" onClick={() => removeOffer(offer.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
      <OfferEditor offer={editing} onClose={() => setEditing(null)} onSave={(next) => { upsertOffer(next); setEditing(null); }} />
    </div>
  );
}

function OfferEditor({ offer, onClose, onSave }) {
  const [form, setForm] = useState(offer);
  useEffect(() => setForm(offer), [offer]);
  return (
    <Modal open={Boolean(offer)} onClose={onClose} title="Offer">
      {form ? (
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave({ ...form, discountValue: Number(form.discountValue), minSubtotal: Number(form.minSubtotal) }); }}>
          <label className="block text-sm font-semibold">Title<input className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Description<textarea className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Code<input className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Discount value<input type="number" className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          <Button type="submit">Save</Button>
        </form>
      ) : null}
    </Modal>
  );
}
