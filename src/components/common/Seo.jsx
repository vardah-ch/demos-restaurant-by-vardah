import { useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export function Seo({ title, description }) {
  const { restaurant } = useRestaurant();
  const pageTitle = title || restaurant.seo?.title || restaurant.name;
  const desc = description || restaurant.seo?.description || restaurant.description;

  useEffect(() => {
    document.title = pageTitle;
    const ensure = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name')) el.setAttribute('name', attr);
        if (selector.startsWith('meta[property')) el.setAttribute('property', attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    ensure('meta[name="description"]', 'description', desc);
    ensure('meta[property="og:title"]', 'og:title', pageTitle);
    ensure('meta[property="og:description"]', 'og:description', desc);
    ensure('meta[property="og:type"]', 'og:type', 'website');
    ensure('meta[property="og:image"]', 'og:image', restaurant.heroImage);

    let json = document.getElementById('restaurant-jsonld');
    if (!json) {
      json = document.createElement('script');
      json.id = 'restaurant-jsonld';
      json.type = 'application/ld+json';
      document.head.appendChild(json);
    }
    json.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: restaurant.description,
      telephone: restaurant.contact.phone,
      email: restaurant.contact.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.contact.address,
      },
      image: restaurant.heroImage,
      servesCuisine: 'Contemporary',
      url: window.location.origin,
    });
  }, [desc, pageTitle, restaurant]);

  return null;
}
