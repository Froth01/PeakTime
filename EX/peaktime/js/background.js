// background.js (Service Worker)
import "./webSocket.js";
import "./saveText.js";
import "./tracking.js";
import { receivedSocketMessage, getConnectStatus, sendSocketMessage } from "./webSocket.js";

// 설치할때 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log('extension installed');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.action==="quit") {
    receivedSocketMessage({action:"end"})
  }
  if(msg.action==="checkSocketStatus") {
    const status = getConnectStatus();
    console.log(status)
    sendResponse({ connected: status });
  }
  if(msg.action==="addUrl") {
    //크롬 저장소에 현재 url저장하기
    chrome.storage.local.get({ websiteList: [] }, function (data) {
      const websiteList = data.websiteList; // 기존 리스트 가져오기
      websiteList.push(msg.url); // 새로운 URL 추가
      // 업데이트된 리스트를 다시 저장
      chrome.storage.local.set({ websiteList: websiteList }, function () {
      });
    });

    // 비동기적으로 presetId 값을 가져온 후에 sendSocketMessage 호출
    chrome.storage.local.get("presetId", function (data) {
      const presetId = data.presetId; // 가져온 presetId 값

      // 일렉트론으로 현재 url 보내기
      sendSocketMessage({ action: "addUrl", url: msg.url, presetId: presetId});
    });

  }

  if(msg.action==="saveMemo") {
    sendSocketMessage({ action: "saveMemo", title: msg.title, content: msg.content })
  }

})