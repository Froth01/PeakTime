import { useEffect, useState } from "react";
import { useUserStore } from "../stores/UserStore";
// import Timer from "../components/Timer/Timer";
import { useBackgroundStore } from "../stores/BackgroundStore";

function HomePage() {
  // 테스트용 유저스토어
  const { user, userActions } = useUserStore();

  const handleLogout = () => {
    userActions.setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    console.log("Updated user state:", user);
  }, [user]);

  return <div className="h-[100vh] flex">{/* <Timer /> */}</div>;
}

export default HomePage;
