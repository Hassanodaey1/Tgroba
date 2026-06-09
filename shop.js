/* ═══════════════════════════════════════════════════════════════
   HO Math — نظام المتجر الاحترافي v2.0
   © 2026 Hassan Odaey
   ملف موحد — JS + منطق المتجر كاملاً
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   كتالوج المتجر الشامل
═══════════════════════════════════════════════════════════════ */
const SHOP_CATALOG = {

    /* ─── الأفاتارات ─── */
    avatars: [
        { id: 'av_boy',    emoji: '👦',  price: 0,   label: 'ولد', gender: 'm', free: true },
        { id: 'av_girl',   emoji: '👧',  price: 0,   label: 'بنت', gender: 'f', free: true },
        { id: 'av_astro',  emoji: '🧑‍🚀', price: 25,  label: 'رائد فضاء',  badge: '' },
        { id: 'av_vamp',   emoji: '🧛',  price: 35,  label: 'مصاص دماء',  badge: '😈' },
        { id: 'av_elf',    emoji: '🧝',  price: 30,  label: 'جني',         badge: '' },
        { id: 'av_genie',  emoji: '🧞',  price: 45,  label: 'مارد علاء الدين', badge: '✨' },
        { id: 'av_fox',    emoji: '🦊',  price: 28,  label: 'ثعلب ذكي',   badge: '' },
        { id: 'av_tiger',  emoji: '🐯',  price: 30,  label: 'نمر',         badge: '' },
        { id: 'av_lion',   emoji: '🦁',  price: 38,  label: 'أسد',         badge: '👑' },
        { id: 'av_panda',  emoji: '🐼',  price: 25,  label: 'باندا',       badge: '' },
        { id: 'av_unicorn',emoji: '🦄',  price: 55,  label: 'يونيكورن',    badge: '🌈', hot: true },
        { id: 'av_dragon', emoji: '🐲',  price: 42,  label: 'تنين',        badge: '🔥' },
        { id: 'av_eagle',  emoji: '🦅',  price: 25,  label: 'نسر',         badge: '' },
        { id: 'av_wolf',   emoji: '🐺',  price: 30,  label: 'ذئب',         badge: '' },
        { id: 'av_owl',    emoji: '🦉',  price: 28,  label: 'بومة',        badge: '' },
        { id: 'av_grad',   emoji: '🧑‍🎓', price: 60,  label: 'خريج',        badge: '🎓', lvlReq: 5 },
        { id: 'av_coder',  emoji: '🧑‍💻', price: 65,  label: 'مبرمج',       badge: '💻', lvlReq: 5 },
        { id: 'av_sci',    emoji: '🧑‍🔬', price: 75,  label: 'عالم',        badge: '⚗️', lvlReq: 8 },
        { id: 'av_prince', emoji: '🤴',  price: 100, label: 'أمير',        badge: '👑', lvlReq: 10, hot: true },
        { id: 'av_princess',emoji: '👸', price: 100, label: 'أميرة',       badge: '👑', lvlReq: 10, hot: true },
        { id: 'av_hero',   emoji: '🦸',  price: 90,  label: 'بطل خارق',   badge: '⚡', lvlReq: 8 },
        { id: 'av_wizard', emoji: '🧙',  price: 80,  label: 'ساحر',        badge: '🪄', lvlReq: 7 },
        { id: 'av_ninja',  emoji: '🥷',  price: 95,  label: 'نينجا',       badge: '⚔️', lvlReq: 10, new: true },
        { id: 'av_robot',  emoji: '🤖',  price: 110, label: 'روبوت',       badge: '🔩', lvlReq: 12, new: true },
        { id: 'av_alien',  emoji: '👽',  price: 130, label: 'فضائي',       badge: '🛸', lvlReq: 15, hot: true, new: true },
    ],

    /* ─── المستهلكات ─── */
    consumables: [
        {
            id: 'heart_pack_1',
            icon: '❤️',
            name: '+1 قلب',
            desc: 'أضف قلباً الآن في اللعبة',
            price: 15,
            action: 'addHeart',
            gameOnly: true,
            urgency: true,
            oneTimeGameOnly: true,
        },
        {
            id: 'heart_pack_3',
            icon: '💖',
            name: 'باقة 3 قلوب',
            desc: 'أضف 3 قلوب لاستمرار المشوار',
            price: 40,
            action: 'addHearts',
            actionVal: 3,
            badge: 'قيمة',
            gameOnly: true,
            oneTimeGameOnly: true,
        },
        {
            id: 'heart_store3',
            icon: '💗',
            name: 'احتياط 3 قلوب',
            desc: 'تُخزَّن في مخزونك وتُستخدم تلقائياً عند انتهاء القلوب',
            price: 35,
            action: 'storeHeart',
            actionVal: 3,
            badge: 'ذكي',
            hot: true,
        },
        {
            id: 'skip_q',
            icon: '⏭️',
            name: 'تخطّي سؤال',
            desc: 'تخطَّ السؤال الصعب بدون خسارة',
            price: 12,
            action: 'skipQuestion',
            gameOnly: true,
            oneTimeGameOnly: true,
        },
        {
            id: 'skip_pack3',
            icon: '⏭️',
            name: 'باقة 3 تخطّيات',
            desc: 'احصل على 3 تخطّيات تُخزَّن وتُستخدم تلقائياً',
            price: 28,
            action: 'storeSkip',
            actionVal: 3,
            badge: 'وفّر',
        },
        {
            id: 'remove_wrong',
            icon: '🗑️',
            name: 'حذف خيار',
            desc: 'احذف إجابة خاطئة لتسهيل الاختيار',
            price: 14,
            action: 'removeWrong',
            gameOnly: true,
            oneTimeGameOnly: true,
        },
        {
            id: 'remove_pack3',
            icon: '🗑️',
            name: 'باقة 3 حذف خيار',
            desc: '3 استخدامات تُخزَّن في مخزونك',
            price: 32,
            action: 'storeRemove',
            actionVal: 3,
            badge: 'وفّر',
        },
        {
            id: 'time_plus10',
            icon: '⏰',
            name: '+10 ثواني',
            desc: 'أضف 10 ثوان للمؤقت الآن',
            price: 18,
            action: 'addTime',
            actionVal: 10,
            gameOnly: true,
            timerOnly: true,
            oneTimeGameOnly: true,
        },
        {
            id: 'xp_boost_2x',
            icon: '⚡',
            name: 'مضاعف XP ×2',
            desc: 'ضاعف نقاط XP للجلسة القادمة',
            price: 45,
            action: 'xpBoost',
            actionVal: 2,
            badge: 'شعبي',
            hot: true,
        },
        {
            id: 'xp_boost_3x',
            icon: '🚀',
            name: 'مضاعف XP ×3',
            desc: 'ثلاثة أضعاف XP للجلسة القادمة',
            price: 90,
            action: 'xpBoost',
            actionVal: 3,
            badge: 'قوي',
        },
        {
            id: 'coin_bonus',
            icon: '💰',
            name: '+20 عملة',
            desc: 'أضف 20 عملة لرصيدك فوراً',
            price: 0,
            action: 'coinBonus',
            actionVal: 20,
            adReward: true,
            badge: 'مجاني',
        },
        {
            id: 'shield_day',
            icon: '🛡️',
            name: 'درع الحماية',
            desc: 'احمِ تقدمك من الخسارة لجلسة كاملة',
            price: 25,
            action: 'buyShield',
            badge: 'مستحسن',
        },
        {
            id: 'hint_pack',
            icon: '💡',
            name: 'باقة 5 تلميحات',
            desc: 'احصل على تلميح مجاني 5 مرات',
            price: 35,
            action: 'hintPack',
            actionVal: 5,
        },
    ],

    /* ─── الحزم الكبيرة ─── */
    bundles: [
        {
            id: 'starter_pack',
            icon: '🎁',
            name: 'حزمة المبتدئ',
            desc: '+50 عملة + 3 قلوب + مضاعف XP ×2 للجلسة القادمة',
            originalPrice: 35,
            price: 20,
            badge: 'وفّر 43%',
            items: [
                { type: 'coins', val: 50 },
                { type: 'hearts', val: 3 },
                { type: 'xpBoost', val: 2 },
            ],
            hot: true,
            limited: false,
        },
        {
            id: 'champion_pack',
            icon: '🏆',
            name: 'حزمة البطل',
            desc: '+100 عملة + رمز حصري + درع + مضاعف XP ×3',
            originalPrice: 80,
            price: 45,
            badge: 'وفّر 44%',
            items: [
                { type: 'coins', val: 100 },
                { type: 'avatar', val: '🦁' },
                { type: 'shield', val: 1 },
                { type: 'xpBoost', val: 3 },
            ],
            hot: true,
            lvlReq: 5,
        },
        {
            id: 'genius_pack',
            icon: '👑',
            name: 'حزمة العبقري',
            desc: '+200 عملة + رمز أمير + رمز أميرة + مضاعف XP ×5 + درع أسبوعي',
            originalPrice: 180,
            price: 90,
            badge: 'وفّر 50% 🔥',
            items: [
                { type: 'coins', val: 200 },
                { type: 'avatar', val: '🤴' },
                { type: 'avatar', val: '👸' },
                { type: 'xpBoost', val: 5 },
                { type: 'shield', val: 7 },
            ],
            hot: true,
            lvlReq: 10,
        },
    ],
};

/* ═══════════════════════════════════════════════════════════════
   حالة المتجر
═══════════════════════════════════════════════════════════════ */
var _shopState = {
    activeTab: 'avatars',
    xpBoostActive: false,
    xpBoostMultiplier: 1,
    hintsRemaining: 0,
    _urgentOfferShown: false,
};

/* ═══════════════════════════════════════════════════════════════
   ① واجهة المتجر الرئيسية
═══════════════════════════════════════════════════════════════ */
function renderShop() {
    _renderShopHeader();
    _renderShopTabs();
    _renderActiveShopTab();
    _checkAndShowUrgentOffer();
    _updateInventoryBar();
}

function _renderShopHeader() {
    const coins = document.getElementById('shopCoinsDisplay');
    if (coins) coins.textContent = st.coins;
    const coins2 = document.getElementById('shopCoinsDisplay2');
    if (coins2) coins2.textContent = st.coins;
}

