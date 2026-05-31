/* =========================================================================
   WEB ADMIN — Core: icons, shell, router, dashboard, danh sách đơn
   ========================================================================= */
const ICON = {
  dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  order: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h4"/></svg>',
  cust: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  prod: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7.5 4.27 9 5.15M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
  promo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="m7 14 3-3 3 3 5-5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>',
  export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zM16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m3 17 6-6 4 4 8-8M21 7h-4v4"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 9l5-5 5 5M12 4v12"/></svg>',
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
};

const AV_COLORS = ['oklch(0.55 0.13 250)','oklch(0.55 0.13 160)','oklch(0.58 0.14 30)','oklch(0.52 0.13 300)','oklch(0.55 0.13 200)'];
const avColor = (s) => AV_COLORS[(s||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0) % AV_COLORS.length];
const initials = (s) => s.split(' ').filter(Boolean).slice(-2).map(w=>w[0]).join('').toUpperCase();

/* ---------------- App state ---------------- */
const APP = {
  screen: 'dash',
  // đơn đang soạn — mặc định khách VIP để minh hoạ đầy đủ chương trình
  order: {
    ma: null,            // null = đơn nháp mới
    trangThai: 'Nháp',
    ref: null,           // trỏ tới bản ghi trong TD.orders khi mở đơn cũ
    custMa: 'ETC-NT-051',
    tdvMa: 'TDV-01',
    lines: [
      { maSP: 'SP-001', soLuong: 44, suDungGiaThung: true },
      { maSP: 'SP-002', soLuong: 30, suDungGiaThung: true },
      { maSP: 'SP-004', soLuong: 60, suDungGiaThung: true },
      { maSP: 'SP-005', soLuong: 80, suDungGiaThung: true },
    ],
  },
  tweaks: { theme: 'blue', layout: 'side' },
  q: '',                                   // từ khoá tìm kiếm toàn cục
  seg: { products: 'Tất cả', orders: 'Tất cả', customers: 'Tất cả' }, // tab lọc theo màn
  notiOpen: false,
};

/* tiện ích lọc */
function matchQ(q, ...fields) {
  if (!q) return true;
  const s = q.toLowerCase();
  return fields.some(f => (f || '').toString().toLowerCase().includes(s));
}

const NAV = [
  { g: 'Tổng quan' },
  { id: 'dash', t: 'Dashboard', ic: 'dash' },
  { id: 'order', t: 'Xử lý đơn hàng', ic: 'calc' },
  { id: 'orders', t: 'Danh sách đơn', ic: 'order', count: () => TD.orders.length },
  { g: 'Danh mục' },
  { id: 'customers', t: 'Khách hàng', ic: 'cust', count: () => TD.customers.length },
  { id: 'products', t: 'Sản phẩm & Báo giá', ic: 'prod', count: () => TD.products.length },
  { id: 'promos', t: 'Chương trình KM', ic: 'promo' },
  { g: 'Phân tích' },
  { id: 'reports', t: 'Báo cáo & Kết xuất', ic: 'report' },
];

const TITLES = {
  dash: ['Dashboard', 'Tổng quan vận hành'],
  order: ['Xử lý đơn hàng', 'Bộ máy tính giá & khuyến mãi tự động'],
  orders: ['Danh sách đơn', 'Theo dõi & xử lý đơn hàng'],
  customers: ['Khách hàng', 'Danh mục nhà thuốc · phòng khám · bệnh viện'],
  products: ['Sản phẩm & Báo giá', 'Bảng báo giá BBG 2026'],
  promos: ['Chương trình khuyến mãi', 'Cấu hình & quản lý chương trình'],
  reports: ['Báo cáo & Kết xuất', 'Tổng hợp doanh số · xuất dữ liệu'],
};

function go(screen) { APP.screen = screen; render(); window.scrollTo(0,0); }

// mở sẵn 1 màn qua URL hash (dùng cho preview iframe)
(function(){ const h = (location.hash||'').replace('#',''); if (h && TITLES[h]) APP.screen = h; })();

/* ---------------- Render shell ---------------- */
function renderContent() {
  const c = document.getElementById('content');
  if (!c) return;
  ({ dash: renderDash, order: renderOrder, orders: renderOrders,
     customers: renderCustomers, products: renderProducts,
     promos: renderPromos, reports: renderReports }[APP.screen] || renderDash)(c);
}

