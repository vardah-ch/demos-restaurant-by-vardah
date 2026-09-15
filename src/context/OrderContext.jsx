import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createOrder as apiCreateOrder, getOrder, getOrders, updateOrderStatus } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storageKeys } from '../services/storage';

export const TRACKING_STEPS = [
  { id: 'received', label: 'Order received' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'out_for_delivery', label: 'Out for delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export const PICKUP_STEPS = [
  { id: 'received', label: 'Order received' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready for pickup' },
  { id: 'delivered', label: 'Collected' },
];

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useLocalStorage(storageKeys.orders, []);
  const [lastOrder, setLastOrder] = useState(null);

  const placeOrder = useCallback(async (payload) => {
    const order = await apiCreateOrder(payload);
    setOrders((prev) => [order, ...prev.filter((item) => item.id !== order.id)]);
    setLastOrder(order);
    return order;
  }, [setOrders]);

  const refreshOrders = useCallback(async () => {
    const list = await getOrders();
    setOrders(list);
    return list;
  }, [setOrders]);

  const findOrder = useCallback(async (id) => {
    const local = orders.find((order) => order.id === id || order.number === id);
    if (local) return local;
    return getOrder(id);
  }, [orders]);

  const setStatus = useCallback(
    async (id, status) => {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
      return updated;
    },
    [setOrders],
  );

  const value = useMemo(
    () => ({ orders, lastOrder, placeOrder, refreshOrders, findOrder, setStatus }),
    [findOrder, lastOrder, orders, placeOrder, refreshOrders, setStatus],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
