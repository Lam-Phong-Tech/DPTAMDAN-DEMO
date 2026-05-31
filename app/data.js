/* =========================================================================
   DỮ LIỆU MẪU — Hệ thống Quản trị Bán hàng Tâm Đan
   Trích theo đúng ví dụ trong tài liệu URD (42 hộp/thùng, 20+5, quý 8tr...)
   ========================================================================= */

window.TD = window.TD || {};

/* ---- Trình dược viên (sheet TDV) ---- */
TD.tdvs = [
  { ma: 'TDV-01', ten: 'Nguyễn Thị Hồng', sdt: '0903 552 118', nhom: 'Khu vực Q.1 – Q.3', vaiTro: 'Sale' },
  { ma: 'TDV-02', ten: 'Trần Văn Khoa',  sdt: '0907 441 092', nhom: 'Khu vực Q.5 – Q.10', vaiTro: 'Sale' },
  { ma: 'TDV-03', ten: 'Lê Minh Tuấn',   sdt: '0938 220 771', nhom: 'Bệnh viện & Phòng khám', vaiTro: 'Sale' },
];

/* ---- Khách hàng (sheet KHÁCH HÀNG) ----
   gdpHetHan: ngày hết hạn giấy phép GDP (mặc định 3 năm)
   hopDongNam: mã HĐ năm nếu là khách VIP, kèm cam kết (triệu đồng)            */
TD.customers = [
  { ma: 'ETC-BS-014', ten: 'PK Đa khoa An Khang', nguoiLH: 'BS. Phạm Quốc', diaChi: '125 Lý Thường Kiệt', quan: 'Q.10',
    sdt: '028 3865 1190', nhomKhach: 'Phòng khám', loai: 'ETC', thanhToan: 'Tiền mặt',
    gdpCap: '2024-02-10', gdpHetHan: '2027-02-10', hopDongNam: null, tdv: 'TDV-03' },

  { ma: 'OTC-TP-082', ten: 'NT Minh Châu', nguoiLH: 'DS. Lê Minh Châu', diaChi: '48 Nguyễn Trãi', quan: 'Q.5',
    sdt: '0908 117 552', nhomKhach: 'Nhà thuốc', loai: 'OTC', thanhToan: 'Tiền mặt',
    gdpCap: '2023-07-01', gdpHetHan: '2026-06-28', hopDongNam: null, tdv: 'TDV-02' },

  { ma: 'OTC-TP-145', ten: 'NT Phước Thành', nguoiLH: 'DS. Võ Thị Lan', diaChi: '210 Cách Mạng Tháng 8', quan: 'Q.3',
    sdt: '0931 884 207', nhomKhach: 'Nhà thuốc', loai: 'OTC', thanhToan: 'Nợ CK',
    gdpCap: '2022-05-15', gdpHetHan: '2025-05-15', hopDongNam: null, tdv: 'TDV-01' }, // HẾT HẠN -> chặn

  { ma: 'ETC-NT-051', ten: 'NT Đại Phúc (VIP)', nguoiLH: 'DS. Huỳnh Đại', diaChi: '8 Trần Hưng Đạo', quan: 'Q.1',
    sdt: '0902 556 330', nhomKhach: 'Nhà thuốc', loai: 'ETC', thanhToan: 'Nợ CK',
    gdpCap: '2024-09-01', gdpHetHan: '2027-09-01', hopDongNam: { ma: 'TĐ 01', camKet: 200, nguongThang: 10 }, tdv: 'TDV-01' },

  { ma: 'ETC-BV-006', ten: 'BV Quận Bình Thạnh', nguoiLH: 'Khoa Dược', diaChi: '23 Nơ Trang Long', quan: 'Bình Thạnh',
    sdt: '028 3803 4567', nhomKhach: 'Bệnh viện', loai: 'ETC', thanhToan: 'Công nợ 60 ngày',
    gdpCap: '2023-01-20', gdpHetHan: '2026-12-31', hopDongNam: null, tdv: 'TDV-03', dauThau: true },

  { ma: 'ETC-BS-027', ten: 'PK Nhi Tâm Phúc', nguoiLH: 'BS. Đặng Hà', diaChi: '67 Sư Vạn Hạnh', quan: 'Q.10',
    sdt: '028 3927 4410', nhomKhach: 'Phòng khám', loai: 'ETC', thanhToan: 'Tiền mặt',
    gdpCap: '2023-08-12', gdpHetHan: '2026-08-12', hopDongNam: null, tdv: 'TDV-03' },
];

/* ---- Sản phẩm (sheet BBG 2026) ----
   giaThung = null  => sản phẩm MỘT GIÁ ("KHÔNG")
   nhomHang: THẦU | SONG SONG | BÁN ĐIỂM | TO
   tang: chuỗi "20+5" / "5+1" hoặc null
   chietKhau: % giảm trực tiếp trên dòng hoặc 0
   quy: tham gia chương trình quý (bool)
   duLich: tham gia chương trình du lịch (bool)                                */
