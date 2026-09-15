import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { Seo } from '../components/common/Seo';
import { useRestaurant } from '../context/RestaurantContext';

export default function Gallery() {
  const { restaurant } = useRestaurant();
  return (
    <div className="py-8">
      <Seo title={`Gallery | ${restaurant.name}`} />
      <GalleryGrid />
    </div>
  );
}
