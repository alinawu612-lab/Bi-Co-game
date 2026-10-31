export type GameMode =
  | 'OPEN_WORLD'
  | 'MISSION_BRIEFING'
  | 'PLAYING_MISSION'
  | 'MISSION_COMPLETE';

export type MissionId = 1 | 2 | 3 | 4;

export interface MissionInfo {
  id: MissionId;
  title: string;
  subtitle: string;
  objective: string;
  worldX: number;
  worldY: number;
  stemSubject: string;
  backgroundTitle: string;
  backgroundParagraphs: string[];
  keyFormula: string;
  formulaExplanation: string;
  lightbulbPointers: string[]; // Helpful pointers ONLY, never full answers
  introQuote?: string;
  completionQuote?: string;
}

export interface Reagent {
  id: 'sweet_lime' | 'berry_compost';
  name: string;
  formula: string;
  type: 'ACID' | 'BASE';
  phShiftPerGram: number;
  description: string;
  color: string;
}

export interface SoilPlotLevel1 {
  id: number;
  name: string;
  xPercent: number;
  elevationRatio: number;
  initialPh: number;
  currentPh: number;
  targetPh: number;
  givenHPlusExponent?: number;
  expectedReagentId: 'sweet_lime' | 'berry_compost';
  expectedGrams: number;
  isTerraformed: boolean;
  quizQuestionText: string;
  pointerHint: string;
}

export interface CornPlotLevel2 {
  id: number;
  name: string;
  distanceMeters: number;
  elevationMeters: number;
  widthMeters: number;
  angleDegrees: number;
  cosTheta: number;
  sinTheta: number;
  windSpeed: number;
  flightTimeSeconds: number;
  initialVy: number;
  expectedVx0: number;
  expectedVelocity: number;
  isPlanted: boolean;
  stalkCount: number;
  quizPrompt: string;
  pointerHint: string;
}

export interface PenicillinStepLevel3 {
  id: number;
  name: string;
  stepTitle: string;
  formulaDisplay: string;
  questionPrompt: string;
  unitLabel: string;
  expectedAnswer: number;
  isCompleted: boolean;
  pointerHint: string;
}

export interface OwlEngineeringStepLevel4 {
  id: number;
  name: string;
  partLabel: string;
  formulaDisplay: string;
  questionPrompt: string;
  unitLabel: string;
  expectedAnswer: number;
  isCompleted: boolean;
  pointerHint: string;
}

export interface ActiveProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  windSpeed: number;
  gravity: number;
  trail: Array<{ x: number; y: number }>;
  active: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
}

export interface FloatingCallout {
  id: number;
  x: number;
  y: number;
  text: string;
  subtext?: string;
  color: string;
  life: number;
  maxLife: number;
}

