import { endHikingProcess } from "./endHiking.js";

// 하이킹 중 데이터 변수
let siteData = [];
let programData = [];
let isSiteDone = false;
let isProgramDone = false;

// 익스텐션 사이트정보 지정하기
export function siteProcess(data) {
  siteData = data;
  isSiteDone = true;
  console.log('사이트 정보 처리 완료:', siteData);
}

// 일렉트론 프로그램정보 지정하기
export function programProcess(data) {
  programData = data;
  isProgramDone = true;
  console.log('프로그램 정보 처리 완료:', programData);
}

// 확인 함수
export async function checkDone(event, hikingId) {
  try {
    if (isSiteDone && isProgramDone) {
      const sumData = [...siteData, ...programData];
      await endHikingProcess(sumData, hikingId);  // API 요청
      event.reply('all-done', sumData);
    } else {
      console.log('데이터가 준비되지 않았습니다.');
    }
  } catch (error) {
    console.error('Error in checkDone:', error);  // 예외를 잡아서 로그로 출력
  }
}

// 시작할때 값 초기화하기
export function resetProcess() {
  siteData = [];
  programData = [];
  isSiteDone = false;
  isProgramDone = false;
}
