/**
 * AlgoPulse API client.
 * One place for: base URL, JWT storage, Authorization header, and error handling.
 * Every backend feature (auth, progress, bookmarks, quiz) calls the server through this file.
 *
 *   const me = await ApiClient.get('/users/me');
 *   await ApiClient.post('/something', { key: 'value' });
 */
(function () {
  'use strict';

  const cfg = window.ALGOPULSE_CONFIG;

  // ---- Token storage (localStorage, same approach as the theme setting) ----
  const Token = {
    get() {
      try { return localStorage.getItem(cfg.TOKEN_STORAGE_KEY); } catch (e) { return null; }
    },
    set(value) {
      try { localStorage.setItem(cfg.TOKEN_STORAGE_KEY, value); } catch (e) { /* storage blocked */ }
    },
    clear() {
      try { localStorage.removeItem(cfg.TOKEN_STORAGE_KEY); } catch (e) { /* storage blocked */ }
    }
  };

  class ApiError extends Error {
    constructor(message, status, data) {
      super(message);
      this.name = 'ApiError';
      this.status = status;   // HTTP status, or 0 when the server could not be reached
      this.data = data;       // raw parsed error body (if any)
    }
  }

  // Turn FastAPI error bodies into one readable sentence.
  function extractMessage(data, status) {
    if (data && typeof data.detail === 'string') return data.detail;
    if (data && Array.isArray(data.detail)) {
      const parts = data.detail.map((item) => {
        const msg = String(item.msg || '').replace(/^Value error,\s*/, '');
        const field = Array.isArray(item.loc) && item.loc.length > 1 ? item.loc[item.loc.length - 1] : '';
        return field && !msg.toLowerCase().includes(String(field).toLowerCase()) ? `${field}: ${msg}` : msg;
      }).filter(Boolean);
      if (parts.length) return parts.join('. ');
    }
    if (status === 401) return 'Please log in to continue.';
    if (status === 403) return 'You do not have permission to do that.';
    if (status === 404) return 'The requested item was not found.';
    if (status >= 500) return 'Something went wrong on the server. Please try again.';
    return 'Request failed. Please try again.';
  }

  /**
   * @param {string} path  e.g. '/users/me' (appended to API_BASE_URL)
   * @param {object} opts  { method, body (JSON), form (urlencoded), auth (default true) }
   */
  async function request(path, { method = 'GET', body, form, auth = true } = {}) {
    const headers = { Accept: 'application/json' };
    const token = Token.get();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    let payload;
    if (form) {
      // Login uses form encoding (OAuth2 standard): username=...&password=...
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      payload = new URLSearchParams(form).toString();
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(cfg.API_BASE_URL + path, { method, headers, body: payload });
    } catch (networkError) {
      throw new ApiError('Cannot reach the AlgoPulse server. Is the backend running?', 0, null);
    }

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try { data = await response.json(); } catch (e) { data = null; }
    }

    if (!response.ok) {
      // A 401 on an authenticated call means the saved token is no longer valid.
      if (response.status === 401 && auth && token) {
        Token.clear();
        window.dispatchEvent(new CustomEvent('algopulse:auth-expired'));
      }
      throw new ApiError(extractMessage(data, response.status), response.status, data);
    }
    return data;
  }

  window.ApiClient = {
    request,
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
    Token,
    ApiError
  };
})();
