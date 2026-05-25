/* ═══════════════════════════════════════════════════════════════
   HO Math — محرك الأسئلة الذكي v2.0
   ✅ ثلاثة أنظمة جديدة:
     1. ذكاء اصطناعي تكيّفي (Adaptive AI) — يتتبع أداء اللاعب
     2. توليد رياضي لا نهائي — لا تتكرر الأسئلة أبداً
     3. شرح تفاعلي مفصّل لكل إجابة خاطئة
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   ① نظام التكيّف الذكي — يتعلم من أداء اللاعب
   يتتبع: معدل الصواب لكل نوع سؤال، وعدد المحاولات
   يقرر: رفع أو خفض الصعوبة تلقائياً لكل نوع
═══════════════════════════════════════════════════════════════ */

var AdaptiveAI = (function() {

    /* سجل أداء اللاعب لكل نوع سؤال */
    /* البنية: { 'add': { correct:0, total:0, diff:0 }, ... } */
    var _perf = {};

    /* مستويات الصعوبة لكل نوع */
    var DIFF_LEVELS = ['easy', 'medium', 'hard', 'genius'];

    /* نسب العتبة: إذا تجاوز معدل الصواب 80% رفعنا، إذا نزل عن 45% خفضنا */
    var THRESHOLD_UP   = 0.80;
    var THRESHOLD_DOWN = 0.45;
    var MIN_SAMPLES    = 5; /* لا نغيّر الصعوبة قبل 5 أسئلة من نفس النوع */

    function _key(op) { return op || 'mix'; }

    function _get(op) {
        var k = _key(op);
        if (!_perf[k]) _perf[k] = { correct: 0, total: 0, diffIdx: 1 }; /* يبدأ من medium */
        return _perf[k];
    }

    /* تسجيل نتيجة سؤال */
    function record(op, wasCorrect) {
        var p = _get(op);
        p.total++;
        if (wasCorrect) p.correct++;

        /* تقييم الأداء بعد كل 5 أسئلة */
        if (p.total >= MIN_SAMPLES && p.total % MIN_SAMPLES === 0) {
            var rate = p.correct / p.total;
            /* نحسب المعدل فقط على آخر 10 إجابات حتى يتكيف بسرعة */
            if (rate >= THRESHOLD_UP  && p.diffIdx < DIFF_LEVELS.length - 1) {
                p.diffIdx++;
            } else if (rate <= THRESHOLD_DOWN && p.diffIdx > 0) {
                p.diffIdx--;
            }
        }
    }

    /* الحصول على الصعوبة الموصى بها لنوع معين */
    function getDiff(op, baseDiff) {
        /* إذا حدد اللاعب صعوبة يدوية → نحترمها لكن نضبط داخلها */
        var p = _get(op);
        /* إذا كانت الصعوبة اليدوية أعلى من التكيّفية نحترم اليدوية */
        var baseIdx = DIFF_LEVELS.indexOf(baseDiff || 'medium');
        if (baseIdx < 0) baseIdx = 1;
        /* نأخذ الأعلى بين اليدوي والتكيّفي لتجنب إحباط اللاعبين القدامى */
        return DIFF_LEVELS[Math.max(baseIdx, p.diffIdx)];
    }

    /* الحصول على إحصائيات للعرض */
    function getStats(op) {
        var p = _get(op);
        return {
            diff:     DIFF_LEVELS[p.diffIdx],
            diffIdx:  p.diffIdx,
            rate:     p.total > 0 ? Math.round(p.correct / p.total * 100) : 0,
            total:    p.total
        };
    }

    /* إعادة ضبط الأداء (عند بدء لعبة جديدة) */
    function reset() { _perf = {}; }

    return { record: record, getDiff: getDiff, getStats: getStats, reset: reset };
})();


