import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Target, Zap, Clock, Trophy,
  ChevronRight, MessageSquare, Play,
  CheckCircle2, Flame, BookOpen, Settings,
  BarChart3, ShieldAlert, Coins, Gift, Wallet,
  XCircle, ArrowLeft, Star, Calendar,
  RefreshCw, BookMarked, Lightbulb, AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Question, MATH_QUESTIONS, READING_QUESTIONS, WRITING_QUESTIONS, VocabWord, VOCAB_BANK } from './questions';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ViewState = 'dashboard' | 'practice' | 'review' | 'chat' | 'rewards';
type DailyTime = 30 | 60 | 120;
type ModuleType = 'math' | 'reading' | 'writing' | 'vocab';
type DrillState = 'idle' | 'in_progress' | 'completed' | 'review';
type VocabMode = 'menu' | 'learn' | 'review_cards' | 'daily_test';
// vocab learn sub-mode: 'intro' shows word+definition+trick, 'quiz' shows SAT-style passage question
type VocabLearnStep = 'intro' | 'quiz';
type DrillMode = 'full' | 'wrong_only';

interface WrongEntry {
  questionId: string;
  module: ModuleType;
  wrongAnswer: number;
  timestamp: number;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Adaptive difficulty: returns a difficulty level (1/2/3) based on recent accuracy
// accuracy: 0.0 ~ 1.0 (ratio of correct answers in last session)
const getAdaptiveDifficulty = (accuracy: number | null): 1 | 2 | 3 => {
  if (accuracy === null) return 1; // first time: start easy
  if (accuracy >= 0.8) return 3;  // ≥80% correct → Hard
  if (accuracy >= 0.5) return 2;  // 50~79% correct → Medium
  return 1;                        // <50% correct → Easy
};

// Build a mixed question set weighted toward the adaptive difficulty level
const getQuestionsForModule = (
  module: ModuleType,
  count: number,
  wrongOnly: boolean,
  wrongBook: WrongEntry[],
  lastAccuracy: number | null = null
): Question[] => {
  let pool: Question[] = [];
  if (module === 'math') pool = MATH_QUESTIONS;
  else if (module === 'reading') pool = READING_QUESTIONS;
  else if (module === 'writing') pool = WRITING_QUESTIONS;
  else return [];

  if (wrongOnly) {
    const wrongIds = wrongBook.filter(e => e.module === module).map(e => e.questionId);
    pool = pool.filter(q => wrongIds.includes(q.id));
    if (pool.length === 0) return [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Adaptive difficulty distribution
  const targetDiff = getAdaptiveDifficulty(lastAccuracy);
  const easy = pool.filter(q => q.difficulty === 1).sort(() => Math.random() - 0.5);
  const medium = pool.filter(q => q.difficulty === 2).sort(() => Math.random() - 0.5);
  const hard = pool.filter(q => q.difficulty === 3).sort(() => Math.random() - 0.5);

  let selected: Question[] = [];
  if (targetDiff === 1) {
    // Easy: 60% easy, 30% medium, 10% hard
    const e = Math.round(count * 0.6), m = Math.round(count * 0.3), h = count - e - m;
    selected = [...easy.slice(0, e), ...medium.slice(0, m), ...hard.slice(0, Math.max(0, h))];
  } else if (targetDiff === 2) {
    // Medium: 20% easy, 60% medium, 20% hard
    const e = Math.round(count * 0.2), m = Math.round(count * 0.6), h = count - e - m;
    selected = [...easy.slice(0, e), ...medium.slice(0, m), ...hard.slice(0, Math.max(0, h))];
  } else {
    // Hard: 10% easy, 30% medium, 60% hard
    const e = Math.round(count * 0.1), m = Math.round(count * 0.3), h = count - e - m;
    selected = [...easy.slice(0, e), ...medium.slice(0, m), ...hard.slice(0, Math.max(0, h))];
  }

  // Fill up if not enough questions at target difficulty
  if (selected.length < count) {
    const usedIds = new Set(selected.map(q => q.id));
    const remaining = pool.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
    selected = [...selected, ...remaining].slice(0, count);
  }

  // Final shuffle so difficulty order is random
  return selected.sort(() => Math.random() - 0.5).slice(0, count);
};

const sourceLabel = (src: string) => {
  if (src === 'CB') return { label: 'College Board Official', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  if (src === 'KA') return { label: 'Khan Academy', color: 'text-green-400 bg-green-500/10 border-green-500/20' };
  return { label: 'Simulated', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
};

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [dailyTime, setDailyTime] = useState<DailyTime>(60);
  const [xp, setXp] = useState(2450);
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(120);

  // Daily Progress
  const [dailyProgress, setDailyProgress] = useState({ math: false, reading: false, writing: false, vocab: false });

  // Wrong Question Book (persisted in localStorage)
  const [wrongBook, setWrongBook] = useState<WrongEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('sat_wrong_book') || '[]'); } catch { return []; }
  });
  const saveWrongBook = (wb: WrongEntry[]) => {
    setWrongBook(wb);
    localStorage.setItem('sat_wrong_book', JSON.stringify(wb));
  };

