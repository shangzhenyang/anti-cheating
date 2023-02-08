let hasCheated = false;
let idleInterval: number;
let idleSeconds = 0;
let latestStatus: string;
let logCount = 0;

function addZero(num: string, length: number) {
	return (Array(length).join("0") + (num || "0")).slice(-length);
}

function getCurrentTime() {
	const now = new Date();
	return [
		addZero(now.getHours().toString(), 2),
		addZero(now.getMinutes().toString(), 2),
		addZero(now.getSeconds().toString(), 2)
	].join(":");
}

export function onEvent(log = false) {
	clearInterval(idleInterval);
	idleSeconds = 0;
	idleInterval = setInterval(() => {
		idleSeconds++;
		updateStatus("Idled for " + idleSeconds + " Seconds");
	}, 1000);
	if (log) {
		const logBox = document.getElementById("log-box");
		if (logBox) {
			logCount++;
			logBox.innerText = logCount + ". " + latestStatus + "\n" +
				logBox.innerText;
		}
	}
}

export function updateStatus(text: string, isCheating = false) {
	if (isCheating) {
		hasCheated = true;
		text = "⚠️ CHEATING DETECTED: " + text;
	}
	latestStatus = "[" + getCurrentTime() + "] " + text;
	if (!hasCheated || isCheating) {
		const currentStatus = document.getElementById("current-status");
		if (currentStatus) {
			currentStatus.innerText = latestStatus;
		}
	}
}
