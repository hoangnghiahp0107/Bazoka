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
    if (userID) {
        getReviewHotelPartner();
    } else {
        console.log("UserID không tồn tại trong localStorage");
    }
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                handleSearch(event);
            }
        });
    }
});

function getElement(selector) {
    return document.querySelector(selector);
}

//đánh giá khách sạn theo phòng của partner
async function getReviewHotelPartner(){
    try {
        const response = await apiGetReviewHotelPartner();
        const reviewObj =  response.map((review) => new DANHGIA(
            review.MA_DG,
            review.MA_KS,
            review.MA_ND,
            review.SO_SAO,
            review.BINH_LUAN,
            review.NGAY_DG,
            review.MA_ND_NGUOIDUNG
        ));
        renderReviewPartner(reviewObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
  }
  
  function renderReviewPartner(reviews) {
  const html = reviews.reduce((result, review, index) => {
      return (
          result +
          ` 
          <tr>
              <td>${index + 1}</td>
              <td>${review.MA_ND_NGUOIDUNG.HOTEN}</td>
              <td>${review.MA_ND_NGUOIDUNG.SDT}</td>
              <td>${review.SO_SAO}</td>
              <td>${review.BINH_LUAN}</td>
              <td>${review.NGAY_DG}</td>
          </tr>
      `
      );
  }, "");
  document.getElementById("rates").innerHTML = html;
  }