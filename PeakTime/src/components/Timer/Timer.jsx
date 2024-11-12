import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import hikingsApi, { setBaseUrl } from "../../api/hikingsApi.js";

function Timer() {
  const [inputTime, setInputTime] = useState(""); // 사용자 입력 시간 (분 단위)
  const [totalTime, setTotalTime] = useState(0); // 타이머 시간 (분 단위)
  const [remainTime, setRemainTime] = useState(null); // 남은 시간 (초 단위)
  const [isRunning, setIsRunning] = useState(false); // 타이머 시작 상태

  const [startedHikingId, setStartedHikingId] = useState(null); // 시작한 hikingId 정보

  const [extensionData, setExtensionData] = useState(null); // extension hiking 데이터
  const [electronData, setElectronData] = useState(null); // electron hiking 데이터

  //현재 시간
  let [now, setNow] = useState(new Date());
  let nowInterval = null;

  const startNow = () => {
    nowInterval = setInterval(() => {
      setNow(new Date());
    }, 5000);
  };
  const stopNow = () => {
    clearInterval(nowInterval);
  };

  const [extensionMemoData, setExtensionMemoData] = useState(null); // extension memo 저장 데이터

  // 시작 상태, 남은 시간 변경시마다 적용
  useEffect(() => {
    if (remainTime && remainTime === 0) {
      setIsRunning(false);
      startNow();
    }

    const interval = setInterval(() => {
      setRemainTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainTime]);

  // 시간 'mm:ss' 표시
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // 시작버튼 누르기
  const handleStart = () => {
    // 시간 정수화
    const time = parseInt(inputTime, 10);
    // 입력 시간 유효성 검사
    if (isNaN(time) || time <= 0) {
      Swal.fire({
        title: "올바른 시간을 입력하세요.",
        icon: "error",
        confirmButtonColor: "green",
        confirmButtonText: "확인",
      });
      return;
    }
    // 진짜로 시작하기, api요청
    Swal.fire({
      title: `${formatTime(time * 60)} 길이의 하이킹을 시작하시겠습니까?`,
      showDenyButton: true,
      confirmButtonColor: "green",
      denyButtonColor: "gray",
      confirmButtonText: "시작하기",
      denyButtonText: "취소",
      preConfirm: async () => {
        try {
          // 시작 시간 포맷 생성
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const second = now.getSeconds();

          const format = `${year}-${("00" + month.toString()).slice(-2)}-${(
            "00" + day.toString()
          ).slice(-2)} ${("00" + hour.toString()).slice(-2)}:${(
            "00" + minute.toString()
          ).slice(-2)}:${("00" + second.toString()).slice(-2)}`;

          const startHikingData = {
            startTime: format,
            attentionTime: inputTime,
            isSelf: true,
          };
          console.log("보낼 바디 :", startHikingData);

          // API 요청
          const responseStartHiking = await hikingsApi.post(
            "",
            startHikingData
          );

          // 상태 업데이트
          setStartedHikingId(responseStartHiking.data.data.hikingId);
          setTotalTime(time);
          setRemainTime(time * 60 - 1); // 분 단위로 받은 시간을 초로 변환
          setIsRunning(true);
          stopNow();

          // 커스텀 이벤트
          const hikingStart = new CustomEvent("hikingStart", {
            bubbles: true,
            detail: { startedHikingId: responseStartHiking.data.data.hikingId },
          });
          const startBtn = document.getElementById("start");
          startBtn.dispatchEvent(hikingStart);
        } catch (err) {
          console.error("API 요청 중 오류 발생:", err);

          // SweetAlert를 사용하여 오류 메시지 표시
          Swal.fire({
            title: "하이킹을 시작하는 데 실패했습니다.",
            text: `오류 내용: ${err.response?.data?.message || err.message}`,
            icon: "error",
            confirmButtonColor: "green",
            confirmButtonText: "확인",
          });
        }
      },
    });
  };

  // 요청해서 아이디 받으면
  useEffect(() => {
    if (startedHikingId !== null) {
      console.log("시작한 하이킹 아이디:", startedHikingId);
      // 차단 프로세스 시작
    }
  }, [startedHikingId]);

  // ipc 처리
  // const handleExtensionMessage = async (data) => {
  //   console.log(data.urlList);
  //   setExtenstionData(data.urlList); // 받은 데이터를 상태로 저장
  // };

  // const handleElectronMessage = async (data) => {
  //   // 익스텍션에서 추가로 받은 리스트 저장
  //   console.log(data);
  //   setElectronData(data);
  // };

  const handleElectronMessage = async (data) => {
    // 익스텍션에서 추가로 받은 리스트 저장
    console.log(data);
    setElectronData(data);
  };

  const handleExtensionMemoMessage = async (data) => {
    // 익스텍션에서 받은 메모 저장
    console.log("handleExtensionMemoMessage: ", data);
    setExtensionMemoData(data);
    createPostMemo(data);
  };

  const createPostMemo = async (data) => {
    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      console.log("받고싶은 데이터 data", data);
      console.log("받고싶은 데이터 data.title", data.title);
      console.log("받고싶은 데이터 ", data.content);
      const requestData = {
        title: data.title,
        content: data.content,
      };
      const response = await memosApi.post(``, requestData);
      console.log("CreateMemoPostApi: ", response.data);
    } catch (error) {
      console.error("Error create Memo:", error);
      throw error;
    }
  };

  // onWebSocketMessage 이벤트 리스너 등록
  useEffect(() => {
    // console.log("onHikingInfo 리스너 등록 중...");
    // window.electronAPI.onHikingInfo(handleExtensionMessage);

    // console.log("onBlockHistory 리스너 등록 중");
    // window.electronAPI.onBlockHistory(handleElectronMessage);

    console.log("onBlockHistory 리스너 등록 중");
    window.electronAPI.onAllDone(allDone);

    setBaseUrl();
    startNow();
    console.log("extension memo 값 변경 감지 중");
    window.electronAPI.onSaveMemo(handleExtensionMemoMessage);
  }, []);

  // useEffect(() => {
  //   const updateHikingData = async () => {
  //     if (extenstionData == null || electronData == null) {
  //       return;
  //     }

  //     console.log("extenstionData", extenstionData);
  //     console.log("electronData:", electronData);

  //     // 현재 시간 포맷 생성
  //     const now = new Date();
  //     const year = now.getFullYear();
  //     const month = now.getMonth() + 1;
  //     const day = now.getDate();
  //     const hour = now.getHours();
  //     const minute = now.getMinutes();
  //     const second = now.getSeconds();

  //     const format = `${year}-${("00" + month.toString()).slice(-2)}-${(
  //       "00" + day.toString()
  //     ).slice(-2)} ${("00" + hour.toString()).slice(-2)}:${(
  //       "00" + minute.toString()
  //     ).slice(-2)}:${("00" + second.toString()).slice(-2)}`;

  //     const endHikingData = {
  //       realEndTime: format,
  //       contentList: [...electronData, ...extenstionData],
  //     };

  //     console.log(endHikingData);
  //     const response = await hikingsApi.put(
  //       `${startedHikingId}`,
  //       endHikingData
  //     );
  //     console.log("response:", response.data);
  //     setElectronData(null);
  //     setExtenstionData(null);
  //   };

  //   updateHikingData();
  // }, [extenstionData, electronData]);

  // 포기 버튼 누르기
  const handleGiveup = () => {
    Swal.fire({
      title: `진행중인 하이킹을 포기하시겠습니까?`,
      showDenyButton: true,
      confirmButtonColor: "#f40000",
      denyButtonColor: "#c5c5c5",
      confirmButtonText: "포기하기",
      denyButtonText: "취소",
      preConfirm: async () => {
        try {
          console.log("취소 로직 작동");

          // 종료 커스텀 이벤트 발생시키기
          const hikingEnd = new CustomEvent("hikingEnd", {
            bubbles: true,
            detail: { startedHikingId },
          });
          const endBtn = document.getElementById("giveup");
          endBtn.dispatchEvent(hikingEnd);

          // API 요청 보내기
          setTimeout(() => {
            setExtensionData([]);
            setElectronData([]);
          }, 2000);

          // 상태 업데이트
          setTotalTime(0);
          setRemainTime(null); // 분 단위로 받은 시간을 초로 변환
          setIsRunning(false);
        } catch (err) {
          console.error("API 요청 중 오류 발생:", err);

          // SweetAlert를 사용하여 오류 메시지 표시
          Swal.fire({
            title: "하이킹을 종료하는 데 실패했습니다.",
            text: `오류 내용: ${err.response?.data?.message || err.message}`,
            icon: "error",
            confirmButtonColor: "green",
            confirmButtonText: "확인",
          });
        }
      },
    });
  };
  // 다 됐을떄
  const allDone = (data) => {
    console.log("야진짜 다됐다", data);
  };
  return (
    <>
      <style>
        {/* 타이머 시계 css */}
        {`
          .timer {
            background: ${
              isRunning
                ? "-webkit-linear-gradient(left, #eee 50%, red 50%)"
                : "#eee"
            };
            border-radius: 100%;
            position: relative;
            height: 100%;
            width: 100%;
            transform: ${isRunning ? "rotate(0deg)" : "rotate(180deg)"};
            animation-name: ${isRunning ? "time" : "none"};
            animation-duration: ${totalTime * 60}s;
            animation-timing-function: linear;
          }
          .mask {
            border-radius: 100% 0 0 100% / 50% 0 0 50%;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 50%;
            animation-name: ${isRunning ? "mask" : "none"};
            animation-duration: ${totalTime * 60}s;
            animation-timing-function: linear;
            -webkit-transform-origin: 100% 50%;
          }
          .hour-hand, .minute-hand {
            position: absolute;
            background-color: black;
            transform-origin: bottom;
            left: 50%;
            bottom: 50%;
          }
          .hour-hand {
            width: 4px;
            height: 30%;
            transform: rotate(${(new Date().getHours() % 12) * 30}deg);
            border-radius: 50px;
            background: linear-gradient(180deg, #86C8E3 0%, #263439 100%);
            box-shadow: 0px 0px 15px 3px #7FBFDA;
          }
          .minute-hand {
            width: 2px;
            height: 45%;
            transform: rotate(${new Date().getMinutes() * 6}deg);
            transfrom: translateY(-50%);
            border-radius: 50px;
            background: linear-gradient(180deg, #86C8E3 0%, #263439 100%);
            box-shadow: 0px 0px 15px 3px #7FBFDA;
          }
          .middle {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 15px;
            height: 15px;
            border-radius: 100%;
            transform: translate(-50%, -50%);
          }
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          @-webkit-keyframes time {
            100% {
              -webkit-transform: rotate(360deg);
            }
          }
          @-webkit-keyframes mask {
            0% {
                background: red;
                -webkit-transform: rotate(0deg);
            }
            50% {
                background: red;
                -webkit-transform: rotate(-180deg);
            }
            50.01% {
                background: #eee;
                -webkit-transform: rotate(0deg);
            }
            100% {
                background: #eee;
                -webkit-transform: rotate(-180deg);
            }
          }
        `}
      </style>
      <div className="absolute w-[28%] h-[96%] right-0 bg-[#333333] bg-opacity-60 flex flex-col items-center rounded-lg my-[2vh] mx-[2vw]">
        <div className="w-[40vh] h-[40vh] relative top-[15%]">
          <div className="timer overflow-hidden">
            <div className="mask"></div>
          </div>
          <div className="absolute top-[70%] left-[50%] translate-x-[-50%] remain text-3xl">
            {isRunning
              ? formatTime(remainTime)
              : `${("00" + now.getHours().toString()).slice(-2)}:${(
                  "00" + now.getMinutes().toString()
                ).slice(-2)}`}
          </div>
          {!isRunning && (
            <>
              <div className="hour-hand"></div>
              <div className="minute-hand"></div>
              <div className="middle z-10 bg-[#66AADF]"></div>
            </>
          )}
          {!isRunning && (
            <div className="flex flex-col mt-[15%] items-center">
              <input
                id="hikingStart"
                type="number"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="hover:border-[#66AADF] rounded-xl"
                placeholder="하이킹 시간을 입력해주세요"
              />
              <label htmlFor="hikingStart" className="text-sm text-white">
                *분 단위로 입력해주세요.<br></br>최소 30분부터 240분까지
                가능합니다.
              </label>
              <button
                className="w-[10vw] h-[6vh] mt-[10%] rounded-xl text-white bg-[#03c777]"
                onClick={handleStart}
                id="start"
              >
                시작
              </button>
            </div>
          )}
          {isRunning && (
            <div className="flex flex-col mt-[15%] items-center">
              <button
                className="w-[10vw] h-[6vh] mt-[10%] rounded-xl text-white bg-[#f40000]"
                onClick={handleGiveup}
                id="giveup"
              >
                포기하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Timer;
