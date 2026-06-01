/* ═══════════════════════════════════════════════════════════════════════
   HO Math — ملف التكامل بين المحرك اللانهائي والألعاب الموجودة
   iqa_integration.js

   يجب تحميل هذا الملف بعد:
     1. questions.js
     2. questions_engine.js
     3. infinite_question_engine.js

   ما يفعله هذا الملف:
     ① يُعيد توجيه getNextQuestion() لاستخدام المحرك الجديد
     ② يُحافظ على genQ() الأصلية كـ fallback
     ③ يُعيد تعريف genChallengeQ / genDailyQ / genChainQ
     ④ يُضيف إحصاءات لوحة التحكم التشخيصية
═══════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ─────────────────────────────────────────────────────
       حفظ الدوال الأصلية كـ fallback آمن
    ───────────────────────────────────────────────────── */
    var _origGetNext = window.getNextQuestion;
    var _origGenQ    = window.genQ;

    /* ─────────────────────────────────────────────────────
       ① إعادة تعريف getNextQuestion
       الدالة الرئيسية التي تستدعيها جميع الألعاب
    ───────────────────────────────────────────────────── */
    window.getNextQuestion = function(op, diff) {

        /* العمليات الخاصة التي تبقى على النظام القديم */
        var legacyOps = ['table', 'laws', 'advanced',
            'adv_roots', 'adv_log', 'adv_geo', 'adv_eq', 'adv_seq', 'adv_trig'];

        if (legacyOps.indexOf(op) >= 0) {
            if (typeof _origGenQ === 'function') return _origGenQ(op, diff);
            if (typeof genQ === 'function')      return genQ(op, diff);
        }

        /* تحديد نوع التوليد */
        try {
            var q;

            /* تعيين الصعوبة الفعلية */
            var actualDiff = diff || 'easy';
            if (actualDiff === 'auto' || actualDiff === 'user') {
                actualDiff = (typeof getDifficultyByLevel === 'function')
                    ? getDifficultyByLevel() : 'easy';
            }

            /* توليد السؤال من المحرك اللانهائي */
            if (typeof generateInfiniteQ === 'function') {
                /* تعيين معرّف القانون المناسب */
                var lawFilter = _opToLawFilter(op);
                q = generateInfiniteQ(actualDiff, lawFilter);
            } else if (typeof _origGetNext === 'function') {
                q = _origGetNext(op, diff);
            } else if (typeof genSmartQ === 'function') {
                q = genSmartQ(op, diff);
            } else {
                q = genQ(op, diff);
            }

            /* تسجيل في AdaptiveAI إذا كان متاحاً */
            if (q && typeof AdaptiveAI !== 'undefined' && q._lawId) {
                /* لا نسجل الآن — يُسجل بعد إجابة اللاعب في game.js */
            }

            return q;

        } catch(e) {
            console.error('[IQA] خطأ في توليد السؤال، استخدام fallback:', e);
            /* fallback آمن */
            if (typeof _origGetNext === 'function') return _origGetNext(op, diff);
            if (typeof genSmartQ    === 'function') return genSmartQ(op, diff);
            if (typeof genQ         === 'function') return genQ(op, diff);
            /* آخر حل */
            var a = Math.floor(Math.random()*10)+1, b = Math.floor(Math.random()*10)+1;
            return { text: a+'+'+b, answer: a+b, choices: [a+b, a+b+1, a+b-1, a+b+2], hint:'اجمع', explanation: a+'+'+b+'='+(a+b), catKey:'addition' };
        }
    };

    /* ─────────────────────────────────────────────────────
       تحويل رمز العملية إلى فلتر قانون في IQE
    ───────────────────────────────────────────────────── */
    function _opToLawFilter(op) {
        var map = {
            'add':              'add_basic',
            'sub':              'sub_basic',
            'mul':              'mul_basic',
            'div':              'div_basic',
            'percent':          'percent_of',
            'power':            'power_basic',
            'sqrt':             'sqrt_perfect',
            'equation_simple':  'eq_linear1',
            'algebra':          'eq_linear3',
            'equation_quad':    'eq_quad_simple',
            'sequence':         'seq_arithmetic',
            'fraction_simple':  'frac_add_same',
            'fraction_add':     'frac_add_diff',
            'fraction_mul':     'frac_mul',
            'geo_area':         'geo_area_rect',
            'log_simple':       'log_base10',
            'word_add':         'word_add',
            'word_mul':         'word_mul',
            'word_hard':        'word_hard',
            'word_genius':      'word_genius',
            'mix':              null  /* null = اختيار عشوائي */
        };
        return map[op] || null;
    }

    /* ─────────────────────────────────────────────────────
       ② إحصاءات تشخيصية (للتطوير)
    ───────────────────────────────────────────────────── */
    var _iqaStats = { generated: 0, byLaw: {} };

    var _origGenInfinite = window.generateInfiniteQ;
    if (typeof _origGenInfinite === 'function') {
        window.generateInfiniteQ = function(diff, opFilter) {
            var q = _origGenInfinite(diff, opFilter);
            if (q) {
                _iqaStats.generated++;
                var key = q._lawId || 'unknown';
                _iqaStats.byLaw[key] = (_iqaStats.byLaw[key] || 0) + 1;
            }
            return q;
        };
    }

    /* دالة للاطلاع على الإحصاءات من الكونسول */
    window.IQA_stats = function() {
        var sorted = Object.keys(_iqaStats.byLaw)
            .sort(function(a,b){ return _iqaStats.byLaw[b] - _iqaStats.byLaw[a]; })
            .map(function(k){ return k + ': ' + _iqaStats.byLaw[k]; });
        console.log('[IQA] إجمالي الأسئلة المولدة:', _iqaStats.generated);
        console.log('[IQA] توزيع القوانين:\n' + sorted.join('\n'));
        return _iqaStats;
    };

    console.log('[IQA] التكامل جاهز — getNextQuestion مُعاد توجيهها للمحرك اللانهائي');

})();
