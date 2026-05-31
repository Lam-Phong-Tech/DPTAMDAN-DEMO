/* =========================================================================
   WEB ADMIN — Hành động: form khách hàng, form chương trình,
   hộp xác nhận, thông báo, xuất CSV/Excel
   ========================================================================= */

/* ---------------- Hộp xác nhận ---------------- */
function confirmDialog(title, desc, onYes) {
  const m = document.createElement('div');
  m.className = 'modal-mask';
  m.innerHTML = `<div class="modal">
    <div class="modal-ic">${ICON.warn}</div>
    <div class="modal-t">${title}</div>
    <div class="modal-d">${desc || ''}</div>
    <div class="modal-acts">
      <button class="btn btn-ghost" data-no>Hủy</button>
      <button class="btn" data-yes style="background:var(--danger);color:#fff">${ICON.trash} Xóa</button>
    </div></div>`;
  document.body.appendChild(m);
  requestAnimationFrame(() => m.classList.add('open'));
  const close = () => { m.classList.remove('open'); setTimeout(() => m.remove(), 200); };
  m.querySelector('[data-no]').onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  m.querySelector('[data-yes]').onclick = () => { close(); onYes && onYes(); };
}

/* ---------------- Hộp nhập lý do ---------------- */
function promptDialog(opt, onYes) {
  const { title, desc, placeholder = 'Nhập lý do…', yes = 'Xác nhận', danger = false, icon = 'edit' } = opt;
  const m = document.createElement('div');
  m.className = 'modal-mask';
  m.innerHTML = `<div class="modal" style="text-align:left">
    <div style="display:flex;align-items:center;gap:11px;margin-bottom:6px">
      <div class="modal-ic" style="margin:0;${danger?'':'background:var(--primary-50);color:var(--primary)'}">${ICON[icon]}</div>
      <div class="modal-t" style="text-align:left">${title}</div>
    </div>
    <div class="modal-d" style="text-align:left">${desc || ''}</div>
    <div class="fld" style="margin-top:14px"><label>Lý do <span class="req">*</span></label>
      <textarea id="pmReason" rows="3" placeholder="${placeholder}" style="font-family:inherit;font-size:13.5px;color:var(--ink);padding:9px 11px;border:1px solid var(--line);border-radius:8px;background:var(--surface);outline:none;resize:vertical"></textarea></div>
    <div class="modal-acts">
      <button class="btn btn-ghost" data-no>Hủy</button>
      <button class="btn ${danger?'':'btn-primary'}" data-yes ${danger?'style="background:var(--danger);color:#fff"':''}>${yes}</button>
    </div></div>`;
  document.body.appendChild(m);
  requestAnimationFrame(() => m.classList.add('open'));
  const ta = m.querySelector('#pmReason');
  ta.focus();
  ta.onfocus = () => ta.style.borderColor = 'var(--primary)';
  const close = () => { m.classList.remove('open'); setTimeout(() => m.remove(), 200); };
  m.querySelector('[data-no]').onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  m.querySelector('[data-yes]').onclick = () => {
    const r = ta.value.trim();
    if (!r) { ta.style.borderColor = 'var(--danger)'; ta.style.boxShadow = '0 0 0 3px var(--danger-50)'; ta.focus(); return; }
    close(); onYes && onYes(r);
  };
}

/* ---------------- Form Thêm / Sửa khách hàng ---------------- */
function nextCustomerCode(loai, nhom) {
  const pre = { 'Nhà thuốc': 'NT', 'Phòng khám': 'PK', 'Bệnh viện': 'BV' }[nhom] || 'KH';
  const n = (TD.customers.length + 1).toString().padStart(3, '0');
  return `${loai}-${pre}-${n}`;
}

