/* ═══════════ EMOJI SHOP ═══════════ */
const EMOJI_CATALOG = [
    { emoji: '👦', price: 0, label: 'ولد افتراضي', gender: 'm' },
    { emoji: '👧', price: 0, label: 'بنت افتراضية', gender: 'f' },
    { emoji: '🧑‍🚀', price: 8, label: 'رائد فضاء' },
    { emoji: '🧛', price: 12, label: 'مصاص دماء' },
    { emoji: '🧝', price: 10, label: 'جني' },
    { emoji: '🧞', price: 15, label: 'علاء الدين' },
    { emoji: '🦊', price: 9, label: 'ثعلب' },
    { emoji: '🐯', price: 10, label: 'نمر' },
    { emoji: '🦁', price: 12, label: 'أسد' },
    { emoji: '🐼', price: 8, label: 'باندا' },
    { emoji: '🦄', price: 18, label: 'يونيكورن' },
    { emoji: '🐲', price: 14, label: 'تنين' },
    { emoji: '🦅', price: 8, label: 'نسر' },
    { emoji: '🐺', price: 10, label: 'ذئب' },
    { emoji: '🦉', price: 9, label: 'بومة' },
    { emoji: '🧑‍🎓', price: 20, label: 'خريج' },
    { emoji: '🧑‍💻', price: 22, label: 'مبرمج' },
    { emoji: '🧑‍🔬', price: 25, label: 'عالم' },
    { emoji: '🤴', price: 35, label: 'أمير' },
    { emoji: '👸', price: 35, label: 'أميرة' },
    { emoji: '🦸', price: 30, label: 'بطل خارق' },
    { emoji: '🧙', price: 28, label: 'ساحر' },
];

function getDefaultAvatarForGender(gender) { return gender === 'f' ? '👧' : '👦'; }

function renderEmojiShop() {
    const grid = document.getElementById('emojiShopGrid');
    if (!grid) return;
    if (!st.ownedEmojis || st.ownedEmojis.length === 0) st.ownedEmojis = [getDefaultAvatarForGender(st.gender)];
    grid.innerHTML = EMOJI_CATALOG.map(item => {
        const owned = st.ownedEmojis.includes(item.emoji);
        const selected = st.avatar === item.emoji;
        if (item.price === 0 && item.gender && item.gender !== st.gender) return '';
        return `<div class="emoji-shop-item ${owned?'owned':''} ${selected?'selected':''} ${!owned&&!selected?'locked-shop':''}" onclick="buyOrSelectEmoji('${item.emoji}',${item.price})">
            <div class="emoji-shop-item-icon">${item.emoji}</div>
            ${owned?(selected?`<div class="emoji-shop-item-owned">✅ مفعّل</div>`:`<div class="emoji-shop-item-owned">مملوك</div>`):`<div class="emoji-shop-item-price">${item.price>0?item.price+'💰':'مجاني'}</div><div class="emoji-shop-lock">🔒</div>`}
        </div>`;
    }).join('');
    const cd = document.getElementById('shopCoinsDisplay'); if (cd) cd.textContent = st.coins;
    const ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';
}

function buyOrSelectEmoji(emoji, price) {
    if (!st.ownedEmojis) st.ownedEmojis = [getDefaultAvatarForGender(st.gender)];
    if (st.ownedEmojis.includes(emoji)) {
        st.avatar = emoji;
        saveSt();
        playSound('click');
        document.getElementById('headerAvatar').textContent = emoji;
        document.getElementById('profileAvatarImg').textContent = emoji;
        renderEmojiShop();
        updateBadgeIcon();
        return;
    }
    if (st.coins < price) { showFeedback('💸 لا يكفي!'); return; }
    showConfirm('شراء رمز', 'هل تريد شراء هذا الرمز بـ ' + price + ' عملة؟', 'نعم', 'إلغاء', ok => {
        if (ok) { st.coins -= price;
            st.ownedEmojis.push(emoji);
            st.avatar = emoji;
            saveSt();
            playSound('levelup');
            updateUI();
            renderEmojiShop();
            showFeedback('🎉 تم الشراء!'); }
    });
}

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
    for (let i = 1; i <= 31; i++) { let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        daySel.appendChild(opt); }
    for (let i = 1; i <= 12; i++) { let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        monthSel.appendChild(opt); }
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) { let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        yearSel.appendChild(opt); }
}

