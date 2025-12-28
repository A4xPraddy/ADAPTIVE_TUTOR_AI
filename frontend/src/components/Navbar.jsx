import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Zap, 
  Home, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the landing page
    const isHome = location.pathname === '/';

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 pointer-events-none">
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="max-w-6xl mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] px-10 h-20 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto"
            >
                {/* BRAND LOGO SECTION */}
                <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
                        />
                        <div className="relative bg-gradient-to-br from-blue-600 to-emerald-500 p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                            Adaptive Tutor AI
                        </h1>
                        <span className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-1">
                            Neural Learning Engine
                        </span>
                    </div>
                </div>

                {/* NAVIGATION ACTIONS */}
                <div className="flex items-center gap-2">
                    {!isHome && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/create-plan')}
                            className="hidden md:flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border border-blue-500/20 transition-all"
                        >
                            <Zap size={14} fill="currentColor" /> NEW MISSION
                        </motion.button>
                    )}

                    <div className="w-[1px] h-6 bg-slate-800 mx-4 hidden md:block" />

                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-2xl border border-slate-700 transition-all text-slate-400 hover:text-white"
                            title="Home"
                        >
                            <Home size={20} />
                        </button>
                        
                        <button 
                            className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-2xl border border-slate-700 transition-all text-slate-400"
                            title="Profile"
                        >
                            <ShieldCheck size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
}