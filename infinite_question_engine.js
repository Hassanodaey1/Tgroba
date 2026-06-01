/* ═══════════════════════════════════════════════════════════════════════
   HO Math — محرك الأسئلة اللانهائي  v1.0
   © 2026 Hassan Odaey

   المبدأ: قوانين رياضية × مجموعة الأعداد → دالة توليد → أسئلة لا نهاية لها

   التوافق:
     ✅ جميع أوضاع اللعب: classic, speed, survival, frenzy, daily, weekly,
        accuracy, marathon, impossible, memory, chain, sudden, rocket
     ✅ لعبة المنافسة (competition_logic.js)
     ✅ محرك الأسئلة الذكي (questions_engine.js)
     ✅ نظام genQ الأصلي (questions.js)
     ✅ خمس مستويات: سهل / متوسط / صعب / عبقري / تلقائي (AI)
     ✅ قابل للتوسيع: أضف قانوناً جديداً بسطر واحد

   الهيكل:
     ① بنك القوانين     — كل قانون = وحدة مستقلة قابلة للإضافة
     ② مجموعات الأعداد — نطاقات دقيقة لكل مستوى
     ③ دالة التوليد     — تختار القانون + تولّد الأعداد + تبني السؤال
     ④ خيارات ذكية     — مبنية على الأخطاء الشائعة الحقيقية لكل قانون
     ⑤ واجهة موحدة     — نقطة دخول وحيدة تعمل مع جميع الألعاب
═══════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────
   ① بنك القوانين
   كل قانون = كائن { id, label, levels, generate(sets, level) }
   generate() تُعيد: { text, hint, explanation, answer: Number }
─────────────────────────────────────────────────────────────────────── */

