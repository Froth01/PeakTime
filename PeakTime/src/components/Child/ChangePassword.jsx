import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import childrenApi from "../../api/childrenApi";
import { changeChildPasswordMessage } from "../../utils/Child/ChangeChildPassword";

function ChangePassword({ childId, setPasswordChange }) {
  const [childPassword, setChildPassword] = useState("");
  const [childConfirmPassword, setChildConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);

  const handleOnchange = (type, value) => {
    switch (type) {
      case "childPassword":
        setChildPassword(value);
        return;
      case "childConfirmPassword":
        setChildConfirmPassword(value);
        return;
      default:
        return;
    }
  };

  const handleChangePassword = () => {
    childrenApi
      .put(`/${childId}/password`, { childPassword, childConfirmPassword })
      .then(() => {
        Swal.fire(changeChildPasswordMessage());
        setChildPassword("");
        setChildConfirmPassword("");

        // 변경 후 컴포넌트 닫기
        setPasswordChange(false);
      })
      .catch((err) => Swal.fire(changeChildPasswordMessage(err)));
  };

  useEffect(() => {
    setPasswordCheck(childPassword === childConfirmPassword);
  }, [childPassword, childConfirmPassword]);

  return (
    <div className="flex flex-col">
      <input
        type="password"
        id="childPassword"
        name="childPassword"
        value={childPassword}
        placeholder="새로운 비밀번호"
        onChange={(e) => handleOnchange("childPassword", e.target.value)}
      />
      <input
        type="password"
        id="childConfirmPassword"
        name="childConfirmPassword"
        value={childConfirmPassword}
        placeholder="비밀번호 확인"
        onChange={(e) => handleOnchange("childConfirmPassword", e.target.value)}
      />
      {!passwordCheck && (
        <div style={{ color: "#F40000" }}>
          입력한 비밀번호가 일치하지 않습니다.
        </div>
      )}
      <button onClick={handleChangePassword}>비밀번호 수정</button>
      <button onClick={() => setPasswordChange(false)}>닫기</button>
    </div>
  );
}

// props validation 추가
ChangePassword.propTypes = {
  childId: PropTypes.number.isRequired,
  setPasswordChange: PropTypes.func.isRequired,
};

export default ChangePassword;
