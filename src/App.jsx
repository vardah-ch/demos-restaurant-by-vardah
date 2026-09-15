import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from './components/common/States';
import { AdminLayout } from './components/layout/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Offers from './pages/Offers';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Legal from './pages/Legal';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <ToastProvider>
                <Suspense fallback={<LoadingState />}>
                  <Routes>
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                      <Route path="/track/:orderId" element={<OrderTracking />} />
                      <Route path="/privacy" element={<Legal type="privacy" />} />
                      <Route path="/terms" element={<Legal type="terms" />} />
                    </Route>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="menu" element={<AdminMenu />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="offers" element={<AdminOffers />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ToastProvider>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </RestaurantProvider>
    </BrowserRouter>
  );
}
