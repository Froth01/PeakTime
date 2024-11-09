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
  console.log('사이트정보 됐습니다 :', siteData, isSiteDone)
}

// 일렉트론 프로그램정보 지정하기
export function programProcess(data) {
  programData = data;
  isProgramDone = true;
  console.log('프로그램정보 됐습니다 :', siteData, isSiteDone)
}

// 확인 함수
export function checkDone(event, hikingId) {
  console.log('됐는지 체크하려합니다')
  if (isSiteDone && isProgramDone) {
    const sumData = [...siteData, ...programData]
    const startedHikingId = hikingId
    endHikingProcess(sumData, startedHikingId);
    event.reply('all-done', sumData)
  }
}

// 시작할때 값 초기화하기
export function resetProcess() {
  siteData = [];
  programData = [];
  isSiteDone = false;
  isProgramDone = false;
}