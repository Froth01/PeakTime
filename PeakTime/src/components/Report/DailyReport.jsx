import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

function DailyReport({ day, onCancel }) {
  // 하이킹 목록
  const [hikingList, setHikingList] = useState([
    "하이킹1",
    "하이킹2",
    "하이킹3",
  ]);

  // 하이킹 디테일 모달
  const openHikingDetail = (index) => {
    console.log(index);
    Swal.fire({
      title: "하이킹 디테일",
      text: `${index}`,
      showConfirmButton: false,
      showCloseButton: true,
    });
  };

  // 닫기 클릭
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>DailyReport</h2>
      <div className="flex justify-around">
        {hikingList.map((hiking, index) => (
          <div key={index}>
            <button onClick={() => openHikingDetail(index)}>{hiking}</button>
          </div>
        ))}
        <button onClick={handleCancel}>닫기</button>
      </div>
    </div>
  );
}
// props validation 추가
DailyReport.propTypes = {
  day: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default DailyReport;
