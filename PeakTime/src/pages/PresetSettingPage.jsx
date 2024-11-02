import { useState } from "react";
import PresetList from "../components/Preset/PresetList"; // 프리셋 리스트
import PresetSetting from "../components/Preset/PresetSetting";

function PresetSettingPage() {
  // 선택한 프리셋 정보
  const [selected, setSelected] = useState(null);

  const onPresetClick = (presetId) => {
    setSelected(presetId + 1); // 선택된 presetId를 상태로 설정
  };

  // 설정창 돌아가기
  const onCancel = () => {
    setSelected(null);
  };

  return (
    <>
      <PresetList onPresetClick={(id) => onPresetClick(id)} />
      {selected && <PresetSetting presetId={selected} onCancel={onCancel} />}
    </>
  );
}

export default PresetSettingPage;
