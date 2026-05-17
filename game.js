/* ═══════════════════════════════════════════════════
   HO Math v10 — GAME ENGINE
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ─── checkAnswer ─── */
function checkAnswer(btn) {
    if (G.answered || G.ended) return;
    G.answered = true;
    const raw = btn.getAttribute('data-val');
    const val = parseFloat(raw);
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    if (Math.abs(val - G.correctAnswer) < 0.01) {
        btn.classList.add('correct');
        G.correct++;
        G.streak++;
        if (G.streak > G.bestStreak) G.bestStreak = G.streak;
        G.score += 10 + G.streak * 2;
        G.coinsEarned += 0.4;
        showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
        playSound('correct');
        if (st.vibrationOn && navigator.vibrate) navigator.vibrate(30);

        /* وضع البقاء: +1 حياة كل 10 صحيح */
        if (G.mode === 'survival' && G.correct % 10 === 0 && G.livesLeft < 5) {
            G.livesLeft++;
            updateHeartsDisplay();
            showFeedback('❤️ حياة إضافية!');
        }

        /* وضع السرعة: +1 ثانية */
        if (G.hasTimer && G.maxTime > 0 && !G.isTraining) {
            G.timeLeft = Math.min(G.maxTime, G.timeLeft + 1);
            updateTimerDisplay();
        }

        if (G.currentCatKey && st.stats[G.currentCatKey]) {
            const s = st.stats[G.currentCatKey];
            s.att++; s.cor++; s.max += 3;
            s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
            if (G.streak >= 3) s.first++;
        }
        updTask('correct');
        if (G.streak >= 3) updTask('streak', G.streak);
        if (G.streak >= 5) doConfetti();
        if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
        showFloatXP(10 + G.streak * 2);
        if (!G.isTraining) st.correctTotal++;

    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.answer-btn').forEach(b => {
            if (Math.abs(parseFloat(b.getAttribute('data-val')) - G.correctAnswer) < 0.01) b.classList.add('correct');
        });
        G.wrong++;
        G.streak = 0;
        playSound('wrong');
        if (st.vibrationOn && navigator.vibrate) navigator.vibrate([50, 30, 50]);
        showFeedback('❌');

        if (G.hasTimer && G.maxTime > 0 && !G.isTraining) {
            G.timeLeft = Math.max(0, G.timeLeft - 2);
            updateTimerDisplay();
            if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; }
        }

        if (G.isTraining) {
            showExplanation();
        } else {
            if (G.livesLeft > 0) {
                G.livesLeft--;
                updateHeartsDisplay();
                showExplanation();
                if (G.livesLeft <= 0) {
                    if (!st.dailyShieldUsed && useDailyShield()) {
                        G.livesLeft = 1; updateHeartsDisplay(); showFeedback('🛡️ درع الحماية!');
                    } else { setTimeout(() => { if (!G.ended) endGame(); }, 700); return; }
                }
            } else { showExplanation(); }
        }
        if (G.currentCatKey && st.stats[G.currentCatKey]) { st.stats[G.currentCatKey].att++; st.stats[G.currentCatKey].max += 3; }
        if (!G.isTraining) st.wrongTotal++;
    }

    document.getElementById('statScore').textContent = G.score;
    document.getElementById('streakNum').textContent = G.streak;
    document.getElementById('streakFire').style.display = G.streak >= 3 ? 'inline' : 'none';
    updateGameCoinsDisplay();

    setTimeout(() => {
        if (G.ended) return;
        if (!G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy' && G.mode !== 'flash' && G.mode !== 'memory' && G.currentQ >= G.totalQ) endGame();
        else loadQuestion();
    }, G.isTraining ? 900 : 350);
}

function updateTimerDisplay() {
    const pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
    const bar = document.getElementById('timerBar');
    const bt = document.getElementById('bigTimer');
    if (bar) { bar.style.width = pct + '%'; bar.classList.toggle('danger', pct < 25); }
    if (bt) { bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : G.timeLeft; bt.classList.toggle('danger', G.timeLeft <= 5); }
}

/* ─── showFeedback ─── */
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
    const el = document.getElementById('explanationArea');
    if (el) el.innerHTML = `<div class="explanation-box">📝 الصواب: <strong>${G.correctAnswer}</strong><br>${G.currentExplanation}</div>`;
}

