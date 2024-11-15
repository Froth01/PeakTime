import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import authApi from "../../api/authApi";
import groupsApi from "../../api/groupsApi";
import childrenApi from "../../api/childrenApi";
import { useGroupStore } from "../../stores/GroupStore";
import {
  errorToCheckIsIdDuplicated,
  errorBeforeConfirm,
  addChildAlertMessage,
} from "../../utils/Child/AddChildAlertMessage";
import { IoIosArrowDown } from "react-icons/io";

function AddChild() {
  const { groupList, setGroupList, setContent } = useGroupStore();
  const [groupId, setGroupId] = useState("");
  // 서브 계정 아이디 관련
  const [childLoginId, setChildLoginId] = useState("");
  const [idFormatIsOK, setIdFormatIsOK] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false); // false, "duplicated", "checked, "needToCheck"
  // 비밀번호 관련
  const [childPassword, setChildPassword] = useState("");
  const [childConfirmPassword, setChildConfirmPassword] = useState("");
  const [childPasswordFormatIsOk, setChildPasswordFormatIsOk] = useState(false);
  // 닉네임 관련
  const [childNickname, setChildNickname] = useState("");
  
  const [passwordCheck, setPasswordCheck] = useState(true);

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const resetAllInputs = () => {
    setGroupId("");
    setChildLoginId("");
    setChildPassword("");
    setChildConfirmPassword("");
    setChildNickname("");
    setPasswordCheck(true);
    setIsDuplicate(false);
    setSelectedOption(null);
  };

  const duplicatedMessage = () => {
    if(!idFormatIsOK) return (
      <div className="text-[#f40000] absolute top-[65%]">
      * 5자 이상 15자 이하  * 영문, 숫자 사용 가능
    </div>
    )

    switch (isDuplicate) {
      case "duplicated":
        return (
          <div className="text-[#f40000] absolute top-[65%]">
            입력한 아이디는 이미 존재합니다.
          </div>
        );
      case "checked":
        return (
          <div className="text-[#03c777] absolute top-[65%]">
            사용 가능한 아이디입니다.
          </div>
        );
      case "needToCheck":
        return (
          <div className="text-[#f40000] absolute top-[65%]">
            아이디 중복 확인이 필요합니다.
          </div>
        );
      default:
        return;
    }
  };

  // 아이디 형식 확인
  useEffect(() => {
    const idRegex = /^[a-zA-Z0-9]{5,15}$/;
    if(idRegex.test(childLoginId)){
      setIdFormatIsOK(true);
    } else{
      setIdFormatIsOK(false);
    }
    setIsDuplicate("needToCheck");
  }, [childLoginId])

  // 아이디 중복 확인
  const handleCheckId = () => {
    authApi
      .get(`/user-login-id`, { params: { userLoginId: childLoginId } })
      .then((result) => {
        if (result.data.data.isDuplicated === true) {
          setIsDuplicate("duplicated");
        } else {
          setIsDuplicate("checked");
        }
      })
      .catch(() => Swal.fire(errorToCheckIsIdDuplicated));
  };

  // 생성하기 클릭
  const handleConfirm = () => {
    if (isDuplicate === false || isDuplicate === "needToCheck") {
      setIsDuplicate("needToCheck");
      return false;
    }

    if (
      isDuplicate !== "checked" ||
      !groupId ||
      !childLoginId ||
      !childPassword ||
      !childConfirmPassword ||
      !childNickname
    ) {
      Swal.fire(errorBeforeConfirm);
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
        Swal.fire(addChildAlertMessage()).then(() => {
          groupsApi
            .get("")
            .then((result) => setGroupList(result.data.data.groupList))
            .catch();
        });
      })
      .catch((err) => {
        Swal.fire(addChildAlertMessage(err));
      });
  };

  // 비밀번호 형식 확인
  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (passwordRegex.test(childPassword)) {
      setChildPasswordFormatIsOk(true);
    } else {
      setChildPasswordFormatIsOk(false);
    }

    if(!childPasswordFormatIsOk) return;
    setPasswordCheck(childPassword === childConfirmPassword);
  }, [childPassword, childConfirmPassword, childPasswordFormatIsOk]);

  // 비밀번호 확인 후 메시지
  const passwordMessage = () => {
    if (!childPasswordFormatIsOk) {
      return (
        <div className="text-[#f40000] absolute top-[105%]">
          * 최소 8자 이상  * 영문 대문자, 영문 소문자, 숫자, 특수문자를 모두 포함
        </div>
      );
    }
  
    if (childPasswordFormatIsOk && passwordCheck) {
      return (
        <div className="text-[#03C777] absolute top-[105%]">
          사용 가능한 비밀번호입니다.
        </div>
      );
    }
  
    if (childPasswordFormatIsOk && !passwordCheck) {
      return (
        <div className="text-[#f40000] absolute top-[105%]">
          입력한 비밀번호가 일치하지 않습니다.
        </div>
      );
    }
  
    return null;
  };

  // 닉네임 확인 후 메시지
  const nicknameMessage = () => {
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,15}$/;
    
    if(nicknameRegex.test(childNickname)){
      return (
        <div className="text-[#03C777] absolute top-[105%]">
          사용 가능한 닉네임입니다.
        </div>
      );
    }
  
    return (
      <div className="text-[#f40000] absolute top-[105%]">
        * 2자 이상 15자 이하  * 한글, 영문, 숫자 사용 가능
      </div>
    );
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="text-white text-[30px] font-bold">계정 생성</h2>
      <div className="flex justify-between w-[70%]">
        <div className="flex justify-around gap-3 text-start w-full">
          <div className="flex flex-col gap-3 w-[40%] relative">
            <label htmlFor="childNickname" className="text-white font-bold">
              닉네임
            </label>
            <input
              id="childNickname"
              name="childNickname"
              placeholder="닉네임"
              value={childNickname}
              onChange={(e) => setChildNickname(e.target.value)}
              className="h-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
            />
            {nicknameMessage()}
          </div>
          <div className="flex flex-col gap-3 w-[40%]">
            <label htmlFor="groupId" className="text-white font-bold">
              소속 그룹
            </label>
            <div
              tabIndex={0}
              onChange={(e) => setGroupId(e.target.value)}
              className={`relative h-[60%] rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
                isOpen ? "focus:ring-4 focus:ring-[#66aadf]" : ""
              }`}
            >
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center"
              >
                <p>
                  {selectedOption
                    ? selectedOption.groupTitle
                    : "그룹을 선택하세요."}
                </p>
                <IoIosArrowDown />
              </div>
              {isOpen && (
                <ul
                  className="absolute left-0 right-0 mt-3 bg-white border
                border-gray-300 rounded-lg shadow-lg z-50"
                >
                  {groupList.map((group, index) => (
                    <div key={group.groupId}>
                      <li
                        onClick={() => {
                          setGroupId(group.groupId);
                          setSelectedOption(group);
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-[#66aadf] cursor-pointer rounded-lg hover:font-bold"
                      >
                        {`${group.groupTitle} (${group.childList.length} / 30)`}
                      </li>
                      {index < groupList.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-[70%]">
        <div className="flex justify-around gap-3 text-start w-full">
          <div className="flex flex-col gap-3 w-[40%] relative">
            <label htmlFor="childLoginId" className="text-white font-bold">
              아이디
            </label>
            <input
              id="childLoginId"
              name="childLoginId"
              placeholder="로그인 아이디"
              value={childLoginId}
              onChange={(e) => {
                setChildLoginId(e.target.value);
                setIsDuplicate("needToCheck");
              }}
              className="h-[32%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
            />
            {duplicatedMessage()}
            {isDuplicate !== "checked" && (
              <button
                onClick={() => handleCheckId()}
                className="absolute font-bold text-white top-[105%] bg-[#4d90d8] rounded-xl px-5 py-2 hover:bg-[#3476d0] focus:ring-4 focus:ring-[#4d90d8]"
                disabled={!idFormatIsOK}
              >
                아이디 중복 확인
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 w-[40%]">
            <div className="flex flex-col gap-3 relative">
              <label htmlFor="childPassword" className="text-white font-bold">
                비밀번호
              </label>
              <input
                id="childPassword"
                name="childPassword"
                placeholder="비밀번호"
                type="password"
                value={childPassword}
                onChange={(e) => setChildPassword(e.target.value)}
                className="rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
              />
              <input
                id="childConfirmPassword"
                name="childConfirmPassword"
                placeholder="비밀번호 확인"
                type="password"
                value={childConfirmPassword}
                onChange={(e) => setChildConfirmPassword(e.target.value)}
                className="rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
              />
              {passwordMessage()}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end gap-5">
        <button
          onClick={() => handleConfirm()}
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
        >
          생성하기
        </button>
        <button
          onClick={() => setContent(null)}
          className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default AddChild;
