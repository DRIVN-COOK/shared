import { useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  maxWidth?: string; // ex: 'max-w-3xl'
};

export function Modal({ open, onClose, className = '', children, maxWidth = 'max-w-3xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className={`bg-white rounded shadow-md w-full ${maxWidth} max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
