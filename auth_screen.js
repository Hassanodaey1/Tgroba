/* ═══════════════════════════════════════════════════════════════
   AUTH SCREEN — شاشة تسجيل الدخول الاحترافية
   HO Math v8 — © 2026 Hassan Odaey
   ═══════════════════════════════════════════════════════════════ */

/* ─── رموز الرياضيات العائمة ─── */
(function _spawnAuthSymbols() {
    window.addEventListener('load', function() {
        const container = document.getElementById('authFloatingMath');
        if (!container) return;
        const symbols = ['÷','×','−','+','=','²','√','π','∑','∞','%','³','½','¼'];
        for (let i = 0; i < 18; i++) {
            const el = document.createElement('div');
            el.className = 'auth-math-symbol';
            el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.cssText = [
                'left:'    + (Math.random() * 95) + '%',
                'animation-duration:' + (8 + Math.random() * 12) + 's',
                'animation-delay:'    + (Math.random() * 10) + 's',
                'font-size:'          + (0.9 + Math.random() * 1.8) + 'em',
                'opacity: 0'
            ].join(';');
            container.appendChild(el);
        }
    });
})();

/* ─── تبديل التبويبات ─── */
function authScreenTab(tab) {
    const tabs   = ['login','register','serial','reset'];
    const panels = { login:'apLogin', register:'apReg', serial:'apSerial', reset:'apReset' };
    const btns   = { login:'atLogin', register:'atReg', serial:'atSerial' };

    tabs.forEach(t => {
        const p = document.getElementById(panels[t]);
        if (p) p.classList.remove('active');
        const b = document.getElementById(btns[t]);
        if (b) b.classList.remove('active');
    });

    const target = document.getElementById(panels[tab]);
    if (target) target.classList.add('active');
    const btn = document.getElementById(btns[tab]);
    if (btn) btn.classList.add('active');

    /* إخفاء رسائل الخطأ عند التبديل */
    ['alError','arError','asError','arsetError','arsetMsg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('show');
    });
}

/* ─── مساعد: تعيين حالة الزر (loading / normal) ─── */
function _authBtnState(btnId, loading, text) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
        btn.classList.add('loading');
        btn.innerHTML = '<span class="auth-spinner"></span>';
    } else {
        btn.classList.remove('loading');
        btn.innerHTML = '<span>' + text + '</span>';
    }
}

/* ─── مساعد: عرض خطأ ─── */
function _authShowError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
}
function _authHideError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

/* ═══ تسجيل الدخول ═══ */
function authScreenLogin() {
    const email = (document.getElementById('alEmail')?.value || '').trim();
    const pass  = (document.getElementById('alPass')?.value  || '').trim();
    _authHideError('alError');

    if (!email || !pass) { _authShowError('alError', '⚠️ أدخل الإيميل وكلمة المرور'); return; }

    _authBtnState('alBtn', true);
    authLogin(email, pass, function(res) {
        _authBtnState('alBtn', false, 'تسجيل الدخول');
        if (res.error) { _authShowError('alError', '❌ ' + res.error); return; }

        /* مسجّل دخول — حاول استعادة البيانات من السحابة */
        st.linkedEmail = email;
        if (st.serialNumber) linkSerialToUid(res.user.uid, st.serialNumber);

        loadFromFirebaseByUid(res.user.uid, function(cloudData) {
            if (cloudData) {
                const cloudLv = cloudData.level || 1;
                if (cloudLv > (st.level || 1) || (!st.serialNumber && cloudData.serialNumber)) {
                    Object.assign(st, sanitizeState(cloudData));
                }
            }
            st.linkedEmail = email;
            saveSt();
            window._authUser = res.user;
            _launchGame();
        });
    });
}

