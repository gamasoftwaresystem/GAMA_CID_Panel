import React from 'react';
import { StopCircle, RefreshCcw, PlaneTakeoff, Home } from 'lucide-react';
import TechnicalHub from '../TechnicalHub/TechnicalHub';
import { Drone } from '../../types';

interface TacticalHubPanelProps {
    isOpen: boolean;
    selectedDrone: Drone | undefined;
    drones: Drone[];
    activeCommand: string | null;
    handleCommandClick: (cmd: string) => void;
}

export const TacticalHubPanel: React.FC<TacticalHubPanelProps> = ({
    isOpen,
    selectedDrone,
    drones,
    activeCommand,
    handleCommandClick
}) => {
    if (!isOpen) return null;

    return (
        <div className="glass-panel w-[850px] h-[450px] p-4 rounded-3xl hud-panel-enter shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-auto border-t border-white/10">
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-hud-accent animate-pulse shadow-[0_0_8px_rgba(94,234,212,0.6)]"></div>
                        <h2 className="text-[13px] font-black text-white tracking-[0.1em] uppercase">
                            {selectedDrone ? `General Information: ${selectedDrone.drone_id}` : 'General Information: Fleet Info'}
                        </h2>
                    </div>
                </div>

                <div className="flex-1 flex gap-8 min-h-0">
                    {/* Left: Command Layer (Only if no drone is selected) */}
                    {!selectedDrone && (
                        <div className="flex flex-col w-48 space-y-2">
                            <span className="text-[10px] font-black text-hud-text-muted uppercase tracking-[0.2em] pl-1">Command Layer</span>
                            <div className="grid grid-cols-2 gap-2 flex-1">
                                {[
                                    { icon: StopCircle, label: 'HALT', color: 'text-hud-danger', bg: 'hover:bg-hud-danger/10' },
                                    { icon: RefreshCcw, label: 'RE-NAV', color: 'text-hud-warning', bg: 'hover:bg-hud-warning/10' },
                                    { icon: PlaneTakeoff, label: 'LIFTOFF', color: 'text-hud-accent', bg: 'hover:bg-hud-accent/10' },
                                    { icon: Home, label: 'BASE', color: 'text-white', bg: 'hover:bg-white/10' }
                                ].map(cmd => (
                                    <button
                                        key={cmd.label}
                                        onClick={() => handleCommandClick(cmd.label)}
                                        className={`border rounded-xl p-2 flex flex-col items-center justify-center transition-all group ${activeCommand === cmd.label ? 'bg-white/10 border-white/30 scale-95 shadow-inner' : `bg-black/40 border-white/5 ${cmd.bg}`}`}>
                                        <cmd.icon className={`w-4 h-4 mb-1 transition-colors ${activeCommand === cmd.label ? 'text-white' : cmd.color}`} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/70 group-hover:text-white">{cmd.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Right / Full: Technical Hub Component */}
                    <TechnicalHub selectedDrone={selectedDrone} drones={drones} />
                </div>
            </div>
        </div>
    );
};
