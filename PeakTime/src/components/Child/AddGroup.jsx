import PropTypes from "prop-types";

function AddGroup({ onChangeContent }) {
  // 생성하기 클릭
  const handleConfirm = () => {
    onChangeContent(null);
  };

  // 닫기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>AddGroup</h2>

      <button onClick={handleConfirm}>생성하기</button>
      <button onClick={handleCancel}>닫기</button>
    </div>
  );
}
// props validation 추가
AddGroup.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
};
export default AddGroup;
