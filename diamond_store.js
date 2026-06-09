/* ═══════════════════════════════════════════════════════════════
   💎 DIAMOND STORE — متجر الماس الحصري
   HO Math v10 — نظام العملة النادرة الكاملة
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ① كتالوج منتجات الماس الحصرية
   كل منتج له: id, icon, name, desc, price (💎), type,
               rarity ('rare'|'epic'|'legendary'),
               expiresIn (ثواني — null = دائم)
══════════════════════════════════════════════════════════════ */
const DIAMOND_STORE_CATALOG = [
    /* ══ أطر حصرية ══ */
    {
        id: 'dframe_galaxy',
        type: 'frame',
        rarity: 'legendary',
        icon: '🌌',
        name: 'إطار المجرة',
        desc: 'إطار أسطوري يتوهج بألوان الكون — لا يُباع بالعملة العادية أبداً',
        price: 15,
        preview: 'frame_galaxy',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'dframe_fire',
        type: 'frame',
        rarity: 'epic',
        icon: '🔥',
        name: 'إطار اللهب',
        desc: 'إطار ملتهب للمحاربين — يُظهر مكانتك للجميع',
        price: 8,
        preview: 'frame_fire',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'dframe_ice',
        type: 'frame',
        rarity: 'epic',
        icon: '❄️',
        name: 'إطار الجليد الأزرق',
        desc: 'بارد كالجليد وأندر من الثلج في الصحراء',
        price: 8,
        preview: 'frame_ice',
        expiresIn: null,
        limitedSlots: null
    },

    /* ══ ألقاب حصرية ══ */
    {
        id: 'dtitle_diamond_king',
        type: 'title',
        rarity: 'legendary',
        icon: '👑',
        name: 'لقب «ملك الماس»',
        desc: 'لقب أسطوري لا يمتلكه إلا النخبة — يظهر تحت اسمك في كل مكان',
        price: 20,
        titleValue: 'diamond_king',
        titleLabel: '👑 ملك الماس',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'dtitle_genius',
        type: 'title',
        rarity: 'epic',
        icon: '🧠',
        name: 'لقب «العبقري»',
        desc: 'لمن وصل قمة الرياضيات — ميّز نفسك',
        price: 10,
        titleValue: 'diamond_genius',
        titleLabel: '🧠 العبقري',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'dtitle_math_legend',
        type: 'title',
        rarity: 'legendary',
        icon: '⚡',
        name: 'لقب «أسطورة الأرقام»',
        desc: 'اللقب الذي يُخيف المنافسين',
        price: 18,
        titleValue: 'diamond_legend',
        titleLabel: '⚡ أسطورة الأرقام',
        expiresIn: null,
        limitedSlots: null
    },

    /* ══ أفاتارات حصرية ══ */
    {
        id: 'davatar_dragon',
        type: 'avatar',
        rarity: 'legendary',
        icon: '🐉',
        name: 'أفاتار التنين',
        desc: 'تنين نادر لا يُباع إلا بالماس — رمز القوة المطلقة',
        price: 12,
        emojiValue: '🐉',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'davatar_alien',
        type: 'avatar',
        rarity: 'epic',
        icon: '👽',
        name: 'أفاتار الكائن الفضائي',
        desc: 'من كوكب آخر — لأفكار مختلفة',
        price: 7,
        emojiValue: '👽',
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'davatar_robot',
        type: 'avatar',
        rarity: 'epic',
        icon: '🤖',
        name: 'أفاتار الروبوت الذهبي',
        desc: 'ذكاء اصطناعي في قالب ذهبي',
        price: 7,
        emojiValue: '🤖',
        expiresIn: null,
        limitedSlots: null
    },

    /* ══ مضاعفات دائمة ══ */
    {
        id: 'dperm_xp2',
        type: 'perm_boost',
        rarity: 'legendary',
        icon: '⚡',
        name: 'مضاعف XP دائم ×1.5',
        desc: 'يضاعف نقاط XP بشكل دائم — يُشترى مرة واحدة فقط',
        price: 25,
        boostKey: 'permXpMult',
        boostVal: 1.5,
        oneTimePurchase: true,
        expiresIn: null,
        limitedSlots: null
    },
    {
        id: 'dperm_coinbonus',
        type: 'perm_boost',
        rarity: 'epic',
        icon: '💰',
        name: 'مكافأة عملات دائمة +20%',
        desc: 'كل عملة تكسبها تزيد بـ 20% تلقائياً — للأبد',
        price: 15,
        boostKey: 'permCoinMult',
        boostVal: 1.2,
        oneTimePurchase: true,
        expiresIn: null,
        limitedSlots: null
    }
];

