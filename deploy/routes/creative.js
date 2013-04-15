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
    var id = req.params[0];
    Creative.findById(id, queryFields, function (err, creative) {
        res.json(creative);
    });
};

exports.create = function (req, res, next) {
    new Creative({
        name: req.body.name,
        email: req.body.email,
        img: req.body.img,
        url: req.body.url,
        tags: req.body.tags.split(','),
        created_at: Date.now()
    }).save(function (err, creative, count) {
            if (err) return next(err);
            res.json(creative);
        });
};

exports.delete = function (req, res, next) {
    var id = req.params[0];
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