import { useState, useEffect, useRef } from 'react';
import { Drone } from '../types';
import { AlertTriangle, Battery, Maximize2, X, Activity, Navigation } from 'lucide-react';
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
                {/* Sidebar Stats Area */}
                <div className="w-[280px] bg-black/30 flex flex-col justify-between overflow-y-auto custom-scrollbar border-r border-white/5 p-5 z-10">
                    <div className="space-y-6">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-hud-text-muted flex items-center"><Navigation className="w-3.5 h-3.5 mr-2" /> Altitude</span>
                                <span className="font-mono text-white font-bold">{drone.navigation.alt_relative.toFixed(1)} m</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-hud-text-muted flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> Speed</span>
                                <span className="font-mono text-white font-bold">{drone.navigation.ground_speed.toFixed(1)} km/h</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-hud-text-muted mb-2 border-b border-white/5 pb-1">System Vital</h3>
                            <div className="space-y-2">
                                <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Battery className="w-3.5 h-3.5 text-hud-accent" />
                                        <span className="text-[10px] text-hud-text-muted uppercase tracking-wider font-semibold">Battery</span>
                                    </div>
                                    <span className="text-xs font-mono text-white">{drone.status.battery_pct.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-hud-text-muted mb-2 border-b border-white/5 pb-1">Intelligence</h3>
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] text-hud-text-muted uppercase tracking-wider font-semibold">Target Lock</span>
                                    <Activity className={`w-4 h-4 ${drone.ai_analytics.target_locked ? 'text-hud-danger animate-pulse' : 'text-hud-text-muted'}`} />
                                </div>
                                <span className={`text-xs font-bold ${drone.ai_analytics.target_locked ? 'text-hud-danger' : 'text-white/70'}`}>
                                    {drone.ai_analytics.target_locked ? 'ENGAGED' : 'SEARCHING'}
                                </span>
                            </div>

                            <div className="bg-black/30 p-3 rounded-xl border border-white/5 min-h-20">
                                <span className="text-[9px] text-hud-text-muted uppercase tracking-wider font-semibold flex items-center mb-2">
                                    Detections ({drone.ai_analytics.detections.length})
                                </span>
                                {drone.ai_analytics.detections.length > 0 ? (
                                    <div className="space-y-1.5">
                                        {drone.ai_analytics.detections.map((det, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                                                <span className="text-[10px] uppercase font-bold text-hud-accent">{det.class}</span>
                                                <span className="text-[10px] font-mono text-white/50">{Math.round(det.confidence * 100)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-hud-text-muted/50 italic text-center mt-4">No threats detected</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-hud-danger mb-3 border-b border-hud-danger/20 pb-1 flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1.5 text-hud-danger" /> Emergency Protocols
                            </h3>
                            <div className="space-y-2">
                                <button onClick={() => setIsKilled(true)} className="w-full bg-hud-danger/20 hover:bg-hud-danger/40 border border-hud-danger/40 text-hud-danger py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Kill Switch</button>
                            </div>
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
                            className="absolute inset-0 z-30 pointer-events-none"
                        />

                        {/* Invisible processing canvas */}
                        <canvas ref={canvasRef} className="hidden" />

                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                        {/* Kill Switch Overlay */}
                        {isKilled && (
                            <div className="absolute inset-0 bg-hud-danger/40 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
                                <AlertTriangle className="w-24 h-24 text-white mb-6 animate-pulse" />
                                <h2 className="text-4xl font-bold text-white uppercase tracking-widest mb-2 shadow-black drop-shadow-lg">CONNECTION LOST</h2>
                                <p className="text-white/80 font-mono tracking-widest shadow-black drop-shadow-lg">SYSTEM TERMINATED</p>
                            </div>
                        )}

                        <div className="absolute top-4 left-4 flex space-x-3 z-40">
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex space-x-3 text-[10px] uppercase font-bold tracking-widest text-white shadow-xl">
                                <span className="text-hud-accent">HDR</span>
                                <span className="w-px bg-white/20"></span>
                                <span>4K - 60 FPS</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 flex space-x-3 z-40">
                            <div className="bg-hud-danger/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-hud-danger flex space-x-2 text-[10px] uppercase font-bold tracking-widest text-white shadow-xl animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-white self-center"></span>
                                <span>REC 00:02:24</span>
                            </div>
                        </div>
                    </div>

                    {isManualMode && (
                        <div className="h-[40%] w-full bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-4 pt-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-300 shadow-2xl relative overflow-hidden">
                            {/* Glass highlights */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                            <div className="flex justify-between items-center w-full max-w-5xl mx-auto h-full px-6 relative z-10">

                                {/* Left Stick: Movement */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-hud-text-muted font-bold tracking-widest uppercase mb-4 opacity-80">Movement</span>
                                    <div className="w-28 h-28 rounded-full border-2 border-white/20 bg-white/5 relative flex items-center justify-center shadow-inner">
                                        <div className="absolute w-full h-[1px] bg-white/10"></div>
                                        {/* Left Joystick head */}
                                        <div
                                            onPointerDown={(e) => handleJoyMove(e, 'left')}
                                            onPointerMove={(e) => handleJoyMove(e, 'left')}
                                            onPointerUp={(e) => handleJoyEnd(e, 'left')}
                                            onPointerCancel={(e) => handleJoyEnd(e, 'left')}
                                            className="w-10 h-10 rounded-full bg-[#1e40af] shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing border border-blue-400/50 flex items-center justify-center absolute transition-none touch-none"
                                            style={{ transform: `translate(${joyLeft.x}px, ${joyLeft.y}px)` }}>
                                            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-white/50 font-bold tracking-widest mt-4">Roll / Pitch</span>
                                </div>

                                {/* Center Gauges */}
                                <div className="flex space-x-6 items-center translate-y-2">
                                    {/* Pitch Gauge */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full border-[6px] border-white/10 border-t-[#3b82f6] bg-black/40 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] mb-3 transition-transform duration-75"
                                            style={{ transform: `rotate(${-joyLeft.y}deg)` }}>
                                            <span className="text-sm font-mono font-bold text-white transition-transform duration-75" style={{ transform: `rotate(${joyLeft.y}deg)` }}>
                                                {((-joyLeft.y / 35) * 15).toFixed(1)}°
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-white/50 font-bold tracking-widest uppercase">Pitch</span>
                                    </div>

                                    {/* Roll Gauge */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full border-[6px] border-white/10 border-r-[#22c55e] bg-black/40 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] mb-3 transition-transform duration-75"
                                            style={{ transform: `rotate(${joyLeft.x}deg)` }}>
                                            <span className="text-sm font-mono font-bold text-white transition-transform duration-75" style={{ transform: `rotate(${-joyLeft.x}deg)` }}>
                                                {((joyLeft.x / 35) * 15).toFixed(1)}°
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-white/50 font-bold tracking-widest uppercase">Roll</span>
                                    </div>

                                    {/* Yaw Gauge */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full border-[6px] border-white/10 border-l-[#ef4444] bg-black/40 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] mb-3 transition-transform duration-75"
                                            style={{ transform: `rotate(${joyRight.x}deg)` }}>
                                            <span className="text-sm font-mono font-bold text-white transition-transform duration-75" style={{ transform: `rotate(${-joyRight.x}deg)` }}>
                                                {((joyRight.x / 35) * 15).toFixed(1)}°
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-white/50 font-bold tracking-widest uppercase">Yaw</span>
                                    </div>
                                </div>

                                {/* Right Stick: Camera */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-hud-text-muted font-bold tracking-widest uppercase mb-4 opacity-80">Camera</span>
                                    <div className="w-28 h-28 rounded-full border-2 border-white/20 bg-white/5 relative flex items-center justify-center shadow-inner">
                                        <div className="absolute w-full h-[1px] bg-white/10"></div>
                                        {/* Right Joystick head */}
                                        <div
                                            onPointerDown={(e) => handleJoyMove(e, 'right')}
                                            onPointerMove={(e) => handleJoyMove(e, 'right')}
                                            onPointerUp={(e) => handleJoyEnd(e, 'right')}
                                            onPointerCancel={(e) => handleJoyEnd(e, 'right')}
                                            className="w-10 h-10 rounded-full bg-[#1e40af] shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing border border-blue-400/50 flex items-center justify-center absolute transition-none touch-none"
                                            style={{ transform: `translate(${joyRight.x}px, ${joyRight.y}px)` }}>
                                            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-white/50 font-bold tracking-widest mt-4">Pan / Tilt</span>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
