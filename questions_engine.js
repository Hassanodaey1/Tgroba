/* ═══════════════════════════════════════════════════════════════
   HO Math — محرك الأسئلة الذكي v3.0 (FIXED)
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   ① خريطة المستويات الدقيقة
═══════════════════════════════════════════════════════════════ */

var LEVEL_PHASES = [
    { from:  1, to:  3, label:'مبتدئ',    diff:'easy',   nMin:1,  nMax:10,  mMin:2, mMax:5, ops:['add','sub'] },
    { from:  4, to:  6, label:'ناشئ',     diff:'easy',   nMin:1,  nMax:20,  mMin:2, mMax:9, ops:['add','sub','mul'] },
    { from:  7, to: 10, label:'متطور',   diff:'easy',   nMin:5,  nMax:30,  mMin:2, mMax:12, ops:['add','sub','mul','div'] },
    { from: 11, to: 15, label:'متوسط',   diff:'medium', nMin:10, nMax:50,  mMin:3, mMax:12, ops:['add','sub','mul','div','percent','word_add','word_mul'] },
    { from: 16, to: 22, label:'متقدم',   diff:'medium', nMin:15, nMax:80,  mMin:3, mMax:15, ops:['add','sub','mul','div','percent','equation_simple','fraction_simple','sequence','word_add','word_mul'] },
    { from: 23, to: 30, label:'ماهر',    diff:'medium', nMin:20, nMax:120, mMin:4, mMax:18, ops:['mul','div','percent','equation_simple','fraction_simple','fraction_add','power','sqrt','sequence','word_hard'] },
    { from: 31, to: 45, label:'صعب',     diff:'hard',   nMin:30, nMax:300, mMin:5, mMax:22, ops:['mul','div','percent','fraction_add','power','sqrt','algebra','sequence','word_hard','geo_area'] },
    { from: 46, to: 65, label:'خبير',    diff:'hard',   nMin:50, nMax:600, mMin:7, mMax:28, ops:['mul','div','percent','fraction_add','fraction_mul','power','sqrt','algebra','sequence','word_hard','geo_area','log_simple'] },
    { from: 66, to:100, label:'محترف',   diff:'hard',   nMin:80, nMax:999, mMin:8, mMax:35, ops:['mul','div','percent','fraction_mul','fraction_add','power','sqrt','algebra','sequence','word_hard','word_genius','geo_area','log_simple'] },
    { from:101, to:200, label:'عبقري',   diff:'genius', nMin:100,nMax:9999,mMin:10,mMax:50, ops:['mul','div','percent','fraction_mul','fraction_add','power','sqrt','algebra','sequence','word_genius','geo_area','log_simple','equation_quad'] }
];

function _getLevelConfig() {
    var level = (typeof st !== 'undefined') ? (st.level || 1) : 1;
    var phase = LEVEL_PHASES[LEVEL_PHASES.length - 1];
    for (var i = 0; i < LEVEL_PHASES.length; i++) {
        if (level >= LEVEL_PHASES[i].from && level <= LEVEL_PHASES[i].to) {
            phase = LEVEL_PHASES[i];
            break;
        }
    }
    var span = Math.max(1, phase.to - phase.from);
    var progress = Math.min(1, (level - phase.from) / span);
    var nMax = Math.round(phase.nMin + (phase.nMax - phase.nMin) * progress);
    var mMax = Math.round(phase.mMin + (phase.mMax - phase.mMin) * progress);
    var opsCount = Math.round(2 + (phase.ops.length - 2) * progress);
    opsCount = Math.max(2, Math.min(phase.ops.length, opsCount));
    var ops = phase.ops.slice(0, opsCount);
    return { level: level, diff: phase.diff, label: phase.label, nMin: phase.nMin, nMax: nMax, mMin: phase.mMin, mMax: mMax, ops: ops, progress: progress };
}

var _DIFF_ORDER = ['easy', 'medium', 'hard', 'genius'];

function _resolveActualDiff(op, baseDiff) {
    var lvlDiff = baseDiff || 'easy';
    var playerDiff = (typeof st !== 'undefined' && st.difficulty) ? st.difficulty : 'easy';
    var aiDiff = (typeof AdaptiveAI !== 'undefined') ? AdaptiveAI.getDiff(op, lvlDiff) : lvlDiff;
    var scores = [lvlDiff, playerDiff, aiDiff].map(function(d) { return _DIFF_ORDER.indexOf(d); });
    return _DIFF_ORDER[Math.max.apply(null, scores)];
}

