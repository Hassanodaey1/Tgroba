/* ANSWER CHECKING & END GAME */
        /* ═══════════ CHECK ANSWER ═══════════ */
        function checkAnswer(btn) {
            if (G.answered || G.ended) return;
            /* ✅ ANTI-CHEAT: debounce 150ms لمنع النقر المتسارع */
            const _now = Date.now();
            if (G._lastAnswerTime && _now - G._lastAnswerTime < 150) return;
            G._lastAnswerTime = _now;
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
                /* ✅ v4.0: تصاعد الجلسة — إجابة صحيحة */
                try { if (typeof SessionProgress !== 'undefined') SessionProgress.onCorrect(); } catch(_sp) {}
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
                /* ✅ v4.0: تصاعد الجلسة — إجابة خاطئة */
                try { if (typeof SessionProgress !== 'undefined') SessionProgress.onWrong(); } catch(_sp) {}
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
            /* ✅ v4.0: إيقاف مؤشر تصاعد الجلسة */
            try { if (typeof window._stopHeatMonitor === 'function') window._stopHeatMonitor(); } catch(_sp) {}
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
                /* ✅ ANTI-CHEAT: حد أقصى صارم للعملات بناءً على الأداء الحقيقي */
                const _strictMaxCoins = Math.min(_maxCoins, _maxQ * 3 + 10); /* لا يمكن كسب أكثر من 3 عملة/سؤال */
                G.coinsEarned = Math.max(0, Math.min(G.coinsEarned, _strictMaxCoins));
                G.bestStreak  = Math.max(0, Math.min(Math.floor(G.bestStreak),  _maxQ));
                const earnedCoins = Math.floor(G.coinsEarned);
                st.correctTotal += G.correct;
                st.wrongTotal += G.wrong;
                /* ✅ ANTI-CHEAT: حماية coins من الزيادة المفرطة */
                const _coinsBeforeAdd = st.coins;
                /* ✅ 💎 تطبيق مضاعف الكوينز الدائم من متجر الماس */
                const _permCoinMult = (typeof getPermCoinMultiplier === 'function') ? getPermCoinMultiplier() : 1.0;
                const _finalCoins = Math.floor(earnedCoins * _permCoinMult);
                st.coins += _finalCoins;
                if (st.coins - _coinsBeforeAdd > 200) st.coins = _coinsBeforeAdd + 200;
                st.totalGames++;

                /* ═══════════════════════════════════════════════════════
                   💎 نظام الماس — حساب الماس المكتسب من هذه الجلسة
                   ═══════════════════════════════════════════════════════ */
                (function _earnDiamonds() {
                    try {
                        if (typeof st.diamonds !== 'number') st.diamonds = 0;
                        let _dEarned = 0;
                        const _acc = G.correct + G.wrong > 0 ? G.correct / (G.correct + G.wrong) : 0;
                        const _today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
                        if (!st._diamondSources) st._diamondSources = {};

                        /* ── 1. تتابع استثنائي (≥15) → 1 💎 مرة يومياً ── */
                        if (G.bestStreak >= 15) {
                            const _key = 'streak15_' + _today;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 1;
                            }
                        }
                        /* ── 2. دقة 100% في وضع صعب أو أصعب ── */
                        if (_acc === 1 && G.correct >= 8 && ['hard','genius','impossible'].includes(st.difficulty)) {
                            const _key = 'perfect_hard_' + _today;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 1;
                            }
                        }
                        /* ── 3. إكمال وضع المستحيل بنتيجة ≥ 80% ── */
                        if (G.mode === 'impossible' && _acc >= 0.8 && G.correct >= 8) {
                            const _key = 'impossible_' + _today;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 2;
                            }
                        }
                        /* ── 4. الوصول لأعلى مرحلة في الصاروخ (عبقري) مرة أسبوعياً ── */
                        if (G.mode === 'rocket' && (G._rocketStage || 0) >= 6) {
                            const _wk = (typeof weekStr === 'function') ? weekStr() : _today.slice(0,7);
                            const _key = 'rocket_genius_' + _wk;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 2;
                            }
                        }
                        /* ── 5. تحدي الأسبوع — مكافأة ثابتة 1 💎 ── */
                        if (G.mode === 'weekly' && G.correct >= 12) {
                            const _wk2 = (typeof weekStr === 'function') ? weekStr() : _today.slice(0,7);
                            const _key = 'weekly_' + _wk2;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 1;
                            }
                        }
                        /* ── 6. أول مرة تُكسر فيها أفضل نتيجة شخصية بفارق كبير ── */
                        if (G.score > (st.bestScore || 0) + 50 && G.score > 100) {
                            const _key = 'record_' + _today;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 1;
                            }
                        }
                        /* ── 7. سلسلة 20+ في وضع السلسلة ── */
                        if (G.mode === 'chain' && (G._chainLen || 0) >= 20) {
                            const _key = 'chain20_' + _today;
                            if (!st._diamondSources[_key]) {
                                st._diamondSources[_key] = true;
                                _dEarned += 2;
                            }
                        }

                        if (_dEarned > 0) {
                            st.diamonds = Math.min(9999, st.diamonds + _dEarned);
                            setTimeout(() => {
                                try { showFeedback(`💎 +${_dEarned} ماس نادر!`); } catch(e) {}
                                try { if (typeof _showDiamondFloat === 'function') _showDiamondFloat(_dEarned); } catch(e) {}
                            }, 700);
                        }
                        /* تنظيف السجل القديم (احتفظ فقط بآخر 90 مدخل) */
                        const _srcKeys = Object.keys(st._diamondSources);
                        if (_srcKeys.length > 90) {
                            const _toDelete = _srcKeys.slice(0, _srcKeys.length - 90);
                            _toDelete.forEach(k => delete st._diamondSources[k]);
                        }
                    } catch(_de) { console.warn('[Diamonds]', _de); }
                })();

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
                /* 3.4: مكافأة الدقة 100% — بحد أقصى 10 عملات لمنع الاستغلال */
                const _total = G.correct + G.wrong;
                if (_total > 0 && G.wrong === 0 && G.correct >= 5) {
                    const _perfectBonus = Math.min(10, Math.ceil(G.correct * 0.3));
                    st.coins += _perfectBonus;
                    setTimeout(() => showFeedback(`⭐ دقة مثالية! +${_perfectBonus}💰`), 300);
                }
                saveSt();
                updateUI();
                checkAchievements();
                syncWithLeaderboard();

                /* ══════════════════════════════════════════════════
                   🏆 SEASON PASS — تحديث الموسم بعد كل لعبة
                   يُحدَّث: coinsEarnedToday + rocketBestScore + rocketGamesPlayed
                   ثم يُرسَل لـ competition_logic للمعالجة
                ══════════════════════════════════════════════════ */
                try {
                    /* تحديث عداد العملات اليومية */
                    const _today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
                    if (st.coinsEarnedDate !== _today) {
                        st.coinsEarnedToday = 0;
                        st.coinsEarnedDate  = _today;
                    }
                    st.coinsEarnedToday = (st.coinsEarnedToday || 0) + Math.floor(G.coinsEarned || 0);

                    /* تحديث إحصائيات وضع الصاروخ */
                    if (G.mode === 'rocket') {
                        st.rocketGamesPlayed = (st.rocketGamesPlayed || 0) + 1;
                        if (G.score > (st.rocketBestScore || 0)) st.rocketBestScore = G.score;
                    }

                    /* إرسال بيانات الجلسة للموسم */
                    if (typeof window.seasonUpdateFromGame === 'function') {
                        window.seasonUpdateFromGame({
                            mode:    G.mode,
                            score:   G.score,
                            correct: G.correct,
                            coins:   Math.floor(G.coinsEarned || 0),
                            games:   1,
                        });
                    }
                } catch(_se) { /* صامت — الموسم لا يوقف اللعبة */ }
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
            /* ✅ ANTI-CHEAT: منع التلاعب بتاريخ الجهاز للحصول على مكافأة مبكرة */
            const _now = Date.now();
            const _storedMs = st._lastShieldCheckMs || 0;
            /* إذا كان الوقت يرجع للخلف أكثر من ساعة → تجميد */
            if (_storedMs > 0 && _now < _storedMs - 3600000) {
                console.warn('[HO Math] تحذير: تلاعب محتمل بساعة الجهاز');
                return;
            }
            st._lastShieldCheckMs = _now;
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
                /* ✅ v4.0: إعادة تعيين تصاعد الجلسة عند أول سؤال فقط */
                if (G.currentQ === 0) {
                    try {
                        if (typeof window.resetSessionProgress === 'function') window.resetSessionProgress();
                        if (typeof window._startHeatMonitor === 'function') window._startHeatMonitor();
                    } catch(_sp) {}
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
