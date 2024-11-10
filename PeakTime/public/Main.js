import { app, BrowserWindow, ipcMain } from "electron";
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
      preload: path.join(__dirname, "public", "preload.js"),
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
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  /*
   * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
   * */
  win.loadURL(startUrl);
}

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

app.whenReady().then(() => {
  createWindow();
  console.log(__dirname);

  // WebSocket 서버 생성
  const port = 12345;
  wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // WebSocket 연결 처리
  wss.on("connection", (ws) => {
    console.log("New client connected");

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
ipcMain.handle("getBackUrl", (event) => {
  return process.env.BACK_URL; // .env에서 로드한 BACK_URL 반환
});

//토큰 받기
ipcMain.on("sendAccessToken", (event, token) => {
  console.log("Received access token:", token);
  store.set("accessToken", token);
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
