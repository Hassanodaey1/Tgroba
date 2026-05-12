// game-loop.js

let G = {
    mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0,
    streak: 0, bestStreak: 0, currentQ: 0, totalQ: 10,
    correctAnswer: 0, answered: false, timer: null, timeLeft: 0,
    maxTime: 0, coinsEarned: 0, livesLeft: 3,
    helpersUsed: { skip: false, remove: false },
    ended: false, isTraining: false, customTable: null,
    hasTimer: false, askedQuestions: [],
    currentExplanation: '', currentCatKey: ''
};

function clearGameTimer() { if (G.timer) { clearInterval(G.timer); G.timer = null; } }

function updateGameCoinsDisplay() {
    const totalCoins = st.coins + Math.floor(G.coinsEarned);
    document.getElementById('gameCoins').textContent = totalCoins;
}

function updateHeartsDisplay() {
    const row = document.getElementById('heartsRow');
    if (!row) return;
    let h = '';
    for (let i = 0; i < 3; i++) { h += `<span class="heart-icon${i>=G.livesLeft?' lost':''}">❤️</span>`; }
    row.innerHTML = h;
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

function doConfetti() {
    const col = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981', '#ef4444', '#ffd54f'];
    for (let i = 0; i < 45; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `left:${Math.random()*100}%;top:-10px;background:${col[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};animation-delay:${Math.random()*0.9}s;animation-duration:${1.4+Math.random()*1.2}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
    }
}

function showExplanation() {
    if (!G.currentExplanation) return;
    document.getElementById('explanationArea').innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`;
}

function showConfirm(title, msg, yesText, noText, cb) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    document.getElementById('confirmBtnYes').textContent = yesText || 'نعم';
    document.getElementById('confirmBtnNo').textContent = noText || 'إلغاء';
    const ov = document.getElementById('confirmOverlay');
    ov.classList.add('active');
    document.getElementById('confirmBtnYes').onclick = () => { ov.classList.remove('active'); cb && cb(true); };
    document.getElementById('confirmBtnNo').onclick = () => { ov.classList.remove('active'); cb && cb(false); };
}

function renderVisualAid(q) {
    const box = document.getElementById('visualAid');
    box.innerHTML = '';
    if (st.difficulty !== 'easy' || !['add','sub','mul','div','table'].includes(G.op) && !['add','sub','mul','div','table'].includes(G.currentCatKey)) return;
    const age = st.age || calculateAgeFromBirthDate(st.birthDate);
    if (age > 12) return;
    const nums = q.text?.match(/\d+/g);
    if (!nums || nums.length < 2) return;
    const a = parseInt(nums[0]), b = parseInt(nums[1]);
    if (a > 15 || b > 15) return;
    if (G.op === 'add' || G.currentCatKey === 'addition' || q.text?.includes('+')) {
        let h = '';
        for (let i = 0; i < a; i++) h += `<div class="visual-dot" onclick="this.classList.toggle('counted')"></div>`;
        h += `<span style="margin:0 6px;font-size:1.2em;">+</span>`;
        for (let i = 0; i < b; i++) h += `<div class="visual-dot" style="background:var(--accent2)" onclick="this.classList.toggle('counted')"></div>`;
        box.innerHTML = h;
    } else if (G.op === 'sub' || G.currentCatKey === 'subtraction') {
        let h = '';
        for (let i = 0; i < a; i++) h += `<div class="visual-dot" onclick="this.classList.toggle('counted')"></div>`;
        box.innerHTML = h + `<span style="margin:0 4px;">- ${b}</span>`;
    } else if (G.op === 'mul' || G.currentCatKey === 'multiplication' || G.op === 'table') {
        if (a <= 5 && b <= 5) {
            let h = '';
            for (let i = 0; i < a; i++) { h += '<div style="display:flex;gap:2px;">'; for (let j = 0; j < b; j++) h += `<div class="visual-dot" style="width:14px;height:14px;background:var(--accent2)"></div>`; h += '</div>'; }
            box.innerHTML = h;
        }
    }
}

function loadQuestion() {
    if (G.ended) return;
    if (G.currentQ >= G.totalQ && !G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy') { endGame(); return; }
    G.currentQ++;
    G.answered = false;
    G.helpersUsed.remove = false;
    document.getElementById('helperRemove').classList.remove('used');
    document.getElementById('explanationArea').innerHTML = '';
    const age = st.age || calculateAgeFromBirthDate(st.birthDate);
    let q;
    let attempts = 0;
    do {
        if (G.isTraining) {
            q = (G.op === 'table' && G.customTable) ? genQ('table', st.difficulty, G.customTable) : generateAgeAdaptiveQuestion(G.op, st.difficulty, age);
            if (!q.choices || q.choices.length < 4) q = genQ(G.op, st.difficulty);
        } else {
            if (G.op === 'table' && G.customTable) q = genQ('table', st.difficulty, G.customTable);
            else if (G.op === 'advanced') q = genQ('advanced', st.difficulty);
            else if (G.op === 'laws') q = genQ('laws', st.difficulty);
            else {
                let useDiff = st.difficulty;
                if (G.mode === 'classic' && !useDiff) useDiff = getDifficultyByLevel();
                q = genQ(G.op, useDiff);
            }
        }
        const qKey = q.text + '|' + q.answer;
        if (!G.askedQuestions.includes(qKey) || G.isTraining || ['speed','survival','frenzy'].includes(G.mode)) break;
        attempts++;
    } while (attempts < 50);
    if (!G.isTraining && !['speed','survival','frenzy'].includes(G.mode)) G.askedQuestions.push(q.text + '|' + q.answer);
    G.correctAnswer = q.answer;
    G.currentExplanation = q.explanation || '';
    G.currentCatKey = q.catKey || getCatStatsKey(G.op || 'add');
    const qt = document.getElementById('questionText');
    qt.style.animation = 'none'; void qt.offsetWidth; qt.style.animation = '';
    document.getElementById('questionNumber').textContent = G.isTraining ? `🎓 تدريب - ${G.correct+1}` :
        G.mode === 'speed' ? `⚡ السؤال ${G.correct+1}` :
        G.mode === 'frenzy' ? `💥 ${G.correct+1} إجابة` :
        G.mode === 'survival' ? `❤️ ${G.livesLeft} قلوب` : `السؤال ${G.currentQ} من ${G.totalQ}`;
    document.getElementById('questionText').textContent = `${q.text} = ?`;
    document.getElementById('questionHint').textContent = q.hint || 'ما هو الجواب؟';
    document.getElementById('statQ').textContent = (G.isTraining || ['speed','survival','frenzy'].includes(G.mode)) ? G.correct : `${G.currentQ}/${G.totalQ}`;
    renderVisualAid(q);
    const grid = document.getElementById('answersGrid');
    grid.innerHTML = '';
    (q.choices || shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2])).forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn'; btn.textContent = c; btn.setAttribute('data-val', c);
        btn.onclick = () => checkAnswer(btn);
        grid.appendChild(btn);
    });
}

