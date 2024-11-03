document.addEventListener('DOMContentLoaded', () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "/layouts/loginUser.html";
        return; 
    }

    const base64Url = localStorageToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));

    

    const userID = decodedToken && decodedToken.data && decodedToken.data.MA_ND;
    getUserIDChung(userID)
    document.getElementById("updateInfoButton").addEventListener("click", function() {
        updateUser(userID);
    });
    getBookingUser();
});

async function getUserIDChung(userID) {
    try {
        
        const user = await apiGetUserID(userID);
        renderInfoUserChung(user);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderInfoUserChung(user) {
    // Cập nhật tên người dùng
    const HOTEN = document.getElementById("hoTen");
    if (HOTEN) {
        HOTEN.value = user && user.HOTEN !== undefined ? user.HOTEN : ''; 
    }

    // Cập nhật email
    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.value = user && user.EMAIL !== undefined ? user.EMAIL : '';
    }

    // Cập nhật số điện thoại
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.value = user && user.PHONE !== undefined ? user.PHONE : '';
    }

    // Cập nhật giới tính
    const genderSelect = document.getElementById("gender");
    if (genderSelect) {
        const gender = user && user.GENDER !== undefined ? user.GENDER : '';
        if (gender === "Nam" || gender === "Nữ") {
            genderSelect.value = gender;
        } else {
            genderSelect.selectedIndex = 0; // Chọn tùy chọn mặc định
        }
    }

    // Cập nhật ngày, tháng, năm sinh
    const dob = user && user.NGAYSINH ? new Date(user.NGAYSINH) : new Date();
    const dayInput = document.getElementById("day");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");

    if (dayInput) {
        dayInput.value = dob.getDate() || '';
    }
    if (monthInput) {
        monthInput.value = String(dob.getMonth() + 1).padStart(2, '0') || '';
    }
    if (yearInput) {
        yearInput.value = dob.getFullYear() || '';
    }
    
    const avatarElement = document.getElementById("avarta1");
    if (avatarElement) {
        const ANHDAIDIEN = user && user.ANHDAIDIEN !== undefined ? user.ANHDAIDIEN : 'noimg.png';
        avatarElement.src = `/img/${ANHDAIDIEN}`; 
    } else {
        console.error("Avatar element not found.");
    }
}

async function updateUser(userID) {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const gender = document.getElementById("gender").value;
    const anhDaiDien = document.getElementById("anh_dai_dien").files[0];

    
    const dob = new Date(`${year}-${month}-${day}`);

    const formData = new FormData();
    formData.append('EMAIL', email);
    formData.append('SDT', phone);
    formData.append('HOTEN', hoTen);
    formData.append('NGAYSINH', dob.toISOString());
    formData.append('GIOITINH', gender);
    formData.append('ANHDAIDIEN', anhDaiDien || 'noimg.png');

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật tài khoản?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateUser(userID, formData);
            Swal.fire('Cập nhật tài khoản thành công', '', 'success').then(() => {
                window.location.href = "userInfo.html#account-general";
            });
        } catch (error) {
            Swal.fire('Cập nhật tài khoản thất bại', '', 'error');
        }
    }
}

async function getBookingUser(){
    try {
        const bookings = await apiGetBookingUser();
        const bookingObj =  bookings.map((booking) => new PHIEUDATPHG(
            booking.MA_DP,
            booking.NGAYDEN,
            booking.NGAYDI,
            booking.SLKHACH,
            booking.TRANGTHAI,
            booking.NGAYDATPHG,
            booking.THANHTIEN,
            booking.MA_MGG,
            booking.MA_ND,
            booking.MA_PHONG,
            booking.ORDERCODE,
            booking.MA_PHONG_PHONG
        ));
        renderBookingUser(bookingObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderBookingUser(bookings) {
    const html = bookings.reduce((result, booking) => {
        const duongDanHinh = booking.MA_PHONG_PHONG.HINHANH;
        const giaTienVND = Math.floor(booking.THANHTIEN).toLocaleString('vi-VN');

        const isCancelled = booking.TRANGTHAI === "Đã hủy";

        return (
            result +
            `<div class="mb-3">
                <div class="row">
                    <div class="col-md-4">
                        <img src="/img/${duongDanHinh}" alt="" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">${booking.MA_PHONG_PHONG.TENPHONG}</label>
                        <input type="text" class="form-control" value="Ngày nhận phòng: ${booking.NGAYDEN}" readonly>
                        <input type="text" class="form-control mt-2" value="Ngày trả phòng: ${booking.NGAYDI}" readonly>
                        <input type="text" class="form-control mt-2" value="Giá tiền: ${giaTienVND} VND" readonly>
                        <input type="text" class="form-control mt-2" value="Trạng thái: ${booking.TRANGTHAI}" readonly> 
                        <input type="text" class="form-control mt-2" value="Ngày đặt: ${booking.NGAYDATPHG}" readonly>
                        ${!isCancelled ? `<a href="#" class="btn btn-danger mt-2 me-2" onclick="cancelBooking('${booking.MA_DP}')">Hủy đặt phòng</a>` : ''}
                        <button class="btn btn-outline-success mt-2">Cập nhật trạng thái</button>

                    </div>
                </div>
            </div>
            <hr/>`
        );
    }, "");
    document.getElementById("bookingUser").innerHTML = html;
}



async function cancelBooking(bookingID) {
    const result = await Swal.fire({
        title: 'Xác nhận hủy đặt chỗ',
        text: "Bạn có chắc chắn muốn hủy đặt chỗ này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, hủy!',
        cancelButtonText: 'Không, quay lại!'
    });

    if (result.isConfirmed) {
        try {
            await apiCancelBooking(bookingID);
            Swal.fire({
                title: 'Đã hủy!',
                text: 'Đặt chỗ của bạn đã được hủy thành công.',
                icon: 'success'
            }).then(() => {
                location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi hủy đặt chỗ.',
                icon: 'error'
            });
        }
    }
}


