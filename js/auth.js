// auth.js — Clerk authentication + Supabase collection storage

const CLERK_KEY = 'pk_test_ZnVua3ktY2FyaWJvdS02Ny5jbGVyay5hY2NvdW50cy5kZXYk';
const SUPA_URL  = 'https://abnaehtnlwgweaygdytr.supabase.co';
const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmFlaHRubHdnd2VheWdkeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzUzNjgsImV4cCI6MjA5MzUxMTM2OH0.ZZP_KmBAcZquEdWAXADLaBGd8JMHgiEJB9R3xs_SwDo';

// ── STATE ──
let currentUser = null;
let clerkInstance = null;

// ── SUPABASE HELPERS ──
const SUPA_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPA_KEY,
  'Authorization': `Bearer ${SUPA_KEY}`,
};

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...SUPA_HEADERS, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
  if (res.status === 204) return true;
  return res.json();
}

async function loadCollectionFromCloud() {
  if (!currentUser) return null;
  try {
    return await supaFetch(`/collections?user_id=eq.${encodeURIComponent(currentUser.id)}&order=created_at.desc`);
  } catch(e) {
    console.error('Load failed:', e);
    return null;
  }
}

async function saveItemToCloud(item) {
  if (!currentUser) return false;
  try {
    await supaFetch('/collections', {
      method: 'POST',
      headers: { 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        user_id:    currentUser.id,
        event_name: item.name,
        event_type: item.type,
        venue:      item.venue,
        event_date: item.date,
        seat_info:  item.seat,
        price:      item.price,
        style:      item.style || 'classic',
        logo_url:   item.logo || null,
        status:     item.status || 'saved',
        tracking:   item.tracking || null,
        added_date: item.addedDate,
      }),
    });
    return true;
  } catch(e) {
    console.error('Save failed:', e);
    return false;
  }
}

async function deleteItemFromCloud(id) {
  if (!currentUser) return false;
  try {
    await supaFetch(`/collections?id=eq.${id}&user_id=eq.${encodeURIComponent(currentUser.id)}`, { method: 'DELETE' });
    return true;
  } catch(e) {
    console.error('Delete failed:', e);
    return false;
  }
}

function rowToItem(row) {
  return {
    id:        row.id,
    name:      row.event_name,
    type:      row.event_type,
    venue:     row.venue,
    date:      row.event_date,
    seat:      row.seat_info,
    price:     row.price,
    style:     row.style || 'classic',
    logo:      row.logo_url,
    status:    row.status,
    tracking:  row.tracking,
    addedDate: row.added_date,
    fromCloud: true,
  };
}

// ── CLERK INIT ──
// Clerk browser SDK: load script with data-clerk-publishable-key attribute
async function initAuth(onUserChange) {
  return new Promise((resolve) => {
    // Add Clerk script with publishable key as data attribute
    const script = document.createElement('script');
    script.setAttribute('data-clerk-publishable-key', CLERK_KEY);
    script.src = `https://clerk.abnaehtnlwgweaygdytr.supabase.co`; // not used
    
    // Actually use the correct Clerk CDN approach
    const clerkScript = document.createElement('script');
    clerkScript.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
    clerkScript.crossOrigin = 'anonymous';
    
    clerkScript.onload = async () => {
      try {
        clerkInstance = new window.Clerk(CLERK_KEY);
        await clerkInstance.load({
          appearance: {
            variables: {
              colorPrimary: '#C4862A',
              colorBackground: '#161616',
              colorInputBackground: '#0A0A0A',
              colorInputText: '#F0EDE8',
              colorText: '#F0EDE8',
              colorTextSecondary: '#888880',
            }
          }
        });
        currentUser = clerkInstance.user || null;
        onUserChange(currentUser);

        clerkInstance.addListener(({ user }) => {
          currentUser = user || null;
          onUserChange(currentUser);
        });

        resolve(clerkInstance);
      } catch(err) {
        console.error('Clerk load error:', err);
        onUserChange(null);
        resolve(null);
      }
    };

    clerkScript.onerror = () => {
      console.error('Failed to load Clerk script');
      onUserChange(null);
      resolve(null);
    };

    document.head.appendChild(clerkScript);
  });
}

function openSignIn() {
  if (clerkInstance) {
    clerkInstance.openSignIn({
      appearance: {
        variables: {
          colorPrimary: '#C4862A',
          colorBackground: '#161616',
          colorInputBackground: '#222',
          colorInputText: '#F0EDE8',
          colorText: '#F0EDE8',
        }
      }
    });
  } else {
    console.warn('Clerk not initialized yet');
  }
}

function openSignUp() {
  if (clerkInstance) {
    clerkInstance.openSignUp({
      appearance: {
        variables: {
          colorPrimary: '#C4862A',
          colorBackground: '#161616',
          colorInputBackground: '#222',
          colorInputText: '#F0EDE8',
          colorText: '#F0EDE8',
        }
      }
    });
  } else {
    console.warn('Clerk not initialized yet');
  }
}

function signOut() {
  if (clerkInstance) clerkInstance.signOut();
}

function getUserName() {
  if (!currentUser) return null;
  return currentUser.firstName ||
    currentUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'User';
}