/* ─── endGame ─── */
function endGame() {
    if (G.ended) return;
    G.ended = true;
    clearGameTimer();

    if (G.isTraining) {
        document.getElementById('gameOverlay').classList.remove('active');
        goTab('home');
        showFeedback('🎓 انتهى التدريب');
        return;
    }

    const earnedCoins = Math.floor(G.coinsEarned);
    st.coins += earnedCoins;
    st.totalGames++;
    if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak;
    if (G.score > st.bestScore) st.bestScore = G.score;
    const xpGained = G.score * 2 + G.correct * 5;
    st.xp += xpGained;
    while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext * 1.3); playSound('levelup'); }

    if (['classic','speed','survival','frenzy','flash','memory'].includes(G.mode)) {
        st.catCounter.correct += G.correct; st.catCounter.total += G.correct + G.wrong;
    }
    if (['speed','survival','frenzy','daily','flash','memory'].includes(G.mode)) st.catChallenges.games++;

    /* تحديث أفضل نتائج الأوضاع الجديدة */
    if (G.mode === 'survival' && G.score > st.survivalBestScore) st.survivalBestScore = G.score;
    if (G.mode === 'speed' && G.score > st.speedBestScore) st.speedBestScore = G.score;
    if (G.mode === 'flash' && G.score > st.flashBestScore) st.flashBestScore = G.score;
    if (G.mode === 'memory' && G.score > st.memoryBestScore) st.memoryBestScore = G.score;

    updTask('game');
    if (G.mode === 'daily') updTask('daily');

    const acc = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;

    /* ملخص الجلسة */
    const summary = {
        mode: G.mode, op: G.op, score: G.score, correct: G.correct, wrong: G.wrong,
        acc, bestStreak: G.bestStreak, date: new Date().toLocaleDateString('ar'),
        fastestMs: G.fastestAnswerMs || 0
    };
    st.sessionSummaries.unshift(summary);
    if (st.sessionSummaries.length > 20) st.sessionSummaries.pop();

    st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
    if (st.history.length > 10) st.history.pop();

    saveSt(); updateUI(); checkAchievements(); syncWithLeaderboard();

    const emj = acc >= 90 ? '🏆' : acc >= 70 ? '⭐' : acc >= 50 ? '😊' : '💪';
    const ttl = acc >= 90 ? 'ممتاز!' : acc >= 70 ? 'رائع!' : acc >= 50 ? 'جيد!' : 'حاول مجدداً!';

    document.getElementById('resultsEmoji').textContent = emj;
    document.getElementById('resultsTitle').textContent = ttl;
    document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} • ${acc}% دقة`;
    document.getElementById('resScore').textContent = G.score;
    document.getElementById('resCorrect').textContent = G.correct;
    document.getElementById('resStreak').textContent = G.bestStreak;
    document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins}💰`;

    /* ملخص تفصيلي */
    const summaryEl = document.getElementById('sessionSummaryBox');
    if (summaryEl) {
        const catWrong = findWeakCategory();
        summaryEl.innerHTML = `
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px;">
                <div class="sum-chip">⏱️ أسرع إجابة: ${G.fastestAnswerMs ? (G.fastestAnswerMs/1000).toFixed(1)+'ث' : 'N/A'}</div>
                <div class="sum-chip">🎯 أطول سلسلة: ${G.bestStreak}</div>
                ${catWrong ? `<div class="sum-chip warn-chip">⚠️ الأكثر خطأً: ${catWrong}</div>` : ''}
            </div>`;
    }

    document.getElementById('gameOverlay').classList.remove('active');
    document.getElementById('resultsOverlay').classList.add('active');
    if (acc >= 70) doConfetti();
}

function findWeakCategory() {
    /* يجد التصنيف الأضعف في هذه الجلسة */
    if (!G.wrongCats || Object.keys(G.wrongCats).length === 0) return null;
    const labels = { addition:'الجمع', subtraction:'الطرح', multiplication:'الضرب', division:'القسمة',
        percentage:'النسب', algebra:'الجبر', geometry:'الهندسة', puzzles:'الألغاز', mathlaws:'القوانين' };
    const top = Object.entries(G.wrongCats).sort((a,b) => b[1]-a[1])[0];
    return labels[top[0]] || top[0];
}

function playAgain() { document.getElementById('resultsOverlay').classList.remove('active'); startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }
function goHome() { document.getElementById('resultsOverlay').classList.remove('active'); goTab('home'); }

function confirmQuit() {
    showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الرئيسية؟\nستفقد تقدمك في هذه الجلسة.', 'نعم', 'استمرار', ok => {
        if (!ok) return;
        clearGameTimer();
        document.getElementById('gameOverlay').classList.remove('active');
        document.getElementById('resultsOverlay').classList.remove('active');
        if ((G.correct > 0 || G.wrong > 0) && !G.ended && !G.isTraining) endGame();
        else { G.ended = true; clearGameTimer(); goTab('home'); }
    });
}

