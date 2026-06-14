/* ═══════════════════════════════════════════════════════════
   صفحة المنافسة — CSS الحماسي
   أضف هذا في آخر ملف styles.css أو في ملف منفصل
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   Hero Banner — البطل الرئيسي
══════════════════════════════════════════ */
.comp-hero-banner {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    margin-top: 10px;
    padding: 24px 18px 18px;
    background: linear-gradient(145deg, #0e0b1f 0%, #1a0a2e 40%, #0b1a2e 100%);
    border: 1.5px solid rgba(240, 185, 11, 0.3);
    box-shadow: 0 8px 40px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255,255,255,0.06);
}

.comp-hero-bg-sparks {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.comp-spark {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: var(--gold);
    animation: sparkFly var(--dur, 4s) linear infinite;
    animation-delay: var(--delay, 0s);
    opacity: 0;
}

@keyframes sparkFly {
    0%   { transform: translate(0,0) scale(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translate(var(--tx, 60px), var(--ty, -80px)) scale(2); opacity: 0; }
}

.comp-hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
}

.comp-hero-icon-wrap {
    position: relative;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.comp-hero-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: conic-gradient(var(--gold), var(--accent), #ef4444, var(--gold));
    animation: spin 3s linear infinite;
    opacity: 0.8;
}

.comp-hero-ring::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: #1a0a2e;
}

.comp-hero-icon {
    font-size: 2.2em;
    position: relative;
    z-index: 1;
    animation: heroPulse 2s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 12px rgba(240,185,11,0.6));
}

@keyframes heroPulse {
    from { transform: scale(1); filter: drop-shadow(0 0 8px rgba(240,185,11,0.4)); }
    to   { transform: scale(1.08); filter: drop-shadow(0 0 20px rgba(240,185,11,0.9)); }
}

.comp-hero-title {
    font-size: 1.55em;
    font-weight: 900;
    color: var(--text);
    letter-spacing: 1px;
    text-shadow: 0 0 20px rgba(240,185,11,0.3);
}

.comp-hero-sub {
    font-size: 0.72em;
    color: var(--text2);
    margin-bottom: 4px;
}

/* إحصائياتي الثلاث */
.comp-my-stats-row {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    margin-top: 4px;
}

.comp-my-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 4px;
    gap: 2px;
}

.comp-my-stat-val {
    font-size: 1.25em;
    font-weight: 900;
    color: var(--gold);
    line-height: 1;
}

.comp-my-stat-lbl {
    font-size: 0.54em;
    color: var(--text2);
    font-weight: 600;
}

.comp-my-stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
}

/* زر البدء الرئيسي */
.comp-start-btn {
    position: relative;
    width: 100%;
    margin-top: 14px;
    padding: 16px 20px 14px;
    border-radius: 18px;
    background: linear-gradient(135deg, #f0b90b 0%, #ffd54f 50%, #f0b90b 100%);
    background-size: 200% 100%;
    color: #000;
    font-family: 'Tajawal', sans-serif;
    font-weight: 900;
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 6px 28px rgba(240,185,11,0.45), 0 2px 0 rgba(255,255,255,0.2) inset;
    animation: btnShimmer 2.5s ease infinite;
}

@keyframes btnShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.comp-start-btn:active {
    transform: scale(0.96);
    box-shadow: 0 2px 12px rgba(240,185,11,0.3);
}

.comp-start-btn-glow {
    position: absolute;
    inset: -4px;
    border-radius: 22px;
    background: rgba(240,185,11,0.2);
    filter: blur(12px);
    animation: glowPulse 1.8s ease infinite alternate;
    pointer-events: none;
    z-index: 0;
}

@keyframes glowPulse {
    from { opacity: 0.4; }
    to   { opacity: 1; }
}

.comp-start-btn-text {
    display: block;
    font-size: 1.1em;
    font-weight: 900;
    position: relative;
    z-index: 1;
}

.comp-start-btn-sub {
    display: block;
    font-size: 0.62em;
    font-weight: 600;
    opacity: 0.7;
    margin-top: 2px;
    position: relative;
    z-index: 1;
}

/* ══ بطاقات الأقسام ══ */
.comp-section-card {
    background: var(--surface2);
    border: 1px solid var(--gold-border);
    border-radius: 18px;
    overflow: hidden;
}

.comp-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    user-select: none;
}

.comp-section-title {
    font-size: 0.88em;
    font-weight: 900;
    color: var(--text);
}

.comp-section-sub {
    font-size: 0.62em;
    color: var(--text2);
    margin-top: 2px;
}

.comp-chevron {
    font-size: 0.85em;
    color: var(--gold);
    transition: transform 0.3s;
}

/* ══ تبويبات لوحة الصدارة ══ */
.comp-lb-tabs {
    display: flex;
    gap: 7px;
    margin-bottom: 8px;
}

.comp-lb-tab {
    flex: 1;
    padding: 9px 8px;
    border-radius: 12px;
    font-family: 'Tajawal', sans-serif;
    font-size: 0.78em;
    font-weight: 800;
    cursor: pointer;
    transition: 0.2s;
    border: 1.5px solid var(--border2);
    background: var(--surface3);
    color: var(--text2);
}

.comp-lb-tab.active {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #000;
    border-color: var(--gold);
    box-shadow: 0 3px 12px rgba(240,185,11,0.3);
}

.comp-lb-card {
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 18px;
    overflow: hidden;
}

.comp-lb-hint {
    font-size: 0.62em;
    color: var(--text2);
    text-align: center;
    padding: 6px 0 2px;
}

/* ══════════════════════════════════════════
   OVERLAY مشترك — كل الشاشات الحماسية
══════════════════════════════════════════ */
/* challenge-overlay مقيّدة داخل صفحة المنافسة فقط */
#page-leaderboard .challenge-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background: #07090f;
    overflow: hidden;
}

/* ══════════════════════════════════════════
   شاشة العد التنازلي
══════════════════════════════════════════ */
#challengeCountdownOverlay {
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at center, #1a0b30 0%, #07090f 70%);
}

.cdo-bg-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.cdo-line {
    position: absolute;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(240,185,11,0.15), transparent);
    animation: lineSlide var(--dur, 3s) linear infinite;
    animation-delay: var(--delay, 0s);
    opacity: 0;
}

@keyframes lineSlide {
    0%   { transform: translateY(-100%); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 0.5; }
    100% { transform: translateY(100vh); opacity: 0; }
}

.cdo-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 24px;
}

.cdo-title {
    font-size: 1em;
    font-weight: 800;
    color: var(--text2);
    letter-spacing: 4px;
    text-transform: uppercase;
}

.cdo-number {
    font-size: 7em;
    font-weight: 900;
    color: var(--gold);
    line-height: 1;
    text-shadow: 0 0 60px rgba(240,185,11,0.7), 0 0 120px rgba(240,185,11,0.3);
    animation: cdoNumPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes cdoNumPop {
    from { transform: scale(0.3); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
}

.cdo-sub {
    font-size: 0.8em;
    color: var(--text2);
    animation: fadeIn 0.4s ease 0.2s both;
}

.cdo-rules {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 14px 18px;
    margin-top: 8px;
    animation: fadeIn 0.4s ease 0.3s both;
}

.cdo-rule {
    font-size: 0.76em;
    color: var(--text2);
}

.cdo-rule strong {
    color: var(--text);
}

/* ══════════════════════════════════════════
   واجهة اللعب الحماسية (Challenge Game Arena)
══════════════════════════════════════════ */
#challengeGameArea {
    background: #060810;
    flex-direction: column;
}

/* خلفية نابضة ديناميكية */
.cga-bg-pulse {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 20%, rgba(124,58,237,0.15) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(239,68,68,0.08) 0%, transparent 50%);
    animation: bgPulse 4s ease-in-out infinite alternate;
}

@keyframes bgPulse {
    from { opacity: 0.6; }
    to   { opacity: 1; }
}

/* شبكة خلفية */
.cga-bg-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
}

/* Header */
.cga-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(var(--safe-top) + 12px) 14px 10px;
    flex-shrink: 0;
    background: rgba(6,8,16,0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 5;
}

.cga-quit-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    color: var(--red);
    font-size: 0.85em;
    font-weight: 900;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.cga-quit-btn:active { transform: scale(0.88); background: rgba(239,68,68,0.25); }

.cga-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
}

.cga-q-label {
    font-size: 0.62em;
    color: var(--text2);
    font-weight: 700;
}

.cga-diff-badge {
    font-size: 0.65em;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(6,182,212,0.15);
    border: 1px solid rgba(6,182,212,0.3);
    color: var(--accent2);
    transition: background 0.4s, border-color 0.4s, color 0.4s;
}

.cga-diff-badge.diff-easy   { background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.35); color:#10b981; }
.cga-diff-badge.diff-medium { background:rgba(6,182,212,0.15);  border-color:rgba(6,182,212,0.35);  color:#06b6d4; }
.cga-diff-badge.diff-hard   { background:rgba(249,115,22,0.15); border-color:rgba(249,115,22,0.35); color:#f97316; }
.cga-diff-badge.diff-genius { background:rgba(239,68,68,0.15);  border-color:rgba(239,68,68,0.35);  color:#ef4444; }

.cga-score-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(240,185,11,0.1);
    border: 1.5px solid rgba(240,185,11,0.3);
    border-radius: 14px;
    padding: 6px 12px;
}

.cga-score-icon { font-size: 0.9em; }

.cga-score-num {
    font-size: 1.3em;
    font-weight: 900;
    color: var(--gold);
    line-height: 1;
    min-width: 28px;
    text-align: center;
    transition: transform 0.2s;
}

.cga-score-num.score-bump {
    animation: scoreBump 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scoreBump {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.35); color: #ffd54f; }
    100% { transform: scale(1); }
}

/* شريط الوقت */
.cga-timer-section {
    flex-shrink: 0;
    padding: 8px 14px 4px;
    position: relative;
    z-index: 4;
    background: rgba(6,8,16,0.7);
}

.cga-timer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.cga-timer-label {
    font-size: 0.62em;
    color: var(--text2);
}

.cga-timer-num {
    font-size: 1.6em;
    font-weight: 900;
    color: var(--accent2);
    line-height: 1;
    transition: color 0.3s;
    font-variant-numeric: tabular-nums;
}

.cga-timer-num.danger {
    color: var(--red);
    animation: timerPulse 0.45s ease-in-out infinite alternate;
}

.cga-timer-track {
    position: relative;
    height: 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 8px;
    overflow: visible;
}

.cga-timer-fill {
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, var(--accent2), #7c3aed);
    transition: width 0.3s linear, background 0.5s;
    position: relative;
    box-shadow: 0 0 10px rgba(6,182,212,0.5);
}

.cga-timer-fill.danger-bar {
    background: linear-gradient(90deg, #ef4444, #f97316);
    box-shadow: 0 0 14px rgba(239,68,68,0.6);
    animation: dangerFlash 0.5s ease infinite alternate;
}

@keyframes dangerFlash {
    from { box-shadow: 0 0 8px rgba(239,68,68,0.4); }
    to   { box-shadow: 0 0 20px rgba(239,68,68,0.9); }
}

.cga-timer-glow {
    position: absolute;
    top: -3px;
    right: -2px;
    width: 12px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent2);
    filter: blur(4px);
    transition: background 0.5s;
}

/* Streak Banner */
.cga-streak-banner {
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(240,185,11,0.2), rgba(239,68,68,0.15));
    border-bottom: 1px solid rgba(240,185,11,0.25);
    padding: 6px 14px;
    text-align: center;
    position: relative;
    z-index: 4;
    animation: streakSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes streakSlideIn {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
}

#cgaStreakText {
    font-size: 0.9em;
    font-weight: 900;
    color: var(--gold);
    text-shadow: 0 0 10px rgba(240,185,11,0.5);
}

/* Body اللعبة */
.cga-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 14px 12px;
    gap: 10px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 3;
}

