const headerHtml = 
`<div class="titleNicon">
		<span class="appIcon">
			<img src="./img/logo.png" alt="logo">
		</span>
		<h1 class="appTitle">Water Tank Controller Dashboard</h1>
	</div>

	<div class="controls">

		<button id="ThemeBtn" class="themeBtn" title="Theme">
			🔆
		</button>
		
		<div class="userProfile">

			<div class="profileAvatar">
				👤
				<span class="statusDot"></span>
			</div>

			<div class="profileInfo">
				<span class="profileLabel">Welcome</span>
				<span class="profileName">Raj</span>
			</div>

			<button class="logoutBtn">
				Logout
			</button>

		</div>

	</div>`;

const footerHtml = 
`<span>&copy; Developed by 
	<a href="./admin.html">Rajaanha</a>
</span>`;



export class headerNfooter{
	#elemts ={};
	constructor(){
		this.#getElements();
		this.#setEvent();
		this.#themeSetup();
	}
	#getElements(){
		this.#elemts.headerTag = document.getElementsByTagName('header')[0];
		this.#elemts.footerTag = document.getElementsByTagName('footer')[0];
	}
	#setEvent(){
		const {headerTag, footerTag}=this.#elemts;

		if (headerTag && !headerTag.classList.contains('dov')){
			headerTag.classList.add('appHeader');
			headerTag.innerHTML = headerHtml;
		}

		if (footerTag && !footerTag.classList.contains('dov')){
			if(footerTag) footerTag.innerHTML = footerHtml;
		}
	}
	#themeSetup(){
		const themeBtn = document.getElementById("ThemeBtn");


		(function restoreThemePrefrence(){
			// Check if user previously saved a theme preference
			if (localStorage.getItem('theme') === 'darkTheme') {
				document.body.classList.add('darkTheme');
				themeBtn.textContent = '🌙'; // Dark mode icon
			} else {
				document.body.classList.remove('darkTheme');
				themeBtn.textContent = '🔆'; // Light mode icon
			}
		})();

		themeBtn.addEventListener('click', () => {
			// Toggle 'dark' class on <html>
			document.body.classList.toggle('darkTheme');

			// Update Icon and Save preference
			if (document.body.classList.contains('darkTheme')) {
				themeBtn.textContent = '🌙';
				localStorage.setItem('theme', 'darkTheme');
			} else {
				themeBtn.textContent = '🔆';
				localStorage.setItem('theme', 'lightTheme');
			}
		});
	}
}