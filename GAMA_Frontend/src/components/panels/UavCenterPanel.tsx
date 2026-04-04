import React from 'react';
import DroneCard from '../DroneCard';
import { Drone } from '../../types';

interface UavCenterPanelProps {
    isOpen: boolean;
    drones: Drone[];
    selectedDroneId: string | null;
    handleDroneSelect: (id: string) => void;
    setIsControlCenterOpen: (val: boolean) => void;
}

export const UavCenterPanel: React.FC<UavCenterPanelProps> = ({
    isOpen,
    drones,
    selectedDroneId,
    handleDroneSelect,
    setIsControlCenterOpen
}) => {
    if (!isOpen) return null;

    return (
        <div className="glass-panel w-[420px] h-[450px] p-5 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-hud-accent animate-pulse shadow-[0_0_8px_rgba(94,234,212,0.6)]"></div>
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">
                            UAV Center
                        </h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 px-1 pb-4">
                    {drones
                        .sort((a, b) => (a.status.mission_state === b.status.mission_state ? 0 : a.status.mission_state === 'PICKUP' ? -1 : 1))
                        .map(drone => (
                            <DroneCard
                                key={drone.drone_id}
                                drone={drone}
                                selected={selectedDroneId === drone.drone_id}
                                onClick={() => handleDroneSelect(drone.drone_id)}
                                onOpenTechnicalHub={(e) => {
                                    e.stopPropagation();
                                    handleDroneSelect(drone.drone_id);
                                    setIsControlCenterOpen(true);
                                }}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};
