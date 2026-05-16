/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إيقاف/استئناف مؤقت اللعبة ═══ */
var _gamePaused = false;
var _pausedTimeLeft = 0;

function pauseGameTimer() {
    if (!G || G.ended || !G.hasTimer) return;
    if (_gamePaused) return;
    _gamePaused = true;
    _pausedTimeLeft = G.timeLeft;
    clearGameTimer();
}

function resumeGameTimer() {
    if (!_gamePaused) return;
    _gamePaused = false;
    if (!G || G.ended || !G.hasTimer) return;
    G.timeLeft = _pausedTimeLeft;
    G.timer = setInterval(function () {
        G.timeLeft--;
        if (G.timeLeft <= 0) {
            clearGameTimer();
            endGame();
        } else {
            var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            var bar = document.getElementById('timerBar');
            if (bar) {
                bar.style.width = pct + '%';
                if (pct < 25) bar.classList.add('danger');
                else bar.classList.remove('danger');
            }
            var bt = document.getElementById('bigTimer');
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                if (G.timeLeft <= 5) bt.classList.add('danger');
                else bt.classList.remove('danger');
            }
        }
    }, 1000);
}

/**
 * يفتح إعدادات اللعبة السريعة ويوقف مؤقت اللعبة.
 * يعمل من داخل اللعبة وخارجها.
 */
function openGameSettingsAndPause() {
    pauseGameTimer();
    /* مزامنة حالة الأصوات */
    ['gsoundStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    });
    ['gbgMusicStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    });
    const gSV = document.getElementById('gSoundVolSlider');
    if (gSV) gSV.value = st.soundVolume || 80;
    const gSVV = document.getElementById('gSoundVolVal');
    if (gSVV) gSVV.textContent = (st.soundVolume || 80) + '%';
    const gBV = document.getElementById('gBgVolSlider');
    if (gBV) gBV.value = st.bgVolume || 60;
    const gBVV = document.getElementById('gBgVolVal');
    if (gBVV) gBVV.textContent = (st.bgVolume || 60) + '%';
    /* مزامنة حالة الاهتزاز */
    const vibStat = document.getElementById('gVibrationStatus');
    if (vibStat) vibStat.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    openSheet('gameSettingsSheet');
}

function closeGameSettingsAndResume() {
    closeSheet('gameSettingsSheet');
    resumeGameTimer();
}

function sheetBgAndResume(e, id) {
    if (e.target.id === id) {
        closeSheet(id);
        resumeGameTimer();
    }
}

/**
 * زر الإعدادات العالمي — يعمل من أي صفحة.
 * إذا كانت اللعبة نشطة يفتح إعدادات اللعبة السريعة،
 * وإلا يذهب لصفحة الإعدادات.
 */
function openGlobalSettings() {
    const overlay = document.getElementById('gameOverlay');
    if (overlay && overlay.classList.contains('active')) {
        openGameSettingsAndPause();
    } else {
        /* فتح إعدادات اللعبة السريعة من أي صفحة */
        openGameSettingsAndPause();
    }
}

/* ═══ 2. تهيئة الألقاب بعد التحميل ═══ */
function initTitlesSystem() {
    try { checkSeasonReset(); } catch (e) {}
    try { renderProfileTitles(); } catch (e) {}
}

/* ═══ 3. toggleBgMusicInGame — تبديل الموسيقى داخل الإعدادات السريعة ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic();
    /* تحديث مؤشر الإعدادات السريعة */
    const el = document.getElementById('gbgMusicStatus');
    if (el) el.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
}

/* ═══ 4. toggleVibration الكامل ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    ['vibrationStatus', 'gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(30);
    saveSt();
    playSound('click');
}
