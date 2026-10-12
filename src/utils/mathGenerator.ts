import { MathProblem, MathLevel, MathOpType } from '../types/math';

export const mathGenerator = {
  generateProblem(level: MathLevel, opType: MathOpType): MathProblem {
    // Choose operator (+ or -)
    let operator: '+' | '-';
    if (opType === 'addition') {
      operator = '+';
    } else if (opType === 'subtraction') {
      operator = '-';
    } else {
      operator = Math.random() < 0.5 ? '+' : '-';
    }

    let num1 = 0;
    let num2 = 0;
    let hintCategory = '';

    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    if (level === 1) {
      // NIVEL 1: Automatismos básicos hasta 20
      const pattern = randomInt(1, 4);

      if (operator === '+') {
        if (pattern === 1) {
          // Amigos del 10
          num1 = randomInt(1, 9);
          num2 = 10 - num1;
          hintCategory = 'Amigos del 10';
        } else if (pattern === 2) {
          // Dobles
          num1 = randomInt(2, 9);
          num2 = num1;
          hintCategory = 'Dobles';
        } else if (pattern === 3) {
          // Casi dobles (n + n+1)
          num1 = randomInt(3, 8);
          num2 = num1 + 1;
          hintCategory = 'Casi dobles';
        } else {
          // Sumas directas dentro de 20
          num1 = randomInt(5, 14);
          num2 = randomInt(2, 20 - num1);
          hintCategory = 'Suma básica';
        }
      } else {
        // Restas dentro de 20
        if (pattern === 1) {
          // Restas desde 10
          num1 = 10;
          num2 = randomInt(1, 9);
          hintCategory = 'Resta de 10';
        } else if (pattern === 2) {
          // Deshacer dobles
          const half = randomInt(2, 9);
          num1 = half * 2;
          num2 = half;
          hintCategory = 'Mitades';
        } else {
          // Resta general hasta 20
          num1 = randomInt(6, 20);
          num2 = randomInt(2, num1 - 1);
          hintCategory = 'Resta básica';
        }
      }
    } else if (level === 2) {
      // NIVEL 2: Hasta 100 (decenas y operaciones sin llevadas)
      const pattern = randomInt(1, 3);

      if (pattern === 1) {
        // Decenas completas (e.g. 40 + 30, 80 - 50)
        num1 = randomInt(1, 8) * 10;
        if (operator === '+') {
          const maxDec = Math.floor((100 - num1) / 10);
          num2 = randomInt(1, Math.max(1, maxDec)) * 10;
        } else {
          num2 = randomInt(1, Math.floor(num1 / 10)) * 10;
        }
        hintCategory = 'Decenas redondas';
      } else if (pattern === 2) {
        // Restar o sumar a decena redonda (e.g. 50 - 6, 70 + 8)
        num1 = randomInt(2, 9) * 10;
        num2 = randomInt(2, 9);
        hintCategory = 'Paso a decena';
      } else {
        // Dos cifras sin llevadas
        const d1 = randomInt(2, 6);
        const u1 = randomInt(2, 7);
        if (operator === '+') {
          const d2 = randomInt(1, 8 - d1);
          const u2 = randomInt(1, 9 - u1);
          num1 = d1 * 10 + u1;
          num2 = d2 * 10 + u2;
        } else {
          const d2 = randomInt(1, d1 - 1);
          const u2 = randomInt(1, u1);
          num1 = d1 * 10 + u1;
          num2 = d2 * 10 + u2;
        }
        hintCategory = 'Sin llevadas';
      }
    } else if (level === 3) {
      // NIVEL 3: Con llevadas hasta 100 y paso de decena
      const pattern = randomInt(1, 3);

      if (pattern === 1) {
        // Completar a 100 (e.g. 100 - 37)
        if (operator === '-') {
          num1 = 100;
          num2 = randomInt(15, 85);
          hintCategory = 'Amigos del 100';
        } else {
          num1 = randomInt(25, 75);
          num2 = randomInt(15, 95 - num1);
          // Forzar llevada en unidades
          if ((num1 % 10) + (num2 % 10) < 10) {
            num2 += 5;
          }
          hintCategory = 'Suma con llevada';
        }
      } else {
        // Sumas o restas de 2 cifras con cambio de decena
        num1 = randomInt(25, 85);
        if (operator === '+') {
          const maxNum2 = 98 - num1;
          num2 = randomInt(12, Math.max(13, maxNum2));
          // Asegurar que las unidades sumen >= 10 para entrenar la llevada
          if ((num1 % 10) + (num2 % 10) < 10) {
            num2 = (Math.floor(num2 / 10) * 10) + ((10 - (num1 % 10)) + randomInt(1, 4));
          }
          hintCategory = 'Paso de decena';
        } else {
          // Resta con llevada: unidades de num2 mayores que unidades de num1
          const d1 = randomInt(4, 9);
          const u1 = randomInt(1, 6);
          num1 = d1 * 10 + u1;

          const d2 = randomInt(1, d1 - 2);
          const u2 = randomInt(u1 + 2, 9);
          num2 = d2 * 10 + u2;
          hintCategory = 'Resta con llevada';
        }
      }
    } else {
      // NIVEL 4: Experto hasta 1000 y cálculo multidígito
      const pattern = randomInt(1, 3);

      if (pattern === 1) {
        // Restas de 1000 o 500
        const base = Math.random() < 0.5 ? 1000 : 500;
        if (operator === '-') {
          num1 = base;
          num2 = randomInt(25, base - 50);
          hintCategory = 'Resta de millar';
        } else {
          num1 = randomInt(150, 450);
          num2 = randomInt(150, 450);
          hintCategory = 'Suma de centenas';
        }
      } else if (pattern === 2) {
        // Centenas con decenas (e.g. 340 + 280, 720 - 350)
        num1 = randomInt(15, 60) * 10;
        if (operator === '+') {
          num2 = randomInt(10, 35) * 10;
        } else {
          num2 = randomInt(10, Math.floor(num1 / 10) - 2) * 10;
        }
        hintCategory = 'Cálculo de centenas';
      } else {
        // Números de 3 cifras dinámicos
        num1 = randomInt(150, 650);
        if (operator === '+') {
          num2 = randomInt(50, 300);
        } else {
          num2 = randomInt(50, num1 - 25);
        }
        hintCategory = 'Modo experto';
      }
    }

    // Safety checks
    if (operator === '-' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }

    const answer = operator === '+' ? num1 + num2 : num1 - num2;

    return {
      id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      num1,
      operator,
      num2,
      answer,
      hintCategory,
    };
  },

  generateBatch(count: number, level: MathLevel, opType: MathOpType): MathProblem[] {
    const problems: MathProblem[] = [];
    const signatures = new Set<string>();

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let problem = this.generateProblem(level, opType);
      let sig = `${problem.num1}${problem.operator}${problem.num2}`;

      // Avoid immediate duplicates
      while (signatures.has(sig) && attempts < 10) {
        problem = this.generateProblem(level, opType);
        sig = `${problem.num1}${problem.operator}${problem.num2}`;
        attempts++;
      }

      signatures.add(sig);
      problems.push(problem);
    }

    return problems;
  },
};
