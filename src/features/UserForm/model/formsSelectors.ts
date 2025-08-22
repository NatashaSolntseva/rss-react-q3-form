import type { RootState } from '@/app/store/store';
import type { FormEntry } from './formsSlice';

export const selectEntries = (state: RootState) => state.forms.entries;

export const selectTotalEntries = (state: RootState) =>
  state.forms.entries.length;

export const selectEntryById =
  (id: string) =>
  (state: RootState): FormEntry | undefined =>
    state.forms.entries.find((e) => e.id === id);