/* ═══ إنشاء حساب جديد ═══ */
function authScreenRegister() {
    const email = (document.getElementById('arEmail')?.value  || '').trim();
    const pass  = (document.getElementById('arPass')?.value   || '').trim();
    const pass2 = (document.getElementById('arPass2')?.value  || '').trim();
    _authHideError('arError');

    if (!email || !pass) { _authShowError('arError', '⚠️ أدخل الإيميل وكلمة المرور'); return; }
    if (pass !== pass2)   { _authShowError('arError', '⚠️ كلمتا المرور غير متطابقتين'); return; }
    if (pass.length < 6)  { _authShowError('arError', '⚠️ كلمة المرور قصيرة (6 أحرف على الأقل)'); return; }

    _authBtnState('arBtn', true);
    authRegister(email, pass, function(res) {
        _authBtnState('arBtn', false, 'إنشاء الحساب');
        if (res.error) { _authShowError('arError', '❌ ' + res.error); return; }

        st.linkedEmail = email;
        /* إذا كان عنده رقم تسلسلي قديم → اربطه */
        if (st.serialNumber) linkSerialToUid(res.user.uid, st.serialNumber);
        saveSt();
        window._authUser = res.user;
        _launchGame();
    });
}

/* ═══ استعادة بالرقم التسلسلي ═══ */
function authScreenRestoreSerial() {
    const serial = (document.getElementById('asSerial')?.value || '').trim();
    _authHideError('asError');

    if (!serial) { _authShowError('asError', '⚠️ أدخل الرقم التسلسلي'); return; }

    _authBtnState('asBtn', true);

    /* ① محلياً أولاً */
    const localData = loadSerialBackup(serial);
    if (localData) {
        Object.assign(st, sanitizeState(localData));
        saveSt();
        _authBtnState('asBtn', false, 'استعادة الحساب');
        _launchGame();
        return;
    }

    /* ② Firebase */
    loadFromFirebase(serial, function(cloudData) {
        _authBtnState('asBtn', false, 'استعادة الحساب');
        if (!cloudData) { _authShowError('asError', '⚠️ لم يُعثر على حساب بهذا الرقم'); return; }
        Object.assign(st, sanitizeState(cloudData));
        saveSt();
        _launchGame();
    });
}

/* ═══ إعادة تعيين كلمة المرور ═══ */
function authScreenReset() {
    const email = (document.getElementById('arsetEmail')?.value || '').trim();
    _authHideError('arsetError');
    const msgEl = document.getElementById('arsetMsg');
    if (msgEl) msgEl.classList.remove('show');

    if (!email) { _authShowError('arsetError', '⚠️ أدخل إيميلك'); return; }

    _authBtnState('arsetBtn', true);
    authResetPassword(email, function(res) {
        _authBtnState('arsetBtn', false, 'إرسال رابط الاستعادة');
        if (res.error) { _authShowError('arsetError', '❌ ' + res.error); return; }
        if (msgEl) { msgEl.textContent = '✅ تم إرسال الرابط — تحقق من بريدك الإلكتروني'; msgEl.classList.add('show'); }
    });
}

/* ═══ الدخول كضيف ═══ */
function authScreenGuest() {
    /* ضيف: لا حساب — نلعب بالرقم التسلسلي كالمعتاد */
    _launchGame();
}

/* ═══ إظهار شاشة Auth ═══ */
function showAuthScreen() {
    const screen = document.getElementById('authScreen');
    if (!screen) { _launchGame(); return; }
    screen.style.display = 'flex';
    screen.classList.remove('hidden');
    /* ابدأ بتبويب الدخول */
    authScreenTab('login');
}

/* ═══ إطلاق اللعبة (إخفاء Auth + تشغيل كل شيء) ═══ */
function _launchGame() {
    const screen = document.getElementById('authScreen');
    if (screen) {
        screen.classList.add('hidden');
        setTimeout(() => { screen.style.display = 'none'; }, 500);
    }
    try { checkDailyLoginBonus(); } catch (e) {}
    try { updateUI(); } catch (e) {}
    try { loadProfileForm(); } catch (e) {}
    try { updateSerialNumberDisplay(); } catch (e) {}
    try { applyProfilePhoto(); } catch (e) {}
}
