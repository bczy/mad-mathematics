/**
 * PlayerNameInput Component - Mad Mathematics
 * Input field connected to Zustand store for player name
 */

import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import { usePlayerName, useSetPlayerName } from '../../store';

export interface PlayerNameInputProps {
  /** Callback when name is submitted (optional) */
  onSubmit?: (name: string) => void;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show submit button */
  showSubmitButton?: boolean;
}

/**
 * PlayerNameInput component for entering player name
 */
export function PlayerNameInput({
  onSubmit,
  label = '🧙‍♂️ Ton nom de sorcier',
  placeholder = 'Entre ton nom...',
  className = '',
  showSubmitButton = false,
}: PlayerNameInputProps) {
  const playerName = usePlayerName();
  const setPlayerName = useSetPlayerName();
  const [localName, setLocalName] = useState(playerName);

  // Sync with store when it changes externally
  useEffect(() => {
    setLocalName(playerName);
  }, [playerName]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalName(newName);
    // Update store immediately for auto-save behavior
    setPlayerName(newName);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setPlayerName(localName.trim());
      onSubmit?.(localName.trim());
    }
  };

  return (
    <div className={className}>
      <label className="block text-lg font-semibold text-white mb-2">
        {label}
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={localName}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={100}
          className="flex-1 px-4 py-3 text-lg rounded-xl bg-white/10 border-2 border-purple-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          aria-label={label}
        />
        {showSubmitButton && (
          <button
            type="submit"
            disabled={!localName.trim()}
            className="px-6 py-3 font-bold bg-gradient-to-br from-yellow-400 to-yellow-500 text-purple-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            OK
          </button>
        )}
      </form>
    </div>
  );
}