/* ═══════════════════════════════════════════════════════════════
   ② الذكاء الاصطناعي التكيّفي
═══════════════════════════════════════════════════════════════ */

var AdaptiveAI = (function() {
    var _perf = {};
    var UP = 0.82;
    var DOWN = 0.42;
    var STEP = 5;
    function _get(op) {
        if (!_perf[op]) _perf[op] = { correct: 0, total: 0, diffIdx: 1 };
        return _perf[op];
    }
    function record(op, ok) {
        var p = _get(op || 'mix');
        p.total++;
        if (ok) p.correct++;
        if (p.total % STEP === 0) {
            var rate = p.correct / p.total;
            if (rate >= UP && p.diffIdx < _DIFF_ORDER.length - 1) p.diffIdx++;
            else if (rate <= DOWN && p.diffIdx > 0) p.diffIdx--;
        }
    }
    function getDiff(op, base) {
        var p = _get(op || 'mix');
        var bIdx = _DIFF_ORDER.indexOf(base || 'easy');
        if (bIdx < 0) bIdx = 0;
        return _DIFF_ORDER[Math.max(bIdx, p.diffIdx)];
    }
    function reset() { _perf = {}; }
    return { record: record, getDiff: getDiff, reset: reset };
})();

/* ═══════════════════════════════════════════════════════════════
   ③ ذاكرة الجلسة — لا تكرار
═══════════════════════════════════════════════════════════════ */

var _sessionMem = new Set();
var _MEM_LIMIT = 400;

function clearSessionMemory() { _sessionMem.clear(); }
function _fp(q) { return (q.text || '') + '§' + q.answer; }
function _seen(q) { return _sessionMem.has(_fp(q)); }
function _remember(q) {
    _sessionMem.add(_fp(q));
    if (_sessionMem.size > _MEM_LIMIT) _sessionMem.delete(_sessionMem.values().next().value);
}

/* ═══════════════════════════════════════════════════════════════
   الدالة الرئيسية — توليد سؤال ذكي مرتبط بالمستوى
═══════════════════════════════════════════════════════════════ */

function genSmartQ(op, baseDiff) {
    try {
        var cfg = _getLevelConfig();
        var diff = _resolveActualDiff(op, baseDiff || cfg.diff);
        var age = (typeof st !== 'undefined') ? (st.age || _calcAge((st||{}).birthDate)) : 0;
        if (age > 0 && age <= 9) diff = 'easy';
        if (age > 0 && age <= 12 && (diff === 'hard' || diff === 'genius')) diff = 'medium';
        var actualOp = op;
        if (op === 'mix') actualOp = _pickOp(cfg, diff, age);
        var q, tries = 0;
        do {
            q = _build(actualOp, diff, cfg, age);
            if (!q || typeof q.answer === 'undefined') {
                q = { text: "5 + 3", hint: "اجمع", answer: 8, explanation: "5+3=8", catKey: "addition", choices: [] };
                break;
            }
            tries++;
            if (!_seen(q)) break;
            if (tries >= 30) { clearSessionMemory(); break; }
        } while (true);
        q.choices = _smartChoices(q.answer, actualOp, diff);
        if (!q.choices || q.choices.length < 4) {
            q.choices = shuffle([q.answer, q.answer+1, q.answer-1, q.answer+2]);
        }
        return q;
    } catch(e) {
        console.error("genSmartQ error:", e);
        return { text: "4 + 6", hint: "اجمع", answer: 10, choices: [10,9,11,8], explanation: "4+6=10", catKey: "addition" };
    }
}

function _pickOp(cfg, diff, age) {
    if (age > 0 && age <= 9) return ['add','sub'][rnd(0,1)];
    if (age > 0 && age <= 11) return ['add','sub','mul'][rnd(0,2)];
    var ops = cfg.ops;
    if (cfg.level <= 6) {
        var basicPool = ['add','add','sub','sub','mul'].filter(function(o) { return ops.indexOf(o) >= 0; });
        if (basicPool.length > 0 && rnd(0,2) === 0) return basicPool[rnd(0,basicPool.length-1)];
    }
    return ops[rnd(0, ops.length - 1)];
}

