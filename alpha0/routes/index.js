var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'RCtajm' });
});
router.get('/results/:race/:heat', function(req, res) {
	var raceNr = req.params.race;
	var heatNr = req.params.heat;
	mongo.connect("mongodb://localhost/rctajm", function(err,db) {
    	if (err) throw err;
		
  		var colRace2 = db.collection("currentrace"+raceNr+"x"+heatNr);
		colRace2.find({}).sort({laps: -1, totalTime: 1}).toArray(function(err,res2) {
            if (err) throw err;
            
            res.render('results', {
            	heatNr: heatNr, 
			  items: res2
			});
        });
	});
});

module.exports = router;
