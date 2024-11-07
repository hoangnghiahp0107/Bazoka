document.addEventListener("DOMContentLoaded", function () {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
   window.location.href = "/layouts/apiLoginPartner.html";
        return; 
    }

    const base64Url = localStorageToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    getRoomIdPartner();
    getBookingRoomIdPartner();
    getReviewHotelPartner();
});
        // Hàm định dạng giá tiền có dấu phân cách hàng nghìn
        function formatCurrency(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        // Bắt sự kiện chỉnh sửa phòng
        document.getElementById("editRoomForm").addEventListener("submit", async function (e) {
          e.preventDefault();
      debugger
          const roomId = document.getElementById("editRoomId").value;
          const roomName = document.getElementById("editRoomName").value;
          const roomDescription = document.getElementById("editRoomDescription").value;
          const roomImage = document.getElementById("editRoomImage").files[0];
          const roomType = document.getElementById("editRoomType").value;
          const roomPrice = document.getElementById("editRoomPrice").value;
          const promoID = document.getElementById("editPromoteID").value;
      
          const formData = new FormData();
          formData.append('TENPHONG', roomName);
          formData.append('MOTA', roomDescription);
          formData.append('MA_LOAIPHG', roomType);
          formData.append('GIATIEN', roomPrice);
          formData.append('MA_KM', promoID);
          if (roomImage) formData.append('HINHANH', roomImage);
      
          try {
              const response = await apiUpdateRoomPartner(roomId, formData);
              if (response === "Chỉnh sửa phòng thành công!") {
                  // Cập nhật bảng
                  const roomTable = document.getElementById("rooms");
                  const row = roomTable.rows[roomId - 1];
                  row.cells[1].innerText = roomName;
                  row.cells[2].innerText = roomDescription;
                  row.cells[3].innerHTML = `<img src="${roomImage ? URL.createObjectURL(roomImage) : ''}" alt="${roomName}" width="100" />`;
                  row.cells[4].innerText = roomType;
                  row.cells[5].innerText = `${roomPrice} VND`;
                  row.cells[6].innerText = promoID;
      
                  Swal.fire({
                      title: 'Chỉnh sửa phòng thành công',
                      text: 'Thông tin phòng đã được cập nhật thành công.',
                      icon: 'success',
                      confirmButtonText: 'OK'
                  });
      
                  const editRoomModal = bootstrap.Modal.getInstance(document.getElementById('editRoomModal'));
                  editRoomModal.hide();
              } else {
                  Swal.fire({
                      title: 'Lỗi',
                      text: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          } catch (error) {
              console.error(error);
              Swal.fire({
                  title: 'Đã có lỗi xảy ra',
                  text: 'Không thể hoàn thành yêu cầu của bạn. Vui lòng thử lại sau.',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
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
            room.MA_KM_KHUYENMAI
        ));
      console.log(roomObj)
        RoomPartner(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
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
              <td><img src="/img/${duongDanHinh}" alt="" width="100"></td>
              <td>${room.MA_LOAIPHG_LOAIPHONG.TENLOAIPHG}</td>
              <td>${room.GIATIEN.toLocaleString()}</td>
              <td>${room.MA_KM_KHUYENMAI && room.MA_KM_KHUYENMAI.TEN_KM ? room.MA_KM_KHUYENMAI.TEN_KM : ''}</td>
              <td>
                  <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editRoomModal" 
                          onclick="setEditRoom(1, 'Phòng Deluxe', 'Phòng sang trọng với đầy đủ tiện nghi', '../img/102.jpg', 'Đôi', 1200000, 'Trống', 'Giảm giá mùa xuân')">Chỉnh sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteRoomPartner(${room.MA_PHONG})">Xóa</button>
              </td>
          </tr>
      `
      );
  }, "");
  document.getElementById("rooms").innerHTML = html;
}


async function createRoomPartner() {
  debugger
  const TENPHONG = document.getElementById("roomName").value;
  const MOTA = document.getElementById("roomDescription").value;
  const GIATIEN = document.getElementById("roomPrice").value;
  const HINHANH = document.getElementById("roomImage").files[0];
  const MA_KM = document.getElementById("promoID").value;
  const MA_LOAIPHG = document.getElementById("roomType").value;
  try {
    

      const formData = new FormData();
      formData.append('TENPHONG', TENPHONG);
      formData.append('MOTA', MOTA);
      formData.append('GIATIEN', GIATIEN);
      formData.append('MA_KM', MA_KM);
      formData.append('MA_LOAIPHG', MA_LOAIPHG);
      if (HINHANH) formData.append('HINHANH', HINHANH);

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
                  text: 'phòng của bạn đã được tạo thành công.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  allowOutsideClick: false,
                  allowEscapeKey: true,
                  allowEnterKey: true
              }).then((result) => {
                  if (result.isConfirmed) {
                      window.location.href = "../layout/doitac_quanlyphong"; // Redirect after user confirms
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

async function updateRoomPartner(roomId) {
  const TENPHONG = document.getElementById("roomName").value;
  const MOTA = document.getElementById("roomDescription").value;
  const GIATIEN = document.getElementById("roomPrice").value;
  const HINHANH = document.getElementById("roomImage").files[0];
  const MA_KM = document.getElementById("promoID").value;
  const MA_LOAIPHG = document.getElementById("roomType").value;

  try {
      const formData = new FormData();
      formData.append('TENPHONG', TENPHONG);
      formData.append('MOTA', MOTA);
      formData.append('GIATIEN', GIATIEN);
      formData.append('MA_KM', MA_KM);
      formData.append('MA_LOAIPHG', MA_LOAIPHG);
      if (HINHANH) formData.append('HINHANH', HINHANH);
      formData.append('ROOM_ID', roomId); // Giả định bạn cần ID phòng để cập nhật

      const response = await apiUpdateRoomPartner(formData); // Gọi API cập nhật

      switch (response) {
          case "Người dùng không được xác thực":
              Swal.fire({
                  title: 'Xác thực thất bại',
                  text: 'Vui lòng đăng nhập để cập nhật phòng.',
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

          case "Cập nhật phòng thành công!":
              Swal.fire({
                  title: 'Cập nhật thành công',
                  text: 'Thông tin phòng đã được cập nhật.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  allowOutsideClick: false,
                  allowEscapeKey: true,
                  allowEnterKey: true
              }).then((result) => {
                  if (result.isConfirmed) {
                      window.location.href = "../layout/doitac_quanlyphong"; // Redirect after user confirms
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
async function deleteRoomPartner(roomID) {
    const willDeactivate = await Swal.fire({
      title: "Bạn có muốn ngừng hoạt động khách sạn?",
      text: "Nhấn OK để xác nhận ngừng hoạt động khách sạn.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    });
  
    if (willDeactivate.isConfirmed) {
      try {
        await apiDeleteRoomPartner(roomID);
        Swal.fire('Xóa phòng thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Phòng không thể xóa', '', 'error');
      }
    }
}

//booking partner quan ly don dat phong cua partner
async function getBookingRoomIdPartner(){
  try {
      const response = await apiGetBookingRoomIdPartner();
      const bookingObj =  response.map((booking) => new PHIEUDATPHG(
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
          booking.MA_ND_NGUOIDUNG

      ));
    console.log(bookingObj)
      renderBookingPartner(bookingObj);
  } catch (error) {
      console.log("Lỗi từ máy chủ", error);
  }
}

function renderBookingPartner(bookings) {
const html = bookings.reduce((result, booking, index) => {
    return (
        result +
        ` 
        <tr>
            <td>${index + 1}</td>
            <td>${booking.NGAYDEN}</td>
            <td>${booking.NGAYDI}</td>
            <td>${booking.TRANGTHAI}</td>
            <td>${booking.NGAYDATPHG}</td>
            <td>${booking.THANHTIEN.toLocaleString()} VNĐ</td>
            <td>${booking.MA_MGG || 'Không có'}</td>
            <td>${booking.MA_ND_NGUOIDUNG.HOTEN}</td>
            <td>${booking.MA_PHONG_PHONG.TENPHONG}</td>
            <td>${booking.ORDERCODE}</td>
            <td>${booking.DACOC.toLocaleString()}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editBookingModal" 
                    onclick="editBooking(${booking.MA_DP}, '${booking.NGAYDEN}', '${booking.NGAYDI}', '${booking.TRANGTHAI}', '${booking.NGAYDATPHG}', ${booking.THANHTIEN}, '${booking.MA_MGG}', '${booking.MA_ND}', '${booking.MA_PHONG}', '${booking.ORDERCODE}', ${booking.DACOC})">Chỉnh sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBookingRoomPartner(${booking.MA_DP})">Xóa</button>
            </td>
        </tr>
    `
    );
}, "");
document.getElementById("bookingTableBody").innerHTML = html;
}

async function createBookingRoomPartner() {
  debugger
  const NGAYDEN = document.getElementById("checkInDate").value;
  const NGAYDI = document.getElementById("checkOutDate").value;
  const THANHTIEN = document.getElementById("totalAmount").value;
  const MA_MGG = document.getElementById("discountCode").value;
  const MA_ND = document.getElementById("userId").value;
  const MA_PHONG = document.getElementById("roomCode").value;
  const ORDERCODE = document.getElementById("orderCode").value;
  const DACOC = document.getElementById("deposit").value;
  try {

      const formData = new FormData();
      formData.append('NGAYDEN', NGAYDEN);
      formData.append('NGAYDI', NGAYDI);
      formData.append('THANHTIEN', THANHTIEN);
      formData.append('MA_MGG', MA_MGG);
      formData.append('MA_ND', MA_ND);
      formData.append('MA_PHONG', MA_PHONG);
      formData.append('ORDERCODE', ORDERCODE);
      formData.append('DACOC', DACOC);

      const response = await apiCreateBookingRoomPartner(formData);

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
                  text: 'phòng của bạn đã được tạo thành công.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  allowOutsideClick: false,
                  allowEscapeKey: true,
                  allowEnterKey: true
              }).then((result) => {
                  if (result.isConfirmed) {
                      window.location.href = "../layout/doitac_quanlyphong"; // Redirect after user confirms
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

async function deleteBookingRoomPartner(bookingId) {
    const willDeactivate = await Swal.fire({
      title: "Bạn có muốn xóa đơn đặt phòng này?",
      text: "Nhấn OK để xác nhận xóa đơn đặt phòng.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    });
  
    if (willDeactivate.isConfirmed) {
      try {
        await apiDeleteBookingRoomPartner(bookingId);
        Swal.fire('Xóa đơn đặt phòng thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Đơn đặt phòng không thể xóa', '', 'error');
      }
    }
}


//đánh giá khách sạn theo phòng của partner
async function getReviewHotelPartner(){
  try {
      const response = await apiGetReviewHotelPartner();
      const reviewObj =  response.map((review) => new DANHGIA(
          review.MA_DG,
          review.MA_KS,
          review.MA_ND,
          review.SO_SAO,
          review.BINH_LUAN,
          review.NGAY_DG
      ));
    console.log(reviewObj)
      renderReviewPartner(reviewObj);
  } catch (error) {
      console.log("Lỗi từ máy chủ", error);
  }
}


function renderReviewPartner(reviews) {
const html = reviews.reduce((result, review, index) => {
    return (
        result +
        ` 
        <tr>
            <td>${index + 1}</td>
            <td>${review.MA_ND}</td>
            <td>${review.BINH_LUAN}</td>
            <td>${review.NGAY_DG}</td>
            <td>${review.SO_SAO}</td>
        </tr>
    `
    );
}, "");
document.getElementById("reviewTablebody").innerHTML = html;
}