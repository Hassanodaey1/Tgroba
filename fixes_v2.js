/* ═══════════════════════════════════════════════════════════
   HO Math — ملف الإصلاحات الشامل v2
   يُحمَّل بعد جميع الملفات الأخرى (آخر سكريبت في index.html)
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   الإصلاح 1: زر "العب الآن" — quickPlay()
   ──────────────────────────────────────────────────────────
   المشكلة: الدالة غير موجودة في أي ملف، الزر يرمي خطأ
   الحل: تعريف الدالة مع fallback ذكي للوضع الأخير
══════════════════════════════════════════════════════════ */
window.quickPlay = function() {
    try {
        const mode = (typeof st !== 'undefined' && st.lastMode) ? st.lastMode : 'classic';
        const op   = (typeof st !== 'undefined' && st.lastOp)   ? st.lastOp   : 'mix';

        /* تحديد مصدر اللعبة */
        window._gameSource = 'home';

        /* أوضاع خاصة لها منطق مختلف */
        if (mode === 'daily') {
            if (typeof startGameWith === 'function') startGameWith('daily', 'mix', null, false);
            return;
        }
        if (mode === 'weekly') {
            if (typeof startGameWith === 'function') startGameWith('weekly', 'mix', null, false);
            return;
        }
        if (mode === 'memory') {
            if (typeof startGameWith === 'function') startGameWith('memory', op, null, false);
            return;
        }
        if (mode === 'chain') {
            if (typeof startGameWith === 'function') startGameWith('chain', op, null, false);
            return;
        }
        if (mode === 'sudden') {
            if (typeof startGameWith === 'function') startGameWith('sudden', op, null, true);
            return;
        }
        if (mode === 'rocket') {
            if (typeof startGameWith === 'function') startGameWith('rocket', op, null, false);
            return;
        }

        /* كل الأوضاع الأخرى */
        const timerModes = ['speed', 'frenzy', 'accuracy', 'marathon', 'impossible', 'classic'];
        const forceTimer = timerModes.includes(mode);
        if (typeof startGameWith === 'function') {
            startGameWith(mode, op, null, forceTimer);
        } else {
            console.warn('[quickPlay] startGameWith غير متاحة');
            if (typeof showFeedback === 'function') showFeedback('⚠️ جاري التحميل، حاول مجدداً');
        }
    } catch(e) {
        console.error('[quickPlay] خطأ:', e);
        if (typeof showFeedback === 'function') showFeedback('⚠️ حدث خطأ، حاول مجدداً');
    }
};


/* ══════════════════════════════════════════════════════════
   الإصلاح 2: لوحة الصدارة — تبويب "📊 النقاط"
   ──────────────────────────────────────────────────────────
   المشكلة: showLbTab('general') يقرأ من challenge_leaderboard
            بدلاً من leaderboard (النقاط العامة)
   الحل: استبدال loadCombinedLeaderboard بنسخة مُصلَحة
         تقرأ من المسار الصحيح حسب التبويب المحدد
══════════════════════════════════════════════════════════ */
window.loadCombinedLeaderboard = function() {
    const container = document.getElementById('combinedLeaderboardList');
    if (!container) return;

    if (!window.database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;font-size:0.82em;">⚠️ غير متصل بقاعدة البيانات</div>';
        return;
    }

    container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:0.8em;">⏳ جاري التحميل…</div>';

    const tab = (typeof _activeLbTab !== 'undefined' ? _activeLbTab : null) || 'challenge';

    /* ══ تحديد المسار والحقل حسب التبويب ══ */
    let refPath, scoreKey, headerText;
    if (tab === 'general') {
        refPath    = 'leaderboard';          /* نقاط اللعب العامة */
        scoreKey   = 'bestScore';
        headerText = 'أفضل نقطة';
    } else {
        refPath    = 'challenge_leaderboard'; /* نقاط التحدي */
        scoreKey   = 'challengeScore';
        headerText = 'نقاط التحدي';
    }

    /* تحديث رأس الجدول */
    const headerEl = document.getElementById('lbScoreHeader');
    if (headerEl) headerEl.textContent = headerText;

    try {
        window.database.ref(refPath)
            .orderByChild(scoreKey)
            .limitToLast(50)
            .once('value', function(snapshot) {
                const players = [];
                snapshot.forEach(function(child) {
                    players.push(Object.assign({ id: child.key }, child.val()));
                });
                players.sort(function(a, b) { return (b[scoreKey] || 0) - (a[scoreKey] || 0); });

                /* حفظ في Cache */
                window._lbCache     = players;
                window._lbCacheTime = Date.now();
                window._lbCacheType = tab;

                /* تحديث إحصائياتي في Hero */
                if (typeof updateCompMyStats === 'function') updateCompMyStats(players);

                if (players.length === 0) {
                    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);font-size:0.82em;">لا توجد نتائج بعد — كن الأول! 🚀</div>';
                    return;
                }

                if (typeof renderLeaderboardList === 'function') {
                    renderLeaderboardList(container, players, scoreKey);
                } else {
                    /* fallback renderer */
                    _renderLbFallback(container, players, scoreKey);
                }
            })
            .catch(function() {
                container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--red);font-size:0.8em;">⚠️ فشل التحميل — تحقق من الاتصال</div>';
            });
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--red);font-size:0.8em;">⚠️ خطأ في قاعدة البيانات</div>';
    }
};

