import { roundMoney } from './currency';

export function unitPrice(product, { variant, addOns = [] } = {}) {
  const base = Number(product?.price) || 0;
  const variantDelta = Number(variant?.priceDelta) || 0;
  const extras = addOns.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  return roundMoney(base + variantDelta + extras);
}

export function lineTotal(item) {
  return roundMoney(unitPrice(item.product, item) * (item.quantity || 1));
}

export function cartTotals({ items, orderType, area, promo, deliveryConfig }) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + lineTotal(item), 0));
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    deliveryFee = area?.fee ?? deliveryConfig?.fee ?? 0;
  }
  let discount = 0;
  if (promo?.active) {
    if (promo.discountType === 'percent' && promo.discountValue) {
      if (!promo.minSubtotal || subtotal >= promo.minSubtotal) {
        discount = roundMoney(subtotal * (promo.discountValue / 100));
      }
    }
    if (promo.discountType === 'fixed' && promo.discountValue) {
      if (!promo.minSubtotal || subtotal >= promo.minSubtotal) {
        discount = Math.min(promo.discountValue, subtotal);
      }
    }
  }
  const total = roundMoney(Math.max(0, subtotal + deliveryFee - discount));
  return { subtotal, deliveryFee, discount, total };
}
