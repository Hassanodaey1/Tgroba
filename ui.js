/* ═══════════════════════════════════════════════════
   HO Math — UI Handler
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   updateQuickPlayLabel — تحديث زر "العب الآن" فوراً
   تُستدعى من: updateUI() + startGameWith() + تحميل الصفحة
═══════════════════════════════════════════════════════════ */
window.ALL_MODE_NAMES = {
    /* الأوضاع الأساسية */
    classic:    'كلاسيك',
    daily:      'تحدي اليوم',
    weekly:     'تحدي الأسبوع',
    speed:      'السرعة',
    frenzy:     'الاندفاع',
    survival:   'البقاء',
    /* ألعاب العقل */
    memory:     'الذاكرة',
    chain:      'السلسلة',
    sudden:     'ضد الساعة',
    rocket:     'الصاروخ',
    /* التحديات */
    accuracy:   'الدقة',
    marathon:   'الماراثون',
    impossible: 'المستحيل',
    fill:       'التكميل',
    /* الرياضيات المتقدمة */
    adv_roots:  'الأسس والجذور',
    adv_log:    'اللوغاريتم',
    adv_geo:    'الهندسة',
    adv_eq:     'المعادلات',
    adv_seq:    'المتتاليات',
    adv_trig:   'المثلثات',
    /* أوضاع أخرى */
    table:      'جدول الضرب',
    training:   'التدريب',
    laws:       'ألغاز رياضية'
};

function updateQuickPlayLabel() {
    const el = document.getElementById('quickPlayLabel');
    if (!el) return;
    const mode = (typeof st !== 'undefined' && st.lastMode) ? st.lastMode : 'classic';
    const name = window.ALL_MODE_NAMES[mode] || mode;
    el.textContent = '▶ العب الآن — ' + name;
}

/* ─── إعدادات اللعبة ─── */
function openGameSettings() {
    /* يُستخدم من داخل اللعبة — يوقف المؤقت ويفتح الشيت */
    openGameSettingsAndPause();
}

/* ─── دالة مساعدة للأفاتار الافتراضي حسب الجنس ─── */
function getDefaultAvatarForGender(gender) { return gender === 'f' ? '👧' : '👦'; }

function updateOwnedEmojisForGender() {
    if (!st.ownedEmojis) st.ownedEmojis = [];
    const def = getDefaultAvatarForGender(st.gender);
    if (!st.ownedEmojis.includes(def)) st.ownedEmojis.push(def);
    if (st.avatar === getDefaultAvatarForGender('m') || st.avatar === getDefaultAvatarForGender('f')) st.avatar = def;
}

