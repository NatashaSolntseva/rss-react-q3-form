import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '..';

describe('NotFoundPage', () => {
  it('renders 404 text, message, and back link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /oops! page not found/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The page you’re looking for doesn’t exist/i)
    ).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back to home/i });
    expect(backButton).toBeInTheDocument();

    const link = backButton.closest('a');
    expect(link).toHaveAttribute('href', '/');
  });
});
