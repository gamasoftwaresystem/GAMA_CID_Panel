import { Drone } from '../types';
import GamaHudVideo from '../components/hud/GamaHudVideo';
import GamaHudSidebar from '../components/hud/GamaHudSidebar';
import GamaHudBottomGrid from '../components/hud/GamaHudBottomGrid';
import GamaHudCompass from '../components/hud/GamaHudCompass';
import { Cloud } from 'lucide-react';

interface PilotDashboardProps {
    drone: Drone;
    weatherData: { temp: string; condition: string; wind: string } | null;
    onLogout: () => void;
    drones: Drone[];
}

export default function PilotDashboard({ drone, weatherData, onLogout, drones }: PilotDashboardProps) {
    return (
        <div className="w-full h-full flex flex-col bg-[#30454C] text-hud-text selection:bg-hud-accent overflow-hidden">
            {/* 1. Admin-Style Header Bar */}
            <header className="h-16 bg-black/40 border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-50">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse shadow-[0_0_8px_rgba(94,234,212,0.5)]" />
                        <span className="text-[13px] font-black text-white tracking-[0.1em] uppercase">Tactical.Uplink: STABLE</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                     <div className="glass-panel h-10 flex items-center px-6 space-x-3 border-white/5 bg-white/5 rounded-xl">
                        <Cloud className="w-4 h-4 text-hud-accent animate-pulse" />
                        <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">{weatherData?.temp || '36'}°C</span>
                    </div>
                    <div className="glass-panel h-10 flex items-center px-6 space-x-3 border-hud-accent/20 bg-hud-accent/5 rounded-xl shadow-[0_0_20px_rgba(94,234,212,0.05)]">
                        <span className="text-[11px] font-black text-hud-accent uppercase tracking-[0.1em]">
                            Ongoing Units • 12
                        </span>
                    </div>
                </div>
            </header>

            {/* 2. Admin-Style Compact Grid */}
            <main className="flex-1 p-6 grid grid-cols-[1fr_360px] grid-rows-[minmax(0,1fr)_240px] gap-6 overflow-hidden">
                {/* Top Left: Expanded Video Feed */}
                <div className="col-span-1 row-span-1 min-h-0">
                    <GamaHudVideo drone={drone} />
                </div>

                {/* Top Right: Compact Sidebar */}
                <div className="col-span-1 row-span-1">
                    <GamaHudSidebar drone={drone} onLogout={onLogout} />
                </div>

                {/* Bottom Left: Unified Stats & Nav Panel */}
                <div className="col-span-1 row-span-1 min-h-0">
                    <GamaHudBottomGrid drone={drone} drones={drones} />
                </div>

                {/* Bottom Right: Tactical Compass */}
                <div className="col-span-1 row-span-1">
                    <GamaHudCompass drone={drone} />
                </div>
            </main>
        </div>
    );
}
