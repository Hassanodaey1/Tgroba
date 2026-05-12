// firebase-sync.js
let database = null;
let firebaseReady = false;

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
        firebaseReady = true;
        console.log('✅ Firebase متصل بنجاح');
    }
} catch (e) {
    console.warn('⚠️ Firebase غير مهيأ:', e.message);
    firebaseReady = false;
    database = null;
}

function isFirebaseReady() {
    return firebaseReady && database !== null;
}

function syncUserData(userData) {
    if (!isFirebaseReady()) return Promise.resolve(false);
    if (!userData || !userData.serialNumber) return Promise.resolve(false);
    try {
        const playerRef = database.ref('players/' + userData.serialNumber);
        return playerRef.set({
            name: userData.name || 'لاعب',
            avatar: userData.avatar || '🧑',
            level: userData.level || 1,
            bestScore: userData.bestScore || 0,
            totalXp: userData.xp || 0,
            correctTotal: userData.correctTotal || 0,
            bestStreak: userData.bestStreak || 0,
            coins: userData.coins || 0,
            lastUpdated: Date.now()
        }).then(() => true).catch(() => false);
    } catch (e) {
        return Promise.resolve(false);
    }
}

function loadUserData(serialNumber) {
    if (!isFirebaseReady()) return Promise.resolve(null);
    try {
        return database.ref('players/' + serialNumber).once('value')
            .then(snapshot => snapshot.val())
            .catch(() => null);
    } catch (e) {
        return Promise.resolve(null);
    }
}

function syncToLeaderboard(playerData) {
    if (!isFirebaseReady() || !playerData.serialNumber) return;
    try {
        const ref = database.ref('leaderboard/' + playerData.serialNumber);
        ref.set({
            name: playerData.name,
            avatar: playerData.avatar,
            level: playerData.level,
            bestScore: playerData.bestScore,
            totalXp: playerData.xp || 0,
            lastUpdated: Date.now()
        }).catch(() => {});
    } catch (e) {}
}

function watchConnectionStatus(onOnline, onOffline) {
    if (!isFirebaseReady()) return;
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            if (typeof onOnline === 'function') onOnline();
        } else {
            if (typeof onOffline === 'function') onOffline();
        }
    });
}
