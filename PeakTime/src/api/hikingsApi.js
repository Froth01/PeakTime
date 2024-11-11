import axios from "axios";
import { useUserStore } from "../stores/UserStore.js";

// zustand 스토어에서 상태 가져오기
const getUserState = useUserStore.getState;

// axios 객체 만들기
const hikingsApi = axios.create({
  baseURL: "",
});

// ipcRenderer로 값을 받아오기
export function setBaseUrl() {
  try {
    if (typeof window !== "undefined" && window.electronAPI) {
      // 렌더러 프로세스에서 Electron API 사용
      window.electronAPI.getBackUrl().then((url) => {
        hikingsApi.defaults.baseURL = `${url}/api/v1/hikings`; // API URL 설정
      });
    } else {
      // Node.js 환경에서 실행
      hikingsApi.defaults.baseURL = `${process.env.BACK_URL}/api/v1/hikings`; // 환경 변수 사용
    }
  } catch (error) {
    console.error("Error in setBaseUrl:", error);
  }
}

// axios 객체에 요청 인터셉터 추가하기 (헤더에 JWT Token 삽입하기) (일렉트론 환경일 경우 적용하지 않음)
hikingsApi.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const { user } = getUserState();
      const accessToken = user?.accessToken;

      if (accessToken && accessToken !== "") {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios 객체에 응답 인터셉터 추가하기 (로그인 화면으로 보내기)
hikingsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    //권한 오류 발생 시
    console.error("요청 응답 오류", error);
    const status = error.response.status;

    // 사용자 인증이 실패한 경우, 로그인 페이지로 리다이렉트
    if (status === 401) {
      console.log("사용자 인증이 실패했어요");
      // store.dispatch(setAccessToken(""));
      useUserStore.getState().userActions.setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // 요청이 만들어졌지만 서버로부터 응답이 없을 때, error.request에 요청 정보가 들어간다.
    else if (error.request) {
      console.error("No response received from the server:", error.request);
    }
    // 그 외의 에러 메시지를 처리
    else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default hikingsApi;