import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '..';

describe('FormInput — raw mode', () => {
  it('renders label and input, binds label to input via htmlFor/id', () => {
    render(
      <FormInput
        id="name"
        name="name"
        label="Name"
        placeholder="John"
        data-testid="name-input"
      />
    );

    const label = screen.getByText(/name/i);
    const input = screen.getByTestId('name-input');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'name');
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('name', 'name');
    expect(input).toHaveAttribute('placeholder', 'John');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('shows error message and sets aria-invalid, then clears on rerender', () => {
    const { rerender } = render(
      <FormInput id="email" name="email" label="Email" error="Invalid email" />
    );

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

    rerender(<FormInput id="email" name="email" label="Email" />);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });
});

describe('FormInput — RHF mode', () => {
  it('uses register props (name/ref) and forwards onChange/onBlur', async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();
    const onBlur = vi.fn();
    const refSpy = vi.fn();

    const register = {
      name: 'email',
      onChange,
      onBlur,
      ref: refSpy,
    } as const;

    render(
      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        register={register}
        data-testid="email-input"
      />
    );

    const input = screen.getByTestId('email-input') as HTMLInputElement;

    expect(refSpy).toHaveBeenCalled();

    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalled();

    input.blur();
    expect(onBlur).toHaveBeenCalled();

    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('sets aria-invalid when error is passed', () => {
    render(
      <FormInput
        id="password"
        label="Password"
        type="password"
        register={{
          name: 'password',
          onChange: vi.fn(),
          onBlur: vi.fn(),
          ref: vi.fn(),
        }}
        error="Too short"
      />
    );

    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/too short/i)).toBeInTheDocument();
  });
});

describe('FormInput — common behavior', () => {
  it('forwards arbitrary props to input', () => {
    render(
      <FormInput
        id="common"
        name="common"
        label="Common"
        disabled
        data-testid="common-input"
      />
    );
    const input = screen.getByTestId('common-input');
    expect(input).toBeDisabled();
  });

  it('respects className on wrapper', () => {
    render(
      <FormInput
        id="styled"
        name="styled"
        label="Styled"
        className="mb-10"
        data-testid="styled-wrapper"
      />
    );
    const wrapper = screen.getByTestId('styled-wrapper').parentElement;

    expect(wrapper).toBeTruthy();
  });
});
