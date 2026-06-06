/* ═══════════════════════════════════════════════════════════════
   HO Math — Utils & Stats Engine
   © 2026 Hassan Odaey

   يجمع:
     ① التاريخ والوقت الآمن (todayStr, weekStr, fmtTime)
     ② نظام XP/LV (calcXpToNext, applyXpGain, refreshLevelDisplay)
     ③ محرك الإحصائيات v2 (session, weekly, daily)
     ④ حماية التواريخ والبيانات
     ⑤ احتفال ارتقاء المستوى (showLevelUpCelebration)
═══════════════════════════════════════════════════════════════ */

(function() {
'use strict';

/* ══════════════════════════════════════════════════════════════
   ① التاريخ والوقت — نسخ آمنة محمية من التلاعب
   ══════════════════════════════════════════════════════════════ */

window.todayStr = function todayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const result = `${y}-${m}-${d}`;
    if (y < 2020) {
        console.warn('[HO Math] تاريخ النظام غير صحيح:', result);
        try {
            const saved = localStorage.getItem('ho_math_last_valid_date');
            if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
        } catch(e) {}
        return '2026-01-01';
    }
    try { localStorage.setItem('ho_math_last_valid_date', result); } catch(e) {}
    return result;
};

window.weekStr = function weekStr() {
    const d    = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

/* ══════════════════════════════════════════════════════════════
   ② تنسيق الوقت
   ══════════════════════════════════════════════════════════════ */

window.fmtTimeFriendly = function fmtTimeFriendly(secs) {
    if (!secs || secs < 1)   return 'لم يبدأ بعد';
    if (secs < 60)           return 'أقل من دقيقة';
    const h    = Math.floor(secs / 3600);
    const m    = Math.floor((secs % 3600) / 60);
    const days = Math.floor(h / 24);
    if (days >= 1) {
        const rh = h % 24;
        return days + (days === 1 ? ' يوم' : ' أيام') + (rh > 0 ? ' ' + rh + 'س' : '');
    }
    if (h > 0) return h + 'س' + (m > 0 ? ' ' + m + 'د' : '');
    return m + ' دقيقة';
};

window.fmtTime = function fmtTime(s) {
    s = Math.max(0, Math.floor(s));
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const mn = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    return `${h}:${mn}:${sc}`;
};

/* ══════════════════════════════════════════════════════════════
   ③ وقت الجلسة — Session Timer
   ══════════════════════════════════════════════════════════════ */

var _sessionStartMs = Date.now();
var _lastSavedSessionSecs = (function() {
    try {
        var s = JSON.parse(localStorage.getItem('ho_math_v7'));
        return (s && typeof s.sessionTimeSecs === 'number') ? s.sessionTimeSecs : 0;
    } catch(e) { return 0; }
})();

window.getSessionSecs = function getSessionSecs() {
    const today = window.todayStr();
    if (st.sessionDate !== today) {
        st.sessionTimeSecs = 0;
        st.sessionDate = today;
        _sessionStartMs = Date.now();
        saveSt();
    }
    const elapsed = Math.floor((Date.now() - _sessionStartMs) / 1000);
    return Math.max(0, (st.sessionTimeSecs || 0) + elapsed);
};

window.saveSessionTime = function saveSessionTime() {
    const secs  = window.getSessionSecs();
    const today = window.todayStr();
    const week  = window.weekStr();

    st.sessionTimeSecs = secs;
    st.sessionDate     = today;

    if (!st.weeklyStats) st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week };
    if (st.weeklyStats.week !== week) {
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week, sessionSecs: 0, _baseSessionSecs: 0 };
    }
    st.weeklyStats.sessionSecs = secs + (st.weeklyStats._baseSessionSecs || 0);

    if (typeof st.totalPlayTimeSecs !== 'number') st.totalPlayTimeSecs = 0;
    const sessionDelta = secs - (_lastSavedSessionSecs || 0);
    if (sessionDelta > 0) st.totalPlayTimeSecs += sessionDelta;
    _lastSavedSessionSecs = secs;
    _sessionStartMs = Date.now();
    saveSt();
};

