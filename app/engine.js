/* =========================================================================
   BỘ MÁY TÍNH GIÁ & KHUYẾN MÃI TỰ ĐỘNG
   Triển khai các quy tắc nghiệp vụ BR-01 … BR-22 trong tài liệu URD.
   Trả về breakdown chi tiết kèm "diễn giải" (FR-CAL-11).
   ========================================================================= */
window.TD = window.TD || {};

TD.fmt = (n) => (n || 0).toLocaleString('vi-VN');
TD.fmtVnd = (n) => TD.fmt(Math.round(n || 0)) + ' ₫';

/* Số tháng còn lại đến hạn dùng (so với TODAY) */
TD.thangConHan = (hanDung) => {
  const d = new Date(hanDung);
  return (d.getFullYear() - TD.TODAY.getFullYear()) * 12 + (d.getMonth() - TD.TODAY.getMonth());
};

/* Trạng thái giấy phép GDP của khách */
TD.trangThaiGDP = (kh) => {
  const d = new Date(kh.gdpHetHan);
  const days = Math.round((d - TD.TODAY) / 86400000);
  if (days < 0)  return { code: 'het',  days, label: 'Đã hết hạn giấy phép', level: 'danger' };
  if (days < 60) return { code: 'gan',  days, label: `Giấy phép còn ${days} ngày`, level: 'warn' };
  return { code: 'con', days, label: `Giấy phép còn hiệu lực`, level: 'ok' };
};

const NGUONG_CAN_HAN = 14; // tháng — dưới ngưỡng này coi là cận hạn

/* -------------------------------------------------------------------------
   Tính một dòng sản phẩm.
   opts: { suDungGiaThung, hopDongNamUuDai, tongDonThang (cho HĐ năm) }
   ------------------------------------------------------------------------- */
TD.tinhDong = function (sp, soLuong, kh, opts = {}) {
  const dien = []; // diễn giải
  let donGia, loaiGia;

  const laBenhVien = kh && kh.nhomHach === 'Bệnh viện';
  const isBV = kh && kh.nhomKhach === 'Bệnh viện';

  // 1) Xác định đơn giá ------------------------------------------------------
  if (isBV && sp.giaThau != null) {
    donGia = sp.giaThau; loaiGia = 'thau';
    dien.push(`Khách bệnh viện → áp <b>giá đấu thầu</b> ${TD.fmtVnd(donGia)} (BR-13).`);
  } else if (sp.giaThung == null) {
    donGia = sp.giaHop; loaiGia = 'mot-gia';
    dien.push(`Sản phẩm một giá (“KHÔNG”) → dùng một mức ${TD.fmtVnd(donGia)} cho mọi số lượng (BR-02).`);
  } else {
    const duQuyCach = soLuong >= sp.qct;
    const uuDaiHDN = !!opts.hopDongNamUuDai;
    const dungThung = opts.suDungGiaThung !== false && (duQuyCach || uuDaiHDN);
    if (dungThung) {
      donGia = sp.giaThung; loaiGia = 'thung';
      if (uuDaiHDN && !duQuyCach) {
        dien.push(`Khách <b>hợp đồng năm</b>, đơn tháng đạt ngưỡng → hưởng <b>giá thùng</b> ${TD.fmtVnd(donGia)} dù chưa đủ quy cách (BR-12).`);
      } else {
        dien.push(`SL ${soLuong} ≥ quy cách ${sp.qct} hộp/thùng → đủ điều kiện <b>giá thùng</b> ${TD.fmtVnd(donGia)} (BR-01).`);
      }
    } else {
      donGia = sp.giaHop; loaiGia = 'hop';
      if (duQuyCach) dien.push(`Đủ quy cách nhưng đang <b>giữ giá hộp</b> theo lựa chọn (BR-01).`);
      else dien.push(`SL ${soLuong} < quy cách ${sp.qct} → áp <b>giá hộp</b> ${TD.fmtVnd(donGia)}.`);
    }
  }

  // 2) Hàng tặng theo số lượng (BR-03) --------------------------------------
  let tang = 0, tangMoTa = null;
  if (sp.tang && sp.giaThung != null && !(isBV)) {
    const [muaStr, tangStr] = sp.tang.split('+');
    const mua = +muaStr, thuong = +tangStr;
    tang = Math.floor(soLuong / mua) * thuong;
    if (tang > 0) {
      tangMoTa = sp.tang;
      const du = soLuong % mua;
      dien.push(`Hàng tặng ${sp.tang}: ${soLuong} hộp → tặng <b>${tang}</b> hộp` +
        (du ? ` (dư ${du} hộp chưa đủ mốc, không tặng thêm — BR-03).` : `.`));
    }
  }

  // 3) Chiết khấu theo dòng (BR-20) -----------------------------------------
  let ckPhanTram = 0;
  if (sp.chietKhau > 0 && !isBV) {
    ckPhanTram = sp.chietKhau;
    dien.push(`Sản phẩm có chương trình <b>chiết khấu ${ckPhanTram}%</b> áp trực tiếp trên dòng (BR-20).`);
  }

  // 4) Thành tiền (BR-19) ----------------------------------------------------
  const truocCK = donGia * soLuong;
  const ckTien = Math.round(truocCK * ckPhanTram / 100);
  const thanhTien = truocCK - ckTien;

  // 5) Cảnh báo cận hạn (BR-16) ---------------------------------------------
  const conHan = TD.thangConHan(sp.hanDung);
  const canHan = conHan <= NGUONG_CAN_HAN;
  if (canHan) dien.push(`⚠ Sản phẩm <b>cận hạn</b>: còn ${conHan} tháng (HD ${sp.hanDung}) — ưu tiên xuất lô gần hết hạn (FEFO, BR-16).`);

  return {
    sp, soLuong, donGia, loaiGia, tang, tangMoTa, ckPhanTram, ckTien,
    truocCK, thanhTien, canHan, conHan, dien,
  };
};

