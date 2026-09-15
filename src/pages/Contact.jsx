import { ContactBlock } from '../components/contact/ContactBlock';
import { Seo } from '../components/common/Seo';
import { useRestaurant } from '../context/RestaurantContext';

export default function Contact() {
  const { restaurant } = useRestaurant();
  return (
    <div className="py-8">
      <Seo title={`Contact | ${restaurant.name}`} />
      <ContactBlock />
    </div>
  );
}
