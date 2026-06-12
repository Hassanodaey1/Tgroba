/* ═══════════════════════════════════════════════════════════════
   HO Math — محرك الأسئلة الذكي v4.0
   © 2026 Hassan Odaey

   التحسينات الجديدة:
     ① تصاعد الصعوبة داخل الجلسة — تدريجي وسلس
     ② مكافحة تكرار الأسئلة — بصمة ذكية قوية
     ③ تنويع الأسئلة والإجابات — خوارزمية متطورة
     ④ مستويات التحدي تعمل كتحدي حقيقي للاعب
     ⑤ AdaptiveAI محسّن مع نافذة منزلقة حقيقية
═══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════
   ① خريطة المستويات الدقيقة
   200 مستوى — 10 مراحل — انتقال سلس
═══════════════════════════════════════════════════════════════ */

var LEVEL_PHASES = [
    { from:  1, to:  3, label:'مبتدئ',  diff:'easy',
      nMin:1,  nMax_start:9,   nMax_end:10,  mMin:2, mMax:5,
      ops:['add','sub'] },

    { from:  4, to:  6, label:'ناشئ',   diff:'easy',
      nMin:1,  nMax_start:12,  nMax_end:20,  mMin:2, mMax:9,
      ops:['add','sub','mul'] },

    { from:  7, to: 10, label:'متطور',  diff:'easy',
      nMin:5,  nMax_start:20,  nMax_end:30,  mMin:2, mMax:12,
      ops:['add','sub','mul','div'] },

    { from: 11, to: 15, label:'متوسط',  diff:'medium',
      nMin:10, nMax_start:35,  nMax_end:50,  mMin:3, mMax:12,
      ops:['add','sub','mul','div','percent','word_add','word_mul'] },

    { from: 16, to: 22, label:'متقدم',  diff:'medium',
      nMin:15, nMax_start:55,  nMax_end:80,  mMin:3, mMax:15,
      ops:['add','sub','mul','div','percent','equation_simple','fraction_simple','sequence','word_add','word_mul'] },

    { from: 23, to: 30, label:'ماهر',   diff:'medium',
      nMin:20, nMax_start:80,  nMax_end:120, mMin:4, mMax:18,
      ops:['mul','div','percent','equation_simple','fraction_simple','fraction_add','power','sqrt','sequence','word_hard'] },

    { from: 31, to: 45, label:'صعب',    diff:'hard',
      nMin:30, nMax_start:150, nMax_end:300, mMin:5, mMax:22,
      ops:['mul','div','percent','fraction_add','power','sqrt','algebra','sequence','word_hard','geo_area'] },

    { from: 46, to: 65, label:'خبير',   diff:'hard',
      nMin:50, nMax_start:350, nMax_end:600, mMin:7, mMax:28,
      ops:['mul','div','percent','fraction_add','fraction_mul','power','sqrt','algebra','sequence','word_hard','geo_area','log_simple'] },

    { from: 66, to:100, label:'محترف',  diff:'hard',
      nMin:80, nMax_start:600, nMax_end:999, mMin:8, mMax:35,
      ops:['mul','div','percent','fraction_mul','fraction_add','power','sqrt','algebra','sequence','word_hard','word_genius','geo_area','log_simple'] },

    { from:101, to:200, label:'عبقري',  diff:'genius',
      nMin:100,nMax_start:2000,nMax_end:9999,mMin:10,mMax:50,
      ops:['mul','div','percent','fraction_mul','fraction_add','power','sqrt','algebra','sequence','word_genius','geo_area','log_simple','equation_quad'] }
];


/* ═══════════════════════════════════════════════════════════════
   استيفاء إعدادات المستوى الحالي
═══════════════════════════════════════════════════════════════ */

function _getLevelConfig() {
    var level = (typeof st !== 'undefined') ? (st.level || 1) : 1;
    var phase = LEVEL_PHASES[LEVEL_PHASES.length - 1];
    for (var i = 0; i < LEVEL_PHASES.length; i++) {
        if (level >= LEVEL_PHASES[i].from && level <= LEVEL_PHASES[i].to) {
            phase = LEVEL_PHASES[i];
            break;
        }
    }
    var span     = Math.max(1, phase.to - phase.from);
    var progress = Math.min(1, (level - phase.from) / span);
    var nMaxStart = phase.nMax_start || Math.max(phase.nMin + 9, Math.round(phase.nMin * 2));
    var nMaxEnd   = phase.nMax_end   || phase.nMax_start || (phase.nMin + 9);
    var nMax = Math.round(nMaxStart + (nMaxEnd - nMaxStart) * progress);
    nMax = Math.max(nMax, phase.nMin + 9);
    var mMax = Math.round(phase.mMin + (phase.mMax - phase.mMin) * progress);
    var opsCount = Math.round(2 + (phase.ops.length - 2) * progress);
    opsCount     = Math.max(2, Math.min(phase.ops.length, opsCount));
    var ops      = phase.ops.slice(0, opsCount);
    return {
        level: level, diff: phase.diff, label: phase.label,
        nMin: phase.nMin, nMax: nMax, mMin: phase.mMin, mMax: mMax,
        ops: ops, progress: progress
    };
}

var _DIFF_ORDER = ['easy', 'medium', 'hard', 'genius'];

function _resolveActualDiff(op, baseDiff, strict) {
    var lvlDiff = baseDiff || 'easy';
    if (strict) return lvlDiff;
    var playerDiff = (typeof st !== 'undefined' && st.difficulty) ? st.difficulty : 'easy';
    var aiDiff     = (typeof AdaptiveAI !== 'undefined') ? AdaptiveAI.getDiff(op, lvlDiff) : lvlDiff;
    var scores = [lvlDiff, playerDiff, aiDiff].map(function(d){ return _DIFF_ORDER.indexOf(d); });
    return _DIFF_ORDER[Math.max.apply(null, scores)];
}


/* ═══════════════════════════════════════════════════════════════
   ① نظام تصاعد الصعوبة داخل الجلسة
   يرفع الصعوبة تدريجياً بناءً على الأداء المتراكم
═══════════════════════════════════════════════════════════════ */

var SessionProgress = (function () {

    /*
     * كل جلسة لعب تبدأ من الصعوبة الأساسية للمستوى
     * ثم تتصاعد تدريجياً بناءً على عدد الإجابات الصحيحة المتتالية
     * وتنزل قليلاً عند الخطأ
     *
     * _heat  : 0.0 → 1.0  (كثافة الصعوبة داخل المستوى الحالي)
     * _streak: عدد الإجابات الصحيحة المتتالية
     */

    var _heat   = 0.0;   /* حرارة الجلسة */
    var _streak = 0;     /* سلسلة صحيحة */
    var _combo  = 0;     /* عداد الكومبو */

    /* عتبات التصاعد */
    var STREAK_UP   = 3;   /* بعد 3 صح متتالية → ارفع الحرارة */
    var HEAT_STEP   = 0.12; /* مقدار الرفع */
    var COOL_STEP   = 0.08; /* مقدار الخفض عند الخطأ */

    function reset() {
        _heat   = 0.0;
        _streak = 0;
        _combo  = 0;
    }

    function onCorrect() {
        _streak++;
        _combo++;
        if (_streak >= STREAK_UP) {
            _heat = Math.min(1.0, _heat + HEAT_STEP);
            _streak = 0; /* إعادة العداد بعد الرفع */
        }
    }

    function onWrong() {
        _streak = 0;
        _combo  = 0;
        _heat   = Math.max(0.0, _heat - COOL_STEP);
    }

    /*
     * احسب الصعوبة الفعلية داخل الجلسة
     * تعيد diff string محسوبة من:
     *   - الصعوبة الأساسية للمستوى (baseDiff)
     *   - حرارة الجلسة (_heat)
     *
     * المبدأ: لا نتجاوز genius، ولا نهبط تحت المستوى المحدد يدوياً
     */
    function getSessionDiff(baseDiff) {
        var baseIdx = _DIFF_ORDER.indexOf(baseDiff || 'easy');
        if (baseIdx < 0) baseIdx = 0;

        /* عند heat > 0.6 → ننتقل للصعوبة التالية */
        var bonus = _heat >= 0.85 ? 2
                  : _heat >= 0.6  ? 1
                  : 0;

        var finalIdx = Math.min(_DIFF_ORDER.length - 1, baseIdx + bonus);
        return _DIFF_ORDER[finalIdx];
    }

    /* تعديل نطاق الأرقام حسب الحرارة (لتنويع الأسئلة أكثر) */
    function applyHeat(cfg) {
        var boost = _heat;
        return {
            nMin: cfg.nMin,
            nMax: Math.round(cfg.nMax  + (cfg.nMax  * 0.4 * boost)),
            mMin: cfg.mMin,
            mMax: Math.round(cfg.mMax  + (cfg.mMax  * 0.3 * boost)),
            ops:  cfg.ops,
            level:    cfg.level,
            diff:     getSessionDiff(cfg.diff),
            label:    cfg.label,
            progress: Math.min(1, cfg.progress + boost * 0.3)
        };
    }

    function getHeat()   { return _heat; }
    function getStreak() { return _streak; }
    function getCombo()  { return _combo; }

    return { reset: reset, onCorrect: onCorrect, onWrong: onWrong,
             getSessionDiff: getSessionDiff, applyHeat: applyHeat,
             getHeat: getHeat, getStreak: getStreak, getCombo: getCombo };
})();

