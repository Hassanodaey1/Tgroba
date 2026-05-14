/* ═══════════ GLOBAL STATE ═══════════ */
const SK = 'ho_math_v7';

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ✅ نقلت دالة توليد المهام اليومية إلى هنا لتكون متاحة قبل استخدامها
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
        vibrationOn: true,      // ✅ إضافة دعم الاهتزاز
        stats: {},
        history: [],
        catCounter: { correct: 0, total: 0 },
        catChallenges: { games: 0 },
        dailyTasks: genDailyTasks(),   // ✅ الآن الدالة معرفة
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
        challengeBestScore: 0,
        playerUID: ''   // ✅ لإستخدامه في المزامنة الاحتياطية
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
    if (typeof s.challengeBestScore !== 'number') s.challengeBestScore = 0;
    if (s.vibrationOn === undefined) s.vibrationOn = true;
    if (!s.dailyTasks || !Array.isArray(s.dailyTasks)) s.dailyTasks = genDailyTasks();
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
                if (window.G) { G.ended = true; if (G.timer) clearInterval(G.timer); }
                goTab('home');
                showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية');
            }
        });
}