function doConfetti() {
    const c = ['#f0b90b','#7c3aed','#06b6d4','#10b981','#ef4444','#ffd54f'];
    for (let i = 0; i < 45; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-delay:${Math.random()*.9}s;animation-duration:${1.4+Math.random()*1.2}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
    }
}

function updateDailyShield() {
    const today = todayStr();
    if (st.lastDailyDate !== today) {
        st.dailyStreak = st.lastDailyDate === new Date(Date.now()-86400000).toDateString() ? st.dailyStreak+1 : 1;
        st.lastDailyDate = today; st.dailyShieldUsed = false; saveSt();
    }
}

function useDailyShield() {
    updateDailyShield();
    if (st.dailyShieldUsed) return false;
    st.dailyShieldUsed = true; saveSt(); return true;
}

/* ═══════════════════════════════════════
   أوضاع اللعب الجديدة
═══════════════════════════════════════ */

/* ─── وضع البقاء: 3 أرواح بلا وقت ─── */
function startSurvivalMode() {
    closeSheet('opSheet');
    startGameWith('survival', 'mix', null, false);
}

/* ─── وضع السرعة: اللاعب يجيب أسرع ما يمكن ─── */
function startSpeedRushMode() {
    closeSheet('opSheet');
    startGameWith('speed', 'mix', null, true);
}

/* ─── وضع الفلاشات: أرقام تمر بسرعة ─── */
var _flashGame = null;
function startFlashMode() {
    closeSheet('opSheet');
    _flashGame = { score: 0, round: 0, total: 10, nums: [], sum: 0, state: 'showing' };
    document.getElementById('gameOverlay').classList.add('active');
    /* إعداد واجهة الفلاشات */
    const overlay = document.getElementById('gameOverlay');
    overlay.innerHTML = buildFlashUI();
    nextFlashRound();
}

function buildFlashUI() {
    return `
    <div class="flash-container">
        <div class="game-header">
            <button class="quit-btn" onclick="quitFlash()">✖</button>
            <div class="game-header-stats">
                <div class="stat-chip">🔢 <span id="flashRound">1</span>/10</div>
                <div class="stat-chip">🏆 <span id="flashScore">0</span></div>
            </div>
        </div>
        <div class="flash-display" id="flashDisplay">
            <div id="flashNumber" style="font-size:4em;font-weight:900;color:var(--gold);text-align:center;">3</div>
            <div id="flashInstruction" style="font-size:0.85em;color:var(--text2);margin-top:8px;text-align:center;">احفظ الأرقام!</div>
        </div>
        <div id="flashAnswerArea" style="display:none;">
            <div style="font-size:1em;font-weight:700;color:var(--text);text-align:center;margin-bottom:12px;">ما مجموع الأرقام التي رأيتها؟</div>
            <input id="flashInput" type="number" style="width:100%;padding:14px;border-radius:14px;background:var(--surface2);border:2px solid var(--gold);color:var(--text);font-size:1.4em;text-align:center;outline:none;font-family:'Tajawal',sans-serif;" placeholder="أدخل الجواب">
            <button onclick="checkFlashAnswer()" style="width:100%;padding:14px;margin-top:10px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-family:'Tajawal',sans-serif;font-size:1em;font-weight:900;border:none;cursor:pointer;">✅ تأكيد</button>
        </div>
    </div>`;
}

function nextFlashRound() {
    if (!_flashGame) return;
    _flashGame.round++;
    if (_flashGame.round > _flashGame.total) { endFlashGame(); return; }
    const count = Math.min(3 + Math.floor(_flashGame.round / 3), 6);
    _flashGame.nums = Array.from({length: count}, () => rnd(1, 20));
    _flashGame.sum = _flashGame.nums.reduce((a,b) => a+b, 0);
    _flashGame.state = 'showing';
    document.getElementById('flashRound').textContent = _flashGame.round;
    document.getElementById('flashAnswerArea').style.display = 'none';
    document.getElementById('flashDisplay').style.display = 'block';
    document.getElementById('flashInstruction').textContent = `ستظهر ${count} أرقام — احفظها!`;
    showFlashNumbers(_flashGame.nums, 0);
}

function showFlashNumbers(nums, idx) {
    if (idx >= nums.length) {
        document.getElementById('flashNumber').textContent = '؟';
        document.getElementById('flashInstruction').textContent = 'الآن أدخل المجموع';
        setTimeout(() => {
            document.getElementById('flashDisplay').style.display = 'none';
            document.getElementById('flashAnswerArea').style.display = 'block';
            document.getElementById('flashInput').value = '';
            document.getElementById('flashInput').focus();
        }, 400);
        return;
    }
    document.getElementById('flashNumber').textContent = nums[idx];
    document.getElementById('flashInstruction').textContent = `${idx+1} من ${nums.length}`;
    const delay = Math.max(400, 900 - _flashGame.round * 40);
    setTimeout(() => showFlashNumbers(nums, idx+1), delay);
}

