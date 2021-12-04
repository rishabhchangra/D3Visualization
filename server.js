// create an express app
const express = require("express")
const path = require("path")
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()



app.use(express.json());
app.use(express.urlencoded());


// use the express-static middleware
app.use(express.static("public"))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});	
// define the first route
app.get("/hello", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

app.get("/bit", (req,res) =>{

})

app.post("/add",(req, res) =>{
codeInfo[req.body.term].description=req.body.description;
codeInfo[req.body.term].difficulty=req.body.difficulty;

  }
)
// start the server listening for requests
let listener = app.listen(process.env.PORT || 3000,
() => console.log(`Server is running...${listener.address().port}`));