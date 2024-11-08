import { useEffect, useState } from "react";
import { useUserStore } from "../stores/UserStore";
import Timer from "../components/Timer/Timer";

function HomePage() {
  // 테스트용 유저스토어
  const { user, userActions } = useUserStore();
  const { messages, setMessages } = useState([]);

  const handleLogout = () => {
    userActions.setuser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    console.log("Updated user state:", user);
  }, [user]);

  useEffect(() => {
    if (user) {
      if (!user.isRoot) {
        const eventSource = new EventSource(
          "http://localhost:8080/api/v1/schedules"
        );

        eventSource.addEventListener("message", (event) => {
          setMessages((prevMessages) => [...prevMessages, event.data]);
        });

        eventSource.onerror = () => {
          eventSource.close(); //연결 끊기
        };
      }
    }
  }, []);

  useEffect(() => {
    if (user && messages) {
      if (!user.isRoot && messages.length > 1) {
        //하이킹 시작로쥑
      }
      console.log("최신메시지들 : ", messages);
    }
  }, [messages]);
  return (
    <div className="h-[100vh] flex">
      <button onClick={handleLogout}>로그아웃</button>
      <Timer />
    </div>
  );
}

export default HomePage;
