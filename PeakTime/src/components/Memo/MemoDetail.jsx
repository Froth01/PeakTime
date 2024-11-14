import PropTypes from "prop-types";
import Swal from "sweetalert2";
import MemoSummary from "./MemoSummary"; // 메모 요약
import memosApi from "../../api/memosApi";
import summariesApi from "../../api/summariesApi";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";

function MemoDetail({ memoId, countGPT, updateCountGPT }) {
  // 메모 id로 정보조회해야함
  // data는 json 형태로 정리
  const [memoData, setMemoData] = useState({
    title: "",
    content: "",
    createdAt: "",
  });

  const [summaryData, setSummaryData] = useState({
    summaryId: null,
    content: "",
    updatedAt: "",
  });

  const [isSummary, setIsSummary] = useState(false);

  const [selectedText, setSelectedText] = useState(""); // 드래그 텍스트 저장
  const [inputText, setInputText] = useState(""); // Input Box 텍스트

  const [keywords, setKeywords] = useState([]); // 추가 키워드 리스트
  const [keywordInput, setKeywordInput] = useState(""); // 키워드 입력 필드

  useEffect(() => {
    // 새로운 메모를 조회할 때마다 summaryData 초기화
    setSummaryData({
      summaryId: null,
      content: "",
      updatedAt: "",
    });
    readDetailMemoGet(memoId);
  }, [memoId]);

  // 특정 메모 및 요약 상세 정보 보기
  const readDetailMemoGet = async () => {
    try {
      // 메모, 요약 상세정보 get api
      const response = await memosApi.get(`${memoId}`);
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
      } else {
        setSummaryData({
          summaryId: null,
          content: "",
          updatedAt: "",
        });
      }
    } catch (error) {
      console.error("Error get detail memo api", error);
      throw error;
    }
  };
  const summaryGPTPost = async (memoId, keywords) => {
    try {
      // 요약 요청 post api
      const requestData = {
        content: inputText, // 요약에 작성한 content
        memoId: memoId, // 해당 memoId
        keywords: keywords, // 추가 키워드(최대 3개)
      };
      const response = await summariesApi.post(``, requestData);
      console.log("GPTPostApi: ", response.data);
      // 요청 성공 시 countGPT +1 업데이트
      updateCountGPT(countGPT + 1);

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
      await readDetailMemoGet(memoId);
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
    }
  };

  // 생성날짜 바로 보이게 처리
  const formatDate = (createdAt) => {
    return dayjs(createdAt).format("YY.MM.DD HH:mm:ss");
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
      confirmButtonColor: "#90B7DA",
      cancelButtonText: "취소",
      cancelButtonColor: "red",
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
    console.log("카운트gpt ", countGPT);
    if (countGPT >= 3) {
      Swal.fire({
        title: "요약은 하루 최대 3번이 가능합니다.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        confirmButtonColor: "green",
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
        confirmButtonColor: "green",
      });
      return;
    }
    // 모든 조건이 통과되면 summaryGPTPost 함수 호출
    summaryGPTPost(memoId, keywords);
  };

  // 복사하기
  const copyButton = () => {
    const newTextLength = inputText.length + selectedText.trim().length; // 1000자 검증
    if (newTextLength > 1000) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "복사한 텍스트를 추가하면 1000자를 초과합니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    if (selectedText.trim() !== "") {
      // 기존 텍스트가 비어있지 않을때만 줄바꿈해서 넣어주기
      setInputText((text) =>
        text ? text + "\n" + selectedText : selectedText
      );
      Swal.fire({
        title: "복사 완료",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "선택한 텍스트가 입력란에 복사되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
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
    if (text.length > 1000) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "최대 1000자까지만 입력할 수 있습니다.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
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
    if (keywordInput.length > 10) {
      Swal.fire({
        title: "키워드 글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "키워드 글자 수는 최대 10자까지만 입력할 수 있습니다.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      return;
    }
    // 추가 키워드의 개수는 최대 세 개
    if (keywords.length >= 3) {
      Swal.fire({
        title: "추가 키워드 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "키워드는 최대 3개까지 추가할 수 있습니다.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
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
        confirmButtonColor: "#3085d6",
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

      <div className="flex h-full w-full gap-x-3">
        <div className="rounded-lg pl-3 h-full w-full">
          <div className="flex grid grid-cols-3">
            <div></div>
            <h2 className="text-white text-[20px] font-bold mb-3">메모</h2>
            <button
              onClick={() => setIsSummary(!isSummary)}
              className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
            >
              {isSummary ? "질문입력" : "요약보기"}
            </button>
          </div>
          <div
            className="h-[85%] text-left overflow-y-scroll p-3 bg-white custom-scrollbar mb-5 mr-5"
            onMouseUp={(event) => {
              event.stopPropagation(); // 이벤트 전파 막기
              handleSelection();
            }}
          >
            {memoData.content}
          </div>

          {!isSummary && (
            <button
              onClick={() => copyButton()}
              className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
            >
              복사하기
            </button>
          )}
        </div>

        <div className="w-[50%] h-[90%]">
          {!isSummary ? (
            <>
              <h2 className="text-white text-[20px] font-bold mb-3">
                질문 입력
              </h2>
              <textarea
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="요약하고 싶은 내용을 작성하세요"
                className="h-[80%] rounded-lb p-2 w-full custom-scrollbar"
              />
              <div className="text-white">
                현재 내용 글자 수 {inputText.length}/1000
              </div>
              {/* 추가 키워드 입력 필드 */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                  placeholder="추가 키워드를 입력하세요"
                  className="border border-gray-300 p-2 w-full"
                />
                {/* 키워드 추가 버튼 (아이콘 형식) */}
                <button
                  onClick={addKeyword}
                  className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold"
                  aria-label="키워드 추가"
                >
                  ✔
                </button>
              </div>
              {/* 추가된 키워드 리스트 표시 */}
              <div className="mt-2">
                <h3 className="text-white">추가된 키워드:</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 p-1 rounded cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ✕
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  현재 키워드 개수: {keywords.length} / 3
                </p>
              </div>

              <button
                className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                onClick={() => openSummaryModal(memoData.title, keywords)}
              >
                요약하기
              </button>
            </>
          ) : (
            <>
              <MemoSummary data={summaryData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// props validation 추가
MemoDetail.propTypes = {
  memoId: PropTypes.number.isRequired,
  countGPT: PropTypes.number.isRequired,
  updateCountGPT: PropTypes.func.isRequired,
};
export default MemoDetail;
