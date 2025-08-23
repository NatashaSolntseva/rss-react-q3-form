import { describe, it, expect, beforeEach } from 'vitest';
import { getDraft, setDraft, clearDraft } from '../formDraft';

describe('formDraft utils', () => {
  const KEY = 'test_draft';

  beforeEach(() => {
    localStorage.clear();
  });

  it('setDraft stores JSON and getDraft retrieves it', () => {
    const data = { name: 'Alice', age: 30 };
    setDraft(KEY, data);

    const storedRaw = localStorage.getItem(KEY);
    expect(storedRaw).toBe(JSON.stringify(data));

    const restored = getDraft<typeof data>(KEY);
    expect(restored).toEqual(data);
  });

  it('getDraft returns null when key not found', () => {
    expect(getDraft<{ foo: string }>('unknown')).toBeNull();
  });

  it('getDraft returns null when value is invalid JSON', () => {
    localStorage.setItem(KEY, '{oops');
    expect(getDraft(KEY)).toBeNull();
  });

  it('clearDraft removes the item', () => {
    setDraft(KEY, { test: true });
    expect(localStorage.getItem(KEY)).not.toBeNull();

    clearDraft(KEY);
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
