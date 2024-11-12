import { useEffect, useState } from "react";
import hikingsApi from "../../api/hikingsApi";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";
import DailyReportDetail from "./DailyReportDetail";
import {
  diffInMinutes,
  successToHiking,
} from "../../utils/SuccessFunctionUtils";
import "../../styles/custom-scrollbar.css";
import "../../styles/daily-report-custom-swal.css";

function DailyReport({ day, onCancel }) {
  const ALERT_MESSAGE = {
    failtToGetDailyHikingList: {
      title: "일일 내역 목록 조회 실패",
      text: "일일 이용내역 목록 조회에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    failToGetDailHikingDetail: {
      title: "일일 상세 이용 조회 실패",
      text: "일일 이용내역 상세 조회에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
  };

  // 하이킹 목록
  const [dailyHikingList, setDailyHikingList] = useState([]);

  // 하이킹 디테일 모달
  const openHikingDetail = (hikingId) => {
    let root;

    Swal.fire({
      title: "<span class='swal-title'> 하이킹 상세</span>",
      html: `<div id="daily-report-detail" style="width: 100%; height: 100%; padding: 16px; overflow: auto;" />`,
      willOpen: () => {
        hikingsApi
          .get(`/${hikingId}`)
          .then((result) => {
            root = ReactDOM.createRoot(
              document.getElementById("daily-report-detail")
            );
            root.render(<DailyReportDetail hikingDetail={result.data.data} />);
          })
          .catch(() => Swal.fire(ALERT_MESSAGE.failToGetDailHikingDetail));
      },
      didClose: () => {
        if (root) {
          root.unmount();
        }
      },
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        title: "swal-title",
        popup:
          "w-[60vw] min-w-[1000px] h-[55vh] min-h-[700px] custom-swal-popup",
      },
    });
  };

  const expression = (day, type) => {
    // "YYYY-MM-DD HH:mm:SS" format 자료를 바꿈
    const date = new Date(day);

    switch (type) {
      // YYYY-MM-DD format
      case "YMD": {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const dayOfMonth = String(date.getDate()).padStart(2, "0");
        return `${year}년 ${month}월 ${dayOfMonth}일`;
      }
      // HH:mm:SS format
      case "Hm": {
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${hour}:${minute}`;
      }
      default:
        return;
    }
  };

  const minutesExpression = (startTime, endTime, realEndTime) => {
    return `${diffInMinutes(startTime, realEndTime)} / ${diffInMinutes(
      startTime,
      endTime
    )}`;
  };

  // 하이킹 캘린더 상세 조회
  useEffect(() => {
    hikingsApi
      .get(`/calendar/date/${day}`)
      .then((result) => {
        setDailyHikingList(result.data.data.hikingDetailList);
      })
      .catch(() => Swal.fire(ALERT_MESSAGE.failtToGetDailyHikingList));
  }, [day]);

  // 닫기 클릭
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="relative bg-[#333333] bg-opacity-70 left-[43vw] w-[54vw] h-[84vh] my-[3vh] flex flex-col justify-start items-center p-5">
      <div className="flex w-full justify-between items-end mb-5">
        <h2 className="text-[40px] font-bold text-white">일간 리포트</h2>
        {/* YYYY년 MM월 DD일 */}
        <h3 className="text-[30px] font-bold text-white">
          {expression(day, "YMD")}
        </h3>
      </div>
      <div
        className={`flex flex-col h-[65vh] w-full mb-5 p-10 overflow-y-scroll custom-scrollbar ${
          dailyHikingList?.length === 0
            ? "justify-center items-center"
            : "justify-around grid grid-cols-2 gap-[30px] "
        }`}
      >
        {dailyHikingList?.length === 0 ? (
          // 내역이 없을 경우
          <div className="text-[30px] text-white font-bold w-full h-full flex items-center justify-center">
            선택한 날짜의 사용 기록이 없습니다.
          </div>
        ) : (
          // 내역이 있을 경우
          dailyHikingList?.map((hiking) => (
            <div
              key={hiking.hikingId}
              className="border rounded-xl text-white flex justify-around items-center h-[150px]"
              onMouseEnter={(e) => {
                e.currentTarget.style.animation = "subtlePing 0.25s forwards";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animation =
                  "subtlePingReverse 0.25s forwards";
              }}
              onClick={() => openHikingDetail(hiking.hikingId)}
            >
              <div
                className={`flex justify-center items-center text-[30px] font-bold w-[80px] h-[80px] rounded-full ${
                  successToHiking(hiking.endTime, hiking.realEndTime)
                    ? "bg-[#03C777]"
                    : "bg-[#F40000]"
                }`}
              >
                {`${
                  successToHiking(hiking.endTime, hiking.realEndTime)
                    ? "성공"
                    : "실패"
                }`}
              </div>
              <div>
                {/* "시작 시각 ~ 목표 종료 시각" 표시 */}
                <div className="text-[20px]">
                  {expression(hiking.startTime, "Hm")} ~{" "}
                  {expression(hiking.endTime, "Hm")}
                </div>

                {/* "실제 시간 / 목표 시간" 표시 */}
                <div className="text-[30px] font-bold">
                  {minutesExpression(
                    hiking.startTime,
                    hiking.endTime,
                    hiking.realEndTime
                  )}{" "}
                  분
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        className="text-[20px] text-white font-bold px-5 py-1 rounded-lg bg-[#7C7C7C] hover:bg-[#5C5C5C]"
        onClick={handleCancel}
      >
        닫기
      </button>
    </div>
  );
}

// props validation 추가
DailyReport.propTypes = {
  day: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default DailyReport;
