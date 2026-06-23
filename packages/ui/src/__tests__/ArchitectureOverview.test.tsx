import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArchitectureOverview } from '../components/ArchitectureOverview';

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

// Mock Panel so it renders its children inside a div
vi.mock('../components/Panel', () => ({
  Panel: ({ children, className }: { children: React.ReactNode; className?: string }) =>
    React.createElement('div', { className }, children),
}));

describe('ArchitectureOverview', () => {
  it('renders the section heading text', () => {
    render(<ArchitectureOverview />);
    expect(screen.getByText('The laboratory')).toBeInTheDocument();
    expect(screen.getByText('Built for the full alchemy cycle')).toBeInTheDocument();
  });

  it('renders the introductory description', () => {
    render(<ArchitectureOverview />);
    expect(
      screen.getByText(/The platform handles the transformation behind the scenes/)
    ).toBeInTheDocument();
  });

  it('renders the groups container as a <ul> element', () => {
    const { container } = render(<ArchitectureOverview />);
    // The outer groups wrapper should be a <ul>, not a <div>
    const outerList = container.querySelector('section > ul');
    expect(outerList).not.toBeNull();
    expect(outerList!.tagName).toBe('UL');
  });

  it('renders each group as a <li> element inside the outer <ul>', () => {
    const { container } = render(<ArchitectureOverview />);
    const outerList = container.querySelector('section > ul');
    const groupItems = outerList!.querySelectorAll(':scope > li');
    expect(groupItems).toHaveLength(3);
  });

  it('renders all three group labels: Create, Engage, Grow', () => {
    render(<ArchitectureOverview />);
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Engage')).toBeInTheDocument();
    expect(screen.getByText('Grow')).toBeInTheDocument();
  });

  it('renders nested item lists as <ul> elements inside each group', () => {
    const { container } = render(<ArchitectureOverview />);
    // Each group li contains a nested <ul> for items
    const nestedLists = container.querySelectorAll('section > ul > li ul');
    expect(nestedLists).toHaveLength(3);
    nestedLists.forEach((list) => {
      expect(list.tagName).toBe('UL');
    });
  });

  it('renders each item as a <li> inside its group <ul>', () => {
    const { container } = render(<ArchitectureOverview />);
    const nestedLists = container.querySelectorAll('section > ul > li ul');
    // Create group has 2 items, Engage has 3, Grow has 3
    expect(nestedLists[0].querySelectorAll(':scope > li')).toHaveLength(2);
    expect(nestedLists[1].querySelectorAll(':scope > li')).toHaveLength(3);
    expect(nestedLists[2].querySelectorAll(':scope > li')).toHaveLength(3);
  });

  it('renders all item names from the Create group', () => {
    render(<ArchitectureOverview />);
    expect(screen.getByText('Fast pack setup')).toBeInTheDocument();
    expect(screen.getByText('Flexible mask styles')).toBeInTheDocument();
  });

  it('renders all item names from the Engage group', () => {
    render(<ArchitectureOverview />);
    expect(screen.getByText('Chat-ready output')).toBeInTheDocument();
    expect(screen.getByText('Interactive moments')).toBeInTheDocument();
    expect(screen.getByText('Telegram-first experience')).toBeInTheDocument();
  });

  it('renders all item names from the Grow group', () => {
    render(<ArchitectureOverview />);
    expect(screen.getByText('Consistent quality')).toBeInTheDocument();
    expect(screen.getByText('Automation-ready')).toBeInTheDocument();
    expect(screen.getByText('Future platform support')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(<ArchitectureOverview />);
    expect(
      screen.getByText('Build and preview sticker packs without a steep learning curve.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Built for real group conversations from day one.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Designed to extend to more chat surfaces as you scale.')
    ).toBeInTheDocument();
  });

  it('total number of item <li> elements across all groups is 8', () => {
    const { container } = render(<ArchitectureOverview />);
    // 2 + 3 + 3 = 8 item <li> elements inside nested <ul>s
    const allItemLis = container.querySelectorAll('section > ul > li ul > li');
    expect(allItemLis).toHaveLength(8);
  });

  // Regression: verify outer container is NOT a plain <div> (changed in this PR)
  it('does not use a <div> as the outer groups container', () => {
    const { container } = render(<ArchitectureOverview />);
    const divGrid = container.querySelector('section > div.grid');
    expect(divGrid).toBeNull();
  });
});