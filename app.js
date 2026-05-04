/* ══════════════════════════════════════════════
   STUB — MAIN STYLESHEET
   ══════════════════════════════════════════════ */

:root {
  --cream:   #F5F0E8;
  --aged:    #E8DFC8;
  --brown:   #6B4C2A;
  --dark:    #2C1A0E;
  --red:     #8B1A1A;
  --gold:    #C4862A;
  --gold-lt: #e8a840;
  --ink:     #1A1008;
  --green:   #2D5016;
  --bg:      #1a0f08;
  --card-bg: #231508;
  --border:  rgba(196,134,42,0.25);
  --text-muted: #a08060;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-stamp:   'Special Elite', 'Courier New', monospace;
  --font-mono:    'Courier Prime', 'Courier New', monospace;

  --radius: 0px;
  --shadow: 6px 6px 0 rgba(0,0,0,0.5);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--cream);
  min-height: 100vh;
  font-size: 15px;
  line-height: 1.6;
}

/* ── HEADER ── */
.header {
  background: var(--dark);
  border-bottom: 3px solid var(--gold);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-block { display: flex; flex-direction: column; gap: 1px; }

.logo {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 900;
  color: var(--gold);
  letter-spacing: -1px;
  line-height: 1;
}

.logo-tagline {
  font-family: var(--font-stamp);
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.nav { display: flex; gap: 4px; }

.nav-btn {
  font-family: var(--font-stamp);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  padding: 9px 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover { color: var(--gold); border-color: var(--gold); }
.nav-btn.active { background: var(--gold); color: var(--dark); border-color: var(--gold); font-weight: 700; }

/* ── LAYOUT ── */
main { max-width: 860px; margin: 0 auto; padding: 32px 24px 80px; }

.view { display: none; }
.view.active { display: block; }

/* ── HERO ── */
.section-hero {
  text-align: center;
  padding: 40px 0 36px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
}

.section-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(26px, 5vw, 40px);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 12px;
  color: var(--cream);
}

.hero-sub {
  font-family: var(--font-stamp);
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--text-muted);
}

/* ── CARDS ── */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  padding: 28px 32px;
  margin-bottom: 20px;
}

