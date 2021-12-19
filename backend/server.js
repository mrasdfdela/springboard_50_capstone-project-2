"use strict";

const app = require("./app");
const { PORT, frontendUri } = require("./config");

app.listen(PORT, function(req,res){
  console.log(`Express server started; ${frontendUri}:${PORT}`);
})