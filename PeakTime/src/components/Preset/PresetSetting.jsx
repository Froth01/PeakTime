import PropTypes from "prop-types";

function PresetSetting({ presetId, onCancel }) {
  // 프리셋 아이디로 정보조회해야함
  // 취소버튼 클릭
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="absolute right-0 w-[75vw] h-[100vh] flex flex-col bg-white">
      <div>{presetId} 번째 프리셋 Setting</div>
      <div>사이트차단</div>
      <div>프로그램차단</div>
      <div>버튼들</div>
      <button onClick={handleCancel}>돌아가기</button>
    </div>
  );
}
// props validation 추가
PresetSetting.propTypes = {
  presetId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default PresetSetting;