/* استدعاء reset عند بدء كل لعبة جديدة */
window.resetSessionProgress = function () {
    SessionProgress.reset();
    clearSessionMemory();
};


/* ═══════════════════════════════════════════════════════════════
   ② الذكاء الاصطناعي التكيّفي — محسّن
   نافذة منزلقة حقيقية + تعلم أسرع
═══════════════════════════════════════════════════════════════ */

var AdaptiveAI = (function () {
    var UP   = 0.80;  /* عتبة الرفع: 80% صحة */
    var DOWN = 0.45;  /* عتبة الخفض: 45% صحة */
    var STEP = 5;     /* نقيّم بعد كل 5 إجابات */
    var WINDOW = 20;  /* حجم النافذة المنزلقة */

    function _load() {
        try { if (typeof st !== 'undefined' && st._aiPerf) return st._aiPerf; } catch(e) {}
        return {};
    }

    function _save(perf) {
        try {
            if (typeof st !== 'undefined') {
                st._aiPerf = perf;
                if (typeof saveSt === 'function') saveSt();
            }
        } catch(e) {}
    }

    function _get(op) {
        var perf = _load();
        if (!perf[op]) perf[op] = { hist: [], diffIdx: 1 };
        return perf;
    }

    function record(op, ok) {
        var perf = _get(op);
        var key  = op || 'mix';
        if (!perf[key]) perf[key] = { hist: [], diffIdx: 1 };
        var p = perf[key];

        /* نافذة منزلقة: نحتفظ بآخر WINDOW نتيجة فقط */
        if (!p.hist) p.hist = [];
        p.hist.push(ok ? 1 : 0);
        if (p.hist.length > WINDOW) p.hist.shift();

        /* نقيّم كل STEP إجابات */
        if (p.hist.length % STEP === 0) {
            var sum  = p.hist.reduce(function(a,b){ return a+b; }, 0);
            var rate = sum / p.hist.length;

            if (rate >= UP  && p.diffIdx < _DIFF_ORDER.length - 1) p.diffIdx++;
            else if (rate <= DOWN && p.diffIdx > 0)                  p.diffIdx--;
        }

        _save(perf);
    }

    function getDiff(op, base) {
        var perf = _load();
        var key  = op || 'mix';
        var p    = perf[key] || { diffIdx: 1 };
        var bIdx = _DIFF_ORDER.indexOf(base || 'easy');
        if (bIdx < 0) bIdx = 0;
        return _DIFF_ORDER[Math.max(bIdx, p.diffIdx || 0)];
    }

    function reset() {
        try {
            if (typeof st !== 'undefined') { st._aiPerf = {}; if (typeof saveSt === 'function') saveSt(); }
        } catch(e) {}
    }

    return { record: record, getDiff: getDiff, reset: reset };
})();


/* ═══════════════════════════════════════════════════════════════
   ③ ذاكرة الجلسة — مكافحة تكرار متطورة
   بصمة تشمل: نص السؤال + الجواب + النوع (لمنع أشكال مختلفة بنفس الأرقام)
═══════════════════════════════════════════════════════════════ */

var _sessionMem  = new Set();
var _recentOps   = [];   /* آخر 8 عمليات استُخدمت — لتنويع أفضل */
var _MEM_LIMIT   = 600;  /* حد أعلى للذاكرة */

function clearSessionMemory() {
    _sessionMem.clear();
    _recentOps = [];
}

/* بصمة ذكية تمنع التكرار حتى لو اختلفت الصياغة */
function _fp(q) {
    /* نضيف catKey للبصمة لمنع نفس الأرقام في سياقات مختلفة */
    var ans = typeof q.answer === 'number' ? Math.round(q.answer * 1000) / 1000 : q.answer;
    return (q.catKey || '') + '§' + (q.text || '').replace(/\s+/g,'') + '§' + ans;
}

function _seen(q)    { return _sessionMem.has(_fp(q)); }

function _remember(q, op) {
    _sessionMem.add(_fp(q));
    /* تتبع العمليات الأخيرة */
    if (op) {
        _recentOps.push(op);
        if (_recentOps.length > 8) _recentOps.shift();
    }
    /* تنظيف الذاكرة القديمة */
    if (_sessionMem.size > _MEM_LIMIT) {
        var iter = _sessionMem.values();
        for (var i = 0; i < 50; i++) {
            var val = iter.next();
            if (val.done) break;
            _sessionMem.delete(val.value);
        }
    }
}

/* هل العملية ظهرت كثيراً مؤخراً؟ */
function _opOverused(op) {
    if (_recentOps.length < 4) return false;
    var count = _recentOps.filter(function(o){ return o === op; }).length;
    return count >= 3; /* 3 مرات من آخر 8 = كثير */
}


/* ═══════════════════════════════════════════════════════════════
   الدالة الرئيسية — توليد سؤال ذكي مع تصاعد الصعوبة
═══════════════════════════════════════════════════════════════ */

function genSmartQ(op, baseDiff, strict) {
    /* الأنواع المتقدمة تُعالَج مباشرة بـ genQ */
    var _advOps = ['adv_roots','adv_log','adv_geo','adv_eq','adv_seq','adv_trig'];
    if (_advOps.indexOf(op) >= 0) {
        /* نحسب الصعوبة الفعلية قبل التفويض لـ genQ */
        var _advDiff = strict
            ? (baseDiff || 'medium')
            : _resolveActualDiff(op, baseDiff || 'medium', false);
        if (typeof genQ === 'function') return genQ(op, _advDiff);
    }

    var cfg  = _getLevelConfig();

    /* تطبيق تصاعد الجلسة على الإعدادات (إلا في أوضاع strict) */
    var hotCfg = strict ? cfg : SessionProgress.applyHeat(cfg);

    /*
     * الصعوبة الفعلية:
     * strict → تُستخدم كما هي (أوضاع تدير تصعيدها بنفسها)
     * عادي  → أعلى قيمة بين المستوى + اختيار اللاعب + AI + جلسة
     */
    var sessionDiff = strict ? (baseDiff || cfg.diff) : SessionProgress.getSessionDiff(baseDiff || cfg.diff);
    var diff = _resolveActualDiff(op, sessionDiff, strict || false);

    var age = (typeof st !== 'undefined') ? (st.age || _calcAge((st||{}).birthDate)) : 0;
    if (age > 0 && age <= 9)  diff = 'easy';
    if (age > 0 && age <= 12 && (diff === 'hard' || diff === 'genius')) diff = 'medium';

    var actualOp = op;
    if (op === 'mix') actualOp = _pickOp(hotCfg, diff, age);

    /* توليد السؤال مع منع التكرار */
    var q, tries = 0;
    var maxTries = 60;
    do {
        q = _build(actualOp, diff, hotCfg, age);
        tries++;
        /* إذا لم يتكرر → استخدمه */
        if (!_seen(q)) break;
        /* إذا تكررت كثيراً → وسّع النطاق وحاول مجدداً */
        if (tries === 20) {
            hotCfg = _expandRange(hotCfg);
        }
        /* آخر ملاذ: امسح الذاكرة جزئياً */
        if (tries >= maxTries) {
            _partialClearMemory();
            break;
        }
    } while (true);

    _remember(q, actualOp);
    q.choices  = _smartChoices(q.answer, actualOp, diff);
    q._diff    = diff;       /* للاستخدام في المراجعة */
    q._heat    = SessionProgress.getHeat();  /* لعرض مؤشر الحرارة اختيارياً */
    return q;
}

