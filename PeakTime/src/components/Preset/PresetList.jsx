import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

function PresetList({ onPresetClick }) {
  // 프리셋 리스트
  const [presetList, setPresetList] = useState([
    "프리셋1",
    "프리셋2",
    "프리셋3",
  ]);

  // 프리셋 클릭
  const handleClickSetting = (index) => {
    onPresetClick(index);
  };

  // 추가버튼 클릭
  const handleAddBtn = () => {
    if (presetList.length < 5) {
      setPresetList([...presetList, "새 프리셋"]);
    } else {
      Swal.fire({
        title: "프리셋 최대 갯수 도달",
        icon: "error",
        confirmButtonColor: "green",
      });
    }
  };

  // 삭제버튼 클릭
  const handleDelete = (num) => {
    setPresetList(presetList.filter((one, index) => index != num));
  };

  return (
    <div className="absolute left-[10vw] w-[15vw] h-[100vh] flex flex-col justify-between bg-gray-400">
      <div className="flex flex-col gap-5">
        {presetList.map((preset, index) => (
          <div className="gap-5" key={index}>
            <button onClick={() => handleClickSetting(index)}>{preset}</button>|
            <button onClick={() => handleDelete(index)}>X</button>
          </div>
        ))}
      </div>
      <button onClick={handleAddBtn}>프리셋 추가</button>
    </div>
  );
}
// props validation 추가
PresetList.propTypes = {
  onPresetClick: PropTypes.func.isRequired,
};
export default PresetList;
