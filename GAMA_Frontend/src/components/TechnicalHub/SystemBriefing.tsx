import { Drone } from '../../types';

interface SystemBriefingProps {
    drones: Drone[];
}

const CircularGauge = ({ value, label }: { value: number; label: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const getColor = (v: number) => {
        if (v >= 85) return '#10b981'; // Green
        if (v >= 50) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(value);

    return (
        <div className="flex flex-col items-center justify-center p-2 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.04] transition-all">
            <div className="relative w-16 h-16 mb-1.5">
                {/* Background Circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                    <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-white/[0.03]"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out opacity-70 group-hover:opacity-90"
                        style={{ filter: `drop-shadow(0 0 4px ${color}33)` }}
                    />
                </svg>
                {/* Value Text */}
                <div className="absolute inset-0 flex items-baseline justify-center gap-0.5 mt-6.5">
                    <span className="text-xs font-black text-white/80 font-mono tracking-tighter">{value}</span>
                    <span className="text-[6px] font-bold text-white/20">%</span>
                </div>
            </div>
            <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">
                {label}
            </span>
        </div>
    );
};

export default function SystemBriefing({ drones }: SystemBriefingProps) {
    const flightStatus = {
        inService: drones.filter(d => d.status.mission_state === 'IN_SERVICE').length,
        pending: drones.filter(d => d.status.mission_state === 'PENDING').length,
        returning: drones.filter(d => d.status.mission_state === 'RETURNING').length,
        outOfService: drones.filter(d => d.status.mission_state === 'OUT_OF_SERVICE').length,
        offline: drones.filter(d => d.status.mission_state === 'OFFLINE').length
    };

    const total = drones.length;

    const statusItems = [
        { label: 'In Service', count: flightStatus.inService, color: '#10b981' },
        { label: 'Pending', count: flightStatus.pending, color: '#3b82f6' },
        { label: 'Returning', count: flightStatus.returning, color: '#f59e0b' },
        { label: 'Out of Service', count: flightStatus.outOfService, color: '#ef4444' },
        { label: 'Offline', count: flightStatus.offline, color: '#64748b' }
    ];

    // Calculate segments for donut chart
    let cumulativePercent = 0;
    const segments = statusItems.map(item => {
        const percent = total > 0 ? (item.count / total) * 100 : 0;
        const start = cumulativePercent;
        cumulativePercent += percent;
        return { ...item, start, percent };
    }).filter(s => s.percent > 0);

    const donutRadius = 50;
    const donutCircumference = 2 * Math.PI * donutRadius;

    const healthMetrics = [
        { label: 'Stability', value: 96 },
        { label: 'Connectivity', value: 89 },
        { label: 'Fail-Safe', value: 100 },
        { label: 'Energy', value: 92 }
    ];

    const isSystemCritical = healthMetrics.some(m => m.value < 50);

    return (
        <div className="flex-1 flex flex-col gap-4">
            {/* System Alert Banner */}
            {isSystemCritical && (
                <div className="animate-pulse bg-hud-danger/20 border border-hud-danger/50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-hud-danger shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] font-black text-hud-danger uppercase tracking-[0.2em]">
                        System Critical Alert: Low Mission Integrity
                    </span>
                </div>
            )}

            {/* System Health Section */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-[0.2em]">System Health</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${isSystemCritical ? 'text-hud-danger' : 'text-hud-accent/40'}`}>
                        {isSystemCritical ? 'Warning' : 'Nominal'}
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {healthMetrics.map(m => (
                        <CircularGauge key={m.label} label={m.label} value={m.value} />
                    ))}
                </div>
            </div>

            {/* Flight Status Section */}
            <div className="flex flex-col space-y-2 flex-1 min-h-0">
                <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-[0.2em] pl-1">Flight Status</span>
                <div className="flex-1 bg-black/30 border border-white/5 rounded-3xl p-4 flex items-center justify-around gap-8 group/status overflow-hidden">
                    {/* Donut Chart Component */}
                    <div className="relative w-32 h-32 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            {/* Background Circle */}
                            <circle
                                cx="60"
                                cy="60"
                                r={donutRadius}
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-white/[0.03]"
                            />
                            {/* Multi-segment Donut */}
                            {segments.map((seg, i) => (
                                <circle
                                    key={i}
                                    cx="60"
                                    cy="60"
                                    r={donutRadius}
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth="8"
                                    strokeDasharray={donutCircumference}
                                    strokeDashoffset={donutCircumference - (seg.percent / 100) * donutCircumference}
                                    style={{ 
                                        transform: `rotate(${(seg.start / 100) * 360}deg)`,
                                        transformOrigin: '50% 50%',
                                        filter: `drop-shadow(0 0 4px ${seg.color})`
                                    }}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-in-out opacity-80"
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white/80 font-mono leading-none">{total}</span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mt-0.5">Total</span>
                        </div>
                    </div>

                    {/* Breakdown List */}
                    <div className="flex flex-col justify-center space-y-2.5 min-w-[140px]">
                        {statusItems.map((item) => (
                            <div key={item.label} className="flex justify-between items-center group transition-all hover:translate-x-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-sm rotate-45 shadow-[0_0_4px_currentColor] opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color, color: item.color }} />
                                    <span className="text-[9px] font-black text-white/50 group-hover:text-white/90 transition-colors uppercase tracking-widest">{item.label}</span>
                                </div>
                                <span className="text-[11px] font-mono font-black text-white/90 group-hover:text-hud-accent transition-colors">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