function _renderShopTabs() {
    const tabs = document.getElementById('shopTabsRow');
    if (!tabs) return;

    const tabDefs = [
        { key: 'avatars',     icon: '🧑',  label: 'رموز' },
        { key: 'frames',      icon: '🖼️', label: 'إطارات', badge: 'جديد!' },
        { key: 'consumables', icon: '⚡',  label: 'مستهلكات' },
        { key: 'bundles',     icon: '🎁',  label: 'حزم', badge: 'وفّر!' },
        { key: 'exclusives',  icon: '✨',  label: 'الحصريات', badge: '💎', diamond: true },
    ];

    tabs.innerHTML = tabDefs.map(t => {
        const active = _shopState.activeTab === t.key;
        const isDiamond = t.diamond;
        const badge  = t.badge
            ? `<span style="position:absolute;top:-7px;right:-3px;background:${isDiamond ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : '#ef4444'};color:#fff;font-size:0.52em;font-weight:900;padding:1px 5px;border-radius:7px;white-space:nowrap;z-index:10;box-shadow:0 1px 3px rgba(0,0,0,0.4);">${t.badge}</span>`
            : '';
        const activeStyle = isDiamond
            ? 'background:linear-gradient(135deg,#00d4ff22,#7c3aed22);color:#00d4ff;border-color:rgba(0,212,255,0.6);'
            : 'background:var(--gold);color:#000;border-color:var(--gold);';
        const inactiveStyle = isDiamond
            ? 'background:rgba(0,212,255,0.06);color:#00d4ff;border-color:rgba(0,212,255,0.25);'
            : 'background:var(--surface3);color:var(--text2);border-color:var(--border2);';
        return `<button class="shop-tab-btn${active ? ' active' : ''}"
            onclick="_setShopTab('${t.key}');playSound('click');"
            style="flex:1;min-width:0;padding:7px 2px;border-radius:12px;font-size:0.62em;font-weight:800;white-space:nowrap;text-align:center;${active ? activeStyle : inactiveStyle}border:1px solid;position:relative;transition:all 0.18s ease;overflow:visible;"
        >${t.icon} ${t.label}${badge}</button>`;
    }).join('');
}

function _setShopTab(tab) {
    _shopState.activeTab = tab;
    _renderShopTabs();
    _renderActiveShopTab();
}

function _renderActiveShopTab() {
    const container = document.getElementById('shopItemsContainer');
    if (!container) return;
    switch (_shopState.activeTab) {
        case 'avatars':     _renderAvatarGrid(container); break;
        case 'frames':      _renderFrames(container);     break;
        case 'consumables': _renderConsumables(container); break;
        case 'bundles':     _renderBundles(container);    break;
        case 'exclusives':  _renderExclusives(container); break;
    }
}

/* ═══════════════════════════════════════════════════════════════
   ② عرض الأفاتارات
═══════════════════════════════════════════════════════════════ */
function _renderAvatarGrid(container) {
    const items = SHOP_CATALOG.avatars.filter(item => {
        if (item.gender && item.gender !== st.gender) return false;
        return true;
    });

    container.innerHTML = `
        <div style="padding:10px 0 6px;">
            <div style="font-size:0.7em;color:var(--text2);text-align:center;margin-bottom:10px;">
                🧑 رمزك الحالي: <strong style="font-size:1.2em;">${st.avatar || '🧑'}</strong>
                <button onclick="openAvatarPickerOverlay();playSound('click');" style="background:var(--surface3);border:1px solid var(--border2);color:var(--text);border-radius:10px;padding:3px 10px;font-size:0.9em;margin-right:8px;cursor:pointer;">تغيير</button>
            </div>
            <div id="avatarShopGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;"></div>
        </div>
    `;

    const grid = document.getElementById('avatarShopGrid');
    if (!grid) return;

    grid.innerHTML = items.map(item => {
        const owned    = st.ownedEmojis && st.ownedEmojis.includes(item.emoji);
        const active   = st.avatar === item.emoji;
        const locked   = !owned && (item.lvlReq && st.level < item.lvlReq);
        const canAfford = st.coins >= item.price;

        let bottomContent = '';
        if (owned) {
            bottomContent = active
                ? `<div style="font-size:0.55em;color:var(--green);font-weight:900;">✅ مفعّل</div>`
                : `<div style="font-size:0.55em;color:var(--text2);font-weight:700;">مملوك</div>`;
        } else if (locked) {
            bottomContent = `<div style="font-size:0.55em;color:var(--orange);">🔒 Lv.${item.lvlReq}</div>`;
        } else {
            bottomContent = `<div style="font-size:0.6em;font-weight:900;color:${canAfford ? 'var(--gold)' : 'var(--red)'};">${item.price}💰</div>`;
        }

        const badges = [];
        if (item.hot) badges.push(`<span style="background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-size:0.5em;padding:1px 4px;border-radius:5px;font-weight:900;">🔥 رائج</span>`);
        if (item.new) badges.push(`<span style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:0.5em;padding:1px 4px;border-radius:5px;font-weight:900;">جديد</span>`);

        return `
            <div onclick="${owned ? `selectEmojiFromShop('${item.emoji}')` : locked ? `showFeedback('🔒 يفتح عند المستوى ${item.lvlReq}')` : `buyAvatarFromShop('${item.emoji}',${item.price},'${item.label}')`}"
                style="
                    background:${active ? 'linear-gradient(135deg,var(--gold)22,var(--gold)11)' : owned ? 'var(--surface2)' : 'var(--surface3)'};
                    border:2px solid ${active ? 'var(--gold)' : owned ? 'rgba(16,185,129,0.4)' : locked ? 'rgba(255,255,255,0.08)' : canAfford ? 'var(--border2)' : 'rgba(239,68,68,0.25)'};
                    border-radius:14px;padding:8px 4px;text-align:center;cursor:${locked ? 'not-allowed' : 'pointer'};
                    position:relative;transition:all 0.18s ease;opacity:${locked ? 0.6 : 1};
                    ${active ? 'box-shadow:0 0 12px rgba(240,185,11,0.35);' : ''}
                ">
                ${badges.length ? `<div style="position:absolute;top:-6px;left:0;right:0;display:flex;justify-content:center;gap:2px;">${badges.join('')}</div>` : ''}
                <div style="font-size:1.8em;margin-bottom:2px;">${item.emoji}</div>
                <div style="font-size:0.58em;font-weight:700;color:var(--text);margin-bottom:2px;min-height:10px;">${item.label}</div>
                ${bottomContent}
            </div>
        `;
    }).join('');
}

function buyAvatarFromShop(emoji, price, label) {
    /* ✅ ANTI-CHEAT: قفل لمنع النقر المزدوج */
    if (window._shopBuyLock) return;
    window._shopBuyLock = true;
    setTimeout(() => { window._shopBuyLock = false; }, 1500);
    if (!st.ownedEmojis) st.ownedEmojis = ['👦'];
    if (st.ownedEmojis.includes(emoji)) {
        selectEmojiFromShop(emoji);
        return;
    }
    if (price === 0) {
        st.ownedEmojis.push(emoji);
        saveSt(); playSound('purchase');
        _renderActiveShopTab(); updateUI();
        showFeedback('🎉 أُضيف! فعّله من هنا أو من الملف الشخصي');
        return;
    }
    if (st.coins < price) {
        _showInsufficientCoinsOffer(price - st.coins, label);
        return;
    }
    showConfirm('🛍️ شراء رمز', `شراء ${label} (${emoji}) بـ ${price} عملة؟`, 'نعم اشتري', 'إلغاء', ok => {
        if (!ok) return;
        st.coins -= price;
        st.ownedEmojis.push(emoji);
        saveSt(); playSound('purchase');
        _renderActiveShopTab(); updateUI();
        showFeedback(`🎉 تم شراء ${emoji}! اضغط للتفعيل`);
    });
}

function selectEmojiFromShop(emoji) {
    if (!st.ownedEmojis || !st.ownedEmojis.includes(emoji)) return;
    st.profilePhoto = null;
    st.avatar = emoji;
    saveSt();
    updateUI();
    _renderActiveShopTab();
    playSound('click');
    showFeedback(`✅ تم تفعيل ${emoji}`);
}

