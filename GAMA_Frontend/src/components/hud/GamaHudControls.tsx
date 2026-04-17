import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GamaHudControls() {
    return (
        <div className="h-full glass-panel p-8 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute inset-0 bg-hud-accent/5 pointer-events-none" />
            
            <div className="flex w-full justify-between items-center relative z-10">
                <button className="glass-panel px-6 py-2 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase">
                    AWB
                </button>
                <button className="glass-panel px-6 py-2 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase">
                    DISP
                </button>
            </div>

            {/* D-Pad Control */}
            <div className="relative w-64 h-64 flex items-center justify-center animate-in zoom-in duration-700">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-white/5 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]" />
                
                {/* Controller Disc */}
                <div className="w-[85%] h-[85%] rounded-full bg-black/40 border border-white/5 shadow-2xl relative flex items-center justify-center group/disc">
                    {/* Inner Texture */}
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                    
                    {/* Directional Buttons */}
                    <button className="absolute top-4 w-12 h-12 flex items-center justify-center text-white/20 hover:text-hud-accent transition-colors active:scale-90">
                        <ChevronUp className="w-8 h-8" />
                    </button>
                    <button className="absolute bottom-4 w-12 h-12 flex items-center justify-center text-white/20 hover:text-hud-accent transition-colors active:scale-90">
                        <ChevronDown className="w-8 h-8" />
                    </button>
                    <button className="absolute left-4 w-12 h-12 flex items-center justify-center text-white/20 hover:text-hud-accent transition-colors active:scale-90">
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button className="absolute right-4 w-12 h-12 flex items-center justify-center text-white/20 hover:text-hud-accent transition-colors active:scale-90">
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Center Core */}
                    <div className="w-20 h-20 rounded-full bg-[#121212] border border-white/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center group-active/disc:border-hud-accent/40 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/5" />
                    </div>
                </div>

                {/* Aesthetic HUD Ticks */}
                {[...Array(36)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`absolute w-0.5 h-3 ${i % 9 === 0 ? 'bg-hud-accent/40 h-4 w-1' : 'bg-white/5'}`}
                        style={{ transform: `rotate(${i * 10}deg) translateY(-145px)` }}
                    />
                ))}
            </div>

            <div className="w-full h-1 relative overflow-hidden mt-4">
                 <div className="absolute inset-0 border-t border-white/5" />
            </div>
        </div>
    );
}
