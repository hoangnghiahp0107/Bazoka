document.addEventListener('DOMContentLoaded', () => {
    const localStorageToken = localStorage.getItem('localStorageToken');
    if (!localStorageToken) {
        window.location.href = "/layouts/loginAdmin.html";
        return; 
    }

    const base64Url = localStorageToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    const userRole = decodedToken && decodedToken.data && decodedToken.data.CHUCVU;
    if (!userRole || !userRole.startsWith("Partner")) {
        // Nếu userRole không phải là Partner thì chuyển hướng đến trang index
        window.location.href = "/layouts/index.html";
        return;
    }


    const tiennghiData = localStorage.getItem('selectedTienNghi');
    if (tiennghiData) {
        const tiennghi = JSON.parse(tiennghiData);

        document.getElementById('TENTIENNGHI').value = tiennghi.TENTIENNGHI;
        document.getElementById('ICON').value = tiennghi.ICON;
        const tiennghiID = tiennghi.MA_TIENNGHI;
        document.getElementById("updateButton").addEventListener("click", function() {
            updateTiennghi(tiennghiID);
        });
    } else {
        console.log('No hotel data found in localStorage');
    }
});

async function updateTiennghi(tiennghiID) {
    const TENTIENNGHI = document.getElementById("TENTIENNGHI").value.trim();
    const ICON = document.getElementById("ICON").value.trim();
    const tiennghi = {
        TENTIENNGHI,
        ICON
    };

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật thông tin tiện nghi?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateTienNghi(tiennghiID, tiennghi);
            Swal.fire('Cập nhật thông tin tiện nghi thành công', '', 'success').then(() => {
                window.location.href = "adminTienNghi.html"; 
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            const errorMessage = error.response?.data?.message || 'Vui lòng thử lại sau.';
            Swal.fire('Cập nhật thông tin tiện nghi thất bại', errorMessage, 'error');
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