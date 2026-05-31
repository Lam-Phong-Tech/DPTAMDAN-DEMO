/* =========================================================================
   WEB ADMIN — Khách hàng · Sản phẩm · Khuyến mãi · Báo cáo · In đơn
   ========================================================================= */

/* ---------------- Khách hàng ---------------- */
function renderCustomers(c) {
  const warnCount = TD.customers.filter(k => TD.trangThaiGDP(k).code !== 'con').length;
  const list = TD.customers.filter(k => {
    const gdp = TD.trangThaiGDP(k);
    return (APP.seg.customers === 'Tất cả' || k.nhomKhach === APP.seg.customers)
      && (!APP.custWarnOnly || gdp.code !== 'con')
      && matchQ(APP.q, k.ma, k.ten, k.nguoiLH, k.sdt, k.quan, k.diaChi);
  });
  const rows = list.map(k=>{
    const gdp = TD.trangThaiGDP(k);
    const gb = { ok:'badge-green', warn:'badge-warn', danger:'badge-danger' }[gdp.level];
    const nb = k.nhomKhach==='Bệnh viện'?'badge-blue':k.nhomKhach==='Phòng khám'?'badge-green':'badge-gray';
    return `<tr data-cust="${k.ma}">
      <td><span class="code">${k.ma}</span></td>
      <td class="cell-2"><div class="strong">${k.ten}</div><div class="s">${k.nguoiLH} · ${k.sdt}</div></td>
      <td><span class="badge ${nb}">${k.nhomKhach}</span> <span class="badge badge-gray">${k.loai}</span></td>
      <td class="cell-2"><div>${k.quan}</div><div class="s">${k.diaChi}</div></td>
      <td>${k.thanhToan}</td>
      <td>${k.hopDongNam?`<span class="badge badge-blue">★ ${k.hopDongNam.ma} · ${k.hopDongNam.camKet}tr</span>`:'<span class="s" style="color:var(--ink-mute)">—</span>'}</td>
      <td><span class="badge ${gb}"><span class="dot" style="background:currentColor"></span>${gdp.code==='het'?'Hết hạn':gdp.code==='gan'?gdp.days+' ngày':'Còn hạn'}</span></td>
      <td class="c"><div class="row-acts"><button class="row-act" data-cedit="${k.ma}" title="Sửa">${ICON.edit}</button><button class="row-act danger" data-cdel="${k.ma}" title="Xóa">${ICON.trash}</button></div></td>
    </tr>`;
  }).join('');

  c.innerHTML = `<div class="screen">
    <div class="screen-head"><div><div class="t">Khách hàng</div><div class="d">${list.length}/${TD.customers.length} cơ sở · cảnh báo hạn giấy phép GDP tự động</div></div>
      <div class="actions"><button class="btn btn-ghost btn-sm" id="impCust">${ICON.upload} Nhập từ Excel</button><button class="btn btn-ghost btn-sm" id="expCust">${ICON.export} Xuất Excel</button><button class="btn btn-primary btn-sm" id="addCust">${ICON.plus} Thêm khách hàng</button></div></div>
    <div class="toolbar">${segHtml(['Tất cả','Nhà thuốc','Phòng khám','Bệnh viện'], APP.seg.customers)}
      <button class="filter-pill" id="warnPill" style="cursor:pointer;${APP.custWarnOnly?'background:var(--danger-50);':''}border-color:oklch(0.85 0.06 26);color:var(--danger)">${ICON.warn} ${warnCount} khách cảnh báo</button></div>
    ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th>Mã KH</th><th>Cơ sở / Liên hệ</th><th>Nhóm</th><th>Khu vực</th><th>Thanh toán</th><th>HĐ năm</th><th>Giấy phép</th><th class="c"></th>
    </tr></thead><tbody>${rows}</tbody></table></div>` : emptyHtml('Không tìm thấy khách hàng phù hợp')}
  </div>${drawerHtml()}${custFormHtml()}`;
  bindSeg(c, 'customers');
  c.querySelector('#addCust').onclick = () => openCustomerForm(c);
  c.querySelector('#expCust').onclick = () => exportCustomers(list);
  c.querySelector('#impCust').onclick = () => toast('Nhập Excel: bản demo — hãy dùng “Thêm khách hàng” để nhập tay', 'ok');
  c.querySelector('#warnPill').onclick = () => { APP.custWarnOnly = !APP.custWarnOnly; renderContent(); };
  c.querySelectorAll('[data-cust]').forEach(tr=>tr.onclick=()=>openCustDrawer(c, tr.dataset.cust));
  c.querySelectorAll('[data-cedit]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); openCustomerForm(c, b.dataset.cedit); });
  c.querySelectorAll('[data-cdel]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); delCustomer(b.dataset.cdel); });
}

function delCustomer(ma) {
  const k = TD.findCustomer(ma);
  confirmDialog(`Xóa khách hàng “${k.ten}” (${ma})?`, 'Cơ sở sẽ bị gỡ khỏi danh mục.', () => {
    TD.customers = TD.customers.filter(x => x.ma !== ma);
    renderContent();
    toast(`Đã xóa ${ma}`, 'ok');
  });
}

function openCustDrawer(c, ma) {
  const k = TD.findCustomer(ma); const gdp = TD.trangThaiGDP(k); const tdv = TD.findTDV(k.tdv);
  const mask = c.querySelector('#drawer');
  mask.querySelector('.drawer-head').innerHTML = `<div class="ava" style="width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-weight:700;color:#fff;background:${avColor(k.ma)}">${initials(k.ten)}</div>
    <div><div style="font-weight:700;font-size:16px">${k.ten}</div><div style="font-size:12.5px;color:var(--ink-mute)" class="mono">${k.ma}</div></div>
    <button class="x-btn" id="dx">${ICON.x}</button>`;
  const gb = { ok:'badge-green', warn:'badge-warn', danger:'badge-danger' }[gdp.level];
  mask.querySelector('.drawer-body').innerHTML = `
    <div class="warn-banner ${gdp.level==='ok'?'warn':gdp.level}" style="${gdp.level==='ok'?'background:var(--accent-50);border-color:var(--accent-100)':''}">
      <span class="wi">${gdp.level==='danger'?ICON.warn:ICON.check}</span>
      <div><div class="wt" style="${gdp.level==='ok'?'color:oklch(0.42 0.11 158)':''}">${gdp.label}</div>
      <div style="font-size:12px;color:var(--ink-soft);margin-top:2px">Cấp ${k.gdpCap.split('-').reverse().join('/')} · Hết hạn ${k.gdpHetHan.split('-').reverse().join('/')} ${gdp.code==='het'?'→ hệ thống chặn lên đơn (BR-15)':''}</div></div>
    </div>
    <div style="font-weight:700;font-size:13px;margin:18px 0 8px">Thông tin cơ sở</div>
    <div class="detail-grid">
      ${dl('Nhóm khách', k.nhomKhach)}${dl('Phân loại', k.loai==='ETC'?'ETC — Kê đơn':'OTC — Không kê đơn')}
      ${dl('Người liên hệ', k.nguoiLH)}${dl('Điện thoại', k.sdt)}
      ${dl('Địa chỉ', k.diaChi)}${dl('Khu vực', k.quan)}
      ${dl('Thanh toán', k.thanhToan)}${dl('TDV phụ trách', tdv?tdv.ten:'—')}
    </div>
    ${k.hopDongNam?`<div style="font-weight:700;font-size:13px;margin:18px 0 8px">Hợp đồng năm</div>
      <div class="tier"><span>Mã hợp đồng <b>${k.hopDongNam.ma}</b></span><span class="tv">Cam kết ${k.hopDongNam.camKet} triệu/năm</span></div>
      <div class="tier"><span>Ưu đãi giá thùng khi đơn tháng ≥</span><span class="tv">${k.hopDongNam.nguongThang} triệu (BR-12)</span></div>`:''}
    <div style="margin-top:20px;display:flex;gap:9px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" id="dOrder">${ICON.calc} Tạo đơn cho khách này</button>
      <button class="btn btn-ghost btn-sm" id="dEdit">${ICON.edit} Sửa thông tin</button>
      <button class="btn btn-ghost btn-sm" id="dHist">${ICON.order} Lịch sử mua hàng</button></div>`;
  mask.classList.add('open');
  mask.querySelector('#dx').onclick = ()=>mask.classList.remove('open');
  mask.onclick = (e)=>{ if(e.target===mask) mask.classList.remove('open'); };
  mask.querySelector('#dOrder').onclick = ()=>{ newDraft(ma); };
  mask.querySelector('#dEdit').onclick = ()=>{ mask.classList.remove('open'); openCustomerForm(c, ma); };
  mask.querySelector('#dHist').onclick = ()=>{ mask.classList.remove('open'); APP.q = ma; APP.seg.orders='Tất cả'; go('orders'); };
}
const dl = (k,v)=>`<div class="dl"><span class="k">${k}</span><span class="v">${v}</span></div>`;
const drawerHtml = ()=>`<div class="drawer-mask" id="drawer"><div class="drawer"><div class="drawer-head"></div><div class="drawer-body"></div></div></div>`;

/* ---------------- Sản phẩm & Báo giá ---------------- */
const GROUP_BADGE = { 'THẦU':'badge-blue','SONG SONG':'badge-warn','BÁN ĐIỂM':'badge-green','TO':'badge-gray' };
function renderProducts(c) {
  const list = TD.products.filter(p =>
    (APP.seg.products === 'Tất cả' || p.nhomHang === APP.seg.products)
    && matchQ(APP.q, p.ma, p.ten, p.danhMuc, p.nhomHang));
  const rows = list.map(p=>{
    const canHan = TD.thangConHan(p.hanDung)<=14;
    const progs = [];
    if (p.tang) progs.push(`<span class="badge badge-green">${p.tang}</span>`);
    if (p.chietKhau) progs.push(`<span class="badge badge-warn">CK ${p.chietKhau}%</span>`);
    if (p.quy) progs.push(`<span class="badge badge-blue">Quý</span>`);
    if (p.duLich) progs.push(`<span class="badge badge-gray">Du lịch</span>`);
    return `<tr data-edit="${p.ma}">
      <td><span class="code">${p.ma}</span></td>
      <td class="cell-2"><div class="strong">${p.ten}</div><div class="s">${p.dvt} · Thuế ${p.thue}% · ${p.danhMuc}</div></td>
      <td><span class="badge ${GROUP_BADGE[p.nhomHang]}">${p.nhomHang}</span></td>
      <td class="c num">${p.qct||'—'}</td>
      <td class="r num strong">${TD.fmt(p.giaHop)}</td>
      <td class="r num">${p.giaThung!=null?TD.fmt(p.giaThung):'<span style="color:var(--ink-mute)">KHÔNG</span>'}</td>
      <td><div class="flex" style="flex-wrap:wrap;gap:4px">${progs.join('')||'<span class="s" style="color:var(--ink-mute)">—</span>'}</div></td>
      <td class="c"><span class="num">${p.hanDung.split('-').reverse().join('/')}</span>${canHan?`<div><span class="badge badge-warn" style="margin-top:3px">⚠ cận hạn</span></div>`:''}</td>
      <td class="c"><div class="row-acts"><button class="row-act" data-edit2="${p.ma}" title="Sửa">${ICON.edit}</button><button class="row-act danger" data-del="${p.ma}" title="Xóa">${ICON.trash}</button></div></td>
    </tr>`;
  }).join('');

  c.innerHTML = `<div class="screen">
    <div class="screen-head"><div><div class="t">Sản phẩm & Bảng báo giá</div><div class="d">BBG 2026 · ${list.length}/${TD.products.length} mặt hàng · giá hộp / giá thùng / quy cách</div></div>
      <div class="actions"><button class="btn btn-ghost btn-sm" id="expProd">${ICON.export} Xuất Excel</button><button class="btn btn-primary btn-sm" id="addProd">${ICON.plus} Thêm sản phẩm</button></div></div>
    <div class="toolbar">${segHtml(['Tất cả','THẦU','SONG SONG','BÁN ĐIỂM','TO'], APP.seg.products)}</div>
    ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th>Mã SP</th><th>Tên sản phẩm</th><th>Nhóm hàng</th><th class="c">QC/Thùng</th><th class="r">Giá hộp</th><th class="r">Giá thùng</th><th>Chương trình</th><th class="c">Hạn dùng</th><th class="c"></th>
    </tr></thead><tbody>${rows}</tbody></table></div>` : emptyHtml('Không tìm thấy sản phẩm phù hợp')}
  </div>${productDrawerHtml()}`;
  c.querySelector('#addProd').onclick = () => openProductDrawer(c);
  c.querySelector('#expProd').onclick = () => exportProducts(list);
  bindSeg(c, 'products');
  c.querySelectorAll('[data-edit]').forEach(tr => tr.onclick = () => openProductDrawer(c, tr.dataset.edit));
  c.querySelectorAll('[data-edit2]').forEach(b => b.onclick = (e) => { e.stopPropagation(); openProductDrawer(c, b.dataset.edit2); });
  c.querySelectorAll('[data-del]').forEach(b => b.onclick = (e) => { e.stopPropagation(); delProduct(b.dataset.del); });
}

