const headerHtml = 
`<div class="titleNicon">
	<span class="appIcon"><img src="./img/logo.png" alt="🐦‍🔥"></span>
	<h1 class="appTitle">Water Tank Controler Dashbord</h1>
</div>
<div class="controls">
	<button id="ThemeBtn" class="roundBtn">🔆</button>
	<div class="userProfile">
		<span class="profileIcon">👤</span>
		<span class="profileTitle">name</span>
	</div>
	<button> Logout</button>
	<!-- <a href="./setupTank.html" class="roundBtn">🛠️</a> -->
</div>`;

const footerHtml = 
`<span>&copy; Developed by Rajaanha</span>`;

const headerTag = document.getElementsByTagName('header')[0];
const footerTag = document.getElementsByTagName('footer')[0];
document.addEventListener("DOMContentLoaded", ()=>{
	
	if (headerTag) headerTag.innerHTML = headerHtml;
	if(footerTag) footerTag.innerHTML = footerHtml;
});