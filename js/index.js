document.addEventListener("DOMContentLoaded", function () {
    showSpinner(); 
    Promise.all([getCountry(), getProvince()]).then(() => {
        hideSpinner();x
    });
});

function showSpinner() {
    getElement("#loading-spinner").classList.remove("hidden");
}

function hideSpinner() {
    getElement("#loading-spinner").classList.add("hidden");
}

function getElement(selector) {
    return document.querySelector(selector);
}

async function getCountry() {    
    try {
        const response = await apiGetCountry();
        const countrys = response.data; 
        const countryObj = countrys.map((country) => new QUOCGIA(
            country.MA_QUOCGIA,
            country.TEN_QUOCGIA,
            country.HINHANH
        ));
        renderCountry(countryObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

async function getProvince() {    
    try {
        const response = await apiGetProvince();
        const provinces = response.data; 
        const provinceObj = provinces.map((province) => new TINHTHANH(
            province.MA_TINHTHANH,
            province.TEN_TINHTHANH,
            province.MA_QUOCGIA,
            province.HINHANH,
            province.MA_QUOCGIA_QUOCGIum
        ));
        renderProvince(provinceObj);
    } catch (error) {
        console.log("Lỗi từ máy chủ", error);
    }
}

function renderCountry(countrys) {
    const html = countrys.reduce((result, country) => {
        const numberOfGuests = document.getElementById('guests').value;
        const numberOfRooms = document.getElementById('rooms').value;
        const checkIn = document.getElementById('arrival').value;
        const checkOut = document.getElementById('departure').value; 
        localStorage.setItem('numberOfGuests', numberOfGuests);
        localStorage.setItem('numberOfRooms', numberOfRooms);
        localStorage.setItem('checkIn', checkIn);
        localStorage.setItem('checkOut', checkOut);
        const duongDanHinh = country.HINHANH;
        return (
            result +
            ` 
                <div class="col">
                    <a href="/layouts/room.html?name=${encodeURIComponent(country.TEN_QUOCGIA)}&numberOfGuests=${encodeURIComponent(numberOfGuests)}&numberOfRooms=${encodeURIComponent(numberOfRooms)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}" class="country-link" data-name="${country.TEN_QUOCGIA}">
                        <div class="card text-white">
                        <img src="/img/${duongDanHinh}" loading="lazy" class="card-img" alt="...">
                        <div class="card-img-overlay">
                            <h5 class="card-title mt-3 fw-bold">${country.TEN_QUOCGIA}</h5>
                            <p class="card-text"><small>16,763 accommodations</small></p>
                        </div>
                    </div>         
                    </a>      
                </div>
          `
        );
    }, "");
    document.getElementById("country").innerHTML = html;
    document.querySelectorAll('.country-link').forEach(link => {
        link.addEventListener('click', (event) => {
            // Lưu trữ thông tin vào localStorage
            localStorage.setItem('name', event.currentTarget.dataset.name);        
            localStorage.setItem('numberOfGuests', numberOfGuests);
            localStorage.setItem('numberOfRooms', numberOfRooms);
            localStorage.setItem('checkIn', checkIn);
            localStorage.setItem('checkOut', checkOut);    
        });
    });
}

function renderProvince(provinces) {
    const html = provinces.reduce((result, province) => {
        const numberOfGuests = document.getElementById('guests').value;
        const numberOfRooms = document.getElementById('rooms').value;
        const checkIn = document.getElementById('arrival').value;
        const checkOut = document.getElementById('departure').value; 
        localStorage.setItem('numberOfGuests', numberOfGuests);
        localStorage.setItem('numberOfRooms', numberOfRooms);
        localStorage.setItem('checkIn', checkIn);
        localStorage.setItem('checkOut', checkOut);
        const duongDanHinh = province.HINHANH;
        return (
            result +
            ` 
                <div class="col">
                    <a href="/layouts/room.html?name=${encodeURIComponent(province.TEN_TINHTHANH)}&numberOfGuests=${encodeURIComponent(numberOfGuests)}&numberOfRooms=${encodeURIComponent(numberOfRooms)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}" class="province-link" data-name="${province.TEN_TINHTHANH}">
                        <div class="card text-white">
                            <img src="/img/${duongDanHinh}" loading="lazy" class="card-province object-fit-cover" alt="...">
                            <div class="card-img-overlay d-flex justify-content-end align-items-lg-start flex-column">
                                <h6 class="card-title">${province.TEN_TINHTHANH}</h6>
                                <p class="card-text"><small>${province.MA_QUOCGIA_QUOCGIum.TEN_QUOCGIA}</small></p>
                            </div>
                        </div>
                    </a>
                  </div>
          `
        );
        
    }, "");
    document.getElementById("province").innerHTML = html;
    document.querySelectorAll('.province-link').forEach(link => {
        link.addEventListener('click', (event) => {
            // Lưu trữ thông tin vào localStorage
            localStorage.setItem('name', event.currentTarget.dataset.name);
        });
    });
}