function delProduct(ma) {
  const p = TD.findProduct(ma);
  confirmDialog(`Xóa sản phẩm “${p.ten}” (${ma})?`, 'Mặt hàng sẽ bị gỡ khỏi bảng báo giá.', () => {
    TD.products = TD.products.filter(x => x.ma !== ma);
    renderContent();
    toast(`Đã xóa ${ma}`, 'ok');
  });
}

/* ---------------- Form Thêm / Sửa sản phẩm ---------------- */
function nextProductCode() {
  const nums = TD.products.map(p => parseInt((p.ma.match(/(\d+)$/) || [])[1] || 0, 10));
  return 'SP-' + (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
}

function productDrawerHtml() {
  const groups = ['THẦU', 'SONG SONG', 'BÁN ĐIỂM', 'TO'];
  const dvts = ['Hộp','Lọ','Tuýp','Vỉ','Chai','Gói'];
  return `<div class="drawer-mask" id="prodDrawer"><div class="drawer wide">
    <div class="drawer-head">
      <div class="ava" style="width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:#fff;background:var(--primary)">${ICON.prod}</div>
      <div><div style="font-weight:700;font-size:16px" id="pdTitle">Thêm sản phẩm</div><div style="font-size:12.5px;color:var(--ink-mute)">Bảng báo giá BBG 2026</div></div>
      <button class="x-btn" id="pdx">${ICON.x}</button>
    </div>
    <div class="drawer-body">
      <div class="fsec">
        <div class="fsh"><span class="fsn">1</span>Thông tin cơ bản</div>
        <div class="fgrid">
          <div class="fld"><label>Mã sản phẩm</label><input id="f-ma" class="mono" value="${nextProductCode()}"/></div>
          <div class="fld"><label>Đơn vị tính</label><select id="f-dvt">${dvts.map(d=>`<option>${d}</option>`).join('')}</select></div>
          <div class="fld span2"><label>Tên sản phẩm <span class="req">*</span></label><input id="f-ten" placeholder="VD: Paracetamol 500mg"/></div>
          <div class="fld span2"><label>Phân loại</label><div class="seg" id="f-danhMuc"><button class="on" data-v="ETC">ETC · Kê đơn</button><button data-v="OTC">OTC</button><button data-v="TPCN">TPCN</button></div></div>
          <div class="fld span2"><label>Nhóm hàng</label><div class="pill-group" id="f-nhom">${groups.map((g, i) => `<button class="gpill ${i === 0 ? 'on' : ''}" data-v="${g}">${g}</button>`).join('')}</div></div>
          <div class="fld"><label>Thuế suất GTGT</label><div class="seg" id="f-thue"><button class="on" data-v="5">5%</button><button data-v="8">8%</button><button data-v="10">10%</button></div></div>
          <div class="fld"><label>Hạn dùng</label><input id="f-han" type="date" value="2028-06-30"/></div>
        </div>
      </div>

      <div class="fsec">
        <div class="fsh"><span class="fsn">2</span>Quy cách & Báo giá</div>
        <div class="fgrid">
          <div class="fld span2"><label>Quy cách đóng gói</label><div class="affix"><input id="f-qct" type="number" value="42"/><span class="suf">hộp / thùng</span></div></div>
          <div class="fld"><label>Giá hộp <span class="req">*</span></label><div class="affix" id="f-giaHopBox"><input id="f-giaHop" type="number" placeholder="42000"/><span class="suf">₫</span></div></div>
          <div class="fld" id="f-thungWrap"><label>Giá thùng</label><div class="affix"><input id="f-giaThung" type="number" placeholder="40000"/><span class="suf">₫</span></div></div>
        </div>
        <div class="toggle-row" style="margin-top:12px">
          <div><div class="tr-t">Sản phẩm một giá</div><div class="tr-d">Chỉ bán theo giá hộp — không có giá thùng (“KHÔNG”)</div></div>
          <button class="switch" id="f-motgia"><span class="knob"></span></button>
        </div>
        <div class="fld fld-dim" id="f-thauWrap" style="margin-top:12px"><label>Giá thầu <span class="opt">· chỉ áp dụng hàng đấu thầu</span></label><div class="affix"><input id="f-giaThau" type="number" placeholder="VD: 38500"/><span class="suf">₫</span></div></div>
      </div>

      <div class="fsec">
        <div class="fsh"><span class="fsn">3</span>Chương trình khuyến mãi <span class="fsh-sub">cấp sản phẩm</span></div>
        <div class="golden">${ICON.spark}<span>Mỗi sản phẩm chỉ hưởng <b>một</b> chương trình cấp sản phẩm tại một thời điểm — riêng <b>CT tháng</b> (theo tổng đơn) luôn được cộng thêm.</span></div>
        <div class="fgrid">
          <div class="fld"><label>Hàng tặng (mua + tặng)</label><select id="f-tang"><option value="">Không</option><option>20+5</option><option>10+2</option><option>5+1</option><option>3+1</option></select></div>
          <div class="fld"><label>Chiết khấu trực tiếp</label><div class="affix"><input id="f-ck" type="number" value="0"/><span class="suf">%</span></div></div>
        </div>
        <div class="toggle-row" style="margin-top:12px">
          <div><div class="tr-t">Tham gia CT Quý 2/2026</div><div class="tr-d">Tích lũy doanh số đổi hộp quà</div></div>
          <button class="switch" id="f-quy"><span class="knob"></span></button>
        </div>
        <div class="toggle-row" style="margin-top:9px">
          <div><div class="tr-t">Tham gia CT Du lịch 2026</div><div class="tr-d">Cộng doanh số xét vé du lịch Nha Trang</div></div>
          <button class="switch" id="f-dulich"><span class="knob"></span></button>
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-ghost" id="pdDelete" style="margin-right:auto;display:none;color:var(--danger);border-color:oklch(0.85 0.06 26)">${ICON.trash} Xóa</button>
      <button class="btn btn-ghost" id="pdCancel">Hủy</button>
      <button class="btn btn-primary" id="pdSave">${ICON.check} Lưu sản phẩm</button>
    </div>
  </div></div>`;
}

function openProductDrawer(c, editMa) {
  const mask = c.querySelector('#prodDrawer');
  const q = sel => mask.querySelector(sel);
  const setSeg = (segId, val) => q(segId).querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === String(val)));
  const setSwitch = (id, on) => q(id).classList.toggle('on', !!on);
  const ed = editMa ? TD.findProduct(editMa) : null;
  const motgia = q('#f-motgia'), thungWrap = q('#f-thungWrap'), nhom = q('#f-nhom'), thauWrap = q('#f-thauWrap');

  // prefill
  if (ed) {
    q('#pdTitle').textContent = 'Sửa sản phẩm';
    q('#pdSave').innerHTML = `${ICON.check} Lưu thay đổi`;
    q('#pdDelete').style.display = '';
    q('#f-ma').value = ed.ma; q('#f-dvt').value = ed.dvt; q('#f-ten').value = ed.ten;
    setSeg('#f-danhMuc', ed.danhMuc); setSeg('#f-thue', ed.thue);
    nhom.querySelectorAll('.gpill').forEach(b => b.classList.toggle('on', b.dataset.v === ed.nhomHang));
    q('#f-han').value = ed.hanDung; q('#f-qct').value = ed.qct || '';
    q('#f-giaHop').value = ed.giaHop;
    setSwitch('#f-motgia', ed.giaThung == null);
    q('#f-giaThung').value = ed.giaThung == null ? '' : ed.giaThung;
    thungWrap.classList.toggle('fld-dim', ed.giaThung == null);
    q('#f-giaThau').value = ed.giaThau == null ? '' : ed.giaThau;
    thauWrap.classList.toggle('fld-dim', ed.nhomHang !== 'THẦU');
    q('#f-tang').value = ed.tang || '';
    q('#f-ck').value = ed.chietKhau || 0;
    setSwitch('#f-quy', ed.quy); setSwitch('#f-dulich', ed.duLich);
  } else {
    q('#pdTitle').textContent = 'Thêm sản phẩm';
    q('#pdSave').innerHTML = `${ICON.check} Lưu sản phẩm`;
    q('#pdDelete').style.display = 'none';
    q('#f-ma').value = nextProductCode();
    q('#f-ten').value = ''; q('#f-ten').classList.remove('err'); q('#f-giaHopBox').classList.remove('err');
    q('#f-ten').focus();
  }

  mask.classList.add('open');
  const close = () => mask.classList.remove('open');
  q('#pdx').onclick = close;
  q('#pdCancel').onclick = close;
  mask.onclick = e => { if (e.target === mask) close(); };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });

  mask.querySelectorAll('.seg').forEach(seg => seg.querySelectorAll('button').forEach(b => b.onclick = () => {
    seg.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  }));
  nhom.querySelectorAll('.gpill').forEach(b => b.onclick = () => {
    nhom.querySelectorAll('.gpill').forEach(x => x.classList.remove('on')); b.classList.add('on');
    thauWrap.classList.toggle('fld-dim', b.dataset.v !== 'THẦU');
  });
  ['#f-quy', '#f-dulich'].forEach(id => q(id).onclick = () => q(id).classList.toggle('on'));
  motgia.onclick = () => { motgia.classList.toggle('on'); thungWrap.classList.toggle('fld-dim', motgia.classList.contains('on')); };

  q('#pdDelete').onclick = () => { close(); delProduct(editMa); };

  q('#pdSave').onclick = () => {
    const ten = q('#f-ten').value.trim();
    const giaHop = parseInt(q('#f-giaHop').value || 0, 10);
    let bad = false;
    if (!ten) { q('#f-ten').classList.add('err'); bad = true; }
    if (!giaHop) { q('#f-giaHopBox').classList.add('err'); bad = true; }
    if (bad) { q('#f-ten').focus(); return; }
    const segV = id => q(id + ' .on').dataset.v;
    const motGiaOn = motgia.classList.contains('on');
    const obj = {
      ma: q('#f-ma').value.trim() || nextProductCode(),
      ten, dvt: q('#f-dvt').value,
      qct: parseInt(q('#f-qct').value || 0, 10) || null,
      giaHop,
      giaThung: motGiaOn ? null : (parseInt(q('#f-giaThung').value || 0, 10) || null),
      nhomHang: nhom.querySelector('.on').dataset.v,
      danhMuc: segV('#f-danhMuc'),
      thue: parseInt(segV('#f-thue'), 10),
      tang: q('#f-tang').value || null,
      chietKhau: parseInt(q('#f-ck').value || 0, 10) || 0,
      quy: q('#f-quy').classList.contains('on'),
      duLich: q('#f-dulich').classList.contains('on'),
      hanDung: q('#f-han').value || '2028-01-01',
      giaThau: q('#f-giaThau').value ? parseInt(q('#f-giaThau').value, 10) : null,
    };
    if (ed) {
      Object.assign(ed, obj);
      close(); renderContent(); toast(`Đã cập nhật ${obj.ma}`, 'ok');
    } else {
      TD.products.push(obj);
      close(); renderContent(); toast(`Đã thêm ${obj.ma} · ${obj.ten}`, 'ok');
    }
  };
}

