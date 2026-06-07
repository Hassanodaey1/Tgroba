/* ═══════════════════════════════════════════════════════════
   صفحة المنافسة — JavaScript الكامل
   استبدل/أضف هذه الدوال في ملف questions.js
   (أو في ملف منفصل يُحمَّل بعد questions.js)
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   متغيرات حالة التحدي
══════════════════════════════════════ */
window.CG = window.CG || {};

// سجل داخلي لمنع التلاعب بالنقاط
let _cgScoreInternal = 0;
let _cgStreak = 0; // تتابع الإجابات الصحيحة في التحدي

function _cgResetScore() { _cgScoreInternal = 0; _cgStreak = 0; }
function _cgAddScore(n) {
    _cgScoreInternal = Math.max(0, _cgScoreInternal + n);
    CG.score = _cgScoreInternal;
}

/* ══════════════════════════════════════
   تهيئة الجسيمات في الـ Hero Banner
══════════════════════════════════════ */
function initCompHeroSparks() {
    const el = document.getElementById('compHeroBgSparks');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 18; i++) {
        const s = document.createElement('div');
        s.className = 'comp-spark';
        const x = Math.random() * 100;
        const y = 60 + Math.random() * 40;
        s.style.cssText = `
            left:${x}%;top:${y}%;
            --dur:${2.5 + Math.random() * 3.5}s;
            --delay:${Math.random() * 4}s;
            --tx:${(Math.random() - 0.5) * 80}px;
            --ty:${-50 - Math.random() * 60}px;
            background:${Math.random() > 0.5 ? '#f0b90b' : '#7c3aed'};
            width:${1.5 + Math.random() * 2}px;
            height:${1.5 + Math.random() * 2}px;
        `;
        el.appendChild(s);
    }
}

/* خطوط متحركة في العد التنازلي */
function initCdoBgLines() {
    const el = document.getElementById('cdoBgLines');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const l = document.createElement('div');
        l.className = 'cdo-line';
        l.style.cssText = `
            left:${5 + i * 8}%;
            height:${60 + Math.random() * 40}%;
            --dur:${2 + Math.random() * 2.5}s;
            --delay:${Math.random() * 3}s;
        `;
        el.appendChild(l);
    }
}

/* ══════════════════════════════════════
   تحديث إحصائياتي في الـ Hero
══════════════════════════════════════ */
function updateCompMyStats(playersData) {
    const myBest = document.getElementById('challengeBestDisplay');
    if (myBest) myBest.textContent = st.challengeBestScore || 0;

    if (!playersData) return;

    const total = document.getElementById('compTotalPlayers');
    if (total) total.textContent = playersData.length;

    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;
    if (!myKey) return;
    const myIdx = playersData.findIndex(p => p.id === myKey);
    const rankEl = document.getElementById('compMyRank');
    if (rankEl) rankEl.textContent = myIdx >= 0 ? '#' + (myIdx + 1) : '—';
}

/* ══════════════════════════════════════
   العد التنازلي قبل البدء
══════════════════════════════════════ */
function launchChallengeCountdown() {
    const mainView = document.getElementById('competitionMainView');
    const overlay  = document.getElementById('challengeCountdownOverlay');
    if (!mainView || !overlay) { startChallengeGame(); return; }

    // إخفاء الواجهة الرئيسية
    mainView.style.display = 'none';
    overlay.style.display = 'flex';
    initCdoBgLines();

    const numEl = document.getElementById('cdoNumber');
    const subEl = document.getElementById('cdoSub');
    let count = 3;

    function tick() {
        if (!numEl) return;
        // إعادة تشغيل الأنيميشن
        numEl.style.animation = 'none';
        void numEl.offsetWidth;
        numEl.style.animation = 'cdoNumPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

        if (count > 0) {
            numEl.textContent = count;
            numEl.style.color = count === 1 ? '#ef4444' : count === 2 ? '#f97316' : '#f0b90b';
            try { playSound('click'); } catch(e) {}
            count--;
            setTimeout(tick, 900);
        } else {
            // انطلق!
            numEl.textContent = '🚀';
            numEl.style.color = '#10b981';
            if (subEl) subEl.textContent = 'انطلق!';
            try { playSound('correct'); } catch(e) {}
            setTimeout(() => {
                overlay.style.display = 'none';
                startChallengeGame();
            }, 600);
        }
    }
    tick();
}

