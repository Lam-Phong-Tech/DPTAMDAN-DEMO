/* =========================================================================
   WEB ADMIN — Màn hình xử lý đơn (bộ máy tính giá & khuyến mãi)
   ========================================================================= */
function pkClass(loai){ return 'pk-'+loai; }
function pkLabel(loai){ return {thung:'Giá thùng',hop:'Giá hộp','mot-gia':'Một giá',thau:'Giá thầu'}[loai]||''; }

function renderOrder(c) {
  const o = APP.order;
  const kh = TD.findCustomer(o.custMa);
  const kq = TD.tinhDon(kh, o.lines);
  const gdp = TD.trangThaiGDP(kh);
  const layoutBottom = APP.tweaks.layout === 'bottom';
  const locked = ['Đã duyệt', 'Đã in', 'Đã hủy'].includes(o.trangThai);
  if (o.ref) o.ref.tong = kq.tongTien;

  const custOpts = TD.customers.map(k=>`<option value="${k.ma}" ${k.ma===o.custMa?'selected':''}>${k.ten} — ${k.ma}</option>`).join('');
  const tdvOpts  = TD.tdvs.map(t=>`<option value="${t.ma}" ${t.ma===o.tdvMa?'selected':''}>${t.ten} — ${t.ma}</option>`).join('');
  const tdv = TD.findTDV(o.tdvMa);

  const usedSP = new Set(o.lines.map(l=>l.maSP));
  const addOpts = TD.products.filter(p=>!usedSP.has(p.ma)).map(p=>`<option value="${p.ma}">${p.ma} — ${p.ten}</option>`).join('');

  // hành động theo trạng thái
  let actions = `<button class="btn btn-ghost btn-sm" id="printOrder">${ICON.print} In đơn</button>`;
  if (!locked) actions += `<button class="btn btn-primary btn-sm" id="confirmOrder">${ICON.check} ${o.ref?'Duyệt đơn':'Xác nhận đơn'}</button>`;
  if (o.trangThai==='Đã duyệt') actions += `<button class="btn btn-ghost btn-sm" id="recallOrder">${ICON.undo} Thu hồi duyệt</button>`;
  if (o.trangThai==='Đã duyệt' || o.trangThai==='Đã in') actions += `<button class="btn btn-sm" id="cancelOrder" style="background:var(--danger-50);color:var(--danger);border:1px solid oklch(0.85 0.06 26)">${ICON.x} Hủy đơn</button>`;

  const title = o.ma ? `Đơn hàng <span class="mono" style="color:var(--primary-700)">${o.ma}</span> ${statusBadge(o.trangThai)}`
                     : `Đơn nháp mới ${statusBadge('Nháp')}`;

  c.innerHTML = `<div class="screen">
    <div class="screen-head">
      <div><div class="t" style="display:flex;align-items:center;gap:10px">${title}</div>
        <div class="d">Bộ máy tự tra giá, tính hàng tặng & áp khuyến mãi theo thời gian thực</div></div>
      <div class="actions">${actions}</div>
    </div>

    ${lockBanner(o)}

    <!-- thông tin chung -->
    <div class="card ord-head">
      <div class="row">
        <div class="fld"><label>Khách hàng</label>
          ${locked ? `<div class="static">${kh.ten} — ${kh.ma}</div>` : `<select id="selCust">${custOpts}</select>`}</div>
        <div class="fld"><label>Trình dược viên</label>
          ${locked ? `<div class="static">${tdv?tdv.ten:'—'}</div>` : `<select id="selTdv">${tdvOpts}</select>`}</div>
        <div class="fld"><label>Ngày xuất</label><div class="static num">31/05/2026</div></div>
        <div class="fld"><label>Hình thức TT</label><div class="static" id="ttCell">${kh.thanhToan}</div></div>
      </div>
      <div class="cust-card" id="custCard">${custCardHtml(kh, gdp, tdv)}</div>
    </div>

    <div class="order-layout ${layoutBottom?'layout-bottom':''}">
      <div>
        <div class="card ord-grid-wrap">
          <table class="ord-grid">
            <thead><tr>
              <th>Sản phẩm</th><th class="c">SL</th><th class="r">Đơn giá</th>
              <th class="c">Tặng</th><th class="c">CK%</th><th class="r">Thành tiền</th><th></th>
            </tr></thead>
            <tbody id="gridBody">${kq.rows.map((r,i)=>rowHtml(r,i,locked)).join('')}</tbody>
          </table>
          ${locked ? '' : `<div class="add-line">
            ${ICON.plus}<select id="addSel"><option value="">+ Thêm sản phẩm vào đơn...</option>${addOpts}</select>
          </div>`}
        </div>

        <div class="card ord-summary" id="summary">${summaryHtml(kq)}</div>
      </div>

      <div class="card explain" id="explain">${explainHtml(kq, kh)}</div>
    </div>
  </div>`;

  // ---- bind ----
  if (!locked) {
    c.querySelector('#selCust').onchange = (e)=>{ o.custMa = e.target.value; if(o.ref) o.ref.khach=e.target.value; renderOrder(c); };
    c.querySelector('#selTdv').onchange  = (e)=>{ o.tdvMa = e.target.value; if(o.ref) o.ref.tdv=e.target.value; renderOrder(c); };
    c.querySelector('#addSel').onchange  = (e)=>{ if(e.target.value){ o.lines.push({maSP:e.target.value, soLuong:10, suDungGiaThung:true}); renderOrder(c); } };
    c.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ o.lines.splice(+b.dataset.rm,1); renderOrder(c); });
    c.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.toggle; o.lines[i].suDungGiaThung=!o.lines[i].suDungGiaThung; renderOrder(c); });
    c.querySelectorAll('input.qty').forEach(inp=>inp.oninput=()=>{
      const i=+inp.dataset.idx; o.lines[i].soLuong = Math.max(0, parseInt(inp.value)||0); recalcSoft(c);
    });
    const cf = c.querySelector('#confirmOrder');
    if (cf) cf.onclick = ()=>{
      if(kq.canhBao.some(w=>w.chan)){ toast('Không thể xác nhận: khách hết hạn giấy phép GDP','danger'); return; }
      if(!o.lines.length){ toast('Đơn chưa có sản phẩm','danger'); return; }
      const luc = '31/05/2026 ' + new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
      if (o.ref) {
        Object.assign(o.ref, { trangThai:'Đã duyệt', tong:kq.tongTien, duyetBoi:'Quản trị viên', duyetLuc:luc });
        toast(`Đã duyệt đơn ${o.ref.ma}`,'ok');
      } else {
        const maxN = Math.max(0, ...TD.orders.map(x=>parseInt(x.ma)||0));
        const ma = `${String(maxN+1).padStart(2,'0')}-05-2026`;
        TD.orders.unshift({ ma, khach:o.custMa, tdv:o.tdvMa, ngay:'2026-05-31', kenh:kh.nhomKhach, trangThai:'Đã duyệt', tong:kq.tongTien, lines:o.lines.slice(), duyetBoi:'Quản trị viên', duyetLuc:luc });
        toast(`Đã xác nhận & duyệt đơn ${ma}`,'ok');
      }
      go('orders');
    };
  }
  c.querySelector('#printOrder').onclick = ()=> openPrint(kh, tdv, kq);

  const rc = c.querySelector('#recallOrder');
  if (rc) rc.onclick = ()=> promptDialog({
    title:'Thu hồi duyệt đơn '+o.ma, desc:'Đơn sẽ quay về trạng thái “Chờ xử lý” để chỉnh sửa. Thao tác được ghi nhật ký.',
    placeholder:'VD: Khách đổi số lượng, sai giá thầu…', yes:'Thu hồi & mở khóa', icon:'undo'
  }, (lyDo)=>{
    Object.assign(o.ref, { trangThai:'Chờ xử lý', duyetBoi:null, duyetLuc:null, lyDoThuHoi:lyDo });
    o.trangThai='Chờ xử lý'; o.duyetBoi=null; o.duyetLuc=null;
    renderContent();
    toast('Đã thu hồi duyệt — đơn mở khóa chỉnh sửa','ok');
  });

  const cc = c.querySelector('#cancelOrder');
  if (cc) cc.onclick = ()=> promptDialog({
    title:'Hủy đơn '+o.ma, desc:'Đơn sẽ chuyển trạng thái “Đã hủy” và không thể khôi phục. Nhập lý do để lưu nhật ký.',
    placeholder:'VD: Khách báo hủy, hết hàng…', yes:'Xác nhận hủy đơn', danger:true, icon:'trash'
  }, (lyDo)=>{
    Object.assign(o.ref, { trangThai:'Đã hủy', lyDoHuy:lyDo });
    toast(`Đã hủy đơn ${o.ref.ma}`,'danger');
    go('orders');
  });
}

