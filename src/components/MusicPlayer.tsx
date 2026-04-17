import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "SIGNAL_CRUSH_01",
    artist: "M-PROCESSOR Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "NEON_WAVE_08",
    artist: "M-PROCESSOR Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "VOID_WALKER_9X",
    artist: "M-PROCESSOR Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

interface MusicContextType {
  currentTrack: Track;
  isPlaying: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (i: number) => void;
  setIsPlaying: (p: boolean) => void;
  TRACKS: Track[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{ 
      currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, 
      currentTrackIndex, setCurrentTrackIndex, setIsPlaying, TRACKS 
    }}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
}

export function PlaylistView() {
  const { TRACKS, currentTrackIndex, setCurrentTrackIndex, setIsPlaying } = useMusic();
  return (
    <div className="flex flex-col gap-2 font-mono">
      {TRACKS.map((track, index) => (
        <div
          key={track.id}
          onClick={() => { setCurrentTrackIndex(track.index ?? index); setIsPlaying(true); }}
          className={`p-3 border transition-all cursor-pointer ${
            currentTrackIndex === index 
              ? 'bg-glitch-cyan text-black border-white' 
              : 'border-white/10 hover:border-glitch-magenta'
          }`}
        >
          <h4 className="font-bold text-[10px] truncate">{track.title}</h4>
          <p className="text-[8px] opacity-60">SOURCE: {track.artist}</p>
        </div>
      ))}
    </div>
  );
}

export function PlayerControls() {
  const { isPlaying, togglePlay, nextTrack, prevTrack } = useMusic();
  return (
    <div className="flex items-center justify-center gap-6">
      <button onClick={prevTrack} className="w-10 h-10 flex items-center justify-center border border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all">
        <SkipBack className="w-5 h-5" />
      </button>
      <button
        onClick={togglePlay}
        className="w-14 h-14 bg-glitch-magenta text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0_#00ffff]"
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="ml-1 w-6 h-6" />}
      </button>
      <button onClick={nextTrack} className="w-10 h-10 flex items-center justify-center border border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all">
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
}

export function NowPlayingInfo() {
  const { currentTrack } = useMusic();
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[9px] opacity-40 mb-1">STRM_BUS_ACTIVE</span>
      <AnimatePresence mode="wait">
        <motion.h3
          key={currentTrack.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="font-display text-[11px] glitch-text"
        >
          {currentTrack.title}
        </motion.h3>
      </AnimatePresence>
    </div>
  );
}

export function VolumeControl() {
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-mono text-[9px] opacity-40">AMP_VOL</span>
      <div className="w-20 h-2 bg-white/10 relative border border-white/20">
        <div className="absolute left-0 top-0 h-full w-2/3 bg-glitch-cyan"></div>
      </div>
    </div>
  );
}

// Fallback for default export
export default function MusicPlayer() {
  return (
    <MusicProvider>
      <div className="p-4 border border-glitch-cyan bg-black">
        <NowPlayingInfo />
        <PlayerControls />
      </div>
    </MusicProvider>
  );
}
