import { type StateCreator } from 'zustand';
import { type TrackPlainObj } from '@/packages/ryoikarashi/domain/models';

export interface UiState {
  isModalOpen: boolean;
  updateModal: (modalState: boolean) => void;
  currentlyPlayingTrack: TrackPlainObj | null;
  updateCurrentlyPlayingTrack: (track: TrackPlainObj) => void;
}

export const createUiSlice: StateCreator<UiState, [], [], UiState> = (set) => ({
  isModalOpen: false,
  updateModal: (modalState) => {
    set(() => ({ isModalOpen: modalState }));
  },
  currentlyPlayingTrack: null,
  updateCurrentlyPlayingTrack: (track) => {
    set(({ currentlyPlayingTrack }) => ({ currentlyPlayingTrack: track }));
  },
});
