import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Target, Zap, Clock, Trophy,
  ChevronRight, MessageSquare, Play,
  CheckCircle2, Flame, BookOpen, Settings,
  BarChart3, ShieldAlert, Coins, Gift, Wallet,
  CreditCard, XCircle, ArrowLeft, Star, Calendar,
  RefreshCw, BookMarked, Lightbulb
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ViewState = 'dashboard' | 'practice' | 'review' | 'chat' | 'rewards';
type DailyTime = 30 | 60 | 120;
type ModuleType = 'math' | 'reading' | 'writing' | 'vocab';
type DrillState = 'idle' | 'in_progress' | 'completed' | 'review';
type VocabMode = 'menu' | 'learn' | 'review' | 'daily_test' | 'test_result';

// ─────────────────────────────────────────────
// Question Banks (with explanations)
// ─────────────────────────────────────────────
const MATH_DRILL_QUESTIONS = [
  { question: 'Solve for x: 5x - 3 = 2x + 9', options: ['2', '3', '4', '6'], answer: 2, explanation: 'Subtract 2x from both sides: 3x - 3 = 9. Add 3 to both sides: 3x = 12. Divide by 3: x = 4.' },
  { question: 'What is the y-intercept of y = 3x - 7?', options: ['3', '-7', '7', '-3'], answer: 1, explanation: 'In the slope-intercept form y = mx + b, b is the y-intercept. Here, b = -7.' },
  { question: 'Simplify: (2x + 3)(x - 4)', options: ['2x² - 5x - 12', '2x² + 5x - 12', '2x² - 5x + 12', '2x² + 5x + 12'], answer: 0, explanation: 'Use FOIL: First (2x*x = 2x²), Outer (2x*-4 = -8x), Inner (3*x = 3x), Last (3*-4 = -12). Combine: 2x² - 8x + 3x - 12 = 2x² - 5x - 12.' },
  { question: 'If a line has slope 2 and passes through (1, 5), what is its equation?', options: ['y = 2x + 3', 'y = 2x + 5', 'y = 2x - 3', 'y = 2x + 1'], answer: 0, explanation: 'Use point-slope form: y - y1 = m(x - x1). y - 5 = 2(x - 1) => y - 5 = 2x - 2 => y = 2x + 3.' },
  { question: 'Solve: |2x - 4| = 6', options: ['x = 5 or x = -1', 'x = 5 or x = 1', 'x = -5 or x = 1', 'x = 5 or x = -5'], answer: 0, explanation: 'Two cases: 2x - 4 = 6 => 2x = 10 => x = 5. OR 2x - 4 = -6 => 2x = -2 => x = -1.' },
];

