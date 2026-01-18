import { useRef, useState, useEffect, type InputHTMLAttributes } from 'react';
import { measureTextWidth } from '../../lib/measureText';

interface InlineTextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'value' | 'onChange'> {
  value: number;
  onValueChange: (value: number) => void;
  minWidth?: number;
  maxWidth?: number;
  formatDisplay?: (value: number) => string;
  parseInput?: (input: string) => number;
  suffix?: string;
}

export function InlineTextInput({
  value,
  onValueChange,
  minWidth = 20,
  maxWidth,
  formatDisplay = (v) => v.toLocaleString('en-US'),
  parseInput = (s) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0,
  suffix,
  className = '',
  ...props
}: InlineTextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [font, setFont] = useState('14px system-ui');

  useEffect(() => {
    const updateFont = () => {
      if (inputRef.current) {
        const computed = getComputedStyle(inputRef.current);
        setFont(`${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`);
      }
    };
    updateFont();
    window.addEventListener('resize', updateFont);
    return () => window.removeEventListener('resize', updateFont);
  }, []);

  const displayValue = isEditing ? editValue : formatDisplay(value);

  const measured = measureTextWidth(displayValue || ' ', font);
  let width = Math.max(minWidth, measured + 4);
  if (maxWidth !== undefined) {
    width = Math.min(maxWidth, width);
  }

  const handleFocus = () => {
    setIsEditing(true);
    setEditValue(value === 0 ? '' : formatDisplay(value));
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInput(editValue);
    onValueChange(parsed);
  };

  const formatDigits = (digits: string): string => {
    if (!digits) return '';
    const reversed = digits.split('').reverse();
    const withCommas: string[] = [];
    for (let i = 0; i < reversed.length; i++) {
      if (i > 0 && i % 3 === 0) {
        withCommas.push(',');
      }
      withCommas.push(reversed[i]);
    }
    return withCommas.reverse().join('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;

    const raw = e.target.value.replace(/[^0-9]/g, '');
    const formatted = formatDigits(raw);

    const inputValue = e.target.value;
    const digitsBeforeCursorInInput = inputValue.slice(0, cursorPos).replace(/[^0-9]/g, '').length;

    let newCursor = 0;
    let digitCount = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (digitCount === digitsBeforeCursorInInput) {
        newCursor = i;
        break;
      }
      if (/[0-9]/.test(formatted[i])) {
        digitCount++;
      }
      newCursor = i + 1;
    }

    setEditValue(formatted);

    requestAnimationFrame(() => {
      input.setSelectionRange(newCursor, newCursor);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setEditValue(value.toString());
      inputRef.current?.blur();
    }
  };

  return (
    <span className="relative inline-flex items-center">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-none outline-none ${className}`}
        style={{ width }}
        {...props}
      />
      {suffix && <span className="no-underline">{suffix}</span>}
    </span>
  );
}
