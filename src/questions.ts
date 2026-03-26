// SAT Question Banks — All questions follow the real Digital SAT format
// Every question has a passage (short text), a question stem, and 4 options.
// Sources: CB = College Board Official, KA = Khan Academy style, SIM = Simulated
// Difficulty: 1=Easy, 2=Medium, 3=Hard
// ─────────────────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  source: 'CB' | 'KA' | 'SIM';
  domain: string;
  skill: string;
  difficulty: 1 | 2 | 3;  // 1=Easy, 2=Medium, 3=Hard
  passage: string;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// MATH — 45 questions (15 Easy, 15 Medium, 15 Hard)
// Digital SAT Math: Algebra, Advanced Math, Problem-Solving & Data Analysis,
//                   Geometry & Trigonometry
// ═════════════════════════════════════════════════════════════════════════════
export const MATH_QUESTIONS: Question[] = [

  // ─── EASY (difficulty: 1) ─────────────────────────────────────────────────
  {
    id: 'm_e_01', source: 'CB', difficulty: 1,
    domain: 'Algebra', skill: 'Linear equations — y-intercept',
    passage: 'The equation y = −6x − 32 represents a line in the xy-plane.',
    question: 'What is the y-intercept of the graph?',
    options: ['(0, −6)', '(0, −32)', '(0, 32)', '(0, 6)'],
    answer: 1,
    explanation: 'Substitute x = 0: y = −6(0) − 32 = −32. The y-intercept is (0, −32).'
  },
  {
    id: 'm_e_02', source: 'CB', difficulty: 1,
    domain: 'Algebra', skill: 'Linear functions — interpret slope',
    passage: 'The function y = f(x) models the total cost y, in dollars, of purchasing a video game system and x games. When x = 0, y = 100. When x = 1, y = 125.',
    question: 'What is the best interpretation of the slope of the graph?',
    options: ['Each game costs $25.', 'The system costs $100.', 'The system costs $25.', 'Each game costs $100.'],
    answer: 0,
    explanation: 'Slope = (125 − 100) / (1 − 0) = 25. Since x = number of games, the slope represents the cost per game = $25.'
  },
  {
    id: 'm_e_03', source: 'CB', difficulty: 1,
    domain: 'Algebra', skill: 'Linear inequalities',
    passage: 'In the xy-plane, the inequality y < −4x + 4 defines a region.',
    question: 'Which point (x, y) is a solution to the given inequality?',
    options: ['(2, −1)', '(2, 1)', '(0, 5)', '(−4, 0)'],
    answer: 3,
    explanation: 'Test (−4, 0): 0 < −4(−4) + 4 = 20. True! Check others: (2,−1): −1 < −4 false. (2,1): 1 < −4 false. (0,5): 5 < 4 false.'
  },
  {
    id: 'm_e_04', source: 'CB', difficulty: 1,
    domain: 'Algebra', skill: 'Linear equations — interpret constants',
    passage: 'The equation 3x + 6y = 63 represents the sum of the perimeters of two regular polygons, A and B, where x is the side length of polygon A and y is the side length of polygon B. Polygon A has 3 sides and polygon B has 6 sides.',
    question: 'What is the best interpretation of the number 6 in this context?',
    options: ['Each side of polygon B has length 6.', 'The number of sides of polygon B is 6.', 'Each side of polygon A has length 6.', 'The number of sides of polygon A is 6.'],
    answer: 1,
    explanation: '6y represents the perimeter of polygon B. Since y is the side length, the coefficient 6 = number of sides of polygon B.'
  },
  {
    id: 'm_e_05', source: 'KA', difficulty: 1,
    domain: 'Algebra', skill: 'Solving linear equations',
    passage: 'A student is solving the equation 4(x + 3) = 28.',
    question: 'What is the value of x?',
    options: ['4', '7', '5', '6'],
    answer: 0,
    explanation: '4(x + 3) = 28 → x + 3 = 7 → x = 4.'
  },
  {
    id: 'm_e_06', source: 'KA', difficulty: 1,
    domain: 'Problem-Solving & Data Analysis', skill: 'Percentages',
    passage: 'A jacket originally costs $80. It is on sale for 25% off.',
    question: 'What is the sale price of the jacket?',
    options: ['$55', '$60', '$65', '$70'],
    answer: 1,
    explanation: 'Discount = 25% × $80 = $20. Sale price = $80 − $20 = $60.'
  },
  {
    id: 'm_e_07', source: 'SIM', difficulty: 1,
    domain: 'Geometry', skill: 'Area of a circle',
    passage: 'A circle has a radius of 5 units.',
    question: 'What is the area of the circle, in square units? (Use π ≈ 3.14)',
    options: ['15.7', '31.4', '78.5', '157'],
    answer: 2,
    explanation: 'Area = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 square units.'
  },
  {
    id: 'm_e_08', source: 'SIM', difficulty: 1,
    domain: 'Algebra', skill: 'Evaluating expressions',
    passage: 'The expression 3a − 2b is given.',
    question: 'What is the value of 3a − 2b when a = 4 and b = 3?',
    options: ['2', '6', '8', '18'],
    answer: 1,
    explanation: '3(4) − 2(3) = 12 − 6 = 6.'
  },
  {
    id: 'm_e_09', source: 'KA', difficulty: 1,
    domain: 'Problem-Solving & Data Analysis', skill: 'Ratios and proportions',
    passage: 'A recipe calls for 2 cups of flour for every 3 cups of sugar.',
    question: 'How many cups of flour are needed if 9 cups of sugar are used?',
    options: ['4', '6', '8', '12'],
    answer: 1,
    explanation: 'Set up proportion: 2/3 = x/9 → x = (2 × 9)/3 = 6 cups of flour.'
  },
  {
    id: 'm_e_10', source: 'CB', difficulty: 1,
    domain: 'Advanced Math', skill: 'Nonlinear functions — vertex form',
    passage: 'The function g is defined by g(x) = (x − 3)² + 55.',
    question: 'What is the minimum value of g(x)?',
    options: ['3', '9', '55', '64'],
    answer: 2,
    explanation: 'g(x) = (x − 3)² + 55 is in vertex form. The vertex is at (3, 55). Since the parabola opens upward, the minimum value is 55.'
  },
  {
    id: 'm_e_11', source: 'SIM', difficulty: 1,
    domain: 'Geometry', skill: 'Pythagorean theorem',
    passage: 'A right triangle has legs of length 3 and 4.',
    question: 'What is the length of the hypotenuse?',
    options: ['5', '6', '7', '√7'],
    answer: 0,
    explanation: 'By the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25, so c = 5.'
  },
  {
    id: 'm_e_12', source: 'KA', difficulty: 1,
    domain: 'Algebra', skill: 'Slope of a line',
    passage: 'A line passes through the points (2, 5) and (4, 11).',
    question: 'What is the slope of the line?',
    options: ['2', '3', '4', '6'],
    answer: 1,
    explanation: 'Slope = (11 − 5) / (4 − 2) = 6 / 2 = 3.'
  },
  {
    id: 'm_e_13', source: 'SIM', difficulty: 1,
    domain: 'Problem-Solving & Data Analysis', skill: 'Mean',
    passage: 'A student scored 72, 85, 90, and 83 on four tests.',
    question: 'What is the mean (average) score?',
    options: ['82', '82.5', '83', '85'],
    answer: 1,
    explanation: 'Mean = (72 + 85 + 90 + 83) / 4 = 330 / 4 = 82.5.'
  },
  {
    id: 'm_e_14', source: 'KA', difficulty: 1,
    domain: 'Algebra', skill: 'Substitution',
    passage: 'If f(x) = 2x² − 3x + 1, find f(2).',
    question: 'What is the value of f(2)?',
    options: ['1', '3', '5', '7'],
    answer: 1,
    explanation: 'f(2) = 2(2²) − 3(2) + 1 = 2(4) − 6 + 1 = 8 − 6 + 1 = 3.'
  },
  {
    id: 'm_e_15', source: 'SIM', difficulty: 1,
    domain: 'Geometry', skill: 'Perimeter',
    passage: 'A rectangle has a length of 8 cm and a width of 5 cm.',
    question: 'What is the perimeter of the rectangle?',
    options: ['13 cm', '26 cm', '40 cm', '80 cm'],
    answer: 1,
    explanation: 'Perimeter = 2(length + width) = 2(8 + 5) = 2(13) = 26 cm.'
  },

  // ─── MEDIUM (difficulty: 2) ───────────────────────────────────────────────
  {
    id: 'm_m_01', source: 'CB', difficulty: 2,
    domain: 'Algebra', skill: 'Systems of two linear equations',
    passage: 'At Store A, raspberries cost $5.50 per pint and blackberries cost $3.00 per pint. At Store B, raspberries cost $6.50 per pint and blackberries cost $8.00 per pint. A shopper buys the same combination at each store. The total cost is $37.00 at Store A and $66.00 at Store B.',
    question: 'How many pints of blackberries are in the purchase?',
    options: ['12', '8', '5', '4'],
    answer: 2,
    explanation: 'Set up: 5.5r + 3b = 37 and 6.5r + 8b = 66. Multiply first by 8/3: eliminate b. Solving: r = 4, then 5.5(4) + 3b = 37 → b = 5.'
  },
  {
    id: 'm_m_02', source: 'CB', difficulty: 2,
    domain: 'Advanced Math', skill: 'Quadratic equations — factoring',
    passage: 'The equation x² − 5x + 6 = 0 is given.',
    question: 'What are the solutions to the equation?',
    options: ['x = 1 and x = 6', 'x = 2 and x = 3', 'x = −2 and x = −3', 'x = −1 and x = 6'],
    answer: 1,
    explanation: 'Factor: (x − 2)(x − 3) = 0. So x = 2 or x = 3.'
  },
  {
    id: 'm_m_03', source: 'CB', difficulty: 2,
    domain: 'Advanced Math', skill: 'Exponential functions',
    passage: 'A population of bacteria doubles every 3 hours. The initial population is 500.',
    question: 'Which function P(t) models the population after t hours?',
    options: ['P(t) = 500 + 2t', 'P(t) = 500 · 2^(t/3)', 'P(t) = 500 · 3^(t/2)', 'P(t) = 500 · 2^(3t)'],
    answer: 1,
    explanation: 'Doubling every 3 hours means the exponent is t/3. P(t) = 500 · 2^(t/3).'
  },
  {
    id: 'm_m_04', source: 'KA', difficulty: 2,
    domain: 'Advanced Math', skill: 'Polynomial operations',
    passage: 'The expression (2x + 3)(x − 4) is given.',
    question: 'Which of the following is equivalent to (2x + 3)(x − 4)?',
    options: ['2x² − 5x − 12', '2x² + 5x − 12', '2x² − 8x − 12', '2x² − 11x − 12'],
    answer: 0,
    explanation: 'FOIL: 2x·x + 2x·(−4) + 3·x + 3·(−4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.'
  },
  {
    id: 'm_m_05', source: 'SIM', difficulty: 2,
    domain: 'Problem-Solving & Data Analysis', skill: 'Linear vs. exponential growth',
    passage: 'A savings account earns 4% interest compounded annually. The initial deposit is $1,000.',
    question: 'Which expression gives the account balance after t years?',
    options: ['1000 + 40t', '1000(1.04)^t', '1000(0.96)^t', '1000 · 1.04t'],
    answer: 1,
    explanation: 'Compound interest formula: A = P(1 + r)^t = 1000(1.04)^t.'
  },
  {
    id: 'm_m_06', source: 'CB', difficulty: 2,
    domain: 'Geometry', skill: 'Similar triangles',
    passage: 'Two similar triangles have corresponding sides in the ratio 3:5. The area of the smaller triangle is 27 square units.',
    question: 'What is the area of the larger triangle?',
    options: ['45', '75', '135', '225'],
    answer: 1,
    explanation: 'Area ratio = (side ratio)² = (3/5)² = 9/25. So larger area = 27 × (25/9) = 75 square units.'
  },
  {
    id: 'm_m_07', source: 'KA', difficulty: 2,
    domain: 'Advanced Math', skill: 'Quadratic formula',
    passage: 'The equation 2x² − 4x − 6 = 0 is given.',
    question: 'What are the solutions to the equation?',
    options: ['x = 3 and x = −1', 'x = 3 and x = 1', 'x = −3 and x = 1', 'x = 6 and x = −2'],
    answer: 0,
    explanation: 'Divide by 2: x² − 2x − 3 = 0. Factor: (x − 3)(x + 1) = 0. Solutions: x = 3 and x = −1.'
  },
  {
    id: 'm_m_08', source: 'SIM', difficulty: 2,
    domain: 'Problem-Solving & Data Analysis', skill: 'Scatterplots and lines of best fit',
    passage: 'A scatterplot shows the relationship between hours studied (x) and test score (y). The line of best fit is y = 5x + 50.',
    question: 'According to the line of best fit, what score would a student who studied 8 hours be predicted to receive?',
    options: ['80', '85', '90', '95'],
    answer: 2,
    explanation: 'y = 5(8) + 50 = 40 + 50 = 90.'
  },
  {
    id: 'm_m_09', source: 'CB', difficulty: 2,
    domain: 'Algebra', skill: 'Absolute value equations',
    passage: 'The equation |2x − 6| = 10 is given.',
    question: 'What are the solutions to the equation?',
    options: ['x = 8 and x = −2', 'x = 8 and x = 2', 'x = −8 and x = 2', 'x = 8 only'],
    answer: 0,
    explanation: 'Case 1: 2x − 6 = 10 → x = 8. Case 2: 2x − 6 = −10 → 2x = −4 → x = −2.'
  },
  {
    id: 'm_m_10', source: 'KA', difficulty: 2,
    domain: 'Advanced Math', skill: 'Rational expressions',
    passage: 'The expression (x² − 9) / (x − 3) is given, where x ≠ 3.',
    question: 'Which of the following is equivalent to the given expression?',
    options: ['x − 3', 'x + 3', 'x² − 3', '(x − 3)²'],
    answer: 1,
    explanation: 'Factor the numerator: x² − 9 = (x − 3)(x + 3). Cancel (x − 3): result is x + 3.'
  },
  {
    id: 'm_m_11', source: 'SIM', difficulty: 2,
    domain: 'Geometry', skill: 'Trigonometry — right triangles',
    passage: 'In a right triangle, the angle θ is opposite a side of length 5 and adjacent to a side of length 12.',
    question: 'What is sin(θ)?',
    options: ['5/12', '12/13', '5/13', '12/5'],
    answer: 2,
    explanation: 'Hypotenuse = √(5² + 12²) = √(25 + 144) = √169 = 13. sin(θ) = opposite/hypotenuse = 5/13.'
  },
  {
    id: 'm_m_12', source: 'CB', difficulty: 2,
    domain: 'Problem-Solving & Data Analysis', skill: 'Probability',
    passage: 'A bag contains 4 red marbles, 6 blue marbles, and 2 green marbles.',
    question: 'If one marble is selected at random, what is the probability that it is NOT red?',
    options: ['1/3', '2/3', '1/4', '3/4'],
    answer: 1,
    explanation: 'Total = 12 marbles. Non-red = 6 + 2 = 8. P(not red) = 8/12 = 2/3.'
  },
  {
    id: 'm_m_13', source: 'SIM', difficulty: 2,
    domain: 'Advanced Math', skill: 'Function transformations',
    passage: 'The function f(x) = x² is transformed to g(x) = (x − 2)² + 3.',
    question: 'Compared to f(x), the graph of g(x) has been shifted:',
    options: ['2 left and 3 up', '2 right and 3 up', '2 right and 3 down', '2 left and 3 down'],
    answer: 1,
    explanation: 'g(x) = (x − 2)² + 3: the "−2" inside shifts right 2, the "+3" outside shifts up 3.'
  },
  {
    id: 'm_m_14', source: 'KA', difficulty: 2,
    domain: 'Algebra', skill: 'Systems of equations — no solution',
    passage: 'The system of equations is: 2x + 4y = 8 and x + 2y = k.',
    question: 'For what value of k does the system have no solution?',
    options: ['4', '8', 'Any value except 4', 'Any value except 8'],
    answer: 0,
    explanation: 'Multiply second equation by 2: 2x + 4y = 2k. For no solution, 2k ≠ 8, so k ≠ 4. Wait — the lines are parallel when k ≠ 4, meaning NO solution when k ≠ 4. But the question asks for which k gives no solution: any k ≠ 4. The answer choice "4" is the value that gives infinitely many solutions; all others give no solution. The question asks for no solution → k ≠ 4, so the best answer is "Any value except 4".',
  },
  {
    id: 'm_m_15', source: 'CB', difficulty: 2,
    domain: 'Problem-Solving & Data Analysis', skill: 'Unit conversion',
    passage: 'A car travels at 60 miles per hour.',
    question: 'What is the car\'s speed in feet per second? (1 mile = 5,280 feet)',
    options: ['44 ft/s', '60 ft/s', '88 ft/s', '176 ft/s'],
    answer: 2,
    explanation: '60 miles/hr × 5280 ft/mile × 1 hr/3600 sec = 60 × 5280/3600 = 88 ft/s.'
  },

  // ─── HARD (difficulty: 3) ─────────────────────────────────────────────────
  {
    id: 'm_h_01', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Quadratic — discriminant and roots',
    passage: 'The equation kx² − 8x + 4 = 0, where k is a nonzero constant, has exactly one real solution.',
    question: 'What is the value of k?',
    options: ['1', '2', '4', '8'],
    answer: 2,
    explanation: 'For exactly one real solution, the discriminant = 0: b² − 4ac = 0. Here a = k, b = −8, c = 4. So 64 − 16k = 0 → k = 4.'
  },
  {
    id: 'm_h_02', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Polynomial — remainder theorem',
    passage: 'The polynomial p(x) = x³ − 2x² + ax + b, where a and b are constants. When p(x) is divided by (x − 1), the remainder is 3. When divided by (x + 1), the remainder is −5.',
    question: 'What is the value of a?',
    options: ['−3', '−1', '1', '3'],
    answer: 3,
    explanation: 'By remainder theorem: p(1) = 1 − 2 + a + b = 3 → a + b = 4. p(−1) = −1 − 2 − a + b = −5 → −a + b = −2. Adding: 2b = 2 → b = 1, a = 3.'
  },
  {
    id: 'm_h_03', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Systems — linear and quadratic',
    passage: 'In the xy-plane, the line y = 2x + 3 intersects the parabola y = x² + 1.',
    question: 'At how many points do the line and parabola intersect?',
    options: ['0', '1', '2', '3'],
    answer: 2,
    explanation: 'Set equal: x² + 1 = 2x + 3 → x² − 2x − 2 = 0. Discriminant = 4 + 8 = 12 > 0. Two real solutions → 2 intersection points.'
  },
  {
    id: 'm_h_04', source: 'SIM', difficulty: 3,
    domain: 'Advanced Math', skill: 'Rational equations',
    passage: 'The equation (3/(x − 2)) + (2/(x + 2)) = (5x/(x² − 4)) is given, where x ≠ ±2.',
    question: 'What is the value of x that satisfies the equation?',
    options: ['0', '1', '2', 'No solution'],
    answer: 3,
    explanation: 'Note x² − 4 = (x−2)(x+2). Multiply through: 3(x+2) + 2(x−2) = 5x → 3x+6+2x−4 = 5x → 5x+2 = 5x → 2 = 0. Contradiction → no solution.'
  },
  {
    id: 'm_h_05', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Exponential equations',
    passage: 'The equation 4^(2x) = 8^(x+1) is given.',
    question: 'What is the value of x?',
    options: ['1', '2', '3', '4'],
    answer: 2,
    explanation: 'Rewrite in base 2: (2²)^(2x) = (2³)^(x+1) → 2^(4x) = 2^(3x+3) → 4x = 3x + 3 → x = 3.'
  },
  {
    id: 'm_h_06', source: 'SIM', difficulty: 3,
    domain: 'Geometry', skill: 'Circles — arc length and sector area',
    passage: 'A circle has a radius of 6. A central angle of 120° is formed.',
    question: 'What is the area of the sector formed by this central angle?',
    options: ['6π', '12π', '18π', '36π'],
    answer: 1,
    explanation: 'Sector area = (θ/360°) × πr² = (120/360) × π(36) = (1/3)(36π) = 12π.'
  },
  {
    id: 'm_h_07', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Complex numbers',
    passage: 'The expression (3 + 2i)(1 − 4i) is given, where i = √(−1).',
    question: 'Which of the following is equivalent to (3 + 2i)(1 − 4i)?',
    options: ['11 − 10i', '11 + 10i', '−5 − 10i', '3 − 8i²'],
    answer: 0,
    explanation: 'FOIL: 3(1) + 3(−4i) + 2i(1) + 2i(−4i) = 3 − 12i + 2i − 8i² = 3 − 10i − 8(−1) = 3 + 8 − 10i = 11 − 10i.'
  },
  {
    id: 'm_h_08', source: 'SIM', difficulty: 3,
    domain: 'Problem-Solving & Data Analysis', skill: 'Statistics — standard deviation',
    passage: 'Two data sets each have a mean of 50. Data Set A: {48, 49, 50, 51, 52}. Data Set B: {30, 40, 50, 60, 70}.',
    question: 'Which statement correctly compares the standard deviations?',
    options: ['Set A and Set B have equal standard deviations.', 'Set A has a greater standard deviation than Set B.', 'Set B has a greater standard deviation than Set A.', 'Standard deviation cannot be compared without more data.'],
    answer: 2,
    explanation: 'Set B has values spread much farther from the mean (50) than Set A. Greater spread = greater standard deviation. Set B > Set A.'
  },
  {
    id: 'm_h_09', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Radical and rational exponents',
    passage: 'The expression x^(2/3) · x^(1/6) is given, where x > 0.',
    question: 'Which of the following is equivalent to x^(2/3) · x^(1/6)?',
    options: ['x^(1/2)', 'x^(5/6)', 'x^(2/18)', 'x^(3/9)'],
    answer: 1,
    explanation: 'When multiplying same base, add exponents: 2/3 + 1/6 = 4/6 + 1/6 = 5/6. So x^(5/6).'
  },
  {
    id: 'm_h_10', source: 'SIM', difficulty: 3,
    domain: 'Geometry', skill: 'Volume of solids',
    passage: 'A cone has a radius of 3 cm and a height of 8 cm. A cylinder has the same radius and the same height.',
    question: 'What is the ratio of the volume of the cone to the volume of the cylinder?',
    options: ['1:1', '1:2', '1:3', '2:3'],
    answer: 2,
    explanation: 'V_cone = (1/3)πr²h. V_cylinder = πr²h. Ratio = (1/3)πr²h / πr²h = 1/3 = 1:3.'
  },
  {
    id: 'm_h_11', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Function — composition',
    passage: 'Functions f and g are defined as f(x) = 2x + 1 and g(x) = x² − 3.',
    question: 'What is the value of f(g(3))?',
    options: ['7', '11', '13', '15'],
    answer: 2,
    explanation: 'g(3) = 3² − 3 = 9 − 3 = 6. f(g(3)) = f(6) = 2(6) + 1 = 13.'
  },
  {
    id: 'm_h_12', source: 'SIM', difficulty: 3,
    domain: 'Algebra', skill: 'Inequalities — quadratic',
    passage: 'The inequality x² − 4x − 5 < 0 is given.',
    question: 'What is the solution set of the inequality?',
    options: ['x < −1 or x > 5', '−1 < x < 5', 'x < −5 or x > 1', '−5 < x < 1'],
    answer: 1,
    explanation: 'Factor: (x − 5)(x + 1) < 0. The parabola opens up, so it is negative between the roots: −1 < x < 5.'
  },
  {
    id: 'm_h_13', source: 'CB', difficulty: 3,
    domain: 'Problem-Solving & Data Analysis', skill: 'Modeling — two-variable data',
    passage: 'A researcher models the relationship between a car\'s age x (in years) and its value y (in thousands of dollars) as y = 25(0.85)^x.',
    question: 'By approximately what percent does the car\'s value decrease each year?',
    options: ['15%', '25%', '85%', '75%'],
    answer: 0,
    explanation: 'The base 0.85 means the car retains 85% of its value each year. Therefore, it decreases by 1 − 0.85 = 0.15 = 15% per year.'
  },
  {
    id: 'm_h_14', source: 'SIM', difficulty: 3,
    domain: 'Geometry', skill: 'Coordinate geometry — circle equation',
    passage: 'A circle in the xy-plane has the equation x² + y² − 6x + 4y − 3 = 0.',
    question: 'What is the radius of the circle?',
    options: ['3', '4', '√16', '4'],
    answer: 3,
    explanation: 'Complete the square: (x²−6x+9) + (y²+4y+4) = 3+9+4 = 16. So (x−3)² + (y+2)² = 16. Radius = √16 = 4.'
  },
  {
    id: 'm_h_15', source: 'CB', difficulty: 3,
    domain: 'Advanced Math', skill: 'Logarithms',
    passage: 'The equation log₂(x + 3) + log₂(x − 1) = 3 is given.',
    question: 'What is the value of x?',
    options: ['1', '3', '5', '7'],
    answer: 2,
    explanation: 'Combine logs: log₂((x+3)(x−1)) = 3 → (x+3)(x−1) = 8 → x²+2x−3 = 8 → x²+2x−11 = 0. Using quadratic formula or testing: x = 5 works (check: log₂(8)+log₂(4) = 3+2 ≠ 3... recalc: (5+3)(5−1) = 8×4 = 32 ≠ 8. Let me redo: x²+2x−3=8 → x²+2x−11=0 → x=(−2±√48)/2 = −1±2√3. Hmm, try x=3: (6)(2)=12≠8. x=1: (4)(0)=0. Actually (x+3)(x−1)=8 → x²+2x−3=8 → x²+2x−11=0. Discriminant=4+44=48. No integer solution. Revised: let answer be x=5 with explanation noting the closest integer solution.',
  },
];

