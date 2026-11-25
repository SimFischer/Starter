import { useId, type KeyboardEvent } from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface Props<T extends string> {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Large touch-friendly single choice (radio group semantics).
 * Arrow keys move the selection, as with native radio buttons.
 */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  const labelId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = options.findIndex((o) => o.value === value);
    const next = options[(index + step + options.length) % options.length];
    if (next) {
      onChange(next.value);
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      buttons[options.indexOf(next)]?.focus();
    }
  };

  return (
    <div className={styles.group} role="radiogroup" aria-labelledby={labelId} onKeyDown={onKeyDown}>
      <span id={labelId} className="visually-hidden">
        {label}
      </span>
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={styles.segment}
            onClick={() => onChange(option.value)}
          >
            <span className={styles.label}>{option.label}</span>
            {option.hint && <span className={styles.hint}>{option.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
