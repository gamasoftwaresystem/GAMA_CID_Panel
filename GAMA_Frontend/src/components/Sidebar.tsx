import { useState } from 'react';
import { Map, Navigation2, Crosshair, Settings, Layers } from 'lucide-react';

interface SidebarProps {
    activeNav: string;
    onNavChange: (navId: string) => void;
    onSettingsClick: () => void;
    isSettingsActive: boolean;
}

export default function Sidebar({ activeNav, onNavChange, onSettingsClick, isSettingsActive }: SidebarProps) {
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    const menuItems = [
        { id: 'map', icon: Layers, label: 'Sky View' },
        { id: 'nav', icon: Navigation2, label: 'Navigation' },
        { id: 'focus', icon: Crosshair, label: 'Tracking' },
    ];

    return (
        <div className="flex flex-col bg-black/30 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300">
            {/* Map Expansion Toggle */}
            <div className="relative group flex flex-col items-center mb-3">
                <button
                    onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isMenuExpanded
                        ? 'bg-hud-accent/20 text-hud-accent border border-hud-accent/30 shadow-[0_0_12px_rgba(94,234,212,0.2)]'
                        : 'bg-white/5 border border-white/5 text-hud-text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Map className="w-3.5 h-3.5" />
                </button>
                {/* Tooltip for Toggle */}
                <div className="absolute left-14 bg-black/90 text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-1.5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-2xl">
                    Map Menu
                </div>
            </div>

            {/* Expandable Navigation Items - Manual spacing to avoid double-gap */}
            <div
                className={`flex flex-col transition-all duration-500 ease-in-out px-1 items-center ${isMenuExpanded ? 'max-h-[200px] opacity-100 mb-3 space-y-3' : 'max-h-0 opacity-0 pointer-events-none mb-0'
                    }`}
                style={{ overflow: isMenuExpanded ? 'visible' : 'hidden' }}
            >
                {menuItems.map((item) => (
                    <div key={item.id} className="relative group flex items-center justify-center w-full">
                        <button
                            onClick={() => onNavChange(item.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${activeNav === item.id
                                ? 'bg-hud-accent text-black shadow-[0_0_15px_rgba(94,234,212,0.5)] scale-105'
                                : 'bg-white/5 border border-white/5 text-hud-text-muted hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-14 bg-black/90 text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-1.5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-2xl">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider - Simplified without pulse dot */}
            <div className="flex flex-col items-center mb-3">
                <div className="w-9 border-t border-white/10 h-0.5"></div>
            </div>

            {/* Settings Button */}
            <div className="relative group flex items-center justify-center">
                <button
                    onClick={onSettingsClick}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSettingsActive
                        ? 'bg-hud-accent text-black shadow-[0_0_15px_rgba(94,234,212,0.5)] scale-105'
                        : 'bg-white/5 border border-white/5 text-hud-text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Settings className="w-3.5 h-3.5" />
                </button>
                {/* Tooltip */}
                <div className="absolute left-14 bg-black/90 text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-1.5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-2xl">
                    Settings
                </div>
            </div>
        </div>
    );
}
