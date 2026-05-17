/* ═══════════════════════════════════════════════════
   HO Math v10 — Patches & Glue
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إيقاف/استئناف المؤقت ═══ */
var _gamePaused = false, _pausedTimeLeft = 0;

function pauseGameTimer() {
    if (!G || G.ended || !G.hasTimer || _gamePaused) return;
    _gamePaused = true; _pausedTimeLeft = G.timeLeft;
    clearGameTimer();
}

function resumeGameTimer() {
    if (!_gamePaused || !G || G.ended || !G.hasTimer) return;
    _gamePaused = false;
    G.timeLeft = _pausedTimeLeft;
    G.timer = setInterval(() => {
        G.timeLeft--;
        if (G.timeLeft <= 0) { clearGameTimer(); endGame(); }
        else { updateTimerDisplay(); }
    }, 1000);
}

/* ═══ 2. الإعدادات الرئيسية ═══ */
function openMainSettings() {
    const overlay = document.getElementById('gameOverlay');
    if (overlay?.classList.contains('active')) return;
    try { initSettingsDateSelectors(); } catch(e) {}
    const inName = document.getElementById('settingsInputName');
    if (inName) inName.value = st.name || '';
    if (st.birthDate) {
        const [y,mo,d] = st.birthDate.split('-');
        const sd = document.getElementById('settingsBirthDay');
        const sm = document.getElementById('settingsBirthMonth');
        const sy = document.getElementById('settingsBirthYear');
        if (sy) sy.value = parseInt(y);
        if (sm) sm.value = parseInt(mo);
        if (sd) sd.value = parseInt(d);
    }
    updateSettingsDarkToggle();
    updateSettingsThemeDots();
    updateSettingsSerialDisplay();
    openSheet('mainSettingsSheet');
    playSound('click');
}

function closeMainSettings() { closeSheet('mainSettingsSheet'); }

function saveMainSettings() {
    const inName = document.getElementById('settingsInputName');
    let name = inName ? inName.value.trim().replace(/[^a-zA-Z0-9 ]/g,'') : '';
    if (!name) { showFeedback('الاسم لا يمكن أن يكون فارغاً'); return; }
    if (name.length > 30) name = name.slice(0,30);
    st.name = name;
    const sd = document.getElementById('settingsBirthDay');
    const sm = document.getElementById('settingsBirthMonth');
    const sy = document.getElementById('settingsBirthYear');
    if (sd && sm && sy) {
        const y = sy.value, mo = String(sm.value).padStart(2,'0'), d = String(sd.value).padStart(2,'0');
        st.birthDate = `${y}-${mo}-${d}`;
        try { st.age = calculateAgeFromBirthDate(st.birthDate); } catch(e) {}
    }
    if (!st.serialNumber) st.serialNumber = generateSerialNumber(st.birthDate, st.name);
    saveSt(); updateUI(); loadProfileForm(); updateSerialNumberDisplay(); updateSettingsSerialDisplay();
    closeMainSettings();
    showFeedback('✅ تم الحفظ');
}

function updateSettingsDarkToggle() {
    const icon = document.getElementById('settingsDarkIcon');
    const label = document.getElementById('settingsDarkLabel');
    if (icon) icon.textContent = st.darkMode ? '🌙' : '☀️';
    if (label) label.textContent = st.darkMode ? 'داكن' : 'فاتح';
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode; saveSt(); applyDarkMode(); updateSettingsDarkToggle();
    const i2 = document.getElementById('darkLightIcon'); if (i2) i2.textContent = st.darkMode ? '🌙' : '☀️';
    const l2 = document.getElementById('darkLightLabel'); if (l2) l2.textContent = st.darkMode ? 'داكن' : 'فاتح';
    playSound('click');
}

function updateSettingsThemeDots() {
    document.querySelectorAll('.settings-theme-dot').forEach(d => d.classList.toggle('active', d.dataset.gold === st.tGold));
}

function applySettingsTheme(el, gold, accent, accent2) {
    document.querySelectorAll('.settings-theme-dot').forEach(d => d.classList.remove('active'));
    if (el) el.classList.add('active');
    document.documentElement.style.setProperty('--gold', gold);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent2', accent2);
    st.tGold = gold; st.tAccent = accent; st.tAccent2 = accent2;
    saveSt(); playSound('click');
}

function updateSettingsSerialDisplay() {
    const el = document.getElementById('settingsSerialDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ التغييرات أولاً';
}

function copySettingsSerial() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد'); return; }
    navigator.clipboard.writeText(st.serialNumber).catch(() => {});
    showFeedback('📋 تم النسخ!');
}

