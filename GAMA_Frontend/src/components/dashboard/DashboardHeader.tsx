import { Thermometer, Cloud, Wind, Maximize, LogOut } from 'lucide-react';
import React, { useState } from 'react';

interface DashboardHeaderProps {
    weatherData: { temp: string; condition: string; wind: string } | null;
    onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ weatherData, onLogout }) => {
    const [isAppFullscreen, setIsAppFullscreen] = useState(false);

    const toggleAppFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsAppFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsAppFullscreen(false);
            }
        }
    };

    return (
        <header className="flex items-start justify-between w-full pointer-events-none">
            {/* Top Left Widgets */}
            <div className="flex space-x-3 pointer-events-auto">
                <button
                    onClick={toggleAppFullscreen}
                    className={`glass-pill w-12 h-12 flex items-center justify-center transition-all ${isAppFullscreen ? 'text-white bg-white/20' : 'text-hud-accent hover:bg-white/5'}`}
                >
                    <Maximize className="w-5 h-5" />
                </button>
                <div className="glass-pill px-5 h-12 flex items-center space-x-4 text-xs font-semibold text-hud-text-muted">
                    <span className="text-white">IST-HUB</span>
                    <span className="text-hud-border">/</span>
                    <span>41.0082° N, 28.9784° E</span>
                </div>
            </div>

            {/* Top Right Widgets */}
            <div className="flex space-x-3 pointer-events-auto items-center">
                <div className="glass-pill px-6 h-12 flex items-center space-x-5 text-xs font-medium text-hud-text-muted">
                    {weatherData ? (
                        <>
                            <div className="flex items-center space-x-1.5"><Thermometer className="w-3.5 h-3.5" /> <span>{weatherData.temp}°C</span></div>
                            <div className="flex items-center space-x-1.5"><Cloud className="w-3.5 h-3.5 text-white" /> <span className="text-white">{weatherData.condition}</span></div>
                            <div className="flex items-center space-x-1.5"><Wind className="w-3.5 h-3.5" /> <span>{weatherData.wind} km/h</span></div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-2 text-hud-text-muted/50 w-40 justify-center">
                            <span className="w-1.5 h-1.5 rounded-full animate-ping bg-hud-text-muted"></span>
                            <span className="text-[10px] uppercase tracking-widest">SAT-LINK...</span>
                        </div>
                    )}
                </div>

                {onLogout && (
                    <button 
                        onClick={onLogout}
                        className="glass-pill w-12 h-12 flex items-center justify-center text-hud-danger/60 hover:text-hud-danger hover:bg-hud-danger/10 transition-all border border-transparent hover:border-hud-danger/20"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>
        </header>
    );
};
