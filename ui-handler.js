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

/* ═══════════ SAVE PROFILE (بدون serial) ═══════════ */
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
    saveSt();
    updateUI();
    playSound('levelup');
    renderEmojiShop();
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
    el.classList.add('active');
    st.tGold = gold;
    st.tAccent = accent;
    st.tAccent2 = accent2;
    saveSt();
    playSound('click');
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
            st.bestCompScore = 0;
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
    const g0 = document.getElementById('gcatProg0'),
        g1 = document.getElementById('gcatProg1');
    if (g0) g0.style.width = cpct + '%';
    if (g1) g1.style.width = Math.min(100, cg * 10) + '%';
    const gs0 = document.getElementById('gcatStats0'),
        gs1 = document.getElementById('gcatStats1');
    if (gs0) gs0.textContent = `${cc.correct} / ${cc.total} إجابة`;
    if (gs1) gs1.textContent = `${cg} جلسة تحدي`;
}

function renderHistory() {
    const sc = document.getElementById('historyScroll');
    if (!sc) return;
    if (!st.history || st.history.length === 0) { sc.innerHTML = '<div style="font-size:0.72em;color:var(--text3);padding:6px;">لا توجد نتائج بعد — العب الآن!</div>'; return; }
    const me = { classic: '🧮', speed: '⚡', survival: '🔥', frenzy: '💥', daily: '🌟', competition: '⚔️' };
    sc.innerHTML = st.history.map(r => `<div class="hist-chip"><div class="hist-chip-icon">${me[r.mode]||'🎮'}</div><div class="hist-chip-score">${r.score}</div><div class="hist-chip-acc">${r.acc}%</div></div>`).join('');
}

function updateWeaknessArea() {
    const area = document.getElementById('weaknessArea');
    if (!area) return;
    const cats = Object.keys(st.stats).filter(k => st.stats[k]?.att > 4);
    if (!cats.length) { area.innerHTML = ''; return; }
    const w = cats.reduce((a, b) => (st.stats[a]?.cor / st.stats[a]?.att) < (st.stats[b]?.cor / st.stats[b]?.att) ? a : b);
    const names = { addition: 'الجمع', subtraction: 'الطرح', multiplication: 'الضرب', division: 'القسمة',
        table: 'جدول الضرب', squareroot: 'الجذور', percentage: 'النسب', algebra: 'المعادلات',
        mathlaws: 'القوانين', puzzles: 'الألغاز', geometry: 'الهندسة', wordproblems: 'المسائل' };
    area.innerHTML = `⚠️ تحتاج تحسين: <strong>${names[w]||w}</strong> <button style="background:var(--gold);color:#000;border:none;padding:4px 10px;border-radius:12px;font-size:0.72em;cursor:pointer;margin-right:6px;" onclick="startTrainingOn('${w}')">تدرب الآن</button>`;
}

function startTrainingOn(cat) { startTrainingMode(cat); }

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

/* ═══════════ LEADERBOARD (بدون serial) ═══════════ */
function getLeaderboardKey() {
    // نستخدم معرف فريد من جوجل إذا كان موجوداً، وإلا نستخدم اسم المستخدم + تاريخ
    if (st.googleUid) return st.googleUid;
    const safeName = (st.name || 'Player').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '').slice(0, 12);
    let guestKey = localStorage.getItem('ho_math_guest_key');
    if (!guestKey) {
        guestKey = 'guest_' + safeName + '_' + Math.floor(Math.random() * 99999);
        localStorage.setItem('ho_math_guest_key', guestKey);
    }
    return guestKey;
}

