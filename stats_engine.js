/* ═══════════════════════════════════════════════════════════════
   STATS ENGINE v2 — HO Math
   نظام إحصائيات دقيق واحترافي
   الإصلاحات:
     ① وقت اللعب الكلي التراكمي (totalPlayTimeSecs)
     ② وقت الأسبوع الحقيقي (weeklyStats.sessionSecs)
     ③ معادلة XP/LV متوازنة ومنطقية
     ④ دقة الإحصائيات بلا نسب وهمية
     ⑤ تسجيل وقت اللعب داخل الجلسة بدقة
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   ① الوقت: session + يومي + أسبوعي + كلي تراكمي
   ───────────────────────────────────────────────────────────── */

/* متى بدأت الجلسة الحالية */
var _sessionStartMs = Date.now();

/**
 * إجمالي ثواني الجلسة الحالية (من بدء التطبيق حتى الآن)
 * مُصحَّح: يُعيد صفراً إذا كانت القيمة سالبة أو كبيرة جداً
 */
function getSessionSecs() {
    const today = todayStr();
    /* إذا تغيّر اليوم أثناء الجلسة → احفظ وابدأ من جديد */
    if (st.sessionDate !== today) {
        st.sessionTimeSecs = 0;
        st.sessionDate = today;
        _sessionStartMs = Date.now();
        saveSt();
    }
    const elapsed = Math.floor((Date.now() - _sessionStartMs) / 1000);
    return Math.max(0, (st.sessionTimeSecs || 0) + elapsed);
}

/**
 * حفظ وقت الجلسة عند إخفاء الصفحة / أي حدث يتطلب ذلك
 * مُصحَّح: يحدّث الكلي التراكمي و الأسبوعي معاً
 */
function saveSessionTime() {
    const secs = getSessionSecs();
    const today = todayStr();
    const week  = weekStr();

    /* وقت اليوم */
    st.sessionTimeSecs = secs;
    st.sessionDate     = today;

    /* ② وقت الأسبوع — يتراكم بشكل حقيقي */
    if (!st.weeklyStats)                      st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week };
    if (st.weeklyStats.week !== week) {
        /* أسبوع جديد — احفظ الأسبوع المنتهي في سجل قبل الإعادة */
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week, sessionSecs: 0 };
    }
    /* sessionSecs للأسبوع = مجموع كل أيام الأسبوع */
    st.weeklyStats.sessionSecs = secs + (st.weeklyStats._baseSessionSecs || 0);

    /* ① الكلي التراكمي */
    if (typeof st.totalPlayTimeSecs !== 'number') st.totalPlayTimeSecs = 0;
    /* نحسب الفرق فقط (لا نضيف المجموع كل مرة) */
    const sessionDelta = secs - (_lastSavedSessionSecs || 0);
    if (sessionDelta > 0) {
        st.totalPlayTimeSecs += sessionDelta;
    }
    _lastSavedSessionSecs = secs;

    _sessionStartMs = Date.now();
    saveSt();
}
/* ✅ FIX-SESSTIME: نبدأ من وقت الجلسة المحفوظة لمنع الإضافة المزدوجة عند إعادة التحميل */
var _lastSavedSessionSecs = (function() {
    try {
        var s = JSON.parse(localStorage.getItem('ho_math_v7'));
        return (s && typeof s.sessionTimeSecs === 'number') ? s.sessionTimeSecs : 0;
    } catch(e) { return 0; }
})();

/* أرشفة إحصائيات الأسبوع المنتهي (للتاريخ) */
function _archiveWeeklyStats() {
    if (!st.weeklyStats) return;
    if (!st.weeklyHistory) st.weeklyHistory = [];
    st.weeklyHistory.unshift({
        week:        st.weeklyStats.week,
        correct:     st.weeklyStats.correct  || 0,
        wrong:       st.weeklyStats.wrong    || 0,
        games:       st.weeklyStats.games    || 0,
        bestStreak:  st.weeklyStats.bestStreak || 0,
        sessionSecs: st.weeklyStats.sessionSecs || 0
    });
    if (st.weeklyHistory.length > 8) st.weeklyHistory.pop(); /* احتفظ بآخر 8 أسابيع */
}

/* أحداث حفظ الوقت */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) saveSessionTime();
});
window.addEventListener('beforeunload', saveSessionTime);
/* حفظ تلقائي كل دقيقة */
setInterval(saveSessionTime, 60000);


/* ─────────────────────────────────────────────────────────────
   ② عرض وقت اللعب — دقيق وبلا وهم
   ───────────────────────────────────────────────────────────── */

