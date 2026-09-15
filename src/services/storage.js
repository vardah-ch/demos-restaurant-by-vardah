const PREFIX = 'demos-kitchen';

export const storageKeys = {
  restaurant: `${PREFIX}:restaurant`,
  cart: `${PREFIX}:cart`,
  orders: `${PREFIX}:orders`,
  reviews: `${PREFIX}:reviews`,
  helpful: `${PREFIX}:helpful`,
  auth: `${PREFIX}:admin-auth`,
  promo: `${PREFIX}:promo`,
  fulfillment: `${PREFIX}:fulfillment`,
};

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
