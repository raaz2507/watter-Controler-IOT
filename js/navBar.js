const strucher = `
<!--<nav class="mainNav" aria-label="Primary Navigation"> -->

		<ul class="navList">

			<li>
				<a href="./index.html" class="navLink ">
					<span class="navIcon">🏠</span>
					<span>Home</span>
				</a>
			</li>

			<li>
				<a href="./dashbord.html" class="navLink">
					<span class="navIcon">📊</span>
					<span>Dashboard</span>
				</a>
			</li>

			<li>
				<a href="./chars.html" class="navLink">
					<span class="navIcon">📈</span>
					<span>Charts</span>
				</a>
			</li>

			<li>
				<a href="./about.html" class="navLink">
					<span class="navIcon">ℹ️</span>
					<span>About</span>
				</a>
			</li>

		</ul>

	<!--</nav>-->`;

export class navBar{
	constructor(){
		this.#setup();
	}
	#setup(){
		const navElemt = document.querySelector("nav");
		navElemt.classList.add("mainNav");
		navElemt.setAttribute( "aria-label", "Primary Navigation" );
		navElemt.innerHTML = strucher;

		document.querySelectorAll('.navLink').forEach(link=>{
			if(link.href===window.location.href){
				link.classList.add('active');
			}
		});
	}

}