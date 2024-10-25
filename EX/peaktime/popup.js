// popup.js
document.getElementById("reset").onclick = function() {
    chrome.storage.local.clear(function() {
        const textarea = document.getElementById("savedText");
        textarea.value = "";
    })
}

//사용자가 익스텐션을 열었을 경우
document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById("savedText");
  
    // 팝업이 열리면 저장된 텍스트 가져와서 textarea에 추가
    chrome.storage.local.get({ savedTexts: [] }, function (data) {
      data.savedTexts.forEach(text => {
        textarea.value += text + "\n";
      });
    });

    // 현재 활성 탭의 정보를 가져옴
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;  // 현재 탭의 URL
        const selectElement = document.getElementById("url");
        const urlObject = new URL(url);  // URL 객체 생성
        const hostname = urlObject.hostname; // 도메인만 추출
        const pathname = urlObject.pathname; // path 추출

        // select에 현재 탭의 URL 추가
        const fullDomain = document.createElement("option");
        fullDomain.value = hostname+pathname;
        fullDomain.text = hostname+pathname;
        selectElement.appendChild(fullDomain);

        // select에 현재 탭의 URL 추가
        const domain = document.createElement("option");
        domain.value = hostname;
        domain.text = hostname;
        selectElement.appendChild(domain);
        });
});