/* ═══════════════════════════════════════════════════════════════
   HO Math — Utils & Stats Engine
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ① التاريخ والوقت
   ══════════════════════════════════════════════════════════════ */

window.todayStr = function todayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const result = y + '-' + m + '-' + d;
    if (y < 2020) {
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
    return date.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
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
    return h + ':' + mn + ':' + sc;
};

/* ══════════════════════════════════════════════════════════════
   ③ وقت الجلسة
   ══════════════════════════════════════════════════════════════ */

var _sessionStartMs = Date.now();
var _lastSavedSessionSecs = (function() {
    try {
        var s = JSON.parse(localStorage.getItem('ho_math_v7'));
        return (s && typeof s.sessionTimeSecs === 'number') ? s.sessionTimeSecs : 0;
    } catch(e) { return 0; }
})();

window.getSessionSecs = function getSessionSecs() {
    var today = window.todayStr();
    if (st.sessionDate !== today) {
        st.sessionTimeSecs = 0;
        st.sessionDate = today;
        _sessionStartMs = Date.now();
        saveSt();
    }
    var elapsed = Math.floor((Date.now() - _sessionStartMs) / 1000);
    return Math.max(0, (st.sessionTimeSecs || 0) + elapsed);
};

window.saveSessionTime = function saveSessionTime() {
    var secs  = window.getSessionSecs();
    var today = window.todayStr();
    var week  = window.weekStr();

    st.sessionTimeSecs = secs;
    st.sessionDate     = today;

    if (!st.weeklyStats) st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week };
    if (st.weeklyStats.week !== week) {
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week, sessionSecs: 0, _baseSessionSecs: 0 };
    }
    st.weeklyStats.sessionSecs = secs + (st.weeklyStats._baseSessionSecs || 0);

    if (typeof st.totalPlayTimeSecs !== 'number') st.totalPlayTimeSecs = 0;
    var sessionDelta = secs - (_lastSavedSessionSecs || 0);
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

/* أحداث حفظ الوقت — تُسجَّل بعد تعريف saveSessionTime */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) window.saveSessionTime();
});
window.addEventListener('beforeunload', function() { window.saveSessionTime(); });
setInterval(function() { window.saveSessionTime(); }, 60000);

