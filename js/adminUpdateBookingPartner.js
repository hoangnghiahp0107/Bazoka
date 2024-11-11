document.addEventListener('DOMContentLoaded', async () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "/layouts/loginAdmin.html";
        return;
    }

    const bookingData = localStorage.getItem('selectedBooking');
    if (bookingData) {
        const booking = JSON.parse(bookingData);

        // Gọi hàm populateRoomOptions và set giá trị cho MA_PHONG sau khi phòng được tải
        await populateRoomOptions();

        // Set giá trị cho các trường thông tin
        document.getElementById('HOTEN').value = booking.MA_ND_NGUOIDUNG.HOTEN;
        document.getElementById('SDT').value = booking.MA_ND_NGUOIDUNG.SDT;
        document.getElementById('MA_PHONG').value = booking.MA_PHONG;
        document.getElementById('NGAYDEN').value = booking.NGAYDEN;
        document.getElementById('NGAYDI').value = booking.NGAYDI;
        document.getElementById('TRANGTHAI').value = booking.TRANGTHAI;
        document.getElementById('NGAYDATPHG').value = booking.NGAYDATPHG;
        document.getElementById('THANHTIEN').value = booking.THANHTIEN;
        document.getElementById('DACOC').value = booking.DACOC;
        document.getElementById('MA_MGG').value = booking.MA_MGG;
        document.getElementById('XACNHAN').value = booking.XACNHAN;
        const bookingID = Number(booking.MA_DP);

        document.getElementById("updateButton").addEventListener("click", function() {
            updateBookingPartner(bookingID);
        });
    } else {
        console.log('No hotel data found in localStorage');
    }
});

async function updateBookingPartner(bookingID) {
    const MA_PHONG = document.getElementById("MA_PHONG").value.trim();
    const NGAYDEN = document.getElementById("NGAYDEN").value.trim();
    const NGAYDI = document.getElementById("NGAYDI").value.trim();
    const TRANGTHAI = document.getElementById("TRANGTHAI").value.trim();
    const THANHTIEN = document.getElementById("THANHTIEN").value.trim();
    const DACOC = document.getElementById("DACOC").value.trim();
    const MA_MGG = document.getElementById("MA_MGG").value.trim();
    const XACNHAN = document.getElementById("XACNHAN").value.trim();

    const formData = {
        MA_PHONG,
        NGAYDEN,
        NGAYDI,
        TRANGTHAI,
        THANHTIEN,
        DACOC,
        MA_MGG,
        XACNHAN
    };

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật thông tin đặt phòng?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateBookingPartner(bookingID, formData);
            Swal.fire('Cập nhật thông tin đặt phòng thành công', '', 'success').then(() => {
                window.location.href = "adminBookingPartner.html"; 
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            const errorMessage = error.response?.data?.message || 'Vui lòng thử lại sau.';
            Swal.fire('Cập nhật thông tin đặt phòng thất bại', errorMessage, 'error');
        }
    }
}

function logout() {
    localStorage.removeItem('localStorageToken');
    window.location.href = "index.html";
}

document.getElementById("logoutButton").addEventListener("click", function() {
    logout();
});


async function populateRoomOptions() {
    try {
        // Gọi API để lấy dữ liệu các phòng
        const rooms = await apiGetRoomAllPartner();

        // Lấy phần tử select theo id
        const selectElement = document.getElementById("MA_PHONG");

        // Dọn dẹp các option cũ (nếu có)
        selectElement.innerHTML = "";
        
        // Tạo và thêm một option mặc định
        const defaultOption = document.createElement("option");
        defaultOption.text = "Chọn phòng";
        defaultOption.value = "";
        defaultOption.disabled = true;  // Disable option này
        defaultOption.selected = true;  // Đảm bảo option mặc định được chọn
        selectElement.appendChild(defaultOption);


        // Duyệt qua dữ liệu các phòng và tạo option cho mỗi phòng
        rooms.forEach(room => {
            const option = document.createElement("option");
            option.text = room.TENPHONG;   // Hiển thị tên phòng
            option.value = room.MA_PHONG;  // Giá trị là mã phòng
            selectElement.appendChild(option);  // Thêm option vào select
        });

        // Nếu booking có giá trị MA_PHONG, set lại giá trị cho select
        const bookingData = localStorage.getItem('selectedBooking');
        if (bookingData) {
            const booking = JSON.parse(bookingData);
            const selectedOption = selectElement.querySelector(`option[value="${booking.MA_PHONG}"]`);
            if (selectedOption) {
                selectedOption.selected = true;
            }
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
    }
}