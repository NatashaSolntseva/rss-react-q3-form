import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { beforeAll, describe, expect, it } from 'vitest';
import { Home } from '..';

import formsReducer, {
  type FormEntry,
} from '@/features/UserForm/model/formsSlice';

function renderWithStore(
  ui: React.ReactElement,
  preloadedEntries: FormEntry[] = []
) {
  const store = configureStore({
    reducer: { forms: formsReducer },
    preloadedState: { forms: { entries: preloadedEntries } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

beforeAll(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});

describe('Home page', () => {
  it('renders title and form buttons', () => {
    renderWithStore(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: /welcome to react forms/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /open rhf form/i })
    ).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    renderWithStore(<Home />);

    expect(
      screen.getByText(/no data yet — submit a form to see it here/i)
    ).toBeInTheDocument();
  });

  it('renders submitted profiles when entries exist', () => {
    const entries: FormEntry[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        age: 28,
        email: 'alice@example.com',
        gender: 'female',
        country: 'Canada',
        pictureBase64: undefined,
        createdAt: Date.now(),
        source: 'rhf',
      },
    ];

    renderWithStore(<Home />, entries);

    expect(
      screen.getByRole('heading', { level: 2, name: /submitted profiles/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('opens Uncontrolled Form modal on button click', () => {
    renderWithStore(<Home />);

    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );

    const titles = screen.getAllByText(/uncontrolled form/i);
    expect(titles.length).toBeGreaterThan(1);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByText(/press/i)).toBeInTheDocument();
  });

  it('opens RHF Form modal on button click', () => {
    renderWithStore(<Home />);

    fireEvent.click(screen.getByRole('button', { name: /open rhf form/i }));

    expect(screen.getByText(/react hook form/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});
