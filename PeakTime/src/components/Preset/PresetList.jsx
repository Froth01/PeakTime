import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import presetsApi from "../../api/presetsApi";
import PresetSetting from "./PresetSetting";
import { FaTrashAlt } from "react-icons/fa";

function PresetList({ onPresetClick, updateTrigger }) {
  // 프리셋 리스트 api 요청 필요

  // 선택한 프리셋의 정보를 setting에 보내주기
  const [presetList, setPresetList] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 전체 조회를 수행하여 초기 데이터를 설정
    fetchGetPresets();
  }, [updateTrigger]);

  const fetchGetPresets = async () => {
    try {
      // 프리셋 전체 조회 GET 요청을 보내기
      const response = await presetsApi.get(``);
      console.log("presetGetApi: ", response.data);
      const presetList = response.data.data.presetList;
      setPresetList([...presetList]); // 상태를 업데이트하여 UI에 반영
      return response;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  };

  const makePresetPost = async () => {
    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      const requestData = {
        title: "새 프리셋",
        blockWebsiteList: [],
        blockProgramList: [],
      };
      const response = await presetsApi.post(``, requestData);
      console.log("presetPostApi: ", response.data);
      await fetchGetPresets(); // 보낸 뒤 새로운 PresetList를 다시 받아옴
    } catch (error) {
      console.error("Error post Preset:", error);
      throw error;
    }
  };

  const deletePreset = async (presetId) => {
    try {
      // 프리셋 delete 요청을 보내기
      console.log("delete 프리셋 아이디 ", presetId);
      const response = await presetsApi.delete(`/${presetId}`);
      console.log("presetDeleteApi: ", response.data);
      await fetchGetPresets(); // 보낸 뒤 새로운 PresetList를 다시 받아옴
    } catch (error) {
      console.error("Error delete Preset:", error);
      throw error;
    }
  };

  // 삭제 버튼 클릭
  const openDeleteWarn = (title, presetId) => {
    Swal.fire({
      title: `${title}을 정말로 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "red",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePreset(presetId);
      }
    });
  };

  // 프리셋 클릭
  const handleClickSetting = (preset) => {
    onPresetClick(preset); // preset을 띄워주세요
  };

  // 추가버튼 클릭 api 요청 추가
  const handleAddBtn = () => {
    if (presetList.length < 5) {
      makePresetPost();
      // setPresetList([...presetList]);
      // 프리셋 생성 api 진행
    } else {
      Swal.fire({
        title: "프리셋 최대 5개까지 생성이 가능합니다.",
        icon: "error",
        confirmButtonColor: "green",
      });
    }
  };

  // 삭제버튼 클릭
  // const handleDelete = (presetId) => {
  //   setPresetList(presetList.filter((one, _) => one.presetId !== presetId));
  // };

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center text-start p-5">
      <div className="w-full mb-3 flex justify-between items-start">
        <h2 className="self-start text-white font-bold text-[30px]">
          차단 프리셋 목록
        </h2>
      </div>

      <div className="flex flex-col gap-5 bg-white text-[20px] w-[25vw] h-[70vh] overflow-y-auto rounded-lg p-5 font-bold">
        {presetList.map((preset, index) => (
          <div className="gap-5 flex justify-between" key={index}>
            <button onClick={() => handleClickSetting(preset)}>
              {preset.title}
            </button>
            <button
              className="text-[23px]"
              onClick={() => openDeleteWarn(preset.title, preset.presetId)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      <div className="self-start mt-3">
        {presetList.length < 5 ? (
          <button
            className="text-white font-bold text-[20px]"
            onClick={handleAddBtn}
          >
            +차단 프리셋 추가
          </button>
        ) : null}
      </div>
    </div>
  );
}
// props validation 추가
PresetList.propTypes = {
  onPresetClick: PropTypes.func.isRequired,
};
export default PresetList;
