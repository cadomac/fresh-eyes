chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("loaded")
  if (changeInfo.status === "complete" && tab.active) {
    console.log("active")
    chrome.scripting.executeScript({
      target: {tabId: tab.id ?? -1},
      files: ["js/filters.js"]
    })
  }
})