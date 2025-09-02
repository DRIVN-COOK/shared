import { useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  className?: string;      // classes appliquées à l’INTÉRIEUR (contenu)
  children: React.ReactNode;
  maxWidth?: string;       // ex: 'max-w-3xl'
};

export function Modal({ open, onClose, className = '', children, maxWidth = 'max-w-3xl' }: ModalProps) {
  // Lock simple (évite le body en position:fixed qui casse le scroll interne sur certains navigateurs)
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30" role="dialog" aria-modal="true" onClick={onClose}>
      {/* overlay flex qui n'essaie pas de scroller lui-même */}
      <div className="flex min-h-full items-start justify-center p-4">
        {/* Panneau: hauteur max écran - padding overlay ; FLEX COL pour isoler la zone scrollable */}
        <div
          className={`w-full ${maxWidth} bg-white rounded shadow-md max-h-[calc(100vh-2rem)] flex flex-col min-h-0`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Zone SCROLLABLE interne */}
          <div className="flex-1 overflow-y-auto min-h-0 pt-16 [-webkit-overflow-scrolling:touch]">
            <div className={className}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
