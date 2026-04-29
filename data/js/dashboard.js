import {waterTank, WatterTankScale} from './watterTank.js';
import { SVGChart } from "./svgChartFramework.js";

import { headerNfooter } from "./headerNfooter.js";
import { navBar } from './navBar.js';

import { toggleSwitch } from './toggleSwitch.js';


document.addEventListener("DOMContentLoaded", ()=>{
	const myDashbord = new Dashbord();   
});

class Dashbord{
	#controlElemts ={};
	#elemts ={};
	#popupElemts ={};
	#tankObj = null;
	#watterTankScale = null;
	constructor(){
		this.#tankObj = new waterTank();
		new headerNfooter();
		new navBar();
		this.#watterTankScale = new WatterTankScale("tankScale");
		const AutomaionSwitchBtn = new toggleSwitch("#AutomaionSwitchBtn");
		const MotorSwitchBtn = new toggleSwitch('#MotorSwitchBtn');

		this.#getElemts();
		this.#setEvents();
		this.#setEventsOnControls();
		this.#setEventsOnPopUp();
		// this.#themeSetup();
		this.#showChart();

		//setup constols
		this.#motorSwitch();
		this.#tester();
	}

	#getElemts(){
		const controlsElemtMap ={
			batteryArea : {id: 'batteryArea'},
			wifiStrength :{id: 'wifiStrength'},
			deviceStatus :{id: 'deviceStatus'},
			motorStatus :{id: 'motorStatus' },
			tankCapacity :{id: 'tankCapacity' },			
			remainingWater :{id: 'remainingWater' },
			flowRate :{id: 'flowRate' },
			tanksetupBtn: {id: "tanksetup"},
		};

		for (const [key, value] of  Object.entries(controlsElemtMap)){
			this.#controlElemts[key] = document.getElementById(value.id);
		}
		// const popupElemtMap ={
		// 	modalOverlay : {id : 'modalOverlay'},
		// };
		// for (const [key, value] of  Object.entries(popupElemtMap)){
		// 	this.#popupElemts[key] = document.getElementById(value.id);
		// }
		
	}

	#setEvents(){}
	#setEventsOnControls(){
		const {tankCapacity, remainingWater, tanksetupBtn} = this.#controlElemts;
		
	}
	#updateTankCapacity(){
		const { tankCapacity } = this.#controlElemts;
		tankCapacity.querySelector('.value').innerText = this.#tankObj.getTankState().capacity +" Liters";
	}
	#updateRemingWater(){
		const { remainingWater} = this.#controlElemts;
		remainingWater.querySelector('.value').innerText = this.#tankObj.getTankState().remaining.liters +" Liters" + this.#tankObj.getTankState().remaining.percentage + "percentage";
		
	}
	#setEventsOnPopUp(){
		// const {modalOverlay, } =this.#popupElemts;
		const modalOverlay = document.getElementById('modalOverlay');
		// const {tanksetupBtn} = this.#controlElemts;
		
		
		// /* pop launch and close Events */ 
		// tanksetupBtn.addEventListener('click', ()=>{
		// 	userProfileSettingPopup.classList.add('hide');
		// 	tenkSetupPopUp.classList.remove("hide");
		// 	openModal();
		// });

		function openModal() {
			// Overlay ko display block (ya flex) karein
			modalOverlay.style.display = 'flex';
		}

		const closePopUp = document.getElementById('closePopUp');
		closePopUp.addEventListener('click', closeModal);
		function closeModal() {
			// Overlay ko wapas chhupa dein
			modalOverlay.style.display = 'none';
		}

		// Agar user modal ke bahar (kali layer par) click kare toh bhi band ho jaye
		
		modalOverlay.addEventListener('click', (e)=>{
			if (e.target.id === 'modalOverlay'){
				closeModal();
			}
		});



	}
	

	#motorSwitch(){
		const motorSwitchBtn = document.getElementById("MotorSwitchBtn");
		motorSwitchBtn.addEventListener("change", (e) => {
			if (e.target.checked) {
				console.log("ON");
			} else {
				console.log("OFF");
			}
		});
	}

	

	
	#showChart(){
		new SVGChart("#todysGraph", {
			chart:{
				type: 'line',
				title : "Last 24hr Chart",
			},
			xAxis: { 
				title: "Time",
			},
			yAxis:{
				title: "Water Lavel (in %)",
			},
			data: {
				labels: ['12am', '01am', '02am', '03am', '04am', '05am', '06am', '07am', '08am', '09am', '10am', '11am', '12pm', '01pm', '02pm', '03pm', '04pm', '05pm', '06pm', '07pm', '08pm', '09pm', '10pm', '11pm'],
				datasets: [{	
						label: "Tank 1", 
						data: [10, 20, 30, 40 , 50, 40, 0, 20, 50, 70, 100, 5, 10, 20, 30, 40 , 50, 40, 10, 20, 50, 70, 100, 5],
						color: "#0BB5FF"
					}],
			},
		});
	}
	#tester(){
		document.getElementById("levelSlider").addEventListener("input", (e)=>{
			const {remainingWater, flowRate} = this.#controlElemts;
			const percent = e.target.value;
			this.#watterTankScale.updateTank(percent);
			remainingWater.querySelector('.value').textContent = this.#tankObj.water_Percentage2Liters(percent) + " Liters";

			const stats = this.#tankObj.calculateRemainingWater(Number(percent));
			flowRate.querySelector('.value').innerHTML = 
			`<span style=" font-size:8px;">Flow %: ${stats.flowPercentPerMin.toFixed(2)} %/min</br>,
			Flow Liter: ${stats.flowLiterPerMin.toFixed(2)} L/min</br>,
			Remaining: ${stats.remainingWater.toFixed(2)} L</br>,
			Time to Fill: ${stats.timeToFill.toFixed(2)} min </span>`;
		});
	}
}

function setTankAlert(level){

const box=document.querySelector(".danger");

if(level > 90){
box.querySelector(".badge").textContent="DANGER";
box.querySelector("p").textContent="Overflow Risk";
}

else if(level > 70){
box.className="alertItem warning";
}

else{
box.className="alertItem success";
}

}



const stack=document.getElementById("alertStack");
const log=document.getElementById("eventLog");

function createAlert(type,msg){

/* TOAST */
const toast=document.createElement("div");

toast.className=`toast ${type}`;
toast.textContent=msg;

stack.prepend(toast);

setTimeout(()=>{
toast.remove();
},4000);



/* LOG QUEUE */
const li=document.createElement("li");

li.className=`logItem ${type}`;

let time=new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

li.innerHTML=`
<span class="logTime">${time}</span>
<span>${msg}</span>
`;

log.prepend(li);

}


/* demo */
createAlert("success","Motor Started");

setTimeout(()=>{
createAlert("warning","Low Flow Detected");
},3000);

setTimeout(()=>{
createAlert("danger","Tank Overflow Risk");
},6000);



document
.getElementById("clearLogBtn")
.addEventListener("click",()=>{
log.innerHTML="";
});


// ESP32 sensor values से use:
const level = 96; //testing value
const flowRate =1; //testing value
if(level > 95){
createAlert(
"danger",
"Overflow risk detected"
);
}

if(flowRate < 2){
createAlert(
"warning",
"Flow rate too low"
);
}