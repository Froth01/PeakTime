import { useState } from "react";
import MemoList from "../components/Memo/MemoList"; // 메모 리스트
import MemoDetail from "../components/Memo/MemoDetail"; // 메모 디테일

function MemoPage() {
  // 선택한 메모 정보
  const [selected, setSelected] = useState(null);

  const onMemoClick = (presetId) => {
    setSelected(presetId + 1); // 선택된 presetId를 상태로 설정
  };

  return (
    <>
      <MemoList onMemoClick={(id) => onMemoClick(id)} />
      {selected && <MemoDetail memoId={selected} />}
    </>
  );
}

export default MemoPage;