function checkFlashAnswer() {
    if (!_flashGame) return;
    const val = parseInt(document.getElementById('flashInput').value);
    if (val === _flashGame.sum) {
        _flashGame.score += 10 + _flashGame.round;
        document.getElementById('flashScore').textContent = _flashGame.score;
        showFeedback('✅ صحيح!');
        if (navigator.vibrate && st.vibrationOn) navigator.vibrate(30);
    } else {
        showFeedback(`❌ الجواب: ${_flashGame.sum}`);
        if (navigator.vibrate && st.vibrationOn) navigator.vibrate([50,30,50]);
    }
    setTimeout(nextFlashRound, 700);
}

function endFlashGame() {
    if (!_flashGame) return;
    const score = _flashGame.score;
    if (score > st.flashBestScore) st.flashBestScore = score;
    st.coins += Math.floor(score / 10);
    st.totalGames++;
    saveSt();
    document.getElementById('gameOverlay').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:30px 20px;max-width:400px;width:100%;">
        <div style="font-size:3em;">⚡</div>
        <div style="font-size:1.2em;font-weight:900;color:var(--text);">انتهى وضع الفلاشات!</div>
        <div style="background:var(--surface2);border-radius:18px;padding:20px;width:100%;text-align:center;">
            <div style="font-size:2.5em;font-weight:900;color:var(--gold);">${score}</div>
            <div style="font-size:0.75em;color:var(--text2);">نقاطك</div>
            <div style="font-size:0.85em;font-weight:700;color:var(--accent2);margin-top:8px;">أفضل نتيجة: ${st.flashBestScore}</div>
        </div>
        <button onclick="startFlashMode()" style="width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-family:'Tajawal',sans-serif;font-size:1em;font-weight:900;border:none;cursor:pointer;">🔄 حاول مجدداً</button>
        <button onclick="quitFlash()" style="width:100%;padding:12px;border-radius:14px;background:var(--surface3);color:var(--text2);font-family:'Tajawal',sans-serif;font-size:0.9em;font-weight:700;border:1px solid var(--border2);cursor:pointer;">🏠 الرئيسية</button>
    </div>`;
}

function quitFlash() {
    _flashGame = null;
    document.getElementById('gameOverlay').classList.remove('active');
    goTab('home');
}

/* ─── وضع الذاكرة: اعرض معادلة ثم اخفها ─── */
var _memGame = null;
function startMemoryMode() {
    closeSheet('opSheet');
    _memGame = { score:0, round:0, total:8, currentQ:null, state:'show' };
    document.getElementById('gameOverlay').classList.add('active');
    document.getElementById('gameOverlay').innerHTML = buildMemoryUI();
    nextMemoryRound();
}

function buildMemoryUI() {
    return `
    <div class="flash-container">
        <div class="game-header">
            <button class="quit-btn" onclick="quitMemory()">✖</button>
            <div class="game-header-stats">
                <div class="stat-chip">🧠 <span id="memRound">1</span>/8</div>
                <div class="stat-chip">🏆 <span id="memScore">0</span></div>
            </div>
        </div>
        <div id="memDisplay" style="text-align:center;padding:20px 0;">
            <div style="font-size:0.85em;color:var(--text2);margin-bottom:12px;" id="memInstruction">احفظ المعادلة!</div>
            <div class="question-card" style="width:100%;">
                <div id="memQuestion" style="font-size:1.8em;font-weight:900;color:var(--text);">...</div>
            </div>
        </div>
        <div id="memAnswerArea" style="display:none;padding:0 0 10px;">
            <div style="font-size:0.9em;font-weight:700;color:var(--text);text-align:center;margin-bottom:12px;" id="memAskText">ما هو الناتج؟</div>
            <div id="memChoicesGrid" class="answers-grid"></div>
        </div>
    </div>`;
}

function nextMemoryRound() {
    if (!_memGame) return;
    _memGame.round++;
    if (_memGame.round > _memGame.total) { endMemoryGame(); return; }
    document.getElementById('memRound').textContent = _memGame.round;
    const q = genQ('mix', getDifficultyByLevel());
    _memGame.currentQ = q;
    document.getElementById('memAnswerArea').style.display = 'none';
    document.getElementById('memDisplay').style.display = 'block';
    document.getElementById('memQuestion').textContent = q.text;
    document.getElementById('memInstruction').textContent = `الجولة ${_memGame.round} — احفظ المعادلة!`;
    const showTime = Math.max(1500, 3000 - _memGame.round * 150);
    setTimeout(() => {
        document.getElementById('memDisplay').style.display = 'none';
        document.getElementById('memAnswerArea').style.display = 'block';
        document.getElementById('memAskText').textContent = 'ماذا كان ناتج ' + q.text + ' ؟';
        const grid = document.getElementById('memChoicesGrid');
        grid.innerHTML = q.choices.map(c =>
            `<button class="answer-btn" data-val="${c}" onclick="checkMemoryAnswer(this)">${c}</button>`
        ).join('');
    }, showTime);
}

function checkMemoryAnswer(btn) {
    if (!_memGame || !_memGame.currentQ) return;
    document.querySelectorAll('#memChoicesGrid .answer-btn').forEach(b => b.disabled = true);
    const val = parseFloat(btn.getAttribute('data-val'));
    if (Math.abs(val - _memGame.currentQ.answer) < 0.01) {
        btn.classList.add('correct');
        _memGame.score += 15 + _memGame.round;
        document.getElementById('memScore').textContent = _memGame.score;
        showFeedback('✅ تذكرت!');
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('#memChoicesGrid .answer-btn').forEach(b => {
            if (Math.abs(parseFloat(b.getAttribute('data-val')) - _memGame.currentQ.answer) < 0.01) b.classList.add('correct');
        });
        showFeedback('❌');
    }
    setTimeout(nextMemoryRound, 800);
}

function endMemoryGame() {
    const score = _memGame.score;
    if (score > st.memoryBestScore) st.memoryBestScore = score;
    st.coins += Math.floor(score / 10);
    st.totalGames++;
    saveSt();
    document.getElementById('gameOverlay').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:30px 20px;max-width:400px;width:100%;">
        <div style="font-size:3em;">🧠</div>
        <div style="font-size:1.2em;font-weight:900;color:var(--text);">انتهى وضع الذاكرة!</div>
        <div style="background:var(--surface2);border-radius:18px;padding:20px;width:100%;text-align:center;">
            <div style="font-size:2.5em;font-weight:900;color:var(--gold);">${score}</div>
            <div style="font-size:0.75em;color:var(--text2);">نقاطك</div>
            <div style="font-size:0.85em;font-weight:700;color:var(--accent2);margin-top:8px;">أفضل نتيجة: ${st.memoryBestScore}</div>
        </div>
        <button onclick="startMemoryMode()" style="width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-family:'Tajawal',sans-serif;font-size:1em;font-weight:900;border:none;cursor:pointer;">🔄 حاول مجدداً</button>
        <button onclick="quitMemory()" style="width:100%;padding:12px;border-radius:14px;background:var(--surface3);color:var(--text2);font-family:'Tajawal',sans-serif;font-size:0.9em;font-weight:700;border:1px solid var(--border2);cursor:pointer;">🏠 الرئيسية</button>
    </div>`;
}

