import PropTypes from "prop-types";
import MemoSummary from "./MemoSummary"; // 메모 요약

function MemoDetail({ memoId }) {
  // 메모 id로 정보조회해야함

  return (
    <div className="absolute right-0 w-[75vw] h-[100vh] flex flex-col bg-white">
      <div className="h-[50%] w-[100%] flex">
        <div className="w-[50%] h-[100%] bg-red-100">
          {memoId} 번째 메모내용{" "}
        </div>
        <div className="w-[50%] h-[100%] bg-blue-100">요약하려고 가져올것</div>
      </div>
      <div className="w-[100%] h-[50%] bg-green-100">
        <MemoSummary />
      </div>
    </div>
  );
}
// props validation 추가
MemoDetail.propTypes = {
  memoId: PropTypes.number.isRequired,
};
export default MemoDetail;
