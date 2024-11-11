import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import hikingsApi from "../../api/hikingsApi";
import Swal from "sweetalert2";
import "../../styles/animation.css";

function Calendar({ selectedDay, onDayClick }) {
  const ALERT_MESSAGE = {
    failtToGetHikingList: {
      title: "내역 목록 조회 실패",
      text: "이용내역 목록 조회에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
  };

  const colorPalette = (totalMinute) => {
    const RANGE_ARRAY = [0, 60, 120, 180, 240];

    switch (totalMinute) {
      case totalMinute > RANGE_ARRAY[0] && totalMinute <= RANGE_ARRAY[1]:
        return "#A1C7E7";
      case totalMinute > RANGE_ARRAY[1] && totalMinute <= RANGE_ARRAY[2]:
        return "#82B5E2";
      case totalMinute > RANGE_ARRAY[2] && totalMinute <= RANGE_ARRAY[3]:
        return "#66AADF";
      case totalMinute > RANGE_ARRAY[3] && totalMinute <= RANGE_ARRAY[4]:
        return "#4D90D8";
      case totalMinute > RANGE_ARRAY[4]:
        return "#3476D0";
      default:
        return "#C5C5C5";
    }
  };

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hikingList, setHikingList] = useState([]);

  // 날짜 클릭
  const handleDay = (day) => {
    onDayClick(day);
  };

  useEffect(() => {
    hikingsApi
      .get("/calendar")
      .then((result) => {
        setHikingList(result.data.data.hikingList);
        setYear(new Date(result.data.data.hikingList[0].date).getFullYear());
        setMonth(new Date(result.data.data.hikingList[0].date).getMonth() + 1);
      })
      .catch(() => Swal.fire(ALERT_MESSAGE.failtToGetHikingList));
  }, []);

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col p-5">
      <div className="flex items-start mb-5">
        <div className="text-[40px] font-bold text-white">캘린더</div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center items-center mb-5">
          <div className="text-[50px] font-bold text-white mr-3">
            <FaRegCalendarAlt />
          </div>
          <div className="flex items-end">
            <div className="text-[40px] font-bold text-white mr-2">
              {month}월
            </div>
            <div className="text-[30px] font-bold text-white">{year}년</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-grid grid-cols-5 gap-2 justify-center items-center">
            {hikingList.map((item, idx) => (
              <button
                key={idx + 1}
                onClick={() => handleDay(item.date)}
                className={`text-white rounded-lg w-[4vw] h-[4vw] ${
                  item.date === selectedDay ? "border-4 border-white" : ""
                }`}
                style={{
                  backgroundColor: colorPalette(item.totalMinute),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation = "subtlePing 0.25s forwards";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation = "subtlePingReverse 0.25s forwards";
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// props validation 추가
Calendar.propTypes = {
  selectedDay: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onDayClick: PropTypes.func.isRequired,
};

export default Calendar;
