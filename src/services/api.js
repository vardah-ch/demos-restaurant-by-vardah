/**
 * Backend-ready service layer.
 * Today these functions read/write local storage.
 * Later, swap the bodies to fetch('/api/...') against Express + PostgreSQL.
 *
 * Suggested future endpoints:
 * GET  /api/restaurant
 * PUT  /api/restaurant
 * GET  /api/products
 * POST /api/products
 * PUT  /api/products/:id
 * DELETE /api/products/:id
 * GET  /api/categories
 * POST /api/orders
 * GET  /api/orders/:id
 * PATCH /api/orders/:id/status
 * GET  /api/reviews
 * POST /api/reviews
 * POST /api/admin/login
 */

import restaurantSeed from '../config/restaurant';
import { createId, createOrderNumber } from '../utils/ids';
import { delay, readJson, storageKeys, writeJson } from './storage';

function seedIfNeeded() {
  if (!readJson(storageKeys.restaurant, null)) {
    writeJson(storageKeys.restaurant, restaurantSeed);
  }
  if (!readJson(storageKeys.reviews, null)) {
    writeJson(storageKeys.reviews, restaurantSeed.reviews);
  }
  if (!readJson(storageKeys.orders, null)) {
    writeJson(storageKeys.orders, []);
  }
}

seedIfNeeded();

export async function getRestaurant() {
  await delay();
  return readJson(storageKeys.restaurant, restaurantSeed);
}

export async function saveRestaurant(next) {
  await delay();
  writeJson(storageKeys.restaurant, next);
  return next;
}

export async function getReviews() {
  await delay();
  return readJson(storageKeys.reviews, restaurantSeed.reviews);
}

export async function submitReview(payload) {
  await delay();
  const reviews = readJson(storageKeys.reviews, []);
  const review = {
    id: createId('r'),
    helpful: 0,
    featured: false,
    status: 'pending',
    verified: false,
    date: new Date().toISOString().slice(0, 10),
    avatar: `https://i.pravatar.cc/96?u=${encodeURIComponent(payload.name)}`,
    ...payload,
  };
  const next = [review, ...reviews];
  writeJson(storageKeys.reviews, next);
  return review;
}

export async function updateReview(id, patch) {
  await delay();
  const reviews = readJson(storageKeys.reviews, []);
  const next = reviews.map((review) => (review.id === id ? { ...review, ...patch } : review));
  writeJson(storageKeys.reviews, next);
  return next;
}

export async function deleteReview(id) {
  await delay();
  const reviews = readJson(storageKeys.reviews, []).filter((review) => review.id !== id);
  writeJson(storageKeys.reviews, reviews);
  return reviews;
}

export async function getOrders() {
  await delay();
  return readJson(storageKeys.orders, []);
}

export async function createOrder(payload) {
  await delay(320);
  const orders = readJson(storageKeys.orders, []);
  const order = {
    id: createId('ord'),
    number: createOrderNumber(),
    createdAt: new Date().toISOString(),
    status: 'received',
    ...payload,
  };
  writeJson(storageKeys.orders, [order, ...orders]);
  return order;
}

export async function getOrder(idOrNumber) {
  await delay();
  const orders = readJson(storageKeys.orders, []);
  return orders.find((order) => order.id === idOrNumber || order.number === idOrNumber) || null;
}

export async function updateOrderStatus(id, status) {
  await delay();
  const orders = readJson(storageKeys.orders, []);
  const next = orders.map((order) => (order.id === id ? { ...order, status } : order));
  writeJson(storageKeys.orders, next);
  return next.find((order) => order.id === id);
}

export async function adminLogin(email, password) {
  await delay(240);
  const restaurant = readJson(storageKeys.restaurant, restaurantSeed);
  const ok = email === restaurant.admin.email && password === restaurant.admin.password;
  if (!ok) {
    const error = new Error('Invalid email or password');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }
  const session = { email, at: Date.now() };
  writeJson(storageKeys.auth, session);
  return session;
}

export function getAdminSession() {
  return readJson(storageKeys.auth, null);
}

export function adminLogout() {
  localStorage.removeItem(storageKeys.auth);
}

export function resetDemoData() {
  writeJson(storageKeys.restaurant, restaurantSeed);
  writeJson(storageKeys.reviews, restaurantSeed.reviews);
}
