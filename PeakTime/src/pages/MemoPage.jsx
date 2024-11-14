import Title from "../components/common/Title";
import MemoList from "../components/Memo/MemoList"; // 메모 리스트
import MemoDetail from "../components/Memo/MemoDetail"; // 메모 디테일
import { useMemoStore } from "../stores/MemoStore";
import { useEffect } from "react";
import SummaryLoadingOverlay from "../components/Memo/SummaryLoadingOverlay";

function MemoPage() {
  const { selected, isLoading, resetAll } = useMemoStore();

  useEffect(() => {
    return () => {
      resetAll();
    }
  }, [])

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"메모 및 요약"} />

      <div className="h-[90vh] top-[10vh]">
        <MemoList />
        {selected && <MemoDetail />}
      </div>

      {isLoading && <SummaryLoadingOverlay />}
    </div>
  );
}

export default MemoPage;
