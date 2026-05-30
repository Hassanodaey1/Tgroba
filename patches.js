/* ═══════════════════════════════════════════════════
   HO Math — Patches & New Features v9
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* ═══ 1. إيقاف/استئناف مؤقت اللعبة ═══ */
var _gamePaused = false;
var _pausedTimeLeft = 0;

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
    G.timeLeft = _pausedTimeLeft;
    G.timer = setInterval(function () {
        G.timeLeft--;
        if (G.timeLeft <= 0) {
            clearGameTimer();
            endGame();
        } else {
            var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
            var bar = document.getElementById('timerBar');
            if (bar) {
                bar.style.width = pct + '%';
                if (pct < 25) bar.classList.add('danger');
                else bar.classList.remove('danger');
            }
            var bt = document.getElementById('bigTimer');
            if (bt) {
                bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                if (G.timeLeft <= 5) bt.classList.add('danger');
                else bt.classList.remove('danger');
            }
        }
    }, 1000);
}

/* ═══ 2. إعدادات رئيسية — stub للتوافق مع كود قديم ═══ */
/* openMainSettings و closeMainSettings و saveMainSettings
   لم تعد تفتح sheet منفصل — الإعدادات الآن في page-settings مباشرة.
   هذه الدوال stub لمنع أي أخطاء إن استُدعيت من مكان قديم. */
function openMainSettings()  { goTab && goTab('settings'); }
function closeMainSettings() { /* لا شيء */ }
function saveMainSettings()  { /* لا شيء — الحفظ يتم عبر saveProfile */ }

/* دوال الثيمات — تُستخدم من subPageThemeOverlay */
function updateSettingsDarkToggle() {
    /* يُحدّث أيقونات الداكن/الفاتح في كل مكان */
    const isDark = st.darkMode;
    ['settingsDarkIcon','darkLightIcon','spDarkLightIcon'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? '🌙' : '☀️';
    });
    ['settingsDarkLabel','darkLightLabel','spDarkLightLabel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = isDark ? 'داكن' : 'فاتح';
    });
}

function toggleSettingsDarkMode() {
    st.darkMode = !st.darkMode;
    saveSt();
    applyDarkMode();
    updateSettingsDarkToggle();
    playSound('click');
}

function updateSettingsThemeDots() {
    document.querySelectorAll('.settings-theme-dot,.theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.gold === st.tGold);
    });
}