  // Drill State
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [drillMode, setDrillMode] = useState<DrillMode>('full');
  const [drillQuestions, setDrillQuestions] = useState<Question[]>([]);
  const [drillQIdx, setDrillQIdx] = useState(0);
  const [drillSelected, setDrillSelected] = useState<number | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<(number | null)[]>([]);
  const [drillFinalScore, setDrillFinalScore] = useState(0);
  const [showWrongBookPanel, setShowWrongBookPanel] = useState(false);

  // Adaptive difficulty: stores last session accuracy per module (persisted)
  const [lastAccuracy, setLastAccuracy] = useState<Record<string, number | null>>(() => {
    try { return JSON.parse(localStorage.getItem('sat_last_accuracy') || '{}'); } catch { return {}; }
  });
  const saveLastAccuracy = (module: string, accuracy: number) => {
    const updated = { ...lastAccuracy, [module]: accuracy };
    setLastAccuracy(updated);
    localStorage.setItem('sat_last_accuracy', JSON.stringify(updated));
  };

  // Vocab State
  const [vocabMode, setVocabMode] = useState<VocabMode>('menu');
  const [vocabLearnIdx, setVocabLearnIdx] = useState(0);
  const [vocabDailyNew] = useState(5);
  const [vocabDailyReview] = useState(10);
  const [vocabLearnedToday, setVocabLearnedToday] = useState(0);
  const [vocabReviewedToday, setVocabReviewedToday] = useState(0);
  const [vocabCardFlipped, setVocabCardFlipped] = useState(false);
  const [vocabLearnStep, setVocabLearnStep] = useState<VocabLearnStep>('intro');
  const [vocabQuizSelected, setVocabQuizSelected] = useState<number | null>(null);
  const [vocabQuizAnswered, setVocabQuizAnswered] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hey! I'm your SAT Master Tutor. Ready to crush that 1550 goal? Ask me anything about SAT Math, Reading, Writing, or Vocabulary!" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // Question count per daily time
  const questionsPerModule = dailyTime === 30 ? 5 : dailyTime === 60 ? 10 : 20;

