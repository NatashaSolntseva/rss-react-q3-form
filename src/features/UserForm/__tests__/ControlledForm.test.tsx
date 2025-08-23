import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { addEntry } from '../model/formsSlice';
import { ControlledForm } from '../ui/ControlledForm';

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

describe('ControlledForm', () => {
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

  it('submits valid data and dispatches addEntry', async () => {
    const user = userEvent.setup({ delay: null });

    const onSuccess = vi.fn();
    render(<ControlledForm onSuccess={onSuccess} />);

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

    await user.type(screen.getByLabelText(/^password$/i), 'Ab1!xx');
    await user.type(screen.getByLabelText(/confirm password/i), 'Ab1!xx');

    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/upload your picture/i);
    await user.upload(fileInput, file);

    const terms = screen.getByLabelText(/terms/i);
    await user.click(terms);

    await user.click(screen.getByRole('button', { name: /submit/i }));

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
        source: 'rhf',
      })
    );

    expect(onSuccess).toHaveBeenCalled();
  });
});