function checkAnswer(btn) {
    if (G.answered || G.ended) return;
    G.answered = true;
    const val = parseInt(btn.getAttribute('data-val'));
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
    if (val === G.correctAnswer) {
        btn.classList.add('correct');
        G.correct++; G.streak++; G.bestStreak = Math.max(G.streak, G.bestStreak);
        G.score += 10 + G.streak * 2;
        G.coinsEarned += 0.4;
        showFeedback(G.streak >= 5 ? `🔥×${G.streak}` : '✅');
        playSound('correct');
        if (G.hasTimer && G.maxTime > 0 && !G.isTraining) {
            G.timeLeft = Math.min(G.maxTime, G.timeLeft + 1);
            const pct = (G.timeLeft / G.maxTime) * 100;
            document.getElementById('timerBar').style.width = pct + '%';
            const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
            document.getElementById('timerBar').classList.toggle('danger', G.timeLeft <= 10);
            bt?.classList.toggle('danger', G.timeLeft <= 10);
        }
        if (G.currentCatKey && st.stats[G.currentCatKey]) {
            const s = st.stats[G.currentCatKey];
            s.att++; s.cor++; s.max += 3; s.stars += Math.min(3, Math.floor(G.streak / 3) + 1);
            if (G.streak >= 3) s.first++;
        }
        updTask('correct'); if (G.streak >= 3) updTask('streak', G.streak);
        if (G.streak >= 5) doConfetti();
        if (G.streak >= 5 && G.streak % 5 === 0) showComboEffect(G.streak);
        showFloatXP(10 + G.streak * 2);
        if (!G.isTraining) st.correctTotal++;
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.answer-btn').forEach(b => { if (parseInt(b.getAttribute('data-val')) === G.correctAnswer) b.classList.add('correct'); });
        G.wrong++; G.streak = 0;
        if (G.hasTimer && G.maxTime > 0 && !G.isTraining) {
            G.timeLeft = Math.max(0, G.timeLeft - 1);
            const pct = (G.timeLeft / G.maxTime) * 100;
            document.getElementById('timerBar').style.width = pct + '%';
            const bt = document.getElementById('bigTimer'); if (bt) bt.textContent = G.timeLeft;
            document.getElementById('timerBar').classList.toggle('danger', G.timeLeft <= 10);
            bt?.classList.toggle('danger', G.timeLeft <= 10);
            if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; }
        }
        if (G.isTraining) { showFeedback('❌'); playSound('wrong'); showExplanation(); }
        else if (G.livesLeft > 0) {
            G.livesLeft--; updateHeartsDisplay();
            showFeedback('❌'); playSound('wrong'); showExplanation();
            if (G.livesLeft <= 0 && !st.dailyShieldUsed && useDailyShield()) { G.livesLeft = 1; updateHeartsDisplay(); showFeedback('🛡️ درع الحماية!'); }
            else if (G.livesLeft <= 0) { setTimeout(() => { if (!G.ended) endGame(); }, 700); return; }
        } else { showFeedback('❌'); playSound('wrong'); showExplanation(); }
        if (G.currentCatKey && st.stats[G.currentCatKey]) { st.stats[G.currentCatKey].att++; st.stats[G.currentCatKey].max += 3; }
        if (!G.isTraining) st.wrongTotal++;
    }
    document.getElementById('statScore').textContent = G.score;
    document.getElementById('streakNum').textContent = G.streak;
    document.getElementById('streakFire').style.display = G.streak >= 3 ? 'inline' : 'none';
    updateGameCoinsDisplay();
    setTimeout(() => {
        if (G.ended) return;
        if (!G.isTraining && !['speed','survival','frenzy'].includes(G.mode) && G.currentQ >= G.totalQ) endGame();
        else loadQuestion();
    }, 350);
}

