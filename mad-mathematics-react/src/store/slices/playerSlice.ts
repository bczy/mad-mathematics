/**
 * Player Slice - Mad Mathematics
 * Zustand slice for player name state management
 */

import type { StateCreator } from 'zustand';
import type { AppStore, PlayerSlice } from '../../types';

/**
 * Default player name (empty string)
 */
const DEFAULT_PLAYER_NAME = '';

/**
 * Creates the player slice for Zustand store
 */
export const createPlayerSlice: StateCreator<AppStore, [], [], PlayerSlice> = (
  set
) => ({
  playerName: DEFAULT_PLAYER_NAME,

  setPlayerName: (name: string) => {
    set({ playerName: name });
  },
});
