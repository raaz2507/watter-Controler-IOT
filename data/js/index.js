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


function validateLogin() {
  const username = document.forms["loginForm"]["username"].value;
  const password = document.forms["loginForm"]["password"].value;

  if (!username || !password) {
    alert("Username or Password is missing");
    return false;
  }

  if (password.length < 4) {
    alert("Password require minimum 4 characters ");
    return false;
  }

  return true;
}

document.loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const res = await fetch("/login", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = data.redirect;
  } else {
    alert(data.message);
  }
});

