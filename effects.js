/* ═══════════ GAME STATE ═══════════ */
let G = { mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, currentQ: 0,
    totalQ: 10, correctAnswer: 0, answered: false, timer: null, timeLeft: 0, maxTime: 0, coinsEarned: 0,
    livesLeft: 3, helpersUsed: { skip: false, remove: false }, ended: false, isTraining: false,
    customTable: null, hasTimer: false, askedQuestions: [], currentExplanation: '',
    currentCatKey: '' };

function clearGameTimer() { if (G.timer) { clearInterval(G.timer); G.timer = null; } }

/* ═══════════ PARTICLES ═══════════ */
(function() {
    const c = document.getElementById('particles');
    const col = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981'];
    for (let i = 0; i < 18; i++) { const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random()*100}%;background:${col[~~(Math.random()*4)]};width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;animation-delay:${Math.random()*9}s;animation-duration:${6+Math.random()*7}s;`;
        c.appendChild(p); }
})();

/* ═══════════ SPLASH SYMBOLS ═══════════ */
(function() {
    const sym = ['∑','∏','√','∞','π','Δ','∫','∂','±','×','÷','=','α','β','θ','λ','μ','σ','φ','ψ','Ω','∈','∀','∃','≅','≈','≠','≤','≥','+','-','*','/'];
    let container = document.getElementById('splashSymbols');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 55; i++) {
        let span = document.createElement('span');
        let s = sym[Math.floor(Math.random() * sym.length)];
        span.textContent = s;
        let size = Math.random() * 2 + 0.8;
        span.style.position = 'absolute';
        span.style.left = Math.random() * 100 + '%';
        span.style.top = Math.random() * 100 + '%';
        span.style.fontSize = size + 'em';
        span.style.opacity = Math.random() * 0.3 + 0.05;
        span.style.transform = `rotate(${Math.random()*360}deg)`;
        span.style.animation = `floatSymbol ${Math.random()*10+8}s infinite alternate ease-in-out`;
        span.style.animationDelay = `-${Math.random()*5}s`;
        span.classList.add('animated-symbol');
        container.appendChild(span);
    }
})();

/* ═══════════ AUDIO ═══════════ */
let aCtx = null;
let bgInt = null;

function gACtx() { if (!aCtx) try { aCtx = new(window.AudioContext || window.webkitAudioContext)(); } catch(e) {} return aCtx; }

function tone(f, t='sine', d=0.25, v=0.12, delay=0) {
    if (!st.soundOn) return;
    const ctx = gACtx();
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = t; o.frequency.value = f; g.gain.value = v;
    const ts = ctx.currentTime + delay;
    o.start(ts);
    g.gain.exponentialRampToValueAtTime(0.001, ts + d);
    o.stop(ts + d + 0.01);
}

function playSound(type) {
    if (!st.soundOn) return;
    if (type === 'correct') { tone(660,'sine',0.14,0.11); tone(880,'sine',0.14,0.08,0.12); }
    else if (type === 'wrong') { tone(200,'sawtooth',0.2,0.1); }
    else if (type === 'levelup') { tone(523,'sine',0.1,0.1); tone(659,'sine',0.1,0.1,0.1); tone(784,'sine',0.16,0.1,0.2); }
    else if (type === 'click') { tone(440,'sine',0.07,0.06); }
    else if (type === 'open') { tone(392,'sine',0.1,0.07); tone(523,'sine',0.12,0.07,0.1); }
    else if (type === 'tick') { tone(1000,'sine',0.03,0.02); }
}
const bgNotes = [261,294,329,349,392,440,494,523,392,349];
let bgIdx = 0;

function bgNote() {
    if (!st.bgOn) return;
    const ctx = gACtx();
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'triangle'; o.frequency.value = bgNotes[bgIdx % bgNotes.length];
    bgIdx++;
    g.gain.value = 0.025;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    o.stop(ctx.currentTime + 2.1);
}

function startBg() { if (bgInt) clearInterval(bgInt); bgInt = setInterval(bgNote, 2400); }
function stopBg() { clearInterval(bgInt); bgInt = null; }
function toggleBgMusic() {
    st.bgOn = !st.bgOn;
    document.getElementById('bgBtn').textContent = st.bgOn ? '🎵' : '🔕';
    document.getElementById('bgMusicStatus').textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    st.bgOn ? startBg() : stopBg();
    playSound('click');
    saveSt();
}
function toggleSound() {
    st.soundOn = !st.soundOn;
    document.getElementById('soundBtn').textContent = st.soundOn ? '🔊' : '🔇';
    const el = document.getElementById('soundStatus'); if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    saveSt();
}
