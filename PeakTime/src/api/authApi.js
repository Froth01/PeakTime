import axios from "axios";
import { useUserStore } from "../stores/UserStore";

// axios 객체 만들기
const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}/api/v1/auth`,
});

// 응답 인터셉터 추가하기 (로그인 화면으로 리다이렉트)
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("요청 응답 오류", error);
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        useUserStore.getState().userActions.setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default authApi;
