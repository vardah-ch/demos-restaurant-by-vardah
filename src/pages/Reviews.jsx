import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { Seo } from '../components/common/Seo';
import { useRestaurant } from '../context/RestaurantContext';

export default function Reviews() {
  const { restaurant } = useRestaurant();
  return (
    <div className="py-8">
      <Seo title={`Reviews | ${restaurant.name}`} />
      <ReviewsSection />
    </div>
  );
}
