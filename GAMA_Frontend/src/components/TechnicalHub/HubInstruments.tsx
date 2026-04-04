import { Drone } from '../../types';

interface HubInstrumentsProps {
    drone: Drone;
}

export default function HubInstruments({ drone }: HubInstrumentsProps) {
    const batteryPct = drone.status.battery_pct;
    const { alt_relative, roll, pitch, ground_speed } = drone.navigation;

    const getAccentColor = () => {
        if (batteryPct > 70) return '#5EEAD4';
        if (batteryPct > 20) return '#fbbf24';
        return '#ef4444';
    };

    return (
        <div className="flex-1 flex items-center justify-center gap-12 z-10 py-2">
            {/* Speed Tape - Minimalist Vertical */}
            <div className="flex items-center gap-5 translate-y-2">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Vel. Ground</span>
                    <div className="flex items-baseline gap-1.5 mb-8">
                        <span className="text-4xl font-black text-white font-mono tabular-nums leading-none tracking-tighter">
                            {ground_speed.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-bold text-white/40 uppercase">m/s</span>
                    </div>
                </div>
                <div className="h-32 w-1.5 bg-white/5 relative rounded-full overflow-visible">
                    <div 
                        className="absolute bottom-0 w-full bg-hud-accent/60 shadow-[0_0_15px_rgba(94,234,212,0.15)] transition-all duration-1000 rounded-full" 
                        style={{ height: `${Math.min((ground_speed / 80) * 100, 100)}%`, backgroundColor: getAccentColor() }}
                    />
                    {/* Current Value Pointer */}
                    <div 
                        className="absolute -right-1 w-3 h-0.5 bg-white/80 shadow-[0_0_8px_white] transition-all duration-1000 z-20"
                        style={{ bottom: `${Math.min((ground_speed / 80) * 100, 100)}%` }}
                    />
                    {/* Tape markings */}
                    {[0, 20, 40, 60, 80].map(v => (
                        <div key={v} className="absolute w-2 h-px bg-white/20 -left-0.5" style={{ bottom: `${(v/80)*100}%` }} />
                    ))}
                </div>
            </div>

            {/* Ultra-Minimalist Horizon - Centered Focus */}
            <div className="relative w-40 h-40 border border-white/[0.05] rounded-full flex items-center justify-center group bg-white/[0.01]">
                {/* Visual Guides / Crosshair */}
                <div className="absolute inset-0 border border-white/[0.02] rounded-full scale-110" />
                
                {/* Horizon Line Pair */}
                <div 
                    className="w-32 h-px flex justify-between transition-transform duration-150 ease-out z-10"
                    style={{ transform: `rotate(${(roll || 0)}deg) translateY(${-(pitch || 0) * 1.8}px)` }}
                >
                    <div className="w-14 h-0.5 bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.25)] rounded-full" />
                    <div className="w-14 h-0.5 bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.25)] rounded-full" />
                </div>
                
                {/* Fixed Center Point */}
                <div className="absolute w-3 h-3 border border-hud-danger/60 rounded-full flex items-center justify-center z-20 bg-[#050a0f]">
                    <div className="w-1 h-1 bg-hud-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                </div>

                {/* Numeric pitch/roll readout - Increased Visibility */}
                <div className="absolute top-6 text-[8px] font-black font-mono text-white/30 uppercase tracking-[0.2em]">
                    PITCH: {pitch?.toFixed(1)}°
                </div>
                <div className="absolute bottom-6 text-[8px] font-black font-mono text-white/30 uppercase tracking-[0.2em]">
                    ROLL: {roll?.toFixed(1)}°
                </div>
            </div>

            {/* Altitude Tape - Minimalist Vertical */}
            <div className="flex items-center gap-5 translate-y-2">
                <div className="h-32 w-1.5 bg-white/5 relative rounded-full overflow-visible">
                    <div 
                        className="absolute bottom-0 w-full transition-all duration-1000 rounded-full" 
                        style={{ height: `${Math.min((alt_relative / 120) * 100, 100)}%`, backgroundColor: getAccentColor(), boxShadow: `0 0 15px ${getAccentColor()}33` }}
                    />
                    {/* Current Value Pointer */}
                    <div 
                        className="absolute -left-1 w-3 h-0.5 bg-white/80 shadow-[0_0_8px_white] transition-all duration-1000 z-20"
                        style={{ bottom: `${Math.min((alt_relative / 120) * 100, 100)}%` }}
                    />
                    {/* Tape markings */}
                    {[0, 30, 60, 90, 120].map(v => (
                        <div key={v} className="absolute w-2 h-px bg-white/20 -right-0.5" style={{ bottom: `${(v/120)*100}%` }} />
                    ))}
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Alt. Relative</span>
                    <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-4xl font-black text-white font-mono tabular-nums leading-none tracking-tighter">
                            {alt_relative.toFixed(0)}
                        </span>
                        <span className="text-[10px] font-bold text-white/40 uppercase">m</span>
                    </div>
                    <div className="text-[8px] font-black mt-2 px-2 py-0.5 rounded border border-hud-accent/30 font-mono shadow-[0_0_10px_rgba(0,0,0,0.3)]" style={{ borderColor: `${getAccentColor()}44`, color: getAccentColor(), backgroundColor: `${getAccentColor()}11` }}>
                        {alt_relative > 0 ? '+' : ''}2.0 VSI
                    </div>
                </div>
            </div>
        </div>
    );
}