function _calcAge(bd) {
    if (!bd) return 0;
    var t = new Date(), b = new Date(bd);
    var a = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
    return Math.max(0, a);
}

/* ═══════════════════════════════════════════════════════════════
   بناء السؤال — مع حماية من الأخطاء
═══════════════════════════════════════════════════════════════ */

function _build(op, diff, cfg, age) {
    try {
        var nMin = cfg.nMin, nMax = cfg.nMax;
        var mMin = cfg.mMin, mMax = cfg.mMax;
        var a, b, c, ans, text, hint, explanation, catKey;

        switch (op) {
            case 'add':
                a = rnd(nMin, nMax);
                b = rnd(nMin, nMax);
                ans = a + b;
                text = diff === 'genius' ? `${a.toLocaleString('ar')} + ${b.toLocaleString('ar')}` : `${a} + ${b}`;
                hint = 'اجمع العددين';
                explanation = `${a} + ${b} = ${ans}`;
                if (diff !== 'easy') explanation += `\nتحقق: ${ans} − ${b} = ${a} ✓`;
                catKey = 'addition';
                break;
            case 'sub':
                a = rnd(nMin, nMax);
                b = rnd(nMin, nMax);
                if (a < b) { var tmp = a; a = b; b = tmp; }
                ans = a - b;
                text = `${a} − ${b}`;
                hint = 'اطرح العددين';
                explanation = `${a} − ${b} = ${ans}`;
                catKey = 'subtraction';
                break;
            case 'mul':
                a = rnd(mMin, mMax);
                b = rnd(mMin, mMax);
                ans = a * b;
                text = `${a} × ${b}`;
                hint = 'اضرب العددين';
                if (a <= 12 && b <= 12) {
                    explanation = `${a} × ${b} = ${ans}\n(جدول الضرب)`;
                } else {
                    var t1 = a * Math.floor(b/10) * 10;
                    var t2 = a * (b % 10);
                    explanation = `${a} × ${b}\n= ${a}×${Math.floor(b/10)*10} + ${a}×${b%10}\n= ${t1} + ${t2} = ${ans}`;
                }
                catKey = 'multiplication';
                break;
            case 'div':
                ans = rnd(mMin, mMax);
                b = rnd(mMin, mMax);
                a = ans * b;
                text = `${a} ÷ ${b}`;
                hint = 'القسمة عكس الضرب';
                explanation = `${a} ÷ ${b} = ${ans}\nلأن ${ans} × ${b} = ${a} ✓`;
                catKey = 'division';
                break;
            case 'percent':
                var pctPool = diff === 'easy' ? [10,25,50] : diff === 'medium' ? [10,20,25,50,75] : [5,10,15,20,25,30,40,50,75,80];
                var pct = pctPool[rnd(0, pctPool.length-1)];
                var base = rnd(2, Math.min(20, Math.floor(nMax/10))) * 10;
                ans = Math.round(base * pct / 100);
                text = `${pct}% من ${base}`;
                hint = `اضرب ${base} في ${pct}/100`;
                explanation = `${pct}% من ${base} = ${base} × ${pct}/100 = ${ans}`;
                if (pct === 10) explanation += `\n💡 ${pct}% = اقسم على 10`;
                if (pct === 50) explanation += `\n💡 ${pct}% = اقسم على 2`;
                if (pct === 25) explanation += `\n💡 ${pct}% = اقسم على 4`;
                catKey = 'percentage';
                break;
            case 'power':
                a = diff === 'easy' ? rnd(2, Math.min(5, mMax)) : diff === 'medium' ? rnd(2, Math.min(8, mMax)) : rnd(2, Math.min(12, mMax));
                b = diff === 'easy' ? 2 : diff === 'medium' ? rnd(2,3) : rnd(2,4);
                ans = Math.pow(a, b);
                text = `${a}^${b}`;
                hint = `اضرب ${a} في نفسه ${b} مرات`;
                var steps = [];
                for (var i = 0; i < b; i++) steps.push(a);
                explanation = `${a}^${b} = ${steps.join(' × ')} = ${ans}`;
                catKey = 'algebra';
                break;
            case 'sqrt':
                var sqPools = { easy: [4,9,16,25,36,49], medium: [4,9,16,25,36,49,64,81,100], hard: [4,9,16,25,36,49,64,81,100,121,144,169,196,225], genius: [4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400] };
                a = (sqPools[diff] || sqPools.medium)[rnd(0, (sqPools[diff]||sqPools.medium).length-1)];
                ans = Math.round(Math.sqrt(a));
                text = `√${a}`;
                hint = `أي عدد × نفسه = ${a}؟`;
                explanation = `√${a} = ${ans}\nلأن ${ans} × ${ans} = ${ans*ans} = ${a} ✓`;
                catKey = 'algebra';
                break;
            case 'equation_simple':
                a = rnd(Math.max(2, nMin), Math.min(nMax, 50));
                ans = rnd(1, Math.min(nMax, 40));
                b = a + ans;
                text = `س + ${a} = ${b}`;
                hint = 'انقل الثابت للطرف الآخر';
                explanation = `س + ${a} = ${b}\nس = ${b} − ${a} = ${ans}\nتحقق: ${ans} + ${a} = ${b} ✓`;
                catKey = 'algebra';
                break;
            case 'algebra':
                var coef = rnd(2, diff === 'genius' ? 9 : diff === 'hard' ? 7 : 5);
                ans = rnd(1, diff === 'genius' ? 20 : 12);
                a = rnd(1, 20);
                b = coef * ans + a;
                text = `${coef}س + ${a} = ${b}`;
                hint = 'أولاً اطرح الثابت، ثم اقسم على المعامل';
                explanation = `${coef}س + ${a} = ${b}\n${coef}س = ${b} − ${a} = ${b-a}\nس = ${b-a} ÷ ${coef} = ${ans}\nتحقق: ${coef}×${ans}+${a} = ${b} ✓`;
                catKey = 'algebra';
                break;
            case 'equation_quad':
                ans = rnd(2, 15);
                a = ans * ans;
                text = `س² = ${a}`;
                hint = 'خذ الجذر التربيعي للطرفين';
                explanation = `س² = ${a}\nس = √${a} = ${ans}\n(نأخذ القيمة الموجبة)`;
                catKey = 'algebra';
                break;
            case 'sequence':
                var seqType = rnd(0, diff === 'easy' ? 0 : 1);
                if (seqType === 0) {
                    a = rnd(1, Math.min(20, nMax));
                    b = rnd(2, diff === 'easy' ? 5 : diff === 'medium' ? 10 : 20);
                    text = `${a}, ${a+b}, ${a+2*b}, ${a+3*b}, ؟`;
                    ans = a + 4 * b;
                    hint = `الفرق الثابت = ${b}`;
                    explanation = `متتالية حسابية، الفرق = ${b}\nالحد التالي = ${a+3*b} + ${b} = ${ans}`;
                } else {
                    var ratio = rnd(2, diff === 'hard' ? 5 : 3);
                    a = rnd(1, 5);
                    text = `${a}, ${a*ratio}, ${a*ratio*ratio}, ؟`;
                    ans = a * ratio * ratio * ratio;
                    hint = `كل حد يُضرب في ${ratio}`;
                    explanation = `متتالية هندسية، الأساس = ${ratio}\nالحد التالي = ${a*ratio*ratio} × ${ratio} = ${ans}`;
                }
                catKey = 'puzzles';
                break;
            case 'fraction_simple':
                var den = rnd(3, diff === 'easy' ? 6 : 10);
                var n1 = rnd(1, den-1);
                var n2 = rnd(1, den-n1 > 0 ? den-n1 : 1);
                ans = n1 + n2;
                text = `${n1}/${den} + ${n2}/${den}`;
                hint = 'المقامات متساوية، اجمع البسطين فقط';
                explanation = `${n1}/${den} + ${n2}/${den} = (${n1}+${n2})/${den} = ${ans}/${den}`;
                if (ans % den === 0) explanation += ` = ${ans/den}`;
                catKey = 'division';
                break;
            case 'fraction_add':
                var d1 = rnd(2,6), d2 = rnd(2,6);
                while (d2 === d1) d2 = rnd(2,6);
                var lcm = (d1 * d2) / _gcd(d1, d2);
                var num1 = rnd(1, d1-1), num2 = rnd(1, d2-1);
                var rN = num1*(lcm/d1) + num2*(lcm/d2);
                var g = _gcd(rN, lcm);
                ans = Math.round(rN/lcm * 100) / 100;
                text = `${num1}/${d1} + ${num2}/${d2}`;
                hint = `أوجد المقام المشترك: ${lcm}`;
                explanation = `${num1}/${d1} + ${num2}/${d2}\nالمقام المشترك = ${lcm}\n= ${num1*(lcm/d1)}/${lcm} + ${num2*(lcm/d2)}/${lcm} = ${rN}/${lcm}`;
                if (g > 1) explanation += ` = ${rN/g}/${lcm/g}`;
                catKey = 'division';
                break;
            case 'fraction_mul':
                var fn1 = rnd(1,6), fd1 = rnd(2,8), fn2 = rnd(1,6), fd2 = rnd(2,8);
                var np = fn1*fn2, dp = fd1*fd2;
                var fg = _gcd(np,dp);
                ans = Math.round(np/dp * 100) / 100;
                text = `${fn1}/${fd1} × ${fn2}/${fd2}`;
                hint = 'اضرب البسطَين معاً والمقامَين معاً';
                explanation = `${fn1}/${fd1} × ${fn2}/${fd2} = ${np}/${dp}`;
                if (fg > 1) explanation += ` = ${np/fg}/${dp/fg}`;
                explanation += ` ≈ ${ans}`;
                catKey = 'division';
                break;
            case 'log_simple':
                ans = rnd(1, diff === 'hard' ? 5 : 3);
                text = `log₁₀(10^${ans})`;
                hint = 'log₁₀(10^ن) = ن دائماً';
                explanation = `log₁₀(10^${ans}) = ${ans}\nلأن القاعدة (10) تُلغي الأسية (10^${ans})`;
                catKey = 'algebra';
                break;
            case 'word_add':
                var wNames = ['أحمد','سارة','خالد','ليلى','محمد','هند'];
                var wItems = ['تفاحة','كتاب','قلم','لعبة','بطاقة','ورقة'];
                var wn = wNames[rnd(0,wNames.length-1)];
                var wi = wItems[rnd(0,wItems.length-1)];
                a = rnd(nMin, nMax); b = rnd(nMin, nMax);
                ans = a + b;
                text = `لدى ${wn} ${a} ${wi}، حصل على ${b} ${wi} أخرى. كم ${wi} لديه؟`;
                hint = 'جمع بسيط';
                explanation = `البداية: ${a}\nأُضيف: ${b}\nالمجموع: ${a} + ${b} = ${ans}`;
                catKey = 'wordproblems';
                break;
            case 'word_mul':
                a = rnd(mMin, Math.min(mMax, 15));
                b = rnd(mMin, Math.min(mMax, 15));
                ans = a * b;
                var ctxs = [
                    { t:`ثمن القلم ${a} دينار. ثمن ${b} قلم = ؟`, e:`${b} × ${a} = ${ans} دينار` },
                    { t:`ملعب طوله ${a}م وعرضه ${b}م. مساحته = ؟`, e:`${a} × ${b} = ${ans} م²` },
                    { t:`${a} صندوق، في كل صندوق ${b} تفاحة. المجموع = ؟`, e:`${a} × ${b} = ${ans} تفاحة` }
                ];
                var ctx = ctxs[rnd(0,ctxs.length-1)];
                text = ctx.t;
                hint = 'مسألة ضرب';
                explanation = ctx.e;
                catKey = 'wordproblems';
                break;
            case 'word_hard':
                a = rnd(Math.max(nMin,20), Math.min(nMax,100));
                b = rnd(5, Math.floor(a/2));
                c = rnd(2, Math.min(mMax,8));
                ans = (a - b) * c;
                text = `كان لدى محمد ${a} كتاباً، أعاد ${b}، ثم ضاعف الباقي ${c} مرات. كم كتاباً الآن؟`;
                hint = 'أولاً اطرح، ثم اضرب';
                explanation = `الخطوة 1: ${a} − ${b} = ${a-b}\nالخطوة 2: ${a-b} × ${c} = ${ans}`;
                catKey = 'wordproblems';
                break;
            case 'word_genius':
                a = rnd(100, Math.min(nMax, 500));
                b = rnd(10, 50);
                c = rnd(2, 5);
                var d4 = rnd(5, 20);
                ans = (a - b) * c + d4;
                text = `بدأ بـ${a}، خسر ${b}، ضاعف الباقي ${c} مرات، ثم أضاف ${d4}. النتيجة = ؟`;
                hint = 'اتبع الترتيب: طرح، ضرب، جمع';
                explanation = `الخطوة 1: ${a} − ${b} = ${a-b}\nالخطوة 2: ${a-b} × ${c} = ${(a-b)*c}\nالخطوة 3: ${(a-b)*c} + ${d4} = ${ans}`;
                catKey = 'wordproblems';
                break;
            case 'geo_area':
                var geoShapes = diff === 'easy' ? ['square'] : diff === 'medium' ? ['square','rect','triangle'] : ['square','rect','triangle','circle'];
                var sh = geoShapes[rnd(0, geoShapes.length-1)];
                if (sh === 'square') {
                    a = rnd(3, Math.min(20, mMax));
                    ans = a * a;
                    text = `مساحة مربع ضلعه ${a}`;
                    hint = 'المساحة = الضلع²';
                    explanation = `${a} × ${a} = ${ans}`;
                } else if (sh === 'rect') {
                    a = rnd(3, Math.min(20, mMax));
                    b = rnd(3, Math.min(20, mMax));
                    ans = a * b;
                    text = `مساحة مستطيل طوله ${a} وعرضه ${b}`;
                    hint = 'المساحة = الطول × العرض';
                    explanation = `${a} × ${b} = ${ans}`;
                } else if (sh === 'triangle') {
                    a = rnd(4, Math.min(20, mMax));
                    b = rnd(3, Math.min(16, mMax));
                    ans = Math.round(a * b / 2);
                    text = `مساحة مثلث قاعدته ${a} وارتفاعه ${b}`;
                    hint = 'المساحة = ½ × القاعدة × الارتفاع';
                    explanation = `½ × ${a} × ${b} = ${a*b}/2 = ${ans}`;
                } else {
                    a = rnd(2, Math.min(10, mMax));
                    ans = Math.round(Math.PI * a * a);
                    text = `مساحة دائرة نصف قطرها ${a} (π≈3.14)`;
                    hint = 'المساحة = π × نق²';
                    explanation = `3.14 × ${a}² = 3.14 × ${a*a} ≈ ${ans}`;
                }
                catKey = 'geometry';
                break;
            default:
                a = rnd(nMin, nMax);
                b = rnd(nMin, nMax);
                ans = a + b;
                text = `${a} + ${b}`;
                hint = 'اجمع';
                explanation = `${a} + ${b} = ${ans}`;
                catKey = 'addition';
        }
        return { text: text, hint: hint, answer: ans, explanation: explanation, catKey: catKey || 'addition', choices: [] };
    } catch(e) {
        console.error("_build error for op:", op, e);
        return { text: "7 + 4", hint: "اجمع", answer: 11, explanation: "7+4=11", catKey: "addition", choices: [] };
    }
}

