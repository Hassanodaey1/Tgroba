/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features v10
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إيقاف/استئناف مؤقت اللعبة ═══ */
var _gamePaused    = false;
var _pausedTimeLeft = 0;

function pauseGameTimer() {
    if (!G || G.ended || !G.hasTimer) return;
    if (_gamePaused) return;
    _gamePaused      = true;
    _pausedTimeLeft  = G.timeLeft;
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
            const pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            const bar = document.getElementById('timerBar');
            const bt  = document.getElementById('bigTimer');
            if (bar) {
                bar.style.width = pct + '%';
                bar.classList.toggle('danger', pct < 25);
            }
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                bt.classList.toggle('danger', G.timeLeft <= 5);
            }
        }
    }, 1000);
}

/* ═══ 2. الإعدادات الرئيسية ═══ */
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
    updateSettingsSerialDisplay();
    openSheet('mainSettingsSheet');
    playSound('click');
}

function closeMainSettings() { closeSheet('mainSettingsSheet'); }

function saveMainSettings() {
    const inName = document.getElementById('settingsInputName');
    let name = inName ? inName.value.trim().replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, '') : '';
    if (!name) { showFeedback('الاسم لا يمكن أن يكون فارغاً'); return; }
    if (name.length > 30) name = name.slice(0, 30);
    st.name = name;

    const sd = document.getElementById('settingsBirthDay');
    const sm = document.getElementById('settingsBirthMonth');
    const sy = document.getElementById('settingsBirthYear');
    if (sd && sm && sy) {
        const y  = sy.value;
        const mo = String(sm.value).padStart(2, '0');
        const d  = String(sd.value).padStart(2, '0');
        st.birthDate = `${y}-${mo}-${d}`;
        if (typeof calculateAgeFromBirthDate === 'function')
            st.age = calculateAgeFromBirthDate(st.birthDate);
    }
    if (!st.serialNumber)
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);

    saveSt();
    updateUI();
    loadProfileForm();
    updateSerialNumberDisplay();
    updateSettingsSerialDisplay();
    closeMainSettings();
    showFeedback('✅ تم حفظ الإعدادات');
}

function updateSettingsDarkToggle() {
    const icon  = document.getElementById('settingsDarkIcon');
    const label = document.getElementById('settingsDarkLabel');
    if (icon)  icon.textContent  = st.darkMode ? '🌙' : '☀️';
    if (label) label.textContent = st.darkMode ? 'داكن' : 'فاتح';
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    updateSettingsDarkToggle();
    const icon2  = document.getElementById('darkLightIcon');
    const label2 = document.getElementById('darkLightLabel');
    if (icon2)  icon2.textContent  = st.darkMode ? '🌙' : '☀️';
    if (label2) label2.textContent = st.darkMode ? 'داكن' : 'فاتح';
    playSound('click');
}

function updateSettingsThemeDots() {
    document.querySelectorAll('.settings-theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.gold === st.tGold);
    });
}

function applySettingsTheme(el, gold, accent, accent2) {
    document.querySelectorAll('.settings-theme-dot').forEach(d => d.classList.remove('active'));
    if (el) el.classList.add('active');
    const dummy = { classList: { add:()=>{}, remove:()=>{}, toggle:()=>{} } };
    setTheme(dummy, gold, accent, accent2);
    updateSettingsThemeDots();
}

/* ═══ 3. إعدادات اللعبة السريعة ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
    const _s = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    _s('gsoundStatus',   st.soundOn ? 'مفعّل' : 'مطفأ');
    _s('gbgMusicStatus', st.bgOn    ? 'مفعّلة' : 'مطفأة');
    _s('gVibrationStatus', st.vibrationOn ? 'مفعّل' : 'مطفأ');
    const gSV = document.getElementById('gSoundVolSlider'); if (gSV) gSV.value = st.soundVolume || 80;
    const gSVV = document.getElementById('gSoundVolVal');   if (gSVV) gSVV.textContent = (st.soundVolume||80)+'%';
    const gBV = document.getElementById('gBgVolSlider');    if (gBV) gBV.value = st.bgVolume || 60;
    const gBVV = document.getElementById('gBgVolVal');      if (gBVV) gBVV.textContent = (st.bgVolume||60)+'%';
    openSheet('gameSettingsSheet');
}

function closeGameSettingsAndResume() {
    closeSheet('gameSettingsSheet');
    resumeGameTimer();
}

function sheetBgAndResume(e, id) {
    if (e.target.id === id) { closeSheet(id); resumeGameTimer(); }
}

/* ═══ 4. تهيئة الألقاب ═══ */
function initTitlesSystem() {
    try { checkSeasonReset();    } catch(e) {}
    try { renderProfileTitles(); } catch(e) {}
}

