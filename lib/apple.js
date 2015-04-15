var async = require('async');
var request = require("request");

var apple = {};

apple.getRssList = function (req, res) {

	var rssList = [];

	rssList.push({
		category: "test",
		link: "test"
	});

	res.json(rssList);
	//res.send("{'status':'error','message':'didn't give action'}");
};

apple.getTitleList = function (req, res) {
	var rssLink = req.query.link;
	if(typeof(rssLink) === "undefined") {
		res.statusCode = 404;
		return res.send("{'status':'error','message':'didn't give link'}");
	}
	var titleList = [];
	console.log("RSS link is " + rssLink);

	titleList.push({
		title: "test"
	});

	res.json({rssTitle: "category title", titleList: titleList});
}

module.exports = apple;