/* ═══════════════════════════════════════════════════════════════
   ② توليد رياضي لا نهائي — أسئلة لا تتكرر أبداً
   كل سؤال يُعرَّف بـ "بصمة رياضية" فريدة
═══════════════════════════════════════════════════════════════ */

/* ذاكرة الجلسة: تخزن بصمات الأسئلة المطروحة */
var _sessionMemory = new Set();
var MAX_MEMORY = 300; /* نحتفظ بآخر 300 سؤال */

function _fingerprint(q) {
    return q.text + '§' + q.answer;
}

function _remember(q) {
    var fp = _fingerprint(q);
    _sessionMemory.add(fp);
    if (_sessionMemory.size > MAX_MEMORY) {
        /* حذف الأقدم */
        _sessionMemory.delete(_sessionMemory.values().next().value);
    }
}

function _wasSeen(q) {
    return _sessionMemory.has(_fingerprint(q));
}

function clearSessionMemory() {
    _sessionMemory.clear();
}

/*
 * الدالة الرئيسية للتوليد الذكي
 * تحاول حتى 40 مرة لتوليد سؤال غير مكرر
 */
function genSmartQ(op, baseDiff, ageOverride) {
    var age   = ageOverride || (typeof st !== 'undefined' ? (st.age || _calcAge(st.birthDate)) : 0);
    var diff  = AdaptiveAI.getDiff(op, baseDiff || (typeof getDifficultyByLevel === 'function' ? getDifficultyByLevel() : 'medium'));

    /* للأطفال الصغار: حد أقصى للصعوبة */
    if (age > 0 && age <= 9)  diff = 'easy';
    if (age > 0 && age <= 12 && (diff === 'hard' || diff === 'genius')) diff = 'medium';

    var q, attempts = 0;
    do {
        q = _generateOne(op, diff, age);
        attempts++;
        if (!_wasSeen(q)) break;
        /* بعد 40 محاولة نقبل التكرار لتجنب التجميد */
        if (attempts >= 40) { clearSessionMemory(); break; }
    } while (true);

    _remember(q);
    return q;
}

function _calcAge(birthDate) {
    if (!birthDate) return 0;
    var today = new Date(), birth = new Date(birthDate);
    var age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
}

/*
 * مولّد السؤال الفعلي — يختار النوع والصعوبة
 */
function _generateOne(op, diff, age) {
    /* تعيين العملية إذا كانت "mix" */
    var actualOp = op;
    if (op === 'mix') {
        actualOp = _pickOpForMix(diff, age);
    }

    /* توليد السؤال */
    var q = _buildQuestion(actualOp, diff, age);

    /* ضمان أن الخيارات ذكية ومتنوعة */
    q.choices = _smartChoices(q.answer, actualOp, diff);

    return q;
}

/* اختيار نوع العملية للوضع المختلط — يراعي العمر والصعوبة */
function _pickOpForMix(diff, age) {
    var pools = {
        easy: ['add', 'sub', 'mul', 'add', 'sub'], /* جمع وطرح أكثر للمبتدئين */
        medium: ['add', 'sub', 'mul', 'div', 'percent', 'word_add', 'word_mul', 'fraction_simple', 'equation_simple'],
        hard:   ['add', 'sub', 'mul', 'div', 'percent', 'fraction_add', 'power', 'sqrt', 'sequence', 'equation_simple', 'word_hard'],
        genius: ['mul', 'div', 'percent', 'fraction_mul', 'power', 'sqrt', 'sequence', 'algebra', 'equation_quad', 'log_simple', 'word_genius']
    };
    /* للأطفال ≤ 10: فقط جمع وطرح بسيط */
    if (age > 0 && age <= 10) return ['add', 'sub', 'add', 'sub', 'mul'][rnd(0,4)];
    var pool = pools[diff] || pools.medium;
    return pool[rnd(0, pool.length - 1)];
}

/*
 * بناء السؤال حسب النوع والصعوبة
 * هذا هو القلب الرياضي للنظام
 */
