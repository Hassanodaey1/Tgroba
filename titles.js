/* ═══════════════════════════════════════════════════
   HO Math — Competition Titles & Seasons System
   نظام الألقاب والمنافسة الموسمية
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ─── تعريف الألقاب ─── */
const COMPETITION_TITLES = [
    {
        id: 'rising_star',
        name: '🌱 النجم الصاعد',
        desc: 'احتفظ بالمرتبة الأولى 3 أيام متتالية',
        daysRequired: 3,
        cssClass: 'comp-title-bronze',
        icon: '🌱',
        color: '#cd7f32'
    },
    {
        id: 'math_warrior',
        name: '⚔️ محارب الأرقام',
        desc: 'احتفظ بالمرتبة الأولى 7 أيام متتالية',
        daysRequired: 7,
        cssClass: 'comp-title-silver',
        icon: '⚔️',
        color: '#c0c0c0'
    },
    {
        id: 'math_champion',
        name: '🏆 بطل الرياضيات',
        desc: 'احتفظ بالمرتبة الأولى 14 يوماً متتالياً',
        daysRequired: 14,
        cssClass: 'comp-title-gold',
        icon: '🏆',
        color: '#f0b90b'
    },
    {
        id: 'math_titan',
        name: '💎 تيتان الأرقام',
        desc: 'احتفظ بالمرتبة الأولى 21 يوماً متتالياً',
        daysRequired: 21,
        cssClass: 'comp-title-platinum',
        icon: '💎',
        color: '#06b6d4'
    },
    {
        id: 'math_god',
        name: '👑 إله الرياضيات',
        desc: 'احتفظ بالمرتبة الأولى 30 يوماً متتالية — بطل الموسم',
        daysRequired: 30,
        cssClass: 'comp-title-legend',
        icon: '👑',
        color: '#f0b90b'
    }
];

/* ─── مدة صلاحية اللقب: 30 يوماً ─── */
const TITLE_EXPIRY_DAYS = 30;
/* ─── مدة الموسم: 30 يوماً ─── */
const SEASON_DURATION_DAYS = 30;

/* ─── الحصول على الموسم الحالي ─── */
function getCurrentSeason() {
    if (!st.seasonStart) {
        st.seasonStart = Date.now();
        saveSt();
    }
    const elapsed = Math.floor((Date.now() - st.seasonStart) / (1000 * 60 * 60 * 24));
    const seasonNum = Math.floor(elapsed / SEASON_DURATION_DAYS) + 1;
    const daysLeft = SEASON_DURATION_DAYS - (elapsed % SEASON_DURATION_DAYS);
    return { seasonNum, daysLeft, elapsed: elapsed % SEASON_DURATION_DAYS };
}

/* ─── تحديث تتبع المرتبة الأولى — يعتمد على لائحة لعبة التحدي فقط ─── */
function updateFirstPlaceTracking(leaderboardData) {
    if (!leaderboardData || leaderboardData.length === 0) return;

    const topPlayer = leaderboardData[0];
    const myKey = st.serialNumber ? st.serialNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : '';
    const isFirst = myKey ? topPlayer.id === myKey : topPlayer.name === st.name;

    const today = todayStr();

    if (!st.firstPlaceData) {
        st.firstPlaceData = { streak: 0, lastDate: null, titles: [], currentTitle: null };
    }

    /* احسب "الأمس" بطريقة صحيحة تتعامل مع حدود الأشهر */
    const _yd = new Date();
    _yd.setDate(_yd.getDate() - 1);
    const yesterday = _yd.getFullYear() + '-' +
        String(_yd.getMonth() + 1).padStart(2, '0') + '-' +
        String(_yd.getDate()).padStart(2, '0');

    if (isFirst) {
        if (st.firstPlaceData.lastDate === today) {
            /* تم احتسابه اليوم مسبقاً — لا نغيّر شيئاً */
        } else if (st.firstPlaceData.lastDate === yesterday) {
            /* يوم متتالٍ — نزيد الـ streak */
            st.firstPlaceData.streak = (st.firstPlaceData.streak || 0) + 1;
            st.firstPlaceData.lastDate = today;
        } else {
            /* انقطع التتابع أو أول يوم — نبدأ من 1 */
            st.firstPlaceData.streak = 1;
            st.firstPlaceData.lastDate = today;
        }
    } else {
        /* لم يكن في المرتبة الأولى اليوم — نكسر الـ streak */
        if (st.firstPlaceData.lastDate !== today) {
            st.firstPlaceData.streak = 0;
        }
    }

    /* منح اللقب المناسب إن تحقق الشرط */
    checkAndAwardTitle();
    saveSt();
}

