import { Wifi, Activity } from 'lucide-react';
import { Drone } from '../../types';

interface HubFooterProps {
    drone: Drone;
}

export default function HubFooter({ drone }: HubFooterProps) {
    const batteryPct = drone.status.battery_pct;

    const getAccentColor = () => {
        if (batteryPct > 70) return '#5EEAD4';
        if (batteryPct > 20) return '#fbbf24';
        return '#ef4444';
    };

    return (
        <div className="mt-5 pt-5 border-t border-white/5 flex justify-between items-center z-10">
            <div className="flex space-x-12">
                {/* Connection Status */}
                <div className="flex flex-col group">
                    <div className="flex items-center space-x-2 mb-1 transition-all">
                        <Wifi className="w-3.5 h-3.5" style={{ color: getAccentColor() }} />
                        <span className="text-[9px] font-black text-white/90 tracking-widest leading-none uppercase">C2 Link Active</span>
                    </div>
                    <span className="text-[7px] font-black text-white/20 uppercase pl-5.5 tracking-tighter">Secure Mesh | {drone.status.signal_dbm} dBm</span>
                </div>

                {/* GNSS Status */}
                <div className="flex flex-col group">
                    <div className="flex items-center space-x-2 mb-1 transition-all">
                        <Activity className="w-3.5 h-3.5 opacity-60" style={{ color: getAccentColor() }} />
                        <span className="text-[9px] font-black text-white/90 tracking-widest leading-none uppercase">12 GNSS Lock</span>
                    </div>
                    <span className="text-[7px] font-black text-white/20 uppercase pl-5.5 tracking-tighter">HDOP 1.18 | VDOP 0.92</span>
                </div>
            </div>

            {/* Inline Delivery Progress - Vertical Space-Efficient */}
            <div className="flex items-center space-x-4 group min-w-[320px] bg-white/[0.03] px-4 py-2 rounded-xl border border-white/[0.05]">
                <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase shrink-0">Delivery</span>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                    <div 
                        className="absolute inset-y-0 left-0 bg-hud-accent shadow-[0_0_12px_rgba(94,234,212,0.6)] transition-all duration-700 rounded-full"
                        style={{ width: `${(drone.fleet_mission?.progress || 0) * 100}%` }}
                    />
                </div>
                <span className="text-[10px] font-black text-hud-accent tracking-widest tabular-nums font-mono shrink-0">
                    {( (drone.fleet_mission?.progress || 0) * 100 ).toFixed(0)}%
                </span>
            </div>
        </div>
    );
}
