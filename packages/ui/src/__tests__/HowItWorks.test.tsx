import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HowItWorks } from '../components/HowItWorks';

// Mock framer-motion so motion.li renders as a plain <li>
vi.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(
          (
            { children, initial: _i, animate: _a, whileInView: _w, viewport: _v, transition: _t, ...rest }: Record<string, unknown>,
            ref: React.Ref<unknown>
          ) =>
            React.createElement(tag, { ref, ...rest }, children)
        ),
    }
  );
  return { motion };
});

describe('HowItWorks', () => {
  it('renders the section heading text', () => {
    render(<HowItWorks />);
    expect(screen.getByText('The Λlchemy')).toBeInTheDocument();
    expect(screen.getByText('How the transformation works')).toBeInTheDocument();
  });

  it('renders the introductory description', () => {
    render(<HowItWorks />);
    expect(
      screen.getByText('Four steps from raw image to living magic in chat.')
    ).toBeInTheDocument();
  });

  it('renders the section with id="how-it-works"', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector('section#how-it-works');
    expect(section).not.toBeNull();
  });

  it('renders the steps container as an <ol> element', () => {
    const { container } = render(<HowItWorks />);
    const ol = container.querySelector('section > ol');
    expect(ol).not.toBeNull();
    expect(ol!.tagName).toBe('OL');
  });

  it('renders exactly 4 step <li> elements inside the <ol>', () => {
    const { container } = render(<HowItWorks />);
    const ol = container.querySelector('section > ol');
    const steps = ol!.querySelectorAll(':scope > li');
    expect(steps).toHaveLength(4);
  });

  it('renders all four step titles', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Feed your image')).toBeInTheDocument();
    expect(screen.getByText('Choose a mask style')).toBeInTheDocument();
    expect(screen.getByText('Add an enchantment')).toBeInTheDocument();
    expect(screen.getByText('Release into the world')).toBeInTheDocument();
  });

  it('renders all four step descriptions', () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(/Start with any image — photo, illustration, or artwork/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Select the shape that transforms your image/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Optionally connect your sticker to a reply, reaction/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Publish to chat and watch your community wield stickers/)
    ).toBeInTheDocument();
  });

  it('renders step number symbols with aria-hidden="true"', () => {
    const { container } = render(<HowItWorks />);
    // Each step number <p> has aria-hidden="true"
    const ariaHiddenEls = container.querySelectorAll('[aria-hidden="true"]');
    expect(ariaHiddenEls.length).toBeGreaterThanOrEqual(4);
  });

  it('each step number element has aria-hidden="true" and not the title', () => {
    render(<HowItWorks />);
    // Step titles should be accessible (not hidden)
    const titleEl = screen.getByText('Feed your image');
    expect(titleEl).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the step number symbols for visual decoration', () => {
    const { container } = render(<HowItWorks />);
    // The 4 step number symbols are aria-hidden paragraphs
    const hiddenPs = container.querySelectorAll('p[aria-hidden="true"]');
    expect(hiddenPs).toHaveLength(4);
    const symbols = Array.from(hiddenPs).map((el) => el.textContent);
    expect(symbols).toContain('△');
    expect(symbols).toContain('◯');
    expect(symbols).toContain('✦');
    expect(symbols).toContain('🪄');
  });

  it('step titles are rendered as <h3> elements', () => {
    const { container } = render(<HowItWorks />);
    const headings = container.querySelectorAll('h3');
    expect(headings).toHaveLength(4);
    const headingTexts = Array.from(headings).map((h) => h.textContent);
    expect(headingTexts).toContain('Feed your image');
    expect(headingTexts).toContain('Choose a mask style');
    expect(headingTexts).toContain('Add an enchantment');
    expect(headingTexts).toContain('Release into the world');
  });

  // Regression: outer steps container is NOT a plain <div> (changed in this PR)
  it('does not use a <div> as the steps container', () => {
    const { container } = render(<HowItWorks />);
    const divGrid = container.querySelector('section > div.grid');
    expect(divGrid).toBeNull();
  });

  // Boundary: step numbers are hidden from assistive technology
  it('step number paragraphs are excluded from the accessibility tree', () => {
    const { container } = render(<HowItWorks />);
    const ariaHiddenParagraphs = container.querySelectorAll('p[aria-hidden="true"]');
    ariaHiddenParagraphs.forEach((el) => {
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });
});