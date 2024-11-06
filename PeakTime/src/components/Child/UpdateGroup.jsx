import { useEffect, useState } from "react";
import presetsApi from "../../api/presetsApi";
import groupsApi from "../../api/groupsApi";
import timersApi from "../../api/timersApi";
import AddGroupTimer from "./AddGroupTimer";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";

function UpdateGroup({ groupId, onChangeContent }) {
  const [groupTitle, setGroupTitle] = useState(null);
  const [presetList, setPresetList] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);

  const ALERT_MESSAGE = {
    // 그룹 정보 업데이트 경고
    warningForUpdateGroupInfo: {
      title: "그룹 정보 변경",
      text: "그룹 정보를 수정하시겠습니까?",
      icon: "question",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
    },
    // 그룹 수정 성공
    successToUpdateGroup: {
      title: "그룹 수정 성공",
      text: "그룹 정보 수정을 성공했습니다.",
      icon: "success",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 수정 시 그룹명 중복
    duplicateGroupTitleError: {
      title: "그룹명 중복 경고",
      text: "입력한 그룹 이름이 이미 존재합니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 수정 실패
    failToUpdateGroup: {
      title: "그룹 수정 실패",
      text: "그룹 정보 수정을 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 삭제 경고
    warningForDeleteGroup: {
      title: "그룹 삭제 경고",
      text: "그룹 삭제 시 하위 계정 정보도 모두 삭제됩니다. 정말 그룹을 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
    },
    // 그룹 삭제 성공
    succcessToDeleteGroup: {
      title: "그룹 삭제 성공",
      text: "그룹이 성공적으로 삭제되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 삭제 실패
    failToDeleteGroup: {
      title: "그룹 삭제 실패",
      text: "그룹 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 타이머 생성 성공
    successToCreateGroupTimer: {
      title: "타이머 생성 성공",
      text: "타이머를 성공적으로 생성했습니다.",
      icon: "success",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 타이머 attention_time 조건 불만족
    attentionTimeOutOfRangeError: {
      title: "시간 설정 오류",
      text: "입력한 시간이 30분에서 240분 사이여야 합니다.",
      icon: "warning",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 타이머 중복 오류
    duplicateGroupTimerError: {
      title: "타이머 중복",
      text: "선택한 시간 범위가 다른 예약과 겹칩니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 타이머 생성 오류
    failToCreateGroupTime: {
      title: "타이머 생성 실패",
      text: "타이머 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
    // 그룹 타이머 삭제 경고
    warningForDeleteTimer: {
      title: "타이머 삭제 경고",
      text: "타이머는 삭제 즉시 변경 사항이 반영됩니다. 정말 타이머를 삭제하시겠습니까?",
      icon: "warning",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
    },
    // 그룹 타이머 삭제 실패
    failToDeleteTimer: {
      title: "타이머 삭제 실패",
      text: "타이머 삭제를 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
    },
  };

  useEffect(() => {
    // 프리셋 조회 API 호출
    presetsApi
      .get("")
      .then((result) => {
        setPresetList(result.data.data.presetList);
      })
      .catch();

    // 그룹 단일 조회 API 호출
    groupsApi
      .get(`/${groupId}`)
      .then((result) => {
        setGroupInfo(result.data.data);
        setGroupTitle(result.data.data.title);
      })
      .catch();
  }, [groupId]);

  // datetime을 time으로 변환하는 함수
  const timeOnly = (dateTimeString, attentionTime = null) => {
    const date = new Date(dateTimeString);

    if (attentionTime) {
      date.setMinutes(date.getMinutes() + attentionTime);
    }

    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  };

  // 비트마스킹된 repeat_day를 요일로 변환하는 함수
  const convertBitmaskToDays = (bitmask) => {
    if (!bitmask) return;

    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const selectedDays = [];

    days.forEach((day, idx) => {
      if (bitmask & (1 << (6 - idx))) {
        selectedDays.push(day);
      }
    });

    return selectedDays.join(", ") + "(반복)";
  };

  const handleChangeTitle = (e) => {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      title: e.target.value,
    }));
  };

  const handleChangePresetId = (e) => {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      presetId: e.target.value,
    }));
  };

  // 타이머 삭제
  const deleteTimer = (timerId) => {
    Swal.fire(ALERT_MESSAGE.warningForDeleteTimer).then((result) => {
      if (result.isConfirmed) {
        timersApi
          .delete(`/${timerId}`)
          .then(() => {
            // 삭제된 타이머를 화면에 반영
            setGroupInfo((prevGroupInfo) => ({
              ...prevGroupInfo,
              timerList: prevGroupInfo.timerList.filter(
                (timer) => timer.timerId !== timerId
              ),
            }));
          })
          .catch(() => {
            Swal.fire(ALERT_MESSAGE.failToDeleteTimer);
          });
      }
    });
  };

  // 그룹 타이머 추가 모달
  const openTimeSetModal = (groupId) => {
    let timerSetting = {};

    Swal.fire({
      title: "그룹 타이머 추가",
      html: `<div id="add-group-timer" />`,
      willOpen: () => {
        const root = ReactDOM.createRoot(
          document.getElementById("add-group-timer")
        );

        const onSave = (saveFunction) => {
          timerSetting = saveFunction();
        };

        root.render(<AddGroupTimer groupId={groupId} onSave={onSave} />);
      },
      preConfirm: () => {
        // attentionTime이 30분에서 240분 사이인지 확인
        if (
          timerSetting.attentionTime < 30 ||
          timerSetting.attentionTime > 240
        ) {
          Swal.fire(ALERT_MESSAGE.attentionTimeOutOfRangeError);
          return false;
        }

        timersApi
          .post("", timerSetting)
          .then((response) => {
            Swal.fire(ALERT_MESSAGE.successToCreateGroupTimer);

            // 타이머 생성 성공 시 화면상의 groupInfo 상태 업데이트
            setGroupInfo((prevGroupInfo) => ({
              ...prevGroupInfo,
              timerList: [...prevGroupInfo.timerList, response.data.data],
            }));
            return true;
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              return Swal.fire(ALERT_MESSAGE.duplicateGroupTimerError).then(
                () => false
              );
            } else {
              return Swal.fire(ALERT_MESSAGE.failToCreateGroupTime).then(
                () => false
              );
            }
          });
      },
      didClose: () => {
        const root = ReactDOM.createRoot(
          document.getElementById("add-group-timer")
        );
        root.unmount();
      },
      confirmButtonColor: "#03C777",
      confirmButtonText: "저장",
      showDenyButton: true,
      denyButtonColor: "#F40000",
      denyButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // 성공적으로 타이머가 추가되어 두 팝업을 모두 닫는 경우
        Swal.close();
      }
    });
  };

  // 그룹 삭제 모달
  const openDeleteModal = (groupId) => {
    Swal.fire(ALERT_MESSAGE.warningForDeleteGroup).then((result) => {
      if (result.isConfirmed) {
        groupsApi
          .delete(`/${groupId}`, {
            // params수정
            params: {
              userId: 7,
            },
          })
          .then(() => {
            Swal.fire(ALERT_MESSAGE.succcessToDeleteGroup).then(() => {
              // 확인 버튼을 눌렀을 때 페이지 새로고침
              window.location.reload();
            });
          })
          .catch(() => {
            Swal.fire(ALERT_MESSAGE.failToDeleteGroup);
          });
      }
    });
  };

  // 적용하기 클릭
  const openUpdateModal = (groupId) => {
    Swal.fire(ALERT_MESSAGE.warningForUpdateGroupInfo).then((result) => {
      groupsApi
        .put(
          `/${groupId}`,
          { title: groupInfo.title, presetId: groupInfo.presetId },
          // params수정
          { params: { userId: 1 } }
        )
        .then(() => {
          Swal.fire(ALERT_MESSAGE.successToUpdateGroup).then(() => {
            window.location.reload();
          });
        })
        .catch((err) => {
          err.status == 422
            ? Swal.fire(ALERT_MESSAGE.duplicateGroupTitleError)
            : Swal.fire(ALERT_MESSAGE.failToUpdateGroup);
        });
    });
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white border border-black">
      {/* title */}
      <h2>{groupTitle}</h2>

      {/* title, presets */}
      <div className="flex justify-center">
        {/* title */}
        <div>
          <label>그룹명</label>
          <input
            id="title"
            name="title"
            value={groupInfo?.title || ""}
            onChange={handleChangeTitle}
          />
        </div>

        {/* presets */}
        <div>
          <label>프리셋</label>
          <select
            id="presetId"
            name="presetId"
            onChange={handleChangePresetId}
            value={groupInfo?.presetId || ""}
          >
            {presetList?.map((preset) => (
              <option key={preset.presetId} value={preset.presetId}>
                {preset.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* timers */}
      <div className="p-3 border">
        {groupInfo?.timerList.map((timer) => (
          <div
            key={timer.timerId}
            value={timer.timerId}
            className="flex justify-between"
          >
            <span>
              {timeOnly(timer.startTime)} ~{" "}
              {timeOnly(timer.startTime, timer.attentionTime)}
            </span>
            <span>{convertBitmaskToDays(timer.repeatDay)}</span>
            <button onClick={() => deleteTimer(timer.timerId)}>X</button>
          </div>
        )) || ""}
      </div>

      <div className="flex justify-around">
        <button onClick={() => openTimeSetModal(groupId)}>+시간 추가</button>
        <button onClick={() => openDeleteModal(groupId)}>그룹삭제</button>
        <button onClick={() => openUpdateModal(groupId)}>적용하기</button>
      </div>
    </div>
  );
}
// props validation 추가
UpdateGroup.propTypes = {
  groupId: PropTypes.number.isRequired,
  onChangeContent: PropTypes.func.isRequired,
};
export default UpdateGroup;