export const MISSIONS: Record<MissionId, MissionInfo> = {
  1: {
    id: 1,
    title: 'Mission 1: Wake Up the Meadow',
    subtitle: 'Chemistry & Biology · Soil pH Balance',
    objective: 'Neutralize all 3 soil beds to their target pH so lush green grass sprouts.',
    worldX: 540,
    worldY: 440,
    stemSubject: 'Chemistry & Biology',
    backgroundTitle: 'Soil pH & Acid-Base Neutralization',
    backgroundParagraphs: [
      'The pH scale (0–14) measures H⁺ concentration: pH = -log₁₀[H⁺]. Neutral is 7.0, < 7 is acidic (H⁺), and > 7 is basic (OH⁻).',
      'Plants absorb root nutrients best around pH 6.5–7.0. Mix Base (+0.5 pH/g) into acidic soil or Acid (-0.5 pH/g) into basic soil.',
    ],
    keyFormula: 'pH = -log₁₀[H⁺]   |   Grams = |pH_target - pH_initial| ÷ 0.5',
    formulaExplanation: 'Find the pH difference |ΔpH| and divide by 0.5 pH per gram.',
    lightbulbPointers: [
      'Pointer 1: If starting pH is below target, choose Base to raise pH. If above target, choose Acid to lower pH.',
      'Pointer 2: Subtract starting pH from target pH, then divide that change by 0.5.',
      'Pointer 3: For [H⁺] = 10⁻ⁿ M, the logarithm rule gives pH = n.',
    ],
  },
  2: {
    id: 2,
    title: 'Mission 2: Start a Corn Farm',
    subtitle: 'Physics · 2D Projectile Motion',
    objective: 'Calculate exact launch speeds (v₀) for all 3 plots to grow cute wiggly corn!',
    worldX: 1280,
    worldY: 420,
    stemSubject: 'Physics (Kinematics)',
    backgroundTitle: 'Projectile Trajectory & Wind',
    backgroundParagraphs: [
      'A seed launched at speed v₀ and angle θ has horizontal speed v₀·cos(θ) and vertical speed v₀ᵧ = v₀·sin(θ).',
      'Gravity (g = 10 m/s²) pulls vertically while wind (v_wind) shifts horizontal speed: x = (v₀·cos(θ) + v_wind) · t.',
    ],
    keyFormula: 'x = (v₀·cos θ + v_wind) · t   |   t = (2·v₀ᵧ) ÷ g  (g = 10 m/s²)',
    formulaExplanation: 'Isolate v₀ by dividing distance x by flight time t, subtracting wind, and dividing by cos θ.',
    lightbulbPointers: [
      'Pointer 1: First find flight time t. On level ground, use t = (2 · v₀ᵧ) ÷ 10.',
      'Pointer 2: Divide horizontal distance x by time t to get (v₀·cos θ + v_wind).',
      'Pointer 3: Subtract v_wind from that value, then divide by cos θ to get v₀.',
    ],
  },
  3: {
    id: 3,
    title: 'Mission 3: Heal the Haverford Squirrel',
    subtitle: 'Bio-Chemistry · Synthesizing Penicillin',
    objective: 'Synthesize and dose penicillin for the injured Black Squirrel in the red Haverford hoodie.',
    worldX: 620,
    worldY: 790,
    stemSubject: 'Biology & Chemistry',
    backgroundTitle: 'Antibiotics, Bacterial Growth & Solution Dosing',
    backgroundParagraphs: [
      'Bacteria multiply exponentially by binary fission: N = N₀ · 2ⁿ (where n is the number of divisions).',
      'Penicillin (from Penicillium mold) blocks bacterial cell-wall synthesis. Solution concentration is C = Mass ÷ Volume, and medical dosage is Dose = Body Mass × Dose Rate.',
    ],
    keyFormula: 'N = N₀ · 2ⁿ   |   Mass m = C × V   |   Dose = Mass_body × Rate',
    formulaExplanation: 'Solve all 3 lab steps to culture, purify, and dose the squirrel’s antibiotic.',
    lightbulbPointers: [
      'Pointer 1 (Bacterial Count): Raise 2 to the power of n generations first (2ⁿ), then multiply by initial bacteria N₀.',
      'Pointer 2 (Solution Mass): Rearrange C = m ÷ V into m = C × V to find milligrams needed.',
      'Pointer 3 (Squirrel Dose): Multiply the squirrel’s body mass (kg) by the prescribed mg/kg rate.',
    ],
    introQuote: 'Ouch... my paw is infected! Can you synthesize penicillin for a Haverford squirrel?',
    completionQuote: 'okay, time bryndin ; D',
  },
  4: {
    id: 4,
    title: 'Mission 4: Build the Bryn Mawr Owl Home',
    subtitle: 'Physics & Engineering · Nest Architecture',
    objective: 'Use statics, truss geometry, and simple machines to build a home for the Bryn Mawr Owl.',
    worldX: 1360,
    worldY: 790,
    stemSubject: 'Engineering & Physics',
    backgroundTitle: 'Structural Equilibrium, Trusses & Simple Machines',
    backgroundParagraphs: [
      'Static Equilibrium (ΣF = 0) means upward support forces must equal total downward weight so a structure stays stable.',
      'Triangular roof trusses follow the Pythagorean Theorem (a² + b² = c²), and a pulley with Mechanical Advantage (MA) reduces effort force: F_effort = F_load ÷ MA.',
    ],
    keyFormula: 'ΣF_y = 0   |   a² + b² = c²   |   F_effort = F_load ÷ MA',
    formulaExplanation: 'Complete all 3 engineering stages to construct the wooden owl home.',
    lightbulbPointers: [
      'Pointer 1 (Support Brackets): Add the house weight and owl weight together for total downward force, then divide equally among the brackets.',
      'Pointer 2 (Roof Rafter): Square both legs a² and b², add them together, and take the square root √(a² + b²).',
      'Pointer 3 (Hoist Pulley): Divide the total load force F_load by the pulley’s Mechanical Advantage (MA).',
    ],
    introQuote: "I'm homeless, build me a home",
    completionQuote: "I have to go so the black squirrel doesn't eat all my food, bye!",
  },
};

