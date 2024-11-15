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

    if (userRole !== "Admin") {
        window.location.href = "/layouts/index.html";
        return;
    }

    if (userID) {
        getHotel();
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

async function getHotel(){
    try {
        const response = await apiGetHotel();
        const hotels = response.data; 
        const hotelObj =  hotels.map((hotel) => new KHACHSAN(
            hotel.MA_KS,
            hotel.TEN_KS,
            hotel.MO_TA,
            hotel.HINHANH,
            hotel.SOSAO,
            hotel.TRANGTHAI_KS,
            hotel.QRTHANHTOAN,
            hotel.MA_VITRI,
            hotel.YEU_CAU_COC,
            hotel.TI_LE_COC,
            hotel.MA_VITRI_VITRI,
            hotel.MA_TINHTHANH_TINHTHANH,
            hotel.MA_QUOCGIA_QUOCGIum,
            hotel.PHONGs
        ));
        renderHotels(hotelObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderHotels(hotels) {
    const totalPages = Math.ceil(hotels.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHotels = hotels.slice(startIndex, endIndex);
    const html = currentHotels.reduce((result, hotel, index) => {
        const duongDanHinh = hotel.HINHANH;
        const hinhQR = hotel.QRTHANHTOAN;
        return (
            result +
            `
                <tr>
                    <td>${(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>${hotel.TEN_KS}</td>
                    <td>${hotel.MO_TA}</td>
                    <td class="d-flex justify-content-center"><img width="50" height="50" src="/img/${duongDanHinh}"><img/></td>
                    <td>${hotel.MA_VITRI_VITRI.TENVITRI}, ${hotel.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.TEN_TINHTHANH}, ${hotel.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.MA_QUOCGIA_QUOCGIum.TEN_QUOCGIA}</td>
                    <td>
                        <div class="d-flex justify-content-center">
                            ${hotel.TRANGTHAI_KS === "Hoạt động" 
                                ? '<span style="color: #64f317;">●</span>' 
                                : '<span style="color: red;">●</span>'}
                        </div>
                    </td>
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectHotel('${hotel.MA_KS}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteHotel('${hotel.MA_KS}')">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
            );
    }, "");
    document.getElementById("hotel").innerHTML = html;
    renderPagination(totalPages);
}

let currentPage = 1;
const itemsPerPage = 10; 

function renderPagination(totalPages) {
    let paginationHtml = '';
  
    paginationHtml += `<button class="btn btn-outline-dark mx-1" onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
  
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="btn btn-outline-dark mx-1 ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    paginationHtml += `<button class="btn btn-outline-dark  mx-1" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
  
    document.getElementById("pagination").innerHTML = paginationHtml;
}
  
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getHotel();
    }
}
  
function nextPage() {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
        currentPage++;
        getHotel();
    }
}

function goToPage(page) {
    currentPage = page;
    getHotel(); 
}

async function getSearchHotelByName(searchParam) {
    try {
        if (!searchParam) {
            getHotel(); 
            return;
        }

        const response = await apiSearchHotel(searchParam);
        if (response && Array.isArray(response.data) && response.data.length > 0) {
            hotels = response.data.map((hotel) => new KHACHSAN(
                hotel.MA_KS,
                hotel.TEN_KS,
                hotel.MO_TA,
                hotel.HINHANH,
                hotel.SOSAO,
                hotel.TRANGTHAI_KS,
                hotel.QRTHANHTOAN,
                hotel.MA_VITRI,
                hotel.YEU_CAU_COC,
                hotel.TI_LE_COC,
                hotel.MA_VITRI_VITRI,
                hotel.MA_TINHTHANH_TINHTHANH,
                hotel.MA_QUOCGIA_QUOCGIum,
                hotel.PHONGs
            ));
            renderHotelsByName(hotels, searchParam);
        } else {
            console.log("Không có dữ liệu người dùng trả về từ API");
            document.getElementById("hotel").innerHTML = "<tr><td colspan='6'>No matching hotels found</td></tr>";
        }

    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}



function renderHotelsByName(hotels, searchParam) {
    const totalPages = Math.ceil(hotels.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHotels = hotels.slice(startIndex, endIndex);
  
    const html = currentHotels.reduce((result, hotel, index) => {
      const duongDanHinh = hotel.HINHANH;
      const HINHQR = hotel.QRTHANHTOAN;
      if (hotel.TEN_KS.toLowerCase().includes(searchParam.toLowerCase())) {
        return (
            result +
            `
           <tr>
                    <td>${hotel.MA_KS}</td>
                    <td>${hotel.TEN_KS}</td>
                    <td>${hotel.MO_TA}</td>
                    <td class="d-flex justify-content-center"><img width="50" height="50" src="/img/${duongDanHinh}"><img/></td>
                    <td>${hotel.MA_VITRI_VITRI.TENVITRI}</td>
                    <td class="d-flex justify-content-center"><img width="50" height="50" src="/img/${HINHQR}"><img/></td>                                       
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectHotel('${hotel.MA_KS}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteHotel('${hotel.MA_KS}')">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </button>
                        </div>
                    </td>
                </tr>
          `
        );
      }
      return result;
    }, "");
  
    document.getElementById("hotel").innerHTML = html;
    renderPagination(totalPages);
}
  

function handleSearch(event) {
    event.preventDefault(); 
    const searchTerm = document.querySelector('.search-bar input[name="search"]').value;
    getSearchHotelByName(searchTerm);
  }

document.querySelector('.search-bar form').addEventListener('submit', handleSearch);

function showSpinner() {
    getElement("#loading-spinner").classList.remove("hidden");
}

function hideSpinner() {
    getElement("#loading-spinner").classList.add("hidden");
}

function logout() {
    showSpinner();
    localStorage.removeItem('localStorageToken');
    setTimeout(function() {
        hideSpinner(); 
        window.location.href = "index.html";
    }, 500);
}

document.getElementById("logoutButton").addEventListener("click", function() {
    logout();
});

async function deleteHotel(hotelID) {
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
        await apiDeleteHotel(hotelID);
        Swal.fire('Ngưng hoạt động khách sạn thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Ngưng hoạt động khách sạn thất bại', '', 'error');
      }
    }
}

async function createHotel() {
    const TEN_KS = document.getElementById("TEN_KS").value;
    const MO_TA = document.getElementById("MO_TA").value;
    const SOSAO = document.getElementById("SOSAO").value;
    const MA_VITRI = document.getElementById("MA_VITRI").value;
    const YEU_CAU_COC = document.getElementById("YEU_CAU_COC").value;
    const TI_LE_COC = document.getElementById("TI_LE_COC").value;
    const HINHANH = document.getElementById("HINHANH").files[0];
    const QRTHANHTOAN = document.getElementById("QRTHANHTOAN").files[0];

    try {
        const formData = new FormData();
        formData.append('TEN_KS', TEN_KS);
        formData.append('MO_TA', MO_TA);
        formData.append('SOSAO', SOSAO);
        formData.append('MA_VITRI', MA_VITRI);
        formData.append('YEU_CAU_COC', YEU_CAU_COC);
        formData.append('TI_LE_COC', TI_LE_COC);
        if (HINHANH) formData.append('HINHANH', HINHANH);
        if (QRTHANHTOAN) formData.append('QRTHANHTOAN', QRTHANHTOAN);

        const response = await apiCreateHotel(formData);

        switch (response) {
            case "Người dùng không được xác thực":
                Swal.fire({
                    title: 'Xác thực thất bại',
                    text: 'Vui lòng đăng nhập để tạo khách sạn.',
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

            case "Bạn đã tạo khách sạn thành công!":
                Swal.fire({
                    title: 'Tạo khách sạn thành công',
                    text: 'Khách sạn của bạn đã được tạo thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "../layout/fb_adminQLND.html"; // Redirect after user confirms
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

async function selectHotel(hotelID) {
    try {
        const response = await apiSelectHotel(hotelID);

        localStorage.setItem('selectedHotel', JSON.stringify(response));

        window.location.href = "adminUpdateHotel.html";
        
    } catch (error) {
        console.log(error);
    }
}

