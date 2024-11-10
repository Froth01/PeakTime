import PropTypes from "prop-types";
import { useState } from "react";
import presetsApi from "../../api/presetsApi";
import Swal from "sweetalert2";

function PresetSetting({ preset, onCancel, setUpdateTrigger }) {
  const [title, setTitle] = useState(preset.title);

  // 받아온 array []형태로 처리해주기
  const [blockWebsiteArray, setBlockWebsiteArray] = useState([
    ...(preset.blockWebsiteArray || []),
  ]);
  const [blockProgramArray, setBlockProgramArray] = useState([
    ...(preset.blockProgramArray || []),
  ]);

  // 새 버튼 추가
  const [newSite, setNewSite] = useState(""); // 새로운 사이트 추가 입력 필드 상태
  const [newProgram, setNewProgram] = useState(""); // 새로운 사이트 추가 입력 필드 상태

  // 프리셋 아이디로 정보조회해야함
  // 취소버튼 클릭
  const handleCancel = () => {
    onCancel();
  };

  // 사이트, 프로그램 한 줄 삭제 처리(따로 모달 처리 x)
  const handleDeleteSite = (idx) => {
    const updateWebsiteArray = blockWebsiteArray.filter((one, i) => i !== idx);
    console.log("Updated website Array:", updateWebsiteArray); // 상태가 업데이트되는지 확인
    setBlockWebsiteArray([...updateWebsiteArray]);
  };
  const handleDeleteProgram = (idx) => {
    const updateProgramArray = blockProgramArray.filter((one, i) => i !== idx);
    console.log("Updated program Array:", updateProgramArray); // 상태가 업데이트되는지 확인
    setBlockProgramArray([...updateProgramArray]);
  };

  // 사이트, 프로그램 한 줄 추가 처리
  const openAddSiteModal = () => {
    Swal.fire({
      title: "사이트 추가",
      input: "text",
      inputPlaceholder: "사이트 주소를 입력하세요",
      showCancelButton: true,
      confirmButtonText: "저장하기",
      confirmButtonColor: "#90B7DA",
      cancelButtonText: "취소",
      cancelButtonColor: "red",
      preConfirm: (site) => {
        if (!site) {
          Swal.showValidationMessage("사이트 주소를 입력하세요");
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleAddSite(result.value);
      }
    });
  };

  const openAddProgramModal = () => {
    Swal.fire({
      title: "프로그램 추가",
      input: "text",
      inputPlaceholder: "프로그램명을 입력하세요(exe 파일 지원)",
      showCancelButton: true,
      confirmButtonText: "저장하기",
      confirmButtonColor: "#90B7DA",
      cancelButtonText: "취소",
      cancelButtonColor: "red",
      preConfirm: (programName) => {
        if (!programName) {
          Swal.showValidationMessage("프로그램명을 입력하세요");
        }
      },
    }).then((result) => {
      console.log(result.value);
      if (result.isConfirmed && result.value) {
        handleAddProgram(result.value);
      }
    });
  };

  const handleAddSite = (url) => {
    setBlockWebsiteArray([...blockWebsiteArray, url]);
  };
  const handleAddProgram = (programName) => {
    setBlockProgramArray([...blockProgramArray, programName]);
  };

  // 수정하기 클릭 시 값 변경시키기(전체 조회는 이후 또 진행되어서 상관없음)
  const updatePresetPut = async () => {
    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      const requestData = {
        title: title,
        blockWebsiteList: blockWebsiteArray,
        blockProgramList: blockProgramArray,
      };
      const response = await presetsApi.put(`/${preset.presetId}`, requestData);
      console.log("presetUpdatePutApi: ", response.data);
      // 업데이트 후 트리거 변경
      setUpdateTrigger((prev) => !prev); // 상태 변화시키기
      handleCancel(); // 수정 완료 후 닫기
    } catch (error) {
      console.error("Error post Preset:", error);
      throw error;
    }
  };

  const handleUpdatePreset = () => {
    updatePresetPut();
  };

  return (
    <div className="absolute right-0 w-[75vw] h-[100vh] flex flex-col bg-white">
      <h2>{title} 설정</h2>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      ></input>
      <div className="grid gap-2 grid-cols-2">
        <div>
          <h3>사이트 차단 목록</h3>
          <div className="h-96 overflow-y-scroll border border-gray-300 p-2">
            {blockWebsiteArray.map((site, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>{site}</span>
                <button onClick={() => handleDeleteSite(idx)}>x</button>
              </li>
            ))}
          </div>
          <button onClick={openAddSiteModal}>+ 사이트 추가</button>
        </div>
        <div>
          <h3>프로그램 프리셋 내역 들어갈 부분</h3>
          <div className="h-96 overflow-y-scroll border border-gray-300 p-2">
            {blockProgramArray.map((program, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>{program}</span>
                <button onClick={() => handleDeleteProgram(idx)}>x</button>
              </li>
            ))}
          </div>
          <button onClick={openAddProgramModal}>+ 프로그램 추가</button>
        </div>
      </div>
      <button onClick={handleUpdatePreset}>수정완료</button>
      <button onClick={handleCancel}>돌아가기</button>
    </div>
  );
}
// props validation 추가
PresetSetting.propTypes = {
  preset: PropTypes.shape({
    presetId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    blockWebsiteArray: PropTypes.arrayOf(PropTypes.string),
    blockProgramArray: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default PresetSetting;
