import React from 'react';
import { Settings2, ShieldAlert, MapPin, Users } from 'lucide-react';

interface MapSettingsProps {
    isOpen: boolean;
    showNoFlyZones: boolean;
    setShowNoFlyZones: (val: boolean) => void;
    showBaseZones: boolean;
    setShowBaseZones: (val: boolean) => void;
    showHumanDensity: boolean;
    setShowHumanDensity: (val: boolean) => void;
}

export const MapSettings: React.FC<MapSettingsProps> = ({
    isOpen,
    showNoFlyZones,
    setShowNoFlyZones,
    showBaseZones,
    setShowBaseZones,
    showHumanDensity,
    setShowHumanDensity
}) => {
    return (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-80 opacity-100 ml-4' : 'w-0 opacity-0 ml-0 hover:pointer-events-none'}`}>
            <div className="glass-panel w-80 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden pointer-events-auto">
                {/* HUD Background Aesthetics */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <Settings2 className="w-4 h-4 text-hud-accent animate-pulse" />
                        <div className="flex flex-col">
                            <h2 className="text-[12px] font-black text-white tracking-[0.2em] uppercase leading-none">Harita Ayarları</h2>
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">MAP_OVERLAY_CONFIG_v4.2</span>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="space-y-3 relative z-10">
                    {/* No-Fly Zones */}
                    <div
                        onClick={() => setShowNoFlyZones(!showNoFlyZones)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group
                            ${showNoFlyZones ? 'bg-hud-danger/20 border-hud-danger/40' : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border transition-all ${showNoFlyZones ? 'bg-hud-danger/20 border-hud-danger/40 text-hud-danger' : 'bg-black/40 border-white/5 text-white/20 group-hover:text-white/40'}`}>
                                    <ShieldAlert className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white group-hover:text-hud-accent transition-colors uppercase tracking-widest">Yasaklı Bölgeler</span>
                                    <span className={`text-[7px] font-mono font-bold uppercase mt-0.5 ${showNoFlyZones ? 'text-hud-danger/60' : 'text-white/20'}`}>
                                        STAT: {showNoFlyZones ? 'RESTRICTED' : 'INACTIVE'}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-500 relative ${showNoFlyZones ? 'bg-hud-danger' : 'bg-white/10'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${showNoFlyZones ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>

                    {/* Base Zones */}
                    <div
                        onClick={() => setShowBaseZones(!showBaseZones)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group
                            ${showBaseZones ? 'bg-hud-accent/20 border-hud-accent/40' : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border transition-all ${showBaseZones ? 'bg-hud-accent/20 border-hud-accent/40 text-hud-accent' : 'bg-black/40 border-white/5 text-white/20 group-hover:text-white/40'}`}>
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white group-hover:text-hud-accent transition-colors uppercase tracking-widest">Base Bölgeleri</span>
                                    <span className={`text-[7px] font-mono font-bold uppercase mt-0.5 ${showBaseZones ? 'text-hud-accent/60' : 'text-white/20'}`}>
                                        STAT: {showBaseZones ? 'OPERATIONAL' : 'OFFLINE'}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-500 relative ${showBaseZones ? 'bg-hud-accent' : 'bg-white/10'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${showBaseZones ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>

                    {/* Human Density */}
                    <div
                        onClick={() => setShowHumanDensity(!showHumanDensity)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group
                            ${showHumanDensity ? 'bg-hud-accent/20 border-hud-accent/40 shadow-[0_0_20px_rgba(94,234,212,0.1)]' : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border transition-all ${showHumanDensity ? 'bg-hud-accent/20 border-hud-accent/40 text-hud-accent' : 'bg-black/40 border-white/5 text-white/20 group-hover:text-white/40'}`}>
                                    <Users className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white group-hover:text-hud-accent transition-colors uppercase tracking-widest">İnsan Yoğunluğu</span>
                                    <span className={`text-[7px] font-mono font-bold uppercase mt-0.5 ${showHumanDensity ? 'text-hud-accent/60' : 'text-white/20'}`}>
                                        STAT: {showHumanDensity ? 'ACTIVE_SCAN' : 'STANDBY'}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-500 relative ${showHumanDensity ? 'bg-hud-accent' : 'bg-white/10'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${showHumanDensity ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                    <span className="text-[7px] font-mono font-bold text-white/10 uppercase italic">Layer Sync: Secured</span>
                    <div className="flex items-center gap-1.5 grayscale opacity-20">
                        <div className="w-1 h-1 rounded-full bg-hud-accent" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
};
