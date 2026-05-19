import { waterTank, WatterTankScale } from "./watterTank.js";
// import { SVGChart } from "./svgChartFramework.js";

import { headerNfooter } from "./headerNfooter.js";
import { navBar } from "./navBar.js";

import { toggleSwitch } from "./toggleSwitch.js";

import {charts} from "./getChartData.js";


document.addEventListener("DOMContentLoaded", async () => {
	const myDashbord = new Dashbord();
	await myDashbord.init();
});

class Dashbord {
	#controlElemts = {};
	#elemts = {};
	#popupElemts = {};
	#tankObj = null;
	#watterTankScale = null;
	#motorSwitchBtn = null;
	constructor() {
		this.#tankObj = new waterTank();
		new headerNfooter();
		new navBar();
		this.#watterTankScale = new WatterTankScale("tank-meter");
		
		this.#getElemts();
		this.#setEvents();
		this.#statusCards();
		this.#deviceStatus();
		this.#tankLavelSeletor();
		// this.#setEventsOnControls();
		// this.#setEventsOnPopUp();
		// this.#themeSetup();

		//setup constols
		this.#motorSwitchBtn = new toggleSwitch("#MotorSwitchBtn");
	}

	async init(){

		await this.#motorSwitch();

		this.#autoMationSwitch();

		await this.#chartMode();

		this.#tester();

	}
	#statusCards(){
		const liveAlertElements = {
			tankCapacity:document.querySelector("#tankCapacity .value"),
			flowPercent:document.querySelector("#flowPercent .value"),
			flowRate:document.querySelector("#flowRate .value"),
			waterRemaining:document.querySelector("#waterRemaining .value"),
			approxFillTime:document.querySelector("#approxFillTime .value"),
			lastFillTime:document.querySelector("#lastFillTime .value")
		};
		for (const [key, value] of  Object.entries(liveAlertElements)){
			console.log(key, value, liveAlertElements[key].textContent);
		}
	}

	#deviceStatus(){
		const systemCardValues = {
			battery:document.querySelector("#batteryArea .value"),
			wifi:document.querySelector("#wifiStrength .value"),
			deviceStatus:document.querySelector("#deviceStatus .value")
		};
		loadData(); //initial load data

		// realtime refresh
		setInterval(() => {
			loadData();
		}, 2000);

		async function loadData() {
			try {
				const res = await fetch("/system-status");

				const json = await res.json();

				if (!json.success) {
					return;
				}

				const data = json.data;

				systemCardValues.battery.textContent = `${data.battery}%`;
				systemCardValues.wifi.textContent = `${data.wifi}%`;
				systemCardValues.deviceStatus.textContent = data.deviceStatus ? "Online": "Offline";
				
				// console.log(data.deviceStatus);
				// optional UI styles

				if (data.deviceStatus) {
					systemCardValues.deviceStatus.style.color = "lime";
				} else {
					systemCardValues.deviceStatus.style.color = "red";
				}
			} catch (err) {
				console.log(err);
			}
		}

	}
	#getElemts() {
		const controlsElemtMap = {
			// batteryArea: { id: "batteryArea" },
			// wifiStrength: { id: "wifiStrength" },
			// deviceStatus: { id: "deviceStatus" },
			// motorStatus: { id: "motorStatus" },
			// tankCapacity: { id: "tankCapacity" },
			remainingWater: { id: "remainingWater" }, //
			flowRate: { id: "flowRate" }, //
			// tanksetupBtn: { id: "tanksetup" },
		};

		for (const [key, value] of Object.entries(controlsElemtMap)) {
			this.#controlElemts[key] = document.getElementById(value.id);
		}
		// const popupElemtMap ={
		// 	modalOverlay : {id : 'modalOverlay'},
		// };
		// for (const [key, value] of  Object.entries(popupElemtMap)){
		// 	this.#popupElemts[key] = document.getElementById(value.id);
		// }
	}

	#setEvents() {}

	#updateTankCapacity() {
		const { tankCapacity } = this.#controlElemts;
		tankCapacity.querySelector(".value").innerText =
			this.#tankObj.getTankState().capacity + " Liters";
	}
	#updateRemingWater() {
		const { remainingWater } = this.#controlElemts;
		remainingWater.querySelector(".value").innerText =
			this.#tankObj.getTankState().remaining.liters +
			" Liters" +
			this.#tankObj.getTankState().remaining.percentage +
			"percentage";
	}
	// #setEventsOnPopUp() {
	// 	// const {modalOverlay, } =this.#popupElemts;
	// 	const modalOverlay = document.getElementById("modalOverlay");
	// 	// const {tanksetupBtn} = this.#controlElemts;

	// 	// /* pop launch and close Events */
	// 	// tanksetupBtn.addEventListener('click', ()=>{
	// 	// 	userProfileSettingPopup.classList.add('hide');
	// 	// 	tenkSetupPopUp.classList.remove("hide");
	// 	// 	openModal();
	// 	// });

	// 	function openModal() {
	// 		// Overlay ko display block (ya flex) karein
	// 		modalOverlay.style.display = "flex";
	// 	}

	// 	const closePopUp = document.getElementById("closePopUp");
	// 	closePopUp.addEventListener("click", closeModal);
	// 	function closeModal() {
	// 		// Overlay ko wapas chhupa dein
	// 		modalOverlay.style.display = "none";
	// 	}

	// 	// Agar user modal ke bahar (kali layer par) click kare toh bhi band ho jaye

	// 	modalOverlay.addEventListener("click", (e) => {
	// 		if (e.target.id === "modalOverlay") {
	// 			closeModal();
	// 		}
	// 	});
	// }

	
	async #autoMationSwitch(){
		const automaionSwitchBtn = new toggleSwitch("#AutomaionSwitchBtn");
		await fetch("/autoMationSwitch")
		.then (res =>{return res.json()})
		.then( data =>{ automaionSwitchBtn.value =  data.state});

		automaionSwitchBtn.onChange( async (e)=>{
			console.log(e.value);
			await fetch(`/autoMationSwitch?state=${e.value}`);
		});
	}

	async #motorSwitch() {
		
		await fetch("/motorSwitch")
		.then( res=> {return res.json()})
		.then(data=> this.#motorSwitchBtn.value =  data.state); 
		
		this.#motorSwitchBtn.onChange(async (e) => {
			console.log(e.value);
			await fetch(`/motorSwitch?state=${e.value}`);
		});

	}
	
	async #chartMode(){
		const canvas = document.getElementById("myChart");
		const toggleChart = document.getElementById("chartToggle");
		const modeText = document.querySelector(".modeText");

		const chartObj = new charts(canvas);

		console.log(this.#motorSwitchBtn.value);
		toggleChart.checked = this.#motorSwitchBtn.value;
		const updateChartMode = async ()=>{

			if(toggleChart.checked ){
				modeText.textContent = "Live Chart";

				await chartObj.createLiveChart();

			}
			else{

				modeText.textContent = "Daily Chart";

				await chartObj.createTodayChart();

			}

		};

		// initial load
		await updateChartMode();

		// chart toggle change
		toggleChart.addEventListener("change", updateChartMode);

		// motor switch change
		// this.#motorSwitchBtn.onChange(updateChartMode);

	}
	
	#tankLavelSeletor(){
		var skipSlider = document.getElementById('level-controller');
		noUiSlider.create(skipSlider, {
			range: {
				'min':0,
		//  '10%':10, '20%':20, '30%':30, '50%':50, '60%':60, '70%':70, '90%':90,
				'max':100
			},

			// snap:true,
			step: 5,
			start:[20,90],
			tooltips:true,

			orientation: 'vertical',
			direction: 'rtl', //'ltr',

			//connect:true,   // बीच में color fill
			connect: [true,true,true],
			pips:{
				// mode:'steps',
				mode: "values",
				values:[0,10,20,30,40,50,60,70,80,90,100],
				density:5,
			}

			});


	}
	#tester() {
		document.getElementById("levelSlider").addEventListener("input", (e) => {
			const { remainingWater, flowRate } = this.#controlElemts;
			const percent = e.target.value;
			this.#watterTankScale.updateTank(percent);
			remainingWater.querySelector(".value").textContent =
				this.#tankObj.water_Percentage2Liters(percent) + " Liters";

			const stats = this.#tankObj.calculateRemainingWater(Number(percent));
			flowRate.querySelector(".value").innerHTML =
				`<span style=" font-size:8px;">Flow %: ${stats.flowPercentPerMin.toFixed(2)} %/min</br>,
			Flow Liter: ${stats.flowLiterPerMin.toFixed(2)} L/min</br>,
			Remaining: ${stats.remainingWater.toFixed(2)} L</br>,
			Time to Fill: ${stats.timeToFill.toFixed(2)} min </span>`;
		});
	}
}