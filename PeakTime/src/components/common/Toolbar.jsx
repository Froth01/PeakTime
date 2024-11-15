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
import Swal from "sweetalert2"; // 모달 라이브러리
import "../../styles/daily-report-custom-swal.css";
import usersApi from "../../api/usersApi";
import authApi from "../../api/authApi";

function Toolbar() {
  const navigate = useNavigate();
  //유저정보
  const { user, userActions } = useUserStore();
  // 버튼 스타일 조건을 위한 변수
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isSettingHovered, setIsSettingHovered] = useState(false);
  const [activeSetting, setActiveSetting] = useState(false);

  // 회원정보 관리 페이지 접근 권한 검사 모달창 띄우기
  const checkAccessModal = async () => {
    const { value: getPassword } = await Swal.fire({
      title: '비밀번호를 입력해주세요.',
      customClass: {
        popup: 'custom-swal-popup',
      },
      input: 'password',
      inputAttributes: {
        style: 'color: black;', // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getPassword) {
      checkAccess(getPassword);
    }
  }

  // 회원정보 관리 페이지 접근 권한 검사 API 호출
  const checkAccess = async (getPassword) => {
    const checkAccessData = {
      password: getPassword,
    };
    try {
      await usersApi.post("/settings", checkAccessData);
      // 성공하면 이어서 진행
      handleMenu("/usersetting");
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: '비밀번호가 일치하지 않습니다.',
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  //이동 함수
  const handleMenu = (type) => {
    navigate(type);
  };

  // 로그아웃 검사 모달창 띄우기
  const logoutModal = async () => {
    const { value: getRootUserPassword } = await Swal.fire({
      title: '메인 계정의 비밀번호를 입력해주세요.',
      customClass: {
        popup: 'custom-swal-popup',
      },
      input: 'password',
      inputAttributes: {
        style: 'color: black;', // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getRootUserPassword) {
      logout(getRootUserPassword);
    }
  }

  // 로그아웃 API 호출
  const logout = async (getRootUserPassword) => {
    // 로그아웃은 auth이지만 유일하게 access Token이 필요
    const logoutData = {
      rootUserPassword: getRootUserPassword,
    };
    try {
      const { user } = useUserStore.getState();
      const accessToken = user.accessToken;
      await authApi.post("/logout", logoutData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      // 성공하면 이어서 진행
      browserLogout();
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: '비밀번호가 일치하지 않습니다.',
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  // 브라우저 로그아웃
  const browserLogout = () => {
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
              <button
                onClick={checkAccessModal}
                className="text-left"
              >
                유저정보수정
              </button>
              <hr className="border-t my-1 border-gray-300" />
              <button onClick={logoutModal} className="text-left">
                로그아웃
              </button>
            </div>
          }
          placement="right"
          className="whitespace-nowrap font-bold"
        >
          <button
            onClick={checkAccessModal}
            className="text-white text-5xl"
          >
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
