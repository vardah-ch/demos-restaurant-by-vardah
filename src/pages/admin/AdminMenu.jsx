import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { createId } from '../../utils/ids';
import { formatMoney } from '../../utils/currency';

const emptyProduct = (categories) => ({
  id: createId('p'),
  slug: 'new-item',
  name: '',
  description: '',
  categoryId: categories[0]?.id || '',
  price: 0,
  originalPrice: null,
  image: '',
  popular: false,
  featured: false,
  isNew: false,
  available: true,
  rating: 5,
  reviewCount: 0,
  tags: [],
  ingredients: [],
  allergens: [],
  weight: '',
  variants: [{ id: 'regular', name: 'Regular', priceDelta: 0 }],
  addOns: [],
});

export default function AdminMenu() {
  const { restaurant, upsertProduct, removeProduct } = useRestaurant();
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Menu</h1>
        <Button onClick={() => setEditing(emptyProduct(restaurant.categories))}>Add product</Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-background/80">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {restaurant.products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">{product.available ? 'Enabled' : 'Disabled'}</p>
                </td>
                <td className="px-4 py-3">{formatMoney(product.price)}</td>
                <td className="px-4 py-3 text-xs">{[product.popular && 'Popular', product.featured && 'Featured'].filter(Boolean).join(' · ') || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" className="mr-2 px-3 py-1" onClick={() => setEditing(product)}>Edit</Button>
                  <Button variant="ghost" className="px-3 py-1" onClick={() => removeProduct(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductEditor
        product={editing}
        categories={restaurant.categories}
        onClose={() => setEditing(null)}
        onSave={(next) => {
          upsertProduct(next);
          setEditing(null);
        }}
      />
    </div>
  );
}

function ProductEditor({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product);
  const open = Boolean(product);
  useEffect(() => setForm(product), [product]);

  return (
    <Modal open={open} onClose={onClose} title="Edit product" wide>
      {form ? (
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              ...form,
              price: Number(form.price),
              tags: String(Array.isArray(form.tags) ? form.tags.join(',') : form.tags || '')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
              ingredients: Array.isArray(form.ingredients) ? form.ingredients : [],
            });
          }}
        >
          <Field label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
          <label className="text-sm font-semibold">
            Category
            <select className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <Field label="Price" type="number" value={form.price} onChange={(price) => setForm({ ...form, price })} />
          <Field label="Image URL" value={form.image} onChange={(image) => setForm({ ...form, image })} />
          <label className="md:col-span-2 text-sm font-semibold">
            Description
            <textarea className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <Field label="Tags (comma)" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={(tags) => setForm({ ...form, tags })} />
          <Field
            label="Variants JSON"
            value={JSON.stringify(form.variants)}
            onChange={(value) => {
              try { setForm({ ...form, variants: JSON.parse(value) }); } catch { /* keep typing */ }
            }}
          />
          <Field
            label="Add-ons JSON"
            value={JSON.stringify(form.addOns)}
            onChange={(value) => {
              try { setForm({ ...form, addOns: JSON.parse(value) }); } catch { /* keep typing */ }
            }}
          />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Enabled</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <div className="md:col-span-2">
            <Button type="submit">Save product</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input type={type} className="mt-1 w-full rounded-2xl border px-3 py-2 font-normal" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
