import React from 'react';

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
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-72 opacity-100 ml-4' : 'w-0 opacity-0 ml-0'}`}>
            <div className="glass-panel w-72 p-5 flex flex-col space-y-5 shadow-2xl min-w-72">
                <h2 className="text-sm font-bold text-white tracking-wide border-b border-white/10 pb-3">Harita Ayarları</h2>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowNoFlyZones(!showNoFlyZones)}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">Yasaklı Bölgeler</span>
                    <button className={`w-9 h-5 rounded-full transition-colors relative ${showNoFlyZones ? 'bg-hud-danger' : 'bg-white/10 border border-white/10'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showNoFlyZones ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowBaseZones(!showBaseZones)}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">Base Bölgeleri</span>
                    <button className={`w-9 h-5 rounded-full transition-colors relative ${showBaseZones ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-white/10 border border-white/10'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showBaseZones ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowHumanDensity(!showHumanDensity)}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">İnsan Yoğunluğu</span>
                    <button className={`w-9 h-5 rounded-full transition-colors relative ${showHumanDensity ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'bg-white/10 border border-white/10'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showHumanDensity ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                </div>
            </div>
        </div>
    );
};