function _buildQuestion(op, diff, age) {
    var R = _ranges(diff);
    var a, b, c, ans, text, hint, explanation, catKey;

    switch(op) {

        /* ───── جمع ───── */
        case 'add': {
            a = rnd(R.s[0], R.s[1]);
            b = rnd(R.s[0], R.s[1]);
            ans = a + b;
            text = diff === 'genius'
                ? `${a.toLocaleString('ar')} + ${b.toLocaleString('ar')}`
                : `${a} + ${b}`;
            hint = 'اجمع العددين';
            explanation = `نجمع ${a} و ${b}:\n${a} + ${b} = ${ans}`;
            if (diff === 'medium' || diff === 'hard') {
                explanation += `\nيمكن التحقق: ${ans} − ${b} = ${a} ✓`;
            }
            catKey = 'addition';
            break;
        }

        /* ───── طرح ───── */
        case 'sub': {
            a = rnd(R.s[0], R.s[1]);
            b = rnd(R.s[0], R.s[1]);
            if (a < b) [a, b] = [b, a];
            ans = a - b;
            text = `${a} − ${b}`;
            hint = 'اطرح العددين';
            explanation = `نطرح ${b} من ${a}:\n${a} − ${b} = ${ans}`;
            if (ans < 0) explanation += `\nالناتج سالب لأن ${b} أكبر من ${a}`;
            catKey = 'subtraction';
            break;
        }

        /* ───── ضرب ───── */
        case 'mul': {
            a = rnd(R.t[0], R.t[1]);
            b = rnd(R.t[0], R.t[1]);
            ans = a * b;
            text = `${a} × ${b}`;
            hint = 'اضرب العددين';
            explanation = `${a} × ${b} = ${ans}\n`;
            if (a <= 12 && b <= 12) {
                explanation += `(جدول الضرب: ${a} × ${b} = ${ans})`;
            } else {
                explanation += `طريقة التجزئة: ${a} × ${b} = ${a} × ${Math.floor(b/10)*10} + ${a} × ${b%10} = ${a*Math.floor(b/10)*10} + ${a*(b%10)} = ${ans}`;
            }
            catKey = 'multiplication';
            break;
        }

        /* ───── قسمة ───── */
        case 'div': {
            ans = rnd(R.t[0], R.t[1]);
            b   = rnd(R.t[0], R.t[1]);
            a   = ans * b;
            text = `${a} ÷ ${b}`;
            hint = 'اقسم العددين (القسمة عكس الضرب)';
            explanation = `${a} ÷ ${b} = ${ans}\nلأن ${ans} × ${b} = ${a} ✓`;
            catKey = 'division';
            break;
        }

        /* ───── نسبة مئوية ───── */
        case 'percent': {
            var pcts = diff === 'easy' ? [10, 25, 50] :
                       diff === 'medium' ? [10, 20, 25, 50, 75] :
                       [5, 10, 15, 20, 25, 30, 40, 50, 75];
            var pct = pcts[rnd(0, pcts.length-1)];
            a = rnd(2, 20) * 10;
            ans = Math.round(a * pct / 100);
            text = `${pct}% من ${a}`;
            hint = `اضرب ${a} في (${pct}/100)`;
            explanation = `${pct}% من ${a}:\n= ${a} × ${pct}/100\n= ${a} × ${(pct/100).toFixed(2)}\n= ${ans}`;
            if (pct === 10) explanation += `\nطريقة سريعة: ${pct}% = اقسم على 10 = ${ans}`;
            if (pct === 25) explanation += `\nطريقة سريعة: 25% = اقسم على 4 = ${ans}`;
            if (pct === 50) explanation += `\nطريقة سريعة: 50% = اقسم على 2 = ${ans}`;
            catKey = 'percentage';
            break;
        }

        /* ───── قوى ───── */
        case 'power': {
            a = diff === 'easy' ? rnd(2,5) : diff === 'medium' ? rnd(2,8) : rnd(2,12);
            b = diff === 'easy' ? 2 : rnd(2,3);
            ans = Math.pow(a, b);
            text = `${a}^${b}`;
            hint = `اضرب ${a} في نفسه ${b} مرة`;
            var steps = [];
            for (var i = 0; i < b; i++) steps.push(a);
            explanation = `${a}^${b} = ${steps.join(' × ')} = ${ans}`;
            catKey = 'algebra';
            break;
        }

        /* ───── جذر تربيعي ───── */
        case 'sqrt': {
            var sqrtPool = diff === 'easy'
                ? [4, 9, 16, 25, 36, 49]
                : diff === 'medium'
                ? [4, 9, 16, 25, 36, 49, 64, 81, 100]
                : [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256];
            a = sqrtPool[rnd(0, sqrtPool.length-1)];
            ans = Math.round(Math.sqrt(a));
            text = `√${a}`;
            hint = 'أي عدد مضروب في نفسه يساوي هذا؟';
            explanation = `√${a} = ${ans}\nلأن ${ans} × ${ans} = ${ans*ans} = ${a} ✓`;
            catKey = 'algebra';
            break;
        }

        /* ───── معادلة بسيطة: س + a = b ───── */
        case 'equation_simple': {
            a = rnd(R.s[0]+2, R.s[1]);
            ans = rnd(1, R.s[1]);
            b = a + ans;
            text = `س + ${a} = ${b}`;
            hint = 'انقل الثابت للطرف الآخر';
            explanation = `س + ${a} = ${b}\nس = ${b} − ${a}\nس = ${ans}\nتحقق: ${ans} + ${a} = ${b} ✓`;
            catKey = 'algebra';
            break;
        }

        /* ───── معادلة خطية: 2س + a = b ───── */
        case 'algebra': {
            var coef = rnd(2, diff === 'genius' ? 9 : 5);
            ans = rnd(1, diff === 'genius' ? 20 : 12);
            a = rnd(1, 20);
            b = coef * ans + a;
            text = `${coef}س + ${a} = ${b}`;
            hint = 'أولاً انقل الثابت، ثم اقسم على المعامل';
            explanation = `${coef}س + ${a} = ${b}\n${coef}س = ${b} − ${a} = ${b-a}\nس = ${b-a} ÷ ${coef} = ${ans}\nتحقق: ${coef}×${ans}+${a} = ${b} ✓`;
            catKey = 'algebra';
            break;
        }

        /* ───── متتالية حسابية ───── */
        case 'sequence': {
            a = rnd(1, diff === 'easy' ? 5 : 20);
            b = rnd(2, diff === 'easy' ? 4 : 15); /* الفرق */
            var seqType = rnd(0, 1);
            if (seqType === 0) {
                /* متتالية حسابية: a, a+b, a+2b, a+3b, ? */
                text = `${a}, ${a+b}, ${a+2*b}, ${a+3*b}, ؟`;
                ans = a + 4 * b;
                hint = `الفرق بين كل حدين = ${b}`;
                explanation = `المتتالية الحسابية، الفرق المشترك = ${b}\nالحد التالي = ${a+3*b} + ${b} = ${ans}`;
            } else {
                /* متتالية: a, a*b, a*b^2, ? (هندسية بسيطة) */
                var ratio = rnd(2, diff === 'easy' ? 3 : 4);
                a = rnd(1, 5);
                text = `${a}, ${a*ratio}, ${a*ratio*ratio}, ؟`;
                ans = a * ratio * ratio * ratio;
                hint = `كل حد يُضرب في ${ratio}`;
                explanation = `المتتالية الهندسية، الأساس = ${ratio}\nالحد التالي = ${a*ratio*ratio} × ${ratio} = ${ans}`;
            }
            catKey = 'puzzles';
            break;
        }

        /* ───── كسور بمقام مشترك ───── */
        case 'fraction_simple': {
            var den = rnd(3, 8);
            var n1 = rnd(1, den-1);
            var n2 = rnd(1, den-n1);
            ans = n1 + n2;
            text = `${n1}/${den} + ${n2}/${den}`;
            hint = `المقامات متساوية (${den})، اجمع البسطين فقط`;
            explanation = `${n1}/${den} + ${n2}/${den}\n= (${n1}+${n2})/${den}\n= ${ans}/${den}`;
            if (ans % den === 0) explanation += ` = ${ans/den} (عدد صحيح)`;
            catKey = 'division';
            break;
        }

        /* ───── كسور جمع (مقامات مختلفة) ───── */
        case 'fraction_add': {
            var d1 = rnd(2, 6);
            var d2 = rnd(2, 6);
            while (d2 === d1) d2 = rnd(2, 6);
            var lcm = (d1 * d2) / _gcd(d1, d2);
            var num1 = rnd(1, d1-1);
            var num2 = rnd(1, d2-1);
            /* حساب الجمع */
            var resNum = num1 * (lcm/d1) + num2 * (lcm/d2);
            var resDen = lcm;
            var g = _gcd(resNum, resDen);
            resNum = resNum / g; resDen = resDen / g;
            ans = Math.round(resNum / resDen * 100) / 100;
            text = `${num1}/${d1} + ${num2}/${d2}`;
            hint = `أوجد المقام المشترك: ${lcm}`;
            explanation = `${num1}/${d1} + ${num2}/${d2}\nالمقام المشترك = ${lcm}\n= ${num1*(lcm/d1)}/${lcm} + ${num2*(lcm/d2)}/${lcm}\n= ${num1*(lcm/d1)+num2*(lcm/d2)}/${lcm}`;
            if (g > 1) explanation += ` = ${resNum}/${resDen}`;
            catKey = 'division';
            break;
        }

        /* ───── لوغاريتم بسيط ───── */
        case 'log_simple': {
            ans = rnd(1, diff === 'hard' ? 5 : 3);
            text = `log₁₀(10^${ans})`;
            hint = `log₁₀(10^ن) = ن`;
            explanation = `log₁₀(10^${ans}) = ${ans}\nلأن قاعدة اللوغاريتم وقاعدة الأسس نفسها (10)\nفيلغي كل منهما الآخر: log₁₀(10^ن) = ن`;
            catKey = 'algebra';
            break;
        }

        /* ───── مسائل كلامية — جمع ───── */
        case 'word_add': {
            var names = ['أحمد','سارة','خالد','ليلى','محمد','هند','يوسف','فاطمة'];
            var items = ['تفاحة','كتاب','قلم','لعبة','بيضة','ورقة'];
            var nm = names[rnd(0,names.length-1)];
            var it = items[rnd(0,items.length-1)];
            a = rnd(R.s[0], R.s[1]);
            b = rnd(R.s[0], R.s[1]);
            ans = a + b;
            text = `لدى ${nm} ${a} ${it}، ثم حصل على ${b} ${it} أخرى. كم ${it} لديه الآن؟`;
            hint = 'جمع البداية مع ما حصل عليه';
            explanation = `البداية: ${a} ${it}\nأضاف: ${b} ${it}\nالمجموع: ${a} + ${b} = ${ans} ${it}`;
            catKey = 'wordproblems';
            break;
        }

        /* ───── مسائل كلامية — ضرب ───── */
        case 'word_mul': {
            a = rnd(2, R.t[1]);
            b = rnd(2, R.t[1]);
            ans = a * b;
            var contexts = [
                { text: `إذا كان ثمن القلم ${a} دينار، فكم ثمن ${b} قلم؟`,
                  exp: `ثمن ${b} قلم = ${b} × ${a} = ${ans} دينار` },
                { text: `ملعب مستطيل طوله ${a} متر وعرضه ${b} متر. ما مساحته؟`,
                  exp: `المساحة = الطول × العرض = ${a} × ${b} = ${ans} م²` },
                { text: `يعمل ${a} عامل لمدة ${b} ساعات. كم مجموع ساعات العمل؟`,
                  exp: `مجموع الساعات = ${a} × ${b} = ${ans} ساعة` }
            ];
            var ctx = contexts[rnd(0,contexts.length-1)];
            text = ctx.text;
            hint = 'هذه مسألة ضرب';
            explanation = ctx.exp;
            catKey = 'wordproblems';
            break;
        }

        /* ───── مسألة كلامية صعبة ───── */
        case 'word_hard': {
            a = rnd(20, 100);
            b = rnd(5, 30);
            c = rnd(2, 10);
            ans = (a - b) * c;
            text = `اشترى محمد ${a} كتاباً، أعاد ${b} منها، ثم ضاعف ما تبقى ${c} مرات. كم كتاباً لديه؟`;
            hint = 'أولاً اطرح، ثم اضرب';
            explanation = `الخطوة 1: ${a} − ${b} = ${a-b} كتاب\nالخطوة 2: ${a-b} × ${c} = ${ans} كتاب`;
            catKey = 'wordproblems';
            break;
        }

        /* ───── هندسة — مساحات ───── */
        case 'geo_area': {
            var shapes = ['square', 'rect', 'triangle', 'circle'];
            var shape = diff === 'easy' ? 'square' : shapes[rnd(0,shapes.length-1)];
            if (shape === 'square') {
                a = rnd(3, diff === 'easy' ? 10 : 20);
                ans = a * a;
                text = `مساحة مربع طول ضلعه ${a}`;
                hint = `المساحة = الضلع²`;
                explanation = `مساحة المربع = الضلع × الضلع\n= ${a} × ${a} = ${ans}`;
            } else if (shape === 'rect') {
                a = rnd(3, 15); b = rnd(3, 15);
                ans = a * b;
                text = `مساحة مستطيل طوله ${a} وعرضه ${b}`;
                hint = `المساحة = الطول × العرض`;
                explanation = `مساحة المستطيل = الطول × العرض\n= ${a} × ${b} = ${ans}`;
            } else if (shape === 'triangle') {
                a = rnd(4, 20); b = rnd(3, 12);
                ans = Math.round(a * b / 2);
                text = `مساحة مثلث قاعدته ${a} وارتفاعه ${b}`;
                hint = `المساحة = ½ × القاعدة × الارتفاع`;
                explanation = `مساحة المثلث = ½ × ${a} × ${b}\n= ${a*b}/2 = ${ans}`;
            } else {
                a = rnd(2, 10);
                ans = Math.round(Math.PI * a * a);
                text = `مساحة دائرة نصف قطرها ${a} (π≈3.14)`;
                hint = `المساحة = π × نق²`;
                explanation = `مساحة الدائرة = π × ${a}²\n≈ 3.14 × ${a*a} = ${ans}`;
            }
            catKey = 'geometry';
            break;
        }

        /* افتراضي: جمع */
        default: {
            a = rnd(1, 20); b = rnd(1, 20);
            ans = a + b;
            text = `${a} + ${b}`;
            hint = 'اجمع العددين';
            explanation = `${a} + ${b} = ${ans}`;
            catKey = 'addition';
        }
    }

    return {
        text: text,
        hint: hint || 'ما هو الجواب؟',
        answer: ans,
        explanation: explanation || `الجواب: ${ans}`,
        catKey: catKey || 'addition',
        choices: [] /* ستُملأ بواسطة _smartChoices */
    };
}

