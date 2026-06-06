/* ═══════════════════════════════════════════════════════════════
   HO Math — نظام الصوتيات + حالة اللعبة G
   © 2026 Hassan Odaey
   v3.0 — Web Audio API احترافي
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   حالة اللعبة G — مصدر الحقيقة الوحيد
═══════════════════════════════════════════════════════════════ */
var G = {
    mode: 'classic', op: 'mix', score: 0, correct: 0, wrong: 0, streak: 0,
    bestStreak: 0, currentQ: 0, totalQ: 10, correctAnswer: 0, answered: false,
    timer: null, timeLeft: 0, maxTime: 0, coinsEarned: 0, livesLeft: 3,
    maxLives: 3,
    helpersUsed: { skip: false, remove: false, heart: false },
    ended: false, isTraining: false, _survivalWrong: 0,
    customTable: null, hasTimer: false, askedQuestions: [],
    currentExplanation: '', currentCatKey: ''
};

function clearGameTimer() {
    if (G.timer) { clearInterval(G.timer); G.timer = null; }
}

/* ═══════════════════════════════════════════════════════════════
   جسيمات الخلفية والرموز الرياضية العائمة
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
    const c = document.getElementById('particles');
    if (c) {
        const col = ['#f0b90b', '#7c3aed', '#06b6d4', '#10b981'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `left:${Math.random()*100}%;background:${col[~~(Math.random()*4)]};width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;animation-delay:${Math.random()*9}s;animation-duration:${6+Math.random()*7}s;`;
            c.appendChild(p);
        }
    }
    const container = document.getElementById('splashSymbols');
    if (container) {
        const sym = ['∑','∏','√','∞','π','Δ','∫','∂','±','×','÷','=','α','β','θ','λ','μ','σ','φ','ψ','Ω','∈','∀','∃','≅','≈','≠','≤','≥','+','-','*','/'];
        container.innerHTML = '';
        for (let i = 0; i < 55; i++) {
            let span = document.createElement('span');
            span.textContent = sym[Math.floor(Math.random() * sym.length)];
            let size = Math.random() * 2 + 0.8;
            span.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${size}em;opacity:${Math.random()*0.3+0.05};transform:rotate(${Math.random()*360}deg);animation:floatSymbol ${Math.random()*10+8}s infinite alternate ease-in-out;animation-delay:-${Math.random()*5}s;`;
            span.classList.add('animated-symbol');
            container.appendChild(span);
        }
    }
});

/* ═══════════════════════════════════════════════════════════════
   ① نواة الصوت — Web Audio API
═══════════════════════════════════════════════════════════════ */
var aCtx = null, _masterGain = null, _compressor = null, _reverbNode = null;
var bgInt = null, _bgGain = null, _bgAccelerated = false;

function gACtx() {
    if (!aCtx) {
        try {
            aCtx = new (window.AudioContext || window.webkitAudioContext)();
            _setupAudioGraph();
        } catch(e) { console.warn('AudioContext غير متاح:', e); }
    }
    if (aCtx && aCtx.state === 'suspended') aCtx.resume().catch(() => {});
    return aCtx;
}

function _setupAudioGraph() {
    if (!aCtx) return;
    _masterGain = aCtx.createGain();
    _masterGain.gain.value = 1.0;
    _masterGain.connect(aCtx.destination);
    _compressor = aCtx.createDynamicsCompressor();
    _compressor.threshold.value = -18;
    _compressor.knee.value = 8;
    _compressor.ratio.value = 4;
    _compressor.attack.value = 0.003;
    _compressor.release.value = 0.12;
    _compressor.connect(_masterGain);
    try {
        _reverbNode = _buildSimpleReverb(aCtx, 0.8);
        _reverbNode.connect(_masterGain);
    } catch(e) {}
    _bgGain = aCtx.createGain();
    const vol = (typeof st !== 'undefined' && typeof st.bgVolume === 'number' ? st.bgVolume : 60) / 100;
    _bgGain.gain.value = 0.022 * vol;
    _bgGain.connect(_compressor);
}

function _buildSimpleReverb(ctx, durationSec) {
    const conv = ctx.createConvolver();
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let i = 0; i < length; i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/length, 2.5);
    }
    conv.buffer = buf;
    const rvGain = ctx.createGain();
    rvGain.gain.value = 0.08;
    conv.connect(rvGain);
    rvGain.connect(ctx.destination);
    return conv;
}

