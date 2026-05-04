/* app.js — Main application logic for Stub */

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
let selectedStyle = 'classic';
let collection = JSON.parse(localStorage.getItem('stub_collection') || '[]');
let currentTicket = null;

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initUpload();
  initStylePicker();
  initButtons();
  updateStats();
});

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('btnViewCollection')?.addEventListener('click', () => {
    switchView('collection');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="collection"]').classList.add('active');
  });

  document.getElementById('btnGoCreate')?.addEventListener('click', () => {
    switchView('create');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="create"]').classList.add('active');
  });
}

function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  if (name === 'collection') renderCollection('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════
   FILE UPLOAD
════════════════════════════════════════ */
function initUpload() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');

  // Click to open file picker
  zone.addEventListener('click', () => input.click());

  // File selected
  input.addEventListener('change', () => {
    if (input.files && input.files[0]) handleFile(input.files[0]);
  });

  // Drag & drop
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', e => {
    if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}

function handleFile(file) {
  const zone = document.getElementById('uploadZone');
  const inner = zone.querySelector('.upload-inner');
  const success = document.getElementById('uploadSuccess');
  const nameEl = document.getElementById('uploadFileName');

  zone.classList.add('has-file');
  inner.style.display = 'none';
  success.style.display = 'block';
  nameEl.textContent = file.name;

  showToast('Ticket uploaded! Fill in details below.');

  // In production: send to OCR/AI endpoint to extract fields
  // For now: hint with a demo autofill if name looks like a known event
  const lower = file.name.toLowerCase();
  if (lower.includes('swift') || lower.includes('taylor')) {
    prefillForm('Taylor Swift: Eras Tour', 'Concert', 'Wrigley Field, Chicago, IL', 'June 2, 2024', 'Sec 205, Row C, Seat 14', '$189.50');
  }
}

function prefillForm(name, type, venue, date, seat, price) {
  document.getElementById('eventName').value  = name;
  document.getElementById('venue').value      = venue;
  document.getElementById('eventDate').value  = date;
  document.getElementById('seatInfo').value   = seat;
  document.getElementById('ticketPrice').value = price;

  const select = document.getElementById('eventType');
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === type) { select.selectedIndex = i; break; }
  }
}

/* ════════════════════════════════════════
   STYLE PICKER
════════════════════════════════════════ */
function initStylePicker() {
  document.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedStyle = card.dataset.style;
      document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      // Live-update preview if already generated
      if (currentTicket) {
        currentTicket.style = selectedStyle;
        renderTicketPreview();
      }
    });
  });
}

/* ════════════════════════════════════════
   BUTTONS
════════════════════════════════════════ */
function initButtons() {
  document.getElementById('btnPreview').addEventListener('click', generatePreview);
  document.getElementById('btnSave').addEventListener('click', saveToCollection);
  document.getElementById('btnOrder').addEventListener('click', showOrderForm);
  document.getElementById('btnPlaceOrder').addEventListener('click', placeOrder);
}

/* ════════════════════════════════════════
   TICKET GENERATION
════════════════════════════════════════ */
function getFormData() {
  return {
    name:  document.getElementById('eventName').value.trim()  || 'The Event',
    type:  document.getElementById('eventType').value         || 'Concert',
    venue: document.getElementById('venue').value.trim()      || 'The Grand Venue',
    date:  document.getElementById('eventDate').value.trim()  || 'TBD',
    seat:  document.getElementById('seatInfo').value.trim()   || 'GA',
    price: document.getElementById('ticketPrice').value.trim() || '$0.00',
    style: selectedStyle,
  };
}

function generatePreview() {
  currentTicket = getFormData();
  renderTicketPreview();

  const wrap = document.getElementById('ticketWrap');
  wrap.style.display = 'block';

  // Hide order/confirm in case they were shown
  document.getElementById('card-order').style.display   = 'none';
  document.getElementById('card-confirm').style.display = 'none';

  setTimeout(() => {
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function renderTicketPreview() {
  document.getElementById('ticketEl').innerHTML = buildTicketHTML(currentTicket);
}

/* ════════════════════════════════════════
   COLLECTION
════════════════════════════════════════ */
function saveToCollection() {
  if (!currentTicket) return;
  const entry = {
    ...currentTicket,
    status: 'Saved',
    tracking: null,
    addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    id: Date.now(),
  };
  collection.push(entry);
  persistCollection();
  updateStats();
  showToast('Saved to your collection!');
}

function persistCollection() {
  localStorage.setItem('stub_collection', JSON.stringify(collection));
}

function updateStats() {
  document.getElementById('statTotal').textContent    = collection.length;
  document.getElementById('statPrinting').textContent = collection.filter(c => c.status === 'Printing').length;
}

function renderCollection(filter) {
  const grid = document.getElementById('stubsGrid');
  const items = filter === 'all' ? collection : collection.filter(c => c.type === filter);

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎟</div>
        <p class="empty-title">No stubs yet</p>
        <p class="empty-sub">Print your first ticket to start your collection</p>
        <button class="btn-secondary" id="btnGoCreate">Create Your First Stub →</button>
      </div>`;
    document.getElementById('btnGoCreate')?.addEventListener('click', () => {
      switchView('create');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-view="create"]').classList.add('active');
    });
    return;
  }

  // Newest first
  const sorted = [...items].reverse();
  grid.innerHTML = sorted.map(item => buildCollectionEntryHTML(item)).join('');
}

/* Filter bar */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCollection(btn.dataset.filter);
  });
});

/* ════════════════════════════════════════
   ORDER FLOW
════════════════════════════════════════ */
function showOrderForm() {
  const card = document.getElementById('card-order');
  card.style.display = 'block';
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function placeOrder() {
  const name   = document.getElementById('addrName').value.trim();
  const street = document.getElementById('addrStreet').value.trim();
  const city   = document.getElementById('addrCity').value.trim();
  const zip    = document.getElementById('addrZip').value.trim();
  const email  = document.getElementById('addrEmail').value.trim();

  if (!name || !street || !city || !zip || !email) {
    showToast('Please fill in all address fields.');
    return;
  }

  if (!currentTicket) return;

  const trackId = 'STUB-' + Math.floor(Math.random() * 900000 + 100000);

  // Add to collection as "Printing"
  const entry = {
    ...currentTicket,
    status: 'Printing',
    tracking: trackId,
    addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    id: Date.now(),
    shippingName: name,
    shippingAddress: `${street}, ${city} ${zip}`,
    email,
  };
  collection.push(entry);
  persistCollection();
  updateStats();

  // Show confirm
  document.getElementById('trackingBadge').textContent = trackId;
  document.getElementById('card-order').style.display   = 'none';
  document.getElementById('card-confirm').style.display = 'block';

  setTimeout(() => {
    document.getElementById('card-confirm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
