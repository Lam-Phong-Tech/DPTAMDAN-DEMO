/* =========================================================================
   MOBILE APP (TDV) — luồng tạo đơn tại điểm bán
   ========================================================================= */
const MI = {
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zM16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M1 1h3l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
};
const MAV = ['oklch(0.55 0.13 250)','oklch(0.55 0.13 160)','oklch(0.58 0.14 30)','oklch(0.52 0.13 300)','oklch(0.55 0.13 200)'];
const mColor = (s)=>MAV[(s||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%MAV.length];
const mInit = (s)=>s.split(' ').filter(Boolean).slice(-2).map(w=>w[0]).join('').toUpperCase();

const MOBILE = {
  screen: 'login',
  tdvMa: 'TDV-01',
  custMa: null,
  lines: [],
};

function mGo(s){ MOBILE.screen = s; mRender(); }

function mRender() {
  document.documentElement.setAttribute('data-theme', 'blue');
  const screen = document.getElementById('mscreen');
  const fn = { login:mLogin, home:mHome, pickCust:mPickCust, build:mBuild, success:mSuccess }[MOBILE.screen];
  screen.innerHTML = `<div class="notch"></div>
    <div class="statusbar"><span>9:41</span><span class="r">●●● 5G ▪▪▪▪</span></div>
    ${fn()}
    <div class="home-ind"></div>`;
  bindCommon(screen);
  ({ login:bindLogin, home:bindHome, pickCust:bindPickCust, build:bindBuild, success:bindSuccess }[MOBILE.screen])(screen);
}
function bindCommon(s){ s.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>mGo(b.dataset.back)); }

/* ---------- Login ---------- */
function mLogin() {
  return `<div class="m-body"><div class="m-login">
    <div class="logo"><img src="assets/logo-tamdan.png" alt="Tâm Đan"/></div>
    <h2>Trình dược viên</h2>
    <p>Tạo & gửi đơn ngay tại điểm bán</p>
    <div class="m-field"><label>Số điện thoại</label><input value="0903 552 118" inputmode="tel"/></div>
    <div class="m-field"><label>Mật khẩu</label><input type="password" value="••••••••"/></div>
    <button class="m-btn lg" id="mLoginBtn" style="margin-top:8px">Đăng nhập</button>
    <p style="margin-top:18px;font-size:12px">TDV-01 · Nguyễn Thị Hồng</p>
  </div></div>`;
}
function bindLogin(s){ s.querySelector('#mLoginBtn').onclick=()=>mGo('home'); }

/* ---------- Home ---------- */
function mHome() {
  const tdv = TD.findTDV(MOBILE.tdvMa);
  const myOrders = TD.orders.filter(o=>o.tdv===MOBILE.tdvMa);
  const doanhSo = (myOrders.reduce((s,o)=>s+o.tong,0)/1e6).toFixed(1);
  return `<div class="m-head grad">
      <div><div class="hi">Xin chào,</div><div class="nm">${tdv.ten}</div></div>
      <div class="m-av">${mInit(tdv.ten)}</div>
    </div>
    <div class="m-body"><div class="m-pad">
      <div class="cta-card">
        <div class="ct">Tạo đơn hàng mới</div>
        <div class="cd">Hệ thống tự tính giá, hàng tặng & khuyến mãi</div>
        <button class="cb" id="mNew">${MI.plus} Bắt đầu tạo đơn</button>
      </div>
      <div class="m-stat-row">
        <div class="m-stat"><div class="v">${myOrders.length}</div><div class="l">Đơn tháng</div></div>
        <div class="m-stat"><div class="v">${doanhSo}</div><div class="l">Triệu ₫</div></div>
        <div class="m-stat"><div class="v">${tdv.nhom.includes('Bệnh')?'BV/PK':'Q1–3'}</div><div class="l">Khu vực</div></div>
      </div>
      <div class="m-sec-lbl">Đơn của tôi</div>
      ${myOrders.map(o=>{ const kh=TD.findCustomer(o.khach); const sb=mStatusPill(o.trangThai);
        return `<div class="m-order"><div style="min-width:0"><div class="oc">${o.ma}</div>
          <div class="on">${kh?kh.ten:o.khach}</div><div class="od">${o.ngay.split('-').reverse().join('/')} · ${o.kenh}</div></div>
          <div class="ov"><div class="ot">${TD.fmt(o.tong/1e6)}tr</div><div style="margin-top:4px">${sb}</div></div></div>`;
      }).join('') || '<div style="color:var(--ink-mute);font-size:13px;padding:10px 2px">Chưa có đơn nào.</div>'}
    </div></div>`;
}
function mStatusPill(s){ const m={'Chờ xử lý':['var(--warn-50)','oklch(0.5 0.12 60)'],'Đã duyệt':['var(--primary-50)','var(--primary-700)'],'Đã in':['var(--accent-50)','oklch(0.42 0.11 158)']}; const [bg,c]=m[s]||['var(--surface-2)','var(--ink-soft)']; return `<span class="m-pill" style="background:${bg};color:${c}">${s}</span>`; }
function bindHome(s){ s.querySelector('#mNew').onclick=()=>{ MOBILE.custMa=null; MOBILE.lines=[]; mGo('pickCust'); }; }

