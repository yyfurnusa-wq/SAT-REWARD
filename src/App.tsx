import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Target, Zap, Clock, Trophy,
  ChevronRight, MessageSquare, Play,
  CheckCircle2, Flame, BookOpen, Settings,
  BarChart3, ShieldAlert, Coins, Gift, Wallet,
  CreditCard, XCircle, ArrowLeft, Star
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ViewState = 'dashboard' | 'practice' | 'review' | 'chat' | 'rewards' | 'vocab';
type DailyTime = 30 | 60 | 120;
type ChallengeState = 'idle' | 'in_progress' | 'completed';
type DrillState = 'idle' | 'in_progress' | 'completed';
type VocabMode = 'menu' | 'learn' | 'review' | 'daily_test' | 'test_result';

// ─────────────────────────────────────────────
// Question Banks
// ─────────────────────────────────────────────
const DAILY_QUESTIONS = [
  { id: 1, subject: 'Math', question: 'If 3x + 7 = 22, what is the value of x?', options: ['3', '5', '7', '9'], answer: 1 },
  { id: 2, subject: 'Math', question: 'A rectangle has a length of 12 and a width of 5. What is its area?', options: ['34', '60', '17', '120'], answer: 1 },
  { id: 3, subject: 'Math', question: 'What is the slope of the line passing through (2, 4) and (6, 12)?', options: ['1', '3', '2', '4'], answer: 2 },
  { id: 4, subject: 'Math', question: 'If f(x) = 2x² - 3, what is f(3)?', options: ['9', '15', '12', '18'], answer: 1 },
  { id: 5, subject: 'Math', question: 'Solve: 2(x - 4) = 3x + 1. What is x?', options: ['-9', '9', '-7', '7'], answer: 0 },
  { id: 6, subject: 'Reading', question: 'Which word is closest in meaning to "meticulous"?', options: ['Careless', 'Careful', 'Hasty', 'Vague'], answer: 1 },
  { id: 7, subject: 'Reading', question: 'A passage states: "Despite the heavy rain, the event proceeded as planned." What does this suggest about the organizers?', options: ['They were unprepared', 'They were determined', 'They were reckless', 'They were indifferent'], answer: 1 },
  { id: 8, subject: 'Reading', question: 'Which sentence uses a comma correctly?', options: ['She ran quickly, and she won the race.', 'She ran quickly and, she won the race.', 'She ran, quickly and she won the race.', 'She, ran quickly and she won the race.'], answer: 0 },
  { id: 9, subject: 'Writing', question: 'Choose the grammatically correct sentence:', options: ['Each of the students have submitted their assignment.', 'Each of the students has submitted their assignment.', 'Each of the students have submitted his assignment.', 'Each of the students has submitted his assignment.'], answer: 1 },
  { id: 10, subject: 'Writing', question: 'Which transition word best fills the blank? "The experiment failed. ___, the team learned valuable lessons."', options: ['Therefore', 'However', 'Nevertheless', 'Furthermore'], answer: 2 },
];

const MATH_DRILL_QUESTIONS = [
  { question: 'Solve for x: 5x - 3 = 2x + 9', options: ['2', '3', '4', '6'], answer: 2 },
  { question: 'What is the y-intercept of y = 3x - 7?', options: ['3', '-7', '7', '-3'], answer: 1 },
  { question: 'Simplify: (2x + 3)(x - 4)', options: ['2x² - 5x - 12', '2x² + 5x - 12', '2x² - 5x + 12', '2x² + 5x + 12'], answer: 0 },
  { question: 'If a line has slope 2 and passes through (1, 5), what is its equation?', options: ['y = 2x + 3', 'y = 2x + 5', 'y = 2x - 3', 'y = 2x + 1'], answer: 0 },
  { question: 'Solve: |2x - 4| = 6', options: ['x = 5 or x = -1', 'x = 5 or x = 1', 'x = -5 or x = 1', 'x = 5 or x = -5'], answer: 0 },
  { question: 'What is the sum of the roots of x² - 7x + 10 = 0?', options: ['10', '-7', '7', '-10'], answer: 2 },
  { question: 'A car travels 240 miles in 4 hours. What is its speed in miles per hour?', options: ['40', '50', '60', '80'], answer: 2 },
  { question: 'If 20% of x is 50, what is x?', options: ['100', '200', '250', '300'], answer: 2 },
];

