// ui-handler.js

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
        return `<div class="emoji-shop-item ${owned?'owned':''} ${selected?'selected':''} ${!owned&&!selected?'locked-shop':''}" onclick="buyOrSelectEmoji('${item.emoji}',${item.price})" role="button" aria-label="${item.label} ${owned?'مملوك':item.price+' عملة'}">
            <div class="emoji-shop-item-icon">${item.emoji}</div>
            ${owned
                ? (selected ? `<div class="emoji-shop-item-owned">✅ مفعّل</div>` : `<div class="emoji-shop-item-owned">مملوك</div>`)
                : `<div class="emoji-shop-item-price">${item.price>0 ? item.price+'💰' : 'مجاني'}</div><div class="emoji-shop-lock">🔒</div>`
            }
        </div>`;
    }).join('');
    const cd = document.getElementById('shopCoinsDisplay'); if (cd) cd.textContent = st.coins;
    const ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';
}

function buyOrSelectEmoji(emoji, price) {
    if (!st.ownedEmojis) st.ownedEmojis = [getDefaultAvatarForGender(st.gender)];
    if (st.ownedEmojis.includes(emoji)) { st.avatar = emoji; saveSt(); playSound('click'); updateUI(); renderEmojiShop(); return; }
    if (st.coins < price) { showFeedback('💸 لا يكفي!'); return; }
    showConfirm('شراء رمز', `هل تريد شراء ${emoji} بـ ${price} عملة؟`, 'نعم', 'إلغاء', ok => {
        if (ok) { st.coins -= price; st.ownedEmojis.push(emoji); st.avatar = emoji; saveSt(); playSound('levelup'); updateUI(); renderEmojiShop(); showFeedback('🎉 تم الشراء!'); if (typeof syncUserData === 'function') syncUserData(st); }
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
    const daySel = document.getElementById('birthDay'), monthSel = document.getElementById('birthMonth'), yearSel = document.getElementById('birthYear');
    if (!daySel) return;
    daySel.innerHTML = ''; monthSel.innerHTML = ''; yearSel.innerHTML = '';
    for (let i = 1; i <= 31; i++) { let opt = document.createElement('option'); opt.value = i; opt.textContent = i; daySel.appendChild(opt); }
    for (let i = 1; i <= 12; i++) { let opt = document.createElement('option'); opt.value = i; opt.textContent = i; monthSel.appendChild(opt); }
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) { let opt = document.createElement('option'); opt.value = i; opt.textContent = i; yearSel.appendChild(opt); }
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
    updateConnectionStatus();
}

function selectGender(g, snd = true) {
    st.gender = g;
    document.getElementById('gBtnM').classList.toggle('active', g === 'm');
    document.getElementById('gBtnF').classList.toggle('active', g === 'f');
    updateOwnedEmojisForGender();
    if (snd) { playSound('click'); renderEmojiShop(); updateUI(); }
}

function saveProfile() {
    let n = document.getElementById('inputName').value.trim();
    const nameRegex = /^[A-Za-z0-9\s]+$/;
    if (!nameRegex.test(n) || n === '') { showFeedback('⚠️ الاسم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط (بدون عربي)'); return; }
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    let newBirthDate = `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    st.name = n;
    if (year && month && day) { st.birthDate = newBirthDate; st.age = calculateAgeFromBirthDate(newBirthDate); }
    updateOwnedEmojisForGender();
    if (!st.serialNumber && st.birthDate && st.name && st.name !== 'Player') {
        st.serialNumber = generateSerialNumber(st.birthDate, st.name);
        saveSerialBackup(st.serialNumber, st);
        showFeedback('🔑 تم إنشاء رقم تسلسلي لحسابك!');
    }
    saveSt(); updateUI(); playSound('levelup'); renderEmojiShop(); updateSerialNumberDisplay();
    if (typeof syncUserData === 'function') syncUserData(st);
    const btn = document.getElementById('saveBtn'); const orig = btn.textContent; btn.textContent = '✅ تم الحفظ!'; setTimeout(() => btn.textContent = orig, 1500);
}

/* ═══════════ THEMES ═══════════ */
function setTheme(el, gold, accent, accent2) {
    document.documentElement.style.setProperty('--gold', gold);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent2', accent2);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    el.classList.add('active');
    st.tGold = gold; st.tAccent = accent; st.tAccent2 = accent2; saveSt(); playSound('click');
}
function applyTheme() {
    document.documentElement.style.setProperty('--gold', st.tGold || '#f0b90b');
    document.documentElement.style.setProperty('--accent', st.tAccent || '#7c3aed');
    document.documentElement.style.setProperty('--accent2', st.tAccent2 || '#06b6d4');
}
function toggleDarkMode() { st.darkMode = !st.darkMode; saveSt(); applyDarkMode(); playSound('click'); }
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
    showConfirm('تصفير الإحصائيات', 'هل أنت متأكد من تصفير جميع الإحصائيات؟\nلن يتأثر ملفك الشخصي أو عملاتك أو الرموز المشتراة.', 'تأكيد', 'إلغاء', ok => {
        if (!ok) return;
        st.correctTotal = 0; st.wrongTotal = 0; st.bestStreak = 0; st.totalGames = 0; st.bestScore = 0;
        st.catCounter = { correct: 0, total: 0 }; st.catChallenges = { games: 0 };
        st.history = []; st.xp = 0; st.level = 1; st.xpToNext = 1000;
        for (let k in st.stats) st.stats[k] = { att: 0, cor: 0, first: 0, stars: 0, max: 0 };
        st.achievementsUnlocked = []; st.achievementRewardClaimed = false;
        st.dailyStreak = 0; st.lastDailyDate = null; st.dailyShieldUsed = false;
        saveSt(); updateUI(); playSound('levelup'); showFeedback('📊 تم التصفير!');
        if (typeof syncUserData === 'function') syncUserData(st);
    });
}

function starsStr(r) { let s = ''; const f = Math.floor(r); const h = r - f >= 0.5; for (let i = 0; i < f; i++) s += '⭐'; if (h) s += '✨'; for (let i = f + (h ? 1 : 0); i < 5; i++) s += '☆'; return s; }
function getTitle() {
    if (st.level < 3) return 'مبتدئ'; if (st.level < 6) return 'متعلم'; if (st.level < 10) return 'رياضي بارع';
    if (st.level < 15) return 'خبير أرقام'; if (st.level < 25) return 'عالم رياضيات'; return 'عبقري رياضيات';
}

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
    updateConnectionStatus();
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
    let r = 0; if (total > 0) r += (acc / 100) * 2.5; r += Math.min(1.5, st.level * 0.15); r += Math.min(1.0, st.bestStreak * 0.1); r = Math.min(5, r);
    const rr = Math.round(r * 10) / 10;
    document.getElementById('ratingNum').textContent = rr.toFixed(1);
    document.getElementById('ratingBar').style.width = (r / 5 * 100) + '%';
    document.getElementById('ratingStars').textContent = starsStr(r);
    document.getElementById('homeStars').textContent = starsStr(r);
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
    sc.innerHTML = st.history.map(r => `<div class="hist-chip"><div class="hist-chip-icon">${({classic:'🧮',speed:'⚡',survival:'🔥',frenzy:'💥',daily:'🌟'}[r.mode]||'🎮')}</div><div class="hist-chip-score">${r.score}</div><div class="hist-chip-acc">${r.acc}%</div></div>`).join('');
}

function updateWeaknessArea() {
    const area = document.getElementById('weaknessArea');
    if (!area) return;
    const cats = Object.keys(st.stats).filter(k => st.stats[k]?.att > 4);
    if (!cats.length) { area.innerHTML = ''; return; }
    const w = cats.reduce((a, b) => (st.stats[a]?.cor/st.stats[a]?.att) < (st.stats[b]?.cor/st.stats[b]?.att) ? a : b);
    const names = { addition:'الجمع', subtraction:'الطرح', multiplication:'الضرب', division:'القسمة', table:'جدول الضرب', squareroot:'الجذور', percentage:'النسب', algebra:'المعادلات', mathlaws:'القوانين', puzzles:'الألغاز', geometry:'الهندسة', wordproblems:'المسائل' };
    area.innerHTML = `⚠️ تحتاج تحسين: <strong>${names[w]||w}</strong> <button style="background:var(--gold);color:#000;border:none;padding:4px 10px;border-radius:12px;font-size:0.72em;cursor:pointer;margin-right:6px;" onclick="startTrainingOn('${w}')">تدرب الآن</button>`;
}

function startTrainingOn(cat) { startTrainingMode(cat); }

/* ═══════════ TASKS & ACHIEVEMENTS ═══════════ */
function renderTasks() {
    const tasksData = st.dailyTasks;
    let filtered = tasksData;
    if (st.level < 2) filtered = tasksData.filter(t => ['t1', 't2'].includes(t.id));
    else if (st.level < 4) filtered = tasksData.filter(t => ['t1', 't2', 't3'].includes(t.id));
    else if (st.level < 5) filtered = tasksData.filter(t => ['t1', 't2', 't3', 't4'].includes(t.id));
    const doneCount = filtered.filter(t => t.done).length;
    const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;
    const totalR = filtered.filter(t => t.done).reduce((s, t) => s + t.reward, 0);
    const tasksContainer = document.getElementById('tasksList');
    if (tasksContainer) {
        tasksContainer.innerHTML = filtered.map(t => {
            const p = Math.min(100, Math.round((t.progress / t.goal) * 100));
            return `<div class="task-item ${t.done?'done':''}">
                <div class="task-item-icon">${t.icon}</div>
                <div class="task-item-info"><div class="task-item-name">${t.name}</div><div class="task-item-desc">${t.desc}</div><div class="task-prog-bar"><div class="task-prog-fill" style="width:${p}%"></div></div></div>
                <div class="task-right"><div class="task-reward">${t.done?'✅':`+${t.reward}💰`}</div>${t.done?'':`<div class="task-prog-txt">${t.progress}/${t.goal}</div>`}</div>
            </div>`;
        }).join('');
    }
    document.getElementById('tasksDone').textContent = doneCount;
    document.getElementById('tasksTotal').textContent = filtered.length;
    document.getElementById('tasksCoins').textContent = totalR + '💰';
    document.getElementById('tasksPct').textContent = pct + '%';
    document.getElementById('tasksBarFill').style.width = pct + '%';
    document.getElementById('profileTaskStatus').textContent = `${doneCount} / ${filtered.length} ›`;
}

function renderAchievements() {
    const el = document.getElementById('achieveList');
    if (!el) return;
    const total = ACHIEVEMENTS_DEF.length;
    const doneCount = st.achievementsUnlocked.length;
    document.getElementById('achievePct').textContent = `${doneCount}/${total}`;
    el.innerHTML = ACHIEVEMENTS_DEF.map(a => {
        let done = st.achievementsUnlocked.includes(a.id) || a.check();
        return `<div class="task-item ${done?'done':''}">
            <div class="task-item-icon">${a.icon}</div>
            <div class="task-item-info"><div class="task-item-name">${a.name}</div><div class="task-item-desc">${a.desc}</div></div>
            <div class="task-right"><div class="task-reward">${done?'✅':`+${a.reward}💰`}</div></div>
        </div>`;
    }).join('');
    const rewardDiv = document.getElementById('achieveCompleteReward');
    if (rewardDiv) rewardDiv.style.display = doneCount === total ? 'block' : 'none';
}

function updateBadgeIcon() {
    const el = document.getElementById('badgeDisplay');
    if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join('');
}

/* ... (باقي الدوال مثل updateUnlocks, goTab, openSheet, leaderboard, connection status, init) ... */
// يجب أن تكمل الملف بباقي الدوال التي كانت في النسخة السابقة، ولكن مع حذف دوال session timer.
// يمكنك نسخ بقية الملف من الإصدار المحسن السابق (ui-handler.js) الذي أرسلته، ثم حذف الأجزاء التي تتعامل مع sessionStart و getSessionSecs و updSessionTimer و setInterval الخاصة بها، لأنها موجودة في storage.js.
