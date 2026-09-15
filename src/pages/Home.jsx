import { FulfillmentBar } from '../components/cart/LocationModal';
import { ContactBlock } from '../components/contact/ContactBlock';
import { FeaturesSection } from '../components/offers/FeaturesSection';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { Hero } from '../components/hero/Hero';
import { AboutSection } from '../components/offers/AboutSection';
import { OffersSection } from '../components/offers/OffersSection';
import { BestSellers } from '../components/menu/BestSellers';
import { CategoryGrid } from '../components/menu/CategoryGrid';
import { ReviewsSection } from '../components/reviews/ReviewsSection';

export default function Home() {
  return (
    <>
      <Hero />
      <FulfillmentBar />
      <CategoryGrid />
      <BestSellers />
      <OffersSection />
      <FeaturesSection />
      <AboutSection />
      <GalleryGrid />
      <ReviewsSection />
      <ContactBlock />
    </>
  );
}
