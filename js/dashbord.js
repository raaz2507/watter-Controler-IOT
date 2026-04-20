import {waterTank, WatterTankScale} from './watterTank.js';
import { SVGChart } from "./svgChartFramework.js"


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
		this.#watterTankScale = new WatterTankScale("tankScale");
		this.#getElemts();
		this.#setEvents();
		this.#setEventsOnControls();
		this.#setEventsOnPopUp();
		this.#themeSetup();
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
		const {tanksetupBtn} = this.#controlElemts;
		
		
		/* pop launch and close Events */ 
		tanksetupBtn.addEventListener('click', ()=>{
			userProfileSettingPopup.classList.add('hide');
			tenkSetupPopUp.classList.remove("hide");
			openModal();
		});

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

		const userProfileSettingPopup = document.getElementById("userProfileSettingPopup");
		document.querySelector(".userProfile").addEventListener("click", ()=>{
			userProfileSettingPopup.classList.remove('hide');
			tenkSetupPopUp.classList.add("hide");
			openModal();
		});

		
		/* Tank Setup */
		/* Water Tank setup*/ 
		const tankSetupForm = document.forms["tankSetup"];
		const tankType = tankSetupForm.querySelector("#tankType");
		const widthFild = tankSetupForm.querySelector("#widthFild");
		const lengthFild = tankSetupForm.querySelector("#lengthFild");
		const dimeaterFild = tankSetupForm.querySelector("#dimeaterFild");
		const heightFild = tankSetupForm.querySelector("#heightFild");

		tankType.addEventListener('change', (event)=>{
			const value = event.target.value;
			if (value === "Cylindrical"){
				widthFild.classList.add('hide');
				lengthFild.classList.add('hide');
				dimeaterFild.classList.remove('hide');
			}else if(value === "Rectangular"){
				widthFild.classList.remove('hide');
				lengthFild.classList.remove('hide');
				dimeaterFild.classList.add('hide');
			}
		});

		tankSetupForm.querySelector('.submitBtn').addEventListener('click', (e)=>{
			// const  e.target.value;
			const value = tankType.value;
			const measuringUnit = tankSetupForm['measuringUnit'].value;

			if (value === "Cylindrical"){
				const height = tankSetupForm['height'].value;
				const dimeater = tankSetupForm['dimeater'].value
				this.#tankObj.setCylindricalTankValue(measuringUnit,  height, dimeater );
				console.log( dimeater );
				console.log( height );
			}else if(value === "Rectangular"){
				const width = tankSetupForm['width'].value;
				const height = tankSetupForm['height'].value;
				const length = tankSetupForm['length'].value;
				console.log( width );
				console.log( length );
				console.log( height );
				this.#tankObj.setRectangularTankValue(measuringUnit, height, length, width);
			}
			this.#updateTankCapacity();
		});

		/* profile setup*/

		const profileSetupForm = document.forms["profileSetup"];
		profileSetupForm.querySelector('.submitBtn').addEventListener('click', (e)=>{
			console.log(profileSetupForm['name'].value);
			console.log(profileSetupForm['usrName'].value);
			console.log(profileSetupForm['pwd'].value);
			console.log(profileSetupForm['rpwd'].value);
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

	

	#themeSetup(){
		const themeBtn = document.getElementById("ThemeBtn");


		(function restoreThemePrefrence(){
			// Check if user previously saved a theme preference
			if (localStorage.getItem('theme') === 'darkTheme') {
				document.body.classList.add('darkTheme');
				themeBtn.textContent = '🌙'; // Dark mode icon
			} else {
				document.body.classList.remove('darkTheme');
				themeBtn.textContent = '🔆'; // Light mode icon
			}
		})();

		themeBtn.addEventListener('click', () => {
			// Toggle 'dark' class on <html>
			document.body.classList.toggle('darkTheme');

			// Update Icon and Save preference
			if (document.body.classList.contains('darkTheme')) {
				themeBtn.textContent = '🌙';
				localStorage.setItem('theme', 'darkTheme');
			} else {
				themeBtn.textContent = '🔆';
				localStorage.setItem('theme', 'lightTheme');
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