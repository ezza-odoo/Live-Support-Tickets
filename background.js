chrome.action.onClicked.addListener((tab) => {
  const lastActiveTabId = tab.id;

  chrome.storage.local.set({ lastActiveTabId }, () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 360,
      height: 350,
    });
  });
});