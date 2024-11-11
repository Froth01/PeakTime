import { useState } from "react";
import PresetList from "../components/Preset/PresetList"; // 프리셋 리스트
import PresetSetting from "../components/Preset/PresetSetting";

function PresetSettingPage() {
  // 선택한 프리셋 정보
  const [selected, setSelected] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false); // setting에서 list로 변경됨을 알려주는 trigger

  const onPresetClick = (preset) => {
    setSelected(preset); // 선택된 presetId를 상태로 설정
  };

  // 설정창 돌아가기
  const onCancel = () => {
    setSelected(null);
  };

  return (
    <>
      <PresetList
        onPresetClick={(preset) => onPresetClick(preset)}
        updateTrigger={updateTrigger}
      />
      {selected && (
        <PresetSetting
          preset={selected}
          onCancel={onCancel}
          setUpdateTrigger={setUpdateTrigger}
        />
      )}
    </>
  );
}

export default PresetSettingPage;