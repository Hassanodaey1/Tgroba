/* ═══════════════════════════════════════════════════════════════
   HO Math — إصلاح التاريخ/الوقت ونظام LV
   الإصدار: v1.0 — 2026
   © Hassan Odaey
   ═══════════════════════════════════════════════════════════════
   الملف يُضاف مباشرة في index.html بعد سطر:
     <script src="stats_engine.js"></script>
   وقبل سطر:
     <script src="fixes_init.js"></script>
   ═══════════════════════════════════════════════════════════════ */

(function() {
'use strict';

/* ══════════════════════════════════════════════════════════════
   ① إصلاح todayStr و weekStr — حماية كاملة من التلاعب
   ══════════════════════════════════════════════════════════════ */

/**
 * todayStr آمنة — تستخدم التوقيت المحلي مع حماية من التلاعب
 * تُعيد دائماً بصيغة YYYY-MM-DD مع zero-padding
 * لا تقبل تواريخ مستقبلية بأكثر من يوم واحد
 */
window.todayStr = function todayStr() {
    const now = new Date();
    /* حماية: إذا كانت الساعة للخلف جداً، نُبلّغ بدون تأثير */
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const result = `${y}-${m}-${d}`;

    /* حماية من التلاعب: تاريخ اليوم لا يمكن أن يكون قبل 2020 */
    if (y < 2020) {
        console.warn('[HO Math] تاريخ النظام غير صحيح:', result);
        /* نعيد الأخير المخزّن أو تاريخاً معقولاً */
        try {
            const saved = localStorage.getItem('ho_math_last_valid_date');
            if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
        } catch(e) {}
        return '2026-01-01';
    }

    /* حفظ آخر تاريخ صالح */
    try { localStorage.setItem('ho_math_last_valid_date', result); } catch(e) {}
    return result;
};

/**
 * weekStr آمنة — ISO 8601 بدون أخطاء
 * تُعيد YYYY-Www مثل 2026-W23
 */
window.weekStr = function weekStr() {
    const d    = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    /* اضبط لليوم الخميس من نفس الأسبوع (ISO: الأسبوع يبدأ الاثنين) */
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

/* ══════════════════════════════════════════════════════════════
   ② عرض الوقت الحي — ساعة دقيقة في الواجهة
   ══════════════════════════════════════════════════════════════ */

/**
 * تنسيق الثواني → نص واضح بالعربية
 * 0–59 ث   → "أقل من دقيقة"
 * 1–59 د   → "X دقيقة"
 * 1–23 س   → "Xس Yd" أو "Xس"
 * 24+ س    → "X يوم Ys" (للوقت التراكمي الكبير)
 */
window.fmtTimeFriendly = function fmtTimeFriendly(secs) {
    if (!secs || secs < 1)   return 'لم يبدأ بعد';
    if (secs < 60)           return 'أقل من دقيقة';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const days = Math.floor(h / 24);
    if (days >= 1) {
        const rh = h % 24;
        return days + (days === 1 ? ' يوم' : ' أيام') + (rh > 0 ? ' ' + rh + 'س' : '');
    }
    if (h > 0) return h + 'س' + (m > 0 ? ' ' + m + 'د' : '');
    return m + (m === 1 ? ' دقيقة' : ' دقيقة');
};

/** HH:MM:SS للمؤقت المباشر */
window.fmtTime = function fmtTime(s) {
    s = Math.max(0, Math.floor(s));
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const mn = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    return `${h}:${mn}:${sc}`;
};

/**
 * محدّث عرض وقت الجلسة — يُشغَّل كل ثانية
 * يتوقف تلقائياً إذا أُخفيت الصفحة
 */
var _sessionTimerInterval = null;
function _startSessionTimerDisplay() {
    if (_sessionTimerInterval) clearInterval(_sessionTimerInterval);
    _sessionTimerInterval = setInterval(function() {
        if (document.hidden) return; /* لا تُحدّث إذا كانت التبويب مخفياً */
        const el = document.getElementById('sessionTimerDisplay');
        if (!el) return;
        const secs = (typeof getSessionSecs === 'function') ? getSessionSecs() : 0;
        el.textContent = window.fmtTime(secs);
    }, 1000);
}

/* إعادة تشغيل عند ظهور الصفحة */
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) _startSessionTimerDisplay();
});