const READING_DRILL_QUESTIONS = [
  { question: 'The word "ephemeral" most nearly means:', options: ['Long-lasting', 'Short-lived', 'Mysterious', 'Powerful'], answer: 1, explanation: '"Ephemeral" means lasting for a very short time.' },
  { question: 'A passage says: "The scientist\'s findings were met with skepticism." What does "skepticism" mean?', options: ['Excitement', 'Doubt', 'Support', 'Confusion'], answer: 1, explanation: '"Skepticism" refers to a doubting or questioning attitude.' },
  { question: 'Which choice provides the best evidence for a claim about the author\'s tone?', options: ['A neutral description of events', 'Enthusiastic praise for the subject', 'A critical analysis with supporting data', 'A personal anecdote'], answer: 2, explanation: 'Tone is best supported by the author\'s choice of words and analytical approach, often found in critical analysis.' },
  { question: '"Command of Evidence" questions ask you to:', options: ['Summarize the passage', 'Find the line that best supports a previous answer', 'Identify the main idea', 'Correct grammatical errors'], answer: 1, explanation: 'These questions specifically require you to locate the exact text that justifies your answer to the preceding question.' },
  { question: 'The word "pragmatic" most nearly means:', options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'], answer: 1, explanation: '"Pragmatic" means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.' },
];

const WRITING_DRILL_QUESTIONS = [
  { question: 'Choose the correct version: "Neither the students nor the teacher ___ ready."', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: 'In "neither/nor" constructions, the verb agrees with the noun closest to it. "Teacher" is singular, so use "was".' },
  { question: 'Which sentence is punctuated correctly?', options: ['I love to read; however I prefer fiction.', 'I love to read, however I prefer fiction.', 'I love to read; however, I prefer fiction.', 'I love to read however, I prefer fiction.'], answer: 2, explanation: 'Use a semicolon before a conjunctive adverb (however) joining two independent clauses, and a comma after it.' },
  { question: 'Choose the most concise version:', options: ['Due to the fact that it was raining, we stayed inside.', 'Because it was raining, we stayed inside.', 'On account of the rain, we stayed inside.', 'In light of the rainy conditions, we stayed inside.'], answer: 1, explanation: '"Because" is the most direct and concise way to express cause.' },
  { question: 'Which word correctly completes: "The data ___ inconclusive."', options: ['was', 'were', 'is', 'are'], answer: 1, explanation: 'In formal academic writing (like the SAT), "data" is treated as a plural noun (singular is "datum"). Therefore, "were" or "are" is correct. Given the options, "were" fits the past tense context.' },
  { question: 'Identify the dangling modifier: which sentence has an error?', options: ['Running down the street, the dog chased me.', 'Running down the street, I was chased by the dog.', 'The dog chased me as I ran down the street.', 'I ran down the street while the dog chased me.'], answer: 0, explanation: 'In option A, "Running down the street" modifies "the dog", implying the dog was running down the street, which changes the intended meaning.' },
];

// ─────────────────────────────────────────────
// Vocabulary Bank (with roots/tricks)
// ─────────────────────────────────────────────
const VOCAB_BANK = [
  { word: 'Aberrant', definition: 'Departing from an accepted standard; abnormal.', example: 'The scientist noted aberrant behavior in the test subjects.', trick: 'ab- (away) + errare (to wander). Wandering away from normal.' },
  { word: 'Benevolent', definition: 'Well-meaning and kindly; charitable.', example: 'The benevolent donor funded the entire scholarship program.', trick: 'bene- (good) + volent (wishing). Wishing good.' },
  { word: 'Cacophony', definition: 'A harsh, discordant mixture of sounds.', example: 'The cacophony of the construction site made it hard to concentrate.', trick: 'caco- (bad) + phon (sound). Bad sound.' },
  { word: 'Dearth', definition: 'A scarcity or lack of something.', example: 'There was a dearth of qualified candidates for the position.', trick: 'Sounds like "earth" without water -> scarcity.' },
  { word: 'Ebullient', definition: 'Cheerful and full of energy; exuberant.', example: 'Her ebullient personality lit up every room she entered.', trick: 'e- (out) + bullire (to boil). Boiling over with joy.' },
  { word: 'Facetious', definition: 'Treating serious issues with inappropriate humor.', example: 'His facetious remarks during the meeting annoyed his colleagues.', trick: 'Face-tious -> making a funny face at a serious time.' },
  { word: 'Garrulous', definition: 'Excessively talkative, especially on trivial matters.', example: 'The garrulous neighbor talked for an hour about nothing important.', trick: 'Garru- sounds like gargle. Gargling words constantly.' },
  { word: 'Harbinger', definition: 'A person or thing that announces or signals the approach of another.', example: 'Dark clouds are a harbinger of the coming storm.', trick: 'Harbor-bringer -> brings news to the harbor.' },
  { word: 'Iconoclast', definition: 'A person who attacks cherished beliefs or institutions.', example: 'The iconoclast challenged every tradition the company held sacred.', trick: 'icon (image) + clast (breaker). Image breaker.' },
  { word: 'Juxtapose', definition: 'To place two things side by side for contrasting effect.', example: 'The artist juxtaposed bright colors with dark shadows.', trick: 'juxta (next to) + pose (place). Place next to.' },
];

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [dailyTime, setDailyTime] = useState<DailyTime>(60);
  const [xp, setXp] = useState(2450);
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(120);

  // Daily Progress State
  const [dailyProgress, setDailyProgress] = useState({
    math: false,
    reading: false,
    writing: false,
    vocab: false
  });

  // Drill State
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [drillQIdx, setDrillQIdx] = useState(0);
  const [drillSelected, setDrillSelected] = useState<number | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<(number | null)[]>([]);
  const [drillFinalScore, setDrillFinalScore] = useState(0);

  // Vocab State (Baicizhan style)
  const [vocabMode, setVocabMode] = useState<VocabMode>('menu');
  const [vocabLearnIdx, setVocabLearnIdx] = useState(0);
  const [vocabDailyNew] = useState(5);
  const [vocabDailyReview] = useState(10);
  const [vocabLearnedToday, setVocabLearnedToday] = useState(0);
  const [vocabReviewedToday, setVocabReviewedToday] = useState(0);

  // Chat
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hey there! I'm your SAT Master Tutor. Ready to crush that 1550 goal today? What should we tackle first: Math or Reading?" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Chat ──────────────────────────────────
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
          { role: 'user', parts: [{ text: `System: You are an expert SAT tutor. Student is a 10th grader aiming for 1550. Be encouraging, use gamified language. Respond in Chinese or English based on the user's language.` }] },
          ...chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] },
        ],
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || 'Oops, try again?' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Connection error. Try again!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Drills ────────────────────────
  const getDrillQuestions = () => {
    if (activeModule === 'math') return MATH_DRILL_QUESTIONS;
    if (activeModule === 'reading') return READING_DRILL_QUESTIONS;
    if (activeModule === 'writing') return WRITING_DRILL_QUESTIONS;
    return [];
  };

  const startDrill = (module: ModuleType) => {
    if (module === 'vocab') {
      setActiveModule('vocab');
      setVocabMode('menu');
      return;
    }
    setActiveModule(module);
    setDrillState('in_progress');
    setDrillQIdx(0);
    setDrillSelected(null);
    const qs = module === 'math' ? MATH_DRILL_QUESTIONS : module === 'reading' ? READING_DRILL_QUESTIONS : WRITING_DRILL_QUESTIONS;
    setDrillAnswers(Array(qs.length).fill(null));
  };

  const handleDrillSelect = (idx: number) => {
    if (drillSelected !== null) return;
    setDrillSelected(idx);
    const a = [...drillAnswers]; a[drillQIdx] = idx; setDrillAnswers(a);
  };

  const handleDrillNext = () => {
    const qs = getDrillQuestions();
    if (drillQIdx < qs.length - 1) {
      setDrillQIdx(p => p + 1); setDrillSelected(null);
    } else {
      const correct = drillAnswers.filter((a, i) => a === qs[i].answer).length;
      setDrillFinalScore(correct);
      setDrillState('completed');
      setDailyProgress(p => ({ ...p, [activeModule as string]: true }));
      const xpReward = activeModule === 'math' ? 150 : activeModule === 'reading' ? 200 : 100;
      setXp(x => x + Math.round(xpReward * (correct / qs.length)));
      setCoins(c => c + (correct >= qs.length * 0.8 ? 20 : 5));
    }
  };

  const exitDrill = () => { setActiveModule(null); setDrillState('idle'); };

  // ── Vocab (Baicizhan Style) ─────────────────────────────────
  const handleVocabLearnNext = () => {
    if (vocabLearnIdx < vocabDailyNew - 1) {
      setVocabLearnIdx(p => p + 1);
    } else {
      setVocabLearnedToday(vocabDailyNew);
      setVocabMode('menu');
      setDailyProgress(p => ({ ...p, vocab: true }));
      setXp(x => x + 50);
      setCoins(c => c + 10);
    }
  };

  const drillQuestions = getDrillQuestions();
  const currentDrillQ = drillQuestions[drillQIdx];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">SAT Super Console</h1>
              <p className="text-xs text-purple-400 font-medium">Target: 1550</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /><span className="font-bold">{streak} Day Streak</span></div>
            <div className="hidden sm:flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /><span className="font-bold">Lv. {Math.floor(xp / 1000) + 1} ({xp} XP)</span></div>
            <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
              <Coins className="w-5 h-5 text-yellow-400" /><span className="font-bold text-yellow-400">{coins}</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {([
            { view: 'dashboard', icon: <BarChart3 />, label: 'Dashboard' },
            { view: 'practice', icon: <Target />, label: '4-Module Arena' },
            { view: 'review', icon: <ShieldAlert />, label: 'Boss Fights' },
            { view: 'chat', icon: <MessageSquare />, label: 'AI Tutor Chat' },
            { view: 'rewards', icon: <Gift />, label: 'Rewards Store' },
          ] as { view: ViewState; icon: ReactNode; label: string }[]).map(({ view, icon, label }) => (
            <SidebarButton key={view} icon={icon} label={label} active={currentView === view} onClick={() => { setCurrentView(view); exitDrill(); }} />
          ))}

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-4">Daily Commitment</p>
            <div className="px-2 space-y-2">
              {[30, 60, 120].map((time) => (
                <button key={time} onClick={() => setDailyTime(time as DailyTime)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${dailyTime === time ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-white/70 hover:bg-white/5 border border-transparent'}`}>
                  <div className="flex items-center gap-3"><Clock className="w-4 h-4" />{time} Minutes</div>
                  {dailyTime === time && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">

            {/* ── Dashboard ── */}
            {currentView === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                  <h2 className="text-2xl font-bold mb-6">Your Journey to 1550</h2>
                  <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div initial={{ width: 0 }} animate={{ width: `40%` }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white/60">
                    <span>PSAT: 1230</span>
                    <span className="text-purple-400 font-bold text-lg">Current: 1310</span>
                    <span>Goal: 1550</span>
                  </div>
                </div>
                
                {/* Daily Progress Tracker */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-400" />Today's Progress</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ProgressBadge label="Math" done={dailyProgress.math} color="blue" />
                    <ProgressBadge label="Reading" done={dailyProgress.reading} color="purple" />
                    <ProgressBadge label="Writing" done={dailyProgress.writing} color="green" />
                    <ProgressBadge label="Vocab" done={dailyProgress.vocab} color="yellow" />
                  </div>
                  <div className="mt-6">
                    <button onClick={() => setCurrentView('practice')} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2">Go to 4-Module Arena <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 4-Module Arena ── */}
            {currentView === 'practice' && (
              <motion.div key="practice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">4-Module Arena</h2>
                  <div className="text-sm text-white/50">Complete all 4 to maintain streak!</div>
                </div>

                {/* Drill in progress (Math/Reading/Writing) */}
                {drillState === 'in_progress' && activeModule !== 'vocab' && activeModule && (
                  <div className={`rounded-3xl p-6 border ${activeModule === 'math' ? 'bg-blue-900/20 border-blue-500/30' : activeModule === 'reading' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={exitDrill} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <span className="text-sm text-white/60 font-bold">Q {drillQIdx + 1} / {drillQuestions.length}</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full mb-6 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${activeModule === 'math' ? 'bg-blue-400' : activeModule === 'reading' ? 'bg-purple-400' : 'bg-green-400'}`} style={{ width: `${(drillQIdx / drillQuestions.length) * 100}%` }} />
                    </div>
                    <p className="text-white font-semibold text-lg mb-5 leading-relaxed">{currentDrillQ.question}</p>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {currentDrillQ.options.map((opt, idx) => {
                        let style = 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10';
                        if (drillSelected !== null) {
                          if (idx === currentDrillQ.answer) style = 'bg-green-500/20 border-green-500 text-green-300';
                          else if (idx === drillSelected) style = 'bg-red-500/20 border-red-500 text-red-300';
                          else style = 'bg-white/5 border-white/10 text-white/40';
                        }
                        return (
                          <button key={idx} onClick={() => handleDrillSelect(idx)} disabled={drillSelected !== null} className={`w-full text-left px-5 py-4 rounded-xl border font-medium transition-all ${style}`}>
                            <span className="font-bold mr-3 text-white/50">{String.fromCharCode(65 + idx)}.</span>{opt}
                          </button>
                        );
                      })}
                    </div>
                    {drillSelected !== null && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold flex items-center gap-2 ${drillSelected === currentDrillQ.answer ? 'text-green-400' : 'text-red-400'}`}>
                            {drillSelected === currentDrillQ.answer ? <><CheckCircle2 className="w-5 h-5" />Correct!</> : <><XCircle className="w-5 h-5" />Incorrect</>}
                          </span>
                          <button onClick={handleDrillNext} className={`px-6 py-2 font-bold rounded-xl transition-colors text-black ${activeModule === 'math' ? 'bg-blue-400 hover:bg-blue-300' : activeModule === 'reading' ? 'bg-purple-400 hover:bg-purple-300' : 'bg-green-400 hover:bg-green-300'}`}>
                            {drillQIdx < drillQuestions.length - 1 ? 'Next →' : 'See Results'}
                          </button>
                        </div>
                        {/* Explanation Box */}
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 mt-4">
                          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mb-2"><Lightbulb className="w-4 h-4" /> Explanation</div>
                          <p className="text-white/80 text-sm leading-relaxed">{currentDrillQ.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Drill result */}
                {drillState === 'completed' && activeModule !== 'vocab' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold mb-2 text-yellow-400">{drillFinalScore} / {drillQuestions.length}</div>
                    <p className="text-white/70 mb-6">Module Completed! Daily check-in recorded.</p>
                    <div className="flex justify-center gap-4">
                      <button onClick={() => setDrillState('review')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Review Mistakes</button>
                      <button onClick={exitDrill} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Back to Arena</button>
                    </div>
                  </div>
                )}

                {/* Drill Review Mode */}
                {drillState === 'review' && activeModule !== 'vocab' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2"><BookMarked className="w-5 h-5 text-purple-400" /> Review Mode</h3>
                      <button onClick={exitDrill} className="text-white/50 hover:text-white text-sm">Close</button>
                    </div>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {drillQuestions.map((q, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${drillAnswers[i] === q.answer ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                          <div className="flex items-start gap-3 mb-2">
                            {drillAnswers[i] === q.answer ? <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                            <div>
                              <p className="font-medium mb-2">{q.question}</p>
                              <p className="text-sm text-white/60 mb-1">Your answer: {drillAnswers[i] !== null ? q.options[drillAnswers[i] as number] : 'None'}</p>
                              <p className="text-sm text-green-400 mb-3">Correct answer: {q.options[q.answer]}</p>
                              <div className="bg-black/30 p-3 rounded-lg text-sm text-white/80 border border-white/5">
                                <span className="text-yellow-400 font-bold mr-2">Explanation:</span>{q.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocab Module (Baicizhan Style) */}
                {activeModule === 'vocab' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button onClick={exitDrill} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"><ArrowLeft className="w-4 h-4" /> Back to Arena</button>
                    </div>
                    
                    {vocabMode === 'menu' && (
                      <div className="bg-white rounded-3xl p-6 text-black relative overflow-hidden">
                        {/* Baicizhan Style Header */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-orange-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl">SAT</div>
                            <div>
                              <h3 className="text-2xl font-bold flex items-center gap-2">SAT 词汇 <ChevronRight className="w-5 h-5 text-gray-400" /></h3>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/4" /></div>
                                <span className="text-xs text-gray-500">153 / 2947</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">剩余 94 天</div>
                        </div>

                        <h4 className="text-lg font-bold mb-4">今日计划</h4>
                        <div className="flex justify-around mb-8">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">需新学</div>
                            <div className="text-4xl font-bold">{vocabDailyNew - vocabLearnedToday} <span className="text-sm font-normal text-gray-500">词</span></div>
                          </div>
                          <div className="w-px bg-gray-200" />
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">需复习</div>
                            <div className="text-4xl font-bold">{vocabDailyReview - vocabReviewedToday} <span className="text-sm font-normal text-gray-500">词</span></div>
                          </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-4 flex items-center justify-center gap-1"><Clock className="w-4 h-4" /> 预计用时 11 分钟</div>
                        
                        <button onClick={() => setVocabMode('learn')} disabled={vocabLearnedToday >= vocabDailyNew} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-blue-600/30">
                          {vocabLearnedToday >= vocabDailyNew ? '今日已完成打卡！' : '开始背单词吧！'}
                        </button>
                      </div>
                    )}

                    {vocabMode === 'learn' && (
                      <div className="bg-white rounded-3xl p-6 text-black min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6 text-gray-400 text-sm">
                          <span>新词 {vocabLearnIdx + 1}/{vocabDailyNew}</span>
                          <button onClick={() => setVocabMode('menu')}><XCircle className="w-6 h-6" /></button>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <h2 className="text-5xl font-bold mb-6">{VOCAB_BANK[vocabLearnIdx].word}</h2>
                          <div className="bg-gray-100 rounded-2xl p-6 w-full max-w-md mb-6">
                            <p className="text-lg font-medium text-gray-800 mb-2">{VOCAB_BANK[vocabLearnIdx].definition}</p>
                            <p className="text-sm text-gray-500 italic">"{VOCAB_BANK[vocabLearnIdx].example}"</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 w-full max-w-md text-left">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1"><Lightbulb className="w-4 h-4" /> 记忆技巧</div>
                            <p className="text-sm text-blue-800">{VOCAB_BANK[vocabLearnIdx].trick}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <button onClick={handleVocabLearnNext} className="py-4 bg-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-200 transition-colors">不认识</button>
                          <button onClick={handleVocabLearnNext} className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">认识</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Module Selection Grid (shown when idle) */}
                {drillState === 'idle' && activeModule === null && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModuleCard title="Math" desc="Heart of Algebra & Advanced Math" icon={<Target />} color="blue" done={dailyProgress.math} onClick={() => startDrill('math')} />
                    <ModuleCard title="Reading" desc="Command of Evidence & Words in Context" icon={<BookOpen />} color="purple" done={dailyProgress.reading} onClick={() => startDrill('reading')} />
                    <ModuleCard title="Writing" desc="Standard English Conventions" icon={<Target />} color="green" done={dailyProgress.writing} onClick={() => startDrill('writing')} />
                    <ModuleCard title="Vocabulary" desc="Daily words & Spaced Repetition" icon={<BookMarked />} color="yellow" done={dailyProgress.vocab} onClick={() => startDrill('vocab')} />
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Boss Fights ── */}
            {currentView === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Boss Fights (Periodic Review)</h2>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30">High Stakes</span>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                  <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Weekend Mini-Mock</h3>
                  <p className="text-white/70 max-w-md mx-auto mb-8">Test your week's progress under timed conditions. Defeating this boss grants massive XP and unlocks the next tier.</p>
                  <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20 w-full md:w-auto">Enter Boss Room (45 mins)</button>
                </div>
              </motion.div>
            )}

            {/* ── Rewards ── */}
            {currentView === 'rewards' && (
              <motion.div key="rewards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div><h2 className="text-2xl font-bold">Rewards Store</h2><p className="text-white/60">Exchange your hard-earned SAT Coins for real rewards!</p></div>
                  <div className="bg-yellow-500/20 px-4 py-2 rounded-xl border border-yellow-500/30 flex items-center gap-2"><Wallet className="w-5 h-5 text-yellow-400" /><span className="font-bold text-yellow-400 text-xl">{coins} Coins</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RewardCard title="$5 Amazon Gift Card" cost={500} currentCoins={coins} onRedeem={() => setCoins(c => c - 500)} icon={<Gift className="w-8 h-8 text-orange-400" />} />
                  <RewardCard title="$10 Cash Transfer" cost={1000} currentCoins={coins} onRedeem={() => setCoins(c => c - 1000)} icon={<Wallet className="w-8 h-8 text-green-400" />} />
                  <RewardCard title="Skip a Chore Pass" cost={300} currentCoins={coins} onRedeem={() => setCoins(c => c - 300)} icon={<CheckCircle2 className="w-8 h-8 text-purple-400" />} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function SidebarButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
      <div className={active ? 'text-purple-400' : ''}>{icon}</div>{label}
    </button>
  );
}

function ProgressBadge({ label, done, color }: { label: string; done: boolean; color: 'blue' | 'purple' | 'green' | 'yellow' }) {
  const colorMap = {
    blue: done ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/40',
    purple: done ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-white/40',
    green: done ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/40',
    yellow: done ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/40',
  };
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${colorMap[color]} transition-all`}>
      {done ? <CheckCircle2 className="w-6 h-6 mb-1" /> : <div className="w-6 h-6 rounded-full border-2 border-current mb-1 opacity-50" />}
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}

function ModuleCard({ title, desc, icon, color, done, onClick }: { title: string; desc: string; icon: ReactNode; color: 'blue' | 'purple' | 'green' | 'yellow'; done: boolean; onClick: () => void }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400 hover:border-blue-400',
    purple: 'from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400 hover:border-purple-400',
    green: 'from-green-500/20 to-green-900/20 border-green-500/30 text-green-400 hover:border-green-400',
    yellow: 'from-yellow-500/20 to-yellow-900/20 border-yellow-500/30 text-yellow-400 hover:border-yellow-400',
  };
  const parts = colorMap[color].split(' ');
  
  return (
    <button onClick={onClick} className={`bg-gradient-to-br ${parts[0]} ${parts[1]} border ${parts[2]} rounded-3xl p-6 flex flex-col text-left transition-all group relative overflow-hidden`}>
      {done && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done Today</div>}
      <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 ${parts[3]}`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-6 flex-1">{desc}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 w-full">
        <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors">Daily Goal: 5-10 items</span>
        <div className={`p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors ${parts[3]}`}><Play className="w-5 h-5" /></div>
      </div>
    </button>
  );
}

function RewardCard({ title, cost, currentCoins, onRedeem, icon }: { title: string; cost: number; currentCoins: number; onRedeem: () => void; icon: ReactNode }) {
  const canAfford = currentCoins >= cost;
  return (
    <div className={`bg-white/5 border rounded-3xl p-6 flex flex-col items-center text-center transition-all ${canAfford ? 'border-yellow-500/30 hover:bg-white/10' : 'border-white/10 opacity-60'}`}>
      <div className="mb-4 p-4 bg-black/20 rounded-full">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="flex items-center gap-1 text-yellow-400 font-bold mb-6"><Coins className="w-4 h-4" />{cost} Coins</div>
      <button onClick={onRedeem} disabled={!canAfford} className={`w-full py-3 rounded-xl font-bold transition-colors ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
        {canAfford ? 'Redeem Reward' : 'Not Enough Coins'}
      </button>
    </div>
  );
}
