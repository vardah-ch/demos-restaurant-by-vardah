import { Button } from '../../components/common/Button';
import { useRestaurant } from '../../context/RestaurantContext';
import { deleteReview, updateReview } from '../../services/api';

export default function AdminReviews() {
  const { reviews, setReviews } = useRestaurant();

  const apply = async (id, patch) => {
    const next = await updateReview(id, patch);
    setReviews(next);
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Reviews</h1>
      <ul className="mt-6 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{review.name} · {review.rating}★ · {review.status}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => apply(review.id, { status: 'approved' })}>Approve</Button>
                <Button variant="outline" onClick={() => apply(review.id, { status: 'rejected' })}>Reject</Button>
                <Button variant="outline" onClick={() => apply(review.id, { featured: !review.featured })}>Feature</Button>
                <Button variant="ghost" onClick={async () => setReviews(await deleteReview(review.id))}>Delete</Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">{review.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
