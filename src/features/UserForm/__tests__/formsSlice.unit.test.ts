import { describe, it, expect } from 'vitest';
import reducer, { addEntry, type FormEntry } from '../model/formsSlice';
import { mockEntries } from '@/shared/mocks/mockEntries';

describe('formsSlice (unit)', () => {
  it('creates addEntry action with payload', () => {
    const entry: FormEntry = {
      id: 'x1',
      name: 'Test User',
      age: 30,
      email: 'test@ex.com',
      gender: 'other',
      country: 'Japan',
      pictureBase64: undefined,
      createdAt: 123,
      source: 'rhf',
    };
    const action = addEntry(entry);
    expect(action.type).toBe('forms/addEntry');
    expect(action.payload).toEqual(entry);
  });

  it('returns initial state by default', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.entries).toEqual(mockEntries);
  });

  it('handles addEntry by unshifting new entry to the top', () => {
    const initial = { entries: mockEntries };
    const newEntry: FormEntry = {
      id: 'new',
      name: 'New One',
      age: 22,
      email: 'new@ex.com',
      gender: 'female',
      country: 'Canada',
      createdAt: Date.now(),
      source: 'uncontrolled',
    };
    const next = reducer(initial, addEntry(newEntry));
    expect(next.entries[0]).toEqual(newEntry);
    expect(next.entries.length).toBe(initial.entries.length + 1);
  });
});
