var async = require('async');
var request = require("request");
var request = require('request');
var htmlparser = require("htmlparser2");
var cheerio = require('cheerio');
var util = require('util');

var apple = {};

var appleURL="http://www.appledaily.com.tw";

apple.getRssList = function (req, res) {

	var rssList = [];

	request({
		uri: appleURL + '/rss'
		, headers: {'User-Agent': 'Mozilla/5.0'}}, 
		function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);

				$('.each_level .inst_all li a').each(function(i, element){
					rssList.push({category: $(this).text(), link: $(this).attr("href")});
				});
				res.json(rssList);
			} else {
				res.statusCode = 404;
				res.send("{'status':'error','message':'fail to request'}");
			}
		});
};

apple.getTitleList = function (req, res) {
	var rssLink = req.query.link;
	if(typeof(rssLink) === "undefined") {
		res.statusCode = 404;
		return res.send("{'status':'error','message':'didn't give link'}");
	}
	console.log("RSS link is " + rssLink);

	request({
    	uri: appleURL + rssLink
	    , headers: {'User-Agent': 'Mozilla/5.0'}}, function (error, response, html) {
		    if (!error && response.statusCode == 200) {
				var titleList = [];
				var title;

				var handler = new htmlparser.FeedHandler(function (error, feed) {
				    if (error)
						console.log(err)
				    else {
						console.log(feed.title);
						console.log("There are " + feed.items.length + " items");
						for(var i = 0; i < feed.items.length; i++) {
							console.log(i + " " + feed.items[i].title);
							titleList.push({title: feed.items[i].title});
						}
						title = feed.title;
					}
					res.json({rssTitle: title, titleList: titleList});
				});

				var parser = new htmlparser.Parser( handler, {
					decodeEntities: true,
					xmlMode: true
				});

				parser.write(html);
				parser.end();
		    } else {
				res.send("{'status':'error','message':'fail to request'}");
			}
	});
}

module.exports = apple;
