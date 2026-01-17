import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import type { ReactNode } from 'react';

interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  name?: string;
}

interface RadioRootProps {
  children: ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

interface RadioIndicatorProps {
  children?: ReactNode;
  className?: string;
}

export function RadioGroup({ children, value, defaultValue, onValueChange, className, name }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      className={className}
    >
      {children}
    </BaseRadioGroup>
  );
}

export function RadioRoot({ children, value, className, disabled }: RadioRootProps) {
  return (
    <BaseRadio.Root
      value={value}
      disabled={disabled}
      className={className}
    >
      {children}
    </BaseRadio.Root>
  );
}

export function RadioIndicator({ children, className }: RadioIndicatorProps) {
  return (
    <BaseRadio.Indicator className={className}>
      {children}
    </BaseRadio.Indicator>
  );
}