export const REAGENTS: Reagent[] = [
  {
    id: 'sweet_lime',
    name: 'Sweet Lime Base',
    formula: 'Ca(OH)₂',
    type: 'BASE',
    phShiftPerGram: 0.5,
    description: 'Raises soil pH by +0.5 pH/g.',
    color: '#38bdf8',
  },
  {
    id: 'berry_compost',
    name: 'Berry Compost Acid',
    formula: 'Organic H⁺',
    type: 'ACID',
    phShiftPerGram: -0.5,
    description: 'Lowers soil pH by -0.5 pH/g.',
    color: '#f59e0b',
  },
];

export const INITIAL_LEVEL_1_PLOTS: SoilPlotLevel1[] = [
  {
    id: 1,
    name: 'Bed 1 (Acidic Clay)',
    xPercent: 0.15,
    elevationRatio: 0.68,
    initialPh: 4.5,
    currentPh: 4.5,
    targetPh: 7.0,
    expectedReagentId: 'sweet_lime',
    expectedGrams: 5,
    isTerraformed: false,
    quizQuestionText:
      'Bed 1 is pH 4.5 (Target: pH 7.0). Each gram shifts pH by 0.5. Pick the reagent and enter exact grams:',
    pointerHint: 'Pointer: Find ΔpH = 7.0 - 4.5, then divide by 0.5 pH/g. Choose Base to raise pH.',
  },
  {
    id: 2,
    name: 'Bed 2 (Alkaline Silt)',
    xPercent: 0.35,
    elevationRatio: 0.64,
    initialPh: 9.0,
    currentPh: 9.0,
    targetPh: 6.5,
    expectedReagentId: 'berry_compost',
    expectedGrams: 5,
    isTerraformed: false,
    quizQuestionText:
      'Bed 2 is pH 9.0 (Target: pH 6.5). Pick the reagent and calculate exact grams using |ΔpH| ÷ 0.5:',
    pointerHint: 'Pointer: Choose Acid to lower pH. Subtract target pH from starting pH, then divide by 0.5.',
  },
  {
    id: 3,
    name: 'Bed 3 (Molarity Bed)',
    xPercent: 0.55,
    elevationRatio: 0.68,
    initialPh: 5.0,
    currentPh: 5.0,
    targetPh: 7.0,
    givenHPlusExponent: 5,
    expectedReagentId: 'sweet_lime',
    expectedGrams: 4,
    isTerraformed: false,
    quizQuestionText:
      'Given [H⁺] = 10⁻⁵ mol/L. Find starting pH using pH = -log₁₀[H⁺], then calculate grams to reach pH 7.0:',
    pointerHint: 'Pointer: For [H⁺] = 10⁻ⁿ M, starting pH = n. Then divide (7.0 - starting pH) by 0.5.',
  },
];

export const INITIAL_LEVEL_2_PLOTS: CornPlotLevel2[] = [
  {
    id: 1,
    name: 'Plot 1 (40m Level)',
    distanceMeters: 40,
    elevationMeters: 0,
    widthMeters: 8,
    angleDegrees: 37,
    cosTheta: 0.8,
    sinTheta: 0.6,
    windSpeed: 4,
    flightTimeSeconds: 2,
    initialVy: 10,
    expectedVx0: 16,
    expectedVelocity: 20,
    isPlanted: false,
    stalkCount: 5,
    quizPrompt:
      'Distance x = 40 m, cos θ = 0.8, flight time t = 2.0 s, tailwind v_wind = +4 m/s. Solve x = (v₀·cos θ + v_wind)·t for v₀:',
    pointerHint: 'Pointer: Divide x by t first, subtract v_wind, then divide by cos θ (0.8).',
  },
  {
    id: 2,
    name: 'Plot 2 (60m Headwind)',
    distanceMeters: 60,
    elevationMeters: 0,
    widthMeters: 8,
    angleDegrees: 37,
    cosTheta: 0.8,
    sinTheta: 0.6,
    windSpeed: -4,
    flightTimeSeconds: 3,
    initialVy: 15,
    expectedVx0: 24,
    expectedVelocity: 30,
    isPlanted: false,
    stalkCount: 6,
    quizPrompt:
      'Distance x = 60 m, g = 10 m/s², v₀ᵧ = 15 m/s, cos θ = 0.8, headwind v_wind = -4 m/s. Find t = (2·v₀ᵧ)/g, then solve for v₀:',
    pointerHint: 'Pointer: First find t = (2 × 15) ÷ 10. Then solve 60 = (0.8·v₀ - 4) × t for v₀.',
  },
  {
    id: 3,
    name: 'Plot 3 (90m Terrace)',
    distanceMeters: 90,
    elevationMeters: 20,
    widthMeters: 8.5,
    angleDegrees: 37,
    cosTheta: 0.8,
    sinTheta: 0.6,
    windSpeed: 2.5,
    flightTimeSeconds: 4,
    initialVy: 25,
    expectedVx0: 20,
    expectedVelocity: 25,
    isPlanted: false,
    stalkCount: 6,
    quizPrompt:
      'Terrace x = 90 m, y = 20 m. Flight time is t = 4.0 s, tailwind v_wind = +2.5 m/s, cos θ = 0.8. Solve for v₀:',
    pointerHint: 'Pointer: Divide 90 m by 4.0 s, subtract the tailwind (+2.5), then divide by 0.8.',
  },
];