/* مراقبة انتهاء اليوم */
var _lastDayCheck = window.todayStr();
setInterval(function() {
    var today = window.todayStr();
    if (today !== _lastDayCheck) {
        if (st.weeklyStats) {
            var todaySecs = window.getSessionSecs();
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

/* مؤقت الجلسة الحي */
var _sessionTimerInterval = null;
function _startSessionTimerDisplay() {
    if (_sessionTimerInterval) clearInterval(_sessionTimerInterval);
    _sessionTimerInterval = setInterval(function() {
        if (document.hidden) return;
        var el = document.getElementById('sessionTimerDisplay');
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
    var lv = Math.max(1, Math.floor(level));
    return Math.floor(400 + 120 * lv + 40 * Math.sqrt(lv));
};

window.getXpPercent = function getXpPercent() {
    var toNext = st.xpToNext || window.calcXpToNext(st.level || 1);
    if (toNext <= 0) return 99;
    return Math.min(99, Math.max(0, Math.round((st.xp / toNext) * 100)));
};

function _calcXpGained(correct, wrong, score, bestStreak) {
    var total = correct + wrong;
    if (total === 0) return 0;
    var accuracy = correct / total;
    var xp = correct * 8;
    xp += Math.floor(xp * accuracy * 0.20);
    if (bestStreak >= 5)  xp += Math.floor(bestStreak * 2);
    if (bestStreak >= 10) xp += 20;
    var cap = Math.max(50, total * 20);
    return Math.min(Math.floor(xp), cap);
}
window.calcXpGained = _calcXpGained;

window.applyXpGain = function applyXpGain(correct, wrong, score, bestStreak) {
    var xpGained = _calcXpGained(correct, wrong, score, bestStreak);
    if (xpGained <= 0) return { xpGained: 0, levelsGained: 0, newLevel: st.level };

    var xpMult = (typeof getXpMultiplier === 'function') ? getXpMultiplier() : 1;
    if (xpMult > 1) {
        var bonus = Math.floor(xpGained * (xpMult - 1));
        xpGained += bonus;
        if (bonus > 0) {
            setTimeout(function() {
                try { showFeedback('⚡ مضاعف XP ×' + xpMult + '! +' + bonus + ' XP إضافية'); } catch(e) {}
            }, 400);
        }
    }

    st.xp = Math.max(0, (st.xp || 0) + xpGained);

    var expectedXpToNext = window.calcXpToNext(st.level);
    if (!st.xpToNext || Math.abs(st.xpToNext - expectedXpToNext) > expectedXpToNext * 0.5) {
        st.xpToNext = expectedXpToNext;
    }

    var levelsGained = 0;
    var levelsToShow = [];
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
    return { xpGained: xpGained, levelsGained: levelsGained, newLevel: st.level };
};

/* مساعد داخلي */
function _setEl(id, text, styles) {
    var el = document.getElementById(id);
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

window.refreshLevelDisplay = function refreshLevelDisplay() {
    var lv     = Math.max(1, st.level || 1);
    var xp     = Math.max(0, st.xp || 0);
    var xpNext = st.xpToNext || window.calcXpToNext(lv);
    var pct    = window.getXpPercent();
    var lvText   = 'Lv.' + lv;
    var lvTextAr = 'المستوى ' + lv;
    var title    = _getTitle(lv);
    var xpLocale = xp.toLocaleString('ar');
    var xpNLocale = xpNext.toLocaleString('ar');

    _setEl('headerSub',        lvText + ' • ' + title);
    _setEl('headerXpBar',      null, { width: pct + '%' });
    _setEl('headerXp',         '⚡ ' + xpLocale + ' XP');
    _setEl('homePlayerLevel',  lvText + ' • ' + title);
    _setEl('homeXpBarFill',    null, { width: pct + '%' });
    _setEl('homeXpText',       '⚡ ' + xpLocale + ' XP');
    _setEl('homeXpNext',       xpLocale + ' / ' + xpNLocale);
    _setEl('homeLevel',        String(lv));
    _setEl('profileLevel',     lvTextAr + ' • ' + title);
    _setEl('profileXpFill',    null, { width: pct + '%' });
    _setEl('profileXpLabel',   xpLocale + ' / ' + xpNLocale + ' XP للمستوى التالي');
    _setEl('spProfileLevel',   lvTextAr + ' • ' + title);
    _setEl('spProfileXpFill',  null, { width: pct + '%' });
    _setEl('spProfileXpLabel', xpLocale + ' / ' + xpNLocale + ' XP للمستوى التالي');
    var age = st.age || 0;
    _setEl('parentAgeLevel',   lvTextAr + ' • ' + (age > 0 ? 'العمر: ' + age + ' سنة' : 'العمر غير محدد'));
};

/* ══════════════════════════════════════════════════════════════
   ⑤ محرك الإحصائيات
   ══════════════════════════════════════════════════════════════ */

function _calcAccuracy(correct, total, minSamples) {
    minSamples = minSamples || 5;
    if (!total || total < minSamples) return null;
    return Math.round((correct / total) * 100);
}

window.displayAccuracy = function displayAccuracy(correct, total) {
    var acc = _calcAccuracy(correct, total, 3);
    if (acc === null) return total > 0 ? Math.round((correct/total)*100) + '%' : '—';
    return acc + '%';
};

window.calcPerformanceRating = function calcPerformanceRating() {
    var total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    if (total < 10) return { stars: 0, label: 'جديد', raw: 0 };
    var accuracy    = st.correctTotal / total;
    var streakBonus = Math.min(0.5, (st.bestStreak || 0) * 0.05);
    var levelBonus  = Math.min(0.5, (st.level || 1) * 0.02);
    var raw = Math.min(5, accuracy * 4 + streakBonus + levelBonus);
    var stars = Math.round(raw * 10) / 10;
    var label;
    if (stars >= 4.5)      label = 'ممتاز 🏆';
    else if (stars >= 3.5) label = 'جيد جداً ⭐';
    else if (stars >= 2.5) label = 'جيد 👍';
    else if (stars >= 1.5) label = 'يحتاج تدريب 💪';
    else                   label = 'مبتدئ 🌱';
    return { stars: stars, label: label, raw: raw };
};

window.recordDailyStatV2 = function recordDailyStatV2(type) {
    var today = window.todayStr();
    var week  = window.weekStr();
    if (!st.dailyStats || st.dailyStats.date !== today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }
    if (!st.weeklyStats || st.weeklyStats.week !== week) {
        _archiveWeeklyStats();
        st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: week, sessionSecs: 0, _baseSessionSecs: 0 };
    }
    if (type === 'correct') { st.dailyStats.correct++; st.weeklyStats.correct++; }
    if (type === 'wrong')   { st.dailyStats.wrong++;   st.weeklyStats.wrong++;   }
    if (type === 'game')    {
        st.dailyStats.games++;
        st.weeklyStats.games++;
        var ts = window.getSessionSecs();
        st.weeklyStats.sessionSecs = (st.weeklyStats._baseSessionSecs || 0) + ts;
    }
    if (type === 'streak' && (st.bestStreak || 0) > (st.weeklyStats.bestStreak || 0)) {
        st.weeklyStats.bestStreak = st.bestStreak;
    }
};
window.recordDailyStat = window.recordDailyStatV2;

/* ══════════════════════════════════════════════════════════════
   ⑥ تحديث الواجهة
   ══════════════════════════════════════════════════════════════ */

function _calcChallengePct(games) {
    if (!games || games <= 0) return 0;
    return Math.min(100, Math.round(Math.sqrt(games / 20) * 100));
}

function updateHomeStatsPrecise() {
    var q = function(id) { return document.getElementById(id); };
    if (!q('homeCoins')) return;
    if (q('headerCoins'))   q('headerCoins').textContent   = st.coins;
    if (q('homeCoins'))     q('homeCoins').textContent     = st.coins;
    if (q('homeCorrect'))   q('homeCorrect').textContent   = st.correctTotal;
    var total = (st.correctTotal || 0) + (st.wrongTotal || 0);
    if (q('homeAccuracy'))  q('homeAccuracy').textContent  = total < 3 ? '—' : window.displayAccuracy(st.correctTotal, total);
    if (q('homeStreak'))    q('homeStreak').textContent    = '×' + (st.bestStreak || 0);
    if (q('homeGames'))     q('homeGames').textContent     = st.totalGames || 0;
    if (q('homeLevel'))     q('homeLevel').textContent     = st.level || 1;
    if (q('homeBestScore')) q('homeBestScore').textContent = st.bestScore || 0;

    var perf = window.calcPerformanceRating();
    if (q('ratingNum'))   q('ratingNum').textContent  = perf.stars.toFixed(1);
    if (q('ratingBar'))   q('ratingBar').style.width  = (perf.stars / 5 * 100) + '%';
    var rs = (typeof starsStr === 'function') ? starsStr(perf.stars) : '';
    if (q('ratingStars')) q('ratingStars').textContent = rs;
    if (q('homeStars'))   q('homeStars').textContent   = rs;

    var cc      = st.catCounter || { correct: 0, total: 0 };
    var cpct    = _calcAccuracy(cc.correct, cc.total, 1);
    var cpctSafe = cpct !== null ? cpct : 0;
    if (q('catProg0'))  q('catProg0').style.width = cpctSafe + '%';
    if (q('catStats0')) q('catStats0').textContent = cc.total >= 3
        ? cpctSafe + '% • ' + cc.correct + ' صح'
        : cc.total > 0 ? cc.correct + '/' + cc.total + ' (بيانات قليلة)' : 'لم تبدأ بعد';

    var cg    = (st.catChallenges && st.catChallenges.games) || 0;
    var cpct1 = _calcChallengePct(cg);
    if (q('catProg1'))  q('catProg1').style.width    = cpct1 + '%';
    if (q('catStats1')) q('catStats1').textContent   = cg > 0 ? cg + ' جلسة تحدي' : 'لم تبدأ بعد';
    if (q('gcatProg0')) q('gcatProg0').style.width   = cpctSafe + '%';
    if (q('gcatProg1')) q('gcatProg1').style.width   = cpct1 + '%';
    if (q('gcatStats0')) q('gcatStats0').textContent = cc.correct + '/' + cc.total + ' إجابة';
    if (q('gcatStats1')) q('gcatStats1').textContent = cg + ' جلسة تحدي';
}

function updateParentTimePrecise() {
    var q = function(id) { return document.getElementById(id); };
    var todaySecs = window.getSessionSecs();
    var wsBase    = (st.weeklyStats && st.weeklyStats._baseSessionSecs) || 0;
    var weekSecs  = wsBase + todaySecs;
    var totalSecs = Math.max(0, (st.totalPlayTimeSecs || 0) + todaySecs);
    var fmt = window.fmtTimeFriendly;
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
    var today = window.todayStr();
    ['dailyDate','loginBonusDate','_lastLoginBonus','lastDailyDate'].forEach(function(key) {
        if (st[key] && st[key] > today) st[key] = today;
    });
    if (st.dailyBox && st.dailyBox.date && st.dailyBox.date > today) {
        st.dailyBox = { opened: false, date: '', reward: 0 };
    }
    if (st.dailyStats && st.dailyStats.date && st.dailyStats.date > today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }
    try { saveSt(); } catch(e) {}
};

/* ══════════════════════════════════════════════════════════════
   ⑧ ترقية البيانات القديمة
   ══════════════════════════════════════════════════════════════ */

function _fixLegacyXpData() {
    var expected = window.calcXpToNext(st.level);
    if (st.xpToNext > expected * 10 || st.xpToNext < 100) {
        st.xpToNext = expected;
        if (st.xp >= st.xpToNext) st.xp = Math.floor(st.xpToNext * 0.8);
        saveSt();
    }
}

function _migrateStateToV2() {
    var changed = false;
    if (typeof st.totalPlayTimeSecs !== 'number') { st.totalPlayTimeSecs = st.sessionTimeSecs || 0; changed = true; }
    if (st.weeklyStats && typeof st.weeklyStats._baseSessionSecs !== 'number') { st.weeklyStats._baseSessionSecs = 0; changed = true; }
    if (!st.weeklyHistory) { st.weeklyHistory = []; changed = true; }
    _fixLegacyXpData();
    if (changed) saveSt();
}

/* ══════════════════════════════════════════════════════════════
   ⑨ showLevelUpCelebration
   ══════════════════════════════════════════════════════════════ */

window.showLevelUpCelebration = function showLevelUpCelebration(newLevel) {
    if (document.querySelector('[data-levelup="' + newLevel + '"]')) return;
    var overlay = document.createElement('div');
    overlay.setAttribute('data-levelup', String(newLevel));
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);animation:lvFadeIn 0.3s ease forwards';
    var title  = _getTitle(newLevel);
    var nextXp = window.calcXpToNext(newLevel);
    var card   = document.createElement('div');
    card.style.cssText = 'background:var(--surface,#1a1a2e);border:2.5px solid var(--gold,#f0b90b);border-radius:28px;padding:36px 40px;text-align:center;max-width:320px;width:88%;animation:lvCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
    card.innerHTML =
        '<div style="font-size:3.2em;margin-bottom:4px;">🎉</div>' +
        '<div style="font-size:0.9em;color:var(--text2,#aaa);font-weight:700;margin-bottom:4px;">ارتقيت إلى</div>' +
        '<div style="font-size:3em;font-weight:900;color:var(--gold,#f0b90b);line-height:1;">Lv.' + newLevel + '</div>' +
        '<div style="margin:6px 0 2px;font-size:1em;color:var(--accent2,#06b6d4);font-weight:800;">' + title + '</div>' +
        '<div style="font-size:0.72em;color:var(--text2,#aaa);margin:8px 0 16px;">المستوى القادم يحتاج ' + nextXp.toLocaleString('ar') + ' XP</div>' +
        '<div style="height:6px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;margin-bottom:20px;">' +
        '<div id="lvUpXpBar_' + newLevel + '" style="width:0%;height:100%;background:var(--gold,#f0b90b);border-radius:99px;transition:width 1s ease;"></div></div>' +
        '<button onclick="this.closest(\'[data-levelup]\').remove()" style="background:var(--gold,#f0b90b);color:#000;border:none;border-radius:14px;padding:10px 32px;font-size:1em;font-weight:900;cursor:pointer;width:100%;">🏆 رائع!</button>';
    overlay.appendChild(card);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    setTimeout(function() {
        var bar = document.getElementById('lvUpXpBar_' + newLevel);
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
        var s = document.createElement('style');
        s.id = '_lvUpKeyframes';
        s.textContent = '@keyframes lvFadeIn{from{opacity:0}to{opacity:1}}@keyframes lvCardPop{0%{transform:scale(0.6) translateY(30px);opacity:0}70%{transform:scale(1.04) translateY(-4px);opacity:1}100%{transform:scale(1) translateY(0)}}';
        document.head.appendChild(s);
    }
};

/* ══════════════════════════════════════════════════════════════
   ⑩ تهيئة عند تحميل الصفحة
   ══════════════════════════════════════════════════════════════ */

window.addEventListener('load', function() {
    setTimeout(function() {
        window.validateDailyDates();
        _migrateStateToV2();
        _sessionStartMs = Date.now();
        _lastSavedSessionSecs = st.sessionTimeSecs || 0;

        /* إصلاح XP */
        var lv = Math.max(1, st.level || 1);
        var expectedXtn = window.calcXpToNext(lv);
        if (!st.xpToNext || st.xpToNext < 100 || st.xpToNext > expectedXtn * 10) st.xpToNext = expectedXtn;
        if (st.xp >= st.xpToNext) st.xp = Math.floor(st.xpToNext * 0.85);
        if (st.xp < 0) st.xp = 0;
        if (!st.level || st.level < 1 || isNaN(st.level)) st.level = 1;

        window.refreshLevelDisplay();
        updateHomeStatsPrecise();
        updateParentTimePrecise();
        _startSessionTimerDisplay();

        /* hook على saveSt */
        if (typeof window.saveSt === 'function' && !window._lvFixApplied) {
            window._lvFixApplied = true;
            var _origSaveSt = window.saveSt;
            window.saveSt = function() {
                _origSaveSt.apply(this, arguments);
                setTimeout(window.refreshLevelDisplay, 30);
            };
        }

        console.log('[HO Math] utils.js جاهز — LV:', st.level, '| XP:', st.xp);
    }, 800);
});

/* تصدير */
window.updateHomeStats          = updateHomeStatsPrecise;
window.updateParentTimePrecise  = updateParentTimePrecise;
window.fmtTimeFriendly          = window.fmtTimeFriendly;
window.fmtTime                  = window.fmtTime;