function custFormHtml() {
  const tdvOpts = TD.tdvs.map(t => `<option value="${t.ma}">${t.ten} — ${t.ma}</option>`).join('');
  const ttOpts = ['Tiền mặt', 'Nợ CK', 'Công nợ 30 ngày', 'Công nợ 60 ngày'].map(t => `<option>${t}</option>`).join('');
  return `<div class="drawer-mask" id="custFormMask"><div class="drawer wide">
    <div class="drawer-head">
      <div class="ava" style="width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:#fff;background:var(--primary)">${ICON.cust}</div>
      <div><div style="font-weight:700;font-size:16px" id="cfTitle">Thêm khách hàng</div><div style="font-size:12.5px;color:var(--ink-mute)">Danh mục nhà thuốc · phòng khám · bệnh viện</div></div>
      <button class="x-btn" id="cfx">${ICON.x}</button>
    </div>
    <div class="drawer-body">
      <div class="fsec">
        <div class="fsh"><span class="fsn">1</span>Thông tin cơ sở</div>
        <div class="fgrid">
          <div class="fld"><label>Mã khách hàng</label><input id="c-ma" class="mono"/></div>
          <div class="fld"><label>Phân loại</label><div class="seg" id="c-loai"><button class="on" data-v="ETC">ETC · Kê đơn</button><button data-v="OTC">OTC</button></div></div>
          <div class="fld span2"><label>Tên cơ sở <span class="req">*</span></label><input id="c-ten" placeholder="VD: NT Minh Châu"/></div>
          <div class="fld span2"><label>Nhóm khách</label><div class="pill-group" id="c-nhom">${['Nhà thuốc','Phòng khám','Bệnh viện'].map((g,i)=>`<button class="gpill ${i===0?'on':''}" data-v="${g}">${g}</button>`).join('')}</div></div>
          <div class="fld"><label>Người liên hệ</label><input id="c-lh" placeholder="VD: DS. Nguyễn An"/></div>
          <div class="fld"><label>Điện thoại</label><input id="c-sdt" placeholder="0900 000 000"/></div>
          <div class="fld span2"><label>Địa chỉ</label><input id="c-diaChi" placeholder="Số nhà, đường"/></div>
          <div class="fld span2"><label>Khu vực / Quận</label><input id="c-quan" placeholder="VD: Q.1"/></div>
        </div>
      </div>

      <div class="fsec">
        <div class="fsh"><span class="fsn">2</span>Thanh toán & phụ trách</div>
        <div class="fgrid">
          <div class="fld"><label>Hình thức thanh toán</label><select id="c-tt">${ttOpts}</select></div>
          <div class="fld"><label>TDV phụ trách</label><select id="c-tdv">${tdvOpts}</select></div>
        </div>
      </div>

      <div class="fsec">
        <div class="fsh"><span class="fsn">3</span>Giấy phép GDP <span class="fsh-sub">cảnh báo tự động</span></div>
        <div class="fgrid">
          <div class="fld"><label>Ngày cấp</label><input id="c-gdpCap" type="date" value="2024-01-01"/></div>
          <div class="fld"><label>Ngày hết hạn</label><input id="c-gdpHet" type="date" value="2027-01-01"/></div>
        </div>
        <div style="font-size:11.5px;color:var(--ink-mute);margin-top:8px">Hệ thống cảnh báo khi còn &lt; 60 ngày và chặn lên đơn khi hết hạn (BR-15).</div>
      </div>

      <div class="fsec">
        <div class="fsh"><span class="fsn">4</span>Hợp đồng năm <span class="fsh-sub">khách VIP</span></div>
        <div class="toggle-row">
          <div><div class="tr-t">Có hợp đồng năm</div><div class="tr-d">Cam kết doanh số · ưu đãi giá thùng theo ngưỡng tháng</div></div>
          <button class="switch" id="c-hdn"><span class="knob"></span></button>
        </div>
        <div class="fgrid fld-dim" id="c-hdnWrap" style="margin-top:12px">
          <div class="fld"><label>Mã hợp đồng</label><input id="c-hdnMa" placeholder="VD: TĐ 01"/></div>
          <div class="fld"><label>Cam kết / năm</label><div class="affix"><input id="c-hdnCk" type="number" value="100"/><span class="suf">triệu</span></div></div>
          <div class="fld span2"><label>Ngưỡng đơn tháng hưởng giá thùng</label><div class="affix"><input id="c-hdnNg" type="number" value="10"/><span class="suf">triệu / tháng</span></div></div>
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-ghost" id="cfDelete" style="margin-right:auto;display:none;color:var(--danger);border-color:oklch(0.85 0.06 26)">${ICON.trash} Xóa</button>
      <button class="btn btn-ghost" id="cfCancel">Hủy</button>
      <button class="btn btn-primary" id="cfSave">${ICON.check} Lưu khách hàng</button>
    </div>
  </div></div>`;
}

