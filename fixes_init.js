/* ═══════════════════════════════════════════════════════════════
   FIXES & INIT — HO Math v8
   إصلاح جميع الدوال المفقودة + تهيئة التطبيق
═══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════
   ✅ FIX: دالة quickPlay — زر "العب الآن" في الصفحة الرئيسية
   تُشغّل آخر وضع لعب محفوظ في st.lastMode
═══════════════════════════════════════════════════════════════ */
window.quickPlay = function() {
    try {
        const mode = (typeof st !== 'undefined' && st.lastMode) ? st.lastMode : 'classic';
        const op   = (typeof st !== 'undefined' && st.lastOp)   ? st.lastOp   : 'mix';
        window._gameSource = 'home';

        if (typeof startGameWith !== 'function') {
            if (typeof showFeedback === 'function') showFeedback('⚠️ جاري التحميل، حاول مجدداً');
            return;
        }

        const noTimer  = ['memory','chain','rocket','survival','daily','weekly'];
        const hasTimer = !noTimer.includes(mode);
        startGameWith(mode, op, null, hasTimer);
    } catch(e) {
        console.error('[quickPlay]', e);
        if (typeof showFeedback === 'function') showFeedback('⚠️ حدث خطأ، حاول مجدداً');
    }
};

/* ─── مستوى الصوت ─── */
function initVolumeSliders() {
    if (typeof st.soundVolume !== 'number') st.soundVolume = 80;
    if (typeof st.bgVolume    !== 'number') st.bgVolume    = 60;
    if (typeof st.vibrationStrength !== 'number') st.vibrationStrength = 30;

    /* subPageAudioOverlay sliders */
    const q = id => document.getElementById(id);
    if (q('soundVolSlider')) q('soundVolSlider').value       = st.soundVolume;
    if (q('soundVolVal'))    q('soundVolVal').textContent    = st.soundVolume + '%';
    if (q('bgVolSlider'))    q('bgVolSlider').value          = st.bgVolume;
    if (q('bgVolVal'))       q('bgVolVal').textContent       = st.bgVolume + '%';
    if (q('vibVolSlider'))   q('vibVolSlider').value         = st.vibrationStrength;
    if (q('vibVolVal'))      q('vibVolVal').textContent      = st.vibrationStrength + 'ms';

    /* gameSettingsSheet sliders — تُزامن دفعة واحدة عبر syncGameSheet */
    try { if (typeof syncGameSheet === 'function') syncGameSheet(); } catch(e) {}
}

function setSoundVolume(val) {
    st.soundVolume = parseInt(val);
    const q = id => document.getElementById(id);
    if (q('soundVolVal'))    q('soundVolVal').textContent    = val + '%';
    if (q('soundVolSlider')) q('soundVolSlider').value       = val;
    if (q('gSoundVolVal'))   q('gSoundVolVal').textContent   = val + '%';
    if (q('gSoundVolSlider')) q('gSoundVolSlider').value     = val;
    saveSt();
}

function setBgVolume(val) {
    st.bgVolume = parseInt(val);
    const q = id => document.getElementById(id);
    if (q('bgVolVal'))    q('bgVolVal').textContent    = val + '%';
    if (q('bgVolSlider')) q('bgVolSlider').value       = val;
    if (q('gBgVolVal'))   q('gBgVolVal').textContent   = val + '%';
    if (q('gBgVolSlider')) q('gBgVolSlider').value     = val;
    saveSt();
}

function setVibrationStrength(val) {
    st.vibrationStrength = parseInt(val);
    const el = document.getElementById('vibVolVal');
    if (el) el.textContent = val + 'ms';
    const sl = document.getElementById('vibVolSlider');
    if (sl) sl.value = val;
    saveSt();
    /* اهتزاز تجريبي */
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(parseInt(val));
}

/* ─── مكافأة يومية ─── */
function checkDailyLoginBonus() {
    const today = todayStr();
    /* ✅ FIX-DOUBLE-BONUS: استخدام نفس المفتاح المستخدم في game.js (loginBonusDate) لمنع المكافأة المزدوجة */
    if (st.loginBonusDate === today) return;
    /* إذا كان التاريخ المخزّن في المستقبل (تلاعب بالساعة) → نتجاهل ونُحدّث فقط */
    if (st.loginBonusDate && st.loginBonusDate > today) {
        st.loginBonusDate = today; saveSt(); return;
    }
    /* لا نعطي المكافأة هنا — تُعطى بالفعل من updateDailyShield في game.js */
    /* هذه الدالة تبقى فقط للتحقق من الصحة وعدم التكرار */
    saveSt();
}

