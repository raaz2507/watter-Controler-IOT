function loadSocketIO(){

	return new Promise((resolve, reject)=>{

		const script =
			document.createElement("script");

		script.src =
			"/socket.io/socket.io.js";

		script.onload = ()=>{

			resolve();

		};

		script.onerror = ()=>{

			reject("Socket.IO load failed");

		};

		document.head.appendChild(script);

	});

}
async function initSocket(){

	await loadSocketIO();

	const socket = window.io();

	socket.on("connect", ()=>{

		console.log("Socket Connected");

	});

	return socket;
}
export class charts{
	#chartInstance = null;
	#canvas =null;
	#liveInterval = null;

	#socket = null;

	constructor(canvas){
		this.canvas = canvas;
	}

	// async init(){
	// 	this.#socket = await initSocket();
	// }

	#removeLiveListener(){
		if(!this.#socket) return;
		this.#socket.off("liveChart");
	}

	async #connectSocket(){
		if(this.#socket) return;
		this.#socket = await initSocket();
		console.log("Socket Initialized");
	}

	#destroySocket(){
		if(!this.#socket) return;
		this.#socket.off("liveChart");
		this.#socket.disconnect();
		this.#socket = null;
		console.log("Socket Destroyed");
	}

	set canvas(canvas){
		if(!canvas){
			console.error("Canvas element not found");
			return;
		}

		this.#canvas = canvas;
	}

	set refreshInterval(intervalTime){
		this.#liveInterval = intervalTime;
	}

	#labelsfor24Hours(){
		const lables= [];
		const now = new Date();
		for (let i = 0; i < 24; i++) {
			// 🕒 Current time based shift
			
			let hour = (now.getHours() - (24 - i) + 24) % 24;
			let label = "";

			if (hour === 0) label = "12 am";
			else if (hour < 12) label = hour.toString().padStart(2, '0') + " am";
			else if (hour === 12) label = "12 pm";
			else label = (hour - 12).toString().padStart(2, '0') + " pm";
			
			lables.push(label);
		}
		
