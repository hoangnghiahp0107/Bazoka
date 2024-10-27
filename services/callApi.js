const URL = "http://localhost:8080";

async function apiGetCountry() {
    return await axios({
      method: "GET",
      url: `${URL}/api/local/get-country`,
    });
}

async function apiGetProvince(countryID) {
    return await axios({
      method: "GET",
      url: `${URL}/api/local/get-province/${countryID}`,
    });
}

async function apiGetHotel() {
  return await axios({
    method: "GET",
    url: `${URL}/api/hotel/get-hotel`,
  });
}

async function apiGetRoomLocal(localID) {
  return await axios({
    method: "GET",
    url: `${URL}/api/hotel/get-hotel-local/${localID}`,
  });
}

async function apiGetRoomCountry(countryID) {
  return await axios({
    method: "GET",
    url: `${URL}/api/hotel/get-hotel-country/${countryID}`,
  });
}

async function apiGetRoomID(roomID) {
  return await axios({
    method: "GET",
    url: `${URL}/api/hotel/get-hotel-id/${roomID}`,
  });
}

async function apiGetRateID(roomID) {
  return await axios({
    method: "GET",
    url: `${URL}/api/rate/get-rate-id/${roomID}`,
  });
}

async function apiGetConvenientID(roomID) {
  return await axios({
    method: "GET",
    url: `${URL}/api/room/get-convenient/${roomID}`,
  });
}

async function apiSearchHotel(name) {
  try {
      const response = await axios({
          method: "GET",
          url: `${URL}/api/hotel/search-hotel/${name}`
      });
      return response;
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
  }
}

async function apiGetUsers() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/user/get-user-all`,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiCreateReviews(formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/reviews/create-review`,
      data: formData,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiGetDiscount() {
  return await axios({
    method: "GET",
    url: `${URL}/api/discount/get-discount`,
  });
}

async function apiLoginAdmin(user) {
  return await axios({
    method: "POST",
    url: `${URL}/api/user/login-admin`,
    data: user
  });
}

async function apiLoginUser(user) {
  return await axios({
    method: "POST",
    url: `${URL}/api/user/login-user`,
    data: user
  });
}

async function apiGetPriceDiscount(roomID){
  return await axios({
    method: "GET",
    url: `${URL}/api/room/get-price-discount/${roomID}`,
  });
}

async function apiGetRateSummary(roomID){
  return await axios({
    method: "GET",
    url: `${URL}/api/rate/get-avg-rate/${roomID}`,
  });
}

async function apiGetDataRoom(roomID){
  return await axios({
    method: "GET",
    url: `${URL}/api/room/get-data-room/${roomID}`,
  });
}

