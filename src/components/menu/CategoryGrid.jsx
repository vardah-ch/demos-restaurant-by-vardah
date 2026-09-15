import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { Icon } from '../common/Icon';
import { Reveal } from '../common/Reveal';
import { SafeImage } from '../common/SafeImage';

export function CategoryGrid() {
  const { categories, products } = useRestaurant();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Menu</p>
          <h2 className="font-display text-3xl sm:text-4xl">Browse by category</h2>
        </div>
        <Link to="/menu" className="hidden items-center gap-1 text-sm font-semibold sm:inline-flex">
          See all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => {
          const count = products.filter((product) => product.categoryId === category.id).length;
          return (
            <Reveal key={category.id} delay={index * 0.04}>
              <Link
                to={`/menu?category=${category.slug}`}
                className="group flex items-center gap-3 overflow-hidden rounded-3xl bg-white p-3 shadow-soft"
              >
                <SafeImage src={category.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 font-semibold">
                    <Icon name={category.icon} className="h-4 w-4 text-secondary" />
                    <span className="truncate">{category.name}</span>
                  </p>
                  <p className="text-xs text-muted">{count} items</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
