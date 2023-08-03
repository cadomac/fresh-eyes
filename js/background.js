chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("loaded")
  if (changeInfo.status === "complete" && tab.active) {
    console.log("active")
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ["js/filters.js"]
    })
  }
})