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
        getBookingRoomIdPartner();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                handleSearch(event);
            }
        });
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

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
            booking.MA_ND_NGUOIDUNG,
            booking.XACNHAN
  
        ));
        renderBookingPartner(bookingObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
  }
  
  function renderBookingPartner(bookings) {
  const html = bookings.reduce((result, booking, index) => {
      const CONLAI = booking.THANHTIEN - booking.DACOC;
      return (
          result +
          ` 
          <tr>
              <td>${index + 1}</td>
              <td>${booking.MA_ND_NGUOIDUNG.HOTEN}</td>
              <td>${booking.MA_ND_NGUOIDUNG.SDT}</td>
              <td>${booking.MA_PHONG_PHONG.TENPHONG}</td>
              <td>${booking.NGAYDEN}</td>
              <td>${booking.NGAYDI}</td>
              <td>${booking.TRANGTHAI}</td>
              <td>${booking.THANHTIEN.toLocaleString()}</td>     
              <td>${booking.DACOC.toLocaleString()}</td> 
              <td>${CONLAI.toLocaleString()}</td>        
                <td>${new Date(booking.NGAYDATPHG).toLocaleString('vi-VN', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: false 
                })}</td>
              <td>${booking.MA_MGG || ''}</td>
              <td>
                <div class="d-flex justify-content-center">
                    ${booking.XACNHAN 
                        ? '<span style="color: green;">●</span>' 
                        : '<span style="color: orange;">●</span>'}
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-success mx-2" onclick="selectBooking('${booking.MA_DP}');">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="cancelBooking('${booking.MA_DP}')">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
              </td>
          </tr>
      `
      );
  }, "");
  document.getElementById("bookings").innerHTML = html;
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

async function selectBooking(bookingID) {
    try {
        const response = await apiSelectBooking(bookingID);

        localStorage.setItem('selectedBooking', JSON.stringify(response));

        window.location.href = "adminUpdateBookingPartner.html";
        
    } catch (error) {
        console.log(error);
    }
}
