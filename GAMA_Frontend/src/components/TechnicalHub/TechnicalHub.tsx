import { useState } from 'react';
import { Drone } from '../../types';
import { LayoutDashboard, Users, Map, Shield, Activity as ActivityIcon } from 'lucide-react';
import HubHeader from './HubHeader';
import HubInstruments from './HubInstruments';
import HubLogs from './HubLogs';
import HubFooter from './HubFooter';
import SystemBriefing from './SystemBriefing';
import FleetPilots from './FleetViews/FleetPilots';
import FleetBases from './FleetViews/FleetBases';
import FleetAssets from './FleetViews/FleetAssets';
import FleetActivity from './FleetViews/FleetActivity';

interface TechnicalHubProps {
    selectedDrone: Drone | null | undefined;
    drones: Drone[];
}

type FleetTab = 'OVERVIEW' | 'PILOTS' | 'BASES' | 'ASSETS' | 'ACTIVITY';

export default function TechnicalHub({ selectedDrone, drones }: TechnicalHubProps) {
    const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'LOGS'>('TELEMETRY');
    const [fleetTab, setFleetTab] = useState<FleetTab>('OVERVIEW');

    const renderFleetContent = () => {
        switch (fleetTab) {
            case 'PILOTS': return <FleetPilots drones={drones} />;
            case 'BASES': return <FleetBases drones={drones} />;
            case 'ASSETS': return <FleetAssets drones={drones} />;
            case 'ACTIVITY': return <FleetActivity drones={drones} />;
            default: return <SystemBriefing drones={drones} />;
        }
    };

    return (
        <div className="flex-1 flex flex-col relative h-full min-h-0 overflow-hidden">
            {selectedDrone ? (
                <div className="flex-1 flex flex-col relative">
                    {/* Background Aesthetics */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,234,212,0.02),transparent_70%)] pointer-events-none" />

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
                <div className="flex-1 flex h-full min-h-0">
                    {/* FMIS Side Navigation */}
                    <div className="w-44 flex flex-col border-r border-white/5 pr-4 space-y-1 py-1 shrink-0">
                        <span className="text-[7.5px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-2">Fleet Management</span>
                        {[
                            { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
                            { id: 'PILOTS', label: 'Pilot Profiles', icon: Users },
                            { id: 'BASES', label: 'Hub Centers', icon: Map },
                            { id: 'ASSETS', label: 'Drones Id', icon: Shield },
                            { id: 'ACTIVITY', label: 'Live Flow', icon: ActivityIcon }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFleetTab(tab.id as FleetTab)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-300 group
                                    ${fleetTab === tab.id
                                        ? 'bg-hud-accent/10 border-hud-accent/30 text-hud-accent shadow-[0_0_15px_rgba(94,234,212,0.1)]'
                                        : 'bg-transparent border-transparent text-white/30 hover:bg-white/5 hover:text-white/60'}`}
                            >
                                <tab.icon className={`w-3.5 h-3.5 transition-colors ${fleetTab === tab.id ? 'text-hud-accent' : 'text-white/20 group-hover:text-white/40'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest truncate">{tab.label}</span>
                            </button>
                        ))}

                        <div className="flex-1" />


                    </div>

                    {/* FMIS Content Area */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pl-4">
                        {renderFleetContent()}
                    </div>
                </div>
            )}
        </div>
    );
}
