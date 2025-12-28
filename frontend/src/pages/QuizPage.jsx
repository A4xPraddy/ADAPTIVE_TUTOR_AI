import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ArrowLeft, CheckCircle2, XCircle, ChevronRight, Loader2, Award } from 'lucide-react';
import axios from 'axios';

export default function QuizPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const moduleId = location.state?.moduleId;
    
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/generate-quiz', { module_id: moduleId });
            setQuiz(res.data.quiz);
        } catch (err) { alert("Neural link failed. Try again!"); }
        setLoading(false);
    };

    useEffect(() => { if (moduleId) fetchQuiz(); }, [moduleId]);

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-xs font-black tracking-[0.3em] uppercase animate-pulse">Generating Challenge...</p>
        </div>
    );

    if (showResult) {
        const score = quiz.questions.filter((q, i) => answers[i] === q.answer).length;
        return (
            <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[3rem] text-center shadow-2xl">
                    <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-white mb-2">Phase Complete</h2>
                    <p className="text-slate-400 mb-8">You scored {score} out of {quiz.questions.length}</p>
                    <button onClick={() => navigate(-1)} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white">RETURN TO MISSION</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
                <button onClick={() => navigate(-1)} className="p-3 bg-slate-800 rounded-2xl"><ArrowLeft size={20}/></button>
                <div className="flex items-center gap-2">
                    <BrainCircuit className="text-purple-400" />
                    <span className="font-black uppercase tracking-widest text-sm">Knowledge Assessment</span>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto">
                {quiz && (
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{x: 20, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-20, opacity:0}} className="space-y-8">
                            <div className="flex justify-between items-end">
                                <span className="text-blue-500 font-black text-5xl">0{currentStep + 1}</span>
                                <span className="text-slate-500 font-bold">/ 0{quiz.questions.length}</span>
                            </div>
                            
                            <h2 className="text-2xl font-bold leading-tight">{quiz.questions[currentStep].question}</h2>
                            
                            <div className="grid gap-4">
                                {quiz.questions[currentStep].options.map((opt, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setAnswers({...answers, [currentStep]: opt})}
                                        className={`p-6 rounded-3xl text-left font-bold transition-all border-2 ${answers[currentStep] === opt ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => currentStep + 1 < quiz.questions.length ? setCurrentStep(s => s + 1) : setShowResult(true)}
                                disabled={!answers[currentStep]}
                                className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase tracking-widest disabled:opacity-20 transition-all flex items-center justify-center gap-2"
                            >
                                {currentStep + 1 === quiz.questions.length ? 'Finish' : 'Next Question'} <ChevronRight size={18}/>
                            </button>
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}