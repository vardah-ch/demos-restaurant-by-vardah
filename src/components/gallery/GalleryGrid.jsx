import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useEscape } from '../../hooks/useEscape';
import { useLockBody } from '../../hooks/useLockBody';
import { SafeImage } from '../common/SafeImage';

export function GalleryGrid() {
  const { restaurant } = useRestaurant();
  const [index, setIndex] = useState(null);
  const open = index !== null;
  useLockBody(open);
  useEscape(open, () => setIndex(null));
  const images = restaurant.gallery || [];
  if (!images.length) return null;

  const current = images[index] || images[0];
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h2 className="font-display text-3xl">Gallery</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((image, i) => (
          <button key={image.id} type="button" className="group overflow-hidden rounded-3xl" onClick={() => setIndex(i)}>
            <SafeImage src={image.src} alt={image.alt} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105 md:h-56" />
          </button>
        ))}
      </div>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4">
          <button type="button" className="absolute inset-0" aria-label="Close lightbox" onClick={() => setIndex(null)} />
          <div className="relative z-10 w-full max-w-4xl">
            <SafeImage src={current.src} alt={current.alt} className="max-h-[80vh] w-full rounded-3xl object-contain" />
            <p className="mt-3 text-center text-sm text-white">{current.alt}</p>
            <button type="button" aria-label="Close" className="absolute -top-10 right-0 text-white" onClick={() => setIndex(null)}>
              <X />
            </button>
            <button type="button" aria-label="Previous" className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2" onClick={prev}>
              <ChevronLeft />
            </button>
            <button type="button" aria-label="Next" className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2" onClick={next}>
              <ChevronRight />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
