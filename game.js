/* ANSWER CHECKING & END GAME */
        /* ═══════════ CHECK ANSWER ═══════════ */
        function checkAnswer(btn) {
            if (G.answered || G.ended) return;
            G.answered = true;
            const val = parseInt(btn.getAttribute('data-val'));
            document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
            if (val === G.correctAnswer) {
                btn.classList.add('correct');
                G.correct++;
                G.streak++;
                if (G.streak > G.bestStreak) G.bestStreak = G.streak;
                G.score += 10 + G.streak * 2;
                G.coinsEarned += 0.4;
                showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
                /* ✅ AI Adaptive: تسجيل إجابة صحيحة */
                if (typeof AdaptiveAI !== 'undefined' && G.op) AdaptiveAI.record(G.op, true);
                playSound('correct');
                const timerActive = G.hasTimer && G.maxTime > 0 && !G.isTraining;
                if (timerActive) {
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
                    const s = st.stats[G.currentCatKey];
                    s.att++;
                    s.cor++;
                    s.max += 3;
                    s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
                    if (G.streak >= 3) s.first++;
                }
                updTask('correct'); if (G.streak >= 3) updTask('streak', G.streak);
                if (!G.isTraining) recordDailyStat('correct');
                if (G.streak >= 5) doConfetti();
                if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
                showFloatXP(10 + G.streak * 2);
                /* ✅ FIX-B2: correctTotal يُجمع في endGame فقط لتفادي المضاعفة */
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('.answer-btn').forEach(b => { if (parseInt(b.getAttribute('data-val')) ===
                        G.correctAnswer) b.classList.add('correct'); });
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
                        /* وضع التحمّل: 3 أخطاء = نهاية اللعبة */
                        G._survivalWrong = (G._survivalWrong || 0) + 1;
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                        if (G._survivalWrong >= 3) {
                            setTimeout(() => { if (!G.ended) endGame(); }, 700);
                            return;
                        }
                    } else {
                        showFeedback('❌');
                        playSound('wrong');
                        showExplanation();
                    }
                }
                if (G.currentCatKey && st.stats[G.currentCatKey]) { st.stats[G.currentCatKey].att++;
                    st.stats[G.currentCatKey].max += 3; }
                /* ✅ FIX-B2: wrongTotal يُجمع في endGame فقط لتفادي المضاعفة */
            }
            document.getElementById('statScore').textContent = G.score;
            document.getElementById('streakNum').textContent = G.streak;
            document.getElementById('streakFire').style.display = G.streak >= 3 ? 'inline' : 'none';
            updateGameCoinsDisplay();
            const delay = 350;
            setTimeout(() => {
                if (G.ended) return;
                if (!G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy' && G.currentQ >= G.totalQ) {
                    endGame();
                } else if (!G.ended) {
                    loadQuestion();
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
        }

        /* ═══════════ END GAME ═══════════ */
        function endGame() {
            if (G.ended) return;
            G.ended = true;
            clearGameTimer();
            if (!G.isTraining) {
                /* ✅ FIX-V5: تحقق منطقي من النتائج لمنع تعديل كائن G من Console */
                const _maxQ     = (G.totalQ && G.totalQ < 9999) ? G.totalQ : 9999;
                const _maxScore = _maxQ * 60;          /* أقصى نقطة ممكنة نظريًا */
                const _maxCoins = _maxQ * 0.4 + 10;   /* أقصى عملة ممكنة نظريًا */
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
                /* تسجيل إحصائيات اليوم/الأسبوع للعبة */
                recordDailyStat('game');
                if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak;
                if (G.score > st.bestScore) st.bestScore = G.score;
                const xpGained = G.score * 2 + G.correct * 5;
                st.xp += xpGained;
                while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext;
                    st.level++;
                    st.xpToNext = Math.floor(st.xpToNext * 1.3);
                    playSound('levelup');
                    /* ✅ FIX-LEVELUP: عرض احتفال رفع المستوى */
                    const _lvl = st.level;
                    setTimeout(() => {
                        try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(_lvl); } catch(e) {}
                    }, 600);
                }
                if (['classic', 'speed', 'survival', 'frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct;
                    st.catCounter.total += G.correct + G.wrong; }
                if (['speed', 'survival', 'frenzy', 'daily'].includes(G.mode)) st.catChallenges.games++;
                updTask('game');
                if (G.mode === 'daily') {
                    /* ✅ FIX-V11: تحدي اليوم مرة واحدة فقط يوميًا */
                    if (typeof hasDailyBeenPlayed === 'function' && !hasDailyBeenPlayed()) {
                        updTask('daily');
                        if (typeof markDailyPlayed === 'function') markDailyPlayed();
                    }
                }
                const acc = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
                st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
                if (st.history.length > 10) st.history.pop();
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
                document.getElementById('resScore').textContent = G.score;
                document.getElementById('resCorrect').textContent = G.correct;
                document.getElementById('resStreak').textContent = G.bestStreak;
                document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`;
                document.getElementById('gameOverlay').classList.remove('active');
                document.getElementById('resultsOverlay').classList.add('active');
                /* ── رسالة الفوز / الخسارة ── */
                const winLoseEl = document.getElementById('winLoseMessage');
                if (winLoseEl) {
                    if (pct >= 70) {
                        winLoseEl.innerHTML = '<div style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.4);border-radius:14px;padding:10px 14px;font-size:1.05em;font-weight:900;color:#10b981;text-align:center;">🎉 مبروك! لقد فزت</div>';
                    } else {
                        winLoseEl.innerHTML = '<div style="background:rgba(239,68,68,0.12);border:1.5px solid rgba(239,68,68,0.35);border-radius:14px;padding:10px 14px;font-size:1.05em;font-weight:900;color:#ef4444;text-align:center;">😔 حظاً أوفر في المرة القادمة</div>';
                    }
                }
                /* ── زر الرجوع حسب مصدر اللعبة ── */
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
                        document.getElementById('gameOverlay').classList.remove('active');
                        document.getElementById('resultsOverlay').classList.remove('active');
                        if (G.correct > 0 || (G.wrong > 0 && !G.ended && !G.isTraining)) endGame();
                        else { G.ended = true;
                            clearGameTimer();
                            goTab('home'); }
                    }
                });
        }

        function doConfetti() {
            const c = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981', '#ef4444', '#ffd54f'];
            for (let i = 0; i < 45; i++) { const el = document.createElement('div');
                el.className = 'confetti-piece';
                el.style.cssText =
                    `left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-delay:${Math.random()*0.9}s;animation-duration:${1.4+Math.random()*1.2}s;`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 3200); }
        }

        function updateDailyShield() {
            const today = todayStr();
            if (st.lastDailyDate !== today) {
                /* ✅ FIX-V8: منع تغيير التاريخ للرجوع للوراء واستعادة الدرع */
                /* إذا كان التاريخ المخزّن في المستقبل (تلاعب) → نُعيد التهيئة بدون منح درع جديد */
                if (st.lastDailyDate && st.lastDailyDate > today) {
                    st.lastDailyDate = today;
                    saveSt();
                    return;
                }
                let yesterdayD = new Date(Date.now() - 86400000);
                let yesterday = `${yesterdayD.getFullYear()}-${yesterdayD.getMonth()+1}-${yesterdayD.getDate()}`;
                st.dailyStreak = st.lastDailyDate === yesterday ? st.dailyStreak + 1 : 1;
                st.lastDailyDate = today;
                st.dailyShieldUsed = false;
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



