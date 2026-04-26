import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DroneMap from "../components/DroneMap";
import DroneDetailPanel from "../components/DroneDetailPanel";
import { useDroneFleet } from "../hooks/useDroneFleet";

// Modular Components
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { ControlDock } from "../components/layout/ControlDock";
import { BrandingOverlay } from "../components/layout/BrandingOverlay";
import { MapSettings } from "../components/panels/MapSettings";
import { UavCenterPanel } from "../components/panels/UavCenterPanel";
import { TacticalHubPanel } from "../components/panels/TacticalHubPanel";
import { NetworkStatusPanel } from "../components/panels/NetworkStatusPanel";
import { User } from "../types";

interface OperatorViewProps {
  user: User;
  onLogout: () => void;
}

export default function OperatorView({ onLogout }: OperatorViewProps) {
  const {
    drones,
    weatherData,
    handleCommand
  } = useDroneFleet();

  // Selection & Navigation State
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [detailDroneId, setDetailDroneId] = useState<string | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>('map');
  const [previousNavId, setPreviousNavId] = useState<string>('map');

  // UI Toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showNoFlyZones, setShowNoFlyZones] = useState(false);
  const [showBaseZones, setShowBaseZones] = useState(false);
  const [showHumanDensity, setShowHumanDensity] = useState(false);
  const [isUavCenterOpen, setIsUavCenterOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNetworkStatusOpen, setIsNetworkStatusOpen] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isMapMenuOpen, setIsMapMenuOpen] = useState(false);

  // Derived State
  const selectedDrone = drones.find((d) => d.drone_id === selectedDroneId);

  // Handlers
  const handleDroneSelect = (id: string | null, toggle = true) => {
    const isTrackingMode = activeNavId === 'nav' || activeNavId === 'focus';

    if (toggle && selectedDroneId === id && !isTrackingMode) {
      setSelectedDroneId(null);
      setActiveNavId(previousNavId);
    } else {
      setSelectedDroneId(id);
      if (id && !isTrackingMode) {
        setPreviousNavId(activeNavId);
        setActiveNavId('nav');
        setIsMapMenuOpen(true);
      }
    }
    // Auto-close any expanded info when switching drones
    setExpandedCardId(null);
  };

  const onCommandClick = (cmd: string) => {
    setActiveCommand(cmd);
    handleCommand(cmd);
    setTimeout(() => setActiveCommand(null), 1000);
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden text-hud-text relative bg-hud-bg animate-in fade-in duration-500"
      onClick={() => {
        setSelectedDroneId(null);
        setExpandedCardId(null);
        if (activeNavId === 'nav' || activeNavId === 'focus') {
          setActiveNavId('map');
        }
      }}
    >
      {/* Background Layer: Map */}
      <div className="absolute inset-0 z-0">
        <DroneMap
          drones={drones}
          selectedDroneId={selectedDroneId}
          onSelectDrone={handleDroneSelect}
          mapMode={activeNavId}
          showNoFlyZones={showNoFlyZones}
          showBaseZones={showBaseZones}
          showHumanDensity={showHumanDensity}
        />
        <div className="absolute inset-0 bg-teal-900/10 mix-blend-color-dodge pointer-events-none" />
      </div>

      {/* Foreground UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">

        <DashboardHeader weatherData={weatherData} onLogout={onLogout} />

        {/* Mid-level Navigation & Settings */}
        <div className="relative flex-1 flex my-6 w-full pointer-events-none">
          <div className="absolute left-0 top-1/4 pointer-events-auto z-40 flex items-start" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              activeNav={activeNavId}
              onNavChange={setActiveNavId}
              onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)}
              isSettingsActive={isSettingsOpen}
              isMenuExpanded={isMapMenuOpen}
              setIsMenuExpanded={setIsMapMenuOpen}
              isDroneSelected={!!selectedDroneId}
            />

            <MapSettings
              isOpen={isSettingsOpen}
              showNoFlyZones={showNoFlyZones}
              setShowNoFlyZones={setShowNoFlyZones}
              showBaseZones={showBaseZones}
              setShowBaseZones={setShowBaseZones}
              showHumanDensity={showHumanDensity}
              setShowHumanDensity={setShowHumanDensity}
            />
          </div>
        </div>

        {/* Interaction Layer: Panels & Dock */}
        <div className="mac-dock-container" onClick={(e) => e.stopPropagation()}>
          <div className="floating-panel-container">
            <UavCenterPanel
              isOpen={isUavCenterOpen}
              onClose={() => setIsUavCenterOpen(false)}
              drones={drones}
              selectedDroneId={selectedDroneId}
              handleDroneSelect={handleDroneSelect}
              setIsControlCenterOpen={setIsControlCenterOpen}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
            />

            <TacticalHubPanel
              isOpen={isControlCenterOpen}
              onClose={() => setIsControlCenterOpen(false)}
              selectedDrone={selectedDrone}
              drones={drones}
              activeCommand={activeCommand}
              handleCommandClick={onCommandClick}
            />

            <NetworkStatusPanel
              isOpen={isNetworkStatusOpen}
              onClose={() => setIsNetworkStatusOpen(false)}
              onSelectDrone={handleDroneSelect}
              drones={drones}
            />
          </div>

          <ControlDock
            isUavCenterOpen={isUavCenterOpen}
            setIsUavCenterOpen={setIsUavCenterOpen}
            isControlCenterOpen={isControlCenterOpen}
            setIsControlCenterOpen={setIsControlCenterOpen}
            isNetworkStatusOpen={isNetworkStatusOpen}
            setIsNetworkStatusOpen={setIsNetworkStatusOpen}
          />
        </div>

        <BrandingOverlay />
      </div>

      {/* Detail Modal Overlay */}
      {detailDroneId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
          <div className="animate-in fade-in zoom-in duration-200">
            <DroneDetailPanel
              drone={drones.find((d) => d.drone_id === detailDroneId)!}
              onClose={() => setDetailDroneId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
