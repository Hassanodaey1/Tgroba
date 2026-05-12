/* ═══════════ QUESTIONS.JS ═══════════ */
/* منطق توليد الأسئلة وكل ما يتعلق بأنواع المسائل */

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

function getCatStatsKey(op) {
    const map = {
        add: 'addition', sub: 'subtraction', mul: 'multiplication', div: 'division', mix: 'addition',
        table: 'table', percent: 'percentage', fraction: 'division', power: 'algebra', sqrt: 'squareroot',
        equation: 'algebra', sequence: 'puzzles', algebra: 'algebra', word: 'wordproblems',
        geometry: 'geometry', advanced: 'algebra', laws: 'mathlaws'
    };
    return map[op] || 'addition';
}

function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function generateAgeAdaptiveQuestion(op, diff, age) {
    if (age <= 6) return generateKidQuestion(op);
    else if (age <= 12) return generateJuniorQuestion(op, diff);
    else return genQ(op, diff);
}

function generateKidQuestion(op) {
    const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    switch (op) {
        case 'add': {
            let a = r(0, 5), b = r(0, 5);
            return { text: `${a}+${b}=؟`, answer: a + b, explanation: `نجمع ${a} و ${b} = ${a + b}`,
                catKey: 'addition', choices: shuffle([a + b, a + b + 1, a + b - 1, a + b + 2]) };
        }
        case 'sub': {
            let a = r(2, 6), b = r(1, a);
            return { text: `${a}-${b}=؟`, answer: a - b, explanation: `ننقص ${b} من ${a} = ${a - b}`,
                catKey: 'subtraction', choices: shuffle([a - b, a - b + 1, a - b - 1, a - b + 2]) };
        }
        case 'mul': {
            let a = r(1, 3), b = r(1, 3);
            return { text: `${a}×${b}=؟`, answer: a * b, explanation: `${a} مجموعات من ${b} = ${a * b}`,
                catKey: 'multiplication', choices: shuffle([a * b, a * b + 1, a * b + 2, a * b - 1]) };
        }
        default:
            return genQ('add', 'easy');
    }
}

function generateJuniorQuestion(op, diff) {
    switch (op) {
        case 'add': {
            let a = rnd(10, 30), b = rnd(10, 30);
            return { text: `${a}+${b}=؟`, answer: a + b, explanation: `${a}+${b}=${a + b}`,
                catKey: 'addition', choices: shuffle([a + b, a + b + 5, a + b - 3, a + b + 8]) };
        }
        case 'sub': {
            let a = rnd(20, 50), b = rnd(5, a);
            return { text: `${a}-${b}=؟`, answer: a - b, explanation: `${a}-${b}=${a - b}`,
                catKey: 'subtraction', choices: shuffle([a - b, a - b + 4, a - b - 2, a - b + 7]) };
        }
        default:
            return genQ(op, diff);
    }
}

