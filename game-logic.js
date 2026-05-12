/* ═══════════ GLOBAL STATE ═══════════ */
const SK = 'ho_math_v8'; // تم ترقية الإصدار لتجنب تعارض البيانات القديمة

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDate(d) {
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
        darkMode: true,
        customColor: '#f0b90b',
        lastLoginDate: null,
        weeklyStats: {},
        marathonBest: 0
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
    if (!s.customColor) s.customColor = '#f0b90b';
    if (!s.weeklyStats) s.weeklyStats = {};
    if (typeof s.marathonBest !== 'number') s.marathonBest = 0;
    return s;
}

function loadSt() {
    try {
        const s = JSON.parse(localStorage.getItem(SK));
        if (s && s.name !== undefined) return sanitizeState(s);
    } catch (e) {}
    return defState();
}

// حفظ الحالة مع إمكانية debounce بسيطة
let saveTimeout;
function saveSt() {
    try {
        localStorage.setItem(SK, JSON.stringify(st));
        if (st.serialNumber) saveSerialBackup(st.serialNumber, st);
    } catch (e) {}
}
function debouncedSaveSt() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveSt, 400);
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
    { id: 'first_correct', icon: '🎯', name: 'أول إجابة صحيحة', desc: 'أجب على سؤال واحد صحيح', check: () => st.correctTotal >= 1, reward: 2 },
    { id: 'ten_correct', icon: '🔟', name: '10 إجابات', desc: 'أجب على 10 أسئلة صحيحة', check: () => st.correctTotal >= 10, reward: 3 },
    { id: 'fifty_correct', icon: '💯', name: '50 إجابة', desc: 'أجب على 50 سؤالاً صحيحاً', check: () => st.correctTotal >= 50, reward: 5 },
    { id: 'combo5', icon: '🔥', name: 'تتابع ×5', desc: 'حقّق تتابع 5 إجابات صحيحة', check: () => st.bestStreak >= 5, reward: 4 },
    { id: 'combo10', icon: '💥', name: 'تتابع ×10', desc: 'حقّق تتابع 10 إجابات صحيحة', check: () => st.bestStreak >= 10, reward: 8 },
    { id: 'speed10', icon: '⚡', name: 'سرعة 10 نقاط', desc: 'سجّل 10 نقاط في وضع السرعة', check: () => st.bestScore >= 10, reward: 3 },
    { id: 'speed25', icon: '🚀', name: 'سرعة 25 نقطة', desc: 'سجّل 25 نقطة في وضع السرعة', check: () => st.bestScore >= 25, reward: 6 },
    { id: 'level5', icon: '⬆️', name: 'المستوى 5', desc: 'وصل إلى المستوى 5', check: () => st.level >= 5, reward: 10 },
    { id: 'level20', icon: '👑', name: 'المستوى 20', desc: 'وصل إلى المستوى 20', check: () => st.level >= 20, reward: 20 },
    { id: 'all_basic_stars', icon: '🌟', name: 'أستاذ الأساسيات', desc: '15 نجمة في كل من الجمع والطرح والضرب والقسمة والجدول', check: () => ['addition','subtraction','multiplication','division','table'].every(k => (st.stats[k]?.stars || 0) >= 15), reward: 10 },
    { id: 'perfect_10', icon: '✨', name: 'مثالي ×10', desc: '10 مرات مثالية (3 نجوم)', check: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10, reward: 8 },
    { id: 'coins100', icon: '💰', name: 'مئة عملة', desc: 'اجمع 100 عملة', check: () => st.coins >= 100, reward: 0 },
    { id: 'play1h', icon: '⏱️', name: 'ساعة لعب', desc: 'ساعة كاملة من وقت اللعب', check: () => getSessionSecs() >= 3600, reward: 12 },
    { id: 'hard_unlock', icon: '🔓', name: 'فتح الصعب', desc: 'وصل للمستوى المطلوب لفتح الصعب', check: () => st.level >= 5, reward: 5 },
    { id: 'five_perfect', icon: '🏅', name: '5 فئات مثالية', desc: '5 فئات حصلت على تقييم مثالي', check: () => Object.values(st.stats).filter(s => (s.stars || 0) >= 15).length >= 5, reward: 15 },
    { id: 'young_math', icon: '🧒', name: 'رياضي صغير', desc: 'عمرك أقل من 12 وأجبت 20 صحيحة', check: () => st.age && st.age < 12 && st.correctTotal >= 20, reward: 10 },
    { id: 'algebra_master', icon: '📐', name: 'أستاذ الجبر', desc: 'عمرك 18+ وأجبت 20 في الجبر', check: () => st.age && st.age >= 18 && (st.stats['algebra']?.cor || 0) >= 20, reward: 15 },
    { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة', check: () => st.age && st.age >= 60 && st.correctTotal >= 30, reward: 20 },
    { id: 'marathon_master', icon: '🏃', name: 'بطل الماراثون', desc: '20 سؤال صحيح في الماراثون', check: () => st.marathonBest >= 20, reward: 15 },
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
    if (newUnlocks.length) { saveSt(); showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`); playSound('achievement'); updateUI(); }
    if (st.achievementsUnlocked.length === ACHIEVEMENTS_DEF.length && !st.achievementRewardClaimed) {
        st.achievementRewardClaimed = true;
        st.coins += 5;
        saveSt();
        showFeedback('🎉 جميع الإنجازات! +5 عملات إضافية');
        playSound('achievement');
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
    perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10 },
    level10: { icon: '🔷', cond: () => st.level >= 10 },
    allBasic: { icon: '🏅', cond: () => ['addition','subtraction','multiplication','division','table'].every(k => (st.stats[k]?.stars || 0) >= 15) }
};

function updateBadgeIcon() {
    const el = document.getElementById('badgeDisplay');
    if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join('');
}

function genDailyTasks() {
    return [
        { id: 't1', icon: '🎯', name: 'أول إجابة', desc: 'أجب على سؤال واحد صحيح', reward: 1, goal: 1, progress: 0, done: false },
        { id: 't2', icon: '🔥', name: 'تتابع ×3', desc: '3 إجابات صحيحة متتالية', reward: 3, goal: 3, progress: 0, done: false },
        { id: 't3', icon: '⚡', name: '10 إجابات صحيحة', desc: 'أجب على 10 أسئلة صحيحة', reward: 5, goal: 10, progress: 0, done: false },
        { id: 't4', icon: '🏃', name: 'جلستان كاملتان', desc: 'أنهِ جلستَي لعب كاملتَين', reward: 4, goal: 2, progress: 0, done: false },
        { id: 't5', icon: '💎', name: '25 إجابة', desc: 'أجب على 25 سؤالاً صحيحاً', reward: 8, goal: 25, progress: 0, done: false },
        { id: 't6', icon: '🌟', name: 'تحدي اليوم', desc: 'العب تحدي اليوم الخاص مرة', reward: 2, goal: 1, progress: 0, done: false },
    ];
}

function checkDailyReset() {
    if (st.dailyDate !== todayStr()) {
        st.dailyTasks = genDailyTasks();
        st.dailyDate = todayStr();
        saveSt();
    }
    updateDailyShield();
    checkDailyLoginReward();
}

function updateDailyShield() {
    const today = todayStr();
    if (st.lastDailyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000);
        const yesterdayStr = formatDate(yesterday);
        st.dailyStreak = (st.lastDailyDate === yesterdayStr) ? st.dailyStreak + 1 : 1;
        st.lastDailyDate = today;
        st.dailyShieldUsed = false;
        saveSt();
    }
}

function checkDailyLoginReward() {
    const today = todayStr();
    if (st.lastLoginDate !== today) {
        st.lastLoginDate = today;
        st.coins += 2;
        saveSt();
        updateUI();
        showFeedback('🎁 مكافأة تسجيل الدخول: +2 💰');
    }
}

function updTask(type, amount = 1) {
    checkDailyReset();
    const T = st.dailyTasks;
    let changed = false;
    if (type === 'correct') {
        ['t1','t3','t5'].forEach(id => {
            const t = T.find(x => x.id === id);
            if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + amount); if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; } }
        });
    }
    if (type === 'streak' && amount >= 3) { const t = T.find(x => x.id === 't2'); if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; } }
    if (type === 'game') { const t = T.find(x => x.id === 't4'); if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + 1); if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; } } }
    if (type === 'daily') { const t = T.find(x => x.id === 't6'); if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; } }
    if (changed) playSound('levelup');
    debouncedSaveSt();
    renderTasks();
}

function renderTasksFiltered() {
    const level = st.level;
    const tasksData = st.dailyTasks;
    let filtered = tasksData;
    if (level < 2) filtered = tasksData.filter(t => ['t1','t2'].includes(t.id));
    else if (level < 4) filtered = tasksData.filter(t => ['t1','t2','t3'].includes(t.id));
    else if (level < 5) filtered = tasksData.filter(t => ['t1','t2','t3','t4'].includes(t.id));
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
    const now = new Date(), midnight = new Date(now);
    midnight.setHours(24,0,0,0);
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
    if (st.sessionDate !== todayStr()) { st.sessionTimeSecs = 0; st.sessionDate = todayStr(); saveSt(); }
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
    if (document.hidden) { st.sessionTimeSecs = getSessionSecs(); st.sessionDate = todayStr(); saveSt(); sessionStart = Date.now(); }
});

function showConfirm(title, msg, yesText, noText, cb) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    document.getElementById('confirmBtnYes').textContent = yesText || 'نعم';
    document.getElementById('confirmBtnNo').textContent = noText || 'إلغاء';
    const ov = document.getElementById('confirmOverlay');
    ov.classList.add('active');
    document.getElementById('confirmBtnYes').onclick = () => { ov.classList.remove('active'); cb && cb(true); };
    document.getElementById('confirmBtnNo').onclick = () => { ov.classList.remove('active'); cb && cb(false); };
}

/* ═══════════ LAWS DATA (موسعة) ═══════════ */
const LAWS_DATA = [
    { cat: 'العمليات الأساسية', laws: [
        { title: 'قانون الجمع التبادلي', formula: 'أ + ب = ب + أ', desc: 'تبديل الأعداد في الجمع لا يغير الناتج.', example: '3+5=5+3=8' },
        { title: 'قانون الجمع التجميعي', formula: '(أ + ب) + ج = أ + (ب + ج)', desc: 'تجميع الأعداد في الجمع لا يؤثر على النتيجة.', example: '(2+3)+4=2+(3+4)=9' },
        { title: 'قانون الضرب التبادلي', formula: 'أ × ب = ب × أ', desc: 'تبديل الأعداد في الضرب لا يغير الناتج.', example: '4×5=5×4=20' },
        { title: 'قانون الضرب التجميعي', formula: '(أ × ب) × ج = أ × (ب × ج)', desc: 'تجميع الأعداد في الضرب لا يؤثر.', example: '(2×3)×4=2×(3×4)=24' },
        { title: 'قانون التوزيع', formula: 'أ × (ب + ج) = أ×ب + أ×ج', desc: 'توزيع الضرب على الجمع.', example: '3×(4+5)=12+15=27' },
        { title: 'العنصر المحايد الجمعي', formula: 'أ + 0 = أ', desc: 'الصفر لا يغير قيمة العدد.', example: '7+0=7' },
        { title: 'العنصر المحايد الضربي', formula: 'أ × 1 = أ', desc: 'الواحد لا يغير قيمة العدد.', example: '9×1=9' },
        { title: 'المعكوس الجمعي', formula: 'أ + ( -أ ) = 0', desc: 'معكوس العدد هو سالبه.', example: '5 + (-5) = 0' },
        { title: 'المعكوس الضربي', formula: 'أ × (1/أ) = 1 (أ≠0)', desc: 'مقلوب العدد.', example: '4 × 1/4 = 1' },
        { title: 'قانون صفر الضرب', formula: 'أ × 0 = 0', desc: 'أي عدد مضروب في صفر يساوي صفر.', example: '99 × 0 = 0' },
    ]},
    { cat: 'قوى وجذور وأسس', laws: [
        { title: 'أساس مرفوع لصفر', formula: 'أ⁰ = 1 (أ≠0)', desc: 'أي عدد غير صفري مرفوع للأس صفر يساوي 1.', example: '7⁰ = 1' },
        { title: 'ضرب الأسس', formula: 'أ^م × أ^ن = أ^(م+ن)', desc: 'عند ضرب أساسات متساوية نجمع الأسس.', example: '2³ × 2⁴ = 2⁷ = 128' },
        { title: 'قسمة الأسس', formula: 'أ^م ÷ أ^ن = أ^(م-ن)', desc: 'عند قسمة أساسات متساوية نطرح الأسس.', example: '5⁶ ÷ 5² = 5⁴ = 625' },
        { title: 'أس القوة', formula: '(أ^م)^ن = أ^(م×ن)', desc: 'رفع قوة لقوة.', example: '(3²)³ = 3⁶ = 729' },
        { title: 'الجذر التربيعي', formula: '√(أ²) = |أ|', desc: 'الجذر التربيعي لمربع عدد يساوي قيمته المطلقة.', example: '√(25)=5' },
        { title: 'ضرب الجذور', formula: '√أ × √ب = √(أ×ب)', desc: 'جذر حاصل الضرب = حاصل ضرب الجذور.', example: '√2 × √8 = √16 = 4' },
        { title: 'الأس السالب', formula: 'أ^(-ن) = 1 / (أ^ن)', desc: 'الأس السالب يقلب العدد.', example: '2^(-3) = 1/8' },
        { title: 'الجذر النوني', formula: 'ⁿ√(أ^ن) = |أ| إذا كان ن زوجياً', desc: 'الجذر النوني يلغي الأس.', example: '∛(27) = 3' },
    ]},
    { cat: 'اللوغاريتمات', laws: [
        { title: 'تعريف اللوغاريتم', formula: 'لو_ب(س) = ص  ⇔  ب^ص = س', desc: 'اللوغاريتم هو الأس المطلوب.', example: 'لو_10(100)=2' },
        { title: 'لوغاريتم الضرب', formula: 'لو_ب(س × ص) = لو_ب(س) + لو_ب(ص)', desc: 'لوغاريتم حاصل الضرب = مجموع اللوغاريتمات.', example: 'لو(6)=لو(2)+لو(3)' },
        { title: 'لوغاريتم القسمة', formula: 'لو_ب(س / ص) = لو_ب(س) - لو_ب(ص)', desc: 'لوغاريتم خارج القسمة = فرق اللوغاريتمات.', example: 'لو(4/2)=لو(4)-لو(2)' },
        { title: 'لوغاريتم القوة', formula: 'لو_ب(س^ن) = ن × لو_ب(س)', desc: 'لوغاريتم عدد مرفوع لأس = الأس × لوغاريتم العدد.', example: 'لو(10³)=3' },
        { title: 'تغيير الأساس', formula: 'لو_ب(س) = لو_ج(س) / لو_ج(ب)', desc: 'يمكن تحويل اللوغاريتم لأي أساس.', example: 'لو_2(8) = لو_10(8)/لو_10(2)' },
    ]},
    { cat: 'الدوال الأسية واللوغاريتمية الطبيعية', laws: [
        { title: 'عدد أويلر', formula: 'هـ ≈ 2.71828', desc: 'أساس اللوغاريتم الطبيعي.', example: 'هـ¹ ≈ 2.71828' },
        { title: 'اللوغاريتم الطبيعي', formula: 'لو_هـ(س) = ln(س)', desc: 'اللوغاريتم للأساس هـ.', example: 'ln(هـ) = 1' },
        { title: 'خاصية اللوغاريتم الطبيعي', formula: 'ln(1) = 0', desc: 'لوغاريتم الواحد لأي أساس يساوي صفراً.', example: 'ln(1)=0' },
        { title: 'مشتقة هـ^س', formula: 'مشتقة هـ^س = هـ^س', desc: 'الدالة الأسية الطبيعية تساوي مشتقتها.', example: 'إذا ق(س)=هـ^س فإن قَ(س)=هـ^س' },
        { title: 'تحويل الأساس إلى هـ', formula: 'ب^س = هـ^(س ln ب)', desc: 'يمكن كتابة أي دالة أسية بدلالة هـ.', example: '2^س = هـ^(س ln 2)' },
    ]},
    { cat: 'كسور ونسب مئوية', laws: [
        { title: 'توحيد المقامات', formula: 'أ/ب + ج/د = (أ×د + ج×ب)/(ب×د)', desc: 'لجمع أو طرح كسرين نوحد المقام.', example: '1/2 + 1/3 = 5/6' },
        { title: 'ضرب الكسور', formula: '(أ/ب) × (ج/د) = (أ×ج)/(ب×د)', desc: 'بسط في بسط ومقام في مقام.', example: '(2/3)×(3/4)=6/12=1/2' },
        { title: 'قسمة الكسور', formula: '(أ/ب) ÷ (ج/د) = (أ/ب) × (د/ج)', desc: 'اضرب في مقلوب الكسر الثاني.', example: '(1/2)÷(1/4)=2' },
        { title: 'النسبة المئوية', formula: 'ن% من س = (ن/100) × س', desc: 'حساب النسبة المئوية من عدد.', example: '20% من 50 = 10' },
        { title: 'تحويل الكسر إلى نسبة مئوية', formula: 'أ/ب = (أ÷ب)×100 %', desc: 'لتحويل كسر إلى نسبة مئوية.', example: '3/4 = 75%' },
    ]},
    { cat: 'هندسة وقياس', laws: [
        { title: 'مساحة المربع', formula: 'م = الضلع²', desc: 'مربع طول ضلعه l → المساحة l².', example: 'ضلع=4 → م=16' },
        { title: 'مساحة المستطيل', formula: 'م = الطول × العرض', desc: 'حاصل ضرب الطول في العرض.', example: 'طول=8, عرض=3 → م=24' },
        { title: 'مساحة المثلث', formula: 'م = (القاعدة × الارتفاع)/2', desc: 'نصف حاصل ضرب القاعدة في الارتفاع.', example: 'قاعدة=6, ارتفاع=4 → م=12' },
        { title: 'مساحة الدائرة', formula: 'م = π نق²', desc: 'π≈3.14', example: 'نق=5 → م=78.5' },
        { title: 'محيط الدائرة', formula: 'محيط = 2π نق', desc: 'المسافة حول الدائرة.', example: 'نق=7 → محيط≈43.96' },
        { title: 'نظرية فيثاغورس', formula: 'أ² + ب² = ج²', desc: 'في المثلث القائم: مربع الوتر = مجموع مربعي الضلعين.', example: '3²+4²=5²' },
        { title: 'مساحة المعين', formula: 'م = (القطر1 × القطر2)/2', desc: 'نصف حاصل ضرب القطرين.', example: 'قطر1=6, قطر2=8 → م=24' },
        { title: 'مساحة شبه المنحرف', formula: 'م = (القاعدة1 + القاعدة2) × الارتفاع / 2', desc: 'مجموع القاعدتين مضروباً في الارتفاع مقسوماً على 2.', example: 'قاعدتان 4 و6، ارتفاع 5 → م=25' },
        { title: 'مساحة القطاع الدائري', formula: 'م = (θ/360) × π نق²', desc: 'جزء من مساحة الدائرة حسب الزاوية θ.', example: 'θ=90°, نق=4 → م=12.56' },
        { title: 'مجموع زوايا المثلث', formula: '180°', desc: 'مجموع الزوايا الداخلية للمثلث = 180 درجة.', example: 'مثلث 60°-60°-60°' },
        { title: 'مجموع زوايا مضلع', formula: '(ن-2)×180°', desc: 'ن = عدد الأضلاع.', example: 'مضلع خماسي: 3×180=540°' },
        { title: 'نظرية طاليس', formula: 'إذا كان ضلع مثلث قطراً لدائرة، فالزاوية المقابلة قائمة', desc: 'خاصية المثلث المرسوم داخل نصف دائرة.', example: 'مثلث قائم الزاوية وتره قطر الدائرة المحيطة' },
    ]},
    { cat: 'الهندسة الفراغية', laws: [
        { title: 'حجم المكعب', formula: 'ح = الضلع³', desc: 'حجم المكعب = طول الضلع مكعب.', example: 'ضلع=3 → ح=27' },
        { title: 'حجم متوازي المستطيلات', formula: 'ح = الطول × العرض × الارتفاع', desc: 'حجم المنشور.', example: '2×3×4=24' },
        { title: 'مساحة سطح الكرة', formula: 'س = 4π نق²', desc: 'مساحة سطح الكرة.', example: 'نق=3 → س≈113.04' },
        { title: 'حجم الكرة', formula: 'ح = (4/3)π نق³', desc: 'حجم الكرة.', example: 'نق=3 → ح≈113.04' },
        { title: 'حجم الأسطوانة', formula: 'ح = π نق² ع', desc: 'مساحة القاعدة × الارتفاع.', example: 'نق=2, ع=5 → ح≈62.8' },
        { title: 'مساحة سطح الأسطوانة', formula: 'س = 2π نق (ع + نق)', desc: 'المساحة الجانبية + القاعدتان.', example: 'نق=2, ع=5 → س≈87.92' },
        { title: 'حجم المخروط', formula: 'ح = (1/3) π نق² ع', desc: 'ثلث حجم الأسطوانة المحيطة.', example: 'نق=2, ع=6 → ح≈25.12' },
        { title: 'مساحة سطح المخروط', formula: 'س = π نق (ل + نق)', desc: 'ل = الراسم.', example: 'نق=3, ل=5 → س≈75.36' },
        { title: 'حجم الهرم', formula: 'ح = (1/3) × مساحة القاعدة × الارتفاع', desc: 'ثلث حجم المنشور.', example: 'قاعدة مربعة ضلع=4, ع=6 → ح=32' },
    ]},
    { cat: 'الهندسة التحليلية', laws: [
        { title: 'المسافة بين نقطتين', formula: 'ف = √[(س2-س1)²+(ص2-ص1)²]', desc: 'قانون البعد بين نقطتين.', example: '(0,0) و(3,4) → 5' },
        { title: 'منتصف المسافة', formula: 'ن = ((س1+س2)/2 , (ص1+ص2)/2)', desc: 'إحداثيات منتصف قطعة.', example: '(2,4) و(6,8) → (4,6)' },
        { title: 'ميل الخط المستقيم', formula: 'م = (ص2-ص1)/(س2-س1)', desc: 'تغير ص على تغير س.', example: 'بين (1,2) و(3,6) م=2' },
        { title: 'معادلة الدائرة', formula: '(س - أ)² + (ص - ب)² = نق²', desc: 'دائرة مركزها (أ,ب) ونصف قطرها نق.', example: 'مركز (0,0), نق=5 → س²+ص²=25' },
        { title: 'العلاقة بين ميلين متعامدين', formula: 'م₁ × م₂ = -1', desc: 'شرط تعامد مستقيمين.', example: 'م₁=2, م₂=-1/2' },
    ]},
    { cat: 'التحويلات الهندسية', laws: [
        { title: 'الانعكاس حول محور السينات', formula: '(س,ص) → (س, -ص)', desc: 'تنعكس النقطة حول محور السينات.', example: '(2,3) → (2,-3)' },
        { title: 'الدوران 90° حول الأصل', formula: '(س,ص) → (-ص, س)', desc: 'دوران ربع دائرة عكس عقارب الساعة.', example: '(1,2) → (-2,1)' },
        { title: 'الإزاحة', formula: '(س,ص) → (س+أ, ص+ب)', desc: 'تحريك النقطة بمقدار (أ,ب).', example: '(2,3) بإزاحة (1,-1) → (3,2)' },
        { title: 'التمدد (الانكماش)', formula: '(س,ص) → (ك س, ك ص)', desc: 'تكبير أو تصغير الشكل بمعامل ك.', example: 'ك=2, (1,2) → (2,4)' },
    ]},
    { cat: 'جبر ومعادلات', laws: [
        { title: 'حل المعادلة الخطية', formula: 'س = (ج - ب)/أ إذا كانت أ س + ب = ج', desc: 'إيجاد قيمة المجهول.', example: '2س+3=7 → س=2' },
        { title: 'قانون إشارات الضرب', formula: '(-) × (-) = + , (+) × (-) = -', desc: 'ضرب عددين سالبين يعطي موجب، وضرب مختلفي الإشارة يعطي سالب.', example: '(-3)×(-4)=12' },
        { title: 'خاصية التوزيع للطرح', formula: 'أ × (ب - ج) = أ×ب - أ×ج', desc: 'توزيع الضرب على الطرح.', example: '5×(6-2)=5×4=20' },
        { title: 'صيغة المعادلة التربيعية', formula: 'س = [-ب ± √(ب²-4أج)]/(2أ)', desc: 'حل معادلة أ س² + ب س + ج = 0', example: 'س²-5س+6=0 → س=2 أو 3' },
        { title: 'الفرق بين مربعين', formula: 'أ² - ب² = (أ-ب)(أ+ب)', desc: 'تحليل الفرق بين مربعين.', example: 'س²-9 = (س-3)(س+3)' },
        { title: 'مربع مجموع', formula: '(أ+ب)² = أ² + 2أب + ب²', desc: 'مربع حدانية.', example: '(س+2)² = س²+4س+4' },
        { title: 'مربع فرق', formula: '(أ-ب)² = أ² - 2أب + ب²', desc: 'مربع حدانية.', example: '(س-3)² = س²-6س+9' },
        { title: 'مجموع مكعبين', formula: 'أ³ + ب³ = (أ+ب)(أ² - أب + ب²)', desc: 'تحليل مجموع مكعبين.', example: 'س³+8 = (س+2)(س²-2س+4)' },
        { title: 'فرق مكعبين', formula: 'أ³ - ب³ = (أ-ب)(أ² + أب + ب²)', desc: 'تحليل فرق مكعبين.', example: 'س³-27 = (س-3)(س²+3س+9)' },
        { title: 'المعادلات الأسية', formula: 'إذا ب^س = ب^ص  فإن س = ص (ب>0, ب≠1)', desc: 'تساوي الأساسات يؤدي لتساوي الأسس.', example: '2^س = 2^5 → س=5' },
        { title: 'المتباينات', formula: 'إذا أ < ب  فإن أ + ج < ب + ج', desc: 'إضافة عدد للمتباينة لا يغير اتجاهها.', example: '3<5 → 3+2<5+2' },
    ]},
    { cat: 'نظرية الأعداد', laws: [
        { title: 'قابلية القسمة على 2', formula: 'آخر رقم زوجي', desc: 'العدد الزوجي يقبل القسمة على 2.', example: '1234 ÷2 = 617' },
        { title: 'قابلية القسمة على 3', formula: 'مجموع الأرقام يقبل القسمة على 3', desc: 'إذا كان مجموع الأرقام من مضاعفات 3 فالعدد يقبل القسمة على 3.', example: '123 (1+2+3=6) ÷3=41' },
        { title: 'قابلية القسمة على 5', formula: 'آخر رقم 0 أو 5', desc: 'العدد الذي ينتهي بـ 0 أو 5 يقبل القسمة على 5.', example: '125 ÷5 = 25' },
        { title: 'قابلية القسمة على 9', formula: 'مجموع الأرقام يقبل القسمة على 9', desc: 'إذا كان مجموع الأرقام من مضاعفات 9 فالعدد يقبل القسمة على 9.', example: '234 (2+3+4=9) ÷9=26' },
        { title: 'مبرهنة فيرما الصغرى', formula: 'إذا p أولي و a لا يقبل القسمة على p فإن a^(p-1) ≡ 1 (mod p)', desc: 'خاصية الأعداد الأولية.', example: '2^(7-1)=64 ≡ 1 (mod 7)' },
        { title: 'تعريف العدد الأولي', formula: 'العدد الذي لا يقبل القسمة إلا على نفسه والواحد', desc: 'الأعداد الأولية هي حجر الأساس لنظرية الأعداد.', example: '2, 3, 5, 7, 11, 13, ...' },
    ]},
    { cat: 'متتاليات ومنطق', laws: [
        { title: 'المتتالية الحسابية', formula: 'ح_ن = ح₁ + (ن-1)د', desc: 'الحد النوني = الحد الأول + (ن-1)×الفرق.', example: '3,5,7,9,... الحد العاشر=3+9×2=21' },
        { title: 'المتتالية الهندسية', formula: 'ح_ن = ح₁ × ر^(ن-1)', desc: 'الحد النوني = الحد الأول × الأساس^(ن-1).', example: '2,6,18,54,... الحد الرابع=2×3³=54' },
        { title: 'مجموع المتتالية الحسابية', formula: 'مج = (ن/2)[2ح₁ + (ن-1)د]', desc: 'مجموع أول ن حداً.', example: '1+2+3+...+10 = 55' },
        { title: 'مجموع المتتالية الهندسية', formula: 'مج = ح₁(1-ر^ن)/(1-ر)', desc: 'مجموع أول ن حداً (ر≠1).', example: '2+4+8+16 = 30' },
        { title: 'قانون الثالث المنطقي', formula: 'إذا كان أ > ب و ب > ج ==> أ > ج', desc: 'العلاقة متعدية.', example: '5>3 و 3>1 → 5>1' },
    ]},
    { cat: 'أساسيات الإحصاء', laws: [
        { title: 'المتوسط الحسابي', formula: 'متوسط = (مجموع القيم) / عددها', desc: 'معدل البيانات.', example: 'لقيم 2,4,6 → المتوسط=12/3=4' },
        { title: 'الوسيط', formula: 'القيمة الوسطى بعد الترتيب', desc: 'الوسيط = منتصف البيانات.', example: '1,3,5,7,9 → الوسيط=5' },
        { title: 'المنوال', formula: 'القيمة الأكثر تكراراً', desc: 'المنوال هو القيمة الأكثر شيوعاً.', example: '1,2,2,3 → المنوال=2' },
        { title: 'المدى', formula: 'المدى = أعلى قيمة - أقل قيمة', desc: 'مقياس التشتت.', example: '9-1=8' },
        { title: 'الانحراف المعياري', formula: 'σ = √[ Σ(سᵢ - μ)² / ن ]', desc: 'مقياس تشتت البيانات حول المتوسط.', example: 'بيانات 2,4,4,4,5,5,7,9: μ=5, σ=2' },
        { title: 'التباين', formula: 'التباين = σ²', desc: 'مربع الانحراف المعياري.', example: 'σ=2 → σ²=4' },
    ]},
    { cat: 'الاحتمالات', laws: [
        { title: 'قانون الاحتمال', formula: 'P(أ) = عدد النتائج المواتية / عدد النتائج الممكنة', desc: 'احتمال وقوع حدث.', example: 'رمي زهر: P(6)=1/6' },
        { title: 'الحدث المتمم', formula: 'P(ليس أ) = 1 - P(أ)', desc: 'احتمال عدم وقوع الحدث.', example: 'احتمال عدم ظهور 6 = 5/6' },
        { title: 'الأحداث المستقلة', formula: 'P(أ و ب) = P(أ)×P(ب)', desc: 'إذا كان الحدثان مستقلين.', example: 'رمي زهر وعملة: P(6 و وجه)=1/6×1/2=1/12' },
        { title: 'الاحتمال الشرطي', formula: 'P(أ|ب) = P(أ ∩ ب) / P(ب)', desc: 'احتمال وقوع أ بشرط وقوع ب.', example: 'سحب كرة حمراء ثم أخرى بدون إرجاع' },
        { title: 'قانون بايز', formula: 'P(أ|ب) = [P(ب|أ) × P(أ)] / P(ب)', desc: 'تحديث الاحتمالات بناءً على معلومات جديدة.', example: 'اختبار طبي لمرض نادر' },
        { title: 'التباديل', formula: 'ل(ن,ر) = ن! / (ن-ر)!', desc: 'عدد طرق ترتيب ر عنصراً من ن.', example: 'ترتيب 3 كتب من 5 = 60 طريقة' },
        { title: 'التوافيق', formula: 'ت(ن,ر) = ن! / [ر!(ن-ر)!]', desc: 'عدد طرق اختيار ر عنصراً من ن دون ترتيب.', example: 'اختيار 3 من 5 = 10 طرق' },
    ]},
    { cat: 'المتطابقات المثلثية', laws: [
        { title: 'الهوية الأساسية', formula: 'جا²θ + جتا²θ = 1', desc: 'العلاقة بين الجيب وجيب التمام.', example: 'جا²30°+جتا²30°=1' },
        { title: 'ظل الزاوية', formula: 'ظا θ = جا θ / جتا θ', desc: 'نسبة الجيب على جيب التمام.', example: 'جا30°/جتا30°=ظا30°≈0.577' },
        { title: 'قانون الجيب', formula: 'أ/جا(أ) = ب/جا(ب) = ج/جا(ج)', desc: 'لحل المثلثات.', example: 'مثلث أطواله متناسبة مع جيب زواياه' },
        { title: 'قانون جيب التمام', formula: 'ج² = أ² + ب² - 2أب جتا(ج)', desc: 'لإيجاد ضلع مجهول.', example: 'أ=3, ب=4, زاوية 60° → ج≈3.61' },
        { title: 'جيب ضعف الزاوية', formula: 'جا(2θ) = 2 جاθ جتاθ', desc: 'صيغة ضعف الزاوية للجيب.', example: 'جا(60°)=2 جا30° جتا30°≈0.866' },
        { title: 'جيب تمام ضعف الزاوية', formula: 'جتا(2θ) = جتا²θ - جا²θ = 2جتا²θ - 1 = 1 - 2جا²θ', desc: 'صيغة ضعف الزاوية لجيب التمام.', example: 'جتا(60°)=2جتا²30°-1' },
        { title: 'جيب نصف الزاوية', formula: 'جا(θ/2) = ±√[(1-جتاθ)/2]', desc: 'حساب جيب نصف الزاوية.', example: 'جا(15°)=√[(1-جتا30°)/2]' },
        { title: 'جيب تمام نصف الزاوية', formula: 'جتا(θ/2) = ±√[(1+جتاθ)/2]', desc: 'حساب جيب تمام نصف الزاوية.', example: 'جتا(15°)=√[(1+جتا30°)/2]' },
        { title: 'تحويل مجموع إلى ضرب (جيب)', formula: 'جا أ + جا ب = 2 جا((أ+ب)/2) جتا((أ-ب)/2)', desc: 'تحويل مجموع جيبين إلى حاصل ضرب.', example: 'جا50°+جا30°=2جا40°جتا10°' },
    ]},
    { cat: 'التفاضل والتكامل الأساسي', laws: [
        { title: 'مشتقة س^ن', formula: 'إذا ق(س)=س^ن  =>  قَ(س)=ن س^(ن-1)', desc: 'قاعدة الأس للمشتقة.', example: 'مشتقة س³ = 3 س²' },
        { title: 'مشتقة الجيب', formula: 'مشتقة جا(س) = جتا(س)', desc: 'مشتقة دالة الجيب.', example: 'مشتقة جا(س)' },
        { title: 'مشتقة جيب التمام', formula: 'مشتقة جتا(س) = -جا(س)', desc: 'مشتقة دالة جيب التمام.', example: 'مشتقة جتا(س)' },
        { title: 'التكامل الأساسي', formula: '∫ س^ن دس = س^(ن+1)/(ن+1) + ث (ن≠-1)', desc: 'عكس الاشتقاق.', example: '∫ س² دس = س³/3 + ث' },
        { title: 'تكامل الجيب', formula: '∫ جا(س) دس = -جتا(س) + ث', desc: 'التكامل العكسي للجيب.', example: '∫ جا(س) دس' },
        { title: 'تكامل جيب التمام', formula: '∫ جتا(س) دس = جا(س) + ث', desc: 'التكامل العكسي لجيب التمام.', example: '∫ جتا(س) دس' },
    ]},
    { cat: 'المصفوفات والمحددات', laws: [
        { title: 'جمع المصفوفات', formula: '(أ+ب)_{ij} = أ_{ij}+ب_{ij}', desc: 'جمع عنصر بعنصر.', example: '[[1,2],[3,4]]+[[5,6],[7,8]]=[[6,8],[10,12]]' },
        { title: 'ضرب المصفوفات', formula: '(أ×ب)_{ij} = Σ أ_{ik} ب_{kj}', desc: 'ضرب صف في عمود.', example: 'مصفوفة 2×3 في 3×2 تعطي 2×2' },
        { title: 'محدد مصفوفة 2×2', formula: 'det([[أ,ب],[ج,د]]) = أ×د - ب×ج', desc: 'حساب المحدد.', example: 'det([[1,2],[3,4]])=1×4-2×3=-2' },
        { title: 'محدد مصفوفة 3×3', formula: 'det(أ) = أ(ei-fh) - ب(di-fg) + ج(dh-eg)', desc: 'قاعدة ساروس.', example: 'حساب محدد مصفوفة 3×3' },
    ]},
    { cat: 'الأعداد المركبة', laws: [
        { title: 'تعريف i', formula: 'i² = -1', desc: 'الوحدة التخيلية.', example: '√(-9) = 3i' },
        { title: 'جمع الأعداد المركبة', formula: '(أ+ب i)+(ج+د i) = (أ+ج)+(ب+د)i', desc: 'جمع الأجزاء الحقيقية والتخيلية.', example: '(1+2i)+(3+4i)=4+6i' },
        { title: 'ضرب الأعداد المركبة', formula: '(أ+ب i)(ج+د i) = (أج - ب د) + (أ د + ب ج)i', desc: 'باستخدام i²=-1.', example: '(1+i)(1-i)=1-i²=2' },
        { title: 'مرافق العدد المركب', formula: 'مرافق (أ+ب i) = أ - ب i', desc: 'تغيير إشارة الجزء التخيلي.', example: 'مرافق (3+4i) = 3-4i' },
        { title: 'مقياس العدد المركب', formula: '|أ+ب i| = √(أ²+ب²)', desc: 'المسافة من نقطة الأصل في مستوى الأعداد المركبة.', example: '|3+4i| = 5' },
    ]},
    { cat: 'المتباينات الشهيرة', laws: [
        { title: 'متباينة المثلث', formula: '|أ + ب| ≤ |أ| + |ب|', desc: 'القيمة المطلقة للمجموع لا تزيد عن مجموع القيم المطلقة.', example: '|3 + (-5)| = 2 ≤ 8' },
        { title: 'متباينة كوشي-شوارتز', formula: '(Σ أᵢ بᵢ)² ≤ (Σ أᵢ²)(Σ بᵢ²)', desc: 'متباينة أساسية في الجبر الخطي.', example: '(1×2+3×4)² ≤ (1²+3²)(2²+4²)' },
        { title: 'الوسط الحسابي والهندسي', formula: '(س+ص)/2 ≥ √(س ص) (س,ص>0)', desc: 'الوسط الحسابي أكبر من أو يساوي الوسط الهندسي.', example: '(4+9)/2=6.5 ≥ √36=6' },
    ]},
    { cat: 'تحويلات ووحدات', laws: [
        { title: 'تحويل الدرجة إلى راديان', formula: 'راديان = درجة × (π/180)', desc: 'التحويل بين وحدات الزاوية.', example: '90° = π/2 راديان' },
        { title: 'قانون السرعة', formula: 'ع = المسافة / الزمن', desc: 'السرعة المتوسطة = المسافة الكلية / الزمن الكلي.', example: '100كم في 2س → سرعة=50كم/س' },
    ]},
];

/* ═══════════ GAME STATE ═══════════ */
let G = { mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, currentQ: 0, totalQ: 10, correctAnswer: 0, answered: false, timer: null, timeLeft: 0, maxTime: 0, coinsEarned: 0, livesLeft: 3, helpersUsed: { skip: false, remove: false }, ended: false, isTraining: false, customTable: null, hasTimer: false, askedQuestions: [], currentExplanation: '', currentCatKey: '' };

function clearGameTimer() { if (G.timer) { clearInterval(G.timer); G.timer = null; } }

/* ═══════════ PARTICLES ═══════════ */
(function() {
    const c = document.getElementById('particles');
    const col = ['#f0b90b','#7c3aed','#06b6d4','#10b981'];
    for (let i=0; i<18; i++) { const p = document.createElement('div'); p.className='particle'; p.style.cssText=`left:${Math.random()*100}%;background:${col[~~(Math.random()*4)]};width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;animation-delay:${Math.random()*9}s;animation-duration:${6+Math.random()*7}s;`; c.appendChild(p); }
})();

/* ═══════════ SPLASH SYMBOLS ═══════════ */
(function() {
    const sym = ['∑','∏','√','∞','π','Δ','∫','∂','±','×','÷','=','α','β','θ','λ','μ','σ','φ','ψ','Ω','∈','∀','∃','≅','≈','≠','≤','≥','+','-','*','/'];
    let container = document.getElementById('splashSymbols');
    if (!container) return;
    container.innerHTML = '';
    for (let i=0; i<55; i++) {
        let span = document.createElement('span');
        span.textContent = sym[Math.floor(Math.random()*sym.length)];
        span.style.position='absolute';
        span.style.left=Math.random()*100+'%';
        span.style.top=Math.random()*100+'%';
        span.style.fontSize=(Math.random()*2+0.8)+'em';
        span.style.opacity=Math.random()*0.3+0.05;
        span.style.transform=`rotate(${Math.random()*360}deg)`;
        span.style.animation=`floatSymbol ${Math.random()*10+8}s infinite alternate ease-in-out`;
        span.style.animationDelay=`-${Math.random()*5}s`;
        span.classList.add('animated-symbol');
        container.appendChild(span);
    }
})();

/* ═══════════ AUDIO ═══════════ */
let aCtx = null;
let bgInt = null;

function gACtx() { if (!aCtx) try { aCtx = new(window.AudioContext || window.webkitAudioContext)(); } catch(e) {} return aCtx; }

function tone(f, t='sine', d=0.25, v=0.12, delay=0) {
    if (!st.soundOn) return;
    const ctx = gACtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = t; o.frequency.value = f; g.gain.value = v;
    const ts = ctx.currentTime + delay;
    o.start(ts); g.gain.exponentialRampToValueAtTime(0.001, ts+d); o.stop(ts+d+0.01);
}

function playSound(type) {
    if (!st.soundOn) return;
    if (type === 'correct') { tone(660,'sine',0.14,0.12); tone(880,'sine',0.14,0.09,0.12); }
    else if (type === 'wrong') { tone(200,'sawtooth',0.2,0.12); }
    else if (type === 'levelup') { tone(523,'sine',0.12,0.12); tone(659,'sine',0.12,0.12,0.1); tone(784,'sine',0.18,0.14,0.2); }
    else if (type === 'click') { tone(440,'sine',0.07,0.06); }
    else if (type === 'open') { tone(392,'sine',0.1,0.07); tone(523,'sine',0.12,0.07,0.1); }
    else if (type === 'tick') { tone(1000,'sine',0.03,0.02); }
    else if (type === 'achievement') { tone(600,'sine',0.2,0.12); tone(900,'sine',0.3,0.2,0.15); }
}

const bgNotes = [261,294,329,349,392,440,494,523,392,349];
let bgIdx = 0;
function bgNote() {
    if (!st.bgOn) return;
    const ctx = gACtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type='triangle'; o.frequency.value=bgNotes[bgIdx%bgNotes.length]; bgIdx++;
    g.gain.value=0.025; o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+2); o.stop(ctx.currentTime+2.1);
}
function startBg() { if (!bgInt) { bgInt = setInterval(bgNote, 2400); } }
function stopBg() { clearInterval(bgInt); bgInt = null; }
function toggleBgMusic() {
    st.bgOn = !st.bgOn;
    document.getElementById('bgBtn').textContent = st.bgOn ? '🎵' : '🔕';
    document.getElementById('bgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    st.bgOn ? startBg() : stopBg();
    playSound('click'); saveSt();
}
function toggleSound() {
    st.soundOn = !st.soundOn;
    document.getElementById('soundBtn').textContent = st.soundOn ? '🔊' : '🔇';
    const el = document.getElementById('soundStatus'); if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    saveSt();
}

/* ═══════════ NAVIGATION ═══════════ */
const TABS = ['home','play','achieve','profile','leaderboard'];
function goTab(tab) {
    TABS.forEach(t => {
        document.getElementById('page-'+t)?.classList.toggle('active', t===tab);
        document.getElementById('nav-'+t)?.classList.toggle('active', t===tab);
    });
    playSound('click');
    if (tab==='achieve') { checkDailyReset(); renderTasks(); renderAchievements(); }
    if (tab==='profile') loadProfileForm();
    if (tab==='home') { updateHomeStats(); renderHistory(); drawWeeklyChart(); }
    if (tab==='leaderboard') loadLeaderboard();
}

function getDifficultyByLevel() {
    if (st.level>=8) return 'genius';
    if (st.level>=5) return 'hard';
    if (st.level>=3) return 'medium';
    return 'easy';
}

/* ═══════════ LAWS DISPLAY ═══════════ */
function openLaws() {
    const el = document.getElementById('lawsContent');
    if (!el) return;
    el.innerHTML = LAWS_DATA.map(cat=>`
        <div style="margin-bottom:14px;"><div class="section-label" style="margin-bottom:8px;">${cat.cat}</div>
        ${cat.laws.map(law=>`<div class="law-card"><div class="law-title">📌 ${law.title}</div><div class="law-formula">${law.formula}</div><div class="law-desc">${law.desc}</div><div class="law-example">مثال: ${law.example}</div></div>`).join('')}
        </div>`).join('');
    document.getElementById('lawsOverlay').classList.add('active');
}
function closeLaws() { document.getElementById('lawsOverlay').classList.remove('active'); }

/* ═══════════ QUESTION GENERATOR ═══════════ */
function rnd(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
function shuffle(a) { return [...a].sort(()=>Math.random()-0.5); }

function getCatStatsKey(op) {
    const map = { add:'addition', sub:'subtraction', mul:'multiplication', div:'division', mix:'addition', table:'table', percent:'percentage', fraction:'division', power:'algebra', sqrt:'squareroot', equation:'algebra', sequence:'puzzles', algebra:'algebra', word:'wordproblems', geometry:'geometry', advanced:'algebra', laws:'mathlaws' };
    return map[op] || 'addition';
}

// مولّد الأسئلة المُحسَّن
const questionBuilders = {
    add: (r) => { let a=rnd(r.small[0],r.small[1]), b=rnd(r.small[0],r.small[1]); return { text:`${a} + ${b}`, answer:a+b, explanation:`${a}+${b}=${a+b}`, catKey:'addition' }; },
    sub: (r) => { let a=rnd(r.small[0],r.small[1]), b=rnd(r.small[0],r.small[1]); if(a<b)[a,b]=[b,a]; return { text:`${a} − ${b}`, answer:a-b, explanation:`${a}-${b}=${a-b}`, catKey:'subtraction' }; },
    mul: (r) => { let a=rnd(r.times[0],r.times[1]), b=rnd(r.times[0],r.times[1]); return { text:`${a} × ${b}`, answer:a*b, explanation:`${a}×${b}=${a*b}`, catKey:'multiplication' }; },
    div: (r) => { let b=rnd(r.times[0],r.times[1]), ans=rnd(1,r.times[1]), a=b*ans; return { text:`${a} ÷ ${b}`, answer:ans, explanation:`${a}÷${b}=${ans}`, catKey:'division' }; },
    percent: (r) => { const pcts=[10,20,25,50,75]; const pct=pcts[rnd(0,pcts.length-1)]; let a=rnd(1,20)*10; let ans=Math.round(a*pct/100); return { text:`${pct}% من ${a}`, answer:ans, explanation:`${a}×${pct}%=${ans}`, catKey:'percentage' }; },
    power: (r) => { let a=rnd(2,10), b=rnd(2,3); return { text:`${a}^${b}`, answer:Math.pow(a,b), explanation:`${a}^${b}=${Math.pow(a,b)}`, catKey:'algebra' }; },
    sqrt: (r) => { const sq=[4,9,16,25,36,49,64,81,100,121,144]; let a=sq[rnd(0,sq.length-1)]; return { text:`√${a}`, answer:Math.round(Math.sqrt(a)), explanation:`√${a}=${Math.round(Math.sqrt(a))}`, catKey:'squareroot' }; },
    equation_simple: (r) => { let a=rnd(5,30), b=rnd(a+1,a+50); return { text:`س + ${a} = ${b}`, answer:b-a, explanation:`س=${b}-${a}=${b-a}`, catKey:'algebra' }; },
    sequence: (r) => { let a=rnd(1,15), b=rnd(2,10); return { text:`${a}, ${a+b}, ${a+2*b}, ?`, answer:a+3*b, explanation:`الفرق=${b}، التالي=${a+3*b}`, catKey:'puzzles' }; },
    fraction_simple: (r) => { let d=rnd(2,6), n1=rnd(1,d-1), n2=rnd(1,d-1); return { text:`${n1}/${d} + ${n2}/${d}`, answer:n1+n2, explanation:`${n1}/${d}+${n2}/${d}=${n1+n2}/${d}`, catKey:'division' }; },
    word_add: (r) => { let x=rnd(10,50), y=rnd(5,30); return { text:`لدى أحمد ${x} تفاحة واشترى ${y} تفاحة أخرى. كم تفاحة لديه الآن؟`, answer:x+y, explanation:`${x}+${y}=${x+y}`, catKey:'wordproblems' }; },
    word_mul: (r) => { let p=rnd(2,8), q=rnd(2,12); return { text:`إذا كان ثمن القلم الواحد ${p} ديناراً، فكم ثمن ${q} أقلام؟`, answer:p*q, explanation:`${p}×${q}=${p*q}`, catKey:'wordproblems' }; },
};

function genQ(op, diff, customTable = null) {
    if (op==='table' && customTable) {
        const f=rnd(1,12); const ans=customTable*f;
        return { text:`${customTable} × ${f}`, hint:'ما حاصل الضرب؟', answer:ans, choices:shuffle([ans, ans+customTable, ans-customTable, ans+1]), explanation:`${customTable}×${f}=${ans}`, catKey:'table' };
    }
    if (op==='advanced') {
        // أسئلة متقدمة ثابتة
        const pool = [
            ()=>{ let a=rnd(2,6), b=rnd(2,4); return { text:`${a}^${b}`, answer:Math.pow(a,b), explanation:`${a}^${b}=${Math.pow(a,b)}`, catKey:'algebra' }; },
            ()=>{ let sq=[4,9,16,25,36,49,64,81,100]; let a=sq[rnd(0,sq.length-1)]; return { text:`√${a}`, answer:Math.sqrt(a), explanation:`√${a}=${Math.sqrt(a)}`, catKey:'squareroot' }; },
            ()=>{ let a=rnd(5,20), b=rnd(a+1,a+30); return { text:`س + ${a} = ${b}`, answer:b-a, explanation:`س=${b}-${a}=${b-a}`, catKey:'algebra' }; },
            ()=>{ let c=rnd(2,8), a2=rnd(1,c-1), b2=rnd(1,c-1); return { text:`${a2}/${c} + ${b2}/${c}`, answer:a2+b2, explanation:`${a2}/${c}+${b2}/${c}=${a2+b2}/${c}`, catKey:'division' }; },
            ()=>{ let pct=[10,20,25,50][rnd(0,3)]; let a=rnd(1,20)*10; return { text:`${pct}% من ${a}`, answer:Math.round(a*pct/100), explanation:`${a}×${pct}%=${Math.round(a*pct/100)}`, catKey:'percentage' }; },
            ()=>{ let a=rnd(1,10), b=rnd(2,8); return { text:`${a}, ${a+b}, ${a+2*b}, ?`, answer:a+3*b, explanation:`الفرق=${b}، التالي=${a+3*b}`, catKey:'puzzles' }; },
            ()=>{ let a=rnd(2,4); return { text:`log₁₀(10^${a})`, answer:a, explanation:`log₁₀(10^${a})=${a}`, catKey:'algebra' }; },
            ()=>{ let degs=[0,30,45,60,90]; let deg=degs[rnd(0,degs.length-1)]; let val=Math.round(Math.sin(deg*Math.PI/180)*10)/10; return { text:`جا(${deg}°)`, answer:val, explanation:`جا(${deg}°)=${val}`, catKey:'algebra' }; },
            ()=>{ let r=rnd(3,8); return { text:`مساحة دائرة نصف قطرها ${r}`, answer:Math.round(Math.PI*r*r), explanation:`π×${r}²≈${Math.round(Math.PI*r*r)}`, catKey:'geometry' }; },
        ];
        let q = pool[rnd(0,pool.length-1)]();
        let choices = shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2]);
        return { text:q.text, hint:'سؤال متقدم', answer:q.answer, choices, explanation:q.explanation, catKey:q.catKey };
    }
    if (op==='laws') {
        const lawQ = [
            { text:'ما ناتج 3 × (4 + 5) وفق قانون التوزيع؟', ans:27, explanation:'3×4 + 3×5 = 12+15=27' },
            { text:'ما قيمة 5⁰؟', ans:1, explanation:'أي عدد غير صفري مرفوع للأس صفر = 1' },
            { text:'ما مساحة مربع طول ضلعه 7؟', ans:49, explanation:'المساحة = 7² = 49' },
            { text:'ما محيط دائرة نصف قطرها 5 (π≈3.14)؟', ans:31.4, explanation:'2×3.14×5' },
            { text:'جذر 144 = ؟', ans:12, explanation:'12² = 144' },
            { text:'إذا كان س + 5 = 12، فما قيمة س؟', ans:7, explanation:'س = 12-5' },
            { text:'قانون الجمع التبادلي: 8 + 3 = 3 + ...؟', ans:8, explanation:'التبديل لا يغير الناتج' },
            { text:'ما ناتج (-3) × (-4)؟', ans:12, explanation:'سالب × سالب = موجب' },
            { text:'إذا كانت مساحة المستطيل 20 وطوله 5، فما عرضه؟', ans:4, explanation:'العرض = 20/5' },
            { text:'ما قيمة 2³ × 2⁴؟', ans:128, explanation:'2⁷ = 128' },
            { text:'ما متوسط الأعداد 4, 8, 12؟', ans:8, explanation:'(4+8+12)/3' },
            { text:'حل المعادلة: 2س = 16', ans:8, explanation:'س = 16/2' },
            { text:'إذا كان ثمن 5 أقلام 15 ديناراً، فثمن القلم الواحد؟', ans:3, explanation:'15/5' },
            { text:'ناتج (1/2) ÷ (1/4) = ؟', ans:2, explanation:'(1/2)×4 = 2' },
            { text:'ما 25% من 80؟', ans:20, explanation:'80×0.25' },
            { text:'قيمة 2⁵ = ؟', ans:32, explanation:'2×2×2×2×2' },
        ];
        let q = lawQ[rnd(0,lawQ.length-1)];
        let choices = shuffle([q.ans, q.ans+1, q.ans-1, q.ans+2]);
        return { text:q.text, hint:'تطبيق قانون رياضي', answer:q.ans, choices, explanation:q.explanation, catKey:'mathlaws' };
    }
    let actualDiff = diff || getDifficultyByLevel();
    const ranges = {
        easy: { small:[1,10], mid:[1,15], mul:[2,9], times:[2,9] },
        medium: { small:[10,50], mid:[5,30], mul:[2,15], times:[2,12] },
        hard: { small:[50,500], mid:[10,99], mul:[3,25], times:[3,20] },
        genius: { small:[100,9999], mid:[10,999], mul:[5,50], times:[5,30] }
    };
    const r = ranges[actualDiff] || ranges.easy;
    let ch = op;
    if (op==='mix') {
        const pools = {
            easy: ['add','sub','mul','div'],
            medium: ['add','sub','mul','div','percent','fraction_simple','word_add','word_mul','equation_simple'],
            hard: ['add','sub','mul','div','percent','fraction_add','power','sqrt','word_hard','equation_simple','sequence'],
            genius: ['add','sub','mul','div','percent','fraction_mul','power','sqrt','word_genius','equation_quad','sequence','algebra','log_simple']
        };
        const pool = pools[actualDiff] || pools.easy;
        ch = pool[rnd(0,pool.length-1)];
    }
    let builder = questionBuilders[ch] || questionBuilders['add'];
    let qObj = builder(r);
    // توليد خيارات خاطئة
    let wrongs = new Set();
    let ans = qObj.answer;
    let spread = Math.max(3, Math.floor(Math.abs(ans)*0.3)+2);
    let safety=0;
    while (wrongs.size < 3 && safety < 200) {
        safety++;
        let off = rnd(-spread, spread);
        let w = ans + off;
        if (w !== ans && w >= 0 && Number.isInteger(w)) wrongs.add(w);
    }
    let extra=1;
    while (wrongs.size < 3) { wrongs.add(ans+extra*2); extra++; }
    return { text:qObj.text, hint:'ما هو الجواب؟', answer:ans, choices:shuffle([ans, ...wrongs]), explanation:qObj.explanation, catKey:qObj.catKey };
}

/* ═══════════ GAME MODES ═══════════ */
function startGameWith(mode, op, customTable = null, forceTimer = false) {
    closeSheet('modeSheet'); closeSheet('opSheet'); closeSheet('trainingOpSheet');
    clearGameTimer();
    st.lastMode = mode; st.lastOp = op; currentOp = op; saveSt();
    G.mode = mode; G.op = op; G.score = 0; G.correct = 0; G.wrong = 0; G.streak = 0; G.bestStreak = 0; G.currentQ = 0;
    G.coinsEarned = 0; G.answered = false; G.ended = false; G.isTraining = false; G.customTable = customTable || null;
    G.askedQuestions = [];
    let hasTimer = false; let lives = 3;
    if (mode === 'classic') { G.totalQ = 10; hasTimer = forceTimer; if (hasTimer) { G.maxTime = 60; G.timeLeft = 60; lives = 3; } else { G.maxTime = 0; G.timeLeft = 0; lives = 0; } }
    else if (mode === 'speed') { G.totalQ = 9999; hasTimer = true; G.maxTime = 60; G.timeLeft = 60; lives = 3; }
    else if (mode === 'survival') { G.totalQ = 9999; hasTimer = false; lives = 1; }
    else if (mode === 'frenzy') { G.totalQ = 9999; hasTimer = true; G.maxTime = 30; G.timeLeft = 30; lives = 3; }
    else if (mode === 'daily') { G.totalQ = 5; hasTimer = false; lives = 0; }
    else if (mode === 'marathon') { G.totalQ = 20; hasTimer = false; lives = 0; }
    G.livesLeft = lives; G.hasTimer = hasTimer;
    G.helpersUsed = { skip: false, remove: false };
    const titles = { classic:'🧮 كلاسيك', speed:'⚡ سرعة 60ث', survival:'🔥 التحمّل', frenzy:'💥 اندفاع', daily:'🌟 تحدي اليوم', marathon:'🏃 ماراثون' };
    document.getElementById('gameModeTitle').textContent = titles[mode] || 'كلاسيك';
    document.getElementById('statScore').textContent = 0;
    document.getElementById('streakNum').textContent = 0;
    document.getElementById('streakFire').style.display = 'none';
    if (lives > 0) { document.getElementById('heartsStat').style.display = 'flex'; updateHeartsDisplay(); }
    else { document.getElementById('heartsStat').style.display = 'none'; }
    document.getElementById('helpersBar').style.display = 'flex';
    document.getElementById('xpCoinBar').style.display = 'flex';
    document.getElementById('gameXp').textContent = st.xp;
    document.getElementById('gameCoin').textContent = st.coins;
    if (hasTimer) {
        document.getElementById('bigTimerWrap').style.display = 'block';
        document.getElementById('bigTimer').textContent = G.timeLeft;
        document.getElementById('timerBar').style.width = '100%';
        if (G.timer) clearInterval(G.timer);
        G.timer = setInterval(() => {
            if (G.ended) { clearInterval(G.timer); G.timer = null; return; }
            if (G.timeLeft <= 0) { clearInterval(G.timer); G.timer = null; if (!G.ended) endGame(); }
            else {
                G.timeLeft--;
                const pct = (G.timeLeft / G.maxTime) * 100;
                document.getElementById('timerBar').style.width = pct + '%';
                document.getElementById('bigTimer').textContent = G.timeLeft;
                if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger'); document.getElementById('bigTimer').classList.add('danger'); }
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

function startTrainingMode(op = 'mix') {
    clearGameTimer();
    G.mode = 'classic'; G.op = op; G.score = 0; G.correct = 0; G.wrong = 0; G.streak = 0; G.bestStreak = 0;
    G.currentQ = 0; G.totalQ = 9999; G.coinsEarned = 0; G.answered = false; G.ended = false; G.isTraining = true;
    G.livesLeft = 99; G.customTable = null; G.hasTimer = true; G.helpersUsed = { skip: false, remove: false };
    G.askedQuestions = [];
    document.getElementById('gameModeTitle').textContent = '🎓 تدريب';
    document.getElementById('statScore').textContent = '0';
    document.getElementById('streakNum').textContent = '0';
    document.getElementById('streakFire').style.display = 'none';
    document.getElementById('heartsStat').style.display = 'flex';
    document.getElementById('heartsStat').innerHTML = `<div class="helper-btn" id="trainingTimeBtn" onclick="selectTrainingTime()" style="flex:0.7;"><div class="helper-btn-icon">⏱️</div><div class="helper-btn-label">تحديد الوقت</div></div>`;
    document.getElementById('helpersBar').style.display = 'none';
    G.timeLeft = 30; G.maxTime = 30;
    document.getElementById('bigTimerWrap').style.display = 'block';
    document.getElementById('bigTimer').textContent = G.timeLeft;
    document.getElementById('timerBar').style.width = '100%';
    if (G.timer) clearInterval(G.timer);
    G.timer = setInterval(() => {
        if (G.ended) { clearInterval(G.timer); G.timer = null; return; }
        if (G.timeLeft <= 0) { clearInterval(G.timer); G.timer = null; if (!G.ended) endGame(); }
        else {
            G.timeLeft--;
            const pct = (G.timeLeft / G.maxTime) * 100;
            document.getElementById('timerBar').style.width = pct + '%';
            document.getElementById('bigTimer').textContent = G.timeLeft;
            if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger'); document.getElementById('bigTimer').classList.add('danger'); }
            if (G.timeLeft > 0 && G.timeLeft <= 5) playSound('tick');
        }
    }, 1000);
    updateGameCoinsDisplay();
    document.getElementById('resultsOverlay').classList.remove('active');
    document.getElementById('gameOverlay').classList.add('active');
    loadQuestion();
}

function selectTrainingTime() {
    showConfirm('اختر وقت التدريب', 'اختر الوقت المناسب للتدريب', '30 ثانية', '60 ثانية', (is30) => {
        G.maxTime = is30 ? 30 : 60;
        G.timeLeft = G.maxTime;
        document.getElementById('bigTimer').textContent = G.timeLeft;
    });
}

/* ═══════════ HELPERS ═══════════ */
function useHelper(type) {
    if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي مساعدات'); return; }
    if (type === 'skip') {
        if (st.coins < 3) { showFeedback('💸 تحتاج 3💰'); return; }
        if (G.helpersUsed.skip) { showFeedback('⏭️ استُخدمت'); return; }
        st.coins -= 3; G.helpersUsed.skip = true;
        document.getElementById('helperSkip').classList.add('used');
        saveSt(); updateUI(); updateGameCoinsDisplay();
        if (G.hasTimer && G.maxTime > 0) {
            G.timeLeft = Math.max(0, G.timeLeft - 4);
            document.getElementById('bigTimer').textContent = G.timeLeft;
            showFeedback('⏭️ تخطيت السؤال -4 ثوانٍ');
            if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; }
        }
        loadQuestion();
    } else if (type === 'remove') {
        if (st.coins < 4) { showFeedback('💸 تحتاج 4💰'); return; }
        if (G.helpersUsed.remove) { showFeedback('🗑️ استُخدم'); return; }
        if (G.answered) return;
        st.coins -= 4; G.helpersUsed.remove = true;
        document.getElementById('helperRemove').classList.add('used');
        saveSt(); updateUI(); updateGameCoinsDisplay();
        const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')];
        const wrongs = btns.filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer);
        if (wrongs.length > 0) { wrongs[Math.floor(Math.random()*wrongs.length)].style.opacity='0.15'; wrongs[0].style.pointerEvents='none'; showFeedback('🗑️ حُذفت إجابة خاطئة'); }
    } else if (type === 'heart') {
        if (G.livesLeft >= 5) { showFeedback('❤️ وصلت الحد الأقصى'); return; }
        if (st.coins < 7) { showFeedback('💸 تحتاج 7💰'); return; }
        st.coins -= 7; G.livesLeft++; saveSt(); updateUI(); updateHeartsDisplay(); updateGameCoinsDisplay();
        showFeedback('💖 +1 قلب!'); playSound('levelup');
    }
}

function updateHeartsDisplay() {
    const row = document.getElementById('heartsRow');
    if (!row) return;
    const total = 3;
    let h = '';
    for (let i=0; i<total; i++) h+=`<span class="heart-icon${i>=G.livesLeft?' lost':''}">${G.mode==='survival'?'🖤':'❤️'}</span>`;
    row.innerHTML = h;
}

function updateGameCoinsDisplay() {
    const totalCoins = st.coins + Math.floor(G.coinsEarned);
    document.getElementById('gameCoins').textContent = totalCoins;
    document.getElementById('gameXp').textContent = st.xp;
    document.getElementById('gameCoin').textContent = totalCoins;
}

/* ═══════════ LOAD QUESTION ═══════════ */
function loadQuestion() {
    if (G.ended) return;
    if (G.currentQ >= G.totalQ && !G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy') { endGame(); return; }
    G.currentQ++;
    G.answered = false;
    G.helpersUsed.remove = false;
    document.getElementById('helperRemove').classList.remove('used');
    document.getElementById('explanationArea').innerHTML = '';
    let q;
    let attempts = 0;
    const maxAttempts = 50;
    do {
        if (G.isTraining) {
            if (G.op==='table' && G.customTable) q = genQ('table', st.difficulty, G.customTable);
            else q = genQ(G.op, st.difficulty);
        } else {
            if (G.op==='table' && G.customTable) q = genQ('table', st.difficulty, G.customTable);
            else q = genQ(G.op, st.difficulty);
        }
        const qKey = q.text + '|' + q.answer;
        const isEndless = G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy';
        if (!G.askedQuestions.includes(qKey) || G.isTraining || isEndless) break;
        attempts++;
        if (attempts > maxAttempts) break;
    } while (true);
    const isEndless = G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy';
    if (!G.isTraining && !isEndless) G.askedQuestions.push(q.text+'|'+q.answer);
    G.correctAnswer = q.answer;
    G.currentExplanation = q.explanation || '';
    G.currentCatKey = q.catKey || getCatStatsKey(G.op||'add');
    const qt = document.getElementById('questionText');
    qt.style.animation='none'; void qt.offsetWidth; qt.style.animation='';
    document.getElementById('questionNumber').textContent = G.isTraining ? `🎓 تدريب - ${G.correct+1}` :
        G.mode==='speed' ? `⚡ السؤال ${G.correct+1}` :
        G.mode==='frenzy' ? `💥 ${G.correct+1} إجابة` :
        G.mode==='survival' ? `❤️ ${G.livesLeft} قلوب` :
        `السؤال ${G.currentQ} من ${G.totalQ}`;
    document.getElementById('questionText').textContent = `${q.text} = ?`;
    document.getElementById('questionHint').textContent = q.hint || 'ما هو الجواب؟';
    document.getElementById('statQ').textContent = (G.isTraining || G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy') ? G.correct : `${G.currentQ}/${G.totalQ}`;
    const grid = document.getElementById('answersGrid');
    grid.innerHTML = '';
    const choices = q.choices || shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2]);
    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = c;
        btn.setAttribute('data-val', c);
        btn.onclick = () => checkAnswer(btn);
        grid.appendChild(btn);
    });
}

/* ═══════════ CHECK ANSWER ═══════════ */
function checkAnswer(btn) {
    if (G.answered || G.ended) return;
    G.answered = true;
    const val = parseInt(btn.getAttribute('data-val'));
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
    if (val === G.correctAnswer) {
        btn.classList.add('correct');
        G.correct++; G.streak++;
        if (G.streak > G.bestStreak) G.bestStreak = G.streak;
        G.score += 10 + G.streak*2;
        G.coinsEarned += 0.4;
        showFeedback(G.streak>=5 ? `🔥×${G.streak}` : '✅');
        playSound('correct');
        if (G.hasTimer && G.maxTime>0 && !G.isTraining) {
            G.timeLeft = Math.min(G.maxTime, G.timeLeft+1);
            const pct = (G.timeLeft/G.maxTime)*100;
            document.getElementById('timerBar').style.width = pct+'%';
            document.getElementById('bigTimer').textContent = G.timeLeft;
        }
        if (G.currentCatKey && st.stats[G.currentCatKey]) {
            let s = st.stats[G.currentCatKey];
            s.att++; s.cor++; s.max+=3;
            s.stars += Math.min(3, Math.floor(G.streak/3)+1);
            if (G.streak>=3) s.first++;
        }
        updTask('correct'); if (G.streak>=3) updTask('streak', G.streak);
        if (G.streak>=5) doConfetti();
        if (G.streak>=5 && G.streak%5===0) showComboEffect(G.streak);
        showFloatXP(10+G.streak*2);
        if (!G.isTraining) st.correctTotal++;
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.answer-btn').forEach(b => { if (parseInt(b.getAttribute('data-val'))===G.correctAnswer) b.classList.add('correct'); });
        G.wrong++; G.streak=0;
        if (G.hasTimer && G.maxTime>0 && !G.isTraining) {
            G.timeLeft = Math.max(0, G.timeLeft-1);
            const pct = (G.timeLeft/G.maxTime)*100;
            document.getElementById('timerBar').style.width = pct+'%';
            document.getElementById('bigTimer').textContent = G.timeLeft;
            if (G.timeLeft<=0) { clearGameTimer(); endGame(); return; }
        }
        if (G.isTraining) {
            showFeedback('❌'); playSound('wrong'); showExplanation();
        } else {
            if (G.livesLeft>0) {
                G.livesLeft--; updateHeartsDisplay();
                showFeedback('❌'); playSound('wrong'); showExplanation();
                if (G.livesLeft<=0) {
                    if (!st.dailyShieldUsed && useDailyShield()) { G.livesLeft=1; updateHeartsDisplay(); showFeedback('🛡️ درع الحماية!'); }
                    else { setTimeout(()=>{ if (!G.ended) endGame(); }, 700); return; }
                }
            } else {
                showFeedback('❌'); playSound('wrong'); showExplanation();
            }
        }
        if (G.currentCatKey && st.stats[G.currentCatKey]) { st.stats[G.currentCatKey].att++; st.stats[G.currentCatKey].max+=3; }
        if (!G.isTraining) st.wrongTotal++;
        // بطاقة قانون عند الخطأ
        if ((G.op==='laws' || G.currentCatKey==='mathlaws') && G.currentExplanation) {
            document.getElementById('explanationArea').innerHTML += `<div class="law-card" style="margin-top:8px;">📜 تذكير بالقانون: ${G.currentExplanation}</div>`;
        }
    }
    document.getElementById('statScore').textContent = G.score;
    document.getElementById('streakNum').textContent = G.streak;
    document.getElementById('streakFire').style.display = G.streak>=3 ? 'inline' : 'none';
    updateGameCoinsDisplay();
    debouncedSaveSt();
    const delay = 350;
    setTimeout(() => {
        if (G.ended) return;
        if (!G.isTraining && G.mode!=='speed' && G.mode!=='survival' && G.mode!=='frenzy' && G.currentQ>=G.totalQ) endGame();
        else loadQuestion();
    }, delay);
}

function showFeedback(msg) {
    const t = document.getElementById('feedbackToast');
    t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 900);
}

function showFloatXP(amt) {
    let el = document.createElement('div'); el.className='float-xp'; el.textContent=`+${amt}`;
    el.style.cssText=`left:${rnd(30,65)}%;top:40%;`; document.body.appendChild(el);
    setTimeout(()=>el.remove(), 1000);
}

function showComboEffect(c) {
    let popup = document.createElement('div'); popup.className='combo-popup'; popup.textContent=`🔥 ×${c}`;
    document.body.appendChild(popup); setTimeout(()=>popup.remove(), 900);
}

function showExplanation() {
    if (!G.currentExplanation) return;
    document.getElementById('explanationArea').innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`;
}

/* ═══════════ END GAME ═══════════ */
function endGame() {
    if (G.ended) return;
    G.ended = true; clearGameTimer();
    if (G.mode==='marathon' && G.correct > st.marathonBest) st.marathonBest = G.correct;
    updateWeeklyStats(G.score, G.correct);
    if (G.isTraining) {
        document.getElementById('gameOverlay').classList.remove('active');
        document.getElementById('trainingEndOverlay').classList.add('active');
        document.getElementById('trainResScore').textContent = G.score;
        document.getElementById('trainResCorrect').textContent = G.correct;
        document.getElementById('trainResStreak').textContent = G.bestStreak;
        document.getElementById('trainingEndSub').textContent = `أجبت على ${G.correct} سؤال`;
        return;
    }
    const earnedCoins = Math.floor(G.coinsEarned);
    st.correctTotal += G.correct;
    st.wrongTotal += G.wrong;
    st.coins += earnedCoins;
    st.totalGames++;
    if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak;
    if (G.score > st.bestScore) st.bestScore = G.score;
    const xpGained = G.score*2 + G.correct*5;
    st.xp += xpGained;
    while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext*1.3); playSound('levelup'); }
    if (['classic','speed','survival','frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct; st.catCounter.total += G.correct+G.wrong; }
    if (['speed','survival','frenzy','daily','marathon'].includes(G.mode)) st.catChallenges.games++;
    updTask('game'); if (G.mode==='daily') updTask('daily');
    const acc = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0;
    st.history.unshift({ mode:G.mode, score:G.score, correct:G.correct, acc, op:G.op });
    if (st.history.length>10) st.history.pop();
    saveSt();
    updateUI();
    checkAchievements();
    syncWithLeaderboard();
    const pct = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0;
    const emj = pct>=90 ? '🏆' : pct>=70 ? '⭐' : pct>=50 ? '😊' : '💪';
    const ttl = pct>=90 ? 'ممتاز!' : pct>=70 ? 'رائع!' : pct>=50 ? 'جيد!' : 'حاول مجدداً!';
    document.getElementById('resultsEmoji').textContent = emj;
    document.getElementById('resultsTitle').textContent = ttl;
    document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`;
    document.getElementById('resScore').textContent = G.score;
    document.getElementById('resCorrect').textContent = G.correct;
    document.getElementById('resStreak').textContent = G.bestStreak;
    document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`;
    document.getElementById('gameOverlay').classList.remove('active');
    document.getElementById('resultsOverlay').classList.add('active');
    if (pct>=70) doConfetti();
}

function playAgain() { document.getElementById('resultsOverlay').classList.remove('active'); startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }
function goHome() { document.getElementById('resultsOverlay').classList.remove('active'); goTab('home'); }
function confirmQuit() {
    showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الصفحة الرئيسية؟\nستفقد تقدمك في هذه الجلسة.', 'نعم، عد', 'استمرار', ok => {
        if (ok) {
            clearGameTimer();
            document.getElementById('gameOverlay').classList.remove('active');
            document.getElementById('resultsOverlay').classList.remove('active');
            if (G.correct>0 || G.wrong>0 && !G.ended && !G.isTraining) endGame();
            else { G.ended=true; clearGameTimer(); goTab('home'); }
        }
    });
}

