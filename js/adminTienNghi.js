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
    if (!userRole || !userRole.startsWith("Partner")) {
        // Nếu userRole không phải là Partner thì chuyển hướng đến trang index
        window.location.href = "/layouts/index.html";
        return;
    }

    if (userID) {
        getTienNghi();
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

async function getTienNghi(){
    try {
        const response = await apiGetTienNghi();
        const tienNghiObj =  response.map((tiennghi) => new TIENNGHI(
            tiennghi.MA_TIENNGHI,
            tiennghi.TENTIENNGHI,
            tiennghi.MA_KS,
            tiennghi.ICON
        ));
        renderTienNghi(tienNghiObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
  }
  
  function renderTienNghi(tiennghis) {
  const html = tiennghis.reduce((result, tiennghi, index) => {
      return (
          result +
          ` 
          <tr>
              <td>${index + 1}</td>
              <td>${tiennghi.TENTIENNGHI}</td>
              <td>${tiennghi.ICON}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-outline-success mx-2" onclick="selectTienNghi('${tiennghi.MA_TIENNGHI}');">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteTienNghi('${tiennghi.MA_TIENNGHI}')">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
              </td>
          </tr>
      `
      );
  }, "");
  document.getElementById("tiennghis").innerHTML = html;
  }

  async function createTienNghi() {
    // Lấy dữ liệu từ các trường nhập liệu
    const TENTIENNGHI = document.getElementById("TENTIENNGHI").value;
    const ICON = document.getElementById("ICON").value;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!TENTIENNGHI || !ICON) {
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

    // Tạo đối tượng dữ liệu để gửi
    const tienNghiObj = {
        TENTIENNGHI,
        ICON
    };

    try {
        // Gọi API tạo tiện nghi
        const response = await apiCreateTienNghi(tienNghiObj);

        // Kiểm tra kết quả trả về từ API
        if (response === "Bạn đã tạo tiện nghi thành công!") {
            Swal.fire({
                title: 'Thành công',
                text: 'Tiện nghi đã được tạo thành công.',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: true,
                allowEnterKey: true
            }).then(() => {
                // Reload trang sau khi tạo thành công
                location.reload();
            });
        } else {
            Swal.fire({
                title: 'Lỗi',
                text: response.message || 'Có lỗi xảy ra, vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: true,
                allowEnterKey: true
            });
        }
    } catch (error) {
        console.error("Error creating tien nghi:", error);
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


async function deleteTienNghi(tiennghiID) {
    const willDelete = await Swal.fire({
        title: "Bạn có muốn xóa tiện nghi này?",
        text: "Nhấn OK để xác nhận xóa tiện nghi.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willDelete.isConfirmed) {
        try {
            await apiDeleteTienNghi(tiennghiID);
            Swal.fire('Xóa tiện nghi thành công', '', 'success').then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire('Không thể xóa tiện nghi', 'Tiện nghi này đang được sử dụng!', 'error');
        }
    }
}

async function selectTienNghi(tiennghiID) {
    try {
        const response = await apiSelectTienNghi(tiennghiID);

        localStorage.setItem('selectedTienNghi', JSON.stringify(response));

        window.location.href = "adminUpdateTienNghi.html";
        
    } catch (error) {
        console.log(error);
    }
}