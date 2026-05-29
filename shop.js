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
        { id: 'av_astro',  emoji: '🧑‍🚀', price: 8,  label: 'رائد فضاء',  badge: '' },
        { id: 'av_vamp',   emoji: '🧛',  price: 12,  label: 'مصاص دماء',  badge: '😈' },
        { id: 'av_elf',    emoji: '🧝',  price: 10,  label: 'جني',         badge: '' },
        { id: 'av_genie',  emoji: '🧞',  price: 15,  label: 'مارد علاء الدين', badge: '✨' },
        { id: 'av_fox',    emoji: '🦊',  price: 9,   label: 'ثعلب ذكي',   badge: '' },
        { id: 'av_tiger',  emoji: '🐯',  price: 10,  label: 'نمر',         badge: '' },
        { id: 'av_lion',   emoji: '🦁',  price: 12,  label: 'أسد',         badge: '👑' },
        { id: 'av_panda',  emoji: '🐼',  price: 8,   label: 'باندا',       badge: '' },
        { id: 'av_unicorn',emoji: '🦄',  price: 18,  label: 'يونيكورن',    badge: '🌈', hot: true },
        { id: 'av_dragon', emoji: '🐲',  price: 14,  label: 'تنين',        badge: '🔥' },
        { id: 'av_eagle',  emoji: '🦅',  price: 8,   label: 'نسر',         badge: '' },
        { id: 'av_wolf',   emoji: '🐺',  price: 10,  label: 'ذئب',         badge: '' },
        { id: 'av_owl',    emoji: '🦉',  price: 9,   label: 'بومة',        badge: '' },
        { id: 'av_grad',   emoji: '🧑‍🎓', price: 20,  label: 'خريج',        badge: '🎓', lvlReq: 5 },
        { id: 'av_coder',  emoji: '🧑‍💻', price: 22,  label: 'مبرمج',       badge: '💻', lvlReq: 5 },
        { id: 'av_sci',    emoji: '🧑‍🔬', price: 25,  label: 'عالم',        badge: '⚗️', lvlReq: 8 },
        { id: 'av_prince', emoji: '🤴',  price: 35,  label: 'أمير',        badge: '👑', lvlReq: 10, hot: true },
        { id: 'av_princess',emoji: '👸', price: 35,  label: 'أميرة',       badge: '👑', lvlReq: 10, hot: true },
        { id: 'av_hero',   emoji: '🦸',  price: 30,  label: 'بطل خارق',   badge: '⚡', lvlReq: 8 },
        { id: 'av_wizard', emoji: '🧙',  price: 28,  label: 'ساحر',        badge: '🪄', lvlReq: 7 },
        { id: 'av_ninja',  emoji: '🥷',  price: 32,  label: 'نينجا',       badge: '⚔️', lvlReq: 10, new: true },
        { id: 'av_robot',  emoji: '🤖',  price: 38,  label: 'روبوت',       badge: '🔩', lvlReq: 12, new: true },
        { id: 'av_alien',  emoji: '👽',  price: 45,  label: 'فضائي',       badge: '🛸', lvlReq: 15, hot: true, new: true },
    ],

    /* ─── المستهلكات ─── */
    consumables: [
        {
            id: 'heart_pack_1',
            icon: '❤️',
            name: '+1 قلب',
            desc: 'أضف قلباً الآن في اللعبة',
            price: 5,
            action: 'addHeart',
            gameOnly: true,
            urgency: true,
        },
        {
            id: 'heart_pack_3',
            icon: '💖',
            name: 'باقة 3 قلوب',
            desc: 'أضف 3 قلوب لاستمرار المشوار',
            price: 12,
            action: 'addHearts',
            actionVal: 3,
            badge: 'قيمة',
            gameOnly: true,
        },
        {
            id: 'skip_q',
            icon: '⏭️',
            name: 'تخطّي سؤال',
            desc: 'تخطَّ السؤال الصعب بدون خسارة',
            price: 3,
            action: 'skipQuestion',
            gameOnly: true,
        },
        {
            id: 'remove_wrong',
            icon: '🗑️',
            name: 'حذف خيار',
            desc: 'احذف إجابة خاطئة لتسهيل الاختيار',
            price: 4,
            action: 'removeWrong',
            gameOnly: true,
        },
        {
            id: 'time_plus10',
            icon: '⏰',
            name: '+10 ثواني',
            desc: 'أضف 10 ثوان للمؤقت الآن',
            price: 5,
            action: 'addTime',
            actionVal: 10,
            gameOnly: true,
            timerOnly: true,
        },
        {
            id: 'xp_boost_2x',
            icon: '⚡',
            name: 'مضاعف XP ×2',
            desc: 'ضاعف نقاط XP للجلسة القادمة',
            price: 15,
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
            price: 30,
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
            price: 8,
            action: 'buyShield',
            badge: 'مستحسن',
        },
        {
            id: 'hint_pack',
            icon: '💡',
            name: 'باقة 5 تلميحات',
            desc: 'احصل على تلميح مجاني 5 مرات',
            price: 10,
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
        { key: 'avatars',      icon: '🧑',  label: 'رموز' },
        { key: 'consumables',  icon: '⚡',  label: 'مستهلكات' },
        { key: 'bundles',      icon: '🎁',  label: 'حزم', badge: 'وفّر!' },
    ];
    tabs.innerHTML = tabDefs.map(t => `
        <button class="shop-tab-btn${_shopState.activeTab === t.key ? ' active' : ''}"
                onclick="_setShopTab('${t.key}');playSound('click');"
                style="
                    flex:1;padding:8px 4px;border-radius:12px;font-size:0.72em;font-weight:800;
                    background:${_shopState.activeTab === t.key ? 'var(--gold)' : 'var(--surface3)'};
                    color:${_shopState.activeTab === t.key ? '#000' : 'var(--text2)'};
                    border:1px solid ${_shopState.activeTab === t.key ? 'var(--gold)' : 'var(--border2)'};
                    position:relative;transition:all 0.18s ease;
                ">
            ${t.icon} ${t.label}
            ${t.badge ? `<span style="position:absolute;top:-6px;right:-4px;background:#ef4444;color:#fff;font-size:0.62em;font-weight:900;padding:1px 5px;border-radius:8px;">${t.badge}</span>` : ''}
        </button>
    `).join('');
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
        case 'consumables': _renderConsumables(container); break;
        case 'bundles':     _renderBundles(container);    break;
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
   ③ عرض المستهلكات
═══════════════════════════════════════════════════════════════ */
function _renderConsumables(container) {
    const inGame = typeof G !== 'undefined' && !G.ended &&
                   document.getElementById('gameOverlay')?.classList.contains('active');

    const items = SHOP_CATALOG.consumables.filter(item => {
        if (item.gameOnly && !inGame) return false;
        if (item.timerOnly && (!G || !G.hasTimer)) return false;
        return true;
    });

    container.innerHTML = `
        <div style="padding:8px 0;">
            ${inGame ? `<div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:700;color:#ef4444;text-align:center;">⚔️ أنت في اللعبة — العناصر تُطبَّق فوراً!</div>` : ''}
            ${_shopState.xpBoostActive ? `<div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:900;color:var(--accent);text-align:center;">⚡ مضاعف XP ×${_shopState.xpBoostMultiplier} مفعّل!</div>` : ''}
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${items.map(item => _buildConsumableCard(item)).join('')}
                ${!inGame ? _buildNonGameConsumables() : ''}
            </div>
        </div>
    `;
}

function _buildConsumableCard(item) {
    const canAfford = st.coins >= item.price;
    const isAdReward = item.adReward;

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
                    ? `<div style="font-size:0.72em;font-weight:900;color:var(--green);">📺 شاهد</div><div style="font-size:0.6em;color:var(--text3);">مجاني</div>`
                    : `<div style="font-size:0.85em;font-weight:900;color:${canAfford ? 'var(--gold)' : '#ef4444'};">${item.price}💰</div>
                       <div style="font-size:0.58em;color:${canAfford ? 'var(--green)' : '#ef4444'};">${canAfford ? '✅ يمكنك' : '❌ لا يكفي'}</div>`
                }
            </div>
        </div>
    `;
}

function _buildNonGameConsumables() {
    const alwaysItems = SHOP_CATALOG.consumables.filter(i => !i.gameOnly);
    return alwaysItems.map(item => _buildConsumableCard(item)).join('');
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
    const item = SHOP_CATALOG.consumables.find(i => i.id === id);
    if (!item) return;

    if (item.adReward) {
        showConfirm('📺 مكافأة مشاهدة', 'شاهد إعلاناً قصيراً للحصول على 20 عملة مجاناً!', 'شاهد الآن', 'لاحقاً', ok => {
            if (!ok) return;
            st.coins += 20;
            saveSt(); updateUI(); renderShop();
            playSound('coin');
            showFeedback('💰 حصلت على 20 عملة!');
        });
        return;
    }

    if (st.coins < item.price) {
        _showInsufficientCoinsOffer(item.price - st.coins, item.name);
        return;
    }

    showConfirm(`${item.icon} ${item.name}`, `${item.desc}\n\nالسعر: ${item.price} عملة`, 'اشترِ الآن', 'إلغاء', ok => {
        if (!ok) return;
        st.coins -= item.price;

        const inGameNow = typeof G !== 'undefined' && !G.ended &&
            document.getElementById('gameOverlay')?.classList.contains('active');

        switch (item.action) {
            case 'addHeart':
                if (inGameNow) {
                    G.livesLeft = Math.min(G.livesLeft + 1, 9);
                    if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
                } else {
                    /* حفظ في المخزون للاستخدام لاحقاً */
                    _addToInventory('addHeart', 1);
                    showFeedback('❤️ أُضيف للمخزون — يُستخدم تلقائياً في اللعبة');
                }
                break;
            case 'addHearts':
                if (inGameNow) {
                    G.livesLeft = Math.min(G.livesLeft + (item.actionVal || 3), 9);
                    if (typeof updateHeartsDisplay === 'function') updateHeartsDisplay();
                } else {
                    _addToInventory('addHearts', item.actionVal || 3);
                    showFeedback('💖 أُضيفت للمخزون — تُستخدم تلقائياً في اللعبة');
                }
                break;
            case 'skipQuestion':
                if (inGameNow) {
                    G.answered = true;
                    setTimeout(() => { if (!G.ended) loadQuestion(); }, 200);
                } else {
                    /* تُخزَّن وتُستهلك تلقائياً عبر useHelperFromInventory */
                    _addToInventory('skipQuestion', 1);
                    showFeedback('⏭️ تخطٍّ أُضيف للمخزون');
                }
                break;
            case 'removeWrong':
                if (inGameNow) {
                    const btns = [...document.querySelectorAll('.answer-btn:not(:disabled)')];
                    const wrong = btns.filter(b => parseInt(b.getAttribute('data-val')) !== G.correctAnswer);
                    if (wrong.length > 0) {
                        const r = wrong[Math.floor(Math.random() * wrong.length)];
                        r.style.opacity = '0.15';
                        r.style.pointerEvents = 'none';
                    }
                } else {
                    _addToInventory('removeWrong', 1);
                    showFeedback('🗑️ حذف خيار أُضيف للمخزون');
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
                _shopState.hintsRemaining = (parseInt(_shopState.hintsRemaining) || 0) + (item.actionVal || 5);
                st._hintsRemaining = _shopState.hintsRemaining;
                break;
            case 'coinBonus':
                st.coins += item.actionVal || 20;
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
        st.coins -= bundle.price;
        bundle.items.forEach(item => {
            switch (item.type) {
                case 'coins':   st.coins += item.val; break;
                case 'hearts':  if (G && !G.ended) G.livesLeft = Math.min(G.livesLeft + item.val, 9); break;
                case 'avatar':
                    if (!st.ownedEmojis) st.ownedEmojis = [];
                    if (!st.ownedEmojis.includes(item.val)) st.ownedEmojis.push(item.val);
                    break;
                case 'xpBoost':
                    _shopState.xpBoostActive = true;
                    _shopState.xpBoostMultiplier = item.val;
                    st._xpBoostMultiplier = item.val;
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

    const canAfford5  = st.coins >= 5;
    const canAfford12 = st.coins >= 12;

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
                    cursor:${canAfford5 ? 'pointer' : 'not-allowed'};opacity:${canAfford5 ? 1 : 0.6};
                    display:flex;justify-content:space-between;align-items:center;
                ">
                    <span>❤️ +1 قلب</span>
                    <span style="background:rgba(0,0,0,0.25);border-radius:8px;padding:2px 10px;">5💰</span>
                </button>
                <button onclick="buyUrgentItem('heart_pack_3')" style="
                    background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;
                    border:2px solid rgba(240,185,11,0.5);border-radius:14px;padding:12px 16px;
                    font-size:0.82em;font-weight:900;cursor:${canAfford12 ? 'pointer' : 'not-allowed'};
                    opacity:${canAfford12 ? 1 : 0.6};display:flex;justify-content:space-between;align-items:center;
                ">
                    <span>💖 +3 قلوب <span style="background:rgba(0,0,0,0.2);font-size:0.7em;padding:1px 5px;border-radius:5px;">قيمة!</span></span>
                    <span style="background:rgba(0,0,0,0.25);border-radius:8px;padding:2px 10px;">12💰</span>
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
    buyConsumable(id);
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
                <div style="background:var(--surface2);border-radius:10px;padding:8px 12px;font-size:0.68em;color:var(--text);">🎮 العب جلسات أكثر ← تكسب 0.4💰 لكل إجابة</div>
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
   ⑪-أ ربط المخزون بأزرار المساعدة (5.3) — يُستدعى من questions.js
═══════════════════════════════════════════════════════════════ */

/**
 * يحاول استخدام مساعد من المخزون المشترى مسبقاً.
 * @param {string} type  'skip' | 'remove' | 'heart'
 * @returns {boolean}  true إذا نجح الاستخدام من المخزون
 */
function useHelperFromInventory(type) {
    if (!st) return false;

    /* --- تخطّي سؤال من المخزون --- */
    if (type === 'skip') {
        const inv = st._inv_skip || 0;
        if (inv > 0) {
            st._inv_skip = inv - 1;
            saveSt();
            _updateInventoryHintDisplay();
            return true;
        }
        return false;
    }

    /* --- حذف إجابة خاطئة من المخزون --- */
    if (type === 'remove') {
        const inv = st._inv_remove || 0;
        if (inv > 0) {
            st._inv_remove = inv - 1;
            saveSt();
            _updateInventoryHintDisplay();
            return true;
        }
        return false;
    }

    /* --- قلب إضافي من المخزون --- */
    if (type === 'heart') {
        const inv = st._inv_heart || 0;
        if (inv > 0) {
            st._inv_heart = inv - 1;
            saveSt();
            _updateInventoryHintDisplay();
            return true;
        }
        return false;
    }

    return false;
}

/**
 * يحدّث عرض مخزون المساعدات داخل اللعبة (5.4)
 */
function _updateInventoryHintDisplay() {
    const skipEl  = document.getElementById('invSkip');
    const heartEl = document.getElementById('invHeart');
    const remEl   = document.getElementById('invRemove');
    if (skipEl)  skipEl.textContent  = st._inv_skip   || 0;
    if (heartEl) heartEl.textContent = st._inv_heart  || 0;
    if (remEl)   remEl.textContent   = st._inv_remove || 0;

    /* إظهار/إخفاء شريط المخزون */
    const hintBar = document.getElementById('helperInventoryHint');
    if (hintBar) {
        const total = (st._inv_skip || 0) + (st._inv_heart || 0) + (st._inv_remove || 0);
        hintBar.style.display = total > 0 ? 'flex' : 'none';
    }
}

/* عند شراء مستهلكات تُضاف للمخزون (skip_q, remove_wrong) نزيدها */
function _addToInventory(action, qty) {
    qty = qty || 1;
    if (action === 'skipQuestion')  st._inv_skip   = (st._inv_skip   || 0) + qty;
    if (action === 'removeWrong')   st._inv_remove = (st._inv_remove || 0) + qty;
    if (action === 'addHeart')      st._inv_heart  = (st._inv_heart  || 0) + qty;
    if (action === 'addHearts')     st._inv_heart  = (st._inv_heart  || 0) + qty;
    saveSt();
}

/* ═══════════════════════════════════════════════════════════════
   ⑪ مضاعف XP
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
   ⑫ تهيئة عند تحميل الصفحة
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
window.renderShop                = renderShop;
window.buyAvatarFromShop         = buyAvatarFromShop;
window.selectEmojiFromShop       = selectEmojiFromShop;
window.buyConsumable             = buyConsumable;
window.buyBundle                 = buyBundle;
window.showUrgentHeartOffer      = showUrgentHeartOffer;
window.getXpMultiplier           = getXpMultiplier;
window._setShopTab               = _setShopTab;
window.renderEmojiShop           = renderEmojiShop;
window.toggleEmojiShop           = toggleEmojiShop;
window.buyOrSelectEmoji          = buyOrSelectEmoji;
window.buyEmojiShopOnly          = buyEmojiShopOnly;
/* 5.3/5.4 — ربط المخزون */
window.useHelperFromInventory    = useHelperFromInventory;
window._updateInventoryHintDisplay = _updateInventoryHintDisplay;
