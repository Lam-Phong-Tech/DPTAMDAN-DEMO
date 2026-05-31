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

  const custOpts = TD.customers.map(k=>`<option value="${k.ma}" ${k.ma===o.custMa?'selected':''}>${k.ten} — ${k.ma}</option>`).join('');
  const tdvOpts  = TD.tdvs.map(t=>`<option value="${t.ma}" ${t.ma===o.tdvMa?'selected':''}>${t.ten} — ${t.ma}</option>`).join('');
  const tdv = TD.findTDV(o.tdvMa);

  const usedSP = new Set(o.lines.map(l=>l.maSP));
  const addOpts = TD.products.filter(p=>!usedSP.has(p.ma)).map(p=>`<option value="${p.ma}">${p.ma} — ${p.ten}</option>`).join('');

  c.innerHTML = `<div class="screen">
    <div class="screen-head">
      <div><div class="t">Đơn hàng <span class="mono" style="color:var(--primary-700)">06-05-2026</span></div>
        <div class="d">Bộ máy tự tra giá, tính hàng tặng & áp khuyến mãi theo thời gian thực</div></div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm" id="printOrder">${ICON.print} In đơn</button>
        <button class="btn btn-primary btn-sm" id="confirmOrder">${ICON.check} Xác nhận đơn</button>
      </div>
    </div>

    <!-- thông tin chung -->
    <div class="card ord-head">
      <div class="row">
        <div class="fld"><label>Khách hàng</label>
          <select id="selCust">${custOpts}</select></div>
        <div class="fld"><label>Trình dược viên</label>
          <select id="selTdv">${tdvOpts}</select></div>
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
            <tbody id="gridBody">${kq.rows.map((r,i)=>rowHtml(r,i)).join('')}</tbody>
          </table>
          <div class="add-line">
            ${ICON.plus}<select id="addSel"><option value="">+ Thêm sản phẩm vào đơn...</option>${addOpts}</select>
          </div>
        </div>

        <div class="card ord-summary" id="summary">${summaryHtml(kq)}</div>
      </div>

      <div class="card explain" id="explain">${explainHtml(kq, kh)}</div>
    </div>
  </div>`;

  // ---- bind ----
  c.querySelector('#selCust').onchange = (e)=>{ o.custMa = e.target.value; renderOrder(c); };
  c.querySelector('#selTdv').onchange  = (e)=>{ o.tdvMa = e.target.value; renderOrder(c); };
  c.querySelector('#addSel').onchange  = (e)=>{ if(e.target.value){ o.lines.push({maSP:e.target.value, soLuong:10, suDungGiaThung:true}); renderOrder(c); } };
  c.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ o.lines.splice(+b.dataset.rm,1); renderOrder(c); });
  c.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.toggle; o.lines[i].suDungGiaThung=!o.lines[i].suDungGiaThung; renderOrder(c); });
  c.querySelectorAll('input.qty').forEach(inp=>inp.oninput=()=>{
    const i=+inp.dataset.idx; o.lines[i].soLuong = Math.max(0, parseInt(inp.value)||0); recalcSoft(c);
  });
  c.querySelector('#confirmOrder').onclick = ()=>{
    if(kq.canhBao.some(w=>w.chan)){ toast('Không thể xác nhận: khách hết hạn giấy phép GDP','danger'); return; }
    toast('Đã xác nhận đơn 06-05-2026 · chuyển trạng thái “Đã duyệt”','ok');
  };
  c.querySelector('#printOrder').onclick = ()=> openPrint(kh, tdv, kq);
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

function rowHtml(r, i) {
  const sp = r.sp;
  const canHan = r.canHan ? ' warn-row' : '';
  // nút chuyển giá hộp/thùng chỉ khi SP có 2 giá & không phải bệnh viện
  const canToggle = sp.giaThung!=null && r.loaiGia!=='thau' && r.soLuong>=sp.qct;
  const toggle = canToggle ? `<button class="toggle-price" data-toggle="${i}">${r.loaiGia==='thung'?'→ giữ giá hộp':'→ dùng giá thùng'}</button>` : '';
  return `<tr data-row="${i}" class="${canHan}">
    <td><div class="pname">${sp.ten}</div>
      <div class="pmeta"><span class="mono">${sp.ma}</span> · ${sp.nhomHang} · QC ${sp.qct||'-'}${sp.qct?'h/thùng':''} ${r.canHan?`· <span style="color:oklch(0.55 0.13 60);font-weight:700">⚠ cận hạn ${r.conHan}th</span>`:''}</div></td>
    <td class="c"><input class="qty num" data-idx="${i}" value="${r.soLuong}" inputmode="numeric"/></td>
    <td class="r"><span class="price-tag"><span class="pv" data-cell="price-${i}">${TD.fmt(r.donGia)}</span><span class="pk ${pkClass(r.loaiGia)}" data-cell="pk-${i}">${pkLabel(r.loaiGia)}</span></span>${toggle}</td>
    <td class="c gift-cell" data-cell="gift-${i}">${r.tang>0?'+'+r.tang:'—'}</td>
    <td class="c num" data-cell="ck-${i}">${r.ckPhanTram>0?r.ckPhanTram+'%':'—'}</td>
    <td class="r line-tot" data-cell="tot-${i}">${TD.fmt(r.thanhTien)}</td>
    <td class="c"><button class="rm-btn" data-rm="${i}">${ICON.x}</button></td>
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
