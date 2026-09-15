# Demos Kitchen — restaurant ordering template

Reusable React frontend for restaurant websites with online ordering. Demo restaurant data is fictional. Swap configuration to launch a new client.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Dependencies

- react, react-dom
- vite, @vitejs/plugin-react
- tailwindcss, @tailwindcss/vite
- react-router-dom
- lucide-react
- framer-motion

## Where to customize

1. **Restaurant information** — `src/config/restaurant.js` (`name`, `tagline`, `description`, `story`, `contact`, `hours`, `logo`, images).
2. **Colors** — `restaurant.colors` in the same file (`primary`, `secondary`, `accent`, `background`). They are applied as CSS variables.
3. **Products** — `restaurant.products` (or Admin → Menu).
4. **Categories** — `restaurant.categories` (or Admin → Categories).
5. **Offers** — `restaurant.offers` (or Admin → Offers).
6. **Reviews** — `restaurant.reviews` (guests can also submit from the site; Admin moderates).

Admin demo login is in `restaurant.admin` (default `admin@demoskitchen.example` / `demo1234`).

## Connecting to Express + PostgreSQL later

Replace function bodies in `src/services/api.js` with `fetch` calls. Keep the same return shapes.

Suggested API map:

- `GET/PUT /api/restaurant`
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/offers`
- `POST /api/orders` · `GET /api/orders/:id` · `PATCH /api/orders/:id/status`
- `GET/POST /api/reviews` · moderation routes for admin
- `POST /api/admin/login`

Sequelize models can mirror the objects in `restaurant.js` (Product, Category, Offer, Review, Order, OrderItem).

## Notes

- Cart, orders, reviews, and admin edits persist in `localStorage` for the demo.
- Online payment is a UI placeholder only. No charges are processed.
- If the UI looks stuck on old demo data, clear site storage for this origin.
