import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function AdminLogin() {
  const { restaurant } = useRestaurant();
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    setPending(true);
    setError('');
    try {
      await login(String(form.get('email')), String(form.get('password')));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="font-display text-3xl">{restaurant.name} admin</h1>
        <p className="mt-2 text-sm text-muted">
          Demo login: {restaurant.admin.email} / {restaurant.admin.password}
        </p>
        {error ? <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
        <label className="mt-4 block text-sm font-semibold" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="mt-1 w-full rounded-2xl border px-3 py-2" defaultValue={restaurant.admin.email} />
        <label className="mt-3 block text-sm font-semibold" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="mt-1 w-full rounded-2xl border px-3 py-2" defaultValue={restaurant.admin.password} />
        <Button type="submit" className="mt-6 w-full" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </div>
  );
}