function endGame() {
    if (G.ended) return;
    G.ended = true; clearGameTimer();
    if (!G.isTraining) {
        const earnedCoins = Math.floor(G.coinsEarned);
        st.correctTotal += G.correct; st.wrongTotal += G.wrong; st.coins += earnedCoins; st.totalGames++;
        st.bestStreak = Math.max(st.bestStreak, G.bestStreak);
        st.bestScore = Math.max(st.bestScore, G.score);
        const xpGained = G.score * 2 + G.correct * 5;
        st.xp += xpGained;
        while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext * 1.3); playSound('levelup'); }
        if (['classic','speed','survival','frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct; st.catCounter.total += G.correct + G.wrong; }
        if (['speed','survival','frenzy','daily'].includes(G.mode)) st.catChallenges.games++;
        updTask('game'); if (G.mode === 'daily') updTask('daily');
        const acc = G.correct + G.wrong > 0 ? Math.round((G.correct / (G.correct + G.wrong)) * 100) : 0;
        st.history.unshift({ mode: G.mode, score: G.score, correct: G.correct, acc, op: G.op });
        if (st.history.length > 10) st.history.pop();
        saveSt(); updateUI(); checkAchievements();
        if (typeof syncWithLeaderboard === 'function') syncWithLeaderboard();
        if (typeof syncUserData === 'function') syncUserData(st);
        const emj = acc >= 90 ? '🏆' : acc >= 70 ? '⭐' : acc >= 50 ? '😊' : '💪';
        const ttl = acc >= 90 ? 'ممتاز!' : acc >= 70 ? 'رائع!' : acc >= 50 ? 'جيد!' : 'حاول مجدداً!';
        document.getElementById('resultsEmoji').textContent = emj;
        document.getElementById('resultsTitle').textContent = ttl;
        document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`;
        document.getElementById('resScore').textContent = G.score;
        document.getElementById('resCorrect').textContent = G.correct;
        document.getElementById('resStreak').textContent = G.bestStreak;
        document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`;
        document.getElementById('gameOverlay').classList.remove('active');
        document.getElementById('resultsOverlay').classList.add('active');
        if (acc >= 70) doConfetti();
    } else {
        document.getElementById('gameOverlay').classList.remove('active');
        if (typeof goTab === 'function') goTab('home');
        showFeedback('🎓 انتهى التدريب');
    }
}