/* ② مولّد النغمات */
function tone(f, t = 'sine', d = 0.25, v = 0.12, delay = 0, useReverb = false) {
    if (!st || !st.soundOn) return;
    const ctx = gACtx();
    if (!ctx) return;
    const vol = (typeof st.soundVolume === 'number' ? st.soundVolume : 80) / 100;
    const o = ctx.createOscillator(), g = ctx.createGain();
    const eq = ctx.createBiquadFilter();
    eq.type = 'highshelf'; eq.frequency.value = 3000; eq.gain.value = 3;
    o.connect(eq); eq.connect(g);
    if (useReverb && _reverbNode) g.connect(_reverbNode);
    g.connect(_compressor || ctx.destination);
    o.type = t;
    o.frequency.setValueAtTime(f, ctx.currentTime + delay);
    const ts = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, ts);
    g.gain.linearRampToValueAtTime(v * vol, ts + 0.008);
    g.gain.setValueAtTime(v * vol * 0.85, ts + d * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, ts + d);
    o.start(ts); o.stop(ts + d + 0.01);
}

function toneGlide(fStart, fEnd, t = 'sine', d = 0.3, v = 0.12, delay = 0) {
    if (!st || !st.soundOn) return;
    const ctx = gACtx();
    if (!ctx) return;
    const vol = (typeof st.soundVolume === 'number' ? st.soundVolume : 80) / 100;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(_compressor || ctx.destination);
    o.type = t;
    const ts = ctx.currentTime + delay;
    o.frequency.setValueAtTime(fStart, ts);
    o.frequency.exponentialRampToValueAtTime(fEnd, ts + d);
    g.gain.setValueAtTime(0, ts);
    g.gain.linearRampToValueAtTime(v * vol, ts + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ts + d);
    o.start(ts); o.stop(ts + d + 0.01);
}

/* ③ مكتبة المؤثرات */
function playSound(type) {
    if (!st || !st.soundOn) return;
    const ctx = gACtx();
    if (!ctx) return;
    switch (type) {
        case 'correct':  tone(523,'sine',0.10,0.10); tone(659,'sine',0.12,0.09,0.07); tone(784,'sine',0.14,0.08,0.14); tone(1047,'triangle',0.10,0.04,0.14); break;
        case 'wrong':    tone(300,'sawtooth',0.08,0.09); toneGlide(220,140,'sawtooth',0.22,0.07,0.06); tone(80,'sine',0.18,0.06,0.0); break;
        case 'levelup': {
            const mel=[{f:523,t:'sine',d:0.12,v:0.11,delay:0.00},{f:659,t:'sine',d:0.12,v:0.10,delay:0.11},{f:784,t:'sine',d:0.14,v:0.10,delay:0.22},{f:1047,t:'sine',d:0.22,v:0.12,delay:0.35},{f:784,t:'sine',d:0.10,v:0.09,delay:0.58},{f:1047,t:'sine',d:0.35,v:0.13,delay:0.70},{f:1319,t:'sine',d:0.30,v:0.10,delay:0.95}];
            mel.forEach(n=>tone(n.f,n.t,n.d,n.v,n.delay,n.delay>0.5));
            tone(261,'triangle',0.80,0.035,0.0); tone(392,'triangle',0.65,0.030,0.25); tone(523,'triangle',0.50,0.025,0.50); break;
        }
        case 'purchase': tone(440,'sine',0.12,0.10); tone(554,'sine',0.14,0.09,0.10); tone(659,'sine',0.20,0.11,0.22); tone(880,'sine',0.18,0.08,0.38); break;
        case 'click':    tone(800,'sine',0.055,0.055); tone(1000,'sine',0.035,0.030,0.03); break;
        case 'open':     toneGlide(350,520,'sine',0.14,0.08); tone(520,'sine',0.10,0.06,0.14); break;
        case 'tick':     tone(1200,'square',0.025,0.018); break;
        case 'combo3':   tone(440,'sine',0.09,0.09); tone(554,'sine',0.10,0.08,0.08); break;
        case 'combo5':   tone(523,'sine',0.09,0.10); tone(659,'sine',0.10,0.09,0.08); tone(784,'sine',0.12,0.09,0.17); break;
        case 'combo10':  tone(659,'sine',0.10,0.11); tone(784,'sine',0.10,0.10,0.08); tone(1047,'sine',0.15,0.11,0.18); tone(1319,'sine',0.14,0.09,0.32,true); break;
        case 'coin':     tone(880,'sine',0.07,0.07); tone(1108,'sine',0.09,0.07,0.07); break;
        case 'warning':  tone(330,'square',0.07,0.06); tone(294,'square',0.10,0.06,0.10); break;
        case 'close':    toneGlide(520,350,'sine',0.12,0.07); break;
        case 'shield':   tone(392,'triangle',0.12,0.09); tone(494,'triangle',0.14,0.08,0.11); tone(587,'triangle',0.18,0.08,0.24,true); break;
        case 'task':     tone(587,'sine',0.10,0.09); tone(740,'sine',0.12,0.09,0.10); tone(880,'sine',0.16,0.10,0.22); break;
    }
    _vibrate(type);
}

