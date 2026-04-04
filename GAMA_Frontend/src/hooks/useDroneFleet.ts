import { useState, useEffect, useCallback } from 'react';
import { Drone } from '../types';
import mockDrones from '../mock/drones.json';

export function useDroneFleet() {
    const [drones, setDrones] = useState<Drone[]>([]);
    const [weatherData, setWeatherData] = useState<{ temp: string; condition: string; wind: string } | null>(null);
    const [fleetStats, setFleetStats] = useState({ active: 4, delivering: 3, standby: 2 });
    const [operationStage, setOperationStage] = useState(1);

    // Initial load
    useEffect(() => {
        setDrones(mockDrones as Drone[]);
    }, []);

    // Simulation Loop (5Hz)
    useEffect(() => {
        if (drones.length === 0) return;

        const movementSim = setInterval(() => {
            setDrones(prevDrones => prevDrones.map(drone => {
                const speedKmph = drone.navigation.ground_speed;
                if (speedKmph <= 0) return drone;

                let nextLat = drone.navigation.lat;
                let nextLon = drone.navigation.lon;
                let heading = drone.navigation.heading;

                if (drone.fleet_mission && drone.fleet_mission.route.length > 1) {
                    const mission = drone.fleet_mission;
                    const progress = mission.progress || 0;
                    const newProgress = Math.min(progress + (speedKmph * 0.0001), 1);
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
                        const dx = p2[0] - p1[0];
                        const dy = p2[1] - p1[1];
                        heading = (Math.atan2(dx, dy) * (180 / Math.PI));
                        if (heading < 0) heading += 360;
                    } else {
                        nextLon = points[totalSegments][0];
                        nextLat = points[totalSegments][1];
                    }
                    drone.fleet_mission.progress = newProgress;
                } else {
                    const speedMps = speedKmph * 0.6;
                    const headingRad = heading * (Math.PI / 180);
                    const metersPerDeg = 111320;
                    const deltaLat = (Math.cos(headingRad) * speedMps) / metersPerDeg;
                    const deltaLon = (Math.sin(headingRad) * speedMps) / (metersPerDeg * Math.cos(drone.navigation.lat * (Math.PI / 180)));
                    nextLat += deltaLat;
                    nextLon += deltaLon;
                    heading += (Math.random() * 2 - 1);
                }

                // Use original mock speed as baseline if available, or fall back to current
                const baseSpeed = mockDrones.find(d => d.drone_id === drone.drone_id)?.navigation.ground_speed || 4.2;
                const droneSeed = drone.drone_id.split('-').pop() || '1';
                const seedNum = parseInt(droneSeed) || 1;

                return {
                    ...drone,
                    fleet_mission: drone.fleet_mission,
                    navigation: {
                        ...drone.navigation,
                        lat: nextLat,
                        lon: nextLon,
                        heading: heading,
                        pitch: (Math.sin(Date.now() / (2500 + seedNum * 100)) * 6),
                        roll: (Math.cos(Date.now() / (3500 + seedNum * 150)) * 12),
                        ground_speed: baseSpeed + (Math.sin(Date.now() / (4000 + seedNum * 200)) * (0.5 + seedNum * 0.1))
                    },
                    status: {
                        ...drone.status,
                        battery_pct: Math.max(0, drone.status.battery_pct - 0.001)
                    }
                };
            }));
        }, 200);

        return () => clearInterval(movementSim);
    }, [drones.length]);

    // Weather Fetching
    const fetchWeather = useCallback(async () => {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,wind_speed_10m,weather_code');
            const data = await response.json();
            const wmoMap: Record<number, string> = {
                0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
                45: 'Fog', 48: 'Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Drizzle',
                61: 'Rain', 63: 'Rain', 65: 'Heavy Rain', 95: 'Thunderstorm'
            };
            setWeatherData({
                temp: data.current.temperature_2m.toFixed(1),
                condition: wmoMap[data.current.weather_code] || 'Unknown',
                wind: data.current.wind_speed_10m.toFixed(1)
            });
        } catch (error) {
            console.error("Weather fetch error:", error);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
        const tid = setInterval(fetchWeather, 600000);
        return () => clearInterval(tid);
    }, [fetchWeather]);

    const handleCommand = (cmd: string) => {
        if (cmd === 'HALT ALL') {
            setFleetStats(s => ({ ...s, active: s.active + s.delivering, delivering: 0 }));
        } else if (cmd === 'RECALL') {
            setFleetStats({ active: 0, delivering: 0, standby: 9 });
        }
        setOperationStage(prev => (prev < 3 ? prev + 1 : 1));
    };

    return {
        drones,
        setDrones,
        weatherData,
        fleetStats,
        operationStage,
        handleCommand
    };
}