TD.products = [
  { ma: 'SP-001', ten: 'Paracetamol 500mg', dvt: 'Hộp', qct: 42, giaHop: 42000, giaThung: 40000,
    nhomHang: 'THẦU', danhMuc: 'ETC', thue: 5, tang: '20+5', chietKhau: 0, quy: false, duLich: true,
    hanDung: '2027-08-30', giaThau: 38500 },

  { ma: 'SP-002', ten: 'Amoxicillin 500mg', dvt: 'Hộp', qct: 30, giaHop: 65000, giaThung: 62000,
    nhomHang: 'SONG SONG', danhMuc: 'ETC', thue: 5, tang: '20+5', chietKhau: 0, quy: false, duLich: true,
    hanDung: '2026-09-15', giaThau: 60000 },

  { ma: 'SP-003', ten: 'Vitamin C 1000mg (sủi)', dvt: 'Hộp', qct: 24, giaHop: 85000, giaThung: null,
    nhomHang: 'BÁN ĐIỂM', danhMuc: 'TPCN', thue: 8, tang: null, chietKhau: 0, quy: false, duLich: false,
    hanDung: '2028-01-20', giaThau: null },

  { ma: 'SP-004', ten: 'Men tiêu hóa Probio', dvt: 'Hộp', qct: 48, giaHop: 38000, giaThung: 36000,
    nhomHang: 'BÁN ĐIỂM', danhMuc: 'TPCN', thue: 8, tang: '5+1', chietKhau: 0, quy: true, duLich: true,
    hanDung: '2027-03-10', giaThau: null },

  { ma: 'SP-005', ten: 'Cao dán giảm đau Salonpas', dvt: 'Hộp', qct: 60, giaHop: 25000, giaThung: 23000,
    nhomHang: 'TO', danhMuc: 'OTC', thue: 10, tang: null, chietKhau: 40, quy: false, duLich: false,
    hanDung: '2027-11-05', giaThau: null },

  { ma: 'SP-006', ten: 'Siro ho trẻ em Prospan', dvt: 'Hộp', qct: 36, giaHop: 55000, giaThung: 52000,
    nhomHang: 'THẦU', danhMuc: 'OTC', thue: 8, tang: null, chietKhau: 0, quy: true, duLich: true,
    hanDung: '2026-07-28', giaThau: null }, // CẬN HẠN (< 14 tháng từ 05/2026 -> cảnh báo)

  { ma: 'SP-007', ten: 'Cefuroxim 250mg', dvt: 'Hộp', qct: 40, giaHop: 92000, giaThung: 88000,
    nhomHang: 'SONG SONG', danhMuc: 'ETC', thue: 5, tang: '5+1', chietKhau: 0, quy: false, duLich: true,
    hanDung: '2027-12-01', giaThau: 85000 },

  { ma: 'SP-008', ten: 'Canxi-D3 viên nang', dvt: 'Hộp', qct: 24, giaHop: 78000, giaThung: 74000,
    nhomHang: 'BÁN ĐIỂM', danhMuc: 'TPCN', thue: 8, tang: '20+5', chietKhau: 0, quy: true, duLich: false,
    hanDung: '2028-05-30', giaThau: null },

  { ma: 'SP-009', ten: 'Nước muối sinh lý 0.9%', dvt: 'Hộp', qct: 50, giaHop: 18000, giaThung: null,
    nhomHang: 'TO', danhMuc: 'OTC', thue: 5, tang: null, chietKhau: 0, quy: false, duLich: false,
    hanDung: '2027-06-12', giaThau: null },

  { ma: 'SP-010', ten: 'Omeprazol 20mg', dvt: 'Hộp', qct: 30, giaHop: 58000, giaThung: 55000,
    nhomHang: 'THẦU', danhMuc: 'ETC', thue: 5, tang: '5+1', chietKhau: 0, quy: true, duLich: true,
    hanDung: '2027-09-09', giaThau: 53000 },
];

/* ---- Hàng khuyến mãi / quà tặng (BBG 2026 - mục Hàng KM) ---- */
TD.gifts = [
  { ma: 'QT-01', ten: 'Thùng bia Heineken', giaTri: 320000 },
  { ma: 'QT-02', ten: 'Nồi chiên không dầu', giaTri: 1450000 },
  { ma: 'QT-03', ten: 'Bộ dầu gội Head&Shoulders', giaTri: 180000 },
  { ma: 'QT-04', ten: 'Chảo chống dính Sunhouse', giaTri: 290000 },
];

