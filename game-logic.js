<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>هوش الماث - منصة الرياضيات الذكية</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }
        :root {
            --gold: #f0b90b;
            --purple: #7c3aed;
            --cyan: #06b6d4;
            --dark-bg: #0f172a;
            --card-bg: #1e293b;
            --text-light: #f8fafc;
            --text-dim: #94a3b8;
            --danger: #ef4444;
            --success: #10b981;
        }
        body {
            font-family: 'Segoe UI', 'Tahoma', system-ui, sans-serif;
            background: var(--dark-bg);
            color: var(--text-light);
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            min-height: 100vh;
        }
        body.light-mode {
            --dark-bg: #f1f5f9;
            --card-bg: #ffffff;
            --text-light: #0f172a;
            --text-dim: #475569;
        }
        /* أنماط أساسية */
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 12px;
        }
        .page {
            display: none;
            animation: fade 0.2s ease;
        }
        .page.active {
            display: block;
        }
        @keyframes fade {
            from { opacity: 0; transform: translateY(8px);}
            to { opacity: 1; transform: translateY(0);}
        }
        /* البطاقات والأزرار */
        .card {
            background: var(--card-bg);
            border-radius: 28px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.05);
        }
        .flex-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }
        .gold-text {
            color: var(--gold);
        }
        .btn {
            background: var(--purple);
            border: none;
            padding: 10px 18px;
            border-radius: 40px;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn:active { transform: scale(0.96); }
        .mode-card {
            background: var(--card-bg);
            border-radius: 24px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.1);
            transition: 0.1s;
        }
        .mode-card:active { background: #2d3a5e; }
        .mode-card-icon { font-size: 2rem; min-width: 48px; text-align: center; }
        .mode-card-name { font-weight: bold; font-size: 1.1rem; }
        .mode-card-desc { font-size: 0.7rem; color: var(--text-dim); }
        .answer-grid {
            display: grid;
            grid-template-columns: repeat(2,1fr);
            gap: 12px;
            margin-top: 20px;
        }
        .answer-btn {
            background: var(--card-bg);
            border: 1px solid var(--purple);
            padding: 16px;
            border-radius: 60px;
            font-size: 1.4rem;
            font-weight: bold;
            color: var(--text-light);
            transition: 0.05s linear;
            cursor: pointer;
            text-align: center;
        }
        .answer-btn.correct { background: var(--success); border-color: var(--success); color: white; }
        .answer-btn.wrong { background: var(--danger); border-color: var(--danger); color: white; text-decoration: line-through; }
        .timer-bar {
            height: 8px;
            background: var(--purple);
            width: 100%;
            border-radius: 10px;
            transition: width 0.2s linear;
        }
        .big-timer {
            font-size: 2.8rem;
            font-weight: bold;
            text-align: center;
            font-family: monospace;
            letter-spacing: 4px;
        }
        .heart-icon { font-size: 1.4rem; margin: 0 2px; }
        .heart-icon.lost { opacity: 0.3; filter: grayscale(1); }
        .confetti-piece {
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            animation: fall 2s linear forwards;
        }
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(6px);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        .overlay.active { display: flex; }
        .overlay-card {
            background: var(--card-bg);
            width: 90%;
            max-width: 400px;
            border-radius: 40px;
            padding: 24px;
            text-align: center;
        }
        .nav-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--card-bg);
            display: flex;
            justify-content: space-around;
            padding: 10px 12px;
            border-top: 1px solid rgba(255,255,255,0.1);
            z-index: 100;
        }
        .nav-item {
            text-align: center;
            font-size: 1.2rem;
            padding: 6px 12px;
            border-radius: 40px;
            cursor: pointer;
            opacity: 0.6;
        }
        .nav-item.active {
            opacity: 1;
            background: var(--purple);
        }
        .task-item {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.05);
            padding: 8px;
            border-radius: 24px;
            margin-bottom: 6px;
        }
        .task-item.done { opacity: 0.7; background: var(--success); }
        .law-card {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 12px;
            margin-bottom: 8px;
        }
        .particle {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            opacity: 0.4;
            animation: floatParticle linear infinite;
        }
        @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0.3; }
            100% { transform: translateY(-200px) translateX(20px); opacity: 0; }
        }
        @keyframes floatSymbol {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-30px) rotate(10deg); }
        }
        .explanation-box {
            background: #2d2f3e;
            padding: 12px;
            border-radius: 20px;
            margin-top: 12px;
            font-size: 0.8rem;
        }
        @media (max-width: 480px) {
            .answer-btn { padding: 12px; font-size: 1.2rem; }
            .mode-card-icon { font-size: 1.4rem; }
        }
    </style>
</head>
<body>
<div id="particles" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;"></div>
<div id="splashSymbols" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;"></div>

<div class="container" style="position:relative;z-index:2;">
    <!-- الصفحات -->
    <div id="page-home" class="page active">
        <div class="flex-row" style="justify-content:space-between;">
            <div><span id="profileAvatar">👦</span> <strong id="profileName">Player</strong></div>
            <div>💰 <span id="homeCoins">10</span> &nbsp; ⭐ Lv.<span id="homeLevel">1</span></div>
        </div>
        <div class="card" style="text-align:center;">
            <div style="font-size:2rem;">🧠 هوش الماث</div>
            <div>🧮 تدرب على القوانين والتحديات</div>
            <div class="flex-row" style="justify-content:center;margin-top:12px;">
                <button class="btn" onclick="openModeSheet('classic')">🎮 العب</button>
                <button class="btn" onclick="openTrainingOpSheet()">🎓 تدريب</button>
                <button class="btn" onclick="openLaws()">📖 قوانين</button>
            </div>
        </div>
        <div class="card">
            <div class="flex-row"><span>📊 إحصائيات اليوم</span><span id="dailyStreakBadge">🔥 الأسبوع:0</span></div>
            <div class="flex-row"><span>✅ صحيح: <span id="homeCorrect">0</span></span><span>❌ خاطئ: <span id="homeWrong">0</span></span><span>🏆 أفضل: <span id="homeBest">0</span></span></div>
            <div class="flex-row"><span>💰 العملات: <span id="homeCoins2">10</span></span><span>🔥 أطول تتابع: <span id="homeStreak">0</span></span></div>
        </div>
        <div class="card">
            <div class="flex-row"><span>📋 آخر جلسات</span><span onclick="goTab('profile')" style="color:var(--gold);">كل التفاصيل ➜</span></div>
            <div id="historyList" style="font-size:0.8rem;">لا توجد جلسات بعد</div>
        </div>
        <div class="card">
            <canvas id="weeklyChart" width="500" height="120" style="width:100%;height:auto;background:#0002;border-radius:20px;"></canvas>
        </div>
    </div>

    <div id="page-play" class="page">صفحة اللعب تظهر تلقائياً عند البدء</div>
    <div id="page-achieve" class="page">
        <div class="card"><div class="flex-row"><span>🏆 الإنجازات</span><span id="achievePct">0/0</span></div><div id="achieveList"></div><div id="achieveCompleteReward" style="display:none;" class="btn">🎁 مكافأة كاملة +5 عملات</div></div>
        <div class="card"><div class="flex-row"><span>📋 المهام اليومية</span><span>⭐ <span id="tasksDone">0</span>/<span id="tasksTotal">0</span> • 🪙<span id="tasksCoins">0</span></span></div><div id="tasksList"></div><div class="progress-bar"><div id="tasksBarFill" style="width:0%;height:6px;background:var(--gold);border-radius:4px;"></div></div><div class="flex-row"><span>اكتمال: <span id="tasksPct">0%</span></span><span>🔄 يتجدد: <span id="dailyCountdown">--:--:--</span></span></div></div>
    </div>
    <div id="page-profile" class="page">
        <div class="card">
            <div class="flex-row"><span>🧑‍🎓 الملف الشخصي</span><button class="btn" onclick="showRestoreAccount()">🔄 استعادة حساب</button></div>
            <div id="restorePanel" style="display:none; margin-top:10px;"><input type="text" id="restoreSerialInput" placeholder="الرقم التسلسلي"><button class="btn" onclick="restoreAccount()">استعادة</button></div>
            <div>🆔 الرقم التسلسلي: <span id="serialNumberDisplay">غير محدد</span> <button class="btn" onclick="copySerialNumber()">📋 نسخ</button></div>
            <div class="flex-row"><span>⭐ المستوى <span id="profileLevel">1</span></span><span>💰 <span id="profileCoins">10</span></span><span>🎯 XP: <span id="profileXp">0</span>/<span id="profileXpNext">1000</span></span></div>
            <div><input type="text" id="profileNameInput" placeholder="الاسم"><button class="btn" onclick="saveProfile()">حفظ</button></div>
            <div><input type="date" id="profileBirth" value="2000-01-01"><button class="btn" onclick="updateAge()">تحديث العمر</button></div>
            <div class="flex-row">
                <span>👦 <button onclick="changeAvatar('👦')">👦</button> 👧 <button onclick="changeAvatar('👧')">👧</button> 🧑‍🏫 <button onclick="changeAvatar('🧑‍🏫')">🧑‍🏫</button></span>
                <button class="btn" onclick="toggleDarkMode()">🌙 الوضع الليلي</button>
            </div>
        </div>
        <div class="card"><div class="flex-row"><span>📈 الإحصائيات الكلية</span><span id="profileTaskStatus">0 / 0 ›</span></div><div>✅ صحيح: <span id="statTotalCorrect">0</span> &nbsp; ❌ خاطئ: <span id="statTotalWrong">0</span></div><div>🔥 أطول تتابع: <span id="statBestStreak">0</span> &nbsp; 🏆 أفضل نقاط: <span id="statBestScore">0</span></div><div>🏃 ماراثون: <span id="statMarathon">0</span> &nbsp; 🏆 تنافسي: <span id="statCompetitive">0</span></div><div>⏱️ وقت اللعب: <span id="sessionTimerDisplay">00:00:00</span></div><div>⭐ تقدم الفئات: <span id="categoryStars"></span></div><button class="btn" onclick="confirmResetComplete(false)">⚠️ إعادة تعيين كاملة</button></div>
    </div>
    <div id="page-leaderboard" class="page"><div class="card"><div id="leaderboardList" style="text-align:center;">قائمة المتصدرين ستظهر بعد أول لعبة</div></div></div>
