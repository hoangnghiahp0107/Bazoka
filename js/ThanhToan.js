document.addEventListener('DOMContentLoaded', () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (localStorageToken) {
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));

        const hoTen = decodedToken?.data?.HOTEN ? decodeURIComponent(escape(decodedToken.data.HOTEN)) : '';
        const EMAIL = decodedToken?.data?.EMAIL ? decodeURIComponent(escape(decodedToken.data.EMAIL)) : '';
        const SDT = decodedToken?.data?.SDT ? decodeURIComponent(escape(decodedToken.data.SDT)) : '';
        document.getElementById('name').innerHTML = hoTen + ', ';
        document.getElementById('email').innerHTML = EMAIL;
        document.getElementById('SDT').innerHTML = SDT;
    }
    
    const bookData = localStorage.getItem('selectedBookRoom');
    const checkIn = localStorage.getItem('checkIn');
    const checkOut = localStorage.getItem('checkOut');
    const rooms = localStorage.getItem('numberOfRooms');
    const coc = localStorage.getItem('COC');
    
    if (bookData) {
        const infoBooking = JSON.parse(bookData);
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${daysOfWeek[date.getDay()]}, ${day} tháng ${month} ${year}`;
        };
       // Cập nhật ngày nhận phòng
       document.getElementById('checkIn').innerHTML = `<b>Nhận phòng:</b> ${formatDate(infoBooking.checkInDate) || ''}`;

        // Cập nhật tên khách sạn
        document.getElementById('nameHotel').innerText = infoBooking.nameHotel || 'Grand K Hotel Suites Hanoi';

        // Cập nhật ngày nhận phòng
        document.getElementById('checkIn').innerHTML = `<b>Nhận phòng:</b> ${formatDate(checkIn) || ''}`;
        
        // Cập nhật ngày trả phòng
        document.getElementById('checkOut').innerHTML = `<b>Trả phòng:</b> ${formatDate(checkOut) || ''}`;

        // Cập nhật loại phòng
        document.getElementById('typeRoom').innerHTML = `<b>Phòng:</b> ${rooms}x ${infoBooking.typeRoom || ''}`;
        if (coc) {
            // Chuyển đổi giá trị coc thành số nếu cần
            const cocValue = parseFloat(coc);
            // Cập nhật nội dung HTML
            document.getElementById('coc').innerHTML = `<b>Cọc trước:</b> ${cocValue.toLocaleString('vi-VN')} VND`;
        } else {
            document.getElementById('coc').innerHTML = '<b>Cọc trước:</b> 0 VND'; // hoặc thông báo khác
        }
        // Tính số đêm ở
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));

        // Lấy giá phòng và tính tổng giá
        const priceRoom = parseFloat(infoBooking.priceRoom.replace(/[,. ₫]/g, '')) || 0;
        const totalPrice = priceRoom * numberOfNights * rooms;

        // Tính thuế phòng 10%
        const taxRoom = totalPrice * 0.10;
        const sumPrice = totalPrice + taxRoom; // Cập nhật để tính giá sau thuế
        // Cập nhật tổng giá, thuế và giá sau thuế
        document.getElementById('sumPrice').innerHTML = `<p>Tổng giá tiền: ${sumPrice.toLocaleString('vi-VN')} VND </p>`;
        localStorage.setItem('sumPrice', sumPrice); 
    } else {
        console.log('Không tìm thấy thông tin đặt phòng trong localStorage');
    }
});

async function createPayment() {
    const checkIn = localStorage.getItem("checkIn");
    const checkOut = localStorage.getItem("checkOut");
    const slKhach = localStorage.getItem("numberOfGuests");
    const MA_KS = localStorage.getItem("MA_KS");
    const numberOfRooms = localStorage.getItem("numberOfRooms");
    const LOAIPHONG = localStorage.getItem("MA_LOAIPHG");
    const thanhTienStr = localStorage.getItem("COC");
    const thanhTien = parseFloat(thanhTienStr);    
    try {
        await apiBookingRoomPay({
            NGAYDEN: checkIn,
            NGAYDI: checkOut,
            SLKHACH: slKhach,
            THANHTIEN: thanhTien,
            MA_MGG: null, // Thêm nếu có
            MA_KS: MA_KS, // Thêm nếu có
            numberOfRooms: numberOfRooms, // Số lượng phòng
            LOAIPHONG: LOAIPHONG, // Thêm nếu có
        });
    } catch (error) {
        console.error("Đã có lỗi trong quá trình xử lý:", error.response ? error.response.data : error.message);
        alert("Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.");
    }
}




