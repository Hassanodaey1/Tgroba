/* QUESTIONS & GAME MODES */
        /* ✅ FIX-2.3: دالة تبسيط الكسر — تُعرض الكسور بشكل رياضي صحيح */
        function simplifyFraction(num, den) {
            function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
            const g = gcd(Math.abs(num), Math.abs(den));
            const sNum = num / g, sDen = den / g;
            if (sDen === 1) return String(sNum);
            if (sNum > sDen) {
                const whole = Math.floor(sNum / sDen);
                const rem   = sNum % sDen;
                return rem === 0 ? String(whole) : `${whole} و ${rem}/${sDen}`;
            }
            return `${sNum}/${sDen}`;
        }


        /* ═══════════ QUESTION GENERATOR ═══════════ */
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
                    'algebra', 'log_simple', 'trig_simple', 'area_circle'
                ];
                let ch = advancedPool[rnd(0, advancedPool.length - 1)];
                let a, b, ans, text, hint, explanation = '';
                if (ch === 'power') { a = rnd(2, 6);
                    b = rnd(2, 4);
                    ans = Math.pow(a, b);
                    text = `${a}^${b}`;
                    hint = `ما قيمة ${a} مرفوعاً للأس ${b}؟`;
                    explanation = `${a}^${b} = ${ans}`; } else if (ch === 'sqrt') { const sq = [4, 9, 16, 25, 36,
                        49, 64, 81, 100
                    ];
                    a = sq[rnd(0, sq.length - 1)];
                    ans = Math.sqrt(a);
                    text = `√${a}`;
                    hint = 'ما الجذر التربيعي؟';
                    explanation = `√${a} = ${ans}`; } else if (ch === 'equation_simple') { a = rnd(5, 20);
                    b = rnd(a + 1, a + 30);
                    ans = b - a;
                    text = `س + ${a} = ${b}`;
                    hint = 'ما قيمة س؟';
                    explanation = `س = ${b} - ${a} = ${ans}`; } else if (ch === 'fraction_add') { let c = rnd(2, 8);
                    let a2 = rnd(1, c - 1);
                    let b2 = rnd(1, c - 1);
                    ans = a2 + b2;
                    text = `${a2}/${c} + ${b2}/${c}`;
                    hint = 'اجمع الكسور (المقامات متساوية)';
                    explanation = `${a2}/${c} + ${b2}/${c} = ${ans}/${c}`; } else if (ch === 'percent') { let pct = [
                        10, 20, 25, 50
                    ][rnd(0, 3)];
                    a = rnd(1, 20) * 10;
                    ans = Math.round(a * pct / 100);
                    text = `${pct}% من ${a}`;
                    hint = 'احسب النسبة المئوية';
                    explanation = `${a} × ${pct}% = ${ans}`; } else if (ch === 'sequence') { a = rnd(1, 10);
                    b = rnd(2, 8);
                    text = `${a}, ${a+b}, ${a+2*b}, ?`;
                    ans = a + 3 * b;
                    hint = 'ما الرقم التالي في المتتالية؟';
                    explanation = `الفرق = ${b}، الرقم التالي = ${ans}`; } else if (ch === 'log_simple') { a = rnd(2, 4);
                    ans = a;
                    text = `log₁₀(10^${a})`;
                    hint = `ما قيمة اللوغاريتم؟`;
                    explanation = `log₁₀(10^${a}) = ${a}`; } else if (ch === 'trig_simple') { let degs = [0, 30,
                        45, 60, 90
                    ];
                    let deg = degs[rnd(0, degs.length - 1)];
                    let val = Math.round(Math.sin(deg * Math.PI / 180) * 10) / 10;
                    ans = val;
                    text = `جا(${deg}°)`;
                    hint = `ما قيمة جيب الزاوية ${deg}°؟`;
                    explanation = `جا(${deg}°) = ${val}`; } else if (ch === 'area_circle') { let r = rnd(3, 8);
                    ans = Math.round(Math.PI * r * r);
                    text = `مساحة دائرة نصف قطرها ${r}`;
                    hint = 'استخدم π≈3.14';
                    explanation = `المساحة = π × ${r}² = ${ans}`; } else { a = rnd(2, 8);
                    ans = rnd(2, 12);
                    b = 2 * ans + a;
                    text = `2س + ${a} = ${b}`;
                    hint = 'ما قيمة س؟';
                    explanation = `س = (${b} - ${a})/2 = ${ans}`; }
                let choices = shuffle([ans, ans + 1, ans - 1, ans + 2]);
                if (typeof ans !== 'number') choices = shuffle([ans, ans + 1, ans - 1, ans + 2]);
                return { text, hint, answer: ans, choices, explanation, catKey: 'algebra' };
            }
            if (op === 'laws') {
                const lawQ = [
                    { text: 'ما ناتج 3 × (4 + 5) وفق قانون التوزيع؟', ans: 27,
                    explanation: '3×4 + 3×5 = 12+15=27' },
                    { text: 'ما قيمة 5⁰؟', ans: 1, explanation: 'أي عدد غير صفري مرفوع للأس صفر = 1' },
                    { text: 'ما مساحة مربع طول ضلعه 7؟', ans: 49, explanation: 'المساحة = الضلع² = 49' },
                    { text: 'ما محيط دائرة نصف قطرها 5 (π≈3.14)؟', ans: 31.4,
                        explanation: 'المحيط = 2×π×نق = 2×3.14×5 = 31.4' },
                    { text: 'جذر 144 = ؟', ans: 12, explanation: '12² = 144' },
                    { text: 'إذا كان س + 5 = 12، فما قيمة س؟', ans: 7, explanation: 'س = 12-5 = 7' },
                    { text: 'قانون الجمع التبادلي: 8 + 3 = 3 + ...؟', ans: 8,
                explanation: '8+3 = 3+8' },
                    { text: 'ما ناتج (-3) × (-4)؟', ans: 12, explanation: 'ضرب عددين سالبين يعطي موجب' },
                    { text: 'إذا كانت مساحة المستطيل 20 وطوله 5، فما عرضه؟', ans: 4,
                        explanation: 'العرض = المساحة/الطول = 4' },
                    { text: 'ما قيمة 2³ × 2⁴؟', ans: 128, explanation: '2⁷ = 128' },
                    { text: 'ما متوسط الأعداد 4, 8, 12؟', ans: 8, explanation: '(4+8+12)/3 = 24/3=8' },
                    { text: 'حل المعادلة: 2س = 16', ans: 8, explanation: 'س = 16/2 = 8' },
                    { text: 'إذا كان ثمن 5 أقلام 15 ديناراً، فثمن القلم الواحد؟', ans: 3,
                    explanation: '15/5 = 3' },
                    { text: 'ناتج (1/2) ÷ (1/4) = ؟', ans: 2, explanation: '(1/2)×4 = 2' },
                    { text: 'ما 25% من 80؟', ans: 20, explanation: '80×0.25=20' },
                    { text: 'قيمة 2⁵ = ؟', ans: 32, explanation: '2×2×2×2×2=32' },
                    { text: 'ما الجذر التكعيبي لـ 27؟', ans: 3, explanation: '3³=27' },
                ];
                /* استخدام المجموعة الموسّعة إذا كانت متاحة */
                if (typeof genExtendedLawQ === 'function') { /* ✅ FIX-2.1: 100% دائماً بدلاً من 50% */
                    return genExtendedLawQ();
                }
                let q = lawQ[rnd(0, lawQ.length - 1)];
                let choices = shuffle([q.ans, q.ans + 1, q.ans - 1, q.ans + 2]);
                return { text: q.text, hint: 'تطبيق قانون رياضي', answer: q.ans, choices, explanation: q.explanation,
                    catKey: 'mathlaws' };
            }
            let actualDiff = diff;
            if (!actualDiff || actualDiff === 'user') actualDiff = getDifficultyByLevel();
            const ranges = {
                easy: { small: [1, 10], mid: [1, 15], mul: [2, 9], times: [2, 9] },
                medium: { small: [10, 50], mid: [5, 30], mul: [2, 15], times: [2, 12] },
                hard: { small: [50, 500], mid: [10, 99], mul: [3, 25], times: [3, 20] },
                genius: { small: [100, 9999], mid: [10, 999], mul: [5, 50], times: [5, 30] }
            };
            const r = ranges[actualDiff] || ranges.easy;
            const ops = ['add', 'sub', 'mul', 'div'];
            let ch = op;
            if (op === 'mix') {
                /* 30% من الأسئلة تأتي من المولّد المتنوع */
                /* ✅ FIX-2.4: نسبة ديناميكية حسب المستوى: 30%→50%→70% */
                const _advChance = Math.min(7, Math.floor((typeof st !== 'undefined' ? (st.level || 1) : 1) / 5) + 3);
                if (typeof genAdvancedDiverseQ === 'function' && rnd(0, 9) < _advChance) {
                    return genAdvancedDiverseQ(actualDiff);
                }
                if (actualDiff === 'easy') ch = ops[rnd(0, 3)];
                else if (actualDiff === 'medium') { const pool = ['add', 'sub', 'mul', 'div', 'percent',
                        'fraction_simple', 'word_add', 'word_mul', 'equation_simple'
                    ];
                    ch = pool[rnd(0, pool.length - 1)]; } else if (actualDiff === 'hard') { const pool = ['add',
                        'sub', 'mul', 'div', 'percent', 'fraction_add', 'power', 'sqrt', 'word_hard',
                        'equation_simple', 'sequence'
                    ];
                    ch = pool[rnd(0, pool.length - 1)]; } else { const pool = ['add', 'sub', 'mul', 'div',
                        'percent', 'fraction_mul', 'power', 'sqrt', 'word_genius', 'equation_quad', 'sequence',
                        'algebra', 'log_simple'
                    ];
                    ch = pool[rnd(0, pool.length - 1)]; }
            }
            let a, b, ans, text, hint, explanation = '';
            if (ch === 'add') { a = rnd(r.small[0], r.small[1]);
                b = rnd(r.small[0], r.small[1]);
                ans = a + b;
                text = `${a} + ${b}`;
                hint = 'ما مجموع العددين؟';
                explanation = `${a} + ${b} = ${ans}`; } else if (ch === 'sub') { a = rnd(r.small[0], r.small[1]);
                b = rnd(r.small[0], r.small[1]); if (a < b)[a, b] = [b, a];
                ans = a - b;
                text = `${a} − ${b}`;
                hint = 'ما الفرق بين العددين؟';
                explanation = `${a} - ${b} = ${ans}`; } else if (ch === 'mul') { a = rnd(r.times[0], r.times[1]);
                b = rnd(r.times[0], r.times[1]);
                ans = a * b;
                text = `${a} × ${b}`;
                hint = 'ما حاصل الضرب؟';
                explanation = `${a} × ${b} = ${ans}`; } else if (ch === 'div') { b = rnd(r.times[0], r.times[1]);
                ans = rnd(1, r.times[1]);
                a = b * ans;
                text = `${a} ÷ ${b}`;
                hint = 'ما حاصل القسمة؟';
                explanation = `${a} ÷ ${b} = ${ans}`; } else if (ch === 'percent') { const pcts = [10, 20, 25,
                50, 75];
                const pct = pcts[rnd(0, pcts.length - 1)];
                a = rnd(1, 20) * 10;
                ans = Math.round(a * pct / 100);
                text = `${pct}% من ${a}`;
                hint = 'احسب النسبة المئوية';
                explanation = `${a} × ${pct}% = ${ans}`; } else if (ch === 'power') { a = rnd(2, 10);
                b = rnd(2, 3);
                ans = Math.pow(a, b);
                text = `${a}^${b}`;
                hint = `ما قيمة ${a} مرفوعاً للأس ${b}؟`;
                explanation = `${a}^${b} = ${ans}`; } else if (ch === 'sqrt') { const sq = [4, 9, 16, 25, 36, 49,
                    64, 81, 100, 121, 144
                ];
                a = sq[rnd(0, sq.length - 1)];
                ans = Math.round(Math.sqrt(a));
                text = `√${a}`;
                hint = 'ما الجذر التربيعي؟';
                explanation = `√${a} = ${ans} لأن ${ans}² = ${a}`; } else if (ch === 'equation_simple') { a = rnd(5,
                    30);
                b = rnd(a + 1, a + 50);
                ans = b - a;
                text = `س + ${a} = ${b}`;
                hint = 'ما قيمة س؟';
                explanation = `س = ${b} - ${a} = ${ans}`; } else if (ch === 'sequence') { a = rnd(1, 15);
                b = rnd(2, 10);
                text = `${a}, ${a+b}, ${a+2*b}, ?`;
                ans = a + 3 * b;
                hint = 'ما الرقم التالي في المتتالية؟';
                explanation = `الفرق = ${b}، الرقم التالي = ${ans}`; } else if (ch === 'fraction_simple') {
                /* ✅ FIX-2.3: عرض الكسر مُبسَّطاً وصحيحاً رياضياً */
                let d = rnd(2, 6);
                let n1 = rnd(1, d - 1);
                let n2 = rnd(1, d - 1);
                const _sumNum = n1 + n2;
                const _simplified = simplifyFraction(_sumNum, d);
                ans = _sumNum; /* الجواب الرقمي للمقارنة */
                text = `${n1}/${d} + ${n2}/${d}`;
                hint = 'اجمع الكسور ذات المقام المشترك';
                explanation = `${n1}/${d} + ${n2}/${d} = ${_simplified}`; } else if (ch === 'word_add') { let x = rnd(10, 50);
                let y = rnd(5, 30);
                ans = x + y;
                text = `لدى أحمد ${x} تفاحة واشترى ${y} تفاحة أخرى. كم تفاحة لديه الآن؟`;
                hint = 'جمع بسيط';
                explanation = `${x}+${y}=${ans}`; } else if (ch === 'word_mul') { let p = rnd(2, 8);
                let q = rnd(2, 12);
                ans = p * q;
                text = `إذا كان ثمن القلم الواحد ${p} ديناراً، فكم ثمن ${q} أقلام؟`;
                hint = 'ضرب';
                explanation = `${p}×${q}=${ans}`; } else if (ch === 'log_simple') { let exp = rnd(1, 3);
                ans = exp;
                text = `log₁₀(10^${exp})`;
                hint = 'ما قيمة اللوغاريتم؟';
                explanation = `log₁₀(10^${exp}) = ${exp}`; } else { ch = 'add';
                a = rnd(1, 20);
                b = rnd(1, 20);
                ans = a + b;
                text = `${a} + ${b}`;
                hint = 'ما مجموع العددين؟';
                explanation = `${a} + ${b} = ${ans}`; }
            const wr = new Set();
            const spread = Math.max(3, Math.floor(Math.abs(ans) * 0.3) + 2);
            let safety = 0;
            while (wr.size < 3 && safety < 200) { safety++;
                const off = rnd(-spread, spread);
                const w = ans + off; if (w !== ans && w >= 0 && Number.isInteger(w)) wr.add(w); }
            let extra = 1; while (wr.size < 3) { wr.add(ans + extra * 2);
                extra++; }
            const catKey = getCatStatsKey(ch);
            return { text, hint, answer: ans, choices: shuffle([ans, ...wr]), explanation, catKey };
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
                case 'add': { let a = r(0, 5),
                        b = r(0, 5); return { text: `${a}+${b}=؟`, answer: a + b, explanation: `نجمع ${a} و ${b} = ${
                                a + b}`, catKey: 'addition', choices: shuffle([a + b, a + b + 1, a + b - 1, a + b +
                                2
                            ]) }; }
                case 'sub': { let a = r(2, 6),
                        b = r(1, a); return { text: `${a}-${b}=؟`, answer: a - b, explanation: `ننقص ${b} من ${a} = ${
                                a - b}`, catKey: 'subtraction', choices: shuffle([a - b, a - b + 1, a - b - 1, a - b +
                                2
                            ]) }; }
                case 'mul': { let a = r(1, 3),
                        b = r(1, 3); return { text: `${a}×${b}=؟`, answer: a * b, explanation: `${a} مجموعات من ${b} = ${
                                a * b}`, catKey: 'multiplication', choices: shuffle([a * b, a * b + 1, a * b + 2,
                                a * b - 1
                            ]) }; }
                default:
                    return genQ('add', 'easy');
            }
        }

        function generateJuniorQuestion(op, diff) {
            switch (op) {
                case 'add': { let a = rnd(10, 30),
                        b = rnd(10, 30); return { text: `${a}+${b}=؟`, answer: a + b, explanation: `${a}+${b}=${a+b}`,
                        catKey: 'addition', choices: shuffle([a + b, a + b + 5, a + b - 3, a + b + 8]) }; }
                case 'sub': { let a = rnd(20, 50),
                        b = rnd(5, a); return { text: `${a}-${b}=؟`, answer: a - b, explanation: `${a}-${b}=${a-b}`,
                        catKey: 'subtraction', choices: shuffle([a - b, a - b + 4, a - b - 2, a - b + 7]) }; }
                default:
                    return genQ(op, diff);
            }
        }

        function updateGameCoinsDisplay() {
            const totalCoins = st.coins + Math.floor(G.coinsEarned);
            document.getElementById('gameCoins').textContent = totalCoins;
        }

        /* ═══════════ GAME MODES ═══════════ */
        function startTrainingMode(op = 'mix') {
            clearGameTimer();
            G.mode = 'classic';
            G.op = op;
            G.score = 0;
            G.correct = 0;
            G.wrong = 0;
            G.streak = 0;
            G.bestStreak = 0;
            G.currentQ = 0;
            G.totalQ = 9999;
            G.coinsEarned = 0;
            G.answered = false;
            G.ended = false;
            G.isTraining = true;
            G.livesLeft = 99;
            G.customTable = null;
            G.hasTimer = false;
            G.helpersUsed = { skip: false, remove: false, heart: false }; /* ✅ FIX-HEART: تتبع استخدام القلب مرة واحدة فقط */
            G.askedQuestions = [];
            /* ✅ إعادة ضبط ذاكرة التكرار عند كل لعبة جديدة */
            if (typeof clearSessionMemory === 'function') clearSessionMemory();
            document.getElementById('gameModeTitle').textContent = '🎓 تدريب';
            document.getElementById('statScore').textContent = '0';
            document.getElementById('streakNum').textContent = '0';
            document.getElementById('streakFire').style.display = 'none';
            document.getElementById('heartsStat').style.display = 'none';
            document.getElementById('helpersBar').style.display = 'none';
            const timeSelectHtml =
                `<div class="helper-btn" id="trainingTimeBtn" onclick="selectTrainingTime()" style="flex:0.7;"><div class="helper-btn-icon">⏱️</div><div class="helper-btn-label">تحديد الوقت</div></div>`;
            const heartsStatDiv = document.getElementById('heartsStat');
            heartsStatDiv.style.display = 'flex';
            heartsStatDiv.innerHTML = timeSelectHtml;
            G.timeLeft = 30;
            G.maxTime = 30;
            G.hasTimer = true;
            document.getElementById('bigTimerWrap').style.display = 'block';
            document.getElementById('bigTimer').textContent = G.timeLeft;
            document.getElementById('timerBar').style.width = '100%';
            document.getElementById('timerBar').classList.remove('danger');
            if (G.timer) clearInterval(G.timer);
            G.timer = setInterval(() => {
                if (G.ended) { clearInterval(G.timer);
                    G.timer = null; return; }
                if (G.timeLeft <= 0) { clearInterval(G.timer);
                    G.timer = null; if (!G.ended) endGame(); } else {
                    G.timeLeft--;
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    document.getElementById('bigTimer').textContent = G.timeLeft;
                    if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger');
                        document.getElementById('bigTimer').classList.add('danger'); }
                    if (G.timeLeft > 0 && G.timeLeft <= 6) playSound('tick');
                }
            }, 1000);
            updateGameCoinsDisplay();
            document.getElementById('resultsOverlay').classList.remove('active');
            document.getElementById('gameOverlay').classList.add('active');
            loadQuestion();
        }

        function selectTrainingTime() {
            showConfirm('اختر وقت التدريب', '30 ثانية أو 60 ثانية؟', '30 ثانية', '60 ثانية', (is30) => {
                if (is30) { G.maxTime = 30;
                    G.timeLeft = 30; } else { G.maxTime = 60;
                    G.timeLeft = 60; }
                document.getElementById('bigTimer').textContent = G.timeLeft;
                document.getElementById('timerBar').style.width = '100%';
                if (G.timer) clearInterval(G.timer);
                G.timer = setInterval(() => {
                    if (G.ended) { clearInterval(G.timer);
                        G.timer = null; return; }
                    if (G.timeLeft <= 0) { clearInterval(G.timer);
                        G.timer = null; if (!G.ended) endGame(); } else {
                        G.timeLeft--;
                        const pct = (G.timeLeft / G.maxTime) * 100;
                        document.getElementById('timerBar').style.width = pct + '%';
                        document.getElementById('bigTimer').textContent = G.timeLeft;
                        if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add(
                                'danger');
                            document.getElementById('bigTimer').classList.add('danger'); }
                        if (G.timeLeft > 0 && G.timeLeft <= 6) playSound('tick');
                    }
                }, 1000);
            });
        }

        /* ═══════════════════════════════════════════════════════
           🕐 نظام الوقت الكلاسيكي المتكيف مع الصعوبة
           سهل=2ث | متوسط=4ث | صعب=5ث | عبقري=6ث لكل سؤال
           ════════════════════════════════════════════════════ */
        function getClassicTimeForDifficulty(totalQ) {
            const secsPerQ = { easy: 2, medium: 4, hard: 5, genius: 6 }[st.difficulty] || 4;
            return totalQ * secsPerQ;
        }

        function startGameWith(mode, op, customTable = null, forceTimer = false) {
            closeSheet('modeSheet');
            closeSheet('opSheet');
            closeSheet('trainingOpSheet');
            clearGameTimer();
            st.lastMode = mode;
            st.lastOp = op;
            currentOp = op;
            saveSt();
            G.mode = mode;
            G.op = op;
            G.score = 0;
            G.correct = 0;
            G.wrong = 0;
            G.streak = 0;
            G.bestStreak = 0;
            G.currentQ = 0;
            G.coinsEarned = 0;
            G.answered = false;
            G.ended = false;
            G.isTraining = false;
            G.customTable = customTable || null;
            G.askedQuestions = [];
            G._challengeBadge = null; /* شارة التحدي */
            let hasTimer = false;
            let lives = 3;

            if (mode === 'classic') {
                /* ✅ وقت متكيف مع الصعوبة: سهل=20ث | متوسط=40ث | صعب=50ث | عبقري=60ث */
                G.totalQ = 10;
                hasTimer = forceTimer;
                if (hasTimer) {
                    const classicTime = getClassicTimeForDifficulty(10);
                    G.maxTime = classicTime;
                    G.timeLeft = classicTime;
                    lives = 3;
                } else { G.maxTime = 0; G.timeLeft = 0; lives = 0; }

            } else if (mode === 'speed') {
                /* ⚡ السرعة: مفتوح + 60 ثانية */
                G.totalQ = 9999;
                hasTimer = true;
                G.maxTime = 60;
                G.timeLeft = 60;
                lives = 3;

            } else if (mode === 'survival') {
                /* 🔥 البقاء: بدون وقت + 3 أخطاء */
                G.totalQ = 9999;
                hasTimer = false;
                lives = 0;

            } else if (mode === 'frenzy') {
                /* 💥 الاندفاع: مفتوح + 30 ثانية */
                G.totalQ = 9999;
                hasTimer = true;
                G.maxTime = 30;
                G.timeLeft = 30;
                lives = 3;

            } else if (mode === 'daily') {
                /* 🌟 تحدي اليوم */
                G.totalQ = 10;
                hasTimer = false;
                lives = 0;
                G.dailyQIndex = 0;

            } else if (mode === 'accuracy') {
                /* 🎯 الدقة: 20 سؤال + 60 ثانية */
                G.totalQ = 20;
                hasTimer = true;
                G.maxTime = 60;
                G.timeLeft = 60;
                lives = 3;
                G._challengeBadge = '🎯';

            } else if (mode === 'marathon') {
                /* 🏆 الماراثون: 50 سؤال + 60 ثانية */
                G.totalQ = 50;
                hasTimer = true;
                G.maxTime = 60;
                G.timeLeft = 60;
                lives = 3;
                G._challengeBadge = '🏆';

            } else if (mode === 'impossible') {
                /* 💀 المستحيل: 10 أسئلة + 1.5 ثانية/سؤال = 15 ثانية */
                G.totalQ = 10;
                hasTimer = true;
                G.maxTime = 15;
                G.timeLeft = 15;
                lives = 0; /* لا قلوب */
                G._challengeBadge = '💀';
            }

            G.livesLeft = lives;
            G.maxLives = lives;
            G._survivalWrong = 0;
            G.hasTimer = hasTimer;
            G.helpersUsed = { skip: false, remove: false, heart: false };

            const titles = {
                classic:    '🧮 كلاسيك',
                speed:      '⚡ سرعة',
                survival:   '🔥 البقاء',
                frenzy:     '💥 اندفاع',
                daily:      '🌟 تحدي اليوم',
                accuracy:   '🎯 الدقة',
                marathon:   '🏆 الماراثون',
                impossible: '💀 المستحيل'
            };
            document.getElementById('gameModeTitle').textContent = titles[mode] || 'كلاسيك';
            document.getElementById('statScore').textContent = 0;
            document.getElementById('streakNum').textContent = 0;
            document.getElementById('streakFire').style.display = 'none';
            if (lives > 0) {
                document.getElementById('heartsStat').style.display = 'flex';
                updateHeartsDisplay();
            } else {
                document.getElementById('heartsStat').style.display = 'none';
            }
            document.getElementById('helpersBar').style.display = 'flex';
            document.getElementById('helperSkip').classList.remove('used');
            document.getElementById('helperRemove').classList.remove('used');
            if (hasTimer) {
                document.getElementById('bigTimerWrap').style.display = 'block';
                const bt = document.getElementById('bigTimer');
                bt.textContent = G.timeLeft;
                bt.classList.remove('danger');
                document.getElementById('timerBar').style.width = '100%';
                document.getElementById('timerBar').classList.remove('danger');
                if (G.timer) clearInterval(G.timer);
                G.timer = setInterval(() => {
                    if (G.ended) { clearInterval(G.timer);
                        G.timer = null; return; }
                    if (G.timeLeft <= 0) { clearInterval(G.timer);
                        G.timer = null; if (!G.ended) endGame(); } else {
                        G.timeLeft--;
                        const pct = (G.timeLeft / G.maxTime) * 100;
                        document.getElementById('timerBar').style.width = pct + '%';
                        bt.textContent = G.timeLeft;
                        if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add(
                            'danger');
                            bt.classList.add('danger'); }
                        if (G.timeLeft > 0 && G.timeLeft <= 5) playSound('tick');
                    }
                }, 1000);
            } else {
                document.getElementById('bigTimerWrap').style.display = 'none';
            }
            updateGameCoinsDisplay();
            document.getElementById('resultsOverlay').classList.remove('active');
            document.getElementById('gameOverlay').classList.add('active');
            loadQuestion();
        }

        function updateHeartsDisplay() {
            const row = document.getElementById('heartsRow');
            if (!row) return;
            const total = 3;
            let h = '';
            for (let i = 0; i < total; i++) { h +=
                    `<span class="heart-icon${i>=G.livesLeft?' lost':''}">❤️</span>`; }
            row.innerHTML = h;
        }

        function useHelper(type) {
            if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي مساعدات'); return; }
            /* ✅ FIX-V9: منع استخدام مساعدات بعملات سلبية أو محرَّفة */
            if (typeof st.coins !== 'number' || st.coins < 0) { st.coins = 0; saveSt(); }
            if (type === 'skip') {
                if (st.coins < 3) { showFeedback('💸 تحتاج 3💰'); return; }
                if (G.helpersUsed.skip) { showFeedback('⏭️ استُخدم'); return; }
                st.coins -= 3;
                /* 3.2: إزالة الخصم المزدوج — الخصم من st.coins يكفي */
                G.helpersUsed.skip = true;
                document.getElementById('helperSkip').classList.add('used');
                saveSt();
                updateUI();
                updateGameCoinsDisplay();
                if (G.hasTimer && G.maxTime > 0) {
                    G.timeLeft = Math.max(0, G.timeLeft - 4);
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
                    if (G.timeLeft <= 0) { clearGameTimer();
                        endGame(); return; }
                }
                showFeedback('⏭️ تخطّي!');
                setTimeout(() => loadQuestion(), 300);
            } else if (type === 'remove') {
                if (st.coins < 4) { showFeedback('💸 تحتاج 4💰'); return; }
                if (G.helpersUsed.remove) { showFeedback('🗑️ استُخدم'); return; }
                if (G.answered) return;
                st.coins -= 4;
                G.helpersUsed.remove = true;
                document.getElementById('helperRemove').classList.add('used');
                saveSt();
                updateUI();
                updateGameCoinsDisplay();
                const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')];
                const wrongs = btns.filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer);
                if (wrongs.length > 0) { const rem = wrongs[Math.floor(Math.random() * wrongs.length)];
                    rem.style.opacity = '0.15';
                    rem.style.pointerEvents = 'none';
                    showFeedback('🗑️ حُذفت إجابة خاطئة'); } else showFeedback('⚠️ لا توجد إجابات خاطئة للحذف');
            } else if (type === 'heart') {
                if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي قلوب'); return; }
                /* ✅ FIX-HEART: منع الاستخدام أكثر من مرة في الجلسة الواحدة */
                if (G.helpersUsed.heart) { showFeedback('💖 استُخدم'); return; }
                if (st.coins < 7) { showFeedback('💸 تحتاج 7💰'); return; }
                st.coins -= 7;
                G.helpersUsed.heart = true;
                document.getElementById('helperHeart').classList.add('used');
                G.livesLeft++;
                saveSt();
                updateUI();
                updateHeartsDisplay();
                updateGameCoinsDisplay();
                showFeedback('💖 +1 قلب!');
                playSound('levelup');
            }
        }

        /* ═══════════ مولّد أسئلة تحدي اليوم المتدرج ═══════════
           السؤال ١-٣  → سهل   (عمليات أساسية بأرقام صغيرة)
           السؤال ٤-٦  → متوسط (نسب مئوية، كسور، معادلات بسيطة)
           السؤال ٧-٨  → صعب   (جذور، قوى، متتاليات)
           السؤال ٩-١٠ → متقدم (جبر، قوانين، ألغاز)
        ══════════════════════════════════════════════════════ */
        function genDailyQ(qIndex) {
            const age = (typeof st !== 'undefined')
                ? (st.age || (typeof calculateAgeFromBirthDate === 'function' ? calculateAgeFromBirthDate(st.birthDate) : 0))
                : 0;

            /* تحديد المرحلة حسب رقم السؤال (0-indexed) */
            let phase, diff;
            if      (qIndex <= 2) { phase = 'easy';     diff = 'easy'; }
            else if (qIndex <= 5) { phase = 'medium';   diff = 'medium'; }
            else if (qIndex <= 7) { phase = 'hard';     diff = 'hard'; }
            else                   { phase = 'advanced'; diff = 'hard'; }

            /* للأطفال: لا نتجاوز المتوسط أياً كان رقم السؤال */
            if (age > 0 && age <= 10 && diff !== 'easy') diff = 'easy';
            if (age > 0 && age <= 13 && diff === 'hard') diff = 'medium';

            if (phase === 'advanced' && (age === 0 || age >= 14)) {
                /* أسئلة متقدمة للكبار */
                const advPool = ['power', 'sqrt', 'sequence', 'equation_simple', 'fraction_add', 'percent'];
                const ch = advPool[rnd(0, advPool.length - 1)];
                return genQ(ch, 'hard');
            }

            /* باقي المراحل — استخدم genQ مع الصعوبة المحددة */
            const poolByPhase = {
                easy:   ['add', 'sub', 'mul', 'div'],
                medium: ['add', 'sub', 'mul', 'div', 'percent', 'fraction_simple', 'word_add', 'word_mul'],
                hard:   ['mul', 'div', 'percent', 'fraction_add', 'power', 'sqrt', 'sequence', 'equation_simple'],
            };
            const pool = poolByPhase[phase] || poolByPhase.easy;
            const op   = pool[rnd(0, pool.length - 1)];
            return genQ(op, diff);
        }

        /* ═══════════ LOAD QUESTION ═══════════ */
        function loadQuestion() {
            if (G.ended) return;
            /* الأوضاع المفتوحة: تعمل بالمؤقت وليس بعدد الأسئلة */
            const _infiniteModes = ['speed', 'survival', 'frenzy'];
            if (G.currentQ >= G.totalQ && !G.isTraining && !_infiniteModes.includes(G.mode)) { endGame(); return; }
            G.currentQ++;
            G.answered = false;
            G.helpersUsed.remove = false;
            document.getElementById('helperRemove').classList.remove('used');
            /* ✅ helperHeart لا يُعاد إلا في بداية لعبة جديدة — ليس لكل سؤال */
            document.getElementById('explanationArea').innerHTML = '';
            const age = st.age || calculateAgeFromBirthDate(st.birthDate);
            let q;
            let attempts = 0;
            const maxAttempts = 50;
            do {
                if (G.isTraining) {
                    if (G.op === 'table' && G.customTable) {
                        q = genQ('table', st.difficulty, G.customTable);
                    } else {
                        if (typeof getNextQuestion === 'function') {
                            q = getNextQuestion(G.op, st.difficulty);
                        } else {
                            q = generateAgeAdaptiveQuestion(G.op, st.difficulty, age);
                            if (!q.choices || q.choices.length < 4) q = genQ(G.op, st.difficulty);
                        }
                    }
                } else {
                    if (G.op === 'table' && G.customTable) {
                        q = genQ('table', st.difficulty, G.customTable);
                    } else {
                        if (G.op === 'advanced') q = genQ('advanced', st.difficulty);
                        else if (G.op === 'laws') q = genQ('laws', st.difficulty);
                        else if (G.mode === 'daily') {
                            /* ✅ FIX-DAILY: أسئلة متدرجة الصعوبة لتحدي اليوم */
                            const dailyIdx = (G.dailyQIndex !== undefined) ? G.dailyQIndex : (G.currentQ - 1);
                            q = genDailyQ(dailyIdx);
                            G.dailyQIndex = (G.dailyQIndex || 0) + 1;
                        } else {
                            let useDiff = st.difficulty;
                            if (G.mode === 'classic' && !useDiff) useDiff = getDifficultyByLevel();
                            /* ✅ المحرك الذكي — يتكيف مع اللاعب ويضمن عدم التكرار */
                            if (typeof getNextQuestion === 'function') {
                                q = getNextQuestion(G.op, useDiff);
                            } else if (age > 0 && age <= 13) {
                                q = generateAgeAdaptiveQuestion(G.op, useDiff, age);
                                if (!q || !q.choices || q.choices.length < 4) q = genQ(G.op, useDiff);
                            } else {
                                q = genQ(G.op, useDiff);
                            }
                        }
                    }
                }
                const qKey = q.text + '|' + q.answer;
                if (!G.askedQuestions.includes(qKey) || G.isTraining) break;
                attempts++;
                /* إذا استُنفدت المحاولات، امسح السجل وابدأ من جديد لتجنب التوقف */
                if (attempts > maxAttempts) {
                    G.askedQuestions = [];
                    break;
                }
            } while (true);
            if (!G.isTraining) {
                const qKey = q.text + '|' + q.answer;
                if (!G.askedQuestions.includes(qKey)) {
                    G.askedQuestions.push(qKey);
                    // الاحتفاظ بآخر 150 سؤال لتجنب تراكم الذاكرة في الأوضاع اللانهائية
                    if (G.askedQuestions.length > 150) G.askedQuestions.shift();
                }
            }
            G.correctAnswer = q.answer;
            G.currentExplanation = q.explanation || '';
            G.currentCatKey = q.catKey || getCatStatsKey(G.op || 'add');
            const qt = document.getElementById('questionText');
            qt.style.animation = 'none';
            void qt.offsetWidth;
            qt.style.animation = '';
            if (G.isTraining) {
                document.getElementById('questionNumber').textContent = `🎓 تدريب - ${G.correct+1}`;
            } else {
                document.getElementById('questionNumber').textContent =
                    G.mode === 'speed'      ? `⚡ السؤال ${G.correct+1}` :
                    G.mode === 'frenzy'     ? `💥 ${G.correct+1} إجابة` :
                    G.mode === 'survival'   ? `❤️ ${G.livesLeft} قلوب` :
                    G.mode === 'accuracy'   ? `🎯 ${G.currentQ} من ${G.totalQ}` :
                    G.mode === 'marathon'   ? `🏆 ${G.currentQ} من ${G.totalQ}` :
                    G.mode === 'impossible' ? `💀 ${G.currentQ} من ${G.totalQ}` :
                    `السؤال ${G.currentQ} من ${G.totalQ}`;
            }
            document.getElementById('questionText').textContent = (q.text.endsWith('؟') || q.text.endsWith('?') || q.text.endsWith('= ?') || q.text.endsWith('= ؟')) ? q.text : `${q.text} = ?`;
            document.getElementById('questionHint').textContent = q.hint || 'ما هو الجواب؟';
            const _openModes = ['speed', 'survival', 'frenzy', 'accuracy', 'marathon', 'impossible'];
            document.getElementById('statQ').textContent = (G.isTraining || _openModes.includes(G.mode)) ? G.correct : `${G.currentQ}/${G.totalQ}`;
            renderVisualAid(q);
            const grid = document.getElementById('answersGrid');
            grid.innerHTML = '';
            const choices = q.choices || shuffle([q.answer, q.answer + 1, q.answer - 1, q.answer + 2]);
            choices.forEach(c => { const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.textContent = c;
                btn.setAttribute('data-val', c);
                btn.onclick = () => checkAnswer(btn);
                grid.appendChild(btn); });
        }

        /* ═══════════ CHALLENGE GAME (نداء التحدي) ═══════════ */
        /* مولّد أسئلة التحدي مع صعوبة تتزايد تدريجياً */
        function genChallengeQ(questionIndex) {
            // حساب مستوى الصعوبة بناءً على رقم السؤال (تدريجياً)
            let level;
            if (questionIndex < 5) level = 0;          // سهل جداً
            else if (questionIndex < 12) level = 1;     // سهل
            else if (questionIndex < 22) level = 2;     // متوسط
            else if (questionIndex < 35) level = 3;     // متوسط+
            else if (questionIndex < 50) level = 4;     // صعب
            else if (questionIndex < 70) level = 5;     // صعب+
            else level = 6;                              // عبقري

            const ops = ['add', 'sub', 'mul', 'div'];
            const op = ops[Math.floor(Math.random() * ops.length)];

            let a, b, ans, text, hint, explanation;

            if (level === 0) {
                // 1–9
                if (op === 'add') { a = rnd(1,9); b = rnd(1,9); ans = a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a = rnd(2,9); b = rnd(1,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a = rnd(1,5); b = rnd(1,5); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b = rnd(1,5); ans = rnd(1,5); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else if (level === 1) {
                // 1–20
                if (op === 'add') { a=rnd(5,20); b=rnd(5,20); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(10,20); b=rnd(1,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(2,9); b=rnd(2,9); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(2,9); ans=rnd(1,9); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else if (level === 2) {
                // 10–50
                if (op === 'add') { a=rnd(10,50); b=rnd(10,50); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(20,50); b=rnd(10,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(3,12); b=rnd(3,12); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(2,12); ans=rnd(2,12); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else if (level === 3) {
                // 20–100
                if (op === 'add') { a=rnd(20,100); b=rnd(20,100); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(50,150); b=rnd(10,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(5,15); b=rnd(5,15); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(3,15); ans=rnd(3,15); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else if (level === 4) {
                // 50–500
                if (op === 'add') { a=rnd(50,500); b=rnd(50,500); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(100,500); b=rnd(50,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(8,20); b=rnd(8,20); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(5,20); ans=rnd(5,20); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else if (level === 5) {
                // 100–1000
                if (op === 'add') { a=rnd(100,999); b=rnd(100,999); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(200,999); b=rnd(100,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(10,30); b=rnd(10,25); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(6,25); ans=rnd(6,25); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            } else {
                // عبقري: أعداد كبيرة
                if (op === 'add') { a=rnd(500,9999); b=rnd(500,9999); ans=a+b; text=`${a} + ${b}`; hint='ما مجموع العددين؟'; explanation=`${a}+${b}=${ans}`; }
                else if (op === 'sub') { a=rnd(1000,9999); b=rnd(500,a); ans=a-b; text=`${a} − ${b}`; hint='ما الفرق؟'; explanation=`${a}-${b}=${ans}`; }
                else if (op === 'mul') { a=rnd(15,50); b=rnd(15,40); ans=a*b; text=`${a} × ${b}`; hint='ما حاصل الضرب؟'; explanation=`${a}×${b}=${ans}`; }
                else { b=rnd(10,40); ans=rnd(10,40); a=b*ans; text=`${a} ÷ ${b}`; hint='ما حاصل القسمة؟'; explanation=`${a}÷${b}=${ans}`; }
            }

            // توليد الخيارات الخاطئة
            const wr = new Set();
            const spread = Math.max(3, Math.floor(Math.abs(ans) * 0.25) + 2);
            let safety = 0;
            while (wr.size < 3 && safety < 300) {
                safety++;
                const off = rnd(-spread, spread);
                const w = ans + off;
                if (w !== ans && w >= 0 && Number.isInteger(w)) wr.add(w);
            }
            let extra = 1;
            while (wr.size < 3) { wr.add(ans + extra * 3); extra++; }

            return {
                text, hint, answer: ans,
                choices: shuffle([ans, ...wr]),
                explanation,
                catKey: 'addition',
                level
            };
        }

        /* ═══════════ CHALLENGE GAME STATE ═══════════ */
        var CG = {
            active: false,
            score: 0,
            questionIndex: 0,
            answered: false,
            ended: false,
            correctAnswer: 0,
            currentExplanation: '',
            askedQuestions: [],
            consecutiveWrong: 0  /* عداد الأخطاء المتتالية */
        };
        /* ✅ ANTI-CHEAT: مصدر داخلي للنقاط — يمنع التلاعب عبر Console */
        var _cgScoreInternal = 0;
        function _cgAddScore(delta) {
            _cgScoreInternal = Math.max(0, _cgScoreInternal + delta);
            CG.score = _cgScoreInternal;
        }
        function _cgResetScore() { _cgScoreInternal = 0; CG.score = 0; }

        function startChallengeGame() {
            _cgResetScore();
            /* ✅ FIX: تحديث خصائص CG بدون إعادة التعيين الكاملة لحفظ مرجع الدوال */
            CG.active = true;
            CG.score = 0;
            CG.questionIndex = 0;
            CG.answered = false;
            CG.ended = false;
            CG.correctAnswer = 0;
            CG.currentExplanation = '';
            CG.askedQuestions = [];
            CG.timeLeft = 60;
            CG.maxTime = 60;
            if (CG.timer) { clearInterval(CG.timer); CG.timer = null; }
            CG.helpersUsed = { skip: false, remove: false, time: false };
            CG.consecutiveWrong = 0;
            // إخفاء واجهة الترحيب وإظهار واجهة اللعبة
            document.getElementById('challengeWelcome').style.display = 'none';
            document.getElementById('challengeGameArea').style.display = 'flex';
            document.getElementById('challengeScoreDisplay').textContent = '0';
            // تهيئة المؤقت
            updateChallengeTimerUI();
            startChallengeTimer();
            // تهيئة المساعدات
            resetChallengeHelpers();
            loadChallengeQuestion();
        }

        function startChallengeTimer() {
            if (CG.timer) clearInterval(CG.timer);
            CG.timer = setInterval(() => {
                if (CG.ended) { clearInterval(CG.timer); return; }
                CG.timeLeft--;
                updateChallengeTimerUI();
                if (CG.timeLeft <= 10) {
                    playSound('tick');
                    document.getElementById('challengeTimerDisplay').style.color = 'var(--red)';
                    document.getElementById('challengeTimerBar').style.background = 'linear-gradient(90deg,var(--red),#ff6b6b)';
                } else {
                    document.getElementById('challengeTimerDisplay').style.color = 'var(--accent2)';
                    document.getElementById('challengeTimerBar').style.background = 'linear-gradient(90deg,var(--accent2),var(--accent))';
                }
                if (CG.timeLeft <= 0) { clearInterval(CG.timer); endChallengeGame(); }
            }, 1000);
        }

        function updateChallengeTimerUI() {
            const el = document.getElementById('challengeTimerDisplay');
            const bar = document.getElementById('challengeTimerBar');
            if (el) el.textContent = CG.timeLeft;
            if (bar) bar.style.width = Math.max(0, (CG.timeLeft / CG.maxTime) * 100) + '%';
        }

        function resetChallengeHelpers() {
            CG.helpersUsed = { skip: false, remove: false, time: false };
            ['challengeHelperSkip','challengeHelperRemove','challengeHelperTime'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.classList.remove('used'); el.style.opacity = '1'; }
            });
        }

        function useChallengeHelper(type) {
            if (CG.ended || CG.answered) return;
            if (type === 'skip') {
                if (CG.helpersUsed.skip) { showFeedback('⚠️ استخدمت هذه المساعدة'); return; }
                if (st.coins < 3) { showFeedback('💸 لا يكفي!'); return; }
                st.coins -= 3;
                CG.helpersUsed.skip = true;
                const el = document.getElementById('challengeHelperSkip');
                if (el) { el.classList.add('used'); el.style.opacity = '0.5'; }
                showFeedback('⏭️ تم التخطي');
                playSound('click');
                CG.answered = true;
                setTimeout(() => { if (!CG.ended) loadChallengeQuestion(); }, 300);
            } else if (type === 'remove') {
                if (CG.helpersUsed.remove) { showFeedback('⚠️ استخدمت هذه المساعدة'); return; }
                if (st.coins < 4) { showFeedback('💸 لا يكفي!'); return; }
                st.coins -= 4;
                CG.helpersUsed.remove = true;
                const el = document.getElementById('challengeHelperRemove');
                if (el) { el.classList.add('used'); el.style.opacity = '0.5'; }
                // حذف إجابة خاطئة عشوائية
                const btns = [...document.querySelectorAll('#challengeAnswersGrid .answer-btn:not(:disabled)')];
                const wrong = btns.filter(b => parseInt(b.getAttribute('data-val')) !== CG.correctAnswer);
                if (wrong.length > 0) {
                    const r = wrong[Math.floor(Math.random() * wrong.length)];
                    r.style.opacity = '0.15';
                    r.disabled = true;
                }
                showFeedback('🗑️ تم حذف إجابة');
                playSound('click');
            } else if (type === 'time') {
                if (CG.helpersUsed.time) { showFeedback('⚠️ استخدمت هذه المساعدة'); return; }
                if (st.coins < 5) { showFeedback('💸 لا يكفي!'); return; }
                st.coins -= 5;
                CG.helpersUsed.time = true;
                const el = document.getElementById('challengeHelperTime');
                if (el) { el.classList.add('used'); el.style.opacity = '0.5'; }
                CG.timeLeft = Math.min(CG.maxTime, CG.timeLeft + 10);
                updateChallengeTimerUI();
                showFeedback('⏰ +10 ثانية!');
                playSound('correct');
            }
            saveSt();
            updateGameCoinsDisplay();
        }

        function endChallengeGame() {
            if (CG.ended) return;
            CG.ended = true;
            CG.active = false;
            if (CG.timer) clearInterval(CG.timer);
            /* ✅ FIX-V5b: تحقق منطقي من نتيجة التحدي قبل الحفظ */
            CG.score = Math.max(0, Math.min(Math.floor(_cgScoreInternal || 0), 9999)); _cgScoreInternal = CG.score;
            // حفظ النتيجة في الـ state
            if (CG.score > (st.challengeBestScore || 0)) {
                st.challengeBestScore = CG.score;
                saveSt();
            }
            // مزامنة مع لائحة المتصدرين
            syncChallengeScore(CG.score);
            // إظهار نتيجة التحدي
            document.getElementById('challengeGameArea').style.display = 'none';
            document.getElementById('challengeResultArea').style.display = 'flex';
            document.getElementById('challengeFinalScore').textContent = CG.score;
            document.getElementById('challengeBestScore').textContent = st.challengeBestScore || CG.score;
            const msg = CG.score >= 50 ? '🏆 أداء مذهل!' : CG.score >= 30 ? '⭐ رائع!' : CG.score >= 15 ? '😊 جيد جداً!' : '💪 حاول مجدداً!';
            document.getElementById('challengeResultMsg').textContent = msg;
            if (CG.score >= 15) doConfetti();
        }

        function loadChallengeQuestion() {
            if (CG.ended) return;
            CG.answered = false;
            document.getElementById('challengeExplanation').innerHTML = '';
            document.getElementById('challengeExplanation').style.display = 'none';

            let q;
            let attempts = 0;
            do {
                q = genChallengeQ(CG.questionIndex);
                const qKey = q.text + '|' + q.answer;
                if (!CG.askedQuestions.includes(qKey)) {
                    CG.askedQuestions.push(qKey);
                    // الاحتفاظ بآخر 100 سؤال فقط لتجنب تراكم الذاكرة
                    if (CG.askedQuestions.length > 100) CG.askedQuestions.shift();
                    break;
                }
                attempts++;
                if (attempts > 60) break;
            } while (true);

            CG.correctAnswer = q.answer;
            CG.currentExplanation = q.explanation || '';

            // تحديث رقم السؤال والصعوبة
            document.getElementById('challengeQNum').textContent = `السؤال ${CG.questionIndex + 1}`;
            const levelLabels = ['سهل جداً','سهل','متوسط','متوسط+','صعب','صعب+','عبقري'];
            document.getElementById('challengeDiffLabel').textContent = levelLabels[q.level] || 'عبقري';

            // عرض السؤال
            const qt = document.getElementById('challengeQuestionText');
            qt.style.animation = 'none';
            void qt.offsetWidth;
            qt.style.animation = '';
            qt.textContent = `${q.text} = ?`;
            document.getElementById('challengeHint').textContent = q.hint || 'ما هو الجواب؟';

            // عرض الأزرار
            const grid = document.getElementById('challengeAnswersGrid');
            grid.innerHTML = '';
            (q.choices || []).forEach(c => {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.textContent = c;
                btn.setAttribute('data-val', c);
                btn.onclick = () => checkChallengeAnswer(btn);
                grid.appendChild(btn);
            });
        }

        function checkChallengeAnswer(btn) {
            if (CG.answered || CG.ended) return;
            CG.answered = true;
            const val = parseInt(btn.getAttribute('data-val'));
            document.querySelectorAll('#challengeAnswersGrid .answer-btn').forEach(b => b.disabled = true);

            if (val === CG.correctAnswer) {
                btn.classList.add('correct');
                /* +1 نقطة لكل إجابة صحيحة */
                _cgAddScore(1);
                CG.questionIndex++;
                CG.consecutiveWrong = 0; /* إعادة عداد الأخطاء */
                document.getElementById('challengeScoreDisplay').textContent = CG.score;
                /* +1 ثانية عند الإجابة الصحيحة */
                CG.timeLeft = Math.min(CG.maxTime, CG.timeLeft + 1);
                updateChallengeTimerUI();
                showFeedback('✅ +1 نقطة');
                playSound('correct');
                if (CG.score % 10 === 0 && CG.score > 0) { doConfetti(); showComboEffect(CG.score); }
                showFloatXP(1);
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('#challengeAnswersGrid .answer-btn').forEach(b => {
                    if (parseInt(b.getAttribute('data-val')) === CG.correctAnswer) b.classList.add('correct');
                });
                /* عداد الأخطاء المتتالية: كل خطأين يخصمان نقطة واحدة */
                CG.consecutiveWrong = (CG.consecutiveWrong || 0) + 1;
                if (CG.consecutiveWrong >= 2) {
                    _cgAddScore(-1);
                    CG.consecutiveWrong = 0;
                    document.getElementById('challengeScoreDisplay').textContent = CG.score;
                    showFeedback('❌ ×2 → -1 نقطة');
                } else {
                    showFeedback('❌ خطأ');
                }
                playSound('wrong');
                /* -2 ثانية عند الإجابة الخاطئة */
                CG.timeLeft = Math.max(0, CG.timeLeft - 2);
                updateChallengeTimerUI();
                /* إظهار الشرح */
                const expArea = document.getElementById('challengeExplanation');
                expArea.innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${CG.correctAnswer}</strong><br>الشرح: ${CG.currentExplanation}</div>`;
                expArea.style.display = 'block';
                if (CG.timeLeft <= 0) { clearInterval(CG.timer); endChallengeGame(); return; }
            }
            /* إعادة ضبط المساعدات للسؤال التالي */
            CG.helpersUsed = { skip: false, remove: false, time: false };
            resetChallengeHelpers();

            setTimeout(() => {
                if (CG.ended) return;
                loadChallengeQuestion();
            }, val === CG.correctAnswer ? 350 : 700);
        }

        function quitChallengeGame() {
            showConfirm('إنهاء التحدي', 'هل تريد إنهاء اللعبة؟ ستُحفظ نتيجتك الحالية.', 'نعم', 'استمرار', ok => {
                if (ok) endChallengeGame();
            });
        }

        function restartChallengeGame() {
            if (CG.timer) clearInterval(CG.timer);
            document.getElementById('challengeResultArea').style.display = 'none';
            document.getElementById('challengeWelcome').style.display = 'flex';
        }

        /* ═══════════ مزامنة نتيجة التحدي مع Firebase ═══════════ */
        /* ✅ FIX-V11: تتبع آخر مرة لُعب فيها تحدي اليوم */
        function hasDailyBeenPlayed() {
            return st._dailyGameDate === (typeof todayStr === 'function' ? todayStr() : '');
        }
        function markDailyPlayed() {
            st._dailyGameDate = typeof todayStr === 'function' ? todayStr() : '';
            saveSt();
        }

        function syncChallengeScore(score) {
            if (!database) return;
            /* ✅ FIX-V3b+V10: serialNumber كـ key + حد أقصى للنتيجة */
            if (!st.serialNumber) return;
            try {
                const safeScore = Math.max(0, Math.min(Math.floor(score || 0), 9999));
                const safeLevel = Math.min(st.level || 1, 200);
                const playerKey = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
                const ref = database.ref('challenge_leaderboard/' + playerKey);
                ref.once('value', snap => {
                    const existing = snap.val();
                    if (!existing || safeScore > (existing.challengeScore || 0)) {
                        ref.set({
                            name:           st.name,
                            avatar:         st.avatar || '🧑',
                            level:          safeLevel,
                            challengeScore: safeScore,
                            serialNumber:   st.serialNumber,
                            lastUpdated:    Date.now()
                        }).catch(() => {});
                    }
                }).catch(() => {});
            } catch (e) {}
        }

        /* ═══════════ تحميل لائحة المتصدرين للتحدي ═══════════ */
        function loadChallengeLeaderboard() {
            const container = document.getElementById('challengeLeaderboardList');
            if (!container) return;
            if (!database) {
                container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;">⚠️ قاعدة البيانات غير متصلة</div>';
                return;
            }
            container.innerHTML = '<div style="text-align:center;padding:16px;">⏳ جاري التحميل...</div>';
            try {
                database.ref('challenge_leaderboard').orderByChild('challengeScore').limitToLast(10).once('value', (snapshot) => {
                    const players = [];
                    snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                    players.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));
                    if (players.length === 0) {
                        container.innerHTML = '<div style="text-align:center;padding:16px;">لا توجد نتائج بعد — كن الأول!</div>';
                        return;
                    }
                    const medals = ['🥇','🥈','🥉'];
                    let html = '';
                    players.forEach((p, idx) => {
                        const isMe = p.id === st.serialNumber;
                        html += `<div class="lb-row${isMe?' lb-row-me':''}">`
                            + `<span>${medals[idx] || (idx+1)}</span>`
                            + `<span>${p.avatar||'🧑'} ${p.name}</span>`
                            + `<span>${p.level||1}</span>`
                            + `<span style="color:var(--gold);font-weight:900;">${p.challengeScore||0}</span>`
                            + `</div>`;
                    });
                    container.innerHTML = html;
                }).catch(() => {
                    container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ فشل التحميل</div>';
                });
            } catch (e) {
                container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ قاعدة البيانات غير متاحة</div>';
            }
        }

        function renderVisualAid(q) {
            const box = document.getElementById('visualAid');
            box.innerHTML = '';
            if (st.difficulty !== 'easy' || !['add', 'sub', 'mul', 'div', 'table'].includes(G.op) && !['add', 'sub',
                    'mul', 'div', 'table'
                ].includes(G.currentCatKey)) return;
            const age = st.age || calculateAgeFromBirthDate(st.birthDate);
            if (age > 12) return;
            const nums = q.text?.match(/\d+/g);
            if (!nums || nums.length < 2) return;
            const a = parseInt(nums[0]),
                b = parseInt(nums[1]);
            if (a > 15 || b > 15) return;
            if (G.op === 'add' || G.currentCatKey === 'addition' || q.text?.includes('+')) {
                let h = '';
                for (let i = 0; i < a; i++) h +=
                    `<div class="visual-dot" onclick="this.classList.toggle('counted')"></div>`;
                h += `<span style="margin:0 6px;font-size:1.2em;">+</span>`;
                for (let i = 0; i < b; i++) h +=
                    `<div class="visual-dot" style="background:var(--accent2)" onclick="this.classList.toggle('counted')"></div>`;
                box.innerHTML = h;
            } else if (G.op === 'sub' || G.currentCatKey === 'subtraction') {
                let h = '';
                for (let i = 0; i < a; i++) h +=
                    `<div class="visual-dot" onclick="this.classList.toggle('counted')"></div>`;
                box.innerHTML = h + `<span style="margin:0 4px;">- ${b}</span>`;
            } else if (G.op === 'mul' || G.currentCatKey === 'multiplication' || G.op === 'table') {
                if (a <= 5 && b <= 5) {
                    let h = '';
                    for (let i = 0; i < a; i++) { h += '<div style="display:flex;gap:2px;">'; for (let j = 0; j <
                            b; j++) h +=
                            `<div class="visual-dot" style="width:14px;height:14px;background:var(--accent2)"></div>`;
                        h += '</div>'; }
                    box.innerHTML = h;
                }
            }
        }




/* ═══════════════════════════════════════════════════════════════
   توليد أسئلة متنوعة: سالبة، كسرية، نسبية، معادلات، قوانين موسعة
   HO Math v9 — مولّد الأسئلة المتقدم
═══════════════════════════════════════════════════════════════ */

/**
 * يولّد سؤالاً عشوائياً من مجموعة موسّعة تشمل:
 * أعداداً سالبة، كسور، نسب مئوية، متتاليات، معادلات، ألغاز، هندسة
 */
function genAdvancedDiverseQ(diff) {
    const types = [
        'neg_add', 'neg_sub', 'neg_mul', 'neg_div',
        'frac_add_diff', 'frac_sub_diff', 'frac_mul', 'frac_div',
        'ratio', 'proportion', 'percent_reverse', 'percent_change',
        'eq_linear', 'eq_two_step', 'eq_fraction',
        'seq_arith', 'seq_geo', 'seq_neg',
        'geo_area', 'geo_perimeter', 'geo_volume',
        'law_distributive', 'law_commutative', 'law_power',
        'word_neg', 'word_fraction', 'word_ratio',
        'abs_value', 'sqrt_neg_context', 'mixed_ops'
    ];

    const ch = types[rnd(0, types.length - 1)];
    let a, b, c, d, ans, text, hint, explanation = '', choices;

    switch (ch) {
        /* ─── أعداد سالبة ─── */
        case 'neg_add': {
            a = -rnd(1, 20); b = -rnd(1, 20);
            ans = a + b;
            text = `(${a}) + (${b})`;
            hint = 'جمع عددين سالبين';
            explanation = `${a} + ${b} = ${ans}`;
            break;
        }
        case 'neg_sub': {
            a = rnd(1, 15); b = rnd(1, 20);
            ans = a - b; // قد يكون سالباً
            text = `${a} − ${b}`;
            hint = 'الفرق قد يكون سالباً';
            explanation = `${a} - ${b} = ${ans}`;
            break;
        }
        case 'neg_mul': {
            a = -rnd(2, 9); b = rnd(2, 9);
            ans = a * b;
            text = `(${a}) × ${b}`;
            hint = 'سالب × موجب = سالب';
            explanation = `${a} × ${b} = ${ans}`;
            break;
        }
        case 'neg_div': {
            const divisors = [2, 3, 4, 5, 6, 7, 8, 9];
            b = divisors[rnd(0, divisors.length - 1)];
            ans = -rnd(1, 10);
            a = ans * b;
            text = `(${a}) ÷ ${b}`;
            hint = 'سالب ÷ موجب = سالب';
            explanation = `${a} ÷ ${b} = ${ans}`;
            break;
        }

        /* ─── كسور بمقامات مختلفة ─── */
        case 'frac_add_diff': {
            // a/b + c/b حيث المقامات مختلفة → نحوّل ثم نجمع
            const d1 = rnd(2, 6), d2 = rnd(2, 6);
            const n1 = rnd(1, d1 - 1), n2 = rnd(1, d2 - 1);
            const lcm = (d1 * d2) / gcd(d1, d2);
            const numSum = n1 * (lcm / d1) + n2 * (lcm / d2);
            const g = gcd(numSum, lcm);
            ans = Math.round((numSum / lcm) * 100) / 100; // كعدد عشري للمقارنة
            const ansText = g < lcm ? `${numSum/g}/${lcm/g}` : `${numSum/lcm}`;
            // نجعل الجواب كعدد عشري مقرّب لسهولة الخيارات
            ans = Math.round((n1/d1 + n2/d2) * 100) / 100;
            text = `${n1}/${d1} + ${n2}/${d2}`;
            hint = 'أوجد المقام المشترك ثم اجمع';
            explanation = `المقام المشترك = ${lcm}، الناتج = ${ansText} ≈ ${ans}`;
            break;
        }
        case 'frac_sub_diff': {
            const d1 = rnd(2, 6), d2 = rnd(2, 6);
            const n1 = rnd(1, d1), n2 = rnd(1, d2 - 1);
            ans = Math.round((n1/d1 - n2/d2) * 100) / 100;
            text = `${n1}/${d1} − ${n2}/${d2}`;
            hint = 'أوجد المقام المشترك ثم اطرح';
            explanation = `${n1}/${d1} - ${n2}/${d2} = ${ans}`;
            break;
        }
        case 'frac_mul': {
            const n1 = rnd(1, 7), d1 = rnd(2, 8), n2 = rnd(1, 7), d2 = rnd(2, 8);
            const numP = n1 * n2, denP = d1 * d2;
            const g = gcd(numP, denP);
            ans = Math.round((numP / denP) * 100) / 100;
            const ansDisp = g > 1 ? `${numP/g}/${denP/g}` : `${numP}/${denP}`;
            text = `${n1}/${d1} × ${n2}/${d2}`;
            hint = 'اضرب البسطَين والمقامَين';
            explanation = `= ${numP}/${denP} = ${ansDisp} ≈ ${ans}`;
            break;
        }
        case 'frac_div': {
            const n1 = rnd(1, 5), d1 = rnd(2, 6), n2 = rnd(1, 5), d2 = rnd(2, 6);
            ans = Math.round((n1 * d2) / (d1 * n2) * 100) / 100;
            text = `${n1}/${d1} ÷ ${n2}/${d2}`;
            hint = 'اقلب المقسوم عليه واضرب';
            explanation = `${n1}/${d1} × ${d2}/${n2} = ${n1*d2}/${d1*n2} ≈ ${ans}`;
            break;
        }

        /* ─── نسب مئوية متقدمة ─── */
        case 'ratio': {
            a = rnd(1, 9); b = rnd(1, 9);
            const total = rnd(20, 100);
            ans = Math.round((a / (a + b)) * total);
            text = `قُسّمت ${total} بنسبة ${a}:${b}، الحصة الأولى = ؟`;
            hint = 'قسّم بمجموع نسبَي الحصص';
            explanation = `الحصة الأولى = ${a}/(${a}+${b}) × ${total} = ${ans}`;
            break;
        }
        case 'proportion': {
            a = rnd(2, 10); b = a * rnd(2, 5); c = rnd(2, 8);
            ans = c * (b / a);
            if (!Number.isInteger(ans)) { c = a; ans = b; }
            text = `إذا كان ${a}/${b} = ${c}/؟`;
            hint = 'ضرب متقاطع';
            explanation = `؟ = ${c} × ${b} ÷ ${a} = ${ans}`;
            break;
        }
        case 'percent_reverse': {
            const pct = [10, 20, 25, 50][rnd(0, 3)];
            const result = rnd(1, 20) * pct / 10;
            ans = result * 100 / pct;
            text = `${pct}% من ؟ = ${result}`;
            hint = 'اقسم على النسبة المئوية';
            explanation = `الأصل = ${result} ÷ ${pct}% = ${ans}`;
            break;
        }
        case 'percent_change': {
            const orig = rnd(5, 20) * 10;
            const change = rnd(1, 5) * 10;
            const isIncrease = rnd(0, 1) === 1;
            ans = isIncrease ? orig + (orig * change / 100) : orig - (orig * change / 100);
            text = `${orig} ${isIncrease ? 'زاد' : 'نقص'} بنسبة ${change}%، الجديد = ؟`;
            hint = `احسب ${change}% ثم ${isIncrease ? 'أضف' : 'اطرح'}`;
            explanation = `${orig} × (${isIncrease ? 1 : -1} ${change}%) = ${ans}`;
            break;
        }

        /* ─── معادلات ─── */
        case 'eq_linear': {
            ans = rnd(-10, 15);
            b = rnd(2, 8);
            const rhs = b + ans;
            text = `س + ${b} = ${rhs}`;
            hint = 'عزل المجهول';
            explanation = `س = ${rhs} - ${b} = ${ans}`;
            break;
        }
        case 'eq_two_step': {
            ans = rnd(1, 10);
            const coef = rnd(2, 5), con = rnd(1, 8);
            const rhs2 = coef * ans + con;
            text = `${coef}س + ${con} = ${rhs2}`;
            hint = 'اطرح أولاً ثم اقسم';
            explanation = `${coef}س = ${rhs2 - con}، س = ${ans}`;
            break;
        }
        case 'eq_fraction': {
            /* ✅ FIX-2.2: معادلة س ÷ den = rhs3 → س = rhs3 × den (بسيطة وصحيحة رياضياً) */
            const _den  = rnd(2, 5);
            const _rhs3 = rnd(2, 12);
            const _xAct = _rhs3 * _den;
            text = `س ÷ ${_den} = ${_rhs3}`;
            ans  = _xAct;
            hint = 'اضرب الطرفين في المقام';
            explanation = `س = ${_rhs3} × ${_den} = ${_xAct}`;
            break;
        }

        /* ─── متتاليات ─── */
        case 'seq_arith': {
            a = rnd(-5, 10); b = rnd(-3, 5);
            if (b === 0) b = 2;
            text = `${a}, ${a+b}, ${a+2*b}, ${a+3*b}, ؟`;
            ans = a + 4 * b;
            hint = 'ما الفرق الثابت؟';
            explanation = `الفرق = ${b}، الحد التالي = ${ans}`;
            break;
        }
        case 'seq_geo': {
            a = rnd(1, 5); const r = rnd(2, 3);
            text = `${a}, ${a*r}, ${a*r*r}, ؟`;
            ans = a * r * r * r;
            hint = 'ما الأساس المشترك؟';
            explanation = `الأساس = ${r}، الحد التالي = ${a} × ${r}³ = ${ans}`;
            break;
        }
        case 'seq_neg': {
            a = rnd(5, 20); const d = -rnd(1, 4);
            text = `${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ؟`;
            ans = a + 4 * d;
            hint = 'المتتالية تتناقص';
            explanation = `الفرق = ${d}، الحد التالي = ${ans}`;
            break;
        }

        /* ─── هندسة ─── */
        case 'geo_area': {
            const shapes = ['مستطيل', 'مثلث', 'معين'];
            const shape = shapes[rnd(0, shapes.length - 1)];
            a = rnd(3, 12); b = rnd(3, 12);
            if (shape === 'مستطيل') {
                ans = a * b;
                text = `مساحة مستطيل طوله ${a} وعرضه ${b} = ؟`;
                explanation = `المساحة = ${a} × ${b} = ${ans}`;
            } else if (shape === 'مثلث') {
                ans = Math.round(a * b / 2);
                text = `مساحة مثلث قاعدته ${a} وارتفاعه ${b} = ؟`;
                explanation = `المساحة = ½ × ${a} × ${b} = ${ans}`;
            } else {
                ans = Math.round(a * b / 2);
                text = `مساحة معين قطراه ${a} و ${b} = ؟`;
                explanation = `المساحة = (${a} × ${b}) ÷ 2 = ${ans}`;
            }
            hint = 'تذكّر صيغة المساحة';
            break;
        }
        case 'geo_perimeter': {
            a = rnd(3, 15); b = rnd(3, 15);
            ans = 2 * (a + b);
            text = `محيط مستطيل طوله ${a} وعرضه ${b} = ؟`;
            hint = 'المحيط = 2 × (الطول + العرض)';
            explanation = `= 2 × (${a} + ${b}) = ${ans}`;
            break;
        }
        case 'geo_volume': {
            a = rnd(2, 8); b = rnd(2, 8); c = rnd(2, 6);
            ans = a * b * c;
            text = `حجم متوازي مستطيلات أبعاده ${a}، ${b}، ${c} = ؟`;
            hint = 'الحجم = الطول × العرض × الارتفاع';
            explanation = `= ${a} × ${b} × ${c} = ${ans}`;
            break;
        }

        /* ─── قوانين ─── */
        case 'law_distributive': {
            a = rnd(2, 9); b = rnd(2, 9); c = rnd(2, 9);
            ans = a * (b + c);
            text = `${a} × (${b} + ${c}) = ؟`;
            hint = 'قانون التوزيع';
            explanation = `${a}×${b} + ${a}×${c} = ${a*b} + ${a*c} = ${ans}`;
            break;
        }
        case 'law_commutative': {
            a = rnd(10, 99); b = rnd(10, 99);
            ans = a + b;
            text = `${b} + ${a} = ؟ (مبدأ التبادل)`;
            hint = 'الجمع تبادلي';
            explanation = `${a} + ${b} = ${b} + ${a} = ${ans}`;
            break;
        }
        case 'law_power': {
            a = rnd(2, 5); b = rnd(1, 3); c = rnd(1, 2);
            ans = Math.pow(a, b + c);
            text = `${a}^${b} × ${a}^${c} = ؟`;
            hint = 'قانون الأسس: اجمع الأسس';
            explanation = `${a}^(${b}+${c}) = ${a}^${b+c} = ${ans}`;
            break;
        }

        /* ─── مسائل لفظية متنوعة ─── */
        case 'word_neg': {
            const temp1 = -rnd(5, 20);
            const rise = rnd(1, 10);
            ans = temp1 + rise;
            text = `درجة الحرارة ${temp1}°م ثم ارتفعت ${rise}°م. الجديدة = ؟`;
            hint = 'جمع مع عدد سالب';
            explanation = `${temp1} + ${rise} = ${ans}`;
            break;
        }
        case 'word_fraction': {
            const whole = rnd(10, 50);
            const frac = [2, 3, 4, 5][rnd(0, 3)];
            ans = Math.round(whole / frac);
            text = `قُسّمت ${whole} تفاحة بالتساوي على ${frac} أشخاص. نصيب كل شخص = ؟`;
            hint = 'قسمة على الأشخاص';
            explanation = `${whole} ÷ ${frac} = ${ans}`;
            break;
        }
        case 'word_ratio': {
            a = rnd(2, 6); b = rnd(2, 6);
            const unit = rnd(3, 12);
            ans = a * unit;
            text = `النسبة ${a}:${b}، والكمية الثانية ${b * unit}. الأولى = ؟`;
            hint = 'أوجد قيمة الوحدة ثم اضرب';
            explanation = `الوحدة = ${b*unit}/${b} = ${unit}، الأولى = ${a} × ${unit} = ${ans}`;
            break;
        }
        case 'abs_value': {
            a = -rnd(1, 15);
            ans = Math.abs(a);
            text = `|${a}| = ؟`;
            hint = 'القيمة المطلقة = البُعد عن الصفر';
            explanation = `|${a}| = ${ans}`;
            break;
        }
        case 'sqrt_neg_context': {
            const sq = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
            a = sq[rnd(0, sq.length - 1)];
            ans = Math.sqrt(a);
            text = `√${a} = ؟`;
            hint = 'الجذر التربيعي';
            explanation = `√${a} = ${ans} لأن ${ans}² = ${a}`;
            break;
        }
        default: {
            // mixed_ops
            a = rnd(2, 10); b = rnd(2, 6); c = rnd(1, 5);
            ans = a * b - c;
            text = `${a} × ${b} − ${c} = ؟`;
            hint = 'الضرب أولاً ثم الطرح';
            explanation = `${a*b} - ${c} = ${ans}`;
        }
    }

    // توليد الخيارات الخاطئة (تعمل مع الأعداد السالبة والكسور)
    const ansNum = typeof ans === 'number' ? ans : parseFloat(ans);
    const wrSet = new Set();
    const spread = Math.max(2, Math.ceil(Math.abs(ansNum) * 0.3) + 2);
    let safety = 0;
    while (wrSet.size < 3 && safety < 400) {
        safety++;
        const off = rnd(-spread, spread);
        if (off === 0) continue;
        const candidate = Math.round((ansNum + off) * 100) / 100;
        const key = String(candidate);
        if (!wrSet.has(key) && candidate !== ansNum) wrSet.add(key);
    }
    let extra = 1;
    while (wrSet.size < 3) { wrSet.add(String(Math.round((ansNum + extra * 3) * 100) / 100)); extra++; }

    const choicesArr = shuffle([ansNum, ...[...wrSet].map(Number)]);

    return {
        text,
        hint,
        answer: ansNum,
        choices: choicesArr,
        explanation,
        catKey: getCatStatsKeyDiverse(ch)
    };
}

/** دالة مساعدة: أكبر قاسم مشترك */
function gcd(a, b) {
    a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
    while (b) { const t = b; b = a % b; a = t; }
    return a || 1;
}

/** تحديد catKey لأنواع الأسئلة المتنوعة */
function getCatStatsKeyDiverse(ch) {
    if (ch.startsWith('neg_')) return 'subtraction';
    if (ch.startsWith('frac_')) return 'division';
    if (ch.startsWith('ratio') || ch.startsWith('proportion') || ch.startsWith('percent')) return 'percentage';
    if (ch.startsWith('eq_')) return 'algebra';
    if (ch.startsWith('seq_')) return 'puzzles';
    if (ch.startsWith('geo_')) return 'geometry';
    if (ch.startsWith('law_')) return 'mathlaws';
    if (ch.startsWith('word_')) return 'wordproblems';
    return 'algebra';
}

/* ═══ مولّد موسّع للائحة القوانين ═══ */
const EXTENDED_LAWS_POOL = [
    /* الجبر والمعادلات */
    { text: 'ما ناتج 3 × (4 + 5) وفق قانون التوزيع؟', ans: 27, explanation: '3×4 + 3×5 = 12+15 = 27' },
    { text: 'ما قيمة 5⁰؟', ans: 1, explanation: 'أي عدد غير صفري مرفوع للأس صفر = 1' },
    { text: 'حل: 2س + 4 = 16', ans: 6, explanation: '2س = 12، س = 6' },
    { text: 'حل: 3س − 9 = 0', ans: 3, explanation: '3س = 9، س = 3' },
    { text: 'حل: س/4 = 5', ans: 20, explanation: 'س = 5 × 4 = 20' },
    { text: 'حل: 5(س − 2) = 15', ans: 5, explanation: 'س − 2 = 3، س = 5' },
    { text: 'ما قيمة 2⁸؟', ans: 256, explanation: '2⁸ = 256' },
    { text: 'ما قيمة 3⁴؟', ans: 81, explanation: '3×3×3×3 = 81' },
    { text: '2³ × 2² = 2^؟', ans: 5, explanation: 'قانون الأسس: نجمع الأسس → 2^5 = 32، الأس = 5' },
    { text: 'ما قيمة 10³ ÷ 10²؟', ans: 10, explanation: '10^(3-2) = 10¹ = 10' },
    /* الهندسة */
    { text: 'مساحة مربع طول ضلعه 7؟', ans: 49, explanation: 'المساحة = الضلع² = 49' },
    { text: 'محيط مربع طول ضلعه 6؟', ans: 24, explanation: 'المحيط = 4 × 6 = 24' },
    { text: 'ما محيط دائرة نصف قطرها 5 (π≈3.14)؟', ans: 31, explanation: '2×3.14×5 ≈ 31' },
    { text: 'مساحة مثلث قاعدته 10 وارتفاعه 6؟', ans: 30, explanation: '½ × 10 × 6 = 30' },
    { text: 'مساحة دائرة نصف قطرها 3 (π≈3)؟', ans: 27, explanation: 'π × 3² ≈ 3 × 9 = 27' },
    { text: 'حجم مكعب طول ضلعه 4؟', ans: 64, explanation: '4³ = 64' },
    { text: 'محيط مثلث متساوي الأضلاع طول ضلعه 8؟', ans: 24, explanation: '3 × 8 = 24' },
    /* الحساب والنسب */
    { text: 'ما متوسط الأعداد 4، 8، 12، 16؟', ans: 10, explanation: '(4+8+12+16)/4 = 40/4 = 10' },
    { text: 'ما 30% من 200؟', ans: 60, explanation: '200 × 0.3 = 60' },
    { text: 'ما 75% من 80؟', ans: 60, explanation: '80 × 0.75 = 60' },
    { text: 'ما النسبة المئوية لـ 15 من 60؟', ans: 25, explanation: '15/60 × 100 = 25%' },
    { text: 'ما 1/3 من 99؟', ans: 33, explanation: '99 ÷ 3 = 33' },
    { text: 'ناتج (1/2) ÷ (1/4) = ؟', ans: 2, explanation: '(1/2) × 4 = 2' },
    { text: 'ما قيمة 1/2 + 1/3؟', ans: 0.83, explanation: '3/6 + 2/6 = 5/6 ≈ 0.83' },
    /* أعداد سالبة */
    { text: 'ما ناتج (−3) × (−4)؟', ans: 12, explanation: 'سالب × سالب = موجب' },
    { text: 'ما ناتج (−5) × 3؟', ans: -15, explanation: 'سالب × موجب = سالب' },
    { text: 'ما ناتج (−20) ÷ (−4)؟', ans: 5, explanation: 'سالب ÷ سالب = موجب' },
    { text: '|−13| = ؟', ans: 13, explanation: 'القيمة المطلقة دائماً موجبة' },
    { text: 'ما ناتج −8 + (−5)؟', ans: -13, explanation: '−8 − 5 = −13' },
    { text: 'ما ناتج −7 − (−3)؟', ans: -4, explanation: '−7 + 3 = −4' },
    /* الجذور والأسس */
    { text: 'جذر 144 = ؟', ans: 12, explanation: '12² = 144' },
    { text: 'جذر 225 = ؟', ans: 15, explanation: '15² = 225' },
    { text: 'الجذر التكعيبي لـ 27 = ؟', ans: 3, explanation: '3³ = 27' },
    { text: 'الجذر التكعيبي لـ 64 = ؟', ans: 4, explanation: '4³ = 64' },
    { text: '√169 = ؟', ans: 13, explanation: '13² = 169' },
    /* متتاليات وأنماط */
    { text: 'ما الحد التالي: 1، 4، 9، 16، ؟', ans: 25, explanation: 'مربعات: 5² = 25' },
    { text: 'ما الحد التالي: 2، 6، 18، 54، ؟', ans: 162, explanation: 'كل حد يُضرب في 3' },
    { text: 'ما الحد التالي: 100، 50، 25، ؟', ans: 12.5, explanation: 'كل حد يُقسم على 2' },
    /* قوانين احتمالات ومتوسطات */
    { text: 'إذا رمينا حجر نرد احتمال ظهور 3 = ؟ (كسر)', ans: 0.17, explanation: '1/6 ≈ 0.17' },
    { text: 'المدى للأعداد 3، 7، 15، 2، 10 = ؟', ans: 13, explanation: 'أكبر − أصغر = 15 − 2 = 13' },
    { text: 'الوسيط للأعداد 1، 3، 5، 7، 9 = ؟', ans: 5, explanation: 'العدد الأوسط في المتسلسلة = 5' },
];

/**
 * يولّد سؤالاً من مجموعة القوانين الموسّعة
 */
function genExtendedLawQ() {
    const q = EXTENDED_LAWS_POOL[rnd(0, EXTENDED_LAWS_POOL.length - 1)];
    const ansNum = typeof q.ans === 'number' ? q.ans : parseFloat(q.ans);
    const spread = Math.max(2, Math.ceil(Math.abs(ansNum) * 0.25) + 2);
    const wrSet = new Set();
    let safety = 0;
    while (wrSet.size < 3 && safety < 400) {
        safety++;
        const off = rnd(-spread, spread);
        if (off === 0) continue;
        const candidate = Math.round((ansNum + off) * 100) / 100;
        if (candidate !== ansNum) wrSet.add(String(candidate));
    }
    let extra = 1;
    while (wrSet.size < 3) { wrSet.add(String(Math.round((ansNum + extra * 4) * 100) / 100)); extra++; }

    return {
        text: q.text,
        hint: 'تطبيق قانون رياضي',
        answer: ansNum,
        choices: shuffle([ansNum, ...[...wrSet].map(Number)]),
        explanation: q.explanation,
        catKey: 'mathlaws'
    };
}
