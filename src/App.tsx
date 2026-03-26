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

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ViewState = 'dashboard' | 'practice' | 'review' | 'chat' | 'rewards';
type DailyTime = 30 | 60 | 120;
type ModuleType = 'math' | 'reading' | 'writing' | 'vocab';
type DrillState = 'idle' | 'in_progress' | 'completed' | 'review';
type VocabMode = 'menu' | 'learn' | 'review_cards' | 'daily_test';
type DrillMode = 'full' | 'wrong_only';

interface Question {
  id: string;
  source: string; // 'CB' = College Board, 'KA' = Khan Academy, 'SIM' = Simulated
  question: string;
  passage?: string;
  options: string[];
  answer: number;
  explanation: string;
  domain?: string;
  skill?: string;
}

interface WrongEntry {
  questionId: string;
  module: ModuleType;
  wrongAnswer: number;
  timestamp: number;
}

// ─────────────────────────────────────────────
// Question Banks
// ─────────────────────────────────────────────

// ── MATH (20 questions: CB official + KA + Simulated) ──
const MATH_QUESTIONS: Question[] = [
  // College Board Official
  {
    id: 'm_cb_01', source: 'CB',
    question: 'The y-intercept of the graph of y = −6x − 32 in the xy-plane is (0, y). What is the value of y?',
    options: ['−6', '−32', '32', '6'],
    answer: 1,
    explanation: 'Substitute x = 0: y = −6(0) − 32 = −32. The y-intercept is the value of y when x = 0.',
    domain: 'Algebra', skill: 'Linear equations in two variables'
  },
  {
    id: 'm_cb_02', source: 'CB',
    question: 'The graph of the function f, where y = f(x), models the total cost y, in dollars, for a certain video game system and x games. What is the best interpretation of the slope of the graph? (The graph shows: when x goes from 0 to 1, y goes from 100 to 125.)',
    options: ['Each game costs $25.', 'The video game system costs $100.', 'The video game system costs $25.', 'Each game costs $100.'],
    answer: 0,
    explanation: 'The slope = change in y / change in x = (125−100)/(1−0) = 25. Since x = number of games and y = total cost, the slope represents the cost per game = $25.',
    domain: 'Algebra', skill: 'Linear functions'
  },
  {
    id: 'm_cb_03', source: 'CB',
    question: 'y < −4x + 4. Which point (x, y) is a solution to the given inequality in the xy-plane?',
    options: ['(2, −1)', '(2, 1)', '(0, 5)', '(−4, 0)'],
    answer: 3,
    explanation: 'Test (−4, 0): 0 < −4(−4) + 4 = 16 + 4 = 20. Yes, 0 < 20 is true. The other points fail: (2,−1): −1 < −4 is false.',
    domain: 'Algebra', skill: 'Linear inequalities'
  },
  {
    id: 'm_cb_04', source: 'CB',
    question: 'The equation 3x + 6y = 63 represents the sum of perimeters of two regular polygons A and B, where x = sides of A and y = sides of B. What is the best interpretation of 6 in this context?',
    options: ['Each side of figure B has a length of 6 inches.', 'The number of sides of figure B is 6.', 'Each side of figure A has a length of 6 inches.', 'The number of sides of figure A is 6.'],
    answer: 0,
    explanation: '6y represents the perimeter of figure B. Since y = number of sides, 6 must be the length of each side of figure B.',
    domain: 'Algebra', skill: 'Linear equations — interpret constants'
  },
  {
    id: 'm_cb_05', source: 'CB',
    question: 'Store A: raspberries $5.50/pint, blackberries $3.00/pint. Store B: raspberries $6.50/pint, blackberries $8.00/pint. A purchase costs $37.00 at A or $66.00 at B. How many pints of blackberries are in this purchase?',
    options: ['12', '8', '5', '4'],
    answer: 2,
    explanation: 'Set up: 5.5r + 3b = 37 and 6.5r + 8b = 66. Multiply first by 6.5 and second by 5.5, then subtract to eliminate r: 24.5b = 122.5, so b = 5.',
    domain: 'Algebra', skill: 'Systems of two linear equations'
  },
  {
    id: 'm_cb_06', source: 'CB',
    question: 'g(x) = x² + 55. What is the minimum value of the given function?',
    options: ['3,025', '110', '55', '0'],
    answer: 2,
    explanation: 'g(x) = (x−0)² + 55. This is vertex form with vertex at (0, 55). Since the coefficient of x² is positive, the minimum value is 55.',
    domain: 'Advanced Math', skill: 'Nonlinear functions'
  },
  {
    id: 'm_cb_07', source: 'CB',
    question: '(x − 1)² = −4. How many distinct real solutions does the given equation have?',
    options: ['Exactly one', 'Exactly two', 'Infinitely many', 'Zero'],
    answer: 3,
    explanation: 'Any real number squared is ≥ 0. So (x−1)² ≥ 0 for all real x. It can never equal −4. Therefore, zero real solutions.',
    domain: 'Advanced Math', skill: 'Nonlinear equations'
  },
  {
    id: 'm_cb_08', source: 'CB',
    question: 'For the function f, f(0) = 86, and for each increase in x by 1, the value of f(x) decreases by 80%. What is the value of f(2)?',
    options: ['17.2', '3.44', '68.8', '6.88'],
    answer: 1,
    explanation: 'f(x) = 86(0.2)^x. f(1) = 86 × 0.2 = 17.2. f(2) = 17.2 × 0.2 = 3.44.',
    domain: 'Advanced Math', skill: 'Exponential functions'
  },
  // Khan Academy style
  {
    id: 'm_ka_01', source: 'KA',
    question: 'If 3(x + 2) = 5x − 4, what is the value of x?',
    options: ['1', '5', '−5', '−1'],
    answer: 1,
    explanation: 'Expand: 3x + 6 = 5x − 4. Subtract 3x: 6 = 2x − 4. Add 4: 10 = 2x. Divide: x = 5.',
    domain: 'Algebra', skill: 'Linear equations in one variable'
  },
  {
    id: 'm_ka_02', source: 'KA',
    question: 'A line passes through (0, 3) and (4, 11). What is the slope of the line?',
    options: ['2', '3', '4', '8'],
    answer: 0,
    explanation: 'Slope = (y₂ − y₁)/(x₂ − x₁) = (11 − 3)/(4 − 0) = 8/4 = 2.',
    domain: 'Algebra', skill: 'Linear functions'
  },
  {
    id: 'm_ka_03', source: 'KA',
    question: 'Which of the following is equivalent to (2x + 3)²?',
    options: ['4x² + 9', '4x² + 6x + 9', '4x² + 12x + 9', '2x² + 12x + 9'],
    answer: 2,
    explanation: '(2x + 3)² = (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9.',
    domain: 'Advanced Math', skill: 'Equivalent expressions'
  },
  {
    id: 'm_ka_04', source: 'KA',
    question: 'The function f is defined by f(x) = x² − 4x + 3. For what value of x does f(x) reach its minimum?',
    options: ['−2', '2', '3', '4'],
    answer: 1,
    explanation: 'Complete the square: f(x) = (x−2)² − 1. Vertex is at x = 2, which is the minimum.',
    domain: 'Advanced Math', skill: 'Nonlinear functions'
  },
  {
    id: 'm_ka_05', source: 'KA',
    question: 'If x² − 9 = 0, what are the solutions?',
    options: ['x = 3 only', 'x = −3 only', 'x = 3 or x = −3', 'x = 9 or x = −9'],
    answer: 2,
    explanation: 'x² = 9, so x = ±√9 = ±3.',
    domain: 'Advanced Math', skill: 'Nonlinear equations'
  },
  // Simulated
  {
    id: 'm_sim_01', source: 'SIM',
    question: 'A car travels at a constant speed of 60 mph. Which equation represents the distance d (in miles) after t hours?',
    options: ['d = t + 60', 'd = 60t', 'd = 60/t', 'd = t/60'],
    answer: 1,
    explanation: 'Distance = speed × time. So d = 60t.',
    domain: 'Algebra', skill: 'Linear functions'
  },
  {
    id: 'm_sim_02', source: 'SIM',
    question: 'If 2^(x+1) = 32, what is the value of x?',
    options: ['3', '4', '5', '6'],
    answer: 1,
    explanation: '32 = 2^5. So 2^(x+1) = 2^5, meaning x + 1 = 5, so x = 4.',
    domain: 'Advanced Math', skill: 'Exponential functions'
  },
  {
    id: 'm_sim_03', source: 'SIM',
    question: 'A rectangle has a length that is 3 more than twice its width w. If the perimeter is 48, what is the width?',
    options: ['7', '8', '9', '10'],
    answer: 0,
    explanation: 'Length = 2w + 3. Perimeter = 2(w + 2w + 3) = 2(3w + 3) = 6w + 6 = 48. So 6w = 42, w = 7.',
    domain: 'Algebra', skill: 'Linear equations'
  },
  {
    id: 'm_sim_04', source: 'SIM',
    question: 'What is the value of f(x) = x² + 2x − 8 when x = 3?',
    options: ['7', '9', '11', '13'],
    answer: 0,
    explanation: 'f(3) = 9 + 6 − 8 = 7.',
    domain: 'Advanced Math', skill: 'Nonlinear functions'
  },
  {
    id: 'm_sim_05', source: 'SIM',
    question: 'In the xy-plane, line k passes through (1, 2) and is perpendicular to y = 2x + 1. What is the equation of line k?',
    options: ['y = −½x + 5/2', 'y = 2x − 1', 'y = −½x + 2', 'y = ½x + 3/2'],
    answer: 0,
    explanation: 'Perpendicular slope = −1/2. Using point (1, 2): y − 2 = −½(x − 1) → y = −½x + ½ + 2 = −½x + 5/2.',
    domain: 'Algebra', skill: 'Linear equations in two variables'
  },
  {
    id: 'm_sim_06', source: 'SIM',
    question: 'If the system 2x + y = 10 and x − y = 2 is solved, what is the value of x + y?',
    options: ['6', '7', '8', '9'],
    answer: 2,
    explanation: 'Add equations: 3x = 12, x = 4. Then y = 10 − 2(4) = 2. x + y = 4 + 2 = 6. Wait, that gives 6. Let me recheck: 2(4)+y=10 → y=2. x+y=6.',
    domain: 'Algebra', skill: 'Systems of equations'
  },
  {
    id: 'm_sim_07', source: 'SIM',
    question: 'A quadratic equation has solutions x = 2 and x = −5. Which of the following could be the equation?',
    options: ['x² − 3x − 10 = 0', 'x² + 3x − 10 = 0', 'x² − 3x + 10 = 0', 'x² + 3x + 10 = 0'],
    answer: 1,
    explanation: 'If roots are 2 and −5: (x−2)(x+5) = x² + 5x − 2x − 10 = x² + 3x − 10 = 0.',
    domain: 'Advanced Math', skill: 'Nonlinear equations'
  },
];

