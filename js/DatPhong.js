document.addEventListener('DOMContentLoaded', () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (localStorageToken) {
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));

        const hoTen = decodedToken?.data?.HOTEN ? decodeURIComponent(escape(decodedToken.data.HOTEN)) : '';
        const EMAIL = decodedToken?.data?.EMAIL ? decodeURIComponent(escape(decodedToken.data.EMAIL)) : '';
        const SDT = decodedToken?.data?.SDT ? decodeURIComponent(escape(decodedToken.data.SDT)) : '';
        const anhDaiDien = decodedToken?.data?.ANHDAIDIEN ? decodeURIComponent(escape(decodedToken.data.ANHDAIDIEN)) : '';

        document.getElementById('name').value = hoTen;
        document.getElementById('name1').innerHTML = hoTen;
        document.getElementById('email').value = EMAIL;
        document.getElementById('SDT').value = SDT;
        const avatarElement = document.getElementById('avatar');
        avatarElement.src = `/img/${anhDaiDien}`; // Đường dẫn hoàn chỉnh
    }

    const bookData = localStorage.getItem('selectedBookRoom');
    const checkIn = localStorage.getItem('checkIn');
    const checkOut = localStorage.getItem('checkOut');
    const yeuCauCoc = localStorage.getItem('YEU_CAU_COC');
    const rooms = localStorage.getItem('numberOfRooms');
    const tiLeCoc = localStorage.getItem('TI_LE_COC');

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
        document.getElementById('checkInDate').innerHTML = `<b>Nhận phòng:</b> ${formatDate(infoBooking.checkInDate) || ''}`;

        // Xử lý cancelDate
        const cancelDate = new Date(checkIn);
        if (yeuCauCoc === "true") {
            // Lùi lại một ngày nếu có cọc
            cancelDate.setDate(cancelDate.getDate() - 1);
            document.getElementById('cancelDate').innerHTML = `trước ${formatDate(cancelDate) || ''}`;
        } else {
            // Để trống nếu không có cọc
            document.getElementById('cancelDate').innerHTML = '';
        }

        // Cập nhật tên khách sạn
        document.getElementById('nameHotel').innerText = infoBooking.nameHotel || 'Grand K Hotel Suites Hanoi';
        document.getElementById('checkInDate').innerHTML = `<b>Nhận phòng:</b> ${formatDate(checkIn) || ''}`;
        document.getElementById('checkOutDate').innerHTML = `<b>Trả phòng:</b> ${formatDate(checkOut) || ''}`;
        document.getElementById('typeRoom').innerHTML = `<b>Phòng:</b> ${rooms}x ${infoBooking.typeRoom || ''}`;

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

        // Kiểm tra YEUCAUCOC để xác định giá cọc
        let deposit;
        if (yeuCauCoc === "true") {
            deposit = sumPrice * tiLeCoc/100; // Cọc 30% nếu yêu cầu cọc
            localStorage.setItem('COC', deposit.toString());
        } else {
            deposit = 0; // Nếu không yêu cầu cọc, giá trị cọc là 0
        }

        // Cập nhật tổng giá, thuế và giá sau thuế
        document.getElementById('priceRoom').innerHTML = `${totalPrice.toLocaleString('vi-VN')} VND`;
        document.getElementById('taxRoom').innerHTML = `${taxRoom.toLocaleString('vi-VN')} VND`;
        document.getElementById('sumPrice').innerHTML = `${sumPrice.toLocaleString('vi-VN')} VND`;
        document.getElementById('sumPrice1').innerHTML = `<b>Tổng giá: </b> ${sumPrice.toLocaleString('vi-VN')} VND`;
        document.getElementById('coc').innerHTML = `${deposit.toLocaleString('vi-VN')} VND`;
    } else {
        console.log('Không tìm thấy thông tin đặt phòng trong localStorage');
    }
});


async function DatPhong() {
    const NGAYDEN = localStorage.getItem('checkIn');
    const NGAYDI = localStorage.getItem('checkOut');
    const numberOfRooms = localStorage.getItem('numberOfRooms');
    const MA_KS = localStorage.getItem('MA_KS');
    const LOAIPHONG = localStorage.getItem('MA_LOAIPHG');
    const SLKHACH = localStorage.getItem('numberOfGuests');
    
    // Get the sumPrice value from the displayed element
    const sumPriceElement = document.getElementById('sumPrice');
    const sumPrice = parseFloat(sumPriceElement.innerText.replace(/[,. ₫]/g, '')) || 0;

    try {
        const response = await apiBookingRoom({
            NGAYDEN: NGAYDEN,
            NGAYDI: NGAYDI,
            SLKHACH: SLKHACH,
            THANHTIEN: sumPrice, // Use sumPrice here
            MA_KS: MA_KS,
            numberOfRooms: numberOfRooms,
            LOAIPHONG: LOAIPHONG
        });    
        
        // Check both the status code and the message content
        if (response.message === 'Đặt phòng thành công') {
            Swal.fire({
                title: 'Đặt phòng thành công',
                text: 'Cảm ơn bạn đã đặt phòng!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Chuyển hướng đến userInfo.html và kích hoạt tab
                window.location.href = 'userInfo.html#account-my-bookings';
            });
        } else {
            throw new Error('Đặt phòng không thành công');
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Đặt phòng không thành công',
            text: 'Hiện đã hết phòng bạn vui lòng chọn phòng khác',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
    }
}




