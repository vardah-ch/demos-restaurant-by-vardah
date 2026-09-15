import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const reduce = useReducedMotion();
  const styles = {
    primary:
      'bg-primary text-white hover:bg-primary/90 shadow-soft',
    secondary:
      'bg-secondary text-white hover:bg-secondary/90',
    outline:
      'border border-primary/20 bg-white text-ink hover:border-primary/40',
    ghost: 'bg-transparent text-ink hover:bg-white/60',
    accent: 'bg-accent text-ink hover:bg-accent/90',
  };
  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    !reduce && 'hover:-translate-y-0.5 active:translate-y-0',
    styles[variant],
    className,
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}
