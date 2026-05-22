/* NAVIGATION */
        /* ═══════════ NAVIGATION ═══════════ */
        const TABS = ['home', 'play', 'stats', 'store', 'profile', 'leaderboard', 'settings'];

        function goTab(tab) {
            TABS.forEach(t => {
                document.getElementById('page-' + t)?.classList.toggle('active', t === tab);
                document.getElementById('nav-' + t)?.classList.toggle('active', t === tab);
            });
            playSound('click');

            /* ── تحديث الشريط السفلي: تمييز زر المنافسة دائماً ── */
            _highlightCompetitionBtn(tab);

            if (tab === 'stats') {
                checkDailyReset();
                renderTasks();
                renderAchievements();
                _updateAchieveProgress();
                updatePeriodStats();
                /* تحديث الإحصائيات في صفحة stats */
                const ds = st.dailyStats || {};
                function _s(id, val) { const e = document.getElementById(id); if(e) e.textContent = val; }
                _s('statsDailyCorrect', ds.correct || 0);
                _s('statsDailyWrong', ds.wrong || 0);
                _s('statsDailyGames', ds.games || 0);
                const tot = (ds.correct||0) + (ds.wrong||0);
                _s('statsDailyAccuracy', tot > 0 ? Math.round(((ds.correct||0)/tot)*100)+'%' : '0%');
            }

            if (tab === 'store') {
                /* تحديث عملات المتجر */
                const sc = document.getElementById('storeCoinsDisplay');
                if (sc) sc.textContent = st.coins;
                if (typeof renderEmojiShop === 'function') renderEmojiShop();
            }

            if (tab === 'profile') {
                checkDailyReset();
                loadProfileForm();
                renderProfileDailyTasks && renderProfileDailyTasks();
                renderProfileAchievements && renderProfileAchievements();
                const pb  = document.getElementById('profileChallengeBest');
                if (pb)   pb.textContent  = st.challengeBestScore || 0;
                const pTG = document.getElementById('profileTotalGames');
                if (pTG)  pTG.textContent = st.totalGames;
                const pBS = document.getElementById('profileBestScore');
                if (pBS)  pBS.textContent = st.bestScore;
                const pAcc = document.getElementById('profileAccuracy');
                if (pAcc) {
                    const tot = st.correctTotal + st.wrongTotal;
                    pAcc.textContent = tot > 0 ? Math.round((st.correctTotal / tot) * 100) + '%' : '0%';
                }
                /* تحديث إحصائيات الملف الشخصي */
                const sc = document.getElementById('statCorrect'); if(sc) sc.textContent = st.correctTotal || 0;
                const sb = document.getElementById('statBestStreak'); if(sb) sb.textContent = '×'+(st.bestStreak||0);
                const scp = document.getElementById('statCoinsP'); if(scp) scp.textContent = st.coins || 0;
                /* IDs المحدثة في صفحة الملف الشخصي */
                const psc = document.getElementById('profileStatCorrect'); if(psc) psc.textContent = st.correctTotal || 0;
                const psb = document.getElementById('profileStatBestStreak'); if(psb) psb.textContent = '×'+(st.bestStreak||0);
                const pscp = document.getElementById('profileStatCoinsP'); if(pscp) pscp.textContent = st.coins || 0;
                try { if (typeof renderProfileTitles === 'function') renderProfileTitles(); } catch(e) {}
            }

            if (tab === 'home') {
                checkDailyReset();
                updateHomeStats();
                renderHistory();
                updatePeriodStats();
                /* تحديث المهام في الرئيسية */
                _renderHomeTasks();
                _renderHomeAchievements();
            }

            if (tab === 'leaderboard') {
                loadCombinedLeaderboard();
                const el = document.getElementById('challengeBestDisplay');
                if (el) el.textContent = st.challengeBestScore || 0;
                if (typeof renderChallengeTasks === 'function') renderChallengeTasks();
                _updateWeeklyRank();
            }

            if (tab === 'play') {
                updateUnlocks();
            }

            if (tab === 'settings') {
                /* مزامنة حالة الصوت في صفحة الإعدادات */
                _syncSettingsPage();
                /* توليد الرقم التسلسلي إن لم يكن موجوداً */
                if (!st.serialNumber && typeof _autoGenerateSerial === 'function') {
                    _autoGenerateSerial();
                }
                if (typeof updateSerialNumberDisplay === 'function') updateSerialNumberDisplay();
            }
        }

        /* ── مزامنة حالة الصوت في صفحة الإعدادات ── */
        function _syncSettingsPage() {
            const ss = document.getElementById('soundStatus');
            const bs = document.getElementById('bgMusicStatus');
            const vs = document.getElementById('vibrationStatus');
            if (ss) ss.textContent = st.soundOn ? 'مفعّل' : 'معطّل';
            if (bs) bs.textContent = st.bgOn ? 'مفعّلة' : 'معطّلة';
            if (vs) vs.textContent = st.vibrationOn ? 'مفعّل' : 'معطّل';
            const svs = document.getElementById('soundVolSlider');
            const bvs = document.getElementById('bgVolSlider');
            if (svs) { svs.value = st.soundVolume; const sv = document.getElementById('soundVolVal'); if(sv) sv.textContent = st.soundVolume + '%'; }
            if (bvs) { bvs.value = st.bgVolume;    const bv = document.getElementById('bgVolVal');   if(bv) bv.textContent = st.bgVolume + '%'; }
            /* مزامنة الثيم */
            const di = document.getElementById('darkLightIcon');
            const dl = document.getElementById('darkLightLabel');
            if (di) di.textContent = st.darkMode ? '🌙' : '☀️';
            if (dl) dl.textContent = st.darkMode ? 'داكن' : 'فاتح';
        }

        /* ── رسم المهام في الصفحة الرئيسية ── */
        function _renderHomeTasks() {
            if (typeof generateDailyTasks !== 'function') return;
            const tasks = st.dailyTasks || [];
            const container = document.getElementById('homeTasksList');
            if (!container) return;
            const done = tasks.filter(t => t.done).length;
            const pctEl = document.getElementById('homeTasksPct');
            const barEl = document.getElementById('homeTasksBarFill');
            const cdEl  = document.getElementById('homeDailyCountdown');
            if (pctEl) pctEl.textContent = tasks.length > 0 ? Math.round(done/tasks.length*100)+'%' : '0%';
            if (barEl) barEl.style.width = tasks.length > 0 ? (done/tasks.length*100)+'%' : '0%';
            const shown = tasks.slice(0, 4);
            container.innerHTML = shown.map(t => {
                const pct = t.target > 0 ? Math.min(100, Math.round((t.progress/t.target)*100)) : 0;
                return `<div class="task-item ${t.done ? 'done' : ''}" style="margin-bottom:6px;">
                    <div class="task-check">${t.done ? '✅' : '⬜'}</div>
                    <div class="task-info">
                        <div class="task-name">${t.icon || '🎯'} ${t.name}</div>
                        <div class="task-reward">+${t.coins}💰 • ${t.done ? 'مكتمل' : t.progress+'/'+t.target}</div>
                    </div>
                    <div class="task-pct">${t.done ? '' : pct+'%'}</div>
                </div>`;
            }).join('');
        }

        /* ── رسم الإنجازات في الصفحة الرئيسية (أول 3) ── */
        function _renderHomeAchievements() {
            if (typeof ACHIEVEMENTS_DEF === 'undefined') return;
            const total = ACHIEVEMENTS_DEF.length;
            const done  = (st.achievementsUnlocked || []).length;
            const pct   = total > 0 ? Math.round((done/total)*100) : 0;
            const bar   = document.getElementById('homeAchieveProgressBar');
            const pctEl = document.getElementById('homeAchievePct');
            if (bar)   bar.style.width = pct + '%';
            if (pctEl) pctEl.textContent = done + '/' + total;
            const list = document.getElementById('homeAchieveList');
            if (!list) return;
            const unlocked = st.achievementsUnlocked || [];
            const shown = ACHIEVEMENTS_DEF.slice(0, 3);
            list.innerHTML = shown.map(a => {
                const isDone = unlocked.includes(a.id);
                return `<div class="achieve-item ${isDone ? 'unlocked' : ''}" style="margin-bottom:6px;">
                    <div class="achieve-icon">${a.icon || '🏆'}</div>
                    <div class="achieve-info">
                        <div class="achieve-name">${a.name}</div>
                        <div class="achieve-desc">${a.desc || ''}</div>
                    </div>
                    <div class="achieve-status">${isDone ? '✅' : '🔒'}</div>
                </div>`;
            }).join('');
        }

        /* ── تمييز زر المنافسة في الشريط السفلي ── */
        function _highlightCompetitionBtn(tab) {
            const btn = document.getElementById('nav-leaderboard');
            if (!btn) return;
            /* نبقي الـ active class للـ tab المحدد */
            btn.classList.toggle('active', tab === 'leaderboard');
        }

        /* ── تحديث شريط تقدم الإنجازات ── */
        function _updateAchieveProgress() {
            if (typeof ACHIEVEMENTS_DEF === 'undefined') return;
            const total     = ACHIEVEMENTS_DEF.length;
            const done      = (st.achievementsUnlocked || []).length;
            const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
            const barEl     = document.getElementById('achieveProgressBar');
            const textEl    = document.getElementById('achieveProgressText');
            const pctEl     = document.getElementById('achievePct');
            if (barEl)  barEl.style.width = pct + '%';
            if (textEl) textEl.textContent = done + ' من أصل ' + total + ' إنجاز';
            if (pctEl)  pctEl.textContent  = done + '/' + total;
        }

        /* ── تحديث الترتيب الأسبوعي ── */
        function _updateWeeklyRank() {
            /* يتحقق إن تغيّر الأسبوع ويُصفّر best weekly */
            if (!st.challengeWeeklyDate || st.challengeWeeklyDate !== weekStr()) {
                st.challengeWeeklyBest  = 0;
                st.challengeWeeklyDate  = weekStr();
                saveSt();
            }
        }

        /* ═══════════════════════════════════════════════
           صعوبة اللعب حسب المستوى
        ═══════════════════════════════════════════════ */
        function getDifficultyByLevel() {
            if (st.level >= 8) return 'genius';
            if (st.level >= 5) return 'hard';
            if (st.level >= 3) return 'medium';
            return 'easy';
        }

        /* ═══════════════════════════════════════════════
           نظام القفل والفتح التدريجي الكامل
        ═══════════════════════════════════════════════ */
        function updateUnlocks() {
            const lv = st.level;

            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               بطاقة التحديات — تفتح Lv.4
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            _setCardLock('playCardChallenges', lv >= 4, '🔒 Lv.4', 'متاح',
                () => openOpSheet('challenges'));
            _setCatLock('homeCatChallenges', lv >= 4,
                () => openOpSheet('challenges'));

            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               الرياضيات المتقدمة — تفتح Lv.7
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            _setCardLock('gcardAdvanced', lv >= 7, '🔒 Lv.7', 'متاح',
                () => startGameWith('classic', 'advanced', null, true),
                'gcardAdvancedStats', 'يفتح عند Lv.7', 'اضغط للعب');
            _setCatLock('catAdvanced', lv >= 7,
                () => startGameWith('classic', 'advanced', null, true),
                'catAdvancedStats', '🔒 يفتح Lv.7', 'اضغط للعب');

            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               قوانين وألغاز — تفتح Lv.10
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            _setCardLock('gcardLaws', lv >= 10, '🔒 Lv.10', 'متاح',
                () => startGameWith('classic', 'laws', null, true),
                'gcardLawsStats', 'يفتح عند Lv.10', 'اضغط للعب');
            _setCatLock('catLaws', lv >= 10,
                () => startGameWith('classic', 'laws', null, true),
                'catLawsStats', '🔒 يفتح Lv.10', 'اضغط للعب');

            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               مستويات الصعوبة
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            _setDiffLock('diffMedium', 'lockMedium', lv >= 3);
            _setDiffLock('diffHard',   'lockHard',   lv >= 5);
            _setDiffLock('diffGenius', 'lockGenius', lv >= 8);

            /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               أوضاع اللعب في opSheet — داخلية
               السرعة Lv.1 (متاح دائماً)
               الاندفاع Lv.3
               تحمّل Lv.2
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
            /* هذه تُطبَّق عند فتح الـ sheet — راجع openOpSheet */
        }

        /* ── مساعد: قفل/فتح بطاقة لعب ── */
        function _setCardLock(cardId, unlocked, lockLabel, openLabel, onClickFn, statsId, lockStat, openStat) {
            const card = document.getElementById(cardId);
            if (!card) return;
            const badge = card.querySelector('.gcard-badge');
            if (unlocked) {
                card.classList.remove('locked');
                card.onclick = onClickFn;
                if (badge)  badge.textContent = openLabel;
                if (statsId && openStat) {
                    const se = document.getElementById(statsId);
                    if (se) se.textContent = openStat;
                }
            } else {
                card.classList.add('locked');
                card.onclick = () => _showLockedMsg(lockLabel);
                if (badge)  badge.textContent = lockLabel;
                if (statsId && lockStat) {
                    const se = document.getElementById(statsId);
                    if (se) se.textContent = lockStat;
                }
            }
        }

        /* ── مساعد: قفل/فتح فئة الرئيسية ── */
        function _setCatLock(catId, unlocked, onClickFn, statsId, lockStat, openStat) {
            const cat = document.getElementById(catId);
            if (!cat) return;
            if (unlocked) {
                cat.classList.remove('locked');
                cat.onclick = onClickFn;
                if (statsId && openStat) {
                    const se = document.getElementById(statsId);
                    if (se) se.textContent = openStat;
                }
            } else {
                cat.classList.add('locked');
                cat.onclick = () => _showLockedMsg(lockStat || '🔒 مقفول');
                if (statsId && lockStat) {
                    const se = document.getElementById(statsId);
                    if (se) se.textContent = lockStat;
                }
            }
        }

        /* ── مساعد: قفل/فتح شريحة الصعوبة ── */
        function _setDiffLock(chipId, lockTagId, unlocked) {
            const chip = document.getElementById(chipId);
            const tag  = document.getElementById(lockTagId);
            if (!chip) return;
            if (unlocked) {
                chip.classList.remove('locked');
                if (tag) tag.style.display = 'none';
            } else {
                chip.classList.add('locked');
                if (tag) tag.style.display = 'block';
            }
        }

        /* ── رسالة عنصر مقفول ── */
        function _showLockedMsg(label) {
            const lv = (label || '').match(/Lv\.(\d+)/);
            if (lv) showFeedback('🔒 يفتح عند المستوى ' + lv[1]);
            else    showFeedback('🔒 هذا المحتوى مقفول حالياً');
        }

        /* ═══════════════════════════════════════════════
           اختيار الصعوبة
        ═══════════════════════════════════════════════ */
        function selectDiff(el, diff) {
            if (el.classList.contains('locked')) {
                _showLockedMsg(el.querySelector('.lock-tag')?.textContent || '');
                return;
            }
            document.querySelectorAll('.diff-chip').forEach(c => {
                if (!c.classList.contains('locked')) c.classList.remove('active');
            });
            el.classList.add('active');
            st.difficulty = diff;
            playSound('click');
            saveSt();
        }

        /* ═══════════════════════════════════════════════
           Sheets
        ═══════════════════════════════════════════════ */
        function openSheet(id) {
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        }

        function closeSheet(id) {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        }

        function sheetBg(e, id) {
            if (e.target.id === id) closeSheet(id);
        }

        function openModeSheet(op) {
            currentOp = op || st.lastOp;
            openSheet('modeSheet');
        }

        function openCounterGame()  { openOpSheet('counter', true); }

        function openAdvancedGame() {
            if (st.level >= 7) startGameWith('classic', 'advanced', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 7');
        }

        function openLawsGame() {
            if (st.level >= 10) startGameWith('classic', 'laws', null, true);
            else showFeedback('🔒 هذا القسم مقفول حتى المستوى 10');
        }

        /* ═══════════════════════════════════════════════
           Sheet التدريب
        ═══════════════════════════════════════════════ */
        function openTrainingOpSheet() {
            const grid = document.getElementById('trainingOpGrid');
            if (!grid) return;
            grid.innerHTML = `
                <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('add')">
                    <span class="mode-card-icon">➕</span>
                    <div class="mode-card-name">الجمع</div>
                </div>
                <div class="mode-card" onclick="closeSheet('trainingOpSheet');startTrainingMode('sub')">
                    <span class="mode-card-icon">➖</span>
                    <div class="mode-card-name">الطرح</div>
                </div>
                <div class="mode-card ${st.level >= 2 ? '' : 'locked'}"
                     onclick="${st.level >= 2 ? "closeSheet('trainingOpSheet');startTrainingMode('mul')" : "_showLockedMsg('Lv.2')"}">
                    <span class="mode-card-icon">✖️</span>
                    <div class="mode-card-name">الضرب</div>
                    ${st.level < 2 ? '<div class="mode-card-desc">🔒 يفتح Lv.2</div>' : ''}
                </div>
                <div class="mode-card ${st.level >= 2 ? '' : 'locked'}"
                     onclick="${st.level >= 2 ? "closeSheet('trainingOpSheet');startTrainingMode('div')" : "_showLockedMsg('Lv.2')"}">
                    <span class="mode-card-icon">➗</span>
                    <div class="mode-card-name">القسمة</div>
                    ${st.level < 2 ? '<div class="mode-card-desc">🔒 يفتح Lv.2</div>' : ''}
                </div>`;
            openSheet('trainingOpSheet');
        }

        /* ═══════════════════════════════════════════════
           Sheet العمليات / التحديات — مع قفل تدريجي
        ═══════════════════════════════════════════════ */
        function openOpSheet(cat, forceTimerForCounter = false) {
            const grid  = document.getElementById('opModeGrid');
            const title = document.getElementById('opSheetTitle');
            if (!grid || !title) return;

            if (cat === 'counter') {
                title.textContent = '🧮 العمليات على الاعداد';

                /* الجمع والطرح متاحان دائماً */
                let html = `
                    <div class="mode-card" onclick="startGameWith('classic','add',null,true)">
                        <span class="mode-card-icon">➕</span>
                        <div class="mode-card-name">الجمع</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('classic','sub',null,true)">
                        <span class="mode-card-icon">➖</span>
                        <div class="mode-card-name">الطرح</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>`;

                /* الضرب والقسمة: Lv.2 */
                if (st.level >= 2) {
                    html += `
                    <div class="mode-card" onclick="startGameWith('classic','mul',null,true)">
                        <span class="mode-card-icon">✖️</span>
                        <div class="mode-card-name">الضرب</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>
                    <div class="mode-card" onclick="startGameWith('classic','div',null,true)">
                        <span class="mode-card-icon">➗</span>
                        <div class="mode-card-name">القسمة</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>`;
                } else {
                    html += `
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.2')">
                        <span class="mode-card-icon">✖️</span>
                        <div class="mode-card-name">الضرب</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.2</div>
                    </div>
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.2')">
                        <span class="mode-card-icon">➗</span>
                        <div class="mode-card-name">القسمة</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.2</div>
                    </div>`;
                }

                /* المختلط دائماً متاح */
                html += `
                    <div class="mode-card" onclick="startGameWith('classic','mix',null,true)">
                        <div class="mode-card-badge">موصى</div>
                        <span class="mode-card-icon">🎲</span>
                        <div class="mode-card-name">مختلط</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>`;

                /* جدول الضرب: Lv.2 */
                if (st.level >= 2) {
                    html += `
                    <div class="mode-card" onclick="startTableGame()">
                        <span class="mode-card-icon">📊</span>
                        <div class="mode-card-name">جدول الضرب</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>`;
                } else {
                    html += `
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.2')">
                        <span class="mode-card-icon">📊</span>
                        <div class="mode-card-name">جدول الضرب</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.2</div>
                    </div>`;
                }

                grid.innerHTML = html;

            } else {
                /* ── قسم التحديات ── */
                title.textContent = '⚡ التحديات';

                /* السرعة: دائماً متاح */
                let html = `
                    <div class="mode-card" onclick="startGameWith('speed','mix',null,true)">
                        <span class="mode-card-icon">⚡</span>
                        <div class="mode-card-name">السرعة</div>
                        <div class="mode-card-desc">60 ثانية • قلوب • +1/-1 ثانية</div>
                    </div>`;

                /* التحمّل: Lv.2 */
                if (st.level >= 2) {
                    html += `
                    <div class="mode-card" onclick="startGameWith('survival','mix',null,false)">
                        <span class="mode-card-icon">🔥</span>
                        <div class="mode-card-name">التحمّل</div>
                        <div class="mode-card-desc">بدون وقت • 3 أخطاء</div>
                    </div>`;
                } else {
                    html += `
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.2')">
                        <span class="mode-card-icon">🔥</span>
                        <div class="mode-card-name">التحمّل</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.2</div>
                    </div>`;
                }

                /* الاندفاع: Lv.3 */
                if (st.level >= 3) {
                    html += `
                    <div class="mode-card" onclick="startGameWith('frenzy','mix',null,true)">
                        <span class="mode-card-icon">💥</span>
                        <div class="mode-card-name">الاندفاع</div>
                        <div class="mode-card-desc">30 ثانية • كل إجابة تمنح وقتاً</div>
                    </div>`;
                } else {
                    html += `
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.3')">
                        <span class="mode-card-icon">💥</span>
                        <div class="mode-card-name">الاندفاع</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.3</div>
                    </div>`;
                }

                /* تحدي اليوم: دائماً متاح */
                html += `
                    <div class="mode-card" onclick="startGameWith('daily','mix',null,false)">
                        <div class="mode-card-badge">+3💰</div>
                        <span class="mode-card-icon">🌟</span>
                        <div class="mode-card-name">تحدي اليوم</div>
                        <div class="mode-card-desc">بدون وقت • مكافأة خاصة</div>
                    </div>`;

                /* التحدي السريع: Lv.4 */
                if (st.level >= 4) {
                    html += `
                    <div class="mode-card" onclick="closeSheet('opSheet');startQuickChallenge()">
                        <div class="mode-card-badge">جديد</div>
                        <span class="mode-card-icon">🚀</span>
                        <div class="mode-card-name">التحدي السريع</div>
                        <div class="mode-card-desc">60 ثانية • أسئلة عشوائية متنوعة</div>
                    </div>`;
                } else {
                    html += `
                    <div class="mode-card locked" onclick="_showLockedMsg('Lv.4')">
                        <span class="mode-card-icon">🚀</span>
                        <div class="mode-card-name">التحدي السريع</div>
                        <div class="mode-card-desc">🔒 يفتح Lv.4</div>
                    </div>`;
                }

                grid.innerHTML = html;
            }

            openSheet('opSheet');
        }

        /* ═══════════════════════════════════════════════
           جدول الضرب
        ═══════════════════════════════════════════════ */
        function startTableGame() {
            closeSheet('opSheet');
            const maxT = st.difficulty === 'easy'   ? 10
                       : st.difficulty === 'medium'  ? 15
                       : st.difficulty === 'hard'    ? 20 : 30;
            let btns = '';
            for (let i = 1; i <= maxT; i++) {
                btns += `<div class="mode-card" onclick="closeSheet('opSheet');startTableGameWith(${i})">
                            <span class="mode-card-icon">📊</span>
                            <div class="mode-card-name">جدول ${i}</div>
                         </div>`;
            }
            const grid = document.getElementById('opModeGrid');
            document.getElementById('opSheetTitle').textContent = '📊 اختر جدول الضرب';
            grid.innerHTML = btns;
            openSheet('opSheet');
        }

        window.startTableGameWith = function(table) {
            closeSheet('opSheet');
            startGameWith('classic', 'table', table, true);
        };

        /* ═══════════════════════════════════════════════
           التحدي السريع — 60 ثانية أسئلة متنوعة
        ═══════════════════════════════════════════════ */
        function startQuickChallenge() {
            if (st.level < 4) { showFeedback('🔒 يفتح عند المستوى 4'); return; }
            startGameWith('speed', 'mix', null, true);
        }

        /* ═══════════════════════════════════════════════
           أدوات مساعدة
        ═══════════════════════════════════════════════ */
        function rnd(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }

        function shuffle(a) {
            return [...a].sort(() => Math.random() - 0.5);
        }

        function getCatStatsKey(op) {
            const map = {
                add: 'addition', sub: 'subtraction', mul: 'multiplication',
                div: 'division', mix: 'addition',    table: 'table',
                percent: 'percentage', fraction: 'division', power: 'algebra',
                sqrt: 'squareroot',    equation: 'algebra',  sequence: 'puzzles',
                algebra: 'algebra',   word: 'wordproblems',  geometry: 'geometry',
                advanced: 'algebra',  laws: 'mathlaws'
            };
            return map[op] || 'addition';
        }

        /* ═══════════════════════════════════════════════
           التحقق من إعادة تعيين اليوم
        ═══════════════════════════════════════════════ */
        function checkDailyReset() {
            const today = todayStr();

            /* إعادة تعيين المهام اليومية */
            if (st.dailyDate !== today) {
                st.dailyDate  = today;
                st.dailyTasks = [];
                if (typeof generateDailyTasks === 'function') generateDailyTasks();
                saveSt();
            }

            /* إعادة تعيين درع الحماية */
            if (st.lastShieldDate !== today) {
                st.dailyShieldUsed = false;
                st.lastShieldDate  = today;
            }

            /* مكافأة تسجيل الدخول */
            if (typeof checkDailyLoginReward === 'function') checkDailyLoginReward();

            /* صندوق المفاجآت */
            if (typeof checkLootbox === 'function') checkLootbox();
        }

        /* ═══════════════════════════════════════════════
           شريحة الإعدادات السريعة أثناء اللعب
        ═══════════════════════════════════════════════ */
        function openGameSettingsAndPause() {
            if (typeof pauseGameTimer === 'function') pauseGameTimer();
            _syncGameSettingsUI();
            openSheet('gameSettingsSheet');
        }

        function closeGameSettingsAndResume() {
            closeSheet('gameSettingsSheet');
            if (typeof resumeGameTimer === 'function') resumeGameTimer();
        }

        function sheetBgAndResume(e, id) {
            if (e.target.id === id) closeGameSettingsAndResume();
        }

        function _syncGameSettingsUI() {
            const gs = document.getElementById('gsoundStatus');
            const gb = document.getElementById('gbgMusicStatus');
            const gv = document.getElementById('gVibrationStatus');
            if (gs) gs.textContent = st.soundOn ? 'مفعّل' : 'معطّل';
            if (gb) gb.textContent = st.bgOn    ? 'مفعّلة' : 'معطّلة';
            if (gv) gv.textContent = st.vibrationOn ? 'مفعّل' : 'معطّل';

            const gsv = document.getElementById('gSoundVolSlider');
            const gbv = document.getElementById('gBgVolSlider');
            if (gsv) { gsv.value = st.soundVolume; const gsvv = document.getElementById('gSoundVolVal'); if(gsvv) gsvv.textContent = st.soundVolume + '%'; }
            if (gbv) { gbv.value = st.bgVolume;    const gbvv = document.getElementById('gBgVolVal');    if(gbvv) gbvv.textContent = st.bgVolume    + '%'; }
        }