/* بطاقة السؤال */
.cga-question-card {
    width: 100%;
    background: linear-gradient(145deg, #0f1220, #141830);
    border: 2px solid rgba(124,58,237,0.3);
    border-radius: 24px;
    padding: 22px 18px 18px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 30px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05);
    transition: border-color 0.3s;
}

.cga-question-card.card-correct {
    border-color: rgba(16,185,129,0.6);
    box-shadow: 0 4px 30px rgba(16,185,129,0.2);
}

.cga-question-card.card-wrong {
    border-color: rgba(239,68,68,0.6);
    box-shadow: 0 4px 30px rgba(239,68,68,0.2);
    animation: cardShake 0.4s ease;
}

@keyframes cardShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}

.cga-question-glow {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%);
    pointer-events: none;
}

.cga-q-num-label {
    font-size: 0.6em;
    color: var(--text2);
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.cga-question-text {
    font-size: 2.8em;
    font-weight: 900;
    color: var(--text);
    line-height: 1.2;
    direction: ltr;
    unicode-bidi: embed;
    animation: qPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cga-question-hint {
    font-size: 0.66em;
    color: var(--text2);
    margin-top: 5px;
}

/* شبكة الإجابات */
.cga-answers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
}

.cga-answers-grid .answer-btn {
    background: linear-gradient(145deg, #111525, #171e30);
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 16px 10px;
    font-size: 1.35em;
    font-weight: 900;
    color: var(--text);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.15s;
    position: relative;
    overflow: hidden;
    font-family: 'Tajawal', sans-serif;
    box-shadow: 0 3px 12px rgba(0,0,0,0.3);
}

.cga-answers-grid .answer-btn:active {
    transform: scale(0.94);
}

.cga-answers-grid .answer-btn:hover:not(:disabled) {
    border-color: rgba(240,185,11,0.4);
    background: linear-gradient(145deg, #171825, #1e2438);
}

.cga-answers-grid .answer-btn.correct {
    background: linear-gradient(145deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1));
    border-color: var(--green);
    color: var(--green);
    box-shadow: 0 0 20px rgba(16,185,129,0.3);
    animation: correctBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cga-answers-grid .answer-btn.wrong {
    background: linear-gradient(145deg, rgba(239,68,68,0.18), rgba(239,68,68,0.08));
    border-color: var(--red);
    color: var(--red);
    animation: wrongShake 0.36s ease;
}

@keyframes correctBounce {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.06); }
    100% { transform: scale(1); }
}

/* شريط المساعدات */
.cga-helpers-bar {
    display: flex;
    gap: 8px;
    width: 100%;
}

.cga-helper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: linear-gradient(145deg, #111525, #151d2e);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 8px 4px 9px;
    cursor: pointer;
    transition: 0.2s;
    position: relative;
}

.cga-helper:active {
    transform: scale(0.92);
    border-color: var(--gold);
}

.cga-helper.used {
    opacity: 0.3;
    pointer-events: none;
}

.cga-helper-icon { font-size: 1.25em; line-height: 1; }
.cga-helper-name { font-size: 0.52em; color: var(--text2); font-weight: 700; }
.cga-helper-cost {
    position: absolute;
    top: -6px;
    right: -6px;
    background: var(--gold);
    color: #000;
    font-size: 0.5em;
    font-weight: 900;
    padding: 2px 5px;
    border-radius: 8px;
    white-space: nowrap;
}

/* ══════════════════════════════════════════
   شاشة النتيجة
══════════════════════════════════════════ */
#challengeResultArea {
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 30%, #15102a 0%, #060810 60%);
}

.cgr-bg-rays {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: conic-gradient(from 0deg at 50% 40%,
        transparent 0deg,
        rgba(240,185,11,0.03) 10deg,
        transparent 20deg,
        rgba(240,185,11,0.03) 30deg,
        transparent 40deg,
        rgba(240,185,11,0.03) 50deg,
        transparent 60deg
    );
    animation: raysRotate 20s linear infinite;
}

@keyframes raysRotate {
    to { transform: rotate(360deg); }
}

.cgr-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    padding: 24px 18px;
    width: 100%;
    max-width: 380px;
}

.cgr-medal-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cgr-medal-ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: conic-gradient(var(--gold) 0%, #ffd54f 25%, var(--gold) 50%, #f97316 75%, var(--gold) 100%);
    animation: spin 4s linear infinite;
}

.cgr-medal-ring::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: #15102a;
}

.cgr-medal-icon {
    font-size: 2.4em;
    position: relative;
    z-index: 1;
    animation: medalBounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes medalBounce {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.cgr-title {
    font-size: 1.6em;
    font-weight: 900;
    color: var(--text);
    text-shadow: 0 0 20px rgba(240,185,11,0.3);
}

.cgr-sub {
    font-size: 0.72em;
    color: var(--text2);
    margin-top: -4px;
}

.cgr-stats-row {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 4px;
}

.cgr-stat {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 14px 6px;
    text-align: center;
}

.cgr-stat-best {
    background: rgba(240,185,11,0.08);
    border-color: rgba(240,185,11,0.25);
}

.cgr-stat-num {
    font-size: 1.7em;
    font-weight: 900;
    color: var(--gold);
    line-height: 1;
}

.cgr-stat-lbl {
    font-size: 0.58em;
    color: var(--text2);
    margin-top: 4px;
}

.cgr-compare-row {
    background: rgba(6,182,212,0.08);
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: 12px;
    padding: 8px 14px;
    font-size: 0.75em;
    color: var(--accent2);
    font-weight: 700;
    text-align: center;
    width: 100%;
}

.cgr-record-badge {
    background: linear-gradient(135deg, rgba(240,185,11,0.2), rgba(249,115,22,0.15));
    border: 1.5px solid rgba(240,185,11,0.4);
    border-radius: 30px;
    padding: 8px 18px;
    font-size: 0.82em;
    font-weight: 900;
    color: var(--gold);
    text-shadow: 0 0 10px rgba(240,185,11,0.4);
    animation: recordPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes recordPop {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
}

.cgr-btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    margin-top: 4px;
}

.cgr-btn-primary {
    width: 100%;
    padding: 15px;
    border-radius: 16px;
    font-family: 'Tajawal', sans-serif;
    font-size: 0.97em;
    font-weight: 900;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #000;
    box-shadow: 0 4px 20px rgba(240,185,11,0.35);
    transition: 0.2s;
}

.cgr-btn-primary:active { transform: scale(0.97); }

.cgr-btn-secondary {
    width: 100%;
    padding: 13px;
    border-radius: 14px;
    font-family: 'Tajawal', sans-serif;
    font-size: 0.88em;
    font-weight: 700;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text2);
    cursor: pointer;
    transition: 0.2s;
}

.cgr-btn-secondary:active { background: rgba(255,255,255,0.09); }

/* ══ Responsive adjustments ══ */


/* ═══ Layout Fixes — معزولة عن styles.css العام ═══ */

#page-leaderboard {
    padding: 0 !important;
    gap: 0 !important;
}

#page-leaderboard .challenge-overlay {
    position: absolute;
    inset: 0;
    z-index: 20;
}

#page-leaderboard .comp-start-btn  { border: none !important; }
#page-leaderboard .cgr-btn-primary  { border: none !important; }
#page-leaderboard .comp-lb-tab.active { border: none !important; }

/* ═══════════════════════════════════════════════════════════════
   🔧 FIX: إجبار اللون الأبيض على كل النصوص والأرقام في واجهة التحدي
   يضمن القراءة الجيدة بغض النظر عن وضع الثيم (فاتح/داكن)
═══════════════════════════════════════════════════════════════ */

/* --- شاشة العد التنازلي --- */
#challengeCountdownOverlay,
#challengeCountdownOverlay * {
    color: inherit;
}

#challengeCountdownOverlay .cdo-title,
#challengeCountdownOverlay .cdo-sub,
#challengeCountdownOverlay .cdo-rule {
    color: rgba(255, 255, 255, 0.75) !important;
}

#challengeCountdownOverlay .cdo-number {
    color: var(--gold, #f0b90b) !important;
}

#challengeCountdownOverlay .cdo-rule strong {
    color: #ffffff !important;
}

/* --- منطقة اللعب الحماسية --- */
#challengeGameArea .cga-q-label,
#challengeGameArea .cga-timer-label,
#challengeGameArea .cga-helper-name {
    color: rgba(255, 255, 255, 0.65) !important;
}

#challengeGameArea .cga-q-num-label,
#challengeGameArea .cga-question-hint {
    color: rgba(255, 255, 255, 0.6) !important;
}

#challengeGameArea .cga-question-text {
    color: #ffffff !important;
}

#challengeGameArea .cga-score-num {
    color: var(--gold, #f0b90b) !important;
}

#challengeGameArea .cga-timer-num {
    color: #ffffff !important;
}

#challengeGameArea .cga-timer-num.danger {
    color: #ff6b6b !important;
}

/* أزرار الإجابة */
#challengeGameArea .cga-answers-grid .answer-btn {
    color: #ffffff !important;
}

#challengeGameArea .cga-answers-grid .answer-btn.correct {
    color: #4ade80 !important;
}

#challengeGameArea .cga-answers-grid .answer-btn.wrong {
    color: #ff6b6b !important;
}

/* شريط المساعدات */
#challengeGameArea .cga-helper-cost {
    color: #000000 !important;
}

/* --- شاشة النتيجة --- */
#challengeResultArea .cgr-title {
    color: #ffffff !important;
}

#challengeResultArea .cgr-sub,
#challengeResultArea .cgr-stat-lbl {
    color: rgba(255, 255, 255, 0.65) !important;
}

#challengeResultArea .cgr-stat-num {
    color: var(--gold, #f0b90b) !important;
}

#challengeResultArea .cgr-compare-row {
    color: #67e8f9 !important;
}

#challengeResultArea .cgr-record-badge {
    color: var(--gold, #f0b90b) !important;
}

/* --- لوحة الصدارة العامة (comp-hero-banner) --- */
.comp-hero-title {
    color: #ffffff !important;
}

.comp-hero-sub,
.comp-my-stat-lbl {
    color: rgba(255, 255, 255, 0.65) !important;
}

.comp-my-stat-val {
    color: var(--gold, #f0b90b) !important;
}

.comp-section-title {
    color: #ffffff !important;
}

.comp-section-sub {
    color: rgba(255, 255, 255, 0.6) !important;
}

/* ══ عنوان "مهام التحدي" — بارز بلون عكسي ══ */
.challenge-tasks-title,
#page-leaderboard .comp-section-title {
    color: var(--accent2) !important;
    text-shadow: 0 0 12px rgba(6,182,212,0.50);
    font-weight: 900;
    font-size: 0.95em;
    letter-spacing: 0.3px;
}

/* ══ التبويبات غير النشطة ══ */
.comp-lb-tab {
    color: rgba(255, 255, 255, 0.6) !important;
}

.comp-lb-tab.active {
    color: #000000 !important;
}

/* الـ streak banner */
#cgaStreakText {
    color: var(--gold, #f0b90b) !important;
}

/* نص زر البدء */
.comp-start-btn-text {
    color: #000000 !important;
}

.comp-start-btn-sub {
    color: rgba(0, 0, 0, 0.7) !important;
}


/* ═══════════════════════════════════════════════════════════
   ✅ لوحة الصدارة — أزرار + Overlay
═══════════════════════════════════════════════════════════ */

