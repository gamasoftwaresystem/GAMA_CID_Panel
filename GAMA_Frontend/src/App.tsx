import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DroneCard from "./components/DroneCard";
import DroneMap from "./components/DroneMap";
import DroneDetailPanel from "./components/DroneDetailPanel";
import mockDrones from "./mock/drones.json";
import { Drone } from "./types";
import { Cloud, Wind, Thermometer, Maximize, RefreshCcw, StopCircle, Home, PlaneTakeoff, Wifi, Activity, Layers, Radio } from "lucide-react";
import "./App.css";

function App() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [detailDroneId, setDetailDroneId] = useState<string | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>('map');
  const [previousNavId, setPreviousNavId] = useState<string>('map');

  const handleDroneSelect = (id: string) => {
    if (selectedDroneId === id) {
      setSelectedDroneId(null);
      setActiveNavId(previousNavId);
    } else {
      setSelectedDroneId(id);
      if (activeNavId !== 'nav') {
        setPreviousNavId(activeNavId);
        setActiveNavId('nav');
      }
    }
  };

  // Sidebar Settings Toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showNoFlyZones, setShowNoFlyZones] = useState(false);
  const [showBaseZones, setShowBaseZones] = useState(false);
  const [showPickupZones, setShowPickupZones] = useState(false);

  // New UI States
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const [uavTab, setUavTab] = useState<'Fleet' | 'Log' | 'Active' | 'Reserves'>('Fleet');
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [operationStage, setOperationStage] = useState(1);
  const [fleetStats, setFleetStats] = useState({ active: 4, delivering: 3, standby: 2 });

  // Real-time Weather State
  const [weatherData, setWeatherData] = useState<{ temp: string; condition: string; wind: string } | null>(null);
  // Panel Toggles
  const [isUavCenterOpen, setIsUavCenterOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  // Derived state
  const selectedDrone = drones.find((d) => d.drone_id === selectedDroneId) || drones[0];

  // Toggle Browser Fullscreen
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

  const handleCommandClick = (cmd: string) => {
    setActiveCommand(cmd);

    // Effect logic for new commands
    if (cmd === 'HALT ALL') {
      setFleetStats({ active: fleetStats.active + fleetStats.delivering, delivering: 0, standby: fleetStats.standby });
    } else if (cmd === 'RECALL') {
      setFleetStats({ active: 0, delivering: 0, standby: fleetStats.active + fleetStats.delivering + fleetStats.standby });
    } else if (cmd === 'DEPLOY ALL') {
      setFleetStats({ active: fleetStats.active + fleetStats.standby, delivering: Math.floor((fleetStats.active + fleetStats.standby) / 2), standby: 0 });
    } else if (cmd === 'REROUTE') {
      setFleetStats({ active: fleetStats.active, delivering: fleetStats.delivering, standby: fleetStats.standby });
    }

    // Increment operation stage sequentially when commmands are issued
    if (operationStage < 3) {
      setOperationStage(prev => prev + 1);
    } else {
      setOperationStage(1);
    }

    setTimeout(() => setActiveCommand(null), 1000); // Reset animation after 1s
  };

  useEffect(() => {
    // Initial data load
    setDrones(mockDrones as Drone[]);

    // Real-time Movement Simulation (Simulation of live data stream)
    const movementSim = setInterval(() => {
      setDrones(prevDrones => prevDrones.map(drone => {
        // Simulate speed & heading physics
        const speedKmph = drone.navigation.ground_speed;
        if (speedKmph <= 0) return drone;

        let nextLat = drone.navigation.lat;
        let nextLon = drone.navigation.lon;
        let heading = drone.navigation.heading;

        if (drone.fleet_mission && drone.fleet_mission.route.length > 1) {
          // Get current progress or initialize to 0
          const mission = drone.fleet_mission;
          const progress = mission.progress || 0;

          // Increment progress slowly base on speed
          const newProgress = Math.min(progress + (speedKmph * 0.0001), 1);

          // Interpolate position along the route line
          const points = mission.route;
          const totalSegments = points.length - 1;
          const floatIndex = newProgress * totalSegments;
          const index = Math.floor(floatIndex);

          if (index < totalSegments) {
            const segProgress = floatIndex - index;
            const p1 = points[index];
            const p2 = points[index + 1];

            nextLon = p1[0] + (p2[0] - p1[0]) * segProgress;
            nextLat = p1[1] + (p2[1] - p1[1]) * segProgress;

            // Calculate Heading towards the next point
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            heading = (Math.atan2(dx, dy) * (180 / Math.PI));
            if (heading < 0) heading += 360;
          } else {
            nextLon = points[totalSegments][0];
            nextLat = points[totalSegments][1];
          }

          // Save new progress
          drone.fleet_mission.progress = newProgress;
        } else {
          // Free roam (no mission)
          const speedMps = speedKmph * 0.6;
          const headingRad = heading * (Math.PI / 180);
          const metersPerDeg = 111320;

          const deltaLat = (Math.cos(headingRad) * speedMps) / metersPerDeg;
          const deltaLon = (Math.sin(headingRad) * speedMps) / (metersPerDeg * Math.cos(drone.navigation.lat * (Math.PI / 180)));

          nextLat += deltaLat;
          nextLon += deltaLon;
          heading += (Math.random() * 2 - 1);
        }

        return {
          ...drone,
          fleet_mission: drone.fleet_mission,
          navigation: {
            ...drone.navigation,
            lat: nextLat,
            lon: nextLon,
            heading: heading
          },
          status: {
            ...drone.status,
            battery_pct: Math.max(0, drone.status.battery_pct - 0.005) // Battery slowly draining
          }
        };
      }));
    }, 1000); // Update every 1 second (1000ms)

    // Fetch Real-time Weather Data for Istanbul
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,wind_speed_10m,weather_code');
        const data = await response.json();

        // Map WMO weather codes to simple strings and select icons
        const wmoMap: Record<number, string> = {
          0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
          45: 'Fog', 48: 'Depositing Rime Fog',
          51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
          61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
          71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
          95: 'Thunderstorm'
        };

        const conditionStr = wmoMap[data.current.weather_code] || 'Unknown';
        setWeatherData({
          temp: data.current.temperature_2m.toFixed(1),
          condition: conditionStr,
          wind: data.current.wind_speed_10m.toFixed(1)
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const intervalId = setInterval(fetchWeather, 600000);
    return () => {
      clearInterval(intervalId);
      clearInterval(movementSim);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden text-hud-text relative bg-hud-bg">
      {/* Fullscreen Video/Map Background */}
      <div className="absolute inset-0 z-0">
        <DroneMap
          drones={drones}
          selectedDroneId={selectedDroneId}
          onSelectDrone={handleDroneSelect}
          mapMode={activeNavId}
          showNoFlyZones={showNoFlyZones}
          showBaseZones={showBaseZones}
          showPickupZones={showPickupZones}
        />
        {/* Subtle Cyan Overlay Blend like in the Mockup */}
        <div className="absolute inset-0 bg-teal-900/10 mix-blend-color-dodge pointer-events-none"></div>
      </div>

      {/* Foreground UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">

        {/* Top Header Region */}
        <header className="flex items-start justify-between w-full">
          {/* Top Left Widgets */}
          <div className="flex space-x-3 pointer-events-auto">
            <button onClick={toggleAppFullscreen} className={`glass-pill w-12 h-12 flex items-center justify-center transition-all ${isAppFullscreen ? 'text-white bg-white/20' : 'text-hud-accent hover:bg-white/5'}`}>
              <Maximize className="w-5 h-5" />
            </button>
            <div className="glass-pill px-5 h-12 flex items-center space-x-4 text-xs font-semibold text-hud-text-muted">
              <span className="text-white">IST-HUB</span>
              <span className="text-hud-border">/</span>
              <span>41.0082° N, 28.9784° E</span>
            </div>
          </div>

          {/* Top Right Widgets */}
          <div className="flex space-x-3 pointer-events-auto">
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
          </div>
        </header>

        {/* Middle Layer (Sidebar + Target Overlay) */}
        <div className="relative flex-1 flex my-6 w-full">
          <div className="absolute left-0 top-1/4 pointer-events-auto z-40 flex items-start">
            <Sidebar activeNav={activeNavId} onNavChange={setActiveNavId} onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)} />

            {/* Settings Sliding Panel - Attached to Sidebar */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSettingsOpen ? 'w-72 opacity-100 ml-4' : 'w-0 opacity-0 ml-0'}`}>
              <div className="glass-panel w-72 p-5 flex flex-col space-y-5 shadow-2xl min-w-72">
                <h2 className="text-sm font-bold text-white tracking-wide border-b border-white/10 pb-3">Harita Ayarları</h2>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowNoFlyZones(!showNoFlyZones)}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">Yasaklı Bölgeler</span>
                  <button className={`w-9 h-5 rounded-full transition-colors relative ${showNoFlyZones ? 'bg-hud-danger' : 'bg-white/10 border border-white/10'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showNoFlyZones ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowBaseZones(!showBaseZones)}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">Base Bölgeleri</span>
                  <button className={`w-9 h-5 rounded-full transition-colors relative ${showBaseZones ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-white/10 border border-white/10'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showBaseZones ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowPickupZones(!showPickupZones)}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-hud-text-muted group-hover:text-white transition-colors">Teslim Alma Bölgeleri</span>
                  <button className={`w-9 h-5 rounded-full transition-colors relative ${showPickupZones ? 'bg-hud-accent shadow-[0_0_10px_rgba(94,234,212,0.6)]' : 'bg-white/10 border border-white/10'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${showPickupZones ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Dock and Floating Panels Region */}
        <div className="mac-dock-container">
          {/* Floating Panels Area */}
          <div className="floating-panel-container">
            {/* UAV Center Panel */}
            {isUavCenterOpen && (
              <div className="glass-panel w-[420px] h-[420px] p-5 rounded-3xl hud-panel-enter shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <h2 className="text-base font-bold text-white tracking-wide flex items-center">
                        UAV Center
                      </h2>
                    </div>

                    <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
                      {['Fleet', 'Log'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setUavTab(tab as any)}
                          className={`px-4 py-1 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${uavTab === tab ? 'bg-hud-accent text-black' : 'text-hud-text-muted hover:text-white'}`}>
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
                    {uavTab === 'Active' || uavTab === 'Fleet' ? (
                      <>
                        {/* Grouped by Mission State */}
                        {['PICKUP', 'DELIVERING', 'RETURNING'].map(state => {
                          const filteredDrones = drones.filter(d => d.status.mission_state === state);
                          if (filteredDrones.length === 0) return null;

                          return (
                            <div key={state} className="space-y-3">
                              <div className="sticky top-0 z-20 pt-1">
                                <div className="bg-hud-bg/80 backdrop-blur-xl border border-white/5 rounded-xl p-2.5 mb-2 flex items-center shadow-2xl">
                                  <div className="w-1.5 h-6 rounded-full mr-3 animate-pulse"
                                    style={{ backgroundColor: state === 'PICKUP' ? '#9ACEEB' : state === 'DELIVERING' ? '#fbbf24' : '#ff0000' }}></div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                      {state === 'PICKUP' ? 'PENDING' : state === 'DELIVERING' ? 'IN SERVICE' : 'OUT OF SERVICE'}
                                    </span>
                                    <span className="text-[8px] text-hud-text-muted uppercase tracking-widest font-bold">
                                      {filteredDrones.length} Units Active
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3 px-1">
                                {filteredDrones.map(drone => (
                                  <DroneCard
                                    key={drone.drone_id}
                                    drone={drone}
                                    selected={selectedDroneId === drone.drone_id}
                                    onClick={() => handleDroneSelect(drone.drone_id)}
                                    onOpenDetails={(e) => {
                                      e.stopPropagation();
                                      setDetailDroneId(drone.drone_id);
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="flex flex-col space-y-3 py-2">
                        {[
                          { time: '10:45', event: 'GAMA-01: Delivery sequence initiated', type: 'info' },
                          { time: '10:42', event: 'GAMA-03: Low battery warning - RTL engaged', type: 'warning' },
                          { time: '10:38', event: 'HVY-X9: Heavy winds detected at Alt 65m', type: 'warning' },
                          { time: '10:35', event: 'MED-01: Navigation target reached', type: 'success' },
                        ].map((log, i) => (
                          <div key={i} className="flex space-x-3 text-[10px] font-mono border-l border-white/10 pl-3 py-1">
                            <span className="text-hud-text-muted">{log.time}</span>
                            <span className={log.type === 'warning' ? 'text-hud-warning' : log.type === 'success' ? 'text-hud-accent' : 'text-white/80'}>{log.event}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Fleet Hub Panel */}
            {isControlCenterOpen && (
              <div className="glass-panel w-[850px] h-[420px] p-5 rounded-3xl hud-panel-enter shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-hud-accent animate-pulse shadow-[0_0_10px_rgba(94,234,212,0.8)]"></div>
                      <h2 className="text-base font-black text-white tracking-[0.1em] uppercase">
                        {selectedDrone ? `GENERAL GUIDE: ${selectedDrone.drone_id}` : 'FLEET NETWORK OVERVIEW'}
                      </h2>
                    </div>
                    <div className="flex items-center space-x-4 bg-black/30 px-4 py-1.5 rounded-full border border-white/5">
                      <span className="text-[9px] font-bold text-hud-text-muted uppercase tracking-widest">Global Status:</span>
                      <span className="text-[10px] font-black text-hud-accent tracking-widest">NOMINAL</span>
                    </div>
                  </div>

                  <div className="flex-1 flex gap-6">
                    <div className="flex flex-col w-44 space-y-3">
                      <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-widest pl-1">Command Layer</span>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        {[
                          { icon: StopCircle, label: 'HALT', color: 'text-hud-danger', bg: 'hover:bg-hud-danger/10' },
                          { icon: RefreshCcw, label: 'RE-NAV', color: 'text-hud-warning', bg: 'hover:bg-hud-warning/10' },
                          { icon: PlaneTakeoff, label: 'LIFTOFF', color: 'text-hud-accent', bg: 'hover:bg-hud-accent/10' },
                          { icon: Home, label: 'BASE', color: 'text-white', bg: 'hover:bg-white/10' }
                        ].map(cmd => (
                          <button
                            key={cmd.label}
                            onClick={() => handleCommandClick(cmd.label)}
                            className={`border rounded-xl p-3 flex flex-col items-center justify-center transition-all group ${activeCommand === cmd.label ? 'bg-white/10 border-white/30 scale-95 shadow-inner' : `bg-black/40 border-white/5 ${cmd.bg}`}`}>
                            <cmd.icon className={`w-4 h-4 mb-2 transition-colors ${activeCommand === cmd.label ? 'text-white' : cmd.color}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/70 group-hover:text-white">{cmd.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-5 flex flex-col relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Asset Distribution</span>
                          <span className="text-xs text-hud-text-muted font-mono">{drones.length} ACTIVE NODES</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center space-y-5">
                        {[
                          { label: 'PENDING', count: drones.filter(d => d.status.mission_state === 'PICKUP').length, color: '#9ACEEB' },
                          { label: 'IN SERVICE', count: drones.filter(d => d.status.mission_state === 'DELIVERING').length, color: '#fbbf24' },
                          { label: 'OUT OF SERVICE', count: drones.filter(d => d.status.mission_state === 'RETURNING').length, color: '#ff0000' }
                        ].map(stat => (
                          <div key={stat.label} className="space-y-1.5">
                            <div className="flex justify-between items-end px-1">
                              <span className="text-[9px] font-bold text-hud-text-muted uppercase tracking-wider">{stat.label}</span>
                              <span className="text-xs font-mono text-white font-bold">{stat.count}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(stat.count / (drones.length || 1)) * 100}%`, backgroundColor: stat.color }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-3">
                      <span className="text-[9px] font-black text-hud-text-muted uppercase tracking-widest pl-1">Diagnostics Board</span>
                      <div className="flex-1 space-y-2">
                        {[
                          { label: 'SAT-LINK', value: 'OPTIMAL', icon: Wifi, color: 'text-hud-accent' },
                          { label: 'FLEET HEALTH', value: 'GOOD', icon: Activity, color: 'text-hud-accent' }
                        ].map(metric => (
                          <div key={metric.label} className="bg-black/30 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <metric.icon className={`w-3.5 h-3.5 ${metric.color}`} />
                              <span className="text-[9px] font-bold text-hud-text-muted uppercase tracking-widest">{metric.label}</span>
                            </div>
                            <span className={`text-[10px] font-black font-mono ${metric.color}`}>{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MacOS Dock */}
          <div className="mac-dock">
            <div
              className={`mac-dock-item group ${isUavCenterOpen ? 'active' : ''}`}
              onClick={() => setIsUavCenterOpen(!isUavCenterOpen)}
            >
              <Layers className="w-5 h-5" />
              <div className="active-dot" />
              {/* Tooltip */}
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
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm text-white/90 text-[9px] font-medium tracking-wider px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap border border-white/5 shadow-lg translate-y-1 group-hover:translate-y-0 z-50 flex items-center justify-center">
                Sky View
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Drone Detail Modal Overlay */}
      {
        detailDroneId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
            <div className="animate-in fade-in zoom-in duration-200">
              <DroneDetailPanel
                drone={drones.find((d) => d.drone_id === detailDroneId)!}
                onClose={() => setDetailDroneId(null)}
              />
            </div>
          </div>
        )
      }
    </div >
  );
}

export default App;
