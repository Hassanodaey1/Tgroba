        var database = null;
        var firebaseReady = false;
        var _fbInitTries = 0;

        function initFirebase() {
            _fbInitTries++;
            try {
                if (typeof firebase === 'undefined') {
                    if (_fbInitTries < 10) setTimeout(initFirebase, 300);
                    else console.warn('Firebase SDK لم يُحمَّل بعد 10 محاولات');
                    return;
                }
                var firebaseConfig = {
                    apiKey: "AIzaSyA90LjnECxC9GcHNQ8eRjPotLAFZPXWBOU",
                    authDomain: "hassan-odaey.firebaseapp.com",
                    databaseURL: "https://ho-math-gamr-default-rtdb.asia-southeast1.firebasedatabase.app",
                    projectId: "hassan-odaey",
                    storageBucket: "hassan-odaey.firebasestorage.app",
                    messagingSenderId: "287990416545",
                    appId: "1287990416545:web:a2eb2df88aa42f7b4fdce0"
                };
                if (!firebase.apps || firebase.apps.length === 0) {
                    firebase.initializeApp(firebaseConfig);
                }
                database = firebase.database();
                firebaseReady = true;
            } catch (e) {
                console.warn('Firebase init error:', e.message);
                database = null;
                firebaseReady = false;
            }
        }

        initFirebase();