/* ---------- Chọn khách ---------- */
function mPickCust() {
  const list = TD.customers.map(k=>{
    const gdp = TD.trangThaiGDP(k); const blocked = gdp.code==='het';
    const pill = mGdpPill(gdp);
    return `<div class="m-cust ${blocked?'blocked':''}" data-pick="${k.ma}" data-blocked="${blocked}">
      <div class="ava" style="background:${mColor(k.ma)}">${mInit(k.ten)}</div>
      <div style="min-width:0;flex:1"><div class="cn">${k.ten}</div><div class="cm">${k.ma} · ${k.quan} · ${k.nhomKhach}</div></div>
      <div class="m-gdp">${pill}</div></div>`;
  }).join('');
  return `<div class="m-head"><button class="m-back" data-back="home">${MI.back}</button><div class="m-title">Chọn khách hàng</div></div>
    <div class="m-body"><div class="m-pad" style="padding-top:0">
      <div class="m-search">${MI.search}<input placeholder="Tìm theo tên, mã, khu vực..."/></div>
      <div class="m-sec-lbl">Khách phụ trách</div>${list}
    </div></div>`;
}
function mGdpPill(gdp){ const m={ok:['var(--accent-50)','oklch(0.42 0.11 158)','Còn hạn'],warn:['var(--warn-50)','oklch(0.5 0.12 60)',gdp.days+'n'],danger:['var(--danger-50)','var(--danger)','Hết hạn']}; const [bg,c,t]=m[gdp.level]; return `<span class="m-pill" style="background:${bg};color:${c}"><span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>${t}</span>`; }
function bindPickCust(s){
  s.querySelectorAll('[data-pick]').forEach(el=>el.onclick=()=>{
    if(el.dataset.blocked==='true'){ mToast('Khách đã hết hạn giấy phép GDP — không thể lên đơn (BR-15)','danger'); return; }
    MOBILE.custMa = el.dataset.pick;
    MOBILE.lines = [{maSP:'SP-001',soLuong:120},{maSP:'SP-002',soLuong:60},{maSP:'SP-010',soLuong:90}];
    mGo('build');
  });
}

