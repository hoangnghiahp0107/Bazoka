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

    if (userRole !== "Admin") {
        window.location.href = "/layouts/index.html";
        return;
    }
    getDataHoSo();
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getDataHoSo(){
    try {
        const response = await apiGetDataHoSo();
        const hosoObj =  response.map((hoso) => new HOSO(
            hoso.MA_HS,              
            hoso.HOTEN,             
            hoso.EMAIL,               
            hoso.SDT,                
            hoso.TEN_KS,              
            hoso.DIACHI,    
            hoso.MO_TA,             
            hoso.SOSAO,               
            hoso.HINHANH,           
            hoso.GIAYPHEPKINHDOANH, 
            hoso.TRANGTHAI,           
            hoso.NGAYDANGKY           
        ));
        console.log(hosoObj)
        renderDataHoso(hosoObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderDataHoso(hosos) {
    const html = hosos.reduce((result, hoso) => {
        // Rút gọn các trường văn bản
        const shortenedName = hoso.HOTEN.length > 15 ? hoso.HOTEN.slice(0, 15) + '...' : hoso.HOTEN;
        const shortenedEmail = hoso.EMAIL.length > 15 ? hoso.EMAIL.slice(0, 15) + '...' : hoso.EMAIL;
        const shortenedAddress = hoso.DIACHI.length > 20 ? hoso.DIACHI.slice(0, 20) + '...' : hoso.DIACHI;
        const shortenedDescription = hoso.MO_TA.length > 20 ? hoso.MO_TA.slice(0, 20) + '...' : hoso.MO_TA;
        
        // Rút gọn tên tệp nếu cần
        const fileName = hoso.GIAYPHEPKINHDOANH;
        const shortenedFileName = fileName.length > 8 ? fileName.slice(0, 8) + '...' : fileName;

        // Lấy phần mở rộng tệp
        const fileExtension = fileName.split('.').pop().toLowerCase();

        // Xác định loại tệp (ví dụ: PDF, DOCX, v.v.)
        let fileType = '';
        if (fileExtension === 'pdf') {
            fileType = 'PDF';
        } else if (fileExtension === 'docx') {
            fileType = 'Word Document';
        } else if (fileExtension === 'jpg' || fileExtension === 'png') {
            fileType = 'Image';
        } else {
            fileType = 'Unknown file type';
        }

        const actionButtons = hoso.TRANGTHAI === 'Chờ xác nhận' ? `
            <button class="btn btn-outline-success mx-2" onclick="XacNhan('${hoso.MA_HS}');">
                <i class="fa-regular fa-circle-check"></i>
            </button>
            <button class="btn btn-outline-danger" onclick="TuChoi('${hoso.MA_HS}')">
                <i class="fa-regular fa-circle-xmark"></i>
            </button>
        ` : ''; 

        return result + `
            <tr>
                <td>${hoso.MA_HS}</td>
                <td>${shortenedName}</td>
                <td>${shortenedEmail}</td>
                <td>${hoso.SDT}</td>
                <td>${hoso.TEN_KS}</td>
                <td>${shortenedAddress}</td>
                <td>${shortenedDescription}</td>
                <td>${hoso.SOSAO}</td>
                <td>
                    <img src="/img/${hoso.HINHANH}" alt="Hình ảnh khách sạn" width="50" height="50" style="cursor: pointer;" onclick="openImage('/img/${hoso.HINHANH}')">
                </td>
                <td>
                    <a href="/download/${fileName}" download>
                        ${shortenedFileName} (${fileType})
                    </a>
                </td>
                <td>${hoso.TRANGTHAI}</td>
                <td>${hoso.NGAYDANGKY}</td>
                <td>
                    <div class="d-flex justify-content-center align-items-center">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `;
    }, "");

    document.getElementById("hosos").innerHTML = html;
}

// Hàm mở hình ảnh trong tab mới
function openImage(imagePath) {
    window.open(imagePath, '_blank');
}

// Hàm xác nhận hồ sơ (gọi API `apiAccessHoso`)
async function XacNhan(hosoID) {
    try {
        const respone = await apiAccessHoso(hosoID);
        if (respone === "Bạn đã cập nhật trạng thái hồ sơ thành công") {
            alert("Hồ sơ đã được xác nhận thành công!");
            // Sau khi xác nhận thành công, bạn có thể gọi lại `getDataHoSo()` để làm mới dữ liệu, nếu cần
            getDataHoSo();
        } else {
            alert("Có lỗi xảy ra khi xác nhận hồ sơ!");
        }
    } catch (error) {
        console.error("Lỗi khi xác nhận hồ sơ:", error);
        alert("Có lỗi xảy ra khi xác nhận hồ sơ!");
    }
}

// Hàm từ chối hồ sơ (gọi API `apiDenyHoso`)
async function TuChoi(hosoID) {
    try {
        const respone = await apiDenyHoso(hosoID);
        if (respone === "Bạn đã cập nhật trạng thái hồ sơ thành công") {
            alert("Hồ sơ đã bị từ chối!");
            // Sau khi từ chối thành công, bạn có thể gọi lại `getDataHoSo()` để làm mới dữ liệu, nếu cần
            getDataHoSo();
        } else {
            alert("Có lỗi xảy ra khi từ chối hồ sơ!");
        }
    } catch (error) {
        console.error("Lỗi khi từ chối hồ sơ:", error);
        alert("Có lỗi xảy ra khi từ chối hồ sơ!");
    }
}


