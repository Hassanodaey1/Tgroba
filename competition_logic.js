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
    CG.helpersUsedSession = { skip: 0, remove: 0, time: 0 };
    /* ✅ ANTI-CHEAT: تسجيل وقت البدء الحقيقي لرفض النتائج المستحيلة */
    CG._sessionStartMs = Date.now();
    CG._lastAnswerTime = 0;

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
    /* ✅ ANTI-CHEAT: منع النقر المتسارع (debounce 200ms) */
    const _now = Date.now();
    if (CG._lastAnswerTime && _now - CG._lastAnswerTime < 200) return;
    CG._lastAnswerTime = _now;
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

    /* ✅ ANTI-CHEAT: تحقق من مدة الجلسة — لا يمكن الحصول على نقاط عالية في وقت قصير جداً */
    const _sessionMs = Date.now() - (CG._sessionStartMs || Date.now());
    const _minExpectedMs = (CG.questionIndex || 0) * 800; /* 800ms على الأقل لكل سؤال */
    if (CG.questionIndex > 5 && _sessionMs < _minExpectedMs) {
        console.warn('[HO Math] جلسة تحدي مشبوهة — سرعة مستحيلة');
        /* تقليص النتيجة إلى صفر لجلسات مشبوهة */
        _cgScoreInternal = 0;
    }

    CG.score = Math.max(0, Math.min(Math.floor(_cgScoreInternal || 0), 180));
    _cgScoreInternal = CG.score;

    const isNewRecord = CG.score > (st.challengeBestScore || 0);
    if (isNewRecord) st.challengeBestScore = CG.score;
    st.challengeGamesPlayed = (st.challengeGamesPlayed || 0) + 1;

    /* ── تحديث مهام الموسم بناءً على نتيجة هذه الجلسة ── */
    try { _seasonUpdateAfterGame({ score: CG.score, mode: 'challenge' }); } catch(e) {}

    /* ═══ 💎 ماس من التحدي ═══ */
    try {
        if (typeof st.diamonds === 'number') {
            const _today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
            if (!st._diamondSources) st._diamondSources = {};
            let _cd = 0;
            /* أول مرة تصل لـ 30 نقطة في التحدي — يومياً */
            if (CG.score >= 30) {
                const _k = 'challenge30_' + _today;
                if (!st._diamondSources[_k]) { st._diamondSources[_k] = true; _cd += 1; }
            }
            /* سجل شخصي جديد في التحدي */
            if (isNewRecord && CG.score >= 20) {
                const _k2 = 'challenge_record_' + _today;
                if (!st._diamondSources[_k2]) { st._diamondSources[_k2] = true; _cd += 1; }
            }
            if (_cd > 0) {
                st.diamonds = Math.min(9999, st.diamonds + _cd);
                setTimeout(() => {
                    try { showFeedback(`💎 +${_cd} ماس نادر!`); } catch(e) {}
                    try { if (typeof _showDiamondFloat === 'function') _showDiamondFloat(_cd); } catch(e) {}
                }, 800);
            }
        }
    } catch(_de) {}

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
        /* ✅ ANTI-CHEAT: الحد النظري الأقصى = 3 نقاط × 60 ثانية = 180 */
        const _theoreticalMax = 180;
        const safeScore = Math.max(0, Math.min(Math.floor(score || 0), _theoreticalMax));
        const safeLevel = Math.min(st.level || 1, 200);
        const playerKey = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        const ref = window.database.ref('challenge_leaderboard/' + playerKey);
        ref.once('value', snap => {
            const existing = snap.val();
            if (!existing || safeScore > (existing.challengeScore || 0)) {
                /* ── حساب الألقاب المفعّلة للعرض في الملف الشخصي ── */
                let _titlesForProfile = [];
                try {
                    /* ألقاب المنافسة من COMPETITION_TITLES */
                    if (typeof COMPETITION_TITLES !== 'undefined' && Array.isArray(st.competitionTitles)) {
                        _titlesForProfile = st.competitionTitles
                            .filter(t => t && t.id)
                            .map(t => ({ id: t.id, name: t.name || t.id, icon: t.icon || '🏅' }))
                            .slice(0, 10);
                    }
                    /* ألقاب الإنجازات العامة */
                    if (Array.isArray(st.achievementsUnlocked) && st.achievementsUnlocked.length > 0) {
                        const _achTitles = st.achievementsUnlocked.slice(0, 5).map(id => ({ id, name: id, icon: '🏅' }));
                        _titlesForProfile = _titlesForProfile.concat(_achTitles).slice(0, 10);
                    }
                } catch(_te) {}

                ref.set({
                    name:           st.name,
                    avatar:         st.avatar  || '🧑',
                    level:          safeLevel,
                    challengeScore: safeScore,
                    serialNumber:   st.serialNumber,
                    lastUpdated:    now,
                    /* ══ بيانات الملف الشخصي ══ */
                    correctTotal:   Math.min(st.correctTotal  || 0, 9999999),
                    wrongTotal:     Math.min(st.wrongTotal    || 0, 9999999),
                    bestStreak:     Math.min(st.bestStreak    || 0, 9999),
                    bestScore:      Math.min(st.bestScore     || 0, 999999),
                    totalGames:     Math.min(st.totalGames    || 0, 9999999),
                    titles:         _titlesForProfile,
                    activeFrame:    st.activeFrame  || 'none',
                }).catch(() => {});
            }
        }).catch(() => {});
    } catch(e) {}
}