/* ---------- Soạn đơn ---------- */
function mBuild() {
  const kh = TD.findCustomer(MOBILE.custMa);
  const lines = MOBILE.lines.map(l=>({...l, suDungGiaThung:true}));
  const kq = TD.tinhDon(kh, lines);
  const gdp = TD.trangThaiGDP(kh);

  let warns = kq.canhBao.map(w=>`<div class="m-warn ${w.level}">${MI.warn}<div class="wt">${w.text}</div></div>`).join('');
  const canHanLines = kq.rows.filter(r=>r.canHan);
  if (canHanLines.length) warns += `<div class="m-warn warn">${MI.warn}<div class="wt">${canHanLines.length} sản phẩm cận hạn dùng — ưu tiên xuất lô gần hết hạn (FEFO).</div></div>`;

  const linesHtml = kq.rows.map((r,i)=>{
    const pkColor = {thung:'oklch(0.42 0.11 158)',hop:'var(--ink-mute)','mot-gia':'var(--ink-mute)',thau:'var(--primary-700)'}[r.loaiGia];
    return `<div class="m-line ${r.canHan?'warn':''}">
      <div class="l-top">
        <div style="flex:1"><div class="l-nm">${r.sp.ten}</div>
          <div class="l-meta"><span class="mono">${r.sp.ma}</span> · ${r.sp.nhomHang}${r.tang>0?` · <span style="color:oklch(0.42 0.11 158);font-weight:700">tặng +${r.tang}</span>`:''}${r.canHan?' · <span style="color:oklch(0.5 0.12 60);font-weight:700">⚠ cận hạn</span>':''}</div></div>
        <button class="l-rm" data-rm="${i}">${MI.x}</button>
      </div>
      <div class="l-bot">
        <div class="stepper"><button data-dec="${i}">−</button><span class="sv">${r.soLuong}</span><button data-inc="${i}">+</button></div>
        <div class="l-price"><div class="l-pk" style="color:${pkColor}">${({thung:'Giá thùng',hop:'Giá hộp','mot-gia':'Một giá',thau:'Giá thầu'})[r.loaiGia]} ${TD.fmt(r.donGia)}</div>
          <div class="l-tot">${TD.fmt(r.thanhTien)} ₫</div></div>
      </div></div>`;
  }).join('');

  let promo = '';
  if (kq.quaTang.length || kq.duLich || kq.hopDongNam) {
    const gifts = kq.quaTang.map(g=>`<div class="pgift"><span class="pq">+${g.sl} ${g.dvt}</span> ${g.ten} <span class="m-pill" style="background:#fff;color:var(--ink-soft);margin-left:auto;border:1px solid var(--accent-100)">${g.nguon}</span></div>`).join('');
    const dien = kq.dien.slice(0,3).map(d=>`<div class="m-dien">${d}</div>`).join('');
    promo = `<div class="promo-card"><div class="ph">${MI.gift} Khuyến mãi tự động</div>${gifts}${dien}</div>`;
  }

  const blocked = kq.canhBao.some(w=>w.chan);
  return `<div class="m-head"><button class="m-back" data-back="pickCust">${MI.back}</button><div class="m-title">Tạo đơn</div></div>
    <div class="m-body"><div class="m-pad" style="padding-top:0">
      <div class="sel-cust"><div class="ava" style="background:${mColor(kh.ma)}">${mInit(kh.ten)}</div>
        <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px">${kh.ten}${kh.hopDongNam?' ★':''}</div>
          <div style="font-size:11.5px;color:var(--ink-mute)">${kh.ma} · ${kh.quan}</div></div>
        ${mGdpPill(gdp)}</div>
      ${warns}
      <div class="m-sec-lbl">Sản phẩm (${kq.rows.length})</div>
      ${linesHtml}
      <button class="add-prod-btn" id="mAddProd">${MI.plus} Thêm sản phẩm</button>
      ${promo}
    </div></div>
    <div class="m-bar">
      <div><div class="bt-lbl">Tổng cộng${kq.tongTang?` · tặng ${kq.tongTang}h`:''}</div><div class="bt-val">${TD.fmt(kq.tongTien)} ₫</div></div>
      <button class="m-btn" id="mSend" ${blocked?'disabled':''}>Gửi đơn ${MI.cart}</button>
    </div>
    ${mSheet()}`;
}
function bindBuild(s) {
  s.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{ MOBILE.lines[+b.dataset.inc].soLuong++; mGo('build'); });
  s.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.dec; MOBILE.lines[i].soLuong=Math.max(1,MOBILE.lines[i].soLuong-1); mGo('build'); });
  s.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ MOBILE.lines.splice(+b.dataset.rm,1); mGo('build'); });
  s.querySelector('#mSend').onclick=()=>{ if(!s.querySelector('#mSend').disabled) mGo('success'); };
  const sheet = s.querySelector('#mSheet');
  s.querySelector('#mAddProd').onclick=()=>sheet.classList.add('open');
  sheet.onclick=(e)=>{ if(e.target===sheet) sheet.classList.remove('open'); };
  sheet.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
    MOBILE.lines.push({maSP:b.dataset.add, soLuong:10}); mGo('build');
  });
}
function mSheet() {
  const used = new Set(MOBILE.lines.map(l=>l.maSP));
  const items = TD.products.filter(p=>!used.has(p.ma)).map(p=>`<div class="pick-item">
    <div style="flex:1"><div class="pi-nm">${p.ten}</div><div class="pi-m"><span class="mono">${p.ma}</span> · ${p.nhomHang} · ${TD.fmt(p.giaHop)}₫/hộp${p.tang?` · tặng ${p.tang}`:''}</div></div>
    <button class="pi-add" data-add="${p.ma}">${MI.plus}</button></div>`).join('');
  return `<div class="sheet-mask" id="mSheet"><div class="sheet">
    <div class="sheet-grab"></div>
    <div class="sheet-head"><span class="st">Thêm sản phẩm</span></div>
    <div class="sheet-body">${items||'<div style="padding:20px;text-align:center;color:var(--ink-mute)">Đã thêm hết sản phẩm.</div>'}</div>
  </div></div>`;
}

