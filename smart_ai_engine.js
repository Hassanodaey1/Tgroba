/* ═══════════════════════════════════════════════════════════════════════
   HO Math — محرك الذكاء التعليمي الذكي v1.0
   © 2026 Hassan Odaey

   المرحلة الأولى:
     ① خريطة المعرفة     — كل مفهوم رياضي وعلاقته بالمفاهيم الأخرى
     ② نموذج اللاعب      — صورة كاملة عن ما يعرفه وأين يضعف
     ③ محلل الخطأ        — يفهم لماذا أخطأ وليس فقط أنه أخطأ
     ④ نظام المراجعة     — منحنى إبنغهاوس — متى يحتاج مراجعة

   طريقة التكامل:
     — يعمل بجانب النظام الحالي دون كسر أي شيء
     — يقرأ من st ويكتب فيه مثل AdaptiveAI تماماً
     — يُستدعى عبر SmartAI.onCorrect / SmartAI.onWrong
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   ① خريطة المعرفة الرياضية الكاملة
   كل مفهوم له: معرف + اسم + متطلبات + صعوبة + العمليات المرتبطة
═══════════════════════════════════════════════════════════════════════ */

var KNOWLEDGE_MAP = (function () {

    var concepts = [

        /* ══════════════ الأساسيات ══════════════ */
        { id:'count',           name:'العد والأرقام',                   requires:[],                              difficulty:1,  ops:['add'],                          category:'basics',        ageMin:0  },
        { id:'add_simple',      name:'الجمع البسيط (١-١٠)',              requires:['count'],                       difficulty:1,  ops:['add'],                          category:'basics',        ageMin:0  },
        { id:'sub_simple',      name:'الطرح البسيط (١-١٠)',              requires:['add_simple'],                  difficulty:2,  ops:['sub'],                          category:'basics',        ageMin:0  },
        { id:'add_carry',       name:'الجمع مع الحمل',                  requires:['add_simple'],                  difficulty:3,  ops:['add'],                          category:'basics',        ageMin:6  },
        { id:'sub_borrow',      name:'الطرح مع الاستلاف',               requires:['sub_simple','add_carry'],      difficulty:3,  ops:['sub'],                          category:'basics',        ageMin:6  },

        /* ══════════════ الضرب والقسمة ══════════════ */
        { id:'mul_table',       name:'جداول الضرب (١-١٢)',              requires:['add_carry'],                   difficulty:3,  ops:['mul','table'],                  category:'multiplication',ageMin:7  },
        { id:'mul_multi',       name:'ضرب الأعداد الكبيرة',             requires:['mul_table'],                   difficulty:4,  ops:['mul'],                          category:'multiplication',ageMin:8  },
        { id:'div_simple',      name:'القسمة البسيطة',                  requires:['mul_table'],                   difficulty:4,  ops:['div'],                          category:'division',      ageMin:8  },
        { id:'div_remainder',   name:'القسمة مع الباقي',                requires:['div_simple'],                  difficulty:5,  ops:['div'],                          category:'division',      ageMin:9  },

        /* ══════════════ النسبة المئوية ══════════════ */
        { id:'percent_basic',   name:'النسبة المئوية الأساسية',         requires:['mul_table','div_simple'],      difficulty:5,  ops:['percent'],                      category:'percentage',    ageMin:10 },
        { id:'percent_reverse', name:'النسبة المئوية العكسية',          requires:['percent_basic'],               difficulty:6,  ops:['percent'],                      category:'percentage',    ageMin:11 },
        { id:'percent_change',  name:'نسبة التغيير والزيادة',           requires:['percent_reverse'],             difficulty:7,  ops:['percent'],                      category:'percentage',    ageMin:12 },

        /* ══════════════ الكسور ══════════════ */
        { id:'fraction_concept',  name:'مفهوم الكسر',                   requires:['div_simple'],                  difficulty:4,  ops:['fraction_simple'],              category:'fractions',     ageMin:9  },
        { id:'fraction_add_same', name:'جمع كسور بمقام مشترك',          requires:['fraction_concept'],            difficulty:5,  ops:['fraction_simple'],              category:'fractions',     ageMin:10 },
        { id:'fraction_add_diff', name:'جمع كسور بمقامات مختلفة',       requires:['fraction_add_same','mul_table'],difficulty:6, ops:['fraction_add'],                 category:'fractions',     ageMin:11 },
        { id:'fraction_mul',      name:'ضرب الكسور',                    requires:['fraction_add_diff'],           difficulty:6,  ops:['fraction_mul'],                 category:'fractions',     ageMin:11 },

        /* ══════════════ القوى والجذور ══════════════ */
        { id:'power_basic',     name:'الأسس والقوى',                    requires:['mul_multi'],                   difficulty:5,  ops:['power'],                        category:'algebra',       ageMin:11 },
        { id:'sqrt_basic',      name:'الجذر التربيعي',                  requires:['power_basic'],                 difficulty:6,  ops:['sqrt'],                         category:'algebra',       ageMin:12 },
        { id:'power_laws',      name:'قوانين الأسس',                    requires:['power_basic'],                 difficulty:7,  ops:['power'],                        category:'algebra',       ageMin:13 },

        /* ══════════════ الجبر ══════════════ */
        { id:'equation_simple', name:'المعادلة البسيطة',                requires:['add_carry','sub_borrow'],      difficulty:5,  ops:['equation_simple'],              category:'algebra',       ageMin:11 },
        { id:'equation_linear', name:'المعادلة الخطية (خطوتان)',         requires:['equation_simple','mul_table'], difficulty:6,  ops:['algebra'],                      category:'algebra',       ageMin:12 },
        { id:'equation_quad',   name:'المعادلة التربيعية البسيطة',      requires:['equation_linear','sqrt_basic'],difficulty:8,  ops:['equation_quad'],                category:'algebra',       ageMin:13 },

        /* ══════════════ المتتاليات ══════════════ */
        { id:'seq_arith',       name:'المتتالية الحسابية',              requires:['add_carry'],                   difficulty:5,  ops:['sequence'],                     category:'sequences',     ageMin:10 },
        { id:'seq_geo',         name:'المتتالية الهندسية',              requires:['mul_table','seq_arith'],       difficulty:6,  ops:['sequence'],                     category:'sequences',     ageMin:11 },
        { id:'seq_special',     name:'المتتاليات الخاصة (فيبوناتشي)',   requires:['seq_geo'],                     difficulty:7,  ops:['sequence','adv_seq'],           category:'sequences',     ageMin:12 },

        /* ══════════════ الهندسة ══════════════ */
        { id:'geo_area_basic',  name:'مساحة المربع والمستطيل',          requires:['mul_table'],                   difficulty:4,  ops:['geo_area'],                     category:'geometry',      ageMin:9  },
        { id:'geo_area_tri',    name:'مساحة المثلث',                    requires:['geo_area_basic','div_simple'], difficulty:5,  ops:['geo_area'],                     category:'geometry',      ageMin:10 },
        { id:'geo_area_circle', name:'مساحة الدائرة',                   requires:['geo_area_tri','percent_basic'],difficulty:6,  ops:['geo_area','adv_geo'],           category:'geometry',      ageMin:11 },
        { id:'geo_pythagoras',  name:'نظرية فيثاغورس',                  requires:['sqrt_basic','geo_area_basic'], difficulty:7,  ops:['geo_area','adv_geo'],           category:'geometry',      ageMin:12 },
        { id:'geo_volume',      name:'الحجم والأجسام الثلاثية',         requires:['geo_area_circle'],             difficulty:7,  ops:['geo_area','adv_geo'],           category:'geometry',      ageMin:13 },

        /* ══════════════ المتقدم ══════════════ */
        { id:'log_basic',       name:'اللوغاريتم الأساسي',              requires:['power_laws'],                  difficulty:8,  ops:['log_simple','adv_log'],         category:'advanced',      ageMin:14 },
        { id:'trig_basic',      name:'جيب وجيب التمام والظل',           requires:['geo_pythagoras'],              difficulty:8,  ops:['adv_trig'],                     category:'advanced',      ageMin:14 },

        /* ══════════════ المسائل الكلامية ══════════════ */
        { id:'word_add',        name:'مسائل جمع كلامية',               requires:['add_simple'],                  difficulty:2,  ops:['word_add'],                     category:'word_problems', ageMin:7  },
        { id:'word_mul',        name:'مسائل ضرب كلامية',               requires:['mul_table'],                   difficulty:4,  ops:['word_mul'],                     category:'word_problems', ageMin:9  },
        { id:'word_multi_step', name:'مسائل متعددة الخطوات',           requires:['word_mul','percent_basic'],    difficulty:6,  ops:['word_hard'],                    category:'word_problems', ageMin:11 },
        { id:'word_genius',     name:'مسائل عبقرية متقدمة',            requires:['word_multi_step','equation_linear'], difficulty:8, ops:['word_genius'],            category:'word_problems', ageMin:13 }
    ];

    /* فهرسة سريعة */
    var _idx = {};
    concepts.forEach(function (c) { _idx[c.id] = c; });

    function get(id)      { return _idx[id] || null; }
    function byOp(op)     { return concepts.filter(function(c){ return c.ops.indexOf(op) >= 0; }); }
    function dependents(id) {
        return concepts.filter(function(c){ return c.requires.indexOf(id) >= 0; });
    }
    function isUnlocked(conceptId, masteryMap) {
        var c = get(conceptId);
        if (!c) return false;
        return c.requires.every(function(req){ return (masteryMap[req] || 0) >= 0.6; });
    }

    return { all: concepts, get: get, byOp: byOp, dependents: dependents, isUnlocked: isUnlocked };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ② نموذج اللاعب الكامل
   يُخزَّن في st._playerModel — يُحدَّث بعد كل إجابة
═══════════════════════════════════════════════════════════════════════ */

var PlayerModel = (function () {

    var MASTERY_STEP_UP   = 0.08;  /* زيادة الإتقان لكل إجابة صحيحة */
    var MASTERY_STEP_DOWN = 0.12;  /* نقصان الإتقان لكل إجابة خاطئة */
    var WINDOW_SIZE       = 10;    /* حجم النافذة المنزلقة للتقييم */
    var FAST_GUESS_MS     = 800;   /* أقل من 800ms = تخمين محتمل */
    var SLOW_RATIO        = 2.5;   /* أكثر من 2.5× المتوسط = تردد */

    function _load() {
        try { if (typeof st !== 'undefined' && st._playerModel) return st._playerModel; }
        catch(e) {}
        return _fresh();
    }

    function _save(m) {
        try {
            if (typeof st !== 'undefined') {
                st._playerModel = m;
                if (typeof saveSt === 'function') saveSt();
            }
        } catch(e) {}
    }

    function _fresh() {
        return {
            version:       1,
            createdAt:     Date.now(),
            updatedAt:     Date.now(),
            concepts:      {},
            session: {
                startTime:      Date.now(),
                questionsCount: 0,
                correctCount:   0,
                avgResponseMs:  3000,
                lastConceptId:  null,
                streak:         0,
                fatigue:        0
            },
            errorPatterns: {}
        };
    }

    function _freshConcept() {
        return {
            mastery:        0.1,
            attempts:       0,
            correct:        0,
            recentHistory:  [],
            avgTimeMs:      3000,
            firstSeen:      Date.now(),
            lastSeen:       Date.now(),
            lastCorrect:    null,
            lastWrong:      null,
            forgettingRisk: 0.0,
            errorTypes:     {}
        };
    }

    function _getRec(model, id) {
        if (!model.concepts[id]) model.concepts[id] = _freshConcept();
        return model.concepts[id];
    }

    /* ─── تسجيل إجابة ─── */
    function record(conceptId, isCorrect, responseMs, errorType) {
        var model = _load();
        var rec   = _getRec(model, conceptId);
        var now   = Date.now();

        /* إحصائيات أساسية */
        rec.attempts++;
        rec.lastSeen = now;
        if (isCorrect) { rec.correct++; rec.lastCorrect = now; }
        else {
            rec.lastWrong = now;
            if (errorType) {
                rec.errorTypes[errorType] = (rec.errorTypes[errorType] || 0) + 1;
                model.errorPatterns[errorType] = (model.errorPatterns[errorType] || 0) + 1;
            }
        }

        /* النافذة المنزلقة */
        rec.recentHistory.push(isCorrect);
        if (rec.recentHistory.length > WINDOW_SIZE) rec.recentHistory.shift();

        /* متوسط الوقت — متوسط متحرك أسي */
        if (responseMs > 0 && responseMs < 60000) {
            rec.avgTimeMs = rec.avgTimeMs
                ? Math.round(rec.avgTimeMs * 0.7 + responseMs * 0.3)
                : responseMs;
        }

        /* تحديث الإتقان */
        _updateMastery(rec, isCorrect, responseMs);

        /* الجلسة */
        var s = model.session;
        s.questionsCount++;
        if (isCorrect) { s.correctCount++; s.streak++; } else { s.streak = 0; }
        s.lastConceptId = conceptId;
        if (responseMs > 0)
            s.avgResponseMs = s.avgResponseMs
                ? Math.round(s.avgResponseMs * 0.8 + responseMs * 0.2)
                : responseMs;
        s.fatigue = Math.min(1, s.questionsCount / 80);

        /* خطر النسيان */
        rec.forgettingRisk = _forgettingRisk(rec, now);

        model.updatedAt = now;
        _save(model);
    }

    function _updateMastery(rec, isCorrect, responseMs) {
        var recentRate = rec.recentHistory.length
            ? rec.recentHistory.filter(Boolean).length / rec.recentHistory.length
            : 0;

        /* معامل الوقت */
        var tm = 1.0;
        if (responseMs > 0) {
            if (responseMs < FAST_GUESS_MS && isCorrect)                    tm = 0.5;
            else if (rec.avgTimeMs > 0 && responseMs > rec.avgTimeMs * SLOW_RATIO) tm = 0.7;
        }

        if (isCorrect) {
            var up = MASTERY_STEP_UP * tm * (1 - rec.mastery * 0.5);
            rec.mastery = Math.min(1.0, rec.mastery + up);
        } else {
            var dp = recentRate < 0.4 ? 1.5 : 1.0;
            rec.mastery = Math.max(0.0, rec.mastery - MASTERY_STEP_DOWN * dp);
        }
        rec.mastery = Math.round(rec.mastery * 10000) / 10000;
    }

    /* منحنى إبنغهاوس: R = e^(-t/S) ، خطر النسيان = 1-R */
    function _forgettingRisk(rec, now) {
        if (!rec.lastCorrect) return 0.5;
        var days     = (now - rec.lastCorrect) / 86400000;
        var strength = Math.max(0.5, rec.mastery * 7);
        return Math.round((1 - Math.exp(-days / strength)) * 100) / 100;
    }

    /* ─── واجهة القراءة ─── */
    function getMastery(id)      { var m=_load(); return m.concepts[id] ? m.concepts[id].mastery : 0; }
    function getMasteryMap()     {
        var m=_load(), map={};
        Object.keys(m.concepts).forEach(function(id){ map[id]=m.concepts[id].mastery; });
        return map;
    }
    function getConceptData(id)  { return _load().concepts[id] || null; }
    function getSession()        { return _load().session; }
    function getDominantError(id){
        var rec=_load().concepts[id]; if(!rec) return null;
        var max=0, dom=null;
        Object.keys(rec.errorTypes||{}).forEach(function(t){
            if(rec.errorTypes[t]>max){ max=rec.errorTypes[t]; dom=t; }
        });
        return dom;
    }

    function resetSession() {
        var m=_load();
        m.session={ startTime:Date.now(), questionsCount:0, correctCount:0,
                    avgResponseMs:m.session.avgResponseMs||3000,
                    lastConceptId:null, streak:0, fatigue:0 };
        _save(m);
    }

    function getSummary() {
        var m=_load();
        var list=Object.keys(m.concepts).map(function(id){
            return {id:id, mastery:m.concepts[id].mastery};
        }).sort(function(a,b){return a.mastery-b.mastery;});
        return {
            totalConcepts: list.length,
            weakest:       list.slice(0,3),
            strongest:     list.slice(-3).reverse(),
            sessionQ:      m.session.questionsCount,
            sessionAcc:    m.session.questionsCount>0
                ? Math.round(m.session.correctCount/m.session.questionsCount*100) : 0
        };
    }

    return { record, getMastery, getMasteryMap, getConceptData,
             getSession, getDominantError, resetSession, getSummary };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ③ محلل الخطأ الذكي
   يصنّف الخطأ لفهم السبب الحقيقي وراءه
═══════════════════════════════════════════════════════════════════════ */

var ErrorAnalyzer = (function () {

    /*
     * أنواع الأخطاء:
     *  'careless'    — تسرّع: أقل من 1.2 ثانية
     *  'timeout'     — عجز عن الحل: أكثر من 25 ثانية
     *  'arithmetic'  — خطأ حسابي بسيط (فارق ≤ 2)
     *  'procedural'  — خطأ في خطوة الحل (فارق رتبة عشرية)
     *  'confusion'   — خلط بين عمليتَين
     *  'conceptual'  — لا يفهم المفهوم (فارق كبير > 50%)
     *  'forgetting'  — كان يعرفه لكن نسيه
     */

    function analyze(correctAns, chosenAns, responseMs, conceptId, op) {
        var result = { type:'unknown', confidence:0.5, description:'', suggestion:'' };

        /* ① فحص الوقت */
        if (responseMs > 0 && responseMs < 1200) {
            return { type:'careless', confidence:0.9,
                     description:'إجابة متسرّعة', suggestion:'خذ وقتك في القراءة' };
        }
        if (responseMs > 25000) {
            return { type:'timeout', confidence:0.85,
                     description:'استغرق وقتاً طويلاً جداً', suggestion:'راجع المفهوم الأساسي' };
        }

        /* ② فحص طبيعة الخطأ الرياضي */
        var cN = typeof correctAns==='number' ? correctAns : parseFloat(correctAns);
        var wN = typeof chosenAns ==='number' ? chosenAns  : parseFloat(chosenAns);

        if (!isNaN(cN) && !isNaN(wN)) {
            var diff  = Math.abs(cN - wN);
            var ratio = cN !== 0 ? diff / Math.abs(cN) : diff;

            if (diff <= 2)
                return { type:'arithmetic', confidence:0.85,
                         description:'قريب من الصواب بفارق '+diff, suggestion:'راجع خطوة الحساب' };

            if (diff===10||diff===100||diff===1000)
                return { type:'procedural', confidence:0.75,
                         description:'خطأ في الحمل أو رتبة الأرقام', suggestion:'انتبه لترتيب الأرقام' };

            if (_isOpConfusion(cN, wN, op))
                return { type:'confusion', confidence:0.7,
                         description:'خلط بين عمليتَين', suggestion:'اقرأ السؤال مرة أخرى' };

            if (ratio > 0.5)
                return { type:'conceptual', confidence:0.75,
                         description:'فارق كبير — قد لا يفهم المفهوم', suggestion:'يحتاج شرحاً من البداية' };
        }

        /* ③ فحص النسيان */
        var data = PlayerModel.getConceptData(conceptId);
        if (data && data.forgettingRisk > 0.6 && data.mastery > 0.5)
            return { type:'forgetting', confidence:0.7,
                     description:'كان يعرفه لكن مضى وقت طويل', suggestion:'يحتاج مراجعة دورية' };

        result.type='procedural'; result.confidence=0.5;
        result.description='خطأ في تطبيق الخطوات'; result.suggestion='راجع خطوات الحل';
        return result;
    }

    function _isOpConfusion(correct, chosen, op) {
        switch(op) {
            case 'add': return chosen === correct * 2;
            case 'mul': return Math.abs(chosen - correct) <= 5 && chosen !== correct;
            case 'sub': return chosen === -correct;
            case 'div': return chosen === correct * correct;
            default:    return false;
        }
    }

    function recordAndAnalyze(correctAns, chosenAns, responseMs, conceptId, op) {
        var analysis = analyze(correctAns, chosenAns, responseMs, conceptId, op);
        PlayerModel.record(conceptId, false, responseMs, analysis.type);
        return analysis;
    }

    return { analyze, recordAndAnalyze };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ④ نظام المراجعة المتباعدة — Spaced Repetition
   مبني على خوارزمية SM-2 المُبسَّطة (نفس ما يستخدمه Anki و Duolingo)
═══════════════════════════════════════════════════════════════════════ */

var SpacedRepetition = (function () {

    /* فترات المراجعة المثالية بالأيام حسب الإتقان */
    var INTERVALS = [
        { max:0.3,  days:1  },
        { max:0.5,  days:3  },
        { max:0.7,  days:7  },
        { max:0.9,  days:14 },
        { max:1.01, days:30 }
    ];

    function getInterval(mastery) {
        for (var i=0; i<INTERVALS.length; i++)
            if (mastery <= INTERVALS[i].max) return INTERVALS[i].days;
        return 30;
    }

    function needsReview(conceptId) {
        var data = PlayerModel.getConceptData(conceptId);
        if (!data || !data.lastCorrect) return false;
        var daysSince = (Date.now() - data.lastCorrect) / 86400000;
        return daysSince >= getInterval(data.mastery) || (data.forgettingRisk||0) > 0.65;
    }

    function getDueForReview() {
        var map = PlayerModel.getMasteryMap();
        var due = [];
        Object.keys(map).forEach(function(id) {
            if (needsReview(id)) {
                var data = PlayerModel.getConceptData(id);
                due.push({
                    id:             id,
                    mastery:        data.mastery,
                    forgettingRisk: data.forgettingRisk || 0,
                    daysSince:      data.lastCorrect
                        ? (Date.now()-data.lastCorrect)/86400000 : 999
                });
            }
        });
        return due.sort(function(a,b){ return b.forgettingRisk - a.forgettingRisk; });
    }

    function updateAllRisks() {
        var map = PlayerModel.getMasteryMap();
        var now = Date.now();
        Object.keys(map).forEach(function(id) {
            var data = PlayerModel.getConceptData(id);
            if (!data) return;
            var days     = data.lastCorrect ? (now - data.lastCorrect) / 86400000 : 0;
            var strength = Math.max(0.5, data.mastery * 7);
            data.forgettingRisk = Math.round((1 - Math.exp(-days/strength)) * 100) / 100;
        });
    }

    return { needsReview, getDueForReview, getInterval, updateAllRisks };
})();


/* ═══════════════════════════════════════════════════════════════════════
   واجهة التكامل الرئيسية — SmartAI
   هذا هو الكائن الوحيد الذي يُستدعى من خارج هذا الملف
═══════════════════════════════════════════════════════════════════════ */

var SmartAI = (function () {

    /* ربط كل عملية بمعرّف المفهوم المقابل */
    var OP_CONCEPT = {
        'add':             'add_simple',
        'sub':             'sub_simple',
        'mul':             'mul_table',
        'div':             'div_simple',
        'percent':         'percent_basic',
        'fraction_simple': 'fraction_add_same',
        'fraction_add':    'fraction_add_diff',
        'fraction_mul':    'fraction_mul',
        'power':           'power_basic',
        'sqrt':            'sqrt_basic',
        'equation_simple': 'equation_simple',
        'algebra':         'equation_linear',
        'equation_quad':   'equation_quad',
        'sequence':        'seq_arith',
        'geo_area':        'geo_area_basic',
        'log_simple':      'log_basic',
        'word_add':        'word_add',
        'word_mul':        'word_mul',
        'word_hard':       'word_multi_step',
        'word_genius':     'word_genius',
        'table':           'mul_table',
        'adv_trig':        'trig_basic',
        'adv_roots':       'sqrt_basic',
        'adv_log':         'log_basic',
        'adv_geo':         'geo_area_circle',
        'adv_eq':          'equation_linear',
        'adv_seq':         'seq_special'
    };

    function conceptOf(op) { return OP_CONCEPT[op] || op; }

    /* ─── يُستدعى عند الإجابة الصحيحة ─── */
    function onCorrect(op, responseMs) {
        var id = conceptOf(op);
        PlayerModel.record(id, true, responseMs, null);
        if (typeof AdaptiveAI !== 'undefined') AdaptiveAI.record(op, true);
    }

    /* ─── يُستدعى عند الإجابة الخاطئة ─── */
    function onWrong(op, correctAns, chosenAns, responseMs) {
        var id       = conceptOf(op);
        var analysis = ErrorAnalyzer.recordAndAnalyze(correctAns, chosenAns, responseMs, id, op);
        if (typeof AdaptiveAI !== 'undefined') AdaptiveAI.record(op, false);
        return analysis; /* يُمكن عرض analysis.suggestion للاعب */
    }

    /* ─── يُستدعى عند بدء كل لعبة ─── */
    function onGameStart() {
        PlayerModel.resetSession();
        SpacedRepetition.updateAllRisks();
    }

    /* ─── تقرير كامل عن اللاعب ─── */
    function getReport() {
        return {
            summary:      PlayerModel.getSummary(),
            needsReview:  SpacedRepetition.getDueForReview().slice(0, 5),
            topErrors:    _topErrors()
        };
    }

    function _topErrors() {
        var m = (typeof st!=='undefined' && st._playerModel) ? st._playerModel : null;
        if (!m) return [];
        return Object.keys(m.errorPatterns||{})
            .map(function(t){ return {type:t, count:m.errorPatterns[t]}; })
            .sort(function(a,b){ return b.count-a.count; })
            .slice(0,3);
    }

    /* ─── هل يجب مراجعة مفهوم معين؟ ─── */
    function shouldReview(op) {
        return SpacedRepetition.needsReview(conceptOf(op));
    }

    /* ─── مستوى إتقان مفهوم ─── */
    function masteryOf(op) {
        return PlayerModel.getMastery(conceptOf(op));
    }

    return { onCorrect, onWrong, onGameStart, getReport, shouldReview, masteryOf, conceptOf };
})();


/* ═══════════════════════════════════════════════════════════════════════
   المرحلة الثانية — محرك القرار الذكي
   ═══════════════════════════════════════════════════════════════════════

   هذا هو عقل النظام. يُجيب على سؤال واحد فقط:
   "ما هو السؤال الأمثل الذي يجب أن يُعطى للاعب الآن؟"

   منطق الأولويات (من الأعلى للأدنى):
     ① مراجعة ضرورية  — مفهوم بخطر نسيان عالٍ (> 0.65)
     ② علاج ضعف       — مفهوم إتقانه منخفض جداً (< 0.35) لكن اللاعب مرّ عليه
     ③ تحدٍّ جديد      — مفهوم مفتوح جاهز للتعلم (إتقان المتطلبات ≥ 0.6)
     ④ تثبيت معرفة    — مفهوم إتقانه متوسط (0.35–0.75) يحتاج تقوية
     ⑤ اختيار المستوى — الوضع الافتراضي إذا لم ينطبق أي مما سبق

═══════════════════════════════════════════════════════════════════════ */

var DecisionEngine = (function () {

    /* ─── عتبات القرار ─── */
    var THRESHOLD = {
        URGENT_FORGET:   0.65,  /* خطر نسيان عالٍ → مراجعة فورية */
        WEAK_MASTERY:    0.35,  /* إتقان منخفض → علاج */
        SOLID_MASTERY:   0.75,  /* إتقان جيد → جاهز للتقدم */
        UNLOCK_REQUIRE:  0.60,  /* الحد الأدنى لفتح مفهوم جديد */
        FATIGUE_HIGH:    0.70   /* تعب مرتفع → أسئلة أسهل */
    };

    /* ─── أنواع قرارات النظام ─── */
    var DECISION = {
        URGENT_REVIEW:   'urgent_review',   /* مراجعة عاجلة لمفهوم ينُسى */
        HEAL_WEAKNESS:   'heal_weakness',   /* علاج ضعف موجود */
        NEW_CHALLENGE:   'new_challenge',   /* تحدٍّ بمفهوم جديد */
        REINFORCE:       'reinforce',       /* تثبيت معرفة متوسطة */
        LEVEL_DEFAULT:   'level_default'    /* اتباع منطق المستوى الاعتيادي */
    };

    /* ─── القرار الرئيسي ─── */
    function decide(currentOp, levelConfig) {
        var masteryMap  = PlayerModel.getMasteryMap();
        var session     = PlayerModel.getSession();
        var isFatigued  = session.fatigue >= THRESHOLD.FATIGUE_HIGH;

        /* ① تحقق: هل هناك مفهوم على وشك أن يُنسى؟ */
        var urgentReview = _findUrgentReview(masteryMap);
        if (urgentReview) {
            return {
                type:      DECISION.URGENT_REVIEW,
                conceptId: urgentReview.id,
                op:        _conceptToOp(urgentReview.id),
                diff:      isFatigued ? 'easy' : _masteryToDiff(urgentReview.mastery),
                reason:    'خطر النسيان: ' + Math.round(urgentReview.forgettingRisk * 100) + '%'
            };
        }

        /* ② تحقق: هل هناك ضعف واضح يحتاج علاجاً؟ */
        var weakness = _findWeakness(masteryMap, currentOp);
        if (weakness && !isFatigued) {
            return {
                type:      DECISION.HEAL_WEAKNESS,
                conceptId: weakness.id,
                op:        _conceptToOp(weakness.id),
                diff:      'easy',  /* دائماً سهل عند العلاج */
                reason:    'إتقان منخفض: ' + Math.round(weakness.mastery * 100) + '%'
            };
        }

        /* ③ تحقق: هل اللاعب جاهز لتحدٍّ جديد؟ */
        var newChallenge = _findNewChallenge(masteryMap, currentOp, levelConfig);
        if (newChallenge && !isFatigued) {
            return {
                type:      DECISION.NEW_CHALLENGE,
                conceptId: newChallenge.id,
                op:        _conceptToOp(newChallenge.id),
                diff:      'easy',  /* دائماً يبدأ المفهوم الجديد بسهل */
                reason:    'مفهوم جديد مفتوح: ' + newChallenge.name
            };
        }

        /* ④ تحقق: هل يحتاج تثبيتاً لمفهوم متوسط؟ */
        var reinforce = _findReinforcement(masteryMap, currentOp);
        if (reinforce) {
            return {
                type:      DECISION.REINFORCE,
                conceptId: reinforce.id,
                op:        _conceptToOp(reinforce.id),
                diff:      isFatigued ? 'easy' : _masteryToDiff(reinforce.mastery),
                reason:    'تثبيت: إتقان ' + Math.round(reinforce.mastery * 100) + '%'
            };
        }

        /* ⑤ الافتراضي: اتبع منطق المستوى الحالي */
        return {
            type:      DECISION.LEVEL_DEFAULT,
            conceptId: null,
            op:        currentOp || 'mix',
            diff:      isFatigued ? 'easy' : (levelConfig ? levelConfig.diff : 'medium'),
            reason:    'مسار المستوى الاعتيادي'
        };
    }

    /* ─── إيجاد مفهوم يحتاج مراجعة عاجلة ─── */
    function _findUrgentReview(masteryMap) {
        var candidates = [];
        Object.keys(masteryMap).forEach(function (id) {
            var data = PlayerModel.getConceptData(id);
            if (!data) return;
            if ((data.forgettingRisk || 0) >= THRESHOLD.URGENT_FORGET && data.mastery > 0.3) {
                candidates.push({
                    id:             id,
                    mastery:        data.mastery,
                    forgettingRisk: data.forgettingRisk
                });
            }
        });
        if (!candidates.length) return null;
        /* الأعلى خطر نسيان أولاً */
        candidates.sort(function (a, b) { return b.forgettingRisk - a.forgettingRisk; });
        return candidates[0];
    }

    /* ─── إيجاد ضعف واضح يحتاج علاجاً ─── */
    function _findWeakness(masteryMap, currentOp) {
        /* تجنب نفس المفهوم الحالي للتنويع */
        var currentConcept = SmartAI.conceptOf(currentOp || 'mix');
        var candidates = [];

        Object.keys(masteryMap).forEach(function (id) {
            if (id === currentConcept) return;
            var mastery = masteryMap[id];
            var data    = PlayerModel.getConceptData(id);
            /* ضعيف: إتقان منخفض + محاولات سابقة (ليس مجهولاً) */
            if (mastery < THRESHOLD.WEAK_MASTERY && data && data.attempts >= 3) {
                candidates.push({ id: id, mastery: mastery, attempts: data.attempts });
            }
        });

        if (!candidates.length) return null;
        /* الأضعف أولاً */
        candidates.sort(function (a, b) { return a.mastery - b.mastery; });
        return candidates[0];
    }

    /* ─── إيجاد مفهوم جديد يمكن تعلمه الآن ─── */
    function _findNewChallenge(masteryMap, currentOp, levelConfig) {
        /* فقط إذا كان الإتقان الحالي جيداً */
        var currentConcept = SmartAI.conceptOf(currentOp || 'mix');
        var currentMastery = masteryMap[currentConcept] || 0;
        if (currentMastery < THRESHOLD.SOLID_MASTERY) return null;

        /* إيجاد المفاهيم التي أُتقنت متطلباتها */
        var levelMax = levelConfig ? levelConfig.level : 200;
        var candidates = KNOWLEDGE_MAP.all.filter(function (concept) {
            /* لم يُرَ بعد أو إتقانه صفر */
            if ((masteryMap[concept.id] || 0) > 0.15) return false;
            /* ليس أصعب من المستوى الحالي بكثير */
            if (concept.difficulty > Math.ceil(levelMax / 20) + 3) return false;
            /* متطلباته مكتملة */
            return KNOWLEDGE_MAP.isUnlocked(concept.id, masteryMap);
        });

        if (!candidates.length) return null;
        /* أسهل مفهوم جديد أولاً */
        candidates.sort(function (a, b) { return a.difficulty - b.difficulty; });
        return candidates[0];
    }

    /* ─── إيجاد مفهوم يحتاج تثبيتاً ─── */
    function _findReinforcement(masteryMap, currentOp) {
        var currentConcept = SmartAI.conceptOf(currentOp || 'mix');
        var session        = PlayerModel.getSession();
        var candidates     = [];

        Object.keys(masteryMap).forEach(function (id) {
            if (id === currentConcept) return;
            var mastery = masteryMap[id];
            /* متوسط: بين الضعيف والجيد */
            if (mastery >= THRESHOLD.WEAK_MASTERY && mastery < THRESHOLD.SOLID_MASTERY) {
                var data = PlayerModel.getConceptData(id);
                candidates.push({ id: id, mastery: mastery,
                                  lastSeen: data ? data.lastSeen : 0 });
            }
        });

        if (!candidates.length) return null;
        /* الأقدم مشاهدة أولاً (لم يتدرب عليه منذ فترة) */
        candidates.sort(function (a, b) { return a.lastSeen - b.lastSeen; });
        return candidates[0];
    }

    /* ─── تحويل معرّف المفهوم → عملية النظام الحالي ─── */
    function _conceptToOp(conceptId) {
        var concept = KNOWLEDGE_MAP.get(conceptId);
        if (!concept || !concept.ops || !concept.ops.length) return 'mix';
        return concept.ops[0];
    }

    /* ─── تحويل مستوى الإتقان → صعوبة ─── */
    function _masteryToDiff(mastery) {
        if (mastery < 0.3) return 'easy';
        if (mastery < 0.6) return 'medium';
        if (mastery < 0.85) return 'hard';
        return 'genius';
    }

    /* ─── توليد سؤال ذكي بناءً على القرار ─── */
    /*
     * هذه الدالة هي نقطة التكامل الحقيقية مع النظام الحالي.
     * تستدعي genSmartQ الموجودة لكن بمعاملات محسوبة بذكاء.
     */
    function getNextQuestion(levelConfig) {
        /* القرار الذكي */
        var currentOp = (typeof st !== 'undefined' && st.lastOp) ? st.lastOp : 'mix';
        var decision  = decide(currentOp, levelConfig);

        /* حفظ القرار للتشخيص */
        try {
            if (typeof st !== 'undefined') st._lastDecision = decision;
        } catch(e) {}

        /* استدعاء المولّد الحالي بالمعاملات الذكية */
        if (typeof genSmartQ === 'function') {
            var q = genSmartQ(decision.op, decision.diff, false);
            if (q) {
                q._decisionType   = decision.type;
                q._decisionReason = decision.reason;
                return q;
            }
        }

        /* احتياطي: إذا فشل genSmartQ */
        return null;
    }

    /* ─── تشخيص: ماذا سيفعل النظام الآن؟ ─── */
    function diagnose() {
        var masteryMap = PlayerModel.getMasteryMap();
        var session    = PlayerModel.getSession();
        var decision   = decide(
            (typeof st !== 'undefined' && st.lastOp) ? st.lastOp : 'mix',
            null
        );
        var due = SpacedRepetition.getDueForReview();

        return {
            decision:       decision,
            session:        session,
            masteryMap:     masteryMap,
            dueForReview:   due.slice(0, 5),
            playerSummary:  PlayerModel.getSummary()
        };
    }

    return { decide, getNextQuestion, diagnose, DECISION, THRESHOLD };
})();


/* ═══════════════════════════════════════════════════════════════════════
   توسيع SmartAI بقدرات المرحلة الثانية
═══════════════════════════════════════════════════════════════════════ */

/* إضافة getNextQuestion و diagnose إلى SmartAI الموجود */
(function () {
    SmartAI.getNextQuestion = function (levelConfig) {
        return DecisionEngine.getNextQuestion(levelConfig);
    };

    SmartAI.diagnose = function () {
        return DecisionEngine.diagnose();
    };

    SmartAI.getDecision = function (op, levelConfig) {
        return DecisionEngine.decide(op || 'mix', levelConfig || null);
    };
})();


/* ─── تهيئة تلقائية عند تحميل الصفحة ─── */
(function () {
    try { SpacedRepetition.updateAllRisks(); } catch(e) {}
})();



/* ═══════════════════════════════════════════════════════════════════════
   ══════════════════════════════════════════════════════════════════════
   المرحلة الثانية — محرك القرار الذكي
   ══════════════════════════════════════════════════════════════════════
   ② محرك القرار   — يختار المفهوم الأمثل للسؤال القادم
   ③ نظام الأولوية — يوازن بين التعلم والمراجعة والتحدي
   ④ تكيّف الصعوبة — يضبط صعوبة السؤال حسب أداء اللاعب اللحظي
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   محرك القرار — DecisionEngine
   القلب النابض للنظام: يقرر ماذا يسأل اللاعب بعد كل سؤال
═══════════════════════════════════════════════════════════════════════ */

var DecisionEngine = (function () {

    /*
     * أوزان أولوية اختيار نوع السؤال التالي:
     *
     *  REVIEW    — مراجعة مفهوم قريب من النسيان
     *  WEAK      — تقوية مفهوم ضعيف (mastery < 0.4)
     *  PRACTICE  — تدريب مفهوم متوسط (mastery 0.4 → 0.75)
     *  CHALLENGE — تحدٍّ بمفهوم جديد (mastery > 0.75)
     *  FATIGUE   — سؤال سهل عند الإرهاق
     */
    var PRIORITY = {
        REVIEW:    5,
        WEAK:      4,
        PRACTICE:  3,
        CHALLENGE: 2,
        FATIGUE:   6   /* الأعلى — اللاعب المرهق يأخذ استراحة خفيفة */
    };

    /* حدود الإتقان لكل حالة */
    var MASTERY = {
        WEAK_MAX:      0.40,
        PRACTICE_MIN:  0.40,
        PRACTICE_MAX:  0.75,
        CHALLENGE_MIN: 0.75
    };

    /* حد الإرهاق */
    var FATIGUE_THRESHOLD = 0.65;

    /* ─── اختيار المفهوم الأمثل للسؤال القادم ─── */
    /*
     * المدخلات:
     *   currentOp   — العملية الحالية للعبة (مثل 'mix', 'add', 'fraction_add')
     *   gameMode    — وضع اللعبة (مثل 'classic', 'survival', 'rocket')
     *   gameLevel   — مستوى اللعبة الحالي (1-200)
     *
     * المخرجات:
     *   { conceptId, op, difficulty, reason }
     *   reason — لماذا اختار هذا المفهوم (للتشخيص)
     */
    function decide(currentOp, gameMode, gameLevel) {

        var masteryMap = PlayerModel.getMasteryMap();
        var session    = PlayerModel.getSession();
        var result     = { conceptId: null, op: currentOp, difficulty: 'medium', reason: 'default' };

        /* ① فحص الإرهاق أولاً */
        if (session.fatigue >= FATIGUE_THRESHOLD) {
            result = _handleFatigue(currentOp, masteryMap);
            if (result) return result;
        }

        /* ② المفاهيم المتاحة للاعب حسب مستواه */
        var available = _getAvailableConcepts(currentOp, gameLevel, masteryMap);
        if (available.length === 0) {
            return { conceptId: null, op: currentOp, difficulty: 'medium', reason: 'no_concepts' };
        }

        /* ③ فحص المراجعة العاجلة */
        var reviewTarget = _findReviewTarget(available, masteryMap);
        if (reviewTarget) {
            return {
                conceptId:  reviewTarget.id,
                op:         _conceptToOp(reviewTarget.id),
                difficulty: _adjustDifficulty(reviewTarget, 'review', session),
                reason:     'review_due'
            };
        }

        /* ④ فحص المفاهيم الضعيفة جداً */
        var weakTarget = _findWeakTarget(available, masteryMap);
        if (weakTarget) {
            return {
                conceptId:  weakTarget.id,
                op:         _conceptToOp(weakTarget.id),
                difficulty: _adjustDifficulty(weakTarget, 'weak', session),
                reason:     'strengthen_weak'
            };
        }

        /* ⑤ في وضع البقاء/الصاروخ — زد الضغط */
        if (gameMode === 'survival' || gameMode === 'rocket') {
            return _handlePressureMode(available, masteryMap, session, gameMode);
        }

        /* ⑥ الوضع الاعتيادي — توازن بين التدريب والتحدي */
        return _handleNormalMode(available, masteryMap, session, gameLevel);
    }

    /* ─── جلب المفاهيم المتاحة حسب المستوى والعملية ─── */
    function _getAvailableConcepts(currentOp, gameLevel, masteryMap) {

        /* إذا كانت العملية محددة (مش mix) نأخذ مفاهيمها فقط */
        var pool;
        if (currentOp && currentOp !== 'mix') {
            pool = KNOWLEDGE_MAP.byOp(currentOp);
        } else {
            /* وضع مختلط — نأخذ كل المفاهيم المتاحة للمستوى */
            pool = KNOWLEDGE_MAP.all.filter(function (c) {
                return c.difficulty <= Math.ceil(gameLevel / 20) + 2;
            });
        }

        /* نُضيف فقط المفاهيم التي فُتحت (متطلباتها مُتقنة) */
        return pool.filter(function (c) {
            return KNOWLEDGE_MAP.isUnlocked(c.id, masteryMap) || (masteryMap[c.id] || 0) > 0;
        });
    }

    /* ─── إيجاد مفهوم يحتاج مراجعة عاجلة ─── */
    function _findReviewTarget(available, masteryMap) {
        var candidates = available.filter(function (c) {
            var data = PlayerModel.getConceptData(c.id);
            if (!data) return false;
            return SpacedRepetition.needsReview(c.id) && data.mastery >= 0.3;
        });

        if (candidates.length === 0) return null;

        /* أعلى خطر نسيان أولاً */
        candidates.sort(function (a, b) {
            var da = PlayerModel.getConceptData(a.id);
            var db = PlayerModel.getConceptData(b.id);
            return (db.forgettingRisk || 0) - (da.forgettingRisk || 0);
        });

        return candidates[0];
    }

    /* ─── إيجاد أضعف مفهوم يحتاج تقوية ─── */
    function _findWeakTarget(available, masteryMap) {
        var weak = available.filter(function (c) {
            return (masteryMap[c.id] || 0) < MASTERY.WEAK_MAX;
        });

        if (weak.length === 0) return null;

        /* الأضعف أولاً */
        weak.sort(function (a, b) {
            return (masteryMap[a.id] || 0) - (masteryMap[b.id] || 0);
        });

        return weak[0];
    }

    /* ─── وضع الضغط (survival / rocket) ─── */
    function _handlePressureMode(available, masteryMap, session, gameMode) {

        /* في الضغط: نختار مفهوماً متوسط الإتقان لخلق توتر حقيقي */
        var midRange = available.filter(function (c) {
            var m = masteryMap[c.id] || 0;
            return m >= MASTERY.PRACTICE_MIN && m < MASTERY.PRACTICE_MAX;
        });

        if (midRange.length === 0) midRange = available;

        /* نختار عشوائياً من أعلى 3 بالصعوبة */
        midRange.sort(function (a, b) { return b.difficulty - a.difficulty; });
        var top3    = midRange.slice(0, 3);
        var chosen  = top3[Math.floor(Math.random() * top3.length)];

        return {
            conceptId:  chosen.id,
            op:         _conceptToOp(chosen.id),
            difficulty: gameMode === 'survival' ? 'hard' : 'medium',
            reason:     'pressure_mode'
        };
    }

    /* ─── الوضع الاعتيادي — توازن ذكي ─── */
    function _handleNormalMode(available, masteryMap, session, gameLevel) {

        /* قرار ذكي: 60% تدريب، 30% تحدي، 10% مفهوم جديد */
        var roll = Math.random();

        if (roll < 0.60) {
            /* تدريب — مفهوم في نطاق التدريب */
            var practice = available.filter(function (c) {
                var m = masteryMap[c.id] || 0;
                return m >= MASTERY.PRACTICE_MIN && m < MASTERY.PRACTICE_MAX;
            });
            if (practice.length > 0) {
                var chosen = practice[Math.floor(Math.random() * practice.length)];
                return {
                    conceptId:  chosen.id,
                    op:         _conceptToOp(chosen.id),
                    difficulty: 'medium',
                    reason:     'practice'
                };
            }
        }

        if (roll < 0.90) {
            /* تحدٍّ — مفهوم أُتقن → سؤال بمفهوم أصعب */
            var mastered = available.filter(function (c) {
                return (masteryMap[c.id] || 0) >= MASTERY.CHALLENGE_MIN;
            });
            if (mastered.length > 0) {
                /* ابحث عن مفهوم يأتي بعده */
                var nextConcepts = [];
                mastered.forEach(function (c) {
                    var deps = KNOWLEDGE_MAP.dependents(c.id);
                    deps.forEach(function (d) {
                        if ((masteryMap[d.id] || 0) < 0.6) nextConcepts.push(d);
                    });
                });
                if (nextConcepts.length > 0) {
                    var next = nextConcepts[Math.floor(Math.random() * nextConcepts.length)];
                    return {
                        conceptId:  next.id,
                        op:         _conceptToOp(next.id),
                        difficulty: 'medium',
                        reason:     'challenge_new'
                    };
                }
            }
        }

        /* مفهوم عشوائي من المتاح */
        var fallback = available[Math.floor(Math.random() * available.length)];
        return {
            conceptId:  fallback.id,
            op:         _conceptToOp(fallback.id),
            difficulty: 'easy',
            reason:     'fallback'
        };
    }

    /* ─── معالجة الإرهاق ─── */
    function _handleFatigue(currentOp, masteryMap) {

        /* عند الإرهاق: سؤال بمفهوم يتقنه اللاعب جيداً بصعوبة سهلة */
        var strong = Object.keys(masteryMap)
            .filter(function (id) { return masteryMap[id] >= 0.7; })
            .map(function (id) { return KNOWLEDGE_MAP.get(id); })
            .filter(Boolean);

        if (strong.length === 0) return null;

        var chosen = strong[Math.floor(Math.random() * strong.length)];
        return {
            conceptId:  chosen.id,
            op:         _conceptToOp(chosen.id),
            difficulty: 'easy',
            reason:     'fatigue_relief'
        };
    }

    /* ─── ضبط الصعوبة حسب السياق ─── */
    function _adjustDifficulty(concept, context, session) {
        var mastery = PlayerModel.getMastery(concept.id);
        var streak  = session.streak || 0;

        switch (context) {
            case 'review':
                /* مراجعة: صعوبة أقل قليلاً لإعادة بناء الثقة */
                return mastery > 0.6 ? 'medium' : 'easy';

            case 'weak':
                /* تقوية: ابدأ سهلاً ثم ارفع تدريجياً */
                if (streak >= 3) return 'medium'; /* ٣ متتالية صح → ارفع */
                return 'easy';

            default:
                if (mastery > 0.8 && streak >= 2) return 'hard';
                if (mastery > 0.5) return 'medium';
                return 'easy';
        }
    }

    /* ─── تحويل معرّف المفهوم إلى عملية ─── */
    var _CONCEPT_OP = {
        'count':            'add',
        'add_simple':       'add',
        'add_carry':        'add',
        'sub_simple':       'sub',
        'sub_borrow':       'sub',
        'mul_table':        'mul',
        'mul_multi':        'mul',
        'div_simple':       'div',
        'div_remainder':    'div',
        'percent_basic':    'percent',
        'percent_reverse':  'percent',
        'percent_change':   'percent',
        'fraction_concept': 'fraction_simple',
        'fraction_add_same':'fraction_simple',
        'fraction_add_diff':'fraction_add',
        'fraction_mul':     'fraction_mul',
        'power_basic':      'power',
        'power_laws':       'power',
        'sqrt_basic':       'sqrt',
        'equation_simple':  'equation_simple',
        'equation_linear':  'algebra',
        'equation_quad':    'equation_quad',
        'seq_arith':        'sequence',
        'seq_geo':          'sequence',
        'seq_special':      'adv_seq',
        'geo_area_basic':   'geo_area',
        'geo_area_tri':     'geo_area',
        'geo_area_circle':  'adv_geo',
        'geo_pythagoras':   'adv_geo',
        'geo_volume':       'adv_geo',
        'log_basic':        'log_simple',
        'trig_basic':       'adv_trig',
        'word_add':         'word_add',
        'word_mul':         'word_mul',
        'word_multi_step':  'word_hard',
        'word_genius':      'word_genius'
    };

    function _conceptToOp(conceptId) {
        return _CONCEPT_OP[conceptId] || 'add';
    }

    return { decide: decide, conceptToOp: _conceptToOp };
})();


/* ═══════════════════════════════════════════════════════════════════════
   نظام تكيّف الصعوبة اللحظي — LiveDifficultyAdapter
   يضبط الصعوبة في الوقت الحقيقي حسب أداء اللاعب خلال الجلسة
═══════════════════════════════════════════════════════════════════════ */

var LiveDifficultyAdapter = (function () {

    /*
     * منطق الضبط:
     *  ٣ صح متتالية   → ارفع الصعوبة
     *  ٢ خطأ متتالية  → اخفض الصعوبة
     *  اللاعب بطيء    → أبق الصعوبة أو اخفض
     *  وقت إجابة سريع جداً + خطأ → لا تغيّر (تخمين)
     */

    var _DIFF_ORDER = ['easy', 'medium', 'hard', 'genius'];

    /* سجل آخر 5 إجابات للجلسة الحالية */
    var _recentAnswers = [];
    var _currentDiffIdx = 1; /* يبدأ من medium */

    /* إعادة ضبط عند بداية كل لعبة */
    function reset(startDiff) {
        _recentAnswers  = [];
        _currentDiffIdx = _DIFF_ORDER.indexOf(startDiff || 'medium');
        if (_currentDiffIdx < 0) _currentDiffIdx = 1;
    }

    /* تسجيل نتيجة وتحديث الصعوبة */
    function update(isCorrect, responseMs, avgTimeMs) {
        _recentAnswers.push({ correct: isCorrect, ms: responseMs });
        if (_recentAnswers.length > 5) _recentAnswers.shift();

        var lastN   = _recentAnswers;
        var correct = lastN.filter(function (r) { return r.correct; }).length;
        var total   = lastN.length;

        if (total < 2) return _DIFF_ORDER[_currentDiffIdx]; /* انتظر بيانات أكثر */

        var rate = correct / total;

        /* ارفع الصعوبة */
        if (rate >= 0.80 && total >= 3 && _currentDiffIdx < _DIFF_ORDER.length - 1) {
            _currentDiffIdx++;
        }
        /* اخفض الصعوبة */
        else if (rate <= 0.40 && _currentDiffIdx > 0) {
            _currentDiffIdx--;
        }
        /* تعديل بناءً على الوقت */
        else if (avgTimeMs > 0 && responseMs > avgTimeMs * 2.0 && _currentDiffIdx > 0) {
            /* بطيء جداً — اخفض */
            _currentDiffIdx = Math.max(0, _currentDiffIdx - 1);
        }

        return _DIFF_ORDER[_currentDiffIdx];
    }

    /* الصعوبة الحالية */
    function getCurrent() {
        return _DIFF_ORDER[Math.max(0, Math.min(_currentDiffIdx, _DIFF_ORDER.length - 1))];
    }

    /* نسبة الدقة في النافذة الأخيرة (للعرض) */
    function getRecentAccuracy() {
        if (_recentAnswers.length === 0) return null;
        var c = _recentAnswers.filter(function (r) { return r.correct; }).length;
        return Math.round(c / _recentAnswers.length * 100);
    }

    return { reset, update, getCurrent, getRecentAccuracy };
})();


/* ═══════════════════════════════════════════════════════════════════════
   نظام التحفيز الذكي — FeedbackEngine
   يولّد رسائل تشجيع ذكية مرتبطة بنوع الأداء الفعلي
═══════════════════════════════════════════════════════════════════════ */

var FeedbackEngine = (function () {

    /* رسائل مصنّفة حسب الموقف */
    var MESSAGES = {

        /* إجابة صحيحة — عام */
        correct_normal: [
            'ممتاز! 🌟',
            'أحسنت! 👏',
            'صحيح تماماً! ✅',
            'رائع! واصل! 💪'
        ],

        /* سلسلة صح ≥ 3 */
        correct_streak: [
            '🔥 ثلاثة متتالية! لا يوقفك شيء!',
            '⚡ متتالية رائعة! أنت في القمة!',
            '🚀 استمر، أنت في حالة ممتازة!'
        ],

        /* صح بعد سلسلة خطأ */
        correct_comeback: [
            '💡 هذه هي! استعدت إيقاعك!',
            '🌈 أحسنت! الأخطاء هي طريق التعلم!',
            '✨ نجحت! الآن أنت تفهمه أكثر!'
        ],

        /* خطأ — تسرّع */
        wrong_careless: [
            '⏰ تمهّل، اقرأ السؤال بتركيز!',
            '🎯 قريب جداً! خذ وقتك في المرة القادمة.',
            '💭 لا تتسرّع، أنت قادر على الإجابة الصحيحة!'
        ],

        /* خطأ — لا يفهم المفهوم */
        wrong_conceptual: [
            '📚 هذا المفهوم يحتاج مراجعة، تعلّمت شيئاً جديداً اليوم!',
            '🧠 لا بأس! هذا المفهوم يحتاج تدريباً أكثر.',
            '💡 راجع الشرح، ستفهمه بالتأكيد!'
        ],

        /* خطأ — خطأ حسابي بسيط */
        wrong_arithmetic: [
            '🔢 خطأ حسابي صغير! أعد الحساب ببطء.',
            '📐 كدت تصيب! راجع خطوة الحساب.',
            '✏️ قريب جداً! تحقق من العملية الحسابية.'
        ],

        /* خطأ — نسيان */
        wrong_forgetting: [
            '🔄 مضى وقت على هذا المفهوم، حان وقت المراجعة!',
            '📅 ذكرّك النظام بهذا المفهوم لأنك لم تراجعه مؤخراً.',
            '🧩 مراجعة قصيرة وستستعيد المعلومة بالكامل!'
        ],

        /* مفهوم جديد */
        new_concept: [
            '🌱 مفهوم جديد! خذ وقتك في الفهم.',
            '🎓 تحدٍّ جديد يبدأ! هل أنت مستعد؟',
            '⭐ مبروك على الوصول لمستوى جديد!'
        ],

        /* وقت المراجعة */
        review_time: [
            '🔄 وقت مراجعة سريعة لتثبيت ما تعلمته!',
            '📖 مراجعة ذكية لا تنسى المعلومات!',
            '🎯 سؤال مراجعة — هل لا تزال تتذكره؟'
        ]
    };

    /* اختيار رسالة عشوائية من مجموعة */
    function _pick(group) {
        var list = MESSAGES[group];
        if (!list || list.length === 0) return '';
        return list[Math.floor(Math.random() * list.length)];
    }

    /* الرسالة المناسبة للإجابة الصحيحة */
    function onCorrect(streak, wasWrongBefore) {
        if (wasWrongBefore)      return _pick('correct_comeback');
        if (streak >= 3)         return _pick('correct_streak');
        return _pick('correct_normal');
    }

    /* الرسالة المناسبة للإجابة الخاطئة */
    function onWrong(errorType) {
        switch (errorType) {
            case 'careless':   return _pick('wrong_careless');
            case 'conceptual': return _pick('wrong_conceptual');
            case 'arithmetic': return _pick('wrong_arithmetic');
            case 'forgetting': return _pick('wrong_forgetting');
            default:           return _pick('wrong_arithmetic');
        }
    }

    /* رسالة عند بداية مفهوم جديد */
    function onNewConcept() { return _pick('new_concept'); }

    /* رسالة عند سؤال مراجعة */
    function onReview() { return _pick('review_time'); }

    return { onCorrect, onWrong, onNewConcept, onReview };
})();


/* ═══════════════════════════════════════════════════════════════════════
   تحديث SmartAI لدمج المرحلة الثانية
   نُضيف الدوال الجديدة إلى الكائن الموجود
═══════════════════════════════════════════════════════════════════════ */

;(function () {

    /* حفظ مرجع للكائن الأصلي */
    var _orig = SmartAI;

    /* الدالة الرئيسية الموحّدة للحصول على السؤال التالي */
    _orig.getNextDecision = function (currentOp, gameMode, gameLevel) {
        return DecisionEngine.decide(currentOp, gameMode || 'classic', gameLevel || 1);
    };

    /* تسجيل إجابة صحيحة مع تحديث الصعوبة الحية */
    _orig.onCorrectFull = function (op, responseMs) {
        var session = PlayerModel.getSession();
        _orig.onCorrect(op, responseMs);
        var newDiff = LiveDifficultyAdapter.update(true, responseMs, session.avgResponseMs);
        var streak  = (PlayerModel.getSession().streak || 0);
        return {
            newDifficulty: newDiff,
            message:       FeedbackEngine.onCorrect(streak, false),
            accuracy:      LiveDifficultyAdapter.getRecentAccuracy()
        };
    };

    /* تسجيل إجابة خاطئة مع تحديث الصعوبة الحية */
    _orig.onWrongFull = function (op, correctAns, chosenAns, responseMs) {
        var session  = PlayerModel.getSession();
        var analysis = _orig.onWrong(op, correctAns, chosenAns, responseMs);
        var newDiff  = LiveDifficultyAdapter.update(false, responseMs, session.avgResponseMs);
        return {
            analysis:      analysis,
            newDifficulty: newDiff,
            message:       FeedbackEngine.onWrong(analysis.type),
            suggestion:    analysis.suggestion,
            accuracy:      LiveDifficultyAdapter.getRecentAccuracy()
        };
    };

    /* بداية اللعبة مع تهيئة الصعوبة الحية */
    _orig.onGameStartFull = function (startDiff) {
        _orig.onGameStart();
        LiveDifficultyAdapter.reset(startDiff || 'medium');
    };

    /* الصعوبة الحالية الموصى بها */
    _orig.getCurrentDiff = function () {
        return LiveDifficultyAdapter.getCurrent();
    };

    /* تقرير شامل موسّع */
    _orig.getFullReport = function () {
        var base = _orig.getReport();
        base.currentDifficulty = LiveDifficultyAdapter.getCurrent();
        base.recentAccuracy    = LiveDifficultyAdapter.getRecentAccuracy();
        base.session           = PlayerModel.getSession();
        return base;
    };

    /* رسائل التحفيز مباشرة */
    _orig.feedback = FeedbackEngine;

})();



/* ═══════════════════════════════════════════════════════════════════════
   ══════════════════════════════════════════════════════════════════════
   المرحلة الثالثة — مولّد الأسئلة الذكي المبني على القوانين
   ══════════════════════════════════════════════════════════════════════

   البنية:
     ① بنك القوانين   — كل قانون رياضي بصيغة قابلة للتوليد
     ② بنك القوالب    — جمل كلامية متنوعة لكل نوع مسألة
     ③ مولّد الأرقام  — يضع أرقاماً مضمونة الصحة حسب الصعوبة
     ④ مولّد السؤال   — يجمع القانون + القالب + الأرقام
     ⑤ التكامل النهائي— يربط كل شيء مع genSmartQ الموجود
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   ① بنك القوانين الرياضية
   كل قانون يحتوي على:
     id         — معرف فريد
     conceptId  — المفهوم المرتبط به
     name       — اسم القانون
     formula    — الصيغة الرياضية للعرض
     generate   — دالة تنتج {a, b, c, ans, steps, formula_applied}
     validate   — دالة تتحقق من صحة الأرقام
     difficulty — الصعوبات المدعومة
═══════════════════════════════════════════════════════════════════════ */

var LAW_BANK = (function () {

    /* دالة مساعدة — عدد صحيح عشوائي في نطاق */
    function r(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* دالة GCD */
    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

    /* دالة LCM */
    function lcm(a, b) { return a * b / gcd(a, b); }

    /* تبسيط كسر → نص */
    function fracStr(n, d) {
        var g = gcd(Math.abs(n), Math.abs(d));
        var sn = n/g, sd = d/g;
        if (sd === 1) return String(sn);
        if (sn > sd)  {
            var w = Math.floor(sn/sd), rem = sn % sd;
            return rem === 0 ? String(w) : w + ' و ' + rem + '/' + sd;
        }
        return sn + '/' + sd;
    }

    /* نطاقات الأرقام حسب الصعوبة */
    var RANGES = {
        easy:   { small:[2,9],  mid:[2,5],  big:[10,50]  },
        medium: { small:[5,20], mid:[3,9],  big:[20,100] },
        hard:   { small:[10,50],mid:[5,15], big:[50,500] },
        genius: { small:[20,99],mid:[7,20], big:[100,999]}
    };

    function range(diff, type) {
        var rg = RANGES[diff] || RANGES.medium;
        return rg[type] || rg.small;
    }

    /* ═══ تعريف القوانين ═══ */
    var laws = [

        /* ─────────────── الجمع ─────────────── */
        {
            id: 'add_basic', conceptId: 'add_simple',
            name: 'الجمع الأساسي', formula: 'أ + ب = جـ',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var rg = range(diff, diff === 'easy' ? 'small' : 'mid');
                var a = r(rg[0], rg[1]), b = r(rg[0], rg[1]);
                return {
                    a: a, b: b, ans: a + b,
                    steps: [a + ' + ' + b + ' = ' + (a+b)],
                    formula_applied: a + ' + ' + b + ' = ' + (a+b)
                };
            }
        },

        /* ─────────────── الطرح ─────────────── */
        {
            id: 'sub_basic', conceptId: 'sub_simple',
            name: 'الطرح الأساسي', formula: 'أ − ب = جـ',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var rg = range(diff, 'small');
                var b = r(rg[0], rg[1]), a = b + r(1, rg[1]);
                return {
                    a: a, b: b, ans: a - b,
                    steps: [a + ' − ' + b + ' = ' + (a-b)],
                    formula_applied: a + ' − ' + b + ' = ' + (a-b)
                };
            }
        },

        /* ─────────────── الضرب ─────────────── */
        {
            id: 'mul_basic', conceptId: 'mul_table',
            name: 'الضرب الأساسي', formula: 'أ × ب = جـ',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var rg = range(diff, 'mid');
                var a = r(rg[0], rg[1]), b = r(rg[0], rg[1]);
                return {
                    a: a, b: b, ans: a * b,
                    steps: [a + ' × ' + b + ' = ' + (a*b)],
                    formula_applied: a + ' × ' + b + ' = ' + (a*b)
                };
            }
        },

        /* ─────────────── القسمة ─────────────── */
        {
            id: 'div_exact', conceptId: 'div_simple',
            name: 'القسمة التامة', formula: 'أ ÷ ب = جـ',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var rg = range(diff, 'mid');
                var ans = r(rg[0], rg[1]), b = r(2, rg[1]);
                var a = ans * b;
                return {
                    a: a, b: b, ans: ans,
                    steps: [a + ' ÷ ' + b + ' = ' + ans, 'تحقق: ' + ans + ' × ' + b + ' = ' + a + ' ✓'],
                    formula_applied: a + ' ÷ ' + b + ' = ' + ans
                };
            }
        },

        /* ─────────────── النسبة المئوية ─────────────── */
        {
            id: 'percent_of', conceptId: 'percent_basic',
            name: 'إيجاد نسبة من عدد', formula: 'ن% من س = س × ن/١٠٠',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var pcts = diff === 'easy'   ? [10,25,50]
                         : diff === 'medium' ? [10,20,25,50,75]
                         : [5,10,15,20,25,30,40,60,75,80];
                var pct  = pcts[r(0, pcts.length-1)];
                var base = r(2, diff === 'easy' ? 10 : 20) * 10;
                var ans  = Math.round(base * pct / 100);
                return {
                    a: pct, b: base, ans: ans,
                    steps: [
                        pct + '% من ' + base,
                        '= ' + base + ' × ' + pct + '/100',
                        '= ' + base + ' × ' + (pct/100).toFixed(2),
                        '= ' + ans
                    ],
                    formula_applied: pct + '% × ' + base + ' = ' + ans
                };
            }
        },
        {
            id: 'percent_reverse', conceptId: 'percent_reverse',
            name: 'النسبة المئوية العكسية', formula: 'الجزء ÷ الكل × ١٠٠ = النسبة',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var base = r(diff === 'medium' ? 20 : 50, diff === 'hard' ? 200 : 500);
                var pct  = [10,20,25,50,75][r(0,4)];
                var part = Math.round(base * pct / 100);
                return {
                    a: part, b: base, ans: pct,
                    steps: [
                        'النسبة = الجزء ÷ الكل × 100',
                        '= ' + part + ' ÷ ' + base + ' × 100',
                        '= ' + (part/base).toFixed(4) + ' × 100',
                        '= ' + pct + '%'
                    ],
                    formula_applied: '(' + part + ' ÷ ' + base + ') × 100 = ' + pct + '%'
                };
            }
        },

        /* ─────────────── الكسور ─────────────── */
        {
            id: 'frac_add_same', conceptId: 'fraction_add_same',
            name: 'جمع كسور — مقام مشترك', formula: 'أ/ن + ب/ن = (أ+ب)/ن',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var d  = r(3, diff === 'easy' ? 6 : 12);
                var n1 = r(1, d-1), n2 = r(1, d-n1 > 0 ? d-n1 : 1);
                var sn = n1 + n2;
                var g  = gcd(sn, d);
                return {
                    a: n1, b: n2, d: d, ans: sn,
                    steps: [
                        n1 + '/' + d + ' + ' + n2 + '/' + d,
                        '= (' + n1 + '+' + n2 + ')/' + d,
                        '= ' + sn + '/' + d + (g > 1 ? ' = ' + fracStr(sn,d) : '')
                    ],
                    formula_applied: n1 + '/' + d + ' + ' + n2 + '/' + d + ' = ' + fracStr(sn,d)
                };
            }
        },
        {
            id: 'frac_add_diff', conceptId: 'fraction_add_diff',
            name: 'جمع كسور — مقامات مختلفة', formula: 'أ/م + ب/ن = (أ×ن + ب×م)/(م×ن)',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var d1 = r(2,5), d2 = r(2,5);
                var safety = 0;
                while (d2 === d1 && safety++ < 20) d2 = r(2,5);
                if (d2 === d1) d2 = d1 === 5 ? 2 : d1 + 1;
                var n1 = r(1,d1), n2 = r(1,d2);
                var L  = lcm(d1,d2);
                var num = n1*(L/d1) + n2*(L/d2);
                var g   = gcd(num,L);
                return {
                    a: n1, d1: d1, b: n2, d2: d2, ans: num,
                    steps: [
                        n1 + '/' + d1 + ' + ' + n2 + '/' + d2,
                        'المضاعف المشترك = ' + L,
                        '= ' + n1*(L/d1) + '/' + L + ' + ' + n2*(L/d2) + '/' + L,
                        '= ' + num + '/' + L + (g > 1 ? ' = ' + fracStr(num,L) : '')
                    ],
                    formula_applied: n1+'/'+d1+' + '+n2+'/'+d2+' = '+fracStr(num,L)
                };
            }
        },
        {
            id: 'frac_mul', conceptId: 'fraction_mul',
            name: 'ضرب الكسور', formula: 'أ/م × ب/ن = (أ×ب)/(م×ن)',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var n1=r(1,5),d1=r(2,8),n2=r(1,5),d2=r(2,8);
                var np=n1*n2, dp=d1*d2, g=gcd(np,dp);
                return {
                    a:n1, d1:d1, b:n2, d2:d2, ans:np,
                    steps: [
                        n1+'/'+d1+' × '+n2+'/'+d2,
                        '= ('+n1+'×'+n2+') / ('+d1+'×'+d2+')',
                        '= '+np+'/'+dp+(g>1?' = '+fracStr(np,dp):'')
                    ],
                    formula_applied: n1+'/'+d1+' × '+n2+'/'+d2+' = '+fracStr(np,dp)
                };
            }
        },

        /* ─────────────── القوى والجذور ─────────────── */
        {
            id: 'power_nat', conceptId: 'power_basic',
            name: 'القوى الطبيعية', formula: 'أ^ن = أ × أ × … (ن مرة)',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var base = diff==='easy' ? r(2,5)
                         : diff==='medium' ? r(2,9)
                         : r(2,15);
                var exp  = diff==='easy' ? 2 : diff==='medium' ? r(2,3) : r(2,4);
                var ans  = Math.pow(base,exp);
                var muls = [];
                for(var i=0;i<exp;i++) muls.push(base);
                return {
                    a:base, b:exp, ans:ans,
                    steps: [
                        base+'^'+exp+' = '+muls.join(' × '),
                        '= '+ans
                    ],
                    formula_applied: base+'^'+exp+' = '+ans
                };
            }
        },
        {
            id: 'power_law_mul', conceptId: 'power_laws',
            name: 'قانون ضرب الأسس (قاعدة مشتركة)', formula: 'أ^م × أ^ن = أ^(م+ن)',
            difficulty: ['hard','genius'],
            generate: function(diff) {
                var base = r(2,7), e1 = r(2,4), e2 = r(2,4);
                var ans  = e1 + e2;
                return {
                    a:base, e1:e1, e2:e2, ans:ans,
                    steps: [
                        base+'^'+e1+' × '+base+'^'+e2,
                        '= '+base+'^('+e1+'+'+e2+')',
                        '= '+base+'^'+ans
                    ],
                    formula_applied: base+'^'+e1+' × '+base+'^'+e2+' = '+base+'^'+ans
                };
            }
        },
        {
            id: 'sqrt_perfect', conceptId: 'sqrt_basic',
            name: 'الجذر التربيعي للمربعات التامة',
            formula: '√(أ²) = أ',
            difficulty: ['easy','medium','hard','genius'],
            generate: function(diff) {
                var roots = diff==='easy'   ? [4,9,16,25,36]
                          : diff==='medium' ? [4,9,16,25,36,49,64,81,100]
                          : [4,9,16,25,36,49,64,81,100,121,144,169,196,225];
                var n2 = roots[r(0,roots.length-1)];
                var ans = Math.round(Math.sqrt(n2));
                return {
                    a:n2, ans:ans,
                    steps: ['√'+n2+' = ؟', ans+' × '+ans+' = '+n2, '∴ √'+n2+' = '+ans+' ✓'],
                    formula_applied: '√'+n2+' = '+ans
                };
            }
        },

        /* ─────────────── المعادلات ─────────────── */
        {
            id: 'eq_one_step', conceptId: 'equation_simple',
            name: 'معادلة خطوة واحدة', formula: 'أ × س = ب → س = ب ÷ أ',
            difficulty: ['easy','medium'],
            generate: function(diff) {
                var a   = r(2, diff==='easy' ? 9 : 15);
                var ans = r(2, diff==='easy' ? 10 : 20);
                var b   = a * ans;
                return {
                    a:a, b:b, ans:ans,
                    steps: [
                        a+'س = '+b,
                        'س = '+b+' ÷ '+a,
                        'س = '+ans,
                        'تحقق: '+a+'×'+ans+' = '+b+' ✓'
                    ],
                    formula_applied: a+'س = '+b+' → س = '+ans
                };
            }
        },
        {
            id: 'eq_two_step', conceptId: 'equation_linear',
            name: 'معادلة خطوتَين', formula: 'أ × س + ب = جـ → س = (جـ−ب) ÷ أ',
            difficulty: ['medium','hard'],
            generate: function(diff) {
                var a   = r(2, diff==='medium' ? 6 : 10);
                var ans = r(2, diff==='medium' ? 8 : 15);
                var b   = r(1, diff==='medium' ? 10 : 20);
                var c   = a * ans + b;
                return {
                    a:a, b:b, c:c, ans:ans,
                    steps: [
                        a+'س + '+b+' = '+c,
                        a+'س = '+c+' − '+b+' = '+(c-b),
                        'س = '+(c-b)+' ÷ '+a,
                        'س = '+ans,
                        'تحقق: '+a+'×'+ans+'+'+b+' = '+c+' ✓'
                    ],
                    formula_applied: a+'س+'+b+' = '+c+' → س = '+ans
                };
            }
        },
        {
            id: 'eq_vars_both', conceptId: 'equation_linear',
            name: 'معادلة بمجاهيل في الطرفَين', formula: 'أس = بس + جـ → (أ−ب)س = جـ',
            difficulty: ['hard','genius'],
            generate: function(diff) {
                var ans = r(2,10);
                var a   = r(3,8), b = r(1,a-1);
                var c   = (a-b)*ans;
                return {
                    a:a, b:b, c:c, ans:ans,
                    steps: [
                        a+'س = '+b+'س + '+c,
                        a+'س − '+b+'س = '+c,
                        (a-b)+'س = '+c,
                        'س = '+c+' ÷ '+(a-b),
                        'س = '+ans,
                        'تحقق: '+a+'×'+ans+' = '+b+'×'+ans+'+'+c+' ✓'
                    ],
                    formula_applied: a+'س = '+b+'س + '+c+' → س = '+ans
                };
            }
        },
        {
            id: 'eq_quadratic', conceptId: 'equation_quad',
            name: 'معادلة تربيعية س² = ن', formula: 'س² = ن → س = √ن',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var roots = [4,9,16,25,36,49,64,81,100,121,144];
                var n2   = roots[r(0, diff==='medium' ? 4 : roots.length-1)];
                var ans  = Math.sqrt(n2);
                return {
                    a:n2, ans:ans,
                    steps: [
                        'س² = '+n2,
                        'س = √'+n2,
                        'س = '+ans,
                        'تحقق: '+ans+'² = '+ans+'×'+ans+' = '+n2+' ✓'
                    ],
                    formula_applied: 'س² = '+n2+' → س = '+ans
                };
            }
        },

        /* ─────────────── المتتاليات ─────────────── */
        {
            id: 'seq_arith_next', conceptId: 'seq_arith',
            name: 'المتتالية الحسابية — الحد التالي', formula: 'حـ(ن+١) = حـ(ن) + أسـ',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var a1   = r(1, diff==='easy' ? 10 : 50);
                var d    = r(1, diff==='easy' ? 5  : 15);
                var len  = diff==='easy' ? 4 : 5;
                var seq  = [];
                for(var i=0;i<len;i++) seq.push(a1 + i*d);
                var ans  = a1 + len * d;
                return {
                    a1:a1, d:d, seq:seq, ans:ans,
                    steps: [
                        'المتتالية: '+seq.join(', ')+', ___',
                        'الأساس = '+seq[1]+' − '+seq[0]+' = '+d,
                        'الحد التالي = '+seq[seq.length-1]+' + '+d+' = '+ans
                    ],
                    formula_applied: seq.join(', ')+', '+ans
                };
            }
        },
        {
            id: 'seq_arith_nth', conceptId: 'seq_arith',
            name: 'المتتالية الحسابية — الحد العام', formula: 'حـ(ن) = أ + (ن−١) × أسـ',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var a1 = r(1, 20), d = r(2, 10);
                var n  = r(5, diff==='medium' ? 8 : 15);
                var ans = a1 + (n-1) * d;
                return {
                    a1:a1, d:d, n:n, ans:ans,
                    steps: [
                        'ح(ن) = أ + (ن−١) × أسـ',
                        'ح('+n+') = '+a1+' + ('+n+'−1) × '+d,
                        '= '+a1+' + '+(n-1)+' × '+d,
                        '= '+a1+' + '+(n-1)*d,
                        '= '+ans
                    ],
                    formula_applied: 'ح('+n+') = '+a1+' + '+(n-1)+'×'+d+' = '+ans
                };
            }
        },
        {
            id: 'seq_geo_next', conceptId: 'seq_geo',
            name: 'المتتالية الهندسية — الحد التالي', formula: 'حـ(ن+١) = حـ(ن) × أسـ',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var a1 = r(1, diff==='medium' ? 5 : 10);
                var q  = r(2, diff==='medium' ? 3 : 4);
                var len = 4;
                var seq = [];
                for(var i=0;i<len;i++) seq.push(a1 * Math.pow(q,i));
                var ans = a1 * Math.pow(q, len);
                return {
                    a1:a1, q:q, seq:seq, ans:ans,
                    steps: [
                        'المتتالية: '+seq.join(', ')+', ___',
                        'الأساس = '+seq[1]+' ÷ '+seq[0]+' = '+q,
                        'الحد التالي = '+seq[seq.length-1]+' × '+q+' = '+ans
                    ],
                    formula_applied: seq.join(', ')+', '+ans
                };
            }
        },

        /* ─────────────── الهندسة ─────────────── */
        {
            id: 'geo_rect_area', conceptId: 'geo_area_basic',
            name: 'مساحة المستطيل', formula: 'م = الطول × العرض',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var l = r(diff==='easy' ? 2 : 5, diff==='easy' ? 10 : 30);
                var w = r(diff==='easy' ? 2 : 3, diff==='easy' ? 8  : 25);
                var ans = l * w;
                return {
                    a:l, b:w, ans:ans,
                    steps: ['م = ط × ع', '= '+l+' × '+w, '= '+ans+' وحدة²'],
                    formula_applied: 'م = '+l+' × '+w+' = '+ans
                };
            }
        },
        {
            id: 'geo_square_area', conceptId: 'geo_area_basic',
            name: 'مساحة المربع', formula: 'م = الضلع²',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var s   = r(diff==='easy' ? 2 : 4, diff==='easy' ? 10 : 20);
                var ans = s * s;
                return {
                    a:s, ans:ans,
                    steps: ['م = ض²', '= '+s+'²', '= '+s+' × '+s, '= '+ans+' وحدة²'],
                    formula_applied: 'م = '+s+'² = '+ans
                };
            }
        },
        {
            id: 'geo_triangle_area', conceptId: 'geo_area_tri',
            name: 'مساحة المثلث', formula: 'م = ½ × القاعدة × الارتفاع',
            difficulty: ['easy','medium','hard'],
            generate: function(diff) {
                var b = r(2,20) * 2; /* زوجي لضمان نتيجة صحيحة */
                var h = r(2,15);
                var ans = b * h / 2;
                return {
                    a:b, b:h, ans:ans,
                    steps: ['م = ½ × ق × ر','= ½ × '+b+' × '+h,'= '+b*h+' ÷ 2','= '+ans+' وحدة²'],
                    formula_applied: 'م = ½ × '+b+' × '+h+' = '+ans
                };
            }
        },
        {
            id: 'geo_circle_area', conceptId: 'geo_area_circle',
            name: 'مساحة الدائرة', formula: 'م = π × نق²',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var rad = r(2, diff==='medium' ? 8 : 15);
                var ans = Math.round(Math.PI * rad * rad);
                return {
                    a:rad, ans:ans,
                    steps: ['م = π × نق²','= 3.14159 × '+rad+'²','= 3.14159 × '+rad*rad,'≈ '+ans+' وحدة²'],
                    formula_applied: 'م = π × '+rad+'² ≈ '+ans
                };
            }
        },
        {
            id: 'geo_pythagoras', conceptId: 'geo_pythagoras',
            name: 'نظرية فيثاغورس', formula: 'وتر² = ض₁² + ض₂²',
            difficulty: ['medium','hard','genius'],
            generate: function(diff) {
                var triples = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15],[7,24,25]];
                var t   = triples[r(0,triples.length-1)];
                var mult = diff==='hard' ? r(2,3) : diff==='genius' ? r(2,4) : 1;
                var a=t[0]*mult, b=t[1]*mult, c=t[2]*mult;
                return {
                    a:a, b:b, ans:c,
                    steps: [
                        'وتر² = '+a+'² + '+b+'²',
                        '= '+a*a+' + '+b*b,
                        '= '+c*c,
                        'وتر = √'+c*c+' = '+c
                    ],
                    formula_applied: '√('+a+'²+'+b+'²) = √'+c*c+' = '+c
                };
            }
        },

        /* ─────────────── اللوغاريتم ─────────────── */
        {
            id: 'log_basic_b10', conceptId: 'log_basic',
            name: 'لوغاريتم أساس ١٠', formula: 'log₁₀(١٠^ن) = ن',
            difficulty: ['medium','hard'],
            generate: function(diff) {
                var n = r(1, diff==='medium' ? 4 : 6);
                var val = Math.pow(10,n);
                return {
                    a:val, ans:n,
                    steps: ['log₁₀('+val+')', '= log₁₀(10^'+n+')', '= '+n],
                    formula_applied: 'log₁₀('+val+') = '+n
                };
            }
        },
        {
            id: 'log_other_base', conceptId: 'log_basic',
            name: 'لوغاريتم بقواعد مختلفة', formula: 'log_أ(أ^ن) = ن',
            difficulty: ['hard','genius'],
            generate: function() {
                var pairs = [
                    {base:2,n:3,val:8},{base:2,n:4,val:16},{base:2,n:5,val:32},
                    {base:3,n:2,val:9},{base:3,n:3,val:27},{base:3,n:4,val:81},
                    {base:5,n:2,val:25},{base:5,n:3,val:125},
                    {base:4,n:2,val:16},{base:4,n:3,val:64}
                ];
                var p = pairs[r(0,pairs.length-1)];
                var sym = 'log' + ['₂','₃','₄','₅'][p.base <= 5 ? p.base-2 : 0];
                return {
                    base:p.base, a:p.val, ans:p.n,
                    steps: [sym+'('+p.val+')', '= '+sym+'('+p.base+'^'+p.n+')', '= '+p.n, 'تحقق: '+p.base+'^'+p.n+' = '+p.val+' ✓'],
                    formula_applied: sym+'('+p.val+') = '+p.n
                };
            }
        },

        /* ─────────────── المثلثات ─────────────── */
        {
            id: 'trig_sin', conceptId: 'trig_basic',
            name: 'جيب الزاوية', formula: 'جا(θ) = الضلع المقابل ÷ الوتر',
            difficulty: ['medium','hard','genius'],
            generate: function() {
                var vals = [
                    {deg:0,  frac:'0',    val:0,    mem:'الصفر → 0'},
                    {deg:30, frac:'½',    val:0.5,  mem:'30° → نصف'},
                    {deg:45, frac:'√2/2', val:0.71, mem:'45° ≈ 0.71'},
                    {deg:60, frac:'√3/2', val:0.87, mem:'60° ≈ 0.87'},
                    {deg:90, frac:'1',    val:1,    mem:'90° → أقصى'}
                ];
                var v = vals[r(0,vals.length-1)];
                return {
                    a:v.deg, ans:v.val,
                    steps: ['جا('+v.deg+'°) = '+v.frac+' = '+v.val, '💡 '+v.mem],
                    formula_applied: 'جا('+v.deg+'°) = '+v.val
                };
            }
        },
        {
            id: 'trig_cos', conceptId: 'trig_basic',
            name: 'جيب التمام', formula: 'جتا(θ) = الضلع المجاور ÷ الوتر',
            difficulty: ['medium','hard','genius'],
            generate: function() {
                var vals = [
                    {deg:0,  frac:'1',    val:1,    mem:'0° → 1'},
                    {deg:30, frac:'√3/2', val:0.87, mem:'30° ≈ 0.87'},
                    {deg:45, frac:'√2/2', val:0.71, mem:'45° = جا(45°)'},
                    {deg:60, frac:'½',    val:0.5,  mem:'60° = نصف'},
                    {deg:90, frac:'0',    val:0,    mem:'90° → 0'}
                ];
                var v = vals[r(0,vals.length-1)];
                return {
                    a:v.deg, ans:v.val,
                    steps: ['جتا('+v.deg+'°) = '+v.frac+' = '+v.val, '💡 '+v.mem],
                    formula_applied: 'جتا('+v.deg+'°) = '+v.val
                };
            }
        }
    ];

    /* فهرسة سريعة */
    var _byId      = {};
    var _byConcept = {};
    var _byDiff    = {};

    laws.forEach(function(law) {
        _byId[law.id] = law;
        if (!_byConcept[law.conceptId]) _byConcept[law.conceptId] = [];
        _byConcept[law.conceptId].push(law);
        law.difficulty.forEach(function(d) {
            if (!_byDiff[d]) _byDiff[d] = [];
            _byDiff[d].push(law);
        });
    });

    /* اختيار قانون بالمعرف */
    function get(id) { return _byId[id] || null; }

    /* اختيار قانون بالمفهوم والصعوبة */
    function pick(conceptId, diff) {
        var pool = (_byConcept[conceptId] || []).filter(function(l) {
            return l.difficulty.indexOf(diff) >= 0;
        });
        if (pool.length === 0) pool = _byConcept[conceptId] || [];
        if (pool.length === 0) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /* اختيار قانون بالعملية مباشرة */
    function pickByOp(op, diff) {
        var conceptId = SmartAI.conceptOf(op);
        return pick(conceptId, diff);
    }

    return { all: laws, get, pick, pickByOp };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ② بنك القوالب الكلامية
   لكل فئة مسائل كلامية → قوالب متنوعة جداً مع متغيرات
═══════════════════════════════════════════════════════════════════════ */

var TEMPLATE_BANK = (function () {

    /* أسماء وأشياء للمسائل الكلامية */
    var NAMES  = ['أحمد','سارة','خالد','ليلى','محمد','هند','عمر','نورة','يوسف','رنا','علي','فاطمة'];
    var ITEMS  = ['كتاب','قلم','تفاحة','لعبة','بطاقة','طابع','كرة','بالون','ورقة','حلوى'];
    var UNITS  = ['متر','كيلومتر','ريال','دينار','درهم','كيلوغرام','ليتر','ساعة'];
    var PLACES = ['المدرسة','المتجر','الحديقة','البيت','المكتبة','الملعب','المستودع'];

    function name()  { return NAMES[Math.floor(Math.random()*NAMES.length)]; }
    function item()  { return ITEMS[Math.floor(Math.random()*ITEMS.length)]; }
    function unit()  { return UNITS[Math.floor(Math.random()*UNITS.length)]; }
    function place() { return PLACES[Math.floor(Math.random()*PLACES.length)]; }

    /* القوالب: كل قالب = دالة تأخذ بيانات القانون وتُنتج نصاً */
    var templates = {

        'add_basic': [
            function(d) { var n=name(),i=item(); return 'لدى '+n+' '+d.a+' '+i+'، اشترى '+d.b+' '+i+' أخرى. كم '+i+' لديه الآن؟'; },
            function(d) { var n=name(); return 'مشى '+n+' '+d.a+' كيلومتراً صباحاً و'+d.b+' مساءً. المسافة الكلية = ؟'; },
            function(d) { var pl=place(); return 'في '+pl+' '+d.a+' شجرة حمراء و'+d.b+' شجرة صفراء. المجموع = ؟'; },
            function(d) { var n=name(),u=unit(); return 'ربح '+n+' '+d.a+' '+u+' في اليوم الأول و'+d.b+' في الثاني. الإجمالي = ؟'; },
            function(d) { return 'في ملعب '+d.a+' لاعباً فريق أ و'+d.b+' لاعباً فريق ب. إجمالي اللاعبين = ؟'; }
        ],

        'sub_basic': [
            function(d) { var n=name(),i=item(); return 'كان لدى '+n+' '+d.a+' '+i+'، أعطى '+d.b+'. كم تبقّى؟'; },
            function(d) { var n=name(); return 'سافر '+n+' '+d.a+' كيلومتراً وقطع '+d.b+'. كم تبقّى؟'; },
            function(d) { var n=name(),u=unit(); return 'كان معه '+d.a+' '+u+'، صرف '+d.b+'. ما المتبقي؟'; },
            function(d) { return 'في المستودع '+d.a+' صندوقاً، شُحن '+d.b+' صندوقاً. الباقي = ؟'; }
        ],

        'mul_basic': [
            function(d) { var i=item(),u=unit(); return 'ثمن '+i+' واحد '+d.a+' '+u+'. ثمن '+d.b+' منه = ؟'; },
            function(d) { return 'ملعب طوله '+d.a+' متراً وعرضه '+d.b+' متراً. مساحته = ؟'; },
            function(d) { return d.a+' صناديق، في كل صندوق '+d.b+' وحدة. الإجمالي = ؟'; },
            function(d) { var n=name(); return 'يعمل '+n+' '+d.a+' ساعة يومياً. في '+d.b+' أيام يعمل = ؟ ساعة'; },
            function(d) { return 'مزرعة بها '+d.a+' صفوف، في كل صف '+d.b+' شجرة. الإجمالي = ؟'; }
        ],

        'div_exact': [
            function(d) { var i=item(); return 'قُسِم '+d.a+' '+i+' بالتساوي على '+d.b+' أشخاص. لكل شخص = ؟'; },
            function(d) { var n=name(); return 'قطع '+n+' '+d.a+' كيلومتراً في '+d.b+' ساعات. السرعة = ؟ كم/ساعة'; },
            function(d) { return 'كيس فيه '+d.a+' حلوى يُوزَّع على '+d.b+' أطفال بالتساوي. نصيب كل طفل = ؟'; },
            function(d) { return 'حقل مساحته '+d.a+' م² طوله '+d.b+' م. عرضه = ؟ م'; }
        ],

        'percent_of': [
            function(d) { return d.a+'% من '+d.b+' طالب حضروا الاختبار. عددهم = ؟'; },
            function(d) { var n=name(),u=unit(); return 'ادّخر '+n+' '+d.a+'% من راتبه '+d.b+' '+u+'. المبلغ المدّخر = ؟'; },
            function(d) { return 'خصم '+d.a+'% من سعر '+d.b+' ريال. قيمة الخصم = ؟'; },
            function(d) { return d.a+'% من مساحة ملعب '+d.b+' م² مخصصة للعشب. المساحة = ؟ م²'; }
        ],

        'seq_arith_next': [
            function(d) { return 'أكمل المتتالية: '+d.seq.join(', ')+', ___'; },
            function(d) { return 'ما الحد التالي في: '+d.seq.join(' ، ')+' ، ___؟'; },
            function(d) { return 'متتالية حسابية: '+d.seq.join(' — ')+' — ___، ما الحد القادم؟'; }
        ],

        'frac_add_same': [
            function(d) { return d.a+'/'+d.d+' + '+d.b+'/'+d.d+' = ؟'; },
            function(d) { return 'جمع كسرَين: '+d.a+'/'+d.d+' و'+d.b+'/'+d.d+'. الناتج = ؟'; },
            function(d) { var n=name(),i=item(); return 'أكل '+n+' '+d.a+'/'+d.d+' من '+i+' وأخوه '+d.b+'/'+d.d+'. الكمية الكلية = ؟'; }
        ],

        'geo_rect_area': [
            function(d) { return 'مستطيل طوله '+d.a+' سم وعرضه '+d.b+' سم. مساحته = ؟ سم²'; },
            function(d) { return 'غرفة بأبعاد '+d.a+' م × '+d.b+' م. مساحتها = ؟ م²'; },
            function(d) { return 'حديقة طولها '+d.a+' م وعرضها '+d.b+' م. احسب مساحتها.'; }
        ],

        'geo_triangle_area': [
            function(d) { return 'مثلث قاعدته '+d.a+' سم وارتفاعه '+d.b+' سم. مساحته = ؟'; },
            function(d) { return 'قطعة أرض مثلثة الشكل قاعدتها '+d.a+' م وارتفاعها '+d.b+' م. مساحتها = ؟'; }
        ]
    };

    /* جلب قالب عشوائي لقانون معين */
    function getTemplate(lawId, data) {
        var list = templates[lawId];
        if (!list || list.length === 0) return null;
        var fn = list[Math.floor(Math.random() * list.length)];
        try { return fn(data); } catch(e) { return null; }
    }

    /* هل يوجد قوالب كلامية لهذا القانون؟ */
    function hasTemplates(lawId) {
        return !!(templates[lawId] && templates[lawId].length > 0);
    }

    return { getTemplate, hasTemplates };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ③ مولّد الأسئلة الذكي — SmartQuestionBuilder
   يجمع: قانون + بيانات + قالب → سؤال كامل
═══════════════════════════════════════════════════════════════════════ */

var SmartQuestionBuilder = (function () {

    /* ذاكرة لمنع التكرار (بصمة القانون + الإجابة) */
    var _seen = new Set();
    var _LIMIT = 200;

    function _fp(lawId, ans) { return lawId + '§' + ans; }

    function _remember(lawId, ans) {
        var key = _fp(lawId, ans);
        _seen.add(key);
        if (_seen.size > _LIMIT) _seen.delete(_seen.values().next().value);
    }

    function _wasSeen(lawId, ans) { return _seen.has(_fp(lawId, ans)); }

    /*
     * بناء سؤال كامل من قانون محدد
     *   lawId  — معرف القانون (اختياري، يُحدَّد تلقائياً إذا لم يُمرَّر)
     *   diff   — مستوى الصعوبة
     *   useWord— هل يُستخدم قالب كلامي؟
     */
    function build(lawId, diff, useWord) {
        var law = LAW_BANK.get(lawId);
        if (!law) return null;

        /* توليد بيانات مع ضمان عدم التكرار */
        var data, tries = 0;
        do {
            data = law.generate(diff || 'medium');
            tries++;
            if (!_wasSeen(law.id, data.ans)) break;
            if (tries >= 30) { _seen.clear(); break; }
        } while (true);

        _remember(law.id, data.ans);

        /* هل نستخدم قالباً كلامياً؟ */
        var text;
        if (useWord && TEMPLATE_BANK.hasTemplates(law.id)) {
            text = TEMPLATE_BANK.getTemplate(law.id, data);
        }
        if (!text) {
            /* نص رياضي نقي */
            text = data.formula_applied.split('=')[0].trim() + ' = ؟';
        }

        /* تلميح من اسم القانون + الصيغة */
        var hint = law.formula;

        /* شرح مفصّل من خطوات القانون */
        var explanation = data.steps.join('\n');

        /* خيارات ذكية */
        var choices = _buildChoices(data.ans, law, diff);

        return {
            text:        text,
            hint:        hint,
            answer:      data.ans,
            choices:     choices,
            explanation: explanation,
            lawId:       law.id,
            conceptId:   law.conceptId,
            catKey:      law.conceptId,
            formulaUsed: law.formula,
            isWord:      !!(useWord && TEMPLATE_BANK.hasTemplates(law.id))
        };
    }

    /* بناء سؤال بناءً على عملية مباشرة */
    function buildFromOp(op, diff, useWord) {
        var law = LAW_BANK.pickByOp(op, diff || 'medium');
        if (!law) return null;
        return build(law.id, diff, useWord);
    }

    /* بناء سؤال بناءً على قرار DecisionEngine */
    function buildFromDecision(decision, useWord) {
        var conceptId = decision.conceptId;
        var diff      = decision.difficulty || 'medium';
        var law       = LAW_BANK.pick(conceptId, diff);
        if (!law) return buildFromOp(decision.op, diff, useWord);
        return build(law.id, diff, useWord);
    }

    /* ─── بناء خيارات ذكية ─── */
    function _buildChoices(ans, law, diff) {
        var wrongs = new Set();
        var safety = 0;

        /* أخطاء مبنية على نوع القانون */
        var lawErrors = _getLawErrors(ans, law, diff);
        lawErrors.forEach(function(e) {
            if (e !== ans && !isNaN(e) && e >= 0) wrongs.add(e);
        });

        /* أخطاء عشوائية قريبة */
        var spread = Math.max(2, Math.ceil(Math.abs(ans) * 0.25) + 1);
        while (wrongs.size < 3 && safety++ < 100) {
            var off = Math.floor(Math.random() * spread * 2) - spread;
            if (off === 0) continue;
            var w = typeof ans === 'number' ? ans + off : ans;
            if (w !== ans && w >= 0) wrongs.add(w);
        }

        /* ضمان 3 خيارات خاطئة */
        while (wrongs.size < 3) wrongs.add(ans + wrongs.size + 1);

        return _shuffle([ans, ...[...wrongs].slice(0,3)]);
    }

    /* أخطاء مبنية على طبيعة كل قانون */
    function _getLawErrors(ans, law, diff) {
        switch(law.id) {
            case 'mul_basic':       return [ans + law._a, ans - law._b, ans * 2];
            case 'div_exact':       return [ans * 2, ans - 1, ans + law._b];
            case 'power_nat':       return [ans - 1, ans + 1, ans * 2];
            case 'sqrt_perfect':    return [ans + 1, ans - 1, ans * ans];
            case 'power_law_mul':   return [ans - 1, ans + 1, ans * 2];
            case 'frac_add_same':   return [ans - 1, ans + 1, ans * 2];
            case 'geo_rect_area':   return [ans * 2, Math.round(ans/2), ans + 10];
            case 'geo_triangle_area': return [ans * 2, Math.round(ans * 1.5), ans + ans];
            case 'seq_arith_next':  return [ans - 1, ans + 1, ans * 2];
            case 'seq_arith_nth':   return [ans - 5, ans + 5, ans * 2];
            default:                return [ans + 1, ans - 1, ans * 2];
        }
    }

    /* خلط المصفوفة */
    function _shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        return arr;
    }

    /* إعادة ضبط الذاكرة */
    function reset() { _seen.clear(); }

    return { build, buildFromOp, buildFromDecision, reset };
})();


/* ═══════════════════════════════════════════════════════════════════════
   التكامل النهائي — إضافة الدوال الجديدة لـ SmartAI
═══════════════════════════════════════════════════════════════════════ */

;(function () {
    var ai = SmartAI;

    /*
     * الدالة الرئيسية الموحّدة للحصول على السؤال التالي
     * تستخدم DecisionEngine + SmartQuestionBuilder معاً
     *
     * المعامِلات:
     *   op       — العملية الحالية ('mix', 'add', ...)
     *   gameMode — وضع اللعبة
     *   level    — المستوى الحالي
     *   useWord  — هل يفضّل مسائل كلامية؟ (اختياري)
     *
     * تُرجع كائن السؤال الكامل مع حقل extra يحتوي معلومات للنظام
     */
    ai.getSmartQuestion = function(op, gameMode, level, useWord) {

        /* ① القرار: ماذا نسأل؟ */
        var decision = DecisionEngine.decide(op, gameMode || 'classic', level || 1);

        /* ② بناء السؤال */
        var question = SmartQuestionBuilder.buildFromDecision(decision, !!useWord);

        /* ③ احتياطي: إذا فشل المولّد نرجع للنظام الأصلي */
        if (!question && typeof genSmartQ === 'function') {
            question = genSmartQ(decision.op || op, decision.difficulty || 'medium');
        }

        /* ④ أضف معلومات للنظام */
        if (question) {
            question._decision = {
                reason:    decision.reason,
                conceptId: decision.conceptId,
                diff:      decision.difficulty
            };
            /* إذا كان مفهوماً جديداً — أرسل رسالة ترحيب */
            if (decision.reason === 'challenge_new') {
                question._message = ai.feedback.onNewConcept();
            } else if (decision.reason === 'review_due') {
                question._message = ai.feedback.onReview();
            }
        }

        return question;
    };

    /* بناء سؤال بقانون محدد مباشرة */
    ai.buildFromLaw = function(lawId, diff, useWord) {
        return SmartQuestionBuilder.build(lawId, diff || 'medium', !!useWord);
    };

    /* بناء سؤال بعملية محددة مباشرة */
    ai.buildFromOp = function(op, diff, useWord) {
        return SmartQuestionBuilder.buildFromOp(op, diff || 'medium', !!useWord);
    };

    /* تصدير الكائنات الداخلية للاستخدام المباشر إن لزم */
    ai.LAW_BANK              = LAW_BANK;
    ai.TEMPLATE_BANK         = TEMPLATE_BANK;
    ai.SmartQuestionBuilder  = SmartQuestionBuilder;
    ai.DecisionEngine        = DecisionEngine;

    /* إعادة الضبط الكاملة */
    var _origGameStart = ai.onGameStartFull;
    ai.onGameStartFull = function(startDiff) {
        _origGameStart(startDiff);
        /* SmartQuestionBuilder لا يحتاج reset — يعمل stateless */
    };

})();



/* ═══════════════════════════════════════════════════════════════════════
   ══════════════════════════════════════════════════════════════════════
   المرحلة الثالثة — مولّد الأسئلة الذكي المبني على القوانين
   ══════════════════════════════════════════════════════════════════════
   ① بنك القوانين       — كل قانون رياضي مع قوالب توليد متعددة
   ② مولّد الأرقام     — يضع أرقاماً مضمونة الصحة حسب الصعوبة
   ③ مولّد المسائل الكلامية — سياقات متنوعة لا نهاية لها
   ④ دالة القرار الموحّدة — تربط كل شيء معاً
═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   ① بنك القوانين الرياضية
   كل قانون يعرف: نفسه + كيف يولّد سؤالاً + كيف يشرحه
═══════════════════════════════════════════════════════════════════════ */

var LawBank = (function () {

    /* ─── أداة مساعدة: إيجاد القاسم المشترك الأكبر ─── */
    function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

    /* ─── أداة مساعدة: إيجاد المضاعف المشترك الأصغر ─── */
    function _lcm(a, b) { return a * b / _gcd(a, b); }

    /* ─── توليد رقم عشوائي ─── */
    function _r(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    /* ─── ضمان أن الرقم ليس صفراً ─── */
    function _nz(min, max) { var v; do { v = _r(min, max); } while (v === 0); return v; }

    /*
     * بنية كل قانون:
     *   id          — معرف فريد
     *   conceptId   — المفهوم المرتبط في خريطة المعرفة
     *   name        — اسم القانون بالعربية
     *   formula     — صيغة القانون الرياضية
     *   difficulty  — 1-10
     *   generate(diff, params) → { text, answer, hint, explanation, catKey, wrongHints }
     *     wrongHints — 3 إجابات خاطئة منطقية مبنية على أخطاء شائعة حقيقية
     */

    var laws = [

        /* ══════════════════════════════════════════
           الأساسيات
        ══════════════════════════════════════════ */

        {
            id: 'add_basic', conceptId: 'add_simple', name: 'الجمع الأساسي',
            formula: 'أ + ب = مجـ', difficulty: 1,
            generate: function (diff) {
                var max = diff==='easy'?20 : diff==='medium'?200 : diff==='hard'?2000 : 9999;
                var a = _r(1, max), b = _r(1, max);
                var ans = a + b;
                return {
                    text: `${a} + ${b}`,
                    answer: ans,
                    hint: 'اجمع الرقمين',
                    explanation: `${a} + ${b} = ${ans}\n✓ تحقق: ${ans} − ${b} = ${a}`,
                    catKey: 'addition',
                    wrongHints: [ans+1, ans-1, ans+10]
                };
            }
        },

        {
            id: 'sub_basic', conceptId: 'sub_simple', name: 'الطرح الأساسي',
            formula: 'أ − ب = فـ', difficulty: 1,
            generate: function (diff) {
                var max = diff==='easy'?20 : diff==='medium'?200 : diff==='hard'?2000 : 9999;
                var a = _r(1, max), b = _r(1, a);
                var ans = a - b;
                return {
                    text: `${a} − ${b}`,
                    answer: ans,
                    hint: 'اطرح الرقم الأصغر من الأكبر',
                    explanation: `${a} − ${b} = ${ans}\n✓ تحقق: ${ans} + ${b} = ${a}`,
                    catKey: 'subtraction',
                    wrongHints: [ans+1, ans-1, b-a < 0 ? Math.abs(b-a) : ans+2]
                };
            }
        },

        {
            id: 'mul_basic', conceptId: 'mul_table', name: 'الضرب الأساسي',
            formula: 'أ × ب = حـ', difficulty: 2,
            generate: function (diff) {
                var max = diff==='easy'?5 : diff==='medium'?12 : diff==='hard'?20 : 50;
                var a = _r(2, max), b = _r(2, max);
                var ans = a * b;
                return {
                    text: `${a} × ${b}`,
                    answer: ans,
                    hint: `${a} مجموعات كل منها ${b}`,
                    explanation: `${a} × ${b} = ${ans}` + (a<=12&&b<=12 ? '\n(من جدول الضرب)' : `\n= ${a}×${Math.floor(b/10)*10} + ${a}×${b%10}\n= ${a*Math.floor(b/10)*10} + ${a*(b%10)}`),
                    catKey: 'multiplication',
                    wrongHints: [ans+a, ans-b, ans+b]
                };
            }
        },

        {
            id: 'div_basic', conceptId: 'div_simple', name: 'القسمة الأساسية',
            formula: 'أ ÷ ب = حـ', difficulty: 2,
            generate: function (diff) {
                var max = diff==='easy'?5 : diff==='medium'?12 : 20;
                var ans = _r(2, max), b = _r(2, max);
                var a = ans * b;
                return {
                    text: `${a} ÷ ${b}`,
                    answer: ans,
                    hint: `القسمة عكس الضرب — ${ans} × ${b} = ${a}`,
                    explanation: `${a} ÷ ${b} = ${ans}\nلأن: ${ans} × ${b} = ${a} ✓`,
                    catKey: 'division',
                    wrongHints: [ans+1, ans*2, b]
                };
            }
        },

        /* ══════════════════════════════════════════
           النسبة المئوية — ٣ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'percent_of', conceptId: 'percent_basic', name: 'إيجاد نسبة مئوية من عدد',
            formula: 'ن% من س = س × ن/100', difficulty: 4,
            generate: function (diff) {
                var pcts  = diff==='easy' ? [10,25,50] : diff==='medium' ? [10,20,25,50,75] : [5,10,15,20,25,30,40,60,75,80];
                var pct   = pcts[_r(0, pcts.length-1)];
                var base  = _r(2,20) * (diff==='easy'?10 : diff==='medium'?10 : 5);
                var ans   = Math.round(base * pct / 100);
                var trick = pct===10 ? `\n💡 ${pct}% = اقسم على 10` : pct===50 ? `\n💡 50% = اقسم على 2` : pct===25 ? `\n💡 25% = اقسم على 4` : '';
                return {
                    text: `${pct}% من ${base} = ؟`,
                    answer: ans,
                    hint: `اضرب ${base} × ${pct} ثم اقسم على 100`,
                    explanation: `${pct}% من ${base}\n= ${base} × ${pct}/100\n= ${base*pct}/100\n= ${ans}${trick}`,
                    catKey: 'percentage',
                    wrongHints: [Math.round(base*pct/10), ans+base/10, ans*2]
                };
            }
        },

        {
            id: 'percent_reverse', conceptId: 'percent_reverse', name: 'إيجاد الكل من الجزء والنسبة',
            formula: 'الكل = الجزء ÷ (ن/100)', difficulty: 6,
            generate: function (diff) {
                var pcts = diff==='easy' ? [25,50] : [10,20,25,40,50];
                var pct  = pcts[_r(0, pcts.length-1)];
                var ans  = _r(2, diff==='easy'?10:20) * 10;
                var part = Math.round(ans * pct / 100);
                return {
                    text: `عدد ما ${pct}% منه = ${part}، الكل = ؟`,
                    answer: ans,
                    hint: `الكل = ${part} ÷ (${pct}/100) = ${part} × (100/${pct})`,
                    explanation: `${pct}% من الكل = ${part}\nالكل = ${part} ÷ ${pct/100}\n= ${part} × ${100/pct}\n= ${ans}`,
                    catKey: 'percentage',
                    wrongHints: [part, ans/2, ans+part]
                };
            }
        },

        {
            id: 'percent_change', conceptId: 'percent_change', name: 'نسبة التغيير',
            formula: 'نسبة التغيير = (جديد − قديم) / قديم × 100', difficulty: 7,
            generate: function (diff) {
                var pct  = _r(1, diff==='hard'?50:20) * 5;
                var old_ = _r(2, 20) * 10;
                var inc  = Math.random() > 0.5;
                var new_ = inc ? Math.round(old_ * (1 + pct/100)) : Math.round(old_ * (1 - pct/100));
                var ans  = pct * (inc ? 1 : -1);
                return {
                    text: `سعر تغيّر من ${old_} إلى ${new_}. نسبة التغيير = ؟%`,
                    answer: ans,
                    hint: `نسبة التغيير = (${new_} − ${old_}) ÷ ${old_} × 100`,
                    explanation: `= (${new_} − ${old_}) ÷ ${old_} × 100\n= ${new_-old_} ÷ ${old_} × 100\n= ${ans}%` + (ans>0?' (زيادة)':' (نقصان)'),
                    catKey: 'percentage',
                    wrongHints: [Math.abs(ans), ans+5, Math.round((new_-old_)/new_*100)]
                };
            }
        },

        /* ══════════════════════════════════════════
           الكسور — ٤ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'fraction_add_same', conceptId: 'fraction_add_same', name: 'جمع كسور بمقام مشترك',
            formula: 'أ/ن + ب/ن = (أ+ب)/ن', difficulty: 4,
            generate: function (diff) {
                var d  = _r(3, diff==='easy'?6:12);
                var n1 = _r(1, d-1), n2 = _r(1, d-1);
                var num = n1+n2, g = _gcd(num,d);
                var sn  = num/g, sd = d/g;
                return {
                    text: `${n1}/${d} + ${n2}/${d}`,
                    answer: sd===1 ? sn : num,
                    hint: `المقامات متساوية — اجمع البسطَين: ${n1}+${n2}`,
                    explanation: `${n1}/${d} + ${n2}/${d} = ${num}/${d}` + (g>1?` = ${sn}/${sd}`:'') + (sd===1?` = ${sn}`:''),
                    catKey: 'fractions',
                    wrongHints: [n1*n2, (n1+n2)/(d+d), num+d]
                };
            }
        },

        {
            id: 'fraction_add_diff', conceptId: 'fraction_add_diff', name: 'جمع كسور بمقامات مختلفة',
            formula: 'أ/ن₁ + ب/ن₂ = [أ×(م.م.أ/ن₁) + ب×(م.م.أ/ن₂)] / م.م.أ', difficulty: 6,
            generate: function (diff) {
                var d1=_r(2,5), d2; do { d2=_r(2,6); } while (d2===d1);
                var n1=_r(1,d1), n2=_r(1,d2);
                var lc=_lcm(d1,d2);
                var num=n1*(lc/d1)+n2*(lc/d2), g=_gcd(num,lc);
                var sn=num/g, sd=lc/g;
                return {
                    text: `${n1}/${d1} + ${n2}/${d2}`,
                    answer: sd===1 ? sn : num,
                    hint: `المقام المشترك = ${lc} — حوّل كل كسر ثم اجمع`,
                    explanation: `م.م.أ(${d1},${d2}) = ${lc}\n${n1}/${d1} = ${n1*(lc/d1)}/${lc}\n${n2}/${d2} = ${n2*(lc/d2)}/${lc}\nالمجموع = ${num}/${lc}` + (g>1?` = ${sn}/${sd}`:'') + (sd===1?` = ${sn}`:''),
                    catKey: 'fractions',
                    wrongHints: [n1+n2, (n1+n2)/(d1+d2), num+1]
                };
            }
        },

        {
            id: 'fraction_mul', conceptId: 'fraction_mul', name: 'ضرب الكسور',
            formula: 'أ/ب × ج/د = (أ×ج)/(ب×د)', difficulty: 5,
            generate: function (diff) {
                var n1=_r(1,5), d1=_r(2,7), n2=_r(1,5), d2=_r(2,7);
                var np=n1*n2, dp=d1*d2, g=_gcd(np,dp);
                var sn=np/g, sd=dp/g;
                return {
                    text: `${n1}/${d1} × ${n2}/${d2}`,
                    answer: sd===1 ? sn : np,
                    hint: 'اضرب البسطَين مع بعض والمقامَين مع بعض',
                    explanation: `(${n1}×${n2}) / (${d1}×${d2}) = ${np}/${dp}` + (g>1?` = ${sn}/${sd}`:'') + (sd===1?` = ${sn}`:''),
                    catKey: 'fractions',
                    wrongHints: [n1*d2+n2*d1, np+dp, sn+sd]
                };
            }
        },

        {
            id: 'fraction_div', conceptId: 'fraction_mul', name: 'قسمة الكسور',
            formula: 'أ/ب ÷ ج/د = أ/ب × د/ج', difficulty: 6,
            generate: function (diff) {
                var n1=_r(1,6), d1=_r(2,7), n2=_r(1,6), d2=_r(2,7);
                var np=n1*d2, dp=d1*n2, g=_gcd(np,dp);
                var sn=np/g, sd=dp/g;
                return {
                    text: `${n1}/${d1} ÷ ${n2}/${d2}`,
                    answer: sd===1 ? sn : np,
                    hint: `اقلب الكسر الثاني: ${n1}/${d1} × ${d2}/${n2}`,
                    explanation: `${n1}/${d1} ÷ ${n2}/${d2}\n= ${n1}/${d1} × ${d2}/${n2}\n= ${np}/${dp}` + (g>1?` = ${sn}/${sd}`:'') + (sd===1?` = ${sn}`:''),
                    catKey: 'fractions',
                    wrongHints: [n1*n2, dp/np, np+1]
                };
            }
        },

        /* ══════════════════════════════════════════
           القوى والجذور — ٤ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'power_basic', conceptId: 'power_basic', name: 'القوى الأساسية',
            formula: 'أⁿ = أ × أ × … (ن مرة)', difficulty: 4,
            generate: function (diff) {
                var a = diff==='easy'?_r(2,5) : diff==='medium'?_r(2,8) : _r(2,12);
                var n = diff==='easy'?2 : diff==='medium'?_r(2,3) : _r(2,4);
                var ans = Math.pow(a,n);
                var steps = Array.from({length:n}, function(){ return a; }).join(' × ');
                return {
                    text: `${a}^${n} = ؟`,
                    answer: ans,
                    hint: `اضرب ${a} في نفسه ${n} مرات`,
                    explanation: `${a}^${n} = ${steps} = ${ans}`,
                    catKey: 'algebra',
                    wrongHints: [a*n, ans+a, Math.pow(a,n-1)]
                };
            }
        },

        {
            id: 'power_mul_law', conceptId: 'power_laws', name: 'قانون ضرب القوى (نفس الأساس)',
            formula: 'أⁿ × أᵐ = أⁿ⁺ᵐ', difficulty: 6,
            generate: function (diff) {
                var a = _r(2,7), n = _r(1,4), m = _r(1,4);
                var ans = n + m;
                return {
                    text: `${a}^${n} × ${a}^${m} = ${a}^؟`,
                    answer: ans,
                    hint: `نفس الأساس — اجمع الأسسَين: ${n}+${m}`,
                    explanation: `${a}^${n} × ${a}^${m} = ${a}^(${n}+${m}) = ${a}^${ans}`,
                    catKey: 'algebra',
                    wrongHints: [n*m, ans+1, ans-1]
                };
            }
        },

        {
            id: 'power_div_law', conceptId: 'power_laws', name: 'قانون قسمة القوى (نفس الأساس)',
            formula: 'أⁿ ÷ أᵐ = أⁿ⁻ᵐ', difficulty: 6,
            generate: function (diff) {
                var a = _r(2,7), m = _r(1,3), n = m + _r(1,4);
                var ans = n - m;
                return {
                    text: `${a}^${n} ÷ ${a}^${m} = ${a}^؟`,
                    answer: ans,
                    hint: `نفس الأساس — اطرح الأسسَين: ${n}−${m}`,
                    explanation: `${a}^${n} ÷ ${a}^${m} = ${a}^(${n}−${m}) = ${a}^${ans}`,
                    catKey: 'algebra',
                    wrongHints: [n+m, n/m, ans+1]
                };
            }
        },

        {
            id: 'sqrt_basic', conceptId: 'sqrt_basic', name: 'الجذر التربيعي',
            formula: '√(أ²) = أ', difficulty: 5,
            generate: function (diff) {
                var roots = diff==='easy' ? [4,9,16,25,36] :
                            diff==='medium' ? [4,9,16,25,36,49,64,81,100] :
                            [4,9,16,25,36,49,64,81,100,121,144,169,196,225];
                var sq  = roots[_r(0, roots.length-1)];
                var ans = Math.sqrt(sq);
                return {
                    text: `√${sq} = ؟`,
                    answer: ans,
                    hint: `أي عدد مضروب في نفسه يساوي ${sq}؟`,
                    explanation: `√${sq} = ${ans}\nلأن: ${ans} × ${ans} = ${sq} ✓`,
                    catKey: 'algebra',
                    wrongHints: [ans+1, ans-1, ans+2]
                };
            }
        },

        /* ══════════════════════════════════════════
           المعادلات — ٤ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'eq_one_step', conceptId: 'equation_simple', name: 'معادلة خطوة واحدة',
            formula: 'أس = ب  ←  س = ب/أ', difficulty: 4,
            generate: function (diff) {
                var a = _r(2, diff==='easy'?5:10), ans = _r(2, diff==='easy'?10:20);
                var b = a * ans;
                return {
                    text: `${a}س = ${b}، س = ؟`,
                    answer: ans,
                    hint: `اقسم الطرفين على ${a}`,
                    explanation: `${a}س = ${b}\nس = ${b} ÷ ${a} = ${ans}\n✓ تحقق: ${a}×${ans} = ${b}`,
                    catKey: 'algebra',
                    wrongHints: [b-a, a+ans, ans+1]
                };
            }
        },

        {
            id: 'eq_two_steps', conceptId: 'equation_linear', name: 'معادلة خطوتان',
            formula: 'أس + ب = ج  ←  س = (ج−ب)/أ', difficulty: 6,
            generate: function (diff) {
                var a=_r(2,6), ans=_r(2,15), c=_r(1,20);
                var b = a*ans + c;
                return {
                    text: `${a}س + ${c} = ${b}، س = ؟`,
                    answer: ans,
                    hint: `① اطرح ${c} من الطرفين  ② اقسم على ${a}`,
                    explanation: `${a}س + ${c} = ${b}\n${a}س = ${b}−${c} = ${b-c}\nس = ${b-c}÷${a} = ${ans}\n✓ تحقق: ${a}×${ans}+${c} = ${b}`,
                    catKey: 'algebra',
                    wrongHints: [ans+1, b/a, (b+c)/a]
                };
            }
        },

        {
            id: 'eq_both_sides', conceptId: 'equation_linear', name: 'معادلة بمجهول على الطرفين',
            formula: 'أس = بس + ج  ←  (أ−ب)س = ج', difficulty: 7,
            generate: function (diff) {
                var ans=_r(2,10), b=_r(1,5), a=b+_r(1,4), rhs=(a-b)*ans+_r(1,15);
                var c = rhs - (a-b)*ans; /* const on rhs */
                var fullRhs = (a-b)*ans + c;
                return {
                    text: `${a}س = ${b}س + ${fullRhs}، س = ؟`,
                    answer: ans,
                    hint: `انقل ${b}س للطرف الأيسر: (${a}−${b})س = ${fullRhs}`,
                    explanation: `${a}س − ${b}س = ${fullRhs}\n${a-b}س = ${fullRhs}\nس = ${fullRhs}÷${a-b} = ${ans}\n✓ تحقق: ${a}×${ans} = ${b}×${ans}+${fullRhs}`,
                    catKey: 'algebra',
                    wrongHints: [fullRhs/(a+b), ans+2, a-b]
                };
            }
        },

        {
            id: 'eq_quadratic', conceptId: 'equation_quad', name: 'معادلة تربيعية بسيطة',
            formula: 'س² = ن  ←  س = √ن', difficulty: 8,
            generate: function (diff) {
                var roots = [2,3,4,5,6,7,8,9,10,11,12];
                var ans = roots[_r(0, roots.length-1)];
                var n   = ans * ans;
                return {
                    text: `س² = ${n}، س = ؟ (الحل الموجب)`,
                    answer: ans,
                    hint: 'خذ الجذر التربيعي للطرفين',
                    explanation: `س² = ${n}\nس = √${n} = ${ans}\n✓ تحقق: ${ans}² = ${ans}×${ans} = ${n}`,
                    catKey: 'algebra',
                    wrongHints: [n/2, ans+1, ans*2]
                };
            }
        },

        /* ══════════════════════════════════════════
           المتتاليات — ٣ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'seq_arith_next', conceptId: 'seq_arith', name: 'المتتالية الحسابية — الحد التالي',
            formula: 'أن = أ₁ + (ن−1)×د', difficulty: 4,
            generate: function (diff) {
                var a1=_r(1,20), d=_r(1, diff==='easy'?5:15);
                var len = diff==='easy'?3 : diff==='medium'?4 : 5;
                var seq = Array.from({length:len}, function(_,i){ return a1+i*d; });
                var ans = a1 + len*d;
                return {
                    text: `${seq.join('، ')}، ؟`,
                    answer: ans,
                    hint: `الفرق الثابت = ${d} — أضف ${d} للحد الأخير`,
                    explanation: `الفرق الثابت = ${d}\nالحد التالي = ${seq[seq.length-1]} + ${d} = ${ans}`,
                    catKey: 'sequences',
                    wrongHints: [ans+1, ans-d, ans+d*2]
                };
            }
        },

        {
            id: 'seq_arith_nth', conceptId: 'seq_arith', name: 'المتتالية الحسابية — الحد العام',
            formula: 'أن = أ₁ + (ن−1)×د', difficulty: 6,
            generate: function (diff) {
                var a1=_r(1,10), d=_r(1,8);
                var n = diff==='easy'?5 : diff==='medium'?_r(5,10) : _r(8,15);
                var ans = a1 + (n-1)*d;
                return {
                    text: `متتالية أولها ${a1} وفرقها ${d}. الحد ${n} = ؟`,
                    answer: ans,
                    hint: `أن = أ₁ + (ن−1)×د = ${a1} + (${n}−1)×${d}`,
                    explanation: `أن = ${a1} + (${n}−1) × ${d}\n= ${a1} + ${n-1} × ${d}\n= ${a1} + ${(n-1)*d}\n= ${ans}`,
                    catKey: 'sequences',
                    wrongHints: [a1+n*d, ans+d, a1+(n)*d]
                };
            }
        },

        {
            id: 'seq_geo_next', conceptId: 'seq_geo', name: 'المتتالية الهندسية — الحد التالي',
            formula: 'أن = أ₁ × أسـ^(ن−1)', difficulty: 5,
            generate: function (diff) {
                var a1=_r(1,5), r=_r(2, diff==='easy'?3:4);
                var len = diff==='easy'?3 : 4;
                var seq = Array.from({length:len}, function(_,i){ return a1*Math.pow(r,i); });
                var ans = a1 * Math.pow(r, len);
                return {
                    text: `${seq.join('، ')}، ؟`,
                    answer: ans,
                    hint: `الأساس الثابت = ${r} — اضرب الحد الأخير في ${r}`,
                    explanation: `الأساس الثابت = ${r}\nالحد التالي = ${seq[seq.length-1]} × ${r} = ${ans}`,
                    catKey: 'sequences',
                    wrongHints: [ans+r, seq[seq.length-1]+r, ans*r]
                };
            }
        },

        /* ══════════════════════════════════════════
           الهندسة — ٤ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'area_rect', conceptId: 'geo_area_basic', name: 'مساحة المستطيل',
            formula: 'المساحة = الطول × العرض', difficulty: 3,
            generate: function (diff) {
                var a=_r(2, diff==='easy'?10:20), b=_r(2, diff==='easy'?10:20);
                var ans=a*b;
                return {
                    text: `مستطيل طوله ${a} وعرضه ${b}. مساحته = ؟`,
                    answer: ans,
                    hint: 'المساحة = الطول × العرض',
                    explanation: `المساحة = ${a} × ${b} = ${ans} وحدة مربعة`,
                    catKey: 'geometry',
                    wrongHints: [2*(a+b), ans+a, ans-b]
                };
            }
        },

        {
            id: 'area_triangle', conceptId: 'geo_area_tri', name: 'مساحة المثلث',
            formula: 'المساحة = ½ × القاعدة × الارتفاع', difficulty: 4,
            generate: function (diff) {
                var base=_r(2,diff==='easy'?10:20)*2, h=_r(2,diff==='easy'?10:15);
                var ans = base*h/2;
                return {
                    text: `مثلث قاعدته ${base} وارتفاعه ${h}. مساحته = ؟`,
                    answer: ans,
                    hint: 'المساحة = نصف قاعدة × ارتفاع',
                    explanation: `المساحة = ½ × ${base} × ${h}\n= ${base*h}/2\n= ${ans} وحدة مربعة`,
                    catKey: 'geometry',
                    wrongHints: [base*h, ans+base, ans*2]
                };
            }
        },

        {
            id: 'area_circle', conceptId: 'geo_area_circle', name: 'مساحة الدائرة',
            formula: 'المساحة = π × ر²', difficulty: 5,
            generate: function (diff) {
                var r=_r(1, diff==='easy'?5:10);
                var ans=Math.round(Math.PI*r*r);
                return {
                    text: `دائرة نصف قطرها ${r}. مساحتها ≈ ؟ (π≈3.14)`,
                    answer: ans,
                    hint: 'المساحة = π × ر² = 3.14 × ر × ر',
                    explanation: `المساحة = π × ${r}²\n= 3.14 × ${r*r}\n≈ ${ans} وحدة مربعة`,
                    catKey: 'geometry',
                    wrongHints: [Math.round(2*Math.PI*r), ans+r, ans*2]
                };
            }
        },

        {
            id: 'pythagoras', conceptId: 'geo_pythagoras', name: 'نظرية فيثاغورس',
            formula: 'ج² = أ² + ب²', difficulty: 7,
            generate: function (diff) {
                /* ثلاثيات فيثاغورس المضمونة */
                var triples = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
                if (diff==='hard'||diff==='genius') triples.push([7,24,25],[20,21,29]);
                var t = triples[_r(0, triples.length-1)];
                var type = _r(0,2); /* 0=أوجد الوتر، 1=أوجد أ، 2=أوجد ب */
                var a=t[0], b=t[1], c=t[2];
                var text, ans;
                if (type===0) {
                    text = `مثلث قائم أضلاعه ${a} و${b}. الوتر = ؟`;
                    ans  = c;
                } else if (type===1) {
                    text = `مثلث قائم وتره ${c} وضلعه ${b}. الضلع الآخر = ؟`;
                    ans  = a;
                } else {
                    text = `مثلث قائم وتره ${c} وضلعه ${a}. الضلع الآخر = ؟`;
                    ans  = b;
                }
                return {
                    text: text,
                    answer: ans,
                    hint: `ج² = أ² + ب²  ←  ${a}²+${b}² = ${a*a}+${b*b} = ${c*c} = ${c}²`,
                    explanation: `نظرية فيثاغورس: ج² = أ² + ب²\n${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}\nج = √${c*c} = ${c}`,
                    catKey: 'geometry',
                    wrongHints: [a+b, ans+1, ans-1]
                };
            }
        },

        /* ══════════════════════════════════════════
           اللوغاريتم — ٢ قانونان
        ══════════════════════════════════════════ */

        {
            id: 'log_basic', conceptId: 'log_basic', name: 'اللوغاريتم الأساسي',
            formula: 'logₐ(aⁿ) = ن', difficulty: 7,
            generate: function (diff) {
                var pairs = [
                    {base:2,n:8,exp:3},{base:2,n:16,exp:4},{base:2,n:32,exp:5},
                    {base:3,n:9,exp:2},{base:3,n:27,exp:3},{base:5,n:25,exp:2},
                    {base:4,n:16,exp:2},{base:10,n:100,exp:2},{base:10,n:1000,exp:3}
                ];
                if (diff==='easy') pairs = pairs.filter(function(p){ return p.exp<=3; });
                var p = pairs[_r(0, pairs.length-1)];
                return {
                    text: `log${p.base}(${p.n}) = ؟`,
                    answer: p.exp,
                    hint: `${p.base}^x = ${p.n} — أوجد x`,
                    explanation: `log${p.base}(${p.n}) = ${p.exp}\nلأن: ${p.base}^${p.exp} = ${p.n} ✓`,
                    catKey: 'algebra',
                    wrongHints: [p.exp+1, p.exp-1, p.exp*2]
                };
            }
        },

        {
            id: 'log_product_law', conceptId: 'log_basic', name: 'قانون لوغاريتم الضرب',
            formula: 'logₐ(ب×ج) = logₐ(ب) + logₐ(ج)', difficulty: 9,
            generate: function (diff) {
                var base=10, a=_r(1,4), b=_r(1,4), ans=a+b;
                var pa=Math.pow(10,a), pb=Math.pow(10,b);
                return {
                    text: `log₁₀(${pa}) + log₁₀(${pb}) = ؟`,
                    answer: ans,
                    hint: `log(أ) + log(ب) = log(أ×ب) — ثم أوجد اللوغاريتم`,
                    explanation: `log₁₀(${pa}) = ${a}\nlog₁₀(${pb}) = ${b}\n${a} + ${b} = ${ans}`,
                    catKey: 'algebra',
                    wrongHints: [a*b, ans+1, ans-1]
                };
            }
        },

        /* ══════════════════════════════════════════
           المثلثات — ٣ قوانين
        ══════════════════════════════════════════ */

        {
            id: 'sin_basic', conceptId: 'trig_basic', name: 'جيب الزاوية',
            formula: 'جا(θ) = الضلع المقابل / الوتر', difficulty: 7,
            generate: function (diff) {
                var vals = [
                    {deg:0,frac:'0',val:0,mem:'الصفر الكامل'},
                    {deg:30,frac:'½',val:0.5,mem:'النصف'},
                    {deg:45,frac:'√2/2',val:0.71,mem:'قريب من 0.71'},
                    {deg:60,frac:'√3/2',val:0.87,mem:'قريب من 0.87'},
                    {deg:90,frac:'1',val:1,mem:'الواحد الكامل'}
                ];
                var v = vals[_r(0,vals.length-1)];
                return {
                    text: `جا(${v.deg}°) = ؟`,
                    answer: v.val,
                    hint: `جيب ${v.deg}° = ${v.frac} — ${v.mem}`,
                    explanation: `جا(${v.deg}°) = ${v.frac} = ${v.val}\n💡 تذكّر: ${v.mem}`,
                    catKey: 'advanced',
                    wrongHints: [v.val===0?1:0, v.val===1?0.5:1, 1-v.val]
                };
            }
        },

        {
            id: 'cos_basic', conceptId: 'trig_basic', name: 'جيب التمام',
            formula: 'جتا(θ) = الضلع المجاور / الوتر', difficulty: 7,
            generate: function (diff) {
                var vals = [
                    {deg:0,frac:'1',val:1},{deg:30,frac:'√3/2',val:0.87},
                    {deg:45,frac:'√2/2',val:0.71},{deg:60,frac:'½',val:0.5},{deg:90,frac:'0',val:0}
                ];
                var v = vals[_r(0,vals.length-1)];
                return {
                    text: `جتا(${v.deg}°) = ؟`,
                    answer: v.val,
                    hint: `جيب التمام ${v.deg}° = ${v.frac}`,
                    explanation: `جتا(${v.deg}°) = ${v.frac} = ${v.val}\n💡 جتا = عكس جا (جتا0°=1، جتا90°=0)`,
                    catKey: 'advanced',
                    wrongHints: [1-v.val, v.val===0?0.5:0, v.val+0.1]
                };
            }
        },

        {
            id: 'tan_basic', conceptId: 'trig_basic', name: 'الظل',
            formula: 'ظا(θ) = جا(θ) / جتا(θ)', difficulty: 7,
            generate: function (diff) {
                var vals = [
                    {deg:0,frac:'0',val:0},{deg:30,frac:'1/√3',val:0.58},
                    {deg:45,frac:'1',val:1},{deg:60,frac:'√3',val:1.73}
                ];
                var v = vals[_r(0,vals.length-1)];
                return {
                    text: `ظا(${v.deg}°) = ؟`,
                    answer: v.val,
                    hint: `ظا = جا/جتا — ظا(${v.deg}°) = ${v.frac}`,
                    explanation: `ظا(${v.deg}°) = جا÷جتا = ${v.frac} = ${v.val}`,
                    catKey: 'advanced',
                    wrongHints: [v.val+0.5, 1-v.val, v.val+1]
                };
            }
        }

    ];

    /* فهرسة بالمعرف وبالمفهوم */
    var _byId  = {};
    var _byCon = {};
    laws.forEach(function (l) {
        _byId[l.id] = l;
        if (!_byCon[l.conceptId]) _byCon[l.conceptId] = [];
        _byCon[l.conceptId].push(l);
    });

    /* جلب قانون بمعرفه */
    function get(id) { return _byId[id] || null; }

    /* جلب كل قوانين مفهوم معين */
    function byConcept(conceptId) { return _byCon[conceptId] || []; }

    /* جلب قانون مناسب للمفهوم والصعوبة */
    function pick(conceptId, diff) {
        var pool = _byCon[conceptId] || [];
        if (pool.length === 0) return null;
        /* رتّب حسب الصعوبة */
        var diffNum = {easy:1, medium:5, hard:8, genius:10}[diff] || 5;
        var scored  = pool.map(function(l){ return {l:l, d:Math.abs(l.difficulty - diffNum)}; });
        scored.sort(function(a,b){ return a.d - b.d; });
        /* اختر عشوائياً من أفضل 2 */
        var top = scored.slice(0, Math.min(2, scored.length));
        return top[Math.floor(Math.random() * top.length)].l;
    }

    return { all: laws, get: get, byConcept: byConcept, pick: pick };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ② مولّد المسائل الكلامية اللانهائي
   سياقات لا تتكرر — الأرقام متغيرة + السياق متنوع
═══════════════════════════════════════════════════════════════════════ */

var WordProblemGenerator = (function () {

    function _r(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    /* أسماء ومفردات متنوعة */
    var NAMES   = ['أحمد','سارة','خالد','ليلى','محمد','هند','عمر','نورة','يوسف','رنا','علي','منى','تركي','ريم'];
    var ITEMS   = ['تفاحة','كتاب','قلم','بطاقة','طابع','لعبة','قطعة','ورقة','درهم','ريال'];
    var PLACES  = ['المكتبة','السوق','المدرسة','الحديقة','المتجر','المخزن','المستودع','الملعب'];
    var UNITS   = ['كيلومتر','متر','ساعة','يوم','صندوق','شجرة','طالب','وحدة'];

    function _n()  { return NAMES [_r(0, NAMES.length -1)]; }
    function _it() { return ITEMS [_r(0, ITEMS.length -1)]; }
    function _pl() { return PLACES[_r(0, PLACES.length-1)]; }
    function _u()  { return UNITS [_r(0, UNITS.length -1)]; }

    /* ─── مسألة جمع ─── */
    function add(diff) {
        var max = diff==='easy'?30 : diff==='medium'?200 : 1000;
        var a   = _r(5, max), b = _r(5, max);
        var n   = _n(), it = _it();
        var templates = [
            { t:`لدى ${n} ${a} ${it}، اشترى ${b} أخرى. كم ${it} لديه الآن؟`,     e:`${a}+${b}=${a+b}` },
            { t:`جمع ${n} ${a} ${it} من ${_pl()} و${b} من ${_pl()}. الإجمالي = ؟`, e:`${a}+${b}=${a+b}` },
            { t:`في اليوم الأول ${a} ${_u()} وفي الثاني ${b}. المجموع = ؟`,         e:`${a}+${b}=${a+b}` },
            { t:`فريق الصباح أنجز ${a} مهمة والمساء ${b}. المجموع = ؟`,             e:`${a}+${b}=${a+b}` },
            { t:`رصيد ${n} ${a} ريالاً، أودع ${b} ريالاً. الرصيد الجديد = ؟`,       e:`${a}+${b}=${a+b}` }
        ];
        var tmpl = templates[_r(0, templates.length-1)];
        return { text: tmpl.t, answer: a+b, hint: 'اجمع العددين للحصول على المجموع',
                 explanation: tmpl.e, catKey: 'wordproblems',
                 wrongHints: [a+b+1, a+b-1, a+b+10] };
    }

    /* ─── مسألة ضرب ─── */
    function mul(diff) {
        var max = diff==='easy'?8 : diff==='medium'?15 : 25;
        var a   = _r(2, max), b = _r(2, max);
        var templates = [
            { t:`ثمن ${_it()} الواحد ${a} ريال. ثمن ${b} قطعة = ؟`,    e:`${b}×${a}=${a*b} ريال` },
            { t:`سيارة تقطع ${a} كم/ساعة. في ${b} ساعات تقطع = ؟`,     e:`${a}×${b}=${a*b} كم` },
            { t:`${a} صفوف، في كل صف ${b} طالباً. المجموع = ؟`,         e:`${a}×${b}=${a*b} طالب` },
            { t:`صندوق يحتوي ${a} ${_it()}. ${b} صندوق تحتوي = ؟`,      e:`${a}×${b}=${a*b}` },
            { t:`قطعة أرض طولها ${a}م وعرضها ${b}م. مساحتها = ؟`,       e:`${a}×${b}=${a*b} م²` }
        ];
        var tmpl = templates[_r(0, templates.length-1)];
        return { text: tmpl.t, answer: a*b, hint: 'اضرب العددين',
                 explanation: tmpl.e, catKey: 'wordproblems',
                 wrongHints: [a*b+a, a*b-b, a+b] };
    }

    /* ─── مسألة خطوتان ─── */
    function twoStep(diff) {
        var max = diff==='easy'?50 : diff==='medium'?200 : 500;
        var a   = _r(20, max), b = _r(5, Math.floor(a/2)), c = _r(2, diff==='easy'?4:8);
        var ans = (a-b)*c;
        var templates = [
            { t:`كان لدى ${_n()} ${a} ${_it()}، أعاد ${b}، ثم ضاعف الباقي ${c} مرات. الإجمالي = ؟`,
              e:`①: ${a}−${b}=${a-b}  ②: ${a-b}×${c}=${ans}` },
            { t:`مستودع به ${a} وحدة، شُحن ${b}، ثم تضاعف الباقي ${c} مرات. الناتج = ؟`,
              e:`①: ${a}−${b}=${a-b}  ②: ${a-b}×${c}=${ans}` },
            { t:`بدأ الفريق بـ${a} نقطة، خسر ${b}، ثم حقق المجموع ${c} أضعاف. النهائي = ؟`,
              e:`①: ${a}−${b}=${a-b}  ②: ${a-b}×${c}=${ans}` }
        ];
        var tmpl = templates[_r(0, templates.length-1)];
        return { text: tmpl.t, answer: ans,
                 hint: `① اطرح أولاً: ${a}−${b}  ② ثم اضرب: ×${c}`,
                 explanation: tmpl.e, catKey: 'wordproblems',
                 wrongHints: [a*c-b, (a-b)+c, ans+c] };
    }

    /* ─── مسألة ثلاث خطوات (عبقري) ─── */
    function threeStep(diff) {
        var a = _r(100, 500), b = _r(10, 50), c = _r(2, 5), d = _r(5, 25);
        var ans = (a-b)*c + d;
        var templates = [
            { t:`بدأ بـ${a}، خسر ${b}، ضاعف الباقي ${c} مرات، أضاف ${d}. النتيجة = ؟`,
              e:`①: ${a}−${b}=${a-b}  ②: ${a-b}×${c}=${(a-b)*c}  ③: +${d}=${ans}` },
            { t:`مستودع: ${a} وحدة → شُحن ${b} → تضاعف ${c}× → أُضيف ${d}. الإجمالي = ؟`,
              e:`①: ${a-b}  ②: ${(a-b)*c}  ③: ${ans}` },
            { t:`رصيد ${a} → صُرف ${b} → ضوعف ${c}× → أُودع ${d}. الرصيد النهائي = ؟`,
              e:`①: ${a}−${b}=${a-b}  ②: ×${c}=${(a-b)*c}  ③: +${d}=${ans}` }
        ];
        var tmpl = templates[_r(0, templates.length-1)];
        return { text: tmpl.t, answer: ans,
                 hint: 'رتّب العمليات: طرح ← ضرب ← جمع',
                 explanation: tmpl.e, catKey: 'wordproblems',
                 wrongHints: [(a-b)*c, ans-d, (a+b)*c+d] };
    }

    /* ─── مسألة نسبة مئوية كلامية ─── */
    function percent(diff) {
        var pcts  = diff==='easy'?[10,25,50]:[10,15,20,25,30,50];
        var pct   = pcts[_r(0,pcts.length-1)];
        var base  = _r(2,20)*10;
        var ans   = Math.round(base*pct/100);
        var templates = [
            { t:`سعر ${_it()} ${base} ريال، خُفِّض بنسبة ${pct}%. التخفيض بالريال = ؟`,    e:`${base}×${pct}%=${ans}` },
            { t:`راتب ${_n()} ${base} ريال، رُفع ${pct}%. قيمة الزيادة = ؟`,               e:`${base}×${pct}/100=${ans}` },
            { t:`من فصل مكوّن من ${base} طالب، ${pct}% غائبون. عدد الغائبين = ؟`,          e:`${base}×${pct}%=${ans}` }
        ];
        var tmpl = templates[_r(0,templates.length-1)];
        return { text: tmpl.t, answer: ans,
                 hint: `${pct}% من ${base} = ${base} × ${pct}/100`,
                 explanation: tmpl.e, catKey: 'wordproblems',
                 wrongHints: [base-ans, ans*2, ans+10] };
    }

    return { add: add, mul: mul, twoStep: twoStep, threeStep: threeStep, percent: percent };
})();


/* ═══════════════════════════════════════════════════════════════════════
   ③ دالة القرار الموحّدة — SmartQuestionBuilder
   تربط DecisionEngine + LawBank + WordProblemGenerator معاً
   هذه هي النقطة الوحيدة التي تحتاج استدعاءها من اللعبة
═══════════════════════════════════════════════════════════════════════ */

var SmartQuestionBuilder = (function () {

    /* ─── خريطة ربط المفاهيم بالقوانين المناسبة ─── */
    var CONCEPT_LAWS = {
        'add_simple':       ['add_basic'],
        'add_carry':        ['add_basic'],
        'sub_simple':       ['sub_basic'],
        'sub_borrow':       ['sub_basic'],
        'mul_table':        ['mul_basic'],
        'mul_multi':        ['mul_basic'],
        'div_simple':       ['div_basic'],
        'div_remainder':    ['div_basic'],
        'percent_basic':    ['percent_of'],
        'percent_reverse':  ['percent_reverse'],
        'percent_change':   ['percent_change'],
        'fraction_concept': ['fraction_add_same'],
        'fraction_add_same':['fraction_add_same'],
        'fraction_add_diff':['fraction_add_diff'],
        'fraction_mul':     ['fraction_mul', 'fraction_div'],
        'power_basic':      ['power_basic'],
        'power_laws':       ['power_mul_law', 'power_div_law'],
        'sqrt_basic':       ['sqrt_basic'],
        'equation_simple':  ['eq_one_step'],
        'equation_linear':  ['eq_two_steps', 'eq_both_sides'],
        'equation_quad':    ['eq_quadratic'],
        'seq_arith':        ['seq_arith_next', 'seq_arith_nth'],
        'seq_geo':          ['seq_geo_next'],
        'seq_special':      ['seq_arith_nth', 'seq_geo_next'],
        'geo_area_basic':   ['area_rect'],
        'geo_area_tri':     ['area_triangle'],
        'geo_area_circle':  ['area_circle'],
        'geo_pythagoras':   ['pythagoras'],
        'geo_volume':       ['area_circle'],
        'log_basic':        ['log_basic', 'log_product_law'],
        'trig_basic':       ['sin_basic', 'cos_basic', 'tan_basic'],
        'word_add':         ['_word_add'],
        'word_mul':         ['_word_mul'],
        'word_multi_step':  ['_word_twostep'],
        'word_genius':      ['_word_threestep']
    };

    /* ─── بناء سؤال من قانون ─── */
    function _fromLaw(lawId, diff) {
        /* مسائل كلامية */
        if (lawId === '_word_add')       return WordProblemGenerator.add(diff);
        if (lawId === '_word_mul')       return WordProblemGenerator.mul(diff);
        if (lawId === '_word_twostep')   return WordProblemGenerator.twoStep(diff);
        if (lawId === '_word_threestep') return WordProblemGenerator.threeStep(diff);
        if (lawId === '_word_percent')   return WordProblemGenerator.percent(diff);

        /* قوانين من البنك */
        var law = LawBank.get(lawId);
        if (!law) return null;
        return law.generate(diff);
    }

    /* ─── بناء خيارات خاطئة منطقية ─── */
    function _buildChoices(answer, wrongHints) {
        var wrongs = new Set();
        var safety = 0;

        /* أضف wrongHints المقترحة */
        (wrongHints || []).forEach(function (w) {
            var v = Math.round(w * 100) / 100;
            if (v !== answer && !isNaN(v) && isFinite(v)) wrongs.add(v);
        });

        /* أكمل إذا لزم */
        while (wrongs.size < 3 && safety < 100) {
            safety++;
            var offset = safety % 2 === 0 ? safety : -safety;
            var candidate = Math.round((answer + offset) * 100) / 100;
            if (candidate !== answer && !isNaN(candidate) && candidate > 0) {
                wrongs.add(candidate);
            }
        }

        var arr = Array.from(wrongs).slice(0, 3);
        /* خلط عشوائي */
        var all = [answer].concat(arr);
        for (var i = all.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = all[i]; all[i] = all[j]; all[j] = tmp;
        }
        return all;
    }

    /*
     * ─── الدالة الرئيسية ───
     * المدخلات:
     *   op        — العملية (مثل 'mix', 'add', 'fraction_add')
     *   gameMode  — وضع اللعبة ('classic', 'survival', 'rocket', ...)
     *   gameLevel — مستوى اللعبة (1-200)
     *
     * المخرجات: كائن سؤال متوافق مع النظام الحالي
     *   { text, answer, hint, explanation, catKey, choices, lawId, conceptId, difficulty, reason }
     */
    function build(op, gameMode, gameLevel) {

        /* ① قرار ماذا نسأل */
        var decision = DecisionEngine.decide(op, gameMode || 'classic', gameLevel || 1);
        var conceptId = decision.conceptId;
        var diff      = decision.difficulty;
        var reason    = decision.reason;

        /* ② إذا لم يُحدَّد مفهوم — استخدم العملية مباشرة */
        if (!conceptId) {
            conceptId = SmartAI.conceptOf(op !== 'mix' ? op : 'add_simple');
        }

        /* ③ اختر القانون المناسب */
        var lawIds = CONCEPT_LAWS[conceptId] || [];
        if (lawIds.length === 0) {
            /* fallback: العملية مباشرة */
            conceptId = 'add_simple';
            lawIds    = CONCEPT_LAWS['add_simple'];
            diff      = 'easy';
        }
        var lawId = lawIds[Math.floor(Math.random() * lawIds.length)];

        /* ④ توليد السؤال من القانون */
        var q = _fromLaw(lawId, diff);
        if (!q) return null;

        /* ⑤ بناء الخيارات */
        q.choices   = _buildChoices(q.answer, q.wrongHints);
        q.lawId     = lawId;
        q.conceptId = conceptId;
        q.difficulty= diff;
        q.reason    = reason;

        /* تنظيف */
        delete q.wrongHints;

        return q;
    }

    /* ─── بناء سؤال من قانون محدد مباشرة ─── */
    function buildFromLaw(lawId, diff) {
        var q = _fromLaw(lawId, diff || 'medium');
        if (!q) return null;
        q.choices   = _buildChoices(q.answer, q.wrongHints);
        q.lawId     = lawId;
        delete q.wrongHints;
        return q;
    }

    /* ─── بناء مسألة كلامية بنوع محدد ─── */
    function buildWordProblem(type, diff) {
        var fn = {
            add: WordProblemGenerator.add,
            mul: WordProblemGenerator.mul,
            twoStep: WordProblemGenerator.twoStep,
            threeStep: WordProblemGenerator.threeStep,
            percent: WordProblemGenerator.percent
        }[type];
        if (!fn) return null;
        var q = fn(diff || 'medium');
        q.choices = _buildChoices(q.answer, q.wrongHints);
        delete q.wrongHints;
        return q;
    }

    return { build: build, buildFromLaw: buildFromLaw, buildWordProblem: buildWordProblem };
})();


/* ─── إضافة SmartQuestionBuilder إلى SmartAI ─── */
SmartAI.buildQuestion    = SmartQuestionBuilder.build;
SmartAI.buildFromLaw     = SmartQuestionBuilder.buildFromLaw;
SmartAI.buildWordProblem = SmartQuestionBuilder.buildWordProblem;
SmartAI.laws             = LawBank;
SmartAI.wordGen          = WordProblemGenerator;

