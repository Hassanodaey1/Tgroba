/* STATE */
        /* ═══════════ GLOBAL STATE ═══════════ */
        const SK = 'ho_math_v7';

        function todayStr() {
            const d = new Date();
            /* ✅ FIX-DATE-PAD: zero-padding لمنع أخطاء المقارنة النصية (2026-5-1 ≠ 2026-10-1) */
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }

        function weekStr() {
            /* ✅ FIX-WEEKSTR: حساب رقم الأسبوع بشكل صحيح — المعيار ISO 8601 */
            const d = new Date();
            const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
            const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
            return `${date.getUTCFullYear()}-W${String(week).padStart(2,'0')}`;
        }

        /* ═══════════════════════════════════════════════════════════
           مفتاح الموسم الأسبوعي
        ═══════════════════════════════════════════════════════════ */
        function seasonPassStr() { return weekStr(); }

        /* ═══════════════════════════════════════════════════════════
           جوائز مسار الموسم — 10 محطات كل 100 نقطة
        ═══════════════════════════════════════════════════════════ */
        const SEASON_TRACK_REWARDS = [
            { pts: 100,  icon: '💰', label: '+30 عملة',              reward: { type: 'coins',           value: 30  } },
            { pts: 200,  icon: '⏭️', label: '+3 تخطيات',             reward: { type: 'inventory_skip',  value: 3   } },
            { pts: 300,  icon: '💰', label: '+50 عملة',              reward: { type: 'coins',           value: 50  } },
            { pts: 400,  icon: '🖼️', label: 'إطار حصري للموسم',     reward: { type: 'frame',           value: 'frame_season1' } },
            { pts: 500,  icon: '⚡', label: 'مضاعف XP ×2',           reward: { type: 'xp_boost',        value: 2   } },
            { pts: 600,  icon: '🛡️', label: 'درع حماية Streak',     reward: { type: 'streak_shield',   value: 1   } },
            { pts: 700,  icon: '💰', label: '+80 عملة',              reward: { type: 'coins',           value: 80  } },
            { pts: 800,  icon: '🎭', label: 'لقب "رياضي الموسم"',    reward: { type: 'title',           value: 'season_math1' } },
            { pts: 900,  icon: '🚀', label: 'مضاعف XP ×3',           reward: { type: 'xp_boost',        value: 3   } },
            { pts: 1000, icon: '👑', label: 'إطار + لقب "بطل الموسم"', reward: { type: 'season_complete', value: 'S1' } },
        ];

        /* ═══════════════════════════════════════════════════════════
           أسماء المواسم — تتناوب أسبوعياً
        ═══════════════════════════════════════════════════════════ */
        const SEASON_NAMES = [
            'موسم الأرقام الذهبية 🔢',
            'موسم المعادلات 🔮',
            'موسم الهندسة 📐',
            'موسم الكسور 🍕',
            'موسم الأسس والجذور √',
            'موسم الإحصاء 📊',
            'موسم الجبر 🔣',
            'موسم المنطق 🧠',
        ];
        function getCurrentSeasonName() {
            const num = parseInt((weekStr().split('-W')[1]) || '1', 10);
            return SEASON_NAMES[(num - 1) % SEASON_NAMES.length];
        }

        /* ═══════════════════════════════════════════════════════════
           رتب الموسم — حسب النقاط المتراكمة
        ═══════════════════════════════════════════════════════════ */
        const SEASON_RANKS = [
            { min: 0,    label: 'مبتدئ',     icon: '🥉', color: '#b87333', cls: 'rank-bronze'   },
            { min: 200,  label: 'متدرب',      icon: '🥈', color: '#b0b8c8', cls: 'rank-silver'   },
            { min: 400,  label: 'محترف',      icon: '🥇', color: '#f0b90b', cls: 'rank-gold'     },
            { min: 600,  label: 'ماسي',       icon: '💎', color: '#00d4ff', cls: 'rank-diamond'  },
            { min: 800,  label: 'أسطوري',     icon: '👑', color: '#a855f7', cls: 'rank-legend'   },
            { min: 1000, label: 'بطل الموسم', icon: '🌟', color: '#f0b90b', cls: 'rank-champion' },
        ];
        function getSeasonRank(pts) {
            let rank = SEASON_RANKS[0];
            for (const r of SEASON_RANKS) { if (pts >= r.min) rank = r; }
            return rank;
        }

        /* ═══════════════════════════════════════════════════════════
           مهام الفلاش المتاحة — تُختار عشوائياً
        ═══════════════════════════════════════════════════════════ */
        const FLASH_TASK_POOL = [
            { id:'f1', icon:'⚡', name:'برق الرياضيات',    desc:'اجمع 20 نقطة في التحدي خلال ساعتين',  type:'challenge_score', target:20,  pts:25 },
            { id:'f2', icon:'🔥', name:'خمسة بخمسة',       desc:'أجب صح على 5 أسئلة متتالية الآن',      type:'any_correct',     target:5,   pts:20 },
            { id:'f3', icon:'💫', name:'صاروخ عاجل',       desc:'العب وضع الصاروخ مرة خلال ساعتين',     type:'rocket_games',    target:1,   pts:20 },
            { id:'f4', icon:'🎯', name:'عشرة بعشرة',       desc:'أجب صح على 10 أسئلة الآن',             type:'any_correct',     target:10,  pts:25 },
            { id:'f5', icon:'💎', name:'كنز عاجل',         desc:'اجمع 15 عملة خلال ساعتين',             type:'earn_coins',      target:15,  pts:20 },
            { id:'f6', icon:'🚀', name:'إنطلاق فوري',      desc:'اجمع 30 نقطة في أي وضع خلال ساعتين',  type:'any_score',       target:30,  pts:25 },
            { id:'f7', icon:'⭐', name:'نجم ساطع',         desc:'العب لعبتين في أي وضع الآن',           type:'any_games',       target:2,   pts:20 },
            { id:'f8', icon:'🏆', name:'تحدي الساعة',      desc:'اجمع 40 نقطة في التحدي خلال ساعتين',  type:'challenge_score', target:40,  pts:30 },
        ];

        function defState() {
            return {
                name: 'Player',
                age: 0,
                birthDate: '2000-01-01',
                gender: 'm',
                avatar: '👦',
                profilePhoto: null,
                xp: 0,
                /* ✅ FIX-XP: يتوافق مع calcXpToNext(1) = 400+120+40 = 560 بدلاً من 1000 */
                xpToNext: 560,
                level: 1,
                coins: 10,
                correctTotal: 0,
                wrongTotal: 0,
                bestStreak: 0,
                totalGames: 0,
                bestScore: 0,
                difficulty: 'easy',
                lastMode: 'classic',
                lastOp: 'mix',
                soundOn: true,
                soundVolume: 80,
                bgOn: true,
                bgVolume: 60,
                vibrationOn: false,
                vibrationStrength: 30,
                stats: {},
                history: [],
                catCounter: { correct: 0, total: 0 },
                catChallenges: { games: 0 },
                dailyTasks: [],
                dailyDate: todayStr(),
                /* ═══ مهام الفئات المصنّفة ═══ */
                categoryTasks: null,
                categoryTasksDate: '',
                /* إحصائيات يومية */
                dailyStats: { correct: 0, wrong: 0, games: 0, date: todayStr() },
                /* إحصائيات أسبوعية */
                weeklyStats: { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() },
                tGold: '#f0b90b',
                tAccent: '#7c3aed',
                tAccent2: '#06b6d4',
                sessionTimeSecs: 0,
                sessionDate: todayStr(),
                /* ✅ STATS-V2: وقت اللعب الكلي التراكمي */
                totalPlayTimeSecs: 0,
                /* ✅ STATS-V2: أرشيف الأسابيع */
                weeklyHistory: [],
                ownedEmojis: ['👦'],
                hearts: 3,
                dailyStreak: 0,
                lastDailyDate: null,
                dailyShieldUsed: false,
                lastShieldDate: null,
                achievementsUnlocked: [],
                achievementRewardClaimed: false,
                serialNumber: '',
                darkMode: true,
                challengeBestScore: 0,
                /* ═══ صندوق المكافأة اليومي ═══ */
                dailyBox: { opened: false, date: '', reward: 0 },
                /* ═══ مكافأة تسجيل الدخول اليومي ═══ */
                loginBonusDate: '',
                _lastLoginBonus: '',  /* ✅ مزامنة مع loginBonusDate لمنع المكافأة المزدوجة */
                /* ═══ شارات التحديات الجديدة ═══ */
                badge_accuracy:   false,
                badge_marathon:   false,
                badge_impossible: false,
                /* ═══ إحصائيات الأوضاع الجديدة ═══ */
                accuracyBest:   0,
                marathonBest:   0,
                impossibleBest: 0,
                /* ═══ مخزون المساعدات الدائم ═══ */
                inventory: { skip: 0, heart: 0, remove: 0, hint: 0 },
                /* ✅ FIX-ADREWARD: وقت آخر مكافأة إعلان — لمنع الغش (0 = لم يُستخدم بعد) */
                _lastAdRewardTime: 0,
                /* ═══ وضع الذاكرة ═══ */
                memoryBest: 0,          /* أفضل عدد إجابات صحيحة في وضع الذاكرة */
                memoryPerfect: 0,       /* عدد مرات إكمال الوضع بدون أخطاء */
                badge_memory: false,    /* شارة وضع الذاكرة */
                /* ═══ وضع السلسلة ═══ */
                chainBest: 0,           /* أطول سلسلة محققة */
                badge_chain: false,     /* شارة وضع السلسلة */
                /* ═══ وضع ضد الساعة ═══ */
                suddenBest: 0,          /* أفضل عدد أسئلة صحيحة في وضع ضد الساعة */
                badge_sudden: false,    /* شارة وضع ضد الساعة */
                /* ═══ وضع الصاروخ ═══ */
                _rocketMaxStage: 0,     /* أعلى مرحلة وصلها اللاعب (0=سهل ... 6=عبقري) */
                badge_rocket: false,    /* شارة وضع الصاروخ */
                /* ═══ تحدي الأسبوع ═══ */
                weeklyChallengePlayed: false,
                weeklyChallengeDate: '',
                weeklyChallengeBest: 0,

                /* ═══════════════════════════════════════════════════════
                   🏆 SEASON PASS v2 — موسم الرياضيات (بيانات كاملة)
                ═══════════════════════════════════════════════════════ */
                season: {
                    /* ── الأساس (من v1) ── */
                    weekKey:        '',
                    points:         0,
                    claimedRewards: [],
                    dailyTasks:     [],
                    dailyTasksDate: '',
                    completedDays:  0,
                    totalPtsEarned: 0,

                    /* ── Streak — التتابع اليومي ── */
                    streak:         0,     /* عدد الأيام المتتالية التي أكمل فيها المهام */
                    bestStreak:     0,     /* أعلى streak وصله اللاعب على الإطلاق */
                    streakShields:  0,     /* عدد دروع الحماية من كسر الـ streak */
                    lastStreakDate:  '',    /* آخر يوم أكمل فيه المهام (لحساب الـ streak) */

                    /* ── مهام الفلاش ⚡ ── */
                    flashTask:      null,  /* { id,icon,name,desc,type,target,current,pts,expiresAt,done } */
                    flashTaskDate:  '',    /* تاريخ توليد الفلاش — لتوليد واحد يومياً */

                    /* ── Bonus Day ×2 ── */
                    bonusDayUsed:   '',    /* آخر يوم جمعة استُفيد منه (YYYY-MM-DD) */

                    /* ── صندوق الموسم 🎁 ── */
                    chestAvailable: false, /* يصبح true عند إكمال 35 مهمة أسبوعية */
                    chestOpened:    false, /* هل فُتح هذا الأسبوع؟ */

                    /* ── ذاكرة المواسم ── */
                    history: [],           /* [{ weekKey, name, pts, rank, completed, streak }] */
                },

                /* ═══ إحصائيات الأوضاع — مطلوبة للمهام ═══ */
                rocketGamesPlayed:  0,     /* عدد مرات لعب وضع الصاروخ */
                rocketBestScore:    0,     /* أفضل نتيجة في وضع الصاروخ */
                coinsEarnedToday:   0,     /* عملات مكتسبة اليوم */
                coinsEarnedDate:    '',    /* تاريخ آخر ضبط لـ coinsEarnedToday */
                challengeGamesPlayed: 0,   /* عدد مرات لعب التحدي */
            };
        }

        function sanitizeState(s) {
            /* ✅ FIX-V2: حدود عليا لمنع التلاعب بـ localStorage */
            if (typeof s.coins !== 'number'  || s.coins < 0)   s.coins = 0;
            if (s.coins  > 999999)  s.coins  = 999999;
            if (typeof s.level !== 'number'  || s.level < 1)   s.level = 1;
            if (s.level  > 200)     s.level  = 200;
            if (typeof s.xp !== 'number'     || s.xp < 0)      s.xp = 0;
            if (s.xp     > 99999999) s.xp    = 99999999;
            /* ✅ FIX-XP: الحد الأدنى 460 = calcXpToNext(1) تقريباً لتجنب قيم مشوهة */
            if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 560;
            if (!s.ownedEmojis || !Array.isArray(s.ownedEmojis)) s.ownedEmojis = ['👦'];
            if (!s.stats || typeof s.stats !== 'object') s.stats = {};
            if (!s.history) s.history = [];
            if (!s.catCounter) s.catCounter = { correct: 0, total: 0 };
            if (!s.catChallenges) s.catChallenges = { games: 0 };
            if (!s.achievementsUnlocked) s.achievementsUnlocked = [];
            if (s.achievementRewardClaimed === undefined) s.achievementRewardClaimed = false;
            if (!s.birthDate) s.birthDate = '2000-01-01';
            if (typeof s.age !== 'number') s.age = 0;
            if (s.darkMode === undefined) s.darkMode = true;
            if (typeof s.challengeBestScore !== 'number') s.challengeBestScore = 0;
            if (typeof s.soundVolume !== 'number') s.soundVolume = 80;
            if (typeof s.bgVolume !== 'number') s.bgVolume = 60;
            if (s.vibrationOn === undefined) s.vibrationOn = false;
            if (typeof s.vibrationStrength !== 'number') s.vibrationStrength = 30;
            if (s.profilePhoto === undefined) s.profilePhoto = null;
            /* ✅ FIX-V2b: حدود عليا للإحصائيات */
            if (typeof s.bestScore    !== 'number' || s.bestScore < 0)    s.bestScore = 0;
            if (s.bestScore    > 9999999)  s.bestScore    = 9999999;
            if (typeof s.correctTotal !== 'number' || s.correctTotal < 0) s.correctTotal = 0;
            if (s.correctTotal > 9999999)  s.correctTotal = 9999999;
            if (typeof s.totalGames   !== 'number' || s.totalGames < 0)   s.totalGames = 0;
            if (s.totalGames   > 9999999)  s.totalGames   = 9999999;
            if (typeof s.challengeBestScore !== 'number' || s.challengeBestScore < 0) s.challengeBestScore = 0;
            if (s.challengeBestScore > 9999999) s.challengeBestScore = 9999999;
            /* ✅ STATS-V2: حقول الوقت الجديدة */
            if (typeof s.totalPlayTimeSecs !== 'number' || s.totalPlayTimeSecs < 0) s.totalPlayTimeSecs = 0;
            if (s.totalPlayTimeSecs > 99999999) s.totalPlayTimeSecs = 99999999;
            if (!s.weeklyHistory) s.weeklyHistory = [];
            if (s.weeklyStats && typeof s.weeklyStats._baseSessionSecs !== 'number') s.weeklyStats._baseSessionSecs = 0;
            /* ✅ STATS-V2: إصلاح xpToNext المشوّهة */
            if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 560;
            /* إذا كانت xpToNext أكبر من 500,000 → مشوّهة من الضرب المتكرر × 1.3 */
            if (s.xpToNext > 500000) {
                const calcFn = typeof calcXpToNext === 'function' ? calcXpToNext : function(lv) {
                    return Math.floor(400 + 120 * lv + 40 * Math.sqrt(lv));
                };
                s.xpToNext = calcFn(s.level || 1);
                if (s.xp >= s.xpToNext) s.xp = Math.floor(s.xpToNext * 0.5);
            }
            if (!s.dailyStats || s.dailyStats.date !== todayStr()) {
                s.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }
            /* ═══ مهام الفئات المصنّفة ═══ */
            if (!s.categoryTasks  || typeof s.categoryTasks  !== 'object') s.categoryTasks  = null;
            if (typeof s.categoryTasksDate !== 'string') s.categoryTasksDate = '';
            if (!s.weeklyStats || s.weeklyStats.week !== weekStr()) {
                s.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() };
            }
            /* ═══ صندوق المكافأة اليومي ═══ */
            if (!s.dailyBox || typeof s.dailyBox !== 'object') {
                s.dailyBox = { opened: false, date: '', reward: 0 };
            }
            /* ═══ مكافأة تسجيل الدخول اليومي ═══ */
            if (typeof s.loginBonusDate !== 'string') s.loginBonusDate = '';
            /* ✅ FIX-DOUBLE-BONUS: مزامنة _lastLoginBonus مع loginBonusDate */
            s._lastLoginBonus = s.loginBonusDate;
            /* ═══ شارات التحديات ═══ */
            if (s.badge_accuracy   === undefined) s.badge_accuracy   = false;
            if (s.badge_marathon   === undefined) s.badge_marathon   = false;
            if (s.badge_impossible === undefined) s.badge_impossible = false;
            if (typeof s.accuracyBest   !== 'number') s.accuracyBest   = 0;
            if (typeof s.marathonBest   !== 'number') s.marathonBest   = 0;
            if (typeof s.impossibleBest !== 'number') s.impossibleBest = 0;
            /* ═══ مخزون المساعدات ═══ */
            if (!s.inventory || typeof s.inventory !== 'object') s.inventory = { skip: 0, heart: 0, remove: 0, hint: 0 };
            if (typeof s.inventory.skip   !== 'number' || s.inventory.skip   < 0) s.inventory.skip   = 0;
            if (typeof s.inventory.heart  !== 'number' || s.inventory.heart  < 0) s.inventory.heart  = 0;
            if (typeof s.inventory.remove !== 'number' || s.inventory.remove < 0) s.inventory.remove = 0;
            if (s.inventory.skip   > 99) s.inventory.skip   = 99;
            if (s.inventory.heart  > 99) s.inventory.heart  = 99;
            if (s.inventory.remove > 99) s.inventory.remove = 99;
            if (typeof s.inventory.hint !== 'number' || s.inventory.hint < 0) s.inventory.hint = 0;
            if (s.inventory.hint > 99) s.inventory.hint = 99;
            /* ✅ FIX-ADREWARD: تأكد من أن وقت المكافأة رقم صحيح */
            if (typeof s._lastAdRewardTime !== 'number' || s._lastAdRewardTime < 0) s._lastAdRewardTime = 0;
            /* ═══ وضع الذاكرة ═══ */
            if (typeof s.memoryBest    !== 'number' || s.memoryBest    < 0) s.memoryBest    = 0;
            if (typeof s.memoryPerfect !== 'number' || s.memoryPerfect < 0) s.memoryPerfect = 0;
            if (s.badge_memory === undefined) s.badge_memory = false;
            /* ═══ وضع ضد الساعة ═══ */
            if (typeof s.suddenBest !== 'number' || s.suddenBest < 0) s.suddenBest = 0;
            if (s.badge_sudden === undefined) s.badge_sudden = false;
            /* ═══ وضع الصاروخ ═══ */
            if (typeof s._rocketMaxStage !== 'number' || s._rocketMaxStage < 0) s._rocketMaxStage = 0;
            if (s._rocketMaxStage > 6) s._rocketMaxStage = 6;
            if (s.badge_rocket === undefined) s.badge_rocket = false;
            /* ═══ تحدي الأسبوع ═══ */
            if (typeof s.weeklyChallengePlayed !== 'boolean') s.weeklyChallengePlayed = false;
            if (typeof s.weeklyChallengeDate   !== 'string')  s.weeklyChallengeDate   = '';
            if (typeof s.weeklyChallengeBest   !== 'number' || s.weeklyChallengeBest < 0) s.weeklyChallengeBest = 0;
            /* إعادة ضبط تلقائي إذا تغيّر الأسبوع */
            if (s.weeklyChallengeDate && s.weeklyChallengeDate !== weekStr()) {
                s.weeklyChallengePlayed = false;
                s.weeklyChallengeDate   = '';
            }

            /* ═══════════════════════════════════════════════════════
               ✅ SEASON PASS v2 — sanitize شامل
            ═══════════════════════════════════════════════════════ */
            if (!s.season || typeof s.season !== 'object') s.season = defState().season;

            /* ── حقول الأساس ── */
            if (typeof s.season.weekKey        !== 'string')  s.season.weekKey        = '';
            if (typeof s.season.points         !== 'number'
                || s.season.points < 0)                       s.season.points         = 0;
            if (s.season.points > 1000)                       s.season.points         = 1000;
            if (!Array.isArray(s.season.claimedRewards))      s.season.claimedRewards = [];
            if (!Array.isArray(s.season.dailyTasks))          s.season.dailyTasks     = [];
            if (typeof s.season.dailyTasksDate !== 'string')  s.season.dailyTasksDate = '';
            if (typeof s.season.completedDays  !== 'number'
                || s.season.completedDays < 0)                s.season.completedDays  = 0;
            if (typeof s.season.totalPtsEarned !== 'number'
                || s.season.totalPtsEarned < 0)               s.season.totalPtsEarned = 0;

            /* ── Streak ── */
            if (typeof s.season.streak        !== 'number' || s.season.streak        < 0) s.season.streak        = 0;
            if (typeof s.season.bestStreak    !== 'number' || s.season.bestStreak    < 0) s.season.bestStreak    = 0;
            if (typeof s.season.streakShields !== 'number' || s.season.streakShields < 0) s.season.streakShields = 0;
            if (s.season.streakShields > 10)                                               s.season.streakShields = 10;
            if (typeof s.season.lastStreakDate !== 'string') s.season.lastStreakDate = '';
            /* حماية: streak لا يتجاوز 365 */
            if (s.season.streak     > 365) s.season.streak     = 365;
            if (s.season.bestStreak > 365) s.season.bestStreak = 365;

            /* ── مهام الفلاش ── */
            if (s.season.flashTask !== null && typeof s.season.flashTask !== 'object') s.season.flashTask = null;
            if (typeof s.season.flashTaskDate !== 'string') s.season.flashTaskDate = '';
            /* إبطال الفلاش المنتهي */
            if (s.season.flashTask && s.season.flashTask.expiresAt && Date.now() > s.season.flashTask.expiresAt && !s.season.flashTask.done) {
                s.season.flashTask = null;
            }

            /* ── Bonus Day ── */
            if (typeof s.season.bonusDayUsed !== 'string') s.season.bonusDayUsed = '';

            /* ── صندوق الموسم ── */
            if (typeof s.season.chestAvailable !== 'boolean') s.season.chestAvailable = false;
            if (typeof s.season.chestOpened    !== 'boolean') s.season.chestOpened    = false;

            /* ── ذاكرة المواسم ── */
            if (!Array.isArray(s.season.history)) s.season.history = [];
            /* حد أقصى 52 موسم (سنة كاملة) */
            if (s.season.history.length > 52) s.season.history = s.season.history.slice(-52);

            /* ── إعادة ضبط أسبوعية تلقائية ── */
            if (s.season.weekKey && s.season.weekKey !== seasonPassStr()) {
                /* حفظ الموسم المنتهي في السجل قبل الضبط */
                if (s.season.points > 0) {
                    s.season.history.push({
                        weekKey:   s.season.weekKey,
                        name:      getCurrentSeasonName(),
                        pts:       s.season.points,
                        completed: s.season.points >= 1000,
                        streak:    s.season.streak,
                        savedAt:   Date.now(),
                    });
                    if (s.season.history.length > 52) s.season.history = s.season.history.slice(-52);
                }
                /* ضبط الموسم الجديد */
                s.season.weekKey        = seasonPassStr();
                s.season.points         = 0;
                s.season.claimedRewards = [];
                s.season.dailyTasks     = [];
                s.season.dailyTasksDate = '';
                s.season.flashTask      = null;
                s.season.flashTaskDate  = '';
                s.season.bonusDayUsed   = '';
                s.season.chestAvailable = false;
                s.season.chestOpened    = false;
                /* streak يُعاد فقط إذا لم يكتمل اليوم الأخير (معالجة في competition_logic) */
            }
            if (!s.season.weekKey) s.season.weekKey = seasonPassStr();

            /* ── إحصائيات الأوضاع ── */
            if (typeof s.rocketGamesPlayed  !== 'number' || s.rocketGamesPlayed  < 0) s.rocketGamesPlayed  = 0;
            if (typeof s.rocketBestScore    !== 'number' || s.rocketBestScore    < 0) s.rocketBestScore    = 0;
            if (typeof s.challengeGamesPlayed !== 'number' || s.challengeGamesPlayed < 0) s.challengeGamesPlayed = 0;

            /* ── عملات اليوم ── */
            if (typeof s.coinsEarnedToday !== 'number' || s.coinsEarnedToday < 0) s.coinsEarnedToday = 0;
            if (typeof s.coinsEarnedDate  !== 'string') s.coinsEarnedDate = '';
            /* إعادة ضبط العداد اليومي */
            if (s.coinsEarnedDate !== todayStr()) {
                s.coinsEarnedToday = 0;
                s.coinsEarnedDate  = todayStr();
            }

            return s;
        }

        /* ✅ FIX-V4: مجموع عملات الإنجازات المستحقة — يُحسب ولا يمكن التزوير عليه */
        function calcMaxAchievementCoins() {
            /* يُعيد المجموع الأقصى الممكن من مكافآت الإنجازات */
            try {
                if (typeof ACHIEVEMENTS_DEF === 'undefined') return 999999;
                return ACHIEVEMENTS_DEF.reduce(function(s,a){ return s + (a.reward||0); }, 0) + 5;
            } catch(e) { return 999999; }
        }

        function loadSt() {
            try {
                const s = JSON.parse(localStorage.getItem(SK));
                if (s && s.name !== undefined) {
                    /* ✅ FIX-MERGE: دمج المفاتيح الناقصة من الحالة الافتراضية لتجنب أعطال الإصدارات القديمة */
                    const def = defState();
                    Object.keys(def).forEach(k => { if (s[k] === undefined) s[k] = def[k]; });
                    return sanitizeState(s);
                }
            } catch (e) {}
            return defState();
        }

        function saveSt() {
            try {
                /* ✅ ANTI-CHEAT: تحقق من الحدود قبل الحفظ دائماً */
                sanitizeState(st);
                localStorage.setItem(SK, JSON.stringify(st));
                if (st.serialNumber) {
                    saveSerialBackup(st.serialNumber, st);
                    /* ☁️ CLOUD: حفظ تلقائي في Firebase عند كل تغيير */
                    saveToFirebase(st.serialNumber, st);
                }
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

        /* ═══════════════════════════════════════════════
           ☁️ FIREBASE CLOUD BACKUP — حفظ واستعادة سحابي
           ═══════════════════════════════════════════════ */

        function saveToFirebase(serial, data) {
            if (!database || !serial) return;
            try {
                /* نحذف صورة الملف الشخصي: قد تكون كبيرة جداً لـ Firebase */
                const toSave = Object.assign({}, data, { profilePhoto: null, _savedAt: Date.now() });
                database.ref('players/' + serial).set(toSave)
                    .catch(function(e) { console.warn('Firebase save failed:', e.message); });
            } catch(e) { console.warn('saveToFirebase error:', e); }
        }

        function loadFromFirebase(serial, callback) {
            if (!database || !serial) { callback(null); return; }
            try {
                database.ref('players/' + serial).once('value')
                    .then(function(snap) { callback(snap.val()); })
                    .catch(function(e) { console.warn('Firebase load failed:', e.message); callback(null); });
            } catch(e) { console.warn('loadFromFirebase error:', e); callback(null); }
        }

        function generateSerialNumber(birthDate, name) {
            const nameEng = (name || 'User').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
            const cleanDate = birthDate.replace(/-/g, '');
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const count = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
            localStorage.setItem('ho_math_user_count', count);
            return `${cleanDate}-${nameEng}-${randomPart}-${count}`;
        }

        function updateSerialNumberDisplay() {
            /* ✅ FIX-SERIAL-UI: إظهار الرقم فقط في مستطيل صغير، بدون نسخ أو استعادة */
            const el = document.getElementById('serialNumberDisplay');
            const section = document.getElementById('serialSection');
            const serial = st.serialNumber || '';
            if (el) el.textContent = serial || '—';
            /* إظهار القسم فقط إذا وُجد رقم تسلسلي */
            if (section) section.style.display = serial ? 'block' : 'none';
            /* تحديث عرض الإعدادات أيضاً */
            ['settingsSerialDisplay'].forEach(id => {
                const s = document.getElementById(id);
                if (s) s.textContent = serial || 'احفظ التغييرات أولاً لتوليد الرقم';
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

        /* ═══ مساعد مشترك لتطبيق البيانات المستعادة ═══ */
        function _applyRestoredData(data, inputId, panelId) {
            Object.assign(st, sanitizeState(data));
            saveSt(); updateUI(); loadProfileForm(); applyDarkMode(); applyProfilePhoto();
            updateSerialNumberDisplay();
            showFeedback('✅ تم استعادة الحساب بنجاح ☁️');
            const panel = document.getElementById(panelId);
            if (panel) panel.style.display = 'none';
            const inp = document.getElementById(inputId);
            if (inp) inp.value = '';
        }

        function restoreAccount() {
            /* ✅ يقرأ من الحقل المرئي الجديد أولاً، ثم القديم كـ fallback */
            const inp = document.getElementById('restoreSerialInput') || document.getElementById('restoreSerialInputLegacy');
            const serial = inp ? inp.value.trim() : '';
            if (!serial) { showFeedback('الرجاء إدخال الرقم التسلسلي'); return; }

            /* ① محلياً أولاً */
            const localData = loadSerialBackup(serial);
            if (localData) {
                _applyRestoredData(localData, 'restoreSerialInput', 'restorePanel');
                return;
            }
            /* ② إذا ما وجد محلياً → ابحث في Firebase */
            showFeedback('⏳ جاري البحث عن حسابك في السحابة...');
            loadFromFirebase(serial, function(cloudData) {
                if (!cloudData) { showFeedback('⚠️ لم يتم العثور على حساب بهذا الرقم'); return; }
                _applyRestoredData(cloudData, 'restoreSerialInput', 'restorePanel');
            });
        }

        /* استعادة من صفحة الإعدادات */
        function restoreFromSettings() {
            const inp = document.getElementById('settingsRestoreInput');
            const serial = inp ? inp.value.trim() : '';
            if (!serial) { showFeedback('أدخل الرقم التسلسلي'); return; }

            /* ① محلياً أولاً */
            const localData = loadSerialBackup(serial);
            if (localData) {
                _applyRestoredData(localData, 'settingsRestoreInput', 'settingsRestorePanel');
                return;
            }
            /* ② Firebase */
            showFeedback('⏳ جاري البحث عن حسابك في السحابة...');
            loadFromFirebase(serial, function(cloudData) {
                if (!cloudData) { showFeedback('⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
                _applyRestoredData(cloudData, 'settingsRestoreInput', 'settingsRestorePanel');
            });
        }

        function toggleSettingsRestorePanel() {
            const p = document.getElementById('settingsRestorePanel');
            if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
        }

        var st = loadSt();
        var currentOp = st.lastOp || 'mix';

        /* ═══════════ RESET COMPLETE ═══════════ */
        function confirmResetComplete(force) {
            showConfirm('البدء من جديد',
                'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟',
                'نعم، احذف الكل', 'إلغاء', (ok) => {
                    if (ok) {
                        localStorage.removeItem(SK);
                        /* ✅ FIX: جمع المفاتيح أولاً ثم الحذف لتجنب مشكلة التغيير أثناء الحلقة */
                        const keysToRemove = [];
                        for (let i = 0; i < localStorage.length; i++) {
                            let key = localStorage.key(i);
                            if (key && key.startsWith('ho_math_backup_')) keysToRemove.push(key);
                        }
                        keysToRemove.forEach(k => localStorage.removeItem(k));
                        localStorage.removeItem('ho_math_user_count');
                        st = defState();
                        saveSt(); currentOp = st.lastOp || 'mix';
                        updateUI(); loadProfileForm(); applyDarkMode();
                        applyProfilePhoto();
                        if (typeof clearGameTimer === 'function') clearGameTimer();
                        if (G) { G.ended = true; if (G.timer) clearInterval(G.timer); }
                        goTab('home');
                        showFeedback('🔄 تم إعادة اللعبة إلى حالتها الأولية');
                    }
                });
        }

        /* ═══════════ تحديث الإحصائيات اليومية والأسبوعية ═══════════ */
        /* ✅ FIX-CONFLICT: الدالة الحقيقية هي recordDailyStatV2 في stats_engine.js
           وتُسجَّل في window.recordDailyStat تلقائياً عند تحميل stats_engine.js
           هذه النسخة الاحتياطية تعمل فقط إذا لم يكن stats_engine.js محملاً بعد */
        function recordDailyStat(type) {
            /* إذا كانت النسخة المحسّنة محملة، استخدمها */
            if (typeof recordDailyStatV2 === 'function') { recordDailyStatV2(type); return; }
            /* نسخة احتياطية بسيطة */
            if (!st.dailyStats || st.dailyStats.date !== todayStr()) {
                st.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }
            if (!st.weeklyStats || st.weeklyStats.week !== weekStr()) {
                st.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() };
            }
            if (type === 'correct') { st.dailyStats.correct++; st.weeklyStats.correct++; }
            if (type === 'wrong')   { st.dailyStats.wrong++;   st.weeklyStats.wrong++;   }
            if (type === 'game')    { st.dailyStats.games++;   st.weeklyStats.games++;   }
            if (type === 'streak' && st.bestStreak > st.weeklyStats.bestStreak) {
                st.weeklyStats.bestStreak = st.bestStreak;
            }
        }

        /* ═══════════════════════════════════════════════════════
           💾 تصدير / استيراد ملف JSON — نسخة احتياطية يدوية
           ═══════════════════════════════════════════════════════ */

        function exportProgress() {
            try {
                const exportData = Object.assign({}, st, { profilePhoto: null });
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ho_math_' + (st.serialNumber || 'backup') + '_' + todayStr() + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showFeedback('📥 تم تحميل ملف النسخة الاحتياطية');
            } catch(e) { showFeedback('❌ فشل التصدير'); }
        }

        function importProgress(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data || typeof data.name === 'undefined') { showFeedback('❌ الملف غير صحيح'); return; }
                    showConfirm('استيراد بيانات',
                        'سيتم استبدال بياناتك الحالية ببيانات الملف. هل أنت متأكد؟',
                        'نعم، استيراد', 'إلغاء', function(ok) {
                            if (!ok) return;
                            Object.assign(st, sanitizeState(data));
                            saveSt(); updateUI(); loadProfileForm(); applyDarkMode(); applyProfilePhoto();
                            updateSerialNumberDisplay();
                            showFeedback('✅ تم استيراد التقدم من الملف');
                        });
                } catch(e) { showFeedback('❌ الملف تالف أو غير صحيح'); }
            };
            reader.readAsText(file);
        }

        /* ═══════════════════════════════════════════════════════
           🔄 مزامنة تلقائية عند تحميل الصفحة
           إذا كان المتصفح يحمل بيانات قديمة أو فارغة،
           يحاول استعادة أحدث نسخة من Firebase تلقائياً
           ═══════════════════════════════════════════════════════ */

        function autoSyncFromCloud() {
            if (!st.serialNumber) return; /* لا رقم تسلسلي = لاعب جديد */
            loadFromFirebase(st.serialNumber, function(cloudData) {
                if (!cloudData) return;
                /* نقارن: هل البيانات السحابية أحدث أو أفضل من المحلية؟ */
                const cloudXP    = cloudData.xp    || 0;
                const cloudLevel = cloudData.level || 1;
                const localXP    = st.xp           || 0;
                const localLevel = st.level        || 1;
                if (cloudLevel > localLevel || (cloudLevel === localLevel && cloudXP > localXP)) {
                    console.log('☁️ تم تحديث البيانات من السحابة');
                    Object.assign(st, sanitizeState(cloudData));
                    localStorage.setItem(SK, JSON.stringify(st));
                    if (typeof updateUI === 'function') updateUI();
                    if (typeof loadProfileForm === 'function') loadProfileForm();
                }
            });
        }

        /* تشغيل المزامنة التلقائية بعد تحميل كل شيء */
        window.addEventListener('load', function() {
            setTimeout(autoSyncFromCloud, 2000);
        });
