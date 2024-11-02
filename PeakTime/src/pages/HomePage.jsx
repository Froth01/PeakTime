import { useEffect } from "react";
import { useUserStore } from "../stores/UserStore";

function HomePage() {
  // 테스트용 유저스토어
  const { user, userActions } = useUserStore();

  const handleLogout = () => {
    userActions.setuser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    console.log("Updated user state:", user);
  }, [user]);

  return (
    <div className="relative z-[2]">
      <h1>Home</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default HomePage;
