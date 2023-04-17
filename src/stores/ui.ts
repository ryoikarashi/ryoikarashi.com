import { StateCreator } from 'zustand';

export interface UiState {
  isModalOpen: boolean;
  updateModal: (modalState: boolean) => void;
}

export const createUiSlice: StateCreator<UiState, [], [], UiState> = (set) => ({
  isModalOpen: false,
  updateModal: (modalState) =>
    set(({ isModalOpen }) => ({ isModalOpen: modalState })),
});
