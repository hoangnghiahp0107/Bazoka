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

        // Lùi lại một ngày nếu có cọc
        const cancel2 = cancelDate.setDate(cancelDate.getDate() - 1);
        const cancel1 = cancelDate.setDate(cancelDate.getDate() - 3);
        document.getElementById('cancelDate').innerHTML = `từ ${formatDate(cancel1)} đến ${formatDate(cancel2)}`;

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
let discountApplied = false; // Biến để theo dõi trạng thái giảm giá

async function applyDiscount() {
    try {
      if (discountApplied) {
        // Nếu đã áp dụng giảm giá, không thực hiện gì cả
        return;
      }
  
      const discountID = document.getElementById('MA_MGG').value;
      if (!discountID) {
        // Nếu không có mã giảm giá, thông báo lỗi
        document.getElementById('tbMAGIAMGIA').innerText = "Vui lòng nhập mã giảm giá";
        document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
        return;
      }
  
      const response = await apiApplyDiscount(discountID);
  
      // Kiểm tra phản hồi từ API
      if (!response) {
        document.getElementById('tbMAGIAMGIA').innerText = "Không thể nhận thông tin mã giảm giá";
        document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
        return;
      }
  
      // Kiểm tra xem mã giảm giá đã được sử dụng chưa (trả về lỗi nếu đã dùng)
      if (response === "Mã giảm giá này đã được sử dụng cho người dùng này.") {
        document.getElementById('tbMAGIAMGIA').innerText = "Bạn đã sử dụng mã giảm giá này rồi.";
        document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
        return;
      }
  
      // Lưu thông tin giảm giá vào localStorage
      localStorage.setItem('selectedDiscount', JSON.stringify(response));
  
      const discountData = JSON.parse(localStorage.getItem('selectedDiscount'));
  
      // Kiểm tra ngày áp dụng giảm giá
      const currentDate = new Date();
      const startDate = new Date(discountData.NGAYBATDAU);
      const endDate = new Date(discountData.NGAYKETTHUC);
  
      if (currentDate < startDate) {
        // Mã giảm giá chưa đến ngày
        document.getElementById('tbMAGIAMGIA').innerText = `Mã giảm giá chưa đến ngày`;
        document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
        return;
      }
  
      if (currentDate > endDate) {
        // Mã giảm giá đã hết hạn
        document.getElementById('tbMAGIAMGIA').innerText = `Mã giảm giá đã hết hạn`;
        document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
        return;
      }
  
      // Nếu mã giảm giá hợp lệ, tính toán giảm giá
      const totalPriceElement = document.getElementById('sumPrice');
      let totalPrice = parseFloat(totalPriceElement.innerText.replace(/[,. VND]/g, '').trim()) || 0;
      const discountPercentage = discountData?.PHANTRAM || 0; // Giả sử response chứa trường 'PHANTRAM'
      
      const discountAmount = (discountPercentage / 100) * totalPrice;
      const newTotalPrice = totalPrice - discountAmount; // Tính toán tổng giá mới
  
      // Cập nhật giao diện
      totalPriceElement.innerHTML = `${newTotalPrice.toLocaleString('vi-VN')} VND`;
      document.getElementById('applyDiscount').innerHTML = `${discountAmount.toLocaleString('vi-VN')} VND`;
      document.getElementById('sumPrice1').innerHTML = `<b>Tổng giá: </b> ${newTotalPrice.toLocaleString('vi-VN')} VND`;
  
      // Tính toán lại giá cọc dựa trên tổng giá mới
      const tiLeCoc = parseFloat(localStorage.getItem('TI_LE_COC')) || 0;
      let deposit = newTotalPrice * tiLeCoc / 100; // Cọc 30% hoặc theo tỉ lệ đã lưu
      localStorage.setItem('COC', deposit.toString());
  
      localStorage.setItem('sumPrice', newTotalPrice.toString());
      
      // Cập nhật giao diện cho giá cọc
      document.getElementById('coc').innerHTML = `${deposit.toLocaleString('vi-VN')} VND`;
  
      // Đánh dấu là đã áp dụng giảm giá
      discountApplied = true;
      
    } catch (error) {
      console.log(error);
      document.getElementById('tbMAGIAMGIA').innerText = error.message || "Có lỗi xảy ra trong quá trình lấy dữ liệu.";
      document.getElementById('tbMAGIAMGIA').classList.add('text-danger');
    }
  }
  



async function DatPhong() {
    const NGAYDEN = localStorage.getItem('checkIn');
    const NGAYDI = localStorage.getItem('checkOut');
    const numberOfRooms = localStorage.getItem('numberOfRooms');
    const MA_KS = localStorage.getItem('MA_KS');
    const LOAIPHONG = localStorage.getItem('MA_LOAIPHG');
    const SLKHACH = localStorage.getItem('numberOfGuests');
    const MA_MGG = document.getElementById('MA_MGG').value;

    // Get the sumPrice value from the displayed element
    const sumPriceElement = document.getElementById('sumPrice');
    const sumPrice = parseFloat(sumPriceElement.innerText.replace(/[,. ₫]/g, '')) || 0;

    try {
        const response = await apiBookingRoom({
            MA_MGG: MA_MGG,
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

