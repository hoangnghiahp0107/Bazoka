document.addEventListener("DOMContentLoaded", function () {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "/layouts/loginAdmin.html";
        return; 
    }

    const base64Url = localStorageToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    const userRole = decodedToken && decodedToken.data && decodedToken.data.CHUCVU;

    if (userRole !== "Admin") {
        window.location.href = "/layouts/index.html";
        return;
    }

    getData();
    updateChart();
    updateRate();
});

async function getData() {
    try {
        const total = await apiGetData();
        renderTotal(total);
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Lỗi', 'Không thể lấy dữ liệu. Vui lòng thử lại sau.', 'error');
    }
}

async function getCountBooking() {
    try {
        const countBooking = await apiGetCountBooking();
        return countBooking;
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Lỗi', 'Không thể lấy dữ liệu. Vui lòng thử lại sau.', 'error');
    }
}

async function getCountRate() {
    try {
        const countRate = await apiGetCountRate();
        return countRate;
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Lỗi', 'Không thể lấy dữ liệu. Vui lòng thử lại sau.', 'error');
    }
}

async function updateChart() {
    const data = await getCountBooking();
    
    if (data) {
        bookingChart.data.datasets[0].data = data;
        bookingChart.update();
    }
}

async function updateRate() {
    const data = await getCountRate();
    
    if (data) {
        ratingChart.data.datasets[0].data = data;
        ratingChart.update();
    }
}



function renderTotal(total) {
    const nguoiDungCount = document.getElementById("nguoiDungCount");
    if (total && total.nguoiDungCount !== undefined) {
        nguoiDungCount.textContent = total.nguoiDungCount;
    } else {
        nguoiDungCount.textContent = '0'; 
    }

    const khachSanCount = document.getElementById("khachSanCount");
    if (total && total.khachSanCount !== undefined) {
        khachSanCount.textContent = total.khachSanCount;
    } else {
        khachSanCount.textContent = '0'; 
    } 
    
    const danhGiaCount = document.getElementById("danhGiaCount");
    if (total && total.danhGiaCount !== undefined) {
        danhGiaCount.textContent = total.danhGiaCount;
    } else {
        danhGiaCount.textContent = '0'; 
    } 

    const phieuDatPhgCount = document.getElementById("phieuDatPhgCount");
    if (total && total.phieuDatPhgCount !== undefined) {
        phieuDatPhgCount.textContent = total.phieuDatPhgCount;
    } else {
        phieuDatPhgCount.textContent = '0'; 
    } 
}
