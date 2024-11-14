import { create } from "zustand";

const initialState = {
  memoList: [],
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

  selected: null,
  isSummary: false,

  inputText: "", // input box text
  keywords: [],
  keywordInput: "",

  isLoading: false, // summary 중 LoadingSpinner
};

export const useMemoStore = create((set) => ({
  ...initialState,

  memoListLimit: 10, // 메모 최대한도 수
  summaryCountLimit: 3, // 요약 최대한도 수
  inputTextLimit: 1000,

  setMemoList: (memoList) => set({ memoList: [...memoList] }),
  setSummaryCount: (count) => set({ summaryCount: count }),
  setMemoData: (memoData) => set({ memoData: memoData }),
  setSummaryData: (summaryData) => set({ summaryData: summaryData }),

  setSelected: (selected) => set({ selected: selected }),
  setIsSummary: (isSummary) => set({ isSummary: isSummary }),

  setInputText: (text) => set({ inputText: text }),
  setKeywords: (keywords) => set({ keywords: [...keywords] }),
  setKeywordInput: (keyword) => set({ keywordInput: keyword }),

  setIsLoading: (bool) => set({ isLoading: bool }),

  resetInputText: () => set({ inputText: initialState.inputText }),
  resetKeyWords: () => set({ keywords: initialState.keywords }),
  resetSummaryData: () => set({ summaryData: initialState.summaryData }),
  resetAll: () => set({ ...initialState }),
}));
