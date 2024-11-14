let messageInterval; // Biến dùng để lưu interval của polling tin nhắn

// Gửi tin nhắn từ người dùng
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        const chatContainer = document.getElementById('chatContainer');
        const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Tạo HTML cho tin nhắn gửi
        const messageHTML = `
            <div class="chat-messages">
                <div class="message-bubble sent mb-3">
                    <div class="d-flex justify-content-end">
                        <div class="text-end">
                            <div class="bg-primary text-white rounded p-3 shadow-sm">
                                <p class="mb-0">${message}</p>
                            </div>
                            <small class="text-muted">${messageTime} <i class="bi bi-check2-all text-primary"></i></small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Thêm tin nhắn vào container
        chatContainer.innerHTML += messageHTML;

        // Cuộn đến cuối container để hiển thị tin nhắn mới nhất
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Gửi tin nhắn qua API (có thể cần thêm thông tin như MA_KS và MA_ND)
        const formData = {
            NOIDUNG: message
        };
        apiChatWithCustomer(formData); // Gửi tin nhắn tới API

        // Xóa nội dung input sau khi gửi
        messageInput.value = '';
    }
}

// Lắng nghe sự kiện nhấn Enter để gửi tin nhắn
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Ngăn chặn reload trang khi nhấn Enter
        sendMessage();
    }
});

// DOMContentLoaded để xác minh token và tải dữ liệu
document.addEventListener("DOMContentLoaded", function () {
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
        window.location.href = "/layouts/index.html";
        return;
    }

    // Tải danh sách cuộc trò chuyện
    getChatAll();
});

// Tải tất cả các tin nhắn từ API (giống như loadChatMessages)
async function getChatAll() {
    try {
        // Lấy danh sách các cuộc trò chuyện từ API
        const response = await apiGetSupportAll();

        // Chuyển dữ liệu thành các đối tượng chat
        const chatObj = response.map((chat) => new TINNHAN(
            chat.MA_TINNHAN,
            chat.MA_KS,
            chat.MA_ND,
            chat.NOIDUNG,
            chat.THOIGIAN,
            chat.SENDMESSAGE,
            chat.MA_ND_NGUOIDUNG
        ));

        // Render lại tất cả các cuộc trò chuyện
        renderChatAll(chatObj);

        // Lấy thông tin từ localStorage về MA_KS (Hotel ID)
        const localStorageToken = localStorage.getItem('localStorageToken');
        let maKs = null;

        if (localStorageToken) {
            const base64Url = localStorageToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(atob(base64));

            const userRole = decodedToken?.data?.CHUCVU;
            const partnerIdMatch = /Partner(\d+)/.exec(userRole);
            maKs = partnerIdMatch ? partnerIdMatch[1] : null;
        }

        // Kiểm tra nếu đã có userID trong localStorage
        const userID = localStorage.getItem('userID') || null;

        // Nếu có, tự động chọn cuộc trò chuyện đầu tiên và bắt đầu tải tin nhắn cho cuộc trò chuyện đó
        if (userID && maKs) {
            loadChatMessages(userID, maKs);  // Tải tin nhắn của cuộc trò chuyện
            startMessagePolling(userID, maKs); // Bắt đầu polling tin nhắn mới
        }

    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

// Render tất cả các cuộc trò chuyện và gọi đến loadChatMessages khi chọn cuộc trò chuyện
function renderChatAll(chats) {
    const html = chats.reduce((result, chat) => {
        const duongDanHinh = chat.MA_ND_NGUOIDUNG?.ANHDAIDIEN || 'default-avatar.jpg';
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
    chatsContainer.innerHTML = html; // Render danh sách cuộc trò chuyện

    const chatItems = chatsContainer.querySelectorAll('.list-group-item');

    // Lấy thông tin từ localStorage về MA_KS
    const localStorageToken = localStorage.getItem('localStorageToken');
    let maKs = null;

    if (localStorageToken) {
        const base64Url = localStorageToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));

        const userRole = decodedToken?.data?.CHUCVU;
        const partnerIdMatch = /Partner(\d+)/.exec(userRole);
        maKs = partnerIdMatch ? partnerIdMatch[1] : null;
    }

    // Kiểm tra nếu đã có userID trong localStorage hoặc mã hóa thông qua token
    const userID = localStorage.getItem('userID') || null;

    // Xử lý khi lần đầu tiên load, tự động chọn item đầu tiên và gọi loadChatMessages với MA_KS lấy từ token
    if (chatItems.length > 0 && maKs) {
        // Làm nổi bật cuộc trò chuyện đầu tiên
        chatItems[0].classList.add('active');
        const maNd = chatItems[0].getAttribute('data-id');
        localStorage.setItem('userID', maNd); // Lưu userID vào localStorage
        loadChatMessages(maNd, maKs); // Gọi hàm tải tin nhắn cho cuộc trò chuyện đã chọn
        startMessagePolling(maNd, maKs); // Bắt đầu polling tin nhắn mới cho cuộc trò chuyện
    }

    // Xử lý sự kiện click cho mỗi chat item (cuộc trò chuyện)
    chatItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

            // Làm nổi bật mục được chọn
            chatItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            // Lấy ID người dùng (MA_ND) từ thuộc tính data-id
            const maNd = item.getAttribute('data-id');
            localStorage.setItem('userID', maNd); // Lưu userID khi chọn cuộc trò chuyện
            loadChatMessages(maNd, maKs); // Gọi hàm tải tin nhắn với MA_ND và MA_KS
            startMessagePolling(maNd, maKs); // Bắt đầu polling khi chọn cuộc trò chuyện
        });
    });
}



// Định dạng thời gian tin nhắn
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

// Tải tất cả tin nhắn cho một cuộc trò chuyện (giống như loadChatMessages)
async function loadChatMessages(userID, hotelID) {
    try {
        // Gửi request tới API để lấy tin nhắn của cuộc trò chuyện
        const response = await apiGetSupportCustomer(userID, hotelID);

        const chatMessages = response.map((chat) => {
            return {
                content: chat.NOIDUNG,
                sender: chat.SENDMESSAGE,
                time: chat.THOIGIAN
            };
        });

        const chatContainer = document.getElementById('chatContainer');
        
        // Không xóa chat cũ mà chỉ thêm tin nhắn mới vào
        chatMessages.forEach(chat => {
            const isHotelMessage = chat.sender;  // Nếu là tin nhắn của khách sạn
            const messageTime = new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const messageHTML = `
                <div class="chat-messages">
                    <div class="message-bubble ${!isHotelMessage ? 'sent' : 'received'} mb-3">
                        <div class="d-flex ${!isHotelMessage ? 'justify-content-end' : ''}">
                            ${isHotelMessage ? 
                                `<img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" class="rounded-circle mx-2" width="30" height="30">` : ''
                            }
                            <div class="${!isHotelMessage ? 'text-end' : ''}">
                                <div class="bg-${!isHotelMessage ? 'primary' : 'white'} ${!isHotelMessage ? 'text-white' : ''} rounded p-3 shadow-sm">
                                    <p class="mb-0">${chat.content}</p>
                                </div>
                                <small class="text-muted">${messageTime} ${!isHotelMessage ? '<i class="bi bi-check2-all text-primary"></i>' : ''}</small>
                            </div>
                        </div>
                    </div>            
                </div>
            `;

            chatContainer.innerHTML += messageHTML; // Thêm tin nhắn vào container
        });

        chatContainer.scrollTop = chatContainer.scrollHeight; // Cuộn đến cuối container để hiển thị tin nhắn mới nhất

    } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
    }
}

// Bắt đầu polling tin nhắn mới từ API
function startMessagePolling(userID, MA_KS) {
    if (messageInterval) {
        clearInterval(messageInterval); // Hủy interval cũ nếu có
    }

    // Cập nhật tin nhắn mỗi giây
    messageInterval = setInterval(async () => {
        await loadChatMessages(userID, MA_KS); // Tải tin nhắn mới
    }, 1000); // Thực hiện mỗi giây
}

// Dừng polling
function stopMessagePolling() {
    if (messageInterval) {
        clearInterval(messageInterval); // Dừng polling
        messageInterval = null;
    }
}