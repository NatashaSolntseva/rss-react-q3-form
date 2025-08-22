import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { describe, expect, it } from 'vitest';
import { Footer } from '..';

describe('Footer', () => {
  it('renders desktop footer with GitHub, copyright and RS School link', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const githubDesktop = screen.getByTestId('github-desktop');
    expect(githubDesktop).toBeInTheDocument();
    expect(githubDesktop).toHaveAttribute(
      'href',
      'https://github.com/NatashaSolntseva'
    );

    const copyrightDesktop = screen.getByTestId('copyright-desktop');
    expect(copyrightDesktop).toHaveTextContent('© 2025 Formify');

    const rsschoolDesktop = screen.getByTestId('rsschool-desktop');
    expect(rsschoolDesktop).toBeInTheDocument();
    expect(rsschoolDesktop).toHaveAttribute('href', 'https://app.rs.school/');
  });

  it('renders mobile footer with GitHub, copyright and RS School link', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const githubMobile = screen.getByTestId('github-mobile');
    expect(githubMobile).toBeInTheDocument();
    expect(githubMobile).toHaveAttribute(
      'href',
      'https://github.com/NatashaSolntseva'
    );

    const copyrightMobile = screen.getByTestId('copyright-mobile');
    expect(copyrightMobile).toHaveTextContent('© 2025 Formify');

    const rsschoolMobile = screen.getByTestId('rsschool-mobile');
    expect(rsschoolMobile).toBeInTheDocument();
    expect(rsschoolMobile).toHaveAttribute('href', 'https://app.rs.school/');
  });
});
