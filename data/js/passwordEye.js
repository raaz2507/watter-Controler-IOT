export class PasswordEye{
	static init(){
		this.#elemts();
		this.#event();
		this.#addCSS();
	}
	static #elemts(){
		const pwdInputs = document.querySelectorAll('input[type="password"]');
		pwdInputs.forEach((pwdInput)=>{
			if(pwdInput.parentNode.classList.contains("passwordField")){
				return;
			}

			const passwordField = document.createElement("div");
			passwordField.classList.add("passwordField");

			
			const parent = pwdInput.parentNode;

			const eyeContainer = document.createElement("span");
			eyeContainer.classList.add("toggleEye");	
			
			
			const img= document.createElement("img");
			img.alt = "eye";
			img.src = "../img/eyeClose.svg";

			eyeContainer.append(img);

			parent.insertBefore(passwordField, pwdInput);

			passwordField.append(pwdInput, eyeContainer);
		});
	}
	static #event(){
		// const eye = document.querySelector(".toggleEye img");
		// document.querySelector(".toggleEye").addEventListener("click", function() {
		// 	if (password.type === "password") {
		// 		password.type = "text";
		// 		eye.src = "./img/eyeOpen.svg";
		// 	} else {
		// 		password.type = "password";
		// 		eye.src = "./img/eyeClose.svg";
		// 	}
		// });
		document.addEventListener( "click", (e)=>{ 
			const eye = e.target.closest(".toggleEye");
			if(!eye) return;
			const wrapper = eye.closest(".passwordField");
			const password = wrapper.querySelector( 'input' );
			const img = eye.querySelector("img");
			if(password.type === "password"){ 
				password.type = "text";
				img.src = "./img/eyeOpen.svg";
			}else{
				password.type = "password";
				img.src = "./img/eyeClose.svg"; 
			} 
		});

	}

	static #addCSS(){
		let toggleEyeStyle = document.querySelector(".toggleEyeStyle");
		if (toggleEyeStyle) return ;
		toggleEyeStyle = document.createElement("style");
		toggleEyeStyle.classList.add("toggleEyeStyle");
		toggleEyeStyle.innerHTML = `
.passwordField {
	position: relative;
}
.passwordField input {
	width: 100%;
	padding-right: 40px; /* icon ke liye space */
	display: flex;
	align-items: center;
	justify-content: center;
}
/* eye icon */

.toggleEye {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	width: 25px;
	
	cursor: pointer;
}
.toggleEye svg {
	width: 100%;
}`;
		document.head.append(toggleEyeStyle);
	}
}