/* ④ نظام الاهتزاز */
function _vibrate(type) {
    if (!st || !st.vibrationOn || !navigator.vibrate) return;
    const ms = Math.max(10, Math.min(200, st.vibrationStrength || 30));
    const patterns = {
        click:[Math.round(ms*0.4)],correct:[ms],wrong:[ms,40,ms],levelup:[ms,30,ms,30,ms*2],
        purchase:[ms,20,ms,20,ms],combo3:[ms],combo5:[ms,20,ms],combo10:[ms,15,ms,15,ms,15,ms*2],
        warning:[ms,60,ms],shield:[ms*2],task:[ms,25,ms],coin:[Math.round(ms*0.6)]
    };
    navigator.vibrate(patterns[type] || [ms]);
}

/* ⑤ الموسيقى الخلفية التكيّفية */
const _BG_SCALE       = [261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25];
const _BG_SCALE_MINOR = [220.00,246.94,261.63,293.66,329.63,349.23,392.00,440.00];
const _BG_SCALE_DAILY = [392.00,440.00,493.88,523.25,587.33,659.25,739.99,783.99];
const _BG_PATTERNS = [
    [0,2,4,7,4,2],[0,4,7,4,2,4],[0,2,4,2,0,4,7,4],[0,2,4,7,5,4,2,0],[0,3,5,7,5,3]
];
const _BG_MODE_CONFIGS = {
    classic:    {patternIdx:0,scale:'_BG_SCALE',        interval:480,wave:'triangle'},
    training:   {patternIdx:0,scale:'_BG_SCALE',        interval:520,wave:'sine'    },
    speed:      {patternIdx:1,scale:'_BG_SCALE_MINOR',  interval:300,wave:'square'  },
    frenzy:     {patternIdx:2,scale:'_BG_SCALE_MINOR',  interval:220,wave:'square'  },
    survival:   {patternIdx:4,scale:'_BG_SCALE_MINOR',  interval:420,wave:'triangle'},
    daily:      {patternIdx:3,scale:'_BG_SCALE_DAILY',  interval:460,wave:'sine'    },
    accuracy:   {patternIdx:4,scale:'_BG_SCALE',        interval:380,wave:'triangle'},
    marathon:   {patternIdx:1,scale:'_BG_SCALE',        interval:400,wave:'triangle'},
    impossible: {patternIdx:2,scale:'_BG_SCALE_MINOR',  interval:200,wave:'square'  }
};

let _bgNoteIdx = 0, _bgCurrentPattern = _BG_PATTERNS[0];
let _bgCurrentScale = _BG_SCALE, _bgCurrentWave = 'triangle', _bgCurrentInterval = 480;

function bgNote() {
    if (!st || !st.bgOn) return;
    const ctx = gACtx();
    if (!ctx || !_bgGain) return;
    const vol = (typeof st.bgVolume === 'number' ? st.bgVolume : 60) / 100;
    _bgGain.gain.setValueAtTime(0.022 * vol * (_bgAccelerated ? 1.3 : 1.0), ctx.currentTime);
    const noteIdx = _bgCurrentPattern[_bgNoteIdx % _bgCurrentPattern.length];
    const freq = _bgCurrentScale[noteIdx % _bgCurrentScale.length];
    _bgNoteIdx++;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(_bgGain);
    o.type = _bgCurrentWave; o.frequency.value = freq;
    const noteDur = _bgAccelerated ? 0.22 : (_bgCurrentInterval / 1000) * 0.85;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.022 * vol, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + noteDur);
    if (_bgNoteIdx % 4 === 0) {
        const bass = ctx.createOscillator(), bassG = ctx.createGain();
        bass.connect(bassG); bassG.connect(_bgGain);
        bass.type = 'sine'; bass.frequency.value = freq / 2;
        bassG.gain.setValueAtTime(0, ctx.currentTime);
        bassG.gain.linearRampToValueAtTime(0.018 * vol, ctx.currentTime + 0.03);
        bassG.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + noteDur * 1.2);
        bass.start(ctx.currentTime); bass.stop(ctx.currentTime + noteDur * 1.3);
    }
    o.start(ctx.currentTime); o.stop(ctx.currentTime + noteDur + 0.01);
}

