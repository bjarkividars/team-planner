import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ReactNode } from 'react';

interface ContextMenuProps {
  children: ReactNode;
}

interface ContextMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

interface ContextMenuContentProps {
  children: ReactNode;
  className?: string;
}

interface ContextMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'danger';
}

interface ContextMenuSeparatorProps {
  className?: string;
}

export function ContextMenu({ children }: ContextMenuProps) {
  return <BaseContextMenu.Root>{children}</BaseContextMenu.Root>;
}

export function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  return (
    <BaseContextMenu.Trigger className={className}>
      {children}
    </BaseContextMenu.Trigger>
  );
}

export function ContextMenuContent({ children, className }: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner sideOffset={4} className="z-[99]">
        <BaseContextMenu.Popup
          className={`
            bg-white border border-[var(--g-88)] rounded-lg shadow-lg py-1 min-w-[160px]
            outline-none
            ${className || ''}
          `}
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

export function ContextMenuItem({ children, onClick, className, variant = 'default' }: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      onClick={onClick}
      className={`
        px-3 py-2 text-sm cursor-pointer outline-none
        data-[highlighted]:bg-[var(--color-surface)]
        ${variant === 'danger'
          ? 'text-red-600 data-[highlighted]:text-red-700'
          : 'text-[var(--g-12)]'
        }
        ${className || ''}
      `}
    >
      {children}
    </BaseContextMenu.Item>
  );
}

export function ContextMenuSeparator({ className }: ContextMenuSeparatorProps) {
  return (
    <BaseContextMenu.Separator
      className={`
        h-px bg-[var(--g-88)] my-1
        ${className || ''}
      `}
    />
  );
}
