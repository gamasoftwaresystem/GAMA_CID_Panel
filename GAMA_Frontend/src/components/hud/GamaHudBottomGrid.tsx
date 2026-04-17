import { useState } from 'react';
import { Drone } from '../../types';
import DroneMap from '../DroneMap';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface GamaHudBottomGridProps {
    drone: Drone;
    drones: Drone[];
}

export default function GamaHudBottomGrid({ drone, drones }: GamaHudBottomGridProps) {
    const [videoMode, setVideoMode] = useState<'Video' | 'Photo'>('Video');
    const [selectedRes, setSelectedRes] = useState('1280:720');
    const [awbActive, setAwbActive] = useState(false);
    const [dispActive, setDispActive] = useState(true);
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    return (
        <div className={`flex h-full glass-panel border-t border-white/10 rounded-3xl items-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transition-all duration-500 ${isMapExpanded ? 'p-0' : 'p-5 space-x-8'}`}>
            {/* Expanded Map View Overlay */}
            <div className={`absolute inset-0 z-50 transition-all duration-700 ease-in-out bg-black/40 backdrop-blur-sm ${isMapExpanded ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'}`}>
                <div className="w-full h-full relative">
                    <button 
                        onClick={() => setIsMapExpanded(false)}
                        className="absolute top-5 right-5 z-[60] w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-hud-danger hover:border-hud-danger/50 transition-all duration-310 shadow-2xl active:scale-95 group/close"
                        title="Close Tactical Map"
                    >
                        <X className="w-5 h-5 group-hover/close:rotate-90 transition-transform duration-300" />
                    </button>
                    {isMapExpanded && (
                        <div className="w-full h-full animate-in fade-in duration-1000">
                             <DroneMap 
                                drones={drones} 
                                selectedDroneId={drone.drone_id} 
                                onSelectDrone={() => {}} 
                                mapMode="nav" 
                                showNoFlyZones={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 1. Interactive Map Thumbnail - Admin Style */}
            <div className="w-[210px] h-full flex flex-col space-y-3 shrink-0">
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10 shrink-0">
                    <button 
                        onClick={() => setVideoMode('Video')}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase transition-all duration-300 rounded-full ${videoMode === 'Video' ? 'bg-hud-accent text-black shadow-[0_0_12px_rgba(94,234,212,0.4)]' : 'text-white/20 hover:text-white/40'}`}
                    >
                        Video
                    </button>
                    <button 
                         onClick={() => setVideoMode('Photo')}
                         className={`flex-1 py-1.5 text-[9px] font-black uppercase transition-all duration-300 rounded-full ${videoMode === 'Photo' ? 'bg-hud-accent text-black shadow-[0_0_12px_rgba(94,234,212,0.4)]' : 'text-white/20 hover:text-white/40'}`}
                    >
                        Photo
                    </button>
                </div>
                <div 
                    onClick={() => setIsMapExpanded(true)}
                    className="flex-1 rounded-2xl overflow-hidden relative border border-white/5 bg-black cursor-pointer group/map"
                >
                    <div className="absolute inset-0">
                        <DroneMap 
                            drones={drones} 
                            selectedDroneId={drone.drone_id} 
                            onSelectDrone={() => {}} 
                            mapMode="focus" 
                            showNoFlyZones={true}
                        />
                    </div>
                    <div className="absolute inset-0 bg-hud-accent/0 group-hover/map:bg-hud-accent/10 transition-colors pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/map:opacity-100 transition-opacity">
                         <div className="bg-hud-accent/20 backdrop-blur-md p-2.5 rounded-full border border-hud-accent/30 scale-90 group-hover/map:scale-100 transition-transform">
                             <Maximize2 className="w-4 h-4 text-hud-accent" />
                         </div>
                    </div>
                </div>
            </div>

            {/* 2. Primary Stats Grid - Enhanced Layout */}
            <div className="flex flex-1 items-center justify-around px-2">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Ground speed</span>
                        <div className="flex items-baseline space-x-1">
                             <span className="text-[14px] font-black text-white font-mono lowercase tracking-tighter">{drone.navigation.ground_speed.toFixed(0)}</span>
                             <span className="text-[9px] font-bold text-white/40">km/h</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Lens focus</span>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-[14px] font-black text-white font-mono tracking-tighter">24</span>
                            <span className="text-[9px] font-bold text-white/40">mm</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Relative alt</span>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-[14px] font-black text-white font-mono tracking-tighter">{drone.navigation.alt_relative.toFixed(0)}</span>
                            <span className="text-[9px] font-bold text-white/40">m</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Sensor iso</span>
                        <span className="text-[14px] font-black text-hud-accent font-mono tracking-tighter">640</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Flow time</span>
                        <span className="text-[14px] font-black text-white font-mono tracking-tighter">05:43</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Exposure</span>
                        <span className="text-[14px] font-black text-white font-mono tracking-tighter">1/800</span>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-8 shrink-0" />

                {/* 3. Resolution Selection - Improved Toggles */}
                <div className="flex flex-col space-y-3 w-32 shrink-0">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 pl-1 text-center">Resolution</span>
                    {['1920:1080', '1280:720', '854:480'].map((res, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedRes(res)}
                            className={`group relative py-2 rounded-xl border transition-all duration-300 ${selectedRes === res 
                                ? 'bg-hud-accent/10 border-hud-accent/30 text-hud-accent' 
                                : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="text-[10px] font-black tracking-[0.1em]">{res}</span>
                            {selectedRes === res && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-hud-accent rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-4 shrink-0" />

            {/* 4. Menu Navigation D-Pad - Enhanced Interactivity */}
            <div className="flex flex-col items-center space-y-5 w-[180px] shrink-0">
                <div className="flex space-x-3">
                    <button 
                        onClick={() => setAwbActive(!awbActive)}
                        className={`px-4 py-1.5 text-[9px] font-black tracking-[0.15em] transition-all rounded-full border uppercase active:scale-95 ${awbActive ? 'bg-hud-accent text-black border-black/20 shadow-[0_0_12px_rgba(94,234,212,0.4)]' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'}`}
                    >
                        AWB
                    </button>
                    <button 
                        onClick={() => setDispActive(!dispActive)}
                        className={`px-4 py-1.5 text-[9px] font-black tracking-[0.15em] transition-all rounded-full border uppercase active:scale-95 ${dispActive ? 'bg-hud-accent text-black border-black/20 shadow-[0_0_12px_rgba(94,234,212,0.4)]' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'}`}
                    >
                        DISP
                    </button>
                </div>
                
                <div className="w-24 h-24 rounded-full border border-white/10 bg-black/40 relative flex items-center justify-center shadow-inner group">
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                    
                    {/* Grid Lines */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-white/5 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-white/5 pointer-events-none" />
                    
                    {/* Central Status Node */}
                    <div className="flex flex-col items-center space-y-1 z-10 transition-all group-hover:scale-110">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Menu</span>
                        <div className="w-2.5 h-2.5 bg-hud-accent rounded-full shadow-[0_0_15px_rgba(94,234,212,0.8)] animate-pulse relative">
                            <div className="absolute inset-0 rounded-full animate-ping bg-hud-accent/50" />
                        </div>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Mode</span>
                    </div>

                    {/* D-Pad Arrows with Visual Feedback */}
                    {[
                        { icon: ChevronUp, pos: "top-1.5 left-1/2 -translate-x-1/2", dir: "UP" },
                        { icon: ChevronDown, pos: "bottom-1.5 left-1/2 -translate-x-1/2", dir: "DOWN" },
                        { icon: ChevronLeft, pos: "left-1.5 top-1/2 -translate-y-1/2", dir: "LEFT" },
                        { icon: ChevronRight, pos: "right-1.5 top-1/2 -translate-y-1/2", dir: "RIGHT" }
                    ].map((btn, idx) => (
                        <button 
                            key={idx}
                            className={`absolute ${btn.pos} w-8 h-8 flex items-center justify-center text-white/20 hover:text-hud-accent transition-all hover:scale-125 active:scale-90 rounded-full hover:bg-hud-accent/5`}
                        >
                            <btn.icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
