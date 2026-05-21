/* ═══════════════════════════════════════════════════════════════
   FIXES & INIT — HO Math v9
   إصلاح جميع الدوال المفقودة + تهيئة التطبيق
═══════════════════════════════════════════════════════════════ */

/* ─── مستوى الصوت ─── */
function initVolumeSliders() {
    if (typeof st.soundVolume !== 'number') st.soundVolume = 80;
    if (typeof st.bgVolume    !== 'number') st.bgVolume    = 60;

    ['soundVolSlider','gSoundVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = st.soundVolume;
    });
    ['bgVolSlider','gBgVolSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = st.bgVolume;
    });
    ['soundVolVal','gSoundVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.soundVolume + '%';
    });
    ['bgVolVal','gBgVolVal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.bgVolume + '%';
    });
    if (typeof st.vibrationStrength !== 'number') st.vibrationStrength = 30;
    const vibSl = document.getElementById('vibVolSlider');
    if (vibSl) vibSl.value = st.vibrationStrength;
    const vibVl = document.getElementById('vibVolVal');
    if (vibVl) vibVl.textContent = st.vibrationStrength + 'ms';
}

function setSoundVolume(val) {
    st.soundVolume = parseInt(val);
    ['soundVolVal','gSoundVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = val + '%'; });
    ['soundVolSlider','gSoundVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = val; });
    saveSt();
}

function setBgVolume(val) {
    st.bgVolume = parseInt(val);
    ['bgVolVal','gBgVolVal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = val + '%'; });
    ['bgVolSlider','gBgVolSlider'].forEach(id => { const el = document.getElementById(id); if (el) el.value = val; });
    saveSt();
}

function setVibrationStrength(val) {
    st.vibrationStrength = parseInt(val);
    const el = document.getElementById('vibVolVal');
    if (el) el.textContent = val + 'ms';
    const sl = document.getElementById('vibVolSlider');
    if (sl) sl.value = val;
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

/* ─── إصلاح: ربط أزرار الإجابة بـ checkAnswer ─── */
function _fixAnswerButtons() {
    /* يُعاد تشغيلها بعد كل loadQuestion لضمان عمل الأزرار */
    document.querySelectorAll('.answer-btn').forEach(btn => {
        /* إزالة listeners القديمة بنسخ العنصر */
        const fresh = btn.cloneNode(true);
        fresh.addEventListener('click', function() {
            if (!this.disabled) checkAnswer(this);
        });
        btn.parentNode.replaceChild(fresh, btn);
    });
}

/* ─── إصلاح: ضمان عمل جميع أزرار اللعبة ─── */
function _fixGameButtons() {
    /* زر العودة في أثناء اللعبة */
    const quitBtn = document.getElementById('quitBtn');
    if (quitBtn && !quitBtn._fixed) {
        quitBtn.addEventListener('click', confirmQuit);
        quitBtn._fixed = true;
    }

    /* زر الإعدادات أثناء اللعبة */
    const gameSetBtn = document.getElementById('gameSettingsBtn');
    if (gameSetBtn && !gameSetBtn._fixed) {
        gameSetBtn.addEventListener('click', openGameSettingsAndPause);
        gameSetBtn._fixed = true;
    }

    /* زر العب مجدداً */
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn && !playAgainBtn._fixed) {
        playAgainBtn.addEventListener('click', playAgain);
        playAgainBtn._fixed = true;
    }

    /* زر الرئيسية من النتائج */
    const goHomeBtn = document.getElementById('goHomeBtn');
    if (goHomeBtn && !goHomeBtn._fixed) {
        goHomeBtn.addEventListener('click', goHome);
        goHomeBtn._fixed = true;
    }
}

/* ─── إصلاح: ربط بطاقات الألعاب ─── */
function _fixPlayCards() {
    const fixes = [
        { id: 'playCardCounter',    fn: () => openOpSheet('counter', true)    },
        { id: 'playCardChallenges', fn: () => openOpSheet('challenges')       },
        { id: 'playCardTraining',   fn: () => openTrainingOpSheet()            },
        { id: 'gcardAdvanced',      fn: () => openAdvancedGame()              },
        { id: 'gcardLaws',          fn: () => openLawsGame()                  },
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
    try { initDateSelectors();         } catch(e) { console.warn('initDateSelectors', e); }
    try { initSettingsDateSelectors(); } catch(e) {}

    /* زر الإعدادات محذوف — لا يحتاج تهيئة */

    try { checkDailyReset(); } catch(e) {}
    try { applyTheme();      } catch(e) {}
    try { applyDarkMode();   } catch(e) {}
    try { updateUI();        } catch(e) { console.warn('updateUI', e); }
    try { loadProfileForm(); } catch(e) {}
    try { initVolumeSliders(); } catch(e) {}
    try { if (typeof applyProfilePhoto === 'function') applyProfilePhoto(); } catch(e) {}

    /* حالة الاهتزاز */
    ['vibrationStatus','gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });

    /* رقائق الصعوبة */
    (function() {
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

    try { updSessionTimer();            } catch(e) {}
    try { updCountdown();               } catch(e) {}
    try { updateStreakBanner();         } catch(e) {}
    try { updateSerialNumberDisplay();  } catch(e) {}
    try { applyCompetitionButtonTheme(); } catch(e) {}

    /* ── إصلاح الأزرار بعد تحميل الـ DOM ── */
    try { _fixGameButtons(); } catch(e) {}
    try { _fixPlayCards();   } catch(e) {}

    /* موسيقى الخلفية */
    if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });

    /* إخفاء شاشة البداية */
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) {
            ss.classList.add('hidden');
            setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500);
        }
        /* مكافأة تسجيل الدخول */
        try { checkDailyLoginReward();  } catch(e) {}
        /* صندوق المفاجآت */
        try { checkLootbox();           } catch(e) {}
        /* نظام الألقاب */
        try { if (typeof initTitlesSystem === 'function') initTitlesSystem(); } catch(e) {}
        /* تحديث قفل المحتوى */
        try { updateUnlocks(); } catch(e) {}
        /* إحصائيات الصفحة الرئيسية */
        try { if (typeof updatePeriodStats === 'function') updatePeriodStats(); } catch(e) {}
        /* مهام التحدي */
        try { if (typeof renderChallengeTasks === 'function') renderChallengeTasks(); } catch(e) {}
    }, 2800);

    /* AudioContext */
    document.addEventListener('touchstart', function() {
        gACtx();
        if (aCtx && aCtx.state === 'suspended') aCtx.resume();
    }, { once: true });

    /* Service Worker */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').catch(() => {});
        });
    }

    /* ── مراقب MutationObserver لإعادة ربط أزرار الإجابة ── */
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay && typeof MutationObserver !== 'undefined') {
        const obs = new MutationObserver(() => {
            try { _fixAnswerButtons(); } catch(e) {}
        });
        obs.observe(gameOverlay, { childList: true, subtree: true });
    }
})();

/* ─── تطبيق لون زر المنافسة حسب الثيم ─── */
function applyCompetitionButtonTheme() {
    const navLB = document.getElementById('nav-leaderboard');
    if (!navLB) return;
    const gold = getComputedStyle(document.documentElement)
        .getPropertyValue('--gold').trim() || '#f0b90b';
    navLB.style.setProperty('--nav-active-color', gold);
}
