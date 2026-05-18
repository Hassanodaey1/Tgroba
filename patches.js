/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features v9
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

/* ═══ 2. الإعدادات الرئيسية — تعمل فقط من الرئيسية والملف الشخصي ═══ */
function openMainSettings() {
    const overlay = document.getElementById('gameOverlay');
    if (overlay && overlay.classList.contains('active')) return;

    try { initSettingsDateSelectors(); } catch(e) {}

    const inName = document.getElementById('settingsInputName');
    if (inName) inName.value = st.name || '';

    if (st.birthDate) {
        const parts = st.birthDate.split('-');
        if (parts.length === 3) {
            const sd = document.getElementById('settingsBirthDay');
            const sm = document.getElementById('settingsBirthMonth');
            const sy = document.getElementById('settingsBirthYear');
            if (sy) sy.value = parseInt(parts[0]);
            if (sm) sm.value = parseInt(parts[1]);
            if (sd) sd.value = parseInt(parts[2]);
        }
    }

    updateSettingsDarkToggle();
    updateSettingsThemeDots();
    openSheet('mainSettingsSheet');
    playSound('click');
}

function closeMainSettings() {
    closeSheet('mainSettingsSheet');
}

function saveMainSettings() {
    const inName = document.getElementById('settingsInputName');
    let name = inName ? inName.value.trim().replace(/[^a-zA-Z0-9 ]/g, '') : '';
    if (!name) { showFeedback('الاسم لا يمكن أن يكون فارغاً'); return; }
    if (name.length > 30) name = name.slice(0, 30);
    st.name = name;

    const sd = document.getElementById('settingsBirthDay');
    const sm = document.getElementById('settingsBirthMonth');
    const sy = document.getElementById('settingsBirthYear');
    if (sd && sm && sy) {
        const y = sy.value, mo = String(sm.value).padStart(2,'0'), d = String(sd.value).padStart(2,'0');
        st.birthDate = `${y}-${mo}-${d}`;
        st.age = calculateAgeFromBirthDate(st.birthDate);
    }

    if (!st.serialNumber) {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
    }

    saveSt();
    updateUI();
    loadProfileForm();
    updateSerialNumberDisplay();
    closeMainSettings();
    showFeedback('تم حفظ الإعدادات');
}

function updateSettingsDarkToggle() {
    const icon = document.getElementById('settingsDarkIcon');
    const label = document.getElementById('settingsDarkLabel');
    if (icon) icon.textContent = st.darkMode ? '🌙' : '☀️';
    if (label) label.textContent = st.darkMode ? 'داكن' : 'فاتح';
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    updateSettingsDarkToggle();
    const icon2 = document.getElementById('darkLightIcon');
    const label2 = document.getElementById('darkLightLabel');
    if (icon2) icon2.textContent = st.darkMode ? '🌙' : '☀️';
    if (label2) label2.textContent = st.darkMode ? 'داكن' : 'فاتح';
    playSound('click');
}

function updateSettingsThemeDots() {
    const dots = document.querySelectorAll('.settings-theme-dot');
    dots.forEach(d => {
        d.classList.toggle('active', d.dataset.gold === st.tGold);
    });
}

