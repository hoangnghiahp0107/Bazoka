document.addEventListener('DOMContentLoaded', function() {
    const localStorageToken = localStorage.getItem('localStorageToken');
    
    if (localStorageToken) {
        // Ẩn nút Đăng nhập và Đăng ký
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('registerButton').style.display = 'none';
        
        // Hiển thị thông tin người dùng
        document.getElementById('info-user').style.display = 'block';
        
        // Giải mã token và lấy tên người dùng
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));
        const userName = decodedToken?.data?.HOTEN ? decodeURIComponent(escape(decodedToken.data.HOTEN)) : '';
        const anhDaiDien = decodedToken?.data?.ANHDAIDIEN ? decodeURIComponent(escape(decodedToken.data.ANHDAIDIEN)) : '';
        document.getElementById('userName').textContent = userName;
        const avatarElement = document.getElementById('avarta');
        avatarElement.src = `/img/${anhDaiDien}`; // Đường dẫn hoàn chỉnh
    }
});

function logout() {
    localStorage.removeItem('localStorageToken');
    setTimeout(function() {
        window.location.href = "index.html";
    }, 500); 
}

document.getElementById("logout-link").addEventListener("click", function() {
    logout();
});