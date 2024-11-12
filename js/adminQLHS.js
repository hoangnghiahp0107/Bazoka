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
        // Lấy tên tệp và phần mở rộng
        const fileName = hoso.GIAYPHEPKINHDOANH;

        // Rút gọn tên tệp nếu nó dài hơn 10 ký tự
        const shortenedFileName = fileName.length > 10 ? fileName.slice(0, 10) + '...' : fileName;

        const fileExtension = fileName.split('.').pop().toLowerCase();  // Lấy phần mở rộng tệp
        
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

        return (
            result +
            ` 
            <tr>
                <td>${hoso.MA_HS}</td>
                <td>${hoso.HOTEN}</td>
                <td>${hoso.EMAIL}</td>
                <td>${hoso.SDT}</td>
                <td>${hoso.TEN_KS}</td>
                <td>${hoso.DIACHI}</td>
                <td>${hoso.MO_TA}</td>
                <td>${hoso.SOSAO}</td>
                <td><img src="/img/${hoso.HINHANH}" alt="Hình ảnh khách sạn" width="50" height="50"></td>
                <td>
                    <a href="/download/${fileName}" download>
                        ${shortenedFileName} (${fileType})
                    </a>
                </td>
                <td>${hoso.TRANGTHAI}</td>
                <td>${hoso.NGAYDANGKY}</td>
            </tr>
        `)
    }, "");
    
    document.getElementById("hosos").innerHTML = html;
}


