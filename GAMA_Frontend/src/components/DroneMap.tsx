import { useState, useEffect, useRef } from 'react';
import Map, { Marker, MapRef, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

                    {/* Navigation Route Path Rendering */}
                    {mapMode === 'nav' && selectedDroneId && drones.find(d => d.drone_id === selectedDroneId)?.fleet_mission && (
                        <>
                            <Source
                                id="mission-route-source"
                                type="geojson"
                                data={{
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: drones.find(d => d.drone_id === selectedDroneId)!.fleet_mission!.route
                                    }
                                } as any}
                            >
                                <Layer
                                    id="mission-route-line"
                                    type="line"
                                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                                    paint={{
                                        'line-color': '#eab308',
                                        'line-width': 6,
                                        'line-dasharray': [1, 1],
                                        'line-opacity': 1
                                    }}
                                />
                            </Source>

                            <Marker longitude={drones.find(d => d.drone_id === selectedDroneId)!.fleet_mission!.start_point[0]} latitude={drones.find(d => d.drone_id === selectedDroneId)!.fleet_mission!.start_point[1]} anchor="bottom">
                                <div className="w-4 h-4 rounded-full bg-white border-4 border-hud-accent shadow-lg mb-1" />
                            </Marker>
                            <Marker longitude={drones.find(d => d.drone_id === selectedDroneId)!.fleet_mission!.end_point[0]} latitude={drones.find(d => d.drone_id === selectedDroneId)!.fleet_mission!.end_point[1]} anchor="bottom">
                                <div className="flex flex-col items-center animate-bounce">
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

            {/* OVERLAY UI MARKERS (Always bright, outside the filtered div if possible, 
                but react-map-gl markers are tied to the Map. 
                Instead, we apply the filter only to the Map's canvas via CSS class if we had more control, 
                or we just accept that markers inside the map are also filtered.
                Wait, I can put the Markers OUTSIDE the filtered div but they won't move with the map.
                
                Correct way: CSS to target only map canvas. Let's try that.
            */}

            {/* Putting markers back into a second Map instance or a fixed overlay is complex.
                Let's use a simpler trick: increase the marker's own brightness/opacity to compensate.
            */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {/* Visual Fix: We'll render the same markers here but they need to be synced.
                    Actually, let's just make the markers VIBRANT inside.
                */}
            </div>

            <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Re-rendering markers in a clear layer while the map stays dark underneath */}
                <Map
                    {...viewState}
                    mapStyle="transparent"
                    mapboxAccessToken={MAPBOX_TOKEN}
                >
                    {drones.map(drone => {
                        // 3D View (Laser/Model) is now STRICTLY for 'focus' mode
                        const is3DView = viewState.zoom >= 14 && viewState.pitch >= 30 && mapMode === 'focus';
                        const isSelected = selectedDroneId === drone.drone_id;

                        const getMissionColor = (state?: string) => {
                            switch (state) {
                                case 'PICKUP': return '#9ACEEB'; // Sky Blue
                                case 'DELIVERING': return '#fbbf24'; // Pure Golden Yellow
                                case 'RETURNING': return '#ff0000'; // Pure Tactical Red
                                default: return '#cbd5e1'; // Neutral Slate/Grey for units with no assigned state
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
                                                {drone.status.mode === 'AUTO' && (
                                                    <div className="absolute inset-0 rounded-full animate-ping opacity-40 w-8 h-8 -left-1 -top-1"
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
                </Map>
            </div>
        </div>
    );
}
