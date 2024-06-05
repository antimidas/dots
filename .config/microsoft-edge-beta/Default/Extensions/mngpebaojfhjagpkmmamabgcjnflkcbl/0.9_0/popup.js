var pauseBtn = document.getElementById('ps-btn');
var intervalInput = document.getElementById('intvMins');

loadInterval();
stylePauseBtn();

async function loadInterval(){
	let interval = (await chrome.storage.sync.get('interval')).interval; 
	intervalInput.value = interval / 60 / 1000;
}

pauseBtn.addEventListener('click', async function(){	
	let paused = (await chrome.storage.sync.get('paused')).paused; 

	chrome.runtime.sendMessage({key: 'pause', value: !paused});	
	
	stylePauseBtn(!paused);
	
}, false);

document.getElementById("dn-btn").addEventListener('click', function(){
	chrome.tabs.create({ url: "https://www.paypal.com/donate?hosted_button_id=N7L5KNK4S3A2W" })	
}, false);

document.getElementById("tw-btn").addEventListener('click', function(){
	
	chrome.runtime.sendMessage({key: "getTwitchInvTab", value: true}, function(resp){
		if(!resp.t){
			chrome.tabs.create({ url: "https://www.twitch.tv/drops/inventory" })		
			return;
		}	
		
		chrome.tabs.update(resp.t.id, {active: true});		
	});

}, false);

document.getElementById("svIntv-btn").addEventListener('click', function(){	
	let ms = 60000;	
	if(intervalInput.value && intervalInput.value.length > 0 && intervalInput.value > 0 && intervalInput.value < 61){
		ms = intervalInput.value * 60 * 1000;
	}
	else{
		intervalInput.value = 1;
	}	
	chrome.runtime.sendMessage({key: "saveInterval", value: ms});	
}, false);

async function stylePauseBtn(priPause){
	let paused = priPause ?? (await chrome.storage.sync.get('paused')).paused; 
	
	if(paused){
		pauseBtn.classList.remove("btn-secondary");
		pauseBtn.classList.add("btn-primary");		
		pauseBtn.textContent = "Resume";

		return;		
	}
	
	pauseBtn.classList.add("btn-secondary");
	pauseBtn.classList.remove("btn-primary");
	pauseBtn.textContent = "Pause";				
}