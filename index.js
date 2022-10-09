(() => {
	const currentStatus = document.getElementById("current-status");
	const logBox = document.getElementById("log-box");

	let hasCheated = false;
	let idleInterval;
	let idleSeconds = 0;
	let latestStatus;
	let logCount = 0;
	let titleInterval;

	function getCurrentTime() {
		const now = new Date();
		return [
			now.getHours(),
			now.getMinutes(),
			now.getSeconds()
		].join(":");
	}

	function onEvent(log) {
		clearInterval(idleInterval);
		idleSeconds = 0;
		idleInterval = setInterval(() => {
			idleSeconds++;
			updateStatus("Idled for " + idleSeconds + " Seconds");
		}, 1000);
		if (log) {
			logCount++;
			logBox.innerText = logCount + ". " + latestStatus + "\n" + logBox.innerText;
		}
	}

	function updateStatus(text, isCheating = false) {
		if (isCheating) {
			hasCheated = true;
			text = "⚠️ CHEATING DETECTED: " + text;
		}
		latestStatus = "[" + getCurrentTime() + "] " + text;
		if (!hasCheated || isCheating) {
			currentStatus.innerText = latestStatus;
		}
	}

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			titleInterval = setInterval(() => {
				if (document.title.length == 5) {
					document.title = ".";
				} else {
					document.title = "Please come back!";
				}
			}, 1000);
			updateStatus("Left the Page", true);
		} else {
			clearInterval(titleInterval);
			document.title = "Hello again!";
			setTimeout(() => {
				document.title = "Anti-Cheating Demo";
			}, 1000);
			updateStatus("Returned to the Page");
		}
		onEvent(true);
	});

	onbeforeprint = () => {
		updateStatus("Printed the Page", true);
		onEvent(true);
	};

	onblur = () => {
		updateStatus("Focus Switched to Another Window");
		onEvent(true);
	};

	onfocus = () => {
		updateStatus("Focus Switched Back to This Window");
		onEvent(true);
	};

	onkeydown = evt => {
		if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === "s") {
			updateStatus("Saved the Page", true);
		} else {
			updateStatus("Key Pressed: " + evt.key);
		}
		onEvent(true);
	};

	onmousemove = evt => {
		updateStatus("Mouse Moved to (" + evt.x + ", " + evt.y + ")");
		onEvent();
	};

	onresize = () => {
		updateStatus("Window Size Changed (" + innerWidth + ", " + innerHeight + ")");
		onEvent();
	};

	document.onclick = evt => {
		updateStatus("Clicked at (" + evt.x + ", " + evt.y + ")");
		onEvent(true);
	};

	document.oncontextmenu = evt => {
		updateStatus("Right Clicked at (" + evt.x + ", " + evt.y + ")");
		onEvent(true);
	};

	document.oncopy = () => {
		updateStatus("Copied Data: " + getSelection().toString(), true);
		onEvent(true);
	};

	document.oncut = () => {
		updateStatus("Cut Data", true);
		onEvent(true);
	};

	document.onpaste = evt => {
		updateStatus("Pasted Data: " + evt.clipboardData.getData("text"));
		onEvent(true);
	};

	document.getElementById("camera-btn").onclick = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(stream => {
				camera.srcObject = stream;
				camera.onclick = function () {
					this.requestPictureInPicture();
				}
			});
		}
	};

	document.getElementById("share-screen-btn").onclick = () => {
		navigator.mediaDevices.getDisplayMedia({
			video: {
				cursor: "always"
			},
			audio: false
		}).then(stream => {
			const screenView = document.getElementById("screen-view");
			screenView.srcObject = stream;
			screenView.onclick = function () {
				this.requestPictureInPicture();
			}
		});
	};
})();
