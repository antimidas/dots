function clickClaimBtn0() {	
	for (let el of document.querySelectorAll('div[data-a-target="tw-core-button-label-text"]')) {
		if (el.textContent.includes('Claim Now')) {			
			el.click();
		}
	}	
}

setTimeout(function(){
	// After page load complete, give 5s buffer
	clickClaimBtn0();
}, 5000);