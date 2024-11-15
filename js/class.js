class QUOCGIA{
    constructor(MA_QUOCGIA, TEN_QUOCGIA, HINHANH){
        this.MA_QUOCGIA = MA_QUOCGIA;
        this.TEN_QUOCGIA = TEN_QUOCGIA;
        this.HINHANH = HINHANH;
    }
}

class TINHTHANH{
    constructor(MA_TINHTHANH, TEN_TINHTHANH, MA_QUOCGIA, HINHANH, MA_QUOCGIA_QUOCGIum){
        this.MA_TINHTHANH = MA_TINHTHANH;
        this.TEN_TINHTHANH = TEN_TINHTHANH;
        this.MA_QUOCGIA = MA_QUOCGIA;
        this.HINHANH = HINHANH;
        this.MA_QUOCGIA_QUOCGIum = MA_QUOCGIA_QUOCGIum;
    }
}

class KHACHSAN{
    constructor(MA_KS, TEN_KS, MO_TA, HINHANH, SOSAO, TRANGTHAI_KS, QRTHANHTOAN, MA_VITRI, YEU_CAU_COC, TI_LE_COC, MA_VITRI_VITRI, MA_TINHTHANH_TINHTHANH, MA_QUOCGIA_QUOCGIum, PHONGs){
        this.MA_KS = MA_KS;
        this.TEN_KS = TEN_KS;
        this.MO_TA = MO_TA;
        this.HINHANH = HINHANH;
        this.SOSAO = SOSAO;
        this.TRANGTHAI_KS = TRANGTHAI_KS;
        this.QRTHANHTOAN = QRTHANHTOAN;
        this.MA_VITRI = MA_VITRI;
        this.YEU_CAU_COC = YEU_CAU_COC;
        this.TI_LE_COC = TI_LE_COC;
        this.MA_VITRI_VITRI = MA_VITRI_VITRI;
        this.MA_TINHTHANH_TINHTHANH = MA_TINHTHANH_TINHTHANH;
        this.MA_QUOCGIA_QUOCGIum = MA_QUOCGIA_QUOCGIum;
        this.PHONGs = PHONGs;
    }
}

class NGUOIDUNG{
    constructor(MA_ND, HOTEN, EMAIL, MATKHAU, SDT, NGAYSINH, GIOITINH, CHUCVU, NGAYDANGKY, ANHDAIDIEN){
        this.MA_ND = MA_ND;
        this.HOTEN = HOTEN;
        this.EMAIL = EMAIL;
        this.MATKHAU = MATKHAU;
        this.SDT = SDT;
        this.NGAYSINH = NGAYSINH;
        this.GIOITINH = GIOITINH;
        this.CHUCVU = CHUCVU;
        this.NGAYDANGKY = NGAYDANGKY;
        this.ANHDAIDIEN = ANHDAIDIEN;
    }
}

class MAGIAMGIA{
    constructor(MA_MGG, MA_GIAMGIA, PHANTRAM, NGAYBATDAU, NGAYKETTHUC, DIEU_KIEN){
        this.MA_MGG = MA_MGG;
        this.MA_GIAMGIA = MA_GIAMGIA;
        this.PHANTRAM = PHANTRAM;
        this.NGAYBATDAU = NGAYBATDAU;
        this.NGAYKETTHUC = NGAYKETTHUC;
        this.DIEU_KIEN = DIEU_KIEN;
    }
}

class DANHGIA{
    constructor(MA_DG, MA_KS, MA_ND, SO_SAO, BINH_LUAN, NGAY_DG, MA_ND_NGUOIDUNG){
        this.MA_DG = MA_DG;
        this.MA_KS = MA_KS;
        this.MA_ND = MA_ND;
        this.SO_SAO = SO_SAO;
        this.BINH_LUAN = BINH_LUAN;
        this.NGAY_DG = NGAY_DG;
        this.MA_ND_NGUOIDUNG = MA_ND_NGUOIDUNG
    }
}

class TIENNGHI{
    constructor(MA_TIENNGHI, TENTIENNGHI, MA_KS, ICON){
        this.MA_TIENNGHI = MA_TIENNGHI;
        this.TENTIENNGHI = TENTIENNGHI;
        this.MA_KS = MA_KS;
        this.ICON = ICON;
    }
}

