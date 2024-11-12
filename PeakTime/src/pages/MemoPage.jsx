import { useState } from "react";
import MemoList from "../components/Memo/MemoList"; // 메모 리스트
import MemoDetail from "../components/Memo/MemoDetail"; // 메모 디테일

function MemoPage() {
  // 선택한 메모 정보
  const [selected, setSelected] = useState(null);
  const [countGPT, setCountGPT] = useState(null); // 초기 상태 null으로 GPT 사용 횟수 상태 표기

  const onMemoClick = (memoId) => {
    setSelected(memoId); // 선택된 memoId를 상태로 설정
  };
  const updateCountGPT = (gptCount) => {
    setCountGPT(gptCount); // 선택된 memoId를 상태로 설정
  };

  return (
    <>
      <MemoList onMemoClick={onMemoClick} updateCountGPT={updateCountGPT} />
      {selected && <MemoDetail memoId={selected} countGPT={countGPT} />}
    </>
  );
}

export default MemoPage;
