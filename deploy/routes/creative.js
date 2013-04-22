// twitter jams
var Twitter = require('node-twitter'),
	twitterConfig = require('../config/twitter.js'),
	twitter = new Twitter.RestClient(twitterConfig.consumerKey, twitterConfig.consumerSecret, twitterConfig.token, twitterConfig.tokenSecret);

 // other requirementzs
var AWS = require('aws-sdk'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    Creative = mongoose.model('Creative');

// configs
var queryFields = "name img url tags",
    twitterStarters = ["Added ", "Just added ", "New "];

// load AWS config
AWS.config.loadFromPath('./config/aws.json');

// GET /
exports.index = function (req, res) {
    Creative.find(
        queryFields,
        function (err, creative) {
            res.json(creative);
        });
};

//  GET /:id
exports.show = function (req, res) {
    var id = req.params['id'];
    console.log(id);
    Creative.findById(id, queryFields, function (err, creative) {
        res.json(creative);
    });
};

// POST /
exports.create = function (req, res, next) {
    var img = req.files.img;
    var filePathSegs = img.path.split('/');
    var fileNameSegs = img.name.split('.');
    var filename = filePathSegs[filePathSegs.length - 1] + '.' + fileNameSegs[fileNameSegs.length - 1];
    var bucket = 'rvamakes';
    var s3URI = 'https://s3.amazonaws.com/'+bucket+'/';

    var creative = req.body;
    creative.img = s3URI+filename;
    creative.create_at = Date.now();

    var s3 = new AWS.S3();

    fs.readFile(img.path, function (err, data) {
        if (err) {
            console.warn("file read", err);
        }
        else {
            s3.client.putObject({
                Bucket: bucket,
                Key: filename,
                Body: data,
                ContentType: img.type,
                ACL: 'public-read'

            }, function (err, data) {
                if (err) {
                    console.warn("s3 fail", err);
                    res.status(response.httpResponse.statusCode).end(JSON.stringify(({err: response})));
                }
                else {
                    new Creative(creative).save(function (err, creative, count) {
                        if (err) return next(err);
                        
                        //tweet about it
                        var tweet = twitterStarters[Math.floor(Math.random() * twitterStarters.length)];//pick random beginning to feel more natural
                        tweet += creative.tags.join("/");
                        tweet += " " + creative.name;
                        tweet += " http://rvamakes.com/#/show/" + String(creative._id);
                        
                        //send tweet if in appropriate env
                        if (process.env.NODE_ENV == 'production') postToTwitter(tweet);
                        
                        res.set('Content-Type', 'text/plain'); // old IE hack... sad =(
                        res.send(creative);
                    });
                }
            });
        }
    });
};

// DELETE /:id
exports.delete = function (req, res, next) {
    var id = req.params['id'];
    Creative.findByIdAndRemove(id, function (err) {
        if (err) res.status(500);
        res.status(200)
    });
}

//----- PRIVATE -------//
function postToTwitter(status){
	
	twitter.statusesUpdate(
	    {
	        'status': status
	    },
	    function(error, result) {
	        if (error){
	            console.log('### TWITTER Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
	        }
	
	        if (result){
	        	console.log('### TWEET SUCCESFUL');
	            //console.log(result);
	        }
	});
}
