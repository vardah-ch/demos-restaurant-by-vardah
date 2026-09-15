import { Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';

export default function Legal({ type }) {
  const { restaurant } = useRestaurant();
  const title = type === 'privacy' ? 'Privacy' : 'Terms';
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-4 text-muted">
        This is placeholder legal copy for the {restaurant.name} template. Replace it with counsel-reviewed text before a live launch.
      </p>
      <p className="mt-4 text-muted">
        Demo data is fictional. Do not submit real payment card details. Online payment is a UI placeholder only.
      </p>
      <Link to="/" className="mt-8 inline-block font-semibold">Back home</Link>
    </article>
  );
}
