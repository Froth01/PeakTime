import { useState } from "react";
import Title from "../components/common/Title";
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
    <div className="h-[100vh] flex flex-col">
      <Title title={"월간 하이킹 내역"} />
      <div className="h-[90vh] top-[10vh]">
        <Calendar
          selectedDay={selectedDay}
          onDayClick={(day) => onDayClick(day)}
        />
        {selectedDay && <DailyReport day={selectedDay} onCancel={onCancel} />}
      </div>
    </div>
  );
}

export default ReportPage;
