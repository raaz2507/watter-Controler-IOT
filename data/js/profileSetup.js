/* profile setup*/

const profileSetupForm = document.forms["profileSetup"];
profileSetupForm.querySelector(".submitBtn").addEventListener("click", (e) => {
	console.log(profileSetupForm["name"].value);
	console.log(profileSetupForm["usrName"].value);
	console.log(profileSetupForm["password"].value);
	console.log(profileSetupForm["rpwd"].value);
});

// app.post("/signup", async (req, res) => {
// 	const { username, password } = req.body;

// 	const hash = await bcrypt.hash(password, 10);

// 	users.push({ username, password: hash });

// 	res.json({ message: "Signup success" });
// });

profileSetupForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const data = {
		username: profileSetupForm.usrName.value,

		password: profileSetupForm.pwd.value,
	};

	const res = await fetch("/signup", {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(data),
	});

	const json = await res.json();

	console.log(json);
});
