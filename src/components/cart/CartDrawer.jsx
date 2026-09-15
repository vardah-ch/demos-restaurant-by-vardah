import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useEscape } from '../../hooks/useEscape';
import { useLockBody } from '../../hooks/useLockBody';
import { formatMoney } from '../../utils/currency';
import { lineTotal } from '../../utils/pricing';
import { Button } from '../common/Button';
import { EmptyState } from '../common/States';
import { SafeImage } from '../common/SafeImage';

export function CartDrawer() {
  const { restaurant } = useRestaurant();
  const {
    drawerOpen,
    setDrawerOpen,
    items,
    updateQty,
    removeItem,
    totals,
    fulfillment,
    selectedArea,
    belowMinimum,
    applyPromo,
    promo,
  } = useCart();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  useLockBody(drawerOpen);
  useEscape(drawerOpen, () => setDrawerOpen(false));

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[80] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={reduce ? { opacity: 1 } : { x: '100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 z-[81] flex w-[min(100vw,420px)] flex-col bg-background shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
              <h2 className="font-display text-2xl">Your cart</h2>
              <button type="button" aria-label="Close cart" onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <EmptyState
                  title="Cart is empty"
                  description="Add a plate from the menu and it will land here."
                  action={
                    <Button
                      to="/menu"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Browse menu
                    </Button>
                  }
                />
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 rounded-2xl bg-white p-3">
                      <SafeImage src={item.product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        {item.variant ? <p className="text-xs text-muted">{item.variant.name}</p> : null}
                        {item.addOns?.length ? (
                          <p className="text-xs text-muted">{item.addOns.map((extra) => extra.name).join(', ')}</p>
                        ) : null}
                        {item.instructions ? <p className="text-xs italic text-muted">{item.instructions}</p> : null}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full bg-background">
                            <button type="button" className="p-1.5" aria-label="Decrease" onClick={() => updateQty(item.id, item.quantity - 1)}>
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button type="button" className="p-1.5" aria-label="Increase" onClick={() => updateQty(item.id, item.quantity + 1)}>
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">{formatMoney(lineTotal(item))}</span>
                        </div>
                      </div>
                      <button type="button" aria-label="Remove item" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-muted" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length ? (
              <div className="border-t border-primary/10 bg-white p-5">
                <label className="text-xs font-semibold" htmlFor="promo">Promo code</label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="promo"
                    value={fulfillment.promoCode}
                    className="flex-1 rounded-full border border-primary/15 px-3 py-2 text-sm"
                    onChange={(event) => applyPromo(event.target.value)}
                    placeholder="NOON15"
                  />
                </div>
                {promo ? <p className="mt-1 text-xs text-primary">Applied {promo.code}</p> : null}
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
                  <div className="flex justify-between"><dt>Delivery</dt><dd>{fulfillment.orderType === 'pickup' ? '—' : formatMoney(totals.deliveryFee)}</dd></div>
                  <div className="flex justify-between text-secondary"><dt>Discount</dt><dd>-{formatMoney(totals.discount)}</dd></div>
                  <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
                </dl>
                {fulfillment.orderType === 'delivery' && selectedArea && !selectedArea.available ? (
                  <p className="mt-2 text-sm text-red-700">Delivery is not available in {selectedArea.name}.</p>
                ) : null}
                {belowMinimum ? (
                  <p className="mt-2 text-sm text-red-700">
                    Minimum delivery order is {formatMoney(restaurant.delivery.minimumOrder)}.
                  </p>
                ) : null}
                <Button
                  className="mt-4 w-full"
                  disabled={belowMinimum || (fulfillment.orderType === 'delivery' && selectedArea && !selectedArea.available)}
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function FloatingCart() {
  const { count, setDrawerOpen } = useCart();
  if (!count) return null;
  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className="fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lift md:hidden"
      aria-label={`Open cart, ${count} items`}
    >
      <ShoppingBag className="h-4 w-4" />
      Cart · {count}
    </button>
  );
}
