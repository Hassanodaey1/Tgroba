        /* ═══════════ GLOBAL STATE ═══════════ */
        const SK = 'ho_math_v7';

        function todayStr() {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }

        function defState() {
            return {
                name: 'Player',
                age: 0,
                birthDate: '2000-01-01',
                gender: 'm',
                avatar: '👦',
                xp: 0,
                xpToNext: 1000,
                level: 1,
                coins: 10,
                correctTotal: 0,
                wrongTotal: 0,
                bestStreak: 0,
                totalGames: 0,
                bestScore: 0,
                difficulty: 'easy',
                lastMode: 'classic',
                lastOp: 'mix',
                soundOn: true,
                bgOn: true,
                stats: {},
                history: [],
                catCounter: { correct: 0, total: 0 },
                catChallenges: { games: 0 },
                dailyTasks: genDailyTasks(),
                dailyDate: todayStr(),
                tGold: '#f0b90b',
                tAccent: '#7c3aed',
                tAccent2: '#06b6d4',
                sessionTimeSecs: 0,
                sessionDate: todayStr(),
                ownedEmojis: ['👦'],
                hearts: 3,
                dailyStreak: 0,
                lastDailyDate: null,
                dailyShieldUsed: false,
                lastShieldDate: null,
                achievementsUnlocked: [],
                achievementRewardClaimed: false,
                serialNumber: '',
                darkMode: true
            };
        }

        function sanitizeState(s) {
            if (typeof s.coins !== 'number' || s.coins < 0) s.coins = 0;
            if (typeof s.level !== 'number' || s.level < 1) s.level = 1;
            if (typeof s.xp !== 'number' || s.xp < 0) s.xp = 0;
            if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000;
            if (!s.ownedEmojis || !Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦'];
            if (!s.stats || typeof s.stats !== 'object') s.stats = {};
            if (!s.history) s.history = [];
            if (!s.catCounter) s.catCounter = { correct: 0, total: 0 };
            if (!s.catChallenges) s.catChallenges = { games: 0 };
            if (!s.achievementsUnlocked) s.achievementsUnlocked = [];
            if (s.achievementRewardClaimed === undefined) s.achievementRewardClaimed = false;
            if (!s.birthDate) s.birthDate = '2000-01-01';
            if (typeof s.age !== 'number') s.age = 0;
            if (s.darkMode === undefined) s.darkMode = true;
            return s;
        }

        function loadSt() {
            try {
                const s = JSON.parse(localStorage.getItem(SK));
                if (s && s.name !== undefined) return sanitizeState(s);
            } catch (e) {}
            return defState();
        }

        function saveSt() {
            try {
                localStorage.setItem(SK, JSON.stringify(st));
                if (st.serialNumber) saveSerialBackup(st.serialNumber, st);
            } catch (e) {}
        }

        function saveSerialBackup(serial, data) {
            try { localStorage.setItem(`ho_math_backup_${serial}`, JSON.stringify(data)); } catch (e) {}
        }

        function loadSerialBackup(serial) {
            try {
                const d = localStorage.getItem(`ho_math_backup_${serial}`);
                if (d) return JSON.parse(d);
            } catch (e) {}
            return null;
        }

        function generateSerialNumber(birthDate, name) {
            const nameEng = (name || 'User').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
            const cleanDate = birthDate.replace(/-/g, '');
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const count = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
            localStorage.setItem('ho_math_user_count', count);
            return `${cleanDate}-${nameEng}-${randomPart}-${count}`;
        }

        function updateSerialNumberDisplay() {
            const el = document.getElementById('serialNumberDisplay');
            if (el) el.textContent = st.serialNumber || 'غير محدد (احفظ الملف الشخصي أولاً)';
        }

        function copySerialNumber() {
            if (!st.serialNumber) { showFeedback('لا يوجد رقم تسلسلي بعد، قم بحفظ الملف الشخصي أولاً'); return; }
            navigator.clipboard.writeText(st.serialNumber);
            showFeedback('📋 تم نسخ الرقم التسلسلي');
        }

        function showRestoreAccount() {
            const panel = document.getElementById('restorePanel');
            if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }

        function restoreAccount() {
            const serial = document.getElementById('restoreSerialInput').value.trim();
            if (!serial) { showFeedback('الرجاء إدخال الرقم التسلسلي'); return; }
            const savedData = loadSerialBackup(serial);
            if (!savedData) { showFeedback('⚠️ لم يتم العثور على حساب بهذا الرقم'); return; }
            Object.assign(st, sanitizeState(savedData));
            saveSt();
            updateUI();
            loadProfileForm();
            applyDarkMode();
            showFeedback('✅ تم استعادة الحساب بنجاح');
            document.getElementById('restorePanel').style.display = 'none';
            document.getElementById('restoreSerialInput').value = '';
        }
        let st = loadSt();
        let currentOp = st.lastOp || 'mix';

        /* ═══════════ RESET COMPLETE ═══════════ */
        function confirmResetComplete(force) {
            showConfirm('البدء من جديد',
                'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟',
                'نعم، احذف الكل', 'إلغاء', (ok) => {
                    if (ok) {
                        localStorage.removeItem(SK);
                        for (let i = 0; i < localStorage.length; i++) {
                            let key = localStorage.key(i);
                            if (key && key.startsWith('ho_math_backup_')) localStorage.removeItem(key);
                        }
                        localStorage.removeItem('ho_math_user_count');
                        st = defState();
                        saveSt();
                        currentOp = st.lastOp || 'mix';
                        updateUI();
                        loadProfileForm();
                        applyDarkMode();
                        if (typeof clearGameTimer === 'function') clearGameTimer();
                        if (G) { G.ended = true; if (G.timer) clearInterval(G.timer); }
                        goTab('home');
                        showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية');
                    }
                });
        }

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
            if (st.dailyDate !== todayStr()) { st.dailyTasks = genDailyTasks();
                st.dailyDate = todayStr();
                saveSt(); }
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
            document.getElementById('profileTaskStatus').textContent = `${doneCount} / ${filtered.length} ›`;
        }
        let renderTasks = renderTasksFiltered;

        function updCountdown() {
            const now = new Date(),
                midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const d = midnight - now;
            const h = String(Math.floor(d / 3600000)).padStart(2, '0');
            const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
            const el = document.getElementById('dailyCountdown');
            if (el) el.textContent = `${h}:${m}:${s}`;
        }
        setInterval(updCountdown, 1000);
        let sessionStart = Date.now();

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

        /* ═══════════ GAME STATE ═══════════ */
        let G = { mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, currentQ: 0,
            totalQ: 10, correctAnswer: 0, answered: false, timer: null, timeLeft: 0, maxTime: 0, coinsEarned: 0,
            livesLeft: 3, helpersUsed: { skip: false, remove: false }, ended: false, isTraining: false,
            customTable: null, hasTimer: false, askedQuestions: [], currentExplanation: '',
        currentCatKey: '' };

        function clearGameTimer() { if (G.timer) { clearInterval(G.timer);
                G.timer = null; } }

        /* ═══════════ PARTICLES ═══════════ */
        (function() {
            const c = document.getElementById('particles');
            const col = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981'];
            for (let i = 0; i < 18; i++) { const p = document.createElement('div');
                p.className = 'particle';
                p.style.cssText =
                    `left:${Math.random()*100}%;background:${col[~~(Math.random()*4)]};width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;animation-delay:${Math.random()*9}s;animation-duration:${6+Math.random()*7}s;`;
                c.appendChild(p); }
        })();

        /* ═══════════ SPLASH SYMBOLS ═══════════ */
        (function() {
            const sym = ['∑', '∏', '√', '∞', 'π', 'Δ', '∫', '∂', '±', '×', '÷', '=', 'α', 'β', 'θ', 'λ', 'μ', 'σ',
                'φ', 'ψ', 'Ω', '∈', '∀', '∃', '≅', '≈', '≠', '≤', '≥', '+', '-', '*', '/'
            ];
            let container = document.getElementById('splashSymbols');
            if (!container) return;
            container.innerHTML = '';
            for (let i = 0; i < 55; i++) {
                let span = document.createElement('span');
                let s = sym[Math.floor(Math.random() * sym.length)];
                span.textContent = s;
                let size = Math.random() * 2 + 0.8;
                span.style.position = 'absolute';
                span.style.left = Math.random() * 100 + '%';
                span.style.top = Math.random() * 100 + '%';
                span.style.fontSize = size + 'em';
                span.style.opacity = Math.random() * 0.3 + 0.05;
                span.style.transform = `rotate(${Math.random()*360}deg)`;
                span.style.animation =
                    `floatSymbol ${Math.random()*10+8}s infinite alternate ease-in-out`;
                span.style.animationDelay = `-${Math.random()*5}s`;
                span.classList.add('animated-symbol');
                container.appendChild(span);
            }
        })();

        /* ═══════════ AUDIO ═══════════ */
        let aCtx = null;
        let bgInt = null;

        function gACtx() { if (!aCtx) try { aCtx = new(window.AudioContext || window.webkitAudioContext)(); } catch (
            e) {} return aCtx; }

        function tone(f, t = 'sine', d = 0.25, v = 0.12, delay = 0) {
            if (!st.soundOn) return;
            const ctx = gACtx();
            if (!ctx) return;
            const o = ctx.createOscillator(),
                g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = t;
            o.frequency.value = f;
            g.gain.value = v;
            const ts = ctx.currentTime + delay;
            o.start(ts);
            g.gain.exponentialRampToValueAtTime(0.001, ts + d);
            o.stop(ts + d + 0.01);
        }

        function playSound(type) {
            if (!st.soundOn) return;
            if (type === 'correct') { tone(660, 'sine', 0.14, 0.11);
                tone(880, 'sine', 0.14, 0.08, 0.12); } else if (type === 'wrong') { tone(200, 'sawtooth', 0.2,
                0.1); } else if (type === 'levelup') { tone(523, 'sine', 0.1, 0.1);
                tone(659, 'sine', 0.1, 0.1, 0.1);
                tone(784, 'sine', 0.16, 0.1, 0.2); } else if (type === 'click') { tone(440, 'sine', 0.07, 0.06); } else if (
                type === 'open') { tone(392, 'sine', 0.1, 0.07);
                tone(523, 'sine', 0.12, 0.07, 0.1); } else if (type === 'tick') { tone(1000, 'sine', 0.03, 0.02); }
        }
        const bgNotes = [261, 294, 329, 349, 392, 440, 494, 523, 392, 349];
        let bgIdx = 0;

        function bgNote() {
            if (!st.bgOn) return;
            const ctx = gACtx();
            if (!ctx) return;
            const o = ctx.createOscillator(),
                g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'triangle';
            o.frequency.value = bgNotes[bgIdx % bgNotes.length];
            bgIdx++;
            g.gain.value = 0.025;
            o.start();
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
            o.stop(ctx.currentTime + 2.1);
        }

        function startBg() { if (!bgInt) { bgInt = setInterval(bgNote, 2400); } }

        function stopBg() { clearInterval(bgInt);
            bgInt = null; }

        function toggleBgMusic() {
            st.bgOn = !st.bgOn;
            document.getElementById('bgBtn').textContent = st.bgOn ? '🎵' : '🔕';
            document.getElementById('bgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
            st.bgOn ? startBg() : stopBg();
            playSound('click');
            saveSt();
        }

        function toggleSound() {
            st.soundOn = !st.soundOn;
            document.getElementById('soundBtn').textContent = st.soundOn ? '🔊' : '🔇';
            const el = document.getElementById('soundStatus');
            if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
            saveSt();
        }

        /* ═══════════ NAVIGATION ═══════════ */
        const TABS = ['home', 'play', 'achieve', 'profile', 'leaderboard'];

        function goTab(tab) {
            TABS.forEach(t => {
                document.getElementById('page-' + t)?.classList.toggle('active', t === tab);
                document.getElementById('nav-' + t)?.classList.toggle('active', t === tab);
            });
            playSound('click');
            if (tab === 'achieve') { checkDailyReset();
                renderTasks();
                renderAchievements(); }
            if (tab === 'profile') loadProfileForm();
            if (tab === 'home') { updateHomeStats();
                renderHistory(); }
            if (tab === 'leaderboard') loadLeaderboard();
        }

        function getDifficultyByLevel() {
            if (st.level >= 8) return 'genius';
            if (st.level >= 5) return 'hard';
            if (st.level >= 3) return 'medium';
            return 'easy';
        }

        function updateUnlocks() {
            const level = st.level;
            const challengesUnlocked = level >= 4;
            const playChallengesCard = document.getElementById('playCardChallenges');
            const homeChallengesCat = document.getElementById('homeCatChallenges');
            if (playChallengesCard) {
                if (!challengesUnlocked) {
                    playChallengesCard.classList.add('locked');
                    playChallengesCard.onclick = null;
                    playChallengesCard.querySelector('.gcard-badge').textContent = '🔒 Lv.4';
                } else {
                    playChallengesCard.classList.remove('locked');
                    playChallengesCard.onclick = () => openOpSheet('challenges');
                    playChallengesCard.querySelector('.gcard-badge').textContent = 'متاح';
                }
            }
            if (homeChallengesCat) {
                if (!challengesUnlocked) {
                    homeChallengesCat.classList.add('locked');
                    homeChallengesCat.onclick = null;
                } else {
                    homeChallengesCat.classList.remove('locked');
                    homeChallengesCat.onclick = () => openOpSheet('challenges');
                }
            }
            const advancedUnlocked = level >= 7;
            const gcardAdvanced = document.getElementById('gcardAdvanced');
            const catAdvanced = document.getElementById('catAdvanced');
            if (gcardAdvanced) {
                if (!advancedUnlocked) {
                    gcardAdvanced.classList.add('locked');
                    gcardAdvanced.onclick = null;
                    gcardAdvanced.querySelector('.gcard-badge').textContent = '🔒 Lv.7';
                    if (document.getElementById('gcardAdvancedStats')) document.getElementById(
                        'gcardAdvancedStats').textContent = 'يفتح عند Lv.7';
                } else {
                    gcardAdvanced.classList.remove('locked');
                    gcardAdvanced.onclick = () => startGameWith('classic', 'advanced', null, true);
                    gcardAdvanced.querySelector('.gcard-badge').textContent = 'متاح';
                    if (document.getElementById('gcardAdvancedStats')) document.getElementById(
                        'gcardAdvancedStats').textContent = 'اضغط للعب';
                }
            }
            if (catAdvanced) {
                if (!advancedUnlocked) {
                    catAdvanced.classList.add('locked');
                    catAdvanced.onclick = null;
                    document.getElementById('catAdvancedStats').textContent = '🔒 يفتح Lv.7';
                } else {
                    catAdvanced.classList.remove('locked');
                    catAdvanced.onclick = () => startGameWith('classic', 'advanced', null, true);
                    document.getElementById('catAdvancedStats').textContent = 'اضغط للعب';
                }
            }
            const lawsUnlocked = level >= 10;
            const gcardLaws = document.getElementById('gcardLaws');
            const catLaws = document.getElementById('catLaws');
            if (gcardLaws) {
                if (!lawsUnlocked) {
                    gcardLaws.classList.add('locked');
                    gcardLaws.onclick = null;
                    gcardLaws.querySelector('.gcard-badge').textContent = '🔒 Lv.10';
                    if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent =
                        'يفتح عند Lv.10';
                } else {
                    gcardLaws.classList.remove('locked');
                    gcardLaws.onclick = () => startGameWith('classic', 'laws', null, true);
                    gcardLaws.querySelector('.gcard-badge').textContent = 'متاح';
                    if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent =
                        'اضغط للعب';
                }
            }
            if (catLaws) {
                if (!lawsUnlocked) {
                    catLaws.classList.add('locked');
                    catLaws.onclick = null;
                    document.getElementById('catLawsStats').textContent = '🔒 يفتح Lv.10';
                } else {
                    catLaws.classList.remove('locked');
                    catLaws.onclick = () => startGameWith('classic', 'laws', null, true);
                    document.getElementById('catLawsStats').textContent = 'اضغط للعب';
                }
            }
            const diffMedium = document.getElementById('diffMedium');
            const diffHard = document.getElementById('diffHard');
            const diffGenius = document.getElementById('diffGenius');
            if (diffMedium) {
                if (level >= 3) { diffMedium.classList.remove('locked');
                    document.getElementById('lockMedium').style.display = 'none'; } else { diffMedium.classList.add(
                        'locked');
                    document.getElementById('lockMedium').style.display = 'block'; }
            }
            if (diffHard) {
                if (level >= 5) { diffHard.classList.remove('locked');
                    document.getElementById('lockHard').style.display = 'none'; } else { diffHard.classList.add(
                    'locked');
                    document.getElementById('lockHard').style.display = 'block'; }
            }
            if (diffGenius) {
                if (level >= 8) { diffGenius.classList.remove('locked');
                    document.getElementById('lockGenius').style.display = 'none'; } else { diffGenius.classList.add(
                        'locked');
                    document.getElementById('lockGenius').style.display = 'block'; }
            }
        }

        function selectDiff(el, diff) {
            if (el.classList.contains('locked')) return;
            document.querySelectorAll('.diff-chip').forEach(c => { if (!c.classList.contains('locked')) c.classList
                    .remove('active'); });
            el.classList.add('active');
            st.difficulty = diff;
            playSound('click');
            saveSt();
        }

        function openSheet(id) { document.getElementById(id).classList.add('active'); }

        function closeSheet(id) { document.getElementById(id).classList.remove('active'); }

        function sheetBg(e, id) { if (e.target.id === id) closeSheet(id); }

        function openModeSheet(op) { currentOp = op || st.lastOp;
            openSheet('modeSheet'); }

        function openCounterGame() { openOpSheet('counter', true); }

        function openAdvancedGame() {
            if (st.level >= 7) startGameWith('classic', 'advanced', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 7');
        }

        function openLawsGame() {
            if (st.level >= 10) startGameWith('classic', 'laws', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 10');
        }

        function openTrainingOpSheet() {
            const grid = document.getElementById('trainingOpGrid');
            grid.innerHTML = `
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('add')"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('sub')"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('mul')"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('div')"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div></div>
            `;
            openSheet('trainingOpSheet');
        }

        function openOpSheet(cat, forceTimerForCounter = false) {
            const grid = document.getElementById('opModeGrid'),
                title = document.getElementById('opSheetTitle');
            if (cat === 'counter') {
                title.textContent = '🧮 العمليات على الاعداد';
                let html = `
                    <div class="mode-card" onclick="startGameWith('classic','add', null, true)"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('classic','sub', null, true)"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                if (st.level >= 2) {
                    html +=
                        `<div class="mode-card" onclick="startGameWith('classic','mul', null, true)"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('classic','div', null, true)"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                } else {
                    html +=
                        `<div class="mode-card locked"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div><div class="mode-card-desc">🔒 يفتح Lv.2</div></div>
                    <div class="mode-card locked"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div><div class="mode-card-desc">🔒 يفتح Lv.2</div></div>`;
                }
                html +=
                    `<div class="mode-card" onclick="startGameWith('classic','mix', null, true)"><div class="mode-card-badge">موصى</div><span class="mode-card-icon">🎲</span><div class="mode-card-name">مختلط</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startTableGame()"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول الضرب</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                grid.innerHTML = html;
            } else {
                title.textContent = '⚡ التحديات';
                grid.innerHTML = `
                    <div class="mode-card" onclick="startGameWith('speed','mix', null, true)"><span class="mode-card-icon">⚡</span><div class="mode-card-name">السرعة</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('survival','mix', null, false)"><span class="mode-card-icon">🔥</span><div class="mode-card-name">التحمّل</div><div class="mode-card-desc">بدون وقت • 3 أخطاء</div></div>
                    <div class="mode-card" onclick="startGameWith('frenzy','mix', null, true)"><span class="mode-card-icon">💥</span><div class="mode-card-name">الاندفاع</div><div class="mode-card-desc">30 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('daily','mix', null, false)"><div class="mode-card-badge">+3💰</div><span class="mode-card-icon">🌟</span><div class="mode-card-name">تحدي اليوم</div><div class="mode-card-desc">بدون وقت • مكافأة خاصة</div></div>`;
            }
            openSheet('opSheet');
        }

        function startTableGame() {
            closeSheet('opSheet');
            const maxT = st.difficulty === 'easy' ? 10 : st.difficulty === 'medium' ? 15 : st.difficulty === 'hard' ? 20 :
                30;
            let btns = '';
            for (let i = 1; i <= maxT; i++) btns +=
                `<div class="mode-card" onclick="closeSheet('opSheet');startTableGameWith(${i})"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول ${i}</div></div>`;
            const grid = document.getElementById('opModeGrid');
            document.getElementById('opSheetTitle').textContent = '📊 اختر جدول الضرب';
            grid.innerHTML = btns;
            openSheet('opSheet');
        }
        window.startTableGameWith = function(table) { closeSheet('opSheet');
            startGameWith('classic', 'table', table, true); };

        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

        function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

        function getCatStatsKey(op) {
            const map = { add: 'addition', sub: 'subtraction', mul: 'multiplication', div: 'division', mix: 'addition',
                table: 'table', percent: 'percentage', fraction: 'division', power: 'algebra', sqrt: 'squareroot',
                equation: 'algebra', sequence: 'puzzles', algebra: 'algebra', word: 'wordproblems',
                geometry: 'geometry', advanced: 'algebra', laws: 'mathlaws' };
            return map[op] || 'addition';
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
                const isEndlessMode = G.mode === 'speed' || G.mode === 'survival' || G.mode === 'frenzy';
                if (!G.askedQuestions.includes(qKey) || G.isTraining || isEndlessMode) break;
                attempts++;
                if (attempts > maxAttempts) break;
            } while (true);
            const isEndlessMode = G.mode === 'speed' || G.mode === 'survival' || G.mode === 'frenzy';
            if (!G.isTraining && !isEndlessMode) {
                G.askedQuestions.push(q.text + '|' + q.answer);
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

        /* ═══════════ CHECK ANSWER ═══════════ */
        function checkAnswer(btn) {
            if (G.answered || G.ended) return;
            G.answered = true;
            const val = parseInt(btn.getAttribute('data-val'));
            document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
            if (val === G.correctAnswer) {
                btn.classList.add('correct');
                G.correct++;
                G.streak++;
                if (G.streak > G.bestStreak) G.bestStreak = G.streak;
                G.score += 10 + G.streak * 2;
                G.coinsEarned += 0.4;
                showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
                playSound('correct');
                const timerActive = G.hasTimer && G.maxTime > 0 && !G.isTraining;
                if (timerActive) {
                    G.timeLeft = Math.min(G.maxTime, G.timeLeft + 1);
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
                    if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger');
                        bt.classList.add('danger'); } else { document.getElementById('timerBar').classList.remove(
                            'danger');
                        bt.classList.remove('danger'); }
                }
                if (G.currentCatKey && st.stats[G.currentCatKey]) {
                    const s = st.stats[G.currentCatKey];
                    s.att++;
                    s.cor++;
                    s.max += 3;
                    s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
                    if (G.streak >= 3) s.first++;
                }
                updTask('correct'); if (G.streak >= 3) updTask('streak', G.streak);
                if (G.streak >= 5) doConfetti();
                if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
                showFloatXP(10 + G.streak * 2);
                if (!G.isTraining) st.correctTotal++;
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('.answer-btn').forEach(b => { if (parseInt(b.getAttribute('data-val')) ===
                        G.correctAnswer) b.classList.add('correct'); });
                G.wrong++;
                G.streak = 0;
                const timerActive = G.hasTimer && G.maxTime > 0 && !G.isTraining;
                if (timerActive) {
                    G.timeLeft = Math.max(0, G.timeLeft - 1);
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
                    if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger');
                        bt.classList.add('danger'); }
                    if (G.timeLeft <= 0) { clearGameTimer();
                        endGame(); return; }
                }
                if (G.isTraining) {
                    showFeedback('❌');
                    playSound('wrong');
                    showExplanation();
                } else {
                    if (G.livesLeft > 0) {
                        G.livesLeft--;
                        updateHeartsDisplay();
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                        if (G.livesLeft <= 0) {
                            if (!st.dailyShieldUsed && useDailyShield()) { G.livesLeft = 1;
                                updateHeartsDisplay();
                                showFeedback('🛡️ درع الحماية!'); } else { setTimeout(() => { if (!G.ended)
                                        endGame(); }, 700); return; }
                        }
                    } else {
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                    }
                }
                if (G.currentCatKey && st.stats[G.currentCatKey]) { st.stats[G.currentCatKey].att++;
                    st.stats[G.currentCatKey].max += 3; }
                if (!G.isTraining) st.wrongTotal++;
            }
            document.getElementById('statScore').textContent = G.score;
            document.getElementById('streakNum').textContent = G.streak;
            document.getElementById('streakFire').style.display = G.streak >= 3 ? 'inline' : 'none';
            updateGameCoinsDisplay();
            const delay = 350;
            setTimeout(() => {
                if (G.ended) return;
                if (!G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy' && G
                    .currentQ >= G.totalQ) endGame();
                else loadQuestion();
            }, delay);
        }

        function showFeedback(msg) {
            const t = document.getElementById('feedbackToast');
            t.textContent = msg;
            t.classList.remove('show');
            void t.offsetWidth;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 900);
        }

        function showFloatXP(amt) {
            let el = document.createElement('div');
            el.className = 'float-xp';
            el.textContent = `+${amt}`;
            el.style.cssText = `left:${rnd(30,65)}%;top:40%;`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }

        function showComboEffect(c) {
            let popup = document.createElement('div');
            popup.className = 'combo-popup';
            popup.textContent = `🔥 ×${c}`;
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 900);
        }

        function showExplanation() {
            if (!G.currentExplanation) return;
            document.getElementById('explanationArea').innerHTML =
                `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`;
        }

        /* ═══════════ END GAME ═══════════ */
        function endGame() {
            if (G.ended) return;
            G.ended = true;
            clearGameTimer();
            if (!G.isTraining) {
                const earnedCoins = Math.floor(G.coinsEarned);
                st.correctTotal += G.correct;
                st.wrongTotal += G.wrong;
                st.coins += earnedCoins;
                st.totalGames++;
                if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak;
                if (G.score > st.bestScore) st.bestScore = G.score;
                const xpGained = G.score * 2 + G.correct * 5;
                st.xp += xpGained;
                while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext;
                    st.level++;
                    st.xpToNext = Math.floor(st.xpToNext * 1.3);
                    playSound('levelup'); }
                if (['classic', 'speed', 'survival', 'frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct;
                    st.catCounter.total += G.correct + G.wrong; }
                if (['speed', 'survival', 'frenzy', 'daily'].includes(G.mode)) st.catChallenges.games++;
                updTask('game'); if (G.mode === 'daily') updTask('daily');
                const acc = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
                if (st.history.length > 10) st.history.pop();
                saveSt();
                updateUI();
                checkAchievements();
                syncWithLeaderboard();
                const pct = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                const emj = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '😊' : '💪';
                const ttl = pct >= 90 ? 'ممتاز!' : pct >= 70 ? 'رائع!' : pct >= 50 ? 'جيد!' : 'حاول مجدداً!';
                document.getElementById('resultsEmoji').textContent = emj;
                document.getElementById('resultsTitle').textContent = ttl;
                document.getElementById('resultsSub').textContent =
                    `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`;
                document.getElementById('resScore').textContent = G.score;
                document.getElementById('resCorrect').textContent = G.correct;
                document.getElementById('resStreak').textContent = G.bestStreak;
                document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`;
                document.getElementById('gameOverlay').classList.remove('active');
                document.getElementById('resultsOverlay').classList.add('active');
                if (pct >= 70) doConfetti();
            } else {
                document.getElementById('gameOverlay').classList.remove('active');
                goTab('home');
                showFeedback('🎓 انتهى التدريب');
            }
        }

        function playAgain() { document.getElementById('resultsOverlay').classList.remove('active');
            startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }

        function goHome() { document.getElementById('resultsOverlay').classList.remove('active');
            goTab('home'); }

        function confirmQuit() {
            showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الصفحة الرئيسية؟\nستفقد تقدمك في هذه الجلسة.',
                'نعم، عد', 'استمرار', ok => {
                    if (ok) {
                        clearGameTimer();
                        document.getElementById('gameOverlay').classList.remove('active');
                        document.getElementById('resultsOverlay').classList.remove('active');
                        if (G.correct > 0 || G.wrong > 0 && !G.ended && !G.isTraining) endGame();
                        else { G.ended = true;
                            clearGameTimer();
                            goTab('home'); }
                    }
                });
        }

        function doConfetti() {
            const c = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981', '#ef4444', '#ffd54f'];
            for (let i = 0; i < 45; i++) { const el = document.createElement('div');
                el.className = 'confetti-piece';
                el.style.cssText =
                    `left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-delay:${Math.random()*0.9}s;animation-duration:${1.4+Math.random()*1.2}s;`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 3200); }
        }

        function updateDailyShield() {
            const today = todayStr();
            if (st.lastDailyDate !== today) {
                let yesterday = new Date(Date.now() - 86400000).toDateString();
                st.dailyStreak = st.lastDailyDate === yesterday ? st.dailyStreak + 1 : 1;
                st.lastDailyDate = today;
                st.dailyShieldUsed = false;
                saveSt();
            }
        }

        function useDailyShield() {
            updateDailyShield();
            if (st.dailyShieldUsed) return false;
            st.dailyShieldUsed = true;
            saveSt();
            return true;
        }