/* ══ أزرار لائحة الصدارة — متناسقة مع الثيم ══ */
.comp-lb-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-radius: 16px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    font-weight: 800;
    color: var(--text);
    transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
    text-align: right;
    border: 1.5px solid var(--border2);
    background: var(--surface2);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.comp-lb-tab-btn:active {
    transform: scale(0.96);
}

/* زر التحدي — ذهبي */
.comp-lb-tab-btn:first-child {
    border-color: rgba(var(--gold-rgb, 240,185,11), 0.40);
    border-color: color-mix(in srgb, var(--gold) 40%, transparent);
    background: linear-gradient(135deg,
        rgba(240,185,11,0.10),
        rgba(240,185,11,0.04));
    box-shadow: 0 2px 10px rgba(240,185,11,0.10);
}
.comp-lb-tab-btn:first-child:hover,
.comp-lb-tab-btn:first-child:focus {
    background: linear-gradient(135deg,
        rgba(240,185,11,0.18),
        rgba(240,185,11,0.08));
    box-shadow: 0 4px 16px rgba(240,185,11,0.22);
}
.comp-lb-tab-btn:first-child .comp-lb-tab-arrow {
    color: var(--gold);
}
.comp-lb-tab-btn:first-child .comp-lb-tab-icon {
    filter: drop-shadow(0 0 6px rgba(240,185,11,0.55));
}

/* زر النقاط — سماوي */
.comp-lb-tab-btn:last-child {
    border-color: rgba(6,182,212,0.40);
    background: linear-gradient(135deg,
        rgba(6,182,212,0.10),
        rgba(6,182,212,0.04));
    box-shadow: 0 2px 10px rgba(6,182,212,0.10);
}
.comp-lb-tab-btn:last-child:hover,
.comp-lb-tab-btn:last-child:focus {
    background: linear-gradient(135deg,
        rgba(6,182,212,0.18),
        rgba(6,182,212,0.08));
    box-shadow: 0 4px 16px rgba(6,182,212,0.22);
}
.comp-lb-tab-btn:last-child .comp-lb-tab-arrow {
    color: var(--accent2);
}
.comp-lb-tab-btn:last-child .comp-lb-tab-icon {
    filter: drop-shadow(0 0 6px rgba(6,182,212,0.55));
}

.comp-lb-tab-icon  { font-size: 1.4em; flex-shrink: 0; }
.comp-lb-tab-label { flex: 1; font-size: 0.92em; font-weight: 900; color: var(--text); }
.comp-lb-tab-arrow { font-size: 1.4em; font-weight: 400; }

.lb-overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--border2);
    background: var(--surface2);
    flex-shrink: 0;
    gap: 12px;
}
.lb-overlay-back {
    width:38px; height:38px; border-radius:50%;
    background:var(--surface3); border:1.5px solid var(--border2);
    color:var(--text); font-size:1.4em; font-weight:700;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:background 0.15s; line-height:1; padding-bottom:2px;
}
.lb-overlay-back:active { background:var(--border2); }
.lb-overlay-title {
    flex:1; font-family:'Tajawal',sans-serif;
    font-size:1.05em; font-weight:900; color:var(--text); text-align:center;
}
.lb-overlay-refresh {
    width:38px; height:38px; border-radius:50%;
    background:var(--surface3); border:1.5px solid var(--border2);
    color:var(--gold); font-size:1.25em; font-weight:900;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:background 0.15s;
}
.lb-overlay-refresh:active { background:rgba(240,185,11,0.15); }
.lb-overlay-refresh.spinning #lbRefreshIcon {
    display:inline-block;
    animation:lbSpin 0.6s linear;
}
@keyframes lbSpin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
}
.lb-overlay-body {
    flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch;
    padding:14px 16px 20px;
}
#lbOverlayList { max-height:calc(100vh - 160px); }
#lbOverlay { animation:lbSlideIn 0.25s cubic-bezier(0.34,1.2,0.64,1); }
@keyframes lbSlideIn {
    from { transform:translateY(30px); opacity:0; }
    to   { transform:translateY(0);    opacity:1; }
}

/* ═══════════════════════════════════════════════════
   زر مهام التحدي + Overlay
═══════════════════════════════════════════════════ */

/* الزر الرئيسي */
.challenge-tasks-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(240,185,11,0.12), rgba(124,58,237,0.08));
    border: 1.5px solid rgba(240,185,11,0.28);
    border-radius: 18px;
    padding: 14px 16px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
}
.challenge-tasks-btn:active {
    transform: scale(0.97);
    background: linear-gradient(135deg, rgba(240,185,11,0.2), rgba(124,58,237,0.14));
}
.challenge-tasks-btn-right {
    display: flex;
    align-items: center;
    gap: 12px;
}
.challenge-tasks-btn-icon {
    font-size: 1.6em;
    line-height: 1;
}
.challenge-tasks-btn-title {
    font-size: 0.92em;
    font-weight: 900;
    color: var(--text);
    text-align: right;
}
.challenge-tasks-btn-sub {
    font-size: 0.68em;
    color: var(--text2);
    margin-top: 2px;
    text-align: right;
}
.challenge-tasks-btn-meta {
    display: flex;
    align-items: center;
    gap: 6px;
}
.challenge-tasks-btn-progress {
    font-size: 0.82em;
    font-weight: 900;
    color: var(--gold);
    background: rgba(240,185,11,0.12);
    border: 1px solid rgba(240,185,11,0.25);
    border-radius: 20px;
    padding: 3px 10px;
}
.challenge-tasks-btn-arrow {
    font-size: 1.4em;
    color: var(--text2);
    font-weight: 700;
}

/* هيدر الـ overlay */
.cto-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--border2);
    flex-shrink: 0;
}
.cto-back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--surface2);
    border: 1px solid var(--border2);
    font-size: 1.4em;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    transition: background 0.15s;
}
.cto-back-btn:active {
    background: var(--surface3);
}
.cto-title {
    font-size: 1em;
    font-weight: 900;
    color: var(--text);
}

/* cto-body و cto-desc معرّفان في القسم أدناه */

/* ═══════════════════════════════════════════════════
   هيكل صفحة المنافسة الجديد
═══════════════════════════════════════════════════ */

/* الحاوية الرئيسية — flex column يملأ الصفحة */
.comp-main-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px 14px 0;
    gap: 10px;
    overflow: hidden;
    position: relative;
}

/* Hero يتمدد ليملأ المساحة المتبقية */
.comp-hero-expanded {
    flex: 1;
    margin-top: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
}

/* شريط الأزرار الثلاثة — عمودي واحد تحت الآخر */
.comp-bottom-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    flex-shrink: 0;
}

.comp-bottom-btn {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    background: var(--surface2);
    border: 1.5px solid var(--border2);
    border-radius: 16px;
    padding: 13px 16px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
}
.comp-bottom-btn:active {
    transform: scale(0.98);
    background: var(--surface3);
}
.comp-bottom-btn-icon {
    font-size: 1.3em;
    line-height: 1;
    flex-shrink: 0;
}
.comp-bottom-btn-label {
    flex: 1;
    font-size: 0.88em;
    font-weight: 800;
    color: var(--text);
    text-align: right;
}
.comp-bottom-btn-arrow {
    font-size: 1.2em;
    color: var(--text2);
    flex-shrink: 0;
}
.comp-bottom-btn-badge {
    font-size: 0.72em;
    font-weight: 900;
    color: var(--gold);
    background: rgba(240,185,11,0.15);
    border: 1px solid rgba(240,185,11,0.3);
    border-radius: 20px;
    padding: 2px 9px;
    flex-shrink: 0;
}

/* ═══ overlay مهام التحدي — يمتد على كامل الصفحة مع scroll ═══ */
.cto-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
}
.cto-desc {
    font-size: 0.72em;
    color: var(--text2);
    text-align: center;
    padding: 4px 0 6px;
    flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════
   🏆 SEASON PASS — موسم الرياضيات CSS
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* ── زر موسم الرياضيات المميز في شريط الأزرار ── */
.comp-season-btn {
    background: linear-gradient(135deg, #1a0a2e 0%, #0e1a3a 100%) !important;
    border-color: rgba(240,185,11,0.45) !important;
    box-shadow: 0 0 16px rgba(240,185,11,0.12);
    align-items: center;
}
.comp-season-btn-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: right;
}
.comp-season-btn-title {
    font-size: 0.9em;
    font-weight: 900;
    color: var(--gold);
}
.comp-season-btn-sub {
    font-size: 0.65em;
    color: var(--text2);
}
.comp-season-btn-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
}
.comp-season-mini-bar {
    width: 72px;
    height: 5px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
}
.comp-season-mini-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), #fff176);
    border-radius: 10px;
    transition: width 0.5s ease;
}
.comp-season-pts-badge {
    font-size: 0.6em;
    font-weight: 900;
    color: var(--gold);
}

/* ── Header صفحة الموسم ── */
.sp-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 18px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}
.sp-back-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border2);
    color: var(--text2);
    border-radius: 12px;
    width: 38px;
    height: 38px;
    font-size: 1.5em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s ease;
}
.sp-back-btn:active {
    background: rgba(255,255,255,0.1);
    transform: scale(0.92);
}
.sp-header-center {
    flex: 1;
    text-align: center;
    min-width: 0;
}
.sp-header-title {
    font-size: 1em;
    font-weight: 900;
    color: var(--text);
    letter-spacing: 0.3px;
}
.sp-header-sub {
    font-size: 0.7em;
    color: var(--text3);
    margin-top: 2px;
    font-weight: 500;
}
.sp-header-timer {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 0.65em;
    font-weight: 800;
    color: var(--text2);
    flex-shrink: 0;
    white-space: nowrap;
}
.sp-timer-icon { font-size: 1em; opacity: 0.7; }

/* ── شريط التقدم الكلي ── */
.sp-progress-section {
    padding: 14px 18px 12px;
    background: transparent;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}
.sp-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
}
.sp-pts-label {
    font-size: 0.75em;
    color: var(--text3);
    font-weight: 600;
}
.sp-pts-val {
    font-size: 0.82em;
    font-weight: 900;
    color: var(--gold);
}
.sp-progress-track {
    position: relative;
    height: 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 20px;
    overflow: visible;
}
.sp-progress-fill {
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    background: linear-gradient(90deg, #e5a800, #f0b90b, #ffe066);
    background-size: 200% 100%;
    border-radius: 20px;
    transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
    animation: spBarShimmer 3s linear infinite;
}
@keyframes spBarShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.sp-progress-glow {
    position: absolute;
    top: -5px; right: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 10px 3px rgba(240,185,11,0.4);
    transition: right 0.6s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: none;
}
.sp-progress-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 9px;
}
.sp-completed-days,
.sp-total-earned {
    font-size: 0.65em;
    color: var(--text3);
    font-weight: 600;
}

/* ── Body قابل للتمرير ── */
.sp-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px 18px 36px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
}
.sp-body::-webkit-scrollbar { display: none; }

/* ── عناوين الأقسام ── */
.sp-section-title {
    font-size: 0.78em;
    font-weight: 900;
    color: var(--text2);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 7px;
    letter-spacing: 0.3px;
}
.sp-daily-title {
    margin-top: 4px;
}
.sp-daily-badge {
    background: rgba(240,185,11,0.1);
    border: 1px solid rgba(240,185,11,0.25);
    color: var(--gold);
    border-radius: 20px;
    padding: 1px 9px;
    font-size: 0.85em;
    font-weight: 900;
}
.sp-desc {
    font-size: 0.67em;
    color: var(--text2);
    margin-bottom: 6px;
}

