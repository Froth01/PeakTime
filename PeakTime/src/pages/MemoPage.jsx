import Title from "../components/common/Title";
import MemoList from "../components/Memo/MemoList"; // 메모 리스트
import MemoDetail from "../components/Memo/MemoDetail"; // 메모 디테일
import { useMemoStore } from "../stores/MemoStore";
import { useEffect, useState } from "react";
import SummaryLoadingOverlay from "../components/Memo/SummaryLoadingOverlay";
import SummaryList from "../components/Memo/SummaryList";
import SummaryDetail from "../components/Memo/SummaryDetail";

function MemoPage() {
  const { selectedMemo, selectedSummary, isLoading, resetPage, resetAll } =
    useMemoStore();
  // memo, summary 탭 상태 보이기
  const [activeTab, setActiveTab] = useState("memo");

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"메모 및 요약"} />
      {/* 탭 네비게이션 */}
      <div className="flex justify-center mb-3">
        <button
          className={`px-4 py-2 ${
            activeTab === "memo" ? "font-bold text-white" : ""
          }`}
          onClick={() => {
            setActiveTab("memo");
            resetAll();
          }}
        >
          메모보기
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "summary" ? "font-bold text-white" : ""
          }`}
          onClick={() => {
            setActiveTab("summary");
            resetAll();
          }}
        >
          요약 내용 보기
        </button>
      </div>

      <div className="h-[90vh] top-[10vh]">
        {activeTab === "memo" && (
          <>
            <MemoList />
            {selectedMemo && <MemoDetail />}
          </>
        )}
        {activeTab === "summary" && (
          <>
            <SummaryList />
            {selectedSummary && <SummaryDetail />}
          </>
        )}
      </div>

      {isLoading && <SummaryLoadingOverlay />}
    </div>
  );
}

export default MemoPage;