var IQE_LAWS = [

    /* ══════════════════ الجمع ══════════════════ */
    {
        id: 'add_basic', label: 'الجمع الأساسي', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(s.min, s.max), b = s.rnd(s.min, s.max);
            var ans = a + b;
            return {
                text: a + ' + ' + b,
                hint: 'اجمع العددين',
                explanation: a + ' + ' + b + ' = ' + ans + '\nالتحقق: ' + ans + ' − ' + b + ' = ' + a + ' ✓',
                answer: ans, catKey: 'addition'
            };
        }
    },
    {
        id: 'add_three', label: 'جمع ثلاثة أعداد', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(s.min, s.mid), b = s.rnd(s.min, s.mid), c = s.rnd(s.min, s.mid);
            var ans = a + b + c;
            return {
                text: a + ' + ' + b + ' + ' + c,
                hint: 'اجمع الأعداد الثلاثة',
                explanation: '(' + a + '+' + b + ') + ' + c + ' = ' + (a+b) + ' + ' + c + ' = ' + ans,
                answer: ans, catKey: 'addition'
            };
        }
    },
    {
        id: 'add_commutative', label: 'قانون التبادل (أ+ب=ب+أ)', levels: ['easy','medium'],
        generate: function(s) {
            var a = s.rnd(s.min, s.max), b = s.rnd(s.min, s.max);
            var ans = a + b;
            return {
                text: a + ' + ' + b + ' = ' + b + ' + ؟',
                hint: 'قانون التبادل: أ+ب = ب+أ',
                explanation: 'بموجب قانون التبادل، المجموع لا يتغير\n' + b + ' + ' + a + ' = ' + ans,
                answer: ans, catKey: 'addition'
            };
        }
    },

    /* ══════════════════ الطرح ══════════════════ */
    {
        id: 'sub_basic', label: 'الطرح الأساسي', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(s.min + s.gap, s.max), b = s.rnd(s.min, a - 1);
            var ans = a - b;
            return {
                text: a + ' − ' + b,
                hint: 'اطرح العددين',
                explanation: a + ' − ' + b + ' = ' + ans + '\nالتحقق: ' + ans + ' + ' + b + ' = ' + a + ' ✓',
                answer: ans, catKey: 'subtraction'
            };
        }
    },
    {
        id: 'sub_from_round', label: 'الطرح من عدد مستدير', levels: ['easy','medium'],
        generate: function(s) {
            var rounds = [10,20,50,100,200,500,1000].filter(function(r){ return r <= s.max * 2; });
            var base = rounds[s.rnd(0, rounds.length - 1)];
            var b = s.rnd(1, Math.floor(base / 2));
            var ans = base - b;
            return {
                text: base + ' − ' + b,
                hint: 'الطرح من عدد مستدير',
                explanation: base + ' − ' + b + ' = ' + ans,
                answer: ans, catKey: 'subtraction'
            };
        }
    },

    /* ══════════════════ الضرب ══════════════════ */
    {
        id: 'mul_basic', label: 'الضرب الأساسي', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(s.mMin, s.mMax), b = s.rnd(s.mMin, s.mMax);
            var ans = a * b;
            return {
                text: a + ' × ' + b,
                hint: 'اضرب العددين',
                explanation: a + ' × ' + b + ' = ' + ans,
                answer: ans, catKey: 'multiplication'
            };
        }
    },
    {
        id: 'mul_commutative', label: 'قانون تبادل الضرب', levels: ['easy','medium'],
        generate: function(s) {
            var a = s.rnd(s.mMin, Math.min(s.mMax, 12)), b = s.rnd(s.mMin, Math.min(s.mMax, 12));
            var ans = a * b;
            return {
                text: a + ' × ' + b + ' = ' + b + ' × ؟',
                hint: 'قانون التبادل في الضرب',
                explanation: 'قانون التبادل: أ×ب = ب×أ\n' + b + ' × ' + a + ' = ' + ans,
                answer: ans, catKey: 'multiplication'
            };
        }
    },
    {
        id: 'mul_distributive', label: 'قانون التوزيع أ×(ب+ج)', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, Math.min(s.mMax, 15));
            var b = s.rnd(2, Math.min(s.mMax, 20));
            var c = s.rnd(1, Math.min(s.mMax, 10));
            var ans = a * (b + c);
            return {
                text: a + ' × (' + b + ' + ' + c + ')',
                hint: 'قانون التوزيع: أ×(ب+ج) = أ×ب + أ×ج',
                explanation: a + '×' + b + ' + ' + a + '×' + c + ' = ' + (a*b) + ' + ' + (a*c) + ' = ' + ans,
                answer: ans, catKey: 'multiplication'
            };
        }
    },
    {
        id: 'mul_by_10', label: 'الضرب في 10 و100', levels: ['easy','medium'],
        generate: function(s) {
            var a = s.rnd(s.min, Math.min(s.max, 100));
            var factor = [10, 100][s.rnd(0, 1)];
            var ans = a * factor;
            return {
                text: a + ' × ' + factor,
                hint: 'أضف أصفاراً بعد العدد',
                explanation: a + ' × ' + factor + ' = ' + ans + '\n(أضف ' + String(factor).length - 1 + ' أصفار)',
                answer: ans, catKey: 'multiplication'
            };
        }
    },
    {
        id: 'mul_associative', label: 'قانون التجميع (أ×ب)×ج', levels: ['medium','hard'],
        generate: function(s) {
            var a = s.rnd(2, 5), b = s.rnd(2, 5), c = s.rnd(2, 5);
            var ans = a * b * c;
            return {
                text: '(' + a + ' × ' + b + ') × ' + c,
                hint: 'قانون التجميع: (أ×ب)×ج = أ×(ب×ج)',
                explanation: '(' + a + '×' + b + ')×' + c + ' = ' + (a*b) + '×' + c + ' = ' + ans,
                answer: ans, catKey: 'multiplication'
            };
        }
    },

    /* ══════════════════ القسمة ══════════════════ */
    {
        id: 'div_basic', label: 'القسمة الأساسية', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var b = s.rnd(s.mMin, s.mMax);
            var ans = s.rnd(1, s.mMax);
            var a = b * ans;
            return {
                text: a + ' ÷ ' + b,
                hint: 'القسمة عكس الضرب',
                explanation: a + ' ÷ ' + b + ' = ' + ans + '\nالتحقق: ' + ans + ' × ' + b + ' = ' + a + ' ✓',
                answer: ans, catKey: 'division'
            };
        }
    },
    {
        id: 'div_with_remainder', label: 'باقي القسمة', levels: ['medium','hard'],
        generate: function(s) {
            var b = s.rnd(2, Math.min(s.mMax, 10));
            var q = s.rnd(2, Math.min(s.mMax, 20));
            var r = s.rnd(1, b - 1);
            var a = b * q + r;
            return {
                text: a + ' ÷ ' + b + ' = ؟ باقٍ ' + r + '؟ — ما الناتج الصحيح؟',
                hint: 'أ = ب×ج + الباقي',
                explanation: a + ' = ' + b + ' × ' + q + ' + ' + r + '\nالناتج = ' + q,
                answer: q, catKey: 'division'
            };
        }
    },

    /* ══════════════════ النسبة المئوية ══════════════════ */
    {
        id: 'percent_of', label: 'النسبة المئوية من عدد', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var pctSets = {
                easy:   [10, 25, 50],
                medium: [10, 20, 25, 50, 75],
                hard:   [5, 10, 15, 20, 25, 30, 40, 60, 75, 80],
                genius: [5, 10, 12.5, 15, 20, 33, 40, 60, 66, 75, 80, 90]
            };
            var pcts = pctSets[s.level] || pctSets.easy;
            var pct = pcts[s.rnd(0, pcts.length - 1)];
            var base = s.rnd(2, Math.min(20, Math.floor(s.max / 10))) * 10;
            var ans = Math.round(base * pct / 100);
            var tips = { 10:'اقسم على 10', 25:'اقسم على 4', 50:'اقسم على 2', 75:'خذ ¾' };
            return {
                text: pct + '% من ' + base,
                hint: tips[pct] || 'اضرب في ' + pct + '/100',
                explanation: pct + '% من ' + base + ' = ' + base + ' × ' + pct + '/100 = ' + ans
                           + (tips[pct] ? '\n💡 ' + tips[pct] : ''),
                answer: ans, catKey: 'percentage'
            };
        }
    },
    {
        id: 'percent_find_base', label: 'إيجاد الأصل من النسبة', levels: ['hard','genius'],
        generate: function(s) {
            var pct = [10, 20, 25, 50][s.rnd(0, 3)];
            var part = s.rnd(2, 20) * pct / 10;
            var ans = Math.round(part / pct * 100);
            return {
                text: 'إذا كانت ' + pct + '% من العدد = ' + part + '، فما العدد؟',
                hint: 'العدد = الجزء ÷ النسبة × 100',
                explanation: 'العدد = ' + part + ' ÷ ' + pct + ' × 100 = ' + ans,
                answer: ans, catKey: 'percentage'
            };
        }
    },
    {
        id: 'percent_change', label: 'نسبة الزيادة والنقصان', levels: ['hard','genius'],
        generate: function(s) {
            var base = s.rnd(10, 100) * 10;
            var pct = [10, 20, 25, 50][s.rnd(0, 3)];
            var isIncrease = s.rnd(0, 1) === 1;
            var change = Math.round(base * pct / 100);
            var ans = isIncrease ? base + change : base - change;
            return {
                text: 'عدد قيمته ' + base + '، ' + (isIncrease ? 'زاد' : 'نقص') + ' بنسبة ' + pct + '%. الناتج = ؟',
                hint: isIncrease ? 'أضف نسبة الزيادة' : 'اطرح نسبة النقصان',
                explanation: base + ' ' + (isIncrease?'+':'-') + ' (' + pct + '% × ' + base + ') = ' + base + ' ' + (isIncrease?'+':'-') + ' ' + change + ' = ' + ans,
                answer: ans, catKey: 'percentage'
            };
        }
    },

    /* ══════════════════ القوى والجذور ══════════════════ */
    {
        id: 'power_basic', label: 'القوى الأساسية', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, s.level === 'easy' ? 5 : s.level === 'medium' ? 8 : 12);
            var b = s.level === 'genius' ? s.rnd(2, 5) : s.rnd(2, 3);
            var ans = Math.pow(a, b);
            return {
                text: a + '^' + b + ' = ؟',
                hint: 'اضرب ' + a + ' في نفسه ' + b + ' مرات',
                explanation: a + '^' + b + ' = ' + Array(b).fill(a).join('×') + ' = ' + ans,
                answer: ans, catKey: 'algebra'
            };
        }
    },
    {
        id: 'power_law_mul', label: 'قانون ضرب الأسس (أ^م × أ^ن)', levels: ['hard','genius'],
        generate: function(s) {
            var base = s.rnd(2, 5), m = s.rnd(1, 4), n = s.rnd(1, 4);
            var ans = Math.pow(base, m + n);
            return {
                text: base + '^' + m + ' × ' + base + '^' + n + ' = ' + base + '^؟',
                hint: 'قانون الضرب: أ^م × أ^ن = أ^(م+ن)',
                explanation: base + '^' + m + ' × ' + base + '^' + n + ' = ' + base + '^(' + m + '+' + n + ') = ' + base + '^' + (m+n) + ' = ' + ans,
                answer: m + n, catKey: 'algebra'
            };
        }
    },
    {
        id: 'power_law_div', label: 'قانون قسمة الأسس (أ^م ÷ أ^ن)', levels: ['hard','genius'],
        generate: function(s) {
            var base = s.rnd(2, 5), n = s.rnd(1, 3), m = n + s.rnd(1, 3);
            var ans = m - n;
            return {
                text: base + '^' + m + ' ÷ ' + base + '^' + n + ' = ' + base + '^؟',
                hint: 'قانون القسمة: أ^م ÷ أ^ن = أ^(م-ن)',
                explanation: base + '^' + m + ' ÷ ' + base + '^' + n + ' = ' + base + '^(' + m + '-' + n + ') = ' + base + '^' + ans,
                answer: ans, catKey: 'algebra'
            };
        }
    },
    {
        id: 'power_law_zero', label: 'الأس الصفري (أ^0 = 1)', levels: ['medium','hard'],
        generate: function(s) {
            var base = s.rnd(2, 99);
            return {
                text: base + '^0 = ؟',
                hint: 'أي عدد مرفوع للأس صفر = 1',
                explanation: base + '^0 = 1 (القانون: أ^0 = 1 لأي أ ≠ 0)',
                answer: 1, catKey: 'algebra'
            };
        }
    },
    {
        id: 'sqrt_perfect', label: 'الجذر التربيعي للمربعات التامة', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var easySquares = [4,9,16,25,36,49,64,81,100];
            var hardSquares = [121,144,169,196,225,256,289,324,361,400];
            var geniusSquares = [441,484,529,576,625,676,729,784,841,900];
            var pool = s.level === 'easy'   ? easySquares
                     : s.level === 'medium' ? easySquares.concat(hardSquares)
                     : s.level === 'hard'   ? hardSquares.concat(geniusSquares)
                     : geniusSquares;
            var n = pool[s.rnd(0, pool.length - 1)];
            var ans = Math.round(Math.sqrt(n));
            return {
                text: '√' + n + ' = ؟',
                hint: 'ما العدد الذي ضرب نفسه يعطي ' + n + '؟',
                explanation: '√' + n + ' = ' + ans + ' لأن ' + ans + '² = ' + n,
                answer: ans, catKey: 'algebra'
            };
        }
    },
    {
        id: 'cbrt_perfect', label: 'الجذر التكعيبي', levels: ['hard','genius'],
        generate: function(s) {
            var cubes = [[8,2],[27,3],[64,4],[125,5],[216,6],[343,7],[512,8],[729,9],[1000,10]];
            var pick = cubes[s.rnd(0, cubes.length - 1)];
            return {
                text: '∛' + pick[0] + ' = ؟',
                hint: 'ما العدد الذي في مكعبه يعطي ' + pick[0] + '؟',
                explanation: '∛' + pick[0] + ' = ' + pick[1] + ' لأن ' + pick[1] + '³ = ' + pick[0],
                answer: pick[1], catKey: 'algebra'
            };
        }
    },
    {
        id: 'power_neg', label: 'الأس السالب', levels: ['genius'],
        generate: function(s) {
            var base = [2, 5, 10][s.rnd(0, 2)];
            var n = s.rnd(1, 3);
            var ans = Math.round(1 / Math.pow(base, n) * 10000) / 10000;
            return {
                text: base + '^(-' + n + ') = ؟',
                hint: 'الأس السالب: أ^(-ن) = 1/أ^ن',
                explanation: base + '^(-' + n + ') = 1/' + base + '^' + n + ' = 1/' + Math.pow(base,n) + ' ≈ ' + ans,
                answer: ans, catKey: 'algebra'
            };
        }
    },

    /* ══════════════════ الكسور ══════════════════ */
    {
        id: 'frac_add_same', label: 'جمع كسور بمقام مشترك', levels: ['easy','medium','hard'],
        generate: function(s) {
            var den = s.rnd(3, s.level === 'easy' ? 6 : 12);
            var n1 = s.rnd(1, den - 1), n2 = s.rnd(1, den - n1 > 0 ? den - n1 : 1);
            var sumN = n1 + n2;
            var g = _iqeGcd(sumN, den);
            var simplified = (g === den) ? String(sumN/den) : (sumN/g + '/' + den/g);
            return {
                text: n1 + '/' + den + ' + ' + n2 + '/' + den,
                hint: 'المقامات متساوية، اجمع البسطين فقط',
                explanation: n1 + '/' + den + ' + ' + n2 + '/' + den + ' = ' + sumN + '/' + den + (g > 1 ? ' = ' + simplified : ''),
                answer: Math.round(sumN/den * 1000)/1000, catKey: 'division'
            };
        }
    },
    {
        id: 'frac_add_diff', label: 'جمع كسور بمقامات مختلفة', levels: ['medium','hard','genius'],
        generate: function(s) {
            var d1 = s.rnd(2, 8), d2 = s.rnd(2, 8);
            while (d2 === d1) d2 = s.rnd(2, 8);
            var lcm = _iqeLcm(d1, d2);
            var n1 = s.rnd(1, d1-1), n2 = s.rnd(1, d2-1);
            var rN = n1*(lcm/d1) + n2*(lcm/d2);
            var g = _iqeGcd(rN, lcm);
            var ans = Math.round(rN/lcm * 1000)/1000;
            return {
                text: n1 + '/' + d1 + ' + ' + n2 + '/' + d2,
                hint: 'أوجد المقام المشترك الأصغر = ' + lcm,
                explanation: n1 + '/' + d1 + ' + ' + n2 + '/' + d2
                    + '\nالمقام المشترك = ' + lcm
                    + '\n= ' + (n1*(lcm/d1)) + '/' + lcm + ' + ' + (n2*(lcm/d2)) + '/' + lcm
                    + ' = ' + rN + '/' + lcm
                    + (g > 1 ? ' = ' + (rN/g) + '/' + (lcm/g) : ''),
                answer: ans, catKey: 'division'
            };
        }
    },
    {
        id: 'frac_sub', label: 'طرح الكسور', levels: ['medium','hard'],
        generate: function(s) {
            var den = s.rnd(4, 12);
            var n1 = s.rnd(2, den-1), n2 = s.rnd(1, n1-1);
            var resN = n1 - n2;
            var g = _iqeGcd(resN, den);
            var ans = Math.round(resN/den * 1000)/1000;
            return {
                text: n1 + '/' + den + ' − ' + n2 + '/' + den,
                hint: 'اطرح البسطين، المقام يبقى',
                explanation: n1 + '/' + den + ' − ' + n2 + '/' + den + ' = ' + resN + '/' + den + (g > 1 ? ' = ' + resN/g + '/' + den/g : ''),
                answer: ans, catKey: 'division'
            };
        }
    },
    {
        id: 'frac_mul', label: 'ضرب الكسور', levels: ['medium','hard','genius'],
        generate: function(s) {
            var n1 = s.rnd(1, 6), d1 = s.rnd(2, 8), n2 = s.rnd(1, 6), d2 = s.rnd(2, 8);
            var np = n1*n2, dp = d1*d2;
            var g = _iqeGcd(np, dp);
            var ans = Math.round(np/dp * 1000)/1000;
            return {
                text: n1 + '/' + d1 + ' × ' + n2 + '/' + d2,
                hint: 'اضرب البسطَين معاً والمقامَين معاً',
                explanation: n1 + '/' + d1 + ' × ' + n2 + '/' + d2 + ' = ' + np + '/' + dp + (g > 1 ? ' = ' + np/g + '/' + dp/g : '') + ' ≈ ' + ans,
                answer: ans, catKey: 'division'
            };
        }
    },
    {
        id: 'frac_div', label: 'قسمة الكسور (اضرب بالمقلوب)', levels: ['hard','genius'],
        generate: function(s) {
            var n1 = s.rnd(1, 6), d1 = s.rnd(2, 8), n2 = s.rnd(1, 6), d2 = s.rnd(2, 8);
            var np = n1*d2, dp = d1*n2;
            var g = _iqeGcd(np, dp);
            var ans = Math.round(np/dp * 1000)/1000;
            return {
                text: n1 + '/' + d1 + ' ÷ ' + n2 + '/' + d2,
                hint: 'اقلب الكسر الثاني ثم اضرب: ÷ب = ×(1/ب)',
                explanation: n1 + '/' + d1 + ' × ' + d2 + '/' + n2 + ' = ' + np + '/' + dp + (g > 1 ? ' = ' + np/g + '/' + dp/g : '') + ' ≈ ' + ans,
                answer: ans, catKey: 'division'
            };
        }
    },

    /* ══════════════════ المعادلات ══════════════════ */
    {
        id: 'eq_linear1', label: 'معادلة خطية: س+أ=ب', levels: ['easy','medium','hard'],
        generate: function(s) {
            var x = s.rnd(1, s.max), a = s.rnd(1, s.max);
            var b = x + a;
            return {
                text: 'س + ' + a + ' = ' + b,
                hint: 'اطرح ' + a + ' من كلا الطرفين',
                explanation: 'س = ' + b + ' − ' + a + ' = ' + x + '\nالتحقق: ' + x + ' + ' + a + ' = ' + b + ' ✓',
                answer: x, catKey: 'algebra'
            };
        }
    },
    {
        id: 'eq_linear2', label: 'معادلة خطية: أس=ب', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, s.level === 'genius' ? 15 : 9);
            var x = s.rnd(1, s.level === 'genius' ? 20 : 12);
            var b = a * x;
            return {
                text: a + 'س = ' + b,
                hint: 'اقسم كلا الطرفين على ' + a,
                explanation: 'س = ' + b + ' ÷ ' + a + ' = ' + x,
                answer: x, catKey: 'algebra'
            };
        }
    },
    {
        id: 'eq_linear3', label: 'معادلة خطية: أس+ب=ج', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, 8), x = s.rnd(1, 15), b = s.rnd(1, 20);
            var c = a * x + b;
            return {
                text: a + 'س + ' + b + ' = ' + c,
                hint: 'أولاً اطرح ' + b + '، ثم اقسم على ' + a,
                explanation: a + 'س = ' + c + ' − ' + b + ' = ' + (c-b) + '\nس = ' + (c-b) + ' ÷ ' + a + ' = ' + x + '\nالتحقق: ' + a + '×' + x + '+' + b + ' = ' + c + ' ✓',
                answer: x, catKey: 'algebra'
            };
        }
    },
    {
        id: 'eq_quad_simple', label: 'معادلة تربيعية: س²=ن', levels: ['hard','genius'],
        generate: function(s) {
            var x = s.rnd(2, s.level === 'genius' ? 20 : 12);
            var n = x * x;
            return {
                text: 'س² = ' + n,
                hint: 'خذ الجذر التربيعي للطرفين',
                explanation: 'س = √' + n + ' = ' + x + '\n(نأخذ الجذر الموجب)',
                answer: x, catKey: 'algebra'
            };
        }
    },
    {
        id: 'eq_system', label: 'نظام معادلتين بمجهولين', levels: ['hard','genius'],
        generate: function(s) {
            var x = s.rnd(2, 10), y = s.rnd(2, 10);
            return {
                text: 'س + ص = ' + (x+y) + ' وس − ص = ' + (x-y) + '، قيمة س = ؟',
                hint: 'اجمع المعادلتين للحصول على قيمة س',
                explanation: '(س+ص) + (س−ص) = ' + (x+y) + '+' + (x-y) + '\n2س = ' + (2*x) + '\nس = ' + x,
                answer: x, catKey: 'algebra'
            };
        }
    },

    /* ══════════════════ المتتاليات ══════════════════ */
    {
        id: 'seq_arithmetic', label: 'المتتالية الحسابية', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(1, Math.min(20, s.max));
            var d = s.rnd(2, s.level === 'easy' ? 5 : s.level === 'medium' ? 10 : 20);
            var ans = a + 4 * d;
            return {
                text: a + '، ' + (a+d) + '، ' + (a+2*d) + '، ' + (a+3*d) + '، ؟',
                hint: 'الفرق الثابت = ' + d,
                explanation: 'متتالية حسابية، فرقها ' + d + '\n' + (a+3*d) + ' + ' + d + ' = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'seq_geometric', label: 'المتتالية الهندسية', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(1, 5);
            var r = s.level === 'genius' ? s.rnd(2, 5) : s.rnd(2, 3);
            var ans = a * Math.pow(r, 4);
            return {
                text: a + '، ' + (a*r) + '، ' + (a*r*r) + '، ' + (a*r*r*r) + '، ؟',
                hint: 'كل حد يُضرب في ' + r,
                explanation: 'متتالية هندسية، أساسها ' + r + '\n' + (a*r*r*r) + ' × ' + r + ' = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'seq_squares', label: 'متتالية المربعات', levels: ['medium','hard'],
        generate: function(s) {
            var start = s.rnd(1, 6);
            var terms = [start, start+1, start+2, start+3].map(function(n){return n*n;});
            var ans = (start+4)*(start+4);
            return {
                text: terms.join('، ') + '، ؟',
                hint: 'هذه مربعات الأعداد الطبيعية المتتالية',
                explanation: 'كل حد = ن²\n' + (start+4) + '² = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'seq_fibonacci', label: 'متتالية فيبوناتشي', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(1, 5), b = s.rnd(a, a+5);
            var c = a+b, d = b+c, ans = c+d;
            return {
                text: a + '، ' + b + '، ' + c + '، ' + d + '، ؟',
                hint: 'كل حد = مجموع الحدين السابقين',
                explanation: c + ' + ' + d + ' = ' + ans + '\n(قاعدة فيبوناتشي)',
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'seq_decreasing', label: 'المتتالية التنازلية', levels: ['medium','hard'],
        generate: function(s) {
            var a = s.rnd(50, 150), d = s.rnd(5, 20);
            var ans = a - 4 * d;
            return {
                text: a + '، ' + (a-d) + '، ' + (a-2*d) + '، ' + (a-3*d) + '، ؟',
                hint: 'الفرق السالب الثابت = −' + d,
                explanation: 'متتالية حسابية تنازلية، فرقها −' + d + '\n' + (a-3*d) + ' − ' + d + ' = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'seq_nth_term', label: 'الحد العام للمتتالية الحسابية', levels: ['hard','genius'],
        generate: function(s) {
            var a1 = s.rnd(1, 20), d = s.rnd(2, 10), n = s.rnd(5, 15);
            var ans = a1 + (n-1)*d;
            return {
                text: 'متتالية حسابية أول حد=' + a1 + ' والفرق=' + d + '، الحد الـ' + n + ' = ؟',
                hint: 'الحد العام = أ₁ + (ن-1)×د',
                explanation: 'الحد ' + n + ' = ' + a1 + ' + (' + n + '-1)×' + d + ' = ' + a1 + ' + ' + ((n-1)*d) + ' = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },

    /* ══════════════════ الهندسة ══════════════════ */
    {
        id: 'geo_area_square', label: 'مساحة المربع', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, Math.min(25, s.mMax));
            var ans = a * a;
            return {
                text: 'مساحة مربع ضلعه ' + a,
                hint: 'المساحة = الضلع²',
                explanation: 'المساحة = ' + a + '² = ' + a + '×' + a + ' = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_area_rect', label: 'مساحة المستطيل', levels: ['easy','medium','hard','genius'],
        generate: function(s) {
            var w = s.rnd(2, Math.min(20, s.mMax)), h = s.rnd(2, Math.min(20, s.mMax));
            var ans = w * h;
            return {
                text: 'مساحة مستطيل ' + w + ' × ' + h,
                hint: 'المساحة = الطول × العرض',
                explanation: 'المساحة = ' + w + ' × ' + h + ' = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_area_triangle', label: 'مساحة المثلث', levels: ['medium','hard','genius'],
        generate: function(s) {
            var b = s.rnd(4, Math.min(20, s.mMax)), h = s.rnd(3, Math.min(16, s.mMax));
            var ans = Math.round(b * h / 2);
            return {
                text: 'مساحة مثلث قاعدته ' + b + ' وارتفاعه ' + h,
                hint: 'المساحة = ½ × القاعدة × الارتفاع',
                explanation: '½ × ' + b + ' × ' + h + ' = ' + (b*h) + '/2 = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_area_circle', label: 'مساحة الدائرة', levels: ['medium','hard','genius'],
        generate: function(s) {
            var r = s.rnd(2, Math.min(12, s.mMax));
            var ans = Math.round(Math.PI * r * r);
            return {
                text: 'مساحة دائرة نصف قطرها ' + r + ' (π≈3.14)',
                hint: 'المساحة = π × نق²',
                explanation: '3.14 × ' + r + '² = 3.14 × ' + (r*r) + ' ≈ ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_perimeter_rect', label: 'محيط المستطيل', levels: ['easy','medium','hard'],
        generate: function(s) {
            var w = s.rnd(3, Math.min(20, s.mMax)), h = s.rnd(3, Math.min(20, s.mMax));
            var ans = 2 * (w + h);
            return {
                text: 'محيط مستطيل ' + w + ' × ' + h,
                hint: 'المحيط = 2×(الطول+العرض)',
                explanation: '2×(' + w + '+' + h + ') = 2×' + (w+h) + ' = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_perimeter_circle', label: 'محيط الدائرة', levels: ['medium','hard','genius'],
        generate: function(s) {
            var r = s.rnd(2, Math.min(10, s.mMax));
            var ans = Math.round(2 * Math.PI * r);
            return {
                text: 'محيط دائرة نصف قطرها ' + r + ' (π≈3.14)',
                hint: 'المحيط = 2×π×نق',
                explanation: '2×3.14×' + r + ' = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_pythagoras', label: 'نظرية فيثاغورس', levels: ['hard','genius'],
        generate: function(s) {
            var triples = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15],[7,24,25],[20,21,29]];
            var t = triples[s.rnd(0, triples.length - 1)];
            var k = s.rnd(1, 3);
            var a = t[0]*k, b = t[1]*k, c = t[2]*k;
            return {
                text: 'مثلث قائم أضلاعه ' + a + ' و' + b + '، ما الوتر؟',
                hint: 'الوتر² = الضلع₁² + الضلع₂²',
                explanation: '√(' + a + '²+' + b + '²) = √(' + (a*a) + '+' + (b*b) + ') = √' + (a*a+b*b) + ' = ' + c,
                answer: c, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_vol_cube', label: 'حجم المكعب', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, Math.min(10, s.mMax));
            var ans = a * a * a;
            return {
                text: 'حجم مكعب ضلعه ' + a,
                hint: 'الحجم = الضلع³',
                explanation: a + '³ = ' + a + '×' + a + '×' + a + ' = ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_vol_cylinder', label: 'حجم الأسطوانة', levels: ['hard','genius'],
        generate: function(s) {
            var r = s.rnd(2, 6), h = s.rnd(3, 10);
            var ans = Math.round(Math.PI * r * r * h);
            return {
                text: 'حجم أسطوانة نق=' + r + ' وارتفاع=' + h + ' (π≈3.14)',
                hint: 'الحجم = π × نق² × الارتفاع',
                explanation: '3.14 × ' + r + '² × ' + h + ' = 3.14 × ' + (r*r) + ' × ' + h + ' ≈ ' + ans,
                answer: ans, catKey: 'geometry'
            };
        }
    },
    {
        id: 'geo_missing_side', label: 'إيجاد ضلع مجهول من المساحة', levels: ['medium','hard','genius'],
        generate: function(s) {
            var w = s.rnd(3, 15), h = s.rnd(3, 15);
            var area = w * h;
            return {
                text: 'مستطيل مساحته ' + area + ' وطوله ' + w + '، ما عرضه؟',
                hint: 'العرض = المساحة ÷ الطول',
                explanation: 'العرض = ' + area + ' ÷ ' + w + ' = ' + h,
                answer: h, catKey: 'geometry'
            };
        }
    },

    /* ══════════════════ اللوغاريتم ══════════════════ */
    {
        id: 'log_base10', label: 'لوغاريتم للأساس 10', levels: ['hard','genius'],
        generate: function(s) {
            var n = s.rnd(1, 5);
            return {
                text: 'log₁₀(10^' + n + ') = ؟',
                hint: 'log₁₀(10^ن) = ن دائماً',
                explanation: 'log₁₀(10^' + n + ') = ' + n + '\nلأن اللوغاريتم والأسية بنفس الأساس يتلاشيان',
                answer: n, catKey: 'algebra'
            };
        }
    },
    {
        id: 'log_base_general', label: 'لوغاريتم بأسس مختلفة', levels: ['hard','genius'],
        generate: function(s) {
            var pairs = [
                [2,8,3,'log₂(8)'],[2,16,4,'log₂(16)'],[2,32,5,'log₂(32)'],
                [3,9,2,'log₃(9)'],[3,27,3,'log₃(27)'],[3,81,4,'log₃(81)'],
                [5,25,2,'log₅(25)'],[5,125,3,'log₅(125)'],[4,64,3,'log₄(64)']
            ];
            var p = pairs[s.rnd(0, pairs.length - 1)];
            return {
                text: p[3] + ' = ؟',
                hint: p[0] + '^؟ = ' + p[1],
                explanation: p[3] + ' = ' + p[2] + ' لأن ' + p[0] + '^' + p[2] + ' = ' + p[1],
                answer: p[2], catKey: 'algebra'
            };
        }
    },
    {
        id: 'log_prop_mul', label: 'خاصية ضرب اللوغاريتمات', levels: ['genius'],
        generate: function(s) {
            var a = s.rnd(1, 4), b = s.rnd(1, 4);
            var ans = a + b;
            return {
                text: 'log(10^' + a + ' × 10^' + b + ') = ؟',
                hint: 'log(أ×ب) = log(أ) + log(ب)',
                explanation: 'log(10^' + a + ') + log(10^' + b + ') = ' + a + ' + ' + b + ' = ' + ans,
                answer: ans, catKey: 'algebra'
            };
        }
    },

    /* ══════════════════ المثلثات ══════════════════ */
    {
        id: 'trig_sin', label: 'جيب الزاوية (sin)', levels: ['hard','genius'],
        generate: function(s) {
            var sinVals = [
                {deg:0, val:0, frac:'0'}, {deg:30, val:0.5, frac:'½'},
                {deg:45, val:0.71, frac:'√2/2'}, {deg:60, val:0.87, frac:'√3/2'}, {deg:90, val:1, frac:'1'}
            ];
            var v = sinVals[s.rnd(0, sinVals.length - 1)];
            return {
                text: 'جا(' + v.deg + '°) = ؟',
                hint: 'قيم جيب الزاوية للزوايا الأساسية',
                explanation: 'جا(' + v.deg + '°) = ' + v.frac + ' = ' + v.val,
                answer: v.val, catKey: 'algebra'
            };
        }
    },
    {
        id: 'trig_cos', label: 'جيب التمام (cos)', levels: ['hard','genius'],
        generate: function(s) {
            var cosVals = [
                {deg:0, val:1, frac:'1'}, {deg:30, val:0.87, frac:'√3/2'},
                {deg:45, val:0.71, frac:'√2/2'}, {deg:60, val:0.5, frac:'½'}, {deg:90, val:0, frac:'0'}
            ];
            var v = cosVals[s.rnd(0, cosVals.length - 1)];
            return {
                text: 'جتا(' + v.deg + '°) = ؟',
                hint: 'قيم جيب التمام للزوايا الأساسية',
                explanation: 'جتا(' + v.deg + '°) = ' + v.frac + ' = ' + v.val,
                answer: v.val, catKey: 'algebra'
            };
        }
    },
    {
        id: 'trig_tan', label: 'الظل (tan)', levels: ['hard','genius'],
        generate: function(s) {
            var tanVals = [
                {deg:0, val:0, frac:'0'}, {deg:30, val:0.58, frac:'1/√3'},
                {deg:45, val:1, frac:'1'}, {deg:60, val:1.73, frac:'√3'}
            ];
            var v = tanVals[s.rnd(0, tanVals.length - 1)];
            return {
                text: 'ظا(' + v.deg + '°) = ؟',
                hint: 'ظا = جا ÷ جتا',
                explanation: 'ظا(' + v.deg + '°) = ' + v.frac + ' ≈ ' + v.val,
                answer: v.val, catKey: 'algebra'
            };
        }
    },
    {
        id: 'trig_identity', label: 'هوية مثلثية: جا²+جتا²=1', levels: ['genius'],
        generate: function(s) {
            var degs = [30, 45, 60];
            var deg = degs[s.rnd(0, degs.length - 1)];
            var sinV = {30:0.5, 45:0.71, 60:0.87}[deg];
            var cosV = {30:0.87, 45:0.71, 60:0.5}[deg];
            return {
                text: 'جا²(' + deg + '°) + جتا²(' + deg + '°) = ؟',
                hint: 'الهوية المثلثية الأساسية: جا²+جتا²=1 دائماً',
                explanation: sinV + '² + ' + cosV + '² = ' + Math.round(sinV*sinV*100)/100 + ' + ' + Math.round(cosV*cosV*100)/100 + ' ≈ 1',
                answer: 1, catKey: 'algebra'
            };
        }
    },

    /* ══════════════════ المسائل الكلامية ══════════════════ */
    {
        id: 'word_add', label: 'مسألة كلامية — جمع', levels: ['easy','medium'],
        generate: function(s) {
            var names = ['أحمد','سارة','خالد','ليلى','محمد','هند','عمر','نور'];
            var items = ['تفاحة','كتاب','قلم','لعبة','بطاقة','كرة','مرسوم','شوكولاتة'];
            var n = names[s.rnd(0, names.length-1)], i = items[s.rnd(0, items.length-1)];
            var a = s.rnd(s.min, s.max), b = s.rnd(s.min, s.max);
            var ans = a + b;
            return {
                text: 'لدى ' + n + ' ' + a + ' ' + i + '، حصل على ' + b + ' ' + i + ' أخرى. كم ' + i + ' لديه الآن؟',
                hint: 'جمع بسيط',
                explanation: a + ' + ' + b + ' = ' + ans,
                answer: ans, catKey: 'wordproblems'
            };
        }
    },
    {
        id: 'word_mul', label: 'مسألة كلامية — ضرب', levels: ['easy','medium','hard'],
        generate: function(s) {
            var a = s.rnd(s.mMin, Math.min(s.mMax, 20));
            var b = s.rnd(s.mMin, Math.min(s.mMax, 20));
            var ans = a * b;
            var contexts = [
                { t: 'ثمن القلم ' + a + ' دينار. ثمن ' + b + ' قلم = ؟', e: b + ' × ' + a + ' = ' + ans + ' دينار' },
                { t: a + ' صندوق، في كل صندوق ' + b + ' تفاحة. المجموع = ؟', e: a + ' × ' + b + ' = ' + ans + ' تفاحة' },
                { t: 'ملعب طوله ' + a + 'م وعرضه ' + b + 'م. مساحته = ؟', e: a + ' × ' + b + ' = ' + ans + ' م²' }
            ];
            var ctx = contexts[s.rnd(0, contexts.length - 1)];
            return { text: ctx.t, hint: 'ضرب', explanation: ctx.e, answer: ans, catKey: 'wordproblems' };
        }
    },
    {
        id: 'word_hard', label: 'مسألة كلامية متعددة الخطوات', levels: ['hard','genius'],
        generate: function(s) {
            var a = s.rnd(Math.max(s.min, 20), Math.min(s.max, 100));
            var b = s.rnd(5, Math.floor(a / 2));
            var c = s.rnd(2, Math.min(s.mMax, 8));
            var ans = (a - b) * c;
            return {
                text: 'كان لدى محمد ' + a + ' كتاباً، أعاد ' + b + '، ثم ضاعف الباقي ' + c + ' مرات. كم كتاباً الآن؟',
                hint: 'أولاً اطرح، ثم اضرب',
                explanation: 'الخطوة 1: ' + a + ' − ' + b + ' = ' + (a-b) + '\nالخطوة 2: ' + (a-b) + ' × ' + c + ' = ' + ans,
                answer: ans, catKey: 'wordproblems'
            };
        }
    },
    {
        id: 'word_genius', label: 'مسألة كلامية عبقري (3 خطوات)', levels: ['genius'],
        generate: function(s) {
            var a = s.rnd(100, Math.min(s.max, 500));
            var b = s.rnd(10, 50), c = s.rnd(2, 5), d = s.rnd(5, 20);
            var ans = (a - b) * c + d;
            return {
                text: 'بدأ بـ' + a + '، خسر ' + b + '، ضاعف الباقي ' + c + ' مرات، ثم أضاف ' + d + '. النتيجة = ؟',
                hint: 'اتبع الترتيب: طرح، ضرب، جمع',
                explanation: 'الخطوة 1: ' + a + '−' + b + '=' + (a-b) + '\nالخطوة 2: ' + (a-b) + '×' + c + '=' + ((a-b)*c) + '\nالخطوة 3: ' + ((a-b)*c) + '+' + d + '=' + ans,
                answer: ans, catKey: 'wordproblems'
            };
        }
    },

    /* ══════════════════ الأعداد والمفاهيم ══════════════════ */
    {
        id: 'num_prime', label: 'الأعداد الأولية', levels: ['medium','hard'],
        generate: function(s) {
            var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
            var nonPrimes = [4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30];
            var ans = s.rnd(0,1);
            var num = ans === 1 ? primes[s.rnd(0, primes.length-1)] : nonPrimes[s.rnd(0, nonPrimes.length-1)];
            return {
                text: 'هل العدد ' + num + ' أولي؟ (1=نعم، 0=لا)',
                hint: 'العدد الأولي لا يقبل القسمة إلا على 1 وعلى نفسه',
                explanation: num + (ans === 1 ? ' أولي (لا يقبل القسمة إلا على 1 و' + num + ')' : ' ليس أولياً (يقبل القسمة على عوامل أخرى)'),
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'num_gcd', label: 'القاسم المشترك الأكبر', levels: ['medium','hard','genius'],
        generate: function(s) {
            var g = s.rnd(2, 12);
            var a = g * s.rnd(2, 8), b = g * s.rnd(2, 8);
            while (a === b) b = g * s.rnd(2, 8);
            var realGcd = _iqeGcd(a, b);
            return {
                text: 'قم(' + a + '، ' + b + ') = ؟',
                hint: 'القاسم المشترك الأكبر',
                explanation: 'عوامل ' + a + ': ...' + g + '...\nعوامل ' + b + ': ...' + g + '...\nقم = ' + realGcd,
                answer: realGcd, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'num_lcm', label: 'المضاعف المشترك الأصغر', levels: ['medium','hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, 12), b = s.rnd(2, 12);
            while (b === a) b = s.rnd(2, 12);
            var ans = _iqeLcm(a, b);
            return {
                text: 'مضم(' + a + '، ' + b + ') = ؟',
                hint: 'المضاعف المشترك الأصغر',
                explanation: 'مضم(' + a + '، ' + b + ') = ' + a + ' × ' + b + ' ÷ قم(' + a + '،' + b + ') = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'num_factors', label: 'عدد قواسم العدد', levels: ['medium','hard'],
        generate: function(s) {
            var num = s.rnd(2, Math.min(s.max, 60));
            var count = 0;
            for (var i = 1; i <= num; i++) { if (num % i === 0) count++; }
            return {
                text: 'كم قاسماً للعدد ' + num + '؟',
                hint: 'القاسم هو العدد الذي يقسم ' + num + ' بدون باقٍ',
                explanation: num + ' له ' + count + ' قواسم (بما في ذلك 1 والعدد نفسه)',
                answer: count, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'num_absolute', label: 'القيمة المطلقة', levels: ['medium','hard'],
        generate: function(s) {
            var a = s.rnd(-s.max, s.max);
            while (a === 0) a = s.rnd(-s.max, s.max);
            var ans = Math.abs(a);
            return {
                text: '|' + a + '| = ؟',
                hint: 'القيمة المطلقة = المسافة عن الصفر (دائماً موجبة)',
                explanation: '|' + a + '| = ' + ans + (a < 0 ? ' (نحذف الإشارة السالبة)' : ''),
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'num_negative_mul', label: 'ضرب الأعداد السالبة', levels: ['medium','hard'],
        generate: function(s) {
            var a = s.rnd(1, Math.min(s.mMax, 12));
            var b = s.rnd(1, Math.min(s.mMax, 12));
            var type = s.rnd(0, 2);
            var text, ans, exp;
            if (type === 0) {
                text = '(-' + a + ') × (-' + b + ')';
                ans = a * b;
                exp = 'سالب × سالب = موجب\n(-' + a + ')×(-' + b + ') = +' + ans;
            } else if (type === 1) {
                text = '(-' + a + ') × ' + b;
                ans = -(a * b);
                exp = 'سالب × موجب = سالب\n(-' + a + ')×' + b + ' = -' + (a*b);
            } else {
                text = '(-' + a + ') + (-' + b + ')';
                ans = -(a + b);
                exp = 'مجموع سالبَين = ' + a + '+' + b + ' بإشارة سالبة = -' + (a+b);
            }
            return { text, hint: 'قواعد الإشارات في الضرب والجمع', explanation: exp, answer: ans, catKey: 'puzzles' };
        }
    },

    /* ══════════════════ التحليل إلى عوامل ══════════════════ */
    {
        id: 'algebra_factor', label: 'التعبير عن ناتج الضرب كمجموع', levels: ['hard','genius'],
        generate: function(s) {
            var a = s.rnd(2, 8), b = s.rnd(1, 10);
            var product = a * b;
            var contexts = [
                { t: a + ' × (' + b + ' + ؟) = ' + (a*(b+s.rnd(1,5))) },
            ];
            // مسألة عكسية بسيطة
            var c = s.rnd(1, 8);
            var ans = a * (b + c);
            return {
                text: a + ' × (' + b + ' + ' + c + ')',
                hint: 'قانون التوزيع',
                explanation: a + '×' + b + ' + ' + a + '×' + c + ' = ' + (a*b) + ' + ' + (a*c) + ' = ' + ans,
                answer: ans, catKey: 'algebra'
            };
        }
    },

    /* ══════════════════ الإحصاء والبيانات ══════════════════ */
    {
        id: 'stats_mean', label: 'المتوسط الحسابي', levels: ['medium','hard','genius'],
        generate: function(s) {
            var n = s.rnd(3, 6);
            var nums = [], sum = 0;
            for (var i = 0; i < n; i++) {
                var v = s.rnd(s.min, Math.min(s.max, 50));
                nums.push(v);
                sum += v;
            }
            var ans = Math.round(sum / n);
            return {
                text: 'متوسط الأعداد ' + nums.join('، ') + ' = ؟',
                hint: 'المتوسط = المجموع ÷ العدد',
                explanation: '(' + nums.join('+') + ') ÷ ' + n + ' = ' + sum + ' ÷ ' + n + ' ≈ ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    },
    {
        id: 'stats_median', label: 'الوسيط', levels: ['hard','genius'],
        generate: function(s) {
            var n = 5;
            var nums = [];
            for (var i = 0; i < n; i++) nums.push(s.rnd(1, Math.min(s.max, 30)));
            nums.sort(function(a,b){return a-b;});
            var ans = nums[Math.floor(n/2)];
            return {
                text: 'وسيط الأعداد ' + nums.join('، ') + ' (مرتبة) = ؟',
                hint: 'الوسيط = العدد الأوسط في القائمة المرتبة',
                explanation: 'القيم مرتبة: ' + nums.join('، ') + '\nالقيمة الوسطى (الثالثة) = ' + ans,
                answer: ans, catKey: 'puzzles'
            };
        }
    }

]; /* ═══ نهاية بنك القوانين ═══ */


/* ───────────────────────────────────────────────────────────────────────
   دوال مساعدة داخلية
─────────────────────────────────────────────────────────────────────── */

function _iqeGcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
}

function _iqeLcm(a, b) {
    return Math.abs(a * b) / _iqeGcd(a, b);
}


/* ───────────────────────────────────────────────────────────────────────
   ② مجموعات الأعداد — نطاقات دقيقة لكل مستوى
─────────────────────────────────────────────────────────────────────── */

var IQE_SETS = {
    easy: {
        level: 'easy',
        min: 1,  max: 20,  mid: 15,
        mMin: 2, mMax: 9,  gap: 2,
        rnd: rnd
    },
    medium: {
        level: 'medium',
        min: 5,  max: 100, mid: 50,
        mMin: 2, mMax: 15, gap: 5,
        rnd: rnd
    },
    hard: {
        level: 'hard',
        min: 10, max: 500, mid: 200,
        mMin: 3, mMax: 25, gap: 10,
        rnd: rnd
    },
    genius: {
        level: 'genius',
        min: 50, max: 9999, mid: 2000,
        mMin: 5, mMax: 50,  gap: 50,
        rnd: rnd
    }
};

/* نطاق ديناميكي مشتق من المستوى الحالي (للوضع التلقائي) */
function _iqeGetAutoSets() {
    var cfg;
    try {
        cfg = (typeof _getLevelConfig === 'function') ? _getLevelConfig() : null;
    } catch(e) { cfg = null; }

    if (!cfg) return IQE_SETS.easy;

    return {
        level: cfg.diff || 'easy',
        min:   cfg.nMin,
        max:   cfg.nMax,
        mid:   Math.round((cfg.nMin + cfg.nMax) / 2),
        mMin:  cfg.mMin,
        mMax:  cfg.mMax,
        gap:   Math.max(2, Math.round(cfg.nMax * 0.05)),
        rnd:   rnd
    };
}


/* ───────────────────────────────────────────────────────────────────────
   ③ مؤشر القوانين الكسول — يُبنى مرة واحدة عند أول استخدام
─────────────────────────────────────────────────────────────────────── */

var _iqeIndex = null;

function _iqeBuildIndex() {
    if (_iqeIndex) return _iqeIndex;
    _iqeIndex = { easy: [], medium: [], hard: [], genius: [] };
    IQE_LAWS.forEach(function(law) {
        law.levels.forEach(function(lvl) {
            if (_iqeIndex[lvl]) _iqeIndex[lvl].push(law);
        });
    });
    return _iqeIndex;
}


/* ───────────────────────────────────────────────────────────────────────
   ④ خيارات ذكية — مبنية على طبيعة كل قانون
─────────────────────────────────────────────────────────────────────── */

function _iqeSmartChoices(ans, lawId) {
    var a = typeof ans === 'number' ? ans : parseFloat(ans);
    var wrongs = new Set();
    var safety = 0;

    /* أخطاء شائعة خاصة بكل فئة */
    var lawCategory = lawId.split('_')[0];
    var seeded = [];

    if (lawCategory === 'trig') {
        /* قيم المثلثات: نستخدم فقط القيم الحقيقية */
        var trigPool = [0, 0.5, 0.58, 0.71, 0.87, 1, 1.73];
        shuffle(trigPool.filter(function(v){ return v !== a; })).slice(0,3).forEach(function(v){wrongs.add(v);});
    } else if (lawCategory === 'frac' || lawId.indexOf('frac') >= 0) {
        seeded = [Math.round((a+0.5)*100)/100, Math.round((a-0.5)*100)/100, Math.round(a*2*100)/100, Math.round(a/2*100)/100];
    } else if (lawCategory === 'pow' || lawId.indexOf('power') >= 0) {
        seeded = [a+1, a-1, Math.round(a*0.8), a*2];
    } else if (lawCategory === 'sqrt' || lawId.indexOf('sqrt') >= 0 || lawId.indexOf('cbrt') >= 0) {
        seeded = [a+1, a-1>0?a-1:a+3, a+2, a+3];
    } else if (lawCategory === 'geo') {
        seeded = [Math.round(a*1.2), Math.round(a*0.8), a+10, Math.max(1,a-10)];
    } else if (lawCategory === 'seq') {
        seeded = [a+1, a-1, a*2, Math.round(a*0.75)];
    } else if (lawId === 'num_prime') {
        /* إجابة ثنائية: 0 أو 1 فقط */
        return shuffle([a, a===1?0:1, a===1?0:1, a===1?0:1]).slice(0,4);
    } else {
        /* أخطاء عامة ذكية */
        seeded = [
            a + 1, a - 1,
            Math.round(a * 1.1),
            a + Math.max(1, Math.round(Math.abs(a) * 0.1))
        ];
    }

    /* إضافة البذور */
    seeded.forEach(function(v) {
        var rounded = Math.round(v * 100) / 100;
        if (rounded !== a && !isNaN(rounded) && isFinite(rounded)) {
            if (!(a > 0 && rounded <= 0)) wrongs.add(rounded);
        }
    });

    /* إكمال بأخطاء منطقية */
    while (wrongs.size < 3 && safety < 400) {
        safety++;
        var pct = [0.05, 0.08, 0.10, 0.12, 0.15][rnd(0,4)];
        var delta = Math.max(1, Math.round(Math.abs(a) * pct));
        var candidate = Math.round((a + (rnd(0,1) ? delta : -delta)) * 100) / 100;
        if (candidate !== a && !isNaN(candidate) && isFinite(candidate)) {
            if (!(a > 0 && candidate <= 0)) wrongs.add(candidate);
        }
    }

    /* ضمان 3 مختلفة بأي ثمن */
    var extra = 1;
    while (wrongs.size < 3) {
        wrongs.add(Math.round((a + extra * 2) * 100) / 100);
        extra++;
    }

    return shuffle([a].concat(Array.from(wrongs).slice(0, 3)));
}


/* ───────────────────────────────────────────────────────────────────────
   ⑤ الواجهة الموحدة — نقطة دخول واحدة
─────────────────────────────────────────────────────────────────────── */

/**
 * generateInfiniteQ(diff, opFilter)
 *
 * @param {string}   diff     - 'easy'|'medium'|'hard'|'genius'|'auto'
 * @param {string}   opFilter - معرّف قانون محدد، أو null للاختيار التلقائي
 * @returns {Object} { text, hint, answer, choices, explanation, catKey }
 */
function generateInfiniteQ(diff, opFilter) {
    var level = diff || 'easy';
    var sets;

    /* الوضع التلقائي: يستخدم إعدادات المستوى الحالي */
    if (level === 'auto' || level === 'user') {
        sets  = _iqeGetAutoSets();
        level = sets.level;
    } else {
        sets = IQE_SETS[level] || IQE_SETS.easy;
    }

    var idx = _iqeBuildIndex();
    var pool = idx[level] || idx.easy;

    /* تصفية حسب القانون المطلوب */
    var law;
    if (opFilter && opFilter !== 'mix') {
        var filtered = pool.filter(function(l){ return l.id === opFilter; });
        law = filtered.length > 0 ? filtered[0] : pool[rnd(0, pool.length - 1)];
    } else {
        law = pool[rnd(0, pool.length - 1)];
    }

    /* توليد السؤال مع حماية من الأخطاء */
    var raw;
    try {
        raw = law.generate(sets);
    } catch(e) {
        /* fallback آمن */
        var fa = rnd(sets.min, sets.max), fb = rnd(sets.min, sets.max);
        raw = { text: fa+' + '+fb, hint:'اجمع', explanation: fa+'+'+fb+'='+(fa+fb), answer: fa+fb, catKey:'addition' };
    }

    /* التحقق من صحة الإجابة */
    if (typeof raw.answer !== 'number' || isNaN(raw.answer) || !isFinite(raw.answer)) {
        var fa2 = rnd(sets.min, sets.max), fb2 = rnd(sets.min, sets.max);
        raw = { text: fa2+' + '+fb2, hint:'اجمع', explanation: fa2+'+'+fb2+'='+(fa2+fb2), answer: fa2+fb2, catKey:'addition' };
    }

    /* توليد الخيارات الذكية */
    var choices = _iqeSmartChoices(raw.answer, law.id);

    return {
        text:        raw.text,
        hint:        raw.hint        || 'ما هو الجواب؟',
        answer:      raw.answer,
        choices:     choices,
        explanation: raw.explanation || String(raw.answer),
        catKey:      raw.catKey      || 'addition',
        _lawId:      law.id,         /* للتتبع والإحصاء */
        _lawLabel:   law.label
    };
}


/* ───────────────────────────────────────────────────────────────────────
   ⑥ نقاط تكامل مع الألعاب الموجودة
─────────────────────────────────────────────────────────────────────── */

/**
 * genChallengeQ — مُعاد تعريفها لاستخدام المحرك اللانهائي
 * تحتفظ بواجهة competition_logic.js الأصلية (questionIndex → level)
 */
function genChallengeQ(questionIndex) {
    /* مستويات التحدي: يتصاعد كل 3 أسئلة */
    var levelMap = ['easy','easy','easy','medium','medium','medium','hard','hard','hard','hard','hard','hard','hard','genius'];
    var lvlIdx = Math.min(Math.floor((questionIndex||0) / 3), levelMap.length - 1);
    var diff = levelMap[lvlIdx];

    var q = generateInfiniteQ(diff);
    q.level = lvlIdx; /* للتوافق مع competition_logic.js */
    return q;
}

/**
 * genDailyQ — مُعاد تعريفها لأسئلة التحدي اليومي
 * تحتفظ بالواجهة الأصلية (dailyIdx)
 */
function genDailyQ(dailyIdx) {
    var seq = ['easy','easy','medium','medium','medium','hard','hard','hard','genius','genius'];
    var diff = seq[Math.min(dailyIdx || 0, seq.length - 1)];
    return generateInfiniteQ(diff);
}

/**
 * genChainQ — مُعاد تعريفها لوضع السلسلة
 * تأخذ chainVal وتبني سؤالاً يبدأ منه
 */
function genChainQ(chainVal) {
    var val = chainVal || rnd(2, 9);
    var ops = [
        function(v) {
            var b = rnd(2, 15);
            return { text: v + ' + ' + b, answer: v + b, hint: 'جمع', explanation: v + '+' + b + '=' + (v+b), catKey:'addition', choices:[] };
        },
        function(v) {
            var b = rnd(1, Math.min(v-1, 10));
            if (b >= v) b = 1;
            return { text: v + ' − ' + b, answer: v - b, hint: 'طرح', explanation: v + '−' + b + '=' + (v-b), catKey:'subtraction', choices:[] };
        },
        function(v) {
            var b = rnd(2, 5);
            return { text: v + ' × ' + b, answer: v * b, hint: 'ضرب', explanation: v + '×' + b + '=' + (v*b), catKey:'multiplication', choices:[] };
        },
        function(v) {
            if (v < 4) return { text: v + ' + ' + 2, answer: v + 2, hint: 'جمع', explanation: v+'+2='+(v+2), catKey:'addition', choices:[] };
            var b = [2,3,4].filter(function(d){ return v % d === 0; });
            if (b.length === 0) return { text: v + ' + ' + 2, answer: v + 2, hint: 'جمع', explanation: v+'+2='+(v+2), catKey:'addition', choices:[] };
            var d = b[rnd(0, b.length-1)];
            return { text: v + ' ÷ ' + d, answer: v / d, hint: 'قسمة', explanation: v+'÷'+d+'='+(v/d), catKey:'division', choices:[] };
        }
    ];

    var q = ops[rnd(0, ops.length - 1)](val);

    /* التحقق من أن الناتج صالح */
    if (!q || typeof q.answer !== 'number' || isNaN(q.answer) || q.answer <= 0 || !isFinite(q.answer)) {
        var b = rnd(2, 10);
        q = { text: val + ' + ' + b, answer: val + b, hint: 'جمع', explanation: val+'+'+b+'='+(val+b), catKey:'addition', choices:[] };
    }

    /* توليد خيارات ذكية */
    q.choices = _iqeSmartChoices(q.answer, 'add_basic');
    q.answer = Math.round(q.answer * 1000) / 1000;
    return q;
}


/* ───────────────────────────────────────────────────────────────────────
   ⑦ دالة إضافة قانون جديد في المستقبل
   الاستخدام: IQE_addLaw({ id, label, levels, generate })
─────────────────────────────────────────────────────────────────────── */

function IQE_addLaw(law) {
    if (!law || !law.id || !law.generate) {
        console.warn('[IQE] قانون غير صالح:', law);
        return false;
    }
    /* فحص التكرار */
    var exists = IQE_LAWS.some(function(l){ return l.id === law.id; });
    if (exists) {
        console.warn('[IQE] القانون موجود مسبقاً:', law.id);
        return false;
    }
    IQE_LAWS.push(law);
    _iqeIndex = null; /* إعادة بناء الفهرس */
    console.log('[IQE] تم إضافة القانون:', law.id, '—', law.label);
    return true;
}

/**
 * IQE_getLaws(level) — لعرض القوانين المتاحة لمستوى معين
 * مفيد للإعدادات والإحصاءات
 */
function IQE_getLaws(level) {
    var idx = _iqeBuildIndex();
    return (idx[level] || []).map(function(l){ return { id: l.id, label: l.label }; });
}

/* تصدير للنافذة لضمان الوصول من جميع الملفات */
window.generateInfiniteQ = generateInfiniteQ;
window.IQE_addLaw        = IQE_addLaw;
window.IQE_getLaws        = IQE_getLaws;
window.IQE_LAWS           = IQE_LAWS;

console.log('[IQE] محرك الأسئلة اللانهائي جاهز — ' + IQE_LAWS.length + ' قانون رياضي');
