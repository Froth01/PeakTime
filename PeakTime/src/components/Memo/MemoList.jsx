import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import memosApi from "../../api/memosApi";
import dayjs from "dayjs";
import { TiDelete } from "react-icons/ti";
import { FaTrashAlt } from "react-icons/fa";
import { useMemoStore } from "../../stores/MemoStore";
import "../../styles/daily-report-custom-swal.css";

function MemoList() {
  const { memoList, setMemoList, memoListLimit, summaryCount, setSummaryCount, summaryCountLimit, setSelected } = useMemoStore();

  // 메모 리스트
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    fetchGetMemoList();
  }, []);

  const fetchGetMemoList = async () => {
    try {
      // 메모 전체 조회 GET 요청을 보내기
      const response = await memosApi.get(``);
      console.log("memoListGetApi: ", response.data);
      const memoList = response.data.data.memoList;
      const summaryCount = response.data.data.summaryCount;
      setMemoList([...memoList]); // 상태를 업데이트하여 UI에 반영
      setSummaryCount(summaryCount);
    } catch (error) {
      console.error("Error fetching memoList:", error);
      throw error;
    }
  };

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
      confirmButtonColor: "#F40000",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMemo(memoId);
      }
    });
  };

  // 삭제버튼 클릭
  const handleDelete = (memoId) => {
    setMemoList(memoList.filter((one, _) => one.memoId != memoId));
  };

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center text-start p-5">
      <div className="flex flex-col">
        <div className="flex justify-between text-white mb-3">
          <h2 className="text-[30px] font-bold">
            메모({memoList?.length} / {memoListLimit})
          </h2>
          <button
            className="text-white text-[30px]"
            onClick={() => setShowDeleteButton(!showDeleteButton)}
          >
            <FaTrashAlt />
          </button>
        </div>

        <div className="flex flex-col gap-5 bg-white text-[20px] w-[25vw] h-[70vh] overflow-y-auto rounded-lg p-5 custom-scrollbar mb-3">
          {memoList.map((memo, index) => (
            <div
              className={`flex justify-between mx-2 pb-2 ${
                index === memoList.length - 1 ? "" : "border-b"
              }`}
              key={index}
            >
              <button
                className="w-[90%] flex flex-col"
                onClick={() => setSelected(memo.memoId)}
              >
                <div className="font-bold mb-2">{memo.title}</div>
                <div className="text-[18px]">{formatDate(memo.createdAt)}</div>
              </button>
              <div className="flex justify-end w-[10%]">
                {showDeleteButton && (
                  <button
                    className="text-[30px]"
                    onClick={() => openDeleteWarn(memo.title, memo.memoId)}
                  >
                    <TiDelete />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full text-white text-[25px] flex justify-end mb-3">
          <div className="text-white font-bold text-[20px]">
            남은 요약 횟수: {summaryCountLimit - summaryCount} / {summaryCountLimit}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoList;
