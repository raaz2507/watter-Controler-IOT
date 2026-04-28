import { headerNfooter } from "./headerNfooter.js";
import { navBar } from "./navBar.js";

document.addEventListener("DOMContentLoaded", () => {
	// Header load
	new headerNfooter();
	new navBar();
});

const eyeOpen = document.getElementById("eyeOpen");
const eyeClose = document.getElementById("eyeClose");

document
	.getElementsByClassName("toggleEye")[0]
	.addEventListener("click", () => {
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

const loginForm = document.forms["loginForm"];

const username = loginForm["username"];
const password = loginForm["password"];

const loginBtn = loginForm["login"];
const singup = loginForm["singup"];


// loginForm.addEventListener("submit", async function (e) {
// 	e.preventDefault();

// 	const formData = new FormData(this);

// 	const res = await fetch("/login", {
// 		method: "POST",
// 		body: formData,
// 	});

// 	const data = await res.json();

// 	if (data.success) {
// 		window.location.href = data.redirect;
// 	} else {
// 		alert(data.error || data.message);
// 	}
// });
loginForm.addEventListener("submit", async function (e) {
	e.preventDefault();

	const res = await fetch("/login", {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			username: loginForm.username.value,

			password: loginForm.password.value,
		}),
	});

	const data = await res.json();

	if (data.success) {
		window.location.href = data.redirect;
	} else {
		alert(data.error || data.message);
	}
});
