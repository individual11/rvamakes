var mongoose = require('mongoose');
var Creative = mongoose.model('Creative');

var queryFields = "name img url tags";

exports.index = function (req, res) {
    Creative.find(
        queryFields,
        function (err, creative) {
            res.json(creative);
        });
};

exports.show = function (req, res) {
    var id = req.params['id'];
    console.log(id);
    Creative.findById(id, queryFields, function (err, creative) {
        res.json(creative);
    });
};

exports.create = function (req, res, next) {
    console.log(req.body);
    //console.log(req.files);

    var creative = req.body;
    creative.img = "http://placehold.it/225x200&text=" + creative.name.replace(/ /g,'+');
    creative.create_at = Date.now();

    new Creative(creative).save(function (err, creative, count) {
        if (err) return next(err);
        res.set('Content-Type', 'text/plain');
        res.send(creative);
    });

};

exports.delete = function (req, res, next) {
    var id = req.params[id];
    Creative.findByIdAndRemove(id, function (err) {
        if (err) res.status(500);
        res.status(200)
    });
}

exports.reset = function (req, res, next) {
    Creative.remove(function (err) {
        if (err) res.status(500);
        res.status(200)
    });
}