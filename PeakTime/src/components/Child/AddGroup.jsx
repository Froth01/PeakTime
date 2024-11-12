import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import groupsApi from "../../api/groupsApi";
import presetsApi from "../../api/presetsApi";
import Swal from "sweetalert2";
import { IoIosArrowDown } from "react-icons/io";

function AddGroup({ onChangeContent, onChangeGroupList }) {
  // 그룹명, 프리셋 아이디
  const [title, setTitle] = useState(null);
  const [presetId, setPresetId] = useState(null);
  const [presetList, setPresetList] = useState([]);

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const ALERT_MESSAGE = {
    // 그룹명이나 프리셋을 지정하지 않았을 때
    warningForIncompleteInput: {
      title: "새 그룹 생성 경고",
      text: !title ? "그룹명을 입력해주세요." : "프리셋을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 생성 성공 시
    successToCreateGroup: {
      title: "새 그룹 생성 성공",
      text: "새 그룹이 생성되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹명 중복 시
    duplicateGroupTitleError: {
      title: "그룹명 중복 경고",
      text: "입력한 그룹 이름이 이미 존재합니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 생성 한도 초과 시
    groupCreationLimitExceeded: {
      title: "그룹 생성 한도 초과",
      text: "생성할 수 있는 그룹 수를 초과했습니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹명 길이 초과 시
    groupTitleLengthExceeded: {
      title: "그룹명 길이 초과",
      text: "그룹명은 최대 32자까지 입력할 수 있습니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 기타 그룹 생성 실패 시
    failToCreateGroup: {
      title: "그룹 생성 실패",
      text: "그룹 생성을 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
  };

  // 프리셋 조회 API 호출
  useEffect(() => {
    presetsApi
      .get("")
      .then((result) => setPresetList(result.data.data.presetList))
      .catch();
  }, []);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangePresetId = (presetId) => {
    setPresetId(presetId);
  };

  // 생성하기 클릭
  const handleConfirm = () => {
    // 그룹명이나 프리셋을 지정하지 않았을 때 경고 메시지 출력
    if (!title || !presetId) {
      Swal.fire(ALERT_MESSAGE.warningForIncompleteInput);
      return;
    }

    // 그룹명 길이 초과 시
    if (title.length > 32) {
      Swal.fire(ALERT_MESSAGE.groupTitleLengthExceeded);
      return;
    }

    const fetchCreateGroup = async () => {
      groupsApi
        .post("", { title, presetId })
        .then((result) => {
          // 새 그룹 생성 성공 알림창
          Swal.fire(ALERT_MESSAGE.successToCreateGroup).then(() => {
            // 그룹 목록 갱신
            onChangeGroupList(result.data.data.groupList);
            onChangeContent(null);
          });
        })
        .catch((err) => {
          switch (err.status) {
            // 중복된 그룹명이 있을 경우
            case 409:
              Swal.fire(ALERT_MESSAGE.duplicateGroupTitleError);
              break;
            // 그룹 수 제한을 초과해 생성을 시도하는 경우
            case 422:
              Swal.fire(ALERT_MESSAGE.groupCreationLimitExceeded);
              break;
            default:
              Swal.fire(ALERT_MESSAGE.failToCreateGroup);
              break;
          }
        });
    };

    fetchCreateGroup();
  };

  // 닫기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  return (
    <>
      <style>
        {`
      select option {
        background: #c5c5c5;
        color: white;
        font-weight: bold;
        border-radius: 30px;
      }
      select option:hover {
        background: #66aadf
        color: white
        font-weight: bold;
      }
      `}
      </style>
      <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
        <h2 className="text-white text-[30px] font-bold">새 그룹 생성</h2>
        <div className="flex justify-between w-[70%]">
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label htmlFor="title" className="text-white font-bold">
              그룹명
            </label>
            <input
              id="title"
              name="title"
              value={title ? title : ""}
              onChange={handleChangeTitle}
              className="h-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
            />
          </div>
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label htmlFor="presetId" className="text-white font-bold">
              차단 프리셋 선택
            </label>
            <div
              tabIndex={0}
              className={`relative h-[60%] rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
                isOpen ? "focus:ring-4 focus:ring-[#66aadf]" : ""
              }`}
            >
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center"
              >
                <p>
                  {selectedOption
                    ? selectedOption.title
                    : "프리셋을 선택하세요."}
                </p>
                <IoIosArrowDown />
              </div>
              {isOpen && (
                <ul
                  className="absolute left-0 right-0 mt-3 bg-white border
                  border-gray-300 rounded-lg shadow-lg"
                >
                  {presetList.map((preset, index) => (
                    <div key={preset.presetId}>
                      <li
                        onClick={() => {
                          handleChangePresetId(preset.presetId);
                          setSelectedOption(preset);
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-[#66aadf] cursor-pointer rounded-lg hover:font-bold"
                      >
                        {preset.title}
                      </li>
                      {index < presetList.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end gap-5">
          <button
            onClick={handleConfirm}
            className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
          >
            생성하기
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
// props validation 추가
AddGroup.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
  onChangeGroupList: PropTypes.func.isRequired,
};
export default AddGroup;
