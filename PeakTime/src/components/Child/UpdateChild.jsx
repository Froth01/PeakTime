import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";

function UpdateChild({ childId, onChangeContent }) {
  //비밀번호 변경 상태 변수
  const [passwordChange, setPasswordChange] = useState(false);

  // 계정 삭제 모달
  const openDeleteModal = (index) => {
    console.log(index);
    Swal.fire({
      title: "계정 삭제",
      text: `id=${index} 계정 지울게`,
      confirmButtonColor: "red",
      icon: "warning",
      showDenyButton: true,
      denyButtonColor: "gray",
    });
  };

  // 비밀번호 변경 클릭
  const handlePassword = () => {
    setPasswordChange(true);
  };

  // 적용하기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>id={childId} 차일드 수정</h2>
      <div className="flex justify-around">
        <button onClick={() => openDeleteModal(childId)}>계정삭제</button>
        <button onClick={handlePassword}>비밀번호변경</button>
        <button onClick={handleCancel}>적용하기</button>
      </div>
      {passwordChange && <ChangePassword childId={childId} />}
    </div>
  );
}
// props validation 추가
UpdateChild.propTypes = {
  childId: PropTypes.number.isRequired,
  onChangeContent: PropTypes.func.isRequired,
};
export default UpdateChild;
