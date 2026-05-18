/* NAVIGATION */
        /* ═══════════ NAVIGATION ═══════════ */
        const TABS = ['home', 'play', 'achieve', 'leaderboard', 'settings'];
        const HIDDEN_PAGES = ['profile'];

        function goTab(tab) {
            TABS.forEach(t => {
                document.getElementById('page-' + t)?.classList.toggle('active', t === tab);
                document.getElementById('nav-' + t)?.classList.toggle('active', t === tab);
            });
            playSound('click');

            if (tab === 'achieve') {
                /* صفحة الإحصائيات */
                renderStatsPage();
                renderAchievements();
            }
            if (tab === 'settings') {
                /* صفحة الإعدادات */
                updateSerialNumberDisplay();
            }
            if (tab === 'home') {
                updateHomeStats();
                renderHistory();
                updateHomeDailyStats();
                renderHomeTasks();
            }
            if (tab === 'play') {
                syncPlayDiffChips();
            }
            if (tab === 'leaderboard') {
                loadCombinedLeaderboard();
                const el = document.getElementById('challengeBestDisplay');
                if (el) el.textContent = st.challengeBestScore || 0;
                renderChallengeMissions();
            }
            /* إخفاء زر الإعدادات العلوي دائماً (استُبدل بالشريط) */
            const settingsBtn = document.getElementById('mainSettingsBtn');
            if (settingsBtn) settingsBtn.style.display = 'none';
        }

        /* مزامنة chips الصعوبة في صفحة الألعاب */
        function syncPlayDiffChips() {
            ['easy','medium','hard','genius'].forEach(d => {
                const el = document.getElementById('playDiff' + d.charAt(0).toUpperCase() + d.slice(1));
                if (el) el.classList.toggle('active', st.difficulty === d);
            });
            const level = st.level;
            const elM = document.getElementById('playLockMedium');
            const elH = document.getElementById('playLockHard');
            const elG = document.getElementById('playLockGenius');
            const dM = document.getElementById('playDiffMedium');
            const dH = document.getElementById('playDiffHard');
            const dG = document.getElementById('playDiffGenius');
            if (elM && dM) { const lk = level < 3; dM.classList.toggle('locked', lk); elM.style.display = lk ? 'block' : 'none'; }
            if (elH && dH) { const lk = level < 5; dH.classList.toggle('locked', lk); elH.style.display = lk ? 'block' : 'none'; }
            if (elG && dG) { const lk = level < 8; dG.classList.toggle('locked', lk); elG.style.display = lk ? 'block' : 'none'; }
        }

        /* إحصائيات يومية في الرئيسية */
        function updateHomeDailyStats() {
            const ds = st.dailyStats || { correct:0, wrong:0, games:0 };
            const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
            el('homeDailyCorrect', ds.correct || 0);
            el('homeDailyWrong', ds.wrong || 0);
            el('homeDailyGames', ds.games || 0);
            const tot = (ds.correct||0) + (ds.wrong||0);
            el('homeDailyAccuracy', tot > 0 ? Math.round((ds.correct/tot)*100)+'%' : '0%');
        }

        /* تابات المهام في الرئيسية */
        function switchHomeTab(which) {
            const tBtn = document.getElementById('homeTabTasks');
            const aBtn = document.getElementById('homeTabAchieve');
            const tList = document.getElementById('homeTasksList');
            const aList = document.getElementById('homeAchieveList');
            if (!tBtn || !aBtn) return;
            tBtn.classList.toggle('active', which === 'tasks');
            aBtn.classList.toggle('active', which === 'achieve');
            if (tList) tList.style.display = which === 'tasks' ? 'block' : 'none';
            if (aList) aList.style.display = which === 'achieve' ? 'block' : 'none';
        }
        window.switchHomeTab = switchHomeTab;

        /* عرض المهام في الرئيسية */
        function renderHomeTasks() {
            checkDailyReset();
            const level = st.level;
            let filtered = st.dailyTasks;
            if (level < 2) filtered = st.dailyTasks.filter(t => ['t1','t2'].includes(t.id));
            else if (level < 4) filtered = st.dailyTasks.filter(t => ['t1','t2','t3'].includes(t.id));
            else if (level < 5) filtered = st.dailyTasks.filter(t => ['t1','t2','t3','t4'].includes(t.id));
            const doneCount = filtered.filter(t => t.done).length;
            const pct = filtered.length ? Math.round((doneCount/filtered.length)*100) : 0;
            const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
            el('homeTaskDone', doneCount);
            el('homeTaskTotal', filtered.length);
            el('homeTaskPct', pct + '%');
            const bar = document.getElementById('homeTaskBar');
            if (bar) bar.style.width = pct + '%';
            /* تحديث العداد */
            const now = new Date(), midnight = new Date(now);
            midnight.setHours(24,0,0,0);
            const d = midnight - now;
            const h = String(Math.floor(d/3600000)).padStart(2,'0');
            const m = String(Math.floor((d%3600000)/60000)).padStart(2,'0');
            const s = String(Math.floor((d%60000)/1000)).padStart(2,'0');
            el('homeTaskCountdown', h+':'+m+':'+s);
            /* رسم المهام */
            const tList = document.getElementById('homeTasksList');
            if (tList) {
                tList.innerHTML = filtered.map(t => {
                    const p = Math.min(100, Math.round((t.progress/t.goal)*100));
                    return \`<div class="task-item \${t.done?'done':''}">
                        <div class="task-item-icon">\${t.icon}</div>
                        <div class="task-item-info">
                            <div class="task-item-name">\${t.name}</div>
                            <div class="task-item-desc">\${t.desc}</div>
                            <div class="task-prog-bar"><div class="task-prog-fill" style="width:\${p}%"></div></div>
                        </div>
                        <div class="task-right">
                            <div class="task-reward">\${t.done?'✅':\`+\${t.reward}💰`}</div>
                            \${t.done?'':\`<div class="task-prog-txt">\${t.progress}/\${t.goal}</div>\`}
                        </div>
                    </div>\`;
                }).join('');
            }
            /* رسم الإنجازات في الرئيسية */
            const aList = document.getElementById('homeAchieveList');
            if (aList) {
                const shown = ACHIEVEMENTS_DEF.slice(0, 6);
                aList.innerHTML = shown.map(a => {
                    const done = st.achievementsUnlocked.includes(a.id) || a.check();
                    return \`<div class="task-item \${done?'done':''}">
                        <div class="task-item-icon">\${a.icon}</div>
                        <div class="task-item-info">
                            <div class="task-item-name">\${a.name}</div>
                            <div class="task-item-desc">\${a.desc}</div>
                        </div>
                        <div class="task-right">
                            <div class="task-reward">\${done?'✅':\`+\${a.reward}💰`}</div>
                        </div>
                    </div>\`;
                }).join('') + \`<div style="text-align:center;padding:8px;font-size:0.7em;color:var(--text3);cursor:pointer;" onclick="goTab('achieve')">عرض كل الإنجازات ›</div>\`;
            }
        }
        window.renderHomeTasks = renderHomeTasks;
        setInterval(() => { if(document.getElementById('page-home')?.classList.contains('active')) { el_safe('homeTaskCountdown'); } }, 1000);
        function el_safe(id){ const e=document.getElementById(id); return e||{}; }

        function getDifficultyByLevel() {
            if (st.level >= 8) return 'genius';
            if (st.level >= 5) return 'hard';
            if (st.level >= 3) return 'medium';
            return 'easy';
        }

        function updateUnlocks() {
            const level = st.level;
            const challengesUnlocked = level >= 4;
            const playChallengesCard = document.getElementById('playCardChallenges');
            const homeChallengesCat = document.getElementById('homeCatChallenges');
            if (playChallengesCard) {
                if (!challengesUnlocked) {
                    playChallengesCard.classList.add('locked');
                    playChallengesCard.onclick = null;
                    playChallengesCard.querySelector('.gcard-badge').textContent = '🔒 Lv.4';
                } else {
                    playChallengesCard.classList.remove('locked');
                    playChallengesCard.onclick = () => openOpSheet('challenges');
                    playChallengesCard.querySelector('.gcard-badge').textContent = 'متاح';
                }
            }
            if (homeChallengesCat) {
                if (!challengesUnlocked) {
                    homeChallengesCat.classList.add('locked');
                    homeChallengesCat.onclick = null;
                } else {
                    homeChallengesCat.classList.remove('locked');
                    homeChallengesCat.onclick = () => openOpSheet('challenges');
                }
            }
            const advancedUnlocked = level >= 7;
            const gcardAdvanced = document.getElementById('gcardAdvanced');
            const catAdvanced = document.getElementById('catAdvanced');
            if (gcardAdvanced) {
                if (!advancedUnlocked) {
                    gcardAdvanced.classList.add('locked');
                    gcardAdvanced.onclick = null;
                    gcardAdvanced.querySelector('.gcard-badge').textContent = '🔒 Lv.7';
                    if (document.getElementById('gcardAdvancedStats')) document.getElementById(
                        'gcardAdvancedStats').textContent = 'يفتح عند Lv.7';
                } else {
                    gcardAdvanced.classList.remove('locked');
                    gcardAdvanced.onclick = () => startGameWith('classic', 'advanced', null, true);
                    gcardAdvanced.querySelector('.gcard-badge').textContent = 'متاح';
                    if (document.getElementById('gcardAdvancedStats')) document.getElementById(
                        'gcardAdvancedStats').textContent = 'اضغط للعب';
                }
            }
            if (catAdvanced) {
                if (!advancedUnlocked) {
                    catAdvanced.classList.add('locked');
                    catAdvanced.onclick = null;
                    document.getElementById('catAdvancedStats').textContent = '🔒 يفتح Lv.7';
                } else {
                    catAdvanced.classList.remove('locked');
                    catAdvanced.onclick = () => startGameWith('classic', 'advanced', null, true);
                    document.getElementById('catAdvancedStats').textContent = 'اضغط للعب';
                }
            }
            const lawsUnlocked = level >= 10;
            const gcardLaws = document.getElementById('gcardLaws');
            const catLaws = document.getElementById('catLaws');
            if (gcardLaws) {
                if (!lawsUnlocked) {
                    gcardLaws.classList.add('locked');
                    gcardLaws.onclick = null;
                    gcardLaws.querySelector('.gcard-badge').textContent = '🔒 Lv.10';
                    if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent =
                        'يفتح عند Lv.10';
                } else {
                    gcardLaws.classList.remove('locked');
                    gcardLaws.onclick = () => startGameWith('classic', 'laws', null, true);
                    gcardLaws.querySelector('.gcard-badge').textContent = 'متاح';
                    if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent =
                        'اضغط للعب';
                }
            }
            if (catLaws) {
                if (!lawsUnlocked) {
                    catLaws.classList.add('locked');
                    catLaws.onclick = null;
                    document.getElementById('catLawsStats').textContent = '🔒 يفتح Lv.10';
                } else {
                    catLaws.classList.remove('locked');
                    catLaws.onclick = () => startGameWith('classic', 'laws', null, true);
                    document.getElementById('catLawsStats').textContent = 'اضغط للعب';
                }
            }
            const diffMedium = document.getElementById('diffMedium');
            const diffHard = document.getElementById('diffHard');
            const diffGenius = document.getElementById('diffGenius');
            if (diffMedium) {
                if (level >= 3) { diffMedium.classList.remove('locked');
                    document.getElementById('lockMedium').style.display = 'none'; } else { diffMedium.classList.add(
                        'locked');
                    document.getElementById('lockMedium').style.display = 'block'; }
            }
            if (diffHard) {
                if (level >= 5) { diffHard.classList.remove('locked');
                    document.getElementById('lockHard').style.display = 'none'; } else { diffHard.classList.add(
                    'locked');
                    document.getElementById('lockHard').style.display = 'block'; }
            }
            if (diffGenius) {
                if (level >= 8) { diffGenius.classList.remove('locked');
                    document.getElementById('lockGenius').style.display = 'none'; } else { diffGenius.classList.add(
                        'locked');
                    document.getElementById('lockGenius').style.display = 'block'; }
            }
        }

        function selectDiff(el, diff) {
            if (el.classList.contains('locked')) return;
            document.querySelectorAll('.diff-chip').forEach(c => { if (!c.classList.contains('locked')) c.classList
                    .remove('active'); });
            el.classList.add('active');
            st.difficulty = diff;
            playSound('click');
            saveSt();
        }

        function openSheet(id) { document.getElementById(id).classList.add('active'); }

        function closeSheet(id) { document.getElementById(id).classList.remove('active'); }

        function sheetBg(e, id) { if (e.target.id === id) closeSheet(id); }

        function openModeSheet(op) { currentOp = op || st.lastOp;
            openSheet('modeSheet'); }

        function openCounterGame() { openOpSheet('counter', true); }

        function openAdvancedGame() {
            if (st.level >= 7) startGameWith('classic', 'advanced', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 7');
        }

        function openLawsGame() {
            if (st.level >= 10) startGameWith('classic', 'laws', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 10');
        }

        function openTrainingOpSheet() {
            const grid = document.getElementById('trainingOpGrid');
            grid.innerHTML = `
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('add')"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('sub')"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('mul')"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div></div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet'); startTrainingMode('div')"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div></div>
            `;
            openSheet('trainingOpSheet');
        }

        function openOpSheet(cat, forceTimerForCounter = false) {
            const grid = document.getElementById('opModeGrid'),
                title = document.getElementById('opSheetTitle');
            if (cat === 'counter') {
                title.textContent = '🧮 العمليات على الاعداد';
                let html = `
                    <div class="mode-card" onclick="startGameWith('classic','add', null, true)"><span class="mode-card-icon">➕</span><div class="mode-card-name">الجمع</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('classic','sub', null, true)"><span class="mode-card-icon">➖</span><div class="mode-card-name">الطرح</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                if (st.level >= 2) {
                    html +=
                        `<div class="mode-card" onclick="startGameWith('classic','mul', null, true)"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('classic','div', null, true)"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                } else {
                    html +=
                        `<div class="mode-card locked"><span class="mode-card-icon">✖️</span><div class="mode-card-name">الضرب</div><div class="mode-card-desc">🔒 يفتح Lv.2</div></div>
                    <div class="mode-card locked"><span class="mode-card-icon">➗</span><div class="mode-card-name">القسمة</div><div class="mode-card-desc">🔒 يفتح Lv.2</div></div>`;
                }
                html +=
                    `<div class="mode-card" onclick="startGameWith('classic','mix', null, true)"><div class="mode-card-badge">موصى</div><span class="mode-card-icon">🎲</span><div class="mode-card-name">مختلط</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startTableGame()"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول الضرب</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>`;
                grid.innerHTML = html;
            } else {
                title.textContent = '⚡ التحديات';
                grid.innerHTML = `
                    <div class="mode-card" onclick="startGameWith('speed','mix', null, true)"><span class="mode-card-icon">⚡</span><div class="mode-card-name">السرعة</div><div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('survival','mix', null, false)"><span class="mode-card-icon">🔥</span><div class="mode-card-name">التحمّل</div><div class="mode-card-desc">بدون وقت • 3 أخطاء</div></div>
                    <div class="mode-card" onclick="startGameWith('frenzy','mix', null, true)"><span class="mode-card-icon">💥</span><div class="mode-card-name">الاندفاع</div><div class="mode-card-desc">30 ثانية • قلوب • +1/-1 ثانية</div></div>
                    <div class="mode-card" onclick="startGameWith('daily','mix', null, false)"><div class="mode-card-badge">+3💰</div><span class="mode-card-icon">🌟</span><div class="mode-card-name">تحدي اليوم</div><div class="mode-card-desc">بدون وقت • مكافأة خاصة</div></div>`;
            }
            openSheet('opSheet');
        }

        function startTableGame() {
            closeSheet('opSheet');
            const maxT = st.difficulty === 'easy' ? 10 : st.difficulty === 'medium' ? 15 : st.difficulty === 'hard' ? 20 :
                30;
            let btns = '';
            for (let i = 1; i <= maxT; i++) btns +=
                `<div class="mode-card" onclick="closeSheet('opSheet');startTableGameWith(${i})"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول ${i}</div></div>`;
            const grid = document.getElementById('opModeGrid');
            document.getElementById('opSheetTitle').textContent = '📊 اختر جدول الضرب';
            grid.innerHTML = btns;
            openSheet('opSheet');
        }
        window.startTableGameWith = function(table) { closeSheet('opSheet');
            startGameWith('classic', 'table', table, true); };

        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

        function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

        function getCatStatsKey(op) {
            const map = { add: 'addition', sub: 'subtraction', mul: 'multiplication', div: 'division', mix: 'addition',
                table: 'table', percent: 'percentage', fraction: 'division', power: 'algebra', sqrt: 'squareroot',
                equation: 'algebra', sequence: 'puzzles', algebra: 'algebra', word: 'wordproblems',
                geometry: 'geometry', advanced: 'algebra', laws: 'mathlaws' };
            return map[op] || 'addition';
        }




        /* ═══════════ صفحة الإحصائيات ═══════════ */
        function renderStatsPage() {
            /* الألقاب */
            const titlesEl = document.getElementById('statsTitlesSection');
            if (titlesEl) {
                try { if (typeof renderProfileTitles === 'function') renderProfileTitles(); } catch(e) {}
                /* نسخ محتوى الألقاب من profileTitlesSection */
                const src = document.getElementById('profileTitlesSection');
                if (src && src.innerHTML.trim()) titlesEl.innerHTML = src.innerHTML;
            }

            /* إحصائيات أسبوعية */
            const ws = st.weeklyStats || {};
            const wTot = (ws.correct||0) + (ws.wrong||0);
            const setEl = (id,v) => { const e=document.getElementById(id); if(e) e.textContent=v; };
            setEl('weekCorrect', ws.correct||0);
            setEl('weekWrong', ws.wrong||0);
            setEl('weekGames', ws.games||0);
            setEl('weekAccuracy', wTot>0 ? Math.round(((ws.correct||0)/wTot)*100)+'%' : '0%');
            setEl('weekStreak', '×'+(ws.bestStreak||0));
            const wRat = wTot>0 ? Math.min(5,(((ws.correct||0)/wTot)*5)).toFixed(1) : '0.0';
            setEl('weekRating', wRat);

            /* إحصائيات شهرية - من البيانات الإجمالية */
            const ms = st.monthlyStats || {};
            const mTot = (ms.correct||0) + (ms.wrong||0);
            setEl('monthCorrect', ms.correct||st.correctTotal||0);
            setEl('monthWrong', ms.wrong||st.wrongTotal||0);
            setEl('monthGames', ms.games||st.totalGames||0);
            const mAcc = mTot>0 ? Math.round(((ms.correct||0)/mTot)*100)+'%' :
                         (st.correctTotal+st.wrongTotal)>0 ? Math.round((st.correctTotal/(st.correctTotal+st.wrongTotal))*100)+'%' : '0%';
            setEl('monthAccuracy', mAcc);
            setEl('monthBestScore', ms.bestScore||st.bestScore||0);
            setEl('monthBestStreak', '×'+(ms.bestStreak||st.bestStreak||0));
            setEl('monthCoins', ms.coins||st.coins||0);
            setEl('monthXp', (ms.xp||st.xp||0)+' XP');

            /* إحصائيات إجمالية */
            setEl('totalCorrectStat', st.correctTotal||0);
            const tot = st.correctTotal + st.wrongTotal;
            setEl('totalAccuracyStat', tot>0 ? Math.round((st.correctTotal/tot)*100)+'%' : '0%');
            setEl('totalGamesStat', st.totalGames||0);
            setEl('totalStreakStat', '×'+(st.bestStreak||0));
            setEl('totalLevelStat', st.level||1);
            setEl('totalBestStat', st.bestScore||0);
            setEl('statsCoinsDisplay', st.coins||0);
        }
        window.renderStatsPage = renderStatsPage;

        /* ═══════════ فتح sheets الإعدادات ═══════════ */
        function openSettingsSheet(type) {
            if (type === 'profile') {
                loadSettingsProfileForm();
                openSheet('profileSettingsSheet');
            } else if (type === 'sound') {
                openSheet('soundSettingsSheet');
            } else if (type === 'themes') {
                updateThemeSheetState();
                openSheet('themesSettingsSheet');
            }
        }
        window.openSettingsSheet = openSettingsSheet;

        function loadSettingsProfileForm() {
            const n = document.getElementById('settingsName');
            if (n) n.value = st.name || '';
            /* صورة الملف */
            const img = document.getElementById('settingsAvatarImg');
            if (img) {
                if (st.profilePhoto) {
                    img.innerHTML = `<img src="${st.profilePhoto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                } else {
                    img.textContent = st.avatar || '🧑';
                }
            }
            /* المستوى والاسم */
            const pn = document.getElementById('settingsProfileName');
            if (pn) pn.textContent = st.name || 'اللاعب';
            const pl = document.getElementById('settingsProfileLevel');
            if (pl) pl.textContent = 'المستوى ' + (st.level||1);
            /* تاريخ الميلاد */
            const parts = (st.birthDate||'2000-01-01').split('-');
            populateDateSelect('settingsBirthDayNew', 1, 31, parseInt(parts[2])||1);
            populateDateSelect('settingsBirthMonthNew', 1, 12, parseInt(parts[1])||1);
            const curYear = new Date().getFullYear();
            populateDateSelect('settingsBirthYearNew', curYear-100, curYear, parseInt(parts[0])||2000);
            /* الجنس */
            const gM = document.getElementById('settingsGBtnM');
            const gF = document.getElementById('settingsGBtnF');
            if (gM) gM.classList.toggle('active', st.gender === 'm');
            if (gF) gF.classList.toggle('active', st.gender === 'f');
        }

        function populateDateSelect(id, min, max, selected) {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '';
            for (let i = min; i <= max; i++) {
                const o = document.createElement('option');
                o.value = i;
                o.textContent = i;
                if (i === selected) o.selected = true;
                el.appendChild(o);
            }
        }

        let _settingsGender = '';
        function selectSettingsGender(g) {
            _settingsGender = g;
            const gM = document.getElementById('settingsGBtnM');
            const gF = document.getElementById('settingsGBtnF');
            if (gM) gM.classList.toggle('active', g === 'm');
            if (gF) gF.classList.toggle('active', g === 'f');
            playSound('click');
        }
        window.selectSettingsGender = selectSettingsGender;

        function saveSettingsProfile() {
            const nameEl = document.getElementById('settingsName');
            const name = nameEl ? nameEl.value.trim().replace(/[^a-zA-Z0-9 ]/g,'').slice(0,30) : '';
            if (!name) { showFeedback('الاسم يجب أن يكون بالإنجليزية فقط'); return; }
            const day = document.getElementById('settingsBirthDayNew')?.value;
            const month = document.getElementById('settingsBirthMonthNew')?.value;
            const year = document.getElementById('settingsBirthYearNew')?.value;
            const birthDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const age = new Date().getFullYear() - parseInt(year||2000);
            if (_settingsGender) st.gender = _settingsGender;
            st.name = name;
            st.birthDate = birthDate;
            st.age = age;
            if (!st.serialNumber) {
                st.serialNumber = generateSerialNumber(birthDate, name);
            }
            saveSt(); updateUI();
            updateSerialNumberDisplay();
            showFeedback('✅ تم حفظ الملف الشخصي');
            closeSheet('profileSettingsSheet');
        }
        window.saveSettingsProfile = saveSettingsProfile;

        /* خيارات الصورة */
        function openPhotoOptions() {
            const bar = document.getElementById('photoOptionsBar');
            if (bar) bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
        }
        function closePhotoOptions() {
            const bar = document.getElementById('photoOptionsBar');
            if (bar) bar.style.display = 'none';
        }
        function triggerSettingsPhotoUpload() {
            closePhotoOptions();
            document.getElementById('settingsPhotoInput')?.click();
        }
        function triggerSettingsCamera() {
            closePhotoOptions();
            document.getElementById('settingsCameraInput')?.click();
        }
        function handleSettingsPhotoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                st.profilePhoto = e.target.result;
                saveSt();
                applyProfilePhoto();
                loadSettingsProfileForm();
                showFeedback('✅ تم تحديث الصورة الشخصية');
            };
            reader.readAsDataURL(file);
        }
        window.openPhotoOptions = openPhotoOptions;
        window.closePhotoOptions = closePhotoOptions;
        window.triggerSettingsPhotoUpload = triggerSettingsPhotoUpload;
        window.triggerSettingsCamera = triggerSettingsCamera;
        window.handleSettingsPhotoUpload = handleSettingsPhotoUpload;

        /* ثيمات الإعدادات */
        function applyMode(mode) {
            st.darkMode = (mode === 'dark');
            saveSt(); applyDarkMode(); updateThemeSheetState();
            playSound('click');
        }
        function applyThemeFromSheet(el, gold, accent, accent2) {
            document.querySelectorAll('.theme-sheet-item').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
            setTheme(null, gold, accent, accent2);
        }
        function updateThemeSheetState() {
            const dark = document.getElementById('darkModeBtn');
            const light = document.getElementById('lightModeBtn');
            if (dark) dark.classList.toggle('active-mode', !!st.darkMode);
            if (light) light.classList.toggle('active-mode', !st.darkMode);
        }
        window.applyMode = applyMode;
        window.applyThemeFromSheet = applyThemeFromSheet;