function syncWithLeaderboard() {
    if (!database) return;
    if (!st.name || st.name === 'Player' || (st.bestScore <= 0 && st.bestCompScore <= 0)) return;
    try {
        const key = getLeaderboardKey();
        const playerRef = database.ref('leaderboard/' + key);
        playerRef.set({
            name: st.name,
            avatar: st.avatar || '🧑',
            level: st.level,
            bestScore: st.bestScore,
            bestCompScore: st.bestCompScore,
            totalXp: st.xp,
            lastUpdated: Date.now()
        }).catch((e) => { console.warn('فشل رفع النتيجة:', e.message); });
    } catch (e) { console.warn('خطأ في syncWithLeaderboard:', e.message); }
}

let leaderboardListener = null;

function renderLeaderboardData(snapshot) {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    try {
        const players = [];
        snapshot.forEach(function(child) {
            players.push(Object.assign({ id: child.key }, child.val()));
        });
        players.sort(function(a, b) { return (b.bestScore || 0) - (a.bestScore || 0); });
        var top10 = players.slice(0, 10);
        if (top10.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);">🏁 لا توجد نتائج بعد<br><small>العب جولة لتظهر في اللوحة!</small></div>';
            return;
        }
        var myKey = getLeaderboardKey();
        var medals = ['🥇', '🥈', '🥉'];
        var html = '';
        top10.forEach(function(p, idx) {
            var isMe = p.id === myKey || p.id === st.googleUid;
            var medal = idx < 3 ? medals[idx] : (idx + 1);
            var rowStyle = isMe ? 'background:rgba(124,58,237,0.13);border:1.5px solid var(--accent,#7c3aed);border-radius:10px;' : '';
            var meTag = isMe ? ' <small style="color:var(--accent,#7c3aed);font-size:0.8em;">(أنت)</small>' : '';
            html += '<div class="lb-row" style="' + rowStyle + '">' +
                '<span style="font-size:1.15em;font-weight:700;">' + medal + '</span>' +
                '<span>' + (p.avatar || '🧑') + ' ' + (p.name || '—') + meTag + '</span>' +
                '<span>Lv.' + (p.level || 1) + '</span>' +
                '<span style="color:var(--gold,#f0b90b);font-weight:800;">' + (p.bestScore || 0) + '</span>' +
                '</div>';
        });
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:20px;">⚠️ خطأ في عرض البيانات</div>';
    }
}

function loadLeaderboard() {
    var container = document.getElementById('leaderboardList');
    if (!container) return;
    if (!database) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);">⚠️ قاعدة البيانات غير متصلة<br><small>تأكد من الاتصال بالإنترنت</small></div>';
        return;
    }
    container.innerHTML = '<div style="text-align:center;padding:20px;">⏳ جاري التحميل...</div>';
    if (leaderboardListener) {
        try { database.ref('leaderboard').off('value', leaderboardListener); } catch(e) {}
        leaderboardListener = null;
    }
    try {
        leaderboardListener = database.ref('leaderboard')
            .orderByChild('bestScore')
            .limitToLast(50)
            .on('value', renderLeaderboardData, function(err) {
                if (container) container.innerHTML = '<div style="text-align:center;padding:20px;">⚠️ فشل التحميل: ' + (err.message || 'تحقق من الإنترنت') + '</div>';
                leaderboardListener = null;
            });
    } catch (e) {
        container.innerHTML = '<div style="text-align:center;padding:20px;">⚠️ قاعدة البيانات غير متاحة</div>';
    }
}

function stopLeaderboardListener() {
    if (leaderboardListener && database) {
        try { database.ref('leaderboard').off('value', leaderboardListener); } catch(e) {}
        leaderboardListener = null;
    }
}

/* ══════════════════════════════════════
   تسجيل الدخول بـ Google وإدارة Splash
   ══════════════════════════════════════ */
let splashHidden = false;

function showAppWrapper() {
    document.getElementById('appWrapper').style.display = 'flex';
    document.getElementById('splashScreen').classList.add('hidden');
    setTimeout(() => {
        const ss = document.getElementById('splashScreen');
        if (ss) ss.style.display = 'none';
    }, 500);
}

