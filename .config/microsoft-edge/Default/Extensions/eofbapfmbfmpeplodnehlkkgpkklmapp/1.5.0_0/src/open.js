const openInPolypane = url => {
  chrome.tabs.update({ url: `polypane://${url}` });
};

const handleContextMenu = info => openInPolypane(info.linkUrl);

chrome.browserAction.onClicked.addListener(tab => openInPolypane(tab.url));

chrome.contextMenus.create({
  title: "Open in Polypane",
  contexts: ["link"],
  onclick: handleContextMenu
});

chrome.commands.onCommand.addListener(function(command, tab) {
  if (command === "open-in-polypane") {
    if (tab) {
      openInPolypane(tab.url);
    } else {
      chrome.tabs.query({ active: true }, tabs => {
        openInPolypane(tabs[0].url);
      });
    }
  }
});
