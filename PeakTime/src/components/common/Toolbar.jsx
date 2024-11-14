import { useNavigate } from "react-router-dom";
import { FaHiking } from "react-icons/fa";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { MdStickyNote2 } from "react-icons/md";
import { BiShieldQuarter } from "react-icons/bi";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { Dropdown, Tooltip } from "flowbite-react";
import { useState } from "react";
import { useUserStore } from "../../stores/UserStore";

function Toolbar() {
  const navigate = useNavigate();
  //유저정보
  const { user, userActions } = useUserStore();
  const localUser = JSON.parse(localStorage.getItem("user")) || null;
  // 버튼 스타일 조건을 위한 변수
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isSettingHovered, setIsSettingHovered] = useState(false);
  const [activeSetting, setActiveSetting] = useState(false);

  //이동 함수
  const handleMenu = (type) => {
    navigate(type);
  };

  //로그아웃 함수
  const handleLogout = () => {
    userActions.setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="bg-[#66aadf] w-[8vw] h-[100vh] absolute left-0 z-[2] flex flex-col items-center justify-between">
      <div className="flex flex-col h-[70%] justify-around">
        <Tooltip
          content="하이킹 내역"
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button
            onClick={() => {
              handleMenu("/report");
            }}
            className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-center justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
          >
            <FaHiking />
          </button>
        </Tooltip>
        <Tooltip
          content="전체 통계"
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button
            onClick={() => {
              handleMenu("/statistic");
            }}
            className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-center justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
          >
            <HiOutlinePresentationChartLine />
          </button>
        </Tooltip>
        <Tooltip
          content="메모"
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button
            onClick={() => {
              handleMenu("/memo");
            }}
            className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-center justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
          >
            <MdStickyNote2 />
          </button>
        </Tooltip>
        {localUser.isRoot && (
          <>
            <Tooltip
              content="차단 관리"
              placement="right"
              className="whitespace-nowrap font-bold"
            >
              <button
                onClick={() => {
                  handleMenu("/preset");
                }}
                className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-center justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
              >
                <BiShieldQuarter />
              </button>
            </Tooltip>
            <Tooltip
              content="서브계정 관리"
              placement="right"
              className="whitespace-nowrap font-bold"
            >
              <button
                onClick={() => {
                  handleMenu("/children");
                }}
                className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-center justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
              >
                <FaHandsHoldingChild />
              </button>
            </Tooltip>
          </>
        )}
      </div>
      <div className="flex flex-col h-[20%] justify-around">
        <Tooltip
          content="홈"
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button
            onClick={() => {
              handleMenu("/");
            }}
            className="text-white text-5xl"
          >
            <AiFillHome
              style={{
                filter: isHomeHovered
                  ? "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))"
                  : "drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.5))", // 이 부분을 filter 속성 내에서 적용
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={() => setIsHomeHovered(true)}
              onMouseLeave={() => setIsHomeHovered(false)}
            />
          </button>
        </Tooltip>
        <Tooltip
          content={
            <div className="flex flex-col">
              {localUser.isRoot && (
                <>
                  <button
                    onClick={() => handleMenu("/usersetting")}
                    className="text-left"
                  >
                    유저정보수정
                  </button>
                  <hr className="border-t my-1 border-gray-300" />
                </>
              )}
              <button onClick={handleLogout} className="text-left">
                로그아웃
              </button>
            </div>
          }
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button className="text-white text-5xl">
            <AiFillSetting
              style={{
                filter: isSettingHovered
                  ? "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))"
                  : "drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.5))", // 이 부분을 filter 속성 내에서 적용
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={() => setIsSettingHovered(true)}
              onMouseLeave={() => setIsSettingHovered(false)}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Toolbar;
