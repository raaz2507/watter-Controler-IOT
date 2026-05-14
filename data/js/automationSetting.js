import { toggleSwitch } from "./toggleSwitch.js";

document.addEventListener(
	"DOMContentLoaded",

	() => {
		new AutomationSetting();
	},
);

class AutomationSetting {
	#Elemts = {};

	#switchInstance;

	constructor() {
		this.#getElemts();

		this.#createWeekButtons();

		this.#switchInstance = new toggleSwitch("#lowFlowRateAutoCutOffSwitch");

		this.#setEvents();

		this.loadAutomationData();
	}

	#getElemts() {
		this.#Elemts.form = document.forms["AutomationSettingForm"];

		this.#Elemts.minRange = this.#Elemts.form["minRange"];

		this.#Elemts.maxRange = this.#Elemts.form["maxRange"];

		this.#Elemts.rangeOutput = this.#Elemts.form["rangeOutput"];

		this.#Elemts.weekdaySelector = document.querySelector(".weekday-selector");
	}

	#setEvents() {
		const { form, minRange, maxRange } = this.#Elemts;

		this.updateRange();

		minRange.addEventListener("input", (e) => this.updateRange(e));

		maxRange.addEventListener("input", (e) => this.updateRange(e));

		this.#Elemts.weekdaySelector.addEventListener(
			"click",

			(e) => {
				if (e.target.type === "button") {
					e.target.classList.toggle("selected");
				}
			},
		);

		form.addEventListener(
			"submit",

			(e) => this.submitForm(e),
		);
	}

	updateRange(e) {
		const { minRange, maxRange, rangeOutput } = this.#Elemts;

		if (e?.target === minRange && +minRange.value > +maxRange.value) {
			minRange.value = maxRange.value;
		}

		if (e?.target === maxRange && +maxRange.value < +minRange.value) {
			maxRange.value = minRange.value;
		}

		rangeOutput.textContent = `${minRange.value}
		 -
		 ${maxRange.value}`;
	}

	#createWeekButtons() {
		const selector = document.querySelector(".weekday-selector");

		const fragment = document.createDocumentFragment();

		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		days.forEach((day, index) => {

			// hidden checkbox
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.name = "days";
			checkbox.value = day;
			checkbox.id = `day-${index}`;
			checkbox.classList.add("day-checkbox");

			// button style label
			const label = document.createElement("label");
			label.setAttribute("for", `day-${index}`);
			label.classList.add("day-button");

			label.textContent = day;

			fragment.append(checkbox, label);
		});

		selector.append(fragment);
	}

	getSelectedDays() {
		return [...document.querySelectorAll(".weekday-selector .selected")].map(
			(btn) => btn.value,
		);
	}

	async loadAutomationData() {
		try {
			const res = await fetch("/automation-data");

			const json = await res.json();

			console.log(json);

			if (!json.success || !json.data) {
				return;
			}

			const data = json.data;

			this.#Elemts.minRange.value = data.minRange;

			this.#Elemts.maxRange.value = data.maxRange;

			this.updateRange();

			this.#Elemts.form["startTime"].value = data.startTime || "";

			this.#Elemts.form["startDateTime"].value = data.startDateTime || "";

			// weekdays
			const days = JSON.parse(data.weekdays || "[]");
			// const selectedDays = [...document.querySelectorAll(".weekday-selector:checked")].map(cb => cb.value);
			document.querySelectorAll(".weekday-selector button").forEach((btn) => {
					if (days.includes(btn.value)) {
						btn.classList.add("selected");
					}
				});

			// switch
			if (data.lowWaterCutoff) {
				this.#switchInstance.enable?.();
			}
		} catch (err) {
			console.log(err);
		}
	}

	async submitForm(e) {
		e.preventDefault();

		const form = this.#Elemts.form;

		const data = {
			minRange: form["minRange"].value,

			maxRange: form["maxRange"].value,

			startTime: form["startTime"].value,

			startDateTime: form["startDateTime"].value,

			weekdays: JSON.stringify(this.getSelectedDays()),

			lowWaterCutoff: document.querySelector("#lowFlowRateAutoCutOffSwitch").classList.contains("active") ? 1 : 0,
		};

		console.log(data);

		try {
			const res = await fetch( "/update-automation", {
					method: "POST",

					headers: {
						"Content-Type": "application/json",
					},

					body: JSON.stringify(data),
				},
			);

			const json = await res.json();

			console.log(json);

			alert(json.message);
		} catch (err) {
			console.log(err);

			alert("Server Error");
		}
	}
}
