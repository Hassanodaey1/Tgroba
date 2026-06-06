/* ═══════════════════════════════════════════════════════════════
   HO Math — منطق اللعبة الكامل
   © 2026 Hassan Odaey
   يشمل: checkAnswer, endGame, loadQuestion, genChainQ
          pause/resume, helpers, in-game shop
═══════════════════════════════════════════════════════════════ */

/* ANSWER CHECKING & END GAME */
        /* ═══════════ CHECK ANSWER ═══════════ */
        function checkAnswer(btn) {
            if (G.answered || G.ended) return;
            /* 🧠 وضع الذاكرة: تأكد من أن المرحلة hide (السؤال اختفى) */
            if (G.mode === 'memory' && G._memPhase === 'show') return;
            /* إلغاء مؤقت الذاكرة عند الإجابة */
            if (G._memTimer) { clearTimeout(G._memTimer); G._memTimer = null; }
            /* إزالة class الإخفاء */
            const qt_mem = document.getElementById('questionText');
            if (qt_mem) qt_mem.classList.remove('memory-hidden');
            G.answered = true;
            const val = btn.getAttribute('data-val');
            document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
            /*
             * ✅ الإصلاح: دعم مقارنة الكسور النصية (مثل '5/6') بالإضافة للأرقام
             * - إذا كان G.correctAnswer نصاً (كسر) → نقارن كنصوص
             * - وإلا → نقارن كأرقام كما كان
             */
            const _isCorrect = (typeof G.correctAnswer === 'string' && G.correctAnswer.indexOf('/') >= 0)
                ? (val === String(G.correctAnswer))
                : (Math.abs(parseFloat(val) - G.correctAnswer) < 0.001);
            if (_isCorrect) {
                btn.classList.add('correct');
                G.correct++;
                G.streak++;
                if (G.streak > G.bestStreak) G.bestStreak = G.streak;
                G.score += 10 + G.streak * 2;
                /* 🔗 وضع السلسلة: تحديث القيمة التالية وعداد الحلقات */
                if (G.mode === 'chain') {
                    G._chainVal = G.correctAnswer;   /* الناتج يصبح مدخل السؤال التالي */
                    G._chainLen = (G._chainLen || 0) + 1;
                    /* تحديث عداد السلسلة في الواجهة */
                    const _cc = document.getElementById('chainCounterNum');
                    if (_cc) _cc.textContent = G._chainLen;
                }
                /* 🔥 وضع البقاء: تصعيد الصعوبة كل 10 إجابات صحيحة */
                if (G.mode === 'survival' && G.correct > 0 && G.correct % 10 === 0) {
                    const _prevLevel = G._survivalDiffLevel || 0;
                    G._survivalDiffLevel = Math.min(_prevLevel + 1, 3);
                    if (G._survivalDiffLevel > _prevLevel) {
                        const _levelNames = ['سهل', 'متوسط', 'صعب', 'عبقري'];
                        showFeedback(`📈 مستوى ${G._survivalDiffLevel + 1} — ${_levelNames[G._survivalDiffLevel]}!`);
                        playSound('levelup');
                        doConfetti();
                    }
                }
                /* 🧠 وضع الذاكرة: تتبع الإجابات الصحيحة للإنجاز */
                if (G.mode === 'memory') {
                    G._memCorrect = (G._memCorrect || 0) + 1;
                }
                /* ⚡ وضع ضد الساعة: تحديث العداد + إعادة الوقت لـ 10 ثوانٍ كاملة */
                if (G.mode === 'sudden') {
                    G._suddenScore = (G._suddenScore || 0) + 1;
                    G.timeLeft = G.maxTime; /* إعادة الوقت لـ 10 — لا يتراكم */
                    const bt2 = document.getElementById('bigTimer');
                    const tb2 = document.getElementById('timerBar');
                    if (bt2) { bt2.textContent = G.maxTime; bt2.classList.remove('danger'); }
                    if (tb2) { tb2.style.width = '100%'; tb2.classList.remove('danger'); }
                    /* تحديث الشريط المرئي */
                    const _sd = document.getElementById('suddenScoreDisplay');
                    if (_sd) _sd.textContent = G._suddenScore;
                }
                /* 3.1: ربط الكسب بالصعوبة */
                const _diffMult = { easy:0.4, medium:0.7, hard:1.0, genius:1.5 }[st.difficulty] || 0.4;
                const _levelBonus = Math.min(0.5, Math.floor(st.level / 10) * 0.1);
                G.coinsEarned += _diffMult + _levelBonus;
                /* 3.3: مكافأة التتابع */
                if (G.streak >= 5) {
                    const _streakBonus = Math.floor(G.streak / 5) * 0.2;
                    G.coinsEarned += _streakBonus;
                }
                showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
                if (typeof AdaptiveAI !== 'undefined' && G.op) AdaptiveAI.record(G.op, true);
                playSound('correct');
                const timerActive = G.hasTimer && G.maxTime > 0 && !G.isTraining;
                if (timerActive && G.mode !== 'sudden') {
                    /* أوضاع أخرى: +1 ثانية عند الإجابة الصحيحة */
                    G.timeLeft = Math.min(G.maxTime, G.timeLeft + 1);
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
                    if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger');
                        bt.classList.add('danger'); } else { document.getElementById('timerBar').classList.remove(
                            'danger');
                        bt.classList.remove('danger'); }
                }
                if (G.currentCatKey && st.stats[G.currentCatKey]) {
                    try {
                        const s = st.stats[G.currentCatKey];
                        s.att++;
                        s.cor++;
                        s.max += 3;
                        s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
                        if (G.streak >= 3) s.first++;
                    } catch(e) { console.warn("stats error", e); }
                }
                try { updTask('correct', 1, G.currentCatKey || null); } catch(e) { console.warn("updTask correct error", e); }
                if (G.streak >= 3) { try { updTask('streak', G.streak); } catch(e) { console.warn("updTask streak error", e); } }
                if (!G.isTraining) { try { recordDailyStat('correct'); } catch(e) { console.warn("recordDailyStat error", e); } }
                if (G.streak >= 5) doConfetti();
                if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
                showFloatXP(10 + G.streak * 2);
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('.answer-btn').forEach(b => {
                    const _bVal = b.getAttribute('data-val');
                    const _bCorrect = (typeof G.correctAnswer === 'string' && G.correctAnswer.indexOf('/') >= 0)
                        ? (_bVal === String(G.correctAnswer))
                        : (Math.abs(parseFloat(_bVal) - G.correctAnswer) < 0.001);
                    if (_bCorrect) b.classList.add('correct');
                });
                G.wrong++;
                G.streak = 0;
                const timerActive = G.hasTimer && G.maxTime > 0 && !G.isTraining;
                if (timerActive) {
                    G.timeLeft = Math.max(0, G.timeLeft - 1);
                    const pct = (G.timeLeft / G.maxTime) * 100;
                    document.getElementById('timerBar').style.width = pct + '%';
                    const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
                    if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger');
                        bt.classList.add('danger'); }
                    if (G.timeLeft <= 0) { clearGameTimer();
                        endGame(); return; }
                }
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
                        showExplanation();
                        if (G.livesLeft <= 0) {
                            if (!st.dailyShieldUsed && useDailyShield()) { G.livesLeft = 1;
                                updateHeartsDisplay();
                                showFeedback('🛡️ درع الحماية!'); } else { setTimeout(() => { if (!G.ended)
                                        endGame(); }, 700); return; }
                        }
                    } else if (G.mode === 'survival') {
                        G._survivalWrong = (G._survivalWrong || 0) + 1;
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                        if (G._survivalWrong >= 3) {
                            setTimeout(() => { if (!G.ended) endGame(); }, 700);
                            return;
                        }
                    } else if (G.mode === 'chain') {
                        /* 🔗 خطأ واحد = انقطاع السلسلة وانتهاء اللعبة */
                        G._chainDone = true;
                        showFeedback(`💔 انقطعت السلسلة عند ${G._chainLen || 0} حلقة!`);
                        playSound('wrong');
                        showExplanation();
                        setTimeout(() => { if (!G.ended) endGame(); }, 1200);
                        return;
                    } else if (G.mode === 'sudden') {
                        /* ⚡ خطأ واحد = نهاية فورية */
                        showFeedback(`💥 انتهى! وصلت لـ ${G._suddenScore || 0} سؤال`);
                        playSound('wrong');
                        showExplanation();
                        setTimeout(() => { if (!G.ended) endGame(); }, 1200);
                        return;
                    } else if (G.mode === 'rocket') {
                        /* 🚀 خطأ = ينقص قلب — مثل باقي الألعاب (القلوب = 3) */
                        /* لا منطق خاص — يُعالَج بنظام القلوب العادي أعلاه */
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                    } else {
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                    }
                }
                if (G.currentCatKey && st.stats[G.currentCatKey]) { 
                    try { 
                        st.stats[G.currentCatKey].att++;
                        st.stats[G.currentCatKey].max += 3; 
                    } catch(e) {} 
                }
            }
            document.getElementById('statScore').textContent = G.score;
            document.getElementById('streakNum').textContent = G.streak;
            document.getElementById('streakFire').style.display = G.streak >= 3 ? 'inline' : 'none';
            updateGameCoinsDisplay();
            const delay = 350;
            setTimeout(() => {
                try {
                    if (G.ended) return;
                    const _openModes2 = ['speed', 'survival', 'frenzy', 'chain', 'sudden', 'rocket'];
                    if (!G.isTraining && !_openModes2.includes(G.mode) && G.currentQ >= G.totalQ) {
                        endGame();
                    } else if (!G.ended) {
                        loadQuestion();
                    }
                } catch(e) {
                    console.error("Error in setTimeout after answer:", e);
                    if (!G.ended) endGame();
                }
            }, delay);
        }

        function showFeedback(msg) {
            const t = document.getElementById('feedbackToast');
            t.textContent = msg;
            t.classList.remove('show');
            void t.offsetWidth;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 900);
        }

        function showFloatXP(amt) {
            let el = document.createElement('div');
            el.className = 'float-xp';
            el.textContent = `+${amt}`;
            el.style.cssText = `left:${rnd(30,65)}%;top:40%;`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }

        function showComboEffect(c) {
            let popup = document.createElement('div');
            popup.className = 'combo-popup';
            popup.textContent = `🔥 ×${c}`;
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 900);
        }

        function showExplanation() {
            if (typeof showSmartExplanation === 'function') {
                showSmartExplanation(G.currentExplanation, G.correctAnswer);
            } else {
                if (!G.currentExplanation) return;
                document.getElementById('explanationArea').innerHTML =
                    `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`;
            }

            /* ✅ §7.4 — تلميح ذكي عند الخطأ المتكرر في نفس الموضوع */
            try {
                const catKey = G.currentCatKey;
                if (catKey && st.stats && st.stats[catKey]) {
                    const s = st.stats[catKey];
                    const wrongCount = (s.att || 0) - (s.cor || 0);
                    if (wrongCount >= 5 && !G._smartTipShown) {
                        G._smartTipShown = true;
                        setTimeout(() => {
                            if (typeof showFeedback === 'function') {
                                showFeedback('💡 هذا الموضوع يحتاج مراجعة — جرّب وضع التدريب!');
                            }
                        }, 1200);
                    }
                }
            } catch(_e) {}
        }

        /* ═══════════ END GAME ═══════════ */
        function endGame() {
            if (G.ended) return;
            G.ended = true;
            clearGameTimer();
            /* 🧠 تنظيف وضع الذاكرة عند انتهاء اللعبة */
            if (G._memTimer) { clearTimeout(G._memTimer); G._memTimer = null; }
            const _qtMem = document.getElementById('questionText');
            if (_qtMem) _qtMem.classList.remove('memory-hidden');
            const _mbEnd = document.getElementById('memoryCountdownBar');
            if (_mbEnd) _mbEnd.style.display = 'none';
            const _govEnd = document.getElementById('gameOverlay');
            if (_govEnd) _govEnd.classList.remove('memory-active');
            /* 🔗 تنظيف وضع السلسلة */
            const _cbEnd = document.getElementById('chainCounterBar');
            if (_cbEnd) _cbEnd.style.display = 'none';
            /* ⚡ تنظيف وضع ضد الساعة */
            const _sbEnd = document.getElementById('suddenInfoBar');
            if (_sbEnd) _sbEnd.style.display = 'none';
            /* 🚀 تنظيف وضع الصاروخ */
            const _rbEnd = document.getElementById('rocketStageBar');
            if (_rbEnd) _rbEnd.style.display = 'none';
            if (!G.isTraining) {
                const _maxQ     = (G.totalQ && G.totalQ < 9999) ? G.totalQ : 9999;
                const _maxScore = _maxQ * 60;
                /* 3.6: رفع الحد الأقصى حسب الصعوبة */
                const _diffCap  = { easy:0.4, medium:0.8, hard:1.2, genius:1.8 }[st.difficulty] || 0.4;
                const _maxCoins = _maxQ * _diffCap * 2 + 15;
                /* 3.7: معامل الوضع — شامل أوضاع التحديات الجديدة */
                const _modeMult = {
                    speed:      1.5,
                    frenzy:     1.8,
                    survival:   1.3,
                    accuracy:   1.6,
                    marathon:   2.0,
                    impossible: 2.5,
                    memory:     1.4,  /* 🧠 وضع الذاكرة: مكافأة معتدلة */
                    chain:      1.6,  /* 🔗 وضع السلسلة: مكافأة جيدة */
                    sudden:     2.0,  /* ⚡ ضد الساعة: مكافأة عالية للضغط */
                    rocket:     1.8   /* 🚀 الصاروخ: مكافأة عالية للتصعيد */
                }[G.mode] || 1.0;
                G.coinsEarned = G.coinsEarned * _modeMult;

                /* ✅ شارة التحدي — تُمنح عند إكمال التحدي */
                if (G._challengeBadge) {
                    const badgeKey = `badge_${G.mode}`;
                    if (!st[badgeKey]) {
                        st[badgeKey] = true;
                        const badgeNames = {
                            accuracy:   '🎯 شارة الدقة',
                            marathon:   '🏆 شارة الماراثون',
                            impossible: '💀 شارة المستحيل'
                        };
                        setTimeout(() => showFeedback(`${G._challengeBadge} حصلت على ${badgeNames[G.mode] || 'شارة جديدة'}!`), 500);
                    }
                }
                /* ════ وضع السلسلة: تتبع الإحصائيات والشارة ════ */
                if (G.mode === 'chain') {
                    const _chainScore = G._chainLen || 0;
                    /* أفضل سلسلة */
                    if (_chainScore > (st.chainBest || 0)) {
                        st.chainBest = _chainScore;
                        /* تحديث العرض */
                        const _cbDisp = document.getElementById('chainBestDisplay');
                        if (_cbDisp) _cbDisp.textContent = st.chainBest;
                        if (_chainScore >= 10 && !st.badge_chain) {
                            st.badge_chain = true;
                            setTimeout(() => showFeedback('🔗 شارة السلسلة! أول سلسلة 10 حلقات!'), 800);
                        }
                    }
                    /* إخفاء شريط عداد السلسلة */
                    const _cbEl = document.getElementById('chainCounterBar');
                    if (_cbEl) _cbEl.style.display = 'none';
                }

                /* ════ وضع ضد الساعة: تتبع الإحصائيات والشارة ════ */
                if (G.mode === 'sudden') {
                    const _sScore = G._suddenScore || 0;
                    if (_sScore > (st.suddenBest || 0)) {
                        st.suddenBest = _sScore;
                        if (_sScore >= 10 && !st.badge_sudden) {
                            st.badge_sudden = true;
                            setTimeout(() => showFeedback('⚡ شارة ضد الساعة! أول 10 أسئلة صحيحة!'), 800);
                        }
                    }
                }

                /* ════ وضع الصاروخ: تتبع الإحصائيات والشارة ════ */
                if (G.mode === 'rocket') {
                    const _rStage = G._rocketStage || 0;
                    /* تحديث أعلى مرحلة وصلها اللاعب */
                    if (_rStage > (st._rocketMaxStage || 0)) {
                        st._rocketMaxStage = _rStage;
                    }
                    /* إخفاء شريط الصاروخ */
                    const _rbEl = document.getElementById('rocketStageBar');
                    if (_rbEl) _rbEl.style.display = 'none';
                    /* شارة الصاروخ عند الوصول للمرحلة 4 (عبقري) */
                    if (_rStage >= 4 && !st.badge_rocket) {
                        st.badge_rocket = true;
                        setTimeout(() => showFeedback('🚀 شارة الصاروخ! وصلت لمرحلة العبقري!'), 800);
                    }
                    /* رسالة النتيجة الخاصة بالصاروخ */
                    const _stageNames = ['سهل', 'سهل +', 'متوسط', 'متوسط +', 'صعب', 'صعب +', 'عبقري'];
                    setTimeout(() => showFeedback(`🚀 وصلت لـ: ${_stageNames[_rStage]} (${G.correct} صحيح)`), 400);
                }

                /* ════ وضع الذاكرة: تتبع الإحصائيات والشارة ════ */
                if (G.mode === 'memory') {
                    /* إلغاء أي مؤقت ذاكرة متبقٍّ */
                    if (G._memTimer) { clearTimeout(G._memTimer); G._memTimer = null; }
                    const qt_end = document.getElementById('questionText');
                    if (qt_end) qt_end.classList.remove('memory-hidden');
                    /* تحديث أفضل نتيجة */
                    if (G.correct > (st.memoryBest || 0)) {
                        st.memoryBest = G.correct;
                    }
                    /* مكافأة الدقة الكاملة */
                    if (G.wrong === 0 && G.correct >= 5) {
                        st.memoryPerfect = (st.memoryPerfect || 0) + 1;
                        if (!st.badge_memory) {
                            st.badge_memory = true;
                            setTimeout(() => showFeedback('🧠 شارة الذاكرة الحديدية! أول إكمال مثالي!'), 800);
                        }
                    }
                }
                G.correct     = Math.max(0, Math.min(Math.floor(G.correct),     _maxQ));
                G.wrong       = Math.max(0, Math.min(Math.floor(G.wrong),       _maxQ));
                G.score       = Math.max(0, Math.min(Math.floor(G.score),       _maxScore));
                G.coinsEarned = Math.max(0, Math.min(G.coinsEarned,             _maxCoins));
                G.bestStreak  = Math.max(0, Math.min(Math.floor(G.bestStreak),  _maxQ));
                const earnedCoins = Math.floor(G.coinsEarned);
                st.correctTotal += G.correct;
                st.wrongTotal += G.wrong;
                st.coins += earnedCoins;
                st.totalGames++;
                recordDailyStat('game');
                if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak;
                if (G.score > st.bestScore) st.bestScore = G.score;
                /* ✅ حفظ أفضل نتيجة للأوضاع الجديدة */
                if (G.mode === 'accuracy'   && G.score > (st.accuracyBest   || 0)) st.accuracyBest   = G.score;
                if (G.mode === 'marathon'   && G.score > (st.marathonBest   || 0)) st.marathonBest   = G.score;
                if (G.mode === 'impossible' && G.score > (st.impossibleBest || 0)) st.impossibleBest = G.score;
                const xpResult = typeof applyXpGain === 'function'
                    ? applyXpGain(G.correct, G.wrong, G.score, G.bestStreak)
                    : { xpGained: G.score * 2 + G.correct * 5, levelsGained: 0 };
                const xpGained = xpResult.xpGained;
                if (typeof applyXpGain !== 'function') {
                    st.xp += xpGained;
                    while (st.xp >= st.xpToNext) {
                        st.xp -= st.xpToNext;
                        st.level++;
                        st.xpToNext = typeof calcXpToNext === 'function'
                            ? calcXpToNext(st.level)
                            : Math.floor(st.xpToNext * 1.3);
                        playSound('levelup');
                        const _lvl = st.level;
                        setTimeout(() => {
                            try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(_lvl); } catch(e) {}
                        }, 600);
                    }
                }
                if (['classic', 'speed', 'survival', 'frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct;
                    st.catCounter.total += G.correct + G.wrong; }
                if (['speed', 'survival', 'frenzy', 'daily', 'accuracy', 'marathon', 'impossible'].includes(G.mode)) st.catChallenges.games++;
                try { updTask('game'); } catch(e) {}
                if (G.mode === 'daily') {
                    if (typeof hasDailyBeenPlayed === 'function' && !hasDailyBeenPlayed()) {
                        try { updTask('daily'); } catch(e) {}
                        if (typeof markDailyPlayed === 'function') markDailyPlayed();
                    }
                }
                if (G.mode === 'weekly') {
                    if (typeof hasWeeklyChallengeBeenPlayed === 'function' && !hasWeeklyChallengeBeenPlayed()) {
                        if (typeof markWeeklyChallengePlayed === 'function') markWeeklyChallengePlayed(G.correct);
                    }
                }
                const acc = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
                if (st.history.length > 10) st.history.pop();
                /* 3.4: مكافأة الدقة 100% */
                const _total = G.correct + G.wrong;
                if (_total > 0 && G.wrong === 0 && G.correct >= 5) {
                    const _perfectBonus = Math.ceil(G.correct * 0.5);
                    st.coins += _perfectBonus;
                    setTimeout(() => showFeedback(`⭐ دقة مثالية! +${_perfectBonus}💰`), 300);
                }
                saveSt();
                updateUI();
                checkAchievements();
                syncWithLeaderboard();
                const pct = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                const emj = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '😊' : '💪';
                const ttl = pct >= 90 ? 'ممتاز!' : pct >= 70 ? 'رائع!' : pct >= 50 ? 'جيد!' : 'حاول مجدداً!';
                document.getElementById('resultsEmoji').textContent = emj;
                document.getElementById('resultsTitle').textContent = ttl;
                document.getElementById('resultsSub').textContent =
                    `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`;

                /* ✅ 4.1: مقارنة تاريخية — "كيف تحسّنت؟" */
                const compEl = document.getElementById('resultsComparison');
                if (compEl && st.history.length >= 2) {
                    const lastGame = st.history[1]; /* الجلسة السابقة */
                    const accDiff = acc - (lastGame.acc || 0);
                    const scoreDiff = G.score - (lastGame.score || 0);
                    const arrow = v => v >= 0 ? `<span style="color:var(--green)">↑ +${v}</span>` : `<span style="color:var(--red)">↓ ${v}</span>`;
                    compEl.style.display = 'block';
                    compEl.innerHTML = `
                        <div style="font-size:0.72em;font-weight:900;color:var(--text2);margin-bottom:6px;">📊 مقارنة بآخر جلسة</div>
                        <div style="display:flex;gap:8px;">
                            <div style="flex:1;background:var(--surface3);border-radius:11px;padding:8px;text-align:center;">
                                <div style="font-size:0.65em;color:var(--text2);">الدقة</div>
                                <div style="font-size:0.95em;font-weight:900;color:var(--text);">${acc}%</div>
                                <div style="font-size:0.6em;">${arrow(accDiff)}</div>
                            </div>
                            <div style="flex:1;background:var(--surface3);border-radius:11px;padding:8px;text-align:center;">
                                <div style="font-size:0.65em;color:var(--text2);">النقاط</div>
                                <div style="font-size:0.95em;font-weight:900;color:var(--gold);">${G.score}</div>
                                <div style="font-size:0.6em;">${arrow(scoreDiff)}</div>
                            </div>
                            <div style="flex:1;background:var(--surface3);border-radius:11px;padding:8px;text-align:center;">
                                <div style="font-size:0.65em;color:var(--text2);">أفضل تتابع</div>
                                <div style="font-size:0.95em;font-weight:900;color:var(--accent2);">${G.bestStreak}</div>
                                <div style="font-size:0.6em;color:var(--text3);">سجل: ${st.bestStreak}</div>
                            </div>
                        </div>`;
                } else if (compEl) {
                    compEl.style.display = 'none';
                }
                document.getElementById('resScore').textContent = G.score;
                document.getElementById('resCorrect').textContent = G.correct;
                document.getElementById('resStreak').textContent = G.bestStreak;
                document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`;
                document.getElementById('gameOverlay').classList.remove('active');
                document.getElementById('resultsOverlay').classList.add('active');
                const winLoseEl = document.getElementById('winLoseMessage');
                if (winLoseEl) {
                    if (pct >= 70) {
                        winLoseEl.innerHTML = '<div style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.4);border-radius:14px;padding:10px 14px;font-size:1.05em;font-weight:900;color:#10b981;text-align:center;">🎉 مبروك! لقد فزت</div>';
                    } else {
                        winLoseEl.innerHTML = '<div style="background:rgba(239,68,68,0.12);border:1.5px solid rgba(239,68,68,0.35);border-radius:14px;padding:10px 14px;font-size:1.05em;font-weight:900;color:#ef4444;text-align:center;">😔 حظاً أوفر في المرة القادمة</div>';
                    }
                }
                const backBtnEl = document.getElementById('resultsBackBtn');
                if (backBtnEl) {
                    const src = window._gameSource || 'home';
                    if (src === 'play') {
                        backBtnEl.textContent = '🎮 العودة للألعاب';
                        backBtnEl.onclick = function() {
                            document.getElementById('resultsOverlay').classList.remove('active');
                            goTab('play');
                        };
                    } else if (src === 'leaderboard') {
                        backBtnEl.textContent = '🏆 العودة للمنافسة';
                        backBtnEl.onclick = function() {
                            document.getElementById('resultsOverlay').classList.remove('active');
                            goTab('leaderboard');
                        };
                    } else {
                        backBtnEl.textContent = '🏠 الصفحة الرئيسية';
                        backBtnEl.onclick = function() {
                            document.getElementById('resultsOverlay').classList.remove('active');
                            goTab('home');
                        };
                    }
                }
                if (pct >= 70) doConfetti();
            } else {
                document.getElementById('gameOverlay').classList.remove('active');
                goTab('home');
                showFeedback('🎓 انتهى التدريب');
            }
        }

        function playAgain() { document.getElementById('resultsOverlay').classList.remove('active');
            startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }

        function goHome() { document.getElementById('resultsOverlay').classList.remove('active');
            goTab('home'); }

        function confirmQuit() {
            showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الصفحة الرئيسية؟\nستفقد تقدمك في هذه الجلسة.',
                'نعم، عد', 'استمرار', ok => {
                    if (ok) {
                        clearGameTimer();
                        /* 🧠 تنظيف مؤقت الذاكرة عند الخروج */
                        if (G._memTimer) { clearTimeout(G._memTimer); G._memTimer = null; }
                        const _qtQ = document.getElementById('questionText');
                        if (_qtQ) _qtQ.classList.remove('memory-hidden');
                        const _mbQ = document.getElementById('memoryCountdownBar');
                        if (_mbQ) _mbQ.style.display = 'none';
                        const _govQ = document.getElementById('gameOverlay');
                        if (_govQ) { _govQ.classList.remove('memory-active'); _govQ.classList.remove('active'); }
                        /* 🔗 تنظيف شريط السلسلة عند الخروج */
                        const _cbQ = document.getElementById('chainCounterBar');
                        if (_cbQ) _cbQ.style.display = 'none';
                        /* ⚡ تنظيف شريط ضد الساعة عند الخروج */
                        const _sbQ = document.getElementById('suddenInfoBar');
                        if (_sbQ) _sbQ.style.display = 'none';
                        /* 🚀 تنظيف شريط الصاروخ عند الخروج */
                        const _rbQ = document.getElementById('rocketStageBar');
                        if (_rbQ) _rbQ.style.display = 'none';
                        document.getElementById('resultsOverlay').classList.remove('active');
                        if (!G.ended && !G.isTraining && (G.correct > 0 || G.wrong > 0)) {
                            endGame();
                        } else {
                            G.ended = true;
                            clearGameTimer();
                            goTab('home');
                        }
                    }
                });
        }

        function doConfetti() {
            const c = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981', '#ef4444', '#ffd54f'];
            for (let i = 0; i < 45; i++) { const el = document.createElement('div');
                el.className = 'confetti-piece';
                el.setAttribute('data-confetti', '1');
                el.style.cssText =
                    `left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-delay:${Math.random()*0.9}s;animation-duration:${1.4+Math.random()*1.2}s;`;
                document.body.appendChild(el);
                const t = setTimeout(() => el.remove(), 3200);
                el._cleanupTimer = t;
            }
        }

        function clearConfetti() {
            document.querySelectorAll('[data-confetti]').forEach(el => {
                if (el._cleanupTimer) clearTimeout(el._cleanupTimer);
                el.remove();
            });
        }

        function updateDailyShield() {
            const today = todayStr();
            if (st.lastDailyDate !== today) {
                if (st.lastDailyDate && st.lastDailyDate > today) {
                    st.lastDailyDate = today;
                    saveSt();
                    return;
                }
                let yesterdayD = new Date(Date.now() - 86400000);
                let yesterday = `${yesterdayD.getFullYear()}-${String(yesterdayD.getMonth()+1).padStart(2,"0")}-${String(yesterdayD.getDate()).padStart(2,"0")}`;  /* ✅ FIX-ZEROPAD: منع خطأ مقارنة التاريخ (2026-5-1 ≠ 2026-05-01) */
                st.dailyStreak = st.lastDailyDate === yesterday ? st.dailyStreak + 1 : 1;
                st.lastDailyDate = today;
                st.dailyShieldUsed = false;
                /* 3.5: مكافأة تسجيل الدخول اليومي */
                if (st.loginBonusDate !== today) {
                    st.loginBonusDate = today;
                    const _streakMiles = { 3:3, 7:7, 14:10, 30:20 };
                    let _loginBonus = 2;
                    Object.keys(_streakMiles).forEach(days => {
                        if (st.dailyStreak >= parseInt(days)) _loginBonus = _streakMiles[days];
                    });
                    st.coins += _loginBonus;
                    setTimeout(() => showFeedback(`🌅 مرحباً! +${_loginBonus}💰 مكافأة يومية (يوم ${st.dailyStreak})`), 800);
                }
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
        
        /* ═══════════ LOAD QUESTION — VERSION WITH ERROR HANDLING ═══════════ */
        function loadQuestion() {
            try {
                if (G.ended) return;
                if (G.currentQ >= G.totalQ && !G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy' && G.mode !== 'sudden' && G.mode !== 'chain' && G.mode !== 'rocket') {
                    endGame(); 
                    return;
                }
                G.currentQ++;
                G.answered = false;
                G.helpersUsed.remove = false;
                const removeBtn = document.getElementById('helperRemove');
                if (removeBtn) removeBtn.classList.remove('used');
                const expArea = document.getElementById('explanationArea');
                if (expArea) expArea.innerHTML = '';
                
                const age = (st.age || (typeof calculateAgeFromBirthDate === 'function' ? calculateAgeFromBirthDate(st.birthDate) : 0));
                let q = null;
                let attempts = 0;
                const maxAttempts = 60;
                
                while (attempts < maxAttempts && !q) {
                    try {
                        if (G.isTraining) {
                            if (G.op === 'table' && G.customTable) {
                                q = genQ('table', st.difficulty, G.customTable);
                            } else {
                                if (typeof getNextQuestion === 'function') {
                                    q = getNextQuestion(G.op, st.difficulty);
                                } else {
                                    q = generateAgeAdaptiveQuestion(G.op, st.difficulty, age);
                                    if (!q || !q.choices || q.choices.length < 4) q = genQ(G.op, st.difficulty);
                                }
                            }
                        } else {
                            if (G.op === 'table' && G.customTable) {
                                q = genQ('table', st.difficulty, G.customTable);
                            } else if (G.op === 'advanced') {
                                q = genQ('advanced', st.difficulty);
                            } else if (G.op === 'laws') {
                                q = genQ('laws', st.difficulty);
                            } else if (['adv_roots','adv_log','adv_geo','adv_eq','adv_seq','adv_trig'].includes(G.op)) {
                                q = genQ(G.op, st.difficulty);
                            } else if (G.mode === 'chain') {
                                /* 🔗 وضع السلسلة: بناء السؤال من القيمة السابقة */
                                q = genChainQ(G._chainVal);

                            } else if (G.mode === 'survival') {
                                /* 🔥 وضع البقاء: صعوبة متصاعدة حسب _survivalDiffLevel */
                                const _survDiffs = ['easy', 'medium', 'hard', 'genius'];
                                const _survDiff  = _survDiffs[Math.min(G._survivalDiffLevel || 0, 3)];
                                /* تحديث عرض المستوى في رقم السؤال */
                                const _survNames = ['🟢 سهل', '🟡 متوسط', '🟠 صعب', '🔴 عبقري'];
                                const _survLabel = document.getElementById('survivalLevelLabel');
                                if (_survLabel) _survLabel.textContent = _survNames[G._survivalDiffLevel || 0];
                                if (typeof getNextQuestion === 'function') {
                                    /* ✅ strict=true: survival يدير تصعيده بنفسه */
                                    q = getNextQuestion(G.op, _survDiff, true);
                                } else {
                                    q = genQ(G.op, _survDiff);
                                }

                            } else if (G.mode === 'rocket') {
                                /* 🚀 وضع الصاروخ: الصعوبة تتصاعد كل 5 إجابات صحيحة */
                                const _stageDiffs = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard', 'genius'];
                                const _stage = Math.floor(G.correct / 5);
                                G._rocketStage = Math.min(_stage, 6);
                                G._rocketDiff  = _stageDiffs[G._rocketStage];
                                /* تحديث شريط المرحلة في الواجهة */
                                const _stageNames = ['سهل', 'سهل +', 'متوسط', 'متوسط +', 'صعب', 'صعب +', 'عبقري'];
                                const _rl = document.getElementById('rocketStageLabel');
                                if (_rl) _rl.textContent = `🚀 المرحلة ${G._rocketStage + 1}: ${_stageNames[G._rocketStage]}`;
                                /* شريط تقدم داخل المرحلة (0-5 إجابات) */
                                const _progressInStage = (G.correct % 5) / 5 * 100;
                                const _rf = document.getElementById('rocketStageProgress');
                                if (_rf) _rf.style.width = _progressInStage + '%';
                                /* إشعار عند الترقي لمرحلة جديدة */
                                if (G.correct > 0 && G.correct % 5 === 0 && G._rocketStage > 0) {
                                    showFeedback(`🚀 ترقية! ${_stageNames[G._rocketStage]}`);
                                    playSound('levelup');
                                }
                                if (typeof getNextQuestion === 'function') {
                                    /* ✅ strict=true: rocket يدير تصعيده بنفسه */
                                    q = getNextQuestion(G.op, G._rocketDiff, true);
                                } else {
                                    q = genQ(G.op, G._rocketDiff);
                                }

                            } else if (G.mode === 'daily') {
                                const dailyIdx = (G.dailyQIndex !== undefined) ? G.dailyQIndex : (G.currentQ - 1);
                                q = genDailyQ(dailyIdx);
                                G.dailyQIndex = (G.dailyQIndex || 0) + 1;
                            } else {
                                /* ✅ FIX-2.5: احترم اختيار اللاعب دائماً
                                   'auto' = تلقائي حسب المستوى | أي قيمة أخرى = اختيار يدوي */
                                let useDiff = (st.difficulty === 'auto' || !st.difficulty)
                                    ? getDifficultyByLevel()
                                    : st.difficulty;
                                if (typeof getNextQuestion === 'function') {
                                    q = getNextQuestion(G.op, useDiff);
                                } else if (age > 0 && age <= 13) {
                                    q = generateAgeAdaptiveQuestion(G.op, useDiff, age);
                                    if (!q || !q.choices || q.choices.length < 4) q = genQ(G.op, useDiff);
                                } else {
                                    q = genQ(G.op, useDiff);
                                }
                            }
                        }
                        if (!q || typeof q.answer === 'undefined' || !q.choices || q.choices.length === 0) {
                            console.warn("Invalid question generated, retrying...");
                            q = null;
                            attempts++;
                            continue;
                        }
                        if (!G.isTraining) {
                            const qKey = (q.text || '') + '|' + q.answer;
                            if (G.askedQuestions && G.askedQuestions.includes(qKey) && attempts < maxAttempts - 5) {
                                q = null;
                                attempts++;
                                continue;
                            }
                            if (!G.askedQuestions) G.askedQuestions = [];
                            if (!G.askedQuestions.includes(qKey)) {
                                G.askedQuestions.push(qKey);
                                if (G.askedQuestions.length > 150) G.askedQuestions.shift();
                            }
                        }
                        break;
                    } catch(e) {
                        console.error("Error generating question:", e);
                        q = null;
                        attempts++;
                    }
                }
                
                if (!q) {
                    q = { text: "5 + 3", hint: "اجمع", answer: 8, choices: [8, 7, 9, 6], explanation: "5+3=8", catKey: "addition" };
                }
                
                G.correctAnswer = q.answer;
                G.currentExplanation = q.explanation || '';
                /* ✅ تتبع إحصائيات كل جدول ضرب بشكل مستقل */
                G.currentCatKey = (G.op === 'table' && G.customTable)
                    ? 'table_' + G.customTable
                    : (q.catKey || getCatStatsKey(G.op || 'add'));
                /* تهيئة إحصائيات الجدول إن لم توجد */
                if (G.op === 'table' && G.customTable && !st.stats[G.currentCatKey]) {
                    st.stats[G.currentCatKey] = { att: 0, cor: 0, max: 0, stars: 0, first: 0 };
                }
                
                const qt = document.getElementById('questionText');
                if (qt) {
                    qt.style.animation = 'none';
                    void qt.offsetWidth;
                    qt.style.animation = '';
                    qt.textContent = (q.text.endsWith('؟') || q.text.endsWith('?') || q.text.endsWith('= ?') || q.text.endsWith('= ؟')) ? q.text : `${q.text} = ?`;
                }
                const hintEl = document.getElementById('questionHint');
                if (hintEl) hintEl.textContent = q.hint || 'ما هو الجواب؟';
                
                const qNumEl = document.getElementById('questionNumber');
                if (qNumEl) {
                    if (G.isTraining) {
                        qNumEl.textContent = `🎓 تدريب - ${G.correct+1}`;
                    } else {
                        const _survLvlNames = ['سهل', 'متوسط', 'صعب', 'عبقري'];
                        qNumEl.textContent = G.mode === 'speed' ? `⚡ السؤال ${G.correct+1}` :
                            G.mode === 'frenzy' ? `💥 ${G.correct+1} إجابة` :
                            G.mode === 'survival' ? `🔥 ${G.correct} صحيح • Lv.${(G._survivalDiffLevel||0)+1} ${_survLvlNames[G._survivalDiffLevel||0]}` :
                            G.mode === 'memory' ? `🧠 السؤال ${G.currentQ} من ${G.totalQ}` :
                            G.mode === 'chain' ? `🔗 حلقة ${G._chainLen || 0}` :
                            G.mode === 'sudden' ? `⚡ ${G._suddenScore || 0} صحيح` :
                            G.mode === 'rocket' ? `🚀 ${G.correct} صحيح` :
                            `السؤال ${G.currentQ} من ${G.totalQ}`;
                    }
                }

                /* ✅ §7.3 — تحديث شريط التقدم المرئي */
                const _pgBar  = document.getElementById('gameProgressBar');
                const _pgFill = document.getElementById('gameProgressFill');
                if (_pgBar && _pgFill) {
                    /* يظهر فقط في الأوضاع المحدودة (classic, daily, weekly, fill, memory) */
                    const _limitedModes = ['classic', 'daily', 'weekly', 'fill', 'memory'];
                    if (_limitedModes.includes(G.mode) && G.totalQ < 9999 && !G.isTraining) {
                        _pgBar.style.display = 'block';
                        const _pct = Math.min(100, ((G.currentQ - 1) / G.totalQ) * 100);
                        _pgFill.style.width = _pct + '%';
                    } else {
                        _pgBar.style.display = 'none';
                    }
                }
                
                const statQ = document.getElementById('statQ');
                if (statQ) {
                    if (G.isTraining || G.mode === 'speed' || G.mode === 'survival' || G.mode === 'frenzy') {
                        statQ.textContent = G.correct;
                    } else if (G.mode === 'chain') {
                        statQ.textContent = `🔗 ${G._chainLen || 0}`;
                    } else if (G.mode === 'sudden') {
                        statQ.textContent = `⚡ ${G._suddenScore || 0}`;
                    } else if (G.mode === 'rocket') {
                        statQ.textContent = `🚀 ${G.correct}`;
                    } else {
                        statQ.textContent = `${G.currentQ}/${G.totalQ}`;
                    }
                }
                
                renderVisualAid(q);
                
                const grid = document.getElementById('answersGrid');
                if (grid) {
                    grid.innerHTML = '';
                    const choices = q.choices || shuffle([q.answer, q.answer + 1, q.answer - 1, q.answer + 2]);
                    choices.forEach(c => {
                        const btn = document.createElement('button');
                        btn.className = 'answer-btn';
                        btn.textContent = c;
                        btn.setAttribute('data-val', c);
                        btn.onclick = () => checkAnswer(btn);
                        grid.appendChild(btn);
                    });
                }

                /* ════ وضع الذاكرة: إخفاء السؤال بعد 3 ثوانٍ ════ */
                if (G.mode === 'memory') {
                    /* إلغاء أي مؤقت سابق */
                    if (G._memTimer) { clearTimeout(G._memTimer); G._memTimer = null; }

                    const qt2 = document.getElementById('questionText');
                    const hintEl2 = document.getElementById('questionHint');
                    const memBar = document.getElementById('memoryCountdownBar');

                    /* إظهار شريط العدّ التنازلي */
                    if (memBar) {
                        memBar.style.display = 'block';
                        memBar.querySelector('.mem-bar-fill').style.transition = 'none';
                        memBar.querySelector('.mem-bar-fill').style.width = '100%';
                        /* تشغيل الانكماش بعد إطار واحد */
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                memBar.querySelector('.mem-bar-fill').style.transition =
                                    `width ${G._memDelay}ms linear`;
                                memBar.querySelector('.mem-bar-fill').style.width = '0%';
                            });
                        });
                    }

                    /* قفل أزرار الإجابة أثناء العرض */
                    document.querySelectorAll('.answer-btn').forEach(b => {
                        b.disabled = true;
                        b.style.opacity = '0.4';
                    });

                    G._memPhase = 'show';
                    G._memTimer = setTimeout(() => {
                        if (G.ended || G.answered) return;
                        G._memPhase = 'hide';

                        /* إخفاء السؤال */
                        if (qt2) {
                            qt2.classList.add('memory-hidden');
                            qt2.textContent = '🧠 ما هو الجواب؟';
                        }
                        if (hintEl2) hintEl2.textContent = 'تذكّر السؤال وأجب الآن!';
                        if (memBar) memBar.style.display = 'none';

                        /* تفعيل أزرار الإجابة */
                        document.querySelectorAll('.answer-btn').forEach(b => {
                            b.disabled = false;
                            b.style.opacity = '1';
                        });

                        playSound('tick');
                    }, G._memDelay);
                }
            } catch(e) {
                console.error("Fatal error in loadQuestion:", e);
                if (!G.ended) endGame();
            }
        }

        /* ═══════════════════════════════════════════════════════════
           🔗 مولّد أسئلة وضع السلسلة
           كل سؤال يبدأ من ناتج السؤال السابق
           العمليات: +، -، ×
           القيم تبقى بين 2 و 200 لتجنب الأعداد الكبيرة جداً
        ═══════════════════════════════════════════════════════════ */
        function genChainQ(startVal) {
            const chainLen = G._chainLen || 0;

            /* اختر العملية بحسب طول السلسلة (تزيد صعوبةً تدريجياً) */
            let opsPool;
            if (chainLen < 3) {
                opsPool = ['+', '+', '-'];          /* في البداية: جمع وطرح */
            } else if (chainLen < 7) {
                opsPool = ['+', '-', '×'];          /* المتوسط: أضف الضرب */
            } else {
                opsPool = ['+', '-', '×', '×'];     /* المتقدم: ضرب أكثر */
            }
            const op = opsPool[rnd(0, opsPool.length - 1)];

            let a = startVal, b, ans;

            if (op === '+') {
                b = rnd(2, Math.min(20, Math.max(2, Math.floor(200 - a))));
                if (b <= 0) b = 2;
                ans = a + b;
            } else if (op === '-') {
                /* تأكد أن الناتج موجب >= 2 */
                const maxSub = Math.max(2, a - 2);
                b = rnd(1, Math.min(maxSub, 15));
                ans = a - b;
                if (ans < 2) { b = 1; ans = a - 1; }
                if (ans < 2) { /* fallback إلى جمع */ b = rnd(2, 10); ans = a + b; return buildChainResult(a, '+', b, ans); }
            } else { /* × */
                /* قيّد الضرب لتجنب الأرقام الضخمة */
                const maxFactor = a <= 10 ? 9 : a <= 20 ? 5 : a <= 50 ? 3 : 2;
                b = rnd(2, maxFactor);
                ans = a * b;
                if (ans > 200) { /* fallback إلى جمع */ b = rnd(2, 10); ans = a + b; return buildChainResult(a, '+', b, ans); }
            }

            return buildChainResult(a, op, b, ans);
        }

        function buildChainResult(a, op, b, ans) {
            const opSymbol = op === '+' ? '+' : op === '-' ? '−' : '×';
            const text = `${a} ${opSymbol} ${b}`;
            const hint = `ابدأ بـ ${a}`;
            const explanation = `${a} ${opSymbol} ${b} = ${ans}`;

            /* خيارات خاطئة ذكية */
            const spread = Math.max(2, Math.ceil(Math.abs(ans) * 0.2) + 1);
            const wr = new Set();
            let safety = 0;
            while (wr.size < 3 && safety < 200) {
                safety++;
                const off = rnd(-spread, spread);
                const w = ans + off;
                if (w !== ans && w >= 0 && Number.isInteger(w)) wr.add(w);
            }
            let extra = 1;
            while (wr.size < 3) { wr.add(ans + extra * 2); extra++; }

            return {
                text,
                hint,
                answer: ans,
                choices: shuffle([ans, ...wr]),
                explanation,
                catKey: op === '+' ? 'addition' : op === '-' ? 'subtraction' : 'multiplication'
            };
        }


/* ══════════════════════════════════════════════════════════════
   Patches & Extensions v9 — إضافات ومراقعات اللعبة
══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features v9
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إيقاف/استئناف مؤقت اللعبة ═══ */
var _gamePaused = false;
var _pausedTimeLeft = 0;

function pauseGameTimer() {
    if (!G || G.ended || !G.hasTimer) return;
    if (_gamePaused) return;
    _gamePaused = true;
    _pausedTimeLeft = G.timeLeft;
    clearGameTimer();
}

function resumeGameTimer() {
    if (!_gamePaused) return;
    _gamePaused = false;
    if (!G || G.ended || !G.hasTimer) return;
    G.timeLeft = _pausedTimeLeft;
    G.timer = setInterval(function () {
        G.timeLeft--;
        if (G.timeLeft <= 0) {
            clearGameTimer();
            endGame();
        } else {
            var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            var bar = document.getElementById('timerBar');
            if (bar) {
                bar.style.width = pct + '%';
                if (pct < 25) bar.classList.add('danger');
                else bar.classList.remove('danger');
            }
            var bt = document.getElementById('bigTimer');
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                if (G.timeLeft <= 5) bt.classList.add('danger');
                else bt.classList.remove('danger');
            }
        }
    }, 1000);
}

/* ═══ 2. إعدادات رئيسية — stub للتوافق مع كود قديم ═══ */
/* openMainSettings و closeMainSettings و saveMainSettings
   لم تعد تفتح sheet منفصل — الإعدادات الآن في page-settings مباشرة.
   هذه الدوال stub لمنع أي أخطاء إن استُدعيت من مكان قديم. */
function openMainSettings()  { goTab && goTab('settings'); }
function closeMainSettings() { /* لا شيء */ }
function saveMainSettings()  { /* لا شيء — الحفظ يتم عبر saveProfile */ }

/* دوال الثيمات — تُستخدم من subPageThemeOverlay */
function updateSettingsDarkToggle() {
    /* يُحدّث أيقونات الداكن/الفاتح في كل مكان */
    const isDark = st.darkMode;
    ['settingsDarkIcon','darkLightIcon','spDarkLightIcon'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? '🌙' : '☀️';
    });
    ['settingsDarkLabel','darkLightLabel','spDarkLightLabel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? 'داكن' : 'فاتح';
    });
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    updateSettingsDarkToggle();
    playSound('click');
}

function updateSettingsThemeDots() {
    document.querySelectorAll('.settings-theme-dot,.theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.gold === st.tGold);
    });
}

function applySettingsTheme(el, gold, accent, accent2) {
    const dummy = { classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
    setTheme(dummy, gold, accent, accent2);
    updateSettingsThemeDots();
}

/* syncGameSheet — يُحدّث IDs الـ gameSettingsSheet من st مباشرة */
function syncGameSheet() {
    if (typeof st === 'undefined') return;
    const q = id => document.getElementById(id);
    if (q('gsoundStatus'))    q('gsoundStatus').textContent    = st.soundOn    ? 'مفعّل'  : 'مطفأ';
    if (q('gbgMusicStatus'))  q('gbgMusicStatus').textContent  = st.bgOn       ? 'مفعّلة' : 'مطفأة';
    if (q('gVibrationStatus')) q('gVibrationStatus').textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    if (q('gSoundVolSlider')) q('gSoundVolSlider').value       = st.soundVolume || 80;
    if (q('gSoundVolVal'))    q('gSoundVolVal').textContent    = (st.soundVolume || 80) + '%';
    if (q('gBgVolSlider'))    q('gBgVolSlider').value          = st.bgVolume || 60;
    if (q('gBgVolVal'))       q('gBgVolVal').textContent       = (st.bgVolume || 60) + '%';
}

/* ═══ 3. إعدادات اللعبة السريعة (داخل اللعبة فقط) ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
    syncGameSheet();            /* مزامنة واحدة من st — لا تكرار */
    openSheet('gameSettingsSheet');
}

function closeGameSettingsAndResume() {
    closeSheet('gameSettingsSheet');
    resumeGameTimer();
}

function sheetBgAndResume(e, id) {
    if (e.target.id === id) {
        closeSheet(id);
        resumeGameTimer();
    }
}

/* showLevelUpCelebration → منقولة إلى utils.js (نسخة أفضل) */
function initTitlesSystem() {
    try { checkSeasonReset(); } catch (e) {}
    try { renderProfileTitles(); } catch (e) {}
}

/* ═══ 5. toggleBgMusicInGame ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic(); /* toggleBgMusic تُحدّث gbgMusicStatus تلقائياً */
}

/* ═══ 6. toggleVibration ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    /* تحديث كل IDs الاهتزاز دفعة واحدة */
    ['vibrationStatus', 'gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(st.vibrationStrength || 30);
    saveSt();
    playSound('click');
}

/* ═══ 7. تهيئة محددات تاريخ نافذة الإعدادات الرئيسية ═══ */
function initSettingsDateSelectors() {
    const daySel = document.getElementById('settingsBirthDay');
    const monthSel = document.getElementById('settingsBirthMonth');
    const yearSel = document.getElementById('settingsBirthYear');
    if (!daySel) return;
    daySel.innerHTML = '';
    monthSel.innerHTML = '';
    yearSel.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        daySel.appendChild(opt);
    }
    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        monthSel.appendChild(opt);
    }
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        yearSel.appendChild(opt);
    }
}

/* ═══ 8. الرقم التسلسلي في نافذة الإعدادات ═══ */

function updateSettingsSerialDisplay() {
    const el = document.getElementById('settingsSerialDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ التغييرات أولاً لتوليد الرقم';
}

function copySettingsSerial() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد — احفظ التغييرات أولاً'); return; }
    navigator.clipboard.writeText(st.serialNumber).then(() => {
        showFeedback('📋 تم نسخ الرقم التسلسلي');
    }).catch(() => {
        showFeedback('📋 ' + st.serialNumber);
    });
}

/* toggleSettingsRestorePanel و restoreFromSettings معرّفتان في state.js — لا تكرار */


/* ═══════════════════════════════════════════════════
   ⑩ إصلاح openSettingsSubPage / closeSettingsSubPage
   — تُستدعى من index.html لكن لم تكن معرّفة هنا
═══════════════════════════════════════════════════ */
/* هذه الدوال معرّفة في index.html داخل <script> مدمج،
   لكن نُعيد تعريفها هنا كـ fallback لضمان عملها دائماً */
if (typeof window.openSettingsSubPage === 'undefined') {
    window.openSettingsSubPage = function(id) {
        var map = {
            'profile-sub': 'subPageProfileOverlay',
            'audio-sub':   'subPageAudioOverlay',
            'theme-sub':   'subPageThemeOverlay',
            'parent-sub':  'subPageParentOverlay'
        };
        var overlayId = map[id] || id;
        var el = document.getElementById(overlayId);
        if (!el) return;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        playSound && playSound('click');
        if (overlayId === 'subPageProfileOverlay') {
            try { loadProfileForm(); } catch(e) {}
            try { updateSerialNumberDisplay(); } catch(e) {}
        }
        if (overlayId === 'subPageAudioOverlay') {
            try { initVolumeSliders(); } catch(e) {}
        }
        if (overlayId === 'subPageParentOverlay') {
            try { renderParentStats(); } catch(e) {}
        }
    };
}

if (typeof window.closeSettingsSubPage === 'undefined') {
    window.closeSettingsSubPage = function(overlayId) {
        var el = document.getElementById(overlayId);
        if (el) el.style.display = 'none';
        playSound && playSound('click');
    };
}

/* ═══════════════════════════════════════════════════
   ⑪ إصلاح مضاعف XP — ربط getXpMultiplier بـ applyXpGain
   applyXpGain في stats_engine.js لا تستخدم getXpMultiplier
   نُعيد تعريفها هنا بعد تحميل كل الملفات
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    /* نُغلّف applyXpGain الأصلية لإضافة دعم مضاعف XP */
    if (typeof applyXpGain === 'function' && typeof getXpMultiplier === 'function') {
        var _originalApplyXpGain = applyXpGain;
        window.applyXpGain = function(correct, wrong, score, bestStreak) {
            var result = _originalApplyXpGain(correct, wrong, score, bestStreak);
            /* تطبيق المضاعف على XP المكتسبة إن كان فعّالاً */
            var mult = getXpMultiplier();
            if (mult > 1 && result && result.xpGained > 0) {
                var bonus = Math.floor(result.xpGained * (mult - 1));
                if (bonus > 0) {
                    st.xp += bonus;
                    /* إعادة حساب المستويات بعد الإضافة */
                    while (st.xp >= st.xpToNext) {
                        st.xp -= st.xpToNext;
                        st.level++;
                        st.xpToNext = typeof calcXpToNext === 'function' ? calcXpToNext(st.level) : Math.floor(st.xpToNext * 1.3);
                        playSound('levelup');
                        var _lvl = st.level;
                        setTimeout((function(l){ return function() {
                            try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(l); } catch(e) {}
                        }; })(st.level), 600);
                    }
                    result.xpGained += bonus;
                    setTimeout(function() {
                        showFeedback('⚡ XP مضاعف ×' + mult + '! +' + bonus + ' XP إضافية');
                    }, 400);
                }
            }
            return result;
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑫ إصلاح _buildNonGameConsumables — منع التكرار
   المشكلة: تُظهر عناصر بدون gameOnly مرتين:
   مرة في _renderConsumables وأخرى في _buildNonGameConsumables
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof _renderConsumables === 'function') {
        /* نُعيد تعريف _renderConsumables لإصلاح التكرار */
        window._renderConsumables = function(container) {
            var inGame = typeof G !== 'undefined' && !G.ended &&
                         document.getElementById('gameOverlay') &&
                         document.getElementById('gameOverlay').classList.contains('active');

            /* داخل اللعبة: اعرض فقط عناصر gameOnly + العناصر الدائمة بدون تكرار */
            /* خارج اللعبة: اعرض فقط العناصر الدائمة (بدون gameOnly) */
            var items;
            if (inGame) {
                /* كل العناصر: سواء gameOnly أو لا */
                items = SHOP_CATALOG.consumables.filter(function(item) {
                    if (item.timerOnly && (!G || !G.hasTimer)) return false;
                    return true;
                });
            } else {
                /* خارج اللعبة: العناصر الدائمة فقط */
                items = SHOP_CATALOG.consumables.filter(function(item) {
                    return !item.gameOnly;
                });
            }

            container.innerHTML =
                '<div style="padding:8px 0;">' +
                (inGame ? '<div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:700;color:#ef4444;text-align:center;">⚔️ أنت في اللعبة — العناصر تُطبَّق فوراً!</div>' : '') +
                (_shopState.xpBoostActive ? '<div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:900;color:var(--accent);text-align:center;">⚡ مضاعف XP ×' + _shopState.xpBoostMultiplier + ' مفعّل!</div>' : '') +
                '<div style="display:flex;flex-direction:column;gap:8px;">' +
                items.map(function(item) { return _buildConsumableCard(item); }).join('') +
                '</div></div>';
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑬ إصلاح شراء الدرع — buyShield يُلغي اشتراط اليوم
   المشكلة: buyShield يضبط dailyShieldUsed=false فقط
   لكن useDailyShield تتحقق من lastDailyDate أيضاً
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    /* نُعيد تعريف buyConsumable لإصلاح حالة buyShield */
    if (typeof buyConsumable === 'function') {
        var _origBuyConsumable = buyConsumable;
        window.buyConsumable = function(id) {
            _origBuyConsumable(id);
            /* بعد الشراء: إذا كان الدرع، نُحدّث الحالة لضمان عمله */
            if (id === 'shield_day') {
                st.dailyShieldUsed = false;
                /* إزالة تاريخ الدرع القديم لإتاحة استخدامه في أي وقت */
                st.lastShieldDate = null;
                saveSt();
            }
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑭ تحديث currentAvatarDisplay عند فتح المتجر
   + تحديث shopCoinsDisplay بشكل فوري
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof renderShop === 'function') {
        var _origRenderShop = renderShop;
        window.renderShop = function() {
            _origRenderShop();
            /* تحديث رمز الأفاتار في صفحة المتجر */
            var ca = document.getElementById('currentAvatarDisplay');
            if (ca) ca.textContent = st.avatar || '🧑';
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑮ إصلاح نظام التتابع اليومي — حساب أمس الصحيح
   المشكلة: updateDailyShield في game.js تحسب أمس بدون zero-padding
   مما يسبب خطأ في المقارنة (2026-5-1 ≠ 2026-05-01)
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof updateDailyShield === 'function') {
        var _origUpdateDailyShield = updateDailyShield;
        window.updateDailyShield = function() {
            var today = todayStr();
            if (st.lastDailyDate !== today) {
                if (st.lastDailyDate && st.lastDailyDate > today) {
                    st.lastDailyDate = today;
                    saveSt();
                    return;
                }
                /* ✅ حساب أمس مع zero-padding الصحيح */
                var yesterdayD = new Date(Date.now() - 86400000);
                var yesterday = yesterdayD.getFullYear() + '-' +
                    String(yesterdayD.getMonth() + 1).padStart(2, '0') + '-' +
                    String(yesterdayD.getDate()).padStart(2, '0');

                st.dailyStreak = (st.lastDailyDate === yesterday) ? st.dailyStreak + 1 : 1;
                st.lastDailyDate = today;
                st.dailyShieldUsed = false;

                if (st.loginBonusDate !== today) {
                    st.loginBonusDate = today;
                    var _streakMiles = { 3: 3, 7: 7, 14: 10, 30: 20 };
                    var _loginBonus = 2;
                    Object.keys(_streakMiles).forEach(function(days) {
                        if (st.dailyStreak >= parseInt(days)) _loginBonus = _streakMiles[days];
                    });
                    st.coins += _loginBonus;
                    setTimeout(function() {
                        showFeedback('🌅 مرحباً! +' + _loginBonus + '💰 مكافأة يومية (يوم ' + st.dailyStreak + ')');
                    }, 800);
                }
                saveSt();
            }
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑯ ربط playComboSound + مزامنة timer الموسيقى
   ✅ FIX-⑤: checkAnswer تُشغّل correct أولاً، ثم combo
   — نُؤخر combo بـ 180ms لتجنب التشابك الصوتي
   — نُلغي playSound('correct') عند streak >= 3 ونستبدله بـ combo
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof checkAnswer === 'function') {
        var _origCheckAnswer = checkAnswer;
        window.checkAnswer = function(btn) {
            _origCheckAnswer(btn);

            /* ✅ FIX-⑤: تشغيل combo بتأخير 180ms بعد صوت correct */
            if (G && G.streak >= 3 && typeof playComboSound === 'function') {
                var streak = G.streak;
                setTimeout(function() {
                    try { playComboSound(streak); } catch(e) {}
                }, 180);
            }

            /* مزامنة الموسيقى مع المؤقت — ④ */
            try {
                if (typeof window._onGameTimerTick === 'function') {
                    window._onGameTimerTick();
                }
            } catch(e) {}
        };
    }

    /* ✅ FIX-④: ربط _onGameTimerTick بـ setInterval الخاص باللعبة
       نُغلّف startGameWith لحقن الاستدعاء داخل timer اللعبة */
    if (typeof startGameWith === 'function') {
        var _origStartGameWith = startGameWith;
        window.startGameWith = function(mode, op, customTable, forceTimer) {
            _origStartGameWith(mode, op, customTable, forceTimer);
            /* بعد بدء اللعبة: نُراقب G.timer ونُضيف الـ hook عليه */
            setTimeout(function() {
                if (!G || !G.hasTimer || !G.timer) return;
                /* نُوقف الـ timer القديم ونُعيد تشغيله مع _onGameTimerTick */
                clearInterval(G.timer);
                G.timer = setInterval(function() {
                    if (G.ended) { clearInterval(G.timer); G.timer = null; return; }
                    if (G.timeLeft <= 0) {
                        clearInterval(G.timer); G.timer = null;
                        if (!G.ended) endGame();
                    } else {
                        G.timeLeft--;
                        var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
                        var bar = document.getElementById('timerBar');
                        if (bar) {
                            bar.style.width = pct + '%';
                            if (pct < 25) bar.classList.add('danger');
                            else bar.classList.remove('danger');
                        }
                        var bt = document.getElementById('bigTimer');
                        if (bt) {
                            bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                            if (G.timeLeft <= 5) bt.classList.add('danger');
                            else bt.classList.remove('danger');
                        }
                        /* ✅ FIX-④: استدعاء hook الموسيقى مع كل tick */
                        try {
                            if (typeof window._onGameTimerTick === 'function') {
                                window._onGameTimerTick();
                            }
                        } catch(e) {}
                        /* ✅ FIX-⑤: tick صوتي فقط من _onGameTimerTick — لا تكرار هنا */
                    }
                }, 1000);
            }, 50); /* تأخير صغير للتأكد من بدء G.timer */
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑰ تأكيد تحميل المتجر عند أول فتح للتطبيق
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        /* تحديث shopCoinsDisplay عند البداية */
        var sc = document.getElementById('shopCoinsDisplay');
        if (sc && typeof st !== 'undefined') sc.textContent = st.coins;
        var sc2 = document.getElementById('shopCoinsDisplay2');
        if (sc2 && typeof st !== 'undefined') sc2.textContent = st.coins;
        var ca = document.getElementById('currentAvatarDisplay');
        if (ca && typeof st !== 'undefined') ca.textContent = st.avatar || '🧑';
    }, 3000);
});



/* ═══════════════════════════════════════════════════
   ⑱ لوحة الأدوات السريعة داخل اللعبة (Quick Tools Panel)
   الزر موجود في game-header في index.html (inGameShopBtn)
   عند الضغط: يظهر panel من الأسفل يعرض:
     - قسم المخزون (الأدوات المشتراة مسبقاً)
     - قسم الشراء الفوري (أدوات تُطبَّق فوراً)
   مع زر "المتجر الكامل" للانتقال إلى المتجر العادي
═══════════════════════════════════════════════════ */

/* ─── فتح لوحة الأدوات السريعة ─── */
function openInGameShop() {
    pauseGameTimer();
    playSound('open');

    var existing = document.getElementById('quickToolsPanel');
    if (existing) {
        existing.style.display = 'flex';
        setTimeout(function() { existing.style.transform = 'translateY(0)'; }, 10);
        _refreshQuickToolsPanel();
        return;
    }

    /* ── أنشئ backdrop ── */
    var backdrop = document.createElement('div');
    backdrop.id = 'quickToolsBackdrop';
    backdrop.style.cssText =
        'position:fixed;inset:0;z-index:9993;background:rgba(0,0,0,0.55);' +
        'backdrop-filter:blur(3px);animation:fadeInBg 0.2s ease;';
    backdrop.onclick = closeInGameShop;
    document.body.appendChild(backdrop);

    /* ── أنشئ الـ panel ── */
    var panel = document.createElement('div');
    panel.id = 'quickToolsPanel';
    panel.style.cssText =
        'position:fixed;bottom:0;left:0;right:0;z-index:9994;' +
        'display:flex;flex-direction:column;' +
        'background:var(--surface,#12151f);' +
        'border-radius:22px 22px 0 0;' +
        'border-top:2px solid var(--border2);' +
        'max-height:82vh;' +
        'transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);';

    panel.innerHTML =
        '<div style="flex-shrink:0;">' +
            '<div style="width:40px;height:4px;background:var(--border2);border-radius:4px;margin:10px auto 0;"></div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 10px;">' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<span style="font-size:1.1em;">⚔️</span>' +
                    '<span style="font-size:0.92em;font-weight:900;color:var(--text);">أدواتك في اللعبة</span>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<div style="font-size:0.8em;font-weight:900;color:var(--gold);">💰 <span id="qtp-coins">' + (typeof st !== 'undefined' ? st.coins : 0) + '</span></div>' +
                    '<button onclick="closeInGameShop()" style="background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:5px 12px;font-size:0.75em;font-weight:900;color:var(--text);cursor:pointer;font-family:Tajawal,sans-serif;">✕ ألعب</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div id="qtp-body" style="flex:1;overflow-y:auto;padding:0 14px 24px;"></div>' +
        '<div style="flex-shrink:0;padding:10px 14px 16px;border-top:1px solid var(--border2);">' +
            '<button onclick="_confirmOpenFullShop();" style="' +
                'width:100%;padding:11px;border-radius:14px;' +
                'background:linear-gradient(135deg,var(--accent,#7c3aed),var(--accent2,#a855f7));' +
                'color:#fff;font-family:Tajawal,sans-serif;font-size:0.8em;font-weight:900;' +
                'border:none;cursor:pointer;letter-spacing:0.3px;">' +
                '🛒 فتح المتجر الكامل' +
            '</button>' +
        '</div>';

    document.body.appendChild(panel);
    setTimeout(function() { panel.style.transform = 'translateY(0)'; }, 10);
    _refreshQuickToolsPanel();
}

/* ─── إغلاق اللوحة ─── */
function closeInGameShop() {
    var panel    = document.getElementById('quickToolsPanel');
    var backdrop = document.getElementById('quickToolsBackdrop');

    if (panel) {
        panel.style.transform = 'translateY(100%)';
        setTimeout(function() { if (panel) panel.style.display = 'none'; }, 300);
    }
    if (backdrop) {
        backdrop.style.opacity = '0';
        backdrop.style.transition = 'opacity 0.25s';
        setTimeout(function() { if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }, 260);
    }

    resumeGameTimer();
    playSound('close');
    try { if (typeof updateGameCoinsDisplay === 'function') updateGameCoinsDisplay(); } catch(e) {}
    try { if (typeof _updateInventoryBar    === 'function') _updateInventoryBar();    } catch(e) {}
}

/* ═══════════════════════════════════════════════════
   ⚠️ تحذير إنهاء الجلسة عند فتح المتجر الكامل
═══════════════════════════════════════════════════ */
function _confirmOpenFullShop() {
    var overlay = document.createElement('div');
    overlay.id = 'fullShopWarningOverlay';
    overlay.style.cssText =
        'position:fixed;inset:0;z-index:99995;' +
        'display:flex;align-items:center;justify-content:center;' +
        'background:rgba(0,0,0,0.72);' +
        'backdrop-filter:blur(4px);' +
        'animation:fadeInBg 0.2s ease;';

    overlay.innerHTML =
        '<div style="' +
            'background:linear-gradient(145deg,#0e0b1f,#141830);' +
            'border:2px solid rgba(239,68,68,0.5);' +
            'border-radius:22px;padding:24px 20px;text-align:center;' +
            'max-width:300px;width:88%;' +
            'animation:levelUpPop 0.35s cubic-bezier(0.34,1.56,0.64,1);' +
            'box-shadow:0 8px 40px rgba(239,68,68,0.2);">' +
            '<div style="font-size:2.8em;margin-bottom:8px;">\u26A0\uFE0F</div>' +
            '<div style="font-size:1em;font-weight:900;color:#ef4444;margin-bottom:6px;">\u062A\u062D\u0630\u064A\u0631!</div>' +
            '<div style="font-size:0.78em;color:rgba(255,255,255,0.75);line-height:1.55;margin-bottom:6px;">' +
                '\u0633\u064A\u062A\u0645 <strong style=\"color:#ef4444;\">\u0625\u0646\u0647\u0627\u0621 \u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628 \u0627\u0644\u062D\u0627\u0644\u064A\u0629</strong> \u0639\u0646\u062F \u0641\u062A\u062D \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0643\u0627\u0645\u0644.' +
            '</div>' +
            '<div style="font-size:0.7em;color:rgba(255,255,255,0.45);margin-bottom:20px;">' +
                '\u0644\u0646 \u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u062C\u0644\u0633\u0629.' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:9px;">' +
                '<button id="fullShopConfirmBtn" style="width:100%;padding:13px;border-radius:14px;background:linear-gradient(135deg,var(--accent,#7c3aed),var(--accent2,#a855f7));color:#fff;font-family:Tajawal,sans-serif;font-size:0.88em;font-weight:900;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(124,58,237,0.35);">' +
                    '\uD83D\uDED2 \u0646\u0639\u0645\u060C \u0627\u0641\u062A\u062D \u0627\u0644\u0645\u062A\u062C\u0631' +
                '</button>' +
                '<button id="fullShopCancelBtn" style="width:100%;padding:11px;border-radius:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);font-family:Tajawal,sans-serif;font-size:0.82em;font-weight:700;cursor:pointer;">' +
                    '\u21A9\uFE0F \u0623\u0643\u0645\u0644 \u0627\u0644\u0644\u0639\u0628' +
                '</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    document.getElementById('fullShopConfirmBtn').onclick = function() {
        overlay.remove();
        var panel    = document.getElementById('quickToolsPanel');
        var backdrop = document.getElementById('quickToolsBackdrop');
        if (panel    && panel.parentNode)    panel.parentNode.removeChild(panel);
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        try { if (typeof confirmQuit === 'function') confirmQuit(); } catch(e) {}
        setTimeout(function() {
            try { if (typeof goTab === 'function') goTab('shop'); } catch(e) {}
        }, 400);
        playSound('click');
    };

    document.getElementById('fullShopCancelBtn').onclick = function() {
        overlay.remove();
        playSound('close');
    };

    overlay.onclick = function(e) {
        if (e.target === overlay) { overlay.remove(); playSound('close'); }
    };

    playSound('warning');
}

window._confirmOpenFullShop = _confirmOpenFullShop;

/* ─── تحديث محتوى اللوحة ─── */
function _refreshQuickToolsPanel() {
    var coinsEl = document.getElementById('qtp-coins');
    if (coinsEl && typeof st !== 'undefined') coinsEl.textContent = st.coins;

    var body = document.getElementById('qtp-body');
    if (!body) return;

    var inv   = (typeof st !== 'undefined' && st.inventory) ? st.inventory : { skip: 0, heart: 0, remove: 0 };
    var coins = typeof st !== 'undefined' ? st.coins : 0;
    var hasInv = (inv.skip || 0) + (inv.heart || 0) + (inv.remove || 0) + (inv.hint || 0) > 0;
    var hasTimer = typeof G !== 'undefined' && G && G.hasTimer;

    /* ─── الأدوات الفورية للشراء أثناء اللعب ─── */
    var buyableTools = [
        { id: 'skip_q',       icon: '⏭️', name: 'تخطّي سؤال',  price: 12, desc: 'تخطَّ فوراً بدون خسارة' },
        { id: 'remove_wrong', icon: '🗑️', name: 'حذف خيار',    price: 14, desc: 'احذف إجابة خاطئة' },
        { id: 'heart_pack_1', icon: '❤️', name: '+1 قلب',       price: 15, desc: 'أضف قلبًا الآن' },
        { id: 'heart_pack_3', icon: '💖', name: '+3 قلوب',      price: 40, desc: 'أضف 3 قلوب دفعة واحدة' },
    ];
    if (hasTimer) {
        buyableTools.push({ id: 'time_plus10', icon: '⏰', name: '+10 ثواني', price: 18, desc: 'أضف وقتاً للمؤقت' });
    }
    /* قائمة العناصر المشتراة في هذه الجلسة — للقفل البصري */
    var purchased = (typeof G !== 'undefined' && G && G._purchasedInstant) ? G._purchasedInstant : {};

    var html = '';

    /* ── قسم ١: المخزون ── */
    html += '<div style="margin-bottom:4px;">';
    html += '<div style="font-size:0.65em;font-weight:900;color:var(--text3);letter-spacing:0.5px;padding:10px 0 8px;">🎒 مخزونك المشترى — اضغط للاستخدام</div>';

    if (!hasInv) {
        html += '<div style="background:var(--surface2);border:1.5px dashed var(--border2);border-radius:14px;padding:14px;text-align:center;">' +
                    '<div style="font-size:1.6em;margin-bottom:4px;">📦</div>' +
                    '<div style="font-size:0.7em;color:var(--text3);">مخزونك فارغ حالياً</div>' +
                    '<div style="font-size:0.6em;color:var(--text3);margin-top:3px;">اشتري باقات من المتجر الكامل لتظهر هنا</div>' +
                '</div>';
    } else {
        html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">';
        html += _buildInvTile('⏭️', 'تخطّي',     inv.skip   || 0, 'skip',   (inv.skip   || 0) > 0);
        html += _buildInvTile('💗', 'قلب',         inv.heart  || 0, 'heart',  (inv.heart  || 0) > 0);
        html += _buildInvTile('🗑️', 'حذف',         inv.remove || 0, 'remove', (inv.remove || 0) > 0);
        html += _buildInvTile('💡', 'تلميح',       inv.hint   || 0, 'hint',   (inv.hint   || 0) > 0);
        html += '</div>';
    }
    html += '</div>';

    /* ── فاصل ── */
    html += '<div style="height:1px;background:var(--border2);margin:12px 0 10px;"></div>';

    /* ── قسم ٢: شراء فوري ── */
    html += '<div>';
    html += '<div style="font-size:0.65em;font-weight:900;color:var(--text3);letter-spacing:0.5px;padding:0 0 8px;">⚡ شراء واستخدام فوري</div>';
    html += '<div style="display:flex;flex-direction:column;gap:7px;">';

    buyableTools.forEach(function(tool) {
        var isLocked  = purchased[tool.id];
        var canAfford = !isLocked && coins >= tool.price;

        if (isLocked) {
            /* ── بطاقة مقفلة بصرياً — مثل الأفاتارات المغلقة ── */
            html +=
                '<div style="display:flex;align-items:center;gap:10px;' +
                'background:var(--surface3);' +
                'border:1.5px solid rgba(255,255,255,0.08);' +
                'border-radius:13px;padding:10px 12px;' +
                'cursor:not-allowed;opacity:0.5;position:relative;">' +
                    '<div style="position:relative;flex-shrink:0;width:32px;height:32px;">' +
                        '<div style="font-size:1.55em;filter:grayscale(1);opacity:0.35;">' + tool.icon + '</div>' +
                        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1em;">🔒</div>' +
                    '</div>' +
                    '<div style="flex:1;">' +
                        '<div style="font-size:0.78em;font-weight:900;color:var(--text3);">' + tool.name + '</div>' +
                        '<div style="font-size:0.62em;color:var(--text3);">' + tool.desc + '</div>' +
                    '</div>' +
                    '<div style="font-size:1.2em;color:rgba(255,255,255,0.12);">🔒</div>' +
                '</div>';
        } else {
            html +=
                '<div onclick="' + (canAfford ? "buyInstant('" + tool.id + "');" : '') + '" ' +
                'style="display:flex;align-items:center;gap:10px;' +
                'background:' + (canAfford ? 'var(--surface2)' : 'var(--surface3)') + ';' +
                'border:1.5px solid ' + (canAfford ? 'var(--border2)' : 'rgba(239,68,68,0.18)') + ';' +
                'border-radius:13px;padding:10px 12px;cursor:' + (canAfford ? 'pointer' : 'not-allowed') + ';' +
                'opacity:' + (canAfford ? '1' : '0.6') + ';transition:opacity 0.15s;">' +
                    '<div style="font-size:1.55em;flex-shrink:0;">' + tool.icon + '</div>' +
                    '<div style="flex:1;">' +
                        '<div style="font-size:0.78em;font-weight:900;color:var(--text);">' + tool.name + '</div>' +
                        '<div style="font-size:0.62em;color:var(--text2);">' + tool.desc + '</div>' +
                    '</div>' +
                    '<div style="text-align:center;flex-shrink:0;">' +
                        '<div style="font-size:0.82em;font-weight:900;color:' + (canAfford ? 'var(--gold)' : '#ef4444') + ';">' + tool.price + '💰</div>' +
                        '<div style="font-size:0.56em;color:' + (canAfford ? 'var(--green)' : '#ef4444') + ';">' + (canAfford ? '✅' : '❌ لا يكفي') + '</div>' +
                    '</div>' +
                '</div>';
        }
    });

    html += '</div></div>';
    body.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════
   شراء فوري أثناء اللعب — بدون نافذة تأكيد
═══════════════════════════════════════════════════════════════ */
function buyInstant(id) {
    var item = SHOP_CATALOG.consumables.find(function(i) { return i.id === id; });
    if (!item) return;
    if (!G || G.ended) return;
    if (!G._purchasedInstant) G._purchasedInstant = {};
    if (G._purchasedInstant[id]) return;
    if (st.coins < item.price) {
        _showInsufficientCoinsOffer(item.price - st.coins, item.name);
        return;
    }

    /* خصم العملات + تسجيل القفل */
    st.coins -= item.price;
    G._purchasedInstant[id] = true;

    /* تطبيق التأثير فوراً */
    switch (item.action) {
        case 'addHeart':
            G.livesLeft = Math.min(G.livesLeft + 1, 9);
            if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
            break;
        case 'addHearts':
            G.livesLeft = Math.min(G.livesLeft + (item.actionVal || 3), 9);
            if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
            break;
        case 'skipQuestion':
            if (!G.answered) {
                G.answered = true;
                setTimeout(function() { if (!G.ended) loadQuestion(); }, 200);
            }
            break;
        case 'removeWrong':
            if (!G.answered) {
                var btns = Array.from(document.querySelectorAll('.answer-btn:not(:disabled)'));
                var wrong = btns.filter(function(b) {
                    return Math.abs(parseFloat(b.getAttribute('data-val')) - G.correctAnswer) >= 0.001;
                });
                if (wrong.length > 0) {
                    var r = wrong[Math.floor(Math.random() * wrong.length)];
                    r.style.opacity = '0.15';
                    r.style.pointerEvents = 'none';
                }
            }
            break;
        case 'addTime':
            if (G.hasTimer) {
                G.timeLeft = Math.min(G.maxTime, G.timeLeft + (item.actionVal || 10));
                var bar = document.getElementById('timerBar');
                if (bar) bar.style.width = (G.timeLeft / G.maxTime * 100) + '%';
                var bt = document.getElementById('bigTimer');
                if (bt) bt.textContent = G.timeLeft;
            }
            break;
    }

    saveSt();
    updateUI();
    if (typeof updateGameCoinsDisplay === 'function') updateGameCoinsDisplay();
    playSound('purchase');
    showFeedback(item.icon + ' تم!');

    /* إغلاق المتجر فوراً */
    closeInGameShop();
}
window.buyInstant = buyInstant;


function _buildInvTile(icon, label, count, type, active) {
    var onclick = active ? 'onclick="useHelper(\'' + type + '\');closeInGameShop();"' : '';
    return '<div ' + onclick + ' style="' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'gap:3px;padding:10px 6px;border-radius:14px;' +
        'cursor:' + (active ? 'pointer' : 'default') + ';' +
        'background:' + (active ? 'var(--surface2)' : 'var(--surface3)') + ';' +
        'border:2px solid ' + (active ? 'rgba(240,185,11,0.45)' : 'var(--border2)') + ';' +
        'opacity:' + (active ? '1' : '0.4') + ';' +
        'position:relative;transition:all 0.15s;">' +
        (count > 0 ? '<div style="position:absolute;top:-6px;right:-6px;background:var(--gold);color:#000;font-size:0.55em;font-weight:900;padding:1px 5px;border-radius:8px;min-width:16px;text-align:center;">' + count + '</div>' : '') +
        '<div style="font-size:1.6em;">' + icon + '</div>' +
        '<div style="font-size:0.6em;font-weight:800;color:var(--text2);">' + label + '</div>' +
        (active ? '<div style="font-size:0.56em;color:var(--gold);font-weight:700;">اضغط</div>' : '<div style="font-size:0.55em;color:var(--text3);">لا يوجد</div>') +
    '</div>';
}

/* تحديث الرصيد والمخزون تلقائياً بعد كل عملية شراء */
window.addEventListener('load', function() {
    if (typeof saveSt === 'function') {
        var _origSaveSt = saveSt;
        window.saveSt = function() {
            _origSaveSt();
            var coinsEl = document.getElementById('qtp-coins');
            if (coinsEl && typeof st !== 'undefined') coinsEl.textContent = st.coins;
            /* تحديث اللوحة إن كانت مفتوحة */
            var panel = document.getElementById('quickToolsPanel');
            if (panel && panel.style.transform !== 'translateY(100%)' && panel.style.display !== 'none') {
                _refreshQuickToolsPanel();
            }
        };
    }
});
