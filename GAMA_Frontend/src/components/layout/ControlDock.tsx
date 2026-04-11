import React from 'react';
import { Layers, Radio, Globe } from 'lucide-react';

interface ControlDockProps {
    isUavCenterOpen: boolean;
    setIsUavCenterOpen: (val: boolean) => void;
    isControlCenterOpen: boolean;
    setIsControlCenterOpen: (val: boolean) => void;
    isNetworkStatusOpen: boolean;
    setIsNetworkStatusOpen: (val: boolean) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
    isUavCenterOpen,
    setIsUavCenterOpen,
    isControlCenterOpen,
    setIsControlCenterOpen,
    isNetworkStatusOpen,
    setIsNetworkStatusOpen
}) => {
    return (
        <div className="mac-dock">
            <div
                className={`mac-dock-item group ${isUavCenterOpen ? 'active' : ''}`}
                onClick={() => {
                    const nextState = !isUavCenterOpen;
                    setIsUavCenterOpen(nextState);
                    if (nextState) setIsNetworkStatusOpen(false);
                }}
            >
                <Layers className="w-5 h-5" />
                <div className="active-dot" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                    UAV Hub
                </div>
            </div>

            <div
                className={`mac-dock-item group ${isControlCenterOpen ? 'active' : ''}`}
                onClick={() => {
                    const nextState = !isControlCenterOpen;
                    setIsControlCenterOpen(nextState);
                    if (nextState) setIsNetworkStatusOpen(false);
                }}
            >
                <Radio className="w-5 h-5" />
                <div className="active-dot" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                    General Information
                </div>
            </div>

            <div
                className={`mac-dock-item group ${isNetworkStatusOpen ? 'active' : ''}`}
                onClick={() => {
                    const nextState = !isNetworkStatusOpen;
                    setIsNetworkStatusOpen(nextState);
                    if (nextState) {
                        setIsUavCenterOpen(false);
                        setIsControlCenterOpen(false);
                    }
                }}
            >
                <Globe className="w-5 h-5" />
                <div className="active-dot" />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                    Network Status
                </div>
            </div>
        </div>
    );
};
