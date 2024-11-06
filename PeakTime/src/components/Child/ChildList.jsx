import PropTypes from "prop-types";

function ChildList({ onChangeContent, groupList }) {
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
    <div
      className="absolute left-[10vw] w-[25vw] h-[100vh] flex flex-col justify-start items-start p-5"
      style={{ backgroundColor: "#66AADF" }}
    >
      <h2 className="self-start mb-3">그룹 목록</h2>
      <div className="flex flex-col border border-black bg-white w-[20vw] h-[70vh] overflow-y-auto">
        {groupList.map((group, index) => (
          <div key={index} className="flex flex-col">
            <button
              onClick={() => handleChangeContent("updateGroup", group.groupId)}
              className="text-left font-bold ml-2"
            >
              {group.groupTitle}
            </button>
            {group.childList.map((child, childIndex) => (
              <div key={childIndex} className="flex items-center ml-4">
                <span className="mr-1">└</span>
                <button
                  onClick={() =>
                    handleChangeContent("updateChild", child.userId)
                  }
                  className="text-left"
                >
                  {child.nickname}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="self-start mt-3">
        {groupList.length < 5 ? (
          <button onClick={handleAddGroup}>+그룹 추가</button>
        ) : null}
        <button onClick={handleAddChild}>+계정 추가</button>
      </div>
    </div>
  );
}

// props validation 추가
ChildList.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
  groupList: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.number.isRequired,
      groupTitle: PropTypes.string.isRequired,
      childList: PropTypes.arrayOf(
        PropTypes.shape({
          userId: PropTypes.number.isRequired,
          userLoginId: PropTypes.string.isRequired,
          nickname: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
export default ChildList;
