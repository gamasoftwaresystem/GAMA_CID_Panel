import { Wifi, Info, X, Activity, Navigation, Gauge, Diamond } from 'lucide-react';
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
        manufacturer: 'Gama Drones',
        model: 'eX3-HLM',
        mfgDate: '26 July 2026',
        belongs: 'Yemeksepeti',
        lastUpdate: '14:03:82',
        geofence: 'OK',
        operatorHub: 'IST-3-HUB',
        serviceId: 'G-02-EV'
    };

    // Get color based on battery level
    const getBatteryColor = () => {
        if (batteryPct > 70) return '#5EEAD4'; // hud-accent
        if (batteryPct > 20) return '#fbbf24'; // hud-warning
        return '#ef4444'; // hud-danger
    };

    // Get color based on battery level (Tailwind variant for glow/pulse)
    const getStatusText = () => {
        switch (drone.status.mission_state) {
            case 'IN_SERVICE': return 'In Service';
            case 'PENDING': return 'Pending';
            case 'RETURNING': return 'Returning';
            case 'OUT_OF_SERVICE': return 'Out of Service';
            case 'OFFLINE': return 'Offline';
            default: return drone.status.mode || 'Standby';
        }
    };

    const getPilotStatus = () => {
        switch (drone.status.mode) {
            case 'MANUAL': return 'Pilot';
            case 'AUTO': return 'Auto Pilot';
            case 'RTL':
            case 'GUIDED': return 'Nav Auto Pilot';
            default: return 'Auto Pilot';
        }
    };

    const getStatusBadgeColor = () => {
        switch (drone.status.mission_state) {
            case 'IN_SERVICE': return 'bg-[#0c0c0c] text-[#10b981] border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
            case 'PENDING': return 'bg-[#0c0c0c] text-[#3b82f6] border-[#3b82f6]/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]';
            case 'RETURNING': return 'bg-[#0c0c0c] text-[#f59e0b] border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
            case 'OUT_OF_SERVICE': return 'bg-[#0c0c0c] text-[#ef4444] border-[#ef4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]';
            case 'OFFLINE': return 'bg-[#0c0c0c] text-[#64748b] border-[#64748b]/20';
            default: return 'bg-[#0c0c0c] text-white/40 border-white/10';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-500 rounded-xl border flex flex-col relative overflow-hidden
        ${selected
                    ? 'bg-white/10 border-white/20 shadow-lg scale-[1.02]'
                    : 'bg-black/40 border-white/5 hover:bg-black/50 hover:border-white/10'
                }
        ${isExpanded ? 'p-5' : 'p-4'}
      `}
        >
            {/* Far Left: Solid Vertical Accent Bar (1:1 with image) */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500 z-10 ${drone.status.mission_state === 'IN_SERVICE' ? 'bg-[#10b981]' :
                    drone.status.mission_state === 'PENDING' ? 'bg-[#3b82f6]' :
                        drone.status.mission_state === 'RETURNING' ? 'bg-[#f59e0b]' :
                            drone.status.mission_state === 'OUT_OF_SERVICE' ? 'bg-[#ef4444]' :
                                drone.status.mission_state === 'OFFLINE' ? 'bg-[#64748b]' :
                                    'bg-hud-accent'
                    }`}
            />

            {/* Top Row: Main Content - Redesigned to match image layout */}
            <div className="flex items-center gap-6 w-full relative pl-2">

                {/* Section 1: Visual - Drone Image (Frameless) */}
                <div className="w-20 h-16 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src="/card-drone.png"
                        alt="Drone"
                        className="w-full h-full object-contain brightness-75 group-hover:brightness-100 transition-all duration-500"
                    />
                </div>

                {/* Section 2: Core Info - Center Column */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="text-white font-black text-[13px] uppercase tracking-[0.2em] mb-1 leading-none">
                        {drone.drone_id}
                    </h3>
                    <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1.5">
                        {getPilotStatus()}
                    </p>
                    <p className="text-[6px] text-white/30 uppercase font-bold tracking-widest truncate">
                        Station {drone.drone_id.split('-')[1] || 'Alpha'} Hub
                    </p>
                </div>

                {/* Section 3: Operational Status - Right Column */}
                <div className="flex flex-col items-end justify-between py-1.5 h-20 shrink-0 relative">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.2em] shadow-lg transition-all duration-300 ${getStatusBadgeColor()}`}>
                        <Diamond className="w-2.5 h-2.5 fill-current" />
                        {getStatusText()}
                    </div>

                    {/* Battery Status - Aesthetic Refined */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white font-mono tracking-tighter leading-none">{batteryPct.toFixed(0)}%</span>
                        <div className="flex gap-[1.5px] items-center h-2.5">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[2.5px] h-full transition-all duration-500 rounded-full"
                                    style={{
                                        backgroundColor: batteryPct >= (i + 1) * 12.5 ? getBatteryColor() : 'rgba(255,255,255,0.05)',
                                        boxShadow: batteryPct >= (i + 1) * 12.5 ? `0 0 8px ${getBatteryColor()}40` : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Schedule / Flow + Integrated Info Button */}
                    <div className="flex items-center gap-2">
                        <p className="text-[7.5px] font-black text-white/10 uppercase tracking-[0.15em]">
                            İnfo
                        </p>
                        <button
                            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${isExpanded ? 'text-hud-accent' : 'text-white/30 hover:text-white/80'}`}
                            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                        >
                            {isExpanded ? <X className="w-2.5 h-2.5" /> : <Info className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Row - Shifted to Expanded view only for direct image match */}
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Navigation className="w-2.5 h-2.5 rotate-45 text-hud-accent" />
                            <span className="text-[8px] font-black font-mono tracking-tighter uppercase text-white/60">ALT {drone.navigation.alt_relative.toFixed(0)}m</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gauge className="w-2.5 h-2.5 text-hud-accent" />
                            <span className="text-[8px] font-black font-mono tracking-tighter uppercase text-white/60">SPD {drone.navigation.ground_speed.toFixed(0)}m/s</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Wifi className="w-2.5 h-2.5 text-hud-accent" />
                        <span className="text-[8px] font-black font-mono tracking-tighter uppercase text-white/60">LINK OK</span>
                    </div>
                </div>
            )}

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
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Belongs</span>
                        <span className="text-[8px] text-white font-bold">{specs.belongs}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Last Update</span>
                        <span className="text-[8px] text-hud-accent font-black">{specs.lastUpdate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Geofence</span>
                        <span className="text-[8px] text-white/70 font-bold">{specs.geofence}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Operator Hub</span>
                        <span className="text-[8px] text-white/70 font-bold">{specs.operatorHub}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Mfg. Date</span>
                        <span className="text-[8px] text-white/50 font-bold">{specs.mfgDate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] text-hud-text-muted uppercase font-black tracking-widest mb-0.5">Service ID</span>
                        <span className="text-[8px] text-white/50 font-bold">{specs.serviceId}</span>
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
