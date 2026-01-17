import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface DialogCloseProps {
  children: ReactNode;
  className?: string;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDialog.Root>
  );
}

export function DialogTrigger({ children, className }: DialogTriggerProps) {
  return (
    <BaseDialog.Trigger
      className={className}
      render={(props) => (
        <button {...props} type="button">
          {children}
        </button>
      )}
    />
  );
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className="fixed inset-0 z-100 bg-black/40 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0"
      />
      <BaseDialog.Popup
        className={`
          fixed z-101 bg-white shadow-xl outline-none transition-all

          bottom-0 left-0 right-0 rounded-t-2xl p-6 pb-8
          max-h-[85vh] overflow-y-auto
          data-starting-style:translate-y-full
          data-ending-style:translate-y-full

          md:bottom-auto md:left-1/2 md:right-auto md:top-1/2
          md:-translate-x-1/2 md:-translate-y-1/2
          md:rounded-xl md:min-w-[320px] md:max-h-none md:pb-6
          md:data-starting-style:translate-y-0 md:data-starting-style:opacity-0 md:data-starting-style:scale-95
          md:data-ending-style:translate-y-0 md:data-ending-style:opacity-0 md:data-ending-style:scale-95
          ${className || ''}
        `}
      >
        <div className="w-12 h-1 bg-(--g-88) rounded-full mx-auto mb-4 md:hidden" />
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      className={`text-lg font-semibold text-(--g-12) mb-4 ${className || ''}`}
    >
      {children}
    </BaseDialog.Title>
  );
}

export function DialogClose({ children, className }: DialogCloseProps) {
  return (
    <BaseDialog.Close
      className={className}
      render={(props) => (
        <button {...props} type="button">
          {children}
        </button>
      )}
    />
  );
}