/* ── مسار الجوائز (أفقي قابل للتمرير) ── */
.sp-track-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
    margin: 0 -4px;
}
.sp-track-scroll::-webkit-scrollbar { display: none; }
.sp-track {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0;
    padding: 4px 8px 8px;
    min-width: max-content;
}

/* محطة جائزة واحدة */
.sp-reward-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    flex-shrink: 0;
}
/* الخط الرابط بين المحطات */
.sp-reward-node::before {
    content: '';
    position: absolute;
    top: 22px;
    right: 50%;
    width: 36px;
    height: 3px;
    background: var(--border2);
    z-index: 0;
}
.sp-reward-node:first-child::before { display: none; }
.sp-reward-node.reached::before {
    background: linear-gradient(90deg, var(--gold), rgba(240,185,11,0.4));
}

/* دائرة المحطة */
.sp-node-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
    position: relative;
    z-index: 1;
    background: var(--surface3);
    border: 2.5px solid var(--border2);
    transition: all 0.3s ease;
    flex-shrink: 0;
}
.sp-reward-node.reached .sp-node-circle {
    background: linear-gradient(135deg, rgba(240,185,11,0.25), rgba(240,185,11,0.1));
    border-color: var(--gold);
    box-shadow: 0 0 12px rgba(240,185,11,0.35);
}
.sp-reward-node.claimed .sp-node-circle {
    background: linear-gradient(135deg, #10b981, #059669);
    border-color: #10b981;
    box-shadow: 0 0 10px rgba(16,185,129,0.4);
}
.sp-reward-node.claimed .sp-node-circle::after {
    content: '✓';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    background: #10b981;
    border-radius: 50%;
    font-size: 0.55em;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    border: 2px solid var(--bg);
}
/* علامة الـ current */
.sp-reward-node.current .sp-node-circle {
    animation: spNodePulse 1.4s ease-in-out infinite;
    border-color: var(--gold);
    background: rgba(240,185,11,0.15);
}
@keyframes spNodePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(240,185,11,0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(240,185,11,0); }
}
.sp-node-pts {
    font-size: 0.58em;
    font-weight: 900;
    color: var(--text2);
}
.sp-reward-node.reached .sp-node-pts,
.sp-reward-node.current .sp-node-pts { color: var(--gold); }
.sp-reward-node.claimed .sp-node-pts { color: #10b981; }
.sp-node-label {
    font-size: 0.55em;
    color: var(--text2);
    max-width: 60px;
    text-align: center;
    line-height: 1.3;
}

/* ── المهام اليومية ── */
.sp-tasks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.sp-task-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 12px 14px;
    transition: all 0.2s ease;
}
.sp-task-item.done {
    background: rgba(16,185,129,0.05);
    border-color: rgba(16,185,129,0.22);
}
.sp-task-icon {
    font-size: 1.4em;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border2);
    border-radius: 12px;
    text-align: center;
}
.sp-task-item.done .sp-task-icon {
    background: rgba(16,185,129,0.08);
    border-color: rgba(16,185,129,0.2);
}
.sp-task-info {
    flex: 1;
    min-width: 0;
}
.sp-task-name {
    font-size: 0.8em;
    font-weight: 900;
    color: var(--text);
    margin-bottom: 2px;
    line-height: 1.3;
}
.sp-task-item.done .sp-task-name {
    color: var(--text2);
}
.sp-task-desc {
    font-size: 0.65em;
    color: var(--text3);
    margin-bottom: 6px;
    font-weight: 500;
    line-height: 1.4;
}
.sp-task-bar {
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    overflow: hidden;
}
.sp-task-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 10px;
    transition: width 0.4s ease;
}
.sp-task-item.done .sp-task-bar-fill {
    background: linear-gradient(90deg, #10b981, #34d399);
}
.sp-task-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
}
.sp-task-pts {
    font-size: 0.72em;
    font-weight: 900;
    color: var(--gold);
    background: rgba(240,185,11,0.08);
    border: 1px solid rgba(240,185,11,0.2);
    border-radius: 7px;
    padding: 2px 7px;
}
.sp-task-prog {
    font-size: 0.62em;
    color: var(--text3);
    font-weight: 600;
}
/* نجوم الصعوبة */
.sp-task-stars {
    font-size: 0.62em;
    color: var(--gold);
    letter-spacing: 1px;
    opacity: 0.7;
}
/* شارة الوضع */
.sp-task-mode-badge {
    font-size: 0.57em;
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.22);
    color: var(--accent);
    border-radius: 5px;
    padding: 1px 5px;
    font-weight: 700;
}

/* زر استلام الجائزة */
.sp-claim-btn {
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 9px;
    padding: 4px 10px;
    font-size: 0.65em;
    font-weight: 900;
    cursor: pointer;
    flex-shrink: 0;
    font-family: 'Tajawal', sans-serif;
    box-shadow: 0 2px 8px rgba(240,185,11,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    animation: none;
}
.sp-claim-btn:active {
    transform: scale(0.93);
    box-shadow: 0 1px 4px rgba(240,185,11,0.2);
}


/* ═══════════════════════════════════════════════════════════
   🏆 SEASON PASS — المرحلة الرابعة: تأثيرات + حالات + Responsive
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════
   أنيميشن دخول الصفحة
══════════════════════════ */
#seasonPassOverlay {
    animation: spSlideUp 0.32s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}
@keyframes spSlideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
}

/* ══════════════════════════
   تأثير pop لنقاط الموسم
   يُضاف بـ JS على #spCurrentPts عند كل تحديث
══════════════════════════ */
.sp-pts-pop {
    animation: spPtsPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes spPtsPop {
    0%   { transform: scale(1);    color: var(--gold); }
    40%  { transform: scale(1.45); color: #fff176;     }
    100% { transform: scale(1);    color: var(--gold); }
}

/* ══════════════════════════
   تأثير المهمة عند الإكتمال
══════════════════════════ */
.sp-task-done-anim {
    animation: spTaskDone 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
@keyframes spTaskDone {
    0%   { transform: scale(1);    box-shadow: none; }
    50%  { transform: scale(1.04); box-shadow: 0 0 18px rgba(16,185,129,0.5); }
    100% { transform: scale(1);    box-shadow: 0 0 0 rgba(16,185,129,0); }
}

/* ══════════════════════════
   تأثير استلام الجائزة
══════════════════════════ */
.sp-reward-claim-pop {
    animation: spRewardClaim 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes spRewardClaim {
    0%   { transform: scale(1) rotate(0deg);   }
    30%  { transform: scale(1.3) rotate(-8deg); }
    60%  { transform: scale(0.95) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg);   }
}

/* ══════════════════════════
   زر الموسم — حالة الإكتمال
══════════════════════════ */
.comp-season-btn.all-done {
    background: linear-gradient(135deg, #0d2818 0%, #0e2010 100%) !important;
    border-color: rgba(16,185,129,0.55) !important;
    box-shadow: 0 0 20px rgba(16,185,129,0.18) !important;
}
.comp-season-btn.all-done .comp-season-btn-title {
    color: #34d399;
}
.comp-season-btn.all-done .comp-season-mini-fill {
    background: linear-gradient(90deg, #10b981, #34d399);
}

/* توهج دائم للزر عند وجود مهام جديدة */
.season-btn-glow {
    position: relative;
    overflow: visible;
}
.season-btn-glow::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: transparent;
    border: 2px solid rgba(240,185,11,0.0);
    animation: seasonBtnGlowPulse 2s ease-in-out infinite;
    pointer-events: none;
}
@keyframes seasonBtnGlowPulse {
    0%,100% { border-color: rgba(240,185,11,0.0); box-shadow: none; }
    50%      { border-color: rgba(240,185,11,0.5); box-shadow: 0 0 12px rgba(240,185,11,0.2); }
}

/* ══════════════════════════
   شاشة إتمام الموسم
══════════════════════════ */
#spCompleteScreen {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 50;
    background: rgba(0,0,0,0.93);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 28px;
    animation: spCompleteFadeIn 0.4s ease both;
}
@keyframes spCompleteFadeIn {
    from { opacity: 0; backdrop-filter: blur(0); }
    to   { opacity: 1; backdrop-filter: blur(6px); }
}
.sp-complete-crown {
    font-size: 4em;
    animation: spCompletePulse 1.6s ease-in-out infinite;
}
@keyframes spCompletePulse {
    0%,100% { transform: scale(1)    rotate(0deg);  filter: drop-shadow(0 0 8px #f0b90b); }
    50%      { transform: scale(1.15) rotate(-5deg); filter: drop-shadow(0 0 20px #f0b90b); }
}
.sp-complete-title {
    font-size: 1.4em;
    font-weight: 900;
    color: var(--gold);
    text-shadow: 0 0 20px rgba(240,185,11,0.5);
}
.sp-complete-sub {
    font-size: 0.8em;
    color: var(--text2);
    max-width: 270px;
    line-height: 1.7;
}
.sp-complete-icons {
    font-size: 2.2em;
    letter-spacing: 6px;
    animation: spCompleteIconsBounce 1s ease-in-out infinite alternate;
}
@keyframes spCompleteIconsBounce {
    from { transform: translateY(0); }
    to   { transform: translateY(-6px); }
}
.sp-complete-btn {
    background: linear-gradient(135deg, var(--gold), #e5a800);
    color: #000;
    border: none;
    border-radius: 18px;
    padding: 13px 36px;
    font-size: 0.95em;
    font-weight: 900;
    cursor: pointer;
    margin-top: 10px;
    font-family: 'Tajawal', sans-serif;
    box-shadow: 0 4px 20px rgba(240,185,11,0.4);
    transition: transform 0.15s ease;
}
.sp-complete-btn:active { transform: scale(0.96); }

/* ══════════════════════════
   الخط الرابط في المسار
══════════════════════════ */
.sp-track-connector {
    width: 32px;
    height: 3px;
    background: var(--border2);
    border-radius: 10px;
    flex-shrink: 0;
    align-self: center;
    margin-bottom: 28px;
    transition: background 0.3s ease;
}
.sp-track-connector.passed {
    background: linear-gradient(90deg, rgba(240,185,11,0.8), rgba(240,185,11,0.3));
}

/* ══════════════════════════
   الحالة الفارغة (لا مهام)
══════════════════════════ */
.sp-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 32px 16px;
    color: var(--text2);
    text-align: center;
}
.sp-empty-state-icon {
    font-size: 2.8em;
    opacity: 0.5;
}
.sp-empty-state-text {
    font-size: 0.8em;
    line-height: 1.6;
}

/* ══════════════════════════
   تحسينات عامة للصفحة
══════════════════════════ */

/* تأثير hover على بطاقات المهام */
.sp-task-item:not(.done):active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
}

/* ظل خفيف على شريط التقدم الكلي عند اكتماله */
.sp-progress-fill.complete {
    background: linear-gradient(90deg, #10b981, #34d399, #10b981);
    background-size: 200% 100%;
    animation: spBarShimmer 2s linear infinite;
    box-shadow: 0 0 12px rgba(16,185,129,0.4);
}

/* تأثير تحديث عداد الأيام المتبقية */
.sp-header-timer.urgent {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
    animation: none;
}

/* نقطة تنبيه حمراء على زر الموسم عند وجود جوائز غير مُستلمة */
.comp-season-btn .sp-unclaimed-dot {
    position: absolute;
    top: 10px;
    left: 14px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ef4444;
    border: 2px solid var(--bg);
    animation: spDotPulse 1.4s ease-in-out infinite;
}
@keyframes spDotPulse {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%      { transform: scale(1.3); opacity: 0.7; }
}

/* ══════════════════════════
   Responsive — شاشات صغيرة
══════════════════════════ */
@media (max-width: 380px) {
    .sp-header          { padding: 12px 14px 10px; }
    .sp-header-title    { font-size: 0.92em; }
    .sp-header-sub      { font-size: 0.64em; }
    .sp-streak-rank-bar { padding: 10px 14px; }
    .sp-progress-section{ padding: 12px 14px 10px; }
    .sp-body            { padding: 12px 14px 30px; gap: 10px; }
    .sp-node-circle     { width: 38px; height: 38px; font-size: 1.1em; }
    .sp-node-pts        { font-size: 0.52em; }
    .sp-node-label      { font-size: 0.5em; max-width: 52px; }
    .sp-task-item       { padding: 10px 12px; gap: 10px; }
    .sp-task-name       { font-size: 0.76em; }
    .sp-task-desc       { font-size: 0.62em; }
    .sp-task-pts        { font-size: 0.68em; }
    .comp-season-btn-title { font-size: 0.82em; }
    .sp-complete-title     { font-size: 1.2em;  }
}

@media (max-height: 650px) {
    .sp-progress-section { padding: 10px 18px 8px; }
    .sp-body             { padding: 10px 18px 24px; gap: 8px; }
    .sp-streak-rank-bar  { padding: 8px 18px; }
    .sp-task-item        { padding: 9px 12px; }
    .sp-node-circle      { width: 40px; height: 40px; }
}


/* ═══════════════════════════════════════════════════════════
   🏆 SEASON PASS — المرحلة الثانية: Streak + رتبة + فلاش + Bonus + صندوق + ذاكرة
═══════════════════════════════════════════════════════════ */

/* ── Header Right (timer + history btn) ── */
.sp-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
}
.sp-history-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border2);
    border-radius: 8px;
    width: 26px; height: 26px;
    font-size: 0.78em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text3);
    transition: all 0.15s ease;
}
.sp-history-btn:active { transform: scale(0.9); }

/* ══ شريط Streak + رتبة ══ */
.sp-streak-rank-bar {
    display: flex;
    align-items: stretch;
    gap: 0;
    padding: 12px 18px;
    background: transparent;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    position: relative;
}
.sp-srb-divider {
    width: 1px;
    background: var(--border2);
    margin: 4px 14px;
    flex-shrink: 0;
}

/* ── Streak Box ── */
.sp-streak-box {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    padding: 8px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border2);
    border-radius: 14px;
    transition: background 0.3s ease;
}
.sp-streak-box.streak-warm {
    background: rgba(249,115,22,0.07);
    border: 1px solid rgba(249,115,22,0.2);
}
.sp-streak-box.streak-hot {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.22);
    animation: none;
}
.sp-streak-fire {
    font-size: 1.4em;
    line-height: 1;
    flex-shrink: 0;
    animation: none;
}
.sp-streak-info { flex: 1; min-width: 0; }
.sp-streak-num {
    font-size: 1.4em;
    font-weight: 900;
    color: var(--text);
    line-height: 1;
}
.sp-streak-box.streak-warm .sp-streak-num { color: #f97316; }
.sp-streak-box.streak-hot  .sp-streak-num { color: #ef4444; }
.sp-streak-label {
    font-size: 0.62em;
    color: var(--text3);
    margin-top: 2px;
    font-weight: 500;
}
.sp-streak-shield {
    display: flex;
    align-items: center;
    gap: 2px;
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.22);
    border-radius: 7px;
    padding: 2px 6px;
    font-size: 0.62em;
    font-weight: 900;
    color: var(--accent);
}

/* ── Rank Box ── */
.sp-rank-box {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    padding: 8px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border2);
    border-radius: 14px;
    transition: all 0.3s ease;
}
.sp-rank-box.rank-bronze  { background:rgba(184,115,51,0.07);  border-color:rgba(184,115,51,0.2); }
.sp-rank-box.rank-silver  { background:rgba(176,184,200,0.07); border-color:rgba(176,184,200,0.2); }
.sp-rank-box.rank-gold    { background:rgba(240,185,11,0.07);  border-color:rgba(240,185,11,0.22); }
.sp-rank-box.rank-diamond { background:rgba(0,212,255,0.07);   border-color:rgba(0,212,255,0.22); }
.sp-rank-box.rank-legend  { background:rgba(168,85,247,0.07);  border-color:rgba(168,85,247,0.22); }
.sp-rank-box.rank-champion{
    background: rgba(240,185,11,0.08);
    border: 1px solid rgba(240,185,11,0.28);
    animation: none;
}

.sp-rank-icon { font-size: 1.4em; flex-shrink: 0; }
.sp-rank-info { flex: 1; min-width: 0; }
.sp-rank-label {
    font-size: 0.8em;
    font-weight: 900;
    color: var(--text);
    white-space: nowrap;
}
.sp-rank-sub {
    font-size: 0.58em;
    color: var(--text3);
    margin-top: 1px;
    font-weight: 500;
}
.sp-rank-next {
    font-size: 0.55em;
    color: var(--text3);
    text-align: left;
    white-space: nowrap;
}

/* ── Bonus Day Badge ── */
.sp-bonus-badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--gold);
    color: #000;
    border-radius: 20px;
    padding: 2px 12px;
    font-size: 0.68em;
    font-weight: 900;
    box-shadow: 0 2px 10px rgba(240,185,11,0.35);
    animation: bonusBadgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes bonusBadgePop {
    from { transform: translateX(-50%) scale(0); }
    to   { transform: translateX(-50%) scale(1); }
}
.sp-bonus-label { font-size: 0.9em; }

