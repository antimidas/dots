function clickClaimChannelPoints() {	
	let claimCpBtn = document.querySelector('button[aria-label="Claim Bonus"]');
	if(!claimCpBtn){
		return;
	}
	
	claimCpBtn.click();
}

clickClaimChannelPoints();