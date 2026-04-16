export class waterTank{
	#tankDimensions = {type: "Cylindrical",radius : undefined, height : undefined, length : undefined, width : undefined};
	#tankState = { capacity: 0, remaining: { liters: 0, percentage: 0 } };

	constructor(){}
	
	getTankState(){
		console.log(this.#tankState.capacity);
		return this.#tankState;
		
	}
	//setters Method
	setCylindricalTankValue(measuringUnit, height, dimeter){
		this.#tankDimensions.type = "Cylindrical";
		this.#tankDimensions.radius = this.#convertToCm(Number(dimeter)/2, measuringUnit) ;
		this.#tankDimensions.height =  this.#convertToCm( Number(height), measuringUnit);
		this.#tankState.capacity = this.#calculateTankCapacity();
	}
	setRectangularTankValue(measuringUnit, height, length, width){
		this.#tankDimensions.type = "Rectangular";
		this.#tankDimensions.height = this.#convertToCm( Number(height), measuringUnit);
		this.#tankDimensions.length = this.#convertToCm( Number(length), measuringUnit);
		this.#tankDimensions.width = this.#convertToCm( Number(width), measuringUnit);
		this.#tankState.capacity = this.#calculateTankCapacity();
	}
	
	//geters Method
	#convertToCm(value, unit){
		switch(unit){
			case "m": return value * 100;
			case "ft": return value * 30.48;
			case "in": return value * 2.54;
			case "cm": return value;
		}
	}
	#calculateTankCapacity(){
		let volume;
		if (this.#tankDimensions.type === "Rectangular"){
			volume = this.#tankDimensions.length * this.#tankDimensions.width * this.#tankDimensions.height;
		}else if (this.#tankDimensions.type === "Cylindrical"){
			volume  = Math.PI * this.#tankDimensions.radius * this.#tankDimensions.radius * this.#tankDimensions.height;
		}
		
		return Math.floor(volume / 1000000);
	}
	#getTankRemainingWaterInPercentage(Percentage){
		const Liters = (Percentage / 100) * this.#tankState.capacity;
		return Liters.toFixed(0);
	}
	
	
	#calculateRemainingWater(){
			const tankCapacity = 2000; // liter
			const currentLevel = 45;   // %
	
			const stats = calculateWaterStats(currentLevel, tankCapacity);
	
			console.log("Flow %:", stats.flowPercentPerMin.toFixed(2), "%/min");
			console.log("Flow Liter:", stats.flowLiterPerMin.toFixed(2), "L/min");
			console.log("Remaining:", stats.remainingWater.toFixed(2), "L");
			console.log("Time to Fill:", stats.timeToFill.toFixed(2), "min");
			let prevLevel = 0;
			let prevTime = Date.now();
	
			function calculateWaterStats(currentLevel, tankCapacity) {
				const currentTime = Date.now();
	
				// ⏱ time difference (minutes)
				const timeDiff = (currentTime - prevTime) / 60000;
	
				// 📊 level difference (%)
				const levelDiff = currentLevel - prevLevel;
	
				// 💧 Flow Rate (% per min)
				const flowPercentPerMin = levelDiff / timeDiff;
	
				// 💧 Flow Rate (Liter per min)
				const flowLiterPerMin = (flowPercentPerMin / 100) * tankCapacity;
	
				// 💧 Remaining Water (Liter)
				const remainingWater = (currentLevel / 100) * tankCapacity;
	
				// ⏳ Time to fill (minutes)
				let timeToFill = Infinity;
	
				if (flowPercentPerMin > 0) {
					timeToFill = (100 - currentLevel) / flowPercentPerMin;
				}
	
				// update previous
				prevLevel = currentLevel;
				prevTime = currentTime;
	
				return {
					flowPercentPerMin,
					flowLiterPerMin,
					remainingWater,
					timeToFill
				};
			}
		}
}

export class WatterTankScale{
	constructor(id){
		
		this.#add2HTML(id);
		this.#getElemts();
		this.#setEvents();
	}

	
	#getElemts(){
		
	}
	#setEvents(){

	}
	#add2HTML(id){
		const container = document.getElementById(id);
		container.innerHTML = this.#strucher();
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
	#strucher(){
		return `<svg width="200" height="300" viewBox="0 0 200 300" id="battery-svg" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<style>
						#water-level {
							transform-origin: bottom;
							transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
						}

						.stop-color-transition {
							transition: stop-color 0.8s ease;
						}
					</style>

					<linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
						<stop id="grad-top" class="stop-color-transition" offset="0%" stop-color="#4facfe"/>
						<stop id="grad-bottom" class="stop-color-transition" offset="100%" stop-color="#00f2fe"/>
					</linearGradient>

					<clipPath id="clipBody">
						<rect x="5" y="20" width="190" height="275" rx="20"/>
					</clipPath>

					<!-- <filter id="shadow">
						<feDropShadow dx="4" dy="4" rx="20" stdDeviation="4" flood-color="black" flood-opacity="0.5"/>
					</filter> -->
				</defs>

				<g clip-path="url(#clipBody)">
					<g id="water-level" transform="translate(0, 260)"> 
					<g opacity="0.5">
						<path fill="url(#waterGrad)" d="M0,20 Q50,5 100,20 T200,20 T300,20 T400,20 V600 H0 Z" />
						<animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="3s" repeatCount="indefinite" />
					</g>
					<g>
						<path fill="url(#waterGrad)" d="M0,15 Q50,-5 100,15 T200,15 T300,15 T400,15 V600 H0 Z" />
						<animateTransform attributeName="transform" type="translate" from="-200 0" to="0 0" dur="2s" repeatCount="indefinite" />
					</g>
					</g>
				</g>

				<!-- Tank Cap -->
				<path id="TankCap" d="M65,0 h70 a10,10 0 0 1 10,10 v10 h-90 v-10 a10,10 0 0 1 10,-10 z" fill="rgba(255, 255, 255, 0.2)" stroke="white" stroke-width="1"/>
				<!-- Tank Body -->
				<rect id="TankBody" x="5" y="20" width="190" height="275" rx="20" fill="rgba(255, 255, 255, 0.2)" stroke="white" stroke-opacity="0.3" stroke-width="2" filter="url(#shadow)"/>

				<g transform="translate(100, 200)">
					<path id="watterDrop" d="M0,0 C0,-20 -25,-40 -25,-60 A25,25 0 1,1 25,-60 C25,-40 0,-20 0,0 Z"
						fill="rgba(255, 255, 255, 0.15)" stroke="white" stroke-width="1.5"
						transform="scale(1.3, -1.3) translate(0, 80)" />
					<text id="perc-text" x="0" y="-20" text-anchor="middle" dominant-baseline="middle" 
						font-family="Comic Sans MS, cursive" font-weight="bold" font-size="28" fill="white">
					0%
					</text>
				</g>
			</svg>`;
	}
}
