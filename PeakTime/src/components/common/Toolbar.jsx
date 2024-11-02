import { useNavigate } from "react-router-dom";

function Toolbar() {
  const navigate = useNavigate();

  //이동 함수
  const handleMenu = (type) => {
    navigate(type);
  };

  return (
    <div className="bg-gray-200 w-[10vw] h-[100vh] absolute left-0 z-[2] flex flex-col items-center justify-around">
      <button
        onClick={() => {
          handleMenu("/report");
        }}
      >
        하이킹 내역
      </button>
      <button
        onClick={() => {
          handleMenu("/statistic");
        }}
      >
        통계
      </button>
      <button
        onClick={() => {
          handleMenu("/memo");
        }}
      >
        메모
      </button>
      <button
        onClick={() => {
          handleMenu("/preset");
        }}
      >
        차단관리
      </button>
      <button
        onClick={() => {
          handleMenu("/children");
        }}
      >
        차일드관리
      </button>
      <button
        onClick={() => {
          handleMenu("/");
        }}
      >
        홈
      </button>
      <button
        onClick={() => {
          handleMenu("/usersetting");
        }}
      >
        설정
      </button>
    </div>
  );
}

export default Toolbar;
