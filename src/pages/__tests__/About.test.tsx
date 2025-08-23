import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from '..';

describe('About page', () => {
  it('renders title and description', () => {
    render(<About />);

    const title = screen.getByRole('heading', {
      level: 1,
      name: /about this app/i,
    });
    expect(title).toBeInTheDocument();

    expect(
      screen.getByText(
        /This project is a demo of two form approaches — uncontrolled and React Hook Form — with validation, modals, and state management\./i
      )
    ).toBeInTheDocument();
  });
});
