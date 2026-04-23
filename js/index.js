import {headerNfooter} from "./headerNfooter.js";
import { navBar } from "./navBar.js";
document.addEventListener('DOMContentLoaded', ()=>{
	// Header load
	new headerNfooter();
	new navBar();

	// Password toggle (only if elements exist)
	const password = document.getElementById("pwd");
	const eyeOpen = document.getElementById("eyeOpen");
	const eyeClose = document.getElementById("eyeClose");

	document.getElementById("toggleEye").addEventListener("click", () => {
		if (password.type === "password") {
			password.type = "text";
			eyeOpen.style.display = "none";
			eyeClose.style.display = "block";
		} else {
			password.type = "password";
			eyeOpen.style.display = "block";
			eyeClose.style.display = "none";
		}
	});
} );



