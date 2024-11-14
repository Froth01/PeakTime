import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useMemoStore } from "../../stores/MemoStore";
import summariesApi from "../../api/summariesApi";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";
import html2pdf from "html2pdf.js";

function MemoSummary() {
  const { summaryData, resetSummaryData } = useMemoStore();
  const { summaryId, content, updatedAt } = summaryData;

  // 생성날짜 바로 보이게 처리
  const formatDate = (date) => {
    return dayjs(date).format("YY.MM.DD HH:mm:ss");
  };

  // md 형식으로 변환시키기
  const convertToMarkdown = (text) => {
    // 마침표를 기준으로 텍스트를 분할
    const sentences = text.split(/(?<=\.)\s+/);
    let markdown = "";

    // 첫 번째 문장은 제목으로 간주
    markdown += `# ${sentences[0].trim()}\n\n`;

    // 나머지 문장들은 리스트 항목으로 추가
    for (let i = 1; i < sentences.length; i++) {
      const trimmedSentence = sentences[i].trim();
      if (trimmedSentence) {
        markdown += `- ${trimmedSentence}\n`;
      }
    }

    return markdown;
  };

  // markdown 미리보기
  const showMarkdownModal = () => {
    if (!content) {
      Swal.fire("요약된 내용이 없습니다.", "", "warning");
      return;
    }

    const markdownContent = convertToMarkdown(content);

    // SweetAlert2 모달로 Markdown 결과 보여주기
    Swal.fire({
      title: "Markdown 미리보기",
      html: `<pre style="text-align: left; white-space: pre-wrap;">${markdownContent}</pre>`,
      width: 600,
      customClass: {
        popup: "custom-swal-popup",
      },
      // 3개 버튼 사용
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "PDF로 다운로드",
      denyButtonText: "Markdown 파일로 다운로드",
      cancelButtonText: "닫기",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#03C777",
      cancelButtonColor: "#F40000",
    }).then((result) => {
      if (result.isConfirmed) {
        downloadPDFFile(markdownContent);
      } else if (result.isDenied) {
        downloadMDFile(markdownContent);
      }
    });
  };

  // md파일 다운로드
  const downloadMDFile = (content) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `summary_${summaryId}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // pdf 파일 다운로드
  // html 태그로 형성시켜서 pdf로 내보내기
  const downloadPDFFile = (content) => {
    // 마지막 줄에 빈 줄 추가 (잘림 방지)
    content += "\n";

    const element = document.createElement("div");
    element.innerHTML = content
      .replace(/#/g, "<h1>")
      .replace(/\n/g, "<br>")
      .replace(/- /g, "<li>")
      .replace(/<\/li><br>/g, "</li>");

    const options = {
      margin: 1,
      filename: `summary_${summaryId}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }, //inch a4크기 portrait(세로 방향)
    };

    html2pdf().from(element).set(options).save();
  };

  // 요약 삭제
  const deleteSummary = async (summaryId) => {
    try {
      // 메모 삭제 delete 요청 보내기
      const response = await summariesApi.delete(`/${summaryId}`);
      console.log("summaryDeleteApi: ", response.data);

      resetSummaryData();
    } catch (error) {
      console.error("error delete summary api", error);
      Swal.fire({
        title: `요약 삭제를 실패했습니다.`,
        text: "요약 삭제를 실패했습니다. 잠시 후 다시 시도해주세요.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#7C7C7C",
      });
    }
  };

  // 메모 삭제
  const openDeleteWarn = (summaryId) => {
    Swal.fire({
      title: `해당 요약을 정말로 삭제하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#F40000",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSummary(summaryId);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white text-[20px] font-bold mb-3">
        요약
      </h2>
      <div className="flex-grow flex flex-col justify-between">
        {summaryId ? (
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-auto">
              <textarea readOnly className="h-[92%] rounded-xl p-2 w-full custom-scrollbar">{content}</textarea>
              <div className="text-[#C5C5C5] text-start text-[15px] mb-1">작성일시: {formatDate(updatedAt)}</div>
            </div>

            <div className="w-full flex justify-center mt-3 gap-x-3">
              <button className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold" onClick={() => showMarkdownModal()}>
                Markdown 미리보기 및 다운로드
              </button>
              <button className="bg-[#f40000] rounded-xl px-5 py-2 hover:bg-[#d60000] focus:ring-4 focus:ring-[#f40000] text-white font-bold" onClick={() => openDeleteWarn(summaryId)}>
                요약삭제
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center font-bold text-[20px] text-[#C5C5C5]">요약 기록이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default MemoSummary;