function applySettingsTheme(el, gold, accent, accent2) {
    document.querySelectorAll('.settings-theme-dot').forEach(d => d.classList.remove('active'));
    if (el) el.classList.add('active');
    /* setTheme يتوقع عنصر DOM كأول معامل أو null */
    const dummy = { classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
    setTheme(dummy, gold, accent, accent2);
    updateSettingsThemeDots();
}

/* ═══ 3. إعدادات اللعبة السريعة (داخل اللعبة فقط) ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
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

/* ═══ 4. تهيئة الألقاب بعد التحميل ═══ */
function initTitlesSystem() {
    try { checkSeasonReset(); } catch (e) {}
    try { renderProfileTitles(); } catch (e) {}
}

/* ═══ 5. toggleBgMusicInGame ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic();
    const el = document.getElementById('gbgMusicStatus');
    if (el) el.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
}

/* ═══ 6. toggleVibration ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    ['vibrationStatus', 'gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(st.vibrationStrength || 30);
    saveSt();
    playSound('click');
}

/* ═══ 7. تهيئة محددات تاريخ نافذة الإعدادات الرئيسية ═══ */
function initSettingsDateSelectors() {
    const daySel = document.getElementById('settingsBirthDay');
    const monthSel = document.getElementById('settingsBirthMonth');
    const yearSel = document.getElementById('settingsBirthYear');
    if (!daySel) return;
    daySel.innerHTML = '';
    monthSel.innerHTML = '';
    yearSel.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        daySel.appendChild(opt);
    }
    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        monthSel.appendChild(opt);
    }
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        yearSel.appendChild(opt);
    }
}

/* ═══ 8. الرقم التسلسلي في نافذة الإعدادات ═══ */

function updateSettingsSerialDisplay() {
    const el = document.getElementById('settingsSerialDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ التغييرات أولاً لتوليد الرقم';
}

function copySettingsSerial() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد — احفظ التغييرات أولاً'); return; }
    navigator.clipboard.writeText(st.serialNumber).then(() => {
        showFeedback('📋 تم نسخ الرقم التسلسلي');
    }).catch(() => {
        showFeedback('📋 ' + st.serialNumber);
    });
}

function toggleSettingsRestorePanel() {
    const panel = document.getElementById('settingsRestorePanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function restoreFromSettings() {
    const input = document.getElementById('settingsRestoreInput');
    const serial = input ? input.value.trim() : '';
    if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
    const savedData = loadSerialBackup(serial);
    if (!savedData) { showFeedback('⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
    Object.assign(st, sanitizeState(savedData));
    saveSt();
    updateUI();
    loadProfileForm();
    applyDarkMode();
    updateSettingsSerialDisplay();
    if (input) input.value = '';
    const panel = document.getElementById('settingsRestorePanel');
    if (panel) panel.style.display = 'none';
    showFeedback('✅ تم استعادة الحساب');
}

/* تحديث عرض الرقم التسلسلي عند فتح الإعدادات */
const _origOpenMainSettings = openMainSettings;
openMainSettings = function() {
    _origOpenMainSettings();
    updateSettingsSerialDisplay();
};

/* تحديث عرض الرقم بعد الحفظ */
const _origSaveMainSettings = saveMainSettings;
saveMainSettings = function() {
    _origSaveMainSettings();
    updateSettingsSerialDisplay();
};

/* ═══ الجديد: فتح صفحة الإعدادات مباشرة في شريط التنقل ═══ */
/* نضمن أن goTab('settings') يعمل ويعرض الصفحة الصحيحة */

/* openGlobalSettings — للأزرار القديمة في الكود */
function openGlobalSettings() {
    goTab('settings');
    playSound('click');
}
window.openGlobalSettings = openGlobalSettings;

/* updateSerialNumberDisplay — يحدث العرض في صفحة الإعدادات */
const _origUpdateSerial = typeof updateSerialNumberDisplay === 'function'
    ? updateSerialNumberDisplay : function(){};
updateSerialNumberDisplay = function() {
    try { _origUpdateSerial(); } catch(e) {}
    const el = document.getElementById('serialNumberDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ الملف الشخصي أولاً';
};

/* إخفاء زر الإعدادات العلوي دائماً */
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('mainSettingsBtn');
    if (btn) btn.style.display = 'none';
});
setTimeout(function() {
    const btn = document.getElementById('mainSettingsBtn');
    if (btn) btn.style.display = 'none';
}, 500);

/* ═══ showRestoreAccount — توافق مع الكود القديم ═══ */
function showRestoreAccount() {
    const panel = document.getElementById('restorePanel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}
window.showRestoreAccount = showRestoreAccount;