function _archiveWeeklyStats() {
    if (!st.weeklyStats) return;
    if (!st.weeklyHistory) st.weeklyHistory = [];
    st.weeklyHistory.unshift({
        week:        st.weeklyStats.week,
        correct:     st.weeklyStats.correct    || 0,
        wrong:       st.weeklyStats.wrong      || 0,
        games:       st.weeklyStats.games      || 0,
        bestStreak:  st.weeklyStats.bestStreak || 0,
        sessionSecs: st.weeklyStats.sessionSecs || 0
    });
    if (st.weeklyHistory.length > 8) st.weeklyHistory.pop();
}

/* مراقبة انتهاء اليوم */
var _lastDayCheck = window.todayStr();
setInterval(function() {
    const today = window.todayStr();
    if (today !== _lastDayCheck) {
        if (st.weeklyStats) {
            const todaySecs = window.getSessionSecs();
            st.weeklyStats._baseSessionSecs = (st.weeklyStats._baseSessionSecs || 0) + todaySecs;
            st.weeklyStats.sessionSecs = st.weeklyStats._baseSessionSecs;
        }
        st.sessionTimeSecs = 0;
        st.sessionDate = today;
        _sessionStartMs = Date.now();
        _lastSavedSessionSecs = 0;
        _lastDayCheck = today;
    }
}, 60000);

/* حفظ تلقائي للوقت */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) window.saveSessionTime();
});
window.addEventListener('beforeunload', window.saveSessionTime);
setInterval(window.saveSessionTime, 60000);

/* مؤقت الجلسة الحي */
var _sessionTimerInterval = null;
function _startSessionTimerDisplay() {
    if (_sessionTimerInterval) clearInterval(_sessionTimerInterval);
    _sessionTimerInterval = setInterval(function() {
        if (document.hidden) return;
        const el = document.getElementById('sessionTimerDisplay');
        if (el) el.textContent = window.fmtTime(window.getSessionSecs());
    }, 1000);
}
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) _startSessionTimerDisplay();
});

/* ══════════════════════════════════════════════════════════════
   ④ نظام XP/LV
   ══════════════════════════════════════════════════════════════ */

window.calcXpToNext = function calcXpToNext(level) {
    const lv = Math.max(1, Math.floor(level));
    return Math.floor(400 + 120 * lv + 40 * Math.sqrt(lv));
};

window.getXpPercent = function getXpPercent() {
    if (typeof st === 'undefined') return 0;
    const toNext = st.xpToNext || window.calcXpToNext(st.level || 1);
    if (toNext <= 0) return 99;
    return Math.min(99, Math.max(0, Math.round((st.xp / toNext) * 100)));
};

function calcXpGained(correct, wrong, score, bestStreak) {
    const total = correct + wrong;
    if (total === 0) return 0;
    const accuracy = correct / total;
    let xp = correct * 8;
    xp += Math.floor(xp * accuracy * 0.20);
    if (bestStreak >= 5)  xp += Math.floor(bestStreak * 2);
    if (bestStreak >= 10) xp += 20;
    const cap = Math.max(50, total * 20);
    return Math.min(Math.floor(xp), cap);
}

window.applyXpGain = function applyXpGain(correct, wrong, score, bestStreak) {
    let xpGained = calcXpGained(correct, wrong, score, bestStreak);
    if (xpGained <= 0) return { xpGained: 0, levelsGained: 0, newLevel: st.level };

    const xpMult = (typeof getXpMultiplier === 'function') ? getXpMultiplier() : 1;
    if (xpMult > 1) {
        const bonus = Math.floor(xpGained * (xpMult - 1));
        xpGained += bonus;
        if (bonus > 0) setTimeout(function() {
            try { showFeedback('⚡ مضاعف XP ×' + xpMult + '! +' + bonus + ' XP إضافية'); } catch(e) {}
        }, 400);
    }

    st.xp = Math.max(0, (st.xp || 0) + xpGained);

    const expectedXpToNext = window.calcXpToNext(st.level);
    if (!st.xpToNext || Math.abs(st.xpToNext - expectedXpToNext) > expectedXpToNext * 0.5) {
        st.xpToNext = expectedXpToNext;
    }

    let levelsGained = 0;
    const levelsToShow = [];
    while (st.xp >= st.xpToNext && levelsGained < 30) {
        st.xp      -= st.xpToNext;
        st.level    = Math.max(1, (st.level || 1) + 1);
        st.xpToNext = window.calcXpToNext(st.level);
        levelsGained++;
        levelsToShow.push(st.level);
        try { playSound('levelup'); } catch(e) {}
    }

    if (st.xp >= st.xpToNext) st.xp = st.xpToNext - 1;
    if (st.xp < 0) st.xp = 0;

    levelsToShow.forEach(function(lv, i) {
        setTimeout(function() {
            try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(lv); } catch(e) {}
        }, 600 + i * 700);
    });

    setTimeout(window.refreshLevelDisplay, 50);
    return { xpGained, levelsGained, newLevel: st.level };
};