/* ═══════════ QUESTION GENERATOR MAIN ═══════════ */
function genQ(op, diff, customTable = null) {
    if (op === 'table' && customTable) {
        const f = rnd(1, 12);
        const ans = customTable * f;
        const text = `${customTable} × ${f}`;
        const hint = 'ما حاصل الضرب؟';
        const explanation = `${customTable} × ${f} = ${ans}`;
        const choices = shuffle([ans, ans + customTable, ans - customTable, ans + 1]);
        return { text, hint, answer: ans, choices, explanation, catKey: 'table' };
    }

    if (op === 'advanced') {
        const advancedPool = ['power', 'sqrt', 'equation_simple', 'fraction_add', 'percent', 'sequence',
            'algebra', 'log_simple', 'trig_simple', 'area_circle'];
        let ch = advancedPool[rnd(0, advancedPool.length - 1)];
        let a, b, ans, text, hint, explanation = '';

        if (ch === 'power') {
            a = rnd(2, 6); b = rnd(2, 4); ans = Math.pow(a, b);
            text = `${a}^${b}`; hint = `ما قيمة ${a} مرفوعاً للأس ${b}؟`;
            explanation = `${a}^${b} = ${ans}`;
        } else if (ch === 'sqrt') {
            const sq = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            a = sq[rnd(0, sq.length - 1)]; ans = Math.sqrt(a);
            text = `√${a}`; hint = 'ما الجذر التربيعي؟';
            explanation = `√${a} = ${ans}`;
        } else if (ch === 'equation_simple') {
            a = rnd(5, 20); b = rnd(a + 1, a + 30); ans = b - a;
            text = `س + ${a} = ${b}`; hint = 'ما قيمة س؟';
            explanation = `س = ${b} - ${a} = ${ans}`;
        } else if (ch === 'fraction_add') {
            let c = rnd(2, 8), a2 = rnd(1, c - 1), b2 = rnd(1, c - 1);
            ans = a2 + b2; text = `${a2}/${c} + ${b2}/${c}`;
            hint = 'اجمع الكسور (المقامات متساوية)';
            explanation = `${a2}/${c} + ${b2}/${c} = ${ans}/${c}`;
        } else if (ch === 'percent') {
            let pct = [10, 20, 25, 50][rnd(0, 3)];
            a = rnd(1, 20) * 10; ans = Math.round(a * pct / 100);
            text = `${pct}% من ${a}`; hint = 'احسب النسبة المئوية';
            explanation = `${a} × ${pct}% = ${ans}`;
        } else if (ch === 'sequence') {
            a = rnd(1, 10); b = rnd(2, 8);
            text = `${a}, ${a + b}, ${a + 2 * b}, ?`; ans = a + 3 * b;
            hint = 'ما الرقم التالي في المتتالية؟';
            explanation = `الفرق = ${b}، الرقم التالي = ${ans}`;
        } else if (ch === 'log_simple') {
            a = rnd(2, 4); ans = a; text = `log₁₀(10^${a})`;
            hint = `ما قيمة اللوغاريتم؟`;
            explanation = `log₁₀(10^${a}) = ${a}`;
        } else if (ch === 'trig_simple') {
            let degs = [0, 30, 45, 60, 90];
            let deg = degs[rnd(0, degs.length - 1)];
            let val = Math.round(Math.sin(deg * Math.PI / 180) * 10) / 10;
            ans = val; text = `جا(${deg}°)`;
            hint = `ما قيمة جيب الزاوية ${deg}°؟`;
            explanation = `جا(${deg}°) = ${val}`;
        } else if (ch === 'area_circle') {
            let r = rnd(3, 8); ans = Math.round(Math.PI * r * r);
            text = `مساحة دائرة نصف قطرها ${r}`; hint = 'استخدم π≈3.14';
            explanation = `المساحة = π × ${r}² = ${ans}`;
        } else {
            a = rnd(2, 8); ans = rnd(2, 12); b = 2 * ans + a;
            text = `2س + ${a} = ${b}`; hint = 'ما قيمة س؟';
            explanation = `س = (${b} - ${a})/2 = ${ans}`;
        }
        let choices = shuffle([ans, ans + 1, ans - 1, ans + 2]);
        return { text, hint, answer: ans, choices, explanation, catKey: 'algebra' };
    }

    if (op === 'laws') {
        const lawQ = [
            { text: 'ما ناتج 3 × (4 + 5) وفق قانون التوزيع؟', ans: 27, explanation: '3×4 + 3×5 = 12+15=27' },
            { text: 'ما قيمة 5⁰؟', ans: 1, explanation: 'أي عدد غير صفري مرفوع للأس صفر = 1' },
            { text: 'ما مساحة مربع طول ضلعه 7؟', ans: 49, explanation: 'المساحة = الضلع² = 49' },
            { text: 'ما محيط دائرة نصف قطرها 5 (π≈3.14)؟', ans: 31.4, explanation: 'المحيط = 2×π×نق = 2×3.14×5 = 31.4' },
            { text: 'جذر 144 = ؟', ans: 12, explanation: '12² = 144' },
            { text: 'إذا كان س + 5 = 12، فما قيمة س؟', ans: 7, explanation: 'س = 12-5 = 7' },
            { text: 'قانون الجمع التبادلي: 8 + 3 = 3 + ...؟', ans: 8, explanation: '8+3 = 3+8' },
            { text: 'ما ناتج (-3) × (-4)؟', ans: 12, explanation: 'ضرب عددين سالبين يعطي موجب' },
            { text: 'إذا كانت مساحة المستطيل 20 وطوله 5، فما عرضه؟', ans: 4, explanation: 'العرض = المساحة/الطول = 4' },
            { text: 'ما قيمة 2³ × 2⁴؟', ans: 128, explanation: '2⁷ = 128' },
            { text: 'ما متوسط الأعداد 4, 8, 12؟', ans: 8, explanation: '(4+8+12)/3 = 24/3=8' },
            { text: 'حل المعادلة: 2س = 16', ans: 8, explanation: 'س = 16/2 = 8' },
            { text: 'إذا كان ثمن 5 أقلام 15 ديناراً، فثمن القلم الواحد؟', ans: 3, explanation: '15/5 = 3' },
            { text: 'ناتج (1/2) ÷ (1/4) = ؟', ans: 2, explanation: '(1/2)×4 = 2' },
            { text: 'ما 25% من 80؟', ans: 20, explanation: '80×0.25=20' },
            { text: 'قيمة 2⁵ = ؟', ans: 32, explanation: '2×2×2×2×2=32' },
            { text: 'ما الجذر التكعيبي لـ 27؟', ans: 3, explanation: '3³=27' },
        ];
        let q = lawQ[rnd(0, lawQ.length - 1)];
        let choices = shuffle([q.ans, q.ans + 1, q.ans - 1, q.ans + 2]);
        return { text: q.text, hint: 'تطبيق قانون رياضي', answer: q.ans, choices, explanation: q.explanation, catKey: 'mathlaws' };
    }

    let actualDiff = diff;
    if (!actualDiff || actualDiff === 'user') actualDiff = getDifficultyByLevel();
    const ranges = {
        easy:   { small: [1, 10],    mid: [1, 15],   mul: [2, 9],   times: [2, 9] },
        medium: { small: [10, 50],   mid: [5, 30],   mul: [2, 15],  times: [2, 12] },
        hard:   { small: [50, 500],  mid: [10, 99],  mul: [3, 25],  times: [3, 20] },
        genius: { small: [100, 9999],mid: [10, 999], mul: [5, 50],  times: [5, 30] }
    };
    const r = ranges[actualDiff] || ranges.easy;
    const ops = ['add', 'sub', 'mul', 'div'];
    let ch = op;
    if (op === 'mix') {
        if (actualDiff === 'easy') ch = ops[rnd(0, 3)];
        else if (actualDiff === 'medium') {
            const pool = ['add', 'sub', 'mul', 'div', 'percent', 'fraction_simple', 'word_add', 'word_mul', 'equation_simple'];
            ch = pool[rnd(0, pool.length - 1)];
        } else if (actualDiff === 'hard') {
            const pool = ['add', 'sub', 'mul', 'div', 'percent', 'fraction_add', 'power', 'sqrt', 'word_hard', 'equation_simple', 'sequence'];
            ch = pool[rnd(0, pool.length - 1)];
        } else {
            const pool = ['add', 'sub', 'mul', 'div', 'percent', 'fraction_mul', 'power', 'sqrt', 'word_genius', 'equation_quad', 'sequence', 'algebra', 'log_simple'];
            ch = pool[rnd(0, pool.length - 1)];
        }
    }

    let a, b, ans, text, hint, explanation = '';

    if (ch === 'add') {
        a = rnd(r.small[0], r.small[1]); b = rnd(r.small[0], r.small[1]); ans = a + b;
        text = `${a} + ${b}`; hint = 'ما مجموع العددين؟'; explanation = `${a} + ${b} = ${ans}`;
    } else if (ch === 'sub') {
        a = rnd(r.small[0], r.small[1]); b = rnd(r.small[0], r.small[1]);
        if (a < b) [a, b] = [b, a]; ans = a - b;
        text = `${a} − ${b}`; hint = 'ما الفرق بين العددين؟'; explanation = `${a} - ${b} = ${ans}`;
    } else if (ch === 'mul') {
        a = rnd(r.times[0], r.times[1]); b = rnd(r.times[0], r.times[1]); ans = a * b;
        text = `${a} × ${b}`; hint = 'ما حاصل الضرب؟'; explanation = `${a} × ${b} = ${ans}`;
    } else if (ch === 'div') {
        b = rnd(r.times[0], r.times[1]); ans = rnd(1, r.times[1]); a = b * ans;
        text = `${a} ÷ ${b}`; hint = 'ما حاصل القسمة؟'; explanation = `${a} ÷ ${b} = ${ans}`;
    } else if (ch === 'percent') {
        const pcts = [10, 20, 25, 50, 75]; const pct = pcts[rnd(0, pcts.length - 1)];
        a = rnd(1, 20) * 10; ans = Math.round(a * pct / 100);
        text = `${pct}% من ${a}`; hint = 'احسب النسبة المئوية'; explanation = `${a} × ${pct}% = ${ans}`;
    } else if (ch === 'power') {
        a = rnd(2, 10); b = rnd(2, 3); ans = Math.pow(a, b);
        text = `${a}^${b}`; hint = `ما قيمة ${a} مرفوعاً للأس ${b}؟`; explanation = `${a}^${b} = ${ans}`;
    } else if (ch === 'sqrt') {
        const sq = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
        a = sq[rnd(0, sq.length - 1)]; ans = Math.round(Math.sqrt(a));
        text = `√${a}`; hint = 'ما الجذر التربيعي؟'; explanation = `√${a} = ${ans} لأن ${ans}² = ${a}`;
    } else if (ch === 'equation_simple') {
        a = rnd(5, 30); b = rnd(a + 1, a + 50); ans = b - a;
        text = `س + ${a} = ${b}`; hint = 'ما قيمة س؟'; explanation = `س = ${b} - ${a} = ${ans}`;
    } else if (ch === 'sequence') {
        a = rnd(1, 15); b = rnd(2, 10);
        text = `${a}, ${a + b}, ${a + 2 * b}, ?`; ans = a + 3 * b;
        hint = 'ما الرقم التالي في المتتالية؟'; explanation = `الفرق = ${b}، الرقم التالي = ${ans}`;
    } else if (ch === 'fraction_simple') {
        let d = rnd(2, 6), n1 = rnd(1, d - 1), n2 = rnd(1, d - 1);
        ans = n1 + n2; text = `${n1}/${d} + ${n2}/${d}`;
        hint = 'اجمع الكسور ذات المقام المشترك'; explanation = `الناتج = ${ans}/${d}`;
    } else if (ch === 'word_add') {
        let x = rnd(10, 50), y = rnd(5, 30); ans = x + y;
        text = `لدى أحمد ${x} تفاحة واشترى ${y} تفاحة أخرى. كم تفاحة لديه الآن؟`;
        hint = 'جمع بسيط'; explanation = `${x}+${y}=${ans}`;
    } else if (ch === 'word_mul') {
        let p = rnd(2, 8), q = rnd(2, 12); ans = p * q;
        text = `إذا كان ثمن القلم الواحد ${p} ديناراً، فكم ثمن ${q} أقلام؟`;
        hint = 'ضرب'; explanation = `${p}×${q}=${ans}`;
    } else if (ch === 'log_simple') {
        let exp = rnd(1, 3); ans = exp; text = `log₁₀(10^${exp})`;
        hint = 'ما قيمة اللوغاريتم؟'; explanation = `log₁₀(10^${exp}) = ${exp}`;
    } else {
        ch = 'add'; a = rnd(1, 20); b = rnd(1, 20); ans = a + b;
        text = `${a} + ${b}`; hint = 'ما مجموع العددين؟'; explanation = `${a} + ${b} = ${ans}`;
    }

    const wr = new Set();
    const spread = Math.max(3, Math.floor(Math.abs(ans) * 0.3) + 2);
    let safety = 0;
    while (wr.size < 3 && safety < 200) {
        safety++;
        const off = rnd(-spread, spread);
        const w = ans + off;
        if (w !== ans && w >= 0 && Number.isInteger(w)) wr.add(w);
    }
    let extra = 1;
    while (wr.size < 3) { wr.add(ans + extra * 2); extra++; }
    const catKey = getCatStatsKey(ch);
    return { text, hint, answer: ans, choices: shuffle([ans, ...wr]), explanation, catKey };
}
