browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    browser.scripting
      .executeScript({
        target: { tabId: tab.id ?? -1 },
        files: ["js/filters.js"],
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
