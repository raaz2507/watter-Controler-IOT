//import Chart from "./chart.js"

document.addEventListener("DOMContentLoaded", ()=>{
	const myDashbord = new Dashbord();
	myDashbord.setupTank();
	restoreThemePrefrence();
	//createChart();
   
});

// function createChart(){
//	  //create chart
//	 const ctx = document.getElementById('myChart');

//	 new Chart(ctx, {
//		 type: 'line',
//		 data: {
//			 labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
//			 datasets: [{
//				 label: 'Tenk Laval',
//				 data: [10, 20, 30, 40 , 50, 40, 10, 20, 50, 70, 100, 5, 10, 20, 30, 40 , 50, 40, 10, 20, 50, 70, 100, 5]
//			 }]
//		 },
//		 options: {
//			 responsive: true,
//			 maintainAspectRatio: false,
//			 devicePixelRatio: 2,
//		 }
//	 });
// }


class Dashbord{
	#elemts ={};
	#myTank = null;
	constructor(){
		this.#myTank = new WatterTank();
		this.#getElemts();
		this.#setEvents();
	}

	#getElemts(){
		const elemtMap ={
			TankCapacity: {id: "TankCapacity"},
			remainingWater: {id :"remainingWater"},
			Tanksetup: {id: "Tanksetup"},
		};

		for (const [key, value] of  Object.entries(elemtMap)){
			this.#elemts[key] = document.getElementById(value.id);
		}
	}
	#setEvents(){
		const {Tanksetup} =  this.#elemts;

		const tenkSetupPopUp = document.getElementById("tenkSetupPopUp");
		const userProfileSettingPopup = document.getElementById("userProfileSettingPopup");
		console.log(tenkSetupPopUp);
		Tanksetup.addEventListener('click', ()=>{
			userProfileSettingPopup.classList.add('hide');
			tenkSetupPopUp.classList.remove("hide");

			openModal();
		});

		document.querySelector(".userProfile").addEventListener("click", ()=>{
			userProfileSettingPopup.classList.remove('hide');
			tenkSetupPopUp.classList.add("hide");

			openModal();
		});
		const tankSetupForm = document.forms["tankSetup"];
		const tankType = tankSetupForm.querySelector("#tankType");
		
		tankType.addEventListener('change', (event)=>{
			const value = event.target.value;
			if (value === "Cylindrical"){
				tankSetupForm.querySelector("#widthFild").classList.add('hide');
				tankSetupForm.querySelector("#lengthFild").classList.add('hide');
				tankSetupForm.querySelector("#dimeaterFild").classList.remove('hide');
			}else if(value === "Rectangular"){
				tankSetupForm.querySelector("#widthFild").classList.remove('hide');
				tankSetupForm.querySelector("#lengthFild").classList.remove('hide');
				tankSetupForm.querySelector("#dimeaterFild").classList.add('hide');
			}
		});
	}
	setupTank(){
		const {TankCapacity} =  this.#elemts;

		const tankHight= 950; //mm
		const thankdimeter = 880; //mm
		
		this.#myTank.setCylindricalTankValue(tankHight, thankdimeter);
		TankCapacity.querySelector('.value').innerText = this.#myTank.getTankCapacity() +" Liters";
		

		//test events
		document.getElementById("levelSlider").addEventListener("input", (e)=>{
			const percent = e.target.value;
			this.#myTank.updateTank(percent);
			this.#updateRemingWatter(percent);
		});
	}
	#updateRemingWatter(percent){
		const { remainingWater} =  this.#elemts;
		remainingWater.querySelector('.value').innerText = this.#myTank.getTankCapacityByPercentage(percent) +" Liters";
	}
	
}



class WatterTank{
	#typeOfTank = "Cylindrical";
	#radius =null;
	#height = null;
	#length = null;
	#width = null;
	#TotalCapacity= null;