/* توسيع نطاق الأرقام بشكل طارئ لتجنب التكرار */
function _expandRange(cfg) {
    return {
        nMin:  Math.max(1, cfg.nMin - 5),
        nMax:  cfg.nMax  + 30,
        mMin:  Math.max(1, cfg.mMin - 2),
        mMax:  cfg.mMax  + 10,
        ops:   cfg.ops,
        level: cfg.level,
        diff:  cfg.diff,
        label: cfg.label,
        progress: cfg.progress
    };
}

/* مسح جزئي للذاكرة: احذف أقدم 30% */
function _partialClearMemory() {
    var arr    = Array.from(_sessionMem);
    var toDel  = Math.ceil(arr.length * 0.3);
    for (var i = 0; i < toDel; i++) _sessionMem.delete(arr[i]);
}

/* اختيار العملية للوضع المختلط */
function _pickOp(cfg, diff, age) {
    if (age > 0 && age <= 9)  return ['add','sub'][rnd(0,1)];
    if (age > 0 && age <= 11) return ['add','sub','mul'][rnd(0,2)];

    var ops   = cfg.ops.slice();
    var level = cfg.level || 1;

    /* إزالة العمليات المستخدمة مؤخراً كثيراً (تنويع إجباري) */
    var filtered = ops.filter(function(o){ return !_opOverused(o); });
    if (filtered.length >= 2) ops = filtered;

    /* المستويات 1-6: أساسيات فقط */
    if (level <= 6) {
        var basicPool = ['add','add','sub','sub','mul'].filter(function(o){ return ops.indexOf(o) >= 0; });
        if (basicPool.length > 0) return basicPool[rnd(0, basicPool.length-1)];
    }

    /* المستويات 7-15: نسبة متقدمة 20% */
    if (level >= 7 && level <= 15) {
        var advPool7 = ['power','sqrt','equation_simple','percent','sequence'];
        if (rnd(0,4) === 0) {
            var p7 = advPool7.filter(function(o){ return !_opOverused(o); });
            return (p7.length > 0 ? p7 : advPool7)[rnd(0, (p7.length > 0 ? p7 : advPool7).length-1)];
        }
    }

    /* المستويات 16-30: نسبة متقدمة 35% */
    if (level >= 16 && level <= 30) {
        var advPool16 = ['power','sqrt','algebra','equation_simple','percent','sequence','fraction_add','geo_area'];
        if (rnd(0,2) === 0) {
            var p16 = advPool16.filter(function(o){ return !_opOverused(o); });
            return (p16.length > 0 ? p16 : advPool16)[rnd(0, (p16.length > 0 ? p16 : advPool16).length-1)];
        }
    }

    /* المستويات 31+: نسبة متقدمة 50% — نشمل adv_* للمستويات العالية */
    if (level >= 31) {
        /* المستويات 66+: أضف الأنواع المتقدمة الكاملة */
        var advPool31 = level >= 66
            ? ['power','sqrt','algebra','sequence','fraction_add','fraction_mul','geo_area',
               'log_simple','equation_quad','adv_roots','adv_log','adv_geo','adv_eq','adv_seq']
            : ['power','sqrt','algebra','sequence','fraction_add','fraction_mul','geo_area',
               'log_simple','equation_quad'];
        if (rnd(0,1) === 0) {
            var p31 = advPool31.filter(function(o){ return !_opOverused(o); });
            return (p31.length > 0 ? p31 : advPool31)[rnd(0, (p31.length > 0 ? p31 : advPool31).length-1)];
        }
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
   بناء السؤال — تنويع واسع لكل نوع
   كل عملية لها قوالب متعددة مختلفة الأشكال
═══════════════════════════════════════════════════════════════ */

function _build(op, diff, cfg, age) {
    var nMin = cfg.nMin, nMax = cfg.nMax;
    var mMin = cfg.mMin, mMax = cfg.mMax;

    var a, b, c, ans, text, hint, explanation, catKey;

    switch (op) {

        /* ─── جمع — 5 قوالب مختلفة ─── */
        case 'add': {
            a = rnd(nMin, nMax);
            b = rnd(nMin, nMax);
            ans = a + b;
            /* اختر قالباً عشوائياً */
            var addForms = [
                { t: a + ' + ' + b, h: 'اجمع العددين' },
                { t: b + ' + ' + a, h: 'اجمع العددين (الترتيب لا يغير الناتج)' }
            ];
            /* في medium/hard → اجمع 3 أرقام أحياناً */
            if ((diff === 'medium' || diff === 'hard') && rnd(0,3) === 0) {
                c = rnd(nMin, Math.floor(nMax / 2));
                ans = a + b + c;
                text = a + ' + ' + b + ' + ' + c;
                hint = 'اجمع الأعداد الثلاثة';
                explanation = a + ' + ' + b + ' + ' + c + ' = ' + ans;
                catKey = 'addition';
                break;
            }
            var af = addForms[rnd(0, addForms.length - 1)];
            text        = af.t;
            hint        = af.h;
            explanation = a + ' + ' + b + ' = ' + ans;
            if (diff !== 'easy') explanation += '\nتحقق: ' + ans + ' − ' + b + ' = ' + a + ' ✓';
            catKey = 'addition';
            break;
        }

        /* ─── طرح — تنويع في الصياغة والبنية ─── */
        case 'sub': {
            a = rnd(nMin, nMax);
            b = rnd(nMin, nMax);
            if (a < b) { var ts = a; a = b; b = ts; }
            ans = a - b;
            /* قوالب متنوعة */
            var subForms = [
                { t: a + ' − ' + b, h: 'اطرح العددين' },
                { t: a + ' - ' + b, h: 'اطرح العددين' }
            ];
            /* عند صياغة العكسية → الجواب هو نفسه لكن الصياغة أصعب */
            var sf = subForms[rnd(0, diff === 'easy' ? 1 : subForms.length - 1)];
            text        = sf.t;
            hint        = sf.h;
            explanation = a + ' − ' + b + ' = ' + ans;
            catKey      = 'subtraction';
            break;
        }

        /* ─── ضرب — تنويع في البنية والشكل ─── */
        case 'mul': {
            /* تنويع إضافي: اختر مستويات مختلفة */
            var mulVariant = rnd(0, diff === 'easy' ? 1 : 3);
            if (mulVariant === 0) {
                /* ضرب عادي */
                a = rnd(mMin, mMax); b = rnd(mMin, mMax);
                ans = a * b;
                text = a + ' × ' + b;
                hint = 'اضرب العددين';
                if (a <= 12 && b <= 12) {
                    explanation = a + ' × ' + b + ' = ' + ans + '\n(جدول الضرب)';
                } else {
                    var t1m = a * Math.floor(b/10) * 10;
                    var t2m = a * (b % 10);
                    explanation = a + ' × ' + b + '\n= ' + a + '×' + (Math.floor(b/10)*10) + ' + ' + a + '×' + (b%10) + '\n= ' + t1m + ' + ' + t2m + ' = ' + ans;
                }
            } else if (mulVariant === 1) {
                /* ضرب مقلوب */
                a = rnd(mMin, mMax); b = rnd(mMin, mMax);
                ans = a * b;
                text = b + ' × ' + a;
                hint = 'اضرب (الترتيب لا يغير الناتج)';
                explanation = b + ' × ' + a + ' = ' + a + ' × ' + b + ' = ' + ans;
            } else if (mulVariant === 2) {
                /* إكمال المضروب: ؟ × b = ans */
                b = rnd(mMin, Math.min(mMax, 15));
                ans = rnd(mMin, Math.min(mMax, 15));
                var product = ans * b;
                text = '؟ × ' + b + ' = ' + product;
                hint = 'اقسم الناتج على ' + b + ' للحصول على ؟';
                explanation = product + ' ÷ ' + b + ' = ' + ans;
                a = product;
            } else {
                /* ضرب × 10 أو × 100 */
                a = rnd(mMin, Math.min(mMax, 50));
                b = [10, 100, 1000][rnd(0, diff === 'genius' ? 2 : 1)];
                ans = a * b;
                text = a + ' × ' + b;
                hint = 'الضرب في ' + b + ': أضف ' + String(b).length + ' أصفار';
                explanation = a + ' × ' + b + ' = ' + ans;
            }
            catKey = 'multiplication';
            break;
        }

        /* ─── قسمة — تنويع في البنية ─── */
        case 'div': {
            ans = rnd(mMin, mMax);
            b   = rnd(mMin, mMax);
            a   = ans * b;
            var divVariant = rnd(0, diff === 'easy' ? 0 : 1);
            if (divVariant === 0) {
                text = a + ' ÷ ' + b;
                hint = 'اقسم للحصول على الناتج';
            } else {
                text = a + ' / ' + b + ' = ؟';
                hint = 'حوّل إلى قسمة وأوجد الناتج';
            }
            explanation = a + ' ÷ ' + b + ' = ' + ans + '\nتحقق: ' + ans + ' × ' + b + ' = ' + a + ' ✓';
            catKey      = 'division';
            break;
        }

        /* ─── نسبة مئوية — 5 أنواع مختلفة ─── */
        case 'percent': {
            var pctType = rnd(0, diff === 'easy' ? 1 : 4);
            if (pctType === 0) {
                /* أساسي: x% من n */
                var pcts = [10, 20, 25, 50];
                if (diff !== 'easy') pcts = pcts.concat([5, 15, 30, 40, 75]);
                var pct = pcts[rnd(0, pcts.length-1)];
                a = rnd(2, 20) * 10;
                ans = Math.round(a * pct / 100);
                text = pct + '% من ' + a;
                hint = 'اضرب ' + a + ' × ' + pct + ' ÷ 100';
                var tip = pct === 10 ? '💡 10% = اقسم على 10'
                        : pct === 50 ? '💡 50% = اقسم على 2'
                        : pct === 25 ? '💡 25% = اقسم على 4' : '';
                explanation = a + ' × ' + pct + '/100 = ' + ans + (tip ? '\n' + tip : '');
            } else if (pctType === 1) {
                /* كم يساوي بالمئة: (a/b)*100 */
                b = [4, 5, 8, 10, 20][rnd(0, 4)];
                a = rnd(1, b-1);
                ans = Math.round(a / b * 100);
                text = a + '/' + b + ' = ؟%';
                hint = 'اقسم ' + a + ' على ' + b + ' ثم اضرب في 100';
                explanation = '(' + a + ' ÷ ' + b + ') × 100 = ' + ans + '%';
            } else if (pctType === 2) {
                /* العكسي: x% من ؟ = n */
                var pct2 = [10, 20, 25, 50][rnd(0, 3)];
                ans = rnd(2, 20) * 10;
                var result2 = Math.round(ans * pct2 / 100);
                text = pct2 + '% من ؟ = ' + result2;
                hint = 'اقسم ' + result2 + ' على ' + (pct2/100).toFixed(2);
                explanation = '؟ = ' + result2 + ' ÷ ' + (pct2/100) + ' = ' + ans;
            } else if (pctType === 3) {
                /* نسبة زيادة */
                a = rnd(50, 200);
                var incPct = [10, 20, 25, 50][rnd(0,3)];
                ans = Math.round(a * (1 + incPct/100));
                text = a + ' زاد بـ' + incPct + '%. الناتج = ؟';
                hint = 'احسب ' + incPct + '% واجمعها';
                var inc = Math.round(a * incPct / 100);
                explanation = 'الزيادة = ' + inc + '\nالناتج = ' + a + ' + ' + inc + ' = ' + ans;
            } else {
                /* نسبة خصم */
                a = rnd(100, 500);
                var discPct = [10, 20, 25, 30, 50][rnd(0, 4)];
                ans = Math.round(a * (1 - discPct/100));
                text = a + ' دينار بعد خصم ' + discPct + '%. الثمن = ؟';
                hint = 'احسب ' + discPct + '% واطرحها';
                var disc = Math.round(a * discPct / 100);
                explanation = 'الخصم = ' + disc + '\nالثمن = ' + a + ' − ' + disc + ' = ' + ans;
            }
            catKey = 'percentage';
            break;
        }

        /* ─── معادلة بسيطة — 4 أشكال ─── */
        case 'equation_simple': {
            var eqType = rnd(0, diff === 'easy' ? 1 : 3);
            if (eqType === 0) {
                /* س + a = b */
                a = rnd(4, Math.min(50, nMax)); ans = rnd(3, Math.min(40, nMax)); b = a + ans;
                text = 'x + ' + a + ' = ' + b + '، x = ؟';
                hint = 'اطرح ' + a + ' من الطرفين';
                explanation = 'x + ' + a + ' = ' + b + '\nx = ' + b + ' − ' + a + ' = ' + ans;
            } else if (eqType === 1) {
                /* s - a = b */
                ans = rnd(3, Math.min(40, nMax)); a = rnd(2, Math.min(30, nMax));
                b = ans - a; if (b < 0) { ans = a + rnd(1, 20); b = ans - a; }
                text = 'x − ' + a + ' = ' + b + '، x = ؟';
                hint = 'أضف ' + a + ' للطرفين';
                explanation = 'x − ' + a + ' = ' + b + '\nx = ' + b + ' + ' + a + ' = ' + ans;
            } else if (eqType === 2) {
                /* a × س = b */
                a = rnd(2, Math.min(12, mMax)); ans = rnd(2, Math.min(20, mMax)); b = a * ans;
                text = a + 'x = ' + b + '، x = ؟';
                hint = 'اقسم الطرفين على ' + a;
                explanation = a + 'x = ' + b + '\nx = ' + b + ' ÷ ' + a + ' = ' + ans;
            } else {
                /* s/a = b */
                a = rnd(2, Math.min(10, mMax)); ans = rnd(2, Math.min(20, mMax)); b = ans;
                text = 'x ÷ ' + a + ' = ' + b + '، x = ؟';
                hint = 'اضرب الطرفين في ' + a;
                explanation = 'x ÷ ' + a + ' = ' + b + '\nx = ' + b + ' × ' + a + ' = ' + (ans * a);
                ans = ans * a;
            }
            catKey = 'algebra';
            break;
        }

        /* ─── جبر — معادلة خطية خطوتان ─── */
        case 'algebra': {
            var coef = rnd(2, Math.min(8, mMax)); ans = rnd(2, Math.min(20, mMax)); var con = rnd(1, 15);
            b = coef * ans + con;
            text = coef + 'x + ' + con + ' = ' + b + '، x = ؟';
            hint = '① اطرح ' + con + '  ② اقسم على ' + coef;
            explanation = coef + 'x + ' + con + ' = ' + b + '\nالخطوة ①: ' + coef + 'x = ' + (b-con) + '\nالخطوة ②: x = ' + (b-con) + ' ÷ ' + coef + ' = ' + ans;
            catKey = 'algebra';
            break;
        }

        /* ─── كسر بسيط ─── */
        case 'fraction_simple': {
            var fs_den = rnd(2, diff === 'easy' ? 6 : 10);
            var fs_num = rnd(1, fs_den - 1);
            ans = Math.round(fs_num / fs_den * 100) / 100;
            text = fs_num + '/' + fs_den + ' = ؟ (عشري)';
            hint = 'اقسم ' + fs_num + ' على ' + fs_den;
            explanation = fs_num + ' ÷ ' + fs_den + ' = ' + ans;
            catKey = 'fractions';
            break;
        }

        /* ─── جمع كسور — قوالب متنوعة ─── */
        case 'fraction_add': {
            var faType = rnd(0, diff === 'easy' ? 0 : 2);
            if (faType === 0) {
                /* مقامات متساوية */
                var fa_den = rnd(3, 12); var fa_n1 = rnd(1, fa_den-1); var fa_n2 = rnd(1, fa_den-1);
                var fa_sum = fa_n1 + fa_n2;
                if (fa_sum < fa_den) {
                    ans = fa_n1 + '/' + fa_den + ' + ' + fa_n2 + '/' + fa_den;
                    text = ans; ans = fa_sum + '/' + fa_den;
                    hint = 'اجمع البسطين فقط (مقامات متساوية)';
                    explanation = fa_n1 + '/' + fa_den + ' + ' + fa_n2 + '/' + fa_den + ' = ' + ans;
                } else {
                    /* تبسيط */
                    function _gcdFA(x,y){ return y===0?x:_gcdFA(y,x%y); }
                    var _g = _gcdFA(fa_sum, fa_den);
                    var _sn = fa_sum/_g, _sd = fa_den/_g;
                    ans = _sd === 1 ? _sn : (_sn + '/' + _sd);
                    text = fa_n1 + '/' + fa_den + ' + ' + fa_n2 + '/' + fa_den;
                    hint = 'اجمع البسطين ثم بسّط';
                    explanation = fa_n1 + '/' + fa_den + ' + ' + fa_n2 + '/' + fa_den + ' = ' + fa_sum + '/' + fa_den + ' = ' + ans;
                }
            } else if (faType === 1) {
                /* مقامات مختلفة */
                var d1 = rnd(2,5), d2 = rnd(2,5);
                var _sf = 0; while(d2===d1 && _sf<20){ d2=rnd(2,5); _sf++; }
                if (d2===d1) d2 = d1===5?2:d1+1;
                var fn1=rnd(1,d1), fn2=rnd(1,d2);
                function _lcmFA(a,b){ function _g(x,y){return y===0?x:_g(y,x%y);} return a*b/_g(a,b); }
                var lcm=_lcmFA(d1,d2);
                var fnum=fn1*(lcm/d1)+fn2*(lcm/d2);
                function _gcdFA2(x,y){return y===0?x:_gcdFA2(y,x%y);}
                var fg=_gcdFA2(fnum,lcm); var fsn=fnum/fg, fsd=lcm/fg;
                ans = fsd===1 ? fsn : (fsn+'/'+fsd);
                text = fn1+'/'+d1+' + '+fn2+'/'+d2;
                hint = 'أوجد المقام المشترك (' + lcm + ') ثم اجمع';
                explanation = 'المقام المشترك=' + lcm + '\n' + fn1+'/'+d1+'='+fn1*(lcm/d1)+'/'+lcm + '   ' + fn2+'/'+d2+'='+fn2*(lcm/d2)+'/'+lcm + '\nالمجموع=' + fnum+'/'+lcm + (fg>1?'='+ans:'');
            } else {
                /* طرح كسور */
                var d3=rnd(3,10), fn3=rnd(2,d3-1), fn4=rnd(1,fn3-1);
                var fdiff=fn3-fn4;
                function _gcdFA3(x,y){return y===0?x:_gcdFA3(y,x%y);}
                var fg3=_gcdFA3(fdiff,d3); var fdn=fdiff/fg3, fdd=d3/fg3;
                ans = fdd===1 ? fdn : (fdn+'/'+fdd);
                text = fn3+'/'+d3+' − '+fn4+'/'+d3;
                hint = 'اطرح البسطين (مقامات متساوية)';
                explanation = fn3+'/'+d3+' − '+fn4+'/'+d3+' = '+fdiff+'/'+d3+(fg3>1?' = '+ans:'');
            }
            catKey = 'fractions';
            break;
        }

        /* ─── ضرب كسور ─── */
        case 'fraction_mul': {
            var fm_n1=rnd(1,5), fm_d1=rnd(2,7), fm_n2=rnd(1,5), fm_d2=rnd(2,7);
            var fm_np=fm_n1*fm_n2, fm_dp=fm_d1*fm_d2;
            function _gcdFM(x,y){return y===0?x:_gcdFM(y,x%y);}
            var gf=_gcdFM(fm_np,fm_dp);
            var fsn2=fm_np/gf, fsd2=fm_dp/gf;
            ans = fsd2===1 ? fsn2 : (fsn2+'/'+fsd2);
            text = fm_n1+'/'+fm_d1+' × '+fm_n2+'/'+fm_d2;
            hint = 'اضرب البسطين مع بعض، والمقامين مع بعض';
            explanation = '('+fm_n1+'×'+fm_n2+') / ('+fm_d1+'×'+fm_d2+') = '+fm_np+'/'+fm_dp+(gf>1?' = '+ans:'');
            catKey = 'fractions';
            break;
        }

        /* ─── قوى ─── */
        case 'power': {
            var pwType = rnd(0, diff === 'easy' ? 0 : 2);
            if (pwType === 0) {
                /* قوة عادية */
                a = rnd(2, diff === 'genius' ? 12 : 7);
                b = rnd(2, diff === 'easy' ? 2 : 4);
                ans = Math.pow(a, b);
                if (ans > 100000) { a = rnd(2,5); b = rnd(2,3); ans = Math.pow(a,b); }
                text = a + '^' + b;
                hint = 'اضرب ' + a + ' في نفسه ' + b + ' مرات';
                var steps2 = Array.from({length:b}, function(){ return a; }).join(' × ');
                explanation = a + '^' + b + ' = ' + steps2 + ' = ' + ans;
            } else if (pwType === 1) {
                /* قانون الأسس: a^m × a^n */
                a = rnd(2,5); var pm=rnd(1,3), pn=rnd(1,3);
                ans = Math.pow(a, pm+pn);
                text = a+'^'+pm+' × '+a+'^'+pn;
                hint = 'قانون الأسس: اجمع الأسس عند الضرب بنفس القاعدة';
                explanation = a+'^'+pm+' × '+a+'^'+pn+' = '+a+'^'+(pm+pn)+' = '+ans;
            } else {
                /* قوة السالب أو التحدي */
                a = rnd(2, 5); b = rnd(2, 4);
                ans = Math.pow(a, b);
                text = '(' + a + ')^' + b;
                hint = 'اضرب القيمة في نفسها ' + b + ' مرات';
                explanation = '(' + a + ')^' + b + ' = ' + ans;
            }
            catKey = 'algebra';
            break;
        }

        /* ─── جذر تربيعي — متنوع ─── */
        case 'sqrt': {
            var sqType = rnd(0, diff === 'easy' ? 0 : 2);
            if (sqType === 0) {
                var sq = [4,9,16,25,36,49,64,81,100,121,144,169,196,225];
                if (diff === 'easy') sq = sq.slice(0,8);
                a = sq[rnd(0, sq.length-1)];
                ans = Math.sqrt(a);
                text = '√' + a;
                hint = 'أي عدد × نفسه = ' + a + '؟';
                explanation = '√' + a + ' = ' + ans + '\n✓ تحقق: ' + ans + ' × ' + ans + ' = ' + a;
            } else if (sqType === 1) {
                /* √a + √b */
                var sq2 = [4,9,16,25,36,49,64,81,100];
                var sa = sq2[rnd(0,sq2.length-1)], sb = sq2[rnd(0,sq2.length-1)];
                ans = Math.sqrt(sa) + Math.sqrt(sb);
                text = '√' + sa + ' + √' + sb;
                hint = 'احسب كل جذر ثم اجمع';
                explanation = '√' + sa + ' + √' + sb + ' = ' + Math.sqrt(sa) + ' + ' + Math.sqrt(sb) + ' = ' + ans;
            } else {
                /* تبسيط جذر */
                var bases = [{n:50,s:'5√2',v:7.07},{n:72,s:'6√2',v:8.49},{n:75,s:'5√3',v:8.66},{n:98,s:'7√2',v:9.90}];
                var bp = bases[rnd(0,bases.length-1)];
                ans = bp.v;
                text = '√' + bp.n + ' ≈ ؟';
                hint = 'بسّط الجذر ثم قدّر';
                explanation = '√' + bp.n + ' = ' + bp.s + ' ≈ ' + bp.v;
            }
            catKey = 'algebra';
            break;
        }

        /* ─── متتالية — 5 أنواع ─── */
        case 'sequence': {
            var seqType = rnd(0, diff === 'easy' ? 1 : 4);
            if (seqType === 0) {
                var sa2=rnd(1,20), sd2=rnd(2,9);
                text = sa2+'، '+(sa2+sd2)+'، '+(sa2+2*sd2)+'، '+(sa2+3*sd2)+'، ؟';
                ans  = sa2 + 4*sd2;
                hint = 'الفرق الثابت = ' + sd2;
                explanation = 'كل حد يزيد بـ' + sd2 + '، التالي = ' + (sa2+3*sd2) + ' + ' + sd2 + ' = ' + ans;
            } else if (seqType === 1) {
                var sa3=rnd(1,5), sr=rnd(2,4);
                text = sa3+'، '+(sa3*sr)+'، '+(sa3*sr*sr)+'، '+(sa3*sr*sr*sr)+'، ؟';
                ans  = sa3 * Math.pow(sr,4);
                hint = 'كل حد يُضرب في ' + sr;
                explanation = (sa3*sr*sr*sr) + ' × ' + sr + ' = ' + ans;
            } else if (seqType === 2) {
                /* فيبوناتشي */
                var fa2=rnd(1,8), fb2=rnd(fa2, fa2+8);
                var fc=fa2+fb2, fd=fb2+fc, fe=fc+fd;
                text = fa2+'، '+fb2+'، '+fc+'، '+fd+'، ؟';
                ans  = fe;
                hint = 'كل حد = مجموع الحدين السابقين';
                explanation = fc + ' + ' + fd + ' = ' + ans;
            } else if (seqType === 3) {
                /* مربعات */
                var sqBase = rnd(1,4);
                var sqa=[sqBase,sqBase+1,sqBase+2,sqBase+3,sqBase+4].map(function(x){return x*x;});
                text = sqa[0]+'، '+sqa[1]+'، '+sqa[2]+'، '+sqa[3]+'، ؟';
                ans  = sqa[4];
                hint = 'مربعات الأعداد المتتالية';
                explanation = (sqBase+4) + '² = ' + ans;
            } else {
                /* تناقصية */
                var sa4=rnd(60,150), sd4=rnd(7,20);
                text = sa4+'، '+(sa4-sd4)+'، '+(sa4-2*sd4)+'، '+(sa4-3*sd4)+'، ؟';
                ans  = sa4 - 4*sd4;
                hint = 'الفرق الثابت = −' + sd4;
                explanation = (sa4-3*sd4) + ' − ' + sd4 + ' = ' + ans;
            }
            catKey = 'sequences';
            break;
        }

        /* ─── لوغاريتم ─── */
        case 'log_simple': {
            var logVariant = rnd(0, diff === 'easy' ? 0 : 1);
            if (logVariant === 0) {
                /* log₁₀ أساسي */
                ans = rnd(1, diff === 'medium' ? 4 : 3);
                text = 'log₁₀(10^' + ans + ') = ؟';
                hint = 'log₁₀(10^ن) = ن دائماً';
                explanation = 'log₁₀(10^' + ans + ') = ' + ans;
            } else {
                /* قواعد مختلفة */
                var logPairs = [
                    {base:2, n:8,   exp:3, sym:'log₂(8)'},
                    {base:2, n:16,  exp:4, sym:'log₂(16)'},
                    {base:2, n:32,  exp:5, sym:'log₂(32)'},
                    {base:3, n:9,   exp:2, sym:'log₃(9)'},
                    {base:3, n:27,  exp:3, sym:'log₃(27)'},
                    {base:5, n:25,  exp:2, sym:'log₅(25)'},
                    {base:4, n:16,  exp:2, sym:'log₄(16)'},
                    {base:10,n:100, exp:2, sym:'log₁₀(100)'},
                    {base:10,n:1000,exp:3, sym:'log₁₀(1000)'}
                ];
                var lp2 = logPairs[rnd(0, logPairs.length-1)];
                ans = lp2.exp;
                text = lp2.sym + ' = ؟';
                hint = lp2.base + '^x = ' + lp2.n + '، أوجد x';
                explanation = lp2.sym + ' = ' + lp2.exp + '\nلأن ' + lp2.base + '^' + lp2.exp + ' = ' + lp2.n + ' ✓';
            }
            catKey = 'algebra';
            break;
        }

        /* ─── معادلة تربيعية ─── */
        case 'equation_quad': {
            var eqqType = rnd(0, 2);
            if (eqqType === 0) {
                /* س² = n */
                var roots2 = [2,3,4,5,6,7,8,9,10,11,12];
                ans = roots2[rnd(0, roots2.length-1)];
                var n2 = ans * ans;
                text = 'x² = ' + n2 + '، x = ؟';
                hint = 'خذ الجذر التربيعي (القيمة الموجبة)';
                explanation = 'x² = ' + n2 + '\nx = √' + n2 + ' = ' + ans;
            } else if (eqqType === 1) {
                /* س² - a = b */
                ans = rnd(3, 10);
                a = rnd(1, 10);
                var qb = ans * ans - a;
                text = 'x² − ' + a + ' = ' + qb + '، x = ؟';
                hint = 'أضف ' + a + ' للطرفين ثم خذ الجذر';
                explanation = 'x² = ' + (qb+a) + '\nx = √' + (qb+a) + ' = ' + ans;
            } else {
                /* (س + a)² = b² */
                ans = rnd(2, 8);
                a = rnd(1, 5);
                var qb2 = (ans + a) * (ans + a);
                text = '(x + ' + a + ')² = ' + qb2 + '، x = ؟';
                hint = 'خذ الجذر ثم اطرح ' + a;
                explanation = 'x + ' + a + ' = √' + qb2 + ' = ' + (ans+a) + '\nx = ' + (ans+a) + ' − ' + a + ' = ' + ans;
            }
            catKey = 'algebra';
            break;
        }

        /* ─── مسائل كلامية جمع — قاموس واسع ─── */
        case 'word_add': {
            a = rnd(nMin, nMax); b = rnd(nMin, nMax);
            ans = a + b;
            /* 12 سياق مختلف */
            var waAll = [
                { t: 'لدى أحمد ' + a + ' تفاحة واشترى ' + b + ' أخرى. كم تفاحة لديه الآن؟',
                  e: a + ' + ' + b + ' = ' + ans + ' تفاحة' },
                { t: 'في المكتبة ' + a + ' كتاب عربي و' + b + ' كتاب إنجليزي. الإجمالي = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' كتاباً' },
                { t: 'طارت ' + a + ' طيور من شجرة ثم انضمت ' + b + ' أخرى. كم طاراً الآن؟',
                  e: a + ' + ' + b + ' = ' + ans },
                { t: 'سارة جمعت ' + a + ' طابعاً وأعطاها صديقها ' + b + '. معها الآن = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' طابعاً' },
                { t: 'ركب عمر ' + a + ' كم صباحاً و' + b + ' كم مساءً. المجموع = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' كيلومتر' },
                { t: 'في السيارة ' + a + ' لتر بنزين ثم أُضيف ' + b + ' لتر. الإجمالي = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' لتر' },
                { t: 'مدرسة بها ' + a + ' طالب في الصف الأول و' + b + ' في الثاني. المجموع = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' طالباً' },
                { t: 'في حوض السمك ' + a + ' سمكة حمراء و' + b + ' زرقاء. الإجمالي = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' سمكة' },
                { t: 'زرع خالد ' + a + ' شجرة في الربيع و' + b + ' في الخريف. المجموع = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' شجرة' },
                { t: 'كان في الصندوق ' + a + ' دينار ثم أُضيف ' + b + ' دينار. الرصيد = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' دينار' },
                { t: 'أكل يوسف ' + a + ' تمرة صباحاً و' + b + ' مساءً. الإجمالي = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' تمرة' },
                { t: 'في الحديقة ' + a + ' وردة حمراء و' + b + ' صفراء. المجموع = ؟',
                  e: a + ' + ' + b + ' = ' + ans + ' وردة' }
            ];
            var waPick = waAll[rnd(0, waAll.length-1)];
            text = waPick.t; hint = 'اجمع العددين'; explanation = waPick.e;
            catKey = 'wordproblems';
            break;
        }

        /* ─── مسائل كلامية ضرب — قاموس واسع ─── */
        case 'word_mul': {
            a = rnd(mMin, Math.min(mMax, 15));
            b = rnd(mMin, Math.min(mMax, 15));
            ans = a * b;
            var wmAll = [
                { t: 'ثمن القلم ' + a + ' دينار. ما ثمن ' + b + ' قلماً؟',         e: b + ' × ' + a + ' = ' + ans + ' دينار' },
                { t: 'ملعب طوله ' + a + ' م وعرضه ' + b + ' م. مساحته = ؟',         e: a + ' × ' + b + ' = ' + ans + ' م²' },
                { t: a + ' صندوق، في كل صندوق ' + b + ' تفاحة. الإجمالي = ؟',       e: a + ' × ' + b + ' = ' + ans + ' تفاحة' },
                { t: 'سيارة تسير ' + a + ' كم/ساعة. في ' + b + ' ساعات = ؟ كم',     e: a + ' × ' + b + ' = ' + ans + ' كيلومتر' },
                { t: 'ثمن التذكرة ' + a + ' ريال. كم تكلّف ' + b + ' تذكرة؟',       e: b + ' × ' + a + ' = ' + ans + ' ريال' },
                { t: 'مزرعة بها ' + a + ' صفاً، كل صف ' + b + ' شجرة. العدد = ؟',  e: a + ' × ' + b + ' = ' + ans + ' شجرة' },
                { t: 'بنّاء يبني ' + a + ' صفاً يومياً. في ' + b + ' يوم يبني = ؟', e: a + ' × ' + b + ' = ' + ans + ' صفاً' },
                { t: 'لكل طالب ' + a + ' كتب. كم كتاباً يحتاج ' + b + ' طالب؟',   e: a + ' × ' + b + ' = ' + ans + ' كتاباً' }
            ];
            var wmPick = wmAll[rnd(0, wmAll.length-1)];
            text = wmPick.t; hint = 'اضرب العددين'; explanation = wmPick.e;
            catKey = 'wordproblems';
            break;
        }

        /* ─── مسألة كلامية صعبة (خطوتان) — قاموس واسع ─── */
        case 'word_hard': {
            a = rnd(Math.max(nMin,20), Math.min(nMax,120));
            b = rnd(5, Math.floor(a/2));
            c = rnd(2, Math.min(mMax,8));
            ans = (a - b) * c;
            var whAll = [
                { t: 'كان لدى محمد ' + a + ' كتاباً، أعاد ' + b + ' للمكتبة، ثم ضاعف الباقي ' + c + ' مرات. كم كتاباً الآن؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ans },
                { t: 'مصنع أنتج ' + a + ' وحدة، رُدّ ' + b + ' معيبة، تضاعف الباقي ' + c + ' مرات. الإجمالي = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ans },
                { t: 'رصيد ' + a + ' دينار، صُرف ' + b + ' منها، ثم تضاعف ' + c + ' مرات. الرصيد = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ans },
                { t: 'بدأ الفريق بـ' + a + ' نقطة، خسر ' + b + '، ثم تضاعفت ' + c + ' مرات. النقاط = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ans },
                { t: 'حقل فيه ' + a + ' شجرة، قُطع ' + b + '، والباقي يُنتج ' + c + '× الكمية. الإنتاج = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ans }
            ];
            var whPick = whAll[rnd(0, whAll.length-1)];
            text = whPick.t; hint = '① الطرح أولاً  ② ثم الضرب'; explanation = whPick.e;
            catKey = 'wordproblems';
            break;
        }

        /* ─── مسألة كلامية عبقرية (ثلاث خطوات) ─── */
        case 'word_genius': {
            a = rnd(100, Math.min(nMax, 500));
            b = rnd(10, 50);
            c = rnd(2, 5);
            var d5 = rnd(5, 30);
            ans = (a - b) * c + d5;
            var wgAll = [
                { t: 'بدأ بـ' + a + '، خسر ' + b + '، ضاعف الباقي ' + c + ' مرات، ثم أضاف ' + d5 + '. النتيجة = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ' + (a-b) + '×' + c + '=' + ((a-b)*c) + '\n③: +' + d5 + '=' + ans },
                { t: 'مستودع ' + a + ' وحدة، شُحن ' + b + '، تضاعف الباقي ' + c + ' مرات، أُضيف ' + d5 + '. الإجمالي = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ×' + c + '=' + ((a-b)*c) + '\n③: +' + d5 + '=' + ans },
                { t: 'رصيد ' + a + ' ريال، صُرف ' + b + '، ضُوعف ' + c + ' مرات، أُودع ' + d5 + '. الرصيد = ؟',
                  e: '①: ' + a + '−' + b + '=' + (a-b) + '\n②: ×' + c + '=' + ((a-b)*c) + '\n③: +' + d5 + '=' + ans }
            ];
            var wgPick = wgAll[rnd(0, wgAll.length-1)];
            text = wgPick.t; hint = '① طرح  ② ضرب  ③ جمع'; explanation = wgPick.e;
            catKey = 'wordproblems';
            break;
        }

        /* ─── هندسة — 5 أشكال ─── */
        case 'geo_area': {
            var geoShapes = diff === 'easy'
                ? ['square','rect']
                : diff === 'medium'
                ? ['square','rect','triangle','rect']
                : ['square','rect','triangle','circle','trapezoid'];
            var sh = geoShapes[rnd(0, geoShapes.length-1)];
            if (sh === 'square') {
                a = rnd(3, Math.min(25, mMax));
                ans = a * a;
                text = 'مساحة مربع ضلعه ' + a;
                hint = 'المساحة = الضلع²';
                explanation = a + ' × ' + a + ' = ' + ans;
            } else if (sh === 'rect') {
                a = rnd(3, Math.min(25, mMax)); b = rnd(3, Math.min(20, mMax));
                ans = a * b;
                text = 'مساحة مستطيل طوله ' + a + ' وعرضه ' + b;
                hint = 'المساحة = الطول × العرض';
                explanation = a + ' × ' + b + ' = ' + ans;
            } else if (sh === 'triangle') {
                a = rnd(4, Math.min(25, mMax)); b = rnd(3, Math.min(20, mMax));
                ans = Math.round(a * b / 2);
                text = 'مساحة مثلث قاعدته ' + a + ' وارتفاعه ' + b;
                hint = 'المساحة = ½ × القاعدة × الارتفاع';
                explanation = '½ × ' + a + ' × ' + b + ' = ' + ans;
            } else if (sh === 'circle') {
                a = rnd(2, Math.min(12, mMax));
                ans = Math.round(Math.PI * a * a);
                text = 'مساحة دائرة نصف قطرها ' + a + ' (π≈3.14)';
                hint = 'المساحة = π × نق²';
                explanation = '3.14 × ' + a + '² = 3.14 × ' + (a*a) + ' ≈ ' + ans;
            } else {
                /* شبه منحرف */
                a = rnd(4, Math.min(20, mMax)); b = rnd(3, Math.min(15, mMax));
                var h2 = rnd(3, Math.min(12, mMax));
                ans = Math.round((a + b) * h2 / 2);
                text = 'مساحة شبه منحرف قاعدتاه ' + a + ' و' + b + ' وارتفاعه ' + h2;
                hint = 'المساحة = ½ × (ق₁ + ق₂) × الارتفاع';
                explanation = '½ × (' + a + '+' + b + ') × ' + h2 + ' = ' + ans;
            }
            catKey = 'geometry';
            break;
        }

        /* افتراضي: أنواع غير مُعرَّفة في _build → تُفوَّض لـ genQ */
        default: {
            if (typeof genQ === 'function') {
                var _fallbackQ = genQ(op, diff);
                if (_fallbackQ && typeof _fallbackQ.answer !== 'undefined') return _fallbackQ;
            }
            /* الحل الأخير: جمع بسيط */
            a = rnd(nMin, nMax); b = rnd(nMin, nMax);
            ans = a + b;
            text = a + ' + ' + b; hint = 'اجمع'; explanation = a + ' + ' + b + ' = ' + ans;
            catKey = 'addition';
        }
    }

    return {
        text: text || '', hint: hint || '',
        answer: ans, explanation: explanation || '',
        catKey: catKey || 'addition',
        choices: []
    };
}


/* ═══════════════════════════════════════════════════════════════
   ④ خيارات ذكية — محسّنة مع تنويع أعلى
═══════════════════════════════════════════════════════════════ */

function _smartChoices(correctAns, op, diff) {
    /* كسور نصية */
    if (typeof correctAns === 'string' && correctAns.indexOf('/') >= 0) {
        var _fw = _commonMistakes(correctAns, op).filter(function(x){ return x !== correctAns; }).slice(0, 3);
        var _ex = 1;
        while (_fw.length < 3) {
            var _p = correctAns.split('/');
            _fw.push((_p[0] - 0 + _ex) + '/' + _p[1]); _ex++;
        }
        return shuffle([correctAns].concat(_fw.slice(0, 3)));
    }

    var ans    = typeof correctAns === 'number' ? correctAns : parseFloat(correctAns);
    var wrongs = new Set();
    var safety = 0;

    /* أخطاء شائعة حسب النوع */
    var cm = _commonMistakes(ans, op);
    cm.forEach(function(m) {
        var rounded = Math.round(m * 100) / 100;
        if (rounded !== ans && !isNaN(rounded) && isFinite(rounded)) {
            if (ans > 0 && rounded <= 0) return;
            wrongs.add(rounded);
        }
    });

    /* ✅ تنويع استراتيجيات التشتيت */
    while (wrongs.size < 3 && safety < 800) {
        safety++;
        var strategy = safety % 6;  /* 6 استراتيجيات بدلاً من 4 */
        var candidate;
        if (strategy === 0) {
            /* قريب نسبياً ±5-15% */
            var pct3 = [0.05, 0.08, 0.10, 0.12, 0.15][rnd(0,4)];
            var delta3 = Math.max(1, Math.round(Math.abs(ans) * pct3));
            candidate = Math.round((ans + (rnd(0,1) ? delta3 : -delta3)) * 100) / 100;
        } else if (strategy === 1) {
            /* خطأ ثابت صغير ±1,±2,±3 */
            candidate = ans + (rnd(0,1) ? 1 : -1) * rnd(1, 3);
        } else if (strategy === 2) {
            /* خطأ في وحدات العشرات */
            var unitDiff3 = ans % 10;
            candidate = ans - unitDiff3 + rnd(1,9);
        } else if (strategy === 3) {
            /* خطأ تقريب */
            candidate = Math.round(ans / 10) * 10 + rnd(1,9);
        } else if (strategy === 4) {
            /* نسبة 50% من الجواب أو ضعفه */
            candidate = rnd(0,1) ? Math.round(ans * 2) : Math.round(ans / 2);
        } else {
            /* ±5 ثابت */
            candidate = ans + (rnd(0,1) ? 5 : -5);
        }
        candidate = Math.round(candidate * 100) / 100;
        if (candidate !== ans && !isNaN(candidate) && isFinite(candidate)) {
            if (ans > 0 && candidate <= 0) continue;
            if (!wrongs.has(candidate)) wrongs.add(candidate);
        }
    }

    /* ضمان 3 مختلفة */
    var extra2 = 1;
    while (wrongs.size < 3) {
        var fb2 = ans + extra2;
        if (ans > 0 && fb2 <= 0) fb2 = ans + extra2 + Math.abs(ans) + 1;
        wrongs.add(Math.round(fb2 * 100) / 100);
        extra2 += 2;
    }

    return shuffle([ans].concat(Array.from(wrongs).slice(0, 3)));
}

function _commonMistakes(ans, op) {
    var r = [];
    switch (op) {
        case 'mul':
            r = [ans + 10, ans - 10, Math.round(ans * 1.1), ans + (ans%10===0 ? 5 : -ans%10), ans + ans%100];
            break;
        case 'div':
            r = [ans+1, ans-1, Math.round(ans*2), ans+2, Math.round(ans*1.5), ans===0?1:0];
            break;
        case 'sub':
            r = [ans+1, ans-1, ans+10, ans-10, -ans, ans+100];
            break;
        case 'add':
            r = [ans+1, ans-1, ans+10, ans-10, ans+100, ans-100];
            break;
        case 'percent':
            r = [Math.round(ans*10), Math.round(ans/10), ans*2, ans-Math.round(ans/2), ans+10];
            break;
        case 'power':
            r = [ans+1, ans-1, Math.round(ans*0.8), ans*2, ans-2];
            break;
        case 'sqrt':
            r = [ans+1, ans-1, ans+2, ans*2, ans-2];
            break;
        case 'fraction_add': case 'fraction_mul':
            if (typeof ans === 'string' && ans.indexOf('/') >= 0) {
                var _parts = ans.split('/');
                var _n = parseInt(_parts[0]), _d = parseInt(_parts[1]);
                r = [(_n+1)+'/'+_d, (_n>1?(_n-1):(_n+2))+'/'+_d, _n+'/'+(_d+1)];
            } else {
                r = [ans+1, ans>1?ans-1:ans+2, ans+2];
            }
            break;
        case 'algebra': case 'equation_simple': case 'equation_quad':
            r = [ans+1, ans-1, ans*2, ans+2, ans-2, Math.round(ans/2)];
            break;
        case 'sequence':
            r = [ans+1, ans-1, ans*2, Math.round(ans*0.75), ans+5];
            break;
        case 'log_simple':
            r = [ans+1, ans-1, ans*2, Math.round(ans*0.5)].filter(function(v){ return v > 0; });
            break;
        case 'geo_area':
            r = [ans*2, Math.round(ans/2), ans+10, ans-10, Math.round(ans*1.5)];
            break;
        default:
            r = [ans+rnd(1,3), ans-rnd(1,3), ans+rnd(4,9)];
    }
    return r.filter(function(m){ return typeof m==='number' && !isNaN(m) && m!==ans; });
}

function _gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
}


/* ═══════════════════════════════════════════════════════════════
   ⑤ تسجيل إجابة اللاعب في نظامَي التصعيد
═══════════════════════════════════════════════════════════════ */

/*
 * النقطة الوحيدة لتسجيل إجابة اللاعب — تُستدعى من game.js حصراً
 *
 * @param {string}  op          — نوع العملية (add, mul, ...)
 * @param {boolean} isCorrect   — صحيح أم خطأ
 * @param {number}  [respMs]    — وقت الاستجابة بالمللي ثانية (اختياري)
 * @param {boolean} [skipSession] — true للأوضاع التي تدير تصعيدها بنفسها
 *                                  (survival, rocket) كي لا تُلوِّث حرارة الجلسة
 */
function recordAnswer(op, isCorrect, respMs, skipSession) {
    /* ① AdaptiveAI — يتعلم دائماً بغض النظر عن الوضع */
    if (typeof AdaptiveAI !== 'undefined') AdaptiveAI.record(op, isCorrect);

    /* ② SessionProgress — فقط للأوضاع العادية */
    if (!skipSession) {
        if (isCorrect) SessionProgress.onCorrect();
        else           SessionProgress.onWrong();
    }

    /* ③ SmartAI — مع وقت الاستجابة */
    try {
        if (typeof SmartAI !== 'undefined') {
            if (isCorrect) SmartAI.onCorrect(op, respMs || 0);
            else           SmartAI.onWrong(op, null, null, respMs || 0);
        }
    } catch(e) {}
}
window.recordAnswer = recordAnswer;


/* ═══════════════════════════════════════════════════════════════
   ⑥ شرح تفاعلي
═══════════════════════════════════════════════════════════════ */

function showSmartExplanation(explanation, correctAnswer) {
    var area = document.getElementById('explanationArea');
    if (area) area.innerHTML = '';
    if (typeof G !== 'undefined' && G.op) AdaptiveAI.record(G.op, false);
}


/* ═══════════════════════════════════════════════════════════════
   واجهة موحّدة
═══════════════════════════════════════════════════════════════ */

function getNextQuestion(op, diff, strict) {
    var q = null;
    /* الأنواع المتقدمة والجداول تذهب مباشرة لـ genQ */
    if (op === 'table' || op === 'laws' || op === 'advanced' ||
        ['adv_roots','adv_log','adv_geo','adv_eq','adv_seq','adv_trig'].includes(op)) {
        if (typeof genQ === 'function') {
            q = genQ(op, diff);
            /* تحقق من صحة السؤال المُرجَع */
            if (q && typeof q.answer !== 'undefined' && q.choices && q.choices.length >= 2) return q;
        }
    }
    /* باقي الأنواع عبر المحرك الذكي */
    q = genSmartQ(op, diff, strict || false);
    /* fallback آمن إذا فشل التوليد */
    if (!q || typeof q.answer === 'undefined' || !q.choices || q.choices.length < 2) {
        if (typeof genQ === 'function') q = genQ(op || 'add', diff || 'easy');
    }
    return q;
}


/* ═══════════════════════════════════════════════════════════════
   CSS الشرح التفاعلي
═══════════════════════════════════════════════════════════════ */

(function () {
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