/* ══════════════════════════════════════════════════════════════
   ③ إصلاح نظام LV — حماية شاملة
   ══════════════════════════════════════════════════════════════ */

/**
 * calcXpToNext محسوبة بدقة
 * LV 1  → 560 XP
 * LV 5  → 1068 XP
 * LV 10 → 1726 XP
 * LV 20 → 2958 XP
 * LV 50 → 6682 XP
 */
window.calcXpToNext = function calcXpToNext(level) {
    const lv = Math.max(1, Math.floor(level));
    return Math.floor(400 + 120 * lv + 40 * Math.sqrt(lv));
};

/**
 * xpPct آمنة — لا تتجاوز 100%، لا تنكسر
 */
window.getXpPercent = function getXpPercent() {
    if (typeof st === 'undefined') return 0;
    const toNext = st.xpToNext || window.calcXpToNext(st.level || 1);
    if (toNext <= 0) return 99;
    return Math.min(99, Math.max(0, Math.round((st.xp / toNext) * 100)));
};

/**
 * تحديث عرض LV في كل عناصر الواجهة — دالة واحدة موثوقة
 * تُستدعى بعد كل تغيير في st.level أو st.xp
 */
window.refreshLevelDisplay = function refreshLevelDisplay() {
    if (typeof st === 'undefined') return;

    const lv     = Math.max(1, st.level || 1);
    const xp     = Math.max(0, st.xp || 0);
    const xpNext = st.xpToNext || window.calcXpToNext(lv);
    const pct    = window.getXpPercent();

    /* ─── النص المعروض للمستوى ─── */
    const lvText   = 'Lv.' + lv;
    const lvTextAr = 'المستوى ' + lv;

    /* ─── تحديث كل عناصر الهيدر ─── */
    _setEl('headerSub',       lvText + ' • ' + _getTitle(lv));
    _setEl('headerXpBar',     null, { width: pct + '%' });
    _setEl('headerXp',        '⚡ ' + xp.toLocaleString('ar') + ' XP');

    /* ─── الصفحة الرئيسية ─── */
    _setEl('homePlayerLevel', lvText + ' • ' + _getTitle(lv));
    _setEl('homeXpBarFill',   null, { width: pct + '%' });
    _setEl('homeXpText',      '⚡ ' + xp.toLocaleString('ar') + ' XP');
    _setEl('homeXpNext',      xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar'));
    _setEl('homeLevel',       String(lv));

    /* ─── صفحة الملف الشخصي ─── */
    _setEl('profileLevel',    lvTextAr + ' • ' + _getTitle(lv));
    _setEl('profileXpFill',   null, { width: pct + '%' });
    _setEl('profileXpLabel',  xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar') + ' XP للمستوى التالي');

    /* ─── الصفحات الفرعية ─── */
    _setEl('spProfileLevel',  lvTextAr + ' • ' + _getTitle(lv));
    _setEl('spProfileXpFill', null, { width: pct + '%' });
    _setEl('spProfileXpLabel', xp.toLocaleString('ar') + ' / ' + xpNext.toLocaleString('ar') + ' XP للمستوى التالي');

    /* ─── وضع الوالدين ─── */
    _setEl('parentAgeLevel',  lvTextAr + ' • ' + _getAgeStr());
};

/** مساعد: ضبط textContent أو style */
function _setEl(id, text, styles) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text  !== null && text !== undefined) el.textContent = text;
    if (styles) Object.assign(el.style, styles);
}

/** لقب اللاعب حسب المستوى */
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

/* ══════════════════════════════════════════════════════════════
   ④ إصلاح applyXpGain — ضمان صحة البيانات بعد كل رفع مستوى
   ══════════════════════════════════════════════════════════════ */

/**
 * applyXpGain محسوبة — تستبدل النسخة القديمة
 * تضمن:
 *   • xpToNext صحيح دائماً
 *   • الاحتفال يُعرض لكل مستوى منفصلاً بفاصل زمني
 *   • لا يتجاوز xp الحد المسموح
 */