/* banner trạng thái */
function lockBanner(o) {
  if (o.trangThai === 'Đã duyệt')
    return `<div class="status-banner blue"><span class="sb-ic">${ICON.check}</span>
      <div><div class="sb-t">Đơn đã duyệt — chế độ chỉ xem</div>
      <div class="sb-d">Duyệt bởi <b>${o.duyetBoi||'—'}</b>${o.duyetLuc?` lúc ${o.duyetLuc}`:''}. Bấm <b>Thu hồi duyệt</b> để mở khóa chỉnh sửa.</div></div></div>`;
  if (o.trangThai === 'Đã in')
    return `<div class="status-banner green"><span class="sb-ic">${ICON.lock}</span>
      <div><div class="sb-t">Đơn đã in & bàn giao — khóa chỉnh sửa</div>
      <div class="sb-d">Duyệt bởi <b>${o.duyetBoi||'—'}</b>${o.duyetLuc?` lúc ${o.duyetLuc}`:''}. Muốn thay đổi: <b>Hủy đơn</b> rồi tạo đơn mới.</div></div></div>`;
  if (o.trangThai === 'Đã hủy')
    return `<div class="status-banner danger"><span class="sb-ic">${ICON.warn}</span>
      <div><div class="sb-t">Đơn đã hủy</div>
      <div class="sb-d">${o.ref&&o.ref.lyDoHuy?`Lý do: ${o.ref.lyDoHuy}`:'Đơn không còn hiệu lực.'}</div></div></div>`;
  if (o.trangThai === 'Chờ xử lý')
    return `<div class="status-banner warn"><span class="sb-ic">${ICON.clock}</span>
      <div><div class="sb-t">Đơn chờ xử lý — có thể chỉnh sửa</div>
      <div class="sb-d">Điều chỉnh khách, sản phẩm, số lượng… rồi bấm <b>Duyệt đơn</b> để chốt.</div></div></div>`;
  return '';
}

