import { headerNfooter } from "./headerNfooter.js";
import { SVGChart } from "./svgChartFramework.js";
import { navBar } from "./navBar.js";

import { charts } from "./getChartData.js";

document.addEventListener("DOMContentLoaded", async () => {
	new headerNfooter();
	new navBar();

	const dayChartCanvas = document.querySelector("#charts");
	const chartObj =  new charts(dayChartCanvas);
	await chartObj.init();
	chartObj.createTodayChart();



	const buttonContoner =  document.querySelector(".buttonContoner");

	const chartmap={
		today = ()=>{chartObj.createTodayChart()};
	}
	buttonContoner.addEventListener("click", e=>{
		if(e.target.type === "button"){
			chartmap[e.target.dataset.chart];
			console.log();
		}
	});
});
// 	function monthly(data) {
// 		this.draw(data, "month");
// 	}

// 	function currentHour(data) {
// 		this.draw(data, "hour");
// 	}

// let chartInstance = null; // 🧠 global reference

// async function todayChart() {
// 	let apiData = null;

// 	try {
// 		apiData = await getTodayChartData();
// 	} catch (e) {
// 		console.log("Fetch error");
// 	}

// 	// 🔒 strict safe data
// 	let safeData = Array.isArray(apiData?.tank1) ? apiData.tank1 : [];

// 	console.log("FINAL DATA:", safeData);

// 	const container = document.querySelector("#dailyChart");

// 	// 🧹 old chart remove
// 	if (chartInstance && chartInstance.destroy) {
// 	chartInstance.destroy();
// 	chartInstance = null;
// }
// 	container.innerHTML = "";

// 	// 🚫 अगर data नहीं है → chart मत बनाओ
// 	if (safeData.length === 0) {
// 		container.innerHTML = `
// 			<div style="text-align:center; padding:20px; color:#888;">
// 				No Data Available
// 			</div>
// 		`;
// 		return;
// 	}

// 	chartInstance = new SVGChart("#dailyChart", {
// 		chart:{
// 			type: 'line',
// 			title : "Last 24hr Chart",
// 		},
// 		xAxis: {
// 			title: "Time",
// 		},
// 		yAxis:{
// 			title: "Water Lavel (in %)",
// 		},

// 		// ['12am', '01am', '02am', '03am', '04am', '05am', '06am', '07am', '08am', '09am', '10am', '11am', '12pm', '01pm', '02pm', '03pm', '04pm', '05pm', '06pm', '07pm', '08pm', '09pm', '10pm', '11pm']

// 		data: {
// 			labels: Lablesfor24Hours(),
// 			datasets: [

// 				{
// 					label: "Tank 1",
// 					data: safeData,
// 					color: "pink"
// 				}
// 			],
// 		},
// 		animationType: "scale", // scale | fade | slide

// 		options: {
// 				animation :{
// 					chartTitleAinmation: '',
// 					xTitleAnimation: '', xLineAnimation: '', xLineLabel: '',
// 					yTitleAnimation: '', yLineAnimation: '', yLineLabel: '',
// 					dataLineAnimation: { type: "draw", duration: 2000 },
// 					dataLinePointAnimation: {
// 												type: "pop",
// 												delay: "sync-line", // 🔥 line के साथ चलेगा
// 												duration: 500
// 											},
// 					toolTipsAnimation: ''}
// 		},
// 	});
// }

// async function todayChart_new() {

// 		// ✅ नया chart बनाओ
// 		chartInstance = new SVGChart("#dailyChart", {
// 			chart: {
// 				type: 'line',
// 				title: "Last 24hr Chart",
// 			},
// 			xAxis: { title: "Time" },
// 			yAxis: { title: "Water Level (in %)" },

// 			data: {
// 				labels: Lablesfor24Hours(),
// 				datasets: [
// 					{
// 						label: "Tank 1",
// 						data: result.tank1 || new Array(24).fill(0),
// 						color: "#0BB5FF"
// 					},
// 					{
// 						label: "Tank 2",
// 						data: result.tank2 || new Array(24).fill(0),
// 						color: "#FF6B6B"
// 					}
// 				],
// 			},

// 			animationType: "scale",
// 			options: {
// 				animation: {
// 					dataLineAnimation: { type: "draw", duration: 2000 },
// 					dataLinePointAnimation: {
// 						type: "pop",
// 						delay: "sync-line",
// 						duration: 500
// 					}
// 				}
// 			}
// 		});

// }
// import {Chart} from "../js/chart.umd.js";