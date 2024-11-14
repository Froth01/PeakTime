import { useState } from "react";
import Title from "../components/common/Title";
import MemoList from "../components/Memo/MemoList"; // 메모 리스트
import MemoDetail from "../components/Memo/MemoDetail"; // 메모 디테일

function MemoPage() {
  // 선택한 메모 정보
  const [selected, setSelected] = useState(null);
  const [countGPT, setCountGPT] = useState(0); // 초기 상태 0으로 GPT 사용 횟수 상태 표기

  const onMemoClick = (memoId) => {
    setSelected(memoId); // 선택된 memoId를 상태로 설정
  };
  const updateCountGPT = (newCnt) => {
    setCountGPT(newCnt); // 선택된 memoId를 상태로 설정
  };

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"메모 및 요약"} />

      <div className="h-[90vh] top-[10vh]">
        <MemoList onMemoClick={onMemoClick} updateCountGPT={updateCountGPT} />
        {selected && (
          <MemoDetail
            memoId={selected}
            countGPT={countGPT}
            updateCountGPT={updateCountGPT}
          />
        )}
      </div>
    </div>
  );
}

export default MemoPage;