function openCustomerForm(c, editMa) {
  const mask = c.querySelector('#custFormMask');
  const q = sel => mask.querySelector(sel);
  const ed = editMa ? TD.findCustomer(editMa) : null;
  const nhom = q('#c-nhom'), loai = q('#c-loai'), hdn = q('#c-hdn'), hdnWrap = q('#c-hdnWrap');
  const getNhom = () => nhom.querySelector('.on').dataset.v;
  const getLoai = () => loai.querySelector('.on').dataset.v;
  let maEdited = !!ed;
  const regenCode = () => { if (!maEdited) q('#c-ma').value = nextCustomerCode(getLoai(), getNhom()); };

  if (ed) {
    q('#cfTitle').textContent = 'Sửa khách hàng';
    q('#cfSave').innerHTML = `${ICON.check} Lưu thay đổi`;
    q('#cfDelete').style.display = '';
    q('#c-ma').value = ed.ma; q('#c-ten').value = ed.ten;
    loai.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === ed.loai));
    nhom.querySelectorAll('.gpill').forEach(b => b.classList.toggle('on', b.dataset.v === ed.nhomKhach));
    q('#c-lh').value = ed.nguoiLH || ''; q('#c-sdt').value = ed.sdt || '';
    q('#c-diaChi').value = ed.diaChi || ''; q('#c-quan').value = ed.quan || '';
    q('#c-tt').value = ed.thanhToan; q('#c-tdv').value = ed.tdv || TD.tdvs[0].ma;
    q('#c-gdpCap').value = ed.gdpCap; q('#c-gdpHet').value = ed.gdpHetHan;
    const on = !!ed.hopDongNam;
    hdn.classList.toggle('on', on); hdnWrap.classList.toggle('fld-dim', !on);
    if (on) { q('#c-hdnMa').value = ed.hopDongNam.ma; q('#c-hdnCk').value = ed.hopDongNam.camKet; q('#c-hdnNg').value = ed.hopDongNam.nguongThang; }
  } else {
    q('#cfTitle').textContent = 'Thêm khách hàng';
    q('#cfSave').innerHTML = `${ICON.check} Lưu khách hàng`;
    q('#cfDelete').style.display = 'none';
    ['#c-ten','#c-lh','#c-sdt','#c-diaChi','#c-quan'].forEach(id => q(id).value = '');
    q('#c-ten').classList.remove('err');
    loai.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on', i===0));
    nhom.querySelectorAll('.gpill').forEach((b,i)=>b.classList.toggle('on', i===0));
    hdn.classList.remove('on'); hdnWrap.classList.add('fld-dim');
    regenCode();
  }

  mask.classList.add('open');
  const close = () => mask.classList.remove('open');
  q('#cfx').onclick = close; q('#cfCancel').onclick = close;
  mask.onclick = e => { if (e.target === mask) close(); };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });

  loai.querySelectorAll('button').forEach(b => b.onclick = () => { loai.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); regenCode(); });
  nhom.querySelectorAll('.gpill').forEach(b => b.onclick = () => { nhom.querySelectorAll('.gpill').forEach(x=>x.classList.remove('on')); b.classList.add('on'); regenCode(); });
  q('#c-ma').oninput = () => { maEdited = true; };
  hdn.onclick = () => { hdn.classList.toggle('on'); hdnWrap.classList.toggle('fld-dim', !hdn.classList.contains('on')); };

  q('#cfDelete').onclick = () => { close(); delCustomer(editMa); };

  q('#cfSave').onclick = () => {
    const ten = q('#c-ten').value.trim();
    if (!ten) { q('#c-ten').classList.add('err'); q('#c-ten').focus(); return; }
    const obj = {
      ma: q('#c-ma').value.trim() || nextCustomerCode(getLoai(), getNhom()),
      ten, nguoiLH: q('#c-lh').value.trim(), diaChi: q('#c-diaChi').value.trim(), quan: q('#c-quan').value.trim(),
      sdt: q('#c-sdt').value.trim(), nhomKhach: getNhom(), loai: getLoai(), thanhToan: q('#c-tt').value,
      gdpCap: q('#c-gdpCap').value, gdpHetHan: q('#c-gdpHet').value, tdv: q('#c-tdv').value,
      hopDongNam: hdn.classList.contains('on') ? { ma: q('#c-hdnMa').value.trim() || 'HĐ', camKet: parseInt(q('#c-hdnCk').value||0,10), nguongThang: parseInt(q('#c-hdnNg').value||0,10) } : null,
    };
    if (ed) { Object.assign(ed, obj); close(); renderContent(); toast(`Đã cập nhật ${obj.ma}`, 'ok'); }
    else { TD.customers.push(obj); close(); renderContent(); toast(`Đã thêm khách ${obj.ma} · ${obj.ten}`, 'ok'); }
  };
}