	setCylindricalTankValue(height, dimeter){
		this.#typeOfTank = "Cylindrical";
		this.#radius = dimeter/2;
		this.#height = height;
		this.#TotalCapacity = this.getTankCapacity();
	}
	setRectangularTankValue(height, length, width){
		this.#typeOfTank = "Rectangular";
		this.#height = height;
		this.#length = length;
		this.#width = width;
		this.#TotalCapacity = this.getTankCapacity();
	}
	getTankCapacity(){
		let volume;
		if (this.#typeOfTank === "Rectangular"){
			volume = this.#length * this.#width * this.#height;
		}else if (this.#typeOfTank === "Cylindrical"){
			volume  = Math.PI * this.#radius * this.#radius * this.#height;
		}
		return Number((volume / 1000000).toFixed(0));;
	}
	getTankCapacityByPercentage(Percentage){
		const Liters = (Percentage / 100) * this.#TotalCapacity;
		return Liters.toFixed(0);
	}

	updateTank(percent) {
		const waterGroup = document.getElementById('water-level');
		const percText = document.getElementById('perc-text');
		const stopTop = document.getElementById('grad-top');
		const stopBottom = document.getElementById('grad-bottom');
		const perc_text = document.getElementById('perc-text');
		const TankCap = document.getElementById('TankCap');
		const TankBody = document.getElementById('TankBody');
		
		

		// 1. Level Update (Position)
		const yMove = 260 - (percent * 2.5);
		waterGroup.setAttribute('transform', `translate(0, ${yMove})`);
		percText.textContent = percent + "%";

		// 2. Color Logic
		let colorTop, colorBottom, colorPerc_text, colorTankCap, colorTankBody;

		if (percent <= 20) {
			// Critical: Red
			colorTop = "#ff4d4d"; 
			colorBottom = "#cc0000";
			colorPerc_text = "#cc0000";
			colorTankCap = "#ff4d4d";
			colorTankBody ="#ff4d4d";
		} else if (percent <= 50) {
			// Medium: Orange/Yellow
			colorTop = "#fbc02d";
			colorBottom = "#f57f17";
			colorPerc_text = "#fbc02d";
			colorTankCap = "#fbc02d";
			colorTankBody ="#fbc02d";
		} else {
			// Good: Blue (Aapka original color)
			colorTop = "#4facfe";
			colorBottom = "#00f2fe";
			colorPerc_text = "#00f2fe";
			colorTankCap = "#00f2fe";
			colorTankBody ="#00f2fe";
		}

		// Colors apply karna
		stopTop.setAttribute('stop-color', colorTop);
		stopBottom.setAttribute('stop-color', colorBottom);
		perc_text.setAttribute('fill', colorPerc_text);
		TankCap.setAttribute('stroke', colorTankCap);
		TankBody.setAttribute('stroke', colorTankBody);
	}
}

const themeBtn = document.getElementById("ThemeBtn");


function restoreThemePrefrence(){
	// Check if user previously saved a theme preference
	if (localStorage.getItem('theme') === 'darkTheme') {
		document.body.classList.add('darkTheme');
		themeBtn.textContent = '🌙'; // Dark mode icon
	} else {
		document.body.classList.remove('darkTheme');
		themeBtn.textContent = '🔆'; // Light mode icon
	}
}

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


// =====================================



function openModal() {
	// Overlay ko display block (ya flex) karein
	document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
	// Overlay ko wapas chhupa dein
	document.getElementById('modalOverlay').style.display = 'none';
}

// Agar user modal ke bahar (kali layer par) click kare toh bhi band ho jaye
window.onclick = function(event) {
	let overlay = document.getElementById('modalOverlay');
	if (event.target == overlay) {
		closeModal();
	}
}

function saveData() {
	let newValue = document.getElementById('newCapacity').value;
	console.log("Saving value:", newValue);
	// Yahan aap apna data update karne ka logic likh sakte hain
	closeModal();
}