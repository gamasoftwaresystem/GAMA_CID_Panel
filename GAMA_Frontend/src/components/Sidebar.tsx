import { Map, Navigation2, Crosshair, Settings } from 'lucide-react';

interface SidebarProps {
    activeNav: string;
    onNavChange: (navId: string) => void;
    onSettingsClick: () => void;
    isSettingsActive: boolean;
}

export default function Sidebar({ activeNav, onNavChange, onSettingsClick, isSettingsActive }: SidebarProps) {
    const menuItems = [
        { id: 'map', icon: Map, label: 'Sky View' },
        { id: 'nav', icon: Navigation2, label: 'Navigation' },
        { id: 'focus', icon: Crosshair, label: 'Tracking' },
    ];

    return (
        <div className="flex flex-col space-y-2.5 bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {menuItems.map((item) => (
                <div key={item.id} className="relative group flex items-center">
                    <button
                        onClick={() => onNavChange(item.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${activeNav === item.id
                            ? 'bg-hud-accent text-black shadow-[0_0_12px_rgba(94,234,212,0.4)] scale-105'
                            : 'bg-white/5 border border-white/5 text-hud-text-muted hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <item.icon className="w-3.5 h-3.5" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-13 bg-black/90 text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-1.5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-2xl">
                        {item.label}
                    </div>
                </div>
            ))}

            {/* Settings Button (Moved up) */}
            <div className="relative group flex items-center">
                <button
                    onClick={onSettingsClick}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isSettingsActive
                        ? 'bg-hud-accent text-black shadow-[0_0_12px_rgba(94,234,212,0.4)] scale-105'
                        : 'bg-white/5 border border-white/5 text-hud-text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Settings className="w-3.5 h-3.5" />
                </button>
                {/* Tooltip */}
                <div className="absolute left-13 bg-black/90 text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-1.5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-2xl">
                    Settings
                </div>
            </div>

            {/* Divider with Pulse */}
            <div className="w-9 h-3 flex items-center justify-center border-t border-white/10 mt-1 pt-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hud-accent/50 animate-pulse"></span>
            </div>
        </div>
    );
}
