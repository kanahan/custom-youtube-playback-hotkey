chrome.webNavigation.onHistoryStateUpdated.addListener(function () {
  sendMsgToContentScript("HistoryStateUpdated");
});

function sendMsgToContentScript(msg) {
  chrome.tabs.query({ active: true, currentWindow: true },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { data: msg });
    });
};