function toggleSettingsRestorePanel() {
    const p = document.getElementById('settingsRestorePanel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function restoreFromSettings() {
    const input = document.getElementById('settingsRestoreInput');
    const serial = input ? input.value.trim() : '';
    if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
    const data = loadSerialBackup(serial);
    if (!data) { showFeedback('⚠️ لم يُعثر على حساب'); return; }
    Object.assign(st, sanitizeState(data));
    saveSt(); updateUI(); loadProfileForm(); applyDarkMode(); updateSettingsSerialDisplay();
    if (input) input.value = '';
    const p = document.getElementById('settingsRestorePanel'); if (p) p.style.display = 'none';
    closeMainSettings();
    showFeedback('✅ تم الاستعادة');
}

/* ═══ 3. إعدادات داخل اللعبة ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
    const gSV = document.getElementById('gSoundVolSlider'); if (gSV) gSV.value = st.soundVolume||80;
    const gSVV = document.getElementById('gSoundVolVal'); if (gSVV) gSVV.textContent = (st.soundVolume||80)+'%';
    const gBV = document.getElementById('gBgVolSlider'); if (gBV) gBV.value = st.bgVolume||60;
    const gBVV = document.getElementById('gBgVolVal'); if (gBVV) gBVV.textContent = (st.bgVolume||60)+'%';
    ['gsoundStatus'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent=st.soundOn?'مفعّل':'مطفأ'; });
    ['gbgMusicStatus'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent=st.bgOn?'مفعّلة':'مطفأة'; });
    const vib = document.getElementById('gVibrationStatus'); if (vib) vib.textContent = st.vibrationOn?'مفعّل':'مطفأ';
    openSheet('gameSettingsSheet');
}

function closeGameSettingsAndResume() { closeSheet('gameSettingsSheet'); resumeGameTimer(); }
function sheetBgAndResume(e, id) { if (e.target.id === id) { closeSheet(id); resumeGameTimer(); } }

/* ═══ 4. مكملات ═══ */
function initTitlesSystem() {
    try { checkSeasonReset(); } catch(e) {}
    try { renderProfileTitles(); } catch(e) {}
}

function toggleBgMusicInGame() {
    toggleBgMusic();
    const el = document.getElementById('gbgMusicStatus'); if (el) el.textContent = st.bgOn?'مفعّلة':'مطفأة';
}

function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    ['vibrationStatus','gVibrationStatus'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent=st.vibrationOn?'مفعّل':'مطفأ'; });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(30);
    saveSt(); playSound('click');
}

function initSettingsDateSelectors() {
    const daySel = document.getElementById('settingsBirthDay');
    const monthSel = document.getElementById('settingsBirthMonth');
    const yearSel = document.getElementById('settingsBirthYear');
    if (!daySel) return;
    daySel.innerHTML = ''; monthSel.innerHTML = ''; yearSel.innerHTML = '';
    for (let i=1;i<=31;i++) { const o=document.createElement('option'); o.value=i; o.textContent=i; daySel.appendChild(o); }
    for (let i=1;i<=12;i++) { const o=document.createElement('option'); o.value=i; o.textContent=i; monthSel.appendChild(o); }
    const cy = (new Date()).getFullYear();
    for (let i=cy-100;i<=cy;i++) { const o=document.createElement('option'); o.value=i; o.textContent=i; yearSel.appendChild(o); }
}

/* ═══ 5. تحديث بطاقات الصفحة الرئيسية ═══ */
function updateHomeNewModes() {
    const flashStat = document.getElementById('flashCatStats');
    if (flashStat) flashStat.textContent = 'أفضل: ' + (st.flashBestScore||0);
    const memStat = document.getElementById('memoryCatStats');
    if (memStat) memStat.textContent = 'أفضل: ' + (st.memoryBestScore||0);
    const svStat = document.getElementById('survivalCatStats');
    if (svStat) svStat.textContent = 'أفضل: ' + (st.survivalBestScore||0);
    /* بطاقات صفحة اللعب */
    const fl = document.getElementById('flashBestInCard'); if (fl) fl.textContent = st.flashBestScore||0;
    const mm = document.getElementById('memoryBestInCard'); if (mm) mm.textContent = st.memoryBestScore||0;
    const sv = document.getElementById('survivalBestInCard'); if (sv) sv.textContent = st.survivalBestScore||0;
    /* متجر المهارات */
    const sc = document.getElementById('skillsShopCoins'); if (sc) sc.textContent = st.coins||0;
}

/* ═══ 6. التحدي الأسبوعي — مكافأة عند الإتمام ═══ */
(function patchEndGame() {
    const origEndGame = window.endGame;
    if (!origEndGame) return;
    window.endGame = function() {
        origEndGame.apply(this, arguments);
        if (window._afterWeeklyEnd && G && !st.weeklyChallengeDone) {
            st.weeklyChallengeDone = true;
            st.coins += 10;
            saveSt();
            updateUI();
            showFeedback('🏅 أتممت التحدي الأسبوعي! +10💰');
            window._afterWeeklyEnd = false;
        }
        updateHomeNewModes();
        try { renderSessionSummaries(); } catch(e) {}
    };
})();

/* ═══ 7. تطبيق updateUI الموسّع ═══ */
const _origUpdateUI = typeof updateUI === 'function' ? updateUI : null;
function updateUI() {
    if (_origUpdateUI) _origUpdateUI();
    try { updateHomeNewModes(); } catch(e) {}
}

/* ═══ 8. مهارة درع إضافي عند بدء اللعبة ═══ */
(function patchStartGame() {
    const orig = window.startGameWith;
    if (!orig) { setTimeout(patchStartGame, 500); return; }
    window.startGameWith = function(mode, op, customTable, hasTimer) {
        orig.apply(this, arguments);
        /* مهارة الدرع */
        if (st.skills && st.skills.shield && G) { G.livesLeft = (G.livesLeft||3) + 1; updateHeartsDisplay(); }
        /* مهارة الوقت الإضافي */
        if (st.skills && st.skills.extraTime && G && G.hasTimer) { G.timeLeft = (G.timeLeft||60) + 5; G.maxTime = (G.maxTime||60) + 5; updateTimerDisplay(); }
    };
})();
