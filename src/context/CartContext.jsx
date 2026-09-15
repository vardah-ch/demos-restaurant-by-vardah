import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storageKeys } from '../services/storage';
import { createId } from '../utils/ids';
import { cartTotals, unitPrice } from '../utils/pricing';
import { useRestaurant } from './RestaurantContext';

const CartContext = createContext(null);

const defaultFulfillment = {
  orderType: 'delivery',
  areaId: null,
  promoCode: '',
};

export function CartProvider({ children }) {
  const { restaurant } = useRestaurant();
  const [items, setItems] = useLocalStorage(storageKeys.cart, []);
  const [fulfillment, setFulfillment] = useLocalStorage(storageKeys.fulfillment, defaultFulfillment);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [productModal, setProductModal] = useState(null);

  const areas = restaurant.delivery?.areas || [];
  const selectedArea = areas.find((area) => area.id === fulfillment.areaId) || areas.find((area) => area.available) || null;

  const promo = (restaurant.offers || []).find(
    (offer) => offer.active && offer.code?.toUpperCase() === fulfillment.promoCode?.trim().toUpperCase(),
  );

  const totals = useMemo(
    () =>
      cartTotals({
        items,
        orderType: fulfillment.orderType,
        area: selectedArea,
        promo,
        deliveryConfig: restaurant.delivery,
      }),
    [fulfillment.orderType, items, promo, restaurant.delivery, selectedArea],
  );

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    (payload) => {
      const cartItem = {
        id: createId('cart'),
        product: payload.product,
        variant: payload.variant || payload.product.variants?.[0] || null,
        addOns: payload.addOns || [],
        quantity: payload.quantity || 1,
        instructions: payload.instructions || '',
      };
      setItems((prev) => [...prev, cartItem]);
      setDrawerOpen(true);
      return cartItem;
    },
    [setItems],
  );

  const updateQty = useCallback(
    (id, quantity) => {
      setItems((prev) =>
        prev
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );
    },
    [setItems],
  );

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((item) => item.id !== id)),
    [setItems],
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const setOrderType = useCallback(
    (orderType) => setFulfillment((prev) => ({ ...prev, orderType })),
    [setFulfillment],
  );

  const setAreaId = useCallback(
    (areaId) => setFulfillment((prev) => ({ ...prev, areaId, orderType: 'delivery' })),
    [setFulfillment],
  );

  const applyPromo = useCallback(
    (promoCode) => setFulfillment((prev) => ({ ...prev, promoCode })),
    [setFulfillment],
  );

  const belowMinimum =
    fulfillment.orderType === 'delivery' &&
    restaurant.delivery?.minimumOrder &&
    totals.subtotal > 0 &&
    totals.subtotal < restaurant.delivery.minimumOrder;

  const value = useMemo(
    () => ({
      items,
      count,
      totals,
      fulfillment,
      selectedArea,
      promo,
      drawerOpen,
      setDrawerOpen,
      locationOpen,
      setLocationOpen,
      productModal,
      setProductModal,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      setOrderType,
      setAreaId,
      applyPromo,
      belowMinimum,
      unitPrice,
    }),
    [
      addItem,
      applyPromo,
      belowMinimum,
      clearCart,
      count,
      drawerOpen,
      fulfillment,
      items,
      locationOpen,
      productModal,
      promo,
      removeItem,
      selectedArea,
      setAreaId,
      setOrderType,
      totals,
      updateQty,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