/* ---------- Success ---------- */
function mSuccess() {
  const kh = TD.findCustomer(MOBILE.custMa);
  return `<div class="m-body"><div class="m-success">
    <div class="ok-ic">${MI.check}</div>
    <h2>Đã gửi đơn!</h2>
    <p>Đơn <span class="code">06-05-2026</span> cho</p>
    <p style="font-weight:600;color:var(--ink)">${kh.ten}</p>
    <p style="margin-top:14px">Đơn đã chuyển về Web Admin,<br>trạng thái <b style="color:oklch(0.5 0.12 60)">“Chờ xử lý”</b>.</p>
    <div style="width:100%;margin-top:30px;display:flex;flex-direction:column;gap:10px">
      <button class="m-btn" id="mAgain">Tạo đơn khác</button>
      <button class="m-btn ghost" id="mHomeBtn">Về trang chủ</button>
    </div>
  </div></div>`;
}
function bindSuccess(s){
  s.querySelector('#mAgain').onclick=()=>{ MOBILE.custMa=null; MOBILE.lines=[]; mGo('pickCust'); };
  s.querySelector('#mHomeBtn').onclick=()=>mGo('home');
}

/* ---------- toast ---------- */
function mToast(msg, level) {
  const wrap = document.getElementById('mscreen');
  const t = document.createElement('div');
  const col = level==='danger'?'var(--danger)':'var(--accent)';
  t.style.cssText=`position:absolute;bottom:90px;left:20px;right:20px;background:var(--ink);color:#fff;padding:13px 16px;border-radius:13px;font-size:12.5px;font-weight:600;z-index:90;display:flex;gap:9px;align-items:center;box-shadow:var(--shadow-lg);opacity:0;transition:opacity .2s`;
  t.innerHTML=`<span style="color:${col};flex-shrink:0">${MI.warn}</span>${msg}`;
  wrap.appendChild(t); requestAnimationFrame(()=>t.style.opacity='1');
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),250);},2800);
}

mRender();
