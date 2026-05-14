function openMainSettings() {
            updateMainSettingsUI();
            openSheet('mainSettingsSheet');
        }

        function updateMainSettingsUI() {
            const sv = st.soundVolume !== undefined ? st.soundVolume : 80;
            const bv = st.bgVolume !== undefined ? st.bgVolume : 30;
            // main sheet
            const ms = document.getElementById('msSoundStatus'); if (ms) ms.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
            const mb = document.getElementById('msBgStatus'); if (mb) mb.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
            const mv = document.getElementById('msVibStatus'); if (mv) mv.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
            const mss = document.getElementById('msSoundSlider'); if (mss) mss.value = sv;
            const mbs = document.getElementById('msBgSlider'); if (mbs) mbs.value = bv;
            const msvl = document.getElementById('msSoundVolLabel'); if (msvl) msvl.textContent = sv + '%';
            const mbvl = document.getElementById('msBgVolLabel'); if (mbvl) mbvl.textContent = bv + '%';
            // settings page sliders
            const ss = document.getElementById('soundVolSlider'); if (ss) ss.value = sv;
            const bs = document.getElementById('bgVolSlider'); if (bs) bs.value = bv;
            const svl = document.getElementById('soundVolLabel'); if (svl) svl.textContent = sv + '%';
            const bvl = document.getElementById('bgVolLabel'); if (bvl) bvl.textContent = bv + '%';
            const vs = document.getElementById('vibrationStatus'); if (vs) vs.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
        }

        function setSoundVolume(val) {
            st.soundVolume = parseInt(val);
            const svl = document.getElementById('soundVolLabel'); if (svl) svl.textContent = val + '%';
            const msvl = document.getElementById('msSoundVolLabel'); if (msvl) msvl.textContent = val + '%';
            const ss = document.getElementById('soundVolSlider'); if (ss) ss.value = val;
            const mss = document.getElementById('msSoundSlider'); if (mss) mss.value = val;
            saveSt();
            playSound('click');
        }

        function setBgVolume(val) {
            st.bgVolume = parseInt(val);
            const bvl = document.getElementById('bgVolLabel'); if (bvl) bvl.textContent = val + '%';
            const mbvl = document.getElementById('msBgVolLabel'); if (mbvl) mbvl.textContent = val + '%';
            const bs = document.getElementById('bgVolSlider'); if (bs) bs.value = val;
            const mbs = document.getElementById('msBgSlider'); if (mbs) mbs.value = val;
            saveSt();
        }

        function toggleVibration() {
            st.vibrationOn = !st.vibrationOn;
            saveSt();
            updateMainSettingsUI();
            if (st.vibrationOn) doVibrate(50);
        }

        function doVibrate(ms = 30) {
            if (!st.vibrationOn) return;
            try { if (navigator.vibrate) navigator.vibrate(ms); } catch(e) {}
        }
        function renderProfileTasksSummary() {
            const el = document.getElementById('profileTasksSummary');
            if (!el || !st.dailyTasks) return;
            const done = st.dailyTasks.filter(t => t.done);
            const total = st.dailyTasks.length;
            if (total === 0) { el.innerHTML = '<div style="font-size:0.72em;color:var(--text3);padding:6px;">لا توجد مهام اليوم</div>'; return; }
            const pct = Math.round((done.length / total) * 100);
            let html = `<div style="display:flex;justify-content:space-between;font-size:0.72em;color:var(--text2);margin-bottom:4px;"><span>${done.length} / ${total} مهام</span><span style="color:var(--accent2);">${pct}%</span></div>`;
            html += `<div style="background:var(--surface3);border-radius:8px;height:6px;overflow:hidden;margin-bottom:8px;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent2),var(--accent));border-radius:8px;transition:width 0.4s;"></div></div>`;
            st.dailyTasks.forEach(t => {
                html += `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border2);">
                    <span style="font-size:1.1em;">${t.done ? '✅' : '⬜'}</span>
                    <span style="font-size:0.72em;color:${t.done ? 'var(--text3)' : 'var(--text)'};text-decoration:${t.done ? 'line-through' : 'none'};flex:1;">${t.label || t.desc || ''}</span>
                    <span style="font-size:0.65em;color:var(--gold);">${t.reward || 0}💰</span>
                </div>`;
            });
            el.innerHTML = html;
        }

        function openGameSettings() {
            document.getElementById('gsoundStatus').textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
            document.getElementById('gbgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
            openSheet('gameSettingsSheet');
        }

        function toggleBgMusicInGame() {
            toggleBgMusic();
            document.getElementById('gbgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
        }

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
            if (!st.ownedEmojis || st.ownedEmojis.length === 0) st.ownedEmojis = [
            getDefaultAvatarForGender(st.gender)];
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
            if (st.avatar === getDefaultAvatarForGender('m') || st.avatar === getDefaultAvatarForGender('f')) st.avatar =
                def;
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
            let newBirthDate =
                `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
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
            const h = r - f >= 0.5; for (let i = 0; i < f; i++) s += '⭐'; if (h) s += '✨'; for (let i = f + (h ? 1 : 0); i <
                5; i++) s += '☆'; return s; }

        function getTitle() { if (st.level < 3) return 'مبتدئ'; if (st.level < 6) return 'متعلم'; if (st.level < 10)
                return 'رياضي بارع'; if (st.level < 15) return 'خبير أرقام'; if (st.level < 25) return 'عالم رياضيات'; return 'عبقري رياضيات'; }

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
            document.getElementById('profileXpLabel').textContent =
                `${st.xp} / ${st.xpToNext} XP للمستوى التالي`;
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
            updateMainSettingsUI();
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
            if (!st.history || st.history.length === 0) { sc.innerHTML =
                    '<div style="font-size:0.72em;color:var(--text3);padding:6px;">لا توجد نتائج بعد — العب الآن!</div>'; return; }
            const me = { classic: '🧮', speed: '⚡', survival: '🔥', frenzy: '💥', daily: '🌟' };
            sc.innerHTML = st.history.map(r =>
                `<div class="hist-chip"><div class="hist-chip-icon">${me[r.mode]||'🎮'}</div><div class="hist-chip-score">${r.score}</div><div class="hist-chip-acc">${r.acc}%</div></div>`
                ).join('');
        }

        function updateWeaknessArea() {
            const area = document.getElementById('weaknessArea');
            if (!area) return;
            const cats = Object.keys(st.stats).filter(k => st.stats[k]?.att > 4);
            if (!cats.length) { area.innerHTML = ''; return; }
            const w = cats.reduce((a, b) => (st.stats[a]?.cor / st.stats[a]?.att) < (st.stats[b]?.cor / st.stats[b]
                ?.att) ? a : b);
            const names = { addition: 'الجمع', subtraction: 'الطرح', multiplication: 'الضرب', division: 'القسمة',
                table: 'جدول الضرب', squareroot: 'الجذور', percentage: 'النسب', algebra: 'المعادلات',
                mathlaws: 'القوانين', puzzles: 'الألغاز', geometry: 'الهندسة', wordproblems: 'المسائل' };
            area.innerHTML =
                `⚠️ تحتاج تحسين: <strong>${names[w]||w}</strong> <button style="background:var(--gold);color:#000;border:none;padding:4px 10px;border-radius:12px;font-size:0.72em;cursor:pointer;margin-right:6px;" onclick="startTrainingOn('${w}')">تدرب الآن</button>`;
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

        /* ═══════════ LEADERBOARD ═══════════ */
        function syncWithLeaderboard() {
            if (!database) return;
            try {
                const playerKey = (st.name + '_' + (st.playerUID || (st.playerUID = Date.now().toString(36)))).replace(/[^a-zA-Z0-9_]/g, '_');
                saveSt();
                const playerRef = database.ref('leaderboard/' + playerKey);
                playerRef.set({
                    name: st.name,
                    avatar: st.avatar,
                    level: st.level,
                    bestScore: st.bestScore,
                    totalXp: st.xp,
                    lastUpdated: Date.now()
                }).catch(() => {});
            } catch (e) {}
        }

        function loadLeaderboard() {
            const container = document.getElementById('leaderboardList');
            if (!container) return;
            if (!database) {
                container.innerHTML =
                    '<div style="text-align:center;color:var(--text2);">⚠️ قاعدة البيانات غير متصلة<br>قم بتكوين Firebase لتفعيل المنافسة </div>';
                return;
            }
            container.innerHTML = '<div style="text-align:center;">⏳ جاري التحميل...</div>';
            try {
                database.ref('leaderboard').orderByChild('bestScore').limitToLast(10).once('value', (snapshot) => {
                    const players = [];
                    snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                    players.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
                    if (players.length === 0) {
                        container.innerHTML =
                            '<div style="text-align:center;">لا توجد نتائج بعد</div>';
                        return;
                    }
                    let html = '';
                    players.forEach((p, idx) => {
                        const isMe = p.id === st.serialNumber;
                        html +=
                            `<div class="lb-row${isMe?' lb-row-me':''}"><span>${idx+1}</span><span>${p.avatar||'🧑'} ${p.name}</span><span>${p.level}</span><span>${p.bestScore}</span></div>`;
                    });
                    container.innerHTML = html;
                }).catch(() => { container.innerHTML =
                        '<div style="text-align:center;">⚠️ فشل التحميل</div>'; });
            } catch (e) {
                container.innerHTML = '<div style="text-align:center;">⚠️ قاعدة البيانات غير متاحة</div>';
            }
        }

        /* ═══════════ INIT ═══════════ */
        initDateSelectors();
        checkDailyReset();
        applyTheme();
        applyDarkMode();
        updateUI();
        loadProfileForm();
        updateMainSettingsUI();
        (function() {
            const chips = document.querySelectorAll('.diff-chip');
            chips.forEach(c => c.classList.remove('active'));
            if (st.difficulty === 'medium') { const c = document.getElementById('diffMedium'); if (c && !c.classList
                    .contains('locked')) c.classList.add('active');
                else chips[0].classList.add('active'); } else if (st.difficulty === 'hard') { const c = document
                    .getElementById('diffHard'); if (c && !c.classList.contains('locked')) c.classList.add('active');
                else chips[0].classList.add('active'); } else if (st.difficulty === 'genius') { const c = document
                    .getElementById('diffGenius'); if (c && !c.classList.contains('locked')) c.classList.add('active');
                else chips[0].classList.add('active'); } else { chips[0].classList.add('active'); }
        })();
        updSessionTimer();
        updCountdown();
        if (st.bgOn) document.addEventListener('click', () => startBg(), { once: true });
        setTimeout(() => {
            const ss = document.getElementById('splashScreen');
            if (ss) { ss.classList.add('hidden');
                setTimeout(() => { if (ss) ss.style.display = 'none'; }, 500); }
        }, 2800);
        document.addEventListener('touchstart', function() { gACtx(); if (aCtx && aCtx.state === 'suspended') aCtx
            .resume(); }, { once: true });
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js').catch(err => console.log(
                    'SW registration failed:', err));
            });
        }
