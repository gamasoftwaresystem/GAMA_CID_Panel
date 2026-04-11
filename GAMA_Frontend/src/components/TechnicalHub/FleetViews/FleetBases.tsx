import { useState } from 'react';
import { Drone } from '../../../types';
import fleetData from '../../../mock/fleet.json';
import { Map, Users, Plane, Factory, Navigation, Activity, Terminal } from 'lucide-react';

export default function FleetBases({ drones: _drones }: { drones: Drone[] }) {
    const [expandedHubId, setExpandedHubId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-6 pr-2 mb-8">
            <div className="flex flex-col space-y-1">
                <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">Hub Site Management</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Regional Operational Centers & Corridor Status</p>
            </div>

            <div className="space-y-3">
                {fleetData.hubs.map(hub => {
                    const isExpanded = expandedHubId === hub.id;
                    const hubDrones = _drones.filter(d => hub.drones.includes(d.drone_id));

                    return (
                        <div key={hub.id} className="flex flex-col group">
                            {/* Summary Row */}
                            <div 
                                onClick={() => setExpandedHubId(isExpanded ? null : hub.id)}
                                className={`grid grid-cols-[1.5fr_1fr_0.5fr] items-center p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden
                                    ${isExpanded ? 'bg-hud-accent/10 border-hud-accent/30 shadow-[0_0_30px_rgba(94,234,212,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                            >
                                {/* Column 1: Identity */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300
                                        ${isExpanded ? 'bg-hud-accent/20 border-hud-accent/40' : 'bg-black/40 border-white/5'}`}>
                                        <Map className={`w-5 h-5 ${isExpanded ? 'text-hud-accent' : 'text-white/20'}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-white uppercase tracking-wider">{hub.name}</span>
                                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                            <Factory className="w-2.5 h-2.5" /> {hub.provider}
                                        </span>
                                    </div>
                                </div>

                                {/* Column 2: Operation Site */}
                                <div className="flex flex-col gap-1 px-4">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Site Intel</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono font-black text-white/60 uppercase tracking-widest leading-none">Radius: {hub.coverage_radius}</span>
                                    </div>
                                </div>

                                {/* Column 3: Status */}
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${hub.central_status === 'ACTIVE' || hub.central_status === 'NOMINAL' ? 'text-hud-accent' : 'text-hud-warning'}`}>
                                            {hub.central_status}
                                        </span>
                                        <div className={`w-2 h-2 rounded rotate-45 transition-all duration-500 ${hub.central_status === 'ACTIVE' || hub.central_status === 'NOMINAL' ? 'bg-hud-accent shadow-[0_0_12px_rgba(94,234,212,0.8)]' : 'bg-white/5'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-white/[0.01] border-x border-b border-white/5 rounded-b-2xl -mt-2
                                ${isExpanded ? 'max-h-[800px] opacity-100 p-6 pt-8 pb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    {/* Left Side: Stationed Fleet */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Activity className="w-3.5 h-3.5 text-hud-accent opacity-40" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Active Deployment Registry</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {hubDrones.map(drone => (
                                                <div key={drone.drone_id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group/drone hover:border-hud-accent/20 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Plane className="w-4 h-4 text-white/20 group-hover/drone:text-hud-accent transition-colors" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-mono font-black text-white/80">{drone.drone_id}</span>
                                                            <span className="text-[7px] font-bold text-hud-accent/40 uppercase tracking-widest">{drone.status.mission_state}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 pr-2">
                                                        {/* Battery Mini Indicator */}
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[7px] font-black text-white/20 uppercase">Power</span>
                                                            <div className="flex gap-[1px] h-1.5">
                                                                {[...Array(4)].map((_, i) => (
                                                                    <div key={i} className={`w-2 h-full rounded-[0.5px] ${drone.status.battery_pct >= (i+1)*25 ? 'bg-hud-accent' : 'bg-white/5'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="w-px h-6 bg-white/5" />
                                                        <div className="flex flex-col items-end gap-0.5">
                                                            <span className="text-[7px] font-black text-white/20 uppercase">Temp</span>
                                                            <span className="text-[9px] font-mono font-black text-white/60">{drone.sensors.cpu_temp}°C</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Side: Air Corridors */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Navigation className="w-3.5 h-3.5 text-hud-accent opacity-40" />
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Airspace Corridor Authorization</span>
                                        </div>
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 relative overflow-hidden min-h-[160px] flex flex-col justify-center">
                                            {/* Technical Grid Overlay */}
                                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                                                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                            
                                            <div className="space-y-3 relative z-10">
                                                {hub.air_corridors.map(corridor => (
                                                    <div key={corridor.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                                corridor.status === 'CLEAR' ? 'bg-hud-accent' : 
                                                                corridor.status === 'CONGESTED' ? 'bg-hud-warning' : 'bg-hud-danger'
                                                            }`} />
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-white/70 uppercase">{corridor.path}</span>
                                                                <span className="text-[6px] font-bold text-white/20 font-mono">{corridor.id}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[7px] font-black px-2 py-0.5 rounded border ${
                                                            corridor.status === 'CLEAR' ? 'border-hud-accent/20 text-hud-accent bg-hud-accent/5' :
                                                            corridor.status === 'CONGESTED' ? 'border-hud-warning/20 text-hud-warning bg-hud-warning/5' :
                                                            'border-hud-danger/20 text-hud-danger bg-hud-danger/5'
                                                        }`}>
                                                            {corridor.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personnel & Sync Status Row */}
                                <div className="pt-6 border-t border-white/5 flex items-end justify-between">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Users className="w-3 h-3" /> Assigned Personnel Registry
                                        </span>
                                        <div className="flex gap-2">
                                            {hub.pilots.map(pId => {
                                                const p = fleetData.pilots.find(p => p.id === pId);
                                                return (
                                                    <div key={pId} className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-default">
                                                        <div className="w-5 h-5 rounded-full bg-hud-accent/10 border border-hud-accent/20 flex items-center justify-center text-[7px] font-black text-hud-accent">
                                                            {p?.name.split(' ').map(n=>n[0]).join('')}
                                                        </div>
                                                        <span className="text-[9px] font-black text-white/60 tracking-wider capitalize">{p?.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">System Sync</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-hud-accent w-[85%] animate-pulse" />
                                                </div>
                                                <span className="text-[9px] font-mono font-black text-hud-accent/60">OK</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[#0c0c0c] border border-white/5 flex items-center justify-center relative group/btn cursor-pointer overflow-hidden">
                                            <div className="absolute inset-0 bg-hud-accent/0 group-hover/btn:bg-hud-accent/10 transition-colors" />
                                            <Terminal className="w-4 h-4 text-white/20 group-hover/btn:text-hud-accent transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