</div>

<div class="nav-bar">
    <div class="nav-item" id="nav-home" onclick="goTab('home')">🏠</div>
    <div class="nav-item" id="nav-play" onclick="openModeSheet('classic')">🎮</div>
    <div class="nav-item" id="nav-achieve" onclick="goTab('achieve')">🏆</div>
    <div class="nav-item" id="nav-profile" onclick="goTab('profile')">👤</div>
    <div class="nav-item" id="nav-leaderboard" onclick="goTab('leaderboard')">📊</div>
</div>

<!-- Overlays -->
<div id="gameOverlay" class="overlay"><div class="overlay-card" style="width:95%;max-width:500px;"><div id="gameModeTitle" style="font-size:1.4rem;">كلاسيك</div><div id="statQ" style="font-size:0.8rem;">السؤال 1/10</div><div id="questionNumber"></div><div id="questionText" style="font-size:2rem;margin:15px 0;">5 + 3 = ?</div><div id="questionHint" style="font-size:0.8rem;"></div><div id="answersGrid" class="answer-grid"></div><div id="bigTimerWrap" style="display:none;"><div class="timer-bar" id="timerBar"></div><div id="bigTimer" class="big-timer">00</div></div><div class="flex-row" style="margin-top:12px;"><span>🎯 النقاط: <span id="statScore">0</span></span><span>🔥 <span id="streakNum">0</span><span id="streakFire" style="display:none;">🔥</span></span></div><div id="heartsStat" class="flex-row"><div id="heartsRow"></div><div class="helper-btn" onclick="useHelper('heart')">❤️+1 (7💰)</div></div><div id="helpersBar" class="flex-row"><div class="helper-btn" id="helperSkip" onclick="useHelper('skip')">⏭️ تخطي (3💰)</div><div class="helper-btn" id="helperRemove" onclick="useHelper('remove')">🗑️ حذف (4💰)</div></div><div id="xpCoinBar" class="flex-row"><span>✨ XP: <span id="gameXp">0</span></span><span>💰 <span id="gameCoin">0</span></span></div><div id="explanationArea"></div><div class="flex-row" style="margin-top:12px;"><button class="btn" onclick="confirmQuit()">🚪 خروج</button><button id="competitiveEndBtn" style="display:none;" class="btn" onclick="endCompetitiveChallenge()">🏁 إنهاء التحدي</button></div></div></div>
<div id="resultsOverlay" class="overlay"><div class="overlay-card"><div id="resultsEmoji" style="font-size:3rem;">🏆</div><div id="resultsTitle" style="font-size:1.6rem;">ممتاز!</div><div id="resultsSub"></div><div>🎯 النقاط: <span id="resScore">0</span></div><div>✅ الإجابات الصحيحة: <span id="resCorrect">0</span></div><div>🔥 أفضل تتابع: <span id="resStreak">0</span></div><div id="resultsXP"></div><div class="flex-row"><button class="btn" onclick="playAgain()">🔄 لعب مرة أخرى</button><button class="btn" onclick="goHome()">🏠 الرئيسية</button><button class="btn" onclick="shareChallenge()">📤 مشاركة</button></div></div></div>
<div id="trainingEndOverlay" class="overlay"><div class="overlay-card"><div>🏁 انتهى التدريب</div><div>⭐ النتيجة: <span id="trainResScore">0</span></div><div>✅ صحيح: <span id="trainResCorrect">0</span></div><div>🔥 التتابع: <span id="trainResStreak">0</span></div><div id="trainingEndSub"></div><div class="flex-row"><button class="btn" onclick="retrain()">🔄 تدريب مجدد</button><button class="btn" onclick="changeTrainingTime()">⏱️ تغيير الوقت</button><button class="btn" onclick="closeTrainingEnd()">🏠 الرئيسية</button></div></div></div>
<div id="modeSheet" class="overlay" onclick="sheetBg(event,'modeSheet')"><div class="overlay-card"><div class="flex-row"><span>اختر وضع اللعب</span><span onclick="closeSheet('modeSheet')" style="font-size:1.5rem;">✖️</span></div><div id="modeGrid"><div class="mode-card" onclick="startGameWith('classic','mix',null,true)"><span class="mode-card-icon">🎲</span><div><div class="mode-card-name">كلاسيك</div><div class="mode-card-desc">10 أسئلة + قلوب</div></div></div><div class="mode-card" onclick="openGameMode('speed')"><span class="mode-card-icon">⚡</span><div><div class="mode-card-name">سرعة</div><div class="mode-card-desc">60 ثانية + إضافات</div></div></div><div class="mode-card" onclick="openGameMode('survival')"><span class="mode-card-icon">🔥</span><div><div class="mode-card-name">تحمّل</div><div class="mode-card-desc">3 أخطاء فقط</div></div></div><div class="mode-card" onclick="openGameMode('frenzy')"><span class="mode-card-icon">💥</span><div><div class="mode-card-name">اندفاع</div><div class="mode-card-desc">30 ثانية سريعة</div></div></div><div class="mode-card" onclick="startGameWith('marathon','mix',null,false)"><span class="mode-card-icon">🏃</span><div><div class="mode-card-name">ماراثون</div><div class="mode-card-desc">20 سؤال بدون وقت</div></div></div><div class="mode-card" onclick="startGameWith('competitive','mix',null,false)"><span class="mode-card-icon">🏆</span><div><div class="mode-card-name">تنافسي</div><div class="mode-card-desc">صعوبة ديناميكية</div></div></div><div class="mode-card" onclick="openCounterGame()"><span class="mode-card-icon">🧮</span><div><div class="mode-card-name">عمليات على الأعداد</div><div class="mode-card-desc">جمع، طرح، ضرب، قسمة، جدول</div></div></div><div class="mode-card" onclick="openOpSheet('challenge')"><span class="mode-card-icon">⚡</span><div><div class="mode-card-name">تحديات</div><div class="mode-card-desc">سرعة، تحمّل، اندفاع، اليوم</div></div></div></div></div></div>
<div id="opSheet" class="overlay" onclick="sheetBg(event,'opSheet')"><div class="overlay-card"><div class="flex-row"><span id="opSheetTitle">اختر العملية</span><span onclick="closeSheet('opSheet')" style="font-size:1.5rem;">✖️</span></div><div id="opModeGrid"></div></div></div>
<div id="trainingOpSheet" class="overlay" onclick="sheetBg(event,'trainingOpSheet')"><div class="overlay-card"><div class="flex-row"><span>🎓 تدريب: اختر العملية</span><span onclick="closeSheet('trainingOpSheet')">✖️</span></div><div id="trainingOpGrid"></div></div></div>
<div id="lawsOverlay" class="overlay" onclick="closeLaws()"><div class="overlay-card" style="max-width:500px;max-height:80vh;overflow:auto;"><div class="flex-row"><span>📚 الموسوعة الرياضية</span><span onclick="closeLaws()">✖️</span></div><div id="lawsContent"></div></div></div>
<div id="confirmOverlay" class="overlay"><div class="overlay-card"><div id="confirmTitle">تأكيد</div><div id="confirmMsg">هل أنت متأكد؟</div><div class="flex-row"><button id="confirmBtnYes" class="btn">نعم</button><button id="confirmBtnNo" class="btn">إلغاء</button></div></div></div>
<div id="feedbackToast" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#000c;backdrop-filter:blur(8px);padding:8px 20px;border-radius:40px;z-index:2000;transition:0.2s;opacity:0;pointer-events:none;"></div>