/* ══════════════════════════════════════════════════════════════
   ② كتالوج العروض المحدودة (Flash Items)
   تُولَّد تلقائياً بوقت انتهاء — تختفي فعلياً بعد الوقت
══════════════════════════════════════════════════════════════ */
const DIAMOND_FLASH_POOL = [
    {
        id: 'flash_rainbow_frame',
        type: 'frame',
        rarity: 'legendary',
        icon: '🌈',
        name: 'إطار قوس قزح [محدود]',
        desc: 'يظهر مرة كل موسم فقط — لن تراه مجدداً بعد انتهاء الوقت',
        price: 5,
        preview: 'frame_rainbow',
        flashDuration: 48 * 3600 * 1000  /* 48 ساعة */
    },
    {
        id: 'flash_skull_avatar',
        type: 'avatar',
        rarity: 'epic',
        icon: '💀',
        name: 'أفاتار الجمجمة [محدود]',
        desc: 'للأبطال الذين لا يخافون — عرض لـ 24 ساعة فقط',
        price: 4,
        emojiValue: '💀',
        flashDuration: 24 * 3600 * 1000
    },
    {
        id: 'flash_crown_title',
        type: 'title',
        rarity: 'legendary',
        icon: '🏆',
        name: 'لقب «بطل الفلاش» [محدود]',
        desc: 'لمن يتحرك بسرعة — يختفي خلال ساعات',
        price: 6,
        titleValue: 'flash_champion',
        titleLabel: '🏆 بطل الفلاش',
        flashDuration: 12 * 3600 * 1000
    },
    {
        id: 'flash_ninja_avatar',
        type: 'avatar',
        rarity: 'rare',
        icon: '🥷',
        name: 'أفاتار النينجا [محدود]',
        desc: 'سريع وصامت كالنينجا — عرض 36 ساعة',
        price: 3,
        emojiValue: '🥷',
        flashDuration: 36 * 3600 * 1000
    },
    {
        id: 'flash_star_frame',
        type: 'frame',
        rarity: 'epic',
        icon: '🌟',
        name: 'إطار النجوم [محدود]',
        desc: 'إطار يتألق كالنجوم — عرض لمدة 6 ساعات فقط',
        price: 4,
        preview: 'frame_stars',
        flashDuration: 6 * 3600 * 1000
    },
    {
        id: 'flash_phoenix_title',
        type: 'title',
        rarity: 'legendary',
        icon: '🦅',
        name: 'لقب «طائر الفينيق» [محدود]',
        desc: 'يُعاد من الرماد — يظهر مرة كل أسبوع',
        price: 8,
        titleValue: 'phoenix',
        titleLabel: '🦅 طائر الفينيق',
        flashDuration: 72 * 3600 * 1000
    },
    {
        id: 'flash_wizard_avatar',
        type: 'avatar',
        rarity: 'epic',
        icon: '🧙',
        name: 'أفاتار الساحر [محدود]',
        desc: 'السحر الحقيقي — عرض لمدة 24 ساعة',
        price: 4,
        emojiValue: '🧙',
        flashDuration: 24 * 3600 * 1000
    },
    {
        id: 'flash_diamond_boost',
        type: 'temp_boost',
        rarity: 'epic',
        icon: '💎',
        name: 'مضاعف XP ×3 [محدود] — ساعة كاملة',
        desc: 'أسرع ارتقاء ممكن — ساعة كاملة من الـ XP المضاعف ×3',
        price: 5,
        boostKey: 'xpBoost',
        boostVal: 3,
        boostDurationMs: 3600 * 1000,
        flashDuration: 18 * 3600 * 1000
    }
];

