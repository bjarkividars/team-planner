import { Menu as BaseMenu } from "@base-ui/react/menu";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MenuProps {
  children: ReactNode;
}

interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
}

interface MenuContentProps {
  children: ReactNode;
  className?: string;
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface SubmenuProps {
  children: ReactNode;
}

interface SubmenuTriggerProps {
  children: ReactNode;
  className?: string;
}

interface SubmenuContentProps {
  children: ReactNode;
  className?: string;
}

const popupStyles = `
  bg-white border border-[var(--g-88)] rounded-lg shadow-lg py-1 min-w-[140px] outline-none
  origin-[var(--transform-origin)] transition-[transform,opacity] duration-150
  data-[starting-style]:opacity-0 data-[starting-style]:scale-95
  data-[ending-style]:opacity-0 data-[ending-style]:scale-95
`;
const itemStyles =
  "px-3 py-2 text-sm text-[var(--g-12)] cursor-pointer hover:bg-[var(--color-surface)] outline-none data-[highlighted]:bg-[var(--color-surface)]";

export function Menu({ children }: MenuProps) {
  return <BaseMenu.Root>{children}</BaseMenu.Root>;
}

export function MenuTrigger({ children, className }: MenuTriggerProps) {
  return (
    <BaseMenu.Trigger
      className={className}
      render={(props) => (
        <button {...props} type="button">
          {children}
        </button>
      )}
    />
  );
}

export function MenuContent({ children, className }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4} className="z-[99]">
        <BaseMenu.Popup className={`${popupStyles} ${className || ""}`}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuItem({ children, onClick, className }: MenuItemProps) {
  return (
    <BaseMenu.Item
      onClick={onClick}
      className={`${itemStyles} ${className || ""}`}
    >
      {children}
    </BaseMenu.Item>
  );
}

export function Submenu({ children }: SubmenuProps) {
  return <BaseMenu.SubmenuRoot>{children}</BaseMenu.SubmenuRoot>;
}

export function SubmenuTrigger({ children, className }: SubmenuTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger
      className={`${itemStyles} w-full flex items-center justify-between ${className || ""}`}
    >
      {children}
      <span className="text-[var(--g-20)]">›</span>
    </BaseMenu.SubmenuTrigger>
  );
}

export function SubmenuContent({ children, className }: SubmenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={0} alignOffset={-4} className="z-[100]">
        <BaseMenu.Popup className={`${popupStyles} ${className || ""}`}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

interface ClickMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  triggerClassName?: string;
}

export function ClickMenu({ children, trigger, triggerClassName }: ClickMenuProps) {
  const positionRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
  };

  const virtualAnchor = {
    getBoundingClientRect: () => ({
      x: positionRef.current.x,
      y: positionRef.current.y,
      width: 0,
      height: 0,
      top: positionRef.current.y,
      right: positionRef.current.x,
      bottom: positionRef.current.y,
      left: positionRef.current.x,
      toJSON: () => {},
    }),
  };

  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        className={triggerClassName}
        onMouseDown={handleMouseDown}
        nativeButton={false}
        render={(props) => (
          <div {...props}>
            {trigger}
          </div>
        )}
      />
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          sideOffset={4}
          className="z-[99]"
          anchor={virtualAnchor}
        >
          <BaseMenu.Popup className={popupStyles}>
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