/* ══ مهمة الفلاش ══ */
.sp-flash-title {
    color: var(--text2);
}
.sp-flash-timer-badge {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #f87171;
    border-radius: 7px;
    padding: 1px 7px;
    font-size: 0.8em;
    font-weight: 900;
    font-family: monospace;
    margin-right: auto;
}
.sp-flash-card {
    background: rgba(245,158,11,0.05);
    border: 1.5px solid rgba(245,158,11,0.28);
    border-radius: 16px;
    padding: 2px;
    animation: none;
}

.sp-flash-inner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
}
.sp-flash-icon {
    font-size: 1.5em;
    flex-shrink: 0;
    animation: none;
}
.sp-flash-pts-badge {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.22);
    color: #f87171;
    border-radius: 5px;
    padding: 1px 5px;
    font-size: 0.7em;
    font-weight: 900;
}
.sp-flash-bar {
    background: linear-gradient(90deg, #f59e0b, #ef4444) !important;
}

/* ══ صندوق الموسم ══ */
.sp-chest-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(240,185,11,0.06);
    border: 1.5px solid rgba(240,185,11,0.32);
    border-radius: 18px;
    padding: 15px 17px;
    cursor: pointer;
    transition: transform 0.15s ease;
    animation: none;
}
.sp-chest-card:active { transform: scale(0.97); }
.sp-chest-icon {
    font-size: 1.8em;
    animation: none;
    flex-shrink: 0;
}
.sp-chest-info { flex: 1; }
.sp-chest-title {
    font-size: 0.88em;
    font-weight: 900;
    color: var(--gold);
}
.sp-chest-sub {
    font-size: 0.64em;
    color: var(--text3);
    margin-top: 3px;
    font-weight: 500;
}
.sp-chest-arrow {
    font-size: 1.3em;
    color: var(--text3);
}
/* شاشة فتح الصندوق */
.sp-chest-open-icon {
    font-size: 4em;
    animation: chestOpenBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes chestOpenBounce {
    from { transform: scale(0) rotate(-20deg); }
    to   { transform: scale(1) rotate(0deg); }
}
.sp-chest-open-title {
    font-size: 1.3em;
    font-weight: 900;
    color: var(--gold);
}
.sp-chest-open-reward {
    font-size: 0.9em;
    color: var(--text);
    background: rgba(240,185,11,0.1);
    border: 1px solid rgba(240,185,11,0.25);
    border-radius: 12px;
    padding: 10px 20px;
    font-weight: 700;
}

/* ══ ذاكرة المواسم ══ */
#seasonHistoryOverlay {
    animation: spSlideUp 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
}
.sp-history-card {
    background: var(--surface2);
    border: 1.5px solid var(--border2);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.sp-history-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.sp-history-num {
    font-size: 0.65em;
    color: var(--text2);
    background: var(--surface3);
    border-radius: 6px;
    padding: 2px 7px;
}
.sp-history-name {
    font-size: 0.8em;
    font-weight: 900;
    color: var(--text);
    flex: 1;
}
.sp-history-complete-badge {
    font-size: 0.6em;
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    color: #34d399;
    border-radius: 8px;
    padding: 2px 7px;
    font-weight: 700;
}
.sp-history-stats {
    display: flex;
    gap: 16px;
}
.sp-history-stat {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.72em;
    color: var(--text2);
    font-weight: 700;
}
.sp-history-bar {
    height: 5px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
}
.sp-history-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 10px;
}
.sp-history-bar-fill.complete {
    background: linear-gradient(90deg, #10b981, #34d399);
}

/* ── Responsive ── */
@media (max-width: 380px) {
    .sp-streak-num   { font-size: 1.1em; }
    .sp-rank-label   { font-size: 0.7em; }
    .sp-bonus-badge  { font-size: 0.62em; padding: 2px 8px; }
    .sp-chest-title  { font-size: 0.78em; }
    .sp-flash-card   { font-size: 0.9em; }
}


/* ═══════════════════════════════════════════════════════════
   🏆 SEASON LEADERBOARD — لوحة صدارة الموسم الأسبوعي
═══════════════════════════════════════════════════════════ */

/* زر الصدارة في شريط الأزرار */
.comp-season-lb-btn {
    border-color: rgba(240,185,11,0.3) !important;
    background: linear-gradient(135deg, rgba(240,185,11,0.07), rgba(240,185,11,0.03)) !important;
}
.comp-season-lb-btn .comp-bottom-btn-label { color: var(--gold); }

/* overlay */
#seasonLbOverlay {
    animation: spSlideUp 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
}

/* ── Header ── */
.slb-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border2);
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(240,185,11,0.06), transparent);
}
.slb-header-center { flex: 1; text-align: center; }
.slb-title {
    font-size: 0.95em;
    font-weight: 900;
    color: var(--gold);
}
.slb-sub {
    font-size: 0.62em;
    color: var(--text2);
    margin-top: 2px;
}
.slb-refresh-btn {
    background: var(--surface3);
    border: 1px solid var(--border2);
    border-radius: 10px;
    width: 34px; height: 34px;
    font-size: 0.9em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
}
.slb-refresh-btn:active { transform: rotate(180deg); }

/* ── بطاقة مرتبتي ── */
.slb-my-card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 12px 16px 0;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(240,185,11,0.1), rgba(240,185,11,0.05));
    border: 1.5px solid rgba(240,185,11,0.35);
    border-radius: 16px;
    flex-shrink: 0;
}
.slb-my-rank {
    font-size: 1.5em;
    font-weight: 900;
    color: var(--gold);
    min-width: 40px;
    text-align: center;
}
.slb-my-info { flex: 1; }
.slb-my-name {
    font-size: 0.82em;
    font-weight: 900;
    color: var(--text);
}
.slb-my-pts {
    font-size: 0.65em;
    color: var(--text2);
    margin-top: 2px;
}
.slb-my-badge { font-size: 1.6em; }

/* ── تبويبات ── */
.slb-tabs {
    display: flex;
    gap: 8px;
    padding: 12px 16px 0;
    flex-shrink: 0;
}
.slb-tab {
    flex: 1;
    background: var(--surface3);
    border: 1.5px solid var(--border2);
    color: var(--text2);
    border-radius: 10px;
    padding: 8px;
    font-size: 0.75em;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    transition: all 0.2s ease;
}
.slb-tab.active {
    background: rgba(240,185,11,0.12);
    border-color: rgba(240,185,11,0.4);
    color: var(--gold);
}

