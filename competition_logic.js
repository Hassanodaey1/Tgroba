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
    if (isNewRecord) {
        st.challengeBestScore = CG.score;
        saveSt();
    }

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
                .limitToLast(50)
                .once('value', snapshot => {
                    const players = [];
                    snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                    players.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));
                    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;
                    const myIdx = myKey ? players.findIndex(p => p.id === myKey) : -1;
                    const rankEl = document.getElementById('cgrRank');
                    if (rankEl) rankEl.textContent = myIdx >= 0 ? '#' + (myIdx + 1) : '—';
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
    if (header) header.textContent = tab === 'challenge' ? 'نقاط التحدي' : 'النقاط العامة';

    // تحديث Cache أو استخدامه
    if (_lbCache && _lbCacheType === tab && Date.now() - _lbCacheTime < 60000) {
        const scoreKey = tab === 'challenge' ? 'challengeScore' : 'score';
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
    const refPath = tab === 'challenge' ? 'challenge_leaderboard' : 'challenge_leaderboard';
    const scoreKey = 'challengeScore';

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
   لوحة الصدارة — Sheet سريعة
══════════════════════════════════════ */

function openLbSheet(type) {
    const sheetId = type === 'challenge' ? 'lbSheetChallenge' : 'lbSheetGeneral';
    const sheet = document.getElementById(sheetId);
    if (!sheet) return;
    try { playSound('click'); } catch(e) {}

    sheet.style.display = 'flex';
    sheet.style.opacity = '0';

    // نحرك الـ panel من الأسفل للأعلى
    const panel = sheet.querySelector('.lb-sheet-panel');
    if (panel) {
        panel.style.transition = 'none';
        panel.style.transform = 'translateY(100%)';
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            sheet.style.transition = 'opacity 0.25s ease';
            sheet.style.opacity = '1';
            if (panel) {
                panel.style.transition = 'transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)';
                panel.style.transform = 'translateY(0)';
            }
        });
    });

    loadLbSheetData(type, false);
}

function closeLbSheet(type) {
    const sheetId = type === 'challenge' ? 'lbSheetChallenge' : 'lbSheetGeneral';
    const sheet = document.getElementById(sheetId);
    if (!sheet) return;
    try { playSound('click'); } catch(e) {}

    const panel = sheet.querySelector('.lb-sheet-panel');
    if (panel) {
        panel.style.transition = 'transform 0.25s ease';
        panel.style.transform = 'translateY(100%)';
    }
    sheet.style.transition = 'opacity 0.25s ease';
    sheet.style.opacity = '0';

    setTimeout(() => {
        sheet.style.display = 'none';
        sheet.style.opacity = '';
        sheet.style.transition = '';
        if (panel) {
            panel.style.transform = '';
            panel.style.transition = '';
        }
    }, 260);
}

function refreshLbSheet(type) {
    try { playSound('click'); } catch(e) {}
    // تأثير دوران زر التحديث
    const btnId = type === 'challenge' ? 'lbSheetChallenge' : 'lbSheetGeneral';
    const sheet = document.getElementById(btnId);
    const refreshBtn = sheet ? sheet.querySelector('.lb-sheet-refresh-btn span') : null;
    if (refreshBtn) {
        refreshBtn.style.transition = 'transform 0.5s ease';
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => { refreshBtn.style.transform = ''; }, 500);
    }
    loadLbSheetData(type, true);
}

function loadLbSheetData(type, forceRefresh) {
    const listId = type === 'challenge' ? 'lbListChallenge' : 'lbListGeneral';
    const container = document.getElementById(listId);
    if (!container) return;

    if (!window.database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);padding:24px;font-size:0.82em;">⚠️ غير متصل بقاعدة البيانات</div>';
        return;
    }

    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.85em;">⏳ جاري التحميل…</div>';

    const refPath = 'challenge_leaderboard';
    const scoreKey = type === 'challenge' ? 'challengeScore' : 'score';

    try {
        window.database.ref(refPath)
            .orderByChild(type === 'challenge' ? 'challengeScore' : 'challengeScore')
            .limitToLast(100)
            .once('value', snapshot => {
                const players = [];
                snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));

                if (type === 'challenge') {
                    players.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));
                } else {
                    players.sort((a, b) => (b.score || b.challengeScore || 0) - (a.score || a.challengeScore || 0));
                }

                // تحديث إحصائياتي إذا كانت لائحة التحدي
                if (type === 'challenge') updateCompMyStats(players);

                if (players.length === 0) {
                    container.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text2);font-size:0.85em;">لا توجد نتائج بعد — كن الأول! 🚀</div>';
                    return;
                }

                renderLbSheetList(container, players, type === 'challenge' ? 'challengeScore' : 'score');
            }).catch(() => {
                container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--red);font-size:0.82em;">⚠️ فشل التحميل، حاول مجدداً</div>';
            });
    } catch(e) {
        container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--red);font-size:0.82em;">⚠️ خطأ في الاتصال</div>';
    }
}

function renderLbSheetList(container, players, scoreKey) {
    if (!container) return;
    const medals = ['🥇','🥈','🥉'];
    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;

    let html = '';
    players.forEach((p, idx) => {
        const isMe = p.id === myKey;
        const rank = idx < 3 ? medals[idx] : `#${idx + 1}`;
        const scoreVal = p[scoreKey] || p.challengeScore || 0;
        html += `<div class="lb-row${isMe ? ' lb-row-me' : ''}">`
            + `<span>${rank}</span>`
            + `<span>${p.avatar || '🧑'} ${p.name || 'لاعب'}</span>`
            + `<span>${p.level || 1}</span>`
            + `<span style="color:var(--gold);font-weight:900;">${scoreVal}</span>`
            + `</div>`;
    });

    container.innerHTML = html;
}


function initCompetitionPage() {
    // تأكد من إظهار الواجهة الرئيسية فقط
    ['challengeCountdownOverlay','challengeGameArea','challengeResultArea'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const main = document.getElementById('competitionMainView');
    if (main) main.style.display = 'flex';

    // تحديث أفضل نتيجة
    const bestEl = document.getElementById('challengeBestDisplay');
    if (bestEl) bestEl.textContent = st.challengeBestScore || 0;

    // جسيمات الـ Hero
    initCompHeroSparks();

    // إغلاق أي sheet مفتوحة عند العودة
    ['lbSheetChallenge','lbSheetGeneral'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.style.transform = ''; el.style.opacity = ''; }
    });

    // مهام التحدي اليومية
    try { if (typeof renderChallengeTasks === 'function') renderChallengeTasks(); } catch(e) {}
}

/* ══════════════════════════════════════
   تعديل goTab لاستدعاء initCompetitionPage
   أضف هذا السطر في navigation.js داخل goTab
   عند: if (tab === 'leaderboard') { ... }
══════════════════════════════════════ */
// if (tab === 'leaderboard') {
//     initCompetitionPage();
// }
