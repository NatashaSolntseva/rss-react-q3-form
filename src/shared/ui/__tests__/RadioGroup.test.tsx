import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from '..';

function getRadioByValue(container: HTMLElement, value: string) {
  const radios = within(container).getAllByRole('radio');
  const el = radios.find((r) => (r as HTMLInputElement).value === value);
  if (!el) throw new Error(`Radio with value="${value}" not found`);
  return el as HTMLInputElement;
}

describe('RadioGroup (raw mode)', () => {
  it('renders options, sets defaultChecked, and keeps label binding', async () => {
    render(
      <RadioGroup
        idBase="gender"
        label="Gender"
        name="gender"
        defaultValue="male"
      />
    );

    const group = screen.getByRole('group', { name: /gender/i });
    expect(group).toBeInTheDocument();

    const male = getRadioByValue(group, 'male');
    const female = getRadioByValue(group, 'female');
    const other = getRadioByValue(group, 'other');

    expect(male).toBeChecked();
    expect(female).not.toBeChecked();
    expect(other).not.toBeChecked();

    const maleLabel = male.closest('label');
    expect(maleLabel).toBeTruthy();
    expect(maleLabel).toHaveAttribute('for', male.getAttribute('id'));

    const user = userEvent.setup();
    await user.click(female);
    expect(female).toBeChecked();
    expect(male).not.toBeChecked();
  });

  it('shows and clears error message and sets aria-invalid', () => {
    const { rerender } = render(
      <RadioGroup
        idBase="gender"
        name="gender"
        error="Please select your gender"
      />
    );

    const group = screen.getByRole('group', { name: /gender/i });
    within(group)
      .getAllByRole('radio')
      .forEach((r) => expect(r).toHaveAttribute('aria-invalid', 'true'));
    expect(screen.getByText(/please select your gender/i)).toBeInTheDocument();

    rerender(<RadioGroup idBase="gender" name="gender" />);
    within(group)
      .getAllByRole('radio')
      .forEach((r) => expect(r).toHaveAttribute('aria-invalid', 'false'));
    expect(
      screen.queryByText(/please select your gender/i)
    ).not.toBeInTheDocument();
  });
});

describe('RadioGroup (RHF mode)', () => {
  it('uses register props and triggers onChange', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const refSpy = vi.fn();

    const register = {
      name: 'gender',
      onChange,
      onBlur,
      ref: refSpy,
    } as const;

    render(<RadioGroup idBase="gender" label="Gender" register={register} />);

    const group = screen.getByRole('group', { name: /gender/i });
    expect(group).toBeInTheDocument();
    expect(refSpy).toHaveBeenCalled();

    const female = getRadioByValue(group, 'female');
    const user = userEvent.setup();
    await user.click(female);
    expect(onChange).toHaveBeenCalled();
  });
});
