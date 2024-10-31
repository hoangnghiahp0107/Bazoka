document.addEventListener("DOMContentLoaded", function () {
    getDiscount();
});

function getElement(selector) {
    return document.querySelector(selector);
}

async function getDiscount() {
    try {
        const response = await apiGetDiscount();
        const discounts = response.data; 
        const discountObj = discounts.map((discount) => new MAGIAMGIA(
            discount.MA_MGG,
            discount.MA_GIAMGIA,
            discount.PHANTRAM,
            discount.NGAYBATDAU,
            discount.NGAYKETTHUC,
            discount.DIEU_KIEN
        ));
        renderDiscounts(discountObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderDiscounts(discounts) {
    const html = discounts.reduce((result, discount) => {
        return (
            result +
            `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 discount-card">
                        <img src="/img/giamgia1.jpg" class="card-img-top" alt="">
                        <div class="card-body">
                            <h5 class="card-title">${discount.MA_MGG}</h5>
                            <p class="card-text">${discount.DIEU_KIEN} giảm ${discount.PHANTRAM}%</p>
                            <p class="card-text"><small class="text-muted">Ngày hết hạn: ${discount.NGAYKETTHUC}</small></p>
                            <button class="btn btn-primary copy-btn" data-code="${discount.MA_MGG}">Copy Code</button>
                        </div>
                    </div>
                </div>
            `
        );
    }, "");
    document.getElementById("discountCodesContainer").innerHTML = html;

    // Gán sự kiện click cho các nút sau khi đã render
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy Code';
                }, 2000);
            });
        });
    });
}
