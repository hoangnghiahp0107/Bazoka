document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('name');
    const numberOfGuests = urlParams.get('numberOfGuests');
    const numberOfRooms = urlParams.get('numberOfRooms');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    if (location && numberOfGuests && numberOfRooms && checkIn && checkOut){
        getSearchHotel(location, numberOfGuests, numberOfRooms, checkIn, checkOut);
    }
    document.getElementById('location').value = location;
    document.getElementById('checkIn').value = checkIn;
    document.getElementById('checkOut').value = checkOut;
    document.getElementById('guests').value = numberOfGuests;
    document.getElementById('rooms').value = numberOfRooms;
})

function getElement(selector) {
    return document.querySelector(selector);
}

const items = document.querySelectorAll(".item");

items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");
        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");
            if(checked && checked.length > 0){
                btnText.innerHTML = `${checked.length} Đã chọn`;
            } else{
                btnText.innerHTML = "Chọn phòng";
            }
    })
})

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn việc gửi form mặc định
    
    const name = document.getElementById('location').value;
    const numberOfGuests = document.getElementById('guests').value;
    const numberOfRooms = document.getElementById('rooms').value;
    const NGAYDI = document.getElementById('checkIn').value;
    const NGAYDEN = document.getElementById('checkOut').value;
    localStorage.setItem('name', name);
    localStorage.setItem('numberOfRooms', numberOfRooms);
    localStorage.setItem('numberOfGuests', numberOfGuests);
    localStorage.setItem('checkIn', NGAYDI);
    localStorage.setItem('checkOut', NGAYDEN);
    // Gọi hàm tìm kiếm khách sạn
    await getSearchHotel(name, numberOfGuests, numberOfRooms, NGAYDEN, NGAYDI);

    // Tạo URL với các tham số
    const newUrl = `/layouts/room.html?name=${encodeURIComponent(name)}&numberOfGuests=${encodeURIComponent(numberOfGuests)}&numberOfRooms=${encodeURIComponent(numberOfRooms)}&checkIn=${encodeURIComponent(NGAYDI)}&checkOut=${encodeURIComponent(NGAYDEN)}`;
    
    // Thay đổi URL mà không reload trang
    window.history.pushState({}, '', newUrl);
});


async function getSearchHotel(name, numberOfGuests, numberOfRooms, NGAYDEN, NGAYDI) {
    try {
        const response = await apiSearchHotel(name, numberOfGuests, numberOfRooms, NGAYDEN, NGAYDI);
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
        ));
        renderSearchRoom(roomObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getPrice(roomID) {
    try {
        const response = await apiGetPriceDiscount(roomID);
        return {
            giaGoc: Math.round(response.data.giaGoc),
            giaDaGiam: response.data.giaDaGiam !== null ? Math.round(response.data.giaDaGiam) : null // Round the discounted price if it exists
        };
    } catch (error) {
        console.error("Lỗi lấy giá phòng:", error);
        return {
            giaGoc: "Giá không khả dụng",
            giaDaGiam: "Giá không khả dụng"
        };
    }
}

async function getRateSummary(roomID) {
    try {
        const response = await apiGetRateSummary(roomID);
             
        const { totalReviews, averageRating, ratingLabel } = response.data; 

        return { totalReviews, averageRating, ratingLabel };
    } catch (error) {
        console.error("Error fetching rate summary:", error);
        throw error; // Rethrow or handle the error as needed
    }
}

document.querySelectorAll('.star-item').forEach(item => {
    item.addEventListener('click', function() {
        const stars = parseInt(this.getAttribute('data-stars'));
        renderRoomsByStars(stars);
    });
});

async function renderSearchRoom(rooms) {
    const html = await Promise.all(rooms.map(async (room) => {
        const { giaGoc, giaDaGiam } = await getPrice(room.MA_KS);
        const { totalReviews, averageRating, ratingLabel } = await getRateSummary(room.MA_KS);
        const duongDanHinh = room.HINHANH;
        const formattedGiaGoc = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaGoc);
        const formattedGiaDaGiam = giaDaGiam !== null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaDaGiam) : null;
        return `
            <div class="col-md-12 mb-4">
                <div class="card hotel-card">
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img class="rounded-start" src="/img/${duongDanHinh}" alt="Cozy Hotel Room">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${room.TEN_KS}</h5>
                                <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${room.MA_VITRI_VITRI.TENVITRI}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.TEN_TINHTHANH}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.MA_QUOCGIA_QUOCGIum.TEN_QUOCGIA}</p>
                                <p class="card-text">
                                    <span class="badge bg-success">${averageRating} <i class="fa-solid fa-thumbs-up"></i></span>
                                    <small class="text-muted">(${totalReviews} nhận xét)</small>
                                </p>
                                <p class="card-text"><strong>${ratingLabel}</strong></p>
                                <p class="card-text"><small class="text-muted">Tiết kiệm nhiều hơn và tận hưởng</small></p>
                                <p class="card-text price-info">
                                    ${giaDaGiam !== null ? `<span class="original-price">${formattedGiaGoc}</span>` : `<span class="discounted-price">${formattedGiaGoc}</span>`}
                                    ${giaDaGiam !== null ? `<span class="discounted-price">${formattedGiaDaGiam}</span>` : ''}                              
                               
                                </p>
                                <a href="#" class="btn mb-3 select-room-btn" data-room-id="${room.MA_KS}" data-yeu-cau-coc="${room.YEU_CAU_COC}" data-ti-le-coc="${room.TI_LE_COC}">Chọn phòng</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }));
    document.getElementById("room").innerHTML = html.join('');
    document.querySelectorAll('.select-room-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
            const roomId = this.getAttribute('data-room-id');
            const yeuCauCoc = button.getAttribute('data-yeu-cau-coc'); 
            const tiLeCoc = button.getAttribute('data-ti-le-coc'); 
            const NGAYDI = document.getElementById('checkIn').value;
            const NGAYDEN = document.getElementById('checkOut').value;
            localStorage.setItem('YEU_CAU_COC', yeuCauCoc);
            localStorage.setItem('TI_LE_COC', tiLeCoc);
            window.location.href = `/layouts/detailRoom.html?roomID=${roomId}&checkIn=${encodeURIComponent(NGAYDI)}&checkOut=${encodeURIComponent(NGAYDEN)}`
        });
    });
}
