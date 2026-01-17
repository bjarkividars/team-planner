import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface InlineSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  iconSize?: number;
}

const popupStyles = `
  bg-white border border-[var(--g-88)] rounded-lg shadow-lg py-1 min-w-[140px] outline-none
  origin-[var(--transform-origin)] transition-[transform,opacity] duration-150
  data-[starting-style]:opacity-0 data-[starting-style]:scale-95
  data-[ending-style]:opacity-0 data-[ending-style]:scale-95
`;

const itemStyles =
  "px-3 py-2 text-sm text-[var(--g-12)] cursor-pointer hover:bg-[var(--color-surface)] outline-none data-[highlighted]:bg-[var(--color-surface)]";

export function InlineSelect({
  value,
  options,
  onChange,
  placeholder = "select",
  className = "",
  iconSize = 16,
}: InlineSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        className={`inline-flex items-center gap-1 hover:underline focus:underline cursor-pointer outline-none ${className}`}
      >
        <span className={!selectedOption ? "text-[var(--g-20)]" : ""}>
          {displayText}
        </span>
        <ChevronDown size={iconSize} className="text-[var(--g-20)]" />
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner sideOffset={4} className="z-[99]">
          <BaseMenu.Popup className={popupStyles}>
            {options.map((option) => (
              <BaseMenu.Item
                key={option.value}
                onClick={() => onChange(option.value)}
                className={itemStyles}
              >
                {option.label}
              </BaseMenu.Item>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
