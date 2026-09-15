import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../utils/currency';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';
import { StarRating } from '../common/StarRating';

export function ProductCard({ product }) {
  const { setProductModal, addItem } = useCart();
  const reduce = useReducedMotion();
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <motion.article
      layout
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft"
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <button type="button" className="relative overflow-hidden text-left" onClick={() => setProductModal(product)}>
        <SafeImage
          src={product.image}
          alt={product.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {product.popular ? <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-white">Popular</span> : null}
          {product.isNew ? <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-ink">New</span> : null}
          {discount ? <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">-{discount}%</span> : null}
          {!product.available ? <span className="rounded-full bg-red-700 px-2 py-0.5 text-[11px] font-bold text-white">Unavailable</span> : null}
        </div>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl">
          <button type="button" className="text-left hover:underline" onClick={() => setProductModal(product)}>
            {product.name}
          </button>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <StarRating value={product.rating} size={14} />
          <span className="text-xs text-muted">{product.rating}</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="font-semibold">{formatMoney(product.price)}</p>
            {product.originalPrice ? (
              <p className="text-xs text-muted line-through">{formatMoney(product.originalPrice)}</p>
            ) : null}
          </div>
          <Button
            className="px-4 py-2"
            disabled={!product.available}
            onClick={() => (product.available ? setProductModal(product) : null)}
          >
            {product.available ? 'Add' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function QuickAdd({ product }) {
  const { addItem } = useCart();
  return (
    <Button
      variant="outline"
      onClick={() => addItem({ product, variant: product.variants?.[0], addOns: [], quantity: 1 })}
    >
      Quick add
    </Button>
  );
}
