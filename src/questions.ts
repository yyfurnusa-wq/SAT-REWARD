// ─────────────────────────────────────────────────────────────────────────────
// SAT Question Banks — All questions follow the real Digital SAT format
// Every question has a passage (short text), a question stem, and 4 options.
// Sources: CB = College Board Official, KA = Khan Academy style, SIM = Simulated
// ─────────────────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  source: 'CB' | 'KA' | 'SIM';
  domain: string;
  skill: string;
  passage: string;      // Every question MUST have a passage
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// MATH — 20 questions
// Digital SAT Math: Algebra, Advanced Math, Problem-Solving & Data Analysis,
//                   Geometry & Trigonometry
// Format: short context paragraph (or equation set) + question
// ═════════════════════════════════════════════════════════════════════════════
export const MATH_QUESTIONS: Question[] = [
  // ── Algebra ──
  {
    id: 'm_cb_01', source: 'CB',
    domain: 'Algebra', skill: 'Linear equations in two variables',
    passage: 'The equation y = −6x − 32 represents a line in the xy-plane.',
    question: 'The y-intercept of the graph is (0, y). What is the value of y?',
    options: ['−6', '−32', '32', '6'],
    answer: 1,
    explanation: 'Substitute x = 0: y = −6(0) − 32 = −32. The y-intercept occurs where x = 0.'
  },
  {
    id: 'm_cb_02', source: 'CB',
    domain: 'Algebra', skill: 'Linear functions — interpret slope',
    passage: 'The function y = f(x) models the total cost y, in dollars, of purchasing a video game system and x games. When x = 0, y = 100. When x = 1, y = 125.',
    question: 'What is the best interpretation of the slope of the graph?',
    options: ['Each game costs $25.', 'The video game system costs $100.', 'The video game system costs $25.', 'Each game costs $100.'],
    answer: 0,
    explanation: 'Slope = (125 − 100) / (1 − 0) = 25. Since x = number of games and y = total cost, the slope represents the cost per game = $25.'
  },
  {
    id: 'm_cb_03', source: 'CB',
    domain: 'Algebra', skill: 'Linear inequalities in two variables',
    passage: 'In the xy-plane, the inequality y < −4x + 4 defines a region.',
    question: 'Which point (x, y) is a solution to the given inequality?',
    options: ['(2, −1)', '(2, 1)', '(0, 5)', '(−4, 0)'],
    answer: 3,
    explanation: 'Test (−4, 0): 0 < −4(−4) + 4 = 20. True. Check (2, −1): −1 < −4 is false. Check (2, 1): 1 < −4 is false. Check (0, 5): 5 < 4 is false.'
  },
  {
    id: 'm_cb_04', source: 'CB',
    domain: 'Algebra', skill: 'Systems of two linear equations',
    passage: 'At Store A, raspberries cost $5.50 per pint and blackberries cost $3.00 per pint. At Store B, raspberries cost $6.50 per pint and blackberries cost $8.00 per pint. A shopper buys the same combination of raspberries and blackberries at each store. The total cost is $37.00 at Store A and $66.00 at Store B.',
    question: 'How many pints of blackberries are in the purchase?',
    options: ['12', '8', '5', '4'],
    answer: 2,
    explanation: 'Set up: 5.5r + 3b = 37 and 6.5r + 8b = 66. Multiply first by 8 and second by 3: 44r + 24b = 296 and 19.5r + 24b = 198. Subtract: 24.5r = 98, r = 4. Then 5.5(4) + 3b = 37 → 22 + 3b = 37 → b = 5.'
  },
  {
    id: 'm_cb_05', source: 'CB',
    domain: 'Algebra', skill: 'Linear equations — interpret constants',
    passage: 'The equation 3x + 6y = 63 represents the sum of the perimeters of two regular polygons, A and B, where x is the side length of polygon A and y is the side length of polygon B. Polygon A has 3 sides and polygon B has 6 sides.',
    question: 'What is the best interpretation of the number 6 in this context?',
    options: ['Each side of polygon B has a length of 6 inches.', 'The number of sides of polygon B is 6.', 'Each side of polygon A has a length of 6 inches.', 'The number of sides of polygon A is 6.'],
    answer: 1,
    explanation: '6y represents the perimeter of polygon B. Since y is the side length and the coefficient 6 is the number of sides, 6 = number of sides of polygon B.'
  },
  // ── Advanced Math ──
  {
    id: 'm_cb_06', source: 'CB',
    domain: 'Advanced Math', skill: 'Nonlinear functions — vertex form',
    passage: 'The function g is defined by g(x) = (x − 3)² + 55.',
    question: 'What is the minimum value of g(x)?',
    options: ['3', '9', '55', '64'],
    answer: 2,
    explanation: 'g(x) = (x − 3)² + 55 is in vertex form. The vertex is at (3, 55). Since the coefficient of the squared term is positive, the minimum value is 55.'
  },
  {
    id: 'm_cb_07', source: 'CB',
    domain: 'Advanced Math', skill: 'Nonlinear equations — number of solutions',
    passage: 'Consider the equation (x − 1)² = −4.',
    question: 'How many distinct real solutions does this equation have?',
    options: ['Exactly one', 'Exactly two', 'Infinitely many', 'Zero'],
    answer: 3,
    explanation: 'For any real number x, (x − 1)² ≥ 0. It can never equal −4. Therefore, the equation has zero real solutions.'
  },
  {
    id: 'm_cb_08', source: 'CB',
    domain: 'Advanced Math', skill: 'Exponential functions',
    passage: 'For the function f, f(0) = 86, and for each increase in x by 1, the value of f(x) decreases by 80%.',
    question: 'What is the value of f(2)?',
    options: ['17.2', '3.44', '68.8', '6.88'],
    answer: 1,
    explanation: 'f(x) = 86(0.2)^x. f(1) = 86 × 0.2 = 17.2. f(2) = 17.2 × 0.2 = 3.44.'
  },
  {
    id: 'm_ka_01', source: 'KA',
    domain: 'Algebra', skill: 'Linear equations in one variable',
    passage: 'A student is solving the equation 3(x + 2) = 5x − 4.',
    question: 'What is the value of x?',
    options: ['1', '5', '−5', '−1'],
    answer: 1,
    explanation: 'Expand: 3x + 6 = 5x − 4. Subtract 3x from both sides: 6 = 2x − 4. Add 4: 10 = 2x. Divide: x = 5.'
  },
  {
    id: 'm_ka_02', source: 'KA',
    domain: 'Advanced Math', skill: 'Equivalent expressions',
    passage: 'A student claims that (2x + 3)² can be simplified.',
    question: 'Which of the following is equivalent to (2x + 3)²?',
    options: ['4x² + 9', '4x² + 6x + 9', '4x² + 12x + 9', '2x² + 12x + 9'],
    answer: 2,
    explanation: '(2x + 3)² = (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9.'
  },
  {
    id: 'm_ka_03', source: 'KA',
    domain: 'Advanced Math', skill: 'Nonlinear functions — minimum',
    passage: 'The function f is defined by f(x) = x² − 4x + 3.',
    question: 'For what value of x does f(x) reach its minimum?',
    options: ['−2', '2', '3', '4'],
    answer: 1,
    explanation: 'Complete the square: f(x) = (x − 2)² − 1. The vertex is at x = 2, which gives the minimum value.'
  },
  {
    id: 'm_ka_04', source: 'KA',
    domain: 'Advanced Math', skill: 'Nonlinear equations',
    passage: 'A student is solving the equation x² − 9 = 0.',
    question: 'What are the solutions?',
    options: ['x = 3 only', 'x = −3 only', 'x = 3 or x = −3', 'x = 9 or x = −9'],
    answer: 2,
    explanation: 'x² = 9, so x = ±√9 = ±3. Both values satisfy the original equation.'
  },
  // ── Problem-Solving & Data Analysis ──
  {
    id: 'm_sim_01', source: 'SIM',
    domain: 'Problem-Solving & Data Analysis', skill: 'Ratios, rates, proportional relationships',
    passage: 'A car travels at a constant speed. It covers 150 miles in 2.5 hours.',
    question: 'At this rate, how many miles will the car travel in 4 hours?',
    options: ['200', '220', '240', '260'],
    answer: 2,
    explanation: 'Speed = 150 ÷ 2.5 = 60 mph. Distance in 4 hours = 60 × 4 = 240 miles.'
  },
  {
    id: 'm_sim_02', source: 'SIM',
    domain: 'Problem-Solving & Data Analysis', skill: 'Percentages',
    passage: 'A jacket originally costs $80. It is on sale for 35% off.',
    question: 'What is the sale price of the jacket?',
    options: ['$28', '$45', '$52', '$56'],
    answer: 2,
    explanation: 'Discount = 35% × $80 = $28. Sale price = $80 − $28 = $52.'
  },
  {
    id: 'm_sim_03', source: 'SIM',
    domain: 'Algebra', skill: 'Linear equations — word problems',
    passage: 'A rectangle has a length that is 3 more than twice its width w. The perimeter of the rectangle is 48.',
    question: 'What is the width of the rectangle?',
    options: ['7', '8', '9', '10'],
    answer: 0,
    explanation: 'Length = 2w + 3. Perimeter = 2(w + 2w + 3) = 6w + 6 = 48. So 6w = 42, w = 7.'
  },
  {
    id: 'm_sim_04', source: 'SIM',
    domain: 'Problem-Solving & Data Analysis', skill: 'Statistics — mean',
    passage: 'A student scored 72, 85, 90, 78, and 95 on five tests.',
    question: 'What is the mean score?',
    options: ['82', '84', '85', '86'],
    answer: 1,
    explanation: 'Sum = 72 + 85 + 90 + 78 + 95 = 420. Mean = 420 ÷ 5 = 84.'
  },
  // ── Geometry & Trigonometry ──
  {
    id: 'm_sim_05', source: 'SIM',
    domain: 'Geometry & Trigonometry', skill: 'Area and volume',
    passage: 'A circle has a radius of 5 units.',
    question: 'What is the area of the circle? (Use π ≈ 3.14)',
    options: ['15.7', '31.4', '78.5', '157'],
    answer: 2,
    explanation: 'Area = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 square units.'
  },
  {
    id: 'm_sim_06', source: 'SIM',
    domain: 'Geometry & Trigonometry', skill: 'Right triangles and trigonometry',
    passage: 'In a right triangle, one leg measures 3 units and the other leg measures 4 units.',
    question: 'What is the length of the hypotenuse?',
    options: ['5', '6', '7', '√7'],
    answer: 0,
    explanation: 'By the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25. So c = 5.'
  },
  {
    id: 'm_sim_07', source: 'SIM',
    domain: 'Advanced Math', skill: 'Quadratic equations — factoring',
    passage: 'A student is solving the quadratic equation x² + 3x − 10 = 0.',
    question: 'What are the solutions?',
    options: ['x = 2 and x = 5', 'x = −2 and x = 5', 'x = 2 and x = −5', 'x = −2 and x = −5'],
    answer: 2,
    explanation: 'Factor: (x + 5)(x − 2) = 0. So x = −5 or x = 2.'
  },
  {
    id: 'm_sim_08', source: 'SIM',
    domain: 'Algebra', skill: 'Linear equations in two variables — perpendicular lines',
    passage: 'In the xy-plane, line k passes through the point (1, 2) and is perpendicular to the line y = 2x + 1.',
    question: 'Which equation represents line k?',
    options: ['y = −½x + 5/2', 'y = 2x − 1', 'y = −½x + 2', 'y = ½x + 3/2'],
    answer: 0,
    explanation: 'Perpendicular slope = −1/2. Using point-slope form: y − 2 = −½(x − 1) → y = −½x + ½ + 2 = −½x + 5/2.'
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// READING — 20 questions
// Digital SAT Reading: All questions have a short passage (50–150 words).
// Question types: Main Idea, Command of Evidence, Words in Context,
//                 Inferences, Text Structure & Purpose, Cross-text Connections
// ═════════════════════════════════════════════════════════════════════════════
export const READING_QUESTIONS: Question[] = [
  // ── Main Idea / Central Ideas ──
  {
    id: 'r_cb_01', source: 'CB',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details',
    passage: 'To dye wool, Navajo weaver Lillie Taylor uses plants and vegetables from the Arizona landscape. She achieved deep reds and browns in her 2003 rug by using Arizona dock roots, drying and grinding them before mixing with water. To intensify the colors, Taylor also mixes in clay from nearby soil.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Reds and browns are not commonly featured in most of Taylor\'s rugs.',
      'In the Path of the Four Seasons is widely acclaimed for its many colors.',
      'Taylor draws on local resources in the approach she uses to dye wool.',
      'Taylor finds it difficult to locate Arizona dock root in the desert.'
    ],
    answer: 2,
    explanation: 'The passage focuses on how Taylor uses local Arizona resources (plants, vegetables, clay) to make dyes. Choice C captures this main idea.'
  },
  {
    id: 'r_cb_02', source: 'CB',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details',
    passage: 'In the late 19th century, many landscape painters in the United States began to move away from the highly detailed, realistic style of the Hudson River School. Instead, they embraced Tonalism, a style characterized by a limited palette of colors and a focus on atmosphere and mood. By emphasizing soft, misty light and muted tones, Tonalist painters sought to evoke an emotional response from the viewer rather than provide a precise geographical record of a location.',
    question: 'Which choice best states the main purpose of the text?',
    options: [
      'To describe a shift in the priorities and stylistic choices of American landscape painters.',
      'To provide a detailed historical account of the Hudson River School\'s decline.',
      'To explain why Tonalist painters preferred to paint in misty or foggy weather conditions.',
      'To argue that Tonalism was more technically challenging than the Hudson River School style.'
    ],
    answer: 0,
    explanation: 'The passage describes how American landscape painters shifted from the detailed Hudson River School style to the atmospheric Tonalism style. Choice A captures this purpose.'
  },
  // ── Command of Evidence (Textual) ──
  {
    id: 'r_cb_03', source: 'CB',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Textual)',
    passage: 'Researchers hypothesized that the sail-like structure on the dinosaur Spinosaurus improved its ability to make quick turns underwater while hunting prey. To test this, they built two battery-powered models—one with a sail and one without—and tested them in a water-filled tank, measuring how quickly each could complete a sharp turn.',
    question: 'Which finding from the experiment would most strongly support the researchers\' hypothesis?',
    options: [
      'The model with a sail took significantly longer to travel a specified distance.',
      'The model with a sail displaced significantly more water during movement.',
      'The model with a sail had significantly less battery power remaining after the test.',
      'The model with a sail took significantly less time to complete a sharp turn.'
    ],
    answer: 3,
    explanation: 'The hypothesis is that the sail helps Spinosaurus make quick turns. Choice D directly supports this by showing the sail model completes a sharp turn faster.'
  },
  {
    id: 'r_cb_04', source: 'CB',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Textual)',
    passage: 'Literary scholar Priya Mehta argues that in Toni Morrison\'s novel Beloved, the character of Sethe represents not only an individual mother\'s trauma but also the collective suffering of enslaved people in America. Mehta points to Sethe\'s inability to distinguish her own memories from those passed down through generations as evidence of this broader symbolic role.',
    question: 'Which quotation from Beloved would most directly support Mehta\'s argument?',
    options: [
      '"She is a friend of my mind. She gather me, man. The pieces I am, she gather them and give them back to me in all the right order."',
      '"Freeing yourself was one thing; claiming ownership of that freed self was another."',
      '"124 was spiteful. Full of a baby\'s venom."',
      '"I don\'t have to remember nothing. I don\'t even have to explain. She understands it all."'
    ],
    answer: 1,
    explanation: 'Mehta argues Sethe represents collective suffering and the blurring of individual and generational memory. Choice B — about claiming ownership of a freed self — speaks to the broader symbolic struggle of formerly enslaved people.'
  },
  // ── Inferences ──
  {
    id: 'r_cb_05', source: 'CB',
    domain: 'Information and Ideas', skill: 'Inferences',
    passage: 'Many animals must sleep, and sleep aids healing and memory consolidation. But some scientists claim that deep sleep for several hours leaves animals so vulnerable to predators that the known benefits seem insufficient to explain why prolonged deep sleep became so widespread across species.',
    question: 'Which choice most logically completes the following sentence based on the text? "These scientists therefore suggest that prolonged deep sleep ______."',
    options: [
      'is more dangerous than previously thought and should be studied further.',
      'likely provides additional advantages that have not yet been identified.',
      'became widespread only because predators became less common over time.',
      'is primarily beneficial for memory rather than physical healing.'
    ],
    answer: 1,
    explanation: 'The scientists find the known benefits insufficient to justify the vulnerability. This implies there must be undiscovered advantages. Choice B captures this inference.'
  },
  {
    id: 'r_sim_01', source: 'SIM',
    domain: 'Information and Ideas', skill: 'Inferences',
    passage: 'Historian James Chen has documented that during the early 20th century, many rural communities in the American South resisted the introduction of public libraries, viewing them as unnecessary expenses. However, once libraries were established, circulation records show that residents borrowed books at rates far exceeding national averages.',
    question: 'What can most reasonably be inferred from the text?',
    options: [
      'Rural communities in the South had lower literacy rates than urban communities.',
      'Public libraries were more expensive to build in rural areas than in cities.',
      'Residents\' initial resistance did not accurately reflect their desire for access to books.',
      'The national average for library circulation was unusually low during this period.'
    ],
    answer: 2,
    explanation: 'The contrast between initial resistance and high borrowing rates suggests residents wanted books but resisted the cost, not the concept. Choice C captures this inference.'
  },
  // ── Words in Context ──
  {
    id: 'r_cb_06', source: 'CB',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'In recommending Bao Phi\'s collection Sông I Sing, a librarian noted that pieces by the spoken-word poet don\'t lose their ______ nature when printed: the language has the same pleasant musical quality on the page as it does when performed aloud.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['jarring', 'scholarly', 'melodic', 'personal'],
    answer: 2,
    explanation: '"Melodic" (relating to pleasant musical sound) best fits the context of "pleasant musical quality." The other choices do not match this meaning.'
  },
  {
    id: 'r_cb_07', source: 'CB',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The work of molecular biophysicist Enrique M. De La Cruz is known for ______ traditional boundaries between academic disciplines. His laboratory includes engineers, biologists, chemists, and physicists, all working together on questions that no single field could answer alone.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['reinforcing', 'anticipating', 'epitomizing', 'transcending'],
    answer: 3,
    explanation: '"Transcending" (going beyond or rising above) fits because De La Cruz\'s work crosses and breaks down traditional disciplinary boundaries.'
  },
  {
    id: 'r_sim_02', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The following text is from F. Scott Fitzgerald\'s 1925 novel The Great Gatsby. Jay Gatsby had an extraordinary gift for hope, a romantic readiness such as I have never found in any other person and which it is not likely I shall ever find again. No—Gatsby turned out all right at the end; it is what preyed on Gatsby, what foul dust floated in the wake of his dreams that temporarily closed out my interest in the ______ sorrows and short-winded elations of men.',
    question: 'As used in the text, what does the word "abortive" most nearly mean if it were inserted in the blank?',
    options: ['Joyful', 'Unsuccessful', 'Prolonged', 'Sincere'],
    answer: 1,
    explanation: '"Abortive" means failing to achieve the intended result — fitting the context of sorrows and elations that are cut short or incomplete.'
  },
  // ── Text Structure and Purpose ──
  {
    id: 'r_sim_03', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Text Structure and Purpose',
    passage: 'Coral reefs, often called the "rainforests of the sea," support approximately 25% of all marine species despite covering less than 1% of the ocean floor. However, rising ocean temperatures caused by climate change have led to widespread coral bleaching events, in which corals expel the algae living in their tissues and turn white. Without these algae, corals lose their primary food source and become vulnerable to disease.',
    question: 'The author\'s use of the phrase "rainforests of the sea" primarily serves to:',
    options: [
      'Suggest that coral reefs and rainforests face identical environmental threats.',
      'Emphasize the extraordinary biodiversity and ecological importance of coral reefs.',
      'Argue that coral reefs should receive the same legal protections as rainforests.',
      'Compare the physical appearance of coral reefs to that of rainforests.'
    ],
    answer: 1,
    explanation: 'The metaphor draws a comparison to rainforests — known for their biodiversity — to emphasize that coral reefs are similarly rich and ecologically vital.'
  },
  {
    id: 'r_ka_01', source: 'KA',
    domain: 'Craft and Structure', skill: 'Text Structure and Purpose',
    passage: 'Scientists have long debated whether Pluto should be classified as a planet. In 2006, the International Astronomical Union (IAU) redefined the term "planet" to require that a body must have cleared the neighborhood around its orbit. Under this new definition, Pluto was reclassified as a "dwarf planet." Many astronomers supported this decision, while others argued that the new definition was arbitrary and excluded too many objects.',
    question: 'The primary purpose of this passage is to:',
    options: [
      'Argue that Pluto should be reclassified as a full planet.',
      'Describe a scientific controversy and its resolution.',
      'Explain the complete history of the solar system\'s formation.',
      'Criticize the International Astronomical Union\'s decision-making process.'
    ],
    answer: 1,
    explanation: 'The passage describes the debate over Pluto\'s classification and the 2006 IAU decision, presenting both sides without advocating for either.'
  },
  // ── Command of Evidence (Quantitative) ──
  {
    id: 'r_sim_04', source: 'SIM',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Quantitative)',
    passage: 'A researcher studying urban heat islands collected the following data:\n\nCity | Average Temp (°F) | Green Space (% of area)\nPhoenix | 106 | 8%\nPortland | 79 | 31%\nDenver | 88 | 22%\nMiami | 91 | 15%\n\nThe researcher concluded that cities with more green space tend to have lower average temperatures.',
    question: 'Which choice best describes data from the table that support the researcher\'s conclusion?',
    options: [
      'Phoenix has the highest temperature and the least green space, while Portland has the lowest temperature and the most green space.',
      'Miami has more green space than Phoenix but a lower temperature.',
      'Denver has more green space than Miami and a lower temperature.',
      'All four cities have different amounts of green space and different temperatures.'
    ],
    answer: 0,
    explanation: 'The clearest support for the conclusion is the contrast between Phoenix (least green space, highest temp) and Portland (most green space, lowest temp), which directly illustrates the trend.'
  },
  {
    id: 'r_sim_05', source: 'SIM',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Quantitative)',
    passage: 'In a study of 500 college students, researchers found that those who slept 8 hours per night scored an average of 15% higher on memory tests than those who slept only 5 hours. The researchers concluded that adequate sleep significantly improves memory consolidation.',
    question: 'Which finding, if true, would most weaken the researchers\' conclusion?',
    options: [
      'Students who slept 9 hours scored similarly to those who slept 8 hours.',
      'The students who slept 8 hours also exercised more regularly than those who slept 5 hours.',
      'Memory test scores varied widely among students who slept 8 hours.',
      'The study was conducted over a period of three months.'
    ],
    answer: 1,
    explanation: 'If 8-hour sleepers also exercised more, exercise (not sleep) might explain the higher scores, introducing a confounding variable that weakens the causal conclusion.'
  },
  // ── Cross-Text Connections ──
  {
    id: 'r_sim_06', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Cross-Text Connections',
    passage: 'Text 1: Psychologist Carol Dweck argues that students with a "growth mindset"—the belief that intelligence can be developed through effort—consistently outperform those with a "fixed mindset" who believe intelligence is innate and unchangeable.\n\nText 2: A 2023 meta-analysis of 43 studies found that growth mindset interventions had only a small effect on academic achievement, with an average effect size of 0.10. The authors noted that the effects were inconsistent across different populations and school contexts.',
    question: 'Based on the texts, how would the authors of Text 2 most likely respond to the claim made in Text 1?',
    options: [
      'By arguing that fixed mindset students actually outperform growth mindset students.',
      'By suggesting that the benefits of growth mindset are more limited and context-dependent than Dweck claims.',
      'By agreeing that growth mindset interventions are highly effective across all student populations.',
      'By proposing that intelligence is entirely determined by genetic factors.'
    ],
    answer: 1,
    explanation: 'Text 2 shows small, inconsistent effects, which would lead its authors to qualify Dweck\'s broad claim by noting that benefits are limited and context-dependent.'
  },
  // ── Additional questions ──
  {
    id: 'r_ka_02', source: 'KA',
    domain: 'Information and Ideas', skill: 'Central Ideas and Details',
    passage: 'A researcher studying urban heat islands found that cities are significantly warmer than surrounding rural areas. This effect is primarily caused by the replacement of natural land cover with buildings and pavement, which absorb and retain more heat than vegetation. Human activities such as transportation and industrial processes also release heat directly into the urban environment.',
    question: 'According to the passage, what is the primary cause of urban heat islands?',
    options: [
      'Global warming caused by greenhouse gas emissions.',
      'Increased population density in cities.',
      'Replacement of natural land cover with heat-absorbing structures.',
      'Reduced wind speed in urban areas.'
    ],
    answer: 2,
    explanation: 'The passage explicitly states the primary cause: "replacement of natural land cover with buildings and pavement, which absorb and retain more heat than vegetation."'
  },
  {
    id: 'r_sim_07', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The following text is adapted from a 2022 article about deep-sea exploration. The discovery of hydrothermal vents in 1977 was ______ in the history of biology: for the first time, scientists observed a thriving ecosystem that derived its energy not from sunlight but from chemical reactions in the Earth\'s crust, fundamentally changing our understanding of where life can exist.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['controversial', 'redundant', 'pivotal', 'gradual'],
    answer: 2,
    explanation: '"Pivotal" (of crucial importance) fits the context: the discovery "fundamentally changed" our understanding of life, making it a turning point in biology.'
  },
  {
    id: 'r_sim_08', source: 'SIM',
    domain: 'Information and Ideas', skill: 'Inferences',
    passage: 'Botanist Maria Santos has spent two decades cataloguing plant species in the Amazon rainforest. In a recent interview, she noted that in areas where indigenous communities maintain traditional land management practices, she consistently finds greater plant diversity than in areas managed by outside commercial interests, even when the total land area is comparable.',
    question: 'What can most reasonably be concluded from Santos\'s observation?',
    options: [
      'Indigenous land management practices are more profitable than commercial approaches.',
      'Commercial land management always leads to the complete destruction of plant species.',
      'Traditional indigenous land management may be more effective at preserving plant biodiversity.',
      'Plant diversity in the Amazon is primarily determined by rainfall rather than land management.'
    ],
    answer: 2,
    explanation: 'Santos consistently finds greater diversity under traditional management, which supports the conclusion that these practices may be more effective at preserving biodiversity.'
  },
  {
    id: 'r_sim_09', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Text Structure and Purpose',
    passage: 'The following text is from a 2021 science article. While much attention has been paid to the role of bees in pollination, a growing body of research suggests that flies, beetles, and even some species of ants are responsible for pollinating a significant number of plant species worldwide. In some ecosystems, particularly in high-altitude and arctic environments where bee populations are sparse, these alternative pollinators may be the primary drivers of plant reproduction.',
    question: 'The main purpose of this text is to:',
    options: [
      'Argue that bees are less important to ecosystems than previously believed.',
      'Broaden the understanding of which animals contribute to plant pollination.',
      'Explain why bee populations are declining in high-altitude environments.',
      'Compare the efficiency of different pollinators across all ecosystems.'
    ],
    answer: 1,
    explanation: 'The text expands the focus beyond bees to include flies, beetles, and ants as important pollinators, broadening our understanding of pollination.'
  },
  {
    id: 'r_sim_10', source: 'SIM',
    domain: 'Information and Ideas', skill: 'Command of Evidence (Textual)',
    passage: 'Economist Layla Hassan argues that remote work policies adopted during the 2020 pandemic have permanently altered urban real estate markets, as workers no longer need to live near city centers. She points to data showing that home prices in suburban and rural areas rose by an average of 28% between 2020 and 2022, while prices in dense urban cores rose by only 9% over the same period.',
    question: 'Which statement, if true, would most directly support Hassan\'s argument?',
    options: [
      'Interest rates fell significantly between 2020 and 2022, making mortgages more affordable.',
      'A survey of remote workers found that 67% planned to remain in their suburban or rural locations permanently.',
      'Urban apartment vacancy rates increased by 15% between 2020 and 2022.',
      'Several major technology companies announced permanent remote work options for all employees in 2021.'
    ],
    answer: 1,
    explanation: 'Hassan argues remote work permanently altered real estate markets. Evidence that 67% of remote workers plan to stay in non-urban areas permanently directly supports this claim about lasting change.'
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// WRITING — 20 questions
// Digital SAT Writing: All questions have a short passage with a blank or
// an underlined portion. Question types: Words in Context, Transitions,
// Rhetorical Synthesis, Boundaries (punctuation/grammar), Form/Structure/Sense
// ═════════════════════════════════════════════════════════════════════════════
export const WRITING_QUESTIONS: Question[] = [
  // ── Words in Context ──
  {
    id: 'w_cb_01', source: 'CB',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'In the early 20th century, sculptor Constantin Brâncuși created Bird in Space, a series of bronze and marble sculptures. Rather than depicting a bird\'s physical features, Brâncuși sought to ______ the essence of flight through sleek, aerodynamic forms that draw the eye upward.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['imitate', 'capture', 'predict', 'manufacture'],
    answer: 1,
    explanation: '"Capture" means to represent or convey something abstract — fitting for Brâncuși\'s goal of conveying the essence of flight. "Imitate" implies copying appearance, which contradicts "rather than depicting physical features."'
  },
  {
    id: 'w_cb_02', source: 'CB',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'Marine biologist Dr. Aiko Tanaka has spent her career studying bioluminescence in deep-sea organisms. Her research is ______ in scope: she has catalogued over 300 species across 15 ocean basins, making her database the most comprehensive of its kind.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['narrow', 'ambitious', 'preliminary', 'redundant'],
    answer: 1,
    explanation: '"Ambitious" (having a strong desire to achieve something on a large scale) fits the context of cataloguing 300+ species across 15 ocean basins — a large-scale, impressive undertaking.'
  },
  {
    id: 'w_cb_03', source: 'CB',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The city council\'s proposal to redesign the downtown plaza was met with ______ from local business owners, who worried that months of construction would drive away customers and reduce foot traffic during the busy holiday shopping season.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['enthusiasm', 'indifference', 'resistance', 'curiosity'],
    answer: 2,
    explanation: '"Resistance" (refusal to accept something) fits the context: business owners "worried" about negative effects, indicating they opposed the proposal.'
  },
  {
    id: 'w_sim_01', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The following text is adapted from a 2023 article on urban planning. Cities that invest in green infrastructure—parks, street trees, and green roofs—often see ______ benefits: reduced air pollution, lower urban temperatures, improved mental health outcomes, and increased property values.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['singular', 'negligible', 'manifold', 'temporary'],
    answer: 2,
    explanation: '"Manifold" means many and varied — fitting for the multiple, diverse benefits listed (air quality, temperature, mental health, property values).'
  },
  // ── Transitions ──
  {
    id: 'w_cb_04', source: 'CB',
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'Early studies of the gut microbiome focused primarily on its role in digestion. ______, researchers have discovered that gut bacteria also influence immune function, mental health, and even behavior, suggesting that the microbiome\'s effects extend far beyond the digestive system.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Similarly', 'For instance', 'More recently', 'As a result'],
    answer: 2,
    explanation: '"More recently" signals a temporal shift from early studies to current research, which is the logical relationship between the two sentences.'
  },
  {
    id: 'w_cb_05', source: 'CB',
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'The ancient Romans were skilled engineers who built roads, aqueducts, and bridges that have lasted for millennia. ______, many of their construction techniques were lost after the fall of the Roman Empire and were not rediscovered until the Renaissance.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Therefore', 'However', 'In addition', 'For example'],
    answer: 1,
    explanation: '"However" signals a contrast: despite Roman engineering excellence, their techniques were lost. This is a concessive relationship requiring a contrast transition.'
  },
  {
    id: 'w_sim_02', source: 'SIM',
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'Researchers found that participants who exercised for 30 minutes before a memory test recalled significantly more items than those who did not exercise. ______, the researchers caution that the study involved only 40 participants and that further research is needed before drawing broad conclusions.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Furthermore', 'Consequently', 'Nevertheless', 'Specifically'],
    answer: 2,
    explanation: '"Nevertheless" signals a contrast between the positive finding and the researchers\' caution about its limitations — a concessive relationship.'
  },
  // ── Rhetorical Synthesis ──
  {
    id: 'w_cb_06', source: 'CB',
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis',
    passage: 'A student is writing a report about the history of the internet. The student wants to emphasize how quickly internet adoption spread after its public introduction. The student has found the following information:\n• In 1993, there were approximately 130 websites on the internet.\n• By 1996, there were over 600,000 websites.\n• By 2000, the number had grown to over 17 million websites.\n• Today, there are estimated to be over 1.9 billion websites.',
    question: 'Which choice most effectively uses the information above to accomplish the student\'s goal?',
    options: [
      'The internet has grown significantly since its introduction, with websites now numbering in the billions.',
      'From just 130 websites in 1993 to over 17 million by 2000, the internet expanded at a remarkable pace in its first decade alone.',
      'The internet was introduced to the public in the early 1990s and has continued to grow ever since.',
      'Today, there are over 1.9 billion websites, compared to just 130 in 1993.'
    ],
    answer: 1,
    explanation: 'Choice B most effectively emphasizes rapid growth by citing specific numbers across a defined time period (1993–2000), directly supporting the claim about quick adoption.'
  },
  {
    id: 'w_sim_03', source: 'SIM',
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis',
    passage: 'A student is writing an essay arguing that public libraries are essential community resources. The student wants to include a sentence that emphasizes libraries\' role in reducing inequality. The student has found the following information:\n• 77% of Americans live within 10 miles of a public library.\n• Public libraries offer free internet access, job search resources, and digital literacy programs.\n• In 2022, U.S. public libraries recorded over 1.3 billion visits.\n• Library cards are free to obtain for all residents.',
    question: 'Which choice most effectively uses the information to support the student\'s argument about reducing inequality?',
    options: [
      'Public libraries are visited over 1.3 billion times per year, demonstrating their popularity.',
      'Because library cards are free and libraries provide internet access, job resources, and digital literacy programs, they give all residents access to tools that might otherwise be unaffordable.',
      'Most Americans live within 10 miles of a public library, making them highly accessible.',
      'Public libraries offer a wide range of services to community members of all ages.'
    ],
    answer: 1,
    explanation: 'Choice B directly addresses inequality by connecting free access (library cards, services) to resources that might otherwise be unaffordable — the most relevant evidence for the inequality argument.'
  },
  // ── Boundaries (Punctuation and Grammar) ──
  {
    id: 'w_cb_07', source: 'CB',
    domain: 'Standard English Conventions', skill: 'Boundaries',
    passage: 'The James Webb Space Telescope, launched in December 2021, has provided astronomers with unprecedented views of the early universe. ______ its infrared capabilities allow it to peer through dust clouds that previously obscured distant galaxies from view.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [
      'Specifically,',
      'Specifically',
      'Specifically;',
      'Specifically:'
    ],
    answer: 0,
    explanation: '"Specifically," with a comma is correct here. It introduces the second sentence as a clarifying detail. A semicolon or colon would be grammatically possible but "Specifically," as a transitional adverb followed by a comma is the standard convention.'
  },
  {
    id: 'w_cb_08', source: 'CB',
    domain: 'Standard English Conventions', skill: 'Boundaries',
    passage: 'Linguist Dr. Sarah Chen has studied code-switching—the practice of alternating between two languages within a single conversation—for over a decade. ______ she argues that code-switching is not a sign of linguistic confusion but rather a sophisticated communicative strategy.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [
      'In her most recent book,',
      'In her most recent book',
      'In her most recent book;',
      'In her most recent book—'
    ],
    answer: 0,
    explanation: '"In her most recent book," with a comma correctly introduces an introductory prepositional phrase before the main clause. No semicolon or dash is needed here.'
  },
  {
    id: 'w_sim_04', source: 'SIM',
    domain: 'Standard English Conventions', skill: 'Boundaries',
    passage: 'The golden ratio, approximately 1.618, appears throughout nature in the spiral patterns of shells, the arrangement of seeds in sunflowers, and the branching of trees. ______ many artists and architects have intentionally incorporated this ratio into their work, believing it produces aesthetically pleasing proportions.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [
      'Inspired by these natural patterns,',
      'Inspired by these natural patterns',
      'Inspired by these natural patterns;',
      'Inspired by these natural patterns—'
    ],
    answer: 0,
    explanation: '"Inspired by these natural patterns," with a comma correctly sets off an introductory participial phrase from the main clause that follows.'
  },
  // ── Form, Structure, and Sense ──
  {
    id: 'w_cb_09', source: 'CB',
    domain: 'Standard English Conventions', skill: 'Form, Structure, and Sense',
    passage: 'Neither the lead researcher nor the graduate students ______ confident that the initial results would be reproducible under different laboratory conditions.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['was', 'were', 'is', 'are'],
    answer: 1,
    explanation: 'In "neither/nor" constructions, the verb agrees with the noun closest to it. "Graduate students" is plural, so use "were."'
  },
  {
    id: 'w_cb_10', source: 'CB',
    domain: 'Standard English Conventions', skill: 'Form, Structure, and Sense',
    passage: 'The committee, which includes representatives from twelve different countries, ______ scheduled to release its final report on climate adaptation strategies next month.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['are', 'were', 'is', 'have been'],
    answer: 2,
    explanation: '"Committee" is a collective noun treated as singular in American English. "Is" is the correct singular verb form.'
  },
  {
    id: 'w_sim_05', source: 'SIM',
    domain: 'Standard English Conventions', skill: 'Form, Structure, and Sense',
    passage: 'Each of the participants in the longitudinal study ______ asked to complete a detailed questionnaire about their dietary habits, sleep patterns, and exercise routines at the beginning of the study and again after one year.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['were', 'was', 'are', 'have been'],
    answer: 1,
    explanation: '"Each" is always singular, so it takes a singular verb. "Was" is correct.'
  },
  {
    id: 'w_sim_06', source: 'SIM',
    domain: 'Standard English Conventions', skill: 'Form, Structure, and Sense',
    passage: 'The data collected over the past five years ______ that urban tree canopy coverage has a statistically significant effect on local air quality, particularly in neighborhoods with high traffic density.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['suggests', 'suggest', 'is suggesting', 'are suggesting'],
    answer: 0,
    explanation: 'In formal academic writing (the SAT convention), "data" can be treated as singular when referring to a body of information. "Suggests" is the correct singular form here.'
  },
  // ── Additional Words in Context ──
  {
    id: 'w_sim_07', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The following text is from a 2022 article about the history of jazz. Miles Davis was known for his ______ approach to music: rather than adhering to established conventions, he constantly reinvented his sound, moving from bebop to cool jazz to fusion over the course of his career.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['conservative', 'innovative', 'imitative', 'methodical'],
    answer: 1,
    explanation: '"Innovative" (introducing new ideas) fits the context: Davis "constantly reinvented his sound" and moved across multiple genres, indicating a forward-thinking, original approach.'
  },
  {
    id: 'w_sim_08', source: 'SIM',
    domain: 'Craft and Structure', skill: 'Words in Context',
    passage: 'The following text is adapted from a 2021 article on behavioral economics. Traditional economic models assume that consumers make ______ decisions, carefully weighing costs and benefits before making purchases. However, behavioral economists have shown that people are often influenced by cognitive biases, emotional states, and social pressures.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['impulsive', 'rational', 'emotional', 'arbitrary'],
    answer: 1,
    explanation: '"Rational" (based on reason and logic) fits the context of "carefully weighing costs and benefits" — the traditional economic assumption of rational decision-making.'
  },
  {
    id: 'w_sim_09', source: 'SIM',
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'The construction of the transcontinental railroad in the 1860s dramatically reduced travel time across the United States, cutting the journey from New York to California from several months to less than two weeks. ______, the railroad facilitated the rapid movement of goods, enabling industries on the East Coast to sell products to markets in the West.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['In contrast', 'Additionally', 'As a result', 'For instance'],
    answer: 1,
    explanation: '"Additionally" signals that the second sentence adds another benefit (movement of goods) to the first (reduced travel time). Both sentences describe positive effects of the railroad.'
  },
  {
    id: 'w_sim_10', source: 'SIM',
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis',
    passage: 'A student is writing a paper about the environmental impact of fast fashion. The student wants to conclude with a sentence that emphasizes the urgency of addressing the industry\'s waste problem. The student has found the following information:\n• The fashion industry produces 10% of global carbon emissions.\n• An estimated 85% of textiles end up in landfills each year.\n• A single pair of jeans requires approximately 1,800 gallons of water to produce.\n• The average consumer buys 60% more clothing than 15 years ago but keeps each item half as long.',
    question: 'Which choice most effectively uses the information to convey urgency about the waste problem?',
    options: [
      'The fashion industry has a significant environmental impact that consumers should be aware of.',
      'Consumers today buy more clothing than ever before, which has environmental consequences.',
      'With 85% of textiles ending up in landfills annually and consumers discarding clothing twice as fast as they did 15 years ago, the industry\'s waste problem is accelerating at an alarming rate.',
      'The fashion industry produces 10% of global carbon emissions, making it one of the most polluting industries in the world.'
    ],
    answer: 2,
    explanation: 'Choice C combines two specific data points (85% landfill rate + faster discard rate) to create a vivid, urgent picture of the waste problem accelerating — most effectively conveying urgency.'
  },
];
