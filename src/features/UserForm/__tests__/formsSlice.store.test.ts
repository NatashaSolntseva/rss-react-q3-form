import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import formsReducer, { addEntry, type FormEntry } from '../model/formsSlice';
import { selectEntries, selectTotalEntries } from '../model/formsSelectors';

describe('forms store integration', () => {
  const makeStore = () =>
    configureStore({
      reducer: { forms: formsReducer },
    });

  type TestRootState = ReturnType<ReturnType<typeof makeStore>['getState']>;

  it('updates state after addEntry (mimics form submission)', () => {
    const store = makeStore();

    const beforeTotal = selectTotalEntries(store.getState() as TestRootState);

    const newEntry: FormEntry = {
      id: 'form123',
      name: 'Carol',
      age: 26,
      email: 'carol@ex.com',
      gender: 'female',
      country: 'Japan',
      createdAt: Date.now(),
      source: 'rhf',
    };

    store.dispatch(addEntry(newEntry));

    const state = store.getState() as TestRootState;
    const entries = selectEntries(state);

    expect(selectTotalEntries(state)).toBe(beforeTotal + 1);
    expect(entries[0]).toEqual(newEntry);
  });
});
