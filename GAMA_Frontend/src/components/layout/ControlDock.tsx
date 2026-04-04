import React from 'react';
import { Layers, Radio } from 'lucide-react';

interface ControlDockProps {
    isUavCenterOpen: boolean;
    setIsUavCenterOpen: (val: boolean) => void;
    isControlCenterOpen: boolean;
    setIsControlCenterOpen: (val: boolean) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
    isUavCenterOpen,
    setIsUavCenterOpen,
    isControlCenterOpen,
    setIsControlCenterOpen
}) => {
    return (
        <div className="mac-dock">
            <div
                className={`mac-dock-item group ${isUavCenterOpen ? 'active' : ''}`}
                onClick={() => setIsUavCenterOpen(!isUavCenterOpen)}
            >
                <Layers className="w-5 h-5" />
                <div className="active-dot" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                    UAV Center
                </div>
            </div>

            <div
                className={`mac-dock-item group ${isControlCenterOpen ? 'active' : ''}`}
                onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            >
                <Radio className="w-5 h-5" />
                <div className="active-dot" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                    Tactical Hub
                </div>
            </div>
        </div>
    );
};
