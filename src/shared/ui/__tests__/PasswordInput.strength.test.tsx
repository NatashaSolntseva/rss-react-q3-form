import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { PasswordInput } from '..';
import { passwordChecks } from '@/shared/utils';

function StrengthHarness() {
  const [strength, setStrength] = useState({
    number: false,
    upper: false,
    lower: false,
    special: false,
  });

  const handleChange = (val: string) => {
    setStrength({
      number: passwordChecks.number.test(val),
      upper: passwordChecks.upper.test(val),
      lower: passwordChecks.lower.test(val),
      special: passwordChecks.special.test(val),
    });
  };

  return (
    <PasswordInput
      mode="raw"
      id="pwd"
      name="password"
      label="Password"
      showStrength
      strength={strength}
      onChange={handleChange}
    />
  );
}

describe('PasswordInput strength calculation (raw mode + external checks)', () => {
  it('activates badges step-by-step as requirements are met', async () => {
    const user = userEvent.setup({ delay: null });
    render(<StrengthHarness />);

    const input = screen.getByLabelText(/password/i);

    const num = screen.getByText(/1 number/i);
    const up = screen.getByText(/1 uppercase/i);
    const low = screen.getByText(/1 lowercase/i);
    const spec = screen.getByText(/1 special/i);

    const active = /bg-emerald-600\/30/;
    const inactive = /bg-white\/10/;

    expect(num.className).toMatch(inactive);
    expect(up.className).toMatch(inactive);
    expect(low.className).toMatch(inactive);
    expect(spec.className).toMatch(inactive);

    await user.type(input, 'A');
    expect(up.className).toMatch(active);
    expect(num.className).toMatch(inactive);
    expect(low.className).toMatch(inactive);
    expect(spec.className).toMatch(inactive);

    await user.type(input, 'a');
    expect(low.className).toMatch(active);

    await user.type(input, '1');
    expect(num.className).toMatch(active);

    await user.type(input, '!');
    expect(spec.className).toMatch(active);
  });

  it('deactivates badges when input cleared', async () => {
    const user = userEvent.setup({ delay: null });
    render(<StrengthHarness />);

    const input = screen.getByLabelText(/password/i);

    await user.type(input, 'Aa1!');
    const num = screen.getByText(/1 number/i);
    const up = screen.getByText(/1 uppercase/i);
    const low = screen.getByText(/1 lowercase/i);
    const spec = screen.getByText(/1 special/i);

    const active = /bg-emerald-600\/30/;
    const inactive = /bg-white\/10/;

    expect(num.className).toMatch(active);
    expect(up.className).toMatch(active);
    expect(low.className).toMatch(active);
    expect(spec.className).toMatch(active);

    await user.clear(input);
    expect(num.className).toMatch(inactive);
    expect(up.className).toMatch(inactive);
    expect(low.className).toMatch(inactive);
    expect(spec.className).toMatch(inactive);
  });
});
