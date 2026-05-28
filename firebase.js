/* ═══════════════════════════════════════════════════
   HO Math v8 — Unified & Fully Fixed Build
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* FIREBASE */
        let database = null;
        let auth = null;
        try {
            const firebaseConfig = {
               apiKey: "AIzaSyA90LjnECxC9GcHNQ8eRjPotLAFZPXWBOU",
               authDomain: "hassan-odaey.firebaseapp.com",
               databaseURL: "https://ho-math-gamr-default-rtdb.asia-southeast1.firebasedatabase.app",
               projectId: "hassan-odaey",
               storageBucket: "hassan-odaey.firebasestorage.app",
               messagingSenderId: "287990416545",
               appId: "1:287990416545:web:a2eb2df88aa42f7b4fdce0",
               measurementId: "G-75TXZC2YX6"
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            database = firebase.database();
            if (typeof firebase.auth === 'function') {
                auth = firebase.auth();
            }
        } catch (e) {
            console.warn('Firebase غير مهيأ:', e.message);
            database = null;
            auth = null;
        }

        /* ═══════════════════════════════════════════════════
           ☁️ FIREBASE DB — حفظ واستعادة سحابي
           ═══════════════════════════════════════════════════ */

        function saveToFirebase(serial, data) {
            if (!database || !serial) return;
            try {
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

        /* ربط serial ↔ UID */
        function linkSerialToUid(uid, serial) {
            if (!database || !uid || !serial) return;
            database.ref('uid_to_serial/' + uid).set(serial)
                .catch(e => console.warn('linkSerial err:', e));
        }

        function loadFromFirebaseByUid(uid, callback) {
            if (!database || !uid) { callback(null); return; }
            database.ref('uid_to_serial/' + uid).once('value')
                .then(snap => {
                    const serial = snap.val();
                    if (!serial) { callback(null); return; }
                    loadFromFirebase(serial, callback);
                })
                .catch(e => { console.warn('loadByUid err:', e); callback(null); });
        }

        /* ═══════════════════════════════════════════════════
           🔐 AUTH HELPERS
           ═══════════════════════════════════════════════════ */

        function authRegister(email, password, callback) {
            if (!auth) { callback({ error: 'Auth غير مفعّل — فعّله من Firebase Console' }); return; }
            auth.createUserWithEmailAndPassword(email, password)
                .then(cred => callback({ user: cred.user }))
                .catch(err => callback({ error: _authErrAr(err.code) }));
        }

        function authLogin(email, password, callback) {
            if (!auth) { callback({ error: 'Auth غير مفعّل — فعّله من Firebase Console' }); return; }
            auth.signInWithEmailAndPassword(email, password)
                .then(cred => callback({ user: cred.user }))
                .catch(err => callback({ error: _authErrAr(err.code) }));
        }

        function authResetPassword(email, callback) {
            if (!auth) { callback({ error: 'Auth غير مفعّل' }); return; }
            auth.sendPasswordResetEmail(email)
                .then(() => callback({ ok: true }))
                .catch(err => callback({ error: _authErrAr(err.code) }));
        }

        function authSignOut(callback) {
            if (!auth) return;
            auth.signOut().then(() => { if (callback) callback(); });
        }

        function _authErrAr(code) {
            const map = {
                'auth/email-already-in-use':   'هذا الإيميل مسجّل مسبقاً',
                'auth/invalid-email':           'الإيميل غير صحيح',
                'auth/weak-password':           'كلمة المرور قصيرة (6 أحرف على الأقل)',
                'auth/user-not-found':          'لم يُعثر على حساب بهذا الإيميل',
                'auth/wrong-password':          'كلمة المرور خاطئة',
                'auth/invalid-credential':      'الإيميل أو كلمة المرور غير صحيحة',
                'auth/too-many-requests':       'محاولات كثيرة، حاول لاحقاً',
                'auth/network-request-failed':  'خطأ في الشبكة، تحقق من اتصالك',
                'auth/user-disabled':           'هذا الحساب موقوف',
            };
            return map[code] || ('حدث خطأ: ' + code);
        }

        /* ═══════════════════════════════════════════════════
           🔄 Auth State Listener
           ═══════════════════════════════════════════════════ */

        function initAuthListener() {
            if (!auth) return;
            auth.onAuthStateChanged(function(user) {
                window._authUser = user || null;
                _updateAuthBadge(user);
            });
        }

        function _updateAuthBadge(user) {
            /* تحديث شارة صغيرة في صفحة الإعدادات إذا وجدت */
            const badge = document.getElementById('authStatusBadge');
            if (!badge) return;
            if (user) {
                badge.textContent = '✅ ' + user.email;
                badge.style.color = '#10b981';
            } else {
                badge.textContent = '⬜ غير مسجّل';
                badge.style.color = 'var(--text3)';
            }
        }

        window.addEventListener('load', function() {
            setTimeout(initAuthListener, 800);
        });

