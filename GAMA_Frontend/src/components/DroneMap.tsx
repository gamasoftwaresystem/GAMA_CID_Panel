import { useState, useEffect, useRef, useMemo } from 'react';
import Map, { Marker, MapRef, Layer, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Building2 } from 'lucide-react';
import { Drone } from '../types';

const DroneIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ ...style }}>
        <circle cx="4" cy="4" r="3.5" className="opacity-60" strokeDasharray="2 2" />
        <circle cx="20" cy="4" r="3.5" className="opacity-60" strokeDasharray="2 2" />
        <circle cx="4" cy="20" r="3.5" className="opacity-60" strokeDasharray="2 2" />
        <circle cx="20" cy="20" r="3.5" className="opacity-60" strokeDasharray="2 2" />
        <circle cx="4" cy="4" r="1" fill="currentColor" />
        <circle cx="20" cy="4" r="1" fill="currentColor" />
        <circle cx="4" cy="20" r="1" fill="currentColor" />
        <circle cx="20" cy="20" r="1" fill="currentColor" />
        <line x1="6.5" y1="6.5" x2="10" y2="10" strokeWidth="1.5" />
        <line x1="17.5" y1="6.5" x2="14" y2="10" strokeWidth="1.5" />
        <line x1="6.5" y1="17.5" x2="10" y2="14" strokeWidth="1.5" />
        <line x1="17.5" y1="17.5" x2="14" y2="14" strokeWidth="1.5" />
        <polygon points="12,8 14.5,10.5 14.5,13.5 12,16 9.5,13.5 9.5,10.5" fill="currentColor" className="opacity-90" />
        <path d="M10.5 8 L12 5 L13.5 8 Z" fill="currentColor" />
    </svg>
);

interface DroneMapProps {
    drones: Drone[];
    selectedDroneId: string | null;
    onSelectDrone: (id: string) => void;
    mapMode: string;
    showNoFlyZones?: boolean;
    showBaseZones?: boolean;
    showHumanDensity?: boolean;
}

