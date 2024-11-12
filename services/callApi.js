const URL = "http://localhost:8080";

async function apiGetCountry() {
    return await axios({
      method: "GET",
      url: `${URL}/api/local/get-country`,
    });
}
async function apiGetAllLocation() {
  try {
      const response = await axios({
          method: "GET",
          url: `${URL}/api/local/get-all-location`,
      });
      // Giả sử dữ liệu trả về là một mảng các giá trị cần thiết
      availableKeywords = response.data; // Cập nhật mảng keywords
  } catch (error) {
      console.error('Error fetching locations:', error);
  }
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

async function apiGetUserID(userID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/user/select-user/${userID}`,
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

async function apiApplyDiscount(discountID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/discount/apply-discount/${discountID}`,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);

    // Kiểm tra và trả về thông báo lỗi chi tiết từ API (nếu có)
    if (error.response) {
      // Nếu có lỗi từ server (status code != 2xx)
      throw new Error(error.response.data);
    } else if (error.request) {
      // Nếu không nhận được phản hồi từ server
      throw new Error("Không thể kết nối đến server.");
    } else {
      // Lỗi khác
      throw new Error("Có lỗi xảy ra trong quá trình xử lý mã giảm giá.");
    }
  }
}


async function apiSelectHotel(hotelID) {
  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/api/hotel/select-hotel/${hotelID}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiSelectRoom(roomID) {
  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/api/room/select-room/${roomID}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiSelectDiscount(discountID) {
  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/api/discount/select-discount/${discountID}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiSelectDiscountPartner(discountID) {
  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/api/discount/select-discount-partner/${discountID}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiSelectBooking(bookingID) {
  try {
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/select-booking/${bookingID}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}


async function apiUpdateUser(userID, user) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/user/update-user/${userID}`,
      data: user,
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

async function apiUpdateDiscountPartner(discountID, discount) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/discount/update-discount-partner/${discountID}`,
      data: discount,
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

async function apiUpdateBookingPartner(bookingID, formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/booking/update-booking-partner/${bookingID}`,
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

async function apiUpdateDiscount(discountID, formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/discount/update-discount/${discountID}`,
      data: formData,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
    throw error;
  }
}

async function apiUpdateRoom(roomID, formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/room/update-room-partner/${roomID}`,
      data: formData,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
    throw error;
  }
}

async function apiUpdateHotel(hotelID, formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/hotel/update-hotel/${hotelID}`,
      data: formData,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    throw error;
  }
}

async function apiCancelBooking(bookingID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/booking/cancel-booking-user/${bookingID}`,
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

async function apiDeleteDiscount(discountID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/discount/delete-discount/${discountID}`,
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

async function apiDeleteDiscountPartner(discountID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/discount/delete-discount-partner/${discountID}`,
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

async function apiDeleteRoomPartner(roomID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/room/delete-room-partner/${roomID}`,
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

async function apiDeleteRate(rateID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/rate/delete-rate/${rateID}`,
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

async function apiDeleteUser(userID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "DELETE",
      url: `${URL}/api/user/delete-user/${userID}`,
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

async function apiDeleteHotel(hotelID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/hotel/delete-hotel/${hotelID}`,
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

async function apiDenyHoso(hosoID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/hoso/deny-hoso/${hosoID}`,
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

async function apiAccessHoso(hosoID){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "PUT",
      url: `${URL}/api/hoso/access-hoso/${hosoID}`,
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

async function apiSearchHotel(name, numberOfGuests = 1, numberOfRooms = 1, NGAYDEN, NGAYDI) {
  try {
      const response = await axios({
          method: "GET",
          url: `${URL}/api/hotel/search-hotel/${name}`,
          params: {
              numberOfGuests,
              numberOfRooms,
              NGAYDEN,
              NGAYDI   
          }
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

async function apiGetDiscountUser() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/discount/get-discount-user`,
      headers: {
        token: localStorageToken,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiGetData() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/hotel/get-data`,
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

async function apiGetCountBooking() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/get-count-booking`,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data.monthlyCounts;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiGetCountBookingPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/get-count-money-partner`,
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

async function apiGetCountRate() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/rate/count-rate-star`,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data.danhGiaStars;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}


async function apiGetBookingUser() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/get-booking-user`,
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

async function apiSignUp(user) {
  return await axios({
    method: "POST",
    url: `${URL}/api/user/sign-up`,
    data: user
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

async function apiGetDataRoomDay(roomID, NGAYDEN, NGAYDI){
  return await axios({
    method: "GET",
    url: `${URL}/api/room/get-data-room-day/${roomID}`,
    params: {
      NGAYDEN,
      NGAYDI   
  }
  });
}

async function apiBookingRoomPay(booking) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/booking/booking-room-pay`,
      data: booking,
      headers: {
        token: localStorageToken,
      },
    });

    // Khi nhận được checkoutUrl, thực hiện chuyển hướng từ frontend
    if (response.data.checkoutUrl) {
      window.location.href = response.data.checkoutUrl;
    }

  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

async function apiCreateHotel(formData){
  try {
    const response = await axios({
      method: "POST",
      url: `${URL}/api/hotel/create-hotel`,
      data: formData
    });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiCreateHoSo(formData){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/hoso/create-hoso`,
      headers: {
        token: localStorageToken,
      },
      data: formData
    });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiCreateRate(formData) {
  try {
      const localStorageToken = localStorage.getItem("localStorageToken");
      const response = await axios({
          method: "POST",
          url: `${URL}/api/rate/create-rate`,
          headers: {
              token: localStorageToken,
          },
          data: formData
      });
      return response; // Return the entire response object
  } catch (error) {
      console.error("Error creating rate:", error);
      throw error; // Rethrow the error for handling in the calling function
  }
}



async function apiCreateDiscount(discountData) {
  try {
      const localStorageToken = localStorage.getItem("localStorageToken");
      const response = await axios({
          method: "POST",
          url: `${URL}/api/discount/create-discount`,
          headers: {
              token: localStorageToken,
          },
          data: discountData
      });
      return response.data; // Giả sử response.data chứa thông tin cần thiết
  } catch (error) {
      // Kiểm tra nếu có phản hồi từ server
      if (error.response) {
          // Trả về phản hồi từ server để xử lý trong createDiscount
          return error.response.data; 
      } else {
          console.error("Error fetching user data:", error);
          throw error; // Ném lỗi để xử lý bên ngoài nếu không có phản hồi
      }
  }
}


async function apiBookingRoom(booking) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/booking/booking-room`,
      data: booking,
      headers: {
        token: localStorageToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

//api cho partner

async function apiLoginPartner(user) {
  return await axios({
    method: "POST",
    url: `${URL}/api/user/login-partner`,
    data: user
  });
}

async function apiFindHoSo(hoso) {
  return await axios({
    method: "POST",
    url: `${URL}/api/hoso/find-hoso`,
    data: hoso
  });
}

async function apiGetRoomIdPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/room/get-room-partner`,
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

async function apiGetDataHoSo() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/hoso/get-data-hoso`,
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

async function apiGetRoomDayPartner(NGAYDEN, NGAYDI) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/room/get-data-room-day-partner`,
      headers: {
        token: localStorageToken,
      },
      params: {
        NGAYDEN,
        NGAYDI   
    }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiGetRoomAllPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/room/get-room-all-partner`,
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


async function apiGetDiscountPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/discount/get-discount-partner`,
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

async function apiCreateRoomPartner(formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/room/create-room-partner`,
      headers: {
        token: localStorageToken,
      },
      data: formData // Dữ liệu phòng sẽ được gửi qua body của yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

async function apiCreateDiscountPartner(formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/discount/create-discount-partner`,
      headers: {
        token: localStorageToken,
      },
      data: formData // Dữ liệu phòng sẽ được gửi qua body của yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

async function apiGetBookingRoomIdPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/get-booking-partner`,
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

async function apiGetBookingAll() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/booking/get-booking-all`,
      headers: {
        token: localStorageToken,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function apiCreateBookingRoomPartner(formData) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/booking/create-booking-partner`,
      headers: {
        token: localStorageToken,
      },
      data: formData // Dữ liệu phòng sẽ được gửi qua body của yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

async function apiGetReviewHotelPartner() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/review/hotel`,
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

async function apiGetSupportAll() {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/chat/get-support-all`,
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

async function apiGetSupportCustomer(userID, hotelID) {
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "GET",
      url: `${URL}/api/chat/get-support-customer/${userID}/${hotelID}`,
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

async function apiChatWithCustomer(userID, formData){
  try {
    const localStorageToken = localStorage.getItem("localStorageToken");
    const response = await axios({
      method: "POST",
      url: `${URL}/api/chat/send-support-customer/${userID}`,
      headers: {
        token: localStorageToken,
      },
      data: formData
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

