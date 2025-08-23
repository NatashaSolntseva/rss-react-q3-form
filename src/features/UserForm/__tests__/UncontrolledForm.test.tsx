import { useDispatch } from 'react-redux';

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UncontrolledForm } from '../ui/UncontrolledForm';
import { addEntry } from '../model/formsSlice';

vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

vi.mock('@/shared/utils', async () => {
  const actual =
    await vi.importActual<typeof import('@/shared/utils')>('@/shared/utils');
  return {
    ...actual,
    fileToBase64: vi.fn().mockResolvedValue('data:image/png;base64,TESTBASE64'),
  };
});

describe('UncontrolledForm', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    (useDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    mockDispatch.mockClear();

    vi.stubGlobal('crypto', {
      randomUUID: () => 'uuid-test-1',
    } as unknown as Crypto);
  });

  it('submits valid data, dispatches addEntry and resets form', async () => {
    const user = userEvent.setup({ delay: null });

    const onSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.clear(screen.getByLabelText(/age/i));
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.type(screen.getByLabelText(/e-?mail/i), 'john@example.com');

    const group = screen.getByRole('group', { name: /gender/i });
    const male = within(group).getByRole('radio', { name: /^\s*male\s*$/i });
    await user.click(male);
    expect(male).toBeChecked();

    const countryInput = screen.getByLabelText(/country/i);
    await user.type(countryInput, 'ja');
    const countryField = countryInput.parentElement as HTMLElement;
    const list = await within(countryField).findByRole('list');
    await user.click(within(list).getByText('Japan'));

    await user.type(screen.getByLabelText(/^password$/i), 'Abcdef1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Abcdef1!');

    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/upload your picture/i);
    await user.upload(fileInput, file);

    const terms = screen.getByLabelText(/terms/i);
    await user.click(terms);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryByText(/please enter your name/i)).toBeNull();
    expect(screen.queryByText(/age must be a number/i)).toBeNull();
    expect(screen.queryByText(/please enter a valid email/i)).toBeNull();
    expect(screen.queryByText(/please select your gender/i)).toBeNull();
    expect(screen.queryByText(/please choose your country/i)).toBeNull();
    expect(screen.queryByText(/please accept the terms/i)).toBeNull();
    expect(screen.queryByText(/only png or jpeg allowed/i)).toBeNull();
    expect(screen.queryByText(/file size should be less than 2mb/i)).toBeNull();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatched = mockDispatch.mock.calls[0][0];

    expect(dispatched.type).toBe(addEntry.type);

    expect(dispatched.payload).toEqual(
      expect.objectContaining({
        id: 'uuid-test-1',
        name: 'John',
        age: 30,
        email: 'john@example.com',
        gender: 'male',
        country: 'Japan',
        pictureBase64: 'data:image/png;base64,TESTBASE64',
        source: 'uncontrolled',
      })
    );

    expect(onSuccess).toHaveBeenCalled();
  });
});
