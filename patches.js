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
    G.timer = setInterval(function() {
        G.timeLeft--;
        if (G.timeLeft <= 0) {
            clearGameTimer();
            endGame();
        } else {
            var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            var bar = document.getElementById('timerBar');
            if (bar) {
                bar.style.width = pct + '%';
                if (pct < 25) bar.classList.add('danger'); else bar.classList.remove('danger');
            }
            var bt = document.getElementById('bigTimer');
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                if (G.timeLeft <= 5) bt.classList.add('danger'); else bt.classList.remove('danger');
            }
        }
    }, 1000);
}

function openGameSettingsAndPause() {
    pauseGameTimer();
    var gs = document.getElementById('gsoundStatus');
    if (gs) gs.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    var gbg = document.getElementById('gbgMusicStatus');
    if (gbg) gbg.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    var gSV = document.getElementById('gSoundVolSlider'); if (gSV) gSV.value = st.soundVolume || 80;
    var gSVV = document.getElementById('gSoundVolVal'); if (gSVV) gSVV.textContent = (st.soundVolume || 80) + '%';
    var gBV = document.getElementById('gBgVolSlider'); if (gBV) gBV.value = st.bgVolume || 60;
    var gBVV = document.getElementById('gBgVolVal'); if (gBVV) gBVV.textContent = (st.bgVolume || 60) + '%';
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

function openGlobalSettings() {
    var overlay = document.getElementById('gameOverlay');
    if (overlay && overlay.classList.contains('active')) {
        openGameSettingsAndPause();
    } else {
        goTab('settings');
    }
}

/* ═══ 2. تهيئة الألقاب بعد التحميل ═══ */
function initTitlesSystem() {
    try { checkSeasonReset(); } catch(e) {}
    try { renderProfileTitles(); } catch(e) {}
}
