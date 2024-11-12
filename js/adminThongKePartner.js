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
    if (!userRole || !userRole.startsWith("Partner")) {
        // Nếu userRole không phải là Partner thì chuyển hướng đến trang index
        window.location.href = "/layouts/index.html";
        return;
    }
    getCountBooking();
});

async function getCountBooking() {
    try {
        const countBooking = await apiGetCountBookingPartner();
        return countBooking;
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Lỗi', 'Không thể lấy dữ liệu. Vui lòng thử lại sau.', 'error');
    }
}

// Hàm cập nhật biểu đồ với dữ liệu mới
async function updateChartData() {
    const newData = await getCountBooking();  // Lấy dữ liệu mới từ API
    if (newData.length > 0) {
        // Chuyển đổi dữ liệu từ mảng {week, totalRevenue} thành mảng doanh thu
        const revenueData = newData.map(item => item.totalRevenue);

        // Cập nhật dữ liệu cho biểu đồ
        revenueChart.data.datasets[0].data = revenueData;

        // Cập nhật lại biểu đồ
        revenueChart.update();
    } else {
        console.log("Không có dữ liệu mới để cập nhật biểu đồ.");
    }
}

// Gọi hàm cập nhật biểu đồ khi trang được tải
updateChartData();