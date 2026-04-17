import React from 'react';
import SnakeGame from './components/SnakeGame';
import { 
  MusicProvider, 
  PlaylistView, 
  PlayerControls, 
  NowPlayingInfo, 
  VolumeControl 
} from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Database, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <MusicProvider>
      <div className="h-screen w-screen bg-black grid grid-cols-[260px_1fr_260px] grid-rows-[80px_1fr_100px] gap-1 p-1 selection:bg-glitch-magenta/40 relative">
        
        {/* CRT Overlay */}
        <div className="fixed inset-0 pointer-events-none scanlines opacity-10 z-[1000]"></div>
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] z-[1001]"></div>

        {/* Header */}
        <header className="col-span-3 bg-black border border-glitch-cyan flex items-center justify-between px-8 relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <Cpu className="w-5 h-5 text-glitch-magenta animate-pulse" />
            <div className="font-display text-lg glitch-text tracking-tighter text-glitch-cyan">
              KERNEL_MODULE:snake_v4.2.0
            </div>
          </div>
          
          <div className="flex items-center gap-12 text-right">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] opacity-40">UPLINK_STABILITY</span>
              <span className="font-display text-xs text-glitch-magenta">98.4%</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] opacity-40">THREAD_ID</span>
              <span className="font-display text-xs text-glitch-cyan">0x7F4E</span>
            </div>
          </div>
        </header>

        {/* Console Left: Playlist */}
        <aside className="bg-black border border-glitch-cyan p-4 flex flex-col gap-4 overflow-hidden relative">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] text-glitch-magenta flex items-center gap-2">
              <Database className="w-3 h-3" /> STREAM_BUFFERS
            </div>
            <div className="w-2 h-2 rounded-full bg-glitch-cyan animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <PlaylistView />
          </div>
        </aside>

        {/* Main Viewport: The Game */}
        <main className="bg-black border border-glitch-cyan flex items-center justify-center relative overflow-hidden group">
          <div className="absolute top-4 left-4 font-mono text-[8px] opacity-20 group-hover:opacity-100 transition-opacity">
            RENDER_PIPELINE: ACTIVE<br/>
            BUFFER_SWAP: OK<br/>
            DRAW_CALLS: 124
          </div>
          
          <motion.div 
            className="relative"
            animate={{ 
              x: [0, -1, 1, 0],
              y: [0, 1, -1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatType: "mirror"
            }}
          >
            <SnakeGame />
          </motion.div>

          <div className="absolute bottom-4 right-4 font-mono text-[8px] text-glitch-magenta text-right">
            [SYS_LOG]<br/>
            SNAKE_POS: DYNAMIC<br/>
            ENTROPY: HIGH
          </div>
        </main>

        {/* Sidebar Right: System Metrics */}
        <aside className="bg-black border border-glitch-cyan p-6 flex flex-col gap-6 overflow-hidden">
          <div className="font-mono text-[10px] text-glitch-magenta flex items-center gap-2">
            <Activity className="w-3 h-3" /> ANALYTICS_v2
          </div>
          
          <div className="space-y-6">
            <div className="border border-white/10 p-4 relative group hover:border-glitch-cyan transition-colors">
              <div className="font-mono text-[9px] opacity-40 mb-1">CUMULATIVE_SCORE</div>
              <div className="font-display text-2xl text-glitch-cyan glitch-text">092450</div>
            </div>

            <div className="border border-white/10 p-4 relative">
              <div className="font-mono text-[9px] opacity-40 mb-1">PROCESSOR_LOAD</div>
              <div className="w-full h-1 bg-white/10 mt-2">
                <motion.div 
                  className="h-full bg-glitch-magenta"
                  animate={{ width: ["10%", "85%", "40%", "92%"] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                />
              </div>
            </div>

            <div className="border border-white/10 p-4">
              <div className="font-mono text-[9px] opacity-40 mb-3 flex items-center gap-2 uppercase">
                <Terminal className="w-3 h-3" /> Diagnostics
              </div>
              <div className="font-mono text-[8px] text-white/40 space-y-1">
                <p>{'>'} LINKING_LIBS...</p>
                <p className="text-glitch-cyan">{'>'} OK: RENDERER</p>
                <p className="text-glitch-magenta animate-pulse">{'>'} ERROR: TRACER</p>
                <p>{'>'} RETRYING...</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Footer: Multi-Control HUD */}
        <footer className="col-span-3 bg-black border border-glitch-cyan px-10 grid grid-cols-[260px_1fr_260px] items-center">
          <NowPlayingInfo />
          <PlayerControls />
          <VolumeControl />
        </footer>

      </div>
    </MusicProvider>
  );
}