/* ── قائمة اللاعبين ── */
.slb-list-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 10px 16px 0;
    min-height: 0;
}
.slb-list-header {
    display: grid;
    grid-template-columns: 44px 1fr 32px 52px;
    gap: 4px;
    padding: 6px 10px;
    font-size: 0.6em;
    color: var(--text2);
    font-weight: 700;
    border-bottom: 1px solid var(--border2);
    flex-shrink: 0;
}
.slb-list {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 4px 0 24px;
}
.slb-list::-webkit-scrollbar { display: none; }

/* صف اللاعب */
.slb-row {
    display: grid;
    grid-template-columns: 44px 1fr 32px 52px;
    align-items: center;
    gap: 4px;
    padding: 9px 10px;
    border-radius: 12px;
    margin-bottom: 4px;
    transition: background 0.15s ease;
}
.slb-row:active { background: var(--surface3); }
.slb-row-top {
    background: var(--surface2);
    border: 1px solid var(--border2);
}
.slb-row-me {
    background: linear-gradient(135deg, rgba(240,185,11,0.12), rgba(240,185,11,0.06)) !important;
    border: 1.5px solid rgba(240,185,11,0.4) !important;
    position: sticky;
    bottom: 0;
}
.slb-row-rank {
    font-size: 0.85em;
    font-weight: 900;
    color: var(--text2);
    text-align: center;
}
.slb-row-top .slb-row-rank { font-size: 1.1em; }
.slb-row-player {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
}
.slb-row-avatar { font-size: 1.2em; flex-shrink: 0; }
.slb-row-info { min-width: 0; }
.slb-row-name {
    font-size: 0.75em;
    font-weight: 900;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.slb-row-sub {
    font-size: 0.58em;
    color: var(--text2);
    margin-top: 1px;
}
.slb-row-badge { font-size: 1.1em; text-align: center; }
.slb-row-pts {
    font-size: 0.78em;
    font-weight: 900;
    color: var(--gold);
    text-align: left;
}
.slb-me-tag {
    background: rgba(240,185,11,0.18);
    color: var(--gold);
    font-size: 0.7em;
    padding: 1px 4px;
    border-radius: 4px;
    font-weight: 700;
}
.slb-loading, .slb-empty {
    text-align: center;
    color: var(--text2);
    font-size: 0.8em;
    padding: 32px 16px;
}

/* Responsive */
@media (max-width: 380px) {
    .slb-list-header,
    .slb-row { grid-template-columns: 36px 1fr 28px 44px; }
    .slb-row-name  { font-size: 0.68em; }
    .slb-row-pts   { font-size: 0.7em; }
}


/* ═══════════════════════════════════════════════════════════
   📤 SHARE ACHIEVEMENT — مشاركة الإنجاز
═══════════════════════════════════════════════════════════ */

/* زر المشاركة في شريط التقدم */
.sp-share-btn {
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.25);
    color: var(--accent);
    border-radius: 9px;
    padding: 4px 11px;
    font-size: 0.63em;
    font-weight: 800;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    transition: all 0.15s ease;
    white-space: nowrap;
}
.sp-share-btn:active {
    transform: scale(0.94);
    background: rgba(124,58,237,0.18);
}

/* بطاقة المشاركة */
.sp-share-card {
    background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0e1a3a 100%);
    border: 2px solid rgba(240,185,11,0.4);
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(240,185,11,0.1);
}
.sp-share-card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}
.sp-share-game-logo {
    font-size: 0.75em;
    font-weight: 900;
    color: var(--gold);
}
.sp-share-season-name {
    font-size: 0.6em;
    color: var(--text2);
    text-align: left;
    max-width: 140px;
}
.sp-share-avatar {
    font-size: 2.8em;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface3);
    border-radius: 50%;
    border: 2px solid rgba(240,185,11,0.4);
}
.sp-share-player-name {
    font-size: 1em;
    font-weight: 900;
    color: var(--text);
}
.sp-share-rank {
    font-size: 0.85em;
    font-weight: 900;
    color: var(--gold);
    background: rgba(240,185,11,0.1);
    border: 1px solid rgba(240,185,11,0.25);
    border-radius: 10px;
    padding: 4px 14px;
}
.sp-share-stats-row {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    justify-content: space-around;
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 10px 8px;
}
.sp-share-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
}
.sp-share-stat-val {
    font-size: 1.1em;
    font-weight: 900;
    color: var(--gold);
}
.sp-share-stat-lbl {
    font-size: 0.58em;
    color: var(--text2);
}
.sp-share-stat-divider {
    width: 1px;
    height: 30px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
}
.sp-share-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: hidden;
}
.sp-share-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), #fff176);
    border-radius: 10px;
    transition: width 0.8s ease;
}
.sp-share-footer {
    font-size: 0.68em;
    color: var(--text2);
    font-weight: 700;
}

/* أزرار overlay المشاركة */
.sp-share-action-btn {
    flex: 1;
    border: none;
    border-radius: 14px;
    padding: 12px 8px;
    font-size: 0.82em;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    transition: transform 0.15s ease;
}
.sp-share-action-btn:active { transform: scale(0.96); }
.sp-share-copy-btn {
    background: var(--gold);
    color: #000;
}
.sp-share-close-btn {
    background: var(--surface3);
    color: var(--text2);
    border: 1px solid var(--border2);
}


/* ═══════════════════════════════════════════════════════════
   🎁 REWARD TRACK OVERLAY — مسار الجوائز المستقل
═══════════════════════════════════════════════════════════ */

/* ── زر فتح المسار في صفحة الموسم ── */
.sp-track-open-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid var(--border2);
    border-radius: 18px;
    padding: 14px 16px;
    cursor: pointer;
    text-align: right;
    font-family: 'Tajawal', sans-serif;
    transition: all 0.15s ease;
    position: relative;
    overflow: hidden;
}
.sp-track-open-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.03);
    opacity: 0;
    transition: opacity 0.15s;
}
.sp-track-open-btn:active::before { opacity: 1; }
.sp-track-open-btn:active { transform: scale(0.98); }

.sp-track-open-left {
    display: flex;
    align-items: center;
    gap: 12px;
}
.sp-track-open-icon {
    font-size: 1.5em;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(240,185,11,0.08);
    border: 1px solid rgba(240,185,11,0.2);
    border-radius: 12px;
    animation: none;
}
.sp-track-open-info { text-align: right; }
.sp-track-open-title {
    font-size: 0.88em;
    font-weight: 900;
    color: var(--text);
}
.sp-track-open-sub {
    font-size: 0.64em;
    color: var(--text3);
    margin-top: 2px;
    font-weight: 500;
    transition: color 0.3s;
}
.sp-track-open-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
.sp-track-open-arrow {
    font-size: 1.3em;
    color: var(--text3);
    opacity: 0.6;
}

/* النقاط المصغّرة في الزر */
.sp-track-mini-nodes {
    display: flex;
    gap: 4px;
    align-items: center;
}
.rto-mini-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s ease;
    flex-shrink: 0;
}
.rto-mini-dot.done {
    background: #10b981;
    border-color: #10b981;
}
.rto-mini-dot.ready {
    background: var(--gold);
    border-color: var(--gold);
    animation: none;
}

/* ── الـ Overlay الكامل ── */
#rewardTrackOverlay {
    background: #0a0a14;
    animation: rtoSlideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) both;
}
@keyframes rtoSlideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
}

/* خلفية نجوم */
.rto-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
    background:
        radial-gradient(ellipse at 20% 20%, rgba(240,185,11,0.07) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.07) 0%, transparent 60%);
}
.rto-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.25) 0%, transparent 100%),
        radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.2)  0%, transparent 100%),
        radial-gradient(1px 1px at 75% 35%, rgba(255,255,255,0.3)  0%, transparent 100%),
        radial-gradient(1px 1px at 30% 65%, rgba(255,255,255,0.15) 0%, transparent 100%),
        radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,0.2)  0%, transparent 100%),
        radial-gradient(1px 1px at 55% 85%, rgba(255,255,255,0.25) 0%, transparent 100%);
}

/* Header */
.rto-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(240,185,11,0.15);
    flex-shrink: 0;
}
.rto-back-btn {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: #fff;
    border-radius: 10px;
    width: 36px; height: 36px;
    font-size: 1.4em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.rto-header-center {
    flex: 1;
    text-align: center;
}
.rto-title {
    font-size: 1em;
    font-weight: 900;
    color: var(--gold);
    text-shadow: 0 0 12px rgba(240,185,11,0.4);
}
.rto-sub {
    font-size: 0.63em;
    color: rgba(255,255,255,0.5);
    margin-top: 2px;
}
.rto-pts-pill {
    background: rgba(240,185,11,0.15);
    border: 1px solid rgba(240,185,11,0.35);
    border-radius: 20px;
    padding: 5px 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85em;
    font-weight: 900;
    color: var(--gold);
    flex-shrink: 0;
}

/* شريط التقدم */
.rto-progress-wrap {
    position: relative;
    z-index: 1;
    padding: 10px 16px 8px;
    flex-shrink: 0;
}
.rto-progress-bg {
    position: relative;
    height: 8px;
    background: rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: visible;
}
.rto-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #f0b90b, #fff176);
    background-size: 200% 100%;
    border-radius: 20px;
    animation: rtoPBarShimmer 3s linear infinite;
    transition: width 0.7s cubic-bezier(0.34,1.2,0.64,1);
    position: relative;
}
.rto-progress-fill::after {
    content: '';
    position: absolute;
    right: -6px; top: -5px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 10px 4px rgba(240,185,11,0.5);
}
@keyframes rtoPBarShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.rto-progress-label {
    position: absolute;
    right: 8px; top: -18px;
    font-size: 0.6em;
    font-weight: 900;
    color: var(--gold);
}

/* Body القابل للتمرير */
.rto-body {
    position: relative;
    z-index: 1;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    min-height: 0;
}
.rto-body::-webkit-scrollbar { display: none; }

/* ── عقدة المحطة ── */
.rto-node {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* الخط الرابط */
.rto-connector {
    width: 3px;
    height: 28px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    margin: 0 auto;
    flex-shrink: 0;
    transition: background 0.4s ease;
}
.rto-connector.passed {
    background: linear-gradient(180deg, var(--gold) 0%, rgba(240,185,11,0.3) 100%);
    box-shadow: 0 0 6px rgba(240,185,11,0.3);
}

/* صف المحتوى */
.rto-node-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
    padding: 4px 0;
}

