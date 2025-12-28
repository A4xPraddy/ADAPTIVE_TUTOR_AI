import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePlan from './pages/CreatePlan';
import ViewPlan from './pages/ViewPlan';
import ExplainTopic from './pages/ExplainTopic';
import SolveDoubt from './pages/SolveDoubt';
import QuizPage from './pages/QuizPage';

// This wrapper component handles the smooth page-fade animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/create-plan" element={<PageWrapper><CreatePlan /></PageWrapper>} />
        <Route path="/view-plan" element={<PageWrapper><ViewPlan /></PageWrapper>} />
        <Route path="/explain-topic" element={<PageWrapper><ExplainTopic /></PageWrapper>} />
        <Route path="/solve-doubt" element={<PageWrapper><SolveDoubt /></PageWrapper>} />
        <Route path="/quiz" element={<PageWrapper><QuizPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      {/* 
          GLOBAL CONTAINER 
          - bg-[#0f172a] forces the deep midnight blue theme everywhere.
          - selection:bg-blue-500/30 makes text highlighting look cool.
      */}
      <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* The New Floating Glass Navbar */}
        <Navbar />

        {/* 
            MAIN CONTENT AREA 
            - pt-32: Provides space so content isn't hidden behind the fixed Navbar.
            - pb-20: Extra space at bottom for mobile/scrolling comfort.
        */}
        <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
          <AnimatedRoutes />
        </div>

        {/* Subtle Background Glows to make the UI pop */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </Router>
  );
}

export default App;