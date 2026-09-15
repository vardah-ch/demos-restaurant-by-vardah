import { Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatMoney } from '../../utils/currency';
import { unitPrice } from '../../utils/pricing';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SafeImage } from '../common/SafeImage';
import { StarRating } from '../common/StarRating';

export function ProductModal() {
  const { productModal, setProductModal, addItem } = useCart();
  const { push } = useToast();
  const product = productModal;
  const [variantId, setVariantId] = useState(null);
  const [addOnIds, setAddOnIds] = useState([]);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');

  const open = Boolean(product);

  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants?.find((item) => item.id === variantId) || product.variants?.[0] || null;
  }, [product, variantId]);

  const addOns = useMemo(
    () => (product?.addOns || []).filter((item) => addOnIds.includes(item.id)),
    [addOnIds, product],
  );

  const price = product ? unitPrice(product, { variant, addOns }) * qty : 0;

  useEffect(() => {
    if (!product) return;
    setVariantId(product.variants?.[0]?.id || null);
    setAddOnIds([]);
    setQty(1);
    setInstructions('');
  }, [product]);

  const close = () => setProductModal(null);

  return (
    <Modal open={open} onClose={close} title={product?.name} wide>
      {product ? (
        <div className="grid gap-6 md:grid-cols-2">
          <SafeImage src={product.image} alt={product.name} className="h-64 w-full rounded-3xl object-cover md:h-full" />
          <div>
            {!product.available ? (
              <p className="mb-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800">This item is currently unavailable.</p>
            ) : null}
            <p className="text-muted">{product.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <StarRating value={product.rating} />
              <span className="text-sm text-muted">{product.rating} · {product.reviewCount} ratings</span>
            </div>
            {product.weight ? <p className="mt-2 text-sm text-muted">Weight / size: {product.weight}</p> : null}
            {product.ingredients?.length ? (
              <p className="mt-3 text-sm"><span className="font-semibold">Ingredients:</span> {product.ingredients.join(', ')}</p>
            ) : null}
            {product.allergens?.length ? (
              <p className="mt-1 text-sm"><span className="font-semibold">Allergens:</span> {product.allergens.join(', ')}</p>
            ) : null}

            {product.variants?.length ? (
              <fieldset className="mt-5">
                <legend className="text-sm font-semibold">Size</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((item) => (
                    <label
                      key={item.id}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                        (variant?.id || variantId) === item.id ? 'border-primary bg-primary text-white' : 'border-primary/20 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name="variant"
                        checked={(variant?.id || variantId) === item.id}
                        onChange={() => setVariantId(item.id)}
                      />
                      {item.name}
                      {item.priceDelta ? ` · +${formatMoney(item.priceDelta)}` : ''}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {product.addOns?.length ? (
              <fieldset className="mt-5">
                <legend className="text-sm font-semibold">Extras</legend>
                <div className="mt-2 space-y-2">
                  {product.addOns.map((item) => (
                    <label key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={addOnIds.includes(item.id)}
                          onChange={() =>
                            setAddOnIds((prev) =>
                              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                            )
                          }
                        />
                        {item.name}
                      </span>
                      <span>{formatMoney(item.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <label className="mt-5 block text-sm font-semibold" htmlFor="instructions">
              Special instructions
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-primary/15 bg-white px-3 py-2 text-sm"
              rows={2}
              placeholder="No onion, extra napkins..."
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex items-center rounded-full bg-white p-1">
                <button type="button" className="p-2" aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button type="button" className="p-2" aria-label="Increase quantity" onClick={() => setQty((n) => n + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="font-display text-2xl">{formatMoney(price)}</p>
            </div>
            <Button
              className="mt-4 w-full"
              disabled={!product.available}
              onClick={() => {
                addItem({ product, variant, addOns, quantity: qty, instructions });
                push(`${product.name} added to cart`);
                close();
              }}
            >
              Add to cart · {formatMoney(price)}
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