/* الدائرة */
.rto-circle-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}
.rto-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    border: 2.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    transition: all 0.3s ease;
    flex-shrink: 0;
}
.rto-node-claimed .rto-circle {
    background: linear-gradient(135deg, #059669, #10b981);
    border-color: #10b981;
    box-shadow: 0 0 16px rgba(16,185,129,0.4);
}
.rto-node-claimed .rto-circle-icon { color: #fff; font-size: 1.2em; font-weight: 900; }
.rto-node-reached .rto-circle {
    background: linear-gradient(135deg, rgba(240,185,11,0.25), rgba(240,185,11,0.1));
    border-color: var(--gold);
    box-shadow: 0 0 20px rgba(240,185,11,0.4);
    animation: rtoCirclePulse 1.5s ease-in-out infinite;
}
@keyframes rtoCirclePulse {
    0%,100% { box-shadow: 0 0 12px rgba(240,185,11,0.3); }
    50%      { box-shadow: 0 0 24px rgba(240,185,11,0.6); }
}
.rto-node-locked .rto-circle {
    opacity: 0.45;
    filter: grayscale(0.6);
}
.rto-pts-tag {
    font-size: 0.58em;
    font-weight: 900;
    color: rgba(255,255,255,0.45);
    white-space: nowrap;
}
.rto-node-claimed .rto-pts-tag { color: #10b981; }
.rto-node-reached .rto-pts-tag { color: var(--gold); }

/* البطاقة */
.rto-card {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s ease;
    min-width: 0;
}
.rto-node-claimed .rto-card {
    background: rgba(16,185,129,0.07);
    border-color: rgba(16,185,129,0.25);
}
.rto-node-reached .rto-card {
    background: rgba(240,185,11,0.07);
    border-color: rgba(240,185,11,0.3);
    box-shadow: 0 2px 12px rgba(240,185,11,0.1);
}
.rto-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
}
.rto-card-label {
    font-size: 0.82em;
    font-weight: 900;
    color: #fff;
    flex: 1;
    line-height: 1.3;
}
.rto-node-locked .rto-card-label { color: rgba(255,255,255,0.45); }

/* بادجات الحالة */
.rto-card-state-badge {
    font-size: 0.6em;
    font-weight: 900;
    border-radius: 8px;
    padding: 3px 8px;
    white-space: nowrap;
    flex-shrink: 0;
}
.rto-badge-claimed {
    background: rgba(16,185,129,0.15);
    color: #34d399;
    border: 1px solid rgba(16,185,129,0.3);
}
.rto-badge-reached {
    background: rgba(240,185,11,0.15);
    color: var(--gold);
    border: 1px solid rgba(240,185,11,0.35);
    animation: rtoBadgePulse 1.4s ease-in-out infinite;
}
@keyframes rtoBadgePulse {
    0%,100% { box-shadow: none; }
    50%      { box-shadow: 0 0 8px rgba(240,185,11,0.3); }
}
.rto-badge-locked {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.35);
    border: 1px solid rgba(255,255,255,0.08);
}

/* زر الاستلام */
.rto-claim-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--gold), #e5a800);
    color: #000;
    border: none;
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 0.78em;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    width: 100%;
    animation: rtoClaimPulse 1.3s ease-in-out infinite;
    transition: transform 0.15s ease;
}
.rto-claim-btn:active { transform: scale(0.96); }
@keyframes rtoClaimPulse {
    0%,100% { box-shadow: 0 0 0 rgba(240,185,11,0); }
    50%      { box-shadow: 0 4px 16px rgba(240,185,11,0.45); }
}
.rto-claim-icon { font-size: 1.1em; }

/* شريط التقدم داخل البطاقة */
.rto-mini-prog {
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
}
.rto-mini-fill {
    height: 100%;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    transition: width 0.5s ease;
}

/* Responsive */
@media (max-width: 380px) {
    .rto-circle      { width: 44px; height: 44px; font-size: 1.2em; }
    .rto-card-label  { font-size: 0.75em; }
    .rto-claim-btn   { font-size: 0.72em; padding: 8px 12px; }
    .rto-card        { padding: 10px 11px; }
}


/* ═══════════════════════════════════════════════════════════
   🏆 MATH PASS — بادج MP
═══════════════════════════════════════════════════════════ */

/* بادج MP في الزر */
.comp-season-btn-title-row {
    display: flex;
    align-items: center;
    gap: 5px;
}
.comp-season-mp-badge {
    background: linear-gradient(135deg, #f0b90b, #e5a800);
    color: #000;
    font-size: 0.65em;
    font-weight: 900;
    padding: 1px 6px;
    border-radius: 5px;
    letter-spacing: 0.5px;
    font-family: 'Tajawal', sans-serif;
    flex-shrink: 0;
}

/* بادج MP في header الصفحة */
.sp-mp-badge-header {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--gold);
    color: #000;
    font-size: 0.58em;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 5px;
    letter-spacing: 1.5px;
    vertical-align: middle;
}

/* تعديل عنوان الصفحة ليتسع للبادج */
.sp-header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}


/* ═══════════════════════════════════════════════════════════
   🏆 HEADER MP BUTTON — زر MP الثابت في الهيدر
═══════════════════════════════════════════════════════════ */
.header-mp-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: linear-gradient(135deg, #1a0a2e, #0e1a3a);
    border: 1.5px solid rgba(240,185,11,0.5);
    border-radius: 12px;
    padding: 5px 9px;
    cursor: pointer;
    flex-shrink: 0;
    min-width: 44px;
    box-shadow: 0 0 10px rgba(240,185,11,0.15);
    transition: all 0.18s ease;
    position: relative;
    overflow: hidden;
}
.header-mp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(240,185,11,0.08), transparent);
    opacity: 0;
    transition: opacity 0.2s;
}
.header-mp-btn:active::before { opacity: 1; }
.header-mp-btn:active { transform: scale(0.94); }

.header-mp-label {
    font-size: 0.72em;
    font-weight: 900;
    color: var(--gold);
    letter-spacing: 1px;
    line-height: 1;
    font-family: 'Tajawal', sans-serif;
}
.header-mp-bar-wrap {
    width: 32px;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
}
.header-mp-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), #fff176);
    border-radius: 10px;
    transition: width 0.5s ease;
}

/* نقطة تنبيه حمراء على زر MP عند وجود جائزة */
.header-mp-btn .mp-alert-dot {
    position: absolute;
    top: -3px;
    left: -3px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    border: 1.5px solid var(--bg);
    animation: mpAlertPulse 1.3s ease-in-out infinite;
}
@keyframes mpAlertPulse {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%      { transform: scale(1.4); opacity: 0.7; }
}


/* ═══ زر لائحة الصدارة داخل MP ═══ */
.sp-lb-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 15px 16px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid var(--border2);
    border-radius: 18px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    text-align: right;
    transition: all 0.15s ease;
    margin-top: 2px;
}
.sp-lb-btn:active {
    transform: scale(0.97);
    background: rgba(255,255,255,0.06);
}
.sp-lb-btn-icon {
    font-size: 1.5em;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(240,185,11,0.08);
    border: 1px solid rgba(240,185,11,0.2);
    border-radius: 12px;
}
.sp-lb-btn-info { flex: 1; }
.sp-lb-btn-title {
    font-size: 0.88em;
    font-weight: 900;
    color: var(--text);
}
.sp-lb-btn-sub {
    font-size: 0.64em;
    color: var(--text3);
    margin-top: 3px;
    font-weight: 500;
}
.sp-lb-btn-arrow {
    font-size: 1.3em;
    color: var(--text3);
    font-weight: 900;
    opacity: 0.6;
}

/* ═══ تأكيد: seasonPassOverlay و sub-overlays تملأ الشاشة كاملة ═══ */
#seasonPassOverlay,
#seasonLbOverlay,
#rewardTrackOverlay,
#seasonHistoryOverlay,
#shareAchievementOverlay,
#spChestOpenScreen {
    /* safe-area للشاشات التي بها notch */
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
}


/* ═══════════════════════════════════════════════════════════
   🪪 الملف الشخصي للاعب — Player Profile Modal
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════ */

/* الخلفية الداكنة */
.pp-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: ppBackdropIn 0.2s ease;
}

@keyframes ppBackdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* البطاقة الرئيسية */
.pp-modal {
    position: relative;
    width: 100%;
    max-width: 360px;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: linear-gradient(160deg, #0e0b1f 0%, #130d28 50%, #0b1525 100%);
    border: 1.5px solid rgba(240, 185, 11, 0.35);
    border-radius: 24px;
    padding: 28px 20px 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15);
    animation: ppCardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes ppCardIn {
    from { opacity: 0; transform: scale(0.88) translateY(20px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
}

/* زر الإغلاق */
.pp-close-btn {
    position: absolute;
    top: 14px;
    left: 14px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.08);
    color: var(--text2, #aaa);
    font-size: 0.85em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
}
.pp-close-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }

/* ── رأس البطاقة ── */
.pp-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.pp-avatar-ring {
    width: 78px;
    height: 78px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0b90b, #7c3aed);
    padding: 3px;
    box-shadow: 0 0 20px rgba(240,185,11,0.35);
    animation: ppRingPulse 2.5s ease-in-out infinite;
}

@keyframes ppRingPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(240,185,11,0.35); }
    50%       { box-shadow: 0 0 32px rgba(240,185,11,0.6);  }
}

.pp-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--bg2, #1a1a2e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4em;
}

.pp-name {
    font-size: 1.25em;
    font-weight: 800;
    color: #fff;
    text-align: center;
    letter-spacing: 0.02em;
}

.pp-level-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(90deg, rgba(240,185,11,0.15), rgba(124,58,237,0.15));
    border: 1px solid rgba(240,185,11,0.4);
    border-radius: 20px;
    padding: 3px 14px;
}

.pp-level-lbl {
    font-size: 0.72em;
    color: var(--text2, #aaa);
    font-weight: 600;
}

.pp-level-val {
    font-size: 1em;
    font-weight: 900;
    color: #f0b90b;
}

/* ── قسم الألقاب ── */
.pp-titles-section {
    margin-bottom: 18px;
}

.pp-section-label {
    font-size: 0.78em;
    font-weight: 700;
    color: var(--text2, #aaa);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
}

.pp-titles-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.pp-title-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(124,58,237,0.18);
    border: 1px solid rgba(124,58,237,0.4);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 0.76em;
    color: #c4b5fd;
    font-weight: 600;
    transition: transform 0.15s;
}
.pp-title-chip:hover { transform: scale(1.05); }

.pp-no-titles {
    font-size: 0.78em;
    color: var(--text3, #666);
    font-style: italic;
}

/* ── شبكة الإحصائيات ── */
.pp-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
}

.pp-stat-card {
    border-radius: 14px;
    padding: 14px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.2s;
}
.pp-stat-card:hover { transform: translateY(-2px); }

.pp-stat-correct { background: rgba(16,185,129,0.10); border-color: rgba(16,185,129,0.25); }
.pp-stat-wrong   { background: rgba(239,68,68,0.10);  border-color: rgba(239,68,68,0.25);  }
.pp-stat-streak  { background: rgba(251,146,60,0.10); border-color: rgba(251,146,60,0.25); }
.pp-stat-score   { background: rgba(240,185,11,0.10); border-color: rgba(240,185,11,0.25); }

.pp-stat-icon { font-size: 1.3em; }

.pp-stat-val {
    font-size: 1.35em;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.01em;
}

.pp-stat-lbl {
    font-size: 0.68em;
    color: var(--text2, #aaa);
    font-weight: 600;
    text-align: center;
}

/* ── شريط الدقة ── */
.pp-accuracy-section {
    margin-top: 4px;
}

.pp-accuracy-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78em;
    color: var(--text2, #aaa);
    font-weight: 600;
    margin-bottom: 6px;
}

.pp-accuracy-pct {
    font-size: 1em;
    font-weight: 800;
    color: #10b981;
}

.pp-accuracy-bar-bg {
    width: 100%;
    height: 8px;
    border-radius: 99px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
}

.pp-accuracy-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #10b981, #34d399);
    transition: width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 8px rgba(16,185,129,0.5);
}

/* ── حالة التحميل ── */
.pp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    color: var(--text2, #aaa);
    font-size: 0.85em;
}

.pp-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(240,185,11,0.2);
    border-top-color: #f0b90b;
    border-radius: 50%;
    animation: ppSpin 0.7s linear infinite;
}

@keyframes ppSpin {
    to { transform: rotate(360deg); }
}

/* ── تأثير hover على صفوف لائحة الصدارة ── */
.lb-row:not(.lb-header) {
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
}
.lb-row:not(.lb-header):hover {
    background: rgba(240,185,11,0.08);
    transform: translateX(-2px);
}
.lb-row:not(.lb-header):active {
    background: rgba(240,185,11,0.15);
    transform: scale(0.98);
}