/* ---------------- Form Tạo chương trình ---------------- */
function promoFormHtml() {
  const loais = ['Theo tổng đơn', 'Tích lũy SP', 'Du lịch', 'Chiết khấu', 'Khác'];
  return `<div class="drawer-mask" id="promoFormMask"><div class="drawer wide">
    <div class="drawer-head">
      <div class="ava" style="width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:#fff;background:var(--primary)">${ICON.promo}</div>
      <div><div style="font-weight:700;font-size:16px">Tạo chương trình</div><div style="font-size:12.5px;color:var(--ink-mute)">Bộ máy sẽ áp dụng theo điều kiện cấu hình</div></div>
      <button class="x-btn" id="pfx">${ICON.x}</button>
    </div>
    <div class="drawer-body">
      <div class="fsec">
        <div class="fsh"><span class="fsn">1</span>Thông tin chương trình</div>
        <div class="fgrid">
          <div class="fld span2"><label>Tên chương trình <span class="req">*</span></label><input id="pf-ten" placeholder="VD: CT Tháng 06/2026 – Tặng quà"/></div>
          <div class="fld span2"><label>Loại chương trình</label><div class="pill-group" id="pf-loai">${loais.map((g,i)=>`<button class="gpill ${i===0?'on':''}" data-v="${g}">${g}</button>`).join('')}</div></div>
          <div class="fld"><label>Kỳ áp dụng</label><input id="pf-ky" placeholder="VD: 06/2026"/></div>
          <div class="fld"><label>Hiệu lực đến</label><input id="pf-het" type="date" value="2026-06-30"/></div>
        </div>
      </div>
      <div class="fsec">
        <div class="fsh"><span class="fsn">2</span>Điều kiện & ưu đãi</div>
        <div class="fgrid">
          <div class="fld span2"><label>Điều kiện áp dụng</label><input id="pf-dk" placeholder="VD: Tổng đơn ≥ 10 triệu"/></div>
          <div class="fld span2"><label>Ưu đãi / quà tặng</label><input id="pf-ud" placeholder="VD: Tặng 1 thùng bia"/></div>
        </div>
        <div class="golden" style="margin-top:13px;margin-bottom:0">${ICON.spark}<span>Tuân thủ “quy tắc vàng”: chương trình cấp sản phẩm <b>không cộng dồn</b>; chương trình theo tổng đơn được cộng thêm (BR-14).</span></div>
      </div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-ghost" id="pfCancel">Hủy</button>
      <button class="btn btn-primary" id="pfSave">${ICON.check} Tạo chương trình</button>
    </div>
  </div></div>`;
}

