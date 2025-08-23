import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { PasswordInput } from '..';

describe('PasswordInput — raw mode', () => {
  it('renders label, binds htmlFor/id, forwards ref and type=password', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <PasswordInput
        mode="raw"
        id="pwd"
        name="password"
        label="Password"
        inputRef={ref}
      />
    );

    const label = screen.getByText(/password/i);
    const input = screen.getByLabelText(/password/i);

    expect(label).toHaveAttribute('for', 'pwd');
    expect(input).toHaveAttribute('id', 'pwd');
    expect(input).toHaveAttribute('type', 'password');

    expect(ref.current).toBe(input);
  });

  it('calls onChange with typed value and toggles error UI', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();

    const { rerender } = render(
      <PasswordInput
        mode="raw"
        id="pwd"
        name="password"
        label="Password"
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText(/password/i) as HTMLInputElement;
    await user.type(input, 'Ab1!');

    expect(onChange).toHaveBeenCalledTimes(4);
    expect(input).toHaveAttribute('aria-invalid', 'false');

    rerender(
      <PasswordInput
        mode="raw"
        id="pwd"
        name="password"
        label="Password"
        onChange={onChange}
        error="Too weak"
      />
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/too weak/i)).toBeInTheDocument();
  });

  it('renders strength badges when showStrength=true', () => {
    render(
      <PasswordInput
        mode="raw"
        id="pwd"
        name="password"
        label="Password"
        showStrength
        strength={{ number: true, upper: false, lower: true, special: false }}
      />
    );

    expect(screen.getByText(/1 number/i)).toBeInTheDocument();
    expect(screen.getByText(/1 uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 special/i)).toBeInTheDocument();

    const numberBadge = screen.getByText(/1 number/i);
    const upperBadge = screen.getByText(/1 uppercase/i);
    const lowerBadge = screen.getByText(/1 lowercase/i);
    const specialBadge = screen.getByText(/1 special/i);

    expect(numberBadge.className).toMatch(/bg-emerald-600\/30/);
    expect(lowerBadge.className).toMatch(/bg-emerald-600\/30/);

    expect(upperBadge.className).toMatch(/bg-white\/10/);
    expect(specialBadge.className).toMatch(/bg-white\/10/);
  });

  it('does not render strength list when showStrength=false', () => {
    render(
      <PasswordInput
        mode="raw"
        id="pwd"
        name="password"
        label="Password"
        showStrength={false}
        strength={{ number: true, upper: true, lower: true, special: true }}
      />
    );
    expect(screen.queryByText(/1 number/i)).not.toBeInTheDocument();
  });
});

describe('PasswordInput — RHF mode', () => {
  it('uses register props and proxies onChange; shows errorMessage', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const refSpy = vi.fn();

    const register = {
      name: 'password',
      onChange,
      onBlur,
      ref: refSpy,
    } as const;

    render(
      <PasswordInput
        mode="rhf"
        id="pwd"
        label="Password"
        register={register}
        errorMessage="Required"
      />
    );

    const input = screen.getByLabelText(/password/i) as HTMLInputElement;

    expect(refSpy).toHaveBeenCalled();

    await user.type(input, 'A1!');
    expect(onChange).toHaveBeenCalled();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
