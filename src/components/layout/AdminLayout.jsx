import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../common/Button';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminLayout() {
  const { isAdmin, logout } = useAuth();
  const { restaurant } = useRestaurant();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-primary/10 bg-ink p-5 text-white lg:w-60 lg:border-b-0 lg:border-r">
          <p className="font-display text-2xl">{restaurant.shortName} Admin</p>
          <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-white text-ink' : 'text-white/80 hover:bg-white/10'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="outline" className="mt-6 w-full border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={logout}>
            Log out
          </Button>
        </aside>
        <div className="flex-1 overflow-x-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
