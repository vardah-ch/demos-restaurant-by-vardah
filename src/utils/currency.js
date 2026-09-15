export function formatMoney(value, currency = 'USD') {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}