/* ─── منح اللقب المناسب ─── */
function checkAndAwardTitle() {
    if (!st.firstPlaceData) return;
    const streak = st.firstPlaceData.streak || 0;

    // Find highest earned title
    let newTitle = null;
    for (let i = COMPETITION_TITLES.length - 1; i >= 0; i--) {
        if (streak >= COMPETITION_TITLES[i].daysRequired) {
            newTitle = COMPETITION_TITLES[i];
            break;
        }
    }

    if (newTitle) {
        const alreadyHas = st.firstPlaceData.titles && st.firstPlaceData.titles.includes(newTitle.id);
        if (!alreadyHas) {
            if (!st.firstPlaceData.titles) st.firstPlaceData.titles = [];
            st.firstPlaceData.titles.push(newTitle.id);
            st.firstPlaceData.currentTitle = {
                id: newTitle.id,
                name: newTitle.name,
                earnedAt: Date.now(),
                expiresAt: Date.now() + TITLE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
            };
            saveSt();
            setTimeout(() => {
                showFeedback(`${newTitle.icon} لقب جديد: ${newTitle.name}`);
                playSound('levelup');
                doConfetti();
            }, 500);
        }
    }
}

/* ─── الحصول على اللقب الحالي (مع فحص الانتهاء) ─── */
function getActiveTitle() {
    if (!st.firstPlaceData || !st.firstPlaceData.currentTitle) return null;
    const t = st.firstPlaceData.currentTitle;
    if (Date.now() > t.expiresAt) {
        // Title expired
        st.firstPlaceData.currentTitle = null;
        saveSt();
        return null;
    }
    return t;
}

/* ─── بداية موسم جديد تلقائياً ─── */
function checkSeasonReset() {
    if (!st.seasonStart) {
        st.seasonStart = Date.now();
        saveSt();
        return;
    }
    const elapsed = Date.now() - st.seasonStart;
    const seasonMs = SEASON_DURATION_DAYS * 24 * 60 * 60 * 1000;
    if (elapsed >= seasonMs) {
        // New season
        const seasonNum = Math.floor(elapsed / seasonMs);
        st.seasonStart = st.seasonStart + seasonNum * seasonMs;
        if (st.firstPlaceData) {
            st.firstPlaceData.streak = 0;
            st.firstPlaceData.titles = [];
            // Keep currentTitle if not expired
        }
        saveSt();
        showFeedback(`🌟 بدأ موسم جديد! الجميع يبدأ من جديد`);
    }
}

