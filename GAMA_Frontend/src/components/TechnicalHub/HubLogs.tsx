import { useState, useEffect, useRef } from 'react';
import { Drone } from '../../types';

interface LogEntry {
    id: string;
    timestamp: string;
    category: 'NAV' | 'COMM' | 'PROP' | 'BATT' | 'SYS';
    message: string;
    level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
}

interface HubLogsProps {
    drone: Drone;
}

export default function HubLogs({ drone }: HubLogsProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const generateLog = () => {
        const categories: LogEntry['category'][] = ['NAV', 'COMM', 'PROP', 'BATT', 'SYS'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        let message = '';
        let level: LogEntry['level'] = 'INFO';

        switch (category) {
            case 'NAV':
                const accuracy = (0.1 + Math.random() * 0.2).toFixed(2);
                message = `GPS POSITIONAL ACCURACY: < ${accuracy}m`;
                level = Math.random() > 0.9 ? 'SUCCESS' : 'INFO';
                break;
            case 'COMM':
                const latency = (Math.random() * 60 + 20).toFixed(0);
                message = `ENCRYPTED LINK STABLE - ${latency}ms LNC`;
                level = 'INFO';
                break;
            case 'PROP':
                const rpm = (8000 + Math.random() * 1000).toFixed(0);
                message = `MOTOR RPM NOMINAL: ${rpm}`;
                level = 'INFO';
                break;
            case 'BATT':
                const current = (12 + Math.random() * 8).toFixed(1);
                message = `DISCHARGE RATE: ${current}A`;
                level = current > '18' ? 'WARN' : 'INFO';
                break;
            case 'SYS':
                message = 'HEARTBEAT PULSE - OK';
                level = 'SUCCESS';
                break;
        }

        const now = new Date();
        const timestamp = now.toLocaleTimeString('tr-TR', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0').slice(0, 2);

        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp,
            category,
            message,
            level
        };

        setLogs(prev => [...prev.slice(-38), newLog]);
    };

    useEffect(() => {
        // Initial set of logs
        for(let i=0; i<15; i++) {
            generateLog();
        }

        const interval = setInterval(generateLog, 1200 + Math.random() * 800);
        return () => clearInterval(interval);
    }, [drone.drone_id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLevelColor = (level: LogEntry['level']) => {
        switch (level) {
            case 'SUCCESS': return 'text-hud-accent';
            case 'WARN': return 'text-hud-warning';
            case 'ERROR': return 'text-hud-danger';
            default: return 'text-white/60';
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-black/40 rounded-2xl border border-white/5 overflow-hidden p-4 font-mono">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2 px-1">
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse" />
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Live Tactical Feed</span>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase">STREAMS: 4/5 ACTIVE</span>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-2"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 text-[9px] leading-tight animate-in fade-in slide-in-from-right-2 duration-300">
                        <span className="text-white/20 shrink-0 tabular-nums">[{log.timestamp}]</span>
                        <span className={`w-10 shrink-0 font-black ${getLevelColor(log.level)} opacity-80`}>
                            {log.category}
                        </span>
                        <span className={`flex-1 ${getLevelColor(log.level)} uppercase tracking-widest`}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[8px] font-black text-white/20">
                <span>BUFFER: {logs.length}/40</span>
                <span>DRONE_ID: {drone.drone_id}</span>
            </div>
        </div>
    );
}
