import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useEscape } from '../../hooks/useEscape';
import { useLockBody } from '../../hooks/useLockBody';

export function Modal({ open, onClose, title, children, labelledBy = 'modal-title', wide = false }) {
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? labelledBy : undefined}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-background shadow-lift sm:rounded-3xl ${wide ? 'max-w-4xl' : 'max-w-xl'}`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background/95 px-5 py-4 backdrop-blur">
              {title ? (
                <h2 id={labelledBy} className="font-display text-2xl text-ink">
                  {title}
                </h2>
              ) : (
                <span />
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-ink hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
