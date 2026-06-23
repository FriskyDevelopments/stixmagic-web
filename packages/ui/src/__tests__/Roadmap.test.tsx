import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Roadmap } from '../components/Roadmap';

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

describe('Roadmap', () => {
  it('renders the section heading text', () => {
    render(<Roadmap />);
    expect(screen.getByText('The journey')).toBeInTheDocument();
    expect(screen.getByText(/What.s forging over time/)).toBeInTheDocument();
  });

  it('renders the introductory description', () => {
    render(<Roadmap />);
    expect(
      screen.getByText(/STIX MΛGIC is evolving in clear stages/)
    ).toBeInTheDocument();
  });

  it('renders the phases container as a <ul> element', () => {
    const { container } = render(<Roadmap />);
    const outerList = container.querySelector('section > ul');
    expect(outerList).not.toBeNull();
    expect(outerList!.tagName).toBe('UL');
  });

  it('renders exactly 4 phase <li> elements inside the outer <ul>', () => {
    const { container } = render(<Roadmap />);
    const outerList = container.querySelector('section > ul');
    const phaseLis = outerList!.querySelectorAll(':scope > li');
    expect(phaseLis).toHaveLength(4);
  });

  it('renders all four phase headings', () => {
    render(<Roadmap />);
    expect(screen.getByText('Available now')).toBeInTheDocument();
    // "In progress" appears as both phase heading and status badge
    expect(screen.getAllByText('In progress').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Coming next')).toBeInTheDocument();
    // "Future" appears as both phase heading and status badge
    expect(screen.getAllByText('Future').length).toBeGreaterThanOrEqual(1);
  });

  it('renders status badge labels for each phase', () => {
    render(<Roadmap />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
    // "In progress" appears as both a phase heading and a status badge
    const inProgressEls = screen.getAllByText('In progress');
    expect(inProgressEls.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    // "Future" appears as both a phase heading and a status badge
    const futureEls = screen.getAllByText('Future');
    expect(futureEls.length).toBeGreaterThanOrEqual(2);
  });

  it('renders items from the "Available now" phase', () => {
    render(<Roadmap />);
    expect(screen.getByText('Sticker pack creation flow')).toBeInTheDocument();
    expect(screen.getByText('Core mask catalog')).toBeInTheDocument();
    expect(screen.getByText('Telegram-ready publishing path')).toBeInTheDocument();
    expect(screen.getByText('Live project updates')).toBeInTheDocument();
  });

  it('renders items from the "In progress" phase', () => {
    render(<Roadmap />);
    expect(screen.getByText('Smoother publishing UX')).toBeInTheDocument();
    expect(screen.getByText('More polished creator controls')).toBeInTheDocument();
    expect(screen.getByText('Expanded interaction options')).toBeInTheDocument();
    expect(screen.getByText('Faster feedback loop')).toBeInTheDocument();
  });

  it('renders items from the "Coming next" phase', () => {
    render(<Roadmap />);
    expect(screen.getByText('Ready-made interaction templates')).toBeInTheDocument();
    expect(screen.getByText('Deeper bot behavior options')).toBeInTheDocument();
    expect(screen.getByText('Improved reliability at scale')).toBeInTheDocument();
    expect(screen.getByText('Better creator insights')).toBeInTheDocument();
  });

  it('renders items from the "Future" phase', () => {
    render(<Roadmap />);
    expect(screen.getByText('Support for more chat platforms')).toBeInTheDocument();
    expect(screen.getByText('Advanced visual mask effects')).toBeInTheDocument();
    expect(screen.getByText('Team workflows and collaboration')).toBeInTheDocument();
    expect(screen.getByText('Marketplace-style discovery')).toBeInTheDocument();
  });

  it('renders bullet separator spans with aria-hidden="true"', () => {
    const { container } = render(<Roadmap />);
    // Each item's bullet "·" span should be aria-hidden
    const ariaHiddenSpans = container.querySelectorAll('span[aria-hidden="true"]');
    // 4 items per phase × 4 phases = 16 bullet spans
    expect(ariaHiddenSpans).toHaveLength(16);
  });

  it('bullet spans contain "·" and are hidden from assistive tech', () => {
    const { container } = render(<Roadmap />);
    const ariaHiddenSpans = container.querySelectorAll('span[aria-hidden="true"]');
    ariaHiddenSpans.forEach((span) => {
      expect(span.textContent).toBe('·');
      expect(span).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders phase headings as <h3> elements', () => {
    const { container } = render(<Roadmap />);
    const headings = container.querySelectorAll('h3');
    expect(headings).toHaveLength(4);
    const headingTexts = Array.from(headings).map((h) => h.textContent);
    expect(headingTexts).toContain('Available now');
    expect(headingTexts).toContain('In progress');
    expect(headingTexts).toContain('Coming next');
    expect(headingTexts).toContain('Future');
  });

  it('renders each phase items list as a <ul> within each phase <li>', () => {
    const { container } = render(<Roadmap />);
    const phaseLis = container.querySelectorAll('section > ul > li');
    phaseLis.forEach((phaseLi) => {
      const itemsUl = phaseLi.querySelector('ul');
      expect(itemsUl).not.toBeNull();
      expect(itemsUl!.tagName).toBe('UL');
    });
  });

  it('each phase items <ul> contains 4 <li> elements', () => {
    const { container } = render(<Roadmap />);
    const phaseLis = container.querySelectorAll('section > ul > li');
    phaseLis.forEach((phaseLi) => {
      const itemsLi = phaseLi.querySelectorAll('ul > li');
      expect(itemsLi).toHaveLength(4);
    });
  });

  // Regression: outer container is NOT a plain <div> (changed in this PR)
  it('does not use a <div> as the phases container', () => {
    const { container } = render(<Roadmap />);
    const divGrid = container.querySelector('section > div.grid');
    expect(divGrid).toBeNull();
  });

  // Boundary: verify correct total item count (4 phases × 4 items = 16)
  it('renders a total of 16 roadmap items across all phases', () => {
    const { container } = render(<Roadmap />);
    const allItemLis = container.querySelectorAll('section > ul > li ul > li');
    expect(allItemLis).toHaveLength(16);
  });
});