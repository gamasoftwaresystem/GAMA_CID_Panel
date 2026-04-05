import { useState } from 'react';
import { Drone } from '../../types';
import HubHeader from './HubHeader';
import HubInstruments from './HubInstruments';
import HubLogs from './HubLogs';
import HubFooter from './HubFooter';
import SystemBriefing from './SystemBriefing';

interface TechnicalHubProps {
    selectedDrone: Drone | null | undefined;
    drones: Drone[];
}

export default function TechnicalHub({ selectedDrone, drones }: TechnicalHubProps) {
    const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'LOGS'>('TELEMETRY');

    return (
        <div className="flex-1 flex flex-col relative h-full min-h-0 overflow-hidden">
            {selectedDrone ? (
                <div className="flex-1 flex flex-col relative">
                    {/* Background Aesthetics: Grid & Subtle Gradient */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,234,212,0.02),transparent_70%)] pointer-events-none" />
                    
                    {/* Decorative HUD Markers */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-white/20" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-white/20" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-white/20" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-px bg-white/20" />
                    </div>
                    
                    <HubHeader drone={selectedDrone} activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <div className="flex-1 flex flex-col min-h-0 px-2 pt-2 pb-1">
                        {activeTab === 'TELEMETRY' ? (
                            <HubInstruments drone={selectedDrone} />
                        ) : (
                            <HubLogs drone={selectedDrone} />
                        )}
                    </div>
                    
                    <HubFooter drone={selectedDrone} />
                </div>
            ) : (
                <SystemBriefing drones={drones} />
            )}
        </div>
    );
}
