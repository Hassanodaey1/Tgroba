/* ═══════════════════════════════════════════════════════════════
   FIXES & INIT — HO Math v8
   إصلاح جميع الدوال المفقودة + تهيئة التطبيق
═══════════════════════════════════════════════════════════════ */

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
    /* ✅ FIX-V6: منع إعادة المكافأة بتغيير التاريخ — نتحقق أن اليوم الجديد أكبر من السابق */
    if (st._lastLoginBonus === today) return;
    /* إذا كان التاريخ المخزّن في المستقبل (تلاعب بالساعة) → نتجاهل ونُحدّث فقط */
    if (st._lastLoginBonus && st._lastLoginBonus > today) {
        st._lastLoginBonus = today; saveSt(); return;
    }
    st._lastLoginBonus = today;
    const bonus = Math.min(10, 3 + Math.floor((st.dailyStreak || 0) / 3));
    st.coins += bonus;
    saveSt();
    setTimeout(() => {
        showFeedback(`🎁 مكافأة يومية: +${bonus}💰`);
        doConfetti();
    }, 3500);
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

    /* رقائق الصعوبة */
    (function () {
        const chips = document.querySelectorAll('.diff-chip');
        chips.forEach(c => c.classList.remove('active'));
        const diffMap = { medium: 'diffMedium', hard: 'diffHard', genius: 'diffGenius' };
        const tid = diffMap[st.difficulty];
        if (tid) {
            const dc = document.getElementById(tid);
            /* لا نُفعّل إذا كانت مقفلة (locked أو diff-locked) */
            if (dc && !dc.classList.contains('locked') && !dc.classList.contains('diff-locked')) {
                dc.classList.add('active');
                return;
            }
        }
        /* افتراضي: سهل دائماً */
        st.difficulty = 'easy';
        if (chips[0]) chips[0].classList.add('active');
    })();

    try { updSessionTimer(); } catch (e) {}
    try { updCountdown(); } catch (e) {}
    try { updateStreakBanner(); } catch (e) {}
    try { updateSerialNumberDisplay(); } catch (e) {}

    /* تطبيق لون زر المنافسة حسب الثيم */
    try { applyCompetitionButtonTheme(); } catch (e) {}

    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });

    /* إخفاء شاشة البداية → إظهار Auth أو اللعبة */
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) { ss.classList.add('hidden'); setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch (e) {}
        /* قرار: عرض شاشة Auth أم الدخول مباشرة */
        setTimeout(() => {
            const isReturning = st && st.serialNumber && st.name && st.name !== 'Player';
            const isLoggedIn  = window._authUser != null;
            if (isLoggedIn || isReturning) {
                /* لاعب عائد أو مسجّل دخول → اللعبة مباشرة */
                _launchGame();
            } else {
                /* لاعب جديد → شاشة Auth */
                showAuthScreen();
            }
        }, 550);
    }, 2800);

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
