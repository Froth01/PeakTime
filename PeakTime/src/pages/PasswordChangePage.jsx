import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리

function PasswordChangePage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 변경 확인 모달
  const openResultModal = () => {
    Swal.fire({
      title: "비밀번호 모달",
      text: "비밀번호변경하는폼",
      icon: "success",
      confirmButtonColor: "green",
      didClose: () => navigate(-1),
    });
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div>PasswordChangePage</div>
      <button onClick={openResultModal}>변경하기</button>
      <button onClick={goBack}>돌아가기</button>
    </>
  );
}

export default PasswordChangePage;