function render() {
  document.documentElement.setAttribute('data-theme', APP.tweaks.theme);
  const root = document.getElementById('app');
  root.innerHTML = `
    <aside class="sidebar">
      <div class="sb-brand">
        <img src="assets/logo-tamdan.png" alt="Tâm Đan"/>
      </div>
      <nav class="sb-nav">${NAV.map(navItem).join('')}</nav>
      <div class="sb-foot">
        <div class="av">QT</div>
        <div><div class="nm">Quản trị viên</div><div class="rl">NV Xử lý đơn</div></div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div><h1>${TITLES[APP.screen][0]}</h1></div>
        <div class="search">${ICON.search}<input id="globalSearch" placeholder="Tìm khách, sản phẩm, mã đơn..." value="${APP.q.replace(/"/g,'&quot;')}"/></div>
        <button class="ic-btn" id="bellBtn">${ICON.bell}<span class="dot"></span></button>
        <div id="notiWrap"></div>
      </header>
      <div id="content"></div>
    </div>`;
  root.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => go(b.dataset.nav));

  // tìm kiếm toàn cục — chỉ vẽ lại nội dung để không mất focus
  const si = root.querySelector('#globalSearch');
  si.oninput = () => {
    APP.q = si.value;
    const onList = ['products','orders','customers','reports'].includes(APP.screen);
    if (!onList) go('products'); else renderContent();
  };
  // chuông thông báo
  root.querySelector('#bellBtn').onclick = (e) => { e.stopPropagation(); toggleNoti(); };

  renderContent();
}

function navItem(n) {
  if (n.g) return `<div class="sb-group">${n.g}</div>`;
  const active = APP.screen === n.id ? ' active' : '';
  let right = '';
  if (n.badge === 'star') right = `<span class="count" style="background:var(--accent)">★</span>`;
  else if (n.count) right = `<span class="count">${n.count()}</span>`;
  return `<button class="sb-item${active}" data-nav="${n.id}">${ICON[n.ic]}<span>${n.t}</span>${right}</button>`;
}

/* ---- helpers lọc & trạng thái rỗng ---- */
function segHtml(items, active) {
  return `<div class="seg">${items.map(s => `<button class="${s === active ? 'on' : ''}" data-seg="${s}">${s}</button>`).join('')}</div>`;
}
function bindSeg(c, screen) {
  c.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { APP.seg[screen] = b.dataset.seg; renderContent(); });
}
function emptyHtml(msg) {
  return `<div class="empty-state"><div class="es-ic">${ICON.search}</div><div class="es-t">${msg}</div></div>`;
}