/* ---------------- Chương trình khuyến mãi ---------------- */
function renderPromos(c) {
  const P = TD.programs;
  const card = (ic, col, bg, nm, ky, body) => `<div class="card prog-card">
    <div class="pc-top"><div class="pc-ic" style="background:${bg};color:${col}">${ICON[ic]}</div>
      <div style="flex:1"><div class="pc-nm">${nm}</div><div class="pc-ky">${ky}</div></div>
      <span class="badge badge-green"><span class="dot" style="background:currentColor"></span>Đang chạy</span></div>
    <div style="margin-top:12px">${body}</div></div>`;

  const thangTiers = P.thang.bac.map(b=>`<div class="tier"><span>Tổng đơn ≥ <b>${TD.fmt(b.nguong/1e6)} triệu</b></span><span class="tv">+${b.sl} thùng bia</span></div>`).join('');
  const quyTiers = P.quy.bac.map(b=>`<div class="tier"><span>Tích lũy ≥ <b>${TD.fmt(b.nguong/1e6)} triệu</b></span><span class="tv">${b.hopQua} hộp quà</span></div>`).join('');
  const dlBody = `<div class="tier"><span>Mỗi vé du lịch</span><span class="tv">${TD.fmt(P.duLich.moiVe/1e6)} triệu doanh số</span></div>
    <div class="tier"><span>Nhóm đủ điều kiện</span><span class="tv" style="font-size:12px">THẦU · SONG SONG · BÁN ĐIỂM</span></div>
    <div class="tier"><span>Trần nhóm SONG SONG</span><span class="tv">30% giá trị vé (BR-10)</span></div>`;
  const hdnBody = P.hopDongNam.bacCamKet.map(b=>`<div class="tier"><span>Cam kết <b>${b.camKet} triệu</b>/năm</span><span class="tv">${b.thungBia} thùng bia</span></div>`).join('')
    + `<div class="tier" style="background:var(--primary-50)"><span>Ưu đãi nổi bật</span><span class="tv" style="font-size:12px">Giá thùng khi đơn tháng ≥ 10tr</span></div>`;

  TD.customPrograms = TD.customPrograms || [];
  const customCards = TD.customPrograms.map((p,i)=>{
    const body = `<div class="tier"><span>Điều kiện áp dụng</span><span class="tv" style="font-size:12px">${p.dieuKien||'—'}</span></div>
      <div class="tier"><span>Ưu đãi / quà</span><span class="tv" style="font-size:12px">${p.uuDai||'—'}</span></div>
      ${p.ky?`<div class="tier"><span>Kỳ áp dụng</span><span class="tv" style="font-size:12px">${p.ky}</span></div>`:''}
      <div style="margin-top:10px;text-align:right"><button class="row-act danger" data-pdel="${i}" title="Xóa">${ICON.trash}</button></div>`;
    return card('promo','oklch(0.45 0.13 30)','oklch(0.94 0.04 30)', p.ten, p.loai+(p.ky?' · '+p.ky:''), body);
  }).join('');

  c.innerHTML = `<div class="screen">
    <div class="screen-head"><div><div class="t">Chương trình khuyến mãi</div><div class="d">Cấu hình để bộ máy tự áp dụng — tuân thủ “quy tắc vàng” loại trừ (BR-14)</div></div>
      <div class="actions"><button class="btn btn-primary btn-sm" id="addPromo">${ICON.plus} Tạo chương trình</button></div></div>

    <div class="warn-banner warn" style="background:var(--primary-50);border-color:var(--primary-100);margin-bottom:18px">
      <span class="wi" style="color:var(--primary)">${ICON.spark}</span>
      <div class="wt" style="color:var(--primary-700)">Quy tắc vàng: mỗi sản phẩm chỉ hưởng <b>một</b> chương trình cấp sản phẩm tại một thời điểm; riêng <b>chương trình tháng</b> (theo tổng đơn) luôn được cộng thêm.</div></div>

    <div class="prog-grid">
      ${card('gift','oklch(0.45 0.13 30)','oklch(0.94 0.04 30)', P.thang.ten, 'Theo tổng giá trị đơn · '+P.thang.ky, thangTiers)}
      ${card('promo','var(--primary)','var(--primary-50)', P.quy.ten, 'Tích lũy SP tham gia · '+P.quy.ky, quyTiers)}
      ${card('trend','oklch(0.45 0.12 200)','oklch(0.93 0.04 200)', P.duLich.ten, 'Tích lũy doanh số giá gốc', dlBody)}
      ${card('cust','oklch(0.45 0.13 300)','oklch(0.94 0.04 300)','Hợp đồng năm (khách VIP)','Cam kết doanh số năm', hdnBody)}
      ${customCards}
    </div>

    <div class="card panel" style="margin-top:16px">
      <div class="panel-head"><span class="pt">Hàng tặng theo số lượng & chiết khấu (cấp sản phẩm)</span></div>
      <div class="prog-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="tier"><span>Mua 20 tặng 5 <span class="s">(20+5)</span></span><span class="tv">SP-001, SP-002, SP-008</span></div>
        <div class="tier"><span>Mua 5 tặng 1 <span class="s">(5+1)</span></span><span class="tv">SP-004, SP-007, SP-010</span></div>
        <div class="tier"><span>Chiết khấu 40%</span><span class="tv">SP-005 Salonpas</span></div>
      </div>
    </div>
  </div>${promoFormHtml()}`;
  c.querySelector('#addPromo').onclick = () => openPromoForm(c);
  c.querySelectorAll('[data-pdel]').forEach(b=>b.onclick=()=>{ TD.customPrograms.splice(+b.dataset.pdel,1); renderContent(); toast('Đã xóa chương trình','ok'); });
}