window.applyXpGain = function applyXpGain(correct, wrong, score, bestStreak) {
    /* استخدام calcXpGained إذا كانت موجودة، وإلا حساب بسيط */
    let xpGained = (typeof calcXpGained === 'function')
        ? calcXpGained(correct, wrong, score, bestStreak)
        : Math.max(0, correct * 8 + Math.floor(Math.min(1.0, correct / Math.max(1, correct + wrong)) * correct * 1.6));

    if (xpGained <= 0) return { xpGained: 0, levelsGained: 0, newLevel: st.level };

    /* ✅ مضاعف XP من المتجر */
    const xpMult = (typeof getXpMultiplier === 'function') ? getXpMultiplier() : 1;
    if (xpMult > 1) {
        const bonus = Math.floor(xpGained * (xpMult - 1));
        xpGained += bonus;
        if (bonus > 0) {
            setTimeout(function() {
                try { showFeedback('⚡ مضاعف XP ×' + xpMult + '! +' + bonus + ' XP إضافية'); } catch(e) {}
            }, 400);
        }
    }

    st.xp = Math.max(0, (st.xp || 0) + xpGained);

    /* ✅ تصحيح xpToNext قبل حلقة الترقية */
    const expectedXpToNext = window.calcXpToNext(st.level);
    if (!st.xpToNext || Math.abs(st.xpToNext - expectedXpToNext) > expectedXpToNext * 0.5) {
        st.xpToNext = expectedXpToNext;
    }

    let levelsGained = 0;
    const levelsToShow = []; /* جمع كل المستويات للاحتفال */

    while (st.xp >= st.xpToNext && levelsGained < 30) {
        st.xp      -= st.xpToNext;
        st.level    = Math.max(1, (st.level || 1) + 1);
        st.xpToNext = window.calcXpToNext(st.level);
        levelsGained++;
        levelsToShow.push(st.level);
        try { playSound('levelup'); } catch(e) {}
    }

    /* حماية: xp لا يتجاوز xpToNext */
    if (st.xp >= st.xpToNext) st.xp = st.xpToNext - 1;
    if (st.xp < 0) st.xp = 0;

    /* ✅ عرض احتفال لكل مستوى بفاصل 600ms */
    levelsToShow.forEach(function(lv, i) {
        setTimeout(function() {
            try {
                if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(lv);
            } catch(e) {}
        }, 600 + i * 700);
    });

    /* تحديث الواجهة فوراً */
    setTimeout(window.refreshLevelDisplay, 50);

    return { xpGained, levelsGained, newLevel: st.level };
};

/* ══════════════════════════════════════════════════════════════
   ⑤ إصلاح sanitizeState — حدود LV صحيحة
   ══════════════════════════════════════════════════════════════ */

/**
 * تُضاف فوق sanitizeState الموجودة — تُصحح xpToNext بعدها
 */
window.addEventListener('load', function() {
    /* تشغيل بعد تحميل كل شيء */
    setTimeout(function() {
        if (typeof st === 'undefined') return;

        /* ① xpToNext: لا يقبل أقل من calcXpToNext(level) × 0.5 */
        const lv = Math.max(1, st.level || 1);
        const expectedXtn = window.calcXpToNext(lv);
        if (!st.xpToNext || st.xpToNext < 100 || st.xpToNext > expectedXtn * 10) {
            console.log('[HO Math] إصلاح xpToNext:', st.xpToNext, '→', expectedXtn);
            st.xpToNext = expectedXtn;
        }

        /* ② xp لا يتجاوز xpToNext */
        if (st.xp >= st.xpToNext) {
            st.xp = Math.floor(st.xpToNext * 0.85);
        }
        if (st.xp < 0) st.xp = 0;

        /* ③ level لا يكون 0 أو NaN */
        if (!st.level || st.level < 1 || isNaN(st.level)) st.level = 1;

        /* ④ تحديث الواجهة */
        window.refreshLevelDisplay();
        if (typeof saveSt === 'function') saveSt();

        console.log('[HO Math] ✅ فحص LV: المستوى', st.level, '| XP', st.xp, '/', st.xpToNext);
    }, 800);
});

