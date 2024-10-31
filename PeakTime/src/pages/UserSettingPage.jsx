import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리

function UserSettingPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 변경 페이지 이동
  const handleChangeBtn = (type) => {
    navigate(type);
  };

  // 회원탈퇴 모달
  const openDeleteModal = () => {
    Swal.fire({
      title: "회원탈퇴 모달",
      text: "비밀번호변경하는폼",
      icon: "error",
      confirmButtonColor: "red",
      confirmButtonText: "삭제",
      showDenyButton: true,
      denyButtonText: `취소`,
      denyButtonColor: `gray`,
    });
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div>UserSettingPage</div>
      <button onClick={() => handleChangeBtn("/passwordchange")}>
        비밀번호 변경
      </button>
      <button onClick={() => handleChangeBtn("/emailchange")}>
        이메일 변경
      </button>
      <button onClick={goBack}>돌아가기</button>
      <button onClick={openDeleteModal}>회원탈퇴</button>
    </>
  );
}

export default UserSettingPage;
