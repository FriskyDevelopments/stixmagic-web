import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

type PanelVariant = 'default' | 'secondary';

interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  variant?: PanelVariant;
  children?: ReactNode;
}

const variantClasses: Record<PanelVariant, string> = {
  default: 'bg-panel border border-accent-primary/20',
  secondary: 'bg-panel-secondary border border-accent-primary/10'
};

export const Panel = ({ className, variant = 'default', ...props }: PanelProps) => (
  <div
    className={cn(
      'rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_36px_rgba(99,102,241,0.35)]',
      variantClasses[variant],
      className
    )}
    {...props}
  />
);
