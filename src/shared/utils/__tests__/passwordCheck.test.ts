import { describe, it, expect } from 'vitest';
import { passwordChecks } from '@/shared/utils/passwordCheck';

describe('passwordChecks regexes', () => {
  it('detects all categories when present', () => {
    const sample = 'Aa1!';
    expect(passwordChecks.upper.test(sample)).toBe(true);
    expect(passwordChecks.lower.test(sample)).toBe(true);
    expect(passwordChecks.number.test(sample)).toBe(true);
    expect(passwordChecks.special.test(sample)).toBe(true);
  });

  it('detects absence of specific categories', () => {
    expect(passwordChecks.upper.test('abc1!')).toBe(false);
    expect(passwordChecks.lower.test('ABC1!')).toBe(false);
    expect(passwordChecks.number.test('Abc!')).toBe(false);
    expect(passwordChecks.special.test('Abc1')).toBe(false);
  });

  it('works with longer passwords too', () => {
    const sample = 'MySuper$ecret123';
    expect(passwordChecks.upper.test(sample)).toBe(true);
    expect(passwordChecks.lower.test(sample)).toBe(true);
    expect(passwordChecks.number.test(sample)).toBe(true);
    expect(passwordChecks.special.test(sample)).toBe(true);
  });
});
