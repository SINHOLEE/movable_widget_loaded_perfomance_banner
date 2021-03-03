const utcTotime = (utc) => {
	const convertedSec = utc / 1000;
	const hour = parseInt(convertedSec / (60 * 60)) % 24;
	const min = parseInt(convertedSec / 60) % 60;
	const sec = parseInt(convertedSec % 60);
	return `${hour} : ${min} : ${sec}`;
};

const changeSpan = (widgetDiv, utcTotime) => {
	// console.log("change");
	const perfData = window.performance.timing;
	const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
	const connectTime = perfData.responseEnd - perfData.requestStart;
	const renderTime = perfData.domComplete - perfData.domLoading;
	const timeFromStart = utcTotime(Date.now() - perfData.domComplete);
	const dic = {pageLoadTime, connectTime, renderTime, timeFromStart};
	// console.log({dic});

	while (widgetDiv.firstElementChild) {
		widgetDiv.firstElementChild.remove();
	}
	Object.keys(dic).forEach((key) => {
		const span = document.createElement("span");
		span.style.display = "block";
		span.innerText = `${key} : ${dic[key]}`;

		widgetDiv.appendChild(span);
	});
	window.requestAnimationFrame(() => changeSpan(widgetDiv, utcTotime));
};

function createWidget() {
	const widgetDiv = document.createElement("div");

	widgetDiv.classList.add("sinho-widget");
	widgetDiv.style.backgroundColor = "black";
	widgetDiv.style.left = "10px";
	widgetDiv.style.top = "10px";
	widgetDiv.style.position = "fixed";
	widgetDiv.style.width = "200px";
	widgetDiv.style.height = "150px";
	widgetDiv.style.display = "flex";
	widgetDiv.style.flexDirection = "column";
	widgetDiv.style.justifyContent = "center";
	widgetDiv.style.alignItems = "center";
	widgetDiv.style.opacity = "0.6";
	widgetDiv.style.color = "white";
	widgetDiv.style.zIndex = "3000";
	widgetDiv.style.borderRadius = "20px";
	widgetDiv.setAttribute("draggable", true);
	return widgetDiv;
}
function init(utcTotime) {
	let widgetDiv = document.querySelector(".sinho-widget");
	const body = document.querySelector("body");

	if (!widgetDiv) {
		widgetDiv = createWidget();
	}

	changeSpan(widgetDiv, utcTotime);
	let adjX;
	let adjY;
	widgetDiv.addEventListener("dragstart", (e) => {
		const targetRect = widgetDiv.getBoundingClientRect();
		adjX = e.clientX - targetRect.x;
		adjY = e.clientY - targetRect.y;
	});
	widgetDiv.addEventListener("dragend", (e) => {
		const targetRect = widgetDiv.getBoundingClientRect();

		widgetDiv.style.left = `${e.clientX - adjX}px`;
		widgetDiv.style.top = `${e.clientY - adjY}px`;
		console.log(`e.clientX: ${e.clientX}`);
		console.log(`e.clientY: ${e.clientY}`);
		console.log(`adjX: ${adjX}`);
		console.log(`adjy: ${adjY}`);
		console.log("x ", e.clientX - adjX, "y ", e.clientY - adjY);
	});
	body.insertBefore(widgetDiv, body.firstElementChild);
	window.requestAnimationFrame(() => changeSpan(widgetDiv, utcTotime));
}

init(utcTotime);
