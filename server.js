var express = require('express');
var app = express();

app.get('**', function (req, res) {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(1234, function () {
  console.log('Example app listening on port 3000!');
});
