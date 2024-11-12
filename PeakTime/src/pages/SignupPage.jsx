import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리

function SignupPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수
  const [inputId, setInputId] = useState("");
  const [inputNickname, setInputNickname] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");

  // 변수 상태
  const [isOK, setIsOK] = useState(true);

  // 입력시 처리 함수
  useEffect(() => {
    // inputId 입력시 처리 로직
    console.log("굿");
  }, [inputId]);

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
      <div className="w-[60vw] h-[70vh] flex flex-col justify-between items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">회원가입</h1>
        <div
          id="main-content"
          className="flex flex-col h-[70%] w-full items-center"
        >
          <div className="flex justify-between w-[90%]">
            <div className="flex w-[50%]">
              <div className="relative z-0 mb-5 group text-start w-[65%]">
                <input
                  type="text"
                  name="idInput"
                  id="idInput"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="w-[85%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  ID
                </label>
                {/* 경고메시지 */}
                <div
                  className={`absolute top-[115%] font-bold text-${
                    isOK ? "[#03c777]" : "[#f40000]"
                  }`}
                >
                  경고메세지가 이렇게 뜹니다.
                </div>
              </div>
              <button className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] mb-5 ms-0">
                중복 확인
              </button>
            </div>
            <div className="relative z-0 mb-5 group text-start w-[45%]">
              <input
                type="text"
                name="inputNickname"
                id="inputNickname"
                value={inputNickname}
                onChange={(e) => setInputNickname(e.target.value)}
                className="w-[70%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="idInput"
                className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                닉네임
              </label>
            </div>
          </div>
          <div className="flex justify-between w-[90%] h-[45%] mt-[7%]">
            <div className="flex flex-col items-start justify-between w-[30%]">
              <div className="relative z-0 w-full group text-start">
                <input
                  type="password"
                  name="inputPassword"
                  id="inputPassword"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-[92%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  비밀번호
                </label>
              </div>

              <div className="relative z-0 w-full group text-start">
                <input
                  type="password"
                  name="inputConfirmPassword"
                  id="inputConfirmPassword"
                  value={inputConfirmPassword}
                  onChange={(e) => setInputConfirmPassword(e.target.value)}
                  className="w-[92%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  비밀번호확인
                </label>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between w-[60%]">
              <div className="flex justify-between w-full">
                <div className="relative z-0 w-[58%] group text-start">
                  <input
                    type="text"
                    name="inputEmail"
                    id="inputEmail"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-[90%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="idInput"
                    className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    이메일
                  </label>
                </div>
                <button className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] my-2 ms-0 me-3">
                  중복 확인
                </button>
                <button className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] my-2 ms-0">
                  인증코드 전송
                </button>
              </div>
              <div className="flex justify-between">
                <div className="relative z-0 w-[58%] group text-start">
                  <input
                    type="text"
                    name="inputCode"
                    id="inputCode"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-[90%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="idInput"
                    className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    인증코드 확인
                  </label>
                </div>
                <button className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf]">
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content flex justify-around w-[30%]">
          <button
            onClick={openResultModal}
            className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] font-bold"
          >
            가입 완료
          </button>
          <button
            onClick={goBack}
            className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
