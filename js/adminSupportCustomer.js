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
    
    getChatAll();
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getChatAll(){
    try {
        const response = await apiGetSupportAll();
        const chatObj = response.map((chat) => new TINNHAN(
            chat.MA_TINNHAN,
            chat.MA_KS,
            chat.MA_ND,
            chat.NOIDUNG,
            chat.THOIGIAN,
            chat.SENDMESSAGE,
            chat.MA_ND_NGUOIDUNG
        ));
        renderChatAll(chatObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

// Gọi hàm với `userID` để biết ai là người gửi
async function getChatCustomer(userID, hotelID) {
    try {
        const response = await apiGetSupportCustomer(userID, hotelID);
        
        const chatObj = response.map((chat) => new TINNHAN(
            chat.MA_TINNHAN,
            chat.MA_KS,
            chat.MA_ND,
            chat.NOIDUNG,
            chat.THOIGIAN,
            chat.SENDMESSAGE,
            chat.MA_ND_NGUOIDUNG
        ));
        renderSupportCustomer(chatObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderChatAll(chats) {
    const html = chats.reduce((result, chat) => {
        const duongDanHinh = chat.MA_ND_NGUOIDUNG?.ANHDAIDIEN || 'default-avatar.jpg'; // Đảm bảo có ảnh mặc định nếu không có ảnh người dùng
        const formattedTime = formatTime(chat.THOIGIAN);

        return result + 
            ` 
            <a href="#" class="list-group-item list-group-item-action py-3" data-id="${chat.MA_ND}">
                <div class="d-flex align-items-center">
                    <img src="../img/${duongDanHinh}" class="rounded-circle mx-2" width="40" height="40">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">${chat.MA_ND_NGUOIDUNG.HOTEN}</h6>
                            <small class="text-muted">${formattedTime}</small>
                        </div>
                        <p class="mb-0 small text-truncate">${chat.NOIDUNG}</p>
                    </div>
                </div>
            </a>
        `;
    }, "");

    const chatsContainer = document.getElementById("chats");
    chatsContainer.innerHTML = html;

    const chatItems = chatsContainer.querySelectorAll('.list-group-item');
    
    // Lấy MA_KS từ token trong localStorage
    const localStorageToken = localStorage.getItem('localStorageToken');
    let maKs = null;

    if (localStorageToken) {
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));

        // Lấy vai trò người dùng (user role)
        const userRole = decodedToken?.data?.CHUCVU;

        // Dùng regex để lấy số sau "Partner" trong vai trò người dùng
        const partnerIdMatch = /Partner(\d+)/.exec(userRole);
        maKs = partnerIdMatch ? partnerIdMatch[1] : null; // Lấy số sau "Partner", nếu có

        console.log("MA_KS:", maKs); // In ra MA_KS để kiểm tra
    }

    // Xử lý khi lần đầu tiên load, tự động chọn item đầu tiên và gọi getChatCustomer với MA_KS lấy từ token
    if (chatItems.length > 0 && maKs) {
        chatItems[0].classList.add('active');
        const maNd = chatItems[0].getAttribute('data-id'); 
        getChatCustomer(maNd, maKs); // Gọi hàm với MA_ND và MA_KS lấy từ token
    }

    // Xử lý sự kiện click cho mỗi chat item
    chatItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
            
            // Làm nổi bật mục được chọn
            chatItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            // Lấy ID người dùng và gọi getChatCustomer với MA_KS từ token
            const maNd = item.getAttribute('data-id');
            getChatCustomer(maNd, maKs); // Gọi hàm với MA_ND và MA_KS
        });
    });
}




function formatTime(timeString) {
    const currentTime = new Date();
    const messageTime = new Date(timeString); 

    const diffInSeconds = Math.floor((currentTime - messageTime) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays}d`; 
    } else if (diffInHours > 0) {
        return `${diffInHours}h`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}m`; 
    } else {
        return `${diffInSeconds}s`; 
    }
}

function renderSupportCustomer(chatObj) {
    const chatContainer = document.getElementById("chatContainer"); 

    chatContainer.innerHTML = '';

    chatObj.forEach(chat => {
        const isHotelMessage = chat.SENDMESSAGE;  
        const messageTime = new Date(chat.THOIGIAN).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="message-bubble ${!isHotelMessage ? 'sent' : 'received'} mb-3">
                <div class="d-flex ${!isHotelMessage ? 'justify-content-end' : ''}">
                    ${isHotelMessage ? 
                        `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" class="rounded-circle mx-2" width="30" height="30">` : ''
                    }
                    <div class="${!isHotelMessage ? 'text-end' : ''}">
                        <div class="bg-${!isHotelMessage ? 'primary' : 'white'} ${!isHotelMessage ? 'text-white' : ''} rounded p-3 shadow-sm">
                            <p class="mb-0">${chat.NOIDUNG}</p>
                        </div>
                        <small class="text-muted">${messageTime} ${!isHotelMessage ? '<i class="bi bi-check2-all text-primary"></i>' : ''}</small>
                    </div>
                </div>
            </div>
        `;

        chatContainer.innerHTML += messageHTML;
    });
}






