const { response } = require("express");
const express = require("express");
// const cors = require("cors");

const authRoutes = require("./routes/auth");
const app = express();

app.use("/auth", authRoutes);

app.get('/', function(req,res){
  return res.send('Hello World!');
});

app.listen(3001, function (req, res) {
  console.log("App backend on port 3001");
});