/* ══════════════════════════════════════
   بدء لعبة التحدي
══════════════════════════════════════ */
function startChallengeGame() {
    _cgResetScore();
    _cgStreak = 0;

    CG.active     = true;
    CG.score      = 0;
    CG.questionIndex = 0;
    CG.answered   = false;
    CG.ended      = false;
    CG.correctAnswer  = 0;
    CG.currentExplanation = '';
    CG.askedQuestions = [];
    CG.timeLeft   = 60;
    CG.maxTime    = 60;
    CG.consecutiveWrong = 0;
    CG.helpersUsedSession = { skip: 0, remove: 0, time: 0 }; // ← عداد تراكمي للجلسة

    if (CG.timer) { clearInterval(CG.timer); CG.timer = null; }

    // إخفاء كل الطبقات وإظهار اللعبة
    const views = ['competitionMainView','challengeCountdownOverlay','challengeResultArea'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const gameArea = document.getElementById('challengeGameArea');
    if (gameArea) gameArea.style.display = 'flex';

    // تحديث الواجهة الأولية
    const scoreEl = document.getElementById('challengeScoreDisplay');
    if (scoreEl) scoreEl.textContent = '0';

    updateChallengeTimerUI();
    resetChallengeHelpers();
    updateCgaStreakBanner(0);
    startChallengeTimer();
    loadChallengeQuestion();
}

/* ══════════════════════════════════════
   المؤقت
══════════════════════════════════════ */
function startChallengeTimer() {
    if (CG.timer) clearInterval(CG.timer);
    CG.timer = setInterval(() => {
        if (CG.ended) { clearInterval(CG.timer); return; }
        CG.timeLeft--;
        updateChallengeTimerUI();
        if (CG.timeLeft <= 10) {
            try { playSound('tick'); } catch(e) {}
        }
        if (CG.timeLeft <= 0) { clearInterval(CG.timer); endChallengeGame(); }
    }, 1000);
}

function updateChallengeTimerUI() {
    const numEl  = document.getElementById('challengeTimerDisplay');
    const barEl  = document.getElementById('challengeTimerBar');
    const glowEl = document.getElementById('cgaTimerGlow');

    if (!numEl) return;

    const pct = Math.max(0, (CG.timeLeft / CG.maxTime) * 100);
    numEl.textContent = CG.timeLeft;

    const isDanger = CG.timeLeft <= 10;
    numEl.classList.toggle('danger', isDanger);
    if (barEl) {
        barEl.style.width = pct + '%';
        barEl.classList.toggle('danger-bar', isDanger);
    }
    if (glowEl) {
        glowEl.style.background = isDanger ? '#ef4444' : '#06b6d4';
        glowEl.style.right = (100 - pct) + '%';
    }
}

/* ══════════════════════════════════════
   تحميل سؤال التحدي
══════════════════════════════════════ */
function loadChallengeQuestion() {
    if (CG.ended) return;
    CG.answered = false;

    // مسح الشرح
    const expEl = document.getElementById('challengeExplanation');
    if (expEl) { expEl.innerHTML = ''; expEl.style.display = 'none'; }

    // إزالة تأثيرات البطاقة
    const card = document.getElementById('cgaQuestionCard');
    if (card) { card.classList.remove('card-correct', 'card-wrong'); }

    let q, attempts = 0;
    do {
        q = genChallengeQ(CG.questionIndex);
        const qKey = q.text + '|' + q.answer;
        if (!CG.askedQuestions.includes(qKey)) {
            CG.askedQuestions.push(qKey);
            if (CG.askedQuestions.length > 100) CG.askedQuestions.shift();
            break;
        }
        attempts++;
        if (attempts > 60) break;
    } while (true);

    CG.correctAnswer = q.answer;
    CG.currentExplanation = q.explanation || '';

    // تحديث رقم السؤال والصعوبة
    const qNum = CG.questionIndex + 1;
    ['challengeQNum', 'cgaQNumLabel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `السؤال ${qNum}`;
    });

    // تلوين بادج الصعوبة
    const diffLabels = ['سهل جداً','سهل','متوسط','متوسط+','صعب','صعب+','عبقري'];
    const diffClasses = ['diff-easy','diff-easy','diff-medium','diff-medium','diff-hard','diff-hard','diff-genius'];
    const diffEl = document.getElementById('challengeDiffLabel');
    if (diffEl) {
        diffEl.textContent = diffLabels[q.level] || 'عبقري';
        diffEl.className = 'cga-diff-badge ' + (diffClasses[q.level] || 'diff-genius');
    }

    // عرض السؤال مع أنيميشن
    const qtEl = document.getElementById('challengeQuestionText');
    if (qtEl) {
        qtEl.style.animation = 'none';
        void qtEl.offsetWidth;
        qtEl.style.animation = 'qPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        qtEl.textContent = `${q.text} = ?`;
    }

    const hintEl = document.getElementById('challengeHint');
    if (hintEl) hintEl.textContent = q.hint || 'ما هو الجواب؟';

    // عرض الأزرار
    const grid = document.getElementById('challengeAnswersGrid');
    if (grid) {
        grid.innerHTML = '';
        (q.choices || []).forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = c;
            btn.setAttribute('data-val', c);
            btn.onclick = () => checkChallengeAnswer(btn);
            grid.appendChild(btn);
        });
    }
}