function startTrainingMode(op = 'mix') {
    clearGameTimer();
    Object.assign(G, { mode:'classic', op, score:0, correct:0, wrong:0, streak:0, bestStreak:0, currentQ:0, totalQ:9999, coinsEarned:0, answered:false, ended:false, isTraining:true, livesLeft:99, customTable:null, hasTimer:false, helpersUsed:{skip:false,remove:false}, askedQuestions:[] });
    document.getElementById('gameModeTitle').textContent = '🎓 تدريب';
    document.getElementById('statScore').textContent = '0';
    document.getElementById('streakNum').textContent = '0';
    document.getElementById('streakFire').style.display = 'none';
    document.getElementById('heartsStat').style.display = 'none';
    document.getElementById('helpersBar').style.display = 'none';
    const heartsStatDiv = document.getElementById('heartsStat');
    heartsStatDiv.style.display = 'flex';
    heartsStatDiv.innerHTML = `<div class="helper-btn" id="trainingTimeBtn" onclick="selectTrainingTime()" style="flex:0.7;"><div class="helper-btn-icon">⏱️</div><div class="helper-btn-label">تحديد الوقت</div></div>`;
    G.timeLeft = 30; G.maxTime = 30; G.hasTimer = true;
    document.getElementById('bigTimerWrap').style.display = 'block';
    document.getElementById('bigTimer').textContent = G.timeLeft;
    document.getElementById('timerBar').style.width = '100%';
    document.getElementById('timerBar').classList.remove('danger');
    if (G.timer) clearInterval(G.timer);
    G.timer = setInterval(() => {
        if (G.ended) { clearInterval(G.timer); return; }
        if (G.timeLeft <= 0) { clearInterval(G.timer); if (!G.ended) endGame(); }
        else {
            G.timeLeft--;
            const pct = (G.timeLeft / G.maxTime) * 100;
            document.getElementById('timerBar').style.width = pct + '%';
            document.getElementById('bigTimer').textContent = G.timeLeft;
            document.getElementById('timerBar').classList.toggle('danger', G.timeLeft <= 10);
            document.getElementById('bigTimer').classList.toggle('danger', G.timeLeft <= 10);
            if (G.timeLeft > 0 && G.timeLeft <= 6) playSound('tick');
        }
    }, 1000);
    updateGameCoinsDisplay();
    document.getElementById('resultsOverlay').classList.remove('active');
    document.getElementById('gameOverlay').classList.add('active');
    loadQuestion();
}

