/* DATA & ACHIEVEMENTS */
        /* ═══════════ ACHIEVEMENTS ═══════════ */
        const ACHIEVEMENTS_DEF = [
            { id: 'first_correct', icon: '🎯', name: 'أول إجابة صحيحة', desc: 'أجب على سؤال واحد صحيح', check: () => st
                    .correctTotal >= 1, reward: 2 },
            { id: 'ten_correct', icon: '🔟', name: '10 إجابات', desc: 'أجب على 10 أسئلة صحيحة', check: () => st.correctTotal >=
                    10, reward: 3 },
            { id: 'fifty_correct', icon: '💯', name: '50 إجابة', desc: 'أجب على 50 سؤالاً صحيحاً', check: () => st
                    .correctTotal >= 50, reward: 5 },
            { id: 'combo5', icon: '🔥', name: 'تتابع ×5', desc: 'حقّق تتابع 5 إجابات صحيحة', check: () => st.bestStreak >=
                5, reward: 4 },
            { id: 'combo10', icon: '💥', name: 'تتابع ×10', desc: 'حقّق تتابع 10 إجابات صحيحة', check: () => st.bestStreak >=
                    10, reward: 8 },
            { id: 'speed10', icon: '⚡', name: 'سرعة 10 نقاط', desc: 'سجّل 10 نقاط في وضع السرعة', check: () => st
                    .bestScore >= 10, reward: 3 },
            { id: 'speed25', icon: '🚀', name: 'سرعة 25 نقطة', desc: 'سجّل 25 نقطة في وضع السرعة', check: () => st
                    .bestScore >= 25, reward: 6 },
            { id: 'level5', icon: '⬆️', name: 'المستوى 5', desc: 'وصل إلى المستوى 5', check: () => st.level >= 5,
                reward: 10 },
            { id: 'level20', icon: '👑', name: 'المستوى 20', desc: 'وصل إلى المستوى 20', check: () => st.level >= 20,
                reward: 20 },
            { id: 'all_basic_stars', icon: '🌟', name: 'أستاذ الأساسيات',
                desc: '15 نجمة في كل من الجمع والطرح والضرب والقسمة والجدول', check: () => ['addition', 'subtraction',
                    'multiplication', 'division', 'table'
                ].every(k => (st.stats[k]?.stars || 0) >= 15), reward: 10 },
            { id: 'perfect_10', icon: '✨', name: 'مثالي ×10', desc: '10 مرات مثالية (3 نجوم)', check: () => Object.values(
                    st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10, reward: 8 },
            { id: 'coins100', icon: '💰', name: 'مئة عملة', desc: 'اجمع 100 عملة', check: () => st.coins >= 100,
            reward: 0 },
            { id: 'play1h', icon: '⏱️', name: 'ساعة لعب', desc: 'ساعة كاملة من وقت اللعب', check: () => getSessionSecs() >=
                    3600, reward: 12 },
            { id: 'hard_unlock', icon: '🔓', name: 'فتح الصعب', desc: 'وصل للمستوى المطلوب لفتح الصعب', check: () => st
                    .level >= 5, reward: 5 },
            { id: 'five_perfect', icon: '🏅', name: '5 فئات مثالية', desc: '5 فئات حصلت على تقييم مثالي', check: () => Object
                    .values(st.stats).filter(s => (s.stars || 0) >= 15).length >= 5, reward: 15 },
            { id: 'young_math', icon: '🧒', name: 'رياضي صغير', desc: 'عمرك أقل من 12 وأجبت 20 صحيحة', check: () => st
                    .age && st.age < 12 && st.correctTotal >= 20, reward: 10 },
            { id: 'algebra_master', icon: '📐', name: 'أستاذ الجبر', desc: 'عمرك 18+ وأجبت 20 في الجبر', check: () => st
                    .age && st.age >= 18 && (st.stats['algebra']?.cor || 0) >= 20, reward: 15 },
            { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة', check: () => st.age &&
                    st.age >= 60 && st.correctTotal >= 30, reward: 20 },
        ];

        function checkAchievements() {
            let newUnlocks = [];
            ACHIEVEMENTS_DEF.forEach(a => {
                if (!st.achievementsUnlocked.includes(a.id) && a.check()) {
                    st.achievementsUnlocked.push(a.id);
                    if (a.reward > 0) st.coins += a.reward;
                    newUnlocks.push(a.name);
                }
            });
            if (newUnlocks.length) { saveSt();
                showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`);
                playSound('levelup');
                updateUI(); }
            if (st.achievementsUnlocked.length === ACHIEVEMENTS_DEF.length && !st.achievementRewardClaimed) {
                st.achievementRewardClaimed = true;
                st.coins += 5;
                saveSt();
                showFeedback('🎉 جميع الإنجازات! +5 عملات إضافية');
                playSound('levelup');
                updateUI();
            }
        }

        function renderAchievements() {
            const el = document.getElementById('achieveList');
            if (!el) return;
            const total = ACHIEVEMENTS_DEF.length;
            const doneCount = st.achievementsUnlocked.length;
            document.getElementById('achievePct').textContent = `${doneCount}/${total}`;
            el.innerHTML = ACHIEVEMENTS_DEF.map(a => {
                let done = st.achievementsUnlocked.includes(a.id) || a.check();
                return `<div class="task-item ${done?'done':''}">
                    <div class="task-item-icon">${a.icon}</div>
                    <div class="task-item-info">
                        <div class="task-item-name">${a.name}</div>
                        <div class="task-item-desc">${a.desc}</div>
                    </div>
                    <div class="task-right">
                        <div class="task-reward">${done?'✅':`+${a.reward}💰`}</div>
                    </div>
                </div>`;
            }).join('');
            const rewardDiv = document.getElementById('achieveCompleteReward');
            if (rewardDiv) rewardDiv.style.display = doneCount === total ? 'block' : 'none';
        }

        const BADGES = {
            speed30: { icon: '⚡', cond: () => st.bestScore >= 30 },
            perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >=
                10 },
            level10: { icon: '🔷', cond: () => st.level >= 10 },
            allBasic: { icon: '🏅', cond: () => ['addition', 'subtraction', 'multiplication', 'division',
                    'table'
                ].every(k => (st.stats[k]?.stars || 0) >= 15) }
        };

        function updateBadgeIcon() {
            const el = document.getElementById('badgeDisplay');
            if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join('');
        }

        function genDailyTasks() {
            return [
                { id: 't1', icon: '🎯', name: 'أول إجابة', desc: 'أجب على سؤال واحد صحيح', reward: 1, goal: 1,
                    progress: 0, done: false },
                { id: 't2', icon: '🔥', name: 'تتابع ×3', desc: '3 إجابات صحيحة متتالية', reward: 3, goal: 3,
                    progress: 0, done: false },
                { id: 't3', icon: '⚡', name: '10 إجابات صحيحة', desc: 'أجب على 10 أسئلة صحيحة', reward: 5, goal: 10,
                    progress: 0, done: false },
                { id: 't4', icon: '🏃', name: 'جلستان كاملتان', desc: 'أنهِ جلستَي لعب كاملتَين', reward: 4, goal: 2,
                    progress: 0, done: false },
                { id: 't5', icon: '💎', name: '25 إجابة', desc: 'أجب على 25 سؤالاً صحيحاً', reward: 8, goal: 25,
                    progress: 0, done: false },
                { id: 't6', icon: '🌟', name: 'تحدي اليوم', desc: 'العب تحدي اليوم الخاص مرة', reward: 2, goal: 1,
                    progress: 0, done: false },
            ];
        }

        function checkDailyReset() {
            if (st.dailyDate !== todayStr() || !st.dailyTasks || st.dailyTasks.length === 0) {
                st.dailyTasks = genDailyTasks();
                st.dailyDate = todayStr();
                saveSt();
            }
        }

        function updTask(type, amount = 1) {
            checkDailyReset();
            const T = st.dailyTasks;
            let changed = false;
            if (type === 'correct') {
                ['t1', 't3', 't5'].forEach(id => {
                    const t = T.find(x => x.id === id);
                    if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + amount); if (t.progress >= t
                            .goal) { t.done = true;
                            st.coins += t.reward;
                            changed = true; } }
                });
            }
            if (type === 'streak' && amount >= 3) { const t = T.find(x => x.id === 't2'); if (t && !t.done) { t.progress =
                        t.goal;
                    t.done = true;
                    st.coins += t.reward;
                    changed = true; } }
            if (type === 'game') { const t = T.find(x => x.id === 't4'); if (t && !t.done) { t.progress = Math.min(t.goal, t
                        .progress + 1); if (t.progress >= t.goal) { t.done = true;
                        st.coins += t.reward;
                        changed = true; } } }
            if (type === 'daily') { const t = T.find(x => x.id === 't6'); if (t && !t.done) { t.progress = t.goal;
                    t.done = true;
                    st.coins += t.reward;
                    changed = true; } }
            if (changed) playSound('levelup');
            saveSt();
            renderTasks();
        }

        function renderTasksFiltered() {
            const level = st.level;
            const tasksData = st.dailyTasks;
            let filtered = tasksData;
            if (level < 2) filtered = tasksData.filter(t => ['t1', 't2'].includes(t.id));
            else if (level < 4) filtered = tasksData.filter(t => ['t1', 't2', 't3'].includes(t.id));
            else if (level < 5) filtered = tasksData.filter(t => ['t1', 't2', 't3', 't4'].includes(t.id));
            else filtered = tasksData;
            const doneCount = filtered.filter(t => t.done).length;
            const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;
            const totalR = filtered.filter(t => t.done).reduce((s, t) => s + t.reward, 0);
            const tasksContainer = document.getElementById('tasksList');
            if (tasksContainer) {
                tasksContainer.innerHTML = filtered.map(t => {
                    const p = Math.min(100, Math.round((t.progress / t.goal) * 100));
                    return `<div class="task-item ${t.done?'done':''}">
                        <div class="task-item-icon">${t.icon}</div>
                        <div class="task-item-info"><div class="task-item-name">${t.name}</div><div class="task-item-desc">${t.desc}</div><div class="task-prog-bar"><div class="task-prog-fill" style="width:${p}%"></div></div></div>
                        <div class="task-right"><div class="task-reward">${t.done?'✅':`+${t.reward}💰`}</div>${t.done?'':`<div class="task-prog-txt">${t.progress}/${t.goal}</div>`}</div>
                    </div>`;
                }).join('');
            }
            document.getElementById('tasksDone').textContent = doneCount;
            document.getElementById('tasksTotal').textContent = filtered.length;
            document.getElementById('tasksCoins').textContent = totalR + '💰';
            document.getElementById('tasksPct').textContent = pct + '%';
            document.getElementById('tasksBarFill').style.width = pct + '%';
            const _pts = document.getElementById('profileTaskStatus'); if(_pts) _pts.textContent = `${doneCount} / ${filtered.length} ›`;
        }
        var renderTasks = renderTasksFiltered;
        window.renderTasks = renderTasksFiltered;

        function updCountdown() {
            const now = new Date(),
                midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const d = midnight - now;
            const h = String(Math.floor(d / 3600000)).padStart(2, '0');
            const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
            const timeStr = `${h}:${m}:${s}`;
            const el = document.getElementById('dailyCountdown');
            if (el) el.textContent = timeStr;
            const el2 = document.getElementById('profileDailyCountdown');
            if (el2) el2.textContent = timeStr;
        }
        setInterval(updCountdown, 1000);
        var sessionStart = Date.now();

        function getSessionSecs() {
            if (st.sessionDate !== todayStr()) { st.sessionTimeSecs = 0;
                st.sessionDate = todayStr();
                saveSt(); }
            return st.sessionTimeSecs + Math.floor((Date.now() - sessionStart) / 1000);
        }

        function fmtTime(s) {
            const h = String(Math.floor(s / 3600)).padStart(2, '0');
            const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
            const sc = String(s % 60).padStart(2, '0');
            return `${h}:${m}:${sc}`;
        }

        function updSessionTimer() {
            const el = document.getElementById('sessionTimerDisplay');
            if (el) el.textContent = fmtTime(getSessionSecs());
        }
        setInterval(updSessionTimer, 1000);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { st.sessionTimeSecs = getSessionSecs();
                st.sessionDate = todayStr();
                saveSt();
                sessionStart = Date.now(); }
        });

        function showConfirm(title, msg, yesText, noText, cb) {
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMsg').textContent = msg;
            document.getElementById('confirmBtnYes').textContent = yesText || 'نعم';
            document.getElementById('confirmBtnNo').textContent = noText || 'إلغاء';
            const ov = document.getElementById('confirmOverlay');
            ov.classList.add('active');
            document.getElementById('confirmBtnYes').onclick = () => { ov.classList.remove('active');
                cb && cb(true); };
            document.getElementById('confirmBtnNo').onclick = () => { ov.classList.remove('active');
                cb && cb(false); };
        }

        /* ═══════════ LAWS DATA ═══════════ */
        const LAWS_DATA = [
            { cat: 'العمليات الأساسية', laws: [
                    { title: 'قانون الجمع التبادلي', formula: 'أ + ب = ب + أ', desc: 'تبديل الأعداد في الجمع لا يغير الناتج.',
                        example: '3+5=5+3=8' },
                    { title: 'قانون الجمع التجميعي', formula: '(أ + ب) + ج = أ + (ب + ج)',
                        desc: 'تجميع الأعداد في الجمع لا يؤثر على النتيجة.', example: '(2+3)+4=2+(3+4)=9' },
                    { title: 'قانون الضرب التبادلي', formula: 'أ × ب = ب × أ', desc: 'تبديل الأعداد في الضرب لا يغير الناتج.',
                        example: '4×5=5×4=20' },
                    { title: 'قانون الضرب التجميعي', formula: '(أ × ب) × ج = أ × (ب × ج)',
                        desc: 'تجميع الأعداد في الضرب لا يؤثر.', example: '(2×3)×4=2×(3×4)=24' },
                    { title: 'قانون التوزيع', formula: 'أ × (ب + ج) = أ×ب + أ×ج', desc: 'توزيع الضرب على الجمع.',
                        example: '3×(4+5)=12+15=27' },
                    { title: 'العنصر المحايد الجمعي', formula: 'أ + 0 = أ', desc: 'الصفر لا يغير قيمة العدد.',
                    example: '7+0=7' },
                    { title: 'العنصر المحايد الضربي', formula: 'أ × 1 = أ', desc: 'الواحد لا يغير قيمة العدد.',
                    example: '9×1=9' },
                    { title: 'المعكوس الجمعي', formula: 'أ + ( -أ ) = 0', desc: 'معكوس العدد هو سالبه.',
                        example: '5 + (-5) = 0' },
                    { title: 'المعكوس الضربي', formula: 'أ × (1/أ) = 1 (أ≠0)', desc: 'مقلوب العدد.',
                    example: '4 × 1/4 = 1' },
                    { title: 'قانون صفر الضرب', formula: 'أ × 0 = 0', desc: 'أي عدد مضروب في صفر يساوي صفر.',
                        example: '99 × 0 = 0' },
                ] },
            { cat: 'قوى وجذور', laws: [
                    { title: 'أساس مرفوع لصفر', formula: 'أ⁰ = 1 (أ≠0)',
                        desc: 'أي عدد غير صفري مرفوع للأس صفر يساوي 1.', example: '7⁰ = 1' },
                    { title: 'ضرب الأسس', formula: 'أ^م × أ^ن = أ^(م+ن)', desc: 'عند ضرب أساسات متساوية نجمع الأسس.',
                        example: '2³ × 2⁴ = 2⁷ = 128' },
                    { title: 'قسمة الأسس', formula: 'أ^م ÷ أ^ن = أ^(م-ن)', desc: 'عند قسمة أساسات متساوية نطرح الأسس.',
                        example: '5⁶ ÷ 5² = 5⁴ = 625' },
                    { title: 'أس القوة', formula: '(أ^م)^ن = أ^(م×ن)', desc: 'رفع قوة لقوة.', example: '(3²)³ = 3⁶ = 729' },
                    { title: 'الجذر التربيعي', formula: '√(أ²) = |أ|',
                        desc: 'الجذر التربيعي لمربع عدد يساوي قيمته المطلقة.', example: '√(25)=5' },
                    { title: 'ضرب الجذور', formula: '√أ × √ب = √(أ×ب)', desc: 'جذر حاصل الضرب = حاصل ضرب الجذور.',
                        example: '√2 × √8 = √16 = 4' },
                ] },
            { cat: 'كسور ونسب مئوية', laws: [
                    { title: 'توحيد المقامات', formula: 'أ/ب + ج/د = (أ×د + ج×ب)/(ب×د)',
                        desc: 'لجمع أو طرح كسرين نوحد المقام.', example: '1/2 + 1/3 = 5/6' },
                    { title: 'ضرب الكسور', formula: '(أ/ب) × (ج/د) = (أ×ج)/(ب×د)', desc: 'بسط في بسط ومقام في مقام.',
                        example: '(2/3)×(3/4)=6/12=1/2' },
                    { title: 'قسمة الكسور', formula: '(أ/ب) ÷ (ج/د) = (أ/ب) × (د/ج)',
                        desc: 'اضرب في مقلوب الكسر الثاني.', example: '(1/2)÷(1/4)= (1/2)×4=2' },
                    { title: 'النسبة المئوية', formula: 'ن% من س = (ن/100) × س',
                desc: 'حساب النسبة المئوية من عدد.', example: '20% من 50 = 10' },
                ] },
            { cat: 'هندسة وقياس', laws: [
                    { title: 'مساحة المربع', formula: 'م = الضلع²', desc: 'مربع طول ضلعه l → المساحة l².',
                        example: 'ضلع=4 → م=16' },
                    { title: 'مساحة المستطيل', formula: 'م = الطول × العرض', desc: 'حاصل ضرب الطول في العرض.',
                        example: 'طول=8, عرض=3 → م=24' },
                    { title: 'مساحة المثلث', formula: 'م = (القاعدة × الارتفاع)/2',
                        desc: 'نصف حاصل ضرب القاعدة في الارتفاع.', example: 'قاعدة=6, ارتفاع=4 → م=12' },
                    { title: 'مساحة الدائرة', formula: 'م = π نق²', desc: 'π≈3.14',
                example: 'نق=5 → م=78.5' },
                    { title: 'محيط الدائرة', formula: 'محيط = 2π نق', desc: 'المسافة حول الدائرة.',
                        example: 'نق=7 → محيط≈43.96' },
                    { title: 'نظرية فيثاغورس', formula: 'أ² + ب² = ج²',
                        desc: 'في المثلث القائم: مربع الوتر = مجموع مربعي الضلعين.', example: '3²+4²=5²' },
                    { title: 'حجم المكعب', formula: 'ح = الضلع³', desc: 'حجم المكعب = طول الضلع مكعب.',
                        example: 'ضلع=3 → ح=27' },
                    { title: 'حجم متوازي المستطيلات', formula: 'ح = الطول × العرض × الارتفاع',
                desc: 'حجم المنشور.', example: '2×3×4=24' },
                ] },
            { cat: 'جبر ومعادلات', laws: [
                    { title: 'حل المعادلة الخطية', formula: 'س = (ج - ب)/أ إذا كانت أ س + ب = ج',
                        desc: 'إيجاد قيمة المجهول.', example: '2س+3=7 → س=2' },
                    { title: 'قانون إشارات الضرب', formula: '(-) × (-) = + , (+) × (-) = -',
                        desc: 'ضرب عددين سالبين يعطي موجب، وضرب مختلفي الإشارة يعطي سالب.',
                    example: '(-3)×(-4)=12' },
                    { title: 'خاصية التوزيع للطرح', formula: 'أ × (ب - ج) = أ×ب - أ×ج',
                        desc: 'توزيع الضرب على الطرح.', example: '5×(6-2)=5×4=20' },
                    { title: 'صيغة المعادلة التربيعية', formula: 'س = [-ب ± √(ب²-4أج)]/(2أ)',
                        desc: 'حل معادلة أ س² + ب س + ج = 0', example: 'س²-5س+6=0 → س=2 أو 3' },
                ] },
            { cat: 'متتاليات ومنطق', laws: [
                    { title: 'المتتالية الحسابية', formula: 'ح_ن = ح₁ + (ن-1)د',
                        desc: 'الحد النوني = الحد الأول + (ن-1)×الفرق.',
                    example: '3,5,7,9,... الحد العاشر=3+9×2=21' },
                    { title: 'المتتالية الهندسية', formula: 'ح_ن = ح₁ × ر^(ن-1)',
                        desc: 'الحد النوني = الحد الأول × الأساس^(ن-1).',
                    example: '2,6,18,54,... الحد الرابع=2×3³=54' },
                    { title: 'قانون الثالث المنطقي', formula: 'إذا كان أ > ب و ب > ج ==> أ > ج',
                        desc: 'العلاقة متعدية.', example: '5>3 و 3>1 → 5>1' },
                ] },
            { cat: 'أساسيات الإحصاء', laws: [
                    { title: 'المتوسط الحسابي', formula: 'متوسط = (مجموع القيم) / عددها', desc: 'معدل البيانات.',
                        example: 'لقيم 2,4,6 → المتوسط=12/3=4' },
                    { title: 'الوسيط', formula: 'القيمة الوسطى بعد الترتيب', desc: 'الوسيط = منتصف البيانات.',
                        example: '1,3,5,7,9 → الوسيط=5' },
                ] },
            { cat: 'تحويلات ووحدات', laws: [
                    { title: 'تحويل الدرجة إلى راديان', formula: 'راديان = درجة × (π/180)',
                        desc: 'التحويل بين وحدات الزاوية.', example: '90° = π/2 راديان' },
                    { title: 'قانون السرعة', formula: 'ع = المسافة / الزمن',
                        desc: 'السرعة المتوسطة = المسافة الكلية / الزمن الكلي.',
                example: '100كم في 2س → سرعة=50كم/س' },
                ] }
        ];

        function openLaws() {
            const el = document.getElementById('lawsContent');
            el.innerHTML = LAWS_DATA.map(cat => `
                <div style="margin-bottom:14px;"><div class="section-label" style="margin-bottom:8px;">${cat.cat}</div>
                ${cat.laws.map(law=>`<div class="law-card"><div class="law-title">📌 ${law.title}</div><div class="law-formula">${law.formula}</div><div class="law-desc">${law.desc}</div><div class="law-example">مثال: ${law.example}</div></div>`).join('')}
                </div>`).join('');
            document.getElementById('lawsOverlay').classList.add('active');
        }

        function closeLaws() { document.getElementById('lawsOverlay').classList.remove('active'); }
