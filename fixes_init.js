/* ═══════════════════════════════════════════════════════════════
   FIXES & INIT — HO Math v8
   إصلاح جميع الدوال المفقودة + تهيئة التطبيق
═══════════════════════════════════════════════════════════════ */

/* ─── مستوى الصوت ─── */
function initVolumeSliders() {
    if (typeof st.soundVolume !== 'number') st.soundVolume = 80;
    if (typeof st.bgVolume !== 'number') st.bgVolume = 60;
    ['soundVolSlider', 'gSoundVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = st.soundVolume;
    });
    ['bgVolSlider', 'gBgVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = st.bgVolume;
    });
    ['soundVolVal', 'gSoundVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.soundVolume + '%';
    });
    ['bgVolVal', 'gBgVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.bgVolume + '%';
    });
    /* شريط شدة الاهتزاز */
    if (typeof st.vibrationStrength !== 'number') st.vibrationStrength = 30;
    ['vibVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = st.vibrationStrength;
    });
    ['vibVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationStrength + 'ms';
    });
}

function setSoundVolume(val) {
    st.soundVolume = parseInt(val);
    ['soundVolVal', 'gSoundVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = val + '%';
    });
    ['soundVolSlider', 'gSoundVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
    saveSt();
}

function setBgVolume(val) {
    st.bgVolume = parseInt(val);
    ['bgVolVal', 'gBgVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = val + '%';
    });
    ['bgVolSlider', 'gBgVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
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
    if (st._lastLoginBonus === today) return;
    st._lastLoginBonus = today;
    const bonus = Math.min(10, 3 + Math.floor(st.dailyStreak / 3));
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
    try { initSettingsDateSelectors(); } catch (e) {}
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
            if (dc && !dc.classList.contains('locked')) { dc.classList.add('active'); return; }
        }
        if (chips[0]) chips[0].classList.add('active');
    })();

    try { updSessionTimer(); } catch (e) {}
    try { updCountdown(); } catch (e) {}
    try { updateStreakBanner(); } catch (e) {}
    try { updateSerialNumberDisplay(); } catch (e) {}

    /* تهيئة الصفحة الرئيسية مع الإضافات الجديدة */
    try { if (typeof updateHomeDailyStats === 'function') updateHomeDailyStats(); } catch (e) {}
    try { if (typeof renderHomeTasks === 'function') renderHomeTasks(); } catch (e) {}

    /* مزامنة chips الصعوبة في صفحة الألعاب */
    try { if (typeof syncPlayDiffChips === 'function') syncPlayDiffChips(); } catch (e) {}

    /* تهيئة مهام التحدي */
    try { if (typeof getChallengeMissions === 'function') getChallengeMissions(); } catch (e) {}

    /* تطبيق لون زر المنافسة حسب الثيم */
    try { applyCompetitionButtonTheme(); } catch (e) {}

    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });

    /* إخفاء شاشة البداية */
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) { ss.classList.add('hidden'); setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
        try { checkDailyLoginBonus(); } catch (e) {}
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch (e) {}
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
