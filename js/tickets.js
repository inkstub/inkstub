/* tickets.js — Ticket HTML generation */

function buildBarcode() {
  const heights = [20,13,22,11,17,24,15,19,11,23,15,20,13,24,17,13,21,11,18];
  return heights.map(h => `<span style="height:${h}px"></span>`).join('');
}

function buildLogoHTML(logo, placement) {
  if (!logo) return { top: '', left: '', watermark: '' };
  const top = placement === 'top'
    ? `<img class="t-logo-top" src="${logo}" alt="Team logo">` : '';
  const left = placement === 'left'
    ? `<img class="t-logo-left" src="${logo}" alt="Team logo">` : '';
  const watermark = placement === 'watermark'
    ? `<img class="t-logo-watermark" src="${logo}" alt="Team logo">` : '';
  return { top, left, watermark };
}

function buildTicketHTML(data) {
  const { name, type, venue, date, seat, price, style, logo, logoPlacement } = data;
  const placement = logoPlacement || 'left';
  const shortName = name.length > 20 ? name.substring(0, 18) + '…' : name;
  const stubNum = 'No. ' + String(Math.floor(Math.random() * 90000) + 10000);
  const logoHtml = buildLogoHTML(logo, placement);

  const titleRow = logoHtml.left
    ? `<div style="display:flex;align-items:center;margin-bottom:4px">${logoHtml.left}<div class="t-title">${name}</div></div>`
    : `<div class="t-title">${name}</div>`;

  return `
    <div class="ticket-wrap-outer glow-${style}">
      <div class="ticket ${style}">
        <div class="ticket-grain"></div>
        <div class="ticket-notch-bottom"></div>
        ${logoHtml.watermark}

        <div class="ticket-body">
          ${logoHtml.top}
          <div class="t-type">${type}</div>
          ${titleRow}
          <div class="t-venue">${venue}</div>
          <div class="t-details">
            <div>
              <span class="t-detail-lbl">Date</span>
              <span class="t-detail-val">${date || '—'}</span>
            </div>
            <div>
              <span class="t-detail-lbl">Seat</span>
              <span class="t-detail-val">${seat || 'GA'}</span>
            </div>
          </div>
          <div class="t-bottom-row">
            <div class="t-price-box">
              <span class="t-price-lbl">Admit One</span>
              <span class="t-price-val">${price || '$0.00'}</span>
            </div>
            <div class="t-stamp">
              <div class="t-stamp-text">STUB<br>KEEPSAKE<br>✦</div>
            </div>
          </div>
        </div>

        <div class="ticket-stub-col">
          <div>
            <div class="t-stub-label">${shortName}</div>
            <div class="t-stub-num">${stubNum}</div>
          </div>
          <div class="t-barcode">${buildBarcode()}</div>
        </div>
      </div>
    </div>
  `;
}

function buildCollectionEntryHTML(item) {
  const badgeClass = {
    'Saved':     'badge-saved',
    'Printing':  'badge-printing',
    'Shipped':   'badge-shipped',
    'Delivered': 'badge-delivered'
  }[item.status] || 'badge-saved';

  return `
    <div class="stub-entry">
      <span class="stub-status-badge ${badgeClass}">${item.status}</span>
      ${buildTicketHTML(item)}
      <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; padding: 0 4px;">
        <span style="font-family:var(--font-stamp); font-size:10px; letter-spacing:2px; color:#604030;">
          ${item.tracking || ''}
        </span>
        <span style="font-family:var(--font-stamp); font-size:10px; letter-spacing:1px; color:var(--text-muted);">
          Added ${item.addedDate || ''}
        </span>
      </div>
    </div>
  `;
}
