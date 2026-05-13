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
                explanation = `الفرق = ${b}، الرقم التالي = ${ans}`; } else if (ch === 'fraction_simple') { let d = rnd(
                    2, 6);
                let n1 = rnd(1, d - 1);
                let n2 = rnd(1, d - 1);
                ans = n1 + n2;
                text = `${n1}/${d} + ${n2}/${d}`;
                hint = 'اجمع الكسور ذات المقام المشترك';
                explanation = `الناتج = ${ans}/${d}`; } else if (ch === 'word_add') { let x = rnd(10, 50);
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
            G.helpersUsed = { skip: false, remove: false };
            G.askedQuestions = [];
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
            let hasTimer = false;
            let lives = 3;
            if (mode === 'classic') {
                G.totalQ = 10;
                hasTimer = forceTimer;
                if (hasTimer) { G.maxTime = 60;
                    G.timeLeft = 60;
                    lives = 3; } else { G.maxTime = 0;
                    G.timeLeft = 0;
                    lives = 0; }
            } else if (mode === 'speed') { G.totalQ = 9999;
                hasTimer = true;
                G.maxTime = 60;
                G.timeLeft = 60;
                lives = 3; } else if (mode === 'survival') { G.totalQ = 9999;
                hasTimer = false;
                lives = 0; } else if (mode === 'frenzy') { G.totalQ = 9999;
                hasTimer = true;
                G.maxTime = 30;
                G.timeLeft = 30;
                lives = 3; } else if (mode === 'daily') { G.totalQ = 5;
                hasTimer = false;
                lives = 0; }
            G.livesLeft = lives;
            G.hasTimer = hasTimer;
            G.helpersUsed = { skip: false, remove: false };
            const titles = { classic: '🧮 كلاسيك', speed: '⚡ سرعة 60ث', survival: '🔥 التحمّل', frenzy: '💥 اندفاع',
                daily: '🌟 تحدي اليوم' };
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
            if (type === 'skip') {
                if (st.coins < 3) { showFeedback('💸 تحتاج 3💰'); return; }
                if (G.helpersUsed.skip) { showFeedback('⏭️ استُخدم'); return; }
                st.coins -= 3;
                G.coinsEarned = Math.max(0, G.coinsEarned - 1);
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
                if (st.coins < 7) { showFeedback('💸 تحتاج 7💰'); return; }
                st.coins -= 7;
                G.livesLeft++;
                saveSt();
                updateUI();
                updateHeartsDisplay();
                updateGameCoinsDisplay();
                showFeedback('💖 +1 قلب!');
                playSound('levelup');
            }
        }

        /* ═══════════ LOAD QUESTION ═══════════ */
        function loadQuestion() {
            if (G.ended) return;
            if (G.currentQ >= G.totalQ && !G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !==
                'frenzy') { endGame(); return; }
            G.currentQ++;
            G.answered = false;
            G.helpersUsed.remove = false;
            document.getElementById('helperRemove').classList.remove('used');
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
                        q = generateAgeAdaptiveQuestion(G.op, st.difficulty, age);
                        if (!q.choices || q.choices.length < 4) q = genQ(G.op, st.difficulty);
                    }
                } else {
                    if (G.op === 'table' && G.customTable) {
                        q = genQ('table', st.difficulty, G.customTable);
                    } else {
                        if (G.op === 'advanced') q = genQ('advanced', st.difficulty);
                        else if (G.op === 'laws') q = genQ('laws', st.difficulty);
                        else {
                            let useDiff = st.difficulty;
                            if (G.mode === 'classic' && !useDiff) useDiff = getDifficultyByLevel();
                            q = genQ(G.op, useDiff);
                        }
                    }
                }
                const qKey = q.text + '|' + q.answer;
                if (!G.askedQuestions.includes(qKey) || G.isTraining) break;
                attempts++;
                if (attempts > maxAttempts) break;
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
                    G.mode === 'speed' ? `⚡ السؤال ${G.correct+1}` :
                    G.mode === 'frenzy' ? `💥 ${G.correct+1} إجابة` :
                    G.mode === 'survival' ? `❤️ ${G.livesLeft} قلوب` :
                    `السؤال ${G.currentQ} من ${G.totalQ}`;
            }
            document.getElementById('questionText').textContent = `${q.text} = ?`;
            document.getElementById('questionHint').textContent = q.hint || 'ما هو الجواب؟';
            document.getElementById('statQ').textContent = (G.isTraining || G.mode === 'speed' || G.mode ===
                'survival' || G.mode === 'frenzy') ? G.correct : `${G.currentQ}/${G.totalQ}`;
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
        let CG = {
            active: false,
            score: 0,
            questionIndex: 0,
            answered: false,
            ended: false,
            correctAnswer: 0,
            currentExplanation: '',
            askedQuestions: []
        };

        function startChallengeGame() {
            CG = {
                active: true,
                score: 0,
                questionIndex: 0,
                answered: false,
                ended: false,
                correctAnswer: 0,
                currentExplanation: '',
                askedQuestions: []
            };
            // إخفاء واجهة الترحيب وإظهار واجهة اللعبة
            document.getElementById('challengeWelcome').style.display = 'none';
            document.getElementById('challengeGameArea').style.display = 'flex';
            document.getElementById('challengeScoreDisplay').textContent = '0';
            loadChallengeQuestion();
        }

        function endChallengeGame() {
            if (CG.ended) return;
            CG.ended = true;
            CG.active = false;
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
                CG.score++;
                CG.questionIndex++;
                document.getElementById('challengeScoreDisplay').textContent = CG.score;
                showFeedback('✅');
                playSound('correct');
                if (CG.score % 10 === 0 && CG.score > 0) { doConfetti(); showComboEffect(CG.score); }
                showFloatXP(1);
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('#challengeAnswersGrid .answer-btn').forEach(b => {
                    if (parseInt(b.getAttribute('data-val')) === CG.correctAnswer) b.classList.add('correct');
                });
                showFeedback('❌');
                playSound('wrong');
                // إظهار الشرح
                const expArea = document.getElementById('challengeExplanation');
                expArea.innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${CG.correctAnswer}</strong><br>الشرح: ${CG.currentExplanation}</div>`;
                expArea.style.display = 'block';
            }

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
            document.getElementById('challengeResultArea').style.display = 'none';
            document.getElementById('challengeWelcome').style.display = 'flex';
        }

        /* ═══════════ مزامنة نتيجة التحدي مع Firebase ═══════════ */
        function syncChallengeScore(score) {
            if (!database || !st.serialNumber) return;
            try {
                const ref = database.ref('challenge_leaderboard/' + st.serialNumber);
                ref.once('value', snap => {
                    const existing = snap.val();
                    if (!existing || score > (existing.challengeScore || 0)) {
                        ref.set({
                            name: st.name,
                            avatar: st.avatar || '🧑',
                            level: st.level,
                            challengeScore: score,
                            lastUpdated: Date.now()
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

