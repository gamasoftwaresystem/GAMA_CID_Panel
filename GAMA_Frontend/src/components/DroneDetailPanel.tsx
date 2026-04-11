import { useState, useEffect, useRef } from 'react';
import { Drone } from '../types';
import { AlertTriangle, Battery, Maximize2, X, Activity } from 'lucide-react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface DroneDetailProps {
    drone: Drone;
    onClose: () => void;
}

export default function DroneDetailPanel({ drone, onClose }: DroneDetailProps) {
    const [isManualMode, setIsManualMode] = useState(drone.status.mode === 'MANUAL');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

    // UI Interaction States
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isKilled, setIsKilled] = useState(false);
    const [joyLeft, setJoyLeft] = useState({ x: 0, y: 0 });
    const [joyRight, setJoyRight] = useState({ x: 0, y: 0 });

    const handleJoyMove = (e: React.PointerEvent, side: 'left' | 'right') => {
        if (!e.buttons) return;
        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 35) {
            dx = (dx / distance) * 35;
            dy = (dy / distance) * 35;
        }

        if (side === 'left') setJoyLeft({ x: dx, y: dy });
        else setJoyRight({ x: dx, y: dy });

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleJoyEnd = (e: React.PointerEvent, side: 'left' | 'right') => {
        if (side === 'left') setJoyLeft({ x: 0, y: 0 });
        else setJoyRight({ x: 0, y: 0 });
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Initialize high-performance WebGL backend
    useEffect(() => {
        const initTF = async () => {
            try {
                // Try forcing GPU hardware-acceleration
                await import('@tensorflow/tfjs').then(tf => tf.setBackend('webgl'));
            } catch (e) {
                console.warn("WebGL not available, defaulting to CPU");
            }

            cocoSsd.load({ base: 'mobilenet_v2' }).then(loadedModel => {
                setModel(loadedModel);
                console.log("TensorFlow COCO-SSD (mobilenet_v2) is optimized and ready.");
            });
        };
        initTF();
    }, []);

    // TFJS Processing Loop
    useEffect(() => {
        if (!model || !videoRef.current || !overlayRef.current) return;

        const video = videoRef.current;
        const overlay = overlayRef.current;
        const ctx = overlay.getContext('2d');
        let isRunning = true;

        const processVideo = async () => {
            if (!isRunning) return;

            try {
                if (video.paused || video.ended || video.videoWidth === 0) {
                    requestAnimationFrame(processVideo);
                    return;
                }

                // Match canvas to actual video element size on screen
                if (overlay.width !== video.clientWidth) overlay.width = video.clientWidth;
                if (overlay.height !== video.clientHeight) overlay.height = video.clientHeight;

                // TFJS is heavy! To avoid lag (`kasma`) we limit detection to 25 objects
                // and use a very low minScore (0.20) because high altitude drone objects are tiny
                const predictions = await model.detect(video, 25, 0.20);

                if (ctx && isRunning) {
                    ctx.clearRect(0, 0, overlay.width, overlay.height);

                    const scaleX = overlay.width / video.videoWidth;
                    const scaleY = overlay.height / video.videoHeight;

                    predictions.forEach(prediction => {
                        const [x, y, width, height] = prediction.bbox;

                        // Scale bbox to canvas
                        const targetX = x * scaleX;
                        const targetY = y * scaleY;
                        const targetW = width * scaleX;
                        const targetH = height * scaleY;

                        // Draw bbox
                        ctx.strokeStyle = '#5eead4'; // hud-accent
                        ctx.lineWidth = 2;
                        ctx.strokeRect(targetX, targetY, targetW, targetH);

                        // Draw AI Label
                        ctx.fillStyle = '#5eead4';
                        ctx.font = 'bold 10px Inter';
                        const label = `${prediction.class.toUpperCase()} ${Math.round(prediction.score * 100)}%`;
                        ctx.fillText(label, targetX, targetY - 5);

                        // Crosshair center
                        const cx = targetX + targetW / 2;
                        const cy = targetY + targetH / 2;
                        ctx.beginPath();
                        ctx.moveTo(cx - 5, cy);
                        ctx.lineTo(cx + 5, cy);
                        ctx.moveTo(cx, cy - 5);
                        ctx.lineTo(cx, cy + 5);
                        ctx.stroke();
                    });
                }
            } catch (err) {
                console.error("TF Error:", err);
            }

            // Let the browser handle standard frame rendering rates instead of forced setTimeout
            // This prevents Tauri's WKWebView from choking on micro-task queue overflow
            if (isRunning) {
                setTimeout(() => {
                    requestAnimationFrame(processVideo);
                }, 100); // 10 FPS is plenty for a UI monitoring feed
            }
        };

        video.addEventListener('playing', () => {
            requestAnimationFrame(processVideo);
        });

        // Start if already playing
        if (!video.paused) {
            requestAnimationFrame(processVideo);
        }

        return () => {
            isRunning = false;
        };
    }, [model]);

    return (
        <div className={`glass-panel p-0 flex flex-col pointer-events-auto overflow-hidden relative group transition-all duration-300 ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-50 rounded-none' : 'w-[1100px] h-[750px]'}`}>
            {/* Header Bar */}
            <div className="h-14 bg-black/40 border-b border-white/5 flex items-center justify-between px-6 z-20 shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-hud-accent animate-pulse shadow-[0_0_8px_var(--color-hud-accent)]"></span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">{drone.drone_id} COMMAND LAYER</h2>
                        {!model && <span className="text-[9px] text-hud-warning ml-2">LOADING NEURAL MODEL...</span>}
                    </div>
                </div>

                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setIsManualMode(true)}
                        className={`px-6 py-1 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${isManualMode ? 'bg-hud-accent text-black shadow-[0_0_15px_rgba(94,234,212,0.3)]' : 'text-hud-text-muted hover:text-white'}`}>
                        Manual
                    </button>
                    <button
                        onClick={() => setIsManualMode(false)}
                        className={`px-6 py-1 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${!isManualMode ? 'bg-hud-accent text-black shadow-[0_0_15px_rgba(94,234,212,0.3)]' : 'text-hud-text-muted hover:text-white'}`}>
                        Auto
                    </button>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-hud-text-muted hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-hud-danger/10 hover:bg-hud-danger/30 flex items-center justify-center text-hud-danger border border-hud-danger/20 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex w-full h-[calc(100%-56px)] bg-black/20">
                {/* Sidebar Stats Area - Tactical Readout */}
                <div className="w-[280px] bg-black/40 backdrop-blur-xl flex flex-col overflow-y-auto custom-scrollbar border-r border-white/5 p-5 z-10">
                    <div className="space-y-6">
                        {/* Primary Telemetry */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-hud-accent/40 mb-2 flex items-center">
                                <Activity className="w-2.5 h-2.5 mr-2" /> Live Telemetry
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-hud-text-muted uppercase tracking-widest">Altitude (AGL)</span>
                                        <span className="text-lg font-black text-white font-mono">{drone.navigation.alt_relative.toFixed(1)}<span className="text-[10px] ml-1 opacity-30">M</span></span>
                                    </div>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-hud-accent/60" style={{ width: `${Math.min((drone.navigation.alt_relative / 120) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-hud-text-muted uppercase tracking-widest">Ground Speed</span>
                                        <span className="text-lg font-black text-white font-mono">{drone.navigation.ground_speed.toFixed(1)}<span className="text-[10px] ml-1 opacity-30">KM/H</span></span>
                                    </div>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-hud-accent/60" style={{ width: `${Math.min((drone.navigation.ground_speed / 60) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Power */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-hud-accent/40 mb-2 flex items-center">
                                <Battery className="w-2.5 h-2.5 mr-2" /> Power Source
                            </h3>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xl font-black text-white font-mono">{drone.status.battery_pct.toFixed(0)}%</span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${drone.status.battery_pct > 20 ? 'text-hud-accent/80 border-hud-accent/10' : 'text-hud-danger border-hud-danger/20 animate-pulse'}`}>
                                        {drone.status.battery_pct > 20 ? 'STABLE' : 'CRITICAL'}
                                    </span>
                                </div>
                                <div className="flex gap-0.5 h-1.5">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-sm transition-all duration-700 ${drone.status.battery_pct > (i * 10)
                                                ? (drone.status.battery_pct < 20 ? 'bg-hud-danger/80' : 'bg-hud-accent/60')
                                                : 'bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Intelligence Feed */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-hud-accent/40 mb-2 flex items-center">
                                <Activity className="w-2.5 h-2.5 mr-2" /> AI Analytics
                            </h3>
                            <div className="space-y-2">
                                <div className={`p-3 rounded-xl border transition-all ${drone.ai_analytics.target_locked ? 'bg-hud-danger/5 border-hud-danger/20' : 'bg-white/[0.01] border-white/5'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-hud-text-muted">Target Recognition</span>
                                        <span className={`text-[9px] font-black tracking-widest uppercase ${drone.ai_analytics.target_locked ? 'text-hud-danger' : 'text-white/40'}`}>
                                            {drone.ai_analytics.target_locked ? 'LOCKED' : 'IDLE'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-black/10 rounded-xl border border-white/5 p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[8px] font-bold text-hud-text-muted uppercase tracking-widest">Detections</span>
                                        <span className="text-[9px] font-mono text-hud-accent/60 font-bold">{drone.ai_analytics.detections.length} NODES</span>
                                    </div>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                        {drone.ai_analytics.detections.length > 0 ? (
                                            drone.ai_analytics.detections.map((det, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg border border-white/5">
                                                    <span className="text-[9px] uppercase font-bold text-white/60">{det.class}</span>
                                                    <span className="text-[8px] font-mono text-hud-accent/40">{Math.round(det.confidence * 100)}%</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-2 opacity-20 text-center">
                                                <span className="text-[8px] font-bold uppercase tracking-widest italic">Scanning...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Commands */}
                        <div className="pt-4 mt-auto">
                            <button
                                onClick={() => setIsKilled(true)}
                                className="w-full bg-hud-danger/5 hover:bg-hud-danger/10 border border-hud-danger/20 py-3 rounded-xl transition-all active:scale-95 group"
                            >
                                <span className="text-[9px] font-black text-hud-danger/60 group-hover:text-hud-danger uppercase tracking-[0.2em]">Terminate Session</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Video & Controls Area */}
                <div className="flex-1 flex flex-col h-full bg-black/40 p-4 space-y-4 relative">
                    <div className={`w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isManualMode ? 'h-[60%]' : 'h-full flex-1'}`}>
                        <video
                            ref={videoRef}
                            src="/demovideo.mp4#t=13"
                            autoPlay
                            muted
                            loop
                            crossOrigin="anonymous"
                            playsInline
                            className="w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                        {/* OpenCV Overlay Canvas */}
                        <canvas
                            ref={overlayRef}
                            className="absolute inset-0 z-30 pointer-events-none mix-blend-screen"
                        />

                        {/* Invisible processing canvas */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* HUD Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]"></div>

                        {/* Static Noise Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                        {/* Vignette */}
                        <div className="absolute inset-0 pointer-events-none z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] border-[20px] border-black/10"></div>

                        {/* Tactical HUD Overlays - Top Corners */}
                        <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col border-l-2 border-hud-accent/60 pl-4 bg-black/20 backdrop-blur-sm p-4 rounded-r-xl border-y border-r border-white/5">
                                    <span className="text-[9px] font-black text-hud-accent uppercase tracking-[0.3em] mb-1">Optical Feed</span>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/50 leading-tight">RES: 3840x2160</span>
                                            <span className="text-[10px] text-white/50 leading-tight">FPS: 60.00</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 bg-hud-danger/20 px-2 py-0.5 rounded border border-hud-danger/40 animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-hud-danger"></div>
                                            <span className="text-[8px] font-black text-hud-danger uppercase">REC</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right border-r-2 border-hud-accent/60 pr-4 bg-black/20 backdrop-blur-sm p-4 rounded-l-xl border-y border-l border-white/5">
                                    <span className="text-[10px] font-mono text-hud-accent/80 font-bold block">41.0082° N</span>
                                    <span className="text-[10px] font-mono text-hud-accent/80 font-bold block">28.9784° E</span>
                                    <span className="text-[10px] font-mono text-white/40 block mt-1 uppercase">Sat-Fix: Good</span>
                                </div>
                            </div>

                            {/* Mission Status Center Bottom (Floating) */}
                            <div className="flex justify-center">
                                <div className="bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 flex items-center space-x-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Heading</span>
                                        <span className="text-sm font-mono text-hud-accent font-black">284° NW</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-2">Mission Phase</span>
                                        <div className="flex items-center gap-2 px-6 py-1.5 rounded-full bg-[#0c0c0c] border border-hud-accent/20 shadow-lg transition-all duration-300">
                                            <div className="w-2 h-2 rounded-sm bg-hud-accent rotate-45 shadow-[0_0_8px_rgba(94,234,212,0.4)]" />
                                            <span className="text-[10px] text-hud-accent font-black uppercase tracking-[0.2em]">{drone.status.mission_state}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Signal</span>
                                        <div className="flex space-x-0.5 mt-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`w-1 h-2 rounded-full ${i < 3 ? 'bg-hud-accent' : 'bg-white/10'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

                        {/* Kill Switch Overlay */}
                        {isKilled && (
                            <div className="absolute inset-0 bg-hud-danger/40 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
                                <AlertTriangle className="w-24 h-24 text-white mb-6 animate-pulse" />
                                <h2 className="text-4xl font-bold text-white uppercase tracking-widest mb-2 shadow-black drop-shadow-lg">CONNECTION LOST</h2>
                                <p className="text-white/80 font-mono tracking-widest shadow-black drop-shadow-lg">SYSTEM TERMINATED</p>
                            </div>
                        )}
                    </div>

                    {isManualMode && (
                        <div className="h-[40%] w-full bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-4 pt-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-300 shadow-2xl relative overflow-hidden">
                            {/* Glass highlights */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                            <div className="flex justify-between items-center w-full max-w-5xl mx-auto h-full px-6 relative z-10">

                                {/* Left Stick: Movement */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full border-2 border-white/10 bg-black/40 relative flex items-center justify-center shadow-inner group">
                                        <div className="absolute inset-2 rounded-full border border-white/[0.03]"></div>
                                        <div className="absolute w-full h-px bg-white/5"></div>
                                        <div className="absolute w-px h-full bg-white/5"></div>
                                        {/* Left Joystick head */}
                                        <div
                                            onPointerDown={(e) => handleJoyMove(e, 'left')}
                                            onPointerMove={(e) => handleJoyMove(e, 'left')}
                                            onPointerUp={(e) => handleJoyEnd(e, 'left')}
                                            onPointerCancel={(e) => handleJoyEnd(e, 'left')}
                                            className="w-14 h-14 rounded-full bg-gradient-to-br from-hud-accent/20 to-hud-accent/5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing border-2 border-hud-accent/40 flex items-center justify-center absolute transition-none touch-none z-20 group-active:border-hud-accent"
                                            style={{ transform: `translate(${joyLeft.x}px, ${joyLeft.y}px)` }}>
                                            <div className="w-4 h-4 rounded-full bg-hud-accent shadow-[0_0_15px_var(--color-hud-accent)]"></div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-hud-accent/60 font-black tracking-[0.2em] mt-4 uppercase">Pitch / Roll</span>
                                </div>

                                {/* Center Gauges - Tactical Design */}
                                <div className="flex space-x-8 items-center bg-black/20 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                                    {/* Pitch Gauge */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="264" strokeDashoffset={264 - (Math.abs(joyLeft.y) / 35) * 264} className="text-blue-500 transition-all duration-75" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-lg font-mono font-black text-white">
                                                    {((-joyLeft.y / 35) * 45).toFixed(0)}°
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/40 font-black tracking-widest uppercase mt-2">Pitch</span>
                                    </div>

                                    {/* Yaw Gauge */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                                                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="264" strokeDashoffset={264 - (Math.abs(joyRight.x) / 35) * 264} className="text-hud-accent transition-all duration-75" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-lg font-mono font-black text-white">
                                                    {((joyRight.x / 35) * 45).toFixed(0)}°
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/40 font-black tracking-widest uppercase mt-2">Yaw</span>
                                    </div>
                                </div>

                                {/* Right Stick: Camera */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-hud-text-muted font-black tracking-[0.3em] uppercase mb-4 opacity-80">Gimbal Logic</span>
                                    <div className="w-32 h-32 rounded-full border-2 border-white/10 bg-black/40 relative flex items-center justify-center shadow-inner group">
                                        <div className="absolute inset-2 rounded-full border border-white/[0.03]"></div>
                                        <div className="absolute w-full h-px bg-white/5"></div>
                                        <div className="absolute w-px h-full bg-white/5"></div>
                                        {/* Right Joystick head */}
                                        <div
                                            onPointerDown={(e) => handleJoyMove(e, 'right')}
                                            onPointerMove={(e) => handleJoyMove(e, 'right')}
                                            onPointerUp={(e) => handleJoyEnd(e, 'right')}
                                            onPointerCancel={(e) => handleJoyEnd(e, 'right')}
                                            className="w-14 h-14 rounded-full bg-gradient-to-br from-hud-accent/20 to-hud-accent/5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing border-2 border-hud-accent/40 flex items-center justify-center absolute transition-none touch-none z-20 group-active:border-hud-accent"
                                            style={{ transform: `translate(${joyRight.x}px, ${joyRight.y}px)` }}>
                                            <div className="w-4 h-4 rounded-full bg-hud-accent shadow-[0_0_15px_var(--color-hud-accent)]"></div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-hud-accent/60 font-black tracking-[0.2em] mt-4 uppercase">Pan / Tilt</span>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
