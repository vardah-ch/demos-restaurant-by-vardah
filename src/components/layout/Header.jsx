import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MapPin, Menu, Phone, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { cn } from '../../utils/cn';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/offers', label: 'Offers' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const { restaurant } = useRestaurant();
  const { count, setDrawerOpen, selectedArea, fulfillment, setLocationOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const areaLabel =
    fulfillment.orderType === 'pickup'
      ? 'Pickup'
      : selectedArea?.name || 'Select area';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/95 shadow-soft backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <NavLink to="/" className="flex min-w-0 items-center gap-2.5">
          <Logo className="h-10 w-10 rounded-2xl" />
          <span className="truncate font-display text-xl text-ink sm:text-2xl">{restaurant.name}</span>
        </NavLink>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-ink',
                  isActive && 'bg-white text-ink shadow-sm',
                )
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="hidden items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-ink shadow-sm md:inline-flex"
          >
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            {areaLabel}
          </button>
          <a
            href={restaurant.contact.phoneHref}
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink xl:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {restaurant.contact.phone}
          </a>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative rounded-full bg-white p-2.5 shadow-sm"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
          <Button to="/menu" className="hidden sm:inline-flex">
            Order now
          </Button>
          <button
            type="button"
            className="rounded-full p-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={reduce ? { opacity: 1 } : { x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(86vw,360px)] flex-col bg-background p-6 shadow-lift lg:hidden"
              aria-label="Mobile"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl">{restaurant.shortName}</span>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-2">
                {LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white"
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setLocationOpen(true);
                }}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-left text-sm"
              >
                <MapPin className="h-4 w-4 text-secondary" />
                {areaLabel}
              </button>
              <Button to="/menu" className="mt-auto" onClick={() => setOpen(false)}>
                Order now
              </Button>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