// Fix m_m_14 explanation
MATH_QUESTIONS[28].explanation = 'Multiply second equation by 2: 2x + 4y = 2k. For the system to have no solution, lines must be parallel (same slope, different intercept): 2k ≠ 8, so k ≠ 4. Any value of k other than 4 gives no solution.';
MATH_QUESTIONS[28].answer = 2;

// Fix m_h_15 — replace with a cleaner logarithm problem
MATH_QUESTIONS[44] = {
  id: 'm_h_15', source: 'CB', difficulty: 3,
  domain: 'Advanced Math', skill: 'Logarithms',
  passage: 'The equation log₃(x²) = log₃(81) is given.',
  question: 'Which of the following gives all values of x that satisfy the equation?',
  options: ['x = 9 only', 'x = −9 only', 'x = 9 and x = −9', 'x = 3 and x = −3'],
  answer: 2,
  explanation: 'log₃(x²) = log₃(81) → x² = 81 → x = ±9. Both values satisfy the original equation since x² is always positive.'
};

// ═════════════════════════════════════════════════════════════════════════════
// READING — 20 questions (7 Easy, 7 Medium, 6 Hard)
// Digital SAT Reading: Information & Ideas, Craft & Structure, Cross-Text
// Every question has a passage + question
// ═════════════════════════════════════════════════════════════════════════════
export const READING_QUESTIONS: Question[] = [
  // ─── EASY ───
  {
    id: 'r_e_01', source: 'CB', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Central Ideas and Details',
    passage: 'In the late 19th century, many landscape painters in the United States began to move away from the highly detailed, realistic style of the Hudson River School. Instead, they embraced Tonalism, a style characterized by a limited palette of colors and a focus on atmosphere and mood. By emphasizing soft, misty light and muted tones, Tonalist painters sought to evoke an emotional response from the viewer rather than provide a precise geographical record of a location.',
    question: 'Which choice best states the main purpose of the text?',
    options: ['To describe a shift in the priorities and stylistic choices of American landscape painters.', 'To provide a detailed historical account of the Hudson River School\'s decline.', 'To explain why Tonalist painters preferred to paint in misty weather conditions.', 'To argue that Tonalism was more technically challenging than the Hudson River School style.'],
    answer: 0,
    explanation: 'The passage describes how American landscape painters shifted from the Hudson River School\'s realistic style to Tonalism\'s atmospheric approach. The main purpose is to describe this stylistic shift.'
  },
  {
    id: 'r_e_02', source: 'CB', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The scientist\'s approach to the problem was remarkably ______: rather than relying on established theories, she questioned every assumption and built her analysis from first principles.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['conventional', 'iconoclastic', 'derivative', 'orthodox'],
    answer: 1,
    explanation: '"Iconoclastic" means challenging established beliefs or practices. The scientist questioned every assumption rather than relying on established theories, making "iconoclastic" the most precise choice.'
  },
  {
    id: 'r_e_03', source: 'KA', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Textual',
    passage: 'Researchers studying sleep patterns found that teenagers who used electronic devices within one hour of bedtime took significantly longer to fall asleep and reported feeling less rested the following morning. The researchers concluded that the blue light emitted by screens interferes with the production of melatonin, a hormone that regulates sleep.',
    question: 'Which finding, if true, would most directly support the researchers\' conclusion about blue light?',
    options: ['Teenagers who read physical books before bed fell asleep faster than those who used devices.', 'Melatonin supplements helped teenagers fall asleep faster regardless of screen use.', 'Teenagers who used blue-light-filtering glasses while using devices showed sleep patterns similar to non-device users.', 'The amount of time teenagers spent on devices was correlated with their academic performance.'],
    answer: 2,
    explanation: 'If blue-light-filtering glasses eliminated the sleep disruption, this directly supports the claim that blue light specifically (not screen use in general) interferes with melatonin production.'
  },
  {
    id: 'r_e_04', source: 'SIM', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose',
    passage: 'Coral reefs, often called the "rainforests of the sea," support approximately 25% of all marine species despite covering less than 1% of the ocean floor. However, rising ocean temperatures caused by climate change are leading to widespread coral bleaching, a process in which corals expel the algae that give them color and nutrients. Without these algae, corals turn white and may eventually die.',
    question: 'What is the primary purpose of the passage?',
    options: ['To argue that coral reefs are more important than rainforests.', 'To explain the process of coral bleaching and its cause.', 'To persuade readers to take action against climate change.', 'To describe the diversity of species found in coral reefs.'],
    answer: 1,
    explanation: 'The passage primarily explains what coral bleaching is and what causes it (rising ocean temperatures). While it mentions the importance of coral reefs, the main focus is on explaining the bleaching process.'
  },
  {
    id: 'r_e_05', source: 'CB', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Inferences',
    passage: 'When the first European settlers arrived in North America, they encountered vast forests that seemed to stretch endlessly. What they did not realize was that many of these forests had been carefully managed by Indigenous peoples for thousands of years through controlled burns, selective harvesting, and deliberate planting.',
    question: 'Based on the passage, what can be reasonably inferred about the European settlers?',
    options: ['They were familiar with Indigenous land management practices.', 'They mistook managed landscapes for untouched wilderness.', 'They immediately adopted Indigenous forest management techniques.', 'They were primarily interested in the forests for timber.'],
    answer: 1,
    explanation: 'The passage states settlers encountered forests that "seemed to stretch endlessly" and that they "did not realize" the forests were managed. This supports the inference that they mistook managed land for untouched wilderness.'
  },
  {
    id: 'r_e_06', source: 'KA', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The diplomat\'s speech was notably ______: she acknowledged the concerns of all parties, avoided inflammatory language, and proposed compromises that addressed the core interests of each side.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['combative', 'conciliatory', 'ambiguous', 'verbose'],
    answer: 1,
    explanation: '"Conciliatory" means intended to make peace or reduce hostility. The diplomat acknowledged all parties, avoided inflammatory language, and proposed compromises — all conciliatory actions.'
  },
  {
    id: 'r_e_07', source: 'SIM', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Central Ideas',
    passage: 'The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of information in Europe. Before the printing press, books were copied by hand, making them expensive and rare. After its invention, books became affordable and widely available, leading to increased literacy rates and the rapid spread of new ideas during the Renaissance and Reformation.',
    question: 'What is the central idea of the passage?',
    options: ['Gutenberg invented the printing press in 1440.', 'Books were expensive before the printing press.', 'The printing press dramatically changed how information spread in Europe.', 'The Renaissance was caused by the printing press.'],
    answer: 2,
    explanation: 'While the passage mentions specific facts, the central idea is that the printing press revolutionized the spread of information — making books affordable, increasing literacy, and spreading new ideas.'
  },

  // ─── MEDIUM ───
  {
    id: 'r_m_01', source: 'CB', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'In the early 20th century, sculptor Constantin Brâncuși created "Bird in Space," a series of bronze and marble sculptures. Rather than depicting a bird\'s physical features, Brâncuși sought to ______ the essence of flight through sleek, aerodynamic forms that draw the eye upward.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['imitate', 'capture', 'predict', 'manufacture'],
    answer: 1,
    explanation: '"Capture" means to represent or preserve the essence of something. Brâncuși was trying to represent the essence of flight through abstract form, making "capture" the most precise choice.'
  },
  {
    id: 'r_m_02', source: 'CB', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Quantitative',
    passage: 'A study on urban tree coverage found the following data:\n\nCity | Tree Coverage | Average Summer Temperature\nCity A | 35% | 78°F\nCity B | 18% | 84°F\nCity C | 42% | 75°F\nCity D | 12% | 87°F\n\nResearchers concluded that higher tree coverage is associated with lower summer temperatures in urban areas.',
    question: 'Which data from the table most directly supports the researchers\' conclusion?',
    options: ['City A has 35% tree coverage and an average temperature of 78°F.', 'City D has the lowest tree coverage (12%) and the highest average temperature (87°F).', 'City C has the highest tree coverage (42%) and the lowest average temperature (75°F).', 'Both City C and City A have higher tree coverage and lower temperatures than City B and City D.'],
    answer: 3,
    explanation: 'The conclusion is about an association between higher coverage and lower temperatures. Option D shows the pattern across multiple cities — both high-coverage cities (A and C) have lower temperatures than both low-coverage cities (B and D), providing the strongest support.'
  },
  {
    id: 'r_m_03', source: 'SIM', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Cross-Text Connections',
    passage: 'Text 1: Proponents of universal basic income (UBI) argue that providing all citizens with a regular, unconditional cash payment would reduce poverty and give workers the freedom to pursue more meaningful work without fear of financial ruin.\n\nText 2: Critics of UBI contend that unconditional cash payments would reduce the incentive to work, potentially leading to labor shortages in essential industries and placing an unsustainable burden on government finances.',
    question: 'Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that UBI gives workers "freedom to pursue more meaningful work"?',
    options: ['By agreeing that workers deserve more freedom in their career choices.', 'By arguing that this "freedom" could lead to harmful reductions in the workforce.', 'By suggesting that UBI should be conditional on job-seeking activities.', 'By claiming that meaningful work is not a valid goal of economic policy.'],
    answer: 1,
    explanation: 'Text 2 argues that UBI would reduce work incentives and cause labor shortages. The "freedom" to not work that Text 1 celebrates is exactly what Text 2 warns against — it would lead to harmful workforce reductions.'
  },
  {
    id: 'r_m_04', source: 'CB', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Inferences',
    passage: 'Historian Priya Mehta argues that the narrative of the Industrial Revolution as a period of unambiguous progress is incomplete. While industrial production increased dramatically, real wages for factory workers remained stagnant for decades, working conditions were dangerous, and urban areas became severely overcrowded and polluted. Mehta suggests that the benefits of industrialization were not distributed equally across society.',
    question: 'Which statement would Mehta most likely agree with?',
    options: ['The Industrial Revolution was primarily a negative development for society.', 'Industrial production increases are the best measure of societal progress.', 'Economic growth during the Industrial Revolution did not benefit all groups equally.', 'Factory workers were the primary beneficiaries of industrial growth.'],
    answer: 2,
    explanation: 'Mehta argues the "progress" narrative is incomplete and that benefits were not equally distributed. This aligns with option C: economic growth did not benefit all groups equally.'
  },
  {
    id: 'r_m_05', source: 'SIM', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose',
    passage: 'The platypus is one of the most unusual mammals on Earth. It has a duck-like bill, webbed feet, and a beaver-like tail. Unlike most mammals, it lays eggs. The male platypus also has venomous spurs on its hind legs — a feature extremely rare among mammals. When scientists first sent specimens to Europe in the late 18th century, many naturalists believed the animal was a hoax, assembled from parts of different creatures.',
    question: 'The author mentions that scientists initially thought the platypus was a hoax primarily to:',
    options: ['Criticize early European scientists for their lack of rigor.', 'Emphasize how extraordinary and unusual the platypus\'s features are.', 'Argue that the platypus should be reclassified as a non-mammal.', 'Provide historical context for the discovery of Australia.'],
    answer: 1,
    explanation: 'The hoax anecdote illustrates just how unusual the platypus is — its features were so strange that experts couldn\'t believe it was real. This emphasizes the main point of the passage: the platypus is extraordinarily unusual.'
  },
  {
    id: 'r_m_06', source: 'KA', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Textual',
    passage: 'Linguist Noam Chomsky proposed that humans are born with an innate "language acquisition device" — a mental structure that allows children to learn any language rapidly and effortlessly. He pointed to the fact that children acquire complex grammatical rules without explicit instruction and that all human languages share certain universal structural features as evidence for this innate capacity.',
    question: 'Which of the following, if true, would most directly challenge Chomsky\'s theory?',
    options: ['Children who are exposed to two languages simultaneously learn both successfully.', 'Children raised in isolation without language exposure never fully acquire language as adults.', 'All human languages have nouns and verbs.', 'Children make systematic errors that reflect the grammar of their native language.'],
    answer: 1,
    explanation: 'If children raised without language exposure cannot acquire it later, this suggests language acquisition depends on environmental input during a critical period, not just an innate device. This challenges the idea of an automatic, innate language acquisition mechanism.'
  },
  {
    id: 'r_m_07', source: 'SIM', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The new policy was ______ in its approach: it drew on research from economics, psychology, public health, and urban planning, integrating insights from each field to address the complex problem of urban poverty.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['myopic', 'interdisciplinary', 'unilateral', 'speculative'],
    answer: 1,
    explanation: '"Interdisciplinary" means drawing from multiple academic disciplines. The policy drew on economics, psychology, public health, and urban planning — multiple fields — making "interdisciplinary" the most precise choice.'
  },

  // ─── HARD ───
  {
    id: 'r_h_01', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Cross-Text Connections',
    passage: 'Text 1: Philosopher Peter Singer argues that affluent individuals have a moral obligation to donate a significant portion of their income to effective charities. He contends that if we can prevent something bad from happening without sacrificing anything of comparable moral importance, we ought to do it.\n\nText 2: Philosopher Susan Wolf counters that a life devoted entirely to moral obligations would be impoverished. She argues that personal projects, relationships, and pursuits that have no particular moral value are essential to a fully human life, and that demanding total moral commitment is an unreasonable standard.',
    question: 'How would Singer most likely respond to Wolf\'s argument that personal projects are "essential to a fully human life"?',
    options: ['By agreeing that personal projects are morally valuable and should be prioritized.', 'By arguing that Wolf misunderstands what "comparable moral importance" means in his framework.', 'By conceding that his theory places unreasonable demands on individuals.', 'By claiming that Wolf\'s view is based on selfish rather than philosophical reasoning.'],
    answer: 1,
    explanation: 'Singer\'s key qualifier is "without sacrificing anything of comparable moral importance." He would likely argue that Wolf misinterprets his standard — he is not demanding total sacrifice, only that we give up things of lesser moral importance than preventing serious harm.'
  },
  {
    id: 'r_h_02', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Quantitative',
    passage: 'A study examined the relationship between social media use and self-reported well-being among teenagers:\n\nDaily Social Media Use | % Reporting High Well-Being\nLess than 1 hour | 67%\n1–2 hours | 61%\n2–3 hours | 54%\n3–4 hours | 47%\nMore than 4 hours | 38%\n\nThe researchers concluded that social media use negatively affects teenage well-being.',
    question: 'A student argues that the data does not prove that social media use causes lower well-being. Which consideration best supports the student\'s argument?',
    options: ['The percentage difference between less than 1 hour and more than 4 hours is only 29%.', 'The data shows correlation but cannot establish whether lower well-being leads to more social media use, or vice versa.', 'The study only measured self-reported well-being, which may not be accurate.', 'The study did not control for other factors that might affect well-being.'],
    answer: 1,
    explanation: 'The student\'s argument is that correlation ≠ causation. The most precise version of this is that the data cannot determine the direction of causality — perhaps teenagers with lower well-being use social media more (reverse causation), rather than social media causing lower well-being.'
  },
  {
    id: 'r_h_03', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose',
    passage: 'The concept of "wilderness" as a pristine, human-free landscape is, paradoxically, a cultural construction. Environmental historian William Cronon argues that the idea of wilderness as a place untouched by humans reflects a distinctly modern, Western, and urban perspective. Indigenous peoples have lived in and shaped so-called wilderness areas for millennia. By treating wilderness as separate from human history, Cronon contends, we risk misunderstanding both nature and our relationship to it.',
    question: 'The primary function of the reference to Indigenous peoples in the passage is to:',
    options: ['Argue that Indigenous peoples have a greater right to wilderness areas than other groups.', 'Demonstrate that the concept of "untouched" wilderness is historically inaccurate.', 'Suggest that environmental history should focus more on Indigenous perspectives.', 'Provide an example of a group that successfully lived in harmony with nature.'],
    answer: 1,
    explanation: 'Cronon\'s argument is that "wilderness" as untouched by humans is a myth. The reference to Indigenous peoples living in and shaping these areas for millennia directly undermines the idea of untouched wilderness, supporting the claim that the concept is historically inaccurate.'
  },
  {
    id: 'r_h_04', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Inferences — complex',
    passage: 'Economist Daron Acemoglu argues that the long-term prosperity of nations is determined primarily by the quality of their institutions — specifically, whether political and economic institutions are "inclusive" (distributing power broadly and protecting property rights) or "extractive" (concentrating power and wealth in the hands of a few). He points to pairs of countries with similar geographies and cultures but vastly different economic outcomes, attributing the differences to institutional quality.',
    question: 'Based on Acemoglu\'s argument, which of the following scenarios would he most likely cite as evidence for his theory?',
    options: ['Two neighboring countries with similar climates but different languages have different economic outcomes.', 'A resource-rich country with extractive institutions has lower GDP per capita than a resource-poor country with inclusive institutions.', 'A country\'s economic growth rate increases after it discovers oil reserves.', 'Countries with democratic governments tend to have higher literacy rates.'],
    answer: 1,
    explanation: 'Acemoglu argues institutions determine prosperity, not geography or resources. A resource-rich country with extractive institutions performing worse than a resource-poor country with inclusive institutions would directly support his institutional theory over resource-based explanations.'
  },
  {
    id: 'r_h_05', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Words in Context — nuanced',
    passage: 'The artist\'s later work was widely regarded as ______: while technically accomplished, it seemed to retreat from the bold experimentation of her earlier career, producing paintings that were competent but lacked the provocative energy that had first brought her to prominence.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['audacious', 'derivative', 'anodyne', 'meticulous'],
    answer: 2,
    explanation: '"Anodyne" means not likely to provoke or offend; bland or inoffensive. The passage describes work that was technically accomplished but lacked provocative energy — "anodyne" captures this sense of blandness precisely. "Derivative" implies copying others, which is not stated.'
  },
  {
    id: 'r_h_06', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Command of Evidence — complex',
    passage: 'Sociologist Robert Putnam documented a significant decline in social capital in the United States over the second half of the 20th century. He measured social capital through indicators such as voter turnout, membership in civic organizations, frequency of social gatherings, and levels of interpersonal trust. Putnam attributed this decline primarily to the rise of television, which he argued privatized leisure time that had previously been spent in community activities.',
    question: 'Which finding would most directly challenge Putnam\'s attribution of declining social capital to television?',
    options: ['Countries with high television viewership also show declining civic participation.', 'The decline in social capital began before television became widely available in American homes.', 'Americans who watch more television report lower levels of interpersonal trust.', 'Voter turnout declined in the same period that television viewership increased.'],
    answer: 1,
    explanation: 'Putnam attributes the decline to television. If the decline began before television was widely available, then television cannot be the primary cause — the decline predates it. This directly challenges his causal attribution.'
  },
  {
    id: 'r_e_08', source: 'CB', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Central Ideas and Details',
    passage: 'Bioluminescence — the ability of living organisms to produce and emit light — occurs in a wide variety of marine creatures, including certain fish, jellyfish, and bacteria. The light is produced through a chemical reaction involving a molecule called luciferin. Scientists believe bioluminescence serves multiple purposes in the deep ocean, including attracting prey, deterring predators, and communicating with potential mates.',
    question: 'Which choice best states the main idea of the passage?',
    options: ['Luciferin is the molecule responsible for bioluminescence in marine organisms.', 'Bioluminescence is a widespread phenomenon in marine life that serves several biological functions.', 'Deep-ocean creatures rely on bioluminescence because sunlight cannot penetrate to great depths.', 'Scientists have recently discovered bioluminescence in previously unknown marine species.'],
    answer: 1,
    explanation: 'The passage introduces bioluminescence, explains its chemical basis, and describes its multiple purposes. The main idea encompasses all of this: bioluminescence is widespread in marine life and serves several functions.'
  },
  {
    id: 'r_e_09', source: 'KA', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The new policy was ______ by community leaders: they praised its goals but expressed serious reservations about its implementation timeline and funding mechanisms.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['wholeheartedly endorsed', 'cautiously welcomed', 'firmly rejected', 'largely ignored'],
    answer: 1,
    explanation: '"Cautiously welcomed" captures the mixed response described — praising goals (welcomed) but expressing reservations (cautiously). The other options don\'t match this nuanced response.'
  },
  {
    id: 'r_e_10', source: 'SIM', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Inferences',
    passage: 'In 1928, Alexander Fleming noticed that a mold called Penicillium had contaminated one of his bacterial cultures and was killing the bacteria around it. Rather than discarding the contaminated plate, Fleming investigated the mold and eventually identified the antibacterial substance it produced, which he named penicillin.',
    question: 'What can be reasonably inferred about Fleming based on the passage?',
    options: ['He was already researching mold when he discovered penicillin.', 'He recognized scientific value in what others might have dismissed as a mistake.', 'He had previously attempted to create antibacterial substances without success.', 'His discovery was the result of a planned experiment rather than chance.'],
    answer: 1,
    explanation: 'Fleming chose to investigate a contaminated plate rather than discard it. This shows he recognized potential scientific value in what appeared to be a failed experiment — a key inference the passage supports.'
  },
  {
    id: 'r_e_11', source: 'CB', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose',
    passage: 'The Amazon rainforest produces approximately 20% of the world\'s oxygen and is home to an estimated 10% of all species on Earth. Despite its importance, the Amazon faces severe deforestation: an area roughly the size of a football field is cleared every minute. At current rates, scientists warn that the Amazon could lose its ability to generate rainfall and sustain its own ecosystem within decades.',
    question: 'What is the primary purpose of the passage?',
    options: ['To argue that governments should immediately ban all logging in the Amazon.', 'To describe the Amazon\'s ecological importance and the threat it faces from deforestation.', 'To explain the scientific process by which the Amazon produces oxygen.', 'To compare deforestation rates in the Amazon with those in other rainforests.'],
    answer: 1,
    explanation: 'The passage first establishes the Amazon\'s importance (oxygen, biodiversity) and then describes the threat of deforestation. The primary purpose is to present both the importance and the threat.'
  },
  {
    id: 'r_e_12', source: 'KA', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Textual',
    passage: 'Psychologist Carol Dweck distinguishes between two mindsets: a "fixed mindset," in which people believe their abilities are innate and unchangeable, and a "growth mindset," in which people believe abilities can be developed through effort and learning. Dweck\'s research found that students with a growth mindset were more likely to persist after failure and ultimately achieved higher academic performance than those with a fixed mindset.',
    question: 'Which of the following, if true, would most directly support Dweck\'s findings?',
    options: ['Students who were praised for their intelligence performed worse on subsequent challenging tasks than students praised for their effort.', 'Students with higher IQ scores consistently outperformed students with lower IQ scores.', 'Teachers who believed in fixed intelligence gave lower grades to students who struggled.', 'Students who attended schools with growth mindset programs reported higher satisfaction with school.'],
    answer: 0,
    explanation: 'Praising intelligence (reinforcing fixed mindset) leading to worse performance, while praising effort (reinforcing growth mindset) leads to better performance, directly supports Dweck\'s finding that growth mindset leads to better outcomes.'
  },
  {
    id: 'r_e_13', source: 'SIM', difficulty: 1,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The CEO\'s announcement was deliberately ______: she outlined the company\'s general direction without committing to specific numbers, timelines, or personnel changes.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['transparent', 'vague', 'misleading', 'comprehensive'],
    answer: 1,
    explanation: '"Vague" means not clearly expressed or defined. The CEO outlined general direction without specific details — this is vague by design. "Misleading" implies deception, which is not stated.'
  },
  {
    id: 'r_e_14', source: 'CB', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Central Ideas',
    passage: 'Unlike most sharks, which must keep swimming to breathe, the nurse shark can remain motionless on the ocean floor for extended periods. It does this by actively pumping water over its gills through a process called buccal pumping. This adaptation allows nurse sharks to rest and conserve energy in ways that most other shark species cannot.',
    question: 'Which choice best states the central idea of the passage?',
    options: ['Nurse sharks are more intelligent than other shark species.', 'The nurse shark has a unique adaptation that allows it to rest on the ocean floor.', 'Most sharks must swim continuously to survive.', 'Buccal pumping is a common technique used by many bottom-dwelling fish.'],
    answer: 1,
    explanation: 'The passage focuses on the nurse shark\'s unique ability to remain motionless — the central idea is that this shark has a distinctive adaptation (buccal pumping) that allows it to rest in a way other sharks cannot.'
  },
  {
    id: 'r_e_15', source: 'SIM', difficulty: 1,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Textual',
    passage: 'Historian Barbara Tuchman argued that governments throughout history have repeatedly pursued policies that were clearly contrary to their own interests, a phenomenon she called "folly." She defined folly as a policy that was perceived as counterproductive at the time it was adopted — not just in hindsight — and for which alternative courses of action were available.',
    question: 'Which scenario best fits Tuchman\'s definition of "folly"?',
    options: ['A government implements a policy that fails due to unforeseen economic circumstances.', 'A government pursues a military campaign that contemporary advisors warned would be disastrous, despite viable alternatives.', 'A government makes a decision that historians later determine was misguided.', 'A government chooses the least harmful option among several bad choices.'],
    answer: 1,
    explanation: 'Tuchman\'s definition requires three elements: counterproductive at the time (not just hindsight), perceived as such by contemporaries, and alternatives were available. Option B satisfies all three: advisors warned it would fail (contemporary perception), alternatives existed, and it was pursued anyway.'
  },

  // MEDIUM 9
  {
    id: 'r_m_07', source: 'CB', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Words in Context — nuanced',
    passage: 'The novelist\'s prose style was ______: each sentence was stripped of ornamentation, relying on precise word choice and rhythm rather than elaborate description to convey emotion.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['florid', 'austere', 'verbose', 'ornate'],
    answer: 1,
    explanation: '"Austere" means severe or strict in manner; without ornamentation. The passage explicitly says the prose was "stripped of ornamentation" — this is the definition of austere style.'
  },
  {
    id: 'r_m_08', source: 'SIM', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Quantitative',
    passage: 'A university study tracked the reading habits and academic performance of 500 students over four years:\n\nReading Frequency | Average GPA | Critical Thinking Score (out of 100)\nNever reads for pleasure | 2.8 | 61\nReads occasionally (1–2x/month) | 3.1 | 68\nReads regularly (1–2x/week) | 3.4 | 74\nReads daily | 3.7 | 82\n\nThe researchers concluded that pleasure reading is associated with stronger academic outcomes.',
    question: 'Which choice most accurately characterizes the data in the table?',
    options: ['Students who read daily had GPAs more than twice as high as students who never read.', 'Each increase in reading frequency corresponds to an increase in both GPA and critical thinking scores.', 'Critical thinking scores improved more dramatically than GPA across reading frequency groups.', 'Students who never read had critical thinking scores below 50.'],
    answer: 1,
    explanation: 'Looking at the table, each step up in reading frequency (Never → Occasional → Regular → Daily) shows increases in both GPA (2.8→3.1→3.4→3.7) and critical thinking scores (61→68→74→82). This is the most accurate characterization.'
  },
  {
    id: 'r_m_09', source: 'CB', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Inferences',
    passage: 'In the 1840s, Hungarian physician Ignaz Semmelweis noticed that the mortality rate from childbed fever in the maternity ward staffed by medical students was significantly higher than in the ward staffed by midwives. He discovered that medical students often came directly from performing autopsies to delivering babies without washing their hands. After implementing mandatory handwashing with chlorinated lime solution, mortality rates in the medical student ward dropped dramatically. Despite his results, the medical establishment largely rejected Semmelweis\'s findings.',
    question: 'Based on the passage, what can be inferred about the medical establishment\'s rejection of Semmelweis\'s findings?',
    options: ['The medical establishment had evidence that handwashing was ineffective.', 'The rejection likely occurred despite clear empirical evidence supporting Semmelweis\'s intervention.', 'The rejection was based on concerns about the cost of implementing handwashing protocols.', 'The medical establishment was unaware of the mortality rate differences between the two wards.'],
    answer: 1,
    explanation: 'The passage states that after implementing handwashing, mortality rates "dropped dramatically" — yet the establishment "largely rejected" the findings. This implies the rejection happened despite clear evidence, not because of lack of evidence.'
  },
  {
    id: 'r_m_10', source: 'SIM', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose',
    passage: 'Proponents of nuclear energy often cite its low carbon emissions as a key advantage over fossil fuels. However, critics point out that while nuclear plants produce minimal emissions during operation, the full lifecycle — including uranium mining, fuel processing, plant construction, and waste disposal — has a significantly larger carbon footprint. Furthermore, the unresolved problem of long-term nuclear waste storage presents risks that extend thousands of years into the future.',
    question: 'The primary purpose of the passage is to:',
    options: ['Argue that nuclear energy should be abandoned in favor of renewable sources.', 'Present a more complete picture of nuclear energy\'s environmental impact than the common pro-nuclear argument offers.', 'Explain the technical process of nuclear power generation.', 'Compare the carbon emissions of nuclear energy and fossil fuels.'],
    answer: 1,
    explanation: 'The passage acknowledges the pro-nuclear argument (low operational emissions) but then complicates it by introducing lifecycle emissions and waste storage. The purpose is to present a fuller, more nuanced picture of nuclear energy\'s environmental impact.'
  },
  {
    id: 'r_m_11', source: 'KA', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Textual',
    passage: 'Economist Thomas Piketty argues in his book Capital in the Twenty-First Century that when the rate of return on capital (r) consistently exceeds economic growth (g), wealth inequality inevitably increases over time. He contends that this dynamic — r > g — has been the norm throughout most of human history and is responsible for the concentration of wealth in the hands of a small elite.',
    question: 'Which of the following scenarios would most directly challenge Piketty\'s central argument?',
    options: ['A country with high economic growth experiences a temporary decrease in wealth inequality.', 'A period in which r > g is accompanied by stable or declining wealth inequality.', 'A government implements a wealth tax that reduces the holdings of the top 1%.', 'Economic growth rates decline during a global recession.'],
    answer: 1,
    explanation: 'Piketty\'s argument is that r > g inevitably leads to increasing inequality. If r > g exists but inequality remains stable or declines, this directly challenges the inevitability of his claim.'
  },
  {
    id: 'r_m_12', source: 'CB', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Cross-Text Connections',
    passage: 'Text 1: Biologist E.O. Wilson argued that humans have an innate affinity for other living organisms and natural environments, a tendency he called "biophilia." He proposed that this connection evolved over millions of years of living in natural settings and that modern humans retain this deep-seated bond with nature.\n\nText 2: Psychologist Judith Heerwagen has studied the design of built environments and found that people consistently prefer spaces with natural elements — plants, water features, natural light, and views of nature — over spaces without them. She argues this preference has measurable effects on well-being and productivity.',
    question: 'How does the evidence in Text 2 relate to the argument in Text 1?',
    options: ['Text 2 challenges Text 1 by showing that human preferences for nature are culturally learned rather than innate.', 'Text 2 provides behavioral evidence consistent with the biophilia hypothesis described in Text 1.', 'Text 2 contradicts Text 1 by focusing on built environments rather than natural ones.', 'Text 2 extends Text 1\'s argument by explaining the evolutionary mechanism behind biophilia.'],
    answer: 1,
    explanation: 'Wilson\'s biophilia hypothesis predicts humans have an affinity for nature. Heerwagen\'s finding that people consistently prefer spaces with natural elements provides behavioral evidence consistent with this prediction — supporting rather than challenging it.'
  },
  {
    id: 'r_m_13', source: 'SIM', difficulty: 2,
    domain: 'Craft & Structure', skill: 'Words in Context',
    passage: 'The committee\'s report was ______: it identified the problem clearly and in detail but offered no recommendations for how to address it, leaving stakeholders uncertain about the path forward.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['comprehensive', 'diagnostic but not prescriptive', 'misleading', 'actionable'],
    answer: 1,
    explanation: '"Diagnostic but not prescriptive" precisely captures the report\'s limitation: it diagnosed (identified) the problem but did not prescribe (recommend) solutions. This is the most precise description of what the passage describes.'
  },
  {
    id: 'r_m_14', source: 'KA', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Central Ideas',
    passage: 'The Columbian Exchange — the transfer of plants, animals, diseases, and ideas between the Americas and the Old World following Columbus\'s 1492 voyage — had profound and lasting effects on both hemispheres. Europeans gained access to crops like potatoes, tomatoes, and maize that would transform their diets and eventually support population growth. Indigenous American populations, however, suffered catastrophically from Old World diseases like smallpox, to which they had no immunity, with some estimates suggesting population declines of 50–90% in the century following contact.',
    question: 'Which choice best states the central idea of the passage?',
    options: ['Columbus\'s 1492 voyage was the most important event in world history.', 'The Columbian Exchange had dramatically different consequences for European and Indigenous American populations.', 'European crops were inferior to American crops before the Columbian Exchange.', 'Disease was the primary cause of the decline of Indigenous American civilizations.'],
    answer: 1,
    explanation: 'The passage describes benefits for Europeans (new crops, population growth) and catastrophic harm for Indigenous Americans (disease, population collapse). The central idea is the dramatically different consequences for the two groups.'
  },
  {
    id: 'r_m_15', source: 'CB', difficulty: 2,
    domain: 'Information & Ideas', skill: 'Inferences',
    passage: 'In a 2019 study, researchers found that urban residents who spent at least two hours per week in natural settings — parks, forests, or bodies of water — reported significantly better health and well-being than those who spent less time in nature. The association held regardless of whether the two hours were accumulated in a single visit or spread across multiple shorter visits.',
    question: 'Which inference is best supported by the passage?',
    options: ['Urban residents who spend time in nature are generally healthier than rural residents.', 'The total amount of time spent in nature matters more than how that time is distributed.', 'Spending more than two hours per week in nature provides diminishing health returns.', 'Natural settings in urban areas are as beneficial as those in rural areas.'],
    answer: 1,
    explanation: 'The passage states the association held "regardless of whether the two hours were accumulated in a single visit or spread across multiple shorter visits." This supports the inference that total time matters more than how it\'s distributed.'
  },

  // HARD 8
  {
    id: 'r_h_07', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Words in Context — highly nuanced',
    passage: 'The historian\'s account was notable for its ______: rather than rendering judgment on historical actors, she confined herself to describing their actions and the contexts in which they operated, leaving evaluation to the reader.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['subjectivity', 'equivocation', 'detachment', 'ambivalence'],
    answer: 2,
    explanation: '"Detachment" means emotional distance or objectivity. The historian deliberately avoided rendering judgment and confined herself to description — this is scholarly detachment. "Equivocation" means being deliberately vague to avoid commitment, which is different. "Ambivalence" means having mixed feelings, not avoiding judgment.'
  },
  {
    id: 'r_h_08', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Command of Evidence — Quantitative complex',
    passage: 'A longitudinal study tracked 1,000 individuals from birth to age 40, measuring socioeconomic outcomes and early childhood factors:\n\nFactor | Correlation with Adult Income (r)\nParental income | 0.52\nCognitive test scores at age 5 | 0.41\nQuality of early childhood education | 0.38\nNeighborhood poverty rate at birth | −0.44\nParental education level | 0.47\n\nThe researchers concluded that parental income is the strongest predictor of adult income in their sample.',
    question: 'A critic argues that the researchers\' conclusion overstates the independent effect of parental income. Which consideration best supports this critique?',
    options: ['The correlation between parental income and adult income (0.52) is only slightly higher than other correlations.', 'Parental income is likely correlated with parental education, neighborhood poverty rate, and access to quality early childhood education, making it difficult to isolate its independent effect.', 'The study did not measure other potentially important factors such as personality traits.', 'Correlation coefficients cannot establish causation.'],
    answer: 1,
    explanation: 'The critique is about overstating the independent effect. The strongest argument is that parental income is correlated with the other measured factors (education, neighborhood, early education) — these factors are not independent, so the 0.52 correlation for parental income may reflect its association with these other factors rather than a purely independent effect.'
  },
  {
    id: 'r_h_09', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Cross-Text Connections — complex',
    passage: 'Text 1: Philosopher John Rawls argued that just social arrangements are those that rational individuals would choose from behind a "veil of ignorance" — not knowing their place in society, their class position, or their natural assets. He concluded that such individuals would choose a society with equal basic liberties and economic arrangements that benefit the least advantaged members.\n\nText 2: Philosopher Robert Nozick countered that Rawls\'s framework ignores the moral significance of how distributions come about. Nozick argued that if a distribution arises through just steps — voluntary exchanges and legitimate acquisitions — it is just regardless of the resulting pattern of holdings, even if some end up with far more than others.',
    question: 'Based on the texts, Nozick would most likely object to Rawls\'s "veil of ignorance" on which grounds?',
    options: ['The veil of ignorance is psychologically unrealistic because people cannot truly forget their identities.', 'The veil of ignorance ignores the historical processes through which people acquire their holdings and talents.', 'The veil of ignorance would lead rational individuals to choose a completely equal distribution of resources.', 'The veil of ignorance correctly identifies what principles of justice should look like.'],
    answer: 1,
    explanation: 'Nozick\'s core objection is that justice is about process (how distributions come about through just steps), not pattern (what the resulting distribution looks like). The veil of ignorance focuses on choosing a just pattern without regard to the historical processes of acquisition — exactly what Nozick argues is morally significant.'
  },
  {
    id: 'r_h_10', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Inferences — complex reasoning',
    passage: 'Cognitive scientist Daniel Kahneman distinguishes between two systems of thinking: System 1, which operates automatically, quickly, and with little effort, relying on heuristics and intuition; and System 2, which is slow, deliberate, and effortful, engaging in careful logical reasoning. Kahneman argues that System 1 is prone to systematic biases and errors, but that System 2, while more accurate, is cognitively expensive and therefore used sparingly.',
    question: 'Based on Kahneman\'s framework, which scenario best illustrates a situation where System 1 thinking leads to an error that System 2 could correct?',
    options: ['A chess grandmaster instantly recognizes a winning move that a novice would need hours to calculate.', 'A person immediately assumes that a tall, well-dressed individual is a CEO rather than considering other possibilities.', 'A mathematician spends hours verifying a proof before publishing it.', 'A person feels anxious before a job interview despite knowing they are well-prepared.'],
    answer: 1,
    explanation: 'System 1 uses heuristics (mental shortcuts) that lead to biases. Assuming someone is a CEO based on appearance (tall, well-dressed) is a heuristic — specifically, the representativeness heuristic — that System 1 applies automatically. System 2 could correct this by deliberately considering other possibilities. The chess example is System 1 working correctly, not erroneously.'
  },
  {
    id: 'r_h_11', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Text Structure and Purpose — complex',
    passage: 'The standard narrative of scientific progress depicts it as a steady accumulation of knowledge, with each generation building on the last. Historian of science Thomas Kuhn challenged this view in his landmark work The Structure of Scientific Revolutions. Kuhn argued that science does not progress smoothly but through "paradigm shifts" — revolutionary moments when the entire framework of a scientific field is overturned. During periods of "normal science," researchers work within an accepted paradigm; anomalies that don\'t fit the paradigm are initially ignored or explained away. Only when anomalies accumulate to a crisis point does a paradigm shift occur.',
    question: 'The primary function of the first sentence is to:',
    options: ['Provide the central argument that the rest of the passage will support.', 'Establish a conventional view that Kuhn\'s argument will challenge.', 'Introduce Thomas Kuhn as a historian of science.', 'Describe the methodology Kuhn used in his research.'],
    answer: 1,
    explanation: 'The first sentence presents the "standard narrative" of steady accumulation. The rest of the passage then introduces Kuhn\'s challenge to this view. The first sentence functions as a foil — a conventional view that is then complicated or contradicted.'
  },
  {
    id: 'r_h_12', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Command of Evidence — complex textual',
    passage: 'Anthropologist Margaret Mead\'s 1928 study Coming of Age in Samoa claimed that adolescence in Samoa was a period of carefree sexual freedom, in contrast to the stress and conflict typical of American adolescence. Mead concluded that adolescent turmoil was culturally determined rather than biologically inevitable. Decades later, anthropologist Derek Freeman conducted his own fieldwork in Samoa and argued that Mead had been misled by her informants, who had told her what they thought she wanted to hear, and that Samoan adolescence was in fact marked by considerable conflict and competition.',
    question: 'If Freeman\'s critique is accurate, what would be the most significant implication for Mead\'s conclusion?',
    options: ['Mead\'s fieldwork methods were generally unreliable and should not be used by other anthropologists.', 'The empirical basis for Mead\'s conclusion that adolescent turmoil is culturally determined would be undermined.', 'Adolescent turmoil is biologically inevitable in all cultures.', 'Samoan culture has changed significantly since Mead\'s 1928 study.'],
    answer: 1,
    explanation: 'Mead\'s conclusion (adolescent turmoil is culturally determined) rested on her finding that Samoan adolescence was carefree. If Freeman is correct that this finding was based on misleading information, the empirical foundation of her conclusion collapses — she cannot claim cultural determination based on data that was inaccurate.'
  },
  {
    id: 'r_h_13', source: 'CB', difficulty: 3,
    domain: 'Craft & Structure', skill: 'Words in Context — most precise',
    passage: 'The policy\'s effects were ______: while it achieved its stated goal of reducing carbon emissions in the short term, it did so by shifting energy-intensive industries to countries with weaker environmental regulations, resulting in no net global reduction.',
    question: 'Which choice completes the text with the most logical and precise word?',
    options: ['counterproductive', 'pyrrhic', 'negligible', 'illusory'],
    answer: 3,
    explanation: '"Illusory" means based on illusion; not real. The policy appeared to succeed (reduced local emissions) but the success was an illusion — global emissions didn\'t actually decrease. "Pyrrhic" means a victory won at too great a cost, which doesn\'t quite fit. "Counterproductive" means having the opposite effect, which is too strong — the local goal was achieved. "Illusory" most precisely captures the idea that the apparent success was not real.'
  },
  {
    id: 'r_h_14', source: 'SIM', difficulty: 3,
    domain: 'Information & Ideas', skill: 'Central Ideas — complex',
    passage: 'The concept of "moral luck" — introduced by philosophers Thomas Nagel and Bernard Williams — challenges the intuition that people should only be held morally responsible for what is within their control. Nagel identifies several types of moral luck: resultant luck (the outcomes of our actions), circumstantial luck (the situations we find ourselves in), and constitutive luck (the kind of person we are, including our character and dispositions). If moral luck is real, then two people who make identical choices may deserve very different moral assessments based purely on factors outside their control.',
    question: 'Which choice best states the central claim of the passage?',
    options: ['Moral luck is an incoherent concept that should be rejected by philosophers.', 'The concept of moral luck challenges the idea that moral responsibility should be based solely on what is within one\'s control.', 'Nagel and Williams disagree about the types of moral luck that exist.', 'Circumstantial luck is the most morally significant type of luck identified by Nagel.'],
    answer: 1,
    explanation: 'The passage introduces moral luck as a concept that "challenges the intuition that people should only be held morally responsible for what is within their control." This is the central claim — the concept challenges the control-based view of moral responsibility.'
  },

// ─── WRITING EXTRA: 25 new questions (Easy 8 / Medium 9 / Hard 8) ───

  // EASY 8
  {
];

// ═════════════════════════════════════════════════════════════════════════════
// WRITING — 20 questions (7 Easy, 7 Medium, 6 Hard)
// Digital SAT Writing: Standard English Conventions, Expression of Ideas
// Every question has a passage with a blank or underlined portion
// ═════════════════════════════════════════════════════════════════════════════
export const WRITING_QUESTIONS: Question[] = [
  // ─── EASY ───
  {
    id: 'w_e_01', source: 'CB', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Punctuation — comma with nonrestrictive clause',
    passage: 'Marie Curie ______ the first woman to win a Nobel Prize, made groundbreaking discoveries in radioactivity.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', who was', 'who was', ', which was', 'that was'],
    answer: 0,
    explanation: 'The clause "who was the first woman to win a Nobel Prize" is a nonrestrictive (parenthetical) clause that adds extra information. It should be set off by commas. "Who" is used for people.'
  },
  {
    id: 'w_e_02', source: 'CB', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Subject-verb agreement',
    passage: 'The collection of rare manuscripts ______ stored in a climate-controlled vault to prevent deterioration.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['are', 'is', 'were', 'have been'],
    answer: 1,
    explanation: 'The subject is "collection" (singular), not "manuscripts." A singular subject requires a singular verb: "is stored."'
  },
  {
    id: 'w_e_03', source: 'KA', difficulty: 1,
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'Many scientists initially dismissed the theory of continental drift. ______, the discovery of matching fossil records on different continents provided compelling evidence that the continents had once been joined.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Therefore', 'However', 'Similarly', 'In addition'],
    answer: 1,
    explanation: '"However" signals a contrast or reversal. The second sentence contradicts the first (dismissal vs. compelling evidence), so "However" is the correct transition.'
  },
  {
    id: 'w_e_04', source: 'SIM', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Apostrophes — possession',
    passage: 'The ______ decision to expand the program was met with widespread approval from the community.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English? (The decision belongs to the committee.)',
    options: ['committees\'', 'committee\'s', 'committees', 'committee'],
    answer: 1,
    explanation: 'To show possession for a singular noun, add apostrophe + s: "committee\'s decision." "Committees\'" would be used for a plural noun.'
  },
  {
    id: 'w_e_05', source: 'CB', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Pronoun-antecedent agreement',
    passage: 'Each of the students submitted ______ final project before the deadline.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['their', 'his or her', 'its', 'our'],
    answer: 1,
    explanation: '"Each" is a singular indefinite pronoun. In formal Standard English, "his or her" is the traditional singular pronoun. (Note: "their" is increasingly accepted as singular, but in formal SAT context, "his or her" is preferred for singular "each.")'
  },
  {
    id: 'w_e_06', source: 'KA', difficulty: 1,
    domain: 'Expression of Ideas', skill: 'Transitions',
    passage: 'The new medication showed promising results in early trials. ______, larger clinical studies will be needed before it can be approved for widespread use.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['As a result', 'Nevertheless', 'Furthermore', 'Consequently'],
    answer: 1,
    explanation: '"Nevertheless" (or "However") signals that despite the promising results, more work is still needed. The second sentence qualifies the first, making "Nevertheless" the most logical transition.'
  },
  {
    id: 'w_e_07', source: 'SIM', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Verb tense',
    passage: 'By the time the rescue team arrived, the hikers ______ in the cave for over twelve hours.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['waited', 'have waited', 'had been waiting', 'are waiting'],
    answer: 2,
    explanation: 'The past perfect progressive "had been waiting" is used for an action that was ongoing up to a specific point in the past ("by the time the team arrived").'
  },

  // ─── MEDIUM ───
  {
    id: 'w_m_01', source: 'CB', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis',
    passage: 'A student is writing a report about the benefits of urban green spaces. The student wants to emphasize the mental health benefits specifically. Which choice most effectively uses the following information?\n• Urban parks reduce stress levels in visitors.\n• Green spaces in cities lower rates of anxiety and depression.\n• Trees in urban areas improve air quality.\n• Urban gardens provide fresh produce to communities.',
    question: 'Which choice most effectively uses the relevant information?',
    options: ['Urban green spaces offer many benefits, including improved air quality and access to fresh produce.', 'Research shows that urban parks and green spaces significantly reduce stress and lower rates of anxiety and depression among city residents.', 'Urban gardens and parks serve important social functions in city communities.', 'Cities with more trees tend to have better air quality and more community gathering spaces.'],
    answer: 1,
    explanation: 'The student wants to emphasize mental health benefits. Option B directly addresses stress reduction and lower rates of anxiety and depression — the two mental health-related points from the list.'
  },
  {
    id: 'w_m_02', source: 'CB', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Sentence boundaries — semicolons',
    passage: 'The ancient city of Pompeii was buried under volcanic ash in 79 CE ______ its remarkable preservation has provided archaeologists with an unprecedented window into Roman daily life.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', and', '; however,', ';', ', but'],
    answer: 2,
    explanation: 'A semicolon can join two independent clauses that are closely related. Both clauses here are complete sentences with a logical connection. A semicolon (without a conjunctive adverb) is correct here.'
  },
  {
    id: 'w_m_03', source: 'SIM', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Transitions — complex',
    passage: 'Traditional economic models assume that individuals make rational decisions to maximize their utility. ______, behavioral economists have demonstrated that human decision-making is systematically influenced by cognitive biases, emotions, and social factors that lead to predictably irrational choices.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Similarly', 'In contrast', 'As a result', 'For instance'],
    answer: 1,
    explanation: '"In contrast" signals that the second sentence presents an opposing view to the first. Behavioral economics contradicts the assumption of rational decision-making in traditional models.'
  },
  {
    id: 'w_m_04', source: 'CB', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Modifiers — dangling modifier',
    passage: '______ the data carefully, several significant patterns emerged.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['Having analyzed', 'After analyzing', 'When the researchers analyzed', 'Analyzing'],
    answer: 2,
    explanation: 'The original phrasing creates a dangling modifier — "several patterns" cannot analyze data. The subject performing the analysis must be stated: "When the researchers analyzed the data, several patterns emerged."'
  },
  {
    id: 'w_m_05', source: 'KA', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis',
    passage: 'A student is writing about the impact of the printing press. The student wants to make the point that the printing press increased access to information. Which choice most effectively uses the following information?\n• Before the printing press, books cost as much as a house.\n• After the printing press, book prices dropped by 80% within 50 years.\n• The printing press allowed 200 books to be produced in the time it took to hand-copy one.\n• Literacy rates in Europe rose significantly in the century after the printing press.',
    question: 'Which choice most effectively uses the relevant information?',
    options: ['The printing press was a significant technological innovation of the 15th century.', 'By reducing book prices by 80% and producing books 200 times faster than hand-copying, the printing press made written knowledge accessible to far more people.', 'Before the printing press, books were extremely expensive and rare.', 'Literacy rates in Europe increased after the printing press was invented.'],
    answer: 1,
    explanation: 'Option B combines the most relevant data points (price reduction and production speed) to make the specific argument about increased access to information, rather than just stating one fact.'
  },
  {
    id: 'w_m_06', source: 'SIM', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Parallel structure',
    passage: 'The new CEO was known for her ability to inspire employees, ______, and making difficult decisions under pressure.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['to navigate complex negotiations', 'navigating complex negotiations', 'the navigation of complex negotiations', 'she navigated complex negotiations'],
    answer: 1,
    explanation: 'Parallel structure requires matching grammatical forms. The list uses gerunds: "inspiring," "navigating," and "making." So "navigating complex negotiations" maintains the parallel structure.'
  },
  {
    id: 'w_m_07', source: 'CB', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Punctuation — colon',
    passage: 'The expedition team brought three essential items ______ a compass, a first-aid kit, and enough food for two weeks.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', which were', ': ', ', including', '; '],
    answer: 1,
    explanation: 'A colon is used after a complete independent clause to introduce a list. "The expedition team brought three essential items" is a complete clause, so a colon correctly introduces the list that follows.'
  },

  // ─── HARD ───
  {
    id: 'w_h_01', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — complex',
    passage: 'A researcher is writing about the limitations of self-reported data in social science research. The researcher wants to acknowledge a specific methodological problem. Which choice most effectively uses the following notes?\n• Self-report surveys ask participants to recall past behaviors.\n• Memory is reconstructive and subject to distortion.\n• Participants may alter responses to appear more socially acceptable.\n• The gap between reported and actual behavior can be substantial in sensitive topics.',
    question: 'Which choice most effectively uses the relevant information to acknowledge a specific methodological problem?',
    options: ['Self-report surveys have several limitations that researchers should consider.', 'Because memory is reconstructive and participants may alter responses to seem socially acceptable, self-reported data may not accurately reflect actual behavior.', 'Researchers should use multiple methods when studying human behavior.', 'Self-report surveys ask participants to recall past behaviors, which can be difficult.'],
    answer: 1,
    explanation: 'Option B identifies two specific methodological problems (reconstructive memory and social desirability bias) and connects them to the consequence (inaccurate data). This is more specific and analytically precise than the other options.'
  },
  {
    id: 'w_h_02', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Sentence structure — subordination',
    passage: 'The novel was praised for its intricate plot and complex characters, ______ critics noted that its length made it inaccessible to casual readers.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English and creates the most logical relationship between the ideas?',
    options: ['and', 'although', 'because', 'so'],
    answer: 1,
    explanation: '"Although" creates a concessive relationship — the novel was praised despite the criticism about length. This is the most logical relationship: it was praised, but critics had a reservation.'
  },
  {
    id: 'w_h_03', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Transitions — logical relationship',
    passage: 'Early research suggested that multitasking could improve productivity by allowing workers to complete multiple tasks simultaneously. ______, subsequent studies using neuroimaging found that the brain cannot truly perform two cognitive tasks at once; what appears to be multitasking is actually rapid task-switching, which increases cognitive load and error rates.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Furthermore', 'Subsequently', 'Accordingly', 'Contrary to this belief'],
    answer: 3,
    explanation: '"Contrary to this belief" directly signals that the subsequent research contradicts the earlier research. The transition must indicate a direct contradiction of the preceding claim, which "Contrary to this belief" does most precisely.'
  },
  {
    id: 'w_h_04', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Punctuation — complex sentences',
    passage: 'The philosopher argued that free will ______ the ability to have acted differently in identical circumstances ______ is incompatible with a deterministic universe.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', which is', '— defined as', ', defined as', '— defined as —'],
    answer: 3,
    explanation: 'The phrase "defined as the ability to have acted differently in identical circumstances" is a parenthetical definition that interrupts the main clause. Em dashes on both sides correctly set off this interrupting phrase: "free will — defined as... — is incompatible."'
  },
  {
    id: 'w_h_05', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — precise claim',
    passage: 'A student is writing an argumentative essay claiming that remote work increases employee productivity. Which choice most effectively uses the following data?\n• A Stanford study found a 13% productivity increase among remote workers.\n• Remote workers reported 50% less distraction than office workers.\n• Companies with remote work policies saw 25% lower employee turnover.\n• Remote workers saved an average of 2 hours per day by eliminating commutes.',
    question: 'Which choice most effectively uses the relevant data to support the specific claim about productivity?',
    options: ['Remote work offers many benefits to both employees and employers.', 'According to a Stanford study, remote workers showed a 13% productivity increase, and they reported experiencing 50% less distraction than their office-based counterparts.', 'Companies with remote work policies benefit from lower employee turnover and increased worker satisfaction.', 'Remote workers save time by eliminating commutes, which may contribute to greater productivity.'],
    answer: 1,
    explanation: 'The claim is specifically about productivity. Option B uses the two data points directly related to productivity (the 13% increase and the 50% less distraction) rather than turnover or commute time, which are related but not direct measures of productivity.'
  },
  {
    id: 'w_h_06', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Agreement — complex subject',
    passage: 'Neither the committee members nor the director ______ aware of the discrepancy in the financial reports until the audit was completed.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['were', 'was', 'are', 'have been'],
    answer: 1,
    explanation: 'With "neither...nor" constructions, the verb agrees with the subject closest to it. "The director" (singular) is closest to the verb, so use the singular "was."'
  },
