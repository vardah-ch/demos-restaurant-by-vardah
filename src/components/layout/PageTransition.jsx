import { motion, useReducedMotion } from 'framer-motion';

export function PageTransition({ children }) {
  const reduce = useReducedMotion();
  if (reduce) return children;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  );
}
