/* ═══════════════════════════════════════════════════════════════
   HO Math v11 — FIXES & INIT (Unified)
   إصلاح جميع الدوال المفقودة + تهيئة التطبيق
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ─── مستوى الصوت ─── */
function initVolumeSliders() {
    if (typeof st.soundVolume !== 'number') st.soundVolume = 80;
    if (typeof st.bgVolume !== 'number') st.bgVolume = 60;
    ['soundVolSlider','gSoundVolSlider','sheetSoundVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = st.soundVolume; });
    ['bgVolSlider','gBgVolSlider','sheetBgVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = st.bgVolume; });
    ['soundVolVal','gSoundVolVal','sheetSoundVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = st.soundVolume + '%'; });
    ['bgVolVal','gBgVolVal','sheetBgVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = st.bgVolume + '%'; });
    if (typeof st.vibrationStrength !== 'number') st.vibrationStrength = 30;
    ['vibVolSlider','sheetVibVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = st.vibrationStrength; });
    ['vibVolVal','sheetVibVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = st.vibrationStrength + 'ms'; });
}
function setSoundVolume(val) {
    st.soundVolume = parseInt(val);
    ['soundVolVal','gSoundVolVal','sheetSoundVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = val + '%'; });
    ['soundVolSlider','gSoundVolSlider','sheetSoundVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = val; });
    saveSt();
}
function setBgVolume(val) {
    st.bgVolume = parseInt(val);
    ['bgVolVal','gBgVolVal','sheetBgVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = val + '%'; });
    ['bgVolSlider','gBgVolSlider','sheetBgVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = val; });
    saveSt();
}
function setVibrationStrength(val) {
    st.vibrationStrength = parseInt(val);
    ['vibVolVal','sheetVibVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = val + 'ms'; });
    ['vibVolSlider','sheetVibVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = val; });
    saveSt();
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(parseInt(val));
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
function _autoGenerateSerial() {
    if (!st.serialNumber) {
        st.serialNumber = generateSerialNumber(st.birthDate || '2000-01-01', st.name || 'Player');
        saveSt();
    }
    ['serialNumberDisplay','settingsSerialDisplay','settingsPageSerialDisplay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.serialNumber;
    });
}

/* ─── إصلاح: ربط أزرار الإجابة بـ checkAnswer ─── */
function _fixAnswerButtons() {
    document.querySelectorAll('.answer-btn').forEach(btn => {
        const fresh = btn.cloneNode(true);
        fresh.addEventListener('click', function() { if (!this.disabled) checkAnswer(this); });
        btn.parentNode.replaceChild(fresh, btn);
    });
}

/* ─── إصلاح: ضمان عمل جميع أزرار اللعبة ─── */
function _fixGameButtons() {
    const quitBtn = document.getElementById('quitBtn');
    if (quitBtn && !quitBtn._fixed) { quitBtn.addEventListener('click', confirmQuit); quitBtn._fixed = true; }
    const gameSetBtn = document.getElementById('gameSettingsBtn');
    if (gameSetBtn && !gameSetBtn._fixed) { gameSetBtn.addEventListener('click', openGameSettingsAndPause); gameSetBtn._fixed = true; }
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn && !playAgainBtn._fixed) { playAgainBtn.addEventListener('click', playAgain); playAgainBtn._fixed = true; }
    const goHomeBtn = document.getElementById('goHomeBtn');
    if (goHomeBtn && !goHomeBtn._fixed) { goHomeBtn.addEventListener('click', goHome); goHomeBtn._fixed = true; }
}

/* ─── إصلاح: ربط بطاقات الألعاب ─── */
function _fixPlayCards() {
    const fixes = [
        { id: 'playCardCounter', fn: () => openOpSheet('counter', true) },
        { id: 'playCardChallenges', fn: () => openOpSheet('challenges') },
        { id: 'playCardTraining', fn: () => openTrainingOpSheet() },
        { id: 'gcardAdvanced', fn: () => openAdvancedGame() },
        { id: 'gcardLaws', fn: () => openLawsGame() },
    ];
    fixes.forEach(({ id, fn }) => {
        const el = document.getElementById(id);
        if (el && !el._fixed && !el.classList.contains('locked')) {
            el.addEventListener('click', fn);
            el._fixed = true;
        }
    });
}

/* ═══════════════════════════════════════════════════
   APP INIT — runs after all functions defined
═══════════════════════════════════════════════════ */
(function initApp() {
    try { initDateSelectors(); } catch(e) { console.warn('initDateSelectors', e); }
    try { initSettingsDateSelectors(); } catch(e) {}
    try { checkDailyReset(); } catch(e) {}
    try { applyTheme(); } catch(e) {}
    try { applyDarkMode(); } catch(e) {}
    try { updateUI(); } catch(e) { console.warn('updateUI', e); }
    try { loadProfileForm(); } catch(e) {}
    try { initVolumeSliders(); } catch(e) {}
    try { if (typeof applyProfilePhoto === 'function') applyProfilePhoto(); } catch(e) {}
    ['vibrationStatus','gVibrationStatus'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ'; });
    (function() {
        const chips = document.querySelectorAll('.diff-chip');
        chips.forEach(c => c.classList.remove('active'));
        const diffMap = { medium: 'diffMedium', hard: 'diffHard', genius: 'diffGenius' };
        const tid = diffMap[st.difficulty];
        if (tid) { const dc = document.getElementById(tid); if (dc && !dc.classList.contains('locked')) { dc.classList.add('active'); return; } }
        if (chips[0]) chips[0].classList.add('active');
    })();
    try { updSessionTimer(); } catch(e) {}
    try { updCountdown(); } catch(e) {}
    try { updateStreakBanner(); } catch(e) {}
    try { _autoGenerateSerial(); } catch(e) {}
    try { updateSerialNumberDisplay(); } catch(e) {}
    try { applyCompetitionButtonTheme(); } catch(e) {}
    try { _fixGameButtons(); } catch(e) {}
    try { _fixPlayCards(); } catch(e) {}
    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) { ss.classList.add('hidden'); setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
        try { checkDailyLoginReward(); } catch(e) {}
        try { checkLootbox(); } catch(e) {}
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch(e) {}
        try { updateUnlocks(); } catch(e) {}
        try { if (typeof updatePeriodStats === 'function') updatePeriodStats(); } catch(e) {}
        try { if (typeof renderChallengeTasks === 'function') renderChallengeTasks(); } catch(e) {}
    }, 2800);
    document.addEventListener('touchstart', function() { gACtx(); if (aCtx && aCtx.state === 'suspended') aCtx.resume(); }, { once: true });
    if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./service-worker.js').catch(()=>{}); }); }
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay && typeof MutationObserver !== 'undefined') {
        const obs = new MutationObserver(() => { try { _fixAnswerButtons(); } catch(e) {} });
        obs.observe(gameOverlay, { childList: true, subtree: true });
        window._answerObserver = obs;
    }
})();

function applyCompetitionButtonTheme() {
    const navLB = document.getElementById('nav-leaderboard');
    if (!navLB) return;
    const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#f0b90b';
    navLB.style.setProperty('--nav-active-color', gold);
}
function updateHomeDailyCountdown() {
    const el = document.getElementById('homeDailyCountdown');
    if (!el) return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
setInterval(updateHomeDailyCountdown, 1000);
document.addEventListener('DOMContentLoaded', function() { setTimeout(function() { const sc = document.getElementById('storeCoinsDisplay'); if (sc && typeof st !== 'undefined') sc.textContent = st.coins || 0; }, 3000); });