/* -------------------------------------------------------------------------
   Tính toàn bộ đơn: các dòng + chương trình cấp đơn.
   lines: [{ maSP, soLuong, suDungGiaThung }]
   ------------------------------------------------------------------------- */
TD.tinhDon = function (kh, lines, opts = {}) {
  const isBV = kh && kh.nhomKhach === 'Bệnh viện';
  const hdn = kh && kh.hopDongNam;

  // Sơ bộ tổng để xét ưu đãi giá thùng theo HĐ năm
  let tongSoBo = 0;
  for (const l of lines) {
    const sp = TD.findProduct(l.maSP); if (!sp) continue;
    const giaTm = (isBV && sp.giaThau != null) ? sp.giaThau : (sp.giaThung ?? sp.giaHop);
    tongSoBo += giaTm * l.soLuong;
  }
  const hdnUuDai = !!(hdn && !isBV && tongSoBo >= hdn.nguongThang * 1000000);

  // Tính từng dòng
  const rows = lines.map(l => {
    const sp = TD.findProduct(l.maSP);
    return TD.tinhDong(sp, l.soLuong, kh, {
      suDungGiaThung: l.suDungGiaThung,
      hopDongNamUuDai: hdnUuDai,
    });
  });

  const tongTien = rows.reduce((s, r) => s + r.thanhTien, 0);
  const tongCK   = rows.reduce((s, r) => s + r.ckTien, 0);
  const tongTang = rows.reduce((s, r) => s + r.tang, 0);

  const ketQua = { kh, rows, tongTien, tongCK, tongTang, hdnUuDai, isBV, quaTang: [], canhBao: [], dien: [] };

  // Cảnh báo giấy phép (BR-15)
  if (kh) {
    const gdp = TD.trangThaiGDP(kh);
    if (gdp.code === 'het') ketQua.canhBao.push({ level: 'danger', text: `Khách ${kh.ma} đã HẾT HẠN giấy phép GDP (${kh.gdpHetHan}) — KHÔNG cho phép lên đơn (BR-15).`, chan: true });
    else if (gdp.code === 'gan') ketQua.canhBao.push({ level: 'warn', text: `Giấy phép GDP của khách sắp hết hạn (còn ${gdp.days} ngày).` });
  }

  // Bệnh viện: không áp khuyến mãi thông thường (BR-13)
  if (isBV) {
    ketQua.dien.push('Khách <b>bệnh viện</b>: áp giá đấu thầu, công nợ theo điều khoản, <b>không áp</b> chương trình khuyến mãi thông thường và không cộng dồn hợp đồng năm (BR-13).');
    return ketQua;
  }

  // --- Chương trình tháng (BR-06, BR-07): theo tổng đơn, cộng thêm ---
  const ctT = TD.programs.thang;
  let bacThang = null;
  for (const b of ctT.bac) if (tongTien >= b.nguong) bacThang = b;
  if (bacThang) {
    const g = TD.findGift(ctT.qua);
    ketQua.quaTang.push({ nguon: 'Tháng', ten: g.ten, sl: bacThang.sl, dvt: 'thùng' });
    ketQua.dien.push(`<b>CT Tháng:</b> tổng đơn ${TD.fmtVnd(tongTien)} đạt khung ${TD.fmt(bacThang.nguong)} ₫ → tặng <b>${bacThang.sl} ${g.ten}</b>. Khung này <b>cộng thêm</b> (BR-06); mỗi khách chỉ nhận 1 lần/khung trong tháng (BR-07).`);
  }

  // --- Chương trình quý (BR-04, BR-05): tích lũy SP tham gia, phân rã bậc cao ---
  const spQuy = rows.filter(r => r.sp.quy);
  const giaTriQuy = spQuy.reduce((s, r) => s + r.thanhTien, 0);
  if (giaTriQuy > 0) {
    const bacCao = [...TD.programs.quy.bac].sort((a, b) => b.nguong - a.nguong)[0];
    let conLai = giaTriQuy, hopQua = 0, phanRa = [];
    for (const b of [...TD.programs.quy.bac].sort((a, c) => c.nguong - a.nguong)) {
      while (conLai >= b.nguong) { conLai -= b.nguong; hopQua += b.hopQua; phanRa.push(b.nguong); }
    }
    if (hopQua > 0) {
      ketQua.quaTang.push({ nguon: 'Quý', ten: `${hopQua} hộp quà (chọn linh hoạt)`, sl: hopQua, dvt: 'hộp' });
      const moTaPhanRa = phanRa.map(v => TD.fmt(v/1000000) + 'tr').join(' + ');
      ketQua.dien.push(`<b>CT Quý:</b> giá trị SP tham gia ${TD.fmtVnd(giaTriQuy)} → phân rã theo bậc cao nhất (${moTaPhanRa}) = <b>${hopQua} hộp quà</b>; khách chọn loại quà theo giá trị tương đương (BR-05, BR-21). SP chương trình quý không hưởng CT cấp SP khác cùng lúc (BR-04).`);
    }
  }

  // --- Chương trình du lịch (BR-08, BR-09, BR-10): tích lũy giá gốc ---
  const ctDL = TD.programs.duLich;
  let dsDuLich = 0, dsSongSong = 0;
  for (const r of rows) {
    if (!r.sp.duLich) continue;
    if (!ctDL.nhomDuDieuKien.includes(r.sp.nhomHang)) continue; // loại TO (BR-09)
    const giaGoc = (r.sp.giaThung ?? r.sp.giaHop) * r.soLuong;
    if (r.sp.nhomHang === 'SONG SONG') dsSongSong += giaGoc;
    else dsDuLich += giaGoc;
  }
  const tranSS = ctDL.moiVe * ctDL.tranSongSong; // trần 30% mỗi vé
  const ssTinh = Math.min(dsSongSong, tranSS);
  const dsDuLichTong = dsDuLich + ssTinh;
  if (dsDuLichTong > 0) {
    const ve = Math.floor(dsDuLichTong / ctDL.moiVe);
    ketQua.duLich = { tong: dsDuLichTong, ve, songSong: dsSongSong, ssTinh, tran: tranSS, moiVe: ctDL.moiVe };
    let txt = `<b>CT Du lịch:</b> doanh số đủ điều kiện (giá gốc) ${TD.fmtVnd(dsDuLichTong)} / mốc ${TD.fmt(ctDL.moiVe/1000000)}tr — đạt <b>${ve} vé</b> (BR-08).`;
    if (dsSongSong > tranSS) txt += ` Nhóm SONG SONG đóng góp ${TD.fmtVnd(dsSongSong)} nhưng bị giới hạn trần 30% = ${TD.fmtVnd(tranSS)} (BR-10).`;
    txt += ` Nhóm TO không tham gia (BR-09).`;
    ketQua.dien.push(txt);
  }

  // --- Hợp đồng năm (BR-11, BR-12) ---
  if (hdn) {
    ketQua.hopDongNam = { ...hdn, uuDai: hdnUuDai };
    let t = `<b>Hợp đồng năm ${hdn.ma}:</b> cam kết ${hdn.camKet}tr/năm, doanh số cộng dồn trên toàn bộ SP (BR-11).`;
    if (hdnUuDai) t += ` Đơn tháng ${TD.fmtVnd(tongSoBo)} ≥ ngưỡng ${hdn.nguongThang}tr → đã tự áp <b>giá thùng</b> cho các dòng đủ điều kiện (BR-12).`;
    ketQua.dien.push(t);
  }

  return ketQua;
};
