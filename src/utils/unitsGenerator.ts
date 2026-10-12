import { UnitMagnitude, UnitLevel, UnitMagnitudeFilter, UnitProblem } from '../types/units';

// Helpers to format numbers cleanly (avoid floating point precision errors like 0.30000000000000004)
export const formatNumberClean = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Trim up to 6 decimal places, remove trailing zeros
  const fixed = num.toFixed(6);
  return fixed.replace(/\.?0+$/, '');
};

// Check if user answer matches expected
export const isAnswerCorrect = (userAns: string, expected: number): boolean => {
  if (!userAns) return false;
  // Normalize commas to dots and trim
  const normalized = userAns.trim().replace(',', '.');
  const parsed = parseFloat(normalized);
  if (isNaN(parsed)) return false;

  // Floating point comparison
  return Math.abs(parsed - expected) < 0.000001;
};

// Standard metric ladder prefixes and powers (base unit = 0)
const METRIC_PREFIXES: { symbol: string; exp: number; name: string }[] = [
  { symbol: 'k', exp: 3, name: 'kilo' },
  { symbol: 'h', exp: 2, name: 'hecto' },
  { symbol: 'da', exp: 1, name: 'deca' },
  { symbol: '', exp: 0, name: 'unidad' },
  { symbol: 'd', exp: -1, name: 'deci' },
  { symbol: 'c', exp: -2, name: 'centi' },
  { symbol: 'm', exp: -3, name: 'mili' },
];

export const generateUnitProblem = (
  level: UnitLevel,
  filter: UnitMagnitudeFilter
): UnitProblem => {
  // Determine available magnitudes based on level and filter
  let allowedMagnitudes: UnitMagnitude[] = [];

  if (filter !== 'all') {
    allowedMagnitudes = [filter];
  } else {
    switch (level) {
      case '1':
        allowedMagnitudes = ['length', 'mass', 'capacity', 'time'];
        break;
      case '2':
        allowedMagnitudes = ['length', 'mass', 'capacity'];
        break;
      case '3':
        allowedMagnitudes = ['area', 'volume', 'capacity'];
        break;
      case '4':
      default:
        allowedMagnitudes = ['length', 'mass', 'capacity', 'area', 'volume', 'time'];
        break;
    }
  }

  const selectedMagnitude = allowedMagnitudes[Math.floor(Math.random() * allowedMagnitudes.length)];

  switch (selectedMagnitude) {
    case 'length':
      return generateMetricProblem('length', 'm', level);
    case 'mass':
      return generateMassProblem(level);
    case 'capacity':
      return generateMetricProblem('capacity', 'l', level);
    case 'area':
      return generateAreaProblem(level);
    case 'volume':
      return generateVolumeProblem(level);
    case 'time':
      return generateTimeProblem(level);
  }
};

