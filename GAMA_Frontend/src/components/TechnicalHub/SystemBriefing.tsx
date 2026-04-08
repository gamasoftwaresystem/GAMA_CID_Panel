import { Drone } from '../../types';

interface SystemBriefingProps {
    drones: Drone[];
}

const CircularGauge = ({ value, label, color = '#5EEAD4' }: { value: number; label: string; color?: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

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
                        strokeWidth="3"
                        className="text-white/[0.03]"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="3"
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
        inFlight: drones.filter(d => d.status.mission_state === 'PICKUP').length,
        standby: drones.filter(d => !d.status.mission_state).length,
        inService: drones.filter(d => d.status.mission_state === 'DELIVERING').length,
        returning: drones.filter(d => d.status.mission_state === 'RETURNING').length,
        offline: 0
    };

    const total = drones.length;

    const statusItems = [
        { label: 'In Flight', count: flightStatus.inFlight, color: 'rgba(94, 234, 212, 0.6)' },
        { label: 'Standby', count: flightStatus.standby, color: 'rgba(59, 130, 246, 0.6)' },
        { label: 'In Service', count: flightStatus.inService, color: 'rgba(251, 191, 36, 0.6)' },
        { label: 'Returning', count: flightStatus.returning, color: 'rgba(168, 85, 247, 0.6)' },
        { label: 'Offline', count: flightStatus.offline, color: 'rgba(156, 163, 175, 0.4)' }
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

    return (
        <div className="flex-1 flex flex-col gap-4">
            {/* System Health Section */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-[0.2em]">System Health</span>
                    <span className="text-[8px] font-bold text-hud-accent/40 uppercase tracking-widest">Nominal</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <CircularGauge label="Stability" value={96} color="rgba(94, 234, 212, 0.6)" />
                    <CircularGauge label="Connectivity" value={89} color="rgba(94, 234, 212, 0.6)" />
                    <CircularGauge label="Fail-Safe" value={100} color="rgba(94, 234, 212, 0.6)" />
                    <CircularGauge label="Energy" value={92} color="rgba(251, 191, 36, 0.6)" />
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
                                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_4px_currentColor] opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color, color: item.color }} />
                                    <span className="text-[9px] font-black text-white/10 group-hover:text-white/40 transition-colors uppercase tracking-widest">{item.label}</span>
                                </div>
                                <span className="text-[11px] font-mono font-black text-white/60 group-hover:text-hud-accent transition-colors">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