function custCardHtml(kh, gdp, tdv) {
  const gdpBadge = { ok:'badge-green', warn:'badge-warn', danger:'badge-danger' }[gdp.level];
  const nhomBadge = kh.nhomKhach==='Bệnh viện'?'badge-blue':kh.nhomKhach==='Phòng khám'?'badge-green':'badge-gray';
  return `<div class="ava" style="background:${avColor(kh.ma)}">${initials(kh.ten)}</div>
    <div style="min-width:0">
      <div class="nm">${kh.ten} <span class="badge ${nhomBadge}" style="margin-left:6px">${kh.nhomKhach} · ${kh.loai}</span>
        ${kh.hopDongNam?`<span class="badge badge-blue" style="margin-left:4px">★ HĐ năm ${kh.hopDongNam.ma}</span>`:''}</div>
      <div class="meta">${kh.ma} · ${kh.diaChi}, ${kh.quan} · ${kh.sdt} · ${kh.thanhToan}</div>
    </div>
    <div class="gdp">
      <span class="badge ${gdpBadge}"><span class="dot" style="background:currentColor"></span>${gdp.label}</span>
      <div class="meta" style="margin-top:4px">HSD giấy phép: ${kh.gdpHetHan.split('-').reverse().join('/')}</div>
    </div>`;
}