function signInWithGoogle() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showFeedback('⚠️ خدمة المصادقة غير متوفرة');
        return;
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        updateGoogleUserUI(user);
        st.googleUid = user.uid;
        st.googleEmail = user.email;
        if (!st.name || st.name === 'Player') {
            st.name = user.displayName ? user.displayName.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 30) : st.name;
        }
        if (user.photoURL && !st.customPhotoURL) {
            st.customPhotoURL = user.photoURL;
            applyAvatarPhoto(user.photoURL);
        }
        saveSt();
        updateUI();
        showFeedback('✅ تم تسجيل الدخول بنجاح');
        showAppWrapper();
    }).catch(function(err) {
        console.warn('Google sign-in error:', err.message);
        showFeedback('❌ فشل تسجيل الدخول');
    });
}

function signOutGoogle() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    firebase.auth().signOut().then(function() {
        document.getElementById('googleSignedIn').style.display = 'none';
        document.getElementById('googleSignedOut').style.display = 'block';
        showFeedback('👋 تم تسجيل الخروج');
    });
}

function updateGoogleUserUI(user) {
    var signedIn = document.getElementById('googleSignedIn');
    var signedOut = document.getElementById('googleSignedOut');
    if (!signedIn || !signedOut) return;
    if (user) {
        signedIn.style.display = 'block';
        signedOut.style.display = 'none';
        var photo = document.getElementById('googleUserPhoto');
        var name = document.getElementById('googleUserName');
        var email = document.getElementById('googleUserEmail');
        if (photo) photo.src = user.photoURL || '';
        if (name) name.textContent = user.displayName || '—';
        if (email) email.textContent = user.email || '—';
    } else {
        signedIn.style.display = 'none';
        signedOut.style.display = 'block';
    }
}

function initAuthState() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    firebase.auth().onAuthStateChanged(function(user) {
        updateGoogleUserUI(user);
        if (user && user.photoURL && !st.customPhotoURL) {
            st.customPhotoURL = user.photoURL;
            applyAvatarPhoto(user.photoURL);
        }
        if (user && !splashHidden) {
            // إذا كان المستخدم مسجلاً بالفعل، نعرض التطبيق مباشرة
            showAppWrapper();
            splashHidden = true;
        }
    });
}

/* ══════════════════════════════════════
   الصورة الشخصية والإطارات
   ══════════════════════════════════════ */
var FRAMES = [
    { id: 'none',    label: 'بلا إطار', color: 'transparent', css: '' },
    { id: 'gold',    label: 'ذهبي',     color: '#f0b90b',     css: 'frame-gold' },
    { id: 'blue',    label: 'أزرق',     color: '#06b6d4',     css: 'frame-blue' },
    { id: 'green',   label: 'أخضر',     color: '#10b981',     css: 'frame-green' },
    { id: 'red',     label: 'أحمر',     color: '#ef4444',     css: 'frame-red' },
    { id: 'purple',  label: 'بنفسجي',   color: '#a855f7',     css: 'frame-purple' },
    { id: 'rainbow', label: 'ملوّن',    color: 'linear-gradient(135deg,#f0b90b,#ef4444,#a855f7,#06b6d4)', css: 'frame-rainbow' },
];

