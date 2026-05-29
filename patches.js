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

/* ═══ 2. إعدادات رئيسية — stub للتوافق مع كود قديم ═══ */
/* openMainSettings و closeMainSettings و saveMainSettings
   لم تعد تفتح sheet منفصل — الإعدادات الآن في page-settings مباشرة.
   هذه الدوال stub لمنع أي أخطاء إن استُدعيت من مكان قديم. */
function openMainSettings()  { goTab && goTab('settings'); }
function closeMainSettings() { /* لا شيء */ }
function saveMainSettings()  { /* لا شيء — الحفظ يتم عبر saveProfile */ }

/* دوال الثيمات — تُستخدم من subPageThemeOverlay */
function updateSettingsDarkToggle() {
    /* يُحدّث أيقونات الداكن/الفاتح في كل مكان */
    const isDark = st.darkMode;
    ['settingsDarkIcon','darkLightIcon','spDarkLightIcon'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? '🌙' : '☀️';
    });
    ['settingsDarkLabel','darkLightLabel','spDarkLightLabel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? 'داكن' : 'فاتح';
    });
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    updateSettingsDarkToggle();
    playSound('click');
}

function updateSettingsThemeDots() {
    document.querySelectorAll('.settings-theme-dot,.theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.gold === st.tGold);
    });
}

function applySettingsTheme(el, gold, accent, accent2) {
    const dummy = { classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
    setTheme(dummy, gold, accent, accent2);
    updateSettingsThemeDots();
}

/* syncGameSheet — يُحدّث IDs الـ gameSettingsSheet من st مباشرة */
function syncGameSheet() {
    if (typeof st === 'undefined') return;
    const q = id => document.getElementById(id);
    if (q('gsoundStatus'))    q('gsoundStatus').textContent    = st.soundOn    ? 'مفعّل'  : 'مطفأ';
    if (q('gbgMusicStatus'))  q('gbgMusicStatus').textContent  = st.bgOn       ? 'مفعّلة' : 'مطفأة';
    if (q('gVibrationStatus')) q('gVibrationStatus').textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    if (q('gSoundVolSlider')) q('gSoundVolSlider').value       = st.soundVolume || 80;
    if (q('gSoundVolVal'))    q('gSoundVolVal').textContent    = (st.soundVolume || 80) + '%';
    if (q('gBgVolSlider'))    q('gBgVolSlider').value          = st.bgVolume || 60;
    if (q('gBgVolVal'))       q('gBgVolVal').textContent       = (st.bgVolume || 60) + '%';
}

/* ═══ 3. إعدادات اللعبة السريعة (داخل اللعبة فقط) ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
    syncGameSheet();            /* مزامنة واحدة من st — لا تكرار */
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

/* ═══ 9. احتفال رفع المستوى ═══ */
/* ✅ FIX-LEVELUP: عرض بطاقة احتفالية + كونفيتي عند رفع المستوى */
function showLevelUpCelebration(newLevel) {
    /* إنشاء overlay الاحتفال */
    const overlay = document.createElement('div');
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'display:flex', 'align-items:center', 'justify-content:center',
        'background:rgba(0,0,0,0.55)', 'animation:fadeInBg 0.3s ease'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
        'background:var(--surface,#1a1a2e)', 'border:2.5px solid var(--gold,#f0b90b)',
        'border-radius:28px', 'padding:36px 40px', 'text-align:center',
        'max-width:320px', 'width:88%',
        'animation:levelUpPop 0.45s cubic-bezier(0.34,1.56,0.64,1)'
    ].join(';');

    card.innerHTML = `
        <div style="font-size:3.2em;margin-bottom:8px;">🎉</div>
        <div style="font-size:1.05em;color:var(--text2,#aaa);margin-bottom:6px;font-weight:700;">ارتقيت إلى</div>
        <div style="font-size:2.8em;font-weight:900;color:var(--gold,#f0b90b);line-height:1;">
            المستوى ${newLevel}
        </div>
        <div style="font-size:0.88em;color:var(--text2,#aaa);margin-top:10px;">
            🚀 استمر، أنت في تقدم رائع!
        </div>
        <button onclick="this.closest('[data-levelup]').remove()" style="margin-top:22px;background:var(--gold,#f0b90b);color:#000;border:none;border-radius:14px;padding:10px 32px;font-size:1em;font-weight:900;cursor:pointer;">
            رائع! 🏆
        </button>
    `;
    overlay.setAttribute('data-levelup', '1');
    overlay.appendChild(card);
    /* إغلاق بالضغط خارج البطاقة */
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    /* حقن أنيميشن إن لم يكن موجوداً */
    if (!document.getElementById('levelUpKeyframes')) {
        const style = document.createElement('style');
        style.id = 'levelUpKeyframes';
        style.textContent = `
            @keyframes levelUpPop {
                0%   { transform: scale(0.5) rotate(-6deg); opacity:0; }
                70%  { transform: scale(1.08) rotate(1deg); opacity:1; }
                100% { transform: scale(1) rotate(0deg); }
            }
            @keyframes fadeInBg {
                from { opacity:0; } to { opacity:1; }
            }
        `;
        document.head.appendChild(style);
    }

    /* كونفيتي احتفالي */
    try { if (typeof doConfetti === 'function') doConfetti(); } catch(e) {}

    /* إغلاق تلقائي بعد 4 ثواني */
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 4000);
}


function initTitlesSystem() {
    try { checkSeasonReset(); } catch (e) {}
    try { renderProfileTitles(); } catch (e) {}
}

/* ═══ 5. toggleBgMusicInGame ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic(); /* toggleBgMusic تُحدّث gbgMusicStatus تلقائياً */
}

/* ═══ 6. toggleVibration ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    /* تحديث كل IDs الاهتزاز دفعة واحدة */
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

/* toggleSettingsRestorePanel و restoreFromSettings معرّفتان في state.js — لا تكرار */

