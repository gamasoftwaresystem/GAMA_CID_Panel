import { useState } from "react";
import { User } from "../types";
import { useDroneFleet } from "../hooks/useDroneFleet";
import PilotDashboard from "./PilotDashboard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { BrandingOverlay } from "../components/layout/BrandingOverlay";
import { Search, Radio, Wifi, Zap } from "lucide-react";

interface PilotViewProps {
  user: User;
  onLogout: () => void;
}

export default function PilotView({ user, onLogout }: PilotViewProps) {
  const { drones, weatherData } = useDroneFleet();
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(user.assignedDroneId || null);

  const selectedDrone = drones.find((d) => d.drone_id === selectedDroneId);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#30454C] text-hud-text overflow-hidden relative animate-in fade-in duration-500">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#30454C]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.03)_0%,transparent_50%)]" />

      {selectedDroneId && selectedDrone ? (
        /* The New Professional Dashboard */
        <div className="flex-1 w-full h-full animate-in fade-in zoom-in-95 duration-1000">
          <PilotDashboard 
            drone={selectedDrone} 
            weatherData={weatherData} 
            onLogout={onLogout}
            drones={drones}
          />
        </div>
      ) : (
        /* Fallback Fleet Selection Header & Grid */
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-8 pointer-events-none">
            <DashboardHeader weatherData={weatherData} />
          </div>

          <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="px-3 py-1 bg-hud-danger/10 border border-hud-danger/30 rounded-full mb-4">
                <span className="text-[10px] font-black text-hud-danger tracking-widest uppercase flex items-center">
                  <Radio className="w-3 h-3 mr-2 animate-pulse" /> Connection Standby
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Active Fleet Assignment</h1>
              <p className="text-hud-text-muted text-sm tracking-widest uppercase">Select a tactical unit to establish remote uplink</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drones.map((drone) => (
                <button
                  key={drone.drone_id}
                  onClick={() => setSelectedDroneId(drone.drone_id)}
                  className="glass-panel p-6 flex flex-col space-y-4 hover:border-hud-accent/40 hover:bg-hud-accent/5 transition-all text-left group"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-hud-accent/20 transition-colors">
                      <Zap className={`w-6 h-6 ${drone.status.health === 'GOOD' ? 'text-hud-accent' : 'text-hud-warning'}`} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-white/40 uppercase mb-1">Battery</span>
                      <span className="text-sm font-mono font-bold text-white">{drone.status.battery_pct}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic">{drone.drone_id}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-hud-accent/60">
                        <Wifi className="w-3 h-3 mr-1" />
                        <span className="text-[8px] font-bold uppercase">{drone.status.signal_dbm} dBm</span>
                      </div>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{drone.status.mode} MODE</span>
                    </div>
                  </div>
                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black text-hud-accent/60 uppercase group-hover:text-hud-accent transition-colors">Initiate Uplink</span>
                    <Search className="w-4 h-4 text-white/10 group-hover:text-hud-accent/40 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BrandingOverlay />
    </div>
  );
}
