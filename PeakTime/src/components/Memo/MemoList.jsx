import { useState } from "react";
import PropTypes from "prop-types";

function MemoList({ onMemoClick }) {
  // 메모 리스트
  const [memoList, setMemoList] = useState(["메모1", "메모2", "메모3"]);

  // 메모 클릭
  const handleClickSetting = (index) => {
    onMemoClick(index);
  };

  // 삭제버튼 클릭
  const handleDelete = (num) => {
    setMemoList(memoList.filter((one, index) => index != num));
  };

  return (
    <div className="absolute left-[10vw] w-[15vw] h-[100vh] flex flex-col justify-between bg-gray-400">
      <div className="flex flex-col gap-5">
        {memoList.map((memo, index) => (
          <div className="gap-5" key={index}>
            <button onClick={() => handleClickSetting(index)}>{memo}</button>|
            <button onClick={() => handleDelete(index)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}
// props validation 추가
MemoList.propTypes = {
  onMemoClick: PropTypes.func.isRequired,
};
export default MemoList;
