let userId;


document.addEventListener("DOMContentLoaded", function () {
    
    const token = localStorage.getItem('localStorageToken'); 
    
    if (token){
        const decodedToken = jwt_decode(token);
        userId = decodedToken.MA_ND;
    }

   

    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('roomID');
    if (roomID) {
        getRoomID(roomID);
        getRateID(roomID);
        getConvenient(roomID);
        getDataRoom(roomID);
    }
})

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
            room.MA_VITRI,
            room.MA_VITRI_VITRI,
            room.MA_QUOCGIA_QUOCGIum
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

async function createReview() {
    const inputComment = document.getElementById("reviewText").value;
    const rateRoom = document.getElementById("ratingStars").value;
    
    try {
        let formData ={
            SO_SAO: 5,
            BINH_LUAN: inputComment,
            NGAY_DG: new Date(),
            MA_KS: roomID,
            MA_ND: userId
        }


        // const respond = await apiCreateReviews(formData);
         console.log(formData)
      
    } catch (error) {
        console.error(error);
      
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

async function getDataRoom(roomID){
    try {
        const response = await apiGetDataRoom(roomID);
        const rooms = response.data;
        const roomObj = rooms.map((room) => new PHONG(
            room.MA_PHONG,
            room.TENPHONG,
            room.MOTA,
            room.GIATIEN,
            room.HINHANH,
            room.TRANGTHAIPHG,
            room.MA_KS,
            room.MA_KM,
            room.MA_LOAIPHG
        )) 
        console.log(roomObj)
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
                    <h2 class="mt-3"><b>${room.TEN_KS}</b></h2>
                    <p><i class="fas fa-location-dot me-2" style="color: #00b383;"></i>${room.MA_VITRI_VITRI.TENVITRI}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.TEN_TINHTHANH}, ${room.MA_VITRI_VITRI.MA_TINHTHANH_TINHTHANH.MA_QUOCGIA_QUOCGIum.TEN_QUOCGIA}</p>
                    <img src="/img/${duongDanHinh}" alt="..." class="img-fluid w-100">
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
                                                    <p><strong>Price:</strong> $550 per night</p>
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
                                    <form onsubmit="createReview()">
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
                                        <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
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
    
}

function renderRateID(rates) {
    const html = rates.reduce((result, rate) => {
        const solidStars = rate.SO_SAO; 
        const outlineStars = 5 - solidStars; 

        const starsHTML = 
            '<i class="fas fa-star text-warning"></i> '.repeat(solidStars) +
            '<i class="far fa-star text-warning"></i> '.repeat(outlineStars);

        return (
            result +
            `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${rate.MA_ND_NGUOIDUNG.HOTEN}</h5>
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

function renderDataRoom(rooms){
    const html = rooms.reduce((result, room) =>{
        return (
            result +
            `
                <div class="accordion-item">
                    <h3 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            ${room.TENPHONG}
                        </button>
                    </h3>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#roomAccordion">
                        <div class="accordion-body">
                            <p>${room.MOTA}</p>
                            <p><strong>Giá:</strong> ${room.GIATIEN} night</p>
                            <p><strong>Trạng thái:</strong> <span class="badge bg-success">${room.TRANGTHAIPHG}</span></p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            `
        );
    }, "");
    document.getElementById("roomAccordion").innerHTML = html;
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

