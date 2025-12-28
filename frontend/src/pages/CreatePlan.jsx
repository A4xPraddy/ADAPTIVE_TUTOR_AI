import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Target, Calendar, User, 
  ArrowRight, Loader2, Zap, GraduationCap, 
  ChevronLeft, LayoutGrid 
} from 'lucide-react';
import axios from 'axios';

export default function CreatePlan() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        level: 'beginner',
        total_days: 7, 
        learner_name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/start-learning', formData);
            navigate('/view-plan', { state: { studyPlan: response.data.study_plan } });
        } catch (error) {
            console.error(error);
            alert("Mentor Neural-Link failed. Ensure backend is running on port 8000");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 text-white overflow-hidden relative">
            
            {/* --- 1. DYNAMIC BACKGROUND ANIMATION --- */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full"
                />
            </div>

            {/* --- 2. TOP BRANDING HEADER --- */}
            <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="bg-gradient-to-br from-blue-600 to-emerald-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">
                        LEARN<span className="text-blue-500">LAB</span> <span className="text-slate-500 font-light">AI</span>
                    </h1>
                </motion.div>
                
                <button 
                    onClick={() => navigate('/')}
                    className="bg-slate-800/50 hover:bg-slate-700 p-3 rounded-2xl border border-slate-700 transition-all"
                >
                    <LayoutGrid size={20} className="text-slate-400" />
                </button>
            </nav>

            {/* --- 3. MAIN FORM CARD --- */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl z-10 relative"
            >
                <div className="text-center mb-12">
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="inline-block p-4 bg-blue-500/10 rounded-3xl mb-6 border border-blue-500/20"
                    >
                        <Zap className="text-blue-400 w-10 h-10" fill="currentColor" />
                    </motion.div>
                    <h2 className="text-5xl font-black text-white mb-3 tracking-tight">
                        Ignite Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Mastery</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide">
                        Precision-engineered learning paths in seconds.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                            <User size={12} className="text-blue-500" /> Identity
                        </label>
                        <input 
                            required type="text"
                            placeholder="How should the AI address you?"
                            className="w-full bg-slate-800/40 border-2 border-slate-800 focus:border-blue-500/50 rounded-2xl p-5 text-white outline-none transition-all placeholder:text-slate-600"
                            onChange={(e) => setFormData({...formData, learner_name: e.target.value})}
                        />
                    </div>

                    {/* Subject Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                            <Target size={12} className="text-emerald-500" /> Objective
                        </label>
                        <input 
                            required type="text"
                            placeholder="e.g. Master React in 2026"
                            className="w-full bg-slate-800/40 border-2 border-slate-800 focus:border-emerald-500/50 rounded-2xl p-5 text-white outline-none transition-all placeholder:text-slate-600"
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Complexity</label>
                            <select 
                                className="w-full bg-slate-800/40 border-2 border-slate-800 focus:border-blue-500/50 rounded-2xl p-5 text-white outline-none appearance-none cursor-pointer"
                                onChange={(e) => setFormData({...formData, level: e.target.value})}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Duration (Days)</label>
                            <input 
                                required type="number" min="1" max="30"
                                className="w-full bg-slate-800/40 border-2 border-slate-800 focus:border-blue-500/50 rounded-2xl p-5 text-white outline-none transition-all"
                                value={formData.total_days}
                                onChange={(e) => setFormData({...formData, total_days: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[1.5rem] font-black text-white flex items-center justify-center gap-4 transition-all shadow-xl shadow-blue-900/40 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                GENERATE JOURNEY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>

            {/* --- 4. BACK BUTTON --- */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate(-1)}
                className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold uppercase tracking-widest z-10"
            >
                <ChevronLeft size={16} /> Return to previous
            </motion.button>
        </div>
    );
}