class KHUYENMAI{
    constructor(MA_KM, TEN_KM, PHANTRAM, NGAYBATDAU, NGAYKETTHUC, KHACHSAN_KHUYENMAIs){
        this.MA_KM = MA_KM;
        this.TEN_KM = TEN_KM;
        this.PHANTRAM = PHANTRAM;
        this.NGAYBATDAU = NGAYBATDAU;
        this.NGAYKETTHUC = NGAYKETTHUC;
        this.KHACHSAN_KHUYENMAIs = KHACHSAN_KHUYENMAIs;
    }
}

class PHONG{
    constructor(MA_PHONG, TENPHONG, MOTA, GIATIEN, HINHANH, MA_KS, MA_LOAIPHG, MA_KM, MA_LOAIPHG_LOAIPHONG, MA_KM_KHUYENMAI, GIADAGIAM){
        this.MA_PHONG = MA_PHONG;
        this.TENPHONG = TENPHONG;
        this.MOTA = MOTA;
        this.GIATIEN = GIATIEN;
        this.HINHANH = HINHANH;
        this.MA_KS = MA_KS;
        this.MA_LOAIPHG = MA_LOAIPHG;
        this.MA_KM = MA_KM;
        this.MA_LOAIPHG_LOAIPHONG = MA_LOAIPHG_LOAIPHONG;
        this.MA_KM_KHUYENMAI = MA_KM_KHUYENMAI;
        this.GIADAGIAM = GIADAGIAM;
    }
}

class TINNHAN{
    constructor(MA_TINNHAN, MA_KS, MA_ND, NOIDUNG, THOIGIAN, SENDMESSAGE, MA_ND_NGUOIDUNG){
        this.MA_TINNHAN = MA_TINNHAN;
        this.MA_KS = MA_KS;
        this.MA_ND = MA_ND;
        this.NOIDUNG = NOIDUNG;
        this.THOIGIAN = THOIGIAN;
        this.SENDMESSAGE = SENDMESSAGE;
        this.MA_ND_NGUOIDUNG = MA_ND_NGUOIDUNG;
    }
}

class LOAIPHONG{
    constructor( MA_LOAIPHG,TENLOAIPHG, SLKHACH, SLGIUONGDON, SLGIUONGDOI, SLPHONG, PHONG, TRANGTHAI, GIADAGIAM){
        this.MA_LOAIPHG = MA_LOAIPHG;
        this.TENLOAIPHG = TENLOAIPHG;
        this.SLKHACH = SLKHACH;
        this.SLGIUONGDON = SLGIUONGDON;
        this.SLGIUONGDOI = SLGIUONGDOI;
        this.SLPHONG = SLPHONG;
        this.PHONG = PHONG;
        this.TRANGTHAI = TRANGTHAI;
        this.GIADAGIAM = GIADAGIAM;
    }
}

class PHIEUDATPHG{
    constructor(MA_DP, NGAYDEN, NGAYDI, TRANGTHAI, NGAYDATPHG, THANHTIEN, MA_MGG, MA_ND, MA_PHONG, ORDERCODE, MA_PHONG_PHONG, DACOC, MA_ND_NGUOIDUNG, XACNHAN){
        this.MA_DP = MA_DP;
        this.NGAYDEN = NGAYDEN;
        this.NGAYDI = NGAYDI;
        this.TRANGTHAI = TRANGTHAI; 
        this.NGAYDATPHG = NGAYDATPHG; 
        this.THANHTIEN = THANHTIEN;
        this.MA_MGG = MA_MGG;
        this.MA_ND = MA_ND;
        this.MA_PHONG = MA_PHONG;
        this.ORDERCODE = ORDERCODE;
        this.MA_PHONG_PHONG = MA_PHONG_PHONG;
        this.DACOC = DACOC;
        this.MA_ND_NGUOIDUNG = MA_ND_NGUOIDUNG;
        this.XACNHAN = XACNHAN;
    }
}

class HOSO {
    constructor(MA_HS, HOTEN, EMAIL, SDT, TEN_KS, DIACHI, MO_TA, SOSAO, HINHANH, GIAYPHEPKINHDOANH, TRANGTHAI, NGAYDANGKY) {
        this.MA_HS = MA_HS;
        this.HOTEN = HOTEN;
        this.EMAIL = EMAIL;
        this.SDT = SDT;
        this.TEN_KS = TEN_KS;
        this.DIACHI = DIACHI;
        this.MO_TA = MO_TA;
        this.SOSAO = SOSAO;
        this.HINHANH = HINHANH;
        this.GIAYPHEPKINHDOANH = GIAYPHEPKINHDOANH;
        this.TRANGTHAI = TRANGTHAI;
        this.NGAYDANGKY = NGAYDANGKY;
    }
}