/* ══════════════════════════════════════════════════════════════
   ③ حالة متجر الماس
══════════════════════════════════════════════════════════════ */
const _dStore = {
    activeFlashItems: [],    /* العروض النشطة الآن */
    _flashGeneratedDate: '', /* آخر يوم تم فيه توليد عروض */
    _flashTimer: null,       /* مؤقت تحديث العد التنازلي */
    _tab: 'permanent'        /* التبويب الحالي */
};

/* ══════════════════════════════════════════════════════════════
   ④ توليد عروض الفلاش
══════════════════════════════════════════════════════════════ */
function _generateFlashItems() {
    const _today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);

    /* استعادة من st إن وُجدت ولم تنته صلاحيتها */
    if (st._flashItems && Array.isArray(st._flashItems)) {
        const _live = st._flashItems.filter(i => i.expiresAt > Date.now() && !i.purchased);
        if (_live.length >= 2) {
            _dStore.activeFlashItems = _live;
            return;
        }
    }

    /* توليد جديد */
    const _now = Date.now();
    const _pool = [...DIAMOND_FLASH_POOL];
    /* اختيار 3 عناصر عشوائية غير مكررة */
    const _chosen = [];
    const _usedOwned = (st.ownedDiamondItems || []);
    const _notOwned = _pool.filter(p => !_usedOwned.includes(p.id));
    const _source = _notOwned.length >= 3 ? _notOwned : _pool;

    /* خوارزمية Fisher-Yates مصغّرة */
    const _shuffled = [..._source].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, _shuffled.length); i++) {
        const _item = _shuffled[i];
        _chosen.push({
            ..._item,
            expiresAt: _now + _item.flashDuration,
            purchased: false
        });
    }

    _dStore.activeFlashItems = _chosen;
    st._flashItems = _chosen;
    if (typeof saveSt === 'function') saveSt();
}

/* ══════════════════════════════════════════════════════════════
   ⑤ فتح/إغلاق متجر الماس
══════════════════════════════════════════════════════════════ */
function openDiamondStore() {
    _generateFlashItems();
    _renderDiamondStore();
    const overlay = document.getElementById('diamondStoreOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        /* أنيميشن ظهور */
        overlay.style.animation = 'none';
        void overlay.offsetWidth;
        overlay.style.animation = 'dsSlideUp 0.38s cubic-bezier(0.34,1.56,0.64,1)';
    }
    /* بدء مؤقت العد التنازلي */
    if (_dStore._flashTimer) clearInterval(_dStore._flashTimer);
    _dStore._flashTimer = setInterval(_updateFlashCountdowns, 1000);
    try { if (typeof playSound === 'function') playSound('click'); } catch(e) {}
}

function closeDiamondStore() {
    const overlay = document.getElementById('diamondStoreOverlay');
    if (overlay) overlay.style.display = 'none';
    if (_dStore._flashTimer) { clearInterval(_dStore._flashTimer); _dStore._flashTimer = null; }
}

