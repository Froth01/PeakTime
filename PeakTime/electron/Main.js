import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import url from "url";
import WebSocket, { WebSocketServer } from "ws";
import { startWatcher, endWatcher } from "./processWatcher.js";
import {
  checkDone,
  programProcess,
  resetProcess,
  siteProcess,
} from "./process.js";

import Store from "electron-store";
import dotenv from "dotenv";

dotenv.config();
const store = new Store();

const __dirname = path.resolve();


function createWindow() {
  // 일렉트론 크기
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(
        __dirname,
        // "resources",
        // "build",
        "electron",
        "preload.js"
      ),
      contextIsolation: true,
      nodeIntegration: false, // 보안 상 비활성화
      sandbox: true,
      enableRemoteModule: false,
    },
  });

  /*
   * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
   * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
   * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
   * */
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "resources", "build", "index.html"),
      protocol: "file:",
      slashes: true,
    });

  /*
   * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
   * */
  win.loadURL(startUrl);
}

// 일렉트론 종료
app.on('before-quit', (event) => {
  // 소켓 종료

  wss.close();
  endWatcher();

  event.preventDefault();
  app.exit(0);
});

let wss;

// 웹소켓 메세지 주고받기
ipcMain.on("websocket-message", (event, action) => {
  if (wss && wss.clients) {
    let count = 0;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(action);
        count += 1;
      }
    });
    console.log(count);
  }
});

let lastWebSocketMessage = null; // 마지막 메시지 저장

// 렌더러 프로세스에서 메시지를 설정하는 이벤트 리스너
ipcMain.on("set-start-hiking", (event, message) => {
  lastWebSocketMessage = message;
});

app.whenReady().then(() => {
  createWindow();
  console.log(__dirname);

  session.defaultSession.cookies
    .get({ url: "http://localhost:5173" }) // 실제 URL로 변경
    .then((cookies) => {
      console.log(cookies); // 쿠키 확인
    })
    .catch((error) => {
      console.error("쿠키 조회 중 오류 발생:", error);
    });

  // WebSocket 서버 생성
  const port = 12345;
  wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // WebSocket 연결 처리
  wss.on("connection", (ws) => {
    console.log("New client connected");

    // 새 클라이언트에게 저장된 메시지 전송
    if (lastWebSocketMessage) {
      ws.send(lastWebSocketMessage);
      // console.log("Sent saved message to new client:", lastWebSocketMessage);
    }
    // 클라이언트로부터 메시지 수신
    ws.on("message", (message) => {
      console.log(`Received from client: ${message}`);
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("websocket-message", message);
      });
    });

    // 클라이언트 연결 종료
    ws.on("close", () => {
      console.log("Client disconnected");
    });

    // 에러 처리
    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });
});

// 하이킹 정보 받기
ipcMain.on("hikingInfo", async (event, data) => {
  try {
    console.log("hikingInfo Main on");
    const accessToken = await store.get("accessToken");
    console.log("store accessToken : ", accessToken);

    const response = data.urlList;
    await siteProcess(response); // 비동기 처리 완료 기다리
    console.log("siteProcess :", response);
    checkDone(event, data.hikingId, accessToken);
  } catch (error) {
    console.error("hikingInfo error :", error);
  }
});

// 차단 프로그램 시작
ipcMain.on("start-block-program", (event, data) => {
  startWatcher(data);
  resetProcess();
});

// .env에서 로드된 환경 변수 반환
ipcMain.handle("getBackUrl", async (event) => {
  const url = await store.get("url");
  return url;
});

//토큰 받기
ipcMain.on("sendAccessToken", (event, token) => {
  console.log("Received access token:", token);
  store.set("accessToken", token);
});

//url 받기
ipcMain.on("sendBackUrl", (event, url) => {
  console.log("Received back url:", url);
  store.set("url", url);
});

// 메모저장 신호받기
ipcMain.on("save-memo", (event, data) => {
  console.log("this is save-memo in main:", data);

  // 메모 정보를 렌더러로 응답으로 보내기
  event.reply("save-memo-response", data);
});

// 프리셋 url 추가하기
ipcMain.on("add-url", (event, data) => {
  console.log("this is add-url in main:", data);
  // 추가한 url 정보를 렌더러로 응답으로 보내기
  event.reply("add-url-response", data);
});

// 차단 프로그램 종료
ipcMain.on("end-block-program", async (event, data) => {
  try {
    console.log("program end Main on");
    const accessToken = await store.get("accessToken");
    console.log("store accessToken : ", accessToken);
    const response = endWatcher();
    await programProcess(response); // 비동기 처리 완료 기다리기
    console.log("programProcess :", response);
    checkDone(event, data, accessToken);
  } catch (error) {
    console.error("program error:", error);
  }
});