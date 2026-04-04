import { Battery, Wifi, Info, X, Activity } from 'lucide-react';
import { Drone } from '../types';

interface DroneCardProps {
    drone: Drone;
    onClick: () => void;
    onOpenTechnicalHub: (e: React.MouseEvent) => void;
    selected?: boolean;
    isExpanded?: boolean;
    onToggleExpand: () => void;
}

export default function DroneCard({ 
    drone, 
    onClick, 
    onOpenTechnicalHub, 
    selected,
    isExpanded,
    onToggleExpand
}: DroneCardProps) {
    const batteryPct = drone.status.battery_pct;

    // Mock tech specs base on ID
    const specs = {
        manufacturer: drone.drone_id.startsWith('GAMA') ? 'GAMA Aerospace' : 'MED-Link Systems',
        model: drone.drone_id.startsWith('GAMA') ? 'Falcon-X Strike' : 'Lifesaver-2',
        mfgDate: 'Q3 2025',
        type: 'Electric multirotor',
        maxRange: '45km',
        payload: '12.5kg'
    };

    // Get color based on battery level
    const getBatteryColor = () => {
        if (batteryPct > 70) return '#5EEAD4'; // hud-accent
        if (batteryPct > 20) return '#fbbf24'; // hud-warning
        return '#ef4444'; // hud-danger
    };

    // Get color based on battery level (Tailwind variant for glow/pulse)
    const getBatteryClass = () => {
        if (batteryPct > 70) return 'bg-hud-accent/60 shadow-[0_0_8px_rgba(94,234,212,0.5)]';
        if (batteryPct > 20) return 'bg-hud-warning/60 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
        return 'bg-hud-danger/60 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse';
    };

    const getStatusText = () => {
        if (drone.status.mission_state === 'PICKUP') return 'Pending';
        if (drone.status.mission_state === 'DELIVERING') return 'In Service';
        if (drone.status.mission_state === 'RETURNING') return 'Out of Service';
        return drone.status.mode || 'Standby';
    };

    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-500 rounded-xl border flex flex-col relative overflow-hidden
        ${selected
                    ? 'bg-white/10 border-white/20 shadow-lg scale-[1.02]'
                    : 'bg-black/40 border-white/5 hover:bg-black/50 hover:border-white/10'
                }
        ${isExpanded ? 'p-3' : 'p-2.5'}
      `}
        >
            {/* Top Row: Main Content */}
            <div className="flex items-center gap-3 w-full">
                {/* Vertical Battery Bar */}
                <div
                    className={`w-1 transition-all duration-500 shrink-0 ${getBatteryClass()} ${isExpanded ? 'h-10' : 'h-7'}`}
                    style={{ backgroundColor: getBatteryColor() }}
                />

                {/* Drone Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-0.5 leading-none">
                        {drone.drone_id}
                    </h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[8px] text-hud-text-muted uppercase font-bold tracking-widest truncate">
                            {getStatusText()}
                        </p>
                        {!isExpanded && (
                            <div className="flex items-center gap-1.5 opacity-30">
                                <div className="flex items-center gap-0.5">
                                    <Wifi className="w-2 h-2" />
                                    <span className="text-[7px] font-mono leading-none">{drone.status.signal_dbm}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Battery className="w-2 h-2" />
                                    <span className="text-[7px] font-mono leading-none">{batteryPct.toFixed(0)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Toggle Button */}
                <button
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${isExpanded ? 'bg-hud-accent/20 text-hud-accent shadow-[0_0_10px_rgba(94,234,212,0.2)]' : 'bg-white/5 text-hud-text-muted hover:text-white'}`}
                    onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                >
                    {isExpanded ? <X className="w-3 h-3" /> : <Info className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Expanded Content: Technical Specs */}
            <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-56 opacity-100 mt-3 pt-3 border-t border-white/5' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Manufacturer</span>
                        <span className="text-[8px] text-white font-bold">{specs.manufacturer}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Model</span>
                        <span className="text-[8px] text-white font-bold">{specs.model}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Type</span>
                        <span className="text-[8px] text-white font-bold">{specs.type}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Max Range</span>
                        <span className="text-[8px] text-hud-accent font-black">{specs.maxRange}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Max Altitude</span>
                        <span className="text-[8px] text-white/70 font-bold">2,500m MSL</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Propulsion</span>
                        <span className="text-[8px] text-white/70 font-bold">Brushless DC</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Mfg. Date</span>
                        <span className="text-[8px] text-white/50 font-bold">{specs.mfgDate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Service ID</span>
                        <span className="text-[8px] text-white/50 font-bold">G-{drone.drone_id.split('-')[1] || '000'}-ST</span>
                    </div>
                </div>

                {/* Open Technical Hub Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onOpenTechnicalHub(e); }}
                    className="w-full mt-4 py-2 rounded-lg border border-hud-accent/30 bg-hud-accent/5 text-[9px] font-black text-hud-accent uppercase tracking-[0.2em] hover:bg-hud-accent/10 hover:border-hud-accent/60 transition-all flex items-center justify-center gap-2 group/btn"
                >
                    <Activity className="w-3.5 h-3.5" />
                    Live Technical Hub
                </button>
            </div>
        </div>
    );
}
