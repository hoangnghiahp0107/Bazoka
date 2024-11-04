document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    if (roomID) {
        getRoomID(roomID);
        getRateID(roomID);
        getConvenient(roomID);
    }
    if( roomID && checkIn && checkOut){
        getDataRoomDay(roomID, checkOut, checkIn)
    }
    localStorage.setItem('MA_KS', roomID);

});


function getElement(selector) {
    return document.querySelector(selector);
}

async function getRoomID(roomID){
    try {
        const response = await apiGetRoomID(roomID);
        const rooms = response.data;
        const roomObj = rooms.map((room) => new KHACHSAN(
            room.MA_KS,
            room.TEN_KS,
            room.MO_TA,
            room.HINHANH,
            room.SOSAO,
            room.TRANGTHAI_KS,
            room.QRTHANHTOAN,
            room.MA_VITRI,
            room.YEU_CAU_COC,
            room.TI_LE_COC,
            room.MA_VITRI_VITRI,
            room.MA_TINHTHANH_TINHTHANH,
            room.MA_QUOCGIA_QUOCGIum,
            room.PHONGs
        ))
        renderRoomID(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getRateID(roomID){
    try {
        const response = await apiGetRateID(roomID);
        const rates = response.data;
        const rateObj = rates.map((rate) => new DANHGIA(
            rate.MA_DG,
            rate.MA_KS, 
            rate.MA_ND,
            rate.SO_SAO,
            rate.BINH_LUAN,
            rate.NGAY_DG,
            rate.MA_ND_NGUOIDUNG
        ))
        renderRateID(rateObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getConvenient(roomID){
    try {
        const response = await apiGetConvenientID(roomID);
        const convenients = response.data;
        const convenientObj = convenients.map((convenient) => new KHACHSAN_TIENNGHI(
            convenient.MA_TIENNGHI,
            convenient.MA_KS
        ))
        renderConvenient(convenientObj)
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getDataRoomDay(roomID, NGAYDEN, NGAYDI){
    try {
        const response = await apiGetDataRoomDay(roomID, NGAYDEN, NGAYDI);
        const rooms = response.data;
        const roomObj = rooms.map((room) => new LOAIPHONG(
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
        renderDataRoom(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderRoomID(rooms){
    const html = rooms.reduce((result, room) =>{
        const duongDanHinh = room.HINHANH;
        return (
            result +
            `
                <div class="container p-0">
                    <h2 class="mt-3"><b id="name-hotel">${room.TEN_KS}</b></h2>
                    <p><i class="fas fa-location-dot me-2" style="color: #00b383;"></i>${room.MA_VITRI_VITRI.TENVITRI}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.TEN_TINHTHANH}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.MA_QUOCGIA_QUOCGIum.TEN_QUOCGIA}</p>
                    <img src="/img/${duongDanHinh}" alt="..." class="img-fluid w-100 img-card">
                    <div class="container mt-5">
                        <div class="row">
                            <div class="col-lg-8">
                                <section class="hotel-info mb-5">
                                    <h2 class="mb-4">Giới thiệu về chúng tôi</h2>
                                    <p>${room.MO_TA}</p>
                                    <ul class="list-group list-group-flush" id="convenients">
                                        <li class="list-group-item"><i class="fas fa-wifi me-2"></i> Wifi miễn phí</li>
                                        <li class="list-group-item"><i class="fas fa-swimming-pool me-2"></i> Bể bơi</li>
                                        <li class="list-group-item"><i class="fas fa-utensils me-2"></i> Nhà hàng</li>
                                        <li class="list-group-item"><i class="fas fa-spa me-2"></i> Spa</li>
                                    </ul>
                                </section>
                                <section class="room-types mb-5">
                                    <h2 class="mb-4">Đa dạng các loại phòng</h2>
                                    <div class="accordion" id="roomAccordion">
                                        <div class="accordion-item">
                                            <h3 class="accordion-header">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Deluxe Ocean View Room
                                                </button>
                                            </h3>
                                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#roomAccordion">
                                                <div class="accordion-body">
                                                    <p>Immerse yourself in luxury with our Deluxe Ocean View Room. Enjoy breathtaking views of the Pacific Ocean from your private balcony.</p>
                                                    <p><strong>Giá:</strong> $350 per night</p>
                                                    <p><strong>Trạng thái:</strong> <span class="badge bg-success">Available</span></p>
                                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal">Đặt ngay</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="accordion-item">
                                            <h3 class="accordion-header">
                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    Executive Suite
                                                </button>
                                            </h3>
                                            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#roomAccordion">
                                                <div class="accordion-body">
                                                    <p>Experience ultimate luxury in our spacious Executive Suite, featuring a separate living area and panoramic ocean views.</p>
                                                    <p id="priceRoom"><strong>Price:</strong> $550 per night</p>
                                                    <p><strong>Availability:</strong> <span class="badge bg-warning text-dark">Limited</span></p>
                                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal">Đặt ngay</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
            
                            <div class="col-lg-4">
                                <section class="reviews mb-5">
                                    <h2 class="mb-4">Đánh giá của khách hàng</h2>
                                    <div id="rates"></div>                               
                                </section>
                                <section class="rating">
                                    <h2>Đánh giá của bạn</h2>
                                    <form>
                                        <div class="mb-3">
                                            <div id="ratingStars" class="star-rating">
                                                <i class="far fa-star" data-rating="1"></i>
                                                <i class="far fa-star" data-rating="2"></i>
                                                <i class="far fa-star" data-rating="3"></i>
                                                <i class="far fa-star" data-rating="4"></i>
                                                <i class="far fa-star" data-rating="5"></i>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <textarea class="form-control" id="reviewText" rows="3" required></textarea>
                                        </div>
                                        <button type="button" class="btn btn-primary" onclick="createRate()">Gửi đánh giá</button>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
                
            `
        );
    }, "");
    document.getElementById("detailsRoom").innerHTML = html;
    // Xử lý sự kiện cho đánh giá
    const stars = document.querySelectorAll('#ratingStars i');
    let selectedRating = 0;
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
                s.classList.toggle('fas', i < selectedRating); // Thêm class fas cho các sao đã chọn
                s.classList.toggle('far', i >= selectedRating); // Thay đổi class cho các sao chưa chọn
            });
            document.getElementById('ratingStars').setAttribute('data-selected', selectedRating);
        });
    }); 
}

function renderRateID(rates) {
    const localStorageToken = localStorage.getItem('localStorageToken');
    let userID = null;

    // Kiểm tra nếu có token và giải mã để lấy userID
    if (localStorageToken) {
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));
        userID = decodedToken?.data?.MA_ND;
    }

    const html = rates.reduce((result, rate) => {
        const solidStars = rate.SO_SAO; 
        const outlineStars = 5 - solidStars; 

        const starsHTML = 
            '<i class="fas fa-star text-warning"></i> '.repeat(solidStars) +
            '<i class="far fa-star text-warning"></i> '.repeat(outlineStars);

        // Kiểm tra điều kiện hiển thị dropdown
        const showDropdown = userID && rate.MA_ND === userID ? `
            <div>
                <div class="dropdown">
                    <button class="btn btn-link" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item text-danger" onclick="deleteRate(${rate.MA_DG})">Xóa</a></li>
                    </ul>
                </div>
            </div>` : '';

        return (
            result +
            `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title">${rate.MA_ND_NGUOIDUNG.HOTEN}</h5>
                            </div>
                            ${showDropdown}
                        </div>
                        <div class="mb-2">
                            ${starsHTML}
                        </div>                        
                        <p class="card-text">${rate.BINH_LUAN}</p>
                        <footer class="blockquote-footer">${rate.NGAY_DG}</footer>
                    </div>
                </div>
            `
        );
    }, "");

    document.getElementById("rates").innerHTML = html;
}


function renderDataRoom(rooms) {
    const html = rooms.reduce((result, room) => {
        const duongDanHinh = room.PHONG.HINHANH;
        const formattedGiaGoc = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.PHONG.GIATIEN);
        const formattedGiaDaGiam = room.GIADAGIAM !== null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.GIADAGIAM) : null;

        // Chọn giá để hiển thị
        const giaHienThi = formattedGiaDaGiam || formattedGiaGoc;

        // Tạo chuỗi thông tin về khách và giường
        const guestInfo = [];
        if (room.SLKHACH > 0) guestInfo.push(`${room.SLKHACH} Khách`);
        if (room.SLGIUONGDON > 0) guestInfo.push(`${room.SLGIUONGDON} Giường đơn`);
        if (room.SLGIUONGDOI > 0) guestInfo.push(`${room.SLGIUONGDOI} Giường đôi`);

        return (
            result +
            `
                <div class="my-5">
                    <div class="room-list">
                        <div class="room-item mb-4">
                            <div class="card shadow">
                                <img src="/img/${duongDanHinh}" class="card-img-top" alt="">
                                <div class="card-body">
                                    <h2 class="card-title" id="typeRoom">${room.TENLOAIPHG}</h2>
                                    <p class="card-text">${room.PHONG.MOTA}.</p>
                                    <p class="card-text fs-6"><b>${guestInfo.join(', ')}</b></p>
                                                                    
                                    <ul class="list-group list-group-flush mb-3">
                                        <li class="list-group-item text-danger ps-0"><b>Giá: <span id="priceRoom">${giaHienThi}</span>/đêm</b></li>
                                        <li class="list-group-item ps-0">Trạng thái: 
                                            <span class="badge ${room.TRANGTHAI === 'Hết phòng' ? 'bg-danger' : 'bg-success'}">
                                                ${room.TRANGTHAI === 'Hết phòng' ? room.TRANGTHAI : `${room.SLPHONG}x ${room.TRANGTHAI}`}
                                            </span>
                                        </li>
                                    </ul>
                                    <button class="btn btn-primary choose-room-btn" 
                                            ${room.TRANGTHAI === 'Hết phòng' ? 'disabled' : ''} 
                                            data-room-type="${room.MA_LOAIPHG}" 
                                            data-bs-toggle="modal" data-bs-target="#bookingModal">
                                        Chọn phòng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }, "");

    document.getElementById("roomAccordion").innerHTML = html;

    // Thêm sự kiện click cho nút "Chọn phòng"
    document.querySelectorAll('.choose-room-btn').forEach(button => {
        button.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room-type');
            localStorage.setItem('MA_LOAIPHG', roomType);
        });
    });
}

function renderConvenient(convenients) {
    const convenientMap = {
        1: `<li class="list-group-item"><i class="fas fa-wifi me-2"></i> Wifi miễn phí</li>`,
        2: `<li class="list-group-item"><i class="fas fa-swimming-pool me-2"></i> Bể bơi</li>`,
        3: `<li class="list-group-item"><i class="fas fa-utensils me-2"></i> Nhà hàng</li>`,
        4: `<li class="list-group-item"><i class="fas fa-spa me-2"></i> Spa</li>`,
        5: `<li class="list-group-item"><i class="fas fa-plane me-2"></i> Đưa đón sân bay</li>`,
        6: `<li class="list-group-item"><i class="fas fa-dumbbell me-2"></i> Phòng Gym</li>`,
        7: `<li class="list-group-item"><i class="fas fa-car me-2"></i> Miễn phí đỗ xe</li>`,
        8: `<li class="list-group-item"><i class="fas fa-glass-cheers me-2"></i> Bar</li>`,
        9: `<li class="list-group-item"><i class="fas fa-hands-wash me-2"></i></i> Dịch vụ giặt ủi</li>`,
        10: `<li class="list-group-item"><i class="fas fa-wine-glass me-2"></i> Đồ uống miễn phí</li>`
    };

    const html = convenients.reduce((result, convenient) => {
        return result + (convenientMap[convenient.MA_TIENNGHI] || "");
    }, "");

    document.getElementById("convenients").innerHTML = html;
}

async function createRate() {
    const rating = document.getElementById('ratingStars').getAttribute('data-selected');
    const comment = document.getElementById('reviewText').value;
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');
    const rateData = {
        MA_KS: roomID,
        SO_SAO: rating,
        BINH_LUAN: comment
    };
    
    const token = localStorage.getItem('localStorageToken');
    if (!token) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng đăng nhập để đánh giá.',
            icon: 'info',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = 'loginUser.html';
        });
        return;
    }

    if (!rating || rating === "0") {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn số sao trước khi gửi đánh giá!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    if (!comment) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng nhập bình luận trước khi gửi đánh giá!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    try {
        const response = await apiCreateRate(rateData);
        
        if (response.status === 201) {
            Swal.fire({
                title: 'Thành công!',
                text: 'Đánh giá của bạn đã được gửi thành công.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload(); // Reload trang sau khi đánh giá thành công
            });
        } else if (response.status === 403) {
            Swal.fire({
                title: 'Lỗi',
                text: response.data || 'Người dùng đã đánh giá khách sạn này rồi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else if (response.status === 400) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Thông tin không đầy đủ.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Lỗi',
                text: response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        const status = error.response ? error.response.status : 500; 
        const message = error.response ? error.response.data : 'Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.';
        
        Swal.fire({
            title: 'Lỗi',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function deleteRate(rateID) {
    const willDelete = await Swal.fire({
        title: "Bạn có muốn xóa đánh giá này?",
        text: "Nhấn OK để xác nhận xóa đánh giá.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willDelete.isConfirmed) {
        try {
            await apiDeleteRate(rateID);
            Swal.fire('Xóa đánh giá thành công', '', 'success').then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire('Không thể xóa đánh giá', error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.', 'error');
        }
    }
}