/* مساعد داخلي */
function _setEl(id, text, styles) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text !== null && text !== undefined) el.textContent = text;
    if (styles) Object.assign(el.style, styles);
}

function _getTitle(lv) {
    if (lv <  3) return 'مبتدئ';
    if (lv <  6) return 'متعلم';
    if (lv < 10) return 'رياضي بارع';
    if (lv < 15) return 'خبير أرقام';
    if (lv < 25) return 'عالم رياضيات';
    if (lv < 40) return 'أستاذ رياضيات';
    if (lv < 60) return 'عبقري رياضيات';
    return 'أسطورة الرياضيات';
}

function _getAgeStr() {
    if (typeof st === 'undefined') return '';
    const age = st.age || 0;
    return age > 0 ? 'العمر: ' + age + ' سنة' : 'العمر غير محدد';
}

window.refreshLevelDisplay = function refreshLevelDisplay() {
    if (typeof st === 'undefined') return;
    const lv     = Math.max(1, st.level || 1);
    const xp     = Math.max(0, st.xp || 0);
    const xpNext = st.xpToNext || window.calcXpToNext(lv);
    const pct    = window.getXpPercent();
    const lvText   = 'Lv.' + lv;
    const lvTextAr = 'المستوى ' + lv;

    _setEl('headerSub',        lvText + ' • ' + _getTitle(lv));
    _setEl('headerXpBar',      null, { width: pct + '%' });
    _setEl('headerXp',         '⚡ ' + xp.toLocaleString('ar') + ' XP');
    _setEl('homePlayerLevel',  lvText + ' • ' + _getTitle(lv));
    _setEl('homeXpBarFill',    null, { width: pct + '%' });
    _setEl('homeXpText',       '⚡ ' + xp.toLocaleString('ar') + ' XP');
    _setEl('homeXpNext',       xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar'));
    _setEl('homeLevel',        String(lv));
    _setEl('profileLevel',     lvTextAr + ' • ' + _getTitle(lv));
    _setEl('profileXpFill',    null, { width: pct + '%' });
    _setEl('profileXpLabel',   xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar') + ' XP للمستوى التالي');
    _setEl('spProfileLevel',   lvTextAr + ' • ' + _getTitle(lv));
    _setEl('spProfileXpFill',  null, { width: pct + '%' });
    _setEl('spProfileXpLabel', xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar') + ' XP للمستوى التالي');
    _setEl('parentAgeLevel',   lvTextAr + ' • ' + _getAgeStr());
};

/* ══════════════════════════════════════════════════════════════
   ⑤ محرك الإحصائيات
   ══════════════════════════════════════════════════════════════ */

function calcAccuracy(correct, total, minSamples) {
    minSamples = minSamples || 5;
    if (!total || total < minSamples) return null;
    return Math.round((correct / total) * 100);
}

window.displayAccuracy = function displayAccuracy(correct, total) {
    const acc = calcAccuracy(correct, total, 3);
    if (acc === null) return total > 0 ? Math.round((correct/total)*100) + '%' : '—';
    return acc + '%';
};

window.calcPerformanceRating = function calcPerformanceRating() {
    const total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    if (total < 10) return { stars: 0, label: 'جديد', raw: 0 };
    const accuracy    = st.correctTotal / total;
    const streakBonus = Math.min(0.5, (st.bestStreak || 0) * 0.05);
    const levelBonus  = Math.min(0.5, (st.level || 1) * 0.02);
    let raw = Math.min(5, accuracy * 4 + streakBonus + levelBonus);
    const stars = Math.round(raw * 10) / 10;
    let label;
    if (stars >= 4.5)      label = 'ممتاز 🏆';
    else if (stars >= 3.5) label = 'جيد جداً ⭐';
    else if (stars >= 2.5) label = 'جيد 👍';
    else if (stars >= 1.5) label = 'يحتاج تدريب 💪';
    else                   label = 'مبتدئ 🌱';
    return { stars, label, raw };
};

function calcChallengePct(games) {
    if (!games || games <= 0) return 0;
    return Math.min(100, Math.round(Math.sqrt(games / 20) * 100));
}

/* recordDailyStat — النسخة المحسّنة */
window.recordDailyStatV2 = function recordDailyStatV2(type) {
    const today = window.todayStr();
    const week  = window.weekStr();
    if (!st.dailyStats || st.dailyStats.date !== today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }
    if (!st.weeklyStats || st.weeklyStats.week !== week) {
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week, sessionSecs: 0, _baseSessionSecs: 0 };
    }
    if (type === 'correct') { st.dailyStats.correct++; st.weeklyStats.correct++; }
    if (type === 'wrong')   { st.dailyStats.wrong++;   st.weeklyStats.wrong++;   }
    if (type === 'game')    { st.dailyStats.games++;   st.weeklyStats.games++;
        const todaySecs = window.getSessionSecs();
        const prevBase  = st.weeklyStats._baseSessionSecs || 0;
        st.weeklyStats.sessionSecs = prevBase + todaySecs;
    }
    if (type === 'streak' && (st.bestStreak || 0) > (st.weeklyStats.bestStreak || 0)) {
        st.weeklyStats.bestStreak = st.bestStreak;
    }
};
window.recordDailyStat = window.recordDailyStatV2;

/* ══════════════════════════════════════════════════════════════
   ⑥ تحديث الواجهة — Home Stats
   ══════════════════════════════════════════════════════════════ */

function updateHomeStatsPrecise() {
    const q = id => document.getElementById(id);
    if (!q('homeCoins')) return;
    const hc  = q('headerCoins');  if (hc)  hc.textContent  = st.coins;
    const hco = q('homeCoins');    if (hco) hco.textContent  = st.coins;
    const hcr = q('homeCorrect');  if (hcr) hcr.textContent  = st.correctTotal;
    const total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    const accText = window.displayAccuracy(st.correctTotal, total);
    const hac = q('homeAccuracy'); if (hac) hac.textContent  = total < 3 ? '—' : accText;
    const hst = q('homeStreak');   if (hst) hst.textContent  = '×' + (st.bestStreak || 0);
    const hgm = q('homeGames');    if (hgm) hgm.textContent  = st.totalGames || 0;
    const hlv = q('homeLevel');    if (hlv) hlv.textContent  = st.level || 1;
    const hbs = q('homeBestScore');if (hbs) hbs.textContent  = st.bestScore || 0;
    const perf = window.calcPerformanceRating();
    const rnum = q('ratingNum');   if (rnum) rnum.textContent = perf.stars.toFixed(1);
    const rbar = q('ratingBar');   if (rbar) rbar.style.width = (perf.stars / 5 * 100) + '%';
    const rs   = (typeof starsStr === 'function') ? starsStr(perf.stars) : '';
    const rsta = q('ratingStars'); if (rsta) rsta.textContent = rs;
    const hs   = q('homeStars');   if (hs)   hs.textContent   = rs;
    const cc     = st.catCounter || { correct: 0, total: 0 };
    const cpct   = calcAccuracy(cc.correct, cc.total, 1);
    const cpctSafe = cpct !== null ? cpct : 0;
    const cp0  = q('catProg0');  if (cp0) cp0.style.width = cpctSafe + '%';
    const cs0  = q('catStats0');
    if (cs0) cs0.textContent = cc.total >= 3 ? cpctSafe + '% • ' + cc.correct + ' صح'
        : cc.total > 0 ? cc.correct + '/' + cc.total + ' (بيانات قليلة)' : 'لم تبدأ بعد';
    const cg   = (st.catChallenges && st.catChallenges.games) || 0;
    const cpct1 = calcChallengePct(cg);
    const cp1  = q('catProg1');  if (cp1) cp1.style.width = cpct1 + '%';
    const cs1  = q('catStats1'); if (cs1) cs1.textContent = cg > 0 ? cg + ' جلسة تحدي' : 'لم تبدأ بعد';
    const g0 = q('gcatProg0'), g1 = q('gcatProg1');
    if (g0) g0.style.width = cpctSafe + '%';
    if (g1) g1.style.width = cpct1 + '%';
    const gs0 = q('gcatStats0'), gs1 = q('gcatStats1');
    if (gs0) gs0.textContent = cc.total >= 3 ? cc.correct + ' / ' + cc.total + ' إجابة' : cc.correct + '/' + cc.total + ' إجابة';
    if (gs1) gs1.textContent = cg + ' جلسة تحدي';
}

function updateParentTimePrecise() {
    const q = id => document.getElementById(id);
    const todaySecs = window.getSessionSecs();
    const wsBase    = (st.weeklyStats && st.weeklyStats._baseSessionSecs) || 0;
    const weekSecs  = wsBase + todaySecs;
    const totalSecs = Math.max(0, (st.totalPlayTimeSecs || 0) + todaySecs);
    const fmt = window.fmtTimeFriendly;
    if (q('parentTimeToday')) q('parentTimeToday').textContent = fmt(todaySecs);
    if (q('parentTimeWeek'))  q('parentTimeWeek').textContent  = fmt(weekSecs);
    if (q('parentTimeTotal')) q('parentTimeTotal').textContent = fmt(totalSecs);
}

setInterval(function() {
    updateParentTimePrecise();
    _setEl('sessionTimerDisplay', window.fmtTime(window.getSessionSecs()));
}, 5000);

/* ══════════════════════════════════════════════════════════════
   ⑦ حماية التواريخ
   ══════════════════════════════════════════════════════════════ */

window.validateDailyDates = function validateDailyDates() {
    if (typeof st === 'undefined') return;
    const today = window.todayStr();
    ['dailyDate', 'loginBonusDate', '_lastLoginBonus', 'lastDailyDate'].forEach(function(key) {
        if (st[key] && st[key] > today) {
            console.warn('[HO Math] تاريخ مستقبلي في', key, ':', st[key], '→', today);
            st[key] = today;
        }
    });
    if (st.dailyBox && st.dailyBox.date && st.dailyBox.date > today) {
        st.dailyBox = { opened: false, date: '', reward: 0 };
    }
    if (st.dailyStats && st.dailyStats.date && st.dailyStats.date > today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }
    try { if (typeof saveSt === 'function') saveSt(); } catch(e) {}
};

/* ══════════════════════════════════════════════════════════════
   ⑧ ترقية بيانات اللاعبين القدامى
   ══════════════════════════════════════════════════════════════ */

function fixLegacyXpData() {
    if (!st || typeof st.level !== 'number') return;
    const expected = window.calcXpToNext(st.level);
    if (st.xpToNext > expected * 10 || st.xpToNext < 100) {
        st.xpToNext = expected;
        if (st.xp >= st.xpToNext) st.xp = Math.floor(st.xpToNext * 0.8);
        saveSt();
    }
}

function migrateStateToV2() {
    let changed = false;
    if (typeof st.totalPlayTimeSecs !== 'number') { st.totalPlayTimeSecs = st.sessionTimeSecs || 0; changed = true; }
    if (st.weeklyStats && typeof st.weeklyStats._baseSessionSecs !== 'number') { st.weeklyStats._baseSessionSecs = 0; changed = true; }
    if (!st.weeklyHistory) { st.weeklyHistory = []; changed = true; }
    fixLegacyXpData();
    if (changed) saveSt();
}

/* ══════════════════════════════════════════════════════════════
   ⑨ showLevelUpCelebration
   ══════════════════════════════════════════════════════════════ */

window.showLevelUpCelebration = function showLevelUpCelebration(newLevel) {
    if (document.querySelector('[data-levelup="' + newLevel + '"]')) return;
    const overlay = document.createElement('div');
    overlay.setAttribute('data-levelup', String(newLevel));
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);animation:lvFadeIn 0.3s ease forwards';
    const title  = _getTitle(newLevel);
    const nextXp = window.calcXpToNext(newLevel);
    const card   = document.createElement('div');
    card.style.cssText = 'background:var(--surface,#1a1a2e);border:2.5px solid var(--gold,#f0b90b);border-radius:28px;padding:36px 40px;text-align:center;max-width:320px;width:88%;animation:lvCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
    card.innerHTML = [
        '<div style="font-size:3.2em;margin-bottom:4px;">🎉</div>',
        '<div style="font-size:0.9em;color:var(--text2,#aaa);font-weight:700;margin-bottom:4px;">ارتقيت إلى</div>',
        '<div style="font-size:3em;font-weight:900;color:var(--gold,#f0b90b);line-height:1;">Lv.' + newLevel + '</div>',
        '<div style="margin:6px 0 2px;font-size:1em;color:var(--accent2,#06b6d4);font-weight:800;">' + title + '</div>',
        '<div style="font-size:0.72em;color:var(--text2,#aaa);margin:8px 0 16px;">المستوى القادم يحتاج ' + nextXp.toLocaleString('ar') + ' XP</div>',
        '<div style="height:6px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;margin-bottom:20px;">',
        '<div id="lvUpXpBar_' + newLevel + '" style="width:0%;height:100%;background:var(--gold,#f0b90b);border-radius:99px;transition:width 1s ease;"></div></div>',
        '<button onclick="this.closest(\'[data-levelup]\').remove()" style="background:var(--gold,#f0b90b);color:#000;border:none;border-radius:14px;padding:10px 32px;font-size:1em;font-weight:900;cursor:pointer;width:100%;">🏆 رائع!</button>'
    ].join('');
    overlay.appendChild(card);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    setTimeout(function() {
        const bar = document.getElementById('lvUpXpBar_' + newLevel);
        if (bar) bar.style.width = '15%';
    }, 500);
    try { if (typeof doConfetti === 'function') doConfetti(); } catch(e) {}
    setTimeout(function() {
        if (overlay.parentNode) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.4s';
            setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 400);
        }
    }, 6000);
    if (!document.getElementById('_lvUpKeyframes')) {
        const s = document.createElement('style');
        s.id = '_lvUpKeyframes';
        s.textContent = '@keyframes lvFadeIn{from{opacity:0}to{opacity:1}}@keyframes lvCardPop{0%{transform:scale(0.6) translateY(30px);opacity:0}70%{transform:scale(1.04) translateY(-4px);opacity:1}100%{transform:scale(1) translateY(0)}}';
        document.head.appendChild(s);
    }
};

