/* ═══════════════════════════════════════════════════════════════
   HO Math v11 — STATE MANAGEMENT (Fixed & Unified)
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   GLOBAL STATE (defState, sanitize, load/save)
════════════════════════════════════════════════════ */

const SK = 'ho_math_v11';

/* ─── دوال الوقت ─── */
function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function weekStr() {
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
}
function monthStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

/* ─── الحالة الافتراضية (مع كافة الحقول) ─── */
function defState() {
    return {
        // هوية اللاعب
        name:           'Player',
        age:            0,
        birthDate:      '2000-01-01',
        gender:         'm',
        avatar:         '👦',
        profilePhoto:   null,
        serialNumber:   '',
        darkMode:       true,
        // الثيم
        tGold:    '#f0b90b',
        tAccent:  '#7c3aed',
        tAccent2: '#06b6d4',
        // التقدم
        xp:        0,
        xpToNext:  1000,
        level:     1,
        // العملات
        coins:      10,
        totalCoinsEarned: 0,
        totalCoinsSpent:  0,
        // الإحصائيات الكلية
        correctTotal: 0,
        wrongTotal:   0,
        bestStreak:   0,
        totalGames:   0,
        bestScore:    0,
        // الإعدادات
        difficulty:        'easy',
        lastMode:          'classic',
        lastOp:            'mix',
        soundOn:           true,
        soundVolume:       80,
        bgOn:              true,
        bgVolume:          60,
        vibrationOn:       false,
        vibrationStrength: 30,
        // فئات الإحصاء
        stats:         {},
        history:       [],
        catCounter:    { correct: 0, total: 0 },
        catChallenges: { games: 0 },
        // المهام اليومية
        dailyTasks:     [],
        dailyDate:      todayStr(),
        // مهام التحدي
        challengeTasks:     [],
        challengeTasksDate: '',
        // إحصائيات دورية
        dailyStats:   { correct: 0, wrong: 0, games: 0, date: todayStr() },
        weeklyStats:  { correct: 0, wrong: 0, games: 0, bestStreak: 0, bestScore: 0, week: weekStr() },
        monthlyStats: { correct: 0, wrong: 0, games: 0, bestStreak: 0, bestScore: 0, month: monthStr() },
        // الوقت
        sessionTimeSecs:  0,
        sessionDate:      todayStr(),
        totalPlayTimeSecs: 0,
        // القلوب والدرع
        hearts:          3,
        dailyShieldUsed: false,
        lastShieldDate:  null,
        // السلسلة اليومية
        dailyStreak:     0,
        lastDailyDate:   null,
        // مكافأة تسجيل الدخول
        loginRewardDate:    '',
        loginRewardClaimed: false,
        // صندوق المفاجآت
        lootboxLastDate:   '',
        lootboxDayCount:   0,
        // الإنجازات
        achievementsUnlocked:   [],
        achievementRewardClaimed: false,
        // الألقاب
        ownedEmojis: ['👦'],
        firstPlaceData: { streak: 0, lastDate: null, titles: [], currentTitle: null },
        seasonStart: null,
        // المنافسة
        challengeBestScore:  0,
        challengeWeeklyBest: 0,
        challengeWeeklyDate: '',
        // الإشعارات
        notifyOvertak: true,
        // قوى المتجر
        powerups: {},
        // معرف فريد للاعب (Firebase)
        playerUID: null,
        // تتبع الترتيب الأسبوعي السابق
        _lastWeeklyRank: null,
        _wasWeeklyChampion: false,
    };
}

