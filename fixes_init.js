/* FIXES — MISSING FUNCTIONS */
/* ═══════════════════════════════════════════════════════════════
   FIXES & MISSING FUNCTIONS — HO Math v8
   إصلاح جميع الدوال المفقودة وتحسينات اللعبة
═══════════════════════════════════════════════════════════════ */

/* ─── إصلاح: دوال مستوى الصوت المفقودة ─── */
function initVolumeSliders() {
    if (!st.soundVolume) st.soundVolume = 80;
    if (!st.bgVolume) st.bgVolume = 60;
    ['soundVolSlider','gSoundVolSlider'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = st.soundVolume;
    });
    ['bgVolSlider','gBgVolSlider'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = st.bgVolume;
    });
    ['soundVolVal','gSoundVolVal'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = st.soundVolume+'%';
    });
    ['bgVolVal','gBgVolVal'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = st.bgVolume+'%';
    });
}

function setSoundVolume(val) {
    st.soundVolume = parseInt(val);
    ['soundVolVal','gSoundVolVal'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = val+'%';
    });
    ['soundVolSlider','gSoundVolSlider'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = val;
    });
    saveSt();
}

function setBgVolume(val) {
    st.bgVolume = parseInt(val);
    ['bgVolVal','gBgVolVal'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = val+'%';
    });
    ['bgVolSlider','gBgVolSlider'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = val;
    });
    saveSt();
}

/* ─── إصلاح: دالة الاهتزاز المفقودة ─── */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    const el = document.getElementById('vibrationStatus');
    if(el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    if(st.vibrationOn && navigator.vibrate) navigator.vibrate(30);
    saveSt(); playSound('click');
}

/* ─── إصلاح: إضافة leaderboardList إلى قسم المنافسة ─── */
/* (تُعالج في HTML) */

/* ═══════════════════════════════════════════════════════════════
   ميزة جديدة: نظام مكافأة يومية (Daily Login Bonus)
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   ميزة جديدة: عرض الرقم التسلسلي في الإعدادات  
═══════════════════════════════════════════════════════════════ */
function generateAndShowSerial() {
    if (!st.serialNumber) {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
        saveSt();
    }
    updateSerialNumberDisplay();
    showFeedback('🔢 تم إنشاء الرقم التسلسلي');
}

/* ═══════════════════════════════════════════════════════════════
   إصلاح: تحسين نظام منع تكرار الأسئلة مع Pool أكبر
═══════════════════════════════════════════════════════════════ */
// يتم داخل loadQuestion و loadChallengeQuestion - تم التعامل معها

/* ═══════════════════════════════════════════════════════════════
   ميزة جديدة: عداد السلسلة اليومية (Daily Streak Banner)
═══════════════════════════════════════════════════════════════ */
function updateStreakBanner() {
    const el = document.getElementById('streakBannerVal');
    if (el) el.textContent = st.dailyStreak || 0;
}


/* ═══════════════════════════════════════════════════
   APP INIT — runs after all functions defined
═══════════════════════════════════════════════════ */
(function initApp() {
    try { initDateSelectors(); } catch(e) { console.warn('initDateSelectors',e); }
    try { checkDailyReset(); } catch(e) {}
    try { applyTheme(); } catch(e) {}
    try { applyDarkMode(); } catch(e) {}
    try { updateUI(); } catch(e) { console.warn('updateUI',e); }
    try { loadProfileForm(); } catch(e) {}
    try { initVolumeSliders(); } catch(e) {}
    // Vibration
    const _vib = document.getElementById('vibrationStatus');
    if (_vib) _vib.textContent = (st.vibrationOn ? 'مفعّل' : 'مطفأ');
    // Difficulty chips
    (function() {
        const chips = document.querySelectorAll('.diff-chip');
        chips.forEach(c => c.classList.remove('active'));
        const diffMap = { medium:'diffMedium', hard:'diffHard', genius:'diffGenius' };
        const tid = diffMap[st.difficulty];
        if (tid) {
            const dc = document.getElementById(tid);
            if (dc && !dc.classList.contains('locked')) { dc.classList.add('active'); return; }
        }
        if (chips[0]) chips[0].classList.add('active');
    })();
    try { updSessionTimer(); } catch(e) {}
    try { updCountdown(); } catch(e) {}
    try { updateStreakBanner(); } catch(e) {}
    try { updateSerialNumberDisplay(); } catch(e) {}
    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });
    // Splash hide
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) { ss.classList.add('hidden'); setTimeout(() => { if(ss) ss.style.display='none'; }, 500); }
        try { checkDailyLoginBonus(); } catch(e) {}
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch(e) {}
    }, 2800);
    document.addEventListener('touchstart', function() {
        gACtx(); if (aCtx && aCtx.state === 'suspended') aCtx.resume();
    }, { once: true });
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').catch(() => {});
        });
    }
})();

