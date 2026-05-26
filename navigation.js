/* NAVIGATION */
        /* ═══════════ NAVIGATION ═══════════ */
        const TABS = ['home', 'play', 'achieve', 'leaderboard', 'settings', 'shop'];

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
            if (tab === 'settings') {
                loadProfileForm();
            }
            if (tab === 'shop') {
                /* تحديث رصيد المتجر وتشغيل المتجر الجديد */
                try { if (typeof renderShop === 'function') renderShop(); } catch(e) {}
            }
            if (tab === 'home') { updateHomeStats();
                renderHistory(); }
        /* إظهار زر الإعدادات دائماً ما عدا صفحة الإعدادات نفسها */
        const settingsBtn = document.getElementById('mainSettingsBtn');
        if (settingsBtn) {
            settingsBtn.style.display = (tab === 'settings') ? 'none' : 'flex';
        }
            if (tab === 'leaderboard') {
                loadCombinedLeaderboard();
                const el = document.getElementById('challengeBestDisplay');
                if (el) el.textContent = st.challengeBestScore || 0;
            }
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
            /* بطاقتا التحديات في تفاصيل الفئات دائماً مغلقتان — الدخول فقط من القائمة السفلية */
            if (playChallengesCard) {
                playChallengesCard.classList.add('locked');
                playChallengesCard.onclick = () => showFeedback('⚔️ التحديات متاحة من قسم التحديات في القائمة السفلية');
            }
            if (homeChallengesCat) {
                homeChallengesCat.classList.add('locked');
                homeChallengesCat.onclick = () => showFeedback('⚔️ التحديات متاحة من قسم التحديات في القائمة السفلية');
            }
            const advancedUnlocked = level >= 7;
            const gcardAdvanced = document.getElementById('gcardAdvanced');
            const catAdvanced = document.getElementById('catAdvanced');
            if (gcardAdvanced) {
                if (!advancedUnlocked) {
                    gcardAdvanced.classList.add('locked');
                    gcardAdvanced.onclick = null;
                    const _ba = gcardAdvanced.querySelector('.gcard-badge'); if(_ba) _ba.textContent = '🔒 Lv.7';
                    if (document.getElementById('gcardAdvancedStats')) document.getElementById(
                        'gcardAdvancedStats').textContent = 'يفتح عند Lv.7';
                } else {
                    gcardAdvanced.classList.remove('locked');
                    gcardAdvanced.onclick = () => startGameWith('classic', 'advanced', null, true);
                    const _ba2 = gcardAdvanced.querySelector('.gcard-badge'); if(_ba2) _ba2.textContent = 'متاح';
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
                    const _bl = gcardLaws.querySelector('.gcard-badge'); if(_bl) _bl.textContent = '🔒 Lv.10';
                    if (document.getElementById('gcardLawsStats')) document.getElementById('gcardLawsStats').textContent =
                        'يفتح عند Lv.10';
                } else {
                    gcardLaws.classList.remove('locked');
                    gcardLaws.onclick = () => startGameWith('classic', 'laws', null, true);
                    const _bl2 = gcardLaws.querySelector('.gcard-badge'); if(_bl2) _bl2.textContent = 'متاح';
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
            /* تحديد مصدر اللعبة بناءً على الصفحة النشطة */
            const activePage = document.querySelector('.page.active');
            if (activePage) {
                if (activePage.id === 'page-play') window._gameSource = 'play';
                else if (activePage.id === 'page-leaderboard') window._gameSource = 'leaderboard';
                else window._gameSource = 'home';
            }
            const grid = document.getElementById('opModeGrid'),
                title = document.getElementById('opSheetTitle');
            if (cat === 'counter') {
                title.textContent = '🧮 العمليات على الأعداد';
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



