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
  const [childLoginId, setChildLoginId] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [childConfirmPassword, setChildConfirmPassword] = useState("");
  const [childNickname, setChildNickname] = useState("");

  const [passwordCheck, setPasswordCheck] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false); // false, "duplicated", "checked, "needToCheck"

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
  };

  const duplicatedMessage = () => {
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

  useEffect(() => {
    setPasswordCheck(childPassword === childConfirmPassword);
  }, [childPassword, childConfirmPassword]);

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="text-white text-[30px] font-bold">계정 생성</h2>
      <div className="flex justify-between w-[70%]">
        <div className="flex justify-around gap-3 text-start w-full">
          <div className="flex flex-col gap-3 w-[40%]">
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
                border-gray-300 rounded-lg shadow-lg"
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
                className="absolute font-bold text-white top-[90%] bg-[#4d90d8] rounded-xl px-5 py-2 hover:bg-[#3476d0] focus:ring-4 focus:ring-[#4d90d8]"
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
              {!passwordCheck && (
                <div className="text-[#f40000] absolute top-[105%]">
                  입력한 비밀번호가 일치하지 않습니다.
                </div>
              )}
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
