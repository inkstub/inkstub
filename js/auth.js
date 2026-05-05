// auth.js — Inkstub authentication

const CLERK_KEY = 'pk_live_Y2xlcmsuaW5rc3R1Yi5jb20k';
const SUPA_URL  = 'https://abnaehtnlwgweaygdytr.supabase.co';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmFlaHRubHdnd2VheWdkeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzUzNjgsImV4cCI6MjA5MzUxMTM2OH0.ZZP_KmBAcZquEdWAXADLaBGd8JMHgiEJB9R3xs_SwDo';

let currentUser = null;
let clerkInstance = null;
let _onUserChange = null;

// ── SUPABASE ──
const SUPA_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPA_KEY,
  'Authorization': 'Bearer ' + SUPA_KEY,
};

async function supaFetch(path, options) {
  options = options || {};
  var res = await fetch(SUPA_URL + '/rest/v1' + path, Object.assign({}, options, {
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
        event_name: item.name,
        event_type: item.type,
        venue: item.venue,
        event_date: item.date,
        seat_info: item.seat,
        price: item.price,
        style: item.style || 'classic',
        logo_url: item.logo || null,
        status: item.status || 'saved',
        tracking: item.tracking || null,
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

// ── CLERK ──
function initAuth(onUserChange) {
  _onUserChange = onUserChange;

  // Inject Clerk script into <head>
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
  script.async = true;
  script.onload = function() {
    clerkInstance = new window.Clerk(CLERK_KEY);
    console.log('Clerk script loaded, initializing...');
    clerkInstance.load({
      routerPush: function(to) { window.location.href = to; },
      routerReplace: function(to) { window.location.replace(to); }
    }).then(function() {
      console.log('Clerk ready, user:', clerkInstance.user ? clerkInstance.user.id : 'none');
      currentUser = clerkInstance.user || null;
      onUserChange(currentUser);
      clerkInstance.addListener(function(resources) {
        currentUser = resources.user || null;
        onUserChange(currentUser);
      });
    }).catch(function(err) {
      console.error('Clerk load error:', err);
      onUserChange(null);
    });
  };
  script.onerror = function() {
    console.error('Clerk script failed to load');
    onUserChange(null);
  };
  document.head.appendChild(script);
}

function openSignIn() {
  if (clerkInstance) {
    clerkInstance.openSignIn();
  } else {
    // Fallback: redirect to Clerk hosted sign-in page
    window.location.href = 'https://funky-caribou-67.clerk.accounts.dev/sign-in?redirect_url=' + encodeURIComponent(window.location.href);
  }
}

function openSignUp() {
  if (clerkInstance) {
    clerkInstance.openSignUp();
  } else {
    // Fallback: redirect to Clerk hosted sign-up page
    window.location.href = 'https://funky-caribou-67.clerk.accounts.dev/sign-up?redirect_url=' + encodeURIComponent(window.location.href);
  }
}

function signOut() {
  if (clerkInstance) clerkInstance.signOut();
}

function getUserName() {
  if (!currentUser) return null;
  return currentUser.firstName ||
    (currentUser.emailAddresses && currentUser.emailAddresses[0] && currentUser.emailAddresses[0].emailAddress.split('@')[0]) ||
    'User';
}