/* ═══════════════════════════════════════════════════════════════
   كتالوج الإطارات — SVG ديكورية v2.0
═══════════════════════════════════════════════════════════════ */
var FRAMES_CATALOG = [
    {
        id: 'frame_none',
        label: 'بدون إطار',
        price: 0,
        free: true,
        svgContent: () => '',
    },
    {
        id: 'frame_calculator',
        label: '🔢 أرقام',
        price: 15,
        svgContent: () => {
            const items = ['1','2','3','+','×','÷','=','%','π','∞','√','7'];
            return items.map((char, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 56 * Math.cos(rad);
                const y = 65 + 56 * Math.sin(rad);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="900" fill="#f0b90b" font-family="monospace" transform="rotate(${angle+90}, ${x}, ${y})">${char}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="53" fill="none" stroke="#f0b90b" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.5"/>`;
        },
    },
    {
        id: 'frame_tools',
        label: '📐 أدوات',
        price: 20,
        svgContent: () => {
            const icons = ['✏️','📐','📏','📚','🖊️','📓','✏️','📐'];
            return icons.map((icon, i) => {
                const angle = (i / icons.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 54 * Math.cos(rad);
                const y = 65 + 54 * Math.sin(rad);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="11" transform="rotate(${angle+90}, ${x}, ${y})">${icon}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="51" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.6"/>
             <circle cx="65" cy="65" r="57" fill="none" stroke="#06b6d4" stroke-width="1" stroke-dasharray="2 4" opacity="0.3"/>`;
        },
    },
    {
        id: 'frame_equations',
        label: '➕ معادلات',
        price: 25,
        svgContent: () => {
            const items = ['a²','b²','=','c²','∑','∫','Δ','∓','≠','≈','∝','∞'];
            return items.map((char, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 55 * Math.cos(rad);
                const y = 65 + 55 * Math.sin(rad);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="#10b981" font-family="serif" transform="rotate(${angle+90}, ${x}, ${y})">${char}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="52" fill="none" stroke="#10b981" stroke-width="2.5" opacity="0.6"/>
             <circle cx="65" cy="65" r="59" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="1 5" opacity="0.3"/>`;
        },
    },
    {
        id: 'frame_stars',
        label: '⭐ نجوم',
        price: 18,
        svgContent: () => {
            const items = ['⭐','5','🌟','10','⭐','15','🌟','20'];
            return items.map((icon, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 54 * Math.cos(rad);
                const y = 65 + 54 * Math.sin(rad);
                if (isNaN(icon)) {
                    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12">${icon}</text>`;
                }
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="7" font-weight="900" fill="#f59e0b" font-family="monospace">${icon}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="51" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.5"/>`;
        },
    },
    {
        id: 'frame_geometry',
        label: '📐 هندسة',
        price: 30,
        hot: true,
        svgContent: () => {
            const shapes = [
                `<polygon points="65,11 72,24 58,24" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
                `<circle cx="119" cy="65" r="7" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
                `<rect x="54" y="106" width="22" height="14" rx="3" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
                `<circle cx="11" cy="65" r="7" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
                `<polygon points="38,30 45,43 31,43" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
                `<polygon points="92,88 99,101 85,101" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
                `<rect x="15" y="38" width="14" height="10" rx="2" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
                `<rect x="100" y="82" width="14" height="10" rx="2" fill="none" stroke="#a855f7" stroke-width="1.5"/>`,
            ];
            return shapes.join('') +
            `<circle cx="65" cy="65" r="53" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5 3" opacity="0.5"/>`;
        },
    },
    {
        id: 'frame_champion',
        label: '🏆 بطل',
        price: 50,
        lvlReq: 5,
        svgContent: () => {
            const items = ['🏆','1','🥇','★','🏆','∞','🥇','★'];
            return items.map((icon, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 54 * Math.cos(rad);
                const y = 65 + 54 * Math.sin(rad);
                const isSpecial = isNaN(icon.replace('★',''));
                if (isSpecial || icon === '★') {
                    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${icon === '★' ? '14' : '13'}" fill="${icon === '★' ? '#f0b90b' : ''}">${icon}</text>`;
                }
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="900" fill="#f0b90b">${icon}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="51" fill="none" stroke="#f0b90b" stroke-width="3" opacity="0.7"/>
             <circle cx="65" cy="65" r="57" fill="none" stroke="#f0b90b" stroke-width="1" stroke-dasharray="2 3" opacity="0.3"/>`;
        },
    },
    {
        id: 'frame_science',
        label: '🔬 علوم',
        price: 35,
        hot: true,
        svgContent: () => {
            const items = ['🔬','⚗️','🔭','🧪','⚛️','🧲','🔬','⚗️'];
            return items.map((icon, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 54 * Math.cos(rad);
                const y = 65 + 54 * Math.sin(rad);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12" transform="rotate(${angle+90}, ${x}, ${y})">${icon}</text>`;
            }).join('') +
            `<circle cx="65" cy="65" r="51" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.5"/>`;
        },
    },
    {
        id: 'frame_legend',
        label: '⭐ أسطوري',
        price: 80,
        lvlReq: 12,
        hot: true,
        svgContent: () => {
            const items = ['π','e','∞','√','∑','∫','Δ','φ','α','β','γ','θ'];
            const outer = items.map((char, i) => {
                const angle = (i / items.length) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x = 65 + 57 * Math.cos(rad);
                const y = 65 + 57 * Math.sin(rad);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="900" font-family="serif" fill="url(#goldGrad${i})" transform="rotate(${angle+90}, ${x}, ${y})">${char}</text>`;
            }).join('');
            return `<defs>
                <linearGradient id="goldGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f0b90b"/>
                    <stop offset="50%" stop-color="#fff5b0"/>
                    <stop offset="100%" stop-color="#e5a800"/>
                </linearGradient>
            </defs>` + outer.replace(/url\(#goldGrad\d+\)/g, 'url(#goldGrad0)') +
            `<circle cx="65" cy="65" r="53" fill="none" stroke="url(#goldGrad0)" stroke-width="3" opacity="0.8"/>
             <circle cx="65" cy="65" r="59" fill="none" stroke="#f0b90b" stroke-width="1" stroke-dasharray="1 4" opacity="0.4"/>
             <circle cx="65" cy="65" r="48" fill="none" stroke="#f0b90b" stroke-width="0.5" opacity="0.2"/>`;
        },
    },
];

/* ═══════════════════════════════════════════════════════════════
   ③ عرض الإطارات — SVG v2.0
═══════════════════════════════════════════════════════════════ */
function _renderFrames(container) {
    if (!st.ownedFrames) st.ownedFrames = ['frame_none'];
    const currentFrame = st.activeFrame || 'frame_none';
    const avatarEmoji  = st.avatar || '🧑';

    container.innerHTML = `
        <div style="padding:10px 0 6px;">
            <div style="font-size:0.68em;color:var(--text2);text-align:center;margin-bottom:12px;padding:8px;background:rgba(240,185,11,0.08);border-radius:10px;border:1px solid rgba(240,185,11,0.2);">
                🖼️ الإطارات تظهر حول أيقونتك في الملف الشخصي والمنافسات
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" id="framesGrid"></div>
        </div>
    `;

    const grid = container.querySelector('#framesGrid');
    if (!grid) return;

    grid.innerHTML = FRAMES_CATALOG.map(frame => {
        const owned     = st.ownedFrames.includes(frame.id);
        const active    = currentFrame === frame.id;
        const locked    = !owned && frame.lvlReq && st.level < frame.lvlReq;
        const canAfford = st.coins >= (frame.price || 0);
        const isFree    = frame.price === 0;

        /* معاينة SVG مصغّرة */
        const svgPreview = `
            <div style="position:relative;width:60px;height:60px;margin:0 auto 6px;">
                <div style="position:absolute;inset:0;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:1.6em;overflow:hidden;${active ? 'box-shadow:0 0 10px rgba(240,185,11,0.4);' : ''}">${avatarEmoji}</div>
                <svg style="position:absolute;inset:-8px;width:calc(100% + 16px);height:calc(100% + 16px);pointer-events:none;" viewBox="0 0 130 130">${frame.svgContent()}</svg>
            </div>`;

        let bottomContent = '';
        if (owned) {
            bottomContent = active
                ? `<div style="font-size:0.55em;color:var(--green);font-weight:900;">✅ مفعّل</div>`
                : `<div style="font-size:0.55em;color:var(--text2);font-weight:700;">اضغط للتفعيل</div>`;
        } else if (locked) {
            bottomContent = `<div style="font-size:0.55em;color:var(--orange);">🔒 Lv.${frame.lvlReq}</div>`;
        } else if (isFree) {
            bottomContent = `<div style="font-size:0.55em;color:var(--green);font-weight:900;">مجاني!</div>`;
        } else {
            bottomContent = `<div style="font-size:0.6em;font-weight:900;color:${canAfford ? 'var(--gold)' : 'var(--red)'};">${frame.price}💰</div>`;
        }

        const hotBadge = frame.hot
            ? `<span style="position:absolute;top:-6px;left:0;right:0;display:flex;justify-content:center;"><span style="background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-size:0.5em;padding:1px 5px;border-radius:5px;font-weight:900;">🔥 رائج</span></span>`
            : '';

        const clickFn = owned
            ? `selectFrame('${frame.id}')`
            : locked
                ? `showFeedback('🔒 يفتح عند المستوى ${frame.lvlReq}')`
                : `buyFrame('${frame.id}')`;

        return `
            <div onclick="${clickFn};playSound('click');"
                style="
                    background:${active ? 'linear-gradient(135deg,rgba(240,185,11,0.18),rgba(240,185,11,0.08))' : owned ? 'var(--surface2)' : 'var(--surface3)'};
                    border:2px solid ${active ? 'var(--gold)' : owned ? 'rgba(16,185,129,0.4)' : locked ? 'rgba(255,255,255,0.08)' : canAfford || isFree ? 'var(--border2)' : 'rgba(239,68,68,0.25)'};
                    border-radius:14px;padding:10px 6px 8px;text-align:center;
                    cursor:${locked ? 'not-allowed' : 'pointer'};
                    position:relative;transition:all 0.18s ease;
                    opacity:${locked ? 0.6 : 1};
                    ${active ? 'box-shadow:0 0 12px rgba(240,185,11,0.3);' : ''}
                ">
                ${hotBadge}
                ${svgPreview}
                <div style="font-size:0.6em;font-weight:700;color:var(--text);margin-bottom:3px;">${frame.label}</div>
                ${bottomContent}
            </div>
        `;
    }).join('');
}

function buyFrame(frameId) {
    /* ✅ ANTI-CHEAT: قفل لمنع النقر المزدوج */
    if (window._shopBuyLock) return;
    const frame = FRAMES_CATALOG.find(f => f.id === frameId);
    if (!frame) return;
    if (!st.ownedFrames) st.ownedFrames = ['frame_none'];
    if (st.ownedFrames.includes(frameId)) { selectFrame(frameId); return; }

    if (frame.price === 0) {
        st.ownedFrames.push(frameId);
        st.activeFrame = frameId;
        saveSt(); playSound('purchase');
        _applyActiveFrameGlobally();
        _renderActiveShopTab(); updateUI();
        showFeedback('🎉 تم الحصول على الإطار!');
        return;
    }
    if (st.coins < frame.price) {
        _showInsufficientCoinsOffer(frame.price - st.coins, frame.label);
        return;
    }
    showConfirm('🖼️ شراء إطار', `شراء إطار "${frame.label}" بـ ${frame.price} عملة؟`, 'نعم اشتري', 'إلغاء', ok => {
        if (!ok) return;
        st.coins -= frame.price;
        st.ownedFrames.push(frameId);
        st.activeFrame = frameId;
        saveSt(); playSound('purchase');
        _applyActiveFrameGlobally();
        _renderActiveShopTab(); updateUI();
        showFeedback(`🎉 تم شراء وتفعيل إطار ${frame.label}!`);
    });
}

function selectFrame(frameId) {
    if (!st.ownedFrames || !st.ownedFrames.includes(frameId)) return;
    st.activeFrame = frameId;
    saveSt();
    _applyActiveFrameGlobally();
    updateUI();
    _renderActiveShopTab();
    playSound('click');
    const frame = FRAMES_CATALOG.find(f => f.id === frameId);
    showFeedback(`✅ تم تفعيل الإطار ${frame ? frame.label : ''}`);
}

/* ═══════════════════════════════════════════════════════════════
   تطبيق الإطار النشط على جميع عناصر الأفاتار في الواجهة — SVG v2.0
   تُستدعى من updateUI() في ui.js
═══════════════════════════════════════════════════════════════ */
function _applyActiveFrameGlobally() {
    const frameId  = st.activeFrame || 'frame_none';
    const frame    = FRAMES_CATALOG.find(f => f.id === frameId);
    const svgHTML  = (frame && frame.svgContent) ? frame.svgContent() : '';
    const hasFrame = !!svgHTML;

    /* ─── خريطة: الأفاتار → الحلقة البنفسجية المجاورة ─── */
    const avatarMap = [
        {
            avatarId:     'headerAvatar',
            ringSelector: '.avatar-wrap .avatar-ring',
        },
        {
            avatarId:     'spProfileAvatarImg',
            ringSelector: '#spProfileAvatarWrap .profile-avatar-ring',
        },
        {
            avatarId:     'profileAvatarImg',
            ringSelector: null,
        },
    ];

    avatarMap.forEach(({ avatarId, ringSelector }) => {
        const el = document.getElementById(avatarId);
        if (!el) return;

        /* ① إخفاء الحلقة البنفسجية الدوّارة عند وجود إطار، وإظهارها عند إزالته */
        if (ringSelector) {
            const ring = document.querySelector(ringSelector);
            if (ring) ring.style.display = hasFrame ? 'none' : '';
        }

        /* ② إزالة أي border قديم */
        el.style.border    = '';
        el.style.boxShadow = '';

        const wrapperId = avatarId + '_frameWrapper';
        let wrapper = document.getElementById(wrapperId);

        if (!hasFrame) {
            /* بدون إطار — إزالة SVG overlay إن وجد */
            if (wrapper) wrapper.remove();
            return;
        }

        /* ③ تأكّد أن الأب position:relative */
        const parent = el.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        /* ④ إنشاء أو تحديث SVG overlay */
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = wrapperId;
            wrapper.style.cssText = 'position:absolute;inset:-8px;width:calc(100% + 16px);height:calc(100% + 16px);pointer-events:none;z-index:10;';
            if (parent) parent.appendChild(wrapper);
        }
        wrapper.innerHTML = `<svg style="width:100%;height:100%;" viewBox="0 0 130 130">${svgHTML}</svg>`;
    });
}

window._applyActiveFrameGlobally = _applyActiveFrameGlobally;
window.buyFrame    = buyFrame;
window.selectFrame = selectFrame;

/* ═══════════════════════════════════════════════════════════════
   ③ عرض المستهلكات
═══════════════════════════════════════════════════════════════ */
function _renderConsumables(container) {
    const inGame = typeof G !== 'undefined' && !G.ended &&
                   document.getElementById('gameOverlay') &&
                   document.getElementById('gameOverlay').classList.contains('active');

    /* ✅ FIX-DUPLICATE: داخل اللعبة = كل العناصر، خارجها = الدائمة فقط (بدون gameOnly) */
    const items = SHOP_CATALOG.consumables.filter(item => {
        if (!inGame && item.gameOnly) return false;
        if (item.timerOnly && (!G || !G.hasTimer)) return false;
        return true;
    });

    container.innerHTML = `
        <div style="padding:8px 0;">
            ${inGame ? `<div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:700;color:#ef4444;text-align:center;">⚔️ أنت في اللعبة — العناصر تُطبَّق فوراً!</div>` : ''}
            ${_shopState.xpBoostActive ? `<div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:900;color:var(--accent);text-align:center;">⚡ مضاعف XP ×${_shopState.xpBoostMultiplier} مفعّل!</div>` : ''}
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${items.map(item => _buildConsumableCard(item)).join('')}
            </div>
        </div>
    `;
}

function _buildConsumableCard(item) {
    const canAfford = st.coins >= item.price;
    const isAdReward = item.adReward;

    /* حالة "تم الشراء" للعناصر الفورية مرة واحدة */
    const isPurchasedOnce = item.oneTimeGameOnly && item.gameOnly &&
                            typeof G !== 'undefined' && G && !G.ended &&
                            G._purchasedInstant && G._purchasedInstant[item.id];

    /* ✅ FIX-ADREWARD: احسب حالة القيد الزمني لعناصر الإعلان */
    let adOnCooldown = false;
    let adCooldownLabel = '📺 شاهد';
    if (isAdReward) {
        const _msLeft = (24 * 60 * 60 * 1000) - (Date.now() - (st._lastAdRewardTime || 0));
        if (_msLeft > 0) {
            adOnCooldown = true;
            const _hLeft = Math.ceil(_msLeft / (60 * 60 * 1000));
            adCooldownLabel = `⏳ ${_hLeft}س`;
        }
    }

    if (isPurchasedOnce) {
        /* ─── بطاقة مقفلة بصرياً — مثل الأفاتارات المغلقة تماماً ─── */
        return `
            <div style="
                display:flex;align-items:center;gap:12px;
                background:var(--surface3);
                border:1.5px solid rgba(255,255,255,0.08);
                border-radius:14px;padding:12px 14px;
                cursor:not-allowed;position:relative;overflow:hidden;
                opacity:0.5;
            ">
                <!-- طبقة القفل فوق الأيقونة -->
                <div style="position:relative;flex-shrink:0;width:36px;height:36px;">
                    <div style="font-size:1.8em;filter:grayscale(1);opacity:0.4;">${item.icon}</div>
                    <div style="
                        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                        font-size:1.1em;
                    ">🔒</div>
                </div>
                <div style="flex:1;">
                    <div style="font-size:0.82em;font-weight:900;color:var(--text3);">${item.name}</div>
                    <div style="font-size:0.65em;color:var(--text3);margin-top:2px;">${item.desc}</div>
                </div>
                <div style="font-size:1.4em;color:rgba(255,255,255,0.15);">🔒</div>
            </div>
        `;
    }

    return `
        <div onclick="buyConsumable('${item.id}');playSound('click');"
            style="
                display:flex;align-items:center;gap:12px;
                background:${item.urgency ? 'linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.05))' : 'var(--surface2)'};
                border:1.5px solid ${item.urgency ? 'rgba(239,68,68,0.4)' : canAfford ? 'var(--border2)' : 'rgba(239,68,68,0.2)'};
                border-radius:14px;padding:12px 14px;cursor:pointer;
                transition:all 0.18s ease;position:relative;overflow:hidden;
            ">
            ${item.hot ? `<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--accent2));border-radius:14px 14px 0 0;"></div>` : ''}
            <div style="font-size:1.8em;flex-shrink:0;">${item.icon}</div>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                    <span style="font-size:0.82em;font-weight:900;color:var(--text);">${item.name}</span>
                    ${item.badge ? `<span style="background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-size:0.55em;font-weight:900;padding:1px 6px;border-radius:7px;">${item.badge}</span>` : ''}
                    ${item.hot ? `<span style="background:rgba(239,68,68,0.2);color:#ef4444;font-size:0.55em;padding:1px 5px;border-radius:6px;font-weight:700;">🔥 رائج</span>` : ''}
                </div>
                <div style="font-size:0.68em;color:var(--text2);">${item.desc}</div>
            </div>
            <div style="text-align:center;flex-shrink:0;">
                ${isAdReward
                    ? `<div style="font-size:0.72em;font-weight:900;color:${adOnCooldown ? 'var(--text3)' : 'var(--green)'};">${adCooldownLabel}</div><div style="font-size:0.6em;color:var(--text3);">${adOnCooldown ? 'قريباً' : 'مجاني'}</div>`
                    : `<div style="font-size:0.85em;font-weight:900;color:${canAfford ? 'var(--gold)' : '#ef4444'};">${item.price}💰</div>
                       <div style="font-size:0.58em;color:${canAfford ? 'var(--green)' : '#ef4444'};">${canAfford ? '✅ يمكنك' : '❌ لا يكفي'}</div>`
                }
            </div>
        </div>
    `;
}

function _buildNonGameConsumables() {
    /* ✅ FIX: لا تكرار — _renderConsumables تتولى عرض كل العناصر بشكل صحيح */
    return '';
}

/* ═══════════════════════════════════════════════════════════════
   ④ عرض الحزم الكبيرة
═══════════════════════════════════════════════════════════════ */
function _renderBundles(container) {
    container.innerHTML = `
        <div style="padding:8px 0;">
            <div style="font-size:0.68em;color:var(--text2);text-align:center;margin-bottom:12px;padding:8px;background:rgba(240,185,11,0.08);border-radius:10px;border:1px solid rgba(240,185,11,0.2);">
                💡 الحزم تمنحك <strong style="color:var(--gold);">قيمة أعلى بسعر أقل</strong> من الشراء الفردي
            </div>
            ${SHOP_CATALOG.bundles.map(bundle => _buildBundleCard(bundle)).join('')}
        </div>
    `;
}

function _buildBundleCard(bundle) {
    const canAfford   = st.coins >= bundle.price;
    const lvlLocked   = bundle.lvlReq && st.level < bundle.lvlReq;
    const savings     = bundle.originalPrice - bundle.price;
    const savingsPct  = Math.round((savings / bundle.originalPrice) * 100);

    return `
        <div onclick="${lvlLocked ? `showFeedback('🔒 يفتح عند المستوى ${bundle.lvlReq}')` : `buyBundle('${bundle.id}');playSound('click');`}"
            style="
                border-radius:18px;overflow:hidden;margin-bottom:12px;cursor:${lvlLocked ? 'not-allowed' : 'pointer'};
                opacity:${lvlLocked ? 0.65 : 1};
                border:2px solid ${canAfford && !lvlLocked ? 'var(--gold)' : 'var(--border2)'};
                background:${canAfford && !lvlLocked ? 'linear-gradient(135deg,rgba(240,185,11,0.08),rgba(240,185,11,0.03))' : 'var(--surface2)'};
                position:relative;
            ">
            <div style="background:linear-gradient(135deg,var(--gold),var(--gold2));padding:6px 14px;display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:0.72em;font-weight:900;color:#000;">${bundle.badge || ''}</div>
                <div style="font-size:0.68em;font-weight:700;color:#000;">توفير ${savings} عملة (${savingsPct}%)</div>
            </div>
            <div style="padding:12px 14px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <div style="font-size:2em;">${bundle.icon}</div>
                    <div>
                        <div style="font-size:0.9em;font-weight:900;color:var(--text);">${bundle.name}</div>
                        <div style="font-size:0.65em;color:var(--text2);">${bundle.desc}</div>
                    </div>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">
                    ${bundle.items.map(it => `
                        <span style="background:var(--surface3);border:1px solid var(--border2);border-radius:8px;padding:2px 8px;font-size:0.62em;color:var(--text2);">
                            ${it.type === 'coins' ? `💰 +${it.val}` : it.type === 'hearts' ? `❤️ +${it.val}` : it.type === 'avatar' ? `${it.val} رمز` : it.type === 'xpBoost' ? `⚡ XP ×${it.val}` : it.type === 'shield' ? `🛡️ ${it.val} يوم` : it.val}
                        </span>
                    `).join('')}
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <span style="font-size:0.65em;color:var(--text3);text-decoration:line-through;">${bundle.originalPrice}💰</span>
                        <span style="font-size:1.1em;font-weight:900;color:${canAfford ? 'var(--gold)' : '#ef4444'};margin-right:6px;"> ${bundle.price}💰</span>
                    </div>
                    ${lvlLocked
                        ? `<span style="font-size:0.7em;color:var(--orange);">🔒 Lv.${bundle.lvlReq}</span>`
                        : canAfford
                            ? `<span style="background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-size:0.72em;font-weight:900;padding:6px 16px;border-radius:12px;">اشترِ الآن</span>`
                            : `<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:0.68em;font-weight:700;padding:6px 14px;border-radius:12px;">تحتاج ${bundle.price - st.coins}💰 أكثر</span>`
                    }
                </div>
            </div>
        </div>
    `;
}

/* ═══════════════════════════════════════════════════════════════
   ⑤ تنفيذ شراء المستهلكات
═══════════════════════════════════════════════════════════════ */
function buyConsumable(id) {
    /* ✅ ANTI-CHEAT: قفل عالمي لمنع النقر المتسارع */
    if (window._shopBuyLock) return;
    const item = SHOP_CATALOG.consumables.find(i => i.id === id);
    if (!item) return;

    /* ─── قيد "مرة واحدة لكل جلسة" لعناصر شراء واستخدام فوري ─── */
    if (item.oneTimeGameOnly && item.gameOnly) {
        if (!G || G.ended) { return; }
        if (!G._purchasedInstant) G._purchasedInstant = {};
        if (G._purchasedInstant[item.id]) { return; }
    }

    if (item.adReward) {
        /* ✅ FIX-ADREWARD: قيد 24 ساعة لمنع الحصول على عملات مجانية بلا حدود */
        const _now = Date.now();
        const _lastAd = st._lastAdRewardTime || 0;
        const _cooldownMs = 24 * 60 * 60 * 1000; /* 24 ساعة */
        if (_now - _lastAd < _cooldownMs) {
            const _msLeft = _cooldownMs - (_now - _lastAd);
            const _hLeft  = Math.ceil(_msLeft / (60 * 60 * 1000));
            showFeedback(`⏳ يمكنك الحصول على المكافأة بعد ${_hLeft} ساعة`);
            return;
        }
        showConfirm('📺 مكافأة مشاهدة', 'شاهد إعلاناً قصيراً للحصول على 20 عملة مجاناً!\n(مرة واحدة كل 24 ساعة)', 'شاهد الآن', 'لاحقاً', ok => {
            if (!ok) return;
            /* تحقق مزدوج: لا نعطي المكافأة إذا مرر اللاعب الحوار بسرعة */
            const _checkNow = Date.now();
            if (_checkNow - (st._lastAdRewardTime || 0) < _cooldownMs) {
                showFeedback('⏳ المكافأة غير متاحة الآن');
                return;
            }
            st.coins += 20;
            st._lastAdRewardTime = _checkNow;
            saveSt(); updateUI(); renderShop();
            playSound('coin');
            showFeedback('💰 حصلت على 20 عملة! (متاحة مجدداً بعد 24 ساعة)');
        });
        return;
    }

    if (st.coins < item.price) {
        _showInsufficientCoinsOffer(item.price - st.coins, item.name);
        return;
    }

    showConfirm(`${item.icon} ${item.name}`, `${item.desc}\n\nالسعر: ${item.price} عملة`, 'اشترِ الآن', 'إلغاء', ok => {
        if (!ok) { window._shopBuyLock = false; return; }
        /* ✅ ANTI-CHEAT: تحقق مزدوج من الرصيد داخل الـ callback لمنع race condition */
        if (st.coins < item.price) {
            _showInsufficientCoinsOffer(item.price - st.coins, item.name);
            window._shopBuyLock = false;
            return;
        }
        window._shopBuyLock = true;
        setTimeout(() => { window._shopBuyLock = false; }, 1500);
        st.coins -= item.price;

        /* تسجيل الشراء الفوري لمنع التكرار */
        if (item.oneTimeGameOnly && item.gameOnly && G && !G.ended) {
            if (!G._purchasedInstant) G._purchasedInstant = {};
            G._purchasedInstant[item.id] = true;
        }

        switch (item.action) {
            case 'addHeart':
                if (G && !G.ended) {
                    G.livesLeft = Math.min(G.livesLeft + 1, 9);
                    if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
                }
                break;
            case 'addHearts':
                if (G && !G.ended) {
                    G.livesLeft = Math.min(G.livesLeft + (item.actionVal || 3), 9);
                    if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
                }
                break;
            case 'skipQuestion':
                if (G && !G.ended && !G.answered) {
                    G.answered = true;
                    setTimeout(() => { if (!G.ended) loadQuestion(); }, 200);
                }
                break;
            case 'removeWrong':
                if (G && !G.ended && !G.answered) {
                    const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')];
                    const wrong = btns.filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer);
                    if (wrong.length > 0) {
                        const r = wrong[Math.floor(Math.random() * wrong.length)];
                        r.style.opacity = '0.15';
                        r.style.pointerEvents = 'none';
                    }
                }
                break;
            case 'addTime':
                if (G && G.hasTimer) {
                    G.timeLeft = Math.min(G.maxTime, G.timeLeft + (item.actionVal || 10));
                    const bar = document.getElementById('timerBar');
                    if (bar) bar.style.width = (G.timeLeft / G.maxTime * 100) + '%';
                    const bt = document.getElementById('bigTimer');
                    if (bt) bt.textContent = G.timeLeft;
                }
                break;
            case 'xpBoost':
                _shopState.xpBoostActive = true;
                _shopState.xpBoostMultiplier = item.actionVal || 2;
                st._xpBoostMultiplier = _shopState.xpBoostMultiplier;
                st._xpBoostExpires = Date.now() + 30 * 60 * 1000;
                break;
            case 'buyShield':
                st.dailyShieldUsed = false;
                st.lastShieldDate = null;
                break;
            case 'hintPack':
                if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0, hint: 0 };
                if (typeof st.inventory.hint !== 'number') st.inventory.hint = 0;
                st.inventory.hint = Math.min(99, st.inventory.hint + (item.actionVal || 5));
                /* احتفظ بالتوافق مع الكود القديم */
                _shopState.hintsRemaining = st.inventory.hint;
                st._hintsRemaining = st.inventory.hint;
                _updateInventoryBar();
                showFeedback(`💡 أُضيف ${item.actionVal || 5} تلميحات لمخزونك!`);
                break;
            case 'coinBonus':
                st.coins += item.actionVal || 20;
                break;
            /* ─── عناصر المخزون الدائم ─── */
            case 'storeSkip':
                if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0 };
                st.inventory.skip = Math.min(99, (st.inventory.skip || 0) + (item.actionVal || 3));
                _updateInventoryBar();
                showFeedback(`⏭️ أُضيف ${item.actionVal} تخطّيات لمخزونك!`);
                break;
            case 'storeHeart':
                if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0 };
                st.inventory.heart = Math.min(99, (st.inventory.heart || 0) + (item.actionVal || 3));
                _updateInventoryBar();
                showFeedback(`💗 أُضيف ${item.actionVal} قلوب لمخزونك!`);
                break;
            case 'storeRemove':
                if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0 };
                st.inventory.remove = Math.min(99, (st.inventory.remove || 0) + (item.actionVal || 3));
                _updateInventoryBar();
                showFeedback(`🗑️ أُضيف ${item.actionVal} حذف خيار لمخزونك!`);
                break;
        }

        saveSt(); updateUI(); renderShop();
        playSound('purchase');
        showFeedback(`${item.icon} تم الشراء بنجاح!`);
    });
}

/* ═══════════════════════════════════════════════════════════════
   ⑥ تنفيذ شراء الحزم
═══════════════════════════════════════════════════════════════ */
function buyBundle(id) {
    /* ✅ ANTI-CHEAT: قفل لمنع الشراء المزدوج */
    if (window._shopBuyLock) return;
    const bundle = SHOP_CATALOG.bundles.find(b => b.id === id);
    if (!bundle) return;
    if (bundle.lvlReq && st.level < bundle.lvlReq) {
        showFeedback(`🔒 يتطلب المستوى ${bundle.lvlReq}`);
        return;
    }
    if (st.coins < bundle.price) {
        _showInsufficientCoinsOffer(bundle.price - st.coins, bundle.name);
        return;
    }
    showConfirm(`${bundle.icon} ${bundle.name}`, `${bundle.desc}\n\nالسعر: ${bundle.price}💰 (بدلاً من ${bundle.originalPrice}💰)`, 'اشترِ الحزمة', 'إلغاء', ok => {
        if (!ok) return;
        /* ✅ ANTI-CHEAT: تحقق مزدوج من الرصيد داخل الـ callback */
        if (st.coins < bundle.price) { _showInsufficientCoinsOffer(bundle.price - st.coins, bundle.name); return; }
        window._shopBuyLock = true;
        setTimeout(() => { window._shopBuyLock = false; }, 1500);
        st.coins -= bundle.price;
        bundle.items.forEach(item => {
            switch (item.type) {
                case 'coins':   st.coins += Math.min(item.val, 500); break;
                case 'hearts':  if (G && !G.ended) G.livesLeft = Math.min(G.livesLeft + item.val, 9); break;
                case 'avatar':
                    if (!st.ownedEmojis) st.ownedEmojis = [];
                    if (!st.ownedEmojis.includes(item.val)) st.ownedEmojis.push(item.val);
                    break;
                case 'xpBoost':
                    _shopState.xpBoostActive = true;
                    _shopState.xpBoostMultiplier = Math.min(item.val, 5);
                    st._xpBoostMultiplier = _shopState.xpBoostMultiplier;
                    st._xpBoostExpires = Date.now() + 60 * 60 * 1000;
                    break;
                case 'shield':
                    st.dailyShieldUsed = false;
                    break;
            }
        });
        saveSt(); updateUI(); renderShop();
        playSound('purchase');
        if (typeof doConfetti === 'function') doConfetti();
        showFeedback(`${bundle.icon} تم شراء ${bundle.name}!`);
    });
}
/* ═══════════════════════════════════════════════════════════════
   ⑦ العرض العاجل
═══════════════════════════════════════════════════════════════ */
function showUrgentHeartOffer() {
    if (_shopState._urgentOfferShown) return;
    if (G.livesLeft > 0) return;

    _shopState._urgentOfferShown = true;

    const overlay = document.createElement('div');
    overlay.id = 'urgentOfferOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.75);animation:fadeInBg 0.25s ease;';

    const canAfford15 = st.coins >= 15;
    const canAfford40 = st.coins >= 40;

    overlay.innerHTML = `
        <div style="
            background:linear-gradient(145deg,var(--surface),var(--surface2));
            border:2.5px solid rgba(239,68,68,0.6);
            border-radius:24px;padding:24px 20px;text-align:center;max-width:300px;width:88%;
            animation:levelUpPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        ">
            <div style="font-size:2.5em;margin-bottom:6px;">💔</div>
            <div style="font-size:1.05em;font-weight:900;color:#ef4444;margin-bottom:4px;">انتهت قلوبك!</div>
            <div style="font-size:0.75em;color:var(--text2);margin-bottom:16px;">لا تخسر تقدمك الآن — استمر!</div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
                <button onclick="buyUrgentItem('heart_pack_1')" style="
                    background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;
                    border:none;border-radius:14px;padding:12px 16px;font-size:0.82em;font-weight:900;
                    cursor:${canAfford15 ? 'pointer' : 'not-allowed'};opacity:${canAfford15 ? 1 : 0.6};
                    display:flex;justify-content:space-between;align-items:center;
                ">
                    <span>❤️ +1 قلب</span>
                    <span style="background:rgba(0,0,0,0.25);border-radius:8px;padding:2px 10px;">15💰</span>
                </button>
                <button onclick="buyUrgentItem('heart_pack_3')" style="
                    background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;
                    border:2px solid rgba(240,185,11,0.5);border-radius:14px;padding:12px 16px;
                    font-size:0.82em;font-weight:900;cursor:${canAfford40 ? 'pointer' : 'not-allowed'};
                    opacity:${canAfford40 ? 1 : 0.6};display:flex;justify-content:space-between;align-items:center;
                ">
                    <span>💖 +3 قلوب <span style="background:rgba(0,0,0,0.2);font-size:0.7em;padding:1px 5px;border-radius:5px;">قيمة!</span></span>
                    <span style="background:rgba(0,0,0,0.25);border-radius:8px;padding:2px 10px;">40💰</span>
                </button>
                <button onclick="goTab('shop');_setShopTab('consumables');document.getElementById('urgentOfferOverlay')?.remove();playSound('click');" style="
                    background:var(--surface3);border:1px solid var(--border2);color:var(--text2);
                    border-radius:14px;padding:10px;font-size:0.75em;cursor:pointer;
                ">🛍️ عرض كل المتجر</button>
            </div>
            <div style="font-size:0.65em;color:var(--text3);margin-bottom:12px;">رصيدك الحالي: ${st.coins}💰</div>
            <button onclick="document.getElementById('urgentOfferOverlay').remove();playSound('close');"
                style="background:var(--surface3);border:1px solid var(--border2);color:var(--text2);border-radius:12px;padding:8px 20px;font-size:0.75em;cursor:pointer;">
                إنهاء اللعبة
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
    playSound('warning');
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function buyUrgentItem(id) {
    const overlay = document.getElementById('urgentOfferOverlay');
    if (overlay) overlay.remove();
    _shopState._urgentOfferShown = false;
    if (typeof buyInstant === 'function') {
        buyInstant(id);
    } else {
        buyConsumable(id);
    }
}

/* ═══════════════════════════════════════════════════════════════
   ⑧ عرض "عملات غير كافية"
═══════════════════════════════════════════════════════════════ */
function _showInsufficientCoinsOffer(needed, itemName) {
    playSound('wrong');
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99991;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);';
    overlay.innerHTML = `
        <div style="
            background:var(--surface);border:2px solid rgba(240,185,11,0.4);
            border-radius:22px;padding:22px 18px;text-align:center;max-width:290px;width:88%;
            animation:levelUpPop 0.35s ease;
        ">
            <div style="font-size:2em;margin-bottom:6px;">💸</div>
            <div style="font-size:0.9em;font-weight:900;color:var(--text);margin-bottom:4px;">عملاتك لا تكفي!</div>
            <div style="font-size:0.7em;color:var(--text2);margin-bottom:14px;">
                تحتاج <strong style="color:var(--gold);">${needed} عملة</strong> إضافية للحصول على ${itemName}
            </div>
            <div style="font-size:0.72em;font-weight:700;color:var(--text2);margin-bottom:8px;text-align:right;">💡 كيف تكسب المزيد؟</div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;text-align:right;">
                <div style="background:var(--surface2);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--text);">🏆 أنهِ <strong>المهام اليومية</strong> ← تصل إلى +21💰</div>
                <div style="background:var(--surface2);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--text);">🎮 العب بصعوبة أعلى ← تكسب أكثر لكل إجابة</div>
                <div style="background:var(--surface2);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--text);">🔥 حافظ على تتابع 10+ إجابات ← مكافأة إضافية</div>
                <div style="background:var(--surface2);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--text);">🏅 افتح إنجازات ← تصل إلى +20💰 للإنجاز</div>
                <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--accent2);cursor:pointer;" onclick="buyConsumable('coin_bonus');this.closest('[style*=fixed]').remove();">📺 شاهد إعلاناً ← +20💰 مجاناً</div>
            </div>
            <button onclick="this.closest('[style*=fixed]').remove();playSound('click');"
                style="background:var(--gold);color:#000;border:none;border-radius:14px;padding:10px 28px;font-size:0.8em;font-weight:900;cursor:pointer;width:100%;">
                حسناً، سأكسب المزيد!
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/* ═══════════════════════════════════════════════════════════════
   ⑨ عرض عاجل ذكي
═══════════════════════════════════════════════════════════════ */
function _checkAndShowUrgentOffer() {
    if (G && !G.ended && G.livesLeft === 1 && G.hasTimer) {
        _showStickyBanner('❤️ قلب واحد متبقٍّ! احمِ نفسك', 'urgent', () => { goTab('shop'); _setShopTab('consumables'); });
    } else if (!_shopState.xpBoostActive && st.level >= 3 && st.totalGames >= 10) {
        _showStickyBanner('⚡ فعّل مضاعف XP وارتقِ أسرع!', 'promo', () => { goTab('shop'); _setShopTab('consumables'); });
    }
}

var _stickyBannerTimeout = null;
function _showStickyBanner(msg, type, onClick) {
    const existing = document.getElementById('shopStickyBanner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'shopStickyBanner';
    const colors = {
        urgent: { bg: 'linear-gradient(135deg,#ef4444,#dc2626)', border: '#ef4444' },
        promo:  { bg: 'linear-gradient(135deg,var(--accent),var(--accent2))',  border: 'var(--accent)' },
    };
    const c = colors[type] || colors.promo;
    banner.style.cssText = `
        position:fixed;bottom:calc(var(--nav-h) + 8px + var(--safe-bottom));left:12px;right:12px;
        z-index:9998;background:${c.bg};border:1.5px solid ${c.border};
        border-radius:14px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;
        cursor:pointer;animation:slideUpBanner 0.35s ease;box-shadow:0 4px 20px rgba(0,0,0,0.4);
    `;
    banner.innerHTML = `
        <span style="font-size:0.78em;font-weight:900;color:#fff;">${msg}</span>
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="background:rgba(255,255,255,0.25);color:#fff;font-size:0.68em;font-weight:900;padding:4px 12px;border-radius:10px;">اشترِ الآن</span>
            <span style="color:rgba(255,255,255,0.7);font-size:0.9em;cursor:pointer;" onclick="event.stopPropagation();document.getElementById('shopStickyBanner').remove();">✕</span>
        </div>
    `;
    banner.onclick = () => { banner.remove(); if (onClick) onClick(); };
    document.body.appendChild(banner);
    _stickyBannerTimeout = setTimeout(() => banner.remove(), 6000);
}

/* ═══════════════════════════════════════════════════════════════
   ⑩ دوال التوافق مع الكود القديم
═══════════════════════════════════════════════════════════════ */
function renderEmojiShop()  { renderShop(); }

function toggleEmojiShop() {
    const container = document.getElementById('emojiShopContainer');
    const btn = document.getElementById('shopToggleBtn');
    if (!container) return;
    const isOpen = container.style.display !== 'none';
    container.style.display = isOpen ? 'none' : 'block';
    if (btn) btn.textContent = isOpen ? '🛍️ المتجر' : '✖️ إغلاق';
    if (!isOpen) renderShop();
    playSound(isOpen ? 'close' : 'open');
}

function buyOrSelectEmoji(emoji, price) {
    if (st.ownedEmojis && st.ownedEmojis.includes(emoji)) {
        selectEmojiFromShop(emoji);
    } else {
        buyAvatarFromShop(emoji, price, emoji);
    }
}

function buyEmojiShopOnly(emoji, price, label) {
    buyAvatarFromShop(emoji, price, label);
}

/* ═══════════════════════════════════════════════════════════════
   ⑫ شريط المخزون داخل اللعبة — البند 5.4
═══════════════════════════════════════════════════════════════ */
function _updateInventoryBar() {
    const bar = document.getElementById('helperInventoryBar');
    if (!bar) return;
    const inv = st.inventory || { skip: 0, heart: 0, remove: 0 };
    const skip   = inv.skip   || 0;
    const heart  = inv.heart  || 0;
    const remove = inv.remove || 0;
    const hint   = inv.hint   || 0;
    const hasAny = skip > 0 || heart > 0 || remove > 0 || hint > 0;
    bar.style.display = hasAny ? 'flex' : 'none';

    const skipChip   = document.getElementById('invSkipChip');
    const heartChip  = document.getElementById('invHeartChip');
    const removeChip = document.getElementById('invRemoveChip');
    const hintChip   = document.getElementById('invHintChip');
    const skipEl     = document.getElementById('invSkipCount');
    const heartEl    = document.getElementById('invHeartCount');
    const removeEl   = document.getElementById('invRemoveCount');
    const hintEl     = document.getElementById('invHintCount');

    if (skipEl   && skipChip)   { skipEl.textContent   = skip;   skipChip.style.display   = skip   > 0 ? 'flex' : 'none'; }
    if (heartEl  && heartChip)  { heartEl.textContent  = heart;  heartChip.style.display  = heart  > 0 ? 'flex' : 'none'; }
    if (removeEl && removeChip) { removeEl.textContent = remove; removeChip.style.display = remove > 0 ? 'flex' : 'none'; }
    if (hintEl   && hintChip)   { hintEl.textContent   = hint;   hintChip.style.display   = hint   > 0 ? 'flex' : 'none'; }
}

/* استخدام المخزون — يُستدعى من useHelper في questions.js — البند 5.3 */
function useHelperFromInventory(type) {
    if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0 };
    const inv = st.inventory;
    if (type === 'skip'   && inv.skip   > 0) { inv.skip--;   saveSt(); _updateInventoryBar(); return true; }
    if (type === 'heart'  && inv.heart  > 0) { inv.heart--;  saveSt(); _updateInventoryBar(); return true; }
    if (type === 'remove' && inv.remove > 0) { inv.remove--; saveSt(); _updateInventoryBar(); return true; }
    if (type === 'hint'   && (inv.hint  || 0) > 0) { inv.hint--;  saveSt(); _updateInventoryBar(); return true; }
    return false;
}

/* ═══════════════════════════════════════════════════════════════
   ⑬ مضاعف XP
═══════════════════════════════════════════════════════════════ */
function getXpMultiplier() {
    if (!_shopState.xpBoostActive) return 1;
    if (st._xpBoostExpires && Date.now() > st._xpBoostExpires) {
        _shopState.xpBoostActive = false;
        _shopState.xpBoostMultiplier = 1;
        st._xpBoostMultiplier = 1;
        return 1;
    }
    return _shopState.xpBoostMultiplier || 1;
}

/* ═══════════════════════════════════════════════════════════════
   ✨ EXCLUSIVES — كتالوج الحصريات (عروض مؤقتة بالجواهر فقط)
   كل عرض له: id, type, rarity, icon, name, desc, price(💎),
   flashDuration(ms), badgeLabel, items[]
═══════════════════════════════════════════════════════════════ */
const EXCLUSIVES_CATALOG = [

    /* ══ عروض الإطارات الحصرية ══ */
    {
        id: 'ex_frame_neon',
        type: 'frame',
        rarity: 'legendary',
        icon: '⚡',
        name: 'إطار النيون المتوهج',
        desc: 'إطار أسطوري يتوهج بألوان النيون — متاح فقط لـ 24 ساعة',
        diamondPrice: 6,
        preview: 'frame_neon',
        flashDuration: 24 * 3600 * 1000,
        badgeLabel: '24 ساعة',
    },
    {
        id: 'ex_frame_cosmos',
        type: 'frame',
        rarity: 'legendary',
        icon: '🌌',
        name: 'إطار الكون اللامتناهي',
        desc: 'كوكبات ونجوم تدور حول أيقونتك — فرصة نادرة جداً',
        diamondPrice: 9,
        preview: 'frame_cosmos',
        flashDuration: 48 * 3600 * 1000,
        badgeLabel: '48 ساعة',
    },
    {
        id: 'ex_frame_royal',
        type: 'frame',
        rarity: 'epic',
        icon: '👑',
        name: 'إطار الملوك الذهبي',
        desc: 'مزخرف بالذهب الملكي — للذين يستحقون القمة',
        diamondPrice: 5,
        preview: 'frame_royal',
        flashDuration: 36 * 3600 * 1000,
        badgeLabel: '36 ساعة',
    },

    /* ══ عروض الألقاب الحصرية ══ */
    {
        id: 'ex_title_shadow',
        type: 'title',
        rarity: 'legendary',
        icon: '🥷',
        name: 'لقب «الظل الرياضي»',
        desc: 'لقب أسطوري للصامتين الذين يتصدرون القائمة',
        diamondPrice: 12,
        titleValue: 'ex_shadow',
        titleLabel: '🥷 الظل الرياضي',
        flashDuration: 12 * 3600 * 1000,
        badgeLabel: '12 ساعة فقط!',
        urgent: true,
    },
    {
        id: 'ex_title_supreme',
        type: 'title',
        rarity: 'legendary',
        icon: '🔱',
        name: 'لقب «الأعلى مرتبةً»',
        desc: 'اللقب الذي لا يحمله إلا واحد من كل ألف لاعب',
        diamondPrice: 18,
        titleValue: 'ex_supreme',
        titleLabel: '🔱 الأعلى مرتبةً',
        flashDuration: 72 * 3600 * 1000,
        badgeLabel: '3 أيام',
    },

    /* ══ عروض الأفاتارات الحصرية ══ */
    {
        id: 'ex_avatar_phoenix',
        type: 'avatar',
        rarity: 'legendary',
        icon: '🦅',
        name: 'أفاتار طائر الفينيق',
        desc: 'يولد من جديد مع كل تحدٍّ — ظهور موسمي',
        diamondPrice: 8,
        emojiValue: '🦅',
        flashDuration: 48 * 3600 * 1000,
        badgeLabel: '48 ساعة',
    },
    {
        id: 'ex_avatar_crystal',
        type: 'avatar',
        rarity: 'epic',
        icon: '🔮',
        name: 'أفاتار كرة الكريستال',
        desc: 'رمز من يرى المستقبل ويحسب قبل الجميع',
        diamondPrice: 5,
        emojiValue: '🔮',
        flashDuration: 24 * 3600 * 1000,
        badgeLabel: '24 ساعة',
    },

    /* ══ حزم الحصريات (قيمة استثنائية) ══ */
    {
        id: 'ex_bundle_diamond_starter',
        type: 'bundle',
        rarity: 'epic',
        icon: '💎',
        name: 'حزمة الماس الأولى',
        desc: '+150 عملة ذهبية + درعان + مضاعف XP ×2 لـ 24 ساعة',
        diamondPrice: 10,
        bundleItems: [
            { type: 'coins',   val: 150 },
            { type: 'shields', val: 2   },
            { type: 'xpBoost', val: 2, durationHours: 24 },
        ],
        flashDuration: 48 * 3600 * 1000,
        badgeLabel: 'قيمة خارقة',
    },
    {
        id: 'ex_bundle_legend',
        type: 'bundle',
        rarity: 'legendary',
        icon: '🌟',
        name: 'حزمة الأسطورة الكاملة',
        desc: '+300 عملة + إطار ملكي + لقب «الأسطورة» + مضاعف XP ×3 دائم لأسبوع',
        diamondPrice: 28,
        bundleItems: [
            { type: 'coins',    val: 300 },
            { type: 'frame',    val: 'frame_legend' },
            { type: 'title',    val: 'ex_legend_title', label: '🌟 الأسطورة' },
            { type: 'xpBoost',  val: 3, durationHours: 168 },
        ],
        flashDuration: 72 * 3600 * 1000,
        badgeLabel: '🔥 العرض الأقوى',
        urgent: true,
    },
    {
        id: 'ex_bundle_weekly_warrior',
        type: 'bundle',
        rarity: 'epic',
        icon: '⚔️',
        name: 'حزمة المحارب الأسبوعي',
        desc: '+5 تخطيات + 5 قلوب احتياط + درع أسبوعي + 50 عملة',
        diamondPrice: 7,
        bundleItems: [
            { type: 'skip',   val: 5 },
            { type: 'hearts', val: 5 },
            { type: 'shield', val: 7 },
            { type: 'coins',  val: 50 },
        ],
        flashDuration: 36 * 3600 * 1000,
        badgeLabel: 'الأكثر شراءً',
    },
];

/* ─── حالة توليد الحصريات ─── */
const _exState = {
    activeItems: [],
    _lastGenDate: '',
    _countdownTimer: null,
};

/* ─── توليد عروض الحصريات ─── */
function _generateExclusives() {
    const _today = (typeof todayStr === 'function') ? todayStr() : new Date().toISOString().slice(0,10);

    /* استعادة من st إن كانت حية */
    if (st._exclusiveItems && Array.isArray(st._exclusiveItems)) {
        const _live = st._exclusiveItems.filter(i => i.expiresAt > Date.now() && !i.purchased);
        if (_live.length >= 3) {
            _exState.activeItems = _live;
            return;
        }
    }

    /* توليد جديد: 3 عروض عشوائية */
    const _now = Date.now();
    const _owned = st.ownedDiamondItems || [];
    const _pool  = EXCLUSIVES_CATALOG.filter(i => !_owned.includes(i.id));
    const _shuffled = [..._pool].sort(() => Math.random() - 0.5);
    const _chosen = _shuffled.slice(0, Math.min(4, _shuffled.length)).map(item => ({
        ...item,
        expiresAt: _now + item.flashDuration,
        purchased: false,
    }));

    _exState.activeItems = _chosen;
    st._exclusiveItems   = _chosen;
    if (typeof saveSt === 'function') saveSt();
}

/* ─── رسم صفحة الحصريات ─── */
function _renderExclusives(container) {
    _generateExclusives();

    const _d     = st.diamonds || 0;
    const _live  = _exState.activeItems.filter(i => i.expiresAt > Date.now());
    const _owned = st.ownedDiamondItems || [];

    /* ── هيدر الصفحة ── */
    let html = `
    <div style="padding:10px 0 4px;">

        <!-- رصيد الماس -->
        <div onclick="openDiamondStore()" style="
            display:flex;align-items:center;justify-content:space-between;
            background:linear-gradient(135deg,rgba(0,212,255,0.12),rgba(124,58,237,0.08));
            border:1.5px solid rgba(0,212,255,0.4);
            border-radius:16px;padding:10px 14px;margin-bottom:10px;
            cursor:pointer;transition:all 0.18s;
        ">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="font-size:1.6em;">💎</div>
                <div>
                    <div style="font-size:0.78em;font-weight:900;color:#00d4ff;">رصيدك من الجواهر</div>
                    <div style="font-size:0.62em;color:var(--text2);">اضغط لفتح متجر الجواهر الكامل</div>
                </div>
            </div>
            <div style="
                background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.4);
                border-radius:12px;padding:5px 14px;
                font-size:1.1em;font-weight:900;color:#00d4ff;
            ">💎 ${_d}</div>
        </div>

        <!-- كيف تكسب الجواهر -->
        <div style="
            background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.25);
            border-radius:12px;padding:8px 12px;margin-bottom:12px;
        ">
            <div style="font-size:0.62em;font-weight:900;color:#a855f7;margin-bottom:5px;">💡 كيف تكسب الجواهر؟</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
                ${['🔥 تتابع ≥15 إجابة','💀 وضع المستحيل','🚀 مرحلة العبقري','⚔️ تحدي 30+ نقطة','🔗 سلسلة ≥20','🗓️ تحدي الأسبوع'].map(t =>
                    `<span style="background:rgba(124,58,237,0.12);border-radius:7px;padding:2px 7px;font-size:0.58em;color:var(--text2);">${t}</span>`
                ).join('')}
            </div>
        </div>

        <!-- عنوان العروض -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div style="font-size:0.75em;font-weight:900;color:var(--text);">✨ العروض الحصرية النشطة</div>
            <div style="font-size:0.6em;color:var(--text3);">تتجدد تلقائياً</div>
        </div>
    `;

    if (_live.length === 0) {
        html += `
        <div style="
            text-align:center;padding:40px 20px;
            background:var(--surface2);border-radius:18px;
            border:1.5px dashed rgba(0,212,255,0.2);
        ">
            <div style="font-size:3em;margin-bottom:10px;">⌛</div>
            <div style="font-size:0.85em;font-weight:700;color:var(--text2);">لا توجد عروض نشطة الآن</div>
            <div style="font-size:0.65em;color:var(--text3);margin-top:6px;">تعود العروض قريباً — تحقق يومياً!</div>
        </div>`;
    } else {
        html += _live.map(item => _buildExclusiveCard(item, _owned.includes(item.id), _d)).join('');
    }

    html += `</div>`;
    container.innerHTML = html;

    /* بدء العداد التنازلي */
    if (_exState._countdownTimer) clearInterval(_exState._countdownTimer);
    _exState._countdownTimer = setInterval(() => {
        document.querySelectorAll('.ex-countdown[data-expires]').forEach(el => {
            const _ms = Math.max(0, parseInt(el.dataset.expires) - Date.now());
            el.textContent = '⏰ ' + _exFormatCountdown(_ms);
            if (_ms === 0) {
                clearInterval(_exState._countdownTimer);
                _generateExclusives();
                if (_shopState.activeTab === 'exclusives') {
                    _renderExclusives(document.getElementById('shopItemsContainer'));
                }
            }
        });
    }, 1000);
}

/* ─── بناء بطاقة الحصرية ─── */
function _buildExclusiveCard(item, isOwned, userDiamonds) {
    const _canAfford = userDiamonds >= item.diamondPrice;
    const _msLeft    = Math.max(0, item.expiresAt - Date.now());
    const _isUrgent  = item.urgent || _msLeft < 12 * 3600 * 1000;

    const _rarityColors = {
        rare:      { grad: 'rgba(6,182,212,0.14)',   border: 'rgba(6,182,212,0.5)',  labelBg: '#06b6d4',  label: 'نادر'   },
        epic:      { grad: 'rgba(124,58,237,0.14)',  border: 'rgba(124,58,237,0.5)', labelBg: '#7c3aed',  label: 'ملحمي'  },
        legendary: { grad: 'rgba(240,185,11,0.12)',  border: 'rgba(240,185,11,0.5)', labelBg: '#f0b90b',  label: 'أسطوري' },
    };
    const _rc = _rarityColors[item.rarity] || _rarityColors.rare;

    /* محتوى بنود الحزمة */
    const _bundleContent = (item.type === 'bundle' && item.bundleItems)
        ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0;">
            ${item.bundleItems.map(bi => {
                const _bIcon = bi.type === 'coins' ? '💰' : bi.type === 'shields' ? '🛡️' : bi.type === 'xpBoost' ? '⚡' : bi.type === 'frame' ? '🖼️' : bi.type === 'title' ? '🏷️' : bi.type === 'skip' ? '⏭️' : bi.type === 'hearts' ? '❤️' : bi.type === 'shield' ? '🛡️' : '🎁';
                const _bLabel = bi.type === 'coins' ? `+${bi.val} عملة` : bi.type === 'shields' ? `×${bi.val} درع` : bi.type === 'xpBoost' ? `XP ×${bi.val}${bi.durationHours ? ' لـ '+bi.durationHours+'س' : ''}` : bi.type === 'frame' ? 'إطار حصري' : bi.type === 'title' ? (bi.label || 'لقب') : bi.type === 'skip' ? `×${bi.val} تخطي` : bi.type === 'hearts' ? `×${bi.val} قلب` : bi.type === 'shield' ? `${bi.val} يوم درع` : bi.val;
                return `<span style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:7px;padding:2px 7px;font-size:0.6em;color:var(--text2);">${_bIcon} ${_bLabel}</span>`;
            }).join('')}
          </div>`
        : '';

    const _btn = isOwned
        ? `<div style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.4);border-radius:12px;padding:8px;text-align:center;font-size:0.72em;font-weight:900;color:#10b981;">✅ تملّكته</div>`
        : `<div onclick="buyExclusive('${item.id}')" style="
            background:${_canAfford ? 'linear-gradient(135deg,rgba(0,212,255,0.25),rgba(124,58,237,0.2))' : 'rgba(255,255,255,0.04)'};
            border:1.5px solid ${_canAfford ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.1)'};
            border-radius:12px;padding:9px;text-align:center;
            cursor:${_canAfford ? 'pointer' : 'not-allowed'};
            transition:all 0.15s;
            display:flex;align-items:center;justify-content:center;gap:6px;
          " ${_canAfford ? `onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform=''"` : ''}>
            <span style="font-size:0.85em;font-weight:900;color:${_canAfford ? '#00d4ff' : 'var(--text3)'};">💎 ${item.diamondPrice}</span>
            ${_canAfford
                ? `<span style="font-size:0.68em;font-weight:700;color:rgba(0,212,255,0.8);">اشترِ الآن →</span>`
                : `<span style="font-size:0.62em;color:var(--text3);">(تحتاج ${item.diamondPrice - userDiamonds} أكثر)</span>`
            }
          </div>`;

    return `
    <div style="
        position:relative;
        background:${_isUrgent ? 'linear-gradient(135deg,rgba(239,68,68,0.1),'+_rc.grad+')' : _rc.grad};
        border:1.5px solid ${_isUrgent ? 'rgba(239,68,68,0.5)' : _rc.border};
        border-radius:18px;padding:14px;margin-bottom:12px;
        ${_isUrgent ? 'box-shadow:0 0 16px rgba(239,68,68,0.12);' : ''}
        transition:transform 0.15s;
    ">
        <!-- رارتي بادج -->
        <div style="
            position:absolute;top:-1px;right:-1px;
            background:${_rc.labelBg};color:${item.rarity === 'legendary' ? '#000' : '#fff'};
            font-size:0.52em;font-weight:900;
            padding:3px 10px;border-radius:0 16px 0 10px;
        ">${_rc.label}</div>

        <!-- عداد تنازلي -->
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
            <div class="ex-countdown" data-expires="${item.expiresAt}" style="
                display:inline-flex;align-items:center;gap:3px;
                background:${_isUrgent ? 'rgba(239,68,68,0.18)' : 'rgba(0,0,0,0.25)'};
                border:1px solid ${_isUrgent ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'};
                border-radius:8px;padding:3px 8px;
                font-size:0.6em;font-weight:900;
                color:${_isUrgent ? '#ef4444' : 'var(--text2)'};
            ">⏰ ${_exFormatCountdown(_msLeft)}</div>
            ${item.badgeLabel ? `<div style="background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(124,58,237,0.15));border:1px solid rgba(0,212,255,0.35);border-radius:8px;padding:3px 8px;font-size:0.58em;font-weight:900;color:#00d4ff;">${item.badgeLabel}</div>` : ''}
        </div>

        <!-- محتوى البطاقة -->
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:8px;">
            <div style="font-size:2.2em;line-height:1;flex-shrink:0;">${item.icon}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.88em;font-weight:900;color:var(--text);margin-bottom:3px;">${item.name}</div>
                <div style="font-size:0.64em;color:var(--text2);line-height:1.45;">${item.desc}</div>
                ${_bundleContent}
            </div>
        </div>
        ${_btn}
    </div>`;
}

/* ─── تنسيق العداد التنازلي ─── */
function _exFormatCountdown(ms) {
    if (ms <= 0) return 'انتهى!';
    const _h = Math.floor(ms / 3600000);
    const _m = Math.floor((ms % 3600000) / 60000);
    const _s = Math.floor((ms % 60000) / 1000);
    if (_h > 0) return `${_h}س ${String(_m).padStart(2,'0')}د`;
    if (_m > 0) return `${_m}:${String(_s).padStart(2,'0')}`;
    return `${_s}ث`;
}

/* ─── تنفيذ شراء الحصرية ─── */
function buyExclusive(id) {
    if (window._exBuyLock) return;

    const item = _exState.activeItems.find(i => i.id === id);
    if (!item) { showFeedback('⚠️ العرض غير موجود أو انتهى'); return; }
    if (item.expiresAt <= Date.now()) { showFeedback('⏰ انتهى وقت هذا العرض'); _renderExclusives(document.getElementById('shopItemsContainer')); return; }
    if (item.purchased) { showFeedback('✅ اشتريت هذا العرض بالفعل'); return; }

    const _d = st.diamonds || 0;
    if (_d < item.diamondPrice) {
        showFeedback(`💎 تحتاج ${item.diamondPrice - _d} جوهرة إضافية`);
        return;
    }

    if (!st.ownedDiamondItems) st.ownedDiamondItems = [];
    if (st.ownedDiamondItems.includes(id)) { showFeedback('✅ تملّكته بالفعل'); return; }

    showConfirm(
        `✨ ${item.name}`,
        `${item.desc}\n\nالسعر: ${item.diamondPrice} 💎 جواهر\nالوقت المتبقي: ${_exFormatCountdown(item.expiresAt - Date.now())}`,
        'اشترِ الآن ✨',
        'إلغاء',
        ok => {
            if (!ok) return;
            if ((st.diamonds || 0) < item.diamondPrice) { showFeedback('💎 رصيد الجواهر غير كافٍ'); return; }

            window._exBuyLock = true;
            setTimeout(() => { window._exBuyLock = false; }, 1500);

            st.diamonds -= item.diamondPrice;
            st.ownedDiamondItems.push(id);
            item.purchased = true;

            /* تطبيق العرض */
            _applyExclusiveItem(item);

            /* تحديث st._exclusiveItems */
            st._exclusiveItems = _exState.activeItems;

            saveSt();
            updateUI();
            if (typeof _updateDiamondDisplayAll === 'function') _updateDiamondDisplayAll();
            if (typeof _updateHeaderDiamonds    === 'function') _updateHeaderDiamonds();
            _renderExclusives(document.getElementById('shopItemsContainer'));

            try { if (typeof playSound    === 'function') playSound('purchase'); }  catch(e) {}
            try { if (typeof doConfetti   === 'function') doConfetti(); }            catch(e) {}
            setTimeout(() => { try { showFeedback(`✨ تم شراء ${item.name}!`); } catch(e) {} }, 300);
        }
    );
}

function _applyExclusiveItem(item) {
    try {
        if (item.type === 'frame') {
            if (!st.ownedFrames) st.ownedFrames = ['frame_none'];
            if (item.preview && !st.ownedFrames.includes(item.preview)) st.ownedFrames.push(item.preview);
            st.activeFrame = item.preview;
            if (typeof _applyActiveFrameGlobally === 'function') _applyActiveFrameGlobally();
        } else if (item.type === 'title') {
            if (!st.ownedTitles) st.ownedTitles = [];
            if (!st.ownedTitles.includes(item.titleValue)) st.ownedTitles.push(item.titleValue);
            st.activeTitle = item.titleLabel;
            if (typeof renderProfileTitles === 'function') renderProfileTitles();
        } else if (item.type === 'avatar') {
            if (!st.ownedEmojis) st.ownedEmojis = [];
            if (!st.ownedEmojis.includes(item.emojiValue)) st.ownedEmojis.push(item.emojiValue);
        } else if (item.type === 'bundle' && item.bundleItems) {
            item.bundleItems.forEach(bi => {
                switch (bi.type) {
                    case 'coins':
                        st.coins = (st.coins || 0) + Math.min(bi.val, 500);
                        break;
                    case 'shields':
                    case 'shield':
                        st.dailyShieldUsed = false;
                        st.lastShieldDate  = null;
                        if (bi.val > 1 && st.season) {
                            st.season.streakShields = Math.min(10, (st.season.streakShields || 0) + Math.floor(bi.val / 2));
                        }
                        break;
                    case 'xpBoost':
                        if (typeof _shopState !== 'undefined') {
                            _shopState.xpBoostActive = true;
                            _shopState.xpBoostMultiplier = bi.val || 2;
                        }
                        st._xpBoostMultiplier = bi.val || 2;
                        const _durationMs = (bi.durationHours || 24) * 3600 * 1000;
                        st._xpBoostExpires = Date.now() + _durationMs;
                        break;
                    case 'frame':
                        if (!st.ownedFrames) st.ownedFrames = ['frame_none'];
                        if (!st.ownedFrames.includes(bi.val)) st.ownedFrames.push(bi.val);
                        break;
                    case 'title':
                        if (!st.ownedTitles) st.ownedTitles = [];
                        if (bi.val && !st.ownedTitles.includes(bi.val)) st.ownedTitles.push(bi.val);
                        if (bi.label) st.activeTitle = bi.label;
                        break;
                    case 'skip':
                        if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0, hint: 0 };
                        st.inventory.skip = Math.min(99, (st.inventory.skip || 0) + bi.val);
                        break;
                    case 'hearts':
                        if (!st.inventory) st.inventory = { skip: 0, heart: 0, remove: 0, hint: 0 };
                        st.inventory.heart = Math.min(99, (st.inventory.heart || 0) + bi.val);
                        break;
                }
            });
        }
    } catch(e) { console.warn('[Exclusives] _applyExclusiveItem error:', e); }
}

/* ─── تصدير الدوال ─── */
window.buyExclusive    = buyExclusive;
window._renderExclusives = _renderExclusives;
window._generateExclusives = _generateExclusives;

/* ─── تنظيف العروض المنتهية عند تحميل الصفحة ─── */
window.addEventListener('load', function() {
    setTimeout(function() {
        if (typeof st !== 'undefined' && st._exclusiveItems) {
            st._exclusiveItems = st._exclusiveItems.filter(i => i.expiresAt > Date.now());
        }
    }, 500);
});

/* ═══════════════════════════════════════════════════════════════
   نهاية ملف shop.js
═══════════════════════════════════════════════════════════════ */
window.addEventListener('load', function () {
    if (typeof st !== 'undefined') {
        if (st._xpBoostMultiplier && st._xpBoostMultiplier > 1 && st._xpBoostExpires && Date.now() < st._xpBoostExpires) {
            _shopState.xpBoostActive = true;
            _shopState.xpBoostMultiplier = st._xpBoostMultiplier;
        }
        if (st._hintsRemaining) {
            _shopState.hintsRemaining = st._hintsRemaining;
        }
    }
});

/* تصدير الدوال عالمياً */
window.renderShop              = renderShop;
window.buyAvatarFromShop       = buyAvatarFromShop;
window.selectEmojiFromShop     = selectEmojiFromShop;
window.buyConsumable           = buyConsumable;
window.buyBundle               = buyBundle;
window.showUrgentHeartOffer    = showUrgentHeartOffer;
window.getXpMultiplier         = getXpMultiplier;
window._setShopTab             = _setShopTab;
window.renderEmojiShop         = renderEmojiShop;
window.toggleEmojiShop         = toggleEmojiShop;
window.buyOrSelectEmoji        = buyOrSelectEmoji;
window.buyEmojiShopOnly        = buyEmojiShopOnly;
window.useHelperFromInventory  = useHelperFromInventory;
window._updateInventoryBar     = _updateInventoryBar;