/* ─── تنظيف وتحقق عند التحميل (دالة واحدة موحدة) ─── */
function sanitizeState(s) {
    // أساسيات
    if (typeof s.coins    !== 'number' || s.coins    < 0) s.coins    = 0;
    if (typeof s.level    !== 'number' || s.level    < 1) s.level    = 1;
    if (typeof s.xp       !== 'number' || s.xp       < 0) s.xp       = 0;
    if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000;
    if (!s.ownedEmojis || !Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦'];
    if (!s.stats       || typeof s.stats !== 'object')    s.stats       = {};
    if (!s.history)    s.history    = [];
    if (!s.catCounter) s.catCounter = { correct: 0, total: 0 };
    if (!s.catChallenges) s.catChallenges = { games: 0 };
    if (!s.achievementsUnlocked) s.achievementsUnlocked = [];
    if (s.achievementRewardClaimed === undefined) s.achievementRewardClaimed = false;
    if (!s.birthDate)  s.birthDate = '2000-01-01';
    if (typeof s.age !== 'number') s.age = 0;
    if (s.darkMode === undefined)  s.darkMode = true;
    if (typeof s.challengeBestScore  !== 'number') s.challengeBestScore  = 0;
    if (typeof s.challengeWeeklyBest !== 'number') s.challengeWeeklyBest = 0;
    if (!s.challengeWeeklyDate) s.challengeWeeklyDate = '';
    if (typeof s.soundVolume       !== 'number') s.soundVolume       = 80;
    if (typeof s.bgVolume          !== 'number') s.bgVolume          = 60;
    if (s.vibrationOn  === undefined) s.vibrationOn  = false;
    if (typeof s.vibrationStrength !== 'number') s.vibrationStrength = 30;
    if (s.profilePhoto === undefined) s.profilePhoto = null;
    if (typeof s.totalCoinsEarned  !== 'number') s.totalCoinsEarned  = 0;
    if (typeof s.totalCoinsSpent   !== 'number') s.totalCoinsSpent   = 0;
    if (typeof s.totalPlayTimeSecs !== 'number') s.totalPlayTimeSecs = 0;
    if (!s.loginRewardDate)    s.loginRewardDate    = '';
    if (s.loginRewardClaimed === undefined) s.loginRewardClaimed = false;
    if (!s.lootboxLastDate)    s.lootboxLastDate    = '';
    if (typeof s.lootboxDayCount !== 'number') s.lootboxDayCount = 0;
    if (s.notifyOvertak === undefined) s.notifyOvertak = true;
    if (!s.challengeTasks || !Array.isArray(s.challengeTasks)) s.challengeTasks = [];
    if (!s.challengeTasksDate) s.challengeTasksDate = '';
    if (!s.firstPlaceData) s.firstPlaceData = { streak: 0, lastDate: null, titles: [], currentTitle: null };
    if (s.firstPlaceData.titles === undefined) s.firstPlaceData.titles = [];
    if (s.firstPlaceData.currentTitle === undefined) s.firstPlaceData.currentTitle = null;
    if (!s.powerups || typeof s.powerups !== 'object') s.powerups = {};
    if (!s.playerUID) s.playerUID = null;
    if (s._lastWeeklyRank === undefined) s._lastWeeklyRank = null;
    if (s._wasWeeklyChampion === undefined) s._wasWeeklyChampion = false;

    // إحصائيات دورية: إعادة تعيين إذا تغير اليوم/الأسبوع/الشهر
    if (!s.dailyStats || s.dailyStats.date !== todayStr()) {
        s.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
    }
    if (!s.weeklyStats || s.weeklyStats.week !== weekStr()) {
        s.weeklyStats = {
            correct: 0, wrong: 0, games: 0,
            bestStreak: 0, bestScore: 0,
            week: weekStr()
        };
    }
    if (typeof s.weeklyStats.bestScore !== 'number') s.weeklyStats.bestScore = 0;
    if (!s.monthlyStats || s.monthlyStats.month !== monthStr()) {
        s.monthlyStats = {
            correct: 0, wrong: 0, games: 0,
            bestStreak: 0, bestScore: 0,
            month: monthStr()
        };
    }
    return s;
}

/* ─── تحميل وحفظ ─── */
function loadSt() {
    try {
        const s = JSON.parse(localStorage.getItem(SK));
        if (s && s.name !== undefined) return sanitizeState(s);
    } catch(e) {}
    return defState();
}
function saveSt() {
    try {
        localStorage.setItem(SK, JSON.stringify(st));
        if (st.serialNumber) saveSerialBackup(st.serialNumber, st);
    } catch(e) { console.warn('saveSt error', e); }
}
function saveSerialBackup(serial, data) {
    try { localStorage.setItem(`ho_math_backup_${serial}`, JSON.stringify(data)); } catch(e) {}
}
function loadSerialBackup(serial) {
    try {
        const d = localStorage.getItem(`ho_math_backup_${serial}`);
        if (d) return JSON.parse(d);
    } catch(e) {}
    return null;
}

/* ═══════════════════════════════════════════════
   نظام العملات (earnCoins / spendCoins) موحد
════════════════════════════════════════════════ */
function earnCoins(amount, reason) {
    if (amount <= 0) return 0;
    const actual = Math.max(1, Math.floor(amount * 0.4)); // 40% كسب
    st.coins += actual;
    st.totalCoinsEarned += actual;
    saveSt();
    return actual;
}
function spendCoins(amount, reason) {
    if (amount <= 0) return true;
    if (st.coins < amount) return false;
    st.coins -= amount;
    st.totalCoinsSpent += amount;
    saveSt();
    return true;
}
function getCoinRatio() {
    const total = st.totalCoinsEarned + st.totalCoinsSpent;
    if (total === 0) return { earnPct: 40, spendPct: 60 };
    return {
        earnPct: Math.round((st.totalCoinsEarned / total) * 100),
        spendPct: Math.round((st.totalCoinsSpent / total) * 100)
    };
}

/* ═══════════════════════════════════════════════
   نظام XP والمستوى مع مكافآت الفتح
════════════════════════════════════════════════ */
function addXP(xpAmount) {
    if (xpAmount <= 0) return 0;
    st.xp += xpAmount;
    let levelsGained = 0;
    while (st.xp >= st.xpToNext) {
        st.xp -= st.xpToNext;
        st.level++;
        levelsGained++;
        const multiplier = st.level % 5 === 0 ? 1.5 : 1.35;
        st.xpToNext = Math.floor(st.xpToNext * multiplier);
        playSound('levelup');
        checkLevelUnlockReward(st.level);
    }
    saveSt();
    return levelsGained;
}
const LEVEL_UNLOCKS = {
    2:  'فتح الضرب والقسمة! ✖️➗',
    3:  'فتح الصعوبة المتوسطة! 🟡',
    4:  'فتح قسم التحديات! ⚡',
    5:  'فتح الصعوبة الصعبة! 🟠 • +10💰',
    7:  'فتح الرياضيات المتقدمة! 📐',
    8:  'فتح مستوى العبقري! 🔴',
    10: 'فتح قوانين وألغاز! 📜 • +15💰',
    15: '🌟 مستوى متميز! شارة خاصة • +20💰',
    20: '👑 مستوى 20! لقب "بطل الأرقام" • +30💰',
    25: '🏆 مستوى 25! شارة ذهبية • +25💰',
    30: '💎 مستوى 30! "أسطورة الرياضيات" • +40💰',
    50: '🔱 مستوى 50! حالة أسطورية • +50💰',
};
function checkLevelUnlockReward(level) {
    const msg = LEVEL_UNLOCKS[level];
    if (!msg) return;
    if (level === 5)  earnCoins(10, 'level_reward');
    if (level === 10) earnCoins(15, 'level_reward');
    if (level === 15) earnCoins(20, 'level_reward');
    if (level === 20) earnCoins(30, 'level_reward');
    if (level === 25) earnCoins(25, 'level_reward');
    if (level === 30) earnCoins(40, 'level_reward');
    if (level === 50) earnCoins(50, 'level_reward');
    setTimeout(() => showLevelUpModal(level, msg), 600);
}
function showLevelUpModal(level, msg) {
    const existing = document.getElementById('levelUpModal');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.id = 'levelUpModal';
    div.style.cssText = `position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);animation:fadeIn 0.3s ease;`;
    div.innerHTML = `<div style="background:linear-gradient(135deg,var(--surface2),var(--surface3));border:2px solid var(--gold);border-radius:26px;padding:32px 28px;text-align:center;max-width:320px;width:88%;box-shadow:0 8px 40px rgba(240,185,11,0.3);animation:scaleIn 0.35s cubic-bezier(.34,1.56,.64,1);">
        <div style="font-size:3em;margin-bottom:10px;">🎉</div>
        <div style="font-size:1.15em;font-weight:900;color:var(--gold);margin-bottom:6px;">المستوى ${level}!</div>
        <div style="font-size:0.82em;color:var(--text2);line-height:1.6;margin-bottom:20px;">${msg}</div>
        <button onclick="document.getElementById('levelUpModal').remove()" style="background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;border:none;border-radius:14px;padding:12px 32px;font-family:'Tajawal',sans-serif;font-size:0.92em;font-weight:900;cursor:pointer;width:100%;">رائع! 🚀</button>
    </div>`;
    document.body.appendChild(div);
    setTimeout(() => { if (document.getElementById('levelUpModal')) div.remove(); }, 5000);
}

/* ═══════════════════════════════════════════════
   تسجيل الإحصائيات الدورية (يومية/أسبوعية/شهرية)
════════════════════════════════════════════════ */
function recordDailyStat(type, value) {
    // يومية
    if (!st.dailyStats || st.dailyStats.date !== todayStr()) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
    }
    // أسبوعية
    if (!st.weeklyStats || st.weeklyStats.week !== weekStr()) {
        st.weeklyStats = { correct:0, wrong:0, games:0, bestStreak:0, bestScore:0, week: weekStr() };
    }
    // شهرية
    if (!st.monthlyStats || st.monthlyStats.month !== monthStr()) {
        st.monthlyStats = { correct:0, wrong:0, games:0, bestStreak:0, bestScore:0, month: monthStr() };
    }
    if (type === 'correct') {
        st.dailyStats.correct++;
        st.weeklyStats.correct++;
        st.monthlyStats.correct++;
    } else if (type === 'wrong') {
        st.dailyStats.wrong++;
        st.weeklyStats.wrong++;
        st.monthlyStats.wrong++;
    } else if (type === 'game') {
        st.dailyStats.games++;
        st.weeklyStats.games++;
        st.monthlyStats.games++;
    } else if (type === 'streak') {
        if (st.bestStreak > (st.weeklyStats.bestStreak || 0)) st.weeklyStats.bestStreak = st.bestStreak;
        if (st.bestStreak > (st.monthlyStats.bestStreak || 0)) st.monthlyStats.bestStreak = st.bestStreak;
    } else if (type === 'score' && typeof value === 'number') {
        if (value > (st.weeklyStats.bestScore || 0)) st.weeklyStats.bestScore = value;
        if (value > (st.monthlyStats.bestScore || 0)) st.monthlyStats.bestScore = value;
    }
    saveSt();
}

