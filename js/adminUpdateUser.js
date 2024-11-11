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

    const accountData = localStorage.getItem('selectedAccount');

    if (accountData) {
        const account = JSON.parse(accountData);

        document.getElementById('email').value = (account.EMAIL && account.EMAIL !== '0') ? account.EMAIL : '';
        document.getElementById('phone').value = (account.SDT && account.SDT !== '0') ? account.SDT : '';
        document.getElementById('hoTen').value = account.HOTEN || '';
        document.getElementById('matKhau').value = '';
        document.getElementById('CHUCVU').value = account.CHUCVU || '';
        if (account.NGAYSINH) {
            const [year, month, day] = account.NGAYSINH.split('-');
            document.getElementById('day').value = parseInt(day, 10) || '';
            document.getElementById('month').value = month || '';
            document.getElementById('year').value = year || '';
        }

        if (account.GIOITINH) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${account.GIOITINH}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
            }
        }

        const userID = Number(account.MA_ND);
        document.getElementById("updateButton").addEventListener("click", function() {
            updateUser(userID);
        });

    } else {
        console.log('No account data found in localStorage');
    }
});

async function updateUser(userID) {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const matKhau = document.getElementById("matKhau").value.trim();
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const anhDaiDien = document.getElementById("anh_dai_dien").files[0];
    const CHUCVU = document.getElementById("CHUCVU").value.trim();
    
    const dob = new Date(`${year}-${month}-${day}`);

    const formData = new FormData();
    formData.append('EMAIL', email);
    formData.append('SDT', phone);
    formData.append('HOTEN', hoTen);
    formData.append('NGAYSINH', dob.toISOString());
    formData.append('GIOITINH', gender);
    formData.append('CHUCVU', CHUCVU);
    formData.append('ANHDAIDIEN', anhDaiDien || 'noimg.png');
    
    if (matKhau) {
        formData.append('MATKHAU', matKhau);
    }

    const willUpdate = await Swal.fire({
        title: "Bạn có muốn cập nhật tài khoản?",
        text: "Nhấn OK để xác nhận cập nhật.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
    });

    if (willUpdate.isConfirmed) {
        try {
            await apiUpdateUser(userID, formData);
            Swal.fire('Cập nhật tài khoản thành công', '', 'success').then(() => {
                window.location.href = "adminUser.html";
            });
        } catch (error) {
            Swal.fire('Cập nhật tài khoản thất bại', '', 'error');
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