<script>
// -------------------- الكود الرئيسي المُصحح --------------------
(function() {
    // تعريف st مع جميع الدوال المساعدة
    const SK = 'ho_math_v9';
    function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
    function formatDate(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
    function defState() { return { name: 'Player', age: 0, birthDate: '2000-01-01', gender: 'm', avatar: '👦', xp: 0, xpToNext: 1000, level: 1, coins: 10, correctTotal: 0, wrongTotal: 0, bestStreak: 0, totalGames: 0, bestScore: 0, difficulty: 'easy', lastMode: 'classic', lastOp: 'mix', soundOn: true, bgOn: true, stats: {}, history: [], catCounter: { correct: 0, total: 0 }, catChallenges: { games: 0 }, dailyTasks: genDailyTasks(), dailyDate: todayStr(), tGold: '#f0b90b', tAccent: '#7c3aed', tAccent2: '#06b6d4', sessionTimeSecs: 0, sessionDate: todayStr(), ownedEmojis: ['👦'], hearts: 3, dailyStreak: 0, lastDailyDate: null, dailyShieldUsed: false, lastShieldDate: null, achievementsUnlocked: [], achievementRewardClaimed: false, serialNumber: '', darkMode: true, customColor: '#f0b90b', lastLoginDate: null, weeklyStats: {}, marathonBest: 0, competitiveBest: 0 }; }
    function genDailyTasks() { return [ { id: 't1', icon: '🎯', name: 'أول إجابة', desc: 'أجب على سؤال واحد صحيح', reward: 1, goal: 1, progress: 0, done: false }, { id: 't2', icon: '🔥', name: 'تتابع ×3', desc: '3 إجابات صحيحة متتالية', reward: 3, goal: 3, progress: 0, done: false }, { id: 't3', icon: '⚡', name: '10 إجابات صحيحة', desc: 'أجب على 10 أسئلة صحيحة', reward: 5, goal: 10, progress: 0, done: false }, { id: 't4', icon: '🏃', name: 'جلستان كاملتان', desc: 'أنهِ جلستَي لعب كاملتَين', reward: 4, goal: 2, progress: 0, done: false }, { id: 't5', icon: '💎', name: '25 إجابة', desc: 'أجب على 25 سؤالاً صحيحاً', reward: 8, goal: 25, progress: 0, done: false }, { id: 't6', icon: '🌟', name: 'تحدي اليوم', desc: 'العب تحدي اليوم الخاص مرة', reward: 2, goal: 1, progress: 0, done: false } ]; }
    function sanitizeState(s) { if (typeof s.coins !== 'number' || s.coins < 0) s.coins = 0; if (typeof s.level !== 'number' || s.level < 1) s.level = 1; if (typeof s.xp !== 'number' || s.xp < 0) s.xp = 0; if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000; if (!s.ownedEmojis || !Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦']; if (!s.stats || typeof s.stats !== 'object') s.stats = {}; if (!s.history) s.history = []; if (!s.catCounter) s.catCounter = { correct: 0, total: 0 }; if (!s.catChallenges) s.catChallenges = { games: 0 }; if (!s.achievementsUnlocked) s.achievementsUnlocked = []; if (s.achievementRewardClaimed === undefined) s.achievementRewardClaimed = false; if (!s.birthDate) s.birthDate = '2000-01-01'; if (typeof s.age !== 'number') s.age = 0; if (s.darkMode === undefined) s.darkMode = true; if (!s.customColor) s.customColor = '#f0b90b'; if (!s.weeklyStats) s.weeklyStats = {}; if (typeof s.marathonBest !== 'number') s.marathonBest = 0; if (typeof s.competitiveBest !== 'number') s.competitiveBest = 0; return s; }
    function loadSt() { try { const s = JSON.parse(localStorage.getItem(SK)); if (s && s.name !== undefined) return sanitizeState(s); } catch(e) {} return defState(); }
    function saveSt() { try { localStorage.setItem(SK, JSON.stringify(st)); if(st.serialNumber) saveSerialBackup(st.serialNumber, st); } catch(e) {} }
    function saveSerialBackup(serial, data) { try { localStorage.setItem(`ho_math_backup_${serial}`, JSON.stringify(data)); } catch(e) {} }
    function loadSerialBackup(serial) { try { const d = localStorage.getItem(`ho_math_backup_${serial}`); if(d) return JSON.parse(d); } catch(e) {} return null; }
    function generateSerialNumber(birthDate, name) { const nameEng = (name || 'User').replace(/[^a-zA-Z0-9]/g, '').slice(0,4).toUpperCase(); const cleanDate = birthDate.replace(/-/g,''); const randomPart = Math.floor(Math.random()*10000).toString().padStart(4,'0'); const count = parseInt(localStorage.getItem('ho_math_user_count')||'0')+1; localStorage.setItem('ho_math_user_count',count); return `${cleanDate}-${nameEng}-${randomPart}-${count}`; }
    function updateSerialNumberDisplay() { const el = document.getElementById('serialNumberDisplay'); if(el) el.textContent = st.serialNumber || 'غير محدد (احفظ الملف الشخصي أولاً)'; }
    function copySerialNumber() { if(!st.serialNumber) { showFeedback('لا يوجد رقم تسلسلي بعد، قم بحفظ الملف الشخصي أولاً'); return; } navigator.clipboard.writeText(st.serialNumber); showFeedback('📋 تم نسخ الرقم التسلسلي'); }
    function showRestoreAccount() { const panel = document.getElementById('restorePanel'); if(panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; }
    function restoreAccount() { const serial = document.getElementById('restoreSerialInput').value.trim(); if(!serial) { showFeedback('الرجاء إدخال الرقم التسلسلي'); return; } const savedData = loadSerialBackup(serial); if(!savedData) { showFeedback('⚠️ لم يتم العثور على حساب بهذا الرقم'); return; } Object.assign(st, sanitizeState(savedData)); saveSt(); updateUI(); loadProfileForm(); applyDarkMode(); showFeedback('✅ تم استعادة الحساب بنجاح'); document.getElementById('restorePanel').style.display = 'none'; document.getElementById('restoreSerialInput').value = ''; }
    let st = loadSt();
    let currentOp = st.lastOp || 'mix';
    
    // ---------- تعريف الدوال المفقودة ----------
    function syncLeaderboard(name, avatar, level, score) { /* لا حاجة فعلية */ }
    function loadLeaderboard() { const el = document.getElementById('leaderboardList'); if(el) el.innerHTML = '🏆 قائمة المتصدرين ستظهر بعد أول لعبة'; }
    function updateHomeStats() { document.getElementById('homeCorrect').innerText = st.correctTotal; document.getElementById('homeWrong').innerText = st.wrongTotal; document.getElementById('homeBest').innerText = st.bestScore; document.getElementById('homeCoins').innerText = st.coins; document.getElementById('homeCoins2').innerText = st.coins; document.getElementById('homeLevel').innerText = st.level; document.getElementById('homeStreak').innerText = st.bestStreak; document.getElementById('profileName').innerText = st.name; document.getElementById('profileAvatar').innerText = st.avatar; document.getElementById('dailyStreakBadge').innerText = `🔥 الأسبوع:${st.dailyStreak}`; }
    function renderHistory() { const hist = st.history.slice(0,5); const container = document.getElementById('historyList'); if(!container) return; if(hist.length===0) { container.innerHTML = 'لا توجد جلسات بعد'; return; } container.innerHTML = hist.map(h => `<div>🎮 ${h.mode} | ✅ ${h.correct} | 🎯 ${h.score} | دقة ${h.acc}%</div>`).join(''); }
    function loadProfileForm() { document.getElementById('profileNameInput').value = st.name; document.getElementById('profileBirth').value = st.birthDate; document.getElementById('profileLevel').innerText = st.level; document.getElementById('profileCoins').innerText = st.coins; document.getElementById('profileXp').innerText = st.xp; document.getElementById('profileXpNext').innerText = st.xpToNext; document.getElementById('statTotalCorrect').innerText = st.correctTotal; document.getElementById('statTotalWrong').innerText = st.wrongTotal; document.getElementById('statBestStreak').innerText = st.bestStreak; document.getElementById('statBestScore').innerText = st.bestScore; document.getElementById('statMarathon').innerText = st.marathonBest; document.getElementById('statCompetitive').innerText = st.competitiveBest; let catHtml = ''; for(let k in st.stats) { catHtml += `<span>${k}:✨${st.stats[k].stars||0}</span> `; } document.getElementById('categoryStars').innerHTML = catHtml || 'لا توجد بيانات'; updateHomeStats(); }
    function applyDarkMode() { if(st.darkMode) document.body.classList.remove('light-mode'); else document.body.classList.add('light-mode'); }
    function toggleDarkMode() { st.darkMode = !st.darkMode; saveSt(); applyDarkMode(); showFeedback(st.darkMode ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري'); }
    function changeAvatar(emoji) { st.avatar = emoji; if(!st.ownedEmojis.includes(emoji)) st.ownedEmojis.push(emoji); saveSt(); updateUI(); loadProfileForm(); showFeedback(`تم تغيير الصورة إلى ${emoji}`); }
    function saveProfile() { const newName = document.getElementById('profileNameInput').value.trim(); if(newName) st.name = newName; saveSt(); updateUI(); loadProfileForm(); showFeedback('تم حفظ الملف الشخصي'); }
    function updateAge() { const birth = document.getElementById('profileBirth').value; if(birth) { st.birthDate = birth; const today = new Date(); const birthDate = new Date(birth); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--; st.age = age; saveSt(); showFeedback(`العمر: ${age} سنة`); if(!st.serialNumber) { st.serialNumber = generateSerialNumber(st.birthDate, st.name); saveSt(); updateSerialNumberDisplay(); showFeedback(`تم إنشاء رقم تسلسلي: ${st.serialNumber}`); } } }
    function updateUI() { updateHomeStats(); renderTasks(); renderAchievements(); updateSerialNumberDisplay(); loadProfileForm(); updateBadgeIcon(); drawWeeklyChart(); }
    // دوال الإنجازات والمهام
    const ACHIEVEMENTS_DEF = [ { id: 'first_correct', icon: '🎯', name: 'أول إجابة صحيحة', desc: 'أجب على سؤال واحد صحيح', check: () => st.correctTotal >= 1, reward: 2 }, { id: 'ten_correct', icon: '🔟', name: '10 إجابات', desc: 'أجب على 10 أسئلة صحيحة', check: () => st.correctTotal >= 10, reward: 3 }, { id: 'fifty_correct', icon: '💯', name: '50 إجابة', desc: 'أجب على 50 سؤالاً صحيحاً', check: () => st.correctTotal >= 50, reward: 5 }, { id: 'combo5', icon: '🔥', name: 'تتابع ×5', desc: 'حقّق تتابع 5 إجابات صحيحة', check: () => st.bestStreak >= 5, reward: 4 }, { id: 'combo10', icon: '💥', name: 'تتابع ×10', desc: 'حقّق تتابع 10 إجابات صحيحة', check: () => st.bestStreak >= 10, reward: 8 }, { id: 'speed10', icon: '⚡', name: 'سرعة 10 نقاط', desc: 'سجّل 10 نقاط في وضع السرعة', check: () => st.bestScore >= 10, reward: 3 }, { id: 'speed25', icon: '🚀', name: 'سرعة 25 نقطة', desc: 'سجّل 25 نقطة في وضع السرعة', check: () => st.bestScore >= 25, reward: 6 }, { id: 'level5', icon: '⬆️', name: 'المستوى 5', desc: 'وصل إلى المستوى 5', check: () => st.level >= 5, reward: 10 }, { id: 'level20', icon: '👑', name: 'المستوى 20', desc: 'وصل إلى المستوى 20', check: () => st.level >= 20, reward: 20 }, { id: 'all_basic_stars', icon: '🌟', name: 'أستاذ الأساسيات', desc: '15 نجمة في كل من الجمع والطرح والضرب والقسمة والجدول', check: () => ['addition','subtraction','multiplication','division','table'].every(k => (st.stats[k]?.stars || 0) >= 15), reward: 10 }, { id: 'perfect_10', icon: '✨', name: 'مثالي ×10', desc: '10 مرات مثالية (3 نجوم)', check: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10, reward: 8 }, { id: 'coins100', icon: '💰', name: 'مئة عملة', desc: 'اجمع 100 عملة', check: () => st.coins >= 100, reward: 0 }, { id: 'play1h', icon: '⏱️', name: 'ساعة لعب', desc: 'ساعة كاملة من وقت اللعب', check: () => getSessionSecs() >= 3600, reward: 12 }, { id: 'hard_unlock', icon: '🔓', name: 'فتح الصعب', desc: 'وصل للمستوى المطلوب لفتح الصعب', check: () => st.level >= 5, reward: 5 }, { id: 'five_perfect', icon: '🏅', name: '5 فئات مثالية', desc: '5 فئات حصلت على تقييم مثالي', check: () => Object.values(st.stats).filter(s => (s.stars || 0) >= 15).length >= 5, reward: 15 }, { id: 'young_math', icon: '🧒', name: 'رياضي صغير', desc: 'عمرك أقل من 12 وأجبت 20 صحيحة', check: () => st.age && st.age < 12 && st.correctTotal >= 20, reward: 10 }, { id: 'algebra_master', icon: '📐', name: 'أستاذ الجبر', desc: 'عمرك 18+ وأجبت 20 في الجبر', check: () => st.age && st.age >= 18 && (st.stats['algebra']?.cor || 0) >= 20, reward: 15 }, { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة', check: () => st.age && st.age >= 60 && st.correctTotal >= 30, reward: 20 }, { id: 'marathon_master', icon: '🏃', name: 'بطل الماراثون', desc: '20 سؤال صحيح في الماراثون', check: () => st.marathonBest >= 20, reward: 15 } ];
    function checkAchievements() { let newUnlocks = []; ACHIEVEMENTS_DEF.forEach(a => { if (!st.achievementsUnlocked.includes(a.id) && a.check()) { st.achievementsUnlocked.push(a.id); if (a.reward > 0) st.coins += a.reward; newUnlocks.push(a.name); } }); if (newUnlocks.length) { saveSt(); showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`); playSound('achievement'); updateUI(); } if (st.achievementsUnlocked.length === ACHIEVEMENTS_DEF.length && !st.achievementRewardClaimed) { st.achievementRewardClaimed = true; st.coins += 5; saveSt(); showFeedback('🎉 جميع الإنجازات! +5 عملات إضافية'); playSound('achievement'); updateUI(); } }
    function renderAchievements() { const el = document.getElementById('achieveList'); if (!el) return; const total = ACHIEVEMENTS_DEF.length; const doneCount = st.achievementsUnlocked.length; document.getElementById('achievePct').textContent = `${doneCount}/${total}`; el.innerHTML = ACHIEVEMENTS_DEF.map(a => { let done = st.achievementsUnlocked.includes(a.id) || a.check(); return `<div class="task-item ${done?'done':''}"><div class="task-item-icon">${a.icon}</div><div class="task-item-info"><div class="task-item-name">${a.name}</div><div class="task-item-desc">${a.desc}</div></div><div class="task-right"><div class="task-reward">${done?'✅':`+${a.reward}💰`}</div></div></div>`; }).join(''); const rewardDiv = document.getElementById('achieveCompleteReward'); if (rewardDiv) rewardDiv.style.display = doneCount === total ? 'block' : 'none'; }
    const BADGES = { speed30: { icon: '⚡', cond: () => st.bestScore >= 30 }, perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10 }, level10: { icon: '🔷', cond: () => st.level >= 10 }, allBasic: { icon: '🏅', cond: () => ['addition','subtraction','multiplication','division','table'].every(k => (st.stats[k]?.stars || 0) >= 15) } };
    function updateBadgeIcon() { const el = document.getElementById('badgeDisplay'); if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join(''); }
    function checkDailyReset() { if (st.dailyDate !== todayStr()) { st.dailyTasks = genDailyTasks(); st.dailyDate = todayStr(); saveSt(); } updateDailyShield(); checkDailyLoginReward(); }
    function updateDailyShield() { const today = todayStr(); if (st.lastDailyDate !== today) { const yesterday = new Date(Date.now() - 86400000); const yesterdayStr = formatDate(yesterday); st.dailyStreak = (st.lastDailyDate === yesterdayStr) ? st.dailyStreak + 1 : 1; st.lastDailyDate = today; st.dailyShieldUsed = false; saveSt(); } }
    function checkDailyLoginReward() { const today = todayStr(); if (st.lastLoginDate !== today) { st.lastLoginDate = today; st.coins += 2; saveSt(); updateUI(); showFeedback('🎁 مكافأة تسجيل الدخول: +2 💰'); } }
    function updTask(type, amount = 1) { checkDailyReset(); const T = st.dailyTasks; let changed = false; if (type === 'correct') { ['t1','t3','t5'].forEach(id => { const t = T.find(x => x.id === id); if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + amount); if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; } } }); } if (type === 'streak' && amount >= 3) { const t = T.find(x => x.id === 't2'); if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; } } if (type === 'game') { const t = T.find(x => x.id === 't4'); if (t && !t.done) { t.progress = Math.min(t.goal, t.progress + 1); if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; } } } if (type === 'daily') { const t = T.find(x => x.id === 't6'); if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; } } if (changed) playSound('levelup'); saveSt(); renderTasks(); }
    function renderTasksFiltered() { const level = st.level; const tasksData = st.dailyTasks; let filtered = tasksData; if (level < 2) filtered = tasksData.filter(t => ['t1','t2'].includes(t.id)); else if (level < 4) filtered = tasksData.filter(t => ['t1','t2','t3'].includes(t.id)); else if (level < 5) filtered = tasksData.filter(t => ['t1','t2','t3','t4'].includes(t.id)); else filtered = tasksData; const doneCount = filtered.filter(t => t.done).length; const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0; const totalR = filtered.filter(t => t.done).reduce((s, t) => s + t.reward, 0); const tasksContainer = document.getElementById('tasksList'); if (tasksContainer) { tasksContainer.innerHTML = filtered.map(t => { const p = Math.min(100, Math.round((t.progress / t.goal) * 100)); return `<div class="task-item ${t.done?'done':''}"><div class="task-item-icon">${t.icon}</div><div class="task-item-info"><div class="task-item-name">${t.name}</div><div class="task-item-desc">${t.desc}</div><div class="task-prog-bar"><div class="task-prog-fill" style="width:${p}%"></div></div></div><div class="task-right"><div class="task-reward">${t.done?'✅':`+${t.reward}💰`}</div>${t.done?'':`<div class="task-prog-txt">${t.progress}/${t.goal}</div>`}</div></div>`; }).join(''); } document.getElementById('tasksDone').textContent = doneCount; document.getElementById('tasksTotal').textContent = filtered.length; document.getElementById('tasksCoins').textContent = totalR + '💰'; document.getElementById('tasksPct').textContent = pct + '%'; document.getElementById('tasksBarFill').style.width = pct + '%'; document.getElementById('profileTaskStatus').textContent = `${doneCount} / ${filtered.length} ›`; }
    let renderTasks = renderTasksFiltered;
    function updCountdown() { const now = new Date(), midnight = new Date(now); midnight.setHours(24,0,0,0); const d = midnight - now; const h = String(Math.floor(d / 3600000)).padStart(2, '0'); const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'); const s = String(Math.floor((d % 60000) / 1000)).padStart(2, '0'); const el = document.getElementById('dailyCountdown'); if (el) el.textContent = `${h}:${m}:${s}`; }
    setInterval(updCountdown, 1000);
    let sessionStart = Date.now();
    function getSessionSecs() { if (st.sessionDate !== todayStr()) { st.sessionTimeSecs = 0; st.sessionDate = todayStr(); saveSt(); } return st.sessionTimeSecs + Math.floor((Date.now() - sessionStart) / 1000); }
    function fmtTime(s) { const h = String(Math.floor(s / 3600)).padStart(2, '0'); const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0'); const sc = String(s % 60).padStart(2, '0'); return `${h}:${m}:${sc}`; }
    function updSessionTimer() { const el = document.getElementById('sessionTimerDisplay'); if (el) el.textContent = fmtTime(getSessionSecs()); }
    setInterval(updSessionTimer, 1000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { st.sessionTimeSecs = getSessionSecs(); st.sessionDate = todayStr(); saveSt(); sessionStart = Date.now(); } });
    function showConfirm(title, msg, yesText, noText, cb) { document.getElementById('confirmTitle').textContent = title; document.getElementById('confirmMsg').textContent = msg; document.getElementById('confirmBtnYes').textContent = yesText || 'نعم'; document.getElementById('confirmBtnNo').textContent = noText || 'إلغاء'; const ov = document.getElementById('confirmOverlay'); ov.classList.add('active'); document.getElementById('confirmBtnYes').onclick = () => { ov.classList.remove('active'); cb && cb(true); }; document.getElementById('confirmBtnNo').onclick = () => { ov.classList.remove('active'); cb && cb(false); }; }
    function confirmResetComplete(force) { showConfirm('البدء من جديد', 'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟', 'نعم، احذف الكل', 'إلغاء', (ok) => { if (ok) { localStorage.removeItem(SK); for (let i = 0; i < localStorage.length; i++) { let key = localStorage.key(i); if (key && key.startsWith('ho_math_backup_')) localStorage.removeItem(key); } localStorage.removeItem('ho_math_user_count'); st = defState(); saveSt(); currentOp = st.lastOp || 'mix'; updateUI(); loadProfileForm(); applyDarkMode(); if (typeof clearGameTimer === 'function') clearGameTimer(); if (G) { G.ended = true; if (G.timer) clearInterval(G.timer); } goTab('home'); showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية'); } }); }
   let G = { mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, currentQ: 0, totalQ: 10, correctAnswer: 0, answered: false, timer: null, timeLeft: 0, maxTime: 0, coinsEarned: 0, livesLeft: 3, helpersUsed: { skip: false, remove: false }, ended: false, isTraining: false, customTable: null, hasTimer: false, askedQuestions: [], currentExplanation: '', currentCatKey: '' };
   function clearGameTimer() { if (G.timer) { clearInterval(G.timer); G.timer = null; } }
   let aCtx = null; let bgInt = null;
   function gACtx() { if (!aCtx) try { aCtx = new(window.AudioContext || window.webkitAudioContext)(); } catch(e) {} return aCtx; }
   function tone(f, t='sine', d=0.25, v=0.12, delay=0) { if (!st.soundOn) return; const ctx = gACtx(); if (!ctx) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = t; o.frequency.value = f; g.gain.value = v; const ts = ctx.currentTime + delay; o.start(ts); g.gain.exponentialRampToValueAtTime(0.001, ts+d); o.stop(ts+d+0.01); }
   function playSound(type) { if (!st.soundOn) return; if (type === 'correct') { tone(660,'sine',0.14,0.12); tone(880,'sine',0.14,0.09,0.12); } else if (type === 'wrong') { tone(200,'sawtooth',0.2,0.12); } else if (type === 'levelup') { tone(523,'sine',0.12,0.12); tone(659,'sine',0.12,0.12,0.1); tone(784,'sine',0.18,0.14,0.2); } else if (type === 'click') { tone(440,'sine',0.07,0.06); } else if (type === 'open') { tone(392,'sine',0.1,0.07); tone(523,'sine',0.12,0.07,0.1); } else if (type === 'tick') { tone(1000,'sine',0.03,0.02); } else if (type === 'achievement') { tone(600,'sine',0.2,0.12); tone(900,'sine',0.3,0.2,0.15); } }
   const bgNotes = [261,294,329,349,392,440,494,523,392,349]; let bgIdx = 0;
   function bgNote() { if (!st.bgOn) return; const ctx = gACtx(); if (!ctx) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type='triangle'; o.frequency.value=bgNotes[bgIdx%bgNotes.length]; bgIdx++; g.gain.value=0.025; o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+2); o.stop(ctx.currentTime+2.1); }
   function startBg() { if (!bgInt) { bgInt = setInterval(bgNote, 2400); } }
   function stopBg() { clearInterval(bgInt); bgInt = null; }
   function toggleBgMusic() { st.bgOn = !st.bgOn; document.getElementById('bgBtn').textContent = st.bgOn ? '🎵' : '🔕'; document.getElementById('bgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة'; st.bgOn ? startBg() : stopBg(); playSound('click'); saveSt(); }
   function toggleSound() { st.soundOn = !st.soundOn; document.getElementById('soundBtn').textContent = st.soundOn ? '🔊' : '🔇'; const el = document.getElementById('soundStatus'); if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ'; saveSt(); }
   function rnd(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
   function shuffle(a) { return [...a].sort(()=>Math.random()-0.5); }
   function getCatStatsKey(op) { const map = { add:'addition', sub:'subtraction', mul:'multiplication', div:'division', mix:'addition', table:'table', percent:'percentage', fraction:'division', power:'algebra', sqrt:'squareroot', equation:'algebra', sequence:'puzzles', algebra:'algebra', word:'wordproblems', geometry:'geometry', advanced:'algebra', laws:'mathlaws' }; return map[op] || 'addition'; }
   function getDynamicDifficulty() { const corr = G.correct; if (corr < 5) return 'easy'; if (corr < 15) return 'medium'; if (corr < 30) return 'hard'; return 'genius'; }
   const questionBuilders = {
    add: (r) => { let a=rnd(r.small[0],r.small[1]), b=rnd(r.small[0],r.small[1]); return { text:`${a} + ${b}`, answer:a+b, explanation:`${a}+${b}=${a+b}`, catKey:'addition' }; },
    sub: (r) => { let a=rnd(r.small[0],r.small[1]), b=rnd(r.small[0],r.small[1]); if(a<b)[a,b]=[b,a]; return { text:`${a} − ${b}`, answer:a-b, explanation:`${a}-${b}=${a-b}`, catKey:'subtraction' }; },
    mul: (r) => { let a=rnd(r.times[0],r.times[1]), b=rnd(r.times[0],r.times[1]); return { text:`${a} × ${b}`, answer:a*b, explanation:`${a}×${b}=${a*b}`, catKey:'multiplication' }; },
    div: (r) => { let b=rnd(r.times[0],r.times[1]), ans=rnd(1,r.times[1]), a=b*ans; return { text:`${a} ÷ ${b}`, answer:ans, explanation:`${a}÷${b}=${ans}`, catKey:'division' }; },
    percent: (r) => { const pcts=[10,20,25,50,75]; const pct=pcts[rnd(0,pcts.length-1)]; let a=rnd(1,20)*10; let ans=Math.round(a*pct/100); return { text:`${pct}% من ${a}`, answer:ans, explanation:`${a}×${pct}%=${ans}`, catKey:'percentage' }; },
    power: (r) => { let a=rnd(2,10), b=rnd(2,3); return { text:`${a}^${b}`, answer:Math.pow(a,b), explanation:`${a}^${b}=${Math.pow(a,b)}`, catKey:'algebra' }; },
    sqrt: (r) => { const sq=[4,9,16,25,36,49,64,81,100,121,144]; let a=sq[rnd(0,sq.length-1)]; return { text:`√${a}`, answer:Math.round(Math.sqrt(a)), explanation:`√${a}=${Math.round(Math.sqrt(a))}`, catKey:'squareroot' }; },
    equation_simple: (r) => { let a=rnd(5,30), b=rnd(a+1,a+50); return { text:`س + ${a} = ${b}`, answer:b-a, explanation:`س=${b}-${a}=${b-a}`, catKey:'algebra' }; },
    sequence: (r) => { let a=rnd(1,15), b=rnd(2,10); return { text:`${a}, ${a+b}, ${a+2*b}, ?`, answer:a+3*b, explanation:`الفرق=${b}، التالي=${a+3*b}`, catKey:'puzzles' }; },
    fraction_simple: (r) => { let d=rnd(2,6), n1=rnd(1,d-1), n2=rnd(1,d-1); return { text:`${n1}/${d} + ${n2}/${d}`, answer:n1+n2, explanation:`${n1}/${d}+${n2}/${d}=${n1+n2}/${d}`, catKey:'division' }; },
    word_add: (r) => { let x=rnd(10,50), y=rnd(5,30); return { text:`لدى أحمد ${x} تفاحة واشترى ${y} تفاحة أخرى. كم تفاحة لديه الآن؟`, answer:x+y, explanation:`${x}+${y}=${x+y}`, catKey:'wordproblems' }; },
    word_mul: (r) => { let p=rnd(2,8), q=rnd(2,12); return { text:`إذا كان ثمن القلم الواحد ${p} ديناراً، فكم ثمن ${q} أقلام؟`, answer:p*q, explanation:`${p}×${q}=${p*q}`, catKey:'wordproblems' }; },
};
   function genQ(op, diff, customTable = null) {
    if (op==='table' && customTable) { const f=rnd(1,12); const ans=customTable*f; return { text:`${customTable} × ${f}`, hint:'ما حاصل الضرب؟', answer:ans, choices:shuffle([ans, ans+customTable, ans-customTable, ans+1]), explanation:`${customTable}×${f}=${ans}`, catKey:'table' }; }
    if (op==='advanced') { const pool = [ ()=>{ let a=rnd(2,6), b=rnd(2,4); return { text:`${a}^${b}`, answer:Math.pow(a,b), explanation:`${a}^${b}=${Math.pow(a,b)}`, catKey:'algebra' }; }, ()=>{ let sq=[4,9,16,25,36,49,64,81,100]; let a=sq[rnd(0,sq.length-1)]; return { text:`√${a}`, answer:Math.sqrt(a), explanation:`√${a}=${Math.sqrt(a)}`, catKey:'squareroot' }; }, ()=>{ let a=rnd(5,20), b=rnd(a+1,a+30); return { text:`س + ${a} = ${b}`, answer:b-a, explanation:`س=${b}-${a}=${b-a}`, catKey:'algebra' }; }, ()=>{ let c=rnd(2,8), a2=rnd(1,c-1), b2=rnd(1,c-1); return { text:`${a2}/${c} + ${b2}/${c}`, answer:a2+b2, explanation:`${a2}/${c}+${b2}/${c}=${a2+b2}/${c}`, catKey:'division' }; }, ()=>{ let pct=[10,20,25,50][rnd(0,3)]; let a=rnd(1,20)*10; return { text:`${pct}% من ${a}`, answer:Math.round(a*pct/100), explanation:`${a}×${pct}%=${Math.round(a*pct/100)}`, catKey:'percentage' }; }, ()=>{ let a=rnd(1,10), b=rnd(2,8); return { text:`${a}, ${a+b}, ${a+2*b}, ?`, answer:a+3*b, explanation:`الفرق=${b}، التالي=${a+3*b}`, catKey:'puzzles' }; }, ()=>{ let a=rnd(2,4); return { text:`log₁₀(10^${a})`, answer:a, explanation:`log₁₀(10^${a})=${a}`, catKey:'algebra' }; }, ()=>{ let degs=[0,30,45,60,90]; let deg=degs[rnd(0,degs.length-1)]; let val=Math.round(Math.sin(deg*Math.PI/180)*10)/10; return { text:`جا(${deg}°)`, answer:val, explanation:`جا(${deg}°)=${val}`, catKey:'algebra' }; }, ()=>{ let r=rnd(3,8); return { text:`مساحة دائرة نصف قطرها ${r}`, answer:Math.round(Math.PI*r*r), explanation:`π×${r}²≈${Math.round(Math.PI*r*r)}`, catKey:'geometry' }; }, ]; let q = pool[rnd(0,pool.length-1)](); let choices = shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2]); return { text:q.text, hint:'سؤال متقدم', answer:q.answer, choices, explanation:q.explanation, catKey:q.catKey }; }
    if (op==='laws') { const lawQ = [ { text:'ما ناتج 3 × (4 + 5) وفق قانون التوزيع؟', ans:27, explanation:'3×4 + 3×5 = 12+15=27' }, { text:'ما قيمة 5⁰؟', ans:1, explanation:'أي عدد غير صفري مرفوع للأس صفر = 1' }, { text:'ما مساحة مربع طول ضلعه 7؟', ans:49, explanation:'المساحة = 7² = 49' }, { text:'ما محيط دائرة نصف قطرها 5 (π≈3.14)؟', ans:31.4, explanation:'2×3.14×5' }, { text:'جذر 144 = ؟', ans:12, explanation:'12² = 144' }, { text:'إذا كان س + 5 = 12، فما قيمة س؟', ans:7, explanation:'س = 12-5' }, { text:'قانون الجمع التبادلي: 8 + 3 = 3 + ...؟', ans:8, explanation:'التبديل لا يغير الناتج' }, { text:'ما ناتج (-3) × (-4)؟', ans:12, explanation:'سالب × سالب = موجب' }, { text:'إذا كانت مساحة المستطيل 20 وطوله 5، فما عرضه؟', ans:4, explanation:'العرض = 20/5' }, { text:'ما قيمة 2³ × 2⁴؟', ans:128, explanation:'2⁷ = 128' }, { text:'ما متوسط الأعداد 4, 8, 12؟', ans:8, explanation:'(4+8+12)/3' }, { text:'حل المعادلة: 2س = 16', ans:8, explanation:'س = 16/2' }, { text:'إذا كان ثمن 5 أقلام 15 ديناراً، فثمن القلم الواحد؟', ans:3, explanation:'15/5' }, { text:'ناتج (1/2) ÷ (1/4) = ؟', ans:2, explanation:'(1/2)×4 = 2' }, { text:'ما 25% من 80؟', ans:20, explanation:'80×0.25' }, { text:'قيمة 2⁵ = ؟', ans:32, explanation:'2×2×2×2×2' }, ]; let q = lawQ[rnd(0,lawQ.length-1)]; let choices = shuffle([q.ans, q.ans+1, q.ans-1, q.ans+2]); return { text:q.text, hint:'تطبيق قانون رياضي', answer:q.ans, choices, explanation:q.explanation, catKey:'mathlaws' }; }
    let actualDiff = diff || getDifficultyByLevel(); const ranges = { easy: { small:[1,10], mid:[1,15], mul:[2,9], times:[2,9] }, medium: { small:[10,50], mid:[5,30], mul:[2,15], times:[2,12] }, hard: { small:[50,500], mid:[10,99], mul:[3,25], times:[3,20] }, genius: { small:[100,9999], mid:[10,999], mul:[5,50], times:[5,30] } }; const r = ranges[actualDiff] || ranges.easy; let ch = op; if (op==='mix') { const pools = { easy: ['add','sub','mul','div'], medium: ['add','sub','mul','div','percent','fraction_simple','word_add','word_mul','equation_simple'], hard: ['add','sub','mul','div','percent','fraction_add','power','sqrt','word_hard','equation_simple','sequence'], genius: ['add','sub','mul','div','percent','fraction_mul','power','sqrt','word_genius','equation_quad','sequence','algebra','log_simple'] }; const pool = pools[actualDiff] || pools.easy; ch = pool[rnd(0,pool.length-1)]; }
    if (G.mode === 'competitive') { ch = ['add','sub','mul','div'][rnd(0,3)]; actualDiff = getDynamicDifficulty(); const cr = ranges[actualDiff] || ranges.easy; const builder = questionBuilders[ch] || questionBuilders['add']; let qObj = builder(cr); let wrongs = new Set(); let ans = qObj.answer; let spread = Math.max(3, Math.floor(Math.abs(ans)*0.3)+2); let safety = 0; while (wrongs.size < 3 && safety < 200) { safety++; let off = rnd(-spread, spread); let w = ans + off; if (w !== ans && w >= 0 && Number.isInteger(w)) wrongs.add(w); } let extra = 1; while (wrongs.size < 3) { wrongs.add(ans+extra*2); extra++; } return { text: qObj.text, hint: 'ما الجواب؟', answer: ans, choices: shuffle([ans, ...wrongs]), explanation: qObj.explanation, catKey: qObj.catKey }; }
    let builder = questionBuilders[ch] || questionBuilders['add']; let qObj = builder(r); let wrongs = new Set(); let ans = qObj.answer; let spread = Math.max(3, Math.floor(Math.abs(ans)*0.3)+2); let safety = 0; while (wrongs.size < 3 && safety < 200) { safety++; let off = rnd(-spread, spread); let w = ans + off; if (w !== ans && w >= 0 && Number.isInteger(w)) wrongs.add(w); } let extra = 1; while (wrongs.size < 3) { wrongs.add(ans+extra*2); extra++; } return { text:qObj.text, hint:'ما هو الجواب؟', answer:ans, choices:shuffle([ans, ...wrongs]), explanation:qObj.explanation, catKey:qObj.catKey };
    }
   function startGameWith(mode, op, customTable = null, forceTimer = false) { closeSheet('modeSheet'); closeSheet('opSheet'); closeSheet('trainingOpSheet'); clearGameTimer(); st.lastMode = mode; st.lastOp = op; currentOp = op; saveSt(); G.mode = mode; G.op = op; G.score = 0; G.correct = 0; G.wrong = 0; G.streak = 0; G.bestStreak = 0; G.currentQ = 0; G.coinsEarned = 0; G.answered = false; G.ended = false; G.isTraining = false; G.customTable = customTable || null; G.askedQuestions = []; let hasTimer = false; let lives = 3; if (mode === 'classic') { G.totalQ = 10; hasTimer = forceTimer; if (hasTimer) { G.maxTime = 60; G.timeLeft = 60; lives = 3; } else { G.maxTime = 0; G.timeLeft = 0; lives = 0; } } else if (mode === 'speed') { G.totalQ = 9999; hasTimer = true; G.maxTime = 60; G.timeLeft = 60; lives = 3; } else if (mode === 'survival') { G.totalQ = 9999; hasTimer = false; lives = 1; } else if (mode === 'frenzy') { G.totalQ = 9999; hasTimer = true; G.maxTime = 30; G.timeLeft = 30; lives = 3; } else if (mode === 'daily') { G.totalQ = 5; hasTimer = false; lives = 0; } else if (mode === 'marathon') { G.totalQ = 20; hasTimer = false; lives = 0; } else if (mode === 'competitive') { G.totalQ = 9999; hasTimer = false; lives = 0; } G.livesLeft = lives; G.hasTimer = hasTimer; G.helpersUsed = { skip: false, remove: false }; const titles = { classic:'🧮 كلاسيك', speed:'⚡ سرعة 60ث', survival:'🔥 التحمّل', frenzy:'💥 اندفاع', daily:'🌟 تحدي اليوم', marathon:'🏃 ماراثون', competitive:'🏆 تحدي المنافسة' }; document.getElementById('gameModeTitle').textContent = titles[mode] || 'كلاسيك'; document.getElementById('statScore').textContent = 0; document.getElementById('streakNum').textContent = 0; document.getElementById('streakFire').style.display = 'none'; if (lives > 0) { document.getElementById('heartsStat').style.display = 'flex'; updateHeartsDisplay(); } else { document.getElementById('heartsStat').style.display = 'none'; } document.getElementById('helpersBar').style.display = 'flex'; document.getElementById('xpCoinBar').style.display = 'flex'; document.getElementById('gameXp').textContent = st.xp; document.getElementById('gameCoin').textContent = st.coins; const endBtn = document.getElementById('competitiveEndBtn'); if (endBtn) { endBtn.style.display = (mode==='competitive') ? 'block' : 'none'; } if (hasTimer) { document.getElementById('bigTimerWrap').style.display = 'block'; document.getElementById('bigTimer').textContent = G.timeLeft; document.getElementById('timerBar').style.width = '100%'; if (G.timer) clearInterval(G.timer); G.timer = setInterval(() => { if (G.ended) { clearInterval(G.timer); G.timer = null; return; } if (G.timeLeft <= 0) { clearInterval(G.timer); G.timer = null; if (!G.ended) endGame(); } else { G.timeLeft--; const pct = (G.timeLeft / G.maxTime) * 100; document.getElementById('timerBar').style.width = pct + '%'; document.getElementById('bigTimer').textContent = G.timeLeft; if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger'); document.getElementById('bigTimer').classList.add('danger'); } if (G.timeLeft > 0 && G.timeLeft <= 5) playSound('tick'); } }, 1000); } else { document.getElementById('bigTimerWrap').style.display = 'none'; } updateGameCoinsDisplay(); document.getElementById('resultsOverlay').classList.remove('active'); document.getElementById('gameOverlay').classList.add('active'); loadQuestion(); }
   function startTrainingMode(op = 'mix') { clearGameTimer(); G.mode = 'classic'; G.op = op; G.score = 0; G.correct = 0; G.wrong = 0; G.streak = 0; G.bestStreak = 0; G.currentQ = 0; G.totalQ = 9999; G.coinsEarned = 0; G.answered = false; G.ended = false; G.isTraining = true; G.livesLeft = 99; G.customTable = null; G.hasTimer = true; G.helpersUsed = { skip: false, remove: false }; G.askedQuestions = []; document.getElementById('gameModeTitle').textContent = '🎓 تدريب'; document.getElementById('statScore').textContent = '0'; document.getElementById('streakNum').textContent = '0'; document.getElementById('streakFire').style.display = 'none'; document.getElementById('heartsStat').style.display = 'flex'; document.getElementById('heartsStat').innerHTML = `<div class="helper-btn" id="trainingTimeBtn" onclick="selectTrainingTime()" style="flex:0.7;"><div class="helper-btn-icon">⏱️</div><div class="helper-btn-label">تحديد الوقت</div></div>`; document.getElementById('helpersBar').style.display = 'none'; G.timeLeft = 30; G.maxTime = 30; document.getElementById('bigTimerWrap').style.display = 'block'; document.getElementById('bigTimer').textContent = G.timeLeft; document.getElementById('timerBar').style.width = '100%'; if (G.timer) clearInterval(G.timer); G.timer = setInterval(() => { if (G.ended) { clearInterval(G.timer); G.timer = null; return; } if (G.timeLeft <= 0) { clearInterval(G.timer); G.timer = null; if (!G.ended) endGame(); } else { G.timeLeft--; const pct = (G.timeLeft / G.maxTime) * 100; document.getElementById('timerBar').style.width = pct + '%'; document.getElementById('bigTimer').textContent = G.timeLeft; if (G.timeLeft <= 10) { document.getElementById('timerBar').classList.add('danger'); document.getElementById('bigTimer').classList.add('danger'); } if (G.timeLeft > 0 && G.timeLeft <= 5) playSound('tick'); } }, 1000); updateGameCoinsDisplay(); document.getElementById('resultsOverlay').classList.remove('active'); document.getElementById('gameOverlay').classList.add('active'); loadQuestion(); }
   function selectTrainingTime() { showConfirm('اختر وقت التدريب', 'اختر الوقت المناسب للتدريب', '30 ثانية', '60 ثانية', (is30) => { G.maxTime = is30 ? 30 : 60; G.timeLeft = G.maxTime; document.getElementById('bigTimer').textContent = G.timeLeft; }); }
   function useHelper(type) { if (G.isTraining) { showFeedback('⚠️ وضع التدريب لا يحتوي مساعدات'); return; } if (type === 'skip') { if (st.coins < 3) { showFeedback('💸 تحتاج 3💰'); return; } if (G.helpersUsed.skip) { showFeedback('⏭️ استُخدمت'); return; } st.coins -= 3; G.helpersUsed.skip = true; document.getElementById('helperSkip').classList.add('used'); saveSt(); updateUI(); updateGameCoinsDisplay(); if (G.hasTimer && G.maxTime > 0) { G.timeLeft = Math.max(0, G.timeLeft - 4); document.getElementById('bigTimer').textContent = G.timeLeft; showFeedback('⏭️ تخطيت السؤال -4 ثوانٍ'); if (G.timeLeft <= 0) { clearGameTimer(); endGame(); return; } } loadQuestion(); } else if (type === 'remove') { if (st.coins < 4) { showFeedback('💸 تحتاج 4💰'); return; } if (G.helpersUsed.remove) { showFeedback('🗑️ استُخدم'); return; } if (G.answered) return; st.coins -= 4; G.helpersUsed.remove = true; document.getElementById('helperRemove').classList.add('used'); saveSt(); updateUI(); updateGameCoinsDisplay(); const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')]; const wrongs = btns.filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer); if (wrongs.length > 0) { wrongs[Math.floor(Math.random()*wrongs.length)].style.opacity='0.15'; wrongs[0].style.pointerEvents='none'; showFeedback('🗑️ حُذفت إجابة خاطئة'); } } else if (type === 'heart') { if (G.livesLeft >= 5) { showFeedback('❤️ وصلت الحد الأقصى'); return; } if (st.coins < 7) { showFeedback('💸 تحتاج 7💰'); return; } st.coins -= 7; G.livesLeft++; saveSt(); updateUI(); updateHeartsDisplay(); updateGameCoinsDisplay(); showFeedback('💖 +1 قلب!'); playSound('levelup'); } }
   function updateHeartsDisplay() { const row = document.getElementById('heartsRow'); if (!row) return; const total = 3; let h = ''; for (let i=0; i<total; i++) h+=`<span class="heart-icon${i>=G.livesLeft?' lost':''}">${G.mode==='survival'?'🖤':'❤️'}</span>`; row.innerHTML = h; }
   function updateGameCoinsDisplay() { const totalCoins = st.coins + Math.floor(G.coinsEarned); document.getElementById('gameCoins').textContent = totalCoins; document.getElementById('gameXp').textContent = st.xp; document.getElementById('gameCoin').textContent = totalCoins; }
   function loadQuestion() { if (G.ended) return; if (G.currentQ >= G.totalQ && !G.isTraining && G.mode !== 'speed' && G.mode !== 'survival' && G.mode !== 'frenzy') { endGame(); return; } G.currentQ++; G.answered = false; G.helpersUsed.remove = false; document.getElementById('helperRemove').classList.remove('used'); document.getElementById('explanationArea').innerHTML = ''; let q; let attempts = 0; const maxAttempts = 50; do { if (G.isTraining) { if (G.op==='table' && G.customTable) q = genQ('table', st.difficulty, G.customTable); else q = genQ(G.op, st.difficulty); } else { if (G.op==='table' && G.customTable) q = genQ('table', st.difficulty, G.customTable); else q = genQ(G.op, st.difficulty); } const qKey = q.text + '|' + q.answer; const isEndless = G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy' || G.mode==='competitive'; if (!G.askedQuestions.includes(qKey) || G.isTraining || isEndless) break; attempts++; if (attempts > maxAttempts) break; } while (true); const isEndless = G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy' || G.mode==='competitive'; if (!G.isTraining && !isEndless) G.askedQuestions.push(q.text+'|'+q.answer); G.correctAnswer = q.answer; G.currentExplanation = q.explanation || ''; G.currentCatKey = q.catKey || getCatStatsKey(G.op||'add'); const qt = document.getElementById('questionText'); qt.style.animation='none'; void qt.offsetWidth; qt.style.animation=''; document.getElementById('questionNumber').textContent = G.isTraining ? `🎓 تدريب - ${G.correct+1}` : G.mode==='speed' ? `⚡ السؤال ${G.correct+1}` : G.mode==='frenzy' ? `💥 ${G.correct+1} إجابة` : G.mode==='survival' ? `❤️ ${G.livesLeft} قلوب` : G.mode==='competitive' ? `🏆 الإجابة ${G.correct+1} (صعوبة ${getDynamicDifficulty()})` : `السؤال ${G.currentQ} من ${G.totalQ}`; document.getElementById('questionText').textContent = `${q.text} = ?`; document.getElementById('questionHint').textContent = q.hint || 'ما هو الجواب؟'; document.getElementById('statQ').textContent = (G.isTraining || G.mode==='speed' || G.mode==='survival' || G.mode==='frenzy' || G.mode==='competitive') ? G.correct : `${G.currentQ}/${G.totalQ}`; const grid = document.getElementById('answersGrid'); grid.innerHTML = ''; const choices = q.choices || shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2]); choices.forEach(c => { const btn = document.createElement('button'); btn.className = 'answer-btn'; btn.textContent = c; btn.setAttribute('data-val', c); btn.onclick = () => checkAnswer(btn); grid.appendChild(btn); }); }
   function checkAnswer(btn) { if (G.answered || G.ended) return; G.answered = true; const val = parseInt(btn.getAttribute('data-val')); document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true); if (val === G.correctAnswer) { btn.classList.add('correct'); G.correct++; G.streak++; if (G.streak > G.bestStreak) G.bestStreak = G.streak; G.score += 10 + G.streak*2; G.coinsEarned += 0.4; showFeedback(G.streak>=5 ? `🔥×${G.streak}` : '✅'); playSound('correct'); if (G.hasTimer && G.maxTime>0 && !G.isTraining) { G.timeLeft = Math.min(G.maxTime, G.timeLeft+1); const pct = (G.timeLeft/G.maxTime)*100; document.getElementById('timerBar').style.width = pct+'%'; document.getElementById('bigTimer').textContent = G.timeLeft; } if (G.currentCatKey && st.stats[G.currentCatKey]) { let s = st.stats[G.currentCatKey]; if (!s) { s = { att:0, cor:0, stars:0, max:0, first:0 }; st.stats[G.currentCatKey] = s; } s.att++; s.cor++; s.max+=3; s.stars += Math.min(3, Math.floor(G.streak/3)+1); if (G.streak>=3) s.first++; } updTask('correct'); if (G.streak>=3) updTask('streak', G.streak); if (G.streak>=5) doConfetti(); if (G.streak>=5 && G.streak%5===0) showComboEffect(G.streak); showFloatXP(10+G.streak*2); if (!G.isTraining) st.correctTotal++; } else { btn.classList.add('wrong'); document.querySelectorAll('.answer-btn').forEach(b => { if (parseInt(b.getAttribute('data-val'))===G.correctAnswer) b.classList.add('correct'); }); G.wrong++; G.streak=0; if (G.hasTimer && G.maxTime>0 && !G.isTraining) { G.timeLeft = Math.max(0, G.timeLeft-1); const pct = (G.timeLeft/G.maxTime)*100; document.getElementById('timerBar').style.width = pct+'%'; document.getElementById('bigTimer').textContent = G.timeLeft; if (G.timeLeft<=0) { clearGameTimer(); endGame(); return; } } if (G.isTraining) { showFeedback('❌'); playSound('wrong'); showExplanation(); } else if (G.mode === 'competitive') { showFeedback('❌'); playSound('wrong'); showExplanation(); } else { if (G.livesLeft>0) { G.livesLeft--; updateHeartsDisplay(); showFeedback('❌'); playSound('wrong'); showExplanation(); if (G.livesLeft<=0) { if (!st.dailyShieldUsed && useDailyShield()) { G.livesLeft=1; updateHeartsDisplay(); showFeedback('🛡️ درع الحماية!'); } else { setTimeout(()=>{ if (!G.ended) endGame(); }, 700); return; } } } else { showFeedback('❌'); playSound('wrong'); showExplanation(); } } if (G.currentCatKey && st.stats[G.currentCatKey]) { let s = st.stats[G.currentCatKey]; if (!s) { s = { att:0, cor:0, stars:0, max:0, first:0 }; st.stats[G.currentCatKey] = s; } s.att++; s.max+=3; } if (!G.isTraining) st.wrongTotal++; if ((G.op==='laws' || G.currentCatKey==='mathlaws') && G.currentExplanation) { document.getElementById('explanationArea').innerHTML += `<div class="law-card" style="margin-top:8px;">📜 تذكير بالقانون: ${G.currentExplanation}</div>`; } } document.getElementById('statScore').textContent = G.score; document.getElementById('streakNum').textContent = G.streak; document.getElementById('streakFire').style.display = G.streak>=3 ? 'inline' : 'none'; updateGameCoinsDisplay(); saveSt(); const delay = (G.mode === 'competitive') ? 100 : 350; setTimeout(() => { if (G.ended) return; if (!G.isTraining && G.mode!=='speed' && G.mode!=='survival' && G.mode!=='frenzy' && G.mode!=='competitive' && G.currentQ>=G.totalQ) endGame(); else loadQuestion(); }, delay); }
   function showFeedback(msg) { const t = document.getElementById('feedbackToast'); t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 900); }
   function showFloatXP(amt) { let el = document.createElement('div'); el.className='float-xp'; el.textContent=`+${amt}`; el.style.cssText=`left:${rnd(30,65)}%;top:40%;position:fixed;z-index:10000;font-size:1.5rem;font-weight:bold;color:var(--gold);animation:floatXP 1s ease-out forwards;`; document.body.appendChild(el); setTimeout(()=>el.remove(), 1000); }
   function showComboEffect(c) { let popup = document.createElement('div'); popup.className='combo-popup'; popup.textContent=`🔥 ×${c}`; popup.style.cssText=`position:fixed;bottom:40%;left:50%;transform:translateX(-50%);background:var(--gold);color:black;padding:8px 20px;border-radius:40px;font-weight:bold;z-index:10000;animation:comboAnim 0.8s ease-out forwards;`; document.body.appendChild(popup); setTimeout(()=>popup.remove(), 900); }
   function showExplanation() { if (!G.currentExplanation) return; document.getElementById('explanationArea').innerHTML = `<div class="explanation-box">📝 الإجابة الصحيحة: <strong>${G.correctAnswer}</strong><br>الشرح: ${G.currentExplanation}</div>`; }
   function endGame() { if (G.ended) return; G.ended = true; clearGameTimer(); if (G.mode==='marathon' && G.correct > st.marathonBest) st.marathonBest = G.correct; if (G.mode==='competitive') { if (G.correct > (st.competitiveBest || 0)) { st.competitiveBest = G.correct; if (G.correct > st.bestScore) { st.bestScore = G.correct; syncLeaderboard(st.name, st.avatar, st.level, G.correct); } } st.correctTotal += G.correct; st.wrongTotal += G.wrong; st.totalGames++; if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak; const xpGained = G.score*2 + G.correct*5; st.xp += xpGained; while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext*1.3); playSound('levelup'); } st.catChallenges.games++; updTask('game'); saveSt(); updateUI(); checkAchievements(); const acc = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0; document.getElementById('resultsEmoji').textContent = acc>=90?'🏆':acc>=70?'⭐':'💪'; document.getElementById('resultsTitle').textContent = 'انتهى التحدي!'; document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`; document.getElementById('resScore').textContent = G.score; document.getElementById('resCorrect').textContent = G.correct; document.getElementById('resStreak').textContent = G.bestStreak; document.getElementById('resultsXP').textContent = `+${xpGained} XP • +0 💰`; document.getElementById('gameOverlay').classList.remove('active'); document.getElementById('resultsOverlay').classList.add('active'); return; } updateWeeklyStats(G.score, G.correct); if (G.isTraining) { document.getElementById('gameOverlay').classList.remove('active'); document.getElementById('trainingEndOverlay').classList.add('active'); document.getElementById('trainResScore').textContent = G.score; document.getElementById('trainResCorrect').textContent = G.correct; document.getElementById('trainResStreak').textContent = G.bestStreak; document.getElementById('trainingEndSub').textContent = `أجبت على ${G.correct} سؤال`; return; } const earnedCoins = Math.floor(G.coinsEarned); st.correctTotal += G.correct; st.wrongTotal += G.wrong; st.coins += earnedCoins; st.totalGames++; if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak; if (G.score > st.bestScore) st.bestScore = G.score; const xpGained = G.score*2 + G.correct*5; st.xp += xpGained; while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext*1.3); playSound('levelup'); } if (['classic','speed','survival','frenzy'].includes(G.mode)) { st.catCounter.correct += G.correct; st.catCounter.total += G.correct+G.wrong; } if (['speed','survival','frenzy','daily','marathon'].includes(G.mode)) st.catChallenges.games++; updTask('game'); if (G.mode==='daily') updTask('daily'); const acc = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0; st.history.unshift({ mode:G.mode, score:G.score, correct:G.correct, acc, op:G.op }); if (st.history.length>10) st.history.pop(); saveSt(); updateUI(); checkAchievements(); if (G.score > (st.bestScore || 0)) { st.bestScore = G.score; syncLeaderboard(st.name, st.avatar, st.level, G.score); } const pct = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0; const emj = pct>=90 ? '🏆' : pct>=70 ? '⭐' : pct>=50 ? '😊' : '💪'; const ttl = pct>=90 ? 'ممتاز!' : pct>=70 ? 'رائع!' : pct>=50 ? 'جيد!' : 'حاول مجدداً!'; document.getElementById('resultsEmoji').textContent = emj; document.getElementById('resultsTitle').textContent = ttl; document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`; document.getElementById('resScore').textContent = G.score; document.getElementById('resCorrect').textContent = G.correct; document.getElementById('resStreak').textContent = G.bestStreak; document.getElementById('resultsXP').textContent = `+${xpGained} XP • +${earnedCoins} 💰`; document.getElementById('gameOverlay').classList.remove('active'); document.getElementById('resultsOverlay').classList.add('active'); if (pct>=70) doConfetti(); }
   function endCompetitiveChallenge() { if (G.mode !== 'competitive' || G.ended) return; G.ended = true; clearGameTimer(); if (G.correct > (st.competitiveBest || 0)) { st.competitiveBest = G.correct; if (G.correct > st.bestScore) { st.bestScore = G.correct; syncLeaderboard(st.name, st.avatar, st.level, G.correct); } } st.correctTotal += G.correct; st.wrongTotal += G.wrong; st.totalGames++; if (G.bestStreak > st.bestStreak) st.bestStreak = G.bestStreak; const xpGained = G.score*2 + G.correct*5; st.xp += xpGained; while (st.xp >= st.xpToNext) { st.xp -= st.xpToNext; st.level++; st.xpToNext = Math.floor(st.xpToNext*1.3); playSound('levelup'); } st.catChallenges.games++; updTask('game'); saveSt(); updateUI(); checkAchievements(); const acc = G.correct+G.wrong>0 ? Math.round((G.correct/(G.correct+G.wrong))*100) : 0; document.getElementById('resultsEmoji').textContent = acc>=90?'🏆':acc>=70?'⭐':'💪'; document.getElementById('resultsTitle').textContent = 'انتهى التحدي!'; document.getElementById('resultsSub').textContent = `${G.correct} صحيح من ${G.correct+G.wrong} سؤال • ${acc}% دقة`; document.getElementById('resScore').textContent = G.score; document.getElementById('resCorrect').textContent = G.correct; document.getElementById('resStreak').textContent = G.bestStreak; document.getElementById('resultsXP').textContent = `+${xpGained} XP • +0 💰`; document.getElementById('gameOverlay').classList.remove('active'); document.getElementById('resultsOverlay').classList.add('active'); }
   function playAgain() { document.getElementById('resultsOverlay').classList.remove('active'); startGameWith(G.mode, G.op, G.customTable, G.hasTimer); }
   function goHome() { document.getElementById('resultsOverlay').classList.remove('active'); goTab('home'); }
   function confirmQuit() { showConfirm('إنهاء اللعبة', 'هل أنت متأكد من العودة إلى الصفحة الرئيسية؟\nستفقد تقدمك في هذه الجلسة.', 'نعم، عد', 'استمرار', ok => { if (ok) { clearGameTimer(); document.getElementById('gameOverlay').classList.remove('active'); document.getElementById('resultsOverlay').classList.remove('active'); if (G.correct>0 || G.wrong>0 && !G.ended && !G.isTraining) endGame(); else { G.ended=true; clearGameTimer(); goTab('home'); } } }); }
   function doConfetti() { const c=['#f0b90b','#7c3aed','#06b6d4','#10b981','#ef4444','#ffd54f']; for (let i=0; i<45; i++) { const el=document.createElement('div'); el.className='confetti-piece'; el.style.cssText=`left:${Math.random()*100}%;top:-10px;background:${c[rnd(0,5)]};width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;border-radius:${Math.random()>0.5?'50%':'2px'};position:fixed;z-index:9999;pointer-events:none;animation:fall 2s linear forwards;`; document.body.appendChild(el); setTimeout(()=>el.remove(),3200); } }
   function useDailyShield() { updateDailyShield(); if (st.dailyShieldUsed) return false; st.dailyShieldUsed = true; saveSt(); return true; }
   function updateWeeklyStats(score, correct) { const day = todayStr(); if (!st.weeklyStats[day]) st.weeklyStats[day] = { score:0, correct:0 }; st.weeklyStats[day].score += score; st.weeklyStats[day].correct += correct; const days = Object.keys(st.weeklyStats).sort(); while (days.length > 7) { delete st.weeklyStats[days.shift()]; } saveSt(); drawWeeklyChart(); }
   function drawWeeklyChart() { const canvas = document.getElementById('weeklyChart'); if (!canvas) return; const ctx = canvas.getContext('2d'); const days = Object.keys(st.weeklyStats).sort(); if (days.length===0) { ctx.clearRect(0,0,canvas.width,canvas.height); return; } const scores = days.map(d => st.weeklyStats[d].score); const maxScore = Math.max(1, ...scores); const w=canvas.width, h=canvas.height; ctx.clearRect(0,0,w,h); ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#f0b90b'; ctx.lineWidth = 2; ctx.beginPath(); days.forEach((d,i) => { const x = (i/(days.length-1)) * w; const y = h - (scores[i]/maxScore)*(h-10); if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); } 
    console.log("تم تحميل الكود بنجاح والأزرار ستعمل الآن");
    
    // بدء تشغيل الوظائف
    checkDailyReset();
    updateUI();
    loadProfileForm();
    applyDarkMode();
    startBg();
    setInterval(() => { if(st.bgOn) startBg(); }, 60000);
})();
</script>
</body>
</html>