/* ─── عرض قسم الألقاب في الملف الشخصي ─── */
function renderProfileTitles() {
    const container = document.getElementById('profileTitlesSection');
    if (!container) return;

    const activeTitle = getActiveTitle();
    const streak = (st.firstPlaceData && st.firstPlaceData.streak) || 0;
    const season = getCurrentSeason();

    let html = `<div class="season-badge">🏆 الموسم ${season.seasonNum} • يتبقى ${season.daysLeft} يوم</div>`;

    if (activeTitle) {
        const titleDef = COMPETITION_TITLES.find(t => t.id === activeTitle.id);
        const expiresIn = Math.ceil((activeTitle.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
        html += `
        <div class="profile-title-card">
            <div class="profile-title-icon">${titleDef ? titleDef.icon : '🏆'}</div>
            <div class="profile-title-info">
                <div class="profile-title-name">${activeTitle.name}</div>
                <div class="profile-title-desc">${titleDef ? titleDef.desc : ''}</div>
                <div class="profile-title-expiry">⏳ ينتهي خلال ${expiresIn} يوم</div>
            </div>
        </div>`;
    } else {
        html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:16px;padding:14px;text-align:center;">
            <div style="font-size:1.4em;margin-bottom:6px;">🎯</div>
            <div style="font-size:0.78em;font-weight:700;color:var(--text);">لا يوجد لقب حالياً</div>
            <div style="font-size:0.63em;color:var(--text2);margin-top:4px;">تصدر قائمة المتصدرين 3 أيام متتالية للحصول على أول لقب</div>
        </div>`;
    }

    // Show streak progress
    html += `<div style="margin-top:10px;">
        <div style="display:flex;justify-content:space-between;font-size:0.7em;color:var(--text2);margin-bottom:6px;">
            <span>🔥 أيام التصدر المتتالية</span>
            <span style="color:var(--gold);font-weight:700;">${streak} يوم</span>
        </div>`;

    // Next title progress
    const nextTitle = COMPETITION_TITLES.find(t => streak < t.daysRequired);
    if (nextTitle) {
        const prev = COMPETITION_TITLES.find(t => t.daysRequired <= streak);
        const fromDays = prev ? prev.daysRequired : 0;
        const pct = Math.round(((streak - fromDays) / (nextTitle.daysRequired - fromDays)) * 100);
        html += `
        <div class="title-progress-bar"><div class="title-progress-fill" style="width:${pct}%"></div></div>
        <div style="font-size:0.62em;color:var(--text3);margin-top:4px;">الهدف التالي: ${nextTitle.name} (${nextTitle.daysRequired} يوم)</div>`;
    } else {
        html += `<div class="title-progress-bar"><div class="title-progress-fill" style="width:100%"></div></div>
        <div style="font-size:0.62em;color:var(--gold);margin-top:4px;">🏆 حققت أعلى لقب!</div>`;
    }

    html += `</div>`;

    // All titles list
    html += `<div style="margin-top:10px;"><div class="section-label" style="margin-bottom:8px;">كل الألقاب</div>`;
    COMPETITION_TITLES.forEach(t => {
        const earned = st.firstPlaceData && st.firstPlaceData.titles && st.firstPlaceData.titles.includes(t.id);
        const isActive = activeTitle && activeTitle.id === t.id;
        html += `<div class="task-item ${earned ? 'done' : ''}" style="${isActive ? 'border-color:var(--gold);' : ''}">
            <div class="task-item-icon" style="font-size:1.5em;">${t.icon}</div>
            <div class="task-item-info">
                <div class="task-item-name">${t.name}</div>
                <div class="task-item-desc">${t.desc}</div>
            </div>
            <div class="task-right">
                <div class="task-reward">${earned ? '✅' : `${t.daysRequired}يوم`}</div>
            </div>
        </div>`;
    });
    html += `</div>`;

    container.innerHTML = html;
}

/* ─── عرض اللقب في لائحة المتصدرين ─── */
function getTitleBadgeHTML(titleId) {
    if (!titleId) return '';
    const t = COMPETITION_TITLES.find(x => x.id === titleId);
    if (!t) return '';
    return `<span class="comp-title-badge ${t.cssClass}">${t.icon} ${t.name.replace(/^[^ ]+ /, '')}</span>`;
}

/* ═══════════════════════════════════════════════════════
   overlay موسم التحدي في صفحة المنافسة
═══════════════════════════════════════════════════════ */

function openCompTitlesOverlay() {
    const overlay = document.getElementById('compTitlesOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    renderCompTitlesOverlay();
    playSound && playSound('click');
}

function closeCompTitlesOverlay() {
    const overlay = document.getElementById('compTitlesOverlay');
    if (overlay) overlay.style.display = 'none';
    playSound && playSound('click');
}

function renderCompTitlesOverlay() {
    const activeTitle = getActiveTitle();
    const streak      = (st.firstPlaceData && st.firstPlaceData.streak) || 0;
    const season      = getCurrentSeason();

    /* شارة الموسم */
    const badge = document.getElementById('ctSeasonBadge');
    if (badge) badge.textContent = `🏆 الموسم ${season.seasonNum} • يتبقى ${season.daysLeft} يوم`;

    /* بطاقة اللقب الحالي */
    const activeTitleCard = document.getElementById('ctActiveTitleCard');
    if (activeTitleCard) {
        if (activeTitle) {
            const titleDef  = COMPETITION_TITLES.find(t => t.id === activeTitle.id);
            const expiresIn = Math.ceil((activeTitle.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
            activeTitleCard.innerHTML = `
            <div class="ct-active-card">
                <div class="ct-active-icon">${titleDef ? titleDef.icon : '🏆'}</div>
                <div class="ct-active-info">
                    <div class="ct-active-name">${activeTitle.name}</div>
                    <div class="ct-active-desc">${titleDef ? titleDef.desc : ''}</div>
                    <div class="ct-active-expiry">⏳ ينتهي خلال ${expiresIn} يوم</div>
                </div>
            </div>`;
        } else {
            activeTitleCard.innerHTML = `
            <div class="ct-no-title">
                <div class="ct-no-title-icon">🎯</div>
                <div class="ct-no-title-text">لا يوجد لقب حالياً</div>
                <div class="ct-no-title-hint">تصدّر لائحة التحدي 3 أيام متتالية للحصول على أول لقب</div>
            </div>`;
        }
    }

    /* شريط التقدم */
    const streakVal    = document.getElementById('ctStreakVal');
    const progressFill = document.getElementById('ctProgressFill');
    const nextTarget   = document.getElementById('ctNextTarget');
    if (streakVal) streakVal.textContent = `${streak} يوم`;

    const nextTitle = COMPETITION_TITLES.find(t => streak < t.daysRequired);
    if (nextTitle) {
        const prev    = COMPETITION_TITLES.slice().reverse().find(t => t.daysRequired <= streak);
        const fromDays = prev ? prev.daysRequired : 0;
        const pct = Math.min(100, Math.round(((streak - fromDays) / (nextTitle.daysRequired - fromDays)) * 100));
        if (progressFill) progressFill.style.width = pct + '%';
        if (nextTarget)   nextTarget.textContent   = `الهدف التالي: ${nextTitle.icon} ${nextTitle.name} (${nextTitle.daysRequired} يوم)`;
    } else {
        if (progressFill) progressFill.style.width = '100%';
        if (nextTarget)   nextTarget.textContent   = '🏆 حققت أعلى لقب في الموسم!';
    }

    /* قائمة كل الألقاب */
    const list = document.getElementById('ctTitlesList');
    if (!list) return;
    list.innerHTML = COMPETITION_TITLES.map(t => {
        const earned   = st.firstPlaceData && st.firstPlaceData.titles && st.firstPlaceData.titles.includes(t.id);
        const isActive = activeTitle && activeTitle.id === t.id;
        const pctDone  = Math.min(100, Math.round((streak / t.daysRequired) * 100));
        return `
        <div class="ct-title-row ${earned ? 'ct-earned' : ''} ${isActive ? 'ct-active-title' : ''}">
            <div class="ct-title-icon-wrap" style="background:${earned ? t.color + '22' : 'var(--surface3)'};border-color:${earned ? t.color : 'var(--border2)'};">
                <span class="ct-title-icon" style="filter:${earned ? 'none' : 'grayscale(1) opacity(0.4)'};">${t.icon}</span>
            </div>
            <div class="ct-title-body">
                <div class="ct-title-name" style="color:${earned ? t.color : 'var(--text2)'};">${t.name}</div>
                <div class="ct-title-desc">${t.desc}</div>
                ${!earned ? `
                <div class="ct-title-mini-track">
                    <div class="ct-title-mini-fill" style="width:${pctDone}%;background:${t.color};"></div>
                </div>` : ''}
            </div>
            <div class="ct-title-badge-col">
                ${earned
                    ? `<div class="ct-earned-badge" style="background:${t.color}22;color:${t.color};border-color:${t.color}55;">✅ محقق</div>`
                    : `<div class="ct-days-badge">${t.daysRequired}<span>يوم</span></div>`}
                ${isActive ? `<div class="ct-active-badge">نشط</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

window.openCompTitlesOverlay   = openCompTitlesOverlay;
window.closeCompTitlesOverlay  = closeCompTitlesOverlay;
window.renderCompTitlesOverlay = renderCompTitlesOverlay;
