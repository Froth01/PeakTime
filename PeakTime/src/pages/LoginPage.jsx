import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";

function LoginPage() {
  // 스토어 불러오기
  const { user, userActions } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 로그인 버튼 클릭
  const handleLogin = async () => {
    console.log("로그인 시도 중");
    console.log("username:", username);
    // 조건 추가 (예시)
    if (username && password) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 비동기 처리를 시뮬레이션
      userActions.setuser({ username: username });
      localStorage.setItem("user", JSON.stringify({ username }));
      navigate("/");
    } else {
      console.error("아이디와 비밀번호를 입력하세요.");
    }
  };

  // 회원 가입 버튼 클릭
  const handleSignup = () => {
    navigate("/signup");
  };

  // 비밀번호 재발급 버튼 클릭
  const handlePasswordReissue = () => {
    navigate("/passwordreissue");
  };

  useEffect(() => {
    console.log("Updated user state:", user);
  }, [user]);

  return (
    <div>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <button onClick={handleSignup}>회원 가입</button>
      <button onClick={handlePasswordReissue}>비밀번호 재발급</button>
    </div>
  );
}

export default LoginPage;