function doConfetti() {
    const c=['#f0b90b','#7c3aed','#06b6d4','#10b981','#ef4444','#ffd54f'];
    for (let i=0; i<45; i++) { const el=document.createElement('div'); el.className='confetti-piece'; el.style.cssText=`left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-delay:${Math.random()*0.9}s;animation-duration:${1.4+Math.random()*1.2}s;`; document.body.appendChild(el); setTimeout(()=>el.remove(),3200); }
}

function updateDailyShield() { /* تم التعريف أعلاه */ }
function useDailyShield() {
    updateDailyShield();
    if (st.dailyShieldUsed) return false;
    st.dailyShieldUsed = true; saveSt(); return true;
}

/* ═══════════ WEEKLY STATS ═══════════ */
function updateWeeklyStats(score, correct) {
    const day = todayStr();
    if (!st.weeklyStats[day]) st.weeklyStats[day] = { score:0, correct:0 };
    st.weeklyStats[day].score += score;
    st.weeklyStats[day].correct += correct;
    const days = Object.keys(st.weeklyStats).sort();
    while (days.length > 7) { delete st.weeklyStats[days.shift()]; }
    debouncedSaveSt();
    drawWeeklyChart();
}

function drawWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const days = Object.keys(st.weeklyStats).sort();
    if (days.length===0) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
    const scores = days.map(d => st.weeklyStats[d].score);
    const maxScore = Math.max(1, ...scores);
    const w=canvas.width, h=canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
    ctx.lineWidth = 2;
    ctx.beginPath();
    days.forEach((d,i) => {
        const x = (i/(days.length-1)) * w;
        const y = h - (scores[i]/maxScore)*(h-10);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
}

/* دوال نهاية التدريب */
function retrain() {
    document.getElementById('trainingEndOverlay').classList.remove('active');
    startTrainingMode(G.op);
}
function changeTrainingTime() {
    document.getElementById('trainingEndOverlay').classList.remove('active');
    startTrainingMode(G.op);
    setTimeout(() => selectTrainingTime(), 200);
}
function closeTrainingEnd() {
    document.getElementById('trainingEndOverlay').classList.remove('active');
    goTab('home');
}

/* مشاركة التحدي */
function shareChallenge() {
    const link = `${window.location.origin}${window.location.pathname}?mode=${st.lastMode}&op=${st.lastOp}`;
    navigator.clipboard.writeText(link);
    showFeedback('🔗 رابط التحدي نسخ!');
}

/* ═══════════ INIT ═══════════ */
checkDailyReset();
