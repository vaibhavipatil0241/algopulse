/**
 * AlgoPulse – Authentication & Profile UI (Feature 1)
 *
 * Handles: login / register modal, header user chip, profile modal
 * (edit name, change password, logout), toasts, and session restore on page load.
 *
 * Other features can use the public API at the bottom:
 *   AlgoPulseAuth.isLoggedIn()            -> boolean
 *   AlgoPulseAuth.getUser()               -> user object or null
 *   AlgoPulseAuth.requireLogin('msg')     -> true if logged in, else opens login + returns false
 *   AlgoPulseAuth.onChange(cb)            -> cb(user) whenever login state changes
 *   AlgoPulseAuth.toast('msg','success')  -> show a toast
 */
(function () {
  'use strict';

  const api = window.ApiClient;
  const $ = (id) => document.getElementById(id);

  const els = {
    // header
    btnOpenLogin: $('btn-open-login'),
    btnOpenRegister: $('btn-open-register'),
    userChip: $('btn-user-chip'),
    chipAvatar: $('user-chip-avatar'),
    chipName: $('user-chip-name'),
    toastContainer: $('toast-container'),
    // auth modal
    authModal: $('auth-modal'),
    btnCloseAuth: $('btn-close-auth'),
    authTabs: document.querySelectorAll('.auth-tab'),
    loginForm: $('login-form'),
    loginAlert: $('login-alert'),
    loginIdentifier: $('login-identifier'),
    loginPassword: $('login-password'),
    loginSubmit: $('btn-login-submit'),
    registerForm: $('register-form'),
    registerAlert: $('register-alert'),
    regUsername: $('reg-username'),
    regEmail: $('reg-email'),
    regName: $('reg-fullname'),
    regPassword: $('reg-password'),
    regConfirm: $('reg-confirm'),
    registerSubmit: $('btn-register-submit'),
    // profile modal
    profileModal: $('profile-modal'),
    btnCloseProfile: $('btn-close-profile'),
    btnProfileClose2: $('btn-profile-close'),
    btnLogout: $('btn-logout'),
    profileAvatar: $('profile-avatar'),
    profileDisplayName: $('profile-display-name'),
    profileMeta: $('profile-meta'),
    profileForm: $('profile-form'),
    profileAlert: $('profile-alert'),
    profileFullName: $('profile-fullname'),
    profileSave: $('btn-profile-save'),
    passwordForm: $('password-form'),
    passwordAlert: $('password-alert'),
    curPassword: $('cur-password'),
    newPassword: $('new-password'),
    newConfirm: $('new-confirm'),
    passwordSubmit: $('btn-password-submit')
  };

  // If the markup is missing, do nothing instead of breaking the visualizer.
  if (!api || !els.authModal || !els.profileModal || !els.btnOpenLogin) {
    console.warn('[AlgoPulse] Auth UI markup or ApiClient not found; auth disabled.');
    return;
  }

  const state = { user: null };
  const listeners = new Set();

  // ------------------------------------------------------------------
  // Small UI helpers
  // ------------------------------------------------------------------
  function toast(message, type = 'info', duration = 4000) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message; // textContent: never inject server text as HTML
    els.toastContainer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 250);
    }, duration);
  }

  function setLoading(button, loading, loadingText) {
    const label = button.querySelector('.btn-label');
    const spinner = button.querySelector('.btn-spinner');
    button.disabled = loading;
    if (spinner) spinner.hidden = !loading;
    if (!label) return;
    if (loading) {
      button.dataset.label = label.textContent;
      label.textContent = loadingText;
    } else if (button.dataset.label) {
      label.textContent = button.dataset.label;
      delete button.dataset.label;
    }
  }

  function showAlert(el, message, type = 'error') {
    el.textContent = message;
    el.className = `auth-alert ${type}`;
    el.hidden = false;
  }

  function clearAlert(el) {
    el.hidden = true;
    el.textContent = '';
  }

  function setFieldError(input, message) {
    const errEl = $(`err-${input.id}`);
    input.classList.toggle('invalid', !!message);
    if (errEl) {
      errEl.textContent = message || '';
      errEl.hidden = !message;
    }
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.input-field').forEach((input) => setFieldError(input, ''));
  }

  let lastFocused = null;
  function openModal(modal, focusEl) {
    lastFocused = document.activeElement;
    modal.classList.add('active');
    if (focusEl) setTimeout(() => focusEl.focus(), 50);
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // The visualizer has global keyboard shortcuts (Space, R, M, arrows...).
  // Keep keystrokes inside our dialogs from triggering them.
  [els.authModal, els.profileModal].forEach((modal) => {
    modal.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') closeModal(modal);
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal); // click on the dark backdrop
    });
  });

  // ------------------------------------------------------------------
  // Validation (mirrors the server rules for instant feedback;
  // the server still validates everything again)
  // ------------------------------------------------------------------
  const USERNAME_RE = /^[A-Za-z0-9_]{3,30}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function passwordProblem(pw) {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password needs at least one letter and one number.';
    return '';
  }

  // ------------------------------------------------------------------
  // Session state
  // ------------------------------------------------------------------
  function initialOf(user) {
    return ((user.full_name || user.username || '?').trim()[0] || '?').toUpperCase();
  }

  function renderAuthUI() {
    const user = state.user;
    els.btnOpenLogin.hidden = !!user;
    els.btnOpenRegister.hidden = !!user;
    els.userChip.hidden = !user;
    if (user) {
      els.chipName.textContent = user.username;
      els.chipAvatar.textContent = initialOf(user);
    }
  }

  function setUser(user) {
    state.user = user;
    renderAuthUI();
    listeners.forEach((cb) => { try { cb(user); } catch (e) { console.error(e); } });
    window.dispatchEvent(new CustomEvent('algopulse:auth-changed', { detail: { user } }));
  }

  async function fetchCurrentUser() {
    return api.get('/users/me');
  }

  async function restoreSession() {
    if (!api.Token.get()) { renderAuthUI(); return; }
    try {
      setUser(await fetchCurrentUser());
    } catch (err) {
      // 401 already cleared the token inside ApiClient. For a network error
      // we keep the token so the user is not logged out just because the server is down.
      renderAuthUI();
      if (err.status === 0) toast(err.message, 'error', 6000);
    }
  }

  window.addEventListener('algopulse:auth-expired', () => {
    if (state.user) {
      setUser(null);
      toast('Your session has expired. Please log in again.', 'info');
    }
  });

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  function showAuthTab(tab) {
    els.authTabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.authTab === tab));
    els.loginForm.hidden = tab !== 'login';
    els.registerForm.hidden = tab !== 'register';
    clearAlert(els.loginAlert);
    clearAlert(els.registerAlert);
    clearFormErrors(els.loginForm);
    clearFormErrors(els.registerForm);
    setTimeout(() => (tab === 'login' ? els.loginIdentifier : els.regUsername).focus(), 50);
  }

  function openAuth(tab = 'login') {
    openModal(els.authModal, null);
    showAuthTab(tab);
  }

  async function loginRequest(identifier, password) {
    // OAuth2 form field is literally called "username" but accepts email or username.
    const token = await api.request('/auth/login', {
      method: 'POST',
      form: { username: identifier, password },
      auth: false
    });
    api.Token.set(token.access_token);
    setUser(await fetchCurrentUser());
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearAlert(els.loginAlert);
    clearFormErrors(els.loginForm);

    const identifier = els.loginIdentifier.value.trim();
    const password = els.loginPassword.value;
    let valid = true;
    if (!identifier) { setFieldError(els.loginIdentifier, 'Enter your email or username.'); valid = false; }
    if (!password) { setFieldError(els.loginPassword, 'Enter your password.'); valid = false; }
    if (!valid) return;

    setLoading(els.loginSubmit, true, 'Logging in…');
    try {
      await loginRequest(identifier, password);
      els.loginForm.reset();
      closeModal(els.authModal);
      toast(`Welcome back, ${state.user.full_name || state.user.username}!`, 'success');
    } catch (err) {
      showAlert(els.loginAlert, err.message);
    } finally {
      setLoading(els.loginSubmit, false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    clearAlert(els.registerAlert);
    clearFormErrors(els.registerForm);

    const username = els.regUsername.value.trim();
    const email = els.regEmail.value.trim();
    const fullName = els.regName.value.trim();
    const password = els.regPassword.value;
    const confirm = els.regConfirm.value;

    let valid = true;
    if (!USERNAME_RE.test(username)) { setFieldError(els.regUsername, '3–30 characters: letters, numbers or underscore.'); valid = false; }
    if (!EMAIL_RE.test(email)) { setFieldError(els.regEmail, 'Enter a valid email address.'); valid = false; }
    const pwProblem = passwordProblem(password);
    if (pwProblem) { setFieldError(els.regPassword, pwProblem); valid = false; }
    if (password !== confirm) { setFieldError(els.regConfirm, 'Passwords do not match.'); valid = false; }
    if (!valid) return;

    setLoading(els.registerSubmit, true, 'Creating account…');
    try {
      await api.post('/auth/register', {
        username, email, password, full_name: fullName || null
      }, { auth: false });
    } catch (err) {
      showAlert(els.registerAlert, err.message);
      setLoading(els.registerSubmit, false);
      return;
    }

    // Account created: log in automatically.
    try {
      await loginRequest(username, password);
      els.registerForm.reset();
      closeModal(els.authModal);
      toast('Account created. Welcome to AlgoPulse!', 'success');
    } catch (err) {
      showAuthTab('login');
      showAlert(els.loginAlert, 'Account created! Please log in.', 'success');
    } finally {
      setLoading(els.registerSubmit, false);
    }
  }

  async function handleLogout() {
    els.btnLogout.disabled = true;
    try {
      await api.post('/auth/logout'); // revokes the token on the server
    } catch (err) {
      // Even if the server is unreachable or the token already expired, log out locally.
    }
    api.Token.clear();
    setUser(null);
    els.btnLogout.disabled = false;
    closeModal(els.profileModal);
    toast('You have been logged out.', 'info');
  }

  function openProfile() {
    const user = state.user;
    if (!user) { openAuth('login'); return; }
    els.profileAvatar.textContent = initialOf(user);
    els.profileDisplayName.textContent = user.full_name || user.username;
    const since = new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    els.profileMeta.textContent = `@${user.username} · ${user.email} · Member since ${since}`;
    els.profileFullName.value = user.full_name || '';
    clearAlert(els.profileAlert);
    clearAlert(els.passwordAlert);
    els.passwordForm.reset();
    clearFormErrors(els.passwordForm);
    openModal(els.profileModal, els.profileFullName);
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    clearAlert(els.profileAlert);
    setLoading(els.profileSave, true, 'Saving…');
    try {
      const updated = await api.patch('/users/me', { full_name: els.profileFullName.value.trim() || null });
      setUser(updated);
      els.profileDisplayName.textContent = updated.full_name || updated.username;
      showAlert(els.profileAlert, 'Profile updated.', 'success');
    } catch (err) {
      showAlert(els.profileAlert, err.message);
    } finally {
      setLoading(els.profileSave, false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    clearAlert(els.passwordAlert);
    clearFormErrors(els.passwordForm);

    const current = els.curPassword.value;
    const next = els.newPassword.value;
    let valid = true;
    if (!current) { setFieldError(els.curPassword, 'Enter your current password.'); valid = false; }
    const problem = passwordProblem(next);
    if (problem) { setFieldError(els.newPassword, problem); valid = false; }
    if (next !== els.newConfirm.value) { setFieldError(els.newConfirm, 'Passwords do not match.'); valid = false; }
    if (!valid) return;

    setLoading(els.passwordSubmit, true, 'Updating…');
    try {
      await api.post('/users/me/change-password', { current_password: current, new_password: next });
      els.passwordForm.reset();
      showAlert(els.passwordAlert, 'Password updated.', 'success');
      toast('Password updated.', 'success');
    } catch (err) {
      showAlert(els.passwordAlert, err.message);
    } finally {
      setLoading(els.passwordSubmit, false);
    }
  }

  // ------------------------------------------------------------------
  // Event wiring
  // ------------------------------------------------------------------
  els.btnOpenLogin.addEventListener('click', () => openAuth('login'));
  els.btnOpenRegister.addEventListener('click', () => openAuth('register'));
  els.userChip.addEventListener('click', openProfile);
  els.btnCloseAuth.addEventListener('click', () => closeModal(els.authModal));
  els.btnCloseProfile.addEventListener('click', () => closeModal(els.profileModal));
  els.btnProfileClose2.addEventListener('click', () => closeModal(els.profileModal));
  els.authTabs.forEach((btn) => btn.addEventListener('click', () => showAuthTab(btn.dataset.authTab)));
  els.loginForm.addEventListener('submit', handleLogin);
  els.registerForm.addEventListener('submit', handleRegister);
  els.profileForm.addEventListener('submit', handleProfileSave);
  els.passwordForm.addEventListener('submit', handlePasswordChange);
  els.btnLogout.addEventListener('click', handleLogout);

  // ------------------------------------------------------------------
  // Public API for later features (progress, bookmarks, quiz)
  // ------------------------------------------------------------------
  window.AlgoPulseAuth = {
    getUser: () => state.user,
    isLoggedIn: () => !!state.user,
    requireLogin(message = 'Please log in to use this feature.') {
      if (state.user) return true;
      toast(message, 'info');
      openAuth('login');
      return false;
    },
    onChange(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    openLogin: () => openAuth('login'),
    openRegister: () => openAuth('register'),
    toast
  };

  restoreSession();
})();