  // ── Chat ──
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: 'System: You are an expert SAT tutor. Student is aiming for 1550. Be encouraging and clear. Respond in the same language as the user.' }] },
          ...chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] },
        ],
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || 'Oops, try again?' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Connection error. Please try again!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Start Drill ──
  const startDrill = (module: ModuleType, mode: DrillMode = 'full') => {
    if (module === 'vocab') {
      setActiveModule('vocab');
      setVocabMode('menu');
      return;
    }
    const acc = lastAccuracy[module] ?? null;
    const qs = getQuestionsForModule(module, questionsPerModule, mode === 'wrong_only', wrongBook, acc);
    if (qs.length === 0) {
      alert(mode === 'wrong_only' ? 'No wrong questions yet for this module! Complete some drills first.' : 'No questions available.');
      return;
    }
    setActiveModule(module);
    setDrillMode(mode);
    setDrillQuestions(qs);
    setDrillState('in_progress');
    setDrillQIdx(0);
    setDrillSelected(null);
    setDrillAnswers(Array(qs.length).fill(null));
  };

  const handleDrillSelect = (idx: number) => {
    if (drillSelected !== null) return;
    setDrillSelected(idx);
    const a = [...drillAnswers]; a[drillQIdx] = idx; setDrillAnswers(a);

    // Update wrong book
    const q = drillQuestions[drillQIdx];
    if (idx !== q.answer && activeModule) {
      const newEntry: WrongEntry = { questionId: q.id, module: activeModule, wrongAnswer: idx, timestamp: Date.now() };
      const updated = wrongBook.filter(e => e.questionId !== q.id).concat(newEntry);
      saveWrongBook(updated);
    } else if (idx === q.answer) {
      // Remove from wrong book if answered correctly
      const updated = wrongBook.filter(e => e.questionId !== q.id);
      saveWrongBook(updated);
    }
  };

  const handleDrillNext = () => {
    if (drillQIdx < drillQuestions.length - 1) {
      setDrillQIdx(p => p + 1); setDrillSelected(null);
    } else {
      const correct = drillAnswers.filter((a, i) => a === drillQuestions[i].answer).length;
      const accuracy = correct / drillQuestions.length;
      setDrillFinalScore(correct);
      setDrillState('completed');
      if (activeModule) {
        setDailyProgress(p => ({ ...p, [activeModule]: true }));
        saveLastAccuracy(activeModule, accuracy);
      }
      const xpReward = activeModule === 'math' ? 150 : activeModule === 'reading' ? 200 : 100;
      setXp(x => x + Math.round(xpReward * accuracy));
      setCoins(c => c + (accuracy >= 0.8 ? 20 : 5));
    }
  };

  const exitDrill = () => { setActiveModule(null); setDrillState('idle'); setDrillMode('full'); };

  // ── Vocab ──
  const handleVocabLearnNext = (knew: boolean) => {
    if (!knew) {
      const entry: WrongEntry = { questionId: `vocab_${VOCAB_BANK[vocabLearnIdx].word}`, module: 'vocab', wrongAnswer: -1, timestamp: Date.now() };
      const updated = wrongBook.filter(e => e.questionId !== entry.questionId).concat(entry);
      saveWrongBook(updated);
    }
    if (vocabLearnIdx < vocabDailyNew - 1) {
      setVocabLearnIdx(p => p + 1);
      setVocabCardFlipped(false);
      setVocabLearnStep('intro');
      setVocabQuizSelected(null);
      setVocabQuizAnswered(false);
    } else {
      setVocabLearnedToday(vocabDailyNew);
      setDailyProgress(p => ({ ...p, vocab: true }));
      setXp(x => x + 50); setCoins(c => c + 10);
      setVocabMode('menu');
    }
  };

  const handleVocabQuizSelect = (idx: number) => {
    if (vocabQuizAnswered) return;
    setVocabQuizSelected(idx);
    setVocabQuizAnswered(true);
    const word = VOCAB_BANK[vocabLearnIdx];
    const correct = idx === word.answer;
    if (!correct) {
      const entry: WrongEntry = { questionId: `vocab_${word.word}`, module: 'vocab', wrongAnswer: idx, timestamp: Date.now() };
      const updated = wrongBook.filter(e => e.questionId !== entry.questionId).concat(entry);
      saveWrongBook(updated);
    } else {
      const updated = wrongBook.filter(e => e.questionId !== `vocab_${word.word}`);
      saveWrongBook(updated);
    }
  };

  const currentDrillQ = drillQuestions[drillQIdx];
  const wrongCountByModule = (m: ModuleType) => wrongBook.filter(e => e.module === m).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
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
              {([
                { time: 30, label: '30 min — 5 Q/module' },
                { time: 60, label: '60 min — 10 Q/module' },
                { time: 120, label: '120 min — 20 Q/module' },
              ] as { time: DailyTime; label: string }[]).map(({ time, label }) => (
                <button key={time} onClick={() => setDailyTime(time)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${dailyTime === time ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-white/70 hover:bg-white/5 border border-transparent'}`}>
                  <div className="flex items-center gap-3"><Clock className="w-4 h-4" />{label}</div>
                  {dailyTime === time && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Wrong Book Summary */}
          <div className="mt-6 px-2">
            <button onClick={() => setShowWrongBookPanel(p => !p)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all">
              <div className="flex items-center gap-3"><AlertCircle className="w-4 h-4" />Wrong Book</div>
              <span className="bg-red-500/20 px-2 py-0.5 rounded-full text-xs font-bold">{wrongBook.length}</span>
            </button>
            {showWrongBookPanel && (
              <div className="mt-2 px-2 space-y-1 text-xs text-white/60">
                {(['math', 'reading', 'writing', 'vocab'] as ModuleType[]).map(m => (
                  <div key={m} className="flex justify-between px-3 py-1.5 bg-white/5 rounded-lg">
                    <span className="capitalize">{m}</span>
                    <span className="text-red-400 font-bold">{wrongCountByModule(m)} wrong</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">

            {/* ── Dashboard ── */}
            {currentView === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                  <h2 className="text-2xl font-bold mb-6">Your Journey to 1550</h2>
                  <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white/60">
                    <span>PSAT: 1230</span>
                    <span className="text-purple-400 font-bold text-lg">Current: 1310</span>
                    <span>Goal: 1550</span>
                  </div>
                </div>

                {/* Today's Progress */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-400" />Today's Check-in</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <ProgressBadge label="Math" done={dailyProgress.math} color="blue" wrongCount={wrongCountByModule('math')} />
                    <ProgressBadge label="Reading" done={dailyProgress.reading} color="purple" wrongCount={wrongCountByModule('reading')} />
                    <ProgressBadge label="Writing" done={dailyProgress.writing} color="green" wrongCount={wrongCountByModule('writing')} />
                    <ProgressBadge label="Vocab" done={dailyProgress.vocab} color="yellow" wrongCount={wrongCountByModule('vocab')} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                    <span>Daily target: {questionsPerModule} questions per module ({dailyTime} min)</span>
                    <span>{Object.values(dailyProgress).filter(Boolean).length}/4 modules done</span>
                  </div>
                  <button onClick={() => setCurrentView('practice')} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    Go to 4-Module Arena <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── 4-Module Arena ── */}
            {currentView === 'practice' && (
              <motion.div key="practice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">4-Module Arena</h2>
                  <div className="text-sm text-white/50">{questionsPerModule} Q/module · {dailyTime} min</div>
                </div>

                {/* Drill In Progress */}
                {drillState === 'in_progress' && activeModule && activeModule !== 'vocab' && currentDrillQ && (
                  <div className={`rounded-3xl p-6 border ${activeModule === 'math' ? 'bg-blue-900/20 border-blue-500/30' : activeModule === 'reading' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={exitDrill} className="flex items-center gap-2 text-white/50 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <div className="flex items-center gap-3">
                        {drillMode === 'wrong_only' && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">Wrong Book Mode</span>}
                        <span className="text-sm text-white/60 font-bold">Q {drillQIdx + 1} / {drillQuestions.length}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full mb-4 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${activeModule === 'math' ? 'bg-blue-400' : activeModule === 'reading' ? 'bg-purple-400' : 'bg-green-400'}`} style={{ width: `${(drillQIdx / drillQuestions.length) * 100}%` }} />
                    </div>
                    {/* Source badge */}
                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${sourceLabel(currentDrillQ.source).color}`}>{sourceLabel(currentDrillQ.source).label}</span>
                      {currentDrillQ.domain && <span className="ml-2 text-xs text-white/40">{currentDrillQ.domain} · {currentDrillQ.skill}</span>}
                    </div>
                    {/* Passage */}
                    {currentDrillQ.passage && (
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-4 text-white/80 text-sm leading-relaxed italic">
                        {currentDrillQ.passage}
                      </div>
                    )}
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
                        <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mb-2"><Lightbulb className="w-4 h-4" /> Explanation</div>
                          <p className="text-white/80 text-sm leading-relaxed">{currentDrillQ.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Drill Completed */}
                {drillState === 'completed' && activeModule !== 'vocab' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold mb-2 text-yellow-400">{drillFinalScore} / {drillQuestions.length}</div>
                    <p className="text-white/70 mb-2">Module Completed! Daily check-in recorded.</p>
                    {/* Adaptive difficulty feedback */}
                    {(() => {
                      const acc = drillFinalScore / drillQuestions.length;
                      const nextDiff = acc >= 0.8 ? 'Hard' : acc >= 0.5 ? 'Medium' : 'Easy';
                      const nextColor = acc >= 0.8 ? 'text-red-400' : acc >= 0.5 ? 'text-yellow-400' : 'text-green-400';
                      const msg = acc >= 0.8
                        ? 'Excellent! Next session will include more Hard questions.'
                        : acc >= 0.5
                        ? 'Good job! Next session will focus on Medium difficulty.'
                        : 'Keep practicing! Next session will focus on Easy questions to build confidence.';
                      return (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-sm">
                          <span className="text-white/60">Adaptive Difficulty: </span>
                          <span className={`font-bold ${nextColor}`}>{nextDiff}</span>
                          <p className="text-white/50 text-xs mt-1">{msg}</p>
                        </div>
                      );
                    })()}
                    {wrongCountByModule(activeModule!) > 0 && (
                      <p className="text-red-400 text-sm mb-6">{wrongCountByModule(activeModule!)} questions added to your Wrong Book.</p>
                    )}
                    <div className="flex justify-center gap-4 flex-wrap">
                      <button onClick={() => setDrillState('review')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Review All</button>
                      {wrongCountByModule(activeModule!) > 0 && (
                        <button onClick={() => startDrill(activeModule!, 'wrong_only')} className="px-6 py-3 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold rounded-xl transition-colors flex items-center gap-2 border border-red-500/30"><AlertCircle className="w-4 h-4" /> Practice Wrong Only</button>
                      )}
                      <button onClick={exitDrill} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Back to Arena</button>
                    </div>
                  </div>
                )}

                {/* Drill Review */}
                {drillState === 'review' && activeModule !== 'vocab' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2"><BookMarked className="w-5 h-5 text-purple-400" /> Review Mode</h3>
                      <button onClick={exitDrill} className="text-white/50 hover:text-white text-sm">Close</button>
                    </div>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {drillQuestions.map((q, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${drillAnswers[i] === q.answer ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                          <div className="flex items-start gap-3">
                            {drillAnswers[i] === q.answer ? <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />}
                            <div className="flex-1">
                              <div className="mb-1"><span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${sourceLabel(q.source).color}`}>{sourceLabel(q.source).label}</span></div>
                              {q.passage && <p className="text-white/50 text-xs italic mb-2 leading-relaxed">{q.passage.substring(0, 120)}...</p>}
                              <p className="font-medium mb-2 text-sm">{q.question}</p>
                              <p className="text-sm text-white/60 mb-1">Your answer: <span className="text-white/80">{drillAnswers[i] !== null ? q.options[drillAnswers[i] as number] : 'None'}</span></p>
                              <p className="text-sm text-green-400 mb-3">Correct: <span className="font-bold">{q.options[q.answer]}</span></p>
                              <div className="bg-black/30 p-3 rounded-lg text-sm text-white/80 border border-yellow-500/10">
                                <span className="text-yellow-400 font-bold mr-2">Explanation:</span>{q.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocab Module */}
                {activeModule === 'vocab' && (
                  <div className="space-y-4">
                    <button onClick={exitDrill} className="flex items-center gap-2 text-white/50 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" /> Back to Arena</button>

                    {vocabMode === 'menu' && (
                      <div className="bg-white rounded-3xl p-6 text-black">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-20 bg-orange-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl">SAT</div>
                          <div>
                            <h3 className="text-2xl font-bold">SAT 词汇</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(vocabLearnedToday / VOCAB_BANK.length) * 100}%` }} /></div>
                              <span className="text-xs text-gray-500">{vocabLearnedToday} / {VOCAB_BANK.length}</span>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold mb-4">今日计划</h4>
                        <div className="flex justify-around mb-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">需新学</div>
                            <div className="text-4xl font-bold">{Math.max(0, vocabDailyNew - vocabLearnedToday)} <span className="text-sm font-normal text-gray-500">词</span></div>
                          </div>
                          <div className="w-px bg-gray-200" />
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">需复习</div>
                            <div className="text-4xl font-bold">{Math.max(0, vocabDailyReview - vocabReviewedToday)} <span className="text-sm font-normal text-gray-500">词</span></div>
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-500 mb-4 flex items-center justify-center gap-1"><Clock className="w-4 h-4" /> 预计用时 11 分钟</div>
                        <div className="space-y-3">
                          <button onClick={() => { setVocabLearnIdx(0); setVocabCardFlipped(false); setVocabMode('learn'); }} disabled={vocabLearnedToday >= vocabDailyNew} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-blue-600/30">
                            {vocabLearnedToday >= vocabDailyNew ? '今日已完成打卡！' : '开始背单词吧！'}
                          </button>
                          <button onClick={() => setVocabMode('review_cards')} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors">
                            复习闪卡 (Flashcards)
                          </button>
                        </div>
                      </div>
                    )}

                    {vocabMode === 'learn' && (() => {
                      const word = VOCAB_BANK[vocabLearnIdx];
                      return (
                        <div className="bg-white rounded-3xl p-6 text-black min-h-[500px] flex flex-col">
                          <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
                            <span>新词 {vocabLearnIdx + 1}/{vocabDailyNew} · {vocabLearnStep === 'intro' ? '学习' : '考题练习'}</span>
                            <button onClick={() => setVocabMode('menu')}><XCircle className="w-6 h-6" /></button>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${((vocabLearnIdx + (vocabLearnStep === 'quiz' ? 0.5 : 0)) / vocabDailyNew) * 100}%` }} />
                          </div>

                          {vocabLearnStep === 'intro' && (
                            <>
                              <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <h2 className="text-5xl font-bold mb-2">{word.word}</h2>
                                <p className="text-gray-400 text-sm mb-6 italic">SAT High-Frequency Word</p>
                                <div className="bg-gray-50 rounded-2xl p-6 w-full mb-4 text-left">
                                  <p className="text-base font-semibold text-gray-700 mb-1">Definition</p>
                                  <p className="text-lg font-medium text-gray-900 mb-3">{word.definition}</p>
                                  <p className="text-sm text-gray-500 italic border-t border-gray-100 pt-3">"{word.example}"</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 w-full text-left">
                                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1"><Lightbulb className="w-4 h-4" /> 记忆技巧</div>
                                  <p className="text-sm text-blue-800">{word.trick}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => { setVocabLearnStep('quiz'); setVocabQuizSelected(null); setVocabQuizAnswered(false); }}
                                className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-blue-600/30"
                              >
                                做一道考题巩固 →
                              </button>
                            </>
                          )}

                          {vocabLearnStep === 'quiz' && (
                            <>
                              <div className="flex-1 flex flex-col">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                  <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">SAT-Style · Words in Context</p>
                                  <p className="text-sm text-gray-800 leading-relaxed">
                                    {word.passage.split('______').map((part, i, arr) => (
                                      <span key={i}>{part}{i < arr.length - 1 && <span className="inline-block bg-gray-200 text-gray-200 rounded px-4 mx-0.5 font-bold">______</span>}</span>
                                    ))}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">Which choice completes the text with the most logical and precise word?</p>
                                <div className="space-y-2">
                                  {word.options.map((opt, i) => {
                                    const isSelected = vocabQuizSelected === i;
                                    const isCorrect = i === word.answer;
                                    let cls = 'w-full text-left px-5 py-3 rounded-xl border-2 font-medium transition-all text-sm ';
                                    if (!vocabQuizAnswered) {
                                      cls += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800';
                                    } else if (isCorrect) {
                                      cls += 'border-green-500 bg-green-50 text-green-800';
                                    } else if (isSelected) {
                                      cls += 'border-red-400 bg-red-50 text-red-700';
                                    } else {
                                      cls += 'border-gray-100 bg-gray-50 text-gray-400';
                                    }
                                    return (
                                      <button key={i} className={cls} onClick={() => handleVocabQuizSelect(i)}>
                                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                                        {vocabQuizAnswered && isCorrect && <span className="ml-2 text-green-600">✓</span>}
                                        {vocabQuizAnswered && isSelected && !isCorrect && <span className="ml-2 text-red-500">✗</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                                {vocabQuizAnswered && (
                                  <div className={`mt-4 rounded-xl p-4 border ${vocabQuizSelected === word.answer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <p className={`text-sm font-bold mb-1 ${vocabQuizSelected === word.answer ? 'text-green-700' : 'text-red-700'}`}>
                                      {vocabQuizSelected === word.answer ? '✓ Correct!' : `✗ The answer is ${word.options[word.answer]}`}
                                    </p>
                                    <p className="text-xs text-gray-600">{word.explanation}</p>
                                  </div>
                                )}
                              </div>
                              {vocabQuizAnswered && (
                                <button
                                  onClick={() => handleVocabLearnNext(vocabQuizSelected === word.answer)}
                                  className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors"
                                >
                                  {vocabLearnIdx < vocabDailyNew - 1 ? '下一个单词 →' : '完成今日词汇！'}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()}

                    {vocabMode === 'review_cards' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold">Flashcard Review</h3>
                          <button onClick={() => setVocabMode('menu')} className="text-white/50 hover:text-white text-sm">Back</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
                          {VOCAB_BANK.slice(0, 20).map((v, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer" onClick={(e) => { const el = e.currentTarget.querySelector('.back') as HTMLElement; if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none'; }}>
                              <div className="text-lg font-bold mb-2">{v.word}</div>
                              <div className="back hidden text-white/70 text-sm">
                                <p className="mb-1">{v.definition}</p>
                                <p className="italic text-white/50 text-xs">"{v.example}"</p>
                              </div>
                              <div className="text-white/30 text-xs mt-2">Tap to reveal</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Module Selection Grid */}
                {drillState === 'idle' && activeModule === null && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModuleCard title="Math" desc={`Algebra & Advanced Math · ${questionsPerModule} Q today`} icon={<Brain />} color="blue" done={dailyProgress.math} wrongCount={wrongCountByModule('math')} onClick={() => startDrill('math')} onWrongOnly={() => startDrill('math', 'wrong_only')} />
                    <ModuleCard title="Reading" desc={`Evidence & Words in Context · ${questionsPerModule} Q today`} icon={<BookOpen />} color="purple" done={dailyProgress.reading} wrongCount={wrongCountByModule('reading')} onClick={() => startDrill('reading')} onWrongOnly={() => startDrill('reading', 'wrong_only')} />
                    <ModuleCard title="Writing" desc={`Standard English Conventions · ${questionsPerModule} Q today`} icon={<Target />} color="green" done={dailyProgress.writing} wrongCount={wrongCountByModule('writing')} onClick={() => startDrill('writing')} onWrongOnly={() => startDrill('writing', 'wrong_only')} />
                    <ModuleCard title="Vocabulary" desc={`Daily words & Spaced Repetition · ${vocabDailyNew} new words`} icon={<BookMarked />} color="yellow" done={dailyProgress.vocab} wrongCount={wrongCountByModule('vocab')} onClick={() => startDrill('vocab')} onWrongOnly={() => startDrill('vocab', 'wrong_only')} />
                  </div>
                )}
              </motion.div>
            )}

            {/* ── AI Tutor Chat ── */}
            {currentView === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col h-[calc(100vh-12rem)]">
                <h2 className="text-2xl font-bold mb-4">AI Tutor Chat</h2>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/90'}`}>{m.text}</div>
                    </div>
                  ))}
                  {isTyping && <div className="flex justify-start"><div className="bg-white/10 px-4 py-3 rounded-2xl text-white/50 text-sm">Thinking...</div></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-3">
                  <input value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask your SAT tutor..." className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500" />
                  <button onClick={handleSendMessage} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Send</button>
                </div>
              </motion.div>
            )}

            {/* ── Boss Fights ── */}
            {currentView === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Boss Fights (Periodic Review)</h2>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30">High Stakes</span>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-3xl p-8 text-center">
                  <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Weekend Mini-Mock</h3>
                  <p className="text-white/70 max-w-md mx-auto mb-8">Test your week's progress under timed conditions. Defeating this boss grants massive XP.</p>
                  <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors w-full md:w-auto">Enter Boss Room (45 mins)</button>
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

function ProgressBadge({ label, done, color, wrongCount }: { label: string; done: boolean; color: 'blue' | 'purple' | 'green' | 'yellow'; wrongCount: number }) {
  const colorMap = {
    blue: done ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/40',
    purple: done ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-white/40',
    green: done ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/40',
    yellow: done ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/40',
  };
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${colorMap[color]} transition-all relative`}>
      {done ? <CheckCircle2 className="w-6 h-6 mb-1" /> : <div className="w-6 h-6 rounded-full border-2 border-current mb-1 opacity-50" />}
      <span className="text-xs font-bold">{label}</span>
      {wrongCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wrongCount}</span>}
    </div>
  );
}

function ModuleCard({ title, desc, icon, color, done, wrongCount, onClick, onWrongOnly }: { title: string; desc: string; icon: ReactNode; color: 'blue' | 'purple' | 'green' | 'yellow'; done: boolean; wrongCount: number; onClick: () => void; onWrongOnly: () => void }) {
  const colorMap = {
    blue: { grad: 'from-blue-500/20 to-blue-900/20', border: 'border-blue-500/30 hover:border-blue-400', text: 'text-blue-400', btn: 'bg-blue-400 hover:bg-blue-300' },
    purple: { grad: 'from-purple-500/20 to-purple-900/20', border: 'border-purple-500/30 hover:border-purple-400', text: 'text-purple-400', btn: 'bg-purple-400 hover:bg-purple-300' },
    green: { grad: 'from-green-500/20 to-green-900/20', border: 'border-green-500/30 hover:border-green-400', text: 'text-green-400', btn: 'bg-green-400 hover:bg-green-300' },
    yellow: { grad: 'from-yellow-500/20 to-yellow-900/20', border: 'border-yellow-500/30 hover:border-yellow-400', text: 'text-yellow-400', btn: 'bg-yellow-400 hover:bg-yellow-300' },
  };
  const c = colorMap[color];
  return (
    <div className={`bg-gradient-to-br ${c.grad} border ${c.border} rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all`}>
      {done && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done Today</div>}
      <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 ${c.text}`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-4 flex-1">{desc}</p>
      <div className="flex gap-2 mt-auto">
        <button onClick={onClick} className={`flex-1 py-3 ${c.btn} text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm`}>
          <Play className="w-4 h-4" /> Start
        </button>
        {wrongCount > 0 && (
          <button onClick={onWrongOnly} className="px-3 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold rounded-xl transition-colors flex items-center gap-1 text-xs border border-red-500/30">
            <AlertCircle className="w-4 h-4" />{wrongCount}
          </button>
        )}
      </div>
    </div>
  );
}

function RewardCard({ title, cost, currentCoins, onRedeem, icon }: { title: string; cost: number; currentCoins: number; onRedeem: () => void; icon: ReactNode }) {
  const canAfford = currentCoins >= cost;
  return (
    <div className={`bg-white/5 border rounded-3xl p-6 flex flex-col items-center text-center transition-all ${canAfford ? 'border-yellow-500/30 hover:bg-white/10' : 'border-white/10 opacity-60'}`}>
      <div className="mb-4 p-4 bg-black/20 rounded-full">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="flex items-center gap-1 text-yellow-400 font-bold mb-6"><Coins className="w-4 h-4" />{cost} Coins</div>
      <button onClick={onRedeem} disabled={!canAfford} className={`w-full py-3 rounded-xl font-bold transition-colors ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
        {canAfford ? 'Redeem Reward' : 'Not Enough Coins'}
      </button>
    </div>
  );
}
