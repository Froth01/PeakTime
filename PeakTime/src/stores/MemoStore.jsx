import { create } from "zustand";

const initialState = {
  memoList: [],
  page: 0,
  isLastPage: false,

  summaryList: [],

  summaryCount: 0,
  memoData: {
    title: "",
    content: "",
    createdAt: "",
  },
  summaryData: {
    summaryId: null,
    content: "",
    updatedAt: "",
  },

  selectedMemo: null,
  selectedSummary: null,
  isSummary: false,

  inputText: "", // input box text
  keywords: [],
  keywordInput: "",

  isLoading: false, // summary 중 LoadingSpinner
};

export const useMemoStore = create((set) => ({
  ...initialState,

  summaryCountLimit: 3, // 요약 최대한도 수
  inputTextLimit: 1000,
  keywordInputLimit: 10, // 키워드 하나당 최대 글자 길이
  keywordsLimit: 3, // 최대 키워드 input 수

  setMemoList: (addMemoList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isLastPage;

    if (isLastPage) return;

    const list = useMemoStore.getState().memoList;
    const pageNow = useMemoStore.getState().page;
    const pageNew = !isLastPage ? pageNow + 1 : pageNow;

    set({
      memoList: [...list, ...addMemoList],
      page: pageNew,
      isLastPage: newIsLastPage,
    });
  },
  setSummaryList: (addSummaryList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isLastPage;

    if (isLastPage) return;

    const list = useMemoStore.getState().summaryList;
    const pageNow = useMemoStore.getState().page;
    const pageNew = !isLastPage ? pageNow + 1 : pageNow;

    set({
      summaryList: [...list, ...addSummaryList],
      page: pageNew,
      isLastPage: newIsLastPage,
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

  resetPage: () => set({ page: initialState.page }),
  resetInputText: () => set({ inputText: initialState.inputText }),
  resetKeyWords: () => set({ keywords: initialState.keywords }),
  resetSummaryData: () => set({ summaryData: initialState.summaryData }),
  resetAll: () => set({ ...initialState }),
}));