/* ═══════════════════════════════════════════════
   مكافأة تسجيل الدخول اليومي والسلسلة
════════════════════════════════════════════════ */
function checkDailyLoginReward() {
    const today = todayStr();
    if (st.loginRewardDate === today) return;
    const yesterday = (() => { const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; })();
    if (st.loginRewardDate === yesterday) {
        st.dailyStreak = (st.dailyStreak || 0) + 1;
    } else {
        st.dailyStreak = 1;
    }
    let reward = 2;
    if (st.dailyStreak >= 3) reward = 4;
    if (st.dailyStreak >= 7) reward = 7;
    if (st.dailyStreak >= 14) reward = 12;
    if (st.dailyStreak >= 30) reward = 20;
    earnCoins(reward, 'login_reward');
    st.loginRewardDate = today;
    st.lastDailyDate = today;
    saveSt();
    setTimeout(() => showLoginRewardPopup(reward, st.dailyStreak), 1200);
}
function showLoginRewardPopup(reward, streak) {
    const div = document.createElement('div');
    div.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:9998;background:linear-gradient(135deg,var(--surface2),var(--surface3));border:1.5px solid rgba(240,185,11,0.4);border-radius:18px;padding:14px 22px;text-align:center;min-width:220px;box-shadow:0 6px 30px rgba(0,0,0,0.4);animation:slideUp 0.4s cubic-bezier(.34,1.56,.64,1);`;
    div.innerHTML = `<div style="font-size:1.5em;margin-bottom:4px;">🎁</div><div style="font-size:0.85em;font-weight:900;color:var(--gold);">مكافأة اليوم</div><div style="font-size:1.3em;font-weight:900;color:var(--text);margin:4px 0;">+${reward} 💰</div><div style="font-size:0.65em;color:var(--text3);">السلسلة: ${streak} يوم 🔥</div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

/* ═══════════════════════════════════════════════
   صندوق المفاجآت كل 7 أيام
════════════════════════════════════════════════ */
function checkLootbox() {
    const today = todayStr();
    if (!st.lootboxLastDate) {
        st.lootboxLastDate = today;
        st.lootboxDayCount = 1;
        saveSt(); return;
    }
    if (st.lootboxLastDate === today) return;
    st.lootboxDayCount++;
    st.lootboxLastDate = today;
    if (st.lootboxDayCount >= 7) {
        st.lootboxDayCount = 0;
        saveSt();
        setTimeout(() => openLootbox(), 2000);
    } else {
        saveSt();
    }
}
function openLootbox() {
    const prizes = [
        { label: '🪙 +15 عملة',   action: () => earnCoins(15, 'lootbox') },
        { label: '🪙 +25 عملة',   action: () => earnCoins(25, 'lootbox') },
        { label: '🪙 +10 عملة',   action: () => earnCoins(10, 'lootbox') },
        { label: '⚡ +500 XP',    action: () => addXP(500) },
        { label: '🛡️ درع الحماية', action: () => { st.dailyShieldUsed = false; saveSt(); } },
        { label: '🪙 +30 عملة',   action: () => earnCoins(30, 'lootbox') },
    ];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    prize.action();
    const div = document.createElement('div');
    div.style.cssText = `position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);`;
    div.innerHTML = `<div style="background:linear-gradient(135deg,var(--surface2),var(--surface3));border:2px solid var(--gold);border-radius:26px;padding:32px 28px;text-align:center;max-width:300px;width:86%;box-shadow:0 8px 40px rgba(240,185,11,0.35);animation:scaleIn 0.4s cubic-bezier(.34,1.56,.64,1);">
        <div style="font-size:3.5em;margin-bottom:8px;">🎁</div><div style="font-size:1em;font-weight:900;color:var(--gold);margin-bottom:4px;">صندوق المفاجآت!</div>
        <div style="font-size:0.78em;color:var(--text2);margin-bottom:16px;">7 أيام دخول متتالية 🎉</div>
        <div style="font-size:1.4em;font-weight:900;color:var(--text);margin-bottom:20px;">${prize.label}</div>
        <button onclick="this.closest('div[style]').remove()" style="background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;border:none;border-radius:14px;padding:12px 32px;font-family:'Tajawal',sans-serif;font-size:0.92em;font-weight:900;cursor:pointer;width:100%;">رائع! ✨</button>
    </div>`;
    document.body.appendChild(div);
}

/* ═══════════════════════════════════════════════
   درع الحماية اليومي
════════════════════════════════════════════════ */
function updateDailyShield() {
    const today = todayStr();
    if (st.lastShieldDate !== today) {
        st.dailyShieldUsed = false;
        st.lastShieldDate = today;
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

/* ═══════════════════════════════════════════════
   توليد الرقم التسلسلي
════════════════════════════════════════════════ */
function generateSerialNumber(birthDate, name) {
    const nameEng = (name || 'User').replace(/[^a-zA-Z]/g, '').slice(0,4).toUpperCase();
    const cleanDate = birthDate.replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4,'0');
    let count = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
    localStorage.setItem('ho_math_user_count', count);
    return `${cleanDate}-${nameEng}-${randomPart}-${count}`;
}
function updateSerialNumberDisplay() {
    ['serialNumberDisplay','settingsSerialDisplay','settingsPageSerialDisplay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.serialNumber || '---';
    });
}
function copySerialNumber() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم تسلسلي — احفظ الملف الشخصي أولاً'); return; }
    navigator.clipboard.writeText(st.serialNumber).catch(()=>{});
    showFeedback('📋 تم نسخ الرقم التسلسلي');
}
function restoreAccount() {
    const serial = document.getElementById('restoreSerialInput').value.trim();
    if (!serial) { showFeedback('الرجاء إدخال الرقم التسلسلي'); return; }
    const savedData = loadSerialBackup(serial);
    if (!savedData) { showFeedback('⚠️ لم يتم العثور على حساب بهذا الرقم'); return; }
    Object.assign(st, sanitizeState(savedData));
    saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
    applyProfilePhoto();
    showFeedback('✅ تم استعادة الحساب بنجاح');
    const panel = document.getElementById('restorePanel');
    if (panel) panel.style.display = 'none';
    const inp = document.getElementById('restoreSerialInput');
    if (inp) inp.value = '';
}
function restoreFromSettingsPage() {
    const inp = document.getElementById('settingsRestoreInput2');
    const serial = inp ? inp.value.trim() : '';
    if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
    const savedData = loadSerialBackup(serial);
    if (!savedData) { showFeedback('⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
    Object.assign(st, sanitizeState(savedData));
    saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
    applyProfilePhoto();
    updateSerialNumberDisplay();
    if (inp) inp.value = '';
    const panel = document.getElementById('settingsRestorePanel2');
    if (panel) panel.style.display = 'none';
    showFeedback('✅ تم استعادة الحساب');
}
function toggleSettingsRestorePanel() {
    const p = document.getElementById('settingsRestorePanel2');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
}
function showRestoreAccount() {
    const panel = document.getElementById('restorePanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

/* ═══════════════════════════════════════════════
   إعادة تعيين كامل
════════════════════════════════════════════════ */
function confirmResetComplete(force) {
    showConfirm('البدء من جديد', 'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟', 'نعم، احذف الكل', 'إلغاء', (ok) => {
        if (ok) {
            localStorage.removeItem(SK);
            for (let i = localStorage.length-1; i>=0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ho_math_backup_')) localStorage.removeItem(key);
            }
            localStorage.removeItem('ho_math_user_count');
            st = defState();
            saveSt();
            currentOp = st.lastOp || 'mix';
            updateUI(); loadProfileForm(); applyDarkMode(); applyProfilePhoto();
            if (typeof clearGameTimer === 'function') clearGameTimer();
            if (typeof G !== 'undefined' && G) { G.ended = true; if (G.timer) clearInterval(G.timer); }
            goTab('home');
            showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية');
        }
    });
}

/* ═══════════════════════════════════════════════
   حساب العمر
════════════════════════════════════════════════ */
function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return 0;
    try {
        const b = new Date(birthDate);
        const now = new Date();
        let age = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
        return Math.max(0, age);
    } catch(e) { return 0; }
}

/* ═══════════════════════════════════════════════
   مفتاح اللاعب لـ Firebase
════════════════════════════════════════════════ */
function _getPlayerKey() {
    if (!st.playerUID) {
        st.playerUID = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
        saveSt();
    }
    return (st.name + '_' + st.playerUID).replace(/[^a-zA-Z0-9_]/g, '_');
}

/* ═══════════════════════════════════════════════
   دالة getDifficultyByLevel (مستوى الصعوبة حسب المستوى)
════════════════════════════════════════════════ */
function getDifficultyByLevel() {
    if (st.level >= 8) return 'genius';
    if (st.level >= 5) return 'hard';
    if (st.level >= 3) return 'medium';
    return 'easy';
}

/* ═══════════════════════════════════════════════
   تهيئة الحالة العامة
════════════════════════════════════════════════ */
var st = loadSt();
var currentOp = st.lastOp || 'mix';

/* ضمان وجود stats لكل فئة أساسية */
const initCat = (key) => { if (!st.stats[key]) st.stats[key] = { att:0, cor:0, first:0, stars:0, max:0 }; };
['addition','subtraction','multiplication','division','table','algebra','geometry','mathlaws','puzzles','wordproblems','percentage','squareroot'].forEach(initCat);

// ضمان ownedEmojis مناسب للجنس
if (st.ownedEmojis.length === 0) st.ownedEmojis = [st.gender === 'f' ? '👧' : '👦'];
if (!st.ownedEmojis.includes(st.avatar) && st.avatar) st.ownedEmojis.push(st.avatar);
saveSt();