.step-label {
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

/* ── UPLOAD ZONE ── */
.upload-zone {
  position: relative;
  border: 2px dashed rgba(196,134,42,0.5);
  background: radial-gradient(ellipse at center, rgba(196,134,42,0.07) 0%, rgba(196,134,42,0.02) 70%);
  padding: 52px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  user-select: none;
  overflow: hidden;
}

/* animated corner accents */
.upload-zone::before,
.upload-zone::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--gold);
  border-style: solid;
  transition: all 0.3s ease;
  opacity: 0.6;
}
.upload-zone::before { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
.upload-zone::after  { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }

.upload-zone:hover {
  background: radial-gradient(ellipse at center, rgba(196,134,42,0.14) 0%, rgba(196,134,42,0.04) 70%);
  border-color: var(--gold);
}
.upload-zone:hover::before,
.upload-zone:hover::after {
  width: 28px; height: 28px; opacity: 1;
}

.upload-zone.drag-over {
  background: radial-gradient(ellipse at center, rgba(196,134,42,0.2) 0%, rgba(196,134,42,0.06) 70%);
  border-color: var(--gold-lt);
  border-style: solid;
  transform: scale(1.01);
}

.upload-zone.has-file {
  border-color: #4a8a28;
  border-style: solid;
  background: radial-gradient(ellipse at center, rgba(45,80,22,0.18) 0%, rgba(45,80,22,0.06) 70%);
}
.upload-zone.has-file::before,
.upload-zone.has-file::after { border-color: #4a8a28; opacity: 0.8; }

.upload-icon {
  font-size: 44px;
  margin-bottom: 14px;
  display: block;
  filter: drop-shadow(0 0 12px rgba(196,134,42,0.4));
  transition: transform 0.3s ease;
}
.upload-zone:hover .upload-icon { transform: translateY(-3px); }

.upload-title {
  font-family: var(--font-stamp);
  font-size: 16px;
  color: var(--gold);
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 11px;
  color: #806848;
  letter-spacing: 1px;
}

.upload-formats {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}

.upload-format-tag {
  font-family: var(--font-stamp);
  font-size: 9px;
  letter-spacing: 2px;
  color: #604030;
  border: 1px solid rgba(196,134,42,0.2);
  padding: 3px 9px;
}

/* success state */
.upload-success .upload-icon { filter: drop-shadow(0 0 12px rgba(74,138,40,0.5)); }
.upload-success .upload-title { color: #6ab840; }

/* ── DIVIDER ── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 24px;
  color: #604030;
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── FORM ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field-full { grid-column: 1 / -1; }

.field-label {
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
}

.field-input {
  background: rgba(245,240,232,0.06);
  border: 1px solid rgba(196,134,42,0.35);
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
}

.field-input:focus {
  border-color: var(--gold);
  background: rgba(245,240,232,0.1);
}

.field-input::placeholder { color: #504030; }

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C4862A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  cursor: pointer;
}

.field-select option { background: #2C1A0E; color: var(--cream); }

/* ── STYLE PICKER ── */
.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.style-card {
  border: 2px solid var(--border);
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.style-card:hover { border-color: rgba(196,134,42,0.6); }
.style-card.selected { border-color: var(--gold); }

.style-preview {
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.classic-preview  { background: linear-gradient(135deg, #D4A04C, #8B6914); }
.sport-preview    { background: linear-gradient(135deg, #1a3a6e, #8B1A1A); }
.concert-preview  { background: linear-gradient(135deg, #1a1a2e, #4a1a6e); }

.mini-ticket-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 900;
  color: rgba(255,255,255,0.9);
  letter-spacing: 1px;
}

.mini-ticket-detail {
  font-family: var(--font-stamp);
  font-size: 8px;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.6);
}

.style-card-info { padding: 10px 12px; }
.style-name { font-family: var(--font-stamp); font-size: 12px; color: var(--cream); letter-spacing: 1px; margin-bottom: 2px; }
.style-era  { font-size: 10px; color: #806848; letter-spacing: 1px; }

/* Fix: card info inside style-card */
.style-card .style-name, .style-card .style-era {
  display: block;
  padding: 0 12px;
}
.style-card .style-name { padding-top: 10px; }
.style-card .style-era  { padding-bottom: 10px; }

/* ── BUTTONS ── */
.btn-preview {
  width: 100%;
  background: var(--gold);
  color: var(--dark);
  border: none;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 17px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
}
.btn-preview:hover { background: var(--gold-lt); transform: translateY(-1px); }
.btn-preview:active { transform: none; }

.btn-primary {
  background: var(--red);
  color: var(--cream);
  border: none;
  font-family: var(--font-stamp);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 14px 24px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #a02020; }
.btn-full { width: 100%; padding: 18px; font-size: 14px; letter-spacing: 3px; }

.btn-secondary {
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--border);
  font-family: var(--font-stamp);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 13px 22px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--gold); background: rgba(196,134,42,0.08); }

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.action-row .btn-secondary,
.action-row .btn-primary { flex: 1; text-align: center; }

/* ── TICKET PREVIEW WRAPPER ── */
.preview-label {
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 16px;
}

/* ══════════════════════════
   TICKET STYLES — REDESIGNED
══════════════════════════ */

.ticket-wrap-outer {
  position: relative;
  padding: 24px 0;
}

/* shadow/glow behind ticket */
.ticket-wrap-outer::before {
  content: '';
  position: absolute;
  inset: 30px 20px;
  filter: blur(24px);
  z-index: 0;
  border-radius: 4px;
  opacity: 0.5;
}
.ticket-wrap-outer.glow-classic::before { background: rgba(196,134,42,0.4); }
.ticket-wrap-outer.glow-sport::before   { background: rgba(139,26,26,0.5); }
.ticket-wrap-outer.glow-concert::before { background: rgba(106,58,138,0.5); }

.ticket {
  display: flex;
  overflow: hidden;
  position: relative;
  font-family: var(--font-stamp);
  border-radius: 3px;
  z-index: 1;
  /* punched hole effect */
}

/* notched edges (ticket punch look) */
.ticket::before {
  content: '';
  position: absolute;
  left: calc(100% - 93px);
  top: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 10;
}

/* bottom notch */
.ticket-notch-bottom {
  position: absolute;
  left: calc(100% - 93px);
  bottom: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 10;
}

/* paper grain overlay */
.ticket-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 6;
}

.ticket-body {
  flex: 1;
  padding: 20px 24px 20px 22px;
  border-right: 2px dashed;
  position: relative;
  min-width: 0;
  z-index: 2;
}

/* decorative top border stripe */
.ticket-body::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
}

.ticket-stub-col {
  width: 88px;
  flex-shrink: 0;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  position: relative;
}

.t-type {
  font-size: 8px;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid;
  display: inline-block;
}

.t-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
  margin: 5px 0 4px;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.t-venue {
  font-size: 10px;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.t-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 18px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px dotted;
}

.t-detail-lbl { font-size: 7px; letter-spacing: 2.5px; text-transform: uppercase; display: block; margin-bottom: 2px; }
.t-detail-val { font-size: 13px; font-weight: 700; display: block; letter-spacing: 0.5px; }

.t-bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.t-price-box {
  display: inline-block;
  border: 2px solid;
  padding: 6px 12px;
}
.t-price-lbl { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2px; }
.t-price-val { font-family: var(--font-display); font-size: 20px; font-weight: 900; display: block; line-height: 1; }

.t-stamp {
  width: 60px;
  height: 60px;
  border: 2.5px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-12deg);
  opacity: 0.7;
  flex-shrink: 0;
}
.t-stamp-text { font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; line-height: 1.6; }

/* STUB COLUMN */
.t-stub-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  text-align: center;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 1;
}

.t-stub-num {
  font-size: 8px;
  letter-spacing: 1px;
  margin-top: 8px;
  text-align: center;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  opacity: 0.7;
}

.t-barcode {
  display: flex;
  gap: 1.5px;
  align-items: flex-end;
}
.t-barcode span { display: block; width: 2px; border-radius: 1px; }

/* ── CLASSIC ── */
.ticket.classic {
  background: linear-gradient(160deg, #F0E8D0 0%, #E4D8B8 50%, #DCCFA8 100%);
  border: 1px solid #C8B078;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4);
}
.ticket.classic::before          { background: var(--bg); box-shadow: 0 0 0 2px #C8B078; }
.ticket.classic .ticket-notch-bottom { background: var(--bg); box-shadow: 0 0 0 2px #C8B078; }
.ticket.classic .ticket-body     { border-right-color: #B8A060; border-right-style: dashed; }
.ticket.classic .ticket-body::before { background: linear-gradient(90deg, #8B1A1A, #C4862A); }
.ticket.classic .t-details       { border-bottom-color: #C8B078; }
.ticket.classic .t-type          { color: #7a5020; border-bottom-color: #B89050; }
.ticket.classic .t-title         { color: #1a0a04; }
.ticket.classic .t-venue         { color: #6B4C2A; }
.ticket.classic .t-detail-lbl   { color: #9a7040; }
.ticket.classic .t-detail-val   { color: #2C1A0E; }
.ticket.classic .t-price-box    { border-color: #8B1A1A; }
.ticket.classic .t-price-lbl    { color: #8B1A1A; }
.ticket.classic .t-price-val    { color: #8B1A1A; }
.ticket.classic .t-stamp        { border-color: #2D5016; }
.ticket.classic .t-stamp-text   { color: #2D5016; }
.ticket.classic .t-stub-label   { color: #1a0a04; }
.ticket.classic .t-stub-num     { color: #9a7040; }
.ticket.classic .t-barcode span { background: #2C1A0E; }
.ticket.classic .ticket-stub-col { border-left: none; background: rgba(180,150,80,0.15); }

/* ── SPORT ── */
.ticket.sport {
  background: linear-gradient(160deg, #0a1828 0%, #0d1f3c 60%, #101830 100%);
  border: 1px solid #1a3060;
  box-shadow: 0 4px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);
}
.ticket.sport::before            { background: var(--bg); box-shadow: 0 0 0 2px #1a3060; }
.ticket.sport .ticket-notch-bottom { background: var(--bg); box-shadow: 0 0 0 2px #1a3060; }
.ticket.sport .ticket-body      { border-right-color: #8B1A1A; }
.ticket.sport .ticket-body::before { background: linear-gradient(90deg, #8B1A1A, #c84020); }
.ticket.sport .t-details        { border-bottom-color: rgba(200,160,120,0.2); }
.ticket.sport .t-type           { color: #e8b870; border-bottom-color: rgba(232,184,112,0.4); }
.ticket.sport .t-title          { color: #F5EDD8; }
.ticket.sport .t-venue          { color: #8a7060; }
.ticket.sport .t-detail-lbl    { color: #8a7060; }
.ticket.sport .t-detail-val    { color: #E8DFC8; }
.ticket.sport .t-price-box     { border-color: #e8a820; }
.ticket.sport .t-price-lbl     { color: #e8a820; }
.ticket.sport .t-price-val     { color: #e8a820; }
.ticket.sport .t-stamp         { border-color: #8B1A1A; }
.ticket.sport .t-stamp-text    { color: #c83020; }
.ticket.sport .t-stub-label    { color: #E8DFC8; }
.ticket.sport .t-stub-num      { color: #8a7060; }
.ticket.sport .t-barcode span  { background: #c8a878; }
.ticket.sport .ticket-stub-col { background: rgba(139,26,26,0.12); }

/* ── CONCERT ── */
.ticket.concert {
  background: linear-gradient(160deg, #080812 0%, #0d0d20 60%, #100818 100%);
  border: 1px solid #4a2868;
  box-shadow: 0 4px 28px rgba(80,0,120,0.4), inset 0 1px 0 rgba(200,150,255,0.06);
}
.ticket.concert::before           { background: var(--bg); box-shadow: 0 0 0 2px #4a2868; }
.ticket.concert .ticket-notch-bottom { background: var(--bg); box-shadow: 0 0 0 2px #4a2868; }
.ticket.concert .ticket-body     { border-right-color: #6a3a8a; }
.ticket.concert .ticket-body::before { background: linear-gradient(90deg, #6a3a8a, #c060e8); }
.ticket.concert .t-details       { border-bottom-color: rgba(180,120,220,0.2); }
.ticket.concert .t-type          { color: #c090e8; border-bottom-color: rgba(192,144,232,0.35); }
.ticket.concert .t-title         { color: #f5e8ff; }
.ticket.concert .t-venue         { color: #8060a0; }
.ticket.concert .t-detail-lbl   { color: #8060a0; }
.ticket.concert .t-detail-val   { color: #e8d0ff; }
.ticket.concert .t-price-box    { border-color: #c060e8; }
.ticket.concert .t-price-lbl    { color: #c060e8; }
.ticket.concert .t-price-val    { color: #d080ff; }
.ticket.concert .t-stamp        { border-color: #7030a8; }
.ticket.concert .t-stamp-text   { color: #a060d8; }
.ticket.concert .t-stub-label   { color: #e8d0ff; }
.ticket.concert .t-stub-num     { color: #8060a0; }
.ticket.concert .t-barcode span { background: #b080d8; }
.ticket.concert .ticket-stub-col { background: rgba(106,58,138,0.15); }}
.ticket.concert .ticket-body { border-right-color: #6a3a8a; }
.ticket.concert .t-type      { color: #c090e8; border-bottom-color: #c090e8; }
.ticket.concert .t-title     { color: #f0e0ff; }
.ticket.concert .t-venue     { color: #9060a8; }
.ticket.concert .t-detail-lbl { color: #9060a8; }
.ticket.concert .t-detail-val { color: #e8d0ff; }
.ticket.concert .t-price-box  { border-color: #d4a0ff; }
.ticket.concert .t-price-lbl  { color: #d4a0ff; }
.ticket.concert .t-price-val  { color: #d4a0ff; }
.ticket.concert .t-stamp      { border-color: #8040c0; }
.ticket.concert .t-stamp-text { color: #8040c0; }
.ticket.concert .t-stub-label { color: #e8d0ff; }
.ticket.concert .t-stub-num   { color: #9060a8; }
.ticket.concert .t-barcode span { background: #c090e8; }

/* ── ORDER SUMMARY ── */
.order-lines { margin-bottom: 28px; }

.order-line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.order-total {
  color: var(--gold);
  font-weight: 700;
  font-size: 17px;
  border-bottom: none;
  margin-top: 4px;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.order-note {
  text-align: center;
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #604030;
  margin-top: 12px;
}

/* ── CONFIRM ── */
.card-confirm { text-align: center; padding: 48px 32px; }
.confirm-icon { font-size: 44px; margin-bottom: 16px; }
.confirm-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 12px;
}
.confirm-sub {
  font-family: var(--font-stamp);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--text-muted);
  line-height: 1.9;
  margin-bottom: 16px;
}
.tracking-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--cream);
  background: rgba(0,0,0,0.35);
  padding: 10px 24px;
  letter-spacing: 5px;
  margin: 8px 0 20px;
}

/* ── COLLECTION ── */
.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-top: 32px;
}

.collection-title {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  color: var(--cream);
}

.collection-sub {
  font-family: var(--font-stamp);
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  margin-top: 4px;
}

.collection-stats { display: flex; gap: 28px; }
.stat { text-align: right; }
.stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gold); display: block; }
.stat-lbl { font-family: var(--font-stamp); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #806848; display: block; }

.filter-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 28px; }

.filter-btn {
  font-family: var(--font-stamp);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active { border-color: var(--gold); color: var(--gold); }

.stubs-grid { display: flex; flex-direction: column; gap: 28px; }

.stub-entry {
  position: relative;
}

.stub-status-badge {
  position: absolute;
  top: -9px;
  right: 16px;
  font-family: var(--font-stamp);
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 3px 10px;
  z-index: 10;
}
.badge-saved     { background: #3a2a1a; color: #a08060; }
.badge-printing  { background: var(--gold); color: var(--dark); }
.badge-shipped   { background: var(--green); color: var(--cream); }
.badge-delivered { background: #3a6010; color: var(--cream); }

/* ── EMPTY STATE ── */
.empty-state { text-align: center; padding: 80px 32px; }
.empty-icon  { font-size: 52px; opacity: 0.25; margin-bottom: 16px; }
.empty-title { font-family: var(--font-display); font-size: 22px; color: var(--cream); margin-bottom: 8px; }
.empty-sub   { font-family: var(--font-stamp); font-size: 12px; color: #806848; letter-spacing: 1px; margin-bottom: 24px; }

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: var(--gold);
  color: var(--dark);
  font-family: var(--font-stamp);
  font-size: 12px;
  letter-spacing: 1.5px;
  padding: 13px 28px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 999;
  white-space: nowrap;
  pointer-events: none;
}
.toast.show { transform: translateX(-50%) translateY(0); }

/* ── RESPONSIVE ── */
@media (max-width: 600px) {
  .header-inner { padding: 12px 16px; }
  .nav-btn { padding: 8px 12px; font-size: 10px; }
  main { padding: 20px 16px 60px; }
  .card { padding: 20px 18px; }
  .form-grid { grid-template-columns: 1fr; }
  .style-grid { grid-template-columns: 1fr; }
  .address-grid { grid-template-columns: 1fr; }
  .collection-header { flex-direction: column; gap: 16px; }
  .action-row { flex-direction: column; }
}