/* ═══════════════════════════════════════════════════════════════
   ④ خيارات ذكية
═══════════════════════════════════════════════════════════════ */

function _smartChoices(correctAns, op, diff) {
    var ans = typeof correctAns === 'number' ? correctAns : parseFloat(correctAns);
    var wrongs = new Set();
    var safety = 0;
    var cm = _commonMistakes(ans, op);
    cm.forEach(function(m) { if (m !== ans && !isNaN(m)) wrongs.add(m); });
    while (wrongs.size < 3 && safety < 600) {
        safety++;
        var pct = [0.05, 0.10, 0.15, 0.20][rnd(0,3)];
        var delta = Math.max(1, Math.round(Math.abs(ans) * pct));
        var sign = rnd(0,1) ? 1 : -1;
        var candidate = Math.round((ans + sign * delta) * 100) / 100;
        if (candidate !== ans && !isNaN(candidate)) wrongs.add(candidate);
    }
    var extra = 1;
    while (wrongs.size < 3) { wrongs.add(Math.round((ans + extra * 3) * 100) / 100); extra++; }
    return shuffle([ans, ...[...wrongs].slice(0,3)]);
}

function _commonMistakes(ans, op) {
    var r = [];
    switch (op) {
        case 'mul': r = [ans + 10, ans - 10, Math.round(ans * 1.1), ans + (ans % 10 === 0 ? 5 : -ans%10)]; break;
        case 'div': r = [ans + 1, ans - 1, ans + 2, Math.round(ans * 1.5)]; break;
        case 'percent': r = [Math.round(ans * 10), Math.round(ans / 10), ans * 2, ans - ans/2]; break;
        case 'power': r = [ans + 1, ans - 1, Math.round(ans * 0.8), ans * 2]; break;
        case 'sqrt': r = [ans + 1, ans - 1, ans + 2, ans * 2]; break;
        case 'fraction_add': case 'fraction_simple': case 'fraction_mul': r = [Math.round((ans+0.5)*10)/10, Math.round((ans-0.5)*10)/10, ans*2, Math.round(ans/2*10)/10]; break;
        case 'algebra': case 'equation_simple': case 'equation_quad': r = [ans + 1, ans - 1, ans * 2, ans + 2]; break;
        case 'sequence': r = [ans + 1, ans - 1, ans * 2, Math.round(ans * 0.75)]; break;
        case 'geo_area': r = [ans * 2, Math.round(ans / 2), ans + 10, ans - 10]; break;
        default: r = [ans + rnd(1,3), ans - rnd(1,3), ans + rnd(4,9)];
    }
    return r.filter(function(m) { return typeof m === 'number' && !isNaN(m) && m !== ans; });
}

