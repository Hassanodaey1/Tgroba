/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features
   التعديلات الجديدة:
   1. زر الإعدادات يوقف مؤقت اللعبة
   2. إزالة المهام والإنجازات من الملف الشخصي (تبقى في تبويب مهام فقط)
   3. نظام الألقاب الموسمي
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إعدادات اللعبة مع إيقاف المؤقت ═══ */

/* إيقاف مؤقت اللعبة مؤقتاً */
let _gamePaused = false;
let _pausedTimeLeft = 0;

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
    // Re-start the timer from where it was paused
    G.timeLeft = _pausedTimeLeft;
    G.timer = setInterval(() => {
        G.timeLeft--;
        if (G.timeLeft <= 0) {
            clearGameTimer();
            endGame();
        } else {
            const pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            const bar = document.getElementById('timerBar');
            if (bar) {
                bar.style.width = pct + '%';
                if (pct < 25) bar.classList.add('danger'); else bar.classList.remove('danger');
            }
            const bt = document.getElementById('bigTimer');
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : G.timeLeft;
                if (G.timeLeft <= 5) bt.classList.add('danger'); else bt.classList.remove('danger');
            }
        }
    }, 1000);
}

/* فتح الإعدادات في أثناء اللعب — يوقف المؤقت */
function openGameSettingsAndPause() {
    pauseGameTimer();
    document.getElementById('gsoundStatus').textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    document.getElementById('gbgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    const gSV = document.getElementById('gSoundVolSlider'); if(gSV) gSV.value = st.soundVolume;
    const gSVV = document.getElementById('gSoundVolVal'); if(gSVV) gSVV.textContent = (st.soundVolume||80) + '%';
    const gBV = document.getElementById('gBgVolSlider'); if(gBV) gBV.value = st.bgVolume;
    const gBVV = document.getElementById('gBgVolVal'); if(gBVV) gBVV.textContent = (st.bgVolume||60) + '%';
    openSheet('gameSettingsSheet');
}

/* إغلاق الإعدادات وإعادة تشغيل المؤقت */
function closeGameSettingsAndResume() {
    closeSheet('gameSettingsSheet');
    resumeGameTimer();
}

/* معالج الخلفية للنقر خارج الإعدادات */
function sheetBgAndResume(e, id) {
    if (e.target.id === id) {
        closeSheet(id);
        resumeGameTimer();
    }
}

/* زر الإعدادات العالمي — يعمل من أي صفحة */
function openGlobalSettings() {
    // إذا كانت اللعبة نشطة، افتح إعدادات اللعبة مع الإيقاف
    if (document.getElementById('gameOverlay').classList.contains('active')) {
        openGameSettingsAndPause();
    } else {
        // خلاف ذلك انتقل لصفحة الإعدادات
        goTab('settings');
    }
}

/* ═══ 2. تحديث لائحة المتصدرين مع الألقاب ═══ */

/* تجاوز دالة loadLeaderboard لإضافة تتبع المرتبة الأولى */
const _origLoadLeaderboard = loadLeaderboard;
function loadLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    if (!database) {
        container.innerHTML = '<div style="text-align:center;color:var(--text2);">⚠️ قاعدة البيانات غير متصلة<br>قم بتكوين Firebase لتفعيل المنافسة</div>';
        return;
    }
    container.innerHTML = '<div style="text-align:center;">⏳ جاري التحميل...</div>';
    try {
        database.ref('leaderboard').orderByChild('bestScore').limitToLast(10).once('value', (snapshot) => {
            const players = [];
            snapshot.forEach(child => players.push({ id: child.key, ...child.val() }));
            players.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
            if (players.length === 0) {
                container.innerHTML = '<div style="text-align:center;">لا توجد نتائج بعد</div>';
                return;
            }
            // تتبع المرتبة الأولى
            try { updateFirstPlaceTracking(players); } catch(e) {}
            let html = '';
            players.forEach((p, idx) => {
                const myKey = (st.name + '_' + (st.playerUID || '')).replace(/[^a-zA-Z0-9_]/g, '_');
                const isMe = p.id === myKey || p.name === st.name;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx+1);
                html += `<div class="lb-row${isMe?' lb-row-me':''}"><span>${medal}</span><span>${p.avatar||'🧑'} ${p.name}</span><span>${p.level}</span><span>${p.bestScore}</span></div>`;
            });
            container.innerHTML = html;
        }).catch(() => { container.innerHTML = '<div style="text-align:center;">⚠️ فشل التحميل</div>'; });
    } catch (e) {
        container.innerHTML = '<div style="text-align:center;">⚠️ قاعدة البيانات غير متاحة</div>';
    }
}

/* ═══ 3. إزالة المهام والإنجازات من الملف الشخصي ═══ */
/* تجاوز renderProfileDailyTasks و renderProfileAchievements لعدم عرضهم */
function renderProfileDailyTasks() {
    /* تم نقل المهام إلى تبويب مهام فقط — لا شيء يُعرض هنا */
}

function renderProfileAchievements() {
    /* تم نقل الإنجازات إلى تبويب مهام فقط — لا شيء يُعرض هنا */
}

/* ═══ 4. تحديث updateUI لإضافة الألقاب ═══ */
const _origUpdateUI = updateUI;
function updateUI() {
    _origUpdateUI();
    // تحديث قسم الألقاب في الملف الشخصي
    try { checkSeasonReset(); } catch(e) {}
    try { renderProfileTitles(); } catch(e) {}
    // تحديث رصيد متجر الإيموجي
    const sc = document.getElementById('shopCoinsDisplay');
    if (sc) sc.textContent = st.coins;
    const ca = document.getElementById('currentAvatarDisplay');
    if (ca) ca.textContent = st.avatar || '🧑';
}

/* ═══ 5. تعديل renderTasks لعرضها في تبويب مهام ═══ */
/* دالة renderTasks الأصلية تعمل على tasksList — لا تغيير مطلوب */

/* ═══ 6. إضافة متغير عدد المشاهير بدون تكرار في الملف الشخصي ═══ */
/* goTab: تأكد من تحديث صفحة الملف الشخصي دون تكرار المهام */
const _origGoTab = goTab;
function goTab(tab) {
    _origGoTab(tab);
    if (tab === 'profile') {
        try { renderProfileTitles(); } catch(e) {}
        // لا نعرض المهام والإنجازات هنا
    }
    if (tab === 'achieve') {
        try { renderTasksFiltered(); } catch(e) {}
        try { renderAchievements(); } catch(e) {}
    }
    if (tab === 'leaderboard') {
        try { loadLeaderboard(); } catch(e) {}
        try { loadChallengeLeaderboard(); } catch(e) {}
    }
}

/* ═══ 7. تهيئة نظام الألقاب عند بدء التطبيق ═══ */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try { checkSeasonReset(); } catch(e) {}
        try { renderProfileTitles(); } catch(e) {}
    }, 3200);
});