/* ═══ 5. موسيقى الخلفية في اللعبة ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic();
    const el = document.getElementById('gbgMusicStatus');
    if (el) el.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
}

/* ═══ 6. الاهتزاز ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    ['vibrationStatus','gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(st.vibrationStrength || 30);
    saveSt();
    playSound('click');
}

/* ═══ 7. محددات تاريخ الإعدادات ═══ */
function initSettingsDateSelectors() {
    const daySel   = document.getElementById('settingsBirthDay');
    const monthSel = document.getElementById('settingsBirthMonth');
    const yearSel  = document.getElementById('settingsBirthYear');
    if (!daySel) return;
    daySel.innerHTML = ''; monthSel.innerHTML = ''; yearSel.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        const o = document.createElement('option'); o.value = i; o.textContent = i; daySel.appendChild(o);
    }
    for (let i = 1; i <= 12; i++) {
        const o = document.createElement('option'); o.value = i; o.textContent = i; monthSel.appendChild(o);
    }
    const cy = new Date().getFullYear();
    for (let i = cy - 100; i <= cy; i++) {
        const o = document.createElement('option'); o.value = i; o.textContent = i; yearSel.appendChild(o);
    }
}

/* ═══ 8. الرقم التسلسلي ═══ */
function updateSettingsSerialDisplay() {
    const el = document.getElementById('settingsSerialDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ التغييرات أولاً لتوليد الرقم';
}

function copySettingsSerial() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد — احفظ التغييرات أولاً'); return; }
    navigator.clipboard.writeText(st.serialNumber)
        .then(()  => showFeedback('📋 تم نسخ الرقم التسلسلي'))
        .catch(()  => showFeedback('📋 ' + st.serialNumber));
}

