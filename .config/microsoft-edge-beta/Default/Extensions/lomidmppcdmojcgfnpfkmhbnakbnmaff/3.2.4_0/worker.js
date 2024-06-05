chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener(() => {
		setTimeout(() => port.postMessage(Date.now()), 100);
	});
});
