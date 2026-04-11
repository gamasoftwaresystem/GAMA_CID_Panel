import { useState } from 'react';
import { Drone } from '../../../types';
import fleetData from '../../../mock/fleet.json';
import { Shield, Zap, Cpu, Package, ChevronRight, Activity, Terminal, Database, Wind, Radio } from 'lucide-react';

export default function FleetAssets({ drones: _drones }: { drones: Drone[] }) {
    const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);

    // Enhanced Technical metadata to enrich the content
    const seriesMeta: Record<string, any> = {
        "GAMA": {
            "avionics": "Pixhawk 6X Pro / GAMA-OS v4.1",
            "mtow": "12.5 kg",
            "temp_range": "-20°C to +55°C",
            "stability_path": "M 0 10 Q 5 0 10 10 T 20 10 T 30 10 T 40 10",
            "integrity": 98,
            "cycles": 842,
            "max_cycles": 1000
        },
        "MED": {
            "avionics": "Orange Cube+ Dual Redundancy",
            "mtow": "28.0 kg",
            "temp_range": "-10°C to +45°C",
            "stability_path": "M 0 10 Q 5 5 10 10 T 20 10 T 30 5 T 40 10",
            "integrity": 95,
            "cycles": 320,
            "max_cycles": 800
        },
        "HVY": {
            "avionics": "Industrial Titan Autopilot v2",
            "mtow": "125.0 kg",
            "temp_range": "-30°C to +65°C",
            "stability_path": "M 0 10 Q 10 0 20 10 T 40 10",
            "integrity": 92,
            "cycles": 1150,
            "max_cycles": 1500
        }
    };

    return (
        <div className="flex flex-col gap-6 pr-2 mb-8 select-none">
            <div className="flex flex-col space-y-1">
                <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">Asset Technical Registry</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Series ID, Manufacturing Lineage & Technical Blueprints</p>
            </div>

            <div className="space-y-3">
                {Object.entries(fleetData.asset_specs).map(([key, spec]) => {
                    const isExpanded = expandedSeriesId === key;
                    const meta = seriesMeta[key] || seriesMeta["GAMA"];

                    return (
                        <div key={key} className="flex flex-col group">
                            {/* Summary Row */}
                            <div
                                onClick={() => setExpandedSeriesId(isExpanded ? null : key)}
                                className={`grid grid-cols-[1.5fr_1fr_1fr_0.8fr] items-center p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden
                                    ${isExpanded ? 'bg-hud-accent/10 border-hud-accent/30 shadow-[0_0_30px_rgba(94,234,212,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                            >
                                {/* Column 1: Drones Identity */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0
                                        ${isExpanded ? 'bg-hud-accent/20 border-hud-accent/40 rotate-90' : 'bg-black/40 border-white/5'}`}>
                                        <Package className={`w-5 h-5 ${isExpanded ? 'text-hud-accent' : 'text-white/20'}`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[14px] font-black text-white uppercase tracking-wider truncate">{key} SERIES</span>
                                        <span className="text-[8px] font-bold text-hud-accent/60 uppercase tracking-widest mt-0.5 truncate">{spec.model}</span>
                                    </div>
                                </div>

                                {/* Column 2: Tech Summary */}
                                <div className="flex items-center gap-6 px-4 border-l border-white/5 min-w-0">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Endurance</span>
                                        <span className="text-[10px] font-mono font-black text-white/60 lowercase tracking-tighter truncate">{spec.max_flight_time}</span>
                                    </div>
                                </div>

                                {/* Column 3: Logistics */}
                                <div className="flex flex-col gap-1 px-4 border-l border-white/5 min-w-0">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Payload</span>
                                    <div className="flex items-center gap-3">
                                        <Database className="w-3 h-3 text-hud-accent opacity-40 shrink-0" />
                                        <span className="text-[10px] font-mono font-black text-white/60 truncate">{spec.payload_cap}</span>
                                    </div>
                                </div>

                                {/* Column 4: Certification */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors duration-500
                                        ${isExpanded ? 'bg-hud-accent/20 border-hud-accent/30' : 'bg-hud-accent/5 border-hud-accent/10'}`}>
                                        <Shield className="w-2.5 h-2.5 text-hud-accent opacity-60" />
                                        <span className="text-[8px] font-black text-hud-accent uppercase tracking-widest">SHGM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content (Blueprinting Aesthetic) */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-[#0c0c0c]/40 border-x border-b border-white/5 rounded-b-2xl -mt-2
                                ${isExpanded ? 'max-h-[1200px] opacity-100 p-6 md:p-10 pt-12 pb-8' : 'max-h-0 opacity-0 pointer-events-none'}`}>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                                    {/* Tech Column 1: Engineering & Avionics */}
                                    <div className="flex flex-col gap-8 relative z-10">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-hud-accent" />
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Propulsion & Avionics</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-hud-accent/20 transition-colors group/item">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Cpu className="w-3.5 h-3.5 text-hud-accent opacity-60" />
                                                            <span className="text-[8px] font-black text-white/20 uppercase whitespace-nowrap">Main Autopilot</span>
                                                        </div>
                                                        <span className="text-[7px] font-mono text-hud-accent/40 uppercase">Secure</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-white/80 tracking-wide uppercase whitespace-nowrap block overflow-hidden">{meta.avionics}</span>
                                                </div>
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-3.5 h-3.5 text-hud-warning opacity-60" />
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Power Grid</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold text-white/80 leading-snug">{spec.power_system}</span>
                                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                                                            <div className="h-full bg-hud-warning w-[92%] animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2 border-l-2 border-l-hud-accent/30">
                                                    <div className="flex items-center gap-2">
                                                        <Wind className="w-3.5 h-3.5 text-hud-accent opacity-60" />
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Motors</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-white/80 uppercase truncate">{spec.motors}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tech Column 2: Physical & Lifecycle */}
                                    <div className="flex flex-col gap-8 relative z-10">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-hud-accent" />
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Lifecycle Metrics</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
                                                <span className="text-[7px] font-black text-white/20 uppercase">MTOW Rating (Maximum Takeoff Weight)</span>
                                                <span className="text-[16px] font-mono font-black text-white/80 tracking-tighter">{meta.mtow}</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-3.5 h-3.5 text-hud-accent opacity-60" />
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Service Cycle</span>
                                                    </div>
                                                    <span className="text-[9px] font-mono font-black text-hud-accent/60">{meta.cycles} / {meta.max_cycles} HR</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-[2px]">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div key={i} className={`h-full flex-1 rounded-[1px] ${i < (meta.cycles / meta.max_cycles) * 10 ? 'bg-hud-accent/60' : 'bg-white/5'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-[7.5px] font-black text-white/20 uppercase text-center tracking-tighter">Overhaul in {meta.max_cycles - meta.cycles} HRS</span>
                                            </div>
                                            <div className="flex flex-col gap-2 p-4 rounded-xl bg-hud-accent/5 border border-hud-accent/10">
                                                <div className="flex items-center gap-2">
                                                    <Radio className="w-3.5 h-3.5 text-hud-accent opacity-60" />
                                                    <span className="text-[8px] font-black text-hud-accent/40 uppercase">Technical Signature</span>
                                                </div>
                                                <span className="text-[9px] font-mono font-black text-hud-accent/60 break-all leading-none">0x{key}FD82_SYSLOG_{meta.integrity}_SIG</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tech Column 3: Structural Integrity */}
                                    <div className="flex flex-col gap-8 relative z-10">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-hud-accent" />
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Integrity & Compliance</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 border-l-2 border-l-hud-accent">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[8px] font-black text-white/30 uppercase">Hull Integrity</span>
                                                        <span className="text-[14px] font-mono font-black text-white/80">{meta.integrity}%</span>
                                                    </div>
                                                    <div className="w-11 h-11 relative shrink-0">
                                                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white/5" />
                                                            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${meta.integrity}, 100`} className="text-hud-accent" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                                                        <span className="text-[8px] font-black text-white/40 uppercase">Ingress Protection</span>
                                                        <span className="text-[9px] font-black text-hud-accent/60 uppercase">IP67</span>
                                                    </div>
                                                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                                        <span className="text-[8px] font-black text-white/40 uppercase">EMI Hardening</span>
                                                        <span className="text-[9px] font-black text-hud-accent/60 uppercase truncate ml-2">MIL-SPEC</span>
                                                    </div>
                                                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                                        <span className="text-[8px] font-black text-white/40 uppercase">Reg ID</span>
                                                        <span className="text-[8.5px] font-mono font-black text-white/40 uppercase whitespace-nowrap text-right overflow-hidden ml-2">{spec.registration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex flex-col gap-1">
                                                <span className="text-[7.5px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 text-center">Manufacturer Auth</span>
                                                <div className="p-3 rounded-lg border border-dashed border-white/10 flex items-center justify-center opacity-30 mt-1">
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest truncate px-2">{spec.manufacturer}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Registry Footer Row */}
                                <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-6 overflow-hidden">
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Terminal className="w-3 h-3 text-white/20" />
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em] whitespace-nowrap">Archive Rev: 2026.4.11</span>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                                            <Database className="w-3 h-3 text-hud-accent opacity-20" />
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em] whitespace-nowrap">Vault Sync: Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-hud-accent/10 border border-hud-accent/20 hover:bg-hud-accent/20 transition-all group/btn whitespace-nowrap">
                                            <span className="text-[9px] font-black text-hud-accent uppercase tracking-widest">Generate PDF</span>
                                            <ChevronRight className="w-3 h-3 text-hud-accent group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 rounded-2xl border border-hud-accent/10 bg-hud-accent/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-hud-accent uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-ping" />
                    System Repository Sync Status: SECURE
                </span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest hidden sm:block">GAMA-NET v4.2.0</span>
            </div>
        </div>
    );
}