function _gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
}

/* ═══════════════════════════════════════════════════════════════
   شرح تفاعلي
═══════════════════════════════════════════════════════════════ */

function showSmartExplanation(explanation, correctAnswer) {
    var area = document.getElementById('explanationArea');
    if (!area) return;
    var lines = (explanation || ('الجواب: ' + correctAnswer)).split('\n').filter(function(l) { return l.trim(); });
    var html = lines.map(function(line, i) {
        if (i === 0) return '<div class="exp-main">' + line + '</div>';
        if (line.indexOf('✓') >= 0) return '<div class="exp-verify">✅ ' + line + '</div>';
        if (line.match(/^الخطوة|^[①②③④⑤]|^\d+[:\-\.]/)) return '<div class="exp-step">➡ ' + line + '</div>';
        if (line.indexOf('💡') >= 0) return '<div class="exp-tip">' + line + '</div>';
        return '<div class="exp-detail">' + line + '</div>';
    }).join('');
    area.innerHTML = '<div class="explanation-box smart-explanation"><div class="exp-answer">الإجابة الصحيحة: <strong>' + correctAnswer + '</strong></div><div class="exp-steps">' + html + '</div></div>';
    if (typeof G !== 'undefined' && G.op) AdaptiveAI.record(G.op, false);
}

