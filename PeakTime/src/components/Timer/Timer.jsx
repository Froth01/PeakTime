import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Timer() {
  const [inputTime, setInputTime] = useState(""); // 사용자 입력 시간 (분 단위)
  const [totalTime, setTotalTime] = useState(0); // 타이머 시간 (분 단위)
  const [remainTime, setRemainTime] = useState(0); // 남은 시간 (초 단위)
  const [isRunning, setIsRunning] = useState(false); // 타이머 시작 상태

  // 시작 상태, 남은 시간 변경시마다 적용
  useEffect(() => {
    if (remainTime === 0) {
      setIsRunning(false);
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

  // 시작버튼
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
    Swal.fire({
      title: `${formatTime(time * 60)} 길이의 하이킹을 시작하시겠습니까?`,
      showDenyButton: true,
      confirmButtonColor: "green",
      denyButtonColor: "gray",
      confirmButtonText: "시작하기",
      denyButtonText: "취소",
      preConfirm: () => {
        setTotalTime(time);
        setRemainTime(time * 60 - 1); // 분 단위로 받은 시간을 초로 변환
        setIsRunning(true);
      },
    });
  };

  return (
    <>
      <style>
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
          }
          .minute-hand {
            width: 2px;
            height: 45%;
            transform: rotate(${new Date().getMinutes() * 6}deg);
            transfrom: translateY(-50%);
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
      <div className="absolute w-[30%] h-[100%] right-0 bg-green-200 bg-opacity-50 flex flex-col items-center">
        <div className="w-[40vh] h-[40vh] relative">
          <div className="timer overflow-hidden">
            <div className="mask"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] remain">
            {isRunning
              ? formatTime(remainTime)
              : `${new Date().getHours()}:${new Date().getMinutes()}`}
          </div>
          {!isRunning && (
            <>
              <div className="hour-hand"></div>
              <div className="minute-hand"></div>
            </>
          )}
        </div>
        {!isRunning && (
          <div>
            <input
              type="number"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              placeholder="분 단위로 입력"
            />
            <button onClick={handleStart}>시작</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Timer;
