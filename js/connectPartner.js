document.addEventListener('DOMContentLoaded', async () => {
    await populateViTriOptions();
    const vitriData = localStorage.getItem('selectedViTri');
    const vitri = JSON.parse(vitriData);
    document.getElementById('MA_VITRI').value = vitri.MA_VITRI;
});


document.getElementById("hotelRegistrationForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form (không gửi form)

    // Lấy dữ liệu từ các trường trong form
    const HOTEN = document.getElementById("HOTEN").value;
    const EMAIL = document.getElementById("EMAIL").value;
    const SDT = document.getElementById("SDT").value;
    const TEN_KS = document.getElementById("TEN_KS").value;
    const DIACHI = document.getElementById("DIACHI").value;
    const MO_TA = document.getElementById("MO_TA").value;
    const MA_VITRI = document.getElementById("MA_VITRI").value;
    const SOSAO = document.getElementById("SOSAO").value;
    const GIAYPHEPKINHDOANH = document.getElementById("GIAYPHEPKINHDOANH").files[0];
    const HINHANH = document.getElementById("HINHANH").files;

    // Kiểm tra các trường bắt buộc
    if (!HOTEN || !EMAIL || !SDT || !TEN_KS || !DIACHI || !MO_TA || !SOSAO || !GIAYPHEPKINHDOANH || !MA_VITRI || HINHANH.length === 0) {
        Swal.fire({
            title: 'Thiếu thông tin',
            text: 'Vui lòng nhập đầy đủ các trường bắt buộc.',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
        return;  // Dừng hàm nếu thiếu thông tin bắt buộc
    }

    try {
        const formData = new FormData();
        formData.append('HOTEN', HOTEN);
        formData.append('EMAIL', EMAIL);
        formData.append('SDT', SDT);
        formData.append('TEN_KS', TEN_KS);
        formData.append('DIACHI', DIACHI);
        formData.append('MO_TA', MO_TA);
        formData.append('SOSAO', SOSAO);
        formData.append('MA_VITRI', MA_VITRI);
        formData.append('GIAYPHEPKINHDOANH', GIAYPHEPKINHDOANH); // Thêm giấy phép kinh doanh
        formData.append('HINHANH', HINHANH[0]); // Thêm ảnh

        // Gửi dữ liệu tới API tạo hồ sơ khách sạn
        const response = await apiCreateHoSo(formData);

        switch (response.data) {
            case "Bạn đã tạo hồ sơ khách sạn thành công!":
                Swal.fire({
                    title: 'Tạo hồ sơ thành công',
                    text: 'Hồ sơ khách sạn của bạn đã được tạo thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Sau khi người dùng nhấn "OK", đợi 3 giây rồi reload trang
                        setTimeout(() => {
                            window.location.reload(); // Tải lại trang sau 3 giây
                        }, 3000); // 3000ms = 3 giây
                    }
                });
                break;

            default:
                Swal.fire({
                    title: 'Lỗi không xác định',
                    text: 'Vui lòng thử lại sau.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: true,
                    allowEnterKey: true
                });
                break;
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Đã có lỗi xảy ra',
            text: 'Không thể hoàn thành yêu cầu của bạn. Vui lòng thử lại sau.',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: true,
            allowEnterKey: true
        });
    }
});

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn không cho form submit mặc định
    const email = document.getElementById('EMAIL1').value;
    const phone = document.getElementById('SDT1').value;

    try {
        // Gọi API với dữ liệu email và phone
        const response = await apiFindHoSo({ EMAIL: email, SDT: phone });

        // Xử lý dữ liệu trả về
        const hosoData = response.data;
        let hosoHtml = '';

        hosoData.forEach(item => {
            // Kiểm tra giá trị TRANGTHAI và gán class phù hợp
            let statusClass = '';
            if (item.TRANGTHAI === 'Chờ xác nhận') {
                statusClass = 'pending';
            } else if (item.TRANGTHAI === 'Xác nhận') {
                statusClass = 'confirmed';
            } else if (item.TRANGTHAI === 'Từ chối') {
                statusClass = 'cancelled';
            }

            hosoHtml += `
                <tr>
                    <td>#${item.MA_HS}</td>
                    <td>${item.TEN_KS}</td>
                    <td>${item.NGAYDANGKY}</td>
                    <td><span class="status-badge ${statusClass}">${item.TRANGTHAI}</span></td>
                </tr>
            `;
        });

        // Hiển thị kết quả vào phần #hoso
        document.getElementById('hoso').innerHTML = hosoHtml;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function populateViTriOptions() {
    try {
        // Gọi API để lấy dữ liệu các phòng
        const vitris = await apiGetAllDiaDiem();
        // Lấy phần tử select theo id
        const selectElement = document.getElementById("MA_VITRI");

        // Dọn dẹp các option cũ (nếu có)
        selectElement.innerHTML = "";
        
        // Tạo và thêm một option mặc định
        const defaultOption = document.createElement("option");
        defaultOption.text = "Chọn vị trí";
        defaultOption.value = "";
        defaultOption.disabled = true;  // Disable option này
        defaultOption.selected = true;  // Đảm bảo option mặc định được chọn
        selectElement.appendChild(defaultOption);


        // Duyệt qua dữ liệu các phòng và tạo option cho mỗi phòng
        vitris.data.forEach(vitri => {
            const option = document.createElement("option");
            option.text = vitri.TENVITRI;   // Hiển thị tên phòng
            option.value = vitri.MA_VITRI;  // Giá trị là mã phòng
            selectElement.appendChild(option);  // Thêm option vào select
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
    }
}