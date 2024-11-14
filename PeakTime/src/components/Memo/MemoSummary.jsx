import PropTypes from "prop-types";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import summariesApi from "../../api/summariesApi";
import "../../styles/daily-report-custom-swal.css";

function MemoSummary({ data }) {
  const { summaryId, content, updatedAt } = data;

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
      showCancelButton: true,
      confirmButtonText: "다운로드",
      cancelButtonText: "닫기",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        downloadMDFile(markdownContent);
      }
    });
  };

  const downloadMDFile = (content) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `summary_${summaryId}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 요약 삭제
  const deleteSummary = async (summaryId) => {
    try {
      // 메모 삭제 delete 요청 보내기
      const response = await summariesApi.delete(`${summaryId}`);
      console.log("summaryDeleteApi: ", response.data);
      handleDelete(summaryId);
    } catch (error) {
      console.error("error delete summary api", error);
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
      confirmButtonColor: "red",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSummary(summaryId);
      }
    });
  };

  return (
    <div className="h-72 overflow-y-scroll border border-gray-300 p-2">
      {summaryId ? (
        <div>
          <h2>요약 ID: {summaryId}</h2>
          <p>{content}</p>
          <p>업데이트 날짜: {formatDate(updatedAt)}</p>
          <button onClick={() => openDeleteWarn(summaryId)}>
            요약 삭제하기
          </button>
          <button onClick={showMarkdownModal} style={{ marginLeft: "10px" }}>
            Markdown 미리보기 및 다운로드
          </button>
        </div>
      ) : (
        <p>요약한 정보가 없습니다.</p>
      )}
    </div>
  );
}

MemoSummary.propTypes = {
  data: PropTypes.shape({
    summaryId: PropTypes.number,
    content: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default MemoSummary;
