import Swal from "sweetalert2";
import MemoSummary from "./MemoSummary"; // 메모 요약
import memosApi from "../../api/memosApi";
import summariesApi from "../../api/summariesApi";
import { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { useMemoStore } from "../../stores/MemoStore";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";

function MemoDetail() {
  const {
    memoData,
    setMemoData,
    setSummaryData,
    resetSummaryData,
    selected,
    summaryCount,
    setSummaryCount,
    summaryCountLimit,
    isSummary,
    setIsSummary,
    inputText,
    setInputText,
    inputTextLimit,
    resetInputText,
    keywords,
    setKeywords,
    resetKeyWords,
    keywordInput,
    setKeywordInput,
    isLoading,
    setIsLoading,
    keywordInputLimit,
    keywordsLimit,
  } = useMemoStore();

  const [selectedText, setSelectedText] = useState(""); // 드래그 텍스트 저장

  // 특정 메모 및 요약 상세 정보 보기
  const readDetailMemoGet = async () => {
    try {
      // 메모, 요약 상세정보 get api
      const response = await memosApi.get(`/${selected}`);
      console.log("get detail memo api: ", response.data);

      setMemoData({
        title: response.data.data.memoDetail.title,
        content: response.data.data.memoDetail.memoContent,
        createdAt: response.data.data.memoDetail.createdAt,
      });

      if (response.data.data.summaryDetail !== null) {
        setSummaryData({
          summaryId: response.data.data.summaryDetail.summaryId,
          content: response.data.data.summaryDetail.summaryContent,
          updatedAt: response.data.data.summaryDetail.summaryUpdateAt,
        });
        setIsSummary(true);
      } else {
        resetSummaryData();
        setIsSummary(false);
      }
    } catch (error) {
      console.error("Error get detail memo api", error);
      Swal.fire({
        title: "메모 조회 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "메모 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#7C7C7C",
      });
      throw error;
    }
  };

  // MemoList에서 클릭 시 메모 상세조회 실행
  useEffect(() => {
    readDetailMemoGet();
  }, [selected]);

  const summaryGPTPost = async (selected, keywords) => {
    setIsLoading(true);

    try {
      // 요약 요청 post api
      const requestData = {
        content: inputText, // 요약에 작성한 content
        memoId: selected, // 해당 memoId
        keywords: keywords, // 추가 키워드(최대 3개)
      };
      const response = await summariesApi.post(``, requestData);
      console.log("GPTPostApi: ", response.data);
      // 요청 성공 시 countGPT +1 업데이트
      setSummaryCount(summaryCount + 1);

      Swal.fire({
        title: "요약 성공",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "요약이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      // 요청 성공 후 최신 데이터를 다시 가져오기
      await readDetailMemoGet(selected);

      // 질문 입력 내용, 키워드 삭제하고 요약 내용 띄우기
      setInputText("");
      setKeywords([]);
      setIsSummary(true);
    } catch (error) {
      Swal.fire({
        title: "요약 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "요약 요청 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 요약하기 모달 띄우기
  // 사이트, 프로그램 한 줄 추가 처리
  const openSummaryModal = (title, keywords) => {
    Swal.fire({
      title: `📝 ${title} 요약하기`,
      customClass: {
        popup: "custom-swal-popup",
      },
      text: `추가 키워드: ${keywords.join(
        ", "
      )}\n해당 내용으로 요약을 진행하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: "요약하기",
      confirmButtonColor: "#03C777",
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
    }).then((result) => {
      if (result.isConfirmed) {
        // 조건 검사를 먼저 수행
        handleSummaryButton();
      }
    });
  };

  const handleSelection = () => {
    const selected = window.getSelection().toString();
    if (selected) {
      setSelectedText(selected);
    }
  };

  const handleSummaryButton = () => {
    // 1. GPT 사용 횟수가 3번 이상이면 요약을 진행할 수 없다는 알림 표시
    console.log("카운트gpt ", summaryCount);
    if (summaryCount >= summaryCountLimit) {
      Swal.fire({
        title: `요약은 하루 최대 ${summaryCountLimit}번이 가능합니다.`,
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        confirmButtonColor: "#03C777",
      });
      return;
    }
    // 2. 입력된 내용이 비어 있으면 알림 표시
    if (inputText.trim().length === 0) {
      Swal.fire({
        title: "요약 내용이 비어있습니다.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        confirmButtonColor: "#03C777",
      });
      return;
    }
    // 모든 조건이 통과되면 summaryGPTPost 함수 호출
    summaryGPTPost(selected, keywords);
  };

  // 복사하기
  const copyButton = () => {
    const newTextLength = inputText.length + selectedText.trim().length; // inputTextLimit 검증
    if (newTextLength > inputTextLimit) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `복사한 텍스트를 추가하면 ${inputTextLimit}자를 초과합니다.`,
        icon: "error",
        confirmButtonText: "확인",
      }).then(() => {
        setSelectedText("");
        window.getSelection().removeAllRanges();
      }); // 드래그 선택 취소

      return;
    }

    if (selectedText.trim() !== "") {
      // 기존 텍스트가 비어있지 않을때만 줄바꿈해서 넣어주기
      setInputText(inputText ? inputText + "\n" + selectedText : selectedText);
      Swal.fire({
        title: "복사 완료",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "선택한 텍스트가 입력란에 복사되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        setSelectedText("");
        window.getSelection().removeAllRanges(); // 드래그 선택 취소
      });
    } else {
      Swal.fire({
        title: "텍스트 선택 필요",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "먼저 메모 내용에서 텍스트를 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    if (text.length > inputTextLimit) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `최대 ${inputTextLimit}자까지만 입력할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    setInputText(event.target.value);
  };

  // 키워드 입력 핸들러
  const handleKeywordInputChange = (event) => {
    setKeywordInput(event.target.value);
  };

  // 키워드 추가 함수
  const addKeyword = () => {
    if (keywordInput.length > keywordInputLimit) {
      Swal.fire({
        title: "키워드 글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `키워드 글자 수는 최대 ${keywordInputLimit}자까지만 입력할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 추가 키워드의 개수는 최대 세 개
    if (keywords.length >= keywordsLimit) {
      Swal.fire({
        title: "추가 키워드 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `키워드는 최대 ${keywordsLimit}개까지 추가할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 중복 검증 및 빈 단어 x 검증
    if (keywordInput.trim() === "" || keywords.includes(keywordInput.trim())) {
      Swal.fire({
        title: "중복 또는 빈 키워드",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "이미 추가된 키워드거나 비어있는 키워드입니다. 다른 키워드를 입력해주세요/",
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }

    setKeywords([...keywords, keywordInput.trim()]);
    setKeywordInput(""); // 입력 필드 초기화
  };

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter((item) => item !== keyword));
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="w-full text-white text-[30px] font-bold pb-3 border-b mb-5">
        {memoData.title}
      </h2>

      <div className="flex h-full w-full gap-x-5 px-3">
        <div className="flex flex-col justify-between h-full w-[60%]">
          <h2 className="text-white text-[20px] font-bold mb-3">기록된 메모</h2>
          <div className="h-full flex flex-col justify-between">
            <div
              className="h-[90%] text-left overflow-y-scroll p-3 bg-white custom-scrollbar mb-5"
              onMouseUp={(event) => {
                event.stopPropagation(); // 이벤트 전파 막기
                handleSelection();
              }}
            >
              {memoData.content}
            </div>

            <div className="flex justify-end gap-x-5">
              {!isSummary && (
                <button
                  onClick={() => copyButton()}
                  className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                >
                  복사하기
                </button>
              )}
              <button
                onClick={() => setIsSummary(!isSummary)}
                className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white"
              >
                {isSummary ? "질문입력" : "요약보기"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-[40%] h-full">
          {!isSummary ? (
            <>
              <h2 className="text-white text-[20px] font-bold mb-3">
                질문 입력
              </h2>
              <div className="h-full flex flex-col justify-between">
                <div className="flex flex-col justify-between h-[90%] mb-5">
                  <div className="flex flex-col justify-between h-full">
                    <textarea
                      type="text"
                      value={inputText}
                      onChange={handleInputChange}
                      placeholder="요약하고 싶은 내용을 작성하세요. 메모에서 드래그한 내용을 붙여넣기가 가능합니다."
                      className="h-[92%] rounded-xl p-2 w-full custom-scrollbar"
                    />
                    <div className="text-[#C5C5C5] text-start text-[15px] my-2">
                      현재 입력 글자 수: {inputText.length} / {inputTextLimit}
                    </div>
                  </div>
                  {/* 추가 키워드 입력 필드 */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={handleKeywordInputChange}
                        placeholder="추가 키워드를 입력하세요"
                        className="border border-gray-300 p-2 w-full rounded-xl"
                      />
                      {/* 키워드 추가 버튼 (아이콘 형식) */}
                      <button
                        onClick={() => addKeyword()}
                        className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white"
                        aria-label="키워드 추가"
                      >
                        +
                      </button>
                    </div>
                    {/* 추가된 키워드 리스트 표시 */}
                    <div className="mt-2">
                      <h3 className="text-[#C5C5C5] text-start text-[15px] mb-1">
                        추가된 키워드({keywords.length} / {keywordsLimit}):
                      </h3>
                      <div className="flex flex-wrap grid grid-cols-2 gap-2">
                        {keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="flex justify-between items-center bg-[#66aadf] rounded-xl hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white px-2 py-1 mx-1 cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword}
                            <TiDelete />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center gap-x-3">
                  <button
                    className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                    onClick={() => openSummaryModal(memoData.title, keywords)}
                  >
                    요약하기
                  </button>
                  <button
                    className="text-white font-bold px-5 py-2 rounded-xl bg-[#7C7C7C] hover:bg-[#5C5C5C]"
                    onClick={() => {
                      resetInputText();
                      resetKeyWords();
                    }}
                  >
                    내용삭제
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <MemoSummary />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoDetail;
