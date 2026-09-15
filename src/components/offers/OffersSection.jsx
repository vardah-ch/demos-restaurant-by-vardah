import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../common/Button';
import { Reveal } from '../common/Reveal';
import { SafeImage } from '../common/SafeImage';

export function OffersSection({ compact = false }) {
  const { offers, products } = useRestaurant();
  const { applyPromo, setProductModal } = useCart();
  const list = offers.filter((offer) => offer.active);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Deals</p>
          <h2 className="font-display text-3xl">Offers</h2>
        </div>
        {!compact ? <Link to="/offers" className="text-sm font-semibold">All offers</Link> : null}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {list.slice(0, compact ? 8 : 4).map((offer, index) => (
          <Reveal key={offer.id} delay={index * 0.05}>
            <article className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <SafeImage src={offer.image} alt="" className="h-48 w-full object-cover" />
              <div className="p-5">
                <p className="text-sm font-bold text-secondary">{offer.discount}</p>
                <h3 className="font-display text-2xl">{offer.title}</h3>
                <p className="mt-2 text-sm text-muted">{offer.description}</p>
                <p className="mt-3 text-xs text-muted">Code {offer.code} · until {offer.validUntil}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      applyPromo(offer.code);
                      const first = products.find((product) => offer.productIds?.includes(product.id));
                      if (first) setProductModal(first);
                    }}
                  >
                    {offer.cta}
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
