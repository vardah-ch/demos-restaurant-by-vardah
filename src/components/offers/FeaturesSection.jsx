import { useRestaurant } from '../../context/RestaurantContext';
import { Icon } from '../common/Icon';
import { Reveal } from '../common/Reveal';

export function FeaturesSection() {
  const { restaurant } = useRestaurant();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h2 className="font-display text-3xl">Why guests choose us</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {restaurant.features.map((feature, index) => (
          <Reveal key={feature.id} delay={index * 0.05}>
            <article className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/40">
                <Icon name={feature.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
