{/* <div class="switchContainer"></div> */}


//     document.addEventListener("DOMContentLoaded", ()=>{
//         const swtObj = new toggleSwitch(".switchContainer");
// //         swtObj.label = {
// //    on:"AUTO",
// //    off:"MANUAL"
// // };

//         swtObj.onChange((state)=>{
//             console.log(state);
//         })
//     });

export class toggleSwitch{
	#elemts = {};
	#labels = {onLabel : "ON", offLabel : "OFF"};
	constructor(selector){
		
		this.#getElemts(selector); 
		this.#setCSS(); 
	}

	#getElemts(selector){
		const container = document.querySelector(selector);
		container.innerHTML = this.#innerHtml();
		
		this.#elemts.swt = container.querySelector('input[type="checkbox"]');
		
		this.#elemts.onLabel = container.querySelector('.on').textContent = this.#labels.onLabel;
		this.#elemts.offLabel = container.querySelector('.off').textContent = this.#labels.offLabel;

			this.#elemts.container = container;
	}
	get value(){
		return this.#elemts.swt.checked;
	}

	onChange(callback){
		const {swt} =this.#elemts;
		swt.addEventListener('change', e=>{
			callback?.(e.target.checked);
		});
	}
	set label({ on = "ON", off = "OFF" } = {}){
		const {container, onLabel , offLabel} = this.#elemts;

		const onText = on ?? "ON";
		const offText = off ?? "OFF";

		this.#labels.onLabel = onText;
		this.#labels.offLabel = offText;

		onLabel.innerText = onText;
		offLabel.innerText = offText;
	}

	#innerHtml(){
		const {onLabel, offLabel} = this.#labels;
		return `<label class="switch">
					<input type="checkbox">
					<span class="on swtLabel" >${onLabel}</span>
					<span class="off swtLabel">${offLabel}</span>

					<div class="slider"></div>

				</label>`;
	}

	#setCSS(){
		const {container} = this.#elemts;
		const styles = getComputedStyle(container);
		const css = 
		` /* .switchContainer,  */
.switchContainer *{
	/* border: 1px solid red; */
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	font-family:Arial,sans-serif;
}
.switchContainer{
	--switchWidth : ${styles.width || "200px"};
	--switchHeight : calc(var(--switchWidth)* 0.5);
	width: var(--switchWidth);
	height: var(--switchHeight);
	background: linear-gradient(45deg, #bcbcbc, #e8e8e8);
	border-radius: calc(var(--switchWidth)* 0.25);
}
.switchContainer input[type="checkbox"]{
	display: none;
}
.switchContainer label{
	background: linear-gradient(-180deg,#ffffff 0%,#7a7a7a 100%);
	position: relative;
	display: block;
	width: calc(var(--switchWidth)* 0.95);
	height: calc(var(--switchHeight)* 0.95);
	border-radius: calc(var(--switchWidth)* 0.25);
	transform: translate(3%, 3%);
	
	/* border ki jagah */
	border: 1px solid black;
	/* outline: 3px solid rgb(201, 201, 201); */
	/* padding: 5px; 
	
	box-sizing: border-box; */
}
.switchContainer label .slider{
	position: absolute;
	top: 50%;
	left: calc(var(--switchWidth) * 0.05);
	transform: translateY(-50%);

	width: calc( var(--switchWidth)* 0.85);
	height: calc( var(--switchHeight)* 0.9);

	aspect-ratio: 1;
	border-radius: calc(var(--switchWidth)* 0.25);
	border: 1px solid white;
	
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.3s ease;
}

.switch .swtLabel{
	font-family: Arial, Helvetica, sans-serif;
	user-select: none;
	transition: color 0.3s ease, transform .2s ease;
	background: linear-gradient(45deg, #000000 0%, #515151 50%, #000000 100%);
	-webkit-background-clip : text;
	-webkit-text-fill-color:transparent;
	z-index: 1;
	font-size: calc(var(--switchWidth)* 0.13);
	font-weight: 600;
}
.switch .swtLabel.on{
	position: absolute;
	top: 50%;
	left: calc( var(--switchWidth)* 0.2);
	transform: translateY(-50%);
}
.switch .swtLabel.off{
	position: absolute;
	top: 50%;
	right: calc( var(--switchWidth)* 0.2);
	transform: translateY(-50%);
}
.switchContainer input[type="checkbox"]:checked ~  .swtLabel.on{
	/* color: white; */
	/* transform: translate(-2px,-50%); */
	background: linear-gradient(45deg, #3cb248 0%, #c4d933 50%, #72c84a 100%);
	text-shadow: 0 0 3px rgba(195, 217, 51, 0.2),
				0 0 8px rgba(60, 178, 72, 0.1);
	-webkit-background-clip : text;
	-webkit-text-fill-color:transparent;
}

.switchContainer input[type="checkbox"]:not(:checked) ~ .swtLabel.off{
	/* transform: translate(2px,-50%); */
	background: linear-gradient(45deg, rgb(255, 38, 0) 0%, #c4d933 50%,rgb(255, 38, 0) 100%);
	text-shadow: 0 0 1px rgba(255, 38, 0, 0.4),
				0 0 2px rgba(196, 217, 51, 0.3),
				0 0 3px rgba(255, 38, 0, 0.2);
	
	
	-webkit-background-clip : text;
	-webkit-text-fill-color:transparent;
}

.switchContainer input[type="checkbox"]:checked ~ .slider{
	/* left: calc(var(--switchWidth)* 0.05); */
	transform: translate(-3%, -50%);
	/* border-right-width: 2px ; */
	box-shadow:  inset -3px 0 4px rgba(255,255,255,.8),
				0 1px 4px rgba(0,0,0,.18);
	background: linear-gradient(-90deg, #8e8e8e 0%, #f3f3f3 50%, #e6e6e6 100%);
}
.switchContainer input[type="checkbox"]:not(:checked) ~ .slider{
	/* right: calc(var(--switchWidth)* 0.05); */
	transform: translate(3%, -50%);
	border-left-width: 2px;       
		box-shadow:  inset 3px 0 4px rgba(255,255,255,.8),
				0 1px 4px rgba(0,0,0,.18); 
	background: linear-gradient(95deg, #929292 0%, #f3f3f3 50%, #ededed 100%);
}
.switchContainer input[type="checkbox"]:checked ~ label{
	/* border-right-width: 2px; */
	box-shadow: inset -2px 0 0 rgba(0,0,0,.2);
}
.switchContainer input[type="checkbox"]:not(:checked) ~ label{
	/* border-left-width: 2px; */
	box-shadow: inset 2px 0 0 rgba(0,0,0,.2);
}`;
		const id = "toggleaSwitchStyling";
		if (!document.getElementById(id)){
			
			// console.log(styles.width);
			const styleElemnt = document.createElement("style");
			styleElemnt.innerHTML = css;
			document.head.append(styleElemnt);
		}
			
	}
	
}