function applySettingsTheme(el, gold, accent, accent2) {
    const dummy = { classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
    setTheme(dummy, gold, accent, accent2);
    updateSettingsThemeDots();
}

/* syncGameSheet — يُحدّث IDs الـ gameSettingsSheet من st مباشرة */
function syncGameSheet() {
    if (typeof st === 'undefined') return;
    const q = id => document.getElementById(id);
    if (q('gsoundStatus'))    q('gsoundStatus').textContent    = st.soundOn    ? 'مفعّل'  : 'مطفأ';
    if (q('gbgMusicStatus'))  q('gbgMusicStatus').textContent  = st.bgOn       ? 'مفعّلة' : 'مطفأة';
    if (q('gVibrationStatus')) q('gVibrationStatus').textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    if (q('gSoundVolSlider')) q('gSoundVolSlider').value       = st.soundVolume || 80;
    if (q('gSoundVolVal'))    q('gSoundVolVal').textContent    = (st.soundVolume || 80) + '%';
    if (q('gBgVolSlider'))    q('gBgVolSlider').value          = st.bgVolume || 60;
    if (q('gBgVolVal'))       q('gBgVolVal').textContent       = (st.bgVolume || 60) + '%';
}

/* ═══ 3. إعدادات اللعبة السريعة (داخل اللعبة فقط) ═══ */
function openGameSettingsAndPause() {
    pauseGameTimer();
    syncGameSheet();            /* مزامنة واحدة من st — لا تكرار */
    openSheet('gameSettingsSheet');
}

function closeGameSettingsAndResume() {
    closeSheet('gameSettingsSheet');
    resumeGameTimer();
}

function sheetBgAndResume(e, id) {
    if (e.target.id === id) {
        closeSheet(id);
        resumeGameTimer();
    }
}

/* ═══ 9. احتفال رفع المستوى ═══ */
/* ✅ FIX-LEVELUP: عرض بطاقة احتفالية + كونفيتي عند رفع المستوى */
function showLevelUpCelebration(newLevel) {
    /* إنشاء overlay الاحتفال */
    const overlay = document.createElement('div');
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'display:flex', 'align-items:center', 'justify-content:center',
        'background:rgba(0,0,0,0.55)', 'animation:fadeInBg 0.3s ease'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
        'background:var(--surface,#1a1a2e)', 'border:2.5px solid var(--gold,#f0b90b)',
        'border-radius:28px', 'padding:36px 40px', 'text-align:center',
        'max-width:320px', 'width:88%',
        'animation:levelUpPop 0.45s cubic-bezier(0.34,1.56,0.64,1)'
    ].join(';');

    card.innerHTML = `
        <div style="font-size:3.2em;margin-bottom:8px;">🎉</div>
        <div style="font-size:1.05em;color:var(--text2,#aaa);margin-bottom:6px;font-weight:700;">ارتقيت إلى</div>
        <div style="font-size:2.8em;font-weight:900;color:var(--gold,#f0b90b);line-height:1;">
            المستوى ${newLevel}
        </div>
        <div style="font-size:0.88em;color:var(--text2,#aaa);margin-top:10px;">
            🚀 استمر، أنت في تقدم رائع!
        </div>
        <button onclick="this.closest('[data-levelup]').remove()" style="margin-top:22px;background:var(--gold,#f0b90b);color:#000;border:none;border-radius:14px;padding:10px 32px;font-size:1em;font-weight:900;cursor:pointer;">
            رائع! 🏆
        </button>
    `;
    overlay.setAttribute('data-levelup', '1');
    overlay.appendChild(card);
    /* إغلاق بالضغط خارج البطاقة */
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    /* حقن أنيميشن إن لم يكن موجوداً */
    if (!document.getElementById('levelUpKeyframes')) {
        const style = document.createElement('style');
        style.id = 'levelUpKeyframes';
        style.textContent = `
            @keyframes levelUpPop {
                0%   { transform: scale(0.5) rotate(-6deg); opacity:0; }
                70%  { transform: scale(1.08) rotate(1deg); opacity:1; }
                100% { transform: scale(1) rotate(0deg); }
            }
            @keyframes fadeInBg {
                from { opacity:0; } to { opacity:1; }
            }
        `;
        document.head.appendChild(style);
    }

    /* كونفيتي احتفالي */
    try { if (typeof doConfetti === 'function') doConfetti(); } catch(e) {}

    /* إغلاق تلقائي بعد 4 ثواني */
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 4000);
}


function initTitlesSystem() {
    try { checkSeasonReset(); } catch (e) {}
    try { renderProfileTitles(); } catch (e) {}
}

/* ═══ 5. toggleBgMusicInGame ═══ */
function toggleBgMusicInGame() {
    toggleBgMusic(); /* toggleBgMusic تُحدّث gbgMusicStatus تلقائياً */
}

/* ═══ 6. toggleVibration ═══ */
function toggleVibration() {
    st.vibrationOn = !st.vibrationOn;
    /* تحديث كل IDs الاهتزاز دفعة واحدة */
    ['vibrationStatus', 'gVibrationStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.vibrationOn ? 'مفعّل' : 'مطفأ';
    });
    if (st.vibrationOn && navigator.vibrate) navigator.vibrate(st.vibrationStrength || 30);
    saveSt();
    playSound('click');
}

/* ═══ 7. تهيئة محددات تاريخ نافذة الإعدادات الرئيسية ═══ */
function initSettingsDateSelectors() {
    const daySel = document.getElementById('settingsBirthDay');
    const monthSel = document.getElementById('settingsBirthMonth');
    const yearSel = document.getElementById('settingsBirthYear');
    if (!daySel) return;
    daySel.innerHTML = '';
    monthSel.innerHTML = '';
    yearSel.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        daySel.appendChild(opt);
    }
    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        monthSel.appendChild(opt);
    }
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        yearSel.appendChild(opt);
    }
}

/* ═══ 8. الرقم التسلسلي في نافذة الإعدادات ═══ */

function updateSettingsSerialDisplay() {
    const el = document.getElementById('settingsSerialDisplay');
    if (el) el.textContent = st.serialNumber || 'احفظ التغييرات أولاً لتوليد الرقم';
}