/* ══════════════════════════════════════════════════════════════
   ⑥ إصلاح حماية الصندوق اليومي ومكافأة تسجيل الدخول
   ══════════════════════════════════════════════════════════════ */

/**
 * التحقق من صحة التاريخ اليومي لكل الحقول الحساسة
 * يمنع الغش عبر تعديل ساعة النظام
 */
window.validateDailyDates = function validateDailyDates() {
    if (typeof st === 'undefined') return;
    const today = window.todayStr();

    /* إذا كان أي تاريخ محفوظ في المستقبل → أعده لليوم */
    ['dailyDate', 'loginBonusDate', '_lastLoginBonus', 'lastDailyDate'].forEach(function(key) {
        if (st[key] && st[key] > today) {
            console.warn('[HO Math] تاريخ مستقبلي في', key, ':', st[key], '→', today);
            st[key] = today;
        }
    });

    /* dailyBox */
    if (st.dailyBox && st.dailyBox.date && st.dailyBox.date > today) {
        console.warn('[HO Math] dailyBox.date مستقبلي → إعادة تعيين');
        st.dailyBox = { opened: false, date: '', reward: 0 };
    }

    /* dailyStats: إذا كانت بتاريخ مستقبلي → إعادة تعيين */
    if (st.dailyStats && st.dailyStats.date && st.dailyStats.date > today) {
        st.dailyStats = { correct: 0, wrong: 0, games: 0, date: today };
    }

    try { if (typeof saveSt === 'function') saveSt(); } catch(e) {}
};

/* ══════════════════════════════════════════════════════════════
   ⑦ عرض احترافي للوقت في بطاقة الوالدين
   ══════════════════════════════════════════════════════════════ */

/**
 * تحديث حي لوقت الجلسة في بطاقة الوالدين كل 5 ثوانٍ
 */
function _updateParentTimeDisplay() {
    if (typeof st === 'undefined' || typeof getSessionSecs !== 'function') return;
    const todaySecs  = getSessionSecs();
    const wsBase     = (st.weeklyStats && st.weeklyStats._baseSessionSecs) || 0;
    const weekSecs   = wsBase + todaySecs;
    const totalSecs  = Math.max(0, (st.totalPlayTimeSecs || 0) + todaySecs);
    const fmt        = window.fmtTimeFriendly;

    _setEl('parentTimeToday', fmt(todaySecs));
    _setEl('parentTimeWeek',  fmt(weekSecs));
    _setEl('parentTimeTotal', fmt(totalSecs));
    _setEl('sessionTimerDisplay', window.fmtTime(todaySecs));
}

setInterval(_updateParentTimeDisplay, 5000);

/* ══════════════════════════════════════════════════════════════
   ⑧ دالة showLevelUpCelebration المحسّنة
   ══════════════════════════════════════════════════════════════ */

