/* profile setup*/

const profileSetupForm = document.forms["profileSetup"];
// profileSetupForm.querySelector(".submitBtn").addEventListener("click", (e) => {
// 	console.log(profileSetupForm["name"].value);
// 	console.log(profileSetupForm["usrName"].value);
// 	console.log(profileSetupForm["password"].value);
// 	console.log(profileSetupForm["rpwd"].value);
// });

// app.post("/signup", async (req, res) => {
// 	const { username, password } = req.body;

// 	const hash = await bcrypt.hash(password, 10);

// 	users.push({ username, password: hash });

// 	res.json({ message: "Signup success" });
// });

// profileSetupForm.addEventListener("submit", async (e) => {
// 	e.preventDefault();
	
// 	const pwd = profileSetupForm["password"].value;
// 	const rpwd = profileSetupForm["rpwd"].value;
// 	if (pwd !== rpwd){
// 		alert("password is not same");
// 		return;
// 	}
// 	const data = {
// 		name: profileSetupForm["name"].value,

// 		username: profileSetupForm["usrName"].value,

// 		password: profileSetupForm["password"].value,
// 	};

// 	const res = await fetch("/signup", {
// 		method: "POST",

// 		headers: {
// 			"Content-Type": "application/json",
// 		},

// 		body: JSON.stringify(data),
// 	});

// 	const json = await res.json();
// 	console.log(json);
// 	if(json.success){

// 		window.location.href=
// 		json.redirect;

// 	} else {
// 		alert( json.error || json.message );
// 	}

	
// });


// current data load
async function loadProfile(){

	const res = await fetch("/profile-data");

	const json = await res.json();

	console.log(json);

	if(json.success){

		profileSetupForm["name"].value =
		json.user.name;

		profileSetupForm["usrName"].value =
		json.user.username;
	}
}

loadProfile();




// update profile
profileSetupForm.addEventListener("submit", async (e) => {

	e.preventDefault();

	const pwd =
	profileSetupForm["password"].value;

	const rpwd =
	profileSetupForm["rpwd"].value;


	if (pwd !== rpwd){
		alert("password not same");
		return;
	}


	const data = {

		name:
		profileSetupForm["name"].value,

		username:
		profileSetupForm["usrName"].value,

		password: pwd
	};


	const res = await fetch("/update-profile", {

		method:"POST",

		headers:{
			"Content-Type":"application/json"
		},

		body: JSON.stringify(data)
	});


	const json = await res.json();

	console.log(json);


	if(json.success){

		alert("Profile Updated");

		window.location.reload();

	} else {

		alert(json.message);
	}
});