import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

function UpdateGroup({ groupId, onChangeContent }) {
  // 시간 추가 모달
  const openTimeSetModal = (index) => {
    console.log(index);
    Swal.fire({
      title: "시간 추가 모달",
      text: `그룹 ${index} 정보 불러와야죠`,
      confirmButtonColor: "green",
      icon: "info",
      showDenyButton: true,
      denyButtonColor: "gray",
    });
  };
  // 그룹 삭제 모달
  const openDeleteModal = (index) => {
    console.log(index);
    Swal.fire({
      title: "그룹 삭제",
      text: `그룹 ${index} 지울게`,
      confirmButtonColor: "red",
      icon: "warning",
      showDenyButton: true,
      denyButtonColor: "gray",
    });
  };

  // 적용하기 클릭
  const handleCancel = () => {
    onChangeContent(null);
  };

  return (
    <div className="absolute left-[40vw] w-[60vw] h-[100vh] bg-white">
      <h2>그룹{groupId} 수정</h2>
      <div className="flex justify-around">
        <button onClick={() => openTimeSetModal(groupId)}>시간 추가</button>
        <button onClick={() => openDeleteModal(groupId)}>그룹삭제</button>
        <button onClick={handleCancel}>적용하기</button>
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