/* ══════════════════════════════════════
   مزامنة الملف الشخصي — تُحدَّث حقول
   الإحصائيات حتى بدون لعب التحدي
   (تُستدعى مرة كل جلسة من fixes_init)
══════════════════════════════════════ */
function syncPlayerProfile() {
    if (!window.database || !st.serialNumber) return;
    try {
        const playerKey = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        const ref = window.database.ref('challenge_leaderboard/' + playerKey);
        ref.once('value', snap => {
            const existing = snap.val();
            if (!existing) return; /* لاعب لم يلعب التحدي بعد — لا نُنشئ سجلاً فارغاً */

            /* ── حساب الألقاب ── */
            let _titles = [];
            try {
                if (Array.isArray(st.competitionTitles)) {
                    _titles = st.competitionTitles
                        .filter(t => t && t.id)
                        .map(t => ({ id: t.id, name: t.name || t.id, icon: t.icon || '🏅' }))
                        .slice(0, 10);
                }
                if (Array.isArray(st.achievementsUnlocked) && st.achievementsUnlocked.length > 0) {
                    const _ach = st.achievementsUnlocked.slice(0, 5).map(id => ({ id, name: id, icon: '🏅' }));
                    _titles = _titles.concat(_ach).slice(0, 10);
                }
            } catch(_te) {}

            /* نُحدّث فقط الحقول الإضافية — لا نمسّ challengeScore */
            ref.update({
                name:         st.name,
                avatar:       st.avatar  || '🧑',
                level:        Math.min(st.level || 1, 200),
                correctTotal: Math.min(st.correctTotal || 0, 9999999),
                wrongTotal:   Math.min(st.wrongTotal   || 0, 9999999),
                bestStreak:   Math.min(st.bestStreak   || 0, 9999),
                bestScore:    Math.min(st.bestScore    || 0, 999999),
                totalGames:   Math.min(st.totalGames   || 0, 9999999),
                titles:       _titles,
                activeFrame:  st.activeFrame || 'none',
                lastUpdated:  Date.now(),
            }).catch(() => {});
        }).catch(() => {});
    } catch(e) {}
}
window.syncPlayerProfile = syncPlayerProfile;

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
        const dataAttr = `data-player='${JSON.stringify({
            id: p.id, name: p.name, avatar: p.avatar,
            level: p.level, challengeScore: p.challengeScore,
            bestScore: p.bestScore, correctTotal: p.correctTotal,
            wrongTotal: p.wrongTotal, bestStreak: p.bestStreak,
            titles: p.titles || [], serialNumber: p.serialNumber
        }).replace(/'/g,"&#39;")}'`;
        html += `<div class="lb-row${isMe ? ' lb-row-me' : ''}" onclick="openPlayerProfile(JSON.parse(this.dataset.player))" ${dataAttr}>`
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

    // ✅ مزامنة الملف الشخصي (إحصائيات + ألقاب) مع Firebase
    try { setTimeout(syncPlayerProfile, 1500); } catch(e) {}
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
                    const dataAttr = `data-player='${JSON.stringify({
                        id: p.id, name: p.name, avatar: p.avatar,
                        level: p.level, challengeScore: p.challengeScore,
                        bestScore: p.bestScore, correctTotal: p.correctTotal,
                        wrongTotal: p.wrongTotal, bestStreak: p.bestStreak,
                        titles: p.titles || [], serialNumber: p.serialNumber
                    }).replace(/'/g,"&#39;")}'`;
                    html += '<div class="lb-row'+(isMe?' lb-row-me':'')+'" onclick="openPlayerProfile(JSON.parse(this.dataset.player))" '+dataAttr+'>'
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
   🪪 الملف الشخصي للاعب — Player Profile (النسخة الكاملة)
   المرحلة الرابعة: إطار Avatar + ترتيب + مشاركة + إشعار تحدي
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ── تعريف الإطارات (مطابق لـ frames_preview.html) ── */
const _PP_FRAMES = {
    none: () => '',
    calculator: () => {
        const items = ['1','2','3','+','×','÷','=','%','π','∞','√','7'];
        return items.map((char, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 56 * Math.cos(rad), y = 65 + 56 * Math.sin(rad);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="900" fill="#f0b90b" font-family="monospace" transform="rotate(${angle+90},${x},${y})">${char}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="53" fill="none" stroke="#f0b90b" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.5"/>`;
    },
    tools: () => {
        const icons = ['✏️','📐','📏','📚','🖊️','📓','✏️','📐'];
        return icons.map((icon, i) => {
            const angle = (i / icons.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 54 * Math.cos(rad), y = 65 + 54 * Math.sin(rad);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="11" transform="rotate(${angle+90},${x},${y})">${icon}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="51" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.6"/><circle cx="65" cy="65" r="57" fill="none" stroke="#06b6d4" stroke-width="1" stroke-dasharray="2 4" opacity="0.3"/>`;
    },
    equations: () => {
        const items = ['a²','b²','=','c²','∑','∫','Δ','∓','≠','≈','∝','∞'];
        return items.map((char, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 55 * Math.cos(rad), y = 65 + 55 * Math.sin(rad);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="#10b981" font-family="serif" transform="rotate(${angle+90},${x},${y})">${char}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="52" fill="none" stroke="#10b981" stroke-width="2.5" opacity="0.6"/>`;
    },
    stars: () => {
        const items = ['⭐','5','🌟','10','⭐','15','🌟','20'];
        return items.map((icon, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 54 * Math.cos(rad), y = 65 + 54 * Math.sin(rad);
            return isNaN(icon)
                ? `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12">${icon}</text>`
                : `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="7" font-weight="900" fill="#f59e0b" font-family="monospace">${icon}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="51" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.5"/>`;
    },
    geometry: () => {
        return [
            `<polygon points="65,11 72,24 58,24" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
            `<circle cx="119" cy="65" r="7" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
            `<rect x="54" y="106" width="22" height="14" rx="3" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
            `<circle cx="11" cy="65" r="7" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
            `<polygon points="38,30 45,43 31,43" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
            `<polygon points="92,88 99,101 85,101" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
        ].join('') + `<circle cx="65" cy="65" r="53" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5 3" opacity="0.5"/>`;
    },
    champion: () => {
        const items = ['🏆','1','🥇','★','🏆','∞','🥇','★'];
        return items.map((icon, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 54 * Math.cos(rad), y = 65 + 54 * Math.sin(rad);
            return (isNaN(icon.replace('★','')) || icon === '★')
                ? `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${icon==='★'?'14':'13'}" fill="${icon==='★'?'#f0b90b':''}">${icon}</text>`
                : `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="900" fill="#f0b90b">${icon}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="51" fill="none" stroke="#f0b90b" stroke-width="3" opacity="0.7"/><circle cx="65" cy="65" r="57" fill="none" stroke="#f0b90b" stroke-width="1" stroke-dasharray="2 3" opacity="0.3"/>`;
    },
    science: () => {
        const items = ['🔬','⚗️','🔭','🧪','⚛️','🧲','🔬','⚗️'];
        return items.map((icon, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 54 * Math.cos(rad), y = 65 + 54 * Math.sin(rad);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12" transform="rotate(${angle+90},${x},${y})">${icon}</text>`;
        }).join('') + `<circle cx="65" cy="65" r="51" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.5"/>`;
    },
    legend: () => {
        const items = ['π','e','∞','√','∑','∫','Δ','φ','α','β','γ','θ'];
        const outer = items.map((char, i) => {
            const angle = (i / items.length) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x = 65 + 57 * Math.cos(rad), y = 65 + 57 * Math.sin(rad);
            return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="900" font-family="serif" fill="url(#ppGoldGrad)" transform="rotate(${angle+90},${x},${y})">${char}</text>`;
        }).join('');
        return `<defs><linearGradient id="ppGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f0b90b"/><stop offset="50%" stop-color="#fff5b0"/><stop offset="100%" stop-color="#e5a800"/></linearGradient></defs>` + outer +
            `<circle cx="65" cy="65" r="53" fill="none" stroke="url(#ppGoldGrad)" stroke-width="3" opacity="0.8"/><circle cx="65" cy="65" r="59" fill="none" stroke="#f0b90b" stroke-width="1" stroke-dasharray="1 4" opacity="0.4"/>`;
    },
};

/* ── كاش بيانات اللائحة لحساب الترتيب بدون طلب إضافي ── */
let _ppLastLbData = null;

/* ── فتح الملف الشخصي ── */
function openPlayerProfile(playerData) {
    const modal = document.getElementById('playerProfileModal');
    if (!modal) return;

    const myKey  = (typeof st !== 'undefined' && st.serialNumber)
        ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;
    const isSelf = !!(playerData.id && myKey && playerData.id === myKey);

    modal._isSelf      = isSelf;
    modal._playerData  = playerData;

    /* ── إظهار/إخفاء العناصر ── */
    const selfBadge      = document.getElementById('ppSelfBadge');
    const shareBtn       = document.getElementById('ppShareBtn');
    const challengeBtn   = document.getElementById('ppChallengeBtn');
    const compareSection = document.getElementById('ppCompareSection');
    const avatarRing     = document.getElementById('ppAvatarRing');
    const rankBadge      = document.getElementById('ppRankBadge');

    if (selfBadge)      selfBadge.style.display      = isSelf ? 'block' : 'none';
    if (shareBtn)       shareBtn.style.display        = 'flex';
    if (challengeBtn)   challengeBtn.style.display    = isSelf ? 'none' : 'flex';
    if (compareSection) compareSection.style.display  = 'none';
    if (rankBadge)      rankBadge.style.display       = 'none';

    /* لون حلقة الـ avatar */
    if (avatarRing) {
        avatarRing.style.background = isSelf
            ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
            : 'linear-gradient(135deg, #f0b90b, #7c3aed)';
    }

    /* تصفير شريط الدقة */
    const barEl = document.getElementById('ppAccuracyBar');
    if (barEl) barEl.style.width = '0%';

    modal.style.display = 'flex';
    _fillPlayerProfile(playerData, isSelf);
    _computeAndShowRank(playerData);

    /* جلب بيانات أحدث من Firebase */
    if (playerData.serialNumber && window.database) {
        _fetchFullPlayerData(playerData.serialNumber, playerData, isSelf);
    }
}

/* ── ملء بيانات الملف الشخصي ── */
function _fillPlayerProfile(p, isSelf) {
    const avatar = document.getElementById('ppAvatar');
    const name   = document.getElementById('ppName');
    const level  = document.getElementById('ppLevel');
    if (avatar) avatar.textContent = p.avatar || '🧑';
    if (name)   name.textContent   = p.name   || 'لاعب';
    if (level)  level.textContent  = p.level  || 1;

    /* إطار الـ avatar */
    _renderAvatarFrame(p.activeFrame || 'none');

    /* أنيميشن عدّ */
    _animateCount('ppCorrect',   p.correctTotal);
    _animateCount('ppWrong',     p.wrongTotal);
    _animateCount('ppStreak',    p.bestStreak);
    _animateCount('ppBestScore', p.challengeScore || p.bestScore);

    /* شريط الدقة */
    const total = (p.correctTotal || 0) + (p.wrongTotal || 0);
    const pct   = total > 0 ? Math.round((p.correctTotal || 0) / total * 100) : null;
    const pctEl = document.getElementById('ppAccuracyPct');
    const barEl = document.getElementById('ppAccuracyBar');
    if (pctEl) pctEl.textContent = pct !== null ? pct + '%' : '—%';
    if (barEl) {
        setTimeout(() => {
            barEl.style.width = (pct !== null ? pct : 0) + '%';
            if      (pct >= 80) barEl.style.background = 'linear-gradient(90deg,#10b981,#34d399)';
            else if (pct >= 60) barEl.style.background = 'linear-gradient(90deg,#f0b90b,#fcd34d)';
            else if (pct !== null) barEl.style.background = 'linear-gradient(90deg,#ef4444,#f87171)';
        }, 80);
    }

    _renderProfileTitles(p.titles || []);
    if (!isSelf) _renderComparison(p);
}

/* ── رسم إطار الـ avatar ── */
function _renderAvatarFrame(frameId) {
    const svg = document.getElementById('ppFrameSvg');
    if (!svg) return;
    const fn = _PP_FRAMES[frameId] || _PP_FRAMES['none'];
    svg.innerHTML = fn();
}

/* ── حساب وعرض ترتيب اللاعب ── */
function _computeAndShowRank(playerData) {
    const rankBadge = document.getElementById('ppRankBadge');
    const rankVal   = document.getElementById('ppRankVal');
    const rankIcon  = document.getElementById('ppRankIcon');
    if (!rankBadge || !rankVal) return;

    const _applyRank = (idx) => {
        if (idx < 0) return;
        const rank = idx + 1;
        rankVal.textContent  = '#' + rank;
        if (rankIcon) rankIcon.textContent = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
        rankBadge.style.display = 'flex';
    };

    /* من الكاش أولاً */
    if (_ppLastLbData) {
        const idx = _ppLastLbData.findIndex(p => p.id === playerData.id || p.name === playerData.name);
        _applyRank(idx);
        return;
    }

    /* وإلا من Firebase */
    if (!window.database) return;
    try {
        window.database.ref('challenge_leaderboard')
            .orderByChild('challengeScore').limitToLast(100)
            .once('value', snap => {
                const all = [];
                snap.forEach(c => all.push(Object.assign({ id: c.key }, c.val())));
                all.sort((a, b) => (b.challengeScore || 0) - (a.challengeScore || 0));
                _ppLastLbData = all;
                const idx = all.findIndex(p => p.id === playerData.id || p.name === playerData.name);
                _applyRank(idx);
            }).catch(() => {});
    } catch(e) {}
}

/* ── مشاركة الملف الشخصي ── */
function ppShareProfile() {
    const modal = document.getElementById('playerProfileModal');
    const p = modal ? modal._playerData : null;
    if (!p) return;

    const name  = p.name  || 'لاعب';
    const level = p.level || 1;
    const total = (p.correctTotal || 0) + (p.wrongTotal || 0);
    const pct   = total > 0 ? Math.round((p.correctTotal || 0) / total * 100) + '%' : '—';

    const text =
        `🎓 HO Math — ملف ${name}\n` +
        `📊 المستوى: Lv.${level}\n` +
        `✅ إجابات صحيحة: ${_fmtNum(p.correctTotal)}\n` +
        `🔥 أعلى تتابع: ${_fmtNum(p.bestStreak)}\n` +
        `⭐ أعلى نتيجة تحدي: ${_fmtNum(p.challengeScore || p.bestScore)}\n` +
        `🎯 دقة الإجابات: ${pct}\n\n` +
        `💡 تحدّني في HO Math! © 2026 Hassan Odaey`;

    if (navigator.share) {
        navigator.share({ title: 'HO Math — ملف لاعب', text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text)
            .then(()  => _ppToast('✅ تم نسخ الملف الشخصي!'))
            .catch(()  => _ppToast('📋 فشل النسخ — جرّب يدوياً'));
    }
}

/* ── رسالة toast خفيفة ── */
function _ppToast(msg) {
    let t = document.getElementById('ppToastMsg');
    if (!t) {
        t = document.createElement('div');
        t.id = 'ppToastMsg';
        t.style.cssText = [
            'position:fixed','bottom:28px','left:50%','transform:translateX(-50%)',
            'background:rgba(15,15,30,0.92)','color:#fff',
            'padding:9px 20px','border-radius:22px','font-size:0.82em',
            'z-index:99999','pointer-events:none',
            'border:1px solid rgba(240,185,11,0.3)',
            'transition:opacity 0.3s,transform 0.3s',
            'font-family:inherit',
        ].join(';');
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2400);
}

/* ── إرسال إشعار التحدي عبر Firebase ── */
function ppSendChallengeNotif(targetPlayerData) {
    if (!window.database || !st.serialNumber || !targetPlayerData.serialNumber) return;
    try {
        const targetKey = targetPlayerData.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        window.database.ref('challenge_requests/' + targetKey).set({
            from:       st.serialNumber,
            fromName:   st.name   || 'لاعب',
            fromAvatar: st.avatar || '🧑',
            timestamp:  Date.now(),
        }).catch(() => {});
    } catch(e) {}
}

/* ── الاستماع لإشعارات التحدي الواردة ── */
let _ppNotifListener = null;

function _startListeningForChallenges() {
    if (!window.database || !st.serialNumber || _ppNotifListener) return;
    try {
        const myKey = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        const ref   = window.database.ref('challenge_requests/' + myKey);
        _ppNotifListener = ref.on('value', snap => {
            const data = snap.val();
            if (!data || !data.fromName) return;
            /* تجاهل الإشعارات القديمة (أكثر من 30 ثانية) */
            if (Date.now() - (data.timestamp || 0) > 30000) return;
            _showChallengeNotif(data.fromName, data.fromAvatar || '🧑');
            ref.remove().catch(() => {}); /* احذف بعد القراءة */
        });
    } catch(e) {}
}

/* ── عرض شريط إشعار التحدي ── */
function _showChallengeNotif(fromName, fromAvatar) {
    const bar  = document.getElementById('ppChallengeNotif');
    const text = document.getElementById('ppNotifText');
    if (!bar) return;
    if (text) text.textContent = `${fromAvatar} ${fromName} يتحدّاك!`;
    bar.style.display = 'flex';
    clearTimeout(bar._timer);
    bar._timer = setTimeout(ppDismissNotif, 8000);
}

function ppDismissNotif() {
    const bar = document.getElementById('ppChallengeNotif');
    if (bar) bar.style.display = 'none';
}

function ppAcceptChallenge(event) {
    if (event) event.stopPropagation();
    ppDismissNotif();
    setTimeout(() => {
        if (typeof launchChallengeCountdown === 'function') launchChallengeCountdown();
    }, 150);
}

/* ── عرض الألقاب ── */
function _renderProfileTitles(titles) {
    const list = document.getElementById('ppTitlesList');
    if (!list) return;
    if (!titles || !titles.length) { list.innerHTML = '<span class="pp-no-titles">لا توجد ألقاب بعد</span>'; return; }
    const chips = titles.map(t => {
        const icon = (typeof t === 'object' && t.icon) ? t.icon : '🏅';
        const nm   = (typeof t === 'object' && t.name) ? t.name : (typeof t === 'string' ? t : '');
        return nm ? `<span class="pp-title-chip">${icon} ${nm}</span>` : '';
    }).filter(Boolean).join('');
    list.innerHTML = chips || '<span class="pp-no-titles">لا توجد ألقاب بعد</span>';
}

/* ── مقارنة أنا vs اللاعب ── */
function _renderComparison(p) {
    const section = document.getElementById('ppCompareSection');
    const grid    = document.getElementById('ppCompareGrid');
    if (!section || !grid || typeof st === 'undefined') return;

    const rows = [
        { label:'دقة الإجابات', icon:'🎯', myVal:_calcAccuracy(st.correctTotal,st.wrongTotal), hisVal:_calcAccuracy(p.correctTotal,p.wrongTotal), fmt: v => v!==null?v+'%':'—', higher:true },
        { label:'أعلى تتابع',   icon:'🔥', myVal:st.bestStreak||0, hisVal:p.bestStreak||0, fmt:_fmtNum, higher:true },
        { label:'نتيجة التحدي', icon:'⭐', myVal:st.challengeBestScore||st.bestScore||0, hisVal:p.challengeScore||p.bestScore||0, fmt:_fmtNum, higher:true },
    ];

    const myAv  = st.avatar || '👤';
    const hisAv = p.avatar  || '🧑';
    const html  = rows.map(r => {
        const myW  = r.myVal!==null&&r.hisVal!==null&&(r.higher?r.myVal>r.hisVal:r.myVal<r.hisVal);
        const hisW = r.myVal!==null&&r.hisVal!==null&&(r.higher?r.hisVal>r.myVal:r.hisVal<r.myVal);
        return `<div class="pp-cmp-row">
            <div class="pp-cmp-mine${myW?' pp-cmp-winner':''}">${r.fmt(r.myVal)}</div>
            <div class="pp-cmp-label"><span class="pp-cmp-icon">${r.icon}</span>${r.label}</div>
            <div class="pp-cmp-his${hisW?' pp-cmp-winner':''}">${r.fmt(r.hisVal)}</div>
        </div>`;
    }).join('');

    grid.innerHTML = `<div class="pp-cmp-header"><span>${myAv} أنا</span><span></span><span>${hisAv} هو</span></div>${html}`;
    section.style.display = 'block';
}

function _calcAccuracy(c, w) {
    c = Number(c)||0; w = Number(w)||0;
    return c+w > 0 ? Math.round(c/(c+w)*100) : null;
}

/* ── أنيميشن عدّ الأرقام ── */
function _animateCount(elId, targetVal) {
    const el = document.getElementById(elId);
    if (!el) return;
    const n = Number(targetVal);
    if (isNaN(n) || targetVal == null) { el.textContent = '—'; return; }
    if (n >= 10000) { el.textContent = _fmtNum(n); return; }
    const steps = 30, dur = 600, step = n / steps;
    let cur = 0, cnt = 0;
    el.textContent = '0';
    const t = setInterval(() => {
        cnt++;
        cur = cnt >= steps ? n : Math.round(step * cnt);
        el.textContent = _fmtNum(cur);
        if (cnt >= steps) clearInterval(t);
    }, dur / steps);
}

/* ── جلب بيانات اللاعب من Firebase ── */
function _fetchFullPlayerData(serialNumber, fallback, isSelf) {
    const loading = document.getElementById('ppLoading');
    if (loading) loading.style.display = 'flex';
    try {
        const key = serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
        window.database.ref('challenge_leaderboard/' + key)
            .once('value', snap => {
                if (loading) loading.style.display = 'none';
                const data = snap.val();
                if (data) _fillPlayerProfile(Object.assign({}, fallback, data), isSelf);
            }).catch(() => { if (loading) loading.style.display = 'none'; });
    } catch(e) { if (loading) loading.style.display = 'none'; }
}

/* ── إغلاق المودال ── */
function closePlayerProfile(event) {
    if (event && event.target !== document.getElementById('playerProfileModal')) return;
    const modal = document.getElementById('playerProfileModal');
    if (modal) modal.style.display = 'none';
}

/* ── بدء التحدي + إرسال إشعار ── */
function ppStartChallenge() {
    const modal = document.getElementById('playerProfileModal');
    const p = modal ? modal._playerData : null;
    if (p) ppSendChallengeNotif(p);
    closePlayerProfile();
    setTimeout(() => {
        if (typeof launchChallengeCountdown === 'function') launchChallengeCountdown();
    }, 200);
}

/* ── تنسيق الأرقام ── */
function _fmtNum(n) {
    if (n == null) return '—';
    n = Number(n);
    if (isNaN(n)) return '—';
    if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
    if (n >= 1000)    return (n/1000).toFixed(1)+'K';
    return n.toString();
}

/* ── تصدير للنافذة ── */
window.openPlayerProfile  = openPlayerProfile;
window.closePlayerProfile = closePlayerProfile;
window.ppStartChallenge   = ppStartChallenge;
window.ppShareProfile     = ppShareProfile;
window.ppDismissNotif     = ppDismissNotif;
window.ppAcceptChallenge  = ppAcceptChallenge;
window.ppSetLbCache       = (data) => { _ppLastLbData = data; };

/* ── بدء الاستماع للإشعارات بعد تهيئة Firebase ── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_startListeningForChallenges, 3000));
} else {
    setTimeout(_startListeningForChallenges, 3000);
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

    st.season.dailyTasks.forEach(task => {
        if (task.done) return;
        task.current  = _seasonGetTaskCurrent(task);
        if (task.current >= task.target) {
            task.done     = true;
            pointsEarned += task.pts;
        }
    });

    if (pointsEarned > 0) {
        /* تطبيق Bonus Day إذا كان يوم الجمعة */
        pointsEarned = _seasonApplyBonusDay(pointsEarned);

        st.season.points         = Math.min(1000, (st.season.points || 0) + pointsEarned);
        st.season.totalPtsEarned = (st.season.totalPtsEarned || 0) + pointsEarned;

        try { showFeedback(`🏆 +${pointsEarned} نقطة موسم!`); } catch(e) {}
        _seasonCheckRewards();
    }

    /* تحديث الـ Streak إذا أكملت كل المهام */
    _seasonStreakCheck();

    /* تحديث تقدم مهمة الفلاش */
    _seasonFlashTaskUpdate();

    /* فحص استحقاق الصندوق */
    _seasonChestCheck();

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
    const pts   = st.season.points || 0;
    const pct   = Math.min(100, (pts / 1000) * 100);
    const tasks = st.season.dailyTasks || [];
    const done  = tasks.filter(t => t.done).length;
    const total = tasks.length;

    /* ── زر MP في الهيدر ── */
    const headerBar = document.getElementById('headerMpBar');
    if (headerBar) headerBar.style.width = pct + '%';

    /* نقطة تنبيه حمراء عند وجود جائزة جاهزة للاستلام */
    const mpBtn = document.querySelector('.header-mp-btn');
    if (mpBtn) {
        const hasReady = typeof SEASON_TRACK_REWARDS !== 'undefined' &&
            SEASON_TRACK_REWARDS.some(r => pts >= r.pts && !(st.season.claimedRewards || []).includes(r.pts));
        let dot = mpBtn.querySelector('.mp-alert-dot');
        if (hasReady && !dot) {
            dot = document.createElement('div');
            dot.className = 'mp-alert-dot';
            mpBtn.appendChild(dot);
        } else if (!hasReady && dot) {
            dot.remove();
        }
    }

    /* ── تحديث العناصر القديمة (إن وجدت) ── */
    const fillEl = document.getElementById('seasonMiniBarFill');
    const ptsEl  = document.getElementById('seasonPtsBadge');
    const subEl  = document.getElementById('seasonBtnSub');
    if (fillEl) fillEl.style.width = pct + '%';
    if (ptsEl)  ptsEl.textContent  = pts + '/1000';
    if (subEl)  subEl.textContent  = done === total
        ? `✅ أكملت مهام اليوم! (${pts}/1000 نقطة)`
        : `${done}/${total} مهام اليوم • ${pts}/1000 نقطة`;

    /* ── تحديث زر مسار الجوائز ── */
    try { _updateTrackBtn(pts); } catch(e) {}
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

    /* اسم الموسم */
    const nameEl = document.getElementById('spSeasonName');
    if (nameEl && typeof getCurrentSeasonName === 'function') nameEl.textContent = getCurrentSeasonName();

    /* الأيام المتبقية — مع تنبيه urgent إذا يوم واحد */
    const daysEl   = document.getElementById('spDaysLeft');
    const timerBox = document.getElementById('spSeasonTimer');
    if (daysEl) {
        const day  = new Date().getDay();
        const left = day === 0 ? 7 : 7 - day;
        daysEl.textContent = left;
        if (timerBox) timerBox.className = 'sp-header-timer' + (left <= 1 ? ' urgent' : '');
    }

    /* شريط التقدم */
    const fillEl = document.getElementById('spProgressFill');
    const glowEl = document.getElementById('spProgressGlow');
    const ptsEl  = document.getElementById('spCurrentPts');
    if (fillEl) {
        fillEl.style.width = pct + '%';
        if (pts >= 1000) fillEl.classList.add('complete');
    }
    if (glowEl) glowEl.style.right = Math.max(0, 100 - pct - 1) + '%';
    if (ptsEl)  { ptsEl.textContent = pts; ptsEl.classList.add('sp-pts-pop'); setTimeout(() => ptsEl.classList.remove('sp-pts-pop'), 500); }

    /* إحصائيات */
    const cdEl = document.getElementById('spCompletedDays');
    const teEl = document.getElementById('spTotalEarned');
    if (cdEl) cdEl.textContent = st.season.completedDays || 0;
    if (teEl) teEl.textContent = st.season.totalPtsEarned || 0;

    /* شارة المهام */
    const badgeEl = document.getElementById('spDailyBadge');
    if (badgeEl) badgeEl.textContent = done + '/' + tasks.length;

    /* ── الأقسام الجديدة ── */
    _renderSeasonStreak();
    _renderSeasonRank(pts);
    _seasonBonusDayCheck();
    _seasonFlashTaskGenerate();
    _renderFlashTask();
    _seasonChestCheck();

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
/* ═══════════════════════════════════════════════════════════════
   🔥 STREAK — منطق التتابع اليومي
═══════════════════════════════════════════════════════════════ */
function _seasonStreakCheck() {
    const today     = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
    const yesterday = (function(){
        const d = new Date(); d.setDate(d.getDate() - 1);
        return d.toISOString().slice(0,10);
    })();

    const allDone = st.season.dailyTasks.length > 0 && st.season.dailyTasks.every(t => t.done);
    if (!allDone) return;
    if (st.season.lastStreakDate === today) return; /* سبق وحُسب اليوم */

    if (st.season.lastStreakDate === yesterday) {
        /* تتابع مستمر */
        st.season.streak = (st.season.streak || 0) + 1;
    } else if (st.season.lastStreakDate && st.season.lastStreakDate !== yesterday) {
        /* كُسر التتابع — تحقق من الدرع */
        if ((st.season.streakShields || 0) > 0) {
            st.season.streakShields--;
            st.season.streak = (st.season.streak || 0) + 1;
            try { showFeedback('🛡️ درع الـ Streak حمى تتابعك!'); } catch(e) {}
        } else {
            st.season.streak = 1; /* يبدأ من جديد */
        }
    } else {
        st.season.streak = 1; /* أول يوم */
    }

    st.season.lastStreakDate = today;
    if (st.season.streak > (st.season.bestStreak || 0)) st.season.bestStreak = st.season.streak;

    /* مكافأة كل 3 أيام تتابع */
    if (st.season.streak % 3 === 0) {
        const bonus = st.season.streak >= 7 ? 30 : 15;
        st.season.points         = Math.min(1000, (st.season.points || 0) + bonus);
        st.season.totalPtsEarned = (st.season.totalPtsEarned || 0) + bonus;
        try { showFeedback(`🔥 ${st.season.streak} أيام تتابع! +${bonus} نقطة بونص!`); } catch(e) {}
        _seasonCheckRewards();
    }

    saveSt();
}

/* ═══════════════════════════════════════════════════════════════
   ⭐ SEASON RANK — عرض الرتبة
═══════════════════════════════════════════════════════════════ */
function _renderSeasonRank(pts) {
    if (typeof getSeasonRank === 'undefined') return;
    const rank    = getSeasonRank(pts);
    const iconEl  = document.getElementById('spRankIcon');
    const labelEl = document.getElementById('spRankLabel');
    const nextEl  = document.getElementById('spRankNext');
    const boxEl   = document.getElementById('spRankBox');

    if (iconEl)  iconEl.textContent  = rank.icon;
    if (labelEl) labelEl.textContent = rank.label;
    if (boxEl)   { boxEl.className = 'sp-rank-box ' + rank.cls; }

    /* النقاط المتبقية للرتبة التالية */
    if (nextEl && typeof SEASON_RANKS !== 'undefined') {
        const idx  = SEASON_RANKS.findIndex(r => r.cls === rank.cls);
        const next = SEASON_RANKS[idx + 1];
        nextEl.textContent = next ? `${next.min - pts} للتالية ›` : '🏆 الرتبة الأعلى!';
    }
}

/* ═══════════════════════════════════════════════════════════════
   🔥 STREAK — رسم شريط الـ Streak
═══════════════════════════════════════════════════════════════ */
function _renderSeasonStreak() {
    const streak  = st.season.streak  || 0;
    const shields = st.season.streakShields || 0;

    const numEl    = document.getElementById('spStreakNum');
    const fireEl   = document.getElementById('spStreakFire');
    const shieldEl = document.getElementById('spStreakShield');
    const cntEl    = document.getElementById('spShieldCount');
    const boxEl    = document.getElementById('spStreakBox');

    if (numEl)    numEl.textContent    = streak;
    if (shieldEl) shieldEl.style.display = shields > 0 ? 'flex' : 'none';
    if (cntEl)    cntEl.textContent    = shields;
    if (boxEl) {
        boxEl.className = 'sp-streak-box' +
            (streak >= 7  ? ' streak-hot'  :
             streak >= 3  ? ' streak-warm' : '');
    }
    if (fireEl) {
        fireEl.textContent = streak >= 14 ? '🌋' : streak >= 7 ? '🔥' : streak >= 3 ? '🔥' : '💤';
    }
}

/* ═══════════════════════════════════════════════════════════════
   📅 BONUS DAY — يوم الجمعة مضاعف ×2
═══════════════════════════════════════════════════════════════ */
function _seasonBonusDayCheck() {
    const today   = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
    const dayOfWk = new Date().getDay(); /* 5 = جمعة */
    const isBonusDay = dayOfWk === 5;
    const badgeEl    = document.getElementById('spBonusBadge');

    if (badgeEl) badgeEl.style.display = isBonusDay ? 'flex' : 'none';

    return isBonusDay && st.season.bonusDayUsed !== today;
}

/* يُستدعى من _seasonUpdateAfterGame لمضاعفة النقاط يوم الجمعة */
function _seasonApplyBonusDay(pts) {
    const today    = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);
    const dayOfWk  = new Date().getDay();
    if (dayOfWk === 5 && st.season.bonusDayUsed !== today) {
        st.season.bonusDayUsed = today;
        try { showFeedback(`🎉 يوم المضاعف! نقاطك ×2`); } catch(e) {}
        return pts * 2;
    }
    return pts;
}

/* ═══════════════════════════════════════════════════════════════
   ⚡ FLASH TASK — مهام الفلاش
═══════════════════════════════════════════════════════════════ */
function _seasonFlashTaskGenerate() {
    if (typeof FLASH_TASK_POOL === 'undefined') return;
    const today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);

    /* توليد فلاش مرتين يومياً — الأولى عند الفتح، الثانية بعد 8 ساعات */
    if (st.season.flashTaskDate === today && st.season.flashTask) return;

    const pool    = FLASH_TASK_POOL.filter(t => !st.season.flashTask || t.id !== st.season.flashTask.id);
    const picked  = pool[Math.floor(Math.random() * pool.length)];
    const expires = Date.now() + 2 * 60 * 60 * 1000; /* ساعتان */

    st.season.flashTask = {
        id:        picked.id,
        icon:      picked.icon,
        name:      picked.name,
        desc:      picked.desc,
        type:      picked.type,
        target:    picked.target,
        current:   0,
        pts:       picked.pts,
        expiresAt: expires,
        done:      false,
    };
    st.season.flashTaskDate = today;
    saveSt();
}

function _renderFlashTask() {
    const section = document.getElementById('spFlashTaskSection');
    const card    = document.getElementById('spFlashTaskCard');
    const timerEl = document.getElementById('spFlashTimer');
    const ft      = st.season.flashTask;

    if (!ft || ft.done || Date.now() > ft.expiresAt) {
        if (section) section.style.display = 'none';
        return;
    }
    if (section) section.style.display = 'block';

    const cur  = Math.min(ft.current || 0, ft.target);
    const pct  = Math.min(100, Math.round((cur / ft.target) * 100));

    if (card) {
        card.innerHTML = `
        <div class="sp-flash-inner">
            <div class="sp-flash-icon">${ft.icon}</div>
            <div class="sp-task-info">
                <div class="sp-task-name">${ft.name} <span class="sp-flash-pts-badge">+${ft.pts * 2}🏅</span></div>
                <div class="sp-task-desc">${ft.desc}</div>
                <div class="sp-task-bar"><div class="sp-task-bar-fill sp-flash-bar" style="width:${pct}%"></div></div>
            </div>
            <div class="sp-task-right">
                <div class="sp-task-prog">${cur}/${ft.target}</div>
                ${ft.done ? '<div style="font-size:1.1em">✅</div>' : ''}
            </div>
        </div>`;
    }

    /* عداد تنازلي */
    if (timerEl) {
        clearInterval(window._flashTimerInterval);
        window._flashTimerInterval = setInterval(() => {
            const left = Math.max(0, ft.expiresAt - Date.now());
            if (left <= 0) {
                clearInterval(window._flashTimerInterval);
                if (section) section.style.display = 'none';
                st.season.flashTask = null;
                saveSt();
                return;
            }
            const h = Math.floor(left / 3600000);
            const m = Math.floor((left % 3600000) / 60000);
            const s = Math.floor((left % 60000) / 1000);
            timerEl.textContent = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
        }, 1000);
    }
}

/* تحديث تقدم الفلاش بعد اللعبة */
function _seasonFlashTaskUpdate() {
    const ft = st.season.flashTask;
    if (!ft || ft.done || Date.now() > ft.expiresAt) return;

    const current = _seasonGetTaskCurrent({ type: ft.type, target: ft.target });
    ft.current = current;

    if (current >= ft.target) {
        ft.done = true;
        /* نقاط الفلاش مضاعفة دائماً */
        const earned = ft.pts * 2;
        st.season.points         = Math.min(1000, (st.season.points || 0) + earned);
        st.season.totalPtsEarned = (st.season.totalPtsEarned || 0) + earned;
        try { showFeedback(`⚡ مهمة فلاش مكتملة! +${earned} نقطة موسم!`); } catch(e) {}
        _seasonCheckRewards();
        saveSt();
    }
}

/* ═══════════════════════════════════════════════════════════════
   🎁 SEASON CHEST — صندوق الموسم
═══════════════════════════════════════════════════════════════ */
function _seasonChestCheck() {
    const total35 = 35; /* 5 مهام × 7 أيام */
    const done    = (st.season.completedDays || 0) * 5;
    const section = document.getElementById('spChestSection');

    if (done >= total35 && !st.season.chestOpened) {
        st.season.chestAvailable = true;
        if (section) section.style.display = 'block';
    } else {
        if (section) section.style.display = 'none';
    }
}

function openSeasonChest() {
    if (!st.season.chestAvailable || st.season.chestOpened) return;

    /* جوائز عشوائية من قائمة */
    const prizes = [
        { icon:'💰', text:'+100 عملة ذهبية!',      action: () => { st.coins = (st.coins||0) + 100; } },
        { icon:'⏭️', text:'+5 تخطيات مجانية!',      action: () => { st.inventory = st.inventory||{}; st.inventory.skips = (st.inventory.skips||0)+5; } },
        { icon:'🛡️', text:'+2 درع Streak!',         action: () => { st.season.streakShields = (st.season.streakShields||0)+2; } },
        { icon:'⚡', text:'مضاعف XP ×2 ليوم كامل!', action: () => { st.xpBoostActive=true; st.xpBoostMultiplier=2; st.xpBoostExpiry=Date.now()+86400000; } },
        { icon:'💎', text:'+150 عملة + درع!',        action: () => { st.coins=(st.coins||0)+150; st.season.streakShields=(st.season.streakShields||0)+1; } },
    ];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    prize.action();

    st.season.chestOpened    = true;
    st.season.chestAvailable = false;
    saveSt();

    /* شاشة الفتح */
    const screen  = document.getElementById('spChestOpenScreen');
    const iconEl  = document.getElementById('spChestOpenIcon');
    const rwdEl   = document.getElementById('spChestOpenReward');
    if (screen) screen.style.display = 'flex';
    if (iconEl) {
        iconEl.textContent = '🎁';
        setTimeout(() => { iconEl.textContent = prize.icon; }, 600);
    }
    if (rwdEl) rwdEl.textContent = prize.text;

    const section = document.getElementById('spChestSection');
    if (section) section.style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════════
   📜 SEASON HISTORY — ذاكرة المواسم
═══════════════════════════════════════════════════════════════ */
function openSeasonHistory() {
    const overlay = document.getElementById('seasonHistoryOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    _renderSeasonHistory();
}

function closeSeasonHistory() {
    const overlay = document.getElementById('seasonHistoryOverlay');
    if (overlay) overlay.style.display = 'none';
}

function _renderSeasonHistory() {
    const list = document.getElementById('spHistoryList');
    if (!list) return;

    const history = (st.season && st.season.history) || [];

    if (history.length === 0) {
        list.innerHTML = `
        <div class="sp-empty-state">
            <div class="sp-empty-state-icon">📜</div>
            <div class="sp-empty-state-text">لا يوجد مواسم سابقة بعد<br>أكمل موسمك الأول ليظهر هنا!</div>
        </div>`;
        return;
    }

    const sorted = [...history].reverse();
    list.innerHTML = sorted.map((h, i) => {
        const rank = (typeof getSeasonRank !== 'undefined') ? getSeasonRank(h.pts) : { icon:'🥉', label:'—' };
        const pct  = Math.min(100, Math.round((h.pts / 1000) * 100));
        return `
        <div class="sp-history-card">
            <div class="sp-history-header">
                <div class="sp-history-num">الموسم ${sorted.length - i}</div>
                <div class="sp-history-name">${h.name || 'موسم سابق'}</div>
                ${h.completed ? '<div class="sp-history-complete-badge">✅ مكتمل</div>' : ''}
            </div>
            <div class="sp-history-stats">
                <div class="sp-history-stat">
                    <span>${rank.icon}</span>
                    <span>${rank.label}</span>
                </div>
                <div class="sp-history-stat">
                    <span>🏅</span>
                    <span>${h.pts}/1000</span>
                </div>
                <div class="sp-history-stat">
                    <span>🔥</span>
                    <span>${h.streak || 0} يوم</span>
                </div>
            </div>
            <div class="sp-history-bar">
                <div class="sp-history-bar-fill ${h.completed ? 'complete' : ''}" style="width:${pct}%"></div>
            </div>
        </div>`;
    }).join('');
}

/* ═══════════════════════════════════════════════════════════════
   🏆 SEASON LEADERBOARD — لوحة صدارة الموسم الأسبوعي
═══════════════════════════════════════════════════════════════ */

let _slbTab       = 'week'; /* التبويب النشط: week | all */
let _slbCacheWeek = null;
let _slbCacheAll  = null;
let _slbCacheTime = 0;

function openSeasonLeaderboard() {
    const overlay = document.getElementById('seasonLbOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';

    /* تحديث اسم الموسم في الهيدر */
    const nameEl = document.getElementById('slbSeasonName');
    if (nameEl && typeof getCurrentSeasonName === 'function') nameEl.textContent = getCurrentSeasonName();

    /* تحديث بطاقة "أنا" */
    _slbUpdateMyCard();

    /* تحميل اللوحة */
    _fetchSeasonLeaderboard(_slbTab);
}

function closeSeasonLeaderboard() {
    const overlay = document.getElementById('seasonLbOverlay');
    if (overlay) overlay.style.display = 'none';
}

function refreshSeasonLeaderboard() {
    _slbCacheWeek = null;
    _slbCacheAll  = null;
    _slbCacheTime = 0;
    const btn = document.getElementById('slbRefreshBtn');
    if (btn) { btn.textContent = '⏳'; setTimeout(() => { btn.textContent = '🔄'; }, 2000); }
    _fetchSeasonLeaderboard(_slbTab);
}

function switchSeasonLbTab(tab) {
    _slbTab = tab;
    document.querySelectorAll('.slb-tab').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(tab === 'week' ? 'slbTabWeek' : 'slbTabAll');
    if (activeBtn) activeBtn.classList.add('active');
    _fetchSeasonLeaderboard(tab);
}

/* ── تحديث بطاقة "أنا" ── */
function _slbUpdateMyCard() {
    const rankEl  = document.getElementById('slbMyRank');
    const nameEl  = document.getElementById('slbMyName');
    const ptsEl   = document.getElementById('slbMyPts');
    const badgeEl = document.getElementById('slbMyBadge');

    if (nameEl) nameEl.textContent = st.playerName || 'أنت';
    const pts = st.season ? (st.season.points || 0) : 0;
    if (ptsEl) ptsEl.textContent = pts + ' نقطة موسم';
    if (badgeEl && typeof getSeasonRank === 'function') {
        badgeEl.textContent = getSeasonRank(pts).icon;
    }
    /* المرتبة تُحدَّث بعد جلب البيانات */
    if (rankEl) rankEl.textContent = '…';
}

/* ── جلب البيانات من Firebase ── */
function _fetchSeasonLeaderboard(tab) {
    const list = document.getElementById('slbList');
    if (!list) return;

    /* استخدام cache إذا كان حديثاً (أقل من دقيقتين) */
    const cache = tab === 'week' ? _slbCacheWeek : _slbCacheAll;
    if (cache && (Date.now() - _slbCacheTime) < 120000) {
        _renderSeasonLeaderboard(cache, tab);
        return;
    }

    list.innerHTML = '<div class="slb-loading">⏳ جارٍ التحميل…</div>';

    if (!window.database) {
        list.innerHTML = '<div class="slb-empty">⚠️ غير متصل بقاعدة البيانات</div>';
        return;
    }

    const weekKey = (typeof seasonPassStr === 'function') ? seasonPassStr() : '';
    const refPath = tab === 'week'
        ? `season_leaderboard/${weekKey}`
        : 'season_leaderboard_all';

    try {
        window.database.ref(refPath)
            .orderByChild('seasonPoints')
            .limitToLast(100)
            .once('value', snapshot => {
                const players = [];
                snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
                players.sort((a, b) => (b.seasonPoints || 0) - (a.seasonPoints || 0));

                if (tab === 'week') _slbCacheWeek = players;
                else                _slbCacheAll  = players;
                _slbCacheTime = Date.now();

                _renderSeasonLeaderboard(players, tab);
            }).catch(() => {
                list.innerHTML = '<div class="slb-empty">⚠️ فشل التحميل — حاول مجدداً</div>';
            });
    } catch(e) {
        list.innerHTML = '<div class="slb-empty">⚠️ خطأ في الاتصال</div>';
    }
}

/* ── رسم قائمة اللاعبين ── */
function _renderSeasonLeaderboard(players, tab) {
    const list   = document.getElementById('slbList');
    const rankEl = document.getElementById('slbMyRank');
    if (!list) return;

    if (players.length === 0) {
        list.innerHTML = '<div class="slb-empty">لا يوجد لاعبون بعد — كن الأول! 🚀</div>';
        if (rankEl) rankEl.textContent = '—';
        return;
    }

    const myKey  = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : null;
    const medals = ['🥇','🥈','🥉'];

    /* تحديث مرتبتي */
    if (myKey && rankEl) {
        const myIdx = players.findIndex(p => p.id === myKey);
        rankEl.textContent = myIdx >= 0 ? '#' + (myIdx + 1) : '—';
    }

    list.innerHTML = players.map((p, idx) => {
        const isMe   = p.id === myKey;
        const medal  = idx < 3 ? medals[idx] : '#' + (idx + 1);
        const rank   = typeof getSeasonRank === 'function' ? getSeasonRank(p.seasonPoints || 0) : { icon:'🥉' };
        const streak = p.streak ? `🔥${p.streak}` : '';

        return `
        <div class="slb-row${isMe ? ' slb-row-me' : ''}${idx < 3 ? ' slb-row-top' : ''}">
            <div class="slb-row-rank">${medal}</div>
            <div class="slb-row-player">
                <span class="slb-row-avatar">${p.avatar || '🧑'}</span>
                <div class="slb-row-info">
                    <div class="slb-row-name">${p.name || 'لاعب'}${isMe ? ' <span class="slb-me-tag">أنت</span>' : ''}</div>
                    <div class="slb-row-sub">مستوى ${p.level || 1} ${streak}</div>
                </div>
            </div>
            <div class="slb-row-badge">${rank.icon}</div>
            <div class="slb-row-pts">${p.seasonPoints || 0}</div>
        </div>`;
    }).join('');
}

/* ── رفع نقاط الموسم لـ Firebase ── */
function syncSeasonScore() {
    if (!window.database || !st.serialNumber || !st.season) return;
    if ((st.season.points || 0) === 0) return;

    const weekKey = (typeof seasonPassStr === 'function') ? seasonPassStr() : '';
    const myKey   = st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const payload = {
        name:         st.playerName || 'لاعب',
        avatar:       st.avatar     || '🧑',
        level:        st.level      || 1,
        seasonPoints: st.season.points || 0,
        streak:       st.season.streak || 0,
        weekKey,
        updatedAt:    Date.now(),
    };

    /* رفع للأسبوع الحالي */
    window.database.ref(`season_leaderboard/${weekKey}/${myKey}`).set(payload).catch(() => {});
    /* رفع للكل (أفضل نتيجة تاريخية) */
    window.database.ref(`season_leaderboard_all/${myKey}`).transaction(current => {
        if (!current || (payload.seasonPoints > (current.seasonPoints || 0))) return payload;
        return current;
    }).catch(() => {});
}

/* ═══════════════════════════════════════════════════════════════
   📤 SHARE ACHIEVEMENT — مشاركة الإنجاز
═══════════════════════════════════════════════════════════════ */
function shareSeasonAchievement() {
    _seasonEnsureReady();

    const pts      = st.season.points        || 0;
    const streak   = st.season.streak        || 0;
    const days     = st.season.completedDays || 0;
    const name     = st.playerName           || st.name || 'لاعب';
    const avatar   = st.avatar               || '🧑';
    const rank     = (typeof getSeasonRank !== 'undefined') ? getSeasonRank(pts) : { icon:'🥉', label:'مبتدئ' };
    const sName    = (typeof getCurrentSeasonName !== 'undefined') ? getCurrentSeasonName() : 'Math Pass';
    const pct      = Math.min(100, Math.round((pts / 1000) * 100));

    /* بناء نص المشاركة */
    const shareText = [
        `🏆 HO Math — MP | Math Pass`,
        `📅 ${sName}`,
        ``,
        `👤 ${name}`,
        `${rank.icon} رتبة: ${rank.label}`,
        `🏅 النقاط: ${pts}/1000 (${pct}%)`,
        `🔥 تتابع: ${streak} يوم`,
        `✅ أيام مكتملة: ${days}`,
        ``,
        `هل يمكنك التغلب عليّ؟ 💪`,
        `العب الآن: HO Math`
    ].join('\n');

    /* تحديث بطاقة المشاركة */
    _updateShareCard({ name, avatar, rank, sName, pts, streak, days, pct });

    /* محاولة native share أولاً */
    if (navigator.share) {
        navigator.share({
            title: `HO Math — MP | Math Pass`,
            text:  shareText,
        }).catch(() => {
            _showShareOverlay(shareText);
        });
    } else {
        _showShareOverlay(shareText);
    }
}

function _updateShareCard({ name, avatar, rank, sName, pts, streak, days, pct }) {
    const q = id => document.getElementById(id);
    if (q('shareSeasonName'))  q('shareSeasonName').textContent  = sName;
    if (q('shareAvatar'))      q('shareAvatar').textContent      = avatar;
    if (q('sharePlayerName'))  q('sharePlayerName').textContent  = name;
    if (q('shareRankDisplay')) q('shareRankDisplay').textContent = `${rank.icon} ${rank.label}`;
    if (q('sharePoints'))      q('sharePoints').textContent      = pts;
    if (q('shareStreak'))      q('shareStreak').textContent      = streak + '🔥';
    if (q('shareDays'))        q('shareDays').textContent        = days;
    if (q('shareBarFill'))     q('shareBarFill').style.width     = pct + '%';
}

function _showShareOverlay(text) {
    window._shareText = text;
    const overlay = document.getElementById('shareAchievementOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function closeShareOverlay() {
    const overlay = document.getElementById('shareAchievementOverlay');
    if (overlay) overlay.style.display = 'none';
    const msg = document.getElementById('shareCopiedMsg');
    if (msg) msg.style.display = 'none';
}

function copyShareText() {
    const text = window._shareText || '';
    if (!text) return;
    navigator.clipboard.writeText(text)
        .then(() => {
            const msg = document.getElementById('shareCopiedMsg');
            if (msg) { msg.style.display = 'block'; setTimeout(() => { msg.style.display = 'none'; }, 2500); }
        })
        .catch(() => {
            /* fallback للأجهزة القديمة */
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            const msg = document.getElementById('shareCopiedMsg');
            if (msg) { msg.style.display = 'block'; setTimeout(() => { msg.style.display = 'none'; }, 2500); }
        });
}

window.shareSeasonAchievement = shareSeasonAchievement;
window.closeShareOverlay      = closeShareOverlay;
window.copyShareText          = copyShareText;
window.closeSeasonLeaderboard  = closeSeasonLeaderboard;
window.refreshSeasonLeaderboard = refreshSeasonLeaderboard;
window.switchSeasonLbTab       = switchSeasonLbTab;
window.syncSeasonScore         = syncSeasonScore;

/* ═══════════════════════════════════════════════════════════════
   🎁 REWARD TRACK OVERLAY — صفحة مسار الجوائز المستقلة
═══════════════════════════════════════════════════════════════ */
function openRewardTrackOverlay() {
    const overlay = document.getElementById('rewardTrackOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    _renderRewardTrackOverlay();
}

function closeRewardTrackOverlay() {
    const overlay = document.getElementById('rewardTrackOverlay');
    if (overlay) overlay.style.display = 'none';
}

function _renderRewardTrackOverlay() {
    _seasonEnsureReady();
    const pts  = st.season.points || 0;
    const pct  = Math.min(100, Math.round((pts / 1000) * 100));

    const q = id => document.getElementById(id);
    if (q('rtoProgressSub'))  q('rtoProgressSub').textContent  = pts + ' / 1000 نقطة';
    if (q('rtoPtsVal'))       q('rtoPtsVal').textContent       = pts;
    if (q('rtoProgressFill')) q('rtoProgressFill').style.width = pct + '%';
    if (q('rtoProgressLabel'))q('rtoProgressLabel').textContent= pct + '%';

    const body = q('rtoBody');
    if (!body || typeof SEASON_TRACK_REWARDS === 'undefined') return;

    body.innerHTML = SEASON_TRACK_REWARDS.map((rw, idx) => {
        const claimed  = st.season.claimedRewards.includes(rw.pts);
        const reached  = pts >= rw.pts;
        const canClaim = reached && !claimed;
        const state    = claimed ? 'claimed' : reached ? 'reached' : 'locked';
        const ptsLeft  = Math.max(0, rw.pts - pts);
        const miniPct  = Math.min(100, Math.round((pts / rw.pts) * 100));

        return `
        <div class="rto-node rto-node-${state}" id="rtoNode_${rw.pts}">
            ${idx > 0 ? `<div class="rto-connector ${reached ? 'passed' : ''}"></div>` : ''}
            <div class="rto-node-row">
                <div class="rto-circle-wrap">
                    <div class="rto-circle">
                        <span class="rto-circle-icon">${claimed ? '✓' : rw.icon}</span>
                    </div>
                    <div class="rto-pts-tag">${rw.pts}🏅</div>
                </div>
                <div class="rto-card">
                    <div class="rto-card-top">
                        <div class="rto-card-label">${rw.label}</div>
                        <div class="rto-card-state-badge rto-badge-${state}">
                            ${claimed ? '✅ مُستلمة' : reached ? '🔓 جاهزة' : `🔒 بعد ${ptsLeft}🏅`}
                        </div>
                    </div>
                    ${canClaim ? `
                    <button class="rto-claim-btn" onclick="claimSeasonReward(${rw.pts});_renderRewardTrackOverlay();_updateTrackBtn(st.season.points||0);">
                        <span>🎁 استلم الجائزة</span>
                        <span class="rto-claim-icon">${rw.icon}</span>
                    </button>` : ''}
                    ${!reached ? `
                    <div class="rto-mini-prog">
                        <div class="rto-mini-fill" style="width:${miniPct}%"></div>
                    </div>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');

    setTimeout(() => {
        const first = body.querySelector('.rto-node-reached:not(.rto-node-claimed), .rto-node-reached');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);

    _updateTrackBtn(pts);
}

function _updateTrackBtn(pts) {
    if (typeof SEASON_TRACK_REWARDS === 'undefined') return;
    const claimed = (st.season.claimedRewards || []);
    const sub  = document.getElementById('spTrackBtnSub');
    const mini = document.getElementById('spTrackMiniNodes');

    if (sub) {
        const next = SEASON_TRACK_REWARDS.find(r => !claimed.includes(r.pts));
        if (!next) {
            sub.textContent = '✅ كل الجوائز مُستلمة!';
            sub.style.color = '#10b981';
        } else if (pts >= next.pts) {
            sub.textContent = '🔓 جائزة جاهزة للاستلام!';
            sub.style.color = 'var(--gold)';
        } else {
            sub.textContent = `التالية عند ${next.pts}🏅 — باقي ${next.pts - pts} نقطة`;
            sub.style.color = '';
        }
    }

    if (mini) {
        mini.innerHTML = SEASON_TRACK_REWARDS.map(r => {
            const done  = claimed.includes(r.pts);
            const ready = !done && pts >= r.pts;
            return `<div class="rto-mini-dot ${done ? 'done' : ready ? 'ready' : ''}"></div>`;
        }).join('');
    }
}

window.openRewardTrackOverlay  = openRewardTrackOverlay;
window.closeRewardTrackOverlay = closeRewardTrackOverlay;
window._updateTrackBtn         = _updateTrackBtn;

window.openSeasonPassOverlay   = openSeasonPassOverlay;
window.closeSeasonPassOverlay  = closeSeasonPassOverlay;
window.claimSeasonReward       = claimSeasonReward;
window._updateSeasonBtn        = _updateSeasonBtn;
window._seasonUpdateAfterGame  = _seasonUpdateAfterGame;
window.openSeasonChest         = openSeasonChest;
window.openSeasonHistory       = openSeasonHistory;
window.closeSeasonHistory      = closeSeasonHistory;
window.seasonUpdateFromGame    = function(data) {
    try {
        _seasonEnsureReady();
        _seasonUpdateAfterGame(data || {});
        /* رفع النقاط لـ Firebase بعد كل تحديث */
        setTimeout(syncSeasonScore, 1500);
    } catch(e) {}
};

/* ═══════════════════════════════════════════════════════
   MP Quick Sheets — مهام اليوم + لائحة الصدارة
═══════════════════════════════════════════════════════ */

/* ── Sheet مهام اليوم ── */
function openMpDailySheet() {
    _seasonEnsureReady();
    const sheet = document.getElementById('mpDailySheet');
    if (!sheet) return;

    const tasks = (st.season && st.season.dailyTasks) || [];
    const done  = tasks.filter(t => t.done).length;
    const total = tasks.length || 5;
    const pct   = Math.min(100, Math.round((done / total) * 100));

    /* تحديث الـ badge والبار */
    const badge = document.getElementById('mpDailySheetBadge');
    const bar   = document.getElementById('mpDailySheetBar');
    const list  = document.getElementById('mpDailySheetList');
    if (badge) badge.textContent = done + '/' + total;
    if (bar)   setTimeout(() => { bar.style.width = pct + '%'; }, 80);

    /* بناء القائمة */
    if (list) {
        if (!tasks.length) {
            list.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text2);font-size:0.82em;">لا توجد مهام متاحة الآن</div>';
        } else {
            const stars = n => '⭐'.repeat(n || 0);
            list.innerHTML = tasks.map(task => {
                const cur  = Math.min(task.current || 0, task.target);
                const tpct = Math.min(100, Math.round((cur / task.target) * 100));
                const done = task.done;
                return `
                <div class="mp-sheet-task-item${done ? ' done' : ''}">
                    <div class="mp-sheet-task-icon">${task.icon || '📌'}</div>
                    <div class="mp-sheet-task-body">
                        <div class="mp-sheet-task-name">
                            ${task.name || ''}
                            ${task.stars ? '<span style="font-size:0.8em;">' + stars(task.stars) + '</span>' : ''}
                        </div>
                        <div class="mp-sheet-task-desc">${task.desc || ''}</div>
                        <div class="mp-sheet-task-bar">
                            <div class="mp-sheet-task-bar-fill" style="width:${tpct}%"></div>
                        </div>
                    </div>
                    <div class="mp-sheet-task-right">
                        <div class="mp-sheet-task-pts">+${task.pts || 0}🏅</div>
                        <div class="mp-sheet-task-prog">${cur}/${task.target}</div>
                        ${done ? '<div style="font-size:1.1em;">✅</div>' : ''}
                    </div>
                </div>`;
            }).join('');
        }
    }

    sheet.style.display = 'flex';
}

function closeMpDailySheet() {
    const sheet = document.getElementById('mpDailySheet');
    if (sheet) sheet.style.display = 'none';
}

/* ── Sheet لائحة الصدارة ── */
let _mpLbCurrentTab = 'week';

function openMpLeaderboardSheet() {
    const sheet = document.getElementById('mpLeaderboardSheet');
    if (!sheet) return;

    /* اسم الموسم */
    const nameEl = document.getElementById('mpLbSheetSeasonName');
    if (nameEl && typeof getCurrentSeasonName === 'function') nameEl.textContent = getCurrentSeasonName();

    /* بطاقة مرتبتي */
    _renderMpLbMyCard();

    sheet.style.display = 'flex';
    _mpLbCurrentTab = 'week';
    _updateMpLbTabStyle();
    _loadMpLeaderboardSheet('week');
}

function closeMpLeaderboardSheet() {
    const sheet = document.getElementById('mpLeaderboardSheet');
    if (sheet) sheet.style.display = 'none';
}

function refreshMpLeaderboardSheet() {
    const btn = document.getElementById('mpLbRefreshBtn');
    if (btn) { btn.style.transform = 'rotate(360deg)'; setTimeout(() => btn.style.transform = '', 400); }
    _loadMpLeaderboardSheet(_mpLbCurrentTab);
}

function switchMpLbTab(tab) {
    _mpLbCurrentTab = tab;
    _updateMpLbTabStyle();
    _loadMpLeaderboardSheet(tab);
}

function _updateMpLbTabStyle() {
    const week = document.getElementById('mpLbTabWeek');
    const all  = document.getElementById('mpLbTabAll');
    if (!week || !all) return;
    const activeStyle  = 'flex:1;padding:7px;border-radius:10px;border:1px solid rgba(240,185,11,0.35);background:linear-gradient(135deg,rgba(240,185,11,0.2),rgba(240,185,11,0.08));color:var(--gold);font-family:\'Tajawal\',sans-serif;font-size:0.75em;font-weight:900;cursor:pointer;';
    const inactiveStyle = 'flex:1;padding:7px;border-radius:10px;border:1px solid var(--border2);background:var(--surface2);color:var(--text2);font-family:\'Tajawal\',sans-serif;font-size:0.75em;font-weight:700;cursor:pointer;';
    week.style.cssText = (_mpLbCurrentTab === 'week') ? activeStyle : inactiveStyle;
    all.style.cssText  = (_mpLbCurrentTab === 'all')  ? activeStyle : inactiveStyle;
}

function _renderMpLbMyCard() {
    _seasonEnsureReady();
    const pts    = (st.season && st.season.points) || 0;
    const name   = (st && st.name) || 'أنت';
    const rankEl = document.getElementById('mpLbMyRank');
    const nameEl = document.getElementById('mpLbMyName');
    const ptsEl  = document.getElementById('mpLbMyPts');
    const badge  = document.getElementById('mpLbMyBadge');
    if (nameEl) nameEl.textContent = name;
    if (ptsEl)  ptsEl.textContent  = pts + ' نقطة';
    /* رتبة تقديرية */
    if (badge) {
        if (pts >= 800) badge.textContent = '💎';
        else if (pts >= 500) badge.textContent = '🥇';
        else if (pts >= 200) badge.textContent = '🥈';
        else badge.textContent = '🥉';
    }
}

function _loadMpLeaderboardSheet(tab) {
    const list = document.getElementById('mpLbSheetList');
    if (!list) return;
    list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">جاري التحميل…</div>';

    /* نستخدم نفس بيانات Firebase الموجودة في الكود الأصلي */
    if (typeof firebase === 'undefined' || !firebase.database) {
        list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">غير متصل</div>';
        return;
    }

    const path = tab === 'week' ? 'season_weekly_scores' : 'season_alltime_scores';
    try {
        firebase.database().ref(path).orderByChild('pts').limitToLast(30).once('value').then(snap => {
            const rows = [];
            snap.forEach(c => {
                const d = c.val();
                if (d && d.name && typeof d.pts === 'number') rows.push(d);
            });
            rows.sort((a,b) => b.pts - a.pts);

            if (!rows.length) {
                list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">لا توجد بيانات بعد</div>';
                return;
            }

            const myName = (st && st.name) || '';
            const rankBadge = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            const rankClass = i => i === 0 ? ' gold-rank' : i === 1 ? ' silver-rank' : i === 2 ? ' bronze-rank' : '';

            list.innerHTML = rows.map((r, i) => {
                const isMe = r.name === myName;
                return `<div class="mp-lb-row${isMe ? ' me' : ''}">
                    <div class="mp-lb-rank${rankClass(i)}">${rankBadge(i) || (i+1)}</div>
                    <div class="mp-lb-name">${r.name || '—'}</div>
                    <div class="mp-lb-badge">${r.badge || ''}</div>
                    <div class="mp-lb-pts">${r.pts}🏅</div>
                </div>`;
            }).join('');

            /* تحديث مرتبتي */
            const myIdx = rows.findIndex(r => r.name === myName);
            const rankEl = document.getElementById('mpLbMyRank');
            if (rankEl && myIdx >= 0) rankEl.textContent = '#' + (myIdx + 1);
        }).catch(() => {
            list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">تعذّر التحميل</div>';
        });
    } catch(e) {
        list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2);font-size:0.82em;">تعذّر التحميل</div>';
    }
}

window.openMpDailySheet         = openMpDailySheet;
window.closeMpDailySheet        = closeMpDailySheet;
window.openMpLeaderboardSheet   = openMpLeaderboardSheet;
window.closeMpLeaderboardSheet  = closeMpLeaderboardSheet;
window.refreshMpLeaderboardSheet = refreshMpLeaderboardSheet;
window.switchMpLbTab            = switchMpLbTab;
