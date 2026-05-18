/* NAVIGATION */
        /* ═══════════ NAVIGATION ═══════════ */
        const TABS = ['home', 'play', 'achieve', 'profile', 'leaderboard', 'settings', 'stats'];

        function goTab(tab) {
            TABS.forEach(t => {
                document.getElementById('page-' + t)?.classList.toggle('active', t === tab);
                document.getElementById('nav-' + t)?.classList.toggle('active', t === tab);
            });
            playSound('click');
            if (tab === 'achieve') { checkDailyReset();
                renderTasks();
                renderAchievements(); }
            if (tab === 'profile') {
                checkDailyReset();
                loadProfileForm();
                renderProfileDailyTasks();
                renderProfileAchievements();
                const pb = document.getElementById('profileChallengeBest');
                if (pb) pb.textContent = st.challengeBestScore || 0;
                const pTG = document.getElementById('profileTotalGames'); if(pTG) pTG.textContent = st.totalGames;
                const pBS = document.getElementById('profileBestScore'); if(pBS) pBS.textContent = st.bestScore;
                const pAcc = document.getElementById('profileAccuracy');
                if(pAcc) { const tot = st.correctTotal + st.wrongTotal; pAcc.textContent = tot > 0 ? Math.round((st.correctTotal/tot)*100)+'%' : '0%'; }
                try { if (typeof renderProfileTitles === 'function') renderProfileTitles(); } catch(e) {}
            }
            if (tab === 'home') { updateHomeStats(); renderHistory(); renderHomeDailySection(); }
            if (tab === 'stats') { renderStatsPage(); }
            /* إظهار زر الإعدادات فقط في الرئيسية */
            const settingsBtn = document.getElementById('mainSettingsBtn');
            if (settingsBtn) {
                settingsBtn.style.display = (tab === 'home') ? 'flex' : 'none';
            }
            if (tab === 'leaderboard') {
                loadCombinedLeaderboard();
                renderChallengeTasks();
                const el = document.getElementById('challengeBestDisplay');
                if (el) el.textContent = st.challengeBestScore || 0;
            }
            if (tab === 'settings') { openSettingsPage(); }
        }

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




        /* ═══════════ SETTINGS PAGE ═══════════ */
        function openSettingsPage() {
            /* تحديث حالة مستمعات الإعدادات */
            ['soundStatus','gsoundStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=st.soundOn?'مفعّل':'مطفأ';});
            ['bgMusicStatus','gbgMusicStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=st.bgOn?'مفعّلة':'مطفأة';});
            ['vibrationStatus','gVibrationStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=st.vibrationOn?'مفعّل':'مطفأ';});
            updateSettingsDarkToggle && updateSettingsDarkToggle();
            updateSettingsThemeDots && updateSettingsThemeDots();
            updateSerialNumberDisplay && updateSerialNumberDisplay();
            try { initVolumeSliders(); } catch(e) {}
            /* تعبئة نموذج الملف الشخصي */
            const inName = document.getElementById('settingsInputName');
            if (inName) inName.value = st.name || '';
            if (st.birthDate) {
                const parts = st.birthDate.split('-');
                if (parts.length === 3) {
                    const sd=document.getElementById('settingsBirthDay'),sm=document.getElementById('settingsBirthMonth'),sy=document.getElementById('settingsBirthYear');
                    if(sy)sy.value=parseInt(parts[0]);if(sm)sm.value=parseInt(parts[1]);if(sd)sd.value=parseInt(parts[2]);
                }
            }
            /* تحديث الصورة الشخصية في صفحة الإعدادات */
            const spImg = document.getElementById('settingsProfilePhoto');
            if (spImg) {
                if (st.profilePhoto) {
                    spImg.style.backgroundImage='url("'+st.profilePhoto+'")';
                    spImg.style.backgroundSize='cover';
                    spImg.style.backgroundPosition='center';
                    spImg.textContent='';
                } else {
                    spImg.style.backgroundImage='';
                    spImg.textContent = st.avatar || '🧑';
                }
            }
            const spLevel = document.getElementById('settingsProfileLevel');
            if(spLevel) spLevel.textContent = 'المستوى ' + st.level + ' • ' + getTitle();
            const spName = document.getElementById('settingsProfileName');
            if(spName) spName.textContent = st.name || 'اللاعب';
            /* XP bar */
            const spXp = document.getElementById('settingsXpBar');
            if(spXp) spXp.style.width = Math.min(100,Math.round((st.xp/st.xpToNext)*100))+'%';
        }

        /* ═══════════ STATS PAGE ═══════════ */
        function renderStatsPage() {
            try { renderStatsTitles(); } catch(e) {}
            try { renderWeeklyStats(); } catch(e) {}
            try { renderMonthlyStats(); } catch(e) {}
        }

        function renderStatsTitles() {
            const el = document.getElementById('statsTitlesSection');
            if (!el) return;
            try { if (typeof renderProfileTitles === 'function') {
                /* clone to stats page */
                const tmp = document.createElement('div');
                tmp.id = '_tmpTitles';
                const container = document.getElementById('profileTitlesSection');
                if (container) {
                    if (typeof renderProfileTitles === 'function') renderProfileTitles();
                    el.innerHTML = container.innerHTML;
                }
            }} catch(e) {}
        }

        function renderWeeklyStats() {
            const el = document.getElementById('statsWeeklyContent');
            if (!el) return;
            const ws = st.weeklyStats || {};
            const tot = (ws.correct||0) + (ws.wrong||0);
            const acc = tot > 0 ? Math.round(((ws.correct||0)/tot)*100) : 0;
            el.innerHTML = `
            <div class="stats-grid3" style="margin-bottom:8px;">
                <div class="stat-card"><div class="stat-card-num" style="color:var(--green)">${ws.correct||0}</div><div class="stat-card-label">صحيح</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--red)">${ws.wrong||0}</div><div class="stat-card-label">خطأ</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--accent2)">${acc}%</div><div class="stat-card-label">الدقة</div></div>
            </div>
            <div class="stats-grid3">
                <div class="stat-card"><div class="stat-card-num" style="color:var(--gold)">${ws.games||0}</div><div class="stat-card-label">جلسات</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--red)">×${ws.bestStreak||0}</div><div class="stat-card-label">أعلى تتابع</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--accent)">${tot}</div><div class="stat-card-label">إجمالي إجابات</div></div>
            </div>`;
        }

        function renderMonthlyStats() {
            const el = document.getElementById('statsMonthlyContent');
            if (!el) return;
            /* نحسب الإحصائيات الشهرية من التاريخ المحفوظ */
            if (!st.monthlyStats || !isCurrentMonth(st.monthlyStats.month)) {
                st.monthlyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, month: currentMonthStr() };
            }
            const ms = st.monthlyStats;
            const tot = (ms.correct||0) + (ms.wrong||0);
            const acc = tot > 0 ? Math.round(((ms.correct||0)/tot)*100) : 0;
            el.innerHTML = `
            <div class="stats-grid3" style="margin-bottom:8px;">
                <div class="stat-card"><div class="stat-card-num" style="color:var(--green)">${ms.correct||0}</div><div class="stat-card-label">صحيح</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--red)">${ms.wrong||0}</div><div class="stat-card-label">خطأ</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--accent2)">${acc}%</div><div class="stat-card-label">الدقة</div></div>
            </div>
            <div class="stats-grid3">
                <div class="stat-card"><div class="stat-card-num" style="color:var(--gold)">${ms.games||0}</div><div class="stat-card-label">جلسات</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--red)">×${ms.bestStreak||0}</div><div class="stat-card-label">أعلى تتابع</div></div>
                <div class="stat-card"><div class="stat-card-num" style="color:var(--accent)">${tot}</div><div class="stat-card-label">إجمالي إجابات</div></div>
            </div>`;
        }

        function currentMonthStr() {
            const d = new Date();
            return d.getFullYear()+'-'+d.getMonth();
        }
        function isCurrentMonth(m) { return m === currentMonthStr(); }

        /* ═══════════ HOME DAILY SECTION ═══════════ */
        function renderHomeDailySection() {
            try { checkDailyReset(); } catch(e) {}
            renderHomeDailyStats();
            renderHomeDailyTasks();
            renderHomeDailyAchievements();
        }

        function renderHomeDailyStats() {
            const el = document.getElementById('homeDailyStatsGrid');
            if (!el) return;
            const ds = st.dailyStats || {};
            const tot = (ds.correct||0) + (ds.wrong||0);
            const acc = tot > 0 ? Math.round(((ds.correct||0)/tot)*100) : 0;
            el.innerHTML = `
                <div class="adv-stat"><div class="adv-stat-num" style="color:var(--green)">${ds.correct||0}</div><div class="adv-stat-label">صحيح اليوم</div></div>
                <div class="adv-stat"><div class="adv-stat-num" style="color:var(--red)">${ds.wrong||0}</div><div class="adv-stat-label">خطأ اليوم</div></div>
                <div class="adv-stat"><div class="adv-stat-num" style="color:var(--accent2)">${acc}%</div><div class="adv-stat-label">الدقة</div></div>
                <div class="adv-stat"><div class="adv-stat-num" style="color:var(--gold)">${ds.games||0}</div><div class="adv-stat-label">جلسات</div></div>
            `;
        }

        function renderHomeDailyTasks() {
            const el = document.getElementById('homeDailyTasksList');
            if (!el) return;
            checkDailyReset();
            const T = st.dailyTasks || [];
            let level = st.level;
            let filtered = T;
            if (level < 2) filtered = T.filter(t=>['t1','t2'].includes(t.id));
            else if (level < 4) filtered = T.filter(t=>['t1','t2','t3'].includes(t.id));
            else if (level < 5) filtered = T.filter(t=>['t1','t2','t3','t4'].includes(t.id));
            el.innerHTML = filtered.map(t => {
                const p = Math.min(100, Math.round((t.progress/t.goal)*100));
                return `<div class="task-item ${t.done?'done':''}" style="margin-bottom:6px;">
                    <div class="task-item-icon">${t.icon}</div>
                    <div class="task-item-info">
                        <div class="task-item-name">${t.name}</div>
                        <div class="task-prog-bar"><div class="task-prog-fill" style="width:${p}%"></div></div>
                    </div>
                    <div class="task-right"><div class="task-reward">${t.done?'✅':`+${t.reward}💰`}</div></div>
                </div>`;
            }).join('');
            const doneEl = document.getElementById('homeDailyTasksDone');
            if(doneEl) doneEl.textContent = filtered.filter(t=>t.done).length + '/' + filtered.length;
        }

        function renderHomeDailyAchievements() {
            const el = document.getElementById('homeDailyAchieveList');
            if (!el) return;
            if (typeof ACHIEVEMENTS_DEF === 'undefined') return;
            const unlocked = st.achievementsUnlocked || [];
            /* عرض أول 4 إنجازات غير مكتملة */
            const pending = ACHIEVEMENTS_DEF.filter(a => !unlocked.includes(a.id)).slice(0,4);
            if (!pending.length) {
                el.innerHTML = '<div style="text-align:center;font-size:0.78em;color:var(--green);padding:8px;">🎉 أكملت جميع الإنجازات!</div>';
                return;
            }
            el.innerHTML = pending.map(a => `
                <div class="task-item" style="margin-bottom:6px;">
                    <div class="task-item-icon">${a.icon}</div>
                    <div class="task-item-info">
                        <div class="task-item-name">${a.name}</div>
                        <div class="task-item-desc">${a.desc}</div>
                    </div>
                    <div class="task-right"><div class="task-reward">+${a.reward}💰</div></div>
                </div>`).join('');
        }

        /* ═══════════ CHALLENGE TASKS ═══════════ */
        const CHALLENGE_TASKS_DEF = [
            { id: 'ch1', icon: '⚔️', name: 'أول تحدي', desc: 'العب جلسة تحدي واحدة', reward: 3, xpBonus: 20, goal: 1, progress: 0, done: false },
            { id: 'ch2', icon: '🎯', name: '5 إجابات في التحدي', desc: 'أجب على 5 أسئلة صحيحة في التحدي', reward: 5, xpBonus: 30, goal: 5, progress: 0, done: false },
            { id: 'ch3', icon: '🔥', name: 'سجل 50 نقطة', desc: 'احصل على 50 نقطة في التحدي', reward: 8, xpBonus: 50, goal: 50, progress: 0, done: false },
            { id: 'ch4', icon: '💎', name: 'تتابع ×5 في التحدي', desc: '5 إجابات صحيحة متتالية', reward: 6, xpBonus: 40, goal: 5, progress: 0, done: false },
            { id: 'ch5', icon: '🏆', name: 'تجاوز 100 نقطة', desc: 'احصل على أكثر من 100 نقطة', reward: 15, xpBonus: 100, goal: 100, progress: 0, done: false },
        ];

        function initChallengeTasks() {
            if (!st.challengeTasks || !st.challengeTasksDate || st.challengeTasksDate !== todayStr()) {
                st.challengeTasks = CHALLENGE_TASKS_DEF.map(t => ({...t}));
                st.challengeTasksDate = todayStr();
                saveSt();
            }
        }

        function renderChallengeTasks() {
            const el = document.getElementById('challengeTasksList');
            if (!el) return;
            initChallengeTasks();
            const T = st.challengeTasks;
            const done = T.filter(t=>t.done).length;
            const pct = T.length ? Math.round((done/T.length)*100) : 0;
            const pctEl = document.getElementById('challengeTasksPct');
            if(pctEl) pctEl.textContent = pct + '%';
            const barEl = document.getElementById('challengeTasksBar');
            if(barEl) barEl.style.width = pct+'%';
            el.innerHTML = T.map(t => {
                const p = Math.min(100, Math.round((t.progress/t.goal)*100));
                return `<div class="task-item ${t.done?'done':''}" style="margin-bottom:6px;">
                    <div class="task-item-icon">${t.icon}</div>
                    <div class="task-item-info">
                        <div class="task-item-name">${t.name}</div>
                        <div class="task-item-desc">${t.desc}</div>
                        <div class="task-prog-bar"><div class="task-prog-fill" style="width:${p}%"></div></div>
                    </div>
                    <div class="task-right">
                        <div class="task-reward">${t.done?'✅':`+${t.reward}💰`}</div>
                        <div class="task-prog-txt" style="font-size:0.6em;color:var(--accent2);">${t.done?'':`+${t.xpBonus}XP`}</div>
                    </div>
                </div>`;
            }).join('');
        }

        function updChallengeTask(type, amount) {
            initChallengeTasks();
            const T = st.challengeTasks;
            let changed = false;
            T.forEach(t => {
                if (t.done) return;
                if (type==='game' && t.id==='ch1') { t.progress=Math.min(t.goal,t.progress+1); if(t.progress>=t.goal){t.done=true;st.coins+=t.reward;st.xp+=t.xpBonus;changed=true;} }
                if (type==='correct' && (t.id==='ch2'||t.id==='ch4')) { t.progress=Math.min(t.goal,t.progress+1); if(t.progress>=t.goal){t.done=true;st.coins+=t.reward;st.xp+=t.xpBonus;changed=true;} }
                if (type==='score' && (t.id==='ch3'||t.id==='ch5')) { t.progress=Math.max(t.progress,amount); if(t.progress>=t.goal){t.done=true;st.coins+=t.reward;st.xp+=t.xpBonus;changed=true;} }
            });
            if (changed) { playSound('levelup'); showFeedback('✅ مهمة تحدي مكتملة!'); }
            saveSt();
            renderChallengeTasks();
        }