function quitMemory() {
    _memGame = null;
    document.getElementById('gameOverlay').classList.remove('active');
    goTab('home');
}

/* ─── ملخص الجلسات السابقة ─── */
function renderSessionSummaries() {
    const el = document.getElementById('sessionSummariesList');
    if (!el) return;
    if (!st.sessionSummaries || st.sessionSummaries.length === 0) {
        el.innerHTML = '<div style="text-align:center;color:var(--text2);padding:16px;font-size:0.78em;">لا توجد جلسات بعد</div>';
        return;
    }
    const modeLabels = { classic:'كلاسيك', speed:'سرعة', survival:'بقاء', frenzy:'اندفاع', daily:'يومي', flash:'فلاشات', memory:'ذاكرة' };
    el.innerHTML = st.sessionSummaries.slice(0, 5).map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:13px;background:var(--surface2);border:1px solid var(--border2);margin-bottom:6px;">
            <div style="font-size:1.3em;">${s.acc>=90?'🏆':s.acc>=70?'⭐':'😊'}</div>
            <div style="flex:1;">
                <div style="font-size:0.78em;font-weight:700;">${modeLabels[s.mode]||s.mode} • ${s.date}</div>
                <div style="font-size:0.63em;color:var(--text2);">${s.correct} صحيح • ${s.acc}% دقة • سلسلة: ${s.bestStreak}</div>
            </div>
            <div style="font-size:0.88em;font-weight:900;color:var(--gold);">${s.score}</div>
        </div>`).join('');
}
