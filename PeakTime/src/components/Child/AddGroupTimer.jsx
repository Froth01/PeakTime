import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function AddGroupTimer({ groupId, onSave }) {
  const [startTime, setStartTime] = useState("00:00");
  const [attentionTime, setAttentionTime] = useState(0);
  const [repeatDay, setRepeatDay] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = () => {
    // 입력한 시각을 현재 시각과 비교해서 날짜 보정
    const now = new Date();
    const [hour, minute] = startTime.split(":").map(Number);

    const targetDate = new Date(now);
    targetDate.setHours(hour, minute, 0, 0);

    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const hours = String(targetDate.getHours()).padStart(2, "0");
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");

    const formattedStartTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;

    return {
      groupId,
      startTime: formattedStartTime,
      attentionTime,
      repeatDay,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "start-time":
        setStartTime(value);
        break;
      case "attention-time":
        if (!isNaN(Number(value))) {
          setAttentionTime(Number(value));
        }
        break;
      case "repeat-day":
        setRepeatDay(Number(value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onSave(handleSave);
  }, [onSave, handleSave]);

  // 요일에 해당하는 비트 값
  const dayBitValues = {
    월: 1 << 6,
    화: 1 << 5,
    수: 1 << 4,
    목: 1 << 3,
    금: 1 << 2,
    토: 1 << 1,
    일: 1 << 0,
  };

  // 요일 버튼 클릭 핸들러
  const toggleDay = (day) => {
    const bitValue = dayBitValues[day];
    setRepeatDay((prev) =>
      prev & bitValue ? prev & ~bitValue : prev | bitValue
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        {/* 시작 시각 */}
        <div className="flex flex-col">
          <label htmlFor="start-time" className="mb-1 text-left">
            시작 시각
          </label>
          <div className="flex items-center">
            <input
              type="time"
              id="start-time"
              name="start-time"
              value={startTime || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* 시간 */}
        <div className="flex flex-col">
          <label htmlFor="attention-time" className="mb-1 text-left">
            시간
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="attention-time"
              name="attention-time"
              value={attentionTime || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="시간 입력"
            />
            <span className="text-gray-500 pointer-events-none">분</span>
          </div>
        </div>
      </div>

      {/* repeat_day 설정 */}
      <div className="flex space-x-2 mt-2">
        {Object.keys(dayBitValues).map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className="px-4 py-2 border rounded text-white"
            style={{
              backgroundColor:
                repeatDay & dayBitValues[day] ? "#66AADF" : "#C5C5C5",
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

AddGroupTimer.propTypes = {
  groupId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddGroupTimer;
