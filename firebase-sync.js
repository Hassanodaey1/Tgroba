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
        console.log('✅ Firebase متصل بنجاح - المنافسة مفعلة');
    }
} catch (e) {
    console.warn('Firebase غير مهيأ، سيتم تعطيل لوحة المتصدرين:', e.message);
    database = null;
}

function syncLeaderboard(name, avatar, level, bestScore) {
    if (!database || !st.serialNumber) return;
    const playerRef = database.ref('leaderboard/' + st.serialNumber);
    playerRef.set({
        name: name,
        avatar: avatar,
        level: level,
        bestScore: bestScore,
        lastUpdated: Date.now()
    }).catch(() => {});
}

function fetchTopPlayers(callback) {
    if (!database) {
        callback([]);
        return;
    }
    database.ref('leaderboard').once('value').then(snapshot => {
        const players = [];
        snapshot.forEach(child => {
            players.push({ id: child.key, ...child.val() });
        });
        players.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
        callback(players.slice(0, 10));
    }).catch(err => {
        console.warn('فشل جلب المتصدرين:', err);
        callback([]);
    });
}
