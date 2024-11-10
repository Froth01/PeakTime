import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import groupsApi from "../../api/groupsApi";
import childrenApi from "../../api/childrenApi";
import { Add_Child_ALERT_MESSAGE } from "../../utils/Child/AddChildAlertMessage";

function AddChild({ onChangeContent, onChangeGroupList, groupList }) {
  const [groupId, setGroupId] = useState("");
  const [childLoginId, setChildLoginId] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [childConfirmPassword, setChildConfirmPassword] = useState("");
  const [childNickname, setChildNickname] = useState("");

  const [passwordcheck, setPasswordCheck] = useState(true);

  const resetAllInputs = () => {
    setGroupId("");
    setChildLoginId("");
    setChildPassword("");
    setChildConfirmPassword("");
    setChildNickname("");
  };

  // 아이디 중복 확인
  const handleCheckId = () => {

  }

  // 생성하기 클릭
  const handleConfirm = () => {
    if (
      !groupId ||
      !childLoginId ||
      !childPassword ||
      !childConfirmPassword ||
      !childNickname
    ) {
      return false;
    }

    childrenApi
      .post("", {
        groupId,
        childLoginId,
        childPassword,
        childConfirmPassword,
        childNickname,
      })
      .then(() => {
        resetAllInputs();
        Swal.fire(Add_Child_ALERT_MESSAGE()).then(() => {
          groupsApi
            .get("")
            .then((result) => onChangeGroupList(result.data.data.groupList))
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        Swal.fire(Add_Child_ALERT_MESSAGE(err));
      });
  };

  useEffect(() => {
    setPasswordCheck(childPassword === childConfirmPassword);
  }, [childPassword, childConfirmPassword]);

  // 닫기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>계정 생성</h2>

      <div className="flex">
        <div className="flex flex-col text-left">
          <label htmlFor="childNickname">닉네임</label>
          <input
            id="childNickname"
            name="childNickname"
            placeholder="닉네임"
            value={childNickname}
            onChange={(e) => setChildNickname(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-left">
          <label htmlFor="groupId">소속 그룹</label>
          <select
            id="groupId"
            name="groupId"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">그룹을 선택하세요.</option>
            {groupList.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {`${group.groupTitle} (${group.childList.length} / 30)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col text-left">
          <label htmlFor="childLoginId">아이디</label>
          <input
            id="childLoginId"
            name="childLoginId"
            placeholder="로그인 아이디"
            value={childLoginId}
            onChange={(e) => setChildLoginId(e.target.value)}
          />
          {/* 이미 존재하는 아이디입니다 추가 예정 */}
          <button onClick={handleCheckId}>아이디 중복 확인</button>
        </div>
        <div className="flex flex-col text-left">
          <div className="flex flex-col">
            <label htmlFor="childPassword">비밀번호</label>
            <input
              id="childPassword"
              name="childPassword"
              placeholder="비밀번호"
              type="password"
              value={childPassword}
              onChange={(e) => setChildPassword(e.target.value)}
            />
            <input
              id="childConfirmPassword"
              name="childConfirmPassword"
              placeholder="비밀번호 확인"
              type="password"
              value={childConfirmPassword}
              onChange={(e) => setChildConfirmPassword(e.target.value)}
            />
            {!passwordcheck && <div style={{ color: "#F40000" }}>입력한 비밀번호가 일치하지 않습니다.</div>}
          </div>
        </div>
      </div>

      <button onClick={handleConfirm}>생성하기</button>
      <button onClick={handleCancel}>닫기</button>
    </div>
  );
}

// props validation 추가
AddChild.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
  onChangeGroupList: PropTypes.func.isRequired,
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
};

export default AddChild;
