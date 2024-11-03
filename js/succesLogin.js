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
        const userID = decodedToken && decodedToken.data && decodedToken.data.MA_ND;
        getUserID(userID); 
    }
});

async function getUserID(userID) {
    try {
        
        const user = await apiGetUserID(userID);
        renderInfoUser(user);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderInfoUser(user) {
    const HOTEN = document.getElementById("userName");
    if (HOTEN) {
        HOTEN.textContent = user && user.HOTEN !== undefined ? user.HOTEN : '0'; 
    }

    const avatarElement = document.getElementById("avarta");
    if (avatarElement) {
        const ANHDAIDIEN = user && user.ANHDAIDIEN !== undefined ? user.ANHDAIDIEN : 'noimg.png';
        avatarElement.src = `/img/${ANHDAIDIEN}`; 
    } else {
        console.error("Avatar element not found.");
    }
}



function logout() {
    localStorage.removeItem('localStorageToken');
    setTimeout(function() {
        window.location.href = "index.html";
    }, 500); 
}

document.getElementById("logout-link").addEventListener("click", function() {
    logout();
});