import { Drone } from '../../types';

interface GamaHudCompassProps {
    drone: Drone;
}

export default function GamaHudCompass({ drone }: GamaHudCompassProps) {
    const heading = drone.navigation.heading || 0;
    const pitch = drone.navigation.pitch || 0;
    const roll = drone.navigation.roll || 0;

    return (
        <div className="h-full glass-panel border-t border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            {/* 1. Header Degree Indicator - Dynamic Header */}
            <div className="absolute top-6 px-4 py-1.5 bg-hud-accent/20 border border-hud-accent/30 text-hud-accent rounded-full shadow-[0_0_15px_rgba(94,234,212,0.2)] z-30 flex items-center space-x-2 backdrop-blur-md">
                <span className="text-[12px] font-black tracking-widest font-mono">{Math.round(heading).toString().padStart(3, '0')}°</span>
                <div className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse" />
            </div>

            {/* 2. Main Compass & Attitude System */}
            <div className="relative w-52 h-52 flex items-center justify-center">

                {/* A. Rotating Compass Ring */}
                <div className="absolute inset-0 transition-transform duration-700 ease-linear"
                    style={{ transform: `rotate(${-heading}deg)` }}>

                    {/* Tick Marks (Dense Mil-Tech style) */}
                    {[...Array(72)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute left-1/2 -ml-px w-0.5 origin-[0_104px] transition-colors ${i % 18 === 0 ? 'h-4 bg-white shadow-[0_0_8px_white]' : i % 2 === 0 ? 'h-2.5 bg-white/40' : 'h-1.5 bg-white/15'}`}
                            style={{ transform: `rotate(${i * 5}deg) translateY(-104px)` }}
                        />
                    ))}

                    {/* Cardinal Directions */}
                    {['N', 'E', 'S', 'W'].map((dir, i) => (
                        <span key={dir}
                            className={`absolute text-[12px] font-black tracking-widest ${dir === 'N' ? 'text-hud-accent' : 'text-white/40'}`}
                            style={{ transform: `rotate(${i * 90}deg) translateY(-82px)` }}>
                            {dir}
                        </span>
                    ))}
                </div>

                {/* B. Compass Boundary */}
                <div className="absolute inset-2 border border-white/5 rounded-full pointer-events-none" />

                {/* C. Central Attitude Indicator (Artificial Horizon) */}
                <div className="relative w-32 h-32 rounded-full border border-white/10 bg-black/60 flex items-center justify-center shadow-inner overflow-hidden z-10">
                    {/* Moving Horizon Line */}
                    <div className="absolute inset-0 transition-all duration-500 ease-out flex items-center justify-center"
                        style={{ transform: `rotate(${roll}deg) translateY(${pitch * 1.5}px)` }}>
                        {/* Upper Half (Sky - Darker) */}
                        <div className="absolute top-0 left-[-50%] right-[-50%] h-[50%] bg-white/5 border-b border-hud-accent/40" />
                        {/* Horizon Wing Bars */}
                        <div className="absolute w-24 h-px bg-hud-accent/30 blur-[1px]" />
                    </div>

                    {/* Fixed Crosshair (The Drone Body) */}
                    <div className="relative z-20 flex items-center justify-center w-full h-full pointer-events-none">
                        <div className="w-12 h-0.5 bg-hud-accent shadow-[0_0_10px_rgba(94,234,212,0.8)]" />
                        <div className="absolute w-2 h-2 rounded-full bg-hud-accent border border-black shadow-[0_0_10px_rgba(94,234,212,0.5)]" />
                        {/* Inner Scale Ticks */}
                        <div className="absolute w-px h-16 bg-white/5" />
                        <div className="absolute h-px w-16 bg-white/5" />
                    </div>
                </div>
            </div>

            {/* 3. Bottom Metrics with Mini-Gauges */}
            <div className="absolute bottom-6 w-full px-12 flex justify-between items-end z-20">
                {/* Pitch Gauge */}
                <div className="flex flex-col items-start space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Pitch</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-1 h-8 bg-white/5 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 w-full bg-hud-accent transition-all duration-500"
                                style={{ height: `${Math.min(Math.abs(pitch) * 2, 100)}%` }} />
                        </div>
                        <span className="text-[11px] font-mono font-black text-white">{pitch.toFixed(1)}°</span>
                    </div>
                </div>

                {/* Roll Gauge */}
                <div className="flex flex-col items-end space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Roll</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono font-black text-white">{roll.toFixed(1)}°</span>
                        <div className="w-1 h-8 bg-white/5 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 w-full bg-hud-accent transition-all duration-500"
                                style={{ height: `${Math.min(Math.abs(roll) * 2, 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Pointer Triangle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[115px] z-30">
                <div className="w-4 h-4 text-hud-accent flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-hud-accent shadow-[0_0_10px_rgba(94,234,212,0.8)]" />
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 -mt-1 transform rotate-180">
                        <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