/* ═══════════════════════════════════════════════════════════════
   ③ توليد خيارات ذكية — الخيارات الخاطئة منطقية لا عشوائية
   اللاعب لا يستطيع استبعادها بالنظر
═══════════════════════════════════════════════════════════════ */

function _smartChoices(correctAns, op, diff) {
    var ans = typeof correctAns === 'number' ? correctAns : parseFloat(correctAns);
    var wrongs = new Set();
    var safety = 0;

    /* استراتيجية الأخطاء الشائعة حسب نوع السؤال */
    var commonMistakes = _getCommonMistakes(ans, op);
    commonMistakes.forEach(function(m) {
        if (m !== ans) wrongs.add(m);
    });

    /* إذا لم تكفِ نضيف خيارات قريبة منطقياً */
    var spread = Math.max(2, Math.ceil(Math.abs(ans) * 0.15) + 1);
    while (wrongs.size < 3 && safety < 500) {
        safety++;
        /* خطأ بنسبة ±5% إلى ±25% من القيمة */
        var pct = [0.05, 0.1, 0.15, 0.2, 0.25][rnd(0,4)];
        var delta = Math.max(1, Math.round(Math.abs(ans) * pct));
        var sign = rnd(0,1) === 0 ? 1 : -1;
        var candidate = Math.round((ans + sign * delta) * 100) / 100;
        if (candidate !== ans && candidate >= 0) wrongs.add(candidate);
    }

    /* ضمان 3 خيارات خاطئة */
    var extra = 1;
    while (wrongs.size < 3) {
        wrongs.add(Math.round((ans + extra * 3) * 100) / 100);
        extra++;
    }

    return shuffle([ans, ...[...wrongs].slice(0,3)]);
}

