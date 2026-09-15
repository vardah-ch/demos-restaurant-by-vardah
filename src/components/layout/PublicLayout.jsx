import { Outlet, useLocation } from 'react-router-dom';
import { CartDrawer, FloatingCart } from '../cart/CartDrawer';
import { LocationModal } from '../cart/LocationModal';
import { ProductModal } from '../products/ProductModal';
import { Seo } from '../common/Seo';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageTransition } from './PageTransition';

export function PublicLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Seo />
      <Header />
      <main id="main">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <LocationModal />
      <ProductModal />
      <FloatingCart />
    </div>
  );
}