function copySettingsSerial() {
    if (!st.serialNumber) { showFeedback('لا يوجد رقم بعد — احفظ التغييرات أولاً'); return; }
    navigator.clipboard.writeText(st.serialNumber).then(() => {
        showFeedback('📋 تم نسخ الرقم التسلسلي');
    }).catch(() => {
        showFeedback('📋 ' + st.serialNumber);
    });
}

/* toggleSettingsRestorePanel و restoreFromSettings معرّفتان في state.js — لا تكرار */


/* ═══════════════════════════════════════════════════
   ⑩ إصلاح openSettingsSubPage / closeSettingsSubPage
   — تُستدعى من index.html لكن لم تكن معرّفة هنا
═══════════════════════════════════════════════════ */
/* هذه الدوال معرّفة في index.html داخل <script> مدمج،
   لكن نُعيد تعريفها هنا كـ fallback لضمان عملها دائماً */
if (typeof window.openSettingsSubPage === 'undefined') {
    window.openSettingsSubPage = function(id) {
        var map = {
            'profile-sub': 'subPageProfileOverlay',
            'audio-sub':   'subPageAudioOverlay',
            'theme-sub':   'subPageThemeOverlay',
            'parent-sub':  'subPageParentOverlay'
        };
        var overlayId = map[id] || id;
        var el = document.getElementById(overlayId);
        if (!el) return;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        playSound && playSound('click');
        if (overlayId === 'subPageProfileOverlay') {
            try { loadProfileForm(); } catch(e) {}
            try { updateSerialNumberDisplay(); } catch(e) {}
        }
        if (overlayId === 'subPageAudioOverlay') {
            try { initVolumeSliders(); } catch(e) {}
        }
        if (overlayId === 'subPageParentOverlay') {
            try { renderParentStats(); } catch(e) {}
        }
    };
}

if (typeof window.closeSettingsSubPage === 'undefined') {
    window.closeSettingsSubPage = function(overlayId) {
        var el = document.getElementById(overlayId);
        if (el) el.style.display = 'none';
        playSound && playSound('click');
    };
}

