import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../common/Button';

export function ContactBlock() {
  const { restaurant } = useRestaurant();
  const { contact } = restaurant;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h2 className="font-display text-3xl">Contact</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-soft">
          <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href={contact.phoneHref}>{contact.phone}</a></p>
          <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> <a href={contact.whatsappHref}>WhatsApp</a></p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {contact.address}</p>
          <a href={contact.mapUrl} className="inline-block text-sm font-semibold text-secondary">Open map</a>
          <Button to="/menu" className="mt-4">Order now</Button>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="font-display text-2xl">Hours</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {restaurant.hours.map((row) => (
              <li key={row.day} className="flex justify-between">
                <span>{row.day}</span>
                <span>{row.closed ? 'Closed' : `${row.open}–${row.close}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