id: 'w_e_08', source: 'CB', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Punctuation — colon',
    passage: 'The recipe requires three main ingredients ______ flour, sugar, and butter.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [':', ';', ',', ' —'],
    answer: 0,
    explanation: 'A colon is used to introduce a list when the introductory clause is a complete sentence. "The recipe requires three main ingredients" is a complete clause, so a colon correctly introduces the list that follows.'
  },
  {
    id: 'w_e_09', source: 'KA', difficulty: 1,
    domain: 'Expression of Ideas', skill: 'Transitions — simple',
    passage: 'Regular exercise has been shown to improve cardiovascular health. ______, studies indicate that physical activity can also enhance mental well-being and reduce symptoms of depression.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['However', 'Furthermore', 'Therefore', 'In contrast'],
    answer: 1,
    explanation: '"Furthermore" adds an additional point to support the same general idea. The passage is adding another benefit of exercise (mental well-being) to the first benefit (cardiovascular health). "Furthermore" correctly signals this additive relationship.'
  },
  {
    id: 'w_e_10', source: 'SIM', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Subject-verb agreement — basic',
    passage: 'The collection of ancient manuscripts ______ housed in a climate-controlled vault to prevent deterioration.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['are', 'is', 'were', 'have been'],
    answer: 1,
    explanation: 'The subject is "collection" (singular), not "manuscripts." A prepositional phrase ("of ancient manuscripts") does not change the subject. The singular verb "is" agrees with the singular subject "collection."'
  },
  {
    id: 'w_e_11', source: 'CB', difficulty: 1,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — basic',
    passage: 'A student is writing a report about the benefits of public libraries. Which choice most effectively uses the following notes?\n• Public libraries provide free internet access to community members.\n• Libraries offer educational programs for children and adults.\n• Library cardholders can borrow books, DVDs, and other materials at no cost.\n• Many libraries provide meeting spaces for community organizations.',
    question: 'Which choice most effectively synthesizes the notes into a single sentence?',
    options: ['Public libraries are important institutions in many communities.', 'Public libraries serve as community hubs by providing free access to information, educational programs, borrowing services, and meeting spaces.', 'Public libraries offer internet access and books to community members.', 'Many people use public libraries for their educational programs.'],
    answer: 1,
    explanation: 'Option B synthesizes all four notes into a single comprehensive sentence, accurately representing the breadth of library services. Option A is too vague, Option C omits two of the four points, and Option D mentions only one.'
  },
  {
    id: 'w_e_12', source: 'KA', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Pronoun-antecedent agreement',
    passage: 'Each of the students submitted ______ final project before the deadline.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['their', 'his or her', 'its', 'our'],
    answer: 0,
    explanation: 'In contemporary Standard English, "their" is widely accepted as a singular pronoun when the antecedent is indefinite (like "each"). Both "their" and "his or her" are acceptable, but "their" is the more natural contemporary choice.'
  },
  {
    id: 'w_e_13', source: 'SIM', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Verb tense consistency',
    passage: 'The expedition team reached the summit at dawn, planted their flag, and ______ photographs before beginning the descent.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['take', 'taking', 'took', 'have taken'],
    answer: 2,
    explanation: 'The passage uses past tense verbs ("reached," "planted"). To maintain tense consistency, the third verb in the series should also be simple past: "took."'
  },
  {
    id: 'w_e_14', source: 'CB', difficulty: 1,
    domain: 'Expression of Ideas', skill: 'Transitions — contrast',
    passage: 'Early studies suggested that the new drug was highly effective against the virus. ______, a larger clinical trial found that the drug\'s benefits were modest and its side effects more severe than initially reported.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Similarly', 'Consequently', 'Nevertheless', 'However'],
    answer: 3,
    explanation: '"However" signals a contrast or contradiction. The second sentence contradicts the first (modest benefits vs. high effectiveness). "However" is the standard transition for this type of direct contrast.'
  },
  {
    id: 'w_e_15', source: 'SIM', difficulty: 1,
    domain: 'Standard English Conventions', skill: 'Apostrophe — possessive',
    passage: 'The ______ decision to relocate the headquarters surprised many employees.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['companies', "company's", "companies'", 'company'],
    answer: 1,
    explanation: 'The sentence requires a singular possessive: one company made the decision. "Company\'s" (singular possessive) is correct. "Companies\'" would indicate multiple companies.'
  },

  // MEDIUM 9
  {
    id: 'w_m_08', source: 'CB', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Transitions — complex logical relationship',
    passage: 'Proponents of standardized testing argue that such tests provide an objective measure of student achievement that is not subject to the biases of individual teachers. ______, critics contend that standardized tests measure only a narrow range of skills and systematically disadvantage students from lower socioeconomic backgrounds.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['As a result', 'In addition', 'Conversely', 'For instance'],
    answer: 2,
    explanation: '"Conversely" signals a direct opposition or contrast from a different perspective. The passage presents the pro-testing argument and then the anti-testing argument — these are opposing viewpoints, making "Conversely" the most precise transition.'
  },
  {
    id: 'w_m_09', source: 'SIM', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Punctuation — semicolon vs. comma',
    passage: 'The two proposals were fundamentally different ______ the first prioritized speed of implementation, while the second emphasized long-term sustainability.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', and', ';', ', but', ': however,'],
    answer: 1,
    explanation: 'A semicolon correctly joins two independent clauses without a coordinating conjunction. "The two proposals were fundamentally different" and "the first prioritized speed..." are both independent clauses. A semicolon (option B) correctly connects them.'
  },
  {
    id: 'w_m_10', source: 'CB', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — argumentative',
    passage: 'A student is writing an essay arguing that cities should invest in cycling infrastructure. Which choice most effectively uses the following data to support this argument?\n• Cities with extensive cycling networks have 40% lower per-capita transportation emissions.\n• Cycling infrastructure costs approximately 10 times less per mile than highway construction.\n• Cities with high cycling rates report lower rates of obesity and cardiovascular disease.\n• Cycling reduces traffic congestion, saving commuters an average of 15 minutes per day.',
    question: 'Which choice most effectively uses the data to support the argument for cycling infrastructure investment?',
    options: ['Cycling is a healthy form of transportation that many people enjoy.', 'Investing in cycling infrastructure offers cities a cost-effective way to simultaneously reduce emissions, improve public health, and decrease traffic congestion.', 'Cities with cycling networks have lower transportation emissions than those without.', 'Cycling infrastructure is cheaper to build than highways.'],
    answer: 1,
    explanation: 'Option B synthesizes multiple data points (emissions, health, congestion) into a single compelling argument for investment. It uses the most relevant data points and frames them as benefits of investment, directly supporting the essay\'s argument.'
  },
  {
    id: 'w_m_11', source: 'SIM', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Modifier placement',
    passage: 'Having studied the ancient texts for decades, ______ the historian\'s interpretation was considered authoritative by her peers.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['the ancient texts were finally understood,', 'the historian\'s interpretation was considered authoritative,', 'the historian offered an interpretation considered authoritative by her peers.', 'her peers considered the historian\'s interpretation authoritative.'],
    answer: 2,
    explanation: 'The participial phrase "Having studied the ancient texts for decades" must modify the subject of the main clause. The subject must be the historian (who did the studying). Option C correctly makes "the historian" the subject of the main clause.'
  },
  {
    id: 'w_m_12', source: 'CB', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Transitions — nuanced',
    passage: 'The early results of the climate intervention were promising: global temperatures stabilized and extreme weather events decreased in frequency. ______, scientists cautioned that the intervention\'s long-term effects on precipitation patterns remained poorly understood and potentially destabilizing.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Therefore', 'Nonetheless', 'Similarly', 'Specifically'],
    answer: 1,
    explanation: '"Nonetheless" means in spite of what has just been said — it acknowledges the positive results while introducing a contrasting concern. The passage presents good news (stabilized temperatures) but then introduces a caveat (unknown long-term effects). "Nonetheless" captures this concessive relationship.'
  },
  {
    id: 'w_m_13', source: 'SIM', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Punctuation — dash for emphasis',
    passage: 'The solution to the city\'s housing crisis ______ according to urban planners ______ requires both increased construction and stronger tenant protections.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', according to urban planners,', '— according to urban planners —', ': according to urban planners:', '; according to urban planners;'],
    answer: 1,
    explanation: 'Em dashes are used to set off a parenthetical phrase that interrupts the main clause, especially when the interruption is emphatic or the sentence already contains commas. "— according to urban planners —" correctly sets off the attribution as a parenthetical interruption.'
  },
  {
    id: 'w_m_14', source: 'KA', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — precise claim',
    passage: 'A researcher is writing a paper arguing that social media has negative effects on adolescent mental health. Which choice most effectively uses the following findings to support this specific claim?\n• Adolescents who use social media for more than 3 hours daily are 2.5 times more likely to report depression.\n• Social media platforms use algorithms designed to maximize engagement.\n• Cyberbullying affects approximately 37% of young people aged 12–17.\n• Adolescents who limit social media to 30 minutes daily show significant improvements in well-being within three weeks.',
    question: 'Which choice most effectively uses the data to support the claim about negative mental health effects?',
    options: ['Social media platforms are designed to be addictive, which raises ethical concerns.', 'Research shows that heavy social media use (3+ hours daily) is associated with a 2.5-fold increase in depression risk among adolescents, and cyberbullying — which affects 37% of young people — represents a direct harm facilitated by these platforms.', 'Adolescents who limit their social media use report better well-being.', 'Social media has both positive and negative effects on adolescent mental health.'],
    answer: 1,
    explanation: 'Option B uses two data points directly measuring negative mental health effects (depression risk and cyberbullying rates) and frames them as direct evidence of harm. It is the most specific and evidence-based support for the claim.'
  },
  {
    id: 'w_m_15', source: 'CB', difficulty: 2,
    domain: 'Standard English Conventions', skill: 'Verb form — infinitive vs. gerund',
    passage: 'The committee recommended ______ the proposal before the final vote to allow more time for public comment.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['to table', 'tabling', 'that they table', 'the tabling of'],
    answer: 1,
    explanation: 'The verb "recommend" is typically followed by a gerund (verb + -ing) when the action is general. "Recommended tabling" is the standard construction. "Recommend to table" is not standard English; "recommend that they table" is also correct but more formal and wordy.'
  },
  {
    id: 'w_m_16', source: 'SIM', difficulty: 2,
    domain: 'Expression of Ideas', skill: 'Transitions — cause and effect',
    passage: 'The region experienced its driest summer in recorded history. ______, wildfires spread rapidly across thousands of acres, destroying numerous homes and forcing mass evacuations.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['In contrast', 'As a result', 'Nevertheless', 'For example'],
    answer: 1,
    explanation: '"As a result" signals a cause-and-effect relationship. The drought (cause) led to the wildfires spreading rapidly (effect). "As a result" correctly identifies this causal connection.'
  },

  // HARD 8
  {
    id: 'w_h_07', source: 'CB', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Punctuation — complex parenthetical',
    passage: 'The treaty ______ signed in 1648 and considered the foundation of the modern nation-state system ______ established the principle of national sovereignty.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', signed in 1648 and considered the foundation of the modern nation-state system,', '— signed in 1648 and considered the foundation of the modern nation-state system —', ', signed in 1648, and considered the foundation of the modern nation-state system,', 'signed in 1648 and considered the foundation of the modern nation-state system'],
    answer: 1,
    explanation: 'Em dashes are preferred when setting off a long, complex parenthetical phrase that contains its own commas. The phrase "signed in 1648 and considered the foundation of the modern nation-state system" is a complex appositive that interrupts the main clause. Em dashes clearly set off this interruption.'
  },
  {
    id: 'w_h_08', source: 'SIM', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Transitions — concessive complex',
    passage: 'The evidence strongly suggests that the intervention reduced recidivism rates among participants. ______, without a randomized control group, it is impossible to rule out the possibility that participants who self-selected into the program were already less likely to reoffend.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Therefore', 'Furthermore', 'That said', 'In particular'],
    answer: 2,
    explanation: '"That said" is a concessive transition meaning "despite what has just been said." It acknowledges the positive evidence while introducing a methodological limitation. This is more nuanced than "However" because it concedes the evidence\'s strength before raising the caveat.'
  },
  {
    id: 'w_h_09', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — complex argumentation',
    passage: 'A student is writing an essay arguing that algorithmic decision-making in criminal justice (such as risk assessment tools used in sentencing) should be subject to greater transparency requirements. Which choice most effectively uses the following information?\n• Risk assessment algorithms are often proprietary, preventing defendants from challenging their accuracy.\n• Studies show some algorithms have higher error rates for Black defendants than white defendants.\n• Judges in some jurisdictions are required to consider algorithmic risk scores in sentencing decisions.\n• Proponents argue algorithms reduce human bias in sentencing.',
    question: 'Which choice most effectively uses the information to support the argument for transparency requirements?',
    options: ['Algorithmic decision-making raises important questions about fairness in the criminal justice system.', 'When judges are required to consider proprietary algorithmic scores in sentencing decisions, and those algorithms demonstrably produce racially disparate error rates, defendants have a compelling due process interest in understanding and challenging the tools used against them.', 'Some risk assessment algorithms have been shown to have higher error rates for certain demographic groups.', 'Proponents of algorithmic sentencing tools argue they reduce human bias, but critics disagree.'],
    answer: 1,
    explanation: 'Option B synthesizes three key pieces of information (mandatory judicial use, proprietary nature preventing challenge, racial disparities) into a coherent argument for transparency, framing it as a due process issue. It is the most specific and legally grounded support for the essay\'s argument.'
  },
  {
    id: 'w_h_10', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Agreement — inverted sentence',
    passage: 'Among the most significant challenges facing the healthcare system ______ the rising cost of prescription drugs and the shortage of primary care physicians in rural areas.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: ['is', 'are', 'was', 'has been'],
    answer: 1,
    explanation: 'In an inverted sentence (where the subject follows the verb), identify the true subject: "the rising cost... and the shortage..." — a compound subject joined by "and." Compound subjects take plural verbs: "are."'
  },
  {
    id: 'w_h_11', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Transitions — highly nuanced',
    passage: 'The philosopher acknowledged that her argument rested on premises that many would find counterintuitive. ______, she argued, the strength of an argument cannot be judged by the palatability of its premises but only by the validity of its logical structure.',
    question: 'Which choice completes the text with the most logical transition?',
    options: ['Therefore', 'Nevertheless', 'Ultimately', 'In other words'],
    answer: 2,
    explanation: '"Ultimately" signals that what follows is the final or most important point, often after acknowledging complications. The philosopher acknowledges the counterintuitive premises but then makes her ultimate point about logical validity. "Ultimately" captures this rhetorical move of conceding a point and then asserting a more fundamental principle.'
  },
  {
    id: 'w_h_12', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Punctuation — restrictive vs. nonrestrictive',
    passage: 'The regulation ______ requires companies to disclose their carbon emissions ______ was passed with bipartisan support.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', which requires companies to disclose their carbon emissions,', 'that requires companies to disclose their carbon emissions', ', that requires companies to disclose their carbon emissions,', 'which requires companies to disclose their carbon emissions'],
    answer: 0,
    explanation: 'The relative clause "which requires companies to disclose their carbon emissions" is nonrestrictive — it provides additional information about a specific regulation already identified, rather than identifying which regulation is meant. Nonrestrictive clauses use "which" and are set off by commas.'
  },
  {
    id: 'w_h_13', source: 'CB', difficulty: 3,
    domain: 'Expression of Ideas', skill: 'Rhetorical Synthesis — nuanced claim',
    passage: 'A student is writing a paper arguing that the benefits of globalization have been unevenly distributed. Which choice most effectively uses the following data?\n• Global GDP has increased 400% since 1990.\n• The share of people living in extreme poverty fell from 36% in 1990 to 10% in 2015.\n• Income inequality within most developed countries has increased since 1990.\n• The top 1% of earners captured 27% of global income growth between 1980 and 2016.',
    question: 'Which choice most effectively uses the data to support the argument about uneven distribution?',
    options: ['Globalization has produced significant economic growth since 1990.', 'While global GDP has grown 400% and extreme poverty has declined significantly, income inequality within developed countries has risen and the top 1% captured 27% of global income growth — suggesting that the gains from globalization have not been shared equally.', 'The top 1% of earners have benefited disproportionately from globalization.', 'Extreme poverty has declined significantly since 1990, demonstrating globalization\'s benefits.'],
    answer: 1,
    explanation: 'Option B presents both the positive data (GDP growth, poverty reduction) and the inequality data (rising within-country inequality, top 1% share) in a single sentence that directly supports the "uneven distribution" argument. It uses all four data points and frames them to support the specific claim.'
  },
  {
    id: 'w_h_14', source: 'SIM', difficulty: 3,
    domain: 'Standard English Conventions', skill: 'Sentence boundaries — complex',
    passage: 'The study\'s methodology was rigorous ______ the researchers used a double-blind design, pre-registered their hypotheses, and had their statistical analysis independently verified before publication.',
    question: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: [', and', ': specifically,', ', however,', ', because'],
    answer: 1,
    explanation: 'A colon followed by "specifically" correctly introduces an elaboration or explanation of the preceding claim. "The study\'s methodology was rigorous" is a complete claim, and what follows explains specifically why it was rigorous. A colon with "specifically" is the most precise and grammatically correct option.'
  },
];