/* ══════════════════════════════════════════════════════════════
   ⑩ hook على saveSt لتحديث LV تلقائياً
   ══════════════════════════════════════════════════════════════ */

/* تصدير كل الدوال عالمياً للتوافق مع الكود القديم */
window.updateHomeStats         = updateHomeStatsPrecise;
window.updateParentTimePrecise = updateParentTimePrecise;
window.calcXpGained            = calcXpGained;
window.getSessionSecs          = window.getSessionSecs;
window.saveSessionTime         = window.saveSessionTime;
window.calcPerformanceRating   = window.calcPerformanceRating;
window.fmtTimeFriendly         = window.fmtTimeFriendly;
window.fmtTime                 = window.fmtTime;

/* ══════════════════════════════════════════════════════════════
   ⑪ تهيئة عند تحميل الصفحة
   ══════════════════════════════════════════════════════════════ */

window.addEventListener('load', function() {
    setTimeout(function() {
        /* ① التحقق من صحة التواريخ */
        window.validateDailyDates();
        /* ② ترقية بيانات قديمة */
        migrateStateToV2();
        /* ③ مزامنة وقت الجلسة */
        _sessionStartMs = Date.now();
        _lastSavedSessionSecs = st.sessionTimeSecs || 0;
        /* ④ إصلاح XP */
        const lv = Math.max(1, st.level || 1);
        const expectedXtn = window.calcXpToNext(lv);
        if (!st.xpToNext || st.xpToNext < 100 || st.xpToNext > expectedXtn * 10) {
            st.xpToNext = expectedXtn;
        }
        if (st.xp >= st.xpToNext) st.xp = Math.floor(st.xpToNext * 0.85);
        if (st.xp < 0) st.xp = 0;
        if (!st.level || st.level < 1 || isNaN(st.level)) st.level = 1;
        /* ⑤ تحديث الواجهة */
        window.refreshLevelDisplay();
        updateHomeStatsPrecise();
        updateParentTimePrecise();
        _startSessionTimerDisplay();
        /* ⑥ hook على saveSt */
        if (typeof window.saveSt === 'function' && !window._lvFixApplied) {
            window._lvFixApplied = true;
            const _origSaveSt = window.saveSt;
            window.saveSt = function() {
                _origSaveSt.apply(this, arguments);
                setTimeout(window.refreshLevelDisplay, 30);
            };
        }
        console.log('[HO Math] ✅ utils.js جاهز — LV:', st.level, '| XP:', st.xp, '/', st.xpToNext);
    }, 800);
});

})(); /* نهاية IIFE */