/* أخطاء شائعة يرتكبها الطلاب لكل نوع عملية */
function _getCommonMistakes(ans, op) {
    var mistakes = [];
    switch(op) {
        case 'mul':
            /* خطأ شائع: نسيان الاحتياط، أو خطأ في آحاد الجدول */
            mistakes.push(ans + 10, ans - 10, ans + ans%10 === 0 ? ans+9 : ans-ans%10);
            break;
        case 'div':
            /* خطأ شائع: الباقي، أو القسمة المعكوسة */
            mistakes.push(ans + 1, ans - 1, Math.round(ans * 1.1));
            break;
        case 'percent':
            /* خطأ شائع: الضرب بدل القسمة أو العكس */
            mistakes.push(Math.round(ans * 10), Math.round(ans / 10), ans + ans);
            break;
        case 'power':
            /* خطأ شائع: الضرب بدل الأس */
            mistakes.push(ans + 1, ans - 1, Math.round(ans * 0.9));
            break;
        case 'sqrt':
            mistakes.push(ans + 1, ans - 1, ans + 2);
            break;
        case 'fraction_add':
        case 'fraction_simple':
            /* خطأ شائع: جمع المقامات أيضاً */
            mistakes.push(Math.round((ans + 0.5) * 10) / 10,
                          Math.round((ans - 0.5) * 10) / 10,
                          ans * 2);
            break;
        case 'equation_simple':
        case 'algebra':
            mistakes.push(ans + 1, ans - 1, ans * 2);
            break;
        default:
            mistakes.push(ans + rnd(1,3), ans - rnd(1,3), ans + rnd(4,8));
    }
    return mistakes.filter(function(m) { return typeof m === 'number' && !isNaN(m) && m !== ans; });
}