function toggleSettingsRestorePanel() {
    const p = document.getElementById('settingsRestorePanel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function restoreFromSettings() {
    const input  = document.getElementById('settingsRestoreInput');
    const serial = input ? input.value.trim() : '';
    if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
    const saved = loadSerialBackup(serial);
    if (!saved)  { showFeedback('⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
    Object.assign(st, sanitizeState(saved));
    saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
    updateSettingsSerialDisplay();
    if (input) input.value = '';
    const p = document.getElementById('settingsRestorePanel');
    if (p) p.style.display = 'none';
    showFeedback('✅ تم استعادة الحساب');
}

/* ═══════════════════════════════════════════════════
   9. الترتيب الأسبوعي — يتجدد كل أسبوع
═══════════════════════════════════════════════════ */

/**
 * مزامنة نقاط التحدي الأسبوعية مع Firebase
 */
function syncWeeklyScore() {
    if (!database) return;
    try {
        const playerKey = _getPlayerKey();
        database.ref('weekly_leaderboard/' + weekStr() + '/' + playerKey).set({
            name:        st.name,
            avatar:      st.avatar || '🧑',
            level:       st.level,
            weeklyScore: st.challengeWeeklyBest || 0,
            week:        weekStr(),
            updatedAt:   Date.now()
        }).catch(() => {});
    } catch(e) {}
}

/**
 * تحميل الترتيب الأسبوعي وعرضه
 */
function loadWeeklyLeaderboard() {
    const container = document.getElementById('weeklyLeaderboardList');
    if (!container) return;

    if (!database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;">⚠️ قاعدة البيانات غير متصلة</div>';
        return;
    }

    container.innerHTML = '<div style="text-align:center;padding:16px;">⏳ جاري التحميل...</div>';

    try {
        database.ref('weekly_leaderboard/' + weekStr())
            .orderByChild('weeklyScore').limitToLast(20)
            .once('value', snapshot => {
                const players = [];
                snapshot.forEach(c => players.push({ id: c.key, ...c.val() }));
                players.sort((a,b) => (b.weeklyScore||0) - (a.weeklyScore||0));
                _renderWeeklyList(container, players);
                _checkWeeklyChampion(players);
                _checkOvertaken(players);
            }).catch(() => {
                container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ فشل التحميل</div>';
            });
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:16px;">⚠️ خطأ في الاتصال</div>';
    }
}

function _renderWeeklyList(container, players) {
    if (!players.length) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);">لا توجد نتائج هذا الأسبوع — كن الأول! 🏆</div>';
        return;
    }
    const medals  = ['🥇','🥈','🥉'];
    const myKey   = _getPlayerKey();
    let html = '';
    players.forEach((p, idx) => {
        const isMe = p.id === myKey || p.name === st.name;
        html += `<div class="lb-row${isMe ? ' lb-row-me' : ''}">
            <span>${medals[idx] || (idx+1)}</span>
            <span>${p.avatar||'🧑'} ${p.name||'لاعب'}${idx === 0 ? ' 👑' : ''}</span>
            <span>Lv.${p.level||1}</span>
            <span style="color:var(--gold);font-weight:900;">${p.weeklyScore||0}</span>
        </div>`;
    });
    container.innerHTML = html;
    const myRow = container.querySelector('.lb-row-me');
    if (myRow) setTimeout(() => myRow.scrollIntoView({ behavior:'smooth', block:'center' }), 300);
}

/** لقب "بطل الأسبوع" لأول لاعب */
function _checkWeeklyChampion(players) {
    if (!players.length) return;
    const top    = players[0];
    const myKey  = _getPlayerKey();
    const isMe   = top.id === myKey || top.name === st.name;
    const badgeEl = document.getElementById('weeklyChampionBadge');
    if (badgeEl) {
        badgeEl.style.display = isMe ? 'flex' : 'none';
        if (isMe) badgeEl.textContent = '👑 أنت بطل هذا الأسبوع!';
    }
    /* حفظ حالة الصدارة */
    st._wasWeeklyChampion = isMe;
    saveSt();
}

/** إشعار "تجاوزك أحد اللاعبين" */
function _checkOvertaken(players) {
    if (!st.notifyOvertak) return;
    const myKey  = _getPlayerKey();
    const myIdx  = players.findIndex(p => p.id === myKey || p.name === st.name);
    if (myIdx < 0) return;

    /* إذا تراجع ترتيبك عن الجلسة السابقة */
    const prevRank = st._lastWeeklyRank || myIdx + 1;
    if (myIdx + 1 > prevRank) {
        _showOvertakenToast();
    }
    st._lastWeeklyRank = myIdx + 1;
    saveSt();
}

function _showOvertakenToast() {
    const div = document.createElement('div');
    div.style.cssText = `
        position:fixed;top:72px;left:50%;transform:translateX(-50%);
        z-index:9997;background:var(--surface2);
        border:1.5px solid rgba(240,185,11,0.35);border-radius:16px;
        padding:12px 20px;font-size:0.8em;font-weight:700;color:var(--text);
        box-shadow:0 4px 20px rgba(0,0,0,0.35);
        animation:slideDown 0.4s cubic-bezier(.34,1.56,.64,1);
        text-align:center;min-width:220px;
    `;
    div.innerHTML = '⚠️ تجاوزك أحد اللاعبين في الترتيب الأسبوعي!<br><span style="font-size:0.78em;color:var(--gold);">العب الآن لاستعادة مكانك 🔥</span>';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

/* ═══════════════════════════════════════════════════
   10. مشاركة النتيجة عبر رابط
═══════════════════════════════════════════════════ */

function shareResult() {
    const score  = (G && G.score) ? G.score : st.bestScore;
    const level  = st.level;
    const name   = st.name || 'لاعب';
    const text   = `🏆 ${name} سجّل ${score} نقطة في المستوى ${level} في لعبة HO Math!\nهل تستطيع التغلب عليه؟ 🎮`;

    if (navigator.share) {
        navigator.share({ title: 'HO Math', text, url: window.location.href })
            .catch(() => _copyShareText(text));
    } else {
        _copyShareText(text);
    }
}

function _copyShareText(text) {
    navigator.clipboard.writeText(text)
        .then(()  => showFeedback('📋 تم نسخ النتيجة — شاركها مع أصدقائك!'))
        .catch(() => showFeedback('📤 ' + text.slice(0, 60) + '...'));
}

/* زر المشاركة في شاشة النتائج */
function shareResultFromResults() {
    shareResult();
    playSound('click');
}

/* ═══════════════════════════════════════════════════
   11. وضع التحدي السريع (60 ثانية — أسئلة متنوعة)
═══════════════════════════════════════════════════ */

function startQuickChallenge() {
    if (st.level < 4) { showFeedback('🔒 يفتح عند المستوى 4'); return; }
    /* يغلق أي sheet مفتوح ويبدأ وضع السرعة بأسئلة مختلطة */
    document.querySelectorAll('.sheet.active').forEach(s => s.classList.remove('active'));
    startGameWith('speed', 'mix', null, true);
}

/* ═══════════════════════════════════════════════════
   12. الذكاء الاصطناعي للتلميحات — يرصد نقاط الضعف
═══════════════════════════════════════════════════ */

/**
 * يُحلّل إحصائيات الفئات ويقترح تدريباً مخصصاً
 */
function getSmartHint() {
    if (!st.stats || !Object.keys(st.stats).length) return null;
    const cats = Object.keys(st.stats).filter(k => (st.stats[k]?.att || 0) >= 3);
    if (!cats.length) return null;

    /* أضعف فئة */
    const weakest = cats.reduce((a, b) => {
        const ra = (st.stats[a]?.cor||0) / Math.max(1, st.stats[a]?.att||1);
        const rb = (st.stats[b]?.cor||0) / Math.max(1, st.stats[b]?.att||1);
        return ra < rb ? a : b;
    });

    const names = {
        addition:'الجمع', subtraction:'الطرح', multiplication:'الضرب',
        division:'القسمة', table:'جدول الضرب', algebra:'الجبر',
        geometry:'الهندسة', mathlaws:'القوانين', puzzles:'الألغاز',
        wordproblems:'المسائل', percentage:'النسب', squareroot:'الجذور'
    };
    return { cat: weakest, name: names[weakest] || weakest };
}

function showSmartHint() {
    const hint = getSmartHint();
    if (!hint) { showFeedback('✅ أداؤك جيد في جميع الفئات!'); return; }
    const acc = Math.round(((st.stats[hint.cat]?.cor||0) / Math.max(1, st.stats[hint.cat]?.att||1)) * 100);
    _showHintModal(hint.name, acc, hint.cat);
}

function _showHintModal(catName, acc, catKey) {
    const existing = document.getElementById('hintModal');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.id = 'hintModal';
    div.style.cssText = `
        position:fixed;inset:0;z-index:9998;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.65);backdrop-filter:blur(5px);
    `;
    div.innerHTML = `
        <div style="
            background:var(--surface2);border:1.5px solid var(--border2);
            border-radius:24px;padding:28px 24px;max-width:300px;width:86%;
            text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.4);
            animation:scaleIn 0.3s cubic-bezier(.34,1.56,.64,1);
        ">
            <div style="font-size:2.2em;margin-bottom:8px;">🧠</div>
            <div style="font-size:0.95em;font-weight:900;color:var(--text);margin-bottom:6px;">تلميح ذكي</div>
            <div style="font-size:0.78em;color:var(--text2);margin-bottom:14px;line-height:1.6;">
                دقتك في <strong style="color:var(--gold)">${catName}</strong> هي <strong>${acc}%</strong><br>
                تدرّب عليها لتحسين أدائك! 💪
            </div>
            <div style="display:flex;gap:10px;">
                <button onclick="document.getElementById('hintModal').remove()"
                    style="flex:1;background:var(--surface3);border:1px solid var(--border2);
                    border-radius:14px;padding:11px;font-family:'Tajawal',sans-serif;
                    font-size:0.85em;color:var(--text2);cursor:pointer;">لاحقاً</button>
                <button onclick="document.getElementById('hintModal').remove();startTrainingOn('${catKey}')"
                    style="flex:1;background:linear-gradient(135deg,var(--gold),var(--gold2));
                    border:none;border-radius:14px;padding:11px;font-family:'Tajawal',sans-serif;
                    font-size:0.85em;font-weight:900;color:#000;cursor:pointer;">تدرّب الآن 🎯</button>
            </div>
        </div>`;
    document.body.appendChild(div);
}

/* ═══════════════════════════════════════════════════
   13. حساب العمر
═══════════════════════════════════════════════════ */
function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return 0;
    try {
        const b   = new Date(birthDate);
        const now = new Date();
        let age   = now.getFullYear() - b.getFullYear();
        const m   = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
        return Math.max(0, age);
    } catch(e) { return 0; }
}

/* ═══════════════════════════════════════════════════
   14. مفتاح اللاعب (Firebase key)
═══════════════════════════════════════════════════ */
function _getPlayerKey() {
    if (!st.playerUID) {
        st.playerUID = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        saveSt();
    }
    return (st.name + '_' + st.playerUID).replace(/[^a-zA-Z0-9_]/g, '_');
}

/* ═══════════════════════════════════════════════════
   15. syncWithLeaderboard — يشمل التحدي + الأسبوعي
═══════════════════════════════════════════════════ */
function syncWithLeaderboard() {
    if (!database) return;
    try {
        const key = _getPlayerKey();
        /* لائحة عامة */
        database.ref('leaderboard/' + key).set({
            name:        st.name,
            avatar:      st.avatar || '🧑',
            level:       st.level,
            bestScore:   st.bestScore,
            totalXp:     st.xp,
            lastUpdated: Date.now()
        }).catch(() => {});
        /* لائحة التحدي */
        database.ref('challenge_leaderboard/' + key).set({
            name:           st.name,
            avatar:         st.avatar || '🧑',
            level:          st.level,
            challengeScore: st.challengeBestScore || 0,
            lastUpdated:    Date.now()
        }).catch(() => {});
        /* الترتيب الأسبوعي */
        syncWeeklyScore();
    } catch(e) {}
}

/* ═══════════════════════════════════════════════════
   16. نظام نجوم الفئات
═══════════════════════════════════════════════════ */
function getCatStars(catKey) {
    const s = st.stats[catKey];
    if (!s) return 0;
    return Math.min(3, Math.floor((s.stars || 0) / 5));
}

function getCatStarsStr(catKey) {
    const n = getCatStars(catKey);
    return '⭐'.repeat(n) + '☆'.repeat(3 - n);
}

/* ═══════════════════════════════════════════════════
   17. مزامنة إضافية لبيانات نقاط الضعف
═══════════════════════════════════════════════════ */
function generateDailyTasks() {
    if (typeof genDailyTasks === 'function') {
        st.dailyTasks = genDailyTasks();
        st.dailyDate  = todayStr();
        saveSt();
    }
}

/* ═══════════════════════════════════════════════════
   18. openGlobalSettings (للتوافق — لا يفتح شيئاً)
═══════════════════════════════════════════════════ */
function openGlobalSettings() {
    /* زر الإعدادات محذوف — هذه الدالة موجودة للتوافق فقط */
    showFeedback('الإعدادات متاحة من الملف الشخصي');
}

/* ═══════════════════════════════════════════════════
   19. Patch: useHelper — استخدام spendCoins الصحيح
═══════════════════════════════════════════════════ */
(function _patchUseHelper() {
    document.addEventListener('DOMContentLoaded', function() {
        /* بعد تحميل questions.js نُعيد تعريف useHelper */
        const _origUseHelper = window.useHelper || (typeof useHelper === 'function' ? useHelper : null);
        if (!_origUseHelper) return;
        window.useHelper = function(type) {
            const cost = type === 'skip' ? 3 : type === 'remove' ? 4 : type === 'heart' ? 7 : 0;
            if (cost > 0 && typeof spendCoins === 'function') {
                /* نتحقق من الرصيد بـ spendCoins لتسجيل الصرف */
                if (!spendCoins(cost, 'helper_' + type)) {
                    showFeedback('💸 لا يكفي!');
                    return;
                }
                /* نُعيد إضافة العملات لأن _origUseHelper سيخصمها مرة أخرى */
                st.coins += cost;
                st.totalCoinsSpent = Math.max(0, (st.totalCoinsSpent||0) - cost);
            }
            _origUseHelper(type);
        };
    });
})();

/* ═══════════════════════════════════════════════════
   20. Patch: loadQuestion — ربط _markQuestionUsed
═══════════════════════════════════════════════════ */
(function _patchLoadQuestion() {
    document.addEventListener('DOMContentLoaded', function() {
        const _orig = window.loadQuestion || (typeof loadQuestion === 'function' ? loadQuestion : null);
        if (!_orig) return;
        window.loadQuestion = function() {
            _orig();
            /* تسجيل السؤال الحالي في Set المضمونة */
            if (G && G.correctAnswer !== undefined && typeof _markQuestionUsed === 'function') {
                const key = (document.getElementById('questionText')?.textContent || '') + '|' + G.correctAnswer;
                _markQuestionUsed(key);
            }
        };
    });
})();