function openPromoForm(c) {
  const mask = c.querySelector('#promoFormMask');
  const q = sel => mask.querySelector(sel);
  ['#pf-ten','#pf-ky','#pf-dk','#pf-ud'].forEach(id => q(id).value = '');
  q('#pf-ten').classList.remove('err');
  const loai = q('#pf-loai');
  loai.querySelectorAll('.gpill').forEach((b,i)=>b.classList.toggle('on', i===0));
  mask.classList.add('open'); q('#pf-ten').focus();
  const close = () => mask.classList.remove('open');
  q('#pfx').onclick = close; q('#pfCancel').onclick = close;
  mask.onclick = e => { if (e.target === mask) close(); };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  loai.querySelectorAll('.gpill').forEach(b => b.onclick = () => { loai.querySelectorAll('.gpill').forEach(x=>x.classList.remove('on')); b.classList.add('on'); });

  q('#pfSave').onclick = () => {
    const ten = q('#pf-ten').value.trim();
    if (!ten) { q('#pf-ten').classList.add('err'); q('#pf-ten').focus(); return; }
    TD.customPrograms = TD.customPrograms || [];
    TD.customPrograms.push({
      ten, loai: loai.querySelector('.on').dataset.v,
      ky: q('#pf-ky').value.trim(), het: q('#pf-het').value,
      dieuKien: q('#pf-dk').value.trim(), uuDai: q('#pf-ud').value.trim(),
    });
    close(); renderContent(); toast(`Đã tạo chương trình “${ten}”`, 'ok');
  };
}

/* ---------------- Thông báo (chuông) ---------------- */
function buildNotis() {
  const out = [];
  TD.customers.forEach(k => {
    const g = TD.trangThaiGDP(k);
    if (g.code === 'het') out.push({ level: 'danger', ic: 'warn', t: `${k.ten} hết hạn giấy phép GDP`, d: `Hết hạn ${k.gdpHetHan.split('-').reverse().join('/')} — bị chặn lên đơn`, go: 'customers' });
    else if (g.code === 'gan') out.push({ level: 'warn', ic: 'clock', t: `${k.ten} sắp hết hạn GDP`, d: `Còn ${g.days} ngày — nhắc khách gia hạn`, go: 'customers' });
  });
  TD.products.forEach(p => { if (TD.thangConHan(p.hanDung) <= 14) out.push({ level: 'warn', ic: 'spark', t: `${p.ten} cận hạn dùng`, d: `Còn ${TD.thangConHan(p.hanDung)} tháng — ưu tiên xuất (FEFO)`, go: 'products' }); });
  const cho = TD.orders.filter(o => o.trangThai === 'Chờ xử lý').length;
  if (cho) out.push({ level: 'primary', ic: 'order', t: `${cho} đơn chờ xử lý`, d: 'Cần kiểm tra & duyệt', go: 'orders' });
  return out;
}

