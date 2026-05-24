/* STATE */
        /* ═══════════ GLOBAL STATE ═══════════ */
        const SK = 'ho_math_v7';

        function todayStr() {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; /* ✅ إصلاح: +1 للشهر */
        }

        function weekStr() {
            const d = new Date();
            const jan1 = new Date(d.getFullYear(), 0, 1);
            const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
            return `${d.getFullYear()}-W${week}`;
        }

        function defState() {
            return {
                name: 'Player',
                age: 0,
                birthDate: '2000-01-01',
                gender: 'm',
                avatar: '👦',
                profilePhoto: null,
                xp: 0,
                xpToNext: 1000,
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
                /* إحصائيات يومية */
                dailyStats: { correct: 0, wrong: 0, games: 0, date: todayStr() },
                /* إحصائيات أسبوعية */
                weeklyStats: { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() },
                tGold: '#f0b90b',
                tAccent: '#7c3aed',
                tAccent2: '#06b6d4',
                sessionTimeSecs: 0,
                sessionDate: todayStr(),
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
                challengeBestScore: 0
            };
        }

        function sanitizeState(s) {
            if (typeof s.coins !== 'number' || s.coins < 0) s.coins = 0;
            if (s.coins > 999999) s.coins = 999999;                          /* ✅ حد أعلى للعملات */
            if (typeof s.level !== 'number' || s.level < 1) s.level = 1;
            if (s.level > 100) s.level = 100;                                /* ✅ حد أعلى للمستوى */
            if (typeof s.xp !== 'number' || s.xp < 0) s.xp = 0;
            if (s.xp > 9999999) s.xp = 9999999;                             /* ✅ حد أعلى للـ XP */
            if (typeof s.xpToNext !== 'number' || s.xpToNext < 100) s.xpToNext = 1000;
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
            if (!s.dailyStats || s.dailyStats.date !== todayStr()) {
                s.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }
            if (!s.weeklyStats || s.weeklyStats.week !== weekStr()) {
                s.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() };
            }
            return s;
        }

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

        function generateSerialNumber(birthDate, name) {
            const nameEng = (name || 'User').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
            const cleanDate = birthDate.replace(/-/g, '');
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const count = parseInt(localStorage.getItem('ho_math_user_count') || '0') + 1;
            localStorage.setItem('ho_math_user_count', count);
            return `${cleanDate}-${nameEng}-${randomPart}-${count}`;
        }

        function updateSerialNumberDisplay() {
            ['serialNumberDisplay', 'settingsSerialDisplay'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = st.serialNumber || 'احفظ الملف الشخصي أولاً';
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

        /* استعادة من صفحة الإعدادات */
        function restoreFromSettings() {
            const inp = document.getElementById('settingsRestoreInput');
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

        var st = loadSt();
        var currentOp = st.lastOp || 'mix';

        /* ═══════════ RESET COMPLETE ═══════════ */
        function confirmResetComplete(force) {
            showConfirm('البدء من جديد',
                'سيتم حذف جميع البيانات: الإحصائيات، العملات، المستوى، المهام، الإنجازات، الرقم التسلسلي، وكل شيء. لا يمكن التراجع. هل أنت متأكد؟',
                'نعم، احذف الكل', 'إلغاء', (ok) => {
                    if (ok) {
                        localStorage.removeItem(SK);
                        for (let i = 0; i < localStorage.length; i++) {
                            let key = localStorage.key(i);
                            if (key && key.startsWith('ho_math_backup_')) localStorage.removeItem(key);
                        }
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
        function recordDailyStat(type) {
            /* تحقق من التاريخ */
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