/* ---------------- Báo cáo & Kết xuất ---------------- */
function renderReports(c) {
  const cols = ['Mã đơn','TDV','Mã KH','Tên khách','Quận','Sản phẩm','Đơn vị','Đơn giá','Số lượng','Chiết khấu','Doanh thu','Ngày','Hình thức TT'];
  c.innerHTML = `<div class="screen">
    <div class="screen-head"><div><div class="t">Báo cáo & Kết xuất dữ liệu</div><div class="d">Chọn cột cần xuất — thay cho việc sao chép thủ công sang file khác</div></div></div>
    <div class="dash-grid">
      <div class="card panel">
        <div class="panel-head"><span class="pt">Doanh số theo TDV — Tháng 05/2026</span><span class="pa">Triệu ₫</span></div>
        ${repBars([['Nguyễn T. Hồng',46.2],['Lê Minh Tuấn',82.1],['Trần V. Khoa',24.1]])}
      </div>
      <div class="card panel">
        <div class="panel-head"><span class="pt">Kết xuất chọn cột</span></div>
        <div style="font-size:12.5px;color:var(--ink-mute);margin-bottom:10px">Tích các cột muốn đưa vào file Excel (FR-REP-01):</div>
        <div style="display:flex;flex-wrap:wrap;gap:7px" id="repCols">${cols.map((col,i)=>`<label class="filter-pill" style="cursor:pointer;${i<8?'background:var(--primary-50);border-color:var(--primary-100);color:var(--primary-700)':''}"><input type="checkbox" data-col="${col}" ${i<8?'checked':''} style="accent-color:var(--primary)"/> ${col}</label>`).join('')}</div>
        <div style="margin-top:16px;display:flex;gap:9px"><button class="btn btn-primary btn-sm" id="repExport">${ICON.export} Xuất Excel</button><button class="btn btn-ghost btn-sm" id="repDaily">${ICON.print} Báo cáo cuối ngày</button></div>
      </div>
    </div>
    <div class="card panel" style="margin-top:16px">
      <div class="panel-head"><span class="pt">Xem trước dữ liệu kết xuất</span></div>
      ${ordersTable(TD.orders)}
    </div>
  </div>`;
  bindOrdersTable(c);
  c.querySelector('#repExport').onclick = () => {
    const chosen = [...c.querySelectorAll('#repCols input:checked')].map(i=>i.dataset.col);
    if (!chosen.length) { toast('Hãy chọn ít nhất một cột', 'danger'); return; }
    exportReport(chosen);
  };
  c.querySelector('#repDaily').onclick = () => exportReport(cols, 'bao-cao-cuoi-ngay');
}
function repBars(data){ const max=Math.max(...data.map(d=>d[1]));
  return `<div style="display:flex;flex-direction:column;gap:13px;padding-top:6px">${data.map(d=>`
    <div><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px"><span>${d[0]}</span><span class="num" style="font-weight:700">${d[1]} tr</span></div>
    <div style="height:10px;background:var(--surface-2);border-radius:99px;overflow:hidden"><div style="height:100%;width:${d[1]/max*100}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:99px"></div></div></div>`).join('')}</div>`;
}