function renderFramePicker() {
    var picker = document.getElementById('framePicker');
    if (!picker) return;
    var current = st.avatarFrame || 'none';
    picker.innerHTML = FRAMES.map(function(f) {
        var sel = f.id === current ? ' selected' : '';
        var borderStyle = f.id === 'rainbow'
            ? 'border: 3px solid; border-image: linear-gradient(135deg,#f0b90b,#ef4444,#a855f7,#06b6d4) 1;'
            : (f.id === 'none' ? 'border: 2px dashed var(--border2);' : 'border: 3px solid ' + f.color + ';');
        return '<div class="frame-option' + sel + '" onclick="selectFrame(\'' + f.id + '\')" title="' + f.label + '">' +
            '<div class="frame-preview" style="' + borderStyle + '">' +
            (st.customPhotoURL ? '<img src="' + st.customPhotoURL + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">' : (st.avatar || '🧑')) +
            '</div></div>';
    }).join('');
}

function selectFrame(frameId) {
    st.avatarFrame = frameId;
    saveSt();
    applyAvatarFrame(frameId);
    renderFramePicker();
}

function applyAvatarFrame(frameId) {
    var wrap = document.querySelector('.avatar-wrap');
    if (!wrap) return;
    FRAMES.forEach(function(f) { if (f.css) wrap.classList.remove(f.css); });
    var frame = FRAMES.find(function(f) { return f.id === frameId; });
    if (frame && frame.css) wrap.classList.add(frame.css);
}

function handleAvatarUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showFeedback('❌ يرجى اختيار صورة'); return; }
    if (file.size > 2 * 1024 * 1024) { showFeedback('❌ الصورة أكبر من 2MB'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
        var dataUrl = e.target.result;
        st.customPhotoURL = dataUrl;
        saveSt();
        applyAvatarPhoto(dataUrl);
        showFeedback('✅ تم رفع الصورة');
    };
    reader.readAsDataURL(file);
}

function applyAvatarPhoto(url) {
    var headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) {
        headerAvatar.classList.add('has-photo');
        headerAvatar.innerHTML = '<img src="' + url + '" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    }
    var profileAvatar = document.getElementById('profileAvatarImg');
    if (profileAvatar) {
        profileAvatar.classList.add('has-photo');
        profileAvatar.innerHTML = '<img src="' + url + '" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    }
    var preview = document.getElementById('avatarUploadPreview');
    if (preview) {
        preview.innerHTML = '<img src="' + url + '" alt="avatar">';
    }
}

function openAvatarOptions() {
    document.getElementById('avatarFileInput').click();
}

function initAvatarAndFrame() {
    if (st.customPhotoURL) {
        applyAvatarPhoto(st.customPhotoURL);
    }
    if (st.avatarFrame) {
        applyAvatarFrame(st.avatarFrame);
    }
}

/* ═══════════ INITIALIZATION ═══════════ */
function initSplashButtons() {
    const guestBtn = document.getElementById('guestBtn');
    const googleBtn = document.getElementById('googleSignInBtn');
    if (guestBtn) {
        guestBtn.onclick = () => {
            showAppWrapper();
            splashHidden = true;
        };
    }
    if (googleBtn) {
        googleBtn.onclick = () => {
            signInWithGoogle();
        };
    }
}

// تهيئة عامة
initDateSelectors();
checkDailyReset();
applyTheme();
applyDarkMode();
updateUI();
loadProfileForm();
initAvatarAndFrame();
initAuthState();
initSplashButtons();
renderFramePicker();
// استعادة الصعوبة النشطة
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
// إخفاء splash بعد 2.8 ثانية إذا لم يتم التفاعل (اختياري)
setTimeout(() => {
    if (!splashHidden && !st.googleUid) {
        // إذا لم يسجل دخول ولا ضيف، نعرض الخيارات للمستخدم
    }
}, 3000);
document.addEventListener('touchstart', function() { gACtx(); if (aCtx && aCtx.state === 'suspended') aCtx.resume(); }, { once: true });
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW registration failed:', err));
    });
}

/* ═══════════ OPEN SETTINGS SHEET ═══════════ */
function openSettingsSheet() {
    updateSettingsSheet();
    openSheet('settingsSheet');
}
function updateSettingsSheet() {
    var ss = document.getElementById('sheetSoundStatus');
    var bs = document.getElementById('sheetBgStatus');
    if (ss) ss.textContent = st.soundOn ? 'مفعّل' : 'معطّل';
    if (bs) bs.textContent = st.bgOn ? 'مفعّلة' : 'معطّلة';
}
