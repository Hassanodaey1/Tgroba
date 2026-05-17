/* ═══════════════════════════════════════════════════
   HO Math v8 — Unified & Fully Fixed Build
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════ */

/* FIREBASE */
        let database = null;
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
                database = firebase.database();
            }
        } catch (e) {
            console.warn('Firebase غير مهيأ، سيتم تعطيل لوحة المتصدرين:', e.message);
            database = null;
        }
