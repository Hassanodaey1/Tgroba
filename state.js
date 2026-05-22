/* STATE */
        /* ═══════════ GLOBAL STATE ═══════════ */
        const SK = 'ho_math_v7';

        /* ─── دوال الوقت ─── */

        function todayStr() {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }

        /* رقم الأسبوع ISO — يبدأ الأسبوع من الأحد */
        function weekStr() {
            const d = new Date();
            const jan1 = new Date(d.getFullYear(), 0, 1);
            const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
            return `${d.getFullYear()}-W${week}`;
        }

        /* رقم الشهر: "2026-5" */
        function monthStr() {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth() + 1}`;
        }

        /* ─── الحالة الافتراضية ─── */
        function defState() {
            return {
                /* ── هوية اللاعب ── */
                name:           'Player',
                age:            0,
                birthDate:      '2000-01-01',
                gender:         'm',
                avatar:         '👦',
                profilePhoto:   null,
                serialNumber:   '',
                darkMode:       true,

                /* ── الثيم ── */
                tGold:    '#f0b90b',
                tAccent:  '#7c3aed',
                tAccent2: '#06b6d4',

                /* ── التقدم ── */
                xp:        0,
                xpToNext:  1000,
                level:     1,

                /* ── العملات ── */
                coins:      10,
                totalCoinsEarned: 0,   /* إجمالي ما كُسب تاريخياً */
                totalCoinsSpent:  0,   /* إجمالي ما صُرف تاريخياً */

                /* ── الإحصائيات الكلية ── */
                correctTotal: 0,
                wrongTotal:   0,
                bestStreak:   0,
                totalGames:   0,
                bestScore:    0,

                /* ── الإعدادات ── */
                difficulty:        'easy',
                lastMode:          'classic',
                lastOp:            'mix',
                soundOn:           true,
                soundVolume:       80,
                bgOn:              true,
                bgVolume:          60,
                vibrationOn:       false,
                vibrationStrength: 30,

                /* ── فئات الإحصاء ── */
                stats:         {},
                history:       [],
                catCounter:    { correct: 0, total: 0 },
                catChallenges: { games: 0 },

                /* ── المهام اليومية ── */
                dailyTasks:     [],
                dailyDate:      todayStr(),

                /* ── مهام التحدي ── */
                challengeTasks:     [],
                challengeTasksDate: '',

                /* ═══════════════════════════════════
                   إحصائيات دورية
                ═══════════════════════════════════ */

                /* يومية — تتصفر كل 24 ساعة */
                dailyStats: {
                    correct: 0,
                    wrong:   0,
                    games:   0,
                    date:    todayStr()
                },

                /* أسبوعية — تتصفر أول الأسبوع الجديد
                   وتُعرض كاملةً في آخر يوم الأسبوع */
                weeklyStats: {
                    correct:    0,
                    wrong:      0,
                    games:      0,
                    bestStreak: 0,
                    bestScore:  0,
                    week:       weekStr()
                },

                /* شهرية — تتصفر أول الشهر الجديد
                   وتُعرض كاملةً في آخر يوم الشهر */
                monthlyStats: {
                    correct:    0,
                    wrong:      0,
                    games:      0,
                    bestStreak: 0,
                    bestScore:  0,
                    month:      monthStr()
                },

                /* ── الوقت ── */
                sessionTimeSecs:  0,
                sessionDate:      todayStr(),
                totalPlayTimeSecs: 0,    /* وقت اللعب التراكمي الكلي */

                /* ── القلوب والدرع ── */
                hearts:          3,
                dailyShieldUsed: false,
                lastShieldDate:  null,

                /* ── السلسلة اليومية (streak تسجيل الدخول) ── */
                dailyStreak:     0,
                lastDailyDate:   null,

                /* ── مكافأة تسجيل الدخول ── */
                loginRewardDate:    '',    /* آخر يوم أُخذت فيه المكافأة */
                loginRewardClaimed: false,

                /* ── صندوق المفاجآت كل 7 أيام ── */
                lootboxLastDate:   '',     /* تاريخ آخر صندوق فُتح */
                lootboxDayCount:   0,      /* عدد أيام الدخول المتراكمة */

                /* ── الإنجازات ── */
                achievementsUnlocked:   [],
                achievementRewardClaimed: false,

                /* ── الألقاب ── */
                ownedEmojis: ['👦'],

                /* ── المنافسة ── */
                challengeBestScore:  0,
                challengeWeeklyBest: 0,    /* أفضل نتيجة في الأسبوع الحالي */
                challengeWeeklyDate: '',   /* أسبوع آخر تحديث */

                /* ── الإشعارات ── */
                notifyOvertak: true,       /* إشعار عند تجاوز أحد اللاعبين */
            };
        }

        /* ─── تنظيف وتحقق الحالة عند التحميل ─── */
        function sanitizeState(s) {
            /* ── أساسيات ── */
            if (typeof s.coins    !== 'number' || s.coins    < 0) s.coins    = 0;
            if (typeof s.level    !== 'number' || s.level    < 1) s.level    = 1;
            if (typeof s.xp       !== 'number' || s.xp       < 0) s.xp       = 0;
            if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000;

            /* ── مصفوفات وكائنات ── */
            if (!s.ownedEmojis || !Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦'];
            if (!s.stats       || typeof s.stats !== 'object')    s.stats       = {};
            if (!s.history)    s.history    = [];
            if (!s.catCounter) s.catCounter = { correct: 0, total: 0 };
            if (!s.catChallenges) s.catChallenges = { games: 0 };
            if (!s.achievementsUnlocked) s.achievementsUnlocked = [];

            /* ── قيم افتراضية للحقول المُضافة حديثاً ── */
            if (s.achievementRewardClaimed === undefined) s.achievementRewardClaimed = false;
            if (!s.birthDate)  s.birthDate = '2000-01-01';
            if (typeof s.age !== 'number') s.age = 0;
            if (s.darkMode === undefined)  s.darkMode = true;
            if (typeof s.challengeBestScore  !== 'number') s.challengeBestScore  = 0;
            if (typeof s.challengeWeeklyBest !== 'number') s.challengeWeeklyBest = 0;
            if (!s.challengeWeeklyDate) s.challengeWeeklyDate = '';
            if (typeof s.soundVolume       !== 'number') s.soundVolume       = 80;
            if (typeof s.bgVolume          !== 'number') s.bgVolume          = 60;
            if (s.vibrationOn  === undefined) s.vibrationOn  = false;
            if (typeof s.vibrationStrength !== 'number') s.vibrationStrength = 30;
            if (s.profilePhoto === undefined) s.profilePhoto = null;
            if (typeof s.totalCoinsEarned  !== 'number') s.totalCoinsEarned  = 0;
            if (typeof s.totalCoinsSpent   !== 'number') s.totalCoinsSpent   = 0;
            if (typeof s.totalPlayTimeSecs !== 'number') s.totalPlayTimeSecs = 0;
            if (!s.loginRewardDate)    s.loginRewardDate    = '';
            if (s.loginRewardClaimed === undefined) s.loginRewardClaimed = false;
            if (!s.lootboxLastDate)    s.lootboxLastDate    = '';
            if (typeof s.lootboxDayCount !== 'number') s.lootboxDayCount = 0;
            if (s.notifyOvertak === undefined) s.notifyOvertak = true;
            if (!s.challengeTasks || !Array.isArray(s.challengeTasks)) s.challengeTasks = [];
            if (!s.challengeTasksDate) s.challengeTasksDate = '';

            /* ── إحصائيات يومية: تتصفر إذا تغيّر اليوم ── */
            if (!s.dailyStats || s.dailyStats.date !== todayStr()) {
                s.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }

            /* ── إحصائيات أسبوعية: تتصفر إذا تغيّر الأسبوع ── */
            if (!s.weeklyStats || s.weeklyStats.week !== weekStr()) {
                s.weeklyStats = {
                    correct: 0, wrong: 0, games: 0,
                    bestStreak: 0, bestScore: 0,
                    week: weekStr()
                };
            }
            /* إضافة bestScore للأسبوعية إن كانت غائبة */
            if (typeof s.weeklyStats.bestScore !== 'number') s.weeklyStats.bestScore = 0;

            /* ── إحصائيات شهرية: تتصفر إذا تغيّر الشهر ── */
            if (!s.monthlyStats || s.monthlyStats.month !== monthStr()) {
                s.monthlyStats = {
                    correct: 0, wrong: 0, games: 0,
                    bestStreak: 0, bestScore: 0,
                    month: monthStr()
                };
            }

            return s;
        }

        /* ─── تحميل وحفظ ─── */
        function loadSt() {
            try {
                const s = JSON.parse(localStorage.getItem(SK));
                if (s && s.name !== undefined) return sanitizeState(s);
            } catch (e) {}
            return defState();
        }

        function saveSt() {
            try {
                localStorage.setItem(SK, JSON.stringify(st));
                if (st.serialNumber) saveSerialBackup(st.serialNumber, st);
            } catch (e) {}
        }

        function saveSerialBackup(serial, data) {
            try { localStorage.setItem(`ho_math_backup_${serial}`, JSON.stringify(data)); } catch (e) {}
        }

        function loadSerialBackup(serial) {
            try {
                const d = localStorage.getItem(`ho_math_backup_${serial}`);
                if (d) return JSON.parse(d);
            } catch (e) {}
            return null;
        }

        /* ─── الرقم التسلسلي ─── */
        function generateSerialNumber(birthDate, name) {
            const nameEng    = (name || 'User').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
            const cleanDate  = birthDate.replace(/-/g, '');
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const count      = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
            localStorage.setItem('ho_math_user_count', count);
            return `${cleanDate}-${nameEng}-${randomPart}-${count}`;
        }

        function updateSerialNumberDisplay() {
            ['serialNumberDisplay', 'settingsSerialDisplay', 'settingsPageSerialDisplay'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = st.serialNumber || '---';
            });
        }

        function copySerialNumber() {
            if (!st.serialNumber) { showFeedback('لا يوجد رقم تسلسلي — احفظ الملف الشخصي أولاً'); return; }
            navigator.clipboard.writeText(st.serialNumber).catch(() => {});
            showFeedback('📋 تم نسخ الرقم التسلسلي');
        }

        function showRestoreAccount() {
            const panel = document.getElementById('restorePanel');
            if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }

        function restoreAccount() {
            const serial = document.getElementById('restoreSerialInput').value.trim();
            if (!serial) { showFeedback('الرجاء إدخال الرقم التسلسلي'); return; }
            const savedData = loadSerialBackup(serial);
            if (!savedData) { showFeedback('⚠️ لم يتم العثور على حساب بهذا الرقم'); return; }
            Object.assign(st, sanitizeState(savedData));
            saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
            applyProfilePhoto();
            showFeedback('✅ تم استعادة الحساب بنجاح');
            const panel = document.getElementById('restorePanel');
            if (panel) panel.style.display = 'none';
            const inp = document.getElementById('restoreSerialInput');
            if (inp) inp.value = '';
        }

        function restoreFromSettings() {
            const inp    = document.getElementById('settingsRestoreInput');
            const serial = inp ? inp.value.trim() : '';
            if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }
            const savedData = loadSerialBackup(serial);
            if (!savedData) { showFeedback('⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
            Object.assign(st, sanitizeState(savedData));
            saveSt(); updateUI(); loadProfileForm(); applyDarkMode();
            applyProfilePhoto();
            updateSerialNumberDisplay();
            if (inp) inp.value = '';
            const panel = document.getElementById('settingsRestorePanel');
            if (panel) panel.style.display = 'none';
            showFeedback('✅ تم استعادة الحساب');
        }

        function toggleSettingsRestorePanel() {
            const p = document.getElementById('settingsRestorePanel');
            if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
        }

        /* ─── تهيئة الحالة ─── */
        var st        = loadSt();
        var currentOp = st.lastOp || 'mix';

        /* ═══════════════════════════════════════════════
           تسجيل الإحصائيات الدورية (يومية / أسبوعية / شهرية)
        ═══════════════════════════════════════════════ */
        function recordDailyStat(type) {
            /* ── يومية ── */
            if (!st.dailyStats || st.dailyStats.date !== todayStr()) {
                st.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }
            /* ── أسبوعية ── */
            if (!st.weeklyStats || st.weeklyStats.week !== weekStr()) {
                st.weeklyStats = {
                    correct: 0, wrong: 0, games: 0,
                    bestStreak: 0, bestScore: 0,
                    week: weekStr()
                };
            }
            /* ── شهرية ── */
            if (!st.monthlyStats || st.monthlyStats.month !== monthStr()) {
                st.monthlyStats = {
                    correct: 0, wrong: 0, games: 0,
                    bestStreak: 0, bestScore: 0,
                    month: monthStr()
                };
            }

            if (type === 'correct') {
                st.dailyStats.correct++;
                st.weeklyStats.correct++;
                st.monthlyStats.correct++;
            }
            if (type === 'wrong') {
                st.dailyStats.wrong++;
                st.weeklyStats.wrong++;
                st.monthlyStats.wrong++;
            }
            if (type === 'game') {
                st.dailyStats.games++;
                st.weeklyStats.games++;
                st.monthlyStats.games++;
            }
            if (type === 'streak') {
                if (st.bestStreak > (st.weeklyStats.bestStreak  || 0)) st.weeklyStats.bestStreak  = st.bestStreak;
                if (st.bestStreak > (st.monthlyStats.bestStreak || 0)) st.monthlyStats.bestStreak = st.bestStreak;
            }
            if (type === 'score' && typeof arguments[1] === 'number') {
                const sc = arguments[1];
                if (sc > (st.weeklyStats.bestScore  || 0)) st.weeklyStats.bestScore  = sc;
                if (sc > (st.monthlyStats.bestScore || 0)) st.monthlyStats.bestScore = sc;
            }
        }

        /* ═══════════════════════════════════════════════
           نظام العملات — نسبة 40% كسب / 60% صرف
           كل دالة تسجّل في totalCoinsEarned / Spent
        ═══════════════════════════════════════════════ */

        /**
         * اكسب عملات (من اللعب أو المكافآت)
         * @param {number} amount  - العدد الخام قبل التطبيق
         * @param {string} reason  - سبب الكسب (للسجل)
         */
        function earnCoins(amount, reason) {
            if (amount <= 0) return 0;
            /* نسبة الكسب الفعلي = 40% من القيمة الاسمية
               بمعنى: مقابل كل نقطة جهد يحصل اللاعب على 0.4 عملة */
            const actual = Math.max(1, Math.round(amount * 0.40));
            st.coins             += actual;
            st.totalCoinsEarned  += actual;
            saveSt();
            return actual;
        }

        /**
         * اصرف عملات (مساعدات، شراء إيموجي…)
         * @param {number} amount
         * @param {string} reason
         * @returns {boolean} نجح الصرف أم لا
         */
        function spendCoins(amount, reason) {
            if (amount <= 0) return true;
            /* نسبة الصرف = 60% تذهب من الرصيد
               ← بمعنى: المتجر يُكلّف 1.5× القيمة المعروضة */
            const actual = Math.ceil(amount * 1.0); /* السعر المعروض هو بالفعل السعر النهائي */
            if (st.coins < actual) return false;
            st.coins            -= actual;
            st.totalCoinsSpent  += actual;
            saveSt();
            return true;
        }

        /* نسبة الكسب / الصرف الإجمالية */
        function getCoinRatio() {
            const total = st.totalCoinsEarned + st.totalCoinsSpent;
            if (total === 0) return { earnPct: 40, spendPct: 60 };
            return {
                earnPct:  Math.round((st.totalCoinsEarned / total) * 100),
                spendPct: Math.round((st.totalCoinsSpent  / total) * 100)
            };
        }

        /* ═══════════════════════════════════════════════
           نظام الليفل التدريجي — يصعب تدريجياً
        ═══════════════════════════════════════════════ */

        /**
         * أضف XP وتحقق من ترقية المستوى
         * @param {number} xpAmount
         * @returns {number} عدد مرات الترقية
         */
        function addXP(xpAmount) {
            if (xpAmount <= 0) return 0;
            st.xp += xpAmount;
            let levelsGained = 0;
            while (st.xp >= st.xpToNext) {
                st.xp       -= st.xpToNext;
                st.level++;
                levelsGained++;
                /* كل 5 مستويات: تسارع أكبر في الصعوبة */
                const multiplier = st.level % 5 === 0 ? 1.5 : 1.35;
                st.xpToNext = Math.floor(st.xpToNext * multiplier);
                playSound('levelup');
                /* إشعار فتح محتوى جديد */
                checkLevelUnlockReward(st.level);
            }
            saveSt();
            return levelsGained;
        }

        /* جدول فتح المحتوى حسب المستوى */
        const LEVEL_UNLOCKS = {
            2:  'فتح الضرب والقسمة! ✖️➗',
            3:  'فتح الصعوبة المتوسطة! 🟡',
            4:  'فتح قسم التحديات! ⚡',
            5:  'فتح الصعوبة الصعبة! 🟠 • +10💰',
            7:  'فتح الرياضيات المتقدمة! 📐',
            8:  'فتح مستوى العبقري! 🔴',
            10: 'فتح قوانين وألغاز! 📜 • +15💰',
            15: '🌟 مستوى متميز! شارة خاصة • +20💰',
            20: '👑 مستوى 20! لقب "بطل الأرقام" • +30💰',
            25: '🏆 مستوى 25! شارة ذهبية • +25💰',
            30: '💎 مستوى 30! "أسطورة الرياضيات" • +40💰',
            50: '🔱 مستوى 50! حالة أسطورية • +50💰',
        };

        function checkLevelUnlockReward(level) {
            const msg = LEVEL_UNLOCKS[level];
            if (!msg) return;
            /* مكافأة مستويات معينة */
            if (level === 5)  { st.coins += 10; st.totalCoinsEarned += 10; }
            if (level === 10) { st.coins += 15; st.totalCoinsEarned += 15; }
            if (level === 15) { st.coins += 20; st.totalCoinsEarned += 20; }
            if (level === 20) { st.coins += 30; st.totalCoinsEarned += 30; }
            if (level === 25) { st.coins += 25; st.totalCoinsEarned += 25; }
            if (level === 30) { st.coins += 40; st.totalCoinsEarned += 40; }
            if (level === 50) { st.coins += 50; st.totalCoinsEarned += 50; }
            /* نافذة تهنئة بعد لحظة */
            setTimeout(() => showLevelUpModal(level, msg), 600);
        }

        function showLevelUpModal(level, msg) {
            const existing = document.getElementById('levelUpModal');
            if (existing) existing.remove();
            const div = document.createElement('div');
            div.id = 'levelUpModal';
            div.style.cssText = `
                position:fixed;inset:0;z-index:9999;
                display:flex;align-items:center;justify-content:center;
                background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);
                animation:fadeIn 0.3s ease;
            `;
            div.innerHTML = `
                <div style="
                    background:linear-gradient(135deg,var(--surface2),var(--surface3));
                    border:2px solid var(--gold);border-radius:26px;
                    padding:32px 28px;text-align:center;max-width:320px;width:88%;
                    box-shadow:0 8px 40px rgba(240,185,11,0.3);
                    animation:scaleIn 0.35s cubic-bezier(.34,1.56,.64,1);
                ">
                    <div style="font-size:3em;margin-bottom:10px;">🎉</div>
                    <div style="font-size:1.15em;font-weight:900;color:var(--gold);margin-bottom:6px;">
                        المستوى ${level}!
                    </div>
                    <div style="font-size:0.82em;color:var(--text2);line-height:1.6;margin-bottom:20px;">${msg}</div>
                    <button onclick="document.getElementById('levelUpModal').remove()"
                        style="background:linear-gradient(135deg,var(--gold),var(--gold2));
                        color:#000;border:none;border-radius:14px;padding:12px 32px;
                        font-family:'Tajawal',sans-serif;font-size:0.92em;font-weight:900;
                        cursor:pointer;width:100%;">
                        رائع! 🚀
                    </button>
                </div>`;
            document.body.appendChild(div);
            /* إغلاق تلقائي بعد 5 ثوانٍ */
            setTimeout(() => { if (document.getElementById('levelUpModal')) div.remove(); }, 5000);
        }

        /* ═══════════════════════════════════════════════
           مكافأة تسجيل الدخول اليومي
        ═══════════════════════════════════════════════ */
        function checkDailyLoginReward() {
            const today = todayStr();
            if (st.loginRewardDate === today) return; /* أُخذت اليوم مسبقاً */

            /* احتساب السلسلة */
            const yesterday = (() => {
                const d = new Date(); d.setDate(d.getDate() - 1);
                return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            })();
            if (st.loginRewardDate === yesterday) {
                st.dailyStreak++;
            } else if (st.loginRewardDate !== today) {
                st.dailyStreak = 1; /* انقطعت السلسلة */
            }

            /* مكافأة تتدرج مع السلسلة */
            let reward = 2;
            if (st.dailyStreak >= 3)  reward = 4;
            if (st.dailyStreak >= 7)  reward = 7;
            if (st.dailyStreak >= 14) reward = 12;
            if (st.dailyStreak >= 30) reward = 20;

            st.coins             += reward;
            st.totalCoinsEarned  += reward;
            st.loginRewardDate    = today;
            st.lastDailyDate      = today;
            saveSt();

            /* إظهار إشعار المكافأة */
            setTimeout(() => {
                showLoginRewardPopup(reward, st.dailyStreak);
            }, 1200);
        }

        function showLoginRewardPopup(reward, streak) {
            const div = document.createElement('div');
            div.style.cssText = `
                position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
                z-index:9998;background:linear-gradient(135deg,var(--surface2),var(--surface3));
                border:1.5px solid rgba(240,185,11,0.4);border-radius:18px;
                padding:14px 22px;text-align:center;min-width:220px;
                box-shadow:0 6px 30px rgba(0,0,0,0.4);
                animation:slideUp 0.4s cubic-bezier(.34,1.56,.64,1);
            `;
            div.innerHTML = `
                <div style="font-size:1.5em;margin-bottom:4px;">🎁</div>
                <div style="font-size:0.85em;font-weight:900;color:var(--gold);">مكافأة اليوم</div>
                <div style="font-size:1.3em;font-weight:900;color:var(--text);margin:4px 0;">+${reward} 💰</div>
                <div style="font-size:0.65em;color:var(--text3);">السلسلة: ${streak} يوم 🔥</div>
            `;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 3000);
        }

        /* ═══════════════════════════════════════════════
           صندوق المفاجآت كل 7 أيام
        ═══════════════════════════════════════════════ */
        function checkLootbox() {
            if (!st.lootboxLastDate) {
                st.lootboxLastDate  = todayStr();
                st.lootboxDayCount  = 1;
                saveSt(); return;
            }
            if (st.lootboxLastDate === todayStr()) return;

            st.lootboxDayCount++;
            st.lootboxLastDate = todayStr();

            if (st.lootboxDayCount >= 7) {
                st.lootboxDayCount = 0;
                saveSt();
                setTimeout(() => openLootbox(), 2000);
            } else {
                saveSt();
            }
        }

        function openLootbox() {
            /* جائزة عشوائية */
            const prizes = [
                { label: '🪙 +15 عملة',   action: () => { st.coins += 15; st.totalCoinsEarned += 15; } },
                { label: '🪙 +25 عملة',   action: () => { st.coins += 25; st.totalCoinsEarned += 25; } },
                { label: '🪙 +10 عملة',   action: () => { st.coins += 10; st.totalCoinsEarned += 10; } },
                { label: '⚡ +500 XP',    action: () => { addXP(500); } },
                { label: '🛡️ درع الحماية', action: () => { st.dailyShieldUsed = false; } },
                { label: '🪙 +30 عملة',   action: () => { st.coins += 30; st.totalCoinsEarned += 30; } },
            ];
            const prize = prizes[Math.floor(Math.random() * prizes.length)];
            prize.action();
            saveSt();

            const div = document.createElement('div');
            div.style.cssText = `
                position:fixed;inset:0;z-index:9999;
                display:flex;align-items:center;justify-content:center;
                background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);
            `;
            div.innerHTML = `
                <div style="
                    background:linear-gradient(135deg,var(--surface2),var(--surface3));
                    border:2px solid var(--gold);border-radius:26px;
                    padding:32px 28px;text-align:center;max-width:300px;width:86%;
                    box-shadow:0 8px 40px rgba(240,185,11,0.35);
                    animation:scaleIn 0.4s cubic-bezier(.34,1.56,.64,1);
                ">
                    <div style="font-size:3.5em;margin-bottom:8px;">🎁</div>
                    <div style="font-size:1em;font-weight:900;color:var(--gold);margin-bottom:4px;">صندوق المفاجآت!</div>
                    <div style="font-size:0.78em;color:var(--text2);margin-bottom:16px;">7 أيام دخول متتالية 🎉</div>
                    <div style="font-size:1.4em;font-weight:900;color:var(--text);margin-bottom:20px;">${prize.label}</div>
                    <button onclick="this.closest('div[style]').remove()"
                        style="background:linear-gradient(135deg,var(--gold),var(--gold2));
                        color:#000;border:none;border-radius:14px;padding:12px 32px;
                        font-family:'Tajawal',sans-serif;font-size:0.92em;font-weight:900;
                        cursor:pointer;width:100%;">
                        رائع! ✨
                    </button>
                </div>`;
            document.body.appendChild(div);
        }

        /* ═══════════════════════════════════════════════
           تصفير كامل
        ═══════════════════════════════════════════════ */
        function confirmResetComplete(force) {
            showConfirm('البدء من جديد',
                'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟',
                'نعم، احذف الكل', 'إلغاء', (ok) => {
                    if (ok) {
                        localStorage.removeItem(SK);
                        for (let i = localStorage.length - 1; i >= 0; i--) {
                            const key = localStorage.key(i);
                            if (key && key.startsWith('ho_math_backup_')) localStorage.removeItem(key);
                        }
                        localStorage.removeItem('ho_math_user_count');
                        st = defState();
                        saveSt();
                        currentOp = st.lastOp || 'mix';
                        updateUI(); loadProfileForm(); applyDarkMode(); applyProfilePhoto();
                        if (typeof clearGameTimer === 'function') clearGameTimer();
                        if (typeof G !== 'undefined' && G) {
                            G.ended = true;
                            if (G.timer) clearInterval(G.timer);
                        }
                        goTab('home');
                        showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية');
                    }
                });
        }
