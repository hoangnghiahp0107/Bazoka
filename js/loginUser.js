function getElement(selector) {
    return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("signUpForm");
    signUpForm.addEventListener("submit", function(event) {
      event.preventDefault();
      SignUp();
    });
    const signInForm = document.getElementById("signInForm");
    signInForm.addEventListener("submit", function(event) {
      event.preventDefault();
      SignIn();
    });
})

async function SignUp() {
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const hoTen = document.getElementById("ho_ten").value;
  const birth = document.getElementById("birth").value;
  const gioiTinh = document.getElementById("gioi_tinh").value;
  const matKhau = document.getElementById("mat_khau").value;
  const nhapLaiMK = document.getElementById("nhap_lai_mk").value;

  // Check if passwords match
  if (matKhau !== nhapLaiMK) {
      Swal.fire('Mật khẩu và nhập lại mật khẩu không khớp', '', 'error');
      return;
  }

  // Check if fields are empty
  if (!email || !phone || !hoTen || !matKhau || !nhapLaiMK || !birth   ) {
      Swal.fire('Vui lòng điền đầy đủ thông tin', '', 'error');
      return;
  }

  try {
      // Send the sign-up request
      const response = await apiSignUp({
          EMAIL: email,
          SDT:phone,
          HOTEN: hoTen,
          MATKHAU: matKhau,
          NGAYSINH: birth,
          GIOITINH: gioiTinh
      });

      if (response.status === 200) {
          const token = response.data;
          localStorage.setItem("localStorageToken", token);
          Swal.fire('Đăng ký thành công', '', 'success').then(() => {
              window.location.href = "../layouts/loginUser.html";
          });
      } else if (response.status === 400) {
          Swal.fire('Tài khoản hoặc mật khẩu không đúng', '', 'error');
      } else {
          Swal.fire('Lỗi không xác định', '', 'error');
      }
  } catch (error) {
      Swal.fire('Lỗi kết nối hoặc tài khoản đã tồn tại', '', 'error');
      console.error(error);
  }
}

async function SignIn() {
    const taiKhoan = getElement("#EmailOrPhone").value;
    const matKhau = getElement("#Password").value;
    function isEmail(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    }
  
    const isTaiKhoanEmail = isEmail(taiKhoan);
    try {
      const response = await apiLoginUser({
        SDT: isTaiKhoanEmail ? null : taiKhoan,
        EMAIL: isTaiKhoanEmail ? taiKhoan : null,
        MATKHAU: matKhau,
      });
  
      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem("localStorageToken", token);
          Swal.fire('Đăng nhập thành công', '', 'success').then(() => {
          window.location.href = "../layouts/index.html";
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