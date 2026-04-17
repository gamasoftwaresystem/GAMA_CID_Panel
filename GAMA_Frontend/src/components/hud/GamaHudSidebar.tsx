import { useState } from 'react';
import { Drone } from '../../types';
import { LogOut, Activity } from 'lucide-react';

interface GamaHudSidebarProps {
    drone: Drone;
    onLogout: () => void;
}

export default function GamaHudSidebar({ drone, onLogout }: GamaHudSidebarProps) {
    const [altitude, setAltitude] = useState(270);
    const [exposure, setExposure] = useState(8.3);
    const [activeActions, setActiveActions] = useState<string[]>(['HDR+']);

    const toggleAction = (label: string) => {
        setActiveActions(prev => 
            prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
        );
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* 1. Admin-Style Detail Panel Header - MORE USEFUL & COMPACT */}
            <div className="glass-panel p-2.5 flex items-center justify-between border-t border-white/10 rounded-2xl relative shadow-lg shrink-0 overflow-hidden">
                <div className="flex items-center space-x-3.5 pl-1">
                     <div className="relative">
                        <Activity className="w-3.5 h-3.5 text-hud-accent animate-pulse" />
                        <div className="absolute inset-0 bg-hud-accent/20 blur-sm rounded-full animate-pulse" />
                     </div>
                     <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-[12px] font-black text-white tracking-widest uppercase italic">{drone.drone_id}</h2>
                            <span className="text-[7px] px-2 py-0.5 bg-hud-accent/10 border border-hud-accent/20 text-hud-accent rounded font-black uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-[8px] text-white/30 font-bold tracking-[0.2em] uppercase">Pilot Reference:</span>
                             <span className="text-[8px] text-hud-accent/60 font-black tracking-widest uppercase">Operator_01</span>
                        </div>
                     </div>
                </div>
                
                <button 
                    onClick={onLogout}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 text-hud-danger/60 hover:text-hud-danger hover:bg-hud-danger/10 hover:border-hud-danger/20 transition-all active:scale-90 flex items-center justify-center group"
                    title="Terminate Connection"
                >
                    <LogOut className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* 2. Compact Control Panel - significantly reduced spacing */}
            <div className="flex-1 glass-panel p-4 flex flex-col space-y-4 border-t border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Unified Diagnostics & Stats (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                    {/* Battery - Integrated */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Battery</span>
                            <span className={`text-[10px] font-black font-mono ${drone.status.battery_pct < 20 ? 'text-hud-danger' : 'text-hud-warning'}`}>{drone.status.battery_pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-hud-warning" style={{ width: `${drone.status.battery_pct}%` }} />
                        </div>
                    </div>

                    {/* Signal Strength */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Signal</span>
                            <span className="text-[10px] font-black font-mono text-white/70">{drone.status.signal_dbm}dBm</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden flex space-x-0.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`flex-1 ${i < 3 ? 'bg-hud-accent' : 'bg-white/5'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Temp */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">CPU</span>
                            <span className="text-[10px] font-black font-mono text-white">{drone.sensors.cpu_temp || 42}°C</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-hud-accent/60" style={{ width: '42%' }} />
                        </div>
                    </div>

                    {/* Lidar */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Lidar</span>
                            <span className="text-[10px] font-black font-mono text-hud-accent">{(drone.sensors.lidar_min_dist || 12.4).toFixed(1)}m</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-hud-accent/20" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>

                {/* Tactical Adjustments - Compact */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ceiling</span>
                        <span className="text-[10px] font-mono font-bold text-white">{altitude}m</span>
                    </div>
                    <div className="h-4 flex items-center">
                        <input 
                            type="range" min="0" max="500" value={altitude} 
                            onChange={(e) => setAltitude(parseInt(e.target.value))}
                            className="w-full h-0.5 bg-white/10 appearance-none rounded-full accent-hud-accent cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Exposure</span>
                        <span className="text-[10px] font-mono font-bold text-hud-accent">{exposure.toFixed(1)}</span>
                    </div>
                    <div className="h-4 flex items-center">
                        <input 
                            type="range" min="0" max="25" step="0.1" value={exposure} 
                            onChange={(e) => setExposure(parseFloat(e.target.value))}
                            className="w-full h-0.5 bg-white/10 appearance-none rounded-full accent-white cursor-pointer"
                        />
                    </div>
                </div>

                {/* Action Buttons - Smaller */}
                <div className="flex justify-center space-x-3 pt-2 mt-auto">
                    {[{ label: 'HDR+', icon: 'H' }, { label: 'Moon', icon: 'M' }, { label: 'Eye', icon: 'E' }].map((btn, i) => {
                        const isActive = activeActions.includes(btn.label);
                        return (
                            <button 
                                key={i} onClick={() => toggleAction(btn.label)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${isActive ? 'bg-hud-accent text-black scale-105' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                            >
                                <span className="text-[10px] font-black">{btn.icon}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
