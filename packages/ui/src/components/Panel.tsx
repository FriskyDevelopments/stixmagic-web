import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';

type PanelVariant = 'default' | 'secondary';

interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  variant?: PanelVariant;
  children?: ReactNode;
}

const variantClasses: Record<PanelVariant, string> = {
  default: 'bg-panel border border-white/10',
  secondary: 'bg-panel-secondary border border-white/5'
};

export const Panel = ({ className, variant = 'default', ...props }: PanelProps) => (
  <div
    className={cn(
      'rounded-2xl p-6 shadow-[0_0_0_1px_rgba(124,242,255,0.04),0_24px_80px_rgba(5,6,11,0.45)] transition-transform duration-300 hover:-translate-y-1',
      variantClasses[variant],
      className
    )}
    {...props}
  />
);
