import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName | undefined;
  /** Icon-only button: children become the accessible label. */
  iconOnly?: boolean | undefined;
  children: ReactNode;
}

function classes(variant: Variant, size: Size, iconOnly: boolean, extra?: string) {
  return [styles.button, styles[variant], styles[size], iconOnly && styles.iconOnly, extra].filter(Boolean).join(' ');
}

function Content({ icon, iconOnly, children }: Pick<CommonProps, 'icon' | 'iconOnly' | 'children'>) {
  return (
    <>
      {icon && <Icon name={icon} className={styles.icon} />}
      {iconOnly ? <span className="visually-hidden">{children}</span> : <span>{children}</span>}
    </>
  );
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconOnly = false,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={classes(variant, size, iconOnly, className)}
      title={iconOnly && typeof children === 'string' ? children : undefined}
      {...rest}
    >
      <Content icon={icon} iconOnly={iconOnly}>
        {children}
      </Content>
    </button>
  );
}

/** Same look as Button, for navigation (hash links). */
export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  icon,
  iconOnly = false,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes(variant, size, iconOnly, className)} {...rest}>
      <Content icon={icon} iconOnly={iconOnly}>
        {children}
      </Content>
    </a>
  );
}
