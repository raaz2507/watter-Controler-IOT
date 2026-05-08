class TankSetup {

	constructor(){

		this.form =
		document.forms["tankSetup"];

		this.tankType =
		this.form.querySelector("#tankType");

		this.widthFild =
		this.form.querySelector("#widthFild");

		this.lengthFild =
		this.form.querySelector("#lengthFild");

		this.dimeaterFild =
		this.form.querySelector("#dimeaterFild");

		this.init();
	}


	init(){

		this.toggleTankFields();

		this.loadTankData();

		this.tankType.addEventListener(
			"change",
			()=> this.toggleTankFields()
		);

		this.form.addEventListener(
			"submit",
			(e)=> this.submitForm(e)
		);
	}



	toggleTankFields(){

		const value = this.tankType.value;

		if(value === "Cylindrical"){

			this.widthFild.classList.add("hide");

			this.lengthFild.classList.add("hide");

			this.dimeaterFild.classList.remove("hide");

		}else{

			this.widthFild.classList.remove("hide");

			this.lengthFild.classList.remove("hide");

			this.dimeaterFild.classList.add("hide");
		}
	}



	async loadTankData(){

		try{

			const res =
			await fetch("/tank-data");

			const json =
			await res.json();

			console.log(json);

			if(!json.success || !json.tank){
				return;
			}

			const tank = json.tank;

			this.form["tankType"].value =
			tank.tankType;

			this.form["measuringUnit"].value =
			tank.measuringUnit;

			this.form["height"].value =
			tank.height || "";

			this.form["width"].value =
			tank.width || "";

			this.form["length"].value =
			tank.length || "";

			this.form["dimeater"].value =
			tank.dimeater || "";

			this.toggleTankFields();

		}catch(err){

			console.log(err);
		}
	}



	async submitForm(e){

		e.preventDefault();

		const tankType =
		this.form["tankType"].value;

		const data = {

			tankType,

			measuringUnit:
			this.form["measuringUnit"].value,

			height:
			this.form["height"].value,

			width:
			tankType === "Rectangular"
			? this.form["width"].value
			: null,

			length:
			tankType === "Rectangular"
			? this.form["length"].value
			: null,

			dimeater:
			tankType === "Cylindrical"
			? this.form["dimeater"].value
			: null
		};

		console.log(data);

		try{

			const res = await fetch(

				"/update-tank",

				{
					method:"POST",

					headers:{
						"Content-Type":"application/json"
					},

					body: JSON.stringify(data)
				}
			);

			const json =
			await res.json();

			console.log(json);

			if(json.success){

				alert(json.message);

			}else{

				alert(json.message);
			}

		}catch(err){

			console.log(err);

			alert("Server Error");
		}
	}
}



new TankSetup();