function selectTrainingTime() {
    showConfirm('اختر وقت التدريب', '30 ثانية أو 60 ثانية؟', '30 ثانية', '60 ثانية', (is30) => {
        G.maxTime = is30 ? 30 : 60; G.timeLeft = G.maxTime;
        document.getElementById('bigTimer').textContent = G.timeLeft;
        document.getElementById('timerBar').style.width = '100%';
        if (G.timer) clearInterval(G.timer);
        G.timer = setInterval(() => {
            if (G.ended) { clearInterval(G.timer); return; }
            if (G.timeLeft <= 0) { clearInterval(G.timer); if (!G.ended) endGame(); }
            else {
                G.timeLeft--;
                const pct = (G.timeLeft / G.maxTime) * 100;
                document.getElementById('timerBar').style.width = pct + '%';
                document.getElementById('bigTimer').textContent = G.timeLeft;
                document.getElementById('timerBar').classList.toggle('danger', G.timeLeft <= 10);
                document.getElementById('bigTimer').classList.toggle('danger', G.timeLeft <= 10);
                if (G.timeLeft > 0 && G.timeLeft <= 6) playSound('tick');
            }
        }, 1000);
    });
}

function startGameWith(mode, op, customTable = null, forceTimer = false) {
    if (typeof closeSheet === 'function') { closeSheet('modeSheet'); closeSheet('opSheet'); closeSheet('trainingOpSheet'); }
    clearGameTimer();
    st.lastMode = mode; st.lastOp = op; currentOp = op; saveSt();
    Object.assign(G, { mode, op, score:0, correct:0, wrong:0, streak:0, bestStreak:0, currentQ:0, coinsEarned:0, answered:false, ended:false, isTraining:false, customTable:customTable||null, askedQuestions:[], helpersUsed:{skip:false,remove:false} });
    let lives = 0, hasTimer = false, totalQ = 0;
    switch (mode) {
        case 'classic': totalQ = 10; hasTimer = forceTimer; lives = hasTimer ? 3 : 0; G.maxTime = hasTimer ? 60 : 0; break;
        case 'speed': totalQ = 9999; hasTimer = true; lives = 3; G.maxTime = 60; break;
        case 'survival': totalQ = 9999; hasTimer = false; lives = 0; break;
        case 'frenzy': totalQ = 9999; hasTimer = true; lives = 3; G.maxTime = 30; break;
        case 'daily': totalQ = 5; hasTimer = false; lives = 0; break;
    }
    G.totalQ = totalQ; G.hasTimer = hasTimer; G.livesLeft = lives; G.timeLeft = G.maxTime;
    document.getElementById('gameModeTitle').textContent = ({classic:'🧮 كلاسيك',speed:'⚡ سرعة 60ث',survival:'🔥 التحمّل',frenzy:'💥 اندفاع',daily:'🌟 تحدي اليوم'}[mode]||'كلاسيك');
    document.getElementById('statScore').textContent = 0;
    document.getElementById('streakNum').textContent = 0;
    document.getElementById('streakFire').style.display = 'none';
    document.getElementById('heartsStat').style.display = lives > 0 ? 'flex' : 'none';
    if (lives > 0) updateHeartsDisplay();
    document.getElementById('helpersBar').style.display = 'flex';
    document.getElementById('helperSkip').classList.remove('used');
    document.getElementById('helperRemove').classList.remove('used');
    if (hasTimer) {
        document.getElementById('bigTimerWrap').style.display = 'block';
        document.getElementById('bigTimer').textContent = G.timeLeft;
        document.getElementById('bigTimer').classList.remove('danger');
        document.getElementById('timerBar').style.width = '100%';
        document.getElementById('timerBar').classList.remove('danger');
        if (G.timer) clearInterval(G.timer);
        G.timer = setInterval(() => {
            if (G.ended) { clearInterval(G.timer); return; }
            if (G.timeLeft <= 0) { clearInterval(G.timer); if (!G.ended) endGame(); }
            else {
                G.timeLeft--;
                const pct = (G.timeLeft / G.maxTime) * 100;
                document.getElementById('timerBar').style.width = pct + '%';
                document.getElementById('bigTimer').textContent = G.timeLeft;
                document.getElementById('timerBar').classList.toggle('danger', G.timeLeft <= 10);
                document.getElementById('bigTimer').classList.toggle('danger', G.timeLeft <= 10);
                if (G.timeLeft > 0 && G.timeLeft <= 5) playSound('tick');
            }
        }, 1000);
    } else {
        document.getElementById('bigTimerWrap').style.display = 'none';
    }
    updateGameCoinsDisplay();
    document.getElementById('resultsOverlay').classList.remove('active');
    document.getElementById('gameOverlay').classList.add('active');
    loadQuestion();
}

