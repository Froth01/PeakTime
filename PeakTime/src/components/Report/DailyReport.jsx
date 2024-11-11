import { useEffect, useState } from "react";
import hikingsApi from "../../api/hikingsApi";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";
import DailyReportDetail from "./DailyReportDetail";

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
      title: "하이킹 상세",
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
        title: "leading-tight m-0",
        popup: "w-[50vw] max-w-[1000px] h-[60vh] min-h-[500px]",
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

  // endtime - starttime 분 단위 계산
  const diffInMinutes = (startTime, endTime) => {
    return Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));
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
    <div className="relative bg-[#333333] bg-opacity-70 left-[43vw] w-[54vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center p-5">
      <div className="flex w-full justify-between items-end">
        <h2 className="text-[40px] font-bold text-white">Daily Report</h2>
        {/* YYYY년 MM월 DD일 */}
        <h3 className="text-[30px] font-bold text-white">{expression(day, "YMD")}</h3>
      </div>
      <div className="flex flex-col justify-around h-[65vh]">
        {dailyHikingList?.length === 0 ? (
          // 내역이 없을 경우
          <div className="text-[30px] text-white font-bold">선택한 날짜의 사용 기록이 없습니다.</div>
        ) : (
          // 내역이 있을 경우
          dailyHikingList?.map((hiking) => (
            <div key={hiking.hikingId}>
              <button
                onClick={() => openHikingDetail(hiking.hikingId)}
                className="border"
              >
                {/* "실제 시간 / 목표 시간" 표시 */}
                <div>
                  {minutesExpression(
                    hiking.startTime,
                    hiking.endTime,
                    hiking.realEndTime
                  )}
                </div>

                {/* "시작 시각 ~ 목표 종료 시각" 표시 */}
                <div>
                  {expression(hiking.startTime, "Hm")} ~{" "}
                  {expression(hiking.endTime, "Hm")}
                </div>
              </button>
            </div>
          ))
        )}
      </div>
      <button
        className="text-[20px] text-white font-bold px-5 py-1 rounded-lg bg-[#66AADF]"
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