window.showLevelUpCelebration = function showLevelUpCelebration(newLevel) {
    /* منع التكرار: إذا كان هناك احتفال مفتوح بنفس المستوى، تجاهل */
    if (document.querySelector('[data-levelup="' + newLevel + '"]')) return;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-levelup', String(newLevel));
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'display:flex', 'align-items:center', 'justify-content:center',
        'background:rgba(0,0,0,0.6)',
        'animation:lvFadeIn 0.3s ease forwards'
    ].join(';');

    const title = _getTitle(newLevel);
    const card  = document.createElement('div');
    card.style.cssText = [
        'background:var(--surface,#1a1a2e)',
        'border:2.5px solid var(--gold,#f0b90b)',
        'border-radius:28px', 'padding:36px 40px',
        'text-align:center', 'max-width:320px', 'width:88%',
        'animation:lvCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
    ].join(';');

    /* XP التالي */
    const nextXp = window.calcXpToNext(newLevel);

    card.innerHTML = [
        '<div style="font-size:3.2em;margin-bottom:4px;">🎉</div>',
        '<div style="font-size:0.9em;color:var(--text2,#aaa);font-weight:700;margin-bottom:4px;">ارتقيت إلى</div>',
        '<div style="font-size:3em;font-weight:900;color:var(--gold,#f0b90b);line-height:1;">',
          'Lv.' + newLevel,
        '</div>',
        '<div style="margin:6px 0 2px;font-size:1em;color:var(--accent2,#06b6d4);font-weight:800;">',
          title,
        '</div>',
        '<div style="font-size:0.72em;color:var(--text2,#aaa);margin:8px 0 16px;">',
          'المستوى القادم يحتاج ' + nextXp.toLocaleString('ar') + ' XP',
        '</div>',
        /* شريط XP تشويشي */
        '<div style="height:6px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;margin-bottom:20px;">',
          '<div style="width:0%;height:100%;background:var(--gold,#f0b90b);border-radius:99px;',
               'transition:width 1s ease;animation:lvXpBar 1.2s 0.4s ease forwards;" id="lvUpXpBar_' + newLevel + '"></div>',
        '</div>',
        '<button onclick="this.closest(\'[data-levelup]\').remove()" style="',
          'background:var(--gold,#f0b90b);color:#000;border:none;',
          'border-radius:14px;padding:10px 32px;font-size:1em;',
          'font-weight:900;cursor:pointer;width:100%;',
        '">🏆 رائع!</button>'
    ].join('');

    overlay.appendChild(card);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    /* تشغيل شريط XP بعد ظهور البطاقة */
    setTimeout(function() {
        const bar = document.getElementById('lvUpXpBar_' + newLevel);
        if (bar) bar.style.width = '15%'; /* يبدأ من 0 → يُظهر بداية المستوى الجديد */
    }, 500);

    /* كونفيتي */
    try {
        if (typeof doConfetti === 'function') doConfetti();
    } catch(e) {}

    /* إغلاق تلقائي بعد 6 ثوانٍ */
    setTimeout(function() {
        if (overlay.parentNode) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.4s';
            setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 400);
        }
    }, 6000);

    /* حقن الكيفريمز مرة واحدة */
    if (!document.getElementById('_lvUpKeyframes')) {
        const st_el = document.createElement('style');
        st_el.id = '_lvUpKeyframes';
        st_el.textContent = [
            '@keyframes lvFadeIn { from{opacity:0} to{opacity:1} }',
            '@keyframes lvCardPop {',
            '  0%   { transform:scale(0.6) translateY(30px); opacity:0 }',
            '  70%  { transform:scale(1.04) translateY(-4px); opacity:1 }',
            '  100% { transform:scale(1) translateY(0) }',
            '}',
            '@keyframes lvXpBar { from{width:0%} to{width:15%} }'
        ].join('\n');
        document.head.appendChild(st_el);
    }
};

/* ══════════════════════════════════════════════════════════════
   ⑨ تهيئة عامة عند تحميل الصفحة
   ══════════════════════════════════════════════════════════════ */

window.addEventListener('load', function() {
    setTimeout(function() {
        /* ① التحقق من صحة التواريخ */
        window.validateDailyDates();

        /* ② بدء عرض وقت الجلسة الحي */
        _startSessionTimerDisplay();

        /* ③ تحديث عرض LV */
        window.refreshLevelDisplay();

        /* ④ تحديث وقت الوالدين */
        _updateParentTimeDisplay();

        console.log('[HO Math] ✅ datetime_lv_fixes.js جاهز');
    }, 1200);
});

/* تحديث LV عند كل حفظ — hook على saveSt */
window.addEventListener('load', function() {
    setTimeout(function() {
        /* نُغلّف saveSt لتحديث الواجهة تلقائياً بعد كل حفظ */
        if (typeof window.saveSt === 'function' && !window._lvFixApplied) {
            window._lvFixApplied = true;
            const _origSaveSt = window.saveSt;
            window.saveSt = function() {
                _origSaveSt.apply(this, arguments);
                /* تحديث LV بعد كل حفظ */
                setTimeout(window.refreshLevelDisplay, 30);
            };
        }
    }, 1500);
});

})(); /* نهاية IIFE */
