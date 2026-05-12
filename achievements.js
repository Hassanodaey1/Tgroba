/* ═══════════ ACHIEVEMENTS.JS ═══════════ */
/* الإنجازات، الشارات، المهام اليومية */

const ACHIEVEMENTS_DEF = [
    { id: 'first_correct', icon: '🎯', name: 'أول إجابة صحيحة', desc: 'أجب على سؤال واحد صحيح', check: () => st.correctTotal >= 1, reward: 2 },
    { id: 'ten_correct', icon: '🔟', name: '10 إجابات', desc: 'أجب على 10 أسئلة صحيحة', check: () => st.correctTotal >= 10, reward: 3 },
    { id: 'fifty_correct', icon: '💯', name: '50 إجابة', desc: 'أجب على 50 سؤالاً صحيحاً', check: () => st.correctTotal >= 50, reward: 5 },
    { id: 'combo5', icon: '🔥', name: 'تتابع ×5', desc: 'حقّق تتابع 5 إجابات صحيحة', check: () => st.bestStreak >= 5, reward: 4 },
    { id: 'combo10', icon: '💥', name: 'تتابع ×10', desc: 'حقّق تتابع 10 إجابات صحيحة', check: () => st.bestStreak >= 10, reward: 8 },
    { id: 'speed10', icon: '⚡', name: 'سرعة 10 نقاط', desc: 'سجّل 10 نقاط في وضع السرعة', check: () => st.bestScore >= 10, reward: 3 },
    { id: 'speed25', icon: '🚀', name: 'سرعة 25 نقطة', desc: 'سجّل 25 نقطة في وضع السرعة', check: () => st.bestScore >= 25, reward: 6 },
    { id: 'level5', icon: '⬆️', name: 'المستوى 5', desc: 'وصل إلى المستوى 5', check: () => st.level >= 5, reward: 10 },
    { id: 'level20', icon: '👑', name: 'المستوى 20', desc: 'وصل إلى المستوى 20', check: () => st.level >= 20, reward: 20 },
    { id: 'all_basic_stars', icon: '🌟', name: 'أستاذ الأساسيات',
        desc: '15 نجمة في كل من الجمع والطرح والضرب والقسمة والجدول',
        check: () => ['addition', 'subtraction', 'multiplication', 'division', 'table'].every(k => (st.stats[k]?.stars || 0) >= 15), reward: 10 },
    { id: 'perfect_10', icon: '✨', name: 'مثالي ×10', desc: '10 مرات مثالية (3 نجوم)',
        check: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10, reward: 8 },
    { id: 'coins100', icon: '💰', name: 'مئة عملة', desc: 'اجمع 100 عملة', check: () => st.coins >= 100, reward: 0 },
    { id: 'play1h', icon: '⏱️', name: 'ساعة لعب', desc: 'ساعة كاملة من وقت اللعب', check: () => getSessionSecs() >= 3600, reward: 12 },
    { id: 'hard_unlock', icon: '🔓', name: 'فتح الصعب', desc: 'وصل للمستوى المطلوب لفتح الصعب', check: () => st.level >= 5, reward: 5 },
    { id: 'five_perfect', icon: '🏅', name: '5 فئات مثالية', desc: '5 فئات حصلت على تقييم مثالي',
        check: () => Object.values(st.stats).filter(s => (s.stars || 0) >= 15).length >= 5, reward: 15 },
    { id: 'young_math', icon: '🧒', name: 'رياضي صغير', desc: 'عمرك أقل من 12 وأجبت 20 صحيحة',
        check: () => st.age && st.age < 12 && st.correctTotal >= 20, reward: 10 },
    { id: 'algebra_master', icon: '📐', name: 'أستاذ الجبر', desc: 'عمرك 18+ وأجبت 20 في الجبر',
        check: () => st.age && st.age >= 18 && (st.stats['algebra']?.cor || 0) >= 20, reward: 15 },
    { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة',
        check: () => st.age && st.age >= 60 && st.correctTotal >= 30, reward: 20 },
];

