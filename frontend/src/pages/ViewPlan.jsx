import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Play, MessageSquare, BrainCircuit, 
  ArrowLeft, Calendar, ChevronRight, Zap, GraduationCap,
  Target, Award
} from 'lucide-react';
import axios from 'axios';
import ModernBrief from '../components/ModernBrief';

export default function ViewPlan() {
    const location = useLocation();
    const navigate = useNavigate();
    const studyPlan = location.state?.studyPlan;
    
    const [currentDay, setCurrentDay] = useState(1);
    const [selectedBrief, setSelectedBrief] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!studyPlan) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <button onClick={() => navigate('/create-plan')} className="bg-blue-600 px-8 py-3 rounded-2xl font-bold text-white shadow-xl shadow-blue-900/40">
                INITIATE NEW PATH
            </button>
        </div>
    );

    // Map modules to a Daily Timeline
    const allDays = studyPlan.modules.map((m) => ({
        id: m.id,
        task: m.title.replace(`Day ${m.id}: `, ''),
        fullTitle: m.title,
        objectives: m.learning_objectives,
    }));

    const todayTask = allDays.find(d => d.id === currentDay) || allDays[0];

    const fetchDetail = async (topic) => {
        setLoading(true);
        setSelectedBrief(null);
        try {
            const res = await axios.post('http://localhost:8000/get-topic-brief', { topic });
            setSelectedBrief(res.data.brief);
        } catch (err) { 
            alert("Mentor Neural-Link offline. Please retry."); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
            {/* --- 1. HIGH-TECH NAV BAR --- */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <button onClick={() => navigate('/create-plan')} className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reset Path</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-emerald-500 p-2 rounded-xl shadow-lg">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">
                            Learn<span className="text-blue-500">Lab</span> <span className="text-slate-500 font-light">AI</span>
                        </h1>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</span>
                        <span className="text-sm font-bold text-blue-400">{studyPlan.subject}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* --- 2. LEFT: TODAY'S MISSION FOCUS --- */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div 
                            key={currentDay}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group"
                        >
                            {/* Neural Background Decor */}
                            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all duration-1000" />
                            
                            <div className="flex items-center gap-4 mb-10">
                                <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/30">
                                    Current Phase: {currentDay}
                                </span>
                                <div className="h-[1px] flex-1 bg-slate-800" />
                            </div>

                            <h2 className="text-5xl font-black text-white mb-8 leading-tight tracking-tight">
                                {todayTask.fullTitle}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Target size={14} className="text-emerald-500" /> Core Objectives
                                    </h4>
                                    <div className="space-y-3">
                                        {todayTask.objectives.map((obj, i) => (
                                            <motion.div 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                                                key={i} className="flex items-start gap-3 bg-slate-800/30 p-4 rounded-2xl border border-transparent hover:border-slate-700 transition-all"
                                            >
                                                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-sm font-medium text-slate-300">{obj}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* HUB OF TOOLS */}
                                <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 flex flex-col gap-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Interface Options</h4>
                                    
                                    <motion.button 
                                        whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => fetchDetail(todayTask.fullTitle)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-5 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 transition-all"
                                    >
                                        <Play size={18} fill="white" /> INITIALIZE LESSON
                                    </motion.button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => navigate('/solve-doubt', { state: { moduleId: todayTask.id, moduleTitle: todayTask.fullTitle } })}
                                            className="group flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-5 rounded-3xl border border-slate-700 transition-all"
                                        >
                                            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                                <MessageSquare size={22} className="text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Ask Tutor</span>
                                        </button>

                                        <button 
                                            onClick={() => navigate('/quiz', { state: { moduleId: todayTask.id } })}
                                            className="group flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-5 rounded-3xl border border-slate-700 transition-all"
                                        >
                                            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                                <BrainCircuit size={22} className="text-purple-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Self Assess</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* --- 3. DYNAMIC LESSON AREA --- */}
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="py-24 text-center space-y-6"
                                >
                                    <div className="w-14 h-14 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                                    <div className="space-y-2">
                                        <p className="text-blue-400 font-black tracking-[0.3em] text-[10px] uppercase">Neural-Link Synchronization</p>
                                        <p className="text-slate-500 text-xs italic">Downloading expert insights...</p>
                                    </div>
                                </motion.div>
                            ) : selectedBrief && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-12 backdrop-blur-md shadow-inner"
                                >
                                    <ModernBrief content={selectedBrief} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- 4. RIGHT: JOURNEY TIMELINE --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-[3rem] p-8 sticky top-28 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Timeline</h3>
                                <Award className="text-blue-500 w-5 h-5" />
                            </div>

                            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-3 custom-scroll">
                                {allDays.map((day) => (
                                    <motion.div
                                        key={day.id}
                                        whileHover={{ x: 6 }}
                                        onClick={() => { setCurrentDay(day.id); setSelectedBrief(null); }}
                                        className={`p-5 rounded-[1.5rem] cursor-pointer border transition-all duration-500 relative group ${
                                            currentDay === day.id 
                                            ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                                            : 'bg-slate-800/30 border-transparent hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${
                                                currentDay === day.id 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 rotate-3' 
                                                : 'bg-slate-800 text-slate-500'
                                            }`}>
                                                {day.id}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${currentDay === day.id ? 'text-blue-400' : 'text-slate-600'}`}>
                                                    Module {day.id}
                                                </p>
                                                <p className={`text-sm font-bold truncate ${currentDay === day.id ? 'text-white' : 'text-slate-400'}`}>
                                                    {day.task}
                                                </p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-all duration-500 ${currentDay === day.id ? 'text-blue-500 translate-x-1' : 'text-slate-700 opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress Footer */}
                            <div className="mt-10 pt-8 border-t border-slate-800/50">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Progress</span>
                                    <span className="text-xs font-black text-blue-500">{Math.round((currentDay/allDays.length)*100)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentDay/allDays.length)*100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}