const last = {refresh: 0};
const icon = document.createElement('img');
icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACCElEQVR4Ad2XgWbDYBDHy9jAKDBmKNhsa7usactgMoxVqSxfB2B7g/UNljVGMVuZbcxIp5YkIH2DPkIfoY+QR8hynaN6kZw0anacQO7+v+8u3/ddcv/Cqo4YV21tAk/ZuuzLlqpKpppPl8zV7maJXHHNet9WlfD9IMplR5iSrRb44o72PJ8AYJYAQIgpazEVW7vBIAYEG4C9GCDlB1MAPgQjCT+YD4AuW0IlScrDlp56BXpR2egdB5uP9aDwcR6Uhq2kPD7dIfelAQTzVqF1FgFyRilAX+9VgsRctqYTAAhmQoziANC3X5XYKkQCMCCgh30OAPie2YipQluZAyjqEJAEIdtigCEcAGgHr5VGSYUACkHFWQCMKsCRPZdEykcFIwSWPQ3A1stpJEDNESamwCqMoxLsfl6MctQS4dHzTyeRAPR47h52yJf89vsl18nL2RuuxF8UB18dBOwGKr46CKjCzvuZT8VXCCG7QkWxtBDS95VUdYUH80UqCNjzfAgqLjvCj95uTIPbCucDPgQVj75FmQazHB+CimcCUYNekqTUi+E8QcUzhIirxMFXM1h7OOJe5Zm2A8XJ3cFsWwoI3B1UnA+BA0laq1jtzv6gOaXifAio5rInZiFn4BTFh0Bx/t8SH2TKgZBt4eFEnL0ZMJiUb8OnF/p4BtUtTnbNhle12zrOgH/OfgDMuAxQtLPe6QAAAABJRU5ErkJggg==';
icon.onload = update;
const port = chrome.runtime.connect();
port.onMessage.addListener(update);
function update() {
	const tabs = Array.from(document.querySelectorAll('mat-sidenav-content mat-icon + * + .navItemBadge'));
	const title = tabs.map(el => el.parentNode.parentNode.parentNode.ariaLabel.replace(' unread', '')).join(', ');
	document.title = `Voice${title ? ' - ' + title : ''}`;
	const count = tabs.map(el => el.innerText * 1).reduce((a, b) => a + b, 0);
	if (last.count != count) {
		const canvas = document.createElement('canvas');
		canvas.height = canvas.width = 32;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(icon, 0, 0, 32, 32);
		ctx.font = `${count < 100 ? '20px' : '17px'} "Google Sans", "Helvetica Neue", sans-serif`;
		ctx.fillStyle = '#202124';
		ctx.strokeStyle = '#e0f2f1';
		ctx.lineWidth = 3;
		ctx.miterLimit = 2;
		ctx.lineJoin = 'round';
		const offsetX = 31 - ctx.measureText(count).width;
		ctx.strokeText(count, offsetX, 30);
		ctx.fillText(count, offsetX, 30);
		ctx.fillText(count, offsetX, 30);
		const link = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = canvas.toDataURL();
		document.head.replaceChild(link, document.querySelector('link[type=image\\/x-icon]'));
	}
	last.count = count;
	const active = document.querySelector('.gv_root .gmat-list-item-active .navItemBadge');
	const actual = document.querySelectorAll('.gmat-subtitle-2').length;
	if (active && Number(active.innerText) != actual && last.refresh < 100) {
		console.log(last.refresh);
		if (++last.refresh > 99 && Date.now() - (localStorage.refreshed || 0) > 6e5) {
			console.log(Date.now(), (localStorage.refreshed || 0), Date.now() - (localStorage.refreshed || 0));
			localStorage.refreshed = Date.now();
			document.location.reload();
		}
	} else {
		last.refresh = 0;
	}
	port.postMessage(Date.now());
}
