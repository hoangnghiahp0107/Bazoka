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

    const roomData = localStorage.getItem('selectedRoom');
    if (roomData) {
        const room = JSON.parse(roomData);

        document.getElementById('TENPHONG').value = room.TENPHONG;
        document.getElementById('MOTA').value = room.MOTA;
        document.getElementById('GIATIEN').value = room.GIATIEN;
        document.getElementById('MA_KM').value = room.MA_KM;
        document.getElementById('MA_LOAIPHG').value = room.MA_LOAIPHG;

        const roomID = Number(room.MA_PHONG);
        document.getElementById("updateButton").addEventListener("click", function() {
            updateRoom(roomID);
        });
    } else {
        console.log('No hotel data found in localStorage');
    }
});

async function updateRoom(roomID) {
    const TENPHONG = document.getElementById("TENPHONG").value.trim();
    const MOTA = document.getElementById("MOTA").value.trim();
    const GIATIEN = document.getElementById("GIATIEN").value.trim();
    const MA_KM = document.getElementById("MA_KM").value.trim();
    const MA_LOAIPHG = document.getElementById("MA_LOAIPHG").value.trim();
    const HINHANH = document.getElementById("HINHANH").files[0];

    const formData = new FormData();
    formData.append('TENPHONG', TENPHONG);
    formData.append('MOTA', MOTA);
    formData.append('GIATIEN', GIATIEN);
    formData.append('MA_KM', MA_KM);
    formData.append('MA_LOAIPHG', MA_LOAIPHG);
    formData.append('HINHANH', HINHANH);

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật thông tin phòng?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateRoom(roomID, formData);
            Swal.fire('Cập nhật thông tin phòng thành công', '', 'success').then(() => {
                window.location.href = "adminManageRoom.html"; 
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            Swal.fire('Cập nhật thông tin phòng thất bại', 'Vui lòng thử lại sau.', 'error');
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