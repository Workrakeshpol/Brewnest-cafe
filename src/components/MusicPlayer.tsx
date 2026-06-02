import React from 'react';
import { useApp } from '../context/AppContext';
import { Music, Music4 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { isMusicPlaying, toggleMusic } = useApp();

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-24 right-5 z-45 flex items-center gap-2 px-3 py-3 rounded-full bg-dark-espresso border border-accent-gold/30 text-accent-gold hover:text-cream-beige hover:border-accent-gold hover:scale-105 shadow-2xl transition-all duration-300 group"
      title="Toggle Cafe Ambience Music"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isMusicPlaying ? (
          <Music4 className="w-5 h-5 animate-bounce" />
        ) : (
          <Music className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        )}
      </div>
      
      {isMusicPlaying && (
        <div className="flex items-end gap-[2px] h-3 px-1">
          <span className="w-[2px] bg-accent-gold animate-[steam_1.2s_infinite_linear] h-full rounded-sm"></span>
          <span className="w-[2px] bg-accent-gold animate-[steam_1.5s_infinite_linear] h-2/3 rounded-sm" style={{ animationDelay: '0.3s' }}></span>
          <span className="w-[2px] bg-accent-gold animate-[steam_1s_infinite_linear] h-4/5 rounded-sm" style={{ animationDelay: '0.6s' }}></span>
        </div>
      )}
      <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-out text-xs font-sans font-medium whitespace-nowrap">
        {isMusicPlaying ? 'Mute Ambience' : 'Play Cafe Music'}
      </span>
    </button>
  );
};