/* renderer احتياطي في حال renderLeaderboardList غير موجودة */
function _renderLbFallback(container, players, scoreKey) {
    const medals = ['🥇','🥈','🥉'];
    const myKey  = (typeof st !== 'undefined' && st.serialNumber)
                   ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_')
                   : null;
    let html = '';
    players.forEach(function(p, idx) {
        const isMe = p.id === myKey;
        const rank = idx < 3 ? medals[idx] : (idx + 1);
        html += '<div class="lb-row' + (isMe ? ' lb-row-me' : '') + '">'
            + '<span>' + rank + '</span>'
            + '<span>' + (p.avatar || '🧑') + ' ' + (p.name || 'لاعب') + '</span>'
            + '<span>' + (p.level || 1) + '</span>'
            + '<span style="color:var(--gold);font-weight:900;">' + (p[scoreKey] || 0) + '</span>'
            + '</div>';
    });
    container.innerHTML = html || '<div style="text-align:center;padding:16px;color:var(--text2);">لا توجد نتائج</div>';
}


/* ══════════════════════════════════════════════════════════
   الإصلاح 3: showLbTab — تحديث Cache و header بشكل صحيح
══════════════════════════════════════════════════════════ */
window.showLbTab = function(tab) {
    window._activeLbTab = tab;

    /* تحديث أزرار التبويب */
    document.querySelectorAll('.comp-lb-tab').forEach(function(btn) {
        btn.classList.remove('active');
    });
    var activeBtn = document.getElementById(tab === 'challenge' ? 'lbTabChallenge' : 'lbTabGeneral');
    if (activeBtn) activeBtn.classList.add('active');

    /* هل هناك cache صالح؟ */
    var cacheAge = (typeof _lbCacheTime !== 'undefined') ? (Date.now() - _lbCacheTime) : 99999;
    if (window._lbCache && window._lbCacheType === tab && cacheAge < 60000) {
        var scoreKey = tab === 'challenge' ? 'challengeScore' : 'bestScore';
        var headerEl = document.getElementById('lbScoreHeader');
        if (headerEl) headerEl.textContent = tab === 'challenge' ? 'نقاط التحدي' : 'أفضل نقطة';
        var container = document.getElementById('combinedLeaderboardList');
        if (container) {
            if (typeof renderLeaderboardList === 'function') {
                renderLeaderboardList(container, window._lbCache, scoreKey);
            } else {
                _renderLbFallback(container, window._lbCache, scoreKey);
            }
        }
    } else {
        window.loadCombinedLeaderboard();
    }
};


