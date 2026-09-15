import { OffersSection } from '../components/offers/OffersSection';
import { Seo } from '../components/common/Seo';
import { useRestaurant } from '../context/RestaurantContext';

export default function Offers() {
  const { restaurant } = useRestaurant();
  return (
    <div className="py-8">
      <Seo title={`Offers | ${restaurant.name}`} />
      <OffersSection compact />
    </div>
  );
}
