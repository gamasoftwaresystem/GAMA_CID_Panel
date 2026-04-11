import { useState, useEffect, useRef } from 'react';
import { Drone } from '../../../types';
import { Clock, Activity, Cpu, Zap, Terminal, FileText, ChevronRight, Binary } from 'lucide-react';

export default function FleetActivity({ drones: _drones }: { drones: Drone[] }) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [scrubberPos, setScrubberPos] = useState<{ x: number, time: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Stable points generation (no random on render)
    const [points] = useState(() => {
        const resolution = 200;
        const data = Array(resolution).fill(0).map((_, i) => {
            const base = 25;
            const jitter = Math.sin(i * 0.5) * 1.5 + (i % 7 === 0 ? 2 : 0);
            return base + jitter;
        });

        const faultLogs = [
            { time: '18:12:45', type: 'CRITICAL' },
            { time: '17:55:01', type: 'WARN' },
            { time: '17:12:45', type: 'WARN' }
        ];

        const timeToIndex = (timeStr: string) => {
            const [h, m] = timeStr.split(':').map(Number);
            return Math.floor(((h * 60 + m) / 1440) * (resolution - 1));
        };

        faultLogs.forEach(log => {
            const idx = timeToIndex(log.time);
            if (log.type === 'CRITICAL') {
                if (idx < resolution) data[idx] = 85;
                if (idx > 0) data[idx - 1] = 12;
                if (idx < resolution - 1) data[idx + 1] = 12;
            } else if (log.type === 'WARN') {
                if (idx < resolution) data[idx] = 55;
                if (idx > 0) data[idx - 1] = 28;
                if (idx < resolution - 1) data[idx + 1] = 28;
            }
        });

        return data;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const faultLogs = [
        { time: '18:12:45', msg: 'UAV-CORRIDOR_VIOLATION: SECTOR 4', code: 'ERR_NAV_09', type: 'CRITICAL', status: 'WAITING' },
        { time: '17:55:01', msg: 'SIGNAL LATENCY EXCEEDED 850MS', code: 'W_SAT_LINK', type: 'WARN', status: 'RESOLVED' },
        { time: '17:30:12', msg: 'SAT-COM HANDSHAKE SUCCESSFUL', code: 'LOG_AUTH_OK', type: 'INFO', status: 'SUCCESS' },
        { time: '17:12:45', msg: 'BATTERY_CELL_TEMP_THRESHOLD: GAMA-02', code: 'ERR_PWR_44', type: 'WARN', status: 'MONITORING' },
        { time: '16:45:30', msg: 'AUTOMATED FLIGHT REPORT GENERATED', code: 'SYS_ARC_202', type: 'INFO', status: 'SUCCESS' }
    ];

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        
        const totalMinutes = percentage * 1440;
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.floor(totalMinutes % 60);
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        setScrubberPos({ x, time: timeStr });
    };

    return (
        <div className="flex-1 flex flex-col gap-4 pr-2 custom-scrollbar overflow-y-auto min-h-0 pb-8 select-none">
            {/* Header Section */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Operational Flow Tracer</h3>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-2 h-2 text-hud-accent" />
                        Tactical 24H Signal Analysis & Diagnostic Registry
                    </p>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                    <Clock className="w-2.5 h-2.5 text-hud-accent/60" />
                    <span className="text-[9px] font-mono font-black text-white/60 tabular-nums">{currentTime}</span>
                </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="grid grid-cols-4 gap-2.5 shrink-0">
                {[
                    { label: 'Flux Intensity', val: '99.4%', icon: Activity, color: 'text-hud-accent' },
                    { label: 'Event Ledger', val: '05 UNITS', icon: Binary, color: 'text-hud-accent' },
                    { label: 'Drift Rate', val: '0.02 MS', icon: Cpu, color: 'text-white/40' },
                    { label: 'Tier Status', val: 'SECURE', icon: Zap, color: 'text-hud-accent' }
                ].map((stat, i) => (
                    <div key={i} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col justify-between h-16 group hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">{stat.label}</span>
                            <stat.icon className={`w-2.5 h-2.5 ${stat.color} opacity-40`} />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-white/80 font-mono leading-none tracking-tighter">{stat.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Waveform Visualization */}
            <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setScrubberPos(null)}
                className="bg-black/30 border border-white/5 rounded-3xl p-5 relative overflow-hidden group cursor-crosshair h-48 flex flex-col justify-between shrink-0"
            >
                {/* Tactical Grid Background */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:25px_25px]" />
                </div>

                <div className="flex items-center justify-between relative z-10 pointer-events-none">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">Signal Baseline (24H)</span>
                        <span className="text-[14px] font-black text-white/60 font-mono tracking-tight">OSCILLO_TRACE_v4</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 opacity-40">
                        <span className="text-[6px] font-black text-white/40 uppercase tracking-widest">Resolution Mode</span>
                        <span className="text-[9px] font-mono text-hud-accent">STATIC_S_200PT</span>
                    </div>
                </div>

                <div className="flex-1 relative mt-1">
                    <svg className="w-full h-full overflow-hidden" preserveAspectRatio="none" viewBox="0 0 1000 120">
                        <defs>
                            <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <path
                            d={`M 0 120 ${points.map((p, i) => `L ${(i / (points.length-1)) * 1000} ${120 - (p / 100) * 120}`).join(' ')} L 1000 120 Z`}
                            fill="url(#fluxGradient)"
                            className="opacity-10"
                        />

                        <path
                            d={`M 0 ${120 - (points[0] / 100) * 120} ${points.map((p, i) => `L ${(i / (points.length-1)) * 1000} ${120 - (p / 100) * 120}`).join(' ')}`}
                            fill="none"
                            stroke="#5EEAD4"
                            strokeWidth="1.5"
                            className="opacity-50 drop-shadow-[0_0_8px_rgba(94,234,212,0.3)]"
                        />

                        {scrubberPos && (
                            <g>
                                <line 
                                    x1={(scrubberPos.x / containerRef.current!.offsetWidth) * 1000} 
                                    y1="0" 
                                    x2={(scrubberPos.x / containerRef.current!.offsetWidth) * 1000} 
                                    y2="120" 
                                    stroke="#5EEAD4" 
                                    strokeWidth="1" 
                                    className="opacity-20" 
                                />
                                <rect 
                                    x={(scrubberPos.x / containerRef.current!.offsetWidth) * 1000 - 22} 
                                    y="5" 
                                    width="44" 
                                    height="10" 
                                    fill="#14b8a6" 
                                    rx="2"
                                />
                                <text 
                                    x={(scrubberPos.x / containerRef.current!.offsetWidth) * 1000} 
                                    y="12.5" 
                                    textAnchor="middle" 
                                    className="text-[8px] font-mono font-black fill-black"
                                >
                                    {scrubberPos.time}
                                </text>
                            </g>
                        )}
                    </svg>

                    <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 translate-y-4 pointer-events-none opacity-10">
                        {['00:00', '12:00', '24:00'].map(label => (
                            <span key={label} className="text-[6px] font-mono font-black text-white">{label}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Diagnostic Logs */}
            <div className="flex-1 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between px-1 shrink-0">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-hud-accent/40" />
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Diagnostic Archive</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 pr-2">
                    {faultLogs.map((log, i) => (
                        <div key={i} className="relative overflow-hidden pl-3 pr-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl group transition-all duration-300 hover:bg-white/[0.04]">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                log.type === 'CRITICAL' ? 'bg-hud-danger' : 
                                log.type === 'WARN' ? 'bg-hud-warning' : 'bg-hud-accent'
                            } opacity-60`} />
                            
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                                        {log.type === 'CRITICAL' ? <Zap className="w-3 h-3 text-hud-danger/40" /> : 
                                         log.type === 'WARN' ? <Activity className="w-3 h-3 text-hud-warning/40" /> :
                                         <FileText className="w-3 h-3 text-white/10" />}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest truncate">{log.msg}</span>
                                            <span className="text-[7px] font-mono text-hud-accent uppercase tracking-tighter px-1 bg-hud-accent/5 rounded border border-hud-accent/10">
                                                {log.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-[7px] font-mono text-white/20">
                                            <span className="font-black uppercase tracking-tighter">[{log.time}]</span>
                                            <span className="w-0.5 h-0.5 bg-white/5 rounded-full" />
                                            <span className="font-black uppercase tracking-widest">STATUS: {log.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`px-2 py-0.5 rounded border text-[7px] font-black uppercase tracking-tighter shrink-0
                                    ${log.status === 'SUCCESS' ? 'bg-hud-accent/10 border-hud-accent/20 text-hud-accent/60' : 
                                      log.status === 'WAITING' ? 'bg-hud-danger/10 border-hud-danger/20 text-hud-danger/60' :
                                      'bg-white/5 border-white/10 text-white/20'}`}>
                                    {log.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registry Footer */}
            <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between text-[7px] font-black text-white/10 uppercase tracking-[0.2em] px-1 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 opacity-50"><Binary className="w-2.5 h-2.5" /> REV. 4.2.0</span>
                    <div className="w-0.5 h-0.5 bg-white/5 rounded-full" />
                    <span className="opacity-50">STABLE</span>
                </div>
                <button className="text-hud-accent/30 hover:text-white transition-all flex items-center gap-2 group/btn">
                    REPORT <ChevronRight className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}
