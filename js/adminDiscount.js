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
        getDiscount();
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

async function getDiscount(){
    try {
        const response = await apiGetDiscount();
        const discounts = response.data; 
        const discountObj =  discounts.map((discount) => new MAGIAMGIA(
            discount.MA_MGG,
            discount.MA_GIAMGIA,
            discount.PHANTRAM,
            discount.NGAYBATDAU,
            discount.NGAYKETTHUC,
            discount.DIEU_KIEN
        ));
        renderDiscounts(discountObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderDiscounts(discounts) {
    const totalPages = Math.ceil(discounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDiscounts = discounts.slice(startIndex, endIndex);
    const html = currentDiscounts.reduce((result, discount, index) => {
        return (
            result +
            `
                <tr>
                    <td>${index + 1}</td>
                    <td>${discount.MA_MGG}</td>
                    <td>${discount.PHANTRAM}</td>
                    <td>${discount.NGAYBATDAU}</td>
                    <td>${discount.NGAYKETTHUC}</td>       
                    <td>${discount.DIEU_KIEN}</td>       
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectDiscount('${discount.MA_MGG}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteDiscount('${discount.MA_MGG}')">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
            );
    }, "");
    document.getElementById("discount").innerHTML = html;
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
        getDiscount();
    }
}
  
function nextPage() {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
        currentPage++;
        getDiscount();
    }
}

function goToPage(page) {
    currentPage = page;
    getDiscount(); 
}

async function getSearchDiscountByName(searchParam) {
    try {
        if (!searchParam) {
            getDiscount(); 
            return;
        }

        const response = await apiSearchDiscount(searchParam);
        if (response && Array.isArray(response.data) && response.data.length > 0) {
            discounts = response.data.map((discount) => new MAGIAMGIA(
                discount.MA_MGG,
                discount.MA_GIAMGIA,
                discount.PHANTRAM,
                discount.NGAYBATDAU,
                discount.NGAYKETTHUC,
                discount.DIEU_KIEN
            ));
            renderDiscountByName(discounts, searchParam);
        } else {
            console.log("Không có dữ liệu người dùng trả về từ API");
            document.getElementById("discount").innerHTML = "<tr><td colspan='6'>No matching discounts found</td></tr>";
        }

    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}


function renderDiscountByName(discounts, searchParam) {
    const totalPages = Math.ceil(discounts.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDiscounts = discounts.slice(startIndex, endIndex);
  
    const html = currentDiscounts.reduce((result, discount, index) => {
      if (discount.TEN_KS.toLowerCase().includes(searchParam.toLowerCase())) {
        return (
            result +
            `
                <tr>
                    <td>${index + 1}</td>
                    <td>${discount.MA_MGG}</td>
                    <td>${discount.PHANTRAM}</td>
                    <td>${discount.NGAYBATDAU}</td>
                    <td>${discount.NGAYKETTHUC}</td>       
                    <td>${discount.DIEU_KIEN}</td>       
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectDiscount('${discount.MA_MGG}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteDiscount('${discount.MA_MGG}')">
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
  
    document.getElementById("discount").innerHTML = html;
    renderPagination(totalPages);
}
  

function handleSearch(event) {
    event.preventDefault(); 
    const searchTerm = document.querySelector('.search-bar input[name="search"]').value;
    getSearchDiscountByName(searchTerm);
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

async function deleteDiscount(discountID) {
    const willDelete = await Swal.fire({
      title: "Bạn có muốn xóa tài khoản?",
      text: "Nhấn OK để xác nhận xóa tài khoản.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    });
  
    if (willDelete.isConfirmed) {
      try {
        await apiDeleteDiscount(discountID);
        Swal.fire('Xóa mã giảm giá thành công', '', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Xóa mã giảm giá thất bại', '', 'error');
      }
    }
  }
