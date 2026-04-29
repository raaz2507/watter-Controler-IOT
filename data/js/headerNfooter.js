const headerHtml = `<div class="titleNicon">
		<span class="appIcon">
			<img src="./img/logo.png" alt="logo">
		</span>
		<h1 class="appTitle">Water Tank Controller Dashboard</h1>
	</div>

	<div class="controls">

		<button id="ThemeBtn" class="themeBtn" title="Theme">
			🔆
		</button>
		
		<div class="userProfile" id="userProfile">

			<div class="profileAvatar">
				👤
				<span class="statusDot"></span>
			</div>

			<div class="profileInfo">
				<span class="profileLabel">Welcome</span>
				<span class="profileName">Guest</span>
			</div>

			<a href="/login" class="logoutBtn">Login</a>

		</div>

	</div>`;

const footerHtml = `<span>&copy; Developed by 
	<a href="./admin.html">Rajaanha</a>
</span>`;

export class headerNfooter {
	#elemts = {};
	constructor() {
		this.#getElements();
		this.#setEvent();
		this.#themeSetup();
		this.#loadUser();
		this.#bindLogout();
	}
	#getElements() {
		this.#elemts.headerTag = document.getElementsByTagName("header")[0];
		this.#elemts.footerTag = document.getElementsByTagName("footer")[0];
	}
	#setEvent() {
		const { headerTag, footerTag } = this.#elemts;

		if (headerTag && !headerTag.classList.contains("dov")) {
			headerTag.classList.add("appHeader");
			headerTag.innerHTML = headerHtml;
		}

		if (footerTag && !footerTag.classList.contains("dov")) {
			if (footerTag) footerTag.innerHTML = footerHtml;
		}
	}
	// #profileSetup() {
	// 	const userProfile = document.getElementById("userProfile");

	// 	userProfile.addEventListener("click", async () => {
	// 		const res = await fetch("/userProfileUpdate", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				name: "Raj",
	// 				username: "raj",
	// 			}),
	// 		});

	// 		const data = await res.json();

	// 		console.log(data);
	// 	});
	// }
	#themeSetup() {
		const themeBtn = document.getElementById("ThemeBtn");

		(function restoreThemePrefrence() {
			// Check if user previously saved a theme preference
			if (localStorage.getItem("theme") === "darkTheme") {
				document.body.classList.add("darkTheme");
				themeBtn.textContent = "🌙"; // Dark mode icon
			} else {
				document.body.classList.remove("darkTheme");
				themeBtn.textContent = "🔆"; // Light mode icon
			}
		})();

		themeBtn.addEventListener("click", () => {
			// Toggle 'dark' class on <html>
			document.body.classList.toggle("darkTheme");

			// Update Icon and Save preference
			if (document.body.classList.contains("darkTheme")) {
				themeBtn.textContent = "🌙";
				localStorage.setItem("theme", "darkTheme");
			} else {
				themeBtn.textContent = "🔆";
				localStorage.setItem("theme", "lightTheme");
			}
		});
	}
	async #loadUser() {
		const nameEl = document.querySelector(".profileName");

		const authBtn = document.querySelector(".logoutBtn");

		try {
			const res = await fetch("/user");

			const data = await res.json();

			if (data.loggedIn) {
				nameEl.textContent = data.name || data.username;

				authBtn.textContent = "Logout";

				authBtn.href = "/logout";
			} else {
				document.querySelector(".statusDot").style.display = "none";
				nameEl.textContent = "Guest";

				authBtn.textContent = "Login";

				authBtn.href = "/";
			}
		} catch (err) {
			console.log(err);
		}
	}
	async #logout() {
		try {
			const res = await fetch("/logout");
			const data = await res.json();

			if (data.success) {
				window.location.href = data.redirect;
			} else {
				alert(data.message || "Logout failed");
			}
		} catch (err) {
			console.log(err);
			alert("Server error");
		}
	}
	#bindLogout() {
		const btn = document.querySelector(".logoutBtn");

		if (!btn) return;

		btn.addEventListener("click", async (e) => {
			e.preventDefault();

			// if currently login mode
			if (btn.textContent === "Logout") {
				await this.#logout();
			} else {
				window.location.href = "/";
			}
		});
	}
}
