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
            if (tab === 'play') {
                /* ✅ FIX-2.5d: مزامنة أزرار الصعوبة عند فتح صفحة الألعاب */
                if (typeof syncDiffChips === 'function') syncDiffChips();
            }
        /* إظهار زر الإعدادات دائماً ما عدا صفحة الإعدادات نفسها */
        const settingsBtn = document.getElementById('mainSettingsBtn');
        if (settingsBtn) {
            settingsBtn.style.display = (tab === 'settings') ? 'none' : 'flex';
        }
            if (tab === 'leaderboard') {
                if (typeof initCompetitionPage === 'function') initCompetitionPage();
            }
        }

        function getDifficultyByLevel() {
            /*
             * ✅ منحنى سلس — لا قفزات مفاجئة
             * يعتمد على LEVEL_PHASES من questions_engine.js إن وُجدت
             * وإلا يستخدم منحنى تدريجي محلي
             */
            var level = st.level || 1;

            /* استخدام خريطة المستويات الدقيقة إن كانت متاحة */
            if (typeof LEVEL_PHASES !== 'undefined') {
                for (var i = 0; i < LEVEL_PHASES.length; i++) {
                    if (level >= LEVEL_PHASES[i].from && level <= LEVEL_PHASES[i].to) {
                        return LEVEL_PHASES[i].diff;
                    }
                }
                return 'genius'; /* فوق المستوى 200 */
            }

            /* fallback: منحنى تدريجي بدون قفزات */
            if (level >= 66)  return 'genius';
            if (level >= 23)  return 'hard';
            if (level >= 11)  return 'medium';
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
                    gcardAdvanced.onclick = () => openAdvancedGame();
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
            document.querySelectorAll('.diff-chip').forEach(c => {
                if (!c.classList.contains('locked')) c.classList.remove('active');
            });
            el.classList.add('active');
            /* ✅ FIX-2.5b: 'auto' = تلقائي حسب المستوى | باقي القيم = اختيار يدوي صريح */
            st.difficulty = diff; /* 'easy'|'medium'|'hard'|'genius'|'auto' */
            playSound('click');
            saveSt();
        }

        /* ✅ FIX-2.5b: تحديث زر التلقائي عند تحميل الواجهة */
        function syncDiffChips() {
            const d = st.difficulty || 'auto';
            document.querySelectorAll('.diff-chip').forEach(c => {
                if (!c.classList.contains('locked')) c.classList.remove('active');
            });
            const map = {
                'easy':   'diffEasy',
                'medium': 'diffMedium',
                'hard':   'diffHard',
                'genius': 'diffGenius',
                'auto':   'diffAuto'
            };
            const targetId = map[d];
            if (targetId) {
                const el = document.getElementById(targetId);
                if (el && !el.classList.contains('locked')) el.classList.add('active');
            }
        }

        function openSheet(id) { document.getElementById(id).classList.add('active'); }

        function closeSheet(id) { document.getElementById(id).classList.remove('active'); }

        function sheetBg(e, id) { if (e.target.id === id) closeSheet(id); }

        function openModeSheet(op) { currentOp = op || st.lastOp;
            openSheet('modeSheet'); }

        function openCounterGame() { openOpSheet('counter', true); }

        /* 🧠 بطاقة العقل — فتح sheet ألعاب العقل */
        function openMindGame() {
            window._gameSource = 'mindgame';    /* زر العودة يرجع لبطاقة العقل — للذاكرة والسلسلة فقط */
            const grid  = document.getElementById('opModeGrid');
            const title = document.getElementById('opSheetTitle');
            title.textContent = '🧠 ألعاب العقل';

            /* عرض أفضل سلسلة للاعب */
            const bestChain  = st.chainBest  || 0;
            const bestSudden = st.suddenBest || 0;
            const bestRocket = st._rocketMaxStage || 0;
            const chainBadge = bestChain >= 10
                ? '<div class="mode-card-badge" style="background:linear-gradient(135deg,#f0b90b,#f97316);">×' + bestChain + '</div>'
                : '<div class="mode-card-badge">جديد</div>';
            const suddenBadge = bestSudden >= 10
                ? '<div class="mode-card-badge" style="background:linear-gradient(135deg,#ef4444,#f97316);">⚡' + bestSudden + '</div>'
                : '<div class="mode-card-badge" style="background:#ef4444">حار</div>';
            const rocketStageNames = ['سهل', 'سهل+', 'متوسط', 'متوسط+', 'صعب', 'صعب+', 'عبقري'];
            const rocketBadge = bestRocket >= 4
                ? '<div class="mode-card-badge" style="background:linear-gradient(135deg,#7c3aed,#06b6d4);">🚀 ' + rocketStageNames[bestRocket] + '</div>'
                : '<div class="mode-card-badge" style="background:#7c3aed">جديد</div>';

            grid.innerHTML = `
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('memory','mix', null, false)">
                    <div class="mode-card-badge">متاح</div>
                    <span class="mode-card-icon">🧠</span>
                    <div class="mode-card-name">الذاكرة</div>
                    <div class="mode-card-desc">10 أسئلة • تظهر 3 ثوانٍ ثم تختفي</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('chain','mix', null, false)" style="border:1px solid rgba(240,185,11,0.3);">
                    ${chainBadge}
                    <span class="mode-card-icon">🔗</span>
                    <div class="mode-card-name">السلسلة</div>
                    <div class="mode-card-desc">ناتج كل سؤال = مدخل التالي • خطأ = نهاية${bestChain > 0 ? ' • أفضلك: ' + bestChain : ''}</div>
                </div>
                <div class="mode-card" onclick="window._gameSource='play'; closeSheet('opSheet'); startGameWith('sudden','mix', null, true)" style="border:1px solid rgba(239,68,68,0.35);">
                    ${suddenBadge}
                    <span class="mode-card-icon">⏱️</span>
                    <div class="mode-card-name">ضد الساعة</div>
                    <div class="mode-card-desc">10 ثوانٍ/سؤال • خطأ = نهاية • ×2.0💰${bestSudden > 0 ? ' • أفضلك: ' + bestSudden : ''}</div>
                </div>
                <div class="mode-card" onclick="window._gameSource='play'; closeSheet('opSheet'); startGameWith('rocket','mix', null, false)" style="border:1px solid rgba(124,58,237,0.35);">
                    ${rocketBadge}
                    <span class="mode-card-icon">🚀</span>
                    <div class="mode-card-name">الصاروخ</div>
                    <div class="mode-card-desc">تصعيد تلقائي • 5 أسئلة/مرحلة • 3 قلوب${bestRocket > 0 ? ' • أعلى مرحلة: ' + rocketStageNames[bestRocket] : ''}</div>
                </div>
                <div class="mode-card" onclick="window._gameSource='play'; closeSheet('opSheet'); startGameWith('classic','laws', null, true)" style="border:1px solid rgba(16,185,129,0.35);">
                    <div class="mode-card-badge" style="background:#10b981">جديد</div>
                    <span class="mode-card-icon">🧩</span>
                    <div class="mode-card-name">ألغاز رياضية</div>
                    <div class="mode-card-desc">قوانين وألغاز • تطبيق مبادئ الرياضيات</div>
                </div>
            `;
            openSheet('opSheet');
        }

        function openAdvancedGame() {
            if (st.level < 7) { showFeedback('🔒 هذا القسم مقفول حتى المستوى 7'); return; }
            window._gameSource = 'play';
            const grid  = document.getElementById('opModeGrid');
            const title = document.getElementById('opSheetTitle');
            title.textContent = '📐 الرياضيات المتقدمة';

            grid.innerHTML = `
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_roots','mix', null, true)" style="border:1px solid rgba(240,185,11,0.35);">
                    <div class="mode-card-badge" style="background:linear-gradient(135deg,#f0b90b,#f97316);">جديد</div>
                    <span class="mode-card-icon">🔢</span>
                    <div class="mode-card-name">الأسس والجذور</div>
                    <div class="mode-card-desc">قوى • جذور تربيعية • جذور تكعيبية</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_log','mix', null, true)" style="border:1px solid rgba(6,182,212,0.35);">
                    <div class="mode-card-badge" style="background:#06b6d4;">جديد</div>
                    <span class="mode-card-icon">📊</span>
                    <div class="mode-card-name">اللوغاريتم</div>
                    <div class="mode-card-desc">log • ln • خصائص اللوغاريتم</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_geo','mix', null, true)" style="border:1px solid rgba(16,185,129,0.35);">
                    <div class="mode-card-badge" style="background:#10b981;">جديد</div>
                    <span class="mode-card-icon">📐</span>
                    <div class="mode-card-name">الهندسة</div>
                    <div class="mode-card-desc">مساحات • محيطات • حجوم • فيثاغورس</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_eq','mix', null, true)" style="border:1px solid rgba(239,68,68,0.35);">
                    <div class="mode-card-badge" style="background:#ef4444;">جديد</div>
                    <span class="mode-card-icon">🔣</span>
                    <div class="mode-card-name">المعادلات</div>
                    <div class="mode-card-desc">معادلات الدرجة الأولى • نظام معادلتين</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_seq','mix', null, true)" style="border:1px solid rgba(124,58,237,0.35);">
                    <div class="mode-card-badge" style="background:#7c3aed;">جديد</div>
                    <span class="mode-card-icon">📈</span>
                    <div class="mode-card-name">المتتاليات</div>
                    <div class="mode-card-desc">حسابية • هندسية • فيبوناتشي • مربعات</div>
                </div>
                <div class="mode-card" onclick="closeSheet('opSheet'); startGameWith('adv_trig','mix', null, true)" style="border:1px solid rgba(236,72,153,0.35);">
                    <div class="mode-card-badge" style="background:#ec4899;">جديد</div>
                    <span class="mode-card-icon">📐</span>
                    <div class="mode-card-name">المثلثات</div>
                    <div class="mode-card-desc">جا • جتا • ظا • الزوايا القياسية</div>
                </div>
            `;
            openSheet('opSheet');
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
                    <div class="mode-card" onclick="startTableGame()"><span class="mode-card-icon">📊</span><div class="mode-card-name">جدول الضرب</div><div class="mode-card-desc">جداول 1–30 • 10 أسئلة • مؤقت</div></div>`;
                grid.innerHTML = html;
            } else {
                title.textContent = '⚡ التحديات';
                grid.innerHTML = `
                    <div class="mode-card" onclick="startGameWith('speed','mix', null, true)">
                        <span class="mode-card-icon">⚡</span>
                        <div class="mode-card-name">السرعة</div>
                        <div class="mode-card-desc">60 ثانية • مفتوح • ×1.5💰</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('frenzy','mix', null, true)">
                        <span class="mode-card-icon">💥</span>
                        <div class="mode-card-name">الاندفاع</div>
                        <div class="mode-card-desc">30 ثانية • مفتوح • ×1.8💰</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('survival','mix', null, false)">
                        <span class="mode-card-icon">🔥</span>
                        <div class="mode-card-name">البقاء</div>
                        <div class="mode-card-desc">بدون وقت • 3 أخطاء • ×1.3💰</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('accuracy','mix', null, true)">
                        <div class="mode-card-badge">جديد</div>
                        <span class="mode-card-icon">🎯</span>
                        <div class="mode-card-name">الدقة</div>
                        <div class="mode-card-desc">20 سؤال • 60 ثانية • ×1.6💰 🎯</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('marathon','mix', null, true)">
                        <div class="mode-card-badge">جديد</div>
                        <span class="mode-card-icon">🏆</span>
                        <div class="mode-card-name">الماراثون</div>
                        <div class="mode-card-desc">50 سؤال • 60 ثانية • ×2.0💰 🏆</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('impossible','mix', null, true)" style="border:1px solid rgba(239,68,68,0.35);">
                        <div class="mode-card-badge" style="background:var(--red)">تحدي</div>
                        <span class="mode-card-icon">💀</span>
                        <div class="mode-card-name">المستحيل</div>
                        <div class="mode-card-desc">10 أسئلة • 1.5ث/سؤال • ×2.5💰 💀</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('daily','mix', null, false)">
                        <div class="mode-card-badge">+3💰</div>
                        <span class="mode-card-icon">🌟</span>
                        <div class="mode-card-name">تحدي اليوم</div>
                        <div class="mode-card-desc">بدون وقت • مكافأة خاصة</div>
                    </div>`;
            }
            openSheet('opSheet');
        }

        function startTableGame() {
            closeSheet('opSheet');
            /* ألوان تدرجية لكل مجموعة من الجداول */
            const colors = [
                '#10b981','#10b981','#10b981',  /* 1-3  أخضر */
                '#06b6d4','#06b6d4','#06b6d4',  /* 4-6  سماوي */
                '#f0b90b','#f0b90b','#f0b90b',  /* 7-9  ذهبي */
                '#f97316','#f97316','#f97316',  /* 10-12 برتقالي */
                '#7c3aed','#7c3aed','#7c3aed',  /* 13-15 بنفسجي */
                '#ef4444','#ef4444','#ef4444',  /* 16-18 أحمر */
                '#06b6d4','#10b981','#f0b90b',  /* 19-21 متنوع */
                '#7c3aed','#f97316','#ef4444',  /* 22-24 متنوع */
                '#10b981','#06b6d4','#f0b90b',  /* 25-27 متنوع */
                '#7c3aed','#f97316','#ef4444'   /* 28-30 متنوع */
            ];
            const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟',
                '1️⃣1️⃣','1️⃣2️⃣','1️⃣3️⃣','1️⃣4️⃣','1️⃣5️⃣','1️⃣6️⃣','1️⃣7️⃣','1️⃣8️⃣','1️⃣9️⃣','2️⃣0️⃣',
                '2️⃣1️⃣','2️⃣2️⃣','2️⃣3️⃣','2️⃣4️⃣','2️⃣5️⃣','2️⃣6️⃣','2️⃣7️⃣','2️⃣8️⃣','2️⃣9️⃣','3️⃣0️⃣'];
            const grid = document.getElementById('opModeGrid');
            document.getElementById('opSheetTitle').textContent = '📊 اختر جدول الضرب (1 – 30)';
            /* حاوية قابلة للتمرير بارتفاع ثابت */
            let html = `<div id="tablePickerGrid" style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:8px;
                max-height:52vh;
                overflow-y:auto;
                -webkit-overflow-scrolling:touch;
                padding:4px 2px 8px;
                scrollbar-width:thin;
            ">`;
            for (let i = 1; i <= 30; i++) {
                const col = colors[i-1];
                const mastered = (st.stats && st.stats['table_'+i] && st.stats['table_'+i].cor >= 20);
                html += `<div onclick="closeSheet('opSheet');startTableGameWith(${i})"
                    style="
                        background:rgba(${hexToRgb(col)},0.12);
                        border:1.5px solid ${col}55;
                        border-radius:16px;
                        padding:12px 6px 10px;
                        text-align:center;
                        cursor:pointer;
                        transition:0.2s;
                        position:relative;
                    "
                    onmousedown="this.style.transform='scale(0.93)'"
                    onmouseup="this.style.transform='scale(1)'"
                    ontouchstart="this.style.transform='scale(0.93)'"
                    ontouchend="this.style.transform='scale(1)'"
                >
                    ${mastered ? '<div style="position:absolute;top:4px;right:6px;font-size:0.55em;color:'+col+';">✅</div>' : ''}
                    <div style="font-size:1.5em;margin-bottom:4px;">${emojis[i-1] || '📊'}</div>
                    <div style="font-size:0.82em;font-weight:900;color:${col};">× ${i}</div>
                    <div style="font-size:0.58em;color:var(--text2);margin-top:2px;">${i} × 1 … ${i} × 12</div>
                </div>`;
            }
            html += '</div>';
            /* مؤشر تمرير بصري */
            html += `<div style="text-align:center;font-size:0.62em;color:var(--text3);margin-top:6px;padding:2px 0;">
                ↕ مرّر لرؤية المزيد • الجداول 1 – 30
            </div>`;
            grid.style.display = 'block';
            grid.innerHTML = html;
            openSheet('opSheet');
        }

        /* دالة مساعدة: تحويل hex إلى rgb للـ rgba */
        function hexToRgb(hex) {
            const r = parseInt(hex.slice(1,3),16);
            const g = parseInt(hex.slice(3,5),16);
            const b = parseInt(hex.slice(5,7),16);
            return `${r},${g},${b}`;
        }

        window.startTableGameWith = function(table) {
            const grid = document.getElementById('opModeGrid');
            if (grid) grid.style.display = '';
            closeSheet('opSheet');
            startGameWith('classic', 'table', table, true);
        };

        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

        function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

        function getCatStatsKey(op) {
            const map = { add: 'addition', sub: 'subtraction', mul: 'multiplication', div: 'division', mix: 'addition',
                table: 'table', percent: 'percentage', fraction: 'division', power: 'algebra', sqrt: 'squareroot',
                equation: 'algebra', sequence: 'puzzles', algebra: 'algebra', word: 'wordproblems',
                geometry: 'geometry', advanced: 'algebra', laws: 'mathlaws',
                adv_roots: 'algebra', adv_log: 'algebra', adv_geo: 'geometry',
                adv_eq: 'algebra', adv_seq: 'puzzles', adv_trig: 'algebra' };
            return map[op] || 'addition';
        }