/* ---------------- In đơn hàng ---------------- */
function openPrint(kh, tdv, kq) {
  const w = window.open('', '_blank', 'width=820,height=1000');
  const rows = kq.rows.map((r,i)=>`<tr>
    <td>${i+1}</td><td>${r.sp.ten}<br><small>${r.sp.ma}</small></td><td>${r.sp.dvt}</td>
    <td class="r">${TD.fmt(r.donGia)}</td><td class="c">${r.soLuong}</td>
    <td class="c">${r.tang||''}</td><td class="c">${r.ckPhanTram?r.ckPhanTram+'%':''}</td>
    <td class="r">${TD.fmt(r.thanhTien)}</td></tr>`).join('');
  const gifts = kq.quaTang.map(g=>`${g.ten}: ${g.sl} ${g.dvt}`).join(' · ');
  w.document.write(`<html><head><meta charset="utf-8"><title>Đơn 06-05-2026</title>
    <style>
      *{font-family:'Be Vietnam Pro',Arial,sans-serif;box-sizing:border-box}
      body{margin:0;padding:34px 40px;color:#1a2230;font-size:13px}
      .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #1f5fae;padding-bottom:16px}
      .co{font-size:11px;color:#555;line-height:1.6}
      h1{font-size:20px;margin:22px 0 3px;color:#1f5fae;letter-spacing:.5px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:3px 24px;font-size:12.5px;margin:14px 0 18px}
      .meta b{color:#1f5fae}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#eef4fb;text-align:left;padding:8px 9px;border:1px solid #cdd9e8;font-size:11px;text-transform:uppercase;color:#3a5a82}
      td{padding:8px 9px;border:1px solid #dde6f0;vertical-align:top}
      .r{text-align:right}.c{text-align:center}
      small{color:#888;font-size:10px}
      .tot{margin-top:14px;display:flex;justify-content:flex-end}
      .totbox{min-width:260px}
      .totrow{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
      .totrow.g{border-top:2px solid #1f5fae;margin-top:5px;padding-top:9px;font-weight:800;font-size:16px;color:#1f5fae}
      .gift{margin-top:14px;background:#eef9f1;border:1px solid #bfe6cb;border-radius:8px;padding:10px 13px;font-size:12px}
      .sign{display:flex;justify-content:space-between;margin-top:50px;font-size:12px;text-align:center;color:#555}
      .sign div{width:30%}
    </style></head><body>
    <div class="top">
      <img src="${location.origin}${location.pathname.replace(/[^/]*$/,'')}assets/logo-tamdan.png" style="height:38px"/>
      <div class="co">CÔNG TY TNHH DƯỢC PHẨM TÂM ĐAN<br>MST: 0312xxxxxx · ĐT: 028 3xxx xxxx<br>Đơn hàng nội bộ — không phải hóa đơn GTGT</div>
    </div>
    <h1>PHIẾU ĐƠN HÀNG</h1>
    <div style="font-size:12px;color:#888">Mã đơn: <b style="color:#1f5fae">06-05-2026</b></div>
    <div class="meta">
      <div>Khách hàng: <b>${kh.ten}</b> (${kh.ma})</div><div>TDV: <b>${tdv?tdv.ten:''}</b></div>
      <div>Địa chỉ: ${kh.diaChi}, ${kh.quan}</div><div>Điện thoại: ${kh.sdt}</div>
      <div>Hình thức TT: ${kh.thanhToan}</div><div>Ngày xuất: 31/05/2026</div>
    </div>
    <table><thead><tr><th>#</th><th>Sản phẩm</th><th>ĐVT</th><th class="r">Đơn giá</th><th class="c">SL</th><th class="c">Tặng</th><th class="c">CK</th><th class="r">Thành tiền</th></tr></thead>
    <tbody>${rows}</tbody></table>
    ${gifts?`<div class="gift"><b>Quà tặng kèm:</b> ${gifts}</div>`:''}
    <div class="tot"><div class="totbox">
      <div class="totrow"><span>Tổng chiết khấu</span><span>− ${TD.fmt(kq.tongCK)} ₫</span></div>
      <div class="totrow g"><span>TỔNG CỘNG</span><span>${TD.fmt(kq.tongTien)} ₫</span></div>
    </div></div>
    <div class="sign"><div>TDV<br><br><br>_______</div><div>Người xử lý<br><br><br>_______</div><div>Khách hàng<br><br><br>_______</div></div>
    </body></html>`);
  w.document.close();
  setTimeout(()=>w.print(), 500);
}
