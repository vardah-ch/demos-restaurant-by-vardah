import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../common/Button';
import { Reveal } from '../common/Reveal';
import { SafeImage } from '../common/SafeImage';

export function AboutSection() {
  const { restaurant } = useRestaurant();
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-8">
      <Reveal>
        <SafeImage src={restaurant.aboutImage} alt={`${restaurant.name} kitchen`} className="h-80 w-full rounded-3xl object-cover" />
      </Reveal>
      <Reveal delay={0.08}>
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Our story</p>
        <h2 className="font-display text-3xl sm:text-4xl">About {restaurant.name}</h2>
        <p className="mt-4 text-muted">{restaurant.story}</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {restaurant.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <p className="font-display text-2xl">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
        <Button to="/about" className="mt-6">Read more</Button>
      </Reveal>
    </section>
  );
}