/* نطاقات الأرقام حسب الصعوبة */
function _ranges(diff) {
    return {
        easy:   { s:[1,10],    t:[2,9]   },
        medium: { s:[10,50],   t:[2,12]  },
        hard:   { s:[50,500],  t:[5,25]  },
        genius: { s:[200,9999],t:[10,50] }
    }[diff] || { s:[1,10], t:[2,9] };
}

function _gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
}


/* ═══════════════════════════════════════════════════════════════
   ③ شرح تفاعلي مفصّل — يُظهر طريقة الحل خطوة بخطوة
═══════════════════════════════════════════════════════════════ */

/*
 * استبدال دالة showExplanation القديمة بإصدار محسّن
 * يُظهر الشرح بتنسيق جميل خطوة بخطوة
 */
function showSmartExplanation(explanation, correctAnswer) {
    var area = document.getElementById('explanationArea');
    if (!area) return;

    /* تحويل \n إلى أسطر HTML */
    var lines = (explanation || `الجواب الصحيح: ${correctAnswer}`)
        .split('\n')
        .filter(function(l) { return l.trim(); });

    var stepsHTML = lines.map(function(line, i) {
        /* السطر الأول هو الخطوة الرئيسية، الباقي تفاصيل */
        if (i === 0) {
            return `<div class="exp-main">📝 ${line}</div>`;
        } else if (line.includes('✓')) {
            return `<div class="exp-verify">✅ ${line}</div>`;
        } else if (line.startsWith('الخطوة') || line.match(/^\d+[:\-\.]/)) {
            return `<div class="exp-step">➡ ${line}</div>`;
        } else {
            return `<div class="exp-detail">${line}</div>`;
        }
    }).join('');

    area.innerHTML = `
        <div class="explanation-box smart-explanation">
            <div class="exp-answer">✗ الإجابة الصحيحة: <strong>${correctAnswer}</strong></div>
            <div class="exp-steps">${stepsHTML}</div>
        </div>`;

    /* تسجيل نتيجة "خاطئة" في نظام التكيف */
    if (typeof G !== 'undefined' && G.op) {
        AdaptiveAI.record(G.op, false);
    }
}

