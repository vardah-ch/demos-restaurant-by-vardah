import { ThumbsUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { submitReview } from '../../services/api';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { storageKeys } from '../../services/storage';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';

function average(list, key) {
  if (!list.length) return 0;
  return list.reduce((sum, item) => sum + (key ? item.categoryRatings?.[key] || 0 : item.rating), 0) / list.length;
}

export function ReviewsSection({ showComposer = true }) {
  const { reviews, setReviews } = useRestaurant();
  const visible = reviews.filter((review) => review.status === 'approved');
  const [helpful, setHelpful] = useLocalStorage(storageKeys.helpful, {});
  const [open, setOpen] = useState(false);

  const dist = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    visible.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  }, [visible]);

  const overall = average(visible);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Guests</p>
          <h2 className="font-display text-3xl">Reviews</h2>
        </div>
        {showComposer ? <Button onClick={() => setOpen(true)}>Write a review</Button> : null}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <p className="font-display text-5xl">{overall.toFixed(1)}</p>
          <StarRating value={overall} />
          <p className="mt-1 text-sm text-muted">{visible.length} reviews</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = visible.length ? Math.round((dist[star] / visible.length) * 100) : 0;
              return (
                <li key={star} className="flex items-center gap-2">
                  <span className="w-8">{star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted">{pct}%</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {['food', 'service', 'delivery', 'packaging'].map((key) => (
              <div key={key} className="rounded-2xl bg-background px-3 py-2">
                <dt className="capitalize text-muted">{key}</dt>
                <dd className="font-semibold">{average(visible, key).toFixed(1)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-4">
          {visible.map((review) => (
            <article key={review.id} className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <img src={review.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{review.name}</h3>
                    {review.verified ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">Verified</span> : null}
                  </div>
                  <p className="text-xs text-muted">{review.location} · {review.date}</p>
                  <StarRating value={review.rating} className="mt-1" />
                  <p className="mt-2 text-sm text-ink/90">{review.text}</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-muted"
                    onClick={() => {
                      if (helpful[review.id]) return;
                      setHelpful((prev) => ({ ...prev, [review.id]: true }));
                      setReviews((prev) =>
                        prev.map((item) => (item.id === review.id ? { ...item, helpful: item.helpful + 1 } : item)),
                      );
                    }}
                  >
                    <ThumbsUp className="h-4 w-4" /> Helpful · {review.helpful + (helpful[review.id] ? 0 : 0)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ReviewModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ReviewModal({ open, onClose }) {
  const { setReviews } = useRestaurant();
  const { push } = useToast();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const name = String(form.get('name') || '').trim();
    const location = String(form.get('location') || '').trim();
    const text = String(form.get('text') || '').trim();
    const rating = Number(form.get('rating'));
    if (!name || !location || !text || !rating) {
      setError('Please complete name, location, rating, and review.');
      return;
    }
    setPending(true);
    setError('');
    try {
      const review = await submitReview({
        name,
        location,
        text,
        rating,
        categoryRatings: {
          food: Number(form.get('food')) || rating,
          service: Number(form.get('service')) || rating,
          delivery: Number(form.get('delivery')) || rating,
          packaging: Number(form.get('packaging')) || rating,
        },
      });
      setReviews((prev) => [review, ...prev]);
      push('Review submitted. It appears as pending until approved.');
      onClose();
      event.target.reset();
    } catch {
      setError('Could not submit review. Try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Write a review">
      <form onSubmit={onSubmit} className="space-y-3">
        {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
        <label className="block text-sm font-semibold" htmlFor="rev-name">Name</label>
        <input id="rev-name" name="name" className="w-full rounded-2xl border border-primary/15 px-3 py-2" />
        <label className="block text-sm font-semibold" htmlFor="rev-loc">Location</label>
        <input id="rev-loc" name="location" className="w-full rounded-2xl border border-primary/15 px-3 py-2" />
        <label className="block text-sm font-semibold" htmlFor="rev-rating">Overall rating</label>
        <select id="rev-rating" name="rating" className="w-full rounded-2xl border border-primary/15 px-3 py-2" defaultValue="5">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          {['food', 'service', 'delivery', 'packaging'].map((key) => (
            <label key={key} className="text-sm">
              <span className="capitalize">{key}</span>
              <select name={key} className="mt-1 w-full rounded-2xl border border-primary/15 px-3 py-2" defaultValue="5">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          ))}
        </div>
        <label className="block text-sm font-semibold" htmlFor="rev-text">Review</label>
        <textarea id="rev-text" name="text" rows={4} className="w-full rounded-2xl border border-primary/15 px-3 py-2" />
        <Button type="submit" disabled={pending} className="w-full">{pending ? 'Submitting…' : 'Submit review'}</Button>
      </form>
    </Modal>
  );
}
