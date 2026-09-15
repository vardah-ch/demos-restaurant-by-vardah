import { AboutSection } from '../components/offers/AboutSection';
import { FeaturesSection } from '../components/offers/FeaturesSection';
import { Seo } from '../components/common/Seo';
import { useRestaurant } from '../context/RestaurantContext';

export default function About() {
  const { restaurant } = useRestaurant();
  return (
    <div className="py-8">
      <Seo title={`About | ${restaurant.name}`} description={restaurant.story} />
      <AboutSection />
      <FeaturesSection />
    </div>
  );
}