/* ---------------- Dashboard ---------------- */
function renderDash(c) {
  const tongDS = TD.orders.reduce((s,o)=>s+o.tong,0);
  const choXuLy = TD.orders.filter(o=>o.trangThai==='Chờ xử lý').length;
  const ghpGan = TD.customers.filter(k=>TD.trangThaiGDP(k).code!=='con').length;
  const canHan = TD.products.filter(p=>TD.thangConHan(p.hanDung)<=14).length;

  const kpis = [
    { lbl:'Doanh số tháng 05', ic:'trend', col:'var(--primary)', bg:'var(--primary-50)', val:(tongDS/1e6).toFixed(1), unit:' tr ₫', delta:'+18,2%', up:true },
    { lbl:'Đơn chờ xử lý', ic:'clock', col:'var(--warn)', bg:'var(--warn-50)', val:choXuLy, unit:' đơn', delta:'cần xử lý hôm nay', up:null },
    { lbl:'Khách cảnh báo GP', ic:'warn', col:'var(--danger)', bg:'var(--danger-50)', val:ghpGan, unit:' khách', delta:'hạn giấy phép GDP', up:false },
    { lbl:'SP cận hạn dùng', ic:'spark', col:'var(--accent)', bg:'var(--accent-50)', val:canHan, unit:' mã', delta:'ưu tiên FEFO', up:null },
  ];

  const months = [['T12',31.2],['T01',28.7],['T02',24.1],['T03',35.6],['T04',38.9],['T05',46.2]];
  const maxM = Math.max(...months.map(m=>m[1]));

  c.innerHTML = `<div class="screen">
    <div class="kpi-grid">${kpis.map(k=>`
      <div class="card kpi">
        <div class="lbl"><span class="ic" style="background:${k.bg};color:${k.col}">${ICON[k.ic]}</span>${k.lbl}</div>
        <div class="val num">${k.val}<small>${k.unit}</small></div>
        <div class="delta ${k.up===true?'up':k.up===false?'down':''}">${k.delta}</div>
      </div>`).join('')}
    </div>

    <div class="dash-grid">
      <div class="card panel">
        <div class="panel-head"><span class="pt">Doanh số 6 tháng gần nhất</span><span class="pa">Triệu ₫</span></div>
        <div class="bars">${months.map((m,i)=>`
          <div class="bar-col">
            <div class="bv num">${m[1]}</div>
            <div class="bar ${i===months.length-1?'alt':''}" style="height:${m[1]/maxM*100}%"></div>
            <div class="bl">${m[0]}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="card panel">
        <div class="panel-head"><span class="pt">Cảnh báo cần xử lý</span></div>
        ${dashAlert('danger','warn','Khách hết hạn giấy phép','NT Phước Thành (OTC-TP-145) — GDP hết hạn 15/05/2025, bị chặn lên đơn.')}
        ${dashAlert('warn','clock','Giấy phép sắp hết hạn','NT Minh Châu còn 28 ngày — nhắc khách gia hạn GDP.')}
        ${dashAlert('warn','spark','Sản phẩm cận hạn dùng','Siro ho Prospan (SP-006) còn 14 tháng — ưu tiên xuất trước (FEFO).')}
        ${dashAlert('primary','order','5 đơn mới từ TDV','Chờ nhân viên xử lý kiểm tra & duyệt.')}
      </div>
    </div>

    <div class="card panel" style="margin-top:16px">
      <div class="panel-head"><span class="pt">Đơn gần đây</span><span class="pa" data-nav-link="orders" style="cursor:pointer">Xem tất cả →</span></div>
      ${ordersTable(TD.orders.slice(0,5))}
    </div>
  </div>`;
  c.querySelector('[data-nav-link]')?.addEventListener('click',()=>go('orders'));
  bindOrdersTable(c);
}

function dashAlert(level, ic, t, d) {
  const map = { danger:['var(--danger-50)','var(--danger)'], warn:['var(--warn-50)','oklch(0.55 0.13 60)'], primary:['var(--primary-50)','var(--primary)'] };
  const [bg,col] = map[level];
  return `<div class="alert-row"><div class="ai" style="background:${bg};color:${col}">${ICON[ic]}</div>
    <div><div class="at">${t}</div><div class="ad">${d}</div></div></div>`;
}

/* ---------------- Danh sách đơn ---------------- */
function statusBadge(s) {
  const m = { 'Chờ xử lý':'badge-warn', 'Đã duyệt':'badge-blue', 'Đã in':'badge-green', 'Nháp':'badge-gray', 'Đã hủy':'badge-danger' };
  return `<span class="badge ${m[s]||'badge-gray'}">${s}</span>`;
}

/* mở đơn cũ từ danh sách — nạp đúng dữ liệu & trạng thái */
function openOrder(ma) {
  const o = TD.orders.find(x => x.ma === ma);
  if (!o) return go('order');
  o.lines = o.lines || [];
  APP.order = { ma: o.ma, trangThai: o.trangThai, ref: o, custMa: o.khach, tdvMa: o.tdv,
    lines: o.lines, duyetBoi: o.duyetBoi, duyetLuc: o.duyetLuc };
  go('order');
}

/* tạo đơn nháp mới */
function newDraft(custMa) {
  APP.order = { ma: null, trangThai: 'Nháp', ref: null,
    custMa: custMa || 'ETC-NT-051', tdvMa: 'TDV-01',
    lines: [ { maSP:'SP-001', soLuong:44, suDungGiaThung:true }, { maSP:'SP-002', soLuong:30, suDungGiaThung:true },
             { maSP:'SP-004', soLuong:60, suDungGiaThung:true }, { maSP:'SP-005', soLuong:80, suDungGiaThung:true } ] };
  go('order');
}
function ordersTable(list) {
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>
    <th>Mã đơn</th><th>Khách hàng</th><th>TDV</th><th>Kênh</th><th>Ngày</th><th class="r">Tổng tiền</th><th>Trạng thái</th>
  </tr></thead><tbody>${list.map(o=>{
    const kh = TD.findCustomer(o.khach), tdv = TD.findTDV(o.tdv);
    return `<tr data-open-order="${o.ma}"><td><span class="code">${o.ma}</span></td>
      <td class="cell-2"><div class="strong">${kh?kh.ten:o.khach}</div><div class="s">${o.khach}</div></td>
      <td><div class="flex"><span class="av-sm" style="background:${avColor(o.tdv)}">${initials(tdv?tdv.ten:'?')}</span>${tdv?tdv.ten:o.tdv}</div></td>
      <td>${o.kenh}</td><td class="num">${o.ngay.split('-').reverse().join('/')}</td>
      <td class="r num strong">${TD.fmtVnd(o.tong)}</td><td>${statusBadge(o.trangThai)}</td></tr>`;
  }).join('')}</tbody></table></div>`;
}
function bindOrdersTable(c) {
  c.querySelectorAll('[data-open-order]').forEach(tr => tr.onclick = () => openOrder(tr.dataset.openOrder));
}

function renderOrders(c) {
  const list = TD.orders.filter(o => {
    const kh = TD.findCustomer(o.khach);
    return (APP.seg.orders === 'Tất cả' || o.trangThai === APP.seg.orders)
      && matchQ(APP.q, o.ma, o.khach, kh && kh.ten, o.kenh);
  });
  c.innerHTML = `<div class="screen">
    <div class="screen-head">
      <div><div class="t">Danh sách đơn hàng</div><div class="d">Tháng 05/2026 · ${list.length}/${TD.orders.length} đơn</div></div>
      <div class="actions"><button class="btn btn-ghost btn-sm" id="expOrders">${ICON.export} Xuất Excel</button>
      <button class="btn btn-primary btn-sm" id="newOrder">${ICON.plus} Tạo đơn mới</button></div>
    </div>
    <div class="toolbar">
      ${segHtml(['Tất cả','Chờ xử lý','Đã duyệt','Đã in'], APP.seg.orders)}
    </div>
    ${list.length ? ordersTable(list) : emptyHtml('Không có đơn phù hợp bộ lọc')}
  </div>`;
  c.querySelector('#newOrder').onclick = () => newDraft();
  c.querySelector('#expOrders').onclick = () => exportOrders(list);
  bindSeg(c, 'orders');
  bindOrdersTable(c);
}