/* ══════════════════════════════════════════════════════════════
   ⑥ رسم المتجر
══════════════════════════════════════════════════════════════ */
function _renderDiamondStore() {
    const container = document.getElementById('diamondStoreContent');
    if (!container) return;

    const _owned = st.ownedDiamondItems || [];
    const _perms = st._permBoosts || {};
    const _diamonds = st.diamonds || 0;

    /* ── رصيد الماس ── */
    const balEl = document.getElementById('dsBalanceNum');
    if (balEl) balEl.textContent = _diamonds;

    /* ── تحديد التبويب ── */
    const tab = _dStore._tab || 'permanent';

    let html = '';

    if (tab === 'flash') {
        /* ── العروض المحدودة ── */
        const _live = _dStore.activeFlashItems.filter(i => i.expiresAt > Date.now() && !i.purchased);
        if (_live.length === 0) {
            html = `<div style="text-align:center;padding:40px 20px;color:var(--text2);">
                <div style="font-size:3em;margin-bottom:10px;">⌛</div>
                <div style="font-size:0.9em;font-weight:700;">لا توجد عروض مؤقتة الآن</div>
                <div style="font-size:0.72em;color:var(--text3);margin-top:6px;">تعود قريباً — تحقق يومياً!</div>
            </div>`;
        } else {
            _live.forEach(item => {
                const _isOwned = _owned.includes(item.id);
                html += _buildDiamondCard(item, _isOwned, _diamonds, true);
            });
        }
    } else {
        /* ── المنتجات الدائمة ── */
        DIAMOND_STORE_CATALOG.forEach(item => {
            const _isOwned = _owned.includes(item.id) ||
                (item.type === 'perm_boost' && _perms[item.boostKey]);
            html += _buildDiamondCard(item, _isOwned, _diamonds, false);
        });
    }

    container.innerHTML = html;
}

