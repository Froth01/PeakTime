import { create } from "zustand";

const initialState = {
  // 메모
  memoList: [],
  memoData: {
    title: "",
    content: "",
    createdAt: "",
  },
  memoPage: 0,
  isMemoLastPage: false,
  selectedMemo: null,

  // 요약
  summaryList: [],
  summaryData: {
    summaryId: null,
    content: "",
    updatedAt: "",
  },
  summaryPage: 0,
  isSummaryLastPage: false,
  selectedSummary: null,

  // 요약 입력 등
  summaryCount: 0,
  isSummary: false,

  inputText: "", // input box text
  keywords: [],
  keywordInput: "",

  isLoading: false, // summary 중 LoadingSpinner
};

export const useMemoStore = create((set) => ({
  ...initialState,

  activeTab: "memo",
  summaryCountLimit: 3, // 요약 최대한도 수
  inputTextLimit: 1000,
  keywordInputLimit: 10, // 키워드 하나당 최대 글자 길이
  keywordsLimit: 3, // 최대 키워드 input 수

  setActiveTab: (value) => set({ activeTab: value }),
  setMemoList: (addMemoList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isMemoLastPage;

    if (isLastPage) return;

    const list = useMemoStore.getState().memoList;
    const pageNow = useMemoStore.getState().page;
    const pageNew = !isLastPage ? pageNow + 1 : pageNow;

    set({
      memoList: [...list, ...addMemoList],
      memoPage: pageNew,
      isMemoLastPage: newIsLastPage,
    });
  },
  setSummaryList: (addSummaryList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isSummaryLastPage;

    if (isLastPage) return;

    const list = useMemoStore.getState().summaryList;
    const pageNow = useMemoStore.getState().page;
    const pageNew = !isLastPage ? pageNow + 1 : pageNow;

    set({
      summaryList: [...list, ...addSummaryList],
      summaryPage: pageNew,
      isSummaryLastPage: newIsLastPage,
    });
  },
  setSummaryCount: (count) => set({ summaryCount: count }),
  setMemoData: (memoData) => set({ memoData: memoData }),
  setSummaryData: (summaryData) => set({ summaryData: summaryData }),

  setSelectedMemo: (selectedMemo) => set({ selectedMemo: selectedMemo }),
  setSelectedSummary: (selectedSummary) =>
    set({ selectedSummary: selectedSummary }),
  setIsSummary: (isSummary) => set({ isSummary: isSummary }),

  setInputText: (text) => set({ inputText: text }),
  setKeywords: (keywords) => set({ keywords: [...keywords] }),
  setKeywordInput: (keyword) => set({ keywordInput: keyword }),

  setIsLoading: (bool) => set({ isLoading: bool }),

  resetMemoContent: () =>
    set({
      memoList: initialState.memoList,
      memoData: initialState.memoData,
      selectedMemo: initialState.selectedMemo,
      memoPage: initialState.memoPage,
      isMemoLastPage: initialState.isMemoLastPage,
    }),
  resetSummaryContent: () =>
    set({
      summaryList: initialState.summaryList,
      summaryData: initialState.summaryData,
      selectedSummary: initialState.selectedSummary,
      summaryPage: initialState.summaryPage,
      isSummaryLastPage: initialState.isSummaryLastPage,
    }),
  resetInputText: () => set({ inputText: initialState.inputText }),
  resetKeyWords: () => set({ keywords: initialState.keywords }),
  resetSummaryData: () => set({ summaryData: initialState.summaryData }),
  resetAll: () => set({ ...initialState }),
}));
