/* ═══════════════════════════════════════════════════
   HO Math v10 — NAVIGATION
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */
const TABS = ['home','play','achieve','profile','leaderboard','settings'];

function goTab(tab) {
    TABS.forEach(t => {
        document.getElementById('page-'+t)?.classList.toggle('active', t === tab);
        document.getElementById('nav-'+t)?.classList.toggle('active', t === tab);
    });
    playSound('click');

    /* زر الإعدادات يظهر فقط في الرئيسية والملف الشخصي */
    const sBtn = document.getElementById('mainSettingsBtn');
    if (sBtn) sBtn.style.display = (tab === 'home' || tab === 'profile') ? 'flex' : 'none';

    if (tab === 'achieve') { checkDailyReset(); renderTasks(); renderAchievements(); checkWeeklyChallenge(); }
    if (tab === 'profile') {
        checkDailyReset(); loadProfileForm();
        renderProfileDailyTasks(); renderProfileAchievements();
        const pb = document.getElementById('profileChallengeBest'); if (pb) pb.textContent = st.challengeBestScore||0;
        const pTG = document.getElementById('profileTotalGames'); if (pTG) pTG.textContent = st.totalGames;
        const pBS = document.getElementById('profileBestScore'); if (pBS) pBS.textContent = st.bestScore;
        const pAcc = document.getElementById('profileAccuracy');
        if (pAcc) { const t = st.correctTotal+st.wrongTotal; pAcc.textContent = t>0?Math.round(st.correctTotal/t*100)+'%':'0%'; }
        try { if (typeof renderProfileTitles==='function') renderProfileTitles(); } catch(e) {}
        renderSessionSummaries();
    }
    if (tab === 'home') { updateHomeStats(); renderHistory(); renderSkillBar(); }
    if (tab === 'leaderboard') {
        loadCombinedLeaderboard();
        const el = document.getElementById('challengeBestDisplay'); if (el) el.textContent = st.challengeBestScore||0;
    }
    if (tab === 'play') { updateUnlocks(); }
}

function getDifficultyByLevel() {
    if (st.level >= 8) return 'genius';
    if (st.level >= 5) return 'hard';
    if (st.level >= 3) return 'medium';
    return 'easy';
}

function updateUnlocks() {
    const lv = st.level;
    /* التحديات */
    const cc = document.getElementById('playCardChallenges');
    if (cc) {
        const ok = lv >= 4;
        cc.classList.toggle('locked', !ok);
        cc.onclick = ok ? () => openOpSheet('challenges') : null;
        const badge = cc.querySelector('.gcard-badge');
        if (badge) badge.textContent = ok ? 'متاح' : '🔒 Lv.4';
    }
    /* متقدم */
    _toggleCard('gcardAdvanced', lv >= 7, () => startGameWith('classic','advanced',null,true), '🔒 Lv.7', 'gcardAdvancedStats');
    _toggleCard('catAdvanced', lv >= 7, () => startGameWith('classic','advanced',null,true), '🔒 Lv.7');
    /* قوانين */
    _toggleCard('gcardLaws', lv >= 10, () => startGameWith('classic','laws',null,true), '🔒 Lv.10', 'gcardLawsStats');
    _toggleCard('catLaws', lv >= 10, () => startGameWith('classic','laws',null,true), '🔒 Lv.10');
    /* صعوبات */
    _diffChip('diffMedium','lockMedium', lv >= 3);
    _diffChip('diffHard','lockHard', lv >= 5);
    _diffChip('diffGenius','lockGenius', lv >= 8);
    /* أوضاع جديدة */
    _toggleCard('cardFlash', lv >= 2, startFlashMode, '🔒 Lv.2');
    _toggleCard('cardMemory', lv >= 3, startMemoryMode, '🔒 Lv.3');
    _toggleCard('cardSurvival', lv >= 1, startSurvivalMode, '🔒');
}

function _toggleCard(id, ok, fn, lockText, statsId) {
    const el = document.getElementById(id); if (!el) return;
    el.classList.toggle('locked', !ok);
    el.onclick = ok ? fn : null;
    const badge = el.querySelector('.gcard-badge');
    if (badge) badge.textContent = ok ? 'متاح' : lockText;
    if (statsId) { const s = document.getElementById(statsId); if (s) s.textContent = ok ? 'اضغط للعب' : (lockText+' يفتح'); }
}

function _diffChip(chipId, lockId, ok) {
    const c = document.getElementById(chipId); if (!c) return;
    c.classList.toggle('locked', !ok);
    const lk = document.getElementById(lockId); if (lk) lk.style.display = ok ? 'none' : 'block';
}

function selectDiff(el, diff) {
    if (el.classList.contains('locked')) return;
    document.querySelectorAll('.diff-chip').forEach(c => { if (!c.classList.contains('locked')) c.classList.remove('active'); });
    el.classList.add('active');
    st.difficulty = diff;
    playSound('click'); saveSt();
}

function openSheet(id) { document.getElementById(id)?.classList.add('active'); }
function closeSheet(id) { document.getElementById(id)?.classList.remove('active'); }
function sheetBg(e, id) { if (e.target.id === id) closeSheet(id); }
function openModeSheet(op) { currentOp = op || st.lastOp; openSheet('modeSheet'); }
function openCounterGame() { openOpSheet('counter', true); }
function openAdvancedGame() { if (st.level>=7) startGameWith('classic','advanced',null,true); else showFeedback('🔒 يفتح عند Lv.7'); }
function openLawsGame() { if (st.level>=10) startGameWith('classic','laws',null,true); else showFeedback('🔒 يفتح عند Lv.10'); }

