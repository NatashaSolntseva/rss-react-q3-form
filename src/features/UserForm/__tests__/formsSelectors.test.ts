import { describe, it, expect } from 'vitest';
import {
  selectEntries,
  selectTotalEntries,
  selectEntryById,
} from '../model/formsSelectors';
import type { RootState } from '@/app/store/store';
import type { FormEntry } from '../model/formsSlice';

const makeState = (entries: FormEntry[]): RootState =>
  ({
    forms: { entries },
  }) as unknown as RootState;

describe('forms selectors', () => {
  const entries: FormEntry[] = [
    {
      id: '1',
      name: 'Alice',
      age: 28,
      email: 'alice@ex.com',
      gender: 'female',
      country: 'Canada',
      createdAt: 1,
      source: 'rhf',
    },
    {
      id: '2',
      name: 'Bob',
      age: 31,
      email: 'bob@ex.com',
      gender: 'male',
      country: 'Germany',
      createdAt: 2,
      source: 'uncontrolled',
    },
  ];

  it('selectEntries returns all entries', () => {
    const state = makeState(entries);
    expect(selectEntries(state)).toEqual(entries);
  });

  it('selectTotalEntries returns count', () => {
    const state = makeState(entries);
    expect(selectTotalEntries(state)).toBe(2);
  });

  it('selectEntryById returns the matching entry', () => {
    const state = makeState(entries);
    expect(selectEntryById('2')(state)).toEqual(entries[1]);
    expect(selectEntryById('missing')(state)).toBeUndefined();
  });
});
