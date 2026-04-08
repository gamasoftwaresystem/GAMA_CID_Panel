import React from 'react';
import { Globe, Activity, Wifi, Navigation, CheckCircle2 } from 'lucide-react';
import { Drone } from '../../types';

interface NetworkStatusPanelProps {
    isOpen: boolean;
    onSelectDrone: (id: string | null) => void;
    drones: Drone[];
}

export const NetworkStatusPanel: React.FC<NetworkStatusPanelProps> = ({
    isOpen,
    onSelectDrone,
    drones
}) => {
    if (!isOpen) return null;

    const alerts = [
        { id: '1', level: 'CRITICAL', type: 'WIND WARNING', droneId: drones[0]?.drone_id || 'UAV-01', time: '10 min ago', desc: 'High wind detected in sector Alpha.' },
        { id: '2', level: 'WARNING', type: 'SIGNAL DROP', droneId: drones[1]?.drone_id || 'UAV-04', time: '2 min ago', desc: 'Link degradation detected near Base B.' }
    ];

    return (
        <div className="glass-panel w-[420px] h-[450px] p-5 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto border-t border-white/10">
            <div className="h-full flex flex-col space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-hud-accent animate-pulse" />
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">Network Status</h2>
                    </div>
                    <div className="flex items-center space-x-2 bg-hud-accent/10 px-2 py-1 rounded-full border border-hud-accent/20">
                        <CheckCircle2 className="w-3 h-3 text-hud-accent" />
                        <span className="text-[9px] font-black text-hud-accent uppercase tracking-widest">System Nominal</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {/* Data Link */}
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3 group hover:bg-white/[0.02] transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Activity className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Data Link</span>
                            </div>
                            <span className="text-[8px] font-black text-hud-accent/60 bg-hud-accent/5 px-1.5 py-0.5 rounded uppercase">Nominal</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-hud-text-muted uppercase">Latency</span>
                                <div className="text-sm font-black text-white font-mono">120 <span className="text-[8px] text-white/30">ms</span></div>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-[8px] font-bold text-hud-text-muted uppercase">Downlink</span>
                                <div className="text-sm font-black text-hud-accent font-mono">97 <span className="text-[8px] text-hud-accent/30">%</span></div>
                            </div>
                        </div>
                        {/* Wave SVG */}
                        <div className="h-8 w-full bg-white/[0.02] rounded-lg relative overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <path 
                                    d="M0 15 Q 40 5, 80 15 T 160 15 T 240 15 T 320 15 T 400 15" 
                                    fill="transparent" 
                                    stroke="currentColor" 
                                    strokeWidth="1.5" 
                                    className="text-hud-accent/40 animate-pulse"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Network & Airspace */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <Wifi className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-[8px] font-black text-hud-accent/60 uppercase">Secure</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">5G Mesh Active</span>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Nodes</span>
                                    <span className="text-[10px] font-black text-white font-mono">6/8</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                                     <div className="h-full bg-hud-accent scale-x-[0.75] origin-left transition-transform duration-1000 shadow-[0_0_8px_rgba(94,234,212,0.4)]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <Navigation className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-[8px] font-black text-hud-accent/60 uppercase">Clear</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">Airspace Status</span>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Restriction</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest text-[8px]">None</span>
                                </div>
                                <div className="text-[10px] font-black text-white/60 font-mono mt-1 uppercase">Alt Limit: 400m</div>
                            </div>
                        </div>
                    </div>


                    {/* Alerts Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Active Alerts</span>
                            <span className="text-[8px] font-black text-hud-danger bg-hud-danger/10 px-1.5 py-0.5 rounded uppercase">{alerts.length} Active</span>
                        </div>
                        <div className="space-y-2">
                            {alerts.map(alert => (
                                <button 
                                    key={alert.id}
                                    onClick={() => onSelectDrone(alert.droneId)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col space-y-2 hover:bg-white/[0.03] transition-colors group text-left"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${alert.level === 'CRITICAL' ? 'bg-hud-danger animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-hud-warning animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]'}`} />
                                            <span className="text-[9px] font-black text-white group-hover:text-hud-accent transition-colors uppercase tracking-widest">{alert.type}</span>
                                        </div>
                                        <span className="text-[8px] font-bold text-white/20 uppercase">{alert.time}</span>
                                    </div>
                                    <p className="text-[10px] text-hud-text-muted leading-relaxed font-medium">{alert.desc}</p>
                                    <div className="flex justify-between items-center pt-1 border-t border-white/[0.03] mt-1">
                                        <span className="text-[8px] font-black text-hud-accent uppercase tracking-widest">Source: {alert.droneId}</span>
                                        <span className="text-[7px] font-bold text-white/10 uppercase group-hover:text-white/40 transition-colors tracking-tighter">
                                            {"Locate on Map ->"}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