/* ---- Chương trình (sheet CT) ---- */
TD.programs = {
  // Chương trình tháng 05/2026 — theo TỔNG giá trị đơn, cộng thêm (xếp chồng)
  thang: {
    ten: 'CT Tháng 05/2026 – Tặng bia', ky: '05/2026',
    hieuLuc: ['2026-05-01', '2026-05-31'], qua: 'QT-01',
    bac: [
      { nguong: 10000000, sl: 1 },
      { nguong: 20000000, sl: 3 },
      { nguong: 30000000, sl: 7 },
      { nguong: 50000000, sl: 15 },
    ],
  },
  // Chương trình quý Q2/2026 — tích lũy giá trị SP tham gia, phân rã bậc cao nhất
  quy: {
    ten: 'CT Quý 2/2026 – Tích lũy hộp quà', ky: 'Q2/2026',
    hieuLuc: ['2026-04-01', '2026-06-30'],
    // bậc giá trị -> số hộp quà quy đổi
    bac: [
      { nguong: 4000000,  hopQua: 2 },
      { nguong: 8000000,  hopQua: 5 },
    ],
  },
  // Chương trình du lịch — tích lũy doanh số giá gốc, 50tr/vé
  duLich: {
    ten: 'CT Du lịch 2026 – Nha Trang', moiVe: 50000000,
    nhomDuDieuKien: ['THẦU', 'SONG SONG', 'BÁN ĐIỂM'],
    tranSongSong: 0.30, // tối đa 30% giá trị vé
  },
  // Hợp đồng năm — cam kết -> quà bậc; ưu đãi giá thùng khi đơn tháng >= nguong
  hopDongNam: {
    bacCamKet: [
      { camKet: 100, thungBia: 5 },
      { camKet: 200, thungBia: 10 },
    ],
  },
};

/* ---- Đơn hàng mẫu (cho danh sách & dashboard) ---- */
TD.orders = [
  { ma: '05-05-2026', khach: 'ETC-NT-051', tdv: 'TDV-01', ngay: '2026-05-28', kenh: 'Nhà thuốc',
    trangThai: 'Chờ xử lý', tong: 27680000,
    lines: [ { maSP:'SP-001', soLuong:44, suDungGiaThung:true }, { maSP:'SP-002', soLuong:30, suDungGiaThung:true },
             { maSP:'SP-004', soLuong:60, suDungGiaThung:true }, { maSP:'SP-005', soLuong:80, suDungGiaThung:true } ] },
  { ma: '04-05-2026', khach: 'ETC-BS-014', tdv: 'TDV-03', ngay: '2026-05-28', kenh: 'Phòng khám',
    trangThai: 'Đã duyệt', tong: 8420000, duyetBoi: 'Quản trị viên', duyetLuc: '28/05/2026 14:20',
    lines: [ { maSP:'SP-003', soLuong:24, suDungGiaThung:true }, { maSP:'SP-006', soLuong:36, suDungGiaThung:true } ] },
  { ma: '03-05-2026', khach: 'OTC-TP-082', tdv: 'TDV-02', ngay: '2026-05-27', kenh: 'Nhà thuốc',
    trangThai: 'Đã in', tong: 4150000, duyetBoi: 'Quản trị viên', duyetLuc: '27/05/2026 09:05',
    lines: [ { maSP:'SP-005', soLuong:60, suDungGiaThung:true }, { maSP:'SP-009', soLuong:50, suDungGiaThung:false } ] },
  { ma: '02-05-2026', khach: 'ETC-BV-006', tdv: 'TDV-03', ngay: '2026-05-27', kenh: 'Bệnh viện',
    trangThai: 'Đã duyệt', tong: 61500000, duyetBoi: 'Quản trị viên', duyetLuc: '27/05/2026 16:40',
    lines: [ { maSP:'SP-001', soLuong:400, suDungGiaThung:true }, { maSP:'SP-007', soLuong:200, suDungGiaThung:true } ] },
  { ma: '01-05-2026', khach: 'ETC-BS-027', tdv: 'TDV-03', ngay: '2026-05-26', kenh: 'Phòng khám',
    trangThai: 'Đã in', tong: 12300000, duyetBoi: 'Quản trị viên', duyetLuc: '26/05/2026 11:15',
    lines: [ { maSP:'SP-004', soLuong:96, suDungGiaThung:true }, { maSP:'SP-008', soLuong:48, suDungGiaThung:true } ] },
];

/* ---- Helpers tra cứu ---- */
TD.findCustomer = (ma) => TD.customers.find(c => c.ma === ma);
TD.findProduct  = (ma) => TD.products.find(p => p.ma === ma);
TD.findTDV      = (ma) => TD.tdvs.find(t => t.ma === ma);
TD.findGift     = (ma) => TD.gifts.find(g => g.ma === ma);

/* Ngày "hôm nay" cố định cho prototype để ví dụ luôn nhất quán */
TD.TODAY = new Date('2026-05-31');