		return lables;
	}
	#labelsfor1hour(){
		return Array.from({length: 60}, (_, i)=>i);
	}

	#labelsForWeek(){
		const labels = [];
		const now = new Date();
		
		for (let i = 6; i >= 0; i--) {
			const date = new Date(now);

			// pichhle days minus karo
			date.setDate(now.getDate() - i);

			// Day name
			const dayName = date.toLocaleDateString("en-US", {
				weekday: "short"
			});

			labels.push(dayName);
		}

		return labels;
	}
	#labelsForMonthDay(day=30, subLabel="Day", recent =false){
		if(!recent){
			return Array.from({ length: day }, (_, i) => `${subLabel} ${i + 1}`);
		}

		// Recent labels
		const labels = [];
		const now = new Date();

		for(let i = day - 1; i >= 0; i--){

			const date = new Date();

			date.setDate(now.getDate() - i);

			labels.push(
				`${date.getDate()} ${date.toLocaleString("default", {
					month : "short"
				})}`
			);
		}

		return labels;
	}
	#labelsForYear(recent =false){
		if(!recent){
			return  [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}

		// Recent 12 months
		const labels = [];
		const now = new Date();

		for(let i = 11; i >= 0; i--){

			const date = new Date(
				now.getFullYear(),
				now.getMonth() - i
			);

			labels.push(
				date.toLocaleString("default", {
					month : "short"
				})
			);
		}

		return labels;
	}
	async #fetchData(route){
		try {
			const res = await fetch(route, {
				credentials: "include" // for send cookie
			});

			// ❌ अगर response OK नहीं
			if (!res.ok) {
				console.log("API ERROR:", res.status);
				return;
			}

			const result = await res.json();

			console.log("DATA:", result);
			return result;
		} catch (err) {
			console.log("FETCH ERROR:", err);
		}
	}
	async #getTodayChartData() {
		console.log("todayChart called");
		return await this.#fetchData("/todayChart");
	}
	async #getWeekChartData(){
		return await this.#fetchData("/weekChart");
	}
	async #getYearChartData(){
		return await this.#fetchData("/yearChart");
	}
	async  #getLiveChartData(){
		// console.log("liveChart called");

		// try{
		// 	const res = await fetch("/liveChart", {
		// 		credentials: "include"
		// 	});
		// 	if (!res.ok){
		// 		console.log("API ERROR:", res.status);
		// 		return;
		// 	}
		// 	const data = await res.json();
		// 	return data;
		// }catch(err){
		// 	console.log("FETCH ERROR:", err);
		// }
	}
	
	#createChart(ChartLabels, data, chartTitle="Tank Level"){
		const ctx = this.#canvas.getContext("2d");

		const gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, "rgba(0, 123, 255, 0.81)");
		gradient.addColorStop(1, "rgba(0, 123, 255, 0)");
		
		return new Chart(ctx, {
			type: "line",

			data: {
				labels: ChartLabels, // X-axis
				datasets: [
					{
						label: chartTitle,
						data:  data.tank1, // Y-axis

						// borderColor: "#00BFFF",
						borderColor: gradient,
						backgroundColor: gradient,
						borderWidth: 2,

						tension: 0.4, // 🔥 smooth line
						fill: true,

						pointRadius: 3,
					},
				],
			},

			options: {
				responsive: true,
				maintainAspectRatio: false,

				plugins: {
					legend: {
						display: true,
					},
				},

				scales: {
					x: {
						title: {
							display: true,
							text: "Time (sec)",
						},
					},
					y: {
						min: 0,      // ✅ minimum
						max: 120,    // ✅ maximum
						
						title: {
							display: true,
							text: "Level",
						},
					},
				},
			},
		});
	}
	async createWeekChart(){
		this.#destroySocket();
		clearInterval(this.#liveInterval);
		this.#removeLiveListener();

		this.#getWeekChartData().then(data => {
			if (!data) return;

			const labels = this.#labelsForWeek();
			if (this.#chartInstance){
				this.#chartInstance.destroy(); // 🔥 OLD CHART DESTROY
			}
			this.#chartInstance = this.#createChart( labels, data, "Today's Chart");
		});
	}
	async createYearChart(){
		this.#destroySocket();
		clearInterval(this.#liveInterval);
		this.#removeLiveListener();

		this.#getYearChartData().then(data => {
			if (!data) return;

			const labels = this.#labelsForYear();
			if (this.#chartInstance){
				this.#chartInstance.destroy(); // 🔥 OLD CHART DESTROY
			}
			this.#chartInstance = this.#createChart( labels, data, "Today's Chart");
		});
	}
	async createTodayChart(){
		this.#destroySocket();
		clearInterval(this.#liveInterval);
		this.#removeLiveListener();

		this.#getTodayChartData().then(data => {
			if (!data) return;

			const labels = this.#labelsfor24Hours();
			if (this.#chartInstance){
				this.#chartInstance.destroy(); // 🔥 OLD CHART DESTROY
			}
			this.#chartInstance = this.#createChart( labels, data, "Today's Chart");
		});
	}

	async createLiveChart(){

		clearInterval(this.#liveInterval);

		// socket create only now
		await this.#connectSocket();

		this.#removeLiveListener();

		const labels = this.#labelsfor1hour();

		// old chart destroy
		if(this.#chartInstance){
			this.#chartInstance.destroy();
		}

		this.#chartInstance = this.#createChart(
			labels,
			{ tank1: Array(60).fill(0) },
			"Live Chart"
		);

		this.#socket.on("liveChart", (data)=>{

			if(!data || !this.#chartInstance) return;

			this.#chartInstance
				.data
				.datasets[0]
				.data = data.tank1;

			this.#chartInstance.update();

		});
	}
}
