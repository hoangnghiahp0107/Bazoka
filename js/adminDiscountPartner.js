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

    if (userID) {
        getDiscountPartner();
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

async function getDiscountPartner(){
    try {
        const response = await apiGetDiscountPartner();
        const discountObj =  response.map((discount) => new KHUYENMAI(
            discount.MA_KM,
            discount.TEN_KM,
            discount.PHANTRAM,
            discount.NGAYBATDAU,
            discount.NGAYKETTHUC,
            discount.KHACHSAN_KHUYENMAIs  
        ));
        renderDiscountPartner(discountObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
  }
  
  function renderDiscountPartner(discounts) {
  const html = discounts.reduce((result, discount, index) => {
      return (
          result +
          ` 
          <tr>
              <td>${index + 1}</td>
              <td>${discount.MA_KM}</td>
              <td>${discount.TEN_KM}</td>
              <td>${discount.PHANTRAM}</td>
              <td>${discount.NGAYBATDAU}</td>
              <td>${discount.NGAYKETTHUC}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-success mx-2" onclick="selectDiscount('${discount.MA_KM}');">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteDiscount('${discount.MA_KM}')">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
              </td>
          </tr>
      `
      );
  }, "");
  document.getElementById("discounts").innerHTML = html;
  }

  async function createDiscount() {
    // Lấy dữ liệu từ các trường nhập liệu
    const MA_KM = document.getElementById("MA_KM").value;
    const PHANTRAM = document.getElementById("PHANTRAM").value;
    const NGAYBATDAU = document.getElementById("NGAYBATDAU").value;
    const NGAYKETTHUC = document.getElementById("NGAYKETTHUC").value;
    const TEN_KM = document.getElementById("TEN_KM").value;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!MA_KM || !PHANTRAM || !NGAYBATDAU || !NGAYKETTHUC || !TEN_KM) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng điền đầy đủ thông tin.',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
        return;
    }

    // Kiểm tra PHANTRAM phải nhỏ hơn 100
    if (parseFloat(PHANTRAM) >= 100) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Phần trăm giảm giá phải nhỏ hơn 100.',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
        return;
    }

    // Tạo đối tượng dữ liệu để gửi
    const discountData = {
        MA_KM,
        PHANTRAM: parseFloat(PHANTRAM),
        NGAYBATDAU,
        NGAYKETTHUC,
        TEN_KM,
    };

    try {
        // Gọi API để tạo mã giảm giá
        const response = await apiCreateDiscountPartner(discountData);

        // Xử lý phản hồi từ server
        if (response === "Mã giảm giá đã tồn tại.") {
            Swal.fire({
                title: 'Lỗi',
                text: response,
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: true,
                allowEnterKey: true
            });
        } else if (response) {
            Swal.fire({
                title: 'Thông báo',
                text: response,
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: true,
                allowEnterKey: true
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: 'Lỗi không xác định',
                text: 'Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: true,
                allowEnterKey: true
            });
        }
    } catch (error) {
        console.error("Error creating discount:", error);
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

async function deleteDiscount(discountID) {
    const willDelete = await Swal.fire({
        title: "Bạn có muốn xóa khuyến mãi này?",
        text: "Nhấn OK để xác nhận xóa khuyến mãi.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willDelete.isConfirmed) {
        try {
            await apiDeleteDiscountPartner(discountID);
            Swal.fire('Xóa khuyến mãi thành công', '', 'success').then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire('Không thể xóa khuyến mãi', 'Khuyến mãi này đang được sử dụng!', 'error');
        }
    }
}

async function selectDiscount(discountID) {
    try {
        const response = await apiSelectDiscountPartner(discountID);

        localStorage.setItem('selectedKM', JSON.stringify(response));

        window.location.href = "adminUpdateDiscountPartner.html";
        
    } catch (error) {
        console.log(error);
    }
}