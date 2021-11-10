"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, function(req,res){
  console.log(`Express server started; http://localhost:${PORT}`)
})