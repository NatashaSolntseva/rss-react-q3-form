import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { AutocompleteInput } from '..';

vi.mock('@/shared/constants/countries', () => ({
  COUNTRIES: ['Canada', 'Cameroon', 'Germany', 'Japan'],
}));

function RawHarness({ onChangeSpy }: { onChangeSpy?: (v: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <AutocompleteInput
      value={val}
      onChange={(v) => {
        setVal(v);
        onChangeSpy?.(v);
      }}
    />
  );
}

describe('AutocompleteInput (raw mode)', () => {
  it('renders label and no list initially', () => {
    render(<RawHarness />);
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('opens list on typing and filters items', async () => {
    const user = userEvent.setup({ delay: null });
    render(<RawHarness />);

    const input = screen.getByLabelText(/country/i);
    await user.type(input, 'ca');

    const list = await screen.findByRole('list');
    const options = within(list)
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(options).toEqual(expect.arrayContaining(['Canada', 'Cameroon']));
    expect(options).not.toEqual(expect.arrayContaining(['Germany', 'Japan']));
  });

  it('selects item, calls onChange, and closes the list', async () => {
    const user = userEvent.setup({ delay: null });
    const spy = vi.fn();
    render(<RawHarness onChangeSpy={spy} />);

    const input = screen.getByLabelText(/country/i);
    await user.type(input, 'ger');

    const list = await screen.findByRole('list');
    const germany = within(list).getByText('Germany');

    await user.click(germany);
    expect(spy).toHaveBeenCalledWith('Germany');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(
      <AutocompleteInput
        value=""
        onChange={() => {}}
        error="Please choose your country"
      />
    );
    expect(screen.getByText(/please choose your country/i)).toBeInTheDocument();
  });

  it('closes the list on blur (no fake timers)', async () => {
    const user = userEvent.setup({ delay: null });
    render(<RawHarness />);

    const input = screen.getByLabelText(/country/i);
    await user.type(input, 'ca');
    expect(await screen.findByRole('list')).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });
});

describe('AutocompleteInput (RHF mode)', () => {
  it('proxies register.onChange and uses setCountryValue on selection', async () => {
    const user = userEvent.setup({ delay: null });

    const onChange = vi.fn();
    const onBlur = vi.fn();
    const setCountryValue = vi.fn();

    const register = {
      name: 'country',
      onChange,
      onBlur,
      ref: vi.fn(),
    } as const;

    render(
      <AutocompleteInput
        register={register}
        watchValue="ja"
        setCountryValue={setCountryValue}
      />
    );

    const input = screen.getByLabelText(/country/i);

    await act(async () => {
      input.focus();
    });
    await user.type(input, 'p');

    const list = await screen.findByRole('list');

    expect(onChange).toHaveBeenCalled();

    const japan = within(list).getByText('Japan');
    await user.click(japan);

    expect(setCountryValue).toHaveBeenCalledWith('Japan', {
      shouldValidate: true,
      shouldDirty: true,
    });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows errorMessage in RHF mode', () => {
    const register = {
      name: 'country',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    } as const;

    render(
      <AutocompleteInput
        register={register}
        watchValue=""
        setCountryValue={vi.fn()}
        errorMessage="Country is required"
      />
    );

    expect(screen.getByText(/country is required/i)).toBeInTheDocument();
  });
});