export default function DroneMap({ drones, selectedDroneId, onSelectDrone, mapMode, showNoFlyZones = false, showBaseZones = false, showHumanDensity = false }: DroneMapProps) {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: 29.000,
        latitude: 41.040,
        zoom: 12,
        pitch: 0,
        bearing: 0
    });
    const [hoveredZone, setHoveredZone] = useState<{ name: string; x: number; y: number } | null>(null);
    const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);

    // 1. Refactored Mission Route Logic (Unified Source & Segment Detection)
    const missionData = useMemo(() => {
        if (mapMode !== 'nav' || !selectedDroneId) return null;
        const targetDrone = drones.find(d => d.drone_id === selectedDroneId);
        if (!targetDrone || !targetDrone.fleet_mission) return null;

        const route = targetDrone.fleet_mission.route;
        const dronePos: [number, number] = [targetDrone.navigation.lon, targetDrone.navigation.lat];

        // Find the closest SEGMENT (i, i+1) to the drone
        // This is more robust than closest waypoint
        let minDistance = Infinity;
        let segmentIdx = 0;

        for (let i = 0; i < route.length - 1; i++) {
            const p1 = route[i];
            const p2 = route[i+1];
            
            // Simple Euclidean distance to the midpoint of the segment as a heuristic
            // or distance to the line segment.
            const midX = (p1[0] + p2[0]) / 2;
            const midY = (p1[1] + p2[1]) / 2;
            const dist = Math.sqrt(Math.pow(midX - dronePos[0], 2) + Math.pow(midY - dronePos[1], 2));
            
            if (dist < minDistance) {
                minDistance = dist;
                segmentIdx = i;
            }
        }

        // Split logic: 
        // Passed = route from 0 to segmentIdx, then drone position
        // Future = drone position, then route from segmentIdx+1 to end
        const passedCoords = [...route.slice(0, segmentIdx + 1), dronePos];
        const futureCoords = [dronePos, ...route.slice(segmentIdx + 1)];

        return {
            geojson: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: { status: 'passed' },
                        geometry: { type: 'LineString', coordinates: passedCoords }
                    },
                    {
                        type: 'Feature',
                        properties: { status: 'future' },
                        geometry: { type: 'LineString', coordinates: futureCoords }
                    }
                ]
            } as any,
            start: targetDrone.fleet_mission.start_point,
            end: targetDrone.fleet_mission.end_point
        };
    }, [drones, selectedDroneId, mapMode]);

    const BASES_METADATA = [
        {
            id: 'base-maslak',
            name: 'Maslak Hub Alpha',
            coords: [29.015, 41.105],
            drones: 14,
            capacity: 20,
            status: 'NOMINAL',
        },
        {
            id: 'base-kadikoy',
            name: 'Kadıköy Hub Delta',
            coords: [29.030, 40.990],
            drones: 8,
            capacity: 12,
            status: 'STANDBY',
        }
    ];

    // Mock Human Density Data Points (Istanbul Hotspots)
    const humanDensityData = {
        type: 'FeatureCollection',
        features: [
            // Beşiktaş
            { type: 'Feature', properties: { intensity: 0.9 }, geometry: { type: 'Point', coordinates: [29.006, 41.042] } },
            { type: 'Feature', properties: { intensity: 0.8 }, geometry: { type: 'Point', coordinates: [29.008, 41.044] } },
            // Taksim / İstiklal
            { type: 'Feature', properties: { intensity: 0.95 }, geometry: { type: 'Point', coordinates: [28.983, 41.037] } },
            { type: 'Feature', properties: { intensity: 0.7 }, geometry: { type: 'Point', coordinates: [28.980, 41.034] } },
            // Kadıköy
            { type: 'Feature', properties: { intensity: 0.85 }, geometry: { type: 'Point', coordinates: [29.025, 40.992] } },
            { type: 'Feature', properties: { intensity: 0.6 }, geometry: { type: 'Point', coordinates: [29.028, 40.995] } },
            // Üsküdar
            { type: 'Feature', properties: { intensity: 0.75 }, geometry: { type: 'Point', coordinates: [29.015, 41.026] } },
            // Mecidiyeköy / Zincirlikuyu
            { type: 'Feature', properties: { intensity: 0.9 }, geometry: { type: 'Point', coordinates: [29.005, 41.065] } },
            { type: 'Feature', properties: { intensity: 0.8 }, geometry: { type: 'Point', coordinates: [29.003, 41.068] } },
            // Nişantaşı
            { type: 'Feature', properties: { intensity: 0.8 }, geometry: { type: 'Point', coordinates: [28.994, 41.051] } },
        ]
    };

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapMode === 'map') {
            mapRef.current.flyTo({ pitch: 0, bearing: 0, zoom: 13, duration: 2000, essential: true });
        } else if (mapMode === 'camera') {
            mapRef.current.flyTo({ pitch: 65, bearing: -25, zoom: 14, duration: 2000, essential: true });
        } else if (mapMode === 'nav') {
            const target = drones.find(d => d.drone_id === selectedDroneId);
            if (target && target.fleet_mission) {
                mapRef.current.flyTo({ 
                    center: [target.navigation.lon, target.navigation.lat], 
                    zoom: 14.5, 
                    pitch: 45, 
                    bearing: target.navigation.heading, 
                    duration: 3000, 
                    essential: true 
                });
            }
        } else if (mapMode === 'focus') {
            const target = drones.find(d => d.drone_id === selectedDroneId);
            if (target) {
                mapRef.current.flyTo({ 
                    center: [target.navigation.lon, target.navigation.lat], 
                    zoom: 17.5, 
                    pitch: 80, 
                    bearing: target.navigation.heading, 
                    duration: 3000, 
                    essential: true 
                });
            }
        }
    }, [mapMode, selectedDroneId]);

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN";

    return (
        <div className="w-full h-full bg-hud-bg relative overflow-hidden">
            <div className="w-full h-full" style={{ filter: 'brightness(0.75) contrast(1.1)' }}>
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    attributionControl={false}
                    style={{ width: '100%', height: '100%' }}
                    onMouseMove={e => {
                        const features = e.target.queryRenderedFeatures(e.point, {
                            layers: ['no-fly-poly-fill', 'no-fly-point-fill']
                        });

                        if (features.length > 0) {
                            const feature = features[0];
                            setHoveredZone({
                                name: feature.properties?.name || 'Yasaklı Bölge',
                                x: e.point.x,
                                y: e.point.y
                            });
                        } else {
                            setHoveredZone(null);
                        }
                    }}
                    onMouseLeave={() => setHoveredZone(null)}
                    onLoad={evt => {
                        const map = evt.target as any;
                        try {
                            if (!map.hasModel('drone-gltf')) {
                                map.addModel('drone-gltf', '/optimize_dron.glb');
                            }
                        } catch (err) {
                            console.error("Failed loading Mapbox GLTF Model:", err);
                        }
                    }}
                >
                    {/* Dark Tint Overlay applied ONLY here - lightened to 20% */}
                    <div className="absolute inset-0 pointer-events-none bg-[#050a0f]/20 z-10" />

                    {/* Zone Overlays */}
                    {showNoFlyZones && (
                        <Source id="no-fly-zones" type="geojson" data={{
                            type: 'FeatureCollection',
                            features: [
                                // Airports (Polygons)
                                {
                                    type: 'Feature',
                                    properties: { type: 'airport', name: 'İstanbul Havalimanı (IST)' },
                                    geometry: {
                                        type: 'Polygon',
                                        coordinates: [[
                                            [28.670, 41.330], [28.830, 41.330], [28.830, 41.220], [28.670, 41.220], [28.670, 41.330]
                                        ]] // Istanbul Airport IST
                                    }
                                },
                                {
                                    type: 'Feature',
                                    properties: { type: 'airport', name: 'Sabiha Gökçen Havalimanı (SAW)' },
                                    geometry: {
                                        type: 'Polygon',
                                        coordinates: [[
                                            [29.250, 40.940], [29.370, 40.940], [29.370, 40.860], [29.250, 40.860], [29.250, 40.940]
                                        ]] // Sabiha Gökçen SAW
                                    }
                                },
                                {
                                    type: 'Feature',
                                    properties: { type: 'airport', name: 'Atatürk Havalimanı (LTBA)' },
                                    geometry: {
                                        type: 'Polygon',
                                        coordinates: [[
                                            [28.790, 41.010], [28.845, 41.010], [28.845, 40.965], [28.790, 40.965], [28.790, 41.010]
                                        ]] // Atatürk Airport LTBA
                                    }
                                },
                                // Historical Peninsula (Polygon)
                                {
                                    type: 'Feature',
                                    properties: { type: 'historic', name: 'Tarihi Yarımada' },
                                    geometry: {
                                        type: 'Polygon',
                                        coordinates: [[
                                            [28.970, 41.020], [28.995, 41.020], [28.995, 41.000], [28.970, 41.000], [28.970, 41.020]
                                        ]]
                                    }
                                },
                                // Point Zones (Radius enforced via paint properties - pixels at Zoom 15)
                                // Military: Hasdal (approx 2.5km radius)
                                { type: 'Feature', properties: { type: 'military', radius: 1400, name: 'Hasdal Askeri Bölge' }, geometry: { type: 'Point', coordinates: [28.955, 41.095] } },
                                // Military: Maltepe (approx 3km radius)
                                { type: 'Feature', properties: { type: 'military', radius: 1700, name: 'Maltepe Askeri Bölge' }, geometry: { type: 'Point', coordinates: [29.155, 40.940] } },
                                // Prison: Metris (approx 500m radius)
                                { type: 'Feature', properties: { type: 'prison', radius: 280, name: 'Metris Cezaevi' }, geometry: { type: 'Point', coordinates: [28.882, 41.077] } },
                                // Stadium: Tüpraş (Beşiktaş) (approx 200m radius)
                                { type: 'Feature', properties: { type: 'stadium', radius: 110, name: 'Tüpraş Stadyumu' }, geometry: { type: 'Point', coordinates: [28.995, 41.039] } },
                                // Stadium: Rams Park (Galatasaray)
                                { type: 'Feature', properties: { type: 'stadium', radius: 120, name: 'Rams Park Stadyumu' }, geometry: { type: 'Point', coordinates: [28.985, 41.103] } },
                                // Stadium: Ülker (Fenerbahçe)
                                { type: 'Feature', properties: { type: 'stadium', radius: 110, name: 'Ülker Stadyumu' }, geometry: { type: 'Point', coordinates: [29.037, 40.987] } },
                                // Infrastructure: Ambarlı Fuel Depot (approx 1.5km radius)
                                { type: 'Feature', properties: { type: 'infrastructure', radius: 800, name: 'Ambarlı Akaryakıt Tesisleri' }, geometry: { type: 'Point', coordinates: [28.685, 40.965] } },
                            ]
                        }}>
                            {/* Render Polygons */}
                            <Layer id="no-fly-poly-glow" type="line" filter={['==', ['geometry-type'], 'Polygon']} paint={{ 'line-color': '#ef4444', 'line-width': 10, 'line-blur': 10, 'line-opacity': 0.6 }} />
                            <Layer id="no-fly-poly-fill" type="fill" filter={['==', ['geometry-type'], 'Polygon']} paint={{ 'fill-color': '#ef4444', 'fill-opacity': 0.1 }} />
                            <Layer id="no-fly-poly-outline" type="line" filter={['==', ['geometry-type'], 'Polygon']} paint={{ 'line-color': '#ff6b6b', 'line-width': 2, 'line-dasharray': [3, 3] }} />

                            {/* Render Points as Circles */}
                            <Layer
                                id="no-fly-point-glow"
                                type="circle"
                                filter={['==', ['geometry-type'], 'Point']}
                                paint={{
                                    'circle-radius': [
                                        'interpolate',
                                        ['exponential', 2],
                                        ['zoom'],
                                        10, ['*', ['+', ['get', 'radius'], 5], 0.03125],
                                        15, ['+', ['get', 'radius'], 5]
                                    ],
                                    'circle-blur': 1,
                                    'circle-color': '#ef4444',
                                    'circle-opacity': 0.5
                                }}
                            />
                            <Layer
                                id="no-fly-point-fill"
                                type="circle"
                                filter={['==', ['geometry-type'], 'Point']}
                                paint={{
                                    'circle-radius': [
                                        'interpolate',
                                        ['exponential', 2],
                                        ['zoom'],
                                        10, ['*', ['get', 'radius'], 0.03125],
                                        15, ['get', 'radius']
                                    ],
                                    'circle-color': '#ef4444',
                                    'circle-opacity': 0.15,
                                    'circle-stroke-width': 2,
                                    'circle-stroke-color': '#ff6b6b'
                                }}
                            />
                        </Source>
                    )}

                    {showBaseZones && (
                        <Source id="base-zones" type="geojson" data={{
                            type: 'FeatureCollection',
                            features: [
                                // Maslak Base
                                { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [29.015, 41.105] } },
                                // Kadıköy Base
                                { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [29.030, 40.990] } }
                            ]
                        }}>
                            <Layer id="base-glow" type="circle" paint={{
                                'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 4.6, 15, 150],
                                'circle-blur': 1.5, 'circle-color': '#3b82f6', 'circle-opacity': 0.4
                            }} />
                            <Layer id="base-outer" type="circle" paint={{
                                'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 3.1, 15, 100],
                                'circle-color': 'transparent', 'circle-stroke-width': 2, 'circle-stroke-color': '#60a5fa'
                            }} />
                            <Layer id="base-fill" type="circle" paint={{
                                'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 3.1, 15, 100],
                                'circle-color': '#3b82f6', 'circle-opacity': 0.1
                            }} />
                            <Layer id="base-core" type="circle" paint={{
                                'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 0.6, 15, 6],
                                'circle-color': '#93c5fd', 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'
                            }} />
                        </Source>
                    )}

                    {showHumanDensity && (
                        <Source id="human-density" type="geojson" data={humanDensityData as any}>
                            <Layer
                                id="human-density-heat"
                                type="heatmap"
                                paint={{
                                    // Increase the heatmap weight based on intensity property
                                    'heatmap-weight': ['get', 'intensity'],
                                    // Increase the heatmap color weight weight by zoom level
                                    // heatmap-intensity is a multiplier on top of heatmap-weight
                                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
                                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                                    // Begin color ramp at 0-stop with a 0-transparency color
                                    // to create a blur-like effect.
                                    'heatmap-color': [
                                        'interpolate',
                                        ['linear'],
                                        ['heatmap-density'],
                                        0, 'rgba(33, 102, 172, 0)',
                                        0.2, 'rgba(103, 169, 207, 0.5)',
                                        0.4, 'rgba(209, 229, 240, 0.5)',
                                        0.6, 'rgba(253, 219, 199, 0.7)',
                                        0.8, 'rgba(239, 138, 98, 0.8)',
                                        1, 'rgba(178, 24, 43, 0.9)'
                                    ] as any,
                                    // Adjust the heatmap radius by zoom level
                                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 35],
                                    // Transition from heatmap to circle layer by zoom level
                                    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 15, 0.8]
                                }}
                            />
                        </Source>
                    )}

                    {/* 3D Buildings Extrusion Layer */}
                    {viewState.zoom > 14 && (
                        <Layer
                            id="3d-buildings"
                            source="composite"
                            source-layer="building"
                            filter={['==', 'extrude', 'true']}
                            type="fill-extrusion"
                            minzoom={14}
                            paint={{
                                'fill-extrusion-color': '#2a4454',
                                'fill-extrusion-height': ['get', 'height'],
                                'fill-extrusion-base': ['get', 'min_height'],
                                'fill-extrusion-opacity': 0.6
                            }}
                        />
                    )}

                    {/* Navigation Route Path Rendering (Unified Source) */}
                    {missionData && (
                        <Source id="mission-route-unified-source" type="geojson" data={missionData.geojson}>
                            {/* 1. Passed Route Segment Style */}
                            <Layer
                                id="mission-route-passed-line"
                                type="line"
                                filter={['==', ['get', 'status'], 'passed']}
                                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                                paint={{
                                    'line-color': '#eab308',
                                    'line-width': 4,
                                    'line-opacity': 0.12
                                }}
                            />

                            {/* 2. Future Route Segment Style */}
                            <Layer
                                id="mission-route-future-line"
                                type="line"
                                filter={['==', ['get', 'status'], 'future']}
                                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                                paint={{
                                    'line-color': '#eab308',
                                    'line-width': 6,
                                    'line-dasharray': [1, 1],
                                    'line-opacity': 1
                                }}
                            />
                            
                            {/* 3. Future Path Glow Effect */}
                            <Layer
                                id="mission-route-future-glow"
                                type="line"
                                filter={['==', ['get', 'status'], 'future']}
                                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                                paint={{
                                    'line-color': '#eab308',
                                    'line-width': 12,
                                    'line-blur': 12,
                                    'line-opacity': 0.3
                                }}
                            />
                        </Source>
                    )}

                    {missionData && (
                        <>
                            <Marker longitude={missionData.start[0]} latitude={missionData.start[1]} anchor="bottom">
                                <div className="w-4 h-4 rounded-full bg-white border-4 border-hud-accent shadow-lg mb-1" />
                            </Marker>
                            <Marker longitude={missionData.end[0]} latitude={missionData.end[1]} anchor="bottom">
                                <div className="flex flex-col items-center hud-bounce-once">
                                    <div className="text-xs bg-hud-warning text-black font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">TARGET</div>
                                    <div className="w-1 h-4 bg-hud-warning" />
                                    <div className="w-3 h-3 rounded-full bg-hud-warning shadow-[0_0_10px_rgba(234,179,8,1)]" />
                                </div>
                            </Marker>
                        </>
                    )}

                    {/* Real GLTF 3D Models - ONLY in Focus/Tracing mode */}
                    {viewState.zoom >= 14 && viewState.pitch >= 30 && mapMode === 'focus' && (
                        <Source
                            id="drone-source"
                            type="geojson"
                            data={{
                                type: 'FeatureCollection',
                                features: drones.map(target => ({
                                    type: 'Feature',
                                    geometry: { type: 'Point', coordinates: [target.navigation.lon, target.navigation.lat] },
                                    properties: { id: target.drone_id, heading: target.navigation.heading }
                                }))
                            } as any}
                        >
                            <Layer
                                {...({
                                    id: 'drone-3d-models',
                                    type: 'model',
                                    source: 'drone-source',
                                    layout: { 'model-id': 'drone-gltf' },
                                    paint: {
                                        'model-rotation': [90, 0, ['get', 'heading']],
                                        'model-scale': [0.016, 0.016, 0.016],
                                        'model-translation': [0, 0, 35],
                                        'model-color': '#eab308',
                                        'model-color-mix-intensity': 1,
                                        'model-opacity': 1
                                    }
                                } as any)}
                            />
                        </Source>
                    )}
                </Map>
            </div>

            {/* Hover Tooltip for No-Fly Zones */}
            {hoveredZone && (
                <div
                    className="fixed pointer-events-none z-[100] px-2 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded text-[9px] font-black uppercase tracking-widest text-hud-danger shadow-2xl animate-in fade-in zoom-in duration-150"
                    style={{
                        left: hoveredZone.x + 15,
                        top: hoveredZone.y + 15
                    }}
                >
                    {hoveredZone.name}
                </div>
            )}

            <div className="absolute inset-0 pointer-events-none z-20" />

            <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Re-rendering markers in a clear layer while the map stays dark underneath */}
                <Map
                    {...viewState}
                    mapStyle="transparent"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                >
                    {drones.map(drone => {
                        // 3D View (Laser/Model) is now STRICTLY for 'focus' mode
                        const is3DView = viewState.zoom >= 14 && viewState.pitch >= 30 && mapMode === 'focus';
                        const isSelected = selectedDroneId === drone.drone_id;

                        const getMissionColor = (state?: string) => {
                            switch (state) {
                                case 'IN_SERVICE': return '#10b981'; // Green
                                case 'PENDING': return '#3b82f6'; // Blue
                                case 'RETURNING': return '#f59e0b'; // Yellow
                                case 'OUT_OF_SERVICE': return '#ef4444'; // Red
                                case 'OFFLINE': return '#64748b'; // Gray
                                default: return '#cbd5e1'; // Neutral
                            }
                        };
                        const missionColor = getMissionColor(drone.status.mission_state);

                        return (
                            <Marker
                                key={drone.drone_id}
                                longitude={drone.navigation.lon}
                                latitude={drone.navigation.lat}
                                anchor="center"
                                pitchAlignment={is3DView ? "map" : "auto"}
                                rotationAlignment={is3DView ? "map" : "auto"}
                            >
                                <div className="pointer-events-auto">
                                    {is3DView && isSelected && (
                                        <div className="absolute pointer-events-none w-1 bg-hud-accent shadow-[0_0_15px_rgba(94,234,212,1)]"
                                            style={{ height: '40px', transform: 'translateZ(0px) rotateX(90deg)', transformOrigin: 'top center' }}></div>
                                    )}

                                    {is3DView && (
                                        <div
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectDrone(drone.drone_id);
                                            }}
                                            style={{ width: '60px', height: '60px', background: 'transparent', transform: 'translateZ(15px)' }}
                                        ></div>
                                    )}

                                    {!is3DView && (
                                        <div
                                            className={`cursor-pointer transition-transform duration-300 transform hover:scale-125
                                        ${isSelected ? 'scale-125 z-10' : 'scale-100 z-0'}
                                        `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectDrone(drone.drone_id);
                                            }}
                                        >
                                            <div className="relative">
                                                {/* Pulse effect color matches mission */}
                                                {(drone.status.mode === 'AUTO' || drone.status.mission_state === 'OUT_OF_SERVICE') && (
                                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-40 w-8 h-8 -left-1 -top-1`}
                                                        style={{ backgroundColor: missionColor }}
                                                    />
                                                )}
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center relative shadow-lg
                                            ${isSelected
                                                        ? 'text-hud-bg ring-4 border'
                                                        : 'bg-hud-panel border'
                                                    }`}
                                                    style={{
                                                        backgroundColor: isSelected ? missionColor : undefined,
                                                        borderColor: isSelected ? '#000000' : missionColor,
                                                        color: isSelected ? '#000000' : missionColor,
                                                        boxShadow: isSelected ? `0 0 20px ${missionColor}88` : !isSelected ? `inset 0 0 5px ${missionColor}44` : undefined
                                                    }}>
                                                    <DroneIcon
                                                        className="w-4 h-4"
                                                        style={{ transform: `rotate(${drone.navigation.heading}deg)` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Marker>
                        );
                    })}

                    {/* Base Markers and Info Popups */}
                    {showBaseZones && BASES_METADATA.map(base => (
                        <Marker
                            key={base.id}
                            longitude={base.coords[0]}
                            latitude={base.coords[1]}
                            anchor="center"
                        >
                            <div 
                                className={`cursor-pointer transition-all duration-300 group pointer-events-auto ${selectedBaseId === base.id ? 'scale-125' : 'hover:scale-110'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBaseId(base.id === selectedBaseId ? null : base.id);
                                }}
                            >
                                <div className="relative">
                                    <div className={`p-2 rounded-xl border-2 backdrop-blur-md shadow-2xl relative
                                        ${selectedBaseId === base.id 
                                            ? 'bg-hud-accent/20 border-hud-accent text-hud-accent' 
                                            : 'bg-hud-panel border-white/20 text-white/40 group-hover:text-white/80'}`}
                                    >
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Marker>
                    ))}

                    {showBaseZones && selectedBaseId && (() => {
                        const base = BASES_METADATA.find(b => b.id === selectedBaseId);
                        if (!base) return null;
                        return (
                            <Popup
                                longitude={base.coords[0]}
                                latitude={base.coords[1]}
                                anchor="top-left"
                                closeButton={false}
                                closeOnClick={false}
                                className="base-info-popup"
                            >
                                <div className="glass-panel p-4 min-w-[180px] border-t border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-[12px] font-black text-white uppercase tracking-tight leading-none">{base.name}</h3>
                                            <span className="text-[8px] font-bold text-hud-accent uppercase tracking-widest mt-1 block">Active Base</span>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedBaseId(null); }}
                                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-3 h-3 text-white/40" />
                                        </button>
                                    </div>

                                    {/* Simplified Content */}
                                    <div className="space-y-2 mt-2">
                                        <p className="text-[9px] text-hud-text-muted leading-tight">
                                            Main central logistics hub for sector operations and fleet maintenance.
                                        </p>
                                        
                                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-bold text-white/20 uppercase">Location</span>
                                                <span className="text-[9px] font-black text-white/60 font-mono tracking-tighter">
                                                    {base.coords[1].toFixed(3)}°N, {base.coords[0].toFixed(3)}°E
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-wider">Units / Capacity</span>
                                                <span className="text-[10px] font-black text-hud-accent font-mono">
                                                    {base.drones} <span className="text-white/20 mx-0.5">/</span> {base.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        );
                    })()}
                </Map>
            </div>
        </div>
    );
}
