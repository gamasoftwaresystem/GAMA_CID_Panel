import { useState } from "react";
import { User, UserRole } from "../../types";
import { Shield, Lock, User as UserIcon, Loader2 } from "lucide-react";

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated Authentication
    setTimeout(() => {
      let role: UserRole | null = null;
      let assignedDroneId: string | undefined = undefined;

      const lowerUser = username.toLowerCase();
      
      if (lowerUser === "pilot1" && password === "gama123") {
        role = "pilot";
        assignedDroneId = "GAMA-01";
      } else if (lowerUser === "pilot2" && password === "gama123") {
        role = "pilot";
        assignedDroneId = "GAMA-02";
      } else if (lowerUser === "pilot" && password === "gama123") {
        role = "pilot";
        assignedDroneId = "GAMA-03";
      } else if (lowerUser === "admin" && password === "gama123") {
        role = "operator";
      }

      if (role) {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          username: username.charAt(0).toUpperCase() + username.slice(1),
          role: role,
          lastLogin: new Date().toISOString(),
          assignedDroneId: assignedDroneId,
        });
      } else {
        setError("INVALID CREDENTIALS. ACCESS DENIED.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-hud-bg overflow-hidden relative">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          src="/demovideo.mp4"
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-20 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hud-bg/80 via-transparent to-hud-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,15,0.8)_100%)]" />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(94,234,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(94,234,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Login Card */}
      <div className="w-full max-w-md z-10 p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="glass-panel p-8 relative overflow-hidden group">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hud-accent to-transparent opacity-50" />
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-hud-accent/20 rounded-full animate-ping" />
              <div className="relative glass-panel rounded-full w-full h-full flex items-center justify-center border-hud-accent/30">
                <Shield className="w-10 h-10 text-hud-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-[0.3em] text-white uppercase mb-2">GAMA CID</h1>
            <p className="text-[10px] text-hud-accent/60 font-bold tracking-[0.2em] uppercase">Fleet Intelligence & Control System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <UserIcon className="w-4 h-4 text-hud-accent/40 group-focus-within:text-hud-accent transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-hud-accent/50 focus:ring-1 focus:ring-hud-accent/20 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-hud-accent/40 group-focus-within:text-hud-accent transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="REDACTED PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-hud-accent/50 focus:ring-1 focus:ring-hud-accent/20 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-hud-danger/10 border border-hud-danger/30 p-3 rounded-lg flex items-center space-x-3 animate-in shake duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-hud-danger animate-pulse" />
                <span className="text-[10px] font-black text-hud-danger tracking-tighter">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hud-accent/80 hover:bg-hud-accent text-black font-black text-[11px] tracking-[0.2em] uppercase py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(94,234,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Establish Connection"
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
            <span className="text-[8px] font-bold tracking-widest uppercase">Secured by GAMA-CID V3</span>
            <span className="text-[8px] font-bold tracking-widest uppercase">Station 404</span>
          </div>
        </div>
      </div>

      {/* Version & Build */}
      <div className="absolute bottom-8 right-8 text-right opacity-20">
        <p className="text-[8px] font-black tracking-widest text-white uppercase">Build b729-prod</p>
        <p className="text-[8px] font-bold tracking-widest text-hud-accent uppercase">Protocol v19.4</p>
      </div>
    </div>
  );
}