function _buildDiamondCard(item, isOwned, userDiamonds, isFlash) {
    const _canAfford = userDiamonds >= item.price;
    const _rarityColors = {
        rare:      { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.5)',  label: 'نادر',    color: '#06b6d4' },
        epic:      { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.5)', label: 'ملحمي',   color: '#7c3aed' },
        legendary: { bg: 'rgba(240,185,11,0.12)', border: 'rgba(240,185,11,0.5)', label: 'أسطوري',  color: '#f0b90b' }
    };
    const _rc = _rarityColors[item.rarity] || _rarityColors.rare;

    /* العد التنازلي للعروض المحدودة */
    let _timerHtml = '';
    if (isFlash && item.expiresAt) {
        const _msLeft = Math.max(0, item.expiresAt - Date.now());
        _timerHtml = `<div class="ds-timer" data-expires="${item.expiresAt}" style="
            display:inline-flex;align-items:center;gap:4px;
            background:rgba(239,68,68,0.15);
            border:1px solid rgba(239,68,68,0.4);
            border-radius:8px;padding:3px 8px;
            font-size:0.62em;font-weight:900;color:#ef4444;
            margin-bottom:6px;
        ">⏰ ${_formatCountdown(_msLeft)}</div>`;
    }

    const _badgeHtml = `<div style="
        position:absolute;top:-1px;right:-1px;
        background:${_rc.color};color:#000;
        font-size:0.55em;font-weight:900;
        padding:3px 8px;border-radius:0 14px 0 10px;
    ">${_rc.label}</div>`;

    const _btnHtml = isOwned
        ? `<div style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.4);border-radius:12px;padding:7px 14px;font-size:0.72em;font-weight:900;color:#10b981;text-align:center;">✅ تملّكته</div>`
        : `<div onclick="buyDiamondItem('${item.id}')" style="
            background:${_canAfford ? 'linear-gradient(135deg,rgba(240,185,11,0.3),rgba(240,185,11,0.15))' : 'rgba(255,255,255,0.05)'};
            border:1.5px solid ${_canAfford ? 'rgba(240,185,11,0.6)' : 'rgba(255,255,255,0.1)'};
            border-radius:12px;padding:7px 14px;
            font-size:0.75em;font-weight:900;
            color:${_canAfford ? '#f0b90b' : 'var(--text3)'};
            text-align:center;cursor:${_canAfford ? 'pointer' : 'not-allowed'};
            transition:all 0.15s;
            display:flex;align-items:center;justify-content:center;gap:4px;
          " ${_canAfford ? `onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform=''"` : ''}>
            💎 ${item.price}
            ${!_canAfford ? `<span style="font-size:0.8em;color:var(--text3);margin-right:4px;">(تحتاج ${item.price - userDiamonds} أكثر)</span>` : ''}
          </div>`;

    return `
    <div style="
        position:relative;
        background:${_rc.bg};
        border:1.5px solid ${_rc.border};
        border-radius:16px;padding:14px;
        margin-bottom:12px;
        transition:transform 0.15s;
    ">
        ${_badgeHtml}
        ${_timerHtml}
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;">
            <div style="font-size:2.2em;line-height:1;flex-shrink:0;">${item.icon}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.88em;font-weight:900;color:var(--text);margin-bottom:3px;">${item.name}</div>
                <div style="font-size:0.65em;color:var(--text2);line-height:1.45;">${item.desc}</div>
            </div>
        </div>
        ${_btnHtml}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   ⑦ تنسيق العد التنازلي
══════════════════════════════════════════════════════════════ */
function _formatCountdown(ms) {
    if (ms <= 0) return 'انتهى!';
    const _h = Math.floor(ms / 3600000);
    const _m = Math.floor((ms % 3600000) / 60000);
    const _s = Math.floor((ms % 60000) / 1000);
    if (_h > 0) return `${_h}س ${String(_m).padStart(2,'0')}د`;
    if (_m > 0) return `${_m}:${String(_s).padStart(2,'0')}`;
    return `${_s}ث`;
}

function _updateFlashCountdowns() {
    document.querySelectorAll('.ds-timer[data-expires]').forEach(el => {
        const _ms = Math.max(0, parseInt(el.dataset.expires) - Date.now());
        el.textContent = '⏰ ' + _formatCountdown(_ms);
        if (_ms === 0) {
            /* إزالة البطاقة المنتهية */
            const _card = el.closest('[style]');
            if (_card) { _card.style.opacity = '0.3'; _card.style.pointerEvents = 'none'; }
            _generateFlashItems();
            _renderDiamondStore();
        }
    });
}

/* ══════════════════════════════════════════════════════════════
   ⑧ تنفيذ الشراء بالماس
══════════════════════════════════════════════════════════════ */
function buyDiamondItem(id) {
    /* ✅ ANTI-CHEAT: قفل لمنع الضغط المزدوج */
    if (window._dsBuyLock) return;

    /* البحث أولاً في الكتالوج الدائم، ثم في الفلاش */
    const item = DIAMOND_STORE_CATALOG.find(i => i.id === id) ||
                 _dStore.activeFlashItems.find(i => i.id === id);
    if (!item) { if (typeof showFeedback === 'function') showFeedback('⚠️ المنتج غير موجود'); return; }

    const _diamonds = st.diamonds || 0;
    if (_diamonds < item.price) {
        if (typeof showFeedback === 'function') showFeedback(`💎 تحتاج ${item.price - _diamonds} ماس إضافي`);
        return;
    }
    if (!st.ownedDiamondItems) st.ownedDiamondItems = [];
    if (st.ownedDiamondItems.includes(id)) {
        if (typeof showFeedback === 'function') showFeedback('✅ تملّكته بالفعل!');
        return;
    }

    const _confirmMsg = `${item.icon} ${item.name}\n\n${item.desc}\n\nالسعر: ${item.price} 💎 ماس`;
    if (typeof showConfirm === 'function') {
        showConfirm('💎 شراء بالماس', _confirmMsg, 'اشترِ الآن', 'إلغاء', ok => {
            if (!ok) return;
            /* ✅ تحقق مزدوج */
            if ((st.diamonds || 0) < item.price) {
                if (typeof showFeedback === 'function') showFeedback('💎 رصيد الماس غير كافٍ');
                return;
            }
            window._dsBuyLock = true;
            setTimeout(() => { window._dsBuyLock = false; }, 1500);

            st.diamonds -= item.price;
            st.ownedDiamondItems.push(id);

            /* تطبيق المنتج حسب نوعه */
            _applyDiamondItem(item);

            /* تحديث عروض الفلاش المشتراة */
            const _fi = _dStore.activeFlashItems.find(i => i.id === id);
            if (_fi) { _fi.purchased = true; st._flashItems = _dStore.activeFlashItems; }

            if (typeof saveSt === 'function') saveSt();
            if (typeof updateUI === 'function') updateUI();
            _renderDiamondStore();
            _updateDiamondDisplayAll();

            try { if (typeof playSound === 'function') playSound('purchase'); } catch(e) {}
            try { if (typeof doConfetti === 'function') doConfetti(); } catch(e) {}
            setTimeout(() => {
                try { if (typeof showFeedback === 'function') showFeedback(`💎 تم شراء ${item.name}!`); } catch(e) {}
            }, 300);
        });
    }
}

function _applyDiamondItem(item) {
    switch (item.type) {
        case 'frame':
            if (!st.ownedFrames) st.ownedFrames = ['frame_none'];
            if (!st.ownedFrames.includes(item.preview)) st.ownedFrames.push(item.preview);
            st.activeFrame = item.preview;
            try { if (typeof _applyActiveFrameGlobally === 'function') _applyActiveFrameGlobally(); } catch(e) {}
            break;

        case 'title':
            if (!st.ownedTitles) st.ownedTitles = [];
            if (!st.ownedTitles.includes(item.titleValue)) st.ownedTitles.push(item.titleValue);
            /* تفعيل اللقب تلقائياً */
            st.activeTitle = item.titleLabel;
            try { if (typeof renderProfileTitles === 'function') renderProfileTitles(); } catch(e) {}
            break;

        case 'avatar':
            if (!st.ownedEmojis) st.ownedEmojis = [];
            if (!st.ownedEmojis.includes(item.emojiValue)) st.ownedEmojis.push(item.emojiValue);
            break;

        case 'perm_boost':
            if (!st._permBoosts) st._permBoosts = {};
            st._permBoosts[item.boostKey] = item.boostVal;
            break;

        case 'temp_boost':
            /* مضاعف XP مؤقت عالي */
            try {
                if (typeof _shopState !== 'undefined') {
                    _shopState.xpBoostActive = true;
                    _shopState.xpBoostMultiplier = item.boostVal || 3;
                }
                st._xpBoostMultiplier = item.boostVal || 3;
                st._xpBoostExpires = Date.now() + (item.boostDurationMs || 3600000);
            } catch(e) {}
            break;
    }
}

/* ══════════════════════════════════════════════════════════════
   ⑨ تحديث عروض رصيد الماس في كل الواجهات
══════════════════════════════════════════════════════════════ */
function _updateDiamondDisplayAll() {
    const _d = st.diamonds || 0;
    document.querySelectorAll('.diamond-balance, [data-diamond-balance]').forEach(el => {
        el.textContent = _d;
    });
    const _balEl = document.getElementById('dsBalanceNum');
    if (_balEl) _balEl.textContent = _d;
    const _homeEl = document.getElementById('homeDiamondCount');
    if (_homeEl) _homeEl.textContent = _d;
    const _navEl = document.getElementById('navDiamondBadge');
    if (_navEl) {
        _navEl.textContent = _d;
        _navEl.style.display = _d > 0 ? 'flex' : 'none';
    }
}

/* ══════════════════════════════════════════════════════════════
   ⑩ Float animation عند كسب الماس
══════════════════════════════════════════════════════════════ */
function _showDiamondFloat(amount) {
    const el = document.createElement('div');
    el.style.cssText = `
        position:fixed;
        left:${40 + Math.random() * 20}%;
        top:35%;
        font-size:1.6em;
        font-weight:900;
        color:#00d4ff;
        text-shadow:0 0 20px rgba(0,212,255,0.8);
        z-index:99999;
        pointer-events:none;
        animation:diamondFloat 1.4s ease-out forwards;
    `;
    el.textContent = `💎 +${amount}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);

    /* حقن أنيميشن إن لم يكن موجوداً */
    if (!document.getElementById('diamondFloatKF')) {
        const s = document.createElement('style');
        s.id = 'diamondFloatKF';
        s.textContent = `
            @keyframes diamondFloat {
                0%   { transform: translateY(0) scale(1); opacity:1; }
                60%  { transform: translateY(-70px) scale(1.25); opacity:1; }
                100% { transform: translateY(-110px) scale(0.8); opacity:0; }
            }
        `;
        document.head.appendChild(s);
    }
}

/* ══════════════════════════════════════════════════════════════
   ⑪ حقن HTML متجر الماس في الصفحة
══════════════════════════════════════════════════════════════ */
function _injectDiamondStoreHTML() {
    if (document.getElementById('diamondStoreOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'diamondStoreOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:9995;
        display:none;align-items:flex-end;justify-content:center;
        background:rgba(0,0,0,0.6);
        backdrop-filter:blur(4px);
    `;
    overlay.onclick = function(e) { if (e.target === overlay) closeDiamondStore(); };

    overlay.innerHTML = `
        <div style="
            background:var(--surface,#1a1a2e);
            border-radius:24px 24px 0 0;
            width:100%;max-width:480px;
            max-height:88vh;
            display:flex;flex-direction:column;
            border-top:2.5px solid rgba(0,212,255,0.5);
            box-shadow:0 -8px 40px rgba(0,212,255,0.15);
            overflow:hidden;
        ">
            <!-- Header -->
            <div style="
                padding:16px 20px 0;
                background:linear-gradient(180deg,rgba(0,212,255,0.08),transparent);
                flex-shrink:0;
            ">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="font-size:1.8em;">💎</div>
                        <div>
                            <div style="font-size:1.0em;font-weight:900;color:var(--text);">متجر الماس الحصري</div>
                            <div style="font-size:0.65em;color:#00d4ff;font-weight:700;">منتجات نادرة لا تُشترى بالعملة العادية</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <!-- رصيد الماس -->
                        <div style="
                            background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.08));
                            border:1.5px solid rgba(0,212,255,0.5);
                            border-radius:12px;padding:5px 12px;
                            display:flex;align-items:center;gap:5px;
                        ">
                            <span style="font-size:1.1em;">💎</span>
                            <span id="dsBalanceNum" style="font-size:1.0em;font-weight:900;color:#00d4ff;">0</span>
                        </div>
                        <button onclick="closeDiamondStore()" style="
                            background:var(--surface2);border:1.5px solid var(--border);
                            border-radius:10px;width:34px;height:34px;
                            display:flex;align-items:center;justify-content:center;
                            cursor:pointer;font-size:1.1em;color:var(--text2);
                        ">✕</button>
                    </div>
                </div>

                <!-- تبويبات -->
                <div style="display:flex;gap:8px;margin-bottom:14px;">
                    <button id="dstab_permanent" onclick="_dsTabs('permanent')" style="
                        flex:1;padding:8px;border-radius:12px;font-size:0.75em;font-weight:900;
                        cursor:pointer;transition:all 0.15s;
                        background:linear-gradient(135deg,rgba(0,212,255,0.25),rgba(0,212,255,0.1));
                        border:1.5px solid rgba(0,212,255,0.6);
                        color:#00d4ff;
                    ">⭐ دائمة</button>
                    <button id="dstab_flash" onclick="_dsTabs('flash')" style="
                        flex:1;padding:8px;border-radius:12px;font-size:0.75em;font-weight:900;
                        cursor:pointer;transition:all 0.15s;
                        background:var(--surface2);
                        border:1.5px solid var(--border);
                        color:var(--text2);
                    ">⚡ عروض الفلاش</button>
                </div>
            </div>

            <!-- كيفية الحصول على الماس -->
            <div style="
                margin:0 16px 12px;
                background:linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.06));
                border:1px solid rgba(0,212,255,0.2);
                border-radius:12px;padding:10px 14px;
                flex-shrink:0;
            ">
                <div style="font-size:0.68em;font-weight:900;color:#00d4ff;margin-bottom:6px;">💎 كيف تكسب الماس؟</div>
                <div style="display:flex;flex-wrap:wrap;gap:5px;">
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">🔥 تتابع ≥15</span>
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">💀 وضع المستحيل</span>
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">🚀 مرحلة العبقري</span>
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">⚔️ تحدي 30+ نقطة</span>
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">🔗 سلسلة ≥20</span>
                    <span style="background:rgba(0,212,255,0.1);border-radius:8px;padding:3px 8px;font-size:0.6em;color:var(--text2);">🗓️ تحدي الأسبوع</span>
                </div>
            </div>

            <!-- المحتوى القابل للتمرير -->
            <div id="diamondStoreContent" style="
                overflow-y:auto;
                padding:0 16px 24px;
                flex:1;
                -webkit-overflow-scrolling:touch;
            "></div>
        </div>
    `;

    document.body.appendChild(overlay);

    /* حقن CSS المتجر */
    if (!document.getElementById('diamondStoreCSS')) {
        const s = document.createElement('style');
        s.id = 'diamondStoreCSS';
        s.textContent = `
            @keyframes dsSlideUp {
                from { transform: translateY(60px); opacity:0; }
                to   { transform: translateY(0);    opacity:1; }
            }
            #diamondStoreOverlay .ds-timer { transition: color 0.3s; }
            #diamondStoreContent::-webkit-scrollbar { width: 0; }
        `;
        document.head.appendChild(s);
    }
}

/* ══════════════════════════════════════════════════════════════
   تبديل التبويبات
══════════════════════════════════════════════════════════════ */
function _dsTabs(tab) {
    _dStore._tab = tab;
    /* تحديث مظهر الأزرار */
    ['permanent','flash'].forEach(t => {
        const btn = document.getElementById('dstab_' + t);
        if (!btn) return;
        if (t === tab) {
            btn.style.background = 'linear-gradient(135deg,rgba(0,212,255,0.25),rgba(0,212,255,0.1))';
            btn.style.border = '1.5px solid rgba(0,212,255,0.6)';
            btn.style.color = '#00d4ff';
        } else {
            btn.style.background = 'var(--surface2)';
            btn.style.border = '1.5px solid var(--border)';
            btn.style.color = 'var(--text2)';
        }
    });
    _renderDiamondStore();
    try { if (typeof playSound === 'function') playSound('click'); } catch(e) {}
}

/* ══════════════════════════════════════════════════════════════
   ⑫ تطبيق مضاعف الكوينز الدائم عند الحساب
══════════════════════════════════════════════════════════════ */
function getPermCoinMultiplier() {
    try {
        if (st._permBoosts && st._permBoosts.permCoinMult) {
            return Math.min(2.0, st._permBoosts.permCoinMult); /* أقصى 2× */
        }
    } catch(e) {}
    return 1.0;
}

function getPermXpMultiplier() {
    try {
        if (st._permBoosts && st._permBoosts.permXpMult) {
            return Math.min(2.0, st._permBoosts.permXpMult); /* أقصى 2× */
        }
    } catch(e) {}
    return 1.0;
}

/* ══════════════════════════════════════════════════════════════
   ⑬ التهيئة عند تحميل الصفحة
══════════════════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    /* تأكد من وجود حقول الماس في state */
    if (typeof st !== 'undefined') {
        if (typeof st.diamonds !== 'number') st.diamonds = 0;
        if (!st.ownedDiamondItems) st.ownedDiamondItems = [];
        if (!st._diamondSources) st._diamondSources = {};
        if (!st._permBoosts) st._permBoosts = {};
    }

    /* حقن HTML المتجر */
    setTimeout(() => {
        _injectDiamondStoreHTML();
        _updateDiamondDisplayAll();
    }, 600);
});

/* ══════════════════════════════════════════════════════════════
   تصدير الدوال عالمياً
══════════════════════════════════════════════════════════════ */
window.openDiamondStore       = openDiamondStore;
window.closeDiamondStore      = closeDiamondStore;
window.buyDiamondItem         = buyDiamondItem;
window._dsTabs                = _dsTabs;
window._showDiamondFloat      = _showDiamondFloat;
window._updateDiamondDisplayAll = _updateDiamondDisplayAll;
window.getPermCoinMultiplier  = getPermCoinMultiplier;
window.getPermXpMultiplier    = getPermXpMultiplier;