function startBg() {
    if (!bgInt) bgInt = setInterval(bgNote, _bgAccelerated ? 220 : _bgCurrentInterval);
}

function stopBg() {
    clearInterval(bgInt); bgInt = null;
    if (_bgGain && aCtx) {
        try {
            _bgGain.gain.cancelScheduledValues(aCtx.currentTime);
            _bgGain.gain.setValueAtTime(_bgGain.gain.value, aCtx.currentTime);
            _bgGain.gain.linearRampToValueAtTime(0.0001, aCtx.currentTime + 0.08);
        } catch(e) {}
    }
}

function setBgAccelerated(isAccel) {
    if (_bgAccelerated === isAccel) return;
    _bgAccelerated = isAccel;
    if (bgInt) { stopBg(); startBg(); }
    if (isAccel) { _bgCurrentPattern = _BG_PATTERNS[2]; playSound('warning'); }
    else          { _bgCurrentPattern = _BG_PATTERNS[0]; }
}

function setBgMoodForMode(mode) {
    const scaleMap = { '_BG_SCALE':_BG_SCALE, '_BG_SCALE_MINOR':_BG_SCALE_MINOR, '_BG_SCALE_DAILY':_BG_SCALE_DAILY };
    const cfg = _BG_MODE_CONFIGS[mode] || _BG_MODE_CONFIGS['classic'];
    _bgCurrentPattern  = _BG_PATTERNS[cfg.patternIdx];
    _bgCurrentScale    = scaleMap[cfg.scale] || _BG_SCALE;
    _bgCurrentWave     = cfg.wave;
    _bgCurrentInterval = cfg.interval;
    _bgNoteIdx = 0; _bgAccelerated = false;
    stopBg();
    if (st && st.bgOn) startBg();
}

/* ⑥ تبديل الصوت */
function toggleBgMusic() {
    st.bgOn = !st.bgOn;
    ['bgMusicStatus','gbgMusicStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.bgOn ? 'مفعّلة' : 'مطفأة';
    });
    st.bgOn ? startBg() : stopBg();
    playSound('click'); saveSt();
}

function toggleSound() {
    st.soundOn = !st.soundOn;
    ['soundStatus','gsoundStatus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = st.soundOn ? 'مفعّل' : 'مطفأ';
    });
    saveSt();
    if (st.soundOn) playSound('click');
}

/* ⑦ مزامنة الصوت مع المؤقت */
function _syncBgWithTimer() {
    if (!G || !G.hasTimer || !G.maxTime) return;
    const pct = G.timeLeft / G.maxTime;
    if (pct <= 0.25 && !_bgAccelerated) setBgAccelerated(true);
    else if (pct > 0.25 && _bgAccelerated) setBgAccelerated(false);
}

window._onGameTimerTick = function() {
    _syncBgWithTimer();
    if (G && G.hasTimer && G.timeLeft <= 5 && G.timeLeft > 0) {
        if (!st || !st.soundOn) return;
        try {
            const ctx = gACtx();
            if (ctx) {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.connect(g); g.connect(_compressor || ctx.destination);
                o.type = 'square'; o.frequency.value = 1200;
                const vol = ((st && st.soundVolume) || 80) / 100;
                g.gain.setValueAtTime(0, ctx.currentTime);
                g.gain.linearRampToValueAtTime(0.018 * vol, ctx.currentTime + 0.005);
                g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
                o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.03);
            }
        } catch(e) {}
    }
};

/* ⑧ Combo Sound */
function playComboSound(streak) {
    if (streak >= 10) playSound('combo10');
    else if (streak >= 5) playSound('combo5');
    else if (streak >= 3) playSound('combo3');
}

/* ⑨ استعادة بعد سبات المتصفح */
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && aCtx && aCtx.state === 'suspended') aCtx.resume().catch(() => {});
    if (document.hidden) stopBg();
    else if (st && st.bgOn) setTimeout(startBg, 300);
});
document.addEventListener('touchstart', function() { gACtx(); }, { once: true, passive: true });
document.addEventListener('click',      function() { gACtx(); if (aCtx && aCtx.state==='suspended') aCtx.resume().catch(()=>{}); }, { once: true });