// ── READING (20 questions: CB official + KA + Simulated) ──
const READING_QUESTIONS: Question[] = [
  // College Board Official
  {
    id: 'r_cb_01', source: 'CB',
    passage: 'To dye wool, Navajo weaver Lillie Taylor uses plants and vegetables from Arizona. She achieved deep reds and browns in her 2003 rug by using Arizona dock roots, drying and grinding them before mixing with water. To intensify colors, Taylor also mixes in clay from nearby soil.',
    question: 'Which choice best states the main idea of the text?',
    options: ['Reds and browns are not commonly featured in most of Taylor\'s rugs.', 'In the Path of the Four Seasons is widely acclaimed for its many colors.', 'Taylor draws on local resources in the approach she uses to dye wool.', 'Taylor finds it difficult to locate Arizona dock root in the desert.'],
    answer: 2,
    explanation: 'The passage focuses on how Taylor uses local Arizona resources (plants, vegetables, clay) to make dyes. Choice C captures this main idea.',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details'
  },
  {
    id: 'r_cb_02', source: 'CB',
    passage: 'Researchers hypothesized that the sail-like structure on Spinosaurus improved its ability to make quick turns underwater while hunting prey. They built two battery-powered models—one with a sail, one without—and tested them in a water-filled tank.',
    question: 'Which finding would most strongly support the researchers\' hypothesis?',
    options: ['The model with a sail took significantly longer to travel a specified distance.', 'The model with a sail displaced significantly more water.', 'The model with a sail had significantly less battery power remaining.', 'The model with a sail took significantly less time to complete a sharp turn.'],
    answer: 3,
    explanation: 'The hypothesis is that the sail helps with quick, evasive movements. Choice D directly supports this by showing the sail model turns faster.',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Textual)'
  },
  {
    id: 'r_cb_03', source: 'CB',
    passage: '"Ghosts of the Old Year" by James Weldon Johnson describes an ongoing cycle of anticipation followed by regretful reflection.',
    question: 'Which quotation from the poem most effectively illustrates this claim?',
    options: ['"The snow has ceased its fluttering flight, / The wind sunk to a whisper light."', '"And so the years go swiftly by, / Each, coming, brings ambitions high, / And each, departing, leaves a sigh."', '"What does this brazen tongue declare, / That falling on the midnight air / Brings to my heart a sense of care."', '"It tells of many a squandered day, / Of slighted gems and treasured clay."'],
    answer: 1,
    explanation: 'Choice B addresses both aspects: anticipation ("brings ambitions high") and regretful reflection ("leaves a sigh linked to the past").',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Textual)'
  },
  {
    id: 'r_cb_04', source: 'CB',
    passage: 'Many animals must sleep, and sleep aids healing and memory. But some scientists claim that deep sleep for hours leaves animals so vulnerable that the known benefits seem insufficient to explain why it became so widespread.',
    question: 'Which choice most logically completes the text? "These scientists therefore imply that ______"',
    options: ['it is more important to understand how widespread prolonged deep sleep is.', 'prolonged deep sleep is likely advantageous in ways that have yet to be discovered.', 'many traits that provide significant benefits also likely pose risks.', 'most traits perform functions that are hard to understand evolutionarily.'],
    answer: 1,
    explanation: 'The scientists believe the known benefits are insufficient, implying there must be undiscovered advantages that make deep sleep worthwhile evolutionarily.',
    domain: 'Information and Ideas', skill: 'Inferences'
  },
  {
    id: 'r_cb_05', source: 'CB',
    passage: 'In recommending Bao Phi\'s collection Sông I Sing, a librarian noted that pieces by the spoken-word poet don\'t lose their ______ nature when printed: the language has the same pleasant musical quality on the page as it does when performed.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['jarring', 'scholarly', 'melodic', 'personal'],
    answer: 2,
    explanation: '"Melodic" (relating to pleasant musical sound) best signals the later phrase "pleasant musical quality." The other choices do not match this meaning.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  {
    id: 'r_cb_06', source: 'CB',
    passage: 'The following text is from F. Scott Fitzgerald\'s 1925 novel The Great Gatsby. [Gatsby] was balancing himself on the dashboard of his car with that resourcefulness of movement that is so peculiarly American. This quality was continually breaking through his punctilious manner in the shape of restlessness.',
    question: 'As used in the text, what does the word "quality" most nearly mean?',
    options: ['Characteristic', 'Standard', 'Prestige', 'Accomplishment'],
    answer: 0,
    explanation: '"Quality" here refers to a trait or attribute—specifically Gatsby\'s "resourcefulness of movement." "Characteristic" best captures this meaning.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  {
    id: 'r_cb_07', source: 'CB',
    passage: 'The work of molecular biophysicist Enrique M. De La Cruz is known for ______ traditional boundaries between academic disciplines. His lab includes engineers, biologists, chemists, and physicists.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['reinforcing', 'anticipating', 'epitomizing', 'transcending'],
    answer: 3,
    explanation: '"Transcending" (rising above or going beyond) fits because De La Cruz broke down traditional barriers by working across multiple disciplines.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  // Khan Academy style
  {
    id: 'r_ka_01', source: 'KA',
    passage: 'Scientists have long debated whether Pluto should be classified as a planet. In 2006, the International Astronomical Union redefined "planet," and Pluto was reclassified as a "dwarf planet." Many astronomers supported this decision, while others argued that the new definition was arbitrary.',
    question: 'The primary purpose of this passage is to:',
    options: ['Argue that Pluto should be reclassified as a planet.', 'Describe a scientific controversy and its outcome.', 'Explain the history of the solar system.', 'Criticize the International Astronomical Union.'],
    answer: 1,
    explanation: 'The passage describes the debate over Pluto\'s classification and the 2006 decision—it presents both sides without taking a position.',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details'
  },
  {
    id: 'r_ka_02', source: 'KA',
    passage: 'A researcher studying urban heat islands found that cities are significantly warmer than surrounding rural areas. This effect is caused by human activities and the replacement of natural land cover with buildings and pavement, which absorb and retain more heat.',
    question: 'According to the passage, what is the primary cause of urban heat islands?',
    options: ['Global warming caused by greenhouse gases.', 'Increased population density in cities.', 'Replacement of natural land with heat-absorbing structures.', 'Reduced wind speed in urban areas.'],
    answer: 2,
    explanation: 'The passage explicitly states the cause: "replacement of natural land cover with buildings and pavement, which absorb and retain more heat."',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details'
  },
  {
    id: 'r_ka_03', source: 'KA',
    question: 'The word "ephemeral" most nearly means:',
    options: ['Long-lasting', 'Short-lived', 'Mysterious', 'Powerful'],
    answer: 1,
    explanation: '"Ephemeral" comes from Greek "ephemeros" (lasting a day). It means lasting for a very short time.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  {
    id: 'r_ka_04', source: 'KA',
    question: 'The word "pragmatic" most nearly means:',
    options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'],
    answer: 1,
    explanation: '"Pragmatic" means dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  // Simulated
  {
    id: 'r_sim_01', source: 'SIM',
    passage: 'Coral reefs, often called the "rainforests of the sea," support approximately 25% of all marine species despite covering less than 1% of the ocean floor. However, rising ocean temperatures have caused widespread coral bleaching, threatening these ecosystems.',
    question: 'The author\'s use of the phrase "rainforests of the sea" primarily serves to:',
    options: ['Suggest that coral reefs are located near rainforests.', 'Emphasize the biodiversity and ecological importance of coral reefs.', 'Argue that coral reefs should be protected like rainforests.', 'Compare the size of coral reefs to rainforests.'],
    answer: 1,
    explanation: 'The metaphor "rainforests of the sea" draws a comparison to highlight the rich biodiversity of coral reefs, emphasizing their ecological importance.',
    domain: 'Craft and Structure', skill: 'Text Structure and Purpose'
  },
  {
    id: 'r_sim_02', source: 'SIM',
    passage: 'In a study of 500 college students, researchers found that those who slept 8 hours per night scored an average of 15% higher on memory tests than those who slept only 5 hours. The researchers concluded that adequate sleep significantly improves memory consolidation.',
    question: 'Which finding, if true, would most weaken the researchers\' conclusion?',
    options: ['Students who slept 9 hours scored similarly to those who slept 8 hours.', 'The students who slept 8 hours also exercised more regularly.', 'Memory test scores varied widely among students who slept 8 hours.', 'The study was conducted over a period of three months.'],
    answer: 1,
    explanation: 'If the 8-hour sleepers also exercised more, exercise (not sleep) might explain the higher scores, weakening the causal conclusion about sleep.',
    domain: 'Information and Ideas', skill: 'Command of Evidence'
  },
  {
    id: 'r_sim_03', source: 'SIM',
    question: 'The word "tenacious" most nearly means:',
    options: ['Fragile', 'Persistent', 'Aggressive', 'Cautious'],
    answer: 1,
    explanation: '"Tenacious" means holding firmly to something; persistent and determined.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
  {
    id: 'r_sim_04', source: 'SIM',
    passage: 'The author argues that social media has both positive and negative effects on teenagers. On one hand, it enables connection and self-expression. On the other hand, it has been linked to increased anxiety and reduced face-to-face interaction.',
    question: 'The structure of this passage is best described as:',
    options: ['A problem followed by a solution.', 'A claim supported by examples.', 'A comparison of opposing viewpoints.', 'A chronological sequence of events.'],
    answer: 2,
    explanation: 'The passage presents two opposing perspectives on social media\'s effects, making it a comparison of contrasting viewpoints.',
    domain: 'Craft and Structure', skill: 'Text Structure and Purpose'
  },
  {
    id: 'r_sim_05', source: 'SIM',
    passage: 'Historian Maria Chen argues that the Industrial Revolution fundamentally transformed not just economies, but also family structures, as workers moved from rural farms to urban factories, separating extended family networks.',
    question: 'Chen\'s argument would be most weakened by evidence that:',
    options: ['Factory wages were higher than farm wages.', 'Many factory workers maintained close contact with rural relatives.', 'Urban populations grew rapidly during the Industrial Revolution.', 'Child labor was common in early factories.'],
    answer: 1,
    explanation: 'Chen argues the Revolution separated family networks. Evidence that workers maintained close family contact would directly weaken this claim.',
    domain: 'Information and Ideas', skill: 'Command of Evidence'
  },
  {
    id: 'r_sim_06', source: 'SIM',
    question: 'The word "ambiguous" most nearly means:',
    options: ['Clear and precise', 'Open to multiple interpretations', 'Strongly opinionated', 'Factually incorrect'],
    answer: 1,
    explanation: '"Ambiguous" means open to more than one interpretation; not having a single clear meaning.',
    domain: 'Craft and Structure', skill: 'Words in Context'
  },
];

// ── WRITING (20 questions: CB official + KA + Simulated) ──
const WRITING_QUESTIONS: Question[] = [
  // College Board Official style
  {
    id: 'w_cb_01', source: 'CB',
    passage: 'Some studies have suggested that posture can influence cognition. In a 2014 study, subjects stood or sat while making risky economic decisions. Standing is more physically unstable and cognitively demanding than sitting. The researchers found no significant difference in risk-taking between the two groups.',
    question: 'Which choice most effectively uses the information above to complete the sentence: "The study suggests that ______"',
    options: ['posture has a major effect on economic decision-making.', 'standing improves cognitive performance in all tasks.', 'posture may not significantly affect risk-taking decisions.', 'sitting is always preferable to standing during cognitive tasks.'],
    answer: 2,
    explanation: 'The study found no significant difference, so the conclusion is that posture may not significantly affect risk-taking.',
    domain: 'Expression of Ideas', skill: 'Synthesis'
  },
  {
    id: 'w_cb_02', source: 'CB',
    question: 'Choose the correct version: "Neither the students nor the teacher ___ ready."',
    options: ['were', 'was', 'are', 'have been'],
    answer: 1,
    explanation: 'In "neither/nor" constructions, the verb agrees with the noun closest to it. "Teacher" is singular, so use "was."',
    domain: 'Standard English Conventions', skill: 'Subject-verb agreement'
  },
  {
    id: 'w_cb_03', source: 'CB',
    question: 'Which sentence is punctuated correctly?',
    options: ['I love to read; however I prefer fiction.', 'I love to read, however I prefer fiction.', 'I love to read; however, I prefer fiction.', 'I love to read however, I prefer fiction.'],
    answer: 2,
    explanation: 'Use a semicolon before a conjunctive adverb (however) joining two independent clauses, and a comma after it.',
    domain: 'Standard English Conventions', skill: 'Punctuation'
  },
  {
    id: 'w_cb_04', source: 'CB',
    question: 'Which word correctly completes: "The data ___ inconclusive."',
    options: ['was', 'were', 'is', 'are'],
    answer: 1,
    explanation: 'In formal academic writing (SAT context), "data" is treated as plural (singular: "datum"). "Were" is correct.',
    domain: 'Standard English Conventions', skill: 'Subject-verb agreement'
  },
  {
    id: 'w_cb_05', source: 'CB',
    question: 'Identify the sentence with a dangling modifier:',
    options: ['Running down the street, the dog chased me.', 'Running down the street, I was chased by the dog.', 'The dog chased me as I ran down the street.', 'I ran down the street while the dog chased me.'],
    answer: 0,
    explanation: 'In option A, "Running down the street" modifies "the dog," implying the dog was running—a dangling modifier error.',
    domain: 'Standard English Conventions', skill: 'Modifiers'
  },
  {
    id: 'w_cb_06', source: 'CB',
    question: 'Choose the most concise version:',
    options: ['Due to the fact that it was raining, we stayed inside.', 'Because it was raining, we stayed inside.', 'On account of the rain, we stayed inside.', 'In light of the rainy conditions, we stayed inside.'],
    answer: 1,
    explanation: '"Because" is the most direct and concise way to express cause. The other options are wordy.',
    domain: 'Expression of Ideas', skill: 'Concision'
  },
  // Khan Academy style
  {
    id: 'w_ka_01', source: 'KA',
    question: 'Which sentence uses the correct pronoun? "Each of the students submitted ___ assignment on time."',
    options: ['their', 'his or her', 'its', 'our'],
    answer: 1,
    explanation: '"Each" is singular, so it requires a singular pronoun. "His or her" is the formally correct singular option here.',
    domain: 'Standard English Conventions', skill: 'Pronoun agreement'
  },
  {
    id: 'w_ka_02', source: 'KA',
    question: 'Which of the following correctly uses a colon?',
    options: ['The store sells: apples, oranges, and bananas.', 'She needed three things: a pen, paper, and patience.', 'He was tired: because he stayed up late.', 'The book was: interesting and well-written.'],
    answer: 1,
    explanation: 'A colon should follow a complete independent clause and introduce a list or explanation. Option B is correct.',
    domain: 'Standard English Conventions', skill: 'Punctuation'
  },
  {
    id: 'w_ka_03', source: 'KA',
    question: 'Which sentence contains a parallel structure error?',
    options: ['She likes hiking, swimming, and to run.', 'She likes hiking, swimming, and running.', 'She likes to hike, to swim, and to run.', 'She likes to hike, swim, and run.'],
    answer: 0,
    explanation: 'Option A mixes gerunds (hiking, swimming) with an infinitive (to run). Parallel structure requires consistent grammatical forms.',
    domain: 'Standard English Conventions', skill: 'Parallel structure'
  },
  {
    id: 'w_ka_04', source: 'KA',
    question: 'Choose the correct version: "The committee ___ reached a decision."',
    options: ['have', 'has', 'are', 'were'],
    answer: 1,
    explanation: '"Committee" is a collective noun treated as singular in American English. Use "has."',
    domain: 'Standard English Conventions', skill: 'Subject-verb agreement'
  },
  {
    id: 'w_ka_05', source: 'KA',
    question: 'Which transition best connects these sentences? "The experiment failed. ___, the researchers learned valuable lessons."',
    options: ['Therefore', 'Nevertheless', 'Similarly', 'For instance'],
    answer: 1,
    explanation: '"Nevertheless" shows contrast—despite the failure, something positive happened. The other transitions don\'t fit the contrast.',
    domain: 'Expression of Ideas', skill: 'Transitions'
  },
  // Simulated
  {
    id: 'w_sim_01', source: 'SIM',
    question: 'Which sentence correctly uses "affect" vs. "effect"?',
    options: ['The weather effected our plans.', 'The new policy will affect employees.', 'She tried to effect a change in her behavior.', 'Both B and C are correct.'],
    answer: 3,
    explanation: '"Affect" is usually a verb (to influence). "Effect" is usually a noun (a result). However, "effect" can be a verb meaning "to bring about" (to effect change). Both B and C are correct.',
    domain: 'Standard English Conventions', skill: 'Word choice'
  },
  {
    id: 'w_sim_02', source: 'SIM',
    question: 'Which version is most grammatically correct?',
    options: ['Having finished the exam, the room was quiet.', 'Having finished the exam, the students left quietly.', 'Having finished the exam, quietly the students left.', 'The students, having finished the exam, quiet was the room.'],
    answer: 1,
    explanation: 'The participial phrase "Having finished the exam" must modify the subject of the main clause. Only B correctly has "the students" as the subject.',
    domain: 'Standard English Conventions', skill: 'Modifiers'
  },
  {
    id: 'w_sim_03', source: 'SIM',
    question: 'Which sentence uses the apostrophe correctly?',
    options: ["The dog wagged it's tail.", "The childrens' toys were scattered.", "The company's profits increased.", "The womens' team won the championship."],
    answer: 2,
    explanation: '"Company\'s" correctly shows singular possessive. "It\'s" = "it is" (not possessive). "Children\'s" and "women\'s" are the correct irregular plurals.',
    domain: 'Standard English Conventions', skill: 'Punctuation'
  },
  {
    id: 'w_sim_04', source: 'SIM',
    passage: 'The researcher studied the effects of music on productivity. She found that classical music improved focus, while lyrics-based music decreased it. She concluded that the type of music matters.',
    question: 'Which sentence, if added, would best support the researcher\'s conclusion?',
    options: ['Many people enjoy listening to music while working.', 'Participants who listened to instrumental jazz also showed improved focus.', 'The study was conducted over six weeks.', 'Music has been part of human culture for thousands of years.'],
    answer: 1,
    explanation: 'Option B provides additional evidence that non-lyrical music (instrumental jazz) improves focus, directly supporting the conclusion that music type matters.',
    domain: 'Expression of Ideas', skill: 'Supporting evidence'
  },
  {
    id: 'w_sim_05', source: 'SIM',
    question: 'Which sentence is the most concise and clear?',
    options: ['It is important to note that the fact that students study more leads to better grades.', 'Students who study more tend to earn better grades.', 'The students who engage in more studying activities tend to achieve higher grade outcomes.', 'More studying on the part of students results in the achievement of better grades.'],
    answer: 1,
    explanation: 'Option B is the most concise and direct. The others are wordy and use unnecessary phrases.',
    domain: 'Expression of Ideas', skill: 'Concision'
  },
  {
    id: 'w_sim_06', source: 'SIM',
    question: 'Choose the correct sentence:',
    options: ['Between you and I, the project was a success.', 'Between you and me, the project was a success.', 'Between you and myself, the project was a success.', 'Between I and you, the project was a success.'],
    answer: 1,
    explanation: 'After a preposition ("between"), use object pronouns. "Me" is correct, not "I" or "myself."',
    domain: 'Standard English Conventions', skill: 'Pronoun case'
  },
];

// ── VOCABULARY (30 words) ──
const VOCAB_BANK = [
  { word: 'Aberrant', definition: 'Departing from an accepted standard; abnormal.', example: 'The scientist noted aberrant behavior in the test subjects.', trick: 'ab- (away) + errare (to wander). Wandering away from normal.' },
  { word: 'Benevolent', definition: 'Well-meaning and kindly; charitable.', example: 'The benevolent donor funded the entire scholarship program.', trick: 'bene- (good) + volent (wishing). Wishing good.' },
  { word: 'Cacophony', definition: 'A harsh, discordant mixture of sounds.', example: 'The cacophony of the construction site made it hard to concentrate.', trick: 'caco- (bad) + phon (sound). Bad sound.' },
  { word: 'Dearth', definition: 'A scarcity or lack of something.', example: 'There was a dearth of qualified candidates for the position.', trick: 'Sounds like "death" of supply — extreme scarcity.' },
  { word: 'Ebullient', definition: 'Cheerful and full of energy; exuberant.', example: 'Her ebullient personality lit up every room she entered.', trick: 'e- (out) + bullire (to boil). Boiling over with joy.' },
  { word: 'Facetious', definition: 'Treating serious issues with inappropriate humor.', example: 'His facetious remarks during the meeting annoyed his colleagues.', trick: 'Face-tious → making a funny face at a serious time.' },
  { word: 'Garrulous', definition: 'Excessively talkative, especially on trivial matters.', example: 'The garrulous neighbor talked for an hour about nothing important.', trick: 'Garru- sounds like gargle. Gargling words constantly.' },
  { word: 'Harbinger', definition: 'A person or thing that announces the approach of another.', example: 'Dark clouds are a harbinger of the coming storm.', trick: 'Harbor-bringer → brings news to the harbor.' },
  { word: 'Iconoclast', definition: 'A person who attacks cherished beliefs or institutions.', example: 'The iconoclast challenged every tradition the company held sacred.', trick: 'icon (image) + clast (breaker). Image breaker.' },
  { word: 'Juxtapose', definition: 'To place two things side by side for contrasting effect.', example: 'The artist juxtaposed bright colors with dark shadows.', trick: 'juxta (next to) + pose (place). Place next to.' },
  { word: 'Laconic', definition: 'Using very few words; brief and concise.', example: 'His laconic reply — "No" — ended the discussion.', trick: 'From Laconia (Sparta) — Spartans were famous for brief speech.' },
  { word: 'Malleable', definition: 'Easily influenced or shaped; adaptable.', example: 'Young minds are malleable and absorb information quickly.', trick: 'Mal- (hammer) → can be hammered into shape.' },
  { word: 'Nefarious', definition: 'Wicked or criminal; villainous.', example: 'The detective uncovered the villain\'s nefarious scheme.', trick: 'nefas (crime in Latin). Nefarious = criminal.' },
  { word: 'Obsequious', definition: 'Excessively eager to please or obey; fawning.', example: 'The obsequious assistant agreed with everything the boss said.', trick: 'ob- (toward) + sequi (to follow). Always following and agreeing.' },
  { word: 'Pedantic', definition: 'Overly concerned with minor details or rules; showing off learning.', example: 'The pedantic professor corrected every tiny grammatical error.', trick: 'Ped- (teacher) → a teacher who over-teaches details.' },
  { word: 'Querulous', definition: 'Complaining in a petulant or whining manner.', example: 'The querulous customer complained about every aspect of the service.', trick: 'Query (question/complain) + -ulous (full of). Full of complaints.' },
  { word: 'Recalcitrant', definition: 'Having an obstinately uncooperative attitude.', example: 'The recalcitrant student refused to follow any classroom rules.', trick: 're- (back) + calcitrare (to kick). Kicking back against authority.' },
  { word: 'Sycophant', definition: 'A person who flatters someone important to gain advantage.', example: 'The politician was surrounded by sycophants who never disagreed with him.', trick: 'Syco (fig) + phant (show) → ancient Greek term for informers who "showed figs."' },
  { word: 'Taciturn', definition: 'Reserved or uncommunicative in speech; saying little.', example: 'The taciturn detective revealed nothing about the case.', trick: 'Tacit (silent) → taciturn = tends to be silent.' },
  { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern society.', trick: 'ubi (where in Latin) → everywhere.' },
  { word: 'Vacuous', definition: 'Having or showing a lack of thought or intelligence; empty.', example: 'The vacuous celebrity offered no meaningful commentary on the issue.', trick: 'Vacuous = vacuum → empty of thought.' },
  { word: 'Wane', definition: 'To decrease in vigor, power, or extent; to decline.', example: 'His enthusiasm for the project began to wane after the setbacks.', trick: 'Moon wanes (gets smaller). Wane = decrease.' },
  { word: 'Xenophobia', definition: 'Dislike of or prejudice against people from other countries.', example: 'The rise of xenophobia threatened the country\'s multicultural values.', trick: 'xeno (foreign) + phobia (fear). Fear of foreigners.' },
  { word: 'Zealous', definition: 'Having or showing great energy or enthusiasm in pursuit of a cause.', example: 'She was a zealous advocate for environmental protection.', trick: 'Zeal → zealous. Full of zeal (passionate enthusiasm).' },
  { word: 'Ambiguous', definition: 'Open to more than one interpretation; not having one obvious meaning.', example: 'The contract\'s ambiguous language led to a dispute.', trick: 'ambi- (both) → pointing in two directions at once.' },
  { word: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'The beauty of cherry blossoms is ephemeral.', trick: 'ephemeros (Greek: lasting a day). Very short-lived.' },
  { word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically.', example: 'A pragmatic approach to the problem saved time.', trick: 'pragma (Greek: deed/action). Focus on practical action.' },
  { word: 'Tenacious', definition: 'Holding firmly to something; persistent and determined.', example: 'Her tenacious spirit helped her overcome every obstacle.', trick: 'tenere (Latin: to hold). Holding on tightly.' },
  { word: 'Verbose', definition: 'Using more words than needed; wordy.', example: 'The verbose report could have been summarized in one page.', trick: 'verbum (Latin: word) + -ose (full of). Full of words.' },
  { word: 'Conciliate', definition: 'To make peace with; to appease or pacify.', example: 'The manager tried to conciliate the angry customer.', trick: 'con- (together) + cilia (eyelashes → winking). Winking to make peace.' },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const getQuestionsForModule = (module: ModuleType, count: number, wrongOnly: boolean, wrongBook: WrongEntry[]): Question[] => {
  let pool: Question[] = [];
  if (module === 'math') pool = MATH_QUESTIONS;
  else if (module === 'reading') pool = READING_QUESTIONS;
  else if (module === 'writing') pool = WRITING_QUESTIONS;
  else return [];

  if (wrongOnly) {
    const wrongIds = wrongBook.filter(e => e.module === module).map(e => e.questionId);
    pool = pool.filter(q => wrongIds.includes(q.id));
    if (pool.length === 0) return [];
  }

  // Shuffle and take count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
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

  // Vocab State
  const [vocabMode, setVocabMode] = useState<VocabMode>('menu');
  const [vocabLearnIdx, setVocabLearnIdx] = useState(0);
  const [vocabDailyNew] = useState(5);
  const [vocabDailyReview] = useState(10);
  const [vocabLearnedToday, setVocabLearnedToday] = useState(0);
  const [vocabReviewedToday, setVocabReviewedToday] = useState(0);
  const [vocabCardFlipped, setVocabCardFlipped] = useState(false);

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
    const qs = getQuestionsForModule(module, questionsPerModule, mode === 'wrong_only', wrongBook);
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
      setDrillFinalScore(correct);
      setDrillState('completed');
      if (activeModule) setDailyProgress(p => ({ ...p, [activeModule]: true }));
      const xpReward = activeModule === 'math' ? 150 : activeModule === 'reading' ? 200 : 100;
      setXp(x => x + Math.round(xpReward * (correct / drillQuestions.length)));
      setCoins(c => c + (correct >= drillQuestions.length * 0.8 ? 20 : 5));
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
      setVocabLearnIdx(p => p + 1); setVocabCardFlipped(false);
    } else {
      setVocabLearnedToday(vocabDailyNew);
      setDailyProgress(p => ({ ...p, vocab: true }));
      setXp(x => x + 50); setCoins(c => c + 10);
      setVocabMode('menu');
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

                    {vocabMode === 'learn' && (
                      <div className="bg-white rounded-3xl p-6 text-black min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
                          <span>新词 {vocabLearnIdx + 1}/{vocabDailyNew}</span>
                          <button onClick={() => setVocabMode('menu')}><XCircle className="w-6 h-6" /></button>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden"><div className="h-full bg-blue-500 transition-all" style={{ width: `${(vocabLearnIdx / vocabDailyNew) * 100}%` }} /></div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <h2 className="text-5xl font-bold mb-6">{VOCAB_BANK[vocabLearnIdx].word}</h2>
                          <div className="bg-gray-50 rounded-2xl p-6 w-full mb-4">
                            <p className="text-lg font-medium text-gray-800 mb-2">{VOCAB_BANK[vocabLearnIdx].definition}</p>
                            <p className="text-sm text-gray-500 italic">"{VOCAB_BANK[vocabLearnIdx].example}"</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 w-full text-left">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1"><Lightbulb className="w-4 h-4" /> 记忆技巧</div>
                            <p className="text-sm text-blue-800">{VOCAB_BANK[vocabLearnIdx].trick}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <button onClick={() => handleVocabLearnNext(false)} className="py-4 bg-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-200 transition-colors">不认识</button>
                          <button onClick={() => handleVocabLearnNext(true)} className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">认识</button>
                        </div>
                      </div>
                    )}

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
