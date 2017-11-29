var express = require('express');
var app = module.exports = express();
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/blog/:link/:id', function (req, res) {
    res.json({abc: req.param('link'), a: req.param('id')});
});
app.get('/blog/a', function (req, res) {
    // res.json({'abc': req.param('link')});
    res.render('index.ejs');
});