import {
  BadgePercent,
  Beef,
  Bike,
  CakeSlice,
  Coffee,
  CupSoda,
  Leaf,
  Pizza,
  Salad,
  Sandwich,
  Smartphone,
  Star,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';

const ICONS = {
  BadgePercent,
  Beef,
  Bike,
  CakeSlice,
  Coffee,
  CupSoda,
  Leaf,
  Pizza,
  Salad,
  Sandwich,
  Smartphone,
  Star,
  Utensils,
  UtensilsCrossed,
};

export function Icon({ name, className, ...props }) {
  const Cmp = ICONS[name] || Star;
  return <Cmp className={className} aria-hidden="true" {...props} />;
}
