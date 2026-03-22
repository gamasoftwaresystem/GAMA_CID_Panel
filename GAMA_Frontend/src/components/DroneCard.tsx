import React from 'react';
import { Battery, Wifi, Maximize2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Drone } from '../types';

interface DroneCardProps {
    drone: Drone;
    onClick: () => void;
    onOpenDetails: (e: React.MouseEvent) => void;
    selected?: boolean;
}

export default function DroneCard({ drone, onClick, onOpenDetails, selected }: DroneCardProps) {
    const isWarning = drone.status.health !== 'GOOD' || drone.status.battery_pct < 20;

    const getProgressText = () => {
        if (drone.status.mission_state === 'PICKUP') return 'Is Taking Delivery';
        if (drone.status.mission_state === 'DELIVERING') return 'Out for Delivery';
        if (drone.status.mission_state === 'RETURNING') {
            if (drone.status.health === 'CRITICAL') return 'Damaged';
            if (drone.status.health === 'WARNING') return 'Adverse Cond.';
            if (drone.status.battery_pct <= 20) return 'Low Battery';
            return 'Pending Base';
        }
        return 'Pending';
    };

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer transition-all duration-300 p-4 rounded-3xl border
        ${selected
                    ? 'bg-white/15 border-white/20 shadow-lg'
                    : 'bg-black/30 border-transparent hover:bg-black/40 hover:border-hud-border'
                }
      `}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2">
                        <span>{drone.drone_id}</span>
                        {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-hud-warning animate-pulse" />}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1.5">
                        {/* Dynamic Mission Color Indicator */}
                        <span className="w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor:
                                    drone.status.mission_state === 'PICKUP' ? '#9ACEEB' :
                                        drone.status.mission_state === 'DELIVERING' ? '#fbbf24' :
                                            drone.status.mission_state === 'RETURNING' ? '#ff0000' : '#cbd5e1'
                            }}>
                        </span>
                        <p className="text-[10px] text-hud-text-muted capitalize">
                            {drone.status.mission_state === 'PICKUP' ? 'Pending' :
                                drone.status.mission_state === 'DELIVERING' ? 'In Service' :
                                    drone.status.mission_state === 'RETURNING' ? 'Out of Service' :
                                        drone.status.mode?.toLowerCase() || 'Unknown'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-hud-text-muted hover:text-white">
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onOpenDetails}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 text-hud-text-muted hover:text-white"
                        title="Open Control Panel"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Dynamic Mission Progress Bar */}
            <div className="mt-4 px-1">
                <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center space-x-2">
                        <Wifi className={`w-3 h-3 ${drone.status.signal_dbm < -80 ? 'text-hud-warning' : 'text-hud-text-muted'}`} />
                        <span className="text-[9px] text-hud-text-muted font-mono">{drone.status.signal_dbm}dBm</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest truncate max-w-[90px]">
                            {getProgressText()}
                        </span>
                        <span className="text-[9px] text-hud-accent font-black font-mono">
                            {((drone.fleet_mission?.progress || 0) * 100).toFixed(0)}%
                        </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-mono font-bold ${drone.status.battery_pct < 20 ? 'text-hud-danger' : 'text-hud-text-muted'}`}>
                            {drone.status.battery_pct.toFixed(1)}%
                        </span>
                        <Battery className={`w-3 h-3 ${drone.status.battery_pct < 20 ? 'text-hud-danger' : 'text-hud-text-muted'}`} />
                    </div>
                </div>

                {/* Progress Track */}
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div
                        className="h-full transition-all duration-1000 ease-linear rounded-full shadow-[0_0_8px_currentColor]"
                        style={{
                            width: `${(drone.fleet_mission?.progress || 0) * 100}%`,
                            backgroundColor:
                                drone.status.mission_state === 'PICKUP' ? '#9ACEEB' :
                                    drone.status.mission_state === 'DELIVERING' ? '#fbbf24' : '#ff0000',
                            color:
                                drone.status.mission_state === 'PICKUP' ? '#9ACEEB' :
                                    drone.status.mission_state === 'DELIVERING' ? '#fbbf24' : '#ff0000'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