// --- Metric Linear generator (m, l) ---
const generateMetricProblem = (
  magnitude: 'length' | 'capacity',
  baseUnit: string,
  level: UnitLevel
): UnitProblem => {
  let fromP = METRIC_PREFIXES[0];
  let toP = METRIC_PREFIXES[3];

  if (level === '1') {
    // Level 1: Common friendly pairs (km to m, m to cm, cm to mm, l to ml, etc.)
    const commonPairs = [
      { from: 'k', to: '' },
      { from: '', to: 'c' },
      { from: 'c', to: 'm' },
      { from: '', to: 'm' },
      { from: '', to: 'k' },
      { from: 'c', to: '' },
      { from: 'm', to: 'c' },
    ];
    const pair = commonPairs[Math.floor(Math.random() * commonPairs.length)];
    fromP = METRIC_PREFIXES.find(p => p.symbol === pair.from)!;
    toP = METRIC_PREFIXES.find(p => p.symbol === pair.to)!;
  } else {
    // Level 2, 3, 4: Any prefixes with 1-4 step distance
    const fromIdx = Math.floor(Math.random() * METRIC_PREFIXES.length);
    let toIdx = Math.floor(Math.random() * METRIC_PREFIXES.length);
    while (toIdx === fromIdx || Math.abs(toIdx - fromIdx) > 4) {
      toIdx = Math.floor(Math.random() * METRIC_PREFIXES.length);
    }
    fromP = METRIC_PREFIXES[fromIdx];
    toP = METRIC_PREFIXES[toIdx];
  }

  const steps = fromP.exp - toP.exp; // positive = going down (multiplying), negative = going up (dividing)
  const factor = Math.pow(10, steps);

  // Generate a clean fromValue
  let fromValue = 1;
  if (steps > 0) {
    // Multiplying
    const values = level === '1' ? [1, 2, 3, 4, 5, 0.5, 1.5, 2.5] : [1, 2, 3.5, 4.2, 0.8, 15, 24, 0.05, 7.5];
    fromValue = values[Math.floor(Math.random() * values.length)];
  } else {
    // Dividing: pick a number that divides cleanly
    const baseMult = Math.pow(10, Math.abs(steps));
    const multipliers = level === '1' ? [1, 2, 3, 4, 5, 1.5, 2.5] : [1, 2, 3.5, 12, 45, 0.5, 250];
    const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    fromValue = Number((mult * baseMult).toFixed(4));
    // Sometimes allow a smaller number to produce a small decimal (e.g. 50 cm = 0.5 m)
    if (Math.random() < 0.4) {
      fromValue = [25, 50, 75, 120, 8, 4][Math.floor(Math.random() * 6)];
    }
  }

  const expectedAnswer = Number((fromValue * factor).toFixed(6));
  const fromUnit = `${fromP.symbol}${baseUnit}`;
  const toUnit = `${toP.symbol}${baseUnit}`;

  const hint = steps > 0
    ? `De ${fromUnit} a ${toUnit} se bajan ${steps} escalones: multiplica por 10${'0'.repeat(steps - 1)} (corre la coma ${steps} a la derecha 👉).`
    : `De ${fromUnit} a ${toUnit} se suben ${Math.abs(steps)} escalones: divide entre 10${'0'.repeat(Math.abs(steps) - 1)} (corre la coma ${Math.abs(steps)} a la izquierda 👈).`;

  return {
    id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    magnitude: magnitude === 'length' ? 'length' : 'capacity',
    fromValue,
    fromUnit,
    toUnit,
    expectedAnswer,
    formattedExpected: formatNumberClean(expectedAnswer),
    hintExplanation: hint,
  };
};

// --- Mass generator (includes tonne 't') ---
const generateMassProblem = (level: UnitLevel): UnitProblem => {
  // Check if we use tonne (t)
  const useTonne = (level === '1' || level === '4') && Math.random() < 0.25;

  if (useTonne) {
    const toKg = Math.random() < 0.5;
    if (toKg) {
      const fromVal = [1, 2, 3, 4, 0.5, 1.5, 2.5, 3.8][Math.floor(Math.random() * 8)];
      const expected = fromVal * 1000;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'mass',
        fromValue: fromVal,
        fromUnit: 't',
        toUnit: 'kg',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: '1 tonelada (t) equivale exactamente a 1000 kg (multiplica por 1000).',
      };
    } else {
      const fromVal = [1000, 2000, 3000, 500, 1500, 2500, 4000][Math.floor(Math.random() * 7)];
      const expected = fromVal / 1000;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'mass',
        fromValue: fromVal,
        fromUnit: 'kg',
        toUnit: 't',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: 'De kg a tonelada (t) se divide entre 1000 (1000 kg = 1 t).',
      };
    }
  }

  return generateMetricProblem('mass' as unknown as 'length', 'g', level);
};

