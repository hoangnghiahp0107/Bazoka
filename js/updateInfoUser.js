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
        phoneInput.value = user && user.SDT !== undefined ? user.SDT : '';
    }

    // Cập nhật giới tính
    const genderSelect = document.getElementById("gender");
    if (genderSelect) {
        const gender = user && user.GIOITINH !== undefined ? user.GIOITINH : '';
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
            booking.TRANGTHAI,
            booking.NGAYDATPHG,
            booking.THANHTIEN,
            booking.MA_MGG,
            booking.MA_ND,
            booking.MA_PHONG,
            booking.ORDERCODE,
            booking.MA_PHONG_PHONG,
            booking.DACOC,
            booking.MA_ND_NGUOIDUNG,
            booking.XACNHAN
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
        const isConfirmed = booking.XACNHAN;  // Kiểm tra xem booking có xác nhận hay không
        const isBookedOrCheckedIn = booking.TRANGTHAI === "Check-in" || booking.TRANGTHAI === "Check-out"; // Trạng thái "Đặt thành công" hoặc "Check-in"
        
        // Xử lý badge xác nhận
        const confirmationBadge = isConfirmed
            ? `<span class="badge bg-success">Đã xác nhận</span>`
            : `<span class="badge bg-warning">Chưa xác nhận</span>`;

        // Ẩn nút Hủy nếu đã hủy hoặc trạng thái là "Đặt thành công" hoặc "Check-in"
        const cancelButton = isCancelled || isBookedOrCheckedIn
            ? ''  // Không hiển thị nút hủy nếu trạng thái là "Đặt thành công", "Check-in" hoặc "Đã hủy"
            : `<button class="btn btn-danger mt-3" data-bs-toggle="modal" data-bs-target="#cancelModal" onclick="cancelBooking(${booking.MA_DP})">Hủy đặt phòng</button>`;

        return (
            result +
            `  
            <div class="row g-4">
                <div class="col-12">
                    <div class="card booking-card h-100" tabindex="0">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="/img/${duongDanHinh}" class="img-fluid rounded-start h-100" alt="Phòng Deluxe" loading="lazy">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <h5 class="card-title">${booking.MA_PHONG_PHONG.TENPHONG}</h5>
                                        ${confirmationBadge}  <!-- Thêm badge xác nhận -->
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <p class="mb-2"><strong>Giá phòng:</strong> ${giaTienVND} VND</p>
                                            <p class="mb-2"><strong>Ngày đặt:</strong> ${new Date(booking.NGAYDATPHG).toLocaleString('vi-VN', { 
                                                weekday: 'short', 
                                                year: 'numeric', 
                                                month: '2-digit', 
                                                day: '2-digit', 
                                                hour: '2-digit', 
                                                minute: '2-digit', 
                                                second: '2-digit',
                                                hour12: false 
                                            })}</p>
                                            <p class="mb-2"><strong>Ngày nhận phòng:</strong> ${booking.NGAYDEN}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p class="mb-2"><strong>Ngày trả phòng:</strong> ${booking.NGAYDI}</p>
                                            <p class="mb-2"><strong>Trạng thái:</strong> ${booking.TRANGTHAI}</p>
                                            ${cancelButton}  <!-- Hiển thị/ẩn nút hủy -->
                                            <button class="btn btn-primary mt-3" onclick="toggleChat(${booking.MA_PHONG_PHONG.MA_KS_KHACHSAN.MA_KS})">Liên hệ</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            `
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


