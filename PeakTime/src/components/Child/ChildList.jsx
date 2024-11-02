import PropTypes from "prop-types";
import { useState } from "react";

function ChildList({ onChangeContent }) {
  // 그룹 리스트 > 차일드 리스트
  const [groupList, setGroupList] = useState([
    {
      groupId: 1,
      groupTitle: "그룹1",
      childList: ["차일드1", "차일드2", "차일드3"],
    },
    {
      groupId: 2,
      groupTitle: "그룹2",
      childList: ["차일드4", "차일드5", "차일드6"],
    },
    {
      groupId: 3,
      groupTitle: "그룹3",
      childList: ["차일드7", "차일드8", "차일드9"],
    },
  ]);

  // 창 변경할때
  const handleChangeContent = (content, id) => {
    onChangeContent(content, id);
  };
  // 창 변경
  const handleAddGroup = () => {
    handleChangeContent("addGroup", null);
  };
  const handleAddChild = () => {
    handleChangeContent("addChild", null);
  };
  return (
    <div className="absolute left-[10vw] w-[30vw] h-[100vh] bg-green-200 flex flex-col justify-between">
      <div className="flex flex-col">
        {groupList.map((group, index) => (
          <div key={index} className="flex flex-col">
            <button
              onClick={() => handleChangeContent("updateGroup", index + 1)}
            >
              {group.groupTitle}
            </button>
            {group.childList.map((child, index) => (
              <div key={index}>
                <button
                  onClick={() => handleChangeContent("updateChild", index + 1)}
                >
                  {child}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleAddGroup}>그룹 추가</button>
        <button onClick={handleAddChild}>계정 추가</button>
      </div>
    </div>
  );
}
// props validation 추가
ChildList.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
};
export default ChildList;
