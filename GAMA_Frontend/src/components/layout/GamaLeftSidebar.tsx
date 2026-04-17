import { Home, Compass, Image, Map, Bell, Flag, Power } from 'lucide-react';

export default function GamaLeftSidebar() {
    return (
        <div className="w-[80px] h-full bg-[#0c0c0d] border-r border-white/5 flex flex-col items-center py-6 z-50">
            {/* Top Brand Logo Item */}
            <div className="mb-10">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-black text-xs text-white">
                    JCA
                </div>
            </div>

            {/* Navigation Icons */}
            <nav className="flex-1 flex flex-col space-y-8 items-center">
                <button className="text-white/20 hover:text-white transition-colors">
                    <Home className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/10 rounded-xl text-hud-accent shadow-[0_0_15px_rgba(94,234,212,0.1)]">
                    <Compass className="w-5 h-5" />
                </button>
                <button className="text-white/20 hover:text-white transition-colors">
                    <Image className="w-5 h-5" />
                </button>
                <button className="text-white/20 hover:text-white transition-colors">
                    <Map className="w-5 h-5" />
                </button>
                <div className="py-4 opacity-10">
                    <div className="w-4 h-px bg-white" />
                </div>
                <button className="text-white/20 hover:text-white transition-colors">
                    <Home className="w-5 h-5" /> {/* Placeholder for secondary home icon in image */}
                </button>
                <button className="text-white/20 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="text-white/20 hover:text-white transition-colors">
                    <Flag className="w-5 h-5" />
                </button>
            </nav>

            {/* Botom Profile and Power */}
            <div className="flex flex-col space-y-8 items-center mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 cursor-pointer hover:border-hud-accent/40 transition-all">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=pilot1" 
                      alt="Pilot" 
                      className="w-full h-full object-cover"
                    />
                </div>
                <button className="text-white/20 hover:text-hud-danger transition-colors">
                    <Power className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
