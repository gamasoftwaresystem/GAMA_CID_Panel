import React from 'react';
import TechnicalHub from '../TechnicalHub/TechnicalHub';
import { Drone } from '../../types';
import { Radio, X } from 'lucide-react';

interface TacticalHubPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDrone: Drone | undefined;
    drones: Drone[];
    activeCommand: string | null;
    handleCommandClick: (cmd: string) => void;
}

export const TacticalHubPanel: React.FC<TacticalHubPanelProps> = ({
    isOpen,
    onClose,
    selectedDrone,
    drones
}) => {
    if (!isOpen) return null;

    return (
        <div className="glass-panel w-[850px] h-[450px] p-4 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto border-t border-white/10">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Radio className="w-4 h-4 text-hud-accent animate-pulse " />
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">
                            {selectedDrone ? `General Information: ${selectedDrone.drone_id}` : 'General Information: Fleet Info'}
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

                <div className="flex-1 flex min-h-0 min-w-0">
                    {/* Full Content: Technical Hub Component */}
                    <TechnicalHub selectedDrone={selectedDrone} drones={drones} />
                </div>
            </div>
        </div>
    );
};
