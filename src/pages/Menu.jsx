import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FulfillmentBar } from '../components/cart/LocationModal';
import { EmptyState } from '../components/common/States';
import { ProductCard } from '../components/products/ProductCard';
import { useRestaurant } from '../context/RestaurantContext';
import { Seo } from '../components/common/Seo';

export default function Menu() {
  const { restaurant, products, categories } = useRestaurant();
  const [params, setParams] = useSearchParams();
  const selected = params.get('category') || 'all';
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.categoryId);
      const inCategory = selected === 'all' || category?.slug === selected;
      if (!inCategory) return false;
      if (!q) return true;
      const hay = [product.name, product.description, category?.name, ...(product.tags || [])]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [categories, products, query, selected]);

  const currentCategory = categories.find((item) => item.slug === selected);

  return (
    <div className="pb-16">
      <Seo title={`Menu | ${restaurant.name}`} description={restaurant.seo?.description} />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="font-display text-4xl">Menu</h1>
        <p className="mt-2 max-w-2xl text-muted">Search dishes, filter by category, then customize extras before they hit the cart.</p>
        <label className="relative mt-6 block">
          <span className="sr-only">Search menu</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, description, tags..."
            className="w-full rounded-full border border-primary/15 bg-white py-3 pl-11 pr-12"
          />
          {query ? (
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label="Clear search" onClick={() => setQuery('')}>
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
        <p className="mt-2 text-sm text-muted">
          {query ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for “${query}”` : `${filtered.length} items`}
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setParams({})}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${selected === 'all' ? 'bg-primary text-white' : 'bg-white'}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setParams({ category: category.slug })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                selected === category.slug ? 'bg-primary text-white' : 'bg-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <FulfillmentBar />
      <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        {currentCategory ? <h2 className="mb-4 font-display text-2xl">{currentCategory.name}</h2> : null}
        {!filtered.length ? (
          <EmptyState
            title={query ? 'No search results' : 'This category is empty'}
            description={query ? 'Try another word or clear the search.' : 'Add products in admin or configuration.'}
          />
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
