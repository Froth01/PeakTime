import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import groupsApi from "../../api/groupsApi";
import presetsApi from "../../api/presetsApi";
import Swal from "sweetalert2";

function AddGroup({ onChangeContent, onChangeGroupList }) {
  // 그룹명, 프리셋 아이디
  const [title, setTitle] = useState(null);
  const [presetId, setPresetId] = useState(null);
  const [presetList, setPresetList] = useState([]);

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

  const handleChangePresetId = (e) => {
    setPresetId(e.target.value);
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
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>새 그룹 생성</h2>

      <div>
        <label htmlFor="title">그룹명</label>
        <input id="title" name="title" onChange={handleChangeTitle} />
      </div>
      <div>
        <label htmlFor="presetId">차단 프리셋 선택</label>
        <select id="presetId" name="presetId" onChange={handleChangePresetId}>
          <option value="">프리셋을 선택하세요.</option>
          {presetList.map((preset) => (
            <option key={preset.presetId} value={preset.presetId}>
              {preset.title}
            </option>
          ))}
        </select>
      </div>

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
