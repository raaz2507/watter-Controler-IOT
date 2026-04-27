const express=require("express");

const app=express();

const port = 3000;

app.use(express.static("data"));

app.get("/api/state",(req,res)=>{
res.json({
status:"ok",
temp:27
});
});

app.get("/toggle",(req,res)=>{

const state=req.query.state;

console.log("Switch:",state);

res.json({
received:state
});

});

app.listen(port,()=>{
console.log(`Running \n http://localhost:${port}/`);
});