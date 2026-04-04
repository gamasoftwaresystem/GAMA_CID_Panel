import { Activity, Radio, Cloud, Home } from 'lucide-react';
import { Drone } from '../../types';

interface SystemBriefingProps {
    drones: Drone[];
}

export default function SystemBriefing({ drones }: SystemBriefingProps) {
    const stats = [
        { label: 'PENDING', count: drones.filter(d => d.status.mission_state === 'PICKUP').length, color: '#9ACEEB' },
        { label: 'IN SERVICE', count: drones.filter(d => d.status.mission_state === 'DELIVERING').length, color: '#fbbf24' },
        { label: 'OUT OF SERVICE', count: drones.filter(d => d.status.mission_state === 'RETURNING').length, color: '#ff0000' }
    ];

    const briefings = [
        { title: "DATA FLOW", desc: "Edge-Backend-Panel Active.", status: "NOMINAL", icon: Activity },
        { title: "CONNECTIVITY", desc: "4.8GHz / 5G Mesh link.", status: "SECURE", icon: Radio },
        { title: "WEATHER", desc: "Hub coords safe.", status: "SAFE", icon: Cloud },
        { title: "SAFETY", desc: "Geofence active.", status: "VERIFIED", icon: Home },
    ];

    return (
        <div className="flex-1 flex gap-8">
            {/* Asset Distribution */}
            <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-6 flex flex-col relative overflow-hidden">
                <div className="mb-8">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Asset Distribution</span>
                    <div className="text-xl font-black text-white font-mono mt-1 tracking-widest">{drones.length} ACTIVE NODES</div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    {stats.map(stat => (
                        <div key={stat.label} className="space-y-2 group">
                            <div className="flex justify-between items-end px-1">
                                <span className="text-[9px] font-bold text-hud-text-muted uppercase tracking-widest group-hover:text-white/60 transition-colors">{stat.label}</span>
                                <span className="text-xs font-mono text-white font-bold">{stat.count}</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-500" style={{ width: `${(stat.count / (drones.length || 1)) * 100}%`, backgroundColor: stat.color }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Status Feed */}
            <div className="flex-1 flex flex-col space-y-4">
                <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-[0.2em] pl-1">
                    System Intelligence Briefing
                </span>
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 max-h-[320px]">
                    {briefings.map((item, idx) => (
                        <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col space-y-2 hover:bg-white/[0.03] transition-colors group">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-3.5 h-3.5 text-white/20 group-hover:text-hud-accent transition-colors" />
                                    <span className="text-[9px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{item.title}</span>
                                </div>
                                <span className="text-[8px] font-black text-hud-accent/40 bg-hud-accent/5 px-1.5 py-0.5 rounded uppercase">{item.status}</span>
                            </div>
                            <p className="text-[10px] text-hud-text-muted font-medium leading-relaxed pl-6.5 group-hover:text-hud-text transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
