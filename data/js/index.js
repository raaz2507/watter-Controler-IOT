import {headerNfooter} from "./headerNfooter.js";
import { navBar } from "./navBar.js";

const loginForm =  document.forms["loginForm"];

const username = loginForm["username"];
const password = loginForm["pwd"];

const eyeOpen = document.getElementById("eyeOpen");
const eyeClose = document.getElementById("eyeClose");

const loginBtn = loginForm["login"];
const singup = loginForm["singup"];

document.addEventListener('DOMContentLoaded', ()=>{
	// Header load
	new headerNfooter();
	new navBar();
	toglePasswordShow();
	
} );

loginForm.addEventListener("submit", (e)=>{
	checkLogin(e);
});
// loginBtn.addEventListener("click", (e)=>{
// 	checkLogin(e);
// });

function checkLogin(e){
	e.preventDefault();
	console.log(username.value);
	console.log(password.value);
}
function toglePasswordShow(){
	
	document.getElementsByClassName("toggleEye")[0].addEventListener("click", () => {
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
}



