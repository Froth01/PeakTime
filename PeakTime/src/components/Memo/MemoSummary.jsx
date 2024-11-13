import PropTypes from "prop-types";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import summariesApi from "../../api/summariesApi";

function MemoSummary({ data }) {
  const { summaryId, content, updatedAt } = data;

  // 생성날짜 바로 보이게 처리
  const formatDate = (date) => {
    return dayjs(date).format("YY.MM.DD HH:mm:ss");
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