export const INITIAL_LEVEL_3_STEPS: PenicillinStepLevel3[] = [
  {
    id: 1,
    name: 'Step 1 · Bacterial Assay',
    stepTitle: 'Exponential Binary Fission',
    formulaDisplay: 'N = N₀ · 2ⁿ',
    questionPrompt:
      'The squirrel’s wound starts with N₀ = 100 bacteria and divides for n = 3 generations before treatment. How many bacteria N are present?',
    unitLabel: 'bacteria',
    expectedAnswer: 800,
    isCompleted: false,
    pointerHint: 'Pointer: Calculate 2³ (2 × 2 × 2) first, then multiply that result by N₀ (100).',
  },
  {
    id: 2,
    name: 'Step 2 · Broth Molarity',
    stepTitle: 'Penicillium Fermentation Broth',
    formulaDisplay: 'C = m ÷ V  ⇒  m = C × V',
    questionPrompt:
      'To prepare V = 2 L of purified Penicillin solution at a concentration of C = 25 mg/L, how many milligrams (m) of Penicillin must be extracted?',
    unitLabel: 'mg',
    expectedAnswer: 50,
    isCompleted: false,
    pointerHint: 'Pointer: Multiply the target concentration C (mg/L) by the volume V (L).',
  },
  {
    id: 3,
    name: 'Step 3 · Vet Dosage',
    stepTitle: 'Therapeutic Antibiotic Dose',
    formulaDisplay: 'Dose = Mass_body × Rate',
    questionPrompt:
      'The Haverford black squirrel weighs 0.5 kg and needs a safe antibiotic dose rate of 20 mg/kg. Calculate the exact dose in mg:',
    unitLabel: 'mg',
    expectedAnswer: 10,
    isCompleted: false,
    pointerHint: 'Pointer: Multiply the squirrel’s body mass (0.5 kg) by the dosage rate (20 mg/kg).',
  },
];

export const INITIAL_LEVEL_4_STEPS: OwlEngineeringStepLevel4[] = [
  {
    id: 1,
    name: 'Stage 1 · Support Base',
    partLabel: 'Foundation Brackets',
    formulaDisplay: 'ΣF_y = 0  ⇒  2·F_bracket = W_house + W_owl',
    questionPrompt:
      'The wooden owl house weighs 120 N downward and the Bryn Mawr owl weighs 30 N downward. If 2 identical brackets hold it up in static equilibrium, how many Newtons (N) must each bracket support?',
    unitLabel: 'N',
    expectedAnswer: 75,
    isCompleted: false,
    pointerHint: 'Pointer: Add both downward weights together first, then divide by the 2 support brackets.',
  },
  {
    id: 2,
    name: 'Stage 2 · Roof Truss',
    partLabel: 'Weatherproof Gable Roof',
    formulaDisplay: 'a² + b² = c²  ⇒  c = √(a² + b²)',
    questionPrompt:
      'The triangular roof truss has a horizontal half-base of a = 4 dm and a vertical rise of b = 3 dm. Using the Pythagorean Theorem, calculate the diagonal rafter length c:',
    unitLabel: 'dm',
    expectedAnswer: 5,
    isCompleted: false,
    pointerHint: 'Pointer: Compute a² + b² = 4² + 3², then take the square root of that sum.',
  },
  {
    id: 3,
    name: 'Stage 3 · Canopy Hoist',
    partLabel: 'Pulley Lift System',
    formulaDisplay: 'MA = F_load ÷ F_effort  ⇒  F_effort = F_load ÷ MA',
    questionPrompt:
      'To hoist the 150 N owl home into the oak tree using a block-and-tackle pulley with Mechanical Advantage MA = 3, what pull force F_effort (in N) is required?',
    unitLabel: 'N',
    expectedAnswer: 50,
    isCompleted: false,
    pointerHint: 'Pointer: Divide the total load force (150 N) by the Mechanical Advantage (3).',
  },
];
