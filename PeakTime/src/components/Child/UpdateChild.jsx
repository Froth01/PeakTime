import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";
import groupsApi from "../../api/groupsApi";
import childrenApi from "../../api/childrenApi";
import { updateChildAlertMessage } from "../../utils/Child/UpdateChildAlertMessage";
import { deleteChildAlertMessage } from "../../utils/Child/DeleteChildAlertMessage";

function UpdateChild({
  childId,
  groupList,
  onChangeContent,
  onChangeGroupList,
}) {
  const FAIL_TO_GET_GROUPLIST = {
    title: "그룹 전체 조회 실패",
    text: "그룹 전체 정보를 조회하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  };

  //비밀번호 변경 상태 변수
  const [passwordChange, setPasswordChange] = useState(false);
  const [child, setChild] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [childNickname, setChildNickname] = useState(null);

  // 서브유저 닉네임 및 그룹 조회
  useEffect(() => {
    for (const group of groupList) {
      const child = group.childList.find((child) => child.userId === childId);
      if (child) {
        setChild(child);
        setGroupId(group.groupId);
        setChildNickname(child.nickname);
        break;
      }
    }
  }, [childId, groupList]);

  // 계정 삭제 모달
  const openDeleteModal = () => {
    Swal.fire(deleteChildAlertMessage("check"))
      .then((result) => {
        // 확인 누르면 삭제, 취소 누르면 모달 닫히고 아무것도 실행하지 않음
        if (result.isConfirmed) {
          childrenApi
            .delete(`/${childId}`)
            .then(() => {
              Swal.fire(deleteChildAlertMessage("success"));

              groupsApi
                .get("")
                .then((result) => {
                  onChangeGroupList(result.data.data.groupList);
                  onChangeContent(null);
                })
                .catch(() => Swal.fire(FAIL_TO_GET_GROUPLIST));
            })
            .catch((error) => {
              Swal.fire(deleteChildAlertMessage("fail", error));
            });
        }
      })
      .catch((error) => {
        // 디폴트 에러
        Swal.fire(deleteChildAlertMessage("fail", error));
      });
  };

  // 비밀번호 변경 클릭
  const handlePassword = () => {
    setPasswordChange(true);
  };

  // 계정 수정 (적용하기 클릭)
  const handleUpdateChildInfo = () => {
    childrenApi
      .put(`/${childId}`, { groupId, childNickName: child.nickname })
      .then(() => {
        Swal.fire(updateChildAlertMessage());

        setChildNickname(child.nickname);
        groupsApi
          .get("")
          .then((result) => onChangeGroupList(result.data.data.groupList))
          .catch(() => Swal.fire(FAIL_TO_GET_GROUPLIST));
      })
      .catch((error) => Swal.fire(updateChildAlertMessage(error)));
  };

  // 닫기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  const handleChange = (content, item) => {
    switch (content) {
      case "childNickname":
        setChild((prevChild) => ({ ...prevChild, nickname: item }));
        return;
      case "groupId":
        setGroupId(item);
        return;
      default:
        return null;
    }
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <div className="flex justify-around">
        <h2>{childNickname}</h2>
        <button onClick={() => openDeleteModal()}>계정삭제</button>
      </div>

      <div className="flex justify-around">
        <div className="flex flex-col text-left">
          <label htmlFor="">닉네임</label>
          <input
            id="childNickname"
            name="childNickname"
            value={child?.nickname || ""}
            onChange={(e) => handleChange("childNickname", e.target.value)}
          />
        </div>
        <div className="flex flex-col text-left">
          <label htmlFor="">소속 그룹</label>
          <select
            id="groupId"
            name="groupId"
            value={groupId || ""}
            onChange={(e) => handleChange("groupId", e.target.value)}
          >
            {groupList?.map((group) => (
              <option
                key={group.groupId}
                value={group.groupId}
                disabled={group.childList.length >= 30 ? true : false}
              >
                {group.groupTitle}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-around text-left">
        <div className="flex flex-col">
          <label htmlFor="">아이디</label>
          <input value={child?.userLoginId || ""} disabled />
        </div>
        <div></div>
      </div>
      <div className="flex justify-around">
        <button onClick={handlePassword}>비밀번호변경</button>
        <button onClick={handleUpdateChildInfo}>적용하기</button>
        <button onClick={handleCancel}>닫기</button>
      </div>
      {passwordChange && (
        <ChangePassword
          childId={childId}
          setPasswordChange={setPasswordChange}
        />
      )}
    </div>
  );
}

// props validation 추가
UpdateChild.propTypes = {
  childId: PropTypes.number.isRequired,
  groupList: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.number.isRequired,
      groupTitle: PropTypes.string.isRequired,
      childList: PropTypes.arrayOf(
        PropTypes.shape({
          userId: PropTypes.number.isRequired,
          userLoginId: PropTypes.string.isRequired,
          nickname: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onChangeContent: PropTypes.func.isRequired,
  onChangeGroupList: PropTypes.func.isRequired,
};
export default UpdateChild;
