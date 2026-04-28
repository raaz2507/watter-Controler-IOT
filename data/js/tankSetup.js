class unnamed{

	method(){
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
	
	}
}