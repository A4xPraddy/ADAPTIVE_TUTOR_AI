import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import ModernBrief from '../components/ModernBrief';

export default function SolveDoubt() {
    const location = useLocation();
    const navigate = useNavigate();
    const { moduleId, moduleTitle } = location.state || {};
    
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/ask-doubt', { 
                question, 
                module_id: moduleId 
            });
            setAnswer(res.data.response.answer);
        } catch (err) { alert("Neural link interrupted."); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <nav className="max-w-5xl mx-auto flex justify-between items-center mb-12">
                <button onClick={() => navigate(-1)} className="p-3 bg-slate-800 rounded-2xl"><ArrowLeft size={20}/></button>
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-emerald-400" />
                    <span className="font-black uppercase tracking-widest text-sm">Neural Support</span>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto space-y-10">
                <header className="text-center">
                    <h1 className="text-4xl font-black mb-2">Ask the <span className="text-blue-500">Mentor</span></h1>
                    <p className="text-slate-500 uppercase text-[10px] font-bold tracking-[0.4em]">Context: {moduleTitle}</p>
                </header>

                <form onSubmit={handleAsk} className="relative">
                    <input 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your technical doubt here..."
                        className="w-full bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] pr-20 outline-none focus:border-blue-500 transition-all text-lg shadow-2xl"
                    />
                    <button disabled={loading} className="absolute right-4 top-4 bottom-4 px-6 bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>

                {answer && (
                    <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-6 text-blue-400">
                            <Sparkles size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Mentor's Response</span>
                        </div>
                        <ModernBrief content={answer} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}