/* ══════════════════════════════════════
   فحص الإجابة
══════════════════════════════════════ */
function checkChallengeAnswer(btn) {
    if (CG.answered || CG.ended) return;
    CG.answered = true;

    const val = parseFloat(btn.getAttribute('data-val'));
    document.querySelectorAll('#challengeAnswersGrid .answer-btn').forEach(b => b.disabled = true);

    const card = document.getElementById('cgaQuestionCard');

    if (Math.abs(val - CG.correctAnswer) < 0.001) {
        btn.classList.add('correct');
        if (card) card.classList.add('card-correct');

        _cgStreak++;

        // نظام النقاط المتطور:
        // نقطة أساسية + بونص التتابع
        let pts = 1;
        if (_cgStreak >= 10) pts = 3;       // تتابع ×10 → +3
        else if (_cgStreak >= 5) pts = 2;   // تتابع ×5 → +2

        _cgAddScore(pts);
        CG.questionIndex++;
        CG.consecutiveWrong = 0;

        // تحديث النقاط مع أنيميشن
        const scoreEl = document.getElementById('challengeScoreDisplay');
        if (scoreEl) {
            scoreEl.textContent = CG.score;
            scoreEl.classList.remove('score-bump');
            void scoreEl.offsetWidth;
            scoreEl.classList.add('score-bump');
        }

        // +1 ثانية (لا تتجاوز الحد الأقصى)
        CG.timeLeft = Math.min(CG.maxTime, CG.timeLeft + 1);
        updateChallengeTimerUI();

        // تحديث بانر التتابع
        updateCgaStreakBanner(_cgStreak);

        // Feedback
        const fbMsg = pts > 1 ? `✅ +${pts} 🔥×${_cgStreak}` : '✅ +1';
        try { showFeedback(fbMsg); } catch(e) {}
        try { playSound('correct'); } catch(e) {}

        // احتفال كل 10 نقاط
        if (CG.score > 0 && CG.score % 10 === 0) {
            try { doConfetti(); } catch(e) {}
            try { showComboEffect(CG.score); } catch(e) {}
        }

        // XP عائم
        try { showFloatXP(pts); } catch(e) {}

    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('#challengeAnswersGrid .answer-btn').forEach(b => {
            if (Math.abs(parseFloat(b.getAttribute('data-val')) - CG.correctAnswer) < 0.001) b.classList.add('correct');
        });
        if (card) card.classList.add('card-wrong');

        _cgStreak = 0; // كسر التتابع
        updateCgaStreakBanner(0);

        // عداد الأخطاء المتتالية
        CG.consecutiveWrong = (CG.consecutiveWrong || 0) + 1;
        if (CG.consecutiveWrong >= 2) {
            _cgAddScore(-1);
            CG.consecutiveWrong = 0;
            const scoreEl = document.getElementById('challengeScoreDisplay');
            if (scoreEl) scoreEl.textContent = CG.score;
            try { showFeedback('❌ ×2 → -1 نقطة'); } catch(e) {}
        } else {
            try { showFeedback('❌ -2 ثانية'); } catch(e) {}
        }

        try { playSound('wrong'); } catch(e) {}

        // -2 ثانية
        CG.timeLeft = Math.max(0, CG.timeLeft - 2);
        updateChallengeTimerUI();

        // شرح الإجابة
        const expEl = document.getElementById('challengeExplanation');
        if (expEl) {
            expEl.innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${CG.correctAnswer}</strong><br>${CG.currentExplanation || ''}</div>`;
            expEl.style.display = 'block';
        }

        if (CG.timeLeft <= 0) { clearInterval(CG.timer); endChallengeGame(); return; }
    }

    // ✅ FIX: المساعدات تُعاد لكل سؤال (بحد أقصى استخدام واحد لكل مساعدة في الجلسة الكاملة)
    // لا نعيد ضبطها هنا، بل نتركها locked طوال الجلسة — تم الإصلاح بإزالة السطر الذي كان يعيد ضبطها

    setTimeout(() => {
        if (CG.ended) return;
        loadChallengeQuestion();
    }, Math.abs(val - CG.correctAnswer) < 0.001 ? 320 : 700);
}

/* ══════════════════════════════════════
   بانر التتابع
══════════════════════════════════════ */
function updateCgaStreakBanner(streak) {
    const banner = document.getElementById('cgaStreakBanner');
    const text   = document.getElementById('cgaStreakText');
    if (!banner) return;

    if (streak >= 3) {
        text.textContent = streak >= 10 ? `⚡ تتابع ×${streak} — خارق!` :
                           streak >= 5  ? `🔥 تتابع ×${streak} — رائع!` :
                                          `🔥 ×${streak}`;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

/* ══════════════════════════════════════
   إنهاء لعبة التحدي
══════════════════════════════════════ */
function endChallengeGame() {
    if (CG.ended) return;
    CG.ended  = true;
    CG.active = false;
    if (CG.timer) clearInterval(CG.timer);

    CG.score = Math.max(0, Math.min(Math.floor(_cgScoreInternal || 0), 9999));
    _cgScoreInternal = CG.score;

    const isNewRecord = CG.score > (st.challengeBestScore || 0);
    if (isNewRecord) st.challengeBestScore = CG.score;
    st.challengeGamesPlayed = (st.challengeGamesPlayed || 0) + 1;

    /* ── تحديث مهام الموسم بناءً على نتيجة هذه الجلسة ── */
    try { _seasonUpdateAfterGame({ score: CG.score, mode: 'challenge' }); } catch(e) {}

    saveSt();

    // مزامنة Firebase
    syncChallengeScore(CG.score);

    // انتقال لشاشة النتيجة
    const gameArea = document.getElementById('challengeGameArea');
    const resultArea = document.getElementById('challengeResultArea');
    if (gameArea) gameArea.style.display = 'none';
    if (resultArea) resultArea.style.display = 'flex';

    // تعبئة بيانات النتيجة
    const finalScore = document.getElementById('challengeFinalScore');
    const bestScore  = document.getElementById('challengeBestScore');
    const resultMsg  = document.getElementById('challengeResultMsg');
    const medalIcon  = document.getElementById('cgrMedalIcon');

    if (finalScore) finalScore.textContent = CG.score;
    if (bestScore)  bestScore.textContent  = st.challengeBestScore || CG.score;

    // رسالة + ميدالية حسب النتيجة
    let msg = '💪 حاول مجدداً!', medal = '🎯';
    if (CG.score >= 60) { msg = '⭐ أسطورة!';      medal = '🏆'; }
    else if (CG.score >= 40) { msg = '🔥 رائع جداً!'; medal = '🥇'; }
    else if (CG.score >= 25) { msg = '⚡ ممتاز!';     medal = '🥈'; }
    else if (CG.score >= 15) { msg = '😊 جيد جداً!'; medal = '🥉'; }

    if (resultMsg) resultMsg.textContent = msg;
    if (medalIcon) medalIcon.textContent = medal;

    // سجل جديد؟
    const recordBadge = document.getElementById('cgrRecordBadge');
    if (recordBadge) recordBadge.style.display = isNewRecord ? 'block' : 'none';

    // مقارنة بالسابق
    const compareRow = document.getElementById('cgrCompareRow');
    const compareText = document.getElementById('cgrCompareText');
    if (compareRow && compareText && st.history && st.history.length >= 1) {
        const lastScore = st.challengeBestScore === CG.score && !isNewRecord
            ? (st.history[1] ? st.history[1].score : 0)
            : (st.challengeBestScore - CG.score);
        const diff = isNewRecord ? null : CG.score - (st.challengeBestScore - CG.score);
        if (isNewRecord) {
            compareText.innerHTML = `🎉 تجاوزت رقمك القياسي السابق!`;
            compareRow.style.display = 'block';
        } else {
            compareRow.style.display = 'none';
        }
    } else if (compareRow) {
        compareRow.style.display = 'none';
    }

    // احتفال
    if (CG.score >= 15) {
        try { doConfetti(); } catch(e) {}
    }

    // تحديث مرتبتي بعد المزامنة
    setTimeout(() => {
        if (database) {
            database.ref('challenge_leaderboard')
                .orderByChild('challengeScore')
                .limitToLast(200)
                .once('value', snapshot => {
                    const players = [];
                    snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                    players.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));
                    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;
                    const myIdx = myKey ? players.findIndex(p => p.id === myKey) : -1;
                    // تحديث نتيجة اللعبة
                    const rankEl = document.getElementById('cgrRank');
                    if (rankEl) rankEl.textContent = myIdx >= 0 ? '#' + (myIdx + 1) : '—';
                    // تحديث hero stats أيضاً
                    _lbCache = players; _lbCacheTime = Date.now(); _lbCacheType = 'challenge';
                    updateCompMyStats(players);
                }).catch(() => {});
        }
    }, 1200);
}

/* ══════════════════════════════════════
   المساعدات (مُصلَحة — مرة واحدة فقط لكل نوع في الجلسة)
══════════════════════════════════════ */
function resetChallengeHelpers() {
    // لا نعيد ضبط الـ session counter — فقط إزالة تأثيرات الـ UI
    ['challengeHelperSkip','challengeHelperRemove','challengeHelperTime'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const helperType = id.replace('challengeHelper','').toLowerCase();
        // إذا استُخدمت في هذه الجلسة → تبقى locked
        if (CG.helpersUsedSession && CG.helpersUsedSession[helperType] > 0) {
            el.classList.add('used');
            el.style.opacity = '0.3';
        } else {
            el.classList.remove('used');
            el.style.opacity = '1';
        }
    });
}

function useChallengeHelper(type) {
    if (CG.ended || CG.answered) return;
    if (!CG.helpersUsedSession) CG.helpersUsedSession = { skip: 0, remove: 0, time: 0 };

    if (type === 'skip') {
        if (CG.helpersUsedSession.skip > 0) { try { showFeedback('⚠️ استخدمت هذه المساعدة'); } catch(e) {} return; }
        if (st.coins < 3) { try { showFeedback('💸 لا يكفي!'); } catch(e) {} return; }
        st.coins -= 3;
        CG.helpersUsedSession.skip++;
        const el = document.getElementById('challengeHelperSkip');
        if (el) { el.classList.add('used'); el.style.opacity = '0.3'; }
        try { showFeedback('⏭️ تم التخطي'); playSound('click'); } catch(e) {}
        CG.answered = true;
        _cgStreak = 0;
        updateCgaStreakBanner(0);
        setTimeout(() => { if (!CG.ended) loadChallengeQuestion(); }, 300);

    } else if (type === 'remove') {
        if (CG.helpersUsedSession.remove > 0) { try { showFeedback('⚠️ استخدمت هذه المساعدة'); } catch(e) {} return; }
        if (st.coins < 4) { try { showFeedback('💸 لا يكفي!'); } catch(e) {} return; }
        st.coins -= 4;
        CG.helpersUsedSession.remove++;
        const el = document.getElementById('challengeHelperRemove');
        if (el) { el.classList.add('used'); el.style.opacity = '0.3'; }
        const btns = [...document.querySelectorAll('#challengeAnswersGrid .answer-btn:not(:disabled)')];
        const wrong = btns.filter(b => Math.abs(parseFloat(b.getAttribute('data-val')) - CG.correctAnswer) >= 0.001);
        if (wrong.length > 0) {
            const r = wrong[Math.floor(Math.random() * wrong.length)];
            r.style.opacity = '0.15';
            r.disabled = true;
        }
        try { showFeedback('🗑️ تم حذف إجابة'); playSound('click'); } catch(e) {}

    } else if (type === 'time') {
        if (CG.helpersUsedSession.time > 0) { try { showFeedback('⚠️ استخدمت هذه المساعدة'); } catch(e) {} return; }
        if (st.coins < 5) { try { showFeedback('💸 لا يكفي!'); } catch(e) {} return; }
        st.coins -= 5;
        CG.helpersUsedSession.time++;
        const el = document.getElementById('challengeHelperTime');
        if (el) { el.classList.add('used'); el.style.opacity = '0.3'; }
        CG.timeLeft = Math.min(CG.maxTime, CG.timeLeft + 10);
        updateChallengeTimerUI();
        try { showFeedback('⏰ +10 ثانية!'); playSound('correct'); } catch(e) {}
    }

    try { saveSt(); updateGameCoinsDisplay(); } catch(e) {}
}

/* ══════════════════════════════════════
   الخروج من التحدي
══════════════════════════════════════ */
function quitChallengeGame() {
    try {
        showConfirm('إنهاء التحدي', 'هل تريد إنهاء اللعبة؟ ستُحفظ نتيجتك الحالية.', 'نعم', 'استمرار', ok => {
            if (ok) endChallengeGame();
        });
    } catch(e) {
        endChallengeGame();
    }
}

/* ══════════════════════════════════════
   العودة للواجهة الرئيسية للمنافسة
══════════════════════════════════════ */
function restartChallengeGame() {
    if (CG.timer) clearInterval(CG.timer);

    // إخفاء كل الشاشات
    ['challengeCountdownOverlay','challengeGameArea','challengeResultArea'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // إظهار الواجهة الرئيسية
    const main = document.getElementById('competitionMainView');
    if (main) main.style.display = 'flex';

    // تحديث أفضل نتيجة في الـ Hero
    const bestEl = document.getElementById('challengeBestDisplay');
    if (bestEl) bestEl.textContent = st.challengeBestScore || 0;

    // إعادة تهيئة الجسيمات
    initCompHeroSparks();

    // تحديث لوحة الصدارة
    try { loadCombinedLeaderboard(); } catch(e) {}
}

/* ══════════════════════════════════════
   مزامنة نتيجة التحدي مع Firebase
   (مُحسَّنة: Rate limiting + تحقق أقوى)
══════════════════════════════════════ */
let _lastCgSync = 0;

function syncChallengeScore(score) {
    if (!window.database) return;
    if (!st.serialNumber) return;

    // Rate limit: لا مزامنة أكثر من مرة كل 30 ثانية
    const now = Date.now();
    if (now - _lastCgSync < 30000 && _lastCgSync > 0 && score <= (st.challengeBestScore || 0)) return;
    _lastCgSync = now;

    try {
        const safeScore = Math.max(0, Math.min(Math.floor(score || 0), 9999));
        const safeLevel = Math.min(st.level || 1, 200);
        const playerKey = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        const ref = window.database.ref('challenge_leaderboard/' + playerKey);
        ref.once('value', snap => {
            const existing = snap.val();
            if (!existing || safeScore > (existing.challengeScore || 0)) {
                ref.set({
                    name:           st.name,
                    avatar:         st.avatar || '🧑',
                    level:          safeLevel,
                    challengeScore: safeScore,
                    serialNumber:   st.serialNumber,
                    lastUpdated:    now
                }).catch(() => {});
            }
        }).catch(() => {});
    } catch(e) {}
}

/* ══════════════════════════════════════
   تحميل لوحة الصدارة الموحدة
   (مُحسَّنة: Cache 60 ثانية)
══════════════════════════════════════ */
let _lbCache = null, _lbCacheTime = 0, _lbCacheType = null;
let _activeLbTab = 'challenge';

function showLbTab(tab) {
    _activeLbTab = tab;

    // تحديث أزرار التبويب
    document.querySelectorAll('.comp-lb-tab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(tab === 'challenge' ? 'lbTabChallenge' : 'lbTabGeneral');
    if (activeBtn) activeBtn.classList.add('active');

    // تحديث رأس الجدول
    const header = document.getElementById('lbScoreHeader');
    if (header) header.textContent = tab === 'challenge' ? 'نقاط التحدي' : 'أفضل نقطة';

    // تحديث Cache أو استخدامه
    if (_lbCache && _lbCacheType === tab && Date.now() - _lbCacheTime < 60000) {
        const scoreKey = tab === 'challenge' ? 'challengeScore' : 'bestScore';
        renderLeaderboardList(
            document.getElementById('combinedLeaderboardList'),
            _lbCache,
            scoreKey
        );
    } else {
        loadCombinedLeaderboard();
    }
}

function loadCombinedLeaderboard() {
    const container = document.getElementById('combinedLeaderboardList');
    if (!container) return;

    if (!window.database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;font-size:0.82em;">⚠️ غير متصل بقاعدة البيانات</div>';
        return;
    }

    container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:0.8em;">⏳ جاري التحميل…</div>';

    const tab = _activeLbTab || 'challenge';
    const refPath  = tab === 'general' ? 'leaderboard'          : 'challenge_leaderboard';
    const scoreKey = tab === 'general' ? 'bestScore'            : 'challengeScore';

    try {
        window.database.ref(refPath)
            .orderByChild(scoreKey)
            .limitToLast(50)
            .once('value', snapshot => {
                const players = [];
                snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                players.sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0));

                // حفظ في Cache
                _lbCache = players;
                _lbCacheTime = Date.now();
                _lbCacheType = tab;

                // تحديث إحصائياتي
                updateCompMyStats(players);

                if (players.length === 0) {
                    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);font-size:0.82em;">لا توجد نتائج بعد — كن الأول! 🚀</div>';
                    return;
                }

                renderLeaderboardList(container, players, scoreKey);
            }).catch(() => {
                container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--red);font-size:0.8em;">⚠️ فشل التحميل</div>';
            });
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--red);font-size:0.8em;">⚠️ خطأ</div>';
    }
}

function renderLeaderboardList(container, players, scoreKey) {
    if (!container) return;
    const medals = ['🥇','🥈','🥉'];
    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;

    let html = '';
    players.forEach((p, idx) => {
        const isMe = p.id === myKey;
        const rank = idx < 3 ? medals[idx] : (idx + 1);
        html += `<div class="lb-row${isMe ? ' lb-row-me' : ''}">`
            + `<span>${rank}</span>`
            + `<span>${p.avatar || '🧑'} ${p.name || 'لاعب'}</span>`
            + `<span>${p.level || 1}</span>`
            + `<span style="color:var(--gold);font-weight:900;">${p[scoreKey] || 0}</span>`
            + `</div>`;
    });

    container.innerHTML = html || '<div style="text-align:center;padding:16px;color:var(--text2);">لا توجد نتائج</div>';
}

/* ══════════════════════════════════════
   تهيئة عند فتح صفحة المنافسة
   (تُستدعى من goTab في navigation.js)
══════════════════════════════════════ */
function initCompetitionPage() {
    // تأكد من إظهار الواجهة الرئيسية فقط
    ['challengeCountdownOverlay','challengeGameArea','challengeResultArea'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const main = document.getElementById('competitionMainView');
    if (main) main.style.display = 'flex';

    // تحديث أفضل نتيجة فوراً
    const bestEl = document.getElementById('challengeBestDisplay');
    if (bestEl) bestEl.textContent = st.challengeBestScore || 0;

    // تحديث المرتبة والمنافسين من Firebase مباشرة
    _fetchCompHeroStats();

    // جسيمات الـ Hero
    initCompHeroSparks();

    // مهام التحدي
    try {
        if (typeof renderChallengeTasks === 'function') {
            renderChallengeTasks();
        } else if (typeof renderChallengeDailyTasks === 'function') {
            renderChallengeDailyTasks();
        }
    } catch(e) {}

    // تحديث زر الموسم
    try { _updateSeasonBtn(); } catch(e) {}
}

/* جلب إحصائيات Hero (المرتبة + عدد المنافسين) مباشرة من Firebase */
function _fetchCompHeroStats() {
    const rankEl  = document.getElementById('compMyRank');
    const totalEl = document.getElementById('compTotalPlayers');

    // إذا كان عندنا cache حديث نستخدمه فوراً
    if (_lbCache && _lbCacheType === 'challenge' && (Date.now() - _lbCacheTime) < 60000) {
        updateCompMyStats(_lbCache);
        return;
    }

    if (!window.database) return;

    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;

    window.database.ref('challenge_leaderboard')
        .orderByChild('challengeScore')
        .limitToLast(200)
        .once('value', snapshot => {
            const players = [];
            snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
            players.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));

            // حفظ في cache
            _lbCache     = players;
            _lbCacheTime = Date.now();
            _lbCacheType = 'challenge';

            // تحديث العناصر
            if (totalEl) totalEl.textContent = players.length || '—';
            if (myKey && rankEl) {
                const myIdx = players.findIndex(p => p.id === myKey);
                rankEl.textContent = myIdx >= 0 ? '#' + (myIdx + 1) : '—';
            }
        }).catch(() => {});
}

/* ══════════════════════════════════════
   تعديل goTab لاستدعاء initCompetitionPage
   أضف هذا السطر في navigation.js داخل goTab
   عند: if (tab === 'leaderboard') { ... }
══════════════════════════════════════ */
// if (tab === 'leaderboard') {
//     initCompetitionPage();
// }


/* ═══════════════════════════════════════════════════════════
   ✅ Overlay لائحة الصدارة — فتح / إغلاق / تحديث
═══════════════════════════════════════════════════════════ */

let _lbOverlayTab = 'challenge';

function openLbOverlay(tab) {
    _lbOverlayTab = tab || 'challenge';
    const overlay = document.getElementById('lbOverlay');
    const title   = document.getElementById('lbOverlayTitle');
    const header  = document.getElementById('lbOverlayScoreHeader');
    if (!overlay) return;
    if (title)  title.textContent  = tab === 'challenge' ? '⚔️ لائحة التحدي' : '📊 لائحة النقاط';
    if (header) header.textContent = tab === 'challenge' ? 'نقاط التحدي'    : 'أفضل نقطة';
    overlay.style.display = 'flex';
    _fetchLbOverlay();
}

function closeLbOverlay() {
    const overlay = document.getElementById('lbOverlay');
    if (overlay) overlay.style.display = 'none';
}

function refreshLbOverlay() {
    const btn = document.getElementById('lbRefreshBtn');
    if (btn) {
        btn.classList.add('spinning');
        setTimeout(() => btn.classList.remove('spinning'), 650);
    }
    _fetchLbOverlay();
}

function _fetchLbOverlay() {
    const container = document.getElementById('lbOverlayList');
    if (!container) return;
    if (!window.database) {
        container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">⚠️ غير متصل بقاعدة البيانات</div>';
        return;
    }
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.8em;">⏳ جاري التحميل…</div>';
    const isChallenge = _lbOverlayTab === 'challenge';
    const refPath  = isChallenge ? 'challenge_leaderboard' : 'leaderboard';
    const scoreKey = isChallenge ? 'challengeScore'        : 'bestScore';
    try {
        window.database.ref(refPath)
            .orderByChild(scoreKey)
            .limitToLast(50)
            .once('value', function(snapshot) {
                const players = [];
                snapshot.forEach(function(child) {
                    players.push(Object.assign({ id: child.key }, child.val()));
                });
                players.sort((a, b) => (b[scoreKey]||0) - (a[scoreKey]||0));
                if (players.length === 0) {
                    container.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text2);font-size:0.82em;">لا توجد نتائج بعد — كن الأول! 🚀</div>';
                    return;
                }
                const medals = ['🥇','🥈','🥉'];
                const myKey  = (typeof st !== 'undefined' && st.serialNumber)
                               ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g,'_') : null;
                let html = '';
                players.forEach((p, idx) => {
                    const isMe = p.id === myKey;
                    const rank = idx < 3 ? medals[idx] : (idx+1);
                    html += '<div class="lb-row'+(isMe?' lb-row-me':'')+'">'
                        +'<span>'+rank+'</span>'
                        +'<span>'+(p.avatar||'🧑')+' '+(p.name||'لاعب')+'</span>'
                        +'<span>'+(p.level||1)+'</span>'
                        +'<span style="color:var(--gold);font-weight:900;">'+(p[scoreKey]||0)+'</span>'
                        +'</div>';
                });
                container.innerHTML = html;
            })
            .catch(() => {
                container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--red);font-size:0.8em;">⚠️ فشل التحميل</div>';
            });
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--red);font-size:0.8em;">⚠️ خطأ</div>';
    }
}

/* ═══════════════════════════════════════════════════════════════
   🏆 SEASON PASS — منطق موسم الرياضيات الكامل
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ── تعريف كتالوج المهام اليومية — 35 نوع متنوع ── */
const _SP_TASK_POOL = [
    /* ── وضع التحدي (challenge) ── */
    { id:'c1',  mode:'challenge', icon:'⚔️',  stars:1, name:'أول تحدي',        desc:'العب جولة تحدٍّ واحدة',            type:'challenge_games', target:1,  pts:10 },
    { id:'c2',  mode:'challenge', icon:'⚡',  stars:1, name:'نقاط سريعة',       desc:'اجمع 5 نقاط في التحدي',            type:'challenge_score', target:5,  pts:10 },
    { id:'c3',  mode:'challenge', icon:'🔥',  stars:2, name:'حرارة المنافسة',   desc:'اجمع 15 نقطة في التحدي',           type:'challenge_score', target:15, pts:20 },
    { id:'c4',  mode:'challenge', icon:'💪',  stars:2, name:'المقاتل',          desc:'العب التحدي مرتين',                 type:'challenge_games', target:2,  pts:20 },
    { id:'c5',  mode:'challenge', icon:'🏅',  stars:3, name:'قمة التحدي',       desc:'اجمع 30 نقطة في التحدي',           type:'challenge_score', target:30, pts:30 },
    /* ── اللعبة الرئيسية (main) ── */
    { id:'m1',  mode:'main',      icon:'📚',  stars:1, name:'جولة دراسية',      desc:'العب لعبة واحدة في الوضع العادي',   type:'main_games',      target:1,  pts:10 },
    { id:'m2',  mode:'main',      icon:'✅',  stars:1, name:'دقة عالية',        desc:'أجب صح على 5 أسئلة متتالية',       type:'main_correct',    target:5,  pts:10 },
    { id:'m3',  mode:'main',      icon:'🧠',  stars:2, name:'تركيز ذهني',       desc:'أجب صح على 10 أسئلة اليوم',        type:'daily_correct',   target:10, pts:20 },
    { id:'m4',  mode:'main',      icon:'📈',  stars:2, name:'نمو مستمر',        desc:'اجمع 20 نقطة في الألعاب العادية',  type:'main_score',      target:20, pts:20 },
    { id:'m5',  mode:'main',      icon:'🎓',  stars:3, name:'طالب متميز',       desc:'العب 3 ألعاب في الوضع العادي',     type:'main_games',      target:3,  pts:30 },
    /* ── وضع الصاروخ (rocket) ── */
    { id:'r1',  mode:'rocket',    icon:'🚀',  stars:1, name:'انطلاق',           desc:'العب وضع الصاروخ مرة واحدة',       type:'rocket_games',    target:1,  pts:10 },
    { id:'r2',  mode:'rocket',    icon:'💫',  stars:2, name:'صاروخي',           desc:'اجمع 10 نقاط في وضع الصاروخ',      type:'rocket_score',    target:10, pts:20 },
    { id:'r3',  mode:'rocket',    icon:'🌟',  stars:3, name:'سرعة البرق',       desc:'اجمع 25 نقطة في وضع الصاروخ',      type:'rocket_score',    target:25, pts:30 },
    /* ── التحدي الأسبوعي (weekly) ── */
    { id:'w1',  mode:'weekly',    icon:'📅',  stars:2, name:'التحدي الأسبوعي', desc:'العب التحدي الأسبوعي هذا الأسبوع', type:'weekly_played',   target:1,  pts:20 },
    { id:'w2',  mode:'weekly',    icon:'🏆',  stars:3, name:'بطل الأسبوع',     desc:'اجمع 20 نقطة في التحدي الأسبوعي', type:'weekly_score',    target:20, pts:30 },
    /* ── إجمالي اليوم (daily) ── */
    { id:'d1',  mode:'daily',     icon:'📊',  stars:1, name:'يوم نشيط',         desc:'العب لعبتين أي وضع',               type:'any_games',       target:2,  pts:10 },
    { id:'d2',  mode:'daily',     icon:'🌙',  stars:1, name:'جلسة يومية',       desc:'افتح اللعبة اليوم',                 type:'login_today',     target:1,  pts:10 },
    { id:'d3',  mode:'daily',     icon:'⭐',  stars:2, name:'نصف الطريق',       desc:'أجب صح على 15 سؤالاً اليوم',       type:'daily_correct',   target:15, pts:20 },
    { id:'d4',  mode:'daily',     icon:'🎯',  stars:2, name:'تركيز تام',        desc:'أجب صح على 20 سؤالاً اليوم',       type:'daily_correct',   target:20, pts:20 },
    { id:'d5',  mode:'daily',     icon:'💎',  stars:3, name:'يوم استثنائي',     desc:'اجمع 50 نقطة أي وضع اليوم',        type:'daily_pts_any',   target:50, pts:30 },
    /* ── متنوعة (misc) ── */
    { id:'x1',  mode:'misc',      icon:'🔢',  stars:1, name:'رياضيات الصباح',   desc:'أجب صح على 3 أسئلة',               type:'any_correct',     target:3,  pts:10 },
    { id:'x2',  mode:'misc',      icon:'🧮',  stars:2, name:'حساب سريع',        desc:'أجب صح على 8 أسئلة',               type:'any_correct',     target:8,  pts:20 },
    { id:'x3',  mode:'misc',      icon:'🏦',  stars:2, name:'مدخر العملات',     desc:'اجمع 10 عملات اليوم',               type:'earn_coins',      target:10, pts:20 },
    { id:'x4',  mode:'misc',      icon:'📐',  stars:3, name:'هندسي',            desc:'أجب صح على 15 سؤالاً',              type:'any_correct',     target:15, pts:30 },
    { id:'x5',  mode:'misc',      icon:'∑',   stars:3, name:'مجمّع النقاط',     desc:'اجمع 30 نقطة أي وضع',              type:'any_score',       target:30, pts:30 },
];

/* ── توليد 5 مهام يومية متنوعة ── */
function _seasonGenerateDailyTasks() {
    /* اختيار 5 مهام: بالتوزيع: 2×⭐ + 2×⭐⭐ + 1×⭐⭐⭐ = 10+10+20+20+30 = 90... */
    /* لضمان 100 نقطة بالضبط: 1×⭐(10) + 2×⭐⭐(20+20) + 1×⭐⭐⭐(30) + 1×⭐⭐(20) = 100 */
    const star1 = _SP_TASK_POOL.filter(t => t.stars === 1);
    const star2 = _SP_TASK_POOL.filter(t => t.stars === 2);
    const star3 = _SP_TASK_POOL.filter(t => t.stars === 3);

    function pick(arr, n, exclude = []) {
        const avail = arr.filter(t => !exclude.find(e => e.id === t.id));
        const shuffled = [...avail].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    }

    const picked1 = pick(star1, 2);
    const picked3 = pick(star3, 1);
    const picked2 = pick(star2, 2, [...picked1, ...picked3]);

    const tasks = [...picked1, ...picked2, ...picked3]
        .sort(() => Math.random() - 0.5)
        .map(t => ({
            id:      t.id,
            icon:    t.icon,
            stars:   t.stars,
            name:    t.name,
            desc:    t.desc,
            type:    t.type,
            mode:    t.mode,
            target:  t.target,
            pts:     t.pts,
            current: 0,
            done:    false,
        }));

    return tasks;
}

/* ── قراءة قيمة التقدم الحالية لنوع مهمة ── */
function _seasonGetTaskCurrent(task) {
    const s = st;
    switch (task.type) {
        case 'challenge_games':  return s.challengeGamesPlayed || 0;
        case 'challenge_score':  return s.challengeBestScore   || 0;
        case 'main_games':       return (s.dailyStats && s.dailyStats.games) || 0;
        case 'main_correct':     return (s.dailyStats && s.dailyStats.correct) || 0;
        case 'main_score':       return (s.weeklyStats && s.weeklyStats.correct) || 0;
        case 'daily_correct':    return (s.dailyStats && s.dailyStats.correct) || 0;
        case 'any_games':        return (s.dailyStats && s.dailyStats.games) || 0;
        case 'any_correct':      return (s.dailyStats && s.dailyStats.correct) || 0;
        case 'any_score':        return s.score || 0;
        case 'daily_pts_any':    return s.score || 0;
        case 'rocket_games':     return s.rocketGamesPlayed   || 0;
        case 'rocket_score':     return s.rocketBestScore     || 0;
        case 'weekly_played':    return s.weeklyChallengePlayed ? 1 : 0;
        case 'weekly_score':     return s.weeklyChallengeBest  || 0;
        case 'earn_coins':       return s.coinsEarnedToday     || 0;
        case 'login_today':      return 1; /* مجرد الوصول = مكتمل */
        default:                 return 0;
    }
}

/* ── تهيئة بيانات الموسم أو إعادة ضبطها إذا تغيّر اليوم/الأسبوع ── */
function _seasonEnsureReady() {
    if (!st.season) st.season = { weekKey:'', points:0, claimedRewards:[], dailyTasks:[], dailyTasksDate:'', completedDays:0, totalPtsEarned:0 };

    const today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
    const week  = (typeof seasonPassStr === 'function') ? seasonPassStr() : week;

    /* إعادة ضبط يومية للمهام */
    if (st.season.dailyTasksDate !== today || !st.season.dailyTasks || st.season.dailyTasks.length === 0) {
        st.season.dailyTasks     = _seasonGenerateDailyTasks();
        st.season.dailyTasksDate = today;
    }

    /* إعادة ضبط أسبوعية للموسم */
    if (st.season.weekKey && st.season.weekKey !== week) {
        st.season.points         = 0;
        st.season.claimedRewards = [];
        st.season.weekKey        = week;
    }
    if (!st.season.weekKey) st.season.weekKey = week;
}

/* ── تحديث تقدم المهام بعد كل لعبة ── */
function _seasonUpdateAfterGame(gameData) {
    _seasonEnsureReady();

    let pointsEarned = 0;
    let anyNewDone   = false;

    st.season.dailyTasks.forEach(task => {
        if (task.done) return;
        const prev    = task.current || 0;
        const current = _seasonGetTaskCurrent(task);
        task.current  = current;
        if (current >= task.target) {
            task.done    = true;
            pointsEarned += task.pts;
            anyNewDone   = true;
        }
    });

    if (pointsEarned > 0) {
        st.season.points         = Math.min(1000, (st.season.points || 0) + pointsEarned);
        st.season.totalPtsEarned = (st.season.totalPtsEarned || 0) + pointsEarned;

        /* تحقق من إكمال اليوم كاملاً */
        const allDone = st.season.dailyTasks.every(t => t.done);
        if (allDone) st.season.completedDays = (st.season.completedDays || 0) + 1;

        /* إشعار بالنقاط */
        try { showFeedback(`🏆 +${pointsEarned} نقطة موسم!`); } catch(e) {}

        /* فحص استحقاق الجوائز */
        _seasonCheckRewards();
    }

    saveSt();
    _updateSeasonBtn();
}

/* ── فحص الجوائز المستحقة وإظهار popup ── */
function _seasonCheckRewards() {
    if (typeof SEASON_TRACK_REWARDS === 'undefined') return;
    SEASON_TRACK_REWARDS.forEach(reward => {
        if (st.season.points >= reward.pts && !st.season.claimedRewards.includes(reward.pts)) {
            st.season.claimedRewards.push(reward.pts);
            _seasonGrantReward(reward);
        }
    });
}

/* ── منح الجائزة فعلياً ── */
function _seasonGrantReward(rewardDef) {
    const r = rewardDef.reward;
    try {
        switch (r.type) {
            case 'coins':
                st.coins = (st.coins || 0) + r.value;
                try { showFeedback(`🎁 جائزة الموسم: +${r.value} عملة!`); } catch(e) {}
                break;
            case 'inventory_skip':
                st.inventory = st.inventory || {};
                st.inventory.skips = (st.inventory.skips || 0) + r.value;
                try { showFeedback(`🎁 +${r.value} تخطيات مجانية!`); } catch(e) {}
                break;
            case 'xp_boost':
                st.xpBoostActive = true;
                st.xpBoostMultiplier = r.value;
                st.xpBoostExpiry = Date.now() + 24 * 60 * 60 * 1000;
                try { showFeedback(`🎁 مضاعف XP ×${r.value} لمدة 24 ساعة!`); } catch(e) {}
                break;
            case 'shield':
                st.inventory = st.inventory || {};
                st.inventory.shields = (st.inventory.shields || 0) + r.value;
                try { showFeedback(`🎁 درع حماية مجاني!`); } catch(e) {}
                break;
            case 'frame':
                st.ownedFrames = st.ownedFrames || ['frame_none'];
                if (!st.ownedFrames.includes(r.value)) st.ownedFrames.push(r.value);
                try { showFeedback(`🎁 إطار حصري: ${rewardDef.label}!`); } catch(e) {}
                break;
            case 'title':
                st.ownedTitles = st.ownedTitles || [];
                if (!st.ownedTitles.includes(r.value)) st.ownedTitles.push(r.value);
                try { showFeedback(`🎁 لقب جديد: ${rewardDef.label}!`); } catch(e) {}
                break;
            case 'season_complete':
                /* إطار + لقب البطولة معاً */
                st.ownedFrames = st.ownedFrames || ['frame_none'];
                st.ownedTitles = st.ownedTitles || [];
                if (!st.ownedFrames.includes('frame_season_champ')) st.ownedFrames.push('frame_season_champ');
                if (!st.ownedTitles.includes('title_season_champ')) st.ownedTitles.push('title_season_champ');
                /* شاشة الإتمام */
                setTimeout(() => {
                    const sc = document.getElementById('spCompleteScreen');
                    if (sc) sc.style.display = 'flex';
                }, 800);
                break;
        }
        saveSt();
    } catch(e) {}
}

/* ── تحديث زر الموسم في صفحة المنافسة ── */
function _updateSeasonBtn() {
    _seasonEnsureReady();
    const pts     = st.season.points || 0;
    const pct     = Math.min(100, (pts / 1000) * 100);
    const today   = (typeof todayStr === 'function') ? todayStr() : '';
    const tasks   = st.season.dailyTasks || [];
    const done    = tasks.filter(t => t.done).length;
    const total   = tasks.length;

    const fillEl  = document.getElementById('seasonMiniBarFill');
    const ptsEl   = document.getElementById('seasonPtsBadge');
    const subEl   = document.getElementById('seasonBtnSub');

    if (fillEl) fillEl.style.width = pct + '%';
    if (ptsEl)  ptsEl.textContent  = pts + '/1000';
    if (subEl)  subEl.textContent  = done === total
        ? `✅ أكملت مهام اليوم! (${pts}/1000 نقطة)`
        : `${done}/${total} مهام اليوم • ${pts}/1000 نقطة`;
}

/* ── فتح/إغلاق overlay الموسم ── */
function openSeasonPassOverlay() {
    _seasonEnsureReady();
    const overlay = document.getElementById('seasonPassOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    _renderSeasonPassPage();
}

function closeSeasonPassOverlay() {
    const overlay = document.getElementById('seasonPassOverlay');
    if (overlay) overlay.style.display = 'none';
}

/* ── رسم صفحة الموسم كاملة ── */
function _renderSeasonPassPage() {
    _seasonEnsureReady();

    const pts   = st.season.points || 0;
    const pct   = Math.min(100, (pts / 1000) * 100);
    const tasks = st.season.dailyTasks || [];
    const done  = tasks.filter(t => t.done).length;

    /* Header */
    const nameEl = document.getElementById('spSeasonName');
    if (nameEl && typeof getCurrentSeasonName === 'function') nameEl.textContent = getCurrentSeasonName();

    /* الأيام المتبقية في الأسبوع */
    const daysEl = document.getElementById('spDaysLeft');
    if (daysEl) {
        const now  = new Date();
        const day  = now.getDay(); /* 0=أحد */
        const left = day === 0 ? 7 : 7 - day;
        daysEl.textContent = left;
    }

    /* شريط التقدم */
    const fillEl = document.getElementById('spProgressFill');
    const glowEl = document.getElementById('spProgressGlow');
    const ptsEl  = document.getElementById('spCurrentPts');
    if (fillEl) fillEl.style.width = pct + '%';
    if (glowEl) glowEl.style.right  = (100 - pct - 1) + '%';
    if (ptsEl)  ptsEl.textContent   = pts;

    /* إحصائيات */
    const cdEl = document.getElementById('spCompletedDays');
    const teEl = document.getElementById('spTotalEarned');
    if (cdEl) cdEl.textContent = st.season.completedDays || 0;
    if (teEl) teEl.textContent = st.season.totalPtsEarned || 0;

    /* شارة المهام */
    const badgeEl = document.getElementById('spDailyBadge');
    if (badgeEl) badgeEl.textContent = done + '/' + tasks.length;

    /* مسار الجوائز */
    _renderSeasonTrack(pts);

    /* المهام اليومية */
    _renderSeasonTasks(tasks);
}

/* ── رسم مسار الجوائز ── */
function _renderSeasonTrack(pts) {
    const track = document.getElementById('spRewardTrack');
    if (!track || typeof SEASON_TRACK_REWARDS === 'undefined') return;

    track.innerHTML = SEASON_TRACK_REWARDS.map((rw, idx) => {
        const claimed = st.season.claimedRewards.includes(rw.pts);
        const reached = pts >= rw.pts;
        const current = !claimed && reached;
        const cls = ['sp-reward-node',
            claimed ? 'claimed' : reached ? 'reached' : '',
            current ? 'current' : ''
        ].filter(Boolean).join(' ');

        const claimBtn = current
            ? `<button class="sp-claim-btn" onclick="claimSeasonReward(${rw.pts})">استلم!</button>`
            : '';

        return `
        <div class="${cls}">
            <div class="sp-node-circle">${claimed ? '✓' : rw.icon}</div>
            <div class="sp-node-pts">${rw.pts}🏅</div>
            <div class="sp-node-label">${rw.label}</div>
            ${claimBtn}
        </div>`;
    }).join('');

    /* تمرير للمحطة الحالية */
    setTimeout(() => {
        const current = track.querySelector('.sp-reward-node.current, .sp-reward-node.reached:last-of-type');
        if (current) current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 200);
}

/* ── رسم المهام اليومية ── */
function _renderSeasonTasks(tasks) {
    const list = document.getElementById('spDailyTasksList');
    if (!list) return;

    const stars = n => '⭐'.repeat(n);

    list.innerHTML = tasks.map(task => {
        const cur  = Math.min(task.current || 0, task.target);
        const pct  = Math.min(100, Math.round((cur / task.target) * 100));
        const done = task.done;

        return `
        <div class="sp-task-item${done ? ' done' : ''}">
            <div class="sp-task-icon">${task.icon}</div>
            <div class="sp-task-info">
                <div class="sp-task-name">
                    ${task.name}
                    <span class="sp-task-stars">${stars(task.stars)}</span>
                    <span class="sp-task-mode-badge">${_seasonModeLabel(task.mode)}</span>
                </div>
                <div class="sp-task-desc">${task.desc}</div>
                <div class="sp-task-bar">
                    <div class="sp-task-bar-fill" style="width:${pct}%"></div>
                </div>
            </div>
            <div class="sp-task-right">
                <div class="sp-task-pts">+${task.pts}🏅</div>
                <div class="sp-task-prog">${cur}/${task.target}</div>
                ${done ? '<div style="font-size:1.1em;">✅</div>' : ''}
            </div>
        </div>`;
    }).join('');
}

/* ── تسمية الوضع بالعربي ── */
function _seasonModeLabel(mode) {
    const map = { challenge:'⚔️ تحدي', main:'📚 عادي', rocket:'🚀 صاروخ', weekly:'📅 أسبوعي', daily:'📊 يومي', misc:'🎯 متنوع' };
    return map[mode] || mode;
}

/* ── استلام جائزة يدوياً (عند الضغط على زر "استلم!") ── */
function claimSeasonReward(pts) {
    if (!st.season || st.season.claimedRewards.includes(pts)) return;
    if ((st.season.points || 0) < pts) return;

    if (typeof SEASON_TRACK_REWARDS === 'undefined') return;
    const rewardDef = SEASON_TRACK_REWARDS.find(r => r.pts === pts);
    if (!rewardDef) return;

    st.season.claimedRewards.push(pts);
    _seasonGrantReward(rewardDef);
    saveSt();

    /* إعادة رسم المسار */
    _renderSeasonTrack(st.season.points || 0);
}

/* ── تحديث تقدم مهام الموسم من اللعبة العادية ── */
/* يُستدعى من game.js بعد كل جولة */
window.seasonUpdateFromGame = function(data) {
    try {
        _seasonEnsureReady();
        _seasonUpdateAfterGame(data || {});
    } catch(e) {}
};

/* تصدير للنافذة */
window.openSeasonPassOverlay  = openSeasonPassOverlay;
window.closeSeasonPassOverlay = closeSeasonPassOverlay;
window.claimSeasonReward      = claimSeasonReward;
window._updateSeasonBtn       = _updateSeasonBtn;
window._seasonUpdateAfterGame = _seasonUpdateAfterGame;