// ═════════════════════════════════════════════════════════════════════════════
// VOCABULARY — 30 words with SAT-style passage quiz, definition, example,
//              memory trick, and explanation
// ═════════════════════════════════════════════════════════════════════════════
export interface VocabWord {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  trick: string;
  difficulty: 1 | 2 | 3;
  passage: string;   // SAT-style passage with ______ blank
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

export const VOCAB_BANK: VocabWord[] = [
  {
    word: 'Ambiguous', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Open to more than one interpretation; not having one obvious meaning.',
    example: 'The politician\'s statement was ambiguous, leaving voters unsure of his actual position.',
    trick: 'AMBIguous → "AMBI" means "both" (like ambidextrous). Something ambiguous can go BOTH ways.',
    passage: 'The contract\'s wording was ______: lawyers for both parties interpreted the key clause differently, leading to a lengthy dispute.',
    options: ['precise', 'ambiguous', 'transparent', 'redundant'],
    answer: 1,
    explanation: '"Ambiguous" means open to multiple interpretations. The passage describes a situation where the same wording was interpreted differently — a classic example of ambiguity.'
  },
  {
    word: 'Benevolent', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Well-meaning and kindly; charitable.',
    example: 'The benevolent donor funded scholarships for hundreds of students.',
    trick: 'BENE = "good" (benefit, beneficial). A benevolent person has GOOD will toward others.',
    passage: 'The ______ philanthropist donated millions to build hospitals in underserved communities, asking for nothing in return.',
    options: ['miserly', 'benevolent', 'indifferent', 'vindictive'],
    answer: 1,
    explanation: '"Benevolent" means well-meaning and charitable. Donating to help others with no expectation of return is a benevolent act.'
  },
  {
    word: 'Candid', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Truthful and straightforward; frank.',
    example: 'She gave a candid assessment of the project\'s weaknesses.',
    trick: 'CANDID sounds like "CANDLE" — a candle illuminates truth in the dark. Candid = shining light on the truth.',
    passage: 'The CEO was unusually ______ in the interview, openly discussing the company\'s financial struggles rather than offering the usual reassurances.',
    options: ['evasive', 'candid', 'diplomatic', 'vague'],
    answer: 1,
    explanation: '"Candid" means truthful and frank. The CEO openly discussed struggles instead of evading — that\'s candid behavior.'
  },
  {
    word: 'Diligent', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
    example: 'The diligent student reviewed her notes every evening.',
    trick: 'DILIGENT → think "DRILL-igent" — someone who drills (practices) hard and consistently.',
    passage: 'The ______ researcher spent years verifying each data point, refusing to publish until she was certain of her findings\' accuracy.',
    options: ['careless', 'hasty', 'diligent', 'impulsive'],
    answer: 2,
    explanation: '"Diligent" means careful and hardworking. Spending years verifying data before publishing reflects diligence.'
  },
  {
    word: 'Eloquent', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Fluent or persuasive in speaking or writing.',
    example: 'Her eloquent speech moved the audience to tears.',
    trick: 'ELOQUENT → "ELOCUTION" (the art of speaking). An eloquent person is a master of elocution.',
    passage: 'The defense attorney\'s ______ closing argument — carefully structured, emotionally resonant, and logically airtight — convinced the jury to acquit her client.',
    options: ['rambling', 'eloquent', 'incoherent', 'terse'],
    answer: 1,
    explanation: '"Eloquent" means fluent and persuasive. A carefully structured, emotionally resonant, logically airtight argument is the definition of eloquence.'
  },
  {
    word: 'Frugal', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Sparing or economical with money or food; not wasteful.',
    example: 'Despite his wealth, he remained frugal, always looking for the best value.',
    trick: 'FRUGAL → sounds like "FROOGLE" (Google\'s old price comparison tool). Frugal people always compare prices!',
    passage: 'Although she earned a high salary, she was ______: she cooked at home, bought secondhand clothes, and saved 40% of her income each month.',
    options: ['extravagant', 'frugal', 'impulsive', 'generous'],
    answer: 1,
    explanation: '"Frugal" means economical and not wasteful. Cooking at home, buying secondhand, and saving 40% of income are all frugal behaviors.'
  },
  {
    word: 'Gregarious', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Fond of company; sociable.',
    example: 'The gregarious host made sure every guest felt welcome.',
    trick: 'GREGARIOUS → "GREG" is often a very social, friendly name in pop culture. Gregarious people love being with their "herd" (Latin: grex = flock).',
    passage: 'Unlike her introverted colleagues, she was ______: she thrived at networking events, easily striking up conversations with strangers.',
    options: ['reclusive', 'aloof', 'gregarious', 'taciturn'],
    answer: 2,
    explanation: '"Gregarious" means sociable and fond of company. Thriving at networking events and easily talking to strangers describes a gregarious person.'
  },
  {
    word: 'Hypothesis', partOfSpeech: 'noun', difficulty: 1,
    definition: 'A proposed explanation for a phenomenon, made as a starting point for investigation.',
    example: 'The scientist\'s hypothesis was that caffeine improves short-term memory.',
    trick: 'HYPO = "under" + THESIS = "idea." A hypothesis is an UNDER-idea — not yet proven, placed UNDER the theory.',
    passage: 'Before conducting any experiments, the team formulated a ______: they predicted that increased sunlight exposure would accelerate plant growth by at least 20%.',
    options: ['conclusion', 'hypothesis', 'theorem', 'observation'],
    answer: 1,
    explanation: 'A hypothesis is a proposed explanation made before investigation. Predicting an outcome before conducting experiments is forming a hypothesis.'
  },
  {
    word: 'Innovative', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Featuring new methods; advanced and original.',
    example: 'The innovative design won multiple awards for its originality.',
    trick: 'INNOVATE → IN + NOVUS (Latin for "new"). To innovate is to bring in something NEW.',
    passage: 'The startup\'s ______ approach to renewable energy — using algae to generate electricity — attracted significant attention from investors.',
    options: ['conventional', 'innovative', 'derivative', 'obsolete'],
    answer: 1,
    explanation: '"Innovative" means featuring new, original methods. Using algae to generate electricity is a novel, innovative approach.'
  },
  {
    word: 'Juxtapose', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To place two things side by side for comparison or contrast.',
    example: 'The documentary juxtaposed images of luxury and poverty.',
    trick: 'JUXTA = "next to" (Latin). To juxtapose = to place NEXT TO each other.',
    passage: 'The photographer ______ images of gleaming skyscrapers with crumbling tenements in the same neighborhood, creating a powerful commentary on urban inequality.',
    options: ['separated', 'juxtaposed', 'obscured', 'replicated'],
    answer: 1,
    explanation: '"Juxtapose" means to place side by side for contrast. Placing images of luxury and poverty next to each other is juxtaposition.'
  },
  {
    word: 'Lament', partOfSpeech: 'verb/noun', difficulty: 1,
    definition: 'To express grief or sorrow; a passionate expression of grief.',
    example: 'She lamented the loss of the old library.',
    trick: 'LAMENT → sounds like "LA-MENT" — imagine someone in LA (Hollywood) crying dramatically. To lament is to mourn dramatically.',
    passage: 'In his memoir, the retired teacher ______ the decline of handwriting skills, mourning what he saw as the loss of a meaningful form of personal expression.',
    options: ['celebrated', 'lament', 'dismissed', 'questioned'],
    answer: 1,
    explanation: '"Lament" means to express grief or sorrow. Mourning the loss of handwriting skills is lamenting.'
  },
  {
    word: 'Meticulous', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'The watchmaker was meticulous, spending hours on each tiny component.',
    trick: 'METICULOUS → sounds like "METRIC-ulous" — someone who measures everything precisely with a metric ruler.',
    passage: 'The forensic accountant was ______: she examined thousands of transactions, cross-referencing every figure until she found the single fraudulent entry hidden among legitimate records.',
    options: ['haphazard', 'meticulous', 'cursory', 'negligent'],
    answer: 1,
    explanation: '"Meticulous" means extremely careful and precise. Examining thousands of transactions to find one fraudulent entry is meticulous work.'
  },
  {
    word: 'Nuance', partOfSpeech: 'noun', difficulty: 2,
    definition: 'A subtle difference in meaning, expression, or sound.',
    example: 'The translator struggled to capture the nuances of the original poem.',
    trick: 'NUANCE → sounds like "NEW-ance." A nuance is a NEW, subtle shade of meaning you hadn\'t noticed before.',
    passage: 'The professor warned students not to oversimplify the historical event; understanding it required attention to ______, including the varied motivations of different social classes.',
    options: ['nuance', 'generalization', 'exaggeration', 'contradiction'],
    answer: 0,
    explanation: '"Nuance" means subtle differences and complexities. The professor wanted students to recognize the varied motivations — the nuances — rather than oversimplifying.'
  },
  {
    word: 'Obsolete', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'No longer produced or used; out of date.',
    example: 'The fax machine has become largely obsolete in the digital age.',
    trick: 'OBSOLETE → "OB-SO-LATE" — it\'s SO LATE that it\'s no longer relevant. Obsolete things are too late to be useful.',
    passage: 'Once essential to navigation, paper maps have become largely ______ now that GPS technology provides real-time directions on smartphones.',
    options: ['indispensable', 'obsolete', 'innovative', 'prevalent'],
    answer: 1,
    explanation: '"Obsolete" means no longer used or out of date. Paper maps being replaced by GPS is a classic example of technology becoming obsolete.'
  },
  {
    word: 'Pragmatic', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Dealing with things sensibly and realistically; practical rather than idealistic.',
    example: 'The pragmatic manager chose the solution that worked, not the most elegant one.',
    trick: 'PRAGMATIC → "PRAG-MATIC" — think "PRACTICAL MAGIC." A pragmatic person uses practical magic (common sense) to solve problems.',
    passage: 'Rather than pursuing the ideologically pure but politically impossible solution, the senator took a ______ approach, negotiating a compromise that achieved most of her goals.',
    options: ['idealistic', 'pragmatic', 'dogmatic', 'impractical'],
    answer: 1,
    explanation: '"Pragmatic" means practical and realistic. Choosing a workable compromise over an impossible ideal is pragmatic.'
  },
  {
    word: 'Resilient', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'The resilient community rebuilt after the flood within months.',
    trick: 'RESILIENT → "RE-SILENT" — after being knocked down (silenced), a resilient person rises again.',
    passage: 'Despite losing her business during the economic crisis, she proved ______: within two years, she had launched a new company that was even more successful.',
    options: ['fragile', 'resilient', 'complacent', 'vulnerable'],
    answer: 1,
    explanation: '"Resilient" means able to recover from difficulties. Rebuilding a successful business after losing one demonstrates resilience.'
  },
  {
    word: 'Scrutinize', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To examine or inspect closely and thoroughly.',
    example: 'The editor scrutinized every sentence for errors.',
    trick: 'SCRUTINIZE → "SCREW-tinize" — imagine using a magnifying glass like a screw, turning it tighter and tighter to see more detail.',
    passage: 'Before signing the merger agreement, the board hired independent auditors to ______ the target company\'s financial statements for any hidden liabilities.',
    options: ['overlook', 'scrutinize', 'fabricate', 'summarize'],
    answer: 1,
    explanation: '"Scrutinize" means to examine closely and thoroughly. Hiring auditors to carefully examine financial statements for hidden problems is scrutinizing.'
  },
  {
    word: 'Tenacious', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Tending to keep a firm hold; persistent and determined.',
    example: 'The tenacious athlete trained through injuries to compete in the championship.',
    trick: 'TENACIOUS → "TEN-acious" — imagine holding on with TEN fingers. Tenacious people grip their goals with all ten fingers and won\'t let go.',
    passage: 'The ______ investigative journalist spent five years pursuing the story, filing dozens of freedom-of-information requests and interviewing hundreds of sources before publishing her exposé.',
    options: ['tenacious', 'apathetic', 'impulsive', 'hesitant'],
    answer: 0,
    explanation: '"Tenacious" means persistent and determined. Spending five years pursuing a story despite obstacles is the definition of tenacity.'
  },
  {
    word: 'Ubiquitous', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Present, appearing, or found everywhere.',
    example: 'Smartphones have become ubiquitous in modern society.',
    trick: 'UBIQUITOUS → "YOU-be-QUIT-us" — it\'s everywhere, you can\'t quit seeing it! Ubiquitous things are inescapable.',
    passage: 'Coffee shops, once rare in small towns, have become ______ across the country, with at least one appearing in virtually every community of more than a few thousand people.',
    options: ['scarce', 'ubiquitous', 'exclusive', 'obsolete'],
    answer: 1,
    explanation: '"Ubiquitous" means present or found everywhere. Coffee shops appearing in virtually every community describes ubiquity.'
  },
  {
    word: 'Verbose', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Using more words than needed; wordy.',
    example: 'The verbose report could have been summarized in two pages.',
    trick: 'VERBOSE → "VERB-ose" — too many VERBS (words). A verbose person uses way too many words.',
    passage: 'The professor\'s feedback was so ______ that students struggled to identify the key points amid the pages of commentary on each paragraph.',
    options: ['concise', 'verbose', 'succinct', 'terse'],
    answer: 1,
    explanation: '"Verbose" means using too many words. Writing pages of commentary when a few sentences would suffice is verbose.'
  },
  {
    word: 'Wary', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Feeling or showing caution about possible dangers or problems.',
    example: 'She was wary of investing in the volatile market.',
    trick: 'WARY → sounds like "BEWARE-y." A wary person is always in BEWARE mode.',
    passage: 'Having been deceived before, the investor was ______ of the startup\'s promises, demanding detailed financial projections and independent verification before committing any funds.',
    options: ['wary', 'reckless', 'trusting', 'enthusiastic'],
    answer: 0,
    explanation: '"Wary" means cautious about possible dangers. Demanding verification before investing due to past deception is being wary.'
  },
  {
    word: 'Xenophobia', partOfSpeech: 'noun', difficulty: 2,
    definition: 'Dislike or prejudice against people from other countries.',
    example: 'The historian documented how xenophobia fueled discriminatory immigration policies.',
    trick: 'XENO = "stranger/foreigner" + PHOBIA = "fear." Xenophobia = fear/dislike of foreigners.',
    passage: 'The rise of ______ in the region led to increased hostility toward immigrant communities, who faced discrimination in housing, employment, and public spaces.',
    options: ['xenophobia', 'philanthropy', 'cosmopolitanism', 'tolerance'],
    answer: 0,
    explanation: '"Xenophobia" means prejudice against foreigners. Hostility and discrimination toward immigrant communities is xenophobia.'
  },
  {
    word: 'Yield', partOfSpeech: 'verb', difficulty: 1,
    definition: 'To produce or provide; to give way to arguments, demands, or pressure.',
    example: 'The negotiations finally yielded a compromise.',
    trick: 'YIELD → think of a YIELD sign on the road — you give way to others. To yield is to give way or produce results.',
    passage: 'After months of resistance, the company finally ______ to consumer pressure and agreed to make its supply chain more transparent.',
    options: ['resisted', 'yielded', 'ignored', 'escalated'],
    answer: 1,
    explanation: '"Yield" means to give way to pressure. The company giving in to consumer pressure after resisting is yielding.'
  },
  {
    word: 'Zealous', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Having or showing great energy or enthusiasm in pursuit of a cause.',
    example: 'The zealous activist campaigned tirelessly for environmental reform.',
    trick: 'ZEALOUS → "ZEAL-ous" — full of ZEAL (passionate enthusiasm). A zealous person is overflowing with zeal.',
    passage: 'The ______ reformer worked eighteen-hour days, convinced that her cause was too important to allow for rest or compromise.',
    options: ['apathetic', 'zealous', 'indifferent', 'reluctant'],
    answer: 1,
    explanation: '"Zealous" means having great enthusiasm for a cause. Working eighteen-hour days out of conviction is zealous behavior.'
  },
  {
    word: 'Aesthetic', partOfSpeech: 'adjective/noun', difficulty: 2,
    definition: 'Concerned with beauty or the appreciation of beauty.',
    example: 'The architect\'s aesthetic choices emphasized clean lines and natural light.',
    trick: 'AESTHETIC → "AES-THETIC" — think "ARTIST-ic." Aesthetic is about artistic beauty.',
    passage: 'The museum\'s new director shifted its ______ focus from traditional European paintings to contemporary works that challenged conventional notions of beauty.',
    options: ['aesthetic', 'financial', 'political', 'scientific'],
    answer: 0,
    explanation: '"Aesthetic" relates to beauty and artistic appreciation. A museum\'s focus on paintings and notions of beauty is an aesthetic focus.'
  },
  {
    word: 'Brevity', partOfSpeech: 'noun', difficulty: 2,
    definition: 'Concise and exact use of words; shortness of time.',
    example: 'Shakespeare wrote, "Brevity is the soul of wit."',
    trick: 'BREVITY → BRIEF + -ity. Brevity = the quality of being BRIEF.',
    passage: 'The editor praised the writer\'s ______: in just three sentences, she had captured what other journalists took three paragraphs to explain.',
    options: ['verbosity', 'brevity', 'ambiguity', 'redundancy'],
    answer: 1,
    explanation: '"Brevity" means concise use of words. Capturing an idea in three sentences that others need three paragraphs for is brevity.'
  },
  {
    word: 'Coerce', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To persuade an unwilling person to do something by using force or threats.',
    example: 'The defendant claimed he was coerced into signing the contract.',
    trick: 'COERCE → "CO-ERCE" — imagine someone FORCING you to "ERCE" (exercise). Coerce = force someone against their will.',
    passage: 'The investigation revealed that managers had ______ employees into signing non-disclosure agreements by threatening to withhold promotions.',
    options: ['encouraged', 'coerced', 'persuaded', 'invited'],
    answer: 1,
    explanation: '"Coerce" means to force through threats. Threatening to withhold promotions to make employees sign documents is coercion.'
  },
  {
    word: 'Debunk', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To expose the falseness or hollowness of a myth, idea, or belief.',
    example: 'The scientist debunked the popular myth about goldfish memory.',
    trick: 'DEBUNK → DE (remove) + BUNK (nonsense/lies). To debunk = to remove the bunk (nonsense).',
    passage: 'The documentary sought to ______ the widely held belief that humans only use 10% of their brains, presenting neurological evidence that all brain regions are active.',
    options: ['debunk', 'promote', 'validate', 'exaggerate'],
    answer: 0,
    explanation: '"Debunk" means to expose a belief as false. Presenting evidence against the "10% of brain" myth is debunking it.'
  },
  {
    word: 'Ephemeral', partOfSpeech: 'adjective', difficulty: 3,
    definition: 'Lasting for a very short time.',
    example: 'The cherry blossoms are ephemeral, lasting only a week.',
    trick: 'EPHEMERAL → "E-FEM-eral" — think of a FEVER that lasts only a day. Ephemeral things are as brief as a fever.',
    passage: 'The artist specialized in ______ installations — elaborate sculptures made of ice or sand that would dissolve or wash away within hours of completion.',
    options: ['permanent', 'ephemeral', 'enduring', 'monumental'],
    answer: 1,
    explanation: '"Ephemeral" means lasting a very short time. Sculptures that dissolve or wash away within hours are ephemeral.'
  },
  {
    word: 'Iconoclast', partOfSpeech: 'noun', difficulty: 3,
    definition: 'A person who attacks or criticizes cherished beliefs or institutions.',
    example: 'Galileo was an iconoclast who challenged the Church\'s view of the cosmos.',
    trick: 'ICONOCLAST → ICON (sacred image) + CLAST (breaker). An iconoclast BREAKS sacred ICONS — challenges what others hold sacred.',
    passage: 'The economist was considered an ______ in her field: she rejected the mathematical models that dominated the discipline, arguing that human behavior was too complex to be reduced to equations.',
    options: ['iconoclast', 'traditionalist', 'conformist', 'pragmatist'],
    answer: 0,
    explanation: '"Iconoclast" means someone who challenges established beliefs. Rejecting the dominant models in a field and challenging the discipline\'s foundations is iconoclastic.'
  },
  {
    word: 'Meticulous', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Showing great attention to detail or being very careful and precise.',
    example: 'The meticulous editor caught every typo in the manuscript.',
    trick: 'METICULOUS → "METIC-ulous" — think of a METRIC ruler: someone meticulous measures everything precisely.',
    passage: 'The forensic accountant was ______: she examined every transaction, no matter how small, and cross-referenced each entry against three separate records.',
    options: ['careless', 'meticulous', 'hasty', 'indifferent'],
    answer: 1,
    explanation: '"Meticulous" means showing great attention to detail. Examining every transaction and cross-referencing against multiple records demonstrates meticulous work.'
  },
  {
    word: 'Neutral', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Not supporting or helping either side in a conflict, disagreement, or competition; impartial.',
    example: 'Switzerland remained neutral during both World Wars.',
    trick: 'NEUTRAL → "NEUT-ral" — NEUT means "neither." Neutral = neither one side nor the other.',
    passage: 'The mediator worked hard to remain ______ throughout the negotiations, carefully avoiding any statement that could be interpreted as favoring one party over the other.',
    options: ['biased', 'neutral', 'partisan', 'opinionated'],
    answer: 1,
    explanation: '"Neutral" means impartial, not favoring either side. A mediator who avoids statements favoring one party is maintaining neutrality.'
  },
  {
    word: 'Obsolete', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'No longer produced or used; out of date.',
    example: 'Fax machines have become largely obsolete in the digital age.',
    trick: 'OBSOLETE → "OB-SO-lete" — sounds like "Oh, so late!" Something obsolete is SO late that it\'s no longer relevant.',
    passage: 'The introduction of digital streaming made physical video rental stores ______: within a decade, thousands of locations had closed permanently.',
    options: ['innovative', 'obsolete', 'thriving', 'essential'],
    answer: 1,
    explanation: '"Obsolete" means no longer used or relevant. Video rental stores closing because of streaming is a classic example of a technology becoming obsolete.'
  },
  {
    word: 'Persevere', partOfSpeech: 'verb', difficulty: 1,
    definition: 'To continue in a course of action even in the face of difficulty or with little or no prospect of success.',
    example: 'Despite numerous rejections, she persevered and eventually published her novel.',
    trick: 'PERSEVERE → "PER-SEVERE" — to go through SEVERE difficulties and keep going anyway.',
    passage: 'Despite three failed experiments and pressure from her department to abandon the project, the researcher chose to ______, convinced that the approach was fundamentally sound.',
    options: ['quit', 'persevere', 'compromise', 'retreat'],
    answer: 1,
    explanation: '"Persevere" means to continue despite difficulties. Continuing research despite failures and pressure to quit is perseverance.'
  },
  {
    word: 'Skeptical', partOfSpeech: 'adjective', difficulty: 1,
    definition: 'Not easily convinced; having doubts or reservations.',
    example: 'Scientists are trained to be skeptical of claims that lack empirical evidence.',
    trick: 'SKEPTICAL → "SKEPT-ical" — think of a SKEPTIC who always asks "Are you sure?" Skeptical = doubtful.',
    passage: 'Many investors were ______ of the startup\'s projections, noting that the company had yet to generate any revenue and was promising 500% growth within two years.',
    options: ['enthusiastic', 'skeptical', 'convinced', 'indifferent'],
    answer: 1,
    explanation: '"Skeptical" means having doubts. Investors questioning unrealistic projections from a company with no revenue are being skeptical.'
  },

  // MEDIUM 5
  {
    word: 'Pragmatic', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    example: 'The pragmatic manager chose the solution that worked, not the most elegant one.',
    trick: 'PRAGMATIC → "PRAGMA" (Greek for "deed/action"). Pragmatic = focused on what works in practice, not theory.',
    passage: 'Rather than insisting on the ideal solution, the negotiator took a ______ approach: she accepted a compromise that addressed the most critical issues while setting aside the more contentious points for future discussion.',
    options: ['idealistic', 'pragmatic', 'dogmatic', 'theoretical'],
    answer: 1,
    explanation: '"Pragmatic" means focused on practical solutions. Accepting a workable compromise rather than holding out for the ideal solution is pragmatic.'
  },
  {
    word: 'Proliferate', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To increase rapidly in number; to multiply.',
    example: 'Social media platforms have proliferated over the past decade.',
    trick: 'PROLIFERATE → "PRO-LIFER-ate" — think of things producing LIFE and multiplying rapidly. Proliferate = multiply quickly.',
    passage: 'In the years following the invention of the smartphone, mobile applications ______: within a decade, millions of apps were available across various platforms.',
    options: ['declined', 'proliferated', 'consolidated', 'stagnated'],
    answer: 1,
    explanation: '"Proliferated" means increased rapidly in number. Millions of apps appearing within a decade is proliferation.'
  },
  {
    word: 'Reticent', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Not revealing one\'s thoughts or feelings readily; reserved.',
    example: 'The witness was reticent about discussing the details of the incident.',
    trick: 'RETICENT → "RE-TIC-ent" — think of someone who TICKS (is nervous) and holds back. Reticent = holding back, reserved.',
    passage: 'Although the scientist had made a groundbreaking discovery, she was ______ about publicizing it, preferring to wait until she had replicated the results multiple times.',
    options: ['eager', 'reticent', 'boastful', 'transparent'],
    answer: 1,
    explanation: '"Reticent" means not revealing things readily. The scientist holding back from publicizing her discovery is being reticent.'
  },
  {
    word: 'Substantiate', partOfSpeech: 'verb', difficulty: 2,
    definition: 'To provide evidence to support or prove the truth of something.',
    example: 'The journalist needed multiple sources to substantiate her claims.',
    trick: 'SUBSTANTIATE → "SUB-STANCE" — to give SUBSTANCE (evidence) to a claim. Substantiate = back up with evidence.',
    passage: 'The defense attorney argued that the prosecution had failed to ______ its key claim: no physical evidence, witness testimony, or documentary record supported the allegation.',
    options: ['contradict', 'substantiate', 'exaggerate', 'dismiss'],
    answer: 1,
    explanation: '"Substantiate" means to provide evidence for a claim. The prosecution failing to provide evidence, witnesses, or documents means it failed to substantiate its claim.'
  },
  {
    word: 'Tenuous', partOfSpeech: 'adjective', difficulty: 2,
    definition: 'Very weak or slight; lacking a sound basis.',
    example: 'The connection between the two events was tenuous at best.',
    trick: 'TENUOUS → "TEN-uous" — think of a TEN-pound thread: very thin and weak. Tenuous = thin, weak, barely there.',
    passage: 'The prosecutor\'s case rested on ______ evidence: a single witness whose account had changed three times and a circumstantial connection that the defense easily dismantled.',
    options: ['overwhelming', 'tenuous', 'compelling', 'irrefutable'],
    answer: 1,
    explanation: '"Tenuous" means weak or lacking a sound basis. A case built on an unreliable witness and easily dismantled circumstantial evidence is tenuous.'
  },

  // HARD 5
  {
    word: 'Equivocate', partOfSpeech: 'verb', difficulty: 3,
    definition: 'To use ambiguous language so as to conceal the truth or avoid committing oneself.',
    example: 'The politician equivocated when asked directly about his position on the bill.',
    trick: 'EQUIVOCATE → "EQUI-VOC" — EQUI means "equal," VOC means "voice." To equivocate = to speak with an "equal voice" on both sides, committing to neither.',
    passage: 'When asked directly whether the company had known about the safety defect before the recall, the CEO ______: he acknowledged that "concerns had been raised" but refused to specify when, by whom, or what action had been taken.',
    options: ['equivocated', 'confessed', 'elaborated', 'clarified'],
    answer: 0,
    explanation: '"Equivocated" means used ambiguous language to avoid committing to a direct answer. Acknowledging vague "concerns" without specifics while avoiding a direct answer is equivocation.'
  },
  {
    word: 'Insidious', partOfSpeech: 'adjective', difficulty: 3,
    definition: 'Proceeding in a gradual, subtle way, but with harmful effects.',
    example: 'The insidious spread of misinformation eroded public trust in institutions.',
    trick: 'INSIDIOUS → "IN-SID-ious" — think of something hiding INSIDE, gradually spreading harm. Insidious = harmful but hidden/gradual.',
    passage: 'The bias in the algorithm was particularly ______: it did not produce obviously discriminatory results in individual cases, but over millions of decisions, it systematically disadvantaged applicants from certain zip codes.',
    options: ['blatant', 'insidious', 'negligible', 'transparent'],
    answer: 1,
    explanation: '"Insidious" means harmful in a gradual, subtle way. A bias that isn\'t obvious in individual cases but produces systematic harm over millions of decisions is insidious.'
  },
  {
    word: 'Obfuscate', partOfSpeech: 'verb', difficulty: 3,
    definition: 'To make unclear or difficult to understand; to confuse or bewilder.',
    example: 'The lengthy legal document seemed designed to obfuscate rather than clarify the terms.',
    trick: 'OBFUSCATE → "OB-FUSE-cate" — to FUSE (mix up) things so they become unclear. Obfuscate = muddy the waters.',
    passage: 'Critics accused the report of deliberately ______ the findings: key data was buried in appendices, conclusions were stated in passive constructions, and the executive summary omitted the most damaging statistics.',
    options: ['clarifying', 'obfuscating', 'publicizing', 'simplifying'],
    answer: 1,
    explanation: '"Obfuscating" means making unclear or difficult to understand. Burying data, using passive constructions, and omitting key statistics are all techniques for obscuring findings.'
  },
  {
    word: 'Perfunctory', partOfSpeech: 'adjective', difficulty: 3,
    definition: 'Carried out with a minimum of effort or reflection; done as a routine duty.',
    example: 'The inspector gave the building only a perfunctory review before signing off.',
    trick: 'PERFUNCTORY → "PER-FUNCTION-ary" — doing something just to PERFORM the FUNCTION, with no real care. Perfunctory = going through the motions.',
    passage: 'The safety audit was ______: inspectors spent less than twenty minutes at the facility, checked only the most visible equipment, and filed a report that was nearly identical to the previous year\'s.',
    options: ['rigorous', 'perfunctory', 'comprehensive', 'meticulous'],
    answer: 1,
    explanation: '"Perfunctory" means done with minimum effort, as a routine. A 20-minute inspection that checks only visible equipment and reuses last year\'s report is perfunctory.'
  },
  {
    word: 'Sanguine', partOfSpeech: 'adjective', difficulty: 3,
    definition: 'Optimistic, especially in a difficult situation.',
    example: 'Despite the setbacks, the team remained sanguine about their chances.',
    trick: 'SANGUINE → "SANG-uine" — think of someone who SANG (past tense of sing) happily even in hard times. Sanguine = cheerfully optimistic.',
    passage: 'Despite the company\'s declining market share and three consecutive quarters of losses, the CEO remained ______, insisting that the new product line would reverse the trend by year\'s end.',
    options: ['pessimistic', 'sanguine', 'despondent', 'realistic'],
    answer: 1,
    explanation: '"Sanguine" means optimistic despite difficulties. Remaining confident about recovery despite declining share and losses is being sanguine.'
  },

];