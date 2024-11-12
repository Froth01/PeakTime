import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// 현재 파일의 디렉토리 경로 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 모듈 경로를 file:// URL로 변환
const modulePath = pathToFileURL(path.resolve(__dirname, './endHiking.js')).href;

// 하이킹 중 데이터 변수
let siteData = [];
let programData = [];
let isSiteDone = false;
let isProgramDone = false;

// endHikingProcess 모듈을 동적으로 가져오기 위한 함수
async function getEndHikingProcess() {
  const { endHikingProcess } = await import(modulePath);
  return endHikingProcess;
}

// 익스텐션 사이트 정보 지정하기
export function siteProcess(data) {
  siteData = data;
  isSiteDone = true;
  console.log("site complete:", siteData);
}

// 일렉트론 프로그램 정보 지정하기
export function programProcess(data) {
  programData = data;
  isProgramDone = true;
  console.log("program complete:", programData);
}

// 확인 함수
export async function checkDone(event, hikingId, accessToken) {
  try {
    if (isSiteDone && isProgramDone) {
      const sumData = [...siteData, ...programData];
      
      // 동적으로 endHikingProcess 함수 가져오기
      const endHikingProcess = await getEndHikingProcess();
      await endHikingProcess(sumData, hikingId, accessToken); // API 요청
      event.reply("all-done", sumData);
    } else {
      console.log("Data is not ready.");
    }
  } catch (error) {
    console.error("Error in checkDone:", error); // 예외를 잡아서 로그로 출력
  }
}

// 시작할 때 값 초기화하기
export function resetProcess() {
  siteData = [];
  programData = [];
  isSiteDone = false;
  isProgramDone = false;
}