const READING_DRILL_QUESTIONS = [
  { question: 'The word "ephemeral" most nearly means:', options: ['Long-lasting', 'Short-lived', 'Mysterious', 'Powerful'], answer: 1 },
  { question: 'A passage says: "The scientist\'s findings were met with skepticism." What does "skepticism" mean?', options: ['Excitement', 'Doubt', 'Support', 'Confusion'], answer: 1 },
  { question: 'Which choice provides the best evidence for a claim about the author\'s tone?', options: ['A neutral description of events', 'Enthusiastic praise for the subject', 'A critical analysis with supporting data', 'A personal anecdote'], answer: 2 },
  { question: '"Command of Evidence" questions ask you to:', options: ['Summarize the passage', 'Find the line that best supports a previous answer', 'Identify the main idea', 'Correct grammatical errors'], answer: 1 },
  { question: 'The word "pragmatic" most nearly means:', options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'], answer: 1 },
  { question: 'In context, "the policy was contentious" means the policy was:', options: ['Popular', 'Controversial', 'Effective', 'Outdated'], answer: 1 },
];

const WRITING_DRILL_QUESTIONS = [
  { question: 'Choose the correct version: "Neither the students nor the teacher ___ ready."', options: ['were', 'was', 'are', 'have been'], answer: 1 },
  { question: 'Which sentence is punctuated correctly?', options: ['I love to read; however I prefer fiction.', 'I love to read, however I prefer fiction.', 'I love to read; however, I prefer fiction.', 'I love to read however, I prefer fiction.'], answer: 2 },
  { question: 'Choose the most concise version:', options: ['Due to the fact that it was raining, we stayed inside.', 'Because it was raining, we stayed inside.', 'On account of the rain, we stayed inside.', 'In light of the rainy conditions, we stayed inside.'], answer: 1 },
  { question: 'Which word correctly completes: "The data ___ inconclusive."', options: ['was', 'were', 'is', 'are'], answer: 1 },
  { question: 'Identify the dangling modifier: which sentence has an error?', options: ['Running down the street, the dog chased me.', 'Running down the street, I was chased by the dog.', 'The dog chased me as I ran down the street.', 'I ran down the street while the dog chased me.'], answer: 0 },
  { question: 'Choose the correct pronoun: "Between you and ___, this is a secret."', options: ['I', 'me', 'myself', 'we'], answer: 1 },
];

// ─────────────────────────────────────────────
// Vocabulary Bank (50 SAT words)
// ─────────────────────────────────────────────
const VOCAB_BANK = [
  { word: 'Aberrant', definition: 'Departing from an accepted standard; abnormal.', example: 'The scientist noted aberrant behavior in the test subjects.' },
  { word: 'Benevolent', definition: 'Well-meaning and kindly; charitable.', example: 'The benevolent donor funded the entire scholarship program.' },
  { word: 'Cacophony', definition: 'A harsh, discordant mixture of sounds.', example: 'The cacophony of the construction site made it hard to concentrate.' },
  { word: 'Dearth', definition: 'A scarcity or lack of something.', example: 'There was a dearth of qualified candidates for the position.' },
  { word: 'Ebullient', definition: 'Cheerful and full of energy; exuberant.', example: 'Her ebullient personality lit up every room she entered.' },
  { word: 'Facetious', definition: 'Treating serious issues with inappropriate humor.', example: 'His facetious remarks during the meeting annoyed his colleagues.' },
  { word: 'Garrulous', definition: 'Excessively talkative, especially on trivial matters.', example: 'The garrulous neighbor talked for an hour about nothing important.' },
  { word: 'Harbinger', definition: 'A person or thing that announces or signals the approach of another.', example: 'Dark clouds are a harbinger of the coming storm.' },
  { word: 'Iconoclast', definition: 'A person who attacks cherished beliefs or institutions.', example: 'The iconoclast challenged every tradition the company held sacred.' },
  { word: 'Juxtapose', definition: 'To place two things side by side for contrasting effect.', example: 'The artist juxtaposed bright colors with dark shadows.' },
  { word: 'Laconic', definition: 'Using very few words; brief and concise.', example: 'His laconic reply of "Fine" ended the conversation.' },
  { word: 'Malleable', definition: 'Easily influenced; adaptable.', example: 'Young minds are malleable and shaped by their environment.' },
  { word: 'Nefarious', definition: 'Wicked or criminal.', example: 'The villain\'s nefarious plan was finally uncovered.' },
  { word: 'Obfuscate', definition: 'To render obscure, unclear, or unintelligible.', example: 'The politician tried to obfuscate the truth with vague statements.' },
  { word: 'Pernicious', definition: 'Having a harmful effect, especially in a gradual way.', example: 'The pernicious influence of misinformation spread slowly.' },
  { word: 'Querulous', definition: 'Complaining in a petulant or whining manner.', example: 'The querulous child complained about everything on the trip.' },
  { word: 'Recalcitrant', definition: 'Having an obstinately uncooperative attitude.', example: 'The recalcitrant student refused to follow any instructions.' },
  { word: 'Sycophant', definition: 'A person who acts obsequiously toward someone important.', example: 'The CEO was surrounded by sycophants who never disagreed with him.' },
  { word: 'Tenacious', definition: 'Tending to keep a firm hold; persistent.', example: 'Her tenacious work ethic helped her overcome every obstacle.' },
  { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern society.' },
  { word: 'Vacuous', definition: 'Having or showing a lack of thought or intelligence.', example: 'The vacuous celebrity offered nothing of substance in the interview.' },
  { word: 'Wane', definition: 'To decrease in vigor, power, or extent.', example: 'Public interest in the story began to wane after a few weeks.' },
  { word: 'Xenophobia', definition: 'Dislike of or prejudice against people from other countries.', example: 'Xenophobia can prevent societies from benefiting from diversity.' },
  { word: 'Zealous', definition: 'Having or showing great energy or enthusiasm in pursuit of a cause.', example: 'She was a zealous advocate for environmental protection.' },
  { word: 'Ambiguous', definition: 'Open to more than one interpretation; unclear.', example: 'The contract\'s ambiguous language led to a dispute.' },
  { word: 'Brevity', definition: 'Concise and exact use of words; shortness of time.', example: 'The speech was praised for its brevity and clarity.' },
  { word: 'Candid', definition: 'Truthful and straightforward; frank.', example: 'She gave a candid assessment of the project\'s weaknesses.' },
  { word: 'Didactic', definition: 'Intended to teach, particularly with moral instruction.', example: 'The didactic novel aimed to teach readers about social justice.' },
  { word: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing.', example: 'The eloquent speaker moved the entire audience to tears.' },
  { word: 'Frugal', definition: 'Sparing or economical with money or food.', example: 'Her frugal habits allowed her to save a significant amount.' },
];

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const INITIAL_SCORE = 1230;
const TARGET_SCORE = 1550;
const CURRENT_SCORE = 1310;

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [dailyTime, setDailyTime] = useState<DailyTime>(60);
  const [xp, setXp] = useState(2450);
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(120);
  const [isBossFightActive, setIsBossFightActive] = useState(false);

  // Daily Challenge
  const [challengeState, setChallengeState] = useState<ChallengeState>('idle');
  const [challengeQIdx, setChallengeQIdx] = useState(0);
  const [challengeSelected, setChallengeSelected] = useState<number | null>(null);
  const [challengeAnswers, setChallengeAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [challengeShowResult, setChallengeShowResult] = useState(false);
  const [challengeFinalScore, setChallengeFinalScore] = useState(0);

  // Targeted Drill
  const [activeDrill, setActiveDrill] = useState<'math' | 'reading' | 'writing' | null>(null);
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [drillQIdx, setDrillQIdx] = useState(0);
  const [drillSelected, setDrillSelected] = useState<number | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<(number | null)[]>([]);
  const [drillShowResult, setDrillShowResult] = useState(false);
  const [drillFinalScore, setDrillFinalScore] = useState(0);

  // Vocab
  const [vocabMode, setVocabMode] = useState<VocabMode>('menu');
  const [vocabLearnIdx, setVocabLearnIdx] = useState(0);
  const [vocabTestQuestions, setVocabTestQuestions] = useState<typeof VOCAB_BANK>([]);
  const [vocabTestIdx, setVocabTestIdx] = useState(0);
  const [vocabTestSelected, setVocabTestSelected] = useState<number | null>(null);
  const [vocabTestAnswers, setVocabTestAnswers] = useState<(number | null)[]>([]);
  const [vocabTestScore, setVocabTestScore] = useState(0);
  const [vocabDailyDone, setVocabDailyDone] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<Set<number>>(new Set());

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

  // ── Daily Challenge ───────────────────────
  const startChallenge = () => {
    setChallengeState('in_progress');
    setChallengeQIdx(0);
    setChallengeSelected(null);
    setChallengeAnswers(Array(10).fill(null));
    setChallengeShowResult(false);
  };
  const handleChallengeSelect = (idx: number) => {
    if (challengeSelected !== null) return;
    setChallengeSelected(idx);
    const a = [...challengeAnswers]; a[challengeQIdx] = idx; setChallengeAnswers(a);
  };
  const handleChallengeNext = () => {
    if (challengeQIdx < DAILY_QUESTIONS.length - 1) {
      setChallengeQIdx(p => p + 1); setChallengeSelected(null);
    } else {
      const correct = challengeAnswers.filter((a, i) => a === DAILY_QUESTIONS[i].answer).length;
      setChallengeFinalScore(correct);
      setChallengeShowResult(true);
      setChallengeState('completed');
      if (correct >= 8) { setCoins(c => c + 20); setXp(x => x + 100); } else { setXp(x => x + 30); }
    }
  };

  // ── Targeted Drill ────────────────────────
  const getDrillQuestions = () => {
    if (activeDrill === 'math') return MATH_DRILL_QUESTIONS;
    if (activeDrill === 'reading') return READING_DRILL_QUESTIONS;
    return WRITING_DRILL_QUESTIONS;
  };
  const startDrill = (drill: 'math' | 'reading' | 'writing') => {
    setActiveDrill(drill);
    setDrillState('in_progress');
    setDrillQIdx(0);
    setDrillSelected(null);
    const qs = drill === 'math' ? MATH_DRILL_QUESTIONS : drill === 'reading' ? READING_DRILL_QUESTIONS : WRITING_DRILL_QUESTIONS;
    setDrillAnswers(Array(qs.length).fill(null));
    setDrillShowResult(false);
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
      setDrillShowResult(true);
      setDrillState('completed');
      const xpReward = activeDrill === 'math' ? 150 : activeDrill === 'reading' ? 200 : 100;
      setXp(x => x + Math.round(xpReward * (correct / qs.length)));
    }
  };
  const exitDrill = () => { setActiveDrill(null); setDrillState('idle'); setDrillShowResult(false); };

  // ── Vocab ─────────────────────────────────
  const startVocabTest = (daily: boolean) => {
    const shuffled = [...VOCAB_BANK].sort(() => Math.random() - 0.5).slice(0, daily ? 10 : 15);
    setVocabTestQuestions(shuffled);
    setVocabTestIdx(0);
    setVocabTestSelected(null);
    setVocabTestAnswers(Array(shuffled.length).fill(null));
    setVocabTestScore(0);
    setVocabMode(daily ? 'daily_test' : 'daily_test');
  };
  const handleVocabSelect = (idx: number) => {
    if (vocabTestSelected !== null) return;
    setVocabTestSelected(idx);
    const a = [...vocabTestAnswers]; a[vocabTestIdx] = idx; setVocabTestAnswers(a);
  };
  const handleVocabNext = () => {
    if (vocabTestIdx < vocabTestQuestions.length - 1) {
      setVocabTestIdx(p => p + 1); setVocabTestSelected(null);
    } else {
      const correct = vocabTestAnswers.filter((a, i) => {
        // correct answer is always index 0 (we'll build options with correct first then shuffle display)
        return a === vocabTestQuestions[i]._correctIdx;
      }).length;
      setVocabTestScore(correct);
      setVocabDailyDone(true);
      if (correct >= 8) { setCoins(c => c + 15); setXp(x => x + 80); } else { setXp(x => x + 20); }
      setVocabMode('test_result');
    }
  };

  // Build vocab test options for current question
  const buildVocabOptions = (qIdx: number) => {
    if (!vocabTestQuestions[qIdx]) return { options: [], correctIdx: 0 };
    const correct = vocabTestQuestions[qIdx];
    const others = VOCAB_BANK.filter(v => v.word !== correct.word).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...others].sort(() => Math.random() - 0.5);
    const correctIdx = allOptions.findIndex(o => o.word === correct.word);
    return { options: allOptions.map(o => o.definition), correctIdx };
  };

  // Pre-build options for each test question (stable per session)
  const [vocabOptions, setVocabOptions] = useState<{ options: string[]; correctIdx: number }[]>([]);
  useEffect(() => {
    if (vocabTestQuestions.length > 0) {
      const opts = vocabTestQuestions.map((q) => {
        const others = VOCAB_BANK.filter(v => v.word !== q.word).sort(() => Math.random() - 0.5).slice(0, 3);
        const allOptions = [q, ...others].sort(() => Math.random() - 0.5);
        const correctIdx = allOptions.findIndex(o => o.word === q.word);
        // attach correctIdx to question for scoring
        (q as any)._correctIdx = correctIdx;
        return { options: allOptions.map(o => o.definition), correctIdx };
      });
      setVocabOptions(opts);
    }
  }, [vocabTestQuestions]);

  const drillQuestions = getDrillQuestions();
  const currentDrillQ = drillQuestions[drillQIdx];
  const currentChallengeQ = DAILY_QUESTIONS[challengeQIdx];

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
            { view: 'practice', icon: <Target />, label: 'Practice Arena' },
            { view: 'vocab', icon: <BookOpen />, label: 'Vocabulary' },
            { view: 'review', icon: <ShieldAlert />, label: 'Boss Fights' },
            { view: 'chat', icon: <MessageSquare />, label: 'AI Tutor Chat' },
            { view: 'rewards', icon: <Gift />, label: 'Rewards Store' },
          ] as { view: ViewState; icon: ReactNode; label: string }[]).map(({ view, icon, label }) => (
            <SidebarButton key={view} icon={icon} label={label} active={currentView === view} onClick={() => { setCurrentView(view); exitDrill(); setVocabMode('menu'); }} />
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
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((CURRENT_SCORE - INITIAL_SCORE) / (TARGET_SCORE - INITIAL_SCORE)) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white/60">
                    <span>PSAT: {INITIAL_SCORE}</span>
                    <span className="text-purple-400 font-bold text-lg">Current: {CURRENT_SCORE}</span>
                    <span>Goal: {TARGET_SCORE}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-500/20 rounded-lg"><Play className="w-5 h-5 text-purple-400" /></div><h3 className="text-xl font-bold">Today's Mission</h3></div>
                    <p className="text-white/70 mb-6">You committed to {dailyTime} minutes today.</p>
                    <button onClick={() => setCurrentView('practice')} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2">Start Mission <ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-500/20 rounded-lg"><Brain className="w-5 h-5 text-blue-400" /></div><h3 className="text-xl font-bold">Ask Master Tutor</h3></div>
                    <div className="flex-1 bg-black/20 rounded-xl p-4 mb-4 text-sm text-white/80 italic flex items-center justify-center text-center border border-white/5">"Stuck on a math problem? Drop it here and we'll break it down together!"</div>
                    <button onClick={() => setCurrentView('chat')} className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Open Chat</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Math Score" value="680" target="800" trend="+40" />
                  <StatCard label="Reading Score" value="630" target="750" trend="+40" />
                  <StatCard label="Questions Done" value="1,204" target="3,000" />
                  <StatCard label="Bosses Defeated" value="4" target="10" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400" />Mastery Roadmap</h3>
                  <div className="space-y-4">
                    <RoadmapItem title="Phase 1: Foundation (1230 → 1350)" status="completed" />
                    <RoadmapItem title="Phase 2: Advanced Concepts (1350 → 1450)" status="active" progress={60} />
                    <RoadmapItem title="Phase 3: Speed & Accuracy (1450 → 1500)" status="locked" />
                    <RoadmapItem title="Phase 4: The Final Push (1500 → 1550+)" status="locked" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Practice Arena ── */}
            {currentView === 'practice' && (
              <motion.div key="practice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Practice Arena</h2>

                {/* Drill in progress */}
                {drillState === 'in_progress' && activeDrill && (
                  <div className={`rounded-3xl p-6 border ${activeDrill === 'math' ? 'bg-blue-900/20 border-blue-500/30' : activeDrill === 'reading' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={exitDrill} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <span className="text-sm text-white/60 font-bold">Q {drillQIdx + 1} / {drillQuestions.length}</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full mb-6 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${activeDrill === 'math' ? 'bg-blue-400' : activeDrill === 'reading' ? 'bg-purple-400' : 'bg-green-400'}`} style={{ width: `${(drillQIdx / drillQuestions.length) * 100}%` }} />
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
                      <div className="flex items-center justify-between">
                        <span className={`font-bold flex items-center gap-2 ${drillSelected === currentDrillQ.answer ? 'text-green-400' : 'text-red-400'}`}>
                          {drillSelected === currentDrillQ.answer ? <><CheckCircle2 className="w-5 h-5" />Correct!</> : <><XCircle className="w-5 h-5" />Incorrect</>}
                        </span>
                        <button onClick={handleDrillNext} className={`px-6 py-2 font-bold rounded-xl transition-colors text-black ${activeDrill === 'math' ? 'bg-blue-400 hover:bg-blue-300' : activeDrill === 'reading' ? 'bg-purple-400 hover:bg-purple-300' : 'bg-green-400 hover:bg-green-300'}`}>
                          {drillQIdx < drillQuestions.length - 1 ? 'Next →' : 'See Results'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Drill result */}
                {drillState === 'completed' && drillShowResult && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold mb-2 text-yellow-400">{drillFinalScore} / {drillQuestions.length}</div>
                    <p className="text-white/70 mb-6">XP earned: +{Math.round((activeDrill === 'math' ? 150 : activeDrill === 'reading' ? 200 : 100) * (drillFinalScore / drillQuestions.length))} XP</p>
                    <button onClick={exitDrill} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Back to Practice Arena</button>
                  </div>
                )}

                {/* Daily Challenge & Drills (shown when no drill active) */}
                {drillState === 'idle' && (
                  <>
                    {/* Daily Challenge */}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Coins className="w-32 h-32" /></div>
                      {challengeState === 'idle' && (
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2"><Flame className="w-5 h-5 text-orange-400" /><h3 className="text-xl font-bold text-yellow-400">Daily Challenge</h3></div>
                            <p className="text-white/80 max-w-md">Complete a mixed 10-question quiz. Pass with 80%+ to earn bonus coins!</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right"><div className="text-sm text-white/50 font-bold uppercase">Reward</div><div className="text-xl font-bold text-yellow-400 flex items-center gap-1 justify-end">+20 <Coins className="w-4 h-4" /></div></div>
                            <button onClick={startChallenge} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow-lg shadow-yellow-500/20">Start Challenge</button>
                          </div>
                        </div>
                      )}
                      {challengeState === 'in_progress' && (
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" /><h3 className="text-xl font-bold text-yellow-400">Daily Challenge</h3></div>
                            <span className="text-sm text-white/60 font-bold">Q {challengeQIdx + 1} / {DAILY_QUESTIONS.length}</span>
                          </div>
                          <div className="h-2 bg-black/30 rounded-full mb-6 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300" style={{ width: `${(challengeQIdx / DAILY_QUESTIONS.length) * 100}%` }} />
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${currentChallengeQ.subject === 'Math' ? 'bg-blue-500/20 text-blue-400' : currentChallengeQ.subject === 'Reading' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>{currentChallengeQ.subject}</span>
                          <p className="text-white font-semibold text-lg mb-5 leading-relaxed">{currentChallengeQ.question}</p>
                          <div className="grid grid-cols-1 gap-3 mb-6">
                            {currentChallengeQ.options.map((opt, idx) => {
                              let style = 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10';
                              if (challengeSelected !== null) {
                                if (idx === currentChallengeQ.answer) style = 'bg-green-500/20 border-green-500 text-green-300';
                                else if (idx === challengeSelected) style = 'bg-red-500/20 border-red-500 text-red-300';
                                else style = 'bg-white/5 border-white/10 text-white/40';
                              }
                              return (
                                <button key={idx} onClick={() => handleChallengeSelect(idx)} disabled={challengeSelected !== null} className={`w-full text-left px-5 py-4 rounded-xl border font-medium transition-all ${style}`}>
                                  <span className="font-bold mr-3 text-white/50">{String.fromCharCode(65 + idx)}.</span>{opt}
                                </button>
                              );
                            })}
                          </div>
                          {challengeSelected !== null && (
                            <div className="flex items-center justify-between">
                              <span className={`font-bold flex items-center gap-2 ${challengeSelected === currentChallengeQ.answer ? 'text-green-400' : 'text-red-400'}`}>
                                {challengeSelected === currentChallengeQ.answer ? <><CheckCircle2 className="w-5 h-5" />Correct!</> : <><XCircle className="w-5 h-5" />Incorrect</>}
                              </span>
                              <button onClick={handleChallengeNext} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors">
                                {challengeQIdx < DAILY_QUESTIONS.length - 1 ? 'Next →' : 'See Results'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {challengeState === 'completed' && challengeShowResult && (
                        <div className="relative z-10 text-center py-4">
                          <div className="flex items-center gap-2 justify-center mb-4"><Flame className="w-5 h-5 text-orange-400" /><h3 className="text-xl font-bold text-yellow-400">Daily Challenge — Results</h3></div>
                          <div className={`text-6xl font-bold mb-2 ${challengeFinalScore >= 8 ? 'text-green-400' : 'text-orange-400'}`}>{challengeFinalScore} / 10</div>
                          <p className="text-white/70 mb-4">{challengeFinalScore >= 8 ? `🎉 Passed! +20 Coins & +100 XP earned!` : `Keep going! Score ${challengeFinalScore * 10}%. Need 80%+ for bonus. +30 XP for trying!`}</p>
                          <div className="text-left space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                            {DAILY_QUESTIONS.map((q, i) => (
                              <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${challengeAnswers[i] === q.answer ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                {challengeAnswers[i] === q.answer ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                                <span className="flex-1 truncate">Q{i + 1}: {q.question}</span>
                                {challengeAnswers[i] !== q.answer && <span className="text-xs text-white/50 flex-shrink-0">Ans: {q.options[q.answer]}</span>}
                              </div>
                            ))}
                          </div>
                          <div className="px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30 inline-flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Completed Today</div>
                        </div>
                      )}
                    </div>

                    {/* Targeted Drills */}
                    <h3 className="text-xl font-bold mb-4">Targeted Drills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PracticeCard title="Math: Heart of Algebra" description="Master linear equations and inequalities. High yield for your 1550 goal." xp={150} time="15 mins" color="blue" onStart={() => startDrill('math')} />
                      <PracticeCard title="Reading: Command of Evidence" description="Learn to find the exact line that supports your answer." xp={200} time="20 mins" color="purple" onStart={() => startDrill('reading')} />
                      <PracticeCard title="Writing: Standard English Conventions" description="Quick grammar drills to secure easy points." xp={100} time="10 mins" color="green" onStart={() => startDrill('writing')} />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ── Vocabulary ── */}
            {currentView === 'vocab' && (
              <motion.div key="vocab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3"><BookOpen className="w-7 h-7 text-purple-400" />Vocabulary Center</h2>

                {/* Menu */}
                {vocabMode === 'menu' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Learn */}
                      <button onClick={() => setVocabMode('learn')} className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-3xl p-6 text-left hover:border-blue-400/60 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors"><BookOpen className="w-6 h-6 text-blue-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Learn Words</h3>
                        <p className="text-white/60 text-sm">Study SAT vocabulary with definitions and example sentences.</p>
                        <div className="mt-4 text-blue-400 font-bold text-sm flex items-center gap-1">{VOCAB_BANK.length} words <ChevronRight className="w-4 h-4" /></div>
                      </button>
                      {/* Review */}
                      <button onClick={() => { setVocabLearnIdx(0); setVocabMode('review'); }} className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-3xl p-6 text-left hover:border-purple-400/60 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors"><Star className="w-6 h-6 text-purple-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Review Flashcards</h3>
                        <p className="text-white/60 text-sm">Flip through flashcards to reinforce your vocabulary memory.</p>
                        <div className="mt-4 text-purple-400 font-bold text-sm flex items-center gap-1">Flashcard mode <ChevronRight className="w-4 h-4" /></div>
                      </button>
                      {/* Daily Test */}
                      <button onClick={() => startVocabTest(true)} className={`bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border rounded-3xl p-6 text-left transition-all group ${vocabDailyDone ? 'border-green-500/30 opacity-70' : 'border-yellow-500/30 hover:border-yellow-400/60'}`}>
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors"><Flame className="w-6 h-6 text-yellow-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Daily Vocab Test</h3>
                        <p className="text-white/60 text-sm">10-question daily quiz. Pass 80%+ to earn bonus coins!</p>
                        <div className="mt-4 flex items-center gap-2">
                          {vocabDailyDone
                            ? <span className="text-green-400 font-bold text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Completed Today</span>
                            : <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">+15 Coins <ChevronRight className="w-4 h-4" /></span>
                          }
                        </div>
                      </button>
                    </div>

                    {/* Word List Preview */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                      <h3 className="text-lg font-bold mb-4">SAT Word List ({VOCAB_BANK.length} words)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                        {VOCAB_BANK.map((v, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                            <div className="font-bold text-sm text-purple-300">{v.word}</div>
                            <div className="text-xs text-white/50 truncate">{v.definition}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Learn Mode */}
                {vocabMode === 'learn' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setVocabMode('menu')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" />Back</button>
                      <span className="text-white/60 text-sm font-bold">{vocabLearnIdx + 1} / {VOCAB_BANK.length}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${((vocabLearnIdx + 1) / VOCAB_BANK.length) * 100}%` }} />
                    </div>
                    <motion.div key={vocabLearnIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-3xl p-8">
                      <div className="text-3xl font-bold text-blue-300 mb-2">{VOCAB_BANK[vocabLearnIdx].word}</div>
                      <div className="text-white/80 text-lg mb-4 leading-relaxed">{VOCAB_BANK[vocabLearnIdx].definition}</div>
                      <div className="bg-black/20 border border-white/10 rounded-xl p-4 text-white/60 text-sm italic">"{VOCAB_BANK[vocabLearnIdx].example}"</div>
                    </motion.div>
                    <div className="flex gap-4">
                      <button onClick={() => setVocabLearnIdx(p => Math.max(0, p - 1))} disabled={vocabLearnIdx === 0} className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold rounded-xl transition-colors">← Previous</button>
                      {vocabLearnIdx < VOCAB_BANK.length - 1
                        ? <button onClick={() => setVocabLearnIdx(p => p + 1)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">Next →</button>
                        : <button onClick={() => setVocabMode('menu')} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors">✓ Finished!</button>
                      }
                    </div>
                  </div>
                )}

                {/* Flashcard Review */}
                {vocabMode === 'review' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setVocabMode('menu')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" />Back</button>
                      <span className="text-white/60 text-sm font-bold">{vocabLearnIdx + 1} / {VOCAB_BANK.length}</span>
                    </div>
                    <FlashCard word={VOCAB_BANK[vocabLearnIdx]} />
                    <div className="flex gap-4">
                      <button onClick={() => setVocabLearnIdx(p => Math.max(0, p - 1))} disabled={vocabLearnIdx === 0} className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold rounded-xl transition-colors">← Prev</button>
                      {vocabLearnIdx < VOCAB_BANK.length - 1
                        ? <button onClick={() => setVocabLearnIdx(p => p + 1)} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Next →</button>
                        : <button onClick={() => setVocabMode('menu')} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors">✓ Done!</button>
                      }
                    </div>
                  </div>
                )}

                {/* Daily Vocab Test */}
                {vocabMode === 'daily_test' && vocabTestQuestions.length > 0 && vocabOptions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setVocabMode('menu')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm"><ArrowLeft className="w-4 h-4" />Back</button>
                      <span className="text-white/60 text-sm font-bold">Q {vocabTestIdx + 1} / {vocabTestQuestions.length}</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all" style={{ width: `${(vocabTestIdx / vocabTestQuestions.length) * 100}%` }} />
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6">
                      <p className="text-white/60 text-sm mb-2 font-bold uppercase tracking-wider">What does this word mean?</p>
                      <p className="text-3xl font-bold text-yellow-300 mb-6">{vocabTestQuestions[vocabTestIdx].word}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {vocabOptions[vocabTestIdx]?.options.map((opt, idx) => {
                          const correctIdx = vocabOptions[vocabTestIdx].correctIdx;
                          let style = 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10';
                          if (vocabTestSelected !== null) {
                            if (idx === correctIdx) style = 'bg-green-500/20 border-green-500 text-green-300';
                            else if (idx === vocabTestSelected) style = 'bg-red-500/20 border-red-500 text-red-300';
                            else style = 'bg-white/5 border-white/10 text-white/40';
                          }
                          return (
                            <button key={idx} onClick={() => { handleVocabSelect(idx); (vocabTestQuestions[vocabTestIdx] as any)._correctIdx = correctIdx; }} disabled={vocabTestSelected !== null} className={`w-full text-left px-5 py-4 rounded-xl border font-medium transition-all ${style}`}>
                              <span className="font-bold mr-3 text-white/50">{String.fromCharCode(65 + idx)}.</span>{opt}
                            </button>
                          );
                        })}
                      </div>
                      {vocabTestSelected !== null && (
                        <div className="flex items-center justify-between mt-4">
                          <span className={`font-bold flex items-center gap-2 ${vocabTestSelected === vocabOptions[vocabTestIdx].correctIdx ? 'text-green-400' : 'text-red-400'}`}>
                            {vocabTestSelected === vocabOptions[vocabTestIdx].correctIdx ? <><CheckCircle2 className="w-5 h-5" />Correct!</> : <><XCircle className="w-5 h-5" />Incorrect</>}
                          </span>
                          <button onClick={handleVocabNext} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors">
                            {vocabTestIdx < vocabTestQuestions.length - 1 ? 'Next →' : 'See Results'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Test Result */}
                {vocabMode === 'test_result' && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <div className={`text-5xl font-bold mb-2 ${vocabTestScore >= 8 ? 'text-green-400' : 'text-orange-400'}`}>{vocabTestScore} / {vocabTestQuestions.length}</div>
                    <p className="text-white/70 mb-6">{vocabTestScore >= 8 ? '🎉 Excellent! +15 Coins & +80 XP earned!' : `Keep studying! Score ${Math.round(vocabTestScore / vocabTestQuestions.length * 100)}%. +20 XP for trying!`}</p>
                    <button onClick={() => setVocabMode('menu')} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors">Back to Vocabulary</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Chat ── */}
            {currentView === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/5 border border-white/10 rounded-3xl flex flex-col h-[600px] overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
                  <div><h3 className="font-bold">SAT Master Tutor</h3><p className="text-xs text-green-400">Online · Ready to help</p></div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-white/10 text-white/90 rounded-tl-sm'}`}>{msg.text}</div>
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
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    <button onClick={() => setInputMessage("Give me a quick Math drill!")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">Quick Math Drill</button>
                    <button onClick={() => setInputMessage("Explain Command of Evidence")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">Explain Reading Strategy</button>
                    <button onClick={() => setInputMessage("I'm feeling unmotivated...")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors">Need Motivation</button>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask a question or paste a problem..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                    <button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors">Send</button>
                  </div>
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
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                  <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Weekend Mini-Mock</h3>
                  <p className="text-white/70 max-w-md mx-auto mb-8">Test your week's progress under timed conditions. Defeating this boss grants massive XP and unlocks the next tier.</p>
                  {isBossFightActive ? (
                    <div className="space-y-4">
                      <div className="text-red-400 font-bold animate-pulse">Boss Fight in Progress...</div>
                      <button onClick={() => { setIsBossFightActive(false); setXp(p => p + 500); setCoins(p => p + 50); setCurrentView('dashboard'); }} className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl transition-colors shadow-lg">Submit Answers & Defeat Boss</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-6">
                        <div className="text-center"><div className="text-sm text-white/50 font-bold uppercase">XP Reward</div><div className="text-xl font-bold text-yellow-500">+500 XP</div></div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="text-center"><div className="text-sm text-white/50 font-bold uppercase">Coin Reward</div><div className="text-xl font-bold text-yellow-400 flex items-center gap-1 justify-center">+50 <Coins className="w-4 h-4" /></div></div>
                      </div>
                      <button onClick={() => setIsBossFightActive(true)} className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20 w-full md:w-auto">Enter Boss Room (45 mins)</button>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mt-8 mb-4">Past Encounters</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div><h4 className="font-bold">Week 2 Checkpoint</h4><p className="text-sm text-white/50">Score: 1310 (+80 from baseline)</p></div>
                  <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Cleared</span>
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
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl"><CreditCard className="w-6 h-6 text-blue-400" /></div>
                    <div><h3 className="text-lg font-bold mb-1">Parent-Sponsored Rewards</h3><p className="text-white/70 text-sm">Link your parent's account to automatically convert coins into allowance or gift cards. (Currently in Demo Mode)</p></div>
                  </div>
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

function PracticeCard({ title, description, xp, time, color, onStart }: { title: string; description: string; xp: number; time: string; color: 'blue' | 'purple' | 'green'; onStart: () => void }) {
  const colorMap = { blue: 'from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400', purple: 'from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400', green: 'from-green-500/20 to-green-900/20 border-green-500/30 text-green-400' };
  const parts = colorMap[color].split(' ');
  return (
    <div className={`bg-gradient-to-br ${parts[0]} ${parts[1]} border ${parts[2]} rounded-3xl p-6 flex flex-col`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-6 flex-1">{description}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex gap-4 text-sm font-bold">
          <span className="flex items-center gap-1 text-yellow-500"><Trophy className="w-4 h-4" />+{xp} XP</span>
          <span className="flex items-center gap-1 text-white/50"><Clock className="w-4 h-4" />{time}</span>
        </div>
        <button onClick={onStart} className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${parts[3]}`}><Play className="w-5 h-5" /></button>
      </div>
    </div>
  );
}

function StatCard({ label, value, target, trend }: { label: string; value: string; target?: string; trend?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
      <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-end gap-2"><div className="text-2xl font-bold">{value}</div>{target && <div className="text-sm text-white/40 mb-1">/ {target}</div>}</div>
      {trend && <div className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1"><ChevronRight className="w-3 h-3 -rotate-90" />{trend} this month</div>}
    </div>
  );
}

function RoadmapItem({ title, status, progress }: { title: string; status: 'completed' | 'active' | 'locked'; progress?: number }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${status === 'completed' ? 'bg-green-500/10 border-green-500/20' : status === 'active' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-green-500/20 text-green-400' : status === 'active' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/40'}`}>
        {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : status === 'active' ? <Flame className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <h4 className={`font-bold ${status === 'locked' ? 'text-white/50' : 'text-white'}`}>{title}</h4>
        {status === 'active' && progress !== undefined && (
          <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${progress}%` }} /></div>
        )}
      </div>
      {status === 'active' && <span className="text-sm font-bold text-purple-400">{progress}%</span>}
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
      <button onClick={onRedeem} disabled={!canAfford} className={`w-full py-3 rounded-xl font-bold transition-colors ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
        {canAfford ? 'Redeem Reward' : 'Not Enough Coins'}
      </button>
    </div>
  );
}

function FlashCard({ word }: { word: { word: string; definition: string; example: string } }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setFlipped(false); }, [word.word]);
  return (
    <div className="cursor-pointer" onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px' }}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '200px' }}>
        {/* Front */}
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%' }} className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/40 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Tap to reveal definition</p>
          <p className="text-4xl font-bold text-purple-300">{word.word}</p>
        </div>
        {/* Back */}
        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', width: '100%' }} className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 border border-blue-500/40 rounded-3xl p-8 flex flex-col justify-center min-h-[200px]">
          <p className="text-2xl font-bold text-blue-300 mb-3">{word.word}</p>
          <p className="text-white/80 text-lg mb-4">{word.definition}</p>
          <p className="text-white/50 text-sm italic">"{word.example}"</p>
        </div>
      </motion.div>
    </div>
  );
}
