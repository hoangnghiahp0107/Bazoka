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
        getBooking();
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

async function getBooking(){
    try {
        const response = await apiGetBookingAll();
        const bookings = response.data; 
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
        renderBookings(bookingObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderBookings(bookings) {
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookings = bookings.slice(startIndex, endIndex);
    const html = currentBookings.reduce((result, booking, index) => {
        const actionButtons = booking.XACNHAN === false ? `
        <button class="btn btn-outline-success mx-2" onclick="XacNhan('${booking.MA_DP}');">
            <i class="fa-regular fa-circle-check"></i>
        </button>
        <button class="btn btn-outline-danger" onclick="TuChoi('${booking.MA_DP}')">
            <i class="fa-regular fa-circle-xmark"></i>
        </button>
        ` : ''; 
        return (
            result +
            `
                <tr>
                    <td>${index + 1}</td>
                    <td>${booking.MA_ND_NGUOIDUNG.HOTEN}</td>       
                    <td>${booking.MA_ND_NGUOIDUNG.SDT}</td>
                    <td>${booking.MA_PHONG_PHONG.MA_KS_KHACHSAN.TEN_KS}</td>
                    <td>${booking.TRANGTHAI}</td>
                    <td>${booking.NGAYDEN}</td>
                    <td>${booking.NGAYDI}</td>
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
                <td>${booking.DACOC}</td>      
                    <td>
                        <div class="d-flex justify-content-center">
                            ${booking.XACNHAN === false 
                                ? '<span style="color: #64f317;">●</span>' 
                                : '<span style="color: red;">●</span>'}
                        </div>
                    </td>    
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            ${actionButtons}
                        </div>
                    </td>                
                </tr>
            `
            );
    }, "");
    document.getElementById("bookings").innerHTML = html;
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

// Hàm xác nhận hồ sơ (gọi API `apiAccessHoso`)
async function XacNhan(bookingID) {
    try {
        const respone = await apiAccessHuyPhong(bookingID);
        if (respone === "Bạn đã xác nhận hủy đặt phòng") {
            alert("Đặt phòng đã được xác nhận thành công!");
            // Sau khi xác nhận thành công, bạn có thể gọi lại `getDataHoSo()` để làm mới dữ liệu, nếu cần
            getBooking();
        } else {
            alert("Có lỗi xảy ra khi xác nhận Đặt phòng!");
        }
    } catch (error) {
        console.error("Lỗi khi xác nhận Đặt phòng:", error);
        alert("Có lỗi xảy ra khi xác nhận Đặt phòng!");
    }
}

// Hàm từ chối Đặt phòng (gọi API `apiDenyHoso`)
async function TuChoi(bookingID) {
    try {
        const respone = await apiDenyHuyPhong(bookingID);
        if (respone === "Bạn đã từ chối hủy đặt phòng") {
            alert("Đặt phòng đã bị từ chối!");
            // Sau khi từ chối thành công, bạn có thể gọi lại `getDataHoSo()` để làm mới dữ liệu, nếu cần
            getBooking();
        } else {
            alert("Có lỗi xảy ra khi từ chối Đặt phòng!");
        }
    } catch (error) {
        console.error("Lỗi khi từ chối Đặt phòng:", error);
        alert("Có lỗi xảy ra khi từ chối hồ sơ!");
    }
}
