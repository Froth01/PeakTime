import { useState } from "react";
import Calendar from "../components/Report/Calendar"; // 캘린더
import DailyReport from "../components/Report/DailyReport"; // 하루 요약

function ReportPage() {
  // 날짜 변수
  const [selectedDay, setSelectedDay] = useState(null);

  // 날짜 클릭
  const onDayClick = (day) => {
    setSelectedDay(day);
  };

  // 날짜 취소
  const onCancel = () => {
    setSelectedDay(null);
  };

  return (
    <>
      <Calendar
        selectedDay={selectedDay}
        onDayClick={(day) => onDayClick(day)}
      />
      {selectedDay && <DailyReport day={selectedDay} onCancel={onCancel} />}
    </>
  );
}

export default ReportPage;