/* ═══════════════════════════════════════════════════════════
   🆕 المرحلة الثالثة — تحسينات الملف الشخصي
═══════════════════════════════════════════════════════════════ */

/* ── شارة "ملفي الشخصي" ── */
.pp-self-badge {
    text-align: center;
    font-size: 0.72em;
    font-weight: 700;
    color: #67e8f9;
    background: rgba(6,182,212,0.12);
    border: 1px solid rgba(6,182,212,0.35);
    border-radius: 20px;
    padding: 4px 14px;
    margin: 0 auto 12px;
    width: fit-content;
    letter-spacing: 0.05em;
}

/* ── قسم المقارنة ── */
.pp-compare-section {
    margin-top: 16px;
    animation: ppFadeIn 0.3s ease;
}

@keyframes ppFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
}

.pp-compare-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* رأس المقارنة */
.pp-cmp-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    font-size: 0.78em;
    font-weight: 800;
    color: var(--text2, #aaa);
    padding: 0 4px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4px;
}
.pp-cmp-header span:first-child { text-align: right; color: #67e8f9; }
.pp-cmp-header span:last-child  { text-align: left;  color: #f0b90b; }

/* صف مقارنة واحد */
.pp-cmp-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    padding: 8px 10px;
    border: 1px solid rgba(255,255,255,0.05);
}

.pp-cmp-mine {
    text-align: right;
    font-size: 0.9em;
    font-weight: 700;
    color: #94a3b8;
    transition: color 0.2s;
}

.pp-cmp-his {
    text-align: left;
    font-size: 0.9em;
    font-weight: 700;
    color: #94a3b8;
    transition: color 0.2s;
}

.pp-cmp-winner {
    color: #f0b90b !important;
    font-size: 1em !important;
}
.pp-cmp-mine.pp-cmp-winner { color: #67e8f9 !important; }

.pp-cmp-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 0.65em;
    color: var(--text2, #aaa);
    font-weight: 600;
    text-align: center;
    min-width: 60px;
}

.pp-cmp-icon { font-size: 1.2em; }

/* ── زر "تحدّه الآن" ── */
.pp-challenge-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 18px;
    padding: 14px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    font-size: 1em;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(124,58,237,0.4);
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    letter-spacing: 0.02em;
}

.pp-challenge-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(124,58,237,0.55);
    background: linear-gradient(135deg, #6d28d9, #9333ea);
}

.pp-challenge-btn:active {
    transform: scale(0.97);
    box-shadow: 0 2px 10px rgba(124,58,237,0.3);
}

.pp-challenge-icon {
    font-size: 1.2em;
    animation: ppSwordPulse 1.5s ease-in-out infinite;
}

@keyframes ppSwordPulse {
    0%, 100% { transform: rotate(0deg);   }
    25%       { transform: rotate(-15deg); }
    75%       { transform: rotate(15deg);  }
}

/* ── تحسين hover على صفوف لائحة الصدارة ── */
.lb-row:not(.lb-header) {
    cursor: pointer;
    transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
    position: relative;
}

.lb-row:not(.lb-header)::after {
    content: '›';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%) translateX(4px);
    opacity: 0;
    color: var(--gold, #f0b90b);
    font-size: 1.2em;
    font-weight: 900;
    transition: opacity 0.15s, transform 0.15s;
}

.lb-row:not(.lb-header):hover {
    background: rgba(240,185,11,0.07);
    transform: translateX(-3px);
    box-shadow: inset 3px 0 0 rgba(240,185,11,0.5);
}

.lb-row:not(.lb-header):hover::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
}

.lb-row:not(.lb-header):active {
    transform: scale(0.985);
    background: rgba(240,185,11,0.13);
}


/* ═══════════════════════════════════════════════════════════
   🆕 المرحلة الرابعة — إطار + ترتيب + مشاركة + إشعار
   © 2026 Hassan Odaey
═══════════════════════════════════════════════════════════════ */

/* ── حاوية الـ avatar مع الإطار ── */
.pp-avatar-wrapper {
    position: relative;
    width: 82px;
    height: 82px;
    margin: 0 auto;
}

.pp-avatar-ring {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0b90b, #7c3aed);
    padding: 3px;
    box-shadow: 0 0 20px rgba(240,185,11,0.35);
    animation: ppRingPulse 2.5s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pp-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--bg2, #1a1a2e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2em;
}

/* إطار SVG يُرسم فوق الـ ring */
.pp-frame-svg {
    position: absolute;
    inset: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    pointer-events: none;
    z-index: 2;
}

/* ── صف badges المستوى + الترتيب ── */
.pp-header-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

/* شارة الترتيب */
.pp-rank-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(90deg, rgba(240,185,11,0.18), rgba(251,146,60,0.18));
    border: 1px solid rgba(251,146,60,0.45);
    border-radius: 20px;
    padding: 3px 12px;
    animation: ppFadeIn 0.4s ease;
}

.pp-rank-icon { font-size: 0.9em; }

.pp-rank-val {
    font-size: 0.95em;
    font-weight: 900;
    color: #fb923c;
}

/* ── زر المشاركة ── */
.pp-share-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(240,185,11,0.35);
    background: rgba(240,185,11,0.10);
    color: #f0b90b;
    font-size: 1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.15s;
}
.pp-share-btn:hover {
    background: rgba(240,185,11,0.22);
    transform: scale(1.1);
}
.pp-share-btn:active { transform: scale(0.95); }

/* ── شريط إشعار التحدي ── */
#ppChallengeNotif {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #0e0b1f, #1a0a2e);
    border: 1.5px solid rgba(124,58,237,0.6);
    border-radius: 20px;
    padding: 10px 14px;
    box-shadow: 0 8px 32px rgba(124,58,237,0.4);
    max-width: 90vw;
    animation: ppNotifSlideDown 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor: pointer;
}

@keyframes ppNotifSlideDown {
    from { opacity:0; transform: translateX(-50%) translateY(-20px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0);     }
}

.pp-notif-icon { font-size: 1.3em; flex-shrink: 0; }

.pp-notif-text {
    font-size: 0.82em;
    font-weight: 700;
    color: #e2d9f3;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pp-notif-accept {
    background: linear-gradient(90deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 5px 12px;
    font-size: 0.76em;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: transform 0.15s;
}
.pp-notif-accept:hover { transform: scale(1.05); }

.pp-notif-dismiss {
    background: transparent;
    border: none;
    color: var(--text2, #aaa);
    font-size: 0.9em;
    cursor: pointer;
    padding: 2px 4px;
    flex-shrink: 0;
    border-radius: 50%;
    transition: color 0.15s;
}
.pp-notif-dismiss:hover { color: #fff; }
   

/* ═══════════════════════════════════════════════════════
   🏆 Overlay الألقاب الموسمية — Competition Titles
═══════════════════════════════════════════════════════ */

/* زر الألقاب في شريط الأسفل — لون ذهبي مميز */
.comp-titles-btn .comp-bottom-btn-icon { color: #f0b90b; }
.comp-titles-btn .comp-bottom-btn-label { color: #f0b90b; font-weight: 900; }
.comp-titles-btn { border-color: rgba(240,185,11,0.25); }
.comp-titles-btn:active { background: rgba(240,185,11,0.08); }

/* شارة الموسم في أعلى الـ overlay */
.ct-season-badge {
    display: inline-block;
    background: linear-gradient(135deg, rgba(240,185,11,0.15), rgba(124,58,237,0.15));
    border: 1.5px solid rgba(240,185,11,0.35);
    border-radius: 30px;
    padding: 8px 18px;
    font-size: 0.82em;
    font-weight: 900;
    color: var(--gold);
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 14px;
}

/* بطاقة اللقب النشط */
.ct-active-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, rgba(240,185,11,0.1), rgba(124,58,237,0.08));
    border: 1.5px solid rgba(240,185,11,0.4);
    border-radius: 18px;
    padding: 16px;
}
.ct-active-icon { font-size: 2.4em; flex-shrink: 0; }
.ct-active-info { flex: 1; }
.ct-active-name {
    font-size: 0.92em;
    font-weight: 900;
    color: var(--gold);
    margin-bottom: 4px;
}
.ct-active-desc {
    font-size: 0.65em;
    color: var(--text2);
    line-height: 1.4;
    margin-bottom: 6px;
}
.ct-active-expiry {
    font-size: 0.62em;
    color: var(--text3);
}

/* بطاقة "لا يوجد لقب" */
.ct-no-title {
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 18px;
    padding: 18px;
    text-align: center;
}
.ct-no-title-icon  { font-size: 2em; margin-bottom: 8px; }
.ct-no-title-text  { font-size: 0.82em; font-weight: 900; color: var(--text); margin-bottom: 6px; }
.ct-no-title-hint  { font-size: 0.63em; color: var(--text2); line-height: 1.5; }

/* صندوق التتابع + شريط التقدم */
.ct-streak-box {
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 12px;
}
.ct-streak-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.ct-streak-label { font-size: 0.72em; color: var(--text2); }
.ct-streak-val   { font-size: 0.78em; font-weight: 900; color: var(--gold); }
.ct-progress-track {
    height: 8px;
    background: var(--surface3);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 8px;
}
.ct-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f0b90b, #7c3aed);
    border-radius: 999px;
    transition: width 0.5s ease;
}
.ct-next-target { font-size: 0.62em; color: var(--text3); text-align: right; }

/* ملاحظة المعلومات */
.ct-info-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: rgba(6,182,212,0.08);
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 16px;
    font-size: 0.67em;
    color: var(--text2);
    line-height: 1.5;
}
.ct-info-icon { font-size: 1.1em; flex-shrink: 0; margin-top: 1px; }
.ct-info-note strong { color: var(--accent2); }

/* تسمية القسم */
.ct-section-label {
    font-size: 0.72em;
    font-weight: 900;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
}

/* صف لقب واحد */
.ct-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface2);
    border: 1.5px solid var(--border2);
    border-radius: 16px;
    padding: 14px 12px;
    transition: border-color 0.2s;
}
.ct-title-row.ct-earned       { border-color: rgba(240,185,11,0.4); background: rgba(240,185,11,0.04); }
.ct-title-row.ct-active-title { box-shadow: 0 0 0 2px var(--gold); }

.ct-title-icon-wrap {
    width: 46px; height: 46px;
    border-radius: 14px;
    border: 1.5px solid;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.ct-title-icon { font-size: 1.7em; }

.ct-title-body { flex: 1; min-width: 0; }
.ct-title-name {
    font-size: 0.82em;
    font-weight: 900;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ct-title-desc {
    font-size: 0.62em;
    color: var(--text3);
    line-height: 1.4;
    margin-bottom: 6px;
}
.ct-title-mini-track {
    height: 4px;
    background: var(--surface3);
    border-radius: 999px;
    overflow: hidden;
}
.ct-title-mini-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.4s ease;
    opacity: 0.7;
}

.ct-title-badge-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}
.ct-earned-badge {
    font-size: 0.58em;
    font-weight: 900;
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid;
    white-space: nowrap;
}
.ct-days-badge {
    font-size: 0.78em;
    font-weight: 900;
    color: var(--text2);
    text-align: center;
    line-height: 1.1;
}
.ct-days-badge span {
    display: block;
    font-size: 0.72em;
    color: var(--text3);
    font-weight: 700;
}
.ct-active-badge {
    font-size: 0.55em;
    font-weight: 900;
    color: var(--gold);
    background: rgba(240,185,11,0.15);
    border: 1px solid rgba(240,185,11,0.3);
    border-radius: 6px;
    padding: 2px 6px;
    white-space: nowrap;
}
