function Lablesfor24Hours(){
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

async function getTodayChartData() {
	console.log("todayChart called");
	try {
		const res = await fetch("/chart", {
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

let TodayChartInstance = null;

export async function createTodayChart(canvas){
	getTodayChartData().then(data => {
		const labels = Lablesfor24Hours();
		if (TodayChartInstance){
			TodayChartInstance.destroy(); // 🔥 OLD CHART DESTROY
		}
		TodayChartInstance = createChart(canvas, labels, data);
	});
}

let liveInterval = null;
export function createLiveChart(canvas){
	clearInterval(liveInterval);

	// 🔥 chart create once
	if (!TodayChartInstance) {
		getTodayChartData().then(data => {
			const labels = Lablesfor24Hours();
			TodayChartInstance = createChart(canvas, labels, data);
		});
	}

	// 🔥 only update data
	liveInterval = setInterval(async () => {

		const data = await getTodayChartData();
		const labels = Lablesfor24Hours();

		if (TodayChartInstance) {
			TodayChartInstance.data.labels = labels;
			TodayChartInstance.data.datasets[0].data = data.tank1;
			TodayChartInstance.update(); // 🔥 important
		}

	}, 2000);
	
}


function createChart(canvas, ChartLabels, data){
	const ctx = canvas.getContext("2d");

	const gradient = ctx.createLinearGradient(0, 0, 0, 400);
	gradient.addColorStop(0, "rgba(0, 123, 255, 0.81)");
	gradient.addColorStop(1, "rgba(0, 123, 255, 0)");
	
	return new Chart(ctx, {
		type: "line",

		data: {
			labels: ChartLabels, // X-axis
			datasets: [
				{
					label: "Tank Level",
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