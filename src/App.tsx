import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Target, Zap, Clock, Trophy, 
  ChevronRight, MessageSquare, Play, 
  CheckCircle2, Flame, BookOpen, Settings,
  BarChart3, ShieldAlert, Coins, Gift, Wallet,
  CreditCard
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- Types ---
type ViewState = 'dashboard' | 'practice' | 'review' | 'chat' | 'rewards';
type DailyTime = 30 | 60 | 120;

// --- Mock Data ---
const INITIAL_SCORE = 1230;
const TARGET_SCORE = 1550;
const CURRENT_SCORE = 1310;

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [dailyTime, setDailyTime] = useState<DailyTime>(60);
  const [xp, setXp] = useState(2450);
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(120);
  const [isBossFightActive, setIsBossFightActive] = useState(false);
  const [dailyTestCompleted, setDailyTestCompleted] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hey there! I'm your SAT Master Tutor. Ready to crush that 1550 goal today? What should we tackle first: Math or Reading?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `System: You are an expert SAT tutor. Your student is a 10th grader with a PSAT score of 1230 aiming for a 1550. They have committed to studying ${dailyTime} minutes today. You must be encouraging, engaging, and efficient. Use gamified language (e.g., 'level up', 'boss fight'). Keep explanations concise and clear. Respond in Chinese or English based on the user's language.` }] },
          ...chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ]
      });
      
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || 'Oops, my circuits got crossed. Try again?' }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Connection error. Let's try that again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      {/* Top Navigation Bar */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                SAT Super Console
              </h1>
              <p className="text-xs text-purple-400 font-medium">Target: 1550</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold">{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">Lv. {Math.floor(xp / 1000) + 1} ({xp} XP)</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{coins}</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white/70" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white/10 overflow-hidden">
              <img src="https://picsum.photos/seed/student/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <SidebarButton 
            icon={<BarChart3 />} label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <SidebarButton 
            icon={<Target />} label="Practice Arena" 
            active={currentView === 'practice'} 
            onClick={() => setCurrentView('practice')} 
          />
          <SidebarButton 
            icon={<ShieldAlert />} label="Boss Fights (Review)" 
            active={currentView === 'review'} 
            onClick={() => setCurrentView('review')} 
          />
          <SidebarButton 
            icon={<MessageSquare />} label="AI Tutor Chat" 
            active={currentView === 'chat'} 
            onClick={() => setCurrentView('chat')} 
          />
          <SidebarButton 
            icon={<Gift />} label="Rewards Store" 
            active={currentView === 'rewards'} 
            onClick={() => setCurrentView('rewards')} 
          />
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-4">Daily Commitment</p>
            <div className="px-2 space-y-2">
              {[30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => setDailyTime(time as DailyTime)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    dailyTime === time 
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                      : 'text-white/70 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" />
                    {time} Minutes
                  </div>
                  {dailyTime === time && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Score Progress */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                  <h2 className="text-2xl font-bold mb-6">Your Journey to 1550</h2>
                  
                  <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((CURRENT_SCORE - INITIAL_SCORE) / (TARGET_SCORE - INITIAL_SCORE)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm font-medium text-white/60">
                    <span>PSAT: {INITIAL_SCORE}</span>
                    <span className="text-purple-400 font-bold text-lg">Current: {CURRENT_SCORE}</span>
                    <span>Goal: {TARGET_SCORE}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Today's Mission */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Target className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Play className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold">Today's Mission</h3>
                    </div>
                    <p className="text-white/70 mb-6 relative z-10">
                      You committed to {dailyTime} minutes today. Let's tackle Advanced Algebra and some tricky Reading passages.
                    </p>
                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="flex items-center gap-3 text-sm bg-black/20 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="flex-1">Math: Advanced Algebra</span>
                        <span className="text-white/50">{Math.round(dailyTime * 0.4)}m</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm bg-black/20 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="flex-1">Reading: Command of Evidence</span>
                        <span className="text-white/50">{Math.round(dailyTime * 0.6)}m</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setCurrentView('practice')}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      Start Mission <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Chat Widget */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-5">
                      <Brain className="w-48 h-48" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Brain className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold">Ask Master Tutor</h3>
                    </div>
                    <div className="flex-1 bg-black/20 rounded-xl p-4 mb-4 text-sm text-white/80 italic flex items-center justify-center text-center relative z-10 border border-white/5">
                      "Stuck on a math problem? Drop it here and we'll break it down together!"
                    </div>
                    <button 
                      onClick={() => setCurrentView('chat')}
                      className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors relative z-10"
                    >
                      Open Chat
                    </button>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Math Score" value="680" target="800" trend="+40" />
                  <StatCard label="Reading Score" value="630" target="750" trend="+40" />
                  <StatCard label="Questions Done" value="1,204" target="3,000" />
                  <StatCard label="Bosses Defeated" value="4" target="10" />
                </div>

                {/* Roadmap */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Mastery Roadmap
                  </h3>
                  <div className="space-y-4">
                    <RoadmapItem title="Phase 1: Foundation (1230 -> 1350)" status="completed" />
                    <RoadmapItem title="Phase 2: Advanced Concepts (1350 -> 1450)" status="active" progress={60} />
                    <RoadmapItem title="Phase 3: Speed & Accuracy (1450 -> 1500)" status="locked" />
                    <RoadmapItem title="Phase 4: The Final Push (1500 -> 1550+)" status="locked" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-3xl flex flex-col h-[600px] overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">SAT Master Tutor</h3>
                    <p className="text-xs text-green-400">Online â Ready to help</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white rounded-tr-sm' 
                          : 'bg-white/10 text-white/90 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white/50 p-4 rounded-2xl rounded-tl-sm flex gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20">
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button onClick={() => setInputMessage("Give me a quick Math drill!")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">
                      Quick Math Drill
                    </button>
                    <button onClick={() => setInputMessage("Explain Command of Evidence")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">
                      Explain Reading Strategy
                    </button>
                    <button onClick={() => setInputMessage("I'm feeling unmotivated...")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">
                      Need Motivation
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question or paste a problem..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'practice' && (
              <motion.div 
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold">Practice Arena</h2>
                 </div>

                 {/* Daily Challenge */}
                 <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Coins className="w-32 h-32" />
                   </div>
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <Flame className="w-5 h-5 text-orange-400" />
                         <h3 className="text-xl font-bold text-yellow-400">Daily Challenge</h3>
                       </div>
                       <p className="text-white/80 max-w-md">
                         Complete a mixed 10-question quiz. Pass with 80%+ to earn bonus coins!
                       </p>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="text-right">
                         <div className="text-sm text-white/50 font-bold uppercase">Reward</div>
                         <div className="text-xl font-bold text-yellow-400 flex items-center gap-1 justify-end">
                           +20 <Coins className="w-4 h-4" />
                         </div>
                       </div>
                       {dailyTestCompleted ? (
                         <div className="px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30 flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5" /> Completed
                         </div>
                       ) : (
                         <button 
                           onClick={() => {
                             setDailyTestCompleted(true);
                             setCoins(c => c + 20);
                             setXp(x => x + 100);
                           }}
                           className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow-lg shadow-yellow-500/20"
                         >
                           Start Challenge
                         </button>
                       )}
                     </div>
                   </div>
                 </div>

                 <h3 className="text-xl font-bold mb-4">Targeted Drills</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PracticeCard 
                      title="Math: Heart of Algebra" 
                      description="Master linear equations and inequalities. High yield for your 1550 goal."
                      xp={150}
                      time="15 mins"
                      color="blue"
                    />
                    <PracticeCard 
                      title="Reading: Command of Evidence" 
                      description="Learn to find the exact line that supports your answer."
                      xp={200}
                      time="20 mins"
                      color="purple"
                    />
                    <PracticeCard 
                      title="Writing: Standard English Conventions" 
                      description="Quick grammar drills to secure easy points."
                      xp={100}
                      time="10 mins"
                      color="green"
                    />
                 </div>
              </motion.div>
            )}

            {currentView === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Boss Fights (Periodic Review)</h2>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30">
                      High Stakes
                    </span>
                 </div>
                 
                 <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">Weekend Mini-Mock</h3>
                    <p className="text-white/70 max-w-md mx-auto mb-8">
                      Test your week's progress under timed conditions. Defeating this boss grants massive XP and unlocks the next tier of difficulty.
                    </p>
                    {isBossFightActive ? (
                      <div className="space-y-4">
                        <div className="text-red-400 font-bold animate-pulse">Boss Fight in Progress...</div>
                        <button 
                          onClick={() => {
                            setIsBossFightActive(false);
                            setXp(prev => prev + 500);
                            setCoins(prev => prev + 50);
                            setCurrentView('dashboard');
                          }}
                          className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl transition-colors shadow-lg"
                        >
                          Submit Answers & Defeat Boss
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-white/50 font-bold uppercase">XP Reward</div>
                            <div className="text-xl font-bold text-yellow-500">+500 XP</div>
                          </div>
                          <div className="h-8 w-px bg-white/20" />
                          <div className="text-center">
                            <div className="text-sm text-white/50 font-bold uppercase">Coin Reward</div>
                            <div className="text-xl font-bold text-yellow-400 flex items-center gap-1 justify-center">
                              +50 <Coins className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsBossFightActive(true)}
                          className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20 w-full md:w-auto"
                        >
                          Enter Boss Room (45 mins)
                        </button>
                      </div>
                    )}
                 </div>

                 <h3 className="text-xl font-bold mt-8 mb-4">Past Encounters</h3>
                 <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">Week 2 Checkpoint</h4>
                        <p className="text-sm text-white/50">Score: 1310 (+80 from baseline)</p>
                      </div>
                      <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Cleared</span>
                    </div>
                 </div>
              </motion.div>
            )}

            {currentView === 'rewards' && (
              <motion.div 
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h2 className="text-2xl font-bold">Rewards Store</h2>
                     <p className="text-white/60">Exchange your hard-earned SAT Coins for real rewards!</p>
                   </div>
                   <div className="bg-yellow-500/20 px-4 py-2 rounded-xl border border-yellow-500/30 flex items-center gap-2">
                     <Wallet className="w-5 h-5 text-yellow-400" />
                     <span className="font-bold text-yellow-400 text-xl">{coins} Coins</span>
                   </div>
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                   <div className="flex items-start gap-4">
                     <div className="p-3 bg-blue-500/20 rounded-xl">
                       <CreditCard className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold mb-1">Parent-Sponsored Rewards</h3>
                       <p className="text-white/70 text-sm">
                         Link your parent's account to automatically convert coins into allowance or gift cards. 
                         (Currently in Demo Mode: Click to simulate redemption).
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <RewardCard 
                     title="$5 Amazon Gift Card" 
                     cost={500} 
                     currentCoins={coins} 
                     onRedeem={() => setCoins(c => c - 500)} 
                     icon={<Gift className="w-8 h-8 text-orange-400" />}
                   />
                   <RewardCard 
                     title="$10 Cash Transfer" 
                     cost={1000} 
                     currentCoins={coins} 
                     onRedeem={() => setCoins(c => c - 1000)} 
                     icon={<Wallet className="w-8 h-8 text-green-400" />}
                   />
                   <RewardCard 
                     title="Skip a Chore Pass" 
                     cost={300} 
                     currentCoins={coins} 
                     onRedeem={() => setCoins(c => c - 300)} 
                     icon={<CheckCircle2 className="w-8 h-8 text-purple-400" />}
                   />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function SidebarButton({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-white/10 text-white' 
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`${active ? 'text-purple-400' : ''}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function PracticeCard({ title, description, xp, time, color }: { title: string, description: string, xp: number, time: string, color: 'blue' | 'purple' | 'green' }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400',
    green: 'from-green-500/20 to-green-900/20 border-green-500/30 text-green-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]} border ${colorMap[color].split(' ')[2]} rounded-3xl p-6 flex flex-col`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-6 flex-1">{description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex gap-4 text-sm font-bold">
          <span className="flex items-center gap-1 text-yellow-500"><Trophy className="w-4 h-4"/> +{xp} XP</span>
          <span className="flex items-center gap-1 text-white/50"><Clock className="w-4 h-4"/> {time}</span>
        </div>
        <button className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${colorMap[color].split(' ')[3]}`}>
          <Play className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, target, trend }: { label: string, value: string, target?: string, trend?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
      <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {target && <div className="text-sm text-white/40 mb-1">/ {target}</div>}
      </div>
      {trend && (
        <div className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1">
          <ChevronRight className="w-3 h-3 -rotate-90" />
          {trend} this month
        </div>
      )}
    </div>
  );
}

function RoadmapItem({ title, status, progress }: { title: string, status: 'completed' | 'active' | 'locked', progress?: number }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
      status === 'completed' ? 'bg-green-500/10 border-green-500/20' :
      status === 'active' ? 'bg-purple-500/10 border-purple-500/30' :
      'bg-white/5 border-white/5 opacity-50'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        status === 'completed' ? 'bg-green-500/20 text-green-400' :
        status === 'active' ? 'bg-purple-500/20 text-purple-400' :
        'bg-white/10 text-white/40'
      }`}>
        {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
         status === 'active' ? <Flame className="w-5 h-5" /> :
         <BookOpen className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <h4 className={`font-bold ${status === 'locked' ? 'text-white/50' : 'text-white'}`}>{title}</h4>
        {status === 'active' && progress !== undefined && (
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {status === 'active' && <span className="text-sm font-bold text-purple-400">{progress}%</span>}
    </div>
  );
}

function RewardCard({ title, cost, currentCoins, onRedeem, icon }: { title: string, cost: number, currentCoins: number, onRedeem: () => void, icon: ReactNode }) {
  const canAfford = currentCoins >= cost;
  
  return (
    <div className={`bg-white/5 border rounded-3xl p-6 flex flex-col items-center text-center transition-all ${
      canAfford ? 'border-yellow-500/30 hover:bg-white/10' : 'border-white/10 opacity-60'
    }`}>
      <div className="mb-4 p-4 bg-black/20 rounded-full">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="flex items-center gap-1 text-yellow-400 font-bold mb-6">
        <Coins className="w-4 h-4" /> {cost} Coins
      </div>
      <button 
        onClick={onRedeem}
        disabled={!canAfford}
        className={`w-full py-3 rounded-xl font-bold transition-colors ${
          canAfford 
            ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' 
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        {canAfford ? 'Redeem Reward' : 'Not Enough Coins'}
      </button>
    </div>
  );
}