/* ═══════════ DATE SELECTORS ═══════════ */
function initDateSelectors() {
    const daySel = document.getElementById('birthDay');
    const monthSel = document.getElementById('birthMonth');
    const yearSel = document.getElementById('birthYear');
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

function loadProfileForm() {
    const inputName = document.getElementById('inputName');
    if (inputName) inputName.value = st.name;
    if (st.birthDate) {
        let parts = st.birthDate.split('-');
        if (parts.length === 3) {
            const bd = document.getElementById('birthDay'),
                bm = document.getElementById('birthMonth'),
                by = document.getElementById('birthYear');
            if (by) by.value = parseInt(parts[0]);
            if (bm) bm.value = parseInt(parts[1]);
            if (bd) bd.value = parseInt(parts[2]);
        }
    }
    selectGender(st.gender, false);
    updateOwnedEmojisForGender();
    renderProfileDailyTasks();
    renderProfileAchievements();
    updateBadgeIcon();
    const cd = document.getElementById('shopCoinsDisplay'); if (cd) cd.textContent = st.coins;
    const hc3 = document.getElementById('headerCoins'); if (hc3) hc3.textContent = st.coins;
    const ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';}

function renderProfileDailyTasks() {
    if (!st.dailyTasks) return;
    const container = document.getElementById('profileTasksList');
    if (!container) return;
    const barEl = document.getElementById('profileTasksBar');
    const labelEl = document.getElementById('profileTasksLabel');
    const pctEl = document.getElementById('profileTasksPct');
    const total = st.dailyTasks.length;
    const done = st.dailyTasks.filter(t => t.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    if (barEl) barEl.style.width = pct + '%';
    if (labelEl) labelEl.textContent = done + ' / ' + total;
    if (pctEl) pctEl.textContent = pct + '%';
    if (total === 0) {
        container.innerHTML = '<div style="font-size:0.75em;color:var(--text2);text-align:center;padding:10px;">لا توجد مهام بعد</div>';
        return;
    }
    container.innerHTML = st.dailyTasks.map(t => {
        const doneCls = t.done ? 'task-done' : '';
        return `<div class="task-item ${doneCls}" style="padding:10px 12px;border-radius:13px;display:flex;align-items:center;gap:10px;background:${t.done ? 'rgba(16,185,129,0.08)' : 'var(--surface2)'};border:1px solid ${t.done ? 'rgba(16,185,129,0.25)' : 'var(--border2)'};">
            <div style="font-size:1.3em;">${t.icon || '📋'}</div>
            <div style="flex:1;">
                <div style="font-size:0.78em;font-weight:700;color:var(--text);">${t.label || t.name}</div>
                <div style="font-size:0.63em;color:var(--text2);margin-top:2px;">${t.done ? '✅ منجزة' : '⏳ قيد التنفيذ'} • +${t.coins || t.reward}💰</div>
            </div>
            ${t.done ? '<div style="font-size:1.2em;">✅</div>' : `<div style="font-size:0.68em;color:var(--text3);">${t.progress || 0}/${t.target || t.goal || 1}</div>`}
        </div>`;
    }).join('');
}

function renderProfileAchievements() {
    const container = document.getElementById('profileAchieveList');
    const pctEl = document.getElementById('profileAchievePct');
    const rewardEl = document.getElementById('profileAchieveReward');
    if (!container) return;
    if (typeof ACHIEVEMENTS_DEF === 'undefined') return;
    const unlocked = st.achievementsUnlocked || [];
    if (pctEl) pctEl.textContent = unlocked.length + '/' + ACHIEVEMENTS_DEF.length;
    const allDone = unlocked.length >= ACHIEVEMENTS_DEF.length;
    if (rewardEl) rewardEl.style.display = (allDone && st.achievementRewardClaimed) ? 'block' : 'none';
    container.innerHTML = ACHIEVEMENTS_DEF.map(a => {
        const done = unlocked.includes(a.id);
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:13px;background:${done ? 'rgba(16,185,129,0.08)' : 'var(--surface2)'};border:1px solid ${done ? 'rgba(16,185,129,0.25)' : 'var(--border2)'};margin-bottom:6px;">
            <div style="font-size:1.4em;${done ? '' : 'filter:grayscale(1);opacity:0.5'}">${a.icon}</div>
            <div style="flex:1;">
                <div style="font-size:0.78em;font-weight:700;color:${done ? 'var(--text)' : 'var(--text2)'};">${a.name}</div>
                <div style="font-size:0.63em;color:var(--text2);margin-top:1px;">${a.desc}</div>
            </div>
            <div style="font-size:0.75em;font-weight:900;color:${done ? 'var(--gold)' : 'var(--text3)'};">${done ? '✅ ' + a.reward + '💰' : '🔒'}</div>
        </div>`;
    }).join('');
}

function selectGender(g, snd = true) {
    st.gender = g;
    document.getElementById('gBtnM').classList.toggle('active', g === 'm');
    document.getElementById('gBtnF').classList.toggle('active', g === 'f');
    updateOwnedEmojisForGender();
    if (snd) { playSound('click'); if (typeof renderShop === 'function') renderShop(); updateUI(); }
}

/* ═══════════ SAVE PROFILE ═══════════ */
function saveProfile() {
    let n = document.getElementById('inputName').value.trim();
    /* ✅ FIX-NAME: قبول الأحرف العربية والإنجليزية والأرقام والمسافات */
    const nameRegex = /^[\u0600-\u06FFa-zA-Z0-9\s]+$/;
    if (!nameRegex.test(n) || n === '') {
        showFeedback('⚠️ الاسم يجب أن يحتوي على أحرف (عربية أو إنجليزية) وأرقام فقط');
        return;
    }
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    let newBirthDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    st.name = n;
    if (year && month && day) {
        st.birthDate = newBirthDate;
        st.age = calculateAgeFromBirthDate(newBirthDate);
    }
    updateOwnedEmojisForGender();
    /* ✅ FIX-SERIAL: توليد الرقم التسلسلي تلقائياً عند أول حفظ */
    if (!st.serialNumber) {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
    }
    saveSt();
    updateUI();
    /* تحديث عرض الرقم التسلسلي */
    try { if (typeof updateSerialNumberDisplay === 'function') updateSerialNumberDisplay(); } catch(e) {}
    try { if (typeof updateSettingsSerialDisplay === 'function') updateSettingsSerialDisplay(); } catch(e) {}
    playSound('levelup');
    if (typeof renderShop === 'function') renderShop();
    /* ✅ FIX-SAVE-BTN: تأكيد الحفظ بوضوح */
    const btn = document.getElementById('saveBtn');
    if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✅ تم الحفظ!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
    }
    showFeedback('✅ تم حفظ الملف الشخصي');
}

/* ═══════════ THEMES ═══════════ */
function setTheme(el, gold, accent, accent2) {
    document.documentElement.style.setProperty('--gold', gold);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent2', accent2);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    el.classList.add('active');
    st.tGold = gold;
    st.tAccent = accent;
    st.tAccent2 = accent2;
    saveSt();
    playSound('click');
    /* تحديث لون زر المنافسة */
    applyCompetitionButtonTheme();
    updateCompetitionNavStyle();
}

function applyTheme() {
    document.documentElement.style.setProperty('--gold', st.tGold || '#f0b90b');
    document.documentElement.style.setProperty('--accent', st.tAccent || '#7c3aed');
    document.documentElement.style.setProperty('--accent2', st.tAccent2 || '#06b6d4');
}

function toggleDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    playSound('click');
}

function applyDarkMode() {
    /* ✅ FIX-DARKMODE: تطبيق فوري من أول ضغطة */
    if (st.darkMode) {
        document.documentElement.classList.remove('light-mode');
        document.body && document.body.classList.remove('light-mode');
    } else {
        document.documentElement.classList.add('light-mode');
        document.body && document.body.classList.add('light-mode');
    }
    const icon  = st.darkMode ? '🌙' : '☀️';
    const label = st.darkMode ? 'داكن' : 'فاتح';
    const spLabel = st.darkMode ? 'الوضع الداكن' : 'الوضع الفاتح';
    ['darkLightIcon','settingsDarkIcon'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = icon;
    });
    ['darkLightLabel','settingsDarkLabel'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = label;
    });
    const sdi = document.getElementById('spDarkLightIcon');  if (sdi) sdi.textContent = icon;
    const sdl = document.getElementById('spDarkLightLabel'); if (sdl) sdl.textContent = spLabel;
}

function confirmResetStats() {
    showConfirm('تصفير الإحصائيات',
        'هل أنت متأكد من تصفير جميع الإحصائيات؟\nلن يتأثر ملفك الشخصي أو عملاتك أو الرموز المشتراة.',
        'تأكيد', 'إلغاء', ok => {
            if (!ok) return;
            st.correctTotal = 0; st.wrongTotal = 0; st.bestStreak = 0;
            st.totalGames = 0; st.bestScore = 0;
            st.catCounter = { correct: 0, total: 0 };
            st.catChallenges = { games: 0 };
            st.history = []; st.xp = 0; st.level = 1;
            /* ✅ FIX-XPTONEXT: استخدام calcXpToNext(1) الصحيح = 560 بدلاً من 1000 الثابتة */
            st.xpToNext = typeof calcXpToNext === 'function' ? calcXpToNext(1) : 560;
            for (let k in st.stats) st.stats[k] = { att: 0, cor: 0, first: 0, stars: 0, max: 0 };
            st.achievementsUnlocked = [];
            st.achievementRewardClaimed = false;
            st.dailyStreak = 0;
            st.lastDailyDate = null;
            st.dailyShieldUsed = false;
            saveSt();
            updateUI();
            playSound('levelup');
            showFeedback('📊 تم التصفير!');
        });
}

function starsStr(r) {
    let s = ''; const f = Math.floor(r); const h = r - f >= 0.5;
    for (let i = 0; i < f; i++) s += '⭐';
    if (h) s += '✨';
    for (let i = f + (h ? 1 : 0); i < 5; i++) s += '☆';
    return s;
}

function getTitle() {
    if (st.level < 3) return 'مبتدئ';
    if (st.level < 6) return 'متعلم';
    if (st.level < 10) return 'رياضي بارع';
    if (st.level < 15) return 'خبير أرقام';
    if (st.level < 25) return 'عالم رياضيات';
    return 'عبقري رياضيات';
}

/* ═══ لون زر المنافسة حسب الثيم ═══ */
function updateCompetitionNavStyle() {
    const navLB = document.getElementById('nav-leaderboard');
    if (!navLB) return;
    const gold = st.tGold || '#f0b90b';
    /* لون مخصص للأيقونة والنص عند التنشيط */
    const style = navLB.querySelector('style') || document.createElement('style');
    style.textContent = `
        #nav-leaderboard.active .nav-item-icon,
        #nav-leaderboard.active .nav-item-label {
            color: ${gold} !important;
        }
        #nav-leaderboard.active .nav-active-dot {
            background: ${gold} !important;
            box-shadow: 0 0 8px ${gold}88;
        }
        #nav-leaderboard .nav-item-icon {
            background: linear-gradient(135deg, ${gold}22, ${gold}11);
            border-radius: 10px;
            padding: 2px 4px;
        }
    `;
    if (!navLB.querySelector('style')) navLB.appendChild(style);
}

function updateUI() {
    const xpPct = Math.min(100, Math.round((st.xp / st.xpToNext) * 100));
    const ttl = getTitle();
    const av = st.avatar || getDefaultAvatarForGender(st.gender);
    const _q = id => document.getElementById(id);
    if (_q('headerName')) _q('headerName').textContent = st.name;
    if (_q('headerSub')) _q('headerSub').textContent = `Lv.${st.level} • ${ttl}`;
    if (_q('headerXpBar')) _q('headerXpBar').style.width = xpPct + '%';
    if (_q('headerXp')) _q('headerXp').textContent = `⚡ ${st.xp} XP`;
    if (_q('headerAvatar')) _q('headerAvatar').textContent = av;
    /* ── بطاقة اللاعب + XP في الصفحة الرئيسية ── */
    const hnp = document.getElementById('homePlayerName'); if (hnp) hnp.textContent = st.name;
    const hnl = document.getElementById('homePlayerLevel'); if (hnl) hnl.textContent = `Lv.${st.level} • ${ttl}`;
    const hxf = document.getElementById('homeXpBarFill'); if (hxf) hxf.style.width = xpPct + '%';
    const hxt = document.getElementById('homeXpText'); if (hxt) hxt.textContent = `⚡ ${st.xp} XP`;
    const hxn = document.getElementById('homeXpNext'); if (hxn) hxn.textContent = `${st.xp} / ${st.xpToNext}`;

    /* ✅ §7.5 — تحديث نص زر "العب الآن" بالوضع الأخير */
    updateQuickPlayLabel();

    if (_q('profileName')) _q('profileName').textContent = st.name;
    if (_q('profileLevel')) _q('profileLevel').textContent = `المستوى ${st.level} • ${ttl}`;
    if (_q('profileXpFill')) _q('profileXpFill').style.width = xpPct + '%';
    if (_q('profileXpLabel')) _q('profileXpLabel').textContent = `${st.xp} / ${st.xpToNext} XP للمستوى التالي`;
    if (_q('profileAvatarImg')) _q('profileAvatarImg').textContent = av;
    if (_q('statCorrect')) _q('statCorrect').textContent = st.correctTotal;
    if (_q('statBestStreak')) _q('statBestStreak').textContent = '×' + st.bestStreak;
    if (_q('statCoinsP')) _q('statCoinsP').textContent = st.coins;
    // sync sub-page profile stats
    const spSC = document.getElementById('spStatCorrect'); if(spSC) spSC.textContent = st.correctTotal;
    const spSS = document.getElementById('spStatStreak'); if(spSS) spSS.textContent = '×' + st.bestStreak;
    const spSCo = document.getElementById('spStatCoins'); if(spSCo) spSCo.textContent = st.coins;
    const spPN = document.getElementById('spProfileName'); if(spPN) spPN.textContent = st.name;
    const spPL = document.getElementById('spProfileLevel'); if(spPL) spPL.textContent = `المستوى ${st.level} • ${ttl}`;
    const spPXF = document.getElementById('spProfileXpFill'); if(spPXF) spPXF.style.width = xpPct + '%';
    const spPXL = document.getElementById('spProfileXpLabel'); if(spPXL) spPXL.textContent = `${st.xp} / ${st.xpToNext} XP للمستوى التالي`;
    const spPAI = document.getElementById('spProfileAvatarImg'); if(spPAI) spPAI.textContent = av;
    const soundStatusEl = document.getElementById('soundStatus');
    if (soundStatusEl) soundStatusEl.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    const bgMusicStatusEl = document.getElementById('bgMusicStatus');
    if (bgMusicStatusEl) bgMusicStatusEl.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    const vibEl = document.getElementById('vibrationStatus');
    if (vibEl) vibEl.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    /* مزامنة gameSettingsSheet من مصدر واحد */
    try { if (typeof syncGameSheet === 'function') syncGameSheet(); } catch(e) {}
    const pTG = document.getElementById('profileTotalGames'); if (pTG) pTG.textContent = st.totalGames;
    const pBS = document.getElementById('profileBestScore'); if (pBS) pBS.textContent = st.bestScore;
    const pAcc = document.getElementById('profileAccuracy');
    if (pAcc) {
        const tot = st.correctTotal + st.wrongTotal;
        pAcc.textContent = tot > 0 ? Math.round((st.correctTotal / tot) * 100) + '%' : '0%';
    }
    const pCB = document.getElementById('profileChallengeBest'); if (pCB) pCB.textContent = st.challengeBestScore || 0;
    updateHomeStats();
    renderHistory();
    renderTasks();
    renderAchievements();
    /* تحديث الصندوق اليومي */
    try { if (typeof renderDailyBox === 'function') renderDailyBox(); } catch(e) {}
    /* تحديث تحدي الأسبوع */
    try { if (typeof renderWeeklyChallenge === 'function') renderWeeklyChallenge(); } catch(e) {}
    renderProfileDailyTasks();
    renderProfileAchievements();
    updateUnlocks();
    updateBadgeIcon();
    updateWeaknessArea();
    initVolumeSliders();
    var sc = document.getElementById('shopCoinsDisplay'); if (sc) sc.textContent = st.coins;
    var sc2 = document.getElementById('shopCoinsDisplay2'); if (sc2) sc2.textContent = st.coins;
    var hc = document.getElementById('headerCoins'); if (hc) hc.textContent = st.coins;
    var ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';
    try { if (typeof renderProfileTitles === 'function') renderProfileTitles(); } catch (e) {}
    /* تحديث لون زر المنافسة */
    updateCompetitionNavStyle();
    /* ✅ تحديث عرض الرقم التسلسلي وإظهاره عند وجوده */
    try { if (typeof updateSerialNumberDisplay === 'function') updateSerialNumberDisplay(); } catch(e) {}
    /* تطبيق الصورة الشخصية */
    try { applyProfilePhoto(); } catch(e) {}
    /* تطبيق الإطار المحفوظ على كل الحلقات */
    try { if (typeof _applyActiveFrameGlobally === 'function') _applyActiveFrameGlobally(); } catch(e) {}
}

function updateHomeStats() {
    const hc = document.getElementById('headerCoins'); if (hc) hc.textContent = st.coins;
    const homeCoins = document.getElementById('homeCoins'); if (homeCoins) homeCoins.textContent = st.coins;
    const hcr = document.getElementById('homeCorrect'); if (hcr) hcr.textContent = st.correctTotal;
    const total = st.correctTotal + st.wrongTotal;
    const acc = total > 0 ? Math.round((st.correctTotal / total) * 100) : 0;
    const hac = document.getElementById('homeAccuracy'); if (hac) hac.textContent = acc + '%';
    const hst = document.getElementById('homeStreak'); if (hst) hst.textContent = '×' + st.bestStreak;
    const hgm = document.getElementById('homeGames'); if (hgm) hgm.textContent = st.totalGames;
    const hlv = document.getElementById('homeLevel'); if (hlv) hlv.textContent = st.level;
    const hbs = document.getElementById('homeBestScore'); if (hbs) hbs.textContent = st.bestScore;
    /* ✅ STATS-V2: تقييم الأداء الحقيقي */
    let rr, rs;
    if (typeof calcPerformanceRating === 'function') {
        const perf = calcPerformanceRating();
        rr = perf.stars;
        rs = starsStr(perf.stars);
    } else {
        let r = 0;
        if (total > 0) r += (acc / 100) * 2.5;
        r += Math.min(1.5, st.level * 0.15);
        r += Math.min(1.0, st.bestStreak * 0.1);
        rr = Math.min(5, Math.round(r * 10) / 10);
        rs = starsStr(rr);
    }
    const rnum = document.getElementById('ratingNum'); if (rnum) rnum.textContent = rr.toFixed(1);
    const rbar = document.getElementById('ratingBar'); if (rbar) rbar.style.width = (rr / 5 * 100) + '%';
    const rsta = document.getElementById('ratingStars'); if (rsta) rsta.textContent = rs;
    const hs = document.getElementById('homeStars'); if (hs) hs.textContent = rs;

    /* ✅ STATS-V2: شرائط التقدم بنسب حقيقية */
    const cc = st.catCounter || { correct: 0, total: 0 };
    /* نسبة الدقة الحقيقية — بدون نسب وهمية إذا كانت البيانات قليلة */
    const cpct = cc.total >= 3
        ? Math.round((cc.correct / cc.total) * 100)
        : (cc.total > 0 ? Math.round((cc.correct / cc.total) * 100) : 0);
    const catProg0 = document.getElementById('catProg0');
    if (catProg0) catProg0.style.width = cpct + '%';
    const catStats0 = document.getElementById('catStats0');
    if (catStats0) catStats0.textContent = cc.total >= 3
        ? `${cpct}% • ${cc.correct} صح`
        : (cc.total > 0 ? `${cc.correct}/${cc.total} (بيانات قليلة)` : 'لم تبدأ بعد');

    const cg = (st.catChallenges && st.catChallenges.games) || 0;
    /* منحنى واقعي: √(cg/20)*100 بدلاً من cg*10 الوهمي */
    const cpct1 = typeof calcChallengePct === 'function'
        ? calcChallengePct(cg)
        : Math.min(100, Math.round(Math.sqrt(cg / 20) * 100));
    const catProg1 = document.getElementById('catProg1');
    if (catProg1) catProg1.style.width = cpct1 + '%';
    const catStats1 = document.getElementById('catStats1');
    if (catStats1) catStats1.textContent = cg > 0 ? `${cg} جلسة تحدي` : 'لم تبدأ بعد';

    const g0 = document.getElementById('gcatProg0'), g1 = document.getElementById('gcatProg1');
    if (g0) g0.style.width = cpct + '%';
    if (g1) g1.style.width = cpct1 + '%';
    const gs0 = document.getElementById('gcatStats0'), gs1 = document.getElementById('gcatStats1');
    if (gs0) gs0.textContent = `${cc.correct} / ${cc.total} إجابة`;
    if (gs1) gs1.textContent = `${cg} جلسة تحدي`;

    /* 🧠 تحديث بطاقة العقل */
    const memStats  = document.getElementById('memoryCardStats');
    const memProg   = document.getElementById('memoryCardProgress');
    if (memStats) {
        const memBest    = st.memoryBest  || 0;
        const suddenBest = st.suddenBest  || 0;
        const chainBest  = st.chainBest   || 0;
        if (memBest > 0 || suddenBest > 0 || chainBest > 0) {
            const parts = [];
            if (memBest    > 0) parts.push(`🧠 ${memBest}/10`);
            if (chainBest  > 0) parts.push(`🔗 ${chainBest}`);
            if (suddenBest > 0) parts.push(`⚡ ${suddenBest}`);
            memStats.textContent = parts.join(' • ');
        } else {
            memStats.textContent = 'ألعاب العقل والذاكرة';
        }
    }
    if (memProg) {
        /* تقدم مركّب: أفضل من الأوضاع الثلاثة */
        const memPct    = Math.min(100, ((st.memoryBest  || 0) / 10) * 100);
        const chainPct  = Math.min(100, ((st.chainBest   || 0) / 20) * 100);
        const suddenPct = Math.min(100, ((st.suddenBest  || 0) / 20) * 100);
        const avgPct    = Math.round((memPct + chainPct + suddenPct) / 3);
        memProg.style.width = avgPct + '%';
    }
}

function renderHistory() {
    const sc = document.getElementById('historyScroll');
    if (!sc) return;
    if (!st.history || st.history.length === 0) {
        sc.innerHTML = '<div style="font-size:0.72em;color:var(--text3);padding:6px;">لا توجد نتائج بعد — العب الآن!</div>';
        return;
    }
    const me = { classic: '🧮', speed: '⚡', survival: '🔥', frenzy: '💥', daily: '🌟' };
    sc.innerHTML = st.history.map(r =>
        `<div class="hist-chip"><div class="hist-chip-icon">${me[r.mode] || '🎮'}</div><div class="hist-chip-score">${r.score}</div><div class="hist-chip-acc">${r.acc}%</div></div>`
    ).join('');
}

function updateWeaknessArea() {
    const area = document.getElementById('weaknessArea');
    if (!area) return;
    const cats = Object.keys(st.stats).filter(k => st.stats[k]?.att > 4);
    if (!cats.length) { area.innerHTML = ''; return; }
    const w = cats.reduce((a, b) => (st.stats[a]?.cor / st.stats[a]?.att) < (st.stats[b]?.cor / st.stats[b]?.att) ? a : b);
    const names = {
        addition: 'الجمع', subtraction: 'الطرح', multiplication: 'الضرب', division: 'القسمة',
        table: 'جدول الضرب', squareroot: 'الجذور', percentage: 'النسب', algebra: 'المعادلات',
        mathlaws: 'القوانين', puzzles: 'الألغاز', geometry: 'الهندسة', wordproblems: 'المسائل'
    };
    area.innerHTML = `⚠️ تحتاج تحسين: <strong>${names[w] || w}</strong> <button style="background:var(--gold);color:#000;border:none;padding:4px 10px;border-radius:12px;font-size:0.72em;cursor:pointer;margin-right:6px;" onclick="startTrainingOn('${w}')">تدرب الآن</button>`;
}

function startTrainingOn(cat) { startTrainingMode(cat); }


/* ═══════════════════════════════════════════════════
   PROFILE PHOTO — رفع وإدارة الصورة الشخصية
═══════════════════════════════════════════════════ */

function triggerPhotoUpload() {
    openAvatarPickerOverlay();
}

/* ═══════════════════════════════════════════════════
   AVATAR PICKER — نظام اختيار الصورة الشخصية
═══════════════════════════════════════════════════ */

function openAvatarPickerOverlay() {
    const overlay = document.getElementById('avatarPickerOverlay');
    if (!overlay) return;
    /* إظهار/إخفاء زر الحذف */
    const removeOpt = document.getElementById('removePhotoOption');
    if (removeOpt) removeOpt.style.display = st.profilePhoto ? 'block' : 'none';
    /* رسم الرموز المملوكة فقط */
    renderOwnedEmojiGrid();
    overlay.style.display = 'flex';
    playSound && playSound('click');
}

function closeAvatarPickerOverlay() {
    const overlay = document.getElementById('avatarPickerOverlay');
    if (overlay) overlay.style.display = 'none';
    playSound && playSound('click');
}

/* رسم شبكة الرموز المملوكة فقط (داخل avatar picker) */
function renderOwnedEmojiGrid() {
    const grid = document.getElementById('ownedEmojiGrid');
    if (!grid) return;
    if (!st.ownedEmojis || st.ownedEmojis.length === 0) {
        st.ownedEmojis = [getDefaultAvatarForGender(st.gender)];
    }
    const owned = st.ownedEmojis.filter(e => {
        // تصفية الرموز حسب الجنس للرموز الافتراضية
        if (e === '👦' && st.gender === 'f') return false;
        if (e === '👧' && st.gender === 'm') return false;
        return true;
    });
    if (owned.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;font-size:0.72em;color:var(--text2);padding:10px;">لا توجد رموز — اضغط المتجر للشراء</div>';
        return;
    }
    grid.innerHTML = owned.map(emoji => {
        const selected = st.avatar === emoji && !st.profilePhoto;
        return `<div onclick="selectEmojiFromPicker('${emoji}')" style="
            background:${selected ? 'linear-gradient(135deg,var(--gold),#e5a800)' : 'var(--surface3)'};
            border:2.5px solid ${selected ? 'var(--gold)' : 'var(--border2)'};
            border-radius:14px;padding:10px 6px;text-align:center;cursor:pointer;
            transition:all 0.18s ease;transform:${selected ? 'scale(1.08)' : 'scale(1)'};
            box-shadow:${selected ? '0 4px 16px rgba(240,185,11,0.4)' : 'none'};">
            <div style="font-size:1.9em;">${emoji}</div>
            <div style="font-size:0.58em;color:${selected ? '#000' : 'var(--text3)'};font-weight:800;margin-top:3px;min-height:12px;">
                ${selected ? '✅ مفعّل' : ''}
            </div>
        </div>`;
    }).join('');
}

/* اختيار رمز تعبيري — تحديث فوري في الواجهة */
function selectEmojiFromPicker(emoji) {
    /* حذف الصورة الشخصية أولاً */
    if (st.profilePhoto) st.profilePhoto = null;
    st.avatar = emoji;
    saveSt();

    /* ── تحديث فوري لكل عناصر الأفاتار ── */
    const els = [
        document.getElementById('headerAvatar'),
        document.getElementById('profileAvatarImg'),
        document.getElementById('spProfileAvatarImg'),
        document.getElementById('currentAvatarDisplay'),
    ];
    els.forEach(el => {
        if (!el) return;
        el.style.backgroundImage = '';
        el.style.backgroundSize  = '';
        el.textContent = emoji;
    });

    /* إعادة رسم الشبكة فوراً لإظهار ✅ على الرمز المختار */
    renderOwnedEmojiGrid();
    /* تحديث شامل للواجهة */
    updateUI();
    playSound && playSound('click');
    showFeedback('✅ تم تفعيل ' + emoji);
    /* لا نغلق الـ overlay — اللاعب يرى التغيير مباشرة */
}

/* الذهاب للمتجر لشراء المزيد */
function goToEmojiShop() {
    closeAvatarPickerOverlay();
    goTab('shop');
    setTimeout(() => {
        if (typeof renderShop === 'function') renderShop();
    }, 200);
}

/* اختيار مصدر الصورة الشخصية مباشرة من الأزرار في الواجهة */
function pickPhotoSource(source) {
    const inp = document.getElementById('profilePhotoInput');
    if (!inp) return;
    if (source === 'camera') {
        inp.setAttribute('capture', 'user');
    } else {
        inp.removeAttribute('capture');
    }
    inp.click();
}

/* حذف الصورة والعودة للرمز */
function removeProfilePhotoFromPicker() {
    showConfirm('حذف الصورة', 'هل تريد حذف الصورة الشخصية والعودة للرمز التعبيري؟', 'نعم', 'إلغاء', function(ok) {
        if (!ok) return;
        st.profilePhoto = null;
        saveSt();
        applyProfilePhoto();
        /* إخفاء زر الحذف */
        const removeOpt = document.getElementById('removePhotoOption');
        if (removeOpt) removeOpt.style.display = 'none';
        renderOwnedEmojiGrid();
        showFeedback('🗑️ تم حذف الصورة الشخصية');
        playSound && playSound('click');
    });
}

/* دوال قديمة للتوافق — موجّهة للنظام الجديد */
function openPhotoPicker() { pickPhotoSource('gallery'); }
function openEmojiPickerFromAvatar() { openAvatarPickerOverlay(); }
function closeEmojiPickerOverlay() { closeAvatarPickerOverlay(); }
function buyEmojiFromPicker(emoji, price, label) {
    if (!st.ownedEmojis) st.ownedEmojis = [getDefaultAvatarForGender(st.gender)];
    if (st.ownedEmojis.includes(emoji)) { selectEmojiFromPicker(emoji); return; }
    if (typeof buyAvatarFromShop === 'function') {
        buyAvatarFromShop(emoji, price, label);
    }
}
function handleProfilePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showFeedback('⚠️ الملف ليس صورة'); return; }
    if (file.size > 8 * 1024 * 1024)    { showFeedback('⚠️ حجم الصورة كبير جداً'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX = 220;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
            else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            /* عند رفع صورة: الصورة تحل محل الرمز التعبيري */
            st.profilePhoto = canvas.toDataURL('image/jpeg', 0.80);
            /* لا نحذف st.avatar لأنه يُستخدم كاحتياطي — فقط الصورة تأخذ الأولوية في applyProfilePhoto */
            saveSt();
            applyProfilePhoto();
            /* إغلاق الـ avatar picker overlay */
            const ap = document.getElementById('avatarPickerOverlay');
            if (ap) ap.style.display = 'none';
            showFeedback('✅ تم تحديث الصورة الشخصية');
            playSound('levelup');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function applyProfilePhoto() {
    const bigEl    = document.getElementById('profileAvatarImg');
    const headerEl = document.getElementById('headerAvatar');
    const spEl     = document.getElementById('spProfileAvatarImg');
    const overlay  = document.getElementById('profilePhotoOverlay');
    const actions  = document.getElementById('profilePhotoActions');

    if (st.profilePhoto) {
        const applyPhoto = (el) => {
            if (!el) return;
            el.style.backgroundImage  = 'url("' + st.profilePhoto + '")';
            el.style.backgroundSize   = 'cover';
            el.style.backgroundPosition = 'center';
            el.textContent = '';
        };
        applyPhoto(bigEl);
        applyPhoto(headerEl);
        applyPhoto(spEl);
        if (overlay) overlay.style.display = 'flex';
        if (actions) actions.style.display = 'flex';
    } else {
        const av = st.avatar || getDefaultAvatarForGender(st.gender);
        const clearEl = (el) => {
            if (!el) return;
            el.style.backgroundImage = '';
            el.style.backgroundSize = '';
            el.textContent = av;
        };
        clearEl(bigEl);
        clearEl(headerEl);
        clearEl(spEl);
        if (overlay)  overlay.style.display = 'none';
        if (actions)  actions.style.display = 'none';
    }
}

function removeProfilePhoto() {
    showConfirm('حذف الصورة', 'هل تريد حذف الصورة الشخصية والعودة للرمز التعبيري؟', 'نعم', 'إلغاء', function(ok) {
        if (!ok) return;
        st.profilePhoto = null;
        saveSt();
        applyProfilePhoto();
        showFeedback('🗑️ تم حذف الصورة الشخصية');
    });
}

/* ═══════════ KEYBOARD SUPPORT ═══════════ */
document.addEventListener('keydown', e => {
    if (!G.answered && document.getElementById('gameOverlay').classList.contains('active')) {
        const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (map[e.key] !== undefined) {
            const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')];
            const visible = btns.filter(b => b.style.opacity !== '0.15');
            if (visible[map[e.key]]) visible[map[e.key]].click();
        }
    }
    if (e.key === 'Escape') {
        if (document.getElementById('confirmOverlay').classList.contains('active')) {
            document.getElementById('confirmOverlay').classList.remove('active');
        }
    }
});

/* ═══════════════════════════════════════════════════
   LEADERBOARD — لائحة المتصدرين (10 لاعبين، نقاط التحدي فقط)
═══════════════════════════════════════════════════ */

/**
 * مزامنة نقاط اللاعب مع لائحة المتصدرين العامة (أعلى نقاط).
 */
function syncWithLeaderboard() {
    if (!database) return;
    /* ✅ FIX-V3+V10: استخدام serialNumber كـ key ثابت وفريد لمنع انتحال الهوية */
    if (!st.serialNumber) return; /* لا مزامنة قبل تسجيل الملف الشخصي */
    try {
        /* ✅ FIX-V3: لا تُرفع النتيجة إذا كانت أعلى من حد معقول */
        const safeBestScore = Math.min(st.bestScore || 0, 9999999);
        const safeLevel     = Math.min(st.level || 1,     200);
        const playerKey     = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        saveSt();
        /* ✅ FIX-V3: نقرأ أولاً — لا نكتب إلا إذا كانت النتيجة الجديدة أعلى فعلاً */
        database.ref('leaderboard/' + playerKey).once('value', snap => {
            const existing = snap.val();
            if (!existing || safeBestScore > (existing.bestScore || 0)) {
                database.ref('leaderboard/' + playerKey).set({
                    name:          st.name,
                    avatar:        st.avatar,
                    level:         safeLevel,
                    bestScore:     safeBestScore,
                    totalXp:       Math.min(st.xp || 0, 99999999),
                    serialNumber:  st.serialNumber,
                    lastUpdated:   Date.now()
                }).catch(() => {});
            }
        }).catch(() => {});
    } catch (e) {}
}

/**
 * تحميل لائحة المتصدرين العامة (10 لاعبين — أعلى نقاط).
 */
function loadLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    if (!database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;">⚠️ قاعدة البيانات غير متصلة</div>';
        return;
    }
    container.innerHTML = '<div style="text-align:center;padding:16px;">⏳ جاري التحميل...</div>';
    try {
        database.ref('leaderboard').orderByChild('bestScore').limitToLast(10).once('value', snapshot => {
            const players = [];
            snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
            players.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
            if (players.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:16px;">لا توجد نتائج بعد</div>';
                return;
            }
            const medals = ['🥇', '🥈', '🥉'];
            const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : '';
            let html = '';
            players.slice(0, 10).forEach((p, idx) => {
                const isMe = myKey && p.id === myKey;
                html += `<div class="lb-row${isMe ? ' lb-row-me' : ''}">
                    <span>${medals[idx] || (idx + 1)}</span>
                    <span>${p.avatar || '🧑'} ${p.name}</span>
                    <span>${p.level || 1}</span>
                    <span style="color:var(--gold);font-weight:900;">${p.bestScore || 0}</span>
                </div>`;
            });
            container.innerHTML = html;
            /* تحديث تتبع المرتبة الأولى للألقاب */
            try { if (typeof updateFirstPlaceTracking === 'function') updateFirstPlaceTracking(players); } catch (e) {}
        }).catch(() => {
            container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ فشل التحميل</div>';
        });
    } catch (e) {
        container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ قاعدة البيانات غير متاحة</div>';
    }
}

/* ═══════════════════════════════════════════════════
   لائحة الصدارة الموحدة والمتحركة
═══════════════════════════════════════════════════ */

/* التبويب النشط حالياً: 'challenge' أو 'general' */
/* ═══ هذه الدوال نُقلت إلى competition_logic.js ═══
   _activeLbTab, showLbTab, loadCombinedLeaderboard,
   renderLeaderboardList, _legacyLoad*
   ═════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   وضع الوالدين — renderParentStats
   يملأ كل عناصر subPageParentOverlay من st مباشرة
═══════════════════════════════════════════════════ */
function renderParentStats() {
    if (typeof st === 'undefined') return;
    const q = id => document.getElementById(id);

    /* ── بطاقة اللاعب ── */
    if (q('parentAvatar')) q('parentAvatar').textContent = st.avatar || '🧑';
    if (q('parentName'))   q('parentName').textContent   = st.name  || 'اللاعب';
    const age = st.age || (typeof calculateAgeFromBirthDate === 'function' ? calculateAgeFromBirthDate(st.birthDate) : 0);
    const ageStr  = age > 0 ? 'العمر: ' + age + ' سنة' : 'العمر غير محدد';
    if (q('parentAgeLevel')) q('parentAgeLevel').textContent = 'المستوى ' + (st.level || 1) + ' • ' + ageStr;

    /* ── وقت اللعب — ✅ STATS-V2: بيانات حقيقية ── */
    const todaySecs = typeof getSessionSecs === 'function' ? getSessionSecs() : (st.sessionTimeSecs || 0);
    const fmtMin = typeof fmtTimeFriendly === 'function'
        ? fmtTimeFriendly
        : function(s) {
            if (!s || s < 60) return 'أقل من دقيقة';
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            return h > 0 ? h + 'س ' + (m > 0 ? m + 'د' : '') : m + ' دقيقة';
        };
    if (q('parentTimeToday')) q('parentTimeToday').textContent = fmtMin(todaySecs);

    /* ✅ وقت الأسبوع الحقيقي = أيام سابقة + اليوم */
    const wsBase   = (st.weeklyStats && st.weeklyStats._baseSessionSecs) || 0;
    const weekSecs = wsBase + todaySecs;
    if (q('parentTimeWeek')) q('parentTimeWeek').textContent = fmtMin(weekSecs);

    /* ✅ الوقت الكلي التراكمي */
    const totalSecs = (st.totalPlayTimeSecs || 0) + todaySecs;
    if (q('parentTimeTotal')) q('parentTimeTotal').textContent = fmtMin(Math.max(0, totalSecs));

    if (q('parentStreak')) q('parentStreak').textContent = st.dailyStreak || 0;

    /* ── أداء اليوم ── */
    const ds = st.dailyStats || { correct: 0, wrong: 0, games: 0 };
    const dailyTotal = ds.correct + ds.wrong;
    const dailyAcc   = dailyTotal > 0 ? Math.round((ds.correct / dailyTotal) * 100) : 0;
    if (q('parentDailyCorrect')) q('parentDailyCorrect').textContent = ds.correct;
    if (q('parentDailyWrong'))   q('parentDailyWrong').textContent   = ds.wrong;
    if (q('parentDailyAcc'))     q('parentDailyAcc').textContent     = dailyAcc + '%';
    if (q('parentAccBar'))       q('parentAccBar').style.width       = dailyAcc + '%';
    if (q('parentDailyGames'))   q('parentDailyGames').textContent   = (ds.games || 0) + ' جلسة اليوم';

    /* ── الإجمالي الكلي ── */
    const totalAll  = (st.correctTotal || 0) + (st.wrongTotal || 0);
    const totalAcc  = totalAll > 0 ? Math.round((st.correctTotal / totalAll) * 100) : 0;
    if (q('parentTotalCorrect')) q('parentTotalCorrect').textContent = st.correctTotal || 0;
    if (q('parentTotalGames'))   q('parentTotalGames').textContent   = st.totalGames   || 0;
    if (q('parentTotalAcc'))     q('parentTotalAcc').textContent     = totalAcc + '%';
    if (q('parentBestStreak'))   q('parentBestStreak').textContent   = st.bestStreak   || 0;

    /* ── بطاقة التقييم ── */
    const card = q('parentFeedbackCard');
    if (card) {
        let icon, msg, color, bg, border;
        if (dailyTotal === 0) {
            icon = '🌙'; msg = 'لم يلعب طفلك اليوم بعد'; color = 'var(--text2)';
            bg = 'var(--surface2)'; border = 'var(--border2)';
        } else if (dailyAcc >= 85) {
            icon = '🏆'; msg = 'أداء ممتاز اليوم! ' + ds.correct + ' إجابة صحيحة'; color = '#10b981';
            bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.3)';
        } else if (dailyAcc >= 60) {
            icon = '⭐'; msg = 'أداء جيد — ' + dailyAcc + '% دقة اليوم'; color = 'var(--gold)';
            bg = 'rgba(240,185,11,0.1)'; border = 'rgba(240,185,11,0.3)';
        } else {
            icon = '💪'; msg = 'يحتاج المزيد من التدريب — دقة ' + dailyAcc + '%'; color = '#f97316';
            bg = 'rgba(249,115,22,0.08)'; border = 'rgba(249,115,22,0.25)';
        }
        card.style.cssText = 'border-radius:18px;padding:16px;text-align:center;background:' + bg + ';border:1.5px solid ' + border + ';';
        card.innerHTML = '<div style="font-size:2em;margin-bottom:6px;">' + icon + '</div>'
            + '<div style="font-size:0.88em;font-weight:900;color:' + color + ';">' + msg + '</div>';
    }
}
