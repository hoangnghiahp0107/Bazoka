function getElement(selector) {
    return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    signInForm.addEventListener("submit", function(event) {
      event.preventDefault();
      SignIn();
    });
})

async function SignIn() {
    
    const taiKhoan = getElement("#EmailOrPhone").value;
    const matKhau = getElement("#Password").value;
    function isEmail(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    }
  
    const isTaiKhoanEmail = isEmail(taiKhoan);
    try {
      const response = await apiLoginAdmin({
        SDT_ND: isTaiKhoanEmail ? null : taiKhoan,
        EMAIL: isTaiKhoanEmail ? taiKhoan : null,
        MATKHAU: matKhau,
      });
  
      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem("localStorageToken", token);
          Swal.fire('Đăng nhập thành công', '', 'success').then(() => {
          window.location.href = "../layouts/adminThongKe.html";
        });
      } else if (response.status === 400) {
        Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
      } else {
        Swal.fire('Lỗi không xác định', '', 'error');
      }
    } catch (error) {
      Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
      console.error(error);
    }
}


