require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const appRoutes= require("./routes/appRoutes");


const app = express();

const port = 3000;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log( `output ${process.env.SESSION_SECRET}` );
app.use(session({ 
	secret :process.env.SESSION_SECRET, 
			resave:false, 
			saveUninitialized:false, 
			cookie:{ maxAge:1000*60*60 } 
		}));

// static folder
app.use(express.static(path.join(__dirname, "data")));


// routes load
app.use("/",authRoutes);
app.use("/", deviceRoutes );
app.use( "/", appRoutes );

app.listen(port, () => {
	console.log(`Running \nhttp://localhost:${port}/`);
});
