import { headerNfooter } from "./headerNfooter.js";
import {SVGChart} from "./svgChartFramework.js";
import { navBar } from "./navBar.js";

document.addEventListener("DOMContentLoaded", ()=>{
	new headerNfooter();
	new navBar();
	
	todayChart();
	weekly();
});

function weekly() {
}


// 	function monthly(data) {
// 		this.draw(data, "month");
// 	}

// 	function currentHour(data) {
// 		this.draw(data, "hour");
// 	}

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
function todayChart() {
	new SVGChart("#dailyChart", {
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

		// ['12am', '01am', '02am', '03am', '04am', '05am', '06am', '07am', '08am', '09am', '10am', '11am', '12pm', '01pm', '02pm', '03pm', '04pm', '05pm', '06pm', '07pm', '08pm', '09pm', '10pm', '11pm']
	
		data: {
			labels: Lablesfor24Hours(),
			datasets: [
				{	
					label: "Tank 1", 
					data: [10, 20, 30, 40 , 50, 40, 0, 20, 50, 70, 100, 5, 10, 20, 30, 40 , 50, 40, 10, 20, 50, 70, 100, 5],
					color: "#0BB5FF"
				},
				{
					label: "Tank 2",
					data: [10, 20, 60, 10, 5, 0, 55, 75, 85, 95, 65, 54, 6, 40, 50, 20, 5, 7, 70, 80, 85, 65, 45, 35],
				
				}
			],
		},
		animationType: "scale", // scale | fade | slide
		
		
		options: {
				animation :{
					chartTitleAinmation: '', 
					xTitleAnimation: '', xLineAnimation: '', xLineLabel: '', 
					yTitleAnimation: '', yLineAnimation: '', yLineLabel: '', 
					dataLineAnimation: { type: "draw", duration: 2000 }, 
					dataLinePointAnimation: {
												type: "pop",
												delay: "sync-line", // 🔥 line के साथ चलेगा
												duration: 500
											}, 
					toolTipsAnimation: ''}
		},
	});
}