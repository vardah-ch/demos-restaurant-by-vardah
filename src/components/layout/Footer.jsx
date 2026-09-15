import { Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { Logo } from '../common/Logo';

export function Footer() {
  const { restaurant, categories } = useRestaurant();
  return (
    <footer className="mt-16 border-t border-primary/10 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 rounded-2xl bg-white" />
            <span className="font-display text-2xl">{restaurant.name}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">{restaurant.description}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
            <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Menu</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {categories.slice(0, 8).map((category) => (
              <li key={category.id}>
                <Link to={`/menu?category=${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Visit</h2>
          <p className="mt-4 text-sm text-white/80">{restaurant.contact.address}</p>
          <p className="mt-2 text-sm text-white/80">{restaurant.contact.phone}</p>
          <p className="text-sm text-white/80">{restaurant.contact.email}</p>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            {restaurant.hours.map((row) => (
              <li key={row.day} className="flex justify-between gap-4">
                <span>{row.day}</span>
                <span>{row.closed ? 'Closed' : `${row.open}–${row.close}`}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={restaurant.social.facebook} aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <Globe className="h-4 w-4" />
            </a>
            <a href={restaurant.social.instagram} aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <Share2 className="h-4 w-4" />
            </a>
            <a href={restaurant.social.tiktok} aria-label="TikTok" className="rounded-full bg-white/10 px-2.5 py-2 text-xs font-bold hover:bg-white/20">
              TT
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
        <Link to="/privacy" className="hover:text-white">Privacy</Link>
        <span className="mx-2">·</span>
        <Link to="/terms" className="hover:text-white">Terms</Link>
        <p className="mt-2">© {new Date().getFullYear()} {restaurant.name}. Fictional demo template.</p>
      </div>
    </footer>
  );
}
