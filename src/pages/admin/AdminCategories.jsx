import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useRestaurant } from '../../context/RestaurantContext';
import { createId, slugify } from '../../utils/ids';

export default function AdminCategories() {
  const { restaurant, upsertCategory, removeCategory } = useRestaurant();
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Categories</h1>
        <Button onClick={() => setEditing({ id: createId('cat'), slug: 'new-category', name: '', description: '', image: '', icon: 'Star', enabled: true })}>
          Add category
        </Button>
      </div>
      <ul className="mt-6 space-y-3">
        {restaurant.categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-soft">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-xs text-muted">{category.enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(category)}>Edit</Button>
              <Button variant="ghost" onClick={() => removeCategory(category.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
      <CategoryEditor category={editing} onClose={() => setEditing(null)} onSave={(next) => { upsertCategory(next); setEditing(null); }} />
    </div>
  );
}

function CategoryEditor({ category, onClose, onSave }) {
  const [form, setForm] = useState(category);
  useEffect(() => setForm(category), [category]);
  return (
    <Modal open={Boolean(category)} onClose={onClose} title="Category">
      {form ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...form, slug: slugify(form.slug || form.name) });
          }}
        >
          <label className="block text-sm font-semibold">Name
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Description
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Image URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled
          </label>
          <Button type="submit">Save</Button>
        </form>
      ) : null}
    </Modal>
  );
}
