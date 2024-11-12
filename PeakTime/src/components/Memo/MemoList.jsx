import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import memosApi from "../../api/memosApi";
import PropTypes from "prop-types";

function MemoList({ onMemoClick }) {
  // 메모 리스트
  const [memoList, setMemoList] = useState([]);
  const [countGPT, setCountGPT] = useState(null);

  useEffect(() => {
    fetchGetMemoList();
  }, []);

  const fetchGetMemoList = async () => {
    try {
      // 메모 전체 조회 GET 요청을 보내기
      const response = await memosApi.get(``);
      console.log("memoListGetApi: ", response.data);
      const memoList = response.data.data.memoList;
      const countGPT = response.data.data.summaryCount;
      setMemoList([...memoList]); // 상태를 업데이트하여 UI에 반영
      setCountGPT(countGPT);
      return response;
    } catch (error) {
      console.error("Error fetching memoList:", error);
      throw error;
    }
  };

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
            <button onClick={() => handleClickSetting(index)}>
              {memo.title}
            </button>
            |<button onClick={() => handleDelete(index)}>X</button>
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
