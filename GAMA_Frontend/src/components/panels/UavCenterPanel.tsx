import { Layers } from 'lucide-react';
import DroneCard from '../DroneCard';
import { Drone } from '../../types';

interface UavCenterPanelProps {
    isOpen: boolean;
    drones: Drone[];
    selectedDroneId: string | null;
    handleDroneSelect: (id: string | null) => void;
    setIsControlCenterOpen: (val: boolean) => void;
    expandedCardId: string | null;
    setExpandedCardId: (id: string | null) => void;
}

export const UavCenterPanel: React.FC<UavCenterPanelProps> = ({
    isOpen,
    drones,
    selectedDroneId,
    handleDroneSelect,
    setIsControlCenterOpen,
    expandedCardId,
    setExpandedCardId
}) => {
    if (!isOpen) return null;

    return (
        <div className="glass-panel w-[520px] h-[450px] p-6 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <Layers className="w-4 h-4 text-hud-accent animate-pulse " />
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">
                            UAV Hub
                        </h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 px-1 pb-4">
                    {drones.map(drone => (
                        <DroneCard
                            key={drone.drone_id}
                            drone={drone}
                            selected={selectedDroneId === drone.drone_id}
                            isExpanded={expandedCardId === drone.drone_id}
                            onToggleExpand={() => setExpandedCardId(expandedCardId === drone.drone_id ? null : drone.drone_id)}
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
