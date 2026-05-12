// storage.js

const SK = 'ho_math_v7';
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
    { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة', check: () => st.age && st.age >= 60 && st.correctTotal >= 30, reward: 20 }
];

const BADGES = {
    speed30: { icon: '⚡', cond: () => st.bestScore >= 30 },
    perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10 },
    level10: { icon: '🔷', cond: () => st.level >= 10 },
    allBasic: { icon: '🏅', cond: () => ['addition','subtraction','multiplication','division','table'].every(k => (st.stats[k]?.stars || 0) >= 15) }
};

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

function genDailyTasks() {
    return [
        { id: 't1', icon: '🎯', name: 'أول إجابة', desc: 'أجب على سؤال واحد صحيح', reward: 1, goal: 1, progress: 0, done: false },
        { id: 't2', icon: '🔥', name: 'تتابع ×3', desc: '3 إجابات صحيحة متتالية', reward: 3, goal: 3, progress: 0, done: false },
        { id: 't3', icon: '⚡', name: '10 إجابات صحيحة', desc: 'أجب على 10 أسئلة صحيحة', reward: 5, goal: 10, progress: 0, done: false },
        { id: 't4', icon: '🏃', name: 'جلستان كاملتان', desc: 'أنهِ جلستَي لعب كاملتَين', reward: 4, goal: 2, progress: 0, done: false },
        { id: 't5', icon: '💎', name: '25 إجابة', desc: 'أجب على 25 سؤالاً صحيحاً', reward: 8, goal: 25, progress: 0, done: false },
        { id: 't6', icon: '🌟', name: 'تحدي اليوم', desc: 'العب تحدي اليوم الخاص مرة', reward: 2, goal: 1, progress: 0, done: false }
    ];
}

function checkDailyReset() {
    if (st.dailyDate !== todayStr()) {
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
            if (t && !t.done) {
                t.progress = Math.min(t.goal, t.progress + amount);
                if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; }
            }
        });
    }
    if (type === 'streak' && amount >= 3) {
        const t = T.find(x => x.id === 't2');
        if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; }
    }
    if (type === 'game') {
        const t = T.find(x => x.id === 't4');
        if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + 1); if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; } }
    }
    if (type === 'daily') {
        const t = T.find(x => x.id === 't6');
        if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; }
    }
    if (changed) {
        playSound('levelup');
        saveSt();
        if (typeof renderTasks === 'function') renderTasks();
    }
}

function checkAchievements() {
    let newUnlocks = [];
    ACHIEVEMENTS_DEF.forEach(a => {
        if (!st.achievementsUnlocked.includes(a.id) && a.check()) {
            st.achievementsUnlocked.push(a.id);
            if (a.reward > 0) st.coins += a.reward;
            newUnlocks.push(a.name);
        }
    });
    if (newUnlocks.length) {
        saveSt();
        if (typeof showFeedback === 'function') showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`);
        if (typeof playSound === 'function') playSound('levelup');
        if (typeof updateUI === 'function') updateUI();
    }
    if (st.achievementsUnlocked.length === ACHIEVEMENTS_DEF.length && !st.achievementRewardClaimed) {
        st.achievementRewardClaimed = true;
        st.coins += 5;
        saveSt();
        if (typeof showFeedback === 'function') showFeedback('🎉 جميع الإنجازات! +5 عملات إضافية');
        if (typeof playSound === 'function') playSound('levelup');
        if (typeof updateUI === 'function') updateUI();
    }
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

function getCatStatsKey(op) {
    const map = {
        add: 'addition', sub: 'subtraction', mul: 'multiplication', div: 'division',
        mix: 'addition', table: 'table', percent: 'percentage', fraction: 'division',
        power: 'algebra', sqrt: 'squareroot', equation: 'algebra', sequence: 'puzzles',
        algebra: 'algebra', word: 'wordproblems', geometry: 'geometry', advanced: 'algebra',
        laws: 'mathlaws'
    };
    return map[op] || 'addition';
}

// تهيئة الحالة العامة فور تحميل الملف
let st = loadSt();
let currentOp = st.lastOp || 'mix';