// --- Area generator (m²) ---
const generateAreaProblem = (level: UnitLevel): UnitProblem => {
  // Prefixes: mm², cm², dm², m², dam², hm² (ha), km²
  const areaUnits = [
    { symbol: 'km²', step: 3 },
    { symbol: 'hm² (ha)', step: 2 },
    { symbol: 'm²', step: 0 },
    { symbol: 'dm²', step: -1 },
    { symbol: 'cm²', step: -2 },
    { symbol: 'mm²', step: -3 },
  ];

  // Pick adjacent or 2-step jump
  const fromIdx = Math.floor(Math.random() * areaUnits.length);
  let toIdx = Math.floor(Math.random() * areaUnits.length);
  while (toIdx === fromIdx || Math.abs(areaUnits[fromIdx].step - areaUnits[toIdx].step) > 2) {
    toIdx = Math.floor(Math.random() * areaUnits.length);
  }

  const fromU = areaUnits[fromIdx];
  const toU = areaUnits[toIdx];
  const stepDiff = fromU.step - toU.step; // each step is factor 100!
  const factor = Math.pow(100, stepDiff);

  let fromValue = 1;
  if (stepDiff > 0) {
    // Multiplying by 100 or 10000
    const vals = level === '4' ? [2, 3.5, 0.8, 12, 0.05, 4.2] : [1, 2, 3, 4, 5, 0.5, 1.5, 2.5];
    fromValue = vals[Math.floor(Math.random() * vals.length)];
  } else {
    // Dividing by 100 or 10000
    const mults = [100, 200, 300, 500, 1200, 2500, 50, 400];
    fromValue = mults[Math.floor(Math.random() * mults.length)];
  }

  const expectedAnswer = Number((fromValue * factor).toFixed(6));
  const numZeros = Math.abs(stepDiff) * 2;
  const hint = stepDiff > 0
    ? `En superficie (m²), cada escalón son 2 ceros (×100). Bajas ${stepDiff} escalón(es): multiplica por ${Math.pow(10, numZeros)} 👉.`
    : `En superficie (m²), cada escalón son 2 ceros (÷100). Subes ${Math.abs(stepDiff)} escalón(es): divide entre ${Math.pow(10, numZeros)} 👈.`;

  return {
    id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    magnitude: 'area',
    fromValue,
    fromUnit: fromU.symbol,
    toUnit: toU.symbol,
    expectedAnswer,
    formattedExpected: formatNumberClean(expectedAnswer),
    hintExplanation: hint,
  };
};

// --- Volume generator (m³) with dm³ <-> l bridge ---
const generateVolumeProblem = (_level: UnitLevel): UnitProblem => {
  // Frequently test the golden bridges: 1 dm³ = 1 l, 1 m³ = 1000 l, 1 cm³ = 1 ml
  const testEquivalence = Math.random() < 0.45;

  if (testEquivalence) {
    const eqPairs = [
      { from: 'dm³', to: 'l', factor: 1, text: '¡Regla de oro escolar! 1 dm³ equivale exactamente a 1 litro (l).' },
      { from: 'l', to: 'dm³', factor: 1, text: '¡Regla de oro! 1 litro (l) es exactamente igual a 1 dm³.' },
      { from: 'cm³', to: 'ml', factor: 1, text: '1 cm³ equivale a 1 mililitro (ml).' },
      { from: 'ml', to: 'cm³', factor: 1, text: '1 ml equivale a 1 centímetro cúbico (cm³).' },
      { from: 'm³', to: 'l', factor: 1000, text: '1 metro cúbico (m³) son 1000 litros (multiplica por 1000).' },
      { from: 'l', to: 'm³', factor: 0.001, text: '1000 litros equivalen a 1 m³ (divide entre 1000).' },
    ];
    const eq = eqPairs[Math.floor(Math.random() * eqPairs.length)];
    let fromVal = 1;
    if (eq.factor === 1) {
      fromVal = [2, 3, 5, 8, 12, 0.5, 2.5, 10][Math.floor(Math.random() * 8)];
    } else if (eq.factor === 1000) {
      fromVal = [1, 2, 3, 0.5, 1.5, 2.5, 4][Math.floor(Math.random() * 7)];
    } else {
      fromVal = [1000, 2000, 3000, 500, 1500, 5000][Math.floor(Math.random() * 6)];
    }

    const expected = Number((fromVal * eq.factor).toFixed(6));
    return {
      id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      magnitude: 'volume',
      fromValue: fromVal,
      fromUnit: eq.from,
      toUnit: eq.to,
      expectedAnswer: expected,
      formattedExpected: formatNumberClean(expected),
      hintExplanation: eq.text,
    };
  }

  // Pure volume ladder: m³, dm³, cm³ (step diff 1)
  const volUnits = [
    { symbol: 'm³', step: 0 },
    { symbol: 'dm³', step: -1 },
    { symbol: 'cm³', step: -2 },
  ];

  const fromIdx = Math.floor(Math.random() * volUnits.length);
  let toIdx = Math.floor(Math.random() * volUnits.length);
  while (toIdx === fromIdx) {
    toIdx = Math.floor(Math.random() * volUnits.length);
  }

  const fromU = volUnits[fromIdx];
  const toU = volUnits[toIdx];
  const stepDiff = fromU.step - toU.step;
  const factor = Math.pow(1000, stepDiff);

  let fromVal = 1;
  if (stepDiff > 0) {
    fromVal = [1, 2, 3, 4, 0.5, 1.5, 2.5][Math.floor(Math.random() * 7)];
  } else {
    fromVal = [1000, 2000, 3000, 500, 1500, 4000][Math.floor(Math.random() * 6)];
  }

  const expected = Number((fromVal * factor).toFixed(6));
  const hint = stepDiff > 0
    ? `En volumen (m³), cada escalón son 3 ceros (×1000). Bajas ${stepDiff} escalón: multiplica por 1000 👉.`
    : `En volumen (m³), cada escalón son 3 ceros (÷1000). Subes ${Math.abs(stepDiff)} escalón: divide entre 1000 👈.`;

  return {
    id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    magnitude: 'volume',
    fromValue: fromVal,
    fromUnit: fromU.symbol,
    toUnit: toU.symbol,
    expectedAnswer: expected,
    formattedExpected: formatNumberClean(expected),
    hintExplanation: hint,
  };
};