function loadProfileForm() {
    document.getElementById('inputName').value = st.name;
    if (st.birthDate) {
        let parts = st.birthDate.split('-');
        if (parts.length === 3) {
            document.getElementById('birthYear').value = parseInt(parts[0]);
            document.getElementById('birthMonth').value = parseInt(parts[1]);
            document.getElementById('birthDay').value = parseInt(parts[2]);
        }
    }
    selectGender(st.gender, false);
    updateOwnedEmojisForGender();
    renderEmojiShop();
    updateBadgeIcon();
    updateSerialNumberDisplay();
    document.getElementById('customColorPicker').value = st.customColor || st.tGold || '#f0b90b';
}

function selectGender(g, snd = true) {
    st.gender = g;
    document.getElementById('gBtnM').classList.toggle('active', g === 'm');
    document.getElementById('gBtnF').classList.toggle('active', g === 'f');
    updateOwnedEmojisForGender();
    if (snd) { playSound('click');
        renderEmojiShop();
        updateUI(); }
}

/* ═══════════ SAVE PROFILE ═══════════ */
function saveProfile() {
    let n = document.getElementById('inputName').value.trim();
    const nameRegex = /^[A-Za-z0-9\s]+$/;
    if (!nameRegex.test(n) || n === '') {
        showFeedback('⚠️ الاسم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط (بدون عربي)');
        return;
    }
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    let newBirthDate = `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    st.name = n;
    if (year && month && day) {
        st.birthDate = newBirthDate;
        st.age = calculateAgeFromBirthDate(newBirthDate);
    }
    updateOwnedEmojisForGender();
    if (!st.serialNumber && st.birthDate && st.name && st.name !== 'Player') {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
        saveSerialBackup(st.serialNumber, st);
        showFeedback('🔑 تم إنشاء رقم تسلسلي لحسابك!');
    }
    saveSt();
    updateUI();
    playSound('levelup');
    renderEmojiShop();
    updateSerialNumberDisplay();
    const btn = document.getElementById('saveBtn');
    const orig = btn.textContent;
    btn.textContent = '✅ تم الحفظ!';
    setTimeout(() => btn.textContent = orig, 1500);
}

/* ═══════════ THEMES ═══════════ */
function setTheme(el, gold, accent, accent2) {
    document.documentElement.style.setProperty('--gold', gold);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent2', accent2);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    if (el) el.classList.add('active');
    st.tGold = gold;
    st.tAccent = accent;
    st.tAccent2 = accent2;
    st.customColor = gold;
    document.getElementById('customColorPicker').value = gold;
    saveSt();
    playSound('click');
}

function applyTheme() {
    document.documentElement.style.setProperty('--gold', st.tGold || '#f0b90b');
    document.documentElement.style.setProperty('--accent', st.tAccent || '#7c3aed');
    document.documentElement.style.setProperty('--accent2', st.tAccent2 || '#06b6d4');
    document.getElementById('customColorPicker').value = st.customColor || st.tGold || '#f0b90b';
}

function applyCustomColor() {
    const color = document.getElementById('customColorPicker').value;
    st.customColor = color;
    document.documentElement.style.setProperty('--gold', color);
    st.tGold = color;
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    saveSt();
    updateUI();
}

function toggleDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    playSound('click');
}

function applyDarkMode() {
    if (st.darkMode) {
        document.documentElement.classList.remove('light-mode');
        document.getElementById('darkLightIcon').textContent = '🌙';
        document.getElementById('darkLightLabel').textContent = 'داكن';
    } else {
        document.documentElement.classList.add('light-mode');
        document.getElementById('darkLightIcon').textContent = '☀️';
        document.getElementById('darkLightLabel').textContent = 'فاتح';
    }
}

function confirmResetStats() {
    showConfirm('تصفير الإحصائيات',
        'هل أنت متأكد من تصفير جميع الإحصائيات؟\nلن يتأثر ملفك الشخصي أو عملاتك أو الرموز المشتراة.', 'تأكيد',
        'إلغاء', ok => {
            if (!ok) return;
            st.correctTotal = 0;
            st.wrongTotal = 0;
            st.bestStreak = 0;
            st.totalGames = 0;
            st.bestScore = 0;
            st.catCounter = { correct: 0, total: 0 };
            st.catChallenges = { games: 0 };
            st.history = [];
            st.xp = 0;
            st.level = 1;
            st.xpToNext = 1000;
            for (let k in st.stats) st.stats[k] = { att: 0, cor: 0, first: 0, stars: 0, max: 0 };
            st.achievementsUnlocked = [];
            st.achievementRewardClaimed = false;
            st.dailyStreak = 0;
            st.lastDailyDate = null;
            st.dailyShieldUsed = false;
            st.weeklyStats = {};
            st.marathonBest = 0;
            st.competitiveBest = 0;
            saveSt();
            updateUI();
            playSound('levelup');
            showFeedback('📊 تم التصفير!');
        });
}

function starsStr(r) { let s = '';
    const f = Math.floor(r);
    const h = r - f >= 0.5; for (let i = 0; i < f; i++) s += '⭐'; if (h) s += '✨'; for (let i = f + (h ? 1 : 0); i < 5; i++) s += '☆'; return s; }

function getTitle() { if (st.level < 3) return 'مبتدئ'; if (st.level < 6) return 'متعلم'; if (st.level < 10) return 'رياضي بارع'; if (st.level < 15) return 'خبير أرقام'; if (st.level < 25) return 'عالم رياضيات'; return 'عبقري رياضيات'; }

function updateUI() {
    const xpPct = Math.min(100, Math.round((st.xp / st.xpToNext) * 100));
    const ttl = getTitle();
    const av = st.avatar || getDefaultAvatarForGender(st.gender);
    document.getElementById('headerName').textContent = st.name;
    document.getElementById('headerSub').textContent = `Lv.${st.level} • ${ttl}`;
    document.getElementById('headerXpBar').style.width = xpPct + '%';
    document.getElementById('headerXp').textContent = `⚡ ${st.xp} XP`;
    document.getElementById('headerAvatar').textContent = av;
    document.getElementById('soundBtn').textContent = st.soundOn ? '🔊' : '🔇';
    document.getElementById('bgBtn').textContent = st.bgOn ? '🎵' : '🔕';
    document.getElementById('profileName').textContent = st.name;
    document.getElementById('profileLevel').textContent = `المستوى ${st.level} • ${ttl}`;
    document.getElementById('profileXpFill').style.width = xpPct + '%';
    document.getElementById('profileXpLabel').textContent = `${st.xp} / ${st.xpToNext} XP للمستوى التالي`;
    document.getElementById('profileAvatarImg').textContent = av;
    document.getElementById('statCorrect').textContent = st.correctTotal;
    document.getElementById('statBestStreak').textContent = '×' + st.bestStreak;
    document.getElementById('statCoinsP').textContent = st.coins;
    document.getElementById('soundStatus').textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    document.getElementById('bgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    updateHomeStats();
    renderHistory();
    renderTasks();
    renderAchievements();
    updateUnlocks();
    updateBadgeIcon();
    updateWeaknessArea();
    updateSerialNumberDisplay();
    drawWeeklyChart();
}

function updateHomeStats() {
    document.getElementById('homeCoins').textContent = st.coins;
    document.getElementById('homeCorrect').textContent = st.correctTotal;
    const total = st.correctTotal + st.wrongTotal;
    const acc = total > 0 ? Math.round((st.correctTotal / total) * 100) : 0;
    document.getElementById('homeAccuracy').textContent = acc + '%';
    document.getElementById('homeStreak').textContent = '×' + st.bestStreak;
    document.getElementById('homeGames').textContent = st.totalGames;
    document.getElementById('homeLevel').textContent = st.level;
    document.getElementById('homeBestScore').textContent = st.bestScore;
    let r = 0; if (total > 0) r += (acc / 100) * 2.5;
    r += Math.min(1.5, st.level * 0.15);
    r += Math.min(1.0, st.bestStreak * 0.1);
    r = Math.min(5, r);
    const rr = Math.round(r * 10) / 10;
    document.getElementById('ratingNum').textContent = rr.toFixed(1);
    document.getElementById('ratingBar').style.width = (r / 5 * 100) + '%';
    const rs = starsStr(r);
    document.getElementById('ratingStars').textContent = rs;
    const hs = document.getElementById('homeStars'); if (hs) hs.textContent = rs;
    const cc = st.catCounter;
    const cpct = cc.total > 0 ? Math.round((cc.correct / cc.total) * 100) : 0;
    document.getElementById('catProg0').style.width = cpct + '%';
    document.getElementById('catStats0').textContent = `${cpct}% • ${cc.correct} صح`;
    const cg = st.catChallenges.games;
    document.getElementById('catProg1').style.width = Math.min(100, cg * 10) + '%';
    document.getElementById('catStats1').textContent = `${cg} جلسة`;
    const g0 = document.getElementById('gcatProg0'), g1 = document.getElementById('gcatProg1');
    if (g0) g0.style.width = cpct + '%';
    if (g1) g1.style.width = Math.min(100, cg * 10) + '%';
    const gs0 = document.getElementById('gcatStats0'), gs1 = document.getElementById('gcatStats1');
    if (gs0) gs0.textContent = `${cc.correct} / ${cc.total} إجابة`;
    if (gs1) gs1.textContent = `${cg} جلسة تحدي`;
}

function renderHistory() {
    const sc = document.getElementById('historyScroll');
    if (!sc) return;
    if (!st.history || st.history.length === 0) { sc.innerHTML = '<div style="font-size:0.72em;color:var(--text3);padding:6px;">لا توجد نتائج بعد — العب الآن!</div>'; return; }
    const me = { classic: '🧮', speed: '⚡', survival: '🔥', frenzy: '💥', daily: '🌟', marathon: '🏃', competitive: '🏆' };
    sc.innerHTML = st.history.map(r => `<div class="hist-chip"><div class="hist-chip-icon">${me[r.mode]||'🎮'}</div><div class="hist-chip-score">${r.score}</div><div class="hist-chip-acc">${r.acc}%</div></div>`).join('');
}

function updateWeaknessArea() {
    const area = document.getElementById('weaknessArea');
    if (!area) return;
    const cats = Object.keys(st.stats).filter(k => st.stats[k]?.att > 4);
    if (!cats.length) { area.innerHTML = ''; return; }
    const w = cats.reduce((a, b) => (st.stats[a]?.cor / st.stats[a]?.att) < (st.stats[b]?.cor / st.stats[b]?.att) ? a : b);
    const names = { addition:'الجمع', subtraction:'الطرح', multiplication:'الضرب', division:'القسمة', table:'جدول الضرب', squareroot:'الجذور', percentage:'النسب', algebra:'المعادلات', mathlaws:'القوانين', puzzles:'الألغاز', geometry:'الهندسة', wordproblems:'المسائل' };
    area.innerHTML = `⚠️ تحتاج تحسين: <strong>${names[w]||w}</strong> <button style="background:var(--gold);color:#000;border:none;padding:4px 10px;border-radius:12px;font-size:0.72em;cursor:pointer;margin-right:6px;" onclick="startTrainingOn('${w}')">تدرب الآن</button>`;
}

function startTrainingOn(cat) { startTrainingMode(cat); }

/* ═══════════ UNLOCK DISPLAY ═══════════ */
function updateUnlocks() {
    const level = st.level;
    // التحديات
    const challengesUnlocked = level >= 4;
    const playCardChallenges = document.getElementById('playCardChallenges');
    const homeCatChallenges = document.getElementById('homeCatChallenges');
    if (playCardChallenges) {
        if (!challengesUnlocked) { playCardChallenges.classList.add('locked'); playCardChallenges.onclick = null; playCardChallenges.querySelector('.gcard-badge').textContent = '🔒 Lv.4'; }
        else { playCardChallenges.classList.remove('locked'); playCardChallenges.onclick = () => openOpSheet('challenges'); playCardChallenges.querySelector('.gcard-badge').textContent = 'متاح'; }
    }
    if (homeCatChallenges) {
        if (!challengesUnlocked) { homeCatChallenges.classList.add('locked'); homeCatChallenges.onclick = null; }
        else { homeCatChallenges.classList.remove('locked'); homeCatChallenges.onclick = () => openOpSheet('challenges'); }
    }
    // متقدمة
    const advancedUnlocked = level >= 7;
    const gcardAdvanced = document.getElementById('gcardAdvanced');
    const catAdvanced = document.getElementById('catAdvanced');
    const lockProgAdvGame = document.getElementById('lockProgAdvGame');
    const lockProgAdvanced = document.getElementById('lockProgAdvanced');
    if (gcardAdvanced) {
        if (!advancedUnlocked) {
            gcardAdvanced.classList.add('locked'); gcardAdvanced.onclick = null;
            gcardAdvanced.querySelector('.gcard-badge').textContent = '🔒 Lv.7';
            if (document.getElementById('gcardAdvancedStats')) document.getElementById('gcardAdvancedStats').textContent = 'يفتح عند Lv.7';
        } else {
            gcardAdvanced.classList.remove('locked'); gcardAdvanced.onclick = () => startGameWith('classic','advanced',null,true);
            gcardAdvanced.querySelector('.gcard-badge').textContent = 'متاح';
            if (document.getElementById('gcardAdvancedStats')) document.getElementById('gcardAdvancedStats').textContent = 'اضغط للعب';
        }
    }
    if (catAdvanced) {
        if (!advancedUnlocked) {
            catAdvanced.classList.add('locked'); catAdvanced.onclick = null;
            document.getElementById('catAdvancedStats').textContent = '🔒 يفتح Lv.7';
        } else {
            catAdvanced.classList.remove('locked'); catAdvanced.onclick = () => startGameWith('classic','advanced',null,true);
            document.getElementById('catAdvancedStats').textContent = 'اضغط للعب';
        }
    }
    const advPct = Math.min(100, (level/7)*100);
    if (lockProgAdvGame) { lockProgAdvGame.style.display = advancedUnlocked ? 'none' : 'block'; lockProgAdvGame.querySelector('.lock-progress-fill').style.width = advPct+'%'; }
    if (lockProgAdvanced) { lockProgAdvanced.style.display = advancedUnlocked ? 'none' : 'block'; lockProgAdvanced.querySelector('.lock-progress-fill').style.width = advPct+'%'; }
    // قوانين
    const lawsUnlocked = level >= 10;
    const gcardLaws = document.getElementById('gcardLaws');
    const catLaws = document.getElementById('catLaws');
    const lockProgLawsGame = document.getElementById('lockProgLawsGame');
    const lockProgLaws = document.getElementById('lockProgLaws');
    if (gcardLaws) {
        if (!lawsUnlocked) {
            gcardLaws.classList.add('locked'); gcardLaws.onclick = null;
            gcardLaws.querySelector('.gcard-badge').textContent = '🔒 Lv.10';
            if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent = 'يفتح عند Lv.10';
        } else {
            gcardLaws.classList.remove('locked'); gcardLaws.onclick = () => startGameWith('classic','laws',null,true);
            gcardLaws.querySelector('.gcard-badge').textContent = 'متاح';
            if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent = 'اضغط للعب';
        }
    }
    if (catLaws) {
        if (!lawsUnlocked) {
            catLaws.classList.add('locked'); catLaws.onclick = null;
            document.getElementById('catLawsStats').textContent = '🔒 يفتح Lv.10';
        } else {
            catLaws.classList.remove('locked'); catLaws.onclick = () => startGameWith('classic','laws',null,true);
            document.getElementById('catLawsStats').textContent = 'اضغط للعب';
        }
    }
    const lawsPct = Math.min(100, (level/10)*100);
    if (lockProgLawsGame) { lockProgLawsGame.style.display = lawsUnlocked ? 'none' : 'block'; lockProgLawsGame.querySelector('.lock-progress-fill').style.width = lawsPct+'%'; }
    if (lockProgLaws) { lockProgLaws.style.display = lawsUnlocked ? 'none' : 'block'; lockProgLaws.querySelector('.lock-progress-fill').style.width = lawsPct+'%'; }
    // صعوبات
    const diffMedium = document.getElementById('diffMedium');
    const diffHard = document.getElementById('diffHard');
    const diffGenius = document.getElementById('diffGenius');
    if (diffMedium) {
        if (level>=3) { diffMedium.classList.remove('locked'); document.getElementById('lockMedium').style.display='none'; }
        else { diffMedium.classList.add('locked'); document.getElementById('lockMedium').style.display='block'; }
    }
    if (diffHard) {
        if (level>=5) { diffHard.classList.remove('locked'); document.getElementById('lockHard').style.display='none'; }
        else { diffHard.classList.add('locked'); document.getElementById('lockHard').style.display='block'; }
    }
    if (diffGenius) {
        if (level>=8) { diffGenius.classList.remove('locked'); document.getElementById('lockGenius').style.display='none'; }
        else { diffGenius.classList.add('locked'); document.getElementById('lockGenius').style.display='block'; }
    }
}

/* ═══════════ COMPETITIVE ═══════════ */
function startCompetitiveChallenge() {
    startGameWith('competitive', 'mix', null, false);
}

/* ═══════════ LEADERBOARD ═══════════ */
function syncWithLeaderboard() {
    if (!database || !st.serialNumber) return;
    syncLeaderboard(st.name, st.avatar, st.level, st.bestScore);
}

function loadLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    if (!database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);">⚠️ قاعدة البيانات غير متصلة<br>قم بتكوين Firebase لتفعيل المنافسة</div>';
        return;
    }
    container.innerHTML = '<div style="text-align:center;">⏳ جاري التحميل...</div>';
    fetchTopPlayers(players => {
        if (players.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:20px;">لا توجد نتائج بعد — العب تحدي المنافسة 🏆</div>';
            return;
        }
        let html = '<div class="lb-row lb-header"><span>المرتبة</span><span>اللاعب</span><span>المستوى</span><span>أفضل نقاط</span></div>';
        players.forEach((p, idx) => {
            const bg = idx < 3 ? 'background:rgba(240,185,11,'+(0.15-idx*0.04)+');' : '';
            html += `<div class="lb-row" style="${bg}"><span>${idx+1}</span><span>${p.avatar||'🧑'} ${p.name}</span><span>${p.level}</span><span>${p.bestScore}</span></div>`;
        });
        container.innerHTML = html;
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

/* ═══════════ INIT ═══════════ */
initDateSelectors();
checkDailyReset();
applyTheme();
applyDarkMode();
updateUI();
loadProfileForm();
(function() {
    const chips = document.querySelectorAll('.diff-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (st.difficulty === 'medium') { const c = document.getElementById('diffMedium'); if (c && !c.classList.contains('locked')) c.classList.add('active'); else chips[0].classList.add('active'); }
    else if (st.difficulty === 'hard') { const c = document.getElementById('diffHard'); if (c && !c.classList.contains('locked')) c.classList.add('active'); else chips[0].classList.add('active'); }
    else if (st.difficulty === 'genius') { const c = document.getElementById('diffGenius'); if (c && !c.classList.contains('locked')) c.classList.add('active'); else chips[0].classList.add('active'); }
    else { chips[0].classList.add('active'); }
})();
updSessionTimer();
updCountdown();
if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });
setTimeout(() => {
    const ss = document.getElementById('splashScreen');
    if (ss) { ss.classList.add('hidden'); setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
}, 2800);
document.addEventListener('touchstart', function() { gACtx(); if (aCtx && aCtx.state === 'suspended') aCtx.resume(); }, { once: true });
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW registration failed:', err));
    });
}
