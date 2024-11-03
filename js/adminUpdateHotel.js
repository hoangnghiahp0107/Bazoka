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

    if (userRole !== "Admin") {
        window.location.href = "/layouts/index.html";
        return;
    }

    const hotelData = localStorage.getItem('selectedHotel');
    if (hotelData) {
        const hotel = JSON.parse(hotelData);

        document.getElementById('TEN_KS').value = hotel.TEN_KS;
        document.getElementById('MO_TA').value = hotel.MO_TA;
        document.getElementById('SOSAO').value = hotel.SOSAO;
        document.getElementById('MA_VITRI').value = hotel.MA_VITRI;
        document.getElementById('TI_LE_COC').value = hotel.TI_LE_COC;

        if (hotel.TRANGTHAI_KS) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${hotel.TRANGTHAI_KS}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
            }
        }
        
        if (hotel.YEU_CAU_COC !== undefined && hotel.YEU_CAU_COC !== null) {
            const deleteValue = hotel.YEU_CAU_COC.toString();
            const deleteRadio = document.querySelector(`input[name="COC"][value="${deleteValue}"]`);
            if (deleteRadio) {
                deleteRadio.checked = true;
            }
        }

        const hotelID = Number(hotel.MA_KS);
        document.getElementById("updateButton").addEventListener("click", function() {
            updateHotel(hotelID);
        });
    } else {
        console.log('No hotel data found in localStorage');
    }
});

async function updateHotel(hotelID) {
    const TEN_KS = document.getElementById("TEN_KS").value.trim();
    const MO_TA = document.getElementById("MO_TA").value.trim();
    const SOSAO = document.getElementById("SOSAO").value.trim();
    const MA_VITRI = document.getElementById("MA_VITRI").value.trim();
    const TI_LE_COC = document.getElementById("TI_LE_COC").value.trim();
    const TRANGTHAI_KS = document.querySelector('input[name="gender"]:checked')?.value;
    const YEU_CAU_COC = document.querySelector('input[name="COC"]:checked')?.value;
    const QRTHANHTOAN = document.getElementById("QRTHANHTOAN").files[0];
    const HINHANH = document.getElementById("HINHANH").files[0];

    const formData = new FormData();
    formData.append('TEN_KS', TEN_KS);
    formData.append('MO_TA', MO_TA);
    formData.append('SOSAO', SOSAO);
    formData.append('MA_VITRI', MA_VITRI);
    formData.append('TI_LE_COC', TI_LE_COC);
    formData.append('TRANGTHAI_KS', TRANGTHAI_KS);
    formData.append('YEU_CAU_COC', YEU_CAU_COC);
    formData.append('QRTHANHTOAN', QRTHANHTOAN);
    formData.append('HINHANH', HINHANH);

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật thông tin khách sạn?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateHotel(hotelID, formData);
            Swal.fire('Cập nhật thông tin khách sạn thành công', '', 'success').then(() => {
                window.location.href = "adminHotel.html"; 
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            Swal.fire('Cập nhật thông tin khách sạn thất bại', 'Vui lòng thử lại sau.', 'error');
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