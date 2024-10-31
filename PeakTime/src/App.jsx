import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useBackgroundStore } from "./stores/BackgroundStore"; // 배경 지정을 위한 스토어
import { useUserStore } from "./stores/UserStore"; // 유저정보 스토어
import PrivateRoute from "./PrivateRoute"; // 로그인 검사 라우트
import LoginPage from "./pages/LoginPage"; // 로그인 페이지
import SignupPage from "./pages/SignupPage"; // 회원가입
import PasswordReissuePage from "./pages/PasswordReissuePage"; // 비밀번호 재발급
import HomePage from "./pages/HomePage"; // 홈 페이지
import Loft from "./pages/Loft"; // 배경 1 실내
import Mountain from "./pages/Mountain"; // 배경 2 산
import Toolbar from "./components/common/Toolbar"; // 툴바
import UserSettingPage from "./pages/UserSettingPage"; // 유저정보 수정
import PasswordChangePage from "./pages/PasswordChangePage"; // 비밀번호 변경
import EmailChangePage from "./pages/EmailChangePage"; // 이메일 변경
import StatisticPage from "./pages/StatisticPage"; // 통계 페이지

// 로그인 필요한 페이지
const protectedRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/usersetting", element: <UserSettingPage /> },
  { path: "/passwordchange", element: <PasswordChangePage /> },
  { path: "/emailchange", element: <EmailChangePage /> },
  { path: "/statistic", element: <StatisticPage /> },
];

function App() {
  // 스토어에서 정보 가져오기
  const { user, userActions } = useUserStore();
  const { bg, bgActions } = useBackgroundStore();

  return (
    <div className="relative">
      <Router>
        {user && <Toolbar />}
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/passwordreissue" element={<PasswordReissuePage />} />
          <Route path="/login" element={<LoginPage />} />
          {protectedRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          ))}
        </Routes>
      </Router>
      {bg === "loft" && <Loft />}
      {bg === "mountain" && <Mountain />}
    </div>
  );
}

export default App;