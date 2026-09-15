import { useRestaurant } from '../../context/RestaurantContext';

export function Logo({ className = 'h-10 w-10' }) {
  const { restaurant } = useRestaurant();
  return (
    <img src={restaurant.logo} alt="" className={className} />
  );
}
