import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import restaurantSeed from '../config/restaurant';
import { getRestaurant, getReviews, saveRestaurant } from '../services/api';
import { storageKeys, writeJson } from '../services/storage';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const cached = localStorage.getItem(storageKeys.restaurant);
      return cached ? JSON.parse(cached) : restaurantSeed;
    } catch {
      return restaurantSeed;
    }
  });
  const [reviews, setReviewsState] = useState(restaurant.reviews || []);
  const setReviews = useCallback((updater) => {
    setReviewsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(storageKeys.reviews, next);
      return next;
    });
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getRestaurant(), getReviews()]).then(([data, reviewList]) => {
      if (!active) return;
      setRestaurant(data);
      setReviews(reviewList);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const colors = restaurant.colors || {};
    root.style.setProperty('--restaurant-primary', colors.primary);
    root.style.setProperty('--restaurant-secondary', colors.secondary);
    root.style.setProperty('--restaurant-accent', colors.accent);
    root.style.setProperty('--restaurant-background', colors.background);
    root.style.setProperty('--restaurant-ink', colors.ink || '#14201B');
    root.style.setProperty('--restaurant-muted', colors.muted || '#5C6B64');
    document.title = restaurant.seo?.title || restaurant.name;
  }, [restaurant]);

  const persist = useCallback(async (next) => {
    setRestaurant(next);
    writeJson(storageKeys.restaurant, next);
    await saveRestaurant(next);
  }, []);

  const updateRestaurant = useCallback(
    (patch) => {
      const next = { ...restaurant, ...patch };
      persist(next);
    },
    [persist, restaurant],
  );

  const upsertProduct = useCallback(
    (product) => {
      const exists = restaurant.products.some((item) => item.id === product.id);
      const products = exists
        ? restaurant.products.map((item) => (item.id === product.id ? product : item))
        : [...restaurant.products, product];
      persist({ ...restaurant, products });
    },
    [persist, restaurant],
  );

  const removeProduct = useCallback(
    (id) => persist({ ...restaurant, products: restaurant.products.filter((item) => item.id !== id) }),
    [persist, restaurant],
  );

  const upsertCategory = useCallback(
    (category) => {
      const exists = restaurant.categories.some((item) => item.id === category.id);
      const categories = exists
        ? restaurant.categories.map((item) => (item.id === category.id ? category : item))
        : [...restaurant.categories, category];
      persist({ ...restaurant, categories });
    },
    [persist, restaurant],
  );

  const removeCategory = useCallback(
    (id) => persist({ ...restaurant, categories: restaurant.categories.filter((item) => item.id !== id) }),
    [persist, restaurant],
  );

  const upsertOffer = useCallback(
    (offer) => {
      const exists = restaurant.offers.some((item) => item.id === offer.id);
      const offers = exists
        ? restaurant.offers.map((item) => (item.id === offer.id ? offer : item))
        : [...restaurant.offers, offer];
      persist({ ...restaurant, offers });
    },
    [persist, restaurant],
  );

  const removeOffer = useCallback(
    (id) => persist({ ...restaurant, offers: restaurant.offers.filter((item) => item.id !== id) }),
    [persist, restaurant],
  );

  const value = useMemo(
    () => ({
      restaurant,
      reviews,
      setReviews,
      loading,
      updateRestaurant,
      persist,
      upsertProduct,
      removeProduct,
      upsertCategory,
      removeCategory,
      upsertOffer,
      removeOffer,
      products: restaurant.products || [],
      categories: (restaurant.categories || []).filter((category) => category.enabled !== false),
      allCategories: restaurant.categories || [],
      offers: restaurant.offers || [],
    }),
    [loading, persist, removeCategory, removeOffer, removeProduct, restaurant, reviews, setReviews, updateRestaurant, upsertCategory, upsertOffer, upsertProduct],
  );

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
