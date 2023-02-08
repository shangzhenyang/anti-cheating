import { onEvent, updateStatus } from "./utils";

const cameraBtn = document.getElementById("camera-btn");
const question = document.getElementById("question");
const shareScreenBtn = document.getElementById("share-screen-btn");

let titleInterval: number;

document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		titleInterval = setInterval(() => {
			if (document.title !== ".") {
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

window.addEventListener("beforeprint", () => {
	updateStatus("Printed the Page", true);
	onEvent(true);
});

window.addEventListener("blur", () => {
	updateStatus("Focus Switched to Another Window");
	onEvent(true);
});

window.addEventListener("focus", () => {
	updateStatus("Focus Switched Back to This Window");
	onEvent(true);
});

window.addEventListener("keydown", (evt) => {
	if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === "s") {
		updateStatus("Saved the Page", true);
	} else {
		updateStatus("Key Pressed: " + evt.key);
	}
	onEvent(true);
});

window.addEventListener("mousemove", (evt) => {
	updateStatus("Mouse Moved to (" + evt.x + ", " + evt.y + ")");
	onEvent();
});

window.addEventListener("resize", () => {
	updateStatus(
		`Window Size Changed (${window.innerWidth}, ${window.innerHeight})`
	);
	onEvent();
});

document.addEventListener("click", (evt) => {
	updateStatus("Clicked at (" + evt.x + ", " + evt.y + ")");
	onEvent(true);
});

document.addEventListener("contextmenu", (evt) => {
	updateStatus("Right Clicked at (" + evt.x + ", " + evt.y + ")");
	onEvent(true);
});

document.addEventListener("copy", () => {
	updateStatus("Copied Data: " + window.getSelection()?.toString());
	onEvent(true);
});

document.addEventListener("cut", () => {
	updateStatus("Cut Data: " + window.getSelection()?.toString());
	onEvent(true);
});

document.addEventListener("paste", (evt) => {
	updateStatus("Pasted Data: " + evt.clipboardData?.getData("text"));
	onEvent(true);
});

question?.addEventListener("copy", (evt) => {
	evt.stopPropagation();
	updateStatus(
		"Copied the Question: " + window.getSelection()?.toString(),
		true
	);
	onEvent(true);
});

question?.addEventListener("cut", (evt) => {
	evt.stopPropagation();
	updateStatus(
		"Cut the Question: " + window.getSelection()?.toString(),
		true
	);
	onEvent(true);
});

cameraBtn?.addEventListener("click", () => {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({
			video: true
		}).then((stream) => {
			const camera = document.getElementById("camera") as
				HTMLVideoElement;
			camera.srcObject = stream;
			camera.addEventListener("click", () => {
				camera.requestPictureInPicture();
			});
		});
	}
});

shareScreenBtn?.addEventListener("click", () => {
	navigator.mediaDevices.getDisplayMedia().then((stream) => {
		const screenView = document.getElementById("screen-view") as
			HTMLVideoElement;
		screenView.srcObject = stream;
		screenView.addEventListener("click", () => {
			screenView.requestPictureInPicture();
		});
	});
});
