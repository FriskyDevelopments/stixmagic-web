'use client';

import { useState } from 'react';
import { cn } from '../lib/cn';

export interface GeneratorStep {
  id: string;
  label: string;
  description: string;
  comingSoon?: boolean;
}

interface GeneratorScaffoldProps {
  steps: GeneratorStep[];
}

export const GeneratorScaffold = ({ steps }: GeneratorScaffoldProps) => {
  const [activeStep, setActiveStep] = useState(steps[0]?.id ?? '');

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6">
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => !step.comingSoon && setActiveStep(step.id)}
            aria-disabled={step.comingSoon}
            aria-current={step.id === activeStep ? 'step' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50',
              step.id === activeStep
                ? 'border-accent-primary bg-accent-primary/10 text-text'
                : step.comingSoon
                  ? 'cursor-not-allowed border-white/5 bg-panel-secondary text-muted/50'
                  : 'border-white/10 bg-panel-secondary text-muted hover:border-white/30 hover:text-text'
            )}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background text-xs text-accent-cyan">
              {index + 1}
            </span>
            {step.label}
            {step.comingSoon && (
              <span className="rounded-full bg-accent-violet/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-accent-violet">
                soon
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {steps.map((step) =>
          step.id === activeStep ? (
            <div key={step.id} className="rounded-xl border border-white/10 bg-panel-secondary p-6">
              <p className="text-xs uppercase tracking-wider text-accent-cyan">{step.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              {step.comingSoon ? (
                <div className="mt-4 rounded-xl border border-accent-violet/20 bg-accent-violet/5 p-4">
                  <p className="text-sm text-accent-violet">
                    This step is being built as part of the generator pipeline integration.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-background p-8 text-center">
                  <p className="text-sm text-muted">Generator UI component will render here.</p>
                  <p className="mt-1 text-xs text-muted/60">Connected to the MagicStix pipeline when available.</p>
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
