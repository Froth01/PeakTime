import PropTypes from "prop-types";
import { useState } from "react";
import presetsApi from "../../api/presetsApi";
import Swal from "sweetalert2";
import "../../styles/custom-scrollbar.css";

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
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between text-white">
      <h2 className="text-[30px] font-bold">{title} 설정</h2>
      <input
        type="text"
        value={title}
        className="rounded-lg text-black focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
        onChange={(event) => setTitle(event.target.value)}
      />
      <div className="grid gap-5 grid-cols-2 w-full">
        <div>
          <h3 className="text-[30px] font-bold mb-5">사이트 차단 목록</h3>
          <div className="h-[40vh] overflow-y-scroll border border-white p-3 custom-scrollbar">
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
          <h3 className="text-[30px] font-bold mb-5">프로그램 차단 목록</h3>
          <div className="h-[40vh] overflow-y-scroll border border-white p-3 custom-scrollbar">
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
  setUpdateTrigger: PropTypes.func.isRequired,
};
export default PresetSetting;
