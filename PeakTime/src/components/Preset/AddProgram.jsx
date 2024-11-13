import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function AddProgram({ blockProgramArray, onAddProgram }) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [newProgram, setNewProgram] = useState("");

  useEffect(() => {
    setIsDuplicate(blockProgramArray.includes(newProgram));
    setIsEmpty(!newProgram);
    onAddProgram(newProgram, isDuplicate || isEmpty);
  }, [newProgram, isDuplicate, isEmpty, blockProgramArray, onAddProgram]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-around items-center gap-5 mb-2 w-full">
        <div className="text-[20px] font-bold ">차단할 프로그램</div>
        <input
          id="site"
          name="site"
          value={newProgram}
          placeholder="프로그램명을 입력하세요 (exe 파일 지원)"
          className="h-[40px] w-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333]"
          onChange={(e) => setNewProgram(e.target.value)}
        />
      </div>
      <div className="h-[40px] flex flex-col justify-center">
        {isEmpty && (
          <div className="text-[#F40000]">차단할 프로그램을 입력해주세요.</div>
        )}
        {isDuplicate && (
          <div className="text-[#F40000]">중복된 프로그램이 존재합니다.</div>
        )}
      </div>
    </div>
  );
}

AddProgram.propTypes = {
  blockProgramArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddProgram: PropTypes.func.isRequired,
};

export default AddProgram;
