const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const compression = require('compression');
const app = express();

app.use(compression());

app.use(express.static(__dirname + '/www'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/www/index.html'));
});

app.listen(port);
console.log(`RUNNING ON PORT ${port}`);
