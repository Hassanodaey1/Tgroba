/* STATE */
        /* ═══════════ GLOBAL STATE ═══════════ */
        const SK = 'ho_math_v7';

        function todayStr() {
            const d = new Date();
            return `${d.getFullYear()}-${(d.getMonth()+1)}-${d.getDate()}`; /* ✅ FIX-B1: getMonth()+1 */
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
            /* ✅ FIX-V2: حدود عليا لمنع التلاعب بـ localStorage */
            if (typeof s.coins !== 'number'  || s.coins < 0)   s.coins = 0;
            if (s.coins  > 999999)  s.coins  = 999999;
            if (typeof s.level !== 'number'  || s.level < 1)   s.level = 1;
            if (s.level  > 200)     s.level  = 200;
            if (typeof s.xp !== 'number'     || s.xp < 0)      s.xp = 0;
            if (s.xp     > 99999999) s.xp    = 99999999;
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
            /* ✅ FIX-V2b: حدود عليا للإحصائيات */
            if (typeof s.bestScore    !== 'number' || s.bestScore < 0)    s.bestScore = 0;
            if (s.bestScore    > 9999999)  s.bestScore    = 9999999;
            if (typeof s.correctTotal !== 'number' || s.correctTotal < 0) s.correctTotal = 0;
            if (s.correctTotal > 9999999)  s.correctTotal = 9999999;
            if (typeof s.totalGames   !== 'number' || s.totalGames < 0)   s.totalGames = 0;
            if (s.totalGames   > 9999999)  s.totalGames   = 9999999;
            if (typeof s.challengeBestScore !== 'number' || s.challengeBestScore < 0) s.challengeBestScore = 0;
            if (s.challengeBestScore > 9999999) s.challengeBestScore = 9999999;
            if (!s.dailyStats || s.dailyStats.date !== todayStr()) {
                s.dailyStats = { correct: 0, wrong: 0, games: 0, date: todayStr() };
            }
            if (!s.weeklyStats || s.weeklyStats.week !== weekStr()) {
                s.weeklyStats = { correct: 0, wrong: 0, games: 0, bestStreak: 0, week: weekStr() };
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
            const serial = document.getElementById('restoreSerialInput').value.trim();
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
