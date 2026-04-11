export interface DroneDetection {
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
}

export interface DroneStatus {
    mode: 'AUTO' | 'MANUAL' | 'RTL' | 'GUIDED';
    armed: boolean;
    health: 'GOOD' | 'WARNING' | 'CRITICAL';
    battery_pct: number;
    signal_dbm: number;
    mission_state?: 'IN_SERVICE' | 'PENDING' | 'RETURNING' | 'OUT_OF_SERVICE' | 'OFFLINE'; // Standardized statuses
}

export interface DroneNavigation {
    lat: number;
    lon: number;
    alt_relative: number;
    ground_speed: number;
    heading: number;
    pitch?: number;
    roll?: number;
}

export interface DroneAIAnalytics {
    detections: DroneDetection[];
    target_locked: boolean;
}

export interface DroneSensors {
    lidar_min_dist: number;
    cpu_temp: number;
}

export interface DroneFleetMission {
    start_point: [number, number]; // [lon, lat]
    end_point: [number, number]; // [lon, lat]
    route: [number, number][]; // LineString coords
    progress?: number; // Internal tracking (0 to 1) for frontend interpolation
}

export interface Drone {
    drone_id: string;
    timestamp: string;
    status: DroneStatus;
    navigation: DroneNavigation;
    ai_analytics: DroneAIAnalytics;
    sensors: DroneSensors;
    fleet_mission?: DroneFleetMission; // Static route data
}
