/* ═══════════════════════════════════════════════════
   HO Math v10 — STATE
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */
const SK = 'ho_math_v10';

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function defState() {
    return {
        name: 'Player', age: 0, birthDate: '2000-01-01', gender: 'm', avatar: '👦',
        xp: 0, xpToNext: 1000, level: 1, coins: 10,
        correctTotal: 0, wrongTotal: 0, bestStreak: 0, totalGames: 0, bestScore: 0,
        difficulty: 'easy', lastMode: 'classic', lastOp: 'mix',
        soundOn: true, bgOn: true, vibrationOn: true,
        soundVolume: 80, bgVolume: 60,
        stats: {}, history: [],
        catCounter: { correct: 0, total: 0 },
        catChallenges: { games: 0 },
        dailyTasks: [], dailyDate: todayStr(),
        tGold: '#f0b90b', tAccent: '#7c3aed', tAccent2: '#06b6d4',
        sessionTimeSecs: 0, sessionDate: todayStr(),
        ownedEmojis: ['👦'],
        hearts: 3,
        dailyStreak: 0, lastDailyDate: null,
        dailyShieldUsed: false, lastShieldDate: null,
        achievementsUnlocked: [], achievementRewardClaimed: false,
        serialNumber: '', darkMode: true,
        challengeBestScore: 0,
        /* ─── جديد v10 ─── */
        survivalBestScore: 0,   // وضع البقاء
        speedBestScore: 0,      // وضع السرعة
        flashBestScore: 0,      // وضع الفلاشات
        memoryBestScore: 0,     // وضع الذاكرة
        skills: {},             // مهارات مشتراة
        weeklyChallengeDone: false,
        weeklyDate: '',
        sessionSummaries: [],   // ملخصات الجلسات الأخيرة
        teamName: '',
        teamScore: 0,
    };
}

function sanitizeState(s) {
    const def = defState();
    Object.keys(def).forEach(k => { if (s[k] === undefined) s[k] = def[k]; });
    if (typeof s.coins !== 'number' || s.coins < 0) s.coins = 0;
    if (typeof s.level !== 'number' || s.level < 1) s.level = 1;
    if (typeof s.xp !== 'number' || s.xp < 0) s.xp = 0;
    if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000;
    if (!Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦'];
    if (!s.stats || typeof s.stats !== 'object') s.stats = {};
    if (!Array.isArray(s.history)) s.history = [];
    if (!s.catCounter) s.catCounter = { correct: 0, total: 0 };
    if (!s.catChallenges) s.catChallenges = { games: 0 };
    if (!Array.isArray(s.achievementsUnlocked)) s.achievementsUnlocked = [];
    if (!s.birthDate) s.birthDate = '2000-01-01';
    if (typeof s.age !== 'number') s.age = 0;
    if (!s.skills) s.skills = {};
    if (!Array.isArray(s.sessionSummaries)) s.sessionSummaries = [];
    return s;
}

function loadSt() {
    try {
        const raw = localStorage.getItem(SK);
        if (raw) { const s = JSON.parse(raw); if (s && s.name !== undefined) return sanitizeState(s); }
        /* ترقية من v7 */
        const old = localStorage.getItem('ho_math_v7');
        if (old) { const s = JSON.parse(old); if (s && s.name !== undefined) return sanitizeState(s); }
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
    try { const d = localStorage.getItem(`ho_math_backup_${serial}`); if (d) return JSON.parse(d); } catch (e) {}
    return null;
}

function generateSerialNumber(birthDate, name) {
    const nameEng = (name || 'User').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
    const cleanDate = (birthDate || '20000101').replace(/-/g, '');
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const count = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
    localStorage.setItem('ho_math_user_count', count);
    return `${cleanDate}-${nameEng}-${rand}-${count}`;
}

function updateSerialNumberDisplay() {
    ['serialNumberDisplay','settingsSerialDisplay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.serialNumber || 'احفظ الملف الشخصي أولاً';
    });
}

function copySerialNumber() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد'); return; }
    navigator.clipboard.writeText(st.serialNumber).catch(() => {});
    showFeedback('📋 تم النسخ!');
}

function showRestoreAccount() {
    const p = document.getElementById('restorePanel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function restoreAccount() {
    const serial = (document.getElementById('restoreSerialInput')?.value || '').trim();
    if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
    const data = loadSerialBackup(serial);
    if (!data) { showFeedback('⚠️ لم يُعثر على حساب'); return; }
    Object.assign(st, sanitizeState(data));
    saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
    showFeedback('✅ تم الاستعادة');
    const p = document.getElementById('restorePanel');
    if (p) p.style.display = 'none';
}

var st = loadSt();
var currentOp = st.lastOp || 'mix';

/* ═══ تصفير كامل ═══ */
function confirmResetComplete() {
    showConfirm('البدء من جديد',
        'سيتم حذف كل البيانات. لا يمكن التراجع. هل أنت متأكد؟',
        'نعم، احذف الكل', 'إلغاء', ok => {
            if (!ok) return;
            [SK, 'ho_math_v7', 'ho_math_user_count'].forEach(k => localStorage.removeItem(k));
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const k = localStorage.key(i);
                if (k?.startsWith('ho_math_backup_')) localStorage.removeItem(k);
            }
            st = defState(); saveSt(); currentOp = 'mix';
            updateUI(); loadProfileForm(); applyDarkMode();
            if (typeof clearGameTimer === 'function') clearGameTimer();
            goTab('home');
            showFeedback('🔄 تمت إعادة الضبط');
        });
}
