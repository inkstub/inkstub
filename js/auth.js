// auth.js — Supabase Auth (replaces Clerk)

const SUPA_URL = 'https://abnaehtnlwgweaygdytr.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmFlaHRubHdnd2VheWdkeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzUzNjgsImV4cCI6MjA5MzUxMTM2OH0.ZZP_KmBAcZquEdWAXADLaBGd8JMHgiEJB9R3xs_SwDo';

let currentUser = null;
let _supabase = null;
let _onUserChange = null;

// ── INIT SUPABASE ──
function initAuth(onUserChange) {
  _onUserChange = onUserChange;

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = async function() {
    _supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

    // Check existing session
    const { data: { session } } = await _supabase.auth.getSession();
    currentUser = session?.user || null;
    onUserChange(currentUser);

    // Listen for auth changes
    _supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      onUserChange(currentUser);
      // Close modal if open
      const modal = document.getElementById('_authModal');
      if (modal && currentUser) modal.remove();
    });
  };
  script.onerror = function() {
    console.error('Supabase failed to load');
    onUserChange(null);
  };
  document.head.appendChild(script);
}

// ── AUTH MODAL ──
function showAuthModal(mode) {
  const existing = document.getElementById('_authModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '_authModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:DM Sans,sans-serif';

  modal.innerHTML = `
    <div style="background:#161616;border:1px solid #333;padding:32px;max-width:420px;width:100%;position:relative">
      <button onclick="document.getElementById('_authModal').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#888;font-size:20px;cursor:pointer;line-height:1">×</button>
      <div style="font-size:22px;font-weight:700;color:#f0ede8;margin-bottom:4px" id="_authTitle">${mode === 'signin' ? 'Sign In' : 'Create Account'}</div>
      <div style="font-size:13px;color:#888;margin-bottom:24px" id="_authSub">${mode === 'signin' ? 'Welcome back to inkstub' : 'Start preserving your memories'}</div>
      <div id="_authError" style="display:none;background:#2a0a0a;border:1px solid #c84040;color:#f08080;font-size:12px;padding:10px;margin-bottom:16px"></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div>
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C4862A;margin-bottom:5px">Email</div>
          <input id="_authEmail" type="email" placeholder="you@example.com" style="width:100%;background:#0a0a0a;border:1px solid #333;color:#f0ede8;font-family:DM Sans,sans-serif;font-size:14px;padding:10px 12px;outline:none;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C4862A;margin-bottom:5px">Password</div>
          <input id="_authPassword" type="password" placeholder="••••••••" style="width:100%;background:#0a0a0a;border:1px solid #333;color:#f0ede8;font-family:DM Sans,sans-serif;font-size:14px;padding:10px 12px;outline:none;box-sizing:border-box">
        </div>
        <button onclick="_submitAuth('${mode}')" style="width:100%;padding:12px;background:#C4862A;border:none;color:#0a0a0a;font-size:14px;font-weight:600;cursor:pointer;margin-top:4px" id="_authSubmit">
          ${mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
        <div style="text-align:center;font-size:13px;color:#888">
          ${mode === 'signin'
            ? 'No account? <button onclick="_switchMode(\'signup\')" style="background:none;border:none;color:#C4862A;cursor:pointer;font-size:13px;font-family:DM Sans,sans-serif">Sign up</button>'
            : 'Have an account? <button onclick="_switchMode(\'signin\')" style="background:none;border:none;color:#C4862A;cursor:pointer;font-size:13px;font-family:DM Sans,sans-serif">Sign in</button>'
          }
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('_authEmail').focus(), 100);
}

window._switchMode = function(mode) {
  showAuthModal(mode);
};

window._submitAuth = async function(mode) {
  if (!_supabase) return;
  const email = document.getElementById('_authEmail').value.trim();
  const password = document.getElementById('_authPassword').value;
  const errEl = document.getElementById('_authError');
  const btn = document.getElementById('_authSubmit');

  if (!email || !password) {
    errEl.textContent = 'Please enter your email and password';
    errEl.style.display = 'block';
    return;
  }

  btn.textContent = 'Please wait...';
  btn.disabled = true;
  errEl.style.display = 'none';

  try {
    let result;
    if (mode === 'signin') {
      result = await _supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await _supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      errEl.textContent = result.error.message;
      errEl.style.display = 'block';
      btn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
      btn.disabled = false;
    } else if (mode === 'signup' && !result.data?.session) {
      // Email confirmation required
      errEl.style.background = '#0a2a0a';
      errEl.style.borderColor = '#40a040';
      errEl.style.color = '#80d080';
      errEl.textContent = 'Check your email to confirm your account, then sign in.';
      errEl.style.display = 'block';
      btn.textContent = 'Check Your Email';
      btn.disabled = true;
    }
  } catch(e) {
    errEl.textContent = 'Something went wrong. Please try again.';
    errEl.style.display = 'block';
    btn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
    btn.disabled = false;
  }
};

// ── PUBLIC FUNCTIONS ──
function openSignIn()  { showAuthModal('signin'); }
function openSignUp()  { showAuthModal('signup'); }
function signOut() {
  if (_supabase) _supabase.auth.signOut();
}
function getUserName() {
  if (!currentUser) return null;
  return currentUser.user_metadata?.full_name ||
    currentUser.user_metadata?.name ||
    currentUser.email?.split('@')[0] || 'User';
}

// ── SUPABASE COLLECTION CRUD ──
const SUPA_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPA_KEY,
  'Authorization': 'Bearer ' + SUPA_KEY,
};

async function supaFetch(path, options) {
  options = options || {};
  const res = await fetch(SUPA_URL + '/rest/v1' + path, Object.assign({}, options, {
    headers: Object.assign({}, SUPA_HEADERS, options.headers || {})
  }));
  if (!res.ok) throw new Error('Supabase ' + res.status);
  if (res.status === 204) return true;
  return res.json();
}

async function loadCollectionFromCloud() {
  if (!currentUser) return null;
  try {
    return await supaFetch('/collections?user_id=eq.' + encodeURIComponent(currentUser.id) + '&order=created_at.desc');
  } catch(e) { console.error('Load failed:', e); return null; }
}

async function saveItemToCloud(item) {
  if (!currentUser) return false;
  try {
    await supaFetch('/collections', {
      method: 'POST',
      headers: { 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        user_id: currentUser.id,
        event_name: item.name, event_type: item.type,
        venue: item.venue, event_date: item.date,
        seat_info: item.seat, price: item.price,
        style: item.style || 'classic', logo_url: item.logo || null,
        status: item.status || 'saved', tracking: item.tracking || null,
        added_date: item.addedDate,
      })
    });
    return true;
  } catch(e) { console.error('Save failed:', e); return false; }
}

async function deleteItemFromCloud(id) {
  if (!currentUser) return false;
  try {
    await supaFetch('/collections?id=eq.' + id + '&user_id=eq.' + encodeURIComponent(currentUser.id), { method: 'DELETE' });
    return true;
  } catch(e) { console.error('Delete failed:', e); return false; }
}

function rowToItem(row) {
  return {
    id: row.id, name: row.event_name, type: row.event_type,
    venue: row.venue, date: row.event_date, seat: row.seat_info,
    price: row.price, style: row.style || 'classic', logo: row.logo_url,
    status: row.status, tracking: row.tracking, addedDate: row.added_date,
    fromCloud: true,
  };
}
