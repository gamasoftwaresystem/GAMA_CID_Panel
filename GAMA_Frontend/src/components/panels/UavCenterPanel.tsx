import { useState } from 'react';
import { Layers, X, Search } from 'lucide-react';
import DroneCard from '../DroneCard';
import { Drone } from '../../types';

interface UavCenterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    drones: Drone[];
    selectedDroneId: string | null;
    handleDroneSelect: (id: string | null) => void;
    setIsControlCenterOpen: (val: boolean) => void;
    expandedCardId: string | null;
    setExpandedCardId: (id: string | null) => void;
}

export const UavCenterPanel: React.FC<UavCenterPanelProps> = ({
    isOpen,
    onClose,
    drones,
    selectedDroneId,
    handleDroneSelect,
    setIsControlCenterOpen,
    expandedCardId,
    setExpandedCardId
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredDrones = drones.filter(drone => {
        const idMatch = drone.drone_id.toLowerCase().includes(searchQuery.toLowerCase());
        const missionMatch = (drone.status.mission_state || '').toLowerCase().includes(searchQuery.toLowerCase());
        const modeMatch = (drone.status.mode || '').toLowerCase().includes(searchQuery.toLowerCase());
        return idMatch || missionMatch || modeMatch;
    });

    return (
        <div className="glass-panel w-[520px] h-[450px] p-6 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Layers className="w-4 h-4 text-hud-accent animate-pulse " />
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">
                            UAV Hub
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all group"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4 flex justify-end">
                    <div className="relative w-36 group" onClick={(e) => e.stopPropagation()}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 group-focus-within:text-hud-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-hud-accent/50 focus:bg-white/[0.08] transition-all tracking-widest uppercase"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 px-1 pb-4">
                    {filteredDrones.map(drone => (
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
                    {filteredDrones.length === 0 && (
                        <div className="text-center py-10">
                            <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">No UAVs Found</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
