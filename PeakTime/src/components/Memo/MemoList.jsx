import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import memosApi from "../../api/memosApi";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "../../styles/daily-report-custom-swal.css";

function MemoList({ onMemoClick, updateCountGPT }) {
  // 메모 리스트
  const [memoList, setMemoList] = useState([]);
  const [countGPT, setCountGPT] = useState(0);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  // 휴지통 버튼을 눌렀을 때 `X` 버튼을 표시하도록 설정
  const handleTrashButtonClick = () => {
    setShowDeleteButton(!showDeleteButton);
  };

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
      updateCountGPT(countGPT); // list -> page -> detail로 보내기위해 page의 count update하기
    } catch (error) {
      console.error("Error fetching memoList:", error);
      throw error;
    }
  };
  useEffect(() => {
    updateCountGPT(countGPT);
  }, [countGPT]);

  const deleteMemo = async (memoId) => {
    try {
      // 메모 삭제 delete 요청 보내기
      const response = await memosApi.delete(`${memoId}`);
      console.log("memoDeleteApi: ", response.data);
      handleDelete(memoId);
    } catch (error) {
      console.error("error delete memo api", error);
    }
  };

  // 생성날짜 바로 보이게 처리
  const formatDate = (createdAt) => {
    return dayjs(createdAt).format("YY.MM.DD HH:mm:ss");
  };

  // 메모 삭제
  const openDeleteWarn = (title, memoId) => {
    Swal.fire({
      title: `${title}을 정말로 삭제하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "red",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMemo(memoId);
      }
    });
  };

  // 메모 클릭
  const handleClickSetting = (index) => {
    onMemoClick(index);
  };

  // 삭제버튼 클릭
  const handleDelete = (memoId) => {
    setMemoList(memoList.filter((one, _) => one.memoId != memoId));
  };

  return (
    <div className="absolute left-[10vw] w-[15vw] h-[100vh] flex flex-col justify-between bg-gray-400">
      <div className="flex flex-col gap-5">
        <div>남은 요약 횟수: {3 - countGPT} / 3</div>
        <button onClick={handleTrashButtonClick}>휴지통</button>
        {memoList.map((memo, index) => (
          <div className="gap-5" key={index}>
            <button onClick={() => handleClickSetting(memo.memoId)}>
              {memo.title}
              {formatDate(memo.createdAt)}
            </button>
            {showDeleteButton && (
              <button onClick={() => openDeleteWarn(memo.title, memo.memoId)}>
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// props validation 추가
MemoList.propTypes = {
  onMemoClick: PropTypes.func.isRequired,
  updateCountGPT: PropTypes.func.isRequired,
};
export default MemoList;
