import { toggleSwitch } from "./toggleSwitch.js";

document.addEventListener("DOMContentLoaded", ()=>{
    new AutomationSetting();
    new toggleSwitch("#lowFlowRateAutoCutOffSwitch");
});

class AutomationSetting{
    #Elemts={};
    constructor(){
        this.#getElemts();
        this.#setEvents();
    }
    #getElemts(){
        this.#Elemts.automationSettingForm =  document.forms["AutomationSettingForm"];
        this.#Elemts.minRange = this.#Elemts.automationSettingForm["minRange"];
        this.#Elemts.maxRange = this.#Elemts.automationSettingForm["maxRange"];
        this.#Elemts.rangeOutput = this.#Elemts.automationSettingForm["rangeOutput"];
    }
    #setEvents(){
        const {automationSettingForm, minRange, maxRange, rangeOutput} = this.#Elemts;
        
        updateRange(); //inital setup

        minRange.addEventListener("input", updateRange);
        maxRange.addEventListener("input", updateRange);

        function updateRange(e){

        if(e?.target === minRange &&
            +minRange.value > +maxRange.value){

            minRange.value = maxRange.value;
        }

        if(e?.target === maxRange &&
            +maxRange.value < +minRange.value){

            maxRange.value = minRange.value;
        }

 rangeOutput.textContent =
   `${minRange.value} - ${maxRange.value}`;
}

    }
}

const weekdaySelector = document.querySelector(".weekday-selector");

(function buttonCreate(){
    const btnFregment =  document.createDocumentFragment();
    const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "sat"];
    dayList.forEach( item=>{
        const btn = document.createElement("button");
        btn.type = "button";
        btn.value = item;
        btn.innerText = item;
        btnFregment.append(btn);
    });
    weekdaySelector.append(btnFregment);
})();
weekdaySelector.addEventListener('click', (e)=>{
    const isBtn = e.target.type=== "button";
    if (isBtn){
        e.target.classList.toggle("selected");
        console.log(e.target.value);
    }
    
});