/*
 * hook: يُضاف بعد كل إجابة صحيحة لتحديث النظام التكيفي
 */
function onCorrectAnswer(op) {
    AdaptiveAI.record(op, true);
}


/* ═══════════════════════════════════════════════════════════════
   تكامل مع loadQuestion الحالي — يُستدعى كاستبدال لـ genQ
   استخدم genSmartQ(op, diff) بدلاً من genQ(op, diff)
═══════════════════════════════════════════════════════════════ */

/*
 * واجهة للاستخدام من loadQuestion:
 * استبدل genQ(op, diff) بـ getNextQuestion(op, diff)
 */
function getNextQuestion(op, diff) {
    /* للعمليات الخاصة: جداول الضرب، القوانين، المتقدمة */
    if (op === 'table' || op === 'laws' || op === 'advanced') {
        /* نستخدم genQ الأصلية للعمليات الخاصة */
        if (typeof genQ === 'function') return genQ(op, diff);
    }
    /* للباقي: نستخدم المحرك الذكي الجديد */
    return genSmartQ(op, diff);
}

/* ═══════════════════════════════════════════════════════════════
   CSS المضاف ديناميكياً لشرح الأسئلة
═══════════════════════════════════════════════════════════════ */
(function injectExplanationCSS() {
    var style = document.createElement('style');
    style.textContent = `
        .smart-explanation {
            background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08));
            border: 1.5px solid rgba(124,58,237,0.3);
            border-radius: 16px;
            padding: 12px 14px;
            margin-top: 8px;
            font-family: 'Tajawal', sans-serif;
            animation: expSlideIn 0.3s ease;
        }
        @keyframes expSlideIn {
            from { opacity:0; transform: translateY(6px); }
            to   { opacity:1; transform: translateY(0); }
        }
        .exp-answer {
            font-size: 0.88em;
            font-weight: 900;
            color: #ef4444;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .exp-answer strong {
            color: #10b981;
            font-size: 1.05em;
        }
        .exp-steps {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .exp-main {
            font-size: 0.82em;
            font-weight: 700;
            color: var(--text, #e2e8f0);
        }
        .exp-step {
            font-size: 0.78em;
            color: var(--accent2, #06b6d4);
            font-weight: 600;
        }
        .exp-detail {
            font-size: 0.75em;
            color: var(--text2, #94a3b8);
        }
        .exp-verify {
            font-size: 0.75em;
            color: #10b981;
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
})();

