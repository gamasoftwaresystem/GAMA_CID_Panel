import React from 'react';

export const BrandingOverlay: React.FC = () => {
    return (
        <div className="absolute bottom-[2px] left-[0px] pointer-events-auto z-50">
            <div className="bg-black/40 backdrop-blur-xl h-[40px] px-4 flex items-center space-x-3 rounded-r-xl border border-white/10 shadow-2xl">
                <img src="/gama_logo.png" alt="GAMA" className="w-8 h-8 object-contain mix-blend-screen brightness-125" />
                <span className="text-[14px] font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>GAMA</span>
                    <span className="opacity-80">DRONES</span>
                </span>
            </div>
        </div>
    );
};
