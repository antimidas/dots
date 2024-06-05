function clickClaimBtn1() {	
	let foundClaimBtn = false;
	
	for (let el of document.querySelectorAll('div[data-a-target="tw-core-button-label-text"]')) {
		if (el.textContent.includes('Claim Now')) {
			foundClaimBtn = true;
			el.click();
		}
	}	
	
	if(!foundClaimBtn){
		window.location.reload();
	}
}

clickClaimBtn1();