function checkAchievements() {
    let newUnlocks = [];
    ACHIEVEMENTS_DEF.forEach(a => {
        if (!st.achievementsUnlocked.includes(a.id) && a.check()) {
            st.achievementsUnlocked.push(a.id);
            if (a.reward > 0) st.coins += a.reward;
            newUnlocks.push(a.name);
        }
    });
    if (newUnlocks.length) {
        saveSt();
        showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`);
        playSound('levelup');
        updateUI();
    }
    if (st.achievementsUnlocked.length === ACHIEVEMENTS_DEF.length && !st.achievementRewardClaimed) {
        st.achievementRewardClaimed = true;
        st.coins += 5;
        saveSt();
        showFeedback('🎉 جميع الإنجازات! +5 عملات إضافية');
        playSound('levelup');
        updateUI();
    }
}

function renderAchievements() {
    const el = document.getElementById('achieveList');
    if (!el) return;
    const total = ACHIEVEMENTS_DEF.length;
    const doneCount = st.achievementsUnlocked.length;
    document.getElementById('achievePct').textContent = `${doneCount}/${total}`;
    el.innerHTML = ACHIEVEMENTS_DEF.map(a => {
        let done = st.achievementsUnlocked.includes(a.id) || a.check();
        return `<div class="task-item ${done ? 'done' : ''}">
            <div class="task-item-icon">${a.icon}</div>
            <div class="task-item-info">
                <div class="task-item-name">${a.name}</div>
                <div class="task-item-desc">${a.desc}</div>
            </div>
            <div class="task-right">
                <div class="task-reward">${done ? '✅' : `+${a.reward}💰`}</div>
            </div>
        </div>`;
    }).join('');
    const rewardDiv = document.getElementById('achieveCompleteReward');
    if (rewardDiv) rewardDiv.style.display = doneCount === total ? 'block' : 'none';
}

/* ═══════════ BADGES ═══════════ */
const BADGES = {
    speed30: { icon: '⚡', cond: () => st.bestScore >= 30 },
    perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10 },
    level10: { icon: '🔷', cond: () => st.level >= 10 },
    allBasic: { icon: '🏅', cond: () => ['addition', 'subtraction', 'multiplication', 'division', 'table'].every(k => (st.stats[k]?.stars || 0) >= 15) }
};

function updateBadgeIcon() {
    const el = document.getElementById('badgeDisplay');
    if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join('');
}

/* ═══════════ DAILY TASKS ═══════════ */
function genDailyTasks() {
    return [
        { id: 't1', icon: '🎯', name: 'أول إجابة', desc: 'أجب على سؤال واحد صحيح', reward: 1, goal: 1, progress: 0, done: false },
        { id: 't2', icon: '🔥', name: 'تتابع ×3', desc: '3 إجابات صحيحة متتالية', reward: 3, goal: 3, progress: 0, done: false },
        { id: 't3', icon: '⚡', name: '10 إجابات صحيحة', desc: 'أجب على 10 أسئلة صحيحة', reward: 5, goal: 10, progress: 0, done: false },
        { id: 't4', icon: '🏃', name: 'جلستان كاملتان', desc: 'أنهِ جلستَي لعب كاملتَين', reward: 4, goal: 2, progress: 0, done: false },
        { id: 't5', icon: '💎', name: '25 إجابة', desc: 'أجب على 25 سؤالاً صحيحاً', reward: 8, goal: 25, progress: 0, done: false },
        { id: 't6', icon: '🌟', name: 'تحدي اليوم', desc: 'العب تحدي اليوم الخاص مرة', reward: 2, goal: 1, progress: 0, done: false },
    ];
}

function checkDailyReset() {
    if (st.dailyDate !== todayStr()) {
        st.dailyTasks = genDailyTasks();
        st.dailyDate = todayStr();
        saveSt();
    }
}

function updTask(type, amount = 1) {
    checkDailyReset();
    const T = st.dailyTasks;
    let changed = false;
    if (type === 'correct') {
        ['t1', 't3', 't5'].forEach(id => {
            const t = T.find(x => x.id === id);
            if (t && !t.done) {
                t.progress = Math.min(t.goal, t.progress + amount);
                if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; }
            }
        });
    }
    if (type === 'streak' && amount >= 3) {
        const t = T.find(x => x.id === 't2');
        if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; }
    }
    if (type === 'game') {
        const t = T.find(x => x.id === 't4');
        if (t && !t.done) {
            t.progress = Math.min(t.goal, t.progress + 1);
            if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; }
        }
    }
    if (type === 'daily') {
        const t = T.find(x => x.id === 't6');
        if (t && !t.done) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; }
    }
    if (changed) { saveSt(); updateUI(); showFeedback('✅ مهمة مكتملة! +عملات'); playSound('levelup'); }
}

function renderTasks() {
    const el = document.getElementById('taskList');
    if (!el) return;
    checkDailyReset();
    el.innerHTML = st.dailyTasks.map(t => `
        <div class="task-item ${t.done ? 'done' : ''}">
            <div class="task-item-icon">${t.icon}</div>
            <div class="task-item-info">
                <div class="task-item-name">${t.name}</div>
                <div class="task-item-desc">${t.desc}</div>
                <div class="task-progress-bar"><div class="task-progress-fill" style="width:${Math.min(100, (t.progress / t.goal) * 100)}%"></div></div>
                <div class="task-item-progress">${t.progress}/${t.goal}</div>
            </div>
            <div class="task-right"><div class="task-reward">${t.done ? '✅' : `+${t.reward}💰`}</div></div>
        </div>`).join('');
}

/* ═══════════ DAILY SHIELD ═══════════ */
function updateDailyShield() {
    const today = todayStr();
    if (st.lastDailyDate !== today) {
        let yesterday = new Date(Date.now() - 86400000).toDateString();
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
