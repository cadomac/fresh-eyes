chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id ?? -1 },
      files: ["js/filters.js"],
    });
  }
});
