import { Bike, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatMoney } from '../../utils/currency';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export function FulfillmentBar() {
  const { restaurant } = useRestaurant();
  const { fulfillment, setOrderType, selectedArea, setLocationOpen } = useCart();
  const delivery = restaurant.delivery;
  const pickup = restaurant.pickup;

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="grid gap-4 rounded-3xl bg-white p-4 shadow-soft md:grid-cols-2">
        <button
          type="button"
          onClick={() => setOrderType('delivery')}
          disabled={!delivery.enabled}
          className={`rounded-2xl p-4 text-left ${fulfillment.orderType === 'delivery' ? 'bg-primary text-white' : 'bg-background'}`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Bike className="h-5 w-5" /> Delivery
          </div>
          {fulfillment.orderType === 'delivery' ? (
            <div className="mt-3 space-y-1 text-sm text-white/90">
              <p>Delivering to {selectedArea?.name || 'an unselected area'}</p>
              <p>Fee {formatMoney(selectedArea?.fee ?? delivery.fee)} · {selectedArea?.eta || delivery.estimatedTime}</p>
              <p>Min order {formatMoney(delivery.minimumOrder)}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">{delivery.estimatedTime}</p>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOrderType('pickup')}
          disabled={!pickup.enabled}
          className={`rounded-2xl p-4 text-left ${fulfillment.orderType === 'pickup' ? 'bg-primary text-white' : 'bg-background'}`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Store className="h-5 w-5" /> Pickup
          </div>
          {fulfillment.orderType === 'pickup' ? (
            <div className="mt-3 space-y-1 text-sm text-white/90">
              <p>{pickup.address}</p>
              <p>Ready in {pickup.estimatedTime}</p>
              <p>{pickup.instructions}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">{pickup.estimatedTime}</p>
          )}
        </button>
        {fulfillment.orderType === 'delivery' ? (
          <div className="md:col-span-2">
            <Button variant="outline" onClick={() => setLocationOpen(true)}>
              Change location
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function LocationModal() {
  const { restaurant } = useRestaurant();
  const { locationOpen, setLocationOpen, setAreaId, selectedArea, setOrderType } = useCart();
  return (
    <Modal open={locationOpen} onClose={() => setLocationOpen(false)} title="Choose a delivery area">
      <ul className="space-y-2">
        {restaurant.delivery.areas.map((area) => (
          <li key={area.id}>
            <button
              type="button"
              disabled={!area.available}
              onClick={() => {
                setAreaId(area.id);
                setOrderType('delivery');
                setLocationOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${
                selectedArea?.id === area.id ? 'bg-primary text-white' : 'bg-white'
              } ${!area.available ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <span>
                <span className="block font-semibold">{area.name}</span>
                <span className="text-sm opacity-80">
                  {area.available ? `${area.eta} · ${formatMoney(area.fee)}` : 'Not available right now'}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
