import { motion, useReducedMotion } from 'framer-motion';
import { Bike, Clock3, MapPin, Store } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { getOpeningStatus } from '../../utils/hours';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';

export function Hero() {
  const { restaurant } = useRestaurant();
  const { selectedArea, fulfillment } = useCart();
  const reduce = useReducedMotion();
  const status = getOpeningStatus(restaurant.hours);
  const area = fulfillment.orderType === 'pickup' ? restaurant.pickup.address : selectedArea?.name;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{restaurant.shortName}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-6xl">{restaurant.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{restaurant.tagline}</p>
          <p className="mt-3 max-w-xl text-muted">{restaurant.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/menu">Order now</Button>
            <Button to="/menu" variant="outline">View menu</Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {restaurant.delivery.enabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <Bike className="h-4 w-4 text-secondary" /> Delivery {restaurant.delivery.estimatedTime}
              </span>
            ) : null}
            {restaurant.pickup.enabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <Store className="h-4 w-4 text-secondary" /> Pickup {restaurant.pickup.estimatedTime}
              </span>
            ) : null}
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 ${status.isOpen ? 'bg-primary text-white' : 'bg-ink text-white'}`}>
              <Clock3 className="h-4 w-4" /> {status.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <MapPin className="h-4 w-4 text-secondary" /> {area || 'Choose an area'}
            </span>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-primary/10" />
          <SafeImage
            src={restaurant.heroImage}
            alt={`${restaurant.name} dining room`}
            className="relative h-[320px] w-full rounded-[1.75rem] bg-primary/10 object-cover sm:h-[420px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
