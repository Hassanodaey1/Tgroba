/* UI HANDLER */
        function openGameSettings() {
            document.getElementById('gsoundStatus').textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
            document.getElementById('gbgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
            // Sync volume sliders
            const gSV = document.getElementById('gSoundVolSlider'); if(gSV) gSV.value = st.soundVolume;
            const gSVV = document.getElementById('gSoundVolVal'); if(gSVV) gSVV.textContent = st.soundVolume + '%';
            const gBV = document.getElementById('gBgVolSlider'); if(gBV) gBV.value = st.bgVolume;
            const gBVV = document.getElementById('gBgVolVal'); if(gBVV) gBVV.textContent = st.bgVolume + '%';
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
            // Full shop: owned items selectable, unowned items purchasable
            grid.innerHTML = EMOJI_CATALOG.map(item => {
                const owned = st.ownedEmojis.includes(item.emoji);
                const selected = st.avatar === item.emoji;
                if (item.price === 0 && item.gender && item.gender !== st.gender) return '';
                if (owned) {
                    return `<div class="emoji-shop-item owned ${selected?'selected':''}" onclick="buyOrSelectEmoji('${item.emoji}',0)" title="${item.label}">
                        <div class="emoji-shop-item-icon">${item.emoji}</div>
                        ${selected ? `<div class="emoji-shop-item-owned">✅ مفعّل</div>` : `<div class="emoji-shop-item-owned">اختر</div>`}
                    </div>`;
                } else {
                    return `<div class="emoji-shop-item locked-shop" onclick="buyOrSelectEmoji('${item.emoji}',${item.price})" title="${item.label}">
                        <div class="emoji-shop-item-icon">${item.emoji}</div>
                        <div class="emoji-shop-item-price">${item.price > 0 ? item.price + '💰' : 'مجاني'}</div>
                        <div class="emoji-shop-lock">🔒</div>
                    </div>`;
                }
            }).join('');
            const cd = document.getElementById('shopCoinsDisplay'); if (cd) cd.textContent = st.coins;
            const ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';
        }

        function toggleEmojiShop() {
            const container = document.getElementById('emojiShopContainer');
            const btn = document.getElementById('shopToggleBtn');
            if (!container) return;
            const isOpen = container.style.display !== 'none';
            container.style.display = isOpen ? 'none' : 'block';
            if (btn) btn.textContent = isOpen ? '🛍️ المتجر' : '✖️ إغلاق';
            if (!isOpen) renderEmojiShop();
            playSound('click');
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
            const inputName = document.getElementById('inputName');
            if (inputName) inputName.value = st.name;
            if (st.birthDate) {
                let parts = st.birthDate.split('-');
                if (parts.length === 3) {
                    const bd = document.getElementById('birthDay'), bm = document.getElementById('birthMonth'), by = document.getElementById('birthYear');
                    if(by) by.value = parseInt(parts[0]);
                    if(bm) bm.value = parseInt(parts[1]);
                    if(bd) bd.value = parseInt(parts[2]);
                }
            }
            selectGender(st.gender, false);
            updateOwnedEmojisForGender();
            renderProfileDailyTasks();
            renderProfileAchievements();
            updateBadgeIcon();
            // Update shop coins display
            const cd = document.getElementById('shopCoinsDisplay'); if (cd) cd.textContent = st.coins;
            const ca = document.getElementById('currentAvatarDisplay'); if (ca) ca.textContent = st.avatar || '🧑';
        }

        function renderProfileDailyTasks() {
            if (!st.dailyTasks) return;
            const container = document.getElementById('profileTasksList');
            const barEl = document.getElementById('profileTasksBar');
            const labelEl = document.getElementById('profileTasksLabel');
            const pctEl = document.getElementById('profileTasksPct');
            if (!container) return;
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
                return `<div class="task-item ${doneCls}" style="padding:10px 12px;border-radius:13px;display:flex;align-items:center;gap:10px;background:${t.done?'rgba(16,185,129,0.08)':'var(--surface2)'};border:1px solid ${t.done?'rgba(16,185,129,0.25)':'var(--border2)'};">
                    <div style="font-size:1.3em;">${t.icon||'📋'}</div>
                    <div style="flex:1;">
                        <div style="font-size:0.78em;font-weight:700;color:var(--text);">${t.label}</div>
                        <div style="font-size:0.63em;color:var(--text2);margin-top:2px;">${t.done?'✅ منجزة':'⏳ قيد التنفيذ'} • +${t.coins}💰</div>
                    </div>
                    ${t.done ? '<div style="font-size:1.2em;">✅</div>' : `<div style="font-size:0.68em;color:var(--text3);">${t.progress||0}/${t.target||1}</div>`}
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
                return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:13px;background:${done?'rgba(16,185,129,0.08)':'var(--surface2)'};border:1px solid ${done?'rgba(16,185,129,0.25)':'var(--border2)'};margin-bottom:6px;">
                    <div style="font-size:1.4em;${done?'':'filter:grayscale(1);opacity:0.5'}">${a.icon}</div>
                    <div style="flex:1;">
                        <div style="font-size:0.78em;font-weight:700;color:${done?'var(--text)':'var(--text2)'};">${a.name}</div>
                        <div style="font-size:0.63em;color:var(--text2);margin-top:1px;">${a.desc}</div>
                    </div>
                    <div style="font-size:0.75em;font-weight:900;color:${done?'var(--gold)':'var(--text3)'};">${done?'✅ '+a.reward+'💰':'🔒'}</div>
                </div>`;
            }).join('');
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
            const vibEl = document.getElementById('vibrationStatus');
            if (vibEl) vibEl.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
            // Profile competition stats
            const pTG = document.getElementById('profileTotalGames'); if(pTG) pTG.textContent = st.totalGames;
            const pBS = document.getElementById('profileBestScore'); if(pBS) pBS.textContent = st.bestScore;
            const pAcc = document.getElementById('profileAccuracy');
            if(pAcc) {
                const tot = st.correctTotal + st.wrongTotal;
                pAcc.textContent = tot > 0 ? Math.round((st.correctTotal/tot)*100)+'%' : '0%';
            }
            const pCB = document.getElementById('profileChallengeBest'); if(pCB) pCB.textContent = st.challengeBestScore || 0;
            updateHomeStats();
            renderHistory();
            renderTasks();
            renderAchievements();
            renderProfileDailyTasks();
            renderProfileAchievements();
            updateUnlocks();
            updateBadgeIcon();
            updateWeaknessArea();
            initVolumeSliders();
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

