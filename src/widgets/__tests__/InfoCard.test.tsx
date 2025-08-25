import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import type { FormEntry } from '@/features/UserForm/model/formsSlice';
import { InfoCard } from '..';

const baseEntry: FormEntry = {
  id: 'id-1',
  name: 'Alice Johnson',
  age: 28,
  email: 'alice@example.com',
  gender: 'female',
  country: 'Canada',
  pictureBase64: undefined,
  createdAt: Date.now(),
  source: 'rhf',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InfoCard', () => {
  it('renders basic fields and uppercase source badge', () => {
    render(<InfoCard entry={baseEntry} />);

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText(/Gender:/)).toBeInTheDocument();
    expect(screen.getByText(/Country:/)).toBeInTheDocument();

    expect(screen.getByText('RHF')).toBeInTheDocument();
  });

  it('shows image when pictureBase64 is provided', () => {
    const withPhoto: FormEntry = {
      ...baseEntry,
      pictureBase64: 'https://i.pravatar.cc/150?img=47',
    };

    render(<InfoCard entry={withPhoto} />);

    const img = screen.getByRole('img', { name: /alice johnson/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', withPhoto.pictureBase64);
  });

  it('does not render <img> when pictureBase64 is absent (placeholder shown)', () => {
    const withoutPhoto: FormEntry = { ...baseEntry, pictureBase64: undefined };
    render(<InfoCard entry={withoutPhoto} />);

    expect(screen.queryByRole('img')).toBeNull();
  });

  it('applies "new" highlight styles when created within last 5 seconds', () => {
    const now = 1_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    const freshEntry: FormEntry = { ...baseEntry, createdAt: now - 3000 };
    const { container } = render(<InfoCard entry={freshEntry} />);

    const card = container.querySelector('div');
    expect(card).toBeTruthy();

    expect(card).toHaveClass('bg-fuchsia-500/10');
  });

  it('applies default styles when entry is older than 5 seconds', () => {
    const now = 1_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    const oldEntry: FormEntry = { ...baseEntry, createdAt: now - 10_000 };
    const { container } = render(<InfoCard entry={oldEntry} />);

    const card = container.querySelector('div');
    expect(card).toBeTruthy();

    expect(card).toHaveClass('bg-white/5');
  });
});
