import { Globe, Activity, Share2, RotateCcw, Video, Cpu, Settings, Radio, Crosshair, BellRing, Wind, WifiOff, MoreHorizontal, X } from 'lucide-react';
import { Drone } from '../../types';

interface NetworkStatusPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDrone: (id: string | null) => void;
    drones: Drone[];
}

export const NetworkStatusPanel: React.FC<NetworkStatusPanelProps> = ({
    isOpen,
    onClose,
    onSelectDrone,
    drones
}) => {
    if (!isOpen) return null;

    const alerts = [
        { id: '1', level: 'CRITICAL', type: 'WIND WARNING', droneId: drones[0]?.drone_id || 'UAV-01', time: '10 min ago', desc: 'High wind detected in sector Alpha.' },
        { id: '2', level: 'WARNING', type: 'SIGNAL DROP', droneId: drones[1]?.drone_id || 'UAV-04', time: '2 min ago', desc: 'Link degradation detected near Base B.' }
    ];

    return (
        <div className="glass-panel w-[1000px] h-[550px] p-6 rounded-3xl hud-panel-enter shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto border-t border-white/10 relative">
            {/* HUD Background Aesthetics - Clean Zero-Grid Version */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,234,212,0.03),transparent_70%)] pointer-events-none" />

            <div className="h-full flex flex-col space-y-4 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                    <div className="flex items-center gap-3">
                        <Globe className="w-3.5 h-3.5 text-hud-accent opacity-80 animate-pulse" />
                        <div className="flex flex-col">
                            <h2 className="text-[12px] font-black text-white tracking-[0.2em] uppercase leading-none">Network Status</h2>
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1.5 font-mono">SIGNAL_INTEGRITY_v2.1</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hud-accent/[0.03] border border-hud-accent/20">
                            <div className="w-1 h-1 rounded-full bg-hud-accent shadow-[0_0_6px_rgba(94,234,212,0.6)]" />
                            <span className="text-[8px] font-black text-hud-accent uppercase tracking-widest leading-none">Nominal</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all group"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {/* Data Link Overhaul */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-6 group transition-all hover:bg-white/[0.05]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-hud-accent/60" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Data Link</span>
                            </div>
                            <span className="text-[8px] font-black text-hud-accent bg-hud-accent/10 px-2 py-0.5 rounded-md border border-hud-accent/20 uppercase tracking-widest">Nominal</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {/* Latency */}
                            <div className="space-y-2">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Latency</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white font-mono tabular-nums leading-none">120</span>
                                    <span className="text-[8px] font-bold text-white/20 uppercase">ms</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5 w-fit">
                                    <div className="w-0; h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-hud-accent opacity-60" />
                                    <span className="text-[7px] font-bold text-hud-accent/80 font-mono">-8 ms <span className="text-white/20">vs 1m</span></span>
                                </div>
                            </div>

                            {/* Packet Loss */}
                            <div className="space-y-2 border-l border-white/5 pl-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Packet Loss</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white font-mono tabular-nums leading-none">0.4</span>
                                    <span className="text-[8px] font-bold text-white/20 uppercase">%</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5 w-fit">
                                    <div className="w-0; h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-hud-accent opacity-60" />
                                    <span className="text-[7px] font-bold text-hud-accent/80 font-mono">-0.2% <span className="text-white/20">vs 1m</span></span>
                                </div>
                            </div>

                            {/* Downlink Reliability */}
                            <div className="space-y-2 border-l border-white/5 pl-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">Reliability</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-hud-accent font-mono tabular-nums leading-none">97</span>
                                    <span className="text-[8px] font-bold text-hud-accent/30 uppercase">%</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5 w-fit">
                                    <div className="w-0; h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-hud-accent opacity-60" />
                                    <span className="text-[7px] font-bold text-hud-accent/80 font-mono">+1% <span className="text-white/20">vs 1m</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Wave SVG Component - Professional Glow Tracer */}
                        <div className="relative pt-2">
                            <div className="h-16 w-full bg-black/40 rounded-xl relative overflow-hidden border border-white/5 transition-colors">
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 64">
                                    {/* Secondary Glow Trace */}
                                    <path
                                        d="M0 32 C 50 20, 100 45, 150 25 C 200 5, 250 40, 300 35 C 350 30, 400 40, 400 35"
                                        fill="transparent"
                                        stroke="#5EEAD4"
                                        strokeWidth="4"
                                        className="opacity-5 blur-[4px]"
                                    />
                                    {/* Primary Sharp Trace */}
                                    <path
                                        d="M0 32 C 50 20, 100 45, 150 25 C 200 5, 250 40, 300 35 C 350 30, 400 40, 400 35"
                                        fill="transparent"
                                        stroke="#5EEAD4"
                                        strokeWidth="1.5"
                                        className="opacity-60"
                                    />
                                    <path
                                        d="M0 32 C 50 20, 100 45, 150 25 C 200 5, 250 40, 300 35 C 350 30, 400 40, 400 35 L 400 64 L 0 64 Z"
                                        fill="url(#waveGradientProfessional)"
                                        className="opacity-10"
                                    />
                                    <defs>
                                        <linearGradient id="waveGradientProfessional" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Segment Markers */}
                                <div className="absolute inset-0 flex justify-around pointer-events-none opacity-[0.03]">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-px h-full bg-white" />)}
                                </div>

                                {/* Labels Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                                    <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">200 ms_TH</span>
                                    <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">0.0 BASELIN</span>
                                </div>
                                <div className="absolute bottom-1 right-2 pointer-events-none">
                                    <span className="text-[6px] font-black text-hud-accent/40 uppercase tracking-tighter font-mono">SCN: 60.0s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3-Column Tactical Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Mesh Network Module */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-4 group transition-all hover:bg-white/[0.05]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-3.5 h-3.5 text-hud-accent/60" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Mesh Network</span>
                                </div>
                                <span className="text-[7px] font-black text-hud-accent bg-hud-accent/10 px-2 py-0.5 rounded-md border border-hud-accent/20 uppercase tracking-widest">Secure</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Nodes Active</span>
                                        <div className="text-lg font-black text-white font-mono mt-0.5">6 <span className="text-white/20">/ 8</span></div>
                                    </div>
                                </div>

                                {/* Vertical Signal Bars */}
                                <div className="flex items-end gap-1 h-10">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-sm transition-all duration-500 ${i <= 6 ? 'bg-hud-accent/60 shadow-[0_0_10px_rgba(94,234,212,0.1)]' : 'bg-white/5'}`}
                                            style={{ height: `${20 + (i * 8)}%`, opacity: i <= 6 ? 1 : 0.3 }}
                                        />
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-2 pt-1">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                                        <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Relay Links</span>
                                        <span className="text-[7px] font-black text-hud-accent uppercase tracking-tighter">Stable</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                                        <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Topology</span>
                                        <span className="text-[7px] font-black text-hud-accent uppercase tracking-tighter">Mesh</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Avg Signal</span>
                                        <span className="text-[9px] font-black text-white font-mono">78%</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className={`w-1 h-1.5 rounded-full ${i <= 4 ? 'bg-hud-accent' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between">
                                <span className="text-[6px] font-bold text-white/10 uppercase tracking-widest font-mono">Updated 10s ago</span>
                                <RotateCcw className="w-2.5 h-2.5 text-white/10 group-hover:text-hud-accent transition-colors cursor-pointer" />
                            </div>
                        </div>

                        {/* Bandwidth Module */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-4 group transition-all hover:bg-white/[0.05]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-hud-accent/60" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Bandwidth</span>
                                </div>
                                <span className="text-[7px] font-black text-hud-accent bg-hud-accent/10 px-2 py-0.5 rounded-md border border-hud-accent/20 uppercase tracking-widest opacity-60">Normal</span>
                            </div>

                            <div className="space-y-3.5">
                                <div>
                                    <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Total Usage</span>
                                    <div className="text-lg font-black text-white font-mono mt-0.5">66 <span className="text-[9px] text-white/20 uppercase">% <span className="ml-1 text-[7px] opacity-40 font-sans tracking-normal font-medium">of available</span></span></div>
                                    <div className="h-1 w-full bg-white/5 rounded-full mt-2.5 overflow-hidden">
                                        <div className="h-full bg-hud-accent w-[66%] shadow-[0_0_12px_rgba(94,234,212,0.4)] transition-all duration-1000" />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        { label: 'Telemetry', value: 12, icon: Cpu },
                                        { label: 'Video Streams', value: 54, icon: Video },
                                        { label: 'Control', value: 8, icon: Settings }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between group/line">
                                            <div className="flex items-center gap-2.5">
                                                <item.icon className="w-2.5 h-2.5 text-hud-accent/40" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-white/60 tracking-wider uppercase leading-none">{item.label}</span>
                                                    <div className="h-0.5 w-12 bg-white/5 rounded-full mt-1 overflow-hidden">
                                                        <div className={`h-full bg-hud-accent transition-all duration-1000`} style={{ width: `${item.value}%`, opacity: 0.6 }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-black text-white font-mono">{item.value}%</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 flex items-center justify-center border border-white/20 rounded-full border-dashed group-hover:rotate-45 transition-transform">
                                                <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                                            </div>
                                            <span className="text-[8px] font-black text-white/30 tracking-wider uppercase leading-none">Available</span>
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 font-mono">34%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between">
                                <span className="text-[6px] font-bold text-white/10 uppercase tracking-widest font-mono">Updated 10s ago</span>
                                <RotateCcw className="w-2.5 h-2.5 text-white/10 group-hover:text-hud-accent transition-colors cursor-pointer" />
                            </div>
                        </div>

                        {/* RF Environment Module */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-4 group transition-all hover:bg-white/[0.05]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Radio className="w-3.5 h-3.5 text-hud-accent/60" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">RF Environment</span>
                                </div>
                                <span className="text-[7px] font-black text-hud-accent bg-hud-accent/10 px-2 py-0.5 rounded-md border border-hud-accent/20 uppercase tracking-widest">Clear</span>
                            </div>

                            <div className="space-y-3.5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <span className="text-[7px] font-black text-white/30 uppercase tracking-widest leading-none">Interference</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-hud-accent uppercase leading-none mt-0.5">Low</span>
                                            <div className="w-1 h-1 rounded-full bg-hud-accent shadow-[0_0_8px_rgba(94,234,212,0.6)]" />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-0.5 h-8">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                                            <div
                                                key={i}
                                                className={`w-0.5 rounded-full ${i <= 3 ? 'bg-hud-accent' : 'bg-white/5'}`}
                                                style={{ height: `${20 + (i * 6)}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Channel Noise</span>
                                            <span className="text-[10px] font-black text-white font-mono mt-0.5">-82 <span className="text-[7px] text-white/30 uppercase">dBm</span></span>
                                        </div>
                                        <span className="text-[7px] font-black text-hud-accent bg-hud-accent/10 px-1.5 py-0.5 rounded uppercase border border-hud-accent/20">Good</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-hud-accent/10 transition-colors">
                                    <div className="p-1 rounded bg-hud-accent/5 border border-hud-accent/10">
                                        <Crosshair className="w-3 h-3 text-hud-accent" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Spectrum Status</span>
                                        <span className="text-[10px] font-black text-hud-accent uppercase tracking-widest mt-0.5">Clear</span>
                                        <span className="text-[7px] font-medium text-white/30 uppercase mt-0.5 tracking-tight">No significant activity</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between">
                                <span className="text-[6px] font-bold text-white/10 uppercase tracking-widest font-mono">Updated 10s ago</span>
                                <RotateCcw className="w-2.5 h-2.5 text-white/10 group-hover:text-hud-accent transition-colors cursor-pointer" />
                            </div>
                        </div>
                    </div>


                    {/* Alerts Section */}
                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-3">
                                <BellRing className="w-4 h-4 text-hud-accent/60" />
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Active Alerts</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-hud-danger/10 border border-hud-danger/20">
                                <div className="w-1 h-1 rounded-full bg-hud-danger" />
                                <span className="text-[9px] font-black text-hud-danger uppercase tracking-widest">{alerts.length} Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {alerts.map(alert => {
                                const isHigh = alert.level === 'CRITICAL';
                                const AlertIcon = alert.type === 'WIND WARNING' ? Wind : WifiOff;

                                return (
                                    <button
                                        key={alert.id}
                                        onClick={() => onSelectDrone(alert.droneId)}
                                        className="relative w-full bg-white/[0.02] border border-white/5 rounded-[24px] p-5 group hover:bg-white/[0.04] transition-all duration-300 text-left overflow-hidden shadow-xl"
                                    >
                                        {/* Severity Stripe */}
                                        <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${isHigh ? 'bg-hud-danger shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-hud-warning shadow-[0_0_10px_rgba(251,191,36,0.4)]'}`} />

                                        <div className="flex gap-5">
                                            {/* Diagnostic Icon Area */}
                                            <div className="flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/5 relative ${isHigh ? 'bg-hud-danger/5' : 'bg-hud-warning/5'}`}>
                                                    <AlertIcon className={`w-5 h-5 ${isHigh ? 'text-hud-danger' : 'text-hud-warning'} opacity-80`} />
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5`}>
                                                            <div className={`w-1 h-1 rounded-full ${isHigh ? 'bg-hud-danger' : 'bg-hud-warning'}`} />
                                                            <span className={`text-[7px] font-black uppercase tracking-widest ${isHigh ? 'text-hud-danger' : 'text-hud-warning'}`}>
                                                                {isHigh ? 'High' : 'Medium'}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-[12px] font-black text-white uppercase tracking-wider group-hover:text-hud-accent transition-colors">{alert.type}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-[8px] font-bold text-white/20 uppercase font-mono">{alert.time}</span>
                                                        <MoreHorizontal className="w-3.5 h-3.5 text-white/10 hover:text-white/40 cursor-pointer transition-colors" />
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-white/40 leading-relaxed font-medium line-clamp-2">{alert.desc}</p>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03] mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-hud-accent uppercase tracking-widest font-mono">Source:</span>
                                                        <span className="text-[9px] font-black text-hud-accent uppercase tracking-[0.2em] font-mono">{alert.droneId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 group/btn">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
