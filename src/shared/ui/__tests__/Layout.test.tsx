import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from '..';

vi.mock('@/widgets', () => ({
  Header: () => <header data-testid="header">Header</header>,
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Layout', () => {
  it('renders Header, Outlet content, and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Outlet content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();

    expect(screen.getByText('Outlet content')).toBeInTheDocument();

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
