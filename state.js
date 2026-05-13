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
        bestCompScore: 0,        // أفضل نقاط في وضع المنافسة
        difficulty: 'easy',
        lastMode: 'classic',
        lastOp: 'mix',
        soundOn: true,
        bgOn: true,
        stats: {},
        history: [],
        catCounter: { correct: 0, total: 0 },
        catChallenges: { games: 0 },
        dailyTasks: null,        // سيتم توليدها لاحقاً
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
        darkMode: true,
        // بيانات جوجل
        googleUid: null,
        googleEmail: null,
        customPhotoURL: null,
        avatarFrame: 'none'
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
    if (s.bestCompScore === undefined) s.bestCompScore = 0;
    if (!s.dailyTasks) s.dailyTasks = genDailyTasks();
    return s;
}

function loadSt() {
    try {
        const s = JSON.parse(localStorage.getItem(SK));
        if (s && s.name !== undefined) {
            // إذا كان هناك serialNumber قديم، نحذفه
            if (s.serialNumber) delete s.serialNumber;
            return sanitizeState(s);
        }
    } catch (e) {}
    return defState();
}

function saveSt() {
    try {
        // ننشئ نسخة بدون serialNumber
        const toSave = { ...st };
        if (toSave.serialNumber) delete toSave.serialNumber;
        localStorage.setItem(SK, JSON.stringify(toSave));
    } catch (e) {}
}

let st = loadSt();
let currentOp = st.lastOp || 'mix';

/* ═══════════ RESET COMPLETE ═══════════ */
function confirmResetComplete(force) {
    showConfirm('البدء من جديد',
        'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟',
        'نعم، احذف الكل', 'إلغاء', (ok) => {
            if (ok) {
                localStorage.removeItem(SK);
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