function toggleNoti() {
  const wrap = document.getElementById('notiWrap');
  if (!wrap) return;
  if (window.__notiOff) { document.removeEventListener('click', window.__notiOff); window.__notiOff = null; }
  if (wrap.firstChild) { wrap.innerHTML = ''; return; }
  const notis = buildNotis();
  const map = { danger: ['var(--danger-50)', 'var(--danger)'], warn: ['var(--warn-50)', 'oklch(0.55 0.13 60)'], primary: ['var(--primary-50)', 'var(--primary)'] };
  wrap.innerHTML = `<div class="noti-pop">
    <div class="noti-head">Thông báo <span class="badge badge-gray">${notis.length}</span></div>
    <div class="noti-list">${notis.map((n, i) => {
      const [bg, col] = map[n.level];
      return `<button class="noti-row" data-ni="${i}"><span class="noti-ic" style="background:${bg};color:${col}">${ICON[n.ic]}</span><span><span class="noti-t">${n.t}</span><span class="noti-d">${n.d}</span></span></button>`;
    }).join('') || '<div style="padding:18px;text-align:center;color:var(--ink-mute);font-size:13px">Không có thông báo</div>'}</div>
    <div class="noti-foot">Cập nhật theo dữ liệu thời gian thực</div>
  </div>`;
  wrap.querySelectorAll('[data-ni]').forEach(b => b.onclick = () => { const n = notis[+b.dataset.ni]; wrap.innerHTML = ''; go(n.go); });
  window.__notiOff = (e) => { if (!wrap.contains(e.target) && !e.target.closest('#bellBtn')) { wrap.innerHTML = ''; document.removeEventListener('click', window.__notiOff); window.__notiOff = null; } };
  setTimeout(() => document.addEventListener('click', window.__notiOff), 0);
}

/* ---------------- Xuất CSV / Excel ---------------- */
function downloadCSV(filename, headers, rows) {
  const esc = v => { const s = (v == null ? '' : String(v)); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = '\uFEFF' + [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.endsWith('.csv') ? filename : filename + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`Đã xuất ${rows.length} dòng → ${a.download}`, 'ok');
}

function exportOrders(list) {
  downloadCSV('danh-sach-don-052026',
    ['Mã đơn', 'Tên khách', 'Mã KH', 'TDV', 'Kênh', 'Ngày', 'Tổng tiền', 'Trạng thái'],
    list.map(o => { const kh = TD.findCustomer(o.khach), t = TD.findTDV(o.tdv); return [o.ma, kh ? kh.ten : '', o.khach, t ? t.ten : o.tdv, o.kenh, o.ngay.split('-').reverse().join('/'), o.tong, o.trangThai]; }));
}

function exportProducts(list) {
  downloadCSV('bang-bao-gia-bbg2026',
    ['Mã SP', 'Tên sản phẩm', 'ĐVT', 'Nhóm hàng', 'Phân loại', 'Thuế %', 'QC/Thùng', 'Giá hộp', 'Giá thùng', 'Giá thầu', 'Hàng tặng', 'CK %', 'Hạn dùng'],
    list.map(p => [p.ma, p.ten, p.dvt, p.nhomHang, p.danhMuc, p.thue, p.qct || '', p.giaHop, p.giaThung == null ? 'KHÔNG' : p.giaThung, p.giaThau == null ? '' : p.giaThau, p.tang || '', p.chietKhau || 0, p.hanDung.split('-').reverse().join('/')]));
}

function exportCustomers(list) {
  downloadCSV('danh-sach-khach-hang',
    ['Mã KH', 'Tên cơ sở', 'Nhóm', 'Loại', 'Người liên hệ', 'Điện thoại', 'Địa chỉ', 'Quận', 'Thanh toán', 'HĐ năm', 'GDP hết hạn'],
    list.map(k => [k.ma, k.ten, k.nhomKhach, k.loai, k.nguoiLH, k.sdt, k.diaChi, k.quan, k.thanhToan, k.hopDongNam ? k.hopDongNam.ma : '', k.gdpHetHan.split('-').reverse().join('/')]));
}

function exportReport(cols, fname) {
  const val = (o, col) => {
    const kh = TD.findCustomer(o.khach), t = TD.findTDV(o.tdv);
    return ({
      'Mã đơn': o.ma, 'TDV': t ? t.ten : o.tdv, 'Mã KH': o.khach, 'Tên khách': kh ? kh.ten : '',
      'Quận': kh ? kh.quan : '', 'Doanh thu': o.tong, 'Ngày': o.ngay.split('-').reverse().join('/'),
      'Hình thức TT': kh ? kh.thanhToan : '',
    })[col] ?? '';
  };
  downloadCSV(fname || 'bao-cao-doanh-so-052026', cols, TD.orders.map(o => cols.map(c => val(o, c))));
}
