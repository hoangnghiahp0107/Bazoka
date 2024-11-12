document.addEventListener('DOMContentLoaded', () => {
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


    const discountData = localStorage.getItem('selectedKM');
    if (discountData) {
        const discount = JSON.parse(discountData);

        document.getElementById('PHANTRAM').value = discount.PHANTRAM;
        document.getElementById('NGAYBATDAU').value = discount.NGAYBATDAU;
        document.getElementById('NGAYKETTHUC').value = discount.NGAYKETTHUC;
        document.getElementById('TEN_KM').value = discount.TEN_KM;
        document.getElementById('MA_KM').value = discount.MA_KM;

        const discountID = discount.MA_KM;
        document.getElementById("updateButton").addEventListener("click", function() {
            updateDiscount(discountID);
        });
    } else {
        console.log('No hotel data found in localStorage');
    }
});

async function updateDiscount(discountID) {
    const PHANTRAM = document.getElementById("PHANTRAM").value.trim();
    const NGAYBATDAU = document.getElementById("NGAYBATDAU").value.trim();
    const NGAYKETTHUC = document.getElementById("NGAYKETTHUC").value.trim();
    const TEN_KM = document.getElementById("TEN_KM").value.trim();

    const discount = {
        PHANTRAM,
        NGAYBATDAU,
        NGAYKETTHUC,
        TEN_KM
    };

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật thông tin khuyến mãi?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateDiscountPartner(discountID, discount);
            Swal.fire('Cập nhật thông tin khuyến mãi thành công', '', 'success').then(() => {
                window.location.href = "adminDiscountPartner.html"; 
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            const errorMessage = error.response?.data?.message || 'Vui lòng thử lại sau.';
            Swal.fire('Cập nhật thông tin khuyến mãi thất bại', errorMessage, 'error');
        }
    }
}



function logout() {
    localStorage.removeItem('localStorageToken');
    window.location.href = "index.html";
}

document.getElementById("logoutButton").addEventListener("click", function() {
    logout();
});