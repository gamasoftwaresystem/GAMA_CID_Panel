import { Drone } from '../../types';

interface HubHeaderProps {
    drone: Drone;
    activeTab: 'TELEMETRY' | 'LOGS';
    setActiveTab: (tab: 'TELEMETRY' | 'LOGS') => void;
}

export default function HubHeader({ drone, activeTab, setActiveTab }: HubHeaderProps) {
    const batteryPct = drone.status.battery_pct;

    const getBatteryColor = () => {
        if (batteryPct > 70) return '#5EEAD4';
        if (batteryPct > 20) return '#fbbf24';
        return '#ef4444';
    };

    const getBatteryClass = () => {
        if (batteryPct > 70) return 'bg-hud-accent/60 shadow-[0_0_12px_rgba(94,234,212,0.5)]';
        if (batteryPct > 20) return 'bg-hud-warning/60 shadow-[0_0_12px_rgba(234,179,8,0.5)]';
        return 'bg-hud-danger/60 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse';
    };

    return (
        <div className="flex justify-between items-center mb-5 z-10 border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
                {/* Slimmer, Sharp Status Bar */}
                <div 
                    className={`w-[2px] h-9 rounded-full shrink-0 transition-colors duration-500 ${getBatteryClass()}`} 
                    style={{ backgroundColor: getBatteryColor() }}
                />

                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                        <img src="/gama_logo.png" className="w-6 h-6 object-contain brightness-200 mix-blend-screen opacity-40" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-white tracking-[0.3em] leading-tight uppercase font-mono">
                            {drone.drone_id}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0c0c0c] text-hud-accent text-[7px] font-black tracking-[0.15em] uppercase border border-hud-accent/20 shadow-md">
                                <div className="w-1.5 h-1.5 rounded-sm bg-hud-accent rotate-45 shadow-[0_0_8px_rgba(94,234,212,0.4)]" />
                                {drone.status.mode}
                            </div>
                            <span className="px-1.5 py-0.5 rounded-sm bg-white/[0.03] text-white/30 text-[6px] font-black tracking-[0.15em] uppercase border border-white/5">
                                NAV LOCK ON
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Tab Switcher */}
            <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5 mx-4">
                <button 
                    onClick={() => setActiveTab('TELEMETRY')}
                    className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        activeTab === 'TELEMETRY' 
                        ? 'bg-hud-accent/10 text-hud-accent shadow-[0_0_15px_rgba(94,234,212,0.1)]' 
                        : 'text-white/30 hover:text-white/60'
                    }`}
                >
                    Telemetry
                </button>
                <div className="w-px h-3 bg-white/10 mx-0.5" />
                <button 
                    onClick={() => setActiveTab('LOGS')}
                    className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        activeTab === 'LOGS' 
                        ? 'bg-hud-accent/10 text-hud-accent shadow-[0_0_15px_rgba(94,234,212,0.1)]' 
                        : 'text-white/30 hover:text-white/60'
                    }`}
                >
                    Tactical Logs
                </button>
            </div>

            <div className="flex space-x-8 items-center bg-black/20 px-6 py-3 rounded-2xl border border-white/5 uppercase">
                <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-white/30 tracking-[0.2em] mb-1">Mission Dur.</span>
                    <span className="text-lg font-black text-white font-mono tabular-nums leading-none tracking-tighter">32:56</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-white/30 tracking-[0.2em] mb-1">Power Res.</span>
                    <div className="flex items-baseline space-x-3">
                        <span className="text-lg font-black text-white font-mono tabular-nums leading-none tracking-tighter">{batteryPct.toFixed(0)}%</span>
                        <div className="w-8 h-2 rounded-sm border border-white/5 p-0.5 relative overflow-hidden bg-white/5">
                           <div className={`h-full transition-all duration-500 ${
                             batteryPct > 70 ? 'bg-hud-accent' : batteryPct > 20 ? 'bg-hud-warning' : 'bg-hud-danger'
                           }`} style={{ width: `${batteryPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
