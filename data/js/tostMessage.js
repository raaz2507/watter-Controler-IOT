export class tosts{
	#container=null;

	constructor(){
		this.#createContainer(); 	
	}
	#createContainer(){
		this.#container = document.createElement("div");
		container.classList.add("toast-container");
		container.id = "toastContainer";
		document.body.append(container);
	}
	async loadMessages(){
		try{
			const res = await fetch("/messages", {
				credentials:"include"
			});

			const data = await res.json();
			console.log(data);


			if(!data.success){
				console.log(data.message);
				return;
			}

			data.messages.forEach((msg,index) => {
				setTimeout(()=>{
					this.createToast(msg.tag, msg.message);
				}, index * 300);
			});

		}catch(err){
			console.log(err);
		}
	}

	createToast(type, text){
		

		// new toast
		const toast = document.createElement("div");
		toast.className = `toast ${type}`;
		toast.innerText = text;
		this.#container.appendChild(toast);
		
		// show animation
		setTimeout(()=>{
			toast.classList.add("show");
		},10);


		// hide
		setTimeout(()=>{
			toast.classList.remove("show");
			toast.classList.add("hide");
			setTimeout(()=>{
				toast.remove();
			},400);
		},3000);
	}
}