function rowHtml(r, i, locked) {
  const sp = r.sp;
  const canHan = r.canHan ? ' warn-row' : '';
  // nút chuyển giá hộp/thùng chỉ khi SP có 2 giá & không phải bệnh viện
  const canToggle = !locked && sp.giaThung!=null && r.loaiGia!=='thau' && r.soLuong>=sp.qct;
  const toggle = canToggle ? `<button class="toggle-price" data-toggle="${i}">${r.loaiGia==='thung'?'→ giữ giá hộp':'→ dùng giá thùng'}</button>` : '';
  const qtyCell = locked
    ? `<span class="num" style="font-weight:700">${r.soLuong}</span>`
    : `<input class="qty num" data-idx="${i}" value="${r.soLuong}" inputmode="numeric"/>`;
  const rmCell = locked ? '' : `<button class="rm-btn" data-rm="${i}">${ICON.x}</button>`;
  return `<tr data-row="${i}" class="${canHan}">
    <td><div class="pname">${sp.ten}</div>
      <div class="pmeta"><span class="mono">${sp.ma}</span> · ${sp.nhomHang} · QC ${sp.qct||'-'}${sp.qct?'h/thùng':''} ${r.canHan?`· <span style="color:oklch(0.55 0.13 60);font-weight:700">⚠ cận hạn ${r.conHan}th</span>`:''}</div></td>
    <td class="c">${qtyCell}</td>
    <td class="r"><span class="price-tag"><span class="pv" data-cell="price-${i}">${TD.fmt(r.donGia)}</span><span class="pk ${pkClass(r.loaiGia)}" data-cell="pk-${i}">${pkLabel(r.loaiGia)}</span></span>${toggle}</td>
    <td class="c gift-cell" data-cell="gift-${i}">${r.tang>0?'+'+r.tang:'—'}</td>
    <td class="c num" data-cell="ck-${i}">${r.ckPhanTram>0?r.ckPhanTram+'%':'—'}</td>
    <td class="r line-tot" data-cell="tot-${i}">${TD.fmt(r.thanhTien)}</td>
    <td class="c">${rmCell}</td>
  </tr>`;
}

function summaryHtml(kq) {
  return `<div>
      <div class="sum-line"><span class="k">Số dòng sản phẩm</span><span class="v num">${kq.rows.length}</span></div>
      <div class="sum-line"><span class="k">Tổng hàng tặng (5+1, 20+5)</span><span class="v num" style="color:oklch(0.42 0.11 158)">${kq.tongTang} hộp</span></div>
      <div class="sum-line"><span class="k">Tổng chiết khấu</span><span class="v num">− ${TD.fmtVnd(kq.tongCK)}</span></div>
    </div>
    <div>
      <div class="sum-line"><span class="k">Tạm tính</span><span class="v num">${TD.fmtVnd(kq.tongTien+kq.tongCK)}</span></div>
      <div class="sum-line total"><span class="k">Tổng thanh toán</span><span class="v num">${TD.fmtVnd(kq.tongTien)}</span></div>
    </div>`;
}

