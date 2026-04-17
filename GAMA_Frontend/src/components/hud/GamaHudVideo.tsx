import { useEffect, useRef, useState } from 'react';
import { Drone } from '../../types';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Activity } from 'lucide-react';

interface GamaHudVideoProps {
    drone: Drone;
}

export default function GamaHudVideo({ drone: _drone }: GamaHudVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

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
            });
        };
        initTF();
    }, []);

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
                if (overlay.width !== video.clientWidth) overlay.width = video.clientWidth;
                if (overlay.height !== video.clientHeight) overlay.height = video.clientHeight;

                const predictions = await model.detect(video, 15, 0.25);

                if (ctx && isRunning) {
                    ctx.clearRect(0, 0, overlay.width, overlay.height);
                    const scaleX = overlay.width / video.videoWidth;
                    const scaleY = overlay.height / video.videoHeight;

                    predictions.forEach(prediction => {
                        const [x, y, width, height] = prediction.bbox;
                        const targetX = x * scaleX;
                        const targetY = y * scaleY;
                        const targetW = width * scaleX;
                        const targetH = height * scaleY;

                        ctx.strokeStyle = '#5eead4';
                        ctx.lineWidth = 1.5;
                        ctx.setLineDash([5, 3]);
                        ctx.strokeRect(targetX, targetY, targetW, targetH);
                        ctx.setLineDash([]);

                        ctx.fillStyle = '#5eead4';
                        ctx.font = 'bold 9px Inter';
                        ctx.fillText(`${prediction.class.toUpperCase()} ${Math.round(prediction.score * 100)}%`, targetX, targetY - 4);
                    });
                }
            } catch (err) { }
            if (isRunning) {
                setTimeout(() => requestAnimationFrame(processVideo), 100);
            }
        };

        if (!video.paused) requestAnimationFrame(processVideo);
        else video.addEventListener('playing', () => requestAnimationFrame(processVideo), { once: true });

        return () => { isRunning = false; };
    }, [model]);

    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
            <video
                ref={videoRef}
                src="/demovideo.mp4#t=13"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-90"
            />
            <canvas
                ref={overlayRef}
                className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
            />

            {/* Top Left Overlays - Minified */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-0.5 opacity-80 scale-90 origin-top-left">
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-hud-danger animate-pulse shadow-[0_0_8px_var(--color-hud-danger)]" />
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">HDR</span>
                </div>
                <div className="text-[9px] font-bold text-hud-warning tracking-tighter">
                    4K - 19.67 FPS
                </div>
            </div>

            {/* Top Right Controls - Minified */}
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity scale-90 origin-top-right">
                <button className="glass-panel w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <Activity className="w-3.5 h-3.5" />
                </button>
                <button className="glass-panel px-3 h-7 flex items-center text-[9px] font-black tracking-widest text-white/50 uppercase">
                    02:09
                </button>
            </div>

            {/* Left Level Indicator - Minified */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center scale-75">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 vertical-text">Level</span>
                <div className="w-1 h-24 bg-white/5 rounded-full relative overflow-hidden">
                    <div className="absolute top-1/4 w-full h-1/2 bg-hud-accent/40" />
                </div>
            </div>

            {/* Center Crosshair - Minified */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-30 scale-75">
                <div className="relative w-10 h-10">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/40" />
                    <div className="absolute left-1/2 top-0 w-px h-full bg-white/40" />
                    <div className="absolute inset-0 border border-white/20 rounded-full" />
                </div>
            </div>

            {/* Bottom Left Histogram/Signal - Minified */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2 scale-90 origin-bottom-left">
                <div className="flex space-x-1.5">
                    {['R', 'G', 'B', 'Y'].map(c => (
                        <button key={c} className="w-7 h-5 glass-panel flex items-center justify-center group/btn">
                            <div className={`w-1 h-1 rounded-full ${c === 'R' ? 'bg-red-500' : c === 'G' ? 'bg-green-500' : c === 'B' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                            <span className="text-[7px] font-black text-white/10 ml-1 group-hover/btn:text-white transition-colors">{c}</span>
                        </button>
                    ))}
                </div>
                <div className="glass-panel p-1.5 w-32 h-14 relative overflow-hidden flex items-end space-x-0.5">
                    <div className="absolute top-1.5 left-1.5 text-[7px] font-black text-white/20 uppercase tracking-widest">H2.85</div>
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-hud-accent/10 border-t border-hud-accent/20"
                            style={{ height: `${20 + Math.random() * 60}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Right Directional - Minified */}
            <div className="absolute bottom-4 right-4 z-20 scale-75 origin-bottom-right">
                <div className="relative w-16 h-16 rounded-full border border-white/5 bg-black/60 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-white italic">325°</span>
                        <span className="text-[8px] font-black text-hud-accent/40 uppercase tracking-widest">NW</span>
                    </div>
                </div>
            </div>

            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px]" />
        </div>
    );
}
