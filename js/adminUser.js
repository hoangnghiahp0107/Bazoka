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
        getUsers();
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

async function getUsers(){
    try {
        const users = await apiGetUsers();
        const userObj =  users.map((user) => new NGUOIDUNG(
            user.MA_ND,
            user.HOTEN,
            user.EMAIL,
            user.MATKHAU,
            user.SDT,
            user.NGAYSINH,
            user.GIOITINH,
            user.CHUCVU,
            user.NGAYDANGKY,
            user.ANHDAIDIEN
        ));
        renderUsers(userObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderUsers(users) {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);
    const html = currentUsers.reduce((result, user, index) => {
    const duongDanHinh = user.ANHDAIDIEN;
        return (
            result +
            `
                <tr>
                    <td>${user.MA_ND}</td>
                    <td>${user.HOTEN}</td>
                    <td>${user.EMAIL}</td>
                    <td>${user.SDT}</td>
                    <td>${user.NGAYSINH}</td>
                    <td>${user.GIOITINH}</td>
                    <td>${user.CHUCVU}</td>
                    <td>${user.NGAYDANGKY}</td>
                    <td class="d-flex justify-content-center"><img width="50" height="50" src="/img/${duongDanHinh}"><img/></td>
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectUser('${user.MA_ND}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteUser('${user.MA_ND}')">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
            );
    }, "");
    document.getElementById("user").innerHTML = html;
    renderPagination(totalPages);
}

async function deleteUser(userID) {
    const willDelete = await Swal.fire({
        title: "Bạn có muốn xóa người dùng này?",
        text: "Nhấn OK để xác nhận xóa người dùng.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willDelete.isConfirmed) {
        try {
            await apiDeleteUser(userID);
            Swal.fire('Xóa người dùng thành công', '', 'success').then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire('Không thể xóa người dùng', 'Người dùng này đang có đặt phòng!', 'error');
        }
    }
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
        getUsers();
    }
}
  
function nextPage() {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
        currentPage++;
        getUsers();
    }
}

function goToPage(page) {
    currentPage = page;
    getUsers(); 
}

async function getSearchUserByName(searchParam) {
    try {
        if (!searchParam) {
            getUsers(); 
            return;
        }

        const response = await apiSearchUser(searchParam);
        if (response && Array.isArray(response.data) && response.data.length > 0) {
            users = response.data.map((user) => new KHACHSAN(
                user.MA_KS,
                user.TEN_KS,
                user.MO_TA,
                user.HINHANH,
                user.MA_VITRI,
                user.MA_VITRI_VITRI
            ));
            renderUsersByName(users, searchParam);
        } else {
            console.log("Không có dữ liệu người dùng trả về từ API");
            document.getElementById("user").innerHTML = "<tr><td colspan='6'>No matching users found</td></tr>";
        }

    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}


function renderUsersByName(users, searchParam) {
    const totalPages = Math.ceil(users.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);
  
    const html = currentUsers.reduce((result, user, index) => {
      const duongDanHinh = user.ANHDAIDIEN;
      if (user.TEN_KS.toLowerCase().includes(searchParam.toLowerCase())) {
        return (
            result +
            `
                <tr>
                    <td>${user.MA_ND}</td>
                    <td>${user.HOTEN}</td>
                    <td>${user.EMAIL}</td>
                    <td>${user.SDT}</td>
                    <td>${user.NGAYSINH}</td>
                    <td>${user.GIOITINH}</td>
                    <td>${user.CHUCVU}</td>
                    <td>${user.NGAYDANGKY}</td>
                    <td class="d-flex justify-content-center"><img width="50" height="50" src="/img/${duongDanHinh}"><img/></td>
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-success mx-2" onclick="selectUser('${user.MA_ND}');">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteUser('${user.MA_ND}')">
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
  
    document.getElementById("user").innerHTML = html;
    renderPagination(totalPages);
}
  

function handleSearch(event) {
    event.preventDefault(); 
    const searchTerm = document.querySelector('.search-bar input[name="search"]').value;
    getSearchUserByName(searchTerm);
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


async function selectUser(userID) {
    try {
        const response = await apiGetUserID(userID);

        localStorage.setItem('selectedAccount', JSON.stringify(response));

        window.location.href = "adminUpdateUser.html";
        
    } catch (error) {
        console.log(error);
    }
}

async function createUser() {
    const HOTEN = document.getElementById("HOTEN").value;
    const SDT = document.getElementById("SDT").value;
    const EMAIL = document.getElementById("EMAIL").value;
    const NGAYSINH = document.getElementById("NGAYSINH").value;
    const GIOITINH = document.getElementById("GIOITINH").value;
    const MATKHAU = document.getElementById("MATKHAU").value;
  
    // Check if fields are empty
    if (!HOTEN || !SDT || !EMAIL || !MATKHAU || !NGAYSINH) {
        Swal.fire('Vui lòng điền đầy đủ thông tin', '', 'error');
        return;
    }
  
    try {
        // Send the sign-up request
        const response = await apiSignUp({
            HOTEN: HOTEN,
            SDT:SDT,
            EMAIL: EMAIL,
            MATKHAU: MATKHAU,
            NGAYSINH: NGAYSINH,
            GIOITINH: GIOITINH
        });
  
        if (response.status === 200) {
            Swal.fire('Đăng ký thành công', '', 'success').then(() => {
                location.reload();
            });
        } else if (response.status === 400) {
            Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
        } else {
            Swal.fire('Lỗi không xác định', '', 'error');
        }
    } catch (error) {
        Swal.fire('Lỗi kết nối hoặc tài khoản đã tồn tại', '', 'error');
        console.error(error);
    }
  }