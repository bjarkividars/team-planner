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
        className="fixed inset-0 z-[100] bg-black/40 transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
      />
      <BaseDialog.Popup
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]
          bg-white rounded-xl p-6 shadow-xl min-w-[320px]
          outline-none
          transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95
          data-[ending-style]:opacity-0 data-[ending-style]:scale-95
          ${className || ''}
        `}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      className={`text-lg font-semibold text-[var(--g-12)] mb-4 ${className || ''}`}
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