/* ═══════════════════════════════════════════════════
   ⑪ إصلاح مضاعف XP — ربط getXpMultiplier بـ applyXpGain
   applyXpGain في stats_engine.js لا تستخدم getXpMultiplier
   نُعيد تعريفها هنا بعد تحميل كل الملفات
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    /* نُغلّف applyXpGain الأصلية لإضافة دعم مضاعف XP */
    if (typeof applyXpGain === 'function' && typeof getXpMultiplier === 'function') {
        var _originalApplyXpGain = applyXpGain;
        window.applyXpGain = function(correct, wrong, score, bestStreak) {
            var result = _originalApplyXpGain(correct, wrong, score, bestStreak);
            /* تطبيق المضاعف على XP المكتسبة إن كان فعّالاً */
            var mult = getXpMultiplier();
            if (mult > 1 && result && result.xpGained > 0) {
                var bonus = Math.floor(result.xpGained * (mult - 1));
                if (bonus > 0) {
                    st.xp += bonus;
                    /* إعادة حساب المستويات بعد الإضافة */
                    while (st.xp >= st.xpToNext) {
                        st.xp -= st.xpToNext;
                        st.level++;
                        st.xpToNext = typeof calcXpToNext === 'function' ? calcXpToNext(st.level) : Math.floor(st.xpToNext * 1.3);
                        playSound('levelup');
                        var _lvl = st.level;
                        setTimeout((function(l){ return function() {
                            try { if (typeof showLevelUpCelebration === 'function') showLevelUpCelebration(l); } catch(e) {}
                        }; })(st.level), 600);
                    }
                    result.xpGained += bonus;
                    setTimeout(function() {
                        showFeedback('⚡ XP مضاعف ×' + mult + '! +' + bonus + ' XP إضافية');
                    }, 400);
                }
            }
            return result;
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑫ إصلاح _buildNonGameConsumables — منع التكرار
   المشكلة: تُظهر عناصر بدون gameOnly مرتين:
   مرة في _renderConsumables وأخرى في _buildNonGameConsumables
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof _renderConsumables === 'function') {
        /* نُعيد تعريف _renderConsumables لإصلاح التكرار */
        window._renderConsumables = function(container) {
            var inGame = typeof G !== 'undefined' && !G.ended &&
                         document.getElementById('gameOverlay') &&
                         document.getElementById('gameOverlay').classList.contains('active');

            /* داخل اللعبة: اعرض فقط عناصر gameOnly + العناصر الدائمة بدون تكرار */
            /* خارج اللعبة: اعرض فقط العناصر الدائمة (بدون gameOnly) */
            var items;
            if (inGame) {
                /* كل العناصر: سواء gameOnly أو لا */
                items = SHOP_CATALOG.consumables.filter(function(item) {
                    if (item.timerOnly && (!G || !G.hasTimer)) return false;
                    return true;
                });
            } else {
                /* خارج اللعبة: العناصر الدائمة فقط */
                items = SHOP_CATALOG.consumables.filter(function(item) {
                    return !item.gameOnly;
                });
            }

            container.innerHTML =
                '<div style="padding:8px 0;">' +
                (inGame ? '<div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:700;color:#ef4444;text-align:center;">⚔️ أنت في اللعبة — العناصر تُطبَّق فوراً!</div>' : '') +
                (_shopState.xpBoostActive ? '<div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:0.72em;font-weight:900;color:var(--accent);text-align:center;">⚡ مضاعف XP ×' + _shopState.xpBoostMultiplier + ' مفعّل!</div>' : '') +
                '<div style="display:flex;flex-direction:column;gap:8px;">' +
                items.map(function(item) { return _buildConsumableCard(item); }).join('') +
                '</div></div>';
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑬ إصلاح شراء الدرع — buyShield يُلغي اشتراط اليوم
   المشكلة: buyShield يضبط dailyShieldUsed=false فقط
   لكن useDailyShield تتحقق من lastDailyDate أيضاً
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    /* نُعيد تعريف buyConsumable لإصلاح حالة buyShield */
    if (typeof buyConsumable === 'function') {
        var _origBuyConsumable = buyConsumable;
        window.buyConsumable = function(id) {
            _origBuyConsumable(id);
            /* بعد الشراء: إذا كان الدرع، نُحدّث الحالة لضمان عمله */
            if (id === 'shield_day') {
                st.dailyShieldUsed = false;
                /* إزالة تاريخ الدرع القديم لإتاحة استخدامه في أي وقت */
                st.lastShieldDate = null;
                saveSt();
            }
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑭ تحديث currentAvatarDisplay عند فتح المتجر
   + تحديث shopCoinsDisplay بشكل فوري
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof renderShop === 'function') {
        var _origRenderShop = renderShop;
        window.renderShop = function() {
            _origRenderShop();
            /* تحديث رمز الأفاتار في صفحة المتجر */
            var ca = document.getElementById('currentAvatarDisplay');
            if (ca) ca.textContent = st.avatar || '🧑';
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑮ إصلاح نظام التتابع اليومي — حساب أمس الصحيح
   المشكلة: updateDailyShield في game.js تحسب أمس بدون zero-padding
   مما يسبب خطأ في المقارنة (2026-5-1 ≠ 2026-05-01)
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof updateDailyShield === 'function') {
        var _origUpdateDailyShield = updateDailyShield;
        window.updateDailyShield = function() {
            var today = todayStr();
            if (st.lastDailyDate !== today) {
                if (st.lastDailyDate && st.lastDailyDate > today) {
                    st.lastDailyDate = today;
                    saveSt();
                    return;
                }
                /* ✅ حساب أمس مع zero-padding الصحيح */
                var yesterdayD = new Date(Date.now() - 86400000);
                var yesterday = yesterdayD.getFullYear() + '-' +
                    String(yesterdayD.getMonth() + 1).padStart(2, '0') + '-' +
                    String(yesterdayD.getDate()).padStart(2, '0');

                st.dailyStreak = (st.lastDailyDate === yesterday) ? st.dailyStreak + 1 : 1;
                st.lastDailyDate = today;
                st.dailyShieldUsed = false;

                if (st.loginBonusDate !== today) {
                    st.loginBonusDate = today;
                    var _streakMiles = { 3: 3, 7: 7, 14: 10, 30: 20 };
                    var _loginBonus = 2;
                    Object.keys(_streakMiles).forEach(function(days) {
                        if (st.dailyStreak >= parseInt(days)) _loginBonus = _streakMiles[days];
                    });
                    st.coins += _loginBonus;
                    setTimeout(function() {
                        showFeedback('🌅 مرحباً! +' + _loginBonus + '💰 مكافأة يومية (يوم ' + st.dailyStreak + ')');
                    }, 800);
                }
                saveSt();
            }
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑯ ربط playComboSound + مزامنة timer الموسيقى
   ✅ FIX-⑤: checkAnswer تُشغّل correct أولاً، ثم combo
   — نُؤخر combo بـ 180ms لتجنب التشابك الصوتي
   — نُلغي playSound('correct') عند streak >= 3 ونستبدله بـ combo
═══════════════════════════════════════════════════ */
window.addEventListener('load', function() {
    if (typeof checkAnswer === 'function') {
        var _origCheckAnswer = checkAnswer;
        window.checkAnswer = function(btn) {
            _origCheckAnswer(btn);

            /* ✅ FIX-⑤: تشغيل combo بتأخير 180ms بعد صوت correct */
            if (G && G.streak >= 3 && typeof playComboSound === 'function') {
                var streak = G.streak;
                setTimeout(function() {
                    try { playComboSound(streak); } catch(e) {}
                }, 180);
            }

            /* مزامنة الموسيقى مع المؤقت — ④ */
            try {
                if (typeof window._onGameTimerTick === 'function') {
                    window._onGameTimerTick();
                }
            } catch(e) {}
        };
    }

    /* ✅ FIX-④: ربط _onGameTimerTick بـ setInterval الخاص باللعبة
       نُغلّف startGameWith لحقن الاستدعاء داخل timer اللعبة */
    if (typeof startGameWith === 'function') {
        var _origStartGameWith = startGameWith;
        window.startGameWith = function(mode, op, customTable, forceTimer) {
            _origStartGameWith(mode, op, customTable, forceTimer);
            /* بعد بدء اللعبة: نُراقب G.timer ونُضيف الـ hook عليه */
            setTimeout(function() {
                if (!G || !G.hasTimer || !G.timer) return;
                /* نُوقف الـ timer القديم ونُعيد تشغيله مع _onGameTimerTick */
                clearInterval(G.timer);
                G.timer = setInterval(function() {
                    if (G.ended) { clearInterval(G.timer); G.timer = null; return; }
                    if (G.timeLeft <= 0) {
                        clearInterval(G.timer); G.timer = null;
                        if (!G.ended) endGame();
                    } else {
                        G.timeLeft--;
                        var pct = G.maxTime > 0 ? (G.timeLeft / G.maxTime) * 100 : 100;
                        var bar = document.getElementById('timerBar');
                        if (bar) {
                            bar.style.width = pct + '%';
                            if (pct < 25) bar.classList.add('danger');
                            else bar.classList.remove('danger');
                        }
                        var bt = document.getElementById('bigTimer');
                        if (bt) {
                            bt.textContent = G.timeLeft < 10 ? '0' + G.timeLeft : String(G.timeLeft);
                            if (G.timeLeft <= 5) bt.classList.add('danger');
                            else bt.classList.remove('danger');
                        }
                        /* ✅ FIX-④: استدعاء hook الموسيقى مع كل tick */
                        try {
                            if (typeof window._onGameTimerTick === 'function') {
                                window._onGameTimerTick();
                            }
                        } catch(e) {}
                        /* ✅ FIX-⑤: tick صوتي فقط من _onGameTimerTick — لا تكرار هنا */
                    }
                }, 1000);
            }, 50); /* تأخير صغير للتأكد من بدء G.timer */
        };
    }
});

/* ═══════════════════════════════════════════════════
   ⑰ تأكيد تحميل المتجر عند أول فتح للتطبيق
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        /* تحديث shopCoinsDisplay عند البداية */
        var sc = document.getElementById('shopCoinsDisplay');
        if (sc && typeof st !== 'undefined') sc.textContent = st.coins;
        var sc2 = document.getElementById('shopCoinsDisplay2');
        if (sc2 && typeof st !== 'undefined') sc2.textContent = st.coins;
        var ca = document.getElementById('currentAvatarDisplay');
        if (ca && typeof st !== 'undefined') ca.textContent = st.avatar || '🧑';
    }, 3000);
});