function getNextQuestion(op, diff) {
    if (op === 'table' || op === 'laws' || op === 'advanced') {
        if (typeof genQ === 'function') return genQ(op, diff);
    }
    return genSmartQ(op, diff);
}

/* ═══════════════════════════════════════════════════════════════
   CSS الشرح التفاعلي
═══════════════════════════════════════════════════════════════ */

(function() {
    var s = document.createElement('style');
    s.textContent = [
        '.smart-explanation{background:linear-gradient(135deg,rgba(124,58,237,.08),rgba(6,182,212,.08));',
        'border:1.5px solid rgba(124,58,237,.3);border-radius:16px;padding:12px 14px;margin-top:8px;',
        'font-family:"Tajawal",sans-serif;animation:expIn .3s ease;}',
        '@keyframes expIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
        '.exp-answer{font-size:.88em;font-weight:900;color:#ef4444;margin-bottom:8px;padding-bottom:6px;',
        'border-bottom:1px solid rgba(255,255,255,.1);}',
        '.exp-answer strong{color:#10b981;font-size:1.05em;}',
        '.exp-steps{display:flex;flex-direction:column;gap:4px;}',
        '.exp-main{font-size:.82em;font-weight:700;color:var(--text,#e2e8f0);}',
        '.exp-step{font-size:.78em;color:var(--accent2,#06b6d4);font-weight:600;}',
        '.exp-detail{font-size:.75em;color:var(--text2,#94a3b8);}',
        '.exp-verify{font-size:.75em;color:#10b981;font-weight:700;}',
        '.exp-tip{font-size:.75em;color:var(--gold,#f0b90b);font-weight:600;}'
    ].join('');
    document.head.appendChild(s);
})();