/* ══════════════════════════════════════════════════════════
   الإصلاح 4: مزامنة نتائج اللعبة العامة مع Firebase
   ──────────────────────────────────────────────────────────
   المشكلة: syncWithLeaderboard تكتب في 'leaderboard' لكن
            loadCombinedLeaderboard كانت تقرأ من challenge_leaderboard
            → تم الإصلاح في الإصلاح 2، لكن نضيف حماية إضافية هنا
   الإضافة: نُطلق مزامنة فورية للنتائج العامة عند نهاية كل لعبة
            (syncWithLeaderboard موجودة في ui.js وتعمل بشكل صحيح)
══════════════════════════════════════════════════════════ */

/* Patch لدالة endChallengeGame: نضمن تحديث لوحة الصدارة بعد المزامنة */
(function patchEndChallengeGame() {
    var _orig = window.endChallengeGame;
    if (typeof _orig !== 'function') return;
    window.endChallengeGame = function() {
        _orig.apply(this, arguments);
        /* بعد 2 ثانية: أعد تحميل لوحة الصدارة لتعكس النتيجة الجديدة */
        setTimeout(function() {
            if (window._activeLbTab === 'challenge' || !window._activeLbTab) {
                window._lbCacheTime = 0; /* أبطل الـ cache */
                if (typeof window.loadCombinedLeaderboard === 'function') {
                    window.loadCombinedLeaderboard();
                }
            }
        }, 2500);
    };
})();


/* ══════════════════════════════════════════════════════════
   الإصلاح 5: تحديث زر "العب الآن" عند تحميل الصفحة
══════════════════════════════════════════════════════════ */
(function initQuickPlayLabel() {
    function _setLabel() {
        var qpl = document.getElementById('quickPlayLabel');
        if (!qpl) return;
        if (typeof st === 'undefined') {
            qpl.textContent = '▶ العب الآن';
            return;
        }
        var modeNames = {
            classic:    'كلاسيك',
            daily:      'تحدي اليوم',
            weekly:     'تحدي الأسبوع',
            speed:      'سرعة',
            frenzy:     'تسارع',
            survival:   'بقاء',
            memory:     'الذاكرة',
            chain:      'السلسلة',
            sudden:     'ضد الساعة',
            rocket:     'الصاروخ',
            accuracy:   'الدقة',
            marathon:   'الماراثون',
            impossible: 'المستحيل',
            fill:       'التكميل'
        };
        var mode     = st.lastMode || 'classic';
        var modeName = modeNames[mode] || mode;
        qpl.textContent = '▶ العب الآن — ' + modeName;
    }

    /* تشغيل بعد اكتمال تحميل كل الـ scripts */
    if (document.readyState === 'complete') {
        _setLabel();
    } else {
        window.addEventListener('load', _setLabel);
    }
})();


/* ══════════════════════════════════════════════════════════
   الإصلاح 6: حماية إضافية — التأكد من اتصال initCompetitionPage
              بالسيرفر عند فتح صفحة المنافسة
══════════════════════════════════════════════════════════ */
(function patchInitCompetitionPage() {
    var _orig = window.initCompetitionPage;
    window.initCompetitionPage = function() {
        /* تشغيل النسخة الأصلية أولاً */
        if (typeof _orig === 'function') _orig.apply(this, arguments);

        /* إبطال الـ cache لضمان بيانات حديثة من السيرفر */
        window._lbCache     = null;
        window._lbCacheTime = 0;
        window._lbCacheType = null;

        /* تعيين التبويب النشط لـ challenge إذا لم يكن محدداً */
        if (!window._activeLbTab) window._activeLbTab = 'challenge';

        /* تحميل لوحة الصدارة بشكل صريح */
        setTimeout(function() {
            window.loadCombinedLeaderboard();
        }, 100);
    };
})();


/* ══════════════════════════════════════════════════════════
   تأكيد التحميل في وحدة التحكم
══════════════════════════════════════════════════════════ */
console.log('[HO Math fixes_v2] ✅ تم تحميل جميع الإصلاحات:',
    '1- quickPlay() ✓',
    '2- لوحة الصدارة العامة ✓',
    '3- showLbTab المُصلَحة ✓',
    '4- مزامنة Firebase ✓',
    '5- تسمية زر العب الآن ✓',
    '6- initCompetitionPage ✓'
);