/* ---- panel diễn giải ---- */
function explainHtml(kq, kh) {
  let warns = kq.canhBao.map(w=>`<div class="warn-banner ${w.level}">
      <span class="wi" style="color:${w.level==='danger'?'var(--danger)':'oklch(0.55 0.13 60)'}">${ICON.warn}</span>
      <div class="wt">${w.text}</div></div>`).join('');

  let gifts = '';
  if (kq.quaTang.length) {
    gifts = `<div class="gift-box"><div class="gh">${ICON.gift} Quà tặng tự động</div>
      ${kq.quaTang.map(g=>`<div class="gift-item"><span class="gq">+${g.sl} ${g.dvt}</span> ${g.ten} <span class="badge badge-gray" style="margin-left:auto">${g.nguon}</span></div>`).join('')}</div>`;
  }

  let prog = '';
  if (kq.duLich) {
    const pct = Math.min(100, kq.duLich.tong/kq.duLich.moiVe*100);
    prog += progHtml('Du lịch — tiến độ vé', `${TD.fmt(kq.duLich.tong/1e6)}tr / ${TD.fmt(kq.duLich.moiVe/1e6)}tr`, pct, `Đạt ${kq.duLich.ve} vé`);
  }
  if (kq.hopDongNam) {
    const namDS = kq.tongTien; // minh hoạ: doanh số đơn này
    const camKet = kq.hopDongNam.camKet*1e6;
    prog += progHtml(`HĐ năm ${kq.hopDongNam.ma} — cam kết`, `${TD.fmt(namDS/1e6)}tr / ${kq.hopDongNam.camKet}tr`, Math.min(100,namDS/camKet*100), kq.hopDongNam.uuDai?'Đã hưởng giá thùng':'Đang tích lũy');
  }

  const dien = kq.dien.map((d,i)=>`<div class="dien-item"><span class="di-num">${i+1}</span><div>${d}</div></div>`).join('');

  return `<div class="eh">${ICON.spark}<div><div class="et">Diễn giải tự động</div><div class="es">Vì sao hệ thống áp mức giá & khuyến mãi này</div></div></div>
    <div class="explain-body">
      ${warns}${gifts}${prog}
      <div class="explain-grid">${dien || '<div class="dien-item">Thêm sản phẩm để xem diễn giải.</div>'}</div>
    </div>`;
}
function progHtml(k, v, pct, tag) {
  return `<div class="prog"><div class="ph"><span class="pk">${k}</span><span class="pv num">${v}</span></div>
    <div class="track"><div class="fill" style="width:${pct}%"></div></div>
    <div class="ph" style="margin-top:5px;margin-bottom:0"><span class="badge badge-green">${tag}</span></div></div>`;
}

/* ---- cập nhật mềm (không mất focus ô SL) ---- */
function recalcSoft(c) {
  const o = APP.order; const kh = TD.findCustomer(o.custMa);
  const kq = TD.tinhDon(kh, o.lines);
  if (o.ref) o.ref.tong = kq.tongTien;
  kq.rows.forEach((r,i)=>{
    const set=(cell,html)=>{const el=c.querySelector(`[data-cell="${cell}-${i}"]`); if(el) el.innerHTML=html;};
    set('price', TD.fmt(r.donGia));
    const pk=c.querySelector(`[data-cell="pk-${i}"]`); if(pk){pk.textContent=pkLabel(r.loaiGia); pk.className='pk '+pkClass(r.loaiGia);}
    set('gift', r.tang>0?'+'+r.tang:'—');
    set('ck', r.ckPhanTram>0?r.ckPhanTram+'%':'—');
    set('tot', TD.fmt(r.thanhTien));
    const tr=c.querySelector(`[data-row="${i}"]`); if(tr) tr.className = r.canHan?'warn-row':'';
  });
  const sm=c.querySelector('#summary'); if(sm) sm.innerHTML=summaryHtml(kq);
  const ex=c.querySelector('#explain'); if(ex) ex.innerHTML=explainHtml(kq, kh);
}

/* ---- toast ---- */
function toast(msg, level) {
  let t = document.createElement('div');
  const col = level==='danger'?'var(--danger)':'var(--accent)';
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 20px;border-radius:10px;font-size:13.5px;font-weight:600;box-shadow:var(--shadow-lg);z-index:300;display:flex;align-items:center;gap:9px;opacity:0;transition:opacity .2s,transform .2s`;
  t.innerHTML = `<span style="color:${col}">${level==='danger'?ICON.warn:ICON.check}</span>${msg}`;
  document.body.appendChild(t);
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(-4px)';});
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),250);},2600);
}