function useHelper(type) {
    if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي مساعدات'); return; }
    if (type === 'skip') {
        if (st.coins < 3) { showFeedback('💸 تحتاج 3💰'); return; }
        if (G.helpersUsed.skip) { showFeedback('⏭️ استُخدم'); return; }
        st.coins -= 3; G.coinsEarned = Math.max(0, G.coinsEarned - 1); G.helpersUsed.skip = true;
        document.getElementById('helperSkip').classList.add('used');
        saveSt(); updateUI(); updateGameCoinsDisplay();
        if (G.hasTimer && G.maxTime > 0) {
            G.timeLeft = Math.max(0, G.timeLeft - 4);
            document.getElementById('timerBar').style.width = (G.timeLeft/G.maxTime)*100 + '%';
            document.getElementById('bigTimer').textContent = G.timeLeft;
            if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; }
        }
        showFeedback('⏭️ تخطّي!'); setTimeout(() => loadQuestion(), 300);
    } else if (type === 'remove') {
        if (st.coins < 4) { showFeedback('💸 تحتاج 4💰'); return; }
        if (G.helpersUsed.remove || G.answered) return;
        st.coins -= 4; G.helpersUsed.remove = true;
        document.getElementById('helperRemove').classList.add('used');
        saveSt(); updateUI(); updateGameCoinsDisplay();
        const wrongs = [...document.querySelectorAll('.answer-btn:not(:disabled)')].filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer);
        if (wrongs.length) { wrongs[Math.floor(Math.random()*wrongs.length)].style.opacity = '0.15'; showFeedback('🗑️ حُذفت إجابة خاطئة'); }
        else showFeedback('⚠️ لا توجد إجابات خاطئة للحذف');
    } else if (type === 'heart') {
        if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي قلوب'); return; }
        if (st.coins < 7) { showFeedback('💸 تحتاج 7💰'); return; }
        st.coins -= 7; G.livesLeft++; saveSt(); updateUI(); updateHeartsDisplay(); updateGameCoinsDisplay();
        showFeedback('💖 +1 قلب!'); playSound('levelup');
    }
}

function confirmQuit() {
    showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الصفحة الرئيسية؟\nستفقد تقدمك في هذه الجلسة.', 'نعم، عد', 'استمرار', ok => {
        if (ok) {
            clearGameTimer();
            document.getElementById('gameOverlay').classList.remove('active');
            document.getElementById('resultsOverlay').classList.remove('active');
            if (G.correct > 0 || G.wrong > 0 && !G.ended && !G.isTraining) endGame();
            else { G.ended = true; clearGameTimer(); if (typeof goTab === 'function') goTab('home'); }
        }
    });
}

function playAgain() { document.getElementById('resultsOverlay').classList.remove('active'); startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }
function goHome() { document.getElementById('resultsOverlay').classList.remove('active'); if (typeof goTab === 'function') goTab('home'); }

function updateDailyShield() {
    const today = todayStr();
    if (st.lastDailyDate !== today) {
        st.dailyStreak = (st.lastDailyDate === new Date(Date.now()-86400000).toDateString()) ? st.dailyStreak + 1 : 1;
        st.lastDailyDate = today; st.dailyShieldUsed = false; saveSt();
    }
}

function useDailyShield() {
    updateDailyShield();
    if (st.dailyShieldUsed) return false;
    st.dailyShieldUsed = true; saveSt(); return true;
}
