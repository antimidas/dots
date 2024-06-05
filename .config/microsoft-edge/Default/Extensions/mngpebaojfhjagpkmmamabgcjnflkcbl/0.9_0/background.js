var _paused = false;
var _interval = 60000;
var _twitchTabId = 0;
var _intervals = [];

loadSettings();
async function loadSettings(){
	let paused = (await chrome.storage.sync.get('paused')).paused;	
	if(typeof paused != 'boolean'){
		chrome.storage.sync.set({ 'paused': _paused });
	}
	else{
		_paused = paused;
	}
	
	let interval = (await chrome.storage.sync.get('interval')).interval;	
	if(isNaN(interval)){
		chrome.storage.sync.set({ 'interval': _interval });			
	}
	else{
		_interval = interval;		
	}
	
	reloadInterval();	
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){	
    if(request.key == 'pause'){
        _paused = request.value;
		chrome.storage.sync.set({ 'paused': _paused });
    }
	else if(request.key == 'getTwitchInvTab'){
		getTwitchInvTab(function(t){
			sendResponse({'t': t});	
		});	
	}
	else if(request.key == 'saveInterval'){		
		_interval = request.value;
		chrome.storage.sync.set({ 'interval': _interval });
		reloadInterval();
	}
	
	return true;
});

function reloadInterval(){		
	clearInterval(_intervals['mainCheck']);
	
	_intervals['mainCheck'] = setInterval(function(){ 		
		console.log('###doing loop###');
		if(_paused){
			console.log('paused!');			
			return;
		}		
		
		getTwitchInvTab(function(t){			
			if(t){
				chrome.scripting.executeScript({
					target: {tabId: t.id, allFrames: true},
					files: ['/tw1.js'],
				});					
			}					
		});	
		
		getTwitchStreamTabs(function(tabs){			
			console.log('stream tabs:', tabs);
			if(tabs.length){
				for(let t of tabs){
					chrome.scripting.executeScript({
						target: {tabId: t.id, allFrames: true},
						files: ['/twCP.js'],
					});				
				}
			}										
		});					
	}, 30000);
}

chrome.tabs.onUpdated.addListener(function (tabId , info) {		
	if(info.status != 'complete'){
		return;
	}
	
	console.log('info.status:',info.status);
	
	getTwitchInvTab(function(t){		
		if (tabId == _twitchTabId) {
			chrome.scripting.executeScript({
				target: {tabId: t.id, allFrames: true},
				files: ['/tw0.js'],
			});			
		}		
	});	

	getTwitchStreamTabs(function(tabs){			
		if(tabs.length){
			for(let t of tabs){
				chrome.scripting.executeScript({
					target: {tabId: t.id, allFrames: true},
					files: ['/twCP.js'],
				});				
			}
		}												
	});		
});

function getTwitchInvTab(callback){	
	chrome.tabs.query({}, function(tabs) {		
		let twitchTab = tabs.find(x => x.url == 'https://www.twitch.tv/drops/inventory') || false;		
		_twitchTabId = twitchTab ? twitchTab.id : 0;
				
		callback(twitchTab);	
	});		
}

function getTwitchStreamTabs(callback){	
	chrome.tabs.query({}, function(tabs) {				
		let filtered = tabs.filter(x => x.url.includes('https://www.twitch.tv/') && !x.url.includes('/drops/'));	
		
		callback(filtered);	
	});		
}