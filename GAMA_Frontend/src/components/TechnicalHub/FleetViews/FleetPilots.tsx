import { useState } from 'react';
import { Drone } from '../../../types';
import fleetData from '../../../mock/fleet.json';
import { User, MapPin, Award, Terminal, Activity, Zap, Cpu, Wifi, Diamond } from 'lucide-react';

export default function FleetPilots({ drones }: { drones: Drone[] }) {
    const [expandedPilotId, setExpandedPilotId] = useState<string | null>(null);
    return (
        <div className="flex flex-col gap-6 pr-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                    <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-hud-accent opacity-50" />
                        Pilot Personnel Registry
                    </h3>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-black ml-6">SHGM / ICAO Certified Flight Operators</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Active Pilots</span>
                        <span className="text-[14px] font-black text-hud-accent font-mono">0{fleetData.pilots.length}</span>
                    </div>
                    <div className="w-px h-6 bg-white/5" />
                    <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Global Status</span>
                        <span className="text-[10px] font-black text-white/60">NOMINAL</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {fleetData.pilots.map(pilot => {
                    const isExpanded = expandedPilotId === pilot.id;
                    const hub = fleetData.hubs.find(h => h.name === pilot.base);
                    const assignedDrones = drones.filter(d => pilot.assigned_drones.includes(d.drone_id));

                    return (
                        <div key={pilot.id} className="relative group flex flex-col">
                            {/* Main Row */}
                            <div
                                onClick={() => setExpandedPilotId(isExpanded ? null : pilot.id)}
                                className={`grid grid-cols-[1.5fr_1fr_0.5fr] gap-12 items-center px-6 py-5 cursor-pointer rounded-2xl transition-all duration-500 
                                    ${isExpanded ? 'bg-white/5 border border-white/10' : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-hud-accent/20 group-hover:-translate-y-0.5'}
                                    shadow-lg group-hover:shadow-hud-accent/5 relative overflow-hidden`}
                            >
                                {/* Accent Line */}
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 transition-all duration-500 rounded-r-full
                                    ${isExpanded ? 'bg-hud-accent' : 'bg-hud-accent/0 group-hover:bg-hud-accent'}`} />

                                {/* Column 1: Identity */}
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center relative group-hover:border-hud-accent/30 transition-colors shrink-0">
                                        <User className={`w-5 h-5 transition-opacity ${isExpanded ? 'text-hud-accent opacity-100' : 'text-hud-accent opacity-40 group-hover:opacity-100'}`} />
                                        <div className={`absolute inset-0 bg-hud-accent/5 rounded-xl transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-2.5 h-2.5 text-hud-accent/40" />
                                            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{pilot.rank}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Fleet Status Summary (Battery) */}
                                <div className="flex flex-col gap-1.5 px-4 min-w-[140px]">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Fleet Operational Power</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-[1.5px] items-center h-2.5">
                                            {[...Array(8)].map((_, i) => {
                                                const avgBattery = assignedDrones.length > 0 ? (assignedDrones.reduce((acc, d) => acc + d.status.battery_pct, 0) / assignedDrones.length) : 0;
                                                const isActive = avgBattery >= (i + 1) * 12.5;
                                                const color = avgBattery >= 85 ? '#10b981' : avgBattery >= 50 ? '#f59e0b' : '#ef4444';
                                                return (
                                                    <div 
                                                        key={i} 
                                                        className="w-[2.5px] h-full rounded-full transition-all duration-500"
                                                        style={{ 
                                                            backgroundColor: isActive ? color : 'rgba(255,255,255,0.05)',
                                                            boxShadow: isActive ? `0 0 8px ${color}40` : 'none'
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <span className={`text-[11px] font-mono font-black tabular-nums ${
                                            (assignedDrones.length > 0 ? (assignedDrones.reduce((acc, d) => acc + d.status.battery_pct, 0) / assignedDrones.length) : 0) >= 85 ? 'text-hud-accent' : 
                                            (assignedDrones.length > 0 ? (assignedDrones.reduce((acc, d) => acc + d.status.battery_pct, 0) / assignedDrones.length) : 0) >= 50 ? 'text-hud-warning' : 'text-hud-danger'
                                        }`}>
                                            {assignedDrones.length > 0 
                                                ? Math.round(assignedDrones.reduce((acc, d) => acc + d.status.battery_pct, 0) / assignedDrones.length) 
                                                : 0}%
                                        </span>
                                    </div>
                                </div>

                                {/* Column 3: Status */}
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${pilot.status === 'ACTIVE' ? 'text-hud-accent' : 'text-white/10'}`}>
                                            {pilot.status}
                                        </span>
                                        <div className={`w-2 h-2 rounded rotate-45 transition-all duration-500 ${pilot.status === 'ACTIVE' ? 'bg-hud-accent shadow-[0_0_12px_rgba(94,234,212,0.8)]' : 'bg-white/5'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-white/[0.01] border-x border-b border-white/5 rounded-b-2xl -mt-2
                                ${isExpanded ? 'max-h-96 opacity-100 p-6 pt-8 pb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>

                                <div className="grid grid-cols-2 gap-8">
                                    {/* Left Side: Drone Data (UAV Style) */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Cpu className="w-3 h-3 text-hud-accent opacity-40" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Live Drone Telemetry</span>
                                        </div>
                                        <div className="space-y-3">
                                            {assignedDrones.map(drone => (
                                                <div key={drone.drone_id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-hud-accent shadow-[0_0_8px_rgba(94,234,212,0.5)]" />
                                                            <span className="text-[11px] font-black text-white font-mono">{drone.drone_id}</span>
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                                                            drone.status.mission_state === 'IN_SERVICE' ? 'text-hud-accent' : 'text-white/40'
                                                        }`}>
                                                            {drone.status.mission_state}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Battery</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-[1.5px] h-2.5">
                                                                    {[...Array(8)].map((_, i) => (
                                                                        <div 
                                                                            key={i} 
                                                                            className="w-[2.5px] h-full rounded-full transition-all duration-500"
                                                                            style={{
                                                                                backgroundColor: drone.status.battery_pct >= (i + 1) * 12.5 
                                                                                    ? (drone.status.battery_pct >= 85 ? '#10b981' : drone.status.battery_pct >= 50 ? '#f59e0b' : '#ef4444') 
                                                                                    : 'rgba(255,255,255,0.05)',
                                                                                boxShadow: drone.status.battery_pct >= (i + 1) * 12.5 
                                                                                    ? `0 0 8px ${drone.status.battery_pct >= 85 ? '#10b981' : drone.status.battery_pct >= 50 ? '#f59e0b' : '#ef4444'}40` 
                                                                                    : 'none'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[9px] font-black text-white/60 font-mono tracking-tighter">{drone.status.battery_pct.toFixed(0)}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Speed</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <Zap className="w-2.5 h-2.5 text-hud-accent opacity-40" />
                                                                <span className="text-[9px] font-black text-white/60 font-mono">{drone.navigation.ground_speed.toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Signal</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <Wifi className="w-2.5 h-2.5 text-hud-accent opacity-40" />
                                                                <span className="text-[9px] font-black text-white/60 font-mono">{drone.status.signal_dbm}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {assignedDrones.length === 0 && (
                                                <div className="p-4 rounded-xl border border-white/5 border-dashed flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-white/20 uppercase italic">No active telemetry found</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side: Location & Hub Data */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-3 h-3 text-hud-accent opacity-40" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Deployment Center</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-4 h-full relative overflow-hidden group/hub">
                                            {/* Decorative Hub Icon */}
                                            <Diamond className="absolute -bottom-4 -right-4 w-24 h-24 text-hud-accent/[0.03] group-hover/hub:text-hud-accent/[0.05] transition-colors" />

                                            <div className="flex flex-col relative z-10">
                                                <span className="text-[12px] font-black text-white uppercase tracking-widest">{hub?.name || 'Unknown Hub'}</span>
                                                <span className="text-[8px] font-bold text-hud-accent/60 uppercase tracking-widest mt-1">Status: {hub?.central_status || 'OFFLINE'}</span>
                                            </div>

                                            <div className="flex flex-col gap-3 relative z-10 mt-auto">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Active Corridors</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {hub?.air_corridors.map(c => (
                                                            <div key={c.id} className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-white/5">
                                                                <div className={`w-1 h-1 rounded-full ${c.status === 'CLEAR' ? 'bg-hud-accent' : 'bg-hud-warning'}`} />
                                                                <span className="text-[7px] font-mono text-white/40 tracking-tighter">{c.path}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <Wifi className="w-3 h-3 text-hud-accent/40" />
                                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">HQ Sync Active</span>
                                                    </div>
                                                    <span className="text-[8px] font-mono text-white/20">LOC: IST_R_01</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Status Bar */}
            <div className="mt-2 p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-hud-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                        <Activity className="w-3 h-3 text-hud-accent animate-pulse" />
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Syncing with HQ Registry</span>
                    </div>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest hidden md:block italic">Security Level: Grade-4 Operator Access</span>
                </div>
                <div className="flex gap-2 relative z-10">
                    <button className="text-[8px] font-black text-white/40 uppercase tracking-widest px-4 py-1.5 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all">
                        Refresh Database
                    </button>
                    <button className="text-[8px] font-black text-hud-accent uppercase tracking-widest px-4 py-1.5 border border-hud-accent/20 rounded-xl bg-hud-accent/5 hover:bg-hud-accent/10 transition-all">
                        Assign New Pilot
                    </button>
                </div>
            </div>
        </div>
    );
}
