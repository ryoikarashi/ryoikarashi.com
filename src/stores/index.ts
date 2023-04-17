import { create } from 'zustand';
import { createUiSlice, type UiState } from './ui';

export type State = UiState;

export const useStore = create<State>((...a) => ({
  ...createUiSlice(...a),
}));
