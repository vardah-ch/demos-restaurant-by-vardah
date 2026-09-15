import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { ProductCard } from '../products/ProductCard';

export function BestSellers() {
  const { products } = useRestaurant();
  const list = products.filter((product) => product.popular && product.available);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Favorites</p>
          <h2 className="font-display text-3xl">Best sellers</h2>
        </div>
        <Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold">
          See all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
        {list.slice(0, 8).map((product) => (
          <div key={product.id} className="min-w-[240px] md:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
