document.addEventListener("DOMContentLoaded", function () {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "/layouts/loginAdmin.html";
        return; 
    }

    const base64Url = localStorageToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    const userID = decodedToken && decodedToken.data && decodedToken.data.MA_ND;
    const userRole = decodedToken && decodedToken.data && decodedToken.data.CHUCVU;

    if (userID) {
        getRoomIdPartner();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }

});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getRoomIdPartner(){
    try {
        const response = await apiGetRoomIdPartner();
        const roomObj =  response.map((room) => new PHONG(
            room.MA_PHONG,
            room.TENPHONG,
            room.MOTA,
            room.GIATIEN,
            room.HINHANH,
            room.MA_KS,
            room.MA_LOAIPHG,
            room.MA_KM,
            room.MA_LOAIPHG_LOAIPHONG,
            room.MA_KM_KHUYENMAI,
            room.GIADAGIAM
        ));
        RoomPartner(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getDataRoomDayPartner(NGAYDEN, NGAYDI){
    try {
        const response = await apiGetRoomDayPartner(NGAYDEN, NGAYDI);
        const roomObj = response.map((room) => new LOAIPHONG(
            room.MA_LOAIPHG,
            room.TENLOAIPHG,
            room.SLKHACH,
            room.SLGIUONGDON,
            room.SLGIUONGDOI,
            room.SLPHONG,
            room.PHONG,
            room.TRANGTHAI,
            room.GIADAGIAM
        )) 
        renderDataRoomPartner(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderDataRoomPartner(rooms) {
    const html = rooms.reduce((result, room, index) => {
        const duongDanHinh = room.PHONG.HINHANH;
        const giaDaGiam = room.GIADAGIAM !== null ? room.GIADAGIAM.toLocaleString() : room.PHONG.THANHTIEN.toLocaleString();
        
        return (
            result +
            ` 
            <tr>
                <td>${index + 1}</td>
                <td>${room.PHONG.TENPHONG}</td>
                <td>${room.PHONG.MOTA}</td>
                <td>${giaDaGiam}</td>
                <td><img src="/img/${duongDanHinh}" alt="" width="100"></td>
                <td>${room.PHONG.MA_KM_KHUYENMAI && room.PHONG.MA_KM_KHUYENMAI.TEN_KM ? room.PHONG.MA_KM_KHUYENMAI.TEN_KM : ''}</td>
                <td>${room.TENLOAIPHG}</td>
                <td>
                  <div class="d-flex justify-content-center align-items-center">
                      <button class="btn btn-outline-success mx-2" onclick="selectRoom('${room.PHONG.MA_PHONG}')">
                          <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button class="btn btn-outline-danger" onclick="deleteRoom('${room.PHONG.MA_PHONG}')">
                          <i class="fa-regular fa-circle-xmark"></i>
                      </button>
                  </div>
              </td>
            </tr>
        `
        );
    }, "");
    document.getElementById("rooms").innerHTML = html;
}



function RoomPartner(rooms) {
  const html = rooms.reduce((result, room, index) => {
      const duongDanHinh = room.HINHANH;
      return (
          result +
          ` 
          <tr>
              <td>${index + 1}</td>
              <td>${room.TENPHONG}</td>
              <td>${room.MOTA}</td>
              <td>${room.GIADAGIAM.toLocaleString()}</td>
              <td><img src="/img/${duongDanHinh}" alt="" width="100"></td>
              <td>${room.MA_KM_KHUYENMAI && room.MA_KM_KHUYENMAI.TEN_KM ? room.MA_KM_KHUYENMAI.TEN_KM : ''}</td>
              <td>${room.MA_LOAIPHG_LOAIPHONG.TENLOAIPHG}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-success mx-2" onclick="selectRoom('${room.MA_PHONG}')">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteRoom('${room.MA_PHONG}')">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
            </td>

          </tr>
      `
      );
  }, "");
  document.getElementById("rooms").innerHTML = html;
}

async function createRoom() {
    const TENPHONG = document.getElementById("TENPHONG").value;
    const MOTA = document.getElementById("MOTA").value;
    const GIATIEN = document.getElementById("GIATIEN").value;
    const HINHANH = document.getElementById("HINHANH").files[0];
    const MA_KM = document.getElementById("MA_KM").value;  // Optional field
    const MA_LOAIPHG = document.getElementById("MA_LOAIPHG").value;

    // Kiểm tra các trường bắt buộc
    if (!TENPHONG || !MOTA || !GIATIEN || !MA_LOAIPHG) {
        Swal.fire({
            title: 'Thiếu thông tin',
            text: 'Vui lòng nhập đầy đủ các trường bắt buộc.',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
        return;  // Dừng hàm nếu thiếu thông tin bắt buộc
    }

    try {
        const formData = new FormData();
        formData.append('TENPHONG', TENPHONG);
        formData.append('MOTA', MOTA);
        formData.append('GIATIEN', GIATIEN);
        formData.append('MA_LOAIPHG', MA_LOAIPHG);

        if (HINHANH) formData.append('HINHANH', HINHANH);
        if (MA_KM) formData.append('MA_KM', MA_KM);  // Chỉ thêm MA_KM nếu có giá trị

        const response = await apiCreateRoomPartner(formData);

        switch (response) {
            case "Người dùng không được xác thực":
                Swal.fire({
                    title: 'Xác thực thất bại',
                    text: 'Vui lòng đăng nhập để tạo phòng.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                });
                break;

            case "Không có quyền truy cập chức năng này":
                Swal.fire({
                    title: 'Quyền truy cập bị từ chối',
                    text: 'Bạn không có quyền để thực hiện hành động này.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                });
                break;

            case "Bạn đã tạo phòng thành công!":
                Swal.fire({
                    title: 'Tạo phòng thành công',
                    text: 'Phòng của bạn đã được tạo thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "../layout/adminManageRoom.html"; // Redirect after user confirms
                    }
                });
                break;

            default:
                Swal.fire({
                    title: 'Lỗi không xác định',
                    text: 'Vui lòng thử lại sau.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                });
                break;
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Đã có lỗi xảy ra',
            text: 'Không thể hoàn thành yêu cầu của bạn. Vui lòng thử lại sau.',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
    }
}

async function deleteRoom(roomID) {
    const willDelete = await Swal.fire({
        title: "Bạn có muốn xóa phòng này?",
        text: "Nhấn OK để xác nhận xóa phòng.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willDelete.isConfirmed) {
        try {
            await apiDeleteRoomPartner(roomID);
            Swal.fire('Xóa phòng thành công', '', 'success').then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire('Không thể xóa phòng', 'Phòng này đang có đặt phòng!', 'error');
        }
    }
}

async function selectRoom(roomID) {
    try {
        const response = await apiSelectRoom(roomID);

        localStorage.setItem('selectedRoom', JSON.stringify(response));

        window.location.href = "adminUpdateRoom.html";
        
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn việc gửi form mặc định
    
    const NGAYDI = document.getElementById('checkIn').value;
    const NGAYDEN = document.getElementById('checkOut').value;
    localStorage.setItem('checkIn', NGAYDI);
    localStorage.setItem('checkOut', NGAYDEN);
    // Gọi hàm tìm kiếm khách sạn
    await getDataRoomDayPartner(NGAYDEN, NGAYDI);

    // Tạo URL với các tham số
    const newUrl = `/layouts/adminManageRoom.html?checkIn=${encodeURIComponent(NGAYDI)}&checkOut=${encodeURIComponent(NGAYDEN)}`;
    
    // Thay đổi URL mà không reload trang
    window.history.pushState({}, '', newUrl);
});