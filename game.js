/* ANSWER CHECKING & END GAME */
        /* ═══════════ CHECK ANSWER ═══════════ */

        /* ── نظام منع تكرار الأسئلة ── */
        var _usedQuestionsThisSession = new Set();

        function _markQuestionUsed(q) {
            if (!q) return;
            const key = typeof q === 'string' ? q : JSON.stringify(q);
            _usedQuestionsThisSession.add(key);
        }

        function _isQuestionUsed(q) {
            if (!q) return false;
            const key = typeof q === 'string' ? q : JSON.stringify(q);
            return _usedQuestionsThisSession.has(key);
        }

        function _clearUsedQuestions() {
            _usedQuestionsThisSession.clear();
        }

        /* ══════════════════════════════════════════
           checkAnswer — إصلاح كامل مع تسجيل دوري
        ══════════════════════════════════════════ */
        function checkAnswer(btn) {
            if (!G || G.answered || G.ended) return;
            G.answered = true;

            const val = parseInt(btn.getAttribute('data-val'));
            document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

            if (val === G.correctAnswer) {
                /* ── إجابة صحيحة ── */
                btn.classList.add('correct');
                G.correct++;
                G.streak++;
                if (G.streak > G.bestStreak) G.bestStreak = G.streak;
                G.score += 10 + G.streak * 2;

                /* عملات بنسبة 40% */
                G.coinsEarned += 1;   /* سيُحسب الكسب الحقيقي في endGame */

                showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
                playSound('correct');
                if (st.vibrationOn && navigator.vibrate) navigator.vibrate(30);

                /* ── تحديث المؤقت ── */
                _updateTimerOnAnswer(true);

                /* ── إحصائيات الفئة ── */
                if (G.currentCatKey && st.stats[G.currentCatKey]) {
                    const s = st.stats[G.currentCatKey];
                    s.att++;
                    s.cor++;
                    s.max += 3;
                    s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
                    if (G.streak >= 3) s.first++;
                }

                /* ── تسجيل الإحصائيات الدورية ── */
                if (typeof recordDailyStat === 'function') recordDailyStat('correct');

                updTask('correct');
                if (G.streak >= 3) updTask('streak', G.streak);
                if (G.streak >= 5) doConfetti();
                if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
                showFloatXP(10 + G.streak * 2);

                if (!G.isTraining) st.correctTotal++;

            } else {
                /* ── إجابة خاطئة ── */
                btn.classList.add('wrong');
                document.querySelectorAll('.answer-btn').forEach(b => {
                    if (parseInt(b.getAttribute('data-val')) === G.correctAnswer)
                        b.classList.add('correct');
                });
                G.wrong++;
                G.streak = 0;

                /* ── تحديث المؤقت ── */
                _updateTimerOnAnswer(false);

                /* ── تسجيل الإحصائيات الدورية ── */
                if (typeof recordDailyStat === 'function') recordDailyStat('wrong');

                if (G.isTraining) {
                    showFeedback('❌');
                    playSound('wrong');
                    showExplanation();
                } else {
                    if (G.livesLeft > 0) {
                        G.livesLeft--;
                        updateHeartsDisplay();
                        showFeedback('❌');
                        playSound('wrong');
                        if (st.vibrationOn && navigator.vibrate) navigator.vibrate([50, 30, 50]);
                        showExplanation();
                        if (G.livesLeft <= 0) {
                            if (!st.dailyShieldUsed && useDailyShield()) {
                                G.livesLeft = 1;
                                updateHeartsDisplay();
                                showFeedback('🛡️ درع الحماية!');
                            } else {
                                setTimeout(() => { if (!G.ended) endGame(); }, 700);
                                return;
                            }
                        }
                    } else {
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                    }
                }

                if (G.currentCatKey && st.stats[G.currentCatKey]) {
                    st.stats[G.currentCatKey].att++;
                    st.stats[G.currentCatKey].max += 3;
                }
                if (!G.isTraining) st.wrongTotal++;
            }

            /* ── تحديث واجهة الجلسة ── */
            const ss = document.getElementById('statScore');
            if (ss) ss.textContent = G.score;
            const sn = document.getElementById('streakNum');
            if (sn) sn.textContent = G.streak;
            const sf = document.getElementById('streakFire');
            if (sf) sf.style.display = G.streak >= 3 ? 'inline' : 'none';
            updateGameCoinsDisplay();

            /* ── السؤال التالي ── */
            setTimeout(() => {
                if (G.ended) return;
                const isTimedMode = ['speed', 'survival', 'frenzy'].includes(G.mode);
                if (!G.isTraining && !isTimedMode && G.currentQ >= G.totalQ) {
                    endGame();
                } else {
                    loadQuestion();
                }
            }, 350);
        }

        /* ── تحديث المؤقت عند الإجابة ── */
        function _updateTimerOnAnswer(correct) {
            if (!G.hasTimer || G.maxTime <= 0 || G.isTraining) return;
            if (correct) {
                G.timeLeft = Math.min(G.maxTime, G.timeLeft + 1);
            } else {
                G.timeLeft = Math.max(0, G.timeLeft - 1);
                if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; }
            }
            const pct = (G.timeLeft / G.maxTime) * 100;
            const bar = document.getElementById('timerBar');
            const bt  = document.getElementById('bigTimer');
            if (bar) {
                bar.style.width = pct + '%';
                bar.classList.toggle('danger', G.timeLeft <= 10);
            }
            if (bt) {
                bt.textContent = G.timeLeft;
                bt.classList.toggle('danger', G.timeLeft <= 10);
            }
        }

        /* ══════════════════════════════════════════
           إصلاح مشكلة عدم عمل الألعاب
        ══════════════════════════════════════════ */

        /* نحفظ الدالة الأصلية من questions.js فوراً قبل أي تعديل
           لأن game.js يأتي بعد questions.js في ترتيب التحميل */
        var _origStartGameWith = (typeof startGameWith === 'function') ? startGameWith : null;

        /* الدالة الجديدة تُعيد توجيه الاستدعاء للأصل مع إضافات بسيطة */
        window.startGameWith = function(mode, op, customTable, hasTimer) {
            /* إغلاق أي sheets مفتوحة */
            ['modeSheet','opSheet','trainingOpSheet','gameSettingsSheet'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });

            /* إلغاء لعبة سابقة */
            if (typeof clearGameTimer === 'function') clearGameTimer();
            if (typeof _clearUsedQuestions === 'function') _clearUsedQuestions();

            /* تطبيق الصعوبة التلقائية */
            if (!st.difficulty || st.difficulty === 'auto') {
                if (typeof getDifficultyByLevel === 'function')
                    st.difficulty = getDifficultyByLevel();
            }

            /* استدعاء الدالة الأصلية من questions.js مباشرةً */
            if (typeof _origStartGameWith === 'function') {
                _origStartGameWith(mode, op, customTable, hasTimer);
            }
        };

        /* ══════════════════════════════════════════
           endGame — مع تسجيل دوري كامل
        ══════════════════════════════════════════ */
        function endGame() {
            if (G.ended) return;
            G.ended = true;
            clearGameTimer();

            if (!G.isTraining) {
                /* ── حساب العملات بنسبة 40% ── */
                const rawCoins    = G.coinsEarned || 0;
                const earnedCoins = typeof earnCoins === 'function'
                    ? earnCoins(rawCoins, 'game')
                    : Math.max(1, Math.floor(rawCoins * 0.40));

                /* إذا لم نستخدم earnCoins نضيف يدوياً */
                if (typeof earnCoins !== 'function') {
                    st.coins            += earnedCoins;
                    st.totalCoinsEarned = (st.totalCoinsEarned || 0) + earnedCoins;
                }

                /* ── إحصائيات كلية ── */
                st.correctTotal += G.correct;
                st.wrongTotal   += G.wrong;
                st.totalGames++;
                if (G.bestStreak > st.bestStreak)  st.bestStreak = G.bestStreak;
                if (G.score     > st.bestScore)    st.bestScore  = G.score;

                /* ── وقت اللعب التراكمي ── */
                const sessionSecs = G.maxTime > 0 ? (G.maxTime - G.timeLeft) : 0;
                st.totalPlayTimeSecs = (st.totalPlayTimeSecs || 0) + sessionSecs;

                /* ── XP بنظام التدرج ── */
                const xpGained = G.score * 2 + G.correct * 5;
                if (typeof addXP === 'function') {
                    addXP(xpGained);
                } else {
                    st.xp += xpGained;
                    while (st.xp >= st.xpToNext) {
                        st.xp      -= st.xpToNext;
                        st.level++;
                        const mult  = st.level % 5 === 0 ? 1.5 : 1.35;
                        st.xpToNext = Math.floor(st.xpToNext * mult);
                        playSound('levelup');
                    }
                }

                /* ── تسجيل إحصائيات دورية ── */
                if (typeof recordDailyStat === 'function') {
                    recordDailyStat('game');
                    recordDailyStat('streak');
                    recordDailyStat('score', G.score);
                }

                /* ── فئات اللعب ── */
                if (['classic','speed','survival','frenzy'].includes(G.mode)) {
                    st.catCounter.correct += G.correct;
                    st.catCounter.total   += G.correct + G.wrong;
                }
                if (['speed','survival','frenzy','daily'].includes(G.mode)) {
                    st.catChallenges.games++;
                }

                /* ── تحديث مهام التحدي ── */
                _updateChallengeTasks(G);

                /* ── المهام اليومية ── */
                updTask('game');
                if (G.mode === 'daily') updTask('daily');

                /* ── بطولة المنافسة ── */
                if (['speed','frenzy','daily'].includes(G.mode)) {
                    if (G.score > (st.challengeBestScore || 0)) {
                        st.challengeBestScore = G.score;
                    }
                    if (G.score > (st.challengeWeeklyBest || 0)) {
                        st.challengeWeeklyBest = G.score;
                        st.challengeWeeklyDate = weekStr();
                    }
                }

                /* ── السجل ── */
                const acc = G.correct + G.wrong > 0
                    ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
                if (st.history.length > 10) st.history.pop();

                saveSt();
                updateUI();
                checkAchievements();
                syncWithLeaderboard();

                /* ── شاشة النتائج ── */
                const pct  = acc;
                const emj  = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '😊' : '💪';
                const ttl  = pct >= 90 ? 'ممتاز!' : pct >= 70 ? 'رائع!' : pct >= 50 ? 'جيد!' : 'حاول مجدداً!';

                _setResultEl('resultsEmoji',  emj);
                _setResultEl('resultsTitle',  ttl);
                _setResultEl('resultsSub',    `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`);
                _setResultEl('resScore',      G.score);
                _setResultEl('resCorrect',    G.correct);
                _setResultEl('resStreak',     G.bestStreak);
                _setResultEl('resultsXP',     `+${xpGained} XP • +${earnedCoins} 💰`);

                const gameOverlay    = document.getElementById('gameOverlay');
                const resultsOverlay = document.getElementById('resultsOverlay');
                if (gameOverlay)    gameOverlay.classList.remove('active');
                if (resultsOverlay) resultsOverlay.classList.add('active');

                if (pct >= 70) doConfetti();

            } else {
                /* ── وضع التدريب ── */
                const gameOverlay = document.getElementById('gameOverlay');
                if (gameOverlay) gameOverlay.classList.remove('active');
                goTab('home');
                showFeedback('🎓 انتهى التدريب');
            }
        }

        function _setResultEl(id, val) {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        }

        /* ══════════════════════════════════════════
           تحديث مهام التحدي اليومية عند نهاية الجلسة
        ══════════════════════════════════════════ */
        function _updateChallengeTasks(g) {
            if (!st.challengeTasks || !Array.isArray(st.challengeTasks)) return;
            const isChallenge = ['speed','frenzy','daily','survival'].includes(g.mode);

            st.challengeTasks.forEach(t => {
                if (t.done) return;
                switch(t.id) {
                    case 'ch_play3':
                        if (isChallenge) t.progress++;
                        break;
                    case 'ch_correct10':
                        if (isChallenge) t.progress += g.correct;
                        break;
                    case 'ch_streak5':
                        if (isChallenge && g.bestStreak >= 5) t.progress = 5;
                        break;
                    case 'ch_score50':
                        if (isChallenge && g.score >= 50) t.progress = 50;
                        break;
                    case 'ch_nohints':
                        if (isChallenge && g.hintsUsed === 0 && g.correct > 0) t.progress = 1;
                        break;
                }
                /* حد الهدف */
                t.progress = Math.min(t.progress, t.target);
                if (t.progress >= t.target && !t.done) {
                    t.done = true;
                    /* مكافأة */
                    if (typeof earnCoins === 'function') earnCoins(t.coins, 'challenge_task');
                    else { st.coins += t.coins; st.totalCoinsEarned = (st.totalCoinsEarned||0) + t.coins; }
                    showFeedback(`🎯 مهمة مكتملة! +${t.coins}💰 +${t.points}نقطة`);
                }
            });
        }

        /* ══════════════════════════════════════════
           Feedback & Effects
        ══════════════════════════════════════════ */
        function showFeedback(msg) {
            const t = document.getElementById('feedbackToast');
            if (!t) return;
            t.textContent = msg;
            t.classList.remove('show');
            void t.offsetWidth;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 900);
        }

        function showFloatXP(amt) {
            const el = document.createElement('div');
            el.className = 'float-xp';
            el.textContent = `+${amt}`;
            el.style.cssText = `left:${rnd(30,65)}%;top:40%;`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }

        function showComboEffect(c) {
            const popup = document.createElement('div');
            popup.className = 'combo-popup';
            popup.textContent = `🔥 ×${c}`;
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 900);
        }

        function showExplanation() {
            if (!G.currentExplanation) return;
            const ea = document.getElementById('explanationArea');
            if (ea) ea.innerHTML =
                `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`;
        }

        /* ══════════════════════════════════════════
           playAgain / goHome / confirmQuit
        ══════════════════════════════════════════ */
        function playAgain() {
            const ro = document.getElementById('resultsOverlay');
            if (ro) ro.classList.remove('active');
            startGameWith(G.mode, G.op, G.customTable, G.hasTimer);
        }

        function goHome() {
            const ro = document.getElementById('resultsOverlay');
            if (ro) ro.classList.remove('active');
            goTab('home');
        }

        function confirmQuit() {
            showConfirm('إنهاء اللعبة',
                'هل أنت متأكد من العودة؟\nستفقد تقدمك في هذه الجلسة.',
                'نعم، عد', 'استمرار', ok => {
                    if (ok) {
                        clearGameTimer();
                        const go = document.getElementById('gameOverlay');
                        const ro = document.getElementById('resultsOverlay');
                        if (go) go.classList.remove('active');
                        if (ro) ro.classList.remove('active');
                        if (G.correct > 0 && !G.ended && !G.isTraining) {
                            endGame();
                        } else {
                            G.ended = true;
                            clearGameTimer();
                            goTab('home');
                        }
                    }
                });
        }

        /* ══════════════════════════════════════════
           Confetti
        ══════════════════════════════════════════ */
        function doConfetti() {
            const c = ['#f0b90b','#7c3aed','#06b6d4','#10b981','#ef4444','#ffd54f'];
            for (let i = 0; i < 45; i++) {
                const el = document.createElement('div');
                el.className = 'confetti-piece';
                el.style.cssText = `
                    left:${Math.random()*100}%;top:-10px;
                    background:${c[rnd(0,5)]};
                    width:${4+Math.random()*7}px;
                    height:${4+Math.random()*7}px;
                    border-radius:${Math.random()>0.5?'50%':'2px'};
                    animation-delay:${Math.random()*0.9}s;
                    animation-duration:${1.4+Math.random()*1.2}s;`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 3200);
            }
        }

        /* ══════════════════════════════════════════
           درع الحماية
        ══════════════════════════════════════════ */
        function updateDailyShield() {
            const today = todayStr();
            if (st.lastShieldDate !== today) {
                st.dailyShieldUsed = false;
                st.lastShieldDate  = today;
                saveSt();
            }
        }

        function useDailyShield() {
            updateDailyShield();
            if (st.dailyShieldUsed) return false;
            st.dailyShieldUsed = true;
            saveSt();
            return true;
        }

        /* ══════════════════════════════════════════
           updateGameCoinsDisplay
        ══════════════════════════════════════════ */
        function updateGameCoinsDisplay() {
            const el = document.getElementById('gameCoins');
            if (el) {
                const display = Math.floor((G.coinsEarned || 0) * 0.40);
                el.textContent = display + ' 💰';
            }
        }