function openTrainingOpSheet() {
    const grid = document.getElementById('trainingOpGrid');
    grid.innerHTML = `
        <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('add')"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div></div>
        <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('sub')"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div></div>
        <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('mul')"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div></div>
        <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('div')"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div></div>`;
    openSheet('trainingOpSheet');
}

function openOpSheet(cat) {
    const grid = document.getElementById('opModeGrid');
    const title = document.getElementById('opSheetTitle');
    if (cat === 'counter') {
        title.textContent = '🧮 العمليات على الأعداد';
        let html = `
            <div class="mode-card" onclick="startGameWith('classic','add',null,true)"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div><div class="mode-card-desc">60 ثانية • قلوب</div></div>
            <div class="mode-card" onclick="startGameWith('classic','sub',null,true)"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div><div class="mode-card-desc">60 ثانية • قلوب</div></div>`;
        html += st.level>=2
            ? `<div class="mode-card" onclick="startGameWith('classic','mul',null,true)"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div></div>
               <div class="mode-card" onclick="startGameWith('classic','div',null,true)"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div></div>`
            : `<div class="mode-card locked"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div><div class="mode-card-desc">🔒 Lv.2</div></div>
               <div class="mode-card locked"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div><div class="mode-card-desc">🔒 Lv.2</div></div>`;
        html += `
            <div class="mode-card" onclick="startGameWith('classic','mix',null,true)"><div class="mode-card-badge">موصى</div><span class="mode-card-icon">🎲</span><div class="mode-card-name">مختلط</div></div>
            <div class="mode-card" onclick="startTableGame()"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول الضرب</div></div>`;
        grid.innerHTML = html;
    } else {
        title.textContent = '⚡ التحديات والأوضاع الجديدة';
        grid.innerHTML = `
            <div class="mode-card" onclick="startGameWith('speed','mix',null,true)"><span class="mode-card-icon">⚡</span><div class="mode-card-name">السرعة</div><div class="mode-card-desc">60 ثانية • يُرتَّب حسب الوقت</div></div>
            <div class="mode-card" onclick="startSurvivalMode()"><span class="mode-card-icon">❤️</span><div class="mode-card-name">البقاء</div><div class="mode-card-desc">3 أرواح • تزداد بكل 10 صحيح</div></div>
            <div class="mode-card" onclick="startGameWith('frenzy','mix',null,true)"><span class="mode-card-icon">💥</span><div class="mode-card-name">الاندفاع</div><div class="mode-card-desc">30 ثانية • ضغط عالٍ</div></div>
            <div class="mode-card" onclick="startFlashMode()"><span class="mode-card-icon">⚡</span><div class="mode-card-name">الفلاشات</div><div class="mode-card-desc">أرقام تمر بسرعة — احفظ المجموع</div></div>
            <div class="mode-card" onclick="startMemoryMode()"><span class="mode-card-icon">🧠</span><div class="mode-card-name">الذاكرة</div><div class="mode-card-desc">اعرض معادلة ثم اخفها — هل تذكر؟</div></div>
            <div class="mode-card" onclick="startGameWith('daily','mix',null,false)"><div class="mode-card-badge">+3💰</div><span class="mode-card-icon">🌟</span><div class="mode-card-name">تحدي اليوم</div><div class="mode-card-desc">بدون وقت • مكافأة خاصة</div></div>`;
    }
    openSheet('opSheet');
}

function startTableGame() {
    closeSheet('opSheet');
    const maxT = st.difficulty==='easy'?10:st.difficulty==='medium'?15:st.difficulty==='hard'?20:30;
    let btns = '';
    for (let i=1;i<=maxT;i++) btns += `<div class="mode-card" onclick="closeSheet('opSheet');startGameWith('classic','table',${i},true)"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول ${i}</div></div>`;
    document.getElementById('opSheetTitle').textContent = '📊 اختر جدول الضرب';
    document.getElementById('opModeGrid').innerHTML = btns;
    openSheet('opSheet');
}
window.startTableGameWith = function(table) { closeSheet('opSheet'); startGameWith('classic','table',table,true); };

/* ─── التحدي الأسبوعي ─── */
function checkWeeklyChallenge() {
    const week = getWeekStr();
    if (st.weeklyDate !== week) { st.weeklyChallengeDone = false; st.weeklyDate = week; saveSt(); }
    const el = document.getElementById('weeklyChallengeStatus');
    if (el) el.textContent = st.weeklyChallengeDone ? '✅ أتممته هذا الأسبوع!' : '⏳ لم تُكمله بعد';
}

function getWeekStr() {
    const d = new Date(); const jan1 = new Date(d.getFullYear(),0,1);
    return d.getFullYear() + '-W' + Math.ceil((((d-jan1)/86400000)+jan1.getDay()+1)/7);
}

function startWeeklyChallenge() {
    if (st.weeklyChallengeDone) { showFeedback('✅ أتممت التحدي الأسبوعي!'); return; }
    startGameWith('frenzy','mix',null,true);
    /* بعد انتهاء اللعبة نعلّم كمكتمل */
    const origEnd = window._afterEndGame;
    window._afterWeeklyEnd = true;
}

function rnd(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
function shuffle(a) { return [...a].sort(()=>Math.random()-0.5); }
function getCatStatsKey(op) {
    const m = {add:'addition',sub:'subtraction',mul:'multiplication',div:'division',mix:'addition',
        table:'table',percent:'percentage',fraction:'division',power:'algebra',sqrt:'squareroot',
        equation:'algebra',sequence:'puzzles',algebra:'algebra',word:'wordproblems',geometry:'geometry',advanced:'algebra',laws:'mathlaws'};
    return m[op]||'addition';
}
