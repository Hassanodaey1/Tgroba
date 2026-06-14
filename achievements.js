/* DATA & ACHIEVEMENTS */
        /* ═══════════ ACHIEVEMENTS ═══════════ */
        const ACHIEVEMENTS_DEF = [
            { id: 'first_correct', icon: '🎯', name: 'أول إجابة صحيحة', desc: 'أجب على سؤال واحد صحيح', check: () => st
                    .correctTotal >= 1, reward: 2 },
            { id: 'ten_correct', icon: '🔟', name: '10 إجابات', desc: 'أجب على 10 أسئلة صحيحة', check: () => st.correctTotal >=
                    10, reward: 3 },
            { id: 'fifty_correct', icon: '💯', name: '50 إجابة', desc: 'أجب على 50 سؤالاً صحيحاً', check: () => st
                    .correctTotal >= 50, reward: 5 },
            { id: 'combo5', icon: '🔥', name: 'تتابع ×5', desc: 'حقّق تتابع 5 إجابات صحيحة', check: () => st.bestStreak >=
                5, reward: 4 },
            { id: 'combo10', icon: '💥', name: 'تتابع ×10', desc: 'حقّق تتابع 10 إجابات صحيحة', check: () => st.bestStreak >=
                    10, reward: 8 },
            { id: 'speed10', icon: '⚡', name: 'سرعة 10 نقاط', desc: 'سجّل 10 نقاط في وضع السرعة', check: () => st
                    .bestScore >= 10, reward: 3 },
            { id: 'speed25', icon: '🚀', name: 'سرعة 25 نقطة', desc: 'سجّل 25 نقطة في وضع السرعة', check: () => st
                    .bestScore >= 25, reward: 6 },
            { id: 'level5', icon: '⬆️', name: 'المستوى 5', desc: 'وصل إلى المستوى 5', check: () => st.level >= 5,
                reward: 10 },
            { id: 'level20', icon: '👑', name: 'المستوى 20', desc: 'وصل إلى المستوى 20', check: () => st.level >= 20,
                reward: 20 },
            { id: 'all_basic_stars', icon: '🌟', name: 'أستاذ الأساسيات',
                desc: '15 نجمة في كل من الجمع والطرح والضرب والقسمة والجدول', check: () => ['addition', 'subtraction',
                    'multiplication', 'division', 'table'
                ].every(k => (st.stats[k]?.stars || 0) >= 15), reward: 10 },
            { id: 'perfect_10', icon: '✨', name: 'مثالي ×10', desc: '10 مرات مثالية (3 نجوم)', check: () => Object.values(
                    st.stats).reduce((s, c) => s + (c.first || 0), 0) >= 10, reward: 8 },
            { id: 'coins100', icon: '💰', name: 'مئة عملة', desc: 'اجمع 100 عملة', check: () => st.coins >= 100,
            reward: 0 },
            { id: 'play1h', icon: '⏱️', name: 'ساعة لعب', desc: 'ساعة كاملة من وقت اللعب', check: () => getSessionSecs() >=
                    3600, reward: 12 },
            { id: 'hard_unlock', icon: '🔓', name: 'فتح الصعب', desc: 'وصل للمستوى المطلوب لفتح الصعب', check: () => st
                    .level >= 5, reward: 5 },
            { id: 'five_perfect', icon: '🏅', name: '5 فئات مثالية', desc: '5 فئات حصلت على تقييم مثالي', check: () => Object
                    .values(st.stats).filter(s => (s.stars || 0) >= 15).length >= 5, reward: 15 },
            { id: 'young_math', icon: '🧒', name: 'رياضي صغير', desc: 'عمرك أقل من 12 وأجبت 20 صحيحة', check: () => st
                    .age && st.age < 12 && st.correctTotal >= 20, reward: 10 },
            { id: 'algebra_master', icon: '📐', name: 'أستاذ الجبر', desc: 'عمرك 18+ وأجبت 20 في الجبر', check: () => st
                    .age && st.age >= 18 && (st.stats['algebra']?.cor || 0) >= 20, reward: 15 },
            { id: 'wise_numbers', icon: '🧙', name: 'حكيم الأرقام', desc: 'عمرك 60+ وأجبت 30 صحيحة', check: () => st.age &&
                    st.age >= 60 && st.correctTotal >= 30, reward: 20 },
            /* ═══ إنجازات بطاقة الذاكرة ═══ */
            { id: 'memory_first', icon: '🧠', name: 'أول لعبة ذاكرة', desc: 'العب وضع بطاقة الذاكرة لأول مرة',
                check: () => (st.memoryBest || 0) >= 1, reward: 5 },
            { id: 'memory_ace', icon: '💎', name: 'ذاكرة حديدية', desc: 'أكمل بطاقة الذاكرة بدون أخطاء',
                check: () => (st.memoryPerfect || 0) >= 1, reward: 10 },
            { id: 'memory_streak', icon: '🔗', name: 'ذاكرة الأبطال', desc: 'أجب على 8+ إجابات صحيحة في وضع الذاكرة',
                check: () => (st.memoryBest || 0) >= 8, reward: 8 },

            /* ═══ 9.1 — إنجازات الأوضاع الجديدة ═══ */
            { id: 'chain_master',  icon: '🔗', name: 'سيد السلسلة',
              desc: 'أكمل سلسلة 10 أسئلة متتالية في وضع السلسلة',
              check: () => (st.stats['chain']?.best || 0) >= 10, reward: 12 },

            { id: 'sudden_hero',   icon: '⚡', name: 'بطل اللحظة',
              desc: 'أجب على 10 أسئلة صحيحة في وضع ضد الساعة',
              check: () => (st.stats['sudden']?.cor || 0) >= 10, reward: 15 },

            { id: 'rocket_stage4', icon: '🚀', name: 'رحلة إلى النجوم',
              desc: 'وصل لمرحلة العبقري في وضع الصاروخ',
              check: () => (st._rocketMaxStage || 0) >= 4, reward: 20 },

            { id: 'fill_perfect',  icon: '🔢', name: 'ملء الفراغ المثالي',
              desc: 'أكمل لعبة التكميل بدون أخطاء',
              check: () => (st._fillPerfect || 0) >= 1, reward: 8 },

            { id: 'weekly_done',   icon: '🗓️', name: 'بطل الأسبوع',
              desc: 'أكمل تحدي الأسبوع',
              check: () => st.weeklyChallengePlayed === true, reward: 25 },
        ];

        function checkAchievements() {
            /* ✅ FIX-V4: تحقق من صحة قائمة achievementsUnlocked — تُرشَّح لمنع الحقن */
            if (!Array.isArray(st.achievementsUnlocked)) st.achievementsUnlocked = [];
            const validIds = ACHIEVEMENTS_DEF.map(a => a.id);
            st.achievementsUnlocked = st.achievementsUnlocked.filter(id => validIds.includes(id));
            /* تحقق من أن العملات الممنوحة لم تتجاوز الحد الأقصى الممكن للإنجازات */
            if (typeof st._achCoinsGiven !== 'number') st._achCoinsGiven = 0;
            let newUnlocks = [];
            ACHIEVEMENTS_DEF.forEach(a => {
                if (!st.achievementsUnlocked.includes(a.id) && a.check()) {
                    st.achievementsUnlocked.push(a.id);
                    if (a.reward > 0) {
                        st.coins += a.reward;
                        st._achCoinsGiven += a.reward;
                    }
                    newUnlocks.push(a.name);
                }
            });
            if (newUnlocks.length) { saveSt();
                showFeedback(`🏆 إنجاز: ${newUnlocks.join(', ')}`);
                playSound('levelup');
                updateUI(); }
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
                return `<div class="task-item ${done?'done':''}">
                    <div class="task-item-icon">${a.icon}</div>
                    <div class="task-item-info">
                        <div class="task-item-name">${a.name}</div>
                        <div class="task-item-desc">${a.desc}</div>
                    </div>
                    <div class="task-right">
                        <div class="task-reward">${done?'✅':`+${a.reward}💰`}</div>
                    </div>
                </div>`;
            }).join('');
            const rewardDiv = document.getElementById('achieveCompleteReward');
            if (rewardDiv) rewardDiv.style.display = doneCount === total ? 'block' : 'none';
        }

        const BADGES = {
            speed30: { icon: '⚡', cond: () => st.bestScore >= 30 },
            perfect10: { icon: '🌟', cond: () => Object.values(st.stats).reduce((s, c) => s + (c.first || 0), 0) >=
                10 },
            level10: { icon: '🔷', cond: () => st.level >= 10 },
            allBasic: { icon: '🏅', cond: () => ['addition', 'subtraction', 'multiplication', 'division',
                    'table'
                ].every(k => (st.stats[k]?.stars || 0) >= 15) }
        };

        function updateBadgeIcon() {
            const el = document.getElementById('badgeDisplay');
            if (el) el.textContent = Object.values(BADGES).filter(b => b.cond()).map(b => b.icon).join('');
        }

        /* ═══════════════════════════════════════════════════════
           📋 مهام مصنّفة — CATEGORY_TASKS
           كل فئة تحتوي على مهام يومية مخصصة
           الأنواع المدعومة في updTask:
             correct | streak | game | daily | weekly
             play_memory | play_rocket | play_sudden | play_fill | play_hard
             chain_q | sudden_q
             + opKey يُمرَّر من game.js لتمييز العملية
           ═══════════════════════════════════════════════════════ */

        const CATEGORY_TASKS = {
            ops: [
                /* ── سهل ── */
                { id: 'op1',  icon: '➕', name: 'سيد الجمع',        desc: 'أجب على 8 أسئلة جمع صحيحة',              reward: 2,  goal: 8,   progress: 0, done: false, type: 'ops_add' },
                { id: 'op2',  icon: '➖', name: 'قاهر الطرح',       desc: 'أجب على 8 أسئلة طرح صحيحة',             reward: 2,  goal: 8,   progress: 0, done: false, type: 'ops_sub' },
                { id: 'op3',  icon: '✖️', name: 'أبو الضرب',        desc: 'أجب على 8 أسئلة ضرب صحيحة',             reward: 3,  goal: 8,   progress: 0, done: false, type: 'ops_mul' },
                { id: 'op4',  icon: '➗', name: 'عين القسمة',       desc: 'أجب على 8 أسئلة قسمة صحيحة',            reward: 3,  goal: 8,   progress: 0, done: false, type: 'ops_div' },
                { id: 'op5',  icon: '🔢', name: 'جدول الأبطال',     desc: 'أجب على 10 أسئلة جدول ضرب',             reward: 3,  goal: 10,  progress: 0, done: false, type: 'ops_table' },
                { id: 'op8',  icon: '🎯', name: 'الانطلاقة',        desc: 'أجب على 3 أسئلة صحيحة لتبدأ',           reward: 1,  goal: 3,   progress: 0, done: false, type: 'correct' },
                /* ── متوسط ── */
                { id: 'op6',  icon: '🔀', name: 'شاطر المزج',       desc: 'أجب على 15 سؤالاً مختلطاً',             reward: 4,  goal: 15,  progress: 0, done: false, type: 'correct' },
                { id: 'op7',  icon: '🏃', name: 'جلستان كاملتان',   desc: 'أنهِ جلستَي لعب كاملتَين',              reward: 2,  goal: 2,   progress: 0, done: false, type: 'game' },
                { id: 'op9',  icon: '🔁', name: 'دوري المكرر',      desc: 'العب 4 جلسات في يوم واحد',              reward: 4,  goal: 4,   progress: 0, done: false, type: 'game' },
                { id: 'op10', icon: '⚡', name: 'سرعة الحساب',      desc: 'أجب على 5 أسئلة جمع وطرح معاً',         reward: 3,  goal: 5,   progress: 0, done: false, type: 'ops_add' },
                { id: 'op11', icon: '🧮', name: 'حاسب الأعداد',     desc: 'أجب على 20 سؤالاً صحيحاً',              reward: 4,  goal: 20,  progress: 0, done: false, type: 'correct' },
                /* ── صعب ── */
                { id: 'op12', icon: '💪', name: 'ضرب الأبطال',      desc: 'أجب على 15 سؤال ضرب صحيحة',            reward: 5,  goal: 15,  progress: 0, done: false, type: 'ops_mul' },
                { id: 'op13', icon: '🌟', name: 'قسمة الماهرين',    desc: 'أجب على 15 سؤال قسمة صحيحة',           reward: 5,  goal: 15,  progress: 0, done: false, type: 'ops_div' },
                { id: 'op14', icon: '🔥', name: 'مئة سؤال',         desc: 'أجب على 40 سؤالاً صحيحاً في اليوم',    reward: 8,  goal: 40,  progress: 0, done: false, type: 'correct' },
                /* ── عبقري ── */
                { id: 'op15', icon: '💎', name: 'جدول الخبراء',     desc: 'أجب على 25 سؤال جدول ضرب بلا خطأ',     reward: 8,  goal: 25,  progress: 0, done: false, type: 'ops_table' },
                { id: 'op16', icon: '🏆', name: 'مئة وعشرون',       desc: 'أجب على 60 سؤالاً صحيحاً في اليوم',    reward: 10, goal: 60,  progress: 0, done: false, type: 'correct' },
                /* ── مستحيل ── */
                { id: 'op17', icon: '👑', name: 'ملك العمليات',      desc: 'أجب على 100 سؤال صحيح في اليوم',       reward: 15, goal: 100, progress: 0, done: false, type: 'correct' },
                { id: 'op18', icon: '🌌', name: 'ما وراء الحدود',   desc: 'أكمل 10 جلسات لعب في يوم واحد',        reward: 20, goal: 10,  progress: 0, done: false, type: 'game' },
            ],
            challenges: [
                /* ── سهل ── */
                { id: 'ch1',  icon: '🌟', name: 'تحدي اليوم',       desc: 'العب تحدي اليوم (١٠ أسئلة)',             reward: 3,  goal: 1,   progress: 0, done: false, type: 'daily' },
                { id: 'ch7',  icon: '🎯', name: '10 إجابات',        desc: 'أجب على 10 أسئلة صحيحة',                reward: 3,  goal: 10,  progress: 0, done: false, type: 'correct' },
                { id: 'ch8',  icon: '🔰', name: 'أول تتابع',        desc: 'حقق تتابع 2 إجابات متتالية',            reward: 2,  goal: 2,   progress: 0, done: false, type: 'streak3' },
                /* ── متوسط ── */
                { id: 'ch2',  icon: '🔥', name: 'تتابع ×3',         desc: '3 إجابات صحيحة متتالية',                 reward: 2,  goal: 3,   progress: 0, done: false, type: 'streak3' },
                { id: 'ch3',  icon: '💥', name: 'تتابع ×5',         desc: '5 إجابات صحيحة متتالية',                 reward: 4,  goal: 5,   progress: 0, done: false, type: 'streak5' },
                { id: 'ch4',  icon: '⚡', name: 'الصاعق',           desc: 'العب وضع ضد الساعة مرة واحدة',          reward: 3,  goal: 1,   progress: 0, done: false, type: 'play_sudden' },
                { id: 'ch5',  icon: '🔗', name: 'سلسلة لا تنكسر',  desc: 'أجب على 5 أسئلة في وضع السلسلة',        reward: 3,  goal: 5,   progress: 0, done: false, type: 'chain_q' },
                { id: 'ch6',  icon: '🗓️', name: 'بطل الأسبوع',     desc: 'شارك في تحدي الأسبوع',                   reward: 5,  goal: 1,   progress: 0, done: false, type: 'weekly' },
                { id: 'ch9',  icon: '🎮', name: 'اللاعب المنتظم',   desc: 'العب 3 جلسات اليوم',                     reward: 3,  goal: 3,   progress: 0, done: false, type: 'game' },
                /* ── صعب ── */
                { id: 'ch10', icon: '🏅', name: 'تتابع ×7',         desc: '7 إجابات صحيحة متتالية',                 reward: 6,  goal: 7,   progress: 0, done: false, type: 'streak5' },
                { id: 'ch11', icon: '⚔️', name: 'محارب السلسلة',   desc: 'أجب على 12 سؤالاً في وضع السلسلة',      reward: 5,  goal: 12,  progress: 0, done: false, type: 'chain_q' },
                { id: 'ch12', icon: '🌪️', name: 'عاصفة الصواعق',   desc: '10 أسئلة صحيحة في ضد الساعة',          reward: 6,  goal: 10,  progress: 0, done: false, type: 'sudden_q' },
                { id: 'ch13', icon: '🔮', name: 'أسبوعان',          desc: 'شارك في تحديَي أسبوعَين',               reward: 8,  goal: 2,   progress: 0, done: false, type: 'weekly' },
                /* ── عبقري ── */
                { id: 'ch14', icon: '💎', name: 'تتابع ×10',        desc: '10 إجابات صحيحة متتالية',                reward: 8,  goal: 10,  progress: 0, done: false, type: 'streak5' },
                { id: 'ch15', icon: '🦅', name: 'نسر التحديات',     desc: 'العب تحدي اليوم 5 مرات هذا الأسبوع',   reward: 10, goal: 5,   progress: 0, done: false, type: 'daily' },
                { id: 'ch16', icon: '🔱', name: 'سيد السلسلة',      desc: '20 سؤال متتالياً في وضع السلسلة',        reward: 10, goal: 20,  progress: 0, done: false, type: 'chain_q' },
                /* ── مستحيل ── */
                { id: 'ch17', icon: '👑', name: 'تتابع ×15',        desc: '15 إجابة متتالية بلا خطأ واحد',          reward: 15, goal: 15,  progress: 0, done: false, type: 'streak5' },
                { id: 'ch18', icon: '🌌', name: 'المستحيل',         desc: 'أكمل تحدي اليوم 10 أيام متتالية',       reward: 20, goal: 10,  progress: 0, done: false, type: 'daily' },
            ],
            advanced: [
                /* ── سهل ── */
                { id: 'adv8',  icon: '📝', name: 'البداية',          desc: 'أجب على 5 أسئلة صحيحة',                 reward: 2,  goal: 5,   progress: 0, done: false, type: 'correct' },
                { id: 'adv1',  icon: '📐', name: 'الجبر الحاضر',    desc: 'أجب على 5 أسئلة جبر صحيحة',             reward: 4,  goal: 5,   progress: 0, done: false, type: 'ops_algebra' },
                /* ── متوسط ── */
                { id: 'adv2',  icon: '🧮', name: 'منطق رياضي',      desc: 'أجب على 10 أسئلة صحيحة',                reward: 3,  goal: 10,  progress: 0, done: false, type: 'correct' },
                { id: 'adv3',  icon: '🚀', name: 'وضع الصاروخ',     desc: 'العب وضع الصاروخ مرة كاملة',            reward: 5,  goal: 1,   progress: 0, done: false, type: 'play_rocket' },
                { id: 'adv5',  icon: '🏆', name: 'مستوى صعب',       desc: 'العب على مستوى صعب أو أعلى',            reward: 4,  goal: 1,   progress: 0, done: false, type: 'play_hard' },
                { id: 'adv6',  icon: '📊', name: '3 جلسات اليوم',   desc: 'أكمل 3 جلسات لعب اليوم',                reward: 3,  goal: 3,   progress: 0, done: false, type: 'game' },
                { id: 'adv9',  icon: '🔬', name: 'مستوى متوسط',     desc: 'أجب على 15 سؤالاً على المستوى المتوسط', reward: 4,  goal: 15,  progress: 0, done: false, type: 'correct' },
                /* ── صعب ── */
                { id: 'adv4',  icon: '💎', name: '25 إجابة',        desc: 'أجب على 25 سؤالاً صحيحاً',              reward: 5,  goal: 25,  progress: 0, done: false, type: 'correct' },
                { id: 'adv10', icon: '🔭', name: 'جبر متقدم',       desc: 'أجب على 12 سؤال جبر صحيحة',            reward: 6,  goal: 12,  progress: 0, done: false, type: 'ops_algebra' },
                { id: 'adv11', icon: '⚡', name: 'صاروخ مزدوج',     desc: 'العب وضع الصاروخ مرتين',                 reward: 7,  goal: 2,   progress: 0, done: false, type: 'play_rocket' },
                { id: 'adv12', icon: '🌪️', name: '5 جلسات',        desc: 'أكمل 5 جلسات لعب في يوم واحد',          reward: 6,  goal: 5,   progress: 0, done: false, type: 'game' },
                /* ── عبقري ── */
                { id: 'adv13', icon: '🧠', name: 'عالم الأرقام',    desc: 'أجب على 40 سؤالاً صحيحاً',              reward: 8,  goal: 40,  progress: 0, done: false, type: 'correct' },
                { id: 'adv14', icon: '🏅', name: 'جبر العباقرة',    desc: 'أجب على 20 سؤال جبر بلا خطأ',          reward: 10, goal: 20,  progress: 0, done: false, type: 'ops_algebra' },
                { id: 'adv15', icon: '🔱', name: 'صاروخ المراحل',   desc: 'العب وضع الصاروخ 5 مرات',               reward: 10, goal: 5,   progress: 0, done: false, type: 'play_rocket' },
                /* ── مستحيل ── */
                { id: 'adv16', icon: '👑', name: 'فيلسوف الأعداد',  desc: 'أجب على 70 سؤالاً صحيحاً في اليوم',    reward: 15, goal: 70,  progress: 0, done: false, type: 'correct' },
                { id: 'adv17', icon: '🌌', name: 'ما لا يُوصف',     desc: 'أكمل 10 جلسات على مستوى صعب',           reward: 20, goal: 10,  progress: 0, done: false, type: 'play_hard' },
            ],
            mind: [
                /* ── سهل ── */
                { id: 'mn6',  icon: '🌱', name: 'أول خطوة',         desc: 'العب أي وضع مرة واحدة',                  reward: 1,  goal: 1,   progress: 0, done: false, type: 'game' },
                { id: 'mn1',  icon: '🧠', name: 'لعبة ذاكرة',       desc: 'العب وضع بطاقة الذاكرة مرة',            reward: 3,  goal: 1,   progress: 0, done: false, type: 'play_memory' },
                { id: 'mn5',  icon: '🌀', name: 'تحدي الفراغ',      desc: 'العب وضع ملء الفراغ مرة كاملة',         reward: 3,  goal: 1,   progress: 0, done: false, type: 'play_fill' },
                /* ── متوسط ── */
                { id: 'mn2',  icon: '🔗', name: 'سلسلة العقل',      desc: 'أجب على 8 أسئلة في وضع السلسلة',        reward: 4,  goal: 8,   progress: 0, done: false, type: 'chain_q' },
                { id: 'mn3',  icon: '🎯', name: 'تركيز مطلق',       desc: '5 إجابات صحيحة متتالية بلا خطأ',        reward: 4,  goal: 5,   progress: 0, done: false, type: 'streak5' },
                { id: 'mn4',  icon: '⚡', name: 'سرعة البرق',       desc: '5 أسئلة صحيحة في ضد الساعة',            reward: 4,  goal: 5,   progress: 0, done: false, type: 'sudden_q' },
                { id: 'mn7',  icon: '🔮', name: 'ذاكرة مزدوجة',     desc: 'العب وضع الذاكرة 3 مرات',               reward: 5,  goal: 3,   progress: 0, done: false, type: 'play_memory' },
                { id: 'mn8',  icon: '💡', name: 'الفراغ الممتع',    desc: 'العب وضع ملء الفراغ 3 مرات',            reward: 4,  goal: 3,   progress: 0, done: false, type: 'play_fill' },
                /* ── صعب ── */
                { id: 'mn9',  icon: '🌪️', name: 'سلسلة الحديد',    desc: 'أجب على 15 سؤالاً في السلسلة',          reward: 6,  goal: 15,  progress: 0, done: false, type: 'chain_q' },
                { id: 'mn10', icon: '🏅', name: 'تتابع ×8',         desc: '8 إجابات صحيحة متتالية',                 reward: 6,  goal: 8,   progress: 0, done: false, type: 'streak5' },
                { id: 'mn11', icon: '⚔️', name: 'برق مزدوج',       desc: '15 سؤال صحيح في ضد الساعة',             reward: 7,  goal: 15,  progress: 0, done: false, type: 'sudden_q' },
                { id: 'mn12', icon: '🔭', name: 'خبير الذاكرة',     desc: 'العب وضع الذاكرة 5 مرات',               reward: 7,  goal: 5,   progress: 0, done: false, type: 'play_memory' },
                /* ── عبقري ── */
                { id: 'mn13', icon: '💎', name: 'عقل من حديد',      desc: 'أجب على 25 سؤال في السلسلة بلا انقطاع', reward: 10, goal: 25,  progress: 0, done: false, type: 'chain_q' },
                { id: 'mn14', icon: '🦅', name: 'نسر الصواعق',      desc: '25 سؤال صحيح في ضد الساعة',             reward: 10, goal: 25,  progress: 0, done: false, type: 'sudden_q' },
                { id: 'mn15', icon: '🔱', name: 'تتابع ×12',        desc: '12 إجابة صحيحة متتالية',                 reward: 12, goal: 12,  progress: 0, done: false, type: 'streak5' },
                /* ── مستحيل ── */
                { id: 'mn16', icon: '👑', name: 'ملك العقول',        desc: 'العب جميع الأوضاع 3 مرات في يوم واحد',  reward: 15, goal: 3,   progress: 0, done: false, type: 'play_memory' },
                { id: 'mn17', icon: '🌌', name: 'الحالة الذهنية',   desc: 'حقق تتابع 20 إجابة متتالية',             reward: 20, goal: 20,  progress: 0, done: false, type: 'streak5' },
            ]
        };

        /* meta بيانات العرض لكل فئة */
        const CATEGORY_META = {
            ops:          { label: 'مهام العمليات على الأعداد',  icon: '🔢', c1: '#f0b90b', c2: '#f59e0b' },
            challenges:   { label: 'مهام التحديات',              icon: '⚔️', c1: '#7c3aed', c2: '#a855f7' },
            advanced:     { label: 'مهام الرياضيات المتقدمة',   icon: '📐', c1: '#06b6d4', c2: '#0ea5e9' },
            mind:         { label: 'مهام العقل',                 icon: '🧠', c1: '#10b981', c2: '#34d399' },
            achievements: { label: 'الإنجازات',                  icon: '🏆', c1: '#f59e0b', c2: '#fbbf24' }
        };

        /* ═══ مهمة ديناميكية حسب نقطة ضعف اللاعب ═══ */
        function genDynamicTask() {
            const stats = st.stats || {};
            let weakest = 'add', weakestRate = 1;
            Object.keys(stats).forEach(k => {
                const s = stats[k];
                if (s && s.att >= 5) {
                    const rate = (s.cor || 0) / s.att;
                    if (rate < weakestRate) { weakestRate = rate; weakest = k; }
                }
            });
            const opNames = {
                add: 'الجمع', sub: 'الطرح', mul: 'الضرب', div: 'القسمة',
                addition: 'الجمع', subtraction: 'الطرح', multiplication: 'الضرب', division: 'القسمة',
                table: 'جدول الضرب', algebra: 'الجبر', mix: 'العمليات المختلطة'
            };
            const opLabel = opNames[weakest] || weakest;
            /* تُضاف المهمة الديناميكية إلى فئة ops */
            return {
                id: 'tw', icon: '🎯', name: `تحسين ${opLabel}`,
                desc: `أجب على 10 أسئلة صحيحة في ${opLabel}`,
                reward: 5, goal: 10, progress: 0, done: false,
                type: 'ops_dyn', targetOp: weakest
            };
        }

        /* ═══ توليد وتجديد مهام الفئات ═══ */
        function _buildCategoryTasks() {
            const cats = {};
            Object.keys(CATEGORY_TASKS).forEach(cat => {
                cats[cat] = CATEGORY_TASKS[cat].map(t => Object.assign({}, t));
            });
            /* أضف المهمة الديناميكية إلى فئة ops إذا كان هناك بيانات كافية */
            const hasEnoughData = Object.values(st.stats || {}).some(s => s && s.att >= 5);
            if (hasEnoughData) {
                cats.ops.push(genDynamicTask());
            }
            return cats;
        }

        function genDailyTasks() {
            /* مصفوفة فارغة — المهام الآن في categoryTasks فقط */
            return [];
        }

        function checkDailyReset() {
            const today = todayStr();
            /* تجديد المهام العامة (مصفوفة فارغة للتوافق) */
            if (st.dailyDate !== today || !st.dailyTasks) {
                st.dailyTasks = [];
                st.dailyDate  = today;
            }
            /* تجديد مهام الفئات إذا تغيّر اليوم */
            if (!st.categoryTasks || st.categoryTasksDate !== today) {
                st.categoryTasks     = _buildCategoryTasks();
                st.categoryTasksDate = today;
                saveSt();
            }
            /* صحّح بنية مهام الفئات الموجودة */
            if (st.categoryTasks && typeof st.categoryTasks === 'object') {
                Object.values(st.categoryTasks).forEach(arr => {
                    if (!Array.isArray(arr)) return;
                    arr.forEach(t => {
                        if (typeof t.done     !== 'boolean') t.done     = false;
                        if (typeof t.progress !== 'number' || t.progress < 0) t.progress = 0;
                        if (t.progress > (t.goal || 1)) t.progress = t.goal || 1;
                    });
                });
            }
        }

        /* ═══════════════════════════════════════════════════════
           updTask — نقطة الدخول الرئيسية لتحديث المهام
           يُستدعى من game.js عند كل حدث
           الحجج:
             type   — نوع الحدث (correct | streak | game | daily | weekly | play_* | chain_q | sudden_q)
             amount — كمية التقدم (افتراضي 1)
             opKey  — مفتاح العملية من G.currentCatKey (addition | subtraction | ...)
           ═══════════════════════════════════════════════════════ */
        function updTask(type, amount, opKey) {
            amount = (typeof amount === 'number') ? amount : 1;
            opKey  = opKey || null;
            checkDailyReset();

            if (!st.categoryTasks) return;
            let changed = false;

            /* خريطة opKey → type الداخلي */
            const OP_MAP = {
                addition:       'ops_add',
                subtraction:    'ops_sub',
                multiplication: 'ops_mul',
                division:       'ops_div',
                table:          'ops_table',
                algebra:        'ops_algebra',
                /* مختصرات قديمة */
                add: 'ops_add', sub: 'ops_sub', mul: 'ops_mul', div: 'ops_div'
            };

            Object.values(st.categoryTasks).forEach(arr => {
                if (!Array.isArray(arr)) return;
                arr.forEach(t => {
                    if (t.done) return;
                    const tt = t.type || '';
                    let hit = false;

                    if (type === 'correct') {
                        /* مهام العمليات بـ opKey */
                        if (opKey && OP_MAP[opKey] && tt === OP_MAP[opKey]) hit = true;
                        /* مهمة ديناميكية */
                        if (tt === 'ops_dyn' && opKey && t.targetOp) {
                            const tgt = t.targetOp;
                            if (opKey === tgt || OP_MAP[opKey] === OP_MAP[tgt] ||
                                opKey.includes(tgt) || tgt.includes(opKey)) hit = true;
                        }
                        /* أي مهمة نوعها 'correct' تُحسب لكل إجابة صحيحة */
                        if (tt === 'correct') hit = true;
                    }

                    if (type === 'streak') {
                        if (tt === 'streak3' && amount >= 3) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                        if (tt === 'streak5' && amount >= 5) { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    }

                    /* أحداث الجلسة والألعاب */
                    if (type === 'game'        && tt === 'game')        hit = true;
                    if (type === 'daily'       && tt === 'daily')       hit = true;
                    if (type === 'weekly'      && tt === 'weekly')      { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'play_memory' && tt === 'play_memory') { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'play_rocket' && tt === 'play_rocket') { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'play_sudden' && tt === 'play_sudden') { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'play_fill'   && tt === 'play_fill')   { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'play_hard'   && tt === 'play_hard')   { t.progress = t.goal; t.done = true; st.coins += t.reward; changed = true; return; }
                    if (type === 'chain_q'     && tt === 'chain_q')     hit = true;
                    if (type === 'sudden_q'    && tt === 'sudden_q')    hit = true;

                    if (hit) {
                        t.progress = Math.min(t.goal, t.progress + amount);
                        if (t.progress >= t.goal) { t.done = true; st.coins += t.reward; changed = true; }
                    }
                });
            });

            if (changed) { try { playSound('levelup'); } catch(e){} }
            saveSt();
            renderTasks();
        }

        /* ═══ حساب ملخص كل فئات المهام معاً (للبطاقات الثلاث في رأس الصفحة) ═══ */
        function calcAllCatStats() {
            let done = 0, total = 0, earned = 0;
            if (!st.categoryTasks) return { done, total, earned };
            Object.values(st.categoryTasks).forEach(arr => {
                if (!Array.isArray(arr)) return;
                arr.forEach(t => { total++; if (t.done) { done++; earned += t.reward; } });
            });
            return { done, total, earned };
        }

        /* ═══ renderTasks — يحدّث البطاقات الثلاث في رأس صفحة المهام ═══ */
        function renderTasksFiltered() {
            checkDailyReset();
            const { done, total, earned } = calcAllCatStats();
            const pct = total ? Math.round((done / total) * 100) : 0;

            const el_done  = document.getElementById('tasksDone');
            const el_total = document.getElementById('tasksTotal');
            const el_coins = document.getElementById('tasksCoins');
            const el_pct   = document.getElementById('tasksPct');
            const el_bar   = document.getElementById('tasksBarFill');

            if (el_done)  el_done.textContent  = done;
            if (el_total) el_total.textContent  = total;
            if (el_coins) el_coins.textContent  = earned + '💰';
            if (el_pct)   el_pct.textContent    = pct + '%';
            if (el_bar)   el_bar.style.width    = pct + '%';

            /* تحديث profileTaskStatus إذا وُجد */
            const _pts = document.getElementById('profileTaskStatus');
            if (_pts) _pts.textContent = `${done} / ${total} ›`;
        }
        var renderTasks = renderTasksFiltered;
        window.renderTasks = renderTasksFiltered;

        /* ═══════════════════════════════════════════════════════
           📋 نافذة مهام الفئة السريعة
           ═══════════════════════════════════════════════════════ */
        function openCategorySheet(cat) {
            checkDailyReset();
            const meta = CATEGORY_META[cat];
            if (!meta) return;
            const overlay = document.getElementById('categorySheetOverlay');
            if (!overlay) return;

            /* رأس النافذة */
            const hdr = document.getElementById('catSheetHeader');
            if (hdr) {
                hdr.style.background = 'linear-gradient(135deg,' + meta.c1 + ',' + meta.c2 + ')';
                const ttl = hdr.querySelector('.cat-sheet-title');
                if (ttl) ttl.textContent = meta.icon + ' ' + meta.label;
            }

            const body = document.getElementById('catSheetBody');
            if (!body) return;

            if (cat === 'achievements') {
                /* ═══ عرض الإنجازات ═══ */
                const totalA  = ACHIEVEMENTS_DEF.length;
                const doneA   = (st.achievementsUnlocked || []).length;
                const pctA    = Math.round((doneA / totalA) * 100);
                body.innerHTML =
                    '<div style="display:flex;gap:10px;margin-bottom:14px;">' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--gold);">' + doneA + '</div><div style="font-size:0.6em;color:var(--text2);">مكتملة</div></div>' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--accent2);">' + totalA + '</div><div style="font-size:0.6em;color:var(--text2);">إجمالي</div></div>' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--green);">' + pctA + '%</div><div style="font-size:0.6em;color:var(--text2);">تقدّم</div></div>' +
                    '</div>' +
                    '<div style="display:flex;flex-direction:column;gap:8px;">' +
                    ACHIEVEMENTS_DEF.map(function(a) {
                        var done = (st.achievementsUnlocked || []).includes(a.id) || (function(){ try{ return a.check(); }catch(e){ return false; } }());
                        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:' + (done?'rgba(16,185,129,0.08)':'var(--surface2)') + ';border:1px solid ' + (done?'rgba(16,185,129,0.3)':'var(--border2)') + ';">' +
                            '<div style="font-size:1.5em;' + (done?'':'filter:grayscale(1);opacity:0.4') + '">' + a.icon + '</div>' +
                            '<div style="flex:1;"><div style="font-size:0.8em;font-weight:700;color:' + (done?'var(--text)':'var(--text2)') + ';">' + a.name + '</div><div style="font-size:0.63em;color:var(--text2);margin-top:2px;">' + a.desc + '</div></div>' +
                            '<div style="font-size:0.8em;font-weight:900;color:' + (done?'var(--green)':'var(--text3)') + ';">' + (done?'✅':'🔒 +'+a.reward+'💰') + '</div>' +
                        '</div>';
                    }).join('') +
                    '</div>';
            } else {
                /* ═══ عرض مهام الفئة ═══ */
                var tasks = (st.categoryTasks && st.categoryTasks[cat]) ? st.categoryTasks[cat] : (CATEGORY_TASKS[cat] || []);
                var doneC  = tasks.filter(function(t){ return t.done; }).length;
                var totalC = tasks.length;
                var pctC   = totalC ? Math.round((doneC/totalC)*100) : 0;
                var earnedC= tasks.filter(function(t){ return t.done; }).reduce(function(s,t){ return s+t.reward; }, 0);

                body.innerHTML =
                    '<div style="display:flex;gap:10px;margin-bottom:12px;">' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--gold);">' + doneC + '/' + totalC + '</div><div style="font-size:0.6em;color:var(--text2);">مكتملة</div></div>' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--green);">' + earnedC + '💰</div><div style="font-size:0.6em;color:var(--text2);">مكسوبة</div></div>' +
                        '<div style="flex:1;background:var(--surface2);border:1px solid var(--gold-border);border-radius:14px;padding:10px;text-align:center;"><div style="font-size:1.4em;font-weight:900;color:var(--accent2);">' + pctC + '%</div><div style="font-size:0.6em;color:var(--text2);">تقدّم</div></div>' +
                    '</div>' +
                    '<div style="background:var(--surface2);border-radius:10px;height:6px;overflow:hidden;margin-bottom:14px;"><div style="height:100%;width:' + pctC + '%;background:linear-gradient(90deg,' + meta.c1 + ',' + meta.c2 + ');border-radius:10px;transition:width 0.5s;"></div></div>' +
                    '<div style="display:flex;flex-direction:column;gap:8px;">' +
                    tasks.map(function(t) {
                        var p = t.goal > 0 ? Math.min(100, Math.round((t.progress/t.goal)*100)) : 0;
                        return '<div style="display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:14px;background:' + (t.done?'rgba(16,185,129,0.08)':'var(--surface2)') + ';border:1px solid ' + (t.done?'rgba(16,185,129,0.3)':'var(--border2)') + ';">' +
                            '<div style="font-size:1.4em;">' + t.icon + '</div>' +
                            '<div style="flex:1;">' +
                                '<div style="font-size:0.8em;font-weight:700;color:var(--text);margin-bottom:3px;">' + t.name + '</div>' +
                                '<div style="font-size:0.63em;color:var(--text2);margin-bottom:5px;">' + t.desc + '</div>' +
                                '<div style="height:4px;background:var(--border2);border-radius:4px;overflow:hidden;"><div style="height:100%;width:' + p + '%;background:linear-gradient(90deg,' + meta.c1 + ',' + meta.c2 + ');border-radius:4px;"></div></div>' +
                            '</div>' +
                            '<div style="text-align:center;min-width:44px;">' +
                                '<div style="font-size:0.88em;font-weight:900;color:' + (t.done?'var(--green)':'var(--gold)') + ';">' + (t.done?'✅':'+'+t.reward+'💰') + '</div>' +
                                (t.done ? '' : '<div style="font-size:0.6em;color:var(--text3);">' + t.progress + '/' + t.goal + '</div>') +
                            '</div>' +
                        '</div>';
                    }).join('') +
                    '</div>';
            }

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCategorySheet() {
            var overlay = document.getElementById('categorySheetOverlay');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        window.openCategorySheet  = openCategorySheet;
        window.closeCategorySheet = closeCategorySheet;


        function updCountdown() {
            const now = new Date(),
                midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const d = midnight - now;
            const h = String(Math.floor(d / 3600000)).padStart(2, '0');
            const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
            const timeStr = `${h}:${m}:${s}`;
            const el = document.getElementById('dailyCountdown');
            if (el) el.textContent = timeStr;
            const el2 = document.getElementById('profileDailyCountdown');
            if (el2) el2.textContent = timeStr;
        }
        setInterval(updCountdown, 1000);




        function showConfirm(title, msg, yesText, noText, cb) {
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMsg').textContent = msg;
            document.getElementById('confirmBtnYes').textContent = yesText || 'نعم';
            document.getElementById('confirmBtnNo').textContent = noText || 'إلغاء';
            const ov = document.getElementById('confirmOverlay');
            ov.classList.add('active');
            document.getElementById('confirmBtnYes').onclick = () => { ov.classList.remove('active');
                cb && cb(true); };
            document.getElementById('confirmBtnNo').onclick = () => { ov.classList.remove('active');
                cb && cb(false); };
        }

        /* ═══════════ LAWS DATA ═══════════ */
        const LAWS_DATA = [
            { cat: 'العمليات الأساسية', laws: [
                    { title: 'قانون الجمع التبادلي', formula: 'أ + ب = ب + أ', desc: 'تبديل الأعداد في الجمع لا يغير الناتج.',
                        example: '3+5=5+3=8' },
                    { title: 'قانون الجمع التجميعي', formula: '(أ + ب) + ج = أ + (ب + ج)',
                        desc: 'تجميع الأعداد في الجمع لا يؤثر على النتيجة.', example: '(2+3)+4=2+(3+4)=9' },
                    { title: 'قانون الضرب التبادلي', formula: 'أ × ب = ب × أ', desc: 'تبديل الأعداد في الضرب لا يغير الناتج.',
                        example: '4×5=5×4=20' },
                    { title: 'قانون الضرب التجميعي', formula: '(أ × ب) × ج = أ × (ب × ج)',
                        desc: 'تجميع الأعداد في الضرب لا يؤثر.', example: '(2×3)×4=2×(3×4)=24' },
                    { title: 'قانون التوزيع', formula: 'أ × (ب + ج) = أ×ب + أ×ج', desc: 'توزيع الضرب على الجمع.',
                        example: '3×(4+5)=12+15=27' },
                    { title: 'العنصر المحايد الجمعي', formula: 'أ + 0 = أ', desc: 'الصفر لا يغير قيمة العدد.',
                    example: '7+0=7' },
                    { title: 'العنصر المحايد الضربي', formula: 'أ × 1 = أ', desc: 'الواحد لا يغير قيمة العدد.',
                    example: '9×1=9' },
                    { title: 'المعكوس الجمعي', formula: 'أ + ( -أ ) = 0', desc: 'معكوس العدد هو سالبه.',
                        example: '5 + (-5) = 0' },
                    { title: 'المعكوس الضربي', formula: 'أ × (1/أ) = 1 (أ≠0)', desc: 'مقلوب العدد.',
                    example: '4 × 1/4 = 1' },
                    { title: 'قانون صفر الضرب', formula: 'أ × 0 = 0', desc: 'أي عدد مضروب في صفر يساوي صفر.',
                        example: '99 × 0 = 0' },
                ] },
            { cat: 'قوى وجذور', laws: [
                    { title: 'أساس مرفوع لصفر', formula: 'أ⁰ = 1 (أ≠0)',
                        desc: 'أي عدد غير صفري مرفوع للأس صفر يساوي 1.', example: '7⁰ = 1' },
                    { title: 'ضرب الأسس', formula: 'أ^م × أ^ن = أ^(م+ن)', desc: 'عند ضرب أساسات متساوية نجمع الأسس.',
                        example: '2³ × 2⁴ = 2⁷ = 128' },
                    { title: 'قسمة الأسس', formula: 'أ^م ÷ أ^ن = أ^(م-ن)', desc: 'عند قسمة أساسات متساوية نطرح الأسس.',
                        example: '5⁶ ÷ 5² = 5⁴ = 625' },
                    { title: 'أس القوة', formula: '(أ^م)^ن = أ^(م×ن)', desc: 'رفع قوة لقوة.', example: '(3²)³ = 3⁶ = 729' },
                    { title: 'الجذر التربيعي', formula: '√(أ²) = |أ|',
                        desc: 'الجذر التربيعي لمربع عدد يساوي قيمته المطلقة.', example: '√(25)=5' },
                    { title: 'ضرب الجذور', formula: '√أ × √ب = √(أ×ب)', desc: 'جذر حاصل الضرب = حاصل ضرب الجذور.',
                        example: '√2 × √8 = √16 = 4' },
                ] },
            { cat: 'كسور ونسب مئوية', laws: [
                    { title: 'توحيد المقامات', formula: 'أ/ب + ج/د = (أ×د + ج×ب)/(ب×د)',
                        desc: 'لجمع أو طرح كسرين نوحد المقام.', example: '1/2 + 1/3 = 5/6' },
                    { title: 'ضرب الكسور', formula: '(أ/ب) × (ج/د) = (أ×ج)/(ب×د)', desc: 'بسط في بسط ومقام في مقام.',
                        example: '(2/3)×(3/4)=6/12=1/2' },
                    { title: 'قسمة الكسور', formula: '(أ/ب) ÷ (ج/د) = (أ/ب) × (د/ج)',
                        desc: 'اضرب في مقلوب الكسر الثاني.', example: '(1/2)÷(1/4)= (1/2)×4=2' },
                    { title: 'النسبة المئوية', formula: 'ن% من س = (ن/100) × س',
                desc: 'حساب النسبة المئوية من عدد.', example: '20% من 50 = 10' },
                ] },
            { cat: 'هندسة وقياس', laws: [
                    { title: 'مساحة المربع', formula: 'م = الضلع²', desc: 'مربع طول ضلعه l → المساحة l².',
                        example: 'ضلع=4 → م=16' },
                    { title: 'مساحة المستطيل', formula: 'م = الطول × العرض', desc: 'حاصل ضرب الطول في العرض.',
                        example: 'طول=8, عرض=3 → م=24' },
                    { title: 'مساحة المثلث', formula: 'م = (القاعدة × الارتفاع)/2',
                        desc: 'نصف حاصل ضرب القاعدة في الارتفاع.', example: 'قاعدة=6, ارتفاع=4 → م=12' },
                    { title: 'مساحة الدائرة', formula: 'م = π نق²', desc: 'π≈3.14',
                example: 'نق=5 → م=78.5' },
                    { title: 'محيط الدائرة', formula: 'محيط = 2π نق', desc: 'المسافة حول الدائرة.',
                        example: 'نق=7 → محيط≈43.96' },
                    { title: 'نظرية فيثاغورس', formula: 'أ² + ب² = ج²',
                        desc: 'في المثلث القائم: مربع الوتر = مجموع مربعي الضلعين.', example: '3²+4²=5²' },
                    { title: 'حجم المكعب', formula: 'ح = الضلع³', desc: 'حجم المكعب = طول الضلع مكعب.',
                        example: 'ضلع=3 → ح=27' },
                    { title: 'حجم متوازي المستطيلات', formula: 'ح = الطول × العرض × الارتفاع',
                desc: 'حجم المنشور.', example: '2×3×4=24' },
                ] },
            { cat: 'جبر ومعادلات', laws: [
                    { title: 'حل المعادلة الخطية', formula: 'س = (ج - ب)/أ إذا كانت أ س + ب = ج',
                        desc: 'إيجاد قيمة المجهول.', example: '2س+3=7 → س=2' },
                    { title: 'قانون إشارات الضرب', formula: '(-) × (-) = + , (+) × (-) = -',
                        desc: 'ضرب عددين سالبين يعطي موجب، وضرب مختلفي الإشارة يعطي سالب.',
                    example: '(-3)×(-4)=12' },
                    { title: 'خاصية التوزيع للطرح', formula: 'أ × (ب - ج) = أ×ب - أ×ج',
                        desc: 'توزيع الضرب على الطرح.', example: '5×(6-2)=5×4=20' },
                    { title: 'صيغة المعادلة التربيعية', formula: 'س = [-ب ± √(ب²-4أج)]/(2أ)',
                        desc: 'حل معادلة أ س² + ب س + ج = 0', example: 'س²-5س+6=0 → س=2 أو 3' },
                ] },
            { cat: 'متتاليات ومنطق', laws: [
                    { title: 'المتتالية الحسابية', formula: 'ح_ن = ح₁ + (ن-1)د',
                        desc: 'الحد النوني = الحد الأول + (ن-1)×الفرق.',
                    example: '3,5,7,9,... الحد العاشر=3+9×2=21' },
                    { title: 'المتتالية الهندسية', formula: 'ح_ن = ح₁ × ر^(ن-1)',
                        desc: 'الحد النوني = الحد الأول × الأساس^(ن-1).',
                    example: '2,6,18,54,... الحد الرابع=2×3³=54' },
                    { title: 'قانون الثالث المنطقي', formula: 'إذا كان أ > ب و ب > ج ==> أ > ج',
                        desc: 'العلاقة متعدية.', example: '5>3 و 3>1 → 5>1' },
                ] },
            { cat: 'أساسيات الإحصاء', laws: [
                    { title: 'المتوسط الحسابي', formula: 'متوسط = (مجموع القيم) / عددها', desc: 'معدل البيانات.',
                        example: 'لقيم 2,4,6 → المتوسط=12/3=4' },
                    { title: 'الوسيط', formula: 'القيمة الوسطى بعد الترتيب', desc: 'الوسيط = منتصف البيانات.',
                        example: '1,3,5,7,9 → الوسيط=5' },
                ] },
            { cat: 'تحويلات ووحدات', laws: [
                    { title: 'تحويل الدرجة إلى راديان', formula: 'راديان = درجة × (π/180)',
                        desc: 'التحويل بين وحدات الزاوية.', example: '90° = π/2 راديان' },
                    { title: 'قانون السرعة', formula: 'ع = المسافة / الزمن',
                        desc: 'السرعة المتوسطة = المسافة الكلية / الزمن الكلي.',
                example: '100كم في 2س → سرعة=50كم/س' },
                ] }
        ];


        /* ═══════════════════════════════════════════════════════
           🎁 نظام الصندوق اليومي — Daily Reward Box
           يتجدد كل يوم ويمنح مكافأة عشوائية عند الفتح
           ═══════════════════════════════════════════════════════ */

        function getDailyBoxReward() {
            /* مكافأة عشوائية بناءً على مستوى اللاعب */
            const base = st.level >= 20 ? 8 :
                         st.level >= 10 ? 6 :
                         st.level >= 5  ? 4 : 3;
            const bonus = Math.floor(Math.random() * (base + 1));
            return base + bonus; /* 3-6 للمبتدئين، 8-16 للمتقدمين */
        }

        function isDailyBoxAvailable() {
            if (!st.dailyBox || typeof st.dailyBox !== 'object') {
                st.dailyBox = { opened: false, date: '', reward: 0 };
            }
            return st.dailyBox.date !== todayStr() || !st.dailyBox.opened;
        }

        function openDailyBox() {
            if (!isDailyBoxAvailable()) {
                showFeedback('📦 الصندوق فُتح اليوم — عد غداً!');
                return;
            }
            const reward = getDailyBoxReward();
            st.dailyBox = { opened: true, date: todayStr(), reward: reward };
            st.coins += reward;
            saveSt();
            updateUI();
            renderDailyBox();
            /* تشغيل أنيميشن الفتح */
            const boxEl = document.getElementById('dailyBoxCard');
            if (boxEl) {
                boxEl.classList.add('box-opening');
                setTimeout(() => boxEl.classList.remove('box-opening'), 700);
            }
            playSound('levelup');
            doConfetti();
            showFeedback(`🎁 مكافأة يومية! +${reward}💰`);
        }

        function renderDailyBox() {
            const boxEl = document.getElementById('dailyBoxCard');
            if (!boxEl) return;
            const available = isDailyBoxAvailable();
            const today = todayStr();
            /* حساب الوقت المتبقي حتى منتصف الليل */
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');

            if (available) {
                boxEl.innerHTML = `
                    <div class="daily-box-glow"></div>
                    <div class="daily-icon">🎁</div>
                    <div>
                        <div class="daily-title">المكافآت اليومية</div>
                        <div class="daily-sub">اضغط لفتح مكافأتك!</div>
                    </div>
                    <div class="daily-badge">متاح</div>`;
                boxEl.onclick = openDailyBox;
                boxEl.classList.remove('box-opened');
                boxEl.classList.add('box-available');
            } else {
                const lastReward = st.dailyBox.reward || 0;
                boxEl.innerHTML = `
                    <div class="daily-icon">✅</div>
                    <div>
                        <div class="daily-title">تم الفتح • +${lastReward}💰</div>
                        <div class="daily-sub">يتجدد بعد ${h}:${m}</div>
                    </div>
                    <div class="daily-badge" style="background:var(--surface3);color:var(--text2);">غداً</div>`;
                boxEl.onclick = null;
                boxEl.classList.remove('box-available');
                boxEl.classList.add('box-opened');
            }
        }

        /* تحديث عداد الصندوق كل دقيقة */
        setInterval(() => {
            if (document.getElementById('dailyBoxCard')) renderDailyBox();
        }, 60000);

        /* ═══════════════════════════════════════════════════════
           🗓️ تحدي الأسبوع — Weekly Challenge
           15 سؤالاً تتجدد كل أسبوع • مكافأة +15 عملة
           ═══════════════════════════════════════════════════════ */

        function hasWeeklyChallengeBeenPlayed() {
            return st.weeklyChallengeDate === weekStr() && st.weeklyChallengePlayed === true;
        }

        function markWeeklyChallengePlayed(score) {
            st.weeklyChallengePlayed = true;
            st.weeklyChallengeDate   = weekStr();
            if ((score || 0) > (st.weeklyChallengeBest || 0)) {
                st.weeklyChallengeBest = score || 0;
            }
            st.coins += 15;
            saveSt();
            updateUI();
            renderWeeklyChallenge();
            showFeedback('🗓️ أكملت تحدي الأسبوع! +15💰');
            playSound('levelup');
            doConfetti();
        }

        function renderWeeklyChallenge() {
            const el = document.getElementById('weeklyChallengeCard');
            if (!el) return;
            const played = hasWeeklyChallengeBeenPlayed();

            /* حساب الوقت المتبقي حتى نهاية الأسبوع */
            const now  = new Date();
            const day  = now.getDay();
            const daysLeft = day === 0 ? 0 : 7 - day;
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + daysLeft);
            endOfWeek.setHours(23, 59, 59, 0);
            const diff = endOfWeek - now;
            const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');

            if (!played) {
                el.innerHTML = `
                    <div class="daily-icon" style="animation:weeklyPulse 3s ease-in-out infinite;">🗓️</div>
                    <div>
                        <div class="daily-title">تحدي الأسبوع</div>
                        <div class="daily-sub">15 سؤالاً • +15 عملة • ينتهي بعد ${hh}:${mm}</div>
                    </div>
                    <div class="daily-badge" style="background:var(--accent2);">جديد</div>`;
                el.onclick = () => {
                    window._gameSource = 'home';
                    startGameWith('weekly', 'mix', null, false);
                };
                el.classList.remove('weekly-played');
                el.style.opacity = '';
                el.style.cursor  = 'pointer';
            } else {
                const best = st.weeklyChallengeBest || 0;
                el.innerHTML = `
                    <div class="daily-icon" style="animation:none;">✅</div>
                    <div>
                        <div class="daily-title">تحدي الأسبوع — مكتمل</div>
                        <div class="daily-sub">أفضل نتيجة: ${best}/15 • يتجدد الأحد القادم</div>
                    </div>
                    <div class="daily-badge" style="background:var(--border2);color:var(--text2);">منتهي</div>`;
                el.onclick = null;
                el.classList.add('weekly-played');
                el.style.opacity = '0.65';
                el.style.cursor  = 'default';
            }
        }

        /* تحديث عداد تحدي الأسبوع كل دقيقة */
        setInterval(() => {
            if (document.getElementById('weeklyChallengeCard')) renderWeeklyChallenge();
        }, 60000);

        function openLaws() {
            const el = document.getElementById('lawsContent');
            el.innerHTML = LAWS_DATA.map(cat => `
                <div style="margin-bottom:14px;"><div class="section-label" style="margin-bottom:8px;">${cat.cat}</div>
                ${cat.laws.map(law=>`<div class="law-card"><div class="law-title">📌 ${law.title}</div><div class="law-formula">${law.formula}</div><div class="law-desc">${law.desc}</div><div class="law-example">مثال: ${law.example}</div></div>`).join('')}
                </div>`).join('');
            document.getElementById('lawsOverlay').classList.add('active');
        }

        function closeLaws() { document.getElementById('lawsOverlay').classList.remove('active'); }



