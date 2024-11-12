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
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[60vw] h-[60vh] flex flex-col justify-around items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1>회원가입</h1>
        <div className="main-content">
          <div className="group">
            <input
              type="text"
            />
            <label>
              아이디
            </label>
          </div>
        </div>
        <div className="footer-content">
          <button onClick={openResultModal}>가입 완료</button>
          <button onClick={goBack}>돌아가기</button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