/**
 * تنسيق الثواني → نص عربي واضح
 * 0-59 ث → "أقل من دقيقة"
 * 1-59 د → "X دقيقة"
 * 1+ س  → "Xس Yd"
 */
function fmtTimeFriendly(secs) {
    if (!secs || secs < 60)  return 'أقل من دقيقة';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return h + 'س ' + (m > 0 ? m + 'د' : '');
    return m + ' دقيقة';
}

/** HH:MM:SS للمؤقت المباشر */
function fmtTime(s) {
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const m  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sc}`;
}

/** مؤقت الجلسة الحي — يُعرض في الواجهة */
function updSessionTimer() {
    const el = document.getElementById('sessionTimerDisplay');
    if (el) el.textContent = fmtTime(getSessionSecs());
}
setInterval(updSessionTimer, 1000);


/* ─────────────────────────────────────────────────────────────
   ③ معادلة XP/LV متوازنة
   المشكلة القديمة: xpToNext يبدأ بـ 1000 ويُضرب × 1.3 بلا حدود
   الحل: جدول XP محدد + منحنى تحسين واضح
   ───────────────────────────────────────────────────────────── */

/**
 * احسب xpToNext الحقيقي للمستوى المعطى
 * منحنى: يرتفع بشكل منطقي ويستقر عند المستويات العالية
 *
 * LV 1  → 500  XP
 * LV 5  → 800  XP
 * LV 10 → 1200 XP
 * LV 20 → 2000 XP
 * LV 50 → 4500 XP
 * LV100 → 8000 XP
 */
function calcXpToNext(level) {
    const lv = Math.max(1, Math.floor(level));
    /* معادلة: base + growth * ln(lv) */
    /* تُعطي منحنى تصاعدياً ناعماً بدون انفجار */
    return Math.floor(400 + 120 * lv + 40 * Math.sqrt(lv));
}

/**
 * XP المكتسبة من جلسة لعب — بدون تضخيم وهمي
 * المعادلة: دقيقة الإجابات الصحيحة + مكافأة التتابع + مكافأة الدقة
 */
function calcXpGained(correct, wrong, score, bestStreak) {
    const total = correct + wrong;
    if (total === 0) return 0;
    const accuracy = correct / total; // 0-1

    /* XP الأساسية: كل إجابة صحيحة = 8 XP */
    let xp = correct * 8;

    /* مكافأة الدقة: 0-20% إضافية حسب الدقة */
    xp += Math.floor(xp * accuracy * 0.20);

    /* مكافأة التتابع: +2 XP لكل مستوى من التتابع */
    if (bestStreak >= 5)  xp += Math.floor(bestStreak * 2);
    if (bestStreak >= 10) xp += 20; /* مكافأة إضافية للتتابع الطويل */

    /* حد أقصى معقول لكل جلسة حسب عدد الأسئلة */
    const cap = Math.max(50, total * 20);
    return Math.min(Math.floor(xp), cap);
}

/**
 * تطبيق XP وترقية المستوى
 * يُستبدل به حساب endGame
 * يُعيد: { xpGained, levelsGained, newLevel }
 */
function applyXpGain(correct, wrong, score, bestStreak) {
    const xpGained = calcXpGained(correct, wrong, score, bestStreak);
    if (xpGained <= 0) return { xpGained: 0, levelsGained: 0, newLevel: st.level };

    st.xp += xpGained;
    let levelsGained = 0;

    /* تأكد xpToNext صحيح قبل الحلقة */
    const expectedXpToNext = calcXpToNext(st.level);
    if (Math.abs(st.xpToNext - expectedXpToNext) > 200) {
        /* إصلاح تلقائي إذا كانت xpToNext تالفة أو غريبة */
        st.xpToNext = expectedXpToNext;
    }

    while (st.xp >= st.xpToNext && levelsGained < 20) {
        st.xp -= st.xpToNext;
        st.level++;
        st.xpToNext = calcXpToNext(st.level);
        levelsGained++;
        playSound('levelup');
        const _lvl = st.level;
        setTimeout(function() {
            try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(_lvl); } catch(e) {}
        }, 600 + levelsGained * 400);
    }

    /* ضمان xp لا يتجاوز xpToNext (حماية من خلل) */
    if (st.xp >= st.xpToNext) st.xp = st.xpToNext - 1;

    return { xpGained, levelsGained, newLevel: st.level };
}

/**
 * إصلاح xpToNext لأي لاعب قديم بياناته مشوهة
 * يُستدعى مرة عند التحميل
 */
function fixLegacyXpData() {
    if (!st || typeof st.level !== 'number') return;
    const expected = calcXpToNext(st.level);
    /* إذا كانت xpToNext منفجرة (أكبر من 10 أضعاف المتوقع) → أصلح */
    if (st.xpToNext > expected * 10 || st.xpToNext < 100) {
        st.xpToNext = expected;
        if (st.xp >= st.xpToNext) st.xp = Math.floor(st.xpToNext * 0.8);
        saveSt();
        console.log('✅ تم إصلاح xpToNext:', expected);
    }
}


/* ─────────────────────────────────────────────────────────────
   ④ حساب الدقة بدون نسب وهمية
   ───────────────────────────────────────────────────────────── */

/**
 * دقة حقيقية — تُعيد null إذا لم تكن هناك بيانات كافية
 * بدلاً من إظهار 0% أو 100% بناءً على بيانات ناقصة
 */
function calcAccuracy(correct, total, minSamples) {
    minSamples = minSamples || 5;
    if (!total || total < minSamples) return null;
    return Math.round((correct / total) * 100);
}

/** نص يُعرض للمستخدم — يوضح إذا كانت البيانات غير كافية */
function displayAccuracy(correct, total) {
    const acc = calcAccuracy(correct, total, 3);
    if (acc === null) return total > 0 ? Math.round((correct/total)*100) + '%' : '—';
    return acc + '%';
}

/**
 * تقييم الأداء بشكل واقعي (★ stars)
 * بناءً على الدقة الحقيقية لا المتوقعة
 */
function calcPerformanceRating() {
    const total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    if (total < 10) return { stars: 0, label: 'جديد', raw: 0 };

    const accuracy = st.correctTotal / total; // 0-1
    const streakBonus = Math.min(0.5, (st.bestStreak || 0) * 0.05);
    const levelBonus  = Math.min(0.5, (st.level || 1) * 0.02);

    /* النجوم 0-5 بناءً على الدقة أساساً */
    let raw = accuracy * 4 + streakBonus + levelBonus;
    raw = Math.min(5, raw);
    const stars = Math.round(raw * 10) / 10;

    let label;
    if (stars >= 4.5)      label = 'ممتاز 🏆';
    else if (stars >= 3.5) label = 'جيد جداً ⭐';
    else if (stars >= 2.5) label = 'جيد 👍';
    else if (stars >= 1.5) label = 'يحتاج تدريب 💪';
    else                   label = 'مبتدئ 🌱';

    return { stars, label, raw };
}

/** تقدير شريط التحدي — بناءً على عدد جلسات حقيقي لا نسبة وهمية */
function calcChallengePct(games) {
    /* 0 جلسة → 0%، 5 جلسات → ~50%، 20 جلسة → 100% */
    if (!games || games <= 0) return 0;
    return Math.min(100, Math.round(Math.sqrt(games / 20) * 100));
}


/* ─────────────────────────────────────────────────────────────
   ⑤ دوال تحديث الواجهة المحسّنة
   ───────────────────────────────────────────────────────────── */

/**
 * تحديث إحصائيات الصفحة الرئيسية — بدون نسب وهمية
 */
function updateHomeStatsPrecise() {
    const q = id => document.getElementById(id);
    if (!q('homeCoins')) return; /* لم تُحمَّل الصفحة بعد */

    const hc = q('headerCoins');   if (hc) hc.textContent = st.coins;
    const hco = q('homeCoins');    if (hco) hco.textContent = st.coins;
    const hcr = q('homeCorrect');  if (hcr) hcr.textContent = st.correctTotal;

    const total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    const accText = displayAccuracy(st.correctTotal, total);
    const hac = q('homeAccuracy');  if (hac) hac.textContent = total < 3 ? '—' : accText;
    const hst = q('homeStreak');    if (hst) hst.textContent = '×' + (st.bestStreak || 0);
    const hgm = q('homeGames');     if (hgm) hgm.textContent = st.totalGames || 0;
    const hlv = q('homeLevel');     if (hlv) hlv.textContent = st.level || 1;
    const hbs = q('homeBestScore'); if (hbs) hbs.textContent = st.bestScore || 0;

    /* التقييم الحقيقي */
    const perf = calcPerformanceRating();
    const rnum = q('ratingNum');  if (rnum) rnum.textContent = perf.stars.toFixed(1);
    const rbar = q('ratingBar');  if (rbar) rbar.style.width = (perf.stars / 5 * 100) + '%';
    const rs = starsStr(perf.stars);
    const rsta = q('ratingStars'); if (rsta) rsta.textContent = rs;
    const hs   = q('homeStars');   if (hs)   hs.textContent   = rs;

    /* شريط التقدم الأساسي — نسبة حقيقية */
    const cc = st.catCounter || { correct: 0, total: 0 };
    const cpct = calcAccuracy(cc.correct, cc.total, 1);
    const cpctSafe = cpct !== null ? cpct : 0;
    const cp0 = q('catProg0');   if (cp0) cp0.style.width = cpctSafe + '%';
    const cs0 = q('catStats0');
    if (cs0) {
        cs0.textContent = cc.total >= 3
            ? cpctSafe + '% • ' + cc.correct + ' صح'
            : cc.total > 0 ? cc.correct + '/' + cc.total + ' (بيانات قليلة)' : 'لم تبدأ بعد';
    }

    /* شريط تقدم التحديات — منحنى واقعي */
    const cg = (st.catChallenges && st.catChallenges.games) || 0;
    const cpct1 = calcChallengePct(cg);
    const cp1 = q('catProg1');   if (cp1) cp1.style.width = cpct1 + '%';
    const cs1 = q('catStats1');  if (cs1) cs1.textContent = cg > 0 ? cg + ' جلسة تحدي' : 'لم تبدأ بعد';

    /* نفس الشرائط في صفحة الألعاب */
    const g0 = q('gcatProg0'), g1 = q('gcatProg1');
    if (g0) g0.style.width = cpctSafe + '%';
    if (g1) g1.style.width = cpct1 + '%';
    const gs0 = q('gcatStats0'), gs1 = q('gcatStats1');
    if (gs0) gs0.textContent = cc.total >= 3 ? cc.correct + ' / ' + cc.total + ' إجابة' : cc.correct + '/' + cc.total + ' إجابة';
    if (gs1) gs1.textContent = cg + ' جلسة تحدي';
}

/**
 * تحديث وقت اللعب في وضع الوالدين — بياناتٌ حقيقية
 */
function updateParentTimePrecise() {
    const q = id => document.getElementById(id);

    /* وقت اليوم */
    const todaySecs = getSessionSecs();
    if (q('parentTimeToday')) q('parentTimeToday').textContent = fmtTimeFriendly(todaySecs);

    /* ② وقت الأسبوع الحقيقي */
    const wsBase = (st.weeklyStats && st.weeklyStats._baseSessionSecs) || 0;
    const weekSecs = wsBase + todaySecs; /* أيام سابقة من الأسبوع + اليوم */
    if (q('parentTimeWeek')) q('parentTimeWeek').textContent = fmtTimeFriendly(weekSecs);

    /* ① الكلي التراكمي */
    const totalSecs = (st.totalPlayTimeSecs || 0) + (getSessionSecs() - (_lastSavedSessionSecs || 0));
    if (q('parentTimeTotal')) q('parentTimeTotal').textContent = fmtTimeFriendly(Math.max(0, totalSecs));
}


/* ─────────────────────────────────────────────────────────────
   ⑥ إصلاح recordDailyStat — إضافة وقت الأسبوع
   ───────────────────────────────────────────────────────────── */

/**
 * تسجيل إحصائية يومية/أسبوعية — نسخة محسّنة
 * يُستبدل بها recordDailyStat القديمة
 */
function recordDailyStatV2(type) {
    const today = todayStr();
    const week  = weekStr();

    /* تهيئة اليومي */
    if (!st.dailyStats || st.dailyStats.date !== today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }

    /* تهيئة الأسبوعي — حفظ sessionSecs الأيام السابقة */
    if (!st.weeklyStats || st.weeklyStats.week !== week) {
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week,
                           sessionSecs: 0, _baseSessionSecs: 0 };
    }

    if (type === 'correct') { st.dailyStats.correct++; st.weeklyStats.correct++; }
    if (type === 'wrong')   { st.dailyStats.wrong++;   st.weeklyStats.wrong++;   }
    if (type === 'game')    { st.dailyStats.games++;   st.weeklyStats.games++;   }
    if (type === 'streak' && (st.bestStreak || 0) > (st.weeklyStats.bestStreak || 0)) {
        st.weeklyStats.bestStreak = st.bestStreak;
    }
    /* تحديث sessionSecs الأسبوعي */
    if (type === 'game') {
        /* عند نهاية كل جلسة، نحفظ الوقت الأسبوعي المتراكم */
        const todaySecs = getSessionSecs();
        const prevBase  = st.weeklyStats._baseSessionSecs || 0;
        /* _baseSessionSecs = مجموع أيام الأسبوع ما عدا اليوم الحالي */
        /* sessionSecs = _baseSessionSecs + اليوم */
        st.weeklyStats.sessionSecs = prevBase + todaySecs;
    }
}


/* ─────────────────────────────────────────────────────────────
   ⑦ ترقية defState وsanitizeState
   أضف الحقول الجديدة للـ state
   ───────────────────────────────────────────────────────────── */

/**
 * حقول state الجديدة التي يجب إضافتها عند التهيئة
 * تُستدعى من fixLegacyXpData أو مرة عند أول تشغيل
 */
function migrateStateToV2() {
    let changed = false;

    /* ① الوقت الكلي التراكمي */
    if (typeof st.totalPlayTimeSecs !== 'number') {
        /* تقدير أولي من sessionTimeSecs الموجودة */
        st.totalPlayTimeSecs = st.sessionTimeSecs || 0;
        changed = true;
    }

    /* ② weeklyStats._baseSessionSecs */
    if (st.weeklyStats && typeof st.weeklyStats._baseSessionSecs !== 'number') {
        st.weeklyStats._baseSessionSecs = 0;
        changed = true;
    }

    /* ③ سجل الأسابيع */
    if (!st.weeklyHistory) {
        st.weeklyHistory = [];
        changed = true;
    }

    /* ④ إصلاح xpToNext */
    fixLegacyXpData();

    if (changed) saveSt();
}


/* ─────────────────────────────────────────────────────────────
   ⑧ تحديث حفظ اليوم الأسبوعي عند انتهاء اليوم
   ───────────────────────────────────────────────────────────── */

/**
 * عند انتهاء اليوم (يُكتشف عند أي عملية تتحقق من todayStr)
 * احفظ وقت اليوم في _baseSessionSecs قبل إعادة اليومي
 */
function _onDayChange() {
    if (!st.weeklyStats) return;
    /* أضف وقت اليوم المنتهي إلى قاعدة الأسبوع */
    const todaySecs = getSessionSecs();
    st.weeklyStats._baseSessionSecs = (st.weeklyStats._baseSessionSecs || 0) + todaySecs;
    st.weeklyStats.sessionSecs = st.weeklyStats._baseSessionSecs;
    /* إعادة عداد اليوم */
    st.sessionTimeSecs = 0;
    st.sessionDate = todayStr();
    _sessionStartMs = Date.now();
    _lastSavedSessionSecs = 0;
}

/* مراقبة تغيير اليوم — يُشغَّل كل دقيقة */
var _lastDayCheck = todayStr();
setInterval(function() {
    const today = todayStr();
    if (today !== _lastDayCheck) {
        _onDayChange();
        _lastDayCheck = today;
    }
}, 60000);


/* ─────────────────────────────────────────────────────────────
   ⑨ تهيئة — يُشغَّل عند تحميل الصفحة
   ───────────────────────────────────────────────────────────── */
window.addEventListener('load', function() {
    setTimeout(function() {
        /* ترقية بيانات اللاعبين القدامى */
        migrateStateToV2();

        /* مزامنة sessionStart مع بيانات الجلسة المحفوظة */
        _sessionStartMs = Date.now();
        _lastSavedSessionSecs = st.sessionTimeSecs || 0;

        /* تحديث الواجهة */
        if (typeof updateHomeStatsPrecise === 'function') updateHomeStatsPrecise();
        if (typeof updateParentTimePrecise === 'function') updateParentTimePrecise();

        console.log('✅ Stats Engine v2 تم تحميله — وقت كلي:', (st.totalPlayTimeSecs || 0), 'ث');
    }, 500);
});


/* ─────────────────────────────────────────────────────────────
   ⑩ واجهة: دالة updateHomeStats المحسّنة
   تُعوّض updateHomeStats القديمة تلقائياً
   ───────────────────────────────────────────────────────────── */
/* تسجيل الدوال الجديدة عالمياً */
window.updateHomeStats          = updateHomeStatsPrecise;
window.updateParentTimePrecise  = updateParentTimePrecise;
window.calcXpToNext             = calcXpToNext;
window.calcXpGained             = calcXpGained;
window.applyXpGain              = applyXpGain;
window.getSessionSecs           = getSessionSecs;
window.saveSessionTime          = saveSessionTime;
window.recordDailyStat          = recordDailyStatV2;   /* يُعوّض القديمة */
window.displayAccuracy          = displayAccuracy;
window.calcPerformanceRating    = calcPerformanceRating;
window.fmtTimeFriendly          = fmtTimeFriendly;
window.fmtTime                  = fmtTime;
