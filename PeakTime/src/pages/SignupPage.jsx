import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리

function SignupPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 변경 확인 모달
  const openResultModal = () => {
    Swal.fire({
      title: "가입완료 모달",
      text: "가입완료",
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
      <div>SignupPage</div>
      <button onClick={openResultModal}>가입 완료</button>
      <button onClick={goBack}>돌아가기</button>
    </>
  );
}

export default SignupPage;
