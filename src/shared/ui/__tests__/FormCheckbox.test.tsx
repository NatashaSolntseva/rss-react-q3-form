import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormCheckbox } from '..';

describe('FormCheckbox (raw mode)', () => {
  it('renders with label and toggles checked state', async () => {
    const user = userEvent.setup();
    render(
      <FormCheckbox
        id="acceptTerms"
        label="I accept the Terms & Conditions"
        defaultChecked={false}
      />
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /i accept the terms/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('shows and clears error message; updates aria-invalid', async () => {
    const { rerender } = render(
      <FormCheckbox
        id="acceptTerms"
        label="I accept the Terms & Conditions"
        error="Please accept the Terms & Conditions to continue"
      />
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /i accept the terms/i,
    });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText(/please accept the terms & conditions to continue/i)
    ).toBeInTheDocument();

    rerender(
      <FormCheckbox id="acceptTerms" label="I accept the Terms & Conditions" />
    );

    expect(checkbox).toHaveAttribute('aria-invalid', 'false');
    expect(
      screen.queryByText(/please accept the terms & conditions to continue/i)
    ).not.toBeInTheDocument();
  });
});

describe('FormCheckbox (RHF mode)', () => {
  it('uses register props (onChange, onBlur, ref) and keeps label binding', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const refSpy = vi.fn();

    const register = {
      name: 'acceptTerms',
      onChange,
      onBlur,
      ref: refSpy,
    } as const;

    render(
      <FormCheckbox
        id="acceptTerms"
        label="I accept the Terms & Conditions"
        register={register}
      />
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /i accept the terms/i,
    });

    expect(refSpy).toHaveBeenCalled();

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalled();

    const wrapper = checkbox.closest('div');
    expect(wrapper).toBeTruthy();
    if (wrapper) {
      const label = within(wrapper).getByText(
        /i accept the terms & conditions/i
      );
      expect(label).toHaveAttribute('for', 'acceptTerms');
    }
  });
});
