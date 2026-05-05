// auth.js — Clerk authentication + Supabase collection storage
// 
// SETUP INSTRUCTIONS:
// 1. Create account at clerk.com → create application → copy Publishable Key
// 2. Create account at supabase.com → new project → copy Project URL + anon key
// 3. In Supabase SQL editor, run:
//    CREATE TABLE collections (
//      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//      user_id text NOT NULL,
//      event_name text NOT NULL,
//      event_type text,
//      venue text,
//      event_date text,
//      seat_info text,
//      price text,
//      style text,
//      logo_url text,
//      status text DEFAULT 'saved',
//      tracking text,
//      added_date text,
//      created_at timestamp DEFAULT now()
//    );
//    -- Simple RLS: allow all operations, user_id filter in queries handles isolation
//    ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow all with anon key" ON collections FOR ALL TO anon USING (true) WITH CHECK (true);
// 4. Replace the keys below with your real ones
// 5. Add to Netlify environment variables:
//    CLERK_PUBLISHABLE_KEY = your key
//    SUPABASE_URL = your url  
//    SUPABASE_ANON_KEY = your key

// ── CONFIG (replace with your keys) ──
const CLERK_KEY   = 'pk_test_ZnVua3ktY2FyaWJvdS02Ny5jbGVyay5hY2NvdW50cy5kZXYk';
const SUPA_URL    = 'https://abnaehtnlwgweaygdytr.supabase.co';
const SUPA_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmFlaHRubHdnd2VheWdkeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzUzNjgsImV4cCI6MjA5MzUxMTM2OH0.ZZP_KmBAcZquEdWAXADLaBGd8JMHgiEJB9R3xs_SwDo';

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
    headers: { ...SUPA_HEADERS, ...options.headers },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }
  if (res.status === 204) return true;
  return res.json();
}

// ── COLLECTION CRUD ──
async function loadCollectionFromCloud() {
  if (!currentUser) return null;
  try {
    const data = await supaFetch(
      `/collections?user_id=eq.${encodeURIComponent(currentUser.id)}&order=created_at.desc`
    );
    return Array.isArray(data) ? data : [];
  } catch(e) {
    console.error('Load collection failed:', e);
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
    console.error('Save to cloud failed:', e);
    return false;
  }
}

async function deleteItemFromCloud(id) {
  if (!currentUser) return false;
  try {
    await supaFetch(
      `/collections?id=eq.${id}&user_id=eq.${encodeURIComponent(currentUser.id)}`,
      { method: 'DELETE' }
    );
    return true;
  } catch(e) {
    console.error('Delete failed:', e);
    return false;
  }
}

async function updateItemStatusInCloud(id, status, tracking) {
  if (!currentUser) return false;
  try {
    await supaFetch(
      `/collections?id=eq.${id}&user_id=eq.${encodeURIComponent(currentUser.id)}`,
      {
        method: 'PATCH',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status, tracking: tracking || null }),
      }
    );
    return true;
  } catch(e) {
    console.error('Update status failed:', e);
    return false;
  }
}

// Convert Supabase row → app item format
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
async function initAuth(onUserChange) {
  // Load Clerk script
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  clerkInstance = new window.Clerk(CLERK_KEY);
  await clerkInstance.load();

  currentUser = clerkInstance.user;
  onUserChange(currentUser);

  clerkInstance.addListener(({ user }) => {
    currentUser = user;
    onUserChange(user);
  });

  return clerkInstance;
}

function openSignIn() {
  if (clerkInstance) clerkInstance.openSignIn();
}

function openSignUp() {
  if (clerkInstance) clerkInstance.openSignUp();
}

function signOut() {
  if (clerkInstance) clerkInstance.signOut();
}

function getUserName() {
  if (!currentUser) return null;
  return currentUser.firstName || currentUser.emailAddresses?.[0]?.emailAddress || 'User';
}