/* ─── عداد السلسلة اليومية ─── */
function updateStreakBanner() {
    const el = document.getElementById('streakBannerVal');
    if (el) el.textContent = st.dailyStreak || 0;
}

/* ─── الرقم التسلسلي ─── */
function generateAndShowSerial() {
    if (!st.serialNumber) {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
        saveSt();
    }
    updateSerialNumberDisplay();
    showFeedback('🔢 تم إنشاء الرقم التسلسلي');
}

/* ═══════════════════════════════════════════════════
   APP INIT — runs after all functions defined
═══════════════════════════════════════════════════ */
(function initApp() {
    try { initDateSelectors(); } catch (e) { console.warn('initDateSelectors', e); }
    /* إظهار زر الإعدادات فقط في الصفحات المسموح بها */
    try {
        const settingsBtn = document.getElementById('mainSettingsBtn');
        if (settingsBtn) settingsBtn.style.display = 'flex'; // الصفحة الرئيسية هي الافتراضية
    } catch(e) {}
    try { checkDailyReset(); } catch (e) {}
    try { applyTheme(); } catch (e) {}
    try { applyDarkMode(); } catch (e) {}
    try { updateUI(); } catch (e) { console.warn('updateUI', e); }
    try { loadProfileForm(); } catch (e) {}
    try { initVolumeSliders(); } catch (e) {}
    try { if (typeof applyProfilePhoto === 'function') applyProfilePhoto(); } catch (e) {}

    /* الاهتزاز */
    ['vibrationStatus', 'gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });

    /* ✅ FIX-DIFF-INIT: رقائق الصعوبة — يدعم easy/medium/hard/genius/auto */
    (function () {
        const chips = document.querySelectorAll('.diff-chip');
        chips.forEach(c => c.classList.remove('active'));
        const diffMap = {
            easy:   'diffEasy',
            medium: 'diffMedium',
            hard:   'diffHard',
            genius: 'diffGenius',
            auto:   'diffAuto'
        };
        const d   = st.difficulty || 'easy';
        const tid = diffMap[d];
        if (tid) {
            const dc = document.getElementById(tid);
            if (dc && !dc.classList.contains('locked') && !dc.classList.contains('diff-locked')) {
                dc.classList.add('active');
                return;
            }
        }
        /* إذا كان 'auto' واللاعب جديد → نُفعّل auto ولا نُغيّر st.difficulty */
        if (d === 'auto') {
            const autoEl = document.getElementById('diffAuto');
            if (autoEl) { autoEl.classList.add('active'); return; }
        }
        /* افتراضي: سهل */
        st.difficulty = 'easy';
        const easyEl = document.getElementById('diffEasy');
        if (easyEl) easyEl.classList.add('active');
        else if (chips[0]) chips[0].classList.add('active');
    })();

    try { updSessionTimer(); } catch (e) {}
    try { updCountdown(); } catch (e) {}
    try { updateStreakBanner(); } catch (e) {}
    try { updateSerialNumberDisplay(); } catch (e) {}

    /* تطبيق لون زر المنافسة حسب الثيم */
    try { applyCompetitionButtonTheme(); } catch (e) {}

    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });

    /* ✅ تهيئة المتجر عند التحميل — shop.js يُحمَّل بعدنا */
    window.addEventListener('load', function() {
        setTimeout(function() {
            try { if (typeof renderShop === 'function') renderShop(); } catch(e) {}
        }, 800);
    });

    /* ✅ alias للدالة المفقودة في competition_logic.js */
    window.renderChallengeTasks = function() {
        try { if (typeof renderChallengeDailyTasks === 'function') renderChallengeDailyTasks(); } catch(e) {}
    };

    /* إخفاء شاشة البداية */
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) { ss.classList.add('hidden'); setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
        try { checkDailyLoginBonus(); } catch (e) {}
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch (e) {}
    }, 5200);

    document.addEventListener('touchstart', function () {
        gACtx();
        if (aCtx && aCtx.state === 'suspended') aCtx.resume();
    }, { once: true });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').catch(() => {});
        });
    }
})();

/* ─── تطبيق لون زر المنافسة حسب الثيم المختار ─── */
function applyCompetitionButtonTheme() {
    /* يتم استدعاؤها أيضاً من setTheme */
    const navLB = document.getElementById('nav-leaderboard');
    if (!navLB) return;
    const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#f0b90b';
    navLB.style.setProperty('--nav-active-color', gold);
}