// --- Time generator ---
const generateTimeProblem = (level: UnitLevel): UnitProblem => {
  // Pairs: h <-> min, min <-> s, d <-> h, h <-> s
  let type: 'h_to_min' | 'min_to_h' | 'min_to_s' | 's_to_min' | 'd_to_h' | 'h_to_d' | 'h_to_s';

  if (level === '1') {
    const types: ('h_to_min' | 'min_to_h' | 'min_to_s' | 's_to_min')[] = ['h_to_min', 'min_to_h', 'min_to_s', 's_to_min'];
    type = types[Math.floor(Math.random() * types.length)];
  } else {
    const types: ('h_to_min' | 'min_to_h' | 'min_to_s' | 's_to_min' | 'd_to_h' | 'h_to_d' | 'h_to_s')[] = [
      'h_to_min', 'min_to_h', 'min_to_s', 's_to_min', 'd_to_h', 'h_to_d', 'h_to_s'
    ];
    type = types[Math.floor(Math.random() * types.length)];
  }

  switch (type) {
    case 'h_to_min': {
      const vals = [1, 2, 3, 4, 5, 0.5, 1.5, 2.5, 0.25, 0.75];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal * 60;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'h',
        toUnit: 'min',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: '1 hora tiene 60 minutos (multiplica por 60).',
      };
    }
    case 'min_to_h': {
      const vals = [60, 120, 180, 240, 30, 90, 150, 15, 45];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal / 60;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'min',
        toUnit: 'h',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: 'Para pasar de minutos a horas, divide entre 60 (60 min = 1 h).',
      };
    }
    case 'min_to_s': {
      const vals = [1, 2, 3, 4, 5, 0.5, 1.5, 2.5, 10];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal * 60;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'min',
        toUnit: 's',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: '1 minuto tiene 60 segundos (multiplica por 60).',
      };
    }
    case 's_to_min': {
      const vals = [60, 120, 180, 240, 300, 30, 90, 150];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal / 60;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 's',
        toUnit: 'min',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: 'Para pasar de segundos a minutos, divide entre 60 (60 s = 1 min).',
      };
    }
    case 'd_to_h': {
      const vals = [1, 2, 3, 0.5, 1.5, 2.5, 4];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal * 24;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'días',
        toUnit: 'h',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: '1 día tiene 24 horas (multiplica por 24).',
      };
    }
    case 'h_to_d': {
      const vals = [24, 48, 72, 12, 36, 96];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal / 24;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'h',
        toUnit: 'días',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: 'Para pasar de horas a días, divide entre 24 (24 h = 1 día).',
      };
    }
    case 'h_to_s': {
      const vals = [1, 2, 0.5, 1.5];
      const fromVal = vals[Math.floor(Math.random() * vals.length)];
      const expected = fromVal * 3600;
      return {
        id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        magnitude: 'time',
        fromValue: fromVal,
        fromUnit: 'h',
        toUnit: 's',
        expectedAnswer: expected,
        formattedExpected: formatNumberClean(expected),
        hintExplanation: '1 hora tiene 3600 segundos (60 × 60, multiplica por 3600).',
      };
    }
  }
};
